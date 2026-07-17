import { AtomNode, Element } from 'scenerystack/nitroglycerin';
import { HBox, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 180;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const elements = [ Element.H, Element.C, Element.N, Element.O ];

  const atoms = elements.map( element => {
    const atom = new AtomNode( element );
    const label = new Text( element.symbol, { fontSize: 16 } );
    return new VBox( { spacing: 8, align: 'center', children: [ atom, label ] } );
  } );

  const row = new HBox( { spacing: 26, align: 'bottom', children: atoms } );

  rootNode.addChild( row );
  const unlinkCenter = centerInDisplay( row, width, height );

  return () => {
    unlinkCenter();
    atoms.forEach( a => a.dispose() );
    row.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
