---
title: GrabDragInteraction
description: The accessible "grab with Enter/Space, arrow-key drag, release with Escape" interaction pattern that mixes into an existing draggable Node's PDOM content.
category: api
library: scenery-phet
tags: [scenery-phet, GrabDragInteraction, GrabDragUsageTracker, GrabReleaseCueNode, keyboard, accessibility, drag]
status: complete
related:
  - /api/scenery-phet/keyboard-help-sections
  - /api/scenery-phet/group-sort-interaction
  - /api/scenery-phet/sound-drag-listeners
  - /accessibility/pdom
  - /accessibility/focus-highlights
prerequisites:
  - /accessibility/pdom
  - /api/scenery/keyboard-drag-listener
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# GrabDragInteraction

Dragging a `Node` with a `KeyboardDragListener` works as soon as the Node is focusable, but a lone focusable draggable object is a trap for keyboard users: arrow keys move it immediately on focus, competing with Tab for moving between other elements on the page. `GrabDragInteraction` (from `scenerystack/scenery-phet`) solves this with the standard two-state PDOM pattern used throughout PhET sims: the object starts as an "idle" `button` in the tab order ("Grab Ball"); pressing Space/Enter turns it into a focused, `application`-role "grabbed" `div` where the arrow keys now drag it; Escape (or Space/Enter again) releases it back to idle. It works like a mixin — you construct it with the target `Node` and a `KeyboardDragListener`, and it mutates that Node's PDOM content and swaps its input listeners as the state changes; you don't subclass anything.

```ts
import { GrabDragInteraction, KeyboardDragListener } from 'scenerystack/scenery-phet';
import { Node, RichDragListener } from 'scenerystack/scenery';

const ballNode = new Node( { cursor: 'pointer' } );

// Pointer dragging, wired up separately as usual.
const richDragListener = new RichDragListener( {
  positionProperty: ball.positionProperty,
  transform: modelViewTransform
} );
ballNode.addInputListener( richDragListener );

// The keyboard drag listener that will be added only while "grabbed".
const keyboardDragListener = new KeyboardDragListener( {
  positionProperty: ball.positionProperty,
  transform: modelViewTransform
} );

// interactionCueParent hosts the little "Press Space to grab/release" and
// "Use arrow keys" cue Nodes; it's usually the ScreenView itself.
const grabDragInteraction = new GrabDragInteraction( ballNode, keyboardDragListener, screenView, {
  objectToGrabString: 'Ball',
  tandem: tandem.createTandem( 'grabDragInteraction' )
} );
```

## Constructor

```ts
new GrabDragInteraction(
  node: Node,
  keyboardDragListener: KeyboardDragListener,
  interactionCueParent: Node,
  providedOptions?: GrabDragInteractionOptions
)
```

`node` is mutated in place with the PDOM options for whichever state it's currently in; `keyboardDragListener` is added to `node`'s input listeners only while grabbed; `interactionCueParent` is where the grab/drag cue Nodes are added as children (positioned relative to `node` automatically).

## Key options

| Option | Effect |
| --- | --- |
| `objectToGrabString` | The name filled into the default "Grab {{thing}}" idle-state label |
| `onGrab` / `onRelease` | Callbacks `( inputType ) => void`, called on the idle→grabbed / grabbed→idle transition; `inputType` is `'alternative'` (keyboard), `'pointer'`, or `'programmatic'` |
| `listenersWhileIdle` / `listenersWhileGrabbed` | Extra `TInputListener`s active only in that state — **never add listeners to the Node directly**, they must be registered here so `GrabDragInteraction` can swap them |
| `grabCueOptions`, `grabCuePosition`, `dragCueOptions` (via `dragCueNode`), `dragCuePosition` | Position and style the "Press Space to grab" / drag cue relative to the Node |
| `shouldShowGrabCueNode` / `shouldShowDragCueNode` | Predicates controlling whether each cue is currently visible; default to "until the user has successfully grabbed once with a keyboard" |
| `grabDragUsageTracker` | A shared `GrabDragUsageTracker` (see below), for coordinating cue visibility across multiple `GrabDragInteraction` instances |
| `supportsGestureDescription` | Whether to use the shorter, screen-reader-gesture-tuned label/help text instead of the desktop keyboard phrasing |
| `enabledProperty` | Disabling forces the interaction back to idle and blocks grabbing |
| `tandem` | Required, like most instrumented scenery-phet types |

## GrabDragUsageTracker

`GrabDragUsageTracker` is a small plain object tracking `numberOfGrabs`, `numberOfKeyboardGrabs`, and `shouldShowDragCue`. `GrabDragInteraction` creates its own by default, but you can construct one explicitly and pass it via `grabDragUsageTracker` to **share cueing state across multiple interaction instances** — for example, several identical draggable objects on one screen, where a keyboard user grabbing any one of them should be enough to stop showing "Grab" cues on all the others.

```ts
import { GrabDragUsageTracker, GrabDragInteraction } from 'scenerystack/scenery-phet';

const sharedTracker = new GrabDragUsageTracker();

const interactionA = new GrabDragInteraction( nodeA, dragListenerA, screenView, {
  grabDragUsageTracker: sharedTracker,
  tandem: tandemA
} );
const interactionB = new GrabDragInteraction( nodeB, dragListenerB, screenView, {
  grabDragUsageTracker: sharedTracker,
  tandem: tandemB
} );
```

## GrabReleaseCueNode

`GrabReleaseCueNode` is the small `Panel` — a Space key icon next to "Press Space to Grab or Release" text — that `GrabDragInteraction` shows near the idle-state Node on focus, until the user has grabbed with the keyboard at least once. It's built and owned internally (exposed read-only as `grabDragInteraction.grabCueNode` for repositioning only); most code never constructs one directly, though it's also the same cue Node reused by the [group-sort interaction](/api/scenery-phet/group-sort-interaction) for its own grab/release step.

::: warning Don't attach input listeners to the target Node directly
`GrabDragInteraction` interrupts and removes exactly the listeners it was given via `listenersWhileIdle`/`listenersWhileGrabbed` (plus the `keyboardDragListener` you passed to the constructor) whenever the state changes. A pointer listener added straight to the Node outside of that bookkeeping will keep firing in both states, which is rarely what you want — most sims instead attach ordinary pointer dragging (a plain `DragListener`/`RichDragListener`) directly to the Node as shown above, since pointer users aren't affected by the idle/grabbed PDOM split at all.
:::
