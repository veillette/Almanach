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
  'arrow-node': () => import( './arrow-node.js' )
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
