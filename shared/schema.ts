import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  organization: text("organization"),
  role: text("role"),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  reactiveScore: integer("reactive_score").notNull(),
  strategicScore: integer("strategic_score").notNull(),
  interpretation: text("interpretation").notNull(),
  date: text("date").notNull(),
});

export const assessmentQuestions = pgTable("assessment_questions", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").references(() => assessments.id),
  questionId: integer("question_id").notNull(),
  value: integer("value").notNull(),
  category: text("category").notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  organization: true,
  role: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).pick({
  userId: true,
  reactiveScore: true,
  strategicScore: true,
  interpretation: true,
});

export const insertAssessmentQuestionSchema = createInsertSchema(assessmentQuestions).pick({
  assessmentId: true,
  questionId: true,
  value: true,
  category: true,
});

export const userInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  organization: z.string().optional(),
  role: z.string().optional(),
});

export const assessmentDataSchema = z.object({
  userInfo: userInfoSchema,
  reactiveScore: z.number(),
  strategicScore: z.number(),
  questions: z.array(
    z.object({
      id: z.number(),
      text: z.string(),
      value: z.number().nullable(),
      category: z.enum(["reactive", "strategic"]),
    })
  ),
  interpretation: z.string(),
  date: z.string(),
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

export type InsertAssessmentQuestion = z.infer<typeof insertAssessmentQuestionSchema>;
export type AssessmentQuestion = typeof assessmentQuestions.$inferSelect;

export type AssessmentData = z.infer<typeof assessmentDataSchema>;
