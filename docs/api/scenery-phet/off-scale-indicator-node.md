---
title: OffScaleIndicatorNode
description: A labeled arrow-in-a-panel indicator that points toward data which has gone off the edge of a plot.
category: api
library: scenery-phet
tags: [scenery-phet, OffScaleIndicatorNode, plot, chart, accessibility]
status: complete
related:
  - /api/scenery-phet/arrow-node
  - /accessibility/voicing
  - /api/sun/panel
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# OffScaleIndicatorNode

`OffScaleIndicatorNode` (from `scenerystack/scenery-phet`) is a small `Panel` containing a text label and an `ArrowNode`, used to tell the user that a data point (or points) has gone off the visible edge of a plot — "points off scale," with an arrow pointing in whichever direction the data actually went. It's a static display component: you construct one per direction you need to support and toggle its `visible` property based on your model's state; it doesn't track any Property itself.

```ts
import { OffScaleIndicatorNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const offScaleUpIndicator = new OffScaleIndicatorNode( 'up', {
  arrowTailLength: 20
} );
offScaleUpIndicator.visible = false;

// Later, when the model detects an out-of-range point:
offScaleUpIndicator.visible = pointsAreAboveChartTop;
```

For every direction except `'right'`, the arrow is placed to the left of the text; for `'right'`, the text comes first and the arrow points away to the right — so the arrow always points outward, away from the label, toward the edge of the plot it corresponds to.

## Constructor

```ts
new OffScaleIndicatorNode( direction: 'left' | 'right' | 'up' | 'down', providedOptions?: OffScaleIndicatorNodeOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `offScaleStringProperty` | PhET's built-in "points off scale" string | The label text; supply your own `TReadOnlyProperty<string>` to customize or localize it further |
| `arrowTailLength` | `25` | Length of the arrow's tail, oriented according to `direction` |
| `spacing` | `5` | Spacing between the label and the arrow inside the `HBox` |
| `arrowNodeOptions` | `{ tailWidth: 2 }` | Options forwarded to the internal `ArrowNode` |
| `richTextOptions` | `{ font: new PhetFont(14), maxWidth: 100, maxHeight: 50, align: 'left' }` | Options forwarded to the internal `RichText` label |
| `panelOptions` | `{ fill: 'white', stroke: 'black', cornerRadius: 3 }` | Options forwarded to the wrapping `Panel` |

## Accessibility

`OffScaleIndicatorNode` mixes in Scenery's `ReadingBlock` trait, so it's voicing-ready out of the box: if you don't supply `accessibleParagraph`, it derives one automatically from `direction` (e.g. "points off scale, up"), and `readingBlockNameResponse` defaults to that same string unless overridden. See [Voicing](/accessibility/voicing) for how `ReadingBlock` fits into PhET's broader accessibility story.

::: tip Direction controls layout and default text — it can't be changed after construction
`direction` is a constructor parameter, not a settable property, because it determines which side the arrow renders on and drives the default accessible paragraph. To point in a different direction, construct a new `OffScaleIndicatorNode` (typically PhET sims keep one instance per direction and toggle `visible`, rather than reusing a single instance).
:::
