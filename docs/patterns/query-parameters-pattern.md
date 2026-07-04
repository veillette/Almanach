---
title: Query Parameters Pattern
description: Using query parameters to drive optional/debug behavior.
category: patterns
tags: [query-parameters, conventions]
status: draft
related:
  - /patterns/phet-io-instrumentation-pattern
  - /patterns/model-view-separation
sourceRefs:
  - https://github.com/phetsims/query-string-machine
  - https://www.npmjs.com/package/scenerystack
---

# Query Parameters Pattern

Optional or debug-only behavior (an initial screen selection, a background color override, a "show answers" cheat mode) is driven by URL query parameters rather than a build-time flag, parsed once at startup through a single schema object passed to `QueryStringMachine.getAll`. Declaring every parameter's type and default up front in one place — instead of reading `location.search` ad hoc wherever a flag is needed — is what gives each parameter type coercion, a documented default, and validation for free.

## The core idea

```ts
import { QueryStringMachine } from 'scenerystack/query-string-machine';

const myQueryParameters = QueryStringMachine.getAll( {

  // Background color of the sim's screens, in any CSS color format.
  backgroundColor: {
    type: 'string',
    defaultValue: 'white'
  },

  // Initial value for the model's speed multiplier.
  speed: {
    type: 'number',
    defaultValue: 1,
    isValidValue: ( value: number ) => value > 0
  },

  // A debug-only flag: present with no value means true, absent means false.
  showAnswers: {
    type: 'flag'
  }
} );

// myQueryParameters.backgroundColor: string
// myQueryParameters.speed: number
// myQueryParameters.showAnswers: boolean

if ( myQueryParameters.showAnswers ) {
  // reveal debug-only content
}
```

Reading `?speed=2&showAnswers` from the URL yields `{ backgroundColor: 'white', speed: 2, showAnswers: true }` — untouched parameters silently fall back to their `defaultValue`.

## Schema fields

| Field | Effect |
| --- | --- |
| `type` | `'flag'` \| `'boolean'` \| `'number'` \| `'string'` \| `'array'` \| `'custom'` — determines parsing and the resulting TypeScript type |
| `defaultValue` | Value used when the parameter is absent from the URL (required unless `type: 'flag'`) |
| `validValues` | Restrict to an enumerated set of values |
| `isValidValue` | Custom predicate the parsed value must satisfy |
| `public` | If `true`, an invalid value warns and falls back to the default instead of throwing |
| `private` | Only read from the URL for team members (gated by a `phetTeamMember` local-storage check) |

::: warning This page is a draft — the schema shape above is confirmed against source, but conventions around it are not independently verified
The exact call — `QueryStringMachine.getAll({ ... })` with `type`/`defaultValue`/`validValues`/`isValidValue`/`public`/`private` fields — was checked directly against `QueryStringMachineModule.ts` and against real per-library usages (e.g. `sunQueryParameters.ts`, `SceneryQueryParameters.ts`) in the installed `scenerystack` package, so the API shown here is real. What's *not* independently verified is the broader convention for where a sim-author-facing query-parameters module should live and how it should be named in application code outside the PhET repos themselves — treat that part as a reasonable default, not a confirmed house style, until a `verified` pass checks it against [scenerystack.org/reference](https://scenerystack.org/reference/).
:::
