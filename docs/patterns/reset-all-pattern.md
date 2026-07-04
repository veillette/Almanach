---
title: The Reset-All Pattern
description: Wiring every model Property's reset() through one ResetAllButton.
category: patterns
tags: [reset, ResetAllButton, Property]
status: verified
related:
  - /api/scenery-phet/reset-all-button
  - /api/axon/property
  - /patterns/model-view-separation
prerequisites:
  - /patterns/model-view-separation
---

# The Reset-All Pattern

Every SceneryStack screen has exactly one `ResetAllButton`, and its `listener` calls exactly one method: the model's own `reset()`, which in turn resets every `Property` the model owns back to its `initialValue`. Individual view components never reset themselves independently — they simply observe the Properties the model just reset, the same way they observe any other change. Centralizing on `model.reset()` is what guarantees "reset" always means *everything goes back to how the sim started*, not "everything I remembered to wire up."

## The core idea

```ts
import { NumberProperty, Property } from 'scenerystack/axon';
import { Vector2 } from 'scenerystack/dot';

class ProjectileModel {
  public readonly positionProperty = new Property( new Vector2( 0, 0 ) );
  public readonly angleProperty = new NumberProperty( 45 ); // degrees
  public readonly speedProperty = new NumberProperty( 20 ); // m/s

  // One reset() that resets every Property this model owns. Nothing is forgotten
  // because every piece of state lives here, in one place - see Model-View Separation.
  public reset(): void {
    this.positionProperty.reset();
    this.angleProperty.reset();
    this.speedProperty.reset();
  }
}
```

```ts
import { ResetAllButton } from 'scenerystack/scenery-phet';

class ProjectileScreenView /* extends ScreenView */ {
  public constructor( model: ProjectileModel ) {

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
        // view-only state (not Properties, e.g. a transient animation) resets here too, if any exists
      },
      right: /* layoutBounds.maxX */ 0 - 20,
      bottom: /* layoutBounds.maxY */ 0 - 20
    } );

    // this.addChild( resetAllButton );
  }
}
```

## What belongs in `reset()`

| Belongs in `model.reset()` | Does not belong |
| --- | --- |
| Every `Property` the model owns (`positionProperty.reset()`, ...) | View-only, non-`Property` state — rebuild it directly in the button's `listener`, not inside the model |
| Derived state — nothing, `DerivedProperty` recomputes automatically once its dependencies reset | Anything with its own persisted `Property` elsewhere — call that object's own `reset()` from here instead of duplicating logic |

If a screen composes several sub-models, each sub-model gets its own `reset()`, and the top-level model's `reset()` calls each in turn — the `ResetAllButton` still only ever calls the one top-level `reset()`.

::: tip Never reset the view directly
Resist the temptation to have `ResetAllButton`'s listener also manipulate view Nodes directly (hide a tooltip, reset a slider's visual thumb position). If the view is purely observing model Properties as described in [Model-View Separation](/patterns/model-view-separation), resetting the model is sufficient — the view updates itself through the same links it always uses. Reaching into the view from the reset listener is a sign a piece of state is being tracked outside the model.
:::
