#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const outFile = path.join(publicDir, 'robots.txt');

const env = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';
const hostDefault = 'st-george-pizza.vercel.app';

let host = hostDefault;
try {
  const cfg = fs.readFileSync(path.join(root, 'src', 'data', 'config.ts'), 'utf8');
  const m = cfg.match(/export const siteDomain = \s*"([^"]+)"/);
  if (m) host = m[1];
} catch (e) {}

const productionRobots = `# robots.txt for ${host}\nUser-agent: *\nAllow: /\n\nSitemap: https://${host}/sitemap.xml\n`;
const disallowAll = `# robots.txt (auto-generated for non-production environment: ${env})\nUser-agent: *\nDisallow: /\n`;

const content = env === 'production' ? productionRobots : disallowAll;

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(outFile, content, 'utf8');
console.log(`Wrote robots.txt for environment '${env}' to ${outFile}`);
