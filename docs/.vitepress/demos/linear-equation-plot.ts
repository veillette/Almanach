import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { HBox, Node, Text, VBox } from 'scenerystack/scenery';
import { ChartRectangle, ChartTransform, LinearEquationPlot } from 'scenerystack/bamboo';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 420;
export const height = 320;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const mProperty = new NumberProperty( 1, { range: new Range( -3, 3 ) } );
  const bProperty = new NumberProperty( 0, { range: new Range( -5, 5 ) } );

  const chartTransform = new ChartTransform( {
    viewWidth: 260,
    viewHeight: 200,
    modelXRange: new Range( -10, 10 ),
    modelYRange: new Range( -10, 10 )
  } );

  const chartRectangle = new ChartRectangle( chartTransform, { fill: 'white', stroke: 'black' } );

  const linePlot = new LinearEquationPlot( chartTransform, mProperty.value, bProperty.value, {
    stroke: '#D9782D',
    lineWidth: 3
  } );
  // Keep the line inside the chart bounds.
  linePlot.clipArea = chartRectangle.getShape();

  const readout = new Text( '' );
  const updateReadout = (): void => {
    readout.string = `y = ${mProperty.value.toFixed( 1 )}x + ${bProperty.value.toFixed( 1 )}`;
  };
  const mListener = ( m: number ): void => { linePlot.m = m; updateReadout(); };
  const bListener = ( b: number ): void => { linePlot.b = b; updateReadout(); };
  mProperty.link( mListener );
  bProperty.link( bListener );

  const chart = new Node( { children: [ chartRectangle, linePlot ] } );

  const labeledSlider = ( label: string, slider: HSlider ): VBox =>
    new VBox( { spacing: 4, align: 'center', children: [ new Text( label, { fontSize: 13 } ), slider ] } );

  const controls = new HBox( {
    spacing: 24,
    children: [
      labeledSlider( 'slope', new HSlider( mProperty, mProperty.range, { trackSize: { width: 120, height: 4 } } ) ),
      labeledSlider( 'intercept', new HSlider( bProperty, bProperty.range, { trackSize: { width: 120, height: 4 } } ) )
    ]
  } );

  const panel = new VBox( { spacing: 12, align: 'center', children: [ chart, readout, controls ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    mProperty.unlink( mListener );
    bProperty.unlink( bListener );
    panel.dispose();
    controls.dispose();
    readout.dispose();
    chart.dispose();
    linePlot.dispose();
    chartRectangle.dispose();
    chartTransform.dispose();
    mProperty.dispose();
    bProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
