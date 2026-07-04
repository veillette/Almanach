---
title: Rectangle
description: A Path subclass for drawing (optionally rounded) rectangles.
category: api
library: scenery
tags: [scenery, Rectangle, Path]
status: verified
related:
  - /api/scenery/path
  - /api/scenery/circle
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Rectangle

`Rectangle` (from `scenerystack/scenery`) is a [`Path`](/api/scenery/path) subclass that builds its own rectangular (optionally rounded) `Shape` from `x`/`y`/`width`/`height` parameters, so you don't need to construct a kite `Shape` by hand for plain or rounded rectangles.

```ts
import { Rectangle } from 'scenerystack/scenery';
import { Bounds2 } from 'scenerystack/dot';

// new Rectangle( x, y, width, height, options )
const panel = new Rectangle( 0, 0, 200, 100, {
  fill: '#eee',
  stroke: 'black',
  lineWidth: 1
} );

// new Rectangle( x, y, width, height, cornerXRadius, cornerYRadius, options )
const roundedPanel = new Rectangle( 0, 0, 200, 100, 8, 8, { fill: '#eee' } );

// new Rectangle( bounds, options )
const fromBounds = new Rectangle( new Bounds2( 0, 0, 200, 100 ), { fill: 'white' } );

panel.rectWidth = 220; // resize after construction
```

## Constructor overloads

| Signature | Use case |
| --- | --- |
| `new Rectangle( options )` | Fully options-driven |
| `new Rectangle( bounds, options? )` | From a `Bounds2` |
| `new Rectangle( bounds, cornerXRadius, cornerYRadius, options? )` | From a `Bounds2` with rounded corners |
| `new Rectangle( x, y, width, height, options? )` | Explicit geometry |
| `new Rectangle( x, y, width, height, cornerXRadius, cornerYRadius, options? )` | Explicit geometry, rounded corners |

## Options

| Option | Effect |
| --- | --- |
| `rectBounds` | Sets `x`/`y`/`width`/`height` at once from a `Bounds2` |
| `rectSize` | Sets `width`/`height` at once from a `Dimension2` |
| `rectX`, `rectY` | Top-left corner position |
| `rectWidth`, `rectHeight` | Dimensions |
| `cornerRadius` | Sets both `cornerXRadius` and `cornerYRadius` together |
| `cornerXRadius`, `cornerYRadius` | Independent horizontal/vertical radii for elliptical rounded corners |

`Rectangle` also accepts every [`Path` option](/api/scenery/path) (`fill`, `stroke`, `lineWidth`, …) except `shape`/`shapeProperty`, plus the full set of [`Node` options](/api/scenery/node) — including layout sizing, since `Rectangle` mixes in `Sizable` and can be given a `preferredWidth`/`preferredHeight` by a parent layout container.

::: tip Resizing without rebuilding the shape
Prefer `rectWidth`/`rectHeight`/`rectX`/`rectY`/`rectBounds` over recreating the `Rectangle` or setting `.shape` directly — these setters update the internal shape efficiently and are what layout containers use when they resize a `Rectangle` child.
:::
