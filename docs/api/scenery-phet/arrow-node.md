---
title: ArrowNode
description: A configurable arrow shape used for vectors, force diagrams, and callouts.
category: api
library: scenery-phet
tags: [scenery-phet, ArrowNode]
status: complete
related:
  - /api/phetcommon/model-view-transform
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ArrowNode

`ArrowNode` (from `scenerystack/scenery-phet`) draws a single- or double-headed arrow between two points. It's the standard way to render vectors (velocity, force, momentum), callouts, and directional indicators — most of the actual geometry work happens in the internal `ArrowShape`, so `ArrowNode` itself is a thin, mutable `Path` wrapper around it.

```ts
import { ArrowNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
// Draw an arrow from (0, 0) to (100, -40)
const forceArrow = new ArrowNode( 0, 0, 100, -40, {
  fill: 'red',
  stroke: 'red',
  headHeight: 12,
  headWidth: 12,
  tailWidth: 4
} );

// Later, as the modeled force vector changes, update the geometry in place
// rather than creating a new ArrowNode:
forceArrow.setTailAndTip( 0, 0, newTipX, newTipY );
```

When the vector being drawn comes from model coordinates, convert both endpoints through a [`ModelViewTransform2`](/api/phetcommon/model-view-transform) before constructing or updating the `ArrowNode`.

## Constructor

```ts
new ArrowNode( tailX: number, tailY: number, tipX: number, tipY: number, providedOptions?: ArrowNodeOptions )
```

`ArrowNodeOptions` is `SelfOptions & PathOptions` — every `Path` option (`fill`, `stroke`, `lineWidth`, `pickable`, `visible`, …) is accepted alongside the arrow-specific options below. Defaults for the `Path` options are `fill: 'black'`, `stroke: 'black'`, `lineWidth: 1`.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `headHeight` | `10` | Length of the arrowhead along the shaft |
| `headWidth` | `10` | Width of the arrowhead's base |
| `tailWidth` | `5` | Width of the shaft |
| `fractionalHeadHeight` | `0.5` | The head is scaled down once `headHeight` would exceed this fraction of the total arrow length (keeps short arrows from being all head) |
| `doubleHead` | `false` | `true` puts an arrowhead on both ends; `false` puts one head at the tip |
| `isHeadDynamic` | `false` | Whether the head scales as the arrow's length changes |
| `scaleTailToo` | `false` | Whether the tail width scales along with a dynamic head |

## Methods

| Method | Effect |
| --- | --- |
| `setTailAndTip( tailX, tailY, tipX, tipY )` | Repositions both ends and rebuilds the shape; reuses the existing `Shape` instance when possible for performance |
| `setTail( tailX, tailY )` | Repositions only the tail |
| `setTip( tipX, tipY )` | Repositions only the tip |
| `setTailWidth( tailWidth )` | Changes the shaft width and rebuilds the shape |
| `setDoubleHead( doubleHead )` | Toggles single/double-headed and rebuilds the shape |
| `.tailX` / `.tailY` / `.tipX` / `.tipY` | Read-only getters for the current endpoints |

::: tip headWidth must exceed tailWidth
The constructor asserts `headWidth > tailWidth`. If your arrowhead isn't visibly wider than the shaft, this is the first thing to check — it's a common typo when copying options between arrows of different sizes.
:::
