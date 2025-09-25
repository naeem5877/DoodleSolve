'use server';

import { solveDrawnEquation } from '@/ai/flows/solve-drawn-equation';

export interface SolutionResult {
  interpretedEquation?: string;
  solutionLaTeX?: string;
  error?: string;
}

export async function getSolution(photoDataUri: string): Promise<SolutionResult> {
  try {
    const { interpretedEquation, solutionLaTeX } = await solveDrawnEquation({ photoDataUri });

    if (!interpretedEquation || interpretedEquation.toLowerCase().includes('no equation found')) {
      return { error: 'Could not recognize an equation. Please draw more clearly.' };
    }

    return { interpretedEquation, solutionLaTeX };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { error: `An error occurred during processing: ${errorMessage}` };
  }
}
