import { GoogleGenAI, Type } from "@google/genai";
import { ProjectInput, GeneratedContent, VibeTask, SRSFormData } from "../types";

const SYSTEM_INSTRUCTION = `
You are an elite Senior Solutions Architect and Technical Product Manager.
You specialize in creating industry-standard Software Requirement Specifications (IEEE 830 derived) and preparing context for Autonomous AI Coding Agents.
Your output must be precise, technical, and exhaustive.
`;

/**
 * Converts the nested SRS form data into a readable string for the LLM prompt.
 */
const formatFormDataForPrompt = (formData: SRSFormData): string => {
  let output = "";
  for (const [sectionId, fields] of Object.entries(formData)) {
    // Pretty print section title (e.g., project_overview -> Project Overview)
    const sectionTitle = sectionId.replace(/_/g, ' ').toUpperCase();
    output += `\n## ${sectionTitle}\n`;
    
    for (const [fieldId, value] of Object.entries(fields)) {
       // Skip empty values
       if (!value || (Array.isArray(value) && value.length === 0)) continue;
       
       const fieldLabel = fieldId.replace(/_/g, ' ');
       
       if (Array.isArray(value)) {
         output += `- ${fieldLabel}: ${value.join(', ')}\n`;
       } else {
         output += `- ${fieldLabel}: ${value}\n`;
       }
    }
  }
  return output;
};

export const generateSRSContent = async (input: ProjectInput): Promise<string> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const formattedData = formatFormDataForPrompt(input.formData);

  const prompt = `
    Generate a complete Software Requirement Specification (SRS) for the project defined below.
    
    INPUT DATA:
    ${formattedData}

    OUTPUT FORMAT (Markdown):
    1. Title Page (Project Name, Version 1.0, Status: Generated)
    2. Introduction (Purpose, Scope, Definitions)
    3. Overall Description (User Classes, Operating Environment)
    4. System Features (Functional Requirements - Detailed breakdown of Core Features)
    5. Non-Functional Requirements (Performance, Security, Reliability)
    6. External Interface Requirements (UI, API, Hardware)
    7. System Architecture & Tech Stack (Inferred from Technical Requirements)
    8. Security & Compliance
    9. Appendices (Data Models, Glossary)

    IMPORTANT: 
    - Use the detailed input data to populate specific sections.
    - If "Technical Requirements" are flexible, propose a modern, scalable stack based on the "Project Type".
    - Ensure the "System Features" section breaks down the functional requirements into specific, testable items.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION },
    });
    return response.text || "Failed to generate SRS.";
  } catch (e) {
    console.error("SRS Generation failed", e);
    throw e;
  }
};

export const generateAgentAssets = async (input: ProjectInput): Promise<{context: string, tasks: VibeTask[]}> => {
  if (!process.env.API_KEY) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const formattedData = formatFormDataForPrompt(input.formData);
  const projectName = input.name;

  // 1. Generate System Context for Agents
  const contextPrompt = `
    Create a "Project Context" markdown file suitable for feeding into an AI Coding Agent (like Claude Code, Codex, or Cursor).
    
    PROJECT DATA:
    ${formattedData}

    The file should contain:
    - High-level Project Summary
    - Tech Stack & Versions (Strictly follow 'Technical Requirements' from input)
    - Architecture Constraints
    - Core Data Models (inferred from 'Core Features')
    - API Design Standards
    - Coding Standards
    
    This file will be used as the "System Prompt" or ".cursorrules" for an autonomous coding agent.
  `;

  const contextResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contextPrompt,
    config: { systemInstruction: "You are a Principal Engineer setting up a repository for an AI team." }
  });

  // 2. Generate Actionable Tasks
  const tasksPrompt = `
    Break down the project "${projectName}" into a sequential list of coding tasks for an autonomous AI agent.
    
    PROJECT CONTEXT:
    ${formattedData}

    Return a JSON array of objects. Each task needs a "prompt" that is ready to be pasted into an AI editor.
    The tasks should start from project initialization and go through setting up the DB, Backend, Frontend, and Core Features.
  `;

  const tasksResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: tasksPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            prompt: { type: Type.STRING },
            fileContext: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['setup', 'backend', 'frontend', 'database', 'testing', 'deployment'] }
          },
          required: ['title', 'description', 'prompt', 'type']
        }
      }
    }
  });

  const tasks = tasksResponse.text ? JSON.parse(tasksResponse.text) as VibeTask[] : [];
  
  return {
    context: contextResponse.text || "No context generated",
    tasks: tasks
  };
};
