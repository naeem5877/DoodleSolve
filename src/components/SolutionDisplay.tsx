'use client';
import 'katex/dist/katex.min.css';
import { Terminal, BookOpen, Sparkles, CheckCircle2, BrainCircuit, Maximize2, X, ChevronRight, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from './ui/dialog';
import type { SolutionResult } from '@/app/actions';
import { useTypewriter } from '@/hooks/use-typewriter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useState, useEffect } from 'react';

const LoadingDisplay = () => {
  const [loadingText, setLoadingText] = useState('Thinking...');

  useEffect(() => {
    const texts = ['Thinking...', 'Finding...', 'Reading...', 'Analyzing...', 'Solving...'];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-full min-h-[400px] border-none shadow-none bg-transparent flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center w-24 h-24 mb-8">
        <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-75" />
        <div className="relative bg-background p-4 rounded-full shadow-sm border border-border/50">
          <BrainCircuit className="w-10 h-10 text-primary animate-pulse" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2 animate-fade-in tracking-wide text-glossy">
        {loadingText}
      </h3>
      <p className="text-muted-foreground text-base">
        Analyzing your masterpiece...
      </p>
    </Card>
  );
};

export default function SolutionDisplay({ isLoading, result }: { isLoading: boolean, result: SolutionResult | null }) {
  const interpretedText = useTypewriter(result?.interpretedEquation ?? '', 5);
  const solutionText = useTypewriter(result?.solutionLaTeX ?? '', 2);

  const isTypingSolution = result?.solutionLaTeX ? solutionText.length < result.solutionLaTeX.length : false;
  const isTypingInterpreted = result?.interpretedEquation ? interpretedText.length < result.interpretedEquation.length : false;

  const [isFullscreen, setIsFullscreen] = useState(false);

  if (isLoading) {
    return <LoadingDisplay />;
  }

  if (!result) {
    return (
      <Card className="h-full min-h-[400px] border border-border/50 shadow-sm bg-card/50 rounded-3xl flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 mb-6 rounded-2xl bg-secondary/50 flex items-center justify-center">
          <BookOpen className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">
          Ready to Solve
        </h3>
        <p className="text-muted-foreground max-w-sm leading-relaxed">
          Draw your math problem on the canvas and click <span className="font-medium text-primary">Solve Magic</span> to see the solution.
        </p>
      </Card>
    );
  }

  if (result.error) {
    return (
      <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
        <Terminal className="h-4 w-4" />
        <AlertTitle className="font-semibold">Processing Error</AlertTitle>
        <AlertDescription>{result.error}</AlertDescription>
      </Alert>
    );
  }

  const MarkdownContent = ({ text }: { text: string }) => (
    <div className="prose prose-slate dark:prose-invert max-w-none 
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-4 prose-h1:pb-4 prose-h1:border-b-2 prose-h1:border-primary/20 prose-h1:text-glossy
                  prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-10 prose-h2:text-primary
                  prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-foreground/90
                  prose-p:text-lg prose-p:leading-8 prose-p:text-muted-foreground prose-p:mb-4
                  prose-strong:text-foreground prose-strong:font-bold
                  prose-code:text-primary prose-code:bg-primary/5 
                  prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium prose-code:text-sm
                  prose-code:before:content-none prose-code:after:content-none
                  prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl
                  prose-li:text-lg prose-li:leading-7 prose-li:text-muted-foreground
                  prose-li:marker:text-primary">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-4xl font-extrabold border-b-2 border-primary/20 pb-4 mb-8 mt-4 tracking-tight text-slate-900 dark:text-white" {...props} />,
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold text-slate-900 dark:text-primary mt-10 mb-4 tracking-tight flex items-center gap-3 bg-secondary/30 p-3 rounded-xl border-l-4 border-primary" {...props}>
              <ChevronRight className="w-6 h-6 text-primary/80" />
              {props.children}
            </h2>
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-semibold text-foreground/90 mt-6 mb-3 flex items-center gap-2" {...props}>
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              {props.children}
            </h3>
          ),
          p: ({ node, ...props }) => <p className="text-lg leading-8 text-muted-foreground mb-4" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 mb-4 space-y-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-2" {...props} />,
          li: ({ node, ...props }) => <li className="text-lg leading-7 text-muted-foreground pl-1" {...props} />,
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code className="font-mono text-sm bg-primary/10 text-primary px-1.5 py-0.5 rounded-md" {...props} />
            ) : (
              <code className="block p-4 rounded-xl overflow-x-auto my-4 text-sm font-mono bg-secondary/50 border border-border/50" {...props} />
            ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary/50 bg-secondary/30 pl-6 pr-4 py-4 my-6 italic rounded-r-xl text-muted-foreground" {...props} />
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {result.interpretedEquation && (
        <Card className="border border-border/50 shadow-sm bg-card rounded-3xl overflow-hidden">
          <CardHeader className="bg-secondary/30 border-b border-border/50 py-4 px-6">
            <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Interpreted Input
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-lg font-medium text-foreground leading-relaxed font-mono">
              {interpretedText}
              {isTypingInterpreted && <span className="inline-block w-2 h-5 bg-primary align-middle animate-pulse ml-1 shadow-[0_0_10px_var(--primary)]" />}
            </p>
          </CardContent>
        </Card>
      )}

      {result.solutionLaTeX && (
        <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
          <Card className="border border-border/50 shadow-sm bg-card rounded-3xl overflow-hidden relative group transition-all hover:shadow-md">
            <CardHeader className="bg-secondary/30 border-b border-border/50 py-4 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-muted-foreground flex items-center gap-2 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-primary" />
                Solution
              </CardTitle>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/50" title="Fullscreen">
                  <Maximize2 className="w-4 h-4 text-foreground/70" />
                </Button>
              </DialogTrigger>
            </CardHeader>
            <CardContent className="p-8 max-h-[600px] overflow-y-auto custom-scrollbar">
              <MarkdownContent text={solutionText} />
              {isTypingSolution && <span className="inline-block w-2 h-6 bg-primary align-middle animate-pulse ml-1 shadow-[0_0_10px_var(--primary)]" />}
            </CardContent>
          </Card>

          <DialogContent className="max-w-4xl w-[95vw] h-[95vh] flex flex-col p-0 gap-0 bg-card rounded-3xl overflow-hidden border-none outline-none shadow-2xl">
            <DialogHeader className="p-6 border-b border-border/50 bg-secondary/30 flex-shrink-0 flex flex-row items-center justify-between">
              <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                <Sparkles className="w-5 h-5 text-primary" />
                Full Solution
              </DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background/50">
                  <X className="w-5 h-5 text-foreground/70" />
                </Button>
              </DialogClose>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
              <div className="max-w-3xl mx-auto">
                <MarkdownContent text={solutionText} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
