---
title: Model-View Separation
description: The foundational SceneryStack architecture - axon Properties form the model, scenery Nodes observe it, and nothing flows the other way.
category: patterns
tags: [architecture, axon, Property, DerivedProperty, MVC]
status: complete
related:
  - /api/phetcommon/model-view-transform
  - /getting-started/what-is-scenerystack
---

# Model-View Separation

Every SceneryStack application is built around a strict one-way dependency: the **model** is a plain TypeScript object graph whose state lives in axon `Property` instances, and the **view** is a scenery `Node` tree that *observes* the model. The model never imports from the view, never mentions pixels, and can run headless in a unit test.

## The model: axon Properties

```ts
import { NumberProperty, Property, DerivedProperty } from 'scenerystack/axon';
import { Vector2 } from 'scenerystack/dot';

export class ProjectileModel {

  // Mutable state is a Property. Physical units only — meters, seconds.
  public readonly positionProperty = new Property( new Vector2( 0, 0 ) );
  public readonly massProperty = new NumberProperty( 5 ); // kg

  // Derived state is a DerivedProperty: never stored redundantly, never stale.
  public readonly weightProperty: DerivedProperty<number, [ number ]>;

  public constructor() {
    this.weightProperty = new DerivedProperty( [ this.massProperty ], mass => mass * 9.8 );
  }

  public step( dt: number ): void {
    // Advance physics in model units; observers update automatically.
  }

  public reset(): void {
    this.positionProperty.reset();
    this.massProperty.reset();
  }
}
```

Guidelines:

- Expose Properties as `public readonly`; mutate their `.value`, not the field.
- Anything computable from other state should be a `DerivedProperty`, not a second source of truth.
- Discrete events that aren't state (a collision, a reset) use `Emitter`.
- Provide a `reset()` that resets every Property — the standard Reset All button calls it.

## The view: observing, never owning state

```ts
import { Circle } from 'scenerystack/scenery';
import { ModelViewTransform2 } from 'scenerystack/phetcommon';

export class ProjectileNode extends Circle {
  public constructor( model: ProjectileModel, modelViewTransform: ModelViewTransform2 ) {
    super( 15, { fill: 'orange' } );

    // View subscribes to the model. Conversion to pixels happens here, at the
    // boundary, via the transform — see /api/phetcommon/model-view-transform.
    model.positionProperty.link( position => {
      this.translation = modelViewTransform.modelToViewPosition( position );
    } );
  }
}
```

When the view needs to *change* the model (a slider, a [drag listener](/patterns/drag-listeners)), it writes to the model's Properties — it does not keep its own copy:

```ts
massSlider = new HSlider( model.massProperty, model.massProperty.range );
```

The Property is the single source of truth; the slider both writes it and reacts to it, so external changes (reset, PhET-iO, another control) stay consistent for free.

## Why this matters at scale

- **Testability** — the model runs and is assertable without a DOM.
- **Multiple views** — a chart, a readout, and the scene graph can all observe the same Property without coordination.
- **Reset, undo, PhET-iO serialization** — all become mechanical when state is enumerable Properties instead of scattered fields.
