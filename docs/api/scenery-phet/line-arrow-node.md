---
title: LineArrowNode
description: A lightweight, stroke-only arrow built from three line segments, as opposed to the filled-shape ArrowNode.
category: api
library: scenery-phet
tags: [scenery-phet, LineArrowNode, arrow, vector]
status: complete
related:
  - /api/scenery-phet/arrow-node
  - /api/dot/vector2
prerequisites:
  - /api/scenery-phet/arrow-node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# LineArrowNode

`LineArrowNode` (from `scenerystack/scenery-phet`) draws an arrow from three separately-stroked line segments: one for the tail, and two forming a V-shaped, open (unfilled) arrowhead. It exists alongside [`ArrowNode`](/api/scenery-phet/arrow-node) as a deliberately lighter-weight alternative — read on for when to reach for which.

## LineArrowNode vs. ArrowNode

Both draw an arrow between two points, but they render it completely differently:

| | `ArrowNode` | `LineArrowNode` |
| --- | --- | --- |
| Geometry | One filled `Shape` (tail + head combined into a single closed outline) | Two `Path`s: a straight tail line segment, and an open two-segment "V" head |
| Appearance | Solid, filled arrowhead — the classic "vector diagram" arrow | Open, stroke-only arrowhead — thinner, more like a technical-drawing callout |
| Head sizing near short arrows | `fractionalHeadHeight` shrinks the head so it never overwhelms a short shaft | Head height is simply capped at `0.99 *` the arrow's length; no separate fractional-scaling option |
| `doubleHead` / dynamic head scaling | Supported (`doubleHead`, `isHeadDynamic`, `scaleTailToo`) | Not supported — always single-headed, fixed head size |
| Typical use | Force/velocity vectors, filled callout arrows | Thin diagram annotations, sort/reorder cue arrows, anywhere a heavier filled arrowhead would be visually too "loud" |

If you're unsure which to use: reach for `ArrowNode` by default (it's the more common, more configurable choice across PhET sims), and switch to `LineArrowNode` specifically when you want a thinner, unfilled arrowhead that reads as a line drawing rather than a solid vector glyph.

```ts
import { LineArrowNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const cueArrow = new LineArrowNode( 0, 0, 0, -30, {
  stroke: 'black',
  headHeight: 8,
  headWidth: 8,
  tailLineWidth: 1.5
} );

// Reposition later without creating a new Node:
cueArrow.setTailAndTip( 0, 0, 40, 0 );
```

## Constructor

```ts
new LineArrowNode( tailX: number, tailY: number, tipX: number, tipY: number, providedOptions?: LineArrowNodeOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `stroke` | `'black'` | Stroke color of both the tail and the head |
| `lineJoin` | `'miter'` | Affects the appearance of the arrow tip, where the two head segments meet |
| `lineCap` | `'butt'` | Affects the tail's ends and the outside ends of the head segments |
| `headHeight` | `10` | Length of the arrowhead along the shaft; clamped to `0.99 ×` the total arrow length for short arrows |
| `headWidth` | `10` | Width of the arrowhead's open "V" |
| `headLineWidth` | `1` | Stroke width of the two head segments |
| `tailLineWidth` | `1` | Stroke width of the tail segment |
| `tailLineDash` | `[]` | Dash pattern for the tail, e.g. `[ 4, 2 ]` for a dashed shaft |

## Methods

| Method | Effect |
| --- | --- |
| `setTailAndTip( tailX, tailY, tipX, tipY )` | Repositions both ends and rebuilds both the tail and head shapes |

::: tip No `doubleHead` option
Unlike `ArrowNode`, `LineArrowNode` always draws exactly one arrowhead, at the tip end. If you need heads on both ends, construct two `LineArrowNode`s back-to-back or use `ArrowNode` with `doubleHead: true`.
:::
