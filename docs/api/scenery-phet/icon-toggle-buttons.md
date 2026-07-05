---
title: Icon Toggle Buttons
description: SoundToggleButton, TimerToggleButton, and EyeToggleButton — toggle buttons bound to a boolean Property that swap between two pre-built icons.
category: api
library: scenery-phet
tags: [scenery-phet, SoundToggleButton, TimerToggleButton, EyeToggleButton, button]
status: complete
related:
  - /api/sun/toggle-button
  - /api/scenery-phet/round-icon-buttons
prerequisites:
  - /api/axon/boolean-property
  - /api/sun/toggle-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Icon Toggle Buttons

`SoundToggleButton`, `TimerToggleButton`, and `EyeToggleButton` are all built the same way: two pre-built icon `Node`s (an "on" state and an "off" state) handed to a member of the [toggle-button family](/api/sun/toggle-button), which shows exactly one of the two depending on a `Property<boolean>` and flips it on press. Unlike the [round icon utility buttons](/api/scenery-phet/round-icon-buttons), these hold state — the button's own appearance *is* the current value of the bound Property, and it stays in sync if that Property changes from elsewhere.

```ts
import { SoundToggleButton, TimerToggleButton, EyeToggleButton } from 'scenerystack/scenery-phet';
import { Property } from 'scenerystack/axon';
```

## A minimal example

```ts
const soundEnabledProperty = new Property<boolean>( true );
const timerRunningProperty = new Property<boolean>( false );
const eyeOpenProperty = new Property<boolean>( true );

const soundToggleButton = new SoundToggleButton( soundEnabledProperty, {
  tandem: tandem.createTandem( 'soundToggleButton' )
} );

const timerToggleButton = new TimerToggleButton( timerRunningProperty, {
  tandem: tandem.createTandem( 'timerToggleButton' )
} );

const eyeToggleButton = new EyeToggleButton( eyeOpenProperty, {
  tandem: tandem.createTandem( 'eyeToggleButton' )
} );
```

## The family

| Class | Base class | `true` icon | `false` icon | Default size |
| --- | --- | --- | --- | --- |
| `SoundToggleButton` | `BooleanRectangularToggleButton` | A speaker/volume glyph | The same glyph with an "x" drawn beside it | `45 × 45`, `4`px margin |
| `TimerToggleButton` | `BooleanRectangularToggleButton` | A `SimpleClockIcon` | The same clock, dimmed, with a red "x" over it (`offIconOptions` lets you restyle the "x") | `45 × 45`, `4`px margin |
| `EyeToggleButton` | `RectangularToggleButton<boolean>` | An open-eye glyph (`eyeSolidShape`) | A closed/slashed-eye glyph (`eyeSlashSolidShape`) | Sized to the icon, no fixed `minWidth`/`minHeight` |

`SoundToggleButton` and `TimerToggleButton` both default `baseColor` to `PhetColorScheme.BUTTON_YELLOW`; `EyeToggleButton` doesn't override `baseColor`, so it uses the plain `RectangularToggleButton` default.

## Constructor shape

All three take the boolean `Property` first, then options:

```ts
new SoundToggleButton( property: Property<boolean>, providedOptions?: SoundToggleButtonOptions )
new TimerToggleButton( timerRunningProperty: Property<boolean>, providedOptions?: TimerToggleButtonOptions )
new EyeToggleButton( eyeOpenProperty: Property<boolean>, providedOptions?: EyeToggleButtonOptions )
```

`EyeToggleButton`'s `eyeOpenProperty` is read as `true` = eye open (showing something), `false` = eye closed (hiding it) — the same true/false polarity you'd use for a `visibleProperty`.

::: tip These are conveniences, not the only way to build a boolean icon toggle
Each of these classes just wires two hand-picked icons into `BooleanRectangularToggleButton` or `RectangularToggleButton<boolean>`. If you need a similar on/off icon swap for a concept that isn't sound, timer, or visibility, build it the same way directly against the [toggle-button family](/api/sun/toggle-button) rather than trying to repurpose one of these three.
:::
