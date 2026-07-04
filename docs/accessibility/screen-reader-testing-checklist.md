---
title: Screen-Reader Testing Checklist
description: A practical checklist for manually testing a sim's PDOM with a real screen reader instead of relying on automated checks alone.
category: accessibility
tags: [accessibility, pdom, screen-reader, voiceover, nvda, testing]
status: verified
related:
  - /accessibility/pdom
  - /accessibility/voicing
  - /accessibility/focus-highlights
  - /accessibility/alternative-input-overview
prerequisites:
  - /accessibility/pdom
---

# Screen-Reader Testing Checklist

[The Parallel DOM](/accessibility/pdom) explains what the PDOM is and how to structure it; this page assumes that and covers something no amount of reading the option table replaces: actually turning on a screen reader and going through a screen with it. A `tagName`/`accessibleName` set correctly in code can still read badly out loud — announcement order, redundant chatter, and confusing groupings only surface once you listen to the real output.

## Before you start

- Test with an actual screen reader, not just the PDOM's rendered HTML structure in devtools. A `pdomOrder` that looks right in the accessibility tree inspector can still sound wrong — screen readers summarize, elide, and reorder in ways that only show up audibly.
- Cover more than one screen reader/browser pairing if the sim will reach a broad audience. VoiceOver (macOS/iOS, paired with Safari) and NVDA (Windows, paired with Firefox or Chrome) are the two most commonly targeted; they don't always announce identical content identically.
- Turn your monitor off (or close your eyes) for at least one full pass. Sighted screen-reader testing is easy to do halfway — glancing at the screen to confirm what "should" have been announced instead of confirming what actually *was*.

## The checklist

**Reachability**
- [ ] Every interactive element (button, slider, checkbox, custom draggable) is reachable by moving forward through the screen reader's normal navigation, without needing to know where it is in advance.
- [ ] Nothing that should be interactive is skipped over silently, and nothing decorative is announced as if it were interactive.
- [ ] Tab order and screen-reader reading order agree with the visual reading order a sighted user would expect — driven by `pdomOrder`, not left to default scene-graph order (see [The Parallel DOM](/accessibility/pdom#focus-order-with-pdomorder)).

**Naming and description**
- [ ] Every interactive element announces a name (`accessibleName`) that identifies what it does without requiring the visual label as context — "Reset Masses" reads correctly on its own; "Button" or a name duplicated across three unrelated controls does not.
- [ ] `accessibleHelpText`/description content is heard when expected and isn't redundant with the name (a help text that just repeats the accessible name verbatim is noise, not guidance).
- [ ] Headings (`labelTagName: 'h3'`, etc.) let a screen-reader user jump between sections using heading navigation, the way they would on a well-structured web page.

**State changes**
- [ ] A value change (a slider moving, a checkbox toggling) is announced promptly and legibly — not just on initial focus, but every time it changes while focused.
- [ ] Dynamic content changes that happen *without* focus moving (a readout updating in response to another control) are still communicated somehow — via [live-region-style dynamic descriptions](/accessibility/describing-dynamic-state) or Voicing, not silently rendered and never announced.
- [ ] Nothing over-announces — a rapidly-changing value (a live physics readout) doesn't spam the screen reader with an announcement every animation frame; check that updates are throttled to something a user can actually follow.

**Focus and highlights**
- [ ] Every focusable element shows a visible focus highlight for sighted low-vision users navigating by keyboard alongside the screen reader (see [Focus Highlights](/accessibility/focus-highlights)) — screen-reader and keyboard-only usage overlap heavily in practice.
- [ ] Focus never gets trapped in a sub-region (a dialog, a popup) without an announced, working way out.
- [ ] Opening/closing a dialog moves focus predictably (into the dialog on open, back to the triggering control on close) rather than leaving focus on a now-hidden or now-destroyed element.

**Voicing (if enabled)**
- [ ] If the sim also supports [Voicing](/accessibility/voicing), test it as a *separate* pass from screen-reader testing — Voicing is a distinct opt-in feature aimed at sighted users, not a replacement for PDOM correctness, and testing them together makes it easy to mistake one system's announcement for the other's.

## Filing what you find

Note the exact screen reader, browser, and OS version alongside each issue — screen-reader behavior is notoriously version- and pairing-specific, and "VoiceOver announced X" without the browser is often not reproducible by whoever picks up the fix.

::: tip Automated PDOM checks catch structure, not experience
A validator can confirm every interactive element has a `tagName` and an `accessibleName` set. It cannot tell you the reading order is confusing, that two elements have the same name, or that a live update is spammy. Treat automated checks as a floor, and this checklist's manual pass as the thing that actually determines whether the experience is usable.
:::
