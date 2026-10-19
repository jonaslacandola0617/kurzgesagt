// Deterministic timing contracts; does not certify moving art or sound quality.
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
vm.runInThisContext(fs.readFileSync(path.join(__dirname,'../browser/motion.js'),'utf8'));
const C=ChannelMotion,cut={start:9.22,duration:1.4,curve:C.curves.cut};
assert(Math.abs(C.cut(9.92,cut).cutTime-9.92)<1e-8);
assert.strictEqual(C.cut(297/30,cut).incoming,false);
assert.strictEqual(C.cut(298/30,cut).incoming,true);
assert.strictEqual(C.ease(0,C.curves.fastSettle),0);
assert.strictEqual(C.ease(1,C.curves.fastSettle),1);
let last=-1;
for(let i=0;i<=1000;i++){let u=i/1000,p=C.ease(u,C.curves.fastSettle);assert(p>=last&&p<=1);last=p;}
for(let t of [0,3.03,3.58,10])assert.strictEqual(C.hunt(t,{start:3.03,duration:.55}),0);
assert(C.hunt(3.03+.55*.58,{start:3.03,duration:.55})>5.99);
assert(C.sampledTime(1.01,12)===C.sampledTime(1.02,12));
console.log('Peak cut, monotonic settle, focus endpoints and local cadence PASS');
