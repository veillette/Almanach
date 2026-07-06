---
title: FiniteStatusBar and InfiniteStatusBar
description: The standard game-screen status bars that pin a score display (and optionally level/challenge/timer info) to the top of a ScreenView.
category: api
library: vegas
tags: [vegas, FiniteStatusBar, InfiniteStatusBar, StatusBar, game, score]
status: verified
prerequisites:
  - /api/vegas/score-display-family
related:
  - /api/vegas/score-display-family
  - /api/vegas/level-completed-node
  - /api/vegas/all-levels-completed-node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/reference/
---

# FiniteStatusBar and InfiniteStatusBar

`FiniteStatusBar` and `InfiniteStatusBar` (both from `scenerystack/vegas`) are the two standard game-screen status bars: a `Rectangle` bar, floated against the top of the screen, that keeps a score display (and other UI) aligned to its left and right edges as the browser window resizes. Both extend `scenery-phet`'s `StatusBar` base class, which handles the resize-following geometry; each subclass only decides *what content* goes in the bar.

- **`FiniteStatusBar`** is for games with a fixed number of challenges per level — it shows "Level N", an optional "Challenge N of M", a score display, an optional elapsed-time display, and a "Start Over" button.
- **`InfiniteStatusBar`** is for open-ended games with no fixed challenge count — it shows a back button, an arbitrary `messageNode` (typically a `Text`), and a score display, with no level/challenge/timer/start-over concepts at all.

```ts
import { FiniteStatusBar, InfiniteStatusBar } from 'scenerystack/vegas';
import { NumberProperty } from 'scenerystack/axon';
import { Text } from 'scenerystack/scenery';
```

## A minimal example

```ts
const scoreProperty = new NumberProperty( 0 );
const levelNumberProperty = new NumberProperty( 1 );

// Finite: fixed challenges per level.
const finiteStatusBar = new FiniteStatusBar( this.layoutBounds, this.visibleBoundsProperty, scoreProperty, {
  levelNumberProperty: levelNumberProperty,
  challengeNumberProperty: new NumberProperty( 1 ),
  numberOfChallengesProperty: new NumberProperty( 10 )
} );

// Infinite: open-ended, no challenge count.
const infiniteStatusBar = new InfiniteStatusBar(
  this.layoutBounds,
  this.visibleBoundsProperty,
  new Text( 'Explore freely' ),
  scoreProperty,
  { backButtonListener: () => this.showLevelSelectionScreen() }
);
```

## Constructors

```ts
new FiniteStatusBar(
  layoutBounds: Bounds2,
  visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
  scoreProperty: ReadOnlyProperty<number>,
  providedOptions?: FiniteStatusBarOptions
)

new InfiniteStatusBar(
  layoutBounds: Bounds2,
  visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
  messageNode: Node,
  scoreProperty: ReadOnlyProperty<number>,
  providedOptions?: InfiniteStatusBarOptions
)
```

Both take the `ScreenView`'s `layoutBounds` and `visibleBoundsProperty` first, so the bar can stretch to match the browser's actual visible width even when it differs from `layoutBounds`.

## Options

| Option | Class | Default | Effect |
| --- | --- | --- | --- |
| `levelNumberProperty` | `FiniteStatusBar` | `null` | If set (and `levelNumberVisible`), shows a "Level N" label |
| `challengeNumberProperty` / `numberOfChallengesProperty` | `FiniteStatusBar` | `null` / `null` | Must both be set or both be `null` (asserted); shows "Challenge N of M" |
| `elapsedTimeProperty` / `timerEnabledProperty` | `FiniteStatusBar` | `null` / `null` | If both set, shows an `ElapsedTimeNode`, visible only while `timerEnabledProperty` is `true` |
| `createScoreDisplay` | both | `ScoreDisplayLabeledNumber` (`FiniteStatusBar`) / `ScoreDisplayNumberAndStar` (`InfiniteStatusBar`) | Factory building the score-display `Node` — swap in any member of the [ScoreDisplay family](/api/vegas/score-display-family) |
| `startOverButtonText` / `startOverButtonOptions` | `FiniteStatusBar` | localized "Start Over" string / `{}` | Text and extra options for the "Start Over" `TextPushButton` |
| `backButtonListener` | `InfiniteStatusBar` | no-op | Called when the back button (a `BackButton`) is pressed |
| `messageNode` (constructor parameter) | `InfiniteStatusBar` | — | Arbitrary `Node` shown next to the back button, e.g. a `Text` describing the current activity |
| `font` / `textFill` | `FiniteStatusBar` | `StatusBar.DEFAULT_FONT` / `StatusBar.DEFAULT_TEXT_FILL` | Applied to the level/challenge/score/timer text |
| `barFill` / `barStroke` (inherited `StatusBarOptions`) | both | `'lightGray'` / `null` | The bar rectangle's own paint |
| `floatToTop` (inherited `StatusBarOptions`) | both | `false` | `true` floats the bar to the top of the browser's visible bounds instead of `layoutBounds`' top |

## Methods

Both classes are otherwise thin: all layout happens in the constructor via a `Multilink`/`link` on `positioningBoundsProperty` (from `StatusBar`) plus the content's own bounds. The only public member beyond inherited `Node` API is:

| Member | Description |
| --- | --- |
| `dispose()` | Disposes internally-created `Text`/score-display/timer/button children and their string-Property links, then calls `StatusBar.dispose()` |

::: tip Picking between the two is about challenge structure, not visual polish
The deciding factor is whether "Challenge N of M" is meaningful for your game. If challenges are counted and finite, use `FiniteStatusBar` (which also gives you "Start Over" and an optional timer). If play is open-ended — no fixed challenge count to report — use `InfiniteStatusBar`, and pass whatever `messageNode` best describes the current state instead.
:::
