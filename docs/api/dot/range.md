---
title: Range
description: A min/max pair used for NumberProperty validation and slider ranges.
category: api
library: dot
tags: [dot, Range]
status: verified
related:
  - /api/axon/number-property
  - /api/dot/bounds2
  - /api/dot/dot-utils
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Range

`Range` (from `scenerystack/dot`) is a simple `[min, max]` interval. It's most commonly seen as the `range` option passed to a `NumberProperty`, which sliders and number spinners use for their bounds, but it's a general-purpose interval type used anywhere a valid numeric interval needs a name.

```ts
import { Range } from 'scenerystack/dot';

const temperatureRange = new Range( 0, 100 );

temperatureRange.contains( 37 );          // true
temperatureRange.constrainValue( 150 );   // 100 — clamps into the range
temperatureRange.getCenter();             // 50
```

## Constructing a range

The constructor takes `min` and `max` directly: `new Range( min, max )`. Both `min` and `max` are also settable properties (`range.min = 10`), with an internal assertion that `min <= max` is maintained at all times.

| Static | Meaning |
| --- | --- |
| `Range.EVERYTHING` | `(-Infinity, Infinity)` |
| `Range.NOTHING` | `(Infinity, -Infinity)` — an inverted, "empty" range |

## Methods

| Method | Effect |
| --- | --- |
| `getLength()` | `max - min` |
| `getCenter()` | `(min + max) / 2` |
| `contains( value )` | Whether `value` is within `[min, max]`, inclusive |
| `containsRange( range )` | Whether this range fully contains another range |
| `intersects( range )` / `intersectsExclusive( range )` | Whether two ranges overlap |
| `constrainValue( value )` | Clamp a value into `[min, max]` |
| `getNormalizedValue( value )` / `expandNormalizedValue( t )` | Map a value to/from `[0, 1]` within the range |
| `union( range )` / `includeRange( range )` | Smallest range containing both — immutable / mutable pair |
| `intersection( range )` / `constrainRange( range )` | Largest range contained by both — immutable / mutable pair |
| `shifted( n )` | New range with both endpoints offset by `n` |
| `times( value )` / `multiply( value )` | Scale both endpoints — immutable / mutable pair |
| `addValue( n )` | Mutable: expand min/max, if needed, to include `n` |
| `withValue( n )` | Immutable counterpart of `addValue` |
| `copy()` | Clone |
| `equals( range )` / `equalsEpsilon( range, epsilon )` | Comparison |

## Common use: NumberProperty validation

```ts
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';

const temperatureProperty = new NumberProperty( 20, {
  range: new Range( 0, 100 )
} );
```

`NumberProperty` uses its `range` option both to validate assignments in assertion-enabled builds and to give UI components (like sliders) their bounds automatically — see [NumberProperty](/api/axon/number-property).

::: tip `defaultValue` belongs to `RangeWithValue`, not `Range`
Reaching for `range.defaultValue` on a plain `Range` throws immediately — that field only exists on the related `RangeWithValue` subclass (also exported from `scenerystack/dot`), which pairs a range with a starting value for controls that need one (e.g. a reset-able slider). If you need a default alongside min/max, reach for `RangeWithValue` instead of trying to bolt one onto `Range`.
:::

## Related

- [NumberProperty](/api/axon/number-property) — the most common consumer of `Range`, via its `range` option.
- [Bounds2](/api/dot/bounds2) — `bounds.xRange` / `bounds.yRange` expose each axis of a bounds as a `Range`.
- [Utils](/api/dot/dot-utils) — `clamp()` is the free-function equivalent of `range.constrainValue()` when you don't have a `Range` object handy.
