---
title: ColorProperty, ProfileColorProperty, and PaintColorProperty
description: The Property-driven pattern for colors that can change (by color profile, by derivation from another paint, or just by being observable) instead of being fixed values.
category: api
library: scenery
tags: [scenery, ColorProperty, ProfileColorProperty, PaintColorProperty, Color, Property, theming]
status: complete
related:
  - /api/scenery/color
  - /api/scenery/node
  - /api/joist/look-and-feel
prerequisites:
  - /api/axon/property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ColorProperty, ProfileColorProperty, and PaintColorProperty

All three of these classes (from `scenerystack/scenery`) are `Property<Color>` subclasses — they let a `fill`/`stroke` respond to a `Property` link like any other dynamic value, instead of being a fixed `Color`/string. They differ in *why* the color changes:

- **`ColorProperty`** is the plain case: a `Property<Color>` you set directly, with a `valueType`/`phetioValueType` already configured for `Color` so you don't have to specify that yourself every time.
- **`ProfileColorProperty`** changes its value automatically based on a global `colorProfileProperty` (e.g. switching between a `'default'` and `'projector'` color scheme) — you give it a map from profile name to color once, and it picks the right one and re-picks whenever the profile changes.
- **`PaintColorProperty`** *derives* its value from another paint (a `Color`, a CSS string, a gradient, or even another `Property<Color>`) and stays in sync as that source paint changes — optionally brightening or darkening it via `luminanceFactor`.

```ts
import { ColorProperty, ProfileColorProperty, PaintColorProperty, Color } from 'scenerystack/scenery';
import { Namespace } from 'scenerystack/phet-core';

// Plain, directly-set color Property
const highlightColorProperty = new ColorProperty( new Color( 'yellow' ) );
highlightColorProperty.value = new Color( 'orange' ); // change it later

// A namespace is required so ProfileColorProperty names stay globally unique
const myNamespace = new Namespace( 'myModule' );

// Switches automatically with the global color profile
const backgroundColorProperty = new ProfileColorProperty( myNamespace, 'background', {
  default: new Color( 'white' ),
  projector: new Color( '#f0f0f0' )
} );

// Always a slightly darker version of backgroundColorProperty, kept in sync automatically
const shadowColorProperty = new PaintColorProperty( backgroundColorProperty, {
  luminanceFactor: -0.3
} );
```

## `ColorProperty`

```ts
new ColorProperty( color: Color, providedOptions?: PropertyOptions<Color> )
```

Just a `Property<Color>` with `valueType: Color` and `phetioValueType: Color.ColorIO` pre-set — you cannot pass either of those options yourself (it asserts if you try). Use this whenever a color needs to be observable/settable but doesn't need profile-switching or paint-derivation behavior.

## `ProfileColorProperty`

```ts
new ProfileColorProperty(
  namespace: Namespace,
  colorName: string,
  colorProfileMap: Record<string, Color | string>,
  providedOptions?: PropertyOptions<Color>
)
```

`colorProfileMap` must include a `default` entry (asserted at construction) — other keys are additional profiles (PhET's convention is `projector` for a white-background, high-contrast alternative). All map values are eagerly coerced to immutable `Color` instances. Internally, a listener on the shared `colorProfileProperty` re-selects `this.value` from the map (falling back to `default` if the current profile has no entry) every time the profile changes — you never call anything to trigger the switch yourself.

`namespace` + `colorName` together form a unique identifier (`${namespace.name}.${colorName}`) used to report color values to PhET's HTML color-editor tooling; constructing two `ProfileColorProperty`s with the same combination asserts.

## `PaintColorProperty`

```ts
new PaintColorProperty( paint: TPaint, providedOptions?: PaintColorPropertyOptions )
```

`paint` accepts anything scenery treats as a paint — a `Color`, a CSS color string, a gradient/pattern, or a `Property`/`TinyProperty` wrapping one of those — and `PaintColorProperty` resolves it to a concrete `Color` value, staying subscribed so `this.value` updates whenever the source paint (or a `Property` wrapping it) changes.

| Option | Default | Effect |
| --- | --- | --- |
| `luminanceFactor` | `0` | `-1` (black) to `1` (white); adjusts the resolved color's brightness via `Color.colorUtilsBrightness()`. `0` applies no change |

| Member | Effect |
| --- | --- |
| `paint` (getter/setter) | Swap to a different source paint at runtime; `this.value` updates immediately |
| `luminanceFactor` (getter/setter) | Change the brightening/darkening amount at runtime |

::: tip Use `PaintColorProperty` to derive "lighter"/"darker" variants instead of hand-picking a second color
A common pattern is a button's `baseColor` plus a slightly darker `PaintColorProperty` (via `luminanceFactor`) for its pressed/stroke state — if the base color is later changed (including by a `ProfileColorProperty` switching profiles), the derived color updates automatically instead of drifting out of sync.
:::

::: warning `ProfileColorProperty` is a JS-side profile switch, not a full re-theming system
Only the colors you've explicitly wrapped in `ProfileColorProperty` respond to `colorProfileProperty` changes — it doesn't retroactively make every `fill`/`stroke` in your sim swappable. Sim-wide color profile support means consistently using `ProfileColorProperty` (often centralized in a single colors file) for every themeable color.
:::
