---
title: ScoreDisplay Family
description: The three sibling score-display Nodes alongside ScoreDisplayNumberAndStar -- a plain labeled number, a labeled star row, and a bare star row.
category: api
library: vegas
tags: [vegas, ScoreDisplayLabeledNumber, ScoreDisplayLabeledStars, ScoreDisplayStars, score, game, HBox]
status: verified
prerequisites:
  - /api/vegas/score-display-number-and-star
related:
  - /api/vegas/score-display-number-and-star
  - /api/vegas/status-bars
  - /api/vegas/level-completed-node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/reference/
---

# ScoreDisplay Family

`ScoreDisplayLabeledNumber`, `ScoreDisplayLabeledStars`, and `ScoreDisplayStars` (all from `scenerystack/vegas`) are three more ways to render a score, siblings of the compact [`ScoreDisplayNumberAndStar`](/api/vegas/score-display-number-and-star). All four share the same basic contract — a `ReadOnlyProperty<number>` in, a `Node` (usually an `HBox`) out, redrawing whenever the score `Property` changes — and differ only in how much text/how many stars they show:

| Class | Renders | Extends |
| --- | --- | --- |
| `ScoreDisplayLabeledNumber` | `"Score: N"` (a single localized, formatted number) | `Node` |
| `ScoreDisplayLabeledStars` | `"Score:" ` followed by a `ScoreDisplayStars` row | `HBox` |
| `ScoreDisplayStars` | A row of `numberOfStars` `StarNode`s, filled/partially-filled/empty according to `score / perfectScore` | `HBox` |
| `ScoreDisplayNumberAndStar` (see [its own page](/api/vegas/score-display-number-and-star)) | `"N ★"` — a number plus a single star | `HBox` |

```ts
import { ScoreDisplayLabeledNumber, ScoreDisplayLabeledStars, ScoreDisplayStars } from 'scenerystack/vegas';
import { NumberProperty } from 'scenerystack/axon';
```

## A minimal example

```ts
const scoreProperty = new NumberProperty( 6 );

// "Score: 6"
const labeledNumber = new ScoreDisplayLabeledNumber( scoreProperty );

// "Score:" + a row of stars
const labeledStars = new ScoreDisplayLabeledStars( scoreProperty, {
  scoreDisplayStarsOptions: { numberOfStars: 10, perfectScore: 10 }
} );

// Just the star row, no label -- e.g. for LevelCompletedNode's progress indicator
const bareStars = new ScoreDisplayStars( scoreProperty, {
  numberOfStars: 10,
  perfectScore: 10
} );
```

## Constructors

```ts
new ScoreDisplayLabeledNumber( scoreProperty: ReadOnlyProperty<number>, providedOptions?: ScoreDisplayLabeledNumberOptions )
new ScoreDisplayLabeledStars( scoreProperty: ReadOnlyProperty<number>, providedOptions?: ScoreDisplayLabeledStarsOptions )
new ScoreDisplayStars( scoreProperty: ReadOnlyProperty<number>, providedOptions?: ScoreDisplayStarsOptions )
```

## Options

| Option | Class | Default | Effect |
| --- | --- | --- | --- |
| `font` / `textFill` | `ScoreDisplayLabeledNumber`, `ScoreDisplayLabeledStars` | `StatusBar.DEFAULT_FONT` / `'black'` | Styling for the "Score: N" or "Score:" text |
| `scoreDecimalPlaces` | `ScoreDisplayLabeledNumber` | `0` | Decimal places shown for the number |
| `scoreDisplayStarsOptions` | `ScoreDisplayLabeledStars` | `undefined` | Forwarded to the internal `ScoreDisplayStars` (e.g. `numberOfStars`, `perfectScore`) |
| `numberOfStars` | `ScoreDisplayStars` | `1` | Total stars in the row |
| `perfectScore` | `ScoreDisplayStars` | `1` | The score corresponding to all stars filled; `score / perfectScore` determines how many stars are filled, partially filled, or empty |
| `starNodeOptions` | `ScoreDisplayStars` (and forwarded through `ScoreDisplayLabeledStars`) | `{ starShapeOptions: { outerRadius: 10, innerRadius: 5 }, filledLineWidth: 1.5, emptyLineWidth: 1.5 }` | Passed to each `StarNode` |
| `spacing` (inherited `HBoxOptions`) | `ScoreDisplayLabeledStars`, `ScoreDisplayStars` | `5` / `3` | Horizontal gap between children |

## Methods

All four are driven entirely by listening to `scoreProperty` — none exposes a manual `update()`. The only member worth calling out beyond standard `Node`/`HBox` API is:

| Member | Description |
| --- | --- |
| `dispose()` | Unlinks the internal `scoreProperty` listener (and disposes any `DerivedStringProperty`, for `ScoreDisplayLabeledNumber`/`ScoreDisplayLabeledStars`) |

::: warning `ScoreDisplayStars` asserts if `score` exceeds `perfectScore`
`ScoreDisplayStars`' internal listener runs `assert( score <= perfectScore, ... )` on every score change — a score that overshoots `perfectScore` (e.g. from a bonus not accounted for in `perfectScore`) throws with assertions enabled rather than silently drawing extra-full stars. Make sure `perfectScore` reflects the true maximum before wiring up a live `scoreProperty`.
:::
