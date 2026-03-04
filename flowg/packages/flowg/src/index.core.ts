// ==========================================================
// FlowG Core — CSS-Only Animation Engine
// ~2KB gzipped. No external dependencies.
//
// Auto-initializes on import. Just add data-flowg-* attributes
// to your HTML and include this script — no setup needed.
//
// Usage (CDN):
//   <link rel="stylesheet" href="...flowgeneration/dist/style.css" />
//   <script type="module" src="...flowgeneration/dist/flowg-core.js"></script>
//
// Usage (npm):
//   import "flowgeneration/core";
//   import "flowgeneration/style.css";
//
//   <div data-flowg-anim="fade-up">Hello World</div>
// ==========================================================

import "./css/main.scss";

import { createObserver } from "./engine/observer.js";
import { injectCssVars } from "./engine/styles.js";
import { setupTriggers } from "./engine/triggers.js";
import {
  CSS_ANIMATIONS,
  ANIMATION_REGISTRY,
  type AnimationDef,
  type EngineType,
} from "./engine/registry.js";

export type { AnimationDef, EngineType };
export { CSS_ANIMATIONS, ANIMATION_REGISTRY };

let _initialized = false;

/**
 * Initialize the FlowG Core (CSS) engine.
 * Scans the DOM for `[data-flowg-anim]` elements and sets up
 * IntersectionObserver-based class toggling.
 *
 * This is called automatically on import. You can also call it
 * manually if needed — safe to call multiple times.
 */
export function initCore(): void {
  if (_initialized) return;
  _initialized = true;

  if (typeof window === "undefined") return;

  // Wait for DOM if not ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _setup);
  } else {
    _setup();
  }
}

function _setup(): void {
  _scanAndInit();
  _observeNewElements();
}

/**
 * Scan all existing [data-flowg-anim] elements and set up observers / triggers.
 */
function _scanAndInit(): void {
  const allElements =
    document.querySelectorAll<HTMLElement>("[data-flowg-anim]");

  // Handle viewport-triggered animations
  createObserver((el, _animName) => {
    // Only handle CSS animations; skip GSAP-handled elements
    if (el.classList.contains("flowg-js-handled")) return;

    injectCssVars(el);
    el.classList.add("flowg-active");
  });

  // Handle hover/click triggers
  setupTriggers(allElements);
}

/**
 * Watch for dynamically added [data-flowg-anim] elements via MutationObserver.
 * This ensures elements added after initial load (e.g. SPA navigation,
 * lazy-loaded content) are automatically animated.
 */
function _observeNewElements(): void {
  if (typeof MutationObserver === "undefined") return;

  const mo = new MutationObserver((mutations) => {
    let hasNew = false;

    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        const el = node as HTMLElement;

        // Check the element itself
        if (el.hasAttribute("data-flowg-anim") && !el.classList.contains("flowg-active")) {
          _initElement(el);
          hasNew = true;
        }

        // Check descendants
        const children = el.querySelectorAll<HTMLElement>(
          "[data-flowg-anim]:not(.flowg-active)"
        );
        children.forEach((child) => {
          _initElement(child);
          hasNew = true;
        });
      }
    }
  });

  mo.observe(document.body, { childList: true, subtree: true });
}

/**
 * Initialize a single dynamically-added element.
 */
function _initElement(el: HTMLElement): void {
  // Skip GSAP-handled elements
  if (el.classList.contains("flowg-js-handled")) return;

  const trigger = el.dataset.flowgTrigger || "viewport";

  injectCssVars(el);

  if (trigger === "viewport") {
    // Set up a single-element IntersectionObserver
    const offset = el.dataset.flowgOffset;
    const rootMargin = offset
      ? `0px 0px -${offset.startsWith("-") ? offset.slice(1) : offset} 0px`
      : "0px";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            injectCssVars(entry.target as HTMLElement);
            (entry.target as HTMLElement).classList.add("flowg-active");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin, threshold: 0.1 }
    );
    observer.observe(el);
  } else if (trigger === "hover") {
    el.addEventListener("mouseenter", () => el.classList.add("flowg-active"), {
      once: true,
    });
  } else if (trigger === "click") {
    el.addEventListener("click", () => el.classList.add("flowg-active"), {
      once: true,
    });
  }
}

/**
 * Manually trigger a FlowG animation on an element.
 * Useful for programmatic control.
 */
export function activate(el: HTMLElement): void {
  injectCssVars(el);
  el.classList.add("flowg-active");
}

/**
 * Reset an element to its pre-animation state.
 */
export function reset(el: HTMLElement): void {
  el.classList.remove("flowg-active");
}

// ==========================================================
// Auto-init: runs automatically when this module is imported.
// ==========================================================
initCore();
