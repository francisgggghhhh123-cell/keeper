import { writeFile, mkdir, rm } from 'node:fs/promises';

// Downloads the latin subsets of the site's two typefaces so they can be self-hosted.
const dir = 'dist/assets/fonts';
await rm(dir, {recursive: true, force: true});
await mkdir(dir, {recursive: true});
const url = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&family=IBM+Plex+Mono:wght@400;500&display=swap';
const response = await fetch(url, {headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}});
if (!response.ok) throw new Error(`Font CSS ${response.status}`);
const css = await response.text();
const blocks = [...css.matchAll(/\/\* (.*?) \*\/\s*(@font-face\s*\{[\s\S]*?\})/g)].filter(m => m[1] === 'latin');
let output = '';
const downloaded = new Map();
for (const [, , block] of blocks) {
  const remote = block.match(/url\((.*?)\)/)[1];
  const family = block.match(/font-family: '(.*?)'/)[1].toLowerCase().replace(/\s+/g, '-');
  const weight = block.match(/font-weight: (.*?);/)[1].replace(/\s+/g, '-');
  let name = downloaded.get(remote);
  if (!name) {
    name = `${family}-${weight}.woff2`;
    const font = await fetch(remote);
    if (!font.ok) throw new Error(`Font ${font.status}`);
    await writeFile(`${dir}/${name}`, Buffer.from(await font.arrayBuffer()));
    downloaded.set(remote, name);
  }
  output += block.replace(remote, `./fonts/${name}`) + '\n';
}
await writeFile('dist/assets/fonts.css', output);
console.log(`Saved ${downloaded.size} font files.`);
for (const family of ['bricolagegrotesque', 'ibmplexmono']) {
  const license = await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`);
  if (!license.ok) throw new Error(`Font license ${license.status}`);
  await writeFile(`${dir}/${family}-LICENSE.txt`, await license.text());
}
