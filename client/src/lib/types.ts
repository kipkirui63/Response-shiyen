export type Section = "introduction" | "questions" | "userInfo" | "results";

export interface Question {
  id: number;
  text: string;
  value: number | null;
  category: "reactive" | "strategic";
}

export interface UserInfo {
  name: string;
  email: string;
  organization: string;
  role: string;
}

export interface AssessmentData {
  userInfo: UserInfo;
  reactiveScore: number;
  strategicScore: number;
  questions: Question[];
  interpretation: string;
  date: string;
}

export interface Assessment {
  id: number;
  userId: number;
  reactiveScore: number;
  strategicScore: number;
  interpretation: string;
  date: string;
}
