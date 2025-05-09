import { Question } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface QuestionSectionProps {
  currentQuestionIndex: number;
  questions: Question[];
  onAnswerChange: (questionId: number, value: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function QuestionSection({
  currentQuestionIndex,
  questions,
  onAnswerChange,
  onNext,
  onPrevious,
}: QuestionSectionProps) {
  const currentQuestion = questions[currentQuestionIndex];
  const isReactive = currentQuestionIndex < 7;
  const categoryTitle = isReactive ? "Reactive Tendencies" : "Strategic/Creative Tendencies";

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{categoryTitle}</h2>

      {questions.map((question, index) => (
        <div
          key={question.id}
          className={`question-item mb-8 ${currentQuestionIndex === index ? "active" : ""}`}
        >
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

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <Button onClick={onNext}>
          {currentQuestionIndex === 13 ? "Continue" : "Next"}
        </Button>
      </div>
    </div>
  );
}
