---
title: Path
description: A Node that renders a kite Shape with fill/stroke.
category: api
library: scenery
tags: [scenery, Path, Shape, fill, stroke]
status: verified
related:
  - /api/kite/shape
  - /api/scenery/circle
  - /api/scenery/rectangle
  - /api/scenery/line
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Path

`Path` (from `scenerystack/scenery`) is a [`Node`](/api/scenery/node) that draws an arbitrary [kite `Shape`](/api/kite/shape) — the general-purpose way to render vector graphics that aren't a plain circle, rectangle, or line. `Circle`, `Rectangle`, and `Line` are all `Path` subclasses that build their `shape` for you from simpler parameters; reach for `Path` directly when you need a custom outline.

```ts
import { Path } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';

const triangle = new Shape()
  .moveTo( 0, 0 )
  .lineTo( 40, 0 )
  .lineTo( 20, -30 )
  .close();

const triangleNode = new Path( triangle, {
  fill: 'rebeccapurple',
  stroke: 'black',
  lineWidth: 2
} );
```

<SceneryDemo demo="path" />

## Options

| Option | Effect |
| --- | --- |
| `shape` | The `Shape` (or SVG path-data string, or `null` for nothing drawn) to render — see `InputShape` |
| `shapeProperty` | Sets the shape via a `TReadOnlyProperty<Shape \| string \| null>` instead of a plain value |
| `boundsMethod` | How self bounds are computed: `'accurate'` (default, exact stroked bounds), `'unstroked'`, `'tightPadding'`, `'safePadding'`, or `'none'` |
| `fill` | Fill paint — a CSS color string, `Color`, `LinearGradient`, `RadialGradient`, or `Pattern` (from `Paintable`, shared with `Text`) |
| `stroke` | Stroke paint, same paint types as `fill` |
| `lineWidth` | Width of the stroked outline |
| `lineCap` / `lineJoin` / `miterLimit` | Stroke cap/join rendering, matching the Canvas 2D API |
| `lineDash` / `lineDashOffset` | Dash pattern for the stroke |

All `Path` subclasses also accept the full set of [`Node` options](/api/scenery/node) (`x`, `scale`, `visible`, `inputListeners`, `layoutOptions`, …).

::: warning Don't mutate a shared `Shape` in place
If a `Shape` isn't marked immutable (`shape.makeImmutable()`), `Path` attaches a listener so it re-renders when the shape mutates — which also means the `Path` keeps a reference to the `Shape` (and vice versa) for as long as that link is alive. Reusing one mutable `Shape` instance across many `Path`s can create surprising update coupling and memory retention; prefer building each `Path`'s shape independently, or call `path.dispose()` / set `path.shape = null` when finished with it.
:::
