create table public.parsed_contracts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  file_name text not null,
  storage_path text not null,
  source text not null check (source in ('text', 'ocr')),
  fields jsonb not null
);

-- No policies are added: this table is only ever read/written by the parse-document function
-- via the service-role client, which bypasses RLS. If a future feature lets users view their
-- own saved contracts directly from the frontend, add policies then.
alter table public.parsed_contracts enable row level security;
