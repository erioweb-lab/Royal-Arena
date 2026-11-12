/* g10-techtree.js — v476: 전술 연구소 테크트리 개편 · 유물 8종 확장 · 연구소/유물/도움말 모달 수복.
   마지막 로드 청크 — 함수 선언 오버라이드로 런타임 승자가 된다. SKILLS/RELICS const는 건드리지 않고
   본 청크의 TECHS/RELICS8 데이터 + 오버라이드 함수만 사용한다. */
(function(){
'use strict';

/* ---------- 테크트리 데이터 (3계통 × T1/T2선택/T3 = 12노드) ---------- */
var TECHS=[
 {id:'off1', br:'off',tier:1,name:'돌격 서막',  desc:'아군 유닛 공격력 +8%'},
 {id:'off2', br:'off',tier:2,name:'집중 포화',  desc:'아군 유닛 공격력 추가 +6%'},
 {id:'off2b',br:'off',tier:2,name:'공성 술책',  desc:'대(對)타워 피해 +7%'},
 {id:'off3', br:'off',tier:3,name:'왕실 총공세',desc:'아군 유닛 공격력 추가 +12%'},
 {id:'def1', br:'def',tier:1,name:'굳건한 방벽',desc:'아군 타워 체력 +10%'},
 {id:'def2', br:'def',tier:2,name:'수리 조직',  desc:'수리 엘릭서 비용 −1'},
 {id:'def2b',br:'def',tier:2,name:'성벽 보수',  desc:'수리량 +10%·쿨던 −1초'},
 {id:'def3', br:'def',tier:3,name:'왕실 결계',  desc:'아군 타워 체력 추가 +10%'},
 {id:'mag1', br:'mag',tier:1,name:'신속 채취',  desc:'엘릭서 회복 +6%'},
 {id:'mag2', br:'mag',tier:2,name:'광역 주문',  desc:'주문 피해 +10%'},
 {id:'mag2b',br:'mag',tier:2,name:'원소 침투',  desc:'상태이상 적 피해 +8%'},
 {id:'mag3', br:'mag',tier:3,name:'마나 급류',  desc:'엘릭서 회복 추가 +6%'}];
var BRANCH={
 off:{nm:'공세',col:'#ff8a7a',hd:'off3'},
 def:{nm:'방어',col:'#7ab8ff',hd:'def3'},
 mag:{nm:'비전',col:'#c77dff',hd:'mag2'}};
var ICONS={off1:'ra_tk_off1',off2:'ra_tk_off2',off2b:'ra_tk_off2b',off3:'ra_tk_off3',
 def1:'ra_tk_def1',def2:'ra_tk_def2',def2b:'ra_tk_def2b',def3:'ra_tk_def3',
 mag1:'ra_tk_mag1',mag2:'ra_tk_mag2',mag2b:'ra_tk_mag2b',mag3:'ra_tk_mag3'};
function tech(id){ for(var i=0;i<TECHS.length;i++) if(TECHS[i].id===id) return TECHS[i]; return null; }
function t2sib(d){ return d.id===d.br+'2' ? d.br+'2b' : d.br+'2'; }
function icoSrc(name){ return 'assets/'+name+'.png?v=476'; }

/* ---------- 획득/환불 규칙 (T2 선택형·연쇄 환불) ---------- */
window.canBuySkill=function(id){
  var d=tech(id); if(!d) return false;
  if(skillLv(id)>=3) return false; if(spState().sp<1) return false;
  if(d.tier===2){ if(skillLv(d.br+'1')<2) return false; if(skillLv(t2sib(d))>0) return false; }
  if(d.tier===3){ if(Math.max(skillLv(d.br+'2'),skillLv(d.br+'2b'))<2) return false; }
  return true; };
window.buySkill=function(id){
  if(!canBuySkill(id)) return false;
  var st=spState(); st.sp-=1; var o=skillsObj(); o[id]=(o[id]||0)+1; skillsSave(o); spSave(st); return true; };
window.refundSkill=function(id){
  var d=tech(id); var lv=skillLv(id); if(!d||lv<=0) return false;
  var back=lv; var o=skillsObj(); o[id]=0;
  TECHS.forEach(function(t){
    if(t.br!==d.br) return;
    if(d.tier===1&&t.tier>1&&skillLv(t.id)>0){ back+=skillLv(t.id); o[t.id]=0; }      /* T1 환불 → 계통 전체 연쇄 */
    if(d.tier===2&&t.tier===3&&skillLv(t.id)>0){ back+=skillLv(t.id); o[t.id]=0; }    /* T2 환불 → T3 연쇄 */
  });
  var st=spState(); st.sp+=back; skillsSave(o); spSave(st); return true; };

/* ---------- 경기 시작 적용 (타워 체력 + 개전 나팔) ---------- */
window.applySkills=function(){
  try{
    var keys=['off1','off2','off2b','off3','def1','def2','def2b','def3','mag1','mag2','mag2b','mag3'];
    var sk={}; keys.forEach(function(k){ sk[k]=skillLv(k); });
    S._sk=sk;
    var hb=1+0.10*skillLv('def1')+0.10*skillLv('def3');
    for(var i=0;i<towers.length;i++){ var t=towers[i]; if(t.team==='blue'){ t.maxHp=Math.round(t.maxHp*hb); t.hp=t.maxHp; } }
    if(S.relic==='relic_ante'){ P.elixir=Math.min(ELX_MAX,P.elixir+2); try{ syncHUD(); }catch(e2){} }   /* v476: 개전의 나팔 */
  }catch(e){}
};

/* ---------- 피해 래퍼 (공성 술책·원소 침투·철벽 인장) ---------- */
var __dd0=window.dealDamage;
if(typeof __dd0==='function'){ window.dealDamage=function(e,dmg,fromTeam,fromSpell){
  try{
    if(fromTeam==='blue'&&e){
      var sk=S._sk||{};
      if(e.isTower&&!fromSpell&&(sk.off2b||0)>0) dmg=Math.round(dmg*(1+0.07*sk.off2b));                     /* 공성 술책 */
      if(!e.isTower&&(e.slowT>0||e.stun>0||e.frozenT>0||e.burnT>0)&&(sk.mag2b||0)>0) dmg=Math.round(dmg*(1+0.08*sk.mag2b)); /* 원소 침투 */
    }
    if(fromTeam==='red'&&e&&e.team==='blue'&&!e.isTower&&S.relic==='relic_guard') dmg=Math.round(dmg*0.92);  /* 철벽 인장 */
  }catch(err){}
  return __dd0(e,dmg,fromTeam,fromSpell); }; }

/* ---------- 수리 오버라이드 (수리 조직·성벽 보수·기계공의 망치) ---------- */
window.repairTower=function(){
  if(S.over||S.repCd>0) return false;
  const dmg=towers.filter(t=>t.team==='blue'&&!t.dead&&t.hp<t.maxHp-1);
  if(!dmg.length) return false;
  var sk=S._sk||{};
  var __rc=(sk.def2?2:3); if(P.elixir<__rc){ toast('엘릭서 부족 — 수리는 '+__rc+' 필요'); return false; }
  const t=dmg.slice().sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
  P.elixir-=__rc; S.repCd=Math.max(1,(sk.def2b?4:5)-(S.relic==='relic_repair'?2:0));
  var __mul=(1+0.10*(sk.def2b||0))*(S.relic==='relic_repair'?1.15:1);
  const amt=Math.min(t.maxHp-t.hp, Math.round(t.maxHp*0.25*__mul));
  t.hp+=amt;
  fx.push({x:t.x,y:t.y,t:0,dur:0.8,kind:'ring',col:'rgba(111,208,140,.9)'});
  fx.push({x:t.x,y:t.y,t:0,dur:0.7,kind:'poof'});
  floats.push({x:t.x,y:t.y-1.1,txt:'+'+amt,t:0.9,col:'#8fe6a8',big:false});
  sfx('cast'); toast('🔨 타워 수리 +'+amt);
  try{ syncHUD(); }catch(e){}
  return true; };

/* ---------- 전술 연구소 UI (테크트리) ---------- */
function injectCss(){
  if(document.getElementById('tt-style')) return;
  var st=document.createElement('style'); st.id='tt-style';
  st.textContent=
   '.hico{width:20px;height:20px;vertical-align:-4px;margin-right:5px;border-radius:5px;box-shadow:0 0 0 1px rgba(255,179,0,.35)}'+
   '#overlay-skill .rpanel,#overlay-relic .rpanel{max-height:88dvh;padding-bottom:64px;overflow-y:auto}' /* v476: verchip 여백 — 하단 잘림 수복 */+
   '#sk-grid{display:flex;gap:8px;justify-content:center;flex-wrap:nowrap;max-width:660px;margin:10px auto 0}'+
   '.tk-col{flex:1;min-width:110px;display:flex;flex-direction:column;gap:0;position:relative}'+
   '.tk-head{display:flex;align-items:center;gap:6px;font-weight:800;font-size:13px;margin-bottom:6px;letter-spacing:1px}'+
   '.tk-head img{width:22px;height:22px;border-radius:6px}'+
   '.tk-link{width:2px;height:10px;background:rgba(255,179,0,.4);margin:0 auto}'+
   '.tk-row{display:flex;gap:6px}'+
   '.tk-item{position:relative;background:rgba(18,24,43,.92);border:1.5px solid #3d4c73;border-radius:12px;padding:7px 6px 7px 8px;color:#dfe8ff;text-align:left;font-size:12px;flex:1;transition:box-shadow .15s,border-color .15s}'+
   '.tk-item .tk-ic{width:32px;height:32px;border-radius:8px;display:block;margin-bottom:4px}'+
   '.tk-item b{font-size:12.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
   '.tk-item small{display:block;color:#9fb0d0;font-size:10.5px;margin:2px 0 4px;line-height:1.3;min-height:26px}'+
   '.tk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:11px}'+
   '.tk-item button{width:25px;height:25px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.95);color:#FFD54F;font-weight:800;cursor:pointer;font-size:14px;line-height:1}'+
   '.tk-item button:disabled{opacity:.3;cursor:default}'+
   '.tk-item button.tk-minus{border-color:#7f8fbb;color:#9fb0d0}'+
   '.tk-btns{display:flex;align-items:center;justify-content:space-between;margin-top:2px}.tk-item.on{border-color:#FFB300;box-shadow:0 0 8px rgba(255,179,0,.25)}'+
   '.tk-item.max{border-color:#ffd75e;box-shadow:0 0 12px rgba(255,215,94,.45)}'+
   '.tk-item.lock{opacity:.55;filter:saturate(.4)}'+
   '.tk-item.t1{border-color:#8a97bd}.tk-item.t3{border-color:#c77dff}'+
   '.tk-choice::after{content:"";position:absolute;top:-7px;left:50%;width:2px;height:7px;background:rgba(255,179,0,.4)}'+
   '#sk-sp{display:flex;align-items:center;justify-content:center;gap:8px;color:#FFD54F;font-weight:700;margin:4px 0 8px;font-size:14px}'+
   '#sk-sp img{width:20px;height:20px;border-radius:50%}'+
   '#sk-sp .sk-sub{color:#9fb0d0;font-weight:400;font-size:11.5px}'+
   '.sk-foot{position:sticky;bottom:0;display:flex;gap:10px;justify-content:center;margin-top:12px;padding:8px 0 48px;background:linear-gradient(rgba(10,14,26,0),rgba(10,14,26,.9) 30%,#0a0e1a)}'+
   '.sk-foot button{padding:9px 18px;border-radius:12px;font-weight:700;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);cursor:pointer;font-size:13px}'+
   '#btn-skill-reset{border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d}'+
   '#btn-skill-close{border:1.5px solid #FFB300;background:rgba(18,24,43,.85);color:#FFD54F}'+
   /* 유물 카드 */
   '#relic-list{display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:560px;margin:10px auto}'+
   '.rli{display:flex;align-items:center;gap:9px;padding:9px 10px;border:1.5px solid #3d4c73;border-radius:12px;background:rgba(18,24,43,.8);cursor:pointer;transition:border-color .15s,box-shadow .15s}'+
   '.rli.on{border-color:#FFB300;box-shadow:0 0 10px rgba(255,179,0,.3)}'+
   '.rli.lock{opacity:.55;filter:saturate(.4)}'+
   '.rli .ricon{width:40px;height:40px;border-radius:9px;flex:0 0 40px}'+
   '.rli .rmeta{flex:1;min-width:0}'+
   '.rli .rmeta b{font-size:12.5px;display:block}'+
   '.rli .rmeta small{color:#9fb0d0;font-size:10.5px;line-height:1.3;display:block}'+
   '.rli .rbadge{font-size:10.5px;padding:4px 8px;border-radius:9px;border:1px solid #7f8fbb;color:#9fb0d0;white-space:nowrap}'+
   '.rli .rbadge.eq{border-color:#FFB300;color:#FFD54F;font-weight:700}'+
   '.rli .rbadge.lk{border-color:#e64545;color:#ff9d9d}'+
   '@media (max-width:390px){#relic-list{grid-template-columns:1fr}}';
  document.head.appendChild(st);
}

function node(d){
  var lv=skillLv(d.id), locked=false;
  if(d.tier===2&&(skillLv(d.br+'1')<2||skillLv(t2sib(d))>0)) locked=true;
  if(d.tier===3&&Math.max(skillLv(d.br+'2'),skillLv(d.br+'2b'))<2) locked=true;
  var el=document.createElement('div');
  el.className='tk-item t'+d.tier+(lv>=3?' max':lv>0?' on':'')+(locked?' lock':'')+(d.tier===2?' tk-choice':'');
  el.innerHTML='<img class="tk-ic" src="'+icoSrc(ICONS[d.id])+'" alt=""><b>'+d.name+'</b><small>'+d.desc+'</small>';
  var btns=document.createElement('div'); btns.className='tk-btns';
  btns.innerHTML='<span class="sk-lv">Lv '+lv+'/3</span>';
  if(locked) el.title='T1 Lv2 필요'+(skillLv(t2sib(d))>0?' · 반대 경로 이미 선택':'');
  var minus=document.createElement('button'); minus.className='tk-minus'; minus.textContent='−'; minus.disabled=lv<=0;
  minus.onclick=function(){ refundSkill(d.id); renderSkillList(); };
  var plus=document.createElement('button'); plus.textContent='+'; plus.disabled=(locked||!canBuySkill(d.id));
  plus.onclick=function(){ buySkill(d.id); renderSkillList(); };
  btns.appendChild(minus); btns.appendChild(plus); el.appendChild(btns);
  return el;
}

window.renderSkillList=function(){
  var box=document.getElementById('sk-grid'); if(!box) return;
  var st=spState(); var sp=document.getElementById('sk-sp');
  if(sp) sp.innerHTML='<img src="'+icoSrc('ra_rl_ui_gem')+'" alt="SP">보유 SP <b>'+st.sp+'</b><span class="sk-sub">누적 획득 '+st.total+'</span>';
  box.innerHTML='';
  ['off','def','mag'].forEach(function(br){
    var B=BRANCH[br];
    var col=document.createElement('div'); col.className='tk-col';
    var hd=document.createElement('div'); hd.className='tk-head'; hd.style.color=B.col;
    hd.innerHTML='<img src="'+icoSrc('ra_tk_'+B.hd)+'" alt="">'+B.nm;
    col.appendChild(hd);
    col.appendChild(node(tech(br+'1')));
    var lk=document.createElement('div'); lk.className='tk-link'; col.appendChild(lk);
    var row=document.createElement('div'); row.className='tk-row';
    row.appendChild(node(tech(br+'2'))); row.appendChild(node(tech(br+'2b')));
    col.appendChild(row);
    var lk2=document.createElement('div'); lk2.className='tk-link'; col.appendChild(lk2);
    col.appendChild(node(tech(br+'3')));
    box.appendChild(col);
  });
};

window.ensureSkillUI=function(){
  injectCss();
  var old=document.getElementById('overlay-skill'); if(old) old.remove();   /* v476: 구버전 UI 교체 — 조기리턴 폐기 */
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2><img class="hico" src="'+icoSrc('ra_rl_ui_lab')+'" alt="">전술 연구소</h2>'
    +'<p class="rsub">승리 보상 SP로 기술 연구 — 티어 2는 두 기술 중 하나를 선택(경로 확정) · 연쇄 환불 · 총 SP 보존</p>'
    +'<div id="sk-sp"></div><div id="sk-grid"></div>'
    +'<div class="sk-foot"><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-skill-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rs=document.getElementById('btn-skill-reset'); if(rs) rs.onclick=function(){ resetSkills(); renderSkillList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.getElementById('btn-skill')||document.createElement('button');
      b.id='btn-skill'; b.innerHTML='<img class="hico" src="'+icoSrc('ra_rl_ui_lab')+'" alt="">전술 연구소';
      b.onclick=function(){ renderSkillList(); ov.classList.remove('hidden'); };
      if(b.parentNode!==ta){ var rel=document.getElementById('btn-relic'); if(rel&&rel.parentNode===ta) ta.insertBefore(b,rel); else ta.appendChild(b); }
      return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
};

/* ---------- 유물 8종 ---------- */
var RELICS8=[
 {id:'relic_atk',   icon:'ra_rl_relic_atk',   name:'전투 문장',      desc:'아군 유닛의 피해 +10%',need:1},
 {id:'relic_guard', icon:'ra_rl_relic_guard', name:'철벽 인장',      desc:'아군 유닛이 받는 피해 −8%',need:2},
 {id:'relic_tower', icon:'ra_rl_relic_tower', name:'수호 문장',      desc:'아군 타워 최대 체력 +10%',need:3},
 {id:'relic_speed', icon:'ra_rl_relic_speed', name:'바람 깃털',      desc:'아군 유닛 이동속도 +6%',need:4},
 {id:'relic_spell', icon:'ra_rl_relic_spell', name:'마력 봉인구',    desc:'주문 피해 +25%',need:5},
 {id:'relic_repair',icon:'ra_rl_relic_repair',name:'기계공의 망치',  desc:'수리 쿨던 −2초 · 수리량 +15%',need:6},
 {id:'relic_gold',  icon:'ra_rl_relic_gold',  name:'황금 엘릭서 통', desc:'엘릭서 재생 +10%',need:7},
 {id:'relic_ante',  icon:'ra_rl_relic_ante',  name:'개전의 나팔',    desc:'경기 시작 엘릭서 +2',need:9}];

window.renderRelicList=function(){
  var box=document.getElementById('relic-list'); if(!box) return;
  var wins=relicWins(), eq=loadRelicEquip(); box.innerHTML='';
  RELICS8.forEach(function(r){
    var d=document.createElement('div'); d.className='rli'+(eq===r.id?' on':'')+((wins<r.need)?' lock':'');
    d.innerHTML='<img class="ricon" src="'+icoSrc(r.icon)+'" alt="">'
      +'<span class="rmeta"><b>'+r.name+'</b><small>'+r.desc+'</small></span>'
      +(wins<r.need?'<span class="rbadge lk">'+r.need+'승</span>':(eq===r.id?'<span class="rbadge eq">착용 중</span>':'<span class="rbadge">착용</span>'));
    d.onclick=function(){
      if(wins<r.need){ toast(r.need+'승 달성 시 해금됩니다'); return; }
      saveRelicEquip(eq===r.id?'':r.id); renderRelicList(); };
    box.appendChild(d);
  });
};

window.ensureRelicUI=function(){
  injectCss();
  var old=document.getElementById('overlay-relic'); if(old) old.remove();
  var ov=document.createElement('div'); ov.id='overlay-relic'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2><img class="hico" src="'+icoSrc('ra_rl_relic_atk')+'" alt="">유물</h2>'
    +'<p class="rsub">승리로 해금 — 한 번에 하나만 착용</p><div id="relic-list"></div>'
    +'<div class="sk-foot"><button id="btn-relic-close" style="border:1.5px solid #FFB300;background:rgba(18,24,43,.85);color:#FFD54F;border-radius:12px">닫기</button></div></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-relic-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.getElementById('btn-relic')||document.createElement('button');
      b.id='btn-relic'; b.innerHTML='<img class="hico" src="'+icoSrc('ra_rl_relic_atk')+'" alt="">유물';
      b.onclick=function(){ renderRelicList(); ov.classList.remove('hidden'); };
      if(b.parentNode!==ta){ var hof=document.getElementById('btn-hof'); if(hof&&hof.parentNode===ta) ta.insertBefore(b,hof); else ta.appendChild(b); }
      return; }
    if(++n<40) setTimeout(tick,50); };
  setTimeout(tick,50);
};

/* 재초기화 — 구버전 오버레이를 신버전으로 교체 */
try{ ensureRelicUI(); ensureSkillUI(); }catch(e){}
})();
