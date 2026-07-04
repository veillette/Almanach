---
title: arrayRemove, arrayDifference, and cleanArray
description: Small, dependency-free array helpers for mutation-in-place, set-style comparison, and resetting an array without reallocating it.
category: api
library: phet-core
tags: [phet-core, arrayRemove, arrayDifference, cleanArray, array, collections]
status: complete
related:
  - /api/phet-core/optionize-and-merge
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# arrayRemove, arrayDifference, and cleanArray

`scenerystack/phet-core` exports a handful of small, standalone array utilities used throughout SceneryStack instead of hand-rolled loops or a general utility-belt library. The three most broadly useful are `arrayRemove` (delete one matching element in place), `arrayDifference` (classify elements of two arrays as "only in A," "only in B," or "in both"), and `cleanArray` (empty an array in place, or create one if given a falsy value) — all plain functions with no class or options object involved.

```ts
import { arrayRemove, arrayDifference, cleanArray } from 'scenerystack/phet-core';
```

## `arrayRemove`

```ts
arrayRemove<T>( array: T[], toRemove: T ): void
```

Removes the *first* matching element from `array` in place (via `splice`), asserting that the element is actually present — this is not a safe no-op removal, it's an assertion that the caller expected the element to be there.

```ts
const listeners = [ listenerA, listenerB, listenerC ];
arrayRemove( listeners, listenerB );
// listeners is now [ listenerA, listenerC ]
```

## `arrayDifference`

```ts
arrayDifference<T>( a: T[], b: T[], aOnly?: T[], bOnly?: T[], inBoth?: T[] ): T[]
```

Given two arrays of unique elements, sorts every element into "only in `a`," "only in `b`," or "in both," optionally writing into caller-supplied output arrays (each must start empty), and returns `aOnly` (the classic set-difference result).

```ts
const aOnly: number[] = [];
const bOnly: number[] = [];
const inBoth: number[] = [];
arrayDifference( [ 1, 2 ], [ 5, 2, 0 ], aOnly, bOnly, inBoth );
// aOnly: [ 1 ], bOnly: [ 5, 0 ], inBoth: [ 2 ]
```

Both input arrays must contain only unique values (`arrayDifference` asserts this) — it is not a general multiset diff.

## `cleanArray`

```ts
cleanArray<T>( arr?: T[] | null | undefined ): T[]
```

If given an array, empties it in place (via repeated `pop()`, chosen to avoid the garbage `length = 0` can generate) and returns the same reference; if given `null`/`undefined`, returns a fresh empty array instead. Useful for a field you want to "reset to empty" without deciding at each call site whether it's already been allocated.

```ts
this.activeListeners = cleanArray( this.activeListeners );
```

## Summary

| Function | Mutates input? | Returns |
| --- | --- | --- |
| `arrayRemove( array, toRemove )` | Yes | `void` |
| `arrayDifference( a, b, aOnly?, bOnly?, inBoth? )` | Only the output arrays, if supplied | `aOnly` |
| `cleanArray( arr? )` | Yes, if `arr` is truthy | The (now-empty) array |

::: tip `arrayRemove` asserts the element exists — it is not a safe "remove if present"
Calling `arrayRemove` on a value that isn't actually in the array throws (`item not found in Array`) rather than silently doing nothing. If removal is conditional, check `array.includes( item )` first, or use `_.pull`/manual filtering when "not found" is an expected case rather than a bug.
:::
