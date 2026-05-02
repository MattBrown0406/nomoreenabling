create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website_url text,
  category text,
  status text not null default 'prospect',
  contact_name text,
  contact_email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sponsors_status_check check (status in ('prospect', 'approved', 'active', 'paused', 'rejected'))
);

create table if not exists public.sponsor_campaigns (
  id uuid primary key default gen_random_uuid(),
  sponsor_id uuid not null references public.sponsors(id) on delete cascade,
  placement_key text not null,
  campaign_name text not null,
  status text not null default 'draft',
  starts_on date,
  ends_on date,
  monthly_rate numeric(10, 2),
  target_url text not null,
  creative_headline text not null,
  creative_body text,
  creative_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sponsor_campaigns_status_check check (status in ('draft', 'scheduled', 'active', 'paused', 'completed'))
);

create table if not exists public.sponsor_impressions (
  id uuid primary key default gen_random_uuid(),
  sponsor_campaign_id uuid references public.sponsor_campaigns(id) on delete set null,
  placement_key text not null,
  page_path text,
  article_slug text,
  viewed_at timestamptz not null default now()
);

alter table public.ad_clicks
add column if not exists sponsor_campaign_id uuid references public.sponsor_campaigns(id) on delete set null,
add column if not exists placement_key text;

create index if not exists idx_sponsors_status on public.sponsors(status);
create index if not exists idx_sponsor_campaigns_status on public.sponsor_campaigns(status);
create index if not exists idx_sponsor_campaigns_placement_key on public.sponsor_campaigns(placement_key);
create index if not exists idx_sponsor_campaigns_dates on public.sponsor_campaigns(starts_on, ends_on);
create index if not exists idx_sponsor_impressions_campaign on public.sponsor_impressions(sponsor_campaign_id);
create index if not exists idx_sponsor_impressions_placement on public.sponsor_impressions(placement_key);
create index if not exists idx_ad_clicks_sponsor_campaign on public.ad_clicks(sponsor_campaign_id);
create index if not exists idx_ad_clicks_placement_key on public.ad_clicks(placement_key);

alter table public.sponsors enable row level security;
alter table public.sponsor_campaigns enable row level security;
alter table public.sponsor_impressions enable row level security;

drop policy if exists "Admins can manage sponsors" on public.sponsors;
create policy "Admins can manage sponsors"
on public.sponsors
for all
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can manage sponsor campaigns" on public.sponsor_campaigns;
create policy "Admins can manage sponsor campaigns"
on public.sponsor_campaigns
for all
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Anyone can track sponsor impressions" on public.sponsor_impressions;
create policy "Anyone can track sponsor impressions"
on public.sponsor_impressions
for insert
with check (true);

drop policy if exists "Admins can view sponsor impressions" on public.sponsor_impressions;
create policy "Admins can view sponsor impressions"
on public.sponsor_impressions
for select
using (public.has_role(auth.uid(), 'admin'));
