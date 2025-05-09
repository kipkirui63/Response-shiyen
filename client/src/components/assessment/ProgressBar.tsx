interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  // Calculate which step we're on
  const getStepStatus = (stepThreshold: number) => {
    if (progress >= stepThreshold) return "completed";
    return "pending";
  };

  return (
    <div className="mb-8">
      {/* Visible progress bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3 shadow-inner">
        <div
          className="h-full bg-primary transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Progress steps indicators */}
      <div className="flex justify-between px-2">
        <div className="flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full border-2 ${
            getStepStatus(0) === "completed" 
              ? "bg-primary border-primary" 
              : "bg-white border-gray-300"
          }`}></div>
          <span className="text-xs font-medium mt-1 text-gray-600">Start</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full border-2 ${
            getStepStatus(33) === "completed" 
              ? "bg-primary border-primary" 
              : "bg-white border-gray-300"
          }`}></div>
          <span className="text-xs font-medium mt-1 text-gray-600">Questions</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full border-2 ${
            getStepStatus(66) === "completed" 
              ? "bg-primary border-primary" 
              : "bg-white border-gray-300"
          }`}></div>
          <span className="text-xs font-medium mt-1 text-gray-600">Info</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full border-2 ${
            getStepStatus(99) === "completed" 
              ? "bg-primary border-primary" 
              : "bg-white border-gray-300"
          }`}></div>
          <span className="text-xs font-medium mt-1 text-gray-600">Results</span>
        </div>
      </div>
    </div>
  );
}
