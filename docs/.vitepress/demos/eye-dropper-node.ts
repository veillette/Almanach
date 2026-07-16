import { EyeDropperNode } from 'scenerystack/scenery-phet';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 280;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const eyeDropper = new EyeDropperNode( {
    fluidColor: '#4a90d9'
  } );

  const readout = new Text( 'button up' );
  const updateReadout = ( isDispensing: boolean ): void => {
    readout.string = isDispensing ? 'dispensing…' : 'button up';
  };
  eyeDropper.isDispensingProperty.link( updateReadout );

  const panel = new VBox( {
    spacing: 12,
    align: 'center',
    children: [
      eyeDropper,
      readout
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    eyeDropper.isDispensingProperty.unlink( updateReadout );
    eyeDropper.dispose();
    readout.dispose();
    panel.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
