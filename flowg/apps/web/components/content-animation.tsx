"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AnimationPreview } from "@/components/animation-preview";
import { Configurator, type AnimConfig } from "@/components/configurator";
import { CodeExport } from "@/components/code-export";
import type { AnimationDef } from "@/lib/animations";

interface ContentAnimationProps {
  animation: AnimationDef;
  config: AnimConfig;
  onConfigChange: (config: AnimConfig) => void;
}

export function ContentAnimation({
  animation,
  config,
  onConfigChange,
}: ContentAnimationProps) {
  return (
    <article className="max-w-none space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {animation.label}
          </h1>
          <Badge
            variant="outline"
            className={`text-xs ${
              animation.engine === "css"
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                : "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20"
            }`}>
            {animation.engine === "css" ? "CSS" : "GSAP"}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {animation.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{animation.description}</p>
      </div>

      <Separator />

      {/* Preview */}
      <section className="space-y-3">
        <h2
          id="anim-preview"
          className="text-lg font-semibold text-foreground scroll-mt-20">
          Preview
        </h2>
        <div>
          <AnimationPreview
            animation={animation}
            duration={config.duration}
            delay={config.delay}
            ease={config.ease}
            stagger={config.stagger}
            repeat={config.repeat}
            direction={config.direction}
            enabled={config.enabled}
          />
        </div>
      </section>

      <Separator />

      {/* Configuration */}
      <section className="space-y-4">
        <div>
          <h2
            id="anim-config"
            className="text-lg font-semibold text-foreground scroll-mt-20">
            Configuration
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Toggle attributes on/off to customize. Only enabled attributes
            appear in the exported code.
          </p>
        </div>

        {/* Required attribute — always-on card */}
        <div
          id="anim-attributes"
          className="scroll-mt-20 rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground">
                Animation
                <span className="ml-1.5 text-[10px] font-normal text-primary/70">
                  required
                </span>
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                data-flowg-anim
              </span>
            </div>
            <code className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              {animation.name}
            </code>
          </div>
        </div>

        {/* Interactive configurator (toggleable attributes) */}
        <div id="api-anim" className="scroll-mt-20">
          <Configurator config={config} onChange={onConfigChange} />
        </div>
      </section>

      <Separator />

      {/* Code Export */}
      <section id="anim-code" className="space-y-4 scroll-mt-20">
        <h2 className="text-lg font-semibold text-foreground">Code Export</h2>
        <CodeExport animation={animation} config={config} />
      </section>
    </article>
  );
}
