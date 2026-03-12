import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContactFormWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadTime] = useState(Date.now());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const formRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (honeypot) return;

    // Time-based spam check
    if (Date.now() - loadTime < 3000) {
      toast({ title: "Please wait a moment before submitting.", variant: "destructive" });
      return;
    }

    // Basic validation
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      toast({ title: "Please fill in all fields.", variant: "destructive" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast({ title: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-contact-form", {
        body: { name: trimmedName, email: trimmedEmail, message: trimmedMessage },
      });

      if (error) throw error;

      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setName("");
      setEmail("");
      setMessage("");
      setIsOpen(false);
    } catch (err) {
      console.error("Contact form error:", err);
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={formRef} className="fixed bottom-6 right-6 z-50">
      {/* Form panel */}
      {isOpen && (
        <div className="mb-3 w-80 rounded-xl border border-border bg-card shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="font-serif text-lg font-semibold text-foreground">Get in Touch</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close contact form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 p-4">
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute -left-[9999px] opacity-0"
              tabIndex={-1}
              autoComplete="off"
            />

            <div>
              <Label htmlFor="contact-name" className="text-xs">Name</Label>
              <Input
                id="contact-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={100}
                className="mt-1 h-9 text-sm"
              />
            </div>

            <div>
              <Label htmlFor="contact-email" className="text-xs">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                maxLength={255}
                className="mt-1 h-9 text-sm"
              />
            </div>

            <div>
              <Label htmlFor="contact-message" className="text-xs">Message</Label>
              <Textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                maxLength={1000}
                rows={3}
                className="mt-1 text-sm"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full" size="sm">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>
      )}

      {/* Floating trigger button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
        aria-label={isOpen ? "Close contact form" : "Open contact form"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
};

export default ContactFormWidget;
