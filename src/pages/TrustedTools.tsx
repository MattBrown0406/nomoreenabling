import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { cn } from "@/lib/utils";
import {
  foundationBooks,
  jayBooks,
  freeSupport,
  homeTools,
  toolHref,
  type TrustedTool,
  type TrustedToolKind,
} from "@/data/trustedTools";

const KIND_CHIP: Record<TrustedToolKind, { label: string; className: string }> = {
  affiliate: { label: "Affiliate", className: "bg-amber-600/10 text-amber-700" },
  free: { label: "Free", className: "bg-green-700/10 text-green-800" },
  ours: { label: "Ours", className: "bg-primary/10 text-primary" },
};

const Chip = ({ kind }: { kind: TrustedToolKind }) => {
  const chip = KIND_CHIP[kind];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        chip.className,
      )}
    >
      <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
      {chip.label}
    </span>
  );
};

const ToolCard = ({ tool }: { tool: TrustedTool }) => {
  const isAffiliate = tool.kind === "affiliate";
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold leading-snug text-foreground">{tool.title}</h3>
        <Chip kind={tool.kind} />
      </div>
      <div className="text-sm font-medium text-muted-foreground">{tool.by}</div>
      <p className="flex-1 text-sm text-muted-foreground">{tool.description}</p>
      {tool.why && (
        <div className="rounded-xl bg-muted px-4 py-3 text-sm text-foreground">
          <span className="font-semibold text-primary">
            {tool.whyLabel ?? "Why Matt recommends it"}:
          </span>{" "}
          {tool.why}
        </div>
      )}
      <a
        href={toolHref(tool)}
        target="_blank"
        rel={isAffiliate ? "sponsored nofollow noopener" : "noopener"}
        className={cn(
          "mt-1 inline-block rounded-full px-5 py-2.5 text-center text-sm font-semibold transition-colors",
          isAffiliate
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "border-2 border-primary text-primary hover:bg-primary/5",
        )}
      >
        {tool.ctaLabel} →
      </a>
    </div>
  );
};

const SectionHead = ({ title, sub }: { title: string; sub: string }) => (
  <div className="mb-6">
    <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
    <p className="mt-2 max-w-3xl text-muted-foreground">{sub}</p>
  </div>
);

const TrustedTools = () => {
  return (
    <>
      <SEOHead
        title="Trusted Tools & Books We Recommend to Families"
        description="The books, support groups, and practical tools Matt Brown actually recommends to families facing a loved one's addiction — with every affiliate link clearly marked and free options listed first."
        canonicalUrl="https://nomoreenabling.com/trusted-tools"
        keywords="best books for families of addicts, love first jeff jay, beyond addiction book, craft approach book, codependency books, medication lock box, family addiction resources"
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto max-w-6xl px-4 pb-16">
          {/* Hero */}
          <div className="pt-14 pb-4 text-center">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Trusted Tools
            </div>
            <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
              The books and tools we actually recommend to families
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Everything on this page is something Matt recommends in real conversations with
              real families — nothing is here because someone paid to be here.
            </p>

            {/* Disclosure */}
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-primary/20 bg-primary/5 p-6 text-left text-sm leading-relaxed">
              <p>
                <strong className="text-primary">Read this first — how this page makes money.</strong>{" "}
                Some links below are affiliate links, which means if you buy through them, No More
                Enabling earns a small commission at no extra cost to you. Every affiliate link is
                marked. Free resources are marked too, and they're listed right beside the paid ones.
              </p>
              <p className="mt-3">
                <strong className="text-primary">What we will never do:</strong> we do not accept
                referral fees from treatment centers, and no facility can pay to be recommended by
                us. Where your loved one goes for treatment should never depend on who paid whom.
              </p>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-600/10 px-3 py-1.5 text-amber-700">
                <span className="h-2 w-2 rounded-full bg-current" /> Affiliate link — we may earn a commission
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-700/10 px-3 py-1.5 text-green-800">
                <span className="h-2 w-2 rounded-full bg-current" /> Free resource — no money involved
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-primary">
                <span className="h-2 w-2 rounded-full bg-current" /> Ours — built by No More Enabling
              </span>
            </div>
          </div>

          {/* Family Squares band */}
          <div className="mt-8 flex flex-wrap items-center gap-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-primary-foreground">
            <div className="min-w-[260px] flex-1">
              <span className="inline-block rounded-full bg-primary-foreground/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
                Free · Every Monday · Live on Zoom
              </span>
              <h2 className="mt-3 font-serif text-2xl font-bold">
                Before you buy anything — come to The Family Squares
              </h2>
              <p className="mt-2 max-w-2xl text-sm opacity-90">
                Sober Helpline's free weekly family support group, hosted live by Matt. Bring the
                question that's keeping you up at night and talk it through with families who get
                it. No cost, no signup fee, no catch — just Monday nights.
              </p>
            </div>
            <a
              href="https://soberhelpline.com/monday-zoom-registration"
              target="_blank"
              rel="noopener"
              className="whitespace-nowrap rounded-full bg-primary-foreground px-7 py-3 font-bold text-primary transition-opacity hover:opacity-90"
            >
              Save my spot →
            </a>
          </div>

          {/* Foundation books */}
          <section className="mt-12">
            <SectionHead
              title="Books that change how families think"
              sub="If you only do one thing this week, read one of these. They're listed in the order most families should read them."
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {foundationBooks.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {/* Jay collection */}
          <section className="mt-12">
            <SectionHead
              title="The intervention shelf — Jeff & Debra Jay"
              sub="When the conversation has to become an intervention, this is the family of books Matt points families to. The Jays wrote the modern playbook for loving, structured intervention."
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {jayBooks.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {/* Free support */}
          <section className="mt-12">
            <SectionHead
              title="Support that costs nothing"
              sub="These aren't affiliate links. They're here because families need them, and because a recommendations page you can trust has to include the free options too."
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {freeSupport.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {/* Home tools */}
          <section className="mt-12">
            <SectionHead
              title="Practical tools for the house"
              sub="Unglamorous, useful things families ask us about every week."
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {homeTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {/* Ours */}
          <div className="mt-12 flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-card p-8">
            <div className="min-w-[260px] flex-1">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  The tools we built ourselves
                </h2>
                <Chip kind="ours" />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Sober Helpline is our family support app — daily check-ins, boundary tools, an AI
                practice partner for the hard conversations, and a direct line to Matt when things
                escalate. The free Boundaries Course runs by email. These are ours, so no affiliate
                games: if you buy, we're the ones you're buying from, and we're the ones accountable
                to you.
              </p>
            </div>
            <a
              href="https://soberhelpline.com"
              target="_blank"
              rel="noopener"
              className="whitespace-nowrap rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Explore Sober Helpline →
            </a>
          </div>

          {/* Full disclosure */}
          <div className="mx-auto mt-12 max-w-3xl border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
            <p>
              <strong>Full disclosure.</strong> As an Amazon Associate, No More Enabling earns from
              qualifying purchases. Affiliate commissions help keep this site's 180+ articles free
              and ad-light. Prices are the same for you either way.
            </p>
            <p className="mt-2">
              We choose what appears on this page first, then look for an affiliate program second —
              never the reverse. No treatment provider, rehab, or telehealth company has paid for
              placement anywhere on this site, and we do not accept per-admission or per-lead
              referral fees.
            </p>
            <p className="mt-2">
              This page is educational and is not medical advice. In an emergency, call 911. For
              mental-health crisis support, call or text 988.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TrustedTools;
