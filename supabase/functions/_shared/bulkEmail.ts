// Bulk email via Resend's batch endpoint (up to 100 messages per request).
// Sending one request per subscriber in a tight loop trips Resend's default
// rate limit (~2 req/s) and can outlive the edge function's wall clock, which
// silently drops the tail of the list. Batches are paced and 429s retried.

export interface BulkEmail {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface BulkSendResult {
  successful: number;
  failed: number;
  errors: string[];
}

const BATCH_SIZE = 100;
const PAUSE_BETWEEN_BATCHES_MS = 600;
const MAX_RETRIES = 3;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendBulkEmails = async (
  apiKey: string,
  emails: BulkEmail[],
  // Stable per send; combined with the batch index into an Idempotency-Key so
  // a retry after a timeout/5xx (where Resend may already have accepted the
  // batch) can't email the same 100 people twice.
  sendId: string = crypto.randomUUID(),
): Promise<BulkSendResult> => {
  const result: BulkSendResult = { successful: 0, failed: 0, errors: [] };

  for (let start = 0; start < emails.length; start += BATCH_SIZE) {
    const batch = emails.slice(start, start + BATCH_SIZE);
    if (start > 0) await sleep(PAUSE_BETWEEN_BATCHES_MS);

    let response: Response | null = null;
    let networkError: string | null = null;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        response = await fetch("https://api.resend.com/emails/batch", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            // Report invalid recipients per message instead of failing the
            // whole batch of 100.
            "x-batch-validation": "permissive",
            "Idempotency-Key": `${sendId}:${start / BATCH_SIZE}`.slice(0, 256),
          },
          body: JSON.stringify(batch.map((email) => ({ ...email, to: [email.to] }))),
        });
        networkError = null;
      } catch (error) {
        response = null;
        networkError = error instanceof Error ? error.message : String(error);
      }
      if (response && response.status !== 429 && response.status < 500) break;
      if (attempt < MAX_RETRIES) {
        const retryAfter = Number(response?.headers.get("retry-after"));
        await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt);
      }
    }

    if (!response || !response.ok) {
      const detail = networkError ?? (response ? `${response.status} ${await response.text().catch(() => "")}` : "no response");
      result.failed += batch.length;
      result.errors.push(`batch ${start / BATCH_SIZE + 1} (${batch.length} recipients): ${detail.slice(0, 300)}`);
      continue;
    }

    const body = await response.json().catch(() => ({})) as {
      errors?: Array<{ index?: number; message?: string }>;
    };
    const batchErrors = Array.isArray(body.errors) ? body.errors : [];
    result.failed += batchErrors.length;
    result.successful += batch.length - batchErrors.length;
    for (const err of batchErrors) {
      const recipient = typeof err.index === "number" ? batch[err.index]?.to : "unknown";
      result.errors.push(`${recipient}: ${err.message ?? "rejected"}`);
    }
  }

  return result;
};
