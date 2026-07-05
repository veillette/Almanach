---
title: Sticky Toggle Buttons
description: Press-to-latch, press-again-to-release buttons bound to a two-value Property.
category: api
library: sun
tags: [sun, RectangularStickyToggleButton, RoundStickyToggleButton, StickyToggleButtonModel, button]
status: complete
related:
  - /api/sun/push-button-model
  - /api/sun/momentary-button
  - /api/sun/toggle-button
  - /api/sun/on-off-switch
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Sticky Toggle Buttons

A sticky toggle button pops down (`valueUp`) or stays pressed down (`valueDown`) — pressing it while up latches it down, and pressing it again while down releases it back up. This is the "record button" or "power button" pattern: unlike [Momentary Buttons](/api/sun/momentary-button), releasing the pointer does *not* undo the state change. `scenerystack/sun` exports `RectangularStickyToggleButton<T>` and `RoundStickyToggleButton<T>`, both built on the shared `StickyToggleButtonModel<T>`.

```ts
import { RoundStickyToggleButton } from 'scenerystack/sun';
import { Path } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';
import recordIconShape from './recordIconShape.js';

type RecordState = 'up' | 'down';
const recordButtonStateProperty = new Property<RecordState>( 'up' );

const recordButton = new RoundStickyToggleButton(
  recordButtonStateProperty,
  'up',   // valueUp
  'down', // valueDown
  {
    content: new Path( recordIconShape, { fill: 'red' } ),
    baseColor: 'white',
    tandem: Tandem.REQUIRED
  }
);
```

`RectangularStickyToggleButton` has the identical `(valueProperty, valueUp, valueDown, options?)` constructor — only the button shape differs.

## `StickyToggleButtonModel`

Both classes construct a `StickyToggleButtonModel<T>` internally (extending the shared `ButtonModel` base documented on [PushButtonModel](/api/sun/push-button-model)), which owns the latch logic: pressing while `valueProperty.value === valueUp` immediately toggles it to `valueDown`; releasing while down and *not* part of the same press-release action toggles it back to `valueUp`. `Property.valueComparisonStrategy` must be `'reference'` — the model asserts this at construction, since it compares against `valueUp`/`valueDown` with `===`.

## Options

Both classes accept the same appearance options as their non-sticky counterparts ([`RectangularButtonOptions`](/api/sun/rectangular-button#options) / [`RoundButtonOptions`](/api/sun/round-button#options)) plus:

| Option | Effect |
| --- | --- |
| `soundPlayer` | Sound played on every toggle, in either direction (default: shared `'pushButton'` player) |

Both classes default `ariaRole` to `'switch'` and set both `aria-pressed` and `aria-checked` PDOM attributes to reflect `valueProperty.value === valueDown` — screen readers announce these as a switch rather than a momentary button.

::: tip Prefer `OnOffSwitch` for a plain boolean on/off control
If your state is just `boolean` and you want the classic iOS-style sliding switch rather than a button that visually "sticks down," see [`OnOffSwitch`](/api/sun/on-off-switch) instead — it's a different visual metaphor for a similar two-state idea.
:::

::: warning Releasing during the same press doesn't release the latch
`StickyToggleButtonModel` tracks whether the button was pressed while already down as part of the *same* continuous action — releasing right after the press that latched it down does not immediately un-latch it. You have to press and release again to pop it back up. This is what makes the interaction feel like a real latch rather than a simple boolean toggle-on-tap.
:::
