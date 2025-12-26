import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
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
    title: "Loss of Control",
    description: "These questions help identify if your loved one has difficulty controlling their substance use.",
    questions: [
      {
        text: "Does your loved one drink or use more than they originally intended?",
        subtext: "For example, they say they'll have 'just one drink' but end up having many more.",
      },
      {
        text: "Have they tried to cut down or stop using but couldn't?",
        subtext: "They may have made promises to quit or expressed a desire to stop but repeatedly failed.",
      },
      {
        text: "Do they spend a lot of time obtaining, using, or recovering from alcohol or drugs?",
        subtext: "This includes time spent hungover, sick, or planning how to get substances.",
      },
    ],
  },
  {
    title: "Cravings & Compulsive Use",
    description: "These questions assess the intensity of urges and compulsive behaviors.",
    questions: [
      {
        text: "Does your loved one experience strong urges or cravings to use?",
        subtext: "They may become restless, irritable, or preoccupied when they can't use.",
      },
      {
        text: "Do they continue using despite knowing it's causing problems?",
        subtext: "They use even when it clearly worsens their health, relationships, or finances.",
      },
    ],
  },
  {
    title: "Neglecting Responsibilities",
    description: "Addiction often causes people to neglect important areas of their life.",
    questions: [
      {
        text: "Has their substance use caused them to fail at work, school, or home responsibilities?",
        subtext: "Missing work, poor performance, neglecting children, or not paying bills.",
      },
      {
        text: "Have they given up or reduced activities they used to enjoy?",
        subtext: "Hobbies, social activities, family gatherings, or exercise they once valued.",
      },
      {
        text: "Do they continue using even though it's causing relationship problems?",
        subtext: "Arguments, broken trust, separation, or family members expressing concern.",
      },
    ],
  },
  {
    title: "Risky Use & Physical Danger",
    description: "These questions identify dangerous patterns of use.",
    questions: [
      {
        text: "Do they use alcohol or drugs in situations where it's physically dangerous?",
        subtext: "Driving while impaired, operating machinery, or mixing substances.",
      },
      {
        text: "Do they continue using despite physical or mental health problems caused by it?",
        subtext: "Liver problems, depression, anxiety, memory issues, or other health concerns.",
      },
    ],
  },
  {
    title: "Tolerance & Withdrawal",
    description: "Physical dependence is indicated by tolerance and withdrawal symptoms.",
    questions: [
      {
        text: "Does your loved one need more of the substance to get the same effect?",
        subtext: "What used to make them intoxicated now barely affects them.",
      },
      {
        text: "Do they experience withdrawal symptoms when they stop or reduce use?",
        subtext: "Shaking, sweating, nausea, anxiety, insomnia, seizures, or feeling sick without the substance.",
      },
    ],
  },
  {
    title: "Functional Impact (ASAM Dimensions)",
    description: "These questions assess how addiction is affecting different areas of life.",
    questions: [
      {
        text: "Is their physical health declining due to substance use?",
        subtext: "Weight changes, poor hygiene, chronic illness, or visible physical deterioration.",
      },
      {
        text: "Are they experiencing mental health symptoms like depression, anxiety, or paranoia?",
        subtext: "Mood swings, hopelessness, panic attacks, or irrational fears.",
      },
      {
        text: "Have they become isolated or lost their support system?",
        subtext: "Fewer friends, family estrangement, or only spending time with others who use.",
      },
      {
        text: "Are they in an unstable living situation or facing legal/financial problems?",
        subtext: "Homelessness risk, eviction, arrests, job loss, or significant debt.",
      },
      {
        text: "Do they show little motivation or readiness to change?",
        subtext: "Denial of the problem, resistance to help, or anger when the topic is raised.",
      },
    ],
  },
];

const responseOptions = [
  { value: 0, label: "No" },
  { value: 1, label: "Sometimes" },
  { value: 2, label: "Often" },
  { value: 3, label: "Almost Always" },
];

type SeverityLevel = "none" | "mild" | "moderate" | "severe";

interface ResultData {
  title: string;
  dsmInterpretation: string;
  description: string;
  recommendations: React.ReactNode[];
  urgency: string;
}

const results: Record<SeverityLevel, ResultData> = {
  none: {
    title: "No Significant Indicators",
    dsmInterpretation: "Based on your observations, the behaviors described do not meet the threshold for a substance use disorder diagnosis.",
    description: "While this assessment doesn't indicate a clinical disorder, trust your instincts. If you're concerned, there may be early warning signs worth monitoring.",
    recommendations: [
      "Call an interventionist or an outpatient treatment center to discuss your concerns and get professional guidance",
      "Educate yourself about the signs of developing substance problems",
      "Consider whether your concern might be about something else (stress, mental health, life changes)",
      "Revisit this assessment if new concerning behaviors emerge",
    ],
    urgency: "Low – Monitor and stay connected",
  },
  mild: {
    title: "Mild Substance Use Disorder Indicators",
    dsmInterpretation: "The behaviors you've described are consistent with what clinicians call a 'Mild Substance Use Disorder' (2-3 DSM-5 criteria met).",
    description: "At this stage, the problem is real but may be more responsive to intervention. Early action can prevent progression to more severe stages.",
    recommendations: [
      "Call an interventionist or treatment center – if they show willingness to change, outpatient treatment may be appropriate; if resistant, consider inpatient options",
      "Have a calm, caring conversation expressing your specific concerns",
      "Encourage them to speak with their primary care doctor",
      "Look into support groups like AA, NA, or SMART Recovery",
      "Consider attending a family support group (Al-Anon, Nar-Anon) for yourself",
      "Avoid enabling behaviors while maintaining the relationship",
    ],
    urgency: "Moderate – Early intervention is highly effective at this stage",
  },
  moderate: {
    title: "Moderate Substance Use Disorder Indicators",
    dsmInterpretation: "The behaviors you've described are consistent with what clinicians call a 'Moderate Substance Use Disorder' (4-5 DSM-5 criteria met).",
    description: "This level indicates a significant problem that is likely causing real harm to your loved one and those around them. Professional treatment is strongly recommended.",
    recommendations: [
      "Call an interventionist or treatment center – if they show willingness to change, an Intensive Outpatient Program (IOP) may work; if resistant or in denial, inpatient treatment is recommended",
      "Consider Partial Hospitalization Programs (PHP) for more structure while living at home",
      "Establish clear boundaries about what you will and won't accept",
      "Prioritize your own mental health and attend family support meetings",
      "Prepare for the possibility that residential treatment may be needed",
    ],
    urgency: "High – Professional treatment is strongly recommended",
  },
  severe: {
    title: "Severe Substance Use Disorder Indicators",
    dsmInterpretation: "The behaviors you've described are consistent with what clinicians call a 'Severe Substance Use Disorder' (6+ DSM-5 criteria met).",
    description: "This level indicates a serious, potentially life-threatening condition. Your loved one's brain and body have likely become dependent on the substance. This is a medical condition that typically requires professional intervention.",
    recommendations: [
      "Call an interventionist or residential treatment center immediately – at this severity level, inpatient/residential treatment is strongly recommended regardless of their willingness",
      "If there's any risk of dangerous withdrawal (alcohol, benzodiazepines, opioids), medical detox is essential",
      "Consider a professional intervention with a certified interventionist if they are resistant",
      "Call 911 if there are signs of overdose, seizures, or medical emergency",
      "Do not attempt to manage detox at home – it can be medically dangerous",
      <>Connect with <a href="https://al-anon.org" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Al-Anon</a> or a family therapist for your own support. You can also join free family Zoom calls at <a href="https://interventiononcall.com/live-family-friends-zoom/" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">InterventionOnCall.com</a></>,
      "Remember: You cannot force recovery, but you can stop enabling and set boundaries",
    ],
    urgency: "Urgent – Immediate professional help is needed. This is a serious medical condition.",
  },
};

const getSeverityLevel = (score: number, dsmCriteriaMet: number): SeverityLevel => {
  // DSM-5 criteria: 2-3 mild, 4-5 moderate, 6+ severe
  // We weight the first 11 questions more heavily as they map to DSM-5 criteria
  if (dsmCriteriaMet < 2) return "none";
  if (dsmCriteriaMet <= 3) return "mild";
  if (dsmCriteriaMet <= 5) return "moderate";
  return "severe";
};

const AddictionAssessment = () => {
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

  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce((acc, val) => acc + val, 0);
    
    // Count DSM-5 criteria met (first 5 sections, 11 questions)
    // A criterion is "met" if the answer is 2 (Often) or 3 (Almost Always)
    let dsmCriteriaMet = 0;
    for (let section = 0; section < 5; section++) {
      const sectionQuestions = sections[section].questions;
      for (let q = 0; q < sectionQuestions.length; q++) {
        const answer = answers[`${section}-${q}`];
        if (answer >= 2) {
          dsmCriteriaMet++;
        }
      }
    }
    
    return { totalScore, dsmCriteriaMet };
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
      <section className="pt-4 pb-16 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="addiction-assessment" className="border-0">
                <AccordionTrigger className="bg-card px-6 py-4 rounded-xl shadow-lg border-4 border-foreground/40 ring-1 ring-foreground/20 hover:no-underline">
                  <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground text-left">
                    Addiction & Alcoholism Assessment for Family Members
                  </h2>
                </AccordionTrigger>
                <AccordionContent className="bg-card px-6 pb-6 rounded-b-xl shadow-lg border-4 border-t-0 border-foreground/40 ring-1 ring-foreground/20">
                  <div className="space-y-6 text-muted-foreground text-left pt-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">What This Assessment Does</h3>
                      <p>
                        This assessment helps you understand whether your loved one may be struggling 
                        with a substance use disorder. It's based on the <strong>DSM-5</strong> (the 
                        diagnostic manual used by clinicians) and <strong>ASAM</strong> (American 
                        Society of Addiction Medicine) criteria.
                      </p>
                      <p className="mt-2">
                        Your answers will help identify the potential severity of the problem and 
                        provide guidance on appropriate next steps.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Important Notes</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>This is <strong>not a diagnosis</strong>. Only a qualified professional can diagnose a substance use disorder.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>Answer based on <strong>what you have observed</strong> over the past 12 months.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>Be as honest as possible. Minimizing the problem won't help your loved one.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>This applies to alcohol, opioids, stimulants, cannabis, or any other substances.</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">How to Answer</h3>
                      <p>For each question, select the response that best describes what you've observed:</p>
                      <ul className="mt-2 space-y-1">
                        <li><span className="font-medium">No</span> – You haven't observed this behavior</li>
                        <li><span className="font-medium">Sometimes</span> – This happens occasionally</li>
                        <li><span className="font-medium">Often</span> – This is a regular pattern</li>
                        <li><span className="font-medium">Almost Always</span> – This is the norm</li>
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
    const { totalScore, dsmCriteriaMet } = calculateResults();
    const level = getSeverityLevel(totalScore, dsmCriteriaMet);
    const result = results[level];

    return (
      <section className="py-16 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-card p-6 md:p-10 rounded-xl shadow-lg border-4 border-foreground/40 ring-1 ring-foreground/20">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
                Assessment Results
              </h2>
              <p className="text-muted-foreground">
                Based on your observations of your loved one
              </p>
            </div>

            <div className="bg-primary/5 rounded-lg p-6 md:p-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  level === "none" ? "bg-green-100 text-green-800" :
                  level === "mild" ? "bg-yellow-100 text-yellow-800" :
                  level === "moderate" ? "bg-orange-100 text-orange-800" :
                  "bg-red-100 text-red-800"
                }`}>
                  {level === "none" ? "Low Concern" :
                   level === "mild" ? "Mild" :
                   level === "moderate" ? "Moderate" :
                   "Severe"}
                </div>
                <span className="text-sm text-muted-foreground">
                  {dsmCriteriaMet} of 11 clinical criteria indicated
                </span>
              </div>
              
              <h3 className="font-serif text-2xl font-bold text-primary mb-4">
                {result.title}
              </h3>
              
              <div className="bg-background/50 rounded-lg p-4 mb-4 border border-border">
                <p className="text-sm font-medium text-foreground mb-1">Clinical Interpretation:</p>
                <p className="text-muted-foreground text-sm">
                  {result.dsmInterpretation}
                </p>
              </div>
              
              <p className="text-foreground leading-relaxed">
                {result.description}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 md:p-8 mb-8">
              <h4 className="font-semibold text-foreground mb-4">Recommended Next Steps:</h4>
              <ul className="space-y-3">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </span>
                    <span className="text-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={`rounded-lg p-4 mb-8 ${
              level === "none" ? "bg-green-50 border border-green-200" :
              level === "mild" ? "bg-yellow-50 border border-yellow-200" :
              level === "moderate" ? "bg-orange-50 border border-orange-200" :
              "bg-red-50 border border-red-200"
            }`}>
              <p className="font-semibold text-foreground">
                Urgency Level: {result.urgency}
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-6 border border-border">
              <h4 className="font-semibold text-foreground mb-3">Remember:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Addiction is a medical condition, not a moral failing</li>
                <li>• Recovery is possible at any stage</li>
                <li>• You cannot control their choices, only your own responses</li>
                <li>• Taking care of yourself is not selfish—it's necessary</li>
                <li>• Professional help significantly improves outcomes</li>
              </ul>
            </div>

            <div className="mt-8 text-center">
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Take Assessment Again
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-card p-6 md:p-10 rounded-xl shadow-lg border-4 border-foreground/40 ring-1 ring-foreground/20">
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
              <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground mb-2">
                {sections[currentSection].title}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                {sections[currentSection].description}
              </p>

              <div className="space-y-8">
                {currentSectionQuestions.map((question, idx) => (
                  <div key={idx} className="space-y-3">
                    <div>
                      <p className="text-foreground font-medium">
                        {idx + 1}. {question.text}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {question.subtext}
                      </p>
                    </div>
                    <RadioGroup
                      value={answers[`${currentSection}-${idx}`] !== undefined ? answers[`${currentSection}-${idx}`].toString() : ""}
                      onValueChange={(value) => handleAnswer(idx, parseInt(value))}
                      className="grid grid-cols-2 md:grid-cols-4 gap-2"
                    >
                      {responseOptions.map((option) => (
                        <div key={option.value}>
                          <RadioGroupItem
                            value={option.value.toString()}
                            id={`addiction-q${currentSection}-${idx}-${option.value}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`addiction-q${currentSection}-${idx}-${option.value}`}
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

export default AddictionAssessment;