---
title: HighlightNode
description: An HBox of two gradient-faded vertical bars used as the press/hover highlight behind navigation bar buttons.
category: api
library: joist
tags: [joist, HighlightNode, navigation-bar, highlight]
status: complete
related:
  - /api/joist/navigation-bar
  - /api/joist/joist-button
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# HighlightNode

`HighlightNode` (from `scenerystack/joist`) draws the soft highlight bar joist uses behind navigation-bar buttons (screen icons, the PhET menu button, and similar) to indicate hover/press state — two thin vertical `Rectangle`s, each filled with a `LinearGradient` that fades from transparent at the top and bottom to a solid color in the middle, separated by a gap equal to the requested width.

```ts
import { HighlightNode } from 'scenerystack/joist';

const buttonHighlight = new HighlightNode( 40, 32, {
  fill: 'white',
  highlightWidth: 2
} );

buttonHighlight.visible = false; // toggle on hover/press, as NavigationBar's own buttons do
```

## Constructor

```ts
new HighlightNode( width: number, height: number, providedOptions?: HighlightNodeOptions )
```

`width` becomes the `HBox`'s `spacing` between the two bars (so it's the gap the highlight leaves open for the button content), and `height` sets both bars' rectangle height.

## Options

`HighlightNodeOptions` extends `HBoxOptions` with:

| Option | Default | Effect |
| --- | --- | --- |
| `fill` | `'white'` | The color at the gradient's center; `HighlightNode` derives a fully-transparent version of the same color for the gradient's top/bottom stops |
| `highlightWidth` | `1` | The width (thickness) of each of the two vertical bars |

`HighlightNode` also forces `pickable: false` (a highlight should never intercept input meant for the button it's decorating) and sets `children` internally — passing either as an option is redundant with what the constructor already does.

::: tip `HighlightNode` is purely decorative — visibility is your responsibility
`HighlightNode` doesn't listen to any pointer/focus state itself; it's a static pair of gradient rectangles. The Node that owns it (e.g. a navigation bar screen button) is responsible for toggling its `visible` property in response to hover/press/focus, typically via a [`PressListener`](/api/scenery/press-listener)'s `isHighlightedProperty`.
:::
