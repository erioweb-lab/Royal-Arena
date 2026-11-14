/* royal-arena v188 split — blocks [12,13,14,15,16,17,18,19,20] order-preserved */

'use strict';
const RART={win:"assets/img_238.png",lose:"assets/img_239.png"};
const SPR={};for(const kk in ART_SPR){const im=new Image();im.src=ART_SPR[kk];SPR[kk]=im;}
const TSPR={};for(const kk in ART_TOW){const im=new Image();im.src=ART_TOW[kk];TSPR[kk]=im;}


'use strict';
(function(){
  var __nc={valk:"assets/img_240.jpg",bomber:"assets/img_241.jpg",babyd:"assets/img_242.jpg",cleric:"assets/img_243.jpg",boar:"assets/img_244.jpg",icem:"assets/img_245.jpg"};
  for(var __k in __nc){ ART[__k]=__nc[__k]; }
  var __ns={valk:"assets/img_246.png",bomber:"assets/img_247.png",babyd:"assets/img_248.png",cleric:"assets/img_249.png",boar:"assets/img_250.png",icem:"assets/img_251.png"};
  for(var __k in __ns){ var __im=new Image(); __im.src=__ns[__k]; SPR[__k]=__im; }
  window.addEventListener('load',function(){
    setTimeout(function(){
      var nk=['valk','bomber','babyd','cleric','boar','icem'];
      var imgs=document.querySelectorAll('#codex .art');
      for(var i=12;i<18;i++){ if(imgs[i]&&__nc[nk[i-12]]) imgs[i].src=__nc[nk[i-12]]; }
    },300);
  });
})();
function drawBossHUD(){ /* v104: DOM HUD로 대체 — 캔버스 HUD 폐기 */ }

/* ---------- v104: DOM 보스 상태 HUD ---------- */
function ensureBossHud(){
  var w=document.getElementById('boss-hud'); if(w) return w;
  w=document.createElement('div'); w.id='boss-hud'; w.className='hidden';
  w.innerHTML='<div class="bh-top"><span class="bh-name">👹 부활한 왕</span></div>'
    +'<div class="bh-bar"><div class="bh-fill"></div><div class="bh-shield"></div><span class="bh-hp">0</span></div>'   /* v135: HP를 바 내부로 — 30% 축소 폭에서 이름줄 잘림 방지 */
    +'<div class="bh-doomrow"><span class="bh-doomlabel">파멸기</span><div class="bh-doomtrack"><span class="bh-doomfill"></span></div><span class="bh-doomtxt">12.0s</span></div>';
  var mb=document.createElement('button'); mb.className='bh-min'; mb.type='button'; mb.textContent='\u25BE'; mb.setAttribute('aria-label','보스 상태 배너 최소화/복원'); mb.addEventListener('click',function(ev){ ev.stopPropagation(); var mini=w.classList.toggle('mini'); mb.textContent=mini?'\u25B8':'\u25BE'; }); w.appendChild(mb);   /* v132: 보스 배너 최소화 토글 */
  var tb=document.getElementById('topbar'); if(tb){ tb.insertBefore(w, document.getElementById('btn-sound')); } else { var aw=document.getElementById('arena-wrap'); if(aw) aw.appendChild(w); } return w;
}   /* v133: 보스 배너를 상단바 중앙(시간·소리 사이)에 배치 */
function syncBossHud(){
  var b=S.boss, w=document.getElementById('boss-hud')||ensureBossHud(); if(!w) return;
  if(!b||b.dead){ if(!w.classList.contains('hidden')) w.classList.add('hidden'); return; }
  w.classList.remove('hidden');
  var hp=Math.max(0,Math.ceil(b.hp)), mx=b.maxHp||1;
  var f=w.querySelector('.bh-fill'); if(f&&w.__hp!==hp){ f.style.width=Math.max(0,Math.min(100,hp/mx*100))+'%'; w.__hp=hp; }
  var hpt=w.querySelector('.bh-hp'), htx=hp.toLocaleString()+' / '+mx.toLocaleString();
  if(hpt&&w.__htx!==htx){ hpt.textContent=htx; w.__htx=htx; }
  var sf=w.querySelector('.bh-shield'), sh=Math.max(0,Math.min(100,(b.shield||0)/900*100))|0;
  if(sf&&w.__sh!==sh){ sf.style.width=sh+'%'; w.__sh=sh; }
  var df=w.querySelector('.bh-doomfill'); if(df) df.style.width=Math.min(100,(b.doom||0)/12*100)+'%';
  var dm=Math.max(0,12-(b.doom||0)), dt2=w.querySelector('.bh-doomtxt');
  if(dt2&&w.__dm!==dm){ dt2.textContent=dm.toFixed(1)+'s'; w.__dm=dm; }
  var __bn=S.__bossName||'부활한 왕'; if(w.__bn!==__bn){ w.__bn=__bn; var __nel=w.querySelector('.bh-name'); if(!__nel){ __nel=document.createElement('div'); __nel.className='bh-name'; __nel.style.cssText='font-size:11px;font-weight:700;color:#ffd54f;text-align:center;line-height:1.3'; w.insertBefore(__nel,w.firstChild); } __nel.textContent='💀 '+__bn; }   /* v429: 보스 HUD 라벨에 맵별 보스명 표기 */
  w.classList.toggle('danger',(b.doom||0)>=9);
  var kb=document.getElementById('ks-btn');
  if(kb){ if(S.ksCd<=0&&!S.ks&&P.elixir>=3) kb.classList.add('ready'); else kb.classList.remove('ready'); }
}

/* ---------- v105 #11: 트로피·아레나 등급 ---------- */
const GRADES=[['훈련 캠프',0,'#9aa7b8'],['뼈 구덩이',100,'#cfe0ee'],['요정 계곡',200,'#6fd08c'],['마법 대굴',350,'#b07fe0'],['전설 성채',500,'#f7c531'],['왕관 극지',750,'#ff8a3c']];
function loadTrophies(){ try{ return Math.max(0,parseInt(localStorage.getItem('ra_trophies_v1')||'0',10)||0); }catch(e){ return 0; } }
function gradeOf(t){ let gi=0; for(let i=0;i<GRADES.length;i++) if(t>=GRADES[i][1]) gi=i; return gi; }
function applyTrophyDelta(w){
  const cur=loadTrophies();
  const d=(w==='blue')?30:(w==='red'?-20:10);
  const nv=Math.max(0,cur+d);
  try{ if(nv>cur&&typeof gradeOf==='function'&&typeof banner==='function'){ var __g0=gradeOf(cur), __g1=gradeOf(nv); if(__g1>__g0){ var __gn=(typeof GRADES!=='undefined'&&GRADES[__g1])?GRADES[__g1][0]:''; setTimeout(function(){ banner('👑 등급 상승! '+__gn,2400); try{ sfx('crown'); }catch(e){} },2600); } } }catch(e){}   /* v220: 등급 상승 배너 */
  try{ localStorage.setItem('ra_trophies_v1',String(nv)); }catch(e){}
  try{ var __h=JSON.parse(localStorage.getItem('ra_hist_v1')||'[]'); if(!Array.isArray(__h))__h=[]; __h.push(w==='blue'?'W':(w==='red'?'L':'D')); while(__h.length>5)__h.shift(); localStorage.setItem('ra_hist_v1',JSON.stringify(__h)); }catch(e){}
  try{ var __h30=JSON.parse(localStorage.getItem('ra_hist30_v1')||'[]'); if(!Array.isArray(__h30))__h30=[]; __h30.push(w==='blue'?'W':(w==='red'?'L':'D')); while(__h30.length>30)__h30.shift(); localStorage.setItem('ra_hist30_v1',JSON.stringify(__h30)); }catch(e){}   /* v296: 30전 이력 */
  try{ var __dfi=Math.max(0,Math.min(2,parseInt(localStorage.getItem('ra_diff_v1')||'0',10)||0)); var __sd=JSON.parse(localStorage.getItem('ra_stats_diff_v1')||'[]'); if(!Array.isArray(__sd)||__sd.length<3)__sd=[{w:0,l:0,d:0},{w:0,l:0,d:0},{w:0,l:0,d:0}]; if(w==='blue')__sd[__dfi].w++; else if(w==='red')__sd[__dfi].l++; else __sd[__dfi].d++; localStorage.setItem('ra_stats_diff_v1',JSON.stringify(__sd)); }catch(e){}   /* v296: 난이도별 전적 */   /* v143: 승패 이력 5전 저장 */
  if(w==='blue'){ try{ var __wv=parseInt(localStorage.getItem('ra_wins_v1')||'0',10)||0; localStorage.setItem('ra_wins_v1',String(__wv+1)); }catch(e){} }   // v109: 승수 기록 — 유물 해금 try{ profSync(); }catch(e){}   // v120: 트로피 갱신 프로필 미러
  try{ syncTrophyChip(); syncGradeVisual(); }catch(e){}
  return nv-cur;
}
/* v182: 타이틀 덱 선선택 — A/B 슬롯 카드 프리뷰, 탭하여 전투 시작 덱 지정(sig 변경 시에만 재렌더) */
window.__deckPick=function(){ try{
  var ta=document.getElementById('title-actions'); if(!ta) return;
  var box=document.getElementById('deck-pick');
  if(!box){ box=document.createElement('div'); box.id='deck-pick';
    box.style.cssText='display:flex;gap:10px;justify-content:center;width:100%;max-width:560px;margin:2px auto 0';
    ta.parentNode.insertBefore(box,ta); }
  var cur=activeSlot(); var d0=loadDeckSlot(0)||DECK, d1=loadDeckSlot(1)||DECK;
  var sig=cur+'|'+d0.join(',')+'|'+d1.join(','); if(window.__dpSig===sig) return; window.__dpSig=sig;   /* v233 */
  try{ if(box&&box.parentNode) box.parentNode.removeChild(box); }catch(e){}
  box=document.createElement('div'); box.id='deck-pick';
  box.style.cssText='display:flex;gap:10px;justify-content:center;width:100%;max-width:560px;margin:2px auto 0';
  ta.parentNode.insertBefore(box,ta);   /* v227: 덱 버튼 완전 재생성 — 기존 노드(ui-patch 인라인 스타일·가드 잔여 포함) 제거 후 신규 생성 */
  var html='';
  [d0,d1].forEach(function(dk,n){
    var avg=Math.round(dk.reduce(function(a,k){return a+(CARDS[k]?CARDS[k].cost||0:0);},0)/Math.max(1,dk.length)*10)/10;
    var on=(n===cur);
    html+='<button class="dkpick'+(on?' on':'')+'" data-slot="'+n+'" style="flex:1;cursor:pointer;background:'+(on?'linear-gradient(180deg,rgba(247,197,49,.22),rgba(13,22,40,.92))':'rgba(13,22,40,.78)')+';border:2px solid '+(on?'rgba(247,197,49,.95)':'rgba(120,140,180,.45)')+';border-radius:14px;padding:8px 6px;min-height:56px;text-align:center;box-shadow:'+(on?'0 0 14px rgba(247,197,49,.35)':'none')+'">'   /* v233 */
      +'<div style="font-family:Jua,sans-serif;font-size:14.5px;color:'+(on?'#ffe08a':'#cfd8ea')+'">'+(n===0?'🅰 덱 1':'🅱 덱 2')+(on?' · 선택됨':'')+'</div>'
      +'<div style="font-size:9.5px;color:#9fb0cc;margin-top:1px">평균 '+avg+'</div>'   /* v233: 설명은 선택 덱만 하단 단일 표시 */
      +'</button>';
  });
  box.innerHTML=html;
  Array.prototype.forEach.call(box.querySelectorAll('.dkpick'),function(b){
    b.onclick=function(){ try{ localStorage.setItem('ra_deck_active',b.getAttribute('data-slot')); }catch(e){} window.__deckPick(); };
  });
  var __dd=document.getElementById('deck-desc'); if(!__dd&&ta&&ta.parentNode){ __dd=document.createElement('div'); __dd.id='deck-desc'; ta.parentNode.insertBefore(__dd,ta); }
  if(__dd){ var dc=dk[cur]||d0; var av=Math.round(dc.reduce(function(a2,k){return a2+(CARDS[k]?CARDS[k].cost||0:0);},0)/Math.max(1,dc.length)*10)/10; __dd.textContent='선택: 덱 '+(cur+1)+' — 평균 '+av+' · '+dc.slice(0,6).map(function(k){return (CARDS[k]&&CARDS[k].name)||k;}).join('·'); }
}catch(e){} };   /* v233 */
window.__deckPick(); document.addEventListener('visibilitychange',function(){ try{ window.__deckPick(); }catch(e){} }); document.addEventListener('pointerdown',function(){ try{ window.__deckPick(); }catch(e){} },true); window.addEventListener('storage',function(e){ try{ if(!e||!e.key||e.key.indexOf('ra_deck')===0) window.__deckPick(); }catch(e2){} });   /* v224: 1.5s 블라인드 폴링 제거 — 재빌드×ui-patch 250ms 경합으로 '평균 엘릭서' 텍스트가 주기적으로 변조되는 현상 제거(실기기 증거). 이벤트 시점에만 갱신 */

/* v183: DH 리스킨 — 디펜스 히어로즈 레퍼런스(다크 네이비 패널·골드 텍스트·정상 자간·44px 터치) */
window.__navUp=function(){ try{
  if(!document.getElementById('ui-v183')){
    var st3=document.createElement('style'); st3.id='ui-v183';
    st3.textContent='#screen-title h1,#screen-title .t-logo{letter-spacing:1.5px!important}'
      +'.t-codex{grid-template-columns:repeat(4,1fr)!important;gap:10px!important}'
      +'.cx{min-height:96px!important;padding:8px 4px 10px!important}'
      +'.cx .art{width:48px!important;height:48px!important}.cx .e{font-size:30px!important}'
      +'.cx .n{font-size:12.5px!important}'
      +'@media(min-width:620px){.t-codex{grid-template-columns:repeat(6,1fr)!important}}'
      +'@media(min-width:1000px){.t-codex{grid-template-columns:repeat(9,1fr)!important;gap:6px!important}.cx{min-height:78px!important}.cx .art{width:34px!important;height:34px!important}.cx .n{font-size:11px!important}}'
      +'#deck-edit .dkc{color:#fbbf24!important;font-weight:800}'
      +'#deck-edit .dk-sub{background:linear-gradient(180deg,#1c2333,#141824)!important;border:1.5px solid #2a3550!important;color:#dfe8ff!important;border-radius:14px!important}'
      +'#deck-edit .dk{min-width:72px}'
      +'[id*="overlay"] button{min-height:44px;min-width:44px}'
      +'#overlay-skill .sk-item button{width:40px;height:40px;right:10px;border-radius:12px;font-size:18px}'
      +'#sk-legend{text-align:center;font-size:11.5px;color:#9fb0cc;margin:8px 0 0}'
      +'#sk-btnrow{display:flex;gap:10px;justify-content:center;margin-top:10px}';
    document.head.appendChild(st3);
  }
  var LAB=/덱 편성|명예의 전당|프로필|전술 연구소|유물|게임 방법/;
  document.querySelectorAll('#title-actions button, .t-links button').forEach(function(b){
    var t=(b.textContent||'').trim(); if(!LAB.test(t)) return;
    b.style.setProperty('border','1.5px solid #c89b3c','important') /* v365: 인라인 배경 제거 — CSS 화풍 텍스처 허용 */; /* v359: 골드 테두리 표준 — 이 인라인 important가 모든 CSS를 이기므로 출처에서 금색 고정(주기 재도색도 금색 유지) */
    b.style.setProperty('color','#fbbf24','important');
    var __pt=(b.textContent||'');
    if(/게임 방법/.test(__pt)){ b.style.removeProperty('background'); b.style.removeProperty('border'); } /* v361: 게임 방법 버튼도 인라인 남색 배경 제거 — CSS 문양 배경 적용 허용 */
    if(/덱 편성|유물|명예의 전당|프로필|전술 연구소/.test(__pt)){ b.style.removeProperty('background'); b.style.removeProperty('border'); b.style.removeProperty('color'); b.classList.add(__pt.indexOf('덱 편성')>=0?'nav-deck':__pt.indexOf('유물')>=0?'nav-relic':__pt.indexOf('명예의 전당')>=0?'nav-hof':__pt.indexOf('프로필')>=0?'nav-profile':'nav-skill'); }
    b.style.setProperty('border-radius','14px','important');
    b.style.setProperty('min-height','48px','important');
    b.style.setProperty('font-weight','700','important');
    b.style.setProperty('padding','10px 18px','important');
    b.style.setProperty('letter-spacing','0','important');
  });
  var de=document.getElementById('deck-edit');
  if(de){
    var pools=de.querySelectorAll('div[style*="flex-wrap"]');
    pools.forEach(function(p){ p.style.display='grid'; p.style.gridTemplateColumns='repeat(4,1fr)'; p.style.gap='8px'; p.style.width='100%'; p.style.maxWidth='560px'; });
    var cl=de.querySelector('.dk-sub'); if(cl){ cl.style.minHeight='46px'; }
  }
  var sk=document.getElementById('overlay-skill');
  if(sk){
    var lg=document.getElementById('sk-legend');
    if(!lg){ lg=document.createElement('div'); lg.id='sk-legend'; lg.textContent='테두리 등급 — 기본: 1티어 · 밝은 남색: 2티어 · 보라: 3티어(상위 해금)';
      var g2=document.getElementById('sk-grid'); if(g2&&g2.parentNode) g2.parentNode.insertBefore(lg,g2.nextSibling); }
    var rst=document.getElementById('btn-skill-reset'); var row=document.getElementById('sk-btnrow');
    if(rst&&!row){
      var cls=null; sk.querySelectorAll('button').forEach(function(b){ if(b!==rst&&/닫기/.test(b.textContent||'')) cls=b; });
      if(cls){ row=document.createElement('div'); row.id='sk-btnrow';
        rst.parentNode.insertBefore(row,rst); row.appendChild(rst); row.appendChild(cls);
        rst.style.width='auto'; rst.style.padding='10px 24px'; cls.style.padding='10px 24px';
        cls.style.background='linear-gradient(180deg,#1c2333,#141824)'; cls.style.border='1.5px solid #2a3550'; cls.style.color='#dfe8ff'; cls.style.borderRadius='12px';
        rst.style.borderRadius='12px'; }
    }
  }
}catch(e){} };
window.__navUp(); setInterval(function(){ try{ window.__navUp(); }catch(e){} },1200);

/* v185: 카드 레벨 시스템 — XP 3당 Lv+1(최대 5), Lv당 hp/dmg +4%(아군 전용), 도감 3D 레벨 뱃지, safe-area, 팝업 배타성 */
function __cXpMap(){ try{ return JSON.parse(localStorage.getItem('ra_cardxp_v1')||'{}'); }catch(e){ return {}; } }
function __cLv(k){ var m=__cXpMap(); return Math.min(7,1+Math.floor((m[k]||0)/3)); }   /* v296: 상한 7 */
window.__lvUp=function(){ try{
  if(!document.getElementById('ui-v185')){
    var st4=document.createElement('style'); st4.id='ui-v185';
    st4.textContent='.cx{position:relative!important} .lv3d{position:absolute;right:2px;bottom:-4px;z-index:2;font-size:9.5px;font-weight:800;color:#fff;padding:1px 5px;border-radius:8px;'
      +'background:linear-gradient(180deg,#3b4a6b,#1c2333);border:1px solid #64748b;box-shadow:0 2px 0 rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.25);text-shadow:0 1px 1px rgba(0,0,0,.7);pointer-events:none}'
      +'.lv3d.l2{border-color:#3b82f6}.lv3d.l3{border-color:#22c55e}.lv3d.l4{border-color:#f59e0b;box-shadow:0 2px 0 rgba(0,0,0,.55),0 0 8px rgba(245,158,11,.5),inset 0 1px 0 rgba(255,255,255,.25)}'
      +'.lv3d.l5{border-color:#f7c531;background:linear-gradient(180deg,#7c3aed,#1c2333);box-shadow:0 2px 0 rgba(0,0,0,.55),0 0 10px rgba(247,197,49,.65),inset 0 1px 0 rgba(255,255,255,.3)}'
      +'#card-bar,#handbar,#hand,#cardbar,#bottom-bar{padding-bottom:calc(8px + env(safe-area-inset-bottom,0px))!important}'
      +'#v185b-hold{display:none}'
      +'@media(max-width:420px){'
      +'#title-actions{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}'
      +'#title-actions button,.t-links button{min-height:44px!important;padding:8px 10px!important;font-size:13.5px!important;white-space:nowrap;flex:1 1 46%;box-sizing:border-box}'
      +'.t-theme{font-size:12.5px!important;padding:9px 6px!important;white-space:nowrap}'
      +'.t-links{display:flex;justify-content:center}'
      +'#deck-pick{flex-direction:column}'
      +'.dkpick{min-height:0!important;padding:6px 8px!important}'
      +'.dkpick>div:last-child{font-size:10.5px!important}'
      +'}';
    document.head.appendChild(st4);
  }
  var N2K=window.__N2K; if(!N2K){ N2K={}; for(var k in CARDS) N2K[CARDS[k].name]=k; window.__N2K=N2K; }
  var cx2=document.querySelectorAll('#codex .cx');
  cx2.forEach(function(cx){
    var nm=cx.querySelector('.n'); if(!nm) return; var key=N2K[(nm.textContent||'').trim()]; if(!key) return;
    var lv=__cLv(key); var b=cx.querySelector('.lv3d');
    if(!b){ b=document.createElement('div'); b.className='lv3d'; cx.appendChild(b); }
    var t='Lv'+lv; if(b.textContent!==t||b.__l!==lv){ b.textContent=t; b.__l=lv; b.className='lv3d'+(lv>1?' l'+lv:''); }
  });
  var vis=[].slice.call(document.querySelectorAll('[id^="overlay-"],#deck-edit')).filter(function(o){ return !o.classList.contains('hidden')&&getComputedStyle(o).display!=='none'; });
  if(vis.length>=2){
    var keep=vis[0], kz=parseInt(getComputedStyle(keep).zIndex)||0;
    vis.forEach(function(o){ var z=parseInt(getComputedStyle(o).zIndex)||0; if(z>kz){ kz=z; keep=o; } });
    vis.forEach(function(o){ if(o===keep) return;
      if(o.classList&&o.classList.contains('overlay')) o.classList.add('hidden');
      else if(o.id==='deck-edit') o.remove();
      else o.classList.add('hidden'); });
  }
}catch(e){} };
window.__lvUp(); setInterval(function(){ try{ window.__lvUp(); }catch(e){} },1500);
/* v186: 기기 판독 수복 — 카드명 글리프·내비 라벨 전체·Lv 뱃지 내부화·결과 모달 라벨/탭/총점·중앙 고정 */
(function(){ try{
  var st6=document.createElement('style'); st6.id='ui-v186';
  st6.textContent='#overlay-result.hidden{display:none!important}#overlay-result:not(.hidden){display:flex!important;align-items:center!important;justify-content:center!important;left:0!important;right:0!important;top:0!important;bottom:0!important;padding:20px!important;box-sizing:border-box!important}'
   +'#overlay-result .r-box{position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;margin:0 auto!important;transform:none!important;animation:none!important;max-width:92vw!important}'
   +'#overlay-result .rrow{gap:8px!important;align-items:center!important;justify-content:space-between!important}'
   +'#overlay-result .rrow span,#overlay-result .rrow b{white-space:nowrap!important;line-height:1.2!important}'
   +'#overlay-result .rsum{overflow:hidden!important}'
   +'#overlay-result .rtab{font-size:12px!important;padding:7px 5px!important;white-space:nowrap!important;overflow:hidden!important}'
   +'@media(max-width:480px){'
   +'#overlay-result .rrow{height:30px!important;flex-direction:row!important;display:flex!important}'
   +'#overlay-result .rrow span,#overlay-result .rrow b{font-size:12.5px!important}'
   +'#overlay-result .rtab{flex:1 1 0;font-size:11.5px!important}'
   +'#overlay-result #btn-again,#overlay-result #btn-home{white-space:nowrap!important;height:auto!important;font-size:15px!important}'
   +'#title-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:6px!important}'
   +'#title-actions button{white-space:normal!important;font-size:12.5px!important;padding:8px 6px!important}'
   +'.t-links button{font-size:12.5px!important;padding:8px 10px!important}'
   +'}';
  var ovR=document.getElementById('overlay-result');
  if(ovR){ ovR.classList.add('hidden'); if(ovR.parentElement&&ovR.parentElement!==document.body){ document.body.appendChild(ovR); } }document.head.appendChild(st6);
}catch(e){} })();

function syncTrophyChip(){
  const ta=document.getElementById('title-actions'); if(!ta) return;
  let c=document.getElementById('trophy-chip');
  if(!c){ c=document.createElement('span'); c.id='trophy-chip'; ta.insertBefore(c,ta.firstChild); }
  const t=loadTrophies(), gi=gradeOf(t);
  c.textContent='🏆 '+t.toLocaleString()+' · '+GRADES[gi][0];
  c.style.borderColor=GRADES[gi][1]; c.style.color=GRADES[gi][1];
}
function syncGradeVisual(){
  const aw=document.getElementById('arena-wrap'); if(!aw) return;
  const gi=gradeOf(loadTrophies());
  for(let i=0;i<GRADES.length;i++) aw.classList.toggle('g'+i, i===gi);
}
try{ syncTrophyChip(); }catch(e){}

/* ---------- v106 #12: 타워 수리 시스템 ---------- */
function repairBtnState(){
  if(S.over) return 'off';   // v124: 상시 버튼 — hidden 폐지
  const dmg=towers.some(t=>t.team==='blue'&&!t.dead&&t.hp<t.maxHp-1);
  if(!dmg) return 'off';
  return (S.repCd>0)?'cd':'ready';
}
/* ---------- v124: 상·하 바(동일 높이) + 전장 내부 상시 버튼 (참고 디자인 규격) ---------- */
function drawFrame(){
  try{
    ctx.setTransform(BSCALE,0,0,BSCALE,0,0);
    ctx.lineJoin='round';
    roundRect(4,4,VW-8,VH-8,14);   /* v387: 프레임=캔버스 가장자리 */ ctx.strokeStyle='rgba(4,8,16,.92)'; ctx.lineWidth=6; ctx.stroke();
    var g2=ctx.createLinearGradient(0,0,VW,VH); g2.addColorStop(0,'#f7c531'); g2.addColorStop(.55,'#d4af37'); g2.addColorStop(1,'#b8860b');
    roundRect(6.5,6.5,VW-13,VH-13,12); ctx.strokeStyle=g2; ctx.lineWidth=2.5; ctx.stroke();
    roundRect(10,10,VW-20,VH-20,10); ctx.strokeStyle='rgba(247,197,49,.32)'; ctx.lineWidth=1; ctx.stroke();
    var cl=26, cs=[[5,5,1,1],[VW-5,5,-1,1],[5,VH-5,1,-1],[VW-5,VH-5,-1,-1]];
    ctx.strokeStyle='#FFD54F'; ctx.lineWidth=4;
    for(var ci=0;ci<4;ci++){ var qx=cs[ci][0],qy=cs[ci][1],qsx=cs[ci][2],qsy=cs[ci][3];
      ctx.beginPath(); ctx.moveTo(qx,qy+qsy*cl); ctx.lineTo(qx,qy); ctx.lineTo(qx+qsx*cl,qy); ctx.stroke(); }
  }catch(e){}
}
function ensureCtlBar(){
  var hud=document.getElementById('hud'); if(!hud||document.getElementById('ctl-style')) return;
  var st=document.createElement('style'); st.id='ctl-style';
  st.textContent="#emote-bar{display:none !important}body.battle-on #topbar{display:flex !important;position:absolute !important;top:0;left:0;right:0;z-index:60;height:46px;box-sizing:border-box;padding:calc(4px + env(safe-area-inset-top)) 10px 4px !important;background:rgba(10,20,38,.66) !important;backdrop-filter:blur(3px);max-width:none !important;margin:0 !important;border-bottom:1px solid rgba(247,197,49,.4) !important}#screen-battle #zoom-chip{display:none !important}#screen-battle #cam-home-btn{width:30px !important;height:28px !important;min-width:0 !important;padding:0 !important;font-size:15px !important;display:flex;align-items:center;justify-content:center}#screen-battle #btn-sound{width:34px !important;height:28px !important;min-width:0 !important;padding:0 !important;font-size:15px !important;display:flex;align-items:center;justify-content:center}#screen-battle #btn-quit{height:28px !important;min-width:54px !important;font-size:12px !important;padding:0 8px !important;display:flex;align-items:center;justify-content:center}#screen-battle #timer{font-size:15px !important;min-width:58px !important;padding:2px 8px !important}#screen-battle .crown-chip{min-width:46px !important;font-size:13px !important}#arena-wrap{padding:0 2px !important}#ctl-bar{display:none !important}#ks-btn{left:calc(var(--fx,0px) + 14px) !important;right:auto !important;bottom:14px !important}#repair-btn{left:auto !important;right:calc(var(--fx,0px) + 14px) !important;bottom:14px !important}#ks-btn.dim,#repair-btn.dim,#repair-btn.off{opacity:.45;filter:grayscale(.75)}";
  document.head.appendChild(st);
}   /* v125: CR 표준 — 전투 중 별도 컨트롤바 없음, 상단바를 전장 위 반투명 오버레이로 전환 */
function relayoutHud(){
  try{
    var aw=document.getElementById('arena-wrap'); if(!aw) return; ensureCtlBar();
    var on=(typeof S!=='undefined'&&S&&S.scene==='battle');
    document.body.classList.toggle('battle-on', on);
    if(!on) return;
    var fxp=null;
    try{ var cv2=aw.querySelector('canvas'); if(cv2){ fxp=Math.max(0, (cv2.clientWidth - cv2.clientHeight*(cv2.width/cv2.height))/2); } }catch(e){}   /* v389: --fx 실측(비트맵 비율) */
    if(fxp==null){ fxp=0; }   /* v389: 풀핏 비트맵 — 박스=필드 */
    aw.style.setProperty('--fx', fxp.toFixed(1)+'px');
    try{ document.body.style.setProperty('--fx', fxp.toFixed(1)+'px'); }catch(e){}   /* v133: 상단 코너 버튼(타이머·소리)도 프레임 기준 정렬 */
    try{ if(typeof ensureKsBtn==='function') ensureKsBtn(); }catch(e){}
    try{ if(typeof ensureRepairBtn==='function') ensureRepairBtn(); }catch(e){}
    try{ var rb2=document.getElementById('repair-btn'); if(rb2) rb2.classList.remove('hidden'); if(typeof syncRepairBtn==='function') syncRepairBtn(); }catch(e){}
    var q=document.getElementById('btn-quit'); if(q&&q.__t!=='f'){ q.textContent='🏳 기권'; q.__t='f'; }
  }catch(e){}
}   /* v125: 컨트롤바 폐지 — 버튼은 상단 오버레이 안 소형 아이콘으로, --fx는 캔버스 내부 여백 실측 */

window.addEventListener('resize', relayoutHud);
function profDb(){ try{ var d=JSON.parse(localStorage.getItem('ra_profiles_v1')||'null'); if(!d||!d.list||!d.list.length) d={list:['지휘관'],active:'지휘관'}; return d; }catch(e){ return {list:['지휘관'],active:'지휘관'}; } }
function profDbSave(d){ try{ localStorage.setItem('ra_profiles_v1', JSON.stringify(d)); }catch(e){} }


'use strict';
function profKey(n){ return 'ra_prof_'+encodeURIComponent(n); }
function profSnapshot(){ try{ return {tro:parseInt(localStorage.getItem('ra_trophies_v1')||'0',10)||0,
  wins:parseInt(localStorage.getItem('ra_wins_v1')||'0',10)||0,
  sp:JSON.parse(localStorage.getItem('ra_sp_v1')||'{"sp":0,"total":0}'),
  sk:JSON.parse(localStorage.getItem('ra_skills_v1')||'{}'),
  rel:localStorage.getItem('ra_relic_v1')||''}; }catch(e){ return {tro:0,wins:0,sp:{sp:0,total:0},sk:{},rel:''}; } }
function profStore(n,s){ try{ localStorage.setItem(profKey(n), JSON.stringify(s)); }catch(e){} }
function profActive(){ var d=profDb();
  if(localStorage.getItem('ra_profiles_v1')===null){   // v120: 최초 실행 — 기존 진행도를 기본 지휘관 버킷으로 이관
    profStore('지휘관', profSnapshot()); profDbSave(d); }
  if(d.list.indexOf(d.active)<0) d.active=d.list[0];
  return d.active; }
function profApply(n){ var s=profLoad(n);
  try{ localStorage.setItem('ra_trophies_v1', String(s.tro||0)); localStorage.setItem('ra_wins_v1', String(s.wins||0));
    localStorage.setItem('ra_sp_v1', JSON.stringify(s.sp||{sp:0,total:0})); localStorage.setItem('ra_skills_v1', JSON.stringify(s.sk||{}));
    if(s.rel) localStorage.setItem('ra_relic_v1', s.rel); else localStorage.removeItem('ra_relic_v1'); }catch(e){}
  try{ S.relic=s.rel||''; applyRelics(); S._sk={}; syncTrophyChip(); syncGradeVisual(); }catch(e){} }
function profSwitch(n){ var d=profDb(); if(d.list.indexOf(n)<0||n===d.active) return false;
  profSync(); d.active=n; profDbSave(d); profApply(n); return true; }   // v120: 전환 — 현재 진행도 저장 후 대상 버킷 적용
function profNew(n){ var d=profDb(); n=String(n||'').trim().slice(0,12); if(!n||d.list.indexOf(n)>=0) return false;
  profSync(); d.list.push(n); d.active=n; profDbSave(d);
  try{ localStorage.setItem('ra_trophies_v1','0'); localStorage.setItem('ra_wins_v1','0');
    localStorage.setItem('ra_sp_v1','{"sp":0,"total":0}'); localStorage.setItem('ra_skills_v1','{}'); localStorage.removeItem('ra_relic_v1');
    S.relic=''; applyRelics(); S._sk={}; syncTrophyChip(); syncGradeVisual(); ['ra_wins_v1','ra_losses_v1','ra_streak_v1','ra_streak_best_v1','ra_daily_v1','ra_lvup_v1','ra_xp_gain_v1','ra_hist30_v1','ra_stats_diff_v1','ra_sp_gain_v1','ra_slot_stats_v1','ra_slot_used_v1'].forEach(function(k2){ try{ localStorage.removeItem(k2); }catch(e2){} }); }catch(e){} return true; }   // v120: 신규 지휘관 — 기본 상태 시작
function profRename(n){ var d=profDb(); n=String(n||'').trim().slice(0,12); if(!n||d.list.indexOf(n)>=0||n===d.active) return false;
  var old=d.active; profStore(n, profLoad(old)); try{ localStorage.removeItem(profKey(old)); }catch(e){}
  d.list=d.list.map(function(x){ return x===old?n:x; }); d.active=n; profDbSave(d); return true; }
function profDelete(n){ var d=profDb(); if(d.list.indexOf(n)<0||n===d.active||d.list.length<=1) return false;
  try{ localStorage.removeItem(profKey(n)); }catch(e){} d.list=d.list.filter(function(x){ return x!==n; }); profDbSave(d); return true; }
function resetProgression(){ try{ localStorage.setItem('ra_prof_backup_v1', JSON.stringify({n:profActive(),s:profSnapshot()}));
    localStorage.setItem('ra_trophies_v1','0'); localStorage.setItem('ra_wins_v1','0');
    localStorage.setItem('ra_sp_v1','{"sp":0,"total":0}'); localStorage.setItem('ra_skills_v1','{}'); localStorage.removeItem('ra_relic_v1');
    S.relic=''; applyRelics(); S._sk={}; syncTrophyChip(); syncGradeVisual(); ['ra_wins_v1','ra_losses_v1','ra_streak_v1','ra_streak_best_v1','ra_daily_v1','ra_lvup_v1','ra_xp_gain_v1','ra_hist30_v1','ra_stats_diff_v1','ra_sp_gain_v1','ra_slot_stats_v1','ra_slot_used_v1'].forEach(function(k2){ try{ localStorage.removeItem(k2); }catch(e2){} }); }catch(e){} return true; }   // v120: 진행도 리셋 — 직전 상태 자동 백업
function undoProgression(){ try{ var b=JSON.parse(localStorage.getItem('ra_prof_backup_v1')||'null'); if(!b) return false;
    profStore(b.n, b.s); if(b.n===profActive()) profApply(b.n); localStorage.removeItem('ra_prof_backup_v1'); }catch(e){ return false; } return true; }   // v120: 복원 — 리셋 직전 진행도 1회 복구
function ensureProfileUI(){
  if(document.getElementById('overlay-profile')) return;
  if(!document.getElementById('prf-style')){ var st2=document.createElement('style'); st2.id='prf-style';
    st2.textContent='.prf-row{display:flex;gap:8px;justify-content:center;margin:8px 0;flex-wrap:wrap} .prf-row input{background:#0B0E1B;border:1px solid #3d4c73;border-radius:8px;color:#dfe8ff;padding:7px 10px;font-family:var(--fd);width:150px} .prf-btn{border:1.5px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;border-radius:9px;padding:7px 14px;font-weight:700;font-family:var(--fd);cursor:pointer} .prf-list{display:flex;flex-direction:column;gap:6px;max-width:320px;margin:10px auto} .prf-item{display:flex;justify-content:space-between;align-items:center;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:7px 12px;color:#dfe8ff} .prf-item.on{border-color:#FFD54F} .prf-item button{border:1px solid #3d4c73;background:rgba(11,17,30,.9);color:#9fb0d0;border-radius:7px;padding:3px 9px;cursor:pointer} .prf-item button:disabled{opacity:.35;cursor:default} #prf-stats{text-align:center;color:#dfe8ff;margin:8px 0} #prf-stats b{color:#FFD54F} #btn-profile-reset{border-color:#e64545;color:#ff9d9d} .prf-item{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif)} .prf-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif)}';   // v121: 프로필 폰트 정합
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-profile'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎖️ 지휘관 프로필</h2><p class="rsub">지휘관별로 진행도가 저장됩니다</p><div id="prf-stats"></div>'
    +'<div class="prf-row"><input id="prf-name" maxlength="12" placeholder="지휘관 이름"><button id="btn-prf-rename" class="prf-btn">이름 변경</button></div>'
    +'<div class="prf-list" id="prf-list"></div>'
    +'<div class="prf-row"><input id="prf-new" maxlength="12" placeholder="새 지휘관 이름"><button id="btn-prf-new" class="prf-btn">생성</button></div>'
    +'<div class="prf-row"><button id="btn-profile-reset" class="prf-btn">진행도 리셋</button><button id="btn-profile-undo" class="prf-btn">복원</button></div>'
    +'<button id="btn-prf-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-prf-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rn=document.getElementById('btn-prf-rename'); if(rn) rn.onclick=function(){ var el=document.getElementById('prf-name'); if(profRename(el.value)){ el.value=''; renderProfileList(); } };
  var nw=document.getElementById('btn-prf-new'); if(nw) nw.onclick=function(){ var el=document.getElementById('prf-new'); if(profNew(el.value)){ el.value=''; renderProfileList(); } else toast('이름을 확인해 주세요(중복·공백 금지)'); };
  var rs=document.getElementById('btn-profile-reset'); if(rs) rs.onclick=function(){ if(confirm('진행도를 초기화할까요? 직전 상태는 복원 버튼으로 되돌릴 수 있어요.')) resetProgression(); renderProfileList(); };
  var ud=document.getElementById('btn-profile-undo'); if(ud) ud.onclick=function(){ if(undoProgression()) toast('직전 진행도를 복원했어요'); renderProfileList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-profile'; b.textContent='🎖️ 프로필';
      b.onclick=function(){ renderProfileList(); ov.classList.remove('hidden'); };
      var sk=document.getElementById('btn-skill'); if(sk&&sk.parentNode===ta) ta.insertBefore(b,sk); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
}
function renderProfileList(){
  var box=document.getElementById('prf-list'); if(!box) return;
  profSync();
  var d=profDb(); var s=profSnapshot();
  var gname=(typeof GRADES!=='undefined'&&GRADES[gradeOf(s.tro)])?GRADES[gradeOf(s.tro)][0]:'—';
  var stEl=document.getElementById('prf-stats');
  if(stEl){ var __L=(function(){try{return parseInt(localStorage.getItem('ra_losses_v1')||'0',10)||0}catch(e){return 0}})(), __W=s.wins||0, __tot=__W+__L, __rate=__tot>0?Math.round(__W*100/__tot):0, __sk=(function(){try{return parseInt(localStorage.getItem('ra_streak_v1')||'0',10)||0}catch(e){return 0}})(), __sb=Math.max(__sk,(function(){try{return parseInt(localStorage.getItem('ra_streak_best_v1')||'0',10)||0}catch(e){return 0}})()), __h30=(function(){try{return JSON.parse(localStorage.getItem('ra_hist30_v1')||'[]')}catch(e){return []}})(), __sd=(function(){try{var x=JSON.parse(localStorage.getItem('ra_stats_diff_v1')||'[]');return (Array.isArray(x)&&x.length>=3)?x:[{w:0,l:0,d:0},{w:0,l:0,d:0},{w:0,l:0,d:0}]}catch(e){return [{w:0,l:0,d:0},{w:0,l:0,d:0},{w:0,l:0,d:0}]}})(), __dn=['쉬움','보통','어려움'], __dd=''; for(var _i=0;_i<3;_i++)__dd+='<span class="ps-d">'+__dn[_i]+' '+__sd[_i].w+'승 '+__sd[_i].l+'패</span>';var __sl=(function(){try{var x=JSON.parse(localStorage.getItem('ra_slot_stats_v1')||'[]');return (Array.isArray(x)&&x.length>=2)?x:[{w:0,l:0},{w:0,l:0}]}catch(e){return [{w:0,l:0},{w:0,l:0}]}})();var __dd2='<span class="ps-h">덱 승률</span>';for(var _j=0;_j<2;_j++){var __t2=__sl[_j].w+__sl[_j].l;__dd2+='<span class="ps-d">덱 '+(_j===0?'A':'B')+' <b>'+(__t2>0?Math.round(__sl[_j].w*100/__t2)+'%':'—')+'</b> ('+__t2+'전)</span>';} stEl.innerHTML='현재: <b>'+d.active+'</b> · 등급 <b>'+gname+'</b><br>트로피 <b>'+s.tro+'</b> · 승리 <b>'+__W+'</b> · SP <b>'+((s.sp&&s.sp.sp)||0)+'</b><div class="ps-grid"><span>승률 <b>'+__rate+'%</b> ('+__tot+'전)</span><span>연승 <b>'+__sk+'</b> · 최고 <b>'+__sb+'</b></span><span class="ps-h">최근 30전</span><span class="ps-hist">'+(__h30.length?__h30.join(' '):'기록 없음')+'</span>'+__dd+__dd2+'</div>'; }
  var nm=document.getElementById('prf-name'); if(nm) nm.placeholder=d.active;
  box.innerHTML='';
  d.list.forEach(function(n){
    var it=document.createElement('div'); it.className='prf-item'+(n===d.active?' on':'');
    var ps=profLoad(n);
    it.innerHTML='<span>'+(n===d.active?'● ':'')+n+'</span>';
    var ctl=document.createElement('span');
    var sel=document.createElement('button'); sel.textContent=n===d.active?'사용 중':'선택'; sel.disabled=(n===d.active);
    sel.onclick=function(){ profSwitch(n); renderProfileList(); };
    var del=document.createElement('button'); del.textContent='삭제'; del.disabled=(n===d.active||d.list.length<=1);
    del.onclick=function(){ if(confirm('지휘관 \''+n+'\'를 삭제할까요?')){ profDelete(n); renderProfileList(); } };
    ctl.appendChild(sel); ctl.appendChild(del); it.appendChild(ctl); box.appendChild(it);
  });
}
/* ---------- v119: P16 전술 연구소 (스킬트리 9노드) ---------- */
const SKILLS=[
 {id:'off1',col:'⚔️',tier:1,name:'무난한 힘',desc:'아군 유닛 공격력 +8%'},
 {id:'off2',col:'⚔️',tier:2,name:'집중 포화',desc:'아군 유닛 공격력 추가 +6%'},
 {id:'off3',col:'⚔️',tier:3,name:'왕실 총공세',desc:'아군 유닛 공격력 추가 +12%'},
 {id:'def1',col:'🛡️',tier:1,name:'굳건한 방벽',desc:'아군 타워 최대 체력 +10%'},
 {id:'def2',col:'🛡️',tier:2,name:'수리 조직',desc:'타워 수리 엘릭서 비용 −1'},
 {id:'def3',col:'🛡️',tier:3,name:'왕실 결계',desc:'아군 타워 최대 체력 추가 +10%'},
 {id:'mag1',col:'🧪',tier:1,name:'신속 채취',desc:'엘릭서 회복 +6%'},
 {id:'mag2',col:'🧪',tier:2,name:'광역 주문',desc:'주문 피해 +10%'},
 {id:'mag3',col:'🧪',tier:3,name:'마나 급류',desc:'엘릭서 회복 추가 +6%'}];
function canBuySkill(id){ var d=SKILLS.find(function(s){ return s.id===id; }); if(!d) return false;
  if(skillLv(id)>=3) return false; if(spState().sp<1) return false;
  if(d.tier>=2){ var low=colSkill(d.col,d.tier-1); if(skillLv(low.id)<2) return false; }
  return true; }
function buySkill(id){ if(!canBuySkill(id)) return false;
  var st=spState(); st.sp-=1; var o=skillsObj(); o[id]=(o[id]||0)+1; skillsSave(o); spSave(st); return true; }
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
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);font-size:13.5px}   /* v121: 아이템 폰트 정합 */ .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:calc(100dvh - 10px);overflow-y:auto}@media(max-height:700px){#overlay-skill .rpanel{padding:8px 10px 6px}#overlay-skill h2{font-size:16px;margin:1px 0}#overlay-skill .rsub{font-size:9.5px;margin:1px 0 3px}#overlay-skill #sk-sp{margin:2px 0;font-size:12px}#overlay-skill #sk-grid{gap:6px;margin:4px auto}#overlay-skill .sk-col{gap:5px;min-width:0}#overlay-skill .sk-item{padding:5px 32px 5px 7px;font-size:12px}#overlay-skill .sk-item small{font-size:10px;margin:1px 0 3px}#overlay-skill .sk-item button{width:22px;height:22px;right:5px;font-size:13px}#overlay-skill .sk-item .sk-lv{font-size:10.5px}#overlay-skill #btn-skill-reset,#overlay-skill #btn-skill-close{margin:6px auto 0;padding:6px 0;font-size:12px}}@media(max-height:700px){#overlay-skill .rpanel{padding:6px 8px 4px}#overlay-skill h2{font-size:15px;margin:0 0 2px}#overlay-skill .rsub{font-size:9px;margin:0 0 2px}#overlay-skill #sk-sp{margin:1px 0;font-size:11px}#overlay-skill #sk-legend{font-size:9px;margin:1px 0}#overlay-skill #sk-foot{margin-top:3px}#overlay-skill #sk-foot button,#overlay-skill #btn-skill-reset,#overlay-skill #btn-skill-close{margin:3px auto 0;padding:5px 0;font-size:11.5px}#overlay-skill #sk-grid{gap:5px;margin:3px auto}#overlay-skill #sk-grid > *{gap:4px;min-width:0}#overlay-skill #sk-grid > * > *{padding:4px 30px 4px 6px;font-size:11.5px;line-height:1.3;min-height:0}#overlay-skill #sk-grid * small{font-size:9.5px;margin:1px 0 2px;line-height:1.25}#overlay-skill #sk-grid button{width:20px;height:20px;font-size:12px;padding:0}} #btn-skill,#btn-profile{font-family:\'Black Han Sans\',\'Jua\',sans-serif;font-size:19px;padding:12px 34px;border-radius:14px;border:2px solid #3d4c73;color:#dfe8ff;background:rgba(18,24,43,.85);box-shadow:0 5px 0 #1c2740,0 9px 18px rgba(0,0,0,.4);text-shadow:0 2px 0 rgba(0,0,0,.6);transition:transform .06s} #btn-skill:active,#btn-profile:active{transform:translateY(3px)} #btn-skill-close,#btn-prf-close{display:block;margin:14px auto 0;width:120px;padding:9px 0;border-radius:12px;border:1.5px solid #FFB300;background:rgba(18,24,43,.85);color:#FFD54F;font-weight:700;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);cursor:pointer} @media (max-width:420px){#btn-skill,#btn-profile{font-size:16px;padding:10px 22px}}';   // v121: 로비 버튼·닫기 — 유물 규격 통일
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">지도 클리어 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
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
  b.classList.toggle('off',st==='off');
  if(st==='off') return;
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
const RELICS=[
  {id:'relic_atk',icon:'⚔️',name:'전투 문장',desc:'아군 유닛의 피해 +10%',need:1},
  {id:'relic_tower',icon:'🛡️',name:'수호 문장',desc:'아군 타워 최대 체력 +10%',need:3},
  {id:'relic_spell',icon:'✨',name:'마력 봉인구',desc:'주문 피해 +25%',need:5},
  {id:'relic_gold',icon:'💰',name:'황금 엘릭서 통',desc:'엘릭서 재생 +10%',need:7}
];
function applyRelics(){
  if(S.relic!=='relic_tower') return;
  for(const t of towers){ if(t.team==='blue'&&!t.__rl){ t.__rl=1; t.maxHp=Math.round(t.maxHp*1.1); t.hp=Math.min(t.maxHp,Math.round(t.hp*1.1)); } }
}
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
function profLoad(n){ try{ return JSON.parse(localStorage.getItem(profKey(n))||'null')||profSnapshot(); }catch(e){ return profSnapshot(); } }
function profActive(){ var d=profDb();
  if(localStorage.getItem('ra_profiles_v1')===null){   // v120: 최초 실행 — 기존 진행도를 기본 지휘관 버킷으로 이관
    profStore('지휘관', profSnapshot()); profDbSave(d); }
  if(d.list.indexOf(d.active)<0) d.active=d.list[0];
  return d.active; }
function profSync(){ var d=profDb(); d.active=profActive(); profStore(d.active, profSnapshot()); profDbSave(d); }   // v120: 라이브 키 → 활성 버킷 미러
function profApply(n){ var s=profLoad(n);
  try{ localStorage.setItem('ra_trophies_v1', String(s.tro||0)); localStorage.setItem('ra_wins_v1', String(s.wins||0));
    localStorage.setItem('ra_sp_v1', JSON.stringify(s.sp||{sp:0,total:0})); localStorage.setItem('ra_skills_v1', JSON.stringify(s.sk||{}));
    if(s.rel) localStorage.setItem('ra_relic_v1', s.rel); else localStorage.removeItem('ra_relic_v1'); }catch(e){}
  try{ S.relic=s.rel||''; applyRelics(); S._sk={}; syncTrophyChip(); syncGradeVisual(); }catch(e){} }
function profSwitch(n){ var d=profDb(); if(d.list.indexOf(n)<0||n===d.active) return false;
  profSync(); d.active=n; profDbSave(d); profApply(n); return true; }   // v120: 전환 — 현재 진행도 저장 후 대상 버킷 적용
function profNew(n){ var d=profDb(); n=String(n||'').trim().slice(0,12); if(!n||d.list.indexOf(n)>=0) return false;
  profSync(); d.list.push(n); d.active=n; profDbSave(d);
  try{ localStorage.setItem('ra_trophies_v1','0'); localStorage.setItem('ra_wins_v1','0');
    localStorage.setItem('ra_sp_v1','{"sp":0,"total":0}'); localStorage.setItem('ra_skills_v1','{}'); localStorage.removeItem('ra_relic_v1');
    S.relic=''; applyRelics(); S._sk={}; syncTrophyChip(); syncGradeVisual(); ['ra_wins_v1','ra_losses_v1','ra_streak_v1','ra_streak_best_v1','ra_daily_v1','ra_lvup_v1','ra_xp_gain_v1','ra_hist30_v1','ra_stats_diff_v1','ra_sp_gain_v1','ra_slot_stats_v1','ra_slot_used_v1'].forEach(function(k2){ try{ localStorage.removeItem(k2); }catch(e2){} }); }catch(e){} return true; }   // v120: 신규 지휘관 — 기본 상태 시작
function profRename(n){ var d=profDb(); n=String(n||'').trim().slice(0,12); if(!n||d.list.indexOf(n)>=0||n===d.active) return false;
  var old=d.active; profStore(n, profLoad(old)); try{ localStorage.removeItem(profKey(old)); }catch(e){}
  d.list=d.list.map(function(x){ return x===old?n:x; }); d.active=n; profDbSave(d); return true; }
function profDelete(n){ var d=profDb(); if(d.list.indexOf(n)<0||n===d.active||d.list.length<=1) return false;
  try{ localStorage.removeItem(profKey(n)); }catch(e){} d.list=d.list.filter(function(x){ return x!==n; }); profDbSave(d); return true; }
function resetProgression(){ try{ localStorage.setItem('ra_prof_backup_v1', JSON.stringify({n:profActive(),s:profSnapshot()}));
    localStorage.setItem('ra_trophies_v1','0'); localStorage.setItem('ra_wins_v1','0');
    localStorage.setItem('ra_sp_v1','{"sp":0,"total":0}'); localStorage.setItem('ra_skills_v1','{}'); localStorage.removeItem('ra_relic_v1');
    S.relic=''; applyRelics(); S._sk={}; syncTrophyChip(); syncGradeVisual(); ['ra_wins_v1','ra_losses_v1','ra_streak_v1','ra_streak_best_v1','ra_daily_v1','ra_lvup_v1','ra_xp_gain_v1','ra_hist30_v1','ra_stats_diff_v1','ra_sp_gain_v1','ra_slot_stats_v1','ra_slot_used_v1'].forEach(function(k2){ try{ localStorage.removeItem(k2); }catch(e2){} }); }catch(e){} return true; }   // v120: 진행도 리셋 — 직전 상태 자동 백업
function undoProgression(){ try{ var b=JSON.parse(localStorage.getItem('ra_prof_backup_v1')||'null'); if(!b) return false;
    profStore(b.n, b.s); if(b.n===profActive()) profApply(b.n); localStorage.removeItem('ra_prof_backup_v1'); }catch(e){ return false; } return true; }   // v120: 복원 — 리셋 직전 진행도 1회 복구
function ensureProfileUI(){
  if(document.getElementById('overlay-profile')) return;
  if(!document.getElementById('prf-style')){ var st2=document.createElement('style'); st2.id='prf-style';
    st2.textContent='.prf-row{display:flex;gap:8px;justify-content:center;margin:8px 0;flex-wrap:wrap} .prf-row input{background:#0B0E1B;border:1px solid #3d4c73;border-radius:8px;color:#dfe8ff;padding:7px 10px;font-family:var(--fd);width:150px} .prf-btn{border:1.5px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;border-radius:9px;padding:7px 14px;font-weight:700;font-family:var(--fd);cursor:pointer} .prf-list{display:flex;flex-direction:column;gap:6px;max-width:320px;margin:10px auto} .prf-item{display:flex;justify-content:space-between;align-items:center;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:7px 12px;color:#dfe8ff} .prf-item.on{border-color:#FFD54F} .prf-item button{border:1px solid #3d4c73;background:rgba(11,17,30,.9);color:#9fb0d0;border-radius:7px;padding:3px 9px;cursor:pointer} .prf-item button:disabled{opacity:.35;cursor:default} #prf-stats{text-align:center;color:#dfe8ff;margin:8px 0} #prf-stats b{color:#FFD54F} #btn-profile-reset{border-color:#e64545;color:#ff9d9d} .prf-item{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif)} .prf-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif)}';   // v121: 프로필 폰트 정합
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-profile'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎖️ 지휘관 프로필</h2><p class="rsub">지휘관별로 진행도가 저장됩니다</p><div id="prf-stats"></div>'
    +'<div class="prf-row"><input id="prf-name" maxlength="12" placeholder="지휘관 이름"><button id="btn-prf-rename" class="prf-btn">이름 변경</button></div>'
    +'<div class="prf-list" id="prf-list"></div>'
    +'<div class="prf-row"><input id="prf-new" maxlength="12" placeholder="새 지휘관 이름"><button id="btn-prf-new" class="prf-btn">생성</button></div>'
    +'<div class="prf-row"><button id="btn-profile-reset" class="prf-btn">진행도 리셋</button><button id="btn-profile-undo" class="prf-btn">복원</button></div>'
    +'<button id="btn-prf-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-prf-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rn=document.getElementById('btn-prf-rename'); if(rn) rn.onclick=function(){ var el=document.getElementById('prf-name'); if(profRename(el.value)){ el.value=''; renderProfileList(); } };
  var nw=document.getElementById('btn-prf-new'); if(nw) nw.onclick=function(){ var el=document.getElementById('prf-new'); if(profNew(el.value)){ el.value=''; renderProfileList(); } else toast('이름을 확인해 주세요(중복·공백 금지)'); };
  var rs=document.getElementById('btn-profile-reset'); if(rs) rs.onclick=function(){ if(confirm('진행도를 초기화할까요? 직전 상태는 복원 버튼으로 되돌릴 수 있어요.')) resetProgression(); renderProfileList(); };
  var ud=document.getElementById('btn-profile-undo'); if(ud) ud.onclick=function(){ if(undoProgression()) toast('직전 진행도를 복원했어요'); renderProfileList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-profile'; b.textContent='🎖️ 프로필';
      b.onclick=function(){ renderProfileList(); ov.classList.remove('hidden'); };
      var sk=document.getElementById('btn-skill'); if(sk&&sk.parentNode===ta) ta.insertBefore(b,sk); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
}
function renderProfileList(){
  var box=document.getElementById('prf-list'); if(!box) return;
  profSync();
  var d=profDb(); var s=profSnapshot();
  var gname=(typeof GRADES!=='undefined'&&GRADES[gradeOf(s.tro)])?GRADES[gradeOf(s.tro)][0]:'—';
  var stEl=document.getElementById('prf-stats');
  if(stEl){ var __L=(function(){try{return parseInt(localStorage.getItem('ra_losses_v1')||'0',10)||0}catch(e){return 0}})(), __W=s.wins||0, __tot=__W+__L, __rate=__tot>0?Math.round(__W*100/__tot):0, __sk=(function(){try{return parseInt(localStorage.getItem('ra_streak_v1')||'0',10)||0}catch(e){return 0}})(), __sb=Math.max(__sk,(function(){try{return parseInt(localStorage.getItem('ra_streak_best_v1')||'0',10)||0}catch(e){return 0}})()), __h30=(function(){try{return JSON.parse(localStorage.getItem('ra_hist30_v1')||'[]')}catch(e){return []}})(), __sd=(function(){try{var x=JSON.parse(localStorage.getItem('ra_stats_diff_v1')||'[]');return (Array.isArray(x)&&x.length>=3)?x:[{w:0,l:0,d:0},{w:0,l:0,d:0},{w:0,l:0,d:0}]}catch(e){return [{w:0,l:0,d:0},{w:0,l:0,d:0},{w:0,l:0,d:0}]}})(), __dn=['쉬움','보통','어려움'], __dd=''; for(var _i=0;_i<3;_i++)__dd+='<span class="ps-d">'+__dn[_i]+' '+__sd[_i].w+'승 '+__sd[_i].l+'패</span>';var __sl=(function(){try{var x=JSON.parse(localStorage.getItem('ra_slot_stats_v1')||'[]');return (Array.isArray(x)&&x.length>=2)?x:[{w:0,l:0},{w:0,l:0}]}catch(e){return [{w:0,l:0},{w:0,l:0}]}})();var __dd2='<span class="ps-h">덱 승률</span>';for(var _j=0;_j<2;_j++){var __t2=__sl[_j].w+__sl[_j].l;__dd2+='<span class="ps-d">덱 '+(_j===0?'A':'B')+' <b>'+(__t2>0?Math.round(__sl[_j].w*100/__t2)+'%':'—')+'</b> ('+__t2+'전)</span>';} stEl.innerHTML='현재: <b>'+d.active+'</b> · 등급 <b>'+gname+'</b><br>트로피 <b>'+s.tro+'</b> · 승리 <b>'+__W+'</b> · SP <b>'+((s.sp&&s.sp.sp)||0)+'</b><div class="ps-grid"><span>승률 <b>'+__rate+'%</b> ('+__tot+'전)</span><span>연승 <b>'+__sk+'</b> · 최고 <b>'+__sb+'</b></span><span class="ps-h">최근 30전</span><span class="ps-hist">'+(__h30.length?__h30.join(' '):'기록 없음')+'</span>'+__dd+__dd2+'</div>'; }
  var nm=document.getElementById('prf-name'); if(nm) nm.placeholder=d.active;
  box.innerHTML='';
  d.list.forEach(function(n){
    var it=document.createElement('div'); it.className='prf-item'+(n===d.active?' on':'');
    var ps=profLoad(n);
    it.innerHTML='<span>'+(n===d.active?'● ':'')+n+'</span>';
    var ctl=document.createElement('span');
    var sel=document.createElement('button'); sel.textContent=n===d.active?'사용 중':'선택'; sel.disabled=(n===d.active);
    sel.onclick=function(){ profSwitch(n); renderProfileList(); };
    var del=document.createElement('button'); del.textContent='삭제'; del.disabled=(n===d.active||d.list.length<=1);
    del.onclick=function(){ if(confirm('지휘관 \''+n+'\'를 삭제할까요?')){ profDelete(n); renderProfileList(); } };
    ctl.appendChild(sel); ctl.appendChild(del); it.appendChild(ctl); box.appendChild(it);
  });
}
/* ---------- v119: P16 전술 연구소 (스킬트리 9노드) ---------- */
var SKILLS_LEGACY=[
 {id:'off1',col:'⚔️',tier:1,name:'무난한 힘',desc:'아군 유닛 공격력 +8%'},
 {id:'off2',col:'⚔️',tier:2,name:'집중 포화',desc:'아군 유닛 공격력 추가 +6%'},
 {id:'off3',col:'⚔️',tier:3,name:'왕실 총공세',desc:'아군 유닛 공격력 추가 +12%'},
 {id:'def1',col:'🛡️',tier:1,name:'굳건한 방벽',desc:'아군 타워 최대 체력 +10%'},
 {id:'def2',col:'🛡️',tier:2,name:'수리 조직',desc:'타워 수리 엘릭서 비용 −1'},
 {id:'def3',col:'🛡️',tier:3,name:'왕실 결계',desc:'아군 타워 최대 체력 추가 +10%'},
 {id:'mag1',col:'🧪',tier:1,name:'신속 채취',desc:'엘릭서 회복 +6%'},
 {id:'mag2',col:'🧪',tier:2,name:'광역 주문',desc:'주문 피해 +10%'},
 {id:'mag3',col:'🧪',tier:3,name:'마나 급류',desc:'엘릭서 회복 추가 +6%'}];
function canBuySkill(id){ var d=SKILLS.find(function(s){ return s.id===id; }); if(!d) return false;
  if(skillLv(id)>=3) return false; if(spState().sp<1) return false;
  if(d.tier>=2){ var low=colSkill(d.col,d.tier-1); if(skillLv(low.id)<2) return false; }
  return true; }
function buySkill(id){ if(!canBuySkill(id)) return false;
  var st=spState(); st.sp-=1; var o=skillsObj(); o[id]=(o[id]||0)+1; skillsSave(o); spSave(st); return true; }
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
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);font-size:13.5px}   /* v121: 아이템 폰트 정합 */ .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:calc(100dvh - 10px);overflow-y:auto} #btn-skill,#btn-profile{font-family:\'Black Han Sans\',\'Jua\',sans-serif;font-size:19px;padding:12px 34px;border-radius:14px;border:2px solid #3d4c73;color:#dfe8ff;background:rgba(18,24,43,.85);box-shadow:0 5px 0 #1c2740,0 9px 18px rgba(0,0,0,.4);text-shadow:0 2px 0 rgba(0,0,0,.6);transition:transform .06s} #btn-skill:active,#btn-profile:active{transform:translateY(3px)} #btn-skill-close,#btn-prf-close{display:block;margin:14px auto 0;width:120px;padding:9px 0;border-radius:12px;border:1.5px solid #FFB300;background:rgba(18,24,43,.85);color:#FFD54F;font-weight:700;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);cursor:pointer} @media (max-width:420px){#btn-skill,#btn-profile{font-size:16px;padding:10px 22px}}';   // v121: 로비 버튼·닫기 — 유물 규격 통일
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">지도 클리어 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
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
  b.classList.toggle('off',st==='off');
  if(st==='off') return;
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
function applyRelics(){
  if(S.relic!=='relic_tower') return;
  for(const t of towers){ if(t.team==='blue'&&!t.__rl){ t.__rl=1; t.maxHp=Math.round(t.maxHp*1.1); t.hp=Math.min(t.maxHp,Math.round(t.hp*1.1)); } }
}
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
function resetProgression(){ try{ localStorage.setItem('ra_prof_backup_v1', JSON.stringify({n:profActive(),s:profSnapshot()}));
    localStorage.setItem('ra_trophies_v1','0'); localStorage.setItem('ra_wins_v1','0');
    localStorage.setItem('ra_sp_v1','{"sp":0,"total":0}'); localStorage.setItem('ra_skills_v1','{}'); localStorage.removeItem('ra_relic_v1');
    S.relic=''; applyRelics(); S._sk={}; syncTrophyChip(); syncGradeVisual(); ['ra_wins_v1','ra_losses_v1','ra_streak_v1','ra_streak_best_v1','ra_daily_v1','ra_lvup_v1','ra_xp_gain_v1','ra_hist30_v1','ra_stats_diff_v1','ra_sp_gain_v1','ra_slot_stats_v1','ra_slot_used_v1'].forEach(function(k2){ try{ localStorage.removeItem(k2); }catch(e2){} }); }catch(e){} return true; }   // v120: 진행도 리셋 — 직전 상태 자동 백업
function undoProgression(){ try{ var b=JSON.parse(localStorage.getItem('ra_prof_backup_v1')||'null'); if(!b) return false;
    profStore(b.n, b.s); if(b.n===profActive()) profApply(b.n); localStorage.removeItem('ra_prof_backup_v1'); }catch(e){ return false; } return true; }   // v120: 복원 — 리셋 직전 진행도 1회 복구
function ensureProfileUI(){
  if(document.getElementById('overlay-profile')) return;
  if(!document.getElementById('prf-style')){ var st2=document.createElement('style'); st2.id='prf-style';
    st2.textContent='.prf-row{display:flex;gap:8px;justify-content:center;margin:8px 0;flex-wrap:wrap} .prf-row input{background:#0B0E1B;border:1px solid #3d4c73;border-radius:8px;color:#dfe8ff;padding:7px 10px;font-family:var(--fd);width:150px} .prf-btn{border:1.5px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;border-radius:9px;padding:7px 14px;font-weight:700;font-family:var(--fd);cursor:pointer} .prf-list{display:flex;flex-direction:column;gap:6px;max-width:320px;margin:10px auto} .prf-item{display:flex;justify-content:space-between;align-items:center;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:7px 12px;color:#dfe8ff} .prf-item.on{border-color:#FFD54F} .prf-item button{border:1px solid #3d4c73;background:rgba(11,17,30,.9);color:#9fb0d0;border-radius:7px;padding:3px 9px;cursor:pointer} .prf-item button:disabled{opacity:.35;cursor:default} #prf-stats{text-align:center;color:#dfe8ff;margin:8px 0} #prf-stats b{color:#FFD54F} #btn-profile-reset{border-color:#e64545;color:#ff9d9d} .prf-item{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif)} .prf-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif)}';   // v121: 프로필 폰트 정합
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-profile'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎖️ 지휘관 프로필</h2><p class="rsub">지휘관별로 진행도가 저장됩니다</p><div id="prf-stats"></div>'
    +'<div class="prf-row"><input id="prf-name" maxlength="12" placeholder="지휘관 이름"><button id="btn-prf-rename" class="prf-btn">이름 변경</button></div>'
    +'<div class="prf-list" id="prf-list"></div>'
    +'<div class="prf-row"><input id="prf-new" maxlength="12" placeholder="새 지휘관 이름"><button id="btn-prf-new" class="prf-btn">생성</button></div>'
    +'<div class="prf-row"><button id="btn-profile-reset" class="prf-btn">진행도 리셋</button><button id="btn-profile-undo" class="prf-btn">복원</button></div>'
    +'<button id="btn-prf-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-prf-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rn=document.getElementById('btn-prf-rename'); if(rn) rn.onclick=function(){ var el=document.getElementById('prf-name'); if(profRename(el.value)){ el.value=''; renderProfileList(); } };
  var nw=document.getElementById('btn-prf-new'); if(nw) nw.onclick=function(){ var el=document.getElementById('prf-new'); if(profNew(el.value)){ el.value=''; renderProfileList(); } else toast('이름을 확인해 주세요(중복·공백 금지)'); };
  var rs=document.getElementById('btn-profile-reset'); if(rs) rs.onclick=function(){ if(confirm('진행도를 초기화할까요? 직전 상태는 복원 버튼으로 되돌릴 수 있어요.')) resetProgression(); renderProfileList(); };
  var ud=document.getElementById('btn-profile-undo'); if(ud) ud.onclick=function(){ if(undoProgression()) toast('직전 진행도를 복원했어요'); renderProfileList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-profile'; b.textContent='🎖️ 프로필';
      b.onclick=function(){ renderProfileList(); ov.classList.remove('hidden'); };
      var sk=document.getElementById('btn-skill'); if(sk&&sk.parentNode===ta) ta.insertBefore(b,sk); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
}
function renderProfileList(){
  var box=document.getElementById('prf-list'); if(!box) return;
  profSync();
  var d=profDb(); var s=profSnapshot();
  var gname=(typeof GRADES!=='undefined'&&GRADES[gradeOf(s.tro)])?GRADES[gradeOf(s.tro)][0]:'—';
  var stEl=document.getElementById('prf-stats');
  if(stEl){ var __L=(function(){try{return parseInt(localStorage.getItem('ra_losses_v1')||'0',10)||0}catch(e){return 0}})(), __W=s.wins||0, __tot=__W+__L, __rate=__tot>0?Math.round(__W*100/__tot):0, __sk=(function(){try{return parseInt(localStorage.getItem('ra_streak_v1')||'0',10)||0}catch(e){return 0}})(), __sb=Math.max(__sk,(function(){try{return parseInt(localStorage.getItem('ra_streak_best_v1')||'0',10)||0}catch(e){return 0}})()), __h30=(function(){try{return JSON.parse(localStorage.getItem('ra_hist30_v1')||'[]')}catch(e){return []}})(), __sd=(function(){try{var x=JSON.parse(localStorage.getItem('ra_stats_diff_v1')||'[]');return (Array.isArray(x)&&x.length>=3)?x:[{w:0,l:0,d:0},{w:0,l:0,d:0},{w:0,l:0,d:0}]}catch(e){return [{w:0,l:0,d:0},{w:0,l:0,d:0},{w:0,l:0,d:0}]}})(), __dn=['쉬움','보통','어려움'], __dd=''; for(var _i=0;_i<3;_i++)__dd+='<span class="ps-d">'+__dn[_i]+' '+__sd[_i].w+'승 '+__sd[_i].l+'패</span>';var __sl=(function(){try{var x=JSON.parse(localStorage.getItem('ra_slot_stats_v1')||'[]');return (Array.isArray(x)&&x.length>=2)?x:[{w:0,l:0},{w:0,l:0}]}catch(e){return [{w:0,l:0},{w:0,l:0}]}})();var __dd2='<span class="ps-h">덱 승률</span>';for(var _j=0;_j<2;_j++){var __t2=__sl[_j].w+__sl[_j].l;__dd2+='<span class="ps-d">덱 '+(_j===0?'A':'B')+' <b>'+(__t2>0?Math.round(__sl[_j].w*100/__t2)+'%':'—')+'</b> ('+__t2+'전)</span>';} stEl.innerHTML='현재: <b>'+d.active+'</b> · 등급 <b>'+gname+'</b><br>트로피 <b>'+s.tro+'</b> · 승리 <b>'+__W+'</b> · SP <b>'+((s.sp&&s.sp.sp)||0)+'</b><div class="ps-grid"><span>승률 <b>'+__rate+'%</b> ('+__tot+'전)</span><span>연승 <b>'+__sk+'</b> · 최고 <b>'+__sb+'</b></span><span class="ps-h">최근 30전</span><span class="ps-hist">'+(__h30.length?__h30.join(' '):'기록 없음')+'</span>'+__dd+__dd2+'</div>'; }
  var nm=document.getElementById('prf-name'); if(nm) nm.placeholder=d.active;
  box.innerHTML='';
  d.list.forEach(function(n){
    var it=document.createElement('div'); it.className='prf-item'+(n===d.active?' on':'');
    var ps=profLoad(n);
    it.innerHTML='<span>'+(n===d.active?'● ':'')+n+'</span>';
    var ctl=document.createElement('span');
    var sel=document.createElement('button'); sel.textContent=n===d.active?'사용 중':'선택'; sel.disabled=(n===d.active);
    sel.onclick=function(){ profSwitch(n); renderProfileList(); };
    var del=document.createElement('button'); del.textContent='삭제'; del.disabled=(n===d.active||d.list.length<=1);
    del.onclick=function(){ if(confirm('지휘관 \''+n+'\'를 삭제할까요?')){ profDelete(n); renderProfileList(); } };
    ctl.appendChild(sel); ctl.appendChild(del); it.appendChild(ctl); box.appendChild(it);
  });
}
/* ---------- v119: P16 전술 연구소 (스킬트리 9노드) ---------- */
var SKILLS_LEGACY=[
 {id:'off1',col:'⚔️',tier:1,name:'무난한 힘',desc:'아군 유닛 공격력 +8%'},
 {id:'off2',col:'⚔️',tier:2,name:'집중 포화',desc:'아군 유닛 공격력 추가 +6%'},
 {id:'off3',col:'⚔️',tier:3,name:'왕실 총공세',desc:'아군 유닛 공격력 추가 +12%'},
 {id:'def1',col:'🛡️',tier:1,name:'굳건한 방벽',desc:'아군 타워 최대 체력 +10%'},
 {id:'def2',col:'🛡️',tier:2,name:'수리 조직',desc:'타워 수리 엘릭서 비용 −1'},
 {id:'def3',col:'🛡️',tier:3,name:'왕실 결계',desc:'아군 타워 최대 체력 추가 +10%'},
 {id:'mag1',col:'🧪',tier:1,name:'신속 채취',desc:'엘릭서 회복 +6%'},
 {id:'mag2',col:'🧪',tier:2,name:'광역 주문',desc:'주문 피해 +10%'},
 {id:'mag3',col:'🧪',tier:3,name:'마나 급류',desc:'엘릭서 회복 추가 +6%'}];
function canBuySkill(id){ var d=SKILLS.find(function(s){ return s.id===id; }); if(!d) return false;
  if(skillLv(id)>=3) return false; if(spState().sp<1) return false;
  if(d.tier>=2){ var low=colSkill(d.col,d.tier-1); if(skillLv(low.id)<2) return false; }
  return true; }
function buySkill(id){ if(!canBuySkill(id)) return false;
  var st=spState(); st.sp-=1; var o=skillsObj(); o[id]=(o[id]||0)+1; skillsSave(o); spSave(st); return true; }
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
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);font-size:13.5px}   /* v121: 아이템 폰트 정합 */ .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:calc(100dvh - 10px);overflow-y:auto} #btn-skill,#btn-profile{font-family:\'Black Han Sans\',\'Jua\',sans-serif;font-size:19px;padding:12px 34px;border-radius:14px;border:2px solid #3d4c73;color:#dfe8ff;background:rgba(18,24,43,.85);box-shadow:0 5px 0 #1c2740,0 9px 18px rgba(0,0,0,.4);text-shadow:0 2px 0 rgba(0,0,0,.6);transition:transform .06s} #btn-skill:active,#btn-profile:active{transform:translateY(3px)} #btn-skill-close,#btn-prf-close{display:block;margin:14px auto 0;width:120px;padding:9px 0;border-radius:12px;border:1.5px solid #FFB300;background:rgba(18,24,43,.85);color:#FFD54F;font-weight:700;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);cursor:pointer} @media (max-width:420px){#btn-skill,#btn-profile{font-size:16px;padding:10px 22px}}';   // v121: 로비 버튼·닫기 — 유물 규격 통일
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">지도 클리어 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
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
  b.classList.toggle('off',st==='off');
  if(st==='off') return;
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
function applyRelics(){
  if(S.relic!=='relic_tower') return;
  for(const t of towers){ if(t.team==='blue'&&!t.__rl){ t.__rl=1; t.maxHp=Math.round(t.maxHp*1.1); t.hp=Math.min(t.maxHp,Math.round(t.hp*1.1)); } }
}
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
function resetProgression(){ try{ localStorage.setItem('ra_prof_backup_v1', JSON.stringify({n:profActive(),s:profSnapshot()}));
    localStorage.setItem('ra_trophies_v1','0'); localStorage.setItem('ra_wins_v1','0');
    localStorage.setItem('ra_sp_v1','{"sp":0,"total":0}'); localStorage.setItem('ra_skills_v1','{}'); localStorage.removeItem('ra_relic_v1');
    S.relic=''; applyRelics(); S._sk={}; syncTrophyChip(); syncGradeVisual(); ['ra_wins_v1','ra_losses_v1','ra_streak_v1','ra_streak_best_v1','ra_daily_v1','ra_lvup_v1','ra_xp_gain_v1','ra_hist30_v1','ra_stats_diff_v1','ra_sp_gain_v1','ra_slot_stats_v1','ra_slot_used_v1'].forEach(function(k2){ try{ localStorage.removeItem(k2); }catch(e2){} }); }catch(e){} return true; }   // v120: 진행도 리셋 — 직전 상태 자동 백업
function undoProgression(){ try{ var b=JSON.parse(localStorage.getItem('ra_prof_backup_v1')||'null'); if(!b) return false;
    profStore(b.n, b.s); if(b.n===profActive()) profApply(b.n); localStorage.removeItem('ra_prof_backup_v1'); }catch(e){ return false; } return true; }   // v120: 복원 — 리셋 직전 진행도 1회 복구
function ensureProfileUI(){
  if(document.getElementById('overlay-profile')) return;
  if(!document.getElementById('prf-style')){ var st2=document.createElement('style'); st2.id='prf-style';
    st2.textContent='.prf-row{display:flex;gap:8px;justify-content:center;margin:8px 0;flex-wrap:wrap} .prf-row input{background:#0B0E1B;border:1px solid #3d4c73;border-radius:8px;color:#dfe8ff;padding:7px 10px;font-family:var(--fd);width:150px} .prf-btn{border:1.5px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;border-radius:9px;padding:7px 14px;font-weight:700;font-family:var(--fd);cursor:pointer} .prf-list{display:flex;flex-direction:column;gap:6px;max-width:320px;margin:10px auto} .prf-item{display:flex;justify-content:space-between;align-items:center;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:7px 12px;color:#dfe8ff} .prf-item.on{border-color:#FFD54F} .prf-item button{border:1px solid #3d4c73;background:rgba(11,17,30,.9);color:#9fb0d0;border-radius:7px;padding:3px 9px;cursor:pointer} .prf-item button:disabled{opacity:.35;cursor:default} #prf-stats{text-align:center;color:#dfe8ff;margin:8px 0} #prf-stats b{color:#FFD54F} #btn-profile-reset{border-color:#e64545;color:#ff9d9d} .prf-item{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif)} .prf-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif)}';   // v121: 프로필 폰트 정합
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-profile'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎖️ 지휘관 프로필</h2><p class="rsub">지휘관별로 진행도가 저장됩니다</p><div id="prf-stats"></div>'
    +'<div class="prf-row"><input id="prf-name" maxlength="12" placeholder="지휘관 이름"><button id="btn-prf-rename" class="prf-btn">이름 변경</button></div>'
    +'<div class="prf-list" id="prf-list"></div>'
    +'<div class="prf-row"><input id="prf-new" maxlength="12" placeholder="새 지휘관 이름"><button id="btn-prf-new" class="prf-btn">생성</button></div>'
    +'<div class="prf-row"><button id="btn-profile-reset" class="prf-btn">진행도 리셋</button><button id="btn-profile-undo" class="prf-btn">복원</button></div>'
    +'<button id="btn-prf-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-prf-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rn=document.getElementById('btn-prf-rename'); if(rn) rn.onclick=function(){ var el=document.getElementById('prf-name'); if(profRename(el.value)){ el.value=''; renderProfileList(); } };
  var nw=document.getElementById('btn-prf-new'); if(nw) nw.onclick=function(){ var el=document.getElementById('prf-new'); if(profNew(el.value)){ el.value=''; renderProfileList(); } else toast('이름을 확인해 주세요(중복·공백 금지)'); };
  var rs=document.getElementById('btn-profile-reset'); if(rs) rs.onclick=function(){ if(confirm('진행도를 초기화할까요? 직전 상태는 복원 버튼으로 되돌릴 수 있어요.')) resetProgression(); renderProfileList(); };
  var ud=document.getElementById('btn-profile-undo'); if(ud) ud.onclick=function(){ if(undoProgression()) toast('직전 진행도를 복원했어요'); renderProfileList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-profile'; b.textContent='🎖️ 프로필';
      b.onclick=function(){ renderProfileList(); ov.classList.remove('hidden'); };
      var sk=document.getElementById('btn-skill'); if(sk&&sk.parentNode===ta) ta.insertBefore(b,sk); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
}
function renderProfileList(){
  var box=document.getElementById('prf-list'); if(!box) return;
  profSync();
  var d=profDb(); var s=profSnapshot();
  var gname=(typeof GRADES!=='undefined'&&GRADES[gradeOf(s.tro)])?GRADES[gradeOf(s.tro)][0]:'—';
  var stEl=document.getElementById('prf-stats');
  if(stEl){ var __L=(function(){try{return parseInt(localStorage.getItem('ra_losses_v1')||'0',10)||0}catch(e){return 0}})(), __W=s.wins||0, __tot=__W+__L, __rate=__tot>0?Math.round(__W*100/__tot):0, __sk=(function(){try{return parseInt(localStorage.getItem('ra_streak_v1')||'0',10)||0}catch(e){return 0}})(), __sb=Math.max(__sk,(function(){try{return parseInt(localStorage.getItem('ra_streak_best_v1')||'0',10)||0}catch(e){return 0}})()), __h30=(function(){try{return JSON.parse(localStorage.getItem('ra_hist30_v1')||'[]')}catch(e){return []}})(), __sd=(function(){try{var x=JSON.parse(localStorage.getItem('ra_stats_diff_v1')||'[]');return (Array.isArray(x)&&x.length>=3)?x:[{w:0,l:0,d:0},{w:0,l:0,d:0},{w:0,l:0,d:0}]}catch(e){return [{w:0,l:0,d:0},{w:0,l:0,d:0},{w:0,l:0,d:0}]}})(), __dn=['쉬움','보통','어려움'], __dd=''; for(var _i=0;_i<3;_i++)__dd+='<span class="ps-d">'+__dn[_i]+' '+__sd[_i].w+'승 '+__sd[_i].l+'패</span>';var __sl=(function(){try{var x=JSON.parse(localStorage.getItem('ra_slot_stats_v1')||'[]');return (Array.isArray(x)&&x.length>=2)?x:[{w:0,l:0},{w:0,l:0}]}catch(e){return [{w:0,l:0},{w:0,l:0}]}})();var __dd2='<span class="ps-h">덱 승률</span>';for(var _j=0;_j<2;_j++){var __t2=__sl[_j].w+__sl[_j].l;__dd2+='<span class="ps-d">덱 '+(_j===0?'A':'B')+' <b>'+(__t2>0?Math.round(__sl[_j].w*100/__t2)+'%':'—')+'</b> ('+__t2+'전)</span>';} stEl.innerHTML='현재: <b>'+d.active+'</b> · 등급 <b>'+gname+'</b><br>트로피 <b>'+s.tro+'</b> · 승리 <b>'+__W+'</b> · SP <b>'+((s.sp&&s.sp.sp)||0)+'</b><div class="ps-grid"><span>승률 <b>'+__rate+'%</b> ('+__tot+'전)</span><span>연승 <b>'+__sk+'</b> · 최고 <b>'+__sb+'</b></span><span class="ps-h">최근 30전</span><span class="ps-hist">'+(__h30.length?__h30.join(' '):'기록 없음')+'</span>'+__dd+__dd2+'</div>'; }
  var nm=document.getElementById('prf-name'); if(nm) nm.placeholder=d.active;
  box.innerHTML='';
  d.list.forEach(function(n){
    var it=document.createElement('div'); it.className='prf-item'+(n===d.active?' on':'');
    var ps=profLoad(n);
    it.innerHTML='<span>'+(n===d.active?'● ':'')+n+'</span>';
    var ctl=document.createElement('span');
    var sel=document.createElement('button'); sel.textContent=n===d.active?'사용 중':'선택'; sel.disabled=(n===d.active);
    sel.onclick=function(){ profSwitch(n); renderProfileList(); };
    var del=document.createElement('button'); del.textContent='삭제'; del.disabled=(n===d.active||d.list.length<=1);
    del.onclick=function(){ if(confirm('지휘관 \''+n+'\'를 삭제할까요?')){ profDelete(n); renderProfileList(); } };
    ctl.appendChild(sel); ctl.appendChild(del); it.appendChild(ctl); box.appendChild(it);
  });
}
/* ---------- v119: P16 전술 연구소 (스킬트리 9노드) ---------- */
var SKILLS_LEGACY=[
 {id:'off1',col:'⚔️',tier:1,name:'무난한 힘',desc:'아군 유닛 공격력 +8%'},
 {id:'off2',col:'⚔️',tier:2,name:'집중 포화',desc:'아군 유닛 공격력 추가 +6%'},
 {id:'off3',col:'⚔️',tier:3,name:'왕실 총공세',desc:'아군 유닛 공격력 추가 +12%'},
 {id:'def1',col:'🛡️',tier:1,name:'굳건한 방벽',desc:'아군 타워 최대 체력 +10%'},
 {id:'def2',col:'🛡️',tier:2,name:'수리 조직',desc:'타워 수리 엘릭서 비용 −1'},
 {id:'def3',col:'🛡️',tier:3,name:'왕실 결계',desc:'아군 타워 최대 체력 추가 +10%'},
 {id:'mag1',col:'🧪',tier:1,name:'신속 채취',desc:'엘릭서 회복 +6%'},
 {id:'mag2',col:'🧪',tier:2,name:'광역 주문',desc:'주문 피해 +10%'},
 {id:'mag3',col:'🧪',tier:3,name:'마나 급류',desc:'엘릭서 회복 추가 +6%'}];
function canBuySkill(id){ var d=SKILLS.find(function(s){ return s.id===id; }); if(!d) return false;
  if(skillLv(id)>=3) return false; if(spState().sp<1) return false;
  if(d.tier>=2){ var low=colSkill(d.col,d.tier-1); if(skillLv(low.id)<2) return false; }
  return true; }
function buySkill(id){ if(!canBuySkill(id)) return false;
  var st=spState(); st.sp-=1; var o=skillsObj(); o[id]=(o[id]||0)+1; skillsSave(o); spSave(st); return true; }
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
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);font-size:13.5px}   /* v121: 아이템 폰트 정합 */ .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:calc(100dvh - 10px);overflow-y:auto} #btn-skill,#btn-profile{font-family:\'Black Han Sans\',\'Jua\',sans-serif;font-size:19px;padding:12px 34px;border-radius:14px;border:2px solid #3d4c73;color:#dfe8ff;background:rgba(18,24,43,.85);box-shadow:0 5px 0 #1c2740,0 9px 18px rgba(0,0,0,.4);text-shadow:0 2px 0 rgba(0,0,0,.6);transition:transform .06s} #btn-skill:active,#btn-profile:active{transform:translateY(3px)} #btn-skill-close,#btn-prf-close{display:block;margin:14px auto 0;width:120px;padding:9px 0;border-radius:12px;border:1.5px solid #FFB300;background:rgba(18,24,43,.85);color:#FFD54F;font-weight:700;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);cursor:pointer} @media (max-width:420px){#btn-skill,#btn-profile{font-size:16px;padding:10px 22px}}';   // v121: 로비 버튼·닫기 — 유물 규격 통일
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">지도 클리어 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
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
  b.classList.toggle('off',st==='off');
  if(st==='off') return;
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
function applyRelics(){
  if(S.relic!=='relic_tower') return;
  for(const t of towers){ if(t.team==='blue'&&!t.__rl){ t.__rl=1; t.maxHp=Math.round(t.maxHp*1.1); t.hp=Math.min(t.maxHp,Math.round(t.hp*1.1)); } }
}
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
function ensureProfileUI(){
  if(document.getElementById('overlay-profile')) return;
  if(!document.getElementById('prf-style')){ var st2=document.createElement('style'); st2.id='prf-style';
    st2.textContent='.prf-row{display:flex;gap:8px;justify-content:center;margin:8px 0;flex-wrap:wrap} .prf-row input{background:#0B0E1B;border:1px solid #3d4c73;border-radius:8px;color:#dfe8ff;padding:7px 10px;font-family:var(--fd);width:150px} .prf-btn{border:1.5px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;border-radius:9px;padding:7px 14px;font-weight:700;font-family:var(--fd);cursor:pointer} .prf-list{display:flex;flex-direction:column;gap:6px;max-width:320px;margin:10px auto} .prf-item{display:flex;justify-content:space-between;align-items:center;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:7px 12px;color:#dfe8ff} .prf-item.on{border-color:#FFD54F} .prf-item button{border:1px solid #3d4c73;background:rgba(11,17,30,.9);color:#9fb0d0;border-radius:7px;padding:3px 9px;cursor:pointer} .prf-item button:disabled{opacity:.35;cursor:default} #prf-stats{text-align:center;color:#dfe8ff;margin:8px 0} #prf-stats b{color:#FFD54F} #btn-profile-reset{border-color:#e64545;color:#ff9d9d} .prf-item{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif)} .prf-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif)}';   // v121: 프로필 폰트 정합
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-profile'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎖️ 지휘관 프로필</h2><p class="rsub">지휘관별로 진행도가 저장됩니다</p><div id="prf-stats"></div>'
    +'<div class="prf-row"><input id="prf-name" maxlength="12" placeholder="지휘관 이름"><button id="btn-prf-rename" class="prf-btn">이름 변경</button></div>'
    +'<div class="prf-list" id="prf-list"></div>'
    +'<div class="prf-row"><input id="prf-new" maxlength="12" placeholder="새 지휘관 이름"><button id="btn-prf-new" class="prf-btn">생성</button></div>'
    +'<div class="prf-row"><button id="btn-profile-reset" class="prf-btn">진행도 리셋</button><button id="btn-profile-undo" class="prf-btn">복원</button></div>'
    +'<button id="btn-prf-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-prf-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rn=document.getElementById('btn-prf-rename'); if(rn) rn.onclick=function(){ var el=document.getElementById('prf-name'); if(profRename(el.value)){ el.value=''; renderProfileList(); } };
  var nw=document.getElementById('btn-prf-new'); if(nw) nw.onclick=function(){ var el=document.getElementById('prf-new'); if(profNew(el.value)){ el.value=''; renderProfileList(); } else toast('이름을 확인해 주세요(중복·공백 금지)'); };
  var rs=document.getElementById('btn-profile-reset'); if(rs) rs.onclick=function(){ if(confirm('진행도를 초기화할까요? 직전 상태는 복원 버튼으로 되돌릴 수 있어요.')) resetProgression(); renderProfileList(); };
  var ud=document.getElementById('btn-profile-undo'); if(ud) ud.onclick=function(){ if(undoProgression()) toast('직전 진행도를 복원했어요'); renderProfileList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-profile'; b.textContent='🎖️ 프로필';
      b.onclick=function(){ renderProfileList(); ov.classList.remove('hidden'); };
      var sk=document.getElementById('btn-skill'); if(sk&&sk.parentNode===ta) ta.insertBefore(b,sk); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
}
function renderProfileList(){
  var box=document.getElementById('prf-list'); if(!box) return;
  profSync();
  var d=profDb(); var s=profSnapshot();
  var gname=(typeof GRADES!=='undefined'&&GRADES[gradeOf(s.tro)])?GRADES[gradeOf(s.tro)][0]:'—';
  var stEl=document.getElementById('prf-stats');
  if(stEl){ var __L=(function(){try{return parseInt(localStorage.getItem('ra_losses_v1')||'0',10)||0}catch(e){return 0}})(), __W=s.wins||0, __tot=__W+__L, __rate=__tot>0?Math.round(__W*100/__tot):0, __sk=(function(){try{return parseInt(localStorage.getItem('ra_streak_v1')||'0',10)||0}catch(e){return 0}})(), __sb=Math.max(__sk,(function(){try{return parseInt(localStorage.getItem('ra_streak_best_v1')||'0',10)||0}catch(e){return 0}})()), __h30=(function(){try{return JSON.parse(localStorage.getItem('ra_hist30_v1')||'[]')}catch(e){return []}})(), __sd=(function(){try{var x=JSON.parse(localStorage.getItem('ra_stats_diff_v1')||'[]');return (Array.isArray(x)&&x.length>=3)?x:[{w:0,l:0,d:0},{w:0,l:0,d:0},{w:0,l:0,d:0}]}catch(e){return [{w:0,l:0,d:0},{w:0,l:0,d:0},{w:0,l:0,d:0}]}})(), __dn=['쉬움','보통','어려움'], __dd=''; for(var _i=0;_i<3;_i++)__dd+='<span class="ps-d">'+__dn[_i]+' '+__sd[_i].w+'승 '+__sd[_i].l+'패</span>';var __sl=(function(){try{var x=JSON.parse(localStorage.getItem('ra_slot_stats_v1')||'[]');return (Array.isArray(x)&&x.length>=2)?x:[{w:0,l:0},{w:0,l:0}]}catch(e){return [{w:0,l:0},{w:0,l:0}]}})();var __dd2='<span class="ps-h">덱 승률</span>';for(var _j=0;_j<2;_j++){var __t2=__sl[_j].w+__sl[_j].l;__dd2+='<span class="ps-d">덱 '+(_j===0?'A':'B')+' <b>'+(__t2>0?Math.round(__sl[_j].w*100/__t2)+'%':'—')+'</b> ('+__t2+'전)</span>';} stEl.innerHTML='현재: <b>'+d.active+'</b> · 등급 <b>'+gname+'</b><br>트로피 <b>'+s.tro+'</b> · 승리 <b>'+__W+'</b> · SP <b>'+((s.sp&&s.sp.sp)||0)+'</b><div class="ps-grid"><span>승률 <b>'+__rate+'%</b> ('+__tot+'전)</span><span>연승 <b>'+__sk+'</b> · 최고 <b>'+__sb+'</b></span><span class="ps-h">최근 30전</span><span class="ps-hist">'+(__h30.length?__h30.join(' '):'기록 없음')+'</span>'+__dd+__dd2+'</div>'; }
  var nm=document.getElementById('prf-name'); if(nm) nm.placeholder=d.active;
  box.innerHTML='';
  d.list.forEach(function(n){
    var it=document.createElement('div'); it.className='prf-item'+(n===d.active?' on':'');
    var ps=profLoad(n);
    it.innerHTML='<span>'+(n===d.active?'● ':'')+n+'</span>';
    var ctl=document.createElement('span');
    var sel=document.createElement('button'); sel.textContent=n===d.active?'사용 중':'선택'; sel.disabled=(n===d.active);
    sel.onclick=function(){ profSwitch(n); renderProfileList(); };
    var del=document.createElement('button'); del.textContent='삭제'; del.disabled=(n===d.active||d.list.length<=1);
    del.onclick=function(){ if(confirm('지휘관 \''+n+'\'를 삭제할까요?')){ profDelete(n); renderProfileList(); } };
    ctl.appendChild(sel); ctl.appendChild(del); it.appendChild(ctl); box.appendChild(it);
  });
}
/* ---------- v119: P16 전술 연구소 (스킬트리 9노드) ---------- */
var SKILLS_LEGACY=[
 {id:'off1',col:'⚔️',tier:1,name:'무난한 힘',desc:'아군 유닛 공격력 +8%'},
 {id:'off2',col:'⚔️',tier:2,name:'집중 포화',desc:'아군 유닛 공격력 추가 +6%'},
 {id:'off3',col:'⚔️',tier:3,name:'왕실 총공세',desc:'아군 유닛 공격력 추가 +12%'},
 {id:'def1',col:'🛡️',tier:1,name:'굳건한 방벽',desc:'아군 타워 최대 체력 +10%'},
 {id:'def2',col:'🛡️',tier:2,name:'수리 조직',desc:'타워 수리 엘릭서 비용 −1'},
 {id:'def3',col:'🛡️',tier:3,name:'왕실 결계',desc:'아군 타워 최대 체력 추가 +10%'},
 {id:'mag1',col:'🧪',tier:1,name:'신속 채취',desc:'엘릭서 회복 +6%'},
 {id:'mag2',col:'🧪',tier:2,name:'광역 주문',desc:'주문 피해 +10%'},
 {id:'mag3',col:'🧪',tier:3,name:'마나 급류',desc:'엘릭서 회복 추가 +6%'}];
function canBuySkill(id){ var d=SKILLS.find(function(s){ return s.id===id; }); if(!d) return false;
  if(skillLv(id)>=3) return false; if(spState().sp<1) return false;
  if(d.tier>=2){ var low=colSkill(d.col,d.tier-1); if(skillLv(low.id)<2) return false; }
  return true; }
function buySkill(id){ if(!canBuySkill(id)) return false;
  var st=spState(); st.sp-=1; var o=skillsObj(); o[id]=(o[id]||0)+1; skillsSave(o); spSave(st); return true; }
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
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);font-size:13.5px}   /* v121: 아이템 폰트 정합 */ .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:calc(100dvh - 10px);overflow-y:auto} #btn-skill,#btn-profile{font-family:\'Black Han Sans\',\'Jua\',sans-serif;font-size:19px;padding:12px 34px;border-radius:14px;border:2px solid #3d4c73;color:#dfe8ff;background:rgba(18,24,43,.85);box-shadow:0 5px 0 #1c2740,0 9px 18px rgba(0,0,0,.4);text-shadow:0 2px 0 rgba(0,0,0,.6);transition:transform .06s} #btn-skill:active,#btn-profile:active{transform:translateY(3px)} #btn-skill-close,#btn-prf-close{display:block;margin:14px auto 0;width:120px;padding:9px 0;border-radius:12px;border:1.5px solid #FFB300;background:rgba(18,24,43,.85);color:#FFD54F;font-weight:700;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);cursor:pointer} @media (max-width:420px){#btn-skill,#btn-profile{font-size:16px;padding:10px 22px}}';   // v121: 로비 버튼·닫기 — 유물 규격 통일
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">지도 클리어 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
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
  b.classList.toggle('off',st==='off');
  if(st==='off') return;
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
function applyRelics(){
  if(S.relic!=='relic_tower') return;
  for(const t of towers){ if(t.team==='blue'&&!t.__rl){ t.__rl=1; t.maxHp=Math.round(t.maxHp*1.1); t.hp=Math.min(t.maxHp,Math.round(t.hp*1.1)); } }
}
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
function ensureProfileUI(){
  if(document.getElementById('overlay-profile')) return;
  if(!document.getElementById('prf-style')){ var st2=document.createElement('style'); st2.id='prf-style';
    st2.textContent='.prf-row{display:flex;gap:8px;justify-content:center;margin:8px 0;flex-wrap:wrap} .prf-row input{background:#0B0E1B;border:1px solid #3d4c73;border-radius:8px;color:#dfe8ff;padding:7px 10px;font-family:var(--fd);width:150px} .prf-btn{border:1.5px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;border-radius:9px;padding:7px 14px;font-weight:700;font-family:var(--fd);cursor:pointer} .prf-list{display:flex;flex-direction:column;gap:6px;max-width:320px;margin:10px auto} .prf-item{display:flex;justify-content:space-between;align-items:center;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:7px 12px;color:#dfe8ff} .prf-item.on{border-color:#FFD54F} .prf-item button{border:1px solid #3d4c73;background:rgba(11,17,30,.9);color:#9fb0d0;border-radius:7px;padding:3px 9px;cursor:pointer} .prf-item button:disabled{opacity:.35;cursor:default} #prf-stats{text-align:center;color:#dfe8ff;margin:8px 0} #prf-stats b{color:#FFD54F} #btn-profile-reset{border-color:#e64545;color:#ff9d9d} .prf-item{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif)} .prf-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif)}';   // v121: 프로필 폰트 정합
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-profile'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎖️ 지휘관 프로필</h2><p class="rsub">지휘관별로 진행도가 저장됩니다</p><div id="prf-stats"></div>'
    +'<div class="prf-row"><input id="prf-name" maxlength="12" placeholder="지휘관 이름"><button id="btn-prf-rename" class="prf-btn">이름 변경</button></div>'
    +'<div class="prf-list" id="prf-list"></div>'
    +'<div class="prf-row"><input id="prf-new" maxlength="12" placeholder="새 지휘관 이름"><button id="btn-prf-new" class="prf-btn">생성</button></div>'
    +'<div class="prf-row"><button id="btn-profile-reset" class="prf-btn">진행도 리셋</button><button id="btn-profile-undo" class="prf-btn">복원</button></div>'
    +'<button id="btn-prf-close">닫기</button></div>';
  document.body.appendChild(ov);
  ov.addEventListener('click',function(ev){ if(ev.target===ov) ov.classList.add('hidden'); });
  var cl=document.getElementById('btn-prf-close'); if(cl) cl.onclick=function(){ ov.classList.add('hidden'); };
  var rn=document.getElementById('btn-prf-rename'); if(rn) rn.onclick=function(){ var el=document.getElementById('prf-name'); if(profRename(el.value)){ el.value=''; renderProfileList(); } };
  var nw=document.getElementById('btn-prf-new'); if(nw) nw.onclick=function(){ var el=document.getElementById('prf-new'); if(profNew(el.value)){ el.value=''; renderProfileList(); } else toast('이름을 확인해 주세요(중복·공백 금지)'); };
  var rs=document.getElementById('btn-profile-reset'); if(rs) rs.onclick=function(){ if(confirm('진행도를 초기화할까요? 직전 상태는 복원 버튼으로 되돌릴 수 있어요.')) resetProgression(); renderProfileList(); };
  var ud=document.getElementById('btn-profile-undo'); if(ud) ud.onclick=function(){ if(undoProgression()) toast('직전 진행도를 복원했어요'); renderProfileList(); };
  var n=0, tick=function(){
    var ta=document.getElementById('title-actions');
    if(ta){ var b=document.createElement('button'); b.id='btn-profile'; b.textContent='🎖️ 프로필';
      b.onclick=function(){ renderProfileList(); ov.classList.remove('hidden'); };
      var sk=document.getElementById('btn-skill'); if(sk&&sk.parentNode===ta) ta.insertBefore(b,sk); else ta.appendChild(b); return; }
    if(++n<40) setTimeout(tick,150); };
  tick();
}
function renderProfileList(){
  var box=document.getElementById('prf-list'); if(!box) return;
  profSync();
  var d=profDb(); var s=profSnapshot();
  var gname=(typeof GRADES!=='undefined'&&GRADES[gradeOf(s.tro)])?GRADES[gradeOf(s.tro)][0]:'—';
  var stEl=document.getElementById('prf-stats');
  if(stEl){ var __L=(function(){try{return parseInt(localStorage.getItem('ra_losses_v1')||'0',10)||0}catch(e){return 0}})(), __W=s.wins||0, __tot=__W+__L, __rate=__tot>0?Math.round(__W*100/__tot):0, __sk=(function(){try{return parseInt(localStorage.getItem('ra_streak_v1')||'0',10)||0}catch(e){return 0}})(), __sb=Math.max(__sk,(function(){try{return parseInt(localStorage.getItem('ra_streak_best_v1')||'0',10)||0}catch(e){return 0}})()), __h30=(function(){try{return JSON.parse(localStorage.getItem('ra_hist30_v1')||'[]')}catch(e){return []}})(), __sd=(function(){try{var x=JSON.parse(localStorage.getItem('ra_stats_diff_v1')||'[]');return (Array.isArray(x)&&x.length>=3)?x:[{w:0,l:0,d:0},{w:0,l:0,d:0},{w:0,l:0,d:0}]}catch(e){return [{w:0,l:0,d:0},{w:0,l:0,d:0},{w:0,l:0,d:0}]}})(), __dn=['쉬움','보통','어려움'], __dd=''; for(var _i=0;_i<3;_i++)__dd+='<span class="ps-d">'+__dn[_i]+' '+__sd[_i].w+'승 '+__sd[_i].l+'패</span>';var __sl=(function(){try{var x=JSON.parse(localStorage.getItem('ra_slot_stats_v1')||'[]');return (Array.isArray(x)&&x.length>=2)?x:[{w:0,l:0},{w:0,l:0}]}catch(e){return [{w:0,l:0},{w:0,l:0}]}})();var __dd2='<span class="ps-h">덱 승률</span>';for(var _j=0;_j<2;_j++){var __t2=__sl[_j].w+__sl[_j].l;__dd2+='<span class="ps-d">덱 '+(_j===0?'A':'B')+' <b>'+(__t2>0?Math.round(__sl[_j].w*100/__t2)+'%':'—')+'</b> ('+__t2+'전)</span>';} stEl.innerHTML='현재: <b>'+d.active+'</b> · 등급 <b>'+gname+'</b><br>트로피 <b>'+s.tro+'</b> · 승리 <b>'+__W+'</b> · SP <b>'+((s.sp&&s.sp.sp)||0)+'</b><div class="ps-grid"><span>승률 <b>'+__rate+'%</b> ('+__tot+'전)</span><span>연승 <b>'+__sk+'</b> · 최고 <b>'+__sb+'</b></span><span class="ps-h">최근 30전</span><span class="ps-hist">'+(__h30.length?__h30.join(' '):'기록 없음')+'</span>'+__dd+__dd2+'</div>'; }
  var nm=document.getElementById('prf-name'); if(nm) nm.placeholder=d.active;
  box.innerHTML='';
  d.list.forEach(function(n){
    var it=document.createElement('div'); it.className='prf-item'+(n===d.active?' on':'');
    var ps=profLoad(n);
    it.innerHTML='<span>'+(n===d.active?'● ':'')+n+'</span>';
    var ctl=document.createElement('span');
    var sel=document.createElement('button'); sel.textContent=n===d.active?'사용 중':'선택'; sel.disabled=(n===d.active);
    sel.onclick=function(){ profSwitch(n); renderProfileList(); };
    var del=document.createElement('button'); del.textContent='삭제'; del.disabled=(n===d.active||d.list.length<=1);
    del.onclick=function(){ if(confirm('지휘관 \''+n+'\'를 삭제할까요?')){ profDelete(n); renderProfileList(); } };
    ctl.appendChild(sel); ctl.appendChild(del); it.appendChild(ctl); box.appendChild(it);
  });
}
/* ---------- v119: P16 전술 연구소 (스킬트리 9노드) ---------- */
var SKILLS_LEGACY=[
 {id:'off1',col:'⚔️',tier:1,name:'무난한 힘',desc:'아군 유닛 공격력 +8%'},
 {id:'off2',col:'⚔️',tier:2,name:'집중 포화',desc:'아군 유닛 공격력 추가 +6%'},
 {id:'off3',col:'⚔️',tier:3,name:'왕실 총공세',desc:'아군 유닛 공격력 추가 +12%'},
 {id:'def1',col:'🛡️',tier:1,name:'굳건한 방벽',desc:'아군 타워 최대 체력 +10%'},
 {id:'def2',col:'🛡️',tier:2,name:'수리 조직',desc:'타워 수리 엘릭서 비용 −1'},
 {id:'def3',col:'🛡️',tier:3,name:'왕실 결계',desc:'아군 타워 최대 체력 추가 +10%'},
 {id:'mag1',col:'🧪',tier:1,name:'신속 채취',desc:'엘릭서 회복 +6%'},
 {id:'mag2',col:'🧪',tier:2,name:'광역 주문',desc:'주문 피해 +10%'},
 {id:'mag3',col:'🧪',tier:3,name:'마나 급류',desc:'엘릭서 회복 추가 +6%'}];
function canBuySkill(id){ var d=SKILLS.find(function(s){ return s.id===id; }); if(!d) return false;
  if(skillLv(id)>=3) return false; if(spState().sp<1) return false;
  if(d.tier>=2){ var low=colSkill(d.col,d.tier-1); if(skillLv(low.id)<2) return false; }
  return true; }
function buySkill(id){ if(!canBuySkill(id)) return false;
  var st=spState(); st.sp-=1; var o=skillsObj(); o[id]=(o[id]||0)+1; skillsSave(o); spSave(st); return true; }
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
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);font-size:13.5px}   /* v121: 아이템 폰트 정합 */ .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:calc(100dvh - 10px);overflow-y:auto} #btn-skill,#btn-profile{font-family:\'Black Han Sans\',\'Jua\',sans-serif;font-size:19px;padding:12px 34px;border-radius:14px;border:2px solid #3d4c73;color:#dfe8ff;background:rgba(18,24,43,.85);box-shadow:0 5px 0 #1c2740,0 9px 18px rgba(0,0,0,.4);text-shadow:0 2px 0 rgba(0,0,0,.6);transition:transform .06s} #btn-skill:active,#btn-profile:active{transform:translateY(3px)} #btn-skill-close,#btn-prf-close{display:block;margin:14px auto 0;width:120px;padding:9px 0;border-radius:12px;border:1.5px solid #FFB300;background:rgba(18,24,43,.85);color:#FFD54F;font-weight:700;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);cursor:pointer} @media (max-width:420px){#btn-skill,#btn-profile{font-size:16px;padding:10px 22px}}';   // v121: 로비 버튼·닫기 — 유물 규격 통일
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">지도 클리어 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
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
  b.classList.toggle('off',st==='off');
  if(st==='off') return;
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
function applyRelics(){
  if(S.relic!=='relic_tower') return;
  for(const t of towers){ if(t.team==='blue'&&!t.__rl){ t.__rl=1; t.maxHp=Math.round(t.maxHp*1.1); t.hp=Math.min(t.maxHp,Math.round(t.hp*1.1)); } }
}
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
var SKILLS_LEGACY=[
 {id:'off1',col:'⚔️',tier:1,name:'무난한 힘',desc:'아군 유닛 공격력 +8%'},
 {id:'off2',col:'⚔️',tier:2,name:'집중 포화',desc:'아군 유닛 공격력 추가 +6%'},
 {id:'off3',col:'⚔️',tier:3,name:'왕실 총공세',desc:'아군 유닛 공격력 추가 +12%'},
 {id:'def1',col:'🛡️',tier:1,name:'굳건한 방벽',desc:'아군 타워 최대 체력 +10%'},
 {id:'def2',col:'🛡️',tier:2,name:'수리 조직',desc:'타워 수리 엘릭서 비용 −1'},
 {id:'def3',col:'🛡️',tier:3,name:'왕실 결계',desc:'아군 타워 최대 체력 추가 +10%'},
 {id:'mag1',col:'🧪',tier:1,name:'신속 채취',desc:'엘릭서 회복 +6%'},
 {id:'mag2',col:'🧪',tier:2,name:'광역 술영',desc:'주문 피해 +10%'},
 {id:'mag3',col:'🧪',tier:3,name:'마나 급류',desc:'엘릭서 회복 추가 +6%'}];
function skillLv(k){ try{ var o=JSON.parse(localStorage.getItem('ra_skills_v1')||'{}'); return o[k]||0; }catch(e){ return 0; } }
function spState(){ try{ var s=JSON.parse(localStorage.getItem('ra_sp_v1')||'{"sp":0,"total":0}'); if(typeof s.sp!=='number') s={sp:0,total:0}; return s; }catch(e){ return {sp:0,total:0}; } }
function spSave(st){ try{ localStorage.setItem('ra_sp_v1', JSON.stringify(st)); }catch(e){} try{ profSync(); }catch(e){} }   // v120: SP 변경 프로필 미러
function skillsObj(){ try{ return JSON.parse(localStorage.getItem('ra_skills_v1')||'{}'); }catch(e){ return {}; } }
function skillsSave(o){ try{ localStorage.setItem('ra_skills_v1', JSON.stringify(o)); }catch(e){} try{ profSync(); }catch(e){} }   // v120: 스킬 변경 프로필 미러
function colSkill(col,tier){ return SKILLS.find(function(s){ return s.col===col&&s.tier===tier; }); }
function canBuySkill(id){ var d=SKILLS.find(function(s){ return s.id===id; }); if(!d) return false;
  if(skillLv(id)>=3) return false; if(spState().sp<1) return false;
  if(d.tier>=2){ var low=colSkill(d.col,d.tier-1); if(skillLv(low.id)<2) return false; }
  return true; }
function buySkill(id){ if(!canBuySkill(id)) return false;
  var st=spState(); st.sp-=1; var o=skillsObj(); o[id]=(o[id]||0)+1; skillsSave(o); spSave(st); return true; }
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
    st2.textContent='#sk-grid{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;max-width:660px;margin:10px auto} .sk-col{flex:1;min-width:172px;display:flex;flex-direction:column;gap:8px} .sk-item{position:relative;background:rgba(18,24,43,.9);border:1px solid #3d4c73;border-radius:10px;padding:8px 44px 8px 10px;color:#dfe8ff;text-align:left;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);font-size:13.5px}   /* v121: 아이템 폰트 정합 */ .sk-item small{display:block;color:#9fb0d0;font-size:11px;margin:2px 0 6px} .sk-item button{font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);position:absolute;right:8px;width:26px;height:26px;border-radius:8px;border:1px solid #FFB300;background:rgba(18,24,43,.9);color:#FFD54F;font-weight:800;cursor:pointer} .sk-item button:disabled{opacity:.35;cursor:default} .sk-item .sk-lv{color:#FFD54F;font-weight:700;font-size:12px} .sk-item.t2{border-color:#7f8fbb} .sk-item.t3{border-color:#c77dff} #sk-sp{text-align:center;color:#FFD54F;font-weight:700;margin:6px 0} #btn-skill-reset{display:block;margin:10px auto 0;width:130px;padding:8px 0;border-radius:10px;border:1.5px solid #e64545;background:rgba(18,24,43,.85);color:#ff9d9d;font-weight:700;cursor:pointer} #overlay-skill .rpanel{max-height:calc(100dvh - 10px);overflow-y:auto} #btn-skill,#btn-profile{font-family:\'Black Han Sans\',\'Jua\',sans-serif;font-size:19px;padding:12px 34px;border-radius:14px;border:2px solid #3d4c73;color:#dfe8ff;background:rgba(18,24,43,.85);box-shadow:0 5px 0 #1c2740,0 9px 18px rgba(0,0,0,.4);text-shadow:0 2px 0 rgba(0,0,0,.6);transition:transform .06s} #btn-skill:active,#btn-profile:active{transform:translateY(3px)} #btn-skill-close,#btn-prf-close{display:block;margin:14px auto 0;width:120px;padding:9px 0;border-radius:12px;border:1.5px solid #FFB300;background:rgba(18,24,43,.85);color:#FFD54F;font-weight:700;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);cursor:pointer} @media (max-width:420px){#btn-skill,#btn-profile{font-size:16px;padding:10px 22px}}';   // v121: 로비 버튼·닫기 — 유물 규격 통일
    document.head.appendChild(st2); }
  var ov=document.createElement('div'); ov.id='overlay-skill'; ov.className='overlay hidden';
  ov.innerHTML='<div class="rpanel"><h2>🎓 전술 연구소</h2><p class="rsub">지도 클리어 보상 SP로 영구 강화 — 연쇄 환불·총 SP 보존</p><div id="sk-sp"></div><div id="sk-grid"></div><button id="btn-skill-reset">전체 초기화</button><button id="btn-skill-close">닫기</button></div>';
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
  b.classList.toggle('off',st==='off');
  if(st==='off') return;
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
function castSpell(key,team,x,y){ try{ if(team==='blue') DPSW.cnt[key]=(DPSW.cnt[key]||0)+1; }catch(e){}   /* v148: 주문도 배치수 집계 */ var __pn=projs.length; castSpellBase(key,team,x,y); try{ if(team==='blue'&&S.relic==='relic_spell'&&projs.length>__pn){ for(var __i=__pn;__i<projs.length;__i++){ if(projs[__i]&&projs[__i].dmg) projs[__i].dmg=Math.round(projs[__i].dmg*1.25); } } }catch(e){} }
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

