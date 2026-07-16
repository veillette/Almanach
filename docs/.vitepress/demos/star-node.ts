import { NumberProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { StarNode } from 'scenerystack/scenery-phet';
import { Node, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 240;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 1 );
  const valueProperty = new NumberProperty( 0.65, { range: range } );

  const readout = new Text( '' );
  const starContainer = new Node();
  let star: StarNode | null = null;

  const rebuild = ( value: number ): void => {
    if ( star ) {
      star.dispose();
    }
    star = new StarNode( {
      value: value,
      starShapeOptions: { outerRadius: 45, innerRadius: 22 }
    } );
    starContainer.children = [ star ];
    readout.string = `fill: ${Math.round( value * 100 )}%`;
  };
  valueProperty.link( rebuild );

  const slider = new HSlider( valueProperty, range, {
    trackSize: { width: 200, height: 5 }
  } );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [
      starContainer,
      readout,
      slider
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    valueProperty.unlink( rebuild );
    if ( star ) {
      star.dispose();
    }
    slider.dispose();
    starContainer.dispose();
    readout.dispose();
    panel.dispose();
    valueProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
