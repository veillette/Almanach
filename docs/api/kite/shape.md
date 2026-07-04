---
title: Shape
description: kite's path-description class behind Path, and its common construction/query methods.
category: api
library: kite
tags: [kite, Shape, path]
status: verified
related:
  - /api/scenery/path
  - /api/dot/bounds2
  - /api/dot/matrix3
  - /api/dot/vector2
prerequisites:
  - /api/dot/vector2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Shape

`Shape` (from `scenerystack/kite`) describes a 2D path — one or more subpaths built from line, quadratic, cubic, and arc segments — independent of how it's drawn. It's the geometry engine behind scenery's [`Path`](/api/scenery/path) (and `Path`'s subclasses like `Rectangle`, `Circle`, and `Line`): a `Path` node just takes a `Shape` and renders it with fill/stroke.

```ts
import { Shape } from 'scenerystack/kite';
import { Vector2 } from 'scenerystack/dot';

const triangle = new Shape()
  .moveTo( 0, 0 )
  .lineTo( 100, 0 )
  .lineTo( 50, 80 )
  .close();

triangle.bounds;                                  // Bounds2 tightly containing the triangle
triangle.containsPoint( new Vector2( 50, 40 ) );  // true
```

## Building shapes with the fluent API

The constructor `new Shape()` starts empty (or you can pass an SVG path-data string, e.g. `new Shape( 'M0,0 L100,0 L50,80 Z' )`). From there, chain path-drawing commands — each one returns `this`, so calls read like a pen tracing a line:

| Method | Draws |
| --- | --- |
| `moveTo( x, y )` / `moveToPoint( vector )` | Starts a new subpath at a point (no line drawn) |
| `lineTo( x, y )` / `lineToPoint( vector )` | A straight line from the current point |
| `quadraticCurveTo( cpx, cpy, x, y )` | A quadratic Bézier curve |
| `cubicCurveTo( cp1x, cp1y, cp2x, cp2y, x, y )` | A cubic Bézier curve |
| `arc( centerX, centerY, radius, startAngle, endAngle, anticlockwise? )` | A circular arc |
| `ellipticalArc( centerX, centerY, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise? )` | An elliptical arc |
| `rect( x, y, width, height )` | An axis-aligned rectangle subpath |
| `polygon( vertices )` | A closed polygon through the given `Vector2[]` points |
| `close()` | Closes the current subpath back to its start point |

Each of these also has a `...Relative` variant (`lineToRelative`, `moveToRelative`, ...) that interprets its arguments as a displacement from the current point rather than an absolute position.

## Static factories

For common shapes, the static factories are usually more direct than the fluent builder:

```ts
Shape.rectangle( 0, 0, 100, 50 );                 // same as Shape.rect(...)
Shape.circle( 50, 50, 20 );                        // centerX, centerY, radius
Shape.circle( new Vector2( 50, 50 ), 20 );          // center point, radius
Shape.ellipse( 50, 50, 30, 20, 0 );                 // centerX, centerY, radiusX, radiusY, rotation
Shape.roundRect( 0, 0, 100, 50, 8, 8 );             // x, y, width, height, arc-width, arc-height
Shape.polygon( [ new Vector2( 0, 0 ), new Vector2( 10, 0 ), new Vector2( 5, 10 ) ] );
Shape.lineSegment( 0, 0, 100, 100 );                 // or Shape.lineSegment( p1, p2 )
Shape.regularPolygon( 6, 40 );                       // sides, radius
```

`Shape.union( shapes )`, `Shape.intersection( shapes )`, and `Shape.xor( shapes )` perform boolean operations across an array of shapes, using kite's internal `Graph` machinery.

## Querying and transforming a shape

| Method | Effect |
| --- | --- |
| `bounds` (getter, backed by `getBounds()`) | The tight-fitting axis-aligned [`Bounds2`](/api/dot/bounds2) |
| `containsPoint( point )` | Hit-testing — whether the point is inside the shape (respecting winding rule) |
| `copy()` | A deep copy of the shape |
| `transformed( matrix )` | A new `Shape` with every segment transformed by a [`Matrix3`](/api/dot/matrix3) |
| `getStrokedShape( lineStyles )` | A new `Shape` describing the *outline* a stroke of the given `LineStyles` would draw — useful for hit-testing a stroked-only path |

::: tip `Shape` is mutable while you build it, but treat finished shapes as immutable
The fluent `moveTo`/`lineTo`/`arc`/... calls mutate the `Shape` instance in place (that's why they can be chained). Once a `Shape` is handed to a scenery `Path` (`new Path( shape )`), don't keep mutating that same instance to "animate" the path — `Path` doesn't automatically know the shape changed unless you call `path.shape = newShape` (or `path.invalidateShape()`), so prefer building a fresh `Shape` per frame, or wrap it in a `Property<Shape>` if a shape needs to change reactively. Note also that `Shape.transformed()`, unlike the drawing methods, returns a **new** `Shape` rather than mutating the original.
:::

## Related

- [Path](/api/scenery/path) — the scenery `Node` that renders a `Shape` with fill/stroke.
- [Bounds2](/api/dot/bounds2) — the type returned by `shape.bounds`.
- [Matrix3](/api/dot/matrix3) — the transform type accepted by `shape.transformed()`.
- [Vector2](/api/dot/vector2) — the point type used throughout `Shape`'s construction methods.
