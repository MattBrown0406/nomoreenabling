import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  subject: string;
  html_content: string;
  from_name?: string;
  from_email?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log("Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.log("Invalid token or user not found:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user has admin role
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (rolesError || !roles) {
      console.log("User is not an admin:", user.id);
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Admin verified:", user.id);

    const { subject, html_content, from_name, from_email }: NewsletterRequest = await req.json();

    // Validate required fields
    if (!subject || !html_content) {
      console.log("Validation failed: Missing required fields");
      return new Response(
        JSON.stringify({ error: "Subject and HTML content are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch all active subscribers (reusing the existing supabase client)
    const { data: subscribers, error: fetchError } = await supabase
      .from("subscribers")
      .select("email, first_name")
      .eq("is_active", true);

    if (fetchError) {
      console.error("Error fetching subscribers:", fetchError.message);
      throw fetchError;
    }

    if (!subscribers || subscribers.length === 0) {
      console.log("No active subscribers found");
      return new Response(
        JSON.stringify({ error: "No active subscribers found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending newsletter to ${subscribers.length} subscribers`);

    // Prepare from address
    const fromAddress = from_email 
      ? `${from_name || "No More Enabling"} <${from_email}>`
      : "No More Enabling <onboarding@resend.dev>";

    // Send emails to all subscribers
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const subscriber of subscribers) {
      try {
        // Personalize content if first_name is available
        let personalizedContent = html_content;
        if (subscriber.first_name) {
          personalizedContent = html_content.replace(/{{first_name}}/g, subscriber.first_name);
        } else {
          personalizedContent = html_content.replace(/{{first_name}}/g, "Friend");
        }

        const { error: sendError } = await resend.emails.send({
          from: fromAddress,
          to: [subscriber.email],
          subject: subject,
          html: personalizedContent,
        });

        if (sendError) {
          console.error(`Failed to send to ${subscriber.email}:`, sendError);
          results.failed++;
          results.errors.push(`${subscriber.email}: ${sendError.message}`);
        } else {
          console.log(`Successfully sent to ${subscriber.email}`);
          results.successful++;
        }
      } catch (emailError: any) {
        console.error(`Error sending to ${subscriber.email}:`, emailError);
        results.failed++;
        results.errors.push(`${subscriber.email}: ${emailError.message}`);
      }
    }

    console.log(`Newsletter send complete. Success: ${results.successful}, Failed: ${results.failed}`);

    return new Response(
      JSON.stringify({
        success: true,
        total_subscribers: subscribers.length,
        successful: results.successful,
        failed: results.failed,
        errors: results.errors.length > 0 ? results.errors : undefined,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in send-newsletter function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
