import type { DemoId, DemoModule } from './types.js';

type DemoLoader = () => Promise<DemoModule>;

export const DEMO_REGISTRY: Record<DemoId, DemoLoader> = {
  'rectangular-push-button': () => import( './rectangular-push-button.js' ),
  'hslider': () => import( './hslider.js' ),
  'checkbox': () => import( './checkbox.js' ),
  'reset-all-button': () => import( './reset-all-button.js' ),
  'number-control': () => import( './number-control.js' ),
  'v-slider': () => import( './v-slider.js' ),
  'toggle-switch': () => import( './toggle-switch.js' ),
  'radio-button-group': () => import( './radio-button-group.js' ),
  'panel': () => import( './panel.js' ),
  'accordion-box': () => import( './accordion-box.js' ),
  'text-push-button': () => import( './text-push-button.js' ),
  'number-spinner': () => import( './number-spinner.js' ),
  'thermometer-node': () => import( './thermometer-node.js' ),
  'face-node': () => import( './face-node.js' ),
  'arrow-node': () => import( './arrow-node.js' ),
  'level-selection-button': () => import( './level-selection-button.js' ),
  'score-display-number-and-star': () => import( './score-display-number-and-star.js' ),
  'elapsed-time-node': () => import( './elapsed-time-node.js' ),
  'line-plot': () => import( './line-plot.js' ),
  'bar-plot': () => import( './bar-plot.js' ),
  'molecule-node': () => import( './molecule-node.js' ),
  'combo-box': () => import( './combo-box.js' ),
  'on-off-switch': () => import( './on-off-switch.js' ),
  'number-picker': () => import( './number-picker.js' ),
  'gauge-node': () => import( './gauge-node.js' ),
  'faucet-node': () => import( './faucet-node.js' ),
  'heater-cooler-node': () => import( './heater-cooler-node.js' ),
  'star-node': () => import( './star-node.js' ),
  'number-display': () => import( './number-display.js' ),
  'stopwatch-node': () => import( './stopwatch-node.js' ),
  'ruler-node': () => import( './ruler-node.js' ),
  'protractor-node': () => import( './protractor-node.js' ),
  'bicycle-pump-node': () => import( './bicycle-pump-node.js' ),
  'light-bulb-node': () => import( './light-bulb-node.js' ),
  'eye-dropper-node': () => import( './eye-dropper-node.js' ),
  'probe-node': () => import( './probe-node.js' ),
  'handle-node': () => import( './handle-node.js' ),
  'magnifying-glass-node': () => import( './magnifying-glass-node.js' ),
  'spectrum-node': () => import( './spectrum-node.js' ),
  'stop-sign-node': () => import( './stop-sign-node.js' ),
  'x-node': () => import( './x-node.js' ),
  'triangle-node': () => import( './triangle-node.js' ),
  'fine-coarse-spinner': () => import( './fine-coarse-spinner.js' ),
  'keypad': () => import( './keypad.js' ),
  'time-control-node': () => import( './time-control-node.js' ),
  'play-pause-button': () => import( './play-pause-button.js' ),
  'info-button': () => import( './info-button.js' ),
  'close-button': () => import( './close-button.js' ),
  'eraser-button': () => import( './eraser-button.js' ),
  'carousel': () => import( './carousel.js' ),
  'page-control': () => import( './page-control.js' ),
  'arrow-button': () => import( './arrow-button.js' ),
  'aqua-radio-button-group': () => import( './aqua-radio-button-group.js' ),
  'expand-collapse-button': () => import( './expand-collapse-button.js' ),
  'slider': () => import( './slider.js' ),
  'vertical-checkbox-group': () => import( './vertical-checkbox-group.js' ),
  'ab-switch': () => import( './ab-switch.js' ),
  'scatter-plot': () => import( './scatter-plot.js' ),
  'area-plot': () => import( './area-plot.js' )
};

export const DEMO_IDS = Object.keys( DEMO_REGISTRY ) as DemoId[];

export async function loadDemo( id: DemoId ): Promise<DemoModule> {
  const loader = DEMO_REGISTRY[ id ];
  if ( !loader ) {
    throw new Error( `Unknown Scenery demo: ${id}` );
  }

  const module = await loader();
  return {
    createDemo: module.createDemo,
    width: module.width ?? 400,
    height: module.height ?? 120
  };
}
