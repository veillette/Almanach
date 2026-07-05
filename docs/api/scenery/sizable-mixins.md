---
title: Sizable, WidthSizable, and HeightSizable
description: The mixins that let a custom Node expose a settable preferred/minimum size so layout containers can resize it.
category: api
library: scenery
tags: [scenery, Sizable, WidthSizable, HeightSizable, layout]
status: complete
related:
  - /api/scenery/flow-box
  - /api/scenery/grid-box
  - /api/scenery/node
  - /guides/scenery-layout
prerequisites:
  - /api/scenery/node
  - /api/scenery/flow-box
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Sizable, WidthSizable, and HeightSizable

By default, a `Node`'s size is whatever its content makes it — layout containers like [`FlowBox`](/api/scenery/flow-box) and [`GridBox`](/api/scenery/grid-box) can position such a Node, but can't make it *fill* available space, because it has no way to be told "be this wide." `WidthSizable`, `HeightSizable`, and `Sizable` (all from `scenerystack/scenery`) are mixin traits that add exactly that capability: a settable `preferredWidth`/`preferredHeight` the layout container writes to, and a `minimumWidth`/`minimumHeight` the component reports back so the container knows how small it can be shrunk. `Sizable` is just `WidthSizable` and `HeightSizable` combined, with `Dimension2`-based convenience accessors on top.

```ts
import { Node, Rectangle, Sizable, HBox } from 'scenerystack/scenery';

class FillBar extends Sizable( Node ) {
  private readonly background: Rectangle;

  public constructor() {
    super();
    this.background = new Rectangle( 0, 0, 0, 20, { fill: 'teal' } );
    this.addChild( this.background );

    // Mutate sizable options AFTER the super() call, in a later mutate() — see the warning below.
    this.mutate( { minimumWidth: 20 } );

    this.preferredWidthProperty.link( preferredWidth => {
      this.background.rectWidth = preferredWidth ?? this.minimumWidth ?? 0;
    } );
  }
}

const bar = new FillBar();
bar.layoutOptions = { stretch: true, grow: 1 };

const row = new HBox( { children: [ bar ], stretch: true } );
```

Once `bar` is `WidthSizable`, `HBox`/`FlowBox` recognizes it as resizable and — combined with `stretch`/`grow` [layout options](/api/scenery/flow-box) — will set its `preferredWidth` to fill the row, instead of leaving it at its natural (zero, in this example) content width.

## Options (per trait)

| Option | Default | Effect |
| --- | --- | --- |
| `preferredWidth` / `preferredHeight` | `null` | Set by the parent layout container (in the parent coordinate frame); the component should try to make `node.width`/`node.height` match this |
| `minimumWidth` / `minimumHeight` | `null` | Set by the component itself, to report the smallest size it can render acceptably; usually derived from `localMinimumWidth`/`localMinimumHeight` |
| `localPreferredWidth` / `localPreferredHeight` | `null` | The same preferred size, in the Node's own local coordinate frame — kept in sync with the parent-frame version automatically as the transform changes |
| `localMinimumWidth` / `localMinimumHeight` | `null` | The local-frame minimum size — this is usually the one a resizable component sets directly |
| `widthSizable` / `heightSizable` | `true` | Whether this Node currently accepts a preferred size from its layout container at all; set `false` to opt a specific instance out |

`Sizable` adds `preferredSize`/`minimumSize`/`localPreferredSize`/`localMinimumSize` as `Dimension2`-valued get/set pairs over both dimensions at once, plus a single `sizable` boolean covering both `widthSizable` and `heightSizable`.

## Checking whether an arbitrary Node participates

`scenerystack/scenery` also exports type-check helpers for code that receives an arbitrary `Node` and needs to know whether it supports sizing before touching these properties:

| Helper | Checks |
| --- | --- |
| `isWidthSizable( node )` / `isHeightSizable( node )` / `isSizable( node )` | Whether a Node's *current* `widthSizable`/`heightSizable`/`sizable` value is `true` |
| `extendsWidthSizable( node )` / `extendsHeightSizable( node )` / `extendsSizable( node )` | Whether a Node was constructed *with* the trait at all, regardless of its current boolean value |

::: warning Set sizable options from a later `mutate()`, not the constructor options passed to `super()`
The properties these mixins add (`preferredWidthProperty`, etc.) aren't initialized until partway through the mixed-in constructor. If you pass `widthSizable`-related options directly into the `Node` options object handed to `super()` in your subclass constructor, they'll fail — assertions catch this, but it's easy to trip over. Apply them via a follow-up `this.mutate( { ... } )` call after `super()` returns, as in the example above.
:::
