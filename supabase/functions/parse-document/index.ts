// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { extractText, getDocumentProxy } from "unpdf";

console.log("Hello from Functions!");

interface ContractFields {
  startDate: string | null;
  endDate: string | null;
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

  return {
    startDate: firstMatch(text, [
      new RegExp(`(?:start date|commencement date|effective date)\\s*[:\\-]?\\s*(${DATE})`, "i"),
    ]),
    endDate: firstMatch(text, [
      new RegExp(`(?:end date|expiration date|termination date)\\s*[:\\-]?\\s*(${DATE})`, "i"),
    ]),
  };
}

function extractPickupFrequency(text: string): string | null {
  return firstMatch(text, [
    /\b(daily|weekly|bi-weekly|biweekly|semi-weekly|monthly|on-call|as-needed)\b\s*(?:pickup|pick-up|collection|basis|service)/i,
    /((?:\d+\s*(?:times?|x)|once|twice|three times|four times)\s*(?:per|a)\s*(?:week|month))/i,
    /(?:pickup|pick-up|collection|service)\s*frequency\s*[:\-]?\s*([A-Za-z0-9\- ]+?)(?=[.,]|$)/i,
  ]);
}

function extractBasePrice(text: string): string | null {
  return formatAmount(
    firstMatch(text, [
      /(?:base\s*(?:rate|price)|monthly\s*(?:service\s*)?(?:rate|charge|price)|service\s*rate)\s*[:\-]?\s*\$?\s*([\d,]+\.\d{2}|[\d,]+)/i,
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
    fuelSurcharge: extractFee(text, String.raw`fuel\s*surcharge`),
    environmentalFee: extractFee(text, String.raw`environmental\s*fee`),
    adminFee: extractFee(text, String.raw`admin(?:istrative)?\s*fee`),
  };
}

function extractContainerSize(text: string): string | null {
  const match = text.match(/(\d{1,3}(?:\.\d+)?)\s*[- ]?(cubic\s*yard|yard|yd|gallon|gal)s?\b/i);
  if (!match) return null;
  const unit = /y/i.test(match[2]) ? "yard" : "gallon";
  return `${match[1]} ${unit}${match[1] === "1" ? "" : "s"}`;
}

function extractCancellationNotice(text: string): string | null {
  return firstMatch(text, [
    /(\d{1,3}\s*[- ]?(?:day|days))\s*(?:written\s*)?notice/i,
    /notice\s*(?:period\s*)?of\s*(\d{1,3}\s*[- ]?(?:day|days))/i,
    /cancel(?:lation)?[^.]{0,40}?(\d{1,3}\s*[- ]?(?:day|days))/i,
  ]);
}

function extractAutoRenewal(text: string): string | null {
  const match = text.match(/[^.]*\bauto(?:matically)?[- ]?renew(?:al|s|ing)?\b[^.]*\./i);
  return match ? match[0].trim().replace(/\s+/g, " ") : null;
}

// Field extraction is heuristic (regex over extracted text), not a guaranteed parse —
// contract wording that doesn't match these patterns will come back null.
function extractContractFields(rawText: string): ContractFields {
  const text = rawText.replace(/\s+/g, " ").trim();
  const { startDate, endDate } = extractDateRange(text);

  return {
    startDate,
    endDate,
    pickupFrequency: extractPickupFrequency(text),
    basePrice: extractBasePrice(text),
    fees: extractFees(text),
    containerSize: extractContainerSize(text),
    cancellationNoticePeriod: extractCancellationNotice(text),
    autoRenewal: extractAutoRenewal(text),
  };
}

// This endpoint uses 'publishable' | 'secret' access, apiKey is required.
// Use publishable for Client-facing, key-validated endpoints
// Use secret for Server-to-server, internal calls
export default {
  fetch: withSupabase({ auth: ["publishable", "secret"] }, async (req) => {
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

    if (!rawText.trim()) {
      return Response.json({ error: "No extractable text found in PDF" }, { status: 422 });
    }

    return Response.json({ fields: extractContractFields(rawText) });
  }),
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/parse-document' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
    --form 'file=@/path/to/contract.pdf;type=application/pdf'

*/
