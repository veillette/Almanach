---
title: Avoiding Property Leaks
description: Listener-unlinking discipline for Properties, DerivedProperties, and Multilinks so dynamically created objects don't leak their whole dependency chain.
category: patterns
tags: [axon, Property, memory, dispose, listeners]
status: complete
related:
  - /patterns/dispose-and-memory-management
  - /patterns/multilink-pattern
  - /api/axon/property
  - /api/axon/derived-property
prerequisites:
  - /patterns/dispose-and-memory-management
---

# Avoiding Property Leaks

[Dispose and Memory Management](/patterns/dispose-and-memory-management) covers the general rule: dynamically created objects must be disposed. This page is the specific failure mode that rule is guarding against for `Property`-based code — a `link`/`lazyLink` call is a strong reference in *both* directions, so a forgotten `unlink` doesn't just leak a listener, it can keep an entire object graph alive indefinitely, invisibly, with no error and no crash.

## How a Property leak actually happens

```ts
// A per-item Node created and destroyed as the list changes.
class ItemNode extends Node {
  public constructor( item: Item, sharedTotalProperty: NumberProperty ) {
    super();

    // sharedTotalProperty now holds a reference to this listener, which closes
    // over `this` (the ItemNode) - as long as sharedTotalProperty exists, so does this ItemNode.
    sharedTotalProperty.link( total => {
      this.opacity = total > 100 ? 0.5 : 1;
    } );
  }
  // No dispose() override - the listener above is never removed.
}
```

```ts
const itemNode = new ItemNode( item, model.totalProperty );
itemsLayer.addChild( itemNode );

// Later, the item is removed from the list...
itemsLayer.removeChild( itemNode );
itemNode.dispose(); // Node.dispose() runs, but the closure above is still linked to
                     // model.totalProperty, which lives for the sim's lifetime - itemNode
                     // (and everything it references) is kept alive forever.
```

`itemNode.dispose()` disposes the Node's own built-in Properties, but it does nothing about a listener `itemNode`'s constructor registered on someone *else's* Property — that link has to be undone explicitly, by the object that created it.

## The fix: track and unlink every listener you register

```ts
class ItemNode extends Node {

  private readonly disposeItemNode: () => void;

  public constructor( item: Item, sharedTotalProperty: NumberProperty ) {
    super();

    const totalListener = ( total: number ) => {
      this.opacity = total > 100 ? 0.5 : 1;
    };
    sharedTotalProperty.link( totalListener );

    this.disposeItemNode = () => sharedTotalProperty.unlink( totalListener );
  }

  public override dispose(): void {
    this.disposeItemNode();
    super.dispose();
  }
}
```

The `{ disposer }` option is the same fix with less boilerplate, when the removal should happen automatically whenever `this` is disposed:

```ts
sharedTotalProperty.link( total => {
  this.opacity = total > 100 ? 0.5 : 1;
}, { disposer: this } ); // unlinked automatically when this ItemNode is disposed - no unlink() call needed
```

## The three shapes this takes

| Construct | What leaks if not cleaned up | Cleanup |
| --- | --- | --- |
| `property.link(listener)` / `lazyLink(listener)` | `listener` and everything it closes over, kept alive by `property` | `property.unlink(listener)`, or `{ disposer: this }` on the `link` call |
| `DerivedProperty`/`new Multilink(...)` created locally | The `DerivedProperty`/`Multilink` itself holds listeners on *its* dependencies, keeping the whole chain alive | `derivedProperty.dispose()`; `Multilink.unmultilink(multilink)` — see [The Multilink Pattern](/patterns/multilink-pattern) |
| `Emitter.addListener(listener)` | Same shape as `link` — the Emitter, not the Property, holds the reference | `emitter.removeListener(listener)` |

Every one of these is invisible in normal testing — the object *looks* garbage-collectable, the sim doesn't crash, memory just grows slowly across many create/destroy cycles until a long play session degrades. That's what makes this class of bug worth a dedicated discipline rather than "fix it when it shows up."

::: warning A leak only exists when lifetimes differ
None of this applies to a `link` call where the listener and the Property it's listening to share the same lifetime (a model linking its own Properties in its own constructor, live for the sim's duration) — see [Dispose and Memory Management](/patterns/dispose-and-memory-management)'s table. The risk is specifically when a *shorter-lived* object (a popup, a list item, anything created after startup and removed before the sim closes) links to a *longer-lived* Property. Audit every `link`/`addListener` call in a dynamically-created class by asking "does what I'm linking to outlive me?" — if yes, it needs an explicit unlink in `dispose()`.
:::
