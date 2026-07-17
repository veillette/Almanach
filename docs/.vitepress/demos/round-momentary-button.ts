import { BooleanProperty } from 'scenerystack/axon';
import { RoundMomentaryButton } from 'scenerystack/sun';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 300;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const onProperty = new BooleanProperty( false );

  // Value is true only while the button is held down.
  const button = new RoundMomentaryButton( onProperty, false, true, {
    baseColor: '#8FBF5B',
    radius: 34
  } );

  const readout = new Text( '' );
  const update = ( on: boolean ): void => { readout.string = on ? 'held down' : 'released'; };
  onProperty.link( update );

  const panel = new VBox( { spacing: 20, align: 'center', children: [ button, readout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    onProperty.unlink( update );
    button.dispose();
    readout.dispose();
    panel.dispose();
    onProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
