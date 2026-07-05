---
title: Orientation
description: The HORIZONTAL/VERTICAL enumeration threaded through layout code (FlowBox, sliders, bamboo charts) to write orientation-agnostic logic.
category: api
library: phet-core
tags: [phet-core, Orientation, EnumerationValue, layout, enumeration]
status: complete
prerequisites:
  - /api/phet-core/enumeration-value
related:
  - /api/phet-core/enumeration-value
  - /api/bamboo/gridlines-and-tick-marks
  - /api/bamboo/axis-nodes
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Orientation

`Orientation` (from `scenerystack/phet-core`) is a two-valued [`EnumerationValue`](/api/phet-core/enumeration-value) enumeration — `Orientation.HORIZONTAL` and `Orientation.VERTICAL` — used throughout layout-adjacent code (`FlowBox`, sliders, bamboo's [`GridLineSet`/`TickMarkSet`/`TickLabelSet`](/api/bamboo/gridlines-and-tick-marks) and [axis Nodes](/api/bamboo/axis-nodes)) so that logic can be written once and parameterized by orientation, instead of duplicated for the horizontal and vertical cases. Each value carries a bundle of orientation-specific string keys (`'centerX'` vs `'centerY'`, `'left'`/`'right'` vs `'top'`/`'bottom'`, `'preferredWidth'` vs `'preferredHeight'`, …) so you can index into a `Node` or `Bounds2` generically: `node[ orientation.centerCoordinate ] = value` works for either orientation without an `if`.

```ts
import { Orientation } from 'scenerystack/phet-core';
```

## A minimal example

```ts
function centerAlong( node: Node, orientation: Orientation, value: number ): void {
  // For HORIZONTAL this sets node.centerX; for VERTICAL it sets node.centerY.
  node[ orientation.centerCoordinate ] = value;
}

centerAlong( myNode, Orientation.HORIZONTAL, 100 );

// The opposite orientation, useful for "the other axis" logic.
Orientation.HORIZONTAL.opposite === Orientation.VERTICAL; // true

// Build a Vector-like value with the components in the right order for this orientation.
const size = Orientation.VERTICAL.toVector( 10, 20, Vector2 ); // Vector2( 20, 10 ) -- (secondary, primary) for VERTICAL
```

## Values

| Value | Meaning |
| --- | --- |
| `Orientation.HORIZONTAL` | The x-axis / left-right orientation |
| `Orientation.VERTICAL` | The y-axis / top-bottom orientation |

## Members

Every `Orientation` value carries these fields (all set in the constructor, `readonly`):

| Member | `HORIZONTAL` value | `VERTICAL` value |
| --- | --- | --- |
| `coordinate` | `'x'` | `'y'` |
| `centerCoordinate` | `'centerX'` | `'centerY'` |
| `minCoordinate` / `maxCoordinate` | `'minX'` / `'maxX'` | `'minY'` / `'maxY'` |
| `minSide` / `maxSide` | `'left'` / `'right'` | `'top'` / `'bottom'` |
| `minSize` / `maxSize` | `'minWidth'` / `'maxWidth'` | `'minHeight'` / `'maxHeight'` |
| `rectCoordinate` / `rectSize` | `'rectX'` / `'rectWidth'` | `'rectY'` / `'rectHeight'` |
| `flowBoxOrientation` / `ariaOrientation` | `'horizontal'` | `'vertical'` |
| `size` | `'width'` | `'height'` |
| `line` | `'column'` | `'row'` |
| `preferredSize` / `localPreferredSize` | `'preferredWidth'` / `'localPreferredWidth'` | `'preferredHeight'` / `'localPreferredHeight'` |
| `sizable` | `'widthSizable'` | `'heightSizable'` |
| `opposite` | `Orientation.VERTICAL` | `Orientation.HORIZONTAL` |

And these methods:

| Member | Description |
| --- | --- |
| `modelToView( modelViewTransform, value )` / `viewToModel( modelViewTransform, value )` | Calls the transform's `modelToViewX`/`Y` (or `viewToModelX`/`Y`) method matching this orientation |
| `toVector( primary, secondary, VectorType )` | Builds a `VectorType` instance with components in the right slot for this orientation — `(primary, secondary)` for `HORIZONTAL`, `(secondary, primary)` for `VERTICAL` — zero-padded to support up to a 4-component vector type |
| `Orientation.fromLayoutOrientation( 'horizontal' \| 'vertical' )` | Static helper converting a `FlowBox`-style string literal to the matching `Orientation` value |

::: tip Prefer `orientation.opposite` over hardcoding a check
Because `HORIZONTAL.opposite` and `VERTICAL.opposite` are wired up as circular references right after both values are constructed, code that needs "the other axis" (e.g. bamboo's `TickMarkSet`, which positions a tick's tail using `axisOrientation.opposite`) can just read `.opposite` instead of writing `orientation === Orientation.HORIZONTAL ? Orientation.VERTICAL : Orientation.HORIZONTAL`. It also composes correctly if a third orientation value were ever added, which a hardcoded ternary would not.
:::
