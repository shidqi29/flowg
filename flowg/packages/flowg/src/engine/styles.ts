// ==========================================================
// FlowG — CSS Variable Injection
// Reads data-flowg-* attributes and sets CSS custom properties
// on each element for the CSS engine to use.
// ==========================================================

/**
 * Detect GSAP-style easing strings (e.g. "power2.out", "bounce.out").
 * These are NOT valid CSS timing functions and would break transitions.
 */
function isGsapEasing(value: string): boolean {
  return /^(power|bounce|elastic|back|expo|circ|sine)\d?\./i.test(value);
}

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
    // GSAP easing strings are invalid CSS — skip setting so the
    // CSS fallback (ease-out) is used. The GSAP Pro engine handles
    // these natively via gsap.to().
    if (!isGsapEasing(ease)) {
      el.style.setProperty("--fg-ease", ease);
    }
  }
}
