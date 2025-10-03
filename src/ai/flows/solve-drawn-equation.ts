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
  interpretedText: z
    .string()
    .describe('The interpreted text or description of the drawing.'),
  solution: z
    .string()
    .describe('A detailed response, explanation, or solution based on the drawing. Use markdown for formatting and LaTeX for equations.'),
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
  prompt: `You are an expert AI visual assistant and academic tutor.

Your tasks are:
1.  Analyze the provided image which contains handwritten text, a drawing, or a problem.
2.  First, interpret the drawing and describe it clearly in the 'interpretedText' field.
3.  Second, provide a detailed response in the 'solution' field.
    - If it's a math or physics problem, solve it with a step-by-step explanation. Use Markdown for structure (e.g., # for headings) and enclose all mathematical equations and formulas in LaTeX format (e.g., $$E = mc^2$$).
    - If it's a general question, answer it thoroughly.
    - If it's a statement or a simple drawing, describe or comment on it in an informative way.
4.  If the image is unclear, empty, or doesn't contain a recognizable problem, state that in the 'interpretedText' field and provide a helpful message in the 'solution' field.

Always ensure your explanations are clear, educational, and easy to follow.

Image of the drawing: {{media url=photoDataUri}}
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
