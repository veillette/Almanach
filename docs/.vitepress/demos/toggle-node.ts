import { BooleanProperty } from 'scenerystack/axon';
import { ToggleNode, ToggleSwitch, type ToggleNodeElement } from 'scenerystack/sun';
import { Circle, Node, Rectangle, Text, VBox } from 'scenerystack/scenery';
import { centerInDisplay } from './shared/center-in-display.js';
import type { DemoModule } from './types.js';

export const width = 300;
export const height = 220;

export function createDemo( rootNode: import( 'scenerystack/scenery' ).Node ): () => void {
  const onProperty = new BooleanProperty( false );

  const elements: ToggleNodeElement<boolean>[] = [
    { value: false, createNode: () => new Rectangle( 0, 0, 60, 60, { fill: '#D9782D', cornerRadius: 6 } ) },
    { value: true, createNode: () => new Circle( 32, { fill: '#5B9BD5' } ) }
  ];
  const toggleNode = new ToggleNode<boolean>( onProperty, elements );
  // Reserve the union of both element footprints so switching does not shift layout.
  const frame = new Node( { children: [ toggleNode ], localBounds: new Rectangle( -32, -32, 64, 64 ).localBounds } );

  const label = new Text( 'show circle', { fontSize: 16 } );
  const toggle = new ToggleSwitch( onProperty, false, true );
  const control = new VBox( { spacing: 6, align: 'center', children: [ label, toggle ] } );

  const panel = new VBox( { spacing: 22, align: 'center', children: [ frame, control ] } );

  rootNode.addChild( panel );
  const unlinkCenter = centerInDisplay( panel, width, height );

  return () => {
    unlinkCenter();
    toggle.dispose();
    label.dispose();
    control.dispose();
    frame.dispose();
    toggleNode.dispose();
    panel.dispose();
    onProperty.dispose();
  };
}

const demo: DemoModule = { createDemo, width, height };
export default demo;
