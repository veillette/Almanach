---
title: WebGLNode, CanvasNode, and DOM
description: The three alternate rendering-backend Node subclasses for custom drawing outside scenery's default SVG/Canvas pipeline, compared.
category: api
library: scenery
tags: [scenery, WebGLNode, CanvasNode, DOM, rendering, renderer]
status: complete
related:
  - /api/scenery/node
  - /api/scenery/display
prerequisites:
  - /api/scenery/node
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# WebGLNode, CanvasNode, and DOM

Most scenery content is built from `Path`/`Text`/`Image`-style Nodes and rendered through scenery's own SVG or Canvas layers, chosen automatically per-Node. `WebGLNode`, `CanvasNode`, and `DOM` (all from `scenerystack/scenery`) are the three escape hatches for content scenery's normal drawing pipeline can't produce — each locks a subtree to one specific rendering backend and hands you direct control of that backend's drawing surface (or, for `DOM`, an actual live DOM element). All three are `Node` subclasses, so they take part in the scene graph, transforms, and bounds like any other Node.

## When to reach for each

| Class | Use it for |
| --- | --- |
| `CanvasNode` | Custom 2D drawing that's cheaper or only expressible as imperative Canvas calls — particle systems, heatmaps, per-pixel effects — where per-Node SVG elements would be too slow or don't have an equivalent primitive |
| `WebGLNode` | Custom GPU-accelerated drawing — large numbers of instances, shader effects — where even Canvas 2D isn't fast enough |
| `DOM` | Embedding an actual pre-existing HTML element (an `<iframe>`, a third-party widget, a native `<video>`) that can't be expressed as scenery drawing at all |

All three are **abstract or near-abstract**: `CanvasNode` and `WebGLNode` must be subclassed to provide painting logic; `DOM` is concrete but exists specifically to wrap an element you already have.

## CanvasNode

Subclass it and override `paintCanvas`; supply `canvasBounds` (covering everything you'll draw, since content outside it isn't guaranteed to render):

```ts
import { CanvasNode, CanvasNodeOptions } from 'scenerystack/scenery';
import { Bounds2 } from 'scenerystack/dot';

class TrailNode extends CanvasNode {
  public constructor( options?: CanvasNodeOptions ) {
    super( { canvasBounds: new Bounds2( 0, 0, 200, 200 ), ...options } );
  }

  public override paintCanvas( context: CanvasRenderingContext2D ): void {
    context.fillStyle = 'rgba(0, 100, 255, 0.5)';
    context.fillRect( 10, 10, 50, 50 );
  }
}
```

Call `invalidatePaint()` whenever the drawing needs to be redone (scenery does not re-invoke `paintCanvas` on its own schedule) — `paintCanvas` runs during `Display.updateDisplay()`, so it must not mutate any scenery Node.

## WebGLNode

Subclass it and pass a "painter type" constructor — a class implementing `paint( modelViewMatrix, projectionMatrix )` and `dispose()` — plus `canvasBounds`:

```ts
import { WebGLNode, WebGLNodeOptions, WebGLNodePainter, WebGLNodePainterResult } from 'scenerystack/scenery';
import { Matrix3, Bounds2 } from 'scenerystack/dot';

class MyPainter implements WebGLNodePainter {
  public constructor( private gl: WebGLRenderingContext, private node: MyWebGLNode ) {}
  public paint( modelViewMatrix: Matrix3, projectionMatrix: Matrix3 ): WebGLNodePainterResult {
    // issue gl.* draw calls here
    return 1; // WebGLNode.PAINTED_SOMETHING
  }
  public dispose(): void {}
}

class MyWebGLNode extends WebGLNode {
  public constructor( options?: WebGLNodeOptions ) {
    super( MyPainter, { canvasBounds: new Bounds2( 0, 0, 200, 200 ), ...options } );
  }
}
```

A distinct painter instance is created per WebGL context the Node is displayed under, since GPU buffers/textures aren't shareable across contexts — this is why `painterType` is a constructor, not a single painter object.

## DOM

Wraps a real `Element`, keeping it positioned/transformed to match the Node's place in the scene graph:

```ts
import { DOM } from 'scenerystack/scenery';

const iframe = document.createElement( 'iframe' );
iframe.src = 'https://example.com/embed';
iframe.style.border = 'none';

const embedded = new DOM( iframe, {
  preventTransform: false // let scenery apply its CSS transform to the element
} );
```

| Option | Effect |
| --- | --- |
| `element` | The wrapped `Element` (also settable post-construction via `setElement`) |
| `preventTransform` | If `true`, scenery will not apply its own transform to the element — use when the embedded content manages its own positioning |
| `allowInput` | Whether input events are allowed to reach the DOM element (rather than being captured by scenery's input system) |

::: warning None of these three participate in scenery's normal renderer-switching
A `Path` or `Text` Node can be drawn with SVG, Canvas, or WebGL depending on context and scenery's own heuristics — `CanvasNode`, `WebGLNode`, and `DOM` each lock themselves to exactly one renderer (`Renderer.bitmaskCanvas`, `bitmaskWebGL`, and `bitmaskDOM` respectively) for the lifetime of the Node. Reach for one of these only when you specifically need that backend's capabilities (imperative pixel/GPU control, or a real DOM element) — for everything else, prefer the standard Node subclasses so scenery can pick the best renderer per [`Display`](/api/scenery/display).
:::
