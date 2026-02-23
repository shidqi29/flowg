"use client";

import { useCallback, useEffect, useRef } from "react";
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

  const play = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    // Remove active class and clear animation
    el.classList.remove("flowg-active");
    el.style.animation = "none";

    // Force reflow so the browser resets the element
    void el.offsetHeight;

    // Clear inline animation override and add active class
    el.style.animation = "";
    el.classList.add("flowg-active");
  }, []);

  // Auto-play on mount and whenever props change
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.remove("flowg-active");
    el.style.animation = "none";

    const timer = setTimeout(play, 100);
    return () => clearTimeout(timer);
  }, [animation.name, duration, delay, ease, play]);

  const durSec = /^\d+(\.\d+)?$/.test(duration) ? `${duration}s` : duration;
  const delSec = /^\d+(\.\d+)?$/.test(delay) ? `${delay}s` : delay;

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30 min-h-28 sm:min-h-40 flex items-center justify-center">
      <div
        ref={ref}
        data-anim={animation.name}
        className="flowg-preview"
        style={
          {
            "--fg-dur": durSec,
            "--fg-del": delSec,
            "--fg-ease": ease,
          } as React.CSSProperties
        }>
        <div className="text-center px-4 py-3 sm:px-6 sm:py-4">
          <p className="text-sm sm:text-lg font-semibold text-foreground">
            {animation.label}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
            {animation.description}
          </p>
        </div>
      </div>

      {/* Replay button */}
      <button
        onClick={play}
        className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-background/80 border border-border">
        ↻ Replay
      </button>
    </div>
  );
}
