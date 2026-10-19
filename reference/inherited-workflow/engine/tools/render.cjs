// Lossless native frame streaming. Render and encode are independent of player QA.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const {once} = require('events');
const {chromium} = require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright' : 'playwright');
const {pathToFileURL} = require('url');
const cfg = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
async function main(){
 const browser = await chromium.launch({executablePath:cfg.chrome, args:['--no-sandbox','--disable-dev-shm-usage']});
 let ff;
 try {
  const p = await browser.newPage({viewport:{width:1080,height:1920}}), errors=[];
  p.on('pageerror', e=>errors.push(e.message));
  await p.goto(pathToFileURL(cfg.studio).href+'?scale='+cfg.scale);
  await p.waitForFunction(()=>window.renderReady);
  const dims=await p.evaluate(()=>[canvas.width,canvas.height]);
  if(dims[0]!==1080*cfg.scale || dims[1]!==1920*cfg.scale)throw Error('Render resolution mismatch');
  const duration=cfg.frames/30, args=['-y','-v','error','-f','rawvideo','-pix_fmt','rgba','-video_size',dims.join('x'),'-framerate','30','-color_primaries','bt709','-color_trc','iec61966-2-1','-i','pipe:0','-ss',String(cfg.start),'-i',cfg.mix];
  for(const output of cfg.outputs){
   args.push('-map','0:v','-map','1:a','-t',String(duration));
   if(output.kind==='webm') args.push('-c:v','libvpx-vp9','-deadline','realtime','-cpu-used','6','-threads','4','-row-mt','1','-crf','22','-b:v','0','-pix_fmt','yuv420p','-c:a','libopus','-b:a','256k','-ar','48000','-ac','2');
   else {
    args.push('-c:v','libx264','-preset','fast','-threads','4');
    if(output.kind==='posting') args.push('-profile:v','high','-b:v','12M','-maxrate','16M','-bufsize','24M');
    else args.push('-crf',output.kind==='master'?'15':'20');
    args.push('-pix_fmt','yuv420p');
    if(output.kind==='download'){
     const budget=Math.min(48000,Math.floor((450*1024*1024*8/duration-500000)/1000));
     args.push('-maxrate',budget+'k','-bufsize',(budget*2)+'k');
    }
    args.push('-c:a','aac','-b:a','320k','-ar','48000','-ac','2','-movflags','+faststart');
   }
   args.push(output.path);
  }
  ff=cp.spawn('ffmpeg',args,{stdio:['pipe','ignore','pipe']});let error='';ff.stderr.on('data',b=>error+=b);
  ff.stdin.on('error',()=>{});const complete=once(ff,'close');
  const begun=Date.now();
  for(let frame=0;frame<cfg.frames;frame++){
   const data=await p.evaluate(async t=>{renderAt(t);return await new Promise((resolve,reject)=>{const raw=ctx.getImageData(0,0,canvas.width,canvas.height).data;const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(new Blob([raw],{type:'application/octet-stream'}));});},cfg.start+frame/30);
   if(!ff.stdin.write(Buffer.from(data.slice(data.indexOf(',')+1),'base64')))await once(ff.stdin,'drain');
   if(frame%30===0){fs.writeFileSync(cfg.progress,JSON.stringify({frame,total:cfg.frames,elapsed_seconds:(Date.now()-begun)/1000}));console.log('Frame',frame,'/',cfg.frames);}
  }
  ff.stdin.end();const [code]=await complete;if(code!==0)throw Error(error||'Encoder failed');
  if(errors.length)throw Error(errors.join('\n'));
  console.log('Encoded',cfg.frames,'frames at',dims.join('x'));
 }finally{if(ff&&ff.exitCode===null)ff.kill('SIGTERM');await browser.close();}
}
main().catch(e=>{console.error(e);process.exit(1);});
