import { Text, VBox } from 'scenerystack/scenery';
import { Keypad } from 'scenerystack/scenery-phet';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 320;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const keypad = new Keypad( Keypad.PositiveAndNegativeFloatingPointLayout );

  const readout = new Text( 'value: 0' );
  const updateReadout = ( string: string ): void => {
    readout.string = `value: ${string.length ? string : '0'}`;
  };
  keypad.stringProperty.link( updateReadout );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [
      readout,
      keypad
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    keypad.stringProperty.unlink( updateReadout );
    keypad.dispose();
    readout.dispose();
    panel.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
