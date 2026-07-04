---
title: Glossary
description: Alphabetical definitions of SceneryStack and PhET-specific terms used throughout this wiki, each linked to the page that covers it in depth.
category: meta
tags: [glossary, reference, terminology, conventions]
status: complete
prerequisites:
  - /getting-started/what-is-scenerystack
related:
  - /meta/faq
  - /meta/authoring-guide
  - /meta/page-template
  - /getting-started/what-is-scenerystack
---

# Glossary

Definitions for terms this wiki uses repeatedly without re-explaining every time. Each entry links to the page where the concept is covered in full — this page is for "what does that word mean," not a replacement for reading the linked page.

## accessibleHelpText

Supplementary guidance announced alongside an element's `accessibleName`, for detail the visible label doesn't already convey. Supplements the accessible name; it never replaces it. See [Accessible Control Panel Example](/examples/accessible-control-panel-example).

## accessibleName

The string a screen reader announces for a focusable element in the PDOM — the accessibility equivalent of a visible label, set as a `Node` option. See [The Parallel DOM](/accessibility/pdom).

## brand

A build-time flag (`phet` vs. `phet-io`, among others) that determines which features compile into a sim — notably whether PhET-iO instrumentation is active. See [Tandem](/api/tandem/tandem).

## DerivedProperty

A read-only `Property` whose value is automatically recomputed from one or more other Properties whenever any of them change — you never call `.value =` on it yourself. See [DerivedProperty](/api/axon/derived-property) and [Emitter vs. Property](/patterns/emitter-vs-property).

## dispose()

The explicit cleanup method every long-lived `Node`/`Property`/`DerivedProperty`/`Multilink`/`PhetioObject` exposes, since SceneryStack has no framework-managed component lifecycle — objects created and destroyed dynamically must be disposed, or they (and anything they linked to) leak. See [Dispose and Memory Management](/patterns/dispose-and-memory-management).

## Display

The scenery object that owns a root `Node`, drives the render loop, and turns the scene graph into pixels (and the PDOM into real DOM). See [Display](/api/scenery/display).

## DragListener

A pointer-only (mouse/touch/pen) input listener that writes to a model `positionProperty`, typically through a `transform`. Superseded for new code by `RichDragListener`, which adds keyboard support. See [Drag Listeners](/patterns/drag-listeners).

## Emitter

An axon primitive for a momentary event with no persisted value — "did X just happen?" as opposed to a `Property`'s "what is it right now?" See [Emitter](/api/axon/emitter) and [Emitter vs. Property](/patterns/emitter-vs-property).

## EnumerationValue / Enumeration

The pattern for modeling a closed set of values (a mode, a phase) as real object instances with identity, instead of a string-literal union — gives runtime-validated `EnumerationProperty` writes and automatic PhET-iO serialization. See [The Enumeration Pattern](/patterns/enumeration-pattern).

## Hotkey

The lower-level building block behind `KeyboardListener` and `KeyboardDragListener`: a single dynamic key combination (optionally described by a `Property`) that can be registered directly on a Node's input listeners or on the shared `globalHotkeyRegistry`. See [Keyboard Input and Hotkeys](/accessibility/keyboard-input-and-hotkeys).

## KeyboardDragListener

The keyboard-driven equivalent of pointer dragging — moves a `positionProperty` with arrow keys or WASD. Composed together with `DragListener` inside `RichDragListener`. See [KeyboardDragListener](/api/scenery/keyboard-drag-listener).

## Model-View Separation

The foundational architecture every page in this wiki assumes: model classes hold state as `Property`/`Emitter` and know nothing about scenery; view classes (`Node` subclasses) observe that state and never hold state of their own. See [Model-View Separation](/patterns/model-view-separation).

## ModelViewTransform2

A `phetcommon` class mapping between a model coordinate frame and a view (pixel) coordinate frame, most often passed as the `transform` option to a drag listener. See [ModelViewTransform2](/api/phetcommon/model-view-transform).

## Multilink

A utility that observes several Properties at once and fires a single callback when any of them change, without manually chaining multiple `.link()` calls. See [Multilink](/api/axon/multilink) and [The Multilink Pattern](/patterns/multilink-pattern).

## Node

The base class of every visual (and, via the PDOM, every accessible) element in a scenery scene graph. See [Node](/api/scenery/node).

## options pattern / optionize

The convention of configuring a class through one trailing `providedOptions` object, merged with compile-time-checked defaults via `optionize`, rather than a positional-parameter list or ad hoc destructuring. See [The Options Pattern](/patterns/options-pattern).

## PDOM (Parallel DOM)

Scenery's hidden tree of real HTML elements, mirroring the scene graph's interactive structure, so screen readers and keyboard focus can operate on content that otherwise renders to Canvas/SVG/WebGL. See [The Parallel DOM (PDOM)](/accessibility/pdom).

## phet-io / PhET-iO

PhET's instrumentation and interoperability system: giving simulation elements a stable, addressable identity (via `Tandem`) so external wrappers can inspect, control, save, and restore sim state. See [The PhET-iO Instrumentation Pattern](/patterns/phet-io-instrumentation-pattern).

## PhetioObject

The base class (from `tandem`) that gives an object PhET-iO identity — a `Tandem`, serialization hooks, and lifecycle events — when it's instrumented. `Property`, `Node`, `Screen`, and `Sim` are all `PhetioObject`s. See [Tandem](/api/tandem/tandem).

## Property

A reactive container for a single value that persists between reads — the fundamental "state" primitive in axon, observed with `.link()` and read/written with `.value`. See [Property](/api/axon/property) and [Emitter vs. Property](/patterns/emitter-vs-property).

## query parameter

A URL parameter driving optional or debug-only sim behavior, declared through a single schema object and parsed via `QueryStringMachine.getAll`, rather than reading `location.search` ad hoc. See [Query Parameters Pattern](/patterns/query-parameters-pattern).

## Reset-All Pattern

The convention that every screen has exactly one `ResetAllButton`, whose listener calls exactly one method: the model's own `reset()`. See [The Reset-All Pattern](/patterns/reset-all-pattern).

## RichDragListener

The recommended default for new draggable code: composes an internal `DragListener` and `KeyboardDragListener` behind one `TInputListener`-implementing API, giving pointer and keyboard support from a single declaration. See [RichDragListener](/api/scenery/rich-drag-listener) and [Migrating a Legacy Sim to RichDragListener](/examples/migrating-to-rich-drag-listener).

## Screen

One self-contained model/view pair within a `Sim` — owns its own `Tandem` subtree, `homeScreenIcon`, `navigationBarIcon`, and translated `name`. See [Multi-Screen Sim Structure](/patterns/multi-screen-sim-structure) and [Screen](/api/joist/screen).

## ScreenView

The root `Node` of a `Screen`'s view; defines `layoutBounds` and reserves its own PDOM structure (`pdomPlayAreaNode`, `pdomControlAreaNode`) that a subclass populates rather than replaces. See [ScreenView](/api/joist/screen-view).

## Sim

The application shell that owns a list of `Screen`s, builds the home screen and navigation bar once there's more than one, and drives the top-level step loop. See [Sim](/api/joist/sim).

## Tandem

The naming-tree node that gives every PhET-iO-tracked element a stable, hierarchical address (`mySim.myScreen.model.temperatureProperty`), built up by calling `createTandem()` down through a model/view's constructors. See [Tandem](/api/tandem/tandem).

## TInputListener

The scenery interface every input listener implements (`DragListener`, `PressListener`, `KeyboardListener`, `RichDragListener`, …), letting pointer and keyboard/AT events dispatch through one shared mechanism instead of separate code paths per input modality. See [Alternative Input Overview](/accessibility/alternative-input-overview).

## Trail

An ordered path of `Node`s from a root to a descendant, used to disambiguate which instance of a `Node` is meant when a scene graph is a DAG rather than a strict tree — handed to you on every input event as `event.trail`. See [Trail](/api/scenery/trail).

## Voicing

PhET's speech-synthesis feature, layered on top of the PDOM rather than replacing it: an opt-in preference that speaks `voicingNameResponse`/`voicingObjectResponse`/`voicingContextResponse`/`voicingHintResponse` content aloud in response to interaction. See [Voicing](/accessibility/voicing).
