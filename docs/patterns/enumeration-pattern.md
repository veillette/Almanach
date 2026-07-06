---
title: The Enumeration Pattern
description: Modeling closed sets of values instead of string literals.
category: patterns
tags:
  - axon
  - EnumerationProperty
  - enumeration
status: verified
related:
  - /api/axon/enumeration-property
  - /patterns/options-pattern
  - /patterns/model-view-separation
  - /api/phet-core/enumeration-value
prerequisites:
  - /patterns/model-view-separation
sourceRefs:
  - 'https://www.npmjs.com/package/scenerystack'
  - 'https://scenerystack.org/reference/'
---

# The Enumeration Pattern

When a piece of model state can only be one of a fixed, known set of values (a mode, a phase, a display style), model it as an `EnumerationValue` subclass plus `Enumeration`, not a string-literal union or a plain number. The pattern gives you real object identity for `===` comparisons and `switch`, automatic PhET-iO serialization, and a `Property` (`EnumerationProperty`) that validates writes against exactly that set of values at runtime — a raw `string` union only checks at compile time.

## The core idea

```ts
import { EnumerationValue, Enumeration } from 'scenerystack/phet-core';
import { EnumerationProperty } from 'scenerystack/axon';

// 1. One class instance per value. All static, declared before `enumeration`.
class Intensity extends EnumerationValue {
  public static readonly HIGH = new Intensity();
  public static readonly LOW = new Intensity();

  // 2. Must be declared last — collects every static instance defined above it.
  public static readonly enumeration = new Enumeration( Intensity );
}

// 3. A Property restricted to Intensity's values, validated at runtime.
const intensityProperty = new EnumerationProperty( Intensity.LOW );

intensityProperty.link( intensity => {
  console.log( 'intensity is now', intensity.toString() ); // 'HIGH' or 'LOW'
} );

intensityProperty.value = Intensity.HIGH; // fine
// intensityProperty.value = 'HIGH';      // compile-time AND runtime error - not an Intensity instance
```

Branch on values with `===` or `switch`, exactly like you would with a real enum:

```ts
function describe( intensity: Intensity ): string {
  switch( intensity ) {
    case Intensity.HIGH: return 'strong';
    case Intensity.LOW: return 'gentle';
    default: throw new Error( `unhandled Intensity: ${ intensity }` );
  }
}
```

## Why not a string union?

| | `'high' \| 'low'` string union | `EnumerationValue` + `Enumeration` |
| --- | --- | --- |
| Compile-time safety | Yes | Yes |
| Runtime validation (e.g. bad PhET-iO state, a typo from external code) | None | `EnumerationProperty` throws if the value isn't a member |
| Iterating all values | Requires a separately-maintained array | `Intensity.enumeration.values` (in declaration order) |
| PhET-iO serialization | Needs a hand-written `StringUnionIO` | Automatic `EnumerationIO` |

::: tip Declare `enumeration` last, and never construct new instances elsewhere
`Enumeration`'s constructor walks the class's static properties to find every `Intensity` instance, so `public static readonly enumeration = new Enumeration( Intensity )` must be the last static field in the class. `EnumerationValue`'s constructor also seals the class after construction — attempting `new Intensity()` from outside the class body throws, which is what guarantees `Intensity.HIGH` and `Intensity.LOW` are the only two instances that will ever exist.
:::
