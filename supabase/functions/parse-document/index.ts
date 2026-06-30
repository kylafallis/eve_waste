// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import type { Database } from "./database.types.ts";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  type Block,
  GetDocumentAnalysisCommand,
  StartDocumentAnalysisCommand,
  TextractClient,
} from "@aws-sdk/client-textract";

console.log("Hello from Functions!");

// ─── SECTION 1: WHAT WE'RE EXTRACTING ────────────────────────────────────────
// Blueprint of the 11 fields we want from every contract.
// "string | null" means we might not find it — and that's okay, we still save what we can.
interface ContractFields {
  startDate: string | null;
  endDate: string | null;
  contractTermLength: string | null;
  pickupFrequency: string | null;
  basePrice: string | null;
  fees: {
    fuelSurcharge: string | null;
    environmentalFee: string | null;
    adminFee: string | null;
  };
  containerSize: string | null;
  cancellationNoticePeriod: string | null;
  autoRenewal: string | null;
}

// ─── SECTION 2: THE 11 QUESTIONS WE ASK TEXTRACT ────────────────────────────
// Instead of searching for patterns like the old regex did, we send Textract a plain-English
// question for each field. Textract reads the whole document and finds the best answer —
// even if it's buried in a table or split across columns. The "Alias" is just a short
// nickname we use to look up each answer in code (instead of repeating the full question).
const TEXTRACT_QUERIES: { Text: string; Alias: string }[] = [
  { Text: "What is the start date or effective date of the contract?", Alias: "START_DATE" },
  { Text: "What is the end date or expiration date of the contract?", Alias: "END_DATE" },
  { Text: "What is the length of the initial contract term?", Alias: "TERM_LENGTH" },
  { Text: "How often is waste picked up or collected?", Alias: "PICKUP_FREQUENCY" },
  { Text: "What is the base price or base rate for service?", Alias: "BASE_PRICE" },
  { Text: "What is the container or bin size?", Alias: "CONTAINER_SIZE" },
  { Text: "What is the fuel surcharge or energy surcharge fee?", Alias: "FUEL_SURCHARGE" },
  { Text: "What is the environmental fee?", Alias: "ENVIRONMENTAL_FEE" },
  { Text: "What is the administrative fee or charge?", Alias: "ADMIN_FEE" },
  { Text: "How many days notice are required to cancel or not renew the contract?", Alias: "CANCELLATION_NOTICE" },
  { Text: "Does the contract automatically renew, and what are the terms?", Alias: "AUTO_RENEWAL" },
];

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

interface QueryAnswer {
  text: string;
  confidence: number;
}

// ─── SECTION 5: THE TEXTRACT READING PROCESS (5 STEPS) ──────────────────────
// Step 1 — send the 11 questions + the S3 file location to Textract. It returns a Job ID
//          (like a ticket number) and starts processing in the background on AWS's servers.
// Step 2 — poll every 2 seconds ("are you done yet?") until the status changes from
//          IN_PROGRESS to SUCCEEDED. Most contracts finish in 10–30 seconds.
// Step 3 — collect all the answer "Blocks" Textract sends back. A Block is one piece of
//          data it found (a word, a line, a table cell, or a query answer).
// Step 4 — match each of our 11 questions to its answer Block, and grab the confidence
//          score (0–100%) that tells us how sure Textract was about that answer.
async function runTextractQueries(config: AwsConfig, key: string): Promise<Map<string, QueryAnswer>> {
  const textract = textractClient(config);

  const start = await textract.send(
    new StartDocumentAnalysisCommand({
      DocumentLocation: { S3Object: { Bucket: config.bucket, Name: key } },
      FeatureTypes: ["QUERIES"],
      QueriesConfig: { Queries: TEXTRACT_QUERIES },
    }),
  );
  const jobId = start.JobId;
  if (!jobId) throw new Error("Textract did not return a JobId");

  // Polling is waiting on network I/O, not CPU time, so it doesn't count against the Edge
  // Function's CPU-time budget — only the (much more generous) wall-clock limit.
  const POLL_INTERVAL_MS = 2000;
  const MAX_ATTEMPTS = 60; // up to ~2 minutes
  let status = "IN_PROGRESS";
  for (let attempt = 0; attempt < MAX_ATTEMPTS && status === "IN_PROGRESS"; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    const check = await textract.send(new GetDocumentAnalysisCommand({ JobId: jobId }));
    status = check.JobStatus ?? "IN_PROGRESS";
  }
  if (status !== "SUCCEEDED" && status !== "PARTIAL_SUCCESS") {
    throw new Error(`Textract job did not complete successfully (status: ${status})`);
  }

  // Collect every block across all result pages before matching queries to answers.
  const blocksById = new Map<string, Block>();
  let nextToken: string | undefined;
  do {
    const page = await textract.send(new GetDocumentAnalysisCommand({ JobId: jobId, NextToken: nextToken }));
    for (const block of page.Blocks ?? []) {
      if (block.Id) blocksById.set(block.Id, block);
    }
    nextToken = page.NextToken;
  } while (nextToken);

  const answers = new Map<string, QueryAnswer>();
  for (const block of blocksById.values()) {
    if (block.BlockType !== "QUERY") continue;
    const alias = block.Query?.Alias;
    if (!alias) continue;
    const answerId = block.Relationships?.find((r) => r.Type === "ANSWER")?.Ids?.[0];
    const answerBlock = answerId ? blocksById.get(answerId) : undefined;
    if (answerBlock?.Text) {
      answers.set(alias, { text: answerBlock.Text, confidence: answerBlock.Confidence ?? 0 });
    }
  }
  return answers;
}

// ─── SECTION 6: PACKAGE THE ANSWERS ──────────────────────────────────────────
// Takes the raw answers from Textract and organizes them into the ContractFields shape.
// Also builds a separate confidence map so we know which fields Textract was unsure about.
function buildContractFields(answers: Map<string, QueryAnswer>): ContractFields {
  const get = (alias: string) => answers.get(alias)?.text ?? null;
  return {
    startDate: get("START_DATE"),
    endDate: get("END_DATE"),
    contractTermLength: get("TERM_LENGTH"),
    pickupFrequency: get("PICKUP_FREQUENCY"),
    basePrice: get("BASE_PRICE"),
    fees: {
      fuelSurcharge: get("FUEL_SURCHARGE"),
      environmentalFee: get("ENVIRONMENTAL_FEE"),
      adminFee: get("ADMIN_FEE"),
    },
    containerSize: get("CONTAINER_SIZE"),
    cancellationNoticePeriod: get("CANCELLATION_NOTICE"),
    autoRenewal: get("AUTO_RENEWAL"),
  };
}

function buildConfidence(answers: Map<string, QueryAnswer>): Record<string, number> {
  return Object.fromEntries([...answers.entries()].map(([alias, answer]) => [alias, answer.confidence]));
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
    let confidence: Record<string, number>;
    try {
      const awsConfig = getAwsConfig();
      const stagingKey = `${crypto.randomUUID()}-${file.name}`;
      try {
        await uploadStagingCopy(awsConfig, fileBytes, stagingKey);
        const answers = await runTextractQueries(awsConfig, stagingKey);
        fields = buildContractFields(answers);
        confidence = buildConfidence(answers);
      } finally {
        // Clean up the staging copy regardless of success/failure — it's not the permanent copy
        // (that's the separate upload to the "documents" bucket below).
        await deleteStagingCopy(awsConfig, stagingKey).catch((error) =>
          console.error("Failed to delete Textract staging file:", error)
        );
      }
    } catch (error) {
      console.error("Textract processing failed:", error);
      return Response.json({ error: "Failed to read PDF via Textract" }, { status: 422 });
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
          })
          .select("id")
          .single();
        if (contractError || !contract) throw contractError ?? new Error("Failed to create contract");
        contractId = contract.id;
        saved.contract = true;

        const baseRate = parseCurrencyToNumber(fields.basePrice);
        if (baseRate !== null) {
          const { error } = await ctx.supabaseAdmin.from("contract_services").insert({
            organization_id: organizationId,
            contract_id: contractId,
            service_name: "Waste Collection",
            base_rate: baseRate,
            frequency_per_week: parseFrequencyPerWeek(fields.pickupFrequency),
          });
          if (error) console.error("Failed to save contract service:", error);
        }

        const fees: [string, string | null][] = [
          ["fuel_surcharge", fields.fees.fuelSurcharge],
          ["environmental_fee", fields.fees.environmentalFee],
          ["admin_fee", fields.fees.adminFee],
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

    return Response.json({ source: "textract", fields, confidence, saved, contractId });
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
