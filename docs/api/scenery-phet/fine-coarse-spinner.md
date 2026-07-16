---
title: FineCoarseSpinner
description: A five-part numeric spinner - fine decrement, coarse decrement, a NumberDisplay readout, coarse increment, fine increment.
category: api
library: scenery-phet
tags: [scenery-phet, FineCoarseSpinner, spinner, NumberDisplay]
status: complete
related:
  - /api/scenery-phet/number-display
  - /api/scenery-phet/number-control
  - /api/axon/number-property
prerequisites:
  - /api/axon/number-property
  - /api/scenery-phet/number-display
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# FineCoarseSpinner

`FineCoarseSpinner` (from `scenerystack/scenery-phet`) lays out five subcomponents in a row — `<  <<  [ value ]  >>  >` — giving the user both fine (single-step) and coarse (multi-step) control over one `NumberProperty` from a single control. It's the arrangement to reach for whenever a plain increment/decrement spinner's step size is too coarse for precise adjustment but too fine for large jumps — letting both live side by side instead of forcing a compromise value.

```ts
import { FineCoarseSpinner } from 'scenerystack/scenery-phet';
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
```

## A minimal example

```ts
const volumeProperty = new NumberProperty( 50, { range: new Range( 0, 100 ) } );

const volumeSpinner = new FineCoarseSpinner( volumeProperty, {
  deltaFine: 1,
  deltaCoarse: 10,
  tandem: tandem.createTandem( 'volumeSpinner' )
} );
```

Clicking `<`/`>` changes `volumeProperty.value` by `deltaFine`; clicking `<<`/`>>` changes it by `deltaCoarse` (clamped so it never overshoots `numberProperty.range`). All four buttons automatically disable themselves when the value is already at `range.min` or `range.max`.

<SceneryDemo demo="fine-coarse-spinner" />

## Constructor

```ts
new FineCoarseSpinner(
  numberProperty: NumberProperty,
  providedOptions?: FineCoarseSpinnerOptions
)
```

`numberProperty.range` (from its `rangeProperty`) supplies both the enabled-range checks and the range shown by the internal [`NumberDisplay`](/api/scenery-phet/number-display) — there's no separate range argument.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `deltaFine` | `1` | Amount `<`/`>` change the value by per click |
| `deltaCoarse` | `10` | Amount `<<`/`>>` change the value by per click |
| `spacing` | `10` | Horizontal space between the five subcomponents |
| `arrowsSoundPlayer` | the shared `'pushButton'` sound | Sound played when any arrow button is pressed (and, via keyboard, on Home/End) |
| `numberDisplayOptions` | — | Options forwarded to the internal `NumberDisplay` readout |
| `arrowButtonOptions` | — | Options forwarded to all four internal `ArrowButton`s (excluding `numberOfArrows`, `tandem`, `focusable`, `soundPlayer`, which `FineCoarseSpinner` controls itself) |

::: tip Keyboard input drives the buttons, not a separate code path
`FineCoarseSpinner` implements `AccessibleNumberSpinner`, so arrow keys, Page Up/Down, and Home/End all work — but instead of changing `numberProperty` directly, keyboard input synthetically "clicks" the corresponding fine or coarse button (holding Shift routes to the fine button) so the pressed button visually depresses just as it would with a pointer. This is why `keyboardStep`/`shiftKeyboardStep`/`pageKeyboardStep` aren't exposed as options here — `deltaFine` and `deltaCoarse` are the only step sizes that exist.
:::
