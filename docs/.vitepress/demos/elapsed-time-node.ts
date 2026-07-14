import { BooleanProperty, NumberProperty, Property } from 'scenerystack/axon';
import { VBox } from 'scenerystack/scenery';
import { TextPushButton } from 'scenerystack/sun';
import { ElapsedTimeNode } from 'scenerystack/vegas';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 180;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const elapsedTimeProperty = new NumberProperty( 0 );
  const runningProperty = new BooleanProperty( true );
  const buttonLabelProperty = new Property( 'Pause' );

  const elapsedTimeNode = new ElapsedTimeNode( elapsedTimeProperty );

  const toggleButton = new TextPushButton( buttonLabelProperty, {
    baseColor: '#8FBF5B',
    listener: () => {
      runningProperty.value = !runningProperty.value;
      buttonLabelProperty.value = runningProperty.value ? 'Pause' : 'Resume';
    }
  } );

  const panel = new VBox( {
    spacing: 16,
    align: 'center',
    children: [
      elapsedTimeNode,
      toggleButton
    ]
  } );

  const intervalId = setInterval( () => {
    if ( runningProperty.value ) {
      elapsedTimeProperty.value += 1;
    }
  }, 1000 );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    clearInterval( intervalId );
    unlinkCenter();
    panel.dispose();
    elapsedTimeNode.dispose();
    toggleButton.dispose();
    elapsedTimeProperty.dispose();
    runningProperty.dispose();
    buttonLabelProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
