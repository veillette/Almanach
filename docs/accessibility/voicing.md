---
title: Voicing
description: Speech-synthesis descriptions triggered by interaction, layered on the PDOM.
category: accessibility
tags: [scenery, voicing, speech]
status: complete
related:
  - /accessibility/pdom
  - /accessibility/describing-dynamic-state
  - /accessibility/focus-highlights
prerequisites:
  - /accessibility/pdom
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Voicing

Voicing is scenery's feature for speaking descriptions aloud via HTML5 `SpeechSynthesis`, layered on top of the [Parallel DOM](/accessibility/pdom) rather than replacing it — a screen reader user gets the PDOM as usual, while a sighted user who enables Voicing (a PhET-specific preference, distinct from running a full screen reader) hears the same kind of information spoken directly by the simulation.

## The four response categories

Voicing organizes what's spoken into four kinds of response, all optional:

| Response | Describes |
| --- | --- |
| `voicingNameResponse` | What the object is (analogous to `accessibleName`) |
| `voicingObjectResponse` | The object's current state |
| `voicingContextResponse` | What changed elsewhere as a result of interacting with it |
| `voicingHintResponse` | Supporting guidance on how to interact with it |

## Adding Voicing to a Node

`Voicing` is a trait (mixin) applied to a `Node` subclass — most simulation code instead reaches for the ready-made `VoicingText` (from `scenerystack/scenery`) for static labeled content, or mixes `Voicing` directly into an interactive component:

```ts
import { VoicingText } from 'scenerystack/scenery';

// Speaks its own text on request (e.g. via a "read" gesture in Voicing mode)
const instructions = new VoicingText( 'Drag the ball to launch it.' );
```

For an interactive Node, compose `Voicing` with `Node` and set the response strings as options:

```ts
import { Node, Voicing } from 'scenerystack/scenery';

class LaunchButtonNode extends Voicing( Node ) {
  public constructor() {
    super( {
      tagName: 'button',
      accessibleName: 'Launch',
      voicingNameResponse: 'Launch',
      voicingHintResponse: 'Launches the ball at the current angle and speed.'
    } );
  }
}
```

Every Node that composes `Voicing` speaks its full response automatically when it receives focus — you don't need to call anything for the focus case.

## Speaking on demand

For responses tied to something other than focus (a value change, a button press), call one of the `voicingSpeak*` methods directly. Update the response content first, then speak it — this is the same pattern used throughout `sun` components:

```ts
class CountDisplay extends Voicing( Node ) {
  public updateCount( count: number ): void {
    this.voicingObjectResponse = `${count} items selected`;
    this.voicingSpeakResponse( { objectResponse: this.voicingObjectResponse } );
  }
}
```

| Method | Speaks |
| --- | --- |
| `voicingSpeakFullResponse( options? )` | All four response categories assigned to the Node |
| `voicingSpeakResponse( options? )` | Only whatever is passed in `options` — none of the Node's assigned responses by default |
| `voicingSpeakNameResponse( options? )` | The name response (plus anything else passed in `options`) |
| `voicingSpeakObjectResponse( options? )` | The object response |
| `voicingSpeakContextResponse( options? )` | The context response |
| `voicingSpeakHintResponse( options? )` | The hint response |

Each speak call still respects the user's response-category preferences (via `responseCollector`) — if the user has disabled hints, `voicingHintResponse` content is silently skipped even when included.

## Voicing vs. the PDOM

Voicing content and PDOM content (`accessibleName`, `descriptionContent`, `helpText`; see [The Parallel DOM](/accessibility/pdom)) are deliberately separate systems that often carry *similar but not identical* wording — the PDOM is read by conventional screen readers with their own navigation model, while Voicing content is spoken directly by the sim in response to specific gestures/focus. Most components set both, and it's fine (often correct) for the phrasing to differ slightly given the different context each is heard in.

::: tip Voicing requires an explicit user opt-in
Voicing speech only plays once the user has enabled it via preferences (it is not the same as a screen reader, and is off by default) — during development, remember that a `Voicing`-enabled Node's responses are silent until Voicing is turned on, even though the response strings are already assigned.
:::
