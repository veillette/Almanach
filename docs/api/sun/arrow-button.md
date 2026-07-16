---
title: ArrowButton
description: A small rectangular push button whose content is an arrow, with built-in press-and-hold repeat firing.
category: api
library: sun
tags: [sun, ArrowButton, button]
status: complete
related:
  - /api/sun/rectangular-push-button
  - /api/sun/rectangular-button
  - /api/sun/number-spinner
prerequisites:
  - /api/axon/boolean-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ArrowButton

`ArrowButton` (from `scenerystack/sun`) is a thin subclass of [`RectangularPushButton`](/api/sun/rectangular-push-button) whose `content` is generated for you: a triangular arrow pointing `'up'`, `'down'`, `'left'`, or `'right'`. It's the button [`NumberSpinner`](/api/sun/number-spinner) uses internally for its increment/decrement controls, and it's a reasonable choice any time you need a standalone "step" control with an arrow glyph rather than building your own `Path` and wiring it into `RectangularPushButton` yourself.

```ts
import { ArrowButton } from 'scenerystack/sun';
import { Tandem } from 'scenerystack/tandem';

const incrementButton = new ArrowButton(
  'right',
  () => {
    model.value += 1;
  },
  {
    tandem: Tandem.REQUIRED
  }
);
```

The constructor takes the direction and the fire callback directly (not through a `listener` option — `ArrowButton` sets `options.listener` internally, so `content` and `listener` are omitted from `ArrowButtonOptions`). Unlike a plain `RectangularPushButton`, `ArrowButton` enables `fireOnHold` by default, so press-and-hold repeats the action automatically.

<SceneryDemo demo="arrow-button" />

## Options

`ArrowButtonOptions` combines its own arrow-drawing options with `RectangularPushButtonOptions` (minus `content`/`listener`, which `ArrowButton` supplies):

| Option | Default | Effect |
| --- | --- | --- |
| `arrowHeight` | `20` | Arrow size from tip to base |
| `arrowWidth` | `arrowHeight * √3 / 2` | Width of the arrow's base |
| `arrowFill` / `arrowStroke` / `arrowLineWidth` | `'black'` / `null` / `1` | Styling of the arrow `Path` |
| `numberOfArrows` | `1` | Draws several overlapping arrows (a ">>" fast-forward look) instead of one |
| `arrowSpacing` | `-arrowHeight / 2` | Offset between stacked arrows when `numberOfArrows > 1` |
| `fireOnHold` | `true` | Press-and-hold repeat firing is on by default (opposite of `RectangularPushButton`) |
| `fireOnHoldDelay` / `fireOnHoldInterval` | `400` / `100` | Timing (ms) for the repeat firing |
| `cornerRadius` | `4` | Smaller default than the general-purpose rectangular button |
| `touchAreaXDilation` / `touchAreaYDilation` | `7` / `7` | Expand the touch hit area beyond the small visual button |

::: tip Pass the direction and callback positionally, not as options
`ArrowButton`'s constructor is `new ArrowButton( direction, callback, options? )` — `direction` and the fire callback aren't part of the options object the way `listener` is for `RectangularPushButton`.
:::
