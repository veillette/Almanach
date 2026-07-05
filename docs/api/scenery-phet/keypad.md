---
title: Keypad
description: A calculator-like on-screen numeric keypad, driven by a pluggable key-accumulator that interprets key presses into a value.
category: api
library: scenery-phet
tags: [scenery-phet, Keypad, NumberAccumulator, AbstractKeyAccumulator, BidirectionalControlChars, input]
status: complete
related:
  - /accessibility/keyboard-input-and-hotkeys
  - /api/tandem/tandem
  - /api/axon/derived-string-property
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Keypad

`Keypad` (from `scenerystack/scenery-phet`) renders a grid of number-pad-style buttons — digits, a decimal point, backspace, plus/minus — and delegates the job of interpreting a sequence of key presses into a value to a separate **accumulator** object. This split exists so the same button grid can back different numeric formats (plain positive integers, signed decimals, …) just by swapping the accumulator, without touching the layout or rendering code.

```ts
import { Keypad, NumberAccumulator } from 'scenerystack/scenery-phet';
import { Tandem } from 'scenerystack/tandem';
```

## A minimal example

```ts
const keypad = new Keypad( Keypad.PositiveAndNegativeFloatingPointLayout, {
  accumulatorOptions: {
    maxDigits: 4,
    maxDigitsRightOfMantissa: 2
  },
  tandem: Tandem.REQUIRED.createTandem( 'keypad' )
} );

// Read the accumulated value reactively:
keypad.valueProperty.link( value => {
  console.log( 'current keypad value:', value ); // number | null
} );

// Programmatically clear it, e.g. after the value is "submitted":
keypad.clear();
```

## The layout / accumulator split

A `Keypad` is built from two independent pieces:

1. **Layout** — a 2D array of `Key | null` (a `KeypadLayout`) passed as the constructor's first argument, describing which keys appear where, including multi-cell spans for wide/tall keys (like the `0` key spanning two columns in `PositiveIntegerLayout`).
2. **Accumulator** — an `AbstractKeyAccumulator` subclass (by default, a `NumberAccumulator` `Keypad` creates for you) that receives every key press via `handleKeyPressed()` and decides whether the resulting sequence is valid and how to turn it into a displayable string and a number.

You rarely need to build a custom `KeypadLayout` — `Keypad` ships several ready-made static layouts:

| Static layout | Keys |
| --- | --- |
| `Keypad.PositiveIntegerLayout` | `0`–`9`, wide `0`, backspace — no decimal, no sign |
| `Keypad.PositiveDecimalLayout` / `PositiveFloatingPointLayout` | `0`–`9`, decimal point, backspace |
| `Keypad.PositiveAndNegativeIntegerLayout` | `0`–`9`, backspace, plus/minus toggle |
| `Keypad.PositiveAndNegativeFloatingPointLayout` | `0`–`9`, wide `0`, decimal point, plus/minus toggle, backspace |

Individual keys are also exposed as statics (`Keypad.KEY_0`...`KEY_9`, `KEY_DECIMAL`, `KEY_BACKSPACE`, `KEY_PLUS_MINUS`, `KEY_WIDE_ZERO`) if you want to assemble your own `KeypadLayout` from the same building blocks.

## Constructor

```ts
new Keypad( layout: ( Key | null )[][], providedOptions?: KeypadOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `buttonWidth` / `buttonHeight` | `35` / `35` | Size of a single-span key |
| `xSpacing` / `ySpacing` | `10` / `10` | Gaps between buttons |
| `touchAreaXDilation` / `touchAreaYDilation` | `5` / `5` | Touch-area dilation on every button |
| `buttonColor` | `'white'` | Base color of every key button |
| `buttonFont` | `new PhetFont({ size: 20 })` | Font for text-labeled keys |
| `accumulator` | `null` | Supply your own `AbstractKeyAccumulator` instance; if provided, `Keypad` disposes it along with itself |
| `accumulatorOptions` | `null` | Options forwarded to the default `NumberAccumulator` — ignored if `accumulator` is provided |
| `useGlobalKeyboardListener` | `false` | If `true`, keyboard input drives this `Keypad` regardless of DOM focus (only one such global `Keypad` may exist at a time — asserted) |

## Public API

| Member | Description |
| --- | --- |
| `accumulatedKeysProperty` | `ReadOnlyProperty<KeyIDValue[]>` — the raw sequence of accumulated key IDs |
| `stringProperty` | `ReadOnlyProperty<string>` — the string representation shown to the user (e.g. `"-12.5"`) |
| `valueProperty` | `ReadOnlyProperty<number \| null>` — the numeric value, or `null` if nothing meaningful has been entered yet |
| `clear()` | Clears the accumulator |
| `setClearOnNextKeyPress( clearOnNextKeyPress: boolean )` / `getClearOnNextKeyPress()` | Controls whether the *next* non-backspace key press wipes the existing value first — useful for "start typing a fresh number after submitting" UX |

Every digit and control key also responds to physical keyboard input (via a Scenery `KeyboardListener` built from each `Key`'s `keyboardIDs`) whenever the `Keypad` has focus, or globally if `useGlobalKeyboardListener: true`. See [Keyboard Input and Hotkeys](/accessibility/keyboard-input-and-hotkeys) for how `KeyboardListener` fits into PhET's broader input model.

## NumberAccumulator

`NumberAccumulator extends AbstractKeyAccumulator` and is the default accumulator `Keypad` creates when you don't supply your own. It interprets a sequence of digit/decimal/plus-minus/backspace key IDs as a single signed decimal number, enforcing digit-count limits.

```ts
new NumberAccumulator( providedOptions?: NumberAccumulatorOptions )
```

| Option | Default | Effect |
| --- | --- | --- |
| `maxDigitsRightOfMantissa` | `0` | Maximum digits allowed after the decimal point (`0` effectively disallows a fractional part) |
| `maxDigits` | `Number.MAX_SAFE_INTEGER`'s digit count | Maximum total digits allowed (left + right of the decimal point) |

It exposes the same `stringProperty` / `valueProperty` pair that `Keypad` re-exposes at the top level, and automatically strips a leading zero once a second digit is typed (so `0` → `5` becomes `5`, not `05`).

## AbstractKeyAccumulator

`AbstractKeyAccumulator` is the base class `NumberAccumulator` extends, and the type you implement against if you need a keypad that produces something other than a plain signed decimal (a custom expression, a unit-tagged value, etc.). It owns the shared bookkeeping:

| Member | Description |
| --- | --- |
| `accumulatedKeysProperty` | `Property<KeyIDValue[]>` — the array of key IDs pressed so far; this is the one piece of state every subclass builds on |
| `handleKeyPressed( keyID: KeyIDValue )` | *(abstract)* — subclasses must implement how a new key mutates the accumulated sequence |
| `stringProperty` / `valueProperty` | *(abstract)* — subclasses must supply these as derived views over `accumulatedKeysProperty` |
| `clearOnNextKeyPress` (getter/setter) | Same "clear on next key" behavior `Keypad.setClearOnNextKeyPress()` delegates to |
| `handleClearOnNextKeyPress( keyID )` *(protected)* | Helper subclasses call at the top of `handleKeyPressed()` to honor the clear-on-next-press flag uniformly |
| `validateKeys( proposedKeys )` / `updateKeys( proposedKeys )` *(protected)* | Runs the constructor-supplied validator functions against a proposed new sequence, and commits it if valid |

::: tip Build a validator list, don't override validation logic directly
`AbstractKeyAccumulator`'s constructor takes an array of `( keys: KeyIDValue[] ) => boolean` validator functions (see how `NumberAccumulator` passes a single digit-count validator). Compose your custom accumulator's rules as validator functions rather than fighting the base class's `validateKeys()` — it already runs every validator and ANDs the results together.
:::

## BidirectionalControlChars

`BidirectionalControlChars` is a small, unrelated utility that happens to live in `scenerystack/scenery-phet` alongside the keypad classes (its actual source file is `scenery-phet/js/BidirectionalControlChars.ts`, not the `keypad/` subfolder). It's a frozen object of Unicode bidirectional-control characters, for consistently isolating left-to-right or right-to-left text fragments inside a larger internationalized string:

```ts
import { BidirectionalControlChars } from 'scenerystack/scenery-phet';

const isolatedNumber = `${BidirectionalControlChars.LRI}${value}${BidirectionalControlChars.PDI}`;
```

| Key | Character | Purpose |
| --- | --- | --- |
| `LRI` | U+2066 | Start a left-to-right isolated run |
| `RLI` | U+2067 | Start a right-to-left isolated run |
| `PDI` | U+2069 | End an isolated run started by `LRI`/`RLI` |
| `LRE` / `RLE` / `PDF` | U+202A / U+202B / U+202C | Older embedding-style equivalents, kept for compatibility with existing code; prefer the isolate (`*I`) characters above in new code |

It has no relationship to `Keypad`'s accumulator pattern — it's included here purely for reference completeness.
