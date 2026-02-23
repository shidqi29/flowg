# @repo/flowg

A zero-bloat, attribute-driven animation library with a hybrid CSS/GSAP engine.

## Architecture

FlowG provides two entry points:

| Bundle       | Size (gzip) | Dependencies | Use Case                                 |
| ------------ | ----------- | ------------ | ---------------------------------------- |
| `flowg-core` | ~2 KB       | None         | CSS transitions: fade, slide, zoom, blur |
| `flowg-pro`  | ~45 KB      | GSAP         | Text stagger, scroll scrub, counters     |

## Quick Start

### Core (CSS only)

```html
<link rel="stylesheet" href="path/to/style.css" />
<script type="module">
  import { initCore } from "@repo/flowg/core";
  initCore();
</script>

<div data-flowg-anim="fade-up" data-flowg-duration="0.6">Hello World</div>
```

### Pro (GSAP powered)

```html
<link rel="stylesheet" href="path/to/style.css" />
<script type="module">
  import { initPro } from "@repo/flowg/pro";
  initPro();
</script>

<div data-flowg-anim="text-stagger" data-flowg-duration="0.8">Hello World</div>
```

## API Attributes

| Attribute             | Example                      | Description                   |
| --------------------- | ---------------------------- | ----------------------------- |
| `data-flowg-anim`     | `fade-up`, `text-stagger`    | **Required.** Animation name. |
| `data-flowg-duration` | `0.5`, `1s`                  | Animation duration.           |
| `data-flowg-delay`    | `0.2`                        | Delay before start.           |
| `data-flowg-ease`     | `ease-out`, `power2.out`     | CSS or GSAP easing.           |
| `data-flowg-offset`   | `20%`                        | Viewport offset trigger.      |
| `data-flowg-trigger`  | `viewport`, `hover`, `click` | What starts the animation.    |

## CSS Animations (Core)

`fade-in` · `fade-up` · `fade-down` · `fade-left` · `fade-right` · `zoom-in` · `zoom-out` · `slide-up` · `slide-down` · `slide-left` · `slide-right` · `flip-up` · `flip-down` · `flip-left` · `flip-right` · `blur-in` · `blur-up` · `rotate-in` · `bounce-in`

## GSAP Animations (Pro)

`split-text` · `text-stagger` · `typewriter` · `scroll-scrub` · `physics-bounce` · `stagger-up` · `stagger-fade` · `counter`

## Programmatic API

```typescript
import { activate, reset } from "@repo/flowg/core";

// Manually trigger an element
activate(document.querySelector("#my-el"));

// Reset to pre-animation state
reset(document.querySelector("#my-el"));
```

## Development

```bash
# Build
pnpm build

# Dev (watch mode)
pnpm dev
```
