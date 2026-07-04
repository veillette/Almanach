---
title: Display
description: The root object that turns a Node tree into rendered/attached DOM output.
category: api
library: scenery
tags: [scenery, Display, rendering, input]
status: verified
related:
  - /api/scenery/node
  - /guides/scenery-input
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Display

`Display` (from `scenerystack/scenery`) is the bridge between a [`Node`](/api/scenery/node) scene graph and the actual DOM: it owns a root DOM element, tracks a root `Node`, and repaints that DOM element whenever you call `updateDisplay()`. Every scenery application needs exactly one (or occasionally more) `Display` — nothing is drawn to the page until one exists and is driven.

```ts
import { Display, Node, Circle } from 'scenerystack/scenery';

const rootNode = new Node( {
  children: [ new Circle( 30, { fill: 'orange', x: 100, y: 100 } ) ]
} );

const display = new Display( rootNode, {
  width: 400,
  height: 300,
  backgroundColor: 'white'
} );

document.body.appendChild( display.domElement );

display.initializeEvents();          // wires up mouse/touch/keyboard input
display.updateOnRequestAnimationFrame( dt => {
  // per-frame update logic (dt is elapsed seconds) goes here
} );
```

The typical lifecycle is: build a root `Node`, construct a `Display` around it, attach `display.domElement` to the page, call `initializeEvents()` if the scene needs input, then drive repaints with `updateOnRequestAnimationFrame()` (or call `updateDisplay()` yourself in a custom loop).

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `width` / `height` | `640` / `480` | Initial size of the Display's DOM element |
| `backgroundColor` | `null` | A CSS color string or `Color` applied to the root DOM element |
| `allowCSSHacks` | `true` | Applies CSS (disables text selection, touch callouts, drag) that makes the element behave like an interactive app surface rather than a document |
| `allowSceneOverflow` | `false` | When `false`, content outside the Display's bounds is clipped |
| `allowWebGL` | `true` | Whether WebGL-rendered drawables are allowed at all in this Display |
| `accessibility` | `true` | Enables PDOM (accessibility tree) creation and support |
| `interactive` | `true` | Whether input events reach listeners; setting `false` also interrupts in-progress input |
| `assumeFullWindow` | `false` | If `true`, skips a `getBoundingClientRect()` call per event by assuming the Display fills the browser viewport |
| `container` | — | An existing `HTMLElement` to repurpose as the Display's root element, instead of creating a new one |

## Frequently used methods

| Method | Effect |
| --- | --- |
| `updateDisplay()` | Synchronously syncs the scene graph and repaints the DOM element — call this once per frame |
| `updateOnRequestAnimationFrame( stepCallback? )` | Drives `updateDisplay()` from `requestAnimationFrame`, optionally calling `stepCallback( dt )` first each frame |
| `initializeEvents( options? )` | Attaches browser input listeners so `Node` input listeners (e.g. [`FireListener`](/api/scenery/fire-listener)) start receiving events |
| `detachEvents()` | Reverses `initializeEvents()` |
| `addInputListener( listener )` / `removeInputListener( listener )` | Adds/removes a listener that hears every input event on the whole Display, not scoped to one Node |
| `setWidthHeight( width, height )` | Resizes the DOM element on the next `updateDisplay()` |
| `getRootNode()` / `.rootNode` | Returns the root `Node` this Display renders |
| `dispose()` | Tears down the Display, detaching events and releasing DOM/listener resources |

## Reading `domElement`

`display.domElement` (or `display.getDOMElement()`) is the plain `HTMLElement` you attach to the page yourself — `Display` does not insert itself into the DOM automatically:

```ts
document.body.appendChild( display.domElement );
```

::: tip Input requires `initializeEvents()`
Constructing a `Display` does not wire up mouse/touch/keyboard listeners by itself — attach a root `Node`'s [`inputListeners`](/api/scenery/node) (like a [`FireListener` or `PressListener`](/api/scenery/fire-listener)) and then call `display.initializeEvents()` once, or those listeners will never fire. Call `display.detachEvents()` if you need to reverse this later (e.g. tearing down the Display).
:::

::: warning Don't call `updateDisplay()` more than once per frame
`updateOnRequestAnimationFrame()` already schedules a repaint every animation frame; calling `updateDisplay()` again yourself outside that loop (or from multiple independent loops) does redundant sync/repaint work. Prefer driving all per-frame work through the single `stepCallback` passed to `updateOnRequestAnimationFrame()`.
:::
