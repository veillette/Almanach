---
title: Stroke and Line Styling
description: Conventions for stroke width, dash patterns, and line joins/caps.
category: styling
tags: [kite, scenery, stroke, styling]
status: verified
related:
  - /api/kite/shape
  - /api/scenery/path
  - /styling/iconography-conventions
prerequisites:
  - /api/kite/shape
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Stroke and Line Styling

Every scenery `Path` (and its subclasses `Rectangle`, `Circle`, `Line`, …) draws its outline using six line-style options mixed in from `Paintable`: `lineWidth`, `lineCap`, `lineJoin`, `miterLimit`, `lineDash`, and `lineDashOffset`. This page covers conventions for choosing consistent values, not the mechanics of `stroke`/`fill` themselves.

## A small set of stroke widths, not arbitrary numbers

Pick two or three `lineWidth` values for a whole project — thin (grid lines, dividers), standard (shape outlines, panel borders), and occasionally heavy (emphasis/selection) — and reuse them via shared constants, the same way as [typography sizes](/styling/typography-and-fonts):

```ts
// MySimConstants.ts
const MySimConstants = {
  THIN_LINE_WIDTH: 1,
  STANDARD_LINE_WIDTH: 2,
  EMPHASIS_LINE_WIDTH: 4
};

import { Line } from 'scenerystack/scenery';

const gridLine = new Line( 0, 0, 0, 300, {
  stroke: 'gray',
  lineWidth: MySimConstants.THIN_LINE_WIDTH
} );
```

## lineCap and lineJoin: pick one style and hold it

`lineCap` (`'butt'` | `'round'` | `'square'`) controls how a stroke ends; `lineJoin` (`'miter'` | `'round'` | `'bevel'`) controls how two segments meet at a corner. Mixing cap/join styles across a scene reads as sloppy — settle on one pair (commonly `lineCap: 'round'` for hand-drawn-feeling curves and cables, or the defaults `'butt'`/`'miter'` for precise geometric diagrams) and apply it project-wide:

```ts
import { Path } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';

const cablePath = new Path( cableShape, {
  stroke: 'black',
  lineWidth: 6,
  lineCap: 'round',
  lineJoin: 'round'   // avoid sharp miter spikes on a soft/organic shape
} );
```

`miterLimit` (default `10`) only matters when `lineJoin: 'miter'`: past this ratio of miter length to line width, a sharp corner is automatically drawn as a bevel instead, so a very acute angle doesn't spike out unboundedly. Lower it (e.g. `miterLimit: 3`) for shapes with intentionally sharp corners you don't want to over-emphasize.

## Dash patterns: reserve them for one meaning

`lineDash` (an array of on/off segment lengths, e.g. `[ 8, 4 ]` for 8px dashes with 4px gaps) is most legible when a project uses it for exactly one recurring meaning — e.g. "this is a projected/predicted path" or "this is a hidden/reference boundary" — rather than varying dash patterns arbitrarily between shapes:

```ts
const predictedPathNode = new Path( predictedPathShape, {
  stroke: 'blue',
  lineWidth: 2,
  lineDash: [ 8, 4 ]   // reserved sitewide for "predicted / projected" paths
} );

const referenceBoundary = new Path( boundaryShape, {
  stroke: 'gray',
  lineWidth: 1,
  lineDash: [ 2, 2 ]   // reserved sitewide for "non-interactive reference geometry"
} );
```

`lineDashOffset` shifts where the pattern starts; it's mainly useful for animating a "marching ants" effect by incrementing it each frame.

## Strokes on filled shapes: keep width proportional to size

A `lineWidth` that looks right on a 200px panel border can overwhelm a 12px icon. When the same stroke style is reused across very different scales (see [Iconography Conventions](/styling/iconography-conventions)), scale `lineWidth` down for small Nodes rather than keeping one constant everywhere:

```ts
const panelBorder = { stroke: 'black', lineWidth: 2 };   // fine at panel scale
const iconOutline = { stroke: 'black', lineWidth: 1 };   // 2 would look heavy at icon scale
```

::: tip lineWidth: 0 is not the same as stroke: null
Setting `lineWidth: 0` still incurs the (small) cost of stroke computation and `Path` correctly treats it as "no visible stroke," but the clearer and cheaper way to say "this shape has no stroke" is `stroke: null` — reserve `lineWidth` tuning for shapes that are actually stroked.
:::
