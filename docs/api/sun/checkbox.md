---
title: Checkbox
description: A checkbox bound to a BooleanProperty, with label-Node composition.
category: api
library: sun
tags: [sun, Checkbox, BooleanProperty]
status: verified
related:
  - /api/sun/hslider
  - /api/sun/radio-button-group
  - /patterns/reset-all-pattern
prerequisites:
  - /api/axon/boolean-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Checkbox

`Checkbox` (from `scenerystack/sun`) is a standard checkbox bound to a `PhetioProperty<boolean>`, composed with an arbitrary `Node` as its label — there's no separate "checkbox label" string option, you pass any `Node` (typically a `Text`) as the `content` argument and `Checkbox` lays it out next to the box.

```ts
import { Checkbox } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';
import { BooleanProperty } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

const gravityEnabledProperty = new BooleanProperty( true );

const gravityCheckbox = new Checkbox(
  gravityEnabledProperty,
  new Text( 'Gravity' ),
  { tandem: Tandem.REQUIRED }
);
```

Clicking anywhere on the checkbox (box or label) toggles `gravityEnabledProperty.value`; the box updates to reflect the Property whenever it changes, from any source.

## Options

| Option | Effect |
| --- | --- |
| `spacing` | Space between the box and `content` (default `5`) |
| `boxWidth` | Width/height of the box itself (default `21`) |
| `checkboxColor` | Color of the check mark and empty-box outline |
| `checkboxColorBackground` | Fill behind the check mark |
| `touchAreaXDilation` / `touchAreaYDilation` | Expand the touch hit area beyond the visual bounds |
| `checkedSoundPlayer` / `uncheckedSoundPlayer` | Sounds played on each transition |
| `enabledProperty` | Externally control interactivity |

```ts
const checkbox = new Checkbox( gravityEnabledProperty, new Text( 'Gravity' ), {
  boxWidth: 16,
  checkboxColor: 'blue',
  touchAreaXDilation: 6,
  touchAreaYDilation: 6,
  tandem: Tandem.REQUIRED
} );
```

::: tip `accessibleName` is inferred from your label
If `content` is (or contains) a `Text`/string-backed Node and you don't set `accessibleName` explicitly, `Checkbox` finds the label's string automatically for the accessible name — you usually don't need to duplicate the label text into `accessibleName` yourself.
:::

::: warning Don't decorate a `Checkbox` with extra children
`Checkbox`'s internal layout constraint manages exactly three children (the box, your `content`, and an invisible hit-target rectangle). Adding further children directly to the `Checkbox` instance breaks its layout and is explicitly disallowed — put anything else you need in a sibling `Node`, not inside the checkbox itself.
:::
