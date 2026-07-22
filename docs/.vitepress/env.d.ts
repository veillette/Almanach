// Ambient declarations for non-TypeScript modules imported by the VitePress
// theme (Vue single-file components and CSS side-effect imports).

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

declare module '*.css';
