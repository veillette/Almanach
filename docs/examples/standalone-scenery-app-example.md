---
title: Standalone Scenery App Example
description: Using scenery as a standalone rendering library outside the joist shell.
category: examples
tags: [example, scenery, standalone]
status: complete
related:
  - /patterns/model-view-separation
  - /patterns/drag-listeners
  - /patterns/dispose-and-memory-management
  - /accessibility/pdom
  - /api/scenery/node
prerequisites:
  - /getting-started/what-is-scenerystack
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Standalone Scenery App Example

`Sim`/`Screen`/`ScreenView` (from `scenerystack/sim`) are optional — `scenery` itself is a general-purpose scene graph and rendering library, usable in any web page via its own `Display` class. This is the right choice for an embedded widget, a small interactive figure, or anything that isn't a full PhET-style application with a navigation bar and a home screen. This page builds a tiny standalone app: a `Display` rooted at a single `Node`, animated on every frame, with no `Sim` anywhere.

## Creating a Display

A `Display` takes a root `Node` and produces a real `HTMLElement` (`display.domElement`) that you attach to the page yourself:

```ts
import { Display, Node, Circle } from 'scenerystack/scenery';

const rootNode = new Node();

const display = new Display( rootNode, {
  width: 640,
  height: 480,
  backgroundColor: '#222'
} );

document.body.appendChild( display.domElement );
```

Unlike a `Sim`, nothing about `Display` assumes there is only one on the page — you can create as many as you have containers for.

## Model and view, the same as any SceneryStack app

[Model-view separation](/patterns/model-view-separation) still applies outside of joist — only the application shell is gone, not the architecture:

```ts
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';

const angleProperty = new NumberProperty( 0, {
  range: new Range( 0, 2 * Math.PI )
} );

const dot = new Circle( 8, { fill: 'orange' } );
angleProperty.link( angle => {
  dot.center = rootNode.center.plus( new Vector2( Math.cos( angle ), Math.sin( angle ) ).timesScalar( 100 ) );
} );
```

```ts
import { Vector2 } from 'scenerystack/dot';

rootNode.addChild( dot );
rootNode.addChild( new Circle( 2, { fill: 'white', center: rootNode.center } ) ); // origin marker
```

## Driving input and animation

A standalone `Display` needs to be told explicitly to listen for input and to step forward each frame — a `Sim` normally does both of these for you:

```ts
// Connect pointer/keyboard events to the scene graph.
display.initializeEvents();

// Advance the model and repaint on every animation frame.
display.updateOnRequestAnimationFrame( dt => {
  angleProperty.value = ( angleProperty.value + dt ) % ( 2 * Math.PI );
} );
```

`updateOnRequestAnimationFrame`'s callback receives `dt` in seconds and runs *before* the display repaints that frame — it's the standalone equivalent of a model's `step( dt )` method, called once per frame instead of once per sim.

Interactive listeners work exactly as documented in [Drag Listeners](/patterns/drag-listeners) and [The Parallel DOM](/accessibility/pdom) — both are properties of `Node`/`Display`, not of `Sim`:

```ts
import { DragListener } from 'scenerystack/scenery';

dot.cursor = 'pointer';
dot.addInputListener( new DragListener( {
  useParentOffset: true,
  drag: () => { /* e.g. pause the automatic animation while dragged */ }
} ) );
```

::: tip Resize the Display yourself
A `Sim` listens for window resizes and lays out the navigation bar and current screen automatically. A standalone `Display` does not — call `display.setWidthHeight( width, height )` (or recreate the `Display` with new dimensions) from your own `resize` listener if the container can change size, otherwise content is clipped or letterboxed at whatever size the `Display` was constructed with.
:::

## Where to go next

- [Scenery Layout Examples](/examples/scenery-layout-examples) — arranging multiple Nodes inside a standalone `Display`
- [Dispose and Memory Management](/patterns/dispose-and-memory-management) — cleaning up a `Display` and its listeners if the embedding page removes it
- [Demo Simulation Walkthrough](/examples/demo-simulation-walkthrough) — the equivalent shape wrapped in a full `Sim` instead
