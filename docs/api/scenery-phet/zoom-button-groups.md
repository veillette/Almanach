---
title: Zoom Button Groups
description: ZoomButton, ZoomButtonGroup, PlusMinusZoomButtonGroup, and MagnifyingGlassZoomButtonGroup — the standard zoom-in/zoom-out button pair bound to a ranged numeric Property.
category: api
library: scenery-phet
tags: [scenery-phet, ZoomButton, ZoomButtonGroup, PlusMinusZoomButtonGroup, MagnifyingGlassZoomButtonGroup, button]
status: complete
related:
  - /api/scenery-phet/magnifying-glass-node
  - /api/sun/rectangular-push-button
  - /api/dot/range
prerequisites:
  - /api/dot/range
  - /api/sun/rectangular-push-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Zoom Button Groups

`ZoomButtonGroup` is the base class for a paired "zoom in" / "zoom out" `RectangularPushButton` control bound to a ranged numeric `Property` (`TRangedProperty` — a `Property<number>` with a `.range`). It's `protected`-constructed, so you never instantiate it directly; instead pick one of its two concrete subclasses, `PlusMinusZoomButtonGroup` (flat "+"/"−" signs) or `MagnifyingGlassZoomButtonGroup` (magnifying-glass icons with "+"/"−" inside). Separately, `ZoomButton` is a standalone single button with the same magnifying-glass-plus-sign look, for building a custom zoom UI rather than the standard paired group.

```ts
import { PlusMinusZoomButtonGroup, MagnifyingGlassZoomButtonGroup } from 'scenerystack/scenery-phet';
import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
```

## A minimal example

```ts
const zoomLevelProperty = new NumberProperty( 2, { range: new Range( 0, 5 ) } );

const zoomButtonGroup = new PlusMinusZoomButtonGroup( zoomLevelProperty, {
  orientation: 'horizontal',
  tandem: tandem.createTandem( 'zoomButtonGroup' )
} );

// Or, with magnifying-glass icons instead of flat +/- signs:
const magnifyingZoomButtonGroup = new MagnifyingGlassZoomButtonGroup( zoomLevelProperty, {
  tandem: tandem.createTandem( 'magnifyingZoomButtonGroup' )
} );
```

`zoomLevelProperty`'s range determines when each button auto-disables — the zoom-out button disables once applying `applyZoomOut` would fall outside the range, and likewise for zoom-in.

## `ZoomButtonGroup` (base class)

```ts
protected constructor(
  zoomLevelProperty: TRangedProperty,
  zoomInIcon: Node,
  zoomOutIcon: Node,
  providedOptions?: ZoomButtonGroupOptions
)
```

An `FlowBox` (horizontal by default) containing two internally-built `RectangularPushButton`s — it does not compose `ZoomButton` instances, even though the resulting look can be visually identical.

| Option | Default | Effect |
| --- | --- | --- |
| `applyZoomIn` / `applyZoomOut` | `currentZoom => currentZoom + 1` / `currentZoom => currentZoom - 1` | Functions computing the new zoom level on each press; override for non-integer zoom steps |
| `buttonOptions` | `{ fireOnHold: true, fireOnHoldDelay: 600, fireOnHoldInterval: 250 }` | Forwarded to both internal buttons (not `content`, `listener`, or `tandem`, which the group manages) |
| `touchAreaXDilation` / `touchAreaYDilation` / `mouseAreaXDilation` / `mouseAreaYDilation` | `0` | Pointer-area dilation; the group shifts the areas so they don't overlap given `spacing` |
| `orientation` | `'horizontal'` | `'horizontal'` places `[ zoomOut, zoomIn ]` left-to-right; `'vertical'` places `[ zoomIn, zoomOut ]` top-to-bottom |
| `spacing` | `0` | Space between the two buttons |

## Members

| Member | Description |
| --- | --- |
| `zoomInButton` / `zoomOutButton` | Public references to the two internal `RectangularPushButton`s |

## `PlusMinusZoomButtonGroup`

```ts
new PlusMinusZoomButtonGroup( zoomLevelProperty: TRangedProperty, providedOptions?: PlusMinusZoomButtonGroupOptions )
```

Uses bare `PlusNode`/`MinusNode` signs (no magnifying glass) as the icons, with flat, white, square-cornered `buttonOptions` (`baseColor: 'white'`, `buttonAppearanceStrategy: ButtonNode.FlatAppearanceStrategy`, `cornerRadius: 0`) — visually closer to a stepper control than a typical yellow PhET button.

| Option | Default | Effect |
| --- | --- | --- |
| `iconOptions` | `{ size: new Dimension2( 7, 1.26 ) }` | Forwarded to the internal `PlusNode`/`MinusNode` |

## `MagnifyingGlassZoomButtonGroup`

```ts
new MagnifyingGlassZoomButtonGroup( zoomLevelProperty: NumberProperty, providedOptions?: MagnifyingGlassZoomButtonGroupOptions )
```

Uses a [`MagnifyingGlassNode`](/api/scenery-phet/magnifying-glass-node) with a "+" or "−" sign inside the glass as each icon, and defaults `buttonOptions.baseColor` to `PhetColorScheme.BUTTON_YELLOW` — the same look as a standalone `ZoomButton`.

| Option | Default | Effect |
| --- | --- | --- |
| `magnifyingGlassNodeOptions` | `{ glassRadius: 15 }` | Forwarded to both internal `MagnifyingGlassNode`s |

## `ZoomButton` (standalone)

```ts
new ZoomButton( providedOptions?: ZoomButtonOptions )
```

A single `RectangularPushButton` with a `MagnifyingGlassNode` icon containing a "+" or "−" sign — the same visual as one button from a `MagnifyingGlassZoomButtonGroup`, but usable on its own (e.g. for a "zoom to fit" control that isn't part of a paired in/out group).

| Option | Default | Effect |
| --- | --- | --- |
| `in` | `true` | `true` draws a "+" (zoom in); `false` draws a "−" (zoom out) |
| `magnifyingGlassOptions` | `{ glassRadius: 15 }` | Forwarded to the internal `MagnifyingGlassNode` |

::: tip Pick a subclass by icon style, not by feature
`PlusMinusZoomButtonGroup` and `MagnifyingGlassZoomButtonGroup` behave identically — same range-driven enabling, same `applyZoomIn`/`applyZoomOut` hooks — they differ only in icon and default button styling. Choose based on which look fits your sim; reach for standalone `ZoomButton` only when you need a single zoom action rather than a bound in/out pair.
:::
