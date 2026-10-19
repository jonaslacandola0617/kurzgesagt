// usage: node capture.mjs <repoRoot> <outDir> [frame,frame,...]   (no list = all frames); serves the repo so fonts load from assets/
import {chromium} from '/opt/npm-tools/node_modules/playwright/index.mjs';
import fs from 'fs'; import http from 'http'; import path from 'path'; import crypto from 'crypto';
const [dir,out,list]=process.argv.slice(2); fs.mkdirSync(out,{recursive:true});
const srv=http.createServer((rq,rs)=>{fs.readFile(path.join(dir,decodeURIComponent(rq.url.split('?')[0])),(e,d)=>{if(e){rs.writeHead(404);rs.end();}else rs.end(d)})}).listen(8766);
const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
await pg.goto('http://127.0.0.1:8766/qa/style-test-oklo-20261019/index.html'); const N=await pg.evaluate(()=>window.ready);
const frames=list?list.split(',').map(Number):[...Array(N).keys()]; const log=[];
for(const i of frames){const st=await pg.evaluate(i=>window.renderFrame(i),i);const buf=await pg.locator('#c').screenshot({type:'png'});fs.writeFileSync(path.join(out,`f${String(i).padStart(5,'0')}.png`),buf);log.push({i,st,h:crypto.createHash('sha256').update(buf).digest('hex').slice(0,16)});}
fs.writeFileSync(path.join(out,'capture-log.json'),JSON.stringify({N,errs,log}));
console.log(JSON.stringify({N,captured:frames.length,errors:errs,distinct:new Set(log.map(l=>l.h)).size}));
await b.close(); srv.close();
