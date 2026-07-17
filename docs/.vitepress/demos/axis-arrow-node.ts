import { Range } from 'scenerystack/dot';
import { Orientation } from 'scenerystack/phet-core';
import { Node } from 'scenerystack/scenery';
import { AxisArrowNode, ChartRectangle, ChartTransform, TickMarkSet } from 'scenerystack/bamboo';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 380;
export const height = 300;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const chartTransform = new ChartTransform( {
    viewWidth: 260,
    viewHeight: 200,
    modelXRange: new Range( -5, 5 ),
    modelYRange: new Range( -5, 5 )
  } );

  const chartRectangle = new ChartRectangle( chartTransform, { fill: 'white', stroke: '#ccc' } );

  const xAxis = new AxisArrowNode( chartTransform, Orientation.HORIZONTAL, {
    value: 0,
    extension: 12,
    fill: '#333',
    stroke: '#333'
  } );
  const yAxis = new AxisArrowNode( chartTransform, Orientation.VERTICAL, {
    value: 0,
    extension: 12,
    fill: '#333',
    stroke: '#333'
  } );

  const ticksX = new TickMarkSet( chartTransform, Orientation.HORIZONTAL, 1, { edge: null, value: 0 } );
  const ticksY = new TickMarkSet( chartTransform, Orientation.VERTICAL, 1, { edge: null, value: 0 } );

  const chart = new Node( { children: [ chartRectangle, ticksX, ticksY, xAxis, yAxis ] } );

  rootNode.addChild( chart );
  const unlinkCenter = centerInDisplay( chart, width, height );

  return () => {
    unlinkCenter();
    chart.dispose();
    ticksX.dispose();
    ticksY.dispose();
    xAxis.dispose();
    yAxis.dispose();
    chartRectangle.dispose();
    chartTransform.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
