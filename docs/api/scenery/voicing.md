---
title: Voicing
description: The Voicing trait's class-level API - response Properties, speak methods, and how to compose it into a Node.
category: api
library: scenery
tags: [scenery, Voicing, voicing, speech, accessibility]
status: complete
related:
  - /accessibility/voicing
  - /api/scenery/interactive-highlighting
  - /api/scenery/parallel-dom-deep-dive
prerequisites:
  - /accessibility/voicing
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Voicing

This page is the **class-level API reference** for the `Voicing` trait (from `scenerystack/scenery`) — its options, Properties, and methods as defined in source. For what Voicing is, why it's layered on top of the PDOM rather than replacing it, and worked examples, read the narrative guide at [Voicing](/accessibility/voicing) first; this page assumes that context and only documents the surface itself.

`Voicing` is a mixin function: `Voicing( Node )` (or `Voicing( SomeNodeSubclass )`) returns a class with the response Properties and speak methods below, layered on top of [`InteractiveHighlighting`](/api/scenery/interactive-highlighting) (so every `Voicing` Node is also automatically interactive-highlighting-capable).

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

## Options / response Properties

These are `Voicing`'s mutator keys (`VOICING_OPTION_KEYS` in source):

| Option | Effect |
| --- | --- |
| `voicingNameResponse` | The "what is it" response — a `VoicingResponse` (string, `null`, or a function/Property resolving to one) |
| `voicingObjectResponse` | The "current state" response |
| `voicingContextResponse` | The "what changed elsewhere" response |
| `voicingHintResponse` | The "how to interact" response |
| `voicingResponsePatternCollection` | A `ResponsePatternCollection` controlling how the four responses above are combined into spoken sentences |
| `voicingIgnoreVoicingManagerProperties` | If `true`, this Node's speech ignores the global response-category preferences (`responseCollector`) that normally let users silence hints, etc. |
| `voicingUtterance` | A specific `Utterance` instance to funnel all of this Node's speech through, instead of an internally-created one |
| `voicingFocusListener` | The listener invoked on DOM focus; defaults to speaking the full response. Pass `null` to suppress automatic speech-on-focus |
| `voicingPressable` | If `true`, attaches a `VoicingActivationResponseListener` so responses are also spoken on press, not just focus |

Each option has a matching getter/setter pair (`setVoicingNameResponse()` / `voicingNameResponse`, etc.), consistent with the rest of scenery's mutator pattern.

## Speak-on-demand methods

| Method | Speaks |
| --- | --- |
| `voicingSpeakFullResponse( options? )` | All four response categories currently assigned to the Node |
| `voicingSpeakResponse( options? )` | Only whatever response strings are passed in `options` |
| `voicingSpeakNameResponse( options? )` | The name response |
| `voicingSpeakObjectResponse( options? )` | The object response |
| `voicingSpeakContextResponse( options? )` | The context response |
| `voicingSpeakHintResponse( options? )` | The hint response |

`SpeakingOptions` accepts an `utterance` override alongside the response text, for one-off calls that shouldn't use `voicingUtterance`.

::: tip `Voicing` composes `InteractiveHighlighting` automatically
`VoicingOptions` extends `InteractiveHighlightingOptions`, and the trait's implementation class extends `InteractiveHighlighting( Type )` internally — so a `Voicing`-enabled Node is already pointer-highlightable without separately mixing in [`InteractiveHighlighting`](/api/scenery/interactive-highlighting). Mixing both traits directly on the same class is redundant and unnecessary.
:::
