---
title: LineStyles
description: The stroke-rendering options (width, cap, join, dash, miter limit) used to turn a Shape's outline into a stroked shape.
category: api
library: kite
tags: [kite, LineStyles, stroke, path]
status: complete
related:
  - /api/kite/shape
  - /api/kite/arc
  - /api/kite/line-segment
  - /api/kite/subpath
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# LineStyles

`LineStyles` (from `scenerystack/kite`) is a small immutable-in-practice value object bundling every parameter that affects how a stroke is drawn: `lineWidth`, `lineCap`, `lineJoin`, `lineDash`, `lineDashOffset`, and `miterLimit`. It mirrors the [SVG stroke properties](https://svgwg.org/svg2-draft/painting.html) of the same names. You'll mostly encounter it as the argument to [`Shape.getStrokedShape()`](/api/kite/shape) — the method that computes the actual outline a stroke would draw, as a new fillable `Shape` — rather than constructing it to configure a scenery `Path`'s visual stroke directly (that's done with `Path`'s own `lineWidth`/`lineCap`/`lineJoin`/... options).

```ts
import { LineStyles, Shape } from 'scenerystack/kite';

const styles = new LineStyles( {
  lineWidth: 4,
  lineCap: 'round',
  lineJoin: 'round'
} );

const shape = new Shape().moveTo( 0, 0 ).lineTo( 100, 0 ).lineTo( 50, 80 );
const strokedOutline = shape.getStrokedShape( styles ); // a new Shape describing the stroke's outline
```

::: tip `getStrokedShape()` is for hit-testing a stroke-only path, not for changing how it's drawn
If you just want a `Path` to render with a particular `lineWidth`/`lineCap`/`lineJoin`, set those directly as `Path` options — scenery renders strokes natively via Canvas/SVG without needing a `LineStyles`. Construct a `LineStyles` and call `shape.getStrokedShape( styles )` only when you need the *outline geometry itself*, e.g. to hit-test clicks against a stroked-but-unfilled path, or to feed the stroke outline into another kite operation like `Shape.union()`.
:::

## Constructor

```ts
new LineStyles( options?: LineStylesOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `lineWidth` | `1` | Total stroke width — the outline extends `lineWidth / 2` to each side of the path |
| `lineCap` | `'butt'` | Appearance at the ends of an open subpath: `'butt'` (flat, at the endpoint), `'round'` (a semicircle, built from an [`Arc`](/api/kite/arc)), or `'square'` (flat, extended by `lineWidth / 2` past the endpoint) |
| `lineJoin` | `'miter'` | Appearance where two segments meet: `'miter'` (sharp corner, extended until it meets or falls back to `'bevel'` past `miterLimit`), `'round'` (a circular fillet), or `'bevel'` (a single flat cut across the gap) |
| `lineDash` | `[]` | Alternating dash/gap lengths (`[dash, gap, dash, gap, ...]`); empty means a solid line |
| `lineDashOffset` | `0` | Offset into the `lineDash` pattern at which the dash starts, measured along the path |
| `miterLimit` | `10` | How sharp a `'miter'` join is allowed to get (as `1 / sin(angle / 2)`) before falling back to a bevel — prevents extremely acute corners from producing enormous spikes |

## Public API

| Member | Description |
| --- | --- |
| `equals( other )` | Value equality across all six properties (including element-wise `lineDash` comparison) |
| `copy()` | A new `LineStyles` with the same values |
| `leftJoin( center, fromTangent, toTangent )` / `rightJoin( ... )` | Build the array of segments forming a join on a given side, per `lineJoin` — used internally by `Subpath.stroked()` |
| `cap( center, tangent )` | Build the array of segments forming an end cap at a subpath endpoint, per `lineCap` |

## Related

- [Shape](/api/kite/shape) — `getStrokedShape( lineStyles )` is the main entry point that consumes a `LineStyles`.
- [Subpath](/api/kite/subpath) — `subpath.stroked( lineStyles )` does the actual per-subpath outline construction that `Shape.getStrokedShape()` delegates to.
- [Arc](/api/kite/arc) — `'round'` caps and joins are literally built from `Arc` segments.
