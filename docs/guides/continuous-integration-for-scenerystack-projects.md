---
title: Continuous Integration for SceneryStack Projects
description: What a CI pipeline for a SceneryStack simulation repository typically checks - type-checking, linting, a production build, unit tests, and automated fuzzing.
category: guides
tags: [ci, testing, build, tooling, quality]
status: complete
related:
  - /guides/testing-and-qa-strategy-overview
  - /getting-started/running-and-building-a-simulation
  - /patterns/testing-model-logic-headlessly
  - /cookbook/fuzz-testing-a-simulation-locally
prerequisites:
  - /getting-started/running-and-building-a-simulation
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Continuous Integration for SceneryStack Projects

A SceneryStack simulation is a normal bundler-based TypeScript web app (see [Running and Building a Simulation](/getting-started/running-and-building-a-simulation)), so its CI pipeline looks like any other TypeScript project's — the checks below aren't SceneryStack-specific machinery, they're the standard set applied to a project that happens to be a simulation. What *is* worth calling out is the order and the specific failure modes each check is aimed at, since a sim repo has a couple of failure modes (assertion-only bugs, fuzz-crashes) a generic web app CI checklist wouldn't otherwise think to include.

## What a pipeline typically checks, in order

| Check | Catches | Roughly maps to |
| --- | --- | --- |
| Type-check (`tsc --noEmit`, or the bundler's own type-check step) | Type errors that would only surface at runtime otherwise | Fastest, cheapest check — run first so a trivial mistake fails in seconds |
| Lint (ESLint, or whatever the project scaffolded) | Style/consistency issues, common bug patterns (unused variables, missing `dispose()` overrides caught by custom rules, etc.) | Also fast, independent of the other checks |
| Unit tests | Model logic regressions | [Testing Model Logic Headlessly](/patterns/testing-model-logic-headlessly) — runs in plain Node.js, no browser needed |
| Production build (`npm run build`) | Bundler configuration errors, missing assets, import errors that only show up once the whole dependency graph is resolved | [Running and Building a Simulation](/getting-started/running-and-building-a-simulation) |
| Automated fuzz-testing (optional but recommended) | Crashes from input sequences no test author thought to write by hand | [Fuzz-Testing a Simulation Locally](/cookbook/fuzz-testing-a-simulation-locally), run headlessly against a built or served sim |

Ordering matters mostly for feedback speed: type-checking and linting fail in seconds and don't require installing a browser or building anything, so they should fail first and fast, before a slower build or fuzz step ever starts. A CI configuration that runs the production build before the type-check just means a contributor waits longer to find out about a typo.

## Why the production build itself is a check, not just an artifact

`npm run build` catches a category of bug that neither the type-checker nor unit tests can see: a bundler misconfiguration (a wrong base path, an unresolvable asset import, a circular dependency the dev server tolerated but the production bundler doesn't) only surfaces when the whole project is actually bundled for production. Running `npm run build` in CI — even if nothing downstream of it deploys the result — is what guarantees "it built on my machine" isn't the first time a break in the build is discovered.

## Automated fuzzing in CI

Once a sim can be served (locally, or from the CI job's own build output), running it under `?fuzz` for a fixed duration and failing the job on any uncaught exception (see [Fuzz-Testing a Simulation Locally](/cookbook/fuzz-testing-a-simulation-locally)) extends the "does this crash" question from "did a human happen to try this sequence of clicks" to "did we throw a few thousand randomized ones at it." This is the one check in the table that needs an actual browser (typically headless, via Playwright/Puppeteer or similar) rather than just Node.js — budget it as a separate, slower CI job if the rest of the pipeline is otherwise browser-free.

## A concrete illustration: this wiki's own CI

This documentation site isn't a simulation, but its own CI pipeline (`.github/workflows/ci.yml` in this repository) follows the same shape at a smaller scale, and is a real, inspectable example of the pattern: checkout, install with `npm ci` (not `npm install` — reproducible against the lockfile), then two validation steps (`npm run generate`, which fails loudly on frontmatter/link errors, and `npx vitepress build docs`, the production build) — both gating whether a pull request can merge. A separate workflow (`.github/workflows/deploy.yml`) only runs the production build and publishes it, on pushes to `main`, after those checks would already have passed on the corresponding PR. The same two-workflow split — one that verifies on every change, one that builds-and-publishes only on `main` — is a reasonable default for a sim repo too: run type-check/lint/tests/build/fuzz on every PR, and reserve the publish step (see [Deploying a Simulation to GitHub Pages](/getting-started/deploying-to-github-pages)) for a separate workflow gated on the first one passing.

::: tip Use `npm ci`, not `npm install`, in every CI job
`npm ci` installs exactly the versions recorded in `package-lock.json` and fails outright if the lockfile and `package.json` are out of sync, rather than silently resolving new versions the way `npm install` can. A CI pipeline's entire value proposition — "if it's green, it works the same way it will everywhere else" — depends on every run installing identical dependencies, not whatever happened to be newest that day.
:::

## Where to go next

- [Testing and QA Strategy Overview](/guides/testing-and-qa-strategy-overview) — how CI's automated checks fit alongside manual QA passes
- [Running and Building a Simulation](/getting-started/running-and-building-a-simulation) — the build step CI is verifying
- [Fuzz-Testing a Simulation Locally](/cookbook/fuzz-testing-a-simulation-locally) — the recipe a fuzz-testing CI job automates
