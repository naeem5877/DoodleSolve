'use server';

/**
 * @fileOverview A flow to interpret a drawn math equation using Gemini Flash 1.5.
 *
 * - interpretDrawnEquation - A function that handles the equation interpretation process.
 * - InterpretDrawnEquationInput - The input type for the interpretDrawnEquation function.
 * - InterpretDrawnEquationOutput - The return type for the interpretDrawnEquation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretDrawnEquationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a math equation, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type InterpretDrawnEquationInput = z.infer<typeof InterpretDrawnEquationInputSchema>;

const InterpretDrawnEquationOutputSchema = z.object({
  interpretedEquation: z
    .string()
    .describe('The interpreted math equation in a readable text format.'),
});
export type InterpretDrawnEquationOutput = z.infer<typeof InterpretDrawnEquationOutputSchema>;

export async function interpretDrawnEquation(
  input: InterpretDrawnEquationInput
): Promise<InterpretDrawnEquationOutput> {
  return interpretDrawnEquationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretDrawnEquationPrompt',
  input: {schema: InterpretDrawnEquationInputSchema},
  output: {schema: InterpretDrawnEquationOutputSchema},
  prompt: `You are an AI assistant specialized in interpreting handwritten math equations.

  Given an image of a math equation, your task is to accurately convert it into a readable text format.
  Respond with the interpreted equation. Do not attempt to solve, only interpret.  If the image does not contain a math equation, respond with 'No equation found'.

  Image: {{media url=photoDataUri}}
  `,
});

const interpretDrawnEquationFlow = ai.defineFlow(
  {
    name: 'interpretDrawnEquationFlow',
    inputSchema: InterpretDrawnEquationInputSchema,
    outputSchema: InterpretDrawnEquationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
