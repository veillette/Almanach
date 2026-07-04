---
title: KeyboardListener
description: A declarative hotkey listener that fires a callback when a specific combination of keys is pressed.
category: api
library: scenery
tags: [scenery, KeyboardListener, input, keyboard, accessibility, hotkey]
status: complete
related:
  - /api/scenery/node
  - /api/scenery/keyboard-drag-listener
  - /api/scenery/fire-listener
  - /guides/scenery-input
prerequisites:
  - /api/scenery/node
  - /guides/scenery-input
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# KeyboardListener

`KeyboardListener` (from `scenerystack/scenery`) declares one or more key combinations ("hotkeys") as strings and fires a callback when they're pressed, without you having to track `keydown`/`keyup` state by hand. It's the keyboard counterpart to [`FireListener`](/api/scenery/fire-listener): attach it via [`inputListeners`](/api/scenery/node) on a focusable `Node`, and it fires while that Node has focus (or, via `KeyboardListener.createGlobal`, anywhere in the document regardless of focus).

```ts
import { Node, KeyboardListener } from 'scenerystack/scenery';

const panel = new Node( { tagName: 'div', focusable: true } );

panel.addInputListener( new KeyboardListener( {
  keys: [ 'escape', 'shift+t' ],
  fire: ( event, keysPressed, listener ) => {
    if ( keysPressed === 'escape' ) {
      console.log( 'closed' );
    }
    else if ( keysPressed === 'shift+t' ) {
      console.log( 'shift+t pressed' );
    }
  }
} ) );
```

Each entry in `keys` is a combination like `'alt+shift+r'` — keys before the last one are modifiers, and modifier order doesn't matter. A `'?'` marks a modifier as ignorable: `'shift?+y'` fires on `y` whether or not shift is held.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `keys` | `null` | Array of key combination strings, e.g. `[ 'a+b', 'shift+arrowLeft' ]`; mutually exclusive with `keyStringProperties` |
| `keyStringProperties` | `null` | Array of `TReadOnlyProperty<OneKeyStroke>` instead of static strings — for hotkeys that change with i18n or remapping |
| `fire` | no-op | `( event, keysPressed, listener ) => void`, called when the combination fires |
| `press` | no-op | Called on the initial press of a combination, before fire-on-hold repetition |
| `release` | no-op | Called on release (or `null` `keysPressed` on interruption) |
| `focus` / `blur` | no-op | Called when the listener's target Node gains/loses focus |
| `fireOnDown` | `true` | Fire when the combination is pressed; set `false` to fire on release instead |
| `fireOnHold` | `false` | Whether holding the combination repeats `fire` |
| `fireOnHoldTiming` | `'browser'` | `'browser'` (use the OS/browser's own key-repeat timing) or `'custom'` (use the two delay/interval options below) |
| `fireOnHoldCustomDelay` | `400` | Milliseconds held before repeat starts, when `fireOnHoldTiming: 'custom'` |
| `fireOnHoldCustomInterval` | `100` | Milliseconds between repeats, when `fireOnHoldTiming: 'custom'` |
| `overlapBehavior` | `'handle'` | How this listener behaves when another active `KeyboardListener` shares overlapping keys |

## Public state and methods

| Member | Meaning |
| --- | --- |
| `hotkeys` | The underlying `Hotkey[]` this listener created from `keys`/`keyStringProperties` |
| `isPressedProperty` | `true` while any of the listener's hotkeys is active |
| `interrupted` | Whether the most recent release was due to an interruption |
| `interrupt()` | Cancels any in-progress press without firing `release` normally |
| `dispose()` | Disposes every underlying `Hotkey` and this listener's Properties |
| `KeyboardListener.createGlobal( target, options )` | Static factory for a listener registered in the global hotkey registry — fires regardless of document focus, as long as `target` can receive input (visible, enabled, input-enabled) |

::: warning Modifier keys must be listed explicitly, or they suppress firing
The `fire` callback only runs when *exactly* the keys in a combination are down. Listing `'tab'` alone means it will **not** fire while shift is also held — you must add `'shift+tab'` as a separate entry in `keys` to handle that case too, or mark the modifier as ignorable with `'shift?+tab'`. This also applies to `KeyboardDragListener`'s underlying arrow/WASD keys, which is why the drag keys are declared with `?` internally.
:::
