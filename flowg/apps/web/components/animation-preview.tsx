"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AnimationDef } from "@/lib/animations";

interface AnimationPreviewProps {
  animation: AnimationDef;
  duration?: string;
  delay?: string;
  ease?: string;
}

export function AnimationPreview({
  animation,
  duration = "0.5",
  delay = "0",
  ease = "ease-out",
}: AnimationPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const play = useCallback(() => {
    setActive(false);
    // Force reflow, then activate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setActive(true);
      });
    });
  }, []);

  // Auto-play on mount
  useEffect(() => {
    const timer = setTimeout(play, 100);
    return () => clearTimeout(timer);
  }, [animation.name, duration, delay, ease, play]);

  const durSec = /^\d+(\.\d+)?$/.test(duration) ? `${duration}s` : duration;
  const delSec = /^\d+(\.\d+)?$/.test(delay) ? `${delay}s` : delay;

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30 min-h-40 flex items-center justify-center">
      <div
        ref={ref}
        data-anim={animation.name}
        className={`flowg-preview ${active ? "flowg-active" : ""}`}
        style={
          {
            "--fg-dur": durSec,
            "--fg-del": delSec,
            "--fg-ease": ease,
          } as React.CSSProperties
        }>
        <div className="text-center px-6 py-4">
          <p className="text-lg font-semibold text-foreground">
            {animation.label}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {animation.description}
          </p>
        </div>
      </div>

      {/* Replay button */}
      <button
        onClick={play}
        className="absolute bottom-2 right-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2 py-1 rounded-md bg-background/80 border border-border">
        ↻ Replay
      </button>
    </div>
  );
}
