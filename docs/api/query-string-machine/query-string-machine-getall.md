---
title: QueryStringMachine.getAll
description: Parsing every URL query parameter for a sim in one call, plus the related single-key and non-URL-string variants on the same object.
category: api
library: query-string-machine
tags: [query-string-machine, QueryStringMachine, getAll, query-parameters]
status: verified
prerequisites:
  - /patterns/query-parameters-pattern
related:
  - /patterns/query-parameters-pattern
  - /api/query-string-machine/query-parameter-schema-conventions
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# QueryStringMachine.getAll

`QueryStringMachine` (from `scenerystack/query-string-machine`) is a plain object — not a class — exposing `get`/`getAll` and their string-based variants for parsing `location.search` against a declared schema. `getAll` is the entry point almost every sim uses: pass a map of parameter name to schema, get back a fully-typed, defaulted, validated object in one call. See [the Query Parameters Pattern](/patterns/query-parameters-pattern) for *why* this convention exists and a worked schema; this page documents `QueryStringMachine`'s methods themselves.

```ts
import { QueryStringMachine } from 'scenerystack/query-string-machine';
```

## `getAll`

```ts
QueryStringMachine.getAll<SchemaMap extends QSMSchemaObject>( schemaMap: SchemaMap ): QSMParsedParameters<SchemaMap>
```

```ts
const parameters = QueryStringMachine.getAll( {
  speed: { type: 'number', defaultValue: 1 },
  showAnswers: { type: 'flag' }
} );

parameters.speed;       // number
parameters.showAnswers; // boolean
parameters.SCHEMA_MAP;  // the schemaMap you passed in, attached for introspection
```

Internally, `getAll` reads `self.location.search` and delegates to `getAllForString`, which loops the schema map calling `getForString` per key — so `getAll`'s behavior is entirely explained by `get`'s single-key behavior, run once per declared parameter.

## The full method surface

| Method | Signature | Use when |
| --- | --- | --- |
| `get( key, schema )` | `( key: string, schema: Schema ) => ParsedValue` | You only need one parameter's value |
| `getAll( schemaMap )` | `( schemaMap: QSMSchemaObject ) => QSMParsedParameters` | The common case: parse every declared parameter for the sim at startup |
| `getForString( key, schema, string )` | Same as `get`, plus an explicit query string | Testing, or parsing a query string that isn't `location.search` |
| `getAllForString( schemaMap, string )` | Same as `getAll`, plus an explicit query string | Same, for the batch form |
| `containsKey( key )` | `( key: string ) => boolean` | Check presence without parsing/validating a value |
| `containsKeyForString( key, string )` | Same, with an explicit string | Testing variant |

`string` arguments must be either the empty string or start with `?`; anything else throws.

## Other members on the same object

| Member | Purpose |
| --- | --- |
| `warnings` | A read-only array of `{ key, value, message }` accumulated whenever a `public: true` schema silently falls back to its default because the URL supplied an invalid value |
| `addWarning( key, value, message )` | Appends to `warnings` (de-duplicated); called internally, rarely by client code |
| `removeKeyValuePair( queryString, key )` / `removeKeyValuePairs( queryString, keys )` | Returns a new query string with the given key(s) stripped — useful for constructing a "relaunch without this flag" URL |
| `appendQueryString( url, queryParameters )` / `appendQueryStringArray( url, queryStringArray )` | Appends one or more `key=value` fragments to a URL, handling the `?`/`&` join correctly |
| `getQueryString( url )` | Returns the `?...` tail of a URL, or `'?'` if there is none |

::: tip Invalid values only fall back silently when the schema is `public: true`
If a URL supplies a value that fails validation (wrong type, not in `validValues`, fails `isValidValue`) and the schema does *not* set `public: true`, `QueryStringMachine` throws instead of warning-and-defaulting. Reserve `public: true` for parameters end users might plausibly mistype and where continuing with the default is safe; leave it off for internal/debug flags where a bad value should fail loudly.
:::
