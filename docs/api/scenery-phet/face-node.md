---
title: FaceNode
description: A simple smiling/frowning face graphic, typically shown as feedback for a correct or incorrect answer.
category: api
library: scenery-phet
tags: [scenery-phet, FaceNode, feedback, face]
status: verified
related:
  - /api/scenery/circle
  - /api/scenery/path
  - /api/axon/derived-property
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# FaceNode

`FaceNode` (from `scenerystack/scenery-phet`) draws a circular head with two eyes and either a smiling or frowning mouth — a small, self-contained way to give users visual feedback for a correct/incorrect result. It has no Property to bind to; you construct it once and call `smile()` or `frown()` imperatively whenever the state you're representing changes.

```ts
import { FaceNode } from 'scenerystack/scenery-phet';
```

## A minimal example

```ts
const faceNode = new FaceNode( 100 ); // headDiameter = 100

// Later, respond to a check:
if ( isCorrect ) {
  faceNode.smile();
}
else {
  faceNode.frown();
}
```

## Constructor

```ts
new FaceNode( headDiameter: number, providedOptions?: FaceNodeOptions )
```

## Options

| Option | Default | Effect |
| --- | --- | --- |
| `headFill` | `Color.YELLOW` | Fill of the circular head |
| `headStroke` | `null` (derives a darker shade of `headFill` automatically) | Stroke around the head; if you supply your own, it replaces the auto-derived one |
| `eyeFill` | `'black'` | Fill of both eyes |
| `mouthStroke` | `'black'` | Stroke of the smile/frown arc |
| `headLineWidth` | `1` | Stroke width of the head outline |

## Methods

| Method | Effect |
| --- | --- |
| `smile()` | Shows the smiling mouth, hides the frowning mouth; returns `this` |
| `frown()` | Shows the frowning mouth, hides the smiling mouth; returns `this` |

::: tip Both mouths always exist; only one is ever hidden
`FaceNode` builds both the smile and the frown `Path`s up front and toggles their `visible` flags — it never destroys or recreates geometry when you switch expressions, and it starts in the smiling state by default. `headDiameter` scales every other feature (eye size, mouth size, stroke widths) proportionally, so there's no separate way to resize the mouth or eyes independently of the head.
:::
