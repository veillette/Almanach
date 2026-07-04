---
title: Subpath
description: An ordered, connected run of segments within a Shape — the container between individual segments and the whole Shape.
category: api
library: kite
tags: [kite, Subpath, path]
status: verified
related:
  - /api/kite/shape
  - /api/kite/line-segment
  - /api/kite/line-styles
  - /api/dot/vector2
  - /api/dot/matrix3
prerequisites:
  - /api/kite/shape
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Subpath

`Subpath` (from `scenerystack/kite`) holds one connected, ordered run of [`Segment`](/api/kite/shape)s — the layer between individual segments and a whole [`Shape`](/api/kite/shape). Every `Shape` is really just an array of these: `shape.subpaths` is a `Subpath[]`, and each call to `moveTo()` on a `Shape` starts a new one. A single `moveTo().lineTo().lineTo()` traces one `Subpath`; calling `moveTo()` again (or drawing a shape with multiple disconnected pieces, like the two loops of a letter "B") starts another.

```ts
import { Shape } from 'scenerystack/kite';

const shape = new Shape()
  .moveTo( 0, 0 ).lineTo( 100, 0 ).lineTo( 50, 80 ).close()   // subpath 0: a triangle
  .moveTo( 200, 0 ).lineTo( 300, 0 );                          // subpath 1: an open line

shape.subpaths.length;          // 2
shape.subpaths[ 0 ].closed;     // true  - closed with .close()
shape.subpaths[ 0 ].segments;   // the 3 Line segments making up the triangle
shape.subpaths[ 1 ].closed;     // false - never closed
```

::: tip A `Subpath` being `closed` isn't the same as its first and last points coinciding
`closed` reflects whether `.close()` was called (which also appends a real closing segment connecting the last point back to the first, via `getClosingSegment()`) — it's not inferred from geometry. A subpath whose last `lineTo()` happens to land exactly on the start point, but which never called `.close()`, still reports `closed === false` and has no closing segment. Use `isClosed()` (equivalent to reading `.closed`) rather than comparing `getFirstPoint()`/`getLastPoint()` yourself.
:::

## Constructor

```ts
new Subpath( segments?: Segment[], points?: Vector2[], closed?: boolean )
```

You'll rarely construct a `Subpath` directly — build shapes through `Shape`'s fluent API (`moveTo`/`lineTo`/`arc`/...) and read the resulting `shape.subpaths` instead. The constructor mainly exists for `Shape`'s own internals (`copy()`, transform methods) and for advanced code assembling a `Shape` from pre-built segments.

## Public API

| Member | Description |
| --- | --- |
| `segments` | The ordered `Segment[]` making up this subpath |
| `points` | The `Vector2[]` of segment start points, plus the final segment's end point |
| `closed` | Whether `.close()` was called on this subpath |
| `bounds` | The `Bounds2` union of every segment's bounds |
| `getFirstPoint()` / `getLastPoint()` | The subpath's first and last points |
| `getFirstSegment()` / `getLastSegment()` | The subpath's first and last segments |
| `isClosed()` | Same as reading `.closed` |
| `hasClosingSegment()` / `getClosingSegment()` | A purely geometric check — whether (and what) synthetic `Line` segment would connect the last point back to the first. This is independent of the `closed` flag: it returns `true` whenever the first and last points differ by more than a tiny epsilon, even on a subpath that never called `.close()` |
| `isDrawable()` | Whether there's at least one segment to draw |
| `getArcLength()` | Sum of every contained segment's arc length |
| `getFillSegments()` | Segments to use for filling — includes the closing segment even if `.close()` was never explicitly called, since fills always implicitly close |
| `stroked( lineStyles )` | Returns `Subpath[]` describing the outline this subpath would have when stroked with the given [`LineStyles`](/api/kite/line-styles) — what `Shape.getStrokedShape()` delegates to per subpath |
| `transformed( matrix )` | A new `Subpath` with every segment transformed by a [`Matrix3`](/api/dot/matrix3) |
| `copy()` | A shallow-ish copy (new `Subpath`, same segment/point arrays sliced) |

## Related

- [Shape](/api/kite/shape) — the `subpaths: Subpath[]` container, and the fluent builder that creates them.
- [LineStyles](/api/kite/line-styles) — the stroke configuration `subpath.stroked()` consumes.
- [Line](/api/kite/line-segment) — the segment type used for a subpath's synthetic closing segment.
