---
title: platform
description: A plain object of boolean browser/OS/engine feature-detection flags, computed once from navigator.userAgent at import time.
category: api
library: phet-core
tags: [phet-core, platform, browser, useragent]
status: complete
related:
  - /api/phet-core/assertion-helpers
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# platform

`platform` (from `scenerystack/phet-core`, note the lowercase name — it's a plain object, not a class) is a set of boolean flags describing the current browser and OS, derived once from `navigator.userAgent` when the module is first imported. It exists for the rare cases where SceneryStack's normal feature/capability abstractions aren't enough and code genuinely needs to branch on *which* browser it's running in.

```ts
import { platform } from 'scenerystack/phet-core';
```

## A minimal example

```ts
if ( platform.mobileSafari ) {
  // Work around an iOS Safari-specific rendering quirk.
  node.renderer = 'canvas';
}

if ( platform.firefox ) {
  // ...
}
```

## Flags

| Flag | True when |
| --- | --- |
| `firefox` | User agent string contains `"firefox"` (case-insensitive) |
| `mobileSafari` | Running as a PhET "phet-app" wrapper, or the UA matches iPod/iPhone/iPad, or `navigator.platform === 'MacIntel'` with multitouch (modern iPadOS reporting as Mac) — combined with an `AppleWebKit` match |
| `safari` | `mobileSafari`, or the UA matches a `Version/…` + `Safari/…` + `AppleWebKit` pattern (desktop Safari) |
| `safari5` / `safari6` / `safari7` / `safari9` / `safari10` / `safari11` | Desktop/iOS Safari matching that specific major version string |
| `ie` | Detected as any version of Internet Explorer (via `getInternetExplorerVersion() !== -1`) |
| `ie9` / `ie10` / `ie11` | Detected as that specific IE version |
| `edge` | UA contains `Edge/` (legacy EdgeHTML Edge, not Chromium Edge) |
| `chromium` | UA matches `chrom(e\|ium)` and is not legacy Edge |
| `chromeOS` | UA contains `CrOS` |
| `android` | UA contains `Android` |
| `mac` | `navigator.platform` contains `Mac` |

## Methods

`platform` has no methods — it is a plain object of booleans computed eagerly at import time, not re-evaluated if the environment somehow changes afterward.

::: warning "Use sparingly, if at all"
That's the source file's own doc comment. Almost everything `platform` is used for in practice — layout quirks, input event differences, rendering fallbacks — has a better, more targeted abstraction elsewhere in SceneryStack (feature detection, capability checks, CSS). Reach for `platform` only as a last resort for a genuinely browser-specific workaround, and prefer the narrowest flag available (e.g. `mobileSafari` over `safari`) so the branch doesn't accidentally widen to browsers you didn't test.
:::
