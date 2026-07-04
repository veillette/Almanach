---
title: RoundPushButton
description: The circular momentary-action button, sharing PushButtonModel with RectangularPushButton.
category: api
library: sun
tags: [sun, RoundPushButton, button]
status: verified
related:
  - /api/sun/rectangular-push-button
  - /api/sun/toggle-button
prerequisites:
  - /api/axon/boolean-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# RoundPushButton

`RoundPushButton` (from `scenerystack/sun`) is the circular counterpart to [`RectangularPushButton`](/api/sun/rectangular-push-button): same momentary-action behavior — fires a `listener` once per press or release and holds no state of its own — just a round `RoundButton` shape instead of a rectangular one. Reach for it for icon-only actions (play, a single glyph) where a circular affordance reads better than a rectangle, e.g. a play button or a single-icon "randomize" control.

```ts
import { RoundPushButton } from 'scenerystack/sun';
import { Path } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';
import playIconShape from './playIconShape.js';

const playButton = new RoundPushButton( {
  content: new Path( playIconShape, { fill: 'black' } ),
  baseColor: 'rgb( 0, 200, 0 )',
  listener: () => {
    model.play();
  },
  tandem: Tandem.REQUIRED
} );
```

Both `RoundPushButton` and `RectangularPushButton` construct the same `PushButtonModel` internally and expose the identical `addListener`/`removeListener`/`fireOnDown`/`fireOnHold*` firing behavior — the only real difference between the two classes is which button shape (`RoundButton` vs. `RectangularButton`) they extend, so switching between them later is a one-line change.

## Options

`RoundPushButtonOptions` combines `RoundButton`'s shape options with the shared `ButtonNode` appearance options and `PushButtonModel`'s firing behavior:

| Option | Default | Effect |
| --- | --- | --- |
| `content` | `null` | The `Node` shown on the button; if omitted, `radius` must be supplied explicitly |
| `radius` | `30` (or `null` if `content` given) | Fixed radius; when `null` and `content` is set, the button sizes itself to fit the content plus margins |
| `listener` | — | Convenience for adding a single fire listener, `() => void` |
| `baseColor` | — | Background color the 3D gradient appearance is derived from |
| `xMargin` / `yMargin` | `5` / `5` | Minimum margin between `content` and the button's circular edge |
| `fireOnDown` | `false` | `true` fires on pointer-down instead of pointer-up |
| `fireOnHold` / `fireOnHoldDelay` / `fireOnHoldInterval` | `false` / … | Enables press-and-hold repeat firing |
| `touchAreaDilation` / `mouseAreaDilation` | `0` / `0` | Radius dilation of the touch/mouse hit area beyond the visual circle |
| `enabledProperty` | — | Externally control whether the button can be pressed |

## Methods

| Method | Effect |
| --- | --- |
| `addListener( listener: () => void )` | Adds another fire listener |
| `removeListener( listener: () => void )` | Removes a previously added listener |

::: tip A single sizable dimension only
`RoundButton` (the shared base of `RoundPushButton` and the round toggle/radio buttons) asserts if you try to make it sizable in both width and height at once — a round button's width and height are inherently coupled through its radius, so pick at most one dimension to be layout-driven.
:::
