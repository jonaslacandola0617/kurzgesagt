const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const {createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');
const R=__dirname,A=path.resolve(R,'../art-v1/assets'),ENGINE=path.resolve(R,'../../../../engine');
global.document={createElement:()=>createCanvas(1,1)};
require(path.join(ENGINE,'browser/finishing.js'));require('../motion-r2/editorial-finish.cjs');require(path.join(ENGINE,'browser/brand.js'));
const mechanism=require('../motion-r2/render.cjs');
GlobalFonts.registerFromPath(path.join(A,'HeadlineDisplay900.ttf'),'the old headline display face');GlobalFonts.registerFromPath(path.join(A,'Manrope800.ttf'),'Manrope');
const timeline=JSON.parse(fs.readFileSync(path.join(R,'timeline.json'))),E=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)},bell=(t,a,b,c,d)=>E((t-a)/(b-a))*(1-E((t-c)/(d-c)));
let core,source,out,ctx,finish,scale;
function direction(t){const conditionCut=bell(t,5.85,6.05,6.12,6.45),payCut=bell(t,timeline.payoff_start-.18,timeline.payoff_start-.03,timeline.payoff_start+.03,timeline.payoff_start+.28),opening= t<6.08;
return {focus:{shadeStrength:.18,strength:t<5.8?.15:t<timeline.mechanism_start?.25:t<timeline.payoff_start?.35:0,cx:opening?520:540,cy:opening?720:t<timeline.mechanism_start?620:690+720*E((t-(timeline.outro_start+3.4))/.6),rx:560,ry:440,blur:4.8},cut:Math.max(conditionCut,payCut),hunt:1.2*bell(t,6.15,6.22,6.29,6.50),dx:-18*conditionCut,fringePx:.95,jitterPx:.45,exposureStops:.024,grainStrength:.23};}
async function setup(w=720){scale=w/1080;const loaded={};for(const[k,n]of Object.entries({steel:'steel-spoon.png',wood:'wood-spoon.png',hand:'hand.png'}))loaded[k]=await loadImage(path.join(A,n));core=require('./scene-core.cjs')(createCanvas,loaded);source=createCanvas(w,w*1920/1080);out=createCanvas(w,source.height);ctx=out.getContext('2d');finish=new ChannelEditorialFinish.EditorialFinish(w,out.height,direction);await mechanism.setup(w)}
function captions(q,t){let c=timeline.captions.find(c=>t>=c.start&&t<c.end);if(!c)return;q.save();q.setTransform(scale,0,0,scale,0,0);q.font='800 43px Manrope';q.textAlign='center';let w=Math.max(...c.lines.map(x=>q.measureText(x).width))+54,h=c.lines.length*55+18,y=960-h/2;q.fillStyle='#0a1622';q.fillRect(540-w/2,y,w,h);q.fillStyle='#fff';c.lines.forEach((x,i)=>q.fillText(x,540,y+48+i*55));q.restore()}
function renderAt(t,{captions:withCaptions=true,ending=true}={}){
const m=timeline.mechanism_start,o=timeline.outro_start,p=timeline.payoff_start;
if(t>=m&&t<o){const c=mechanism.renderAt(t-m,{captions:false});ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,out.width,out.height);ctx.drawImage(c,0,0);}
else{let q=source.getContext('2d');q.setTransform(scale,0,0,scale,0,0);q.clearRect(0,0,1080,1920);
 if(t<6.08){core.renderStudy(q,0,t);}
 else if(t<m){core.renderStudy(q,1,t-6.08);}
 else if(t<p){
  // Same comparison anchors: the new inference concerns cooling skin, not a new measured rate.
  core.render(q,8.9,{headings:false});q.save();q.fillStyle='#172631';q.font='900 72px "the old headline display face"';q.fillText('Your skin cools.',72,265);q.restore();
 }else{core.renderStudy(q,6,t-p);}
 finish.apply(source,ctx,t);}
 if(withCaptions)captions(ctx,t);
 if(ending){ctx.save();ctx.setTransform(scale,0,0,scale,0,0);ChannelBrand.drawEndcard(ctx,t,timeline.duration);ctx.restore();}
return out;}
async function worker(){let start=+process.argv[3],end=+process.argv[4],w=+(process.argv[5]||720),file=process.argv[6];await setup(w);const ff=spawn('ffmpeg',['-nostdin','-y','-v','error','-f','rawvideo','-pixel_format','rgba','-video_size',`${w}x${w*16/9}`,'-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','veryfast','-threads','2','-crf','18','-pix_fmt','yuv420p',file],{stdio:['pipe','inherit','inherit']});const done=new Promise((resolve,reject)=>ff.on('exit',c=>c===0?resolve():reject(Error('ffmpeg '+c))));for(let i=start;i<end;i++){let c=renderAt(i/30),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;if(!ff.stdin.write(Buffer.from(d.buffer,d.byteOffset,d.byteLength)))await new Promise(r=>ff.stdin.once('drain',r));}ff.stdin.end();await done;}
module.exports={setup,renderAt,timeline,direction};if(require.main===module&&process.argv[2]==='worker')worker().catch(e=>{console.error(e);process.exit(1)});
