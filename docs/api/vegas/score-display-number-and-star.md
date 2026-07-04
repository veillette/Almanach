---
title: ScoreDisplayNumberAndStar
description: A compact vegas score display showing a number and a single star, used where space is tight (e.g. inside a LevelSelectionButton).
category: api
library: vegas
tags: [vegas, ScoreDisplayNumberAndStar, score, game, HBox]
status: complete
related:
  - /api/vegas/level-selection-button
  - /api/vegas/game-audio-player
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ScoreDisplayNumberAndStar

`ScoreDisplayNumberAndStar` (from `scenerystack/vegas`) is an `HBox` that renders a score as "`N` ★" — a number followed by a single star icon. When the score is `0`, the number is omitted and the star is drawn grayed-out (empty). It's a compact alternative to `ScoreDisplayStars` (which draws one star per point) for contexts where space is limited, such as inside a [`LevelSelectionButton`](/api/vegas/level-selection-button)'s `createScoreDisplay` option.

```ts
import { ScoreDisplayNumberAndStar } from 'scenerystack/vegas';
import { NumberProperty } from 'scenerystack/axon';
```

## A minimal example

```ts
const scoreProperty = new NumberProperty( 0 );

const scoreDisplay = new ScoreDisplayNumberAndStar( scoreProperty, {
  font: new PhetFont( 20 ),
  scoreDecimalPlaces: 0
} );
```

The display listens to `scoreProperty` directly and rebuilds its children whenever the score changes — there's no separate `update()` call to make.

## Constructor

```ts
new ScoreDisplayNumberAndStar( scoreProperty: ReadOnlyProperty<number>, providedOptions?: ScoreDisplayNumberAndStarOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `font` | `StatusBar.DEFAULT_FONT` | Font for the numeric text |
| `textFill` | `'black'` | Fill color for the numeric text |
| `scoreDecimalPlaces` | `0` | Decimal places shown for the score number |
| `starNodeOptions` | `{ starShapeOptions: { outerRadius: 10, innerRadius: 5 }, filledLineWidth: 1.5, emptyLineWidth: 1.5 }` | Forwarded to the internal `StarNode` |
| `spacing` (HBox) | `5` | Horizontal space between the number and the star |

::: tip It's an HBox, so it participates in layout like any other Node
`ScoreDisplayNumberAndStar extends HBox` — you can set `maxWidth`/`maxHeight` on it to constrain it inside a fixed-size background (which is exactly how `LevelSelectionButton` uses it), and its `boundsProperty` fires whenever the score changes and the child count (0 vs. 2 children) flips.
:::
