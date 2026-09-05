// PostgREST caps every response at the project's max-rows (1000 by default),
// regardless of `.limit()`. Analytics queries over funnel_events blow past
// that quickly, so page through with `.range()` until a short page comes back.

type Builder = { range: (from: number, to: number) => PromiseLike<{ data: unknown[] | null; error: unknown }> };

export const fetchAllRows = async <T>(
  buildQuery: () => Builder,
  { pageSize = 1000, maxRows = 50000 }: { pageSize?: number; maxRows?: number } = {},
): Promise<T[]> => {
  const rows: T[] = [];
  let from = 0;
  while (from < maxRows) {
    const { data, error } = await buildQuery().range(from, from + pageSize - 1);
    if (error) throw error;
    const page = (data ?? []) as T[];
    rows.push(...page);
    if (page.length < pageSize) break;
    from += pageSize;
  }
  return rows;
};
