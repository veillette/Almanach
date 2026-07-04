---
title: StepBackwardButton
description: A round push button with a backward-step icon, used to rewind a paused simulation by one fixed increment.
category: api
library: scenery-phet
tags: [scenery-phet, StepBackwardButton, button]
status: verified
related:
  - /api/scenery-phet/time-control-node
  - /api/scenery-phet/play-pause-button
  - /api/scenery-phet/step-forward-button
prerequisites:
  - /api/scenery-phet/time-control-node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# StepBackwardButton

`StepBackwardButton` (from `scenerystack/scenery-phet`) is a `RoundPushButton` showing the same bar-plus-triangle icon as [`StepForwardButton`](/api/scenery-phet/step-forward-button), mirrored to point the other way, for rewinding a paused model by one fixed time increment. It's a thin subclass of the shared, also-exported `StepButton` with `direction: 'backward'` fixed. Unlike [`TimeControlNode`](/api/scenery-phet/time-control-node)'s step-forward button, a step-backward button is **not** included by default — it must be opted into explicitly.

```ts
import { StepBackwardButton } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const stepBackwardButton = new StepBackwardButton( {
  listener: () => {
    model.step( -0.1 );
  },
  enabledProperty: DerivedProperty.not( isPlayingProperty ),
  tandem: tandem.createTandem( 'stepBackwardButton' )
} );
```

## Options

`StepBackwardButtonOptions` is `StepButtonOptions` with `direction` fixed to `'backward'` — the underlying `content` icon is likewise fixed and not settable directly. It shares the same option surface as [`StepForwardButton`](/api/scenery-phet/step-forward-button) (`radius`, `iconFill`, `fireOnHold`, …), with one difference in its default sound:

| Option | Default | Effect |
| --- | --- | --- |
| `radius` | `20` | Button radius |
| `iconFill` | `'black'` | Fill color of the bar-and-triangle icon |
| `soundPlayer` | the shared `'stepBackward'` sound player | Distinct from `StepForwardButton`'s default `'stepForward'` player, so forward/backward stepping sound different |
| `enabledProperty` | — | Inherited from `RoundPushButton`; no dedicated `isPlayingProperty` option exists (see tip below) |

## Enabling a step-backward button in `TimeControlNode`

```ts
const timeControlNode = new TimeControlNode( isPlayingProperty, {
  playPauseStepButtonOptions: {
    includeStepBackwardButton: true
  }
} );
```

::: tip Not included by default, and no built-in `isPlayingProperty` option
`TimeControlNode` only shows a step-forward button out of the box; pass `playPauseStepButtonOptions.includeStepBackwardButton: true` to add this one. And like `StepForwardButton`, `StepBackwardButton` itself has no special play/pause awareness — if you construct it standalone (outside `TimeControlNode`), derive its `enabledProperty` from your own `isPlayingProperty` (e.g. `DerivedProperty.not( isPlayingProperty )`) so it disables correctly while the sim is running.
:::
