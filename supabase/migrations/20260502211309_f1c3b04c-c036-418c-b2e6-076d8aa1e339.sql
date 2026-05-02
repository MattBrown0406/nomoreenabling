alter table public.consultation_leads
add column if not exists first_name text,
add column if not exists followup_status text not null default 'new',
add column if not exists last_followup_at timestamptz,
add column if not exists next_followup_at timestamptz;

create index if not exists idx_consultation_leads_followup_status on public.consultation_leads(followup_status);
create index if not exists idx_consultation_leads_next_followup_at on public.consultation_leads(next_followup_at);

create table if not exists public.consultation_followup_queue (
  id uuid primary key default gen_random_uuid(),
  consultation_lead_id uuid references public.consultation_leads(id) on delete cascade,
  email text not null,
  name text,
  lead_tier text not null default 'nurture',
  lead_intent text,
  sequence_step integer not null,
  subject text not null,
  preview_text text,
  body_markdown text not null,
  primary_cta_label text,
  primary_cta_href text,
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  skipped_at timestamptz,
  error_message text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (consultation_lead_id, sequence_step)
);

create index if not exists idx_consultation_followup_queue_due on public.consultation_followup_queue(scheduled_for)
where sent_at is null and skipped_at is null;
create index if not exists idx_consultation_followup_queue_lead on public.consultation_followup_queue(consultation_lead_id);
create index if not exists idx_consultation_followup_queue_email on public.consultation_followup_queue(email);

alter table public.consultation_followup_queue enable row level security;

drop policy if exists "Admins can view consultation followups" on public.consultation_followup_queue;
create policy "Admins can view consultation followups"
on public.consultation_followup_queue
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can update consultation followups" on public.consultation_followup_queue;
create policy "Admins can update consultation followups"
on public.consultation_followup_queue
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));