import { BooleanProperty } from 'scenerystack/axon';
import { Shape } from 'scenerystack/kite';
import { GridCheckbox } from 'scenerystack/scenery-phet';
import { Node, Path, Rectangle, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 320;
export const height = 260;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const visibleProperty = new BooleanProperty( true );

  const background = new Rectangle( 0, 0, 150, 150, { fill: 'white', stroke: '#999' } );
  const gridShape = new Shape();
  for ( let i = 1; i < 6; i++ ) {
    gridShape.moveTo( i * 25, 0 ).lineTo( i * 25, 150 );
    gridShape.moveTo( 0, i * 25 ).lineTo( 150, i * 25 );
  }
  const grid = new Path( gridShape, { stroke: '#8AA4C4', lineWidth: 1 } );
  visibleProperty.link( visible => { grid.visible = visible; } );

  const board = new Node( { children: [ background, grid ] } );

  const checkbox = new GridCheckbox( visibleProperty );

  const panel = new VBox( { spacing: 20, align: 'center', children: [ board, checkbox ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    checkbox.dispose();
    board.dispose();
    grid.dispose();
    background.dispose();
    panel.dispose();
    visibleProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
