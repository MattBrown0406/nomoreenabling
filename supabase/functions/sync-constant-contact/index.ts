import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const accessToken = Deno.env.get('CONSTANT_CONTACT_ACCESS_TOKEN');
    
    if (!accessToken) {
      console.error('Constant Contact access token not configured');
      return new Response(
        JSON.stringify({ error: 'Constant Contact not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log token prefix for debugging (safe - just first few chars)
    console.log('Using access token starting with:', accessToken.substring(0, 20) + '...');

    // Create Supabase client
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

    if (!subscribers || subscribers.length === 0) {
      console.log('No active subscribers to sync');
      return new Response(
        JSON.stringify({ message: 'No subscribers to sync', synced: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Syncing ${subscribers.length} subscribers to Constant Contact`);

    let syncedCount = 0;
    let errorCount = 0;

    // Sync each subscriber using the /v3/contacts endpoint
    for (const subscriber of subscribers) {
      try {
        const contactData = {
          email_address: {
            address: subscriber.email,
            permission_to_send: "implicit"
          },
          first_name: subscriber.first_name || undefined,
          create_source: "Account",
          list_memberships: []
        };

        console.log(`Syncing contact: ${subscriber.email}`);

        const response = await fetch('https://api.cc.email/v3/contacts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(contactData),
        });

        const responseText = await response.text();

        if (response.ok || response.status === 409) {
          // 201 = created, 409 = contact already exists
          syncedCount++;
          console.log(`Synced: ${subscriber.email} (status: ${response.status})`);
        } else {
          console.error(`Failed to sync ${subscriber.email}: ${response.status} ${responseText}`);
          errorCount++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error syncing ${subscriber.email}:`, error);
        errorCount++;
      }
    }

    console.log(`Sync complete: ${syncedCount} synced, ${errorCount} errors`);
    
    return new Response(
      JSON.stringify({ 
        message: 'Sync complete', 
        synced: syncedCount, 
        errors: errorCount,
        total: subscribers.length 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-constant-contact function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
