'use server';

import { solveDrawnEquation } from '@/ai/flows/solve-drawn-equation';
import { getChatResponse as getChatResponseFlow } from '@/ai/flows/chat-flow';

export interface SolutionResult {
  interpretedEquation?: string;
  solutionLaTeX?: string;
  error?: string;
}

export async function getSolution(photoDataUri: string): Promise<SolutionResult> {
  try {
    const { interpretedText, solution } = await solveDrawnEquation({ photoDataUri });

    if (!interpretedText || interpretedText.toLowerCase().includes('unclear') || interpretedText.toLowerCase().includes('empty')) {
      return { error: 'The drawing is unclear. Please draw more clearly.' };
    }

    return { interpretedEquation: interpretedText, solutionLaTeX: solution };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return { error: `An error occurred during processing: ${errorMessage}` };
  }
}

export async function getChatResponse(prompt: string): Promise<string> {
  try {
    const { response } = await getChatResponseFlow({ prompt });
    return response;
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
    return `An error occurred during processing: ${errorMessage}`;
  }
}
