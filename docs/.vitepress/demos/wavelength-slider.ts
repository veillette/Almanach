import { NumberProperty } from 'scenerystack/axon';
import { WavelengthNumberControl } from 'scenerystack/scenery-phet';
import { Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 240;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const wavelengthProperty = new NumberProperty( 500 );

  // A NumberControl whose slider track shows the visible spectrum.
  const control = new WavelengthNumberControl( wavelengthProperty, {
    title: 'Wavelength'
  } );

  const readout = new Text( '' );
  const update = ( wavelength: number ): void => {
    readout.string = `${Math.round( wavelength )} nm`;
  };
  wavelengthProperty.link( update );

  const panel = new VBox( { spacing: 16, align: 'center', children: [ control, readout ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    wavelengthProperty.unlink( update );
    control.dispose();
    readout.dispose();
    panel.dispose();
    wavelengthProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
