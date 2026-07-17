import { NumberProperty, StringProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { ValueGaugeNode } from 'scenerystack/scenery-phet';
import { VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 360;
export const height = 320;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const range = new Range( 0, 100 );
  const valueProperty = new NumberProperty( 40, { range: range } );
  const labelProperty = new StringProperty( 'kPa' );

  const gauge = new ValueGaugeNode( valueProperty, labelProperty, range, {
    radius: 90
  } );

  const slider = new HSlider( valueProperty, range, { trackSize: { width: 200, height: 5 } } );

  const panel = new VBox( { spacing: 22, align: 'center', children: [ gauge, slider ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    slider.dispose();
    gauge.dispose();
    panel.dispose();
    labelProperty.dispose();
    valueProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
