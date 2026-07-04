---
title: ResponsePacket and ResponsePatternCollection
description: Structuring a spoken response into name/object/context/hint categories, and controlling how those categories are combined into one string.
category: api
library: utterance-queue
tags: [utterance-queue, ResponsePacket, ResponsePatternCollection, voicing, accessibility]
status: verified
prerequisites:
  - /api/utterance-queue/utterance
  - /api/utterance-queue/utterance-queue
related:
  - /api/utterance-queue/utterance
  - /api/utterance-queue/utterance-queue
  - /accessibility/voicing
  - /accessibility/describing-dynamic-state
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ResponsePacket and ResponsePatternCollection

`ResponsePacket` (from `scenerystack/utterance-queue`) is the standard way to give an `Utterance` structured content for the Voicing feature instead of a single flat string. It splits a response into four independently-enable-able categories — **name**, **object**, **context**, and **hint** — so a user's response-level preferences (toggling "hear hints" off, say) apply automatically without every call site re-implementing the logic. `ResponsePatternCollection` supplies the string template used to stitch whichever categories are enabled into one final string, controlling their order and punctuation.

```ts
import { ResponsePacket, ResponsePatternCollection, Utterance } from 'scenerystack/utterance-queue';
```

## A minimal example

```ts
const packet = new ResponsePacket( {
  nameResponse: 'Ball',
  objectResponse: 'now at the left wall',
  contextResponse: 'Sound is playing',
  hintResponse: 'Press space to launch again'
} );

const utterance = new Utterance( { alert: packet } );
utteranceQueue.addToBack( utterance );
```

When the `Utterance` is announced, its content is resolved through the process-wide `responseCollector`, which reads each category's Property (e.g. "are hints enabled") and assembles only the enabled parts using the matching pattern from `packet.responsePatternCollection` — by default `ResponsePatternCollection.DEFAULT_RESPONSE_PATTERNS`, e.g. `'{{NAME}}, {{OBJECT}}, {{CONTEXT}} {{HINT}}'` when all four are present.

## `ResponsePacketOptions`

| Option | Default | Effect |
| --- | --- | --- |
| `nameResponse` | `null` | Labels the element — usually the same content as its accessible name |
| `objectResponse` | `null` | Describes the element's current state (e.g. a slider's value) |
| `contextResponse` | `null` | Describes surrounding effects of the interaction |
| `hintResponse` | `null` | A hint about how to interact further |
| `ignoreProperties` | `false` | If `true`, all four responses are always spoken regardless of `responseCollector`'s enable/disable Properties |
| `responsePatternCollection` | `ResponsePatternCollection.DEFAULT_RESPONSE_PATTERNS` | Which template set to combine enabled categories with |

Each of the four responses accepts a plain string/number, a `TReadOnlyProperty<string>`, or a zero-arg function returning either (`VoicingResponse`) — evaluated fresh each time the packet is spoken, so a response can reflect live model state.

## Methods

| Method | Description |
| --- | --- |
| `.nameResponse` / `.objectResponse` / `.contextResponse` / `.hintResponse` (getters) | Resolve the corresponding field to its current text/value |
| `setNameResponse()` / `setObjectResponse()` / `setContextResponse()` / `setHintResponse()` | Replace a field's content in place, so one long-lived `ResponsePacket` can be reused as state changes |
| `copy()` | Returns a new `ResponsePacket` with the same (resolved) field values |
| `serialize()` | Returns a plain options object with all four fields resolved, plus `ignoreProperties` and `responsePatternCollection` |

## `ResponsePatternCollection`

A `ResponsePatternCollection` holds one template string per possible combination of the four categories (`name`, `nameObject`, `nameObjectContextHint`, ..., 15 combinations total), keyed with `{{NAME}}`/`{{OBJECT}}`/`{{CONTEXT}}`/`{{HINT}}` placeholders. Construct one with only the templates you want to override — anything omitted falls back to `DEFAULT_RESPONSE_PATTERNS`'s value for that key:

```ts
const packet = new ResponsePacket( {
  nameResponse: 'Ball',
  objectResponse: 'moving fast',
  responsePatternCollection: ResponsePatternCollection.OBJECT_RESPONSE_FIRST_PATTERNS
} );
```

| Static instance | Behavior |
| --- | --- |
| `ResponsePatternCollection.DEFAULT_RESPONSE_PATTERNS` | Name, then object, then context, then hint |
| `ResponsePatternCollection.OBJECT_RESPONSE_FIRST_PATTERNS` | Object response spoken before the name response |
| `ResponsePatternCollection.CONTEXT_RESPONSE_FIRST_PATTERNS` | Context response spoken before both name and object |

::: tip Mutate the packet, not the Utterance, as state changes
Because `ResponsePacket`'s setters let you update `nameResponse`/`objectResponse`/etc. in place, the idiomatic pattern is one long-lived `ResponsePacket` (often owned by the Node it describes) whose fields you update as model state changes, wrapped once in a long-lived `Utterance` that gets re-added to the queue — mirroring the same "reuse the instance" pattern `Utterance` itself expects. Building a brand-new `ResponsePacket` and `Utterance` on every change works but discards the queue's ability to recognize "this is the same alert, just updated."
:::
