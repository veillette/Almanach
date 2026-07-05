---
title: AccessibleSlider
description: The trait/mixin that gives Slider (and HSlider/VSlider) its keyboard and PDOM behavior.
category: api
library: sun
tags: [sun, AccessibleSlider, Slider, HSlider, VSlider, PDOM]
status: complete
related:
  - /api/sun/slider
  - /api/sun/hslider
  - /api/sun/accessible-number-spinner
  - /api/scenery/parallel-dom-deep-dive
prerequisites:
  - /api/sun/slider
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# AccessibleSlider

`AccessibleSlider` (from `scenerystack/sun`) is a trait — a function that takes a `Node` subclass and returns a new class with slider-like keyboard/PDOM behavior mixed in — rather than a `Node` you instantiate directly. [`Slider`](/api/sun/slider) (and through it, [`HSlider`](/api/sun/hslider)/`VSlider`) is defined as `class Slider extends Sizable( AccessibleSlider( Node, 0 ) )`; reach for `AccessibleSlider` yourself only if you're building a custom slider-like component from scratch that needs the same keyboard behavior `Slider` gets for free.

```ts
import { AccessibleSlider } from 'scenerystack/sun';
import { Node } from 'scenerystack/scenery';
import { Range } from 'scenerystack/dot';
import { NumberProperty, Property } from 'scenerystack/axon';

class MyCustomSliderNode extends AccessibleSlider( Node, 0 ) {
  public constructor( valueProperty: NumberProperty, range: Range ) {
    super( {
      valueProperty: valueProperty,
      enabledRangeProperty: new Property( range ),
      keyboardStep: 1,
      shiftKeyboardStep: 0.1,
      pageKeyboardStep: 10
    } );
    // ...add your own visual children and mouse/touch dragging here
  }
}
```

`AccessibleSlider( Type, optionsArgPosition )` takes the base class to extend and the zero-indexed position of that class's constructor options argument (`Slider` passes `0` since its own constructor's options are the first argument after `super()`'s implicit args) — `AccessibleSlider` needs this so its `DelayedMutate`-based option handling can intercept the right argument.

Under the hood, `AccessibleSlider` mixes in `AccessibleValueHandler` (which does the bulk of the PDOM/`aria-valuenow`/`aria-valuetext` work shared with `AccessibleNumberSpinner`) and adds slider-specific `startDrag`/`drag`/`endDrag` hooks on top, named to match `Slider`'s own drag terminology rather than `AccessibleValueHandler`'s more generic `startInput`/`onInput`/`endInput`.

## Behavior it adds

| Interaction | Effect |
| --- | --- |
| Arrow keys (Left/Down, Right/Up) | Decrement/increment `valueProperty` by `keyboardStep` |
| Shift + arrow keys | Decrement/increment by `shiftKeyboardStep` (usually smaller) |
| Page Up / Page Down | Increment/decrement by `pageKeyboardStep` (usually larger) |
| Home / End | Jump to the range's minimum / maximum |

## Options (via `AccessibleValueHandler`)

| Option | Effect |
| --- | --- |
| `valueProperty` | Required — the numeric `Property` this behavior reads and writes |
| `enabledRangeProperty` | Required — a `TReadOnlyProperty<Range>` clamping keyboard-driven changes |
| `keyboardStep` / `shiftKeyboardStep` / `pageKeyboardStep` | Step sizes for the interactions above |
| `constrainValue` | `(value: number) => number`, applied before the value is committed |
| `startDrag` / `drag` / `endDrag` | Hooks fired at each stage of an accessible ("virtual drag") interaction — same names [`Slider`](/api/sun/slider) itself exposes |
| `roundToStepSize` | Round the value to a multiple of `keyboardStep` on ordinary key presses |

::: tip You're almost always consuming this indirectly
Simulation code essentially never calls `AccessibleSlider` directly — it's documented here because [`Slider`](/api/sun/slider)'s own `startDrag`/`drag`/`endDrag`/`keyboardStep`-family options are actually implemented by this trait, so this is the page to check for the precise contract behind those options. Compare [`AccessibleNumberSpinner`](/api/sun/accessible-number-spinner), the equivalent trait behind `NumberSpinner`.
:::
