---
title: A Simple Score/Level-Selection Screen
description: Combining vegas's LevelSelectionButton with a score display into a minimal level-selection screen.
category: cookbook
tags: [vegas, LevelSelectionButton, ScoreDisplayNumberAndStar, game, HBox]
status: complete
related:
  - /api/vegas/level-selection-button
  - /api/vegas/score-display-number-and-star
  - /api/vegas/score-display-family
  - /api/vegas/status-bars
  - /patterns/multi-screen-sim-structure
prerequisites:
  - /api/vegas/level-selection-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# A Simple Score/Level-Selection Screen

**Task:** a game needs a level-selection screen — a row (or grid) of buttons, one per level, each showing that level's icon and current score, that launches into the chosen level on press.

[`LevelSelectionButton`](/api/vegas/level-selection-button) (from `scenerystack/vegas`) already bundles an icon, a score display, and a level-specific sound into one `RectangularPushButton`-based Node — building a level-selection screen is mostly laying out one `LevelSelectionButton` per level in an `HBox`/`GridBox` and wiring each one's `listener` to switch levels.

## The solution

```ts
import { LevelSelectionButton, ScoreDisplayNumberAndStar } from 'scenerystack/vegas';
import { HBox, Circle, Text } from 'scenerystack/scenery';
import { NumberProperty, Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

const NUMBER_OF_LEVELS = 3;

// --- model: one score per level, plus which level (if any) is being played ---
const levelScoreProperties = Array.from(
  { length: NUMBER_OF_LEVELS },
  () => new NumberProperty( 0 )
);

const selectedLevelProperty = new Property<number | null>( null ); // null = on the selection screen

function createLevelIcon( levelNumber: number ): Circle {
  const colors = [ 'crimson', 'goldenrod', 'seagreen' ];
  const icon = new Circle( 24, { fill: colors[ levelNumber - 1 ] } );
  icon.addChild( new Text( `${levelNumber}`, { fill: 'white', center: icon.center } ) );
  return icon;
}

const levelSelectionButtons = levelScoreProperties.map( ( scoreProperty, index ) => {
  const levelNumber = index + 1;

  return new LevelSelectionButton( createLevelIcon( levelNumber ), scoreProperty, {
    buttonWidth: 120,
    buttonHeight: 120,
    createScoreDisplay: score => new ScoreDisplayNumberAndStar( score ),
    listener: () => {
      selectedLevelProperty.value = levelNumber;
    },
    soundPlayerIndex: index, // levels are zero-indexed and contiguous here
    tandem: Tandem.REQUIRED
  } );
} );

const levelSelectionRow = new HBox( {
  spacing: 20,
  children: levelSelectionButtons
} );
```

`levelSelectionRow` is now a complete, self-contained level-selection screen's content: pressing any button sets `selectedLevelProperty`, which the sim's top-level view uses to switch between "showing the selection screen" and "showing the chosen level" (typically the same `selectedLevelProperty === null` check, driving each level view's `visible` option or a `Node` swap).

## Returning to the selection screen and updating scores

Once a level is played, update that level's own `scoreProperty` from wherever the game logic lives, and provide a way back to `null`:

```ts
function onLevelCompleted( levelNumber: number, pointsEarned: number ): void {
  levelScoreProperties[ levelNumber - 1 ].value += pointsEarned;
  selectedLevelProperty.value = null; // back to the selection screen
}
```

Because `LevelSelectionButton` takes `scoreProperty` directly (not a snapshot), each button's score display updates automatically the next time the selection screen is shown — there's no manual refresh step.

## Options used here

| Option | Effect |
| --- | --- |
| `buttonWidth` / `buttonHeight` | Fixed size for every level button; icon and score-display area both derive from these |
| `createScoreDisplay` | Factory for the score-display Node — [`ScoreDisplayNumberAndStar`](/api/vegas/score-display-number-and-star) is a compact choice; see the [ScoreDisplay family](/api/vegas/score-display-family) for labeled-number/labeled-stars alternatives |
| `soundPlayerIndex` | Pitches the shared level-selection sound up per index, for zero-indexed contiguous levels |
| `listener` | Fired on press; the standard place to set which level is now selected |

::: tip Reach for `FiniteStatusBar` once you're inside a level, not on the selection screen itself
The level-selection screen shown here only needs `LevelSelectionButton`; once a level is actually being played, [`FiniteStatusBar`](/api/vegas/status-bars) is the standard way to show that level's own running score, "Level N" label, and a "Start Over" button pinned to the top of the `ScreenView` — a different, complementary piece from the selection screen itself.
:::

::: warning Keep the level-selection screen itself outside any one level's `Tandem` subtree
Each `LevelSelectionButton`'s tandem, and each level's own `scoreProperty`, should live under a tandem naming scheme that's stable regardless of how many levels exist or which one is currently selected (e.g. `gameScreen.model.level1.scoreProperty`) — see [Multi-Screen Sim Structure](/patterns/multi-screen-sim-structure) for the broader convention of keeping each self-contained unit under its own tandem subtree.
:::
