---
title: State Persistence and Save/Restore Patterns
description: Structuring model state as enumerable Properties so it can be saved and restored, whether by PhET-iO or by a simulation's own save/load feature.
category: patterns
tags: [tandem, phet-io, Property, state, persistence]
status: complete
related:
  - /patterns/phet-io-instrumentation-pattern
  - /patterns/model-view-separation
  - /patterns/reset-all-pattern
prerequisites:
  - /patterns/model-view-separation
  - /patterns/phet-io-instrumentation-pattern
---

# State Persistence and Save/Restore Patterns

Any "save state now, restore it later" feature — a PhET-iO wrapper capturing/loading a full sim state, a simulation's own "save my setup" button, undo/redo — depends on the same precondition: **the model's entire mutable state is enumerable as a set of `Property` values**, with nothing important living in a local variable, a closure, or a field that isn't a `Property`. [Model-View Separation](/patterns/model-view-separation) already asks for this as an architecture rule; this page is about the save/restore consequence of following (or not following) it.

## Why Property-based state is what makes this mechanical

```ts
class ProjectileModel {
  public readonly angleProperty = new NumberProperty( 45 );
  public readonly speedProperty = new NumberProperty( 10 );
  public readonly isRunningProperty = new BooleanProperty( false );

  // Anything NOT expressed as a Property here (a plain field, a variable in step())
  // is state a generic save/restore mechanism cannot see and cannot capture.
}
```

Because every piece of state above is a `Property`, "capture the current state" and "restore a captured state" are both generic operations that don't need to know anything about `ProjectileModel` specifically:

```ts
// Capture: walk every state Property and record its value.
function captureState( model: ProjectileModel ) {
  return {
    angle: model.angleProperty.value,
    speed: model.speedProperty.value,
    isRunning: model.isRunningProperty.value
  };
}

// Restore: write each value back. Every observer (view, DerivedProperty, PhET-iO)
// updates itself automatically because it was already observing the Property, not
// a snapshot of it.
function restoreState( model: ProjectileModel, state: ReturnType<typeof captureState> ): void {
  model.angleProperty.value = state.angle;
  model.speedProperty.value = state.speed;
  model.isRunningProperty.value = state.isRunning;
}
```

If a simulation-specific save/restore feature is needed, this is roughly what it looks like hand-rolled — but in a PhET-iO-instrumented sim (see [PhET-iO Instrumentation Pattern](/patterns/phet-io-instrumentation-pattern)), the equivalent capture/restore already exists for every instrumented `Property`, driven by each one's `phetioType`/`phetioValueType`, with no simulation-specific code to write at all.

## What must NOT be state

| Belongs in a Property (save/restore sees it) | Does not belong in a Property (deliberately invisible to save/restore) |
| --- | --- |
| Anything the user set or that represents the model's condition (`angleProperty`, `isRunningProperty`) | Purely derived values recomputed from other state — see below |
| A `DerivedProperty`, marked `phetioReadOnly` if instrumented | View-only transient state (an in-progress drag offset, a tooltip's hover flag) |

A `DerivedProperty` is a special case: it *is* state a client can read, but it must never be independently restored — restoring its inputs is sufficient, and PhET-iO's state engine already knows not to treat a `phetioReadOnly` Property as settable. Trying to hand-restore a derived value directly just means it will immediately be overwritten (or worse, drift out of sync) the next time its dependencies change.

```ts
// Don't restore this directly - restoring angleProperty is enough; heightAtLaunchProperty
// recomputes itself from the DerivedProperty wiring set up in the constructor.
public readonly heightAtLaunchProperty = new DerivedProperty(
  [ this.angleProperty ],
  angle => Math.sin( angle )
);
```

## Reset is the smallest save/restore case

`reset()` (see [The Reset-All Pattern](/patterns/reset-all-pattern)) is the degenerate case of this same idea: "restore" a fixed, known state (each Property's `initialValue`) rather than an arbitrary captured one. A model that can correctly implement `reset()` by calling `.reset()` on every one of its Properties has, by construction, already satisfied the harder requirement of being fully save/restorable — which is a useful test to apply while designing a model, even in a sim that has no PhET-iO or save-feature plans yet.

::: tip Design for save/restore even if you never build a save feature
Keeping every piece of mutable state in a `Property` costs nothing extra to write and pays off in three unrelated ways at once: `reset()` becomes mechanical, PhET-iO state save/restore works with zero bespoke code if the sim is ever instrumented, and a future undo/redo feature has something to hang its capture step on. The alternative — state hidden in closures or plain fields — has to be refactored out retroactively the moment any of those three needs shows up.
:::
