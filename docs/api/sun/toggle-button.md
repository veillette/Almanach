---
title: Toggle Buttons
description: The rectangular/round toggle-button family bound to a BooleanProperty or two-state value.
category: api
library: sun
tags: [sun, toggle-button, BooleanProperty]
status: verified
related:
  - /api/sun/rectangular-push-button
  - /api/sun/radio-button-group
  - /patterns/reset-all-pattern
prerequisites:
  - /api/axon/boolean-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Toggle Buttons

Unlike [`RectangularPushButton`](/api/sun/rectangular-push-button), a toggle button is bound directly to a `Property` and reflects (and controls) its current value — pressing it flips the Property between two states, and the button's appearance updates automatically if the Property changes elsewhere. `scenerystack/sun` exports four classes for this: `BooleanRectangularToggleButton` and `BooleanRoundToggleButton` (the common case, swapping between two `Node`s based on a `BooleanProperty`), and the generic `RectangularToggleButton<T>` / `RoundToggleButton<T>` (toggling any `Property<T>` between two arbitrary values, with one fixed piece of content).

```ts
import { BooleanRectangularToggleButton } from 'scenerystack/sun';
import { Path } from 'scenerystack/scenery';
import { BooleanProperty } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';
import playIconShape from './playIconShape.js';
import pauseIconShape from './pauseIconShape.js';

const isPlayingProperty = new BooleanProperty( false );

const playPauseButton = new BooleanRectangularToggleButton(
  isPlayingProperty,
  new Path( pauseIconShape, { fill: 'black' } ), // shown when isPlayingProperty === true
  new Path( playIconShape, { fill: 'black' } ),  // shown when isPlayingProperty === false
  {
    baseColor: 'yellow',
    tandem: Tandem.REQUIRED
  }
);
```

`BooleanRoundToggleButton` has the identical constructor signature and is used exactly the same way — only the button shape differs.

<SceneryDemo demo="rectangular-toggle-button" />

## The generic form

`RectangularToggleButton<T>` and `RoundToggleButton<T>` toggle a `Property<T>` between two specific values of any type (not just `boolean`), sharing one `content` Node for both states:

```ts
import { RoundToggleButton } from 'scenerystack/sun';
import { Property } from 'scenerystack/axon';
import { Text } from 'scenerystack/scenery';

type Speed = 'normal' | 'slow';
const speedProperty = new Property<Speed>( 'normal' );

const speedButton = new RoundToggleButton(
  speedProperty,
  'normal', // valueOff
  'slow',   // valueOn
  { content: new Text( 'x' ), tandem: Tandem.REQUIRED }
);
```

`Property.valueComparisonStrategy` must be `'reference'` for the bound Property (the default) — the toggle buttons compare `property.value` against `valueOff`/`valueOn` with `===`.

## Options

All four classes accept the same button-appearance options as [`RectangularPushButton`](/api/sun/rectangular-push-button#options) / the round-button equivalents (`baseColor`, `xMargin`, `yMargin`, `cornerRadius`, pointer-area dilations, `enabledProperty`), plus:

| Option | Effect |
| --- | --- |
| `valueOffSoundPlayer` | Sound played when the bound value becomes the "off" value |
| `valueOnSoundPlayer` | Sound played when the bound value becomes the "on" value |

`BooleanRectangularToggleButton`/`BooleanRoundToggleButton` additionally derive a default `accessibleName` from the `trueNode`/`falseNode` content if neither has one set explicitly and you don't provide `accessibleName` yourself.

::: tip Toggle buttons don't need resetting themselves
A toggle button has no state of its own — it only reflects the bound `Property`. To make a play/pause or mute/unmute control participate correctly in "Reset All," reset the underlying `BooleanProperty`, not the button; see the [Reset All pattern](/patterns/reset-all-pattern).
:::
