---
title: Query parameter schema conventions (QSMSchemaObject)
description: The shape of an individual QueryStringMachine schema entry - required and optional fields per type, and the validation rules the parser enforces.
category: api
library: query-string-machine
tags: [query-string-machine, QSMSchemaObject, schema, validValues, elementSchema, query-parameters]
status: verified
prerequisites:
  - /patterns/query-parameters-pattern
related:
  - /api/query-string-machine/query-string-machine-getall
  - /patterns/query-parameters-pattern
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Query parameter schema conventions

Each key passed to `QueryStringMachine.getAll` (see `QSMSchemaObject`, exported from `scenerystack/query-string-machine`) maps to one schema object describing how that parameter should be parsed and validated. Every schema variant shares a required `type` discriminant plus a fixed set of optional fields depending on that type; `QueryStringMachine` validates the schema itself (not just the parsed value) at parse time, so a malformed schema fails fast rather than silently misbehaving.

```ts
import type { QSMSchemaObject } from 'scenerystack/query-string-machine';
```

## The five schema types

| `type` | Result TS type | Fields |
| --- | --- | --- |
| `'flag'` | `boolean` | No `defaultValue` — presence in the URL (with no `=value`) means `true`, absence means `false` |
| `'boolean'` | `boolean` | `defaultValue?: boolean` |
| `'number'` | `number` | `defaultValue?: number` |
| `'string'` | `string \| null` | `defaultValue?: string \| null` |
| `'array'` | `T[]` | `elementSchema: Schema` (required), `separator?: string` (single character, default `','`), `defaultValue?: readonly T[] \| null` |
| `'custom'` | Whatever `parse` returns | `parse: ( str: string ) => T` (required) |

All types additionally accept `public` and `private` (below). `validValues`/`isValidValue` are supported only on `'number'`, `'string'`, `'array'`, and `'custom'` schemas — `'flag'` and `'boolean'` schemas do not accept either (their only two possible values, `true`/`false`, make an extra validity check redundant).

## Shared optional fields

| Field | Effect |
| --- | --- |
| `validValues` | Restricts the parsed value to a fixed set — mutually exclusive with `isValidValue` (schemas providing both throw at parse time) |
| `isValidValue` | A custom predicate the parsed value must satisfy — mutually exclusive with `validValues` |
| `public` | If `true`, an invalid value logs to `QueryStringMachine.warnings` and falls back to `defaultValue` instead of throwing. Requires `defaultValue` to be present (except for `'flag'`, which has none by definition) |
| `private` | The URL value is only honored for team members (gated on a `phetTeamMember` localStorage check); otherwise treated as absent |

## `'array'` schemas nest a full sub-schema

```ts
const screensSchema: QSMSchemaObject = {
  screens: {
    type: 'array',
    elementSchema: {
      type: 'number',
      isValidValue: ( n: number ) => Number.isInteger( n ) && n >= 1
    },
    separator: ',',
    defaultValue: null
  }
};
// ?screens=1,3,4  ->  screens: [ 1, 3, 4 ]
```

`elementSchema` is itself a full `Schema` and is recursively validated the same way the outer schema is — but it may not declare `public` itself (that comes from the array schema as a whole, not per element).

## `'custom'` schemas hand parsing to you entirely

```ts
const colorSchema: QSMSchemaObject = {
  backgroundColor: {
    type: 'custom',
    parse: ( str: string ) => new Color( str ),
    defaultValue: Color.WHITE
  }
};
```

`isValidValue` for a `'custom'` schema defaults to "always valid" — validation is the parse function's responsibility unless you also supply `isValidValue`/`validValues`.

## Validation rules enforced on the schema itself

`QueryStringMachine` asserts all of the following before it will parse a value, throwing immediately if violated:

- `type` is present and is one of the five known types.
- `validValues` and `isValidValue` are not both present on the same schema.
- `defaultValue`, if present, passes that type's own `isValidValue` check (and must be a member of `validValues` if both are given).
- `public: true` requires `defaultValue` to be present, except for `'flag'` schemas.
- No unsupported keys are present for the given `type` (e.g. a `'number'` schema with an `elementSchema` field throws).
- For `'array'` schemas: `separator`, if given, is exactly one character, and `elementSchema` does not itself declare `public`.

::: warning `validValues` and `isValidValue` are mutually exclusive, not layered
Supplying both on the same schema entry throws at parse time — `QueryStringMachine` doesn't combine them (e.g. "must be one of these, and also pass this extra check"). If you need both a fixed set and an extra predicate, encode the extra check as the *only* validation via `isValidValue`, checking membership yourself inside it.
:::
