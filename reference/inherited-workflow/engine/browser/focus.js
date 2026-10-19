// Original native-resolution compound focus adaptation. All blur planes retain master pixels.
ChannelFinishing.FocusPass=class{
 constructor(w,h,levels=4){this.w=w*RENDER_SCALE;this.h=h*RENDER_SCALE;this.planes=Array.from({length:4},()=>{let c=document.createElement('canvas');c.width=this.w;c.height=this.h;return c;});this.mask=document.createElement('canvas');this.mask.width=this.w;this.mask.height=this.h;}
 apply(source,target,o={}){let s=RENDER_SCALE,w=this.w,h=this.h,cx=o.cx*s,cy=o.cy*s,rx=o.rx*s,ry=o.ry*s,f=o.feather||1,str=o.strength??1,max=(o.maxBlur||8)*s;
 if(source.width!==w||source.height!==h)throw Error('Native focus dimensions mismatch');target.setTransform(1,0,0,1,0,0);target.clearRect(0,0,w,h);target.drawImage(source,0,0);
 // Progressive overlapping blur planes driven by the same elliptical selection field.
 for(let i=1;i<4;i++){let p=this.planes[i].getContext('2d');p.setTransform(1,0,0,1,0,0);p.clearRect(0,0,w,h);p.filter=`blur(${max*i/3}px)`;p.drawImage(source,-max,-max,w+2*max,h+2*max);p.filter='none';p.globalCompositeOperation='destination-in';p.save();p.translate(cx,cy);p.scale(rx,ry);let g=p.createRadialGradient(0,0,0,0,0,1+f);let a=1+f*(i-1)/3,b=1+f*i/3;g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(a/(1+f),'rgba(0,0,0,0)');g.addColorStop(Math.min(1,b/(1+f)),`rgba(0,0,0,${str})`);g.addColorStop(1,`rgba(0,0,0,${str})`);p.fillStyle=g;p.fillRect(-cx/rx,-cy/ry,w/rx,h/ry);p.restore();p.globalCompositeOperation='source-over';target.drawImage(this.planes[i],0,0);}
 target.save();target.translate(cx,cy);target.scale(rx,ry);let g=target.createRadialGradient(0,0,1,0,0,1+f);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${(1-(o.outsideGain||.8))*str})`);target.fillStyle=g;target.fillRect(-cx/rx,-cy/ry,w/rx,h/ry);target.restore();
 }
};
