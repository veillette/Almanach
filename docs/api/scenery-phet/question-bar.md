---
title: QuestionBar
description: A StatusBar that floats a single bold framing question at the top of a screen.
category: api
library: scenery-phet
tags: [scenery-phet, QuestionBar]
status: complete
related:
  - /api/scenery-phet/status-bar
  - /api/vegas/status-bars
prerequisites:
  - /api/scenery-phet/status-bar
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# QuestionBar

`QuestionBar` (from `scenerystack/scenery-phet`) is a [`StatusBar`](/api/scenery-phet/status-bar) subclass that shows a single bold `Text` — a framing question or instruction — left-aligned and vertically centered in the bar. Its own source comment describes the intent: "In every screen, the question bar at the top provides a framing question and context." It's simpler than `vegas`'s [`FiniteStatusBar`/`InfiniteStatusBar`](/api/vegas/status-bars): no score display, no level text, no buttons — just one piece of text.

```ts
import { QuestionBar } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const questionBar = new QuestionBar( this.layoutBounds, this.visibleBoundsProperty, {
  questionString: 'How does temperature affect pressure?',
  tandem: tandem.createTandem( 'questionBar' )
} );
this.addChild( questionBar );
```

## Constructor

```ts
new QuestionBar(
  layoutBounds: Bounds2,
  visibleBoundsProperty: TReadOnlyProperty<Bounds2>,
  providedOptions: QuestionBarOptions
)
```

Like [`StatusBar`](/api/scenery-phet/status-bar), it takes the `ScreenView`'s `layoutBounds` and `visibleBoundsProperty` first so the bar (and its text) can stretch to the browser's actual visible width.

## Options

`QuestionBarOptions` is `SelfOptions & StatusBarOptions` with `floatToTop` omitted (fixed internally) — it accepts the [same `barFill`/`barHeight`/`xMargin`/etc. options as `StatusBar`](/api/scenery-phet/status-bar), plus:

| Option | Default | Effect |
| --- | --- | --- |
| `questionString` | — (required) | The question text, as a plain `string` or a `TReadOnlyProperty<string>` for i18n/dynamic updates |
| `textOptions` | `{ font: new PhetFont( { weight: 'bold', size: '23px' } ), maxWidth: layoutBounds.width - 60 }` | Options for the internal `Text` node |
| `floatToTop` | `true` (fixed, not overridable) | `QuestionBar` always floats to the top of the browser's visible bounds |
| `barHeight` | `70` | Taller than `StatusBar`'s own default of `50`, to comfortably fit a large bold question |

## Layout

The question `Text` is kept left-aligned with a fixed `30`px margin and vertically centered using a `Multilink` on the text's own bounds and the inherited `positioningBoundsProperty` — so it re-centers automatically both when the string changes length and when the browser window resizes.

::: tip Use `QuestionBar` for framing text, `FiniteStatusBar`/`InfiniteStatusBar` for scored games
If your screen needs a score display, level indicator, or timer alongside a message, reach for `vegas`'s [`FiniteStatusBar`/`InfiniteStatusBar`](/api/vegas/status-bars) instead — `QuestionBar` intentionally has no score-related options at all.
:::
