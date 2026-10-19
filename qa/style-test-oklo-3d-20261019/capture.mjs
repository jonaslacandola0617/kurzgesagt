// usage: node capture.mjs <repoRoot> <outDir> [frame,frame,...]   (no list = all frames); serves the repo so fonts load from assets/
import {chromium} from '/opt/npm-tools/node_modules/playwright/index.mjs';
import fs from 'fs'; import http from 'http'; import path from 'path'; import crypto from 'crypto';
const TYPES={'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.json':'application/json','.obj':'text/plain','.mtl':'text/plain','.ttf':'font/ttf'};
const [dir,out,list]=process.argv.slice(2); fs.mkdirSync(out,{recursive:true});
const srv=http.createServer((rq,rs)=>{{const f=path.join(dir,decodeURIComponent(rq.url.split('?')[0]));fs.readFile(f,(e,d)=>{if(e){rs.writeHead(404);rs.end();}else{rs.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'});rs.end(d)}})}}).listen(8767);
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']}); const pg=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
pg.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await pg.goto('http://127.0.0.1:8767/qa/style-test-oklo-3d-20261019/index.html'); await pg.waitForFunction(()=>window.ready!==undefined,null,{timeout:60000});const N=await pg.evaluate(()=>window.ready);
const frames=list?list.split(',').map(Number):[...Array(N).keys()]; const log=[];
for(const i of frames){const st=await pg.evaluate(i=>window.renderFrame(i),i);const buf=await pg.locator('#c').screenshot({type:'png'});fs.writeFileSync(path.join(out,`f${String(i).padStart(5,'0')}.png`),buf);log.push({i,st,h:crypto.createHash('sha256').update(buf).digest('hex').slice(0,16)});}
fs.writeFileSync(path.join(out,'capture-log.json'),JSON.stringify({N,errs,log}));
console.log(JSON.stringify({N,captured:frames.length,errors:errs,distinct:new Set(log.map(l=>l.h)).size}));
await b.close(); srv.close();
