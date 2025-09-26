'use server';

/**
 * @fileOverview A flow to handle chat interactions for the Sylhet Technical School and College AI assistant.
 *
 * - getChatResponse - A function that handles the chat response generation using Groq API.
 * - ChatInput - The input type for the getChatResponse function.
 * - ChatOutput - The return type for the getChatResponse function.
 */

import Groq from 'groq-sdk';
import { z } from 'zod';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const ragData = {
  "hi": "# Welcome to Sylhet Technical School and College\nHello! I'm the **Sylhet Technical School and College AI assistant**. How can I assist you today?",
  "hello": "# Greetings\nHello! I'm the **Sylhet Technical School and College AI assistant**. How can I assist you today?",
  "who made you": "# About My Creator\nThis AI was created by **Naeem Ahmed** for an innovation project at **Sylhet Technical School and College**.",
  "who created you": "# My Origin\nThis AI was developed by **Naeem Ahmed** as part of an innovation project at **Sylhet Technical School and College**.",
  "who are you": "# About Me\nI'm an AI assistant for **Sylhet Technical School and College**, created by **Naeem Ahmed** for an innovation project.",
  "what is your purpose": "# My Purpose\nI'm designed to help students and visitors get information about **Sylhet Technical School and College**, created by **Naeem Ahmed** as an innovation project."
};

const ChatInputSchema = z.object({
  prompt: z.string().describe('The user\'s message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user\'s message, formatted in markdown.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function getChatResponse(
  input: ChatInput
): Promise<ChatOutput> {
  try {
    // Check if the user's prompt matches any RAG data
    const userPromptLower = input.prompt.toLowerCase().trim();
    
    // Direct match check
    if (ragData[userPromptLower as keyof typeof ragData]) {
      return {
        response: ragData[userPromptLower as keyof typeof ragData]
      };
    }

    // Partial match check for flexibility
    for (const [key, value] of Object.entries(ragData)) {
      if (userPromptLower.includes(key) || key.includes(userPromptLower)) {
        return {
          response: value
        };
      }
    }

    // If no direct match, use Groq API with markdown formatting
    const systemPrompt = `You are a helpful AI assistant for Sylhet Technical School and College, created by Naeem Ahmed for an innovation project.

Available information:
${Object.entries(ragData).map(([key, value]) => `- When asked "${key}": ${value}`).join('\n')}

If the user's question is not covered by the available information, politely say that you do not have that specific information about Sylhet Technical School and College, but offer to help with other questions you might be able to answer.

Format your response in markdown. Use:
- # for main headings
- ## for subheadings
- **bold** for emphasis
- *italic* for secondary emphasis
- - for unordered lists
- 1. for ordered lists
Keep your responses helpful, friendly, and focused on the school context.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: input.prompt
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = chatCompletion.choices[0]?.message?.content || 
      "# Error\nI apologize, but I'm having trouble processing your request right now. Please try again.";

    return {
      response: response
    };

  } catch (error) {
    console.error('Error with Groq API:', error);
    
    // Fallback to basic RAG data matching if API fails
    const userPromptLower = input.prompt.toLowerCase().trim();
    for (const [key, value] of Object.entries(ragData)) {
      if (userPromptLower.includes(key)) {
        return {
          response: value
        };
      }
    }
    
    return {
      response: "# Technical Issue\nI'm sorry, I'm experiencing technical difficulties right now. Please try again later or contact the school directly for assistance."
    };
  }
}