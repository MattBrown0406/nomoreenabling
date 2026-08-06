import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const jsonHeaders = { 'Content-Type': 'application/json' };

const sha256Hex = async (value: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const constantTimeEqual = (left: string, right: string): boolean => {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
};

const cleanValue = (value: FormDataEntryValue | null, maxLength: number): string | null => {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim().slice(0, maxLength);
  return cleaned || null;
};

interface MailchimpMember {
  id?: string;
  email_address?: string;
  status?: string;
  merge_fields?: Record<string, unknown>;
}

const fetchCanonicalMember = async (
  apiKey: string,
  audienceId: string,
  memberId: string,
): Promise<MailchimpMember> => {
  const dataCenter = apiKey.split('-').pop();
  if (!dataCenter || dataCenter === apiKey) throw new Error('Invalid Mailchimp API key format');

  const response = await fetch(
    `https://${dataCenter}.api.mailchimp.com/3.0/lists/${encodeURIComponent(audienceId)}/members/${encodeURIComponent(memberId)}`,
    {
      headers: {
        'Authorization': `Basic ${btoa(`apikey:${apiKey}`)}`,
        'Accept': 'application/json',
      },
    },
  );
  if (!response.ok) throw new Error(`Mailchimp member verification failed with ${response.status}`);
  return await response.json() as MailchimpMember;
};

serve(async (req) => {
  try {
    const apiKey = Deno.env.get('MAILCHIMP_API_KEY');
    const audienceId = Deno.env.get('MAILCHIMP_AUDIENCE_ID');
    if (!apiKey || !audienceId) throw new Error('Mailchimp credentials are not configured');

    // Mailchimp does not provide a broadly available webhook signature. The
    // callback URL therefore contains a high-entropy token derived from the API
    // key, then every event is independently verified against Mailchimp's API.
    const providedToken = new URL(req.url).searchParams.get('token') || '';
    const expectedToken = await sha256Hex(apiKey);
    if (!constantTimeEqual(providedToken, expectedToken)) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401,
        headers: jsonHeaders,
      });
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
      return new Response(req.method === 'HEAD' ? null : 'ok', { status: 200 });
    }
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
        status: 405,
        headers: { ...jsonHeaders, 'Allow': 'GET, HEAD, POST' },
      });
    }

    const form = await req.formData();
    const eventType = cleanValue(form.get('type'), 40);
    if (eventType !== 'subscribe') {
      return new Response(JSON.stringify({ success: true, ignored: true }), {
        status: 200,
        headers: jsonHeaders,
      });
    }

    const listId = cleanValue(form.get('data[list_id]'), 80);
    const memberId = cleanValue(form.get('data[id]'), 80);
    const email = cleanValue(form.get('data[email]') || form.get('data[merges][EMAIL]'), 255)?.toLowerCase();
    if (
      listId !== audienceId
      || !memberId
      || !email
      || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      console.error('Mailchimp subscribe webhook had an invalid audience/member payload');
      return new Response(JSON.stringify({ error: 'invalid_payload' }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    const canonicalMember = await fetchCanonicalMember(apiKey, audienceId, memberId);
    const canonicalEmail = canonicalMember.email_address?.trim().toLowerCase();
    if (
      canonicalMember.id !== memberId
      || canonicalEmail !== email
      || canonicalMember.status !== 'subscribed'
    ) {
      console.error('Mailchimp webhook did not match a canonical confirmed member');
      return new Response(JSON.stringify({ error: 'member_not_confirmed' }), {
        status: 409,
        headers: jsonHeaders,
      });
    }

    const mergeFirstName = canonicalMember.merge_fields?.FNAME;
    const firstName = typeof mergeFirstName === 'string'
      ? mergeFirstName.trim().slice(0, 100) || null
      : cleanValue(form.get('data[merges][FNAME]'), 100);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) throw new Error('Supabase service credentials are not configured');
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabase.rpc('finalize_confirmed_newsletter_optin', {
      p_email: email,
      p_first_name: firstName,
      p_mailchimp_member_id: memberId,
    });
    if (error) throw error;

    const finalized = Boolean(data && typeof data === 'object' && data.finalized === true);
    if (!finalized) {
      console.log('Confirmed Mailchimp member had no active Turnstile-verified opt-in attempt');
    }

    return new Response(JSON.stringify({ success: true, finalized }), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (error) {
    console.error(
      'mailchimp-confirmed-subscribe failed:',
      error instanceof Error ? error.message : String(error),
    );
    return new Response(JSON.stringify({ error: 'internal_error' }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
});
