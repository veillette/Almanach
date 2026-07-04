---
title: PlayPauseButton
description: The round toggle button that starts and stops time in a simulation, swapping between a play triangle and a pause icon.
category: api
library: scenery-phet
tags: [scenery-phet, PlayPauseButton, button]
status: verified
related:
  - /api/scenery-phet/time-control-node
  - /api/scenery-phet/step-forward-button
  - /api/scenery-phet/step-backward-button
  - /api/sun/toggle-button
prerequisites:
  - /api/axon/boolean-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PlayPauseButton

`PlayPauseButton` (from `scenerystack/scenery-phet`) is a round toggle button bound to a `Property<boolean>`: it shows a triangular "play" icon when stopped and a two-bar "pause" icon when running, swapping between them as the Property changes (from any source, not just the button itself). It's generated programmatically from vector shapes rather than raster images, and is normally used inside [`TimeControlNode`](/api/scenery-phet/time-control-node) rather than constructed on its own — `TimeControlNode` composes exactly one `PlayPauseButton` alongside optional step buttons and speed radio buttons.

```ts
import { PlayPauseButton } from 'scenerystack/scenery-phet';
import { Property } from 'scenerystack/axon';
```

## A minimal example

```ts
const isPlayingProperty = new Property<boolean>( true );

const playPauseButton = new PlayPauseButton( isPlayingProperty, {
  tandem: tandem.createTandem( 'playPauseButton' )
} );
```

## Constructor

```ts
new PlayPauseButton(
  isPlayingProperty: Property<boolean>,
  providedOptions?: PlayPauseButtonOptions
)
```

`PlayPauseButton` extends the more general `PlayControlButton` (which takes an arbitrary "end playing" icon `Node`; `PlayPauseButton` fixes that icon to the standard two-bar pause shape).

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `radius` | `SceneryPhetConstants.PLAY_CONTROL_BUTTON_RADIUS` (`28`) | Button radius — distinct from the smaller `SceneryPhetConstants.DEFAULT_BUTTON_RADIUS` used by most other round buttons |
| `scaleFactorWhenNotPlaying` | `1` | Scales the button up (or down) while showing the "play" icon — PhET convention is to enlarge the play button when pressing it does *not* immediately resume stepping the model |
| `includeGlobalHotkey` | `true` for `PlayPauseButton` specifically | Wires the `alt+K` global hotkey (via `PlayControlButton.TOGGLE_PLAY_HOTKEY_DATA`) to toggle `isPlayingProperty`, when interactive description is supported |
| `startPlayingAccessibleName` / `endPlayingAccessibleName` | localized "Play" / "Pause" strings | PDOM accessible names for each state |
| `valueOnSoundPlayer` / `valueOffSoundPlayer` | shared `'play'` / `'pause'` sound players | Sounds played on each toggle direction |

## Public API

Being a `BooleanRoundToggleButton` under the hood, `PlayPauseButton` shares the [same toggle-button surface](/api/sun/toggle-button) — no additional public members beyond the options above.

::: tip Don't drive time from the button itself
`PlayPauseButton` only flips a boolean — it never calls `step()` for you. Read `isPlayingProperty` from your model's own step/animation-frame logic (as shown in [`TimeControlNode`](/api/scenery-phet/time-control-node)) rather than trying to hook additional behavior into the button's listener.
:::
