import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { PlusMinusZoomButtonGroup } from 'scenerystack/scenery-phet';
import { HBox, Node, Rectangle } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 380;
export const height = 220;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const zoomLevelProperty = new NumberProperty( 2, { range: new Range( 1, 5 ) } );

  const buttonGroup = new PlusMinusZoomButtonGroup( zoomLevelProperty, { orientation: 'vertical' } );

  const shape = new Rectangle( 0, 0, 40, 40, { fill: '#5B9BD5', cornerRadius: 4 } );
  const shapeContainer = new Node( { children: [ shape ] } );
  // Reserve room for the largest zoom so centering stays put.
  const frame = new Node( { children: [ shapeContainer ], localBounds: new Rectangle( 0, 0, 40 * 5, 40 * 5 ).localBounds } );

  const update = ( zoom: number ): void => {
    shapeContainer.setScaleMagnitude( zoom );
  };
  zoomLevelProperty.link( update );

  const panel = new HBox( { spacing: 30, align: 'center', children: [ frame, buttonGroup ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    zoomLevelProperty.unlink( update );
    buttonGroup.dispose();
    frame.dispose();
    shapeContainer.dispose();
    shape.dispose();
    panel.dispose();
    zoomLevelProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
