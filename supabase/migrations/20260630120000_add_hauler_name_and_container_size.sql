alter table public.contracts
  add column if not exists hauler_name text;

alter table public.contract_services
  add column if not exists container_size text;
