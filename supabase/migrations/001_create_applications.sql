create extension if not exists "pgcrypto";

-- Application table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role_title text not null,
  status text not null,
  applied_at date not null,
  source text,
  location text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists applications_applied_at_idx
  on public.applications (applied_at desc);