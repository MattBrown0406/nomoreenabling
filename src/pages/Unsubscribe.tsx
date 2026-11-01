import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Status = "idle" | "working" | "done" | "error";

// Landing page for the unsubscribe link in newsletter, digest, and course
// emails. Requires a click so link scanners that prefetch URLs can't
// unsubscribe people; mail clients use the one-click List-Unsubscribe header.
const Unsubscribe = () => {
  const [params] = useSearchParams();
  const encodedEmail = params.get("e") || "";
  const token = params.get("t") || "";
  const hasLink = Boolean(encodedEmail && token);
  const [status, setStatus] = useState<Status>("idle");

  const confirm = async () => {
    setStatus("working");
    const { data, error } = await supabase.functions.invoke("unsubscribe", {
      body: { e: encodedEmail, t: token },
    });
    setStatus(!error && data?.success ? "done" : "error");
  };

  return (
    <>
      <SEOHead
        title="Unsubscribe"
        description="Stop receiving No More Enabling emails."
        noindex={true}
      />
      <main className="flex min-h-screen items-center justify-center bg-muted px-4">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground">Unsubscribe</h1>
          {!hasLink ? (
            <p className="mt-4 text-muted-foreground">
              This unsubscribe link is incomplete. Use the link at the bottom of any No More Enabling email, or reply to
              that email and we will remove you.
            </p>
          ) : status === "done" ? (
            <p className="mt-4 text-muted-foreground" role="status">
              You're unsubscribed. You won't receive newsletter, digest, or course emails from No More Enabling anymore.
            </p>
          ) : (
            <>
              <p className="mt-4 text-muted-foreground">
                Stop all newsletter, weekly digest, and email course messages from No More Enabling?
              </p>
              <Button className="mt-6" onClick={confirm} disabled={status === "working"}>
                {status === "working" ? "Unsubscribing..." : "Unsubscribe me"}
              </Button>
              {status === "error" && (
                <p className="mt-4 text-sm text-destructive" role="alert">
                  We couldn't process that link. Please try again, or reply to any of our emails and we'll remove you.
                </p>
              )}
            </>
          )}
          <a href="/" className="mt-6 block text-sm text-primary underline hover:text-primary/90">
            Return to No More Enabling
          </a>
        </div>
      </main>
    </>
  );
};

export default Unsubscribe;
