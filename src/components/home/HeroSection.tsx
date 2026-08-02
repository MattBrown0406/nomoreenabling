import { ArrowRight, BookOpenCheck, HeartHandshake, Route, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

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
              <span>Helping should not cost you your whole life</span>
            </div>

            <h1 id="nme-hero-title">
              Break the cycle
              <span>without abandoning the person you love.</span>
            </h1>

            <p className="nme-hero-lead">
              Learn where helping ends and enabling begins—then take the next step with boundaries that protect your family and leave room for real change.
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

            <div className="nme-hero-trust">
              <span><i aria-hidden="true" />No shame</span>
              <span><i aria-hidden="true" />No forced abandonment</span>
              <span><i aria-hidden="true" />No more carrying it alone</span>
            </div>
          </div>

          <div className="nme-cycle-scene" aria-label="An animated cycle of crisis, rescue, relief, and repetition interrupted by a firm boundary">
            <div className="nme-cycle-ring" aria-hidden="true" />
            <div className="nme-cycle-current" aria-hidden="true" />
            <div className="nme-cycle-dot" aria-hidden="true" />

            <div className="nme-cycle-node nme-node-crisis">
              <small>01</small>
              <strong>Crisis</strong>
              <span>Something blows up.</span>
            </div>
            <div className="nme-cycle-node nme-node-rescue">
              <small>02</small>
              <strong>Rescue</strong>
              <span>You absorb it.</span>
            </div>
            <div className="nme-cycle-node nme-node-relief">
              <small>03</small>
              <strong>Relief</strong>
              <span>The pressure drops.</span>
            </div>
            <div className="nme-cycle-node nme-node-repeat">
              <small>04</small>
              <strong>Repeat</strong>
              <span>Nothing changes.</span>
            </div>

            <div className="nme-cycle-center">
              <span>THE PATTERN CAN CHANGE</span>
              <strong>Your part is where<br />change begins.</strong>
            </div>

            <div className="nme-boundary-gate" aria-hidden="true">
              <span>SET A BOUNDARY</span>
            </div>

            <div className="nme-exit-path" aria-hidden="true">
              <span className="nme-exit-line" />
              <span className="nme-exit-arrow">→</span>
            </div>

            <div className="nme-different-response">
              <small>A DIFFERENT RESPONSE</small>
              <strong>Care without carrying</strong>
              <span>Clear boundary</span>
              <span>Natural consequence</span>
              <span>Support real recovery</span>
            </div>
          </div>
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
