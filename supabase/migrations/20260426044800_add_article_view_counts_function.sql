create or replace function public.get_article_view_counts(limit_count integer default 3)
returns table(article_slug text, view_count bigint)
language sql
security definer
set search_path = public
as $$
  select av.article_slug::text, count(*)::bigint as view_count
  from public.article_views av
  group by av.article_slug
  order by count(*) desc, max(av.viewed_at) desc
  limit greatest(limit_count, 1);
$$;

grant execute on function public.get_article_view_counts(integer) to anon, authenticated, service_role;
