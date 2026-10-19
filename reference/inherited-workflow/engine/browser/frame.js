// Historical builds retain continuous time. New Sun-standard scenes sample at12fps;
// the brand ending, UI clock and audio keep actual output time.
function channelSceneTime(t){return CONFIG.production_standard==='sun-disappeared-v1'?Math.floor((t+1e-8)*12)/12:t;}
function renderAt(t){
 t=clamp(t,0,DURATION);const pictureTime=channelSceneTime(t);
 ctx.setTransform(RENDER_SCALE,0,0,RENDER_SCALE,0,0);ctx.globalAlpha=1;ctx.clearRect(0,0,W,H);
 renderScene(pictureTime);
 if(CONFIG.optics?.enabled&&typeof episodeOptics==='function'){
  const options=episodeOptics(pictureTime);if(options){window.channelOpticalPass??=new ChannelOptics.OpticalPass(canvas.width,canvas.height);window.channelOpticalPass.apply(ctx,canvas,options);}
 }
 film(pictureTime);captions(pictureTime);furniture(pictureTime);
 if(CONFIG.brand_ending==='brand-ending-v1')ChannelBrand.drawEndcard(ctx,t,DURATION);
 document.getElementById('clock').textContent=`${t.toFixed(2)} / ${DURATION.toFixed(2)} s`;document.getElementById('scrub').value=t;window.currentTime=t;
}
window.renderAt=renderAt;window.getDuration=()=>DURATION;window.setFrame=f=>renderAt(f/FPS);window.motionState=t=>typeof episodeMotionState==='function'?episodeMotionState(channelSceneTime(t)):{native:[canvas.width,canvas.height]};
