---
title: Keyboard Shortcuts on a Custom Node
description: Attaching a KeyboardListener to a focusable custom Node to add a hotkey beyond dragging.
category: cookbook
tags: [scenery, KeyboardListener, keyboard, accessibility, hotkey]
status: complete
related:
  - /api/scenery/keyboard-listener
  - /accessibility/keyboard-input-and-hotkeys
  - /accessibility/alternative-input-overview
prerequisites:
  - /api/scenery/keyboard-listener
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Keyboard Shortcuts on a Custom Node

**Task:** a custom `Node` you've built (a selectable item, a rotatable dial) needs a keyboard shortcut beyond simple activation or dragging — deleting the item with <kbd>Delete</kbd>, rotating it a fixed step with <kbd>[</kbd>/<kbd>]</kbd>, and so on.

[`KeyboardListener`](/api/scenery/keyboard-listener) (from `scenerystack/scenery`) is the general-purpose tool for this: declare the key combination(s) as strings, attach it via `addInputListener`, and the Node must be focusable (`tagName`/`focusable`) so it participates in the [Parallel DOM](/accessibility/pdom) at all — the listener only fires while its target (or a descendant) has focus.

## The solution

```ts
import { Node, Path, KeyboardListener } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';
import { NumberProperty } from 'scenerystack/axon';

class RotatableDial extends Node {

  public readonly angleProperty = new NumberProperty( 0 ); // radians

  public constructor() {
    super( {
      tagName: 'div',
      focusable: true,
      accessibleName: 'Dial'
    } );

    const dialShape = new Path( Shape.circle( 0, 0, 30 ), {
      fill: 'lightGray',
      stroke: 'black'
    } );
    const pointer = new Path( Shape.lineSegment( 0, 0, 0, -28 ), { stroke: 'crimson', lineWidth: 3 } );
    this.children = [ dialShape, pointer ];

    this.angleProperty.link( angle => {
      pointer.rotation = angle;
    } );

    const ROTATE_STEP = Math.PI / 12; // 15 degrees

    this.addInputListener( new KeyboardListener( {
      keys: [ '[', ']' ],
      fire: ( event, keysPressed ) => {
        const direction = keysPressed === ']' ? 1 : -1;
        this.angleProperty.value += direction * ROTATE_STEP;
      },
      fireOnHold: true // holding the key keeps rotating, not just one step per press
    } ) );
  }
}
```

Pressing <kbd>[</kbd>/<kbd>]</kbd> while `RotatableDial` (or a descendant) has focus rotates `angleProperty` by a fixed step each time; `fireOnHold: true` lets holding the key repeat the rotation instead of requiring separate presses.

## A delete/remove shortcut

The same pattern covers a "remove this selected item" shortcut, listening for either of two keys with one `KeyboardListener`:

```ts
selectedItemNode.addInputListener( new KeyboardListener( {
  keys: [ 'delete', 'backspace' ],
  fire: () => {
    model.removeItem( item );
  }
} ) );
```

## Handling a modifier variant of the same key

If the same key should do something different when a modifier is held (a larger step with <kbd>Shift</kbd>+<kbd>]</kbd>), list both combinations and branch on `keysPressed`:

```ts
this.addInputListener( new KeyboardListener( {
  keys: [ ']', 'shift+]' ],
  fire: ( event, keysPressed ) => {
    const step = keysPressed === 'shift+]' ? ROTATE_STEP * 4 : ROTATE_STEP;
    this.angleProperty.value += step;
  }
} ) );
```

## Options used here

| Option | Effect |
| --- | --- |
| `keys` | Array of key combination strings this listener responds to |
| `fire` | `( event, keysPressed, listener ) => void`, called when a combination fires; `keysPressed` says which one |
| `fireOnHold` | Whether holding the combination repeats `fire` (default `false`) |

::: tip Document the shortcut, don't rely on discovery
A hotkey with no visible affordance is easy for a keyboard user to never find. Real sims register their custom shortcuts with the sim-wide keyboard-help dialog content (built from the same `HotkeyData`/`KeyboardListener` machinery) so they show up in the help dialog every screen already provides — see [Keyboard Input and Hotkeys](/accessibility/keyboard-input-and-hotkeys) for the lower-level `Hotkey`/`HotkeyData` building blocks this integrates with.
:::

::: warning A hotkey with no matching pointer/PDOM-visible affordance is only half the interaction
Adding `[`/`]` rotation via `KeyboardListener` doesn't by itself give a mouse/touch user any way to rotate the dial — make sure an equivalent pointer interaction exists too (e.g. a `DragListener` on the dial itself), the same "every interaction needs both an input modality and its accessible equivalent" principle covered in [Alternative Input Overview](/accessibility/alternative-input-overview).
:::
