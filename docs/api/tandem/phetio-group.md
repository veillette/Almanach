---
title: PhetioGroup
description: A PhET-iO-aware container for a dynamically-growing/shrinking collection of instrumented elements, like electrons created during a sim.
category: api
library: tandem
tags: [tandem, phet-io, PhetioGroup, dynamic-elements]
status: verified
related:
  - /api/tandem/phetio-capsule
  - /api/tandem/phetio-object
  - /api/tandem/io-type
prerequisites:
  - /api/tandem/phetio-object
  - /guides/phet-io-and-instrumentation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PhetioGroup

`PhetioGroup` (from `scenerystack/tandem`) manages a dynamically-growing/shrinking collection of same-shaped [`PhetioObject`](/api/tandem/phetio-object)s — the PhET-iO-aware equivalent of `const particles: Particle[] = []` for state you want save/restore, API validation, and Studio visibility on. Use it whenever a sim creates and destroys an unbounded, indexed set of instrumented elements at runtime — particles, balloons, graph points — rather than pushing/splicing a plain array yourself.

```ts
import { PhetioGroup } from 'scenerystack/tandem';
import { Tandem } from 'scenerystack/tandem';

class Particle {
  public constructor( public readonly tandem: Tandem, public x: number ) {}
}

const particleGroup = new PhetioGroup(
  ( tandem, x: number ) => new Particle( tandem, x ), // createElement
  [ 0 ],                                              // defaultArguments, used to build the archetype
  { tandem: Tandem.REQUIRED.createTandem( 'particleGroup' ) }
);

const particle = particleGroup.createNextElement( 10 );
// ...later, when the particle should disappear:
particleGroup.disposeElement( particle );
```

The `createElement` function is called once up front (with `defaultArguments`) to build a hidden "archetype" — a template instance PhET-iO uses to know the group's element API and baseline metadata before any real elements exist — and again for every element you actually create via `createNextElement`. Elements are named `<groupName>_0`, `<groupName>_1`, … automatically, indexed from `groupElementStartingIndex` (default `1`).

## Methods

| Method | Effect |
| --- | --- |
| `createNextElement( ...args )` | Creates and adds an element at the next available index |
| `disposeElement( element )` | Removes an element from the group and disposes it, updating `countProperty` |
| `getArray()` / `getArrayCopy()` | Reference to (or a defensive copy of) the underlying elements array |
| `clear( options? )` | Disposes every element currently in the group |
| `forEach( action )` / `map( f )` / `filter( predicate )` / `find( predicate )` | Array-like iteration helpers over the group's elements |
| `includes( element )` / `indexOf( element )` | Membership/position queries |
| `getElement( index )` / `getLastElement()` | Direct indexed access |

## Key state

| Member | Description |
| --- | --- |
| `countProperty` | Read-only, PhET-iO-instrumented `NumberProperty` tracking the current element count |

## PhetioGroup vs. PhetioCapsule

Both are "dynamic element container" subclasses of the shared `PhetioDynamicElementContainer` base, and both build an archetype the same way — the difference is cardinality. `PhetioGroup` manages *many* same-shaped elements at once (an indexed, growable array); [`PhetioCapsule`](/api/tandem/phetio-capsule) manages *at most one* element that can be created, disposed, and recreated over the sim's lifetime (e.g. a lazily-created dialog). Reach for `PhetioGroup` when you're modeling "a collection," and `PhetioCapsule` when you're modeling "one optional/lazy thing."

::: warning `PhetioGroup` itself is not disposable
Calling `.dispose()` on the group container asserts — a `PhetioGroup` is meant to exist for the lifetime of the sim (or its owning screen), even as the *elements inside it* are created and disposed freely via `createNextElement`/`disposeElement`. If you need the container itself to go away, you're likely looking for a differently-scoped structure, not a disposed `PhetioGroup`.
:::
