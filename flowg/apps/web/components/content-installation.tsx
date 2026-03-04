"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CodeBlock } from "@/components/code-block";

type PackageManager = "npm" | "pnpm" | "yarn";

export function InstallationContent() {
  const [pm, setPm] = useState<PackageManager>("npm");

  const installCmd = {
    npm: "npm install flowgeneration",
    pnpm: "pnpm add flowgeneration",
    yarn: "yarn add flowgeneration",
  };

  const gsapInstallCmd = {
    npm: "npm install flowgeneration gsap",
    pnpm: "pnpm add flowgeneration gsap",
    yarn: "yarn add flowgeneration gsap",
  };

  return (
    <article className="prose-sm max-w-none space-y-8">
      {/* NPM Install */}
      <section className="space-y-4">
        <h2
          id="npm-install"
          className="text-xl font-semibold text-foreground scroll-mt-20">
          Package Manager
        </h2>

        <ToggleGroup
          type="single"
          value={pm}
          onValueChange={(v) => {
            if (v) setPm(v as PackageManager);
          }}
          className="justify-start">
          <ToggleGroupItem value="npm" className="text-xs h-7 px-3">
            npm
          </ToggleGroupItem>
          <ToggleGroupItem value="pnpm" className="text-xs h-7 px-3">
            pnpm
          </ToggleGroupItem>
          <ToggleGroupItem value="yarn" className="text-xs h-7 px-3">
            yarn
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                Core
              </Badge>
              CSS-only animations (no GSAP needed)
            </p>
            <CodeBlock code={installCmd[pm]} language="bash" />
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20 text-[10px]">
                Pro
              </Badge>
              With GSAP for advanced animations
            </p>
            <CodeBlock code={gsapInstallCmd[pm]} language="bash" />
          </div>
        </div>
      </section>

      <Separator />

      {/* CDN */}
      <section className="space-y-4">
        <h2
          id="cdn-usage"
          className="text-xl font-semibold text-foreground scroll-mt-20">
          CDN Usage
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Drop these tags into any HTML page. No build step required.
        </p>

        <div className="space-y-3">
          <p className="text-xs font-medium text-foreground">Core Engine</p>
          <CodeBlock
            language="html"
            code={`<!-- FlowG CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/style.css" />

<!-- FlowG Core (~2KB) — auto-initializes, no setup needed -->
<script type="module" src="https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/flowg-core.js"></script>`}
          />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium text-foreground">
            Pro Engine (+ GSAP)
          </p>
          <CodeBlock
            language="html"
            code={`<!-- FlowG CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/style.css" />

<!-- GSAP (must load before FlowG Pro) -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>

<!-- FlowG Pro — auto-initializes, no setup needed -->
<script type="module" src="https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/flowg-pro.js"></script>`}
          />
        </div>
      </section>

      <Separator />

      {/* Webflow */}
      <section className="space-y-4">
        <h2
          id="webflow-setup"
          className="text-xl font-semibold text-foreground scroll-mt-20">
          Webflow Setup
        </h2>
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 text-xs space-y-2">
          <p className="font-medium text-amber-800 dark:text-amber-300">
            Step-by-step for Webflow
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-amber-700 dark:text-amber-400">
            <li>
              Go to <strong>Project Settings → Custom Code</strong>
            </li>
            <li>
              Paste the <code>&lt;link&gt;</code> tag into the{" "}
              <strong>Head Code</strong> section
            </li>
            <li>
              Paste the <code>&lt;script&gt;</code> tags into the{" "}
              <strong>Footer Code</strong> section
            </li>
            <li>
              Add <code>data-flowg-*</code> attributes via{" "}
              <strong>Element Settings → Custom Attributes</strong>
            </li>
          </ol>
        </div>
      </section>

      <Separator />

      {/* Quick Start */}
      <section className="space-y-4">
        <h2
          id="quick-start"
          className="text-xl font-semibold text-foreground scroll-mt-20">
          Quick Start
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Add{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
            data-flowg-anim
          </code>{" "}
          to any element. That&apos;s it.
        </p>
        <CodeBlock
          language="html"
          code={`<!-- Fade up on scroll -->
<div data-flowg-anim="fade-up">
  Hello World
</div>

<!-- Slide in from left, 1s duration, 0.2s delay -->
<div
  data-flowg-anim="slide-left"
  data-flowg-duration="1"
  data-flowg-delay="0.2"
  data-flowg-ease="ease-in-out"
>
  Animated content
</div>`}
        />
      </section>
    </article>
  );
}
