---
title: Pool
description: A generic object-pooling utility that reuses instances instead of constructing new ones, reducing GC churn for objects created and discarded at high frequency.
category: api
library: phet-core
tags: [phet-core, Pool, Poolable, performance, memory]
status: complete
related:
  - /api/phet-core/optionize-and-merge
  - /patterns/dispose-and-memory-management
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Pool

`Pool` (from `scenerystack/phet-core`) manages a reusable set of instances of a single class, so that code creating and discarding many short-lived objects per frame (vectors for an intermediate calculation, drag-listener event objects, per-point plot helpers) can pull an existing instance back out of a pool instead of paying for a fresh allocation and, later, garbage collection. You construct one `Pool<T>` per class, typically stored as a `static readonly pool` field on that class, and the pool's `create()`/`fetch()`/`freeToPool()` methods stand in for `new`.

```ts
import { Pool } from 'scenerystack/phet-core';
```

## A minimal example

```ts
class Vector2Scratch {
  public x = 0;
  public y = 0;

  public initialize( x: number, y: number ): this {
    this.x = x;
    this.y = y;
    return this;
  }

  public freeToPool(): void {
    Vector2Scratch.pool.freeToPool( this );
  }

  // Must come after `initialize` is defined -- Pool reads it off the prototype.
  public static readonly pool = new Pool( Vector2Scratch );
}

// Pulls a recycled instance and re-initializes it, or constructs a new one if the pool is empty.
const scratch = Vector2Scratch.pool.create( 3, 4 );

// ...use scratch...

// Release it back to the pool once you're done -- no other references should remain.
scratch.freeToPool();
```

## Constructor

```ts
new Pool<T extends Constructor>( type: T, providedOptions?: PoolOptions<T> )
```

`type` is the class being pooled. If `type.prototype.initialize` exists with a compatible signature, `providedOptions` is optional; otherwise TypeScript requires you to pass an `initialize` option explicitly (`Pool` needs some function to call to "re-run the constructor" on a recycled instance).

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `initialize` | `type.prototype.initialize` | The function called on a recycled instance to reinitialize it with new constructor-like arguments; must return the object itself |
| `defaultArguments` | `[]` | Arguments used to construct instances when the pool needs to grow without a caller-supplied argument list (e.g. filling `initialSize`) |
| `maxSize` | `100` | Upper bound on how many instances `freeToPool()` will retain; excess instances are simply dropped (left for normal GC) |
| `initialSize` | `0` | Number of instances eagerly created (via `defaultArguments`) when the `Pool` is constructed |
| `useDefaultConstruction` | `false` | If `true`, a pool miss always constructs via `defaultArguments` first and then calls `initialize` with the real arguments, instead of constructing directly with the real arguments |

## Methods

| Member | Description |
| --- | --- |
| `create( ...args )` | Returns an instance behaving as if constructed with `args`: pops one from the pool and calls `initialize( ...args )` on it if available, otherwise constructs a new one |
| `fetch()` | Returns an instance with *arbitrary* leftover state — pops one from the pool if available, otherwise constructs one from `defaultArguments`. Use this only when you're about to overwrite all relevant state yourself |
| `freeToPool( object )` | Returns `object` to the pool if `poolSize < maxPoolSize`; otherwise the object is silently dropped (left for the garbage collector) |
| `forEach( callback )` | Iterates the objects currently sitting in the pool |
| `poolSize` (getter) | Number of instances currently held in the pool |
| `maxPoolSize` (getter/setter) | The cap `freeToPool()` checks against |

::: tip `Pool` supersedes the older `Poolable.mixInto()` mixin
`scenerystack/phet-core` also exports `Poolable`, but its own source comment marks it `@deprecated - Please use Pool.ts instead as the new pooling pattern`. `Poolable.mixInto( MyType, options )` retrofits static `pool`/`createFromPool`/`dirtyFromPool` members onto an existing class via mutation, whereas `Pool` is a plain, explicit object you construct and assign yourself (`static readonly pool = new Pool( MyType )`) — prefer `Pool` in new code, and treat `Poolable` as something you might still encounter reading older call sites, not something to reach for.
:::
