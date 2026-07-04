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
  'guides': 'Guides',
  'api': 'API',
  'patterns': 'Patterns',
  'styling': 'Styling',
  'accessibility': 'Accessibility',
  'examples': 'Examples',
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
    const items = collectPages( path.join( DOCS_DIR, folder ), `/${folder}` );
    return {
      text: SECTIONS[ folder ] ?? folder,
      collapsed: false,
      items: items
    };
  } ).filter( section => section.items.length > 0 );
}

/**
 * Recursively collects pages under `dir`, sorted alphabetically. A
 * subdirectory (e.g. `api/axon/`) becomes a nested, collapsible sidebar
 * group rather than being flattened, so categories that grow large (like
 * `api/`, organized one subfolder per library) stay navigable.
 */
function collectPages( dir: string, urlPrefix: string ): DefaultTheme.SidebarItem[] {
  const files: DefaultTheme.SidebarItem[] = [];
  const groups: DefaultTheme.SidebarItem[] = [];
  for ( const entry of fs.readdirSync( dir, { withFileTypes: true } ) ) {
    const fullPath = path.join( dir, entry.name );
    if ( entry.isDirectory() ) {
      const subItems = collectPages( fullPath, `${urlPrefix}/${entry.name}` );
      if ( subItems.length > 0 ) {
        groups.push( {
          text: entry.name,
          collapsed: true,
          items: subItems
        } );
      }
    }
    else if ( entry.name.endsWith( '.md' ) ) {
      const { data } = matter( fs.readFileSync( fullPath, 'utf-8' ) );
      const stem = entry.name.replace( /\.md$/, '' );
      files.push( {
        text: data.title ?? stem,
        link: `${urlPrefix}/${stem}`
      } );
    }
  }
  files.sort( ( a, b ) => ( a.text ?? '' ).localeCompare( b.text ?? '' ) );
  groups.sort( ( a, b ) => ( a.text ?? '' ).localeCompare( b.text ?? '' ) );
  return [ ...files, ...groups ];
}
