// ==========================================================
// FlowG — Unified Animation Engine
//
// A single import handles both CSS and GSAP animations.
// CSS animations work instantly (~2KB). GSAP is only loaded
// dynamically when a GSAP animation is detected on the page.
// Individual GSAP plugins (e.g. ScrollTrigger) are loaded
// only when an animation that needs them is found.
//
// Usage (CDN):
//   <link rel="stylesheet" href="...flowgeneration/dist/style.css" />
//   <script type="module" src="...flowgeneration/dist/flowg.js"></script>
//
// Usage (npm):
//   import "flowgeneration";
//   import "flowgeneration/style.css";
//
//   <div data-flowg-anim="fade-up">Hello World</div>
//   <div data-flowg-anim="scroll-scrub">GSAP loaded on demand</div>
// ==========================================================

import "./css/main.scss";

import { createObserver } from "./engine/observer.js";
import { injectCssVars } from "./engine/styles.js";
import { setupTriggers } from "./engine/triggers.js";
import {
  CSS_ANIMATIONS,
  GSAP_ANIMATIONS,
  ANIMATION_REGISTRY,
  isGsapAnimation,
  isCssAnimation,
  getEngineType,
  getRequiredPlugins,
  type AnimationDef,
  type EngineType,
  type GsapPlugin,
} from "./engine/registry.js";

export type { AnimationDef, EngineType, GsapPlugin };
export {
  CSS_ANIMATIONS,
  GSAP_ANIMATIONS,
  ANIMATION_REGISTRY,
  isGsapAnimation,
  isCssAnimation,
  getEngineType,
  getRequiredPlugins,
};

let _initialized = false;

// ==========================================================
// Public API
// ==========================================================

/**
 * Initialize FlowG.
 * Scans the DOM for `[data-flowg-anim]` elements, sets up
 * CSS class toggling for CSS animations, and dynamically loads
 * GSAP only for elements that require it.
 *
 * This is called automatically on import. Safe to call multiple times.
 */
export function init(): void {
  if (_initialized) return;
  _initialized = true;

  if (typeof window === "undefined") return;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", _setup);
  } else {
    _setup();
  }
}

/**
 * Manually trigger a FlowG animation on an element.
 */
export function activate(el: HTMLElement): void {
  const animName = el.dataset.flowgAnim;
  if (animName && isGsapAnimation(animName)) {
    _runGsapAnimation(el, animName);
  } else {
    injectCssVars(el);
    el.classList.add("flowg-active");
  }
}

/**
 * Reset an element to its pre-animation state.
 */
export function reset(el: HTMLElement): void {
  el.classList.remove("flowg-active");
  el.classList.remove("flowg-js-handled");
}

// ==========================================================
// Internal — Setup
// ==========================================================

function _setup(): void {
  _scanAndInit();
  _observeNewElements();
}

/**
 * Scan all [data-flowg-anim] elements and set up the appropriate engine.
 */
function _scanAndInit(): void {
  const allElements =
    document.querySelectorAll<HTMLElement>("[data-flowg-anim]");

  // --- CSS animations: set up IntersectionObserver ---
  createObserver((el, _animName) => {
    if (el.classList.contains("flowg-js-handled")) return;
    injectCssVars(el);
    el.classList.add("flowg-active");
  });

  // Handle hover/click triggers for CSS animations
  setupTriggers(allElements);

  // --- GSAP animations: collect required plugins, lazy-load ---
  _initGsapAnimations(allElements);
}

/**
 * Detect which GSAP animations exist on the page, determine which
 * plugins they need, load everything in one batch, then wire up handlers.
 */
async function _initGsapAnimations(
  elements: NodeListOf<HTMLElement>,
): Promise<void> {
  // Collect all GSAP elements and the plugins they need
  const gsapElements: HTMLElement[] = [];
  const requiredPlugins = new Set<GsapPlugin>();

  elements.forEach((el) => {
    const animName = el.dataset.flowgAnim;
    if (!animName || !isGsapAnimation(animName)) return;
    if (el.classList.contains("flowg-js-handled")) return;

    gsapElements.push(el);
    // Mark immediately so CSS engine skips it
    el.classList.add("flowg-js-handled");

    // Collect required plugins
    const plugins = getRequiredPlugins(animName);
    plugins.forEach((p) => requiredPlugins.add(p));
  });

  // No GSAP animations found — don't load GSAP at all
  if (gsapElements.length === 0) return;

  // Dynamically load gsap core + only the needed plugins
  const { loadGsapPlugins, loadGsapCore } = await import(
    "./engine/gsap-loader.js"
  );

  let gsap: typeof import("gsap").default;
  if (requiredPlugins.size > 0) {
    gsap = await loadGsapPlugins([...requiredPlugins]);
  } else {
    gsap = await loadGsapCore();
  }

  // Load handlers
  const { GSAP_HANDLERS, readVars } = await import(
    "./engine/gsap-handlers.js"
  );

  // Wire up each element
  gsapElements.forEach((el) => {
    const animName = el.dataset.flowgAnim!;
    const trigger = el.dataset.flowgTrigger || "viewport";
    const vars = readVars(el);
    const handler = GSAP_HANDLERS[animName];

    if (!handler) {
      gsap.from(el, { opacity: 0, y: 50, ...vars });
      return;
    }

    if (trigger === "viewport") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              handler(entry.target as HTMLElement, gsap, vars);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: el.dataset.flowgOffset
            ? `0px 0px -${el.dataset.flowgOffset} 0px`
            : "0px",
          threshold: 0.1,
        },
      );
      observer.observe(el);
    } else if (trigger === "hover") {
      el.addEventListener("mouseenter", () => handler(el, gsap, vars), {
        once: true,
      });
    } else if (trigger === "click") {
      el.addEventListener("click", () => handler(el, gsap, vars), {
        once: true,
      });
    }
  });
}

/**
 * Run a GSAP animation on a single element (for dynamic/programmatic use).
 */
async function _runGsapAnimation(
  el: HTMLElement,
  animName: string,
): Promise<void> {
  el.classList.add("flowg-js-handled");

  const plugins = getRequiredPlugins(animName);
  const { loadGsapPlugins, loadGsapCore } = await import(
    "./engine/gsap-loader.js"
  );

  const gsap =
    plugins.length > 0
      ? await loadGsapPlugins(plugins)
      : await loadGsapCore();

  const { GSAP_HANDLERS, readVars } = await import(
    "./engine/gsap-handlers.js"
  );

  const handler = GSAP_HANDLERS[animName];
  const vars = readVars(el);

  if (handler) {
    handler(el, gsap, vars);
  } else {
    gsap.from(el, { opacity: 0, y: 50, ...vars });
  }
}

// ==========================================================
// MutationObserver for dynamically added elements
// ==========================================================

function _observeNewElements(): void {
  if (typeof MutationObserver === "undefined") return;

  const mo = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        const el = node as HTMLElement;

        if (
          el.hasAttribute("data-flowg-anim") &&
          !el.classList.contains("flowg-active") &&
          !el.classList.contains("flowg-js-handled")
        ) {
          _initSingleElement(el);
        }

        const children = el.querySelectorAll<HTMLElement>(
          "[data-flowg-anim]:not(.flowg-active):not(.flowg-js-handled)",
        );
        children.forEach((child) => _initSingleElement(child));
      }
    }
  });

  mo.observe(document.body, { childList: true, subtree: true });
}

/**
 * Initialize a single dynamically-added element.
 */
function _initSingleElement(el: HTMLElement): void {
  const animName = el.dataset.flowgAnim;
  if (!animName) return;

  // GSAP animation — load and run
  if (isGsapAnimation(animName)) {
    _runGsapAnimation(el, animName);
    return;
  }

  // CSS animation
  const trigger = el.dataset.flowgTrigger || "viewport";
  injectCssVars(el);

  if (trigger === "viewport") {
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
      { rootMargin, threshold: 0.1 },
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

// ==========================================================
// Auto-init: runs automatically when this module is imported.
// ==========================================================
init();
