---
title: RectangularPushButton
description: The standard rectangular momentary-action button.
category: api
library: sun
tags: [sun, RectangularPushButton, button]
status: complete
related:
  - /api/sun/text-push-button
  - /api/sun/toggle-button
  - /api/sun/panel
prerequisites:
  - /api/axon/boolean-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# RectangularPushButton

`RectangularPushButton` (from `scenerystack/sun`) is the workhorse momentary-action button: it fires a `listener` once per press (or once per release, depending on `fireOnDown`) and holds no state of its own. Use it for one-shot actions like "step forward" or "randomize" — for a button that tracks on/off state, see [Toggle Buttons](/api/sun/toggle-button) instead.

```ts
import { RectangularPushButton } from 'scenerystack/sun';
import { Text } from 'scenerystack/scenery';
import { Tandem } from 'scenerystack/tandem';

const stepButton = new RectangularPushButton( {
  content: new Text( 'Step' ),
  baseColor: 'yellow',
  listener: () => {
    model.step( 0.1 );
  },
  tandem: Tandem.REQUIRED
} );
```

`content` accepts any `Node`, so an icon (e.g. a `Path` built from a shape) works just as well as text. If your button's content is specifically a text label, [`TextPushButton`](/api/sun/text-push-button) saves you the boilerplate of constructing a `Text` node yourself.

## Options

`RectangularPushButtonOptions` combines options from three layers: the button's own `RectangularButton` shape options, the shared `ButtonNode` appearance options, and `PushButtonModel`'s firing behavior. The most commonly used:

| Option | Effect |
| --- | --- |
| `content` | The `Node` shown on the button (icon, text, etc.); `null` requires an explicit `size` |
| `listener` | Convenience for adding a single fire listener, `() => void` |
| `baseColor` | Background color the 3D appearance gradients are derived from |
| `xMargin` / `yMargin` | Margin between `content` and the button's edge |
| `cornerRadius` | Corner radius, applied to all four corners unless overridden per-corner |
| `size` | Fixed `Dimension2` for the button; `content` is scaled down to fit |
| `fireOnDown` | `true` fires on pointer-down instead of pointer-up (default `false`) |
| `fireOnHold` / `fireOnHoldDelay` / `fireOnHoldInterval` | Enables press-and-hold repeat firing |
| `enabledProperty` | Externally control whether the button can be pressed |
| `touchAreaXDilation` / `touchAreaYDilation` | Expand the touch-friendly hit area beyond the visual bounds |

## Methods

| Method | Effect |
| --- | --- |
| `addListener( listener: () => void )` | Adds another fire listener |
| `removeListener( listener: () => void )` | Removes a previously added listener |

::: tip Prefer `listener` for the common case
`addListener`/`removeListener` exist for adding or removing listeners after construction. If you just need one listener and never remove it, pass `listener` in the options object — it's equivalent and shorter.
:::

::: warning `tandem` is required
Every sun component in a real PhET-iO-instrumented sim needs a `tandem` — `RectangularPushButton` will assert if one isn't supplied. Even outside PhET-iO builds, it's good practice to always pass one.
:::
