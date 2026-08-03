import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { cn } from "@/lib/utils";
import { FREE_TOOLS, FREE_TOOL_SECTIONS, type FreeTool } from "@/data/freeTools";

const CHIP_TONE: Record<FreeTool["chips"][number]["tone"], string> = {
  time: "bg-muted text-muted-foreground",
  private: "bg-green-700/10 text-green-800",
  email: "bg-amber-600/10 text-amber-700",
  popular: "bg-primary/10 text-primary",
};

const ToolCard = ({ tool }: { tool: FreeTool }) => {
  const Icon = tool.icon;
  const body = (
    <>
      {tool.comingSoon && (
        <span className="absolute right-4 top-4 rounded-full border border-border bg-background px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wider text-muted-foreground">
          Coming soon
        </span>
      )}
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="text-[17px] font-semibold leading-snug text-foreground">{tool.title}</h3>
      <p className="flex-1 text-[13.5px] text-muted-foreground">{tool.description}</p>
      <div className="flex flex-wrap gap-2">
        {tool.chips.map((chip) => (
          <span
            key={chip.label}
            className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-bold", CHIP_TONE[chip.tone])}
          >
            {chip.label}
          </span>
        ))}
      </div>
      <span className="text-sm font-bold text-primary group-hover:underline">
        {tool.cta} {tool.comingSoon ? "" : "→"}
      </span>
    </>
  );

  const cardClass =
    "group relative flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-6 transition-all";

  if (tool.comingSoon) {
    return <div className={cn(cardClass, "border-dashed opacity-65")}>{body}</div>;
  }
  return (
    <Link
      to={tool.href}
      className={cn(cardClass, "hover:border-primary hover:shadow-[0_4px_24px_rgba(147,42,42,0.1)]")}
    >
      {body}
    </Link>
  );
};

const FreeTools = () => {
  return (
    <>
      <SEOHead
        title="Free Tools for Families Facing a Loved One's Addiction"
        description="Free interactive tools from No More Enabling: the Helping or Enabling self-check, Family Situation Assessment, Enabling Cost Calculator, Answer Center, glossary, email courses, and more. Most take under five minutes, and the private ones stay private."
        canonicalUrl="https://nomoreenabling.com/tools"
        keywords="free addiction family tools, am i enabling quiz, enabling cost calculator, family addiction assessment, boundaries course, addiction family resources"
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto max-w-6xl px-4 pb-16">
          {/* Hero */}
          <div className="pb-2 pt-14 text-center">
            <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">Free Tools</div>
            <h1 className="mx-auto mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
              Tools that turn reading into doing
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Every tool on this page is free, most take under five minutes, and the private ones
              stay private — what you type never leaves your browser unless you choose to send it.
            </p>
          </div>

          {/* Sections */}
          {FREE_TOOL_SECTIONS.map((section, index) => (
            <section key={section.key} className="mt-10">
              <div className="mb-5 flex items-baseline gap-4">
                <span className="font-serif text-3xl font-bold text-primary/35">{index + 1}</span>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">{section.sub}</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {FREE_TOOLS.filter((tool) => tool.section === section.key).map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          ))}

          {/* When a tool isn't enough */}
          <div className="mt-11 flex flex-wrap items-center gap-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
            <div className="min-w-[260px] flex-1">
              <h2 className="font-serif text-2xl font-bold">When a tool isn't enough</h2>
              <p className="mt-2 max-w-2xl text-sm opacity-90">
                Tools are for getting steady. Some situations need a guide — repeated relapse,
                treatment refusal, a family that can't get aligned. That's the work Matt has done
                with families since 2004. Start with the free Monday group, or go straight to a
                private session.
              </p>
            </div>
            <Link
              to="/work-with-matt"
              className="whitespace-nowrap rounded-full bg-primary-foreground px-7 py-3 font-bold text-primary transition-opacity hover:opacity-90"
            >
              Work With Matt →
            </Link>
          </div>

          <div className="mx-auto mt-10 max-w-2xl border-t border-border pt-5 text-center text-xs leading-relaxed text-muted-foreground">
            Every tool here is educational, not medical or financial advice. Private tools calculate
            in your browser and send nothing. In an emergency call 911; for mental-health crisis
            support call or text 988.
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FreeTools;
