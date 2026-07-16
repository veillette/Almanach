---
title: ValueGaugeNode
description: A GaugeNode subclass with a built-in, centered NumberDisplay showing the gauge's numeric value.
category: api
library: scenery-phet
tags: [scenery-phet, ValueGaugeNode, GaugeNode, NumberDisplay, gauge, dial]
status: complete
related:
  - /api/scenery-phet/gauge-node
  - /api/scenery-phet/number-display
prerequisites:
  - /api/scenery-phet/gauge-node
  - /api/axon/property
  - /api/dot/range
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ValueGaugeNode

`ValueGaugeNode` (from `scenerystack/scenery-phet`) is a [`GaugeNode`](/api/scenery-phet/gauge-node) subclass that adds a centered [`NumberDisplay`](/api/scenery-phet/number-display) showing the same value the needle points to, positioned in the bottom half of the dial. It takes the exact same constructor arguments as `GaugeNode` — use it whenever readers should see both the analog needle position *and* an exact numeric readout, without composing the two Nodes yourself.

```ts
import { ValueGaugeNode } from 'scenerystack/scenery-phet';
import { NumberProperty, StringProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
```

<SceneryDemo demo="value-gauge-node" />

## A minimal example

```ts
const speedProperty = new NumberProperty( 42 );
const speedRange = new Range( 0, 100 );
const labelProperty = new StringProperty( 'm/s' );

const gaugeNode = new ValueGaugeNode( speedProperty, labelProperty, speedRange, {
  radius: 120,
  numberDisplayOptions: {
    decimalPlaces: 1
  }
} );

gaugeNode.numberDisplayVisible = false; // hide just the numeric readout; the needle and dial stay visible
```

## Constructor

```ts
new ValueGaugeNode(
  valueProperty: TReadOnlyProperty<number>,
  labelProperty: TReadOnlyProperty<string>,
  range: Range,
  providedOptions?: ValueGaugeNodeOptions
)
```

Identical signature to [`GaugeNode`](/api/scenery-phet/gauge-node#constructor), plus one extra option below. All of `GaugeNode`'s options (`radius`, `span`, tick options, etc.) are accepted too.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `numberDisplayOptions` | `{ textOptions: { font: new PhetFont(16) }, backgroundStroke: 'black', align: 'center', cornerRadius: 5 }` | Options forwarded to the internal [`NumberDisplay`](/api/scenery-phet/number-display) |

## Public API

| Member | Description |
| --- | --- |
| `numberDisplayVisible` | Settable/gettable `boolean` — show or hide the internal `NumberDisplay` without affecting the dial or needle |

::: warning Don't pass position options to `numberDisplayOptions`
`ValueGaugeNode` positions its internal `NumberDisplay` itself, centered at `(0, radius / 2)` via a `ManualConstraint`, and asserts that the `NumberDisplay` has no translation from options you passed. Use `numberDisplayOptions` only for its formatting/appearance options (`decimalPlaces`, `valuePattern`, colors, etc.), not `x`/`y`/`center`.
:::
