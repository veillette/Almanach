---
title: AquaRadioButton
description: A single flat, circular radio button with a label Node, the building block behind AquaRadioButtonGroup.
category: api
library: sun
tags: [sun, AquaRadioButton, RadioButtonGroup]
status: complete
related:
  - /api/sun/aqua-radio-button-group
  - /api/sun/rectangular-radio-button
  - /api/sun/checkbox
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# AquaRadioButton

`AquaRadioButton<T>` (from `scenerystack/sun`) is a single circular radio button styled after macOS' Aqua theme — a ring that fills with a dot when selected — paired with a label `Node` placed to its right. It's the individual button that [`AquaRadioButtonGroup`](/api/sun/aqua-radio-button-group) creates one of per item; you construct it directly only when you need a lone radio-style toggle outside of a managed group (a rare case — [`Checkbox`](/api/sun/checkbox) is almost always the better fit for a single boolean toggle). Compare with [`RectangularRadioButton`](/api/sun/rectangular-radio-button), the boxed equivalent used by `RectangularRadioButtonGroup`.

```ts
import { AquaRadioButton } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

type Shape = 'circle' | 'square';
const shapeProperty = new Property<Shape>( 'circle' );

const circleButton = new AquaRadioButton( shapeProperty, 'circle', new Text( 'Circle' ), {
  tandem: Tandem.REQUIRED
} );
```

The constructor is `( property, value, labelNode, options? )` — `property` must use the default `'reference'` `valueComparisonStrategy` (`AquaRadioButton` compares with `===`), `value` is what gets written to `property` when this button fires, and `labelNode` is vertically centered to the right of the circle. Clicking anywhere on the button or its label sets `property.value = value`; the circle fills in automatically whenever `property.value === value`, from any source.

<SceneryDemo demo="aqua-radio-button" />

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `radius` | `7` | Radius of the circular button |
| `selectedColor` / `deselectedColor` | `'rgb( 143, 197, 250 )'` / `'white'` | Fill of the outer ring in each state |
| `centerColor` | `'black'` | Fill of the inner dot shown when selected |
| `stroke` | `'black'` | Stroke of the outer ring |
| `xSpacing` | `8` | Space between the button and `labelNode` |
| `soundPlayer` | first selection sound | Usually left to `AquaRadioButtonGroup`, which assigns one per index |
| `touchAreaXDilation` / `touchAreaYDilation` | `0` / `0` | Expand the touch hit area beyond the visual bounds |
| `a11yNameAttribute` | `null` | The shared `name` attribute the browser uses to group native radio inputs — set automatically by `AquaRadioButtonGroup` |

::: warning A lone `AquaRadioButton` isn't a complete radio group
A single `AquaRadioButton` fires and updates correctly on its own, but radio semantics (arrow-key navigation, mutual exclusivity across several buttons, a shared `a11yNameAttribute`) come from wrapping several of them in [`AquaRadioButtonGroup`](/api/sun/aqua-radio-button-group). If you're presenting more than one option, construct the group rather than several standalone `AquaRadioButton`s.
:::
