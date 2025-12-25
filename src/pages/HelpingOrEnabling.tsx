import { useState } from "react";
import { Helmet } from "react-helmet";
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle, AlertTriangle, HelpCircle, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "react-router-dom";

const handlePrint = () => {
  window.print();
};

type Step = "intro" | 1 | 2 | 3 | 4 | 5 | "5b" | 6 | 7 | 8 | "result";

interface Answers {
  action: string;
  problemSolved: string;
  responsibilityCheck: string;
  consequenceFilter: string;
  patternCheck: string;
  lastingChange?: string;
  costToYou: string[];
  boundaryAlignment: string;
  motivation: string;
  alternative?: string;
}

const HelpingOrEnabling = () => {
  const [currentStep, setCurrentStep] = useState<Step>("intro");
  const [answers, setAnswers] = useState<Answers>({
    action: "",
    problemSolved: "",
    responsibilityCheck: "",
    consequenceFilter: "",
    patternCheck: "",
    costToYou: [],
    boundaryAlignment: "",
    motivation: "",
  });

  const calculateResult = (): "helping" | "enabling" | "mixed" => {
    let helpingScore = 0;
    let enablingScore = 0;

    // Problem solved analysis
    if (answers.problemSolved === "safety") helpingScore += 2;
    if (answers.problemSolved === "discomfort" || answers.problemSolved === "anxiety") enablingScore += 2;
    if (answers.problemSolved === "logistical") helpingScore += 1;

    // Responsibility check
    if (answers.responsibilityCheck === "yes") enablingScore += 2;
    if (answers.responsibilityCheck === "no") helpingScore += 2;

    // Consequence filter
    if (answers.consequenceFilter === "yes") enablingScore += 2;
    if (answers.consequenceFilter === "no") helpingScore += 2;

    // Pattern check
    if (answers.patternCheck === "many" && answers.lastingChange === "no") enablingScore += 3;
    if (answers.patternCheck === "new") helpingScore += 1;

    // Cost analysis
    const highCosts = ["emotional", "financial", "conflict", "trust", "resentment", "safety"];
    const significantCosts = answers.costToYou.filter(c => highCosts.includes(c)).length;
    if (significantCosts >= 3) enablingScore += 2;
    if (answers.costToYou.includes("nothing")) helpingScore += 1;

    // Boundary alignment
    if (answers.boundaryAlignment === "yes") helpingScore += 2;
    if (answers.boundaryAlignment === "no") enablingScore += 2;

    // Motivation
    if (answers.motivation === "growth") helpingScore += 2;
    if (answers.motivation === "chaos" || answers.motivation === "fear" || answers.motivation === "guilt") enablingScore += 2;

    const difference = helpingScore - enablingScore;
    if (difference >= 3) return "helping";
    if (difference <= -3) return "enabling";
    return "mixed";
  };

  const handleNext = () => {
    const stepOrder: Step[] = ["intro", 1, 2, 3, 4, 5, "5b", 6, 7, 8, "result"];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    // Skip 5b if pattern check is not "many times"
    if (currentStep === 5 && answers.patternCheck !== "many") {
      setCurrentStep(6);
      return;
    }
    
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ["intro", 1, 2, 3, 4, 5, "5b", 6, 7, 8, "result"];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    // Skip 5b when going back if needed
    if (currentStep === 6 && answers.patternCheck !== "many") {
      setCurrentStep(5);
      return;
    }
    
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleRestart = () => {
    setCurrentStep("intro");
    setAnswers({
      action: "",
      problemSolved: "",
      responsibilityCheck: "",
      consequenceFilter: "",
      patternCheck: "",
      costToYou: [],
      boundaryAlignment: "",
      motivation: "",
    });
  };

  const handleCostChange = (cost: string, checked: boolean) => {
    if (checked) {
      setAnswers(prev => ({ ...prev, costToYou: [...prev.costToYou, cost] }));
    } else {
      setAnswers(prev => ({ ...prev, costToYou: prev.costToYou.filter(c => c !== cost) }));
    }
  };

  const getStepNumber = (): string => {
    const stepMap: Record<Step, string> = {
      "intro": "",
      1: "Step 1 of 8",
      2: "Step 2 of 8",
      3: "Step 3 of 8",
      4: "Step 4 of 8",
      5: "Step 5 of 8",
      "5b": "Step 5 of 8",
      6: "Step 6 of 8",
      7: "Step 7 of 8",
      8: "Step 8 of 8",
      "result": "",
    };
    return stepMap[currentStep];
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case "intro": return true;
      case 1: return answers.action.trim().length > 0;
      case 2: return answers.problemSolved !== "";
      case 3: return answers.responsibilityCheck !== "";
      case 4: return answers.consequenceFilter !== "";
      case 5: return answers.patternCheck !== "";
      case "5b": return answers.lastingChange !== undefined && answers.lastingChange !== "";
      case 6: return answers.costToYou.length > 0;
      case 7: return answers.boundaryAlignment !== "";
      case 8: return answers.motivation !== "";
      default: return true;
    }
  };

  const result = currentStep === "result" ? calculateResult() : null;

  return (
    <>
      <Helmet>
        <title>Helping or Enabling? | Decision Tool for Families | No More Enabling</title>
        <meta name="description" content="An interactive decision tool to help families affected by addiction understand whether their actions support recovery or unintentionally protect the addiction." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl mx-auto">
            
            {/* Progress indicator */}
            {currentStep !== "intro" && currentStep !== "result" && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground font-medium">{getStepNumber()}</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round((typeof currentStep === "number" ? currentStep : currentStep === "5b" ? 5.5 : 0) / 8 * 100)}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${(typeof currentStep === "number" ? currentStep : currentStep === "5b" ? 5.5 : 0) / 8 * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Card container */}
            <div className="bg-card border border-border rounded-2xl shadow-xl p-8 md:p-12">
              
              {/* INTRO SCREEN */}
              {currentStep === "intro" && (
                <div className="text-center space-y-6 animate-fade-in">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <HelpCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    Helping or Enabling?
                  </h1>
                  <p className="text-lg text-primary font-medium">
                    An interactive decision tool for families affected by addiction
                  </p>
                  <div className="pt-4 border-t border-border">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      Before you act, get clarity.
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      When someone you love is struggling with addiction, every decision can feel urgent. 
                      This tool helps you pause, evaluate a specific action, and understand whether it 
                      supports recovery—or unintentionally protects the addiction.
                    </p>
                    <p className="text-muted-foreground mt-4 font-medium italic">
                      This is not about blame. It's about clarity.
                    </p>
                  </div>
                  <Button 
                    variant="hero" 
                    size="lg" 
                    onClick={handleNext}
                    className="mt-6"
                  >
                    Start the Exercise
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Takes 3–5 minutes · One situation at a time
                  </p>
                </div>
              )}

              {/* STEP 1 — DEFINE THE ACTION */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-foreground">
                    What specific action are you considering?
                  </h2>
                  <div className="space-y-2">
                    <Input
                      placeholder="Example: Giving them money for rent"
                      value={answers.action}
                      onChange={(e) => setAnswers(prev => ({ ...prev, action: e.target.value }))}
                      className="text-lg py-6"
                    />
                    <p className="text-sm text-muted-foreground">
                      Be specific. Vague actions lead to unclear outcomes.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2 — IMMEDIATE PROBLEM */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-foreground">
                    What problem does this action mainly solve?
                  </h2>
                  <RadioGroup 
                    value={answers.problemSolved} 
                    onValueChange={(value) => setAnswers(prev => ({ ...prev, problemSolved: value }))}
                    className="space-y-3"
                  >
                    {[
                      { value: "discomfort", label: "Their discomfort" },
                      { value: "anxiety", label: "My anxiety or fear" },
                      { value: "safety", label: "A real safety concern" },
                      { value: "logistical", label: "A logistical issue (housing, work, legal, etc.)" },
                      { value: "other", label: "Something else" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="flex-1 cursor-pointer text-base">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {(answers.problemSolved === "discomfort" || answers.problemSolved === "anxiety") && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-amber-800 dark:text-amber-200 text-sm">
                        Short-term relief doesn't always support long-term change.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3 — RESPONSIBILITY CHECK */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-foreground">
                    If you don't take this action, would your loved one need to take responsibility for the situation?
                  </h2>
                  <RadioGroup 
                    value={answers.responsibilityCheck} 
                    onValueChange={(value) => setAnswers(prev => ({ ...prev, responsibilityCheck: value }))}
                    className="space-y-3"
                  >
                    {[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                      { value: "unsure", label: "I'm not sure" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.value} id={`resp-${option.value}`} />
                        <Label htmlFor={`resp-${option.value}`} className="flex-1 cursor-pointer text-base">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <p className="text-sm text-muted-foreground">
                    Responsibility is a key indicator of helping vs. enabling.
                  </p>
                </div>
              )}

              {/* STEP 4 — CONSEQUENCE FILTER */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-foreground">
                    Does this action remove or reduce a consequence tied to their behavior?
                  </h2>
                  <RadioGroup 
                    value={answers.consequenceFilter} 
                    onValueChange={(value) => setAnswers(prev => ({ ...prev, consequenceFilter: value }))}
                    className="space-y-3"
                  >
                    {[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                      { value: "unsure", label: "I'm not sure" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.value} id={`cons-${option.value}`} />
                        <Label htmlFor={`cons-${option.value}`} className="flex-1 cursor-pointer text-base">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {answers.consequenceFilter === "yes" && (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <p className="text-amber-800 dark:text-amber-200 text-sm">
                        Consequences are not punishments. They are how reality teaches.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5 — PATTERN CHECK */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-foreground">
                    Have you done this before?
                  </h2>
                  <RadioGroup 
                    value={answers.patternCheck} 
                    onValueChange={(value) => setAnswers(prev => ({ ...prev, patternCheck: value }))}
                    className="space-y-3"
                  >
                    {[
                      { value: "many", label: "Yes, many times" },
                      { value: "occasionally", label: "Yes, occasionally" },
                      { value: "new", label: "No, this would be new" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.value} id={`pattern-${option.value}`} />
                        <Label htmlFor={`pattern-${option.value}`} className="flex-1 cursor-pointer text-base">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* STEP 5B — LASTING CHANGE (Conditional) */}
              {currentStep === "5b" && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-foreground">
                    Did it lead to lasting change?
                  </h2>
                  <RadioGroup 
                    value={answers.lastingChange || ""} 
                    onValueChange={(value) => setAnswers(prev => ({ ...prev, lastingChange: value }))}
                    className="space-y-3"
                  >
                    {[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                      { value: "temporary", label: "Only temporarily" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.value} id={`lasting-${option.value}`} />
                        <Label htmlFor={`lasting-${option.value}`} className="flex-1 cursor-pointer text-base">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <p className="text-sm text-muted-foreground">
                    Repeated actions without change are important data.
                  </p>
                </div>
              )}

              {/* STEP 6 — COST TO YOU */}
              {currentStep === 6 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-foreground">
                    What does this action cost you or others?
                  </h2>
                  <p className="text-sm text-muted-foreground">Select all that apply</p>
                  <div className="space-y-3">
                    {[
                      { value: "emotional", label: "Emotional exhaustion" },
                      { value: "financial", label: "Financial strain" },
                      { value: "conflict", label: "Conflict in the family" },
                      { value: "trust", label: "Loss of trust" },
                      { value: "resentment", label: "Resentment" },
                      { value: "safety", label: "Personal safety" },
                      { value: "nothing", label: "Nothing significant" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <Checkbox 
                          id={`cost-${option.value}`}
                          checked={answers.costToYou.includes(option.value)}
                          onCheckedChange={(checked) => handleCostChange(option.value, checked as boolean)}
                        />
                        <Label htmlFor={`cost-${option.value}`} className="flex-1 cursor-pointer text-base">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Helping may be uncomfortable. Enabling is often costly.
                  </p>
                </div>
              )}

              {/* STEP 7 — BOUNDARY ALIGNMENT */}
              {currentStep === 7 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-foreground">
                    Does this action align with the boundaries you believe are necessary for long-term change?
                  </h2>
                  <RadioGroup 
                    value={answers.boundaryAlignment} 
                    onValueChange={(value) => setAnswers(prev => ({ ...prev, boundaryAlignment: value }))}
                    className="space-y-3"
                  >
                    {[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" },
                      { value: "unclear", label: "I don't have clear boundaries right now" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.value} id={`boundary-${option.value}`} />
                        <Label htmlFor={`boundary-${option.value}`} className="flex-1 cursor-pointer text-base">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {answers.boundaryAlignment === "unclear" && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-blue-800 dark:text-blue-200 text-sm">
                        Boundaries are learned skills. Most families need support building them.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 8 — MOTIVATION CLARIFIER */}
              {currentStep === 8 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-2xl font-bold text-foreground">
                    What is driving this decision most right now?
                  </h2>
                  <RadioGroup 
                    value={answers.motivation} 
                    onValueChange={(value) => setAnswers(prev => ({ ...prev, motivation: value }))}
                    className="space-y-3"
                  >
                    {[
                      { value: "growth", label: "Supporting growth and responsibility" },
                      { value: "chaos", label: "Stopping the chaos in the moment" },
                      { value: "fear", label: "Fear of what might happen" },
                      { value: "guilt", label: "Guilt" },
                      { value: "confused", label: "I don't know anymore" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option.value} id={`motivation-${option.value}`} />
                        <Label htmlFor={`motivation-${option.value}`} className="flex-1 cursor-pointer text-base">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <p className="text-sm text-muted-foreground">
                    Motivation matters as much as the action itself.
                  </p>
                </div>
              )}

              {/* RESULT SCREENS */}
              {currentStep === "result" && result && (
                <div className="space-y-8 animate-fade-in print-content">
                  {/* Print header - only visible when printing */}
                  <div className="hidden print:block print-header">
                    <h1 className="text-2xl font-bold mb-2">Helping or Enabling?</h1>
                    <p className="text-sm">Decision Tool Assessment Results</p>
                    <p className="text-sm mt-2">Action evaluated: "{answers.action}"</p>
                  </div>
                  {result === "helping" && (
                    <>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                          This looks like helping.
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                          This action supports responsibility, aligns with boundaries, and allows natural 
                          consequences to occur. It may feel uncomfortable—but it supports long-term change 
                          rather than short-term relief.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Suggested next steps:</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">Communicate expectations clearly</span>
                          </li>
                          <li className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">Stay consistent, even if emotions escalate</span>
                          </li>
                          <li className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">Seek support to help you hold this boundary</span>
                          </li>
                        </ul>
                      </div>
                      <div className="text-center pt-4">
                        <Link to="/family-support-guide">
                          <Button variant="hero" size="lg">
                            Explore Boundary Tools
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}

                  {result === "enabling" && (
                    <>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
                          <AlertTriangle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                          This may be enabling.
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                          This action appears to protect your loved one from consequences while increasing 
                          the emotional, financial, or relational cost to you. Although it may feel loving, 
                          it is unlikely to support meaningful change.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Suggested next steps:</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">Pause before acting</span>
                          </li>
                          <li className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">Identify a boundary-based alternative</span>
                          </li>
                          <li className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">Get family support or professional guidance</span>
                          </li>
                        </ul>
                      </div>
                      <div className="text-center pt-4">
                        <Link to="/family-support-guide">
                          <Button variant="hero" size="lg">
                            Learn How to Set Healthier Boundaries
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}

                  {result === "mixed" && (
                    <>
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
                          <HelpCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">
                          This situation needs more clarity.
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                          Some elements of this action may be supportive, while others could unintentionally 
                          reinforce harmful patterns. Refining your response or adding structure may help.
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Suggested next steps:</h3>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">Adjust the action with clear conditions</span>
                          </li>
                          <li className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">Revisit your boundaries</span>
                          </li>
                          <li className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">Seek outside perspective</span>
                          </li>
                        </ul>
                      </div>
                      <div className="text-center pt-4">
                        <a 
                          href="https://interventiononcall.com/live-family-friends-zoom/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <Button variant="hero" size="lg">
                            Get Guided Support
                          </Button>
                        </a>
                      </div>
                    </>
                  )}

                  {/* Alternative action prompt */}
                  <div className="pt-6 border-t border-border space-y-4">
                    <h3 className="font-semibold text-foreground">
                      If you chose not to do this, what could helping look like instead?
                    </h3>
                    <Textarea
                      placeholder="A boundary-aligned alternative…"
                      value={answers.alternative || ""}
                      onChange={(e) => setAnswers(prev => ({ ...prev, alternative: e.target.value }))}
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Print and Restart buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 no-print">
                    <Button variant="outline" onClick={handlePrint} className="gap-2">
                      <Printer className="w-4 h-4" />
                      Print Results
                    </Button>
                    <Button variant="outline" onClick={handleRestart}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Start Over with a New Situation
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              {currentStep !== "intro" && currentStep !== "result" && (
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
                  <Button variant="ghost" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    variant="hero" 
                    onClick={handleNext}
                    disabled={!canProceed()}
                  >
                    {currentStep === 8 ? "See Results" : "Continue"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>

            {/* Footer disclaimer */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-xs text-muted-foreground max-w-lg mx-auto">
                This tool is educational and does not replace professional advice. It is designed to 
                support families in making informed, sustainable decisions when addiction is present.
              </p>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground font-medium">Built by:</p>
                <p className="text-sm text-muted-foreground">
                  Professional interventionists and mental health contributors with decades of 
                  experience supporting families affected by addiction.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default HelpingOrEnabling;
