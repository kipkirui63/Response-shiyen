import { UserInfo } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import logoImage from "@/assets/DDLL_Logo_Converted.png";

interface UserInfoFormProps {
  userInfo: UserInfo;
  onChange: (info: UserInfo) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function UserInfoForm({
  userInfo,
  onChange,
  onSubmit,
  isSubmitting,
}: UserInfoFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof UserInfo, value: string) => {
    onChange({ ...userInfo, [field]: value });
    
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!userInfo.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!userInfo.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!userInfo.email.includes('@') || !userInfo.email.includes('.')) {
      newErrors.email = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      <div className="card-primary p-6 mb-8">
        <h2 className="heading-md text-primary mb-2">Almost Done!</h2>
        <p className="text-gray-700">
          Please provide some basic information to complete your assessment and receive your personalized results.
        </p>
      </div>

      <div className="card-elevated p-8">
        <h3 className="section-heading mb-6">Your Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
              Name<span className="text-primary">*</span>
            </Label>
            <Input
              id="name"
              value={userInfo.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter your full name"
              className={`h-12 text-base ${errors.name ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-primary"}`}
            />
            {errors.name && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                {errors.name}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
              Email<span className="text-primary">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={userInfo.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter your email address"
              className={`h-12 text-base ${errors.email ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-primary"}`}
            />
            {errors.email && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                {errors.email}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="organization" className="text-sm font-medium text-gray-700 mb-1 block">
              Organization <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </Label>
            <Input
              id="organization"
              value={userInfo.organization}
              onChange={(e) => handleChange("organization", e.target.value)}
              placeholder="Where you work"
              className="h-12 text-base focus-visible:ring-primary"
            />
          </div>

          <div>
            <Label htmlFor="role" className="text-sm font-medium text-gray-700 mb-1 block">
              Role/Title <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </Label>
            <Input
              id="role"
              value={userInfo.role}
              onChange={(e) => handleChange("role", e.target.value)}
              placeholder="Your position"
              className="h-12 text-base focus-visible:ring-primary"
            />
          </div>
        </div>
        
        <div className="mt-8 text-center max-w-md mx-auto">
          <Button
            size="lg"
            className="w-full py-6 text-lg shadow-md hover:shadow-lg transition-all duration-300"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </div>
            ) : "Get My Results"}
          </Button>
        </div>
      </div>
    </div>
  );
}
