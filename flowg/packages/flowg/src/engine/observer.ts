// ==========================================================
// FlowG — Shared IntersectionObserver
// Watches elements with [data-flowg-anim] and fires callbacks
// when they enter the viewport.
// ==========================================================

export interface ObserverOptions {
  /** Root margin string, e.g. "0px 0px -20% 0px" */
  rootMargin?: string;
  /** Threshold(s) for triggering */
  threshold?: number | number[];
  /** Run animation only once (default: true) */
  once?: boolean;
}

export type OnIntersectCallback = (el: HTMLElement, animName: string) => void;

/**
 * Parse the `data-flowg-offset` attribute into a rootMargin string.
 * E.g. "20%" → "0px 0px -20% 0px" (trigger when element is 20% into viewport)
 */
function parseOffset(offset: string | undefined): string {
  if (!offset) return "0px";
  // Convert "20%" to "-20%" for bottom margin
  const value = offset.startsWith("-") ? offset : `-${offset}`;
  return `0px 0px ${value} 0px`;
}

/**
 * Create the shared observer that watches all FlowG elements.
 */
export function createObserver(
  onIntersect: OnIntersectCallback,
  options: ObserverOptions = {}
): void {
  const { once = true } = options;

  const elements = document.querySelectorAll<HTMLElement>("[data-flowg-anim]");
  if (elements.length === 0) return;

  // Group elements by their offset for efficient observer reuse
  const offsetGroups = new Map<string, HTMLElement[]>();

  elements.forEach((el) => {
    const offset = el.dataset.flowgOffset || "";
    if (!offsetGroups.has(offset)) {
      offsetGroups.set(offset, []);
    }
    offsetGroups.get(offset)!.push(el);
  });

  // Create one observer per offset group
  offsetGroups.forEach((groupElements, offset) => {
    const rootMargin = parseOffset(offset || undefined);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const animName = el.dataset.flowgAnim;

            if (animName) {
              onIntersect(el, animName);
            }

            if (once) {
              observer.unobserve(el);
            }
          }
        });
      },
      {
        rootMargin,
        threshold: options.threshold ?? 0.1,
      }
    );

    groupElements.forEach((el) => observer.observe(el));
  });
}

/**
 * Observe a single element for viewport entry.
 */
export function observeElement(
  el: HTMLElement,
  onIntersect: (el: HTMLElement) => void,
  options: ObserverOptions = {}
): IntersectionObserver {
  const offset = el.dataset.flowgOffset;
  const rootMargin = parseOffset(offset);
  const { once = true } = options;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onIntersect(entry.target as HTMLElement);
          if (once) {
            observer.unobserve(entry.target);
          }
        }
      });
    },
    {
      rootMargin,
      threshold: options.threshold ?? 0.1,
    }
  );

  observer.observe(el);
  return observer;
}
