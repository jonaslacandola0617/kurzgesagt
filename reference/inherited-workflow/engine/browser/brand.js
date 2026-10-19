// Neutral ending stub. The previous channel's locked endcard was removed with its brand identity.
// Supply the new channel's ending here once the owner approves one; until then nothing is drawn.
(function(root){
 const ENDING=Object.freeze({id:'brand-ending-v1',status:'NOT_SUPPLIED'});
 function drawEndcard(q,t,duration){}
 root.ChannelBrand={ENDING,drawEndcard};
})(typeof globalThis!=='undefined'?globalThis:this);
