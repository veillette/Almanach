---
title: Deploying a Simulation to GitHub Pages
description: Building a static SceneryStack simulation and publishing it to GitHub Pages via the gh-pages branch or GitHub Actions.
category: getting-started
tags: [deployment, github-pages, build, ci]
status: draft
related:
  - /getting-started/running-and-building-a-simulation
  - /getting-started/troubleshooting-common-setup-errors
  - /getting-started/supported-browsers
prerequisites:
  - /getting-started/installation-and-setup
  - /getting-started/running-and-building-a-simulation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://vite.dev/guide/static-deploy.html
---

# Deploying a Simulation to GitHub Pages

A production build of a SceneryStack simulation is exactly what GitHub Pages wants: a folder of static HTML, JS, CSS, and media, with no server-side runtime. This page walks through turning `npm run build`'s output into a live `https://<user>.github.io/<repo>/` URL, both by hand (pushing to a `gh-pages` branch) and with a GitHub Actions workflow that rebuilds on every push.

::: warning Set the base path before you build, not after
GitHub Pages serves a project site from a subpath (`/<repo>/`), not the domain root. If your bundler config assumes root-relative asset paths (the default for most Vite/Webpack/Esbuild scaffolds), the deployed page loads with every script and asset 404ing, because the browser requests `/main.js` instead of `/<repo>/main.js`. Set the base path in the bundler config *before* running the production build — see below — not by editing the built output afterward.
:::

## What you're deploying

As covered in [Running and Building a Simulation](/getting-started/running-and-building-a-simulation), `npm run build` runs whichever bundler you picked during `npm create scenerystack@latest` in production mode and emits a static bundle — `dist/` for Vite/Esbuild, `build/` for some Webpack configs. That output is entirely self-contained: every `scenerystack/*` import, image, and sound file the bundler could resolve is already inlined or copied alongside the built JS. There is nothing GitHub Pages-specific about the build itself; the only thing you need to get right is *where the built files expect to be served from*.

## Setting the base path

Tell the bundler the site will live under `/<repo>/` rather than at the domain root. For a Vite-scaffolded project, this is the `base` option in `vite.config.ts`:

```ts
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig( {
  base: '/my-simulation-repo/'
} );
```

For a Webpack-scaffolded project, the equivalent is `output.publicPath`:

```js
// webpack.config.js
module.exports = {
  output: {
    publicPath: '/my-simulation-repo/'
  }
};
```

If you're deploying to a *user or organization* Pages site (`https://<user>.github.io/`, not a project subpath), the base path is `/` and you can skip this step — that's the one case where the default root-relative config already matches.

## Option 1: publish the built output to a `gh-pages` branch

The simplest path for a one-off or infrequent deploy: build locally, then push the output directory to a `gh-pages` branch, which GitHub Pages serves from directly (configure this once in the repo's Settings → Pages → "Deploy from a branch").

```bash
npm run build
npx gh-pages -d dist
```

[`gh-pages`](https://www.npmjs.com/package/gh-pages) (add it with `npm install --save-dev gh-pages`) commits the contents of `dist/` to a `gh-pages` branch and force-pushes it, without disturbing your `main` branch's history. Repeat the two commands above whenever you want to publish a new version — nothing about this workflow is SceneryStack-specific, it's the standard static-site-on-Pages pattern applied to your build output.

## Option 2: a GitHub Actions workflow (recommended for anything shared)

Committing built artifacts to `gh-pages` by hand works, but it's easy to forget to rebuild before publishing, or to publish a build made with local, uncommitted changes. A workflow that builds from source on every push to `main` avoids both problems:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - id: deployment
        uses: actions/deploy-pages@v4
```

This uses GitHub's own `actions/deploy-pages` flow rather than a `gh-pages` branch — enable it once in Settings → Pages → Source → "GitHub Actions". Every push to `main` re-runs `npm ci && npm run build` in a clean environment, so what's published always matches what's committed; there's no local build step to remember, and no chance of publishing a build made against a dirty working tree.

| Piece | Why it's there |
| --- | --- |
| `npm ci` | Installs exactly the versions in `package-lock.json` — reproducible across CI runs, unlike `npm install` |
| `node-version: 20` | Match whatever Node version you develop against; see [Troubleshooting Common Setup Errors](/getting-started/troubleshooting-common-setup-errors) for why version drift causes build failures |
| `upload-pages-artifact` / `deploy-pages` | GitHub's official Pages-deployment actions — no third-party `gh-pages` dependency needed in the CI path |

## Verifying the deployed build

Once the workflow finishes (or the `gh-pages` push lands), visit `https://<user>.github.io/<repo>/`. Two failure modes are specific to this deployment shape rather than the simulation code itself:

- **Blank page, 404s in the console for JS/CSS/image files** — the base path wasn't set (or was set to `/` when the site actually lives at `/<repo>/`). Fix the bundler's `base`/`publicPath` and rebuild.
- **Page loads but sounds/images are missing** — usually a case-sensitivity mismatch between an import path and the actual filename; GitHub Pages' file server is case-sensitive even if your local OS filesystem isn't, so this can build and run locally while 404ing once deployed.

Also worth doing before you push: `npm run build`'s output has SceneryStack's runtime assertions compiled away (see [Running and Building a Simulation](/getting-started/running-and-building-a-simulation)), so bugs that assertions would have caught in dev can surface only in the deployed build. Serve `dist/` locally with a static file server (`npx serve dist`, or your bundler's `preview` command) and click through the sim before pushing to Pages, rather than discovering a production-only bug for the first time in front of users.

## Where to go next

- [Running and Building a Simulation](/getting-started/running-and-building-a-simulation) — the dev/build workflow this page's build step assumes
- [Troubleshooting Common Setup Errors](/getting-started/troubleshooting-common-setup-errors) — Node version and dependency issues that most often break a CI build
- [Supported Browsers](/getting-started/supported-browsers) — the platform matrix to verify against once deployed
