'use client';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';
import type { SolutionResult } from '@/app/actions';

interface SolutionDisplayProps {
  isLoading: boolean;
  result: SolutionResult | null;
}

export default function SolutionDisplay({ isLoading, result }: SolutionDisplayProps) {

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Interpreted Equation</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-3/4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Solution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[300px]">
        <CardHeader>
          <CardTitle className="text-2xl">Awaiting your masterpiece</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Draw a math problem on the canvas and click &quot;Solve&quot; to see the magic happen.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (result.error) {
    return (
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Processing Error</AlertTitle>
            <AlertDescription>{result.error}</AlertDescription>
        </Alert>
    );
  }


  return (
    <div className="space-y-6">
      {result.interpretedEquation && (
        <Card>
          <CardHeader>
            <CardTitle>Interpreted Equation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-mono bg-muted p-4 rounded-md">
              {result.interpretedEquation}
            </p>
          </CardContent>
        </Card>
      )}
      {result.solutionLaTeX && (
        <Card>
          <CardHeader>
            <CardTitle>Solution Steps</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none overflow-x-auto">
            <Latex>{result.solutionLaTeX}</Latex>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
