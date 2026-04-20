create extension if not exists pgcrypto;

create table if not exists public.crm_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  website text,
  phone text,
  email text,
  address text,
  city text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.crm_accounts(id) on delete cascade,
  full_name text not null,
  job_title text,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_contact_phone_numbers (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  label text,
  phone_number text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_contact_emails (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.crm_contacts(id) on delete cascade,
  email text not null,
  email_type text not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crm_contact_emails_email_type_check check (email_type in ('personal', 'work'))
);

create table if not exists public.crm_opportunities (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.crm_accounts(id) on delete cascade,
  primary_contact_id uuid references public.crm_contacts(id) on delete set null,
  name text not null,
  location text,
  architect_designer_firm text,
  architect_designer_contact_person text,
  architect_designer_position text,
  architect_designer_contact_number text,
  architect_designer_email text,
  owner_name text,
  owner_contact_person text,
  owner_position text,
  owner_contact_number text,
  owner_email text,
  estimated_value numeric(12,2),
  stage text not null default 'new_lead',
  source text not null default 'manual',
  notes text,
  quotation_finished boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint crm_opportunities_stage_check check (
    stage in (
      'new_lead',
      'opportunity',
      'bidding',
      'negotiation',
      'awarded',
      'ongoing',
      'completed',
      'lost'
    )
  ),
  constraint crm_opportunities_estimated_value_check check (
    estimated_value is null or estimated_value >= 0
  )
);

alter table if exists public.crm_opportunities
  add column if not exists architect_designer_firm text,
  add column if not exists architect_designer_contact_person text,
  add column if not exists architect_designer_position text,
  add column if not exists architect_designer_contact_number text,
  add column if not exists architect_designer_email text,
  add column if not exists owner_name text,
  add column if not exists owner_contact_person text,
  add column if not exists owner_position text,
  add column if not exists owner_contact_number text,
  add column if not exists owner_email text;

create table if not exists public.crm_opportunity_activity_logs (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.crm_opportunities(id) on delete cascade,
  activity_type text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_opportunity_attachments (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.crm_opportunities(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  file_type text,
  file_size bigint,
  created_at timestamptz not null default now()
);

create index if not exists crm_accounts_name_idx on public.crm_accounts(name);
create index if not exists crm_accounts_updated_at_idx on public.crm_accounts(updated_at desc);
create index if not exists crm_contacts_account_id_idx on public.crm_contacts(account_id, updated_at desc);
create index if not exists crm_contact_phone_numbers_contact_id_idx on public.crm_contact_phone_numbers(contact_id, updated_at desc);
create index if not exists crm_contact_emails_contact_id_idx on public.crm_contact_emails(contact_id, updated_at desc);
create index if not exists crm_opportunities_account_id_idx on public.crm_opportunities(account_id, updated_at desc);
create index if not exists crm_opportunities_stage_idx on public.crm_opportunities(stage);
create index if not exists crm_opportunity_activity_logs_opportunity_id_idx on public.crm_opportunity_activity_logs(opportunity_id, created_at desc);
create index if not exists crm_opportunity_attachments_opportunity_id_idx on public.crm_opportunity_attachments(opportunity_id, created_at desc);

create or replace function public.set_crm_accounts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.set_crm_contacts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.set_crm_contact_phone_numbers_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.set_crm_contact_emails_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.set_crm_opportunities_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_crm_accounts_updated_at on public.crm_accounts;
create trigger trg_crm_accounts_updated_at
before update on public.crm_accounts
for each row
execute function public.set_crm_accounts_updated_at();

drop trigger if exists trg_crm_contacts_updated_at on public.crm_contacts;
create trigger trg_crm_contacts_updated_at
before update on public.crm_contacts
for each row
execute function public.set_crm_contacts_updated_at();

drop trigger if exists trg_crm_contact_phone_numbers_updated_at on public.crm_contact_phone_numbers;
create trigger trg_crm_contact_phone_numbers_updated_at
before update on public.crm_contact_phone_numbers
for each row
execute function public.set_crm_contact_phone_numbers_updated_at();

drop trigger if exists trg_crm_contact_emails_updated_at on public.crm_contact_emails;
create trigger trg_crm_contact_emails_updated_at
before update on public.crm_contact_emails
for each row
execute function public.set_crm_contact_emails_updated_at();

drop trigger if exists trg_crm_opportunities_updated_at on public.crm_opportunities;
create trigger trg_crm_opportunities_updated_at
before update on public.crm_opportunities
for each row
execute function public.set_crm_opportunities_updated_at();

alter table public.crm_accounts enable row level security;
alter table public.crm_contacts enable row level security;
alter table public.crm_contact_phone_numbers enable row level security;
alter table public.crm_contact_emails enable row level security;
alter table public.crm_opportunities enable row level security;
alter table public.crm_opportunity_activity_logs enable row level security;
alter table public.crm_opportunity_attachments enable row level security;

revoke all on public.crm_accounts from anon;
revoke all on public.crm_contacts from anon;
revoke all on public.crm_contact_phone_numbers from anon;
revoke all on public.crm_contact_emails from anon;
revoke all on public.crm_opportunities from anon;
revoke all on public.crm_opportunity_activity_logs from anon;
revoke all on public.crm_opportunity_attachments from anon;

grant select, insert, update, delete on public.crm_accounts to authenticated;
grant select, insert, update, delete on public.crm_contacts to authenticated;
grant select, insert, update, delete on public.crm_contact_phone_numbers to authenticated;
grant select, insert, update, delete on public.crm_contact_emails to authenticated;
grant select, insert, update, delete on public.crm_opportunities to authenticated;
grant select, insert, update, delete on public.crm_opportunity_activity_logs to authenticated;
grant select, insert, update, delete on public.crm_opportunity_attachments to authenticated;

drop policy if exists "crm_accounts_select_authenticated" on public.crm_accounts;
create policy "crm_accounts_select_authenticated" on public.crm_accounts for select to authenticated using (true);
drop policy if exists "crm_accounts_insert_authenticated" on public.crm_accounts;
create policy "crm_accounts_insert_authenticated" on public.crm_accounts for insert to authenticated with check (true);
drop policy if exists "crm_accounts_update_authenticated" on public.crm_accounts;
create policy "crm_accounts_update_authenticated" on public.crm_accounts for update to authenticated using (true) with check (true);
drop policy if exists "crm_accounts_delete_authenticated" on public.crm_accounts;
create policy "crm_accounts_delete_authenticated" on public.crm_accounts for delete to authenticated using (true);

drop policy if exists "crm_contacts_select_authenticated" on public.crm_contacts;
create policy "crm_contacts_select_authenticated" on public.crm_contacts for select to authenticated using (true);
drop policy if exists "crm_contacts_insert_authenticated" on public.crm_contacts;
create policy "crm_contacts_insert_authenticated" on public.crm_contacts for insert to authenticated with check (true);
drop policy if exists "crm_contacts_update_authenticated" on public.crm_contacts;
create policy "crm_contacts_update_authenticated" on public.crm_contacts for update to authenticated using (true) with check (true);
drop policy if exists "crm_contacts_delete_authenticated" on public.crm_contacts;
create policy "crm_contacts_delete_authenticated" on public.crm_contacts for delete to authenticated using (true);

drop policy if exists "crm_contact_phone_numbers_select_authenticated" on public.crm_contact_phone_numbers;
create policy "crm_contact_phone_numbers_select_authenticated" on public.crm_contact_phone_numbers for select to authenticated using (true);
drop policy if exists "crm_contact_phone_numbers_insert_authenticated" on public.crm_contact_phone_numbers;
create policy "crm_contact_phone_numbers_insert_authenticated" on public.crm_contact_phone_numbers for insert to authenticated with check (true);
drop policy if exists "crm_contact_phone_numbers_update_authenticated" on public.crm_contact_phone_numbers;
create policy "crm_contact_phone_numbers_update_authenticated" on public.crm_contact_phone_numbers for update to authenticated using (true) with check (true);
drop policy if exists "crm_contact_phone_numbers_delete_authenticated" on public.crm_contact_phone_numbers;
create policy "crm_contact_phone_numbers_delete_authenticated" on public.crm_contact_phone_numbers for delete to authenticated using (true);

drop policy if exists "crm_contact_emails_select_authenticated" on public.crm_contact_emails;
create policy "crm_contact_emails_select_authenticated" on public.crm_contact_emails for select to authenticated using (true);
drop policy if exists "crm_contact_emails_insert_authenticated" on public.crm_contact_emails;
create policy "crm_contact_emails_insert_authenticated" on public.crm_contact_emails for insert to authenticated with check (true);
drop policy if exists "crm_contact_emails_update_authenticated" on public.crm_contact_emails;
create policy "crm_contact_emails_update_authenticated" on public.crm_contact_emails for update to authenticated using (true) with check (true);
drop policy if exists "crm_contact_emails_delete_authenticated" on public.crm_contact_emails;
create policy "crm_contact_emails_delete_authenticated" on public.crm_contact_emails for delete to authenticated using (true);

insert into public.crm_contact_phone_numbers (contact_id, label, phone_number, is_primary)
select c.id, 'Main', c.phone, true
from public.crm_contacts c
where c.phone is not null
  and btrim(c.phone) <> ''
  and not exists (
    select 1
    from public.crm_contact_phone_numbers p
    where p.contact_id = c.id
  );

insert into public.crm_contact_emails (contact_id, email, email_type, is_primary)
select c.id, c.email, 'work', true
from public.crm_contacts c
where c.email is not null
  and btrim(c.email) <> ''
  and not exists (
    select 1
    from public.crm_contact_emails e
    where e.contact_id = c.id
  );

drop policy if exists "crm_opportunities_select_authenticated" on public.crm_opportunities;
create policy "crm_opportunities_select_authenticated" on public.crm_opportunities for select to authenticated using (true);
drop policy if exists "crm_opportunities_insert_authenticated" on public.crm_opportunities;
create policy "crm_opportunities_insert_authenticated" on public.crm_opportunities for insert to authenticated with check (true);
drop policy if exists "crm_opportunities_update_authenticated" on public.crm_opportunities;
create policy "crm_opportunities_update_authenticated" on public.crm_opportunities for update to authenticated using (true) with check (true);
drop policy if exists "crm_opportunities_delete_authenticated" on public.crm_opportunities;
create policy "crm_opportunities_delete_authenticated" on public.crm_opportunities for delete to authenticated using (true);

drop policy if exists "crm_opportunity_activity_logs_select_authenticated" on public.crm_opportunity_activity_logs;
create policy "crm_opportunity_activity_logs_select_authenticated" on public.crm_opportunity_activity_logs for select to authenticated using (true);
drop policy if exists "crm_opportunity_activity_logs_insert_authenticated" on public.crm_opportunity_activity_logs;
create policy "crm_opportunity_activity_logs_insert_authenticated" on public.crm_opportunity_activity_logs for insert to authenticated with check (true);
drop policy if exists "crm_opportunity_activity_logs_update_authenticated" on public.crm_opportunity_activity_logs;
create policy "crm_opportunity_activity_logs_update_authenticated" on public.crm_opportunity_activity_logs for update to authenticated using (true) with check (true);
drop policy if exists "crm_opportunity_activity_logs_delete_authenticated" on public.crm_opportunity_activity_logs;
create policy "crm_opportunity_activity_logs_delete_authenticated" on public.crm_opportunity_activity_logs for delete to authenticated using (true);

drop policy if exists "crm_opportunity_attachments_select_authenticated" on public.crm_opportunity_attachments;
create policy "crm_opportunity_attachments_select_authenticated" on public.crm_opportunity_attachments for select to authenticated using (true);
drop policy if exists "crm_opportunity_attachments_insert_authenticated" on public.crm_opportunity_attachments;
create policy "crm_opportunity_attachments_insert_authenticated" on public.crm_opportunity_attachments for insert to authenticated with check (true);
drop policy if exists "crm_opportunity_attachments_update_authenticated" on public.crm_opportunity_attachments;
create policy "crm_opportunity_attachments_update_authenticated" on public.crm_opportunity_attachments for update to authenticated using (true) with check (true);
drop policy if exists "crm_opportunity_attachments_delete_authenticated" on public.crm_opportunity_attachments;
create policy "crm_opportunity_attachments_delete_authenticated" on public.crm_opportunity_attachments for delete to authenticated using (true);

insert into storage.buckets (id, name, public)
values ('crm-files', 'crm-files', false)
on conflict (id) do nothing;

drop policy if exists "crm_files_select_authenticated" on storage.objects;
create policy "crm_files_select_authenticated"
on storage.objects
for select
to authenticated
using (bucket_id = 'crm-files');

drop policy if exists "crm_files_insert_authenticated" on storage.objects;
create policy "crm_files_insert_authenticated"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'crm-files');

drop policy if exists "crm_files_update_authenticated" on storage.objects;
create policy "crm_files_update_authenticated"
on storage.objects
for update
to authenticated
using (bucket_id = 'crm-files')
with check (bucket_id = 'crm-files');

drop policy if exists "crm_files_delete_authenticated" on storage.objects;
create policy "crm_files_delete_authenticated"
on storage.objects
for delete
to authenticated
using (bucket_id = 'crm-files');
