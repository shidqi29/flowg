"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { AnimationDef } from "@/lib/animations";
import { generateScriptTag, generateSnippet } from "@/lib/animations";
import type { AnimConfig } from "@/components/configurator";

interface CodeExportProps {
  animation: AnimationDef;
  config: AnimConfig;
}

export function CodeExport({ animation, config }: CodeExportProps) {
  const [copied, setCopied] = useState(false);

  const scriptTag = generateScriptTag(animation.name);
  const htmlSnippet = generateSnippet({
    anim: animation.name,
    duration: config.duration,
    delay: config.delay,
    ease: config.ease,
    offset: config.offset,
    trigger: config.trigger,
  });

  const fullSnippet = `${scriptTag}\n\n${htmlSnippet}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground">Code Export</h3>
        <Badge
          variant="outline"
          className={
            animation.engine === "css"
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
              : "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20"
          }>
          {animation.engine === "css"
            ? "Core (~2KB)"
            : "Pro (~45KB, includes GSAP)"}
        </Badge>
      </div>

      {animation.engine === "css" ? (
        <p className="text-xs text-muted-foreground">
          This is a lightweight CSS animation. Use the <strong>Core</strong>{" "}
          script.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          This animation requires the <strong>Pro Engine</strong> (includes
          GSAP).
        </p>
      )}

      <div className="relative">
        <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto leading-relaxed">
          <code>{fullSnippet}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 text-xs px-2 py-1 rounded-md bg-background/80 border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
