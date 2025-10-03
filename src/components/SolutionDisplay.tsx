'use client';
import 'katex/dist/katex.min.css';
import { Wand, Terminal } from 'lucide-react';
import Latex from 'react-latex-next';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { SolutionResult } from '@/app/actions';
import { useTypewriter } from '@/hooks/use-typewriter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const LoadingDisplay = () => (
  <Card className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[300px] shadow-lg bg-card/80 backdrop-blur-sm">
    <CardHeader>
      <div className="relative w-24 h-24 mb-4 mx-auto">
        <Wand className="w-16 h-16 text-primary animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute inset-0 sparkle-container">
          <div className="sparkle" style={{ top: '10%', left: '20%', animationDelay: '0s' }} />
          <div className="sparkle" style={{ top: '20%', left: '80%', animationDelay: '0.2s' }} />
          <div className="sparkle" style={{ top: '50%', left: '50%', animationDelay: '0.4s' }} />
          <div className="sparkle" style={{ top: '80%', left: '10%', animationDelay: '0.6s' }} />
          <div className="sparkle" style={{ top: '90%', left: '90%', animationDelay: '0.8s' }} />
        </div>
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
  const showSolutionCursor = result?.solutionLaTeX ? result.solutionLaTeX.length === solutionText.length : false;
  const showInterpretedCursor = result?.interpretedEquation ? result.interpretedEquation.length === interpretedText.length : false;

  if (isLoading) {
    return <LoadingDisplay />;
  }

  if (!result) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-8 h-full min-h-[300px] shadow-lg border-dashed border-border/50">
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
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Interpreted Drawing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-mono bg-muted p-4 rounded-md">
              {interpretedText}
              {showInterpretedCursor && <span className="inline-block w-0.5 h-5 bg-foreground align-middle typewriter-cursor ml-1" />}
            </p>
          </CardContent>
        </Card>
      )}
      {result.solutionLaTeX && (
        <Card className="shadow-lg bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Response</CardTitle>
          </CardHeader>
          <CardContent className="markdown-content">
            <Latex>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {solutionText}
              </ReactMarkdown>
            </Latex>
            {showSolutionCursor && <span className="inline-block w-0.5 h-5 bg-foreground align-middle typewriter-cursor ml-1" />}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
