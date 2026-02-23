"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { AnimationDef } from "@/lib/animations";
import { generateScriptTag, generateSnippet } from "@/lib/animations";
import type { AnimConfig } from "@/components/configurator";

interface CodeExportProps {
  animation: AnimationDef;
  config: AnimConfig;
}

export function CodeExport({ animation, config }: CodeExportProps) {
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState<"standard" | "webflow">("standard");

  const scriptTag = generateScriptTag(animation.name, platform);
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
      <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
        <h3 className="font-semibold text-sm text-foreground">Code Export</h3>
        <Badge
          variant="outline"
          className={`shrink-0 ${
            animation.engine === "css"
              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
              : "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20"
          }`}>
          {animation.engine === "css" ? "Core (~2KB)" : "Pro (requires GSAP)"}
        </Badge>
      </div>

      {/* Platform toggle */}
      <div className="space-y-1.5">
        <span className="text-xs text-muted-foreground">Platform</span>
        <ToggleGroup
          type="single"
          value={platform}
          onValueChange={(v) => {
            if (v) setPlatform(v as "standard" | "webflow");
          }}
          className="justify-start">
          <ToggleGroupItem value="standard" className="text-xs h-7 px-3">
            Standard
          </ToggleGroupItem>
          <ToggleGroupItem value="webflow" className="text-xs h-7 px-3">
            Webflow
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {animation.engine === "css" ? (
        <p className="text-xs text-muted-foreground">
          This is a lightweight CSS animation. Use the <strong>Core</strong>{" "}
          engine — no dependencies.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          This animation requires the <strong>Pro Engine</strong>.{" "}
          {platform === "webflow" ? (
            <>
              You must add the <strong>GSAP script</strong> to your Webflow
              project.
            </>
          ) : (
            <>
              Install GSAP:{" "}
              <code className="text-[10px] bg-muted px-1 py-0.5 rounded">
                npm install gsap
              </code>
            </>
          )}
        </p>
      )}

      {platform === "webflow" && (
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-xs text-amber-800 dark:text-amber-300 space-y-1.5">
          <p className="font-medium">Webflow Setup</p>
          <ol className="list-decimal list-inside space-y-1 text-amber-700 dark:text-amber-400">
            <li>
              Go to <strong>Project Settings → Custom Code</strong>
            </li>
            <li>
              Paste the <code>&lt;link&gt;</code> tag in the{" "}
              <strong>Head Code</strong> section
            </li>
            <li>
              Paste the <code>&lt;script&gt;</code> tags in the{" "}
              <strong>Footer Code</strong> section
            </li>
            <li>
              Add <code>data-flowg-*</code> attributes via{" "}
              <strong>Element Settings → Custom Attributes</strong>
            </li>
          </ol>
          {animation.engine === "gsap" && (
            <p className="mt-1.5 text-amber-600 dark:text-amber-400">
              ⚠️ GSAP must be loaded <strong>before</strong> FlowG Pro. The
              snippet below includes it.
            </p>
          )}
        </div>
      )}

      <div className="relative">
        <pre className="rounded-lg bg-muted p-3 sm:p-4 text-[11px] sm:text-xs overflow-x-auto leading-relaxed">
          <code>{fullSnippet}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 text-[10px] sm:text-xs px-2 py-1 rounded-md bg-background/80 border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
