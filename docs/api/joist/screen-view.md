---
title: ScreenView
description: The root Node of a Screen's view, with layoutBounds and visibleBoundsProperty.
category: api
library: joist
tags: [joist, ScreenView]
status: complete
related:
  - /api/joist/screen
  - /api/joist/sim
  - /api/scenery-phet/reset-all-button
  - /getting-started/your-first-simulation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ScreenView

`ScreenView` is a `Node` subclass that serves as the root of a [`Screen`](/api/joist/screen)'s view. It defines `layoutBounds` — a fixed design-time coordinate frame you lay content out against — and `visibleBoundsProperty`, which tracks how much of that coordinate frame is actually visible after `Sim` scales/letterboxes it to fit the real browser window.

::: warning `ScreenView` is exported from `scenerystack/sim`, not `scenerystack/joist`
Same gotcha as [`Sim`](/api/joist/sim) and [`Screen`](/api/joist/screen): despite living in the `joist` repository, it's exported from **`scenerystack/sim`**.
:::

```ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';
import { Text } from 'scenerystack/scenery';
```

## A minimal example

```ts
class MyScreenView extends ScreenView {
  public constructor( model: MyModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    const greetingText = new Text( 'Hello, SceneryStack!', {
      font: '24px sans-serif'
    } );
    greetingText.center = this.layoutBounds.center;
    this.addChild( greetingText );
  }
}
```

## Constructor

```ts
new ScreenView( providedOptions?: ScreenViewOptions )
```

`tandem` defaults to `Tandem.REQUIRED` and, when instrumented, is asserted to be named exactly `'view'` — pass `screenTandem.createTandem( 'view' )` from your `Screen`'s `createView` factory, not an arbitrary name.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `layoutBounds` | `new Bounds2( 0, 0, 1024, 618 )` | The fixed design-time coordinate frame content is laid out against |
| `includePDOMNodes` | `true` | Whether the screen-summary/play-area/control-area accessibility Nodes are added to the PDOM |
| `screenSummaryContent` | `null` | A `ScreenSummaryContent` Node describing the screen for the Voicing/description features |

## Public API

| Member | Description |
| --- | --- |
| `layoutBounds` | The fixed `Bounds2` this view's content is designed against — use `this.layoutBounds.center`, `.maxX`, etc. to position children |
| `visibleBoundsProperty` | `Property<Bounds2>`, in the same coordinate frame as `layoutBounds`; shrinks from the full `layoutBounds` when the actual browser window is a different aspect ratio, so UI meant to be reachable (buttons, controls) should stay inside it rather than assuming all of `layoutBounds` is always shown |
| `step( dt )` | No-op by default — override in a subclass if the view itself needs per-frame updates (most simulations only need the model to step) |
| `getVoicingOverviewContent()` / `getVoicingDetailsContent()` / `getVoicingHintContent()` | Supply the Voicing feature's "Overview"/"Details"/"Hint" responses; default implementations delegate to `screenSummaryContent` |

::: warning Don't set `pdomOrder` directly on a `ScreenView`
`ScreenView` throws if you call `setPDOMOrder()` on it. It maintains its own PDOM structure via `pdomPlayAreaNode` and `pdomControlAreaNode` (protected members) so every screen in every sim gets the same heading structure for screen readers — order your accessible content under those Nodes instead, not the `ScreenView` itself.
:::
