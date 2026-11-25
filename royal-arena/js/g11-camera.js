/* v508-camera: 단일 카메라 상태. g1c/g1b/g9 뒤에 로드; UI 연결·타이머 없음. */
(function installRACamera(){
  'use strict';
  const profiles={
    low:{min:1.2,max:1.5,speed:2.5,zoom:0.35,threshold:1.65},
    normal:{min:1.3,max:2.5,speed:4,zoom:0.5,threshold:1.35},   /* v589: 교전 추적 줌 1.8→2.5(사용자 요청) — 기본 배경 targetZ=1은 불변 */
    high:{min:1.4,max:2,speed:5.5,zoom:0.7,threshold:1.2}
  };
  const finite=Number.isFinite, bound=(v,a,b)=>Math.max(a,Math.min(b,v));
  const clock=()=>performance.now()/1000;
  /* v508-camera-subscribe: 최초 1회 외에는 update에서만, 최대 10Hz·값 변경 시 통지. */
  const listeners=new Set(); let uiStamp=-Infinity;
  function publish(){
    const stamp=clock(); if(!listeners.size||stamp-uiStamp<0.1-1e-9) return;
    uiStamp=stamp; const key=JSON.stringify(snapshot());
    for(const entry of Array.from(listeners)){
      if(!listeners.has(entry)||entry.key===key||stamp-entry.stamp<0.1-1e-9) continue;
      entry.key=key; entry.stamp=stamp;
      // 구독자 간 객체 변조 전파 방지. 예외는 다른 구독자·게임 루프에 전파하지 않는다.
      try{ entry.fn(JSON.parse(key)); }catch(e){}
    }
  }
  function subscribe(fn){
    if(typeof fn!=='function') return ()=>{};
    const stamp=clock(),key=JSON.stringify(snapshot()),entry={fn,key,stamp};
    if(!listeners.size) uiStamp=stamp;
    listeners.add(entry);
    try{ fn(JSON.parse(key)); }catch(e){}
    return ()=>listeners.delete(entry);
  }
  const state={mode:'auto',intensity:'normal',mapOpen:false,targetX:W/2,targetY:H/2,targetZ:1,
    time:0,focus:null,pending:null,quietUntil:0,hits:new Map(),lastStamp:null,mapStamp:-Infinity,
    cam:null,active:false,manualZ:1.6,points:new Map(),gesture:null,suppressed:false,manualIdle:0};   // v535: manualIdle — 수동관전 무조작 경과(3초 후 자동 복귀)
  const profile=()=>profiles[state.intensity];
  const active=()=>S.scene==='battle'&&!S.over&&!document.hidden;
  function limits(z,x,y){
    z=finite(z)&&z>0?z:1; x=finite(x)?x:W/2; y=finite(y)?y:H/2;
    const hw=VW/z/2, hh=VH/z/2;
    return {x:hw*2>=W?W/2:bound(x,hw,W-hw),y:hh*2>=H?H/2:bound(y,hh,H-hh)};
  }
  function camera(){
    const c=S.cam||(S.cam={x:W/2,y:H/2,z:1});
    c.z=bound(finite(c.z)?c.z:1,1,3);
    const p=limits(c.z,finite(c.x)?c.x:W/2,finite(c.y)?c.y:H/2);
    c.x=p.x; c.y=p.y;
    return c;
  }
  function clearFocus(){ state.focus=null; state.pending=null; S.focus=null; }
  function cancelCardDrag(){
    if(typeof dragFrom!=='undefined') dragFrom=-1;
    if(typeof dragPointerId!=='undefined') dragPointerId=null;
  }
  function cancelInput(){
    const ids=Array.from(state.points.keys());
    state.points.clear(); state.gesture=null; state.suppressed=false; S._pan=null;
    cancelCardDrag();
    for(const id of ids) try{ if(canvas.hasPointerCapture&&canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id); }catch(e){}
  }
  function aim(x,y,z){
    z=bound(finite(z)?z:1,1,3);
    const p=limits(z,x,y); state.targetX=p.x; state.targetY=p.y; state.targetZ=z;
  }
  function reset(){
    // reset는 경기 상태만 초기화한다. 선택 강도는 현재 페이지의 다음 경기에도 유지(영구 저장 없음).
    cancelInput(); clearFocus(); state.mode='auto'; state.mapOpen=false;
    state.time=0; state.quietUntil=0; state.hits.clear(); state.lastStamp=clock(); state.mapStamp=-Infinity;
    state.manualZ=1.6; state.cam=S.cam={x:W/2,y:H/2,z:1};
    state.active=active(); aim(W/2,H/2,state.cam.z);
    S.focusGap=0; S.zHold=0; S._hiAge=0; S._zSpot=null; S._now=0;
    return snapshot();
  }
  function matchEnd(){
    // 자연 finish 훅과 S.over 감지 모두 사용. 반복 호출해도 같은 종료 상태로 수렴한다.
    cancelInput(); clearFocus(); state.hits.clear(); state.mapOpen=false; state.active=false;
    state.mode='overview'; state.quietUntil=0;
    const c=camera(); c.x=W/2; c.y=H/2; c.z=1; aim(c.x,c.y,1);
    return snapshot();
  }
  function setMode(mode){
    if(!['auto','manual','overview'].includes(mode)) return snapshot();
    const c=camera();
    if(state.mode==='manual') state.manualZ=c.z;
    clearFocus(); state.mode=mode; state.manualIdle=0;   // v535
    if(mode==='overview'){ c.z=1; c.x=W/2; c.y=H/2; }
    else if(mode==='auto'){ c.z=bound(c.z,1,profile().max); }
    else c.z=bound(c.z,1,3);
    const p=limits(c.z,c.x,c.y); c.x=p.x; c.y=p.y;
    aim(mode==='auto'?W/2:c.x,mode==='auto'?H/2:c.y,mode==='auto'?1:c.z);
    return snapshot();
  }
  function zoomBy(factor){
    if(!finite(factor)||factor<=0) return snapshot();
    state.manualIdle=0;   // v535
    if(state.mode!=='manual') setMode('manual');
    const c=camera(); c.z=bound(c.z*factor,1,3);
    const p=limits(c.z,c.x,c.y); c.x=p.x; c.y=p.y;
    state.manualZ=c.z; aim(c.x,c.y,c.z);
    return snapshot();
  }
  function jumpTo(nx,ny){
    if(!finite(nx)||!finite(ny)) return snapshot();
    const wasOverview=state.mode==='overview';
    setMode('manual'); const c=camera();
    if(wasOverview||c.z<=1) c.z=bound(state.manualZ>1?state.manualZ:1.6,1,3);
    const p=limits(c.z,bound(nx,0,1)*W,bound(ny,0,1)*H);
    c.x=p.x; c.y=p.y; state.manualZ=c.z; aim(c.x,c.y,c.z);
    return snapshot();
  }
  function setIntensity(value){
    if(!Object.prototype.hasOwnProperty.call(profiles,value)) return snapshot();
    state.intensity=value;
    if(state.mode==='auto'){
      const c=camera(); c.z=bound(c.z,1,profile().max);
      aim(state.focus?state.targetX:W/2,state.focus?state.targetY:H/2,state.focus?bound(state.targetZ,profile().min,profile().max):1);
      const p=limits(c.z,c.x,c.y); c.x=p.x; c.y=p.y;
    }
    return snapshot();
  }
  function toggleMap(){ state.mapOpen=!state.mapOpen; return snapshot(); }
  function visible(x,y){
    const c=camera();
    return Math.abs(x-c.x)<=VW/c.z/2&&Math.abs(y-c.y)<=VH/c.z/2;
  }
  function alert(){
    if(!active()) return null;
    let h=null;
    for(const [tower,hit] of state.hits){
      if(tower.team!=='blue'||clock()+1e-9>=hit.until||visible(hit.x,hit.y)) continue;
      if(!h||hit.until>h.until) h=hit;
    }
    if(!h) return null;
    const c=camera(), dx=h.x-c.x, dy=h.y-c.y;
    const horizontal=Math.abs(dx)>VW/c.z/2?(dx<0?'왼쪽':'오른쪽'):'';
    const vertical=Math.abs(dy)>VH/c.z/2?(dy<0?'위':'아래'):'';
    // alert.x/y는 jumpTo(nx,ny)에 그대로 전달하는 월드 정규화 좌표(0..1).
    return {text:'아군 타워 피격 · '+[vertical,horizontal].filter(Boolean).join(' '),x:bound(h.x/W,0,1),y:bound(h.y/H,0,1)};
  }
  function snapshot(){
    const c=camera();
    return {mode:state.mode,z:c.z,targetZ:state.targetZ,intensity:state.intensity,mapOpen:state.mapOpen,
      alert:alert(),x:c.x,y:c.y,nx:c.x/W,ny:c.y/H,over:!!S.over,targetX:state.targetX,targetY:state.targetY,
      view:{x:(c.x-VW/c.z/2)/W,y:(c.y-VH/c.z/2)/H,w:VW/c.z/W,h:VH/c.z/H},
      tracking:!!state.focus,trackingSince:state.focus?state.focus.entered:null};
  }
  function entityPoint(e){
    return e&&finite(e.x)&&finite(e.y)?{x:e.x*TILE,y:e.y*TILE}:null;
  }
  function boss(e){ return !!e&&(e===S.boss||e.key==='boss'||e.isBoss===true); }
  function eventFrame(a,b,score){
    const pa=entityPoint(a),pb=entityPoint(b);
    if(!pa||!pb||boss(a)||boss(b)) return null;
    return {a,b,x:(pa.x+pb.x)/2,y:(pa.y+pb.y)/2,score,lastHit:state.time,expires:state.time+1.25};
  }
  function offer(event){
    if(!event||state.mode!=='auto'||!active()||state.time<state.quietUntil||S.focusGap>0||S.spellQuiet>0||event.score<profile().threshold) return false;
    const f=state.focus;
    if(!f){ state.focus=Object.assign(event,{entered:state.time}); return true; }
    const same=(f.a===event.a&&f.b===event.b)||(f.a===event.b&&f.b===event.a);
    if(same||Math.hypot(f.x-event.x,f.y-event.y)<TILE*3){
      state.focus=Object.assign(event,{entered:f.entered,score:Math.max(event.score,f.score*0.98)}); return true;
    }
    // 전환은 updateCam의 시간축에서만; 최소 2초 체류 + 중요도 히스테리시스.
    if(!state.pending||state.pending.expires<state.time||event.score>=state.pending.score) state.pending=event;
    return false;
  }
  function onDamage(e,dmg,fromTeam,fromSpell,source){
    if(!active()||!e||!finite(dmg)||dmg<=0) return;
    const p=entityPoint(e);
    if(e.isTower&&e.team==='blue'&&fromTeam==='red'&&p) state.hits.set(e,{x:p.x,y:p.y,until:clock()+2});
    if(state.mode!=='auto'||fromSpell===true) return;
    if(boss(e)||boss(source)){   /* v595: 보스 교전 줌인(사용자 요청) — 보스 전용 고점수 이벤트로 추적 */
      const bE=boss(e)?e:source, other=boss(e)?(source||(e.target&&e.target.team!==e.team&&!e.target.dead?e.target:null)):(e&&!e.dead?e:null);
      const pe=entityPoint(bE); if(!pe) return;
      const po=other?entityPoint(other):null;
      offer({a:bE,b:other||bE,x:po?(pe.x+po.x)/2:pe.x,y:po?(pe.y+po.y)/2:pe.y,score:3.2+Math.min(dmg,300)/150,lastHit:state.time,expires:state.time+1.6});
      return;
    }
    // 실제 근접/투사체 출처 우선. 출처 없는 오래된 호출은 반격 대상만 사용한다.
    const attacker=source||(e.target&&e.target.team===fromTeam?e.target:null);
    if(!attacker||attacker.team===e.team||boss(attacker)) return;
    const score=1+Math.min(dmg,300)/120+(e.isTower?2:0)+((attacker.c&&attacker.c.cost>=5)?0.4:0);
    offer(eventFrame(attacker,e,score));
  }
  function legacyFocus(x,y,dur,v){
    // force 인수도 모드·보스 정책을 우회하지 않는다. 구 x/y는 월드 픽셀.
    if(!v||v.dead||boss(v)||!finite(x)||!finite(y)) return false;
    const other=v.target&&!v.target.dead?v.target:null;
    return offer(eventFrame(other||v,v,2));
  }
  function bossDefeated(){
    if(state.mode==='auto'){ clearFocus(); state.quietUntil=state.time+1.5; aim(W/2,H/2,1); }
  }
  function frameFocus(){
    let f=state.focus, p=state.pending;
    if(p&&p.expires<state.time) state.pending=p=null;
    if(f&&state.time-f.entered>=2-1e-9&&p&&(f.expires<state.time||p.score>f.score*1.35+0.15)){
      state.focus=f=Object.assign(p,{entered:state.time}); state.pending=null;
    }
    if(f&&state.time>=Math.max(f.entered+2,f.expires)){ state.focus=f=null; }
    if(!f){ aim(W/2,H/2,1); return; }
    const pa=entityPoint(f.a),pb=entityPoint(f.b);
    // 사망·잘못된 좌표는 마지막 유효 프레임으로 감쇠; 추적 수명은 피격 이벤트만 갱신.
    if(pa&&pb&&!f.a.dead&&!f.b.dead){ f.x=(pa.x+pb.x)/2; f.y=(pa.y+pb.y)/2; }
    const dx=pa&&pb&&!f.a.dead&&!f.b.dead?Math.abs(pa.x-pb.x):0;
    const dy=pa&&pb&&!f.a.dead&&!f.b.dead?Math.abs(pa.y-pb.y):0;
    const ar=finite(f.a.r)?bound(f.a.r,0,4):0.5,br=finite(f.b.r)?bound(f.b.r,0,4):0.5;
    const padding=TILE*(4+2*Math.max(ar,br));
    const desiredZ=bound(Math.min(VW/(dx+padding),VH/(dy+padding)),profile().min,profile().max);
    const c=camera(), zx=VW/c.z*0.10, zy=VH/c.z*0.10;
    const tx=Math.abs(f.x-c.x)>zx?f.x-Math.sign(f.x-c.x)*zx:c.x;
    const ty=Math.abs(f.y-c.y)>zy?f.y-Math.sign(f.y-c.y)*zy:c.y;
    aim(tx,ty,Math.abs(desiredZ-state.targetZ)>0.08?desiredZ:bound(state.targetZ,profile().min,profile().max));
  }
  function stepCamera(dt){
    const c=camera(), p=profile(), maxMove=p.speed*TILE*dt;
    const k=1-Math.exp(-3*dt), kz=1-Math.exp(-2.4*dt);
    let dx=(state.targetX-c.x)*k,dy=(state.targetY-c.y)*k;
    const length=Math.hypot(dx,dy);
    if(length>maxMove&&length>0){ dx*=maxMove/length; dy*=maxMove/length; }
    const dz=bound((state.targetZ-c.z)*kz,-p.zoom*dt,p.zoom*dt);
    function candidate(t){ const z=c.z+dz*t; return Object.assign(limits(z,c.x+dx*t,c.y+dy*t),{z}); }
    let next=candidate(1);
    // 줌아웃의 경계 클램프도 팬 속도 상한에 포함한다(리사이즈는 별도 즉시 경계 보정).
    if(Math.hypot(next.x-c.x,next.y-c.y)>maxMove+1e-8){
      let lo=0,hi=1;
      for(let i=0;i<20;i++){ const mid=(lo+hi)/2, q=candidate(mid); if(Math.hypot(q.x-c.x,q.y-c.y)>maxMove) hi=mid; else lo=mid; }
      next=candidate(lo);
    }
    c.x=next.x; c.y=next.y; c.z=next.z;
  }
  function drawMap(stamp){
    if(!state.mapOpen||stamp-state.mapStamp<0.1-1e-8) return;
    const map=document.getElementById('camera-minimap'); if(!map||!map.getContext) return;
    const g=map.getContext('2d'); if(!g) return;
    state.mapStamp=stamp; const mw=map.width,mh=map.height;
    g.clearRect(0,0,mw,mh); g.fillStyle='#172534'; g.fillRect(0,0,mw,mh);
    g.fillStyle='#42647a'; g.fillRect(0,RIVER_Y0/ROWS*mh,mw,(RIVER_Y1-RIVER_Y0)/ROWS*mh);
    for(const t of towers){ const p=entityPoint(t); if(!p||t.dead) continue; g.fillStyle=t.team==='blue'?'#82c9ff':'#ff8c80'; g.fillRect(p.x/W*mw-2,p.y/H*mh-2,4,4); }
    for(const u of units){ const p=entityPoint(u); if(!p||u.dead) continue; g.fillStyle=u.team==='blue'?'#82c9ff':'#ff8c80'; g.fillRect(p.x/W*mw-1,p.y/H*mh-1,2,2); }
    const c=camera(), x0=bound((c.x-VW/c.z/2)/W,0,1),y0=bound((c.y-VH/c.z/2)/H,0,1);
    const x1=bound((c.x+VW/c.z/2)/W,0,1),y1=bound((c.y+VH/c.z/2)/H,0,1);
    g.strokeStyle='#fff0b0'; g.lineWidth=1; g.strokeRect(x0*mw,y0*mh,(x1-x0)*mw,(y1-y0)*mh);
  }
  function resize(){
    cancelInput(); const c=camera(); aim(state.targetX,state.targetY,state.targetZ);
    state.cam=c; // 새 VW/VH를 즉시 적용하되 모드·수동 줌은 보존.
  }
  function update(dt){
    const stamp=clock(), raw=finite(dt)&&dt>=0?dt:0, gap=state.lastStamp===null?0:stamp-state.lastStamp;
    state.lastStamp=stamp;
    if(S.cam!==state.cam){
      // 재시작 또는 외부에서 교체된 카메라: 이전 경기 포커스/손가락/알림 누출 금지.
      cancelInput(); clearFocus(); state.hits.clear(); state.cam=camera();
      if(state.mode==='auto') state.cam.z=bound(state.cam.z,1,profile().max);
      aim(state.cam.x,state.cam.y,state.mode==='overview'?1:state.cam.z);
    }
    const c=camera(), running=active();
    // g1c.loop는 S.over에도 updateCam(real)을 호출한다. active의 조기반환 전에 종료 처리.
    if(S.over){ matchEnd(); publish(); return; }
    if(!running){
      if(state.active){ clearFocus(); cancelInput(); state.hits.clear(); }
      state.active=false; publish(); return;
    }
    state.active=true;
    if(raw>0.5||gap>1||gap<0){ clearFocus(); cancelInput(); state.hits.clear(); dt=0; }
    else dt=Math.min(raw,0.05);
    state.time+=dt; S._now=(finite(S._now)?S._now:0)+dt;
    if(state.mode==='manual'&&state.active){ if(state.points.size) state.manualIdle=0; else{ state.manualIdle+=dt; if(state.manualIdle>=3) setMode('auto'); } }   // v535: 수동관전 3초 무조작 시 자동관전 복귀(사용자 지시)
    if(S.focusGap>0) S.focusGap=Math.max(0,S.focusGap-dt);
    if(S.spellQuiet>0) S.spellQuiet=Math.max(0,S.spellQuiet-dt);
    S.focus=null;
    for(const [tower,hit] of state.hits) if(stamp+1e-9>=hit.until) state.hits.delete(tower);
    if(state.mode==='overview'){ c.z=1; c.x=W/2; c.y=H/2; aim(c.x,c.y,1); }
    else if(state.mode==='auto'){
      c.z=bound(c.z,1,profile().max);
      const p=limits(c.z,c.x,c.y); c.x=p.x; c.y=p.y;
      frameFocus(); stepCamera(dt);
    }
    else { c.z=bound(c.z,1,3); aim(c.x,c.y,c.z); }
    drawMap(stamp); publish();
  }
  function screen(e){
    const r=canvas.getBoundingClientRect();
    if(!(r.width>0&&r.height>0&&canvas.width>0&&canvas.height>0)||!finite(e.clientX)||!finite(e.clientY)) return null;
    // 비트맵은 BSCALE 배. 렌더의 논리 VW/VH로 환원해야 고DPI에서 2배 오차가 없다.
    const sx=(e.clientX-r.left)*canvas.width/r.width/(canvas.width/VW);
    const sy=(e.clientY-r.top)*canvas.height/r.height/(canvas.height/VH);
    return {x:sx,y:sy};
  }
  function clientToWorld(e){
    const q=screen(e),c=camera(); if(!q) return {x:c.x/TILE,y:c.y/TILE};
    return {x:((q.x-VW/2)/c.z+c.x)/TILE,y:((q.y-VH/2)/c.z+c.y)/TILE};
  }
  function anchorZoom(factor,before,after){
    const q=screen(after); if(!q||!finite(factor)||factor<=0) return;
    const c=camera(); if(state.mode!=='manual') setMode('manual');
    c.z=bound(c.z*factor,1,3);
    const p=limits(c.z,before.x*TILE-(q.x-VW/2)/c.z,before.y*TILE-(q.y-VH/2)/c.z);
    c.x=p.x; c.y=p.y; state.manualZ=c.z; aim(c.x,c.y,c.z);
  }
  function midpoint(){
    const ps=Array.from(state.points.values()),a=ps[0],b=ps[1];
    return {clientX:(a.x+b.x)/2,clientY:(a.y+b.y)/2,distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y))};
  }
  function beginPinch(){
    state.suppressed=true; cancelCardDrag(); setMode('manual');
    const mid=midpoint(); state.gesture={mid,anchor:clientToWorld(mid)};
  }
  function inside(e){ const r=canvas.getBoundingClientRect(); return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom; }
  function pointerDown(e){
    if(!active()||(e.button!=null&&e.button!==0)||!finite(e.clientX)||!finite(e.clientY)) return;
    if(state.points.size===0){ state.suppressed=false; state.gesture=null; } state.manualIdle=0;   // v535
    if(state.mode==='auto'&&state.focus&&state.points.size===0){ clearFocus(); state.pending=null; state.quietUntil=state.time+0.4; aim(W/2,H/2,1); }   /* v595: 줌 추적 중 화면 터치 → 1.0배 복귀(사용자 요청) */
    state.points.set(e.pointerId,{x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false});
    try{ canvas.setPointerCapture(e.pointerId); }catch(err){}
    if(state.points.size>=2){ beginPinch(); e.preventDefault(); }
  }
  function pointerMove(e){
    const p=state.points.get(e.pointerId); if(!p) return;
    if(!finite(e.clientX)||!finite(e.clientY)){ state.suppressed=true; cancelCardDrag(); return; }
    if(!active()){ cancelInput(); return; }
    const dx=e.clientX-p.x,dy=e.clientY-p.y;
    p.x=e.clientX; p.y=e.clientY; state.manualIdle=0;   // v535
    if(state.points.size>=2){
      if(!state.gesture) beginPinch();
      const mid=midpoint(),old=state.gesture;
      anchorZoom(mid.distance/old.mid.distance,old.anchor,mid);
      state.gesture={mid,anchor:clientToWorld(mid)}; e.preventDefault(); return;
    }
    if(Math.hypot(p.x-p.startX,p.y-p.startY)>8) p.moved=true;
    if(p.moved){
      state.suppressed=true; cancelCardDrag(); if(state.mode!=='manual') setMode('manual');
      const r=canvas.getBoundingClientRect(),c=camera();
      const q=limits(c.z,c.x-dx*VW/Math.max(1,r.width)/c.z,c.y-dy*VH/Math.max(1,r.height)/c.z);
      c.x=q.x; c.y=q.y; aim(c.x,c.y,c.z); e.preventDefault();
    }
  }
  function pointerUp(e,cancelled){
    const p=state.points.get(e.pointerId);
    if(!p) return state.points.size? 'suppress':null;
    const tap=!cancelled&&!state.suppressed&&!p.moved&&state.points.size===1&&inside(e)&&active()&&Math.hypot(e.clientX-p.startX,e.clientY-p.startY)<=8;
    if(cancelled){ state.suppressed=true; cancelCardDrag(); }
    /* v596: 수동 모드 줼 상태 탭 → 1.0배+자동 관전 복귀(사용자 제보 — v595는 auto 추적 중만 커버). 카드 선택 탭 배치는 제외 */
    if(!cancelled&&!p.moved&&state.points.size===1&&state.mode==='manual'){ const c=camera(); if(c.z>1.05&&!(typeof P!=='undefined'&&P&&P.sel!=null)) setMode('auto'); }   /* v596b: inside 의존 제거 — 이동 없는 탭이면 복귀 */
    state.points.delete(e.pointerId);
    try{ if(canvas.hasPointerCapture&&canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId); }catch(err){}
    if(state.points.size>=2) beginPinch();
    else {
      state.gesture=null;
      for(const remaining of state.points.values()){ remaining.startX=remaining.x; remaining.startY=remaining.y; remaining.moved=false; }
      if(!state.points.size) state.suppressed=false;
    }
    return tap?'tap':'suppress';
  }
  function wheel(e){
    if(!active()||!finite(e.deltaY)||e.deltaY===0) return;
    const anchor=clientToWorld(e),unit=e.deltaMode===1?16:(e.deltaMode===2?canvas.getBoundingClientRect().height:1);
    state.suppressed=state.points.size>0; cancelCardDrag();
    anchorZoom(Math.exp(bound(-e.deltaY*unit*0.0015,-0.5,0.5)),anchor,e); e.preventDefault();
  }
  window.RACamera=Object.freeze({setMode,zoomBy,setIntensity,toggleMap,jumpTo,snapshot,reset,update,subscribe,
    // 엔진 전용 어댑터. UI는 위 공개 메서드 + snapshot만 사용한다.
    _onDamage:onDamage,_focus:legacyFocus,_bossDefeated:bossDefeated,_matchEnd:matchEnd,_resize:resize,
    _clientToWorld:clientToWorld,_pointerDown:pointerDown,_pointerMove:pointerMove,_pointerUp:pointerUp,
    _cancelInput:cancelInput,_wheel:wheel,_blocksDeploy:()=>state.points.size>0||state.suppressed});
  function suspend(){ cancelInput(); clearFocus(); state.hits.clear(); state.lastStamp=null; state.active=false; }
  window.addEventListener('blur',suspend);
  document.addEventListener('visibilitychange',suspend);
  reset();
})();
