---
title: LevelCompletedNode
description: A Panel shown when a player finishes a single game level, summarizing score, stars, and (optionally) elapsed/best time.
category: api
library: vegas
tags: [vegas, LevelCompletedNode, game, Panel, score]
status: verified
prerequisites:
  - /api/vegas/score-display-family
related:
  - /api/vegas/all-levels-completed-node
  - /api/vegas/score-display-family
  - /api/vegas/status-bars
  - /api/sun/panel
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/reference/
---

# LevelCompletedNode

`LevelCompletedNode` (from `scenerystack/vegas`) is a `Panel` shown when a player finishes **one level** of a game: a congratulatory title (which varies with how well they did), a `ScoreDisplayStars` progress indicator, the level number, the numeric score out of the perfect score, an optional elapsed/best-time readout, and a "Continue" button. All of its content is computed once from plain numbers passed into the constructor — it does not observe live `Property` values itself (aside from the string Properties it builds internally for i18n).

**This is distinct from [`AllLevelsCompletedNode`](/api/vegas/all-levels-completed-node)**: `LevelCompletedNode` reports the result of *one level* and offers "Continue" (to the next level or back to level selection), whereas `AllLevelsCompletedNode` is shown once every level in the game has been completed and offers only "Done". A typical game shows `LevelCompletedNode` after every level, and `AllLevelsCompletedNode` only after the last one.

```ts
import { LevelCompletedNode } from 'scenerystack/vegas';
```

<SceneryDemo demo="level-completed-node" />

## A minimal example

```ts
const levelCompletedNode = new LevelCompletedNode(
  3,        // level
  8,        // score
  10,       // perfectScore
  4,        // numberOfStars
  true,     // timerEnabled
  95,       // elapsedTime, in seconds
  110,      // bestTimeAtThisLevel, in seconds (or null)
  false,    // isNewBestTime
  () => this.showNextLevel(),
  { center: this.layoutBounds.center }
);

this.addChild( levelCompletedNode );
```

## Constructor

```ts
new LevelCompletedNode(
  level: number,
  score: number,
  perfectScore: number,
  numberOfStars: number,
  timerEnabled: boolean,
  elapsedTime: number,
  bestTimeAtThisLevel: number | null,
  isNewBestTime: boolean,
  continueFunction: PushButtonListener,
  providedOptions?: LevelCompletedNodeOptions
)
```

| Parameter | Meaning |
| --- | --- |
| `level` | The level number just completed (shown as "Level N" unless `levelVisible: false`) |
| `score` / `perfectScore` | Used both for the "Score: N of M" text and to compute the title ("Excellent!"/"Great"/"Good"/"Keep Trying") from `score / perfectScore` |
| `numberOfStars` | Passed to the internal `ScoreDisplayStars` |
| `timerEnabled`, `elapsedTime`, `bestTimeAtThisLevel`, `isNewBestTime` | If `timerEnabled` is `true`, a time readout is shown — with a "Your New Best!" or "Your Best: MM:SS" second line depending on `isNewBestTime` and whether `bestTimeAtThisLevel` is non-null |
| `continueFunction` | Called when the "Continue" button is pressed |

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `levelVisible` | `true` | Whether the "Level N" line is shown at all |
| `starDiameter` | `62` | Diameter used to size the inner/outer radii passed to the `ScoreDisplayStars`' `StarNode`s |
| `contentMaxWidth` | `400` | Applied as `maxWidth` to each child `Text`/`RichText`/button individually (not to the `Panel`'s content as a whole) |
| `titleFont` / `infoFont` / `buttonFont` | bold 28px / bold 22px / 26px `PhetFont` | Fonts for the title, the info lines (level/score/time), and the "Continue" button |
| `buttonFill` | `PhetColorScheme.BUTTON_YELLOW` | Fill color of the "Continue" button |
| `fill` / `stroke` / `cornerRadius` (inherited `PanelOptions`) | `'rgb(180,205,255)'` / `'black'` / `35` | The panel's own background styling |

## Methods

| Member | Description |
| --- | --- |
| `dispose()` | Disposes the internally-created string `DerivedStringProperty`s and every `VBox` child (title, stars, level/score/time text, button), then calls `Panel.dispose()` |

::: tip The title text is chosen automatically from the score ratio
You don't pass a title string directly — `LevelCompletedNode` computes `score / perfectScore` and picks "Excellent!" (>0.95), "Great" (>0.75), "Good" (\>=0.5), or "Keep Trying" (below that) for you. If you need different thresholds or wording, you'll need to build a custom results panel rather than configuring this one; there's no option to override the title text or its breakpoints.
:::
