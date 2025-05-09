import { Button } from "@/components/ui/button";
import logo from "@/assets/DDLL_Logo_Converted.png";

interface IntroSectionProps {
  onStart: () => void;
}

export default function IntroSection({ onStart }: IntroSectionProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="heading-xl text-center mb-6 text-primary">Leadership Self-Check</h1>
      
      <div className="card-secondary p-6 mb-8">
        <h2 className="heading-md mb-3 text-primary">Welcome to Your Leadership Assessment</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Leadership at the top drives everything down. This quick yet powerful diagnostic helps 
          you surface subtle signs of misalignment across five domains—so you can lead your 
          team with clarity, unity, and speed.
        </p>
        <p className="text-gray-700 leading-relaxed">
          For each statement below, rate yourself from <span className="font-semibold">1 (Strongly Disagree)</span> to
          <span className="font-semibold"> 5 (Strongly Agree)</span>.
        </p>
      </div>

      <div className="card-elevated p-5 mb-6 text-center">
        <h3 className="heading-sm text-gray-700 mb-3">
          Ready to discover your leadership style?
        </h3>
        <p className="text-gray-600 mb-4">
          Complete this assessment to receive your personalized results.
        </p>
        <Button 
          size="lg"
          className="py-6 px-10 text-lg shadow-md hover:shadow-lg transition-all duration-300" 
          onClick={onStart}
        >
          Begin Assessment
        </Button>
      </div>
    </div>
  );
}
