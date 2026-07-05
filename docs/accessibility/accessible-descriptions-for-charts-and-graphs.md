---
title: Accessible Descriptions for Charts and Graphs
description: Writing PDOM description content for a bamboo chart that conveys the data's trend and key values, not just the fact that a chart exists.
category: accessibility
tags: [bamboo, pdom, description, ChartTransform, accessibility, charts]
status: complete
related:
  - /accessibility/describing-dynamic-state
  - /accessibility/pdom
  - /api/bamboo/chart-transform
  - /api/bamboo/line-plot
prerequisites:
  - /accessibility/describing-dynamic-state
  - /api/bamboo/chart-transform
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# Accessible Descriptions for Charts and Graphs

A `bamboo` chart (a [`ChartTransform`](/api/bamboo/chart-transform) plus a [`LinePlot`](/api/bamboo/line-plot)/`BarPlot`/`ScatterPlot`) is, to a screen reader, just a collection of `Path`/`Rectangle`/`Circle` Nodes drawing pixels — nothing about the visual line or bars is inherently meaningful without a description. Giving the chart a bare `descriptionContent` of `"A chart"` satisfies an automated PDOM checker but tells a screen-reader user nothing they couldn't already infer. This page is about writing chart description content that instead conveys **the trend and the values that matter**, following the same mechanisms [Describing Dynamic State](/accessibility/describing-dynamic-state) already establishes for any changing model value.

## Describe the trend, not the mechanism

The single most useful sentence a chart's description can contain says what's *happening in the data*, in plain language — rising, falling, oscillating, leveling off — rather than a literal restatement of the axes:

```ts
// Weak: technically accurate, communicates nothing about the data's shape.
descriptionContent: 'A line chart showing temperature versus time.'

// Better: leads with the trend a sighted user would notice at a glance.
descriptionContent: 'Temperature is rising steadily, from 15 to 42 degrees Celsius over the last 10 seconds.'
```

The second version is what a sighted user actually gets "for free" by glancing at the plot's slope — a screen-reader user should get the equivalent information from the description, not a lower-fidelity restatement of the chart's title and axis labels (which, if present, are already conveyed by the chart's own `labelContent`/surrounding text).

## Derive the description from the same data driving the plot

Because a bamboo chart's `dataSet` already lives in ordinary TypeScript (an array, or values read off model `Property`s), a `DerivedProperty` can compute a trend description from exactly the same source the `LinePlot` renders from — the two are guaranteed to agree, and the description updates automatically as the chart does:

```ts
import { DerivedProperty } from 'scenerystack/axon';
import { ChartTransform, LinePlot } from 'scenerystack/bamboo';
import { Node } from 'scenerystack/scenery';
import { StringUtils } from 'scenerystack/phetcommon';
import { Range } from 'scenerystack/dot';

const chartTransform = new ChartTransform( {
  viewWidth: 400,
  viewHeight: 200,
  modelXRange: new Range( 0, 10 ),
  modelYRange: new Range( 0, 50 )
} );

const linePlot = new LinePlot( chartTransform, temperatureModel.dataSetProperty.value );

// Same underlying data the LinePlot renders from - description and visual can't drift apart.
const chartDescriptionProperty = new DerivedProperty(
  [ temperatureModel.dataSetProperty ],
  dataSet => {
    const first = dataSet[ 0 ];
    const last = dataSet[ dataSet.length - 1 ];
    const direction = last.y > first.y ? 'rising' : last.y < first.y ? 'falling' : 'holding steady';
    return StringUtils.fillIn(
      'Temperature is {{direction}}, from {{start}} to {{end}} degrees Celsius.', {
        direction: direction,
        start: first.y.toFixed( 0 ),
        end: last.y.toFixed( 0 )
      }
    );
  }
);

const chartNode = new Node( {
  children: [ /* ChartRectangle, linePlot, axes, ... */ ],
  tagName: 'div',
  labelTagName: 'h3',
  labelContent: 'Temperature Over Time',
  descriptionContent: chartDescriptionProperty
} );
```

Recompute the description on meaningful transitions in the data (a full step of new readings, a completed run) rather than on every single point added to a live-scrolling chart — a description that rewrites itself every animation frame is as unhelpful read aloud as it would be if a sighted user had to re-read a full paragraph every frame (see the "keep dynamic descriptions concise" guidance in [Describing Dynamic State](/accessibility/describing-dynamic-state#choosing-between-the-two)).

## Announce notable events as they happen, separately from the resting description

A resting `descriptionContent` is only read when something visits the chart (initial focus, screen-reader navigation). A notable event *while looking at other content* — the plotted value crossing a threshold, a data-collection run finishing — needs `addAccessibleResponse` instead, exactly as in [Describing Dynamic State](/accessibility/describing-dynamic-state#announcing-changes-as-they-happen-with-addaccessibleresponse):

```ts
temperatureModel.temperatureProperty.link( ( temperature, previousTemperature ) => {
  if ( previousTemperature !== null && temperature >= 100 && previousTemperature < 100 ) {
    chartNode.addAccessibleResponse( 'Boiling point reached.' );
  }
} );
```

## What to include, and what to leave out

| Include | Leave out (or keep secondary) |
| --- | --- |
| The overall trend/shape in plain language ("rising," "leveling off," "oscillating") | The chart type as the leading clause ("a line chart of…") — useful context, but not the headline |
| Start/end or current values, rounded to a sensible precision | Every individual data point — a screen reader user doesn't need (and can't usefully absorb) the full `dataSet` read aloud point by point |
| Units, matching whatever's shown on the visible axis labels | Pixel/view-coordinate detail (`viewWidth`, chart position on screen) — irrelevant to the data itself |
| Notable features a sighted glance would catch — a peak, a crossing of zero, a plateau | Implementation detail about `ChartTransform`/plot type — not meaningful to the reader |

::: tip A chart's description is a summary, not a data dump
Resist the urge to make the description "complete" by enumerating values — a sighted user doesn't read every pixel of a line either; they perceive its shape. Write the description to convey the same *summary-level* understanding a glance provides, and let a data table or export feature (if the sim has one) carry the full precision for users who need it.
:::
