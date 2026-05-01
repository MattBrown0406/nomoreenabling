import { Link } from "react-router-dom";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CoachingInterventionCTAProps {
  variant?: "compact" | "wide";
}

const CoachingInterventionCTA = ({ variant = "wide" }: CoachingInterventionCTAProps) => {
  const isCompact = variant === "compact";

  return (
    <section className={isCompact ? "" : "container mx-auto px-4 py-10"}>
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
        <p className="text-sm uppercase tracking-wide text-primary font-medium">When your family needs a real plan</p>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mt-2">
          Coaching and intervention guidance with Matt Brown
        </h2>
        <p className="mt-3 text-muted-foreground">
          If articles are helping but the situation at home is still escalating, you can ask for direct help with family alignment,
          boundaries, treatment refusal, relapse patterns, or deciding whether an intervention makes sense.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <Link to="/work-with-matt">
              Request guidance
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/support/freedom-interventions">
              <MessageCircle className="h-4 w-4" />
              Intervention support
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <a href="mailto:matt@nomoreenabling.com?subject=Family%20coaching%20or%20intervention%20guidance">
              <Mail className="h-4 w-4" />
              Email Matt
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CoachingInterventionCTA;
