---
title: SimInfo
description: A snapshot of runtime/browser/simulation diagnostic data, built once per Sim and surfaced via the About dialog and PhET-iO data stream.
category: api
library: joist
tags: [joist, SimInfo, Sim, phet-io]
status: complete
related:
  - /api/joist/sim
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# SimInfo

`SimInfo` is a diagnostic snapshot — sim name/version, screen names, browser user agent, viewport size, WebGL support, and (when running under PhET-iO) data-stream/wrapper metadata — collected once when a [`Sim`](/api/joist/sim) starts up. `Sim` constructs exactly one internally (`this.simInfo = new SimInfo( this )`, an internal/private field); as a simulation author you don't construct one yourself or read it off `sim` directly. It exists mostly so PhET-iO's data stream can emit a `simStarted` event describing the environment, and to back the diagnostic info shown in the sim's About dialog.

```ts
import type { SimInfoState } from 'scenerystack/sim';
// SimInfo itself is constructed internally by Sim; simulation code doesn't create instances directly.
```

::: tip This is a read-only diagnostic record, not a live/reactive object
Every field in `SimInfoState` is captured once, synchronously, at construction time (`self.navigator.userAgent`, `window.innerWidth`, etc.) — there are no Properties here to `link()` to, and nothing updates after the fact (e.g. resizing the browser window afterward doesn't change the captured `window` field). If you need live values for something `SimInfo` also captures — like viewport size — use `Sim.dimensionProperty` instead.
:::

## Constructor

```ts
new SimInfo( sim: Sim )
```

Constructed once, internally, by `Sim`.

## `SimInfoState` fields

| Field | Contents |
| --- | --- |
| `simName`, `simVersion`, `repoName` | The sim's display name, version string, and repository name |
| `screens` | One `{ name, phetioID? }` entry per entry in `sim.screens` |
| `url`, `userAgent`, `language`, `referrer` | Captured from `location`/`navigator`/`document` at startup |
| `window` | The browser viewport size at startup, as a `"widthxheight"` string |
| `pixelRatio`, `isWebGLSupported`, `checkIE11StencilSupport`, `flags` | Rendering-capability diagnostics (device pixel ratio vs. backing-store ratio, WebGL availability, assorted browser input-capability flags) |
| `screenPropertyValue`, `wrapperMetadata`, `dataStreamVersion`, `phetioCommandProcessorProtocol` | Populated only when running under PhET-iO |

## Related

- [Sim](/api/joist/sim) — constructs the single `SimInfo` instance and is the source of most of its data (`simNameProperty`, `screens`, `version`).
