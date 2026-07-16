import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { FlowBox, Node, Rectangle, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 420;
export const height = 280;

const COLORS = [ '#5B9BD5', '#8FBF5B', '#D9782D', '#B05BD5', '#D5B15B', '#5BD5B1', '#D55B7A', '#5B70D5' ];

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 90, 340 );
  const preferredWidthProperty = new NumberProperty( 220, { range: range } );

  const tiles = COLORS.map( color => new Rectangle( 0, 0, 40, 40, { fill: color, cornerRadius: 6 } ) );
  const flowBox = new FlowBox( {
    orientation: 'horizontal',
    wrap: true,
    spacing: 8,
    lineSpacing: 8,
    justify: 'left',
    preferredWidth: preferredWidthProperty.value,
    children: tiles
  } );
  // Reserve the widest layout so wrapping does not shift the centering.
  const frame = new Node( { children: [ flowBox ], localBounds: new Rectangle( 0, 0, range.max, 160 ).localBounds } );

  const readout = new Text( '' );
  const update = ( preferredWidth: number ): void => {
    flowBox.preferredWidth = preferredWidth;
    readout.string = `preferredWidth: ${Math.round( preferredWidth )}`;
  };
  preferredWidthProperty.link( update );

  const slider = new HSlider( preferredWidthProperty, range, { trackSize: { width: 220, height: 5 } } );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [ frame, readout, slider ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    preferredWidthProperty.unlink( update );
    slider.dispose();
    frame.dispose();
    flowBox.dispose();
    tiles.forEach( t => t.dispose() );
    readout.dispose();
    panel.dispose();
    preferredWidthProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
