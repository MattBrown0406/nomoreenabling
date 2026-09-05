import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { useEnrollGuard } from "@/lib/enrollGuard";

/**
 * The Enabling Cost Calculator — a private, client-side tally of what
 * protecting the addiction has cost the family over the last 12 months.
 *
 * Privacy contract (stated on the page, honored in code): the dollar amounts
 * never leave the browser. The only analytics fired are countable events
 * (opened / completed) with no financial data attached.
 */

interface LineItem {
  id: string;
  category: "living" | "rescue" | "legal";
  label: string;
  hint: string;
}

const LINE_ITEMS: LineItem[] = [
  { id: "rent", category: "living", label: "Rent or mortgage payments you covered", hint: "Their place, or them living with you rent-free while using" },
  { id: "bills", category: "living", label: "Phone, utilities & insurance bills", hint: "The accounts that somehow stayed in your name" },
  { id: "food", category: "living", label: "Groceries, gas & everyday money", hint: "The twenties that were \"just for food\"" },
  { id: "car", category: "living", label: "Car payments, repairs & insurance", hint: "Including the cars that got totaled or disappeared" },
  { id: "cash", category: "rescue", label: "Direct cash given", hint: "Handed over, sent, or \"borrowed\" — your honest 12-month total" },
  { id: "debts", category: "rescue", label: "Debts you paid off for them", hint: "Credit cards, payday loans, money owed to dangerous people" },
  { id: "bail", category: "rescue", label: "Bail, impound, tickets & fines", hint: "Every time the consequence arrived and you absorbed it" },
  { id: "legalfees", category: "legal", label: "Lawyers & court costs", hint: "DUIs, charges, custody battles the addiction caused" },
  { id: "damage", category: "legal", label: "Property damage & replacements", hint: "Walls, doors, wrecked vehicles, things broken or pawned" },
  { id: "stolen", category: "legal", label: "Money or valuables taken and never returned", hint: "It counts, even if you never said it out loud" },
];

const CATEGORIES: { key: LineItem["category"]; title: string; sub: string }[] = [
  { key: "living", title: "Housing & daily living", sub: "The recurring costs that quietly became yours — your best estimate for the last 12 months." },
  { key: "rescue", title: "Cash & rescues", sub: "The emergencies and the loans that were never loans — over the last 12 months." },
  { key: "legal", title: "Legal & damage", sub: "What the consequences cost when they landed on you — in the last 12 months." },
];


const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

type CaptureState = "idle" | "sending" | "done" | "already" | "error";

/**
 * The Money Plan capture — shown on the calculator results screen, the warmest
 * moment on the site. Enrolls via course-enroll (course_name: "money-plan");
 * Day 1 arrives instantly, Days 2-5 arrive daily via the money-plan cron.
 */
const MoneyPlanCapture = () => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<CaptureState>("idle");
  const { honeypotProps, guardFields } = useEnrollGuard();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    const trimmed = email.trim();
    if (!trimmed) return;
    setState("sending");
    void trackFunnelEvent("email_capture_attempt", { source: "calculator_money_plan" });
    try {
      const { data, error } = await supabase.functions.invoke("course-enroll", {
        body: { email: trimmed, first_name: firstName.trim() || null, course_name: "money-plan", ...guardFields() },
      });
      if (error) {
        // FunctionsHttpError: read the body for the already_enrolled case.
        const ctx = (error as { context?: Response }).context;
        let code = "";
        try {
          code = ctx ? ((await ctx.json()) as { error?: string }).error ?? "" : "";
        } catch {
          code = "";
        }
        if (code === "already_enrolled") {
          setState("already");
          return;
        }
        void trackFunnelEvent("email_capture_failure", { source: "calculator_money_plan" });
        setState("error");
        return;
      }
      const result = (data ?? {}) as { success?: boolean; already_enrolled?: boolean };
      if (result.already_enrolled) {
        setState("already");
        return;
      }
      if (result.success) {
        void trackFunnelEvent("email_capture_success", { source: "calculator_money_plan" });
        setState("done");
        return;
      }
      setState("error");
    } catch {
      void trackFunnelEvent("email_capture_failure", { source: "calculator_money_plan" });
      setState("error");
    }
  };

  if (state === "done" || state === "already") {
    return (
      <div className="mt-8 rounded-2xl border border-green-700/30 bg-green-700/5 p-7 text-center">
        <h3 className="font-serif text-2xl font-bold text-foreground">
          {state === "done" ? "Day 1 is on its way to your inbox." : "You're already on the plan."}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {state === "done"
            ? "The Pause Rule arrives in the next few minutes — read it before the next request comes. Days 2 through 5 arrive each morning after."
            : "Check your inbox (and spam folder) — the five days of the Money Plan are already headed your way."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 rounded-2xl border-2 border-primary/30 bg-card p-7">
      <input {...honeypotProps} />
      <div className="text-xs font-extrabold uppercase tracking-[0.15em] text-accent">Free · 5 short emails</div>
      <h3 className="mt-1 font-serif text-2xl font-bold text-foreground">
        Get the Money Plan: 5 days to stop the bleed
      </h3>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Day 1 — the Pause Rule — lands in your inbox immediately. Then one short email a day:
        the script for the next request, what to fund instead, getting your spouse aligned, and
        when it's time for more. Written by Matt, from the interventions where this works.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name (optional)"
          className="rounded-lg border-[1.5px] border-border bg-background px-4 py-3 text-[15px] text-foreground focus:border-primary focus:outline-none sm:w-44"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="flex-1 rounded-lg border-[1.5px] border-border bg-background px-4 py-3 text-[15px] text-foreground focus:border-primary focus:outline-none"
        />
        <Button type="submit" disabled={state === "sending"} className="rounded-full px-7 py-6 text-[15px] font-bold">
          {state === "sending" ? "Sending…" : "Send me Day 1"}
        </Button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-sm text-primary">
          That didn't go through — check the address and try again.
        </p>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        Your calculator numbers are never attached to your email — they stay on this page. Unsubscribe anytime.
      </p>
    </form>
  );
};

const EnablingCostCalculator = () => {
  const [values, setValues] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const setValue = (id: string, raw: string) => {
    const v = Math.max(0, parseFloat(raw) || 0);
    setValues((prev) => ({ ...prev, [id]: v }));
  };

  const categoryTotal = (cat: LineItem["category"]) =>
    LINE_ITEMS.filter((i) => i.category === cat).reduce((sum, i) => sum + (values[i.id] ?? 0), 0);

  const total = useMemo(
    () => LINE_ITEMS.reduce((sum, i) => sum + (values[i.id] ?? 0), 0),
    [values],
  );


  const reveal = () => {
    if (total <= 0) return;
    setShowResults(true);
    // Count that the tool was used. No amounts are ever sent.
    void trackFunnelEvent("calculator_completed", { source: "enabling-cost-calculator" });
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const recalc = () => {
    setShowResults(false);
    requestAnimationFrame(() => heroRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <>
      <SEOHead
        title="The Enabling Cost Calculator — What Has Addiction Cost Your Family?"
        description="A private calculator for families: add up what protecting a loved one's addiction has cost over the last 12 months — rent, cash, bail, lawyers — and see what that money could have funded instead. Nothing you enter is saved or sent."
        canonicalUrl="https://nomoreenabling.com/enabling-cost-calculator"
        keywords="enabling cost calculator, cost of enabling addiction, financial enabling, money spent on addicted family member, how much does enabling cost, financial boundaries addiction"
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto max-w-3xl px-4 pb-16">
          {/* Hero */}
          <div ref={heroRef} className="pt-14 pb-2 text-center">
            <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
              The Enabling Cost Calculator
            </div>
            <h1 className="mx-auto mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
              What has protecting the addiction actually cost you?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Most families have never added it up — because the number lives in a hundred small
              "one last times." Think back over <strong className="text-foreground">just the last 12 months</strong> and
              add it up once. Gently. It changes how the next request sounds.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-700/10 px-4 py-2 text-[13px] font-semibold text-green-800">
                🔒 The amounts you enter stay on this page — never saved, never sent
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[13px] font-bold text-primary">
                📅 Last 12 months only — rough estimates are fine
              </span>
            </div>
          </div>

          {/* Categories */}
          {CATEGORIES.map((cat) => (
            <section key={cat.key} className="mt-8">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="font-serif text-xl font-bold text-foreground">{cat.title}</h2>
                  <span className="whitespace-nowrap text-sm font-extrabold tabular-nums text-primary">
                    {fmt(categoryTotal(cat.key))}
                  </span>
                </div>
                <p className="mt-1 mb-4 text-sm text-muted-foreground">{cat.sub}</p>
                {LINE_ITEMS.filter((i) => i.category === cat.key).map((item) => (
                  <div key={item.id} className="flex items-center gap-4 border-t border-border py-3">
                    <label htmlFor={`cc-${item.id}`} className="flex-1 text-[15px] text-foreground">
                      {item.label}
                      <span className="block text-xs font-normal text-muted-foreground">{item.hint}</span>
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <input
                        id={`cc-${item.id}`}
                        type="number"
                        min={0}
                        inputMode="numeric"
                        onChange={(e) => setValue(item.id, e.target.value)}
                        className="w-[130px] rounded-lg border-[1.5px] border-border bg-background py-2.5 pl-6 pr-3 text-right text-[15px] font-semibold tabular-nums text-foreground focus:border-primary focus:bg-card focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Sticky running total */}
          <div className="sticky bottom-0 z-10 mt-8 flex flex-wrap items-center justify-between gap-4 rounded-t-2xl bg-foreground px-6 py-4 text-background shadow-[0_-6px_30px_rgba(0,0,0,0.12)]">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-75">Running total</div>
              <div className="font-serif text-3xl font-bold tabular-nums">{fmt(total)}</div>
            </div>
            <Button
              onClick={reveal}
              disabled={total <= 0}
              className="rounded-full bg-background px-7 py-6 text-[15px] font-bold text-foreground hover:bg-background/90"
            >
              See what it means →
            </Button>
          </div>

          {/* Results */}
          {showResults && (
            <div ref={resultsRef} className="pt-12">
              <div className="text-center">
                <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">Your number</div>
                <div className="mt-2 font-serif text-6xl font-bold tabular-nums text-primary">{fmt(total)}</div>
                <p className="mx-auto mt-3 max-w-xl text-[17px] text-foreground">
                  That's what your family reported spending in response to addiction-related situations{" "}
                  <strong>in the last 12 months alone</strong> — about{" "}
                  <strong>{fmt(total / 12)}</strong> every month. This total does not prove that every expense caused or sustained addiction.
                </p>
                <p className="mx-auto mt-5 max-w-lg rounded-xl bg-foreground px-6 py-4 text-background">
                  If spending continued at exactly the same pace, the arithmetic projection would be{" "}
                  <strong className="font-serif text-xl">{fmt(total * 5)}</strong> over the next five years.
                </p>
              </div>


              <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-7 text-[15.5px] leading-relaxed">
                <p>
                  <strong className="text-primary">Read this before the shame shows up.</strong> You
                  didn't spend this money because you're foolish. You spent it because you love
                  someone, and every single payment felt like the thing standing between them and
                  disaster. That instinct is not your flaw — it's your best quality, aimed at a
                  disease that exploits it.
                </p>
                <p className="mt-3">
                  Here's the part that matters:{" "}
                  <strong className="text-primary">
                    this number can change when the family changes what it is willing to fund.
                  </strong>{" "}
                  Not by cutting them off. By changing what you'll fund — treatment, assessment, a
                  ride to a meeting — and what you won't.
                </p>
              </div>

              <MoneyPlanCapture />

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline" className="rounded-full border-2 border-primary px-7 py-6 text-[15px] font-bold text-primary">
                  <Link to="/topic-hubs/financial-enabling">Get the Financial Boundaries Script — free</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-2 border-primary px-7 py-6 text-[15px] font-bold text-primary">
                  <Link to="/work-with-matt">Talk it through with Matt</Link>
                </Button>
              </div>

              <button
                onClick={recalc}
                className="mx-auto mt-6 block text-sm text-muted-foreground underline"
              >
                ← Change my numbers
              </button>
            </div>
          )}

          <div className="mx-auto mt-12 max-w-2xl border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
            This tool is for reflection and education, not financial or medical advice. The dollar
            amounts you enter are calculated entirely in your browser and are never stored or
            transmitted — we count only that the tool was used, never what was typed. Treatment cost
            comparisons are rough national estimates. If your family is in immediate danger, call
            911; for mental-health crisis support, call or text 988.
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default EnablingCostCalculator;
