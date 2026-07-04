---
title: UtteranceQueue
description: The FIFO queue that manages timing, priority, and interruption for Utterances before handing text off to an Announcer.
category: api
library: utterance-queue
tags: [utterance-queue, UtteranceQueue, Announcer, voicing, description, accessibility]
status: complete
related:
  - /api/utterance-queue/utterance
  - /api/utterance-queue/response-packet-and-patterns
  - /accessibility/voicing
  - /accessibility/describing-dynamic-state
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# UtteranceQueue

`UtteranceQueue` (from `scenerystack/utterance-queue`) manages a first-in-first-out queue of `Utterance`s and drives an `Announcer` (such as `AriaLiveAnnouncer` or `SpeechSynthesisAnnouncer`) to actually speak them. It is generic over the announcer type — `UtteranceQueue<A extends Announcer = Announcer>` — and is what's wired up under the hood for PhET's Interactive Description and Voicing features; simulation code almost never constructs one directly, but understanding it explains why alerts appear delayed, reordered, or dropped.

```ts
import { UtteranceQueue, AriaLiveAnnouncer, Utterance } from 'scenerystack/utterance-queue';
```

## A minimal example

```ts
const announcer = new AriaLiveAnnouncer();
const utteranceQueue = new UtteranceQueue( announcer );

// Somewhere the announcer's aria-live elements need to be in the document,
// and stepTimer needs to be stepped each frame for the queue to advance.

utteranceQueue.addToBack( 'Simulation reset' );

const scoreUtterance = new Utterance( { alert: 'Score: 3' } );
utteranceQueue.addToBack( scoreUtterance ); // re-adding later updates timing instead of duplicating
```

`UtteranceQueue.fromFactory()` is a convenience factory that wires up an `AriaLiveAnnouncer`, appends its live-region container to `document.body`, and drives `stepTimer` off `requestAnimationFrame` — useful outside a full `Sim`, where `joist` already does this wiring for you.

## Constructor

```ts
new UtteranceQueue<A extends Announcer>( announcer: A, providedOptions?: UtteranceQueueOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `debug` | `false` | Logs queue activity (`addToBack`, `announcing`, etc.) to the console |
| `initialize` | `true` | If `false`, every method becomes a no-op — useful for a feature flag that disables announcing entirely without branching call sites |
| `featureSpecificAnnouncingControlPropertyName` | `null` | `'descriptionCanAnnounceProperty'` or `'voicingCanAnnounceProperty'` — additionally gates announcing on that Utterance-level Property, on top of `canAnnounceProperty` |

## Methods

| Method | Description |
| --- | --- |
| `addToBack( utterance )` | Enqueues an `Utterance` (or raw `TAlertable` content, auto-wrapped). Removes any existing occurrence of the same `Utterance` instance first |
| `announceImmediately( utterance )` | Bypasses queue ordering — announces synchronously if the announcer is ready and priority allows it, otherwise queues at the front. Needed for effects that must originate from a synchronous user gesture (browser speech-synthesis restrictions) |
| `removeUtterance( utterance )` | Removes a specific `Utterance` from the queue |
| `hasUtterance( utterance )` | Whether the given `Utterance` is currently queued |
| `cancelUtterance( utterance )` | Removes it from the queue, and asks the announcer to stop if it's currently being spoken |
| `clear()` | Empties the queue without touching in-progress announcement |
| `cancel()` | `clear()` plus tells the announcer to stop speaking entirely |
| `.muted` / `setMuted()` / `getMuted()` | While muted, Utterances still move through the queue and their timers still run, but nothing is sent to the announcer |
| `.enabled` / `setEnabled()` / `isEnabled()` | While disabled, nothing can be added, removed, or announced |
| `.length` | Number of Utterances currently queued |
| `UtteranceQueue.fromFactory()` | Static convenience constructor described above |

## How ordering works

Utterances are announced first-in-first-out, but only once "stable" — see `Utterance`'s `alertStableDelay`/`alertMaximumDelay` — and `priorityProperty` can reorder or interrupt: a higher-priority `Utterance` added while a lower-priority one is being spoken cancels it outright; a higher-priority `Utterance` already ahead in the queue causes newly-added lower-priority ones to be dropped rather than piling up behind it.

::: warning `addToFront()` is deprecated — don't reach for it
`addToFront()` logs a deprecation warning and rarely does what it looks like it should, because ordering is driven by time-in-queue and priority, not insertion position. To make something speak sooner, use `announceImmediately()`, raise its `Utterance.priorityProperty`, or `clear()` the queue before adding the important alert — not `addToFront()`.
:::
