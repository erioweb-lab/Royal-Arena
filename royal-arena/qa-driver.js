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
setTimeout(function(){
  if(mode==='battle'){runBattle(function(r){report(r);if(q.get('quit')==='1')quitBattle();});return;}
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
