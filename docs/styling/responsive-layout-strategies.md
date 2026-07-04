---
title: Responsive Layout Strategies
description: How a ScreenView's fixed layoutBounds and scenery's layout containers together handle windows of different sizes and aspect ratios.
category: styling
tags: [scenery, ScreenView, layoutBounds, FlowBox, GridBox, responsive]
status: verified
related:
  - /styling/layout-container-conventions
  - /guides/building-your-first-screen
  - /guides/scenery-layout
prerequisites:
  - /styling/layout-container-conventions
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Responsive Layout Strategies

A SceneryStack `ScreenView` does not resize its content to match the browser window pixel-for-pixel. Instead it works in one fixed coordinate space — `layoutBounds` — that scenery scales and letterboxes to fit whatever window the sim is actually running in. "Responsive" therefore means two separate things layered on top of each other: how the *whole screen* adapts to arbitrary aspect ratios (`layoutBounds` + letterboxing, handled for you), and how *content within that fixed space* rearranges itself when it doesn't fit (`FlowBox`/`GridBox` responsive options, which you configure).

## Layer 1: layoutBounds and letterboxing

Every `ScreenView` declares a `layoutBounds` — by default `ScreenView.DEFAULT_LAYOUT_BOUNDS`, a `1024x618` `Bounds2` — that you design against as if it were the only size the sim would ever run at:

```ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';

export default class MyScreenView extends ScreenView {
  public constructor( providedOptions: ScreenViewOptions ) {
    super( providedOptions ); // layoutBounds defaults to 1024x618 unless overridden
    // Positioning below is always relative to this.layoutBounds, never the actual
    // browser window size.
  }
}
```

At runtime, scenery computes a uniform scale factor between `layoutBounds` and the actual browser viewport and applies it to the whole `ScreenView` — the content never stretches non-uniformly. Whatever doesn't fit the browser's aspect ratio (a very wide or very tall window relative to `layoutBounds`) is handled by extending the visible area symmetrically along one axis rather than distorting content; `this.visibleBoundsProperty` reports the actual visible region in the `ScreenView`'s local coordinates, which is wider or taller than `layoutBounds` on off-ratio windows.

```ts
// Anchor something to the true edge of the visible area (which may extend past
// layoutBounds on unusually wide/narrow windows), not just layoutBounds' own edge.
this.visibleBoundsProperty.link( visibleBounds => {
  backgroundRectangle.setRectBounds( visibleBounds );
} );
```

Use `layoutBounds` (not `visibleBoundsProperty`) for placing normal UI — control panels, buttons — so their position is stable and predictable; reserve `visibleBoundsProperty` for the rare case of something that should genuinely extend to fill whatever space exists (a full-bleed background).

## Layer 2: responsive content within layoutBounds

Within that fixed space, content still needs to react to its *container's* size — a control panel with a variable number of checkboxes, a row of buttons that needs to fit a narrower sidebar in one sim but not another. This is what `FlowBox`/`GridBox`'s `stretch` and `grow` options are for (see also [Layout Container Conventions](/styling/layout-container-conventions) for the non-responsive conventions):

```ts
import { HBox, Rectangle } from 'scenerystack/scenery';

const toolbar = new HBox( {
  spacing: 8,
  stretch: true,  // children are resized (in the perpendicular direction) to fill the container
  children: [
    new Rectangle( 0, 0, 10, 20, { fill: 'gray' } ),
    new Rectangle( 0, 0, 10, 20, { fill: 'gray' } )
  ]
} );

const spacer = new Rectangle( 0, 0, 1, 1 );
const rowWithFlexibleGap = new HBox( {
  spacing: 8,
  children: [ leftButton, spacer, rightButton ]
} );
spacer.layoutOptions = { grow: 1 }; // spacer expands to absorb all extra space, pushing rightButton to the far edge
```

`grow` distributes any leftover space in the container among cells proportional to their `grow` value (0 by default — a cell with `grow: 0` never expands); `stretch` resizes cells along the *cross* axis to match the container. Both only matter once the container itself has a size driven by something other than its own content — typically because it's inside another layout container, or explicitly sized with `preferredWidth`/`preferredHeight`.

## Putting the two layers together

A typical responsive screen: fixed `layoutBounds` for overall screen composition (so a control panel is always "near the top-right," regardless of window shape), with `FlowBox`/`GridBox` handling any internal region that itself needs to adapt (a panel whose row of icon buttons should redistribute if the panel's own width changes, e.g. because a Preferences option added or removed one).

::: tip Design against layoutBounds, verify against real aspect ratios
Build and position everything assuming `layoutBounds` is the only size that exists, then check the result against `?stringTest=long`-caliber extremes and the actual expected device range (phone portrait through desktop wide) using `visibleBoundsProperty`-driven elements — don't design *directly* against the browser window's live size, or every Node's position calculation has to account for a moving target.
:::
