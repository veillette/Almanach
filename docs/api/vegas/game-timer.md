---
title: GameTimer
description: A simple wall-clock-driven timer, ticking once per second, used to drive a game level's elapsed-time display.
category: api
library: vegas
tags: [vegas, GameTimer, game, timer]
status: verified
related:
  - /api/vegas/elapsed-time-node
  - /api/axon/number-property
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/reference/
---

# GameTimer

`GameTimer` (from `scenerystack/vegas`) tracks how long a game level has been in progress, counting whole seconds via axon's shared `stepTimer` rather than being driven by a simulation's per-frame `step()`. Its frame rate (once per second) is deliberately coarse — fine for a "time to complete this level" readout, not for driving smooth animation. [`ElapsedTimeNode`](/api/vegas/elapsed-time-node) is the usual way to display its value.

```ts
import { GameTimer } from 'scenerystack/vegas';

const gameTimer = new GameTimer();

function startLevel(): void {
  gameTimer.start(); // resets elapsedTimeProperty to 0 and begins counting
}

function levelComplete(): void {
  gameTimer.stop();
  console.log( `Finished in ${GameTimer.formatTime( gameTimer.elapsedTimeProperty.value )}` );
}
```

## Constructor

```ts
new GameTimer( tandem = Tandem.OPT_OUT )
```

`GameTimer` is a `PhetioObject`; pass a real `tandem` only if the timer itself needs PhET-iO instrumentation (its `isRunningProperty` and `elapsedTimeProperty` are each given sub-tandems and are `phetioReadOnly` — a sim changes them by calling `start()`/`stop()`/`restart()`, not by writing the Properties directly).

## Public state

| Member | Description |
| --- | --- |
| `elapsedTimeProperty` | `Property<number>` — whole seconds elapsed since the last `start()`, integer-valued, range `[0, Infinity)` |
| `isRunning` | Getter mirroring the internal `isRunningProperty` |

## Methods

| Method | Effect |
| --- | --- |
| `start()` | Resets `elapsedTimeProperty` to `0` and begins counting up once per second; no-op if already running |
| `stop()` | Halts counting, leaving `elapsedTimeProperty` at its current value; no-op if already stopped |
| `restart()` | `stop()` followed by `start()` — convenience for "start this level over" |
| `reset()` | Resets both `isRunningProperty` and `elapsedTimeProperty` to their initial values and clears any pending interval |
| `GameTimer.formatTime( time )` *(static)* | Formats a number of seconds as a localized `H:MM:SS` string once `time` reaches an hour, otherwise `M:SS` |

::: tip `GameTimer` counts in whole seconds, not fractional time
Internally it uses `stepTimer.setInterval( ..., 1000 )`, incrementing `elapsedTimeProperty` by exactly `1` every second rather than accumulating a `dt`. If a game needs sub-second precision, `GameTimer` isn't the right tool — track elapsed time yourself with a per-frame `step()` and use `GameTimer.formatTime()` only for the display formatting.
:::

::: warning `start()` always resets the elapsed time to zero
Calling `start()` on an already-stopped `GameTimer` does not resume from where it left off — it restarts from `0`. Use `restart()` when that's the intended behavior (e.g. the user pressed "Try Again"); don't call `stop()` then `start()` expecting to pause and resume, since `start()` alone is a no-op while already running and a fresh start when not.
:::
