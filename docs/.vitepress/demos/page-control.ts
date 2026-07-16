import { NumberProperty, Property } from 'scenerystack/axon';
import { ArrowButton } from 'scenerystack/sun';
import { PageControl } from 'scenerystack/sun';
import { HBox, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 160;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const numberOfPages = 5;
  const pageNumberProperty = new NumberProperty( 0 );
  const numberOfPagesProperty = new Property( numberOfPages );

  const pageControl = new PageControl( pageNumberProperty, numberOfPagesProperty, {
    interactive: true,
    orientation: 'horizontal'
  } );

  const previousButton = new ArrowButton( 'left', () => {
    pageNumberProperty.value = Math.max( 0, pageNumberProperty.value - 1 );
  } );
  const nextButton = new ArrowButton( 'right', () => {
    pageNumberProperty.value = Math.min( numberOfPages - 1, pageNumberProperty.value + 1 );
  } );

  const readout = new Text( '' );
  const updateReadout = ( page: number ): void => {
    readout.string = `page ${page + 1} of ${numberOfPages}`;
  };
  pageNumberProperty.link( updateReadout );

  const controls = new HBox( {
    spacing: 20,
    children: [ previousButton, pageControl, nextButton ]
  } );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [ controls, readout ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    pageNumberProperty.unlink( updateReadout );
    previousButton.dispose();
    nextButton.dispose();
    pageControl.dispose();
    controls.dispose();
    readout.dispose();
    panel.dispose();
    pageNumberProperty.dispose();
    numberOfPagesProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
