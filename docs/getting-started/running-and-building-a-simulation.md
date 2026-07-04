---
title: Running and Building a Simulation
description: Dev server workflow and production build output for a SceneryStack sim.
category: getting-started
tags: [build, tooling, dev-server]
status: verified
related:
  - /getting-started/installation-and-setup
  - /getting-started/project-structure-conventions
  - /getting-started/supported-browsers
prerequisites:
  - /getting-started/installation-and-setup
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Running and Building a Simulation

A SceneryStack project is a normal bundler-based TypeScript web app: there's no SceneryStack-specific dev server or build tool, just the bundler you picked when scaffolding — [Vite](https://vite.dev/), [Webpack](https://webpack.js.org/), [Esbuild](https://esbuild.github.io/), or [Parcel](https://parceljs.org/) — configured to serve and bundle a page that imports `scenerystack/sim`.

## Development

`npm create scenerystack@latest` wires an npm script (conventionally `npm run dev` or `npm start`, depending on the bundler chosen) that starts the bundler's dev server:

```bash
npm run dev
```

This serves the sim with live reload at a `localhost` URL. Because a `Sim` fills the browser window and reads query parameters at startup (see [Preferences and Feature Flags](/guides/preferences-and-feature-flags)), the dev server URL is where you append query parameters while iterating, e.g. `http://localhost:5173/?ea` to enable assertions.

::: tip Enable assertions during development
Append `?ea` to the dev URL to turn on SceneryStack's runtime assertions. They catch invalid option values and API misuse immediately instead of failing silently or much later — always develop with `?ea` on, and rely on production builds (which strip it) for the assertion-free path users get.
:::

## Production build

The scaffolded build script runs the bundler in production mode:

```bash
npm run build
```

This produces a single self-contained bundle (plus any referenced assets) under the bundler's default output directory (`dist/` for Vite/Esbuild, `build/` for some Webpack configs). The output is static HTML/JS/CSS/media — it can be hosted from any static file server or CDN with no server-side runtime.

Two things distinguish a SceneryStack production build from a generic web app build:

| Aspect | Effect |
| --- | --- |
| Assertions stripped | Runtime `assert && assert(...)` checks used throughout SceneryStack compile away, so production is both smaller and faster than a dev build |
| Asset inlining | Images, sounds, and generated string modules referenced via `scenerystack/*` imports get bundled the same way any other module import does — no separate asset pipeline to configure |

## Where to go next

- [Supported Browsers](/getting-started/supported-browsers) — the platform matrix a production build should target
- [Preferences and Feature Flags](/guides/preferences-and-feature-flags) — query parameters available at both dev and production URLs
- [Project Structure Conventions](/getting-started/project-structure-conventions) — the source layout the bundler consumes
