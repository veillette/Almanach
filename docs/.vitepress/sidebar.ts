import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import type { DefaultTheme } from 'vitepress';

const DOCS_DIR = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '..' );

// Section order and display labels for the sidebar. A top-level docs/ folder
// not listed here still appears (alphabetically, after these), so adding a new
// category does not require touching this file — list it here only to control
// its position or label.
const SECTIONS: Record<string, string> = {
  'getting-started': 'Getting Started',
  'api': 'API',
  'patterns': 'Patterns',
  'styling': 'Styling',
  'accessibility': 'Accessibility',
  'meta': 'Meta'
};

const EXCLUDED_DIRS = new Set( [ '.vitepress', 'public', 'node_modules' ] );

/**
 * Builds the VitePress sidebar by scanning every top-level folder under docs/
 * and reading each page's frontmatter title. Pages sort alphabetically by
 * title within their section.
 */
export function buildSidebar(): DefaultTheme.Sidebar {
  const folders = fs.readdirSync( DOCS_DIR, { withFileTypes: true } )
    .filter( entry => entry.isDirectory() && !EXCLUDED_DIRS.has( entry.name ) )
    .map( entry => entry.name );

  const knownOrder = Object.keys( SECTIONS );
  folders.sort( ( a, b ) => {
    const ia = knownOrder.indexOf( a );
    const ib = knownOrder.indexOf( b );
    if ( ia !== -1 && ib !== -1 ) { return ia - ib; }
    if ( ia !== -1 ) { return -1; }
    if ( ib !== -1 ) { return 1; }
    return a.localeCompare( b );
  } );

  return folders.map( folder => {
    const items = collectPages( path.join( DOCS_DIR, folder ), `/${folder}` )
      .sort( ( a, b ) => ( a.text ?? '' ).localeCompare( b.text ?? '' ) );
    return {
      text: SECTIONS[ folder ] ?? folder,
      collapsed: false,
      items: items
    };
  } ).filter( section => section.items.length > 0 );
}

function collectPages( dir: string, urlPrefix: string ): DefaultTheme.SidebarItem[] {
  const items: DefaultTheme.SidebarItem[] = [];
  for ( const entry of fs.readdirSync( dir, { withFileTypes: true } ) ) {
    const fullPath = path.join( dir, entry.name );
    if ( entry.isDirectory() ) {
      items.push( ...collectPages( fullPath, `${urlPrefix}/${entry.name}` ) );
    }
    else if ( entry.name.endsWith( '.md' ) ) {
      const { data } = matter( fs.readFileSync( fullPath, 'utf-8' ) );
      const stem = entry.name.replace( /\.md$/, '' );
      items.push( {
        text: data.title ?? stem,
        link: `${urlPrefix}/${stem}`
      } );
    }
  }
  return items;
}
