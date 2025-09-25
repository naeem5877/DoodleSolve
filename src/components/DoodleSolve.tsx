'use client';
import 'katex/dist/katex.min.css';
import { Tldraw, useEditor, Editor } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { useState, useCallback } from 'react';
import { getSolution, type SolutionResult } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Wand, Trash2 } from 'lucide-react';
import SolutionDisplay from './SolutionDisplay';
import { Card, CardContent } from './ui/card';
import { useToast } from '@/hooks/use-toast';

function svgToPngDataUri(svgString: string, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width * 2; // Use scale for better quality
      canvas.height = height * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        URL.revokeObjectURL(url);
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
  const editor = useEditor();
  
  // You can add event listeners here if needed, for example:
  // useEffect(() => {
  //   const handleChange = () => console.log('Canvas changed');
  //   editor.on('change', handleChange);
  //   return () => editor.off('change', handleChange);
  // }, [editor]);

  return null;
}

export default function DoodleSolve() {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [result, setResult] = useState<SolutionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSolve = useCallback(async () => {
    if (!editor) return;

    const shapes = editor.getCurrentPageShapes();
    if (shapes.length === 0) {
      toast({
        title: "Canvas is empty",
        description: "Please draw an equation before solving.",
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
        scale: 2,
        background: true,
        darkMode: false,
      });

      if (!svg) {
        throw new Error('Failed to capture drawing.');
      }

      const svgString = new XMLSerializer().serializeToString(svg);
      const pngDataUri = await svgToPngDataUri(svgString, viewport.w, viewport.h);
      
      const solutionResult = await getSolution(pngDataUri);
      setResult(solutionResult);

      if (solutionResult.error) {
        toast({
          title: "Error",
          description: solutionResult.error,
          variant: "destructive"
        });
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
  }, [editor, toast]);

  const handleClear = useCallback(() => {
    if (!editor) return;
    const shapes = editor.getCurrentPageShapes();
    if (shapes.length > 0) {
       editor.deleteShapes(shapes.map(s => s.id));
    }
    setResult(null);
  }, [editor]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="flex flex-col gap-4">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="w-full h-[50vh] min-h-[400px]">
              <Tldraw onMount={(editor) => setEditor(editor)}>
                <CustomEditorEvents />
              </Tldraw>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleClear} disabled={isLoading}>
            <Trash2 />
            Clear
          </Button>
          <Button onClick={handleSolve} disabled={isLoading}>
            <Wand />
            {isLoading ? 'Solving...' : 'Solve'}
          </Button>
        </div>
      </div>

      <div className="w-full">
        <SolutionDisplay
          isLoading={isLoading}
          result={result}
        />
      </div>
    </div>
  );
}
