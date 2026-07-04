---
title: PhetFont
description: The standard font class used across every SceneryStack simulation.
category: api
library: scenery-phet
tags: [scenery-phet, PhetFont, typography]
status: complete
related:
  - /api/scenery-phet/number-control
  - /api/scenery-phet/stopwatch-node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PhetFont

`PhetFont` (from `scenerystack/scenery-phet`) is a thin subclass of scenery's `Font` that applies PhET's standard font family and guarantees a `sans-serif` fallback. Simulations should use `PhetFont` everywhere instead of constructing a plain `Font`, so that every piece of text in the sim renders consistently and degrades gracefully if the preferred family isn't installed.

```ts
import { PhetFont } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
// Convenience form: just a size
const labelFont = new PhetFont( 16 );

// Full FontOptions form, same options as scenery's Font
const titleFont = new PhetFont( { size: 24, weight: 'bold' } );

text.font = labelFont;
```

## Constructor

```ts
new PhetFont( providedOptions?: number | string | FontOptions )
```

A bare `number` or `string` is treated as a convenience shorthand for `{ size: providedOptions }`; otherwise the argument is a normal scenery `FontOptions` object (`size`, `weight`, `style`, `family`, …).

## What it changes versus `Font`

| Behavior | Effect |
| --- | --- |
| `family` default | If you don't supply one, PhET's configured font family (from `sceneryPhetQueryParameters.fontFamily`) is used |
| Fallback guarantee | Whatever `family` ends up being (default or your own), `PhetFont` always appends `, sans-serif` so text never falls back to the browser's serif default |

::: tip Always construct through PhetFont, never bare Font
Sim-specific text should virtually never use scenery's `Font` directly — `PhetFont` is what guarantees the PhET look-and-feel and a safe fallback family across every simulation built on SceneryStack. Reach for a bare `Font` only when intentionally opting out of that convention.
:::
