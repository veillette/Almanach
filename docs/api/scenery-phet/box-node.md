---
title: BoxNode
description: A pseudo-3D box drawn as three flat parallelograms (top, front, right side), used for capacitor and battery visualizations.
category: api
library: scenery-phet
tags: [scenery-phet, BoxNode, BoxShapeCreator, capacitor, pseudo-3d]
status: complete
related:
  - /api/dot/bounds3
  - /api/scenery/path
  - /api/scenery/color
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# BoxNode

`BoxNode` (from `scenerystack/scenery-phet`) draws a pseudo-3D rectangular box by rendering three flat parallelograms — a top face, a front face, and a right-side face — each a `Path` filled with a progressively darker shade of the same base `Color`. It's the building block PhET's capacitor and battery visualizations use to fake a 3D dielectric slab or plate without any real 3D rendering. The origin is at the center of the top face.

The actual 2D geometry for each face is computed by the companion class `BoxShapeCreator`, which projects 3D model coordinates (a `Bounds3`) into 2D view-coordinate `Shape`s using a [`YawPitchModelViewTransform3`](https://github.com/phetsims/scenery-phet) — the same yaw/pitch/scale projection used throughout PhET's capacitor sims.

```ts
import { BoxNode, YawPitchModelViewTransform3 } from 'scenerystack/scenery-phet';
import { Bounds3 } from 'scenerystack/dot';
import { Color } from 'scenerystack/scenery';
```

## A minimal example

```ts
const transform = new YawPitchModelViewTransform3( {
  scale: 12000,
  pitch: 30 * Math.PI / 180,
  yaw: -45 * Math.PI / 180
} );

// A slab of dielectric material, in model coordinates (meters).
const size = new Bounds3( -0.005, 0, -0.0025, 0.005, 0.001, 0.0025 );

const boxNode = new BoxNode( transform, new Color( 'yellow' ), size, {
  pickable: true // so a probe/voltmeter can hit-test the box
} );

// Resize later without recreating the Node:
boxNode.setBoxSize( size.dilatedY( 0.0005 ) );
```

`BoxNode.topNode` and `BoxNode.frontNode` are exposed read-only if you need to layer additional graphics (like a charge overlay) directly on top of a specific face.

## Constructor

```ts
new BoxNode( transform: YawPitchModelViewTransform3, color: Color, size: Bounds3, options?: NodeOptions )
```

| Parameter | Description |
| --- | --- |
| `transform` | The `YawPitchModelViewTransform3` used to project all three faces |
| `color` | Base color; the front face uses `color.darkerColor()` and the right-side face uses `color.darkerColor().darkerColor()`, giving the top face the lightest, most "lit" appearance |
| `size` | A model-coordinate `Bounds3`, with the box's top-face center at `(size.minX, size.minY, size.minZ)` plus `width`/`height`/`depth` |
| `options` | Plain `NodeOptions`; `pickable: true` is merged in by default so the box can be hit-tested |

## Methods

| Method | Effect |
| --- | --- |
| `setBoxSize( size: Bounds3 )` | Updates the box's size and rebuilds all three face shapes, only if the new size actually differs from the current one |

## BoxShapeCreator

`BoxShapeCreator` is the standalone shape-generation half of `BoxNode` — construct one directly if you need the raw `Shape`s (e.g. to draw a face yourself, or to hit-test without a `Path`) rather than a ready-made `Node`.

```ts
const shapeCreator = new BoxShapeCreator( transform );
const topShape = shapeCreator.createTopFaceBounds3( size );
```

| Method | Returns |
| --- | --- |
| `createTopFace( x, y, z, width, height, depth )` / `createTopFaceBounds3( bounds )` | `Shape` for the top parallelogram |
| `createFrontFace( x, y, z, width, height, depth )` / `createFrontFaceBounds3( bounds )` | `Shape` for the front rectangle |
| `createRightSideFace( x, y, z, width, height, depth )` / `createRightSideFaceBounds3( bounds )` | `Shape` for the right-side parallelogram |
| `createBoxShape( x, y, z, width, height, depth )` | The union of all three faces as one `Shape` |

::: tip Not a general-purpose 3D primitive
`BoxNode` and `BoxShapeCreator` were built specifically for PhET's capacitor/battery circuit visualizations and assume a fixed yaw/pitch projection supplied via `YawPitchModelViewTransform3` — they're not a general "3D box" utility. If you just need an isometric-looking box icon with no model-coordinate semantics, it's usually simpler to hand-build the three parallelogram `Shape`s yourself.
:::
