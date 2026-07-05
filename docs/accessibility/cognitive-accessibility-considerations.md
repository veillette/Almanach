---
title: Cognitive Accessibility Considerations
description: Reducing cognitive load - clear language, consistent layout, and avoiding unnecessary complexity or timers - as an accessibility axis distinct from screen-reader and keyboard support.
category: accessibility
tags: [accessibility, cognitive-load, plain-language, conventions]
status: complete
related:
  - /accessibility/pdom
  - /accessibility/internationalized-accessible-names
  - /styling/layout-container-conventions
  - /patterns/feature-flags-and-preferences-pattern
prerequisites:
  - /accessibility/pdom
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Cognitive Accessibility Considerations

Most of this wiki's accessibility content — [the PDOM](/accessibility/pdom), [Voicing](/accessibility/voicing), [focus highlights](/accessibility/focus-highlights), [sound design](/accessibility/sound-design) — addresses *sensory and motor* accessibility: can the content be perceived and operated without sight, without a mouse, without hearing. **Cognitive accessibility** is a distinct axis: can the content be *understood and used without unnecessary mental effort*, independent of whether the user can see the screen or operate a mouse just fine. A sim can pass every PDOM/keyboard/contrast check and still be needlessly hard to use for a learner who is overwhelmed by cluttered layout, jargon-heavy labels, or an unexplained countdown.

## Why this doesn't reduce to the other accessibility axes

A screen-reader test confirms that a control has a name and is reachable; it says nothing about whether that name is written in plain language. A keyboard test confirms every control is operable; it says nothing about whether the *number* of controls on screen is more than a first-time user can hold in mind at once. Treat cognitive accessibility as its own review pass — reading a screen's layout and copy specifically for clarity and load — rather than assuming it's covered as a side effect of PDOM/keyboard work.

## Clear language over technically-precise jargon

Prefer the plain-language term a general audience already knows over the internally-precise term a domain expert would reach for, unless the sim is specifically *teaching* the precise term:

| Prefer | Over, unless the precise term is the learning goal |
| --- | --- |
| "Speed" | "Velocity magnitude" |
| "How heavy" / "Weight" | "Gravitational force" (when the sim isn't specifically about force vs. weight) |
| "Turn this on to see arrows" | "Toggle vector field visualization overlay" |

This is the same discipline [Internationalized Accessible Names](/accessibility/internationalized-accessible-names) already asks for on `accessibleName`/`accessibleHelpText` strings — every user-facing string, PDOM or visible, should be reviewed for plain language, not just for whether it's routed through the translation pipeline correctly.

## Consistent layout over novel-per-screen arrangement

A returning user (or a user moving between a sim's several screens) benefits from controls staying in roughly the same place and using the same visual language throughout — a reset button that's bottom-right on one screen and top-left on another forces the user to relearn the layout instead of transferring what they already know. [Layout Container Conventions](/styling/layout-container-conventions) already asks for one spacing scale and consistent alignment for its own visual-polish reasons; the same consistency also directly reduces cognitive load, since a predictable layout is one less thing a user has to think about before they can focus on the content itself.

## Avoid unnecessary complexity

Every control, every simultaneously-moving element, and every additional decision a screen asks of the user has a cognitive cost, separate from whatever screen space and code it costs to build. Before adding a control or a visual embellishment, ask whether it serves the sim's learning goal or is incidental complexity:

- **Progressive disclosure**: show the minimum needed to get started, and reveal advanced options (via an `AccordionBox` — see [Panels and Backgrounds](/styling/panels-and-backgrounds)) only once a user has engaged with the basics, rather than presenting every control at once on first load.
- **One clear primary action per screen.** If several controls compete visually for attention, a user has to work out which one matters right now — reserve the strongest visual weight (size, color, position) for the action the screen is actually about.
- **Avoid simultaneous unrelated motion.** Several independently-animating elements on screen at once (see [Animation and Motion Design Conventions](/styling/animation-and-motion-design-conventions)) force a user to divide attention across all of them; sequence or group related motion instead of letting everything move freely at once.

## Timers and time pressure

A countdown or a time-limited challenge adds cognitive load on top of whatever the sim is actually teaching — the user is now managing "the clock" as a second task alongside the content itself. Where a timer isn't itself the point of the activity (a genuine speed/reaction-time exercise), avoid unnecessary time pressure:

- Prefer **self-paced** interaction wherever a timer isn't essential to the learning goal.
- If a game/reward system (see [vegas](/api/vegas/level-selection-button)) includes a timer, make it optional or clearly signposted, and never silently penalize a user for taking time to think.
- A visible, predictable countdown (if a timer is genuinely needed) is less stressful than an unexplained or invisible one — the user should always be able to tell how much time remains and what happens when it runs out, well before it runs out.

## Prefer showing over describing, where both are possible

Combined with concrete language, a labeled example, an icon paired with text, or a short demonstration reduces the inferential work a user has to do compared with an abstract instruction alone — "drag the ball to launch it," paired with a visual arrow or a brief animated hint, communicates faster than a paragraph of instructions a user must first read and mentally translate into an action.

::: tip Cognitive load is a design review category, not a checkbox
Unlike PDOM/keyboard correctness, there's no automated check for "is this screen too complex" or "is this label plain enough." Build a deliberate review pass for it — walk through each screen asking "what does a first-time user have to hold in mind here, and is any of it avoidable" — rather than assuming it falls out of passing the sim's other accessibility checks.
:::
