// ==========================================================
// FlowG Core — CSS-Only Animation Engine
// ~2KB gzipped. No external dependencies.
//
// Usage:
//   <script type="module">
//     import { initCore } from 'flowgeneration/core';
//     initCore();
//   </script>
//
//   <div data-flowg-anim="fade-up" data-flowg-duration="0.6">
//     Hello World
//   </div>
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
 * Safe to call multiple times — will only initialize once.
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
  const allElements =
    document.querySelectorAll<HTMLElement>("[data-flowg-anim]");

  // Handle viewport-triggered animations
  createObserver((el, animName) => {
    // Only handle CSS animations; skip GSAP-handled elements
    if (el.classList.contains("flowg-js-handled")) return;

    injectCssVars(el);
    el.classList.add("flowg-active");
  });

  // Handle hover/click triggers
  setupTriggers(allElements);
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

/**
 * Auto-init: if the script is loaded via a `<script>` tag (IIFE),
 * automatically initialize on DOMContentLoaded.
 */
if (typeof window !== "undefined" && typeof document !== "undefined") {
  // Auto-init for IIFE builds
  if (document.currentScript) {
    initCore();
  }
}
