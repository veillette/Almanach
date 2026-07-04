---
title: Emitter
description: Discrete events that are not state.
category: api
library: axon
tags: [axon, Emitter, events]
status: complete
related:
  - /api/axon/property
  - /api/axon/derived-property
  - /api/axon/observable-array
  - /patterns/emitter-vs-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Emitter

`Emitter<T>` (from `scenerystack/axon`) is a typed event bus for discrete occurrences that carry no persistent state — a reset button being pressed, a collision happening, a level being completed. Unlike [`Property`](/api/axon/property), an `Emitter` has no "current value": a newly-added listener does *not* get called back with anything, it only hears about events that happen after it subscribes.

```ts
import { Emitter } from 'scenerystack/axon';

const resetEmitter = new Emitter();

resetEmitter.addListener( () => console.log( 'sim was reset' ) );
resetEmitter.emit(); // logs "sim was reset"
```

## Typed parameters

`Emitter<T extends TEmitterParameter[] = []>` is generic over the tuple of arguments passed to `emit()`. Declare the parameter types as a tuple:

```ts
const scoredEmitter = new Emitter<[ points: number, isBonus: boolean ]>();

scoredEmitter.addListener( ( points, isBonus ) => {
  console.log( `scored ${points} points${isBonus ? ' (bonus!)' : ''}` );
} );

scoredEmitter.emit( 10, false );
```

## Methods

| Method | Effect |
| --- | --- |
| `emit( ...args )` | Calls every listener synchronously with `args` |
| `addListener( listener )` | Registers a listener to be called on `emit()` |
| `removeListener( listener )` | Removes a specific listener |
| `removeAllListeners()` | Removes every listener |
| `hasListener( listener )` | Checks whether a listener is registered |
| `hasListeners()` | Whether any listener is registered |
| `getListenerCount()` | Number of registered listeners |
| `dispose()` | Removes all listeners; call this when the Emitter's owner is disposed |

## Options

`EmitterOptions` is mostly PhET-iO metadata (`tandem`, `phetioDocumentation`, `parameters` describing each argument for the data stream) plus two low-level tuning knobs inherited from `TinyEmitter`:

| Option | Effect |
| --- | --- |
| `reentrantNotificationStrategy` | `'stack'` (default) or `'queue'` — controls ordering when a listener triggers another `emit()` of the same Emitter while still notifying |
| `disableListenerLimit` | Disables the dev-mode assertion that catches an unbounded number of listeners (a common memory-leak symptom) |

```ts
const explodedEmitter = new Emitter( {
  reentrantNotificationStrategy: 'queue'
} );
```

::: tip Emitter vs. Property
If what you're modeling has a "current value" that late-arriving listeners should immediately see — visibility, a numeric setting, a mode — use [`Property`](/api/axon/property) (or a typed subclass). Reach for `Emitter` only for momentary occurrences with no meaningful "current state." See [Emitter vs. Property](/patterns/emitter-vs-property) for more on making this call. [`createObservableArray`](/api/axon/observable-array) uses `Emitter`s internally (`elementAddedEmitter`, `elementRemovedEmitter`) as a good worked example of the distinction — the array's contents are state (its `lengthProperty`), but each add/remove is a discrete event.
:::
