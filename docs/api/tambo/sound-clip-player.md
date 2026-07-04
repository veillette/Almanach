---
title: SoundClipPlayer
description: A lightweight, self-registering wrapper around SoundClip for sounds shared across many places in a sim.
category: api
library: tambo
tags: [tambo, SoundClipPlayer, sound, WebAudio]
status: verified
prerequisites:
  - /api/tambo/sound-generation-guide
  - /api/tambo/sound-clip
related:
  - /api/tambo/sound-manager
  - /accessibility/sound-design
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# SoundClipPlayer

`SoundClipPlayer` (from `scenerystack/tambo`) wraps a `SoundClip` and automatically registers it with [`soundManager`](/api/tambo/sound-manager) at construction time, exposing only `play()` and `stop()`. It exists for sounds that are reused in many unrelated places in a sim (a common click, a boundary-reached boop) where you don't want every call site to construct and register its own `SoundClip`, and don't want that shared instance's output level or playback rate to be casually mutated from far-flung code.

```ts
import { SoundClipPlayer, click_mp3 } from 'scenerystack/tambo';
```

## A minimal example

```ts
const clickSoundPlayer = new SoundClipPlayer( click_mp3, {
  soundClipOptions: { initialOutputLevel: 0.5 },
  soundManagerOptions: { categoryName: 'user-interface' }
} );

// Anywhere in the sim that needs this sound:
clickSoundPlayer.play();
```

## Constructor

```ts
new SoundClipPlayer( wrappedAudioBuffer: WrappedAudioBuffer, providedOptions?: SoundClipPlayerOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `soundClipOptions` | `{}` | Forwarded to the internal `SoundClip` constructor — e.g. `loop`, `initialOutputLevel`, `initialPlaybackRate` |
| `soundManagerOptions` | `{}` | Forwarded to `soundManager.addSoundGenerator()` — e.g. `categoryName` |

## Methods

| Method | Effect |
| --- | --- |
| `play()` | Plays the wrapped `SoundClip` |
| `stop()` | Stops the wrapped `SoundClip` if it's playing; a no-op otherwise |

::: tip It intentionally doesn't expose the underlying SoundClip
`SoundClipPlayer` only supports `play()` and `stop()` by design — it's meant to keep a shared sound's output level and playback rate from being altered ad hoc by whichever code happens to call it. If you need to control output level, playback rate, or looping behavior per call site, construct your own [`SoundClip`](/api/tambo/sound-clip) instead and register it with `soundManager` directly.
:::
