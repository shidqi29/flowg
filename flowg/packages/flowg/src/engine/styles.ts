// ==========================================================
// FlowG — CSS Variable Injection
// Reads data-flowg-* attributes and sets CSS custom properties
// on each element for the CSS engine to use.
// ==========================================================

/**
 * Apply CSS custom properties from data attributes onto the element.
 * This bridges the data-flowg-* API to CSS variables used in transitions.
 */
export function injectCssVars(el: HTMLElement): void {
  const duration = el.dataset.flowgDuration;
  const delay = el.dataset.flowgDelay;
  const ease = el.dataset.flowgEase;

  if (duration) {
    // Normalize: if no unit, assume seconds
    const dur = /^\d+(\.\d+)?$/.test(duration) ? `${duration}s` : duration;
    el.style.setProperty("--fg-dur", dur);
  }

  if (delay) {
    const del = /^\d+(\.\d+)?$/.test(delay) ? `${delay}s` : delay;
    el.style.setProperty("--fg-del", del);
  }

  if (ease) {
    el.style.setProperty("--fg-ease", ease);
  }
}
