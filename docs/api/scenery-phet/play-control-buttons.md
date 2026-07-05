---
title: Play Control Buttons
description: PlayControlButton, PlayStopButton, RecordStopButton, and PlayPauseStepButtonGroup — the round toggle buttons and layout group behind time/recording controls.
category: api
library: scenery-phet
tags: [scenery-phet, PlayControlButton, PlayStopButton, RecordStopButton, PlayPauseStepButtonGroup, PlayPauseButton, button]
status: complete
related:
  - /api/scenery-phet/play-pause-button
  - /api/scenery-phet/time-control-node
  - /api/scenery-phet/step-forward-button
  - /api/scenery-phet/step-backward-button
  - /api/sun/toggle-button
prerequisites:
  - /api/axon/boolean-property
  - /api/scenery-phet/play-pause-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Play Control Buttons

`PlayControlButton` is the round `BooleanRoundToggleButton` base class behind [`PlayPauseButton`](/api/scenery-phet/play-pause-button): it always shows a triangular "play" icon for `false`, and takes an arbitrary `Node` icon for whatever `true` ("currently playing/running") should look like. `PlayStopButton` is the other built-in specialization, using a square "stop" icon instead of pause bars. `RecordStopButton` looks like a sibling but is actually independent — and `PlayPauseStepButtonGroup` is the `HBox` layout that combines a play/pause button with step buttons, used internally by [`TimeControlNode`](/api/scenery-phet/time-control-node).

```ts
import { PlayStopButton, RecordStopButton, PlayPauseStepButtonGroup } from 'scenerystack/scenery-phet';
import { Property } from 'scenerystack/axon';
```

## A minimal example

```ts
const isRunningProperty = new Property<boolean>( false );
const isRecordingProperty = new Property<boolean>( false );

// A play/stop toggle where stopping restarts from the beginning (unlike PlayPauseButton).
const playStopButton = new PlayStopButton( isRunningProperty, {
  tandem: tandem.createTandem( 'playStopButton' )
} );

// A record/stop toggle for a data-recording feature.
const recordStopButton = new RecordStopButton( isRecordingProperty, {
  tandem: tandem.createTandem( 'recordStopButton' )
} );

// The play/pause + step-forward group TimeControlNode builds internally.
const buttonGroup = new PlayPauseStepButtonGroup( isRunningProperty, {
  includeStepBackwardButton: true,
  tandem: tandem.createTandem( 'buttonGroup' )
} );
```

## `PlayControlButton` (base class)

```ts
new PlayControlButton(
  isPlayingProperty: Property<boolean>,
  endPlayingIcon: Node,
  providedOptions?: PlayControlButtonOptions
)
```

| Option | Default | Effect |
| --- | --- | --- |
| `radius` | `SceneryPhetConstants.PLAY_CONTROL_BUTTON_RADIUS` (`28`) | Button radius; both the play triangle and `endPlayingIcon` are sized relative to it |
| `scaleFactorWhenNotPlaying` | `1` | Scales the whole button up (or down) while showing the "play" icon, per PhET's convention of enlarging play buttons that don't immediately resume stepping |
| `includeGlobalHotkey` | `false` | If `true` (and interactive description is supported), wires a global `alt+K` hotkey — via the static `PlayControlButton.TOGGLE_PLAY_HOTKEY_DATA` — that toggles `isPlayingProperty` regardless of document focus |
| `startPlayingAccessibleName` / `endPlayingAccessibleName` | localized "Play" / `null` | PDOM accessible names for each state; subclasses fill in `endPlayingAccessibleName` |
| `valueOnSoundPlayer` / `valueOffSoundPlayer` | shared `'play'` / `'pause'` sound players | Sounds played only by the global hotkey path, not by pointer presses (those use the button's own `soundPlayer`) |

`PlayPauseButton` (documented separately) fixes `endPlayingIcon` to a two-bar pause glyph and turns `includeGlobalHotkey` on by default.

## `PlayStopButton`

```ts
new PlayStopButton( isPlayingProperty: Property<boolean>, providedOptions?: PlayStopButtonOptions )
```

A `PlayControlButton` subclass with `endPlayingIcon` fixed to a square "stop" glyph (`StopIconShape`). The source comment is explicit about the semantic difference from `PlayPauseButton`: "Unlike the `PlayPauseButton`, this indicates that play will re-start from the beginning after switching from play to stop" — use it wherever pressing stop resets progress rather than merely pausing it.

## `RecordStopButton`

```ts
new RecordStopButton( recordingProperty: Property<boolean>, providedOptions?: RecordStopButtonOptions )
```

| Option | Default | Effect |
| --- | --- | --- |
| `radius` | `30` | Button radius |
| `recordIconColor` / `stopIconColor` | `PhetColorScheme.RED_COLORBLIND` for both | Colors of the record-dot and stop-square icons |

::: warning `RecordStopButton` does not extend `PlayControlButton`
Despite the naming pattern, `RecordStopButton` is its own direct `BooleanRoundToggleButton` subclass (a red circle for "record," a red square for "stop") — it doesn't share `PlayControlButton`'s `radius` default, hotkey support, or `scaleFactorWhenNotPlaying` option. Don't assume `PlayControlButtonOptions` apply to it.
:::

## `PlayPauseStepButtonGroup`

```ts
new PlayPauseStepButtonGroup( isPlayingProperty: Property<boolean>, providedOptions?: PlayPauseStepButtonGroupOptions )
```

An `HBox` that lays out one [`PlayPauseButton`](/api/scenery-phet/play-pause-button) alongside optional [`StepForwardButton`](/api/scenery-phet/step-forward-button)/[`StepBackwardButton`](/api/scenery-phet/step-backward-button) instances. This is what `TimeControlNode` builds internally rather than composing those buttons by hand.

| Option | Default | Effect |
| --- | --- | --- |
| `includeStepForwardButton` | `true` | Whether a step-forward button is included |
| `includeStepBackwardButton` | `false` | Whether a step-backward button is included |
| `playPauseStepXSpacing` | `10` | Horizontal spacing between the play/pause button and the step buttons |
| `playPauseButtonOptions` / `stepForwardButtonOptions` / `stepBackwardButtonOptions` | radius `SceneryPhetConstants.DEFAULT_BUTTON_RADIUS` / `15` / `15` | Forwarded to the respective internal button |

If you don't supply an `enabledProperty` for the step buttons yourself, the group derives one automatically as `DerivedProperty.not( isPlayingProperty )`, so step buttons are enabled only while paused — you don't have to wire that up by hand the way you would using `StepForwardButton`/`StepBackwardButton` standalone.

## Members

| Member | Description |
| --- | --- |
| `playPauseButton` | Public reference to the internal `PlayPauseButton`, for positioning |
| `getPlayPauseButtonCenter()` | Returns the `PlayPauseButton`'s center in the group's local coordinate frame |

::: tip Reach for `TimeControlNode` first
Unless you're building a custom layout, [`TimeControlNode`](/api/scenery-phet/time-control-node) already composes `PlayPauseStepButtonGroup` with an optional `TimeSpeedRadioButtonGroup` — most sims never need to construct `PlayPauseStepButtonGroup` directly.
:::
