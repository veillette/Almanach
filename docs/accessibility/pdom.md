---
title: The Parallel DOM (PDOM)
description: How scenery renders an invisible, semantic HTML tree alongside the canvas so screen readers and keyboards can use the application.
category: accessibility
tags: [scenery, pdom, accessibility, a11y, screen-reader, tagName, accessibleName]
status: verified
related:
  - /patterns/drag-listeners
  - /accessibility/focus-highlights
  - /accessibility/alternative-input-overview
  - /accessibility/internationalized-accessible-names
  - /api/scenery/parallel-dom-deep-dive
prerequisites:
  - /getting-started/what-is-scenerystack
---

# The Parallel DOM (PDOM)

::: tip API reference vs. author guide
This page explains **why and how** simulation authors opt Nodes into the PDOM. For the full list of `ParallelDOM` trait options and accessors on `Node`, see [ParallelDOM](/api/scenery/parallel-dom-deep-dive).
:::

Scenery draws to Canvas/SVG/WebGL: To make applications accessible, scenery maintains a **Parallel DOM**: a hidden tree of real HTML elements that mirrors the interactive structure of the scene graph. Screen readers read it, keyboard focus moves through it, and input events on it are routed back to the corresponding Nodes.

You opt each Node into the PDOM with accessibility options — no separate accessibility tree to maintain.

## Basic options

```ts
import { Node, Rectangle } from 'scenerystack/scenery';

// A heading + paragraph in the PDOM
const infoSection = new Node( {
  tagName: 'div',
  labelTagName: 'h3',
  labelContent: 'Mass Controls',
  descriptionContent: 'Adjust the mass of each body, in kilograms.'
} );

// An interactive element: focusable, named, with help text
const resetShape = new Rectangle( 0, 0, 40, 40, {
  tagName: 'button',
  accessibleName: 'Reset Masses',
  accessibleHelpText: 'Return both masses to their starting values.'
} );
```

| Option | Meaning |
| --- | --- |
| `tagName` | HTML element representing this Node (`'div'`, `'button'`, `'ul'`, …). Setting it is what places the Node in the PDOM |
| `innerContent` | Text content inside the element |
| `labelTagName` / `labelContent` | A sibling label element (e.g. an `h3` before the content) |
| `descriptionContent` | A sibling description paragraph |
| `accessibleName` | The name announced by screen readers (higher-level API; prefer this) |
| `accessibleHelpText` | Supplementary guidance announced with the element |
| `focusable` | Whether the element is in the tab order (interactive `tagName`s like `'button'` already are) |

Common UI components from `sun` (buttons, sliders, checkboxes) come with sensible PDOM structure built in — you typically only supply `accessibleName` and `accessibleHelpText`.

## Focus order with pdomOrder

By default, PDOM order follows scene-graph order, which is a *rendering* order and often wrong for traversal. Set `pdomOrder` on a parent to control it explicitly:

```ts
screenView.pdomOrder = [
  massControlPanel,
  bodyNode,        // draggable — see /patterns/drag-listeners
  gridCheckbox,
  resetAllButton
];
```

Nodes omitted from `pdomOrder` follow afterwards in their natural order; `null` may be used as a placeholder for "everything else here".

## Custom interactions

A Node that implements its own interaction (like a custom draggable) needs three things:

```ts
bodyNode.tagName = 'div';
bodyNode.focusable = true;
bodyNode.accessibleName = 'Movable planet';
bodyNode.addInputListener( new KeyboardDragListener( { /* ... */ } ) );
```

1. A `tagName` so it exists in the PDOM,
2. `focusable: true` so keyboard users can reach it,
3. listeners that respond to keyboard input, not just pointers — see [Drag Listeners](/patterns/drag-listeners).

::: tip Test with the keyboard first
Before reaching for a screen reader, unplug your mouse: every interactive element should be reachable with <kbd>Tab</kbd>, operable with <kbd>Enter</kbd>/<kbd>Space</kbd>/arrows, and show a visible focus highlight (scenery draws these automatically for focusable Nodes).
:::
