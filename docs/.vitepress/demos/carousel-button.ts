import { NumberProperty } from 'scenerystack/axon';
import { CarouselButton } from 'scenerystack/sun';
import { HBox, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 300;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const indexProperty = new NumberProperty( 0 );

  const upButton = new CarouselButton( {
    arrowDirection: 'up',
    baseColor: '#e0e0e0',
    listener: () => { indexProperty.value += 1; }
  } );
  const downButton = new CarouselButton( {
    arrowDirection: 'down',
    baseColor: '#e0e0e0',
    listener: () => { indexProperty.value -= 1; }
  } );

  const readout = new Text( '' );
  const update = ( index: number ): void => { readout.string = `index: ${index}`; };
  indexProperty.link( update );

  const buttons = new HBox( { spacing: 16, children: [ upButton, downButton ] } );
  const panel = new VBox( { spacing: 20, align: 'center', children: [ buttons, readout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    indexProperty.unlink( update );
    upButton.dispose();
    downButton.dispose();
    buttons.dispose();
    readout.dispose();
    panel.dispose();
    indexProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
