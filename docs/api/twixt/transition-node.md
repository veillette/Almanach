---
title: TransitionNode
description: A Node that swaps between two child Nodes using an animated slide, wipe, or dissolve transition.
category: api
library: twixt
tags: [twixt, TransitionNode, Transition, Animation, Node]
status: complete
prerequisites:
  - /api/twixt/animation
related:
  - /api/twixt/animation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# TransitionNode

`TransitionNode` (from `scenerystack/twixt`) is a scenery `Node` that holds one piece of "current content" and can animate to a replacement, using a slide, wipe, or dissolve effect — the kind of transition used when swapping between screens, panels, or major UI states so the change doesn't feel abrupt. Internally it builds and runs a `Transition` (also from `scenerystack/twixt`), which is itself an [`Animation`](/api/twixt/animation) subclass specialized to animate two Nodes at once (one out, one in) instead of a single value.

```ts
import { TransitionNode } from 'scenerystack/twixt';
import { Node, Rectangle } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';

const visibleBoundsProperty = new Property( screenView.visibleBoundsProperty.value );

const panelA = new Rectangle( 0, 0, 400, 300, { fill: 'lightblue' } );
const panelB = new Rectangle( 0, 0, 400, 300, { fill: 'lightgreen' } );

const transitionNode = new TransitionNode( visibleBoundsProperty, {
  content: panelA
} );

// Later, animate to panelB with a leftward slide:
transitionNode.slideLeftTo( panelB, { duration: 0.5 } );
```

`TransitionNode` isn't self-stepping the way [`Animation`](/api/twixt/animation) is by default — call `transitionNode.step( dt )` from your `ScreenView`'s (or model's) `step()` callback for as long as the Node is displayed, so any in-progress transition actually advances.

## Constructor

```ts
new TransitionNode( transitionBoundsProperty: TReadOnlyProperty<Bounds2>, providedOptions?: TransitionNodeOptions )
```

`transitionBoundsProperty` should generally be a `ScreenView`'s `visibleBoundsProperty` — it tells `TransitionNode` the bounds that slides/wipes should traverse, and is also used as the default `clipArea` so content doesn't render outside those bounds mid-transition.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `content` | `null` | The initial child Node shown before any transition starts |
| `useBoundsClip` | `true` | Whether to set `clipArea` to `transitionBoundsProperty`'s value automatically, so transitioning content doesn't visibly overflow |
| `cachedNodes` | `[]` | Nodes to add as permanent (initially invisible) children up front, instead of adding/removing them from the scene graph on every transition — avoids repeated add/remove cost for content you'll transition to/from repeatedly |

`TransitionNodeOptions` also accepts ordinary `NodeOptions`, except `children` — `TransitionNode` manages its own children internally and asserts if `children` is provided directly.

## Methods

Each `*To` method starts a new transition to `content` (or to nothing, if `content` is `null`) and returns the underlying `Transition` for chaining `.then(...)` or listening to `endedEmitter`:

| Method | Effect |
| --- | --- |
| `slideLeftTo/slideRightTo/slideUpTo/slideDownTo( content, config? )` | Slides the current content out and the new content in, in the named direction |
| `wipeLeftTo/wipeRightTo/wipeUpTo/wipeDownTo( content, config? )` | Reveals the new content via a moving clip-area wipe, in the named direction |
| `dissolveTo( content, config? )` | Cross-fades opacity between the current and new content |
| `step( dt )` | Advances any in-progress transition by `dt` seconds — call this every frame |
| `interrupt()` | Immediately stops the current transition (if any), leaving both Nodes at their current animated values |

`config` in each case is the same shape as the corresponding `Transition` static factory's options (`SlideTransitionOptions`, `WipeTransitionOptions`, or `DissolveTransitionOptions`) — in practice, usually just `{ duration, easing }`.

::: tip Transition vs. Animation
`Transition` is not a separate concept from [`Animation`](/api/twixt/animation) — it *is* an `Animation` subclass that always animates two `targets` (the outgoing and incoming Node) in lockstep and resets both Nodes' animated attributes (`x`/`y`/`opacity`/`clipArea`, depending on the transition type) once it ends. You will rarely construct `Transition` directly; `TransitionNode`'s `*To` methods call `Transition`'s static factories (`Transition.slideLeft`, `Transition.dissolve`, etc.) for you and handle adding/removing the Nodes from the scene graph around the animation.
:::
