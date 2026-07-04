---
title: Describing Dynamic State
description: Writing description content that updates as model state changes.
category: accessibility
tags: [pdom, description, accessibility]
status: verified
related:
  - /accessibility/pdom
  - /accessibility/voicing
prerequisites:
  - /accessibility/pdom
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Describing Dynamic State

Static `descriptionContent` (see [The Parallel DOM](/accessibility/pdom)) is enough for content that never changes, but most simulation state does change — a ball's speed, a switch's position, a count of selected items. This page covers the two mechanisms for keeping description content in sync with that state: **reactive description strings** (read on demand, e.g. when focus lands) and **`addAccessibleResponse`** (announced proactively, the instant something changes).

## Reactive descriptions with a derived string Property

Every PDOM text option (`descriptionContent`, `accessibleParagraph`, `accessibleName`, `innerContent`, …) accepts either a plain `string` or a `TReadOnlyProperty<string>`. Passing a `DerivedProperty` means the description text updates automatically whenever its dependencies change — no manual re-assignment needed:

```ts
import { DerivedProperty } from 'scenerystack/axon';
import { Node } from 'scenerystack/scenery';
import { StringUtils } from 'scenerystack/phetcommon';

const speedDescriptionProperty = new DerivedProperty(
  [ ball.speedProperty ],
  speed => StringUtils.fillIn( 'The ball is moving at {{speed}} meters per second.', {
    speed: speed.toFixed( 1 )
  } )
);

const ballNode = new Node( {
  tagName: 'div',
  descriptionContent: speedDescriptionProperty
} );
```

`StringUtils.fillIn` (from `scenerystack/phetcommon`) fills `{{placeholder}}` tokens in a template string — the standard way to build description sentences that embed a formatted value, and it composes cleanly with i18n since the template itself can be a translated `StringProperty`.

Because `descriptionContent` is just bound to the `Property`, this same pattern works for `accessibleParagraph`, `helpText`, or `accessibleName` on any Node.

## Announcing changes as they happen with addAccessibleResponse

A reactive description only gets *read* the next time something visits it (focus, PDOM tab order, a screen reader's virtual cursor). Some state changes need to be spoken immediately, regardless of where focus is — e.g. "Boundary reached" when a draggable object hits the edge of its play area. For that, call `addAccessibleResponse` on any Node, which queues the text on that `Display`'s `descriptionUtteranceQueue` (an `aria-live="polite"` region by default — pass an `Utterance` with `announcerOptions: { ariaLivePriority: AriaLive.ASSERTIVE }` if a response must interrupt) for every accessible `Display` the Node is connected to:

```ts
class BallNode extends Node {
  private checkBoundary(): void {
    if ( this.model.isAtBoundary() ) {
      this.addAccessibleResponse( 'Boundary reached.' );
    }
  }
}
```

`addAccessibleResponse` accepts a plain string, a `TReadOnlyProperty<string>`, or an `Utterance` (from `scenerystack/utterance-queue`) if you need finer control over interruption/priority behavior. It silently no-ops if the Node (or an ancestor) is currently invisible, so you don't need to guard calls with a visibility check yourself.

## Choosing between the two

| Situation | Mechanism |
| --- | --- |
| Description should reflect current state whenever it's read (focus, screen-reader navigation) | Reactive `Property<string>` on `descriptionContent`/`accessibleParagraph` |
| Something just happened and the user should hear about it right now, independent of focus | `addAccessibleResponse( ... )` |
| Both — e.g. state changed *and* it's worth updating what's read later too | Do both: update the derived Property (or the underlying model Property it derives from) and call `addAccessibleResponse` for the immediate announcement |

## The spoken (Voicing) analog

`addAccessibleResponse` writes to the PDOM's description-utterance queue, which screen readers consume. [Voicing](/accessibility/voicing) is a separate, PhET-specific system for the same *kind* of problem — speaking content in response to interaction — but through direct speech synthesis rather than the PDOM's aria-live mechanism, and only when the user has explicitly enabled it. A component's dynamic-state announcements often need to be written for both systems with similar (not necessarily identical) wording.

::: tip Keep dynamic descriptions concise
A `DerivedProperty` that recomputes a long sentence on every tiny model change (every animation frame, say) produces noisy, hard-to-follow description content. Recompute only on meaningful state transitions — round values, and prefer `addAccessibleResponse` for a one-off "it happened" announcement over trying to make static description content narrate continuous motion.
:::
