// ==========================================================
// FlowG — Trigger Handler
// Handles non-viewport triggers (hover, click)
// ==========================================================

import { injectCssVars } from "./styles.js";

/**
 * Setup hover/click triggers for elements that don't use viewport detection.
 * These elements start hidden and reveal on user interaction.
 */
export function setupTriggers(
  elements: NodeListOf<HTMLElement>,
  onActivate?: (el: HTMLElement, animName: string) => void
): void {
  elements.forEach((el) => {
    const trigger = el.dataset.flowgTrigger;
    const animName = el.dataset.flowgAnim;
    if (!trigger || trigger === "viewport" || !animName) return;

    injectCssVars(el);

    if (trigger === "hover") {
      el.addEventListener(
        "mouseenter",
        () => {
          el.classList.add("flowg-active");
          onActivate?.(el, animName);
        },
        { once: true }
      );
    }

    if (trigger === "click") {
      el.addEventListener(
        "click",
        () => {
          el.classList.add("flowg-active");
          onActivate?.(el, animName);
        },
        { once: true }
      );
    }
  });
}
