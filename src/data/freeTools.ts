import type { LucideIcon } from "lucide-react";
import {
  Search,
  Compass,
  BadgeDollarSign,
  MessageCircle,
  BookOpen,
  Flower2,
  Shield,
  CalendarDays,
  Library,
  RefreshCw,
  Mail,
  Siren,
} from "lucide-react";

/**
 * The Free Tools hub inventory. Adding a future tool = one entry here
 * (set comingSoon while it's being built and it renders as a ghost card).
 */

export interface FreeTool {
  id: string;
  section: "see" | "answers" | "act";
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  cta: string;
  chips: { label: string; tone: "time" | "private" | "email" | "popular" }[];
  comingSoon?: boolean;
}

export const FREE_TOOL_SECTIONS: { key: FreeTool["section"]; title: string; sub: string }[] = [
  { key: "see", title: "First, see your situation clearly", sub: "Before any boundary, you need an honest picture." },
  { key: "answers", title: "Then, get your questions answered", sub: "Plain language, no lectures, no jargon." },
  { key: "act", title: "Then, take one real step", sub: "Small, concrete, and built to hold under pressure." },
];

export const FREE_TOOLS: FreeTool[] = [
  // ── 1. See clearly ─────────────────────────────────────────────────────────
  {
    id: "helping-or-enabling",
    section: "see",
    icon: Search,
    title: "Helping or Enabling?",
    description:
      "The self-check that started this site. Walk through your real decisions and see where care quietly turned into rescue, protection, or control.",
    href: "/helping-or-enabling",
    cta: "Take the self-check",
    chips: [
      { label: "5 min", tone: "time" },
      { label: "Most popular", tone: "popular" },
    ],
  },
  {
    id: "family-situation-assessment",
    section: "see",
    icon: Compass,
    title: "Family Situation Assessment",
    description:
      "How serious is this, really? Answer a few direct questions and get a recommended next step matched to where your family actually is.",
    href: "/family-situation-assessment",
    cta: "Start the assessment",
    chips: [{ label: "4 min", tone: "time" }],
  },
  {
    id: "enabling-cost-calculator",
    section: "see",
    icon: BadgeDollarSign,
    title: "The Enabling Cost Calculator",
    description:
      "What has protecting the addiction cost you in the last 12 months? Add it up privately — then see what that money could have funded instead.",
    href: "/enabling-cost-calculator",
    cta: "Add it up",
    chips: [
      { label: "2 min", tone: "time" },
      { label: "100% private", tone: "private" },
    ],
  },

  // ── 2. Get answers ─────────────────────────────────────────────────────────
  {
    id: "answer-center",
    section: "answers",
    icon: MessageCircle,
    title: "The Answer Center",
    description:
      "Direct answers to the questions families actually ask — money, rock bottom, refusal, relapse — with the reasoning behind each one.",
    href: "/enabling-answer-center",
    cta: "Find your question",
    chips: [{ label: "Browse", tone: "time" }],
  },
  {
    id: "the-mirror",
    section: "answers",
    icon: RefreshCw,
    title: "The Enabling Mirror",
    description:
      "An animated look at how rescuing runs on the same engine as the addiction itself — two cycles, one mechanism, side by side.",
    href: "/the-mirror",
    cta: "Watch the cycles",
    chips: [
      { label: "2 min", tone: "time" },
      { label: "Interactive", tone: "time" },
    ],
  },
  {
    id: "glossary",
    section: "answers",
    icon: BookOpen,
    title: "The Family Glossary",
    description:
      "Enabling, codependency, detachment, leverage, bottom — the words everyone uses and nobody defines, explained the way Matt uses them.",
    href: "/glossary",
    cta: "Look up a term",
    chips: [{ label: "Browse", tone: "time" }],
  },
  {
    id: "grounding-reminder",
    section: "answers",
    icon: Flower2,
    title: "The Grounding Reminder",
    description:
      "For the moment panic is making the decisions. A one-page reset you can read in two minutes — and print for the next hard night.",
    href: "/grounding-reminder",
    cta: "Take a breath",
    chips: [
      { label: "2 min", tone: "time" },
      { label: "Printable", tone: "time" },
    ],
  },

  // ── 3. Take action ─────────────────────────────────────────────────────────
  {
    id: "boundaries-course",
    section: "act",
    icon: Shield,
    title: "The Boundaries Course",
    description:
      "Four weekly email lessons: what a boundary actually is, how to name it without ultimatums, what it protects, and how to hold it when it hurts.",
    href: "/boundaries-course",
    cta: "Join free",
    chips: [
      { label: "Free email course", tone: "email" },
      { label: "4 weeks", tone: "time" },
    ],
  },
  {
    id: "money-plan",
    section: "act",
    icon: CalendarDays,
    title: "The Money Plan",
    description:
      "Five short daily emails to stop the financial bleed — the pause rule, the script, what to fund instead. Starts from the calculator's results page.",
    href: "/enabling-cost-calculator",
    cta: "Get it via the calculator",
    chips: [
      { label: "Free email plan", tone: "email" },
      { label: "5 days", tone: "time" },
    ],
  },
  {
    id: "trusted-tools",
    section: "act",
    icon: Library,
    title: "Trusted Books & Tools",
    description:
      "The books, free support groups, and practical home tools Matt actually recommends — with every affiliate link honestly marked.",
    href: "/trusted-tools",
    cta: "See the shelf",
    chips: [{ label: "Browse", tone: "time" }],
  },
  {
    id: "boundary-letter-builder",
    section: "act",
    icon: Mail,
    title: "The Boundary Letter Builder",
    description:
      "Five questions in, one clean loving boundary letter out — ready to read aloud or send when you can't find the words.",
    href: "#",
    cta: "Coming soon",
    chips: [{ label: "5 min", tone: "time" }],
    comingSoon: true,
  },
  {
    id: "relapse-protocol",
    section: "act",
    icon: Siren,
    title: "The Relapse Protocol",
    description:
      "The plan your family makes before the bad night — who does what, what you'll offer, what you won't do. Print it. Fridge it.",
    href: "#",
    cta: "Coming soon",
    chips: [
      { label: "10 min", tone: "time" },
      { label: "Printable", tone: "time" },
    ],
    comingSoon: true,
  },
];
