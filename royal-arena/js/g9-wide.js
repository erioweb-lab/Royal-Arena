/* v382: 와이드 아레나 시스템 — 캔버스 폭=박스 비율(레터박스 제거)+다리 1~3 랜덤+지면 재렌더. g1의 VW/BAND/BRIDGES를 startMatch마다 갱신 */
const GT_IM={};['classic','lava','ice','wasteland','abyss'].forEach(function(t){const im=new Image();im.src='assets/ground_'+t+'.png';GT_IM[t]=im;});
function __rollWide(){
  try{
    const r=canvas.getBoundingClientRect(), asp=r.width/Math.max(1,r.height);
    VW=Math.max(W,Math.min(H,Math.round(H*asp/TILE)*TILE)); BAND=(VW-W)/2;
  }catch(e){ VW=W; BAND=0; }
  canvas.width=VW*BSCALE; canvas.height=H*BSCALE; ctx.scale(BSCALE,BSCALE);
  bgc.width=VW*BSCALE; bgc.height=H*BSCALE; vig=null;
  try{ buildTowers(); }catch(e){}
  const n=1+Math.floor(Math.random()*3), d=(n===1)?0:4.2+Math.random()*1.1;
  BRIDGES=(n===1)?[9,9]:(n===2?[9-d,9+d]:[9-d,9,9+d]);
  try{ drawStatic(); }catch(e){}
}
window.addEventListener('resize',function(){ try{ if(S&&S.scene==='battle'){ __rollWide(); if(S.cam){S.cam.x=VW/2;S.cam.y=H/2;} relayoutHud(); } }catch(e){} });
