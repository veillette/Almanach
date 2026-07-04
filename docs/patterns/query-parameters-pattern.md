---
title: Query Parameters Pattern
description: Using query parameters to drive optional/debug behavior.
category: patterns
tags: [query-parameters, conventions]
status: verified
related:
  - /patterns/phet-io-instrumentation-pattern
  - /patterns/model-view-separation
  - /patterns/feature-flags-and-preferences-pattern
prerequisites:
  - /getting-started/what-is-scenerystack
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
| `defaultValue` | Value used when the parameter is absent from the URL — omitting it is only safe for `type: 'flag'` (which defaults to `false`); for every other type, a parameter that's both absent from the URL and missing a `defaultValue` throws at parse time |
| `validValues` | Restrict to an enumerated set of values |
| `isValidValue` | Custom predicate the parsed value must satisfy |
| `public` | If `true`, an invalid value warns and falls back to the default instead of throwing |
| `private` | Only read from the URL for team members (gated by a `phetTeamMember` local-storage check) |

::: tip Verified against source; the module-location convention is still a reasonable default, not a confirmed house style
The exact call — `QueryStringMachine.getAll({ ... })` with `type`/`defaultValue`/`validValues`/`isValidValue`/`public`/`private` fields, including the runtime behavior of each (an absent `defaultValue` on a non-flag type throws unless the URL supplies the value; `public: true` downgrades an invalid value to a warning-plus-fallback instead of throwing; `private: true` gates URL reads on a `phetTeamMember` local-storage check) — was checked directly against `QueryStringMachineModule.ts` and real per-library usages (e.g. `sunQueryParameters.ts`, `SceneryQueryParameters.ts`) in the real `scenerystack` package source. What's *not* independently verified is the broader convention for where a sim-author-facing query-parameters module should live and how it should be named in application code outside the PhET repos themselves — treat that part as a reasonable default, not a confirmed house style.
:::
