import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Contacts schema
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  type: text("type"), // client, lead, vendor, etc.
  status: text("status").default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

// Workflows schema
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  domain: text("domain").notNull(), // real-estate, marketing, sales, etc.
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
  createdAt: true,
});

// Workflow steps schema
export const workflowSteps = pgTable("workflow_steps", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").notNull().references(() => workflows.id),
  name: text("name").notNull(),
  description: text("description"),
  stepType: text("step_type").notNull(), // manual, automated, ai-agent
  order: integer("order").notNull(),
  config: jsonb("config"), // Configuration for the step
  status: text("status").default("active"),
});

export const insertWorkflowStepSchema = createInsertSchema(workflowSteps).omit({
  id: true,
});

// AI Agents schema
export const aiAgents = pgTable("ai_agents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  agentType: text("agent_type").notNull(), // email, document, analysis, etc.
  config: jsonb("config"), // Configuration for the agent
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAiAgentSchema = createInsertSchema(aiAgents).omit({
  id: true,
  createdAt: true,
});

// Tasks schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  workflowId: integer("workflow_id").references(() => workflows.id),
  contactId: integer("contact_id").references(() => contacts.id),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  status: text("status").default("pending"), // pending, in-progress, completed, overdue
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

// Activities schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  workflowId: integer("workflow_id").references(() => workflows.id),
  contactId: integer("contact_id").references(() => contacts.id),
  taskId: integer("task_id").references(() => tasks.id),
  activityType: text("activity_type").notNull(), // email, call, meeting, note, etc.
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

// Domain Templates schema
export const domainTemplates = pgTable("domain_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  domain: text("domain").notNull(), // real-estate, marketing, sales, etc.
  templateType: text("template_type").notNull(), // workflow, email, document, etc.
  content: jsonb("content").notNull(), // The actual template content
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDomainTemplateSchema = createInsertSchema(domainTemplates).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;

export type WorkflowStep = typeof workflowSteps.$inferSelect;
export type InsertWorkflowStep = z.infer<typeof insertWorkflowStepSchema>;

export type AiAgent = typeof aiAgents.$inferSelect;
export type InsertAiAgent = z.infer<typeof insertAiAgentSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type DomainTemplate = typeof domainTemplates.$inferSelect;
export type InsertDomainTemplate = z.infer<typeof insertDomainTemplateSchema>;
