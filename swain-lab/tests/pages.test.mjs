import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ITEMS} from '../dist/engine.js';

const root=fileURLToPath(new URL('../dist/',import.meta.url));
const read=name=>readFileSync(path.join(root,name),'utf8');
// Exact casing matters on Pages/Linux, even when development happens on Windows.
function checkFile(relative){
 let dir=root;
 for(const part of relative.split('/')){
  assert.ok(readdirSync(dir).includes(part),`Missing or wrong-case path: ${relative}`);
  dir=path.join(dir,part);
 }
}
function checkURL(reference,from='index.html'){
 if(/^(?:https?:|data:|#)/.test(reference))return;
 const base=new URL(from,'https://example.github.io/LeagueSolver/');
 const resolved=new URL(reference,base);
 assert.ok(resolved.pathname.startsWith('/LeagueSolver/'),`Escapes project subdirectory: ${reference}`);
 checkFile(decodeURIComponent(resolved.pathname.slice('/LeagueSolver/'.length)));
}

test('HTML, CSS, module imports and JSON fetches work under /LeagueSolver/',()=>{
 for(const [,url] of read('index.html').matchAll(/(?:href|src)="([^"]+)"/g))checkURL(url);
 for(const name of ['style.css','responsive.css'])for(const [,url] of read(name).matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g))checkURL(url,name);
 for(const name of ['app.js','engine.js']){
  for(const [,url] of read(name).matchAll(/from\s+['"]([^'"]+)['"]/g))checkURL(url,name);
  for(const [,url] of read(name).matchAll(/fetch\(['"]([^'"]+)['"]\)/g))checkURL(url,name);
 }
 checkFile('.nojekyll');
});

test('every selectable item and recipe component has a bundled icon',()=>{
 const data=JSON.parse(read('data/items.json')).data,seen=new Set();
 function visit(id){if(seen.has(id))return;seen.add(id);checkFile(`assets/${id}.png`);for(const child of data[id].from||[])visit(child);}
 for(const item of ITEMS)visit(item.id);
});
