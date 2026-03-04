"use client";

import { useState } from "react";
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

        <p className="text-xs text-muted-foreground">
          One package — GSAP is included and loaded on demand. No separate
          installs needed.
        </p>
        <CodeBlock code={installCmd[pm]} language="bash" />
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
          Drop these tags into any HTML page. No build step required. GSAP and
          its plugins are bundled and lazy-loaded automatically.
        </p>

        <CodeBlock
          language="html"
          code={`<!-- FlowG CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/style.css" />

<!-- FlowG — auto-initializes, GSAP loaded on demand -->
<script type="module" src="https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/flowg.js"></script>`}
        />
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
