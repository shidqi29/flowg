// ==========================================================
// FlowG Showcase — Animation Registry (mirrors packages/flowg)
// This is a client-side copy of the registry for the web app.
// ==========================================================

export type EngineType = "css" | "gsap";

export interface AnimationDef {
  name: string;
  engine: EngineType;
  label: string;
  category: string;
  description: string;
}

export const ANIMATION_REGISTRY: AnimationDef[] = [
  // CSS — Fade
  { name: "fade-in", engine: "css", label: "Fade In", category: "Fade", description: "Simple opacity fade in" },
  { name: "fade-up", engine: "css", label: "Fade Up", category: "Fade", description: "Fade in while moving upward" },
  { name: "fade-down", engine: "css", label: "Fade Down", category: "Fade", description: "Fade in while moving downward" },
  { name: "fade-left", engine: "css", label: "Fade Left", category: "Fade", description: "Fade in from the right" },
  { name: "fade-right", engine: "css", label: "Fade Right", category: "Fade", description: "Fade in from the left" },

  // CSS — Zoom
  { name: "zoom-in", engine: "css", label: "Zoom In", category: "Zoom", description: "Scale up from smaller size" },
  { name: "zoom-out", engine: "css", label: "Zoom Out", category: "Zoom", description: "Scale down from larger size" },

  // CSS — Slide
  { name: "slide-up", engine: "css", label: "Slide Up", category: "Slide", description: "Slide in from below" },
  { name: "slide-down", engine: "css", label: "Slide Down", category: "Slide", description: "Slide in from above" },
  { name: "slide-left", engine: "css", label: "Slide Left", category: "Slide", description: "Slide in from the right" },
  { name: "slide-right", engine: "css", label: "Slide Right", category: "Slide", description: "Slide in from the left" },

  // CSS — Flip
  { name: "flip-up", engine: "css", label: "Flip Up", category: "Flip", description: "3D flip from top" },
  { name: "flip-down", engine: "css", label: "Flip Down", category: "Flip", description: "3D flip from bottom" },
  { name: "flip-left", engine: "css", label: "Flip Left", category: "Flip", description: "3D flip from left" },
  { name: "flip-right", engine: "css", label: "Flip Right", category: "Flip", description: "3D flip from right" },

  // CSS — Blur
  { name: "blur-in", engine: "css", label: "Blur In", category: "Blur", description: "Unblur into view" },
  { name: "blur-up", engine: "css", label: "Blur Up", category: "Blur", description: "Unblur while moving upward" },

  // CSS — Misc
  { name: "rotate-in", engine: "css", label: "Rotate In", category: "Misc", description: "Rotate into view" },
  { name: "bounce-in", engine: "css", label: "Bounce In", category: "Misc", description: "Bouncy scale entrance" },

  // GSAP — Text
  { name: "split-text", engine: "gsap", label: "Split Text", category: "Text", description: "Character-by-character reveal" },
  { name: "text-stagger", engine: "gsap", label: "Text Stagger", category: "Text", description: "Word-by-word stagger reveal" },
  { name: "typewriter", engine: "gsap", label: "Typewriter", category: "Text", description: "Typing effect one char at a time" },

  // GSAP — Scroll
  { name: "scroll-scrub", engine: "gsap", label: "Scroll Scrub", category: "Scroll", description: "Animation tied to scroll position" },

  // GSAP — Advanced
  { name: "physics-bounce", engine: "gsap", label: "Physics Bounce", category: "Advanced", description: "Realistic bounce physics" },
  { name: "stagger-up", engine: "gsap", label: "Stagger Up", category: "Advanced", description: "Children stagger from below" },
  { name: "stagger-fade", engine: "gsap", label: "Stagger Fade", category: "Advanced", description: "Children fade in one by one" },
  { name: "counter", engine: "gsap", label: "Counter", category: "Advanced", description: "Animated number counter" },
];

export const CATEGORIES = [...new Set(ANIMATION_REGISTRY.map((a) => a.category))];

export const CSS_ANIMATIONS = ANIMATION_REGISTRY.filter((a) => a.engine === "css");
export const GSAP_ANIMATIONS = ANIMATION_REGISTRY.filter((a) => a.engine === "gsap");

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

  const attrString = attrs.join("\n  ");
  return `<div
  ${attrString}
>
  Your content here
</div>`;
}
