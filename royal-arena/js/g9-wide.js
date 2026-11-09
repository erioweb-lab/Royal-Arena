/* v382/v391: 와이드 아레나 — 캔버스=박스 풀핏(VW+VH)+다리 타워축 스냅+지면 재렌더 */
const GT_IM={};['classic','lava','ice','wasteland','abyss'].forEach(function(t){const im=new Image();im.src='assets/ground_'+t+'.png?v=391';GT_IM[t]=im;});
function __fitWide(){
  try{
    const r=canvas.getBoundingClientRect(); if(r.width<10||r.height<10) return;
    const asp=r.width/r.height;
    VW=Math.max(W,Math.min(H*2,Math.round(H*asp)));
    VH=Math.max(H,Math.min(W*3,Math.round(VW/asp)));   /* v392: 타일 스냅 폐지 — 비트맵=박스 비율(레터박스 0) */
    BAND=(VW-W)/2; VBAND=(VH-H)/2;
  }catch(e){ return; }
  canvas.width=VW*BSCALE; canvas.height=VH*BSCALE; ctx.scale(BSCALE,BSCALE);
  bgc.width=VW*BSCALE; bgc.height=VH*BSCALE; vig=null;
  try{ drawStatic(); }catch(e){}
}
function __rollWide(){   /* v391: 다리=타워축 스냅 */
  __fitWide();
  const n=1+Math.floor(Math.random()*3);
  BRIDGES=(n===1)?[9]:(n===2?[3.5,14.5]:[3.5,9,14.5]);
  try{ drawStatic(); }catch(e){}
}
function __wideCheck(){
  try{
    if(!S||S.scene!=='battle') return;
    const r=canvas.getBoundingClientRect(); if(r.width<10||r.height<10) return;
    const ax=r.width/r.height, cx=VW/VH;
    if(Math.abs(ax-cx)/cx>0.02){
      __fitWide();
      if(S.cam){ const vw=VW/S.cam.z, vh=VH/S.cam.z;
        S.cam.x=(vw>=W)?W/2:Math.min(Math.max(S.cam.x,vw/2),W-vw/2);
        S.cam.y=(vh>=H)?H/2:Math.min(Math.max(S.cam.y,vh/2),H-vh/2); }
      try{ relayoutHud(); }catch(e){}
    }
  }catch(e){}
}
window.addEventListener('resize',__wideCheck);
try{
  const __awo=document.getElementById('arena-wrap');
  if(__awo&&typeof ResizeObserver!=='undefined'){ new ResizeObserver(function(){ setTimeout(__wideCheck,120); }).observe(__awo); }
  else { window.setInterval(__wideCheck,1200); }
}catch(e){ window.setInterval(__wideCheck,1200); }
try{
  const __osm=startMatch;
  startMatch=function(){ const r=__osm.apply(this,arguments); setTimeout(function(){ requestAnimationFrame(function(){ requestAnimationFrame(__wideCheck); }); },350); return r; };
}catch(e){}
