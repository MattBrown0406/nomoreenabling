import { useEffect, useRef, useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import logo from "@/assets/logo.jpg";
import "./NextStep.css";

const safety = "In the U.S., call 911 for immediate danger or a suspected overdose. Call or text 988 for a suicide or mental health crisis. Outside the U.S., use your local emergency or crisis service. Do not wait for a contact-form reply.";
const paths = [
  { id: "options", label: "Understanding my options", question: "What would be most useful to understand?", choices: ["Support for me", "Treatment and professional guidance"] },
  { id: "conversation", label: "Preparing a family conversation", question: "What would help you prepare?", choices: ["Finding the words", "Setting a boundary"] },
  { id: "concern", label: "An immediate concern", question: "You do not need to finish a guide to get urgent help.", choices: ["See immediate safety steps", "Plan after urgent help is in place"] },
] as const;
type PathId = typeof paths[number]["id"];
type Guide = { title: string; intro: string; steps: string[]; words: string; today: string };

function makeGuide(path: PathId, choice: number): Guide {
  if (path === "options") return {
    title: choice === 0 ? "Make room for support for you" : "Explore professional support without committing today",
    intro: "You can ask questions and get support even if your loved one is not ready to change. You do not have to solve everything at once.",
    steps: [
      choice === 0 ? "Identify one support person: a trusted friend, a licensed counselor, or a family peer-support group. Ask about confidentiality, cost, and what the first meeting involves." : "Write down what you have directly observed and the questions you want answered. A licensed clinician can assess treatment needs; family coaching can help with your own responses but does not replace medical care.",
      "Separate what you can decide—your time, money, and participation—from another adult’s treatment choices. Support can be an offer, not a demand.",
      choice === 0 ? "Choose one small, sustainable limit, such as taking a break from late-night arguments. Boundaries describe what you will do; they are not punishment." : "Ask providers about licensing, assessment, treatment approaches, total costs, insurance, and family involvement. Be cautious of guaranteed outcomes or pressure to pay immediately.",
      "Do not attempt forced detox or manage withdrawal on your own. Alcohol and sedative withdrawal can be dangerous; seek qualified medical advice about safe care.",
    ],
    words: "I care about you, and I am getting support to make steadier decisions for myself. I can help you explore care if you want it.",
    today: choice === 0 ? "Choose one person or group to learn about. You can stop at gathering information." : "Make a short list of questions for one licensed provider. Asking questions does not commit you to treatment or an intervention.",
  };
  if (path === "conversation") return {
    title: choice === 0 ? "Prepare a calmer opening" : "Prepare one boundary you can hold",
    intro: "The goal is an honest, respectful conversation—not winning an argument or forcing a decision.",
    steps: [
      "Choose a time when everyone can participate safely and is not intoxicated. If there have been threats, violence, or fear of retaliation, do not confront them alone; seek individualized safety support first.",
      choice === 0 ? "Choose one concrete observation rather than a label: describe what happened, how it affected you, and what you hope to discuss. Keep your opening brief." : "Choose a limit about your own actions that you can sustain. For example: you will pause conversations when shouting starts, rather than demanding that someone never feel angry.",
      "Ask one open question and leave room to listen: ‘What kind of help would feel possible?’ You can acknowledge their feelings without agreeing to every request.",
      "Plan how to pause. If the conversation escalates, stop and move to safety. Avoid surprise confrontations, threats, or using housing or basic needs as leverage without professional and legal guidance.",
    ],
    words: choice === 0 ? "I care about you. When our conversation ended in shouting yesterday, I felt overwhelmed. Could we take ten minutes to talk about what support might help?" : "I want to listen, and I will not stay in a shouting conversation. I will pause and we can try again when we can speak calmly.",
    today: "Practice your opening with a trusted person. Decide on one sign that means it is time to pause, and one safe place you can go.",
  };
  return {
    title: choice === 0 ? "Put immediate safety before planning" : "Make a plan after urgent help is in place",
    intro: "This guide cannot assess danger, diagnose symptoms, or tell you that it is safe to wait. If you are unsure about a possible emergency, seek urgent professional help.",
    steps: [
      "For suspected overdose, trouble breathing, unresponsiveness, or immediate danger, call 911 now in the U.S. Follow the dispatcher’s instructions. If opioid overdose is suspected and naloxone is available, use it according to its instructions while help is coming.",
      "For suicidal thoughts or a mental health crisis, call or text 988 in the U.S. You can contact 988 when you are worried about someone else. For an immediate threat to life, call 911.",
      "Protect your own safety and children’s safety. Move away from threats if you can safely do so. Do not physically confront someone or attempt to restrain them yourself.",
      choice === 0 ? "Do not leave a suspected overdose to ‘sleep it off.’ Stay nearby only if it is safe and follow emergency responders’ guidance. Do not attempt a home detox." : "Once urgent needs are being addressed, ask the treating team about follow-up, warning signs requiring urgent care, and safe withdrawal care. Choose a trusted person to help you remember instructions.",
    ],
    words: "I am concerned about safety. I am getting qualified help now; we can discuss longer-term decisions later.",
    today: choice === 0 ? "Use the emergency or crisis resources now if needed. This page and contact forms are not monitored for emergencies." : "Write down the care team’s next step somewhere private and arrange one check-in for your own support. Return to planning only when safe.",
  };
}

export default function NextStep() {
  const [path, setPath] = useState<PathId | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const selected = paths.find((item) => item.id === path);
  const guide = path !== null && choice !== null ? makeGuide(path, choice) : null;
  useEffect(() => { heading.current?.focus(); setFeedback(""); }, [path, choice]);
  useEffect(() => {
    const clearGuide = () => {
      setPath(null);
      setChoice(null);
      setFeedback("");
    };
    // A restored back-forward-cache document must not reveal earlier choices.
    window.addEventListener("pagehide", clearGuide);
    window.addEventListener("pageshow", clearGuide);
    return () => {
      window.removeEventListener("pagehide", clearGuide);
      window.removeEventListener("pageshow", clearGuide);
    };
  }, []);

  function download() {
    if (!guide) return;
    const text = ["No More Enabling — Your next-step guide", guide.title, guide.intro, ...guide.steps.map((step, i) => `${i + 1}. ${step}`), `Words to try: ${guide.words}`, `One next step: ${guide.today}`, safety, "Educational guidance, not medical advice or an emergency service."].join("\n\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "my-next-step-guide.txt"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFeedback("Download requested. Your browser handles saving the file; check your downloads.");
  }

  return <div className="next-step-page">
    <SEOHead title="Not ready to call? Make a next-step plan" description="Explore family support options, prepare a conversation, or find immediate safety resources. A private, no-signup guide with a local download." canonicalUrl="https://nomoreenabling.com/next-step" />
    <header className="border-b border-border bg-background"><div className="next-step-shell flex items-center justify-between gap-4 py-4"><a href="/" aria-label="No More Enabling home"><img src={logo} alt="No More Enabling" className="h-14 rounded" /></a><a href="/" className="underline">Back to home</a></div></header>
    <main className="next-step-shell py-10">
      <p className="text-primary font-semibold">Not ready to call?</p>
      <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-3">Make a plan for your next step</h1>
      <p className="mt-5 text-lg">Care without carrying it all. Choose what would help today; get a practical guide before deciding whether to contact anyone.</p>
      <p className="mt-4 text-sm">No sign-in or contact details needed. Your choices stay in this page’s memory—not in a URL, browser storage, or sent to us. No analytics, ads, session replay, or chat run on this guide. Reset or reload clears your choices. Your visit may still appear in browser history and standard server logs. Downloads stay on your device; use care on shared devices.</p>
      <aside aria-label="Urgent help" className="my-7 rounded-xl border-2 border-primary/40 bg-secondary p-5">
        <h2 className="font-serif text-xl font-bold">Urgent help comes first</h2>
        <p className="mt-2">In the U.S., <a className="underline font-bold" href="tel:911">call 911</a> for immediate danger or a suspected overdose. <a className="underline font-bold" href="tel:988">Call 988</a> or <a className="underline font-bold" href="sms:988">text 988</a> for a suicide or mental health crisis. Outside the U.S., use local emergency services. Do not wait for a guide or contact-form reply.</p>
      </aside>
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-8" aria-labelledby="guide-heading">
        <p role="status" className="text-sm text-muted-foreground mb-3">{guide ? "Your guide is ready — no contact details required." : selected ? "Choose a focus. You can go back at any time." : "Start with what you need today."}</p>
        <h2 id="guide-heading" ref={heading} tabIndex={-1} className="font-serif text-2xl font-bold">{guide ? guide.title : selected ? selected.question : "What would help right now?"}</h2>
        {!selected && <div className="grid gap-3 mt-6">{paths.map((item) => <button className="next-step-choice" key={item.id} onClick={() => setPath(item.id)}>{item.label}<span aria-hidden="true"> →</span></button>)}</div>}
        {selected && !guide && <div className="grid gap-3 mt-6">{selected.choices.map((label, i) => <button className="next-step-choice" key={label} onClick={() => setChoice(i)}>{label}<span aria-hidden="true"> →</span></button>)}</div>}
        {guide && <article className="mt-5 space-y-6">
          <p>{guide.intro}</p>
          <ol className="list-decimal pl-6 space-y-4">{guide.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          <div className="rounded-lg bg-secondary p-5"><h3 className="font-bold">Words you could try</h3><p className="mt-2">“{guide.words}”</p></div>
          <div><h3 className="font-bold">One manageable next step</h3><p className="mt-2">{guide.today}</p></div>
          <p className="text-sm">Educational guidance, not a diagnosis, medical advice, or an emergency service. No guide can guarantee an outcome.</p>
          <div className="next-step-controls flex flex-wrap gap-3"><button className="next-step-choice" onClick={download}>Download text guide</button><button className="next-step-choice" onClick={() => window.print()}>Print guide</button></div>
          <p role="status" className="text-sm">{feedback}</p>
          <aside className="next-step-contact border-t border-border pt-5"><h3 className="font-bold">Contact is optional</h3><p className="my-3">If you want a personal follow-up, the link below opens Freedom Interventions’ existing contact form, where you can request a callback. You leave this private guide; that site’s privacy practices apply. No guide choices or answers are sent with the link. Nothing is submitted until you complete that form.</p><a href="https://freedominterventions.com/contact" rel="noreferrer" className="underline font-semibold">Open Freedom Interventions contact form (optional)</a></aside>
        </article>}
        {selected && <nav className="next-step-controls mt-7 flex flex-wrap gap-4" aria-label="Guide controls"><button className="next-step-choice" onClick={() => { if (guide) setChoice(null); else setPath(null); }}>Back</button><button className="next-step-choice" onClick={() => { setChoice(null); setPath(null); }}>Reset guide</button></nav>}
      </section>
    </main>
    <footer className="border-t border-border bg-secondary"><div className="next-step-shell py-7"><p>Compassionate support. Boundaries, not punishment.</p><a href="/privacy" className="underline inline-block mt-3">Privacy policy</a></div></footer>
  </div>;
}
