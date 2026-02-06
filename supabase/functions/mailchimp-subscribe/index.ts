import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  'https://nomoreenabling.lovable.app',
  'https://nomoreenabling.com',
  'https://www.nomoreenabling.com',
];

// Allow preview URLs in non-production
const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  // Allow Lovable preview URLs
  if (origin.includes('.lovable.app')) return true;
  return false;
};

const getCorsHeaders = (req: Request) => {
  const origin = req.headers.get('Origin');
  const allowedOrigin = isAllowedOrigin(origin) ? origin! : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  };
};

// Simple in-memory rate limiting (per function invocation instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
};

// Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 255;
const MAX_NAME_LENGTH = 100;

const validateEmail = (email: unknown): string | null => {
  if (typeof email !== 'string') return 'Email must be a string';
  const trimmed = email.trim();
  if (!trimmed) return 'Email is required';
  if (trimmed.length > MAX_EMAIL_LENGTH) return 'Email is too long';
  if (!EMAIL_REGEX.test(trimmed)) return 'Invalid email format';
  return null;
};

const sanitizeName = (name: unknown): string | undefined => {
  if (typeof name !== 'string') return undefined;
  const trimmed = name.trim().slice(0, MAX_NAME_LENGTH);
  // Remove any HTML/script tags
  return trimmed.replace(/<[^>]*>/g, '');
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Rate limiting by IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';
    
    if (isRateLimited(clientIp)) {
      console.warn('Rate limit exceeded for subscription attempt');
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { email, firstName } = body;

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      return new Response(
        JSON.stringify({ error: emailError }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedEmail = (email as string).trim().toLowerCase();
    const sanitizedFirstName = sanitizeName(firstName);

    const apiKey = Deno.env.get('MAILCHIMP_API_KEY');
    const audienceId = Deno.env.get('MAILCHIMP_AUDIENCE_ID');

    if (!apiKey || !audienceId) {
      console.error('Missing Mailchimp credentials');
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract datacenter from API key (format: xxxxx-us21)
    const datacenter = apiKey.split('-').pop();
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

    // Log without PII
    console.log('Processing newsletter subscription request');

    const subscriberData: Record<string, unknown> = {
      email_address: sanitizedEmail,
      status: 'subscribed',
    };

    if (sanitizedFirstName) {
      subscriberData.merge_fields = {
        FNAME: sanitizedFirstName,
      };
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
      console.log('Subscription successful');
      return new Response(
        JSON.stringify({ success: true, message: 'Successfully subscribed!' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (response.status === 400 && data.title === 'Member Exists') {
      console.log('Subscriber already exists');
      return new Response(
        JSON.stringify({ success: true, message: 'You are already subscribed!' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('Mailchimp API error:', data.title || 'Unknown error');
      return new Response(
        JSON.stringify({ error: 'Failed to subscribe. Please try again.' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in mailchimp-subscribe:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
