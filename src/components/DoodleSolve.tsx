'use client';
import 'katex/dist/katex.min.css';
import { Tldraw, useEditor, Editor } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { useState, useCallback } from 'react';
import { getSolution, type SolutionResult } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Wand, Trash2, Maximize, Minimize, Eraser, Pencil } from 'lucide-react';
import SolutionDisplay from './SolutionDisplay';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import ChatView from './ChatView';

function svgToPngDataUri(svgString: string, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 2; // Use scale for better quality
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        URL.revokeObjectURL(url);
        return;
      }
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, width, height);
      const pngDataUri = canvas.toDataURL('image/png');
      URL.revokeObjectURL(url);
      resolve(pngDataUri);
    };

    img.onerror = () => {
      reject(new Error('Failed to load SVG image'));
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
}

const CustomEditorEvents = () => {
  useEditor();
  return null;
}

export type AppMode = 'doodle' | 'llm';

export default function DoodleSolve({ appMode }: { appMode: AppMode }) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [result, setResult] = useState<SolutionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleSolve = useCallback(async () => {
    if (!editor) return;

    const shapes = editor.getCurrentPageShapes();
    if (shapes.length === 0) {
      toast({
        title: "Canvas is empty",
        description: "Please draw something before solving.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const viewport = editor.getViewportPageBounds();
      if (!viewport) {
        throw new Error('Failed to get viewport bounds.');
      }

      const svgResult = await editor.getSvgString(shapes, {
        scale: 1,
        background: theme === 'dark' ? '#09090b' : '#ffffff',
      });

      if (!svgResult || !svgResult.svg) {
        throw new Error('Failed to capture drawing.');
      }

      const pngDataUri = await svgToPngDataUri(svgResult.svg, viewport.w, viewport.h);

      const solutionResult = await getSolution(pngDataUri);

      if (solutionResult.error) {
        setResult({ error: solutionResult.error });
        toast({
          title: "Error",
          description: solutionResult.error,
          variant: "destructive"
        });
      } else {
        setResult(solutionResult);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setResult({ error: `Failed to process the drawing: ${errorMessage}` });
      toast({
        title: "Error",
        description: `Failed to process the drawing: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [editor, toast, theme]);

  const handleClear = useCallback(() => {
    if (!editor) return;
    const shapes = editor.getCurrentPageShapes();
    if (shapes.length > 0) {
      editor.deleteShapes(shapes.map(s => s.id));
    }
    setResult(null);
  }, [editor]);

  return (
    <>
      <div className={cn("transition-opacity duration-500", appMode === 'doodle' ? 'opacity-100' : 'opacity-0 hidden')}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-8 h-full">

          {/* Left Column: Canvas & Controls */}
          <div className={cn(
            "flex flex-col gap-4 h-full transition-all duration-500 ease-in-out",
            isFullscreen ? "fixed inset-0 z-50 bg-background p-4" : "relative min-h-[600px]"
          )}>
            <Card className="flex-grow overflow-hidden shadow-sm border border-border/50 rounded-3xl bg-card relative group">
              <div className="absolute inset-0">
                <Tldraw
                  onMount={(editor) => setEditor(editor)}
                  persistenceKey='doodle-solve-canvas'
                  hideUi={false}
                >
                  <CustomEditorEvents />
                </Tldraw>
              </div>
            </Card>

            {/* Floating Action Bar */}
            <div className="flex items-center justify-between bg-card/80 backdrop-blur-md border border-border/50 p-2 rounded-2xl shadow-sm mx-auto max-w-2xl w-full">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="rounded-xl hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  className="rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Clear Canvas"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>

              <Button
                onClick={handleSolve}
                disabled={isLoading}
                className={cn(
                  "rounded-xl px-6 font-medium transition-all duration-300 shadow-sm hover:shadow-md",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  isLoading && "opacity-80 cursor-wait"
                )}
              >
                <Wand className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                {isLoading ? 'Solving...' : 'Solve Magic'}
              </Button>
            </div>
          </div>

          {/* Right Column: Solution Display */}
          <div className={cn("w-full h-full", isFullscreen ? "hidden" : "block")}>
            <SolutionDisplay
              isLoading={isLoading}
              result={result}
            />
          </div>
        </div>
      </div>

      <div className={cn("transition-opacity duration-300", appMode === 'llm' ? 'opacity-100' : 'opacity-0 hidden')}>
        <ChatView />
      </div>
    </>
  );
}
