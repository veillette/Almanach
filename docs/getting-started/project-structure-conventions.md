---
title: Project Structure Conventions
description: Standard folder/file layout of a SceneryStack repo (model/view split, strings, images).
category: getting-started
tags: [conventions, project-structure, repo-layout]
status: verified
related:
  - /getting-started/running-and-building-a-simulation
  - /patterns/model-view-separation
  - /guides/translation-and-localization
prerequisites:
  - /getting-started/installation-and-setup
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Project Structure Conventions

`npm create scenerystack@latest` scaffolds a project, but it doesn't force a folder layout on your simulation-specific code — the conventions below are the ones PhET's own simulations (and most SceneryStack projects) converge on, because they keep [model-view separation](/patterns/model-view-separation) visible in the filesystem, not just in the code.

## A typical layout

```
my-simulation/
├── js/
│   ├── my-simulation-main.ts        # entry point: builds Screens and the Sim
│   ├── my-screen/
│   │   ├── model/
│   │   │   └── MyScreenModel.ts
│   │   └── view/
│   │       ├── MyScreenView.ts
│   │       └── MyThingNode.ts
│   └── common/                      # code shared by more than one screen
│       ├── model/
│       └── view/
├── images/                           # source art (SVG/PNG), one file per asset
├── sounds/                           # audio cues, if the sim uses scenery-phet sound
├── my-simulation-strings_en.json     # translatable strings, see Translation and Localization
├── package.json
├── tsconfig.json
└── index.html
```

The top-level split that matters most: **one folder per screen**, each with its own `model/` and `view/` subfolders, plus a `common/` folder for anything shared across screens. This mirrors the `Screen`/`ScreenView` pairing described in [Your First Simulation](/getting-started/your-first-simulation) — if your sim only has one screen, the per-screen folder is still worth keeping separate from `common/` so a second screen has somewhere obvious to go later.

## Where things live

| Path | Contents |
| --- | --- |
| `js/<screen-name>/model/` | Plain TypeScript classes holding `Property`/`Emitter` state — no `scenery` imports |
| `js/<screen-name>/view/` | `ScreenView` subclass plus any `Node` subclasses specific to that screen |
| `js/common/` | Model or view code shared by two or more screens |
| `images/` | Source images referenced via generated image modules (PNG, SVG, JPG) |
| `sounds/` | Audio files referenced the same way, for `scenery-phet`/`tambo` sound generators |
| `<sim-name>-strings_en.json` | The English source-of-truth strings file — see [Translation and Localization](/guides/translation-and-localization) |
| `<sim-name>-main.ts` | The only file that imports `Sim`/`Screen` and calls `onReadyToLaunch` |

::: tip Keep `model/` free of scenery imports
The fastest way to lose model-view separation over time is a stray `import { Node } from 'scenerystack/scenery'` inside a model file "just this once." If a model file ever needs to import from `scenerystack/scenery`, `sun`, or `scenery-phet`, that's a signal the code belongs in `view/` instead.
:::

## Where to go next

- [Running and Building a Simulation](/getting-started/running-and-building-a-simulation) — what the dev server and production build do with this layout
- [Model-View Separation](/patterns/model-view-separation) — the architectural rule this layout exists to reinforce
- [Translation and Localization](/guides/translation-and-localization) — how the strings file at the repo root becomes runtime `StringProperty` instances
