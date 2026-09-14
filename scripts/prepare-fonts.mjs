import { writeFile, mkdir } from 'node:fs/promises';
await mkdir('dist/assets/fonts', {recursive: true});
const url = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@400;500;600&display=swap';
const response = await fetch(url, {headers: {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}});
if (!response.ok) throw new Error(`Font CSS ${response.status}`);
const css = await response.text();
const blocks = [...css.matchAll(/(?:\/\* (.*?) \*\/\s*)?(@font-face\s*\{[\s\S]*?\})/g)];
const kept = blocks.filter(m=>!m[1] || m[1]==='latin');
let output = '';
const downloaded = new Map();
for(const match of kept){
  let block = match[2];
  const remote = block.match(/url\((.*?)\)/)[1];
  let name = downloaded.get(remote);
  if(!name){
    name = `font-${downloaded.size}.${remote.includes('.woff2')?'woff2':'ttf'}`;
    const font = await fetch(remote);
    if(!font.ok) throw new Error(`Font ${font.status}`);
    await writeFile(`dist/assets/fonts/${name}`,Buffer.from(await font.arrayBuffer()));
    downloaded.set(remote,name);
  }
  output += block.replace(remote,`./fonts/${name}`)+'\n';
}
await writeFile('dist/assets/fonts.css',output);
console.log(`Saved ${downloaded.size} local font files.`);
for(const family of ['cormorantgaramond','dmsans']){
  const license=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`);
  if(!license.ok)throw new Error(`Font license ${license.status}`);
  await writeFile(`dist/assets/fonts/${family}-LICENSE.txt`,await license.text());
}
