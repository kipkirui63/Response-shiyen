import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { assessmentDataSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import fetch from "node-fetch";

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
      
      // Send data to Google Script
      try {
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbwcM_25NSa3GX1ODQudVEIeboznp_Vw9Bi9ElAzOQNrw4tf4x8adiTnTMxHES3fksoM/exec';
        
        // Format question responses for the Google Sheet
        const responses = validatedData.questions.map(q => ({
          questionId: q.id,
          text: q.text,
          value: q.value,
          category: q.category
        }));
        
        await fetch(scriptUrl, {
          method: 'POST',
          // Headers only, no mode parameter for node-fetch
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timestamp: validatedData.date,
            name: validatedData.userInfo.name,
            email: validatedData.userInfo.email,
            organization: validatedData.userInfo.organization || '',
            role: validatedData.userInfo.role || '',
            reactive_score: validatedData.reactiveScore,
            strategic_score: validatedData.strategicScore,
            responses: JSON.stringify(responses)
          }),
        });
        
        console.log("Data sent to Google Script:", scriptUrl);
      } catch (error) {
        // Log the error but don't fail the request
        console.error("Error sending data to Google Script:", error);
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
      let user = null;
      if (assessment.userId) {
        user = await storage.getUser(assessment.userId);
      }
      
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
