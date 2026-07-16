import { MagnifyingGlassNode } from 'scenerystack/scenery-phet';
import { Node, Text } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const magnifier = new MagnifyingGlassNode( {
    glassRadius: 45,
    glassFill: '#e8f4ff',
    icon: new Text( '+', { fontSize: 36 } )
  } );

  const container = new Node( { children: [ magnifier ] } );

  rootNode.addChild( container );
  const unlinkCenter = centerInDisplay( container, width, height );

  return () => {
    unlinkCenter();
    magnifier.dispose();
    container.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
