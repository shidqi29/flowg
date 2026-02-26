// ==========================================================
// FlowG Showcase — Animation Registry (mirrors packages/flowg)
// This is a client-side copy of the registry for the web app.
// ==========================================================

export type EngineType = "css" | "gsap";

/** Preview rendering mode for the showcase */
export type PreviewMode =
  | "default" // Standard block animation
  | "stagger" // Multiple child elements with stagger
  | "typewriter" // Typing cursor effect
  | "counter" // Animated number
  | "scrub"; // Scroll-linked progress bar

export interface AnimationDef {
  name: string;
  engine: EngineType;
  label: string;
  category: string;
  description: string;
  /** Which preview renderer to use in the showcase */
  previewMode: PreviewMode;
}

export const ANIMATION_REGISTRY: AnimationDef[] = [
  // CSS — Fade
  { name: "fade-in", engine: "css", label: "Fade In", category: "Fade", description: "Simple opacity fade in", previewMode: "default" },
  { name: "fade-up", engine: "css", label: "Fade Up", category: "Fade", description: "Fade in while moving upward", previewMode: "default" },
  { name: "fade-down", engine: "css", label: "Fade Down", category: "Fade", description: "Fade in while moving downward", previewMode: "default" },
  { name: "fade-left", engine: "css", label: "Fade Left", category: "Fade", description: "Fade in from the right", previewMode: "default" },
  { name: "fade-right", engine: "css", label: "Fade Right", category: "Fade", description: "Fade in from the left", previewMode: "default" },

  // CSS — Zoom
  { name: "zoom-in", engine: "css", label: "Zoom In", category: "Zoom", description: "Scale up from smaller size", previewMode: "default" },
  { name: "zoom-out", engine: "css", label: "Zoom Out", category: "Zoom", description: "Scale down from larger size", previewMode: "default" },

  // CSS — Slide
  { name: "slide-up", engine: "css", label: "Slide Up", category: "Slide", description: "Slide in from below", previewMode: "default" },
  { name: "slide-down", engine: "css", label: "Slide Down", category: "Slide", description: "Slide in from above", previewMode: "default" },
  { name: "slide-left", engine: "css", label: "Slide Left", category: "Slide", description: "Slide in from the right", previewMode: "default" },
  { name: "slide-right", engine: "css", label: "Slide Right", category: "Slide", description: "Slide in from the left", previewMode: "default" },

  // CSS — Flip
  { name: "flip-up", engine: "css", label: "Flip Up", category: "Flip", description: "3D flip from top", previewMode: "default" },
  { name: "flip-down", engine: "css", label: "Flip Down", category: "Flip", description: "3D flip from bottom", previewMode: "default" },
  { name: "flip-left", engine: "css", label: "Flip Left", category: "Flip", description: "3D flip from left", previewMode: "default" },
  { name: "flip-right", engine: "css", label: "Flip Right", category: "Flip", description: "3D flip from right", previewMode: "default" },

  // CSS — Blur
  { name: "blur-in", engine: "css", label: "Blur In", category: "Blur", description: "Unblur into view", previewMode: "default" },
  { name: "blur-up", engine: "css", label: "Blur Up", category: "Blur", description: "Unblur while moving upward", previewMode: "default" },

  // CSS — Misc
  { name: "rotate-in", engine: "css", label: "Rotate In", category: "Misc", description: "Rotate into view", previewMode: "default" },
  { name: "bounce-in", engine: "css", label: "Bounce In", category: "Misc", description: "Bouncy scale entrance", previewMode: "default" },

  // GSAP — Text
  { name: "split-text", engine: "gsap", label: "Split Text", category: "Text", description: "Character-by-character reveal", previewMode: "stagger" },
  { name: "text-stagger", engine: "gsap", label: "Text Stagger", category: "Text", description: "Word-by-word stagger reveal", previewMode: "stagger" },
  { name: "typewriter", engine: "gsap", label: "Typewriter", category: "Text", description: "Typing effect one char at a time", previewMode: "typewriter" },

  // GSAP — Scroll
  { name: "scroll-scrub", engine: "gsap", label: "Scroll Scrub", category: "Scroll", description: "Animation tied to scroll position", previewMode: "scrub" },

  // GSAP — Advanced
  { name: "physics-bounce", engine: "gsap", label: "Physics Bounce", category: "Advanced", description: "Realistic bounce physics", previewMode: "default" },
  { name: "stagger-up", engine: "gsap", label: "Stagger Up", category: "Advanced", description: "Children stagger from below", previewMode: "stagger" },
  { name: "stagger-fade", engine: "gsap", label: "Stagger Fade", category: "Advanced", description: "Children fade in one by one", previewMode: "stagger" },
  { name: "counter", engine: "gsap", label: "Counter", category: "Advanced", description: "Animated number counter", previewMode: "counter" },
];

export const CATEGORIES = [...new Set(ANIMATION_REGISTRY.map((a) => a.category))];

export const CSS_ANIMATIONS = ANIMATION_REGISTRY.filter((a) => a.engine === "css");
export const GSAP_ANIMATIONS = ANIMATION_REGISTRY.filter((a) => a.engine === "gsap");

/** Whether this animation supports the stagger config option */
export function supportsStagger(name: string): boolean {
  return ["stagger-up", "stagger-fade", "split-text", "text-stagger"].includes(name);
}

/** Whether this animation supports the repeat config option */
export function supportsRepeat(name: string): boolean {
  return ["bounce-in", "rotate-in", "physics-bounce", "counter"].includes(name);
}

/**
 * Generate the correct <script> tag based on animation type.
 * Provides both standard and Webflow-ready variants.
 */
export function generateScriptTag(
  animationType: string,
  platform: "standard" | "webflow" = "standard",
): string {
  const anim = ANIMATION_REGISTRY.find((a) => a.name === animationType);
  if (!anim) return "";

  if (platform === "webflow") {
    if (anim.engine === "gsap") {
      return `<!-- 1. Add FlowG stylesheet (paste in Project Settings → Custom Code → Head) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/style.css" />

<!-- 2. Add GSAP + FlowG Pro (paste in Project Settings → Custom Code → Footer) -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script type="module">
  import { initPro } from "https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/flowg-pro.js";
  initPro();
</script>`;
    }

    return `<!-- 1. Add FlowG stylesheet (paste in Project Settings → Custom Code → Head) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/style.css" />

<!-- 2. Add FlowG Core (paste in Project Settings → Custom Code → Footer) -->
<script type="module">
  import { initCore } from "https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/flowg-core.js";
  initCore();
</script>`;
  }

  // Standard (npm / CDN)
  if (anim.engine === "gsap") {
    return `<!-- FlowG Pro Engine (requires GSAP) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/style.css" />
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script type="module">
  import { initPro } from "https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/flowg-pro.js";
  initPro();
</script>`;
  }

  return `<!-- FlowG Core Engine (~2KB gzipped) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/style.css" />
<script type="module">
  import { initCore } from "https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/flowg-core.js";
  initCore();
</script>`;
}

/**
 * Generate the full HTML snippet for a given animation configuration.
 */
export function generateSnippet(config: {
  anim: string;
  duration?: string;
  delay?: string;
  ease?: string;
  offset?: string;
  trigger?: string;
  stagger?: string;
  repeat?: string;
  direction?: string;
}): string {
  const attrs: string[] = [`data-flowg-anim="${config.anim}"`];

  if (config.duration && config.duration !== "0.5") {
    attrs.push(`data-flowg-duration="${config.duration}"`);
  }
  if (config.delay && config.delay !== "0") {
    attrs.push(`data-flowg-delay="${config.delay}"`);
  }
  if (config.ease && config.ease !== "ease-out") {
    attrs.push(`data-flowg-ease="${config.ease}"`);
  }
  if (config.offset) {
    attrs.push(`data-flowg-offset="${config.offset}"`);
  }
  if (config.trigger && config.trigger !== "viewport") {
    attrs.push(`data-flowg-trigger="${config.trigger}"`);
  }
  if (config.stagger && config.stagger !== "0") {
    attrs.push(`data-flowg-stagger="${config.stagger}"`);
  }
  if (config.repeat && config.repeat !== "0") {
    attrs.push(`data-flowg-repeat="${config.repeat}"`);
  }
  if (config.direction && config.direction !== "normal") {
    attrs.push(`data-flowg-direction="${config.direction}"`);
  }

  const attrString = attrs.join("\n  ");

  // Stagger animations need child elements to demonstrate
  if (supportsStagger(config.anim)) {
    return `<div
  ${attrString}
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>`;
  }

  return `<div
  ${attrString}
>
  Your content here
</div>`;
}
