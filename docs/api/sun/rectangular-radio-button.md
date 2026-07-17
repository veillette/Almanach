---
title: RectangularRadioButton
description: A single boxed radio button, the building block behind RectangularRadioButtonGroup.
category: api
library: sun
tags: [sun, RectangularRadioButton, RadioButtonGroup]
status: complete
related:
  - /api/sun/radio-button-group
  - /api/sun/aqua-radio-button
  - /api/sun/rectangular-push-button
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# RectangularRadioButton

`RectangularRadioButton<T>` (from `scenerystack/sun/buttons`, re-exported from `scenerystack/sun`) is a single boxed, flat-appearance button that changes a `Property<T>` to a fixed value when pressed and shows itself as "selected" when the Property already equals that value. It's the individual button [`RectangularRadioButtonGroup`](/api/sun/radio-button-group) creates one of per item — you construct it directly only for a standalone boxed toggle outside of a managed group. Compare with [`AquaRadioButton`](/api/sun/aqua-radio-button), the flat circular equivalent used by `AquaRadioButtonGroup`.

```ts
import { RectangularRadioButton } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

type Shape = 'circle' | 'square';
const shapeProperty = new Property<Shape>( 'circle' );

const circleButton = new RectangularRadioButton( shapeProperty, 'circle', {
  content: new Text( 'Circle' ),
  tandem: Tandem.REQUIRED
} );
```

The constructor is `( property, value, options? )` — unlike `AquaRadioButton`, there's no dedicated label argument; the button's own visible content is set via the `content` option (inherited from `RectangularButton`), same as any other rectangular button. `property` must use the default `'reference'` `valueComparisonStrategy` (`RectangularRadioButton` compares with `===`).

<SceneryDemo demo="rectangular-radio-button-group" />

## Options

`RectangularRadioButtonOptions` is `RectangularButtonOptions` with a few PhET-iO/accessibility-only options trimmed off (they don't make sense on a single radio button — e.g. `enabledProperty`), plus:

| Option | Default | Effect |
| --- | --- | --- |
| `content` | — | The `Node` shown inside the button (icon, `Text`, …) |
| `baseColor` | `ColorConstants.LIGHT_BLUE` | Fill color, modulated by selection/hover/press state |
| `soundPlayer` | `null` (falls back to the shared `'pushButton'` sound) | Sound played when this button is pressed |
| `buttonAppearanceStrategy` | `RectangularRadioButton.FlatAppearanceStrategy` | How fill/stroke/opacity change across selected/deselected/over/pressed states |
| `contentAppearanceStrategy` | `RectangularRadioButton.ContentAppearanceStrategy` | How the `content` Node's opacity changes across those same states |

`buttonAppearanceStrategyOptions` on `FlatAppearanceStrategy` controls the specific stroke/opacity values per state — see [Radio Button Groups](/api/sun/radio-button-group) for the more commonly used group-level `radioButtonOptions` that forward into these.

::: tip You'll rarely reach for this class directly
Almost all boxed-radio-button UI in a simulation goes through [`RectangularRadioButtonGroup`](/api/sun/radio-button-group), which handles laying out several `RectangularRadioButton`s, giving them a shared `property`, sizing them uniformly, and wiring up keyboard navigation between them. Construct `RectangularRadioButton` directly only when you need exactly one boxed toggle outside that managed layout.
:::
