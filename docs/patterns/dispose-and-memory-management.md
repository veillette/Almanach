---
title: Dispose and Memory Management
description: The dispose() convention - when Nodes/Properties/listeners must clean up.
category: patterns
tags: [dispose, memory, lifecycle]
status: verified
related:
  - /patterns/model-view-separation
  - /api/axon/property
  - /api/axon/derived-property
  - /patterns/multilink-pattern
prerequisites:
  - /patterns/model-view-separation
---

# Dispose and Memory Management

SceneryStack has no framework-managed component lifecycle — every long-lived object (`Node`, `Property`, `DerivedProperty`, `Multilink`, `PhetioObject`) has an explicit `dispose()` method, and every listener you register (`.link`, `.addListener`) is a strong reference that keeps its target alive until it's removed. If an object is created and destroyed *dynamically* (not for the lifetime of the whole sim), you are responsible for disposing it and unlinking anything it linked to — otherwise it, and everything it references, leaks.

## The core idea

```ts
import { DerivedProperty, NumberProperty } from 'scenerystack/axon';
import { Node, Circle } from 'scenerystack/scenery';

class TransientBadge extends Node {

  private readonly disposeTransientBadge: () => void;

  public constructor( scoreProperty: NumberProperty ) {
    super();

    const circle = new Circle( 10, { fill: 'gold' } );
    this.addChild( circle );

    // A derived Property created here holds a listener on scoreProperty
    // for as long as it lives.
    const isHighScoreProperty = new DerivedProperty( [ scoreProperty ], score => score > 100 );
    const listener = ( isHighScore: boolean ) => { circle.visible = isHighScore; };
    isHighScoreProperty.link( listener );

    // Anything this instance created that outlives its own scope must be torn
    // down explicitly, in reverse order of creation.
    this.disposeTransientBadge = () => {
      isHighScoreProperty.unlink( listener );
      isHighScoreProperty.dispose();
    };
  }

  public override dispose(): void {
    this.disposeTransientBadge();
    super.dispose();
  }
}
```

Create the badge and later remove it:

```ts
const badge = new TransientBadge( model.scoreProperty );
someParentNode.addChild( badge );

// When the badge is no longer needed:
someParentNode.removeChild( badge );
badge.dispose();
```

## What needs disposal, and what doesn't

| Object created for the sim's lifetime (one Screen, one model) | Object created/destroyed dynamically (a popup, a per-item Node in a list) |
| --- | --- |
| Never disposed — it lives as long as the sim does | **Must** be disposed when removed, and must dispose everything *it* uniquely created |

- `Property.link(listener)` keeps `listener` (and anything it closes over) alive for the Property's lifetime. Pair it with `unlink` in your `dispose()`, or use the `disposer` option (`link(listener, { disposer: this })`) so it's removed automatically when `this` is disposed.
- `DerivedProperty` and `Multilink` hold listeners on *their* dependencies — dispose them (`derivedProperty.dispose()`, `Multilink.unmultilink(multilink)`) or they keep the dependency chain alive indefinitely. See [The Multilink Pattern](/patterns/multilink-pattern).
- `Node.dispose()` already disposes the Node's own built-in Properties (`visibleProperty`, `enabledProperty`, etc.) and detaches it from parents/children — you only need to override it to clean up *extra* things your subclass created.

::: warning A Property/Node that is never disposed by design does not need a dispose() override
Most model and view objects in a one-screen sim are created once at startup and live until the tab closes — for those, skipping `dispose()` entirely is correct and is the common case in [Model-View Separation](/patterns/model-view-separation). Only add disposal logic to objects that are actually created and destroyed while the sim runs (list items, popups, transient UI). Adding unnecessary dispose plumbing to permanent objects is dead code that invites bugs.
:::
