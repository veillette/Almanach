---
title: LaserPointerNode
description: A laser-pointer-styled Node with an optional on/off button, used to represent a light source in optics sims.
category: api
library: scenery-phet
tags: [scenery-phet, LaserPointerNode, optics, button]
status: complete
related:
  - /api/scenery-phet/probe-node
  - /api/tandem/tandem
  - /api/axon/property
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# LaserPointerNode

`LaserPointerNode` (from `scenerystack/scenery-phet`) draws a laser-pointer body — a tapered nozzle and casing, pointing right by default with its origin at the output nozzle — with an optional built-in on/off button wired to a boolean Property. It's the standard "light source the user can turn on and point" graphic in optics/light sims (e.g. bending-light-style sims), and can also represent a plain flashlight-style light source with `hasButton: false`.

```ts
import { LaserPointerNode } from 'scenerystack/scenery-phet';
import { BooleanProperty } from 'scenerystack/axon';
```

<SceneryDemo demo="laser-pointer-node" />

## A minimal example

```ts
const onProperty = new BooleanProperty( false );

const laserPointerNode = new LaserPointerNode( onProperty, {
  tandem: tandem.createTandem( 'laserPointerNode' ),
  hasGlass: true // draws a small lens at the nozzle output
} );
```

`onProperty` is two-way bound: toggling the built-in button flips it, and setting it programmatically updates the button's pressed appearance.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `bodySize` / `nozzleSize` | `Dimension2(110,78)` / `Dimension2(20,60)` | Dimensions of the main casing and the narrower nozzle |
| `topColor` / `bottomColor` / `highlightColor` | grays / near-white | Vertical gradient colors for both body and nozzle |
| `hasButton` | `true` | Whether an on/off button is drawn at all — other button options are ignored if `false` |
| `buttonType` | `'toggle'` | `'toggle'` uses a `RoundStickyToggleButton` (press to latch on, press again to turn off); `'momentary'` uses a `RoundMomentaryButton` (on only while held) |
| `buttonOptions` | `{ baseColor: 'red', radius: 22, … }` | Forwarded to the underlying round button |
| `getButtonLocation` | `bodyNode => bodyNode.center` | Function computing where the button sits within the body |
| `hasGlass` | `false` | Draws a semicircular lens `ShadedSphereNode` at the nozzle output — a visual cue that this is a non-laser light source, without moving the Node's origin |
| `glassOptions` | tuned defaults | `heightProportion`/`proportionStickingOut` control the lens's size and how far it protrudes, plus standard `ShadedSphereNode` coloring |

## Instance member

| Member | Type | Description |
| --- | --- | --- |
| `onOffButton` | `Node \| null` | Read-only reference to the button Node (if `hasButton` is `true`), safe to add listeners to but not to mutate structurally |

## Static member

| Member | Description |
| --- | --- |
| `LaserPointerNode.DEFAULT_LASER_NODE_OPTIONS` | The frozen default options object, useful for building a variant that overrides only a few fields |

::: tip `tandem` defaults to `Tandem.REQUIRED`
Like other instrumentable scenery-phet components, `LaserPointerNode`'s default options set `tandem: Tandem.REQUIRED` and a `tandemNameSuffix` of `['LaserPointerNode', 'LightNode']` — omitting a real tandem asserts in an instrumented build. Always pass `tandem: someTandem.createTandem( '...' )` explicitly. See [Tandem](/api/tandem/tandem) for why `Tandem.REQUIRED` exists as a sentinel rather than a usable default.
:::
