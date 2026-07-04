---
title: LinearGradient
description: A paint type for straight-line color gradients, usable anywhere a Node accepts a fill or stroke.
category: api
library: scenery
tags: [scenery, LinearGradient, gradient, paint, fill, stroke]
status: verified
related:
  - /api/scenery/color
  - /api/scenery/radial-gradient
  - /api/scenery/node
prerequisites:
  - /api/scenery/color
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# LinearGradient

`LinearGradient` (from `scenerystack/scenery`) is a paint type — like [`Color`](/api/scenery/color) — that can be assigned directly to a Node's `fill` or `stroke` option to render a color gradient along a straight line between two points, in the Node's local coordinate frame. It extends the abstract `Gradient` base class it shares with [`RadialGradient`](/api/scenery/radial-gradient), which supplies the shared `addColorStop` API.

```ts
import { Rectangle, LinearGradient } from 'scenerystack/scenery';

// Gradient line from (0, 0) to (100, 0) — a horizontal sweep across the Rectangle's width
const gradient = new LinearGradient( 0, 0, 100, 0 )
  .addColorStop( 0, 'red' )
  .addColorStop( 0.5, 'yellow' )
  .addColorStop( 1, 'green' );

const bar = new Rectangle( 0, 0, 100, 20, { fill: gradient } );
```

## Constructor

`new LinearGradient( x0, y0, x1, y1 )` — the four coordinates describe the gradient line's start (ratio 0) and end (ratio 1) points, in the local coordinate frame of whatever Node it's used on. The gradient extends perpendicular to this line and repeats the end colors beyond the line's extent.

## Color stops

`addColorStop( ratio, color )` (inherited from `Gradient`) appends one stop and returns `this`, so calls chain naturally:

| Parameter | Meaning |
| --- | --- |
| `ratio` | A number from `0` to `1`, position along the gradient line |
| `color` | `null`, a CSS string, a [`Color`](/api/scenery/color) instance, or a `Property` resolving to one of those |

Stops must be added in non-decreasing `ratio` order — calling `addColorStop` with a smaller ratio than the previous call throws, since browsers handle out-of-order stops inconsistently.

::: warning Color stops must be added in increasing order
`addColorStop( 0.5, 'yellow' )` followed by `addColorStop( 0.2, 'red' )` throws `'Color stops not specified in the order of increasing ratios'`. If stop positions are computed dynamically, sort them before calling `addColorStop` in a loop.
:::
