import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronRight, ChevronLeft, RotateCcw } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sections = [
  {
    title: "Emotional Responsibility & Over-Functioning",
    questions: [
      "I feel responsible for how my loved one feels or behaves.",
      "I work harder on their recovery, stability, or wellbeing than they do.",
      'I feel anxious when I am not actively "doing something" to help them.',
      "I struggle to relax or enjoy myself when they are not doing well.",
      "I believe that if I say or do the right thing, I can prevent bad outcomes.",
    ],
  },
  {
    title: "Boundaries & Self-Abandonment",
    questions: [
      "I ignore my own needs to avoid conflict or upsetting them.",
      'I say "yes" when I want to say "no."',
      "I feel guilty when I prioritize myself.",
      "I stay silent about concerns because it feels safer than being honest.",
      "I move my boundaries when they are uncomfortable or upset.",
    ],
  },
  {
    title: "Protection, Rescue, & Consequences",
    questions: [
      "I shield them from the natural consequences of their behavior.",
      "I make excuses for their actions to others—or to myself.",
      "I provide money, housing, or support even when it harms me.",
      "I step in to fix problems they created.",
      "I fear that if I stop helping, something terrible will happen.",
    ],
  },
  {
    title: "Control, Hyper-Vigilance, & Fear",
    questions: [
      "I monitor their mood, behavior, or choices closely.",
      "I feel on edge, waiting for the next crisis.",
      "I believe things will fall apart if I let go.",
      "I feel resentful but also trapped.",
      'I don\'t trust others to handle the situation "correctly."',
    ],
  },
  {
    title: "Identity & Self-Worth",
    questions: [
      "My sense of purpose is tied to being needed.",
      "I feel selfish when I focus on my own growth or happiness.",
      "I feel invisible or unimportant in this relationship.",
      "I struggle to imagine who I am outside of this role.",
      'I minimize my own pain because "they have it worse."',
    ],
  },
];

const responseOptions = [
  { value: 0, label: "Not true for me" },
  { value: 1, label: "Occasionally true" },
  { value: 2, label: "Often true" },
  { value: 3, label: "Almost always true" },
];

type ResultLevel = "low" | "mild" | "established" | "high";

interface ResultData {
  title: string;
  description: string;
  reflection: string;
  reflectionPrompt: string;
}

const results: Record<ResultLevel, ResultData> = {
  low: {
    title: "Low Enabling Patterns",
    description:
      "You appear to have a solid sense of emotional boundaries and self-responsibility. That doesn't mean things are easy—it means you're already practicing skills many people are still learning.",
    reflection: "Reflection Prompt:",
    reflectionPrompt:
      "What boundaries or values are already working that you want to protect?",
  },
  mild: {
    title: "Mild to Moderate Patterns",
    description:
      "Some of your behaviors may be rooted in care, loyalty, or fear—not weakness. These patterns often develop when someone has been in survival mode for a long time.",
    reflection: "Invitation to Change:",
    reflectionPrompt:
      "Awareness is the first step toward relief. Small boundary shifts can create meaningful change without burning bridges.",
  },
  established: {
    title: "Established Patterns",
    description:
      "You may be carrying more than your share of responsibility. This level of stress often leads to burnout, resentment, and loss of self—especially when love and fear are intertwined.",
    reflection: "Important Reframe:",
    reflectionPrompt:
      "Nothing here means you have failed. It means the system you're in isn't sustainable.",
  },
  high: {
    title: "High Patterns",
    description:
      "You are likely exhausted—emotionally, mentally, and possibly physically. These patterns often emerge in long-term exposure to addiction, mental illness, or chronic crisis.",
    reflection: "Gentle Truth:",
    reflectionPrompt:
      "What you're doing makes sense given what you've lived through. It's also okay to admit this is too much to carry alone.",
  },
};

const getResultLevel = (score: number): ResultLevel => {
  if (score <= 20) return "low";
  if (score <= 40) return "mild";
  if (score <= 60) return "established";
  return "high";
};

const SelfAssessment = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const currentSectionQuestions = sections[currentSection].questions;
  const currentSectionAnswered = currentSectionQuestions.every(
    (_, idx) => answers[`${currentSection}-${idx}`] !== undefined
  );

  const handleAnswer = (questionIndex: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [`${currentSection}-${questionIndex}`]: value,
    }));
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((acc, val) => acc + val, 0);
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentSection(0);
    setShowResults(false);
    setIsStarted(false);
  };

  if (!isStarted) {
    return (
      <section className="pt-16 pb-4 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="self-assessment" className="border-0">
                <AccordionTrigger className="bg-card px-6 py-4 rounded-xl shadow-lg border-4 border-foreground/40 ring-1 ring-foreground/20 hover:no-underline">
                  <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground text-left">
                    The Enabling & Codependency Self-Reflection
                  </h2>
                </AccordionTrigger>
                <AccordionContent className="bg-card px-6 pb-6 rounded-b-xl shadow-lg border-4 border-t-0 border-foreground/40 ring-1 ring-foreground/20">
                  <div className="space-y-6 text-muted-foreground text-left pt-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Purpose</h3>
                      <p>
                        This assessment is designed to help you understand patterns that may be
                        keeping you stuck in exhaustion, resentment, or fear while trying to
                        help someone you love.
                      </p>
                      <p className="mt-2">
                        It does not label you as "codependent" or "an enabler." Instead, it
                        highlights behaviors that often develop in long-term stress, trauma, or
                        love mixed with fear.
                      </p>
                      <p className="mt-2 italic">
                        There are no wrong answers. Answer based on what is mostly true for you
                        right now.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">How to Respond</h3>
                      <p>For each statement, choose the response that best fits:</p>
                      <ul className="mt-2 space-y-1">
                        <li>
                          <span className="font-medium">0</span> – Not true for me
                        </li>
                        <li>
                          <span className="font-medium">1</span> – Occasionally true
                        </li>
                        <li>
                          <span className="font-medium">2</span> – Often true
                        </li>
                        <li>
                          <span className="font-medium">3</span> – Almost always true
                        </li>
                      </ul>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsStarted(true)}
                    className="mt-6"
                    size="lg"
                  >
                    Begin Assessment
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const level = getResultLevel(score);
    const result = results[level];

    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                    Your Results
                  </h2>
                  <p className="text-muted-foreground">
                    Based on your responses
                  </p>
                </div>

                <div className="bg-primary/5 rounded-lg p-6 md:p-8 mb-8">
                  <h3 className="font-serif text-2xl font-bold text-primary mb-4">
                    {result.title}
                  </h3>
                  <p className="text-foreground leading-relaxed mb-6">
                    {result.description}
                  </p>
                  <div className="border-l-4 border-primary pl-4">
                    <p className="font-semibold text-foreground mb-2">
                      {result.reflection}
                    </p>
                    <p className="text-muted-foreground italic">
                      {result.reflectionPrompt}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-6 md:p-8 space-y-4">
                  <p className="text-foreground font-medium">
                    Enabling is not a character flaw.
                  </p>
                  <p className="text-foreground font-medium">
                    Codependency is not a diagnosis.
                  </p>
                  <p className="text-muted-foreground">
                    They are survival strategies that outlived their usefulness.
                  </p>
                  <div className="pt-4 border-t border-border">
                    <p className="text-foreground">
                      Change does not start with cutting people off.
                    </p>
                    <p className="text-foreground font-semibold">
                      It starts with turning back toward yourself.
                    </p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button onClick={handleReset} variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Take Assessment Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-card p-6 md:p-10 rounded-xl shadow-lg border-4 border-foreground/40 ring-1 ring-foreground/20">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Section {currentSection + 1} of {sections.length}
              </span>
              <span>
                {answeredQuestions} of {totalQuestions} answered
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 md:p-6 border-2 border-foreground/20">
            <CardContent className="p-0">
              <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-6">
                {sections[currentSection].title}
              </h3>

              <div className="space-y-8">
                {currentSectionQuestions.map((question, idx) => (
                  <div key={idx} className="space-y-3">
                    <p className="text-foreground font-medium">
                      {idx + 1}. {question}
                    </p>
                    <RadioGroup
                      value={answers[`${currentSection}-${idx}`] !== undefined ? answers[`${currentSection}-${idx}`].toString() : ""}
                      onValueChange={(value) => handleAnswer(idx, parseInt(value))}
                      className="grid grid-cols-2 md:grid-cols-4 gap-2"
                    >
                      {responseOptions.map((option) => (
                        <div key={option.value}>
                          <RadioGroupItem
                            value={option.value.toString()}
                            id={`q${currentSection}-${idx}-${option.value}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`q${currentSection}-${idx}-${option.value}`}
                            className="flex items-center justify-center px-3 py-2 text-sm text-center border border-border rounded-md cursor-pointer transition-colors hover:bg-muted peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentSection === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!currentSectionAnswered}
                >
                  {currentSection === sections.length - 1 ? "See Results" : "Next"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SelfAssessment;
