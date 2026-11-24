/* v508-camera: 순수 Node vm 카메라 순차 게이트. 실행: node scripts/camera_check.cjs */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'../royal-arena');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const files={a:read('js/g1a-art-assets.js'),b:read('js/g1b-art-assets.js'),c:read('js/g1c-art-assets.js'),wide:read('js/g9-wide.js'),camera:read('js/g11-camera.js'),tech:read('js/g10-techtree.js')};
const input=files.c.slice(files.c.indexOf('function evtPos('),files.c.indexOf('/* ---------- HUD ---------- */'));
const adapters=files.c.slice(files.c.indexOf('function raFocus('),files.c.indexOf('function loop('));
const damage=files.b.slice(files.b.indexOf('function dealDamage('),files.b.indexOf('function killUnit('));
const techDamage=files.tech.slice(files.tech.indexOf('var __dd0=window.dealDamage;'),files.tech.indexOf('/* ---------- 수리 오버라이드'));
const shoot=files.a.slice(files.a.indexOf('function shoot('),files.a.indexOf('function unitAtkFx('));
const hit=files.a.slice(files.a.indexOf('function hitTarget('));
const projs=files.b.slice(files.b.indexOf('function updateProjs('),files.b.indexOf('function castSpellBase('));
const finish=files.b.slice(files.b.indexOf('function finish('),files.b.indexOf('function fwVictory('));
const realLoop=files.c.slice(files.c.indexOf('function loop('),files.c.indexOf('buildCodex();',files.c.indexOf('function loop(')));
const start=files.c.slice(files.c.indexOf('function startMatch('),files.c.indexOf('function buildCodex('));
const fit=files.wide.slice(files.wide.indexOf('function __fitWide('),files.wide.indexOf('function __rollWide('));
const wideCheck=files.wide.slice(files.wide.indexOf('function __wideCheck('),files.wide.indexOf("window.addEventListener('resize'"));
let checks=0,groups=0;
function ok(value,message){ checks++; assert.ok(value,message); }
function eq(actual,expected,message){ checks++; assert.deepEqual(actual,expected,message); }
function near(actual,expected,epsilon=1e-9,message='오차 상한'){ checks++; assert.ok(Math.abs(actual-expected)<=epsilon,`${message}: ${actual} != ${expected}`); }
function gate(name,fn){ const before=checks; fn(); groups++; console.log(`PASS ${name} checks=${checks-before}`); }
function target(){
  const handlers=new Map();
  return {style:{},addEventListener(type,fn){ const hs=handlers.get(type)||[]; hs.push(fn); handlers.set(type,hs); },
    emit(type,event={}){ for(const fn of handlers.get(type)||[]) fn(event); },handlers};
}
function harness({width=306,height=544,vw=612,vh=1088,bitmap=2,map=true}={}){
  let stamp=0;
  const win=target(),doc=target(),cv=target(),capture=new Set(),ops=[];
  let rect={left:23,top:47,width,height,right:23+width,bottom:47+height};
  Object.assign(cv,{width:vw*bitmap,height:vh*bitmap,getBoundingClientRect:()=>rect,
    setPointerCapture:id=>capture.add(id),hasPointerCapture:id=>capture.has(id),releasePointerCapture:id=>capture.delete(id)});
  const g={clearRect(...a){ops.push(['clear',stamp,...a]);},fillRect(...a){ops.push(['fill',stamp,...a]);},strokeRect(...a){ops.push(['view',stamp,...a]);}};
  const minimap={width:120,height:88,getContext:()=>g};
  doc.hidden=false; doc.getElementById=id=>map&&id==='camera-minimap'?minimap:null;
  const math=Object.create(Math); math.random=()=>0.9;
  const context=vm.createContext({window:win,document:doc,canvas:cv,performance:{now:()=>stamp*1000},console,Math:math,
    W:612,H:1088,VW:vw,VH:vh,BAND:(vw-612)/2,VBAND:(vh-1088)/2,BSCALE:bitmap,COLS:18,ROWS:32,TILE:34,RIVER_Y0:15,RIVER_Y1:17,BLUE_DEPLOY_MIN:16.8,
    S:{scene:'battle',over:false,cam:{x:306,y:544,z:1},_now:0,_sk:{},theme:'classic',kills:{blue:0,red:0},deaths:{blue:0,red:0}},
    P:{sel:0,hand:['spell'],elixir:10},A:{},CARDS:{spell:{kind:'spell',cost:1}},ELEM_OF:{},PROJ_SFX_LAUNCH:{},units:[],towers:[],projs:[],floats:[],fx:[],parts:[],ambient:[],DPSW:{acc:{}},
    clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),lerp:(a,b,t)=>a+(b-a)*t,ELX_MAX:10,
    bgc:{width:0,height:0},ctx:{scale(){}},vig:null,
    ensureAudio(){},syncHand(){},toast(){},syncHUD(){},tutCombat(){},addParts(){},sfx(){},banner(){},
    drawStatic(){},relayoutHud(){},unitAtkFx(){},playHit(){},impactProj(){},killUnit(e){e.dead=true;},destroyTower(e){e.dead=true;},
    __raDiffDmg:()=>1,__raClearLv:()=>0,activeSlot:()=>0,applyRelics(){},applySkills(){},syncGradeVisual(){},
    initDeck(){},buildTowers(){},buildHandUI(){},show(scene){context.S.scene=scene;},bgmStart(){},bgmStop(){},
    playCard(p,index,x,y){context.deploys.push({index,x,y});},fireKingShot(p){context.kingShots.push(p);},deploys:[],kingShots:[],
    setInterval(){throw Error('카메라 폴링 금지');},setTimeout(){throw Error('카메라 타이머 금지');},requestAnimationFrame(){throw Error('별도 카메라 루프 금지');}});
  vm.runInContext(input+'\n'+adapters,context,{filename:'g1c-camera-source.js'});
  vm.runInContext(files.camera,context,{filename:'g11-camera.js'});
  vm.runInContext(damage+'\n'+shoot+'\n'+hit+'\n'+projs+'\n'+fit+'\n'+wideCheck,context,{filename:'source-adapters.js'});
  win.dealDamage=context.dealDamage;
  vm.runInContext(techDamage,context,{filename:'g10-final-damage-wrapper.js'});
  context.dealDamage=win.dealDamage;
  function event(x,y,id=1,extra={}){ return {clientX:x,clientY:y,pointerId:id,button:0,target:cv,preventDefault(){this.prevented=true;},...extra}; }
  function client(x,y){ const c=context.S.cam; return event(rect.left+((x*34-c.x)*c.z+context.VW/2)/context.VW*rect.width,rect.top+((y*34-c.y)*c.z+context.VH/2)/context.VH*rect.height); }
  const api=win.RACamera;
  return {c:context,api,cv,win,doc,ops,eval:code=>vm.runInContext(code,context),event,client,
    emit(type,e){ (type==='pointerdown'||type==='wheel'||type==='lostpointercapture'?cv:win).emit(type,e); },
    tick(dt=1/60){ stamp+=Number.isFinite(dt)&&dt>=0?dt:0; context.updateCam(dt); },
    wait(seconds){ stamp+=seconds; },now:()=>stamp,
    run(seconds,fn){ const n=Math.round(seconds*60); for(let i=0;i<n;i++){ if(fn)fn(i); stamp+=1/60; if(this.api&&this.api.snapshot().mode==='manual') this.api.setMode('manual');   /* v535 게이트 갱신: 수동 유지 시나리오는 '조작 있음'(idle 리셋)으로 규정 */ context.updateCam(1/60); } },
    runRaw(seconds){ const n=Math.round(seconds*60); for(let i=0;i<n;i++){ stamp+=1/60; context.updateCam(1/60); } },   /* v535: 조작 리셋 없는 순수 시간 진행 — 자동 복귀 검증용 */
    rect(value){rect={...rect,...value};rect.right=rect.left+rect.width;rect.bottom=rect.top+rect.height;},
    loadFinish(){
      // 자연 finish의 기존 보상/결과 연출 타이머만 기록한다. 카메라 모듈 자체의 타이머 금지 검사는 별도 유지.
      context.finishTimers=[];context.setTimeout=(fn,ms)=>{context.finishTimers.push({fn,ms});return context.finishTimers.length;};
      vm.runInContext(finish,context,{filename:'g1b-real-finish.js'});
    },
    loadLoop(){context.update=()=>{context.gameUpdates=(context.gameUpdates||0)+1;};context.render=()=>{};context.ctx.setTransform=()=>{};
      context.requestAnimationFrame=()=>{context.loopFrames=(context.loopFrames||0)+1;};
      vm.runInContext('let last=performance.now(),now=0;\n'+realLoop,context,{filename:'g1c-real-loop.js'});},
    frame(dt=1/60){stamp+=dt;context.loop(stamp*1000);},
    loadStart(){ const keep=context.setTimeout; context.setTimeout=()=>0; vm.runInContext(start,context); context.startMatch(); context.setTimeout=keep; }};
}
function pair(x=9,y=12,span=1,dmg=100){
  const a={x:x-span/2,y,team:'blue',hp:9999,maxHp:9999,r:.5,c:{cost:3,dmg,range:1}},b={x:x+span/2,y,team:'red',hp:9999,maxHp:9999,r:.5,c:{cost:3,dmg,range:1}};
  a.target=b;b.target=a;return [a,b];
}
function strike(h,p,dmg=100){ h.api._onDamage(p[1],dmg,p[0].team,false,p[0]); }
function validBounds(h){
  const s=h.api.snapshot(),c=h.c;
  ok([s.x,s.y,s.z,s.targetZ,s.targetX,s.targetY].every(Number.isFinite),'finite');
  const hw=c.VW/s.z/2,hh=c.VH/s.z/2;
  ok(hw*2>=c.W?Math.abs(s.x-c.W/2)<1e-7:s.x>=hw-1e-7&&s.x<=c.W-hw+1e-7,'가로 경계');
  ok(hh*2>=c.H?Math.abs(s.y-c.H/2)<1e-7:s.y>=hh-1e-7&&s.y<=c.H-hh+1e-7,'세로 경계');
}

console.log('CAMERA 순차 게이트 1 → 2 → 3 (브라우저·시각 검증 제외)');
gate('1.1 공개 API·모드 분리·범위',()=>{
  const h=harness(),a=h.api;
  for(const name of ['setMode','zoomBy','setIntensity','toggleMap','jumpTo','snapshot','reset','update']) eq(typeof a[name],'function',name);
  eq(a.snapshot().mode,'auto');near(a.snapshot().z,1);near(a.snapshot().targetZ,1);
  a.setMode('manual');a.zoomBy(100);near(a.snapshot().z,3);a.zoomBy(.00001);near(a.snapshot().z,1);
  a.zoomBy(2);a.jumpTo(.6,.7); const old=a.snapshot();
  const p=pair(); strike(h,p);h.c.raFocus(200,200,99,p[1],true);h.run(6);
  near(a.snapshot().z,old.z);near(a.snapshot().x,old.x);near(a.snapshot().y,old.y);eq(a.snapshot().tracking,false);
  a.setMode('overview');strike(h,p);h.c.raFocus(20,20,99,p[1],true);h.run(6);
  near(a.snapshot().z,1);near(a.snapshot().targetZ,1);near(a.snapshot().x,306);near(a.snapshot().y,544);eq(a.snapshot().tracking,false);
  a.jumpTo(.5,.8);eq(a.snapshot().mode,'manual');ok(a.snapshot().z>1,'전체보기에서 미니맵 이동 시 실제 이동 가능한 수동 줌');
  for(const invalid of [NaN,Infinity,-1,0]){const z=a.snapshot().z;a.zoomBy(invalid);near(a.snapshot().z,z);}
  const mode=a.snapshot().mode;a.setMode('wrong');eq(a.snapshot().mode,mode);
  const pos=a.snapshot();a.jumpTo(NaN,Infinity);near(a.snapshot().x,pos.x);near(a.snapshot().y,pos.y);
});
gate('1.2 실제 evtPos·단일 탭·카드 드래그 원점',()=>{
  const h=harness({width:360,height:511,vw:900,vh:1088,bitmap:3});
  h.api.setMode('manual');h.api.zoomBy(2);h.api.jumpTo(.5,.6);
  for(const [x,y] of [[9,20],[7,19],[10,22]]){const e=h.client(x,y),p=h.c.evtPos(e);near(p.x,x);near(p.y,y);}
  let e=h.client(9,20);const p=h.c.evtPos(e);h.emit('pointerdown',e);h.emit('pointerup',e);
  eq(h.c.deploys.length,1);near(h.c.deploys[0].x,p.x);near(h.c.deploys[0].y,p.y);eq(h.api.snapshot().mode,'manual');
  h.eval('dragFrom=0;dragPointerId=7;P.sel=0;');
  h.emit('pointerup',{...h.client(9,21),pointerId:8});eq(h.c.deploys.length,1,'다른 포인터가 카드 드래그 배치 불가');
  h.emit('pointerup',{...h.client(9,21),pointerId:7});eq(h.c.deploys.length,2,'기존 카드→전장 드래그 배치 유지');
  const a=harness(),p2=pair();strike(a,p2);const since=a.api.snapshot().trackingSince;
  a.emit('pointerdown',a.client(9,20));eq(a.api.snapshot().trackingSince,since);eq(a.api.snapshot().mode,'auto');
});
gate('1.3 드래그 CSS 배율·취소·휠·잔여 손가락 배치 차단',()=>{
  for(const bitmap of [1,2,3]){
    const h=harness({width:306,height:544,bitmap});h.api.setMode('manual');h.api.zoomBy(2);
    let e=h.event(170,300),before=h.api.snapshot();h.emit('pointerdown',e);e=h.event(190,310);h.emit('pointermove',e);const after=h.api.snapshot();
    near(after.x,before.x-20);near(after.y,before.y-10);h.emit('pointerup',e);eq(h.c.deploys.length,0);
    e=h.client(9,20);h.emit('pointerdown',e);h.emit('pointercancel',e);h.emit('pointerup',e);eq(h.c.deploys.length,0);
    e=h.client(9,20);h.emit('pointerdown',e);h.emit('lostpointercapture',e);h.emit('pointerup',e);eq(h.c.deploys.length,0);
    e=h.client(9,20);h.emit('pointerdown',e);const w={...e,deltaY:-100,deltaMode:0};h.emit('wheel',w);ok(w.prevented);h.emit('pointerup',e);eq(h.c.deploys.length,0);
    h.emit('pointerdown',h.event(150,280,1));h.emit('pointerdown',h.event(200,280,2));h.emit('pointercancel',h.event(200,280,2));
    h.emit('pointermove',h.event(153,281,1));h.emit('pointerup',h.event(153,281,1));eq(h.c.deploys.length,0,'취소 뒤 남은 손가락');
    h.emit('pointerdown',h.client(9,20));h.emit('pointerup',h.client(9,20));eq(h.c.deploys.length,1,'후속 정상 탭 복구');
  }
});
let maxAnchorError=0;
gate('1.4 핀치 중심점 고정·중심 이동·휠 anchor',()=>{
  for(const [width,height,vw,vh,bitmap] of [[306,544,612,1088,2],[360,480,816,1088,3],[420,710,612,1200,1]]){
    const h=harness({width,height,vw,vh,bitmap});h.api.setMode('manual');h.api.zoomBy(1.8);
    const x=23+width*.52,y=47+height*.51,delta=width*.1;
    const mid=h.event(x,y),anchor=h.c.evtPos(mid);
    h.emit('pointerdown',h.event(x-delta,y,11));h.emit('pointerdown',h.event(x+delta,y,12));
    h.emit('pointermove',h.event(x+delta*1.5,y+height*.015,12));
    const nextMid=h.event(x+delta*.25,y+height*.0075),result=h.c.evtPos(nextMid);
    maxAnchorError=Math.max(maxAnchorError,Math.hypot(anchor.x-result.x,anchor.y-result.y));
    near(result.x,anchor.x,1e-9);near(result.y,anchor.y,1e-9);ok(h.api.snapshot().z>1.8);
    h.emit('pointerup',h.event(x+delta*1.5,y+height*.015,12));h.emit('pointerup',h.event(x-delta,y,11));eq(h.c.deploys.length,0);
    const before=h.c.evtPos(mid);h.emit('wheel',{...mid,deltaY:-30,deltaMode:0});const after=h.c.evtPos(mid);near(after.x,before.x);near(after.y,before.y);
    validBounds(h);
  }
});
console.log(`METRIC pinch_anchor_max_error_tiles=${maxAnchorError.toExponential(4)}`);

gate('2.1 자동 중요도 임계값·주문·보스 제외',()=>{
  const h=harness(),p=pair();h.api.setIntensity('low');strike(h,p,10);eq(h.api.snapshot().tracking,false);
  strike(h,p,120);eq(h.api.snapshot().tracking,true);
  h.api.reset();h.api._onDamage(p[1],300,'blue',true,p[0]);eq(h.api.snapshot().tracking,false);
  h.c.S.boss=p[1];strike(h,p);h.c.raFocus(100,100,2,p[1],true);eq(h.api.snapshot().tracking,false);
  h.c.S.boss=p[0];strike(h,p);eq(h.api.snapshot().tracking,false);
  h.c.S.boss=null;h.c.S.spellQuiet=.2;strike(h,p);eq(h.api.snapshot().tracking,false);h.run(.3);strike(h,p);eq(h.api.snapshot().tracking,true);
});
let minDwell=Infinity,maxSpeed=0;
gate('2.2 가변 줌·bounding·deadzone·속도 상한·감시견 제거',()=>{
  for(const [intensity,min,max,speed] of [['low',1.2,1.5,85],['normal',1.3,2.5,136],['high',1.4,2,187]]){
    const h=harness(),p=pair(9,8,1);h.api.setIntensity(intensity);
    let prev=h.api.snapshot();h.run(8,i=>{
      if(i%20===0)strike(h,p,120);
      const current=h.api.snapshot(),v=Math.hypot(current.x-prev.x,current.y-prev.y)*60;
      maxSpeed=Math.max(maxSpeed,v);ok(v<=speed+1e-5,'팬 속도 상한');ok(current.z>=1-1e-9&&current.z<=max+1e-9,'자동 대기/전환 포함 범위');prev=current;
    });
    ok(h.api.snapshot().tracking,'3.5초 이후 지속 교전 유지');near(h.api.snapshot().targetZ,max);ok(h.api.snapshot().z>max-.01);
    h.run(8);eq(h.api.snapshot().tracking,false);near(h.api.snapshot().z,1,.001);near(h.api.snapshot().targetZ,1);near(h.api.snapshot().y,544,1);
  }
  const nearH=harness(),farH=harness();strike(nearH,pair(9,16,1),120);strike(farH,pair(9,16,12),120);nearH.tick();farH.tick();
  ok(nearH.api.snapshot().targetZ>farH.api.snapshot().targetZ,'공격자·대상 범위 커지면 자동 축소');
  const h=harness(),p=pair(9,16);strike(h,p);h.run(5,i=>{if(i%20===0)strike(h,p);});const before=h.api.snapshot();
  p[0].y+=.1;p[1].y+=.1;strike(h,p);h.tick();near(h.api.snapshot().targetY,before.y,1e-9,'deadzone 내부 이동 무시');
});
gate('2.3 최소 2초 체류·중요도 히스테리시스',()=>{
  const h=harness(),a=pair(9,8),b=pair(9,25);strike(h,a,100);const start=h.api.snapshot().trackingSince;
  h.run(1.9,i=>{if(i%15===0){strike(h,a,100);strike(h,b,300);}});eq(h.api.snapshot().trackingSince,start);
  h.run(.2,i=>{strike(h,b,300);if(i%10===0)strike(h,a,100);});const switched=h.api.snapshot().trackingSince;
  ok(switched>=2-1e-9,'2초 미만 전환 금지');minDwell=Math.min(minDwell,switched-start);
  const same=pair(9,7);h.run(2,i=>{if(i%15===0){strike(h,b,300);strike(h,same,100);}});near(h.api.snapshot().trackingSince,switched);
  const q=harness(),q1=pair(9,8),q2=pair(9,25);strike(q,q1,100);q.run(3,i=>{if(i%15===0){strike(q,q1,100);strike(q,q2,105);}});near(q.api.snapshot().trackingSince,0,1e-9,'유사 중요도 왕복 금지');
});
console.log(`METRIC minimum_dwell_seconds=${minDwell.toFixed(6)} max_observed_pan_px_per_second=${maxSpeed.toFixed(6)}`);

gate('2.4 원천 dealDamage·근접/투사체 출처 연결',()=>{
  const h=harness(),[a,b]=pair();h.c.units=[a,b];h.c.dealDamage(b,100,'blue',false,a);eq(h.api.snapshot().tracking,true);near(b.hp,9899);
  h.api.reset();h.c.hitTarget(a,b,100);eq(h.api.snapshot().tracking,true);
  h.api.reset();h.c.shoot(a,b,100,'arrow');eq(h.c.projs[0].source,a,'투사체 실제 출처');
  h.c.projs[0].x=b.x;h.c.projs[0].y=b.y-.2;h.c.updateProjs(.01);eq(h.api.snapshot().tracking,true);
  h.api.setMode('manual');const before=h.api.snapshot();h.c.dealDamage(b,100,'blue',false,a);h.run(4);near(h.api.snapshot().x,before.x);near(h.api.snapshot().z,before.z);
  h.api._bossDefeated();near(h.api.snapshot().x,before.x);near(h.api.snapshot().z,before.z);
  h.api.setMode('auto');strike(h,[a,b]);h.api._bossDefeated();eq(h.api.snapshot().tracking,false);strike(h,[a,b]);eq(h.api.snapshot().tracking,false);h.run(1.6);strike(h,[a,b]);eq(h.api.snapshot().tracking,true);
});
gate('2.5 종료·재시작·숨김/복귀·잘못된 수치·실제 g9 리사이즈',()=>{
  const h=harness();strike(h,pair());h.emit('pointerdown',h.client(9,20));h.c.S.over=true;h.tick();eq(h.api.snapshot().tracking,false);eq(h.api.snapshot().alert,null);eq(h.api._blocksDeploy(),false);
  h.c.S.over=false;h.loadStart();eq(h.api.snapshot().mode,'auto');near(h.api.snapshot().z,1);eq(h.api.snapshot().intensity,'normal');eq(h.c.P.sel,null);
  h.api.setMode('manual');h.api.zoomBy(1.5);h.api.jumpTo(.7,.6);const saved=h.api.snapshot();
  h.emit('pointerdown',h.client(9,20));h.doc.hidden=true;h.doc.emit('visibilitychange');h.wait(20);h.doc.hidden=false;h.doc.emit('visibilitychange');h.tick();
  eq(h.api._blocksDeploy(),false);near(h.api.snapshot().x,saved.x);near(h.api.snapshot().z,saved.z);eq(h.c.deploys.length,0);
  h.c.S.cam.x=Infinity;h.c.S.cam.y=NaN;h.c.S.cam.z=NaN;h.tick(NaN);validBounds(h);
  h.c.S.cam={x:Infinity,y:-Infinity,z:-Infinity};h.tick(Infinity);validBounds(h);
  h.api.setMode('auto');strike(h,pair());h.wait(30);h.c.updateCam(.016);eq(h.api.snapshot().tracking,false);validBounds(h);
  h.api.setMode('manual');h.api.zoomBy(2);h.api.jumpTo(1,1);const zoom=h.api.snapshot().z;h.rect({width:800,height:300});h.c.__fitWide();near(h.api.snapshot().z,zoom);validBounds(h);
  near(h.c.VW,2176);near(h.c.VH,1088);near(h.cv.width,h.c.VW*2);
  h.rect({width:280,height:850});h.c.__wideCheck();validBounds(h);near(h.api.snapshot().z,zoom);near(h.c.VH,1836);
  h.api.setMode('overview');h.c.__fitWide();h.tick();near(h.api.snapshot().z,1);validBounds(h);
  h.win.emit('blur');eq(h.api._blocksDeploy(),false);
});

gate('2.6 자동 idle/reset 1배·교전 범위·강도 세션 유지',()=>{
  const h=harness();eq(h.api.snapshot().intensity,'normal');
  for(const intensity of ['low','normal','high']){
    h.api.setIntensity(intensity);h.api.reset();h.run(4);
    eq(h.api.snapshot().mode,'auto');near(h.api.snapshot().z,1);near(h.api.snapshot().targetZ,1);eq(h.api.snapshot().intensity,intensity);
    strike(h,pair(),120);h.tick();const range={low:[1.2,1.5],normal:[1.3,2.5],high:[1.4,2]}[intensity];
    ok(h.api.snapshot().targetZ>=range[0]&&h.api.snapshot().targetZ<=range[1],'교전 targetZ만 강도 범위');
    h.api.setMode('manual');h.api.zoomBy(2);h.api.toggleMap();h.loadStart();
    eq(h.api.snapshot().mode,'auto');near(h.api.snapshot().z,1);near(h.api.snapshot().targetZ,1);eq(h.api.snapshot().mapOpen,false);eq(h.api.snapshot().intensity,intensity);
  }
  eq(harness().api.snapshot().intensity,'normal','새 페이지 모의 인스턴스는 기본 보통');
});
gate('2.7 실제 finish 승/패/무승부 즉시 종료·실제 loop 강제 종료',()=>{
  function ended(h){const s=h.api.snapshot();eq(s.mode,'overview');near(s.z,1);near(s.targetZ,1);near(s.x,306);near(s.y,544);eq(s.mapOpen,false);eq(s.alert,null);eq(s.tracking,false);eq(h.api._blocksDeploy(),false);validBounds(h);}
  for(const winner of ['blue','red','draw']){
    const h=harness();h.api.setIntensity('low');h.api.setMode('manual');h.api.zoomBy(3);h.api.jumpTo(.3,.7);h.api.toggleMap();h.emit('pointerdown',h.client(9,20));
    let notifications=0;h.api.subscribe(()=>notifications++);h.loadFinish();h.c.finish(winner);
    eq(h.c.S.over,true);eq(h.c.S.winner,winner);ended(h);eq(notifications,1,'finish 훅은 구독 직접 호출 안 함');
    h.run(.1);eq(notifications,2);h.c.finish(winner);h.run(.2);eq(notifications,2,'중복 finish/종료 update 무통지');eq(h.api.snapshot().intensity,'low');
    h.loadStart();near(h.api.snapshot().z,1);eq(h.api.snapshot().mode,'auto');eq(h.api.snapshot().intensity,'low');
  }
  const h=harness();h.api.setIntensity('high');h.api.setMode('manual');h.api.zoomBy(3);h.api.toggleMap();h.loadLoop();h.c.S.over=true;
  h.frame();ended(h);for(let i=0;i<95;i++)h.frame();ended(h);eq(h.c.loopFrames,96,'실제 루프는 over에도 다음 프레임 예약');eq(h.c.gameUpdates,96);
  h.api.zoomBy(3);h.api.toggleMap();h.frame();ended(h);eq(h.api.snapshot().intensity,'high','종료는 강도 설정 보존');
  h.loadStart();h.frame();eq(h.api.snapshot().mode,'auto');near(h.api.snapshot().z,1);near(h.api.snapshot().targetZ,1);
  console.log('METRIC forced_over_actual_loop_home_frames=1 natural_finish_home=immediate restart_idle_z=1');
});

gate('3.1 화면 밖 아군 타워 피격 2초·방향·정규화 이동',()=>{
  const h=harness();h.api.setMode('manual');h.api.zoomBy(2);h.api.jumpTo(.5,.25);
  const t={x:3.5,y:25.5,isTower:true,kind:'princess',team:'blue',hp:9999,maxHp:9999};h.c.towers=[t];
  h.c.dealDamage(t,100,'red');const alert=h.api.snapshot().alert;ok(alert);ok(alert.text.includes('아래'));near(alert.x,3.5/18);near(alert.y,25.5/32);
  h.run(1.99);ok(h.api.snapshot().alert);h.run(1/60);eq(h.api.snapshot().alert,null);
  h.c.dealDamage(t,100,'red');const jump=h.api.snapshot().alert;h.api.jumpTo(jump.x,jump.y);eq(h.api.snapshot().alert,null);near(h.api.snapshot().y,1088-1088/2/2);validBounds(h);
  h.api.reset();h.api.setMode('overview');h.c.dealDamage(t,100,'red');eq(h.api.snapshot().alert,null,'전체보기 내 타워 피격은 화면 밖 알림 없음');
  h.api.setMode('manual');h.api.zoomBy(2);h.api.jumpTo(.5,.25);t.team='red';h.api._onDamage(t,100,'blue');eq(h.api.snapshot().alert,null,'적 타워 제외');
  h.api.reset();h.api.setMode('manual');h.api.zoomBy(2);h.api.jumpTo(.5,.25);
  t.team='blue';h.api._onDamage(t,0,'red');eq(h.api.snapshot().alert,null,'무피해 제외');
});
let minimapFrames=0,minMapInterval=Infinity;
gate('3.2 미니맵 10Hz 이하·유닛/타워·view rect·폴링 없음',()=>{
  const h=harness();h.c.towers=[{x:3.5,y:25.5,team:'blue'},{x:14.5,y:6.5,team:'red'}];h.c.units=[{x:9,y:16,team:'blue'},{x:10,y:15,team:'red'},{x:5,y:5,dead:true}];
  h.run(1);eq(h.ops.length,0,'닫힌 미니맵은 그리지 않음');h.api.toggleMap();h.run(1);
  const clears=h.ops.filter(o=>o[0]==='clear');minimapFrames=clears.length;eq(minimapFrames,10);
  for(let i=1;i<clears.length;i++){const dt=clears[i][1]-clears[i-1][1];minMapInterval=Math.min(minMapInterval,dt);ok(dt>=.1-1e-8);}
  eq(h.ops.filter(o=>o[0]==='view').length,10);eq(h.ops.filter(o=>o[0]==='fill').length,60,'지면+강+타워2+유닛2');
  const view=h.ops.find(o=>o[0]==='view');near(view[2],0);near(view[4],120);near(view[5],88);
  h.api.toggleMap();const count=h.ops.length;h.run(1);eq(h.ops.length,count);
  const absent=harness({map:false});absent.api.toggleMap();absent.run(.5);eq(absent.ops.length,0);
  ok(!/setInterval\s*\(|setTimeout\s*\(|requestAnimationFrame\s*\(/.test(files.camera),'모듈 별도 타이머 없음');
});
console.log(`METRIC minimap_frames_per_second=${minimapFrames} minimum_render_interval_seconds=${minMapInterval.toFixed(6)}`);

gate('3.3 부모 UI 구독: 최초 1회·update 내 변경 시만·10Hz·해제',()=>{
  const h=harness();let count=0,last;const off=h.api.subscribe(s=>{count++;last=s;});eq(count,1);
  h.api.setMode('manual');h.api.zoomBy(1.1);h.api.setIntensity('high');h.api.toggleMap();
  eq(count,1,'API 명령은 구독자를 직접 호출하지 않음');h.run(5/60);eq(count,1,'최초 호출 후 100ms 이전 통지 없음');h.tick();eq(count,2);
  eq(last.mode,'manual');near(last.z,h.api.snapshot().z);eq(last.intensity,'high');eq(last.mapOpen,true);
  near(last.nx,last.x/612);near(last.ny,last.y/1088);
  const stable=count;h.run(2);eq(count,stable,'새 view 객체를 만들어도 동일 스냅샷 재통지 없음');
  h.api.setMode('manual');h.api.zoomBy(1);h.api.setIntensity('high');h.run(.2);eq(count,stable,'같은 값 명령 무통지');
  h.c.S.over=true;h.run(.2);eq(last.over,true);eq(count,stable+1);h.run(.2);eq(count,stable+1,'종료 중 중복 통지 없음');
  off();const before=count;h.c.S.over=false;h.api.reset();h.run(.2);eq(count,before,'구독 해제');
  const bad=h.api.subscribe(()=>{throw Error('UI 오류 격리');});let healthy=0;const good=h.api.subscribe(()=>healthy++);
  h.api.setMode('overview');h.run(.2);eq(healthy,2,'오류 구독자 뒤 정상 구독자는 수신');validBounds(h);bad();good();
  const invalid=h.api.subscribe(null);eq(typeof invalid,'function');invalid();
});
gate('3.4 구독 빈도·중간값 병합·콜백 객체/등록 격리',()=>{
  const h=harness();h.api.setMode('manual');const calls=[];
  const off=h.api.subscribe(s=>calls.push({time:h.now(),s}));
  h.run(1,()=>{h.api.zoomBy(1.001);h.api.setIntensity('low');});eq(calls.length,11,'최초 1회 + 1초 내 갱신 최대 10회');
  let minimum=Infinity;
  for(let i=1;i<calls.length;i++){const interval=calls[i].time-calls[i-1].time;minimum=Math.min(minimum,interval);ok(interval>=.1-1e-9,'통지 간격 >=100ms');}
  console.log(`METRIC subscribe_updates_per_second=${calls.length-1} minimum_callback_interval_seconds=${minimum.toFixed(6)}`);
  const n=calls.length;h.api.toggleMap();h.api.toggleMap();h.run(.2);eq(calls.length,n,'샘플 간 원상복귀한 값은 변경 통지 없음');off();
  const q=harness();let last,first=true;
  const mutate=q.api.subscribe(s=>{s.mode='tampered';s.view.x=999;first=false;});
  const observe=q.api.subscribe(s=>last=s);eq(first,false);eq(last.mode,'auto');ok(last.view.x!==999);
  q.api.setMode('manual');q.run(.2);eq(last.mode,'manual');ok(last.view.x!==999);eq(q.api.snapshot().mode,'manual');mutate();observe();
  let duplicate=0;const same=()=>duplicate++;const a=q.api.subscribe(same),b=q.api.subscribe(same);eq(duplicate,2);
  a();a();q.api.toggleMap();q.run(.2);eq(duplicate,3,'같은 함수 중복 등록도 개별 unsubscribe');b();
});
gate('3.5 구독 알림 정규화·만료·이동·확장 필드 변경',()=>{
  const h=harness();h.api.setMode('manual');h.api.zoomBy(2);h.api.jumpTo(.5,.25);let last,count=0;
  h.api.subscribe(s=>{last=s;count++;});eq(last.alert,null);
  const tower={x:3.5,y:25.5,team:'blue',isTower:true};h.api._onDamage(tower,100,'red');h.run(.1);
  ok(last.alert);near(last.alert.x,3.5/18);near(last.alert.y,25.5/32);ok(last.alert.x>=0&&last.alert.x<=1&&last.alert.y>=0&&last.alert.y<=1);
  const hitCount=count;h.run(1.8);eq(count,hitCount,'타이머 잔여값은 snapshot 밖이므로 중복 통지 없음');h.run(.1);eq(last.alert,null);eq(count,hitCount+1,'2초 만료 null 변경 통지');
  h.api._onDamage(tower,100,'red');h.run(.1);ok(last.alert);h.api.jumpTo(last.alert.x,last.alert.y);h.run(.1);eq(last.alert,null);eq(last.mode,'manual');
  const pos=last.y;h.api.jumpTo(.5,.5);h.run(.1);ok(last.y!==pos,'필수 UI 필드 외 좌표 변경도 통지');
});
gate('자동 복귀 경계에서도 팬/줌 속도 상한·비정상 대상 보호',()=>{
  for(const [intensity,speed,zoom] of [['low',85,.35],['normal',136,.5],['high',187,.7]]){
    const h=harness();h.api.setMode('manual');h.api.zoomBy(3);h.api.jumpTo(0,0);h.api.setIntensity(intensity);h.api.setMode('auto');
    let prev=h.api.snapshot();
    for(let i=0;i<360;i++){
      h.tick();const s=h.api.snapshot();ok(Math.hypot(s.x-prev.x,s.y-prev.y)*60<=speed+1e-5,'복귀 경계 팬 속도');ok(Math.abs(s.z-prev.z)*60<=zoom+1e-7,'줌 속도');prev=s;
    }
    const p=pair();strike(h,p);p[0].x=NaN;p[1].y=Infinity;p[0].r=Infinity;h.run(.2);validBounds(h);
  }
});
gate('피격 다중 타워 선택·화면 안 피격 후 화면 밖 이동',()=>{
  const h=harness();h.api.setMode('manual');h.api.zoomBy(2);h.api.jumpTo(.5,.25);
  const low={x:3.5,y:25.5,team:'blue',isTower:true},top={x:9,y:6,team:'blue',isTower:true};
  h.api._onDamage(low,100,'red');h.tick();h.api._onDamage(top,100,'red');
  const alert=h.api.snapshot().alert;near(alert.y,25.5/32,1e-9,'화면 안 최근 피격은 다른 화면 밖 경보를 가리지 않음');
  h.api.jumpTo(.5,.8);const moved=h.api.snapshot().alert;ok(moved);near(moved.y,6/32);ok(moved.text.includes('위'));
  h.run(2);eq(h.api.snapshot().alert,null);
});
gate('회귀 스트레스: 2400프레임·각 강도/모드·경계·취소',()=>{
  const h=harness();let seed=508;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<2400;i++){
    if(i%180===0)h.api.setMode(['auto','manual','overview'][Math.floor(rnd()*3)]);
    if(i%131===0)h.api.setIntensity(['low','normal','high'][Math.floor(rnd()*3)]);
    if(i%47===0)strike(h,pair(4+rnd()*10,4+rnd()*24,1+rnd()*8),50+rnd()*250);
    if(i%199===0)h.api.jumpTo(rnd(),rnd());
    if(i%67===0){h.emit('pointerdown',h.event(160,250,10));h.emit('pointerdown',h.event(210,255,11));h.emit('pointermove',h.event(215,257,11));h.emit('pointercancel',h.event(215,257,11));h.emit('pointerup',h.event(160,250,10));}
    h.tick();validBounds(h);const s=h.api.snapshot();
    if(s.mode==='overview')near(s.z,1);else if(s.mode==='auto'){const p={low:[1.2,1.5],normal:[1.3,1.8],high:[1.4,2]}[s.intensity];ok(s.z>=1-1e-9&&s.z<=p[1]+1e-9);}
  }
  eq(h.c.deploys.length,0,'스트레스 전 프레임 제스처 유령 배치 0');
  h.cv.width=0;h.cv.height=0;const p=h.c.evtPos(h.event(160,250));ok(Number.isFinite(p.x)&&Number.isFinite(p.y),'숨김 zero bitmap finite');
});

gate('통합 정적 게이트·실제 로딩 최종 정의 승자',()=>{
  const html=read('index.html'),sources=[...html.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/g)].map(m=>m[1].split('?')[0]);
  ok(sources.includes('js/g1c-art-assets.js'));ok(!sources.includes('js/g1-art-assets.js'));ok(sources.includes('js/g11-camera.js'),'부모의 신규 모듈 등록 확인');
  const names=['raFocus','updateCam','evtPos','forceHomeCam','dealDamage','startMatch'],winners={};
  for(const src of sources){
    if(!fs.existsSync(path.join(root,src))) continue;
    const text=read(src);new vm.Script(text,{filename:src});
    for(const name of names) if(new RegExp('function\\s+'+name+'\\s*\\(').test(text)) winners[name]=src;
  }
  eq(winners.raFocus,'js/g1c-art-assets.js');eq(winners.updateCam,'js/g1c-art-assets.js');eq(winners.evtPos,'js/g1c-art-assets.js');eq(winners.dealDamage,'js/g1b-art-assets.js');
  const chain=harness();ok(chain.c.dealDamage.toString().includes('__dd0(e,dmg,fromTeam,fromSpell,source)'),'g10 런타임 최종 래퍼 출처 전달');
  winners.dealDamage='js/g10-techtree.js wrapper -> js/g1b-art-assets.js';winners.startMatch='js/g9-wide.js wrapper -> js/g1c-art-assets.js';
  console.log('RUNTIME_SOURCE_WINNERS '+JSON.stringify(winners));
  new vm.Script(files.camera,{filename:'js/g11-camera.js'});
  ok(!files.c.includes('S._hiAge>3.5'),'3.5초 감시견 제거');ok(!files.c.includes("document.addEventListener('pointerdown',function(ev){ try{ if(S.scene!=="),'전역 터치 해제 제거');
  ok(!/createElement\(/.test(adapters),'카메라 어댑터 UI 생성 없음');ok(files.c.includes('RACamera.reset()'),'실제 startMatch 리셋');
  ok(files.b.includes('RACamera._bossDefeated()'),'실제 보스 처치 정책 연결');
});
gate('투사체 첫 프레임·정지 유성 방향 회귀',()=>{
  const code=files.c.slice(files.c.indexOf('function visAngle('),files.c.indexOf('function drawProj('));
  const c=vm.createContext({Math,Number});vm.runInContext(code,c);
  const run=p=>{c.p=p;return vm.runInContext('visAngle(p,p.x*34,p.y*34)',c);};
  for(const kind of ['fireball','meteorbit']){
    const p={kind,x:9,y:28,x1:9,y1:10};near(run(p),-Math.PI/2);near(run(p),-Math.PI/2);
    p.x+=.1;p.y-=.4;ok(Number.isFinite(run(p)),'이동 이후 유효 방향');
  }
  near(run({x:2,y:2,tx:5,ty:2}),0);near(run({x:2,y:2,tx:2,ty:6}),Math.PI/2);
  eq(run({x:2,y:2}),0,'좌표 스키마 부재는 프레임 0 안전 방향');
});

gate('1.9 수동관전 3초 무조작 자동 복귀(v535 사용자 지시)',()=>{
  const h=harness(),a=h.api;
  a.setMode('manual');a.zoomBy(2);h.runRaw(2.9);eq(a.snapshot().mode,'manual','2.9초 무조작은 수동 유지');
  h.runRaw(0.2);eq(a.snapshot().mode,'auto','누적 3.1초 무조작 시 자동관전 복귀');
  a.setMode('manual');h.runRaw(2.9);eq(a.snapshot().mode,'manual','재진입 시 타이머 리셋 확인');
});
console.log(`CAMERA_CHECK:PASS gates=${groups} assertions=${checks}`);
