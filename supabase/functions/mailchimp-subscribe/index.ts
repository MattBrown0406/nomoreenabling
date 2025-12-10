import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('MAILCHIMP_API_KEY');
    const audienceId = Deno.env.get('MAILCHIMP_AUDIENCE_ID');

    if (!apiKey || !audienceId) {
      console.error('Missing Mailchimp credentials');
      return new Response(
        JSON.stringify({ error: 'Mailchimp credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract datacenter from API key (format: xxxxx-us21)
    const datacenter = apiKey.split('-').pop();
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

    console.log(`Adding subscriber: ${email} to audience ${audienceId}`);

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
      console.log(`Successfully subscribed: ${email}`);
      return new Response(
        JSON.stringify({ success: true, message: 'Successfully subscribed!' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (response.status === 400 && data.title === 'Member Exists') {
      console.log(`Already subscribed: ${email}`);
      return new Response(
        JSON.stringify({ success: true, message: 'You are already subscribed!' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('Mailchimp error:', data);
      return new Response(
        JSON.stringify({ error: data.detail || 'Failed to subscribe' }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in mailchimp-subscribe:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
