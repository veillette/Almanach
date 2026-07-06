---
title: Mobile Screen-Reader Testing Notes
description: Practical notes on testing VoiceOver (iOS) and TalkBack (Android) with a sim, and the specific ways mobile screen-reader testing differs from testing on desktop.
category: accessibility
tags: [accessibility, pdom, screen-reader, voiceover, talkback, mobile, testing]
status: verified
related:
  - /accessibility/screen-reader-testing-checklist
  - /accessibility/pdom
  - /accessibility/alternative-input-overview
  - /getting-started/supported-browsers
prerequisites:
  - /accessibility/screen-reader-testing-checklist
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
  - https://scenerystack.org/reference/
---

# Mobile Screen-Reader Testing Notes

[The Screen-Reader Testing Checklist](/accessibility/screen-reader-testing-checklist) covers what to verify regardless of platform — reachability, naming, state-change announcements, focus behavior. This page is narrower: the practical, platform-specific notes for actually running that checklist on a phone or tablet with **VoiceOver** (iOS/iPadOS, paired with Safari) or **TalkBack** (Android, paired with Chrome), and the ways that session differs from a desktop VoiceOver/NVDA pass.

## Touch exploration replaces linear Tab navigation

The biggest structural difference from desktop testing: there is no <kbd>Tab</kbd> key. Both VoiceOver and TalkBack are driven primarily by **touch exploration** (dragging a finger around the screen, with the screen reader speaking whatever's currently under it) and **swipe gestures** (typically swipe-right/left to move to the next/previous element in the same order `pdomOrder` would drive on desktop). This means:

- A layout that "reads fine" via swipe navigation can still be confusing to explore by touch if visually-adjacent elements are far apart in `pdomOrder` — a user exploring by touch expects the element under their finger to roughly match what swiping would have reached next.
- Test **both** modes: a full swipe-through pass (this exercises the same `pdomOrder` logic as a desktop Tab pass) and a touch-exploration pass (this is closer to how a mobile screen-reader user often actually works a new screen, scanning by feel before committing to linear navigation).

## Activation gestures differ from desktop

Where a desktop screen-reader user presses <kbd>Enter</kbd>/<kbd>Space</kbd> on a focused element, mobile screen readers use a **double-tap** (anywhere on the screen, while the target element is selected) to activate the currently-focused/selected element, rather than a direct tap on the element itself — a direct single tap while the screen reader is running instead moves selection to whatever's at that point, the same as touch-exploring. This is easy to trip over the first time you test on a phone: tapping a button the way a sighted user would just re-selects it and speaks its name again, rather than activating it.

## Custom draggables need extra attention on mobile

[Drag Listeners](/patterns/drag-listeners) and [Alternative Input Overview](/accessibility/alternative-input-overview) already establish that a draggable Node needs a keyboard path (arrow keys via `KeyboardDragListener`/`RichDragListener`) in addition to pointer dragging. On a touchscreen with a screen reader running, ordinary touch-drag gestures are intercepted by the screen reader for exploration, so reaching the object's keyboard-equivalent movement typically requires the screen reader's own gesture for adjusting a selected element's value (on VoiceOver, swiping up/down while an adjustable element is selected commonly maps to incrementing/decrementing, mirroring how a native `<input type="range">` behaves) — verify a sim's draggable/adjustable custom elements actually respond to that gesture, rather than only testing them with a physical keyboard.

## Platform and browser pairing matters more than on desktop

Where desktop testing has two dominant pairings (VoiceOver+Safari, NVDA+Firefox/Chrome), mobile compounds the variables: OS version, browser (Safari is the primary target on iOS; Chrome is the primary target on Android, though other browsers exist on both), and the screen reader's own version can each independently change announcement behavior. Record all three (OS version, browser, screen-reader-implied-by-OS-version) alongside any issue found, the same way [the checklist](/accessibility/screen-reader-testing-checklist#filing-what-you-find) asks for on desktop — a mobile-specific bug report without the OS/browser pairing is often not reproducible by whoever picks it up.

## Rotor/heading navigation exists, but is discovered differently

Desktop screen readers commonly support jumping directly to headings (`labelTagName: 'h3'`, etc. — see [The Parallel DOM](/accessibility/pdom)) via a dedicated keystroke. VoiceOver's mobile equivalent is the **rotor** (a gesture — typically a two-finger twist — that opens a menu of navigation modes including headings, links, and form controls); TalkBack has an analogous but differently-invoked heading/reading-controls menu. Confirm the sim's heading structure is actually reachable through the platform's rotor-equivalent, not just assumed to carry over identically from a desktop pass, since the discovery mechanism itself is unfamiliar to many first-time testers.

## What still transfers directly from desktop testing

Not everything changes on mobile — the underlying PDOM structure a sim builds is the same regardless of input surface, so these desktop-checklist items still apply unchanged:

- Accessible names still need to identify the control without relying on visual context (see [the checklist](/accessibility/screen-reader-testing-checklist#the-checklist)).
- Dynamic content changes still need to be communicated via [reactive descriptions or `addAccessibleResponse`](/accessibility/describing-dynamic-state), not silently rendered.
- A rapidly-changing live value still needs throttling so the screen reader isn't spammed — this is, if anything, more noticeable on a phone's smaller, closer speaker.

::: tip Confirm platform gestures against current OS documentation
The SceneryStack-specific claims on this page (`pdomOrder`, keyboard-drag alternatives, reactive descriptions) were verified against Almanach's other verified pages and `scenerystack@3.0.0`. VoiceOver/TalkBack gesture names reflect commonly documented conventions; confirm against Apple's or Google's current accessibility docs (or a real device) when filing bugs tied to a specific OS version.
:::
