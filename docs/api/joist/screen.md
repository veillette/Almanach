---
title: Screen
description: Pairing a model factory and view factory into one selectable unit of a Sim.
category: api
library: joist
tags: [joist, Screen]
status: verified
related:
  - /api/joist/sim
  - /api/joist/screen-view
  - /api/tandem/tandem
  - /getting-started/your-first-simulation
prerequisites:
  - /api/joist/sim
  - /api/joist/screen-view
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Screen

`Screen` is the largest organizational chunk inside a [`Sim`](/api/joist/sim): it pairs a model factory and a view factory into one selectable unit, shown as a button in the navigation bar (and, for multi-screen sims, on the home screen). `Screen` doesn't build the model or view itself — it holds *functions* that build them lazily, plus the name/icons/background color used to represent the screen in the UI.

::: warning `Screen` is exported from `scenerystack/sim`, not `scenerystack/joist`
Same gotcha as [`Sim`](/api/joist/sim): despite living in the `joist` repository, the published package exports `Screen` from **`scenerystack/sim`**, alongside `Sim` and [`ScreenView`](/api/joist/screen-view).
:::

```ts
import { Screen } from 'scenerystack/sim';
import { Tandem } from 'scenerystack/tandem';
import { Property } from 'scenerystack/axon';
```

## A minimal example

```ts
const screenTandem = Tandem.ROOT.createTandem( 'myScreen' );

const myScreen = new Screen(
  () => new MyModel(),
  model => new MyScreenView( model, { tandem: screenTandem.createTandem( 'view' ) } ),
  {
    name: new Property( 'My Screen' ),
    backgroundColorProperty: new Property( 'white' ),
    tandem: screenTandem
  }
);
```

## Constructor

```ts
new Screen<M extends TModel, V extends ScreenView>(
  createModel: () => M,
  createView: ( model: M ) => V,
  providedOptions: ScreenOptions
)
```

`createModel` and `createView` are called lazily by the owning `Sim` (only once the screen is actually needed), not eagerly at `Screen` construction time. `tandem` is the one option that's always required — everything else has a usable default for a single-screen sim.

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `name` | `null` | A `Property<string>` shown as the screen's label; required for multi-screen sims, may be omitted for single-screen sims |
| `backgroundColorProperty` | `Property( 'white' )` | Background color behind the screen's view |
| `homeScreenIcon` | auto-generated rectangle | Icon shown on the home screen button for this screen |
| `navigationBarIcon` | defaults to `homeScreenIcon`, scaled | Icon shown in the navigation bar; both icons must share the same aspect ratio |
| `showUnselectedHomeScreenIconFrame` | `false` | Whether to draw a frame around this screen's home-screen icon when it isn't selected |
| `showScreenIconFrameForNavigationBarFill` | `null` | Draw a frame around the navigation bar icon when the bar's fill is `'black'` or `'white'` (or `null` for no frame) |
| `maxDT` | `0.5` | Caps the `dt` passed to the model/view per frame, to avoid large jumps after e.g. a background tab resumes |
| `createKeyboardHelpNode` | `null` | `( tandem ) => Node` building the content shown in the keyboard-help dialog for this screen |
| `screenButtonsHelpText` | derived from `name` | Accessible help text on the home screen and navigation bar buttons for this screen |
| `instrumentNameProperty` | `true` | Whether `nameProperty` is instrumented for PhET-iO |

## Public API

| Member | Description |
| --- | --- |
| `model` | The constructed model (getter) — asserts if accessed before `initializeModel()` has run |
| `view` | The constructed [`ScreenView`](/api/joist/screen-view) (getter) — asserts if accessed before `initializeView()` has run |
| `hasModel()` / `hasView()` | Whether the model/view have been constructed yet |
| `activeProperty` | `BooleanProperty` — whether this screen is the one currently displayed |
| `nameProperty` | `TReadOnlyProperty<string>` — the screen's display name (empty string if `name` was omitted) |
| `reset()` | Called by `ResetAllButton` handling; the base implementation is a no-op (background color is intentionally not reset here) |

::: tip Model and view aren't built until the screen is needed
`createModel`/`createView` are only invoked once, lazily, when `Sim` initializes that screen — this is what lets multi-screen sims start up faster by deferring work for screens the user hasn't visited yet. Don't rely on side effects in the constructor of a not-yet-selected screen having already run.
:::
