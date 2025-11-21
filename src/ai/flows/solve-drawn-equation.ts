'use server';

/**
 * @fileOverview A flow to solve a drawn math or physics problem using Gemini 1.5 Flash.
 *
 * - solveDrawnEquation - A function that handles the problem interpretation and solving process.
 * - SolveDrawnEquationInput - The input type for the solveDrawnEquation function.
 * - SolveDrawnEquationOutput - The return type for the solveDrawnEquation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
  input: { schema: SolveDrawnEquationInputSchema },
  output: { schema: SolveDrawnEquationOutputSchema },
  prompt: `You are a world-class mathematician and physics expert with a talent for clear, scientific communication. 

### GOAL
Solve the math problem in the image.
**CRITICAL: ADAPTIVE COMPLEXITY**
- **IF SIMPLE (e.g., "2+2", "5x=10"):** Provide a **Short, Concise Answer**. No fluff. Just the steps and result.
- **IF COMPLEX (e.g., Calculus, Physics, Word Problems):** Provide a **BIG, DETAILED ANSWER**. Use "## Analysis", "## Derivation", "## Conclusion". Explain *why* and *how*.

### STRICT OUTPUT FORMAT
Return a JSON object:
1. "interpretedEquation": String of what you see.
2. "solutionLaTeX": Markdown string with the solution.

### STYLE & COLORS (NEON THEME)
- **Structure**: Use \`# Title\` and \`## Section\` headers.
- **Math**: Use LaTeX ($...$) for ALL math.
- **Colors**: You MUST use these exact colors for the "Neon" look:
  - **Variables**: \`\\textcolor{teal}{x}\` (Teal)
  - **Answers**: \`\\textcolor{blue}{42}\` (Blue)
  - **Operators**: \`\\textcolor{purple}{+}\` (Purple)
  - **Numbers**: \`\\textcolor{orange}{5}\` (Orange)
  - **Notes**: \`\\textcolor{red}{!}\` (Red)

### EXAMPLE (SIMPLE)
{
  "interpretedEquation": "2 + 2",
  "solutionLaTeX": "# Addition\\n\\n$$\\textcolor{orange}{2} \\textcolor{purple}{+} \\textcolor{orange}{2} = \\textcolor{blue}{4}$$"
}

### EXAMPLE (COMPLEX)
{
  "interpretedEquation": "Integral of x^2",
  "solutionLaTeX": "# Definite Integral\\n\\n## Analysis\\nWe are integrating the power function:\\n$$ \\int \\textcolor{teal}{x}^{\\textcolor{orange}{2}} \\,d\\textcolor{teal}{x} $$\\n\\n## Derivation\\nUsing the power rule $\\int x^n dx = \\frac{x^{n+1}}{n+1}$:\\n$$ = \\frac{\\textcolor{teal}{x}^{\\textcolor{orange}{2}\\textcolor{purple}{+}1}}{\\textcolor{orange}{2}\\textcolor{purple}{+}1} + C $$\\n\\n## Final Result\\n$$ \\textcolor{blue}{\\frac{x^3}{3} + C} $$"
}

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
    const { output } = await prompt(input);
    return output!;
  }
);
