import { Showcase } from "@/components/showcase";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                Flow
                <span className="text-primary">G</span>
              </h1>
              <span className="hidden sm:inline text-xs text-muted-foreground">
                Zero-bloat animation library
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                Core ~2KB
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-violet-500" />
                GSAP Pro
              </div>
              {/* Mobile compact badges */}
              <div className="flex sm:hidden items-center gap-1.5">
                <span
                  className="size-2 rounded-full bg-emerald-500"
                  title="CSS Core ~2KB"
                />
                <span
                  className="size-2 rounded-full bg-violet-500"
                  title="GSAP Pro"
                />
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main — Showcase handles its own 3-column layout */}
      <Showcase />
    </div>
  );
}
