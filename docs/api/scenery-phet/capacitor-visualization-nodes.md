---
title: Capacitor Visualization Nodes
description: The CapacitorNode family — a pseudo-3D capacitor visualization (plates, plate charge, and E-field lines) shared by Capacitor Lab and Circuit Construction Kit-style sims.
category: api
library: scenery-phet
tags: [scenery-phet, CapacitorNode, PlateNode, PlateChargeNode, EFieldNode, ElectronChargeNode, CapacitorConstants, capacitor]
status: complete
related:
  - /api/scenery-phet/yaw-pitch-model-view-transform3
  - /api/dot/bounds3
  - /api/dot/range-with-value
  - /api/phet-core/orientation
prerequisites:
  - /api/scenery-phet/yaw-pitch-model-view-transform3
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Capacitor Visualization Nodes

`CapacitorNode` (from `scenerystack/scenery-phet`, under `scenery-phet/js/capacitor/`) draws a pseudo-3D parallel-plate capacitor: two foreshortened plates with a vacuum gap between them, optional `+`/`-` charge symbols distributed across each plate's top face, and optional electric-field arrows in the gap. It was built for PhET's Capacitor Lab sims and is also reused by Circuit Construction Kit for its capacitor component — it's a model-driven composite `Node`, not a standalone drawing primitive, and expects a small cluster of collaborating pieces (a capacitor-shaped model object, a [`YawPitchModelViewTransform3`](/api/scenery-phet/yaw-pitch-model-view-transform3), and visibility Properties) rather than plain constructor arguments.

This page documents `CapacitorNode` and the pieces it assembles: `PlateNode` (one plate, with an internal `PlateChargeNode`), `EFieldNode` (the field-line canvas layer), the standalone `ElectronChargeNode` (a single shaded electron, used elsewhere for wire/circuit charge animations), and the `CapacitorConstants` shared defaults. All of these are implemented in plain JavaScript (not TypeScript) in the real source, so constructor parameter types below are inferred from JSDoc comments rather than a `.d.ts` file.

```ts
import { CapacitorNode, CapacitorConstants, YawPitchModelViewTransform3 } from 'scenerystack/scenery-phet';
import { NumberProperty, Property } from 'scenerystack/axon';
import { Bounds3 } from 'scenerystack/dot';
import { Orientation } from 'scenerystack/phet-core';
```

## A minimal example

`CapacitorNode`'s first argument is a `circuit`-shaped object exposing a `.capacitor` (itself exposing plate-size/separation/charge/voltage Properties and a `getEffectiveEField()` method), plus `.maxPlateCharge` and `.maxEffectiveEField` used to normalize the charge/field density. A real sim gets this from its circuit model; here it's assembled by hand to show the shape `CapacitorNode` expects:

```ts
const capacitor = {
  plateSizeProperty: new Property( new Bounds3(
    -0.0075, 0, -0.0075,
    0.0075, CapacitorConstants.PLATE_HEIGHT, 0.0075
  ) ),
  plateSeparationProperty: new NumberProperty( CapacitorConstants.PLATE_SEPARATION_RANGE.defaultValue ),
  plateChargeProperty: new NumberProperty( 0 ),
  plateVoltageProperty: new NumberProperty( 0 ),
  getEffectiveEField: () => 0
};

const circuit = {
  capacitor,
  maxPlateCharge: 2.7e-12,
  maxEffectiveEField: 4e6
};

const modelViewTransform = new YawPitchModelViewTransform3();
const plateChargeVisibleProperty = new Property( true );
const electricFieldVisibleProperty = new Property( true );

const capacitorNode = new CapacitorNode(
  circuit,
  modelViewTransform,
  plateChargeVisibleProperty,
  electricFieldVisibleProperty,
  { orientation: Orientation.VERTICAL }
);

capacitor.plateChargeProperty.value = 1.5e-12; // redraws the '+'/'-' charge grid on the plates
```

## Constructor

```ts
new CapacitorNode(
  circuit: { capacitor: Capacitor, maxPlateCharge: number, maxEffectiveEField: number },
  modelViewTransform: YawPitchModelViewTransform3,
  plateChargeVisibleProperty: Property<boolean>,
  electricFieldVisibleProperty: Property<boolean>,
  options?: { orientation?: Orientation, includeChargeNode?: boolean }
)
```

`options.orientation` (default `Orientation.VERTICAL`, from [`scenerystack/phet-core`](/api/phet-core/orientation)) affects only how negative-charge minus signs are drawn (see `PlateChargeNode` below); it does not rotate the whole node. `options.includeChargeNode` (default `true`) can be set `false` to skip building the charge overlay entirely — used by toolbox icons where charges are never shown and the extra canvas bounds would otherwise throw off icon sizing.

## Methods

| Method | Effect |
| --- | --- |
| `frontSideContainsSensorPoint( globalPoint )` / `backSideContainsSensorPoint( globalPoint )` | Hit-test a global point against the top or bottom plate, used to detect a voltmeter probe touching a specific plate face |
| `getTopPlateClipShapeToGlobal()` / `getBottomPlateClipShapeToGlobal()` | Global-coordinate clip `Shape`s used to mask wires or animated charges as they enter/exit the capacitor |
| `getPlatesBounds()` | `Bounds2` enclosing both plates, computed from their current layout |

The node automatically re-lays out its plates whenever `capacitor.plateSizeProperty` or `plateSeparationProperty` changes, and toggles per-plate charge visibility / field-line visibility in response to the two visibility Properties passed to the constructor — there's no separate "update" call to make from application code.

## PlateNode

`PlateNode` draws a single pseudo-3D plate (a `BoxNode` — a thin foreshortened box with top/front/right-side faces) and owns a child `PlateChargeNode` for that plate's charge overlay.

```ts
new PlateNode(
  capacitor: Capacitor,
  modelViewTransform: YawPitchModelViewTransform3,
  polarity: EnumerationDeprecatedValue,  // CapacitorConstants.POLARITY.POSITIVE or .NEGATIVE — not the strings 'POSITIVE'/'NEGATIVE'
  maxPlateCharge: number,
  orientation: Orientation,
  includeChargeNode?: boolean          // default true
)
```

| Method | Effect |
| --- | --- |
| `setChargeVisible( visible )` | Shows/hides this plate's `PlateChargeNode` |
| `setBoxSize( size: Bounds3 )` | Resizes the plate (inherited from `BoxNode`); no-ops if `size` already equals the current size |

## PlateChargeNode

A `CanvasNode` that paints an integer number of `+`/`-` symbols in a grid across the portion of the plate facing the vacuum gap, linearly proportional to `capacitor.plateChargeProperty` (clamped between 1 and 625 charges once any charge is present, and normalized against `maxPlateCharge`). Positive charges are drawn in `PhetColorScheme.RED_COLORBLIND`; negative charges are drawn in `'blue'`, as a short horizontal rectangle whose orientation (`VERTICAL`/`HORIZONTAL`) affects only its exact offset.

| Method | Effect |
| --- | --- |
| `isPositivelyCharged()` | `true` if the plate's charge sign matches its own `polarity` option |
| `getNumberOfCharges( plateCharge, maxPlateCharge )` | The symbol count for a given charge, before layout into a grid |
| `getGridSize( numberOfObjects, width, height )` | Chooses rows/columns for the charge grid that best approximates a square packing over the given aspect ratio |

## EFieldNode

A `CanvasNode` that paints evenly-spaced vertical arrows between the plates, representing the effective E-field. Line spacing is inversely proportional to the square root of `|effectiveEField|` (denser field ⇒ closer-spaced lines), and arrows point down for a positive field, up for negative. It repaints whenever plate size, separation, or voltage changes and the node is visible.

## ElectronChargeNode

A small, self-contained `Node` — not part of the capacitor's own plate rendering, but shipped alongside these pieces and reused wherever a single shaded "blue sphere with a white minus sign" electron glyph is needed (e.g. animating charge flow through a wire in Circuit Construction Kit).

```ts
new ElectronChargeNode( providedOptions?: {
  sphereOpacity?: number;   // default 1
  minusSignOpacity?: number; // default 1
  radius?: number;          // default 10
} & NodeOptions )
```

## CapacitorConstants

A plain object of shared numeric defaults, reused by the model and by `PlateNode`/`PlateChargeNode` for layout:

| Constant | Value | Meaning |
| --- | --- | --- |
| `PLATE_WIDTH_RANGE` | `RangeWithValue( 0.01, 0.02, √(200/1e6) )` meters | Legal plate width range; default corresponds to a 200 mm² plate area |
| `PLATE_HEIGHT` | `0.0005` meters | Fixed plate thickness |
| `PLATE_SEPARATION_RANGE` | `RangeWithValue( 0.002, 0.01, 0.006 )` meters | Legal gap range between plates |
| `POLARITY` | `EnumerationDeprecated.byKeys(['POSITIVE', 'NEGATIVE'])` | The two values accepted by `PlateNode`'s `polarity` parameter |

`PLATE_WIDTH_RANGE` and `PLATE_SEPARATION_RANGE` are [`RangeWithValue`](/api/dot/range-with-value) instances, so each carries its own `.defaultValue` in addition to `.min`/`.max`.

::: warning These are JavaScript files with untyped, model-shaped constructor arguments
Unlike most of `scenery-phet`, `CapacitorNode`, `PlateNode`, `PlateChargeNode`, `EFieldNode`, and `CapacitorConstants` are still plain `.js` files (only `ElectronChargeNode` has been converted to TypeScript). Their constructors expect a `Capacitor`-model-shaped object with specific Property names (`plateSizeProperty`, `plateSeparationProperty`, `plateChargeProperty`, `plateVoltageProperty`, `getEffectiveEField()`) rather than a generic `NodeOptions`-style bag — reusing these nodes outside a capacitor-shaped model means constructing an object that duck-types the same shape, as in the example above.
:::
