import { Logo } from "./icons/logo";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

export default function Header({ className }: { className?: string }) {
  return (
    <header className={cn("p-4 sm:p-6 md:p-8 flex justify-between items-start", className)}>
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
    </header>
  );
}
