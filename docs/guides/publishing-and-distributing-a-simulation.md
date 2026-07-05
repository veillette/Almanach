---
title: Publishing and Distributing a Simulation
description: What a SceneryStack production build produces and the common ways to host it - static hosting, GitHub Pages, or a project's own server.
category: guides
tags: [deployment, build, hosting, distribution]
status: complete
related:
  - /getting-started/running-and-building-a-simulation
  - /getting-started/deploying-to-github-pages
  - /getting-started/supported-browsers
prerequisites:
  - /getting-started/running-and-building-a-simulation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Publishing and Distributing a Simulation

Once a simulation is built, "publishing" it is entirely a static-hosting problem — there is no SceneryStack-specific server, database, or runtime to stand up. This page covers what a production build actually is, and the tradeoffs between the handful of common places to put it.

## What you're distributing

As covered in [Running and Building a Simulation](/getting-started/running-and-building-a-simulation), `npm run build` runs the project's bundler in production mode and produces a self-contained folder of static HTML, JS, CSS, and media (`dist/` for Vite/Esbuild, `build/` for some Webpack configs). Every `scenerystack/*` import, image, and sound file the bundler could resolve is already inlined or copied alongside the built JS, and runtime assertions are stripped. That folder is the entire artifact — there is nothing else to package, containerize, or configure server-side before a browser can load it.

This has one direct consequence for distribution: **anything that can serve static files can host a SceneryStack simulation.** The choice of where to host isn't a technical constraint on the sim itself, it's a question of audience, update frequency, and who's already paying for what infrastructure.

## Where a built sim can live

| Option | Good fit when | Tradeoff |
| --- | --- | --- |
| [GitHub Pages](/getting-started/deploying-to-github-pages) | The project is already on GitHub, wants free hosting, and doesn't need a custom domain or server-side logic | Static only, and (for project sites) served from a `/repo-name/` subpath — the build's base path must match, see the linked page |
| A generic static host (Netlify, Vercel, Cloudflare Pages, an S3 bucket + CDN, etc.) | You want a custom domain, preview deployments per branch/PR, or hosting independent of a specific git forge | Slightly more setup than GitHub Pages, but usually still just "point it at the build output folder" |
| Your own web server (nginx, Apache, or any static file server) | The sim needs to live alongside other institutional content, behind an existing domain/auth layer, or fully under your own infrastructure control | You own the uptime, TLS certificates, and cache headers yourself instead of a managed provider handling them |
| Opening `dist/index.html` directly from disk, or a local static server (`npx serve dist`) | Local testing, or distributing to a single person/classroom without any hosting at all | No shareable URL; some browsers restrict `file://`-loaded assets (module imports, in particular) more than an actual HTTP server would |

None of these change what gets built — the same `dist/` folder from `npm run build` is what you'd push to a `gh-pages` branch, upload to Netlify, or `scp` onto your own server. The only per-target adjustment is usually the bundler's base-path/`publicPath` setting (see the GitHub Pages page for the concrete example), which needs to match wherever the files will actually be served from.

## Versioning what you distribute

A sim distributed publicly will eventually need more than one version live at once — a "current" version and an archived prior release someone has bookmarked or cited. Since a build is just a static folder, the simplest version scheme is directory-based: publish each release to its own path (`/my-sim/1.2.0/`, `/my-sim/1.1.0/`) rather than overwriting the same location on every release, and point a `/my-sim/latest/` alias (a redirect, or a copy of the newest build) at whichever one is current. This costs nothing extra at build time — it's purely a decision about *where* each build's output is uploaded — and it means an old link never silently starts serving different content than what was originally shared.

::: tip Verify the deployed build before announcing it, not after
Every distribution target strips runtime assertions the same way (see [Running and Building a Simulation](/getting-started/running-and-building-a-simulation)) and serves case-sensitive file paths even if your local development machine doesn't enforce that. Serve the built output locally (`npx serve dist` or your bundler's `preview` command) and click through the sim once before publishing, rather than discovering a production-only bug for the first time in front of the sim's actual audience — see the verification checklist in [Deploying a Simulation to GitHub Pages](/getting-started/deploying-to-github-pages) for the specific failure modes to check.
:::

## Where to go next

- [Running and Building a Simulation](/getting-started/running-and-building-a-simulation) — how the artifact this page distributes gets built
- [Deploying a Simulation to GitHub Pages](/getting-started/deploying-to-github-pages) — the concrete, step-by-step path for one specific (free, common) hosting target
- [Supported Browsers](/getting-started/supported-browsers) — the platform matrix to verify a distributed build against
