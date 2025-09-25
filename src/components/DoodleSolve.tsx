'use client';
import 'katex/dist/katex.min.css';
import { Tldraw, useEditor, Editor } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { useState, useCallback } from 'react';
import { getSolution, type SolutionResult } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Wand, Trash2, Expand, Minimize } from 'lucide-react';
import SolutionDisplay from './SolutionDisplay';
import { Card, CardContent } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

function svgToPngDataUri(svgString: string, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-t' });
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

export default function DoodleSolve() {
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
      
      const svg = await editor.getSvg(shapes, {
        scale: 1,
        background: true,
        darkMode: theme === 'dark',
      });

      if (!svg) {
        throw new Error('Failed to capture drawing.');
      }

      const svgString = new XMLSerializer().serializeToString(svg);
      const pngDataUri = await svgToPngDataUri(svgString, viewport.w, viewport.h);
      
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
    <div className={cn("grid grid-cols-1 md:grid-cols-2 items-start gap-8 transition-all duration-300", 
      isFullscreen && "md:grid-cols-1"
    )}>
      <div className={cn("flex flex-col gap-4 transition-all duration-300 h-full", 
        isFullscreen ? "md:col-span-1" : "md:col-span-1"
      )}>
        <Card className="overflow-hidden shadow-lg border-2 border-primary/20 flex-grow flex flex-col">
          <CardContent className="p-0 flex-grow">
            <div className="w-full h-full min-h-[500px]">
              <Tldraw onMount={(editor) => setEditor(editor)} persistenceKey='doodle-solve-canvas'>
                <CustomEditorEvents />
              </Tldraw>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2 sm:gap-4">
           <Button variant="outline" onClick={() => setIsFullscreen(!isFullscreen)} disabled={isLoading} className="text-lg py-6 px-4 sm:px-8 rounded-full shadow-md transition-transform hover:scale-105">
            {isFullscreen ? <Minimize /> : <Expand />}
            <span className="sr-only">{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
          </Button>
          <Button variant="outline" onClick={handleClear} disabled={isLoading} className="text-lg py-6 px-4 sm:px-8 rounded-full shadow-md transition-transform hover:scale-105">
            <Trash2 />
            <span className='hidden sm:inline ml-2'>Clear</span>
          </Button>
          <Button onClick={handleSolve} disabled={isLoading} className="text-lg py-6 px-4 sm:px-8 rounded-full shadow-md transition-transform hover:scale-105 bg-gradient-to-r from-primary to-accent text-primary-foreground">
            <Wand className="mr-0 sm:mr-2" />
            <span className='hidden sm:inline'>{isLoading ? 'Solving...' : 'Solve'}</span>
          </Button>
        </div>
      </div>

      <div className={cn("w-full transition-all duration-300", isFullscreen ? "md:hidden" : "md:block")}>
        <SolutionDisplay
          isLoading={isLoading}
          result={result}
        />
      </div>
    </div>
  );
}
