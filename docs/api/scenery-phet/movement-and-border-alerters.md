---
title: Movement and Border Alerters
description: Alerter, MovementAlerter, and BorderAlertsDescriber — utilities that announce which direction a dragged object moved and when it has hit the edge of its movement bounds.
category: api
library: scenery-phet
tags: [scenery-phet, Alerter, MovementAlerter, BorderAlertsDescriber, voicing, description, accessibility]
status: complete
related:
  - /accessibility/voicing
  - /accessibility/describing-dynamic-state
  - /api/utterance-queue/utterance
  - /api/scenery/keyboard-drag-listener
prerequisites:
  - /accessibility/voicing
  - /accessibility/describing-dynamic-state
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Movement and Border Alerters

When a screen-reader or Voicing user drags something around a bounded play area, they need spoken feedback for two things a sighted mouse user gets for free: which direction the object just moved, and whether it just ran into the edge of its allowed area. `Alerter`, `MovementAlerter`, and `BorderAlertsDescriber` (from `scenerystack/scenery-phet`) are the layered utilities that generate and dispatch that feedback — to both description (screen readers, via the PDOM) and Voicing (speech synthesis), depending on how they're configured.

```ts
import { MovementAlerter } from 'scenerystack/scenery-phet';

const movementAlerter = new MovementAlerter( ball.positionProperty, {
  descriptionAlertNode: ballNode,   // required for description alerts to reach an UtteranceQueue
  modelViewTransform: modelViewTransform
} );

// Typically called at the end of a drag (see PhET a11y convention below).
someDragListener.endDrag = () => movementAlerter.endDrag();
```

## Alerter: the generic base

`Alerter` is a small `EnabledComponent` that knows how to send an alertable (a string, a `ResponsePacket`, or an `Utterance`) to whichever queues are configured — it doesn't know anything about movement or direction itself. `MovementAlerter` extends it; you'd only reach for plain `Alerter` when building an unrelated alerting utility that wants the same to-Voicing/to-description plumbing.

| Option | Default | Effect |
| --- | --- | --- |
| `alertToVoicing` | `true` | If `true`, `alert()` also sends the alertable to the Voicing queue (requires the alertable to be an `Utterance`) |
| `descriptionAlertNode` | `null` | The `Node` used to reach a `Display`'s `UtteranceQueue` for description alerts; **no description alert is sent without this** |

| Method | Effect |
| --- | --- |
| `alert( alertable )` | Sends to Voicing (if enabled) and to description (if `descriptionAlertNode` is set), only while `enabled` |
| `addAccessibleResponse( alertable )` | Description-only alert, forwarded through `descriptionAlertNode` |

## MovementAlerter: describing which way something moved

`MovementAlerter` compares a `positionProperty`'s current value against the position at the last alert, converts the delta into one of eight compass directions (`UP`, `DOWN`, `LEFT`, `RIGHT`, and the four diagonals) using `Math.atan2` in the *view* coordinate frame (via an optional `modelViewTransform`), and speaks/describes the matching phrase from a `movementAlerts` map.

| Option | Default | Effect |
| --- | --- | --- |
| `movementAlerts` | The 8 default direction phrases ("up", "down and to the left", …) | Map from direction key to the alertable spoken for it; omit a key (or pass `{}`) to silence that direction |
| `modelViewTransform` | Identity transform | Converts model-frame positions to view-frame before computing the direction, so "up" always means visually up |
| `alertDiagonal` | `false` | If `false`, a diagonal move like up-and-left is split into two back-to-back alerts ("up", then "left") instead of one composite phrase |
| `borderAlertsOptions` | — | Forwarded to an internal `BorderAlertsDescriber` (see below) |

| Method | Effect |
| --- | --- |
| `alertDirectionalMovement()` | Computes and alerts the direction moved since the last alert; call after a drag changes the position |
| `endDrag( domEvent? )` | The typical hook: alerts directional movement, *then* asks the internal `BorderAlertsDescriber` whether a border was hit and alerts that too — PhET convention is to call this from a drag listener's `end` |
| `reset()` | Resets the last-alerted position and the border describer |

```ts
import { MovementAlerter } from 'scenerystack/scenery-phet';
import { RichDragListener } from 'scenerystack/scenery';

const movementAlerter = new MovementAlerter( ball.positionProperty, {
  descriptionAlertNode: ballNode,
  borderAlertsOptions: {
    boundsProperty: model.dragBoundsProperty
  }
} );

ballNode.addInputListener( new RichDragListener( {
  positionProperty: ball.positionProperty,
  transform: modelViewTransform,
  end: () => movementAlerter.endDrag()
} ) );
```

## BorderAlertsDescriber: the border-hit sub-describer

`BorderAlertsDescriber` is used internally by `MovementAlerter` (via `borderAlertsOptions`) to decide whether the current position sits exactly on the left/right/top/bottom edge of a bounds `Property`, and if so return the matching alert. It's rarely constructed directly, but its options are what you pass through `MovementAlerter`'s `borderAlertsOptions`:

| Option | Default | Effect |
| --- | --- | --- |
| `boundsProperty` | Infinite bounds (never triggers) | The drag-bounds `Property<Bounds2>` to check the position against |
| `leftAlert` / `rightAlert` / `topAlert` / `bottomAlert` | Default per-edge phrases | The alertable for each edge; pass `null` to skip alerting that edge |

`getAlertOnEndDrag( position, domEvent? )` is the method `MovementAlerter.endDrag()` calls; if the position is in a corner (touching two edges at once), an optional `domEvent` lets it prefer whichever edge matches the key that was actually pressed.

::: tip These generate alertables — they don't create the UtteranceQueue connection themselves
`Alerter`/`MovementAlerter` only produce the right *content*; getting that content to a screen reader still requires `descriptionAlertNode` to be an actual displayed `Node` connected to a `Display`, and getting it spoken via Voicing still requires the alerted `Utterance` to be registered the normal Voicing way. See [Voicing](/accessibility/voicing) and [Describing Dynamic State](/accessibility/describing-dynamic-state) for that layer.
:::
