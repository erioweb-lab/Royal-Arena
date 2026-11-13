function updateUnit(u,dt){
  if(!isFinite(u.x)||!isFinite(u.y)){ u.x=9; u.y=u.team==='blue'?20:12; }
  if(!isFinite(u.cd)) u.cd=0.1;
  if(u.spawnFx>0){ u.spawnFx-=dt; return; }
  if(u.comboCd>0) u.comboCd-=dt;
  if(u.key==='batqueen'&&!u.dead){ u._batCd=(u._batCd===undefined?5:u._batCd)-dt; if(u._batCd<=0){ u._batCd=5; var __bn=0; for(const b2 of units){ if(b2._bat===1&&!b2.dead) __bn++; } if(__bn<3){ var __bc=Object.assign({},CARDS.minions,{hp:180,dmg:35,count:1}); var __nb={id:uid++, key:'minions', team:u.team, c:__bc, r:0.34, x:clamp(u.x+0.3,0.7,COLS-0.7), y:clamp(u.y+(u.team==='blue'?-0.4:0.4),0.7,ROWS-0.7), hp:180, maxHp:180, cd:0.4, swing:0, bob:Math.random()*6.28, target:null, spawnFx:0.45, building:false, life:0, dead:false, stun:0, slowT:0, frozenT:0, chargeT:0, charging:false, dir:u.team==='blue'?-Math.PI/2:Math.PI/2}; __nb._bat=1; units.push(__nb); fx.push({x:u.x,y:u.y,t:0,dur:0.3,kind:'ring',col:'rgba(190,140,255,.7)'}); sfx('cast'); } } }   /* v411: 박쥐 여왕 — 5초마다 아기 박쥐 소환(동시 3기 상한·미니언 스프라이트 재사용) */
  if(u.burnT>0){ u.burnT-=dt; u.burnAcc+=dt;
    if(Math.random()<0.25) addParts(u.x,u.y-0.3,1,'#ff9d3c',0.8,0.3,-30);
    if(u.burnAcc>=0.5){ const __bd=Math.round(u.burnDps*u.burnAcc); u.burnAcc=0; u.hp-=__bd; u.hurt=0.06; addParts(u.x,u.y-0.4,2,'#ff9d3c',1.4,0.4,-30);   /* v195: 화염 연출 */
      floats.push({dx:(Math.random()*14-7),dy:(Math.random()*6-3),x:u.x+(Math.random()-0.5)*0.5,y:u.y-0.9,txt:__bd,t:0.55,col:'#ff9d3c',big:false});
      if(u.hp<=0){ u.hp=0; u.dead=true; killUnit(u,false); return; } } }
  if(u.venT>0){ u.venT-=dt; u.venAcc+=dt;   /* v324: 맹독 중독 틱 — 화상과 병렬 */
    if(Math.random()<0.25) addParts(u.x,u.y-0.3,1,'#a5e85c',0.8,0.3,-30);
    if(u.venAcc>=0.5){ const __vd=Math.round((u.venDps||0)*u.venAcc); u.venAcc=0;
      if(__vd>0){ u.hp-=__vd; u.hurt=0.06; addParts(u.x,u.y-0.4,2,'#a5e85c',1.4,0.4,-30);
        floats.push({dx:(Math.random()*14-7),dy:(Math.random()*6-3),x:u.x+(Math.random()-0.5)*0.5,y:u.y-0.9,txt:__vd,t:0.55,col:'#a5e85c',big:false});
        if(u.hp<=0){ u.hp=0; u.dead=true; killUnit(u,false); return; } } } }
  if(u.slowT>0) u.slowT-=dt;
  if(u.healer&&!u.dead&&u.hp<u.maxHp) u.hp=Math.min(u.maxHp,u.hp+10*dt);   /* v209: 힐러 특성 — 자가 재생 10/s */
  if(u.team==='blue'&&S.__rin==='relic_mend'&&!u.dead&&u.hp<u.maxHp) u.hp=Math.min(u.maxHp,u.hp+2*(S.__rinMul||1)*dt);   /* v218 증폭 */   /* v212: 재생의 인장 */
  if(u.stun>0){ u.stun-=dt; u.swing=0; return; }
  if(u.frozenT>0){ u.frozenT-=dt; u.swing=0; if(Math.random()<0.15) addParts(u.x,u.y-0.3,1,'#b4ebff',1.0,0.5,-15);   /* v195: 빙결 파편 */ return; }   /* v138: 빙결 — 이동·공격 불가, 콤보 원소 1로 계수 */
  if(u.building){ // 캐논(건물): 고정, 수명 있음
    u.life-=dt; if(u.life<=0){ killUnit(u,true); return; }
    u.cd-=dt; u.swing=Math.max(0,u.swing-dt);
    if(!u.target||u.target.dead){ u.target=null; let nbd=1e9;
      for(const e2 of units){ if(e2.dead||e2.team===u.team||e2.c.flying) continue;
        const nd=Math.hypot(e2.x-u.x,e2.y-u.y); if(nd<=u.c.range+0.3&&nd<nbd){ nbd=nd; u.target=e2; } } }
    if(u.target&&!u.target.dead&&u.cd<=0){ u.cd=u.c.hs; u.swing=0.3;
      shoot(u,u.target,u.c.dmg,'cannon',u.c.splash); }
    return;
  }
  if(u.c.heal){   /* v195: 성직자 이동 — 부상 아군 추적, 없으면 전진 */
    var __w=null,__wm=0.999; for(const a3 of units){ if(a3.dead||a3.team!==u.team||a3===u||a3.isTower) continue; var __r3=a3.hp/a3.maxHp; if(__r3<__wm){__wm=__r3;__w=a3;} }
    if(__w&&__wm<0.92&&dist(u,__w)>1.6){ u.x+=Math.sign(__w.x-u.x)*u.c.spd*dt*0.55; u.y+=Math.sign(__w.y-u.y)*u.c.spd*dt*0.55; }
    else if(__wm>=0.999){ u.y+=(u.team==='blue'?-1:1)*u.c.spd*dt*0.45; }
    u.x=Math.max(0.7,Math.min(COLS-0.7,u.x)); u.y=Math.max(0.7,Math.min(ROWS-0.7,u.y));
    u.cd-=dt;
    if(u.cd<=0){ u.cd=1.4; let healed=false;
      for(const a2 of units){ if(a2.dead||a2.team!==u.team||a2.hp>=a2.maxHp) continue;
        if(Math.hypot(a2.x-u.x,a2.y-u.y)<=2.5){ a2.hp=Math.min(a2.maxHp,a2.hp+u.c.heal); healed=true;
          floats.push({dx:(Math.random()*14-7),dy:(Math.random()*6-3),x:a2.x,y:a2.y-0.8,txt:'+'+u.c.heal,t:0.7,col:'#7dffa8',big:false});
          fx.push({x:a2.x,y:a2.y,t:0,dur:0.4,kind:'ring',col:'rgba(125,255,168,.8)'}); addParts(a2.x,a2.y,3,'#7dffa8',1.2,0.5,-20); } }
      if(healed) sfx('deploy'); }
    return; }
  if(!u.target||u.target.dead) u.target=acquire(u);
  if(!u.target) return;
  if(u.target.isTower&&u.c.targets!=='buildings'){ // 타워 행군 중 근접 적 우회 전환
    const near=nearestUnitInRange(u,3.5); if(near) u.target=near;
  }
  const d=dist(u,u.target);
  if(d<=u.c.range+(u.target.r||((u.target.c&&u.target.c.r)||0.5))){
    u.cd-=dt;
    if(u.cd<=0){ u.cd=u.c.hs; u.swing=(u.c.range>1.6?0.3:0.45); u._swd=u.swing;
      hitTarget(u,u.target, u.charging? u.c.dmg*2 : u.c.dmg);
      u.chargeT=0; u.charging=false; }
  } else {
    if(u.c.charge){ u.chargeT+=dt; u.charging=u.chargeT>1.1;
      if(u.charging){ addParts(u.x,u.y-0.3,1,'#ff9d3c',0.9,0.3,-20); var __tr=(u._trC||0)+1; if(__tr%3===0){ u._trC=0; var _dx=Math.cos(u.dir),_dy=Math.sin(u.dir); for(var _ti=1;_ti<=3;_ti++) addParts(u.x-_dx*0.35*_ti,u.y-_dy*0.35*_ti,1,_ti===1?'rgba(255,213,94,.9)':'rgba(255,180,80,'+(0.55-_ti*0.14)+')',0.7-_ti*0.12,0.25,-15); } } else u._trC=0; }   /* v469: 돌진 속도선 트레일 — 진행 반대편 3점 감쇠 */
    moveUnit(u,dt);
  }
  u.swing=Math.max(0,u.swing-dt);
}
function updateTower(t,dt){
  if(t.kind==='king'&&!t.active) return;
  t.cd-=dt; if(t.cd>0) return;
  const et=enemyOf(t.team);
  let best=t.target&&!t.target.dead&&dist(t,t.target)<=t.range*1.15?t.target:null; // 타겟 기억
  if(!best){ let bd=1e9;
    for(const u of units){ if(u.dead||u.team!==et||u.spawnFx>0.3) continue;
      const d=dist(t,u); if(d<=t.range&&d<bd){bd=d;best=u;} } }
  if(best){ t.target=best; t.cd=t.hs; shoot(t,best,t.dmg,'cannon'); muzzleStar(t,best);   /* v136 P14: 타워 포구 스타 버스트 머즐 플래시 */ }
  else t.target=null;
}

/* ---------- 투사체 & 파이어볼 ---------- */
function muzzleStar(t,tg){   // v136 P14: 타워 포구 스타 버스트 머즐 플래시(§5 파이프라인 4)
  try{ const a=Math.atan2(tg.y-t.y,tg.x-t.x), bx=t.x+Math.cos(a)*0.85, by=t.y+Math.sin(a)*0.85;
    fx.push({x:bx,y:by,t:0,dur:0.18,kind:'stmuz',a:a,rot:Math.random()*1.2});
    addParts(bx,by,3,'#ffe08a',2.0,0.25,0); }catch(e){}
}
function updateProjs(dt){
  for(const p of projs){
    if(p.kind==='meteorbit'){ if(p.delay>0){ p.delay-=dt; continue; } p.t+=dt/p.T; const _k2=Math.min(1,Math.max(0,p.t)); p.x=lerp(p.x0,p.x1,_k2); p.y=lerp(p.y0,p.y1,_k2); if(Math.random()<0.7) addParts(p.x,p.y,1,'#ff9d3c',0.8,0.3,0); if(_k2>=1){ p.done=true; explodeMeteorBit(p); } continue; }   /* v380: 파편 유성 비행 */
    if(p.kind==='plasmabolt'){ p.t+=dt/p.T; const _k3=Math.min(1,Math.max(0,p.t)); p.x=lerp(p.x0,p.x1,_k3); p.y=lerp(p.y0,p.y1,_k3); if(Math.random()<0.8) addParts(p.x,p.y,1,'#cf9dff',0.9,0.3,0); if(_k3>=1){ p.done=true; explodePlasma(p); } continue; }   /* v380: 플라즈마탄 비행 */
    if(p.kind==='fireball'){
      p.t+=dt/p.T; const k=Math.min(1,p.t);
      p.x=lerp(p.x0,p.x1,k); p.y=lerp(p.y0,p.y1,k);
      if(Math.random()<0.6) addParts(p.x,p.y,1,'#ffb14d',0.7,0.3,0);
      if(k>=1){ p.done=true; explodeFireball(p); }
      continue;
    }
    const tgt=p.target;
    if(tgt&&!tgt.dead){ p.tx=tgt.x; p.ty=tgt.y-((tgt.c&&tgt.c.flying)?0.5:0.2); }
    const dx=p.tx-p.x, dy=p.ty-p.y, d=Math.hypot(dx,dy), step=p.spd*dt;
    if(d<=step+0.05){ p.done=true;
      impactProj(p,tgt);
      if(tgt&&!tgt.dead) dealDamage(tgt,p.dmg,p.team);
      if(p.splash){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.3,kind:'ring',col:'#ffb14d'});
        for(const s2 of units){ if(s2.dead||s2.team===p.team||s2===tgt||(s2.flying&&!p.hitsAir)) continue;   /* v405: 탄환 스플래시 비행 필터 */
          if(Math.hypot(s2.x-p.tx,s2.y-p.ty)<=p.splash) dealDamage(s2,Math.round(p.dmg*0.7),p.team); }
      if(p.slow){ for(const s2 of units){ if(s2.dead||s2.team===p.team||(s2.flying&&!p.hitsAir)) continue;   /* v405: 둔화 전파도 대공 여부 준수 */
        if(Math.hypot(s2.x-p.tx,s2.y-p.ty)<=p.splash){ s2.slowT=p.slow; floats.push({dx:(Math.random()*10-5),dy:0,x:s2.x,y:s2.y-1.2,txt:'❄ 둔화',t:0.7,col:'#7fe6ff',big:false}); } }
        if(tgt&&!tgt.dead&&Math.random()<0.25){ tgt.frozenT=1.2; fx.push({x:tgt.x,y:tgt.y,t:0,dur:0.5,kind:'ring',col:'rgba(180,235,255,.9)'}); addParts(tgt.x,tgt.y,5,'#b4ebff',2.0,0.4,-40); }   /* v138: 빙결 확정 부여(직격 25%) */ } } }
    else { p.x+=dx/d*step; p.y+=dy/d*step;
      if(p.dur) p.t+=dt;
      if(Math.random()<0.5) addParts(p.x,p.y,1,p.team==='blue'?'rgba(120,180,255,.9)':'rgba(255,140,140,.9)',0.4,0.22,0); }
  }
  projs=projs.filter(p=>!p.done);
}
function castSpellBase(key,team,x,y){ if(S.spells) S.spells[team]=(S.spells[team]||0)+1;   // v99 P8: 주문 사용 집계
  if(key==='healwind') castHealWind(team,x,y); else if(key==='meteor') castMeteor(team,x,y); else if(key==='blizzard') castBlizzard(team,x,y); else if(key==='zap') castZap(team,x,y); else if(key==='plasma') castPlasma(team,x,y); else if(key==='venom') castVenom(team,x,y); else if(key==='shock') castShock(team,x,y); else castFireball(team,x,y);
}
/* v213: 회복의 바람 — 아군 광역 회복 */
function castHealWind(team,x,y){ const c=CARDS.healwind;
  fx.push({x,y,t:0,dur:0.6,kind:'ring',col:'rgba(143,230,168,.9)'}); fx.push({x,y,t:0,dur:3,kind:'healzone',r:c.radius,team:team}); addParts(x,y,12,'#8fe6a8',2.6,0.5,35); sfx('cast'); S.spellQuiet=1.2;   /* v409: 시전 플래시를 잔류 회복 존으로 통합 — 틱 힐 10dps(3초 총 30) */
  for(const u of units){ if(u.dead||u.team!==team||u.isTower) continue; if(Math.hypot(u.x-x,u.y-y)<=c.radius&&u.hp<u.maxHp){ var __hv=Math.min(c.heal,u.maxHp-u.hp); u.hp+=__hv; floats.push({dx:(Math.random()*10-5),dy:0,x:u.x,y:u.y-1.1,txt:'+'+Math.round(__hv),t:0.8,col:'#8fe6a8',big:false}); } } }
/* v208: 유성우 — 즉시 착탄 광역+화상 3초 */
function castMeteor(team,x,y){ const c=CARDS.meteor, et=enemyOf(team);
  fx.push({x,y,t:0,dur:0.55,kind:'warnring'}); fx.push({x,y,t:0,dur:0.5,kind:'boom'}); fx.push({x,y,t:0,dur:0.35,kind:'flash'}); S.shake=0.6; S.spellQuiet=2.2; sfx('boom');
  addParts(x,y,26,'#ff9d3c',3.6,0.6,70); fx.push({x,y,t:0,dur:8,kind:'crater',r:c.radius,team:team});   /* v407: 틱 데미지 팀 필터용 */ fx.push({x,y,t:0,dur:4.5,kind:'burnzone',r:c.radius,team:team});   /* v326: 화염 분화구 8초+잔열 지역 4.5초(반경 내 화염 지속) */
  { const _kt2=towers.find(t=>t.team===team&&t.kind==='king'&&!t.dead)||{x:9,y:team==='blue'?29:3};   /* v380: 유성우 다발 — 본 낙하+유도 파편 유성 4발(파이어볼 계통 발사) */
    for(let _i=0;_i<4;_i++){ const _ma=Math.random()*6.2832, _mr=Math.sqrt(Math.random())*c.radius*0.85;
      const _mx=clamp(x+Math.cos(_ma)*_mr,0.4,COLS-0.4), _my=clamp(y+Math.sin(_ma)*_mr*0.55,0.4,ROWS-0.4);
      projs.push({kind:'meteorbit',team,x0:_kt2.x,y0:_kt2.y,x1:_mx,y1:_my,x:_kt2.x,y:_kt2.y,t:0,T:0.62+Math.random()*0.3,delay:_i*0.07,dmg:Math.round(spellDmg(c.dmg)*0.32)}); } }
  for(const u of units){ if(u.dead||u.team!==et) continue; if(Math.hypot(u.x-x,u.y-y)<=c.radius){ u.burnT=Math.max(u.burnT||0,3); u.burnDps=24; u.burnAcc=0; floats.push({dx:(Math.random()*10-5),dy:0,x:u.x,y:u.y-1.2,txt:'🔥 화상',t:0.7,col:'#ff9d3c',big:false}); dealDamage(u,spellDmg(c.dmg),team,true); } }
  for(const t of towers){ if(t.dead||t.team!==et) continue; if(Math.hypot(t.x-x,t.y-y)<=c.radius+0.5) dealDamage(t,spellDmg(c.towerDmg),team); } }
/* v208: 눈보라 — 광역 둔화 3초 */
function castBlizzard(team,x,y){ const c=CARDS.blizzard, et=enemyOf(team);
  fx.push({x,y,t:0,dur:0.6,kind:'zap'}); fx.push({x,y,t:0,dur:0.5,kind:'ring',col:'rgba(160,220,255,.9)'}); addParts(x,y,16,'#bfe4ff',2.8,0.55,40); addParts(x,y,10,'#ffffff',2.2,0.7,-55); sfx('cast'); S.spellQuiet=1.6; fx.push({x,y,t:0,dur:6,kind:'snowzone',r:c.radius,team:team});   /* v326: 지속 눈 지역 — 6초간 반경 내 적 둔화 유지 */
  for(const u of units){ if(u.dead||u.team!==et) continue; if(Math.hypot(u.x-x,u.y-y)<=c.radius){ u.slowT=Math.max(u.slowT||0,c.slow); dealDamage(u,spellDmg(c.dmg),team,true); } }
  for(const t of towers){ if(t.dead||t.team!==et) continue; if(Math.hypot(t.x-x,t.y-y)<=c.radius+0.4) dealDamage(t,spellDmg(c.towerDmg),team); } }
function castZap(team,x,y){
  const c=CARDS.zap, et=enemyOf(team);
  fx.push({x,y,t:0,dur:0.4,kind:'zap'}); fx.push({x,y,t:0,dur:0.4,kind:'zapx'}); fx.push({x,y,t:0,dur:0.5,kind:'shockring'}); S.shake=0.3; S.spellQuiet=2.6; sfx('zap');   // v118: 자패 진정 기간
  fx.push({x,y,t:0,dur:0.3,kind:'flash'});
  addParts(x,y,14,'#ffe95e',3.6,0.45,50); fx.push({x,y,t:0,dur:3.5,kind:'stormzone',r:c.radius,team:team});   /* v408: 지속 번개 폭풍 존 */
  for(const u of units){ if(u.dead||u.team!==et) continue;
    if(Math.hypot(u.x-x,u.y-y)<=c.radius){ u.stun=c.stun; floats.push({dx:(Math.random()*10-5),dy:0,x:u.x,y:u.y-1.2,txt:'⚡ 기절',t:0.7,col:'#ffe95e',big:false}); dealDamage(u,spellDmg(c.dmg),team,true); } }
  var __ch=null,__chd=1e9;
  for(const u2 of units){ if(u2.dead||u2.team!==et||u2.stun>0) continue; var __d2=Math.hypot(u2.x-x,u2.y-y); if(__d2>c.radius&&__d2<=c.radius+2.2&&__d2<__chd){ __chd=__d2; __ch=u2; } }
  if(__ch){ __ch.stun=c.stun*0.8; dealDamage(__ch,Math.round(spellDmg(c.dmg)*0.4),team,true); fx.push({x:x,y:y,tx:__ch.x,ty:__ch.y,t:0,dur:0.22,kind:'bolt'}); addParts(__ch.x,__ch.y,6,'#ffe95e',2.4,0.3,30); }   /* v138: 전기 연쇄 번개 — 반경 밖 최근접 1기 */
  for(const t of towers){ if(t.dead||t.team!==et) continue;
    if(Math.hypot(t.x-x,t.y-y)<=c.radius+0.4) dealDamage(t,spellDmg(c.towerDmg),team); }
}
function castFireball(team,x,y){
  const kt=towers.find(t=>t.team===team&&t.kind==='king'&&!t.dead)||{x:9,y:team==='blue'?29:3};
  const d=Math.hypot(x-kt.x,y-kt.y);
  { const x1c=clamp(x,0.4,COLS-0.4), y1c=clamp(y,0.4,ROWS-0.4), T0=Math.max(0.5,d/9);
    projs.push({kind:'fireball',team,x0:kt.x,y0:kt.y,x1:x1c,y1:y1c,x:kt.x,y:kt.y,t:0,T:T0});
    fx.push({x:x1c,y:y1c,t:0,dur:T0+0.2,kind:'warnring'});S.spellQuiet=T0+2.6; }   // v118: 파이어볼 진정 기간 — 비행·여진 동안 신규 줌인 억제(일반 전투 피해 포함)
  sfx('cast');
}
function explodeFireball(p){
  const c=CARDS.fireball, et=enemyOf(p.team);
  fx.push({x:p.x1,y:p.y1,t:0,dur:0.7,kind:'boom'}); S.shake=0.5; sfx('boom'); fx.push({x:p.x1,y:p.y1,t:0,dur:5,kind:'crater',r:1.4,team:p.team});   /* v407: 틱 데미지 팀 필터용 */
  addParts(p.x1,p.y1,22,'#ffb14d',3.4,0.6,60); addParts(p.x1,p.y1,9,'#ffd27a',2.8,0.75,-85);
  fx.push({x:p.x1,y:p.y1,t:0,dur:0.3,kind:'flash'});
  fx.push({x:p.x1,y:p.y1,t:0,dur:0.5,kind:'ring',col:'rgba(255,177,77,.9)'});
  fx.push({x:p.x1,y:p.y1,t:0,dur:0.2,kind:'flash'});
  for(const u3 of units){ if(u3.dead||u3.team!==et) continue; if(Math.hypot(u3.x-p.x1,u3.y-p.y1)<=c.radius){ u3.burnT=Math.max(u3.burnT||0,2); u3.burnDps=18; u3.burnAcc=0; } }   /* v138: 지속 화염 — 폭발 지점 적 2초 도트 */
  for(const u of units){ if(u.dead||u.team!==et) continue;
    if(Math.hypot(u.x-p.x1,u.y-p.y1)<=c.radius) dealDamage(u,spellDmg(c.dmg),p.team,true); }
  for(const t of towers){ if(t.dead||t.team!==et) continue;
    if(Math.hypot(t.x-p.x1,t.y-p.y1)<=c.radius+0.5) dealDamage(t,spellDmg(c.towerDmg),p.team); }
}

/* v380: 파편 유성 착탄 — 소형 폭발+부분 피해(화상은 본 낙하 전담, 중복 부여 없음) */
function explodeMeteorBit(p){
  fx.push({x:p.x1,y:p.y1,t:0,dur:0.4,kind:'boom'}); fx.push({x:p.x1,y:p.y1,t:0,dur:0.25,kind:'flash'}); fx.push({x:p.x1,y:p.y1,t:0,dur:0.45,kind:'ring',col:'rgba(255,177,77,.85)'});
  addParts(p.x1,p.y1,10,'#ffb14d',2.6,0.5,45);
  const et=enemyOf(p.team);
  for(const u of units){ if(u.dead||u.team===p.team) continue; if(Math.hypot(u.x-p.x1,u.y-p.y1)<=1.0) dealDamage(u,p.dmg,p.team,true); }
}
/* v324+380: 플라즈마 — 플라즈마탄 발사(착탄 단일 대상 280+화상 3초)+잔류 존 4.2초 */
function castPlasma(team,x,y){ const c=CARDS.plasma;
  const _kt=towers.find(t=>t.team===team&&t.kind==='king'&&!t.dead)||{x:9,y:team==='blue'?29:3};
  const x1c=clamp(x,0.4,COLS-0.4), y1c=clamp(y,0.4,ROWS-0.4), _T0=Math.max(0.5,Math.hypot(x-_kt.x,y-_kt.y)/10);
  projs.push({kind:'plasmabolt',team,x0:_kt.x,y0:_kt.y,x1:x1c,y1:y1c,x:_kt.x,y:_kt.y,t:0,T:_T0});
  fx.push({x:x1c,y:y1c,t:0,dur:_T0+0.2,kind:'beam',x0:_kt.x,y0:_kt.y,T:_T0});   /* v406: 타워 발사 빔 — 생성형 그래픽 */
  fx.push({x:x1c,y:y1c,t:0,dur:_T0+0.25,kind:'warnring'}); S.spellQuiet=_T0+2.0; sfx('cast'); }
function explodePlasma(p){ const c=CARDS.plasma, et=enemyOf(p.team), x=p.x1, y=p.y1, team=p.team;
  fx.push({x,y,t:0,dur:0.35,kind:'flash'}); fx.push({x,y,t:0,dur:0.5,kind:'ring',col:'rgba(207,157,255,.9)'}); fx.push({x,y,t:0,dur:0.55,kind:'shockring'}); addParts(x,y,12,'#cf9dff',3.0,0.5,45); S.shake=0.35; sfx('zap');
  fx.push({x,y,t:0,dur:4.2,kind:'plasmazone',r:c.radius,team:team});   /* v380: 공격지역 지속 그래픽 존(시각 전용 — 밸런스 불변) */
  var __bt=null,__bd=1e9;
  for(const u of units){ if(u.dead||u.team!==et||u.isTower) continue; var __d3=Math.hypot(u.x-x,u.y-y); if(__d3<=c.radius&&__d3<__bd){ __bd=__d3; __bt=u; } }
  if(__bt){ __bt.burnT=Math.max(__bt.burnT||0,3); __bt.burnDps=20; __bt.burnAcc=0; dealDamage(__bt,spellDmg(c.dmg),team,true); floats.push({dx:(Math.random()*10-5),dy:0,x:__bt.x,y:__bt.y-1.4,txt:'🌀 '+Math.round(spellDmg(c.dmg)),t:0.8,col:'#cf9dff',big:true}); fx.push({x:__bt.x,y:__bt.y,t:0,dur:0.4,kind:'ring',col:'rgba(230,210,255,.95)'}); addParts(__bt.x,__bt.y,10,'#e6d2ff',2.6,0.5,35); }
  for(const t of towers){ if(t.dead||t.team!==et) continue; if(Math.hypot(t.x-x,t.y-y)<=c.radius+0.5) dealDamage(t,spellDmg(c.towerDmg),team); } }
/* v324: 맹독 안개 — 광역 중독 틱 6초 */
function castVenom(team,x,y){ const c=CARDS.venom, et=enemyOf(team);
  fx.push({x,y,t:0,dur:0.7,kind:'ring',col:'rgba(165,232,92,.85)'}); fx.push({x,y,t:0.15,dur:0.9,kind:'ring',col:'rgba(165,232,92,.5)'}); fx.push({x,y,t:0,dur:6,kind:'venomzone',r:c.radius,team:team});   /* v409: 존 틱 팀 필터용 */ addParts(x,y,16,'#a5e85c',2.8,0.6,25); sfx('cast'); S.spellQuiet=1.6;
  for(const u of units){ if(u.dead||u.team!==et) continue; if(Math.hypot(u.x-x,u.y-y)<=c.radius){ u.venT=Math.max(u.venT||0,6); u.venDps=30; u.venAcc=0; floats.push({dx:(Math.random()*10-5),dy:0,x:u.x,y:u.y-1.2,txt:'☠ 중독',t:0.7,col:'#a5e85c',big:false}); dealDamage(u,spellDmg(c.dmg),team,true); } }
  for(const t of towers){ if(t.dead||t.team!==et) continue; if(Math.hypot(t.x-x,t.y-y)<=c.radius+0.4) dealDamage(t,spellDmg(c.towerDmg),team); } }
/* v324: 충격파 — 광역 기절 0.5초 */
function castShock(team,x,y){ const c=CARDS.shock, et=enemyOf(team);
  fx.push({x,y,t:0,dur:0.45,kind:'zapx'}); fx.push({x,y,t:0,dur:0.55,kind:'ring',col:'rgba(255,233,94,.9)'}); fx.push({x,y,t:0,dur:0.6,kind:'shockring'}); addParts(x,y,18,'#ffe95e',3.2,0.55,55); S.shake=0.5; S.spellQuiet=2.4; sfx('boomL');
  for(const u of units){ if(u.dead||u.team!==et) continue; if(Math.hypot(u.x-x,u.y-y)<=c.radius){ u.stun=Math.max(u.stun||0,c.stun); floats.push({dx:(Math.random()*10-5),dy:0,x:u.x,y:u.y-1.2,txt:'💫 기절',t:0.7,col:'#ffe95e',big:false}); dealDamage(u,spellDmg(c.dmg),team,true); } }
    for(const u of units){ if(u.dead||u.team!==et) continue; var __kd=Math.hypot(u.x-x,u.y-y); if(__kd<=c.radius&&__kd>0.01){ var __kx=(u.x-x)/__kd*0.8, __ky=(u.y-y)/__kd*0.8; u.x=Math.max(0.7,Math.min(COLS-0.7,u.x+__kx)); u.y=Math.max(0.7,Math.min(ROWS-0.7,u.y+__ky)); } }   /* v409: 넉백 0.8타일 — 중심 방사형·필드 클램프 */

  for(const t of towers){ if(t.dead||t.team!==et) continue; if(Math.hypot(t.x-x,t.y-y)<=c.radius+0.4) dealDamage(t,spellDmg(c.towerDmg),team); } }

/* ---------- 피해 / 파괴 / 승패 (REA 설계도 §2·§6) ---------- */
function dealDamage(e,dmg,fromTeam,fromSpell){
  try{ if(e&&!e.isTower) tutCombat(); }catch(e2){}   /* v147: 첫 교전 관전 훅 */
   // v114: fromSpell — 주문(파이어볼·자패) 피해는 줌인 유발 없음, 일반 유닛 교전만 줌인
  if(S&&S.relic==='relic_atk'&&fromTeam==='blue'&&e&&e.team==='red'&&!e.isTower) dmg=Math.round(dmg*1.1);   // v109 #13: 유물 — 전투 문장
  if(fromTeam==='blue'&&e&&e.team==='red'&&!e.isTower&&fromSpell!==true) dmg=Math.round(dmg*(1+0.08*((S._sk&&S._sk.off1)||0)+0.06*((S._sk&&S._sk.off2)||0)+0.12*((S._sk&&S._sk.off3)||0)));   // v119: 스킬트리 공세 계통 — 일반 유닛 공격만(주문 제외)
  if(fromTeam==='blue'&&S.theme==='lava'&&!e.isTower) dmg=Math.round(dmg*1.02);   /* v220: 용암 테마 보너스 — 아군 공격 +2% */
  var __rinM=1; if(S.__rin==='relic_frenzy') __rinM*=1.15*(S.__rinMul||1);   /* v218 증폭 */ if(S.__rin==='relic_bulwark') __rinM*=0.9; if(S.__rin==='relic_gamble') __rinM*=(S.__rinRoll||1); if(fromTeam==='blue'&&e&&!e.isTower&&__rinM!==1) dmg=Math.round(dmg*__rinM); if(fromTeam==='red'&&S.__rin==='relic_guard') dmg=Math.round(dmg*0.92);   /* v297: 수호 룬 */   /* v212: 인런 렐릭 — 공세·방벽·도박 */
  if(e.dead) return;
  if(fromTeam==='red'&&e&&!e.isTower) dmg=Math.round(dmg*__raDiffDmg());   /* v208: 난이도 — 적 공격력 배율 */
  var __st=((e.burnT>0)?1:0)+((e.slowT>0)?1:0)+((e.stun>0)?1:0)+((e.frozenT>0)?1:0);
  var __mult=__st>=4?2.5:(__st>=3?2:(__st===2?1.4:1));   /* v211: 4원소 궁극 quad_arcane ×2.5 */
  dmg=Math.round(dmg*__mult);
  var __weak=(e.slowT>0||e.stun>0||e.frozenT>0)?1.25:1;   /* v208: 약점 강타 — 상태이상 노출 대상 +25% */
  if(__weak>1){ dmg=Math.round(dmg*__weak); if(!(e.comboCd>0)){ e.comboCd=1.2; floats.push({dx:(Math.random()*10-5),dy:(Math.random()*4-2),x:e.x,y:e.y-(e.r||0.45)-1.6,txt:'약점 강타!',t:0.75,col:'#7fe6ff',big:false}); } }
  if(fromTeam==='blue'&&e&&!e.isTower&&Math.random()<0.12){ dmg=Math.round(dmg*2); floats.push({dx:(Math.random()*14-7),dy:(Math.random()*6-3),x:e.x,y:e.y-(e.r||0.45)-1.9,txt:'치명타!',t:0.9,col:'#ffd54f',big:true}); sfx('crown'); }   /* v208: 크리티컬 12% ×2 — 아군 공격 한정 */
  if(__st>=2&&!(e.comboCd>0)){
    e.comboCd=1.2;
    var __ck=(e.burnT>0?'b':'')+(e.slowT>0?'s':'')+(e.stun>0?'t':'')+(e.frozenT>0?'f':'');
    var __cn=__st>=3?'3원소 대콤보 ×2!':((({bs:'증기 폭발',bt:'용암 감전',bf:'서리 화염',st:'감전 빙결',sf:'혹한 서리',tf:'파쇄 얼음'})[__ck]||'2원소 콤보')+' +40%');   /* v210: 명명된 2원소 콤보 6종 */
    floats.push({dx:(Math.random()*14-7),dy:(Math.random()*6-3),x:e.x,y:e.y-(e.r||0.45)-1.1,txt:(__st>=4?'4원소 붕괴 ×2.5!':__cn),t:0.9,col:__st>=4?'#c77dff':(__st>=3?'#ff9d3c':'#ffe95e'),big:true});
    if(__st>=3) addParts(e.x,e.y,__st>=4?20:12,__st>=4?'#c77dff':'#ff9d3c',3,0.5,60); if(__st>=3) addParts(e.x,e.y,__st>=4?14:8,'#7fe6ff',2.6,0.45,45); if(__st>=4) sfx('boomL');   /* v211 파티클 + v214: 4원소 궁극 사운드 */
    fx.push({x:e.x,y:e.y,t:0,dur:0.35,kind:'ring',col:__st>=3?'rgba(255,157,60,.9)':'rgba(255,233,94,.9)'});
  }
  if((e.shield||0)>0){ const ab=Math.min(e.shield,dmg); e.shield-=ab; dmg-=ab; }
  e.hp-=dmg; e.hurt=0.09;
  if(!(e===S.boss)&&!(e.isTower)&&fromSpell!==true&&!(S.focusGap>0)&&!(S.spellQuiet>0)&&S.cam){ if(S.focus){ if((S._now>=(S._rTg||0))&&Math.hypot(e.x*TILE-S.focus.x,e.y*TILE-S.focus.y)>2.5*TILE){ raFocus(e.x*TILE,e.y*TILE,1.9,e,true); S._rTg=S._now+0.8; } }   /* v178: 줌 중 신규 교전 → 줌 이동(0.8s 스로틀·2.5타일 이상) */
  else if(S.cam.z<=1.05&&!(S._zSpot&&S._now<S._zSpot.exp&&Math.abs(e.x*TILE-S._zSpot.x)<3*TILE&&Math.abs(e.y*TILE-S._zSpot.y)<3*TILE)){ raFocus(e.x*TILE,e.y*TILE,1.9,e); } }   /* v175 P2: 감시견 해제 지점 동일교전 재점화 억제(6s) */   // v113 완전복귀 게이트 + v114 주문 피해 제외   // v113: 카메라가 1배로 완전 복귀한 뒤에만 신규 줌인 허용 — 줌인·복귀 중 화염병 등 추가 피해로 재점화되는 것 차단   // v112: 타워 피격은 줌인 유발하지 않음 — 유닛 교전만(왕관 파괴 강제 줌인은 유지)   // v111: 신 포커스 시스템 — 단일 생성자 경유(좌표 즉시 확정)   // v91: 줌 펄스 쿨다운 — 지속 교전 중 1.6배 고정 방지
  const big=dmg>=150;
  floats.push({dx:(Math.random()*14-7),dy:(Math.random()*6-3),x:e.x+(Math.random()-0.5)*0.7,y:e.y-(e.r||0.45)-0.35-Math.random()*0.5,txt:Math.round(dmg)+(big?'!':''),t:big?0.9:0.7,col:big?'#ff9d3c':(fromTeam==='blue'?'#bfe0ff':'#ffd2d2'),big});
  if(e.isTower&&e.kind==='king') e.active=true;   // 킹타워 피격 시 각성
  if(e.isTower&&e.kind==='king'&&e.team==='blue'&&e.hp<e.maxHp*0.3&&!S.__kingWarn){ S.__kingWarn=1; banner('⚠ 왕 타워 위험!',2000); sfx('boomL'); }   /* v214: 왕타워 위험 경고 1회 */
  if(e.hp<=0){ e.hp=0; e.dead=true;
    if(fromTeam&&S.kills&&!e.isTower) S.kills[fromTeam]++;
    if(!e.isTower&&S.deaths&&e.team) S.deaths[e.team]=(S.deaths[e.team]||0)+1;   // v99 P8: 데스 집계
  if(e.isTower&&e.kind==='king'&&fromTeam==='blue'){ try{ var __mi0=(window.__raMapIdx?__raMapIdx():0); if(__mi0>(parseInt(localStorage.getItem('ra_map_clear_v1')||'-1',10))) localStorage.setItem('ra_map_clear_v1',String(__mi0)); }catch(__e){} try{ var __cd0=parseInt(localStorage.getItem('ra_diff_clear_v1')||'-1',10)||-1; var __dc0=parseInt(localStorage.getItem('ra_diff_v1')||'0',10)||0; if(__dc0>__cd0) localStorage.setItem('ra_diff_clear_v1',String(__dc0)); }catch(__e){} }   /* v209: 난이도 토벌 기록 — 다음 난이도 해금 */
  if(fromTeam==='blue'&&!e.isTower){ try{ var __kg=parseInt(localStorage.getItem('ra_diff_clear_v1')||'-1',10)+1; if(typeof P!=='undefined'&&P&&typeof P.elixir==='number') P.elixir=Math.min(ELX_MAX,P.elixir+0.04*(1+Math.max(0,__kg))*(S&&S.__rin==='relic_hoard'?2*(S.__rinMul||1):1)   /* v218 증폭 */);   /* v212: 금고의 인장 — 보상 2배 */ }catch(__e){} }   /* v209: 처치 보상 — 킬 엘릭서(토벌 단계 계수, killGoldBonus 프레임) */
  if(!e.isTower&&e.split&&e.team==='red'){ setTimeout(function(){ try{ if(S.over) return; var __sc=Object.assign({},CARDS.minions,{hp:70,dmg:22,name:'분열체',count:1}); for(var __si=0;__si<2;__si++){ units.push({id:uid++, key:'minions', team:'red', c:__sc, r:0.32, x:clamp(e.x+(__si?0.35:-0.35),0.7,COLS-0.7), y:clamp(e.y+0.3,0.7,ROWS-0.7), hp:70, maxHp:70, cd:0.4, swing:0, bob:Math.random()*6.28, target:null, spawnFx:0.45, building:false, life:0, dead:false, stun:0, slowT:0, frozenT:0, chargeT:0, charging:false, dir:Math.PI/2}); } }catch(__e){} },60); }   /* v209: 분열 특성 — 사망 시 소형 2체 */
    if(e.isTower) destroyTower(e,fromTeam); else killUnit(e,false); }
}
function killUnit(u,expire){
  u.dead=true;
  fx.push({x:u.x,y:u.y,t:0,dur:0.4,kind:'poof'});
  if(DIESPR[u.key]) fx.push({x:u.x,y:u.y,t:0,dur:0.55,kind:'die',key:u.key,team:u.team});
  addParts(u.x,u.y,u.maxHp>=900?16:7,u.maxHp>=900?'#ffe08a':'#cfd6e0',u.maxHp>=900?3:2.2,0.5,-40);
  if(!expire&&u.maxHp>=900){ S.slow=0.45; S.clash={x:u.x,y:u.y,a:1}; }  // 대형 킬 하이라이트
  if(!expire) sfx('hit');
}
function destroyTower(t,fromTeam){
  fx.push({x:t.x,y:t.y,t:0,dur:0.9,kind:'boom'});
  S.shake=0.8; S.slow=0.6; S.clash={x:t.x,y:t.y,a:1};  // 타워 파괴 클로즈업
  sfx('boom');
  addParts(t.x,t.y,24,'#d8dee8',3.6,0.9,90);
  if(fromTeam) fx.push({x:t.x,y:t.y,tx:9*TILE,ty:fromTeam==='blue'?H+30:-30,t:0,dur:0.95,kind:'crownfly'});
  const kt=towers.find(k=>k.team===t.team&&k.kind==='king'); if(kt) kt.active=true;
  if(!fromTeam) return;
  if(t.kind==='king'){
    S.crowns[fromTeam]=3;
    banner(fromTeam==='blue'?'킹타워 파괴! 👑👑👑':'킹타워가 무너졌어요…');
    finish(fromTeam);
  } else {
    S.crowns[fromTeam]++; try{ tutCrown(fromTeam); }catch(e){}   /* v147 */
    if(fromTeam==='blue'&&!S.bossSpawned&&!S.over){ spawnBossNow(); }   /* v192: 첫 적군 타워 파괴 즉시 강림 */
    banner(fromTeam==='blue'?'타워 파괴! 왕관 획득 👑':'아군 타워가 파괴됐어요…');
    S.slow=3.0;   // v116: 타워 파괴 줌인 삭제(사용자 지정) — 슬로모·왕관 연출은 유지   // v113: 이미 줌인 중이면 강제 대체하지 않음(슬로모는 유지)   // v102 #9 슬로모 + v111: 강제 포커스(진행 중 포커스 대체)   // v102 #9: 마지막 왕관 순간 3초 슬로모 하이라이트(고정 클로즈업)
    sfx('crown');
    if(typeof showEmote==='function' && Math.random()<0.5) setTimeout(()=>showEmote(fromTeam==='red'?'😂':'😭','red'),700);
    if(S.overtime) finish(fromTeam);   // 서든데스: 왕관 즉시 승부
  }
}
function finish(winner){
  try{ document.getElementById('screen-battle').classList.remove('sd-mode'); }catch(e){ }   /* v194 */
  if(S.over) return;
  S.over=true; S.winner=winner; try{ var __xu=S.__used||{}; var __mx=__cXpMap(); var __lvB={}; Object.keys(__xu).forEach(function(k){ __lvB[k]=__cLv(k); }); var __dfb=parseInt(localStorage.getItem('ra_diff_v1')||'0',10)||0; var __today=new Date().toISOString().slice(0,10); var __firstw=(winner==='blue'&&localStorage.getItem('ra_daily_v1')!==__today); var __tb=(winner==='blue'&&(S.theme==='wasteland'||S.theme==='divine'))?1:0;   /* v435: divine(잠든 신계) — wasteland XP 체인 재사용 */ var __xg=0; Object.keys(__xu).forEach(function(k){ var __add=(winner==='blue'?2:1)+__dfb+(__firstw?2:0)+__tb; if(S&&S.__rin==='relic_boom') __add*=2;   /* v297: 번영 — 보상 2배 */ __mx[k]=(__mx[k]||0)+__add; __xg+=__add; }); try{ localStorage.setItem('ra_xp_gain_v1',String(__xg)); }catch(__e){}   /* v213 + v220: 황야 XP+1·획득량 기록 */ if(winner==='blue'){ try{ localStorage.setItem('ra_daily_v1',__today); }catch(__e){} } if(__firstw) setTimeout(function(){ try{ banner('🌅 첫 승 보너스 XP +2!',2200); sfx('crown'); }catch(e){} },1600);   /* v218 */ try{ localStorage.setItem('ra_cardxp_v1',JSON.stringify(__mx)); }catch(__e){}   /* v213: 난이도 XP +첫승 가산 */ var __ups=Object.keys(__xu).filter(function(k){ return __cLv(k)>__lvB[k]; }); if(__ups.length){ var __un=__ups.map(function(k){ return (CARDS[k]||{}).name||k; }).join(', '); try{ localStorage.setItem('ra_lvup_v1',__ups.join(',')); }catch(__e){} setTimeout(function(){ try{ banner('🆙 카드 Lv.UP! '+__un,2400); sfx('crown'); }catch(e){} },500); }   /* v212 P17: Lv.UP 배너 팝업 */ }catch(__e){} if(winner==='blue'){ var __dfv=(function(){try{return Math.max(0,Math.min(2,parseInt(localStorage.getItem('ra_diff_v1')||'0',10)||0))}catch(e){return 0}})(), __spm=(1+__dfv)*(S&&S.__rin==='relic_boom'?2:1),   /* v297: 번영 — SP 2배 */ __sts=(typeof spState==='function')?spState():{sp:0,total:0}; __sts.sp+=__spm; __sts.total+=__spm; try{ if(typeof spSave==='function') spSave(__sts); else localStorage.setItem('ra_sp_v1',JSON.stringify(__sts)); }catch(e){} try{ localStorage.setItem('ra_sp_gain_v1',String(__spm)); }catch(e){} setTimeout(function(){ try{ banner('🎓 SP +'+__spm+' 획득 (난이도 보너스 ×'+__spm+')',2200); sfx('crown'); }catch(e){} },2200); }   /* v296: 난이도별 SP 배율 */ try{ var __win=(S.winner==='blue'); if(__win){ var __w1=(parseInt(localStorage.getItem('ra_wins_v1')||'0',10)||0)+1, __s1=(parseInt(localStorage.getItem('ra_streak_v1')||'0',10)||0)+1; localStorage.setItem('ra_wins_v1',String(__w1)); localStorage.setItem('ra_streak_v1',String(__s1)); try{ if(__s1>(parseInt(localStorage.getItem('ra_streak_best_v1')||'0',10)||0)) localStorage.setItem('ra_streak_best_v1',String(__s1)); }catch(e){} if(__s1%3===0) setTimeout(function(){ try{ banner('🔥 '+__s1+'연승!',2200); sfx('crown'); }catch(e){} },3200); } else { localStorage.setItem('ra_losses_v1',String((parseInt(localStorage.getItem('ra_losses_v1')||'0',10)||0)+1)); localStorage.setItem('ra_streak_v1','0'); } }catch(__e){} try{ var __su=(function(){try{return Math.max(0,Math.min(1,parseInt(localStorage.getItem('ra_slot_used_v1')||'0',10)||0))}catch(e){return 0}})(), __ss=(function(){try{var x=JSON.parse(localStorage.getItem('ra_slot_stats_v1')||'[]');return (Array.isArray(x)&&x.length>=2)?x:[{w:0,l:0},{w:0,l:0}]}catch(e){return [{w:0,l:0},{w:0,l:0}]}})(); if(S.winner==='blue')__ss[__su].w++; else __ss[__su].l++; localStorage.setItem('ra_slot_stats_v1',JSON.stringify(__ss)); }catch(e){}   /* v298: 덱 슬롯별 전적 */   /* v213: 전적 카운터·연승 */
    try{ var __st=spState(); var __g=(winner==='blue')?3:1; __st.sp+=__g; __st.total+=__g; spSave(__st); setTimeout(function(){ toast('🎓 전술 SP +'+__g); },900); }catch(e){}   // v119: 승리 보상 SP — 승리 +3·패배 +1, 영구 저장 S.endTimer=1.4; P.sel=null; syncHand();
  if(winner==='blue') sfx('win'); else if(winner==='red') sfx('lose');
  bgmStop();
}
function fwVictory(){   /* v140: 승리 연출 — 결과 패널 위 폭죽 파티클+왕관 낙하(DOM/CSS — 루프 정지와 무관·모바일 저부담, 파티클 예산 26발) */
  var ov=document.getElementById('overlay-result'); if(!ov) return;
  var fc=document.createElement('div'); fc.className='fw-layer';
  var cols=['#FFD54F','#FF9D3C','#7FB0FF','#F87171','#B4EBFF'];
  for(var i=0;i<26;i++){ var s=document.createElement('span'); s.className='fw-p';
    var ang=Math.random()*6.283, d=40+Math.random()*90;
    s.style.setProperty('--dx',(Math.cos(ang)*d).toFixed(0)+'px');
    s.style.setProperty('--dy',(Math.sin(ang)*d-30).toFixed(0)+'px');
    s.style.setProperty('--dd',(0.7+Math.random()*0.9).toFixed(2)+'s');
    s.style.setProperty('--dl',(Math.random()*0.5).toFixed(2)+'s');
    s.style.left=(38+Math.random()*24)+'%'; s.style.top=(30+Math.random()*20)+'%';
    s.style.background=cols[i%cols.length];
    fc.appendChild(s); }
  var cr=document.createElement('div'); cr.className='fw-crown'; cr.textContent='\uD83D\uDC51'; fc.appendChild(cr);
  ov.appendChild(fc); setTimeout(function(){ try{ fc.remove(); }catch(e){} },4200);
}
function showResult(){
  const w=S.winner;
  const crowns=S.crowns.blue, crownR=S.crowns.red;
  const tHp=towers.filter(t=>t.team==='blue'&&!t.dead).reduce((a,t)=>a+t.hp,0);
  const tMax=towers.filter(t=>t.team==='blue').reduce((a,t)=>a+t.maxHp,0)||1;
  const tPct=Math.round(tHp/tMax*100);
  const timeLeft=Math.max(0,Math.round(S.t||0));
  const killsB=(S.kills&&S.kills.blue)||0;
  const score=crowns*300+killsB*15+Math.round(tPct*2)+timeLeft;
  const ranks=[['SSS',1600],['SS',1200],['S',850],['A',550],['B',0]];
  let ri=(w==='blue')?ranks.findIndex(r=>score>=r[1]):4;
  if(ri<0) ri=4;
  $('#r-title').textContent = w==='blue'?'승리!':w==='red'?'패배…':'무승부';
  if(w==='blue'){ try{ fwVictory(); }catch(e){} }   /* v140: 승리 연출 — 폭죽 파티클+왕관 낙하 */
  $('#r-title').style.color = w==='blue'?'#f7c531':w==='red'?'#ff8f8f':'#cfe0ff';
  $('#r-art').src = w==='blue'? RART.win : w==='red'? RART.lose : RART.win;
  $('#r-crowns').innerHTML = '<img class="ric ric2" src="assets/ra_ic_crown.png?v=475" alt="">'.repeat(crowns)+' <img class="ric ric2" src="assets/ra_ic_swords.png?v=475" alt=""> '+'<img class="ric ric2" src="assets/ra_ic_crown.png?v=475" alt="">'.repeat(crownR);
  $('#r-sub').innerHTML = `최종 왕관 <b>${crowns} : ${crownR}</b>${S.overtime?' · 연장전':''}<br>총점 <b>${score}</b>`;
  $('#rt-crown').textContent=crowns*300;
  $('#rt-kill').textContent=killsB*15;
  $('#rt-kd').textContent=killsB+' / '+((S.deaths&&S.deaths.blue)||0);
  $('#rt-spell').textContent=((S.spells&&S.spells.blue)||0)+'회';
  $('#rt-hp').textContent=tPct*2;
  $('#rt-time').textContent=timeLeft;
  try{ var __e1=document.getElementById('rt-sbest'); if(__e1) __e1.textContent=(localStorage.getItem('ra_streak_best_v1')||'0')+'연승'; }catch(e){}
  try{ var __td2=new Date().toISOString().slice(0,10); var __e2=document.getElementById('rt-first'); if(__e2) __e2.textContent=localStorage.getItem('ra_daily_v1')===__td2?'소진':'대기'; }catch(e){}
  try{ var __e3=document.getElementById('rt-xp'); var __xg3=localStorage.getItem('ra_xp_gain_v1'); if(__e3) __e3.textContent=__xg3?('+'+__xg3):'-'; }catch(e){}
  try{ var __e4=document.getElementById('rt-sp'); var __sg3=localStorage.getItem('ra_sp_gain_v1'); if(__e4) __e4.textContent=__sg3?('+'+__sg3):'-'; }catch(e){}
  try{ var __mirT=setInterval(function(){ try{ var __bar2=document.getElementById('ra-stats'); var __mir=document.getElementById('rt-mirror'); if(!__mir){ clearInterval(__mirT); return; } if(__bar2&&__bar2.textContent){ var __bt=__bar2.textContent.replace(/ · /g,'\n'); if(__bt&&__bt!==__mir.textContent) __mir.textContent=__bt; if(__bt) clearInterval(__mirT); } }catch(e){ try{ clearInterval(__mirT); }catch(e2){} } },200); setTimeout(function(){ try{ clearInterval(__mirT); }catch(e){} },8000); }catch(e){}
  $('#rt-sum').textContent=score;
  try{ hofRecord(score); }catch(e){}
  if(!S._tp){ S._tp=1; try{ var __d=applyTrophyDelta(S.winner); var __te=document.getElementById('rt-trophy'); if(__te){ __te.textContent=(__d>=0?'+':'')+__d; __te.style.color=__d>=0?'#ffe08a':'#ff8f8f'; } }catch(e){} }   // v105 #11: 트로피 증감
  $('#rt-emblem').textContent=['👑SSS','🎖️SS','⚔️S','🛡️A','🔰B'][ri];
  const next=ranks[ri-1];
  $('#rt-barfill').style.width = next? Math.min(100,Math.round(score/next[1]*100))+'%' : '100%';
  $('#rt-brief').textContent = ['사령부 최고 전술 평가 — 완벽한 정복!','훌륭한 지휘! 조금만 더 다듬으면 SSS입니다.','정예 지휘관의 모습입니다.','무난한 승리 — 왕관을 더 빨리 뽑아보세요.','기본에 충실한 전투였습니다.'][ri];
  if(!window.__rtabInit){ window.__rtabInit=1;
    $('#rtab-score').addEventListener('click',function(){ $('#rpane-score').classList.remove('hidden'); $('#rpane-rank').classList.add('hidden'); $('#rtab-score').classList.add('on'); $('#rtab-rank').classList.remove('on'); });
    $('#rtab-rank').addEventListener('click',function(){ $('#rpane-rank').classList.remove('hidden'); $('#rpane-score').classList.add('hidden'); $('#rtab-rank').classList.add('on'); $('#rtab-score').classList.remove('on'); });
  }
  $('#overlay-result').classList.toggle('lose',S.winner!=='blue');
  try{ var __sb=document.getElementById('screen-battle'); if(__sb) __sb.classList.add('ended'); }catch(e){}
  try{ var __dw=document.getElementById('dpsw'); if(__dw) __dw.classList.add('hidden'); }catch(e){} try{ window.__rFix(); }catch(e){} ambient=[]; parts=[];$('#overlay-result').classList.remove('hidden');   /* v151 결과모달 최적화: 결과 모달 위 위젯 충돌 제거 */
  var __fw=$('#fw-wrap');
  if(__fw){ __fw.innerHTML='';
    if(w==='blue'){
      var cols=['#f7c531','#ff9d3c','#7fb0ff','#ffe95e','#ffffff'];
      for(var b2=0;b2<3;b2++){ (function(bn){
        setTimeout(function(){
          for(var i2=0;i2<26;i2++){
            var sp=document.createElement('span'); sp.className='fw';
            var a2=Math.random()*6.283, dd=40+Math.random()*130;
            sp.style.left=(15+Math.random()*70)+'%'; sp.style.top=(8+Math.random()*40)+'%';
            sp.style.setProperty('--tx',Math.cos(a2)*dd+'px'); sp.style.setProperty('--ty',Math.sin(a2)*dd+'px');
            sp.style.background=cols[(Math.random()*cols.length)|0];
            sp.style.animationDelay=(bn*0.06)+'s';
            __fw.appendChild(sp);
            (function(node){ setTimeout(function(){ if(node.parentNode) node.parentNode.removeChild(node); },1400); })(sp);
          }
        }, bn*280);
      })(b2); }
      var cd=$('#crown-drop'); if(cd){ cd.classList.remove('hidden'); setTimeout(function(){ cd.classList.add('hidden'); },2800); }
    }
  }
}

function aiMeta(){   // v143: 승패 이력 기반 메타 난이도 -0.5(자비)~+1(가혹) — 최근 5전 연승/연패·트로피 등급 반영
  try{
    var h=JSON.parse(localStorage.getItem('ra_hist_v1')||'[]');
    if(!Array.isArray(h)) h=[];
    var streak=0;
    for(var i=h.length-1;i>=0;i--){ if(h[i]==='W') streak++; else if(h[i]==='L') streak--; else break; }
    var tp=Math.max(0,Math.min(1,(loadTrophies?loadTrophies():0)/600));
    return Math.max(-0.5,Math.min(1, streak*0.2 + tp*0.6 - 0.3));
  }catch(e){ return 0; }
}
function aiDiff(){   // v73: 동적 난이도 -1(자비)~+1(가혹) — 플레이어가 앞서면 AI 강화, 뒤처지면 완화
  const lead=S.crowns.blue-S.crowns.red;
  const hpB=towers.reduce((a,t)=>t.team==='blue'&&!t.dead?a+t.hp/t.maxHp:a,0);
  const hpR=towers.reduce((a,t)=>t.team==='red'&&!t.dead?a+t.hp/t.maxHp:a,0);
  const d=lead*0.5+(hpB-hpR)*0.5;
  return Math.max(-1,Math.min(1,d));
}
function regenElixir(dt){
  const rate=(1/2.8)*(S.double?2:1);
  P.elixir=Math.min(ELX_MAX,P.elixir+rate*(S&&S.__rin==='relic_gravy'?1.15:1)*(S&&S.relic==='relic_gold'?1.1:1)   /* v297: 재정의 인장 */*(1+0.06*((S._sk&&S._sk.mag1)||0)+0.06*((S._sk&&S._sk.mag3)||0))*dt);   // v119: 스킬트리 엘릭서 회복   // v109 #13: 유물 — 황금 엘릭서 통
  A.elixir=Math.min(ELX_MAX,A.elixir+rate*0.95*__raAel()*(1+0.18*(aiDiff()*0.7+aiMeta()*0.3))*dt);   /* v143: 승패 이력 메타 난이도 혼합 */
}
function updateFx(dt){
  updateAmbient(dt);
  updateParts(dt);
  for(const f of fx){   /* v326: 지역 지속 이펙트 틱 */
    if(f.kind==='snowzone'){ f._acc=(f._acc||0)+dt; const __zt=f._acc>=0.5; if(__zt) f._acc=0;   /* v407: 눈보라 냉기 틱 — 둔화 유지+10dps(0.5s마다 5) */
      for(const u of units){ if(u.dead||u.isTower||u.team===f.team) continue; if(Math.hypot(u.x-f.x,u.y-f.y)<=f.r){ u.slowT=Math.max(u.slowT||0,0.6); if(__zt){ dealDamage(u,spellDmg(5),f.team,true); if(Math.random()<0.35) floats.push({dx:(Math.random()*10-5),dy:0,x:u.x,y:u.y-1.1,txt:'❄',t:0.45,col:'#bfe4ff',big:false}); } } } }
    else if(f.kind==='plasmazone'||f.kind==='crater'){ f._acc=(f._acc||0)+dt; const __zt=f._acc>=0.5; if(__zt) f._acc=0;   /* v407: 존 틱 데미지 — 플라즈마 8dps·분화구 6dps(0.5s마다) */
      if(__zt) for(const u of units){ if(u.dead||u.isTower||u.team===f.team) continue; if(Math.hypot(u.x-f.x,u.y-f.y)<=f.r){ dealDamage(u,spellDmg(f.kind==='plasmazone'?4:3),f.team,true); if(Math.random()<0.35) floats.push({dx:(Math.random()*10-5),dy:0,x:u.x,y:u.y-1.1,txt:f.kind==='plasmazone'?'⚡':'🔥',t:0.45,col:f.kind==='plasmazone'?'#cf9dff':'#ff9d3c',big:false}); } } }
    else if(f.kind==='healzone'){ f._acc=(f._acc||0)+dt; const __zt=f._acc>=0.5; if(__zt) f._acc=0;   /* v409: 잔류 회복 존 — 0.5s마다 아군 +5(10dps) */
      if(__zt) for(const u of units){ if(u.dead||u.isTower||u.team!==f.team||u.hp>=u.maxHp) continue; if(Math.hypot(u.x-f.x,u.y-f.y)<=f.r){ u.hp=Math.min(u.maxHp,u.hp+5); addParts(u.x,u.y-0.3,2,'#a8f0c0',1.2,0.5,55); if(Math.random()<0.5) floats.push({dx:(Math.random()*10-5),dy:0,x:u.x,y:u.y-1.1,txt:'+5',t:0.5,col:'#8fe6a8',big:false}); } } }   /* v469: 힐 존 잎사귀 파티클 상승 */    else if(f.kind==='venomzone'){ f._acc2=(f._acc2||0)+dt; const __vt=f._acc2>=0.5; if(__vt) f._acc2=0;   /* v409: 맹독 존 재진입 재부여 — 존 내 적은 중독 6s 유지 갱신(venDps 30 유지) */
      if(__vt) for(const u of units){ if(u.dead||u.isTower||u.team===f.team) continue; if(Math.hypot(u.x-f.x,u.y-f.y)<=f.r){ u.venT=Math.max(u.venT||0,6); u.venDps=Math.max(u.venDps||0,30); } } }
    else if(f.kind==='stormzone'){ f._acc=(f._acc||0)+dt; const __zt=f._acc>=0.5; if(__zt) f._acc=0;   /* v408: 번개 폭풍 틱 — 6dps(0.5s마다 3)+진입 미니기절(존당 1회·재진입 재부여) */
      for(const u of units){ if(u.dead||u.isTower||u.team===f.team) continue; if(Math.hypot(u.x-f.x,u.y-f.y)<=f.r){ if(u._stormId!==f){ u._stormId=f; u.stun=Math.max(u.stun||0,0.3); floats.push({dx:(Math.random()*10-5),dy:0,x:u.x,y:u.y-1.2,txt:'⚡ 기절',t:0.6,col:'#ffe95e',big:false}); }
        if(__zt){ dealDamage(u,spellDmg(3),f.team,true); if(Math.random()<0.35) floats.push({dx:(Math.random()*10-5),dy:0,x:u.x,y:u.y-1.1,txt:'⚡',t:0.45,col:'#ffe95e',big:false}); } } } }
    else if(f.kind==='burnzone'){ f._acc=(f._acc||0)+dt; if(f._acc>=0.5){ f._acc=0;
      for(const u of units){ if(u.dead||u.isTower||u.team===f.team) continue; if(Math.hypot(u.x-f.x,u.y-f.y)<=f.r){ u.burnT=Math.max(u.burnT||0,1.5); u.burnDps=Math.max(u.burnDps||0,14); u.burnAcc=0; } } } }
  }
  for(const f of fx) f.t+=dt;
  fx=fx.filter(f=>f.t<f.dur);
  for(const f of floats) f.t-=dt;
  floats=floats.filter(f=>f.t>0);
}
function update(dt){
  try{ if(TUT.on&&P.elixir<6) P.elixir=6; }catch(e){}   /* v147: 튜토리얼 중 엘릭서 하한 보장(플로어 6) */
  try{ if(S.pre===0&&!S.over){ DPSW.time+=dt; DPSW._c++; if(DPSW._c%30===0) dpswRender(); } }catch(e){}   /* v148: 경과 가산·위젯 갱신(0.5초) */
  if(S.scene!=='battle') return;
  if(S.over){
    S.endTimer-=dt;
    if(S.endTimer<=0&&!S.shown){ S.shown=true; showResult(); }
    updateProjs(dt); updateFx(dt);
    return;
  }
  if(S.pre>0){
    const b4=Math.ceil(S.pre-0.6); S.pre-=dt; const af=Math.ceil(S.pre-0.6);
    if(af!==b4&&af>=0) banner(af>0?'⏰ '+af:'⚔ 전투 시작!', af>0?650:1200);
    if(S.pre<=0){ S.pre=0; sfx('crown'); }
    updateFx(dt); return;
  }
  S.t-=dt;
  if(!S.overtime&&!S.double&&S.t<=60){ S.double=true; banner('⏱ 엘릭서 2배!'); }
  if(S.t<=0){
    if(!S.overtime){
      if(S.crowns.blue!==S.crowns.red) finish(S.crowns.blue>S.crowns.red?'blue':'red');
      else { S.overtime=true; S.double=true; S.t=60; banner('⚔ 연장전 — 먼저 왕관을 뽑는 팀이 승리!',2200); try{ document.getElementById('screen-battle').classList.add('sd-mode'); }catch(e){ } }   /* v194: 서든데스 붉은 펄스 */
    } else finish('draw');
  }
  regenElixir(dt);
  if(!S.bossSpawned&&S.t<=90&&!S.over){ spawnBossNow(); }   /* v192 폴백: 잔여 90초 */
  aiTick(dt);
  if(S.ksCd>0) S.ksCd-=dt;
  if(S.repCd>0) S.repCd-=dt;   // v106 #12: 수리 쿨다운
  if(S.boss&&!S.boss.dead){ const b=S.boss; b.doom+=dt;
    if(b.doom>=12){ b.doom=0; const kt=towers.find(t=>t.team==='blue'&&t.kind==='king'&&!t.dead);
      if(kt){ dealDamage(kt,500,'red'); fx.push({x:kt.x,y:kt.y,t:0,dur:0.7,kind:'boom'}); var __mu=__raMAPS[__raMapIdx()], __uz=__mu?__mu.ult:null, __ur=2.2; if(__uz==='lava'){ fx.push({x:kt.x,y:kt.y,t:0,dur:4.5,kind:'burnzone',r:__ur,team:'red'}); } else if(__uz==='frost'){ fx.push({x:kt.x,y:kt.y,t:0,dur:6,kind:'snowzone',r:__ur,team:'red'}); } else if(__uz==='abyss'){ fx.push({x:kt.x,y:kt.y,t:0,dur:6,kind:'venomzone',r:__ur,team:'red'}); } else if(__uz==='waste'){ fx.push({x:kt.x,y:kt.y,t:0,dur:8,kind:'crater',r:__ur,team:'red'}); } S.shake=0.6; banner('💥 파멸기 폭발!'+(__mu?' — '+__mu.boss:''),1800); } } }
  if(S.boss&&S.boss.dead){ S.kills.blue+=5; P.elixir=ELX_MAX; P._full=false;
    S.focus=null; S.focusGap=1.5;   // v116: 보스 격파 줌인 삭제(사용자 지정) — 즉시 해제 + 1.5s 신규 포커스 억제
    banner('💀 보스 토벌! 엘릭서 만땅 · 킬 +5',2200); sfx('crown');
    if((S.__bossWave||0)<5){ S.__bossWave=(S.__bossWave||0)+1;   /* v220 P9: 5웨이브 확장 */ setTimeout(function(){ try{ if(S.over) return; S.bossSpawned=false; spawnBossNow(); banner('💀 보스 웨이브 '+(S.__bossWave+1)+' 강림!',2200); }catch(e){} },60000); }   /* v214 P9: 보스 레이드 — 최대 4웨이브·60s 주기 */
    fx.push({x:S.boss.x,y:S.boss.y,t:0,dur:0.9,kind:'ring',col:'rgba(247,197,49,.95)'});
    S.boss=null; const kb=document.getElementById('ks-btn'); if(kb) kb.classList.add('hidden'); }
  for(const u of units) if(!u.dead){ try{ updateUnit(u,dt); }catch(err){ u.target=null; } }
  for(let i=0;i<units.length;i++)for(let j=i+1;j<units.length;j++){
    const a=units[i],b=units[j];
    if(a.c.flying!==b.c.flying) continue;
    const dx=b.x-a.x, dy=b.y-a.y, dd=Math.hypot(dx,dy)||0.01, min=(a.c.r+b.c.r)*0.92;
    if(dd<min){ const push=(min-dd)*0.5, ux=dx/dd, uy=dy/dd;
      a.x=clamp(a.x-ux*push,0.6,COLS-0.6); b.x=clamp(b.x+ux*push,0.6,COLS-0.6);
      if(a.c.flying){ a.y=clamp(a.y-uy*push,0.6,ROWS-0.6); b.y=clamp(b.y+uy*push,0.6,ROWS-0.6); } } }
  for(const u of units){ // 밀어내기 후 강 복귀 방지: 지상 유닛은 다리 밖 밴드 진입 시 X축으로만 재정렬
    if(u.c.flying||u.building) continue;
    if(u.y>RIVER_Y0-0.25&&u.y<RIVER_Y1+0.25){
      const bx=Math.abs(u.x-BRIDGES[0])<Math.abs(u.x-BRIDGES[1])?BRIDGES[0]:BRIDGES[1];
      if(Math.abs(u.x-bx)>=0.75) u.y=u.y>=RIVER_MID?RIVER_Y1+0.25:RIVER_Y0-0.25; } }
  for(const t of towers) if(!t.dead) updateTower(t,dt);
  updateProjs(dt); updateFx(dt);
  units=units.filter(u=>!u.dead);
  { // 전투 하이라이트: 격전 군집화 — 동시 2곳이면 '최근 전투 우선'(현재 추적 격전이 살아있는 한 유지, 블렌딩 없음)
    const fights=[];
    for(const u of units){ if(u.target&&!u.target.dead&&!u.building&&u.spawnFx<=0){
      const rr=u.c.range+(u.target.r||(u.target.c&&u.target.c.r)||0.5);
      if(dist(u,u.target)<=rr) fights.push({x:(u.x+u.target.x)/2,y:(u.y+u.target.y)/2,w:u.target.isTower?2:1}); } }   // 타원 공성 1기도 발화
    for(const p of projs){ const pt=p.target; if(p.kind!=='fireball'&&pt&&!pt.dead)
      fights.push({x:(p.x+pt.x)/2,y:(p.y+pt.y)/2,w:1}); }   // 타워 방어 사격 포함
    const cls=[];
    for(const f of fights){
      let best=null,bd=1e9;
      for(const c of cls){ const d=Math.hypot(c.x-f.x,c.y-f.y); if(d<bd){bd=d;best=c;} }
      if(best&&bd<4.0){ best.x=(best.x*best.n+f.x)/(best.n+1); best.y=(best.y*best.n+f.y)/(best.n+1); best.n++; best.w+=f.w; }
      else cls.push({x:f.x,y:f.y,n:1,w:f.w});
    }
    let pick=null;
    if(S.clash){ let bc=null,bw=0;   // 히스테리시스: 현재 추적 격전 군집이 살아있으면 그쪽 유지
      for(const c of cls){ const d=Math.hypot(c.x-S.clash.x,c.y-S.clash.y);
        if(d<4.5&&c.w>bw){ bw=c.w; bc=c; } }
      pick=bc;
    }
    if(!pick){ let mw=0; for(const c of cls) if(c.w>mw){ mw=c.w; pick=c; } }
    if(pick&&pick.w>=2){
      if(!S.clash) S.clash={x:pick.x,y:pick.y,a:0};
      S.clash.x=lerp(S.clash.x,pick.x,0.1); S.clash.y=lerp(S.clash.y,pick.y,0.1);
      S.clash.a=Math.min(1,S.clash.a+0.08);
    } else if(S.clash){ S.clash.a=Math.max(0,S.clash.a-0.06); if(S.clash.a<=0) S.clash=null; }
  }
}

/* ---------- 적 AI (REA 설계도 §7) ---------- */
function firstIn(hand,prio){ for(const k of prio) if(hand.includes(k)) return k; return null; }
function bestCluster(list,rad){
  let best=null;
  for(const a of list){
    let hp=0,cx=0,cy=0,n=0;
    for(const b of list){ if(Math.hypot(a.x-b.x,a.y-b.y)<=rad){ hp+=b.hp; cx+=b.x; cy+=b.y; n++; } }
    if(n>=3&&(!best||hp>best.hp)) best={x:cx/n,y:cy/n,hp,n};
  }
  return best;
}
function aiTick(dt){
  A.timer-=dt; if(A.timer>0) return;
  A.timer=(1.0+Math.random()*0.8)/(1+0.25*(aiDiff()*0.7+aiMeta()*0.3));   /* v143 */
  const hand=A.hand;
  if(!A._opened){ A._opened=1; var __fp=firstIn(hand,['knight','valk','musketeer','archers','skarmy','minions'])||hand[0]; playCard(A,hand.indexOf(__fp),Math.random()<0.5?BRIDGES[0]:BRIDGES[1],3.2); return; }   /* v403: 개전 5초 첫 배치 보장 — 코스트≤5 확정 스폰 */
  const threats=units.filter(u=>u.team==='blue'&&!u.dead&&u.spawnFx<=0&&u.y<17.5);
  let pick=null,px=9,py=6;
  if(threats.length){
    let main=threats[0]; for(const t of threats) if(t.hp>main.hp) main=t;
    const anyFly=threats.some(t=>t.c.flying), tank=main.hp>=900;
    const prio= anyFly?['musketeer','wizard','babyd','sniper','archers','minions']
             : tank?['skarmy','minions','cannon','valk','boar','bomber','wizard','knight','archers']
             :['knight','valk','archers','skarmy','musketeer','bomber','icem','cleric','wizard','minions'];
    pick=firstIn(hand,prio);
    px=clamp(main.x,2,16); py=clamp(main.y-3.2,2.5,14.5);
    if(pick==='cannon') py=clamp(main.y-5,3,12);
  } else {
    const cl=bestCluster(units.filter(u=>u.team==='blue'),1.9);
    if(cl&&cl.hp>=330&&hand.includes('fireball')){ pick='fireball'; px=cl.x; py=cl.y; }
    else if(cl&&cl.n>=4&&cl.hp<=620&&hand.includes('zap')){ pick='zap'; px=cl.x; py=cl.y; }
    else if(A.elixir>=ELX_MAX-1-2*Math.max(0,aiMeta())){   /* v143: 카운터푸시 강도 — 연승·상위 등급일수록 낮은 엘릭서에서 선제 푸시 */
      pick=firstIn(hand,['giant','prince','knight','wizard','musketeer','archers','minions','skarmy'])||hand[0];
      px=Math.random()<0.5?BRIDGES[0]:BRIDGES[1]; py=3.2;
    } else if(A.elixir>=6&&Math.random()<0.55){
      pick=firstIn(hand,['musketeer','wizard','sniper','archers','minions','knight','skarmy']);
      const pusher=units.find(u=>u.team==='red'&&!u.dead&&u.y>16.5);
      if(pusher){ px=clamp(pusher.x,2,16); py=clamp(pusher.y-2.5,2.5,14.5); } // 카운터푸시 합류
      else { px=9+(Math.random()*6-3); py=5+Math.random()*4; }
    }
  }
  if(!pick&&S.boss&&!S.boss.dead&&A.elixir>=ELX_MAX-1){ pick=firstIn(hand,['knight','archers','musketeer','skarmy','minions'])||hand[0]; px=Math.random()<0.5?BRIDGES[0]:BRIDGES[1]; py=3.2; }   /* v402: 보스 중 스폰 보장 — 엘릭서 만접이면 교전 무관 배치 */
  if(!pick) return;
  playCard(A,hand.indexOf(pick),px,py);
}
function playCard(side,idx,x,y){
  const key=side.hand[idx]; if(!key) return false;
  const c=CARDS[key]; if(c.cost>side.elixir) return false;
  side.elixir-=c.cost;
  spawnCard(key, side===P?'blue':'red', x, y);
  side.hand[idx]=side.queue.shift(); side.queue.push(key);
  if(side===P) syncHand();
  sfx('deploy');
  return true;
}

/* ---------- 파티클 ---------- */
function addParts(x,y,n,col,spd,life,grav){
  if(parts.length>380) return;
  for(let i=0;i<n;i++){ const a=Math.random()*6.283, v=spd*(0.4+Math.random()*0.6);
    parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-(grav?24:0),t:life*(0.7+Math.random()*0.6),max:life,col,grav:grav||0,r:1.5+Math.random()*2.2}); }
}
function updateParts(dt){
  for(const p of parts){ p.t-=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; if(p.grav) p.vy+=p.grav*dt; }
  parts=parts.filter(p=>p.t>0);
}
function drawParts(){
  for(const p of parts){
    ctx.globalAlpha=Math.max(0,p.t/p.max);
    ctx.fillStyle=p.col;
    ctx.beginPath(); ctx.arc(p.x*TILE,p.y*TILE,p.r,0,7); ctx.fill();
  }
  ctx.globalAlpha=1;
}
let ambient=[];
function updateAmbient(dt){
  const T=THEMES[S.theme];
  if(!T||!T.amb||S.scene!=='battle') return;
  if(ambient.length<50&&Math.random()<0.45){
    if(T.amb==='ember') ambient.push({x:Math.random()*COLS,y:ROWS+0.5,vy:-(1.6+Math.random()*1.6),vx:(Math.random()-0.5)*0.5,t:0,max:5+Math.random()*3});
    else ambient.push({x:Math.random()*COLS,y:-0.6,vy:0.9+Math.random()*0.9,vx:(Math.random()-0.5)*0.6,t:0,max:7+Math.random()*4});
  }
  for(const a of ambient){ a.t+=dt; a.y+=a.vy*dt; a.x+=a.vx*dt; }
  ambient=ambient.filter(a=>a.t<a.max&&a.y>-1&&a.y<ROWS+1.5);
}
function drawAmbient(){
  for(const a of ambient){
    const px=a.x*TILE, py=a.y*TILE, fade=Math.min(1,a.t*2,(a.max-a.t)*2);
    if(S.theme==='wasteland'){ try{ ctx.globalAlpha=fade*0.55; ctx.fillStyle='rgba(225,205,140,.85)'; ctx.fillRect(((a.x*VW/COLS)+now*46)%VW, a.y*H, 16, 1.6); ctx.fillStyle='rgba(200,180,120,.6)'; ctx.fillRect(((a.x*VW/COLS)+now*28+60)%VW, a.y*H+5, 10, 1.2); }catch(e){} }   /* v222: 황야 모래바람 */
  if(S.theme==='abyss'){ try{ ctx.globalAlpha=fade*(0.4+0.3*Math.sin(now*5+a.y*9)); ctx.fillStyle='#a893ff'; ctx.beginPath(); ctx.arc(a.x*VW/COLS, a.y*H-((now*14)%40), 2.1, 0, 7); ctx.fill(); }catch(e){} }   /* v222: 심연 아케인 스파크 */
  if(S.theme==='lava'){ ctx.globalAlpha=fade*(0.55+0.4*Math.sin(now*6+a.x*7));
      ctx.fillStyle='#ff9d3c'; ctx.beginPath(); ctx.arc(px,py,2.2,0,7); ctx.fill();
      ctx.globalAlpha=fade*0.3; ctx.fillStyle='#ffd75e'; ctx.beginPath(); ctx.arc(px,py,4.5,0,7); ctx.fill(); }
    else { ctx.globalAlpha=fade*0.8; ctx.fillStyle='#fff';
      ctx.beginPath(); ctx.arc(px,py,1.8,0,7); ctx.fill(); }
  }
  ctx.globalAlpha=1;
}
let vig=null;
function drawVignette(){
  if(!vig){ vig=ctx.createRadialGradient(VW/2,VH/2,VH*0.42,VW/2,VH/2,VH*0.75);
    vig.addColorStop(0,'rgba(0,0,0,0)'); vig.addColorStop(1,'rgba(8,14,26,.35)'); }
  ctx.fillStyle=vig; ctx.fillRect(-BAND,-VBAND,VW,VH);
}

/* ---------- 렌더링 ---------- */
const canvas=$('#arena'), ctx=canvas.getContext('2d');
const BSCALE=2;
canvas.width=W*BSCALE; canvas.height=H*BSCALE; ctx.scale(BSCALE,BSCALE);
const bgc=document.createElement('canvas'); bgc.width=W*BSCALE; bgc.height=H*BSCALE;
function roundRect(x,y,w,h,r){
  ctx.beginPath(); ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
}
function drawStatic(){
  const T=THEMES[S.theme];
  const g=bgc.getContext('2d');
  g.setTransform(BSCALE,0,0,BSCALE,BAND*BSCALE,0);
  g.fillStyle=T.g1; g.fillRect(-BAND,-VBAND,VW,VH);   /* v394: 단색 지면 풀핏 — 이미지 의존 0 */
  const __gt=(typeof GT_IM!=='undefined')&&GT_IM[S.theme];
  if(__gt&&__gt.complete&&__gt.naturalWidth){ g.drawImage(__gt,-BAND,-VBAND,VW,VH); }   /* v396: 텍스처 지면 복원 — GT 미로딩 시 단색 폴백 */
  g.fillStyle='rgba(15,23,42,'+((S.theme==='lava')?0.50:(S.theme==='ice')?0.56:0.54)+')'; g.fillRect(-BAND,-VBAND,VW,VH);   /* v145b 베일 */
  g.fillStyle=S.theme==='lava'?'rgba(255,90,30,.16)':S.theme==='ice'?'rgba(140,200,255,.22)':'rgba(63,123,245,.13)';
  g.fillRect(-BAND,RIVER_Y1*TILE,VW,VH-RIVER_Y1*TILE);
  g.fillStyle='rgba(230,76,76,.14)'; g.fillRect(-BAND,-VBAND,VW,RIVER_Y0*TILE+VBAND);
  g.fillStyle=T.road;
  for(const bx of BRIDGES){
    g.fillRect((bx-0.45)*TILE, RIVER_Y1*TILE, 0.9*TILE, 9.2*TILE);
    g.fillRect((bx-0.45)*TILE, RIVER_Y0*TILE-9.2*TILE, 0.9*TILE, 9.2*TILE);
  }
  g.strokeStyle='rgba(255,255,255,.15)'; g.setLineDash([7,9]); g.lineWidth=2;
  g.beginPath(); g.moveTo(-BAND,BLUE_DEPLOY_MIN*TILE); g.lineTo(VW-BAND,BLUE_DEPLOY_MIN*TILE);
  g.moveTo(-BAND,RED_DEPLOY_MAX*TILE); g.lineTo(VW-BAND,RED_DEPLOY_MAX*TILE); g.stroke(); g.setLineDash([]);
  g.fillStyle='#c9b27a';
  g.fillRect(-BAND,RIVER_Y0*TILE-6,VW,6); g.fillRect(-BAND,RIVER_Y1*TILE,VW,6);
  const __rim=RIVER_IM[S.theme];
  if(__rim&&__rim.complete&&__rim.naturalWidth){ g.drawImage(__rim,-BAND,RIVER_Y0*TILE,VW,(RIVER_Y1-RIVER_Y0)*TILE); }
  else{
    g.fillStyle=T.riverA; g.fillRect(-BAND,RIVER_Y0*TILE,VW,(RIVER_Y1-RIVER_Y0)*TILE);
    g.fillStyle=T.riverB; g.fillRect(-BAND,RIVER_Y0*TILE+4,VW,(RIVER_Y1-RIVER_Y0)*TILE-8);
    g.fillStyle='rgba(255,255,255,.20)'; g.fillRect(-BAND,RIVER_Y0*TILE,VW,3); g.fillRect(-BAND,RIVER_Y1*TILE-3,VW,3);
  }
  for(const b of BRIDGES){
    if(BRIDGE_IM.complete&&BRIDGE_IM.naturalWidth){ const bx2=(b-0.8)*TILE, bw2=1.6*TILE; g.save(); const __bh=BRIDGE_IM.naturalHeight/BRIDGE_IM.naturalWidth*bw2; g.drawImage(BRIDGE_IM,bx2,RIVER_Y0*TILE-7,bw2,__bh); g.restore(); continue; }
    const bx=(b-0.8)*TILE, bw=1.6*TILE, bh=(RIVER_Y1-RIVER_Y0)*TILE+16;
    g.fillStyle='rgba(0,0,0,.20)'; g.fillRect(bx-3,RIVER_Y0*TILE-9,bw+6,bh+7);
    g.fillStyle='#8a5a2b'; g.fillRect(bx,RIVER_Y0*TILE-8,bw,bh);
    g.fillStyle='#a06a33';
    for(let i=0;i<7;i++) g.fillRect(bx+3,RIVER_Y0*TILE-6+i*(bh-6)/7,bw-6,5);
    g.fillStyle='#6d441c'; g.fillRect(bx,RIVER_Y0*TILE-8,5,bh); g.fillRect(bx+bw-5,RIVER_Y0*TILE-8,5,bh);
    g.fillStyle='#5a3a17'; g.fillRect(bx,RIVER_Y0*TILE-11,bw,4); g.fillRect(bx,RIVER_Y0*TILE+bh+3,bw,4);
  }
  for(const t of towers){
    const R=t.kind==='king'?54:44;
    g.fillStyle='rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(t.x*TILE,t.y*TILE+10,R+6,(R+6)*0.42,0,0,7); g.fill();
    g.fillStyle=T.stone; g.beginPath(); g.ellipse(t.x*TILE,t.y*TILE+8,R,R*0.40,0,0,7); g.fill();
    g.fillStyle=T.stoneHi; g.beginPath(); g.ellipse(t.x*TILE,t.y*TILE+6,R,R*0.40,0,0,7); g.fill();
    g.strokeStyle=T.stoneEdge; g.lineWidth=2; g.stroke();
  }
  const deco=S.theme==='classic'?[]:[[0.9,13.2,'b'],[17.1,18.8,'b'],[0.9,19.4,'b'],[17.1,12.8,'b'],[8.9,14.5,'f'],[5.2,14.4,'f'],[12.8,17.6,'f']];
  for(const d of deco){
    const dx=d[0]*TILE, dy=d[1]*TILE;
    if(d[2]==='b'){ g.fillStyle=T.bush; g.beginPath(); g.arc(dx-6,dy,8,0,7); g.arc(dx+5,dy-3,10,0,7); g.arc(dx+1,dy+5,7,0,7); g.fill();
      g.fillStyle='rgba(255,255,255,.14)'; g.beginPath(); g.arc(dx+3,dy-6,4,0,7); g.fill(); }
    else { g.fillStyle=T.flower; g.beginPath(); g.arc(dx,dy,3.5,0,7); g.fill();
      g.fillStyle='rgba(255,255,255,.7)'; g.beginPath(); g.arc(dx-1,dy-1,1.4,0,7); g.fill(); }
  }
  if(WALL_IM.complete&&WALL_IM.naturalWidth){
    g.drawImage(WALL_IM,BAND,-VBAND,VW,22); g.save(); g.translate(BAND+VW,VH-VBAND); g.rotate(Math.PI); g.drawImage(WALL_IM,BAND,0,VW,22); g.restore();
  }
  g.fillStyle='rgba(255,255,255,.25)'; g.fillRect(BAND,-VBAND,VW,2);
  g.fillStyle='rgba(0,0,0,.25)'; g.fillRect(BAND,VH-VBAND-2,VW,2);
}
function flagPole(px,py,col){
  ctx.strokeStyle='#5a4632'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(px,py-22); ctx.stroke();
  const wv=Math.sin(now*5+px*0.13)*2.5;
  ctx.fillStyle=col; ctx.beginPath();
  ctx.moveTo(px,py-22); ctx.quadraticCurveTo(px+10,py-21+wv,px+18,py-18+wv);
  ctx.lineTo(px,py-13); ctx.closePath(); ctx.fill();
}
function towSkin(k,im){   /* v144: 타워 테마 스킨 — 용암/서리 틴트 캐시(팀 식별은 깃발·HP바 색 유지) */
  try{
    if(S.theme==='classic'||!im||!im.complete||!im.naturalWidth) return im;
    towSkin.c=towSkin.c||{}; var key=S.theme+'|'+k;
    if(towSkin.c[key]) return towSkin.c[key];
    var cv=document.createElement('canvas'); cv.width=im.naturalWidth; cv.height=im.naturalHeight;
    var c2=cv.getContext('2d'); c2.drawImage(im,0,0);
    c2.globalCompositeOperation='source-atop'; c2.globalAlpha=(S.theme==='lava')?0.52:0.46;   /* v144b: 가시 틴트 강도 */
    c2.fillStyle=(S.theme==='lava')?'#ff8a3c':'#9cdcff'; c2.fillRect(0,0,cv.width,cv.height);
    towSkin.c[key]=cv; return cv;
  }catch(e){ return im; }
}
function drawTower(t){try{
      var __tc=(t.kind==='king'?'t_king':'t_princess')+(t.team==='blue'?'_b':'_r');
      var __im=(typeof TSPR!=='undefined')?TSPR[__tc]:null; if(__im) __im=towSkin(__tc,__im);   /* v144: 테마 스킨 적용 */
      var __tsk=__towSkinImg(S.theme,t.kind==='king',t.team); if(__tsk) __im=__tsk;   /* v324 → v488: 킹타워 포함 테마 스킨 */
      if(!(__im&&((__im.getContext)||(__im.complete&&__im.naturalWidth>0&&__im.__valid!==false)))){   /* v144: 틴트 캔버스 허용 */
        var x=t.x*TILE,y=t.y*TILE,king=t.kind==='king';
        var hs=king?128:100,ytop=Math.max(y+14-hs,6);
        ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x,Math.min(y+10,ytop+hs-6),hs*0.42,hs*0.16,0,0,7);ctx.fill();
        var bw=king?86:70;
        ctx.fillStyle=t.team==='blue'?'#7d97c9':'#c97d7d';ctx.fillRect(x-bw/2,ytop+hs*0.35,bw,hs*0.6);
        ctx.strokeStyle='rgba(20,26,40,.6)';ctx.lineWidth=3;ctx.strokeRect(x-bw/2,ytop+hs*0.35,bw,hs*0.6);
        ctx.fillStyle=t.team==='blue'?'#5c74a8':'#a85c5c';
        for(var i2=0;i2<4;i2++)ctx.fillRect(x-bw/2+i2*(bw/4)+2,ytop+hs*0.22,bw/4-4,hs*0.16);
        ctx.fillStyle=t.team==='blue'?'#3f5f96':'#963f3f';
        ctx.beginPath();ctx.moveTo(x-bw/2-4,ytop+hs*0.36);ctx.lineTo(x+bw/2+4,ytop+hs*0.36);ctx.lineTo(x,ytop+hs*0.06);ctx.closePath();ctx.fill();
        if(king){ctx.fillStyle='#ffd75e';ctx.beginPath();ctx.moveTo(x-14,ytop+hs*0.02);ctx.lineTo(x-7,ytop+hs*0.10);ctx.lineTo(x,ytop);ctx.lineTo(x+7,ytop+hs*0.10);ctx.lineTo(x+14,ytop+hs*0.02);ctx.lineTo(x+10,ytop+hs*0.14);ctx.lineTo(x-10,ytop+hs*0.14);ctx.closePath();ctx.fill();}
        var hr=Math.max(0,t.hp/t.maxHp),bw3=king?80:62,bx=x-bw3/2,by=ytop+hs+8;
        ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(bx-2,by-2,bw3+4,12);
        ctx.fillStyle='#20293a';ctx.fillRect(bx,by,bw3,8);
        ctx.fillStyle=t.team==='blue'?'#4ade80':'#ff7b6b';ctx.fillRect(bx,by,bw3*hr,8);
        ctx.font=" + FD + ";ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(8,12,22,.95)';
        ctx.strokeText(Math.ceil(t.hp),clamp(x,26,W-26),by-6); ctx.fillStyle='#ffe08a'; ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(Math.ceil(t.hp),clamp(x,26,W-26),by-6);ctx.fillText(Math.ceil(t.hp),clamp(x,26,W-26),by-6);
        return;
      }
    }catch(__pe){ if(!window.__pe1)window.__pe1='towerFb:'+__pe.message; }try{
  const x=t.x*TILE, y=t.y*TILE, king=t.kind==='king';
  const tw=king?'t_king':'t_princess', tc=tw+(t.team==='blue'?'_b':'_r');
  if(TSPR[tc]&&TSPR[tc].complete&&TSPR[tc].naturalWidth>0&&TSPR[tc].__valid!==false){
    const hr=t.hp/t.maxHp, hs=king?128:100, ytop=Math.max(y+14-hs,6), by0=Math.max(ytop-18,10);
    ctx.fillStyle='rgba(0,0,0,.22)'; ctx.beginPath();
    ctx.ellipse(x,Math.min(y+10,ytop+hs-6),hs*0.42,hs*0.16,0,0,7); ctx.fill();
    var __tsk2=__towSkinImg(S.theme,king,t.team); if(__tsk2) ctx.drawImage(__tsk2,x-hs/2,ytop,hs,hs); else ctx.drawImage(TSPR[tc],x-hs/2,ytop,hs,hs);   /* v324 → v488: 킹타워 포함 테마 스킨 */
    if(hr<0.55){ ctx.strokeStyle='rgba(25,30,42,.7)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(x-hs*0.2,ytop+hs*0.45); ctx.lineTo(x-hs*0.1,ytop+hs*0.62); ctx.lineTo(x-hs*0.17,ytop+hs*0.8); ctx.stroke(); }
    if(hr<0.25){ for(let i=0;i<3;i++){ const sy=((now*22+i*26)%50);
      ctx.fillStyle='rgba(90,90,95,'+(0.30-sy*0.005)+')';
      ctx.beginPath(); ctx.arc(x+hs*0.22,ytop+hs*0.1-sy,5+sy*0.14,0,7); ctx.fill(); } }
    if(king&&!t.active){ ctx.font='14px sans-serif'; ctx.textAlign='center'; ctx.fillText('💤',x-hs*0.3,ytop+18); }
    const bw=king?80:62, bx=x-bw/2, by=by0<14?ytop+hs+8:by0;
    ctx.fillStyle='rgba(0,0,0,.6)'; roundRect(bx-2,by-2,bw+4,12,5); ctx.fill();
    ctx.fillStyle='#20293a'; roundRect(bx,by,bw,8,4); ctx.fill();
    ctx.fillStyle=t.team==='blue'?'#4ade80':'#ff7b6b';
    roundRect(bx,by,bw*Math.max(0,hr),8,4); ctx.fill();
    ctx.font="'Pretendard Variable','Noto Sans KR',sans-serif"; ctx.textAlign='center';
    ctx.strokeStyle='rgba(0,0,0,.8)'; ctx.lineWidth=3;
    ctx.font=" + FD + "; ctx.lineWidth=3; ctx.strokeStyle='rgba(8,12,22,.95)';  ctx.strokeText(Math.ceil(t.hp),clamp(x,26,W-26),by-6); ctx.fillStyle='#ffe08a'; ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(Math.ceil(t.hp),clamp(x,26,W-26),by-6);ctx.fillText(Math.ceil(t.hp),clamp(x,26,W-26),by-6);
    return;
  }
  const w=king?108:82, h=king?84:68, top=y-h/2+4;
  const teamCol=t.team==='blue'?'#3f7bf5':'#e64545';
  const roofHi=t.team==='blue'?'#6f9ff8':'#f27a7a', roofLo=t.team==='blue'?'#2c55b0':'#a82e2e';
  const hr=t.hp/t.maxHp;
  const body=ctx.createLinearGradient(x-w/2,0,x+w/2,0);
  body.addColorStop(0,'#cdd4dd'); body.addColorStop(.45,'#aeb8c4'); body.addColorStop(1,'#8b96a4');
  ctx.fillStyle=body; roundRect(x-w/2,y-h/2+6,w,h,6); ctx.fill();
  ctx.strokeStyle='rgba(40,50,65,.6)'; ctx.lineWidth=2; roundRect(x-w/2,y-h/2+6,w,h,6); ctx.stroke();
  ctx.strokeStyle='rgba(60,72,88,.3)'; ctx.lineWidth=1;
  for(let i=1;i<4;i++){ ctx.beginPath(); ctx.moveTo(x-w/2+3,y-h/2+6+i*h/4); ctx.lineTo(x+w/2-3,y-h/2+6+i*h/4); ctx.stroke(); }
  ctx.fillStyle='#39415a'; ctx.beginPath();
  ctx.moveTo(x-w*0.13,y+h*0.3); ctx.lineTo(x-w*0.13,y-h*0.02);
  ctx.arc(x,y-h*0.02,w*0.13,Math.PI,0); ctx.lineTo(x+w*0.13,y+h*0.3); ctx.closePath(); ctx.fill();
  ctx.fillStyle=teamCol; ctx.fillRect(x-w/2,y-h/2+6,w,9);
  ctx.fillStyle='rgba(255,255,255,.3)'; ctx.fillRect(x-w/2,y-h/2+6,w,3);
  ctx.fillStyle='#9aa5b2';
  const nc=king?7:5;
  for(let i=0;i<nc;i++) ctx.fillRect(x-w/2+i*(w/nc)+2,top-7,w/nc-4,7);
  if(!king){
    const roof=ctx.createLinearGradient(x-w*0.5,0,x+w*0.5,0);
    roof.addColorStop(0,roofLo); roof.addColorStop(.5,roofHi); roof.addColorStop(1,roofLo);
    ctx.fillStyle=roof; ctx.beginPath();
    ctx.moveTo(x-w*0.5,top-6); ctx.lineTo(x+w*0.5,top-6); ctx.lineTo(x,top-h*0.6); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(40,50,65,.5)'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.fillStyle='#f7c531'; ctx.beginPath(); ctx.arc(x,top-h*0.6,3.5,0,7); ctx.fill();
    flagPole(x+4,top-h*0.6-4,teamCol);
  } else {
    ctx.fillStyle=teamCol; ctx.fillRect(x-w/2,top-13,w,6);
    ctx.font='20px sans-serif'; ctx.textAlign='center'; ctx.fillText('👑',x,top-16);
    flagPole(x-w*0.4,top-22,teamCol); flagPole(x+w*0.4,top-22,teamCol);
  }
  if(hr<0.55){ ctx.strokeStyle='rgba(25,30,42,.7)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(x-w*0.3,y-h*0.08); ctx.lineTo(x-w*0.18,y+h*0.14); ctx.lineTo(x-w*0.26,y+h*0.3); ctx.stroke();
    if(hr<0.3){ ctx.beginPath(); ctx.moveTo(x+w*0.28,y-h*0.14); ctx.lineTo(x+w*0.16,y+h*0.1); ctx.lineTo(x+w*0.24,y+h*0.3); ctx.stroke(); } }
  if(hr<0.25){ for(let i=0;i<3;i++){ const sy=((now*22+i*26)%50);
    ctx.fillStyle='rgba(90,90,95,'+(0.30-sy*0.005)+')';
    ctx.beginPath(); ctx.arc(x+w*0.26,top-16-sy,5+sy*0.14,0,7); ctx.fill(); } }
  if(king&&!t.active){ ctx.fillStyle='rgba(13,27,46,.30)'; roundRect(x-w/2,y-h/2+6,w,h,6); ctx.fill();
    ctx.font='13px sans-serif'; ctx.textAlign='center'; ctx.fillText('💤',x-w*0.32,y-h/2+26); }
  const bw=king?80:62, bx=x-bw/2, by=top-36;
  ctx.fillStyle='rgba(0,0,0,.6)'; roundRect(bx-2,by-2,bw+4,12,5); ctx.fill();
  ctx.fillStyle='#20293a'; roundRect(bx,by,bw,8,4); ctx.fill();
  ctx.fillStyle=t.team==='blue'?'#4ade80':'#ff7b6b';
  roundRect(bx,by,bw*Math.max(0,hr),8,4); ctx.fill();
  ctx.font="'Pretendard Variable','Noto Sans KR',sans-serif"; ctx.textAlign='center';
  ctx.strokeStyle='rgba(0,0,0,.8)'; ctx.lineWidth=3;
  ctx.font=" + FD + "; ctx.lineWidth=3; ctx.strokeStyle='rgba(8,12,22,.95)';  ctx.strokeText(Math.ceil(t.hp),clamp(x,26,W-26),by-6); ctx.fillStyle='#ffe08a'; ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(Math.ceil(t.hp),clamp(x,26,W-26),by-6);ctx.fillText(Math.ceil(t.hp),clamp(x,26,W-26),by-6);
}catch(__pe){ if(!window.__pe1)window.__pe1=__pe.message; }}
function drawRubble(t){
  if(TSPR.t_rubble&&TSPR.t_rubble.complete){
    const rx=t.x*TILE, ry=t.y*TILE, rs=t.kind==='king'?118:94;
    ctx.fillStyle='rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(rx,ry+8,rs*0.40,rs*0.15,0,0,7); ctx.fill();
    ctx.drawImage(TSPR.t_rubble,rx-rs/2,ry+10-rs,rs,rs);
    for(let i=0;i<2;i++){ const sy=((now*18+i*30)%44);
      ctx.fillStyle='rgba(120,120,125,'+(0.25-sy*0.005)+')';
      ctx.beginPath(); ctx.arc(rx+((i*23)%20)-10,ry-4-sy,5+sy*0.12,0,7); ctx.fill(); }
    return;
  }
  const x=t.x*TILE, y=t.y*TILE;
  ctx.fillStyle='rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(x,y+8,44,17,0,0,7); ctx.fill();
  const stones=[[0,0,13],[-20,6,9],[18,4,10],[-8,-8,7],[10,-7,8]];
  for(const s of stones){
    ctx.fillStyle='#98a1ac'; ctx.beginPath(); ctx.ellipse(x+s[0],y+s[1],s[2],s[2]*0.72,0.3,0,7); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.22)'; ctx.beginPath(); ctx.ellipse(x+s[0]-2,y+s[1]-3,s[2]*0.45,s[2]*0.3,0.3,0,7); ctx.fill();
  }
  for(let i=0;i<2;i++){ const sy=((now*18+i*30)%44);
    ctx.fillStyle='rgba(120,120,125,'+(0.25-sy*0.005)+')';
    ctx.beginPath(); ctx.arc(x+((i*23)%20)-10,y-6-sy,5+sy*0.12,0,7); ctx.fill(); }
}
const ATK3={};


'use strict';
(function(){ var RAW={"knight":["assets/img_211.png","assets/img_212.png","assets/img_213.png"],"giant":["assets/img_214.png","assets/img_215.png","assets/img_216.png"],"skarmy":["assets/img_217.png","assets/img_218.png","assets/img_219.png"],"prince":["assets/img_220.png","assets/img_221.png","assets/img_222.png"],"minions":["assets/img_223.png","assets/img_224.png","assets/img_225.png"],"valk":["assets/img_226.png","assets/img_227.png","assets/img_228.png"],"boar":["assets/img_229.png","assets/img_230.png","assets/img_231.png"],"bomber":["assets/img_232.png","assets/img_233.png","assets/img_234.png"]}; const RAW_BOSSATK=["assets/img_235.png","assets/img_236.png","assets/img_237.png"]; for(var k in RAW){ ATK3[k]=RAW[k].map(function(s){ var im=new Image(); im.src=s; return im; }); } try{ ATK3.boss=RAW_BOSSATK.map(function(s){ var im=new Image(); im.src=s; return im; }); }catch(e){} })();
function drawUnit(u){try{
  const px=u.x*TILE, py=u.y*TILE;
  const fly=u.c.flying, bob=fly?Math.sin(now*5+u.bob)*2.5:0, dy=fly?-15+bob:0;
  if(u.spawnFx>0.28&&Math.random()<0.22) addParts(px,py+3,1,'#cfc3a8',1.4,0.3,-20);   /* v202: 소환 파츠 중첩 완화 */
  const scale=u.spawnFx>0?1-(u.spawnFx/0.45)*0.7:1;
  const r=Math.max(8,(u.c.r*TILE*0.92+9)*scale);
  const la=u.target?Math.atan2(u.target.y-u.y,u.target.x-u.x):u.dir;
  const sx=Math.cos(la)>=0?1:-1;
  const lunge=u.swing>0?u.swing*34:0;
  const cx0=px+Math.cos(la)*lunge, cy0=py+dy+Math.sin(la)*lunge*0.5;
  ctx.fillStyle='rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(px,py+5,r*0.8,r*0.36,0,0,7); ctx.fill();
  if(!fly&&u.c.spd>0&&parts.length<340&&Math.random()<0.14){ const __dl=0.45+Math.random()*0.3;   /* v496: 달리는 먼지 */ parts.push({x:px+(Math.random()*10-5),y:py+6,vx:-Math.cos(u.dir)*(22+Math.random()*22),vy:-10-Math.random()*12,t:__dl,max:__dl,col:'rgba(216,208,192,.55)',grav:0,r:2.5+Math.random()*2.5}); }
    ctx.strokeStyle='rgba(244,240,225,.85)'; ctx.lineWidth=3.5; ctx.beginPath(); ctx.ellipse(px,py+5,r*0.95,r*0.45,0,0,7); ctx.stroke();   /* v496: 팀 색 링 폐지 — 중립 미광 링 통일 */
  if(fly){ ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.setLineDash([3,3]); ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(px,py+2); ctx.lineTo(px,py+dy+r-2); ctx.stroke(); ctx.setLineDash([]); }
  if(u.charging){ ctx.strokeStyle='rgba(255,215,94,.9)'; ctx.lineWidth=2.5;
    for(let s3=-1;s3<=1;s3++){ const a3=u.dir+Math.PI+s3*0.35;
      ctx.beginPath(); ctx.moveTo(cx0+Math.cos(a3)*(r+3),cy0+Math.sin(a3)*(r+3));
      ctx.lineTo(cx0+Math.cos(a3)*(r+15),cy0+Math.sin(a3)*(r+15)); ctx.stroke(); }
    if(Math.random()<0.4) addParts(px,py+3,1,'#e8d9a0',1.8,0.35,-20); }
  const __sp=(typeof SPR!=='undefined')?SPR[u.key]:null;const sprOK=__sp&&__sp.complete&&__sp.naturalWidth>0&&__sp.__valid!==false;
   const __fI=(typeof FRAMES!=='undefined')?FRAMES[u.key+'_idle']:null;const __fA=(typeof FRAMES!=='undefined')?FRAMES[u.key+'_atk']:null;const fOK=__fI&&__fI.complete&&__fI.naturalWidth>0&&__fI.__valid!==false;   /* v174: C안 전신 프레임 */var __ff=(u.swing>0)?((u.key==='boss'&&typeof ATK3!=='undefined'&&ATK3.boss&&ATK3.boss[1]&&ATK3.boss[1].complete&&ATK3.boss[1].naturalWidth>0)?ATK3.boss[1]:((__fA&&__fA.complete&&__fA.naturalWidth>0&&__fA.__valid!==false)?__fA:__fI)):__fI; var __seqOn=false; try{ if(u.swing>0&&u.key!=='boss'){ var __s2=FRAMES[u.key+'_atk2'], __s3=FRAMES[u.key+'_atk3']; var __ok2=__s2&&__s2.complete&&__s2.naturalWidth>0&&__s2.__valid!==false, __ok3=__s3&&__s3.complete&&__s3.naturalWidth>0&&__s3.__valid!==false; if(__ok2||__ok3){ __seqOn=true; var __pS=1-u.swing/(u._swd||0.3); __ff=__pS<0.34?(__ok2?__s2:__fI):(__pS<0.67?((__fA&&__fA.complete&&__fA.naturalWidth>0&&__fA.__valid!==false)?__fA:__fI):(__ok3?__s3:__fI)); } } }catch(e){} try{ if(!__seqOn&&!u.swing&&u.key!=='boss'){ var __w1=FRAMES[u.key+'_walk'], __mw=(!u.c.flying&&u.target&&dist(u,u.target)>u.c.range+u.target.r); if(__mw&&__w1&&__w1.complete&&__w1.naturalWidth>0&&__w1.__valid!==false) __ff=__w1; } }catch(e){}   /* v303: 이동 포즈 — 공격 중 우선, 부재분 idle 폴백 */
  ctx.save(); ctx.translate(cx0,cy0);
  var __face=u.team==='blue'?-Math.PI/2:Math.PI/2, __tw=0;
  if(u.target){ var __df=la-__face; __df=Math.atan2(Math.sin(__df),Math.cos(__df)); __tw=Math.max(-0.55,Math.min(0.55,__df)); }   // v71: Z축=타워 직립, 조준은 상체만
  if(u.recoilT>0){ u.recoilT-=0.017;
    var rb=Math.max(0,Math.sin(Math.min(1,u.recoilT/0.14)*Math.PI))*5.5, ra=(typeof u.recoilA==='number')?u.recoilA:u.dir;
    ctx.translate(-Math.cos(ra)*rb*0.7,-Math.sin(ra)*rb*0.35);
    ctx.rotate((sx>0?-1:1)*rb*0.055); }
  if(u.swing>0&&(u.key==='wizard'||u.key==='icem'||u.key==='babyd')){
    var __cg=u.key==='icem'?'rgba(156,220,255,':u.key==='babyd'?'rgba(255,157,60,':'rgba(255,177,77,';
    ctx.fillStyle=__cg+(0.5*Math.min(1,u.swing/0.2)+0.15)+')';
    ctx.beginPath(); ctx.arc(Math.cos(u.dir)*r*0.9,-r*0.75+Math.sin(u.dir)*r*0.4,r*(0.5+0.3*Math.sin(u.swing*10)),0,7); ctx.fill(); }
  if(u.hurt>0) u.hurt=Math.max(0,u.hurt-0.017);
  const moving=(!u.c.flying&&u.target&&dist(u,u.target)>u.c.range+u.target.r);
  const step=Math.sin(now*7.5+u.bob);
  const __mv=UMOT[u.key]||UMOT._def;
  if(__mv.flut) ctx.translate(0,Math.sin(now*11+u.bob)*1.6);
  if(__mv.halo){ ctx.strokeStyle='rgba(247,207,90,'+(0.35+0.2*Math.sin(now*3+u.bob))+')'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.ellipse(0,-r*1.75,r*0.55,r*0.22,0,0,7); ctx.stroke(); }
  if(__mv.dust&&!fly&&moving&&Math.random()<0.22) addParts(px-Math.cos(la)*r*0.5,py+4,1,'#c9b27a',1.1,0.3,-16);
  if(!fly&&moving){ const __sg=(step>=0)?1:-1; if(u._stl!==__sg){ u._stl=__sg; addParts(px-Math.cos(la)*r*0.35,py+4,1,'#c9b27a',1.0,0.28,-14); } }   /* v160: 발착 먼지 — 보행 위상 반전마다 */
  if(moving){ ctx.rotate(step*0.06); ctx.scale(1,1-Math.abs(step)*0.035); }
  { const shL=r*(u.key==='cannon'?2.55:3.6); if(!fOK) limbLegs(u,moving,shL); }   /* v157: 다리 스윙 — 스프라이트 뒤 */
  const hop=(!u.c.flying&&u.target&&dist(u,u.target)>u.c.range+u.target.r)?Math.abs(Math.sin(now*7.5+u.bob))*2.6:0;
  if(sprOK){ const sh=r*(u.key==='cannon'?2.55:3.6), __rig=(typeof PARTS!=='undefined')&&(PARTS[u.key+'_arm']&&PARTS[u.key+'_arm'].__valid!==false||PARTS[u.key+'_leg']&&PARTS[u.key+'_leg'].__valid!==false), aimF=(!__rig)&&(u.swing>0)&&ASPR[u.key]&&ASPR[u.key].complete;
    if(!moving&&!u.c.flying){ const br=1+Math.sin(now*2.6+u.bob)*0.018; ctx.scale(br,2-br); }
    const punch=u.swing>0?1+Math.sin(u.swing*Math.PI)*0.16:1;
    ctx.save(); ctx.scale(punch,punch);
    if(aimF&&u.key==='boss'&&ATK3.boss&&ATK3.boss[0]&&ATK3.boss[0].complete&&ATK3.boss[0].naturalWidth>0){ var __pB=1-u.swing/(u._swd||0.45), __fiB=__pB<0.33?0:(__pB<0.66?1:2), __bf=ATK3.boss[__fiB]; ctx.drawImage(raTint(__bf,u.team,u.key),-sh/2,-sh*0.82-hop,sh,sh); if(u.hurt>0){ ctx.globalCompositeOperation='lighter'; ctx.globalAlpha=Math.min(1,u.hurt/0.09)*0.75; ctx.drawImage(raTint(__bf,u.team,u.key),-sh/2,-sh*0.82-hop,sh,sh); ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1; } } else if(aimF){ var __IM=SPR[u.key], __AU=ASPR[u.key], __wy=-sh*0.30-hop;
      ctx.drawImage(__IM,0,__IM.naturalHeight*0.44,__IM.naturalWidth,__IM.naturalHeight*0.56,-sh/2,-sh*0.38-hop,sh,sh*0.56);
      ctx.translate(0,__wy);
      var __p=1-u.swing/(u._swd||0.45), __fr=ATK3[u.key], __imU=__AU, __crop=true;
      if(__fr&&__fr[0]&&__fr[0].complete&&__fr[0].naturalWidth>0){ var __fi=__p<0.33?0:(__p<0.66?1:2); __imU=__fr[__fi]; __crop=false; }
      var __ang=(__crop)?Math.sin(__p*Math.PI)*0.30:(__p<0.33?-0.34*(__p/0.33):0.30*Math.sin(Math.min(1,(__p-0.33)/0.67)*Math.PI));
      ctx.rotate(__tw+__ang);
      if(__crop) ctx.drawImage(__AU,0,0,__AU.naturalWidth,__AU.naturalHeight*0.66,-sh/2,-sh*0.32,sh,sh*0.66);
      else ctx.drawImage(__imU,-sh/2,-sh*0.32,sh,sh*0.66);
      if(u.hurt>0){ ctx.globalCompositeOperation='lighter'; ctx.globalAlpha=Math.min(1,u.hurt/0.09)*0.75;
        ctx.drawImage(__IM,0,__IM.naturalHeight*0.44,__IM.naturalWidth,__IM.naturalHeight*0.56,-sh/2,-sh*0.38-hop,sh,sh*0.56);
        if(__crop) ctx.drawImage(__AU,0,0,__AU.naturalWidth,__AU.naturalHeight*0.66,-sh/2,-sh*0.32,sh,sh*0.66);
        else ctx.drawImage(__imU,-sh/2,-sh*0.32,sh,sh*0.66);
        ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1; }
    } else {
      if(u.swing>0) ctx.rotate(Math.sin((1-u.swing/(u._swd||0.3))*Math.PI)*(__seqOn?0.12:0.30));   /* v302: 포즈 시퀀스 시 회전 댐핑 */
      ctx.drawImage(fOK?raTint(__ff,u.team,u.key):raTint(SPR[u.key],u.team,u.key),-sh/2,-sh*0.82-hop,sh,sh);
      if(u.hurt>0){ ctx.globalCompositeOperation='lighter'; ctx.globalAlpha=Math.min(1,u.hurt/0.09)*0.75;
        ctx.drawImage(fOK?raTint(__ff,u.team,u.key):raTint(SPR[u.key],u.team,u.key),-sh/2,-sh*0.82-hop,sh,sh);
        ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1; }
    }
    { const shL=r*(u.key==='cannon'?2.55:3.6); if(!fOK){ limbArm(u,moving,shL,sx,la); limbHead(u,sh,shL,hop); limbWings(u,shL); } }   /* v158 팔 스윙·공격 뻗기 / v159 비행 날갯짓 */
    ctx.restore(); }
  else { drawBody(u,r,la);
    if(u.swing>0){ ctx.strokeStyle='rgba(255,255,255,.8)'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(0,-r*0.6,r*1.1,-0.5,0.9); ctx.stroke(); } }
  ctx.restore();
  if(u.frozenT>0){ ctx.font='12px sans-serif'; ctx.textAlign='center'; ctx.fillText('🧊',cx0,py+dy-r-8); }
  else if(u.stun>0){ ctx.font='12px sans-serif'; ctx.textAlign='center'; ctx.fillText('💫',cx0,py+dy-r-8); }
  else if(u.burnT>0){ ctx.font='11px sans-serif'; ctx.textAlign='center'; ctx.fillText('🔥',cx0,py+dy-r-8); }
  else if(u.slowT>0){ ctx.font='11px sans-serif'; ctx.textAlign='center'; ctx.fillText('❄️',cx0,py+dy-r-8); }
  const bw=Math.max(24,r*1.5), bx=px-bw/2, by=py+dy-(sprOK?r*2.05:r)-8;
  ctx.fillStyle=u.team==='blue'?'rgba(63,123,245,.55)':'rgba(230,69,69,.55)'; roundRect(bx-1,by-1,bw+2,6,3); ctx.fill();
  const k=Math.max(0,u.hp/u.maxHp);
  ctx.fillStyle=u.team==='blue'?(k>0.5?'#4ade80':k>0.25?'#facc15':'#f87171'):(k>0.5?'#ff5252':k>0.25?'#ff7a45':'#ffb020');   /* v181: 팀별 HP바 — 아군 그린/적군 레드(저체력 경고는 계열 내 완화) */
  roundRect(bx,by,bw*k,4,2); ctx.fill();
  if(HPFR_IM.complete&&HPFR_IM.naturalWidth) ctx.drawImage(HPFR_IM,bx-6,by-7,bw+12,19);
  if(HPFR_IM.complete&&HPFR_IM.naturalWidth) ctx.drawImage(HPFR_IM,bx-4,by-5,bw+8,15);
  if(u.building){ ctx.strokeStyle='rgba(255,255,255,.6)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(px,py+dy-3,r+4,-Math.PI/2,-Math.PI/2+6.283*(u.life/30)); ctx.stroke(); }
}catch(__pe){ if(!window.__pe1)window.__pe1=__pe.message; }}
