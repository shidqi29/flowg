# FlowG

**Zero-bloat, attribute-driven animation library.**
One import — CSS animations load instantly, GSAP loads on demand.

[![npm version](https://img.shields.io/npm/v/flowgeneration.svg)](https://www.npmjs.com/package/flowgeneration)
[![gzip size](https://img.shields.io/bundlephobia/minzip/flowgeneration)](https://bundlephobia.com/package/flowgeneration)
[![license](https://img.shields.io/npm/l/flowgeneration.svg)](./LICENSE)

---

## Features

- 🪶 **Smart Loading** — CSS animations ~3KB gzipped. GSAP loads only when needed.
- 🎬 **GSAP Included** — Text stagger, scroll scrub, physics bounce — no separate install.
- 📐 **Attribute-driven** — No JavaScript needed. Just `data-flowg-*` attributes.
- 🎯 **Plugin-aware** — ScrollTrigger and other GSAP plugins load only when an animation uses them.
- 🎛️ **Configurable** — Duration, delay, easing, trigger via data attributes.

## Installation

```bash
npm install flowgeneration
# or
pnpm add flowgeneration
# or
yarn add flowgeneration
```

> GSAP is bundled — no separate install needed.

## Quick Start

Just import — it auto-initializes. No setup function needed.

```js
import "flowgeneration";
import "flowgeneration/style.css";
```

```html
<!-- CSS animation — loads instantly -->
<div data-flowg-anim="fade-up" data-flowg-duration="0.6">Hello World</div>

<!-- GSAP animation — GSAP loaded on demand -->
<div data-flowg-anim="text-stagger" data-flowg-duration="0.8">
  Staggered text reveal
</div>
```

### Via CDN (Script Tag)

No init call required — the script auto-detects `data-flowg-*` elements.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/style.css" />
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/flowg.js"></script>

<div data-flowg-anim="fade-up">Content</div>
```

### Dynamic Elements

FlowG automatically watches for new elements added to the DOM (via MutationObserver). Elements added after page load — from SPA navigation, lazy loading, or JavaScript — are animated automatically.

## How Smart Loading Works

FlowG scans the page for `data-flowg-anim` attributes:

1. **CSS animations** (`fade-up`, `blur-in`, etc.) — handled with pure CSS transitions + IntersectionObserver. Zero GSAP cost.
2. **GSAP animations** (`split-text`, `scroll-scrub`, etc.) — GSAP core is dynamically imported only if a GSAP animation is found.
3. **GSAP plugins** (e.g. ScrollTrigger) — loaded only when a specific animation needs them (e.g. `scroll-scrub`).

If your page only uses CSS animations, **no GSAP code is loaded at all**.

## API — `data-flowg-*` Attributes

| Attribute             | Values                                  | Description                  |
| :-------------------- | :-------------------------------------- | :--------------------------- |
| `data-flowg-anim`     | `fade-up`, `blur-in`, `text-stagger`, … | **Required.** Animation name |
| `data-flowg-duration` | `0.5`, `1s`                             | Animation duration           |
| `data-flowg-delay`    | `0.2`                                   | Delay before start           |
| `data-flowg-ease`     | `ease-out`, `power2.out`                | CSS or GSAP easing           |
| `data-flowg-offset`   | `20%`                                   | Viewport trigger offset      |
| `data-flowg-trigger`  | `viewport`, `hover`, `click`            | What starts the animation    |

## CSS Animations

These use the lightweight CSS layer — no GSAP loaded:

`fade-up` · `fade-down` · `fade-left` · `fade-right` · `fade-in` · `zoom-in` · `zoom-out` · `slide-up` · `slide-down` · `slide-left` · `slide-right` · `flip-up` · `flip-down` · `flip-left` · `flip-right` · `blur-in` · `blur-up` · `rotate-in` · `bounce-in`

## GSAP Animations

These trigger on-demand GSAP loading:

`split-text` · `text-stagger` · `typewriter` · `scroll-scrub`\* · `physics-bounce` · `stagger-up` · `stagger-fade` · `counter`

\* _scroll-scrub also loads the ScrollTrigger plugin automatically_

## Programmatic API

```typescript
import {
  activate,
  reset,
  CSS_ANIMATIONS,
  GSAP_ANIMATIONS,
  ANIMATION_REGISTRY,
} from "flowgeneration";

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

Paste this in **Project Settings → Custom Code → Footer Code**:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/flowgeneration@latest/dist/flowg.js"></script>
```

> That's it — one script handles everything. GSAP loads automatically if needed.

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

Works in all browsers supporting `IntersectionObserver` and dynamic `import()` (all modern browsers).

## Development

```bash
# Build
pnpm build

# Dev (watch mode)
pnpm dev
```

## License

[MIT](./LICENSE)
