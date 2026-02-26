"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AnimationDef } from "@/lib/animations";

interface AnimationPreviewProps {
  animation: AnimationDef;
  duration?: string;
  delay?: string;
  ease?: string;
  stagger?: string;
}

// ---- Typewriter Preview ----
function TypewriterPreview({
  duration,
  delay,
}: {
  duration: string;
  delay: string;
}) {
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Hello, FlowG!";
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const play = useCallback(() => {
    setText("");
    setShowCursor(true);
    const delayMs = parseFloat(delay) * 1000;
    const totalDur = parseFloat(duration) * 1000;
    const charDelay = totalDur / fullText.length;

    timerRef.current = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setText(fullText.slice(0, i));
        if (i >= fullText.length) {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 500);
        }
      }, charDelay);
    }, delayMs);
  }, [duration, delay]);

  useEffect(() => {
    play();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [play]);

  return (
    <PreviewWrapper
      onReplay={play}
      label="Typewriter"
      sublabel="Typing effect one char at a time">
      <div className="font-mono text-sm sm:text-lg font-semibold text-foreground min-h-[1.5em] flex items-center justify-center">
        <span>{text}</span>
        <span
          className={`inline-block w-0.5 h-[1.2em] bg-foreground ml-0.5 ${
            showCursor ? "animate-blink" : "opacity-0"
          }`}
        />
      </div>
    </PreviewWrapper>
  );
}

// ---- Counter Preview ----
function CounterPreview({
  duration,
  delay,
}: {
  duration: string;
  delay: string;
}) {
  const [value, setValue] = useState(0);
  const target = 1248;
  const rafRef = useRef<number | null>(null);

  const play = useCallback(() => {
    setValue(0);
    const delayMs = parseFloat(delay) * 1000;
    const totalDur = parseFloat(duration) * 1000;

    setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / totalDur, 1);
        // Ease-out quad
        const eased = 1 - (1 - progress) * (1 - progress);
        setValue(Math.round(eased * target));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }, delayMs);
  }, [duration, delay]);

  useEffect(() => {
    play();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [play]);

  return (
    <PreviewWrapper
      onReplay={play}
      label="Counter"
      sublabel="Animated number counter">
      <div className="text-center">
        <p className="text-2xl sm:text-4xl font-bold tabular-nums text-foreground">
          {value.toLocaleString()}
        </p>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
          active users
        </p>
      </div>
    </PreviewWrapper>
  );
}

// ---- Stagger Preview (split-text, text-stagger, stagger-up, stagger-fade) ----
function StaggerPreview({
  animation,
  duration,
  delay,
  ease,
  stagger,
}: {
  animation: AnimationDef;
  duration: string;
  delay: string;
  ease: string;
  stagger: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine items based on animation type
  const isTextType = animation.name === "split-text";
  const isWordType = animation.name === "text-stagger";
  const isStaggerUp = animation.name === "stagger-up";

  const items = isTextType
    ? "FlowG".split("")
    : isWordType
      ? ["Animate", "With", "Style"]
      : ["Item 1", "Item 2", "Item 3", "Item 4"];

  const play = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const children = container.querySelectorAll<HTMLElement>(".stagger-child");
    const delayMs = parseFloat(delay) * 1000;
    const staggerMs = (parseFloat(stagger) || 0.08) * 1000;
    const durSec = duration;
    const easeVal = ease;

    // Reset all children
    children.forEach((child) => {
      child.style.animation = "none";
      child.style.opacity = "0";
    });

    // Force reflow
    void container.offsetHeight;

    setTimeout(() => {
      children.forEach((child, i) => {
        child.style.animation = "";
        const animName =
          isStaggerUp || isWordType ? "fg-stagger-up" : "fg-stagger-char";
        const childDelay = i * staggerMs;
        child.style.animation = `${animName} ${durSec}s ${easeVal} ${childDelay}ms both`;
      });
    }, delayMs);
  }, [duration, delay, ease, stagger, isStaggerUp, isWordType]);

  useEffect(() => {
    play();
  }, [play]);

  return (
    <PreviewWrapper
      onReplay={play}
      label={animation.label}
      sublabel={animation.description}>
      <div
        ref={containerRef}
        className={`flex items-center justify-center ${
          isTextType ? "gap-0.5" : isWordType ? "gap-2" : "gap-2 sm:gap-3"
        } flex-wrap`}>
        {items.map((item, i) => (
          <span
            key={i}
            className={`stagger-child opacity-0 ${
              isTextType
                ? "text-xl sm:text-2xl font-bold font-mono text-foreground"
                : isWordType
                  ? "text-sm sm:text-base font-semibold text-foreground"
                  : "px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-primary/10 text-primary text-xs sm:text-sm font-medium"
            }`}>
            {item}
          </span>
        ))}
      </div>
    </PreviewWrapper>
  );
}

// ---- Scroll Scrub Preview ----
function ScrubPreview({ duration }: { duration: string }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  const play = useCallback(() => {
    setProgress(0);
    const totalDur = parseFloat(duration) * 1000 * 2; // Slow it down for visual effect
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / totalDur, 1);
      setProgress(p);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [duration]);

  useEffect(() => {
    play();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [play]);

  return (
    <PreviewWrapper
      onReplay={play}
      label="Scroll Scrub"
      sublabel="Animation tied to scroll position">
      <div className="w-full max-w-50 mx-auto space-y-3">
        {/* Progress bar */}
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-none"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        {/* Moving element */}
        <div className="relative h-8">
          <div
            className="absolute top-0 size-8 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center"
            style={{
              left: `${progress * 100}%`,
              transform: `translateX(-50%) rotate(${progress * 360}deg)`,
              transition: "none",
            }}>
            <span className="text-[10px] font-bold text-primary">↓</span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center tabular-nums">
          {Math.round(progress * 100)}% scrolled
        </p>
      </div>
    </PreviewWrapper>
  );
}

// ---- Default CSS Preview (the original) ----
function DefaultPreview({
  animation,
  duration,
  delay,
  ease,
}: {
  animation: AnimationDef;
  duration: string;
  delay: string;
  ease: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const play = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.remove("flowg-active");
    el.style.animation = "none";
    void el.offsetHeight;
    el.style.animation = "";
    el.classList.add("flowg-active");
  }, []);

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
    <PreviewWrapper
      onReplay={play}
      label={animation.label}
      sublabel={animation.description}>
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
    </PreviewWrapper>
  );
}

// ---- Shared wrapper with replay button ----
function PreviewWrapper({
  children,
  onReplay,
}: {
  children: React.ReactNode;
  onReplay: () => void;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30 min-h-28 sm:min-h-40 flex flex-col items-center justify-center">
      <div className="flex-1 flex items-center justify-center w-full px-4 py-3 sm:px-6 sm:py-4">
        {children}
      </div>

      {/* Replay button */}
      <button
        onClick={onReplay}
        className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-background/80 border border-border">
        ↻ Replay
      </button>
    </div>
  );
}

// ---- Main Export ----
export function AnimationPreview({
  animation,
  duration = "0.5",
  delay = "0",
  ease = "ease-out",
  stagger = "0.08",
}: AnimationPreviewProps) {
  switch (animation.previewMode) {
    case "typewriter":
      return <TypewriterPreview duration={duration} delay={delay} />;
    case "counter":
      return <CounterPreview duration={duration} delay={delay} />;
    case "stagger":
      return (
        <StaggerPreview
          animation={animation}
          duration={duration}
          delay={delay}
          ease={ease}
          stagger={stagger}
        />
      );
    case "scrub":
      return <ScrubPreview duration={duration} />;
    default:
      return (
        <DefaultPreview
          animation={animation}
          duration={duration}
          delay={delay}
          ease={ease}
        />
      );
  }
}
