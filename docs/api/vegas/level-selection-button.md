---
title: LevelSelectionButton
description: A push button for a game's level-selection screen, combining an icon, a score display, and a level-specific sound.
category: api
library: vegas
tags: [vegas, LevelSelectionButton, game, button, RectangularPushButton]
status: verified
prerequisites:
  - /api/vegas/score-display-number-and-star
related:
  - /api/vegas/game-audio-player
  - /api/tambo/sound-clip
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# LevelSelectionButton

`LevelSelectionButton` (from `scenerystack/vegas`) is a `RectangularPushButton` subclass built for a game's level-selection screen: an icon on top, a score display (by default a `ScoreDisplayStars`) in a bordered panel below it, sized to a fixed `buttonWidth`/`buttonHeight`. It's typically not constructed one-by-one but produced by `LevelSelectionButtonGroup`, which lays out a row/grid of them.

```ts
import { LevelSelectionButton, ScoreDisplayNumberAndStar } from 'scenerystack/vegas';
import { NumberProperty } from 'scenerystack/axon';
```

## A minimal example

```ts
const scoreProperty = new NumberProperty( 0 );

const levelButton = new LevelSelectionButton( levelIconNode, scoreProperty, {
  buttonWidth: 150,
  buttonHeight: 150,
  createScoreDisplay: score => new ScoreDisplayNumberAndStar( score ),
  listener: () => selectLevel( 1 ),
  tandem: tandem.createTandem( 'level1Button' )
} );
```

## Constructor

```ts
new LevelSelectionButton( icon: Node, scoreProperty: ReadOnlyProperty<number>, providedOptions?: LevelSelectionButtonOptions )
```

`icon` appears above the score display, scaled (via the static `createSizedImageNode`) to fit the available space.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `buttonWidth` / `buttonHeight` | `150` / `150` | Overall size of the button; icon and score-display area are both derived from these |
| `createScoreDisplay` | `scoreProperty => new ScoreDisplayStars(scoreProperty)` | Factory for the score-display Node — swap in [`ScoreDisplayNumberAndStar`](/api/vegas/score-display-number-and-star) or another display for a different look |
| `scoreDisplayProportion` | `0.2` | Fraction (0, 0.5] of `buttonHeight` given to the score-display background |
| `scoreDisplayMinXMargin` / `scoreDisplayMinYMargin` | `10` / `5` | Minimum margin between the score display and its background panel |
| `iconToScoreDisplayYSpace` | `10` | Vertical gap between the icon and the score-display panel |
| `soundPlayerIndex` | `0` | Selects a pitch-shifted variant of the default level-selection sound (semitone steps via `soundConstants.TWELFTH_ROOT_OF_TWO`); ignored if `soundPlayer` is provided directly |
| `cornerRadius` | `10` | `RectangularPushButtonOptions` styling, overridden here (not the plain `RectangularPushButton` default) |
| `baseColor` | `'rgb( 242, 255, 204 )'` | Pale yellow-green, `LevelSelectionButton`'s own default rather than `RectangularPushButton`'s |
| `xMargin` / `yMargin` | `10` / `10` | Also overridden by `LevelSelectionButton`, not inherited unchanged from `RectangularPushButtonOptions` |

## Static methods

| Static member | Purpose |
| --- | --- |
| `LevelSelectionButton.createSizedImageNode( icon, size )` | Scales a Node to fit a `Dimension2` and centers it over a background of that exact size — used internally for the icon, but public for reuse |

::: tip `soundPlayerIndex` assumes zero-based, contiguous levels
The default sound player pitches the shared `levelSelectionButton_mp3` clip up by `soundPlayerIndex` semitones, so level buttons sound progressively higher. If your levels aren't zero-indexed or contiguous, either pass an explicit `soundPlayerIndex` per button or provide your own `soundPlayer` and ignore the option entirely.
:::
