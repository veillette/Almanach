---
title: PitchedPopGenerator
description: A tambo sound generator that synthesizes a short "pop" sound at a controllable pitch, useful for sonifying discrete value changes.
category: api
library: tambo
tags: [tambo, PitchedPopGenerator, sound, WebAudio, oscillator]
status: verified
prerequisites:
  - /api/tambo/sound-generation-guide
related:
  - /api/tambo/sound-manager
  - /api/tambo/sound-clip
  - /accessibility/sound-design
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# PitchedPopGenerator

`PitchedPopGenerator` (from `scenerystack/tambo`, in `sound-generators/PitchedPopGenerator.ts`) is a `SoundGenerator` that synthesizes its sound rather than playing a pre-recorded clip: a short sine-oscillator "pop" whose pitch is chosen at play time from within a configurable frequency range. It's a good fit for sonifying a value that moves along a continuum — e.g. a slider or number spinner — where you want a distinct pop per step whose pitch tracks the value, without needing dozens of pre-recorded audio files.

Internally it pools several oscillator+gain pairs (`numPopGenerators`, default 8) and cycles through them round-robin, so overlapping pops (e.g. rapid keyboard repeat) don't cut each other off, and routes them through a `DynamicsCompressorNode` to avoid clipping when several play close together.

```ts
import { PitchedPopGenerator, soundManager } from 'scenerystack/tambo';
import { Range } from 'scenerystack/dot';
```

## A minimal example

```ts
const popGenerator = new PitchedPopGenerator( {
  pitchRange: new Range( 220, 660 )
} );

soundManager.addSoundGenerator( popGenerator );

// relativePitch is 0-1 within pitchRange, e.g. mapping a NumberProperty's normalized value
someNumberProperty.link( value => {
  const relativePitch = ( value - range.min ) / ( range.max - range.min );
  popGenerator.playPop( relativePitch );
} );
```

## Constructor

```ts
new PitchedPopGenerator( providedOptions?: PitchedPopGeneratorOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `pitchRange` | `new Range( 220, 660 )` | The frequency range (in Hz) that `playPop`'s `relativePitch` argument maps into |
| `numPopGenerators` | `8` | Size of the pooled oscillator/gain pairs; raise it if pops need to overlap more than 8 at once |
| `initialOutputLevel`, `sonificationLevel`, `associatedViewNode`, ... | — | Inherited from the base `SoundGenerator` — see [How tambo's Sound Generation Fits Together](/api/tambo/sound-generation-guide) |

## Methods

| Method | Effect |
| --- | --- |
| `playPop( relativePitch: number, duration = 0.02 )` | Plays a pop at the frequency corresponding to `relativePitch` (`0` = `pitchRange.min`, `1` = `pitchRange.max`); ignored entirely if the generator isn't `fullyEnabled` |

::: tip `relativePitch` is normalized, not a raw frequency
`playPop` takes a `0`-`1` proportion of `pitchRange`, not a frequency in Hz — you're responsible for normalizing your model value (e.g. `(value - min) / (max - min)`) before calling it. Passing a value outside `[0, 1]` fails an assertion.
:::
