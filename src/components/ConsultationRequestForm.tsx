import { useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const relationshipOptions = [
  "Parent",
  "Spouse or partner",
  "Adult child",
  "Sibling",
  "Close friend",
  "Other family member",
];

const urgencyOptions = [
  "I need direction, but this is not an immediate crisis",
  "The situation is getting worse and we need a plan soon",
  "There are safety concerns or escalating risk",
  "We are considering a professional intervention",
];

const ConsultationRequestForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const loadedAt = useRef(Date.now());

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    relationship: "",
    concern: "",
    treatmentHistory: "",
    urgency: "",
    message: "",
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (honeypot || Date.now() - loadedAt.current < 3000) {
      toast({ title: "Request received", description: "Thank you. We will review your note shortly." });
      return;
    }

    const trimmed = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    ) as typeof form;

    if (!trimmed.name || !trimmed.email || !trimmed.relationship || !trimmed.concern || !trimmed.urgency || !trimmed.message) {
      toast({ title: "Please fill in the required fields.", variant: "destructive" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      toast({ title: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    const structuredMessage = [
      "Consultation request from Work With Matt page",
      "",
      `Phone: ${trimmed.phone || "Not provided"}`,
      `Relationship: ${trimmed.relationship}`,
      `Primary concern: ${trimmed.concern}`,
      `Treatment history: ${trimmed.treatmentHistory || "Not provided"}`,
      `Urgency: ${trimmed.urgency}`,
      "",
      "What is happening now:",
      trimmed.message,
    ].join("\n");

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-form", {
        body: {
          name: trimmed.name,
          email: trimmed.email,
          message: structuredMessage,
          source: "work-with-matt",
        },
      });

      if (error) throw error;

      toast({
        title: "Request sent",
        description: "Thank you. Matt will review your note and follow up as soon as possible.",
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        relationship: "",
        concern: "",
        treatmentHistory: "",
        urgency: "",
        message: "",
      });
    } catch (error) {
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
        name="website"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
        className="absolute -left-[9999px] opacity-0"
        tabIndex={-1}
        autoComplete="off"
      />

      <div>
        <p className="text-sm uppercase tracking-wide text-primary font-medium">Private consultation request</p>
        <h2 className="font-serif text-3xl font-bold text-foreground mt-2">Tell Matt what your family is facing</h2>
        <p className="mt-2 text-muted-foreground">
          This is not a crisis line. If someone is in immediate danger, call 911 or 988. For family guidance, share enough context to help Matt understand the next best step.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="consult-name">Name *</Label>
          <Input id="consult-name" value={form.name} onChange={(event) => updateField("name", event.target.value)} className="mt-1" maxLength={100} />
        </div>
        <div>
          <Label htmlFor="consult-email">Email *</Label>
          <Input id="consult-email" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="mt-1" maxLength={255} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="consult-phone">Phone</Label>
          <Input id="consult-phone" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} className="mt-1" maxLength={50} />
        </div>
        <div>
          <Label htmlFor="consult-relationship">Your relationship *</Label>
          <select
            id="consult-relationship"
            value={form.relationship}
            onChange={(event) => updateField("relationship", event.target.value)}
            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">Select one</option>
            {relationshipOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="consult-concern">Primary concern *</Label>
        <Input
          id="consult-concern"
          value={form.concern}
          onChange={(event) => updateField("concern", event.target.value)}
          className="mt-1"
          placeholder="Alcohol, opioids, treatment refusal, relapse, gambling, mental health concerns..."
          maxLength={180}
        />
      </div>

      <div>
        <Label htmlFor="consult-treatment">Treatment history</Label>
        <Input
          id="consult-treatment"
          value={form.treatmentHistory}
          onChange={(event) => updateField("treatmentHistory", event.target.value)}
          className="mt-1"
          placeholder="No treatment yet, past rehab, current outpatient, repeated relapse..."
          maxLength={180}
        />
      </div>

      <div>
        <Label htmlFor="consult-urgency">What best describes the urgency? *</Label>
        <select
          id="consult-urgency"
          value={form.urgency}
          onChange={(event) => updateField("urgency", event.target.value)}
          className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">Select one</option>
          {urgencyOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>

      <div>
        <Label htmlFor="consult-message">What is happening now? *</Label>
        <Textarea
          id="consult-message"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="mt-1 min-h-32"
          placeholder="Share the pattern, what your family has already tried, and what feels most urgent."
          maxLength={2400}
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
            Request guidance
          </>
        )}
      </Button>
    </form>
  );
};

export default ConsultationRequestForm;
