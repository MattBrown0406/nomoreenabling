import { useRef, useState } from "react";
import { HelpCircle, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";

interface AnswerQuestionIntakeProps {
  source?: string;
  contextQuestion?: string;
  contextPath?: string;
}

const AnswerQuestionIntake = ({
  source = "answer-question-intake",
  contextQuestion,
  contextPath,
}: AnswerQuestionIntakeProps) => {
  const loadedAt = useRef(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    question: "",
    situation: "",
  });

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (honeypot || Date.now() - loadedAt.current < 2500) {
      toast({ title: "Question received", description: "Thank you. We will review it for future answers." });
      return;
    }

    const trimmed = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, value.trim()]),
    ) as typeof form;

    if (!trimmed.name || !trimmed.email || !trimmed.question) {
      toast({ title: "Please add your name, email, and question.", variant: "destructive" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      toast({ title: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    const pagePath = contextPath || (typeof window === "undefined" ? "" : window.location.pathname);
    const message = [
      "Family recovery question submitted through No More Enabling",
      "",
      contextQuestion ? `Question page context: ${contextQuestion}` : null,
      pagePath ? `Page path: ${pagePath}` : null,
      "",
      "Question:",
      trimmed.question,
      "",
      "Situation context:",
      trimmed.situation || "Not provided",
    ]
      .filter(Boolean)
      .join("\n");

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-form", {
        body: {
          name: trimmed.name,
          email: trimmed.email,
          message,
          source,
          concern: trimmed.question,
          urgency: "Question submitted for future answer content",
          lead_intent: "answer-question",
          lead_score: 12,
          lead_tier: "nurture",
          lead_reasons: ["Submitted a family recovery question"],
          page_path: pagePath || null,
        },
      });

      if (error) throw error;

      void trackFunnelEvent("answer_question_submit", {
        source,
        targetHref: pagePath || undefined,
        metadata: {
          context_question: contextQuestion ?? null,
          question_length: trimmed.question.length,
          has_situation_context: Boolean(trimmed.situation),
        },
      });

      toast({
        title: "Question received",
        description: "Thank you. This helps shape future No More Enabling answers.",
      });
      setForm({ name: "", email: "", question: "", situation: "" });
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
    <form onSubmit={handleSubmit} className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
      <input
        type="text"
        name="company"
        value={honeypot}
        onChange={(event) => setHoneypot(event.target.value)}
        className="absolute -left-[9999px] opacity-0"
        tabIndex={-1}
        autoComplete="off"
      />
      <div className="flex items-start gap-3">
        <HelpCircle className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Ask a family recovery question</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-foreground">What question should No More Enabling answer next?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use this when your family is searching for an answer that is not already here.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="question-name">Name</Label>
          <Input
            id="question-name"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div>
          <Label htmlFor="question-email">Email</Label>
          <Input
            id="question-email"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="family-question">Question</Label>
        <Textarea
          id="family-question"
          value={form.question}
          onChange={(event) => updateField("question", event.target.value)}
          placeholder="Example: How do we stop paying bills without cutting them off completely?"
          className="min-h-[96px]"
          required
        />
      </div>

      <div className="mt-4">
        <Label htmlFor="question-situation">Optional context</Label>
        <Textarea
          id="question-situation"
          value={form.situation}
          onChange={(event) => updateField("situation", event.target.value)}
          placeholder="A few details about what is happening in your family."
          className="min-h-[96px]"
        />
      </div>

      <Button type="submit" className="mt-5 w-full md:w-auto" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {isSubmitting ? "Sending..." : "Submit question"}
      </Button>
    </form>
  );
};

export default AnswerQuestionIntake;
