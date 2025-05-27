import {
  User, InsertUser, Contact, InsertContact,
  Workflow, InsertWorkflow, WorkflowStep, InsertWorkflowStep,
  AiAgent, InsertAiAgent, Task, InsertTask,
  Activity, InsertActivity, DomainTemplate, InsertDomainTemplate
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact operations
  getContact(id: number): Promise<Contact | undefined>;
  getContactsByUserId(userId: number): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<InsertContact>): Promise<Contact | undefined>;
  deleteContact(id: number): Promise<boolean>;
  
  // Workflow operations
  getWorkflow(id: number): Promise<Workflow | undefined>;
  getWorkflowsByUserId(userId: number): Promise<Workflow[]>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: number, workflow: Partial<InsertWorkflow>): Promise<Workflow | undefined>;
  deleteWorkflow(id: number): Promise<boolean>;
  
  // Workflow step operations
  getWorkflowStep(id: number): Promise<WorkflowStep | undefined>;
  getWorkflowStepsByWorkflowId(workflowId: number): Promise<WorkflowStep[]>;
  createWorkflowStep(workflowStep: InsertWorkflowStep): Promise<WorkflowStep>;
  updateWorkflowStep(id: number, workflowStep: Partial<InsertWorkflowStep>): Promise<WorkflowStep | undefined>;
  deleteWorkflowStep(id: number): Promise<boolean>;
  
  // AI Agent operations
  getAiAgent(id: number): Promise<AiAgent | undefined>;
  getAiAgentsByUserId(userId: number): Promise<AiAgent[]>;
  createAiAgent(aiAgent: InsertAiAgent): Promise<AiAgent>;
  updateAiAgent(id: number, aiAgent: Partial<InsertAiAgent>): Promise<AiAgent | undefined>;
  deleteAiAgent(id: number): Promise<boolean>;
  
  // Task operations
  getTask(id: number): Promise<Task | undefined>;
  getTasksByUserId(userId: number): Promise<Task[]>;
  getTasksByWorkflowId(workflowId: number): Promise<Task[]>;
  getTasksByContactId(contactId: number): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Activity operations
  getActivity(id: number): Promise<Activity | undefined>;
  getActivitiesByUserId(userId: number): Promise<Activity[]>;
  getActivitiesByWorkflowId(workflowId: number): Promise<Activity[]>;
  getActivitiesByContactId(contactId: number): Promise<Activity[]>;
  getActivitiesByTaskId(taskId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Domain Template operations
  getDomainTemplate(id: number): Promise<DomainTemplate | undefined>;
  getDomainTemplatesByDomain(domain: string): Promise<DomainTemplate[]>;
  createDomainTemplate(domainTemplate: InsertDomainTemplate): Promise<DomainTemplate>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private workflows: Map<number, Workflow>;
  private workflowSteps: Map<number, WorkflowStep>;
  private aiAgents: Map<number, AiAgent>;
  private tasks: Map<number, Task>;
  private activities: Map<number, Activity>;
  private domainTemplates: Map<number, DomainTemplate>;
  
  private userIdCounter: number;
  private contactIdCounter: number;
  private workflowIdCounter: number;
  private workflowStepIdCounter: number;
  private aiAgentIdCounter: number;
  private taskIdCounter: number;
  private activityIdCounter: number;
  private domainTemplateIdCounter: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.workflows = new Map();
    this.workflowSteps = new Map();
    this.aiAgents = new Map();
    this.tasks = new Map();
    this.activities = new Map();
    this.domainTemplates = new Map();
    
    this.userIdCounter = 1;
    this.contactIdCounter = 1;
    this.workflowIdCounter = 1;
    this.workflowStepIdCounter = 1;
    this.aiAgentIdCounter = 1;
    this.taskIdCounter = 1;
    this.activityIdCounter = 1;
    this.domainTemplateIdCounter = 1;
    
    // Initialize with sample domain templates for real estate
    this.initDomainTemplates();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  // Contact operations
  async getContact(id: number): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }
  
  async getContactsByUserId(userId: number): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(
      (contact) => contact.userId === userId,
    );
  }
  
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactIdCounter++;
    const now = new Date();
    const contact: Contact = { ...insertContact, id, createdAt: now };
    this.contacts.set(id, contact);
    return contact;
  }
  
  async updateContact(id: number, contactData: Partial<InsertContact>): Promise<Contact | undefined> {
    const existingContact = this.contacts.get(id);
    if (!existingContact) return undefined;
    
    const updatedContact = { ...existingContact, ...contactData };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }
  
  async deleteContact(id: number): Promise<boolean> {
    return this.contacts.delete(id);
  }
  
  // Workflow operations
  async getWorkflow(id: number): Promise<Workflow | undefined> {
    return this.workflows.get(id);
  }
  
  async getWorkflowsByUserId(userId: number): Promise<Workflow[]> {
    return Array.from(this.workflows.values()).filter(
      (workflow) => workflow.userId === userId,
    );
  }
  
  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const id = this.workflowIdCounter++;
    const now = new Date();
    const workflow: Workflow = { ...insertWorkflow, id, createdAt: now };
    this.workflows.set(id, workflow);
    return workflow;
  }
  
  async updateWorkflow(id: number, workflowData: Partial<InsertWorkflow>): Promise<Workflow | undefined> {
    const existingWorkflow = this.workflows.get(id);
    if (!existingWorkflow) return undefined;
    
    const updatedWorkflow = { ...existingWorkflow, ...workflowData };
    this.workflows.set(id, updatedWorkflow);
    return updatedWorkflow;
  }
  
  async deleteWorkflow(id: number): Promise<boolean> {
    return this.workflows.delete(id);
  }
  
  // Workflow step operations
  async getWorkflowStep(id: number): Promise<WorkflowStep | undefined> {
    return this.workflowSteps.get(id);
  }
  
  async getWorkflowStepsByWorkflowId(workflowId: number): Promise<WorkflowStep[]> {
    return Array.from(this.workflowSteps.values())
      .filter((step) => step.workflowId === workflowId)
      .sort((a, b) => a.order - b.order);
  }
  
  async createWorkflowStep(insertWorkflowStep: InsertWorkflowStep): Promise<WorkflowStep> {
    const id = this.workflowStepIdCounter++;
    const workflowStep: WorkflowStep = { ...insertWorkflowStep, id };
    this.workflowSteps.set(id, workflowStep);
    return workflowStep;
  }
  
  async updateWorkflowStep(id: number, workflowStepData: Partial<InsertWorkflowStep>): Promise<WorkflowStep | undefined> {
    const existingWorkflowStep = this.workflowSteps.get(id);
    if (!existingWorkflowStep) return undefined;
    
    const updatedWorkflowStep = { ...existingWorkflowStep, ...workflowStepData };
    this.workflowSteps.set(id, updatedWorkflowStep);
    return updatedWorkflowStep;
  }
  
  async deleteWorkflowStep(id: number): Promise<boolean> {
    return this.workflowSteps.delete(id);
  }
  
  // AI Agent operations
  async getAiAgent(id: number): Promise<AiAgent | undefined> {
    return this.aiAgents.get(id);
  }
  
  async getAiAgentsByUserId(userId: number): Promise<AiAgent[]> {
    return Array.from(this.aiAgents.values()).filter(
      (agent) => agent.userId === userId,
    );
  }
  
  async createAiAgent(insertAiAgent: InsertAiAgent): Promise<AiAgent> {
    const id = this.aiAgentIdCounter++;
    const now = new Date();
    const aiAgent: AiAgent = { ...insertAiAgent, id, createdAt: now };
    this.aiAgents.set(id, aiAgent);
    return aiAgent;
  }
  
  async updateAiAgent(id: number, aiAgentData: Partial<InsertAiAgent>): Promise<AiAgent | undefined> {
    const existingAiAgent = this.aiAgents.get(id);
    if (!existingAiAgent) return undefined;
    
    const updatedAiAgent = { ...existingAiAgent, ...aiAgentData };
    this.aiAgents.set(id, updatedAiAgent);
    return updatedAiAgent;
  }
  
  async deleteAiAgent(id: number): Promise<boolean> {
    return this.aiAgents.delete(id);
  }
  
  // Task operations
  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }
  
  async getTasksByUserId(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId,
    );
  }
  
  async getTasksByWorkflowId(workflowId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.workflowId === workflowId,
    );
  }
  
  async getTasksByContactId(contactId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.contactId === contactId,
    );
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const now = new Date();
    const task: Task = { ...insertTask, id, createdAt: now };
    this.tasks.set(id, task);
    return task;
  }
  
  async updateTask(id: number, taskData: Partial<InsertTask>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;
    
    const updatedTask = { ...existingTask, ...taskData };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
  
  // Activity operations
  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }
  
  async getActivitiesByUserId(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter((activity) => activity.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  async getActivitiesByWorkflowId(workflowId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter((activity) => activity.workflowId === workflowId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  async getActivitiesByContactId(contactId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter((activity) => activity.contactId === contactId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  async getActivitiesByTaskId(taskId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter((activity) => activity.taskId === taskId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const activity: Activity = { ...insertActivity, id };
    this.activities.set(id, activity);
    return activity;
  }
  
  // Domain Template operations
  async getDomainTemplate(id: number): Promise<DomainTemplate | undefined> {
    return this.domainTemplates.get(id);
  }
  
  async getDomainTemplatesByDomain(domain: string): Promise<DomainTemplate[]> {
    return Array.from(this.domainTemplates.values()).filter(
      (template) => template.domain === domain,
    );
  }
  
  async createDomainTemplate(insertDomainTemplate: InsertDomainTemplate): Promise<DomainTemplate> {
    const id = this.domainTemplateIdCounter++;
    const now = new Date();
    const domainTemplate: DomainTemplate = { ...insertDomainTemplate, id, createdAt: now };
    this.domainTemplates.set(id, domainTemplate);
    return domainTemplate;
  }

  // Seed data for domain templates
  private initDomainTemplates() {
    // Real Estate workflow templates
    const realEstateTemplates = [
      {
        name: "Lead Qualification",
        description: "Workflow for qualifying real estate leads",
        domain: "real-estate",
        templateType: "workflow",
        content: {
          steps: [
            { name: "Initial Contact", description: "First contact with lead", stepType: "manual" },
            { name: "Needs Assessment", description: "Assess client needs and budget", stepType: "manual" },
            { name: "Property Match", description: "Use AI to match properties", stepType: "ai-agent" },
            { name: "Schedule Viewing", description: "Schedule property viewings", stepType: "automated" }
          ]
        },
        isPublic: true
      },
      {
        name: "Property Matching",
        description: "Workflow for matching clients with properties",
        domain: "real-estate",
        templateType: "workflow",
        content: {
          steps: [
            { name: "Client Preferences", description: "Record client preferences", stepType: "manual" },
            { name: "Market Analysis", description: "Analyze available properties", stepType: "ai-agent" },
            { name: "Property Selection", description: "Select properties to show", stepType: "manual" },
            { name: "Client Presentation", description: "Present properties to client", stepType: "manual" }
          ]
        },
        isPublic: true
      },
      {
        name: "Closing Process",
        description: "Workflow for property closing process",
        domain: "real-estate",
        templateType: "workflow",
        content: {
          steps: [
            { name: "Offer Submission", description: "Submit client offer", stepType: "manual" },
            { name: "Negotiation", description: "Negotiate terms", stepType: "manual" },
            { name: "Document Preparation", description: "Prepare legal documents", stepType: "ai-agent" },
            { name: "Inspection", description: "Schedule property inspection", stepType: "automated" },
            { name: "Final Walkthrough", description: "Complete final walkthrough", stepType: "manual" },
            { name: "Closing Meeting", description: "Conduct closing meeting", stepType: "manual" }
          ]
        },
        isPublic: true
      },
      {
        name: "After-Sale Follow Up",
        description: "Workflow for post-sale client follow-up",
        domain: "real-estate",
        templateType: "workflow",
        content: {
          steps: [
            { name: "Thank You Message", description: "Send personalized thank you", stepType: "automated" },
            { name: "One Week Check-in", description: "Check on client satisfaction", stepType: "automated" },
            { name: "One Month Follow-up", description: "Check for any issues", stepType: "manual" },
            { name: "Review Request", description: "Request client review", stepType: "automated" },
            { name: "Referral Request", description: "Ask for referrals", stepType: "manual" }
          ]
        },
        isPublic: true
      },
      {
        name: "Client Onboarding",
        description: "Workflow for onboarding new clients",
        domain: "real-estate",
        templateType: "workflow",
        content: {
          steps: [
            { name: "Welcome Email", description: "Send welcome email", stepType: "automated" },
            { name: "Intake Form", description: "Send intake questionnaire", stepType: "automated" },
            { name: "Initial Consultation", description: "Schedule initial consultation", stepType: "manual" },
            { name: "Preference Analysis", description: "Analyze client preferences", stepType: "ai-agent" },
            { name: "Service Agreement", description: "Send service agreement", stepType: "automated" }
          ]
        },
        isPublic: true
      }
    ];

    realEstateTemplates.forEach((template, index) => {
      const now = new Date();
      const id = this.domainTemplateIdCounter++;
      this.domainTemplates.set(id, {
        ...template,
        id,
        createdAt: now
      });
    });
  }
}

export const storage = new MemStorage();
