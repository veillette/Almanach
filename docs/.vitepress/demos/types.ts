import type { Node } from 'scenerystack/scenery';

export type DemoDispose = () => void;

export type DemoFactory = ( rootNode: Node ) => DemoDispose;

export type DemoModule = {
  createDemo: DemoFactory;
  width?: number;
  height?: number;
};

export type DemoId =
  | 'rectangular-push-button'
  | 'hslider'
  | 'checkbox'
  | 'reset-all-button'
  | 'number-control'
  | 'v-slider'
  | 'toggle-switch'
  | 'radio-button-group'
  | 'panel'
  | 'accordion-box'
  | 'text-push-button'
  | 'number-spinner'
  | 'thermometer-node'
  | 'face-node'
  | 'arrow-node'
  | 'level-selection-button'
  | 'score-display-number-and-star'
  | 'elapsed-time-node'
  | 'line-plot'
  | 'bar-plot'
  | 'molecule-node'
  | 'combo-box'
  | 'on-off-switch'
  | 'number-picker'
  | 'gauge-node'
  | 'faucet-node'
  | 'heater-cooler-node';
