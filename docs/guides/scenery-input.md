---
title: Scenery Input
description: Overview of scenery's input system - pointers, listeners, and event phases.
category: guides
tags: [scenery, input, pointers, listeners]
status: complete
related:
  - /guides/scenery-basics
  - /patterns/drag-listeners
  - /accessibility/pdom
  - /api/scenery/node
prerequisites:
  - /guides/scenery-basics
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Scenery Input

Scenery unifies mouse, touch, and pen input behind one event model: every physical input source becomes a `Pointer` (a `Mouse`, `Touch`, or `Pen` instance), every DOM event becomes a `SceneryEvent` carrying the `Trail` of Nodes it hit, and any `Node` can attach listeners that react to it — no direct DOM event handling required.

## Attaching a listener

```ts
import { Node, Circle } from 'scenerystack/scenery';

const ball = new Circle( 20, { fill: 'crimson', cursor: 'pointer' } );

ball.addInputListener( {
  down: event => console.log( 'pressed', event.pointer.point ),
  up: event => console.log( 'released' ),
  over: event => { ball.fill = 'orange'; },
  out: event => { ball.fill = 'crimson'; }
} );
```

An input listener is a plain object (or class instance) whose keys are event names. Scenery calls the matching key when that event reaches a Node the listener is attached to.

| Event | Fires on |
| --- | --- |
| `down` / `up` / `cancel` | Pointer press, release, or interrupted press (any pointer type) |
| `move` | Pointer moved while over this Node |
| `enter` / `exit` | Pointer entered/left this Node's subtree (fires once per subtree, unlike `over`/`out`) |
| `over` / `out` | Pointer entered/left this specific Node |
| `click` | A full press-and-release on the same target |
| `focus` / `blur` | Keyboard/PDOM focus gained or lost |
| `keydown` / `keyup` | Key events while this Node has focus |

Type-specific variants (`mousedown`, `touchdown`, `pendown`, ...) exist for every generic event when you need to branch on pointer type without inspecting `event.pointer.type` yourself.

## SceneryEvent and the hit trail

The object passed to a listener is a `SceneryEvent`, carrying everything about *this* dispatch:

```ts
ball.addInputListener( {
  down: event => {
    event.pointer;        // the Pointer (Mouse | Touch | Pen) that triggered this
    event.trail;           // Trail: ordered list of Nodes from the Display's root to the leaf hit
    event.target;          // the leaf-most (deepest) Node in the trail
    event.currentTarget;   // the Node this particular listener is attached to
    event.domEvent;        // the underlying raw MouseEvent/TouchEvent/PointerEvent, or null
  }
} );
```

Events bubble: a listener on a parent `Node` still receives events that were hit-tested against one of its descendants, with `currentTarget` reflecting which ancestor the listener is actually attached to and `target`/`trail` reflecting where the pointer actually hit. Call `event.handled = true` inside a listener to stop the event bubbling to ancestors, or `event.abort()` to stop it from reaching any further listeners at all.

## Pointer areas and pickability

Two Node options control *whether* and *where* a Node can be hit at all:

```ts
import { Shape } from 'scenerystack/kite';

ball.touchArea = ball.localBounds.dilated( 10 ); // easier to tap on touchscreens than the visual bounds
ball.mouseArea = ball.localBounds;               // mouse hit area, independently of touch
ball.pickable = false;                            // excluded from hit-testing (still painted, if visible)
ball.inputEnabled = false;                        // subtree stops responding to input, without changing pickable
```

`touchArea`/`mouseArea` accept a `kite` `Shape` or a `Bounds2` and are commonly dilated beyond the visual bounds, since touch targets smaller than ~44px are hard to hit reliably.

## Structured listeners: PressListener, FireListener, DragListener

Handling `down`/`up`/`cancel` manually gets repetitive and easy to get subtly wrong (interrupted presses, multitouch). The `scenery` listener classes wrap the raw events into higher-level behavior:

```ts
import { FireListener, PressListener, DragListener } from 'scenerystack/scenery';

button.addInputListener( new FireListener( {
  fire: () => console.log( 'fired!' ) // press-and-release, handles interruption for you
} ) );

someNode.addInputListener( new PressListener( {
  press: event => { /* pressed down */ },
  release: event => { /* released, still over the node */ }
} ) );
```

`DragListener` (and its keyboard-accessible counterpart `KeyboardDragListener`) is the most common of these — see [Drag Listeners](/patterns/drag-listeners) for the full pattern of wiring a listener to a model `positionProperty` through a `ModelViewTransform2`.

::: tip Pointer input alone is never accessible
Every listener shown above only responds to mouse/touch/pen. Keyboard users and screen reader users interact through the [Parallel DOM](/accessibility/pdom) instead — a fully accessible custom interaction needs a `tagName`, `focusable: true`, and a keyboard-driven listener (`KeyboardListener` or `KeyboardDragListener`) in addition to any pointer listener. See the [Accessible Interaction Tutorial](/guides/accessible-interaction-tutorial) for a worked example.
:::

## Where to go next

- [Drag Listeners](/patterns/drag-listeners) — the standard pattern for draggable model-bound Nodes
- [The Parallel DOM (PDOM)](/accessibility/pdom) — the accessible half of input handling
- [Accessible Interaction Tutorial](/guides/accessible-interaction-tutorial) — pointer and keyboard input on the same custom Node
