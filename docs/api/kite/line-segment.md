---
title: Line
description: kite's straight-line path segment (pure geometry, not a renderable Node) — one of the pieces a Shape's subpaths are built from.
category: api
library: kite
tags: [kite, Line, KiteLine, segment, path]
status: complete
related:
  - /api/kite/shape
  - /api/kite/arc
  - /api/kite/line-styles
  - /api/kite/subpath
  - /api/scenery/line
  - /api/dot/vector2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Line

kite's `Line` is a [`Segment`](/api/kite/shape) — a straight line between two points, and one of the primitive pieces that a [`Shape`](/api/kite/shape)'s subpaths are built from. It is **not** a scene-graph node: it has no `fill`, `stroke`, or `addChild`, and rendering nothing on its own. For a drawable straight line, use scenery's [`Line`](/api/scenery/line) `Path` subclass instead — this page is about the geometry primitive underneath `Shape.lineTo()`, not the thing you'd add to a scene graph.

You'll rarely construct a kite `Line` directly; `shape.lineTo( x, y )` and `Shape.lineSegment( p1, p2 )` create them for you. Where you do encounter the class directly is inspecting a built `Shape`'s internals, e.g. `shape.subpaths[ 0 ].segments[ 0 ]`.

::: warning Imported as `KiteLine`, not `Line`
`scenerystack/kite`'s barrel re-exports this class as `KiteLine` specifically to avoid a naming collision with scenery's `Line` node: `import { KiteLine } from 'scenerystack/kite'`. There is no `Line` export from `scenerystack/kite` — only `scenerystack/scenery` exports a `Line` (the renderable one).
:::

```ts
import { KiteLine, Shape } from 'scenerystack/kite';
import { Vector2 } from 'scenerystack/dot';

const segment = new KiteLine( new Vector2( 0, 0 ), new Vector2( 100, 50 ) );
segment.start;   // Vector2( 0, 0 )
segment.end;     // Vector2( 100, 50 )
segment.bounds;  // Bounds2 tightly containing the segment

// The usual way you'll actually get one: build it through Shape
const shape = new Shape().moveTo( 0, 0 ).lineTo( 100, 50 );
shape.subpaths[ 0 ].segments[ 0 ] instanceof KiteLine; // true
```

## Constructor

```ts
new KiteLine( start: Vector2, end: Vector2 )
```

## Public API

| Member | Description |
| --- | --- |
| `start` / `end` | The two endpoints (`Vector2`, settable via `setStart()`/`setEnd()` or the `start`/`end` setters — either recomputes bounds and tangents) |
| `startTangent` / `endTangent` | Both equal the normalized direction from `start` to `end` — a straight line has one constant tangent along its whole length |
| `bounds` | The tight axis-aligned `Bounds2` around the two endpoints |
| `positionAt( t )` | Linear interpolation between `start` and `end`, `0 <= t <= 1` |
| `tangentAt( t )` | Constant `end.minus( start )` regardless of `t` (non-normalized, unlike `startTangent`/`endTangent`) |
| `getArcLength()` | Equal to `start.distance( end )` — a line needs no subdivision to measure exactly |
| `reversed()` | A new `KiteLine` with `start`/`end` swapped |
| `transformed( matrix )` | A new `KiteLine` with both endpoints transformed by a [`Matrix3`](/api/dot/matrix3) |

See [Shape](/api/kite/shape) for how segments compose into subpaths and shapes, [Subpath](/api/kite/subpath) for the ordered-run container these segments live in, and [LineStyles](/api/kite/line-styles) for how a stroke turns a run of segments into an outline (`Line`'s bevel/miter joins and butt/round/square caps are built out of `KiteLine` and [`Arc`](/api/kite/arc) segments).
