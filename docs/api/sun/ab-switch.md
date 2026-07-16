---
title: ABSwitch
description: A labeled two-option toggle switch bound to a Property over exactly two named values.
category: api
library: sun
tags: [sun, ABSwitch, HBox]
status: complete
related:
  - /api/sun/on-off-switch
  - /api/sun/checkbox
  - /api/scenery/h-box
prerequisites:
  - /api/sun/on-off-switch
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ABSwitch

`ABSwitch<T>` (from `scenerystack/sun`) is an [`HBox`](/api/scenery/h-box) that lays out a label, a sliding switch, and a second label, bound to a `Property<T>` that takes exactly two named values — "choice A" on the left, "choice B" on the right. It's built on the same internal `ToggleSwitch<T>` as [`OnOffSwitch`](/api/sun/on-off-switch), but where `OnOffSwitch` is fixed to `boolean` and has no labels of its own, `ABSwitch` is generic over `T` and requires you to supply a `Node` label for each side — appropriate whenever the two choices need to be named rather than just "on"/"off" (units, difficulty levels, view modes, …).

```ts
import { ABSwitch } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

const unitsProperty = new Property<'metric' | 'imperial'>( 'metric' );

const unitsSwitch = new ABSwitch(
  unitsProperty,
  'metric', new Text( 'cm', { tandem: Tandem.REQUIRED.createTandem( 'metricLabelText' ) } ),
  'imperial', new Text( 'in', { tandem: Tandem.REQUIRED.createTandem( 'imperialLabelText' ) } ),
  { tandem: Tandem.REQUIRED }
);
```

The constructor takes `( property, valueA, labelA, valueB, labelB, options? )` — clicking either label selects its value directly (via an internal [`PressListener`](/api/scenery/fire-listener) on each label), and dragging or clicking the switch itself behaves like `OnOffSwitch`'s underlying `ToggleSwitch` (click anywhere to toggle, drag past the midpoint and release to snap, or drag far enough to toggle immediately).

<SceneryDemo demo="ab-switch" />

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `toggleSwitchOptions` | `{}` | Options forwarded to the internal `ToggleSwitch<T>` (`size`, `trackFillLeft`/`trackFillRight`, `thumbFill`, `toggleWhileDragging`, …) — see [`OnOffSwitch`](/api/sun/on-off-switch) for the full set |
| `setLabelEnabled` | Dims the unselected label to `SceneryConstants.DISABLED_OPACITY` | `( labelNode, enabled ) => void` — customize how the non-selected (or, when the whole switch is disabled, both) label looks |
| `valueAAccessibleName` / `valueBAccessibleName` | `null` (derived from the label Nodes if omitted) | Accessible names used to build the switch's combined accessible name, e.g. `"cm, Switch to in"` |
| `centerOnSwitch` | `false` | If `true`, both labels are wrapped in same-size `AlignBox`es (via a shared `AlignGroup`) so `this.center` lands on the switch itself rather than the visual center of the whole row |
| ...plus any [`HBox`](/api/scenery/h-box) option | `spacing: 8`, `cursor: 'pointer'` | `ABSwitch` *is* an `HBox`, so `spacing`, `align`, `justify`, etc. all apply to the label/switch/label row |

## Public API

| Member | Meaning |
| --- | --- |
| `onInputEmitter` | `TEmitter` that fires after the bound `Property`'s value actually changes as a result of user input (clicking a label, or dragging/clicking the switch) — not fired for programmatic changes to the Property |

::: warning Both label Nodes need their own tandem, and the Property must use reference equality
`ABSwitch` asserts that `labelA.tandem` and `labelB.tandem` are set (they need their own PhET-iO identity, since each gets a `PressListener` attached), and — same requirement as `OnOffSwitch` — that `property.valueComparisonStrategy === 'reference'`, since it compares `property.value` against `valueA`/`valueB` with `===`.
:::
