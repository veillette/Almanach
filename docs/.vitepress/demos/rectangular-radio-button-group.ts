import { Property } from 'scenerystack/axon';
import { RectangularRadioButtonGroup, type RectangularRadioButtonGroupItem } from 'scenerystack/sun';
import { Circle, Node, Path, Rectangle, Text, VBox } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 340;
export const height = 240;

type Shape3 = 'circle' | 'square' | 'triangle';

function triangle(): Node {
  const s = new Shape().moveTo( 0, -16 ).lineTo( 16, 14 ).lineTo( -16, 14 ).close();
  return new Path( s, { fill: '#333' } );
}

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const shapeProperty = new Property<Shape3>( 'circle' );

  const items: RectangularRadioButtonGroupItem<Shape3>[] = [
    { value: 'circle', createNode: () => new Circle( 15, { fill: '#333' } ) },
    { value: 'square', createNode: () => new Rectangle( 0, 0, 28, 28, { fill: '#333' } ) },
    { value: 'triangle', createNode: () => triangle() }
  ];

  const group = new RectangularRadioButtonGroup<Shape3>( shapeProperty, items, {
    orientation: 'horizontal',
    spacing: 12
  } );

  const readout = new Text( '' );
  const update = ( shape: Shape3 ): void => { readout.string = `selected: ${shape}`; };
  shapeProperty.link( update );

  const panel = new VBox( { spacing: 22, align: 'center', children: [ group, readout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    shapeProperty.unlink( update );
    group.dispose();
    readout.dispose();
    panel.dispose();
    shapeProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
