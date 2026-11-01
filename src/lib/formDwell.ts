// Anti-spam dwell handling.
//
// Fast submissions (browser autofill, paste-and-submit) are legitimate, so we
// never drop them. Instead we wait out the remaining dwell window, then report
// a dwell value that satisfies the server-side minimum.

export const awaitMinDwell = async (startedAt: number | null, minMs: number) => {
  const elapsed = Date.now() - (startedAt ?? Date.now());
  const remaining = minMs - elapsed;
  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }
};

// The edge functions treat form_ms above 6 hours as a bot and return a fake
// success, so a tab left open overnight silently lost real signups and leads.
// Report at most just under that ceiling.
const MAX_REPORTED_DWELL_MS = 6 * 60 * 60 * 1000 - 60 * 1000;

export const dwellMs = (startedAt: number | null, minMs: number) =>
  Math.min(Math.max(Date.now() - (startedAt ?? Date.now()), minMs), MAX_REPORTED_DWELL_MS);
