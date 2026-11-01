import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

/**
 * Animated text conversations for the homepage hero. Each scenario shows a
 * loved one's late-night ask, the old "rescue" reply typed and deleted, and a
 * boundary that still says "I love you" sent instead.
 *
 * Everything is derived from one elapsed-time value per scenario so the scene
 * is easy to pause, replay, switch, and render statically (reduced motion /
 * prerender).
 */

export interface ConversationScenario {
  id: string;
  chip: string;
  contact: string;
  relationship: string;
  time: string;
  incoming: readonly string[];
  oldReply: string;
  newReply: string;
  oldNote: string;
  newNote: string;
  chips: readonly string[];
}

export const SCENARIOS: readonly ConversationScenario[] = [
  {
    id: "money",
    chip: "Money",
    contact: "Jamie",
    relationship: "your son",
    time: "2:07",
    incoming: [
      "are you up?",
      "i need $200 for rent by tomorrow or they're kicking me out",
      "i swear this is the last time. please",
    ],
    oldReply: "Ok. Sending it now. Please be safe ❤️",
    newReply:
      "I love you, and I'm not sending money. If you want help, I'll pick you up tomorrow and we'll call a treatment center together.",
    oldNote: "Rescue tonight. Lie awake tomorrow. Repeat.",
    newNote: "A boundary that still says “I love you.”",
    chips: ["No lecture", "No money", "A real offer of help"],
  },
  {
    id: "cover",
    chip: "Cover for me",
    contact: "Chris",
    relationship: "your husband",
    time: "6:42",
    incoming: [
      "can you call my boss and tell him i have the flu",
      "i can't go in like this",
      "please babe. just this once",
    ],
    oldReply: "Ok, I'll call him now. Drink some water.",
    newReply:
      "I'm not going to call in for you. I love you and I'm worried. When you're ready to talk about getting help, I'm right here.",
    oldNote: "Cover for them, and the consequence never lands.",
    newNote: "Let the consequence stay where it belongs.",
    chips: ["No cover story", "No anger", "The door stays open"],
  },
  {
    id: "rehab",
    chip: "Leaving rehab",
    contact: "Sam",
    relationship: "your daughter",
    time: "9:15",
    incoming: [
      "this place is a joke. come get me",
      "i'm fine now, i don't need 30 days",
      "if you don't come i'll just walk out",
    ],
    oldReply: "Ok. Leaving now, I'll be there in 2 hours.",
    newReply:
      "I'm proud of you for going. I'm not coming to get you early. Please talk to your counselor tonight. I'll see you at family day on Sunday.",
    oldNote: "Rescue them from the hard part.",
    newNote: "Support the treatment, not the escape.",
    chips: ["Encouragement", "No early pickup", "Still connected"],
  },
  {
    id: "bottle",
    chip: "Bring a bottle",
    contact: "Dad",
    relationship: "your father",
    time: "4:30",
    incoming: [
      "you never come see me anymore",
      "after everything i did for you",
      "bring me a bottle when you come sunday",
    ],
    oldReply: "Ok Dad. I'll pick one up on the way.",
    newReply:
      "I love you, Dad. I won't bring alcohol. I'll come Sunday for lunch, and I'll stay as long as you're sober.",
    oldNote: "Keep the peace. Keep the pattern.",
    newNote: "Show up on terms you can live with.",
    chips: ["No alcohol", "No guilt trip", "A clear condition"],
  },
  {
    id: "secret",
    chip: "Keep it secret",
    contact: "Alex",
    relationship: "your partner",
    time: "7:58",
    incoming: [
      "i'm so sorry about last night",
      "i promise i'm done for real this time",
      "we don't need to make a big deal or tell anyone",
    ],
    oldReply: "Ok. Let's just forget it happened.",
    newReply:
      "I believe you want to stop. Promises haven't been enough, so I'm calling a counselor tomorrow. I'm not keeping this a secret anymore.",
    oldNote: "Accept the promise. Keep the secret.",
    newNote: "Ask for action, not another promise.",
    chips: ["No secrets", "No shaming", "A next step"],
  },
] as const;

// Timing (ms) inside one scenario.
const INCOMING_AT = [0, 2300, 4300] as const;
const TYPING_LEAD = 1100; // typing dots shown before each incoming message
const OLD_START = 5600;
const OLD_CHAR_MS = 42;
const NEW_CHAR_MS = 26;
const START_T = 600;
const TICK_MS = 50;

const timingFor = (scenario: ConversationScenario) => {
  const oldEnd = OLD_START + scenario.oldReply.length * OLD_CHAR_MS;
  const oldReflexNote = oldEnd - 400;
  const oldStrike = oldEnd + 1000;
  const oldCleared = oldStrike + 900;
  const newStart = oldCleared + 500;
  const newEnd = newStart + scenario.newReply.length * NEW_CHAR_MS;
  const newSent = newEnd + 450;
  const newNote = newSent + 500;
  return {
    oldReflexNote,
    oldStrike,
    oldCleared,
    newStart,
    newEnd,
    newSent,
    newNote,
    loop: newNote + 6000,
    final: newNote + 1000,
  };
};

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
  scenarioIndex: number;
  /** Total ms elapsed across scenarios; drives the rotating recognition line. */
  elapsed: number;
  finished: boolean;
  paused: boolean;
  reducedMotion: boolean;
  togglePause: () => void;
  replay: () => void;
  selectScenario: (index: number) => void;
}

/**
 * One shared clock for the phone scene and the rotating recognition line.
 * Autoplay walks through every scenario once, then rests on the last one.
 * Choosing a scenario plays just that one, then rests.
 */
export const useConversationTimeline = (sceneRef: React.RefObject<HTMLElement>): ConversationTimeline => {
  const [reducedMotion] = useState(prefersReducedMotion);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [t, setT] = useState(() => (prefersReducedMotion() ? timingFor(SCENARIOS[0]).final : START_T));
  const [elapsed, setElapsed] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [done, setDone] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const finished = reducedMotion || done;
  const timing = timingFor(SCENARIOS[scenarioIndex]);

  // Only run while the scene is on screen and the tab is visible.
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
      if (document.hidden) return;
      setT((current) => current + TICK_MS);
      setElapsed((current) => current + TICK_MS);
    }, TICK_MS);
    return () => window.clearInterval(interval);
  }, [finished, paused, visible]);

  useEffect(() => {
    if (t < timing.loop) return;
    if (autoAdvance && scenarioIndex < SCENARIOS.length - 1) {
      setScenarioIndex(scenarioIndex + 1);
      setT(0);
    } else {
      setDone(true);
    }
  }, [t, timing.loop, autoAdvance, scenarioIndex]);

  return {
    t: finished ? timing.final : t,
    scenarioIndex,
    elapsed,
    finished,
    paused,
    reducedMotion,
    togglePause: () => setPaused((value) => !value),
    replay: () => {
      setAutoAdvance(false);
      setDone(false);
      setPaused(false);
      setT(0);
    },
    selectScenario: (index: number) => {
      setScenarioIndex(index);
      setAutoAdvance(false);
      setDone(false);
      setPaused(false);
      setT(0);
    },
  };
};

export const recognitionPhraseIndex = (timeline: ConversationTimeline) =>
  timeline.finished ? 0 : Math.floor(timeline.elapsed / PHRASE_MS) % RECOGNITION_PHRASES.length;

const visibleText = (text: string, start: number, charMs: number, t: number) =>
  t <= start ? "" : text.slice(0, Math.min(text.length, Math.floor((t - start) / charMs)));

interface HeroConversationProps {
  timeline: ConversationTimeline;
  sceneRef: React.RefObject<HTMLDivElement>;
}

const HeroConversation = ({ timeline, sceneRef }: HeroConversationProps) => {
  const { t, finished, paused, reducedMotion, scenarioIndex } = timeline;
  const scenario = SCENARIOS[scenarioIndex];
  const timing = timingFor(scenario);

  const shownIncoming = scenario.incoming.filter((_, index) => t >= INCOMING_AT[index]);
  const incomingTyping = INCOMING_AT.some((at) => at > 0 && t >= at - TYPING_LEAD && t < at);

  const oldDraft = t < timing.oldCleared ? visibleText(scenario.oldReply, OLD_START, OLD_CHAR_MS, t) : "";
  const oldStruck = t >= timing.oldStrike && t < timing.oldCleared;
  const newSent = t >= timing.newSent;
  const newDraft = !newSent ? visibleText(scenario.newReply, timing.newStart, NEW_CHAR_MS, t) : "";
  const composerText = newDraft || oldDraft;
  const composerIsOld = !newDraft && Boolean(oldDraft);

  // The old-reflex note gives way once the new reply is sent (and would
  // otherwise sit on top of the filled thread).
  const showOldNote = t >= timing.oldReflexNote && !newSent;
  const showNewNote = t >= timing.newNote;

  return (
    <div className="nme-convo-scene" ref={sceneRef}>
      <div className="nme-convo-glow" aria-hidden="true" />

      <figure
        className="nme-phone"
        role="img"
        aria-label={`Example text conversation with ${scenario.relationship}. They write: "${scenario.incoming.join(" ")}" The old reflex would be to reply "${scenario.oldReply}" Instead, the reply sent is: "${scenario.newReply}"`}
      >
        <div className="nme-phone-screen" aria-hidden="true">
          <div className="nme-phone-status">
            <span>{scenario.time}</span>
            <span className="nme-phone-notch" />
            <span className="nme-phone-signal">
              <i /><i /><i />
            </span>
          </div>
          <div className="nme-phone-header">
            <span className="nme-phone-avatar">{scenario.contact.charAt(0)}</span>
            <span>
              <strong>{scenario.contact}</strong>
              <small>{newSent ? "Delivered" : "Active now"}</small>
            </span>
          </div>

          <div className="nme-phone-thread" key={scenario.id}>
            <span className="nme-phone-timestamp">Today {scenario.time}</span>
            {shownIncoming.map((message) => (
              <p key={message} className="nme-bubble nme-bubble-in">
                {message}
              </p>
            ))}
            {incomingTyping && (
              <p className="nme-bubble nme-bubble-in nme-bubble-typing">
                <i /><i /><i />
              </p>
            )}
            {newSent && <p className="nme-bubble nme-bubble-out">{scenario.newReply}</p>}
          </div>

          <div className={`nme-phone-composer${composerIsOld ? " is-old" : ""}${oldStruck ? " is-struck" : ""}`}>
            <span className="nme-composer-text">
              {composerText || <span className="nme-composer-placeholder">Text message</span>}
              {composerText && !finished && <span className="nme-caret" />}
            </span>
            <span className={`nme-composer-send${newDraft && newDraft.length === scenario.newReply.length ? " is-ready" : ""}`}>↑</span>
          </div>
        </div>
      </figure>

      <div className={`nme-convo-note nme-convo-note-old${showOldNote ? " is-visible" : ""}`} aria-hidden="true">
        <small>The old reflex</small>
        <strong>{scenario.oldNote}</strong>
      </div>

      <div className={`nme-convo-note nme-convo-note-new${showNewNote ? " is-visible" : ""}`} aria-hidden="true">
        <small>A different response</small>
        <strong>{scenario.newNote}</strong>
        <span className="nme-convo-chips">
          {scenario.chips.map((chip) => (
            <em key={chip}>{chip}</em>
          ))}
        </span>
      </div>

      <div className="nme-convo-picker" role="group" aria-label="Example conversations">
        {SCENARIOS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`nme-convo-pick${index === scenarioIndex ? " is-active" : ""}`}
            aria-pressed={index === scenarioIndex}
            aria-label={`${item.chip}: a message from ${item.relationship}`}
            onClick={() => timeline.selectScenario(index)}
          >
            {item.chip}
          </button>
        ))}
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
