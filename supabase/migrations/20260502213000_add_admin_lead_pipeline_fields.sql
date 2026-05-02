alter table public.consultation_leads
add column if not exists pipeline_status text not null default 'new',
add column if not exists contacted_at timestamptz,
add column if not exists booked_at timestamptz,
add column if not exists closed_at timestamptz,
add column if not exists lost_at timestamptz,
add column if not exists followups_paused_at timestamptz,
add column if not exists last_admin_action_at timestamptz,
add column if not exists admin_notes text;

create index if not exists idx_consultation_leads_pipeline_status on public.consultation_leads(pipeline_status);
create index if not exists idx_consultation_leads_last_admin_action_at on public.consultation_leads(last_admin_action_at desc);
create index if not exists idx_consultation_leads_page_path on public.consultation_leads(page_path);

drop policy if exists "Admins can update consultation leads" on public.consultation_leads;
create policy "Admins can update consultation leads"
on public.consultation_leads
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

alter table public.advertiser_inquiries
add column if not exists pipeline_status text not null default 'new',
add column if not exists last_admin_action_at timestamptz,
add column if not exists admin_notes text;

create index if not exists idx_advertiser_inquiries_pipeline_status on public.advertiser_inquiries(pipeline_status);
create index if not exists idx_advertiser_inquiries_last_admin_action_at on public.advertiser_inquiries(last_admin_action_at desc);

drop policy if exists "Admins can update advertiser inquiries" on public.advertiser_inquiries;
create policy "Admins can update advertiser inquiries"
on public.advertiser_inquiries
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));
