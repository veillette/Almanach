import { BracketNode } from 'scenerystack/scenery-phet';
import { Text } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 340;
export const height = 160;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const bracket = new BracketNode( {
    orientation: 'down',
    bracketLength: 220,
    labelNode: new Text( 'wavelength', { fontSize: 16 } ),
    bracketStroke: '#2E5F8A',
    bracketLineWidth: 3
  } );

  rootNode.addChild( bracket );
  const unlinkCenter = centerInDisplay( bracket, width, height );

  return () => {
    unlinkCenter();
    bracket.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
