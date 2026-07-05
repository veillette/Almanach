---
title: dotRandom
description: The shared, globally-seeded Random singleton simulations should use for every "random" call, instead of Math.random() or a private Random instance.
category: api
library: dot
tags: [dot, dotRandom, Random, seeding, phet-io]
status: complete
prerequisites:
  - /api/dot/random
related:
  - /api/dot/random
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# dotRandom

`dotRandom` (from `scenerystack/dot`) is a single, shared instance of [`Random`](/api/dot/random) that every part of a SceneryStack simulation should use for pseudo-randomness, rather than calling `Math.random()` directly or constructing a private `new Random()`. It's created once, seeded from the `randomSeed` PhET-iO query parameter when running under PhET-iO (falling back to an unpredictable seed otherwise), and then reused everywhere.

```ts
import { dotRandom } from 'scenerystack/dot';

// Anywhere in model code that needs randomness:
const angle = dotRandom.nextDoubleBetween( 0, Math.PI * 2 );
const startingLane = dotRandom.nextIntBetween( 0, 3 );
const shuffledDeck = dotRandom.shuffle( cards );
```

`dotRandom` exposes the exact same API as any `Random` instance — `nextDouble()`, `nextBoolean()`, `nextIntBetween()`, `nextGaussian()`, `sample()`, `shuffle()`, `sampleProbabilities()`, and so on. See [Random](/api/dot/random) for the full method table.

## Why the shared instance matters

`Random`'s own doc comment is explicit about this: "If you are developing a PhET Simulation, you should probably use the global `DOT/dotRandom`" rather than a private instance, because `dotRandom` provides built-in support for PhET-iO seeding. When every random draw in a simulation funnels through the one shared, seedable generator, PhET-iO's state-restore and record-and-replay tooling can reproduce an identical run just by re-supplying the same seed — a `Vector2Property` moving randomly, a probabilistic model event, and a shuffled list all become deterministic together. Scattering `Math.random()` calls (or several independent `new Random()` instances) throughout a codebase breaks that guarantee: even with the same seed, the *order* in which different generators are drawn from can vary run to run, and any plain `Math.random()` call can never be seeded or reproduced at all.

::: warning Construct your own `Random` only for genuinely independent randomness
Reach for `new Random( { seed } )` instead of `dotRandom` only when you deliberately want an isolated sequence that must not perturb (or be perturbed by) the rest of the sim's random draws — for example, a self-contained unit test asserting on a specific sequence of values. For anything that runs as part of a live simulation, use `dotRandom`.
:::
