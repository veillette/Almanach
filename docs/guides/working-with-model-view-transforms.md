---
title: Working with Model-View Transforms
description: Why SceneryStack simulations separate model coordinates from view pixels, and the common ModelViewTransform2 usage patterns that follow from it.
category: guides
tags: [phetcommon, dot, coordinates, transform, ModelViewTransform2]
status: complete
related:
  - /api/phetcommon/model-view-transform
  - /patterns/model-view-separation
  - /patterns/drag-listeners
  - /guides/scenery-basics
prerequisites:
  - /patterns/model-view-separation
  - /api/phetcommon/model-view-transform
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Working with Model-View Transforms

[`ModelViewTransform2`](/api/phetcommon/model-view-transform) is a small, specific class — a handful of factory methods and `modelToView*`/`viewToModel*` conversions. This guide is the broader "why," and a tour of where a single transform instance actually shows up across a screen's model and view code, once you've adopted the convention.

## Why separate model coordinates from view pixels at all

[Model-View Separation](/patterns/model-view-separation) already establishes that a model's state should be plain data with no scenery imports. Coordinates are where that principle is easiest to violate by accident: it's tempting for a model's `positionProperty` to just hold "pixels from the top-left," since that's ultimately what gets drawn. Two things go wrong once you do that:

- **The model becomes coupled to one specific view size.** A `positionProperty` holding view pixels has no meaning independent of how large the `Display` happens to be — resizing the browser window, or reusing the model in a different layout, means the model's own numbers stop making physical sense.
- **Physics stops reading like physics.** A projectile's launch angle, a planet's orbital radius, a chemical concentration — these have natural units (degrees, meters, moles) with real-world magnitudes and, often, a "up is positive" convention. Scenery pixels are y-down and have no inherent unit; forcing model state into that frame means every physics formula in the model has to fight the coordinate system instead of expressing the physics directly.

Keeping the model in physical, y-up units and doing every pixel conversion at the view boundary — through exactly one `ModelViewTransform2` instance per screen — means the model reads like the physics it represents, and the *only* place "pixels" and "y-down" enter the codebase at all is the small set of view classes that call the transform.

## Where one transform instance travels

A screen typically constructs exactly one `ModelViewTransform2` (in the `ScreenView`'s constructor, sized against `this.layoutBounds`) and threads that same instance to everywhere it's needed — it's not recreated per view Node:

```ts
import { ModelViewTransform2 } from 'scenerystack/phetcommon';
import { Vector2 } from 'scenerystack/dot';
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';

class ProjectileScreenView extends ScreenView {
  public constructor( model: ProjectileModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    const modelViewTransform = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
      Vector2.ZERO,
      new Vector2( this.layoutBounds.centerX, this.layoutBounds.maxY - 100 ),
      50
    );

    // The same instance flows to every view class that needs to convert coordinates.
    const projectileNode = new ProjectileBodyNode( model, modelViewTransform );
    // ...and to any drag listener moving a model Property through pointer input.
  }
}
```

The three places it typically shows up:

| Consumer | What it converts |
| --- | --- |
| A view `Node`'s constructor, linking `model.positionProperty` | Model position → `translation`, via `modelToViewPosition` (see [Model-View Separation](/patterns/model-view-separation)) |
| A [drag listener](/patterns/drag-listeners)'s `transform` option | Pointer motion in view pixels → the model `Property` it writes, automatically, in both directions |
| Anything sizing a Node from a model quantity (a radius, a velocity vector) | Model-space *deltas* → view-space deltas, via `modelToViewDeltaX`/`modelToViewDelta` — never the position methods, which also apply translation |

Passing the transform down as a constructor argument (rather than each view class constructing its own) is what guarantees every Node in a screen agrees on the same mapping — two Nodes built from different transform instances would each convert correctly in isolation but disagree with each other about where the same model point belongs on screen.

## Choosing y-inverted vs. not

Most physics-flavored simulations want `createSinglePointScaleInvertedYMapping` — model y increases upward (matching how most physics is taught and written), view y increases downward (matching scenery/CSS/canvas convention), and the transform's job is exactly to reconcile that mismatch once, in one place. A simulation whose "model" is itself already screen-like (a diagram editor, something with no physical y-up convention to preserve) can reach for the non-inverted `createSinglePointScaleMapping` instead — the choice is about whether the model's own y-axis has an inherent "up" direction worth preserving, not a default to apply unconditionally.

::: tip One transform per screen is the common case, not a strict rule
A screen with multiple independent visual regions at different scales (a small inset chart alongside a large main view, for instance) may legitimately need more than one `ModelViewTransform2` — one per region, each mapping the same underlying model quantity to that region's own view scale. What doesn't scale is constructing a *new* transform per Node for the same region — that reintroduces exactly the risk (Nodes disagreeing about the mapping) the shared-instance convention exists to prevent.
:::

## Where to go next

- [ModelViewTransform2](/api/phetcommon/model-view-transform) — the class reference: constructors, methods, and the positions-vs-deltas distinction in full
- [Drag Listeners](/patterns/drag-listeners) — the `transform` option that lets a `DragListener` convert pointer motion automatically
- [Model-View Separation](/patterns/model-view-separation) — the broader architecture this coordinate convention is one instance of
