---
title: TinyProperty
description: The minimal Property base, without phet-io instrumentation or validation, that Property and scenery internals build on.
category: api
library: axon
tags: [axon, TinyProperty, Property, performance]
status: complete
prerequisites:
  - /api/axon/property
related:
  - /api/axon/property
  - /api/axon/tiny-emitter
  - /api/axon/dynamic-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# TinyProperty

`TinyProperty<T>` (from `scenerystack/axon`) is a lightweight observable value wrapper that implements enough of the `Property` interface (`.value`, `.get()`/`.set()`, `link()`/`lazyLink()`/`unlink()`) to be used interchangeably in many places, but without [`Property`](/api/axon/property)'s validation, PhET-iO instrumentation, or `reset()`/`initialValue` bookkeeping. It directly extends [`TinyEmitter`](/api/axon/tiny-emitter) rather than composing one, specifically to save memory — scenery uses a `TinyProperty` for every Node's dozens of internal state values (`opacityProperty`, `visibleProperty`'s underlying storage, `pickableProperty`, etc.), so the per-instance overhead matters at that scale.

```ts
import { TinyProperty } from 'scenerystack/axon';

const opacityProperty = new TinyProperty( 1 );

opacityProperty.link( opacity => console.log( 'opacity:', opacity ) ); // logs "opacity: 1"
opacityProperty.value = 0.5;                                          // logs "opacity: 0.5"
```

## Constructor

```ts
new TinyProperty<T>(
  value: T,
  onBeforeNotify?: TinyEmitterOptions<...>['onBeforeNotify'] | null,
  hasListenerOrderDependencies?: boolean | null,
  reentrantNotificationStrategy?: 'stack' | 'queue' | null,
  disableListenerLimit?: boolean | null
)
```

The trailing four parameters are forwarded straight to the underlying [`TinyEmitter`](/api/axon/tiny-emitter) — `TinyProperty` itself only adds the first `value` argument. Unlike plain `TinyEmitter` (which defaults to `'stack'`), `TinyProperty` defaults `reentrantNotificationStrategy` to `'queue'`, so that if a listener changes the value again while still notifying (a → b, and a listener sets b → c), all listeners see the a→b change in order before any b→c notification begins.

## Methods and members

| Member | Effect |
| --- | --- |
| `value` (getter/setter) | Reads or writes the current value; setting is a no-op if the new value `areValuesEqual` the old one |
| `get()` / `set( value )` | Same as `.value`, provided as explicit methods for hot inner loops |
| `link( listener )` | Adds a listener and immediately calls it with `( value, null, this )` |
| `lazyLink( listener )` | Adds a listener without an immediate callback |
| `unlink( listener )` / `unlinkAll()` | Removes one or all listeners |
| `linkAttribute( object, attributeName )` | Sets `object[attributeName] = value` whenever the value changes |
| `valueComparisonStrategy` | Get/set the equality strategy (defaults to `'reference'`) used by `areValuesEqual` to decide whether to notify |
| `isSettable()` | Always returns `true` for `TinyProperty` |
| `dispose()` | Unlinks all listeners, then disposes the underlying `TinyEmitter` |

::: warning Not validated, not instrumented, no reset
`TinyProperty` has no `validValues`/`valueType`/`isValidValue` checking, no `tandem`, and no `initialValue`/`reset()` — assigning any value of the declared type always succeeds silently. It exists purely as a memory-lean building block for framework internals (scenery Node state, [`DynamicProperty`](/api/axon/dynamic-property)'s internal wrapping, [`MappedProperty`](/api/axon/unit-conversion-property)). For simulation model state that simulation-author code creates directly, use [`Property`](/api/axon/property) (or a typed subclass) instead — the safety and PhET-iO support are almost always worth the extra bytes.
:::
