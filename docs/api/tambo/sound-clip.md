---
title: SoundClip
description: A tambo sound generator that plays a decoded audio buffer as a one-shot or looping clip.
category: api
library: tambo
tags: [tambo, SoundClip, sound, WebAudio]
status: complete
related:
  - /api/tambo/sound-manager
  - /api/tambo/sound-clip-player
  - /api/tambo/sound-generation-guide
  - /accessibility/sound-design
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# SoundClip

`SoundClip` (from `scenerystack/tambo`, in `sound-generators/SoundClip.ts`) is the workhorse `SoundGenerator` for playing pre-recorded audio — a decoded `AudioBuffer` wrapped in a `WrappedAudioBuffer` (the object produced by a `*_mp3.js`/`*_wav.js` sound asset import). It can be played as a single one-shot or looped continuously, supports multiple overlapping plays of the same clip, and exposes a settable playback rate.

```ts
import { SoundClip, soundManager, boundaryReached_mp3, saturatedSineLoop220Hz_mp3 } from 'scenerystack/tambo';
```

## A minimal example

```ts
const boundarySound = new SoundClip( boundaryReached_mp3, {
  initialOutputLevel: 0.6
} );

soundManager.addSoundGenerator( boundarySound, { categoryName: 'sim-specific' } );

// Later, in response to some model event:
boundarySound.play();
```

A looping clip works the same way, just with `loop: true`, and is started/stopped rather than fired-and-forgotten:

```ts
const humSound = new SoundClip( saturatedSineLoop220Hz_mp3, { loop: true } );
soundManager.addSoundGenerator( humSound );

motorIsRunningProperty.link( isRunning => {
  isRunning ? humSound.play() : humSound.stop();
} );
```

## Constructor

```ts
new SoundClip( wrappedAudioBuffer: WrappedAudioBuffer, providedOptions?: SoundClipOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `loop` | `false` | Whether the clip wraps around and repeats, rather than playing once |
| `trimSilence` | `true` | Detects and skips leading/trailing silence in the audio buffer when playing/looping |
| `initialPlaybackRate` | `1` | Multiplier on playback speed (and pitch) — `0.5` is an octave down, `2` is an octave up |
| `initiateWhenDisabled` | `false` | If `true`, a one-shot sound already in flight can still start even while the generator isn't fully enabled (ignored for loops) |
| `rateChangesAffectPlayingSounds` | `true` | Whether `setPlaybackRate()` retunes buffers that are already playing, or only future plays |
| `initialOutputLevel`, `sonificationLevel`, `associatedViewNode`, `enabledDuringReset`, ... | — | Inherited from the base `SoundGenerator` — see [How tambo's Sound Generation Fits Together](/api/tambo/sound-generation-guide) |

## Methods

| Method | Effect |
| --- | --- |
| `play( delay = 0 )` | Starts playback (after an optional delay, in seconds). If the shared `AudioContext` is still `suspended`, the call is deferred and fired once it resumes |
| `stop( delay = 0.1 )` | Fades out and stops all currently-playing instances of this clip; the delay avoids audible clicks |
| `setPlaybackRate( rate, timeConstant? )` / `getPlaybackRate()` / `.playbackRate` | Get/set the playback-rate multiplier |
| `get isPlaying` / `isPlayingProperty` | Whether the clip currently has an active buffer source |
| `getNumberOfPlayingInstances()` | How many overlapping instances of this clip are currently sounding — useful for capping concurrent plays |

::: tip One-shots are cut off when the generator becomes disabled
A non-looping `SoundClip` calls `this.stop()` automatically whenever `fullyEnabledProperty` transitions to `false` (e.g. sound gets globally disabled mid-playback) — unless `initiateWhenDisabled` changes the calculus for newly-started sounds. Loops are never auto-stopped this way; you're expected to call `stop()` yourself when the looping condition ends.
:::
