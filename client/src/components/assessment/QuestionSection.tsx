import { Question } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface QuestionSectionProps {
  questions: Question[];
  onAnswerChange: (questionId: number, value: number) => void;
  onNext: () => void;
}

export default function QuestionSection({
  questions,
  onAnswerChange,
  onNext,
}: QuestionSectionProps) {
  const [showValidationError, setShowValidationError] = useState(false);

  const reactiveQuestions = questions.filter(q => q.category === "reactive");
  const strategicQuestions = questions.filter(q => q.category === "strategic");
  
  const handleSubmit = () => {
    // Check if all questions are answered
    const allQuestionsAnswered = questions.every(q => q.value !== null);
    
    if (allQuestionsAnswered) {
      onNext();
    } else {
      setShowValidationError(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="p-6">
      {showValidationError && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 border border-red-200">
          Please answer all questions before submitting.
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Reactive Tendencies</h2>
        {reactiveQuestions.map((question) => (
          <div key={question.id} className="mb-8">
            <p className="text-gray-700 mb-3">
              {question.id}. {question.text}
            </p>
            <div className="flex space-x-8 items-center mt-2">
              <div className="text-sm text-gray-500 w-32">Strongly Disagree</div>
              <div className="flex-1 flex justify-between items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="text-center">
                    <label className="custom-radio flex flex-col items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`q${question.id}`}
                        value={value}
                        checked={question.value === value}
                        onChange={() => onAnswerChange(question.id, value)}
                      />
                      <span className="radio-checkmark"></span>
                      <span className="text-xs text-gray-500 mt-1">{value}</span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-500 w-32 text-right">Strongly Agree</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Strategic/Creative Tendencies</h2>
        {strategicQuestions.map((question) => (
          <div key={question.id} className="mb-8">
            <p className="text-gray-700 mb-3">
              {question.id}. {question.text}
            </p>
            <div className="flex space-x-8 items-center mt-2">
              <div className="text-sm text-gray-500 w-32">Strongly Disagree</div>
              <div className="flex-1 flex justify-between items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="text-center">
                    <label className="custom-radio flex flex-col items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`q${question.id}`}
                        value={value}
                        checked={question.value === value}
                        onChange={() => onAnswerChange(question.id, value)}
                      />
                      <span className="radio-checkmark"></span>
                      <span className="text-xs text-gray-500 mt-1">{value}</span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-500 w-32 text-right">Strongly Agree</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Button className="w-full py-6" onClick={handleSubmit}>
          Submit My Responses
        </Button>
      </div>
    </div>
  );
}
