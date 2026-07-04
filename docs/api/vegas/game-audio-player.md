---
title: GameAudioPlayer
description: A small helper class that plays the standard set of vegas game-feedback sounds (correct/wrong answer, challenge complete, game-over variants).
category: api
library: vegas
tags: [vegas, GameAudioPlayer, sound, game, tambo]
status: verified
prerequisites:
  - /api/tambo/sound-generation-guide
related:
  - /api/vegas/score-display-number-and-star
  - /api/tambo/sound-clip
  - /api/tambo/sound-manager
  - /accessibility/sound-design
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# GameAudioPlayer

`GameAudioPlayer` (from `scenerystack/vegas`) is a small class that owns five fixed [`SoundClip`](/api/tambo/sound-clip)s — `ding`, `boing`, `trumpet`, `cheer`, and `organ` — registers them with [`soundManager`](/api/tambo/sound-manager) the first time any instance is constructed, and exposes named methods for the standard game-feedback moments instead of making callers manage the clips themselves.

```ts
import { GameAudioPlayer } from 'scenerystack/vegas';
```

## A minimal example

```ts
const gameAudioPlayer = new GameAudioPlayer();

// when the user answers a challenge:
isCorrect ? gameAudioPlayer.correctAnswer() : gameAudioPlayer.wrongAnswer();

// when a level's challenges are all done:
gameAudioPlayer.challengeComplete();

// at the end of a level, based on the final score:
if ( score === 0 ) {
  gameAudioPlayer.gameOverZeroScore();
}
else if ( score === perfectScore ) {
  gameAudioPlayer.gameOverPerfectScore();
}
else {
  gameAudioPlayer.gameOverImperfectScore();
}
```

## Constructor

```ts
new GameAudioPlayer()
```

Takes no options. Constructing an instance registers the five underlying sound clips with `soundManager` (only once, regardless of how many `GameAudioPlayer` instances are created), since `addSoundsToSoundGenerator()` is guarded by a module-level `isInitialized` flag.

## Methods

| Method | Plays |
| --- | --- |
| `correctAnswer()` | `ding` — a correct answer |
| `wrongAnswer()` | `boing` — an incorrect answer |
| `challengeComplete()` | `organ` — a single challenge finished |
| `gameOverZeroScore()` | `boing` — game ended with no points earned |
| `gameOverImperfectScore()` | `trumpet` — game ended with a mixed (non-zero, non-perfect) score |
| `gameOverPerfectScore()` | `cheer` — game ended with a perfect score |

::: tip The five clips are module-level singletons, not per-instance
Every `GameAudioPlayer` you construct plays the same shared `ding`/`boing`/`trumpet`/`cheer`/`organ` clips — there's no per-instance customization of output level or which sound file is used. If a sim needs different game sounds, that's a case for building custom [`SoundClip`](/api/tambo/sound-clip)s directly rather than configuring `GameAudioPlayer`.
:::
