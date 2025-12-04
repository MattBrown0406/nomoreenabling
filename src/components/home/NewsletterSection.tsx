import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('newsletter-signup', {
        body: { email, first_name: firstName || null }
      });

      if (error) {
        throw error;
      }

      if (data?.error === 'already_subscribed') {
        toast({
          title: "Already subscribed!",
          description: "This email is already on our list.",
          variant: "destructive",
        });
      } else if (data?.error) {
        toast({
          title: "Validation error",
          description: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome aboard!",
          description: "You've successfully subscribed to our newsletter.",
        });
        setEmail("");
        setFirstName("");
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-foreground/10 rounded-full mb-6">
            <Mail size={28} />
          </div>
          
          <h2 className="font-serif text-3xl md:text-4xl font-bold">
            Stay Connected
          </h2>
          
          <p className="mt-4 text-primary-foreground/80 text-lg">
            Get weekly insights on healthy relationships, boundary-setting, and personal growth 
            delivered straight to your inbox.
          </p>
          
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="First name (optional)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground flex-1"
                required
              />
              <Button 
                type="submit" 
                variant="coral" 
                size="default" 
                className="whitespace-nowrap"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-foreground/70">
            <Lock size={14} />
            <p>Your information is kept strictly confidential and will never be shared with third parties.</p>
          </div>
          
          <p className="mt-2 text-xs text-primary-foreground/60">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
