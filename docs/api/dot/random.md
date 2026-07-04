---
title: Random
description: A seedable pseudo-random number generator class, plus the shared dotRandom singleton sims should use instead of Math.random().
category: api
library: dot
tags: [dot, Random, dotRandom, math]
status: complete
related:
  - /api/dot/vector2
  - /api/dot/bounds2
  - /api/dot/range
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Random

`Random` (from `scenerystack/dot`) is a seedable pseudo-random number generator (built on [seedrandom.js](https://github.com/davidbau/seedrandom)), with helpers for booleans, integers, doubles in a range, gaussian samples, array sampling/shuffling, and weighted sampling. `scenerystack/dot` also exports `dotRandom`, a shared singleton instance of `Random` — sim code should reach for `dotRandom` rather than constructing a `new Random()` or calling `Math.random()` directly.

```ts
import { dotRandom } from 'scenerystack/dot';

dotRandom.nextDouble();               // [0, 1)
dotRandom.nextIntBetween( 1, 6 );      // an integer in [1, 6], inclusive
dotRandom.nextBoolean();               // true or false
dotRandom.sample( [ 'red', 'green', 'blue' ] ); // one randomly-chosen element
```

## Constructing your own instance

```ts
new Random( { seed?: number | null } )
```

The single options object is optional; if `seed` is omitted or `null`, a random seed is generated via `Math.random()` once at construction. Passing a fixed numeric `seed` makes the entire sequence of subsequent calls deterministic and reproducible — useful for tests, or for anything that needs the same "random" sequence across runs.

## Methods

| Method | Effect |
| --- | --- |
| `nextDouble()` | Next value in `[0, 1)`, uniformly distributed |
| `nextBoolean()` | `nextDouble() >= 0.5` |
| `nextInt( n )` | Next integer in `[0, n)` |
| `nextIntBetween( min, max )` | Next integer in `[min, max]` inclusive (both must be integers) |
| `nextDoubleBetween( min, max )` | Next double in `[min, max)` |
| `nextDoubleInRange( range )` | Next double within a [`Range`](/api/dot/range)'s `[min, max)` (or exactly `min` if `min === max`) |
| `nextGaussian()` | Next gaussian-distributed sample, mean 0, standard deviation 1 |
| `nextPointInBounds( bounds )` | A random [`Vector2`](/api/dot/vector2) within a [`Bounds2`](/api/dot/bounds2), `[minX,maxX) x [minY,maxY)` |
| `sample( array )` | One randomly-chosen element from a non-empty array |
| `shuffle( array )` | A new array with the same elements in Fisher-Yates-shuffled order |
| `sampleProbabilities( weights )` | A randomly-chosen index, weighted by the (not necessarily normalized) `weights` array |
| `getSeed()` | The seed this instance was constructed (or re-seeded) with |
| `setSeed( seed )` | Re-seeds the generator; `null` picks a new random seed via `Math.random()` |
| `numberOfCalls` | Public field tracking how many times `nextDouble()` has been called — read-only by convention, not by enforcement |

::: tip Use `dotRandom`, not `Math.random()`, in simulation code
SceneryStack simulations use the shared `dotRandom` singleton (not `new Random()` and not raw `Math.random()`) so that every "random" call in the sim funnels through one seed. This is what makes PhET-iO's seeded/reproducible playback and record-and-replay features work — if a sim's randomness comes from scattered `Math.random()` calls, a replayed session can diverge from the original. Reach for `new Random()` directly only when you deliberately want an isolated, independently-seeded generator (e.g. a self-contained test).
:::

## Related

- [Vector2](/api/dot/vector2) — `nextPointInBounds()` returns a `Vector2`.
- [Bounds2](/api/dot/bounds2) — the region `nextPointInBounds()` samples from.
- [Range](/api/dot/range) — `nextDoubleInRange()` takes a `Range` directly instead of separate `min`/`max` arguments.
