# FlowG

**Zero-bloat, attribute-driven animation library.**
CSS-first with optional GSAP power.

[![npm version](https://img.shields.io/npm/v/flowg.svg)](https://www.npmjs.com/package/flowg)
[![gzip size](https://img.shields.io/bundlephobia/minzip/flowg)](https://bundlephobia.com/package/flowg)
[![license](https://img.shields.io/npm/l/flowg.svg)](./LICENSE)

---

## Features

- 🪶 **Tiny Core** — ~2KB gzipped CSS-only engine, zero dependencies
- 🎬 **Pro Engine** — Optional GSAP-powered animations (text stagger, scroll scrub, physics)
- 📐 **Attribute-driven** — No JavaScript needed for simple animations
- 🎯 **Smart Observer** — IntersectionObserver with configurable offsets
- 🎛️ **Configurable** — Duration, delay, easing, trigger via `data-flowg-*` attributes

## Installation

```bash
npm install flowg
# or
pnpm add flowg
# or
yarn add flowg
```

For GSAP-powered animations (Pro engine):

```bash
npm install flowg gsap
```

## Quick Start

### CSS-Only (Core Engine)

```js
import { initCore } from "flowg/core";
import "flowg/style.css";

initCore();
```

```html
<div data-flowg-anim="fade-up" data-flowg-duration="0.6">Hello World</div>
```

### With GSAP (Pro Engine)

```js
import { initPro } from "flowg/pro";
import "flowg/style.css";

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
<link rel="stylesheet" href="https://unpkg.com/flowg/dist/style.css" />
<script type="module">
  import { initCore } from "https://unpkg.com/flowg/dist/flowg-core.js";
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
} from "flowg/core";
import { initPro, GSAP_ANIMATIONS } from "flowg/pro";

// Manually trigger an element
activate(document.querySelector("#my-el"));

// Reset to pre-animation state
reset(document.querySelector("#my-el"));
```

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
