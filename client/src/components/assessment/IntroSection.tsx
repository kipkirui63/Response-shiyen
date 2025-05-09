import { Button } from "@/components/ui/button";

interface IntroSectionProps {
  onStart: () => void;
}

export default function IntroSection({ onStart }: IntroSectionProps) {
  return (
    <div className="p-6">
      <div className="bg-secondary rounded-lg p-4 mb-6 border-l-4 border-primary">
        <p className="text-gray-700">
          This self-check is designed to help you reflect on whether your
          leadership is driven more by internal purpose and vision
          (Strategic/Creative) or by external validation and control (Reactive).
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
