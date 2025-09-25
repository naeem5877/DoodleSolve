'use server';

/**
 * @fileOverview A flow to solve a drawn math or physics problem using Gemini 1.5 Flash.
 *
 * - solveDrawnEquation - A function that handles the problem interpretation and solving process.
 * - SolveDrawnEquationInput - The input type for the solveDrawnEquation function.
 * - SolveDrawnEquationOutput - The return type for the solveDrawnEquation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SolveDrawnEquationInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a math or physics problem, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SolveDrawnEquationInput = z.infer<typeof SolveDrawnEquationInputSchema>;

const SolveDrawnEquationOutputSchema = z.object({
  interpretedEquation: z
    .string()
    .describe('The interpreted math or physics problem in a readable text format.'),
  solutionLaTeX: z
    .string()
    .describe('The detailed solution to the problem in LaTeX format.'),
});
export type SolveDrawnEquationOutput = z.infer<typeof SolveDrawnEquationOutputSchema>;

export async function solveDrawnEquation(
  input: SolveDrawnEquationInput
): Promise<SolveDrawnEquationOutput> {
  return solveDrawnEquationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'solveDrawnEquationPrompt',
  input: {schema: SolveDrawnEquationInputSchema},
  output: {schema: SolveDrawnEquationOutputSchema},
  prompt: `You are an expert AI assistant that can solve math and physics problems from a drawing.

  Your tasks are:
  1.  Analyze the provided image which contains a handwritten or drawn problem.
  2.  First, interpret the problem and state it clearly in the 'interpretedEquation' field. This should include all variables, numbers, and the question being asked. If the image does not contain a discernible problem, respond with 'No equation found'.
  3.  Second, solve the problem, providing a detailed, step-by-step explanation. The final solution must be in LaTeX format for the 'solutionLaTeX' field. Handle unit conversions if necessary.

  Image of the problem: {{media url=photoDataUri}}
  `,
});

const solveDrawnEquationFlow = ai.defineFlow(
  {
    name: 'solveDrawnEquationFlow',
    inputSchema: SolveDrawnEquationInputSchema,
    outputSchema: SolveDrawnEquationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
