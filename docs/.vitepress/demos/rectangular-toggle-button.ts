import { BooleanProperty } from 'scenerystack/axon';
import { Dimension2 } from 'scenerystack/dot';
import { RectangularToggleButton } from 'scenerystack/sun';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 300;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const onProperty = new BooleanProperty( false );

  // Flips between valueOff and valueOn on each press.
  const button = new RectangularToggleButton( onProperty, false, true, {
    content: new Text( 'Toggle', { fontSize: 18 } ),
    baseColor: '#B05BD5',
    size: new Dimension2( 110, 46 )
  } );

  const readout = new Text( '' );
  const update = ( on: boolean ): void => { readout.string = on ? 'ON' : 'OFF'; };
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
