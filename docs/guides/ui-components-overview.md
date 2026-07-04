---
title: UI Components Overview
description: Tour of the sun and scenery-phet component libraries and when to reach for each.
category: guides
tags: [sun, scenery-phet, ui-components]
status: complete
related:
  - /guides/scenery-layout
  - /patterns/reset-all-pattern
  - /api/sun/checkbox
  - /api/sun/hslider
  - /api/sun/panel
  - /api/sun/accordion-box
  - /api/sun/combo-box
  - /api/sun/rectangular-push-button
  - /api/sun/radio-button-group
  - /api/scenery-phet/reset-all-button
  - /api/scenery-phet/number-control
  - /api/scenery-phet/thermometer-node
  - /api/scenery-phet/arrow-node
prerequisites:
  - /guides/scenery-basics
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# UI Components Overview

SceneryStack splits reusable, pre-built `Node`s across two libraries with different scopes: `sun` provides generic, domain-agnostic controls (the things any application needs — buttons, sliders, checkboxes), while `scenery-phet` provides PhET-simulation-specific visualizations and controls built on top of `sun` and `scenery`. Knowing which library a component lives in tells you how broadly reusable it's meant to be.

## `sun`: generic UI controls

Everything in `sun` is bound to an axon `Property` and otherwise has no domain knowledge — a `Checkbox` doesn't know or care whether it's toggling gravity or sound.

```ts
import { Checkbox, HSlider, RectangularPushButton, ComboBox, AccordionBox, Panel } from 'scenerystack/sun';
```

| Component | Use it for |
| --- | --- |
| [`Checkbox`](/api/sun/checkbox) | A single boolean toggle with a label Node |
| [`HSlider`](/api/sun/hslider) / `VSlider` | Continuous numeric input bound to a `NumberProperty` and `Range` |
| [`RectangularPushButton`](/api/sun/rectangular-push-button) / `TextPushButton` | A momentary action button |
| `RectangularRadioButtonGroup` / [`RadioButtonGroup`](/api/sun/radio-button-group) | Mutually-exclusive selection from a small fixed set of options |
| [`ComboBox`](/api/sun/combo-box) | Mutually-exclusive selection from a longer list, in a dropdown |
| [`Panel`](/api/sun/panel) | Bordered/background container that auto-sizes to its content |
| [`AccordionBox`](/api/sun/accordion-box) | Collapsible titled container, e.g. an optional "advanced controls" section |
| `ABSwitch` / `ToggleSwitch` | A labeled two-state switch, an alternative to `Checkbox` for some layouts |

Compose these with [`FlowBox`/`GridBox`](/guides/scenery-layout) rather than positioning each one by hand:

```ts
import { VBox } from 'scenerystack/scenery';
import { Checkbox, HSlider } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';

const controlPanel = new VBox( {
  spacing: 8,
  align: 'left',
  children: [
    new Checkbox( gravityEnabledProperty, new Text( 'Gravity' ) ),
    new HSlider( massProperty, massProperty.range! )
  ]
} );
```

## `scenery-phet`: simulation-specific visualizations

`scenery-phet` builds on `sun` and `scenery` to provide components that show up across many PhET simulations but aren't generic enough for `sun` — visual metaphors for physical quantities, and the handful of controls every sim needs regardless of subject matter.

```ts
import { ResetAllButton, NumberControl, ThermometerNode, ArrowNode, PhetFont } from 'scenerystack/scenery-phet';
```

| Component | Use it for |
| --- | --- |
| [`ResetAllButton`](/api/scenery-phet/reset-all-button) | The standard "reset the whole screen" button — see the [Reset-All Pattern](/patterns/reset-all-pattern) |
| [`NumberControl`](/api/scenery-phet/number-control) | A labeled slider plus numeric readout plus increment/decrement, bundled together |
| [`ThermometerNode`](/api/scenery-phet/thermometer-node) | A fluid-level thermometer bound to a temperature `Property` |
| [`ArrowNode`](/api/scenery-phet/arrow-node) | A vector/force-style arrow, sized and rotated from model data |
| `FaceNode` | A smiley/frowny face, common in game-style feedback |
| `HeaterCoolerNode` | The heater/cooler control used across thermodynamics sims |
| [`PhetFont`](/api/scenery-phet/phet-font) | The standard PhET typeface — use it instead of ad hoc `font` strings for visual consistency |

## Choosing between them

::: tip If it doesn't mention a physical quantity, it probably belongs in `sun`
A rule of thumb: if you can describe a component without referencing anything domain-specific ("a checkbox," "a slider," "a bordered panel"), it's `sun`. If describing it requires a physical concept ("a thermometer," "a force arrow," "a heater/cooler"), it's `scenery-phet`. When you need something novel to your sim's domain that isn't in either library, build it as a plain `Node`/`Path` composition in your own `view/` folder rather than trying to force-fit an existing component — see [Project Structure Conventions](/getting-started/project-structure-conventions).
:::

## Where to go next

- [Scenery Layout](/guides/scenery-layout) — arranging these components with `FlowBox`/`GridBox`/`AlignBox`
- [The Reset-All Pattern](/patterns/reset-all-pattern) — the standard use of `ResetAllButton`
- [Building Your First Screen](/guides/building-your-first-screen) — assembling these into a full `ScreenView`
