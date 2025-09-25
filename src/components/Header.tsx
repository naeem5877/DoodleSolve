import { Logo } from "./icons/logo";

export default function Header() {
  return (
    <header className="p-4 sm:p-6 md:p-8">
      <div className="flex items-center gap-4">
        <div className="bg-primary text-primary-foreground p-3 rounded-full">
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
    </header>
  );
}
