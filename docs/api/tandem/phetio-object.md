---
title: PhetioObject
description: The base class giving any object PhET-iO instrumentation - a tandem, an IOType, and metadata like phetioState/phetioReadOnly.
category: api
library: tandem
tags: [tandem, phet-io, PhetioObject]
status: verified
related:
  - /api/tandem/tandem
  - /api/tandem/io-type
  - /api/tandem/disposable
  - /guides/phet-io-and-instrumentation
  - /patterns/phet-io-instrumentation-pattern
prerequisites:
  - /api/tandem/tandem
  - /guides/phet-io-and-instrumentation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PhetioObject

`PhetioObject` (from `scenerystack/tandem`) is the base class that gives any object PhET-iO instrumentation: a `tandem`, an `IOType` describing its serialization, and a fixed set of metadata flags (`phetioState`, `phetioReadOnly`, `phetioFeatured`, `phetioDocumentation`, …). You rarely instantiate it directly — `Property`, `Node`, `Emitter`, `Screen`, and most other instrumentable SceneryStack classes already extend it — but you extend it yourself when authoring a custom stateful class that needs its own PhET-iO presence rather than composing already-instrumented `Property`s.

```ts
import { PhetioObject, type PhetioObjectOptions, Tandem } from 'scenerystack/tandem';

type SelfOptions = { x?: number; y?: number };
type PositionOptions = SelfOptions & PhetioObjectOptions;

class Position extends PhetioObject {
  public x: number;
  public y: number;

  public constructor( providedOptions: PositionOptions ) {
    super( providedOptions );
    this.x = providedOptions.x ?? 0;
    this.y = providedOptions.y ?? 0;
  }
}

const origin = new Position( {
  x: 0, y: 0,
  tandem: Tandem.REQUIRED,
  phetioType: PositionIO // see IOType for how PositionIO would be declared
} );
```

`PhetioObject` extends [`Disposable`](/api/tandem/disposable), so every `PhetioObject` (and therefore every `Node`/`Property` built on it) already has `dispose()`, `isDisposed`, and `disposeEmitter` for free.

## Key behavior: initialization is conditional on being instrumented

The most important thing to understand about `PhetioObject` is that its PhET-iO machinery only fully activates when `PHET_IO_ENABLED && tandem.supplied` — that is, when the sim is actually running under the PhET-iO brand *and* a real (non-sentinel) `tandem` was passed in. Outside PhET-iO, `initializePhetioObject` returns early after recording the `tandem`/`phetioID` for tree-building purposes, without validating options or registering the object with the data stream. This is why getters like `phetioType`/`phetioState`/`phetioDocumentation` assert if you read them on an uninstrumented object — they're only meaningful once instrumentation actually happened.

## Constructor options

`PhetioObjectOptions` combines a handful of PhET-iO metadata fields with `DisposableOptions`:

| Option | Default | Effect |
| --- | --- | --- |
| `tandem` | `Tandem.OPTIONAL` | The instrumentation handle; subclasses often default this to `Tandem.REQUIRED` |
| `phetioType` | `IOType.ObjectIO` | Declares serialization/methods for this instance — see [IOType](/api/tandem/io-type) |
| `phetioState` | `true` | Whether this object's state is included in PhET-iO save/restore |
| `phetioReadOnly` | `false` | If `true`, external PhET-iO clients can read but not set this object |
| `phetioDocumentation` | `''` | Client-facing documentation shown in PhET-iO Studio; must not contain literal newlines (`<br>` instead) |
| `phetioFeatured` | `false` | Marks this element as one of the "featured" elements surfaced by default in Studio |
| `phetioEventType` | `EventType.MODEL` | Category tag applied to events this object emits via `phetioStartEvent`/`phetioEndEvent` |
| `tandemNameSuffix` | `null` | If set, asserts the tandem's name ends with this suffix (or an array of allowed suffixes) |

## Methods

| Method | Effect |
| --- | --- |
| `isPhetioInstrumented()` | `true` only if a real, supplied `tandem` was provided |
| `addLinkedElement( element, options? )` | Creates a one-way "symbolic link" to another `PhetioObject`, shown in Studio as a hyperlink — used by e.g. `NumberSpinner`/`NumberControl` to link their display to the `Property` they control |
| `phetioStartEvent( event, options? )` / `phetioEndEvent()` | Emits a nested event to the PhET-iO data stream, a no-op outside PhET-iO |
| `getMetadata( object? )` | Returns the plain-object metadata (`phetioTypeName`, `phetioState`, etc.) describing this instance or a metadata-shaped input |

::: warning `initializePhetioObject` can run after the constructor
Classes like `Node` need to support `mutate()`-style deferred configuration, so `PhetioObject` allows a subclass to call `super()` with no options and invoke `initializePhetioObject` later once real options are known. If you're authoring a subclass this way, keep in mind that `tandem`/`phetioID`/metadata all read as their un-instrumented defaults until that second call happens — don't read `phetioType`/`phetioDocumentation` in between.
:::
