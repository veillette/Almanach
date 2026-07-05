---
title: PaperAirplaneNode and SimpleClockIcon
description: Two small, static decorative icon Nodes — the PhET-logo paper airplane, and a plain analog clock face.
category: api
library: scenery-phet
tags: [scenery-phet, PaperAirplaneNode, SimpleClockIcon, icon]
status: complete
related:
  - /api/scenery-phet/phet-font
  - /api/scenery/circle
  - /api/scenery/path
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PaperAirplaneNode and SimpleClockIcon

`PaperAirplaneNode` and `SimpleClockIcon` (both from `scenerystack/scenery-phet`) are two small, unrelated, non-interactive icon Nodes. They're grouped on this page because each is a single self-contained shape with no state to bind to — construct once, style with ordinary options, done. `SimpleClockIcon` in particular never animates or ticks; it's a frozen decorative face, not a live clock.

```ts
import { PaperAirplaneNode, SimpleClockIcon } from 'scenerystack/scenery-phet';
```

## PaperAirplaneNode

`PaperAirplaneNode extends Path` and draws the exact paper-airplane silhouette used in the PhET logo, traced from the coordinates in PhET's logo artwork file. It's a fixed shape — there's no way to change its proportions, only how it's painted and transformed like any other `Path`.

```ts
const airplaneIcon = new PaperAirplaneNode( {
  scale: 0.5
} );
```

| Option | Default | Effect |
| --- | --- | --- |
| `fill` | `PhetColorScheme.PHET_LOGO_YELLOW` | Fill color; override for a monochrome or themed variant |

`PaperAirplaneNodeOptions` also accepts any other `PathOptions` (`stroke`, `opacity`, `scale`, …). Because the underlying shape is fixed, resize it with `scale` rather than trying to pass width/height options — there are none.

## SimpleClockIcon

`SimpleClockIcon extends Node` and draws a plain circular clock face — an outer circle, a small center dot, and two clock hands frozen at a fixed "4 o'clock" position. It's intended purely as a visual stand-in for "this represents time" (e.g. a button icon), not as a live or interactive clock face.

```ts
const clockIcon = new SimpleClockIcon( 20, {
  fill: 'white',
  stroke: 'black',
  lineWidth: 2
} );
```

## Constructor

```ts
new SimpleClockIcon( radius: number, providedOptions?: SimpleClockIconOptions )
```

| Option | Default | Effect |
| --- | --- | --- |
| `fill` | `'white'` | Fill of the clock face circle |
| `stroke` | `'black'` | Stroke of the face circle, the center dot's fill, and both hands |
| `lineWidth` | `2` | Stroke width of both clock hands |

::: tip The hands are permanently fixed at "4 o'clock"
`SimpleClockIcon` has no Property, no animation, and no way to point the hands at an arbitrary time — the hour and minute hand angles are hard-coded. If you need a clock that reflects live simulation time, build a dedicated animated Node instead; use `SimpleClockIcon` only where a generic "clock" glyph is all that's needed.
:::
