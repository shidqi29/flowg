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

// ---- GSAP → CSS easing fallback ----
// GSAP easing strings are not valid CSS timing functions.
// Map them to approximate CSS cubic-bezier equivalents for preview.
const GSAP_EASING_MAP: Record<string, string> = {
  "power2.out": "cubic-bezier(0.33, 1, 0.68, 1)",
  "power3.out": "cubic-bezier(0.22, 1, 0.36, 1)",
  "bounce.out": "cubic-bezier(0.34, 1.56, 0.64, 1)",
  "elastic.out(1,0.3)": "cubic-bezier(0.34, 1.56, 0.64, 1)",
  "back.out(1.7)": "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

function isGsapEasing(ease: string): boolean {
  return /^(power|bounce|elastic|back|expo|circ|sine)\d?\./i.test(ease);
}

/** Convert an easing value to a valid CSS timing function */
function toCssEasing(ease: string): string {
  if (!isGsapEasing(ease)) return ease; // already valid CSS
  return GSAP_EASING_MAP[ease] ?? "cubic-bezier(0.33, 1, 0.68, 1)"; // default to power2.out-like
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
      <div className="font-mono text-base sm:text-2xl font-semibold text-foreground min-h-[1.5em] flex items-center justify-center">
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
        <p className="text-3xl sm:text-5xl font-bold tabular-nums text-foreground">
          {value.toLocaleString()}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
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
    const easeVal = toCssEasing(ease);

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
      sublabel={animation.description}
      notice={
        isGsapEasing(ease)
          ? "GSAP easing approximated with CSS cubic-bezier for preview"
          : undefined
      }>
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
                ? "text-xl sm:text-3xl font-bold font-mono text-foreground"
                : isWordType
                  ? "text-base sm:text-lg font-semibold text-foreground"
                  : "px-4 py-2 sm:px-5 sm:py-3 rounded-md bg-primary/10 text-primary text-sm sm:text-base font-medium"
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
      <div className="w-full max-w-64 mx-auto space-y-4">
        {/* Progress bar */}
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-none"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        {/* Moving element */}
        <div className="relative h-10">
          <div
            className="absolute top-0 size-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center"
            style={{
              left: `${progress * 100}%`,
              transform: `translateX(-50%) rotate(${progress * 360}deg)`,
              transition: "none",
            }}>
            <span className="text-xs font-bold text-primary">↓</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center tabular-nums">
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
  const cssEase = toCssEasing(ease);
  const isApproximated = isGsapEasing(ease);

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
  }, [animation.name, duration, delay, cssEase, play]);

  const durSec = /^\d+(\.\d+)?$/.test(duration) ? `${duration}s` : duration;
  const delSec = /^\d+(\.\d+)?$/.test(delay) ? `${delay}s` : delay;

  return (
    <PreviewWrapper
      onReplay={play}
      label={animation.label}
      sublabel={animation.description}
      notice={
        isApproximated
          ? "GSAP easing approximated with CSS cubic-bezier for preview"
          : undefined
      }>
      <div
        ref={ref}
        data-anim={animation.name}
        className="flowg-preview"
        style={
          {
            "--fg-dur": durSec,
            "--fg-del": delSec,
            "--fg-ease": cssEase,
          } as React.CSSProperties
        }>
        <div className="text-center px-4 py-6 sm:px-8 sm:py-8">
          <p className="text-base sm:text-xl font-semibold text-foreground">
            {animation.label}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
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
  notice,
}: {
  children: React.ReactNode;
  onReplay: () => void;
  label: string;
  sublabel: string;
  notice?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-muted/30 min-h-48 sm:min-h-64 flex flex-col items-center justify-center">
      <div className="flex-1 flex items-center justify-center w-full px-6 py-6 sm:px-10 sm:py-8">
        {children}
      </div>

      {/* GSAP approximation notice */}
      {notice && (
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 text-[9px] sm:text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md max-w-50 sm:max-w-none">
          ⚠ {notice}
        </div>
      )}

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
