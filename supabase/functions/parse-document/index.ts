// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { extractText, getDocumentProxy } from "unpdf";
import type { Database } from "./database.types.ts";

console.log("Hello from Functions!");

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

const DATE = String.raw`(?:\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}|[A-Za-z]+\s+\d{1,2},?\s+\d{4})`;

const DATE_RANGE_PATTERNS = [
  new RegExp(
    `(?:term|agreement)[^.]{0,60}?(?:from|beginning)\\s+(${DATE})\\s+(?:to|through|until|-)\\s+(${DATE})`,
    "i",
  ),
  new RegExp(
    `commenc\\w*\\s+(?:on\\s+)?(${DATE})[^.]{0,40}?(?:through|until|to|ending)\\s+(${DATE})`,
    "i",
  ),
];

function firstMatch(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

function formatAmount(value: string | null): string | null {
  if (!value) return null;
  return value.includes("%") ? value : `$${value}`;
}

function extractDateRange(text: string): { startDate: string | null; endDate: string | null } {
  for (const pattern of DATE_RANGE_PATTERNS) {
    const match = text.match(pattern);
    if (match) return { startDate: match[1].trim(), endDate: match[2].trim() };
  }

  // PDF table headers commonly render as "6/15/2022Effective Date:" — the date glued
  // immediately before its own label, not after it. Real-world PDF text extraction follows the
  // order objects were drawn in the file, which doesn't always match the visual left-to-right
  // reading order for a label/value pair laid out in a table cell.
  return {
    startDate: firstMatch(text, [
      new RegExp(`(?:start date|commencement date|effective date)\\s*[:\\-]?\\s*(${DATE})`, "i"),
      new RegExp(`(${DATE})\\s*(?=(?:start date|commencement date|effective date))`, "i"),
    ]),
    endDate: firstMatch(text, [
      new RegExp(`(?:end date|expiration date|termination date)\\s*[:\\-]?\\s*(${DATE})`, "i"),
      new RegExp(`(${DATE})\\s*(?=(?:end date|expiration date|termination date))`, "i"),
    ]),
  };
}

function extractPickupFrequency(text: string): string | null {
  return firstMatch(text, [
    /\b(daily|weekly|bi-weekly|biweekly|semi-weekly|monthly|on-call|as-needed)\b\s*(?:pickup|pick-up|collection|basis|service)/i,
    /((?:\d+\s*(?:times?|x)|once|twice|three times|four times)\s*(?:per|a)\s*(?:week|month))/i,
    // Some haulers abbreviate this on a rate table, e.g. "1XW" or "2X" for "times per week".
    /\b(\d{1,2}\s*x\s*w)\b/i,
    // Generic fallback. Bounded to a few tokens so it can't run on through an unrelated table
    // row when there's no punctuation nearby to stop at.
    /(?:pickup|pick-up|collection|service)\s*frequency\s*[:\-]?\s*([A-Za-z0-9]+(?:[\s-][A-Za-z0-9]+){0,2})/i,
  ]);
}

function extractBasePrice(text: string): string | null {
  return formatAmount(
    firstMatch(text, [
      // A two-column rate table ("Base Rate   ENERGY" over "$ 166.00   $ 0.00") extracts as
      // "Base Rate ENERGY $ $ 166.00 0.00" — labels grouped together, then both values, with an
      // extra "$" from the second column. The bounded gap and optional second "$" handle both
      // this layout and the simple adjacent "Base Rate: $245.00" case.
      /(?:base\s*(?:rate|price)|monthly\s*(?:service\s*)?(?:rate|charge|price)|service\s*rate).{0,40}?\$\s*\$?\s*([\d,]+\.\d{2}|[\d,]+)/i,
      // "Garbage"/"Recurring" alone are too generic to assume a price follows without a $ sign
      // present — e.g. a container-size table can read "Garbage: 1 2 6 10 95" with no price at all.
      /garbage\s*[:\-]?\s*\$\s*([\d,]+\.\d{2}|[\d,]+)/i,
      /recurring.{0,80}?\$\s*([\d,]+\.\d{2})/i,
      /\$\s*([\d,]+\.\d{2})\s*(?:per\s*month|\/\s*month|monthly)/i,
    ]),
  );
}

function extractFee(text: string, label: string): string | null {
  const pattern = new RegExp(
    `${label}\\s*(?:[:\\-]|of|is|at)?\\s*\\$?\\s*([\\d,]+\\.\\d{2}|[\\d,]+(?:\\.\\d+)?\\s*%)`,
    "i",
  );
  return formatAmount(text.match(pattern)?.[1]?.trim() ?? null);
}

function extractFees(text: string): ContractFields["fees"] {
  return {
    // Different haulers use different names for the same fee: Waste Management bills a
    // "Energy Surcharge" (sometimes just labeled "ENERGY") where others say "fuel surcharge".
    fuelSurcharge: extractFee(text, String.raw`(?:fuel\s*surcharge|energy\s*surcharge|energy)`),
    environmentalFee: extractFee(text, String.raw`environmental\s*fee`),
    // "Administrative Charge" is equally common as "admin fee".
    adminFee: extractFee(text, String.raw`admin(?:istrative)?\s*(?:fee|charge)`),
  };
}

function extractContainerSize(text: string): string | null {
  const match = text.match(/(\d{1,3}(?:\.\d+)?)\s*[- ]?(cubic\s*yard|yard|yd|gallon|gal)s?\b/i);
  if (!match) return null;
  const unit = /y/i.test(match[2]) ? "yard" : "gallon";
  return `${match[1]} ${unit}${match[1] === "1" ? "" : "s"}`;
}

function extractCancellationNotice(text: string): string | null {
  // Day counts are often spelled out with the numeral in parens ("ninety (90) days"),
  // with words like "prior"/"written" between the count and "notice" — not bare and adjacent.
  const dayCount = String.raw`\(?(\d{1,3})\)?\s*[- ]?days?`;
  const value = firstMatch(text, [
    new RegExp(`notice.{0,80}?${dayCount}`, "i"),
    new RegExp(`${dayCount}.{0,40}?(?:prior\\s*)?(?:written\\s*)?notice`, "i"),
    new RegExp(`cancel(?:lation)?.{0,60}?${dayCount}`, "i"),
  ]);
  return value ? `${value} days` : null;
}

// Common abbreviations whose internal periods look like sentence boundaries to the
// "match up to the next period" extractors below (e.g. "U.S." would otherwise cut a clause
// in half right after "U.").
const ABBREVIATIONS: [RegExp, string][] = [
  [/\bU\.S\.A\.?/gi, "US"],
  [/\bU\.S\.?/gi, "US"],
  [/\b(Inc|Corp|Ltd|Mr|Mrs|Ms|Dr|No)\./gi, "$1"],
];

function stripAbbreviationPeriods(text: string): string {
  return ABBREVIATIONS.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text);
}

function extractContractTermLength(text: string): string | null {
  return firstMatch(text, [
    /(?:initial term|contract term|term of (?:this )?agreement)[^\d]{0,80}?(\d{1,3}\s*(?:years?|months?))/i,
  ]);
}

// Even bounded, the 100-char cutoff can land mid-word or mid-number when nothing cleaner is in
// reach (e.g. starting on "00" left over from "$150.00"). Drop a leading fragment like that
// rather than return a clause that starts on a broken token.
function dropLeadingFragment(value: string): string {
  return /^[a-z0-9]/.test(value) ? value.replace(/^\S+\s+/, "") : value;
}

function extractAutoRenewal(text: string): string | null {
  // A deal-specific override ("this agreement does not have a Renewal Term") should win over
  // generic auto-renewal boilerplate that may appear elsewhere in the same document.
  //
  // The leading [^.]{0,100} (rather than unbounded [^.]*) caps how far back this can reach.
  // Without that cap, a decimal currency amount ("$ 0.00") or a mangled date ("03/ 01.") earlier
  // in the document reads as a sentence boundary, and the unbounded match would scoop up every
  // character from there to the actual clause as "context."
  const negation = text.match(
    /[^.]{0,100}\b(?:does not|will not|shall not)\s+(?:have\s+a\s+)?(?:auto(?:matic(?:ally)?)?[-\s]*)?renew(?:able|al|s|ing)?[^.]*\./i,
  );
  if (negation) return dropLeadingFragment(negation[0].trim().replace(/\s+/g, " "));

  const match = text.match(/[^.]{0,100}\bauto(?:matic(?:ally)?)?[-\s]*renew(?:able|al|s|ing)?\b[^.]*\./i);
  return match ? dropLeadingFragment(match[0].trim().replace(/\s+/g, " ")) : null;
}

// OCR.space free tier caps requests at 1MB and 3 PDF pages — fine for filling the gap on
// scanned documents, but not a general-purpose OCR backend. See: https://ocr.space/ocrapi
const OCR_SPACE_MAX_FILE_SIZE = 1_000_000;

interface OcrSpaceResponse {
  IsErroredOnProcessing: boolean;
  ErrorMessage?: string | string[];
  ParsedResults?: { ParsedText?: string }[];
}

async function ocrSpaceExtractText(file: File): Promise<string> {
  const apiKey = Deno.env.get("OCR_SPACE_API_KEY");
  if (!apiKey) throw new Error("OCR_SPACE_API_KEY is not configured");

  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("language", "eng");
  formData.append("OCREngine", "2");
  formData.append("scale", "true");

  const response = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: { apikey: apiKey },
    body: formData,
  });

  const result: OcrSpaceResponse = await response.json();
  if (!response.ok || result.IsErroredOnProcessing) {
    const message = Array.isArray(result.ErrorMessage)
      ? result.ErrorMessage.join(", ")
      : result.ErrorMessage ?? `OCR.space request failed (${response.status})`;
    throw new Error(message);
  }

  return (result.ParsedResults ?? []).map((page) => page.ParsedText ?? "").join("\n");
}

// Field extraction is heuristic (regex over extracted text), not a guaranteed parse —
// contract wording that doesn't match these patterns will come back null.
function extractContractFields(rawText: string): ContractFields {
  const text = stripAbbreviationPeriods(rawText.replace(/\s+/g, " ").trim());
  const { startDate, endDate } = extractDateRange(text);

  return {
    startDate,
    endDate,
    // Contracts usually state a duration ("36 months from the Effective Date") rather than a
    // literal end date. We surface the duration as-is rather than computing an end date, since
    // doing date math here could silently produce a wrong date instead of an honest "not stated."
    contractTermLength: extractContractTermLength(text),
    pickupFrequency: extractPickupFrequency(text),
    basePrice: extractBasePrice(text),
    fees: extractFees(text),
    containerSize: extractContainerSize(text),
    cancellationNoticePeriod: extractCancellationNotice(text),
    autoRenewal: extractAutoRenewal(text),
  };
}

// --- Converting our text answers into the numbers/dates the real schema expects -----------

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

// This endpoint uses 'publishable' | 'secret' access, apiKey is required.
// Use publishable for Client-facing, key-validated endpoints
// Use secret for Server-to-server, internal calls
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

    let rawText: string;
    try {
      const buffer = new Uint8Array(await file.arrayBuffer());
      const pdf = await getDocumentProxy(buffer);
      const { text } = await extractText(pdf, { mergePages: true });
      rawText = text;
    } catch (error) {
      console.error("Failed to extract text from PDF:", error);
      return Response.json({ error: "Failed to read PDF file" }, { status: 422 });
    }

    // unpdf only reads an embedded text layer. Scanned/photographed PDFs have none, so fall
    // back to OCR, which reads the page images directly instead.
    //
    // Some scans aren't fully empty, though — e.g. a digitally-added signature/date stamp can be
    // the only real text on an otherwise-image page ("Dan Flores5/24/2022", 19 characters total).
    // A real contract page runs at minimum into the hundreds of characters, so anything this
    // short is effectively still a scan and needs the same OCR fallback, not just literal "".
    const MIN_TEXT_LENGTH = 150;
    let source: "text" | "ocr" = "text";
    if (rawText.trim().length < MIN_TEXT_LENGTH) {
      if (file.size > OCR_SPACE_MAX_FILE_SIZE) {
        return Response.json(
          { error: "No usable text layer found, and file exceeds the 1MB OCR fallback limit" },
          { status: 422 },
        );
      }

      try {
        rawText = await ocrSpaceExtractText(file);
        source = "ocr";
      } catch (error) {
        console.error("OCR fallback failed:", error);
        return Response.json({ error: "Failed to OCR scanned PDF" }, { status: 422 });
      }
    }

    if (!rawText.trim()) {
      return Response.json({ error: "No extractable text found in PDF" }, { status: 422 });
    }

    const fields = extractContractFields(rawText);

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

      const fileBytes = new Uint8Array(await file.arrayBuffer());
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

    return Response.json({ source, fields, saved, contractId });
  }),
};

/* To invoke locally:

  1. Set the OCR fallback API key (free signup at https://ocr.space/ocrapi):
     supabase secrets set OCR_SPACE_API_KEY=<your key>
  2. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  3. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/parse-document' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
    --form 'file=@/path/to/contract.pdf;type=application/pdf'

*/
