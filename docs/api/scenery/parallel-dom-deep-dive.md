---
title: ParallelDOM
description: The trait every Node mixes in that provides its Parallel DOM options, such as tagName and accessibleName.
category: api
library: scenery
tags: [scenery, ParallelDOM, pdom, accessibility, tagName, accessibleName]
status: complete
related:
  - /accessibility/pdom
  - /api/scenery/focus-manager
  - /api/scenery/node
prerequisites:
  - /accessibility/pdom
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# ParallelDOM

`ParallelDOM` (from `scenerystack/scenery`) is the trait mixed into `Node` itself — every `Node`, not just some subset, has the options documented here available, though most are no-ops until you set `tagName` to place the Node in the Parallel DOM. This page documents the trait's actual options and accessors; for what the Parallel DOM is, why it exists, and worked examples of building an accessible scene graph, read the narrative guide [The Parallel DOM](/accessibility/pdom) first.

```ts
import { Node, Rectangle } from 'scenerystack/scenery';

const resetButton = new Rectangle( 0, 0, 40, 40, {
  tagName: 'button',
  accessibleName: 'Reset Masses',
  accessibleHelpText: 'Return both masses to their starting values.'
} );

const infoSection = new Node( {
  tagName: 'div',
  labelTagName: 'h3',
  labelContent: 'Mass Controls',
  descriptionContent: 'Adjust the mass of each body, in kilograms.'
} );
```

## Options

These are `ParallelDOM`'s actual mutator keys (`ACCESSIBILITY_OPTION_KEYS` in source), grouped as the source groups them:

| Option | Effect |
| --- | --- |
| `tagName` | HTML element name for this Node's primary sibling (`'div'`, `'button'`, `'ul'`, …). Setting it is what places the Node in the PDOM; `null` removes it |
| `focusable` | `boolean \| null` — whether the element can receive keyboard focus |
| `accessibleName` | Higher-level API: the accessible name announced by screen readers. Prefer this over the lower-level `innerContent`/`ariaLabel` options below |
| `accessibleHelpText` | Higher-level API: supplementary guidance text associated with the element |
| `accessibleParagraph` | Higher-level API: a standalone paragraph of accessible content, for a Node that is purely descriptive rather than interactive |
| `accessibleNameBehavior` / `accessibleHelpTextBehavior` / `accessibleParagraphBehavior` | Lower-level: functions controlling *how* the corresponding higher-level API value is rendered into the PDOM (which sibling, which attribute) — most code never needs to override these; reusable UI components (`sun` controls) do |
| `accessibleHeading` | Sets heading text for this Node using scenery's automatic heading-level management |
| `accessibleHeadingIncrement` | Adjusts how much this subtree increments the heading level counter |
| `containerTagName` / `containerAriaRole` | Tag name and ARIA role for an optional parent element wrapping this Node's own siblings |
| `innerContent` | Lower-level: text content placed inside the primary sibling element |
| `inputType` / `inputValue` / `pdomChecked` | Lower-level: for `tagName: 'input'` elements — the `type` attribute, `value`, and checked state |
| `ariaLabel` / `ariaRole` | Lower-level: raw `aria-label` and `role` attributes |
| `labelTagName` / `labelContent` / `appendLabel` | A sibling label element, its content, and whether it's ordered after (rather than before) the primary sibling |
| `descriptionTagName` / `descriptionContent` / `appendDescription` | A sibling description element, its content, and ordering |
| `focusHighlight` / `focusHighlightLayerable` / `groupFocusHighlight` | The Node's focus highlight — see [Focus Highlights](/accessibility/focus-highlights) for the full picture |
| `pdomVisible` / `pdomVisibleProperty` | Whether this Node's PDOM content is present at all, independent of its visual `visible` |
| `pdomOrder` | Explicit traversal order for this Node's PDOM children, overriding scene-graph order |
| `pdomAttributes` | Arbitrary additional PDOM element attributes |
| `ariaLabelledbyAssociations` / `ariaDescribedbyAssociations` / `activeDescendantAssociations` | Cross-Node ARIA relationships (`aria-labelledby`, `aria-describedby`, `aria-activedescendant`) pointing at other Nodes' PDOM elements |
| `focusPanTargetBoundsProperty` / `limitPanDirection` | Controls for auto-panning the viewport to keep this Node visible when it receives focus |
| `positionInPDOM` | Whether this Node's DOM element should also be moved to visually overlap its rendered position (needed for some native form controls) |
| `pdomTransformSourceNode` | An alternate Node whose transform should be used to position this Node's PDOM element |

## Reading values back

Every option above has a matching getter (e.g. `getAccessibleName()` / `accessibleName`, `getTagName()` / `tagName`), following the same `set`/`get` + ES5 accessor pattern as the rest of `Node`.

::: warning `accessibleName` supersedes the lower-level options for most use cases
`ParallelDOM` exposes both a higher-level API (`accessibleName`, `accessibleHelpText`, `accessibleParagraph`) and the lower-level primitives it's built from (`innerContent`, `ariaLabel`, `labelContent`, behavior functions). Mixing both on the same Node — e.g. setting `accessibleName` and also hand-writing `labelContent` — can conflict, since `accessibleName` may itself be implemented via one of these lower-level options through its behavior function. Reach for the higher-level options first; only touch the lower-level ones (or a custom `accessibleNameBehavior`) when a reusable component needs to render its name into a non-default sibling or attribute.
:::
