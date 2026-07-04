---
title: InteractiveHighlighting
description: The trait that shows a highlight on pointer hover for interactive Nodes, mirroring keyboard focus highlights.
category: api
library: scenery
tags: [scenery, InteractiveHighlighting, highlight, accessibility, pointer]
status: complete
related:
  - /accessibility/focus-highlights
  - /api/scenery/voicing
  - /api/scenery/focus-manager
prerequisites:
  - /accessibility/focus-highlights
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# InteractiveHighlighting

`InteractiveHighlighting` (from `scenerystack/scenery`) is a trait that gives a Node a highlight on **pointer** hover (mouse/touch), the same visual language as the keyboard-focus highlights covered in [Focus Highlights](/accessibility/focus-highlights) — it exists so mouse and touch users get the same "this is interactive" affordance that keyboard users get for free from focus. Highlight visibility is gated behind a user preference (`FocusManager.interactiveHighlightsVisibleProperty`, see [`FocusManager`](/api/scenery/focus-manager)), so it does nothing until that preference is enabled.

`InteractiveHighlighting` is a mixin function, applied the same way as `Voicing`:

```ts
import { Node, InteractiveHighlighting, Rectangle } from 'scenerystack/scenery';

const iconNode = new Rectangle( 0, 0, 40, 40, { fill: 'teal' } );

class HoverableIcon extends InteractiveHighlighting( Node ) {
  public constructor() {
    super( {
      children: [ iconNode ],
      cursor: 'pointer',
      tagName: 'button',
      accessibleName: 'Play'
    } );
  }
}
```

For cases where composing a trait is more friction than it's worth, `InteractiveHighlightingNode` (from `scenerystack/scenery`) is a ready-made `InteractiveHighlighting( Node )` subclass:

```ts
import { InteractiveHighlightingNode } from 'scenerystack/scenery';

const hoverable = new InteractiveHighlightingNode( {
  children: [ iconNode ],
  cursor: 'pointer'
} );
```

## Options

These are `InteractiveHighlighting`'s mutator keys (`INTERACTIVE_HIGHLIGHTING_OPTIONS` in source):

| Option | Effect |
| --- | --- |
| `interactiveHighlight` | A `Shape \| Node \| 'invisible' \| null` highlight shown on pointer hover, analogous to `focusHighlight` from `ParallelDOM`. `null`/omitted falls back to the Node's bounds-based default |
| `interactiveHighlightLayerable` | If `true`, you take responsibility for placing the highlight Node in the scene graph yourself, rather than scenery's overlay drawing it on top |
| `interactiveHighlightEnabled` | `boolean` — turns the highlight-on-hover behavior on or off for this specific Node without removing the trait |

## Reading highlight-active state

| Member | Effect |
| --- | --- |
| `isInteractiveHighlightActiveProperty` | `TReadOnlyProperty<boolean>` — `true` while this Node's interactive highlight is currently displayed |
| `isInteractiveHighlighting( node )` | Exported standalone function (from `scenerystack/scenery`) — a type guard checking whether an arbitrary `Node` has composed this trait, preferred over `instanceof` checks against the mixin |

::: tip `Voicing` already includes `InteractiveHighlighting`
If a Node composes [`Voicing`](/api/scenery/voicing), it is already `InteractiveHighlighting`-capable — `Voicing`'s implementation extends `InteractiveHighlighting( Type )` internally. Reach for `InteractiveHighlighting` on its own only for Nodes that need a hover highlight but don't need Voicing's spoken responses.
:::
