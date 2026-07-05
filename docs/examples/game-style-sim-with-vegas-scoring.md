---
title: A Game-Style Sim with Vegas Scoring
description: A worked example combining vegas's LevelSelectionButton, ScoreDisplayNumberAndStar, GameAudioPlayer, and AllLevelsCompletedNode into a minimal level-selection and gameplay screen.
category: examples
tags: [example, vegas, LevelSelectionButton, ScoreDisplayNumberAndStar, GameAudioPlayer, AllLevelsCompletedNode, game]
status: complete
related:
  - /api/vegas/level-selection-button
  - /api/vegas/score-display-number-and-star
  - /api/vegas/game-audio-player
  - /api/vegas/all-levels-completed-node
  - /patterns/model-view-separation
  - /patterns/reset-all-pattern
prerequisites:
  - /getting-started/your-first-simulation
  - /api/vegas/level-selection-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# A Game-Style Sim with Vegas Scoring

`vegas` (`scenerystack/vegas`) supplies the recurring pieces of a PhET-style game: a level-selection screen, a score display, standard game-feedback sounds, and an end-of-game dialog. Each is documented individually in `api/vegas/`; this page combines four of them — [`LevelSelectionButton`](/api/vegas/level-selection-button), [`ScoreDisplayNumberAndStar`](/api/vegas/score-display-number-and-star), [`GameAudioPlayer`](/api/vegas/game-audio-player), and [`AllLevelsCompletedNode`](/api/vegas/all-levels-completed-node) — into one minimal two-level game: a level-selection grid, a trivial "answer correctly" challenge per level, and a completion dialog once every level's been played.

## The model: per-level scores plus overall progress

```ts
import { NumberProperty, BooleanProperty, DerivedProperty, type TReadOnlyProperty } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

class GameModel {
  public static readonly NUMBER_OF_LEVELS = 2;
  public static readonly PERFECT_SCORE = 3;

  public readonly levelScoreProperties: NumberProperty[];
  public readonly allLevelsCompletedProperty: TReadOnlyProperty<boolean>;
  private readonly levelCompletedProperties: BooleanProperty[];

  public constructor( tandem: Tandem ) {
    this.levelScoreProperties = [];
    this.levelCompletedProperties = [];

    for ( let level = 1; level <= GameModel.NUMBER_OF_LEVELS; level++ ) {
      const levelTandem = tandem.createTandem( `level${level}` );
      this.levelScoreProperties.push( new NumberProperty( 0, {
        tandem: levelTandem.createTandem( 'scoreProperty' )
      } ) );
      this.levelCompletedProperties.push( new BooleanProperty( false, {
        tandem: levelTandem.createTandem( 'completedProperty' )
      } ) );
    }

    this.allLevelsCompletedProperty = DerivedProperty.and( this.levelCompletedProperties );
  }

  public answerCorrectly( levelIndex: number ): void {
    const scoreProperty = this.levelScoreProperties[ levelIndex ];
    scoreProperty.value = Math.min( scoreProperty.value + 1, GameModel.PERFECT_SCORE );
    if ( scoreProperty.value === GameModel.PERFECT_SCORE ) {
      this.levelCompletedProperties[ levelIndex ].value = true;
    }
  }

  public reset(): void {
    this.levelScoreProperties.forEach( property => property.reset() );
    this.levelCompletedProperties.forEach( property => property.reset() );
  }
}
```

## The level-selection screen

Rather than one bespoke button per level, build a row of `LevelSelectionButton`s from the model's arrays — each wired to its own `scoreProperty` and displaying it with the compact [`ScoreDisplayNumberAndStar`](/api/vegas/score-display-number-and-star):

```ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';
import { HBox, Text, Node } from 'scenerystack/scenery';
import { LevelSelectionButton, ScoreDisplayNumberAndStar, AllLevelsCompletedNode } from 'scenerystack/vegas';

class GameScreenView extends ScreenView {
  private readonly levelSelectionNode: Node;
  private readonly challengeNode: Node;
  private readonly allLevelsCompletedNode: AllLevelsCompletedNode;

  public constructor( model: GameModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    const levelButtons = model.levelScoreProperties.map( ( scoreProperty, levelIndex ) =>
      new LevelSelectionButton( new Text( `${levelIndex + 1}`, { font: '32px sans-serif' } ), scoreProperty, {
        buttonWidth: 120,
        buttonHeight: 120,
        createScoreDisplay: score => new ScoreDisplayNumberAndStar( score ),
        listener: () => this.showChallenge( levelIndex ),
        tandem: this.tandem.createTandem( `level${levelIndex + 1}Button` )
      } )
    );

    this.levelSelectionNode = new HBox( {
      spacing: 20,
      children: levelButtons,
      center: this.layoutBounds.center
    } );

    // A stand-in "challenge" view - in a real game this would be the actual question UI.
    this.challengeNode = new Node( { visible: false } );

    // Shown once model.allLevelsCompletedProperty flips true - see the .link() call below.
    this.allLevelsCompletedNode = new AllLevelsCompletedNode( () => {
      this.allLevelsCompletedNode.visible = false;
      this.levelSelectionNode.visible = true;
    }, {
      center: this.layoutBounds.center,
      visible: false
    } );

    this.children = [ this.levelSelectionNode, this.challengeNode, this.allLevelsCompletedNode ];

    model.allLevelsCompletedProperty.link( allCompleted => {
      if ( allCompleted ) {
        this.levelSelectionNode.visible = false;
        this.allLevelsCompletedNode.visible = true;
      }
    } );
  }

  private showChallenge( levelIndex: number ): void {
    this.levelSelectionNode.visible = false;
    this.challengeNode.visible = true;
    // ...build/show the actual per-level challenge here.
  }
}
```

## Wiring GameAudioPlayer to the standard game moments

[`GameAudioPlayer`](/api/vegas/game-audio-player) supplies the shared sound vocabulary for a game's feedback moments — correct/incorrect answers and the three game-over shapes — so the model's challenge-resolution code plays the standard sound instead of the view constructing its own `SoundClip`s:

```ts
import { GameAudioPlayer } from 'scenerystack/vegas';

class ChallengeController {
  private readonly gameAudioPlayer = new GameAudioPlayer();

  public constructor( private readonly model: GameModel, private readonly levelIndex: number ) {}

  public submitAnswer( isCorrect: boolean ): void {
    if ( isCorrect ) {
      this.gameAudioPlayer.correctAnswer();
      this.model.answerCorrectly( this.levelIndex );

      const scoreProperty = this.model.levelScoreProperties[ this.levelIndex ];
      if ( scoreProperty.value === GameModel.PERFECT_SCORE ) {
        this.gameAudioPlayer.gameOverPerfectScore();
      }
    }
    else {
      this.gameAudioPlayer.wrongAnswer();
    }
  }
}
```

A single `GameAudioPlayer` instance is enough for the whole sim — its five underlying sound clips are module-level singletons (see [`GameAudioPlayer`](/api/vegas/game-audio-player#a-minimal-example)), so there's no benefit to constructing more than one.

## Wiring the Screen and Sim

```ts
import { Sim, Screen, onReadyToLaunch } from 'scenerystack/sim';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

const screenTandem = Tandem.ROOT.createTandem( 'gameScreen' );

const gameScreen = new Screen(
  () => new GameModel( screenTandem.createTandem( 'model' ) ),
  model => new GameScreenView( model, { tandem: screenTandem.createTandem( 'view' ) } ),
  {
    name: new Property( 'Game' ),
    backgroundColorProperty: new Property( 'white' ),
    tandem: screenTandem
  }
);

onReadyToLaunch( () => {
  const sim = new Sim( new Property( 'Vegas Game Demo' ), [ gameScreen ] );
  sim.start();
} );
```

| Piece | Role in the composition |
| --- | --- |
| One `LevelSelectionButton` per level, built from `model.levelScoreProperties` | The entry point into each level, showing its live score without the view hand-tracking button state |
| `ScoreDisplayNumberAndStar` as `createScoreDisplay` | The compact score readout fits `LevelSelectionButton`'s small footprint better than the default `ScoreDisplayStars` once more than a couple of points are possible |
| `GameAudioPlayer`, one instance, called from wherever a challenge resolves | Standard sounds for standard moments — no bespoke `SoundClip` wiring needed for the common correct/incorrect/game-over cases (see [A Sound-Rich Simulation with Tambo](/examples/sound-rich-simulation-with-tambo) for building *custom* sounds when the standard set isn't enough) |
| `AllLevelsCompletedNode`, shown/hidden manually based on `model.allLevelsCompletedProperty` | Not a `Dialog` — this example owns showing/hiding it itself, exactly as documented on the [`AllLevelsCompletedNode`](/api/vegas/all-levels-completed-node) page |

::: tip Model owns "which levels are complete," not the buttons
`model.allLevelsCompletedProperty` is a `DerivedProperty` over the model's own per-level completion state — the view only *reacts* to it (showing `AllLevelsCompletedNode`) rather than deciding for itself when the game is finished. This keeps [model-view separation](/patterns/model-view-separation) intact even though the "game is over" condition spans every level's state at once.
:::

## Where to go next

- [LevelSelectionButton](/api/vegas/level-selection-button) — the button's full option list, including `soundPlayerIndex` for per-level pitch variation
- [GameAudioPlayer](/api/vegas/game-audio-player) — the complete set of standard game sounds used above
- [AllLevelsCompletedNode](/api/vegas/all-levels-completed-node) — why it's a plain `Node`, not a `Dialog`, and what that means for ownership
- [A Sound-Rich Simulation with Tambo](/examples/sound-rich-simulation-with-tambo) — building custom sounds for interactions vegas doesn't already cover
