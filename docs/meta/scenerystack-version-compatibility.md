---
title: SceneryStack Version Compatibility Notes
description: Which scenerystack package version this wiki's content was checked against, and when a page's status/sourceRefs should be revisited as SceneryStack releases new versions.
category: meta
tags: [conventions, versioning, sourceRefs, contributing]
status: complete
related:
  - /meta/roadmap
  - /meta/authoring-guide
  - /meta/faq
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/reference/
---

# SceneryStack Version Compatibility Notes

This wiki documents the published `scenerystack` npm package, not a specific PhET source checkout — but "the published package" is a moving target. This page records which version backs the wiki's content, so a reader (or a contributor picking up further work) can tell how much to trust a given page's specifics against whatever `scenerystack` version they're actually running.

::: tip This wiki's own repository doesn't depend on scenerystack
Almanach is a documentation site, not a SceneryStack application — its own `package.json` lists only `vitepress` and the tooling used to generate the sidebar/`llms.txt`/`manifest.json`, not `scenerystack` itself. The version note below describes what content was checked against *during authoring* (by installing or inspecting the package out-of-band), not a dependency this repository builds against.
:::

## What's verified against which version

Every `api/` page and most narrative pages in this wiki were checked — directly, by inspecting the installed package's `exports` map and TypeScript source, not by assumption — against `scenerystack@3.0.0` (see [the FAQ](/meta/faq#which-package-version-does-this-wiki-document)). A page whose `status` is `verified` had its technical claims independently cross-checked against that same source; this wiki has not (yet) been re-verified against a subsequent major release.

## When to revisit a page's status/sourceRefs

`scenerystack` is under active development; nothing here should be read as "this documents SceneryStack, forever." Treat each of these as a signal that a page needs re-checking, not just a version bump:

- **A new `scenerystack` major (or minor with breaking changes) release ships.** Renamed classes, changed default option values, and removed/added exports are exactly the class of inaccuracy an independent verification pass is built to catch — a new release re-opens that risk for any page whose claims were checked against the old version.
- **A page is still `draft`, not `complete`/`verified`.** Per [the `status` lifecycle](/meta/authoring-guide#the-status-lifecycle), `draft` already means "not yet checked against real source" — such a page should be checked against the *current* published version when someone picks it up, not necessarily `3.0.0` specifically. See [the Roadmap's open work](/meta/roadmap#open-work) for the current list of `draft` pages.
- **A page's `sourceRefs` only points at the generic npm package page**, rather than a specific class/source file or the official reference — that's a weaker citation than a page whose `sourceRefs` links to something checkable line-by-line, and is a lower-priority but real candidate for a future tightening pass.
- **The [official reference](https://scenerystack.org/reference/) disagrees with this wiki.** As [the FAQ](/meta/faq#is-this-an-official-scenerystack-or-phet-resource) already states, the official reference wins in any disagreement — treat that as a signal the wiki page is stale for the version currently in use, not that the reference is wrong.

## What a future re-verification pass should do

A version-driven re-verification pass (triggered by a SceneryStack release rather than being the first pass) should:

1. Note the new version's number here, alongside `3.0.0`, once a meaningful fraction of the wiki has actually been re-checked against it — don't bump the version claimed above until the content backs it up.
2. Prioritize `api/` pages over narrative pages — class shapes, option names, and defaults are exactly what a version bump is most likely to change, where `patterns`/`guides`/`styling`/`accessibility` content tends to describe conventions that outlive a specific release.
3. Downgrade a page's `status` from `verified` back to `draft` (never leave it silently `verified` against stale claims) if re-checking surfaces a real discrepancy, and cite the new `sourceRefs` once corrected — consistent with how [the Authoring Guide](/meta/authoring-guide#the-status-lifecycle) defines what each status actually promises a reader.

::: warning `verified` describes a point-in-time check, not an ongoing guarantee
A `verified` page was checked against `scenerystack@3.0.0` at some point — it is not automatically re-checked when a new version ships. Nothing in this wiki's tooling currently detects "this page's claims are now stale because the package moved on"; that detection is exactly the gap this page exists to flag until a version-driven re-verification pass (see above) actually happens.
:::
