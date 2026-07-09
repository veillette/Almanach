import { Property } from 'scenerystack/axon';
import { Text, VBox } from 'scenerystack/scenery';
import { RectangularRadioButtonGroup, type RectangularRadioButtonGroupItem } from 'scenerystack/sun';
import { Tandem } from 'scenerystack/tandem';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 160;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  type Shape = 'circle' | 'square' | 'triangle';
  const shapeProperty = new Property<Shape>( 'circle' );

  const readout = new Text( 'Selected: circle' );

  const items: RectangularRadioButtonGroupItem<Shape>[] = [
    { value: 'circle', createNode: () => new Text( 'Circle' ) },
    { value: 'square', createNode: () => new Text( 'Square' ) },
    { value: 'triangle', createNode: () => new Text( 'Triangle' ) }
  ];

  const radioButtonGroup = new RectangularRadioButtonGroup( shapeProperty, items, {
    orientation: 'horizontal',
    tandem: Tandem.OPTIONAL
  } );

  const panel = new VBox( {
    spacing: 14,
    align: 'center',
    children: [
      readout,
      radioButtonGroup
    ]
  } );

  const unlinkReadout = shapeProperty.link( value => {
    readout.string = `Selected: ${value}`;
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    unlinkReadout();
    panel.dispose();
    radioButtonGroup.dispose();
    shapeProperty.dispose();
    readout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
