import {readFile, access} from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root = path.resolve('dist');
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate HTML id');
const references = [...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map(m => m[1]);
for (const ref of references) {
  if (ref.startsWith('#')) { if (!ids.includes(ref.slice(1))) throw new Error(`Broken anchor ${ref}`); continue; }
  // /_vercel/ is served by Vercel itself (Web Analytics), so it isn't in dist/.
  if (/^(https?:|data:|mailto:|\/_vercel\/)/.test(ref)) continue;
  await access(path.join(root, ref));
}
for (const file of ['style.css', 'assets/fonts.css']) {
  const css = (await readFile(path.join(root, file), 'utf8')).replace(/url\("data:[\s\S]*?"\)/g, '');
  for (const m of css.matchAll(/url\((?:["']?)([^\s)'";]+)(?:["']?)\)/g)) {
    if (!m[1].startsWith('data:')) await access(path.resolve(root, path.dirname(file), m[1]));
  }
}
const images = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
if (images.some(i => !i.includes('alt="') || !i.includes('width="') || !i.includes('height="'))) throw new Error('Image missing alt, width or height');
const required = ['keeper.jpg', 'prototype.jpg', 'nationals.jpg', 'booth.jpg', 'team.jpg', 'crest.png', 'art/madhubani.jpg', 'art/warli.jpg', 'art/pattachitra.jpg', 'art/tanjore.jpg', 'art/kalamkari.jpg'];
for (const asset of required) if (!html.includes(`assets/${asset}`)) throw new Error(`Required asset missing: ${asset}`);
execFileSync(process.execPath, ['--check', 'dist/script.js']);
console.log(`Validated ${ids.length} ids, ${images.length} images, local references and script syntax.`);
