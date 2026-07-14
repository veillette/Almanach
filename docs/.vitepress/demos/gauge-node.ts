import { NumberProperty, StringProperty } from 'scenerystack/axon';
import { Range } from 'scenerystack/dot';
import { HSlider } from 'scenerystack/sun';
import { GaugeNode } from 'scenerystack/scenery-phet';
import { VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 260;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const speedRange = new Range( 0, 100 );
  const speedProperty = new NumberProperty( 30, { range: speedRange } );
  const labelProperty = new StringProperty( 'm/s' );

  const gaugeNode = new GaugeNode( speedProperty, labelProperty, speedRange, {
    radius: 90
  } );

  const slider = new HSlider( speedProperty, speedRange, {
    trackSize: { width: 200, height: 5 }
  } );

  const panel = new VBox( {
    spacing: 14,
    align: 'center',
    children: [
      gaugeNode,
      slider
    ]
  } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    panel.dispose();
    gaugeNode.dispose();
    slider.dispose();
    speedProperty.dispose();
    labelProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
