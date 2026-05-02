create table if not exists public.lead_magnet_downloads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  lead_magnet_slug text not null,
  lead_magnet_source text,
  article_slug text,
  hub_slug text,
  page_path text,
  metadata jsonb not null default '{}'::jsonb,
  downloaded_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email, lead_magnet_slug)
);

create index if not exists idx_lead_magnet_downloads_slug on public.lead_magnet_downloads(lead_magnet_slug);
create index if not exists idx_lead_magnet_downloads_downloaded_at on public.lead_magnet_downloads(downloaded_at);
create index if not exists idx_lead_magnet_downloads_article_slug on public.lead_magnet_downloads(article_slug);
create index if not exists idx_lead_magnet_downloads_hub_slug on public.lead_magnet_downloads(hub_slug);

alter table public.lead_magnet_downloads enable row level security;

drop policy if exists "Admins can view lead magnet downloads" on public.lead_magnet_downloads;
create policy "Admins can view lead magnet downloads"
on public.lead_magnet_downloads
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));
