---
title: Adding a Custom Sound Effect on Interaction
description: Wiring a tambo SoundClip to a button press and to a Property change, registered through soundManager.
category: cookbook
tags: [tambo, SoundClip, soundManager, sound, RectangularPushButton]
status: complete
related:
  - /api/tambo/sound-clip
  - /api/tambo/sound-manager
  - /api/sun/rectangular-push-button
  - /accessibility/sound-design
prerequisites:
  - /api/tambo/sound-clip
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Adding a Custom Sound Effect on Interaction

**Task:** play a short sound effect when the user presses a button, and a different one automatically whenever some model `Property` crosses into a new state — without hand-managing `AudioContext` plumbing.

Both cases use the same building block: a [`SoundClip`](/api/tambo/sound-clip) wrapping a decoded audio asset, registered once with the [`soundManager`](/api/tambo/sound-manager) singleton, then `.play()`ed from wherever the triggering event happens — a button's `listener`, or a `Property` listener.

## Playing a sound on a button press

```ts
import { SoundClip, soundManager } from 'scenerystack/tambo';
import { RectangularPushButton } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';
import buttonClick_mp3 from './buttonClick_mp3.js'; // a WrappedAudioBuffer from an audio asset import

const buttonClickSound = new SoundClip( buttonClick_mp3, {
  initialOutputLevel: 0.7
} );

soundManager.addSoundGenerator( buttonClickSound, {
  categoryName: 'user-interface'
} );

const launchButton = new RectangularPushButton( {
  content: new Text( 'Launch' ),
  listener: () => {
    model.launch();
    buttonClickSound.play();
  },
  tandem: Tandem.REQUIRED
} );
```

`SoundClip.play()` fires the clip as a one-shot; calling it again while a previous play is still finishing starts an overlapping instance rather than cutting the first one off, which is normally what you want for rapid button presses.

## Playing a sound on a Property change

For a sound that should follow model state rather than a specific user gesture — a "success" chime when a value enters a target range, a click each time a counter increments — link the sound to the `Property` instead of a button `listener`:

```ts
import { SoundClip, soundManager } from 'scenerystack/tambo';
import { NumberProperty } from 'scenerystack/axon';
import successChime_mp3 from './successChime_mp3.js';

const scoreProperty = new NumberProperty( 0 );
const targetScore = 100;

const successSound = new SoundClip( successChime_mp3, {
  initialOutputLevel: 0.8
} );
soundManager.addSoundGenerator( successSound );

let wasAtTarget = false;
scoreProperty.link( score => {
  const isAtTarget = score >= targetScore;
  if ( isAtTarget && !wasAtTarget ) {
    successSound.play(); // fires only on the transition into the target range
  }
  wasAtTarget = isAtTarget;
} );
```

Guarding with a `wasAtTarget` flag (rather than playing on every `link` call where `score >= targetScore`) is what makes the sound fire once on the transition, instead of replaying every time an already-high score changes slightly.

## A looping sound tied to a boolean state

A continuous sound (a motor hum, an alarm) uses `loop: true` and is started/stopped rather than played once — see [SoundClip](/api/tambo/sound-clip#a-minimal-example) for the full pattern:

```ts
const isRunningProperty = model.isRunningProperty; // a BooleanProperty
const motorHumSound = new SoundClip( motorHum_mp3, { loop: true } );
soundManager.addSoundGenerator( motorHumSound );

isRunningProperty.link( isRunning => {
  isRunning ? motorHumSound.play() : motorHumSound.stop();
} );
```

::: tip Register every sound generator once, up front
`soundManager.addSoundGenerator` should be called once per `SoundClip` at construction time, not on every play — `soundManager` handles overlapping/looping playback internally. Calling `addSoundGenerator` repeatedly on the same clip is unnecessary and will register it more than once.
:::

::: warning Sounds queued before `soundManager.initialize()` don't play until it runs
If `addSoundGenerator` is called before the sim has called `soundManager.initialize(...)`, the call is silently queued rather than dropped — but nothing plays until initialization completes. This is normally handled by sim startup code once, not per-feature, so most cookbook-level code (as above) doesn't need to worry about ordering.
:::
