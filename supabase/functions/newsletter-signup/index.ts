import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MIN_FORM_MS = 2500;
const MAX_FORM_MS = 6 * 60 * 60 * 1000;

const looksLikeHumanSubmission = (website: unknown, formMs: unknown): boolean => {
  if (typeof website !== 'string' || website.trim() !== '') return false;
  if (typeof formMs !== 'number' || !Number.isFinite(formMs)) return false;
  return formMs >= MIN_FORM_MS && formMs <= MAX_FORM_MS;
};

type TurnstileValidation = {
  success: boolean;
  hostname?: string;
  action?: string;
  'error-codes'?: string[];
};

const verifyTurnstile = async (req: Request, token: unknown): Promise<boolean> => {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  if (!secret) throw new Error('TURNSTILE_SECRET_KEY is not configured');
  if (typeof token !== 'string' || token.length < 1 || token.length > 2048) return false;

  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  const remoteIp = req.headers.get('CF-Connecting-IP');
  if (remoteIp) body.set('remoteip', remoteIp);
  body.set('idempotency_key', crypto.randomUUID());

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!response.ok) {
    throw new Error(`Turnstile Siteverify returned ${response.status}`);
  }

  const result = await response.json() as TurnstileValidation;
  const allowedHostnames = new Set(
    (Deno.env.get('TURNSTILE_ALLOWED_HOSTNAMES') || 'nomoreenabling.com,www.nomoreenabling.com')
      .split(',')
      .map((hostname: string) => hostname.trim().toLowerCase())
      .filter(Boolean),
  );
  const hostnameAllowed = typeof result.hostname === 'string'
    && allowedHostnames.has(result.hostname.toLowerCase());
  const actionAllowed = result.action === 'newsletter_signup';

  if (!result.success || !hostnameAllowed || !actionAllowed) {
    console.log('Turnstile rejected newsletter signup', {
      errors: result['error-codes'] || [],
      hostname: result.hostname || null,
      action: result.action || null,
    });
    return false;
  }

  return true;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const sanitizeString = (str: string | null | undefined, maxLength: number): string | null => {
  if (!str) return null;
  return str.trim().slice(0, maxLength);
};

const normalizeTag = (value: string | null) =>
  value ? value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') : null;

const ASSESSMENT_RESULTS = new Set(['safety', 'intervention', 'boundaries', 'after-treatment', 'support']);

// Disposable/temporary email domains commonly used by bots
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.de', 'grr.la', 'guerrillamailblock.com',
  'tempmail.com', 'temp-mail.org', 'throwaway.email', 'fakeinbox.com', 'sharklasers.com',
  'guerrillamail.info', 'guerrillamail.biz', 'guerrillamail.net', 'yopmail.com', 'yopmail.fr',
  'trashmail.com', 'trashmail.me', 'trashmail.net', 'dispostable.com', 'maildrop.cc',
  'mailnesia.com', 'tempail.com', 'tempr.email', 'discard.email', 'discardmail.com',
  'discardmail.de', 'disposableemailaddresses.emailmiser.com', 'drdrb.com', 'einrot.com',
  'emailigo.de', 'emailisvalid.com', 'emailtemporario.com.br', 'ephemail.net', 'etranquil.com',
  'getnada.com', 'getairmail.com', 'harakirimail.com', 'mailcatch.com', 'mailexpire.com',
  'mailforspam.com', 'mailhazard.com', 'mailhz.me', 'mailimate.com', 'mailmoat.com',
  'mailnull.com', 'mailscrap.com', 'mailshell.com', 'mailsiphon.com', 'mailslite.com',
  'mailtemp.info', 'mailtothis.com', 'mintemail.com', 'mohmal.com', 'mvrht.com',
  'mytemp.email', 'nomail.xl.cx', 'nospam.ze.tc', 'owlpic.com', 'proxymail.eu',
  'rcpt.at', 'reallymymail.com', 'recode.me', 'regbypass.com', 'safetymail.info',
  'spambox.us', 'spamfree24.org', 'spamgourmet.com', 'spamherelots.com', 'spaml.com',
  'tempomail.fr', 'temporaryemail.net', 'temporaryforwarding.com', 'temporaryinbox.com',
  'thankmother.com', 'thisisnotmyrealemail.com', 'throwawayemailaddress.com', 'tmail.ws',
  'tmails.net', 'tmpmail.net', 'tmpmail.org', 'trash-mail.at', 'trashymail.com',
  'trashymail.net', 'wegwerfmail.de', 'wegwerfmail.net', 'wh4f.org', 'zoemail.org',
  '10minutemail.com', '20minutemail.com', 'mailnator.com', 'binkmail.com', 'bobmail.info',
  'chammy.info', 'devnullmail.com', 'dodgeit.com', 'dodgit.com', 'donemail.ru',
  'e4ward.com', 'emailx.at.hm', 'emz.net', 'enterto.com', 'fleckens.hu',
]);

const isDisposableEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
};

type MailchimpOptInResult = 'pending_confirmation' | 'already_subscribed_or_pending';

const mailchimpRequest = async (
  url: string,
  apiKey: string,
  init: RequestInit = {},
): Promise<Response> => fetch(url, {
  ...init,
  headers: {
    'Authorization': `Basic ${btoa(`anystring:${apiKey}`)}`,
    'Content-Type': 'application/json',
    ...(init.headers || {}),
  },
});

// Ask Mailchimp to send its confirmation email. No subscriber or HubSpot/spine
// record is created until Mailchimp calls our confirmed-subscribe webhook.
const requestMailchimpDoubleOptIn = async (
  email: string,
  firstName: string | null,
  tags: string[] = [],
): Promise<MailchimpOptInResult> => {
  const apiKey = Deno.env.get('MAILCHIMP_API_KEY');
  const audienceId = Deno.env.get('MAILCHIMP_AUDIENCE_ID');
  if (!apiKey || !audienceId) throw new Error('Mailchimp credentials are not configured');

  const datacenter = apiKey.split('-').pop();
  if (!datacenter) throw new Error('Mailchimp API key has no datacenter suffix');

  const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
  const subscriberData: Record<string, unknown> = {
    email_address: email,
    status: 'pending',
  };
  if (firstName) subscriberData.merge_fields = { FNAME: firstName };
  if (tags.length > 0) subscriberData.tags = tags;

  const response = await mailchimpRequest(url, apiKey, {
    method: 'POST',
    body: JSON.stringify(subscriberData),
  });
  if (response.ok) return 'pending_confirmation';

  const data = await response.json().catch(() => ({})) as { title?: string };
  if (response.status === 400 && data.title === 'Member Exists') {
    return 'already_subscribed_or_pending';
  }

  throw new Error(`Mailchimp pending member creation failed with ${response.status}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      email,
      first_name,
      source,
      result,
      recommended_offer,
      answers,
      lead_magnet,
      lead_magnet_source,
      article_slug,
      hub_slug,
      page_path,
      website,
      form_ms,
      turnstile_token,
    } = await req.json();

    // Enforce the honeypot and dwell-time checks here, not only in React. Bots
    // can otherwise POST directly to this public Edge Function. Return generic
    // success so an automated sender cannot tell which guard it tripped.
    if (!looksLikeHumanSubmission(website, form_ms)) {
      console.log('Bot guard rejected newsletter signup');
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedEmail = email.trim().toLowerCase();
    
    if (!isValidEmail(sanitizedEmail)) {
      return new Response(
        JSON.stringify({ error: 'Please enter a valid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Disposable email check
    if (isDisposableEmail(sanitizedEmail)) {
      console.log('Disposable email rejected');
      return new Response(
        JSON.stringify({ error: 'Please use a permanent email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const turnstilePassed = await verifyTurnstile(req, turnstile_token);
    if (!turnstilePassed) {
      return new Response(
        JSON.stringify({ error: 'security_verification_failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedFirstName = sanitizeString(first_name, 100);
    const sanitizedSource = sanitizeString(source, 120);
    const sanitizedResult = sanitizeString(result, 80);
    const sanitizedRecommendedOffer = sanitizeString(recommended_offer, 120);
    const sanitizedLeadMagnet = sanitizeString(lead_magnet, 120);
    const sanitizedLeadMagnetSource = sanitizeString(lead_magnet_source, 120);
    const sanitizedArticleSlug = sanitizeString(article_slug, 160);
    const sanitizedHubSlug = sanitizeString(hub_slug, 160);
    const sanitizedPagePath = sanitizeString(page_path, 300);
    const isAssessmentSignup = sanitizedSource === 'family_situation_assessment'
      && sanitizedResult
      && ASSESSMENT_RESULTS.has(sanitizedResult);
    const isLeadMagnetSignup = sanitizedSource === 'lead_magnet' && !!sanitizedLeadMagnet;

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase service credentials are not configured');
    }
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Processing Turnstile-verified newsletter opt-in');

    const mailchimpTags = [
      sanitizedSource ? normalizeTag(sanitizedSource) : null,
      isAssessmentSignup && sanitizedResult ? normalizeTag(`assessment_${sanitizedResult}`) : null,
      isLeadMagnetSignup && sanitizedLeadMagnet ? normalizeTag(`lead_magnet_${sanitizedLeadMagnet}`) : null,
      isLeadMagnetSignup && sanitizedLeadMagnetSource ? normalizeTag(`source_${sanitizedLeadMagnetSource}`) : null,
    ].filter((tag): tag is string => Boolean(tag));

    // This is private, short-lived correlation state—not a subscriber or CRM
    // record. Mailchimp confirmation consumes it before trusted side effects run.
    const safeAnswers = typeof answers === 'object' && answers !== null && !Array.isArray(answers)
      ? answers
      : {};
    const optInContext = {
      source: sanitizedSource,
      assessment_result: isAssessmentSignup ? sanitizedResult : null,
      recommended_offer: isAssessmentSignup ? sanitizedRecommendedOffer : null,
      answers: isAssessmentSignup ? safeAnswers : {},
      lead_magnet: isLeadMagnetSignup ? sanitizedLeadMagnet : null,
      lead_magnet_source: isLeadMagnetSignup ? sanitizedLeadMagnetSource : null,
      article_slug: isLeadMagnetSignup ? sanitizedArticleSlug : null,
      hub_slug: isLeadMagnetSignup ? sanitizedHubSlug : null,
      page_path: sanitizedPagePath,
      lead_magnet_tag: isLeadMagnetSignup && sanitizedLeadMagnet
        ? normalizeTag(`lead_magnet_${sanitizedLeadMagnet}`)
        : null,
    };

    const { error: attemptError } = await supabase
      .from('newsletter_optin_attempts')
      .upsert(
        {
          email: sanitizedEmail,
          first_name: sanitizedFirstName,
          context: optInContext,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          confirmed_at: null,
          mailchimp_member_id: null,
        },
        { onConflict: 'email' },
      );
    if (attemptError) throw attemptError;

    const optInStatus = await requestMailchimpDoubleOptIn(
      sanitizedEmail,
      sanitizedFirstName,
      mailchimpTags,
    );

    return new Response(
      JSON.stringify({
        success: true,
        status: optInStatus,
        confirmation_required: optInStatus === 'pending_confirmation',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in newsletter-signup function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
