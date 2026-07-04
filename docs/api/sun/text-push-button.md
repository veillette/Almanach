---
title: TextPushButton
description: A push button whose content is a text label.
category: api
library: sun
tags: [sun, TextPushButton, button]
status: verified
related:
  - /api/sun/rectangular-push-button
  - /api/sun/toggle-button
prerequisites:
  - /api/sun/rectangular-push-button
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# TextPushButton

`TextPushButton` (from `scenerystack/sun`) is a convenience subclass of [`RectangularPushButton`](/api/sun/rectangular-push-button) that builds its own `Text` content node for you, instead of requiring you to pass one via `content`. Reach for it whenever a button's label is plain text — it saves the boilerplate of constructing and styling a `Text` node yourself.

```ts
import { TextPushButton } from 'scenerystack/sun';
import { Tandem } from 'scenerystack/tandem';

const resetButton = new TextPushButton( 'Reset', {
  baseColor: 'orange',
  listener: () => {
    model.reset();
  },
  tandem: Tandem.REQUIRED
} );
```

The first constructor argument is the string (or a `TReadOnlyProperty<string>`, for translated/dynamic text) — everything else is passed as options, identical to [`RectangularPushButtonOptions`](/api/sun/rectangular-push-button) minus `content`, which `TextPushButton` builds internally.

## Options

`TextPushButtonOptions` adds a few text-specific options on top of everything `RectangularPushButton` accepts (`baseColor`, `listener`, `xMargin`, `cornerRadius`, `fireOnHold`, and so on — see [the RectangularPushButton reference](/api/sun/rectangular-push-button#options)):

| Option | Effect |
| --- | --- |
| `font` | `Font` used for the label (default `Font.DEFAULT`) |
| `textFill` | Text color (default `'black'`) |
| `maxTextWidth` | Caps the label width, scaling it down if a translation runs long |
| `textNodeOptions` | Additional options passed straight through to the underlying `Text` node |

```ts
import { Font } from 'scenerystack/scenery';

const button = new TextPushButton( 'Randomize', {
  font: new Font( { size: 16, weight: 'bold' } ),
  textFill: 'white',
  baseColor: 'purple',
  maxTextWidth: 120,
  tandem: Tandem.REQUIRED
} );
```

::: tip Translated strings need `maxTextWidth`
A string that fits comfortably in English can overflow the button in another language. Always set `maxTextWidth` on a `TextPushButton` whose label comes from a translated `StringProperty`, so the text scales down instead of spilling outside the button's bounds.
:::
