import { Button } from "@/components/ui/button";

interface IntroSectionProps {
  onStart: () => void;
}

export default function IntroSection({ onStart }: IntroSectionProps) {
  return (
    <div className="p-6">
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
