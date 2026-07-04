---
title: Pattern
description: The image-tiling paint type usable as a Node's fill or stroke - unrelated to the software-design conventions in the patterns/ section.
category: api
library: scenery
tags: [scenery, Pattern, paint, fill, stroke, image]
status: complete
related:
  - /api/scenery/color
  - /api/scenery/node
  - /api/scenery/image
prerequisites:
  - /api/scenery/color
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Pattern (paint)

`Pattern` (from `scenerystack/scenery`) is a paint type — assignable to a `fill` or `stroke` alongside [`Color`](/api/scenery/color) and the gradient paints — that repeats an image tile in both directions to fill a shape, matching the CSS/Canvas notion of a repeating image pattern. This is unrelated to the "design pattern" write-ups in this wiki's [`patterns/`](/patterns/options-pattern) section (options pattern, enumeration pattern, etc.) — this `Pattern` is a rendering primitive, not a coding convention.

```ts
import { Pattern, Rectangle } from 'scenerystack/scenery';

const image = document.createElement( 'img' );
image.src = '/assets/checker-tile.png';

const pattern = new Pattern( image );
const tiledBackground = new Rectangle( 0, 0, 200, 100, { fill: pattern } );
```

## Constructor

`new Pattern( image )` takes a single `HTMLImageElement` that repeats (tiled, `'repeat'` in both x and y) to fill whatever shape it's used as `fill`/`stroke` on. Unlike [`Image`](/api/scenery/image), `Pattern` does not accept a URL string directly or manage loading — the `HTMLImageElement` should already have a `src` set (and typically already be loaded) before constructing the `Pattern`.

## Deriving a pattern from a Node instead of an image file

`NodePattern` (from `scenerystack/scenery`) is a `Pattern` subclass that rasterizes an arbitrary `Node` subtree into the backing image, for tiling a pattern built from scenery content (shapes, gradients, text) rather than a static asset:

```ts
import { NodePattern, Circle } from 'scenerystack/scenery';

const dot = new Circle( 4, { fill: 'black' } );
const dotPattern = new NodePattern( dot, 2, -8, -8, 16, 16 ); // node, resolution, x, y, width, height
```

::: warning `Pattern` does not load the image for you
Passing an `HTMLImageElement` whose `src` hasn't finished loading yet produces a blank or stale pattern — `Pattern`'s constructor synchronously builds a `CanvasPattern` from whatever image data is available at that moment. Wait for the image's `load` event (or use an already-loaded/cached image) before constructing the `Pattern`, rather than relying on it to update once loading completes.
:::
