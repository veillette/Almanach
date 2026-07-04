---
title: EnumerationValue
description: The base class instances of a PhET-style closed enumeration extend, providing name/enumeration bookkeeping once paired with Enumeration.
category: api
library: phet-core
tags: [phet-core, EnumerationValue, Enumeration, enumeration]
status: verified
prerequisites:
  - /patterns/enumeration-pattern
related:
  - /patterns/enumeration-pattern
  - /api/phet-core/optionize-and-merge
  - /api/axon/enumeration-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# EnumerationValue

`EnumerationValue` (from `scenerystack/phet-core`) is the base class every value of a closed, PhET-style enumeration extends — see [the Enumeration Pattern](/patterns/enumeration-pattern) for the full "why" and a worked example. This page documents `EnumerationValue` itself: what it provides once its sibling class `Enumeration` has scanned a subclass's static instances and wired them up.

```ts
import { EnumerationValue, Enumeration } from 'scenerystack/phet-core';
```

## Usage

```ts
class Direction extends EnumerationValue {
  public static readonly NORTH = new Direction();
  public static readonly SOUTH = new Direction();

  // Must come last: scans the static instances declared above.
  public static readonly enumeration = new Enumeration( Direction );
}

Direction.NORTH.name;              // 'NORTH' - filled in by the Enumeration constructor
Direction.NORTH.enumeration.values; // [ Direction.NORTH, Direction.SOUTH ]
Direction.NORTH.toString();        // 'NORTH'
```

Before `new Enumeration( Direction )` runs, a freshly-constructed `EnumerationValue`'s `name` and `enumeration` are unset — reading them throws. `Enumeration`'s constructor walks `Object.keys` on the class (and its supertypes, to support augmenting an existing enumeration) looking for `instanceof` matches, and assigns `name`/`enumeration` on each one it finds, in declaration order.

## Members

| Member | Description |
| --- | --- |
| `name` (getter) | The static property key the instance was assigned to (e.g. `'NORTH'`); throws if read before `Enumeration` has run |
| `enumeration` (getter) | The owning `Enumeration<this>` instance; throws if read before `Enumeration` has run |
| `toString()` | Returns `name` |
| `EnumerationValue.sealedCache` | A `Set` of constructors that already have an `Enumeration` built for them — `Enumeration`'s constructor adds to it, and the base `EnumerationValue` constructor throws if you try to `new` a sealed constructor directly (subclassing it further is still fine) |

`name` and `enumeration` are set-once: assigning either a second time throws, which is what makes them safe to treat as immutable identity after construction.

::: warning You cannot construct new values after `Enumeration` has run
Calling `new Enumeration( Direction )` seals `Direction` in `EnumerationValue.sealedCache` — any subsequent `new Direction()` throws. Declare every static instance *before* the `public static readonly enumeration = new Enumeration( Direction )` line, and add that line last, exactly once, per concrete enumeration class.
:::
