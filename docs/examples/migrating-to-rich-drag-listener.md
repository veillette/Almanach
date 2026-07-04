---
title: Migrating a Legacy Sim to RichDragListener
description: A before/after walkthrough of replacing a pointer-only DragListener with RichDragListener to add keyboard dragging without restructuring the model.
category: examples
tags: [example, scenery, DragListener, RichDragListener, KeyboardDragListener, migration, accessibility]
status: verified
related:
  - /patterns/drag-listeners
  - /api/scenery/rich-drag-listener
  - /api/scenery/keyboard-drag-listener
  - /accessibility/alternative-input-overview
  - /accessibility/pdom
  - /api/tandem/tandem
prerequisites:
  - /patterns/drag-listeners
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Migrating a Legacy Sim to RichDragListener

A common maintenance task is taking a sim view written years ago — a `Node` with a plain `DragListener` and nothing else — and bringing it up to current accessibility expectations without touching the model. This page walks through exactly that migration, grounded in what `DragListener` and `RichDragListener` actually do differently per source (`scenery/js/listeners/DragListener.ts` and `scenery/js/listeners/RichDragListener.ts`), not a hypothetical API.

## Before: pointer-only DragListener

A typical older view — draggable, but with no keyboard path at all:

```ts
// LegacyBallNode.ts — pointer dragging only
import { Circle, DragListener } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';
import type BallModel from './BallModel';

export default class LegacyBallNode extends Circle {
  public constructor( model: BallModel, tandem: Tandem ) {
    super( 20, { fill: 'cornflowerblue', cursor: 'pointer' } );

    this.addInputListener( new DragListener( {
      positionProperty: model.positionProperty,
      transform: model.modelViewTransform,
      dragBoundsProperty: model.dragBoundsProperty,
      allowTouchSnag: true,
      start: () => model.userControlledProperty.set( true ),
      end: () => model.userControlledProperty.set( false ),
      tandem: tandem.createTandem( 'dragListener' )
    } ) );
  }
}
```

This works fine for a mouse or touch user. There is no way to reach `LegacyBallNode` with <kbd>Tab</kbd>, and no way to move it with the keyboard — `DragListener` only implements the pointer-facing part of `TInputListener` (`down`, `up`, `move`, `click`, …). Per the class doc comment in `DragListener.ts`, it is deliberately a `PressListener` subtype "customized for handling most drag-related listener needs" for pointer input; keyboard support was never in scope for it.

## After: RichDragListener

`RichDragListener` doesn't extend `DragListener` — per its source, it *composes* an internal `DragListener` and an internal `KeyboardDragListener` and implements `TInputListener` itself, forwarding each callback to whichever internal listener applies. Migrating means three real changes, not just a class-name swap:

```ts
// BallNode.ts — pointer + keyboard dragging
import { Circle, RichDragListener } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';
import type BallModel from './BallModel';

export default class BallNode extends Circle {
  public constructor( model: BallModel, tandem: Tandem ) {
    super( 20, {
      fill: 'cornflowerblue',
      cursor: 'pointer',

      // 1. The Node must now be reachable and identifiable in the PDOM —
      //    DragListener never needed this, because it has no keyboard path to gate.
      tagName: 'div',
      focusable: true,
      accessibleName: 'Ball'
    } );

    this.addInputListener( new RichDragListener( {

      // Shared options move up to the top level unchanged.
      positionProperty: model.positionProperty,
      transform: model.modelViewTransform,
      dragBoundsProperty: model.dragBoundsProperty,

      // 2. start/end now fire for EITHER input type - this is a behavior change,
      //    not just a rename. If start/end need to distinguish pointer from
      //    keyboard, check event.isFromPDOM() inside the callback.
      start: () => model.userControlledProperty.set( true ),
      end: () => model.userControlledProperty.set( false ),

      // 3. Listener-specific options move into namespaced sub-options instead
      //    of sitting at the top level. allowTouchSnag only means anything for
      //    pointer input, so it goes under dragListenerOptions now.
      dragListenerOptions: {
        allowTouchSnag: true
      },
      keyboardDragListenerOptions: {
        dragSpeed: 150,
        shiftDragSpeed: 50
      },

      // 4. Pass the BARE tandem, not tandem.createTandem('dragListener').
      //    RichDragListener creates its own 'dragListener' and
      //    'keyboardDragListener' child tandems internally (see below) -
      //    the old manual suffix would now double up the path.
      tandem: tandem.createTandem( 'richDragListener' )
    } ) );
  }
}
```

## What actually changes, per source

| Aspect | `DragListener` | `RichDragListener` |
| --- | --- | --- |
| Input modality | Pointer only (`Mouse`/`Touch`/`Pen`) | Pointer **and** keyboard, via one internal `DragListener` + one internal `KeyboardDragListener` |
| Relationship to `TInputListener` | Implements the pointer-relevant callbacks directly, as a `PressListener` subtype | Implements `TInputListener` itself and *forwards* every callback to whichever internal listener owns it (`keydown`/`focusin`/`focusout`/`cancel` → keyboard listener; `down`/`up`/`click`/`move`/`pointerMove` → pointer listener) |
| Node requirements | None beyond a hit-testable shape | Node must additionally be in the PDOM (`tagName`, `focusable`, an `accessibleName`) or the keyboard half never receives focus |
| Shared options | `positionProperty`, `transform`, `dragBoundsProperty`, `mapPosition`, `translateNode`, `start`/`drag`/`end` | Same names, but now apply to **both** internal listeners at once |
| Listener-specific options | Set directly (`allowTouchSnag`, `useParentOffset`, …) | Moved into `dragListenerOptions` (pointer-only options) or `keyboardDragListenerOptions` (`dragSpeed`, `dragDelta`, `keyboardDragDirection`, …) |
| Mutual exclusion | N/A — only one modality exists | Starting a drag via one internal listener calls `interrupt()` on the other, so a drag is never simultaneously driven by both (handled internally, not something you write) |
| `isPressedProperty` | True while the pointer drag is active | `DerivedProperty.or(...)` of both internal listeners' `isPressedProperty` — true if *either* is active |
| `hotkeys` | Not applicable | Exposes `keyboardDragListener.hotkeys` at the top level, since `RichDragListener` participates in scenery's hotkey system |
| Tandem shape | One tandem, used as-is | Split internally into `tandem.createTandem('dragListener')` and `tandem.createTandem('keyboardDragListener')` — pass the parent tandem, don't pre-suffix it |
| Disposal | `dispose()` disposes the one listener | `dispose()` disposes `isPressedProperty` plus both internal listeners |

## Checking the migration worked

Two checks catch the mistakes this migration most commonly introduces:

1. **Tab to the object.** If `BallNode` isn't reachable by keyboard, the most likely cause is a missing `tagName`/`focusable` on the Node itself — `RichDragListener` supplies the *listener* half of keyboard support, not the PDOM half.
2. **Drag with arrow keys once focused.** If focus works but arrow keys do nothing, check that `keyboardDragListenerOptions` (or the shared `positionProperty`/`transform`) reached the internal `KeyboardDragListener` — a common copy/paste mistake is leaving keyboard-only options like `dragSpeed` at the top level, where `RichDragListener`'s options type doesn't recognize them.

::: warning Don't keep a manually-suffixed tandem from the old `DragListener` call
If the legacy code passed `tandem.createTandem( 'dragListener' )` to `DragListener`, migrating to `RichDragListener` and keeping that same suffixed tandem produces a `.../dragListener/dragListener` path once `RichDragListener` adds its own child tandem. Pass the parent tandem (e.g. `tandem.createTandem( 'richDragListener' )`) and let `RichDragListener` create its own children.
:::

## Where to go next

- [Drag Listeners](/patterns/drag-listeners) — the general pattern this migration example specializes, including the full options checklist
- [RichDragListener](/api/scenery/rich-drag-listener) — full options and members reference
- [KeyboardDragListener](/api/scenery/keyboard-drag-listener) — the internal listener that supplies the new keyboard behavior
- [Alternative Input Overview](/accessibility/alternative-input-overview) — why pointer and keyboard input share one dispatch system, which is what makes this composition possible
- [The Parallel DOM (PDOM)](/accessibility/pdom) — the `tagName`/`focusable`/`accessibleName` options this migration adds to the Node
