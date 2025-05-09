import {
  User,
  InsertUser, 
  Assessment,
  AssessmentQuestion
} from "@shared/schema";

// Storage interface
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  createAssessment(assessment: {
    userId: number;
    reactiveScore: number;
    strategicScore: number;
    interpretation: string;
    date: Date;
  }): Promise<Assessment>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  getUserAssessments(userId: number): Promise<Assessment[]>;
  saveQuestionResponse(questionResponse: {
    assessmentId: number;
    questionId: number;
    value: number;
    category: string;
  }): Promise<AssessmentQuestion>;
  getAssessmentQuestions(assessmentId: number): Promise<AssessmentQuestion[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assessments: Map<number, Assessment>;
  private assessmentQuestions: Map<number, AssessmentQuestion>;
  private userIdCounter: number;
  private assessmentIdCounter: number;
  private questionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.assessmentQuestions = new Map();
    this.userIdCounter = 1;
    this.assessmentIdCounter = 1;
    this.questionIdCounter = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...userData, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error(`User with ID ${id} not found`);
    }

    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createAssessment(assessmentData: {
    userId: number;
    reactiveScore: number;
    strategicScore: number;
    interpretation: string;
    date: Date;
  }): Promise<Assessment> {
    const id = this.assessmentIdCounter++;
    const assessment: Assessment = {
      id,
      userId: assessmentData.userId,
      reactiveScore: assessmentData.reactiveScore,
      strategicScore: assessmentData.strategicScore,
      interpretation: assessmentData.interpretation,
      date: assessmentData.date.toISOString(),
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async getUserAssessments(userId: number): Promise<Assessment[]> {
    return Array.from(this.assessments.values()).filter(
      (assessment) => assessment.userId === userId
    );
  }

  async saveQuestionResponse(questionResponseData: {
    assessmentId: number;
    questionId: number;
    value: number;
    category: string;
  }): Promise<AssessmentQuestion> {
    const id = this.questionIdCounter++;
    const questionResponse: AssessmentQuestion = {
      id,
      assessmentId: questionResponseData.assessmentId,
      questionId: questionResponseData.questionId,
      value: questionResponseData.value,
      category: questionResponseData.category,
    };
    this.assessmentQuestions.set(id, questionResponse);
    return questionResponse;
  }

  async getAssessmentQuestions(assessmentId: number): Promise<AssessmentQuestion[]> {
    return Array.from(this.assessmentQuestions.values()).filter(
      (question) => question.assessmentId === assessmentId
    );
  }
}

export const storage = new MemStorage();
