import { Showcase } from "@/components/showcase";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Flow
                <span className="text-primary">G</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                Zero-bloat, attribute-driven animation library
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground shrink-0 ml-4">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                CSS Core ~2KB
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-violet-500" />
                GSAP Pro ~45KB
              </div>
            </div>
            {/* Mobile compact badges */}
            <div className="flex sm:hidden items-center gap-1.5 shrink-0 ml-2">
              <span
                className="size-2 rounded-full bg-emerald-500"
                title="CSS Core ~2KB"
              />
              <span
                className="size-2 rounded-full bg-violet-500"
                title="GSAP Pro ~45KB"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-24 lg:pb-8">
        <Showcase />
      </main>
    </div>
  );
}
