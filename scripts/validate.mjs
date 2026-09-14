import {readFile,access,readdir} from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const root=path.resolve('dist');
const html=await readFile(path.join(root,'index.html'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
if(new Set(ids).size!==ids.length)throw new Error('Duplicate HTML id');
const references=[...html.matchAll(/\b(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
for(const ref of references){
  if(ref.startsWith('#')){if(!ids.includes(ref.slice(1)))throw new Error(`Broken anchor ${ref}`);continue;}
  if(/^(https?:|data:)/.test(ref))continue;
  await access(path.join(root,ref));
}
for(const file of ['style.css','assets/fonts.css']){
  const css=(await readFile(path.join(root,file),'utf8')).replace(/url\("data:[\s\S]*?"\)/g,'');
  for(const m of css.matchAll(/url\((?:["']?)([^\s)'";]+)(?:["']?)\)/g)){
    if(!m[1].startsWith('data:'))await access(path.resolve(root,path.dirname(file),m[1]));
  }
}
const images=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]);
if(images.some(i=>!i.includes('alt="')||!i.includes('width="')||!i.includes('height="')))throw new Error('Missing image accessibility or dimensions');
for(const required of ['keeper.jpg','prototype.jpg','nationals.jpg','booth.png','team.jpg','lisieux-school-crest.png'])if(!html.includes(required))throw new Error(`Required asset missing: ${required}`);
execFileSync(process.execPath,['--check','dist/script.js']);
console.log(`Validated ${ids.length} anchors, ${images.length} image uses, local asset references and JavaScript syntax.`);
