---
title: Dimension2
description: A plain width/height pair, like Bounds2 without a position.
category: api
library: dot
tags: [dot, Dimension2, bounds]
status: verified
related:
  - /api/dot/bounds2
prerequisites:
  - /api/dot/bounds2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Dimension2

`Dimension2` (from `scenerystack/dot`) is a bare `{ width, height }` pair — a size with no position, unlike [`Bounds2`](/api/dot/bounds2) which anchors its extent at specific `minX`/`minY` coordinates. Reach for it when you need to describe or pass around "how big," not "where," e.g. layout preferred sizes, image dimensions, or screen/window sizes.

```ts
import { Dimension2 } from 'scenerystack/dot';

const screenSize = new Dimension2( 1024, 768 );

screenSize.width;    // 1024
screenSize.swapped(); // Dimension2(768, 1024) — new instance, screenSize unchanged

const bounds = screenSize.toBounds(); // Bounds2(0, 0, 1024, 768)
const shifted = screenSize.toBounds( 100, 50 ); // Bounds2(100, 50, 1124, 818)
```

## Constructing

The constructor takes `width` and `height` directly: `new Dimension2( width, height )`. Both are plain mutable public fields (`dimension.width = 10`), not getter/setter pairs.

## Methods

| Method | Effect |
| --- | --- |
| `copy( dimension? )` | Returns a new `Dimension2` equal to this one, or (if `dimension` is passed) mutates `dimension` to match this one and returns it |
| `set( dimension )` | Mutates this `Dimension2` to match another, returning `this` |
| `setWidth( width )` / `setHeight( height )` | Mutable single-field setters, returning `this` |
| `swapped()` | A new `Dimension2` with `width` and `height` exchanged |
| `toBounds( x?, y? )` | A new [`Bounds2`](/api/dot/bounds2) of this size, anchored with its minimum corner at `(x, y)` (both default to `0`) |
| `equals( that )` / `equalsEpsilon( that, epsilon? )` | Comparison |
| `toString()` | Debug string, e.g. `[1024w, 768h]` |

::: tip There's no immutable/mutable method split here
Unlike `Vector2`/`Bounds2`, `Dimension2` doesn't have paired immutable+mutable variants for its operations — `width`/`height` are plain public fields you can assign directly, and `set`/`setWidth`/`setHeight` are the only mutators. `copy()` and `swapped()` are the only two methods that return a new instance; everything else either mutates in place or (like `toBounds`) is a one-way conversion.
:::

## Related

- [Bounds2](/api/dot/bounds2) — `dimension.toBounds( x, y )` builds a `Bounds2` of this size at a given position; conversely, `bounds.width`/`bounds.height` give you the size of an existing `Bounds2`.
