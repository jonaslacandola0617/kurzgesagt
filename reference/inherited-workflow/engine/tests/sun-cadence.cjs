const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync(require('path').join(__dirname,'../browser/frame.js'),'utf8');
function harness(declared){
 const calls=[],elements={clock:{},scrub:{}};
 const env={CONFIG:{production_standard:declared,brand_ending:'brand-ending-v1',optics:{enabled:true}},clamp:(x,a,b)=>Math.max(a,Math.min(b,x)),DURATION:49.5,RENDER_SCALE:1,W:1080,H:1920,FPS:30,canvas:{width:1080,height:1920},ctx:{setTransform(){},clearRect(){}},window:{},document:{getElementById:n=>elements[n]},ChannelBrand:{drawEndcard:(_,t)=>calls.push(['ending',t])},ChannelOptics:{OpticalPass:class{apply(){}}}};
 for(const name of ['renderScene','film','captions','furniture','episodeOptics'])env[name]=t=>{calls.push([name,t]);return name==='episodeOptics'?{}:undefined};
 env.episodeMotionState=t=>({t});vm.createContext(env);vm.runInContext(code,env);
 return {env,calls,elements};
}
const h=harness('sun-disappeared-v1');let changes=0,last;
for(let n=0;n<1485;n++){
 h.calls.length=0;let t=n/30;h.env.window.renderAt(t);let picture=Math.floor((t+1e-8)*12)/12;
 for(const [name,value] of h.calls)assert.equal(value,name==='ending'?t:picture,`${name} at frame ${n}`);
 assert.equal(h.env.window.currentTime,t);assert.equal(h.elements.scrub.value,t);
 if(n&&Math.floor(n*12/30)===Math.floor((n-1)*12/30))assert.equal(picture,last);
 if(picture!==last)changes++;last=picture;
}
for(const t of [18.1,.02,48.9,6.3,18.1]){
 h.env.window.renderAt(t);assert.equal(h.env.window.motionState(t).t,Math.floor((t+1e-8)*12)/12);
}
const historical=harness(undefined);historical.env.window.renderAt(.137);
assert(historical.calls.every(([,t])=>t===.137));
console.log(JSON.stringify({pass:true,frames:1485,scene_states:changes,scene_fps:12,brand_fps:30,historical_continuous_time:'unchanged',random_seek:'pass'}));
