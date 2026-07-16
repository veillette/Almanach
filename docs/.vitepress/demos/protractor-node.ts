import { ProtractorNode } from 'scenerystack/scenery-phet';
import { Node } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 260;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const protractor = new ProtractorNode( {
    scale: 0.6
  } );

  const container = new Node( { children: [ protractor ] } );

  rootNode.addChild( container );
  const unlinkCenter = centerInDisplay( container, width, height );

  return () => {
    unlinkCenter();
    protractor.dispose();
    container.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
