/* royal-arena v188 split — blocks [78,79,80,81,82,83,84,85,86,87,88,89,90] order-preserved */


'use strict';
function refundSkill(id){ var lv=skillLv(id); if(lv<=0) return false;
  var d=SKILLS.find(function(s){ return s.id===id; }); var back=lv; var o=skillsObj(); o[id]=0;
  [colSkill(d.col,d.tier+1),colSkill(d.col,d.tier+2)].forEach(function(n){ if(n&&skillLv(n.id)>0){ back+=skillLv(n.id); o[n.id]=0; } });   // v119: 연쇄 환불 — 하위 전제 미달 시 종속 상위 전액 환불
  var st=spState(); st.sp+=back; skillsSave(o); spSave(st); return true; }
function resetSkills(){ var o=skillsObj(); var back=0; for(var k in o) back+=(o[k]||0);
  var st=spState(); st.sp+=back; skillsSave({}); spSave(st); return true; }   // v119: 총 SP 보존 — 획득 누적 SP 100% 반환
function applySkills(){ try{   // v119: 경기 시작마다 스킬 반영 — 방위 계통(타워 체력)+캐시(S._sk)
  S._sk={off1:skillLv('off1'),off2:skillLv('off2'),off3:skillLv('off3'),def2:skillLv('def2'),mag1:skillLv('mag1'),mag2:skillLv('mag2'),mag3:skillLv('mag3')};
  var hb=1+0.10*skillLv('def1')+0.10*skillLv('def3');
  for(var i=0;i<towers.length;i++){ var t=towers[i]; if(t.team==='blue'){ t.maxHp=Math.round(t.maxHp*hb); t.hp=t.maxHp; } }
}catch(e){} }
function ensureSkillUI(){
  if(document.getElementById('overlay-skill')) return;
  if(!document.getElementById('sk-style')){ var st2=document.createElement('style'); st2.id='sk-style';
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);font-size:13.5px}   /* v121: 아이템 폰트 정합 */ .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:82vh;overflow-y:auto} #btn-skill,#btn-profile{font-family:\'Black Han Sans\',\'Jua\',sans-serif;font-size:19px;padding:12px 34px;border-radius:14px;border:2px solid #3d4c73;color:#dfe8ff;background:rgba(18,24,43,.85);box-shadow:0 5px 0 #1c2740,0 9px 18px rgba(0,0,0,.4);text-shadow:0 2px 0 rgba(0,0,0,.6);transition:transform .06s} #btn-skill:active,#btn-profile:active{transform:translateY(3px)} #btn-skill-close,#btn-prf-close{display:block;margin:14px auto 0;width:120px;padding:9px 0;border-radius:12px;border:1.5px solid #FFB300;background:rgba(18,24,43,.85);color:#FFD54F;font-weight:700;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);cursor:pointer} @media (max-width:420px){#btn-skill,#btn-profile{font-size:16px;padding:10px 22px}}';   // v121: 로비 버튼·닫기 — 유물 규격 통일
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">승리 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-skill-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rs=document.getElementById('btn-skill-reset'); if(rs) rs.onclick=function(){ resetSkills(); renderSkillList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-skill'; b.textContent='🎓 전술 연구소';
      b.onclick=function(){ renderSkillList(); ov.classList.remove('hidden'); };
      var rel=document.getElementById('btn-relic'); if(rel&&rel.parentNode===ta) ta.insertBefore(b,rel); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
}
function renderSkillList(){
  var box=document.getElementById('sk-grid'); if(!box) return;
  var st=spState(); var sp=document.getElementById('sk-sp');
  if(sp) sp.textContent='보유 SP: '+st.sp+' · 누적 획득: '+st.total;
  box.innerHTML='';
  ['⚔️','🛡️','🧪'].forEach(function(c){
    var colDiv=document.createElement('div'); colDiv.className='sk-col';
    SKILLS.filter(function(s){ return s.col===c; }).forEach(function(d){
      var lv=skillLv(d.id);
      var locked=false;
      if(d.tier===2&&skillLv(colSkill(d.col,1).id)<2) locked=true;
      if(d.tier===3&&skillLv(colSkill(d.col,2).id)<2) locked=true;
      var item=document.createElement('div'); item.className='sk-item t'+d.tier;
      item.innerHTML='<b>'+d.col+' '+d.name+'</b><small>'+d.desc+'</small><span class="sk-lv">Lv '+lv+'/3</span>';
      var minus=document.createElement('button'); minus.textContent='−'; minus.disabled=lv<=0;
      minus.onclick=function(){ refundSkill(d.id); renderSkillList(); };
      var plus=document.createElement('button'); plus.textContent='+'; plus.disabled=(locked||!canBuySkill(d.id));
      plus.title=locked?'하위 티어 Lv 2 필요':'';
      plus.onclick=function(){ buySkill(d.id); renderSkillList(); };
      item.appendChild(plus); item.appendChild(minus);
      colDiv.appendChild(item);
    });
    box.appendChild(colDiv);
  });
}
function repairTower(){
  if(S.over||S.repCd>0) return false;
  const dmg=towers.filter(t=>t.team==='blue'&&!t.dead&&t.hp<t.maxHp-1);
  if(!dmg.length) return false;
  var __rc=(S._sk&&S._sk.def2)?2:3; if(P.elixir<__rc){ toast('엘릭서 부족 — 수리는 '+__rc+' 필요'); return false; }   // v119: 수리 조직 스킬 — 비용 −1
  const t=dmg.slice().sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
  P.elixir-=__rc; S.repCd=5;
  const amt=Math.min(t.maxHp-t.hp, Math.round(t.maxHp*0.25));
  t.hp+=amt;
  fx.push({x:t.x,y:t.y,t:0,dur:0.8,kind:'ring',col:'rgba(111,208,140,.9)'});
  fx.push({x:t.x,y:t.y,t:0,dur:0.7,kind:'poof'});
  floats.push({x:t.x,y:t.y-1.1,txt:'+'+amt,t:0.9,col:'#8fe6a8',big:false});
  sfx('cast'); toast('🔨 타워 수리 +'+amt);
  try{ syncHUD(); }catch(e){}
  return true;
}
function ensureRepairBtn(){
  var b=document.getElementById('repair-btn'); if(b) return b;
  b=document.createElement('button'); b.id='repair-btn'; b.className='hidden';
  b.innerHTML='<i class="rfill"></i><span class="rt">🔨 수리 3</span>';
  b.onclick=function(){ ensureAudio(); repairTower(); };
  var aw=document.getElementById('arena-wrap'); if(aw) aw.appendChild(b); return b;
}
function syncRepairBtn(){
  var b=document.getElementById('repair-btn')||ensureRepairBtn(); if(!b) return;
  var st=repairBtnState();
  b.classList.toggle('hidden',st==='hidden');
  if(st==='hidden') return;
  var f=b.querySelector('.rfill'), lb=b.querySelector('.rt');
  if(st==='cd'){
    b.classList.add('cd');
    if(f) f.style.width=(S.repCd/5*100)+'%';
    var tx='🔨 '+Math.ceil(S.repCd)+'s';
    if(b.__t!==tx){ lb.textContent=tx; b.__t=tx; }
  } else {
    b.classList.remove('cd');
    if(f&&b.__t!=='ready') f.style.width='0%';
    if(b.__t!=='ready'){ lb.textContent='🔨 수리 3'; b.__t='ready'; }
    b.style.opacity=P.elixir<3?'.55':'1';
  }
}


/* ---------- v109 #13: 유물 4종(영구 계승) ---------- */
var RELICS_LEGACY=[
  {id:'relic_atk',icon:'⚔️',name:'전투 문장',desc:'아군 유닛의 피해 +10%',need:1},
  {id:'relic_tower',icon:'🛡️',name:'수호 문장',desc:'아군 타워 최대 체력 +10%',need:3},
  {id:'relic_spell',icon:'✨',name:'마력 봉인구',desc:'주문 피해 +25%',need:5},
  {id:'relic_gold',icon:'💰',name:'황금 엘릭서 통',desc:'엘릭서 재생 +10%',need:7}
];
function spellDmg(d){ d=Math.round(d*(1+0.10*((S._sk&&S._sk.mag2)||0))); return (S&&S.relic==='relic_spell')?Math.round(d*1.25):d; }   // v119: 스킬트리 광역 술영 — 주문 피해 +10%
function relicWins(){ try{ return Math.max(0,parseInt(localStorage.getItem('ra_wins_v1')||'0',10)||0); }catch(e){ return 0; } }
function loadRelicEquip(){ try{ return localStorage.getItem('ra_relic_v1')||''; }catch(e){ return ''; } }
function saveRelicEquip(id){ try{ if(id) localStorage.setItem('ra_relic_v1',id); else localStorage.removeItem('ra_relic_v1'); }catch(e){} }
function applyRelics(){
  if(S.relic!=='relic_tower') return;
  for(const t of towers){ if(t.team==='blue'&&!t.__rl){ t.__rl=1; t.maxHp=Math.round(t.maxHp*1.1); t.hp=Math.min(t.maxHp,Math.round(t.hp*1.1)); } }
}
function castSpell(key,team,x,y){ var __pn=projs.length; castSpellBase(key,team,x,y); try{ if(team==='blue'&&S.relic==='relic_spell'&&projs.length>__pn){ for(var __i=__pn;__i<projs.length;__i++){ if(projs[__i]&&projs[__i].dmg) projs[__i].dmg=Math.round(projs[__i].dmg*1.25); } } }catch(e){} }
function renderRelicList(){
  var box=document.getElementById('relic-list'); if(!box) return;
  var wins=relicWins(), eq=loadRelicEquip(); box.innerHTML='';
  RELICS.forEach(function(r){
    var d=document.createElement('div'); d.className='rli'+(eq===r.id?' on':'')+((wins<r.need)?' lock':'');
    d.innerHTML='<span class="ricon">'+r.icon+'</span><span class="rmeta"><b>'+r.name+'</b><small>'+r.desc+'</small></span>'
      +(wins<r.need?'<span class="rbadge lk">🔒 '+r.need+'승</span>':(eq===r.id?'<span class="rbadge eq">착용 중</span>':'<span class="rbadge">착용</span>'));
    d.onclick=function(){
      if(wins<r.need){ toast(r.need+'승 달성 시 해금됩니다'); return; }
      saveRelicEquip(eq===r.id?'':r.id); renderRelicList();
    };
    box.appendChild(d);
  });
}
function ensureRelicUI(){
  if(document.getElementById('overlay-relic')) return;
  var ov=document.createElement('div'); ov.id='overlay-relic'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🏺 유물</h2><p class="rsub">승리로 해금 — 한 번에 하나만 착용</p><div id="relic-list"></div><button id="btn-relic-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-relic-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-relic'; b.textContent='🏺 유물';
      b.onclick=function(){ renderRelicList(); ov.classList.remove('hidden'); };
      var hof=document.getElementById('btn-hof'); if(hof&&hof.parentNode===ta) ta.insertBefore(b,hof); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,50);
  };
  setTimeout(tick,50);
}
try{ ensureRelicUI(); ensureSkillUI(); ensureProfileUI(); }catch(e){}

/* v110 SPR.boss 등록(선언 완료 후) */
try{ if(!SPR.boss&&ART.boss){ SPR.boss=new Image(); SPR.boss.src=ART.boss; ASPR.boss=SPR.boss; } }catch(e){}
try{ relayoutHud(); }catch(e){}   // v122: 초기화 시 기둥 배치
try{ relayoutHud(); }catch(e){}



'use strict';
function refundSkill(id){ var lv=skillLv(id); if(lv<=0) return false;
  var d=SKILLS.find(function(s){ return s.id===id; }); var back=lv; var o=skillsObj(); o[id]=0;
  [colSkill(d.col,d.tier+1),colSkill(d.col,d.tier+2)].forEach(function(n){ if(n&&skillLv(n.id)>0){ back+=skillLv(n.id); o[n.id]=0; } });   // v119: 연쇄 환불 — 하위 전제 미달 시 종속 상위 전액 환불
  var st=spState(); st.sp+=back; skillsSave(o); spSave(st); return true; }
function resetSkills(){ var o=skillsObj(); var back=0; for(var k in o) back+=(o[k]||0);
  var st=spState(); st.sp+=back; skillsSave({}); spSave(st); return true; }   // v119: 총 SP 보존 — 획득 누적 SP 100% 반환
function applySkills(){ try{   // v119: 경기 시작마다 스킬 반영 — 방위 계통(타워 체력)+캐시(S._sk)
  S._sk={off1:skillLv('off1'),off2:skillLv('off2'),off3:skillLv('off3'),def2:skillLv('def2'),mag1:skillLv('mag1'),mag2:skillLv('mag2'),mag3:skillLv('mag3')};
  var hb=1+0.10*skillLv('def1')+0.10*skillLv('def3');
  for(var i=0;i<towers.length;i++){ var t=towers[i]; if(t.team==='blue'){ t.maxHp=Math.round(t.maxHp*hb); t.hp=t.maxHp; } }
}catch(e){} }
function ensureSkillUI(){
  if(document.getElementById('overlay-skill')) return;
  if(!document.getElementById('sk-style')){ var st2=document.createElement('style'); st2.id='sk-style';
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);font-size:13.5px}   /* v121: 아이템 폰트 정합 */ .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:82vh;overflow-y:auto} #btn-skill,#btn-profile{font-family:\'Black Han Sans\',\'Jua\',sans-serif;font-size:19px;padding:12px 34px;border-radius:14px;border:2px solid #3d4c73;color:#dfe8ff;background:rgba(18,24,43,.85);box-shadow:0 5px 0 #1c2740,0 9px 18px rgba(0,0,0,.4);text-shadow:0 2px 0 rgba(0,0,0,.6);transition:transform .06s} #btn-skill:active,#btn-profile:active{transform:translateY(3px)} #btn-skill-close,#btn-prf-close{display:block;margin:14px auto 0;width:120px;padding:9px 0;border-radius:12px;border:1.5px solid #FFB300;background:rgba(18,24,43,.85);color:#FFD54F;font-weight:700;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);cursor:pointer} @media (max-width:420px){#btn-skill,#btn-profile{font-size:16px;padding:10px 22px}}';   // v121: 로비 버튼·닫기 — 유물 규격 통일
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">승리 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-skill-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rs=document.getElementById('btn-skill-reset'); if(rs) rs.onclick=function(){ resetSkills(); renderSkillList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-skill'; b.textContent='🎓 전술 연구소';
      b.onclick=function(){ renderSkillList(); ov.classList.remove('hidden'); };
      var rel=document.getElementById('btn-relic'); if(rel&&rel.parentNode===ta) ta.insertBefore(b,rel); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
}
function renderSkillList(){
  var box=document.getElementById('sk-grid'); if(!box) return;
  var st=spState(); var sp=document.getElementById('sk-sp');
  if(sp) sp.textContent='보유 SP: '+st.sp+' · 누적 획득: '+st.total;
  box.innerHTML='';
  ['⚔️','🛡️','🧪'].forEach(function(c){
    var colDiv=document.createElement('div'); colDiv.className='sk-col';
    SKILLS.filter(function(s){ return s.col===c; }).forEach(function(d){
      var lv=skillLv(d.id);
      var locked=false;
      if(d.tier===2&&skillLv(colSkill(d.col,1).id)<2) locked=true;
      if(d.tier===3&&skillLv(colSkill(d.col,2).id)<2) locked=true;
      var item=document.createElement('div'); item.className='sk-item t'+d.tier;
      item.innerHTML='<b>'+d.col+' '+d.name+'</b><small>'+d.desc+'</small><span class="sk-lv">Lv '+lv+'/3</span>';
      var minus=document.createElement('button'); minus.textContent='−'; minus.disabled=lv<=0;
      minus.onclick=function(){ refundSkill(d.id); renderSkillList(); };
      var plus=document.createElement('button'); plus.textContent='+'; plus.disabled=(locked||!canBuySkill(d.id));
      plus.title=locked?'하위 티어 Lv 2 필요':'';
      plus.onclick=function(){ buySkill(d.id); renderSkillList(); };
      item.appendChild(plus); item.appendChild(minus);
      colDiv.appendChild(item);
    });
    box.appendChild(colDiv);
  });
}
function repairTower(){
  if(S.over||S.repCd>0) return false;
  const dmg=towers.filter(t=>t.team==='blue'&&!t.dead&&t.hp<t.maxHp-1);
  if(!dmg.length) return false;
  var __rc=(S._sk&&S._sk.def2)?2:3; if(P.elixir<__rc){ toast('엘릭서 부족 — 수리는 '+__rc+' 필요'); return false; }   // v119: 수리 조직 스킬 — 비용 −1
  const t=dmg.slice().sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
  P.elixir-=__rc; S.repCd=5;
  const amt=Math.min(t.maxHp-t.hp, Math.round(t.maxHp*0.25));
  t.hp+=amt;
  fx.push({x:t.x,y:t.y,t:0,dur:0.8,kind:'ring',col:'rgba(111,208,140,.9)'});
  fx.push({x:t.x,y:t.y,t:0,dur:0.7,kind:'poof'});
  floats.push({x:t.x,y:t.y-1.1,txt:'+'+amt,t:0.9,col:'#8fe6a8',big:false});
  sfx('cast'); toast('🔨 타워 수리 +'+amt);
  try{ syncHUD(); }catch(e){}
  return true;
}
function ensureRepairBtn(){
  var b=document.getElementById('repair-btn'); if(b) return b;
  b=document.createElement('button'); b.id='repair-btn'; b.className='hidden';
  b.innerHTML='<i class="rfill"></i><span class="rt">🔨 수리 3</span>';
  b.onclick=function(){ ensureAudio(); repairTower(); };
  var aw=document.getElementById('arena-wrap'); if(aw) aw.appendChild(b); return b;
}
function syncRepairBtn(){
  var b=document.getElementById('repair-btn')||ensureRepairBtn(); if(!b) return;
  var st=repairBtnState();
  b.classList.toggle('hidden',st==='hidden');
  if(st==='hidden') return;
  var f=b.querySelector('.rfill'), lb=b.querySelector('.rt');
  if(st==='cd'){
    b.classList.add('cd');
    if(f) f.style.width=(S.repCd/5*100)+'%';
    var tx='🔨 '+Math.ceil(S.repCd)+'s';
    if(b.__t!==tx){ lb.textContent=tx; b.__t=tx; }
  } else {
    b.classList.remove('cd');
    if(f&&b.__t!=='ready') f.style.width='0%';
    if(b.__t!=='ready'){ lb.textContent='🔨 수리 3'; b.__t='ready'; }
    b.style.opacity=P.elixir<3?'.55':'1';
  }
}


/* ---------- v109 #13: 유물 4종(영구 계승) ---------- */
var RELICS_LEGACY=[
  {id:'relic_atk',icon:'⚔️',name:'전투 문장',desc:'아군 유닛의 피해 +10%',need:1},
  {id:'relic_tower',icon:'🛡️',name:'수호 문장',desc:'아군 타워 최대 체력 +10%',need:3},
  {id:'relic_spell',icon:'✨',name:'마력 봉인구',desc:'주문 피해 +25%',need:5},
  {id:'relic_gold',icon:'💰',name:'황금 엘릭서 통',desc:'엘릭서 재생 +10%',need:7}
];
function spellDmg(d){ d=Math.round(d*(1+0.10*((S._sk&&S._sk.mag2)||0))); return (S&&S.relic==='relic_spell')?Math.round(d*1.25):d; }   // v119: 스킬트리 광역 술영 — 주문 피해 +10%
function relicWins(){ try{ return Math.max(0,parseInt(localStorage.getItem('ra_wins_v1')||'0',10)||0); }catch(e){ return 0; } }
function loadRelicEquip(){ try{ return localStorage.getItem('ra_relic_v1')||''; }catch(e){ return ''; } }
function saveRelicEquip(id){ try{ if(id) localStorage.setItem('ra_relic_v1',id); else localStorage.removeItem('ra_relic_v1'); }catch(e){} }
function applyRelics(){
  if(S.relic!=='relic_tower') return;
  for(const t of towers){ if(t.team==='blue'&&!t.__rl){ t.__rl=1; t.maxHp=Math.round(t.maxHp*1.1); t.hp=Math.min(t.maxHp,Math.round(t.hp*1.1)); } }
}
function castSpell(key,team,x,y){ var __pn=projs.length; castSpellBase(key,team,x,y); try{ if(team==='blue'&&S.relic==='relic_spell'&&projs.length>__pn){ for(var __i=__pn;__i<projs.length;__i++){ if(projs[__i]&&projs[__i].dmg) projs[__i].dmg=Math.round(projs[__i].dmg*1.25); } } }catch(e){} }
function renderRelicList(){
  var box=document.getElementById('relic-list'); if(!box) return;
  var wins=relicWins(), eq=loadRelicEquip(); box.innerHTML='';
  RELICS.forEach(function(r){
    var d=document.createElement('div'); d.className='rli'+(eq===r.id?' on':'')+((wins<r.need)?' lock':'');
    d.innerHTML='<span class="ricon">'+r.icon+'</span><span class="rmeta"><b>'+r.name+'</b><small>'+r.desc+'</small></span>'
      +(wins<r.need?'<span class="rbadge lk">🔒 '+r.need+'승</span>':(eq===r.id?'<span class="rbadge eq">착용 중</span>':'<span class="rbadge">착용</span>'));
    d.onclick=function(){
      if(wins<r.need){ toast(r.need+'승 달성 시 해금됩니다'); return; }
      saveRelicEquip(eq===r.id?'':r.id); renderRelicList();
    };
    box.appendChild(d);
  });
}
function ensureRelicUI(){
  if(document.getElementById('overlay-relic')) return;
  var ov=document.createElement('div'); ov.id='overlay-relic'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🏺 유물</h2><p class="rsub">승리로 해금 — 한 번에 하나만 착용</p><div id="relic-list"></div><button id="btn-relic-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-relic-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-relic'; b.textContent='🏺 유물';
      b.onclick=function(){ renderRelicList(); ov.classList.remove('hidden'); };
      var hof=document.getElementById('btn-hof'); if(hof&&hof.parentNode===ta) ta.insertBefore(b,hof); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,50);
  };
  setTimeout(tick,50);
}
try{ ensureRelicUI(); ensureSkillUI(); ensureProfileUI(); }catch(e){}

/* v110 SPR.boss 등록(선언 완료 후) */
try{ if(!SPR.boss&&ART.boss){ SPR.boss=new Image(); SPR.boss.src=ART.boss; ASPR.boss=SPR.boss; } }catch(e){}
try{ relayoutHud(); }catch(e){}



'use strict';
function ensureSkillUI(){
  if(document.getElementById('overlay-skill')) return;
  if(!document.getElementById('sk-style')){ var st2=document.createElement('style'); st2.id='sk-style';
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);font-size:13.5px}   /* v121: 아이템 폰트 정합 */ .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:82vh;overflow-y:auto} #btn-skill,#btn-profile{font-family:\'Black Han Sans\',\'Jua\',sans-serif;font-size:19px;padding:12px 34px;border-radius:14px;border:2px solid #3d4c73;color:#dfe8ff;background:rgba(18,24,43,.85);box-shadow:0 5px 0 #1c2740,0 9px 18px rgba(0,0,0,.4);text-shadow:0 2px 0 rgba(0,0,0,.6);transition:transform .06s} #btn-skill:active,#btn-profile:active{transform:translateY(3px)} #btn-skill-close,#btn-prf-close{display:block;margin:14px auto 0;width:120px;padding:9px 0;border-radius:12px;border:1.5px solid #FFB300;background:rgba(18,24,43,.85);color:#FFD54F;font-weight:700;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);cursor:pointer} @media (max-width:420px){#btn-skill,#btn-profile{font-size:16px;padding:10px 22px}}';   // v121: 로비 버튼·닫기 — 유물 규격 통일
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">승리 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-skill-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rs=document.getElementById('btn-skill-reset'); if(rs) rs.onclick=function(){ resetSkills(); renderSkillList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-skill'; b.textContent='🎓 전술 연구소';
      b.onclick=function(){ renderSkillList(); ov.classList.remove('hidden'); };
      var rel=document.getElementById('btn-relic'); if(rel&&rel.parentNode===ta) ta.insertBefore(b,rel); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
}
function renderSkillList(){
  var box=document.getElementById('sk-grid'); if(!box) return;
  var st=spState(); var sp=document.getElementById('sk-sp');
  if(sp) sp.textContent='보유 SP: '+st.sp+' · 누적 획득: '+st.total;
  box.innerHTML='';
  ['⚔️','🛡️','🧪'].forEach(function(c){
    var colDiv=document.createElement('div'); colDiv.className='sk-col';
    SKILLS.filter(function(s){ return s.col===c; }).forEach(function(d){
      var lv=skillLv(d.id);
      var locked=false;
      if(d.tier===2&&skillLv(colSkill(d.col,1).id)<2) locked=true;
      if(d.tier===3&&skillLv(colSkill(d.col,2).id)<2) locked=true;
      var item=document.createElement('div'); item.className='sk-item t'+d.tier;
      item.innerHTML='<b>'+d.col+' '+d.name+'</b><small>'+d.desc+'</small><span class="sk-lv">Lv '+lv+'/3</span>';
      var minus=document.createElement('button'); minus.textContent='−'; minus.disabled=lv<=0;
      minus.onclick=function(){ refundSkill(d.id); renderSkillList(); };
      var plus=document.createElement('button'); plus.textContent='+'; plus.disabled=(locked||!canBuySkill(d.id));
      plus.title=locked?'하위 티어 Lv 2 필요':'';
      plus.onclick=function(){ buySkill(d.id); renderSkillList(); };
      item.appendChild(plus); item.appendChild(minus);
      colDiv.appendChild(item);
    });
    box.appendChild(colDiv);
  });
}
function repairTower(){
  if(S.over||S.repCd>0) return false;
  const dmg=towers.filter(t=>t.team==='blue'&&!t.dead&&t.hp<t.maxHp-1);
  if(!dmg.length) return false;
  var __rc=(S._sk&&S._sk.def2)?2:3; if(P.elixir<__rc){ toast('엘릭서 부족 — 수리는 '+__rc+' 필요'); return false; }   // v119: 수리 조직 스킬 — 비용 −1
  const t=dmg.slice().sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
  P.elixir-=__rc; S.repCd=5;
  const amt=Math.min(t.maxHp-t.hp, Math.round(t.maxHp*0.25));
  t.hp+=amt;
  fx.push({x:t.x,y:t.y,t:0,dur:0.8,kind:'ring',col:'rgba(111,208,140,.9)'});
  fx.push({x:t.x,y:t.y,t:0,dur:0.7,kind:'poof'});
  floats.push({x:t.x,y:t.y-1.1,txt:'+'+amt,t:0.9,col:'#8fe6a8',big:false});
  sfx('cast'); toast('🔨 타워 수리 +'+amt);
  try{ syncHUD(); }catch(e){}
  return true;
}
function ensureRepairBtn(){
  var b=document.getElementById('repair-btn'); if(b) return b;
  b=document.createElement('button'); b.id='repair-btn'; b.className='hidden';
  b.innerHTML='<i class="rfill"></i><span class="rt">🔨 수리 3</span>';
  b.onclick=function(){ ensureAudio(); repairTower(); };
  var aw=document.getElementById('arena-wrap'); if(aw) aw.appendChild(b); return b;
}
function syncRepairBtn(){
  var b=document.getElementById('repair-btn')||ensureRepairBtn(); if(!b) return;
  var st=repairBtnState();
  b.classList.toggle('hidden',st==='hidden');
  if(st==='hidden') return;
  var f=b.querySelector('.rfill'), lb=b.querySelector('.rt');
  if(st==='cd'){
    b.classList.add('cd');
    if(f) f.style.width=(S.repCd/5*100)+'%';
    var tx='🔨 '+Math.ceil(S.repCd)+'s';
    if(b.__t!==tx){ lb.textContent=tx; b.__t=tx; }
  } else {
    b.classList.remove('cd');
    if(f&&b.__t!=='ready') f.style.width='0%';
    if(b.__t!=='ready'){ lb.textContent='🔨 수리 3'; b.__t='ready'; }
    b.style.opacity=P.elixir<3?'.55':'1';
  }
}


/* ---------- v109 #13: 유물 4종(영구 계승) ---------- */
var RELICS_LEGACY=[
  {id:'relic_atk',icon:'⚔️',name:'전투 문장',desc:'아군 유닛의 피해 +10%',need:1},
  {id:'relic_tower',icon:'🛡️',name:'수호 문장',desc:'아군 타워 최대 체력 +10%',need:3},
  {id:'relic_spell',icon:'✨',name:'마력 봉인구',desc:'주문 피해 +25%',need:5},
  {id:'relic_gold',icon:'💰',name:'황금 엘릭서 통',desc:'엘릭서 재생 +10%',need:7}
];
function spellDmg(d){ d=Math.round(d*(1+0.10*((S._sk&&S._sk.mag2)||0))); return (S&&S.relic==='relic_spell')?Math.round(d*1.25):d; }   // v119: 스킬트리 광역 술영 — 주문 피해 +10%
function relicWins(){ try{ return Math.max(0,parseInt(localStorage.getItem('ra_wins_v1')||'0',10)||0); }catch(e){ return 0; } }
function loadRelicEquip(){ try{ return localStorage.getItem('ra_relic_v1')||''; }catch(e){ return ''; } }
function saveRelicEquip(id){ try{ if(id) localStorage.setItem('ra_relic_v1',id); else localStorage.removeItem('ra_relic_v1'); }catch(e){} }
function applyRelics(){
  if(S.relic!=='relic_tower') return;
  for(const t of towers){ if(t.team==='blue'&&!t.__rl){ t.__rl=1; t.maxHp=Math.round(t.maxHp*1.1); t.hp=Math.min(t.maxHp,Math.round(t.hp*1.1)); } }
}
function castSpell(key,team,x,y){ var __pn=projs.length; castSpellBase(key,team,x,y); try{ if(team==='blue'&&S.relic==='relic_spell'&&projs.length>__pn){ for(var __i=__pn;__i<projs.length;__i++){ if(projs[__i]&&projs[__i].dmg) projs[__i].dmg=Math.round(projs[__i].dmg*1.25); } } }catch(e){} }
function renderRelicList(){
  var box=document.getElementById('relic-list'); if(!box) return;
  var wins=relicWins(), eq=loadRelicEquip(); box.innerHTML='';
  RELICS.forEach(function(r){
    var d=document.createElement('div'); d.className='rli'+(eq===r.id?' on':'')+((wins<r.need)?' lock':'');
    d.innerHTML='<span class="ricon">'+r.icon+'</span><span class="rmeta"><b>'+r.name+'</b><small>'+r.desc+'</small></span>'
      +(wins<r.need?'<span class="rbadge lk">🔒 '+r.need+'승</span>':(eq===r.id?'<span class="rbadge eq">착용 중</span>':'<span class="rbadge">착용</span>'));
    d.onclick=function(){
      if(wins<r.need){ toast(r.need+'승 달성 시 해금됩니다'); return; }
      saveRelicEquip(eq===r.id?'':r.id); renderRelicList();
    };
    box.appendChild(d);
  });
}
function ensureRelicUI(){
  if(document.getElementById('overlay-relic')) return;
  var ov=document.createElement('div'); ov.id='overlay-relic'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🏺 유물</h2><p class="rsub">승리로 해금 — 한 번에 하나만 착용</p><div id="relic-list"></div><button id="btn-relic-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-relic-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-relic'; b.textContent='🏺 유물';
      b.onclick=function(){ renderRelicList(); ov.classList.remove('hidden'); };
      var hof=document.getElementById('btn-hof'); if(hof&&hof.parentNode===ta) ta.insertBefore(b,hof); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,50);
  };
  setTimeout(tick,50);
}
try{ ensureRelicUI(); ensureSkillUI(); ensureProfileUI(); }catch(e){}

/* v110 SPR.boss 등록(선언 완료 후) */
try{ if(!SPR.boss&&ART.boss){ SPR.boss=new Image(); SPR.boss.src=ART.boss; ASPR.boss=SPR.boss; } }catch(e){}



'use strict';
function ensureSkillUI(){
  if(document.getElementById('overlay-skill')) return;
  if(!document.getElementById('sk-style')){ var st2=document.createElement('style'); st2.id='sk-style';
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);font-size:13.5px}   /* v121: 아이템 폰트 정합 */ .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:82vh;overflow-y:auto} #btn-skill,#btn-profile{font-family:\'Black Han Sans\',\'Jua\',sans-serif;font-size:19px;padding:12px 34px;border-radius:14px;border:2px solid #3d4c73;color:#dfe8ff;background:rgba(18,24,43,.85);box-shadow:0 5px 0 #1c2740,0 9px 18px rgba(0,0,0,.4);text-shadow:0 2px 0 rgba(0,0,0,.6);transition:transform .06s} #btn-skill:active,#btn-profile:active{transform:translateY(3px)} #btn-skill-close,#btn-prf-close{display:block;margin:14px auto 0;width:120px;padding:9px 0;border-radius:12px;border:1.5px solid #FFB300;background:rgba(18,24,43,.85);color:#FFD54F;font-weight:700;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);cursor:pointer} @media (max-width:420px){#btn-skill,#btn-profile{font-size:16px;padding:10px 22px}}';   // v121: 로비 버튼·닫기 — 유물 규격 통일
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">승리 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-skill-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rs=document.getElementById('btn-skill-reset'); if(rs) rs.onclick=function(){ resetSkills(); renderSkillList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-skill'; b.textContent='🎓 전술 연구소';
      b.onclick=function(){ renderSkillList(); ov.classList.remove('hidden'); };
      var rel=document.getElementById('btn-relic'); if(rel&&rel.parentNode===ta) ta.insertBefore(b,rel); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
}
function renderSkillList(){
  var box=document.getElementById('sk-grid'); if(!box) return;
  var st=spState(); var sp=document.getElementById('sk-sp');
  if(sp) sp.textContent='보유 SP: '+st.sp+' · 누적 획득: '+st.total;
  box.innerHTML='';
  ['⚔️','🛡️','🧪'].forEach(function(c){
    var colDiv=document.createElement('div'); colDiv.className='sk-col';
    SKILLS.filter(function(s){ return s.col===c; }).forEach(function(d){
      var lv=skillLv(d.id);
      var locked=false;
      if(d.tier===2&&skillLv(colSkill(d.col,1).id)<2) locked=true;
      if(d.tier===3&&skillLv(colSkill(d.col,2).id)<2) locked=true;
      var item=document.createElement('div'); item.className='sk-item t'+d.tier;
      item.innerHTML='<b>'+d.col+' '+d.name+'</b><small>'+d.desc+'</small><span class="sk-lv">Lv '+lv+'/3</span>';
      var minus=document.createElement('button'); minus.textContent='−'; minus.disabled=lv<=0;
      minus.onclick=function(){ refundSkill(d.id); renderSkillList(); };
      var plus=document.createElement('button'); plus.textContent='+'; plus.disabled=(locked||!canBuySkill(d.id));
      plus.title=locked?'하위 티어 Lv 2 필요':'';
      plus.onclick=function(){ buySkill(d.id); renderSkillList(); };
      item.appendChild(plus); item.appendChild(minus);
      colDiv.appendChild(item);
    });
    box.appendChild(colDiv);
  });
}
function repairTower(){
  if(S.over||S.repCd>0) return false;
  const dmg=towers.filter(t=>t.team==='blue'&&!t.dead&&t.hp<t.maxHp-1);
  if(!dmg.length) return false;
  var __rc=(S._sk&&S._sk.def2)?2:3; if(P.elixir<__rc){ toast('엘릭서 부족 — 수리는 '+__rc+' 필요'); return false; }   // v119: 수리 조직 스킬 — 비용 −1
  const t=dmg.slice().sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
  P.elixir-=__rc; S.repCd=5;
  const amt=Math.min(t.maxHp-t.hp, Math.round(t.maxHp*0.25));
  t.hp+=amt;
  fx.push({x:t.x,y:t.y,t:0,dur:0.8,kind:'ring',col:'rgba(111,208,140,.9)'});
  fx.push({x:t.x,y:t.y,t:0,dur:0.7,kind:'poof'});
  floats.push({x:t.x,y:t.y-1.1,txt:'+'+amt,t:0.9,col:'#8fe6a8',big:false});
  sfx('cast'); toast('🔨 타워 수리 +'+amt);
  try{ syncHUD(); }catch(e){}
  return true;
}
function ensureRepairBtn(){
  var b=document.getElementById('repair-btn'); if(b) return b;
  b=document.createElement('button'); b.id='repair-btn'; b.className='hidden';
  b.innerHTML='<i class="rfill"></i><span class="rt">🔨 수리 3</span>';
  b.onclick=function(){ ensureAudio(); repairTower(); };
  var aw=document.getElementById('arena-wrap'); if(aw) aw.appendChild(b); return b;
}
function syncRepairBtn(){
  var b=document.getElementById('repair-btn')||ensureRepairBtn(); if(!b) return;
  var st=repairBtnState();
  b.classList.toggle('hidden',st==='hidden');
  if(st==='hidden') return;
  var f=b.querySelector('.rfill'), lb=b.querySelector('.rt');
  if(st==='cd'){
    b.classList.add('cd');
    if(f) f.style.width=(S.repCd/5*100)+'%';
    var tx='🔨 '+Math.ceil(S.repCd)+'s';
    if(b.__t!==tx){ lb.textContent=tx; b.__t=tx; }
  } else {
    b.classList.remove('cd');
    if(f&&b.__t!=='ready') f.style.width='0%';
    if(b.__t!=='ready'){ lb.textContent='🔨 수리 3'; b.__t='ready'; }
    b.style.opacity=P.elixir<3?'.55':'1';
  }
}


/* ---------- v109 #13: 유물 4종(영구 계승) ---------- */
var RELICS_LEGACY=[
  {id:'relic_atk',icon:'⚔️',name:'전투 문장',desc:'아군 유닛의 피해 +10%',need:1},
  {id:'relic_tower',icon:'🛡️',name:'수호 문장',desc:'아군 타워 최대 체력 +10%',need:3},
  {id:'relic_spell',icon:'✨',name:'마력 봉인구',desc:'주문 피해 +25%',need:5},
  {id:'relic_gold',icon:'💰',name:'황금 엘릭서 통',desc:'엘릭서 재생 +10%',need:7}
];
function spellDmg(d){ d=Math.round(d*(1+0.10*((S._sk&&S._sk.mag2)||0))); return (S&&S.relic==='relic_spell')?Math.round(d*1.25):d; }   // v119: 스킬트리 광역 술영 — 주문 피해 +10%
function relicWins(){ try{ return Math.max(0,parseInt(localStorage.getItem('ra_wins_v1')||'0',10)||0); }catch(e){ return 0; } }
function loadRelicEquip(){ try{ return localStorage.getItem('ra_relic_v1')||''; }catch(e){ return ''; } }
function saveRelicEquip(id){ try{ if(id) localStorage.setItem('ra_relic_v1',id); else localStorage.removeItem('ra_relic_v1'); }catch(e){} }
function applyRelics(){
  if(S.relic!=='relic_tower') return;
  for(const t of towers){ if(t.team==='blue'&&!t.__rl){ t.__rl=1; t.maxHp=Math.round(t.maxHp*1.1); t.hp=Math.min(t.maxHp,Math.round(t.hp*1.1)); } }
}
function castSpell(key,team,x,y){ var __pn=projs.length; castSpellBase(key,team,x,y); try{ if(team==='blue'&&S.relic==='relic_spell'&&projs.length>__pn){ for(var __i=__pn;__i<projs.length;__i++){ if(projs[__i]&&projs[__i].dmg) projs[__i].dmg=Math.round(projs[__i].dmg*1.25); } } }catch(e){} }
function renderRelicList(){
  var box=document.getElementById('relic-list'); if(!box) return;
  var wins=relicWins(), eq=loadRelicEquip(); box.innerHTML='';
  RELICS.forEach(function(r){
    var d=document.createElement('div'); d.className='rli'+(eq===r.id?' on':'')+((wins<r.need)?' lock':'');
    d.innerHTML='<span class="ricon">'+r.icon+'</span><span class="rmeta"><b>'+r.name+'</b><small>'+r.desc+'</small></span>'
      +(wins<r.need?'<span class="rbadge lk">🔒 '+r.need+'승</span>':(eq===r.id?'<span class="rbadge eq">착용 중</span>':'<span class="rbadge">착용</span>'));
    d.onclick=function(){
      if(wins<r.need){ toast(r.need+'승 달성 시 해금됩니다'); return; }
      saveRelicEquip(eq===r.id?'':r.id); renderRelicList();
    };
    box.appendChild(d);
  });
}
function ensureRelicUI(){
  if(document.getElementById('overlay-relic')) return;
  var ov=document.createElement('div'); ov.id='overlay-relic'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🏺 유물</h2><p class="rsub">승리로 해금 — 한 번에 하나만 착용</p><div id="relic-list"></div><button id="btn-relic-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-relic-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-relic'; b.textContent='🏺 유물';
      b.onclick=function(){ renderRelicList(); ov.classList.remove('hidden'); };
      var hof=document.getElementById('btn-hof'); if(hof&&hof.parentNode===ta) ta.insertBefore(b,hof); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,50);
  };
  setTimeout(tick,50);
}
try{ ensureRelicUI(); ensureSkillUI(); ensureProfileUI(); }catch(e){}

/* v110 SPR.boss 등록(선언 완료 후) */
try{ if(!SPR.boss&&ART.boss){ SPR.boss=new Image(); SPR.boss.src=ART.boss; ASPR.boss=SPR.boss; } }catch(e){}



'use strict';
function ensureSkillUI(){
  if(document.getElementById('overlay-skill')) return;
  if(!document.getElementById('sk-style')){ var st2=document.createElement('style'); st2.id='sk-style';
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);font-size:13.5px}   /* v121: 아이템 폰트 정합 */ .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:82vh;overflow-y:auto} #btn-skill,#btn-profile{font-family:\'Black Han Sans\',\'Jua\',sans-serif;font-size:19px;padding:12px 34px;border-radius:14px;border:2px solid #3d4c73;color:#dfe8ff;background:rgba(18,24,43,.85);box-shadow:0 5px 0 #1c2740,0 9px 18px rgba(0,0,0,.4);text-shadow:0 2px 0 rgba(0,0,0,.6);transition:transform .06s} #btn-skill:active,#btn-profile:active{transform:translateY(3px)} #btn-skill-close,#btn-prf-close{display:block;margin:14px auto 0;width:120px;padding:9px 0;border-radius:12px;border:1.5px solid #FFB300;background:rgba(18,24,43,.85);color:#FFD54F;font-weight:700;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);cursor:pointer} @media (max-width:420px){#btn-skill,#btn-profile{font-size:16px;padding:10px 22px}}';   // v121: 로비 버튼·닫기 — 유물 규격 통일
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">승리 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-skill-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rs=document.getElementById('btn-skill-reset'); if(rs) rs.onclick=function(){ resetSkills(); renderSkillList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-skill'; b.textContent='🎓 전술 연구소';
      b.onclick=function(){ renderSkillList(); ov.classList.remove('hidden'); };
      var rel=document.getElementById('btn-relic'); if(rel&&rel.parentNode===ta) ta.insertBefore(b,rel); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
}
function renderSkillList(){
  var box=document.getElementById('sk-grid'); if(!box) return;
  var st=spState(); var sp=document.getElementById('sk-sp');
  if(sp) sp.textContent='보유 SP: '+st.sp+' · 누적 획득: '+st.total;
  box.innerHTML='';
  ['⚔️','🛡️','🧪'].forEach(function(c){
    var colDiv=document.createElement('div'); colDiv.className='sk-col';
    SKILLS.filter(function(s){ return s.col===c; }).forEach(function(d){
      var lv=skillLv(d.id);
      var locked=false;
      if(d.tier===2&&skillLv(colSkill(d.col,1).id)<2) locked=true;
      if(d.tier===3&&skillLv(colSkill(d.col,2).id)<2) locked=true;
      var item=document.createElement('div'); item.className='sk-item t'+d.tier;
      item.innerHTML='<b>'+d.col+' '+d.name+'</b><small>'+d.desc+'</small><span class="sk-lv">Lv '+lv+'/3</span>';
      var minus=document.createElement('button'); minus.textContent='−'; minus.disabled=lv<=0;
      minus.onclick=function(){ refundSkill(d.id); renderSkillList(); };
      var plus=document.createElement('button'); plus.textContent='+'; plus.disabled=(locked||!canBuySkill(d.id));
      plus.title=locked?'하위 티어 Lv 2 필요':'';
      plus.onclick=function(){ buySkill(d.id); renderSkillList(); };
      item.appendChild(plus); item.appendChild(minus);
      colDiv.appendChild(item);
    });
    box.appendChild(colDiv);
  });
}
function repairTower(){
  if(S.over||S.repCd>0) return false;
  const dmg=towers.filter(t=>t.team==='blue'&&!t.dead&&t.hp<t.maxHp-1);
  if(!dmg.length) return false;
  var __rc=(S._sk&&S._sk.def2)?2:3; if(P.elixir<__rc){ toast('엘릭서 부족 — 수리는 '+__rc+' 필요'); return false; }   // v119: 수리 조직 스킬 — 비용 −1
  const t=dmg.slice().sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
  P.elixir-=__rc; S.repCd=5;
  const amt=Math.min(t.maxHp-t.hp, Math.round(t.maxHp*0.25));
  t.hp+=amt;
  fx.push({x:t.x,y:t.y,t:0,dur:0.8,kind:'ring',col:'rgba(111,208,140,.9)'});
  fx.push({x:t.x,y:t.y,t:0,dur:0.7,kind:'poof'});
  floats.push({x:t.x,y:t.y-1.1,txt:'+'+amt,t:0.9,col:'#8fe6a8',big:false});
  sfx('cast'); toast('🔨 타워 수리 +'+amt);
  try{ syncHUD(); }catch(e){}
  return true;
}
function ensureRepairBtn(){
  var b=document.getElementById('repair-btn'); if(b) return b;
  b=document.createElement('button'); b.id='repair-btn'; b.className='hidden';
  b.innerHTML='<i class="rfill"></i><span class="rt">🔨 수리 3</span>';
  b.onclick=function(){ ensureAudio(); repairTower(); };
  var aw=document.getElementById('arena-wrap'); if(aw) aw.appendChild(b); return b;
}
function syncRepairBtn(){
  var b=document.getElementById('repair-btn')||ensureRepairBtn(); if(!b) return;
  var st=repairBtnState();
  b.classList.toggle('hidden',st==='hidden');
  if(st==='hidden') return;
  var f=b.querySelector('.rfill'), lb=b.querySelector('.rt');
  if(st==='cd'){
    b.classList.add('cd');
    if(f) f.style.width=(S.repCd/5*100)+'%';
    var tx='🔨 '+Math.ceil(S.repCd)+'s';
    if(b.__t!==tx){ lb.textContent=tx; b.__t=tx; }
  } else {
    b.classList.remove('cd');
    if(f&&b.__t!=='ready') f.style.width='0%';
    if(b.__t!=='ready'){ lb.textContent='🔨 수리 3'; b.__t='ready'; }
    b.style.opacity=P.elixir<3?'.55':'1';
  }
}


/* ---------- v109 #13: 유물 4종(영구 계승) ---------- */
var RELICS_LEGACY=[
  {id:'relic_atk',icon:'⚔️',name:'전투 문장',desc:'아군 유닛의 피해 +10%',need:1},
  {id:'relic_tower',icon:'🛡️',name:'수호 문장',desc:'아군 타워 최대 체력 +10%',need:3},
  {id:'relic_spell',icon:'✨',name:'마력 봉인구',desc:'주문 피해 +25%',need:5},
  {id:'relic_gold',icon:'💰',name:'황금 엘릭서 통',desc:'엘릭서 재생 +10%',need:7}
];
function spellDmg(d){ d=Math.round(d*(1+0.10*((S._sk&&S._sk.mag2)||0))); return (S&&S.relic==='relic_spell')?Math.round(d*1.25):d; }   // v119: 스킬트리 광역 술영 — 주문 피해 +10%
function relicWins(){ try{ return Math.max(0,parseInt(localStorage.getItem('ra_wins_v1')||'0',10)||0); }catch(e){ return 0; } }
function loadRelicEquip(){ try{ return localStorage.getItem('ra_relic_v1')||''; }catch(e){ return ''; } }
function saveRelicEquip(id){ try{ if(id) localStorage.setItem('ra_relic_v1',id); else localStorage.removeItem('ra_relic_v1'); }catch(e){} }
function applyRelics(){
  if(S.relic!=='relic_tower') return;
  for(const t of towers){ if(t.team==='blue'&&!t.__rl){ t.__rl=1; t.maxHp=Math.round(t.maxHp*1.1); t.hp=Math.min(t.maxHp,Math.round(t.hp*1.1)); } }
}
function castSpell(key,team,x,y){ var __pn=projs.length; castSpellBase(key,team,x,y); try{ if(team==='blue'&&S.relic==='relic_spell'&&projs.length>__pn){ for(var __i=__pn;__i<projs.length;__i++){ if(projs[__i]&&projs[__i].dmg) projs[__i].dmg=Math.round(projs[__i].dmg*1.25); } } }catch(e){} }
function renderRelicList(){
  var box=document.getElementById('relic-list'); if(!box) return;
  var wins=relicWins(), eq=loadRelicEquip(); box.innerHTML='';
  RELICS.forEach(function(r){
    var d=document.createElement('div'); d.className='rli'+(eq===r.id?' on':'')+((wins<r.need)?' lock':'');
    d.innerHTML='<span class="ricon">'+r.icon+'</span><span class="rmeta"><b>'+r.name+'</b><small>'+r.desc+'</small></span>'
      +(wins<r.need?'<span class="rbadge lk">🔒 '+r.need+'승</span>':(eq===r.id?'<span class="rbadge eq">착용 중</span>':'<span class="rbadge">착용</span>'));
    d.onclick=function(){
      if(wins<r.need){ toast(r.need+'승 달성 시 해금됩니다'); return; }
      saveRelicEquip(eq===r.id?'':r.id); renderRelicList();
    };
    box.appendChild(d);
  });
}
function ensureRelicUI(){
  if(document.getElementById('overlay-relic')) return;
  var ov=document.createElement('div'); ov.id='overlay-relic'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🏺 유물</h2><p class="rsub">승리로 해금 — 한 번에 하나만 착용</p><div id="relic-list"></div><button id="btn-relic-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-relic-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-relic'; b.textContent='🏺 유물';
      b.onclick=function(){ renderRelicList(); ov.classList.remove('hidden'); };
      var hof=document.getElementById('btn-hof'); if(hof&&hof.parentNode===ta) ta.insertBefore(b,hof); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,50);
  };
  setTimeout(tick,50);
}
try{ ensureRelicUI(); ensureSkillUI(); ensureProfileUI(); }catch(e){}

/* v110 SPR.boss 등록(선언 완료 후) */
try{ if(!SPR.boss&&ART.boss){ SPR.boss=new Image(); SPR.boss.src=ART.boss; ASPR.boss=SPR.boss; } }catch(e){}



'use strict';
function ensureSkillUI(){
  if(document.getElementById('overlay-skill')) return;
  if(!document.getElementById('sk-style')){ var st2=document.createElement('style'); st2.id='sk-style';
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left} .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:82vh;overflow-y:auto}';
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">승리 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-skill-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rs=document.getElementById('btn-skill-reset'); if(rs) rs.onclick=function(){ resetSkills(); renderSkillList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-skill'; b.textContent='🎓 전술 연구소';
      b.onclick=function(){ renderSkillList(); ov.classList.remove('hidden'); };
      var rel=document.getElementById('btn-relic'); if(rel&&rel.parentNode===ta) ta.insertBefore(b,rel); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
}
function renderSkillList(){
  var box=document.getElementById('sk-grid'); if(!box) return;
  var st=spState(); var sp=document.getElementById('sk-sp');
  if(sp) sp.textContent='보유 SP: '+st.sp+' · 누적 획득: '+st.total;
  box.innerHTML='';
  ['⚔️','🛡️','🧪'].forEach(function(c){
    var colDiv=document.createElement('div'); colDiv.className='sk-col';
    SKILLS.filter(function(s){ return s.col===c; }).forEach(function(d){
      var lv=skillLv(d.id);
      var locked=false;
      if(d.tier===2&&skillLv(colSkill(d.col,1).id)<2) locked=true;
      if(d.tier===3&&skillLv(colSkill(d.col,2).id)<2) locked=true;
      var item=document.createElement('div'); item.className='sk-item t'+d.tier;
      item.innerHTML='<b>'+d.col+' '+d.name+'</b><small>'+d.desc+'</small><span class="sk-lv">Lv '+lv+'/3</span>';
      var minus=document.createElement('button'); minus.textContent='−'; minus.disabled=lv<=0;
      minus.onclick=function(){ refundSkill(d.id); renderSkillList(); };
      var plus=document.createElement('button'); plus.textContent='+'; plus.disabled=(locked||!canBuySkill(d.id));
      plus.title=locked?'하위 티어 Lv 2 필요':'';
      plus.onclick=function(){ buySkill(d.id); renderSkillList(); };
      item.appendChild(plus); item.appendChild(minus);
      colDiv.appendChild(item);
    });
    box.appendChild(colDiv);
  });
}
function repairTower(){
  if(S.over||S.repCd>0) return false;
  const dmg=towers.filter(t=>t.team==='blue'&&!t.dead&&t.hp<t.maxHp-1);
  if(!dmg.length) return false;
  var __rc=(S._sk&&S._sk.def2)?2:3; if(P.elixir<__rc){ toast('엘릭서 부족 — 수리는 '+__rc+' 필요'); return false; }   // v119: 수리 조직 스킬 — 비용 −1
  const t=dmg.slice().sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
  P.elixir-=__rc; S.repCd=5;
  const amt=Math.min(t.maxHp-t.hp, Math.round(t.maxHp*0.25));
  t.hp+=amt;
  fx.push({x:t.x,y:t.y,t:0,dur:0.8,kind:'ring',col:'rgba(111,208,140,.9)'});
  fx.push({x:t.x,y:t.y,t:0,dur:0.7,kind:'poof'});
  floats.push({x:t.x,y:t.y-1.1,txt:'+'+amt,t:0.9,col:'#8fe6a8',big:false});
  sfx('cast'); toast('🔨 타워 수리 +'+amt);
  try{ syncHUD(); }catch(e){}
  return true;
}
function ensureRepairBtn(){
  var b=document.getElementById('repair-btn'); if(b) return b;
  b=document.createElement('button'); b.id='repair-btn'; b.className='hidden';
  b.innerHTML='<i class="rfill"></i><span class="rt">🔨 수리 3</span>';
  b.onclick=function(){ ensureAudio(); repairTower(); };
  var aw=document.getElementById('arena-wrap'); if(aw) aw.appendChild(b); return b;
}
function syncRepairBtn(){
  var b=document.getElementById('repair-btn')||ensureRepairBtn(); if(!b) return;
  var st=repairBtnState();
  b.classList.toggle('hidden',st==='hidden');
  if(st==='hidden') return;
  var f=b.querySelector('.rfill'), lb=b.querySelector('.rt');
  if(st==='cd'){
    b.classList.add('cd');
    if(f) f.style.width=(S.repCd/5*100)+'%';
    var tx='🔨 '+Math.ceil(S.repCd)+'s';
    if(b.__t!==tx){ lb.textContent=tx; b.__t=tx; }
  } else {
    b.classList.remove('cd');
    if(f&&b.__t!=='ready') f.style.width='0%';
    if(b.__t!=='ready'){ lb.textContent='🔨 수리 3'; b.__t='ready'; }
    b.style.opacity=P.elixir<3?'.55':'1';
  }
}


/* ---------- v109 #13: 유물 4종(영구 계승) ---------- */
var RELICS_LEGACY=[
  {id:'relic_atk',icon:'⚔️',name:'전투 문장',desc:'아군 유닛의 피해 +10%',need:1},
  {id:'relic_tower',icon:'🛡️',name:'수호 문장',desc:'아군 타워 최대 체력 +10%',need:3},
  {id:'relic_spell',icon:'✨',name:'마력 봉인구',desc:'주문 피해 +25%',need:5},
  {id:'relic_gold',icon:'💰',name:'황금 엘릭서 통',desc:'엘릭서 재생 +10%',need:7}
];
function spellDmg(d){ d=Math.round(d*(1+0.10*((S._sk&&S._sk.mag2)||0))); return (S&&S.relic==='relic_spell')?Math.round(d*1.25):d; }   // v119: 스킬트리 광역 술영 — 주문 피해 +10%
function relicWins(){ try{ return Math.max(0,parseInt(localStorage.getItem('ra_wins_v1')||'0',10)||0); }catch(e){ return 0; } }
function loadRelicEquip(){ try{ return localStorage.getItem('ra_relic_v1')||''; }catch(e){ return ''; } }
function saveRelicEquip(id){ try{ if(id) localStorage.setItem('ra_relic_v1',id); else localStorage.removeItem('ra_relic_v1'); }catch(e){} }
function applyRelics(){
  if(S.relic!=='relic_tower') return;
  for(const t of towers){ if(t.team==='blue'&&!t.__rl){ t.__rl=1; t.maxHp=Math.round(t.maxHp*1.1); t.hp=Math.min(t.maxHp,Math.round(t.hp*1.1)); } }
}
function castSpell(key,team,x,y){ var __pn=projs.length; castSpellBase(key,team,x,y); try{ if(team==='blue'&&S.relic==='relic_spell'&&projs.length>__pn){ for(var __i=__pn;__i<projs.length;__i++){ if(projs[__i]&&projs[__i].dmg) projs[__i].dmg=Math.round(projs[__i].dmg*1.25); } } }catch(e){} }
function renderRelicList(){
  var box=document.getElementById('relic-list'); if(!box) return;
  var wins=relicWins(), eq=loadRelicEquip(); box.innerHTML='';
  RELICS.forEach(function(r){
    var d=document.createElement('div'); d.className='rli'+(eq===r.id?' on':'')+((wins<r.need)?' lock':'');
    d.innerHTML='<span class="ricon">'+r.icon+'</span><span class="rmeta"><b>'+r.name+'</b><small>'+r.desc+'</small></span>'
      +(wins<r.need?'<span class="rbadge lk">🔒 '+r.need+'승</span>':(eq===r.id?'<span class="rbadge eq">착용 중</span>':'<span class="rbadge">착용</span>'));
    d.onclick=function(){
      if(wins<r.need){ toast(r.need+'승 달성 시 해금됩니다'); return; }
      saveRelicEquip(eq===r.id?'':r.id); renderRelicList();
    };
    box.appendChild(d);
  });
}
function ensureRelicUI(){
  if(document.getElementById('overlay-relic')) return;
  var ov=document.createElement('div'); ov.id='overlay-relic'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🏺 유물</h2><p class="rsub">승리로 해금 — 한 번에 하나만 착용</p><div id="relic-list"></div><button id="btn-relic-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-relic-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-relic'; b.textContent='🏺 유물';
      b.onclick=function(){ renderRelicList(); ov.classList.remove('hidden'); };
      var hof=document.getElementById('btn-hof'); if(hof&&hof.parentNode===ta) ta.insertBefore(b,hof); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,50);
  };
  setTimeout(tick,50);
}
try{ ensureRelicUI(); ensureSkillUI(); ensureProfileUI(); }catch(e){}

/* v110 SPR.boss 등록(선언 완료 후) */
try{ if(!SPR.boss&&ART.boss){ SPR.boss=new Image(); SPR.boss.src=ART.boss; ASPR.boss=SPR.boss; } }catch(e){}



'use strict';
function ensureSkillUI(){
  if(document.getElementById('overlay-skill')) return;
  if(!document.getElementById('sk-style')){ var st2=document.createElement('style'); st2.id='sk-style';
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left} .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:82vh;overflow-y:auto}';
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">승리 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-skill-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rs=document.getElementById('btn-skill-reset'); if(rs) rs.onclick=function(){ resetSkills(); renderSkillList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-skill'; b.textContent='🎓 전술 연구소';
      b.onclick=function(){ renderSkillList(); ov.classList.remove('hidden'); };
      var rel=document.getElementById('btn-relic'); if(rel&&rel.parentNode===ta) ta.insertBefore(b,rel); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
}
function renderSkillList(){
  var box=document.getElementById('sk-grid'); if(!box) return;
  var st=spState(); var sp=document.getElementById('sk-sp');
  if(sp) sp.textContent='보유 SP: '+st.sp+' · 누적 획득: '+st.total;
  box.innerHTML='';
  ['⚔️','🛡️','🧪'].forEach(function(c){
    var colDiv=document.createElement('div'); colDiv.className='sk-col';
    SKILLS.filter(function(s){ return s.col===c; }).forEach(function(d){
      var lv=skillLv(d.id);
      var locked=false;
      if(d.tier===2&&skillLv(colSkill(d.col,1).id)<2) locked=true;
      if(d.tier===3&&skillLv(colSkill(d.col,2).id)<2) locked=true;
      var item=document.createElement('div'); item.className='sk-item t'+d.tier;
      item.innerHTML='<b>'+d.col+' '+d.name+'</b><small>'+d.desc+'</small><span class="sk-lv">Lv '+lv+'/3</span>';
      var minus=document.createElement('button'); minus.textContent='−'; minus.disabled=lv<=0;
      minus.onclick=function(){ refundSkill(d.id); renderSkillList(); };
      var plus=document.createElement('button'); plus.textContent='+'; plus.disabled=(locked||!canBuySkill(d.id));
      plus.title=locked?'하위 티어 Lv 2 필요':'';
      plus.onclick=function(){ buySkill(d.id); renderSkillList(); };
      item.appendChild(plus); item.appendChild(minus);
      colDiv.appendChild(item);
    });
    box.appendChild(colDiv);
  });
}
function repairTower(){
  if(S.over||S.repCd>0) return false;
  const dmg=towers.filter(t=>t.team==='blue'&&!t.dead&&t.hp<t.maxHp-1);
  if(!dmg.length) return false;
  var __rc=(S._sk&&S._sk.def2)?2:3; if(P.elixir<__rc){ toast('엘릭서 부족 — 수리는 '+__rc+' 필요'); return false; }   // v119: 수리 조직 스킬 — 비용 −1
  const t=dmg.slice().sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
  P.elixir-=__rc; S.repCd=5;
  const amt=Math.min(t.maxHp-t.hp, Math.round(t.maxHp*0.25));
  t.hp+=amt;
  fx.push({x:t.x,y:t.y,t:0,dur:0.8,kind:'ring',col:'rgba(111,208,140,.9)'});
  fx.push({x:t.x,y:t.y,t:0,dur:0.7,kind:'poof'});
  floats.push({x:t.x,y:t.y-1.1,txt:'+'+amt,t:0.9,col:'#8fe6a8',big:false});
  sfx('cast'); toast('🔨 타워 수리 +'+amt);
  try{ syncHUD(); }catch(e){}
  return true;
}
function ensureRepairBtn(){
  var b=document.getElementById('repair-btn'); if(b) return b;
  b=document.createElement('button'); b.id='repair-btn'; b.className='hidden';
  b.innerHTML='<i class="rfill"></i><span class="rt">🔨 수리 3</span>';
  b.onclick=function(){ ensureAudio(); repairTower(); };
  var aw=document.getElementById('arena-wrap'); if(aw) aw.appendChild(b); return b;
}
function syncRepairBtn(){
  var b=document.getElementById('repair-btn')||ensureRepairBtn(); if(!b) return;
  var st=repairBtnState();
  b.classList.toggle('hidden',st==='hidden');
  if(st==='hidden') return;
  var f=b.querySelector('.rfill'), lb=b.querySelector('.rt');
  if(st==='cd'){
    b.classList.add('cd');
    if(f) f.style.width=(S.repCd/5*100)+'%';
    var tx='🔨 '+Math.ceil(S.repCd)+'s';
    if(b.__t!==tx){ lb.textContent=tx; b.__t=tx; }
  } else {
    b.classList.remove('cd');
    if(f&&b.__t!=='ready') f.style.width='0%';
    if(b.__t!=='ready'){ lb.textContent='🔨 수리 3'; b.__t='ready'; }
    b.style.opacity=P.elixir<3?'.55':'1';
  }
}


/* ---------- v109 #13: 유물 4종(영구 계승) ---------- */
var RELICS_LEGACY=[
  {id:'relic_atk',icon:'⚔️',name:'전투 문장',desc:'아군 유닛의 피해 +10%',need:1},
  {id:'relic_tower',icon:'🛡️',name:'수호 문장',desc:'아군 타워 최대 체력 +10%',need:3},
  {id:'relic_spell',icon:'✨',name:'마력 봉인구',desc:'주문 피해 +25%',need:5},
  {id:'relic_gold',icon:'💰',name:'황금 엘릭서 통',desc:'엘릭서 재생 +10%',need:7}
];
function spellDmg(d){ d=Math.round(d*(1+0.10*((S._sk&&S._sk.mag2)||0))); return (S&&S.relic==='relic_spell')?Math.round(d*1.25):d; }   // v119: 스킬트리 광역 술영 — 주문 피해 +10%
function relicWins(){ try{ return Math.max(0,parseInt(localStorage.getItem('ra_wins_v1')||'0',10)||0); }catch(e){ return 0; } }
function loadRelicEquip(){ try{ return localStorage.getItem('ra_relic_v1')||''; }catch(e){ return ''; } }
function saveRelicEquip(id){ try{ if(id) localStorage.setItem('ra_relic_v1',id); else localStorage.removeItem('ra_relic_v1'); }catch(e){} }
function applyRelics(){
  if(S.relic!=='relic_tower') return;
  for(const t of towers){ if(t.team==='blue'&&!t.__rl){ t.__rl=1; t.maxHp=Math.round(t.maxHp*1.1); t.hp=Math.min(t.maxHp,Math.round(t.hp*1.1)); } }
}
function castSpell(key,team,x,y){ var __pn=projs.length; castSpellBase(key,team,x,y); try{ if(team==='blue'&&S.relic==='relic_spell'&&projs.length>__pn){ for(var __i=__pn;__i<projs.length;__i++){ if(projs[__i]&&projs[__i].dmg) projs[__i].dmg=Math.round(projs[__i].dmg*1.25); } } }catch(e){} }
function renderRelicList(){
  var box=document.getElementById('relic-list'); if(!box) return;
  var wins=relicWins(), eq=loadRelicEquip(); box.innerHTML='';
  RELICS.forEach(function(r){
    var d=document.createElement('div'); d.className='rli'+(eq===r.id?' on':'')+((wins<r.need)?' lock':'');
    d.innerHTML='<span class="ricon">'+r.icon+'</span><span class="rmeta"><b>'+r.name+'</b><small>'+r.desc+'</small></span>'
      +(wins<r.need?'<span class="rbadge lk">🔒 '+r.need+'승</span>':(eq===r.id?'<span class="rbadge eq">착용 중</span>':'<span class="rbadge">착용</span>'));
    d.onclick=function(){
      if(wins<r.need){ toast(r.need+'승 달성 시 해금됩니다'); return; }
      saveRelicEquip(eq===r.id?'':r.id); renderRelicList();
    };
    box.appendChild(d);
  });
}
function ensureRelicUI(){
  if(document.getElementById('overlay-relic')) return;
  var ov=document.createElement('div'); ov.id='overlay-relic'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🏺 유물</h2><p class="rsub">승리로 해금 — 한 번에 하나만 착용</p><div id="relic-list"></div><button id="btn-relic-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-relic-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-relic'; b.textContent='🏺 유물';
      b.onclick=function(){ renderRelicList(); ov.classList.remove('hidden'); };
      var hof=document.getElementById('btn-hof'); if(hof&&hof.parentNode===ta) ta.insertBefore(b,hof); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,50);
  };
  setTimeout(tick,50);
}
try{ ensureRelicUI(); ensureSkillUI(); ensureProfileUI(); }catch(e){}

/* v110 SPR.boss 등록(선언 완료 후) */
try{ if(!SPR.boss&&ART.boss){ SPR.boss=new Image(); SPR.boss.src=ART.boss; ASPR.boss=SPR.boss; } }catch(e){}



'use strict';
function ensureSkillUI(){
  if(document.getElementById('overlay-skill')) return;
  if(!document.getElementById('sk-style')){ var st2=document.createElement('style'); st2.id='sk-style';
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left} .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:82vh;overflow-y:auto}';
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">승리 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-skill-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rs=document.getElementById('btn-skill-reset'); if(rs) rs.onclick=function(){ resetSkills(); renderSkillList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-skill'; b.textContent='🎓 전술 연구소';
      b.onclick=function(){ renderSkillList(); ov.classList.remove('hidden'); };
      var rel=document.getElementById('btn-relic'); if(rel&&rel.parentNode===ta) ta.insertBefore(b,rel); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
}
function renderSkillList(){
  var box=document.getElementById('sk-grid'); if(!box) return;
  var st=spState(); var sp=document.getElementById('sk-sp');
  if(sp) sp.textContent='보유 SP: '+st.sp+' · 누적 획득: '+st.total;
  box.innerHTML='';
  ['⚔️','🛡️','🧪'].forEach(function(c){
    var colDiv=document.createElement('div'); colDiv.className='sk-col';
    SKILLS.filter(function(s){ return s.col===c; }).forEach(function(d){
      var lv=skillLv(d.id);
      var locked=false;
      if(d.tier===2&&skillLv(colSkill(d.col,1).id)<2) locked=true;
      if(d.tier===3&&skillLv(colSkill(d.col,2).id)<2) locked=true;
      var item=document.createElement('div'); item.className='sk-item t'+d.tier;
      item.innerHTML='<b>'+d.col+' '+d.name+'</b><small>'+d.desc+'</small><span class="sk-lv">Lv '+lv+'/3</span>';
      var minus=document.createElement('button'); minus.textContent='−'; minus.disabled=lv<=0;
      minus.onclick=function(){ refundSkill(d.id); renderSkillList(); };
      var plus=document.createElement('button'); plus.textContent='+'; plus.disabled=(locked||!canBuySkill(d.id));
      plus.title=locked?'하위 티어 Lv 2 필요':'';
      plus.onclick=function(){ buySkill(d.id); renderSkillList(); };
      item.appendChild(plus); item.appendChild(minus);
      colDiv.appendChild(item);
    });
    box.appendChild(colDiv);
  });
}
function repairTower(){
  if(S.over||S.repCd>0) return false;
  const dmg=towers.filter(t=>t.team==='blue'&&!t.dead&&t.hp<t.maxHp-1);
  if(!dmg.length) return false;
  var __rc=(S._sk&&S._sk.def2)?2:3; if(P.elixir<__rc){ toast('엘릭서 부족 — 수리는 '+__rc+' 필요'); return false; }   // v119: 수리 조직 스킬 — 비용 −1
  const t=dmg.slice().sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
  P.elixir-=__rc; S.repCd=5;
  const amt=Math.min(t.maxHp-t.hp, Math.round(t.maxHp*0.25));
  t.hp+=amt;
  fx.push({x:t.x,y:t.y,t:0,dur:0.8,kind:'ring',col:'rgba(111,208,140,.9)'});
  fx.push({x:t.x,y:t.y,t:0,dur:0.7,kind:'poof'});
  floats.push({x:t.x,y:t.y-1.1,txt:'+'+amt,t:0.9,col:'#8fe6a8',big:false});
  sfx('cast'); toast('🔨 타워 수리 +'+amt);
  try{ syncHUD(); }catch(e){}
  return true;
}
function ensureRepairBtn(){
  var b=document.getElementById('repair-btn'); if(b) return b;
  b=document.createElement('button'); b.id='repair-btn'; b.className='hidden';
  b.innerHTML='<i class="rfill"></i><span class="rt">🔨 수리 3</span>';
  b.onclick=function(){ ensureAudio(); repairTower(); };
  var aw=document.getElementById('arena-wrap'); if(aw) aw.appendChild(b); return b;
}
function syncRepairBtn(){
  var b=document.getElementById('repair-btn')||ensureRepairBtn(); if(!b) return;
  var st=repairBtnState();
  b.classList.toggle('hidden',st==='hidden');
  if(st==='hidden') return;
  var f=b.querySelector('.rfill'), lb=b.querySelector('.rt');
  if(st==='cd'){
    b.classList.add('cd');
    if(f) f.style.width=(S.repCd/5*100)+'%';
    var tx='🔨 '+Math.ceil(S.repCd)+'s';
    if(b.__t!==tx){ lb.textContent=tx; b.__t=tx; }
  } else {
    b.classList.remove('cd');
    if(f&&b.__t!=='ready') f.style.width='0%';
    if(b.__t!=='ready'){ lb.textContent='🔨 수리 3'; b.__t='ready'; }
    b.style.opacity=P.elixir<3?'.55':'1';
  }
}


/* ---------- v109 #13: 유물 4종(영구 계승) ---------- */
var RELICS_LEGACY=[
  {id:'relic_atk',icon:'⚔️',name:'전투 문장',desc:'아군 유닛의 피해 +10%',need:1},
  {id:'relic_tower',icon:'🛡️',name:'수호 문장',desc:'아군 타워 최대 체력 +10%',need:3},
  {id:'relic_spell',icon:'✨',name:'마력 봉인구',desc:'주문 피해 +25%',need:5},
  {id:'relic_gold',icon:'💰',name:'황금 엘릭서 통',desc:'엘릭서 재생 +10%',need:7}
];
function spellDmg(d){ d=Math.round(d*(1+0.10*((S._sk&&S._sk.mag2)||0))); return (S&&S.relic==='relic_spell')?Math.round(d*1.25):d; }   // v119: 스킬트리 광역 술영 — 주문 피해 +10%
function relicWins(){ try{ return Math.max(0,parseInt(localStorage.getItem('ra_wins_v1')||'0',10)||0); }catch(e){ return 0; } }
function loadRelicEquip(){ try{ return localStorage.getItem('ra_relic_v1')||''; }catch(e){ return ''; } }
function saveRelicEquip(id){ try{ if(id) localStorage.setItem('ra_relic_v1',id); else localStorage.removeItem('ra_relic_v1'); }catch(e){} }
function applyRelics(){
  if(S.relic!=='relic_tower') return;
  for(const t of towers){ if(t.team==='blue'&&!t.__rl){ t.__rl=1; t.maxHp=Math.round(t.maxHp*1.1); t.hp=Math.min(t.maxHp,Math.round(t.hp*1.1)); } }
}
function castSpell(key,team,x,y){ var __pn=projs.length; castSpellBase(key,team,x,y); try{ if(team==='blue'&&S.relic==='relic_spell'&&projs.length>__pn){ for(var __i=__pn;__i<projs.length;__i++){ if(projs[__i]&&projs[__i].dmg) projs[__i].dmg=Math.round(projs[__i].dmg*1.25); } } }catch(e){} }
function renderRelicList(){
  var box=document.getElementById('relic-list'); if(!box) return;
  var wins=relicWins(), eq=loadRelicEquip(); box.innerHTML='';
  RELICS.forEach(function(r){
    var d=document.createElement('div'); d.className='rli'+(eq===r.id?' on':'')+((wins<r.need)?' lock':'');
    d.innerHTML='<span class="ricon">'+r.icon+'</span><span class="rmeta"><b>'+r.name+'</b><small>'+r.desc+'</small></span>'
      +(wins<r.need?'<span class="rbadge lk">🔒 '+r.need+'승</span>':(eq===r.id?'<span class="rbadge eq">착용 중</span>':'<span class="rbadge">착용</span>'));
    d.onclick=function(){
      if(wins<r.need){ toast(r.need+'승 달성 시 해금됩니다'); return; }
      saveRelicEquip(eq===r.id?'':r.id); renderRelicList();
    };
    box.appendChild(d);
  });
}
function ensureRelicUI(){
  if(document.getElementById('overlay-relic')) return;
  var ov=document.createElement('div'); ov.id='overlay-relic'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🏺 유물</h2><p class="rsub">승리로 해금 — 한 번에 하나만 착용</p><div id="relic-list"></div><button id="btn-relic-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-relic-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-relic'; b.textContent='🏺 유물';
      b.onclick=function(){ renderRelicList(); ov.classList.remove('hidden'); };
      var hof=document.getElementById('btn-hof'); if(hof&&hof.parentNode===ta) ta.insertBefore(b,hof); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,50);
  };
  setTimeout(tick,50);
}
try{ ensureRelicUI(); ensureSkillUI(); ensureProfileUI(); }catch(e){}

/* v110 SPR.boss 등록(선언 완료 후) */
try{ if(!SPR.boss&&ART.boss){ SPR.boss=new Image(); SPR.boss.src=ART.boss; ASPR.boss=SPR.boss; } }catch(e){}



'use strict';
function ensureSkillUI(){
  if(document.getElementById('overlay-skill')) return;
  if(!document.getElementById('sk-style')){ var st2=document.createElement('style'); st2.id='sk-style';
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left} .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:82vh;overflow-y:auto}';
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">승리 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-skill-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rs=document.getElementById('btn-skill-reset'); if(rs) rs.onclick=function(){ resetSkills(); renderSkillList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-skill'; b.textContent='🎓 전술 연구소';
      b.onclick=function(){ renderSkillList(); ov.classList.remove('hidden'); };
      var rel=document.getElementById('btn-relic'); if(rel&&rel.parentNode===ta) ta.insertBefore(b,rel); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
}
function renderSkillList(){
  var box=document.getElementById('sk-grid'); if(!box) return;
  var st=spState(); var sp=document.getElementById('sk-sp');
  if(sp) sp.textContent='보유 SP: '+st.sp+' · 누적 획득: '+st.total;
  box.innerHTML='';
  ['⚔️','🛡️','🧪'].forEach(function(c){
    var colDiv=document.createElement('div'); colDiv.className='sk-col';
    SKILLS.filter(function(s){ return s.col===c; }).forEach(function(d){
      var lv=skillLv(d.id);
      var locked=false;
      if(d.tier===2&&skillLv(colSkill(d.col,1).id)<2) locked=true;
      if(d.tier===3&&skillLv(colSkill(d.col,2).id)<2) locked=true;
      var item=document.createElement('div'); item.className='sk-item t'+d.tier;
      item.innerHTML='<b>'+d.col+' '+d.name+'</b><small>'+d.desc+'</small><span class="sk-lv">Lv '+lv+'/3</span>';
      var minus=document.createElement('button'); minus.textContent='−'; minus.disabled=lv<=0;
      minus.onclick=function(){ refundSkill(d.id); renderSkillList(); };
      var plus=document.createElement('button'); plus.textContent='+'; plus.disabled=(locked||!canBuySkill(d.id));
      plus.title=locked?'하위 티어 Lv 2 필요':'';
      plus.onclick=function(){ buySkill(d.id); renderSkillList(); };
      item.appendChild(plus); item.appendChild(minus);
      colDiv.appendChild(item);
    });
    box.appendChild(colDiv);
  });
}
function repairTower(){
  if(S.over||S.repCd>0) return false;
  const dmg=towers.filter(t=>t.team==='blue'&&!t.dead&&t.hp<t.maxHp-1);
  if(!dmg.length) return false;
  var __rc=(S._sk&&S._sk.def2)?2:3; if(P.elixir<__rc){ toast('엘릭서 부족 — 수리는 '+__rc+' 필요'); return false; }   // v119: 수리 조직 스킬 — 비용 −1
  const t=dmg.slice().sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
  P.elixir-=__rc; S.repCd=5;
  const amt=Math.min(t.maxHp-t.hp, Math.round(t.maxHp*0.25));
  t.hp+=amt;
  fx.push({x:t.x,y:t.y,t:0,dur:0.8,kind:'ring',col:'rgba(111,208,140,.9)'});
  fx.push({x:t.x,y:t.y,t:0,dur:0.7,kind:'poof'});
  floats.push({x:t.x,y:t.y-1.1,txt:'+'+amt,t:0.9,col:'#8fe6a8',big:false});
  sfx('cast'); toast('🔨 타워 수리 +'+amt);
  try{ syncHUD(); }catch(e){}
  return true;
}
function ensureRepairBtn(){
  var b=document.getElementById('repair-btn'); if(b) return b;
  b=document.createElement('button'); b.id='repair-btn'; b.className='hidden';
  b.innerHTML='<i class="rfill"></i><span class="rt">🔨 수리 3</span>';
  b.onclick=function(){ ensureAudio(); repairTower(); };
  var aw=document.getElementById('arena-wrap'); if(aw) aw.appendChild(b); return b;
}
function syncRepairBtn(){
  var b=document.getElementById('repair-btn')||ensureRepairBtn(); if(!b) return;
  var st=repairBtnState();
  b.classList.toggle('hidden',st==='hidden');
  if(st==='hidden') return;
  var f=b.querySelector('.rfill'), lb=b.querySelector('.rt');
  if(st==='cd'){
    b.classList.add('cd');
    if(f) f.style.width=(S.repCd/5*100)+'%';
    var tx='🔨 '+Math.ceil(S.repCd)+'s';
    if(b.__t!==tx){ lb.textContent=tx; b.__t=tx; }
  } else {
    b.classList.remove('cd');
    if(f&&b.__t!=='ready') f.style.width='0%';
    if(b.__t!=='ready'){ lb.textContent='🔨 수리 3'; b.__t='ready'; }
    b.style.opacity=P.elixir<3?'.55':'1';
  }
}


/* ---------- v109 #13: 유물 4종(영구 계승) ---------- */
var RELICS_LEGACY=[
  {id:'relic_atk',icon:'⚔️',name:'전투 문장',desc:'아군 유닛의 피해 +10%',need:1},
  {id:'relic_tower',icon:'🛡️',name:'수호 문장',desc:'아군 타워 최대 체력 +10%',need:3},
  {id:'relic_spell',icon:'✨',name:'마력 봉인구',desc:'주문 피해 +25%',need:5},
  {id:'relic_gold',icon:'💰',name:'황금 엘릭서 통',desc:'엘릭서 재생 +10%',need:7}
];
function spellDmg(d){ d=Math.round(d*(1+0.10*((S._sk&&S._sk.mag2)||0))); return (S&&S.relic==='relic_spell')?Math.round(d*1.25):d; }   // v119: 스킬트리 광역 술영 — 주문 피해 +10%
function relicWins(){ try{ return Math.max(0,parseInt(localStorage.getItem('ra_wins_v1')||'0',10)||0); }catch(e){ return 0; } }
function loadRelicEquip(){ try{ return localStorage.getItem('ra_relic_v1')||''; }catch(e){ return ''; } }
function saveRelicEquip(id){ try{ if(id) localStorage.setItem('ra_relic_v1',id); else localStorage.removeItem('ra_relic_v1'); }catch(e){} }
function applyRelics(){
  if(S.relic!=='relic_tower') return;
  for(const t of towers){ if(t.team==='blue'&&!t.__rl){ t.__rl=1; t.maxHp=Math.round(t.maxHp*1.1); t.hp=Math.min(t.maxHp,Math.round(t.hp*1.1)); } }
}
function castSpell(key,team,x,y){ var __pn=projs.length; castSpellBase(key,team,x,y); try{ if(team==='blue'&&S.relic==='relic_spell'&&projs.length>__pn){ for(var __i=__pn;__i<projs.length;__i++){ if(projs[__i]&&projs[__i].dmg) projs[__i].dmg=Math.round(projs[__i].dmg*1.25); } } }catch(e){} }
function renderRelicList(){
  var box=document.getElementById('relic-list'); if(!box) return;
  var wins=relicWins(), eq=loadRelicEquip(); box.innerHTML='';
  RELICS.forEach(function(r){
    var d=document.createElement('div'); d.className='rli'+(eq===r.id?' on':'')+((wins<r.need)?' lock':'');
    d.innerHTML='<span class="ricon">'+r.icon+'</span><span class="rmeta"><b>'+r.name+'</b><small>'+r.desc+'</small></span>'
      +(wins<r.need?'<span class="rbadge lk">🔒 '+r.need+'승</span>':(eq===r.id?'<span class="rbadge eq">착용 중</span>':'<span class="rbadge">착용</span>'));
    d.onclick=function(){
      if(wins<r.need){ toast(r.need+'승 달성 시 해금됩니다'); return; }
      saveRelicEquip(eq===r.id?'':r.id); renderRelicList();
    };
    box.appendChild(d);
  });
}
function ensureRelicUI(){
  if(document.getElementById('overlay-relic')) return;
  var ov=document.createElement('div'); ov.id='overlay-relic'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🏺 유물</h2><p class="rsub">승리로 해금 — 한 번에 하나만 착용</p><div id="relic-list"></div><button id="btn-relic-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-relic-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-relic'; b.textContent='🏺 유물';
      b.onclick=function(){ renderRelicList(); ov.classList.remove('hidden'); };
      var hof=document.getElementById('btn-hof'); if(hof&&hof.parentNode===ta) ta.insertBefore(b,hof); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,50);
  };
  setTimeout(tick,50);
}
try{ ensureRelicUI(); ensureSkillUI(); ensureProfileUI(); }catch(e){}

/* v110 SPR.boss 등록(선언 완료 후) */
try{ if(!SPR.boss&&ART.boss){ SPR.boss=new Image(); SPR.boss.src=ART.boss; ASPR.boss=SPR.boss; } }catch(e){}






































/* 서비스 워커 등록 — 오프라인 실행 지원 */
if('serviceWorker' in navigator){
  addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}

/* v34: 신규 6종 아트 오버라이드(3D 프롬프트 가이드 스타일) — 기존 정의를 재선언하지 않고 내용만 교체 */
(function(){
  var __nc={valk:"assets/img_252.jpg",bomber:"assets/img_253.jpg",babyd:"assets/img_254.jpg",cleric:"assets/img_255.jpg",boar:"assets/img_256.jpg",icem:"assets/img_257.jpg"};
  for(var __k in __nc){ ART[__k]=__nc[__k]; }
  var __ns={valk:"assets/img_258.png",bomber:"assets/img_259.png",babyd:"assets/img_260.png",cleric:"assets/img_261.png",boar:"assets/img_262.png",icem:"assets/img_263.png"};
  for(var __k in __ns){ var __im=new Image(); __im.src=__ns[__k]; SPR[__k]=__im; }
  window.addEventListener('load',function(){
    setTimeout(function(){
      var nk=['valk','bomber','babyd','cleric','boar','icem'];
      var imgs=document.querySelectorAll('#codex .art');
      for(var i=12;i<18;i++){ if(imgs[i]&&__nc[nk[i-12]]) imgs[i].src=__nc[nk[i-12]]; }
    },300);
  });
})();

/* v46: 이미지 픽셀 사전검증 — decode는 되지만 빈 픽셀인 이미지를 잡아 절차적 폴백 강제 */
(function(){
  function validate(im){
    try{
      if(!im||!im.complete||!im.naturalWidth) return null;
      var c=document.createElement('canvas');
      c.width=im.naturalWidth; c.height=im.naturalHeight;
      var g=c.getContext('2d'); g.drawImage(im,0,0);
      var d=g.getImageData(0,0,c.width,c.height).data, n=0;
      for(var i=3;i<d.length;i+=40){ if(d[i]>8) n++; }
      if(n<40) return null;
      c.complete=true; c.naturalWidth=c.width; c.naturalHeight=c.height; c.__valid=true;
      return c;
    }catch(e){ return null; }
  }
  var maps=[];
  try{ maps.push(TSPR); }catch(e){}
  try{ maps.push(SPR); }catch(e){}
  var t0=Date.now();
  var iv=setInterval(function(){
    var pending=false;
    maps.forEach(function(map){
      for(var k in map){
        var im=map[k];
        if(!im||im.__v!==undefined) continue;
        var c=validate(im);
        if(c){ map[k]=c; im.__v=1; }
        else if(im.complete&&im.naturalWidth){ im.__v=2; im.__valid=false; }
        else pending=true;
      }
    });
    if(!pending||Date.now()-t0>8000) clearInterval(iv);
  },300);
})();

/* v59: 박격포 캐논 스프라이트(수직 포신·소형) — SPR.cannon 주입 */
(function(){ var __c="assets/img_264.png"; var __im=new Image(); __im.src=__c; if(typeof SPR!=='undefined') SPR.cannon=__im; })();
