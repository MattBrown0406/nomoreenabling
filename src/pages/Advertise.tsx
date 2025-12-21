import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import AdSpace from "@/components/ads/AdSpace";
import { Check, Mail, Phone, MessageSquare } from "lucide-react";

const Advertise = () => {
  const adPlacements = [
    {
      name: "Leaderboard Banner",
      size: "728×90",
      location: "Homepage, below hero section",
      visibility: "High - Above the fold",
      priceMonthly: "$500/month",
      priceQuarterly: "$1,000/quarter",
    },
    {
      name: "Sidebar Ad",
      size: "300×250",
      location: "Article pages & homepage sidebar",
      visibility: "High - Persistent on scroll",
      priceMonthly: "$400/month",
      priceQuarterly: "$800/quarter",
    },
    {
      name: "Inline Content Ad",
      size: "728×90",
      location: "Within article content",
      visibility: "Medium - Contextual placement",
      priceMonthly: "$250/month",
      priceQuarterly: "$500/quarter",
    },
  ];

  const benefits = [
    "Reach a highly engaged audience interested in self-improvement",
    "Target readers actively seeking wellness and personal growth content",
    "Support a mission-driven publication",
    "Flexible ad formats and placements",
    "Monthly and quarterly packages available",
    "Dedicated account support",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brick-light/50 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Advertise With <span className="text-primary">Us</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Connect your brand with our engaged community of readers seeking 
                personal growth, healthy relationships, and positive change.
              </p>
            </div>
          </div>
        </section>

        {/* Ad Placements */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">
              Available Ad Placements
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {adPlacements.map((placement) => (
                <div key={placement.name} className="bg-card rounded-xl p-6 shadow-card">
                  <div className="mb-4">
                    <AdSpace size="sidebar" className="h-32" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                    {placement.name}
                  </h3>
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-lg font-bold text-primary">{placement.priceMonthly}</p>
                    <p className="text-sm text-muted-foreground">or {placement.priceQuarterly} <span className="text-primary font-medium">(Save!)</span></p>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>Size:</strong> {placement.size}</li>
                    <li><strong>Location:</strong> {placement.location}</li>
                    <li><strong>Visibility:</strong> {placement.visibility}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">
                Why Advertise With Us?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <Check size={14} className="text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                Get Started Today
              </h2>
              <p className="text-muted-foreground mb-8">
                Ready to reach our audience? Contact our advertising team to 
                discuss packages and pricing.
              </p>
              <div className="flex justify-center">
                <a href="mailto:matt@nomoreenabling.com">
                  <Button variant="hero" size="lg">
                    <Mail size={18} />
                    matt@nomoreenabling.com
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Advertise;
