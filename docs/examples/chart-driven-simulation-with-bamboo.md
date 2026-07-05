---
title: A Chart-Driven Simulation with Bamboo
description: A worked mini-sim where a model Property drives a live bamboo LinePlot through a ChartTransform, with an accessible description that tracks the trend.
category: examples
tags: [example, bamboo, ChartTransform, LinePlot, chart]
status: complete
related:
  - /api/bamboo/chart-transform
  - /api/bamboo/line-plot
  - /api/bamboo/axis-nodes
  - /api/bamboo/gridlines-and-tick-marks
  - /accessibility/accessible-descriptions-for-charts-and-graphs
  - /patterns/model-view-separation
prerequisites:
  - /getting-started/your-first-simulation
  - /api/bamboo/chart-transform
sourceRefs:
  - https://www.npmjs.com/package/scenerystack
---

# A Chart-Driven Simulation with Bamboo

This page builds a small, complete screen where a model `Property` drives a live-updating [`LinePlot`](/api/bamboo/line-plot) through a shared [`ChartTransform`](/api/bamboo/chart-transform) — the same pieces documented individually in `api/bamboo/`, wired together end to end, including axes, gridlines, and an accessible chart description. The scenario: a cooling cup of coffee, whose temperature decays toward room temperature over time, plotted as temperature vs. elapsed time.

## The model

The model owns the temperature Property and appends a new (time, temperature) sample every `step()`, following [model-view separation](/patterns/model-view-separation):

```ts
import { NumberProperty, Property } from 'scenerystack/axon';
import { Range, Vector2 } from 'scenerystack/dot';
import { Tandem } from 'scenerystack/tandem';

class CoolingCupModel {
  public readonly temperatureProperty: NumberProperty;
  public readonly dataSetProperty: Property<Vector2[]>;

  private elapsedTime = 0;
  private static readonly ROOM_TEMPERATURE = 22; // Celsius
  private static readonly COOLING_RATE = 0.05;   // per second

  public constructor( tandem: Tandem ) {
    this.temperatureProperty = new NumberProperty( 90, {
      range: new Range( 22, 100 ),
      tandem: tandem.createTandem( 'temperatureProperty' )
    } );

    // The full dataset the chart plots - not just the current value, so the LinePlot
    // has a history to draw a line through, not a single point.
    this.dataSetProperty = new Property<Vector2[]>( [ new Vector2( 0, this.temperatureProperty.value ) ] );
  }

  public step( dt: number ): void {
    this.elapsedTime += dt;

    const roomTemperature = CoolingCupModel.ROOM_TEMPERATURE;
    const decay = Math.exp( -CoolingCupModel.COOLING_RATE * this.elapsedTime );
    this.temperatureProperty.value = roomTemperature + ( 90 - roomTemperature ) * decay;

    // Append a sample; reassigning (not mutating in place) so the Property fires.
    this.dataSetProperty.value = [
      ...this.dataSetProperty.value,
      new Vector2( this.elapsedTime, this.temperatureProperty.value )
    ];
  }

  public reset(): void {
    this.elapsedTime = 0;
    this.temperatureProperty.reset();
    this.dataSetProperty.reset();
  }
}
```

`dataSetProperty` is reassigned to a new array each step rather than mutated in place — `Property` only notifies listeners on `.value =`/`.set()`, so appending to the existing array with `.push()` would silently fail to trigger a redraw.

## The view: chart, axes, and an accessible description

```ts
import { ScreenView, type ScreenViewOptions } from 'scenerystack/sim';
import { Node, Text } from 'scenerystack/scenery';
import { ChartTransform, ChartRectangle, LinePlot, AxisLine, GridLineSet, TickLabelSet } from 'scenerystack/bamboo';
import { Orientation } from 'scenerystack/phet-core';
import { Range } from 'scenerystack/dot';
import { DerivedProperty } from 'scenerystack/axon';
import { StringUtils } from 'scenerystack/phetcommon';
import { ResetAllButton } from 'scenerystack/scenery-phet';

class CoolingCupScreenView extends ScreenView {
  public constructor( model: CoolingCupModel, providedOptions: ScreenViewOptions ) {
    super( providedOptions );

    const chartTransform = new ChartTransform( {
      viewWidth: 500,
      viewHeight: 250,
      modelXRange: new Range( 0, 120 ),   // seconds
      modelYRange: new Range( 20, 100 )   // degrees Celsius
    } );

    const chartRectangle = new ChartRectangle( chartTransform, {
      fill: 'white',
      stroke: 'black'
    } );

    const temperaturePlot = new LinePlot( chartTransform, model.dataSetProperty.value, {
      stroke: 'orangered',
      lineWidth: 2
    } );
    model.dataSetProperty.link( dataSet => temperaturePlot.setDataSet( dataSet ) );

    const xAxis = new AxisLine( chartTransform, Orientation.HORIZONTAL, { value: 20 } );
    const yAxis = new AxisLine( chartTransform, Orientation.VERTICAL, { value: 0 } );
    const horizontalGridLines = new GridLineSet( chartTransform, Orientation.VERTICAL, 20, { stroke: 'lightGray' } );
    const xTickLabels = new TickLabelSet( chartTransform, Orientation.HORIZONTAL, 20, { edge: 'min' } );

    // Description content derived from the SAME dataSetProperty the plot renders from,
    // so the two can never drift apart - see Accessible Descriptions for Charts and Graphs.
    const chartDescriptionProperty = new DerivedProperty(
      [ model.dataSetProperty ],
      dataSet => {
        const first = dataSet[ 0 ];
        const last = dataSet[ dataSet.length - 1 ];
        return StringUtils.fillIn(
          'Temperature is falling, from {{start}} to {{current}} degrees Celsius over {{seconds}} seconds.', {
            start: first.y.toFixed( 0 ),
            current: last.y.toFixed( 0 ),
            seconds: last.x.toFixed( 0 )
          }
        );
      }
    );

    const chartNode = new Node( {
      children: [ chartRectangle, horizontalGridLines, xAxis, yAxis, temperaturePlot, xTickLabels ],
      tagName: 'div',
      labelTagName: 'h3',
      labelContent: 'Coffee Temperature Over Time',
      descriptionContent: chartDescriptionProperty,
      center: this.layoutBounds.center
    } );

    const temperatureReadout = new Text( '', { font: '20px sans-serif' } );
    model.temperatureProperty.link( temperature => {
      temperatureReadout.string = `${temperature.toFixed( 1 )} °C`;
    } );
    temperatureReadout.left = chartNode.left;
    temperatureReadout.bottom = chartNode.top - 10;

    const resetAllButton = new ResetAllButton( {
      listener: () => model.reset(),
      right: this.layoutBounds.maxX - 20,
      bottom: this.layoutBounds.maxY - 20,
      tandem: this.tandem.createTandem( 'resetAllButton' )
    } );

    this.children = [ temperatureReadout, chartNode, resetAllButton ];
    this.pdomOrder = [ chartNode, resetAllButton ];
  }
}
```

A few things worth noticing:

| Piece | Why it's there |
| --- | --- |
| `dataSetProperty` reassigned (not mutated) every step | The only thing that makes both `temperaturePlot` and `chartDescriptionProperty` redraw/recompute automatically |
| `chartDescriptionProperty` derives from `dataSetProperty` | Same source data as the plot itself — the description can never say something the chart doesn't show, following [Accessible Descriptions for Charts and Graphs](/accessibility/accessible-descriptions-for-charts-and-graphs) |
| `xAxis` pinned at `value: 20` | Since `modelYRange` starts at `20`, not `0`, drawing the x axis at the *true* y-origin (`0`) would put it off-chart — see the `value`-is-on-the-opposite-axis note in [AxisLine and AxisArrowNode](/api/bamboo/axis-nodes) |
| `chartNode.tagName = 'div'` with `labelTagName`/`descriptionContent` | The chart's whole visual (background, gridlines, plot, ticks) is grouped as one PDOM node — a screen reader encounters "Coffee Temperature Over Time" plus the trend sentence, not each drawn Path individually |

## Wiring the Screen and Sim

```ts
import { Sim, Screen, onReadyToLaunch } from 'scenerystack/sim';
import { Property } from 'scenerystack/axon';
import { Tandem } from 'scenerystack/tandem';

const screenTandem = Tandem.ROOT.createTandem( 'coolingCupScreen' );

const coolingCupScreen = new Screen(
  () => new CoolingCupModel( screenTandem.createTandem( 'model' ) ),
  model => new CoolingCupScreenView( model, { tandem: screenTandem.createTandem( 'view' ) } ),
  {
    name: new Property( 'Cooling Cup' ),
    backgroundColorProperty: new Property( 'white' ),
    tandem: screenTandem
  }
);

onReadyToLaunch( () => {
  const sim = new Sim( new Property( 'Chart Demo' ), [ coolingCupScreen ] );
  sim.start();
} );
```

::: tip Reassign, don't mutate, any Property holding an array or object
This example's most important detail is easy to miss: `model.dataSetProperty.value = [ ...oldArray, newSample ]` fires listeners; `model.dataSetProperty.value.push( newSample )` does not. Every downstream consumer here — the `LinePlot`, the `DerivedProperty` feeding the chart's description — depends on the reassignment, not just the array's contents changing.
:::

## Where to go next

- [ChartTransform](/api/bamboo/chart-transform) — the coordinate-mapping object every piece above shares
- [GridLineSet, TickMarkSet, and TickLabelSet](/api/bamboo/gridlines-and-tick-marks) — more on the repeating-decoration primitives used here
- [Accessible Descriptions for Charts and Graphs](/accessibility/accessible-descriptions-for-charts-and-graphs) — the general pattern this example's `chartDescriptionProperty` follows
- [Demo Simulation Walkthrough](/examples/demo-simulation-walkthrough) — the same model/view/Screen/Sim shape without a chart
