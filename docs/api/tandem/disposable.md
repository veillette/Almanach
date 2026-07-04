---
title: Disposable
description: The base dispose-lifecycle class that PhetioObject (and therefore Node and every instrumented type) builds on.
category: api
library: tandem
tags: [tandem, axon, Disposable, dispose, lifecycle]
status: verified
related:
  - /api/tandem/phetio-object
  - /patterns/dispose-and-memory-management
prerequisites:
  - /patterns/dispose-and-memory-management
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Disposable

`Disposable`'s real import is `scenerystack/axon`, not `scenerystack/tandem` — but it's documented in this section because [`PhetioObject`](/api/tandem/phetio-object) extends it directly, making it the base of the dispose lifecycle for every instrumented class in the tandem/phet-io world (and, transitively, every `Node`, `Property`, and UI component built on `PhetioObject`). If you're calling `super.dispose()` inside an overridden `dispose()` method anywhere in a `PhetioObject` subclass, this is the class whose `dispose()` you eventually reach at the top of the chain.

```ts
import { Disposable, type DisposableOptions } from 'scenerystack/axon';

class MyResource extends Disposable {
  public constructor( providedOptions?: DisposableOptions ) {
    super( providedOptions );
  }

  public override dispose(): void {
    // ...clean up anything this class uniquely created...
    super.dispose(); // marks isDisposed, fires disposeEmitter
  }
}
```

Most SceneryStack code never extends `Disposable` directly — you get it for free through `Node` or `PhetioObject` — but understanding it clarifies exactly what `dispose()` guarantees you across the whole class hierarchy. See [Dispose and Memory Management](/patterns/dispose-and-memory-management) for the broader convention of when *you* need to write disposal code at all.

## What `dispose()` guarantees

- `isDisposed` flips to `true` only after `disposeEmitter` has fired — so a `disposeEmitter` listener always runs on a not-yet-`isDisposed` instance.
- Disposing twice is a hard error: `dispose()` asserts if called on an already-disposed instance.
- `disposeEmitter` fires *after* all prototype `dispose()` methods up the chain have run (i.e., after your subclass's own cleanup logic), so don't assume the object's fields are already torn down inside a `disposeEmitter` listener registered from outside the class.

## Instance members

| Member | Description |
| --- | --- |
| `isDisposed` | `true` once `dispose()` has completed |
| `isDisposable` | Settable flag; set to `false` to make this instance assert if anyone tries to dispose it |
| `disposeEmitter` | `TReadOnlyEmitter` that fires once, after disposal completes |
| `dispose()` | Runs cleanup and fires `disposeEmitter`; override to add your own logic, always calling `super.dispose()` |
| `addDisposable( ...disposables )` | Registers other `{ dispose(): void }` objects to be disposed automatically when this instance is |

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `isDisposable` | `true` | If `false`, this instance can never be disposed — useful for objects meant to exist for the sim's entire lifetime, where an accidental `dispose()` call should fail loudly instead of silently tearing down a permanent object |

::: tip `isDisposable: false` turns "should never be disposed" into an enforced invariant
Rather than just documenting that some long-lived singleton (an "About" dialog, a top-level model) should never be disposed, set `isDisposable: false` on it. Any accidental `dispose()` call anywhere in the codebase then fails an assertion immediately at the call site, instead of silently corrupting state or being caught only by manual review.
:::
