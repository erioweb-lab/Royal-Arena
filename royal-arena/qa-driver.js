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
function battleVisible(){var b=document.querySelector('#screen-battle');return !!(b&&!b.classList.contains('hidden'));}
function report(extra){set(mode+' DONE | ERR:'+errs.length+' W:'+warns.length+' | '+extra+(errs.length?('\nE1:'+errs.slice(0,2).join(' | ')):''));}
function quitBattle(){
  try{
    var qb=document.querySelector('#btn-quit');
    if(qb&&vis(qb))clickEl(qb);
    setTimeout(function(){
      var conf=[].slice.call(document.querySelectorAll('button')).filter(function(b){return vis(b)&&/기권|확인|예$/.test((b.textContent||'').trim())&&b.id!=='btn-quit';});
      if(conf.length)clickEl(conf[0]);
      setTimeout(function(){
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
    cb('BATTLE:'+(battleVisible()?'OK':'FAIL')+' '+pixCount()+' TIME:'+(tm&&tm.textContent?'ok':'empty'));
  },3800);
}
setTimeout(function(){
  if(mode==='battle'){runBattle(function(r){report(r);if(q.get('quit')==='1')quitBattle();});return;}
  var btns=walkButtons(),i=0,opened=0;
  function step(){
    if(i>=btns.length){
      var extra='BTN:'+i+'/'+btns.length+' open:'+opened;
      if(mode==='all'){runBattle(function(r){report(extra+' '+r);if(q.get('quit')==='1')quitBattle();});}
      else report(extra+' TITLE:'+((function(){var t=document.querySelector('#screen-title');return t&&!t.classList.contains('hidden')?'ok':'hidden';})()));
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
