import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { ScoreDisplayStars } from 'scenerystack/vegas';
import { Node, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 360;
export const height = 180;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 5 );
  const scoreProperty = new NumberProperty( 3, { range: range } );

  const scoreDisplay = new ScoreDisplayStars( scoreProperty, {
    numberOfStars: 5,
    perfectScore: 5,
    starNodeOptions: { starShapeOptions: { outerRadius: 20, innerRadius: 10 } }
  } );
  const frame = new Node( { children: [ scoreDisplay ], localBounds: scoreDisplay.localBounds.dilated( 2 ) } );

  const slider = new HSlider( scoreProperty, range, { trackSize: { width: 220, height: 5 } } );

  const panel = new VBox( { spacing: 24, align: 'center', children: [ frame, slider ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    slider.dispose();
    frame.dispose();
    scoreDisplay.dispose();
    panel.dispose();
    scoreProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
