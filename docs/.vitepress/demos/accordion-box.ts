import { VBox, Text } from 'scenerystack/scenery';
import { AccordionBox } from 'scenerystack/sun';
import { Tandem } from 'scenerystack/tandem';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 400;
export const height = 200;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const advancedContent = new VBox( {
    spacing: 6,
    children: [
      new Text( 'Precision: High' ),
      new Text( 'Quality: Maximum' ),
      new Text( 'Frame Rate: 60 fps' )
    ]
  } );

  const accordionBox = new AccordionBox( advancedContent, {
    titleNode: new Text( 'Advanced Settings' ),
    expandedDefaultValue: false,
    tandem: Tandem.OPTIONAL
  } );

  rootNode.addChild( accordionBox );
  const unlinkCenter = centerInDisplay( accordionBox, width, height );

  return () => {
    unlinkCenter();
    accordionBox.dispose();
    advancedContent.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
