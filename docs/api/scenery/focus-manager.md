---
title: FocusManager
description: The static class that tracks DOM focus, pointer focus, and reading-block focus across a scenery application.
category: api
library: scenery
tags: [scenery, FocusManager, focus, accessibility, pdomFocus]
status: complete
related:
  - /api/scenery/parallel-dom-deep-dive
  - /api/scenery/interactive-highlighting
  - /accessibility/pdom
  - /accessibility/focus-highlights
prerequisites:
  - /accessibility/pdom
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# FocusManager

`FocusManager` (from `scenerystack/scenery`) is the class-level API behind scenery's focus system — it owns the Properties that track *where* focus currently is (DOM/keyboard focus, pointer hover focus for [Interactive Highlighting](/api/scenery/interactive-highlighting), and reading-block focus for Voicing) and a few Properties that control whether the corresponding highlights are visible. This page documents `FocusManager` itself; for what the Parallel DOM is and how to opt a `Node` into it, see [The Parallel DOM](/accessibility/pdom), and for customizing the highlight that's drawn, see [Focus Highlights](/accessibility/focus-highlights).

Simulation code rarely constructs a `FocusManager` directly — a `Display` owns one — but reads and writes its static `pdomFocus` to inspect or move keyboard focus programmatically:

```ts
import { FocusManager } from 'scenerystack/scenery';

// What Node currently has DOM/keyboard focus, if any
const focusedNode = FocusManager.pdomFocus?.trail.lastNode() ?? null;

// Move focus to null to defocus everything (also blurs the active element)
FocusManager.pdomFocus = null;
```

## Static members

`pdomFocus` is a **static** accessor, because the DOM itself only allows one focused element at a time — it wouldn't make sense per-Display.

| Member | Effect |
| --- | --- |
| `FocusManager.pdomFocus` | Static get/set `Focus \| null` — the `Focus` (a `Display` + `Trail` pair) whose Node currently has DOM/keyboard focus. Setting it to `null` blurs the active element |
| `FocusManager.pdomFocusProperty` | Static `Property<Focus \| null>` mirroring `pdomFocus`, for listening to focus changes rather than polling |
| `FocusManager.windowHasFocusProperty` | Static `TReadOnlyProperty<boolean>` — whether the browser window itself currently has focus (useful for pausing global keyboard listeners when the tab is backgrounded) |
| `FocusManager.attachToWindow()` / `detachFromWindow()` | Static — wires/unwires the window `focus`/`blur` listeners behind `windowHasFocusProperty`; called for you when a `Display` initializes events |

## Instance Properties

Each `Display` holds one `FocusManager` instance with these Properties:

| Property | Tracks |
| --- | --- |
| `pointerFocusProperty` | `Focus \| null` — the Node under the pointer that supports [Interactive Highlighting](/api/scenery/interactive-highlighting) |
| `lockedPointerFocusProperty` | `Focus \| null` — set while a pointer is actively interacting with a Node, so the highlight doesn't jump to whatever the pointer happens to be over mid-drag |
| `readingBlockFocusProperty` | `Focus \| null` — the Node whose Voicing "reading block" content is currently being spoken |
| `pdomFocusHighlightsVisibleProperty` | `boolean` — whether highlights for DOM/keyboard focus should be drawn |
| `interactiveHighlightsVisibleProperty` | `boolean` — whether pointer-hover highlights should be drawn (a user preference, off by default) |
| `readingBlockHighlightsVisibleProperty` | `boolean` — whether reading-block highlights should be drawn |
| `pointerHighlightsVisibleProperty` | Derived `boolean` — `true` if either interactive-highlight or reading-block highlights are enabled |

::: tip Setting `pdomFocus` does not scroll or validate focusability for you
`FocusManager.pdomFocus = new Focus( display, trail )` moves scenery's notion of focus, but the underlying DOM element must actually be focusable (`focusable: true` and present in the PDOM, see [The Parallel DOM](/accessibility/pdom)) — assigning a `Focus` for a Node that isn't focusable is a no-op from the browser's perspective even though the Property changes.
:::
