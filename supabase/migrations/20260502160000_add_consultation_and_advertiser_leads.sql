create table if not exists public.consultation_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  relationship text,
  concern text,
  treatment_history text,
  urgency text,
  message text not null,
  source text not null default 'contact-form',
  lead_intent text,
  lead_score integer not null default 20,
  lead_tier text not null default 'nurture',
  lead_reasons text[] not null default '{}'::text[],
  page_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_consultation_leads_created_at on public.consultation_leads(created_at desc);
create index if not exists idx_consultation_leads_score on public.consultation_leads(lead_score desc);
create index if not exists idx_consultation_leads_tier on public.consultation_leads(lead_tier);
create index if not exists idx_consultation_leads_intent on public.consultation_leads(lead_intent);

alter table public.consultation_leads enable row level security;

drop policy if exists "Admins can view consultation leads" on public.consultation_leads;
create policy "Admins can view consultation leads"
on public.consultation_leads
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create table if not exists public.advertiser_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  website text,
  sponsor_type text,
  monthly_budget text,
  message text not null,
  page_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_advertiser_inquiries_created_at on public.advertiser_inquiries(created_at desc);
create index if not exists idx_advertiser_inquiries_sponsor_type on public.advertiser_inquiries(sponsor_type);

alter table public.advertiser_inquiries enable row level security;

drop policy if exists "Admins can view advertiser inquiries" on public.advertiser_inquiries;
create policy "Admins can view advertiser inquiries"
on public.advertiser_inquiries
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));
