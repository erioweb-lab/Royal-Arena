/* royal-arena v189 QA driver — ?qa=walk|battle|all (&quit=1) 이 있을 때만 동작. 없으면 훅만 설치(no-op). */
(function(){
if(window.__qaDrv)return; window.__qaDrv=1;
var errs=[],warns=[],notes=[];
function loc(e){return (e&&((e.message||'?')+'@'+(e.filename||'').split('/').pop()+':'+(e.lineno||0)))||'?';}
window.addEventListener('error',function(e){var st=(e.error&&e.error.stack)||'';errs.push('err:'+loc(e)+(st?(' ^ '+st.replace(/\n/g,' < ').slice(0,150)):''));},true);
window.addEventListener('unhandledrejection',function(e){errs.push('rej:'+((e.reason&&e.reason.message)||e.reason));},true);
var ce=console.error,cw=console.warn;
console.error=function(){try{errs.push('con:'+String(arguments[0]).slice(0,140));ce.apply(console,arguments);}catch(_){}};
console.warn=function(){try{warns.push(String(arguments[0]).slice(0,140));cw.apply(console,arguments);}catch(_){}};
window.__qa={errs:errs,warns:warns,notes:notes};
var q=new URLSearchParams(location.search);
var mode=q.get('qa');
if(!mode)return;
/* QA 모드: 워치독 자동 새로고침 루프 차단(qa-driver가 워치독보다 먼저 로드됨) */
window.addEventListener('error',function(e){e.stopImmediatePropagation();},true);
document.addEventListener('ra-crash',function(e){e.stopImmediatePropagation();errs.push('crash:'+(e.detail||''));},true);
var ov=document.createElement('div');
ov.style.cssText='position:fixed;top:46px;left:4px;z-index:99999;background:rgba(0,0,0,.88);color:#8dff8d;font:700 12px monospace;padding:8px 12px;border-radius:10px;max-width:94vw;white-space:pre-wrap;pointer-events:none;border:2px solid #2aff2a';
document.documentElement.appendChild(ov);
if(q.get('qahide')==='1'){ ov.style.display='none'; }   /* v256: 증거 캡처용 — QA 오버레이만 숨김(드라이버 로직 유지) */
function set(t){ov.textContent='QA '+t;}
set(mode+' BOOT');
function vis(el){var r=el.getBoundingClientRect();return r.width>0&&r.height>0&&!el.disabled;}
function clickEl(el){el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));}
function walkButtons(){return [].slice.call(document.querySelectorAll('#screen-title button, #deck-pick > *')).filter(function(b){return vis(b)&&b.id!=='btn-start';});}
function tryClose(){
  var c=[].slice.call(document.querySelectorAll('button[id*="close" i]')).filter(vis);
  if(c.length){clickEl(c[0]);return 'x:'+c[0].id;}
  try{document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));}catch(e){}
  return 'esc';
}
function pixCount(){
  try{
    var c=document.querySelector('#screen-battle canvas')||document.querySelector('canvas');
    if(!c||!c.width)return 'PIX:0';
    var s=Math.min(1,96/Math.max(c.width,c.height)),w2=Math.max(1,Math.round(c.width*s)),h2=Math.max(1,Math.round(c.height*s));
    var t=document.createElement('canvas');t.width=w2;t.height=h2;
    var g=t.getContext('2d');g.drawImage(c,0,0,w2,h2);
    var d=g.getImageData(0,0,w2,h2).data,n=0;
    for(var i=0;i<d.length;i+=4){if(d[i+3]>10&&(d[i]>12||d[i+1]>12||d[i+2]>12))n++;}
    return 'PIX:'+n+'/'+(w2*h2);
  }catch(e){return 'PIXERR:'+(e.message||'?');}
}
function ovfCount(){
  var n=0; try{ var vw=window.innerWidth;
    [].slice.call(document.querySelectorAll('#screen-battle *, #screen-title *')).forEach(function(el){
      if(el.offsetParent===null||el.id==='verchip'||el.closest('#verchip')) return;
      var r=el.getBoundingClientRect();
      if(r.width>2&&(r.right>vw+2||r.left<-2)) n++;
    });
  }catch(e){ } return n;
}
function battleVisible(){var b=document.querySelector('#screen-battle');return !!(b&&!b.classList.contains('hidden'));}
function report(extra){set(mode+' DONE | ERR:'+errs.length+' W:'+warns.length+' OVF:'+ovfCount()+' | '+extra+(errs.length?('\nE1:'+errs.slice(0,2).join(' | ')):''));}
function quitBattle(){
  try{
    var qb=document.querySelector('#btn-quit');
    if(qb&&vis(qb))clickEl(qb);
    setTimeout(function(){
      var conf=[].slice.call(document.querySelectorAll('button')).filter(function(b){return vis(b)&&/기권|확인|예$/.test((b.textContent||'').trim())&&b.id!=='btn-quit';});
      if(conf.length)clickEl(conf[0]);
      if(q.get('hold')==='1'){}else setTimeout(function(){
        var home=[].slice.call(document.querySelectorAll('#overlay-result button')).filter(function(b){return vis(b)&&/메인|홈/.test((b.textContent||''));});
        if(home.length)clickEl(home[0]);
      },900);
    },900);
  }catch(e){}
}
function runBattle(cb){
  var st=document.querySelector('#btn-start');
  if(!st||!vis(st)){cb('BATTLE:FAIL(no-btn)');return;}
  clickEl(st);
  setTimeout(function(){
    var tm=document.querySelector('#timer');
    cb('BATTLE:'+(battleVisible()?'OK':'FAIL')+' '+pixCount()+' TIME:'+(tm&&tm.textContent?'ok':'empty')+' ENEMYD:'+(function(){try{var q2=window.__qaDecks;return q2?(q2.blue===q2.red?'SAME':'diff'):'n/a'}catch(e){return 'n/a'}})())+' HUD:'+(function(){try{var vw=window.innerWidth,vh=window.innerHeight,gg=function(s){var e=document.querySelector(s);return e?e.getBoundingClientRect():null},rt=gg('#timer'),so=gg('#btn-sound'),ks=gg('#ks-btn')||gg('.kingshot-btn'),rp=gg('#repair-btn')||gg('.repair-btn'),dp=document.getElementById('dpsw'),ok=0;if(rt&&rt.top<26&&rt.left<26)ok++;if(so&&so.right>vw-26&&so.top<26)ok++;if(ks&&ks.bottom>vh-26&&ks.left<26)ok++;if(rp&&rp.bottom>vh-26&&rp.right>vw-26)ok++;var dop=dp?parseFloat(getComputedStyle(dp).opacity):1,dm=dp?(function(){var r=dp.getBoundingClientRect();return r.top>vh*0.3&&r.top<vh*0.65;}):false;return ok+'/4 '+(dop<0.9&&dm?'DPS-mid':'DPS-off');}catch(e){return 'n/a'}})();
  },(q.get('quit')==='1'?1400:3800));
}
  if(q.get('screen')&&mode!=='battle'){ (function(){   /* v230: 직접 강제 개방 — 실버튼 클릭(동적 오버레이 생성) 후 감시 루프로 개방 유지 */
    var SM={hof:'명예의 전당',profile:'프로필',relic:'유물',skill:'전술 연구소',info:'게임 방법'};
    var sn=q.get('screen'), tries=0;
    function visOv(){ var l=[].slice.call(document.querySelectorAll('[id^="overlay-"]')).filter(function(o){return !o.classList.contains('hidden')&&o.offsetWidth>60&&o.offsetHeight>60;}); return l[0]||null; }
    function keep(){ var o=visOv(); if(o){ setInterval(function(){ try{ o.classList.remove('hidden'); }catch(e){} },300); set('SCREEN-'+sn+':OPEN:'+(o.id||'anon')); return true; } return false; }
    function attempt(){ tries++;
      var btn=[].slice.call(document.querySelectorAll('#screen-title button,#title-actions button')).filter(function(b){return vis(b)&&(b.textContent||'').indexOf(SM[sn])>=0;})[0];
      if(btn){ try{ btn.click(); }catch(e){} ['pointerdown','mousedown','pointerup','mouseup','click'].forEach(function(t){ try{ btn.dispatchEvent(new Event(t,{bubbles:true,cancelable:true})); }catch(e){} }); }
      setTimeout(function(){ if(keep()) return; if(tries<10){ setTimeout(attempt,400); } else { set('SCREEN-'+sn+':FAIL'); } },450);
    }
    setTimeout(attempt,350);
  })(); }
  if(q.get('screen')==='codex'){ (function(){   /* v230: 도감 섹션 강제 표시 — ui-patch display:none 무력화 */
    var tries=0;
    function go(){ tries++; var cx=document.getElementById('codex')||document.querySelector('#screen-title .t-codex,#screen-title .cards-sec');
      if(cx){ try{ cx.style.setProperty('display','block','important'); cx.scrollIntoView({block:'start'}); }catch(e){} set('SCREEN-codex:SHOWN'); }
      else if(tries<10){ setTimeout(go,400); } else { set('SCREEN-codex:FAIL'); } }
    setTimeout(go,400);
  })(); }
    if(mode==='walk'){ setTimeout(function(){ try{ var sc=document.getElementById('screen-title'); if(!sc){ set('TG:no-title'); return; }   /* v272: 메인 간극 숫자 실측 */
    var rs={}; [].slice.call(sc.querySelectorAll('button')).forEach(function(b){ var r=b.getBoundingClientRect(); if(r.width<10||r.top<0) return; var k=Math.round(r.top/12); (rs[k]=rs[k]||[]).push(r); });
    var ks=Object.keys(rs).map(Number).sort(function(a,b){return a-b;}); var o=[],hg=[],vg=[];
    ks.forEach(function(k,i){ var row=rs[k].sort(function(a,b){return a.left-b.left;}); if(row.length<2) return; var mn=1e9,mx=0; for(var j=1;j<row.length;j++){ var g=Math.round(row[j].left-row[j-1].right); if(g<0)g=0; if(g<mn)mn=g; if(g>mx)mx=g; } if(mn<1e9){ hg.push(mn);hg.push(mx); o.push('r'+i+'n'+row.length+'g'+mn+'-'+mx); } });
    for(var i=1;i<ks.length;i++){ var pv=rs[ks[i-1]],cu=rs[ks[i]]; var pb=Math.max.apply(null,pv.map(function(r){return r.bottom;})); var ct=Math.min.apply(null,cu.map(function(r){return r.top;})); var v=Math.round(ct-pb); if(v>0&&v<200) vg.push(v); }
    if(hg.length&&vg.length) o.push('h'+Math.min.apply(null,hg)+'-'+Math.max.apply(null,hg)+'/v'+Math.min.apply(null,vg)+'-'+Math.max.apply(null,vg));
    set('TG:'+o.join('|'));
  }catch(e){ set('TG:err'); } },500); }
  if(mode==='deck'){ setTimeout(function(){ try{ var out=[];   /* v250: 덱슬롯 지오메트리 실측 */
    [].slice.call(document.querySelectorAll('#deck-edit button[data-slot]')).forEach(function(b,i){ out.push('s'+i+':h'+b.offsetHeight+'/sh'+b.scrollHeight+'/w'+b.clientWidth+'/sw'+b.scrollWidth); });
    var de=document.getElementById('deck-edit'); if(de){ out.push('de:sh'+de.scrollHeight+'/ch'+de.clientHeight+'/pb'+getComputedStyle(de).paddingBottom); var __lp=[].slice.call(de.querySelectorAll('[data-add]')).pop(); if(__lp){ var __dr=de.getBoundingClientRect(),__lr=__lp.getBoundingClientRect(); out.push('lastpool/b'+Math.round(__lr.bottom)+'/deob'+Math.round(__dr.bottom)+((__lr.bottom>__dr.bottom+0.5)?'/!CUT':'/vis')); } }
    set('SLOTGEO:'+out.join(' | '));   /* v253: 지연 후 출력 */
  }catch(e){ set('SLOTGEO:err'); } },1500); }
    if(mode==='deck'){ setTimeout(function(){ try{ var de=document.getElementById('deck-edit'); if(!de){ set('GAPCHK:no-de'); return; }   /* v272: 간극+수용 숫자 실측 */
    var db=de.getBoundingClientRect(); var out=[];
    var sl=[].slice.call(de.querySelectorAll('button[data-slot]')).map(function(b){return b.getBoundingClientRect();}).sort(function(a,b){return a.left-b.left;});
    if(sl.length>1) out.push('sg'+Math.round(sl[1].left-sl[0].right));
    var ab=[].slice.call(de.querySelectorAll('#dk-save,#btn-deck-random,#dk-close')).map(function(b){return b.getBoundingClientRect();}).sort(function(a,b){return a.left-b.left;});
    if(ab.length===3){ out.push('a'+Math.round(ab[1].left-ab[0].right)+'x'+Math.round(ab[2].left-ab[1].right)); out.push('m'+Math.round(ab[0].left-db.left)+'x'+Math.round(db.right-ab[2].right)); out.push('w'+Math.round(ab[0].width)+'x'+Math.round(ab[1].width)+'x'+Math.round(ab[2].width)); }
    var pb=ab.map(function(r){return Math.round(r.top)+'x'+Math.round(r.bottom);}).join('/'); out.push('p'+pb);
    set('GAPCHK:'+out.join('/'));
  }catch(e){ set('GAPCHK:err'); } },2400); }
  
  if(mode==='deck'){ setTimeout(function(){
    var db=document.getElementById('btn-deck-edit')||[].slice.call(document.querySelectorAll('#screen-title button')).filter(function(b){return /덱 편성/.test(b.textContent||'')})[0];
    if(!db){ set(mode+' DECK:FAIL(no-btn)'); return; }
    clickEl(db);
    setTimeout(function(){
      var de=document.getElementById('deck-edit');
      var trunc=0,clip=0;
      if(de){ [].slice.call(de.querySelectorAll('.dk b,.dk span,.dk div')).forEach(function(el){ if(el.scrollWidth>el.clientWidth+1) trunc++; });
        [].slice.call(de.querySelectorAll('button')).forEach(function(b){ if(b.scrollHeight>b.clientHeight+2) clip++; }); }
      var rnd=document.getElementById('btn-deck-random'); var slab=rnd&&rnd.clientHeight>90?1:0;
      set(mode+' DECK:'+(de?'OK':'FAIL')+' LBL-trunc:'+trunc+' BTN-clip:'+clip+' RND-slab:'+slab+' RND-h:'+(rnd?rnd.clientHeight:'-')+' RND-pos:'+(function(){try{var sv=[].slice.call(de.querySelectorAll('button')).filter(function(b){return /저장/.test(b.textContent||'')})[0];if(!sv||!rnd)return 'n/a';var r1=rnd.getBoundingClientRect(),r2=sv.getBoundingClientRect();return (r1.left>r2.left&&Math.abs(r1.top-r2.top)<8&&Math.abs(r1.height-r2.height)<3)?'ok':'off';}catch(e){return 'n/a'}})())+' CLOSE-ok:'+(function(){try{var sv=[].slice.call(de.querySelectorAll('button')).filter(function(b){return /저장/.test(b.textContent||'')})[0],cl=de.querySelector('#dk-close');if(!sv||!cl)return 'n/a';var r1=sv.getBoundingClientRect(),r2=cl.getBoundingClientRect();return (r2.height>30&&Math.abs(r1.top-r2.top)<8&&r2.left>r1.left)?'ok':'off';}catch(e){return 'n/a'}})()+' POOL:'+(function(){try{var ps=[].slice.call(de.querySelectorAll('[data-add]')),last=ps[ps.length-1],ov2=document.getElementById('deck-edit');if(!ps.length||!ov2)return 'n/a';var b=last.getBoundingClientRect(),o=ov2.getBoundingClientRect();return ps.length+'cards '+(b.bottom<=o.bottom+4?'all-vis':'clip');}catch(e){return 'n/a'}})();
      if(q.get('hold')==='1'){}else setTimeout(function(){ var c=[].slice.call(document.querySelectorAll('#deck-edit button')).filter(function(b){return vis(b)&&/닫기/.test(b.textContent||'')})[0]; if(c)clickEl(c); },250);
    },900);
  },600); return; }
  if(q.get('screen')==='profile'){ setTimeout(function(){ try{   /* v250: .rsub 지오메트리 실측 */
    var rp=document.querySelector('#overlay-profile .rpanel'), rs=document.querySelector('#overlay-profile .rsub');
    if(!rp||!rs){ set('RSUBGEO:no-el'); return; }
    var rr=rs.getBoundingClientRect(), pr=rp.getBoundingClientRect();
    set('RSUBGEO:vw'+window.innerWidth+' panelW:'+Math.round(pr.width)+' panelSW:'+rp.scrollWidth+' rsubR:'+Math.round(rr.right)+' rsubSW:'+rs.scrollWidth+' rsubCW:'+rs.clientWidth);
  }catch(e){ set('RSUBGEO:err'); } },1600); }
setTimeout(function(){
  if(mode==='profile'){ setTimeout(function(){ try{ var b=document.getElementById('btn-profile'); if(!b){ set('PROF:no-btn'); return; } clickEl(b); set('PROF:clicked'); }catch(e){ set('PROF:err'); } },250); }
  if(mode==='skill'){ setTimeout(function(){ try{ var b=document.getElementById('btn-skill'); if(!b){ set('SKILL:no-btn'); return; } clickEl(b); set('SKILL:clicked'); }catch(e){ set('SKILL:err'); } },250); }
  var __spq=q.get('spawn');
  if(q.get('cardtap')){ setTimeout(function(){ try{ if(typeof P==='undefined'||!P||!P.hand){ set('CTAP:no-hand'); return; } P.elixir=10; var c0=[].slice.call(document.querySelectorAll('#hand .card'))[0]; if(!c0){ set('CTAP:no-card'); return; } try{ c0.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,view:window,pointerId:1})); }catch(e){ c0.dispatchEvent(new MouseEvent('pointerdown',{bubbles:true,cancelable:true,view:window})); }   /* v306b: 카드는 pointerdown 바인딩(g1:2006) — click 발사 무효 */ setTimeout(function(){ try{ set('CTAP:'+(typeof P.sel==='number'&&P.sel>=0?'sel'+P.sel:'nosel')+'/ex'+Math.round(P.elixir)); }catch(e){ set('CTAP:err'); } },400); }catch(e){ set('CTAP:err'); } },3500); } if(__spq){ setTimeout(function(){ try{ if(typeof spawnCard!=='function'){ set('SPAWN:no-fn'); return; } __spq.split(',').forEach(function(k,i2){ try{ spawnCard(k,'blue',4.5+(i2%3)*1.2,16.5+Math.floor(i2/3)*1.4); }catch(e){} }); set('SPAWN:ok'); }catch(e){ set('SPAWN:err'); } },1500); }
  if(mode==='skill'){ setTimeout(function(){ try{ var its=document.querySelectorAll('#overlay-skill .sk-item'), mg=999, nn=0, __fw=false; for(var i2=0;i2<its.length;i2++){ var bs=its[i2].querySelectorAll('button'); if(bs.length>=2){ var r1=bs[0].getBoundingClientRect(), r2=bs[1].getBoundingClientRect(); var Lf=r1.right<r2.right?r1:r2, Rt=r1.right<r2.right?r2:r1; var gp=Math.round(Rt.left-Lf.right); if(gp<mg)mg=gp; nn++; if(!__fw){__fw=true; set('SKGD:w'+Math.round(r1.width)+'x'+Math.round(r2.width)+'/r'+Math.round(r1.right)+','+Math.round(r2.right));} } } set('SKG:'+mg+'g/'+nn+'it'); }catch(e){ set('SKG:err'); } },700); }
  if(mode==='battle'){
    if(q.get('etest')){
      var __ev=String(q.get('etest')), __fs=__ev.indexOf('fast')>=0?0.1:1, __nm=__ev.match(/c(\d+)/), __nc=__nm?parseInt(__nm[1],10):1;   /* v312: c<N>=N사이클 연속 재현(테스트 시간 확장), fast=1/10 속도 — 캡처 창 대응 */
      var __cy=0, __fl=0;
      var __etCycle=function(){
        __cy++;
        setTimeout(function(){ try{
          if(typeof startMatch!=='function'){ set('ETEST:no-start'); return; } if(__cy===1) startMatch();
          setTimeout(function(){ try{
            if(typeof P==='undefined'||!P){ set('ETEST:no-P'); return; }
            var __g0=document.querySelectorAll('#cards .card'); if(!__g0.length){ set('ETEST:no-card'); return; }
            P.elixir=10; var __rA='A?';
            try{ try{ __g0[0].dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,view:window,pointerId:1})); }catch(e){ __g0[0].dispatchEvent(new MouseEvent('pointerdown',{bubbles:true,cancelable:true,view:window})); }
              __rA=(P.sel===0)?'Aok':'Afail'+P.sel; }catch(e){ __rA='Aerr'; }
            var __rB='B?', __ex='?';
            try{ if(P.sel===0){ playCard(P,0,4.5,16); } }catch(e){ __rB='Perr'; }
            try{ __ex=Math.round((P.elixir||0)*10)/10; P.elixir=10; }catch(e){}
            setTimeout(function(){ try{
              var __g1=document.querySelectorAll('#cards .card'); var __rC='C?';
              try{ try{ __g1[1].dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,view:window,pointerId:2})); }catch(e){ __g1[1].dispatchEvent(new MouseEvent('pointerdown',{bubbles:true,cancelable:true,view:window})); }
                __rC=(P.sel===1)?'Cok':'Cfail'+P.sel; }catch(e){ __rC='Cerr'; }
              if(__rA!=='Aok'||__rC!=='Cok') __fl++;   /* v312: 실패 누적 — 이후 사이클이 덮어쓰지 않음 */
              var __sc=document.querySelector('#cards .card.sel')?'sel':'nosel';
              if(__cy<__nc){ set('ETEST:cy'+__cy+'/'+__nc+' F'+__fl+':'+__rA+'/'+__rB+'ex'+__ex+'/'+__rC+'/'+__sc); __etCycle(); }   /* v312: 사이클별 누적 토큰 — 중간 상태 배너 관측·캡처 동시검증 */
              else set('ETEST:DONE cy'+__nc+' F'+__fl+':'+__rA+'/'+__rB+'ex'+__ex+'/'+__rC+'/'+__sc);
            }catch(e){ set('ETEST:Cerr'); } },1300*__fs);
          }catch(e){ set('ETEST:Berr'); } },1200*__fs);
        }catch(e){ set('ETEST:err'); } },3000*__fs);
      };
      __etCycle();
      return;
    }
    runBattle(function(r){report(r);if(q.get('quit')==='1')quitBattle();});return;
  }
  if(q.get('screen')){return;}   /* v230: screen 모드 — 순회 금지 */
  var btns=walkButtons(),i=0,opened=0;
  function step(){
    if(i>=btns.length){
      var extra='BTN:'+i+'/'+btns.length+' open:'+opened;
      if(mode==='all'){runBattle(function(r){report(extra+' '+r);if(q.get('quit')==='1')quitBattle();});}
      else report(extra+' TITLE:'+((function(){var t=document.querySelector('#screen-title');return t&&!t.classList.contains('hidden')?'ok':'hidden';})())+' CODEX:'+(window.__qaCodex?window.__qaCodex():'n/a'));
      return;
    }
    var b=btns[i++];
    clickEl(b);
    setTimeout(function(){
      var cl=tryClose();
      if(cl.indexOf('x:')===0)opened++;
      notes.push((i-1)+' '+((b.textContent||'').trim().slice(0,10))+' '+cl);
      setTimeout(step,150);
    },380);
  }
  step();
},900);
})();
