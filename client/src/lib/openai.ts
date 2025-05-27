import OpenAI from "openai";

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "" 
});

/**
 * Generate workflow suggestions based on description and domain
 */
export async function suggestWorkflow(domain: string, description: string) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Return mock data if API key is not configured
      return {
        name: "Example Workflow",
        description: "This is an example workflow suggestion (OpenAI API key not configured)",
        steps: [
          { name: "Step 1", description: "First step", stepType: "manual" },
          { name: "Step 2", description: "Second step", stepType: "automated" },
          { name: "Step 3", description: "Third step", stepType: "ai-agent" }
        ]
      };
    }

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a CRM workflow expert specializing in ${domain}. Create a detailed workflow based on the user's description.`
        },
        {
          role: "user",
          content: `Create a workflow for the following description in the ${domain} domain: ${description}. Return a JSON object with: name (string), description (string), and steps (array of objects with name, description, and stepType fields - stepType should be one of: "manual", "automated", or "ai-agent").`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error generating workflow suggestion:", error);
    throw new Error("Failed to generate workflow suggestions");
  }
}

/**
 * Generate email content based on contact and purpose
 */
export async function generateEmailContent(contactName: string, purpose: string, context: string) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Return mock data if API key is not configured
      return {
        subject: "Example Subject Line",
        body: "This is an example email body (OpenAI API key not configured)"
      };
    }

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert email writer specializing in professional business communication."
        },
        {
          role: "user",
          content: `Write an email to ${contactName} for the following purpose: ${purpose}. Additional context: ${context}. Return a JSON object with: subject (string) and body (string).`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error generating email content:", error);
    throw new Error("Failed to generate email content");
  }
}

/**
 * Analyze client needs based on provided information
 */
export async function analyzeClientNeeds(clientInfo: string, preferences: string) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Return mock data if API key is not configured
      return {
        summary: "Example client needs analysis (OpenAI API key not configured)",
        recommendations: ["Example recommendation 1", "Example recommendation 2"],
        propertyTypes: ["Single Family Home", "Townhouse"]
      };
    }

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a real estate expert who analyzes client needs and preferences."
        },
        {
          role: "user",
          content: `Analyze the following client information and preferences to provide recommendations. Client information: ${clientInfo}. Client preferences: ${preferences}. Return a JSON object with: summary (string), recommendations (array of strings), and propertyTypes (array of strings).`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error analyzing client needs:", error);
    throw new Error("Failed to analyze client needs");
  }
}

/**
 * Generate task recommendations based on workflow and context
 */
export async function generateTaskRecommendations(workflowName: string, context: string) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Return mock data if API key is not configured
      return {
        tasks: [
          { title: "Example Task 1", description: "Example description 1", priority: "high" },
          { title: "Example Task 2", description: "Example description 2", priority: "medium" },
          { title: "Example Task 3", description: "Example description 3", priority: "low" }
        ]
      };
    }

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a workflow optimization expert who creates task recommendations."
        },
        {
          role: "user",
          content: `Generate task recommendations for the "${workflowName}" workflow with this context: ${context}. Return a JSON object with a tasks array, where each task has: title (string), description (string), and priority (string: "high", "medium", or "low").`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error generating task recommendations:", error);
    throw new Error("Failed to generate task recommendations");
  }
}

export default {
  suggestWorkflow,
  generateEmailContent,
  analyzeClientNeeds,
  generateTaskRecommendations
};
