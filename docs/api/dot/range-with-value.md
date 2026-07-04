---
title: RangeWithValue
description: A Range subclass that also tracks a required default value within the min/max interval.
category: api
library: dot
tags: [dot, RangeWithValue, Range]
status: verified
related:
  - /api/dot/range
  - /api/axon/number-property
prerequisites:
  - /api/dot/range
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# RangeWithValue

`RangeWithValue` (from `scenerystack/dot`) extends [`Range`](/api/dot/range), adding a required `defaultValue` that must fall within `[min, max]`. It's the type [`Range`'s own docs](/api/dot/range) point to when you need a range *plus* a starting/reset value in one object — most useful for a control (like a slider) that needs to know both its bounds and where it should reset to.

```ts
import { RangeWithValue } from 'scenerystack/dot';

const volumeRange = new RangeWithValue( 0, 11, 5 ); // min 0, max 11, defaults to 5

volumeRange.defaultValue; // 5
volumeRange.min;          // 0
volumeRange.max;          // 11
volumeRange.contains( 7 ); // true — inherited from Range
```

## Constructing

The constructor takes `min`, `max`, and `defaultValue` directly: `new RangeWithValue( min, max, defaultValue )`. An assertion throws immediately if `defaultValue` falls outside `[min, max]`.

## What's added over `Range`

`RangeWithValue` is a `Range` — it inherits every method described on the [`Range`](/api/dot/range) page (`contains`, `constrainValue`, `union`, `getCenter`, etc.) unchanged. It adds:

| Member | Meaning |
| --- | --- |
| `defaultValue` (getter) | The default value passed to the constructor; there is no public setter — it's fixed for the life of the instance |
| `equals( other )` (overridden) | Also compares `defaultValue`, and requires `other` to be a `RangeWithValue` (not a plain `Range`) |
| `toString()` (overridden) | Includes `defaultValue` in the debug string |

`setMin`, `setMax`, and `setMinMax` are also overridden to add validation: each throws (via assertion) if the change would push `defaultValue` outside the new bounds. This is the one behavioral difference from `Range` beyond the extra field — a plain `Range` lets you move `min`/`max` freely, but a `RangeWithValue` won't let you strand its own default value outside the interval.

::: tip `defaultValue` has no setter — construct a new instance to change it
Unlike `min`/`max` (settable, with the validation above), `defaultValue` is fixed at construction. If a control's reset value needs to change, create a new `RangeWithValue` rather than trying to mutate the existing one's default.
:::

## Related

- [Range](/api/dot/range) — the base `[min, max]` interval type; `RangeWithValue` is a strict superset.
- [NumberProperty](/api/axon/number-property) — takes a `Range` via its `range` option; a `RangeWithValue` satisfies that option too (since it *is* a `Range`) and additionally lets code that already has the range object read a sensible default/reset value off of it, instead of tracking that value separately.
