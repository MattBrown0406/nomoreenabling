import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const sanitizeString = (str: string | null | undefined, maxLength: number): string | null => {
  if (!str) return null;
  return str.trim().slice(0, maxLength);
};

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

// Sync contact to Mailchimp
const syncToMailchimp = async (email: string, firstName: string | null): Promise<void> => {
  const apiKey = Deno.env.get('MAILCHIMP_API_KEY');
  const audienceId = Deno.env.get('MAILCHIMP_AUDIENCE_ID');
  
  if (!apiKey || !audienceId) {
    console.log('Mailchimp credentials not configured, skipping sync');
    return;
  }

  try {
    const datacenter = apiKey.split('-').pop();
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

    const subscriberData: Record<string, unknown> = {
      email_address: email,
      status: 'subscribed',
    };

    if (firstName) {
      subscriberData.merge_fields = { FNAME: firstName };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`anystring:${apiKey}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriberData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Successfully synced to Mailchimp');
    } else if (response.status === 400 && data.title === 'Member Exists') {
      console.log('Contact already exists in Mailchimp');
    } else {
      console.error('Mailchimp sync error:', response.status, data);
    }
  } catch (error) {
    console.error('Error syncing to Mailchimp:', error);
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, first_name, _t } = await req.json();

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

    // Time-based check: if timestamp missing or form submitted in under 2 seconds, reject silently
    if (_t && typeof _t === 'number') {
      const elapsed = Date.now() - _t;
      if (elapsed < 2000) {
        console.log('Bot detected: form submitted too quickly');
        return new Response(
          JSON.stringify({ success: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const sanitizedFirstName = sanitizeString(first_name, 100);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Processing newsletter signup');

    const { error } = await supabase
      .from('subscribers')
      .insert({ 
        email: sanitizedEmail, 
        first_name: sanitizedFirstName 
      });

    if (error) {
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'already_subscribed' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.error('Database error:', error.message);
      throw error;
    }

    syncToMailchimp(sanitizedEmail, sanitizedFirstName).catch(e => 
      console.error('Background Mailchimp sync error:', e)
    );

    return new Response(
      JSON.stringify({ success: true }),
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
