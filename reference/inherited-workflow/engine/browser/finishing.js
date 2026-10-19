/* Original channel Canvas adaptations. Tutorial result contracts, not copied AE rigs.
 * Pixel units are actual canvas pixels. Apply map focus/film before critical captions.
 * Browser global: ChannelFinishing. No third-party runtime dependencies. */
(function(root){'use strict';
 const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
 const smooth=x=>(x=clamp(x),x*x*(3-2*x));
 const make=(w,h)=>{let c=document.createElement('canvas');c.width=w;c.height=h;return c;};
 function random(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
 function hash(seed,frame){return (Math.imul(seed+1,2654435761)^Math.imul(frame+1,1597334677))>>>0;}

 class FocusPass {
  constructor(width,height,levels=5){
   if(levels<2)throw Error('Focus needs at least two blur levels');
   this.w=width;this.h=height;this.levels=levels;
   this.planes=Array.from({length:levels},()=>make(width,height));
   this.output=this.planes[0].getContext('2d').createImageData(width,height);
  }
  apply(source,target,{cx=this.w/2,cy=this.h/2,rx=this.w*.22,ry=this.h*.16,feather=1,maxBlur=10,outsideGain=.68,strength=1}={}){
   if(source.width!==this.w||source.height!==this.h)throw Error('Focus source dimensions must match; render natively');
   if(rx<=0||ry<=0||feather<=0)throw Error('Focus radii and feather must be positive');
   strength=clamp(strength);maxBlur=Math.max(0,maxBlur);
   // Extend border pixels before blur so defocus does not expose transparent frame edges.
   let pad=Math.ceil(maxBlur*3)+1,extended=make(this.w+pad*2,this.h+pad*2),e=extended.getContext('2d');
   e.drawImage(source,pad,pad);e.drawImage(source,0,0,1,this.h,0,pad,pad,this.h);e.drawImage(source,this.w-1,0,1,this.h,pad+this.w,pad,pad,this.h);
   e.drawImage(source,0,0,this.w,1,pad,0,this.w,pad);e.drawImage(source,0,this.h-1,this.w,1,pad,pad+this.h,this.w,pad);
   for(const [sx,sy,dx,dy] of [[0,0,0,0],[this.w-1,0,pad+this.w,0],[0,this.h-1,0,pad+this.h],[this.w-1,this.h-1,pad+this.w,pad+this.h]])e.drawImage(source,sx,sy,1,1,dx,dy,pad,pad);
   let images=[];
   for(let i=0;i<this.levels;i++){let c=this.planes[i].getContext('2d');c.clearRect(0,0,this.w,this.h);c.filter=i?`blur(${maxBlur*i/(this.levels-1)}px)`:'none';c.drawImage(extended,-pad,-pad);c.filter='none';images.push(c.getImageData(0,0,this.w,this.h).data);}
   let out=this.output.data;
   for(let y=0;y<this.h;y++)for(let x=0;x<this.w;x++){
    let distance=Math.hypot((x-cx)/rx,(y-cy)/ry);
    // One spatial field feeds BOTH local blur radius and brightness modulation.
    let field=smooth((distance-1)/feather)*strength;
    let level=field*(this.levels-1),a=Math.floor(level),b=Math.min(a+1,this.levels-1),u=level-a,gain=1+(outsideGain-1)*field,p=(y*this.w+x)*4;
    for(let k=0;k<3;k++)out[p+k]=clamp((images[a][p+k]*(1-u)+images[b][p+k]*u)*gain,0,255);
    out[p+3]=images[a][p+3]*(1-u)+images[b][p+3]*u;
   }
   target.putImageData(this.output,0,0);return this.output;
  }
 }

 function filmState(t,{seed=19,jitterPx=0,jitterFps=24,exposureStops=0,exposureFps=2}={}){
  let motion=random(hash(seed,Math.floor(t*jitterFps))),light=random(hash(seed+151,Math.floor(t*exposureFps)));
  return {dx:(motion()*2-1)*jitterPx,dy:(motion()*2-1)*jitterPx,exposure:(light()*2-1)*exposureStops};
 }
 function filmFinish(source,target,t,options={}){
  if(source===target.canvas)throw Error('Film finishing needs a separate output canvas');
  const {grainStrength=0,grainFps=24,seed=19}=options,state=filmState(t,options),w=source.width,h=source.height;
  let pad=(options.jitterPx||0)?Math.ceil(options.jitterPx)+1:0;
  target.clearRect(0,0,w,h);target.drawImage(source,state.dx-pad,state.dy-pad,w+pad*2,h+pad*2);
  if(state.exposure||grainStrength){let im=target.getImageData(0,0,w,h),r=random(hash(seed+503,Math.floor(t*grainFps))),gain=Math.pow(2,state.exposure),lut=new Uint8Array(256);
   for(let i=0;i<256;i++)lut[i]=clamp(255*Math.pow(Math.pow(i/255,2.2)*gain,1/2.2),0,255);
   for(let p=0;p<im.data.length;p+=4){let noise=(r()+r()+r()-1.5)*255*grainStrength;for(let k=0;k<3;k++)im.data[p+k]=clamp(lut[im.data[p+k]]+noise,0,255);}
   target.putImageData(im,0,0);
  }
  return state;
 }

 function boilPath(points,t,{seed=41,amplitudePx=.65,fps=12,wavelengthPx=28,lockEnds=true}={}){
  let r=random(hash(seed,Math.floor(t*fps))),phase=r()*Math.PI*2,phase2=r()*Math.PI*2,s=0;
  return points.map((p,i)=>{if(i)s+=Math.hypot(p[0]-points[i-1][0],p[1]-points[i-1][1]);if(lockEnds&&(i===0||i===points.length-1))return [...p];let a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy)||1;
   let envelope=lockEnds?Math.sin(Math.PI*i/Math.max(1,points.length-1)):1;
   let n=(Math.sin(s/wavelengthPx*Math.PI*2+phase)+.35*Math.sin(s/wavelengthPx*5+phase2))/1.35*amplitudePx*envelope;
   return [p[0]-dy/length*n,p[1]+dx/length*n];
  });
 }
 function drawInkStroke(ctx,points,{color='#1E2230',width=3,bleedPx=.7,bleedAlpha=.22}={}){
  if(points.length<2)return;
  const trace=()=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));};
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=color;
  if(bleedPx>0){ctx.globalAlpha=bleedAlpha;ctx.lineWidth=width*1.18;ctx.filter=`blur(${bleedPx}px)`;trace();ctx.stroke();}
  ctx.filter='none';ctx.globalAlpha=1;ctx.lineWidth=width;trace();ctx.stroke();ctx.restore();
 }

 function parallaxTransform(layer,camera,{width,height,focalLength=800}={}){
  let distance=focalLength+(layer.z||0)-(camera.z||0);if(distance<=0)throw Error('Plane is behind the camera');
  let scale=focalLength/distance;
  return {scale,x:width/2+((layer.x||0)-(camera.x||0))*scale,y:height/2+((layer.y||0)-(camera.y||0))*scale};
 }
 function renderParallax(layers,camera,ctx,options){
  [...layers].sort((a,b)=>(b.z||0)-(a.z||0)).forEach(layer=>{let p=parallaxTransform(layer,camera,options);ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.scale,p.scale);ctx.globalAlpha=layer.opacity??1;ctx.drawImage(layer.image,-layer.image.width/2,-layer.image.height/2);ctx.restore();});
 }
 root.ChannelFinishing={FocusPass,filmState,filmFinish,boilPath,drawInkStroke,parallaxTransform,renderParallax};
})(typeof window!=='undefined'?window:globalThis);
