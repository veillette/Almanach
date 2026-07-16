---
title: XNode
description: A simple 'x' mark Node, drawn as a PlusNode rotated 45 degrees.
category: api
library: scenery-phet
tags: [scenery-phet, XNode, PlusNode, marker, icon]
status: complete
related:
  - /api/scenery-phet/triangle-node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# XNode

`XNode` (from `scenerystack/scenery-phet`) draws an 'x' mark: it's a thin subclass of `PlusNode` that fixes `rotation` to 45 degrees and reinterprets `PlusNode`'s `size` option as `length` (the diagonal length) and `legThickness` (the width of each stroke). It's used, for example, to mark the center of mass of a system of bodies, but works generically anywhere you need a simple 'x' icon or marker.

```ts
import { XNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const centerOfMassMarker = new XNode( {
  length: 30,
  legThickness: 8,
  fill: 'red'
} );
```

<SceneryDemo demo="x-node" />

## Constructor

```ts
new XNode( providedOptions?: XNodeOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `length` | `22` | Length of the 'x' along its diagonal |
| `legThickness` | `6` | Thickness of each of the 'x''s two strokes |
| `lineWidth` (inherited `PathOptions`) | `1.5` | Stroke width around the 'x' shape's outline |
| `fill` (inherited `PathOptions`, via `PlusNode`) | `'black'` | Fill color of the 'x' |

::: tip `size` and `rotation` are not accepted
`XNode`'s options type explicitly omits `size` and `rotation` from the underlying `PlusNodeOptions` — it computes both internally from `length`/`legThickness` and the fixed 45-degree rotation. Passing `length`/`legThickness` is the supported way to resize an `XNode`; setting `.rotation` on an instance afterward will visually un-rotate it back away from a proper 'x'.
:::
