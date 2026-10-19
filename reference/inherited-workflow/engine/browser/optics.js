/* Original Canvas adaptation, not the Quick Chromatic Aberration plugin. */
(function(root){
 class OpticalPass{
  constructor(w,h){this.w=w;this.h=h;this.pad=24;this.source=this.make(w,h);this.extended=this.make(w+48,h+48);this.channels=Array.from({length:3},()=>this.make(w+48,h+48));}
  make(w,h){let c=document.createElement('canvas');c.width=w;c.height=h;return c;}
  extend(){const p=this.pad,w=this.w,h=this.h,q=this.extended.getContext('2d');q.clearRect(0,0,w+2*p,h+2*p);q.drawImage(this.source,p,p);q.drawImage(this.source,0,0,1,h,0,p,p,h);q.drawImage(this.source,w-1,0,1,h,p+w,p,p,h);q.drawImage(this.source,0,0,w,1,p,0,w,p);q.drawImage(this.source,0,h-1,w,1,p,p+h,w,p);for(let x of [0,w-1])for(let y of [0,h-1])q.drawImage(this.source,x,y,1,1,x? p+w:0,y?p+h:0,p,p);}
  apply(target,canvas,{blurPx=0,fringePx=0,cx=540,cy=960,logicalWidth=1080}={}){
   if(canvas.width!==this.w||canvas.height!==this.h)throw Error('Optical surface size mismatch');let scale=this.w/logicalWidth,blur=blurPx*scale,fringe=fringePx*scale;if(blur<0||blur>24*scale||fringe<0||fringe>3*scale)throw Error('Optical settings outside readable profile');
   const q=this.source.getContext('2d');q.setTransform(1,0,0,1,0,0);q.clearRect(0,0,this.w,this.h);q.drawImage(canvas,0,0);this.extend();
   target.save();target.setTransform(1,0,0,1,0,0);
   if(fringe>0){
    const center=[cx*scale,cy*scale],radius=Math.max(...[[0,0],[this.w,0],[0,this.h],[this.w,this.h]].map(p=>Math.hypot(p[0]-center[0],p[1]-center[1]))),delta=fringe/Math.max(1,radius);
    const colors=['#ff0000','#00ff00','#0000ff'],factors=[1+delta,1,1-delta];
    target.fillStyle='black';target.fillRect(0,0,this.w,this.h);
    for(let i=0;i<3;i++){let p=this.channels[i].getContext('2d');p.globalCompositeOperation='copy';p.drawImage(this.extended,0,0);p.globalCompositeOperation='multiply';p.fillStyle=colors[i];p.fillRect(0,0,this.extended.width,this.extended.height);p.globalCompositeOperation='source-over';target.save();target.globalCompositeOperation='lighter';target.translate(...center);target.scale(factors[i],factors[i]);target.translate(-center[0],-center[1]);target.drawImage(this.channels[i],-this.pad,-this.pad);target.restore();}
   }
   if(blur>0){if(fringe>0){q.clearRect(0,0,this.w,this.h);q.drawImage(canvas,0,0);this.extend();}target.filter=`blur(${blur}px)`;target.drawImage(this.extended,-this.pad,-this.pad);target.filter='none';}
   target.restore();
  }
 }
 root.ChannelOptics={OpticalPass};
})(globalThis);
