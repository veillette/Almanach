---
title: Modifying SceneryStack
description: Workflow for patching or contributing to the underlying common-code libraries.
category: guides
tags: [contributing, open-source, workflow]
status: complete
related:
  - /getting-started/installation-and-setup
  - /getting-started/what-is-scenerystack
prerequisites:
  - /getting-started/installation-and-setup
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://github.com/phetsims
---

# Modifying SceneryStack

The `scenerystack` npm package is a **built artifact**: its `dist/` bundles and `src/` barrel files are compiled from dozens of separate PhET repositories (`scenery`, `axon`, `joist`, `sun`, `scenery-phet`, and more, all under [github.com/phetsims](https://github.com/phetsims)). If you ever need to patch a bug in one of those libraries — not just work around it in your own code — you check out the source repositories and rebuild the package locally, rather than editing files inside `node_modules`.

::: warning Never hand-edit `node_modules/scenerystack`
Any change made directly inside `node_modules` is silently lost the next time anything runs `npm install`. If you need to change SceneryStack's own code, follow the checkout/build workflow below in a separate directory and point your project at the result — don't patch the installed copy in place.
:::

## Checking out the source repositories

In an empty directory (not your project's `node_modules`):

```bash
mkdir scenerystack-src && cd scenerystack-src
npx scenerystack checkout
```

This clones every underlying repository (`scenery`, `axon`, `joist`, `sun`, `scenery-phet`, `dot`, `kite`, `tandem`, `phetcommon`, and the rest) into the current directory. Running it again later pulls newer sources into the same checkout.

To pin a specific released version instead of the latest sources:

```bash
npx scenerystack checkout 0.0.14
```

## Making your change

Edit the relevant file in whichever cloned repository owns it — e.g. a `scenery` drag-interaction bug lives under `scenery/js/listeners/`, a `sun` component bug under `sun/js/`. Since these are real git checkouts of the PhET repositories, normal git workflow applies: branch, commit, and (if you intend to contribute upstream) open a pull request against the corresponding `phetsims/<repo>` repository.

## Rebuilding the package

From the same directory:

```bash
npx scenerystack build
```

This builds the entire stack — including your modified repository — into a local `scenerystack` package output.

## Pointing your project at the local build

In the project that needs the patched behavior, replace the registry dependency with a file reference in `package.json`:

```json
{
  "dependencies": {
    "scenerystack": "file:../scenerystack-src/scenerystack"
  }
}
```

Then reinstall so npm picks up the local copy:

```bash
npm install
```

Your project now imports the patched code through the exact same `scenerystack/<library>` subpaths as before — nothing about your application code changes, only where the package resolves from.

## Where to go next

- [Installation and Setup](/getting-started/installation-and-setup) — the normal (registry) installation path this workflow diverges from
- [What is SceneryStack?](/getting-started/what-is-scenerystack) — the full list of libraries bundled into the package
