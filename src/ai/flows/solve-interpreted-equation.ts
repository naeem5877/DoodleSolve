'use server';

/**
 * @fileOverview A flow to solve an interpreted math equation and return the solution in LaTeX format.
 *
 * - solveInterpretedEquation - A function that handles the equation-solving process.
 * - SolveInterpretedEquationInput - The input type for the solveInterpretedEquation function.
 * - SolveInterpretedEquationOutput - The return type for the solveInterpretedEquation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SolveInterpretedEquationInputSchema = z.object({
  interpretedEquation: z
    .string()
    .describe('The equation interpreted from the user drawing.'),
});
export type SolveInterpretedEquationInput = z.infer<
  typeof SolveInterpretedEquationInputSchema
>;

const SolveInterpretedEquationOutputSchema = z.object({
  solutionLaTeX: z
    .string()
    .describe('The solution to the equation in LaTeX format.'),
});
export type SolveInterpretedEquationOutput = z.infer<
  typeof SolveInterpretedEquationOutputSchema
>;

export async function solveInterpretedEquation(
  input: SolveInterpretedEquationInput
): Promise<SolveInterpretedEquationOutput> {
  return solveInterpretedEquationFlow(input);
}

const solveInterpretedEquationPrompt = ai.definePrompt({
  name: 'solveInterpretedEquationPrompt',
  input: {schema: SolveInterpretedEquationInputSchema},
  output: {schema: SolveInterpretedEquationOutputSchema},
  prompt: `You are an expert mathematician. Solve the following equation and provide the solution in LaTeX format, including all steps:

Equation: {{{interpretedEquation}}}`,
});

const solveInterpretedEquationFlow = ai.defineFlow(
  {
    name: 'solveInterpretedEquationFlow',
    inputSchema: SolveInterpretedEquationInputSchema,
    outputSchema: SolveInterpretedEquationOutputSchema,
  },
  async input => {
    const {output} = await solveInterpretedEquationPrompt(input);
    return output!;
  }
);
