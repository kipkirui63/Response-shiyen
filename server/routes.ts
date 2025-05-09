import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { assessmentDataSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  app.post("/api/assessments", async (req, res) => {
    try {
      // Validate request body
      const validatedData = assessmentDataSchema.parse(req.body);
      
      // Create or get user
      const existingUser = await storage.getUserByEmail(validatedData.userInfo.email);
      
      let userId;
      if (existingUser) {
        userId = existingUser.id;
        // Update user info if needed
        await storage.updateUser(existingUser.id, validatedData.userInfo);
      } else {
        const newUser = await storage.createUser(validatedData.userInfo);
        userId = newUser.id;
      }
      
      // Create assessment
      const assessment = await storage.createAssessment({
        userId,
        reactiveScore: validatedData.reactiveScore,
        strategicScore: validatedData.strategicScore,
        interpretation: validatedData.interpretation,
        date: new Date(validatedData.date),
      });
      
      // Save question responses
      for (const question of validatedData.questions) {
        if (question.value !== null) {
          await storage.saveQuestionResponse({
            assessmentId: assessment.id,
            questionId: question.id,
            value: question.value,
            category: question.category,
          });
        }
      }
      
      // Return the saved assessment with user info
      return res.status(201).json({
        ...validatedData,
        id: assessment.id,
      });
    } catch (error) {
      console.error("Error saving assessment:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      return res.status(500).json({ message: "Failed to save assessment" });
    }
  });
  
  // Get user assessments
  app.get("/api/users/:email/assessments", async (req, res) => {
    try {
      const { email } = req.params;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const assessments = await storage.getUserAssessments(user.id);
      return res.status(200).json(assessments);
    } catch (error) {
      console.error("Error fetching user assessments:", error);
      return res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  // Get a specific assessment
  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      
      const assessment = await storage.getAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      // Get user info
      const user = await storage.getUser(assessment.userId);
      
      // Get question responses
      const questions = await storage.getAssessmentQuestions(assessmentId);
      
      return res.status(200).json({
        ...assessment,
        userInfo: user,
        questions,
      });
    } catch (error) {
      console.error("Error fetching assessment:", error);
      return res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
