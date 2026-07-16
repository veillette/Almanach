import { Dimension2 } from 'scenerystack/dot';
import { SpectrumNode } from 'scenerystack/scenery-phet';
import { Node } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 140;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const spectrum = new SpectrumNode( {
    size: new Dimension2( 300, 60 )
  } );

  const container = new Node( { children: [ spectrum ] } );

  rootNode.addChild( container );
  const unlinkCenter = centerInDisplay( container, width, height );

  return () => {
    unlinkCenter();
    spectrum.dispose();
    container.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
