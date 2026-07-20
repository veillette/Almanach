import { BooleanProperty } from 'scenerystack/axon';
import { BooleanRectangularToggleButton } from 'scenerystack/sun';
import { Path, Text, VBox } from 'scenerystack/scenery';
import { Shape } from 'scenerystack/kite';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 300;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const isPlayingProperty = new BooleanProperty( false );

  // A simple triangular "play" glyph and a two-bar "pause" glyph, built by hand.
  const playShape = new Shape().moveTo( -8, -10 ).lineTo( 10, 0 ).lineTo( -8, 10 ).close();
  const pauseShape = new Shape()
    .rect( -9, -10, 6, 20 )
    .rect( 3, -10, 6, 20 );

  // Swaps between the pause icon (isPlayingProperty === true) and the play icon (false).
  const button = new BooleanRectangularToggleButton(
    isPlayingProperty,
    new Path( pauseShape, { fill: 'black' } ), // shown when isPlayingProperty === true
    new Path( playShape, { fill: 'black' } ),  // shown when isPlayingProperty === false
    { baseColor: 'yellow' }
  );

  const readout = new Text( '' );
  const update = ( isPlaying: boolean ): void => { readout.string = isPlaying ? 'playing' : 'paused'; };
  isPlayingProperty.link( update );

  const panel = new VBox( { spacing: 20, align: 'center', children: [ button, readout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    isPlayingProperty.unlink( update );
    button.dispose();
    readout.dispose();
    panel.dispose();
    isPlayingProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
