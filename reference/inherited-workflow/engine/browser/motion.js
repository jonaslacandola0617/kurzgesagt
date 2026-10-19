/* Original channel timing adaptation. Tutorial curves were not recovered numerically. */
(function(root){
 const clamp=x=>Math.max(0,Math.min(1,x));
 function polynomial(s,a,b){return 3*(1-s)*(1-s)*s*a+3*(1-s)*s*s*b+s*s*s;}
 function derivative(s,a,b){return 3*(1-s)*(1-s)*a+6*(1-s)*s*(b-a)+3*s*s*(1-b);}
 function parameter(u,c){u=clamp(u);let lo=0,hi=1;for(let i=0;i<24;i++){let s=(lo+hi)/2;if(polynomial(s,c[0],c[2])<u)lo=s;else hi=s;}return(lo+hi)/2;}
 function validate(c){if(c.length!==4||!c.every(Number.isFinite)||c[0]<0||c[0]>1||c[2]<0||c[2]>1)throw Error('Invalid timing curve');}
 function ease(u,c=[.65,0,.35,1]){validate(c);if(u<=0)return 0;if(u>=1)return 1;return polynomial(parameter(u,c),c[1],c[3]);}
 function velocity(u,c){validate(c);let s=parameter(u,c);return derivative(s,c[1],c[3])/Math.max(1e-9,derivative(s,c[0],c[2]));}
 const peaks=new Map();
 function peak(c,samples=2048){validate(c);let key=c.join('/')+'/'+samples;if(peaks.has(key))return peaks.get(key);let best={u:0,speed:-Infinity};for(let i=0;i<=samples;i++){let u=i/samples,speed=Math.abs(velocity(u,c));if(speed>best.speed)best={u,speed};}peaks.set(key,best);return best;}
 function cut(t,{start,duration,curve=[.65,0,.35,1]}){if(duration<=0)throw Error('Invalid move duration');let p=peak(curve),u=clamp((t-start)/duration);return {u,progress:ease(u,curve),speed:velocity(u,curve)/duration,cutTime:start+p.u*duration,incoming:t>=start+p.u*duration,peakProgress:ease(p.u,curve)};}
 function sampledTime(t,fps=12){if(fps<=0)throw Error('Invalid sample cadence');return Math.floor((t+1e-9)*fps)/fps;}
 function hunt(t,{start,duration=.55,radii=[0,4,6,0],knots=[0,.3,.58,1]}){if(duration<=0||radii.length!==knots.length)throw Error('Invalid focus envelope');const u=(t-start)/duration;if(u<=0||u>=1)return 0;for(let i=1;i<knots.length;i++){if(u<=knots[i]){let v=clamp((u-knots[i-1])/(knots[i]-knots[i-1]));v=v*v*(3-2*v);return radii[i-1]+(radii[i]-radii[i-1])*v;}}return 0;}
 root.ChannelMotion={ease,velocity,peak,cut,sampledTime,hunt,curves:{cut:[.65,0,.35,1],fastSettle:[.18,0,.06,1]}};
})(globalThis);
