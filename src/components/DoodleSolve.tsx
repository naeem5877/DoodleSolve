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

function dataUrlToBlob(dataUrl: string) {
  const arr = dataUrl.split(',');
  if (arr.length < 2) {
    return null;
  }
  const mimeArr = arr[0].match(/:(.*?);/);
  if (!mimeArr || mimeArr.length < 2) {
    return null;
  }
  const mime = mimeArr[1];
  const buff = Buffer.from(arr[1], 'base64');
  return new Blob([buff], { type: mime });
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
      const svg = await editor.getSvg(shapes, {
        scale: 2,
        background: true,
        darkMode: false,
      });

      if (!svg) {
        throw new Error('Failed to capture drawing.');
      }

      const svgString = new XMLSerializer().serializeToString(svg);
      const dataUri = `data:image/svg+xml;base64,${btoa(svgString)}`;
      
      const solutionResult = await getSolution(dataUri);
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
