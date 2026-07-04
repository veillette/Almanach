---
title: EnumerationProperty
description: A Property restricted to the values of an EnumerationValue subclass.
category: api
library: axon
tags: [axon, EnumerationProperty]
status: complete
prerequisites:
  - /api/axon/property
related:
  - /api/axon/string-property
  - /api/axon/derived-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# EnumerationProperty

`EnumerationProperty<T>` (from `scenerystack/axon`) is a [`Property`](/api/axon/property) whose value is restricted to the instances of a rich [`EnumerationValue`](https://www.npmjs.com/package/scenerystack) subclass, PhET's typed alternative to string-union "enums." It automatically fills in `validValues` from the enumeration and wires up the matching PhET-iO `EnumerationIO`.

```ts
import { EnumerationProperty } from 'scenerystack/axon';
import { Enumeration, EnumerationValue } from 'scenerystack/phet-core';

class SimSpeed extends EnumerationValue {
  public static readonly NORMAL = new SimSpeed();
  public static readonly SLOW = new SimSpeed();

  // Must be declared last, once all values above exist.
  public static readonly enumeration = new Enumeration( SimSpeed );
}

const simSpeedProperty = new EnumerationProperty( SimSpeed.NORMAL );

simSpeedProperty.link( speed => console.log( 'speed:', speed.toString() ) );
simSpeedProperty.value = SimSpeed.SLOW;
```

The PhET enumeration pattern (from `EnumerationValue`'s own documentation): declare each value as a `static readonly` instance of the class, then declare `static readonly enumeration = new Enumeration( MyClass )` last, after every value exists. `EnumerationValue` seals the class at that point — you can no longer construct new instances of it directly (subclassing is still allowed).

## Options

`EnumerationPropertyOptions<T>` extends [`PropertyOptions<T>`](/api/axon/property) (minus `phetioValueType`, which `EnumerationProperty` fills in for you) with one addition:

| Option | Effect |
| --- | --- |
| `enumeration` | The `Enumeration<T>` to validate against. Defaults to `value.enumeration` (read off the initial value); provide it explicitly only if you're subtyping an enumeration and need to pin the subtype's enumeration |

```ts
const speedProperty = new EnumerationProperty( SimSpeed.NORMAL, {
  enumeration: SimSpeed.enumeration // usually unnecessary — inferred from `value`
} );
```

::: tip Exhaustiveness over string unions
Prefer `EnumerationProperty` over a [`StringProperty`](/api/axon/string-property) with `validValues` whenever the value represents a closed set of named states. TypeScript can exhaustively check `switch` statements over `EnumerationValue` instances, and the enumeration's `.values` array (`SimSpeed.enumeration.values`) is available at runtime for building UI like radio button groups.
:::
