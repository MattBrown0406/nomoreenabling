import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const sanitizeString = (str: string | null | undefined, maxLength: number): string | null => {
  if (!str) return null;
  return str.trim().slice(0, maxLength);
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
    // Extract datacenter from API key (format: xxxxx-us21)
    const datacenter = apiKey.split('-').pop();
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

    const subscriberData: Record<string, unknown> = {
      email_address: email,
      status: 'subscribed',
    };

    if (firstName) {
      subscriberData.merge_fields = {
        FNAME: firstName,
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
      console.log('Successfully synced to Mailchimp:', email);
    } else if (response.status === 400 && data.title === 'Member Exists') {
      console.log('Contact already exists in Mailchimp:', email);
    } else {
      console.error('Mailchimp sync error:', response.status, data);
    }
  } catch (error) {
    console.error('Error syncing to Mailchimp:', error);
    // Don't throw - we don't want Mailchimp sync failures to break signups
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, first_name } = await req.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      console.log('Validation failed: Email is required');
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedEmail = email.trim().toLowerCase();
    
    if (!isValidEmail(sanitizedEmail)) {
      console.log('Validation failed: Invalid email format or too long');
      return new Response(
        JSON.stringify({ error: 'Please enter a valid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize first_name (optional, max 100 chars)
    const sanitizedFirstName = sanitizeString(first_name, 100);

    // Create Supabase client with service role key for insert
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Processing newsletter signup for: ${sanitizedEmail}`);

    const { error } = await supabase
      .from('subscribers')
      .insert({ 
        email: sanitizedEmail, 
        first_name: sanitizedFirstName 
      });

    if (error) {
      if (error.code === '23505') {
        console.log('Duplicate email attempted:', sanitizedEmail);
        return new Response(
          JSON.stringify({ error: 'already_subscribed' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.error('Database error:', error.message);
      throw error;
    }

    // Sync to Mailchimp (fire and forget)
    syncToMailchimp(sanitizedEmail, sanitizedFirstName).catch(e => 
      console.error('Background Mailchimp sync error:', e)
    );

    console.log('Successfully subscribed:', sanitizedEmail);
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
