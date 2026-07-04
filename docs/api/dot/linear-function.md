---
title: LinearFunction
description: A reusable object that maps values between two linear numeric domains, with an invertible mapping.
category: api
library: dot
tags: [dot, LinearFunction, math]
status: verified
related:
  - /api/dot/dot-utils
  - /api/dot/range
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# LinearFunction

`LinearFunction` (from `scenerystack/dot`) packages up a linear mapping between two numeric domains — "domain a" and "domain b" — as a reusable object with both a forward (`evaluate`) and inverse (`inverse`) direction. It's the object-oriented sibling of the free function [`linear()`](/api/dot/dot-utils): where `linear()` takes all five numbers every call, `LinearFunction` remembers the two domains once and lets you call `.evaluate()`/`.inverse()` repeatedly, which reads better when the same mapping is reused (e.g. a value-to-pixel conversion applied across many data points).

```ts
import { LinearFunction } from 'scenerystack/dot';

// Maps a model domain [0, 100] to a view/pixel domain [0, 200]
const f = new LinearFunction( 0, 100, 0, 200 );

f.evaluate( 50 ); // 100 — maps a value from domain a to domain b
f.inverse( 100 ); // 50  — maps a value from domain b back to domain a
```

## Constructing

```ts
new LinearFunction( a1, a2, b1, b2, clamp = false )
```

`a1`/`a2` are two points in the first domain, `b1`/`b2` are the corresponding two points in the second domain — so `evaluate( a1 ) === b1` and `evaluate( a2 ) === b2`, with everything else linearly interpolated (or extrapolated) between them. The optional fifth argument `clamp` (default `false`), if `true`, constrains every result of `evaluate`/`inverse` to stay within `[min(b1,b2), max(b1,b2)]` or `[min(a1,a2), max(a1,a2)]` respectively, instead of extrapolating past the given endpoints.

## Methods

| Method | Effect |
| --- | --- |
| `evaluate( a3 )` | Maps a value from domain a to domain b |
| `inverse( b3 )` | Maps a value from domain b back to domain a — the literal inverse of `evaluate` |

That's the entire public surface — `LinearFunction` is intentionally minimal. Both methods respect the `clamp` flag passed to the constructor.

```ts
// A slider's model range maps to its track's pixel width, clamped so
// out-of-range model values don't push the thumb off the track.
const modelToTrackX = new LinearFunction( 0, 100, 0, 300, true );

modelToTrackX.evaluate( 150 ); // 300, not 450 — clamped to the b-domain
```

::: tip Order of arguments controls direction, not just endpoints
`evaluate` always maps *from* the `a1`/`a2` domain *to* the `b1`/`b2` domain; `inverse` always goes the other way. There's no ambiguity about which domain is "the input" at call time — it's fixed by the order of arguments to the constructor. If you find yourself calling `inverse` far more often than `evaluate`, consider swapping the constructor arguments so the more common direction is the default `evaluate` call.
:::

## Related

- [Utils](/api/dot/dot-utils) — `linear( a1, a2, b1, b2, a3 )` is the underlying free function `LinearFunction` wraps; reach for it directly for a one-off mapping that doesn't need to be reused.
- [Range](/api/dot/range) — `range.getNormalizedValue()`/`expandNormalizedValue()` cover the common special case of mapping to/from `[0, 1]`, which overlaps with what `LinearFunction` can express.
