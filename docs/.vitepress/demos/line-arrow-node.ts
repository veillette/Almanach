import { LineArrowNode } from 'scenerystack/scenery-phet';
import { VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 360;
export const height = 180;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const solid = new LineArrowNode( 0, 0, 220, 0, {
    stroke: '#2E5F8A',
    headHeight: 18,
    headWidth: 22,
    headLineWidth: 3,
    tailLineWidth: 3
  } );

  const dashed = new LineArrowNode( 0, 0, 220, 0, {
    stroke: '#D9782D',
    headHeight: 18,
    headWidth: 22,
    headLineWidth: 3,
    tailLineWidth: 2,
    tailLineDash: [ 6, 4 ]
  } );

  const panel = new VBox( { spacing: 28, align: 'center', children: [ solid, dashed ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    solid.dispose();
    dashed.dispose();
    panel.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
