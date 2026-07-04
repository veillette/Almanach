---
title: TinyEmitter
description: The dependency-free, no-PhET-iO Emitter core that axon uses internally for hot paths.
category: api
library: axon
tags: [axon, TinyEmitter, Emitter, events, performance]
status: complete
prerequisites:
  - /api/axon/emitter
related:
  - /api/axon/emitter
  - /api/axon/tiny-property
  - /patterns/emitter-vs-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# TinyEmitter

`TinyEmitter<T>` (from `scenerystack/axon`) is the same discrete-event abstraction as [`Emitter`](/api/axon/emitter) — `addListener`, `removeListener`, `emit`, `dispose` — but without the PhET-iO instrumentation, tandem, or `parameters` metadata layered on top. `Emitter` actually *is* a thin `TinyEmitter` wrapper internally; reach for `TinyEmitter` directly when you're writing axon-internal or high-frequency code (per-frame or per-listener-call overhead matters) and don't need PhET-iO data-stream support.

```ts
import { TinyEmitter } from 'scenerystack/axon';

const resizeEmitter = new TinyEmitter<[ width: number, height: number ]>();

resizeEmitter.addListener( ( width, height ) => {
  console.log( `resized to ${width}x${height}` );
} );

resizeEmitter.emit( 800, 600 );
```

## Constructor

Unlike `Emitter`'s single config-object constructor, `TinyEmitter` takes up to four positional arguments (any of which may be omitted or passed as `null`) instead of an options object — this avoids allocating an options object on hot construction paths:

```ts
new TinyEmitter<T>(
  onBeforeNotify?: TEmitterListener<T> | null,
  hasListenerOrderDependencies?: boolean | null,
  reentrantNotificationStrategy?: 'stack' | 'queue' | null,
  disableListenerLimit?: boolean | null
)
```

| Parameter | Default | Effect |
| --- | --- | --- |
| `onBeforeNotify` | `undefined` | Called with the same arguments as `emit()`, just before listeners are notified |
| `hasListenerOrderDependencies` | `undefined` | Set `true` to assert that listener order must stay fixed (relevant only under the `?listenerOrder` debug query parameter) |
| `reentrantNotificationStrategy` | `'stack'` | `'stack'`: a nested `emit()` call (triggered from within a listener) fully resolves before the outer `emit()` continues notifying. `'queue'`: nested `emit()` calls are queued and notified breadth-first, after the current round finishes |
| `disableListenerLimit` | `undefined` | Skips the dev-mode assertion that flags runaway listener counts |

## Methods

| Method | Effect |
| --- | --- |
| `emit( ...args )` | Calls every listener synchronously with `args` |
| `addListener( listener )` | Registers a listener; asserts if the same listener is already registered |
| `removeListener( listener )` | Removes a specific listener |
| `removeAllListeners()` | Removes every listener |
| `hasListener( listener )` | Checks whether a listener is registered |
| `hasListeners()` | Whether any listener is registered |
| `getListenerCount()` | Number of registered listeners |
| `forEachListener( callback )` | Invokes `callback` once per listener — used internally by [`TinyProperty`](/api/axon/tiny-property) |
| `dispose()` | Removes all listeners |

::: tip TinyEmitter is what Emitter is built from
`Emitter` is a `TinyEmitter` plus PhET-iO `tandem`/`parameters` options and `phetioReadOnly` bookkeeping — the actual `emit()`/`addListener()` mechanics (including the `'stack'` vs. `'queue'` reentrancy handling) live entirely in `TinyEmitter`. Use `Emitter` for anything that needs a `tandem` for the data stream or PhET-iO API docs; use `TinyEmitter` for internal plumbing (as [`TinyProperty`](/api/axon/tiny-property), `TinyForwardingProperty`, and `TinyStaticProperty` all do) where allocating that metadata on every instance would be wasted memory.
:::
