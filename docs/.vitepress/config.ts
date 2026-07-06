import { defineConfig } from 'vitepress';
import { buildSidebar } from './sidebar.js';

// Served from https://veillette.github.io/Almanach/ (project pages).
// Change this single constant if the site moves to a custom domain.
export const BASE = '/Almanach/';

export default defineConfig( {
  title: 'Almanach',
  description: 'A SceneryStack knowledge base: API guides, software patterns, and conventions, readable by humans and LLM agents alike.',
  base: BASE,
  cleanUrls: true,
  lastUpdated: true,

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started/what-is-scenerystack' },
      { text: 'Guides', link: '/guides/scenery-basics' },
      { text: 'Examples', link: '/examples/demo-simulation-walkthrough' }
    ],

    sidebar: buildSidebar(),

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/veillette/Almanach' }
    ],

    outline: 'deep',

    footer: {
      message: 'Machine-readable indexes: <a href="/Almanach/llms.txt">llms.txt</a> · <a href="/Almanach/llms-full.txt">llms-full.txt</a> · <a href="/Almanach/manifest.json">manifest.json</a>'
    }
  }
} );
