---
title: optionize and merge
description: The two building blocks behind the options pattern - optionize for type-checked defaulting, merge for its untyped runtime engine.
category: api
library: phet-core
tags: [phet-core, optionize, merge, combineOptions, options]
status: complete
related:
  - /patterns/options-pattern
  - /api/phet-core/enumeration-value
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# optionize and merge

`optionize` (from `scenerystack/phet-core`) is the type-checked function almost every SceneryStack class constructor calls to combine its own default option values, its superclass's defaults, and a caller-provided options object into one final options object — it's what the [options pattern](/patterns/options-pattern) is built on. `merge` is the plain-JavaScript deep-merge function `optionize` delegates to at runtime; reach for `merge` directly only when you're combining plain option-literal objects outside a class constructor and don't need `optionize`'s compile-time "every optional field needs a default" check.

```ts
import { optionize, merge, combineOptions } from 'scenerystack/phet-core';
```

## `optionize`

```ts
optionize<ProvidedOptions, SelfOptions = ProvidedOptions, ParentOptions = Record<never, never>>()
  ( defaults: OptionizeDefaults<SelfOptions, ParentOptions, ProvidedOptions>,
    providedOptions: ProvidedOptions | undefined )
  => OptionizeDefaults<SelfOptions, ParentOptions> & ProvidedOptions
```

It's called with an empty type-argument list `<...>()` immediately followed by the actual `( defaults, providedOptions )` call — the split exists so TypeScript can infer `ProvidedOptions`/`SelfOptions`/`ParentOptions` from explicit type arguments while still inferring the return type from the runtime arguments.

```ts
type SelfOptions = {
  headHeight?: number;
  doubleHead?: boolean;
};
export type ArrowNodeOptions = SelfOptions & PathOptions;

const options = optionize<ArrowNodeOptions, SelfOptions, PathOptions>()( {
  headHeight: 10,
  doubleHead: false,
  fill: 'black' // a PathOptions default this class chooses to supply
}, providedOptions );
```

The type system enforces that every optional key declared in `SelfOptions` has a default in the first argument — omit one and the call fails to typecheck, not just at runtime.

## Related functions in the same file

| Function | Signature | When to use |
| --- | --- | --- |
| `optionize3` | `optionize3<ProvidedOptions, SelfOptions, ParentOptions>()( {}, defaults, providedOptions )` | Same as `optionize`, for call sites (like `ResponsePacket`) that need an explicit empty-object first argument rather than mutating `defaults` in place |
| `optionize4` | `optionize4<ProvidedOptions, SelfOptions, ParentOptions>()( {}, constantDefaults, classDefaults, providedOptions )` | Adds a middle layer — e.g. sim-wide constants — between class defaults and the caller's options |
| `combineOptions<Type>( target, ...sources )` | Returns `Type` | Merges plain option-literal objects of the *same* type (no self/parent split, no default-completeness check) — for combining options outside a constructor |

All four are thin typed wrappers that call `merge` underneath; the type layer is compile-time only; `merge` performs the actual runtime combination.

## `merge`

```ts
merge<A, B>( target: A, ...sources: B[] ): A & B
```

Recursively copies every own, non-`undefined` property from each source onto `target`, left to right (later sources win). Nested objects are merged recursively **only** when the key ends in `Options` (case-sensitive) and is not literally `'Options'` itself — e.g. `numberDisplayOptions: {...}` recurses, but arrays, functions, class instances, and any object with getters/setters throw an assertion error rather than being merged, since `merge` only supports plain object literals.

```ts
const options = merge( {}, CommonConstants.SOME_DEFAULTS, { fill: 'red' }, providedOptions );
```

::: warning `merge`'s recursion is keyed on the literal suffix `Options`
A field named `buttonOptions` merges deeply with a same-named field from an earlier source; a field named `button` (holding an object) is replaced wholesale instead. This is easy to get wrong when refactoring a nested options object — renaming a `*Options` field to drop that suffix silently changes merge behavior from "combine" to "overwrite."
:::
