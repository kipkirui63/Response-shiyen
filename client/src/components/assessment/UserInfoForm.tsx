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
    <div className="p-6">
      <div className="flex justify-center mb-6">
        <img src={logoImage} alt="DDLL Logo" className="h-16" />
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-gray-700 font-medium">Almost done!</p>
        <p className="text-gray-600 mt-1">
          Please provide some basic information to complete your assessment.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name*
          </Label>
          <Input
            id="name"
            value={userInfo.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter your full name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <div className="flex items-center mt-1 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.name}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email*
          </Label>
          <Input
            id="email"
            type="email"
            value={userInfo.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter your email address"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <div className="flex items-center mt-1 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.email}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
            Organization
          </Label>
          <Input
            id="organization"
            value={userInfo.organization}
            onChange={(e) => handleChange("organization", e.target.value)}
            placeholder="Where you work (optional)"
          />
        </div>

        <div>
          <Label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role/Title
          </Label>
          <Input
            id="role"
            value={userInfo.role}
            onChange={(e) => handleChange("role", e.target.value)}
            placeholder="Your position (optional)"
          />
        </div>
      </div>

      <div className="mt-8">
        <Button
          className="w-full py-6"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit My Responses"}
        </Button>
      </div>
    </div>
  );
}
