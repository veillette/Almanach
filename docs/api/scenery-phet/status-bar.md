---
title: StatusBar
description: The scenery-phet base class for a resizing bar pinned to the top of a screen, handling only geometry — subclasses decide what content goes in it.
category: api
library: scenery-phet
tags: [scenery-phet, StatusBar]
status: complete
related:
  - /api/scenery-phet/question-bar
  - /api/vegas/status-bars
  - /api/joist/screen-view
prerequisites:
  - /api/dot/bounds2
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# StatusBar

`StatusBar` (from `scenerystack/scenery-phet`) is the base class for a `Rectangle` bar that spans the top of a screen and resizes/repositions itself to track the browser's visible bounds. It handles only geometry — sizing the bar to the current `visibleBoundsProperty`, and exposing a `positioningBoundsProperty` that subclasses use to lay out their own content flush with the bar's (margin-adjusted) left/right edges. `StatusBar` itself adds no content; it exists purely to be subclassed.

::: tip Looking for the game status bars?
Most sims never construct `StatusBar` directly. If you're building a standard PhET game screen, use `vegas`'s [`FiniteStatusBar` or `InfiniteStatusBar`](/api/vegas/status-bars) instead — both extend this class and add the score display, level text, and buttons for you. This page documents the shared base they (and [`QuestionBar`](/api/scenery-phet/question-bar)) build on.
:::

```ts
import { StatusBar } from 'scenerystack/scenery-phet';
import { Bounds2 } from 'scenerystack/dot';
```

## A minimal example

Subclassing `StatusBar` to add your own content:

```ts
class MyStatusBar extends StatusBar {
  public constructor( layoutBounds: Bounds2, visibleBoundsProperty: TReadOnlyProperty<Bounds2> ) {
    super( layoutBounds, visibleBoundsProperty, {
      barFill: 'black',
      barHeight: 40
    } );

    const label = new Text( 'Level 1', { fill: 'white', font: StatusBar.DEFAULT_FONT } );
    this.addChild( label );

    // Keep the label vertically centered and flush left as the bar resizes.
    this.positioningBoundsProperty.link( bounds => {
      label.left = bounds.left;
      label.centerY = bounds.centerY;
    } );
  }
}
```

## Constructor

```ts
new StatusBar(
  layoutBounds: Bounds2,
  visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
  providedOptions?: StatusBarOptions
)
```

`layoutBounds` is the `ScreenView`'s fixed design-space bounds; `visibleBoundsProperty` is its actual on-screen visible bounds, which can be wider than `layoutBounds` on ultra-wide browser windows. `StatusBar` needs both so it can choose, per `dynamicAlignment`, whether to stretch content to the real browser width or keep it pinned to the dev-time layout width.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `barFill` / `barStroke` | `'lightGray'` / `null` | Paint for the bar's background `Rectangle` |
| `barHeight` | `50` | Height of the bar, in the same units as `layoutBounds` |
| `xMargin` / `yMargin` | `10` / `8` | Margin subtracted from the bar's bounds to produce `positioningBoundsProperty` |
| `floatToTop` | `false` | `true` floats the bar to the top of the browser's actual `visibleBounds` (it can move as the window resizes); `false` keeps it fixed at the top of `layoutBounds` |
| `dynamicAlignment` | `true` | `true` keeps content aligned to the left/right edges of `visibleBounds` (the real browser window); `false` aligns to `layoutBounds` instead |

## Members

| Member | Description |
| --- | --- |
| `positioningBoundsProperty` (protected) | A `TReadOnlyProperty<Bounds2>` — the margin-adjusted bounds subclasses should position their content within; updates automatically as `visibleBoundsProperty` changes |
| `StatusBar.DEFAULT_FONT` (static) | `PhetFont( 20 )` — the font subclasses should default to for bar text |
| `StatusBar.DEFAULT_TEXT_FILL` (static) | `Color.BLACK` — the text color subclasses should default to |

::: warning `positioningBoundsProperty` is `protected`
It's readable from subclasses (as shown above) but not from outside code holding a `StatusBar` reference — if you need to react to a status bar's layout externally, read `visibleBoundsProperty` yourself rather than reaching into `positioningBoundsProperty`.
:::
