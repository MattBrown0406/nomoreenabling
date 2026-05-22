import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeDollarSign, CheckCircle2, HeartHandshake, ShieldAlert, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/family-trauma-after-addiction.jpg";
import PhoneCallButton from "@/components/PhoneCallButton";

const trustPoints = [
  "20+ years of intervention experience",
  "Direct guidance for families under stress",
  "Clear next steps instead of vague encouragement",
];

const routeTiles = [
  {
    title: "Enabling help",
    description: "Sort helping, rescuing, money, boundaries, and guilt.",
    href: "/start-here",
    icon: HeartHandshake,
    className: "border-amber-200/70 bg-amber-50/95 text-amber-950",
  },
  {
    title: "Intervention guidance",
    description: "For refusal, escalation, relapse, or family division.",
    href: "/intervention-help",
    icon: ShieldAlert,
    className: "border-red-200/70 bg-red-50/95 text-red-950",
  },
  {
    title: "Family support",
    description: "Use assessment, support calls, and calmer next steps.",
    href: "/family-situation-assessment",
    icon: Users,
    className: "border-emerald-200/70 bg-emerald-50/95 text-emerald-950",
  },
  {
    title: "Advertise",
    description: "Reach families and recovery decision-makers ethically.",
    href: "/advertise/media-kit",
    icon: BadgeDollarSign,
    className: "border-sky-200/70 bg-sky-50/95 text-sky-950",
  },
];

const HeroSection = () => {
  const scrollToNewsletter = () => {
    const element = document.getElementById("newsletter");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-maroon">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-background" aria-hidden="true" />

      <div className="container mx-auto px-4 relative pt-16 pb-8 md:pt-24 md:pb-10">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-white/15 text-white rounded-full text-sm font-medium mb-6 animate-fade-up backdrop-blur-sm border border-white/20">
            Family guidance for addiction and enabling
          </span>

          <h1
            className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Stop guessing what to do next
          </h1>

          <p
            className="mt-6 text-lg md:text-xl text-white/85 max-w-3xl mx-auto animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            No More Enabling helps families move from search panic into the right lane:
            enabling education, intervention guidance, family support, or a private next-step consultation.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button variant="hero" size="lg" asChild>
              <Link to="/family-situation-assessment">
                Take the family assessment
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button
              variant="hero-outline"
              size="lg"
              className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-maroon"
              asChild
            >
              <Link to="/intervention-help">
                Intervention help
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-maroon"
              asChild
            >
              <Link to="/family-addiction-coaching">
                Family coaching
              </Link>
            </Button>
            <PhoneCallButton
              source="hero_section"
              size="lg"
              variant="hero-outline"
              className="border-white bg-white text-maroon hover:bg-white/90 hover:text-maroon"
            />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm animate-fade-up" style={{ animationDelay: "0.35s" }}>
            {trustPoints.map((point) => (
              <div key={point} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white/85 backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-white" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm text-white/75 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            Prefer email? <button onClick={scrollToNewsletter} className="text-white underline underline-offset-4 hover:text-white/80">Get practical family guidance by email</button>.
          </p>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-4 animate-fade-up" style={{ animationDelay: "0.45s" }}>
          {routeTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.href}
                to={tile.href}
                className={`group rounded-2xl border p-4 shadow-card transition-all hover:-translate-y-1 hover:shadow-hover ${tile.className}`}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-white/70 p-2">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-bold">{tile.title}</h2>
                    <p className="mt-1 text-sm opacity-80">{tile.description}</p>
                    <p className="mt-3 text-sm font-semibold inline-flex items-center gap-1">
                      Start here
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
