---
title: StepForwardButton
description: A round push button with a forward-step icon, used to advance a paused simulation by one fixed increment.
category: api
library: scenery-phet
tags: [scenery-phet, StepForwardButton, button]
status: complete
related:
  - /api/scenery-phet/time-control-node
  - /api/scenery-phet/play-pause-button
  - /api/scenery-phet/step-backward-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# StepForwardButton

`StepForwardButton` (from `scenerystack/scenery-phet`) is a `RoundPushButton` showing a bar-plus-triangle "step forward" icon, for advancing a paused model by one fixed time increment. It's a thin subclass of the shared (non-exported) `StepButton` with `direction: 'forward'` fixed — [`TimeControlNode`](/api/scenery-phet/time-control-node) includes one by default, but it's also usable standalone wherever a sim needs frame-by-frame stepping without a full play/pause control strip.

```ts
import { StepForwardButton } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const stepForwardButton = new StepForwardButton( {
  listener: () => {
    model.step( 0.1 );
  },
  enabledProperty: DerivedProperty.not( isPlayingProperty ),
  tandem: tandem.createTandem( 'stepForwardButton' )
} );
```

## Options

`StepForwardButtonOptions` is `StepButtonOptions` with `direction` fixed to `'forward'` — the underlying `content` icon is likewise fixed and not settable directly.

| Option | Default | Effect |
| --- | --- | --- |
| `radius` | `20` | Button radius (independent of `SceneryPhetConstants`, unlike the play/pause button's radius) |
| `iconFill` | `'black'` | Fill color of the bar-and-triangle icon |
| `fireOnHold` | `true` | Press-and-hold repeats the step, matching the default `fireOnHold`/`fireOnHoldDelay`/`fireOnHoldInterval` behavior of any `RoundPushButton` |
| `soundPlayer` | the shared `'stepForward'` sound player | Overridable if a different button in the same sim needs a distinct sound |
| `enabledProperty` | — | Inherited from `RoundPushButton`; there is no dedicated `isPlayingProperty` option, so disabling while the sim runs is the caller's responsibility (see tip below) |

::: tip There is no built-in `isPlayingProperty` option — wire `enabledProperty` yourself
`StepForwardButton` has no special awareness of play/pause state. [`TimeControlNode`](/api/scenery-phet/time-control-node) achieves "step buttons disable while playing" by deriving `enabledProperty: DerivedProperty.not( isPlayingProperty )` internally (via `PlayPauseStepButtonGroup`) and passing it in as an ordinary option. Do the same if you use `StepForwardButton` standalone, outside `TimeControlNode`.
:::
