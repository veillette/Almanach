---
title: Permutation and Combination
description: Immutable combinatorics helpers for reordering (Permutation) or selecting a subset of (Combination) an array.
category: api
library: dot
tags: [dot, Permutation, Combination, combinatorics, math]
status: complete
related:
  - /api/dot/convex-hull2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Permutation and Combination

`Permutation` and `Combination` (both from `scenerystack/dot`) are small, immutable combinatorics helper classes. A `Permutation` describes one particular reordering of a list's indices; a `Combination` describes one particular yes/no inclusion of each index (a subset). Both are mostly useful for enumerating every possible reordering/subset of a small array — for example, generating every possible arrangement of a handful of draggable objects for a "try all combinations" puzzle checker, or exhaustively testing every way a small set of items can be grouped.

```ts
import { Permutation, Combination } from 'scenerystack/dot';

// Every reordering of 3 items:
const permutations = Permutation.permutations( 3 ); // 6 Permutation instances

// Apply one directly to an array:
Permutation.identity( 3 ).apply( [ 'a', 'b', 'c' ] ); // [ 'a', 'b', 'c' ]

// Every subset of a 3-element array:
Combination.combinationsOf( [ 'a', 'b', 'c' ] );
// [ [], ['c'], ['b'], ['b','c'], ['a'], ['a','c'], ['a','b'], ['a','b','c'] ]
```

## `Permutation`

A `Permutation` wraps an `indices: number[]` array such that applying it to a list produces `newList[i] = oldList[permutation.indices[i]]`.

| Member | Effect |
| --- | --- |
| `new Permutation( indices )` | Wraps an explicit indices array |
| `size()` | Number of elements this permutation rearranges |
| `apply( arrayOrInt )` | Applied to an array, returns a new reordered array; applied to a single index, returns `indices[index]` |
| `inverted()` | The permutation that undoes this one |
| `withIndicesPermuted( indices )` | All `Permutation`s obtained by additionally permuting just the given subset of index positions |
| `equals( other )` | Structural equality on `indices` |
| `Permutation.identity( size )` | The no-op permutation of a given size |
| `Permutation.permutations( size )` | Every `Permutation` of a given size (`size!` of them) |
| `Permutation.permutationsOf( array )` | Every reordering of a specific array, as plain arrays (convenience over `permutations` + `apply`) |
| `Permutation.forEachPermutation( array, callback )` | Calls `callback` once per permutation without allocating all of them up front |

## `Combination`

A `Combination` wraps an `inclusions: boolean[]` array, one entry per index, marking whether that index is included in the subset.

| Member | Effect |
| --- | --- |
| `new Combination( inclusions )` | Wraps an explicit inclusions array |
| `size()` | Number of elements this combination is defined over |
| `includes( index )` | Whether a given index is included |
| `apply( array )` | Filters `array` down to just the included elements |
| `inverted()` | The complementary combination (every included index becomes excluded, and vice versa) |
| `getIncludedIndices()` | The included indices as a plain `number[]` |
| `equals( other )` | Structural equality on `inclusions` |
| `Combination.empty( size )` / `Combination.full( size )` | The all-excluded / all-included combination of a given size |
| `Combination.combinations( size )` | Every `Combination` of a given size (`2^size` of them) |
| `Combination.combinationsOf( array )` | Every subset of a specific array, as plain arrays |
| `Combination.forEachCombination( array, callback )` | Calls `callback` once per subset without allocating all of them up front |

::: warning Both scale factorially/exponentially — don't reach for these on large arrays
`Permutation.permutations( n )` produces `n!` instances and `Combination.combinations( n )` produces `2^n` — both classes are meant for exhaustively checking small, fixed-size sets (a handful of draggable pieces, a small puzzle's pieces), not for general-purpose array shuffling (use [`dotRandom.shuffle()`](/api/dot/dot-random) for that) or for enumerating anything with more than a dozen or so elements.
:::
