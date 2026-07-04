---
title: assertHasProperties and assertMutuallyExclusiveOptions
description: Two development-time assertion helpers for validating shape - that an object has certain members, and that certain option keys are never combined.
category: api
library: phet-core
tags: [phet-core, assertHasProperties, assertMutuallyExclusiveOptions, assertions, options]
status: verified
prerequisites:
  - /patterns/options-pattern
related:
  - /patterns/options-pattern
  - /api/phet-core/optionize-and-merge
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# assertHasProperties and assertMutuallyExclusiveOptions

`assertHasProperties` and `assertMutuallyExclusiveOptions` (from `scenerystack/phet-core`) are development-time assertion helpers for validating an object's shape at a call site — the first checks that certain named members exist (anywhere in the prototype chain), the second checks that certain groups of option keys are never supplied together. Both are no-ops in a production build; like the rest of SceneryStack's `assert && assert(...)` convention, they only run when assertions are enabled, so they should guard invariants, not carry runtime logic.

```ts
import { assertHasProperties, assertMutuallyExclusiveOptions } from 'scenerystack/phet-core';
```

## `assertHasProperties`

```ts
assertHasProperties( object: unknown, properties: string[] ): void
```

Asserts that `object` has an own property *or* an inherited (prototype-chain) property for every name in `properties`. Useful for validating a duck-typed dependency (e.g. "this object needs to look like a `TColor`") without importing its concrete class.

```ts
assertHasProperties( someNode, [ 'getOpacity', 'opacity', '_opacity' ] ); // no error if all three exist somewhere in the chain
assertHasProperties( { flower: 2 }, [ 'tree' ] );                        // throws: property not defined: tree
```

## `assertMutuallyExclusiveOptions`

```ts
assertMutuallyExclusiveOptions( options: object | null | undefined, ...sets: string[][] ): void
```

Asserts that at most one of the given key-sets has any of its keys present in `options` — pass one `string[]` per mutually-exclusive group. `options` may be `null`/`undefined` (treated as "nothing set," so it always passes).

Only one of the provided sets may have any of its keys present at all — using multiple keys *within* the same set is fine:

```ts
assertMutuallyExclusiveOptions( { tree: 1, flower: 2 }, [ 'tree' ], [ 'flower' ] );               // throws - one key used from each of the two sets
assertMutuallyExclusiveOptions( { flower: 2 }, [ 'tree' ], [ 'flower' ] );                        // fine - only the second set is used
assertMutuallyExclusiveOptions( { tree: 1, mountain: 2 }, [ 'tree', 'mountain' ], [ 'flower' ] ); // fine - both used keys belong to the first set
```

## Summary

| Function | Checks | Throws when |
| --- | --- | --- |
| `assertHasProperties( object, properties )` | Named members exist (own or inherited) | Any name in `properties` is missing everywhere in the chain |
| `assertMutuallyExclusiveOptions( options, ...sets )` | At most one option-key group is used | Keys from more than one of the provided `sets` are present in `options` |

::: tip Both are guarded by the global assertion flag, not a manual `if`
Call these directly — don't wrap them in `assert && assertHasProperties(...)` yourself the way you would with `window.assert`; these two functions already check internally whether assertions are enabled and no-op if not, matching the convention used by `merge` and other `phet-core` runtime checks.
:::
