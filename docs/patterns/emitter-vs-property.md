---
title: Emitter vs. Property
description: When to model state as a Property versus a discrete event as an Emitter.
category: patterns
tags: [axon, Emitter, Property, architecture]
status: verified
related:
  - /patterns/model-view-separation
  - /api/axon/property
  - /api/axon/emitter
  - /api/axon/derived-property
prerequisites:
  - /patterns/model-view-separation
---

# Emitter vs. Property

The axon library gives you two different primitives for "something changed," and picking the wrong one is a common source of bugs: a **Property** holds a *value* that persists between reads (ask it "what is the current state?" any time), while an **Emitter** fires a *momentary event* that has no state at all — if nobody was listening when it fired, that information is gone. Model anything that answers "what is it right now?" as a Property; model anything that answers "did X just happen?" as an Emitter.

## The core idea

```ts
import { Property, BooleanProperty, Emitter } from 'scenerystack/axon';

class BallModel {

  // STATE: has a current value at every instant, observers can read .value at any time.
  public readonly positionProperty = new Property( 0 );
  public readonly isMovingProperty = new BooleanProperty( false );

  // EVENT: a discrete occurrence with no persisted value. A listener added
  // a moment after the bounce will simply never know it happened.
  public readonly bouncedEmitter = new Emitter<[ speed: number ]>( {
    parameters: [ { valueType: 'number' } ]
  } );

  public step( dt: number ): void {
    // ...advance the physics...
    const hitWall = false; // placeholder for a real collision check
    if ( hitWall ) {
      this.bouncedEmitter.emit( 3.2 ); // notify listeners of the bounce speed
    }
  }
}

const ball = new BallModel();
ball.positionProperty.link( position => console.log( 'position is now', position ) );
ball.bouncedEmitter.addListener( speed => console.log( 'bounced at', speed ) );
```

## Deciding which one to reach for

| Question | Use |
| --- | --- |
| "Can I ask for the current value at an arbitrary later time?" | `Property` (or `DerivedProperty` if it's computed from other Properties) |
| "Does a UI element need to bind to this (a slider, a checkbox, a readout)?" | `Property` — controls read and write `.value` |
| "Is this a one-time occurrence with no lasting value (a collision, a button press, 'level completed')?" | `Emitter` |
| "Would storing it as a boolean/enum Property force an awkward reset back to `false` right after reading it?" | `Emitter` — that's a sign it was never really state |

::: tip Don't fake an event with a Property
A common anti-pattern is a `collidedProperty: BooleanProperty` that gets set to `true` and then immediately reset to `false` so it can be "triggered" again. This is strictly worse than an `Emitter<[]>`: it forces every listener to use `lazyLink` and reason about ordering, and two collisions in the same frame collapse into one notification. If you find yourself resetting a Property right after setting it, it isn't state — model it as an `Emitter` instead.
:::
