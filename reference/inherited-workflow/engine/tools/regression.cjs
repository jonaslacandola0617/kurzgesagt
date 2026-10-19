const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {pathToFileURL}=require('url');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES ? process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright':'playwright');
const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
async function main(){
 const b=await chromium.launch({executablePath:cfg.chrome,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const p=await b.newPage({viewport:{width:1080,height:1920},acceptDownloads:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto(pathToFileURL(cfg.candidate).href+'?scale=2');await p.waitForFunction(()=>window.renderReady);
  const checks=[];
  for(const frame of cfg.frames){
   const data=await p.evaluate(t=>{renderAt(t);return canvas.toDataURL('image/png');},frame/30);
   const dest=path.join(cfg.out,'candidate_'+String(frame).padStart(4,'0')+'.png');fs.writeFileSync(dest,Buffer.from(data.split(',')[1],'base64'));checks.push({frame,file:dest});console.log('Native checkpoint',frame);
  }
  await p.goto(pathToFileURL(cfg.candidate).href);await p.waitForFunction(()=>window.renderReady);
  const audio=await p.evaluate(()=>{let a=makeAudioData();return {rate:a.rate,samples:a.L.length,blocks:[.3,9.9,39,56.5,74.1].filter(t=>t+256/48000<getDuration()).map(t=>({t,L:[...a.L.slice(Math.floor(t*a.rate),Math.floor(t*a.rate)+256)],R:[...a.R.slice(Math.floor(t*a.rate),Math.floor(t*a.rate)+256)]}))};});
  const wav=fs.readFileSync(cfg.mix);for(const block of audio.blocks){const start=Math.floor(block.t*audio.rate);for(let i=0;i<256;i++)if(block.L[i]!==wav.readInt16LE(44+(start+i)*4)/32768||block.R[i]!==wav.readInt16LE(46+(start+i)*4)/32768)throw Error('PCM mismatch');}
  await p.locator('#play').click();await p.waitForTimeout(1200);let play=await p.evaluate(()=>({playing,t:currentTime}));if(!play.playing||play.t<.6)throw Error('Play failed');await p.locator('#play').click();let t=await p.evaluate(()=>currentTime);await p.waitForTimeout(100);if(await p.evaluate(()=>currentTime)!==t)throw Error('Pause failed');
  await p.locator('#scrub').evaluate(el=>{el.value=Math.min(63,getDuration()*.8);el.dispatchEvent(new Event('input'));});if(Math.abs(await p.evaluate(()=>currentTime)-Math.min(63,await p.evaluate(()=>getDuration()*.8)))>.01)throw Error('Scrub failed');await p.locator('#replay').click();await p.waitForTimeout(250);if(await p.evaluate(()=>currentTime)>1)throw Error('Replay failed');await p.locator('#play').click();
  const fonts=await p.evaluate(()=>({HeadlineDisplay900:document.fonts.check('900 100px "the old headline display face"'),Manrope700:document.fonts.check('700 36px Manrope')}));
  // Full-duration export with the unchanged existing film frames; rendering equivalence is tested separately.
  if(cfg.exportFrames){
   const entries=fs.readdirSync(cfg.exportFrames).filter(n=>/^export_\d+\.jpg$/.test(n)).sort();if(entries.length!==Math.round(await p.evaluate(()=>getDuration())*30))throw Error('Expected full-length review frame set');
   await p.evaluate(()=>window.reviewFrames=[]);
   for(let i=0;i<entries.length;i+=90){const batch=entries.slice(i,i+90).map(n=>fs.readFileSync(path.join(cfg.exportFrames,n)).toString('base64'));await p.evaluate(data=>{for(const x of data){let a=Uint8Array.from(atob(x),c=>c.charCodeAt(0));window.reviewFrames.push(new Blob([a],{type:'image/jpeg'}));}},batch);}
   const dl=p.waitForEvent('download',{timeout:180000});await p.locator('#export').click();await (await dl).saveAs(path.join(cfg.out,'Engine_Full_Browser_Review.webm'));
  }
  if(errors.length)throw Error(errors.join('\n'));
  fs.writeFileSync(path.join(cfg.out,'browser-regression.json'),JSON.stringify({native_checkpoints:checks,fonts,pcm_nonzero_blocks:'EXACT_MATCH',play,pause:true,scrub:true,replay:true,errors,full_browser_export:cfg.exportFrames?'recorded with existing approved film frames; independently probe duration/audio':'not run'},null,2));
 }finally{await b.close();}
}
main().catch(e=>{console.error(e);process.exit(1);});
