'use server';

import { interpretDrawnEquation } from '@/ai/flows/interpret-drawn-equation';
import { solveInterpretedEquation } from '@/ai/flows/solve-interpreted-equation';

export interface SolutionResult {
  interpretedEquation?: string;
  solutionLaTeX?: string;
  error?: string;
}

export async function getSolution(photoDataUri: string): Promise<SolutionResult> {
  try {
    const { interpretedEquation } = await interpretDrawnEquation({ photoDataUri });

    if (!interpretedEquation || interpretedEquation.toLowerCase().includes('no equation found')) {
      return { error: 'Could not recognize an equation. Please draw more clearly.' };
    }

    const { solutionLaTeX } = await solveInterpretedEquation({ interpretedEquation });

    return { interpretedEquation, solutionLaTeX };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { error: `An error occurred during processing: ${errorMessage}` };
  }
}
