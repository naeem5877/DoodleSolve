'use server';

/**
 * @fileOverview A flow to interpret a drawn math or physics problem using Gemini Flash 1.5.
 *
 * - interpretDrawnEquation - A function that handles the problem interpretation process.
 * - InterpretDrawnEquationInput - The input type for the interpretDrawnEquation function.
 * - InterpretDrawnEquationOutput - The return type for the interpretDrawnEquation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretDrawnEquationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a math or physics problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type InterpretDrawnEquationInput = z.infer<typeof InterpretDrawnEquationInputSchema>;

const InterpretDrawnEquationOutputSchema = z.object({
  interpretedEquation: z
    .string()
    .describe('The interpreted math or physics problem in a readable text format.'),
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
  prompt: `You are an AI assistant specialized in interpreting handwritten math and physics problems.

  Given an image of a problem, your task is to accurately convert it into a readable text format.
  Extract all the relevant information, including the question being asked.
  If the image does not contain a discernible problem, respond with 'No equation found'.

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
