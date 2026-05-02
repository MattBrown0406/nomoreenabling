alter table public.consultation_leads
add column if not exists next_action text not null default 'call',
add column if not exists next_action_due_at timestamptz;

create index if not exists idx_consultation_leads_next_action on public.consultation_leads(next_action);
create index if not exists idx_consultation_leads_next_action_due_at on public.consultation_leads(next_action_due_at);

alter table public.advertiser_inquiries
add column if not exists next_action text not null default 'email',
add column if not exists proposal_sent_at timestamptz,
add column if not exists sold_at timestamptz,
add column if not exists lost_at timestamptz;

create index if not exists idx_advertiser_inquiries_next_action on public.advertiser_inquiries(next_action);
create index if not exists idx_advertiser_inquiries_proposal_sent_at on public.advertiser_inquiries(proposal_sent_at desc);
create index if not exists idx_advertiser_inquiries_sold_at on public.advertiser_inquiries(sold_at desc);

create table if not exists public.weekly_owner_summaries (
  id uuid primary key default gen_random_uuid(),
  period_start timestamptz not null,
  period_end timestamptz not null,
  sent_to text not null,
  subject text not null,
  summary jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_weekly_owner_summaries_created_at on public.weekly_owner_summaries(created_at desc);
create index if not exists idx_weekly_owner_summaries_period on public.weekly_owner_summaries(period_start, period_end);

alter table public.weekly_owner_summaries enable row level security;

drop policy if exists "Admins can view weekly owner summaries" on public.weekly_owner_summaries;
create policy "Admins can view weekly owner summaries"
on public.weekly_owner_summaries
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));
