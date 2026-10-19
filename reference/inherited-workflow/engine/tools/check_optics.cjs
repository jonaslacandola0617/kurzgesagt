// Browser optical reconstruction and projected-anchor timing checks.
const fs=require('fs'),{pathToFileURL}=require('url');
const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
async function main(){const b=await chromium.launch({executablePath:cfg.chrome,args:['--no-sandbox','--disable-dev-shm-usage']});try{
 const p=await b.newPage();await p.goto(pathToFileURL(cfg.studio).href);await p.waitForFunction(()=>window.renderReady);
 const result=await p.evaluate(()=>{
  const c=document.createElement('canvas');c.width=64;c.height=96;const q=c.getContext('2d');q.fillStyle='rgb(137,167,211)';q.fillRect(0,0,64,96);
  const optical=new ChannelOptics.OpticalPass(64,96);optical.apply(q,c,{blurPx:2,fringePx:1.05,cx:32,cy:48,logicalWidth:64});
  const samples=[[0,0],[63,0],[0,95],[63,95],[32,48]].map(([x,y])=>[...q.getImageData(x,y,1,1).data]);
  if(samples.some(a=>a.join()!=='137,167,211,255'))throw Error('RGB reconstruction or padding failed');
  let best={t:0,speed:0},step=1.4/1000,epsilon=step/14;
  for(let i=1;i<1000;i++){let t=9.22+i*step,a=motionState(t-epsilon).sourceAnchor,z=motionState(t+epsilon).sourceAnchor,speed=Math.hypot(z[0]-a[0],z[1]-a[1])/(2*epsilon);if(speed>best.speed)best={t,speed};}
  if(Math.round(best.t*30)!==298)throw Error('Projected peak is not registered with cut');
  return {solid_color_and_edge_padding:'PASS',samples,projected_anchor_peak:best,nearest_frame:Math.round(best.t*30),cut_frame:298};
 });fs.writeFileSync(cfg.report,JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}finally{await b.close();}}
main().catch(e=>{console.error(e);process.exit(1)});
