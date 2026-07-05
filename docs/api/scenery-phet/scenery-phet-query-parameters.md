---
title: sceneryPhetQueryParameters and isResettingAllProperty
description: scenery-phet's own demo-app query parameters, and a global TinyProperty flag that's true while any reset-all is in progress.
category: api
library: scenery-phet
tags: [scenery-phet, sceneryPhetQueryParameters, isResettingAllProperty, query-parameters, QueryStringMachine]
status: complete
related:
  - /api/scenery-phet/reset-all-button
  - /api/query-string-machine/query-string-machine-getall
  - /patterns/query-parameters-pattern
prerequisites:
  - /patterns/query-parameters-pattern
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# sceneryPhetQueryParameters and isResettingAllProperty

`sceneryPhetQueryParameters` and `isResettingAllProperty` (both from `scenerystack/scenery-phet`) are two small, unrelated top-level values grouped on this page because neither is big enough to justify its own: one is a `QueryStringMachine.getAll(...)` schema object (see the [Query Parameters Pattern](/patterns/query-parameters-pattern) for the general mechanism), the other is a single global boolean flag Property.

```ts
import { sceneryPhetQueryParameters, isResettingAllProperty } from 'scenerystack/scenery-phet';
```

## sceneryPhetQueryParameters

```ts
sceneryPhetQueryParameters.backgroundColor; // string, defaults to 'white'
sceneryPhetQueryParameters.fontFamily;      // string, defaults to 'Arial'
```

| Parameter | Type | Default | Effect |
| --- | --- | --- | --- |
| `backgroundColor` | `string` | `'white'` | Any CSS color format (`'green'`, `'ff8c00'`, `'rgb(255,0,255)'`) |
| `fontFamily` | `string` | `'Arial'` | Any CSS `font-family`-compatible string |

::: warning This is `scenery-phet`'s internal demo-application schema, not a general sim query-parameter API
The source file's own doc comment labels these "Query parameters for the scenery-phet demo application" — the small internal gallery app used to visually exercise every `scenery-phet` component during development. They control that demo app's own screen background and font, not anything about how `scenery-phet` components behave inside a real simulation. If you're looking for a real sim's own query-parameter conventions, see the [Query Parameters Pattern](/patterns/query-parameters-pattern) and [`QueryStringMachine.getAll`](/api/query-string-machine/query-string-machine-getall) instead — most libraries define their own `<library>QueryParameters` module the same way this one does, but this specific instance isn't meant to be read by application code.
:::

## isResettingAllProperty

A single, always-present `TProperty<boolean>` (backed by a `TinyProperty`, so it isn't disposable and isn't PhET-iO instrumented) that is `true` for the duration of any "reset all" in progress, and `false` otherwise.

```ts
isResettingAllProperty.lazyLink( isResetting => {
  if ( isResetting ) {
    // e.g. suppress a sound effect that would otherwise fire from the reset itself
  }
} );
```

[`ResetAllButton`](/api/scenery-phet/reset-all-button) is the sole writer: it sets `isResettingAllProperty.value = isFiring` as its own `pushButtonModel.isFiringProperty` changes, so the flag flips `true` right as the button starts firing and back to `false` once the reset's callbacks finish. `scenery-phet`'s sound-generation base class (`SoundGenerator`, in `scenerystack/tambo`) reads it as one of several inputs to its `fullyEnabledProperty`, muting sound generators for the duration of a reset so a cascade of Property resets doesn't trigger a burst of individual sound effects.

::: tip A shared global, not scoped per-screen
There is exactly one `isResettingAllProperty` for the whole runtime — it isn't tied to a specific `ScreenView` or model. If two `ResetAllButton`s exist (unusual, but possible in a multi-screen sim with per-screen reset buttons active simultaneously in some embedded context), they both read and write the same flag.
:::
