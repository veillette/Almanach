---
title: Immutable vs. Mutable Model Data
description: When model state should be an immutable value object replaced wholesale via property.value = newValue, versus mutated in place - and why SceneryStack's math types default to returning new instances.
category: patterns
tags: [dot, Vector2, Bounds2, Property, immutability, performance]
status: complete
related:
  - /api/dot/vector2
  - /api/dot/bounds2
  - /api/axon/property
  - /patterns/model-view-separation
prerequisites:
  - /patterns/model-view-separation
  - /api/axon/property
---

# Immutable vs. Mutable Model Data

`Property<T>` notifies its listeners by comparing whether `.value` *changed* — for that comparison to mean anything, the value it holds needs to actually be a new, distinct value when something changes, not the same object with different contents. This is why SceneryStack's math types (`Vector2`, `Bounds2`, and the rest of `dot`) default to a functional style — `.plus()`, `.times()`, `.withMagnitude()` all return a *new* instance rather than modifying the receiver — and why the default, correct way to update a `Property<Vector2>` is replacing the whole value, not mutating the vector already sitting inside it.

## The default: replace, don't mutate

```ts
import { Vector2 } from 'scenerystack/dot';
import { Property } from 'scenerystack/axon';

const positionProperty = new Property( new Vector2( 0, 0 ) );

positionProperty.link( position => console.log( 'moved to', position.toString() ) );

// Correct: .plus() returns a new Vector2; assigning it to .value fires listeners.
positionProperty.value = positionProperty.value.plus( new Vector2( 1, 0 ) );
```

```ts
// Wrong: mutates the Vector2 already stored in the Property in place.
positionProperty.value.x += 1; // Property never fires - .value itself didn't change (same object).
```

The second example is the single most common bug this pattern guards against: `Property.set()` only notifies listeners when the *new* value differs from the old one by its equality check (by default, `!==` on the reference for object types) — mutating the existing object's fields in place leaves `.value` pointing at the exact same reference, so nothing fires, and every view observing `positionProperty` silently goes stale.

## Why the math types are built this way

`Vector2.plus( other )`, `Bounds2.dilated( amount )`, and their siblings across `dot` all return a new instance instead of mutating the receiver specifically so that "the model state changed" and "the object I'm holding was mutated" stay the same question, not two questions that can drift apart. If `.plus()` mutated the receiver, `positionProperty.value.plus( delta )` would silently corrupt the value already stored in the Property (correctly *changing* the model, but through a side channel `Property` never observed, so no listener would fire) — the functional style makes "did I actually get a new value" and "did I remember to reassign `.value`" the same act.

## When in-place mutation is the right call

Not everything should be wrapped in a fresh object on every change. In-place mutation is appropriate — and is what `dot`'s types offer via a parallel set of mutating methods (`vector.setXY( x, y )`, `vector.add( delta )`, `bounds.dilate( amount )`, consistently distinguished by name from their non-mutating counterparts — see [Vector2](/api/dot/vector2#immutable-vs-mutable-methods) and [Bounds2](/api/dot/bounds2) for the full immutable/mutable method tables) — when:

| Prefer mutating in place | Prefer replacing the value |
| --- | --- |
| The object is *not* itself a `Property`'s `.value` — it's a private working buffer/accumulator local to one method, never observed directly | The object *is* what a `Property` holds, and other code needs to be notified when it changes |
| A hot per-frame loop (particle simulation, many-body physics) where allocating a new `Vector2` per object per frame is a measurable performance cost | Correctness/observability matters more than the allocation cost — the overwhelming majority of simulation model state |
| The mutated object's identity genuinely doesn't matter to anyone downstream | Something (a view, a `DerivedProperty`, PhET-iO state capture) needs to react specifically to *this* value changing |

```ts
// A hot inner loop updating many particles' positions per frame: mutating in place
// avoids allocating a new Vector2 per particle per frame, and nothing observes
// each particle's position as an individual Property - only the aggregate render matters.
for ( const particle of particles ) {
  particle.position.add( particle.velocity.timesScalar( dt ) ); // in-place, by design
}
```

The distinguishing question is always the same: **is this value the thing a `Property` (or anything else) is watching for changes?** If yes, replace it and let the Property's own change-detection do its job. If it's a private, unobserved working value, in-place mutation is a legitimate and sometimes necessary optimization — just make sure it never leaks into being a `Property`'s `.value` by reference, where the same mutation would silently defeat change notification.

::: warning A mutated object inside a Property is a specific, easy-to-miss bug
Because `position.x += 1` and `positionProperty.value = position.plusXY( 1, 0 )` look similar and both "work" in the sense that `position.x` ends up correct either way, this bug doesn't show up as a crash — it shows up as a view that mysteriously stops updating, or a `DerivedProperty` that never recomputes, with no error anywhere. If a Property-backed value ever needs updating, reach for the non-mutating method (`.plus()`, `.with*()`) and reassign `.value`, never a mutating method (`.add()`, `.set*()`) called on `property.value` directly.
:::
