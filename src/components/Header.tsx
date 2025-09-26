import { Logo } from "./icons/logo";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import type { AppMode } from "./DoodleSolve";
import { Pencil, BrainCircuit, Info, Github } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Header({ 
  className,
  appMode,
  setAppMode,
}: { 
  className?: string,
  appMode: AppMode,
  setAppMode: (mode: AppMode) => void,
 }) {
  return (
    <header className={cn("p-4 sm:p-6 md:p-8 flex flex-col items-center gap-6", className)}>
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-4">
          <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
            <Logo className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-headline text-foreground">
              DoodleSolve
            </h1>
            <p className="text-muted-foreground">
              Draw your math problem, and let AI find the solution.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full transition-transform hover:scale-110">
                <Info className="w-5 h-5" />
                <span className="sr-only">About this project</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl">About DoodleSolve</DialogTitle>
                <DialogDescription className="pt-4 text-base text-foreground">
                  This AI system was made by students from the Automobile Department of <strong>Sylhet Technical School and College</strong>.
                </DialogDescription>
              </DialogHeader>
              <div className="py-2">
                <h3 className="font-semibold mb-2">Contributors:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Naeem Ahmed (Lead Developer)</li>
                  <li>Thamid AL Abir</li>
                  <li>Anik</li>
                </ul>
              </div>
              <p className="text-sm text-center text-muted-foreground pt-4">Thanks for visiting this site!</p>
              <DialogFooter className="sm:justify-center pt-4">
                <a
                  href="https://github.com/naeem5877/DoodleSolve"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2 transition-transform hover:scale-105">
                    <Github className="w-4 h-4" />
                    View on GitHub
                  </Button>
                </a>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <ThemeToggle />
        </div>
      </div>

      <Tabs value={appMode} onValueChange={(value) => setAppMode(value as AppMode)} className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="doodle" className="flex items-center gap-2">
            <Pencil className="w-4 h-4" />
            Doodle Mode
          </TabsTrigger>
          <TabsTrigger value="llm" className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" />
            LLM Chat
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </header>
  );
}
