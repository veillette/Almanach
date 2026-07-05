---
title: SceneryStack Version Compatibility Notes
description: Which scenerystack package version this wiki's content was checked against, phase by phase, and when a page's status/sourceRefs should be revisited as SceneryStack releases new versions.
category: meta
tags: [conventions, versioning, sourceRefs, contributing]
status: complete
related:
  - /meta/roadmap
  - /meta/authoring-guide
  - /meta/faq
prerequisites:
  - /meta/roadmap
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/reference/
---

# SceneryStack Version Compatibility Notes

This wiki documents the published `scenerystack` npm package, not a specific PhET source checkout — but "the published package" is a moving target, and different parts of this wiki were checked against it at different points as the project grew across [phases](/meta/roadmap#phases). This page records which version backs which content, so a reader (or an agent picking up further work) can tell how much to trust a given page's specifics against whatever `scenerystack` version they're actually running.

::: tip This wiki's own repository doesn't depend on scenerystack
Almanach is a documentation site, not a SceneryStack application — its own `package.json` lists only `vitepress` and the tooling used to generate the sidebar/`llms.txt`/`manifest.json`, not `scenerystack` itself. The version notes below describe what content was checked against *during authoring* (by installing or inspecting the package out-of-band), not a dependency this repository builds against.
:::

## What's verified against which version

| Phase | Content | Checked against |
| --- | --- | --- |
| Phase 1 (core coverage) and Phase 2 (deep coverage) | The original ~231-page plan: onboarding, the 10 core libraries, first-pass coverage of 8 additional libraries, and the narrative categories (`guides`, `patterns`, `styling`, `accessibility`, `examples`) | `scenerystack@3.0.0`, per [the Roadmap](/meta/roadmap) and [the FAQ](/meta/faq#which-package-version-does-this-wiki-document) |
| Phase 3 (maintenance/verification pass) | A full pass over nearly every `api/` page and most narrative pages, upgrading `complete` → `verified` and fixing inaccuracies found along the way (wrong defaults, invented/renamed options, misattributed behavior) | The same `scenerystack@3.0.0` package source, re-checked directly rather than assumed correct from Phase 1/2 |
| Phase 4 (growth beyond the original plan) | Deeper API coverage of the 18 already-covered libraries, first coverage of `tappi`, the new `cookbook/` category, and additional `guides`/`patterns`/`styling`/`accessibility`/`examples`/`meta` pages (including this one) | The real installed `scenerystack` package's `exports` map and TypeScript source, inspected directly during Phase 4 planning — see [the Roadmap's Phase 4 section](/meta/roadmap) for what "verified before being planned at all" means in practice |

Practically, this means: a page whose `status` reached `verified` during Phase 3, and any Phase 4 page written against a directly-inspected package export, both trace back to the same underlying npm release, `3.0.0` — this wiki has not (yet) been re-verified against a subsequent major release.

## When to revisit a page's status/sourceRefs

`scenerystack` is under active development; nothing here should be read as "this documents SceneryStack, forever." Treat each of these as a signal that a page needs re-checking, not just a version bump:

- **A new `scenerystack` major (or minor with breaking changes) release ships.** Renamed classes, changed default option values, and removed/added exports are exactly the class of inaccuracy the Phase 3 verification pass was built to catch once — a new release re-opens the same risk for any page whose claims were checked against the old version.
- **A page is still `draft`, not `complete`/`verified`.** Per [the `status` lifecycle](/meta/authoring-guide#the-status-lifecycle), `draft` already means "not yet checked against real source" — such a page should be checked against the *current* published version when someone picks it up, not necessarily `3.0.0` specifically.
- **A page's `sourceRefs` only points at the generic npm package page**, rather than a specific class/source file or the official reference — that's a weaker citation than a page whose `sourceRefs` links to something checkable line-by-line, and is a lower-priority but real candidate for a future tightening pass.
- **The [official reference](https://scenerystack.org/reference/) disagrees with this wiki.** As [the FAQ](/meta/faq#is-this-an-official-scenerystack-or-phet-resource) already states, the official reference wins in any disagreement — treat that as a signal the wiki page is stale for the version currently in use, not that the reference is wrong.

## What a future re-verification pass should do

A version-driven re-verification pass (conceptually a repeat of [Phase 3](/meta/roadmap), but triggered by a SceneryStack release rather than being the first pass) should:

1. Note the new version's number here, alongside `3.0.0`, once a meaningful fraction of the wiki has actually been re-checked against it — don't bump the version claimed above until the content backs it up.
2. Prioritize `api/` pages over narrative pages — class shapes, option names, and defaults are exactly what a version bump is most likely to change, where `patterns`/`guides`/`styling`/`accessibility` content tends to describe conventions that outlive a specific release.
3. Downgrade a page's `status` from `verified` back to `draft` (never leave it silently `verified` against stale claims) if re-checking surfaces a real discrepancy, and cite the new `sourceRefs` once corrected — consistent with how [the Authoring Guide](/meta/authoring-guide#the-status-lifecycle) defines what each status actually promises a reader.

::: warning `verified` describes a point-in-time check, not an ongoing guarantee
A `verified` page was checked against `scenerystack@3.0.0` at some point during Phase 3 or Phase 4 — it is not automatically re-checked when a new version ships. Nothing in this wiki's tooling currently detects "this page's claims are now stale because the package moved on"; that detection is exactly the gap this page exists to flag until a version-driven re-verification pass (see above) actually happens.
:::
