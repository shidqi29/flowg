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
            {animation.engine === "css" ? "CSS Core" : "GSAP Pro"}
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
          />
        </div>
      </section>

      <Separator />

      {/* Configuration */}
      <section className="space-y-4">
        <h2
          id="anim-config"
          className="text-lg font-semibold text-foreground scroll-mt-20">
          Configuration
        </h2>

        {/* Attribute reference for this animation */}
        <div id="anim-attributes" className="scroll-mt-20">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Available Attributes
          </h3>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-2.5 font-medium">Attribute</th>
                  <th className="text-left p-2.5 font-medium">Default</th>
                  <th className="text-left p-2.5 font-medium hidden sm:table-cell">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr id="api-anim" className="scroll-mt-20">
                  <td className="p-2.5 font-mono text-primary">
                    data-flowg-anim
                  </td>
                  <td className="p-2.5 text-muted-foreground">—</td>
                  <td className="p-2.5 text-muted-foreground hidden sm:table-cell">
                    Animation name (required)
                  </td>
                </tr>
                <tr id="api-duration" className="scroll-mt-20">
                  <td className="p-2.5 font-mono text-primary">
                    data-flowg-duration
                  </td>
                  <td className="p-2.5 text-muted-foreground">0.5s</td>
                  <td className="p-2.5 text-muted-foreground hidden sm:table-cell">
                    Animation duration
                  </td>
                </tr>
                <tr id="api-delay" className="scroll-mt-20">
                  <td className="p-2.5 font-mono text-primary">
                    data-flowg-delay
                  </td>
                  <td className="p-2.5 text-muted-foreground">0s</td>
                  <td className="p-2.5 text-muted-foreground hidden sm:table-cell">
                    Delay before start
                  </td>
                </tr>
                <tr id="api-ease" className="scroll-mt-20">
                  <td className="p-2.5 font-mono text-primary">
                    data-flowg-ease
                  </td>
                  <td className="p-2.5 text-muted-foreground">ease-out</td>
                  <td className="p-2.5 text-muted-foreground hidden sm:table-cell">
                    Easing function (CSS or GSAP)
                  </td>
                </tr>
                <tr id="api-offset" className="scroll-mt-20">
                  <td className="p-2.5 font-mono text-primary">
                    data-flowg-offset
                  </td>
                  <td className="p-2.5 text-muted-foreground">0%</td>
                  <td className="p-2.5 text-muted-foreground hidden sm:table-cell">
                    Viewport trigger offset
                  </td>
                </tr>
                <tr id="api-trigger" className="scroll-mt-20">
                  <td className="p-2.5 font-mono text-primary">
                    data-flowg-trigger
                  </td>
                  <td className="p-2.5 text-muted-foreground">viewport</td>
                  <td className="p-2.5 text-muted-foreground hidden sm:table-cell">
                    viewport, hover, or click
                  </td>
                </tr>
                <tr id="api-stagger" className="scroll-mt-20">
                  <td className="p-2.5 font-mono text-primary">
                    data-flowg-stagger
                  </td>
                  <td className="p-2.5 text-muted-foreground">0.08s</td>
                  <td className="p-2.5 text-muted-foreground hidden sm:table-cell">
                    Stagger delay between children
                  </td>
                </tr>
                <tr id="api-repeat" className="scroll-mt-20">
                  <td className="p-2.5 font-mono text-primary">
                    data-flowg-repeat
                  </td>
                  <td className="p-2.5 text-muted-foreground">0</td>
                  <td className="p-2.5 text-muted-foreground hidden sm:table-cell">
                    Repeat count (-1 = infinite)
                  </td>
                </tr>
                <tr id="api-direction" className="scroll-mt-20">
                  <td className="p-2.5 font-mono text-primary">
                    data-flowg-direction
                  </td>
                  <td className="p-2.5 text-muted-foreground">normal</td>
                  <td className="p-2.5 text-muted-foreground hidden sm:table-cell">
                    normal, reverse, or alternate
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive configurator */}
        <div className="max-w-md">
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
