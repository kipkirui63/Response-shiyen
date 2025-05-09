import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Download, RefreshCw } from "lucide-react";
import { AssessmentData } from "@/lib/types";
import { generatePDF } from "@/lib/pdfGenerator";
import logo from "@/assets/DDLL_Logo_Converted.png";

interface ResultsSectionProps {
  assessmentResult: AssessmentData;
  onRestart: () => void;
}

export default function ResultsSection({
  assessmentResult,
  onRestart,
}: ResultsSectionProps) {
  const { reactiveScore, strategicScore, interpretation, date } = assessmentResult;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "M/d/yyyy");
  };

  const handleDownload = () => {
    generatePDF(assessmentResult);
  };

  // Determine interpretation title
  const getInterpretationTitle = () => {
    if (strategicScore > 25 && reactiveScore < 20) {
      return "Mostly Strategic (>25 on Strategic, <20 on Reactive)";
    } else if (reactiveScore > 25 && strategicScore < 20) {
      return "Mostly Reactive (>25 on Reactive, <20 on Strategic)";
    } else {
      return "Mixed (20–25 in both)";
    }
  };

  // Get interpretation description - extract from the full interpretation text
  const getInterpretationDescription = () => {
    return interpretation.split(":")[1]?.trim() || interpretation;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="card-primary p-6 mb-8">
        <h2 className="heading-lg text-primary mb-3">Your Assessment Results</h2>
        <p className="text-gray-700 font-medium">
          Thank you for completing the Leadership Self-Check assessment!
        </p>
        <p className="text-gray-600 mt-2">
          Your personalized results are ready below. Review your scores to understand your leadership style.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card-elevated p-5 text-center">
          <h3 className="result-label">Assessment Date</h3>
          <p className="text-primary text-lg font-serif italic mt-2">
            {formatDate(date)}
          </p>
        </div>
        
        <div className="card-elevated p-5 text-center transform hover:scale-105 transition-transform duration-300">
          <h3 className="result-label">Reactive Score</h3>
          <div className="mt-2">
            <div className="flex items-center justify-center">
              <span className="result-value">{reactiveScore}</span>
              <span className="text-gray-500 ml-1 text-lg">/ 35</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {Math.round((reactiveScore / 35) * 100)}%
            </div>
          </div>
        </div>
        
        <div className="card-elevated p-5 text-center transform hover:scale-105 transition-transform duration-300">
          <h3 className="result-label">Strategic Score</h3>
          <div className="mt-2">
            <div className="flex items-center justify-center">
              <span className="result-value">{strategicScore}</span>
              <span className="text-gray-500 ml-1 text-lg">/ 35</span>
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {Math.round((strategicScore / 35) * 100)}%
            </div>
          </div>
        </div>
      </div>

      <div className="card-success p-6 mb-8">
        <h3 className="section-heading">Interpret Your Scores</h3>
        <ul className="space-y-5 pl-5 list-disc">
          <li className="pb-3 border-b border-gray-100">
            <span className="text-gray-800 font-bold">Mostly Reactive ({'>'}25 on Reactive, {'<'}20 on Strategic):</span>
            <p className="text-gray-700 mt-1">You may be leading from fear of disapproval or control.</p>
          </li>
          <li className="pb-3 border-b border-gray-100">
            <span className="text-gray-800 font-bold">Mixed (20–25 in both):</span>
            <p className="text-gray-700 mt-1">You're in a transition zone—aware of new ways but held back by old patterns.</p>
          </li>
          <li>
            <span className="text-gray-800 font-bold">Mostly Strategic ({'>'}25 on Strategic, {'<'}20 on Reactive):</span>
            <p className="text-gray-700 mt-1">You're leading from vision, self-trust, and courage.</p>
          </li>
        </ul>
      </div>

      <div className="card-primary p-6 mb-8">
        <h3 className="section-heading">Your Interpretation</h3>
        <div className="bg-white p-4 rounded-lg shadow-sm mt-2">
          <p className="text-primary font-bold text-xl mb-2">{getInterpretationTitle()}</p>
          <p className="text-gray-700 leading-relaxed">{getInterpretationDescription()}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card-success p-6 text-center">
          <h3 className="heading-md text-primary mb-3">
            Want to grow into your most effective leadership?
          </h3>
          <p className="text-gray-700 mb-4">
            Book a private leadership reflection session to understand your patterns and transform your approach.
          </p>
          <Button 
            size="lg"
            className="py-6 px-10 text-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Book a Session with Shiyen Shu
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1 gap-2 py-6"
            onClick={handleDownload}
          >
            <Download className="h-5 w-5" /> Download My Results
          </Button>
          <Button
            variant="secondary"
            className="flex-1 gap-2 py-6"
            onClick={onRestart}
          >
            <RefreshCw className="h-5 w-5" /> Start Over
          </Button>
        </div>
      </div>
    </div>
  );
}
