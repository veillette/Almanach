---
title: ProtractorNode
description: A draggable, rotatable protractor image for measuring angles, backed by an angleProperty.
category: api
library: scenery-phet
tags: [scenery-phet, ProtractorNode, protractor, angle, measurement]
status: complete
related:
  - /api/dot/vector2
  - /patterns/drag-listeners
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ProtractorNode

`ProtractorNode` (from `scenerystack/scenery-phet`) displays a protractor image with a public `angleProperty` tracking its current rotation, in radians. By default it's a static image; pass `rotatable: true` and it adds a hit-tested outer ring that the user can drag with a [`DragListener`](/patterns/drag-listeners) to spin the protractor around its center, keeping `angleProperty` in sync in both directions.

```ts
import { ProtractorNode } from 'scenerystack/scenery-phet';
import { Vector2 } from 'scenerystack/dot';
```

## A minimal example

```ts
const protractorNode = new ProtractorNode( {
  rotatable: true,
  angle: 0,
  center: new Vector2( 200, 200 )
} );

protractorNode.angleProperty.link( angle => {
  console.log( 'protractor angle (radians):', angle );
} );
```

## Constructor

```ts
new ProtractorNode( providedOptions?: ProtractorNodeOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `angle` | `0` | Initial value (in radians) used to seed `angleProperty` |
| `rotatable` | `false` | If `true`, adds an outer-ring hit target the user can drag to rotate the protractor; if `false`, the protractor is a static, non-interactive image |

## Public API

| Member | Description |
| --- | --- |
| `angleProperty` | `Property<number>` — the protractor's current rotation, in radians. Read it to know the current angle; when `rotatable` is `true`, dragging the outer ring also writes to it |
| `reset()` | Resets `angleProperty` to its initial value |
| `ProtractorNode.createIcon( options )` (static) | Returns a plain `Image` of the protractor artwork, for use in toolboxes or checkboxes, independent of any live instance |

::: tip The image uses pixel hit-testing
The protractor `Image` is created with `hitTestPixels: true`, so pointer events only register over the image's non-transparent pixels — dragging near the protractor's transparent corners won't pick it up, only its printed outline will.
:::
