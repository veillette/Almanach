---
title: Hotkey, HotkeyData, and globalHotkeyRegistry
description: The declarative building blocks underneath KeyboardListener for defining keyboard shortcuts.
category: api
library: scenery
tags: [scenery, Hotkey, HotkeyData, globalHotkeyRegistry, input, keyboard, accessibility]
status: complete
related:
  - /api/scenery/keyboard-listener
  - /api/scenery/keyboard-drag-listener
  - /api/scenery/node
prerequisites:
  - /api/scenery/keyboard-listener
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Hotkey, HotkeyData, and globalHotkeyRegistry

`Hotkey` (from `scenerystack/scenery`) is the low-level object that represents a single keyboard shortcut — one main key plus optional modifier keys, with press/release/fire callbacks. [`KeyboardListener`](/api/scenery/keyboard-listener) is built on top of `Hotkey` (its `keys` option internally creates one `Hotkey` per entry, exposed via `keyboardListener.hotkeys`), and most application code should reach for `KeyboardListener` first. Use `Hotkey` directly when you need a shortcut that lives *outside* the usual "attach to a focusable Node" model — either globally regardless of focus (via `globalHotkeyRegistry`), or as a light-weight `TInputListener` entry without the rest of `KeyboardListener`'s API.

```ts
import { Hotkey, globalHotkeyRegistry } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';

// Available anywhere in the document, regardless of what has focus.
globalHotkeyRegistry.add( new Hotkey( {
  keyStringProperty: new Property( 'alt+shift+d' ),
  fire: () => console.log( 'debug overlay toggled' )
} ) );

// Or, scoped to a Node's own focus, added directly as an inputListeners entry:
someNode.addInputListener( {
  hotkeys: [
    new Hotkey( {
      keyStringProperty: new Property( 'escape' ),
      fire: () => console.log( 'closed' )
    } )
  ]
} );
```

## `Hotkey` options

| Option | Default | Effect |
| --- | --- | --- |
| `keyStringProperty` | *(required)* | A `TReadOnlyProperty<OneKeyStroke>` describing the key + modifiers, e.g. `'shift+tab'` — a Property (not a plain string) so hotkeys can support i18n/remapping later |
| `fire` | no-op | `( event: KeyboardEvent \| null ) => void` — the event is `null` when fired via fire-on-hold repetition |
| `press` / `release` | no-op | Called on press/release; `press` is not called for fire-on-hold repeats |
| `fireOnDown` | `true` | Fire when the combination is first pressed; `false` fires on release instead |
| `fireOnHold` | `false` | Whether holding the combination repeats `fire` |
| `fireOnHoldTiming` | `'browser'` | `'browser'` uses the OS/browser's own key-repeat timing; `'custom'` uses the two options below |
| `fireOnHoldCustomDelay` / `fireOnHoldCustomInterval` | `400` / `100` | Timing in ms when `fireOnHoldTiming: 'custom'` |
| `overlapBehavior` | `'handle'` | How this hotkey behaves when another active hotkey shares one of its keys — see below |

`isPressedProperty` reports whether the hotkey is currently active, `interrupted` records whether the most recent release was due to an interruption rather than a key-up, and `interrupt()` cancels an in-progress press.

### `overlapBehavior`

| Value | Meaning |
| --- | --- |
| `'handle'` | Default for node-scoped hotkeys — if two active hotkeys share keys, only the one closest to the focused Node in the scene graph fires |
| `'prevent'` | Default for `globalHotkeyRegistry` entries — overlapping global hotkeys are treated as a programming error and assert |
| `'allow'` | Both overlapping hotkeys fire; takes precedence over `'prevent'` if the two disagree |

## `HotkeyData`

`HotkeyData` bundles a set of keystrokes with the documentation metadata scenery needs for the keyboard-help dialog and PhET's internal "binder" documentation generator — it doesn't itself listen for anything. It's the shape [`KeyboardDragListener`](/api/scenery/keyboard-drag-listener) and other built-in listeners use internally to describe *which* keys they respond to, separately from the listener that acts on them.

| Member | Meaning |
| --- | --- |
| `keys` (constructor option) | `Array<OneKeyStroke \| TReadOnlyProperty<OneKeyStroke>>` — the keystrokes this data describes |
| `keyStringProperties` | Normalized array of `TReadOnlyProperty<OneKeyStroke>`, one per key in `keys` |
| `hasKeyStroke( keyStroke )` | Whether any of this data's keys match the given stroke |
| `HotkeyData.combineKeyStringProperties( array )` | Static — flattens several `HotkeyData`'s key Properties into one array, handy for feeding a single `KeyboardListener` |
| `HotkeyData.anyHaveKeyStroke( array, keyStroke )` | Static — checks a keystroke against a whole array of `HotkeyData` at once |

## `globalHotkeyRegistry`

A module-level singleton (not a class you construct) with one member: `hotkeysProperty`, a `TProperty<Set<Hotkey>>` of every currently-registered global hotkey. Call `globalHotkeyRegistry.add( hotkey )` / `.remove( hotkey )` to make a `Hotkey` active regardless of what has document focus — this is what `KeyboardListener.createGlobal()` uses internally.

::: warning Modifier keys must be listed explicitly, exactly as with KeyboardListener
`Hotkey` (and therefore `KeyboardListener`) only fires when *exactly* the described keys are down. A hotkey for `'tab'` will not fire while shift is also held — add `'shift+tab'` as a second `Hotkey`, or mark the modifier ignorable in the key string with `'shift?+tab'`, exactly as documented on [`KeyboardListener`](/api/scenery/keyboard-listener).
:::
