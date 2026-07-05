---
title: BannedNode
description: The universal "no"/prohibition icon — a circle with a diagonal slash through it.
category: api
library: scenery-phet
tags: [scenery-phet, BannedNode, icon, prohibition]
status: complete
related:
  - /api/scenery-phet/stop-sign-node
  - /api/scenery/circle
  - /api/scenery/line
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# BannedNode

`BannedNode` (from `scenerystack/scenery-phet`) draws the universal "no" or prohibition symbol — a stroked circle with a diagonal line through it, as seen on "no entry" road signs (see [the Wikipedia article on the no symbol](https://en.wikipedia.org/wiki/No_symbol)). It's a static icon Node with no interactive behavior or bound Property: construct it, style it, and use it wherever a design calls for "this action/state is disallowed" — for example, disabling a tool or indicating an invalid configuration. For the octagonal red "stop" icon instead of the circle-slash icon, see [`StopSignNode`](/api/scenery-phet/stop-sign-node).

```ts
import { BannedNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const bannedIcon = new BannedNode( {
  radius: 16,
  stroke: 'red',
  lineWidth: 4
} );

toolboxIcon.addChild( bannedIcon );
```

## Constructor

```ts
new BannedNode( providedOptions?: BannedNodeOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `radius` | `20` | Radius of the circle (and half the length of the diagonal slash) |
| `stroke` | `'red'` | Stroke color of both the circle and the slash |
| `lineWidth` | `5` | Stroke width of both the circle and the slash |
| `fill` | `null` | Fill of the circle's interior; `null` leaves it transparent |

`BannedNodeOptions` also accepts every plain `NodeOptions` field (`scale`, `opacity`, `visible`, …) except `children`, which is set internally.

::: tip The circle and slash always share `stroke` and `lineWidth`
There's no way to give the circle and the diagonal line independent colors or weights — both options apply to both shapes. If you need mismatched styling, compose your own `Circle` + `Line` pair instead of using `BannedNode`.
:::
