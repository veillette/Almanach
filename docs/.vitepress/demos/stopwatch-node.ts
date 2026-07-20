import { Property } from 'scenerystack/axon';
import { Bounds2, Range, Vector2 } from 'scenerystack/dot';
import { Stopwatch, StopwatchNode } from 'scenerystack/scenery-phet';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const dragBoundsProperty = new Property( new Bounds2( 0, 0, width, height ) );

  const stopwatch = new Stopwatch( {
    timePropertyOptions: { range: new Range( 0, 100 ) },
    isVisible: true
  } );

  const stopwatchNode = new StopwatchNode( stopwatch, {
    dragBoundsProperty: dragBoundsProperty
  } );

  // Position is the upper-left; center the stopwatch in the demo canvas.
  stopwatch.positionProperty.value = new Vector2(
    ( width - stopwatchNode.width ) / 2,
    ( height - stopwatchNode.height ) / 2
  );

  // A standalone demo has no sim loop, so advance the stopwatch here while it is running.
  const intervalId = setInterval( () => {
    if ( stopwatch.isRunningProperty.value ) {
      stopwatch.step( 0.1 );
    }
  }, 100 );

  rootNode.addChild( stopwatchNode );

  return () => {
    clearInterval( intervalId );
    stopwatchNode.dispose();
    dragBoundsProperty.dispose();
    stopwatch.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
