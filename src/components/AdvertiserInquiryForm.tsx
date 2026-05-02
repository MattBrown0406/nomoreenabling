import { useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";
import { trackGAConversion } from "@/lib/gaConversions";

const budgetOptions = [
  "Under $500/month",
  "$500-$1,500/month",
  "$1,500-$3,000/month",
  "$3,000+/month",
  "Not sure yet",
];

const AdvertiserInquiryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const loadedAt = useRef(Date.now());
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    sponsorType: "",
    budget: "",
    message: "",
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (honeypot || Date.now() - loadedAt.current < 3000) {
      toast({ title: "Inquiry received", description: "Thank you. We will review the sponsor fit shortly." });
      return;
    }

    const trimmed = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    ) as typeof form;

    if (!trimmed.name || !trimmed.email || !trimmed.company || !trimmed.sponsorType || !trimmed.message) {
      toast({ title: "Please fill in the required fields.", variant: "destructive" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      toast({ title: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const structuredMessage = [
        "Advertiser inquiry from No More Enabling",
        "",
        `Company: ${trimmed.company}`,
        `Website: ${trimmed.website || "Not provided"}`,
        `Sponsor type: ${trimmed.sponsorType}`,
        `Budget: ${trimmed.budget || "Not provided"}`,
        "",
        "Message:",
        trimmed.message,
      ].join("\n");

      const { error } = await supabase.functions.invoke("send-contact-form", {
        body: {
          name: trimmed.name,
          email: trimmed.email,
          message: structuredMessage,
          source: "advertiser-inquiry",
          company: trimmed.company,
          website: trimmed.website,
          sponsor_type: trimmed.sponsorType,
          monthly_budget: trimmed.budget,
          page_path: typeof window === "undefined" ? null : window.location.pathname,
        },
      });

      if (error) throw error;

      trackGAConversion("advertiser_inquiry", {
        sponsor_type: trimmed.sponsorType,
        monthly_budget: trimmed.budget,
      });
      void trackFunnelEvent("advertiser_inquiry", {
        source: "advertise_page",
        metadata: {
          company: trimmed.company,
          sponsorType: trimmed.sponsorType,
          monthlyBudget: trimmed.budget,
        },
      });

      toast({
        title: "Inquiry sent",
        description: "Thank you. Matt will review the fit and follow up.",
      });
      setForm({
        name: "",
        email: "",
        company: "",
        website: "",
        sponsorType: "",
        budget: "",
        message: "",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please email matt@nomoreenabling.com directly if this keeps happening.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-5">
      <input
        type="text"
        name="url"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
        className="absolute -left-[9999px] opacity-0"
        tabIndex={-1}
        autoComplete="off"
      />

      <div>
        <p className="text-sm uppercase tracking-wide text-primary font-medium">Advertiser inquiry</p>
        <h2 className="font-serif text-3xl font-bold text-foreground mt-2">Request sponsor availability</h2>
        <p className="mt-2 text-muted-foreground">
          Use this for treatment-adjacent, family-support, recovery, prevention, or ethical behavioral health brands that may fit the site.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="ad-name">Name *</Label>
          <Input id="ad-name" value={form.name} onChange={(event) => updateField("name", event.target.value)} className="mt-1" maxLength={100} />
        </div>
        <div>
          <Label htmlFor="ad-email">Email *</Label>
          <Input id="ad-email" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="mt-1" maxLength={255} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="ad-company">Company *</Label>
          <Input id="ad-company" value={form.company} onChange={(event) => updateField("company", event.target.value)} className="mt-1" maxLength={140} />
        </div>
        <div>
          <Label htmlFor="ad-website">Website</Label>
          <Input id="ad-website" value={form.website} onChange={(event) => updateField("website", event.target.value)} className="mt-1" maxLength={255} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="ad-type">Sponsor type *</Label>
          <Input
            id="ad-type"
            value={form.sponsorType}
            onChange={(event) => updateField("sponsorType", event.target.value)}
            className="mt-1"
            placeholder="Treatment, sober living, family coaching, prevention..."
            maxLength={180}
          />
        </div>
        <div>
          <Label htmlFor="ad-budget">Monthly budget</Label>
          <select
            id="ad-budget"
            value={form.budget}
            onChange={(event) => updateField("budget", event.target.value)}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select one</option>
            {budgetOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="ad-message">What do you want to promote? *</Label>
        <Textarea
          id="ad-message"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="mt-1 min-h-28"
          placeholder="Tell us about the offer, audience, geography, and desired placement."
          maxLength={1800}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Request sponsor info
          </>
        )}
      </Button>
    </form>
  );
};

export default AdvertiserInquiryForm;
