---
title: Announcer, AriaLiveAnnouncer, and SpeechSynthesisAnnouncer
description: The Announcer hierarchy that UtteranceQueue hands resolved alert text to — aria-live DOM updates and Web Speech API synthesis.
category: api
library: utterance-queue
tags: [utterance-queue, Announcer, AriaLiveAnnouncer, SpeechSynthesisAnnouncer, voicing, accessibility]
status: verified
prerequisites:
  - /api/utterance-queue/utterance-queue
  - /api/utterance-queue/utterance
related:
  - /api/utterance-queue/utterance-queue
  - /api/utterance-queue/response-packet-and-patterns
  - /accessibility/voicing
  - /accessibility/describing-dynamic-state
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/reference/
---

# Announcer, AriaLiveAnnouncer, and SpeechSynthesisAnnouncer

An `Announcer` (from `scenerystack/utterance-queue`) is the output side of [`UtteranceQueue`](/api/utterance-queue/utterance-queue): the queue resolves an [`Utterance`](/api/utterance-queue/utterance)'s alert content, then calls `announcer.announce( utterance, resolvedResponse )`. Concrete subclasses implement *how* the text reaches the user — via hidden `aria-live` elements (`AriaLiveAnnouncer`) or the browser's Web Speech API (`SpeechSynthesisAnnouncer`).

```ts
import {
  UtteranceQueue,
  AriaLiveAnnouncer,
  SpeechSynthesisAnnouncer,
  Utterance
} from 'scenerystack/utterance-queue';
```

## A minimal example — AriaLiveAnnouncer

Interactive Description alerts typically use `AriaLiveAnnouncer`, which cycles through a small pool of off-screen `<p aria-live="…">` elements to avoid VoiceOver interrupting consecutive alerts:

```ts
const announcer = new AriaLiveAnnouncer();
document.body.appendChild( announcer.ariaLiveContainer ); // required once

const queue = new UtteranceQueue( announcer );
queue.addToBack( new Utterance( { alert: 'Temperature increased' } ) );
```

## A minimal example — SpeechSynthesisAnnouncer

Voicing features use `SpeechSynthesisAnnouncer`, which drives `window.speechSynthesis`:

```ts
const announcer = new SpeechSynthesisAnnouncer();
await announcer.initialize(); // picks a voice, handles browser quirks

const queue = new UtteranceQueue( announcer );
queue.addToBack( new Utterance( { alert: 'Beaker is half full' } ) );
```

## Shared `Announcer` contract

| Member | Description |
| --- | --- |
| `readyToAnnounce` | When `false`, `UtteranceQueue` waits before sending the next utterance — subclasses set this while output is in progress |
| `hasSpoken` | Whether this announcer has successfully spoken at least once (used to gate first-speech initialization) |
| `announcementCompleteEmitter` | Subclasses emit when a given `Utterance` finishes speaking so the queue can dequeue the next one |
| `respectResponseCollectorProperties` | Whether `ResponsePacket` alerts honor `responseCollector` feature toggles (Interactive Description vs. Voicing) |

`Announcer` extends `PhetioObject` and is abstract — simulation code normally receives a configured instance from the framework rather than subclassing it.

## `AriaLive` priority

`AriaLiveAnnouncer` accepts an `ariaLivePriority` option on each `announce()` call, using the `AriaLive` enumeration:

| Value | Effect |
| --- | --- |
| `AriaLive.POLITE` | Updates a polite `aria-live` region — waits for a pause in screen-reader speech |
| `AriaLive.ASSERTIVE` | Updates an assertive region — interrupts current speech |

## Choosing an announcer

| Class | Channel | Typical use |
| --- | --- | --- |
| `AriaLiveAnnouncer` | Hidden DOM `aria-live` regions | Interactive Description alerts independent of focus |
| `SpeechSynthesisAnnouncer` | Web Speech API | Voicing spoken responses |

Both plug into the same [`UtteranceQueue`](/api/utterance-queue/utterance-queue) API — the queue handles timing, priority, and stability; the announcer handles platform output.
