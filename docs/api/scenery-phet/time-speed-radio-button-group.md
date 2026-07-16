---
title: TimeSpeedRadioButtonGroup
description: A vertical Aqua radio button group for selecting among the TimeSpeed enumeration values (SLOW, NORMAL, FAST).
category: api
library: scenery-phet
tags: [scenery-phet, TimeSpeedRadioButtonGroup, TimeSpeed]
status: complete
related:
  - /api/scenery-phet/time-control-node
  - /api/axon/enumeration-property
prerequisites:
  - /api/axon/enumeration-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# TimeSpeedRadioButtonGroup

`TimeSpeedRadioButtonGroup` (from `scenerystack/scenery-phet`) is a `VerticalAquaRadioButtonGroup<TimeSpeed>` for choosing a simulation's playback speed. It's driven by the `TimeSpeed` enumeration — `TimeSpeed.SLOW`, `TimeSpeed.NORMAL`, `TimeSpeed.FAST` — each rendered as a localized text label ("Slow"/"Normal"/"Fast"). It's a subcomponent of [`TimeControlNode`](/api/scenery-phet/time-control-node) (passed via that component's `timeSpeedProperty`/`timeSpeeds` options), but is exported and usable standalone.

```ts
import { TimeSpeedRadioButtonGroup, TimeSpeed } from 'scenerystack/scenery-phet';
import { EnumerationProperty } from 'scenerystack/axon';
```

<SceneryDemo demo="time-speed-radio-button-group" />

## A minimal example

```ts
const timeSpeedProperty = new EnumerationProperty( TimeSpeed.NORMAL );

const timeSpeedRadioButtonGroup = new TimeSpeedRadioButtonGroup(
  timeSpeedProperty,
  [ TimeSpeed.NORMAL, TimeSpeed.SLOW ],
  { tandem: tandem.createTandem( 'timeSpeedRadioButtonGroup' ) }
);
```

## Constructor

```ts
new TimeSpeedRadioButtonGroup(
  timeSpeedProperty: EnumerationProperty<TimeSpeed>,
  timeSpeeds: TimeSpeed[],
  providedOptions?: TimeSpeedRadioButtonGroupOptions
)
```

The `timeSpeeds` array controls both *which* speeds get a radio button and the *order* they're listed in — a sim that only ever runs at normal or slow speed (a common PhET pattern) would pass `[ TimeSpeed.NORMAL, TimeSpeed.SLOW ]` and omit `FAST` entirely.

## The `TimeSpeed` enumeration

```ts
class TimeSpeed extends EnumerationValue {
  static readonly FAST: TimeSpeed;
  static readonly NORMAL: TimeSpeed;
  static readonly SLOW: TimeSpeed;
  static readonly enumeration: Enumeration<TimeSpeed>;
}
```

`TimeSpeed` has exactly three values and carries no numeric multiplier itself — mapping `TimeSpeed.SLOW`/`FAST` to an actual time-scale factor (e.g. `0.25`, `1`, `2`) is left entirely to the sim's own step logic; `TimeSpeedRadioButtonGroup` and `TimeControlNode` only manage which value is currently selected.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `radius` | Half the height of a rendered label `Text` | Radius of each Aqua radio button circle, computed so buttons visually match the label text size unless overridden |
| `labelOptions` | `{ font: new PhetFont( 14 ), maxWidth: 130 }` | Options for each speed's `Text` label |
| `spacing` | `9` | Vertical spacing between radio button rows (inherited from `VerticalAquaRadioButtonGroup`) |

::: tip The label-to-`TimeSpeed` mapping is fixed
`TimeSpeedRadioButtonGroup` builds its items from an internal map of `TimeSpeed` to a localized string and PhET-iO tandem name — there's no option to relabel or reorder an individual speed's text. If you need custom labels, build your own `VerticalAquaRadioButtonGroup<TimeSpeed>` directly instead.
:::
