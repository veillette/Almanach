---
title: Installation and Setup
description: Setting up a new SceneryStack project - npm install, TypeScript config, and dev tooling.
category: getting-started
tags: [setup, installation, tooling, typescript]
status: complete
related:
  - /getting-started/what-is-scenerystack
  - /getting-started/your-first-simulation
  - /getting-started/scenery-application-vs-standalone-library
  - /getting-started/project-structure-conventions
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/learn/setup/
---

# Installation and Setup

SceneryStack is a TypeScript framework, published as a single npm package. Before writing any code you need Node.js, npm, and (for cloning the underlying libraries) Git — everything else is standard JavaScript tooling.

## Prerequisites

| Tool | Why you need it |
| --- | --- |
| A command line (Terminal, PowerShell, etc.) | Running `npm`/`npx` commands |
| [Git](https://git-scm.com/downloads) | Checking out PhET's source repositories if you ever need to patch a library — see [Modifying SceneryStack](/guides/modifying-scenerystack) |
| [Node.js and npm](https://nodejs.org/) | Installing dependencies and running the dev server/build |

SceneryStack **is a TypeScript library**: it can be consumed from plain JavaScript, but its options objects rely entirely on compile-time types rather than runtime checks, so TypeScript is strongly recommended. Any editor with good TypeScript support works well — [VS Code](https://code.visualstudio.com/) and [WebStorm](https://www.jetbrains.com/webstorm/) are the two most commonly used by SceneryStack maintainers.

## Scaffolding a new project (recommended)

The fastest way to start a new simulation or application is the official scaffolding tool:

```bash
npm create scenerystack@latest
```

This walks you through:

- naming the project (it creates a directory with that name)
- choosing a bundler — [Vite](https://vite.dev/), [Webpack](https://webpack.js.org/), [Esbuild](https://esbuild.github.io/), or [Parcel](https://parceljs.org/)
- whether to set up [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/)

...and prints the exact commands to install dependencies and open the running project in your browser. See [Your First Simulation](/getting-started/your-first-simulation) for what the generated code looks like, and [Running and Building a Simulation](/getting-started/running-and-building-a-simulation) for the dev-server/build workflow it wires up.

## Adding SceneryStack to an existing project

If you already have a bundler-based project and just want the library:

```bash
npm install scenerystack
```

Then import from the subpath for whichever library you need — `scenerystack` is not meant to be imported from its bare package root:

```ts
import { Node, Text } from 'scenerystack/scenery';
import { Property } from 'scenerystack/axon';
```

::: tip Import from subpaths, not the package root
Every SceneryStack library — `axon`, `dot`, `kite`, `scenery`, `sun`, `scenery-phet`, `joist`, `sim`, `tandem`, `phetcommon`, and others — is its own subpath export (`scenerystack/<library>`). There is no flat `scenerystack` import; see [What is SceneryStack?](/getting-started/what-is-scenerystack) for the full library table.
:::

## Where to go next

- [Your First Simulation](/getting-started/your-first-simulation) — build a minimal one-screen `Sim`
- [Scenery Application vs. Standalone Library](/getting-started/scenery-application-vs-standalone-library) — decide whether you even need `Sim`
- [Project Structure Conventions](/getting-started/project-structure-conventions) — how a SceneryStack repo is usually laid out
- [Supported Browsers](/getting-started/supported-browsers) — the platform support matrix to design against
