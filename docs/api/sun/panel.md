---
title: Panel
description: A bordered/background container used to group related controls.
category: api
library: sun
tags: [sun, Panel]
status: verified
related:
  - /api/sun/accordion-box
  - /api/sun/checkbox
  - /api/sun/hslider
  - /styling/panels-and-backgrounds
prerequisites:
  - /guides/scenery-basics
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Panel

`Panel` (from `scenerystack/sun`) draws a rounded, stroked/filled rectangle around a single content `Node`, resizing itself automatically as the content's bounds change. It's the standard way to visually group related controls — a cluster of checkboxes, a slider with its label — into one bordered region.

```ts
import { Panel } from 'scenerystack/sun';
import { VBox, Text } from 'scenerystack/scenery';
import { Checkbox } from 'scenerystack/sun';

const controls = new VBox( {
  spacing: 8,
  align: 'left',
  children: [
    new Text( 'Options' ),
    new Checkbox( gravityEnabledProperty, new Text( 'Gravity' ), { tandem: Tandem.REQUIRED } )
  ]
} );

const controlPanel = new Panel( controls, {
  fill: '#f0f0f0',
  stroke: 'black',
  xMargin: 10,
  yMargin: 10
} );
```

`Panel` takes exactly one content `Node` — group multiple controls with a layout container (`VBox`, `HBox`, `GridBox`, …) first, then wrap that container in a `Panel`.

## Options

| Option | Effect |
| --- | --- |
| `fill` | Background fill (default `'white'`) |
| `stroke` | Border color (default `'black'`) |
| `lineWidth` | Border width (default `1`) |
| `xMargin` / `yMargin` | Space between content and the background edge (default `5` each) |
| `cornerRadius` | Rounded-corner radius (default `10`) |
| `align` | Horizontal alignment of content when it's narrower than `minWidth`: `'left'` (default) \| `'center'` \| `'right'` |
| `minWidth` / `minHeight` | Minimum panel size, even if content is smaller |
| `resize` | If `false`, the panel stops automatically resizing when content bounds change (default `true`) |

## Changing fill/stroke after construction

```ts
controlPanel.fill = '#e0e0e0';
controlPanel.stroke = null; // no border
```

`fill` and `stroke` are both plain getter/setter properties (backed by `setFill`/`getFill`, `setStroke`/`getStroke`).

::: tip `align` only matters when the panel is wider than its content
If content already fills the panel's `minWidth`, all three `align` values look identical — `align` only becomes visible when `minWidth` (or a sibling panel's wider content, if you're manually matching widths) forces extra horizontal space.
:::
