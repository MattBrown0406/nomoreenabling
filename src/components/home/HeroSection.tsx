import { useRef } from "react";
import { ArrowRight, BookOpenCheck, HeartHandshake, Route, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

import HeroConversation, {
  RECOGNITION_PHRASES,
  recognitionPhraseIndex,
  useConversationTimeline,
} from "@/components/home/HeroConversation";

import PhoneCallButton from "@/components/PhoneCallButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import { trackGAConversion } from "@/lib/gaConversions";
import "./HeroSection.css";

const nextSteps = [
  {
    eyebrow: "NAME THE PATTERN",
    title: "Helping or enabling?",
    description: "See where care has quietly turned into rescue, protection, or control.",
    cta: "Use the free tool",
    href: "/helping-or-enabling",
    icon: HeartHandshake,
    event: "helping_or_enabling_click",
  },
  {
    eyebrow: "CHANGE YOUR PART",
    title: "Build a boundary",
    description: "Create limits you can explain clearly and actually hold under pressure.",
    cta: "Open the boundaries course",
    href: "/boundaries-course",
    icon: Route,
    event: "boundaries_course_click",
  },
  {
    eyebrow: "RISK IS RISING",
    title: "Get professional direction",
    description: "Know when addiction has moved beyond another family conversation.",
    cta: "Explore intervention help",
    href: "/intervention-help",
    icon: ShieldAlert,
    event: "intervention_help_click",
  },
] as const;

const HeroSection = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const timeline = useConversationTimeline(sceneRef);
  const phraseIndex = recognitionPhraseIndex(timeline);

  const scrollToNewsletter = () => {
    document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="nme-hero" aria-labelledby="nme-hero-title">
      <div className="nme-paper-noise" aria-hidden="true" />
      <div className="nme-hero-inner">
        <div className="nme-hero-main">
          <div className="nme-hero-copy">
            <div className="nme-hero-eyebrow">
              <span className="nme-stop-mark">NO</span>
              <span>For families who love someone with an addiction</span>
            </div>

            <h1 id="nme-hero-title">
              It’s 2 a.m., and you’re still holding it all together.
              <span>You don’t have to do this alone.</span>
            </h1>

            <p className="nme-hero-recognition">
              <span className="sr-only">
                Maybe you've {RECOGNITION_PHRASES.join(" Or ")}
              </span>
              <span aria-hidden="true">
                Maybe you’ve{" "}
                <span key={phraseIndex} className="nme-recognition-phrase">
                  {RECOGNITION_PHRASES[phraseIndex]}
                </span>
              </span>
            </p>

            <p className="nme-hero-lead">
              That’s not weakness. It’s love without a plan. Learn where helping ends and enabling begins, and how to answer the next crisis differently.
            </p>
            <p className="nme-hero-credential">
              Free, practical guidance from Matt Brown, a professional interventionist working with families since 2004.
            </p>

            <div className="nme-hero-actions">
              <Link
                to="/family-situation-assessment"
                className="nme-hero-button nme-hero-button-primary"
                onClick={() => trackGAConversion("assessment_started", { source: "homepage_animated_hero" })}
              >
                Find my next step
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link
                to="/start-here"
                className="nme-hero-button nme-hero-button-secondary"
                onClick={() => trackGAConversion("start_here_click", { source: "homepage_animated_hero" })}
              >
                <BookOpenCheck aria-hidden="true" />
                Start with enabling help
              </Link>
            </div>

            <div className="nme-hero-contact-row">
              <PhoneCallButton
                source="homepage_animated_hero"
                size="lg"
                variant="hero-outline"
                className="nme-hero-phone"
              />
              <WhatsAppButton
                source="homepage_animated_hero"
                size="lg"
                variant="outline"
                className="nme-hero-whatsapp border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                label="WhatsApp"
              />
              <button type="button" onClick={scrollToNewsletter} className="nme-email-link">
                Prefer email? Get practical guidance.
              </button>
            </div>

            <a href="/next-step" className="block mt-5 rounded-lg border border-primary/30 bg-background p-4 text-foreground hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              <strong className="block">Not ready to call?</strong>
              <span className="underline">Make a plan for your next step</span>
            </a>

            <div className="nme-hero-trust">
              <span><i aria-hidden="true" />No shame</span>
              <span><i aria-hidden="true" />No forced abandonment</span>
              <span><i aria-hidden="true" />No more carrying it alone</span>
            </div>
          </div>

          <HeroConversation timeline={timeline} sceneRef={sceneRef} />
        </div>

        <div className="nme-next-steps" aria-label="Choose your starting point">
          <div className="nme-next-heading">
            <span>Choose the part you can change today</span>
            <small>You do not have to solve the addiction before you begin helping differently.</small>
          </div>
          <div className="nme-next-grid">
            {nextSteps.map((step) => (
              <Link
                key={step.href}
                to={step.href}
                className="nme-next-card"
                onClick={() => trackGAConversion(step.event, { source: "homepage_animated_hero", label: step.title })}
              >
                <span className="nme-next-icon"><step.icon aria-hidden="true" /></span>
                <span className="nme-next-copy">
                  <small>{step.eyebrow}</small>
                  <strong>{step.title}</strong>
                  <em>{step.description}</em>
                </span>
                <span className="nme-next-arrow" aria-label={step.cta}><ArrowRight aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
