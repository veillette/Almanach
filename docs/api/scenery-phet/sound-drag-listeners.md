---
title: Sound Drag Listeners
description: SoundDragListener, SoundKeyboardDragListener, and SoundRichDragListener — drop-in replacements for scenery's drag listeners that also play grab/release sounds.
category: api
library: scenery-phet
tags: [scenery-phet, SoundDragListener, SoundKeyboardDragListener, SoundRichDragListener, sound, drag, tambo]
status: complete
related:
  - /api/scenery/drag-listener
  - /api/scenery/keyboard-drag-listener
  - /api/scenery/rich-drag-listener
  - /accessibility/sound-design
  - /api/tambo/sound-clip-player
prerequisites:
  - /api/scenery/drag-listener
  - /api/scenery/rich-drag-listener
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Sound Drag Listeners

`SoundDragListener`, `SoundKeyboardDragListener`, and `SoundRichDragListener` (from `scenerystack/scenery-phet`) are subclasses of scenery's [`DragListener`](/api/scenery/drag-listener), [`KeyboardDragListener`](/api/scenery/keyboard-drag-listener), and [`RichDragListener`](/api/scenery/rich-drag-listener) respectively — same constructor options, same drag behavior — that additionally play a grab sound when the drag starts and a release sound when it ends. Most PhET sims should reach for these instead of the plain scenery listeners by default: dragging is one of the most common interactions in a sim, and the shared grab/release sound pair is part of the standard PhET sound-design vocabulary (see [Sound Design](/accessibility/sound-design)).

```ts
import { SoundRichDragListener } from 'scenerystack/scenery-phet';
import { Node } from 'scenerystack/scenery';

const ballNode = new Node( { tagName: 'div', focusable: true, cursor: 'pointer' } );

// Same options as RichDragListener, plus sound.
ballNode.addInputListener( new SoundRichDragListener( {
  positionProperty: ball.positionProperty,
  transform: modelViewTransform,
  dragBoundsProperty: model.dragBoundsProperty
} ) );
```

## Shared sound options

All three add the same `RichDragListenerSoundOptions` on top of their base listener's options:

| Option | Default | Effect |
| --- | --- | --- |
| `grabSoundPlayer` | the shared `'grab'` sound (`sharedSoundPlayers.get( 'grab' )`) | Played when the drag begins; pass `null` for no sound |
| `releaseSoundPlayer` | the shared `'release'` sound | Played when the drag ends normally; **not** played if the listener was interrupted |

`SoundRichDragListener` additionally accepts `dragListenerSoundOptions` and `keyboardDragListenerSoundOptions` — nested overrides so its internal pointer and keyboard listeners can use different sounds than each other, falling back to the top-level `grabSoundPlayer`/`releaseSoundPlayer` when omitted.

```ts
import { SoundRichDragListener } from 'scenerystack/scenery-phet';
import sharedSoundPlayers from 'scenerystack/tambo';

new SoundRichDragListener( {
  positionProperty: ball.positionProperty,
  transform: modelViewTransform,

  // Applies to both the pointer and keyboard listener unless overridden below.
  grabSoundPlayer: sharedSoundPlayers.get( 'grab' ),

  // Keyboard-only override, e.g. a distinct sound for keyboard grabs.
  keyboardDragListenerSoundOptions: {
    grabSoundPlayer: myCustomKeyboardGrabSound
  }
} );
```

## Which one to use

Pick based on which input modality you need, exactly as with the plain scenery listeners:

| Type | Extends | Use when |
| --- | --- | --- |
| `SoundDragListener` | `DragListener` | Pointer-only dragging with sound |
| `SoundKeyboardDragListener` | `KeyboardDragListener` | Keyboard-only dragging with sound |
| `SoundRichDragListener` | `RichDragListener` | Both pointer and keyboard on one Node — the common case for a fully accessible draggable object |

::: tip These are drop-in replacements, not a separate API to learn
Because each type only adds sound on top of its base class, anywhere scenery's `DragListener`/`KeyboardDragListener`/`RichDragListener` is documented (positioning via `positionProperty`/`transform`, `dragBoundsProperty`, `start`/`end` callbacks, `keyboardDragListenerOptions`/`dragListenerOptions` namespacing on the Rich variant) applies unchanged here — the only new surface is the sound options above.
:::
