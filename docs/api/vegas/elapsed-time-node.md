---
title: ElapsedTimeNode
description: An HBox that displays a clock icon next to a formatted H:MM:SS (or M:SS) elapsed-time readout, driven by a numeric Property.
category: api
library: vegas
tags: [vegas, ElapsedTimeNode, GameTimer, game, HBox]
status: complete
related:
  - /api/vegas/game-timer
  - /api/vegas/status-bars
prerequisites:
  - /api/vegas/game-timer
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ElapsedTimeNode

`ElapsedTimeNode` (from `scenerystack/vegas`) is an `HBox` pairing a small clock icon with a `Text` readout, meant to sit inside a game's status bar (PhET's `FiniteStatusBar`) to show how long the current level has taken. It doesn't own a timer itself — you give it a `ReadOnlyProperty<number>` of elapsed seconds (typically a [`GameTimer`](/api/vegas/game-timer)'s `elapsedTimeProperty`) and it keeps its text in sync, formatting the value the same way `GameTimer.formatTime()` does.

```ts
import { ElapsedTimeNode, GameTimer } from 'scenerystack/vegas';

const gameTimer = new GameTimer();
gameTimer.start();

const elapsedTimeNode = new ElapsedTimeNode( gameTimer.elapsedTimeProperty, {
  clockIconRadius: 15,
  textFill: 'black'
} );
```

## Constructor

```ts
new ElapsedTimeNode( elapsedTimeProperty: ReadOnlyProperty<number>, providedOptions?: ElapsedTimeNodeOptions )
```

## Options

`ElapsedTimeNodeOptions` combines `HBoxOptions` (minus `children`, which `ElapsedTimeNode` sets internally) with:

| Option | Default | Effect |
| --- | --- | --- |
| `clockIconRadius` | `15` | Radius of the clock icon (a `SimpleClockIcon`) placed before the text |
| `font` | `StatusBar.DEFAULT_FONT` | Font for the elapsed-time text |
| `textFill` | `'black'` | Fill for the elapsed-time text |

The `HBox` itself defaults `spacing: 8` between the icon and text.

## Formatting

The displayed text is produced by [`GameTimer.formatTime()`](/api/vegas/game-timer) — `H:MM:SS` once the elapsed time reaches an hour, otherwise `M:SS` — and re-renders automatically whenever `elapsedTimeProperty` changes, since `ElapsedTimeNode` links to it internally via a `Multilink` (also re-running if the localized time-format pattern strings change).

::: tip `ElapsedTimeNode` is display-only
It has no `start()`/`stop()`/`reset()` of its own — those belong to whatever `ReadOnlyProperty<number>` you hand it, normally a [`GameTimer`](/api/vegas/game-timer). Call `dispose()` on the `ElapsedTimeNode` (not the timer) when the status bar it's part of is torn down, to release its internal `Multilink`.
:::
