create extension if not exists pgcrypto;

create table if not exists public.accounting_periods (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  period_start date,
  period_end date,
  opening_balance numeric(14,2) not null default 0,
  sales_collected numeric(14,2) not null default 0,
  receivables_collected numeric(14,2) not null default 0,
  other_income numeric(14,2) not null default 0,
  inventory_purchases numeric(14,2) not null default 0,
  payroll numeric(14,2) not null default 0,
  rent_utilities numeric(14,2) not null default 0,
  operating_expenses numeric(14,2) not null default 0,
  marketing numeric(14,2) not null default 0,
  taxes numeric(14,2) not null default 0,
  loan_payments numeric(14,2) not null default 0,
  owner_draws numeric(14,2) not null default 0,
  capital_expenses numeric(14,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint accounting_periods_nonnegative_amounts check (
    opening_balance >= 0 and
    sales_collected >= 0 and
    receivables_collected >= 0 and
    other_income >= 0 and
    inventory_purchases >= 0 and
    payroll >= 0 and
    rent_utilities >= 0 and
    operating_expenses >= 0 and
    marketing >= 0 and
    taxes >= 0 and
    loan_payments >= 0 and
    owner_draws >= 0 and
    capital_expenses >= 0
  ),
  constraint accounting_periods_date_order check (
    period_start is null or period_end is null or period_end >= period_start
  )
);

create index if not exists accounting_periods_period_start_idx on public.accounting_periods(period_start asc nulls last, created_at asc);
create index if not exists accounting_periods_updated_at_idx on public.accounting_periods(updated_at desc);

create or replace function public.set_accounting_periods_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_accounting_periods_updated_at on public.accounting_periods;
create trigger trg_accounting_periods_updated_at
before update on public.accounting_periods
for each row
execute function public.set_accounting_periods_updated_at();

alter table public.accounting_periods enable row level security;

revoke all on public.accounting_periods from anon;
grant select, insert, update, delete on public.accounting_periods to authenticated;

drop policy if exists "accounting_periods_select_authenticated" on public.accounting_periods;
create policy "accounting_periods_select_authenticated" on public.accounting_periods for select to authenticated using (true);
drop policy if exists "accounting_periods_insert_authenticated" on public.accounting_periods;
create policy "accounting_periods_insert_authenticated" on public.accounting_periods for insert to authenticated with check (true);
drop policy if exists "accounting_periods_update_authenticated" on public.accounting_periods;
create policy "accounting_periods_update_authenticated" on public.accounting_periods for update to authenticated using (true) with check (true);
drop policy if exists "accounting_periods_delete_authenticated" on public.accounting_periods;
create policy "accounting_periods_delete_authenticated" on public.accounting_periods for delete to authenticated using (true);
