'use strict';


const W=CONFIG.width,H=CONFIG.height,FPS=CONFIG.fps,DURATION=DATA.timing.duration;
const canvas=document.getElementById('film');canvas.width=W*RENDER_SCALE;canvas.height=H*RENDER_SCALE;const ctx=canvas.getContext('2d',{alpha:false});

const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),smooth=x=>(x=clamp(x),x*x*(3-2*x)),smoother=x=>(x=clamp(x),x*x*x*(x*(x*6-15)+10)),mix=(a,b,u)=>a+(b-a)*u,span=(t,a,b)=>clamp((t-a)/(b-a));
const imgs={};for(const n of Object.keys(CONFIG.images)){imgs[n]=new Image();imgs[n].src=MEDIA[n];}
const mixBytes=Uint8Array.from(atob(MEDIA.mix),x=>x.charCodeAt(0));

const scene=document.createElement('canvas'),focused=document.createElement('canvas');scene.width=focused.width=W*RENDER_SCALE;scene.height=focused.height=H*RENDER_SCALE;const sq=scene.getContext('2d'),fq=focused.getContext('2d');const focus=new ChannelFinishing.FocusPass(W,H,5);
const grain=document.createElement('canvas');grain.width=540;grain.height=960;
function seeded(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
