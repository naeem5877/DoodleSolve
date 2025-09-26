'use server';

/**
 * @fileOverview A flow to handle chat interactions for the Sylhet Technical School and College AI assistant.
 *
 * - getChatResponse - A function that handles the chat response generation.
 * - ChatInput - The input type for the getChatResponse function.
 * - ChatOutput - The return type for the getChatResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ragData = {
    "hi": "Hello! I'm the Sylhet Technical School and College AI assistant. How can I help you today?",
    "hello": "Hello! I'm the Sylhet Technical School and College AI assistant. How can I help you today?",
    "who made you": "This AI was created by Naeem Ahmed for an innovation project at Sylhet Technical School and College.",
    "who created you": "This AI was developed by Naeem Ahmed as part of an innovation project at Sylhet Technical School and College.",
    "who are you": "I'm an AI assistant for Sylhet Technical School and College, created by Naeem Ahmed for an innovation project.",
    "what is your purpose": "I'm designed to help students and visitors get information about Sylhet Technical School and College, created by Naeem Ahmed as an innovation project."
};

const ChatInputSchema = z.object({
  prompt: z.string().describe('The user\'s message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user\'s message.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function getChatResponse(
  input: ChatInput
): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: { schema: ChatInputSchema },
  output: { schema: ChatOutputSchema },
  prompt: `You are a helpful AI assistant for Sylhet Technical School and College.
  
  Use the following information to answer the user's question. If the question is not in the provided data, say that you do not have that information.
  
  Context:
  {{#each ragData}}
  - User asks: "{{@key}}" -> You respond: "{{this}}"
  {{/each}}
  
  User's question: {{{prompt}}}`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt({ ...input, ragData });
    return output!;
  }
);
