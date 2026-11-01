import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

/**
 * Animated text conversation for the homepage hero: a loved one asks for
 * money at 2 a.m., the old "rescue" reply gets typed and deleted, and a
 * boundary that still says "I love you" is sent instead.
 *
 * Everything is derived from one elapsed-time value so the scene is easy to
 * pause, replay, and render statically (reduced motion / prerender).
 */

const INCOMING = [
  { text: "are you up?", at: 0 },
  { text: "i need $200 for rent by tomorrow or they're kicking me out", at: 2300 },
  { text: "i swear this is the last time. please", at: 4300 },
] as const;

const OLD_REPLY = "Ok. Sending it now. Please be safe ❤️";
const NEW_REPLY =
  "I love you, and I'm not sending money. If you want help, I'll pick you up tomorrow and we'll call a treatment center together.";

const TYPING_LEAD = 1100; // typing dots shown before each incoming message
const OLD_START = 5600;
const OLD_CHAR_MS = 42;
const OLD_END = OLD_START + OLD_REPLY.length * OLD_CHAR_MS;
const OLD_REFLEX_NOTE = OLD_END - 400;
const OLD_STRIKE = OLD_END + 1000;
const OLD_CLEARED = OLD_STRIKE + 900;
const NEW_START = OLD_CLEARED + 500;
const NEW_CHAR_MS = 26;
const NEW_END = NEW_START + NEW_REPLY.length * NEW_CHAR_MS;
const NEW_SENT = NEW_END + 450;
const NEW_NOTE = NEW_SENT + 500;
const LOOP_MS = NEW_NOTE + 6500;
const FINAL_T = NEW_NOTE + 1000;
const MAX_LOOPS = 2;
const START_T = 600;
const TICK_MS = 50;

export const RECOGNITION_PHRASES = [
  "paid the rent “just this once.”",
  "covered for them at work. Again.",
  "checked their location at 2 a.m.",
  "said “never again” more times than you can count.",
] as const;
const PHRASE_MS = 3600;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export interface ConversationTimeline {
  t: number;
  finished: boolean;
  paused: boolean;
  reducedMotion: boolean;
  togglePause: () => void;
  replay: () => void;
}

/** One shared clock for the phone scene and the rotating recognition line. */
export const useConversationTimeline = (sceneRef: React.RefObject<HTMLElement>): ConversationTimeline => {
  const [reducedMotion] = useState(prefersReducedMotion);
  const [t, setT] = useState(() => (prefersReducedMotion() ? FINAL_T : START_T));
  const [loops, setLoops] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const finished = reducedMotion || loops >= MAX_LOOPS;

  // Only run while the hero is on screen and the tab is visible.
  useEffect(() => {
    const node = sceneRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [sceneRef]);

  useEffect(() => {
    if (finished || paused || !visible) return;
    const interval = window.setInterval(() => {
      if (!document.hidden) setT((current) => current + TICK_MS);
    }, TICK_MS);
    return () => window.clearInterval(interval);
  }, [finished, paused, visible]);

  useEffect(() => {
    if (t < LOOP_MS) return;
    setLoops((count) => count + 1);
    setT(0);
  }, [t]);

  return {
    t: finished ? FINAL_T : t,
    finished,
    paused,
    reducedMotion,
    togglePause: () => setPaused((value) => !value),
    replay: () => {
      setLoops(MAX_LOOPS - 1);
      setPaused(false);
      setT(0);
    },
  };
};

export const recognitionPhraseIndex = (timeline: ConversationTimeline) =>
  timeline.finished ? 0 : Math.floor(timeline.t / PHRASE_MS) % RECOGNITION_PHRASES.length;

const visibleText = (text: string, start: number, charMs: number, t: number) =>
  t <= start ? "" : text.slice(0, Math.min(text.length, Math.floor((t - start) / charMs)));

interface HeroConversationProps {
  timeline: ConversationTimeline;
  sceneRef: React.RefObject<HTMLDivElement>;
}

const HeroConversation = ({ timeline, sceneRef }: HeroConversationProps) => {
  const { t, finished, paused, reducedMotion } = timeline;

  const shownIncoming = INCOMING.filter((message) => t >= message.at);
  const incomingTyping = INCOMING.some((message) => message.at > 0 && t >= message.at - TYPING_LEAD && t < message.at);

  const oldDraft = t < OLD_CLEARED ? visibleText(OLD_REPLY, OLD_START, OLD_CHAR_MS, t) : "";
  const oldStruck = t >= OLD_STRIKE && t < OLD_CLEARED;
  const newSent = t >= NEW_SENT;
  const newDraft = !newSent ? visibleText(NEW_REPLY, NEW_START, NEW_CHAR_MS, t) : "";
  const composerText = newDraft || oldDraft;
  const composerIsOld = !newDraft && Boolean(oldDraft);

  // The old-reflex note gives way once the new reply is sent (and would
  // otherwise sit on top of the filled thread).
  const showOldNote = t >= OLD_REFLEX_NOTE && t < NEW_SENT;
  const showNewNote = t >= NEW_NOTE;

  return (
    <div className="nme-convo-scene" ref={sceneRef}>
      <div className="nme-convo-glow" aria-hidden="true" />

      <figure
        className="nme-phone"
        role="img"
        aria-label={`A text conversation at 2:07 a.m. Their loved one writes: "${INCOMING.map((m) => m.text).join(" ")}" The old reflex would be to reply "${OLD_REPLY}" Instead, the reply sent is: "${NEW_REPLY}"`}
      >
        <div className="nme-phone-screen" aria-hidden="true">
          <div className="nme-phone-status">
            <span>2:07</span>
            <span className="nme-phone-notch" />
            <span className="nme-phone-signal">
              <i /><i /><i />
            </span>
          </div>
          <div className="nme-phone-header">
            <span className="nme-phone-avatar">J</span>
            <span>
              <strong>Jamie</strong>
              <small>{newSent ? "Delivered" : t >= INCOMING[0].at ? "Active now" : ""}</small>
            </span>
          </div>

          <div className="nme-phone-thread">
            <span className="nme-phone-timestamp">Today 2:07 AM</span>
            {shownIncoming.map((message) => (
              <p key={message.text} className="nme-bubble nme-bubble-in">
                {message.text}
              </p>
            ))}
            {incomingTyping && (
              <p className="nme-bubble nme-bubble-in nme-bubble-typing">
                <i /><i /><i />
              </p>
            )}
            {newSent && <p className="nme-bubble nme-bubble-out">{NEW_REPLY}</p>}
          </div>

          <div className={`nme-phone-composer${composerIsOld ? " is-old" : ""}${oldStruck ? " is-struck" : ""}`}>
            <span className="nme-composer-text">
              {composerText || <span className="nme-composer-placeholder">Text message</span>}
              {composerText && !finished && <span className="nme-caret" />}
            </span>
            <span className={`nme-composer-send${newDraft && newDraft.length === NEW_REPLY.length ? " is-ready" : ""}`}>↑</span>
          </div>
        </div>
      </figure>

      <div className={`nme-convo-note nme-convo-note-old${showOldNote ? " is-visible" : ""}`} aria-hidden="true">
        <small>The old reflex</small>
        <strong>Rescue tonight. Lie awake tomorrow. Repeat.</strong>
      </div>

      <div className={`nme-convo-note nme-convo-note-new${showNewNote ? " is-visible" : ""}`} aria-hidden="true">
        <small>A different response</small>
        <strong>A boundary that still says “I love you.”</strong>
        <span className="nme-convo-chips">
          <em>No lecture</em>
          <em>No money</em>
          <em>A real offer of help</em>
        </span>
      </div>

      {!reducedMotion && (
        <button
          type="button"
          className="nme-convo-control"
          onClick={finished ? timeline.replay : timeline.togglePause}
        >
          {finished ? <RotateCcw aria-hidden="true" /> : paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
          {finished ? "Replay conversation" : paused ? "Play animation" : "Pause animation"}
        </button>
      )}
    </div>
  );
};

export default HeroConversation;
