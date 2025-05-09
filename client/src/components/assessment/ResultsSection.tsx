import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Download, RefreshCw } from "lucide-react";
import { AssessmentData } from "@/lib/types";
import { generatePDF } from "@/lib/pdfGenerator";

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
    <div className="p-6">
      <div className="bg-green-50 rounded-lg p-4 mb-6 border-l-4 border-green-400">
        <p className="text-gray-700 font-medium">
          Thank you for completing the assessment!
        </p>
        <p className="text-gray-600 mt-1">Your results are ready below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-gray-700 font-medium mb-1">Your Strategic Score</h3>
          <div className="flex items-baseline">
            <span className="text-primary text-3xl font-bold">
              {strategicScore}
            </span>
            <span className="text-gray-500 ml-1">/ 35</span>
            <span className="ml-2 text-sm text-gray-500">
              {Math.round((strategicScore / 35) * 100)}%
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-gray-700 font-medium mb-1">Assessment Date</h3>
          <p className="text-primary text-lg font-medium">
            {formatDate(date)}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-gray-800 font-medium mb-3">Scoring Guide</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700">40–50:</span>
            <span className="text-gray-600">High-performing team in sync</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">30–39:</span>
            <span className="text-gray-600">Partially aligned</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">20–29:</span>
            <span className="text-gray-600">Functional but fractured</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Under 20:</span>
            <span className="text-gray-600">Consider team reset</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-gray-800 font-medium mb-2">Interpretation</h3>
        <div className="space-y-3">
          <p className="text-primary-600 font-medium">{getInterpretationTitle()}</p>
          <p className="text-gray-600">{getInterpretationDescription()}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-secondary p-4 rounded-lg">
          <p className="text-gray-700 font-medium mb-2">
            Want to understand your patterns and grow into your most effective leadership?
          </p>
          <Button className="w-full">
            Book a private leadership reflection session with Shiyen Shu
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" /> Download My Results
          </Button>
          <Button
            variant="secondary"
            className="flex-1 gap-2"
            onClick={onRestart}
          >
            <RefreshCw className="h-4 w-4" /> Start Over
          </Button>
        </div>
      </div>
    </div>
  );
}
