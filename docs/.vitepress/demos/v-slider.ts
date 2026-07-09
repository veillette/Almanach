import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { Text, VBox } from 'scenerystack/scenery';
import { VSlider } from 'scenerystack/sun';
import { Tandem } from 'scenerystack/tandem';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 300;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const volumeProperty = new NumberProperty( 50, {
    range: new Range( 0, 100 )
  } );

  const readout = new Text( '50%' );

  const slider = new VSlider( volumeProperty, new Range( 0, 100 ), {
    trackSize: { width: 8, height: 120 },
    tandem: Tandem.OPTIONAL
  } );

  const panel = new VBox( {
    spacing: 10,
    align: 'center',
    children: [
      readout,
      slider
    ]
  } );

  const unlinkReadout = volumeProperty.link( value => {
    readout.string = `${Math.round( value )}%`;
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    unlinkReadout();
    panel.dispose();
    slider.dispose();
    volumeProperty.dispose();
    readout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
