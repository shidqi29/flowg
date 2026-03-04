// ==========================================================
// FlowG — GSAP Animation Handlers
// Each handler receives the element, gsap instance, and vars.
// Handlers are resolved lazily — they only run after gsap
// core (and any required plugins) have been dynamically loaded.
// ==========================================================

type GsapInstance = typeof import("gsap").default;

export type GsapHandler = (
  el: HTMLElement,
  gsap: GsapInstance,
  vars: Record<string, unknown>,
) => void;

/**
 * Read common animation properties from the element's data attributes.
 */
export function readVars(el: HTMLElement): Record<string, unknown> {
  const duration = parseFloat(el.dataset.flowgDuration || "0.6");
  const delay = parseFloat(el.dataset.flowgDelay || "0");
  const ease = el.dataset.flowgEase || "power2.out";

  return { duration, delay, ease };
}

/**
 * Registry of GSAP animation handlers.
 * Each key matches a `data-flowg-anim` value.
 */
export const GSAP_HANDLERS: Record<string, GsapHandler> = {
  "split-text": (el, gsap, vars) => {
    const text = el.textContent || "";
    el.innerHTML = text
      .split("")
      .map((char) =>
        char === " "
          ? `<span class="flowg-char">&nbsp;</span>`
          : `<span class="flowg-char">${char}</span>`,
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

  "text-stagger": (el, gsap, vars) => {
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

  typewriter: (el, gsap, vars) => {
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
        i * 0.05,
      );
    });
  },

  "scroll-scrub": (el, gsap, vars) => {
    // ScrollTrigger is guaranteed to be loaded by the plugin loader
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
  },

  "physics-bounce": (el, gsap, vars) => {
    gsap.from(el, {
      opacity: 0,
      y: -100,
      ease: "bounce.out",
      ...vars,
      duration: (vars.duration as number) || 1.2,
    });
  },

  "stagger-up": (el, gsap, vars) => {
    const children = el.children;
    gsap.from(children, {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      ...vars,
    });
    el.style.opacity = "1";
  },

  "stagger-fade": (el, gsap, vars) => {
    const children = el.children;
    gsap.from(children, {
      opacity: 0,
      stagger: 0.12,
      ...vars,
    });
    el.style.opacity = "1";
  },

  counter: (el, gsap, vars) => {
    const target = parseInt(el.textContent || "0", 10);
    el.textContent = "0";
    el.style.opacity = "1";

    gsap.to(el, {
      duration: (vars.duration as number) || 2,
      delay: (vars.delay as number) || 0,
      ease: (vars.ease as string) || "power1.out",
      textContent: target,
      snap: { textContent: 1 },
      onUpdate() {
        el.textContent = Math.round(
          parseFloat(el.textContent || "0"),
        ).toString();
      },
    });
  },
};
