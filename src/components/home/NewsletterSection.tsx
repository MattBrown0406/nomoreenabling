import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Welcome aboard!",
        description: "You've successfully subscribed to our newsletter.",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-16 bg-primary text-primary-foreground">
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
          
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground"
              required
            />
            <Button type="submit" variant="coral" size="default" className="whitespace-nowrap">
              Subscribe
            </Button>
          </form>
          
          <p className="mt-4 text-xs text-primary-foreground/60">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
