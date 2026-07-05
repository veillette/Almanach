---
title: Haptics and Alternative Feedback Channels
description: Sound (tambo) and vibration (tappi) as feedback channels beyond the visual scene graph - when a simulation benefits from each, and how they relate to accessibility.
category: guides
tags: [tambo, tappi, sound, vibration, haptics, accessibility]
status: draft
related:
  - /guides/working-with-sound
  - /accessibility/sound-design
  - /api/tappi/vibration-manager-and-patterns
  - /guides/scenery-basics
prerequisites:
  - /guides/scenery-basics
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Haptics and Alternative Feedback Channels

Everything covered in [Scenery Basics](/guides/scenery-basics) is visual — Nodes, painted pixels, a `Display`. Not every user perceives a simulation that way, and even for users who do, a purely visual interaction misses feedback channels that a physical object would naturally provide. SceneryStack has two built-in, non-visual feedback channels: sound, via `tambo`, and vibration, via `tappi`. Both exist for the same underlying reason — giving a user information about what just happened without requiring them to be looking at (or looking closely at) the screen — but they suit different situations and hardware.

## Sound: tambo

`tambo` (`scenerystack/tambo`) is the more broadly applicable of the two — it works on essentially any device with audio output, requires no special hardware, and is useful for both sighted and low-vision/blind users. [Working with Sound](/guides/working-with-sound) covers the subsystem in full: a central `soundManager` that mixes together individually-registered **sound generators** (`SoundClip` for recorded assets, `PitchedPopGenerator` for pitch-continuous synthesized feedback, and others), grouped into categories a user can enable/disable independently.

Two distinct reasons a sim reaches for sound:

- **Confirmation and delight** — a click, a chime on success, an ambient hum while something is running — feedback that enhances the experience for every user, sighted or not, the same way physical toys and instruments make sound as a byproduct of interaction.
- **Accessibility (sonification)** — using the same tambo machinery specifically so a non-visual user (or a sighted user not looking at the screen) can perceive continuous state or discrete events that would otherwise be visual-only. [Sound Design](/accessibility/sound-design) covers this application specifically, including the `sharedSoundPlayers` registry that keeps common interactions (checkbox toggles, button presses, reset) sounding consistent across every sim without each one authoring its own.

## Vibration: tappi

`tappi`'s `vibrationManager` (`scenerystack/tappi`) is the haptic equivalent of `soundManager` — a central point that drives the device's vibration hardware in response to simulation events, using vibration "patterns" (a sequence of on/off durations and intensities) rather than raw single buzzes. See [vibrationManager and Vibration Patterns](/api/tappi/vibration-manager-and-patterns) for the API itself.

Vibration is a narrower tool than sound for a simple hardware reason: it requires a device with a vibration motor the browser can actually drive (most phones/tablets; effectively no desktop browsers), so it's necessarily a *supplementary* channel layered on top of visual and/or sound feedback, never the only way an interaction communicates something. Where it earns its place is touch-first interactions where the device itself is already in the user's hand — confirming a drag has snapped into place, signaling a boundary has been reached, or reinforcing a discrete event (a collision, a successful match) with a physical pulse that doesn't require audio output at all (useful in shared/classroom settings where sound might be muted or inappropriate).

## Choosing a channel

| Channel | Requires | Reaches | Typical use |
| --- | --- | --- | --- |
| Visual (scenery) | Any display | Every user by default | The primary channel; everything else is supplementary |
| Sound (tambo) | Audio output, not muted | Sighted and non-sighted users alike | Confirmation/delight, and sonification for low-vision/blind users |
| Vibration (tappi) | A device with a vibration motor (mobile/touch) | Users on supported touch hardware, sound-independent | Reinforcing a touch interaction physically, especially where audio may be muted or unavailable |

None of these are exclusive — a well-designed touch interaction on mobile might pair a visual snap-into-place animation, a short confirmation sound, and a vibration pulse for the same event, so the feedback reaches the user regardless of which channel they happen to be attending to (or which channels their device/settings support) at that moment.

::: tip Non-visual channels are additive, not a replacement for the PDOM
Sound and vibration are useful accessibility *supplements*, but neither substitutes for the structured, navigable accessibility tree the [PDOM](/accessibility/pdom) provides for screen-reader users, or for [Voicing](/accessibility/voicing)'s spoken descriptions. A collision sound tells a user *something* happened; it doesn't tell them *what* the current state is in a way a screen reader can query on demand. Treat tambo/tappi feedback as reinforcement layered on top of a genuinely accessible PDOM structure, not a shortcut around building one.
:::

## Where to go next

- [Working with Sound](/guides/working-with-sound) — the full tambo subsystem tour
- [Sound Design](/accessibility/sound-design) — sound specifically as an accessibility channel
- [vibrationManager and Vibration Patterns](/api/tappi/vibration-manager-and-patterns) — the tappi API this page summarizes
