---
title: PhetioCapsule
description: A PhET-iO-aware container for a single, lazily-created instrumented element, like an on-demand dialog.
category: api
library: tandem
tags: [tandem, phet-io, PhetioCapsule, dynamic-elements]
status: complete
related:
  - /api/tandem/phetio-group
  - /api/tandem/phetio-object
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PhetioCapsule

`PhetioCapsule` (from `scenerystack/tandem`) manages a single, lazily-created [`PhetioObject`](/api/tandem/phetio-object) that can be created, disposed, and recreated over a simulation's lifetime — the PhET-iO-aware way to say "this dialog/panel doesn't exist until the user first needs it," while still giving PhET-iO a stable identity and API surface to describe before it's ever built. It shares its "build an archetype first" mechanics with [`PhetioGroup`](/api/tandem/phetio-group), but holds at most one element instead of an indexed collection.

```ts
import { PhetioCapsule } from 'scenerystack/tandem';
import { Tandem } from 'scenerystack/tandem';
import { Dialog } from 'scenerystack/sun';

const preferencesDialogCapsule = new PhetioCapsule(
  tandem => new Dialog( preferencesContentNode, { tandem } ),
  [], // defaultArguments for building the archetype
  { tandem: Tandem.REQUIRED.createTandem( 'preferencesDialogCapsule' ) }
);

// Only actually constructs the Dialog the first time it's requested:
const preferencesDialog = preferencesDialogCapsule.getElement();
preferencesDialog.show();
```

As with `PhetioGroup`, `createElement` is called once up front with `defaultArguments` to build a hidden archetype so PhET-iO can describe the element's API before it's ever really created, and again — lazily, on first `getElement()` — to build the real instance.

## Methods

| Method | Effect |
| --- | --- |
| `getElement( ...args )` | Creates the element on first call (using `args`), then returns the same instance on subsequent calls |
| `hasElement()` | Whether the element currently exists |
| `create( args, fromStateSetting? )` | Lower-level create, primarily for internal/PhET-iO state-engine use — prefer `getElement()` |
| `disposeElement()` | Disposes the current element (used by the PhET-iO state engine when recreating the capsule's contents from saved state) |
| `clear( options? )` | Disposes the element if `disposeOnClear` is set (the default) |

## Options specific to PhetioCapsule

| Option | Default | Effect |
| --- | --- | --- |
| `disposeOnClear` | `true` | If `false`, `clear()` is a no-op and the element is never disposed — appropriate for something like an "About" dialog that, once built, should persist for the sim's lifetime rather than being torn down and rebuilt |
| `disposeCreatedOnStateSet` | `false` | If `true`, forces disposal-and-recreation on every PhET-iO state set rather than reusing an existing element — only needed for capsules holding heterogeneous element types |

::: tip Reach for `PhetioCapsule` for "at most one, lazily built," not for permanent singletons
If something is constructed once at startup and lives for the sim's entire lifetime (most `Screen`-level view components), it doesn't need `PhetioCapsule` at all — just construct it directly. `PhetioCapsule` earns its keep specifically when construction is deferred (to avoid startup cost) or when the element can be destroyed and rebuilt later, and you still want PhET-iO to know about its shape ahead of time via the archetype.
:::
