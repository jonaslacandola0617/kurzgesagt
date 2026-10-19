/* Derived from owner-approved art-v1; source hash recorded in coverage. */
module.exports=function(createCanvas,loaded){
const W=1080,H=1920,C={navy:'#1E2230',ink:'#172631',cream:'#F2F2F2',coral:'#EF785E',gold:'#DBAC64',blue:'#91B8D1',yellow:'#FFE34A'};
const names=['01_same_start','02_equilibrium','03_contact_initial','04_contact_intermediate','05_contact_resolved','06_rate_comparison','07_payoff'];
let images=loaded,ctx,heading=true;
function seed(s){return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}}
function text(s,x,y,size=28,color=C.ink,family='Manrope',weight=700,align='left'){ctx.save();ctx.font=`${weight} ${size}px "${family}"`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(s,x,y);ctx.restore()}
function lines(ss,x,y,size,color=C.cream){if(!heading)return;ss.forEach((s,i)=>text(s,x,y+i*size*1.09,size,color,'the old headline display face',900))}
function line(x1,y1,x2,y2,color=C.ink,width=3){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
function arrow(x1,y1,x2,y2,color,width=7){line(x1,y1,x2,y2,color,width);let a=Math.atan2(y2-y1,x2-x1);ctx.beginPath();ctx.moveTo(x2-19*Math.cos(a-.6),y2-19*Math.sin(a-.6));ctx.lineTo(x2,y2);ctx.lineTo(x2-19*Math.cos(a+.6),y2-19*Math.sin(a+.6));ctx.stroke()}
function image(name,x,y,w,rotation=0,alpha=1){const im=images[name],h=w*im.height/im.width;ctx.save();ctx.globalAlpha=alpha;ctx.translate(x+w/2,y+h/2);ctx.rotate(rotation);ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=18;ctx.shadowOffsetY=12;ctx.drawImage(im,-w/2,-h/2,w,h);ctx.shadowColor='rgba(246,105,76,.35)';ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.shadowOffsetX=1.2;ctx.globalAlpha=alpha*.16;ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore()}
function grain(x,y,w,h,light=false,strength=.07){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();let r=seed(36415),tile=createCanvas(180,180),q=tile.getContext('2d'),d=q.createImageData(180,180);for(let i=0;i<d.data.length;i+=4){let v=r()>.5?255:0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=Math.floor(r()*255*strength)}q.putImageData(d,0,0);ctx.fillStyle=ctx.createPattern(tile,'repeat');ctx.fillRect(x,y,w,h);ctx.globalAlpha*=.12;ctx.strokeStyle=light?'#fff':'#05131f';ctx.lineWidth=.7;for(let i=0;i<150;i++){let a=x+r()*w,b=y+r()*h;ctx.beginPath();ctx.moveTo(a,b);ctx.lineTo(a+r()*65,b+(r()-.5)*5);ctx.stroke()}ctx.restore()}
function bg(light=false){ctx.fillStyle=light?C.cream:C.navy;ctx.fillRect(0,0,W,H);let g=ctx.createRadialGradient(520,700,0,520,850,1100);g.addColorStop(0,light?'rgba(255,255,255,.28)':'rgba(73,116,137,.32)');g.addColorStop(1,'rgba(0,0,0,.10)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);grain(0,0,W,H,light,.10);text('the channel',72,80,24,light?C.ink:C.cream);line(72,108,1008,108,light?'#bdb9ac':'#67808c',1.5);text('SCIENCE / EVERYDAY SYSTEMS',1008,80,19,light?C.ink:C.blue,'Manrope',700,'right')}
function foot(light=false){text('PHOTOGRAPHIC ILLUSTRATION · NOT A MEASURED EXPERIMENT',72,1810,17,light?'#4e5a5d':'#a7b5ba');text('Evidence: OpenStax · Temperature / Conduction',72,1845,17,light?'#4e5a5d':'#a7b5ba');void 0}
function tag(s,x,y,w=285,color=C.yellow){ctx.save();ctx.translate(x,y);ctx.rotate(-.025);ctx.fillStyle=color;ctx.fillRect(0,0,w,55);grain(0,0,w,55,true,.045);text(s,w/2,37,24,C.ink,'Manrope',800,'center');ctx.restore()}
function lane(light=false){/* Intentional central quiet zone. Optional guide is a separate render. */let g=ctx.createLinearGradient(0,805,0,1115);const b=light?'245,240,231':'13,28,43';g.addColorStop(0,`rgba(${b},0)`);g.addColorStop(.22,`rgba(${b},.94)`);g.addColorStop(.78,`rgba(${b},.94)`);g.addColorStop(1,`rgba(${b},0)`);ctx.fillStyle=g;ctx.fillRect(0,805,W,310)}
function opening(){bg();lines(['Same temperature.'],72,245,79);tag('DIFFERENT FEELING',74,296,430);image('steel',0,380,500,-.13);image('wood',600,430,470,.13);lane();line(140,1450,940,1450,C.blue,3);line(140,1430,140,1470,C.blue,3);line(940,1430,940,1470,C.blue,3);text('same starting temperature',540,1520,36,C.cream,'Manrope',800,'center');text('METAL',230,1650,33,C.blue,'Manrope',800,'center');text('WOOD',835,1650,33,C.gold,'Manrope',800,'center');foot()}
function equilibrium(){bg(true);text('FIRST, SET THE CONDITIONS',72,205,25,C.ink);lines(['One room.','One starting point.'],72,317,89,C.ink);image('steel',320,230,420,Math.PI/2);image('wood',320,980,420,Math.PI/2);lane(true);tag('AFTER THERMAL EQUILIBRIUM',72,1150,622,C.yellow);text('METAL',90,790,30,C.ink);text('WOOD',90,1560,30,C.ink);line(80,1625,1000,1625,C.ink,2);text('Both have settled to the room’s temperature.',72,1700,32,C.ink);foot(true)}
function contactPhoto(y=400,wood=false,scale=1){/* source-registered tip/handle construction, independently layered */
 const x=350;image(wood?'wood':'steel',x-200*scale,y-480*scale,400*scale,0);image('hand',x+18*scale-63*scale,y-196*scale,1242*scale,0);
 ctx.save();ctx.strokeStyle=C.yellow;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x+18*scale,y,28*scale,-Math.PI/2,-Math.PI/2+Math.PI*2*E((time-2.66)/.20));ctx.stroke();ctx.restore();return{x:x+18*scale,y};}
function paper(x,y,w,h){ctx.save();ctx.shadowColor='rgba(0,0,0,.28)';ctx.shadowBlur=25;ctx.shadowOffsetY=15;ctx.fillStyle='#E7DFCF';ctx.beginPath();ctx.moveTo(x+7,y);ctx.lineTo(x+w,y+8);ctx.lineTo(x+w-9,y+h);ctx.lineTo(x,y+h-7);ctx.closePath();ctx.fill();ctx.restore();grain(x,y,w,h,true,.11)}
function heatPrint(level){const x=65,y=1170;paper(x,y,950,555);text('CONTACT / QUALITATIVE EXPLANATION',105,1232,24,C.ink,'Manrope',800);text('WARMER SKIN',105,1315,27,C.ink,'Manrope',800);text('COOLER MATERIAL',975,1315,27,C.ink,'Manrope',800,'right');
 // Source-bound photo swatches retain material identity, not a fabricated thermal camera.
 ctx.save();ctx.beginPath();ctx.rect(110,1360,250,210);ctx.clip();image('hand',-20,1200,920);ctx.restore();ctx.save();ctx.beginPath();ctx.rect(750,1360,220,210);ctx.clip();image('steel',330,800,1050);ctx.restore();
 line(110,1590,970,1590,'#798180',2);if(level>0){const endpoints=level===1?[610]:[675,675,675];for(let i=0;i<endpoints.length;i++)arrow(410,1410+i*54,endpoints[i],1410+i*54,C.coral,level===1?7:10);text('heat flows out of skin',110,1654,29,C.ink,'Manrope',800)}else{text('Touch joins two different temperatures.',110,1654,28,C.ink)}
}
function contact(level){bg();if(level===0){lines(['Your hand','is warmer.'],560,240,66);contactPhoto(650);heatPrint(0)}else if(level===1){text('FOLLOW THE CONTACT',560,210,24,C.blue);lines(['Same contact.'],560,307,58);contactPhoto(650);line(369,678,340,1168,C.yellow,3);heatPrint(1);text('same contact',468,735,23,C.cream)}else{lines(['Heat leaves','your skin.'],560,240,66);contactPhoto(650);heatPrint(2)}lane();foot()}
function rates(){bg(true);text('KEEP THE STARTING CONDITION FIXED',72,190,23,C.ink);lines(['Different transfer.'],72,280,78,C.ink);contactPhoto(660,false,.82);text('METAL',72,685,31,C.ink,'Manrope',900);arrow(356,710,356,790,C.coral,9);contactPhoto(1370,true,.82);text('WOOD',72,1400,31,C.ink,'Manrope',900);arrow(356,1420,356,1455,C.coral,6);lane(true);tag('FASTER HEAT TRANSFER',440,739,520,C.yellow);tag('SLOWER HEAT TRANSFER',440,1494,520,'#DFC69B');text('Arrow treatment is qualitative, not a measured rate ratio.',72,1728,24,C.ink);foot(true)}
function payoff(){bg();image('steel',-70,270,560,-.2);image('wood',565,290,545,.18);lane();text('SAME STARTING TEMPERATURE',540,1190,35,C.cream,'Manrope',800,'center');lines(['What feels colder','can be what takes','your heat faster.'],72,1350,82);tag('TOUCH IS NOT A THERMOMETER',72,1655,726);foot()}
const draws=[opening,equilibrium,()=>contact(0),()=>contact(1),()=>contact(2),rates,payoff];

let time=0,flags={},arrowIndex=0,study=null;
const varnish={};for(const [name,im] of Object.entries(loaded)){let c=createCanvas(im.width,im.height),q=c.getContext('2d');q.drawImage(im,0,0);q.globalCompositeOperation='source-atop';let g=q.createLinearGradient(0,0,im.width,im.height);g.addColorStop(0,'rgba(225,242,255,.015)');g.addColorStop(.46,'rgba(255,255,255,.07)');g.addColorStop(.53,'rgba(255,255,255,.01)');g.addColorStop(1,'rgba(255,255,255,.02)');q.fillStyle=g;q.fillRect(0,0,im.width,im.height);varnish[name]=c;}
const E=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
const S=v=>{v=Math.max(0,Math.min(1,v));return v*v*v*(v*(v*6-15)+10)};
const oldImage=image,oldGrain=grain,oldLines=lines,oldTag=tag,oldHeat=heatPrint;
grain=function(...args){if(flags.material_texture!==false)oldGrain(...args)};
image=function(name,x,y,w,rotation=0,alpha=1){
 alpha*=ctx.globalAlpha;
 if(study){let u=S(study.t/.9),i=study.index;
  if(i===0){if(name==='steel'){x-=65*(1-u);rotation-=.10*(1-u)}if(name==='wood'){x+=75*(1-u);rotation+=.10*(1-u)}}
  if(i===1){if(name==='steel'){x-=170*(1-u)}if(name==='wood'){x+=170*(1-S((study.t-.18)/.9))}}
  if(i===6){let v=S(study.t/1.2);if(name==='steel'){x-=110*(1-v);rotation-=.12*(1-v)}if(name==='wood'){x+=110*(1-v);rotation+=.12*(1-v)}}
 }
 let isFigure=(name==='hand'&&w===920)||(name==='steel'&&w===1050);
 ctx.save();
 if(!isFigure&&time<6.8){const z=1+.12*E(time/3.3);ctx.translate(368,650);ctx.scale(z,z);ctx.translate(-368,-650);
  if(name==='hand')x+=260*(1-S((time-2.20)/.44));
  if(name==='steel'){x-=85*(1-E(time/.9));rotation-=.17*(1-E(time/.9));}
 }
 const original=images[name];if(flags.material_texture!==false)images[name]=varnish[name];oldImage(name,x,y,w,rotation,alpha);images[name]=original;
 ctx.restore();
};
lines=function(ss,x,y,size,color){if(study&&study.index===6){ss.forEach((line,i)=>{let a=S((study.t-i*.38)/.55);ctx.save();ctx.globalAlpha*=a;oldLines([line],x,y+i*size*1.09+40*(1-a),size,color);ctx.restore()});return;}ctx.save();ctx.translate(0,-65*(1-E((time-.1)/.85)));oldLines(ss,x,y,size,color);ctx.restore()};
// Finish contact and the paper's single launch in the measured voice pause.
heatPrint=function(level){if(flags.inspection_panel===false||time<=2.78)return;const u=S((time-2.78)/.38);ctx.save();ctx.translate(0,460*(1-u));ctx.globalAlpha*=Math.min(1,u*2);oldHeat(level);ctx.restore()};
arrow=function(x1,y1,x2,y2,color,width=7){let index=arrowIndex++,amount=S((time-(3.88+index*.23))/.48);if(time>=6.6)amount=S((time-(index===0?7.00:8.04))/.54);if(amount<=0)return;
 x2=x1+(x2-x1)*amount;y2=y1+(y2-y1)*amount;
 let pts=Array.from({length:18},(_,i)=>[x1+(x2-x1)*i/17,y1+(y2-y1)*i/17]);
 if(flags.edge_boil!==false)pts=ChannelFinishing.boilPath(pts,time,{amplitudePx:.65,fps:12,lockEnds:true});
 ChannelFinishing.drawInkStroke(ctx,pts,{color,width,bleedPx:flags.ink_bleed===false?0:1.1,bleedAlpha:.25});
 let angle=Math.atan2(y2-y1,x2-x1);ctx.beginPath();ctx.moveTo(x2-19*Math.cos(angle-.6),y2-19*Math.sin(angle-.6));ctx.lineTo(x2,y2);ctx.lineTo(x2-19*Math.cos(angle+.6),y2-19*Math.sin(angle+.6));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();
};
function render(target,t,options={}){ctx=target;time=t;flags=options;arrowIndex=0;heading=options.headings!==false;
 if(t<6.6){
  bg();
  // Stable composition and one crossfade instead of three hard headline swaps.
  const h=S((t-4.65)/.44);
  ctx.save();ctx.globalAlpha=1-h;lines(['Your hand','is warmer.'],560,240,66);ctx.restore();
  ctx.save();ctx.globalAlpha=h;lines(['Heat leaves','your skin.'],560,240,66);ctx.restore();
  contactPhoto(650);
  const c=S((t-3.24)/.46);if(c>0){ctx.save();ctx.globalAlpha=c;line(369,678,369+(340-369)*c,678+(1168-678)*c,C.yellow,3);ctx.restore();}
  // Construct all strokes continuously: adding a new line never restarts an earlier one.
  heatPrint(2);lane();foot();
 }else{
  rates();if(t>9.6){ctx.save();ctx.globalAlpha=S((t-9.6)/.45);tag('SAME STARTING TEMPERATURE',72,1640,710);ctx.restore();}
 }
}

function renderStudy(target,index,t,opts={}){ctx=target;time=100;flags=opts;arrowIndex=0;heading=opts.headings!==false;study={index,t};draws[index]();study=null;heading=true;}
return{render,renderStudy};
};
