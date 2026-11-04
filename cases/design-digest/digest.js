/* Design Digest case page: free-scroll board camera (board.json) + the shell's glass droplet cursor.
   Vanilla, no libraries. Values come from CSS tokens (DESIGN.md §2.0 and "Digest scope"). */
(()=>{
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const reduceMQ=matchMedia('(prefers-reduced-motion: reduce)');
const stackMQ=matchMedia('(max-width: 767px)');
const coarse=matchMedia('(pointer: coarse)').matches;

/* ---------- Kyiv clock (same as prototype) ---------- */
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
function tick(){let d;try{d=new Date(new Date().toLocaleString('en-US',{timeZone:'Europe/Kyiv'}));}catch(e){d=new Date();}
  const h=d.getHours(),m=String(d.getMinutes()).padStart(2,'0');const t=(h%12||12)+':'+m+(h<12?'am':'pm');
  $$('[data-time]').forEach(n=>n.textContent=t);$$('[data-date]').forEach(n=>n.textContent=d.getDate()+' '+months[d.getMonth()]+', '+d.getFullYear());}
tick();setInterval(tick,1000);

/* ---------- token helpers ---------- */
const digest=$('#digest'),board=$('#dgBoard'),world=$('#dgWorld'),live=$('#dgLive');
const tok=n=>getComputedStyle(digest).getPropertyValue(n).trim();
const ms=v=>v.endsWith('ms')?parseFloat(v):parseFloat(v)*1000;
// cubic-bezier(x1,y1,x2,y2) → easing fn, Newton steps with a bisection fallback
function bezier(css){const [x1,y1,x2,y2]=css.match(/-?[\d.]+/g).map(Number);
  const cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
  const X=t=>((ax*t+bx)*t+cx)*t,Y=t=>((ay*t+by)*t+cy)*t,dX=t=>(3*ax*t+2*bx)*t+cx;
  return x=>{if(x<=0)return 0;if(x>=1)return 1;let t=x;
    for(let i=0;i<8;i++){const e=X(t)-x,d=dX(t);if(Math.abs(e)<1e-5)return Y(t);if(Math.abs(d)<1e-6)break;t-=e/d;}
    let lo=0,hi=1;t=x;while(hi-lo>1e-5){X(t)<x?lo=t:hi=t;t=(lo+hi)/2;}return Y(t);};}

/* ---------- board ---------- */
const cam={x:0,y:0,W:0,H:0,vw:0,vh:0,order:[],anim:0,active:false};
let ease=t=>t,dur=600,pad=48,step=120;

function build(data){
  cam.W=data.board.w;cam.H=data.board.h;cam.order=data.order;
  world.style.setProperty('--w',cam.W+'px');world.style.setProperty('--h',cam.H+'px');
  world.textContent='';
  const byId={};data.sections.forEach(s=>byId[s.id]=s);
  const label=id=>(byId[id]||data.slots.find(s=>s.id===id)).label;
  const nextOf=id=>{const i=cam.order.indexOf(id),n=cam.order[(i+1)%cam.order.length];return{id:n,label:n===cam.order[0]?'Back to start':label(n)};};
  const nextBtn=id=>{const n=nextOf(id),b=document.createElement('button');
    b.type='button';b.className='pill dark arrow dg-next';b.dataset.goto=n.id;b.setAttribute('data-holo','md');
    b.innerHTML=`${n.id===cam.order[0]?'Back to start':'Next: '+n.label}<span class="bd"><svg class="ico r" aria-hidden="true"><use href="#i-r"/></svg></span>`;
    return b;};
  const approxTag=s=>s.approx?`<span class="dg-approx">approx: ${(s.approxFields||['all']).join(', ')}</span>`:'';
  // stack order on mobile follows the camera order
  cam.order.filter(id=>byId[id]).forEach(id=>{const s=byId[id],el=document.createElement('section');
    el.className='dg-sec';el.dataset.section=id;el.tabIndex=-1;el.setAttribute('aria-labelledby','dg-h-'+id);
    for(const [k,v] of Object.entries({'--x':s.x+'px','--y':s.y+'px','--w':s.w+'px','--h':s.h+'px','--aw':s.w,'--ah':s.h}))el.style.setProperty(k,v);
    el.innerHTML=`<span class="dg-meta">${s.id} · Figma “${s.figmaName}”</span><h3 id="dg-h-${id}">${s.label}</h3>`+
      `<span class="dg-meta">${s.w} × ${s.h} · x ${s.x} · y ${s.y}</span>${approxTag(s)}`;
    el.append(nextBtn(id));world.append(el);});
  data.slots.forEach(s=>{const host=world.querySelector(`[data-section="${s.parent}"]`);if(!host)return;
    const el=document.createElement('div');el.className='dg-slot';el.dataset.section=s.id;el.tabIndex=-1;
    el.setAttribute('role','group');el.setAttribute('aria-labelledby','dg-h-'+s.id);
    el.innerHTML=`<span class="dg-meta">${s.id} · slot in ${s.parent}</span><h4 id="dg-h-${s.id}">${s.label}</h4><span class="dg-meta">size TBD</span>`;
    el.append(nextBtn(s.id));host.append(el);});
  readTokens();setMode();goTo(cam.order[0],{instant:true,focus:false});
}

function readTokens(){ease=bezier(tok('--ease-spring')||'cubic-bezier(.22,1,.36,1)');dur=ms(tok('--dur-camera')||'600ms');
  pad=parseFloat(tok('--dg-cam-pad'))||48;step=parseFloat(tok('--dg-key-step'))||120;}
function measure(){cam.vw=board.clientWidth;cam.vh=board.clientHeight;}
// world smaller than the viewport on an axis → centre it; otherwise keep the view inside the world
const clamp=(v,size,view)=>size<=view?(size-view)/2:Math.min(Math.max(v,0),size-view);
function apply(){world.style.transform=`translate3d(${-cam.x}px,${-cam.y}px,0)`;}
function setCam(x,y){cam.x=clamp(x,cam.W,cam.vw);cam.y=clamp(y,cam.H,cam.vh);apply();}
function stop(){if(cam.anim){cancelAnimationFrame(cam.anim);cam.anim=0;}}
function panBy(dx,dy){stop();setCam(cam.x+dx,cam.y+dy);}
// world-space rect of any element inside the world (works for nested slots too)
function rectOf(el){const w=world.getBoundingClientRect(),r=el.getBoundingClientRect();return{x:r.left-w.left,y:r.top-w.top,w:r.width,h:r.height};}
function targetFor(r){
  const x=r.w+2*pad>cam.vw?r.x-pad:r.x+r.w/2-cam.vw/2;
  const y=r.h+2*pad>cam.vh?r.y-pad:r.y+r.h/2-cam.vh/2;
  return{x:clamp(x,cam.W,cam.vw),y:clamp(y,cam.H,cam.vh)};}

function goTo(id,{instant=false,focus=true}={}){
  const el=world.querySelector(`[data-section="${id}"]`);if(!el)return Promise.resolve(false);
  const done=()=>{if(focus)el.focus({preventScroll:true});live.textContent=el.querySelector('h3,h4').textContent;return true;};
  if(!cam.active){if(focus)el.scrollIntoView({behavior:reduceMQ.matches||instant?'auto':'smooth',block:'start'});return Promise.resolve(done());}
  stop();measure();const t=targetFor(rectOf(el));
  if(instant||reduceMQ.matches||dur<=0){setCam(t.x,t.y);return Promise.resolve(done());}
  const x0=cam.x,y0=cam.y,t0=performance.now();
  return new Promise(res=>{const f=now=>{const k=Math.min((now-t0)/dur,1),e=ease(k);
      setCam(x0+(t.x-x0)*e,y0+(t.y-y0)*e);
      if(k<1)cam.anim=requestAnimationFrame(f);else{cam.anim=0;res(done());}};
    cam.anim=requestAnimationFrame(f);});
}

function setMode(){cam.active=!stackMQ.matches;stop();
  if(cam.active){measure();setCam(cam.x,cam.y);}else world.style.transform='';}

/* input: wheel on both axes, drag, arrow keys; all no-ops in the mobile stack */
board.addEventListener('wheel',e=>{if(!cam.active||e.ctrlKey)return;e.preventDefault();
  const k=e.deltaMode===1?16:e.deltaMode===2?cam.vh:1;panBy(e.deltaX*k,e.deltaY*k);},{passive:false});
let drag=null;
// a press on the world focuses the board (for arrow keys), never a section, so focusin doesn't re-aim the camera mid-drag
board.addEventListener('mousedown',e=>{if(e.target.closest('button,a'))return;e.preventDefault();board.focus({preventScroll:true});});
board.addEventListener('pointerdown',e=>{if(!cam.active||e.button!==0||e.target.closest('button,a'))return;
  stop();drag={id:e.pointerId,x:e.clientX,y:e.clientY,cx:cam.x,cy:cam.y};board.setPointerCapture(e.pointerId);board.classList.add('is-dragging');});
board.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;setCam(drag.cx-(e.clientX-drag.x),drag.cy-(e.clientY-drag.y));});
const endDrag=e=>{if(!drag||e.pointerId!==drag.id)return;drag=null;board.classList.remove('is-dragging');};
board.addEventListener('pointerup',endDrag);board.addEventListener('pointercancel',endDrag);
const KEYS={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
// Tab into/inside the world: move focus ourselves with preventScroll, otherwise the browser scrolls the board and the page
const tabbables=()=>$$('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])').filter(n=>n.getClientRects().length);
document.addEventListener('keydown',e=>{if(e.key!=='Tab'||!cam.active||e.altKey||e.metaKey||e.ctrlKey)return;
  const list=tabbables(),next=list[list.indexOf(document.activeElement)+(e.shiftKey?-1:1)];
  if(!next||!world.contains(next))return;
  e.preventDefault();next.focus({preventScroll:true});goTo(next.closest('[data-section]').dataset.section,{focus:false});});
board.addEventListener('keydown',e=>{const d=KEYS[e.key];if(!cam.active||!d||e.altKey||e.metaKey||e.ctrlKey)return;
  e.preventDefault();panBy(d[0]*step,d[1]*step);});
board.addEventListener('click',e=>{const b=e.target.closest('[data-goto]');if(b)goTo(b.dataset.goto);});
// overflow:hidden still scrolls when focus lands off-screen; undo that and move the camera instead
board.addEventListener('scroll',()=>{board.scrollLeft=0;board.scrollTop=0;});
board.addEventListener('focusin',e=>{if(!cam.active||cam.anim||e.target===board||!e.target.matches(':focus-visible'))return;board.scrollLeft=0;board.scrollTop=0;
  const r=e.target.getBoundingClientRect(),b=board.getBoundingClientRect();
  if(r.left<b.left||r.top<b.top||r.right>b.right||r.bottom>b.bottom){
    const s=e.target.closest('[data-section]');if(s)goTo(s.dataset.section,{focus:false});}});
new ResizeObserver(()=>{if(cam.active){measure();setCam(cam.x,cam.y);}}).observe(board);
stackMQ.addEventListener('change',setMode);

$('#dgClose').addEventListener('click',()=>{const h=$('#intro-title');
  $('#intro').scrollIntoView({behavior:reduceMQ.matches?'auto':'smooth',block:'start'});h.focus({preventScroll:true});});

fetch('board.json').then(r=>{if(!r.ok)throw new Error(r.status);return r.json();}).then(build).catch(err=>{
  $('#dgStatus').textContent='Board data could not load. Serve the folder over http (file:// blocks fetch).';console.warn('board.json',err);});

window.camera={goTo,panBy,get x(){return cam.x},get y(){return cam.y},get bounds(){return{W:cam.W,H:cam.H,vw:cam.vw,vh:cam.vh}},get active(){return cam.active}};

/* ---------- glass droplet cursor (DESIGN.md §5.2), ported from prototype; off inside .digest ---------- */
const FX={dprMax:1.5,drop:{radius:{off:0,read:5,default:16,md:30,lg:72},follow:.2,grow:.12,magnet:.18,drawMin:.4,lensMin:2,settleMs:1200,box:192}};
const dc=$('#drop'),lens=$('#lens');
const gl=(!reduceMQ.matches&&!coarse)?dc.getContext('webgl',{premultipliedAlpha:true,alpha:true,antialias:false}):null;
if(!gl)return;
const DPR=()=>Math.min(devicePixelRatio||1,FX.dprMax);
const tasks=[];let looping=false,scrolled=false;
function wake(){if(looping||document.hidden)return;looping=true;requestAnimationFrame(frame);}
function frame(t){let busy=false;for(const fn of tasks.slice())busy=fn(t)||busy;scrolled=false;
  if(busy&&!document.hidden)requestAnimationFrame(frame);else looping=false;}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)wake();});
const ptr={x:-999,y:-999,has:false,seq:0,t:0};
addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;ptr.x=e.clientX;ptr.y=e.clientY;ptr.has=true;ptr.seq++;ptr.t=performance.now();wake();},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{ptr.has=false;ptr.seq++;wake();});
addEventListener('scroll',()=>{scrolled=true;wake();},{passive:true});
const V='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const F=`precision highp float;uniform vec2 uRes;uniform float uDpr;uniform vec2 uC;uniform float uR;uniform float uTime;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
vec3 film(float t){return .5+.5*cos(6.28318*(t+vec3(0.,.33,.67)));}
void main(){vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y)/uDpr;vec2 dv=p-uC;float d=length(dv);vec2 dir=dv/max(d,.001);float ang=atan(dir.y,dir.x);
 float wob=(noise(dir*1.7+vec2(uTime*.35,-uTime*.27))-.5)*.18+sin(ang*3.+uTime*.8)*.025;float rr=max(uR*(1.+wob),.001);float s=d/rr;
 if(uR<.5||s>1.08){gl_FragColor=vec4(0.);return;}
 float sc=clamp(s,0.,1.);float z=sqrt(max(1.-sc*sc,0.));vec2 lump=vec2(noise(dv/rr*1.4+uTime*.4),noise(dv/rr*1.4-uTime*.33+5.))-.5;
 vec3 n=normalize(vec3(dir*sc+lump*.4,z+.2));float fr=pow(sc,8.);
 vec3 irid=mix(film(ang/6.28318+uTime*.05+sc*.7+lump.x*1.2)*1.2,vec3(.3,.95,.9),.3);
 float spec=pow(max(dot(n,normalize(vec3(-.45,-.6,.9))),0.),36.);
 vec3 col=mix(vec3(.98,.99,1.),irid,fr*.9)+spec*.85;float alpha=.06+.8*fr+spec*.6;
 float aa=1.-smoothstep(1.,1.+1.6/rr,s);gl_FragColor=vec4(col*alpha*aa,alpha*aa);}`;
const mk=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o;};
const pr=gl.createProgram();gl.attachShader(pr,mk(gl.VERTEX_SHADER,V));gl.attachShader(pr,mk(gl.FRAGMENT_SHADER,F));gl.linkProgram(pr);gl.useProgram(pr);
const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
const al=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(al);gl.vertexAttribPointer(al,2,gl.FLOAT,false,0,0);
const U={};['uRes','uDpr','uC','uR','uTime'].forEach(n=>U[n]=gl.getUniformLocation(pr,n));gl.clearColor(0,0,0,0);
const S=FX.drop.box;let px=1;
function rs(){dc.width=dc.height=Math.round(S*DPR());dc.style.width=dc.style.height=S+'px';px=dc.width/S;gl.viewport(0,0,dc.width,dc.height);}
rs();addEventListener('resize',()=>{rs();ptr.seq++;wake();});
// zone lookup by hit-testing on pointer move only (no per-frame layout reads)
function zoneAt(x,y){if(!ptr.has)return{z:'off'};
  const el=document.elementFromPoint(x,y);if(!el||el.closest('.digest'))return{z:'off'};
  if(el.closest('[data-read]'))return{z:'read'};
  const h=el.closest('[data-holo]');if(!h)return{z:'default'};
  const b=h.getBoundingClientRect();return{z:h.dataset.holo==='lg'?'lg':'md',c:{cx:b.left+b.width/2,cy:b.top+b.height/2}};}
const drop={x:-999,y:-999,r:0},T0=performance.now();let dSeen=-1,zone={z:'off'},frozen=false;
function render(t){const left=Math.round(drop.x-S/2),top=Math.round(drop.y-S/2);
  dc.style.transform=`translate3d(${left}px,${top}px,0)`;gl.clear(gl.COLOR_BUFFER_BIT);
  if(drop.r>FX.drop.drawMin){gl.uniform2f(U.uRes,dc.width,dc.height);gl.uniform1f(U.uDpr,px);gl.uniform2f(U.uC,drop.x-left,drop.y-top);
    gl.uniform1f(U.uR,drop.r);gl.uniform1f(U.uTime,(t-T0)/1000);gl.drawArrays(gl.TRIANGLES,0,3);}
  const on=drop.r>FX.drop.lensMin;lens.style.opacity=on?'1':'0';
  if(on){const d=drop.r*2;lens.style.width=lens.style.height=d+'px';lens.style.transform=`translate3d(${drop.x-drop.r}px,${drop.y-drop.r}px,0)`;}}
tasks.push(t=>{
  if(ptr.seq!==dSeen||scrolled){dSeen=ptr.seq;zone=zoneAt(ptr.x,ptr.y);}
  const tr=FX.drop.radius[zone.z];let tx=ptr.x,ty=ptr.y;
  if(zone.z==='lg'){tx+=(zone.c.cx-tx)*FX.drop.magnet;ty+=(zone.c.cy-ty)*FX.drop.magnet;}
  if(drop.r<FX.drop.drawMin&&tr>0){drop.x=tx;drop.y=ty;}
  drop.x+=(tx-drop.x)*FX.drop.follow;drop.y+=(ty-drop.y)*FX.drop.follow;drop.r+=(tr-drop.r)*FX.drop.grow;
  const moving=Math.abs(tx-drop.x)>.1||Math.abs(ty-drop.y)>.1||Math.abs(tr-drop.r)>.05;
  const wobble=drop.r>FX.drop.drawMin&&t-ptr.t<FX.drop.settleMs;
  if(moving||wobble||!frozen){render(t);frozen=!moving&&!wobble;}
  return moving||wobble;});
})();
