import { Range } from 'scenerystack/dot';
import { Stopwatch, StopwatchNode } from 'scenerystack/scenery-phet';
import { Node } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const stopwatch = new Stopwatch( {
    timePropertyOptions: { range: new Range( 0, 100 ) },
    isVisible: true
  } );

  const stopwatchNode = new StopwatchNode( stopwatch );

  // A standalone demo has no sim loop, so advance the stopwatch here while it is running.
  const intervalId = setInterval( () => {
    if ( stopwatch.isRunningProperty.value ) {
      stopwatch.step( 0.1 );
    }
  }, 100 );

  const container = new Node( { children: [ stopwatchNode ] } );

  rootNode.addChild( container );
  const unlinkCenter = centerInDisplay( container, width, height );

  return () => {
    clearInterval( intervalId );
    unlinkCenter();
    stopwatchNode.dispose();
    container.dispose();
    stopwatch.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
