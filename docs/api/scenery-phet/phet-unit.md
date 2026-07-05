---
title: PhetUnit
description: A rich enumeration-style unit value (e.g. meters, newtons) that a Property can carry to drive automatic value-plus-units string formatting.
category: api
library: scenery-phet
tags: [scenery-phet, PhetUnit, units, i18n, formatting]
status: complete
related:
  - /api/scenery-phet/number-display
  - /api/scenery-phet/number-control
  - /api/axon/number-property
  - /api/axon/unit-conversion-property
  - /api/axon/string-property
prerequisites:
  - /api/axon/number-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PhetUnit

`PhetUnit` (from `scenerystack/scenery-phet`) is a small class representing a *unit of measurement* — "m", "N", "°C" — as a first-class value that can be attached to a numeric `Property` via its `units` option, rather than baked into a hardcoded format string wherever that Property's value gets displayed. It implements the `Unit` interface defined in `scenerystack/axon`, and exists so that a value's units, and the translated strings for formatting "value + units" both visually and for accessibility, travel with the Property itself instead of being re-specified at every display site.

`scenery-phet` ships several dozen ready-made instances built on `PhetUnit` — `metersUnit`, `newtonsUnit`, `centimetersUnit`, `kelvinUnit`, and so on, under `scenery-phet/js/units/` — but they are not re-exported from the library's public barrel, so application code that wants one either constructs its own `PhetUnit` (as below) or imports a specific unit file directly.

```ts
import { PhetUnit } from 'scenerystack/scenery-phet';
import { NumberProperty, StringProperty } from 'scenerystack/axon';
```

## A minimal example

```ts
const wattsUnit = new PhetUnit( 'W', {
  visualStandaloneStringProperty: new StringProperty( 'watts' ),
  visualPatternStringProperty: new StringProperty( '{{value}} W' )
} );

wattsUnit.getVisualStandaloneString(); // 'watts'
wattsUnit.getVisualString( 42 );       // '42 W'

// Attach it to a Property so downstream display components can find it:
const powerProperty = new NumberProperty( 0, {
  units: wattsUnit
} );
```

## Constructor

```ts
new PhetUnit<InputPropertyType extends TReadOnlyProperty<string>>(
  name: string,                                   // backwards-compatible short name, e.g. 'm' or 'm/s^2'
  options?: {
    visualStandaloneStringProperty?: InputPropertyType; // e.g. 'meters', for units-with-no-value display
    visualPatternStringProperty?: InputPropertyType;    // e.g. '{{value}} m', filled in via a value
    accessiblePattern?: AccessibleValuePattern;          // a Fluent pattern for PDOM/voicing strings
  }
)
```

All three options are optional and independent — a `PhetUnit` can support none, some, or all of standalone/visual/accessible strings. `hasVisualStandaloneString`, `hasVisualString`, and `hasAccessibleString` (all public readonly booleans) reflect which were supplied.

## Methods

| Method | Effect |
| --- | --- |
| `getVisualStandaloneString()` | Current value of `visualStandaloneStringProperty`; throws if not configured |
| `getVisualString( value, options? )` | Fills `value` into `visualPatternStringProperty`'s pattern via `StringUtils.fillIn`; throws if not configured |
| `getAccessibleString( value, options? )` | Formats `value` through `accessiblePattern`; throws if not configured |
| `getDualString( value, options? )` | `{ visualString, accessibleString }` — convenience wrapper calling both of the above |
| `getVisualStringProperty( valueProperty, options? )` | A reactive `ReadOnlyProperty<string>` version of `getVisualString`, derived from `valueProperty` |
| `getAccessibleStringProperty( valueProperty, options? )` | Reactive version of `getAccessibleString` |
| `getDualStringProperty( valueProperty, options? )` | Reactive version of `getDualString` |
| `getDependentProperties()` | The string Properties this unit's formatting depends on — used internally to build correct derivations |

`getFallbackAccessibleUnitsStringProperty( valueProperty, options? )` is also exported alongside `PhetUnit` (not a method on the class): given any numeric Property, it returns that Property's unit's accessible string Property if `units` is a `PhetUnit`, or a plain formatted-number string Property otherwise — a convenient one-liner for accessibility code that doesn't want to branch on whether a `units` value happens to be rich.

## Where this connects to NumberProperty and NumberDisplay

Any `Property` (including [`NumberProperty`](/api/axon/number-property)) accepts a `units` option typed `Unit | string | null`. When a `PhetUnit` instance is passed there, [`NumberDisplay`](/api/scenery-phet/number-display) automatically picks it up: if `numberProperty.units` is a `PhetUnit` (not a plain string) **and** both `hasVisualString` and `hasAccessibleString` are `true`, `NumberDisplay` uses `unit.getDualString(...)` as its default number formatter instead of the plain numeric formatter — meaning a well-configured `PhetUnit` gives you correctly-formatted, translated, accessible value-plus-units text with no `valuePattern` option needed. [`NumberControl`](/api/scenery-phet/number-control) inherits this automatically, since it composes a `NumberDisplay` internally via its `numberDisplayOptions`.

::: warning The automatic NumberDisplay formatter requires *both* visual and accessible support
`NumberDisplay` only switches to a unit's own formatter when `unit.hasVisualString && unit.hasAccessibleString` are both `true`. A `PhetUnit` built with only `visualPatternStringProperty` (as in the minimal example above, which omits `accessiblePattern`) will **not** be picked up automatically — `NumberDisplay` falls back to its default numeric formatter, and `valuePattern`/`decimalPlaces` still need to be set explicitly. Call `unit.getVisualString(...)` directly if you only need visual formatting without wiring up a full `AccessibleValuePattern`.
:::

::: tip Distinct from UnitConversionProperty
[`UnitConversionProperty`](/api/axon/unit-conversion-property) converts a *numeric value* between units (e.g. meters to centimeters, via a multiplicative factor) — it changes what number you're holding. `PhetUnit` doesn't convert anything; it labels a Property's existing numeric value with a unit for display purposes. The two compose naturally: convert with `UnitConversionProperty`, then tag the result's `units` option with the matching `PhetUnit`.
:::
