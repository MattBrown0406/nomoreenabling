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
