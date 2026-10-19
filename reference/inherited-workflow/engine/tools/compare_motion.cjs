const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process');
const {once}=require('events'),{pathToFileURL}=require('url');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
async function main(){
 const b=await chromium.launch({executablePath:cfg.chrome,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const pages=[];
  for(const file of [cfg.baseline,cfg.candidate]){let p=await b.newPage({viewport:{width:1080,height:1920}});await p.goto(pathToFileURL(file).href);await p.waitForFunction(()=>window.renderReady);pages.push(p);}
  const results=[];
  for(const range of cfg.ranges){
   const count=Math.round(range.seconds*30),out=path.join(cfg.out,'Motion_'+range.start+'.mp4');
   const ff=cp.spawn('ffmpeg',['-y','-v','error','-f','image2pipe','-framerate','30','-vcodec','png','-i','pipe:0','-ss',String(range.start),'-i',cfg.mix,'-map','0:v','-map','1:a','-t',String(count/30),'-c:v','libx264','-preset','fast','-crf','18','-threads','4','-pix_fmt','yuv420p','-c:a','aac','-b:a','320k',out],{stdio:['pipe','ignore','inherit']});ff.stdin.on('error',()=>{});let done=once(ff,'close');
   for(let i=0;i<count;i++){
    const t=range.start+i/30;const values=[];
    for(const p of pages)values.push(await p.evaluate(t=>{renderAt(t);return canvas.toDataURL('image/png');},t));
    // Compare decompressed pixels in-page; PNG payloads are retained for a moving proof.
    const hash=[];
    for(const p of pages)hash.push(await p.evaluate(async()=>{const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;return [...new Uint8Array(await crypto.subtle.digest('SHA-256',pixels))].map(x=>x.toString(16).padStart(2,'0')).join('');}));
    if(hash[0]!==hash[1])throw Error('Moving RGB mismatch at '+t);
    if(!ff.stdin.write(Buffer.from(values[1].split(',')[1],'base64')))await once(ff.stdin,'drain');
   }
   ff.stdin.end();const [code]=await done;if(code)throw Error('Proof encode failed');results.push({start:range.start,frames:count,exact_rgba_matches:count,proof:out});console.log('Motion range passed',range.start,count,'frames');
  }
  fs.writeFileSync(path.join(cfg.out,'moving-regression.json'),JSON.stringify({status:'PASS',results,scope:'Every frame in selected transition ranges; not a whole-film frame comparison'},null,2));
 }finally{await b.close();}
}
main().catch(e=>{console.error(e);process.exit(1);});
