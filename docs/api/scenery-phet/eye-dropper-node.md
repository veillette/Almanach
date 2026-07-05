---
title: EyeDropperNode
description: An eye-dropper graphic with a squeeze-bulb button for dispensing colored fluid, driven by dispensing/empty Properties.
category: api
library: scenery-phet
tags: [scenery-phet, EyeDropperNode, fluid, dropper]
status: complete
related:
  - /api/scenery-phet/faucet-node
  - /api/axon/property
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# EyeDropperNode

`EyeDropperNode` (from `scenerystack/scenery-phet`) draws an eye dropper — glass bulb, glass body, and a red squeeze button — with a colored fluid shape visible inside the glass. Pressing and holding the button sets `isDispensingProperty` to `true` for as long as it's held, which is the hook your model uses to actually add fluid/particles to whatever the dropper is squeezed over. It's used in sims like pH Scale and Beer's Law Lab wherever the user needs to add a small, discrete amount of something by "squeezing."

```ts
import { EyeDropperNode } from 'scenerystack/scenery-phet';
import { Property } from 'scenerystack/axon';
```

## A minimal example

```ts
const isDispensingProperty = new Property( false );
const isEmptyProperty = new Property( false );

const dropperNode = new EyeDropperNode( {
  isDispensingProperty: isDispensingProperty,
  isEmptyProperty: isEmptyProperty,
  fluidColor: 'red',
  tandem: tandem.createTandem( 'dropperNode' )
} );

isDispensingProperty.link( isDispensing => {
  if ( isDispensing && !isEmptyProperty.value ) {
    // add fluid to the model here, once per frame while isDispensing is true
  }
} );
```

`EyeDropperNode`'s origin is the bottom-center of its tip, matching the point fluid visually emerges from — the same convention [`FaucetNode`](/api/scenery-phet/faucet-node) uses for its spout.

## Constructor

```ts
new EyeDropperNode( provideOptions?: EyeDropperNodeOptions )
```

`EyeDropperNode` takes no required arguments — all of its state is supplied through options (or the owned defaults created for you).

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `isDispensingProperty` | an owned `Property<boolean>( false )` | `true` while the button is held down; this is the signal your model listens to |
| `isEmptyProperty` | an owned `Property<boolean>( false )` | When `true`, the glass renders as visibly empty (a different background image) and the fluid shape is hidden |
| `fluidColor` | `'yellow'` | Fill color of the visible fluid inside the glass, ignored while `isEmptyProperty` is `true` |
| `buttonOptions` | `{ touchAreaDilation: 15, baseColor: 'red', radius: 18, listenerOptions: { attach: false } }` | Propagated to the internal `RoundMomentaryButton` that drives `isDispensingProperty` |

## Public API

| Member | Description |
| --- | --- |
| `button` | The internal button `Node`, exposed so a client can hide it (e.g. to make the dropper non-interactive) |
| `fluidColor` (get/set) | The fluid color, equivalent to `getFluidColor()` / `setFluidColor()` |
| `EyeDropperNode.TIP_WIDTH`, `.TIP_HEIGHT`, `.GLASS_WIDTH` | Static geometry constants, useful if you need to draw fluid emerging from the tip yourself |
| `EyeDropperNode.GLASS_MIN_Y`, `.GLASS_MAX_Y` | Static y-extents of the glass, relative to the bottom-center origin, useful for positioning a label inside the glass |

::: tip The button only sets a Property — it never touches your model directly
Squeezing the bulb toggles `isDispensingProperty` while held (using a momentary, not toggle, button internally); `EyeDropperNode` has no notion of "how much fluid" or "what fluid" is being added. Link a listener to `isDispensingProperty` (typically inside a `step()` call, so it runs once per animation frame) to perform the actual model update, and set `isEmptyProperty` yourself once the model runs out.
:::
