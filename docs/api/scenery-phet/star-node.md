---
title: StarNode and StarShape
description: A five-pointed star that fills in from left to right by a 0-to-1 value, used as PhET's standard game score indicator.
category: api
library: scenery-phet
tags: [scenery-phet, StarNode, StarShape]
status: complete
related:
  - /api/vegas/score-display-family
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# StarNode and StarShape

`StarShape` (from `scenerystack/scenery-phet`) is a `kite` `Shape` subclass tracing a five-pointed star outline. `StarNode` layers two `StarShape`-based `Path`s — a bland gray "empty" star behind a bold yellow "filled" star clipped to a horizontal fraction — so that setting a single `value` between `0` and `1` visually fills the star in from left to right. It was built for game score indicators (PhET's [`ScoreDisplayStars`/`ScoreDisplayNumberAndStar`](/api/vegas/score-display-family) both render a row of `StarNode`s), but works anywhere a "how much of this is filled in" glyph is useful.

```ts
import { StarNode, StarShape } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
// A fully-filled star (the default).
const fullStar = new StarNode();

// A half-filled star, e.g. for a partial score.
const halfStar = new StarNode( { value: 0.5 } );

// An empty outline only, with no foreground star drawn at all.
const emptyStar = new StarNode( { value: 0 } );

// The bare outline shape, usable in any Path.
const starShape = new StarShape( { outerRadius: 20, innerRadius: 10 } );
```

## `StarNode` constructor

```ts
new StarNode( providedOptions?: StarNodeOptions )
```

## `StarNode` options

| Option | Default | Effect |
| --- | --- | --- |
| `value` | `1` | Fraction filled, `0` to `1`. `0` renders only the empty background star (no foreground `Path` is even created); `1` fully fills it |
| `emptyFill` / `emptyStroke` / `emptyLineWidth` / `emptyLineJoin` | `'#e1e1e1'` / `'#d3d1d1'` / `1.5` / `'round'` | Styling of the background (unfilled) star — kept deliberately bland |
| `filledFill` / `filledStroke` / `filledLineWidth` / `filledLineJoin` | `'#fcff03'` (yellow) / `'black'` / `1.5` / `'round'` | Styling of the foreground (filled) star — kept bold and eye-catching |
| `starShapeOptions` | `{}` | Forwarded to both internal `StarShape`s, e.g. `{ outerRadius, innerRadius, numberStarPoints }` |

The fill effect is implemented with a `clipArea` on the foreground star (clipped to `value` of its width), not by redrawing a partial shape — cheaper to compute and gives a clean vertical fill edge.

## `StarShape` constructor

```ts
new StarShape( providedOptions?: StarShapeOptions )
```

| Option | Default | Effect |
| --- | --- | --- |
| `outerRadius` | `15` | Distance from center to each point's tip |
| `innerRadius` | `7.5` | Distance from center to the inner vertices between points — controls how "thick" the star's limbs look |
| `numberStarPoints` | `5` | Number of points; the shape alternates `outerRadius`/`innerRadius` vertices around the full circle |

`StarShape` calls `makeImmutable()` after construction, so a single instance can safely be reused across multiple `Path`s without listener overhead.

::: tip `StarNode` isn't a button
It's a passive display `Node`, not a [`StarButton`](/api/scenery-phet/round-icon-buttons) — `StarButton` uses the same `StarShape` as its icon, but the two classes are otherwise unrelated (one shows a score, the other fires a `listener` on press).
:::
