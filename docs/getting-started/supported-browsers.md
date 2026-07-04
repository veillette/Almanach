---
title: Supported Browsers
description: Browser/platform support matrix and graceful-degradation considerations.
category: getting-started
tags: [browsers, compatibility, deployment]
status: complete
related:
  - /getting-started/running-and-building-a-simulation
  - /guides/scenery-basics
prerequisites:
  - /getting-started/installation-and-setup
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Supported Browsers

SceneryStack simulations target modern evergreen browsers on desktop and mobile — the same browsers PhET's own published sims support. Because `scenery` renders through Canvas, SVG, and WebGL rather than a single fixed technology, most compatibility differences are handled by scenery's renderer selection rather than by your application code.

## The platform matrix

| Platform | Support |
| --- | --- |
| Chrome / Chromium (desktop & Android) | Fully supported |
| Firefox (desktop & Android) | Fully supported |
| Safari (desktop & iOS/iPadOS) | Fully supported, including `mobileSafari` |
| Edge (Chromium-based) | Fully supported |
| Internet Explorer | Not supported |

`phet-core`'s `platform` object gives you runtime feature/browser detection when you need to special-case something (a workaround for a specific engine quirk, not a support gate):

```ts
import { platform } from 'scenerystack/phet-core';

if ( platform.safari ) {
  // e.g. work around a Safari-specific rendering quirk
}
```

| Property | Detects |
| --- | --- |
| `platform.safari` | Any Safari, including mobile (`platform.mobileSafari`) |
| `platform.firefox` | Firefox, desktop or mobile |
| `platform.chromium` | Chrome/Chromium-based browsers (excludes Edge) |
| `platform.edge` | Chromium-based Edge |
| `platform.android` | Android's WebView/browser |
| `platform.ie` | Internet Explorer (present for detection only — not a supported target) |

## Graceful degradation via renderer fallback

Every `Node` has a `renderer` option — `'svg' | 'canvas' | 'webgl' | 'dom' | null` — that scenery uses as a hint, not a hard requirement. Leaving it `null` (the default) lets scenery pick the best available backend per-subtree and fall back automatically if, say, WebGL isn't available:

```ts
import { Node } from 'scenerystack/scenery';

const heavyNode = new Node( {
  renderer: 'webgl' // hint only; scenery falls back to canvas/svg if WebGL is unavailable
} );
```

::: tip Don't force a renderer unless you've measured a problem
The historical `platform.firefox` example in scenery's own source (`if (platform.firefox) { node.renderer = 'canvas'; }`) is a workaround for a specific old performance issue, not a general pattern. Leave `renderer` unset by default; only pin it after profiling shows a specific subtree needs a specific backend.
:::

## Where to go next

- [Scenery Basics](/guides/scenery-basics) — how the Node tree maps to Canvas/SVG/WebGL output
- [Running and Building a Simulation](/getting-started/running-and-building-a-simulation) — the build step that ships to these browsers
