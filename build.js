#!/usr/bin/env node
/**
 * build.js — AI Architecture Advisor
 *
 * Bundles all modular source files into a single self-contained dist/index.html
 * that works when opened from the desktop, GitHub Pages, or any static host.
 *
 * Usage:
 *   node build.js
 *
 * Output:
 *   dist/index.html   ← upload this file to GitHub as index.html
 *
 * Workflow:
 *   1. Edit source files in assets/ as normal
 *   2. Run:  node build.js
 *   3. Deploy dist/index.html to GitHub
 */

const fs   = require('fs');
const path = require('path');

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const ROOT    = __dirname;
const DIST    = path.join(ROOT, 'dist');
const OUT     = path.join(DIST, 'index.html');

const CSS_FILE = 'assets/css/styles.css';

// JS files in exact load order (mirrors the <script> tags in index.html)
const JS_FILES = [
  'assets/data/scoring.js',
  'assets/data/financial.js',
  'assets/data/scenarios.js',
  'assets/data/demo-blueprint.js',
  'assets/agents/agent-01-discovery.js',
  'assets/agents/agent-02-outcome.js',
  'assets/agents/agent-03-capability.js',
  'assets/agents/agent-04-architecture.js',
  'assets/agents/agent-05-data-platform.js',
  'assets/agents/agent-06-governance.js',
  'assets/agents/agent-07-roadmap.js',
  'assets/agents/agent-08-value.js',
  'assets/data/agents.js',
  'assets/js/api-client.js',
  'assets/js/wizard.js',
  'assets/js/pipeline.js',
  'assets/js/results.js',
  'assets/js/app.js',
];

// ─── BUILD ───────────────────────────────────────────────────────────────────

function read(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf8');
}

function build() {
  // Create dist/ if needed
  if (!fs.existsSync(DIST)) fs.mkdirSync(DIST);

  let html = read('index.html');

  // 1. Inline CSS — replace <link> with <style>
  const css = read(CSS_FILE);
  html = html.replace(
    `<link rel="stylesheet" href="${CSS_FILE}">`,
    `<style>\n${css}\n</style>`
  );

  // 2. Inline JS — replace all <script src="..."> blocks with one <script>
  // Find the DATA comment block through to </body>
  const scriptBlockStart = html.indexOf('<!-- ─── DATA');
  const bodyClose        = html.indexOf('</body>');

  if (scriptBlockStart === -1 || bodyClose === -1) {
    console.error('✗ Could not find script block markers in index.html');
    process.exit(1);
  }

  // Build combined JS
  let combinedJs = JS_FILES.map(f => {
    const name    = path.basename(f);
    const content = read(f);
    return `\n/* ── ${name} ── */\n${content}`;
  }).join('\n');

  // Replace the external script block with inline
  html = html.slice(0, scriptBlockStart)
       + `<script>${combinedJs}\n</script>\n`
       + html.slice(bodyClose);  // includes </body></html>

  // 3. Write output
  fs.writeFileSync(OUT, html, 'utf8');

  const kb = Math.round(fs.statSync(OUT).size / 1024);
  console.log(`✓ Built: dist/index.html (${kb} KB)`);
  console.log(`  → Upload dist/index.html to GitHub as index.html`);
}

build();
