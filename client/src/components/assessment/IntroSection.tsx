import { Button } from "@/components/ui/button";
import logo from "@/assets/DDLL_Logo_Converted.png";

interface IntroSectionProps {
  onStart: () => void;
}

export default function IntroSection({ onStart }: IntroSectionProps) {
  return (
    <div className="p-6">
      <div className="flex justify-center mb-6">
        <img src={logo} alt="Dream. Dare. Lead. Logo" className="h-20" />
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-2 text-gray-800">
        Leadership Self-Check
      </h1>
      <h2 className="text-xl text-center mb-6 text-gray-700">
        Are You Leading Strategically or Reactively?
      </h2>
      
      <div className="bg-pink-50 rounded-lg p-5 mb-6 border-l-4 border-primary">
        <p className="text-gray-700">
          Leadership at the top drives everything down. This quick yet powerful diagnostic helps 
          you surface subtle signs of misalignment across five domains—so you can lead your 
          team with clarity, unity, and speed.
        </p>
        <p className="text-gray-700 mt-3">
          For each statement below, rate yourself from 1 (Strongly Disagree) to
          5 (Strongly Agree).
        </p>
      </div>

      <Button className="w-full py-6" onClick={onStart}>
        Begin Assessment
      </Button>
    </div>
  );
}
