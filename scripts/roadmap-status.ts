/**
 * Cross-references docs/meta/roadmap.manifest.json against the real docs/
 * tree and prints a progress report: Phase 1's fixed page list (built vs.
 * missing, broken down by frontmatter status) and Phase 2's per-category/
 * library targets (how many pages already exist there). Nothing here is
 * hand-maintained — it's read straight from the manifest and real files.
 * Run via `npm run roadmap:status`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = path.resolve( path.dirname( fileURLToPath( import.meta.url ) ), '..' );
const DOCS_DIR = path.join( ROOT, 'docs' );
const MANIFEST_PATH = path.join( DOCS_DIR, 'meta', 'roadmap.manifest.json' );

type Phase1Page = { category: string; library?: string; path: string; title: string };
type Phase2Target = { category: string; library?: string; confidence: string; targetCount: number; candidates: string[] };
type Manifest = {
  phase1: { pages: Phase1Page[] };
  phase2: { targets: Phase2Target[] };
};

const manifest: Manifest = JSON.parse( fs.readFileSync( MANIFEST_PATH, 'utf-8' ) );

function readStatus( relativePath: string ): string {
  const fullPath = path.join( DOCS_DIR, relativePath );
  if ( !fs.existsSync( fullPath ) ) { return 'missing'; }
  const { data } = matter( fs.readFileSync( fullPath, 'utf-8' ) );
  return typeof data.status === 'string' ? data.status : 'unknown';
}

function countExisting( category: string, library?: string ): number {
  const dir = library ? path.join( DOCS_DIR, category, library ) : path.join( DOCS_DIR, category );
  if ( !fs.existsSync( dir ) ) { return 0; }
  return fs.readdirSync( dir ).filter( name => name.endsWith( '.md' ) ).length;
}

// ---------- Phase 1: fixed manifest ----------
console.log( '=== Phase 1: core coverage (fixed manifest) ===\n' );

const statusCounts: Record<string, number> = {};
for ( const page of manifest.phase1.pages ) {
  const status = readStatus( page.path );
  statusCounts[ status ] = ( statusCounts[ status ] ?? 0 ) + 1;
}

const total1 = manifest.phase1.pages.length;
const built1 = total1 - ( statusCounts[ 'missing' ] ?? 0 );
console.log( `${built1}/${total1} built` );
for ( const [ status, count ] of Object.entries( statusCounts ).sort( ( a, b ) => a[ 0 ].localeCompare( b[ 0 ] ) ) ) {
  console.log( `  ${status}: ${count}` );
}

const missing = manifest.phase1.pages.filter( page => readStatus( page.path ) === 'missing' );
if ( missing.length > 0 ) {
  console.log( `\nUnclaimed (${missing.length}):` );
  for ( const page of missing ) {
    console.log( `  [ ] docs/${page.path}  (${page.title})` );
  }
}

// ---------- Phase 2: per-category/library targets ----------
console.log( '\n=== Phase 2: deep coverage (per-category/library targets) ===\n' );

let totalPhase2Target = 0;
for ( const target of manifest.phase2.targets ) {
  const existing = countExisting( target.category, target.library );
  const label = target.library ? `${target.category}/${target.library}` : target.category;
  totalPhase2Target += target.targetCount;
  console.log( `${label.padEnd( 28 )} existing: ${String( existing ).padStart( 3 )}   phase2 target: +${String( target.targetCount ).padStart( 3 )}   confidence: ${target.confidence}` );
}

console.log( `\nPhase 2 total target: ${totalPhase2Target} additional pages` );
