---
title: CreditsNode
description: Renders a simulation's credits (design, development, team, contributors, translation-independent thanks, etc.) as the content of the About dialog.
category: api
library: joist
tags: [joist, CreditsNode, credits, AboutDialog, Sim]
status: complete
related:
  - /api/joist/sim
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# CreditsNode

`CreditsNode` (from `scenerystack/joist`) is a `VBox` that renders a fixed, ordered set of credits fields — lead design, software development, team, contributors, quality assurance, graphic arts, sound design, and a final "thanks" note — as the content of the simulation's About dialog. `Sim`'s `credits` option (a `CreditsData` object) is what you actually populate; `CreditsNode` is what turns it into a laid-out `Node`, built automatically by joist's `AboutDialog` when credits are present.

```ts
import { Sim, onReadyToLaunch } from 'scenerystack/sim';
import type { CreditsData } from 'scenerystack/joist';
import { Property } from 'scenerystack/axon';

const credits: CreditsData = {
  leadDesign: 'Alice Example',
  softwareDevelopment: 'Bob Example, Carol Example',
  team: 'Dan Example (accessibility), Erin Example (physics)',
  qualityAssurance: 'Frank Example',
  thanks: 'Thanks to the Foo Foundation for supporting this project.'
};

onReadyToLaunch( () => {
  const sim = new Sim( new Property( 'My Simulation' ), [ /* screens */ ], { credits } );
  sim.start(); // AboutDialog builds a CreditsNode from `credits` the first time it's opened
} );
```

You won't typically construct `CreditsNode` yourself — it's what `AboutDialog` builds internally from `Sim`'s `credits` option — but its shape is documented here since `CreditsData`'s fields are exactly what a sim author fills in.

## `CreditsData`

Every field is an optional string; a field only renders a line if it's provided (non-empty):

| Field | Rendered as |
| --- | --- |
| `leadDesign` | "Lead Design: ..." |
| `softwareDevelopment` | "Software Development: ..." |
| `team` | "Team: ..." |
| `contributors` | "Contributors: ..." |
| `qualityAssurance` | "Quality Assurance: ..." |
| `graphicArts` | "Graphic Arts: ..." |
| `soundDesign` | "Sound Design: ..." |
| `thanks` | Rendered last, under its own "Thanks!" heading, with extra spacing above it if any other field was present |

## Constructor

```ts
new CreditsNode( credits: CreditsData, options: CreditsNodeOptions )
```

Unlike most Node subclasses, `options` here is not optional — `AboutDialog` always passes at least a `tandem`.

## Options

`CreditsNodeOptions` extends `VBoxOptions` with:

| Option | Default | Effect |
| --- | --- | --- |
| `titleFont` | 18px bold `PhetFont` | Font for the "Credits" heading and the "Thanks!" heading |
| `textFont` | 16px `PhetFont` | Font for every credits line |

`CreditsNode` also defaults `align: 'left'`, `spacing: 1`, and `maxWidth: 550` (each line wraps via `RichText`'s `lineWrap` at that width), and sets `children` internally.

::: tip Voicing and accessible structure come for free
Each credits line is a `VoicingRichText`/`VoicingText`, and the "Credits"/"Thanks!" headings are exposed as accessible headings (`accessibleHeading`) — using `CreditsNode` (via `Sim`'s `credits` option) gets you PDOM structure and Voicing support without any extra accessibility work in sim code.
:::
