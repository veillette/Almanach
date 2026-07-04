---
title: The Multilink Pattern
description: Combining multiple Properties into one derived reaction.
category: patterns
tags: [axon, Multilink, DerivedProperty]
status: verified
related:
  - /api/axon/multilink
  - /api/axon/derived-property
  - /api/axon/property
  - /patterns/model-view-separation
prerequisites:
  - /patterns/model-view-separation
---

# The Multilink Pattern

When a callback needs to react to *several* Properties at once, don't `link` to each one and re-run the same logic from multiple call sites — use `Multilink.multilink`, which fires once with the current value of every dependency, and again whenever any of them changes. It's the side-effecting sibling of `DerivedProperty`: use `DerivedProperty` when the combination produces a new value to store, use `Multilink` when it produces an effect (a repaint, a sound, a log line) with no value to keep.

## The core idea

```ts
import { Multilink, NumberProperty, BooleanProperty } from 'scenerystack/axon';

const massProperty = new NumberProperty( 5 );
const gravityProperty = new NumberProperty( 9.8 );
const isPausedProperty = new BooleanProperty( false );

// Fires immediately with the current values, then again on every subsequent change.
const multilink = Multilink.multilink(
  [ massProperty, gravityProperty, isPausedProperty ],
  ( mass, gravity, isPaused ) => {
    console.log( `weight = ${ mass * gravity } N, paused = ${ isPaused }` );
  }
);

// Later, if this reaction has a lifetime shorter than its dependencies:
Multilink.unmultilink( multilink );
```

`new Multilink( dependencies, callback, lazy? )` is the equivalent instance form — reach for it only when you need a handle without going through the static helper (for example, to pass `lazy: true` and skip the initial call). Prefer `Multilink.multilink` for the common case, since constructing a `Multilink` you never reference is just an unused variable with no compensating benefit.

## Multilink vs. DerivedProperty

| | `Multilink` | `DerivedProperty` |
| --- | --- | --- |
| Produces | Nothing — runs a callback | A new `TReadOnlyProperty<T>` value |
| Use when | The reaction is an effect (repaint a Node, play a sound) | The combination *is* state other code should read/observe |
| Disposal | `Multilink.unmultilink( multilink )` | `derivedProperty.dispose()` |

```ts
import { DerivedProperty } from 'scenerystack/axon';

// Prefer this over a Multilink when the combined value is itself state:
const weightProperty = new DerivedProperty(
  [ massProperty, gravityProperty ],
  ( mass, gravity ) => mass * gravity
);
```

::: tip Dispose Multilinks that outlive their dependencies
`Multilink.multilink` returns the `Multilink` instance so you can call `Multilink.unmultilink` on it. If the object doing the linking (a Node, a view) is disposed before its dependency Properties are, failing to unmultilink leaks a listener on each dependency — see [Dispose and Memory Management](/patterns/dispose-and-memory-management). If you don't need the handle because both sides share the same lifetime (e.g. a model linking its own Properties in its constructor), it's fine to ignore the return value.
:::
