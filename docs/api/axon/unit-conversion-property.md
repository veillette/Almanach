---
title: UnitConversionProperty
description: A derived, bidirectional Property that converts a numeric Property's value (and range) between units via a fixed multiplicative factor.
category: api
library: axon
tags: [axon, UnitConversionProperty, MappedProperty, Property, units]
status: verified
prerequisites:
  - /api/axon/property
related:
  - /api/axon/dynamic-property
  - /api/axon/number-property
  - /api/dot/range
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# UnitConversionProperty

`UnitConversionProperty` (from `scenerystack/axon`) is a `MappedProperty<number, number>` (itself built on [`DynamicProperty`](/api/axon/dynamic-property)) specialized for the single most common numeric-derivation need: showing the same underlying quantity in different units. Give it a source Property and a `factor`, and it produces a new `number` Property that stays in sync in both directions — including tracking the source's `Range`, if it has one.

```ts
import { UnitConversionProperty, NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';

const metersProperty = new NumberProperty( 0.5, { range: new Range( 0, 1 ) } );
const centimetersProperty = new UnitConversionProperty( metersProperty, { factor: 100 } );

centimetersProperty.value; // 50
centimetersProperty.range; // Range( 0, 100 ) — derived from metersProperty's range

metersProperty.value = 0.25;
centimetersProperty.value; // 25 — one-way sync happens automatically

centimetersProperty.value = 100; // bidirectional by default
metersProperty.value; // 1
```

## Constructor

```ts
new UnitConversionProperty( property: TReadOnlyProperty<number> | TRangedProperty, providedOptions: UnitConversionPropertyOptions )
```

`property` may be any numeric Property, or specifically a ranged one (like [`NumberProperty`](/api/axon/number-property)) to get automatic range conversion.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `factor` | — | **Required.** The multiplicative factor from the source's units to this Property's units — `this.value === factor * property.value` |
| `bidirectional` | `true` | Unlike the general `MappedProperty`/`DynamicProperty` (which default to one-way), `UnitConversionProperty` defaults to two-way sync, since `map`/`inverseMap` are always derivable from `factor` |
| `map` / `inverseMap` | derived from `factor` | Overridable, but normally left alone — `UnitConversionProperty` builds `value => value * factor` and `value => value / factor` for you |

## Members

| Member | Effect |
| --- | --- |
| `range` (getter/setter) | The converted `Range`, tracked automatically from the source Property's `rangeProperty` if it has one (otherwise a default unbounded range) |
| `rangeProperty` | The underlying `Property<Range>` backing `.range` |

::: warning Setting `.range` directly is not yet bidirectional
The doc comment on the source is explicit about this: assigning `centimetersProperty.range = ...` updates this Property's own `rangeProperty` but does **not** push a converted range back onto the source Property's range. Range synchronization only flows from the source outward; only the `.value` sync is bidirectional.
:::
