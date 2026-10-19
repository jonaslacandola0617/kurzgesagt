import {chromium} from '/opt/npm-tools/node_modules/playwright/index.mjs';
import crypto from 'crypto'; import fs from 'fs'; import http from 'http'; import path from 'path';
const dir=process.argv[2]; const N=60;
const srv=http.createServer((rq,rs)=>{const p=path.join(dir,rq.url.split('?')[0]==='/'?'index.html':rq.url);fs.readFile(p,(e,d)=>{if(e){rs.writeHead(404);rs.end();return}rs.end(d)})}).listen(8765);
const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1});
await pg.goto('http://127.0.0.1:8765/'); await pg.evaluate(()=>window.ready);
const grab=async i=>{const st=await pg.evaluate(i=>window.renderFrame(i),i);const buf=await pg.locator('#c').screenshot({type:'png'});return {st,buf,h:crypto.createHash('sha256').update(buf).digest('hex')}};
fs.mkdirSync(dir+'/frames',{recursive:true}); const seq=[];
for(let i=0;i<N;i++){const g=await grab(i);seq.push(g);fs.writeFileSync(`${dir}/frames/f${String(i).padStart(5,'0')}.png`,g.buf)}
const order=[...Array(N).keys()].sort(()=>Math.random()-.5); let mism=0;
for(const i of order){const g=await grab(i); if(g.h!==seq[i].h) mism++}
const distinct=new Set(seq.map(s=>s.h)).size, states=new Set(seq.map(s=>s.st)).size;
console.log(JSON.stringify({frames:N,distinctImages:distinct,distinctSceneStates:states,randomSeekMismatches:mism,holds:seq.map(s=>s.st.toFixed(3)).slice(0,12).join(' ')}));
await b.close(); srv.close();
