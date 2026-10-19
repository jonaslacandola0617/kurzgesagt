/* Shared deterministic native optical/material pass. Logical authoring units; native buffers. */
(function(root){
 const E=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)},bell=(t,a,b,c,d)=>E((t-a)/(b-a))*(1-E((t-c)/(d-c)));
 function make(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
 function rng(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}}
 class EditorialFinish{
 constructor(w,h,direction){if(typeof direction!=='function')throw Error('Author a subject-specific finishing direction function');this.direction=direction;this.w=w;this.h=h;this.s=w/1080;this.base=make(w,h);this.blur=make(w,h);this.layer=make(w,h);this.focus=make(w,h);this.banks=[];
 for(let k=0;k<16;k++){let c=make(512,512),q=c.getContext('2d'),im=q.createImageData(512,512),r=rng(9182+k*7717);for(let i=0;i<im.data.length;i+=4){let v=128+(r()+r()-1)*115;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255}q.putImageData(im,0,0);this.banks.push(c)}
 }
 settings(t){return this.direction(t)}
 apply(source,target,t,{enabled=true}={}){let s=this.s,w=this.w,h=this.h,q=this.base.getContext('2d');q.setTransform(1,0,0,1,0,0);q.clearRect(0,0,w,h);q.drawImage(source,0,0);
 if(!enabled){target.save();target.setTransform(1,0,0,1,0,0);target.drawImage(source,0,0);target.restore();return}
 const p=this.settings(t),fs=ChannelFinishing.filmState(t,{seed:51,jitterPx:p.jitterPx,exposureStops:p.exposureStops,jitterFps:18,exposureFps:5});let b=this.blur.getContext('2d'),l=this.layer.getContext('2d');
 if(p.focus.strength>.001){let f=p.focus;b.clearRect(0,0,w,h);b.save();b.filter=`blur(${f.blur*s}px)`;b.drawImage(this.base,-18*s,-18*s,w+36*s,h+36*s);b.restore();b.fillStyle=`rgba(10,20,29,${.18*f.strength})`;b.fillRect(0,0,w,h);
 l.clearRect(0,0,w,h);l.drawImage(this.blur,0,0);l.save();l.globalCompositeOperation='destination-out';l.translate(f.cx*s,f.cy*s);l.scale(f.rx*s,f.ry*s);let g=l.createRadialGradient(0,0,.62,0,0,1.55);g.addColorStop(0,'#000');g.addColorStop(.34,'#000');g.addColorStop(1,'#0000');l.fillStyle=g;l.fillRect(-2,-2,4,4);l.restore();q.save();q.globalAlpha=f.strength;q.drawImage(this.layer,0,0);q.restore();}
 // Native RGB separation reconstructs original channel intensities; no warm screen wash.
 const fq=this.focus.getContext('2d');fq.clearRect(0,0,w,h);fq.drawImage(this.base,0,0);q.fillStyle='#000';q.fillRect(0,0,w,h);
 for(const[i,color]of ['#ff0000','#00ff00','#0000ff'].entries()){l.clearRect(0,0,w,h);l.drawImage(this.focus,0,0);l.globalCompositeOperation='multiply';l.fillStyle=color;l.fillRect(0,0,w,h);l.globalCompositeOperation='source-over';q.save();q.globalCompositeOperation='lighter';q.drawImage(this.layer,(i===0?1:i===2?-1:0)*p.fringePx*s,0);q.restore()}
 b.clearRect(0,0,w,h);b.save();b.filter=`blur(${(12*p.cut+p.hunt)*s}px)`;const z=1+.10*p.cut+.004; b.translate(w/2+(p.dx+fs.dx)*s,h/2+fs.dy*s);b.scale(z,z);b.drawImage(this.base,-w/2,-h/2);b.restore();
 if(p.cut>.01){q.clearRect(0,0,w,h);q.save();for(let i=-2;i<=2;i++){q.globalAlpha=[.10,.20,.40,.20,.10][i+2];q.drawImage(this.blur,i*7*p.cut*s,0)}q.restore()}else{q.clearRect(0,0,w,h);q.drawImage(this.blur,0,0)}
 // Exposure is photographic, not a subtitle flash. Grain is moving at 12fps while camera stays 30fps.
 if(fs.exposure){q.save();q.globalAlpha=Math.abs(fs.exposure)*.7;q.fillStyle=fs.exposure>0?'#ffffff':'#0b1926';q.fillRect(0,0,w,h);q.restore()}
 q.save();q.globalCompositeOperation='soft-light';q.globalAlpha=p.grainStrength;const bank=this.banks[Math.floor(t*12)%16],step=1024*s,offX=-(Math.floor(t*12)*137%(1024))*s,offY=-(Math.floor(t*12)*83%1024)*s;q.imageSmoothingEnabled=false;for(let y=offY;y<h;y+=step)for(let x=offX;x<w;x+=step)q.drawImage(bank,x,y,step,step);q.restore();
 target.save();target.setTransform(1,0,0,1,0,0);target.clearRect(0,0,w,h);target.drawImage(this.base,0,0);target.restore();root.lastFinishingState=p;
 }
 }
 root.ChannelEditorialFinish={EditorialFinish};
})(globalThis);
