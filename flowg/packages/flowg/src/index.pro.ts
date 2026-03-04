// ==========================================================
// FlowG Pro — GSAP-Powered Animation Engine
// Extends Core with JavaScript-driven animations.
//
// Auto-initializes on import. Just add data-flowg-* attributes
// to your HTML and include this script — no setup needed.
//
// Usage (CDN):
//   <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
//   <link rel="stylesheet" href="...flowgeneration/dist/style.css" />
//   <script type="module" src="...flowgeneration/dist/flowg-pro.js"></script>
//
// Usage (npm):
//   import "flowgeneration/pro";
//   import "flowgeneration/style.css";
// ==========================================================

import { initCore, activate, reset } from "./index.core.js";
import { createObserver } from "./engine/observer.js";
import { GSAP_ANIMATIONS, isGsapAnimation } from "./engine/registry.js";
import gsap from "gsap";

// Re-export everything from core
export { initCore, activate, reset } from "./index.core.js";
export {
  ANIMATION_REGISTRY,
  CSS_ANIMATIONS,
  GSAP_ANIMATIONS,
  isGsapAnimation,
  isCssAnimation,
  getEngineType,
} from "./engine/registry.js";
export type { AnimationDef, EngineType } from "./engine/registry.js";

let _proInitialized = false;

// ==========================================================
// GSAP Animation Handlers
// ==========================================================

type GsapHandler = (el: HTMLElement, vars: gsap.TweenVars) => void;

/**
 * Read common animation properties from the element's data attributes.
 */
function readVars(el: HTMLElement): gsap.TweenVars {
  const duration = parseFloat(el.dataset.flowgDuration || "0.6");
  const delay = parseFloat(el.dataset.flowgDelay || "0");
  const ease = el.dataset.flowgEase || "power2.out";

  return { duration, delay, ease };
}

/**
 * Registry of GSAP animation handlers.
 * Each key matches a `data-flowg-anim` value.
 */
const GSAP_HANDLERS: Record<string, GsapHandler> = {
  "split-text": (el, vars) => {
    // Split each character into a span and stagger-animate them
    const text = el.textContent || "";
    el.innerHTML = text
      .split("")
      .map((char) =>
        char === " "
          ? `<span class="flowg-char">&nbsp;</span>`
          : `<span class="flowg-char">${char}</span>`
      )
      .join("");

    const chars = el.querySelectorAll(".flowg-char");
    gsap.from(chars, {
      opacity: 0,
      y: 20,
      rotateX: -90,
      stagger: 0.03,
      ...vars,
    });
  },

  "text-stagger": (el, vars) => {
    // Stagger-reveal words
    const text = el.textContent || "";
    el.innerHTML = text
      .split(" ")
      .map((word) => `<span class="flowg-word">${word}</span>`)
      .join(" ");

    const words = el.querySelectorAll(".flowg-word");
    gsap.from(words, {
      opacity: 0,
      y: 30,
      stagger: 0.08,
      ...vars,
    });
  },

  typewriter: (el, vars) => {
    const text = el.textContent || "";
    el.textContent = "";
    el.style.opacity = "1";

    const tl = gsap.timeline({ delay: Number(vars.delay) || 0 });
    text.split("").forEach((char, i) => {
      tl.call(
        () => {
          el.textContent += char;
        },
        [],
        i * 0.05
      );
    });
  },

  "scroll-scrub": (el, vars) => {
    // Requires ScrollTrigger plugin — graceful fallback
    try {
      gsap.from(el, {
        opacity: 0,
        y: 80,
        ...vars,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "top 30%",
          scrub: true,
        },
      });
    } catch {
      // ScrollTrigger not loaded — fall back to simple animation
      gsap.from(el, { opacity: 0, y: 80, ...vars });
    }
  },

  "physics-bounce": (el, vars) => {
    gsap.from(el, {
      opacity: 0,
      y: -100,
      ease: "bounce.out",
      ...vars,
      duration: vars.duration || 1.2,
    });
  },

  "stagger-up": (el, vars) => {
    // Animate direct children with a stagger
    const children = el.children;
    gsap.from(children, {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      ...vars,
    });
    el.style.opacity = "1";
  },

  "stagger-fade": (el, vars) => {
    const children = el.children;
    gsap.from(children, {
      opacity: 0,
      stagger: 0.12,
      ...vars,
    });
    el.style.opacity = "1";
  },

  counter: (el, vars) => {
    const target = parseInt(el.textContent || "0", 10);
    el.textContent = "0";
    el.style.opacity = "1";

    gsap.to(el, {
      duration: vars.duration || 2,
      delay: vars.delay || 0,
      ease: vars.ease || "power1.out",
      textContent: target,
      snap: { textContent: 1 },
      onUpdate() {
        el.textContent = Math.round(
          parseFloat(el.textContent || "0")
        ).toString();
      },
    });
  },
};

// ==========================================================
// Init
// ==========================================================

/**
 * Initialize the FlowG Pro engine.
 * Runs Core for CSS animations, then handles GSAP animations.
 *
 * This is called automatically on import. You can also call it
 * manually if needed — safe to call multiple times.
 */
export function initPro(): void {
  if (_proInitialized) return;
  _proInitialized = true;

  // 1. Initialize CSS engine for lightweight animations
  initCore();

  if (typeof window === "undefined") return;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _setupPro);
  } else {
    _setupPro();
  }
}

function _setupPro(): void {
  _scanGsapElements();
  _observeNewGsapElements();
}

/**
 * Scan all existing GSAP elements and wire them up.
 */
function _scanGsapElements(): void {
  const elements =
    document.querySelectorAll<HTMLElement>("[data-flowg-anim]");

  elements.forEach((el) => {
    _initGsapElement(el);
  });
}

/**
 * Initialize a single element for GSAP animation (if applicable).
 */
function _initGsapElement(el: HTMLElement): void {
  const animName = el.dataset.flowgAnim;
  if (!animName || !isGsapAnimation(animName)) return;
  // Skip already-handled elements
  if (el.classList.contains("flowg-js-handled")) return;

  // Mark element so CSS engine skips it
  el.classList.add("flowg-js-handled");

  const trigger = el.dataset.flowgTrigger || "viewport";
  const vars = readVars(el);
  const handler = GSAP_HANDLERS[animName];

  if (!handler) {
    // Unknown GSAP animation — do a generic GSAP fade-up
    gsap.from(el, { opacity: 0, y: 50, ...vars });
    return;
  }

  if (trigger === "viewport") {
    // Use IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handler(entry.target as HTMLElement, vars);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: el.dataset.flowgOffset
          ? `0px 0px -${el.dataset.flowgOffset} 0px`
          : "0px",
        threshold: 0.1,
      }
    );
    observer.observe(el);
  } else if (trigger === "hover") {
    el.addEventListener("mouseenter", () => handler(el, vars), {
      once: true,
    });
  } else if (trigger === "click") {
    el.addEventListener("click", () => handler(el, vars), { once: true });
  }
}

/**
 * Watch for dynamically added GSAP elements via MutationObserver.
 */
function _observeNewGsapElements(): void {
  if (typeof MutationObserver === "undefined") return;

  const mo = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        const el = node as HTMLElement;

        // Check the element itself
        if (el.hasAttribute("data-flowg-anim")) {
          _initGsapElement(el);
        }

        // Check descendants
        const children = el.querySelectorAll<HTMLElement>("[data-flowg-anim]");
        children.forEach((child) => _initGsapElement(child));
      }
    }
  });

  mo.observe(document.body, { childList: true, subtree: true });
}

// ==========================================================
// Auto-init: runs automatically when this module is imported.
// ==========================================================
initPro();
