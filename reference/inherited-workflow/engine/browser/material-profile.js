// Original, object-local material recipes. Raw owner textures remain private.
(function(root){
 const cache=new Map();
 function surface(q,key,x,y,w,h,{alpha=.3,mode='multiply',tileWidth=1300}={}){
  if(!imgs[key])return;q.save();q.beginPath();q.rect(x,y,w,h);q.clip();let id=key+':'+tileWidth;
  if(!cache.has(id)){let p=q.createPattern(imgs[key],'repeat');p.setTransform(new DOMMatrix().scale(tileWidth/imgs[key].width));cache.set(id,p);}
  q.globalAlpha*=alpha;q.globalCompositeOperation=mode;q.fillStyle=cache.get(id);q.fillRect(x,y,w,h);q.restore();
 }
 function paper(q,x,y,w,h){surface(q,'paperFiber',x,y,w,h,{alpha:.56,mode:'multiply',tileWidth:1600});surface(q,'photocopy',x,y,w,h,{alpha:.19,mode:'screen',tileWidth:900});}
 function print(q,x,y,w,h){surface(q,'plastic',x,y,w,h,{alpha:.34,mode:'screen',tileWidth:1200});surface(q,'photocopy',x,y,w,h,{alpha:.13,mode:'screen',tileWidth:850});}
 root.ChannelMaterials={surface,paper,print};
})(globalThis);
