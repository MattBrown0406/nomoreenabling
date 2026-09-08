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

export const dwellMs = (startedAt: number | null, minMs: number) =>
  Math.max(Date.now() - (startedAt ?? Date.now()), minMs);
