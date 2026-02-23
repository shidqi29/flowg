// ==========================================================
// FlowG — Animation Registry
// Maps animation names to their engine type (CSS or GSAP).
// ==========================================================

export type EngineType = "css" | "gsap";

export interface AnimationDef {
  name: string;
  engine: EngineType;
  label: string;
  category: string;
}

/**
 * CSS-only animations — handled by class toggling + transitions.
 */
export const CSS_ANIMATIONS: string[] = [
  "fade-in",
  "fade-up",
  "fade-down",
  "fade-left",
  "fade-right",
  "zoom-in",
  "zoom-out",
  "slide-up",
  "slide-down",
  "slide-left",
  "slide-right",
  "flip-up",
  "flip-down",
  "flip-left",
  "flip-right",
  "blur-in",
  "blur-up",
  "rotate-in",
  "bounce-in",
];

/**
 * GSAP-only animations — require JavaScript to execute.
 */
export const GSAP_ANIMATIONS: string[] = [
  "split-text",
  "text-stagger",
  "scroll-scrub",
  "physics-bounce",
  "stagger-up",
  "stagger-fade",
  "counter",
  "typewriter",
];

/**
 * Full registry with metadata for the web app / configurator.
 */
export const ANIMATION_REGISTRY: AnimationDef[] = [
  // CSS — Fade
  { name: "fade-in", engine: "css", label: "Fade In", category: "Fade" },
  { name: "fade-up", engine: "css", label: "Fade Up", category: "Fade" },
  { name: "fade-down", engine: "css", label: "Fade Down", category: "Fade" },
  { name: "fade-left", engine: "css", label: "Fade Left", category: "Fade" },
  { name: "fade-right", engine: "css", label: "Fade Right", category: "Fade" },

  // CSS — Zoom
  { name: "zoom-in", engine: "css", label: "Zoom In", category: "Zoom" },
  { name: "zoom-out", engine: "css", label: "Zoom Out", category: "Zoom" },

  // CSS — Slide
  { name: "slide-up", engine: "css", label: "Slide Up", category: "Slide" },
  { name: "slide-down", engine: "css", label: "Slide Down", category: "Slide" },
  { name: "slide-left", engine: "css", label: "Slide Left", category: "Slide" },
  { name: "slide-right", engine: "css", label: "Slide Right", category: "Slide" },

  // CSS — Flip
  { name: "flip-up", engine: "css", label: "Flip Up", category: "Flip" },
  { name: "flip-down", engine: "css", label: "Flip Down", category: "Flip" },
  { name: "flip-left", engine: "css", label: "Flip Left", category: "Flip" },
  { name: "flip-right", engine: "css", label: "Flip Right", category: "Flip" },

  // CSS — Blur
  { name: "blur-in", engine: "css", label: "Blur In", category: "Blur" },
  { name: "blur-up", engine: "css", label: "Blur Up", category: "Blur" },

  // CSS — Misc
  { name: "rotate-in", engine: "css", label: "Rotate In", category: "Misc" },
  { name: "bounce-in", engine: "css", label: "Bounce In", category: "Misc" },

  // GSAP — Text
  { name: "split-text", engine: "gsap", label: "Split Text", category: "Text" },
  { name: "text-stagger", engine: "gsap", label: "Text Stagger", category: "Text" },
  { name: "typewriter", engine: "gsap", label: "Typewriter", category: "Text" },

  // GSAP — Scroll
  { name: "scroll-scrub", engine: "gsap", label: "Scroll Scrub", category: "Scroll" },

  // GSAP — Advanced
  { name: "physics-bounce", engine: "gsap", label: "Physics Bounce", category: "Advanced" },
  { name: "stagger-up", engine: "gsap", label: "Stagger Up", category: "Advanced" },
  { name: "stagger-fade", engine: "gsap", label: "Stagger Fade", category: "Advanced" },
  { name: "counter", engine: "gsap", label: "Counter", category: "Advanced" },
];

/**
 * Check if an animation name is a GSAP animation.
 */
export function isGsapAnimation(name: string): boolean {
  return GSAP_ANIMATIONS.includes(name);
}

/**
 * Check if an animation name is a CSS animation.
 */
export function isCssAnimation(name: string): boolean {
  return CSS_ANIMATIONS.includes(name);
}

/**
 * Get the engine type for a given animation name.
 */
export function getEngineType(name: string): EngineType | null {
  if (CSS_ANIMATIONS.includes(name)) return "css";
  if (GSAP_ANIMATIONS.includes(name)) return "gsap";
  return null;
}
