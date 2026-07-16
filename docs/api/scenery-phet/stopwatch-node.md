---
title: StopwatchNode
description: A draggable digital stopwatch bound to a Stopwatch model element.
category: api
library: scenery-phet
tags: [scenery-phet, StopwatchNode]
status: verified
related:
  - /api/scenery-phet/time-control-node
  - /api/dot/bounds2
  - /patterns/model-view-separation
prerequisites:
  - /api/dot/bounds2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# StopwatchNode

`StopwatchNode` (from `scenerystack/scenery-phet`) is the view for a `Stopwatch` model element: a digital mm:ss.cc readout with play/pause and reset buttons, optionally draggable within a set of bounds. `Stopwatch` itself is a plain `PhetioObject` model holding `positionProperty`, `isVisibleProperty`, `isRunningProperty`, and `timeProperty` — `StopwatchNode` only renders and lets the user drag/press it.

```ts
import { Stopwatch, StopwatchNode } from 'scenerystack/scenery-phet';
import { Property } from 'scenerystack/axon';
import { Bounds2 } from 'scenerystack/dot';
```

## A minimal example

```ts
const stopwatch = new Stopwatch( {
  tandem: tandem.createTandem( 'stopwatch' )
} );

const dragBoundsProperty = new Property( new Bounds2( 0, 0, 768, 504 ) );

const stopwatchNode = new StopwatchNode( stopwatch, {
  dragBoundsProperty: dragBoundsProperty,
  tandem: tandem.createTandem( 'stopwatchNode' )
} );
```

Call `stopwatch.reset()` from your model's `reset()` — resetting only the Node would leave the underlying time/running state untouched.

<SceneryDemo demo="stopwatch-node" />

## Constructor

```ts
new StopwatchNode( stopwatch: Stopwatch, providedOptions?: StopwatchNodeOptions )
```

## `Stopwatch` (the model)

| Member | Description |
| --- | --- |
| `positionProperty` | `Property<Vector2>` — position in view coordinates |
| `isVisibleProperty` | `Property<boolean>` — becoming invisible stops the stopwatch and resets its time |
| `isRunningProperty` | `Property<boolean>` — whether time is currently advancing |
| `timeProperty` | `NumberProperty` — elapsed time, in units the client defines (seconds by default) |
| `step( dt )` | Advances the stopwatch by `dt`, clamped to `timeProperty.range.max`, auto-pausing at the max |
| `setTime( t )` | Sets the time directly (only takes effect while running) |
| `reset()` | Resets position, visibility, running state, and time |
| `Stopwatch.ZERO_TO_ALMOST_SIXTY` | Static `Range( 0, 3599.99 )` — the default `numberDisplayRange`, i.e. up to 59:59.99 |

## `StopwatchNode` options

| Option | Default | Effect |
| --- | --- | --- |
| `dragBoundsProperty` | `null` | If provided, the stopwatch is draggable (mouse + keyboard) and constrained within these bounds; `null` means not draggable |
| `numberDisplayRange` | `Stopwatch.ZERO_TO_ALMOST_SIXTY` | Sizes the internal `NumberDisplay` so the readout doesn't resize as digits change |
| `numberDisplayOptions` | formats mm:ss.cc | Forwarded to the internal `NumberDisplay`; set `numberFormatter` here for custom formatting |
| `includePlayPauseResetButtons` | `true` | Whether the play/pause and reset buttons are shown at all |
| `otherControls` | `[]` | Extra `Node`s stacked below the buttons (e.g. a units selector) |
| `xSpacing` / `ySpacing` | `6` / `6` | Horizontal space between buttons / vertical space between readout and buttons |
| `xMargin` / `yMargin` | `8` / `8` | Margins of the background panel around the contents |
| `playPauseButtonOptions` / `resetButtonOptions` | — | Forwarded to the respective buttons |

## Static formatting helpers

| Static member | Purpose |
| --- | --- |
| `StopwatchNode.DEFAULT_FONT` | The standard monospace-digit font used for the readout |
| `StopwatchNode.RICH_TEXT_MINUTES_AND_SECONDS` | Default `numberDisplayOptions.numberFormatter` — RichText mm:ss.cc with smaller centiseconds |
| `StopwatchNode.PLAIN_TEXT_MINUTES_AND_SECONDS` | Same format as plain text, for contexts that can't render RichText |
| `StopwatchNode.createRichTextNumberFormatter( options )` | Builds a custom formatter — pass `units`, `showAsMinutesAndSeconds`, decimal places, etc. |

::: tip A `Stopwatch` doesn't step itself
`Stopwatch.step( dt )` must be called by something — typically the screen's model `step()`, gated on `stopwatch.isRunningProperty`. `StopwatchNode` never calls it for you; it only reflects `timeProperty` and toggles `isRunningProperty` via its buttons.
:::
