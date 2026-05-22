import { Link } from "react-router-dom";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";
import { withOwnedUtm } from "@/lib/ownedLinks";
import PhoneCallButton from "@/components/PhoneCallButton";

interface CoachingInterventionCTAProps {
  variant?: "compact" | "wide";
  articleSlug?: string;
}

const soberHelplineBridgeHref = withOwnedUtm("https://soberhelpline.com/from-no-more-enabling", {
  medium: "article_cta",
  campaign: "soberhelpline_bridge",
  content: "coaching_intervention_cta",
});

const freedomBridgeHref = withOwnedUtm("https://freedominterventions.com/from-no-more-enabling", {
  medium: "article_cta",
  campaign: "intervention_consult",
  content: "coaching_intervention_cta",
});

const CoachingInterventionCTA = ({ variant = "wide", articleSlug }: CoachingInterventionCTAProps) => {
  const isCompact = variant === "compact";
  const trackSoberHelplineBridge = () => {
    void trackFunnelEvent("outbound_offer_click", {
      source: "coaching_intervention_cta",
      articleSlug,
      targetHref: soberHelplineBridgeHref,
      metadata: {
        ownedBrand: "sober-helpline",
        placement: variant,
      },
    });
  };

  const trackFreedomBridge = () => {
    void trackFunnelEvent("outbound_offer_click", {
      source: "coaching_intervention_cta",
      articleSlug,
      targetHref: freedomBridgeHref,
      metadata: {
        ownedBrand: "freedom-interventions",
        placement: variant,
      },
    });
  };

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
            <a href={freedomBridgeHref} target="_blank" rel="noreferrer" onClick={trackFreedomBridge}>
              <MessageCircle className="h-4 w-4" />
              High-risk intervention help
            </a>
          </Button>
          <Button variant="secondary" asChild>
            <a href={soberHelplineBridgeHref} target="_blank" rel="noreferrer" onClick={trackSoberHelplineBridge}>
              Live support lane
              <ArrowRight className="h-4 w-4" />
            </a>
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
