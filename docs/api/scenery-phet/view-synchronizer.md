---
title: ViewSynchronizer
description: A small utility that keeps a container Node's children in sync with an array of model elements, via a view factory function.
category: api
library: scenery-phet
tags: [scenery-phet, ViewSynchronizer, model-view, dynamic-elements]
status: complete
related:
  - /api/axon/observable-array
  - /patterns/dispose-and-memory-management
  - /patterns/composing-view-nodes
prerequisites:
  - /api/axon/observable-array
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ViewSynchronizer

`ViewSynchronizer<Model, View extends Node>` (from `scenerystack/scenery-phet`) is a plain (non-`Node`) utility class that automates the common "one view Node per model element" bookkeeping: give it a container `Node` and a factory function, and its `add`/`remove` methods create-and-attach or detach-and-dispose the corresponding view for you, tracked internally in a `Map`. It's most useful paired with an [observable array](/api/axon/observable-array) of model elements, wiring `add`/`remove` straight to `elementAddedEmitter`/`elementRemovedEmitter`.

```ts
import { ViewSynchronizer } from 'scenerystack/scenery-phet';
import { createObservableArray } from 'scenerystack/axon';
import { Node, Circle } from 'scenerystack/scenery';
```

## A minimal example

```ts
type Particle = { id: number; radius: number };

const particles = createObservableArray<Particle>();
const particlesLayer = new Node();

const synchronizer = new ViewSynchronizer<Particle, Node>( particlesLayer, particle =>
  new Circle( particle.radius, { fill: 'blue' } )
);

particles.elementAddedEmitter.addListener( particle => synchronizer.add( particle ) );
particles.elementRemovedEmitter.addListener( particle => synchronizer.remove( particle ) );

particles.push( { id: 1, radius: 10 } ); // creates a Circle and adds it to particlesLayer
particles.pop();                          // removes that Circle from particlesLayer and disposes it
```

## Constructor

```ts
new ViewSynchronizer<Model, View extends Node>(
  container: Node,
  factory: ( model: Model ) => View
)
```

| Parameter | Effect |
| --- | --- |
| `container` | The `Node` that every created view becomes a child of |
| `factory` | Builds the view `Node` for a given model element; called once per `add()` |

## Public API

| Member | Description |
| --- | --- |
| `add( model )` | Builds a view via `factory( model )`, records the model → view mapping, and adds the view as a child of `container` |
| `remove( model )` | Looks up the view for `model`, removes it from `container`, calls `view.dispose()`, and forgets the mapping |
| `getView( model )` | Returns the view currently associated with `model` |
| `getViews()` | Returns an array of every currently-tracked view |
| `dispose()` | Calls `remove()` for every tracked model element, tearing down all views at once |

::: tip `ViewSynchronizer` doesn't listen to anything on its own
It exposes `add`/`remove` as plain methods — you're responsible for calling them at the right time, typically from an observable array's `elementAddedEmitter`/`elementRemovedEmitter` listeners as shown above. This keeps `ViewSynchronizer` decoupled from any specific collection type. See [Dispose and Memory Management](/patterns/dispose-and-memory-management) for why `remove()` disposing the view (rather than just detaching it) matters for dynamically-created elements.
:::
