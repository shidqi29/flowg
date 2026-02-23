# FlowG

**Zero-bloat, attribute-driven animation library.**
CSS-first with optional GSAP power.

[![npm version](https://img.shields.io/npm/v/flowgeneration.svg)](https://www.npmjs.com/package/flowgeneration)
[![gzip size](https://img.shields.io/bundlephobia/minzip/flowgeneration)](https://bundlephobia.com/package/flowgeneration)
[![license](https://img.shields.io/npm/l/flowgeneration.svg)](./LICENSE)

---

## Features

- 🪶 **Tiny Core** — ~2KB gzipped CSS-only engine, zero dependencies
- 🎬 **Pro Engine** — Optional GSAP-powered animations (text stagger, scroll scrub, physics)
- 📐 **Attribute-driven** — No JavaScript needed for simple animations
- 🎯 **Smart Observer** — IntersectionObserver with configurable offsets
- 🎛️ **Configurable** — Duration, delay, easing, trigger via `data-flowg-*` attributes

## Installation

```bash
npm install flowgeneration
# or
pnpm add flowgeneration
# or
yarn add flowgeneration
```

For GSAP-powered animations (Pro engine):

```bash
npm install flowgeneration gsap
```

## Quick Start

### CSS-Only (Core Engine)

```js
import { initCore } from "flowgeneration/core";
import "flowgeneration/style.css";

initCore();
```

```html
<div data-flowg-anim="fade-up" data-flowg-duration="0.6">Hello World</div>
```

### With GSAP (Pro Engine)

```js
import { initPro } from "flowgeneration/pro";
import "flowgeneration/style.css";

initPro();
```

```html
<div data-flowg-anim="text-stagger" data-flowg-duration="0.8">
  Staggered text reveal
</div>
```

### Via CDN (Script Tag)

```html
<!-- Core only (~2KB gzip) -->
<link rel="stylesheet" href="https://unpkg.com/flowgeneration/dist/style.css" />
<script type="module">
  import { initCore } from "https://unpkg.com/flowgeneration/dist/flowg-core.js";
  initCore();
</script>

<div data-flowg-anim="fade-up">Content</div>
```

## API — `data-flowg-*` Attributes

| Attribute             | Values                                  | Description                  |
| :-------------------- | :-------------------------------------- | :--------------------------- |
| `data-flowg-anim`     | `fade-up`, `blur-in`, `text-stagger`, … | **Required.** Animation name |
| `data-flowg-duration` | `0.5`, `1s`                             | Animation duration           |
| `data-flowg-delay`    | `0.2`                                   | Delay before start           |
| `data-flowg-ease`     | `ease-out`, `power2.out`                | CSS or GSAP easing           |
| `data-flowg-offset`   | `20%`                                   | Viewport trigger offset      |
| `data-flowg-trigger`  | `viewport`, `hover`, `click`            | What starts the animation    |

## CSS Animations (Core)

These work with the lightweight Core engine — no GSAP required:

`fade-up` · `fade-down` · `fade-left` · `fade-right` · `fade-in` · `zoom-in` · `zoom-out` · `slide-up` · `slide-down` · `slide-left` · `slide-right` · `flip-up` · `flip-left` · `blur-in` · `blur-up` · `rotate-in` · `rotate-left` · `bounce-in` · `bounce-up`

## GSAP Animations (Pro)

These require the Pro engine with GSAP installed:

`split-text` · `text-stagger` · `typewriter` · `scroll-scrub` · `physics-bounce` · `stagger-up` · `stagger-fade` · `counter`

## Programmatic API

```typescript
import {
  initCore,
  activate,
  reset,
  CSS_ANIMATIONS,
  ANIMATION_REGISTRY,
} from "flowgeneration/core";
import { initPro, GSAP_ANIMATIONS } from "flowgeneration/pro";

// Manually trigger an element
activate(document.querySelector("#my-el"));

// Reset to pre-animation state
reset(document.querySelector("#my-el"));
```

## Webflow Integration

FlowG works with Webflow — no npm required. Add the scripts via **Project Settings → Custom Code**.

### Step 1: Add Stylesheet (Head Code)

Paste this in **Project Settings → Custom Code → Head Code**:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/style.css" />
```

### Step 2: Add Script (Footer Code)

**For CSS animations only (Core):**

Paste this in **Project Settings → Custom Code → Footer Code**:

```html
<script type="module">
  import { initCore } from "https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/flowg-core.js";
  initCore();
</script>
```

**For GSAP-powered animations (Pro):**

You must add the GSAP library **before** FlowG Pro. Paste this in **Footer Code**:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script type="module">
  import { initPro } from "https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/flowg-pro.js";
  initPro();
</script>
```

> ⚠️ GSAP must load **before** FlowG Pro. Keep the order above.

### Step 3: Add Attributes to Elements

In the Webflow Designer:

1. Select any element
2. Go to **Element Settings** (⚙️ icon)
3. Under **Custom Attributes**, add:

| Name                  | Value                             |
| --------------------- | --------------------------------- |
| `data-flowg-anim`     | `fade-up` (or any animation name) |
| `data-flowg-duration` | `0.6` (optional)                  |
| `data-flowg-delay`    | `0.2` (optional)                  |
| `data-flowg-ease`     | `ease-out` (optional)             |

### Webflow Tips

- **One-time setup:** Steps 1 & 2 only need to be done once per project
- **Per-element:** Step 3 is done on each element you want to animate
- **Preview:** Use Webflow's preview mode or publish to see animations
- **CMS items:** Attributes work on CMS-powered elements too

## TypeScript

Full type declarations are included. All exports are fully typed.

## Browser Support

Works in all browsers supporting `IntersectionObserver` (all modern browsers).

## Development

```bash
# Build
pnpm build

# Dev (watch mode)
pnpm dev
```

## License

[MIT](./LICENSE)
