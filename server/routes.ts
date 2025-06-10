import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertContactSchema,
  insertWorkflowSchema,
  insertWorkflowStepSchema,
  insertAiAgentSchema,
  insertTaskSchema,
  insertActivitySchema,
  insertDomainTemplateSchema,
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handler helper
  const handleZodError = (error: unknown, res: Response) => {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ error: validationError.message });
    }
    console.error(error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  };

  // Create a demo user if none exists
  const createDemoUser = async () => {
    const existingUser = await storage.getUserByUsername("demo");
    if (!existingUser) {
      await storage.createUser({
        username: "demo",
        password: "demo123",
        email: "demo@example.com",
        fullName: "Demo User",
        role: "admin",
      });
    }
  };

  await createDemoUser();

  // User routes
  app.get("/api/auth/session", async (req, res) => {
    // This is a simplified auth check - would use proper sessions in a real app
    try {
      const user = await storage.getUserByUsername("demo");
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      }
      return res.status(401).json({ error: "Not authenticated" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to check session" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    // Simplified login - would use proper auth in a real app
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);

      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Login failed" });
    }
  });

  // Contacts routes
  app.get("/api/contacts", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const contacts = await storage.getContactsByUserId(user.id);
      return res.json(contacts);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const contactData = insertContactSchema.parse({
        ...req.body,
        userId: user.id,
      });
      const contact = await storage.createContact(contactData);

      // Create activity for contact creation
      await storage.createActivity({
        userId: user.id,
        contactId: contact.id,
        activityType: "contact-created",
        description: `${contact.name} was added as a new contact`,
        timestamp: new Date(),
      });

      return res.status(201).json(contact);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  // Workflows routes
  app.get("/api/workflows", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const workflows = await storage.getWorkflowsByUserId(user.id);
      return res.json(workflows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch workflows" });
    }
  });

  app.post("/api/workflows", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const workflowData = insertWorkflowSchema.parse({
        ...req.body,
        userId: user.id,
      });
      const workflow = await storage.createWorkflow(workflowData);

      // Create activity for workflow creation
      await storage.createActivity({
        userId: user.id,
        workflowId: workflow.id,
        activityType: "workflow-created",
        description: `Workflow "${workflow.name}" was created`,
        timestamp: new Date(),
      });

      return res.status(201).json(workflow);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.get("/api/workflows/:id/steps", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const workflowId = parseInt(req.params.id);
      const workflow = await storage.getWorkflow(workflowId);

      if (!workflow || workflow.userId !== user.id) {
        return res.status(404).json({ error: "Workflow not found" });
      }

      const steps = await storage.getWorkflowStepsByWorkflowId(workflowId);
      return res.json(steps);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch workflow steps" });
    }
  });

  app.post("/api/workflows/:id/steps", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const workflowId = parseInt(req.params.id);
      const workflow = await storage.getWorkflow(workflowId);

      if (!workflow || workflow.userId !== user.id) {
        return res.status(404).json({ error: "Workflow not found" });
      }

      const stepData = insertWorkflowStepSchema.parse({
        ...req.body,
        workflowId,
      });
      const step = await storage.createWorkflowStep(stepData);

      return res.status(201).json(step);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  // AI Agents routes
  app.get("/api/agents", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const agents = await storage.getAiAgentsByUserId(user.id);
      return res.json(agents);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch AI agents" });
    }
  });

  app.post("/api/agents", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const agentData = insertAiAgentSchema.parse({
        ...req.body,
        userId: user.id,
      });
      const agent = await storage.createAiAgent(agentData);

      // Create activity for agent creation
      await storage.createActivity({
        userId: user.id,
        activityType: "agent-created",
        description: `AI Agent "${agent.name}" was created`,
        timestamp: new Date(),
      });

      return res.status(201).json(agent);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const tasks = await storage.getTasksByUserId(user.id);
      return res.json(tasks);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const taskData = insertTaskSchema.parse({ ...req.body, userId: user.id });
      const task = await storage.createTask(taskData);

      // Create activity for task creation
      await storage.createActivity({
        userId: user.id,
        taskId: task.id,
        workflowId: task.workflowId,
        contactId: task.contactId,
        activityType: "task-created",
        description: `Task "${task.title}" was created`,
        timestamp: new Date(),
      });

      return res.status(201).json(task);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const taskId = parseInt(req.params.id);
      const task = await storage.getTask(taskId);

      if (!task || task.userId !== user.id) {
        return res.status(404).json({ error: "Task not found" });
      }

      const updatedTask = await storage.updateTask(taskId, req.body);

      // Create activity for task update
      await storage.createActivity({
        userId: user.id,
        taskId: task.id,
        workflowId: task.workflowId,
        contactId: task.contactId,
        activityType: "task-updated",
        description: `Task "${task.title}" was updated`,
        timestamp: new Date(),
      });

      return res.json(updatedTask);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to update task" });
    }
  });

  // Activity routes
  app.get("/api/activities", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const activities = await storage.getActivitiesByUserId(user.id);
      return res.json(activities);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const activityData = insertActivitySchema.parse({
        ...req.body,
        userId: user.id,
      });
      const activity = await storage.createActivity(activityData);

      return res.status(201).json(activity);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  // Domain Templates routes
  app.get("/api/templates", async (req, res) => {
    try {
      const domain = (req.query.domain as string) || "real-estate";
      const templates = await storage.getDomainTemplatesByDomain(domain);
      return res.json(templates);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Failed to fetch domain templates" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) return res.status(401).json({ error: "Not authenticated" });

      const templateData = insertDomainTemplateSchema.parse(req.body);
      const template = await storage.createDomainTemplate(templateData);

      return res.status(201).json(template);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  // AI Assistant endpoint for workflow suggestions
  app.post("/api/ai/suggest-workflow", async (req, res) => {
    try {
      const { domain, description } = req.body;

      if (!domain || !description) {
        return res
          .status(400)
          .json({ error: "Domain and description are required" });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(200).json({
          workflow: {
            name: "Example Workflow",
            description:
              "This is an example workflow suggestion (OpenAI API key not configured)",
            steps: [
              { name: "Step 1", description: "First step", stepType: "manual" },
              {
                name: "Step 2",
                description: "Second step",
                stepType: "automated",
              },
              {
                name: "Step 3",
                description: "Third step",
                stepType: "ai-agent",
              },
            ],
          },
        });
      }

      try {
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a CRM workflow expert specializing in ${domain}. Create a detailed workflow based on the user's description.`,
            },
            {
              role: "user",
              content: `Create a workflow for the following description in the ${domain} domain: ${description}. Return a JSON object with: name (string), description (string), and steps (array of objects with name, description, and stepType fields - stepType should be one of: "manual", "automated", or "ai-agent").`,
            },
          ],
          response_format: { type: "json_object" },
        });

        const result = JSON.parse(response.choices[0].message.content);
        return res.json({ workflow: result });
      } catch (openaiError) {
        console.error("OpenAI API error:", openaiError);
        return res
          .status(500)
          .json({ error: "Failed to generate workflow suggestions" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  });

  // Create demo data
  const createDemoData = async () => {
    try {
      const user = await storage.getUserByUsername("demo");
      if (!user) return;

      // Pre-populate with workflows
      const existingWorkflows = await storage.getWorkflowsByUserId(user.id);
      if (existingWorkflows.length === 0) {
        const templates =
          await storage.getDomainTemplatesByDomain("real-estate");

        for (const template of templates) {
          if (template.templateType === "workflow") {
            const workflow = await storage.createWorkflow({
              userId: user.id,
              name: template.name,
              description: template.description || "",
              domain: template.domain,
              status: "active",
            });

            // Create workflow steps
            const steps = template.content.steps;
            for (let i = 0; i < steps.length; i++) {
              await storage.createWorkflowStep({
                workflowId: workflow.id,
                name: steps[i].name,
                description: steps[i].description,
                stepType: steps[i].stepType,
                order: i + 1,
                status: "active",
              });
            }
          }
        }
      }

      // Pre-populate with AI agents
      const existingAgents = await storage.getAiAgentsByUserId(user.id);
      if (existingAgents.length === 0) {
        const agents = [
          {
            name: "Property Matcher",
            description: "Matches clients with properties",
            agentType: "matching",
            status: "active",
            config: { model: "gpt-4o" },
          },
          {
            name: "Email Assistant",
            description: "Handles client communication",
            agentType: "communication",
            status: "active",
            config: { model: "gpt-4o" },
          },
          {
            name: "Doc Processor",
            description: "Processes legal documents",
            agentType: "document",
            status: "needs-config",
            config: { model: "gpt-4o" },
          },
          {
            name: "Market Analyzer",
            description: "Analyzes market trends",
            agentType: "analysis",
            status: "inactive",
            config: { model: "gpt-4o" },
          },
        ];

        for (const agent of agents) {
          await storage.createAiAgent({
            userId: user.id,
            name: agent.name,
            description: agent.description,
            agentType: agent.agentType,
            status: agent.status,
            config: agent.config,
          });
        }
      }

      // Pre-populate with contacts
      const existingContacts = await storage.getContactsByUserId(user.id);
      if (existingContacts.length === 0) {
        const contacts = [
          {
            name: "John Smith",
            email: "john.smith@example.com",
            phone: "555-123-4567",
            address: "123 Main St, Anytown, USA",
            type: "client",
            status: "active",
            notes: "Looking for a 3-bedroom house in the suburbs.",
          },
          {
            name: "Sarah Johnson",
            email: "sarah.j@example.com",
            phone: "555-987-6543",
            address: "456 Oak Avenue, Somewhere, USA",
            type: "client",
            status: "active",
            notes: "Interested in investment properties.",
          },
          {
            name: "James Wilson",
            email: "james.w@example.com",
            phone: "555-456-7890",
            address: "789 Pine Street, Elsewhere, USA",
            type: "lead",
            status: "active",
            notes: "First-time homebuyer looking in urban areas.",
          },
        ];

        for (const contact of contacts) {
          await storage.createContact({
            userId: user.id,
            ...contact,
          });
        }
      }

      // Pre-populate with tasks
      const existingTasks = await storage.getTasksByUserId(user.id);
      if (existingTasks.length === 0) {
        const workflows = await storage.getWorkflowsByUserId(user.id);
        const contacts = await storage.getContactsByUserId(user.id);

        if (workflows.length > 0 && contacts.length > 0) {
          const tasks = [
            {
              title: "Follow up with John Smith",
              description: "Regarding property viewing feedback",
              dueDate: new Date(Date.now() + 3600 * 1000), // 1 hour from now
              status: "pending",
              workflowId:
                workflows.find((w) => w.name === "Client Follow-up")?.id ||
                workflows[0].id,
              contactId:
                contacts.find((c) => c.name === "John Smith")?.id ||
                contacts[0].id,
            },
            {
              title: "Send contract to Sarah Johnson",
              description: "Purchase agreement for 123 Main St",
              dueDate: new Date(Date.now() + 3600 * 1000 * 5), // 5 hours from now
              status: "in-progress",
              workflowId:
                workflows.find((w) => w.name === "Closing Process")?.id ||
                workflows[0].id,
              contactId:
                contacts.find((c) => c.name === "Sarah Johnson")?.id ||
                contacts[0].id,
            },
            {
              title: "Schedule home inspection",
              description: "For 456 Oak Avenue",
              dueDate: new Date(Date.now() - 3600 * 1000 * 24), // 1 day ago (overdue)
              status: "overdue",
              workflowId:
                workflows.find((w) => w.name === "Closing Process")?.id ||
                workflows[0].id,
              contactId:
                contacts.find((c) => c.name === "Sarah Johnson")?.id ||
                contacts[0].id,
            },
            {
              title: "Update property listing",
              description: "789 Pine Street - Price reduction",
              dueDate: new Date(Date.now() + 3600 * 1000 * 24), // 1 day from now
              status: "scheduled",
              workflowId:
                workflows.find((w) => w.name === "Property Management")?.id ||
                workflows[0].id,
              contactId: null,
            },
          ];

          for (const task of tasks) {
            await storage.createTask({
              userId: user.id,
              ...task,
            });
          }
        }
      }

      // Pre-populate with activities
      const existingActivities = await storage.getActivitiesByUserId(user.id);
      if (existingActivities.length === 0) {
        const workflows = await storage.getWorkflowsByUserId(user.id);
        const contacts = await storage.getContactsByUserId(user.id);
        const agents = await storage.getAiAgentsByUserId(user.id);

        if (workflows.length > 0 && contacts.length > 0) {
          const activities = [
            {
              activityType: "ai-agent",
              description: `AI Agent ${agents.find((a) => a.name === "Property Matcher")?.name || "Property Matcher"} automatically sent 12 property listings to clients`,
              timestamp: new Date(Date.now() - 1800 * 1000), // 30 minutes ago
            },
            {
              activityType: "workflow",
              description: `${workflows.find((w) => w.name === "Client Follow-up")?.name || "Client Follow-up"} workflow completed for 3 recent property viewings`,
              workflowId:
                workflows.find((w) => w.name === "Client Follow-up")?.id ||
                workflows[0].id,
              timestamp: new Date(Date.now() - 7200 * 1000), // 2 hours ago
            },
            {
              activityType: "contact",
              description: `${contacts.find((c) => c.name === "Sarah Johnson")?.name || "Sarah Johnson"} was added as a new client to the database`,
              contactId:
                contacts.find((c) => c.name === "Sarah Johnson")?.id ||
                contacts[0].id,
              timestamp: new Date(Date.now() - 86400 * 1000), // 1 day ago
            },
            {
              activityType: "calendar",
              description: `Property Viewing scheduled with ${contacts.find((c) => c.name === "James Wilson")?.name || "James Wilson"} for tomorrow at 3:00 PM`,
              contactId:
                contacts.find((c) => c.name === "James Wilson")?.id ||
                contacts[0].id,
              timestamp: new Date(Date.now() - 86400 * 1000 * 1.2), // ~1.2 days ago
            },
          ];

          for (const activity of activities) {
            await storage.createActivity({
              userId: user.id,
              ...activity,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error creating demo data:", error);
    }
  };

  await createDemoData();

  const httpServer = createServer(app);
  return httpServer;
}
