---
title: Tandem
description: The naming/instrumentation handle giving every PhET-iO-tracked element a stable tree address.
category: api
library: tandem
tags: [tandem, phet-io, Tandem]
status: complete
related:
  - /api/joist/sim
  - /api/joist/screen
  - /api/scenery-phet/reset-all-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Tandem

`Tandem` (from `scenerystack/tandem`) is a node in a naming tree that gives every PhET-iO-instrumented element (a `Property`, a `Node`, a button, a `Screen`, …) a stable, hierarchical address like `mySim.myScreen.model.temperatureProperty`. You don't build a `Tandem` tree by hand for every element — you pass a parent `tandem` option down through your model/view and call `createTandem()` to extend it one level at a time as you construct children.

```ts
import { Tandem } from 'scenerystack/tandem';
```

## A minimal example

```ts
const screenTandem = Tandem.ROOT.createTandem( 'myScreen' );

class MyModel {
  public constructor( tandem: Tandem ) {
    const temperatureTandem = tandem.createTandem( 'temperatureProperty' );
    // pass temperatureTandem to a Property, button, etc. via its `tandem` option
  }
}

const model = new MyModel( screenTandem.createTandem( 'model' ) );
```

Each call to `createTandem( name )` returns (or reuses, if already created) a child `Tandem` whose `phetioID` is the parent's `phetioID` plus `.name` — you never construct a bare `new Tandem(...)` directly in sim code.

## Constructor

```ts
new Tandem( parentTandem: Tandem | null, name: string, providedOptions?: TandemOptions )
```

Sim code essentially never calls this directly — always use `someTandem.createTandem( 'childName' )` instead, which handles reuse and validation for you.

## Instance members

| Member | Description |
| --- | --- |
| `name` | The last path segment, e.g. `'temperatureProperty'` |
| `phetioID` | The fully-qualified dotted address, e.g. `'mySim.myScreen.model.temperatureProperty'` |
| `required` | Whether an object using this tandem must actually be supplied one (see `Tandem.REQUIRED`) |
| `supplied` | Whether a real (non-sentinel) tandem was actually provided |
| `createTandem( name, options? )` | Returns a child `Tandem`, creating it if it doesn't exist yet |
| `createGroupTandem( name, initialIndex? )` | Returns a `GroupTandem` for naming dynamically-created, indexed elements (`electron0`, `electron1`, …) |
| `hasAncestor( ancestor )` | Whether `ancestor` is somewhere above this tandem in the tree |
| `equals( tandem )` | Compares by `phetioID` |

## Well-known static tandems

| Static member | Use it for |
| --- | --- |
| `Tandem.ROOT` | The single root of the tree for this sim — the base every other tandem descends from |
| `Tandem.REQUIRED` | Default `tandem` value for common-code components that must be instrumented (e.g. buttons); throws in validated PhET-iO builds if never overridden with a real tandem |
| `Tandem.OPTIONAL` (alias `Tandem.OPT_OUT`) | Default for components that support instrumentation but don't require it |
| `Tandem.GENERAL_MODEL` / `Tandem.GENERAL_VIEW` / `Tandem.GENERAL_CONTROLLER` | Elements common to every sim, not specific to one screen |
| `Tandem.GLOBAL_MODEL` / `Tandem.GLOBAL_VIEW` | Sim-specific elements that don't belong to any one screen |
| `Tandem.PHET_IO_ENABLED` | Whether the sim is running under the PhET-iO brand at all |

::: tip `Tandem.REQUIRED` is a sentinel, not "no tandem needed"
Components like `ResetAllButton` or `NumberControl` default their `tandem` option to `Tandem.REQUIRED` precisely so that forgetting to supply a real one is loud (an assertion failure) rather than silently producing an uninstrumented, unaddressable element. Always pass a real `tandem.createTandem( '...' )` down from the screen's root tandem, even in a sim you never intend to run under PhET-iO.
:::
