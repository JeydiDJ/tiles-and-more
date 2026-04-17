create extension if not exists pgcrypto;

create table if not exists public.project_leads (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  company text,
  phone text,
  email text,
  project_name text not null,
  location text,
  estimated_cost numeric(12,2),
  status text not null default 'new_lead',
  source text not null default 'manual',
  inquiry_type text,
  notes text,
  quotation_finished boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_leads_status_check check (
    status in (
      'new_lead',
      'contacted',
      'quotation_in_progress',
      'quotation_sent',
      'ongoing',
      'completed',
      'on_hold',
      'lost'
    )
  ),
  constraint project_leads_estimated_cost_check check (
    estimated_cost is null or estimated_cost >= 0
  )
);

create table if not exists public.project_activity_logs (
  id uuid primary key default gen_random_uuid(),
  project_lead_id uuid not null references public.project_leads(id) on delete cascade,
  activity_type text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.project_lead_attachments (
  id uuid primary key default gen_random_uuid(),
  project_lead_id uuid not null references public.project_leads(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  file_type text,
  file_size bigint,
  created_at timestamptz not null default now()
);

create index if not exists project_leads_status_idx on public.project_leads(status);
create index if not exists project_leads_updated_at_idx on public.project_leads(updated_at desc);
create index if not exists project_leads_client_name_idx on public.project_leads(client_name);
create index if not exists project_activity_logs_project_lead_id_idx on public.project_activity_logs(project_lead_id, created_at desc);
create index if not exists project_lead_attachments_project_lead_id_idx on public.project_lead_attachments(project_lead_id, created_at desc);

create or replace function public.set_project_leads_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_project_leads_updated_at on public.project_leads;
create trigger trg_project_leads_updated_at
before update on public.project_leads
for each row
execute function public.set_project_leads_updated_at();
