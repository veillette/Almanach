---
title: Momentary Buttons
description: Press-and-hold buttons that set a Property to an "on" value only while pressed, reverting when released.
category: api
library: sun
tags: [sun, RectangularMomentaryButton, RoundMomentaryButton, MomentaryButtonModel, button]
status: complete
related:
  - /api/sun/push-button-model
  - /api/sun/sticky-toggle-button
  - /api/sun/toggle-button
  - /api/sun/rectangular-button
  - /api/sun/round-button
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Momentary Buttons

A momentary button sets a bound `Property<T>` to `valueOn` while the pointer holds it down, and back to `valueOff` the instant it's released — unlike [Sticky Toggle Buttons](/api/sun/sticky-toggle-button), it never latches. `scenerystack/sun` exports `RectangularMomentaryButton<T>` and `RoundMomentaryButton<T>`, both built on the shared `MomentaryButtonModel<T>`. Reach for these for "hold to activate" controls — a horn, a temporary boost, a press-and-hold camera shutter — where releasing should immediately undo the effect.

```ts
import { RectangularMomentaryButton } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

const hornStateProperty = new Property<'off' | 'on'>( 'off' );

const hornButton = new RectangularMomentaryButton(
  hornStateProperty,
  'off', // valueOff
  'on',  // valueOn
  {
    content: new Text( 'Horn' ),
    baseColor: 'orange',
    tandem: Tandem.REQUIRED
  }
);
```

`RoundMomentaryButton` has the identical `(property, valueOff, valueOn, options?)` constructor — only the button shape differs, same as `RoundPushButton`/`RectangularPushButton`.

## `MomentaryButtonModel`

Both classes construct a `MomentaryButtonModel<T>` internally, the non-visual model (extending the shared `ButtonModel` base documented on [PushButtonModel](/api/sun/push-button-model), not `PushButtonModel` itself) that owns the on/off logic: `downProperty` transitioning to `true` sets `valueProperty` to `valueOn`; transitioning to `false` sets it back to `valueOff`. For alternative-input (keyboard/switch) activation, it behaves like a toggle instead — one activation turns it on, the next turns it off — and it always reverts to `valueOff` if the button loses focus while on.

`Property.valueComparisonStrategy` must be `'reference'` (the default) for the bound Property, since the model compares `valueProperty.value` against `valueOn`/`valueOff` with `===`.

## Options

Both classes accept the same appearance options as their non-momentary counterparts ([`RectangularButtonOptions`](/api/sun/rectangular-button#options) / [`RoundButtonOptions`](/api/sun/round-button#options)) plus:

| Option | Effect |
| --- | --- |
| `valueOffSoundPlayer` | Sound played when the button releases back to `valueOff` (default: shared `'toggleOff'` player) |
| `valueOnSoundPlayer` | Sound played when the button is pressed to `valueOn` (default: shared `'toggleOn'` player) |
| `accessibleContextResponseValueOn` / `accessibleContextResponseValueOff` | Alertable spoken/announced content for each transition |

::: warning Momentary buttons render `aria-pressed`, not a toggle-switch semantic
Both classes set the `aria-pressed` PDOM attribute to reflect whether `property.value === valueOn`, but the underlying interaction is still "hold to activate" — don't confuse this with [Sticky Toggle Buttons](/api/sun/sticky-toggle-button), which use `ariaRole: 'switch'` and latch until pressed again.
:::
