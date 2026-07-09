---
title: ToggleSwitch
description: The generic two-value sliding switch that OnOffSwitch specializes to boolean on/off.
category: api
library: sun
tags: [sun, ToggleSwitch, OnOffSwitch]
status: complete
related:
  - /api/sun/on-off-switch
  - /api/sun/checkbox
  - /api/sun/toggle-button
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ToggleSwitch

`ToggleSwitch<T>` (from `scenerystack/sun`) is the generic iOS-style sliding switch that [`OnOffSwitch`](/api/sun/on-off-switch) specializes: rather than being fixed to `false`/`true`, `ToggleSwitch` takes any two values of type `T` and slides between them. Reach for `ToggleSwitch` directly when the two states aren't naturally boolean (e.g. two named modes) but should still read visually as an on/off-style switch; use `OnOffSwitch` for ordinary boolean toggles, since it communicates intent more directly and removes two constructor arguments.

```ts
import { ToggleSwitch } from 'scenerystack/sun';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

type Units = 'metric' | 'imperial';
const unitsProperty = new Property<Units>( 'metric' );

const unitsSwitch = new ToggleSwitch( unitsProperty, 'metric', 'imperial', {
  tandem: Tandem.REQUIRED
} );
```

<SceneryDemo demo="toggle-switch" />

The constructor is `( property, leftValue, rightValue, options? )` — the switch renders on the left when `property.value === leftValue` and on the right when it equals `rightValue`. As with [`OnOffSwitch`](/api/sun/on-off-switch), `property` must use the default `'reference'` `valueComparisonStrategy`, since `ToggleSwitch` compares with `===`.

## Interaction

Clicking anywhere on the switch toggles between `leftValue`/`rightValue`; dragging the thumb past the track's midpoint and releasing snaps to the closer side; dragging far enough outside the track toggles the value immediately, even before release. This is exactly the interaction [`OnOffSwitch`](/api/sun/on-off-switch) documents, since `OnOffSwitch` is a thin subclass with `leftValue`/`rightValue` fixed to `false`/`true`.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `size` | `60 x 30` | `Dimension2` for the switch; use `2 x height` for width for a circular-looking thumb |
| `trackFillLeft` / `trackFillRight` | computed gradient | Track fill in each state |
| `thumbFill` / `thumbStroke` | computed gradient / `'black'` | Thumb appearance |
| `toggleWhileDragging` | `null` | `null`: iOS-style, change on far drag; `true`: change as soon as the thumb crosses center; `false`: only change on release |
| `dragThreshold` | `3` | View-space distance a drag must cover before it's treated as a drag rather than a click/tap |
| `toggleThreshold` | `1` | Thumb-widths past the track edge before dragging immediately toggles the value |
| `thumbTouchAreaXDilation` / `thumbTouchAreaYDilation` | `8` / `8` | Expand the thumb's touch hit area |
| `accessibleSwitch` | `true` | Adds `role="switch"` plus `aria-pressed`/`aria-checked` PDOM semantics |
| `accessibleContextResponseLeftValue` / `accessibleContextResponseRightValue` | `null` | Spoken/announced responses when the switch lands on each side |

::: tip `OnOffSwitch` is almost always what you want
`scenerystack/sun` gives boolean toggles three different affordances — see the comparison table on the [`OnOffSwitch`](/api/sun/on-off-switch) page. `ToggleSwitch` exists underneath `OnOffSwitch` mainly so a two-non-boolean-value switch has somewhere to come from; for `true`/`false` state, use `OnOffSwitch` directly.
:::
