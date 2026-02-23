Here is the updated **Product Requirements & Technical Specification**.

This version incorporates the specific `data-flowg-` naming convention and creates a **Hybrid Architecture** to ensure GSAP is only loaded/used when necessary, keeping the library lightweight for CSS-only users.

---

# Project Specification: FlowG Animation Library (Hybrid Engine)

## 1. Core Philosophy

**"Zero-Bloat Attributes"**
The library operates on a split-engine logic. It provides a single uniform API (`data-flowg-*`), but underneath, it intelligently separates lightweight CSS class toggling from heavy JavaScript (GSAP) animations.

**Naming Convention:** All attributes use the prefix `data-flowg-`.

---

## 2. Technical Architecture (The Hybrid Stack)

### 2.1 The Library (Monorepo Package: `packages/flowg`)

To satisfy the requirement of **"No GSAP unless needed,"** we will use **Vite Multi-Entry Build**. We will output two distinct bundles.

1.  **`flowg-core.js` (The Lightweight / CSS Engine)**
    - **Size:** ~2KB (Gzipped).
    - **Dependency:** None.
    - **Mechanism:** Uses `IntersectionObserver` to watch elements. When in view, it simply adds a CSS class (e.g., `.flowg-active`) and handles CSS-variable injection for duration/delay.
    - **Use Case:** Simple fades, slides, zooms.

2.  **`flowg-pro.js` (The Advanced / GSAP Engine)**
    - **Size:** ~25KB+ (includes GSAP).
    - **Dependency:** GSAP (bundled inside or peer-dependency).
    - **Mechanism:** Uses the same Observer, but intercepts specific animation names to run `gsap.fromTo()` logic instead of just adding a class.
    - **Use Case:** Staggered reveals, text scrubbing, complex timelines.

### 2.2 The Web App (Showcase)

- **Stack:** Next.js + Tailwind.
- **Role:** Documentation and "Configurator."
- **Smart Preview:** The playground will detect which engine is required for the selected animation and tell the user: _"For this animation, use the Pro script"_ vs _"This is available in Core"_.

---

## 3. The API Design (`data-flowg-`)

### 3.1 Global Configuration

| Attribute             | Value Example                                     | Description                                                |
| :-------------------- | :------------------------------------------------ | :--------------------------------------------------------- |
| `data-flowg-anim`     | `fade-up`, `blur-in` (CSS) OR `text-scrub` (GSAP) | **Required.** The name determines which engine handles it. |
| `data-flowg-duration` | `0.5`, `1s`                                       | Animation duration.                                        |
| `data-flowg-delay`    | `0.2`                                             | Delay before start.                                        |
| `data-flowg-ease`     | `ease-out`, `power2.out`                          | CSS Easing string or GSAP Easing string.                   |
| `data-flowg-offset`   | `20%`                                             | Trigger when element is 20% into viewport.                 |
| `data-flowg-trigger`  | `viewport` (default), `hover`, `click`            | What starts the animation.                                 |

---

## 4. Implementation Strategy

### 4.1 Folder Structure

```text
/packages/flowg
  ├── package.json
  ├── vite.config.ts        // Configured for Multi-Entry
  └── /src
      ├── /css
      │    ├── _base.scss   // Common styles
      │    └── _anims.scss  // Keyframes (fade-up, etc.)
      ├── /engine
      │    ├── observer.ts  // Shared IntersectionObserver logic
      │    └── styles.ts    // Injects CSS into <head> automatically
      ├── index.core.ts     // ENTRY 1: CSS-only logic
      └── index.pro.ts      // ENTRY 2: Imports Core + GSAP logic
```

### 4.2 The "Core" Engine (CSS Only)

This script does not import GSAP. It injects a generic CSS stylesheet into the head and handles the class toggling.

```typescript
// packages/flowg/src/index.core.ts

import "./css/main.scss"; // Vite will extract this to a CSS file or inject it

const initCore = () => {
  const elements = document.querySelectorAll("[data-flowg-anim]");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const anim = el.dataset.flowgAnim; // Read attribute

        // 1. Set CSS Variables for dynamic control
        const duration = el.dataset.flowgDuration || "0.5s";
        const delay = el.dataset.flowgDelay || "0s";

        el.style.setProperty("--fg-dur", duration);
        el.style.setProperty("--fg-del", delay);

        // 2. Add the trigger class (CSS handles the rest)
        el.classList.add("flowg-active");

        observer.unobserve(el); // Run once
      }
    });
  });

  elements.forEach((el) => observer.observe(el));
};

export { initCore };
```

### 4.3 The "Pro" Engine (GSAP Hybrid)

This script imports the Core, but extends it. It checks a lookup table. If the animation is "GSAP-only", it intercepts it.

```typescript
// packages/flowg/src/index.pro.ts
import { initCore } from "./index.core";
import gsap from "gsap";

// List of animations that REQUIRE Javascript/GSAP
const GSAP_ANIMS = ["split-text", "scroll-scrub", "physics-bounce"];

const initPro = () => {
  // 1. Run Core for simple stuff (Performance optimization)
  initCore();

  // 2. Handle GSAP specific elements
  const elements = document.querySelectorAll("[data-flowg-anim]");

  elements.forEach((el) => {
    const animName = el.getAttribute("data-flowg-anim");

    if (GSAP_ANIMS.includes(animName)) {
      // Prevent CSS logic from interfering
      el.classList.add("flowg-js-handled");

      // Execute GSAP Logic
      gsap.from(el, {
        opacity: 0,
        y: 50,
        duration: parseFloat(el.dataset.flowgDuration || 1),
      });
    }
  });
};

export { initPro };
```

---

## 5. Build & Distribution Plan

### 5.1 Vite Configuration (The Magic Sauce)

You need to tell Vite to build two separate versions.

```typescript
// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        "flowg-core": "./src/index.core.ts", // Output: flowg-core.js
        "flowg-pro": "./src/index.pro.ts", // Output: flowg-pro.js
      },
      formats: ["es", "iife"], // IIFE is for <script> tags
      name: "FlowG",
    },
    rollupOptions: {
      // Ensure GSAP is bundled inside Pro, but NOT inside Core
      external: (id) =>
        id.includes("gsap") && process.env.BUILD_TARGET === "core",
    },
  },
});
```

### 5.2 User Instructions (Generated by Web App)

**Scenario A: User selects "Fade Up" (CSS Animation)**
The Web App displays:

> "This is a lightweight animation."

```html
<!-- Load CSS Engine (2KB) -->
<script src="https://cdn.your-site.com/flowg-core.min.js"></script>
<div data-flowg-anim="fade-up">Content</div>
```

**Scenario B: User selects "Text Stagger" (GSAP Animation)**
The Web App displays:

> "This animation requires the Pro Engine."

```html
<!-- Load Pro Engine (Contains GSAP) -->
<script src="https://cdn.your-site.com/flowg-pro.min.js"></script>
<div data-flowg-anim="text-stagger">Content</div>
```

---

## 6. Next.js Web App Requirements

1.  **Attribute Generator:**
    - Input fields mapped to `data-flowg-${key}`.
    - Updating the inputs updates the live preview component.
2.  **Engine Badge:**
    - Every card in the gallery must have a badge: `CSS` (Green) or `GSAP` (Purple).
3.  **Code Export:**
    - A function `generateScriptTag(animationType)` that returns the correct script link (Core vs Pro) based on the animation selected.

## 7. Summary of Changes

1.  **Prefix:** All attributes updated to `data-flowg-`.
2.  **CSS Handling:** Core library injects styles or loads a tiny CSS file; logic simply adds `.flowg-active`.
3.  **GSAP Handling:** Separated into a `pro` entry point. Users who don't use GSAP animations don't pay the performance penalty of downloading the library.
