import { Property } from 'scenerystack/axon';
import { Text, VBox } from 'scenerystack/scenery';
import { ToggleSwitch } from 'scenerystack/sun';
import { Tandem } from 'scenerystack/tandem';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 140;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  type Units = 'metric' | 'imperial';
  const unitsProperty = new Property<Units>( 'metric' );

  const readout = new Text( 'Units: metric' );

  const toggleSwitch = new ToggleSwitch( unitsProperty, 'metric', 'imperial', {
    tandem: Tandem.OPTIONAL
  } );

  const panel = new VBox( {
    spacing: 12,
    align: 'center',
    children: [
      readout,
      toggleSwitch
    ]
  } );

  const unlinkReadout = unitsProperty.link( value => {
    readout.string = `Units: ${value}`;
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    unlinkReadout();
    panel.dispose();
    toggleSwitch.dispose();
    unitsProperty.dispose();
    readout.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
