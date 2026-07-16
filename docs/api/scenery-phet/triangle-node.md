---
title: TriangleNode
description: An equilateral or isosceles triangle Path, pointing in any of the four cardinal directions.
category: api
library: scenery-phet
tags: [scenery-phet, TriangleNode, triangle, shape, marker]
status: complete
related:
  - /api/scenery-phet/x-node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# TriangleNode

`TriangleNode` (from `scenerystack/scenery-phet`) draws a triangle `Path` — equilateral if `triangleWidth` and `triangleHeight` produce one, isosceles otherwise — pointing up by default, with its point drawn perpendicular from the midpoint of its base. It's a lightweight alternative to building the same `Shape` by hand whenever you need a simple triangular marker, arrowhead, or indicator.

```ts
import { TriangleNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const arrowHead = new TriangleNode( {
  pointDirection: 'right',
  triangleWidth: 20,
  triangleHeight: 16,
  fill: 'black'
} );
```

<SceneryDemo demo="triangle-node" />

## Constructor

```ts
new TriangleNode( providedOptions?: TriangleNodeOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `pointDirection` | `'up'` | Which way the triangle's point faces: `'up'`, `'down'`, `'left'`, `'right'` |
| `triangleWidth` | `15` | Width of the base (before rotation for `pointDirection`) |
| `triangleHeight` | `13` | Altitude from the base to the point |
| `stroke` (inherited `PathOptions`) | `'black'` | Outline color |
| `lineWidth` (inherited `PathOptions`) | `1` | Outline width |
| `cursor` (inherited `NodeOptions`) | `'pointer'` | Default cursor, since `TriangleNode` is commonly used as a clickable indicator |

::: tip `rotation` and `shape` are not accepted as options
`TriangleNodeOptions` omits `rotation`, `shape`, and `shapeProperty` from the underlying `PathOptions` — the triangle's shape is always built internally from `triangleWidth`/`triangleHeight`, and its orientation is controlled only through `pointDirection`. Setting `.rotation` on an instance afterward will rotate it away from the cardinal direction `pointDirection` implies.
:::
