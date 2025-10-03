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
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ReactNode } from 'react';

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
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-pre:bg-muted prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-4 mb-2" {...props} />,
                  h4: ({node, ...props}) => <h4 className="text-lg font-semibold mt-3 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="my-3 leading-7" {...props} />,
                  ul: ({node, ...props}) => <ul className="my-3 ml-6 list-disc space-y-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="my-3 ml-6 list-decimal space-y-2" {...props} />,
                  li: ({node, ...props}) => <li className="leading-7" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} />,
                  code: ({node, inline, ...props}: any) => 
                    inline ? (
                      <code className="bg-muted text-primary px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                    ) : (
                      <code className="block bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono" {...props} />
                    ),
                  pre: ({node, ...props}) => <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />,
                  table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-border" {...props} /></div>,
                  th: ({node, ...props}) => <th className="px-4 py-2 bg-muted font-semibold text-left" {...props} />,
                  td: ({node, ...props}) => <td className="px-4 py-2 border-t border-border" {...props} />,
                }}
              >
                {solutionText}
              </ReactMarkdown>
            </div>
            {showSolutionCursor && <span className="inline-block w-0.5 h-5 bg-foreground align-middle typewriter-cursor ml-1" />}
          </CardContent>
        </Card>
      )}
    </div>
  );
}