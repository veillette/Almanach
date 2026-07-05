---
title: YawPitchModelViewTransform3
description: A pseudo-3D model-view transform that projects 3D model coordinates onto a 2D view plane using a fixed yaw/pitch/scale, for capacitor-style oblique visualizations.
category: api
library: scenery-phet
tags: [scenery-phet, YawPitchModelViewTransform3, transform, capacitor, coordinates]
status: complete
related:
  - /api/scenery-phet/capacitor-visualization-nodes
  - /api/phetcommon/model-view-transform
  - /api/dot/vector2
  - /api/dot/vector3
  - /api/dot/matrix3
prerequisites:
  - /api/phetcommon/model-view-transform
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# YawPitchModelViewTransform3

`YawPitchModelViewTransform3` (from `scenerystack/scenery-phet`, under `scenery-phet/js/capacitor/`) maps 3D model coordinates onto a 2D view plane using a fixed yaw (rotation about the vertical axis) and pitch (rotation about the horizontal axis), producing the oblique, pseudo-3D look used by [the capacitor visualization nodes](/api/scenery-phet/capacitor-visualization-nodes) (`CapacitorNode`, `PlateNode`, `BoxNode`). It is not a general-purpose 3D engine — there's no camera, no perspective divide, no z-buffering — just a cheap, fixed-angle projection that gives boxes and plates a sense of depth. Internally it composes a 2D [`ModelViewTransform2`](/api/phetcommon/model-view-transform) (for the flat x/y scaling) with a manual z-axis foreshortening step.

In both coordinate systems, +x is to the right, +y is down, and +z is away from the viewer; rotation signs follow the right-hand rule.

```ts
import { YawPitchModelViewTransform3 } from 'scenerystack/scenery-phet';
import { Vector3 } from 'scenerystack/dot';
```

## A minimal example

```ts
const modelViewTransform = new YawPitchModelViewTransform3( {
  scale: 15000,               // model meters -> view pixels
  pitch: 30 * Math.PI / 180,  // rotate 30° about the x-axis
  yaw: -45 * Math.PI / 180    // rotate -45° about the y-axis
} );

// A point 5mm "into the screen" (+z) projects up and to the side, not straight down:
const viewPoint = modelViewTransform.modelToViewPosition( new Vector3( 0, 0, 0.005 ) );

// Round-trip a view-space drag back into model space (z is always 0 on the way back):
const modelPoint = modelViewTransform.viewToModelXY( viewPoint.x, viewPoint.y );
```

## Constructor

```ts
new YawPitchModelViewTransform3( options?: {
  scale?: number;  // default 12000 — shared x/y scale for the underlying 2D transform
  pitch?: number;  // default 30° in radians — rotation about the horizontal (x) axis
  yaw?: number;    // default -45° in radians — rotation about the vertical (y) axis
} )
```

`yaw` is exposed as a public readonly field (`transform.yaw`); `pitch` and the internal 2D transform are private.

## Methods

| Method | Effect |
| --- | --- |
| `modelToViewPosition( modelPoint: Vector3 )` → `Vector2` | Projects a 3D model point to a 2D view point |
| `modelToViewXYZ( x, y, z )` → `Vector2` | Convenience form of the above taking bare numbers |
| `modelToViewDelta( delta: Vector3 )` / `modelToViewDeltaXYZ( dx, dy, dz )` → `Vector2` | Projects a *delta* rather than an absolute position (computed as the projected point minus the projected origin, so it's translation-invariant) |
| `modelToViewShape( modelShape: Shape )` → `Shape` | Transforms a flat (z = 0) model-space `Shape` using only the underlying 2D transform |
| `modelToViewBounds( modelBounds: Bounds2 )` → `Bounds2` | Transforms flat model-space `Bounds2` using only the underlying 2D transform |
| `viewToModelPosition( viewPoint: Vector2 )` → `Vector3` | Inverse of `modelToViewPosition` — **not** a true inverse projection; it uses the 2D transform's inverse and always returns `z = 0` |
| `viewToModelXY( x, y )` → `Vector3` | Convenience form of the above |
| `viewToModelDelta( delta: Vector2 )` / `viewToModelDeltaXY( dx, dy )` → `Vector3` | Inverse-delta versions, again fixed at `z = 0` |
| `viewToModelShape( viewShape: Shape )` / `viewToModelBounds( viewBounds: Bounds2 )` | Inverse shape/bounds transforms, via the 2D transform |

::: warning View-to-model is not a true inverse of model-to-view
Because the forward projection collapses a 3D point onto a 2D plane, there is no unique 3D point to recover from a 2D view coordinate. Every `viewToModel*` method resolves this by ignoring depth entirely and returning `z = 0` — it inverts only the underlying 2D `ModelViewTransform2`, not the yaw/pitch projection. Don't expect `viewToModelPosition( modelToViewPosition( p ) )` to round-trip back to `p` unless `p.z` was already `0`.
:::
