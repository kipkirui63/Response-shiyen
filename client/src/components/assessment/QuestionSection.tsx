import { Question } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import logoImage from "@/assets/DDLL_Logo_Converted.png";

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
    <div className="p-6 max-w-4xl mx-auto">
      
      {showValidationError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border-l-4 border-red-500 shadow-sm animate-fadeIn">
          <p className="font-medium">Please Answer All Questions</p>
          <p className="text-sm mt-1">All questions require a response before you can proceed.</p>
        </div>
      )}
      
      <div className="card-primary p-5 mb-8">
        <h2 className="heading-md text-primary mb-2">Instructions</h2>
        <p className="text-gray-700">
          For each statement, select a rating from 1 (Strongly Disagree) to 5 (Strongly Agree) that best represents your leadership approach.
        </p>
      </div>
      
      <div className="mb-10">
        <h2 className="section-heading">Reactive Tendencies</h2>
        <div className="bg-secondary p-5 rounded-lg border border-primary/20 shadow-sm">
          {reactiveQuestions.map((question, index) => (
            <div 
              key={question.id} 
              className={`${index !== reactiveQuestions.length - 1 ? 'mb-8 pb-8 border-b border-primary/10' : ''}`}
            >
              <div className="flex items-center mb-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-3">
                  {question.id}
                </span>
                <p className="text-gray-800 font-medium">
                  {question.text}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Strongly Disagree</span>
                  <span className="text-sm font-medium text-gray-500">Strongly Agree</span>
                </div>
                
                <div className="flex justify-between items-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="text-center w-1/5">
                      <label className="custom-radio flex flex-col items-center cursor-pointer group">
                        <input
                          type="radio"
                          name={`q${question.id}`}
                          value={value}
                          checked={question.value === value}
                          onChange={() => onAnswerChange(question.id, value)}
                        />
                        <span className="radio-checkmark group-hover:shadow-md transition-shadow"></span>
                        <span className="text-sm font-medium text-primary mt-1">{value}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="section-heading">Strategic/Creative Tendencies</h2>
        <div className="bg-secondary p-5 rounded-lg border border-primary/20 shadow-sm">
          {strategicQuestions.map((question, index) => (
            <div 
              key={question.id} 
              className={`${index !== strategicQuestions.length - 1 ? 'mb-8 pb-8 border-b border-primary/10' : ''}`}
            >
              <div className="flex items-center mb-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-3">
                  {question.id}
                </span>
                <p className="text-gray-800 font-medium">
                  {question.text}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">Strongly Disagree</span>
                  <span className="text-sm font-medium text-gray-500">Strongly Agree</span>
                </div>
                
                <div className="flex justify-between items-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="text-center w-1/5">
                      <label className="custom-radio flex flex-col items-center cursor-pointer group">
                        <input
                          type="radio"
                          name={`q${question.id}`}
                          value={value}
                          checked={question.value === value}
                          onChange={() => onAnswerChange(question.id, value)}
                        />
                        <span className="radio-checkmark group-hover:shadow-md transition-shadow"></span>
                        <span className="text-sm font-medium text-primary mt-1">{value}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-elevated p-6 text-center">
        <p className="text-gray-700 mb-4">
          When you've completed all questions, submit your responses to see your results.
        </p>
        <Button 
          size="lg" 
          className="px-10 py-6 text-lg shadow-md hover:shadow-lg transition-all duration-300" 
          onClick={handleSubmit}
        >
          Submit My Responses
        </Button>
      </div>
    </div>
  );
}
