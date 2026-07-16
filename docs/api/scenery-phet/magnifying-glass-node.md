---
title: MagnifyingGlassNode
description: A simple magnifying-glass icon (circular glass plus a handle) that can center an arbitrary icon Node inside the glass.
category: api
library: scenery-phet
tags: [scenery-phet, MagnifyingGlassNode]
status: complete
related:
  - /api/scenery-phet/zoom-button-groups
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# MagnifyingGlassNode

`MagnifyingGlassNode` (from `scenerystack/scenery-phet`) draws a magnifying glass: a stroked circle (the "glass") with a short diagonal line (the "handle") extending from its lower-left, built entirely from `Circle` and `Line` — no image assets. It optionally centers an arbitrary icon `Node` inside the glass, which is how [`ZoomButton`](/api/scenery-phet/zoom-button-groups) and `MagnifyingGlassZoomButtonGroup` place a "+" or "−" sign inside the lens.

```ts
import { MagnifyingGlassNode } from 'scenerystack/scenery-phet';
import { PlusNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
// A plain magnifying glass, no icon inside.
const magnifyingGlassNode = new MagnifyingGlassNode( {
  glassRadius: 20
} );

// A magnifying glass with a "+" centered in the lens, matching ZoomButton's look.
const zoomInIcon = new MagnifyingGlassNode( {
  glassRadius: 15,
  icon: new PlusNode( { size: new Dimension2( 1.3 * 15, 15 / 3 ) } )
} );
```

<SceneryDemo demo="magnifying-glass-node" />

## Constructor

```ts
new MagnifyingGlassNode( providedOptions: MagnifyingGlassNodeOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `glassRadius` | `15` | Radius of the circular glass; also drives the glass's stroke width (`0.25 × glassRadius`) and the handle's length/thickness |
| `glassFill` | `'white'` | Fill of the glass interior |
| `glassStroke` | `'black'` | Stroke color of both the glass rim and the handle |
| `icon` | `null` | An optional `Node`, centered inside the glass if provided (`content` itself is not settable — the glass and handle are always built) |

::: tip It's a pure icon `Node`, not a button
`MagnifyingGlassNode` has no interactive behavior of its own — it's just the drawn glyph. To make it clickable, wrap it as the `content` of a [`RectangularPushButton`](/api/sun/rectangular-push-button) yourself, or use the pre-built [`ZoomButton` / zoom button groups](/api/scenery-phet/zoom-button-groups), which already do exactly that.
:::
