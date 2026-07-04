---
title: AnimatedPanZoomListener
description: A pan/zoom listener supporting trackpad, wheel, and keyboard gestures that animates a target Node toward its destination pan/scale.
category: api
library: scenery
tags: [scenery, AnimatedPanZoomListener, input, pan, zoom, accessibility]
status: complete
related:
  - /api/scenery/node
  - /api/scenery/display
  - /api/scenery/trail
  - /guides/scenery-input
prerequisites:
  - /api/scenery/node
  - /api/scenery/display
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# AnimatedPanZoomListener

`AnimatedPanZoomListener` (from `scenerystack/scenery`) transforms a target [`Node`](/api/scenery/node) — usually the whole rendered scene — in response to trackpad pinch gestures, mouse wheel scroll/zoom, middle-mouse-drag panning, and keyboard pan/zoom commands, animating toward the requested pan position and scale rather than jumping instantly. It extends `PanZoomListener` (itself a `MultiListener`), adding the animation and the input-gesture handling on top. Most applications don't construct it directly — they use the pre-built `animatedPanZoomSingleton` (also from `scenerystack/scenery`), which owns one shared instance for the whole document.

```ts
import { Node, Display, animatedPanZoomSingleton } from 'scenerystack/scenery';
import { Bounds2 } from 'scenerystack/dot';

const rootNode = new Node();
const display = new Display( rootNode );

animatedPanZoomSingleton.initialize( rootNode, {
  panBounds: new Bounds2( 0, 0, display.width, display.height )
} );

display.addInputListener( animatedPanZoomSingleton.listener );
```

Because the default `stepEmitter` option is the shared `axon` `stepTimer` (which PhET-iO sims already drive every frame), the animation advances automatically — you only need to call `.step( dt )` yourself if you're not using the standard sim time loop.

## Key options (`AnimatedPanZoomListenerOptions`)

Inherited from `PanZoomListener` / `MultiListener`:

| Option | Default | Effect |
| --- | --- | --- |
| `panBounds` | `Bounds2.NOTHING` | The bounds (global frame) that must stay fully filled with content at all times — effectively the viewport |
| `targetBounds` | `null` (uses `targetNode.globalBounds`) | Overrides the bounds considered to belong to the target, e.g. when the Node has invisible content extending off-screen |
| `targetScale` | `1` | A scale factor describing the target Node's own content scale, applied to translation during panning (for content that's uniformly scaled independent of this listener) |
| `minScale` / `maxScale` | `1` / `4` | Clamps how far the listener can zoom the target in/out |
| `allowScale` / `allowRotation` | `true` / `false` | Whether pinch/gesture input is allowed to scale / rotate the target (`AnimatedPanZoomListener` disables rotation by default via `PanZoomListener`) |

Specific to `AnimatedPanZoomListener`:

| Option | Default | Effect |
| --- | --- | --- |
| `stepEmitter` | `stepTimer` | The `TReadOnlyEmitter<[number]>` that drives animation frames; pass `null` to step it manually instead |

## Public state and methods

| Member | Meaning |
| --- | --- |
| `animatingProperty` | `true` while the listener is actively animating toward its destination pan/scale |
| `step( dt )` | Advances the pan/zoom animation by `dt` seconds; called automatically unless `stepEmitter: null` |
| `panToNode( node, panToCenter, panDirection? )` | Pans so `node`'s bounds become visible within `panBounds` |
| `panToTrail( trail )` (internal use pattern) | Keeps a given [`Trail`](/api/scenery/trail)'s bounds in view, panning if they fall outside `panBounds` |
| `setPanBounds( bounds )` | Updates the viewport bounds that must stay filled, e.g. on window resize |
| `setTargetScale( scale )` | Updates `targetScale` at runtime |
| `cancel()` | Cancels any in-progress gesture/animation |
| `dispose()` | Releases the listener's internal Properties and DOM gesture listeners |

::: warning It listens for keyboard zoom globally, so give it the whole Display
`AnimatedPanZoomListener` attaches trackpad-gesture and keyboard-zoom handling at the `Display` level (via `display.addInputListener(...)`), and reacts to PDOM focus changes to keep the focused element in view. Initializing more than one, or attaching it to something other than the Display's root, produces competing pan/zoom behavior — use the shared `animatedPanZoomSingleton` unless you have a specific reason to manage your own instance.
:::
