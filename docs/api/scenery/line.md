---
title: Line
description: A Path subclass for drawing single line segments.
category: api
library: scenery
tags: [scenery, Line, Path]
status: complete
related:
  - /api/scenery/path
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Line

`Line` (from `scenerystack/scenery`) is a [`Path`](/api/scenery/path) subclass that draws a single straight segment between two points, built from `p1`/`p2` (or `x1`/`y1`/`x2`/`y2`) parameters instead of a hand-built kite `Shape`. Since a `Line` has no interior area, only `stroke` (not `fill`) has a visible effect.

```ts
import { Line } from 'scenerystack/scenery';
import { Vector2 } from 'scenerystack/dot';

// new Line( x1, y1, x2, y2, options )
const axis = new Line( 0, 0, 100, 0, {
  stroke: 'black',
  lineWidth: 2
} );

// new Line( p1, p2, options )
const diagonal = new Line( new Vector2( 0, 0 ), new Vector2( 50, 50 ), { stroke: 'gray' } );

axis.x2 = 150; // update an endpoint after construction
```

## Constructor overloads

| Signature | Use case |
| --- | --- |
| `new Line( options )` | Fully options-driven |
| `new Line( p1, p2, options? )` | Endpoints as `Vector2`s |
| `new Line( x1, y1, x2, y2, options? )` | Endpoints as separate numbers |

## Options

| Option | Effect |
| --- | --- |
| `p1` | Start point as a `Vector2` |
| `p2` | End point as a `Vector2` |
| `x1`, `y1` | Start point coordinates individually |
| `x2`, `y2` | End point coordinates individually |

`Line` accepts every [`Path` option](/api/scenery/path) except `shape`/`shapeProperty` — `stroke`, `lineWidth`, `lineCap`, `lineDash`, etc. all apply — plus the full set of [`Node` options](/api/scenery/node).

::: tip `fill` has no effect
A `Line` has zero area, so setting `fill` does nothing visible; use `stroke` and `lineWidth` to control its appearance.
:::
