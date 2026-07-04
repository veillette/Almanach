---
title: TimeControlNode
description: The standard play/pause/step-forward control for time-based simulations.
category: api
library: scenery-phet
tags: [scenery-phet, TimeControlNode]
status: complete
related:
  - /api/scenery-phet/stopwatch-node
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# TimeControlNode

`TimeControlNode` (from `scenerystack/scenery-phet`) is the standard control strip for time-based simulations: a play/pause button, an optional step-forward button (shown by default), an optional step-backward button, and optional radio buttons for selecting a `TimeSpeed`. It's bound to a single `Property<boolean>` that tracks whether the sim is currently playing.

```ts
import { TimeControlNode } from 'scenerystack/scenery-phet';
import { Property } from 'scenerystack/axon';
```

## A minimal example

```ts
const isPlayingProperty = new Property<boolean>( true );

const timeControlNode = new TimeControlNode( isPlayingProperty, {
  playPauseStepButtonOptions: {
    includeStepBackwardButton: true
  },
  tandem: tandem.createTandem( 'timeControlNode' )
} );
```

`isPlayingProperty` is the single source of truth for whether the model is stepping — read it in your model's `step` logic, or the model's animation loop, rather than having `TimeControlNode` drive time directly.

## Constructor

```ts
new TimeControlNode(
  isPlayingProperty: Property<boolean>,
  providedOptions?: TimeControlNodeOptions
)
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `timeSpeedProperty` | `null` | An `EnumerationProperty<TimeSpeed>` for the speed radio buttons; if `null`, no radio buttons are included |
| `timeSpeeds` | `[ TimeSpeed.NORMAL, TimeSpeed.SLOW ]` | Which speeds get a radio button, and in what order, when `timeSpeedProperty` is provided |
| `speedRadioButtonGroupPlacement` | `'right'` | Where the speed radio buttons sit relative to the play/pause/step buttons — `'left'`, `'right'`, `'top'`, or `'bottom'` |
| `playPauseStepButtonOptions` | — | Forwarded to the internal `PlayPauseStepButtonGroup`; use this to add a step-backward button (see below) |
| `speedRadioButtonGroupOptions` | — | Forwarded to the internal `TimeSpeedRadioButtonGroup` |
| `flowBoxAlign` | `'center'` | Alignment of the `FlowBox` laying out the buttons and (if present) radio buttons |
| `flowBoxSpacing` | `40` | Spacing between the button group and the radio button group |

### `playPauseStepButtonOptions`

| Option | Default | Effect |
| --- | --- | --- |
| `includeStepForwardButton` | `true` | Whether a step-forward button is shown |
| `includeStepBackwardButton` | `false` | Whether a step-backward button is shown |
| `playPauseStepXSpacing` | `10` | Horizontal spacing between the play/pause and step buttons |

## Methods

| Method | Effect |
| --- | --- |
| `addPushButton( pushButton, index )` | Inserts an extra `RoundPushButton` into the button group at the given index — for a custom control alongside play/pause/step |

::: tip Step buttons default to forward-only
Out of the box you only get a step-forward button; a step-backward button must be opted into via `playPauseStepButtonOptions.includeStepBackwardButton: true`. The step buttons are automatically disabled while `isPlayingProperty` is `true` — you don't need to wire that up yourself.
:::
