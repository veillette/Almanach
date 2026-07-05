---
title: Validation and validate
description: The shared validator schema and checking utility that Property's valueType/validValues/isValidValue options are built on.
category: api
library: axon
tags: [axon, Validation, validate, Property]
status: complete
prerequisites:
  - /api/axon/property
related:
  - /api/axon/property
  - /api/axon/derived-property
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Validation and validate

`Validation` (from `scenerystack/axon`) is a static-methods-only class defining the shared "validator" object schema — `{ valueType, validValues, isValidValue, phetioType, valueComparisonStrategy, validators }` — that [`Property`](/api/axon/property) accepts directly as construction options, and that is reused verbatim by `Emitter`'s parameter validation. `validate()` is a small assertion-only wrapper around `Validation.getValidationError()`: with assertions enabled it throws when a value doesn't satisfy a validator, and is a no-op otherwise. You'll rarely call either directly — mostly you pass `valueType`/`validValues`/`isValidValue` straight into a `Property` constructor — but understanding this layer explains exactly what those options accept and how they combine.

```ts
import { Validation } from 'scenerystack/axon';

const validator = { valueType: 'number', isValidValue: ( n: number ) => n >= 0 };

Validation.isValueValid( 5, validator );     // true
Validation.isValueValid( -1, validator );    // false
Validation.getValidationError( -1, validator ); // 'value failed isValidValue: -1'
```

## The `Validator<T>` shape

This is the same object shape accepted by `Property`'s second constructor argument (see [Property's options](/api/axon/property#options)):

| Key | Effect |
| --- | --- |
| `valueType` | A primitive type string (`'number'`, `'string'`, `'boolean'`, `'function'`), a constructor (checked via `instanceof`), `null`, or an array of any of those (value must match at least one) |
| `validValues` | A fixed array of allowed values; membership is checked according to `valueComparisonStrategy` |
| `valueComparisonStrategy` | How `validValues` membership (and Property change-detection) compares values: `'reference'` (default, `===`), `'equalsFunction'` (calls `.equals()` on both sides), `'lodashDeep'` (`_.isEqual`), or a custom `(a, b) => boolean` |
| `isValidValue` | A custom `( value ) => boolean` predicate, checked in addition to any `valueType`/`validValues` |
| `phetioType` | An `IOType` whose own `.validator` is checked as well — lets PhET-iO type definitions double as value validators |
| `validators` | An array of nested `Validator` objects, all of which must pass |

A validator object must specify at least one of these keys — `Validation.getValidatorValidationError()` (which `Validation.validateValidator()` asserts against) rejects an empty `{}`.

## Static API

| Method | Effect |
| --- | --- |
| `Validation.isValueValid( value, validator, options? )` | `true`/`false` — whether `value` satisfies `validator` |
| `Validation.getValidationError( value, validator, options? )` | `null` if valid, otherwise a human-readable string describing the failure |
| `Validation.validateValidator( validator )` | Asserts that the *validator object itself* is well-formed (not that a value matches it) |
| `Validation.containsValidatorKey( obj )` | Whether `obj` has at least one recognized validator key — used internally to detect "was a validator even supplied" |
| `Validation.equalsForValidationStrategy( a, b, strategy )` | The comparison primitive backing `valueComparisonStrategy`, usable standalone |
| `Validation.VALIDATOR_KEYS` | The list of recognized keys, e.g. for `_.pick`-ing a validator out of a larger options object (this is exactly how `ReadOnlyProperty` extracts its `valueValidator` from constructor options) |
| `validate( value, validator, options? )` | Assertion-only convenience: throws (with assertions enabled) if `value` fails `validator`; otherwise a no-op |

::: warning `validate()` is deprecated in favor of calling `Validation` directly
The source marks `validate()` `@deprecated`, recommending a direct assertion using `Validation.getValidationError()` instead — e.g. `assert && assert( Validation.isValueValid( value, validator ) )`. New code documenting or building on this layer should prefer `Validation`'s static methods; `validate()` remains only for existing call sites.
:::
