import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('MAILCHIMP_API_KEY');
    const audienceId = Deno.env.get('MAILCHIMP_AUDIENCE_ID');

    if (!apiKey || !audienceId) {
      return new Response(
        JSON.stringify({ error: 'Mailchimp credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all active subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from('subscribers')
      .select('email, first_name')
      .eq('is_active', true);

    if (fetchError) {
      console.error('Error fetching subscribers:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${subscribers?.length || 0} active subscribers to sync`);

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, synced: 0, errors: 0, message: 'No subscribers to sync' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const datacenter = apiKey.split('-').pop();
    const url = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

    let syncedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const subscriber of subscribers) {
      try {
        const subscriberData: Record<string, unknown> = {
          email_address: subscriber.email,
          status: 'subscribed',
        };

        if (subscriber.first_name) {
          subscriberData.merge_fields = { FNAME: subscriber.first_name };
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
          syncedCount++;
          console.log(`Synced: ${subscriber.email}`);
        } else if (response.status === 400 && data.title === 'Member Exists') {
          syncedCount++;
          console.log(`Already exists: ${subscriber.email}`);
        } else {
          errorCount++;
          errors.push(`${subscriber.email}: ${data.detail || 'Unknown error'}`);
          console.error(`Failed: ${subscriber.email}`, data);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error: unknown) {
        errorCount++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`${subscriber.email}: ${errorMessage}`);
        console.error(`Error syncing ${subscriber.email}:`, error);
      }
    }

    console.log(`Sync complete: ${syncedCount} synced, ${errorCount} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced: syncedCount, 
        errors: errorCount,
        errorDetails: errors.slice(0, 10) // Return first 10 errors
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-mailchimp:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
