/* v382/v383: 와이드 아레나 시스템 — 캔버스 폭=박스 비율(레터박스 제거)+다리 1~3 랜덤+지면 재렌더. g1의 VW/BAND/BRIDGES를 갱신 */
const GT_IM={};['classic','lava','ice','wasteland','abyss'].forEach(function(t){const im=new Image();im.src='assets/ground_'+t+'.png?v=385';GT_IM[t]=im;});
function __fitWide(){   /* v383 측정+재도색 / v389: 측상 실패 시 현행 유지(9:16 폴백 폐지) */
  try{
    const r=canvas.getBoundingClientRect(); if(r.width<10||r.height<10) return;
    const asp=r.width/r.height;
    VW=Math.max(W,Math.min(H,Math.round(H*asp/TILE)*TILE)); BAND=(VW-W)/2;
  }catch(e){ return; }
  canvas.width=VW*BSCALE; canvas.height=H*BSCALE; ctx.scale(BSCALE,BSCALE);
  bgc.width=VW*BSCALE; bgc.height=H*BSCALE; vig=null;
  try{ drawStatic(); }catch(e){}
}
function __rollWide(){   /* v382: startMatch 진입 — 다리 1~3 랜덤 재배치 포함 */
  __fitWide();
  const n=1+Math.floor(Math.random()*3), d=(n===1)?0:4.2+Math.random()*1.1;
  BRIDGES=(n===1)?[9,9]:(n===2?[9-d,9+d]:[9-d,9,9+d]);
  try{ drawStatic(); }catch(e){}
}
function __wideCheck(){   /* v383: 레이아웃 안정 후 비율 어긋나면 자동 보정(다리 유지) */
  try{
    if(!S||S.scene!=='battle') return;
    const r=canvas.getBoundingClientRect(); if(r.width<10||r.height<10) return;
    const asp=r.width/r.height, cur=VW/H;
    if(Math.abs(asp-cur)/cur>0.02){ __fitWide(); if(S.cam){ const vw=VW/S.cam.z; S.cam.x=(vw>=W)?W/2:Math.min(Math.max(S.cam.x,vw/2),W-vw/2);   /* v388 */ } try{ relayoutHud(); }catch(e){} }
  }catch(e){}
}
window.addEventListener('resize',__wideCheck);
try{   /* v389: 주기 폴링 폐지 — 관측 기반 재측상 */
  const __awo=document.getElementById('arena-wrap');
  if(__awo&&typeof ResizeObserver!=='undefined'){ new ResizeObserver(function(){ setTimeout(__wideCheck,120); }).observe(__awo); }
  else { window.setInterval(__wideCheck,1200); }
}catch(e){ window.setInterval(__wideCheck,1200); }
try{   /* v389: startMatch 후 레이아웃 안정 2프레임 뒤 재측상 */
  const __osm=startMatch;
  startMatch=function(){ const r=__osm.apply(this,arguments); setTimeout(function(){ requestAnimationFrame(function(){ requestAnimationFrame(__wideCheck); }); },350); return r; };
}catch(e){}
