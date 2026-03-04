"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CodeBlock } from "@/components/code-block";
import { Zap, Feather, Code2, Layers, Globe } from "lucide-react";

export function IntroductionContent() {
  return (
    <article className="prose-sm max-w-none space-y-8">
      {/* Hero */}
      <div className="space-y-3">
        <h1
          id="what-is-flowg"
          className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground scroll-mt-20">
          What is FlowG?
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          FlowG is a{" "}
          <strong className="text-foreground">
            zero-bloat, attribute-driven
          </strong>{" "}
          animation library that brings production-ready scroll animations to
          any website. Just add{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
            data-flowg-*
          </code>{" "}
          attributes to your HTML — no JavaScript required for basic animations.
        </p>
      </div>

      <Separator />

      {/* Core Philosophy */}
      <section className="space-y-4">
        <h2
          id="core-philosophy"
          className="text-xl font-semibold text-foreground scroll-mt-20">
          Core Philosophy
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">
            &quot;Zero-Bloat Attributes&quot;
          </strong>{" "}
          — The library operates on a split-engine logic. It provides a single
          uniform API (
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
            data-flowg-*
          </code>
          ), but underneath, it intelligently separates lightweight CSS class
          toggling from heavy JavaScript (GSAP) animations.
        </p>
      </section>

      {/* Hybrid Engine */}
      <section className="space-y-4">
        <h3
          id="hybrid-engine"
          className="text-lg font-semibold text-foreground scroll-mt-20">
          Hybrid Engine Architecture
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Core */}
          <div
            id="css-core"
            className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2.5 scroll-mt-20">
            <div className="flex items-center gap-2">
              <Feather className="size-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="font-semibold text-sm text-foreground">
                CSS Core Engine
              </h4>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                ~2KB gzip
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pure CSS animations with IntersectionObserver. Zero dependencies.
              Handles fades, slides, zooms, flips, blurs, rotations, and
              bounces.
            </p>
            <CodeBlock
              language="js"
              code={`// Auto-initializes on import — no setup needed
import "flowgeneration/core";
import "flowgeneration/style.css";`}
            />
          </div>

          {/* Pro */}
          <div
            id="gsap-pro"
            className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4 space-y-2.5 scroll-mt-20">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-violet-600 dark:text-violet-400" />
              <h4 className="font-semibold text-sm text-foreground">
                GSAP Pro Engine
              </h4>
              <Badge
                variant="outline"
                className="bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/20 text-[10px]">
                + GSAP
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Extends Core with GSAP-powered animations: text splitting,
              staggering, scroll-scrubbing, physics bounces, typewriter effects,
              and counters.
            </p>
            <CodeBlock
              language="js"
              code={`// Auto-initializes on import — no setup needed
import "flowgeneration/pro";
import "flowgeneration/style.css";`}
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Features */}
      <section className="space-y-4">
        <h2
          id="features"
          className="text-xl font-semibold text-foreground scroll-mt-20">
          Features
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            {
              icon: Feather,
              title: "Tiny Footprint",
              desc: "Core engine is ~2KB gzipped. No GSAP tax for simple animations.",
            },
            {
              icon: Code2,
              title: "Declarative API",
              desc: "Add data-flowg-* attributes. No JavaScript code needed.",
            },
            {
              icon: Layers,
              title: "27 Animations",
              desc: "19 CSS + 8 GSAP animations covering all common patterns.",
            },
            {
              icon: Globe,
              title: "Platform Agnostic",
              desc: "Works with React, Vue, Webflow, WordPress — any HTML.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="flex gap-3 p-3 rounded-lg border border-border bg-card/50">
              <f.icon className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-foreground">{f.title}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
