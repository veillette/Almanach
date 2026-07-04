---
title: Utterance
description: A wrapper around alert content that tracks stability, priority, and per-feature announcing control before it reaches an UtteranceQueue.
category: api
library: utterance-queue
tags: [utterance-queue, Utterance, voicing, description, accessibility]
status: complete
related:
  - /api/utterance-queue/utterance-queue
  - /api/utterance-queue/response-packet-and-patterns
  - /accessibility/voicing
  - /accessibility/describing-dynamic-state
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Utterance

`Utterance` (from `scenerystack/utterance-queue`) wraps a piece of alert content — a string, a `TReadOnlyProperty<string>`, a function returning either, or a `ResponsePacket` — so that an `UtteranceQueue` can decide *when* and *whether* to speak it. A single `Utterance` instance can be re-added to a queue repeatedly (e.g. once per model step); the queue treats a re-add as "this content changed again," resetting its stability timer rather than piling up duplicate announcements.

```ts
import { Utterance } from 'scenerystack/utterance-queue';
```

## A minimal example

```ts
const utterance = new Utterance( {
  alert: 'Ball moved to the left wall',
  alertStableDelay: 500 // wait for rapid re-adds to settle before speaking
} );

// Re-adding the same Utterance while it changes resets its stability timer instead of queuing duplicates.
utteranceQueue.addToBack( utterance );
```

Changing what will be spoken next time just reassigns `alert`:

```ts
utterance.alert = 'Ball moved to the right wall';
utteranceQueue.addToBack( utterance );
```

## Constructor

```ts
new Utterance( providedOptions?: UtteranceOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `alert` | `null` | The content to speak: a string, `TReadOnlyProperty<string>`, a function returning either, or a `ResponsePacket` |
| `predicate` | `() => true` | Checked right before announcing; if it returns `false` the Utterance is silently dropped, no retry |
| `canAnnounceProperties` | `[]` | All must be `true` for this Utterance to announce at all (feeds `canAnnounceProperty`) |
| `descriptionCanAnnounceProperties` | `[]` | Additional gate specific to `AriaLiveAnnouncer`/description output |
| `voicingCanAnnounceProperties` | `[]` | Additional gate specific to `SpeechSynthesisAnnouncer`/voicing output |
| `alertStableDelay` | `200` (ms) | How long the Utterance must go un-re-added before it's considered "stable" and eligible to speak |
| `alertMaximumDelay` | `Number.MAX_VALUE` (ms) | Upper bound — forces announcement even if the Utterance never stabilizes |
| `announcerOptions` | `{}` | Forwarded verbatim to the `Announcer`'s `announce()` call |
| `priority` | `Utterance.DEFAULT_PRIORITY` (`1`) | See priority statics below |

## Methods and properties

| Member | Description |
| --- | --- |
| `getAlertText( respectResponseCollectorProperties? )` / `.alert` (getter) | Resolves the current alert to text (running functions/reading Properties as needed) |
| `.alert` (setter) / `setAlert( alert )` | Replaces the wrapped content |
| `priorityProperty` | `TProperty<number>` — mutate live to reprioritize an Utterance already sitting in a queue |
| `setAlertStableDelay( delay )` | Changes `alertStableDelay` after construction |
| `reset()` | Clears the cached "previous alert text"; does not affect the queue |
| `dispose()` | Disposes the internal control Properties; call when the Utterance is no longer needed |

## Priority statics

| Static | Value |
| --- | --- |
| `Utterance.TOP_PRIORITY` | `10` |
| `Utterance.HIGH_PRIORITY` | `5` |
| `Utterance.MEDIUM_PRIORITY` | `2` |
| `Utterance.DEFAULT_PRIORITY` | `1` |
| `Utterance.LOW_PRIORITY` | `0` |

A higher-priority Utterance interrupts a lower-priority one currently being spoken by an `UtteranceQueue`; use the statics rather than raw numbers so intent stays readable at call sites.

::: tip Re-adding the same instance is the intended debouncing mechanism
Because `UtteranceQueue.addToBack` recognizes an already-queued `Utterance` by identity and refreshes its position/timing instead of duplicating it, the idiomatic pattern for "announce this changing value" is to keep one long-lived `Utterance` per changing thing and call `addToBack` on every change, relying on `alertStableDelay` to coalesce rapid changes into a single spoken result — not to create a fresh `Utterance` per change.
:::
