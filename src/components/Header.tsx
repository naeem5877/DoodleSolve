import { Logo } from "./icons/logo";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import type { AppMode } from "./DoodleSolve";
import { Pencil, BrainCircuit } from "lucide-react";

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
      <div className="flex justify-between items-start w-full">
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
        <ThemeToggle />
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
