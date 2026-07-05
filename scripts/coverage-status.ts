/**
 * Reports live coverage stats read straight from docs/: page counts per
 * category/library, frontmatter `status` breakdown, and cross-link gaps
 * (missing prerequisites/related/sourceRefs). Nothing here is hand-maintained
 * — it's computed from the real files every time. Run via `npm run coverage:status`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '..' );
const DOCS_DIR = path.join( ROOT, 'docs' );

type PageMeta = {
  relPath: string;
  category: string;
  library?: string;
  status: string;
  hasPrerequisites: boolean;
  hasRelated: boolean;
  hasSourceRefs: boolean;
};

function walk( dir: string, out: string[] = [] ): string[] {
  for ( const name of fs.readdirSync( dir ) ) {
    const full = path.join( dir, name );
    if ( fs.statSync( full ).isDirectory() ) { walk( full, out ); }
    else if ( name.endsWith( '.md' ) ) { out.push( full ); }
  }
  return out;
}

function collectAllPages(): PageMeta[] {
  return walk( DOCS_DIR )
    .filter( full => !full.includes( `${path.sep}.vitepress${path.sep}` ) )
    .filter( full => path.relative( DOCS_DIR, full ) !== 'index.md' ) // VitePress homepage, not a content page
    .map( full => {
      const relPath = path.relative( DOCS_DIR, full );
      const { data } = matter( fs.readFileSync( full, 'utf-8' ) );
      const segments = relPath.split( path.sep );
      const category = segments[ 0 ];
      const library = category === 'api' && segments.length > 2 ? segments[ 1 ] : undefined;
      return {
        relPath,
        category,
        library,
        status: typeof data.status === 'string' ? data.status : 'unknown',
        hasPrerequisites: Array.isArray( data.prerequisites ) && data.prerequisites.length > 0,
        hasRelated: Array.isArray( data.related ) && data.related.length > 0,
        hasSourceRefs: Array.isArray( data.sourceRefs ) && data.sourceRefs.length > 0,
      };
    } );
}

const allPages = collectAllPages();

// ---------- Page counts per category/library ----------
console.log( '=== Page counts ===\n' );

const byCategory = new Map<string, PageMeta[]>();
for ( const page of allPages ) {
  const list = byCategory.get( page.category ) ?? [];
  list.push( page );
  byCategory.set( page.category, list );
}

for ( const [ category, pages ] of Array.from( byCategory.entries() ).sort( ( a, b ) => a[ 0 ].localeCompare( b[ 0 ] ) ) ) {
  if ( category === 'api' ) {
    const byLibrary = new Map<string, number>();
    for ( const page of pages ) {
      const lib = page.library ?? '(uncategorized)';
      byLibrary.set( lib, ( byLibrary.get( lib ) ?? 0 ) + 1 );
    }
    console.log( `api (${pages.length} total)` );
    for ( const [ lib, count ] of Array.from( byLibrary.entries() ).sort( ( a, b ) => a[ 0 ].localeCompare( b[ 0 ] ) ) ) {
      console.log( `  api/${lib.padEnd( 20 )} ${count}` );
    }
  }
  else {
    console.log( `${category.padEnd( 24 )} ${pages.length}` );
  }
}

console.log( `\n${allPages.length} total pages` );

// ---------- Status breakdown ----------
console.log( '\n=== Status breakdown ===\n' );

const statusCounts: Record<string, number> = {};
for ( const page of allPages ) {
  statusCounts[ page.status ] = ( statusCounts[ page.status ] ?? 0 ) + 1;
}
for ( const [ status, count ] of Object.entries( statusCounts ).sort( ( a, b ) => a[ 0 ].localeCompare( b[ 0 ] ) ) ) {
  console.log( `  ${status}: ${count}` );
}

const draftPages = allPages.filter( p => p.status === 'draft' || p.status === 'stub' );
if ( draftPages.length > 0 ) {
  console.log( `\nNot yet complete/verified (${draftPages.length}):` );
  for ( const page of draftPages ) {
    console.log( `  [ ] docs/${page.relPath}  (${page.status})` );
  }
}

// ---------- Cross-link coverage ----------
console.log( '\n=== Cross-link coverage ===\n' );

const missingPrereqs = allPages.filter( p => !p.hasPrerequisites );
const missingRelated = allPages.filter( p => !p.hasRelated );
const missingSourceRefs = allPages.filter( p => !p.hasSourceRefs );
console.log( `  missing prerequisites: ${missingPrereqs.length}/${allPages.length}` );
console.log( `  missing related:       ${missingRelated.length}/${allPages.length}` );
console.log( `  missing sourceRefs:    ${missingSourceRefs.length}/${allPages.length}` );

console.log( `\nGoal: drive 'complete' -> 'verified' via independent source-check, and shrink the cross-link gaps above. See docs/meta/roadmap.md#open-work.` );
