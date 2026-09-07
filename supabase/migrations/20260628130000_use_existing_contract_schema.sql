-- Superseded by the existing contracts/contract_fees/contract_services/contract_clauses
-- schema, which was already designed for this (raw_files.kind even includes 'contract').
drop table if exists public.parsed_contracts;

insert into public.organizations (name)
values ('EvE Waste');
