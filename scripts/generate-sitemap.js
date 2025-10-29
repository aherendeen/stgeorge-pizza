#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Simple sitemap generator for static routes
const root = process.cwd();
const publicDir = path.join(root, 'public');
const outFile = path.join(publicDir, 'sitemap.xml');

// Read site domain from src/data/config.ts by simple string match
const configPath = path.join(root, 'src', 'data', 'config.ts');
let siteHost = 'st-george-pizza.vercel.app';
try {
  const cfg = fs.readFileSync(configPath, 'utf8');
  const m = cfg.match(/export const siteDomain = \s*"([^"]+)"/);
  if (m) siteHost = m[1];
} catch (e) {
  // ignore and use default
}

// Collect routes from src/pages and menu data
const pagesDir = path.join(root, 'src', 'pages');
const manualPaths = [];
const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.astro') || f.endsWith('.mdx'));
for (const f of pageFiles) {
  if (f === '404.astro') continue;
  const name = f.replace(/\.(astro|mdx)$/, '');
  const url = name === 'index' ? '/' : `/${name}`;
  manualPaths.push(url);
}

// Add menu entries
try {
  const menus = fs.readFileSync(path.join(root, 'src', 'data', 'menus.js'), 'utf8');
  const matches = [...menus.matchAll(/url:\s*"([^"]+)"/g)];
  for (const m of matches) {
    if (!manualPaths.includes(m[1])) manualPaths.push(m[1]);
  }
} catch (e) {
  // ignore
}

// Deduplicate and format
const urls = Array.from(new Set(manualPaths)).filter(Boolean).sort();

const xmlItems = urls.map(u => `  <url>\n    <loc>https://${siteHost}${u}</loc>\n  </url>`).join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlItems}\n</urlset>`;

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(outFile, xml, 'utf8');
console.log(`Wrote sitemap with ${urls.length} entries to ${outFile}`);
