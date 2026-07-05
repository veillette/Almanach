---
title: Drawer
description: A container that animates open and closed, revealing or hiding an arbitrary contents Node, toggled by a handle.
category: api
library: scenery-phet
tags: [scenery-phet, Drawer, animation]
status: complete
related:
  - /api/scenery-phet/handle-node
  - /api/twixt/animation
  - /api/axon/boolean-property
  - /api/sun/accordion-box
prerequisites:
  - /api/axon/boolean-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Drawer

`Drawer` (from `scenerystack/scenery-phet`) wraps an arbitrary `contentsNode` in a clipped container with a clickable handle: clicking the handle slides the contents in and out of view (by default, animated), the way a physical drawer opens and closes. It's used wherever a sim wants to tuck away optional content — a mini legend, a secondary control — behind a single, low-profile handle instead of an [`AccordionBox`](/api/sun/accordion-box)'s title bar.

```ts
import { Drawer } from 'scenerystack/scenery-phet';
import { Text } from 'scenerystack/scenery';
```

## A minimal example

```ts
const contentsNode = new Text( 'Extra info goes here' );

const drawer = new Drawer( contentsNode, {
  open: false,
  handlePosition: 'top',
  tandem: tandem.createTandem( 'drawer' )
} );

screenView.addChild( drawer );

// Open/close programmatically:
drawer.openProperty.value = true;
```

Clicking the handle toggles `drawer.openProperty`; toggling `openProperty` yourself (or via PhET-iO) drives the same animation the handle click would.

## Constructor

```ts
new Drawer( contentsNode: Node, provideOptions?: DrawerOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `size` | `null` | If provided, the container is fixed at this `Dimension2` and `contentsNode` is scaled down (never up) to fit; if `null`, the container is sized to fit `contentsNode` exactly |
| `cornerRadius` | `0` | Corner radius of the container's background/border |
| `xMargin` / `yMargin` | `0` / `0` | Margin between `contentsNode` and the container edge, before any `size`-driven scaling |
| `open` | `true` | Whether the drawer starts open |
| `handlePosition` | `'top'` | `'top'` or `'bottom'` — which edge the handle (and the rounded corners on it) is drawn on |
| `handleSize` | `Dimension2( 70, 20 )` | Size of the handle bar |
| `handleFill` | `'rgb( 230, 230, 230 )'` | Fill color of the handle |
| `handleTouchAreaXDilation` / `handleTouchAreaYDilation` | `0` / `0` | Touch-area dilation around the handle |
| `grippyDotRows` / `grippyDotColumns` | `2` / `4` | Layout of the small "grippy" dots drawn on the handle |
| `beforeOpen` | makes `contentsNode` visible | Called immediately before opening starts |
| `afterClose` | hides `contentsNode` | Called immediately after closing finishes — the default behavior is why the drawer's content can safely keep updating only while visible |
| `animationEnabled` | `true` | Whether opening/closing is animated at all; `false` snaps instantly |
| `animationDuration` | `0.5` | Duration of the open/close animation, in seconds, using [`Animation`](/api/twixt/animation)'s `QUADRATIC_IN_OUT` easing |

## Public API

| Member | Description |
| --- | --- |
| `openProperty` | `Property<boolean>` — the drawer's open/closed state; settable directly or via the handle |
| `contentsNode` | The `Node` passed to the constructor |
| `reset( animationEnabled? )` | Returns `openProperty` to its initial value, optionally overriding whether that reset itself is animated |
| `animationEnabled` (get/set) | Whether future open/close transitions are animated |

::: tip `beforeOpen` / `afterClose` are how `contentsNode` avoids updating while hidden
By default, `Drawer` makes `contentsNode` invisible only *after* the close animation finishes, and visible again *before* the open animation starts — so if `contentsNode`'s own updates are gated on `node.visible`, they naturally pause while the drawer is fully closed. Overriding `beforeOpen`/`afterClose` replaces this behavior entirely, so re-implement the visibility toggle yourself if you still want it.
:::

::: warning `Drawer`'s handle is a distinct graphic from [`HandleNode`](/api/scenery-phet/handle-node)
`Drawer` draws its own small rounded pull-tab with dots — it does not compose a `HandleNode` internally, and there's no option to swap in one. If you need `HandleNode`'s grip-and-attachment look specifically, you'll need a custom container rather than `Drawer`.
:::
