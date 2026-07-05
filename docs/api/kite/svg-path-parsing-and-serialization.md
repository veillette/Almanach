---
title: SVG Path Parsing and Serialization
description: How Shape parses an SVG path-data string into segments, serializes back out with getSVGPath(), and the svgNumber/svgPath exports underneath both directions.
category: api
library: kite
tags: [kite, svgPath, svgNumber, Shape, SVG]
status: complete
prerequisites:
  - /api/kite/shape
related:
  - /api/kite/shape
  - /api/kite/segment
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# SVG Path Parsing and Serialization

kite can both **read** an SVG path-data string into a [`Shape`](/api/kite/shape) and **write** a `Shape` back out as one. Reading goes through `svgPath`, a generated PEG.js parser (also exported directly from `scenerystack/kite`, for advanced use); writing goes through `Shape.getSVGPath()`, which stitches together each segment's own `getSVGPathFragment()` using `svgNumber` (also exported directly) to format numbers.

```ts
import { Shape, svgPath, svgNumber } from 'scenerystack/kite';

// Reading: parse SVG path data directly in the Shape constructor
const triangle = new Shape( 'M0,0 L100,0 L50,80 Z' );

// Writing: serialize any Shape back to an SVG path-data string
triangle.getSVGPath(); // 'M 0.00... 0.00... L 100.00... 0.00... L 50.00... 80.00... Z '

svgNumber( 1 / 3 ); // '0.33333333333333331483' - toFixed(20), not scientific notation
```

## Parsing: `new Shape( svgPathString )`

`Shape`'s constructor accepts an SVG path-data string as its first argument (instead of, or in addition to, an array of pre-built `Subpath`s). Internally it runs the string through the `svgPath` parser (exported standalone as `svgPath` from `scenerystack/kite`, generated from a PEG.js grammar) to get a sequence of drawing commands, then replays those commands through the same fluent builder methods (`moveTo`, `lineTo`, `cubicCurveTo`, `arc`, ...) documented on [Shape](/api/kite/shape). This means anything valid in an SVG `d` attribute — absolute and relative commands, arcs, shorthand cubic/quadratic continuations — is supported, since it's the same grammar SVG itself uses.

```ts
import { Shape } from 'scenerystack/kite';

// Arcs, relative commands, and shorthand curves all parse the same as in raw SVG:
const path = new Shape( 'M10,10 h80 v80 h-80 Z' ); // a square, using relative h/v line commands
```

## Serializing: `shape.getSVGPath()`

`Shape.prototype.getSVGPath()` walks every subpath and every [`Segment`](/api/kite/segment) within it, calling each segment's own `getSVGPathFragment()` (part of the shared `Segment` contract — every concrete segment type implements it) and joining the fragments with an `M x y` at the start of each drawable subpath and a trailing `Z` for closed ones. The result is ready to assign directly to an SVG `<path>` element's `d` attribute, or to hand back into `new Shape( ... )` to round-trip.

## `svgNumber`: why plain `toFixed` instead of dot's number formatting

`svgNumber( n )` is a one-line function: `n.toFixed( 20 )`. Its doc comment explains why it deliberately bypasses dot's usual number-formatting utilities (like `toFixed` from `scenerystack/dot`): **SVG's path grammar doesn't support scientific notation** (e.g. `7e5`), so any formatter that might emit it (as `Number.prototype.toString()` can for very large/small numbers) would produce path data a browser can't parse. Using the built-in `toFixed` guarantees a plain fixed-point decimal string every time, at the cost of some (irrelevant, display-only) precision.

::: warning `svgPath` and `svgNumber` are low-level building blocks, not the typical entry point
Most code should go through `new Shape( svgString )` and `shape.getSVGPath()` rather than calling `svgPath.parse()` or `svgNumber()` directly — those two exports exist mainly because `Shape` and `Segment` are built out of them internally, and are exposed for advanced cases (e.g. a tool that wants the raw parsed command list before it's turned into a `Shape`). For everyday reading/writing of SVG path data, the `Shape` methods above are simpler and keep bounds/segment invalidation consistent.
:::
