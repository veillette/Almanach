---
title: Accessible Interaction Tutorial
description: Making a custom draggable Node fully accessible end-to-end.
category: guides
tags: [accessibility, tutorial, pdom, keyboard]
status: complete
related:
  - /accessibility/pdom
  - /patterns/drag-listeners
  - /guides/scenery-input
  - /patterns/model-view-separation
prerequisites:
  - /accessibility/pdom
  - /patterns/drag-listeners
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Accessible Interaction Tutorial

This walks through making one custom interaction — a draggable "planet" — fully accessible: operable with a mouse, a touchscreen, and a keyboard alone, and correctly announced by a screen reader. Each step below is necessary; skipping any one of them leaves a subset of users unable to use the interaction.

## Step 0: the model and view, unaccessible

Start from an ordinary [model-view separation](/patterns/model-view-separation) setup — a `positionProperty` and a `Circle` observing it:

```ts
import { Property } from 'scenerystack/axon';
import { Vector2 } from 'scenerystack/dot';
import { Circle } from 'scenerystack/scenery';

const positionProperty = new Property( new Vector2( 0, 0 ) );

const planetNode = new Circle( 20, { fill: 'steelblue', cursor: 'pointer' } );
positionProperty.link( position => {
  planetNode.translation = position;
} );
```

At this point nothing is accessible: there's no pointer interaction yet, and the Node doesn't exist in the [Parallel DOM](/accessibility/pdom) at all.

## Step 1: pointer + keyboard dragging together

Use `RichDragListener` so pointer and keyboard dragging are wired from one declaration instead of two separately-maintained listeners:

```ts
import { RichDragListener } from 'scenerystack/scenery';
import { Bounds2 } from 'scenerystack/dot';

planetNode.addInputListener( new RichDragListener( {
  positionProperty: positionProperty,
  dragBoundsProperty: new Property( new Bounds2( -200, -200, 200, 200 ) ),
  keyboardDragListenerOptions: {
    dragSpeed: 150,      // model units/second while a key is held
    shiftDragSpeed: 50   // finer control with Shift held
  }
} ) );
```

`RichDragListener`'s keyboard half only works once the Node is actually focusable — that's the next step.

## Step 2: joining the Parallel DOM

Give the Node a `tagName` (placing it in the PDOM at all) and make it `focusable`:

```ts
planetNode.tagName = 'div';
planetNode.focusable = true;
```

Without this, `RichDragListener`'s pointer half still works, but there is nothing in the tab order for a keyboard user to reach — the keyboard half of the listener never fires because the Node can never receive focus.

## Step 3: an accessible name and help text

A focusable, unnamed element is barely better than an unfocusable one — a screen reader announces it as "group" or similar, with no indication of what it is or does:

```ts
planetNode.accessibleName = 'Planet';
planetNode.accessibleHelpText = 'Move with arrow keys. Drag with a mouse or touch.';
```

`accessibleName` is what's announced when focus lands on the element; `accessibleHelpText` is supplementary guidance announced alongside it — keep the name short (a noun phrase) and put instructions in the help text, not the name.

## Step 4: focus order

If this Node isn't naturally reached in a sensible order via scene-graph traversal (e.g. it's added before some controls that should logically come first), set `pdomOrder` explicitly on its `ScreenView`:

```ts
screenView.pdomOrder = [
  massControlPanel,
  planetNode,
  resetAllButton
];
```

## Putting it together

```ts
import { Property } from 'scenerystack/axon';
import { Vector2, Bounds2 } from 'scenerystack/dot';
import { Circle, RichDragListener } from 'scenerystack/scenery';

const positionProperty = new Property( new Vector2( 0, 0 ) );

const planetNode = new Circle( 20, {
  fill: 'steelblue',
  cursor: 'pointer',

  // Parallel DOM
  tagName: 'div',
  focusable: true,
  accessibleName: 'Planet',
  accessibleHelpText: 'Move with arrow keys. Drag with a mouse or touch.'
} );

positionProperty.link( position => {
  planetNode.translation = position;
} );

planetNode.addInputListener( new RichDragListener( {
  positionProperty: positionProperty,
  dragBoundsProperty: new Property( new Bounds2( -200, -200, 200, 200 ) ),
  keyboardDragListenerOptions: { dragSpeed: 150, shiftDragSpeed: 50 }
} ) );
```

Scenery draws a visible focus highlight around focusable Nodes automatically once they're focused; override it with the `focusHighlight` option only if the default rectangle is visually wrong for your shape (e.g. a highlight that should hug a circular Node more tightly).

::: tip Verify with a keyboard, not just by reading the code
Unplug your mouse and tab to the Node: it should receive a visible focus highlight, be operable with arrow keys (and Shift for fine control), and a screen reader (or the browser's accessibility inspector) should announce the `accessibleName`/`accessibleHelpText` you set. Each of Steps 1–3 above is independently testable and independently easy to forget — verify all three, not just that dragging "works" with a mouse.
:::

## Where to go next

- [The Parallel DOM (PDOM)](/accessibility/pdom) — the full accessibility-option reference this tutorial draws from
- [Drag Listeners](/patterns/drag-listeners) — `DragListener`/`KeyboardDragListener`/`RichDragListener` in more depth
- [Scenery Input](/guides/scenery-input) — the lower-level pointer/event model these listeners are built on
