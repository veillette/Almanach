---
title: Keyboard Help Node Basics
description: KeyNode and its subclasses render individual keycap icons; KeyboardHelpIconFactory composes them into the rows used by a Keyboard Help Dialog.
category: api
library: scenery-phet
tags: [scenery-phet, KeyNode, LetterKeyNode, NumberKeyNode, TextKeyNode, ArrowKeyNode, KeyboardHelpIconFactory, keyboard, accessibility]
status: complete
related:
  - /api/scenery-phet/keyboard-help-sections
  - /accessibility/keyboard-input-and-hotkeys
  - /accessibility/pdom
prerequisites:
  - /accessibility/keyboard-input-and-hotkeys
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Keyboard Help Node Basics

A Keyboard Help Dialog tells the user which keys do what, and it does that visually with little keycap-shaped icons — a rounded rectangle with a drop shadow, containing a letter, a symbol, or an arrow glyph. `KeyNode` (from `scenerystack/scenery-phet`) draws that keycap shape around any icon `Node`; `LetterKeyNode`, `NumberKeyNode`, `TextKeyNode`, and `ArrowKeyNode` are `KeyNode` subclasses pre-configured for the most common contents. `KeyboardHelpIconFactory` then composes multiple key icons into rows (`A` **+** `D`, `↑` **or** `↓`, and so on) for use as [`KeyboardHelpSection`](/api/scenery-phet/keyboard-help-sections) rows. None of this renders live keyboard state — these are static icons describing what a key *looks like*, not indicators of whether it's currently pressed.

```ts
import { KeyboardHelpIconFactory, LetterKeyNode, TextKeyNode, ArrowKeyNode } from 'scenerystack/scenery-phet';

// A single "W" keycap.
const wKey = LetterKeyNode.w();

// "Shift" and "Tab" keycaps combined with a plus icon: "Shift + Tab".
const shiftTabRow = KeyboardHelpIconFactory.shiftPlusIcon( TextKeyNode.tab() );

// The four arrow keys in a row: "← ↑ ↓ →".
const arrowRow = KeyboardHelpIconFactory.arrowKeysRowIcon();
```

## KeyNode: the shared keycap shape

`KeyNode` wraps an arbitrary icon `Node` in a background rectangle plus an offset shadow rectangle, giving it a slight 3D "physical key" look. Every key has the same height by default (`keyHeight`); width grows to fit the icon and padding, or the icon scales down if it would overflow `minKeyWidth`/`forceSquareKey`.

```ts
import { KeyNode } from 'scenerystack/scenery-phet';
import { Text } from 'scenerystack/scenery';

const customKey = new KeyNode( new Text( '?' ), {
  keyFill: 'white',
  cornerRadius: 2
} );
```

| Option | Default | Effect |
| --- | --- | --- |
| `keyFill` / `keyShadowFill` | `'white'` / `'black'` | Fill of the foreground key and its drop shadow |
| `keyHeight` | `23` | Height every key shares by default, in ScreenView coordinates |
| `minKeyWidth` | `23` (same as `keyHeight`) | Minimum width; the icon can force it wider |
| `forceSquareKey` | `false` | If `true`, width is forced to equal `keyHeight`, scaling the icon down if needed |
| `xPadding` / `yPadding` | `4` / `4` | Space around the icon before it forces the key to grow |
| `xShadowOffset` / `yShadowOffset` | `1.7` / `1.7` | Offset of the shadow rectangle, producing the 3D look |

## The KeyNode subclasses

Each subclass fixes sensible defaults and adds static factory methods for the specific glyphs a Keyboard Help Dialog needs over and over, so you rarely construct them with `new` directly.

| Class | Wraps | Static factories (examples) |
| --- | --- | --- |
| `TextKeyNode` | A `RichText` label, for multi-character keys | `TextKeyNode.space()`, `.enter()`, `.esc()`, `.tab()`, `.shift()`, `.altOrOption()` (renders "Alt" or "Option" per platform), `.pageUp()`, `.pageDown()`, `.home()`, `.end()`, `.backspace()`, `.delete()` |
| `LetterKeyNode` | A single letter/digit, forced square | `LetterKeyNode.w()`, `.a()`, `.s()`, `.d()`, `.r()`, … (also `.one()`, `.two()`, `.three()` for digit-as-letter contexts) |
| `NumberKeyNode` | A single non-negative integer, via `LetterKeyNode` | `new NumberKeyNode( 9 )` |
| `ArrowKeyNode` | A rounded-triangle arrow glyph, forced square | `new ArrowKeyNode( 'up' \| 'down' \| 'left' \| 'right' )` |

```ts
import { NumberKeyNode, ArrowKeyNode, TextKeyNode } from 'scenerystack/scenery-phet';

const nineKey = new NumberKeyNode( 9 );
const upArrowKey = new ArrowKeyNode( 'up' );
const escKey = TextKeyNode.esc();
```

## KeyboardHelpIconFactory: composing keys into rows

`KeyboardHelpIconFactory` has only static methods (it asserts if you try to construct it) for laying out multiple key icons horizontally, the way a help row usually needs: a plain row, two icons joined by "or"/"-", or icons joined by a `+` (via `PlusNode`) to represent a chorded shortcut.

| Method | Produces |
| --- | --- |
| `iconRow( icons )` | Icons side by side, left to right |
| `iconOrIcon( left, right )` | `left` **or** `right`, separated by localized "or" text |
| `iconToIcon( left, right )` | `left` **-** `right`, separated by a hyphen (e.g. a `0`-`9` range) |
| `iconPlusIcon( left, right )` / `iconPlusIconRow( icons )` | Icons joined by `+` (`PlusNode`), for chorded shortcuts like Shift+Tab |
| `shiftPlusIcon( icon )` / `altPlusIcon( icon )` | Shortcut for `iconPlusIcon( TextKeyNode.shift(), icon )` / with Alt |
| `spaceOrEnter()` | The common "Space or Enter" row used for activating buttons |
| `wasdRowIcon()` / `arrowKeysRowIcon()` / `arrowOrWasdKeysRowIcon()` | The W/A/S/D keys, the four arrow keys, or both joined by "or" |
| `upOrDown()` / `upDownArrowKeysRowIcon()` / `leftRightArrowKeysRowIcon()` | Common two-key subsets of the arrow keys |
| `pageUpPageDownRowIcon()` | Page Up / Page Down pair |
| `fromHotkeyData( hotkeyData )` | Builds the icon row directly from a `HotkeyData`'s key descriptors (see below) |

::: tip Prefer `fromHotkeyData` when a component already defines its own hotkeys
Components like `ResetAllButton` and `PlayControlButton` expose their shortcuts as static `HotkeyData` (e.g. `ResetAllButton.RESET_ALL_HOTKEY_DATA`). `KeyboardHelpIconFactory.fromHotkeyData` (used internally by `KeyboardHelpSectionRow.fromHotkeyData`, see [Keyboard Help Sections](/api/scenery-phet/keyboard-help-sections)) reads that data and builds the matching icon row automatically, so the help dialog can't drift out of sync with the actual keys the component listens for.
:::

## Not the same "Key"/"KeyID" as the numeric keypad

`scenerystack/scenery-phet` also exports a `Key` class and a `KeyID` enum, and their names invite confusion with this page. In the real source, both live under `scenery-phet/js/keypad/` and describe the buttons of the **numeric `Keypad` component** (digits, backspace, decimal point, ±, x², …) — they are unrelated to keyboard-help icons and are not used anywhere in `KeyboardHelpSection`/`KeyboardHelpIconFactory`. If you're building a Keyboard Help Dialog, `KeyNode` and its subclasses above are the types you want; `Key`/`KeyID` only matter if you're customizing the on-screen `Keypad`.
