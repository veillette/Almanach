---
title: Timer, animationFrameTimer, and stepTimer
description: The shared Timer class and its two singleton instances — setTimeout/setInterval-alike scheduling driven by the sim's own frame loop instead of the browser clock.
category: api
library: axon
tags: [axon, Timer, animationFrameTimer, stepTimer, scheduling]
status: complete
related:
  - /api/axon/emitter
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Timer, animationFrameTimer, and stepTimer

`Timer` (from `scenerystack/axon`) is a small `TinyEmitter<[ number ]>` subclass that adds `setTimeout`/`clearTimeout` and `setInterval`/`clearInterval`-style scheduling on top of a simple `dt`-driven `emit`. Rather than construct your own, simulation code almost always reaches for one of the two ready-made singleton instances axon exports: `animationFrameTimer` and `stepTimer`. Both are plain `Timer` instances; they differ only in *who calls `emit()` on them and when*.

```ts
import { stepTimer, animationFrameTimer } from 'scenerystack/axon';

// Fires once, ~500ms of sim time after this call, driven by the sim's step loop:
const timeoutListener = stepTimer.setTimeout( () => {
  console.log( 'sim has stepped for 500ms' );
}, 500 );

// Fires every frame, whether or not the sim is currently active/running:
animationFrameTimer.addListener( dt => {
  // dt is in seconds
} );
```

## `stepTimer` vs. `animationFrameTimer`

| | `stepTimer` | `animationFrameTimer` |
| --- | --- | --- |
| Driven by | The running `Sim`'s `stepSimulation` call (also ticks in accessibility tests and bare `Display` animation loops) | The browser's `requestAnimationFrame` loop directly, independent of whether a `Sim` is active |
| Ticks while paused / inactive | No — tied to the active screen's step | Yes — keeps firing even when the sim is paused or backgrounded |
| Typical use | Model-time scheduling: "wait 400ms of sim time," debounced UI updates tied to simulation stepping | Animation/UI effects that must keep running regardless of play/pause state (e.g. a `stepTimer`-independent visual pulse) |

Both are global, screen-independent singletons — a `setTimeout` registered on `stepTimer` from one screen will still fire even if the user has navigated to a different screen, as long as the sim keeps stepping at all.

## `Timer`'s public API

| Member | Effect |
| --- | --- |
| `setTimeout( listener, timeout )` | Calls `listener()` once, after `timeout` milliseconds of accumulated `dt` have elapsed; returns an internal callback handle |
| `clearTimeout( handle )` | Cancels a pending `setTimeout`, using the handle it returned |
| `setInterval( listener, interval )` | Calls `listener()` repeatedly every `interval` milliseconds of accumulated `dt`; returns a handle |
| `clearInterval( handle )` | Cancels a running `setInterval` |
| `runOnNextTick( listener )` | Convenience for `setTimeout( listener, 0 )` |
| `addListener( listener )` / `removeListener( listener )` | Inherited from `TinyEmitter` — the low-level `( dt: number ) => void` hook that `setTimeout`/`setInterval` are themselves built on |

`CallbackTimer` (also exported from `scenerystack/axon`) is a related but distinct higher-level utility built on top of `stepTimer`: it models "press-and-hold" style repeated firing (an initial `delay`, then continuous firing at `interval`), the same pattern used by `sun`'s press-and-hold buttons.

::: warning `timeout`/`interval` are in milliseconds; `dt` is in seconds
`setTimeout`/`setInterval`'s duration arguments are milliseconds (matching the browser APIs they mimic), but the underlying `emit( dt )` — and any listener you add directly via `addListener` — receives `dt` in **seconds**, matching the rest of axon/scenery's simulation-time conventions. Mixing up the units is a common source of "my timeout fires 1000x too fast/slow" bugs.
:::
