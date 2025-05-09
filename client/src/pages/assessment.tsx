import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AssessmentData, Question, UserInfo, Section } from "@/lib/types";
import { Card } from "@/components/ui/card";
import IntroSection from "@/components/assessment/IntroSection";
import QuestionSection from "@/components/assessment/QuestionSection";
import UserInfoForm from "@/components/assessment/UserInfoForm";
import ResultsSection from "@/components/assessment/ResultsSection";
import ProgressBar from "@/components/assessment/ProgressBar";
import { REACTIVE_QUESTIONS, STRATEGIC_QUESTIONS } from "@/lib/constants";

export default function Assessment() {
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState<Section>("introduction");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([
    ...REACTIVE_QUESTIONS.map((text, index) => ({
      id: index + 1,
      text,
      value: null,
      category: "reactive",
    })),
    ...STRATEGIC_QUESTIONS.map((text, index) => ({
      id: index + 8,
      text,
      value: null,
      category: "strategic",
    })),
  ]);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    organization: "",
    role: "",
  });
  const [assessmentResult, setAssessmentResult] = useState<AssessmentData | null>(null);
  const [progress, setProgress] = useState(10);

  const saveAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: AssessmentData) => {
      const res = await apiRequest("POST", "/api/assessments", assessmentData);
      return await res.json();
    },
    onSuccess: (data) => {
      setAssessmentResult(data);
      toast({
        title: "Assessment completed",
        description: "Your leadership self-check results are ready!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving assessment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    updateProgress();
  }, [currentSection, currentQuestionIndex, questions]);

  const updateProgress = () => {
    let progressValue = 0;
    const answeredCount = questions.filter((q) => q.value !== null).length;

    if (currentSection === "introduction") {
      progressValue = 10;
    } else if (currentSection === "questions") {
      // Base progress on question index + answered percentage
      const baseProgress = 10; // Starting progress
      const sectionProgress = 60; // Progress for question section
      const indexProgress = (currentQuestionIndex / 14) * sectionProgress;
      const answerBonus = (answeredCount / 14) * 5;

      progressValue = baseProgress + indexProgress + answerBonus;
    } else if (currentSection === "userInfo") {
      progressValue = 80;
    } else if (currentSection === "results") {
      progressValue = 100;
    }

    setProgress(progressValue);
  };

  const startAssessment = () => {
    setCurrentSection("questions");
  };

  const handleAnswerChange = (questionId: number, value: number) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, value } : q))
    );
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex === 13) {
      setCurrentSection("userInfo");
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleUserInfoChange = (info: UserInfo) => {
    setUserInfo(info);
  };

  const submitAssessment = () => {
    // Calculate scores
    const reactiveScore = questions
      .filter((q) => q.category === "reactive")
      .reduce((sum, q) => sum + (q.value || 0), 0);
    
    const strategicScore = questions
      .filter((q) => q.category === "strategic")
      .reduce((sum, q) => sum + (q.value || 0), 0);

    // Get interpretation
    let interpretation = "";
    if (strategicScore > 25 && reactiveScore < 20) {
      interpretation = "Mostly Strategic: You're leading from vision, self-trust, and courage.";
    } else if (reactiveScore > 25 && strategicScore < 20) {
      interpretation = "Mostly Reactive: You may be leading from fear of disapproval or control.";
    } else {
      interpretation = "Mixed: You're in a transition zone—aware of new ways but held back by old patterns.";
    }

    const assessmentData: AssessmentData = {
      userInfo,
      reactiveScore,
      strategicScore,
      questions,
      interpretation,
      date: new Date().toISOString(),
    };

    saveAssessmentMutation.mutate(assessmentData);
    setCurrentSection("results");
    setAssessmentResult(assessmentData);
  };

  const restartAssessment = () => {
    setQuestions((prev) =>
      prev.map((q) => ({ ...q, value: null }))
    );
    setCurrentQuestionIndex(0);
    setCurrentSection("introduction");
    setAssessmentResult(null);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl min-h-screen">
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="text-center p-6 bg-white">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Leadership Self-Check</h1>
          <p className="text-gray-600 font-medium">Are You Leading Strategically or Reactively?</p>
        </div>

        <ProgressBar progress={progress} />

        {currentSection === "introduction" && (
          <IntroSection onStart={startAssessment} />
        )}

        {currentSection === "questions" && (
          <QuestionSection
            currentQuestionIndex={currentQuestionIndex}
            questions={questions}
            onAnswerChange={handleAnswerChange}
            onNext={goToNextQuestion}
            onPrevious={goToPrevQuestion}
          />
        )}

        {currentSection === "userInfo" && (
          <UserInfoForm
            userInfo={userInfo}
            onChange={handleUserInfoChange}
            onSubmit={submitAssessment}
            isSubmitting={saveAssessmentMutation.isPending}
          />
        )}

        {currentSection === "results" && assessmentResult && (
          <ResultsSection 
            assessmentResult={assessmentResult} 
            onRestart={restartAssessment} 
          />
        )}
      </Card>
    </div>
  );
}
