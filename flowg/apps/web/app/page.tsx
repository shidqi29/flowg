import { Showcase } from "@/components/showcase";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Flow
                <span className="text-primary">G</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Zero-bloat, attribute-driven animation library
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                CSS Core ~2KB
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-violet-500" />
                GSAP Pro ~45KB
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Showcase />
      </main>
    </div>
  );
}
