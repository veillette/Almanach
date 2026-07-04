---
title: Troubleshooting Common Setup Errors
description: The most likely failure modes when starting a new scenerystack project - Node version mismatches, wrong import subpaths, missing peer deps, and TypeScript module resolution.
category: getting-started
tags: [troubleshooting, setup, typescript, tooling]
status: verified
related:
  - /getting-started/installation-and-setup
  - /getting-started/supported-browsers
  - /getting-started/running-and-building-a-simulation
prerequisites:
  - /getting-started/installation-and-setup
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Troubleshooting Common Setup Errors

Most setup problems with a new SceneryStack project fall into a handful of recurring shapes: a Node version too old for the tooling, an import written against the package root instead of a subpath, a peer dependency the scaffolder assumed but didn't install, or a `tsconfig.json` module-resolution setting that doesn't understand package subpath exports. This page walks through each, with the error text you'll actually see and the fix.

## "Cannot find module 'scenerystack'" or "'scenerystack/scenery' has no exported member"

This is almost always an import written against the wrong place. SceneryStack does not export anything usable from its bare package root — every library is its own subpath:

```ts
// Wrong: nothing useful lives at the package root
import { Node } from 'scenerystack';

// Right: import from the subpath for the library you need
import { Node } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';
```

If you're getting the "no exported member" flavor of this error rather than "cannot find module," double check you're importing the *class* from the *library* that actually exports it — a common slip is assuming `Sim`/`Screen`/`ScreenView` live in `scenerystack/joist` (the underlying repository's name) when the published package actually exports them from `scenerystack/sim`; `scenerystack/joist` exists but only exports supporting pieces. See [What is SceneryStack?](/getting-started/what-is-scenerystack) for the full library-to-subpath table.

## "SyntaxError: Unexpected token 'export'" or the dev server won't start

This is usually a Node version too old for the scaffolded tooling. SceneryStack's published package and its scaffolder (`npm create scenerystack@latest`) target current Node LTS releases; an old Node binary can fail confusingly rather than with a clear version error, especially inside a bundler's own dependency chain. Check your version and, if it's old, use a version manager to get current LTS:

```bash
node --version
# if it's below the current LTS line, e.g. Node 16 or 18:
nvm install --lts
nvm use --lts
```

Delete `node_modules` and reinstall after switching Node versions — native/binary dependencies (esbuild, some Vite optionals) are compiled per Node ABI version and a stale install can produce obscure runtime errors that look unrelated to Node at all:

```bash
rm -rf node_modules package-lock.json
npm install
```

## TypeScript can't resolve `scenerystack/*` subpaths

If plain imports work at runtime (the bundler resolves them fine) but the TypeScript language server or `tsc` reports `Cannot find module 'scenerystack/scenery' or its corresponding type declarations`, the project's `tsconfig.json` is using a `moduleResolution` mode that predates Node's package `exports` map support. SceneryStack's package.json declares its subpaths via `exports`, which requires one of the newer resolution modes:

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "module": "ESNext",
    "target": "ES2022"
  }
}
```

`"moduleResolution": "node"` (the old default in many hand-written configs) only understands the legacy `main`/`module` fields, not subpath `exports`, and will fail to find types for anything under `scenerystack/*` even though the JavaScript resolves fine at bundle time. `"bundler"` (introduced in TypeScript 5.0) or `"node16"`/`"nodenext"` both understand `exports` maps correctly; `"bundler"` is what the official scaffolder generates and is the safer default if you're hand-writing a `tsconfig.json` for an existing project instead of scaffolding a new one.

## Missing peer dependency warnings after `npm install scenerystack`

Adding SceneryStack to an existing project (rather than scaffolding fresh) means you're responsible for the bundler and dev tooling yourself — `scenerystack` itself has no bundler as a dependency, so `npm install scenerystack` alone gets you the library but not something that can serve or build it. If you see the app fail to start with errors pointing at a missing bundler binary or config file, you likely skipped setting up Vite/Webpack/Esbuild/Parcel:

```bash
npm install scenerystack
npm install --save-dev vite   # or webpack, esbuild, parcel — whichever you're standardizing on
```

If you're not sure which bundler to use, `npm create scenerystack@latest` in a throwaway directory and copying its generated config is the fastest way to get a known-working baseline rather than assembling one from scratch — see [Installation and Setup](/getting-started/installation-and-setup).

## Assertions silently doing nothing

If invalid option values or misuse of the SceneryStack API aren't producing the errors you'd expect, check whether you're running with assertions enabled. Assertions are opt-in via a query parameter at dev time and compiled away entirely in production builds — a dev server URL without `?ea` behaves like a production build with respect to error-catching, which can make a real bug look like it "just doesn't happen" until it does, at a less convenient time:

```
http://localhost:5173/?ea
```

## Blank page with no console errors at all

If the page loads (no 404s, no thrown errors) but nothing renders, check that you're constructing the `Sim` inside `onReadyToLaunch`, not at module scope. SceneryStack's asset loader (fonts, images, generated strings) is asynchronous; a `Sim` constructed before it resolves can fail to paint without throwing, because the loader itself hasn't errored — it just hasn't finished. See [Your First Simulation](/getting-started/your-first-simulation) for the correct `onReadyToLaunch` wiring.

::: tip When in doubt, isolate with a fresh scaffold
If an error doesn't match anything above, scaffold a brand-new project with `npm create scenerystack@latest` in a scratch directory and reproduce the minimal failing case there. It rules out an entire category of causes — a stale lockfile, an accidentally hand-edited config, a Node/npm version mismatch specific to the broken project — in one step, and gives you a known-good baseline to diff your actual project's config against.
:::

## Where to go next

- [Installation and Setup](/getting-started/installation-and-setup) — the scaffolding and manual-install paths these errors most often stem from
- [Supported Browsers](/getting-started/supported-browsers) — platform-level compatibility issues, as distinct from local build/setup issues
- [Running and Building a Simulation](/getting-started/running-and-building-a-simulation) — the dev-server/build workflow referenced throughout this page
