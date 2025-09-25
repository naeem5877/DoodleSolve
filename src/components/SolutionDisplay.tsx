'use client';
import 'katex/dist/katex.min.css';
import { Wand, Terminal } from 'lucide-react';
import Latex from 'react-latex-next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { SolutionResult } from '@/app/actions';
import { useTypewriter } from '@/hooks/use-typewriter';

const LoadingDisplay = () => (
  <Card className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[300px] shadow-lg">
    <CardHeader>
      <div className="relative w-24 h-24 mb-4">
        <Wand className="w-16 h-16 text-primary animate-pulse" />
        <div className="absolute top-0 right-0 w-6 h-6 bg-accent rounded-full sparkle" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/2 left-0 w-4 h-4 bg-secondary rounded-full sparkle" style={{ animationDelay: '0.2s' }} />
        <div className="absolute bottom-0 left-1/4 w-5 h-5 bg-accent rounded-full sparkle" style={{ animationDelay: '0.4s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-primary rounded-full sparkle" style={{ animationDelay: '0.6s' }} />
      </div>
      <CardTitle className="text-2xl font-bold">AI is thinking...</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">Your masterpiece is being analyzed.</p>
    </CardContent>
  </Card>
);

export default function SolutionDisplay({ isLoading, result }: { isLoading: boolean, result: SolutionResult | null }) {
  const interpretedText = useTypewriter(result?.interpretedEquation ?? '', 30);
  const solutionText = useTypewriter(result?.solutionLaTeX ?? '', 20);

  if (isLoading) {
    return <LoadingDisplay />;
  }

  if (!result) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[300px] shadow-lg border-dashed">
        <CardHeader>
          <CardTitle className="text-2xl">Awaiting your masterpiece</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Draw anything on the canvas and click &quot;Solve&quot; to see the magic happen.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (result.error) {
    return (
      <Alert variant="destructive" className="shadow-lg">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Processing Error</AlertTitle>
        <AlertDescription>{result.error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {result.interpretedEquation && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Interpreted Drawing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-mono bg-muted p-4 rounded-md">
              {interpretedText}
              <span className="inline-block w-1 h-5 bg-foreground align-middle typewriter-cursor ml-1" />
            </p>
          </CardContent>
        </Card>
      )}
      {result.solutionLaTeX && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Response</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none">
            <Latex>{solutionText}</Latex>
            {result.solutionLaTeX.length === solutionText.length && (
              <span className="inline-block w-1 h-5 bg-foreground align-middle typewriter-cursor ml-1" />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
