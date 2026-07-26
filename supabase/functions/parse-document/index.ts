// ─── IMPORTS ─────────────────────────────────────────────────────────────────
// External tools this file depends on:
//   @supabase/functions-js  — VS Code error suppression only (see comment below)
//   @supabase/server        — connects this function to the Supabase database
//   database.types.ts       — the shape of every table in our Supabase database
//   @aws-sdk/client-s3      — lets us upload/delete files in the AWS S3 bucket
//   @aws-sdk/client-textract — lets us send PDFs to AWS Textract for reading

// Stops red errors in VS Code. Does not do anything when the function actually runs.
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import type { Database } from "./database.types.ts";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { GetDocumentTextDetectionCommand, StartDocumentTextDetectionCommand, TextractClient } from "@aws-sdk/client-textract";
import Anthropic from "@anthropic-ai/sdk";

// ─── SECTION 1: WHAT WE'RE EXTRACTING ────────────────────────────────────────
// Blueprint of the fields we want from every contract.
// "string | null" means we might not find it — and that's okay, we still save what we can.
interface ContractFields {
  startDate: string | null;
  endDate: string | null;
  contractTermLength: string | null;
  haulerName: string | null;
  pickupFrequency: string | null;
  basePrice: string | null;
  fees: {
    fuelSurcharge: string | null;
    environmentalFee: string | null;
    adminFee: string | null;
    deliveryFee: string | null;
    extraPickupFee: string | null;
  };
  containerSize: string | null;
  containerType: string | null;
  wasteStreams: string | null;
  serviceAddress: string | null;
  rateIncrease: string | null;
  cancellationNoticePeriod: string | null;
  autoRenewal: string | null;
}

// ─── SECTION 2: CLAUDE EXTRACTION PROMPT ─────────────────────────────────────
// After Textract reads all the text out of the PDF, this prompt is sent to Claude
// (Haiku) along with the full contract text. Claude returns a JSON object with all
// 12 fields filled in based on what it reads from the contract.

const EXTRACTION_PROMPT = `You are a contract data extraction specialist. Read this waste management service contract and extract the following fields. Return ONLY a valid JSON object with no other text, explanation, or markdown.

Fields to extract:
- start_date: Contract start or effective date as written (e.g. "5/1/2023"), null if not found
- end_date: Contract expiration or end date as written, null if not explicitly stated as a date
- term_length: Initial contract term length as written (e.g. "36 months", "1 year"), null if not found
- hauler_name: Full legal name of the waste collection company, null if not found
- pickup_frequency: How often waste is collected (e.g. "2x per week", "weekly"), null if not found
- base_price: Monthly base rate or service charge with dollar sign (e.g. "$166.00"), null if not found
- container_size: Size of the waste container (e.g. "2 Yard", "8 Yard FEL"), null if not found
- container_type: Mechanism type — "FEL" (front-end loader), "REL" (rear-end loader), "Compactor", "Cart", or "Roll-off", null if not specified
- waste_streams: What is collected — "Trash", "Recycling", or "Both", null if unclear
- service_address: Full street address of the service location as written (e.g. "123 Main St, Chicago, IL 60601"), null if not found
- fuel_surcharge: Fuel surcharge, energy surcharge, or fuel recovery fee with dollar sign or %, null if not found
- environmental_fee: Environmental fee or recovery fee with dollar sign or %, null if not found
- admin_fee: Administrative or admin fee with dollar sign, null if not found
- delivery_fee: One-time delivery or container set-up fee with dollar sign, null if not found
- extra_pickup_fee: Fee for an on-demand or extra pickup beyond the normal schedule, with dollar sign, null if not found
- rate_increase: Annual or periodic rate escalation clause as written (e.g. "3% per year", "CPI + 2%"), null if none specified
- cancellation_notice: Notice period required to cancel or not renew (e.g. "30 days", "90 days"), null if not found
- auto_renewal: "Yes" if contract auto-renews at end of term, "No" if it does not, null if unclear

IMPORTANT — GRID/TABLE FORMAT CONTRACTS:
Many contracts use a grid where column headers appear as a vertical list (e.g. "Qty.", "Size", "Freq.", "Effective Date", "Base Rate") followed immediately by the data values in the same order. Match headers to values by their position in this sequence. For example, if "Effective Date" is the 13th header and a date like "1/1/2024" is the 13th value below, that date is the start_date.

FIELD-SPECIFIC GUIDANCE:
- start_date: "Effective Date" in a grid table is the service start date. Also look for "DATE WHEN SERVICE COMMENCES."
- hauler_name: Look for "[Company Name] HEREINAFTER REFERRED TO AS THE 'COMPANY'" or a company name at the top (e.g. "LRS" = Lakeshore Recycling Systems). Also check the signature block for the company's printed name.
- container_size: A bare number like "8.00" or "6.00" in a grid after a "Size" header means yards — render as "8 Yard" or "6 Yard". "4.0 Yd(s)" means "4 Yard".
- container_type: If container_size already contains FEL or REL (e.g. "2 Yard FEL"), derive container_type from that. "Front load" = FEL, "Rear load" = REL.
- waste_streams: Look for "refuse", "trash", "garbage" (= Trash), "recycling", "commingled recyclables" (= Recycling), or both mentioned.
- pickup_frequency: "4X/WK", "3/ 1/W", "2xPer Week", "1XW" all mean times per week. Normalize to e.g. "4x per week".
- fuel_surcharge / environmental_fee / admin_fee: If the contract explicitly states these are "No" or "Exempt", return null. Only return a value if an actual dollar amount or percentage is specified.
- rate_increase: Look for "Annual Rate Adjustment", "CPI", "escalation clause", "rate cap", or a fixed % increase. Return null if the contract has no rate increase provision.
- If the PDF contains multiple agreements for different locations, extract from the FIRST complete agreement.

CONTRACT TEXT:
`;

interface AwsConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
}

// ─── SECTION 3: AWS CREDENTIALS ──────────────────────────────────────────────
// Reads the 4 secret values stored in Supabase (Access Key, Secret, Region, Bucket).
// If any are missing the whole function stops immediately — it can't run without them.
function getAwsConfig(): AwsConfig {
  const accessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID");
  const secretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
  const region = Deno.env.get("AWS_REGION");
  const bucket = Deno.env.get("AWS_TEXTRACT_BUCKET");
  if (!accessKeyId || !secretAccessKey || !region || !bucket) {
    throw new Error(
      "AWS is not configured (need AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_TEXTRACT_BUCKET)",
    );
  }
  return { accessKeyId, secretAccessKey, region, bucket };
}

function s3Client(config: AwsConfig): S3Client {
  return new S3Client({
    region: config.region,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
  });
}

function textractClient(config: AwsConfig): TextractClient {
  return new TextractClient({
    region: config.region,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
  });
}

// ─── SECTION 4: S3 STAGING ───────────────────────────────────────────────────
// Textract can't accept a raw file — it needs the file already sitting in S3 (Amazon's
// file storage). We upload it there temporarily, Textract reads it, then we delete it.
// The permanent copy is uploaded to Supabase storage separately later.
async function uploadStagingCopy(config: AwsConfig, bytes: Uint8Array, key: string): Promise<void> {
  await s3Client(config).send(
    new PutObjectCommand({ Bucket: config.bucket, Key: key, Body: bytes, ContentType: "application/pdf" }),
  );
}

async function deleteStagingCopy(config: AwsConfig, key: string): Promise<void> {
  await s3Client(config).send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
}

// ─── SECTION 5: TEXTRACT TEXT EXTRACTION ─────────────────────────────────────
// Uploads the PDF to S3, asks Textract to read every word out of it (text-only mode —
// no questions, just read), then joins all the lines into one big string.
// That string is what gets sent to Claude in the next step.
async function extractContractText(config: AwsConfig, key: string): Promise<string> {
  const textract = textractClient(config);

  const start = await textract.send(
    new StartDocumentTextDetectionCommand({
      DocumentLocation: { S3Object: { Bucket: config.bucket, Name: key } },
    }),
  );
  const jobId = start.JobId;
  if (!jobId) throw new Error("Textract did not return a JobId");

  const POLL_INTERVAL_MS = 2000;
  const MAX_ATTEMPTS = 60;
  let status = "IN_PROGRESS";
  for (let attempt = 0; attempt < MAX_ATTEMPTS && status === "IN_PROGRESS"; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    const check = await textract.send(new GetDocumentTextDetectionCommand({ JobId: jobId }));
    status = check.JobStatus ?? "IN_PROGRESS";
  }
  if (status !== "SUCCEEDED" && status !== "PARTIAL_SUCCESS") {
    throw new Error(`Textract job did not complete successfully (status: ${status})`);
  }

  const lines: string[] = [];
  let nextToken: string | undefined;
  do {
    const page = await textract.send(new GetDocumentTextDetectionCommand({ JobId: jobId, NextToken: nextToken }));
    for (const block of page.Blocks ?? []) {
      if (block.BlockType === "LINE" && block.Text) lines.push(block.Text);
    }
    nextToken = page.NextToken;
  } while (nextToken);

  return lines.join("\n");
}

// ─── SECTION 6: FIELD EXTRACTION FROM TEXT ───────────────────────────────────
// Sends the raw Textract text to Claude (Haiku) with the extraction prompt and
// maps the returned snake_case JSON keys to the ContractFields camelCase shape.
async function extractFieldsWithClaude(contractText: string): Promise<ContractFields> {
  // ─── TO SWAP IN YOUR OWN CLAUDE ACCOUNT ──────────────────────────────────
  // 1. Go to console.anthropic.com → API Keys → Create Key
  // 2. In Supabase Dashboard → Project Settings → Edge Functions → Secrets,
  //    update ANTHROPIC_API_KEY with your new key.
  // 3. To use a different model, change the "model" value below.
  //    Current options: "claude-haiku-4-5-20251001" (fast/cheap),
  //    "claude-sonnet-5" (more accurate), "claude-opus-4-8" (most capable).
  // ─────────────────────────────────────────────────────────────────────────
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");
  const anthropic = new Anthropic({ apiKey });
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: EXTRACTION_PROMPT + contractText }],
  });
  const raw = message.content[0].type === "text" ? message.content[0].text : "{}";
  const cleaned = raw.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
  const data = JSON.parse(cleaned);
  return {
    startDate: data.start_date ?? null,
    endDate: data.end_date ?? null,
    contractTermLength: data.term_length ?? null,
    haulerName: data.hauler_name ?? null,
    pickupFrequency: data.pickup_frequency ?? null,
    basePrice: data.base_price ?? null,
    fees: {
      fuelSurcharge: data.fuel_surcharge ?? null,
      environmentalFee: data.environmental_fee ?? null,
      adminFee: data.admin_fee ?? null,
      deliveryFee: data.delivery_fee ?? null,
      extraPickupFee: data.extra_pickup_fee ?? null,
    },
    containerSize: data.container_size ?? null,
    containerType: data.container_type ?? null,
    wasteStreams: data.waste_streams ?? null,
    serviceAddress: data.service_address ?? null,
    rateIncrease: data.rate_increase ?? null,
    cancellationNoticePeriod: data.cancellation_notice ?? null,
    autoRenewal: data.auto_renewal ?? null,
  };
}

// ─── SECTION 7: FORMAT CONVERTERS ────────────────────────────────────────────
// Textract gives us answers as plain text (e.g. "6/15/2022" or "$166.00").
// The database expects specific formats, so we convert them:
//   parseDateToISO("6/15/2022")        → "2022-06-15"   (standard date format)
//   parseCurrencyToNumber("$166.00")   → 166.00          (number, no $ sign)
//   parseFrequencyPerWeek("2x weekly") → 2               (pickups per week as a number)
// sha256Hex creates a unique fingerprint of the file to prevent saving duplicate contracts.

async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes as BufferSource);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function parseDateToISO(value: string | null): string | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const slash = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (slash) {
    const [, m, d, yRaw] = slash;
    const y = yRaw.length === 2 ? `20${yRaw}` : yRaw;
    return `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }

  const parsed = new Date(value); // handles "January 1, 2024"
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString().slice(0, 10);
}

function parseCurrencyToNumber(value: string | null): number | null {
  if (!value) return null;
  const numeric = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isNaN(numeric) ? null : numeric;
}

function parseFrequencyPerWeek(value: string | null): number | null {
  if (!value) return null;
  const lower = value.toLowerCase();
  const leadingDigit = lower.match(/^(\d+(?:\.\d+)?)/);
  if (leadingDigit) return Number.parseFloat(leadingDigit[1]);
  if (lower.includes("bi-weekly") || lower.includes("biweekly")) return 0.5;
  if (lower.includes("daily")) return 7;
  if (lower.includes("weekly")) return 1;
  if (lower.includes("monthly")) return 0.25;
  return null;
}

// ─── SECTION 8: THE MAIN HANDLER ─────────────────────────────────────────────
// This is the entry point — what runs when someone sends a PDF to this function.
// It validates the request (must be a POST, must have a PDF file and a client name),
// then kicks off the Textract reading process above.
// "publishable" and "secret" means this endpoint accepts both types of API keys.
const DOCUMENTS_BUCKET = "documents";
const ORGANIZATION_NAME = "EvE Waste";

export default {
  fetch: withSupabase<Database>({ auth: ["publishable", "secret"] }, async (req, ctx) => {
    if (req.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return Response.json(
        { error: "Expected multipart/form-data with a 'file' field" },
        { status: 400 },
      );
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return Response.json({ error: "Missing 'file' field in form data" }, { status: 400 });
    }

    const looksLikePdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!looksLikePdf) {
      return Response.json({ error: "Uploaded file must be a PDF" }, { status: 400 });
    }

    // Every contract belongs to a client (e.g. "Washington Halsted Commercial LLC"). There's no
    // account-management UI yet to create clients ahead of time, so the first contract for a
    // new client name creates that client (and a default site) automatically.
    const clientNameRaw = formData.get("client_name");
    if (typeof clientNameRaw !== "string" || !clientNameRaw.trim()) {
      return Response.json({ error: "Missing 'client_name' field in form data" }, { status: 400 });
    }
    const clientName = clientNameRaw.trim();

    const fileBytes = new Uint8Array(await file.arrayBuffer());

    let fields: ContractFields;
    try {
      const awsConfig = getAwsConfig();
      const stagingKey = `${crypto.randomUUID()}-${file.name}`;
      try {
        await uploadStagingCopy(awsConfig, fileBytes, stagingKey);
        const contractText = await extractContractText(awsConfig, stagingKey);
        fields = await extractFieldsWithClaude(contractText);
      } finally {
        // Clean up the staging copy regardless of success/failure — it's not the permanent copy
        // (that's the separate upload to the "documents" bucket below).
        await deleteStagingCopy(awsConfig, stagingKey).catch((error) =>
          console.error("Failed to delete Textract staging file:", error)
        );
      }
    } catch (error) {
      console.error("Contract extraction failed:", error);
      return Response.json({ error: "Failed to extract contract data" }, { status: 422 });
    }

    // ─── SECTION 9: SAVE TO DATABASE (9 STEPS IN ORDER) ─────────────────────
    // 1. Find or create the "EvE Waste" organization record
    // 2. Find or create the client by name (e.g. "112 Sangamon LLC")
    // 3. Auto-create a default site for any brand-new client
    // 4. Upload the PDF permanently to Supabase storage
    // 5. Save a raw_files record (logs the file + its duplicate-prevention fingerprint)
    // 6. Save the contract (start date, end date) → only if we found a start date
    // 7. Save the service (base price, pickup frequency) → contract_services table
    // 8. Save the fees (fuel, environmental, admin) → contract_fees table
    // 9. Save the clauses (term length, cancellation, auto-renewal) → contract_clauses table
    // A failure in any step doesn't wipe the extraction — fields are always returned.
    // Persist the file and the structured fields. A failure partway through doesn't invalidate
    // the extraction itself — the response always includes `fields`; `saved` describes how far
    // the structured save actually got.
    const saved = { rawFile: false, contract: false, clientCreated: false };
    let contractId: string | null = null;

    try {
      const { data: org, error: orgSelectError } = await ctx.supabaseAdmin
        .from("organizations")
        .select("id")
        .eq("name", ORGANIZATION_NAME)
        .maybeSingle();
      if (orgSelectError) throw orgSelectError;

      let organizationId = org?.id;
      if (!organizationId) {
        const { data: newOrg, error: orgInsertError } = await ctx.supabaseAdmin
          .from("organizations")
          .insert({ name: ORGANIZATION_NAME })
          .select("id")
          .single();
        if (orgInsertError || !newOrg) throw orgInsertError ?? new Error("Failed to create organization");
        organizationId = newOrg.id;
      }

      const { data: existingClient, error: clientSelectError } = await ctx.supabaseAdmin
        .from("clients")
        .select("id")
        .eq("organization_id", organizationId)
        .eq("name", clientName)
        .maybeSingle();
      if (clientSelectError) throw clientSelectError;

      let clientId = existingClient?.id;
      if (!clientId) {
        const { data: newClient, error: clientInsertError } = await ctx.supabaseAdmin
          .from("clients")
          .insert({ organization_id: organizationId, name: clientName })
          .select("id")
          .single();
        if (clientInsertError || !newClient) throw clientInsertError ?? new Error("Failed to create client");
        clientId = newClient.id;
        saved.clientCreated = true;

        const { error: siteInsertError } = await ctx.supabaseAdmin.from("sites").insert({
          organization_id: organizationId,
          client_id: clientId,
          name: `${clientName} - Primary Site`,
          address: fields.serviceAddress ?? null,
        });
        if (siteInsertError) console.error("Failed to create default site:", siteInsertError);
      }

      const storagePath = `${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await ctx.supabaseAdmin.storage
        .from(DOCUMENTS_BUCKET)
        .upload(storagePath, file, { contentType: "application/pdf" });
      if (uploadError) throw uploadError;

      const { data: rawFile, error: rawFileError } = await ctx.supabaseAdmin
        .from("raw_files")
        .insert({
          organization_id: organizationId,
          client_id: clientId,
          kind: "contract",
          mime_type: "application/pdf",
          byte_size: file.size,
          sha256_hex: await sha256Hex(fileBytes),
          storage_bucket: DOCUMENTS_BUCKET,
          storage_path: storagePath,
        })
        .select("id")
        .single();
      if (rawFileError || !rawFile) throw rawFileError ?? new Error("Failed to save raw file record");
      saved.rawFile = true;

      // contracts.valid_from is required. If we couldn't find a start date, there's nothing
      // honest to put there, so the structured contract record is skipped — the raw file and
      // extracted fields are still saved/returned either way.
      const validFrom = parseDateToISO(fields.startDate);
      if (validFrom) {
        const { data: contract, error: contractError } = await ctx.supabaseAdmin
          .from("contracts")
          .insert({
            organization_id: organizationId,
            client_id: clientId,
            source_file_id: rawFile.id,
            valid_from: validFrom,
            valid_to: parseDateToISO(fields.endDate),
            hauler_name: fields.haulerName,
          })
          .select("id")
          .single();
        if (contractError || !contract) throw contractError ?? new Error("Failed to create contract");
        contractId = contract.id;
        saved.contract = true;

        const baseRate = parseCurrencyToNumber(fields.basePrice);
        if (baseRate !== null) {
          const serviceName = fields.wasteStreams
            ? `${fields.wasteStreams} Collection`
            : "Waste Collection";
          const { error } = await ctx.supabaseAdmin.from("contract_services").insert({
            organization_id: organizationId,
            contract_id: contractId,
            service_name: serviceName,
            base_rate: baseRate,
            frequency_per_week: parseFrequencyPerWeek(fields.pickupFrequency),
            container_size: fields.containerSize,
          });
          if (error) console.error("Failed to save contract service:", error);
        }

        const fees: [string, string | null][] = [
          ["fuel_surcharge", fields.fees.fuelSurcharge],
          ["environmental_fee", fields.fees.environmentalFee],
          ["admin_fee", fields.fees.adminFee],
          ["delivery_fee", fields.fees.deliveryFee],
          ["extra_pickup_fee", fields.fees.extraPickupFee],
        ];
        for (const [feeType, rawValue] of fees) {
          const amount = parseCurrencyToNumber(rawValue);
          if (amount === null) continue;
          const { error } = await ctx.supabaseAdmin.from("contract_fees").insert({
            organization_id: organizationId,
            contract_id: contractId,
            fee_type: feeType,
            amount,
            is_percentage: !!rawValue?.includes("%"),
          });
          if (error) console.error(`Failed to save fee (${feeType}):`, error);
        }

        const clauses: [string, string | null][] = [
          ["term_length", fields.contractTermLength],
          ["cancellation_notice", fields.cancellationNoticePeriod],
          ["auto_renewal", fields.autoRenewal],
          ["rate_increase", fields.rateIncrease],
          ["container_type", fields.containerType],
        ];
        for (const [clauseType, clauseText] of clauses) {
          if (!clauseText) continue;
          const { error } = await ctx.supabaseAdmin.from("contract_clauses").insert({
            organization_id: organizationId,
            contract_id: contractId,
            clause_type: clauseType,
            clause_text: clauseText,
          });
          if (error) console.error(`Failed to save clause (${clauseType}):`, error);
        }
      }
    } catch (error) {
      console.error("Failed to save structured contract data:", error);
    }

    return Response.json({ source: "claude", fields, saved, contractId });
  }),
};

/* To invoke locally:

  1. Set the AWS credentials (see the IAM policy + S3 bucket setup steps from project notes):
     supabase secrets set AWS_ACCESS_KEY_ID=<key> AWS_SECRET_ACCESS_KEY=<secret> AWS_REGION=<region> AWS_TEXTRACT_BUCKET=<bucket>
  2. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  3. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/parse-document' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
    --form 'file=@/path/to/contract.pdf;type=application/pdf' \
    --form 'client_name=Acme Properties LLC'

*/
