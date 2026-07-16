import { HandleNode } from 'scenerystack/scenery-phet';
import { Node } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const handle = new HandleNode( {
    scale: 0.6,
    gripBaseColor: '#8FBF5B'
  } );

  const container = new Node( { children: [ handle ] } );

  rootNode.addChild( container );
  const unlinkCenter = centerInDisplay( container, width, height );

  return () => {
    unlinkCenter();
    handle.dispose();
    container.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
