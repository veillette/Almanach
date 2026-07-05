---
title: AccessibleNumberSpinner
description: The trait/mixin that gives NumberSpinner its keyboard and PDOM behavior, with press-and-hold repeat.
category: api
library: sun
tags: [sun, AccessibleNumberSpinner, NumberSpinner, PDOM]
status: complete
related:
  - /api/sun/number-spinner
  - /api/sun/accessible-slider
  - /api/scenery/parallel-dom-deep-dive
prerequisites:
  - /api/sun/number-spinner
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# AccessibleNumberSpinner

`AccessibleNumberSpinner` (from `scenerystack/sun`) is a trait — like [`AccessibleSlider`](/api/sun/accessible-slider), a function from a `Node` subclass to a new class with behavior mixed in, not a `Node` you instantiate directly. [`NumberSpinner`](/api/sun/number-spinner) is defined as `class NumberSpinner extends AccessibleNumberSpinner( Node, 0 )`; reach for it yourself only when building a custom spinner-like component that needs the same keyboard repeat-on-hold behavior `NumberSpinner` gets for free.

```ts
import { AccessibleNumberSpinner } from 'scenerystack/sun';
import { Node } from 'scenerystack/scenery';
import { NumberProperty, Property } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';

class MyCustomSpinnerNode extends AccessibleNumberSpinner( Node, 0 ) {
  public constructor( valueProperty: NumberProperty, rangeProperty: Property<Range> ) {
    super( {
      valueProperty: valueProperty,
      enabledRangeProperty: rangeProperty,
      keyboardStep: 1,
      pageKeyboardStep: 5
    } );
    // ...add your own increment/decrement visuals here
  }
}
```

`AccessibleNumberSpinner( Type, optionsArgPosition )` shares its `optionsArgPosition` convention with `AccessibleSlider`. It mixes in the same underlying `AccessibleValueHandler` as `AccessibleSlider` (so `keyboardStep`/`shiftKeyboardStep`/`pageKeyboardStep`/`enabledRangeProperty` all mean the same thing there — see [`AccessibleSlider`](/api/sun/accessible-slider)), but layers spinner-specific behavior on top: a `CallbackTimer`-driven press-and-hold repeat (arrow keys fire once immediately, then repeat), and defaults tuned for a spinner rather than a slider — `ariaOrientation: Orientation.VERTICAL` and an `accessibleRoleDescription` announcing it as a "number spinner" (PhET's own custom ARIA role description, since native `input[type=range]` semantics don't quite fit; spinners use `role="range"` under the hood rather than number-input semantics, deliberately excluding numeric-key entry).

## Behavior it adds beyond AccessibleValueHandler

| Interaction | Effect |
| --- | --- |
| Arrow keys, single press | Change the value once by `keyboardStep` (or `shiftKeyboardStep` with Shift held) |
| Arrow keys, held down | After `pdomTimerDelay`, repeats the change every `pdomTimerInterval` until released |
| Page Up / Page Down, Home / End | Same as `AccessibleSlider` — larger step / jump to range extremes |

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `pdomTimerDelay` | `400` (ms) | Delay before a held key starts auto-repeating |
| `pdomTimerInterval` | `100` (ms) | Interval between repeats once auto-repeat has started |
| `accessibleRoleDescription` | `'number spinner'` string (translated) | Overridable ARIA role description announced to screen readers |

## Members worth knowing

| Member | Meaning |
| --- | --- |
| `pdomIncrementDownEmitter` / `pdomDecrementDownEmitter` | `TEmitter<[boolean]>`s that fire on keyboard-driven increment/decrement key-down and key-up — `NumberSpinner` uses these to style its arrow buttons as "pressed" during keyboard interaction, matching the visual feedback of a mouse press |

::: tip You're almost always consuming this indirectly
As with `AccessibleSlider`, simulation code essentially never invokes this trait directly — it's documented so [`NumberSpinner`](/api/sun/number-spinner)'s keyboard-step-family options and press-and-hold behavior have a page explaining exactly where they come from.
:::
