---
title: Keyboard Input and Hotkeys
description: KeyboardListener and Hotkey for custom keyboard shortcuts beyond dragging.
category: accessibility
tags: [scenery, KeyboardListener, keyboard]
status: verified
related:
  - /accessibility/pdom
  - /accessibility/alternative-input-overview
  - /accessibility/focus-highlights
prerequisites:
  - /accessibility/pdom
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Keyboard Input and Hotkeys

`KeyboardDragListener` covers keyboard-driven dragging (see [The Parallel DOM](/accessibility/pdom)), but many interactions need arbitrary keyboard shortcuts that aren't a drag — deleting a selected item, opening a menu, stepping a simulation forward one frame. `KeyboardListener` (from `scenerystack/scenery`) is the general-purpose tool for that, built on top of the lower-level `Hotkey` class.

## A focus-scoped shortcut

Attach a `KeyboardListener` with `addInputListener` and it only fires while the target Node (or a descendant) has focus — the normal scenery input-dispatch behavior:

```ts
import { Node, KeyboardListener } from 'scenerystack/scenery';

const deletableItem = new Node( {
  tagName: 'div',
  focusable: true,
  accessibleName: 'Selected item'
} );

deletableItem.addInputListener( new KeyboardListener( {
  keys: [ 'delete', 'backspace' ],
  fire: ( event, keysPressed ) => {
    model.deleteSelectedItem();
  }
} ) );
```

Each entry in `keys` is a combination like `'shift+t'` or `'alt+shift+r'` — `+` separates the keys that must be held together, and the last key in the combination is the one that must be freshly pressed. `fire` receives which combination fired as `keysPressed`, so one listener can handle several related shortcuts:

```ts
new KeyboardListener( {
  keys: [ 'arrowRight', 'shift+arrowRight' ],
  fire: ( event, keysPressed ) => {
    const step = keysPressed === 'shift+arrowRight' ? 10 : 1;
    model.advance( step );
  }
} );
```

## Global shortcuts

A shortcut that should work regardless of where focus currently is (a "step simulation" key, a global help overlay) uses `KeyboardListener.createGlobal` instead of `addInputListener`. It registers `Hotkey`s on the shared `globalHotkeyRegistry` and must be disposed when no longer needed:

```ts
import { KeyboardListener } from 'scenerystack/scenery';

const globalStepListener = KeyboardListener.createGlobal( screenView, {
  keys: [ 'k' ],
  fire: () => model.stepOnce( 0.1 )
} );

// later, e.g. in the ScreenView's dispose:
globalStepListener.dispose();
```

## Options

| Option | Effect |
| --- | --- |
| `keys` | Array of key combinations (`'a+b'`, `'shift+arrowLeft'`, …) that fire the callback |
| `fire` | `( event, keysPressed, listener ) => void`, called when the combination fires |
| `press` / `release` | Called on initial press / on release, independent of fire-on-hold behavior |
| `fireOnDown` | `true` (default) fires on initial press; `false` fires on release instead |
| `fireOnHold` | Enables press-and-hold repeated firing |
| `fireOnHoldTiming` | `'browser'` (default, relies on native key-repeat) or `'custom'` (uses `fireOnHoldCustomDelay`/`fireOnHoldCustomInterval`) |
| `overlapBehavior` | How this listener behaves when another active listener shares keys: `'handle'` (default — closest listener wins), `'allow'`, or `'prevent'` (asserts on overlap) |

## Ignoring modifier keys

By default, an active modifier key (like `shift`) blocks other combinations that don't include it from firing — pressing `shift` alone can prevent a plain `'y'` listener from firing. Use `?` to opt a modifier out of that blocking behavior:

```ts
new KeyboardListener( {
  keys: [ 'shift?+y' ],   // fires on 'y' whether or not shift happens to be down
  fire: () => model.toggle()
} );
```

## Hotkey: the lower-level building block

`KeyboardListener` constructs `Hotkey` instances internally; reach for `Hotkey` directly (from `scenerystack/scenery`) only when you need a single dynamic key combination described by a `Property`, or need to add it straight to a Node's `inputListeners`/the `globalHotkeyRegistry` without the rest of `KeyboardListener`'s machinery:

```ts
import { Hotkey, globalHotkeyRegistry } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';

const helpHotkey = new Hotkey( {
  keyStringProperty: new Property( 'shift+h' ),
  fire: () => model.showHelp()
} );

globalHotkeyRegistry.add( helpHotkey );
// ...later
globalHotkeyRegistry.remove( helpHotkey );
```

::: tip Test every combination on a real keyboard layout
Some key combinations can't be physically pressed together on certain keyboards ("key ghosting" — commonly affects simultaneous arrow keys). Always verify custom hotkeys on more than one keyboard before shipping, and prefer combinations that don't stack many simultaneous non-modifier keys.
:::
