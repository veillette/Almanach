---
title: ModelViewTransform2
description: Mapping between model coordinates (physical units, y-up) and view coordinates (pixels, y-down) with ModelViewTransform2.
category: api
library: phetcommon
tags: [phetcommon, dot, coordinates, transform, ModelViewTransform2]
status: complete
related:
  - /patterns/model-view-separation
  - /patterns/drag-listeners
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ModelViewTransform2

`ModelViewTransform2` (from `scenerystack/phetcommon`) converts between **model coordinates** — meters, moles, whatever your physics uses, typically with **y pointing up** — and **view coordinates** — scenery pixels, with **y pointing down**. Keeping the model in physical units and doing all conversion at the view boundary is a core SceneryStack convention; the model should never know about pixels.

```ts
import { ModelViewTransform2 } from 'scenerystack/phetcommon';
import { Vector2 } from 'scenerystack/dot';
```

## Creating a transform

The most common factory for physics-style simulations maps a single model point to a view point, applies a uniform scale, and inverts the y axis:

```ts
// Model origin at the horizontal center, 100 px from the bottom of the layout
// bounds; 1 model unit (e.g. 1 meter) = 50 view pixels; +y up in the model.
const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
  Vector2.ZERO,                                             // model point
  new Vector2( layoutBounds.centerX, layoutBounds.maxY - 100 ), // view point
  50                                                        // view units per model unit
);
```

Other factory methods:

| Factory | Use case |
| --- | --- |
| `createIdentity()` | Model units are view units (still useful as a placeholder) |
| `createOffsetScaleMapping( offset, scale )` | Translate + uniform scale, no y inversion |
| `createSinglePointScaleMapping( modelPoint, viewPoint, scale )` | Like the inverted-y version, but y-down in the model too |
| `createSinglePointScaleInvertedYMapping( modelPoint, viewPoint, scale )` | The standard choice for physics (y-up model) |
| `createRectangleMapping( modelBounds, viewBounds )` | Fit a model rectangle onto a view rectangle |
| `createRectangleInvertedYMapping( modelBounds, viewBounds )` | Same, with y inversion |

## Converting values

```ts
// Positions (affected by translation, scale, and y inversion)
const viewPosition = modelViewTransform.modelToViewPosition( body.positionProperty.value );
const modelPosition = modelViewTransform.viewToModelPosition( viewPoint );

// Deltas and distances (affected by scale only — no translation)
const viewDx = modelViewTransform.modelToViewDeltaX( body.radius );
const viewDelta = modelViewTransform.modelToViewDelta( velocity );

// Bounds and shapes
const viewBounds = modelViewTransform.modelToViewBounds( model.wallBounds );
const viewShape = modelViewTransform.modelToViewShape( orbitShape );
```

::: warning Positions vs. deltas
`modelToViewPosition` applies the full transform including translation. For *sizes*, *radii*, and *velocities*, use the delta methods (`modelToViewDeltaX`, `modelToViewDelta`, …) — otherwise the offset of the model origin gets baked into your lengths, and with an inverted-y mapping `modelToViewDeltaY` of a positive height is correctly **negative**.
:::

## Typical wiring in a view component

```ts
class BodyNode extends Circle {
  public constructor( body: Body, modelViewTransform: ModelViewTransform2 ) {
    super( modelViewTransform.modelToViewDeltaX( body.radius ), { fill: 'teal' } );

    body.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );
  }
}
```

The same transform instance is passed to [drag listeners](/patterns/drag-listeners) via their `transform` option, so pointer motion in view coordinates updates the model in model coordinates.
