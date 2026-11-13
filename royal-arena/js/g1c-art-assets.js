function drawBody(u,r,la){
  const K=u.key, team=u.team, skin='#f2c9a0', outline='#1c2436';
  ctx.lineWidth=2; ctx.strokeStyle=outline; ctx.textAlign='center';
  const eye=(ex,ey,er)=>{ ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ex,ey,er,0,7); ctx.fill();
    ctx.fillStyle='#152238'; ctx.beginPath(); ctx.arc(ex+er*0.3,ey,er*0.5,0,7); ctx.fill(); };
  if(K==='knight'){
    ctx.fillStyle='#8f9bab'; ctx.beginPath(); ctx.arc(-r*0.55,-r*0.55,r*0.42,0,7); ctx.fill();
    ctx.fillStyle=team==='blue'?'#3f7bf5':'#e64545'; ctx.beginPath(); ctx.arc(-r*0.55,-r*0.55,r*0.18,0,7); ctx.fill();
    ctx.fillStyle='#cdd5e0'; roundRect(-r*0.45,-r*1.05,r*0.9,r*0.95,4); ctx.fill(); ctx.stroke();
    ctx.fillStyle=skin; ctx.beginPath(); ctx.arc(0,-r*1.45,r*0.42,0,7); ctx.fill();
    ctx.fillStyle='#aab6c4'; ctx.beginPath(); ctx.arc(0,-r*1.52,r*0.44,Math.PI,0); ctx.fill();
    ctx.fillStyle=team==='blue'?'#5a9cff':'#ff7a7a';
    ctx.beginPath(); ctx.moveTo(-r*0.05,-r*1.95); ctx.quadraticCurveTo(r*0.25,-r*2.3,r*0.3,-r*1.9); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.rotate(u.swing>0?-0.9+u.swing*4:0.35);
    ctx.strokeStyle='#e6ecf5'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(r*0.35,-r*0.7); ctx.lineTo(r*1.15,-r*1.35); ctx.stroke();
    ctx.strokeStyle='#c9a227'; ctx.lineWidth=3.5; ctx.beginPath(); ctx.moveTo(r*0.22,-r*0.58); ctx.lineTo(r*0.42,-r*0.76); ctx.stroke();
    ctx.restore();
  } else if(K==='archers'){
    ctx.fillStyle='#e26ea0'; ctx.beginPath();
    ctx.moveTo(-r*0.5,0); ctx.quadraticCurveTo(0,-r*1.3,r*0.5,0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle=skin; ctx.beginPath(); ctx.arc(0,-r*1.35,r*0.36,0,7); ctx.fill();
    ctx.fillStyle='#d8578f'; ctx.beginPath(); ctx.arc(0,-r*1.42,r*0.4,Math.PI*1.05,Math.PI*1.95); ctx.fill();
    eye(r*0.16,-r*1.32,r*0.09);
    ctx.strokeStyle='#8a5a2b'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.arc(r*0.55,-r*0.8,r*0.5,-1.2,1.2); ctx.stroke();
    ctx.strokeStyle='#f4e9c8'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(r*0.55+Math.cos(-1.2)*r*0.5,-r*0.8+Math.sin(-1.2)*r*0.5);
    ctx.lineTo(r*0.55+Math.cos(1.2)*r*0.5,-r*0.8+Math.sin(1.2)*r*0.5); ctx.stroke();
  } else if(K==='giant'){
    ctx.fillStyle='#d9a066'; ctx.beginPath(); ctx.arc(0,-r*0.75,r*0.95,0,7); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#c78d52'; ctx.beginPath(); ctx.ellipse(0,-r*0.55,r*0.6,r*0.45,0,0,7); ctx.fill();
    ctx.fillStyle='#b57e46';
    ctx.beginPath(); ctx.arc(-r*0.85,-r*0.7,r*0.28,0,7); ctx.fill();
    ctx.beginPath(); ctx.arc(r*0.85,-r*0.7,r*0.28,0,7); ctx.fill();
    ctx.fillStyle='#d9a066'; ctx.beginPath(); ctx.arc(0,-r*1.55,r*0.48,0,7); ctx.fill(); ctx.stroke();
    ctx.strokeStyle='#6b4a26'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(-r*0.3,-r*1.7); ctx.lineTo(-r*0.08,-r*1.64); ctx.moveTo(r*0.3,-r*1.7); ctx.lineTo(r*0.08,-r*1.64); ctx.stroke();
    ctx.fillStyle='#8a5a2b'; ctx.beginPath(); ctx.arc(0,-r*1.32,r*0.3,0,Math.PI); ctx.fill();
  } else if(K==='minions'){
    const flap=Math.sin(now*11+u.bob)*8;
    ctx.fillStyle='#3a6cc0';
    for(const s of [-1,1]){ ctx.save(); ctx.scale(s,1);
      ctx.beginPath(); ctx.moveTo(r*0.5,-r*0.9);
      ctx.quadraticCurveTo(r*1.3,-r*1.4-flap,r*1.15,-r*0.5);
      ctx.quadraticCurveTo(r*0.9,-r*0.55,r*0.5,-r*0.7); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.fillStyle='#4a7bd0'; ctx.beginPath(); ctx.arc(0,-r*0.85,r*0.62,0,7); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#6d9cf8'; ctx.beginPath(); ctx.ellipse(0,-r*0.6,r*0.35,r*0.28,0,0,7); ctx.fill();
    ctx.strokeStyle=outline; ctx.lineWidth=2;
    for(const s of [-1,1]){ ctx.beginPath(); ctx.moveTo(s*r*0.22,-r*1.42); ctx.lineTo(s*r*0.34,-r*1.66); ctx.stroke(); }
    eye(-r*0.22,-r*0.92,r*0.16); eye(r*0.22,-r*0.92,r*0.16);
    ctx.strokeStyle='#152238'; ctx.beginPath(); ctx.arc(0,-r*0.62,r*0.16,0.2,Math.PI-0.2); ctx.stroke();
  } else if(K==='musketeer'){
    ctx.fillStyle='#3a4d8f'; ctx.beginPath();
    ctx.moveTo(-r*0.5,0); ctx.lineTo(r*0.5,0); ctx.lineTo(r*0.35,-r*1.1); ctx.lineTo(-r*0.35,-r*1.1); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle=skin; ctx.beginPath(); ctx.arc(0,-r*1.35,r*0.34,0,7); ctx.fill();
    ctx.fillStyle='#2c3a6e'; ctx.beginPath(); ctx.ellipse(0,-r*1.58,r*0.55,r*0.14,0,0,7); ctx.fill();
    ctx.beginPath(); ctx.arc(0,-r*1.58,r*0.3,Math.PI,0); ctx.fill();
    ctx.strokeStyle='#4a3020'; ctx.lineWidth=3.2; ctx.beginPath(); ctx.moveTo(r*0.2,-r*0.75); ctx.lineTo(r*1.35,-r*0.95); ctx.stroke();
    ctx.fillStyle='#8892a0'; ctx.beginPath(); ctx.arc(r*1.38,-r*0.96,2.6,0,7); ctx.fill();
    if(u.swing>0){ ctx.fillStyle='#ffe9a8'; ctx.beginPath(); ctx.arc(r*1.4,-r*0.96,4,0,7); ctx.fill(); }
  } else if(K==='wizard'){
    ctx.fillStyle='#7a3fd0'; ctx.beginPath();
    ctx.moveTo(-r*0.55,0); ctx.lineTo(r*0.55,0); ctx.lineTo(0,-r*1.25); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle=skin; ctx.beginPath(); ctx.arc(0,-r*1.4,r*0.34,0,7); ctx.fill();
    ctx.fillStyle='#e8e8f0'; ctx.beginPath(); ctx.arc(0,-r*1.22,r*0.26,0,Math.PI); ctx.fill();
    ctx.fillStyle='#5a2ba0'; ctx.beginPath(); ctx.moveTo(-r*0.4,-r*1.6); ctx.lineTo(r*0.4,-r*1.6); ctx.lineTo(0,-r*2.05); ctx.closePath(); ctx.fill();
    const gl=0.6+0.4*Math.sin(now*8);
    ctx.fillStyle='rgba(255,140,40,'+gl+')'; ctx.beginPath(); ctx.arc(r*0.7,-r*0.95,r*0.3,0,7); ctx.fill();
    ctx.fillStyle='#ffd75e'; ctx.beginPath(); ctx.arc(r*0.7,-r*0.95,r*0.16,0,7); ctx.fill();
    if(Math.random()<0.3) addParts(u.x+0.5,u.y-1,1,'#ffb14d',1,0.3,0);
  } else if(K==='skarmy'){
    ctx.fillStyle='#f0f0ea'; ctx.beginPath(); ctx.arc(0,-r*0.7,r*0.55,0,7); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#152238';
    ctx.beginPath(); ctx.arc(-r*0.2,-r*0.75,r*0.13,0,7); ctx.fill();
    ctx.beginPath(); ctx.arc(r*0.2,-r*0.75,r*0.13,0,7); ctx.fill();
    ctx.fillRect(-r*0.16,-r*0.42,r*0.32,2);
    ctx.strokeStyle='#f0f0ea'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(-r*0.5,-r*0.2); ctx.lineTo(-r*0.5,0); ctx.moveTo(r*0.5,-r*0.2); ctx.lineTo(r*0.5,0); ctx.stroke();
    } else if(K==='valk'){
    ctx.fillStyle=team==='blue'?'#3f7bf5':'#e64545'; ctx.beginPath(); ctx.arc(0,-r*0.95,r*0.62,0,7); ctx.fill(); ctx.stroke();
    ctx.fillStyle=skin; ctx.beginPath(); ctx.arc(0,-r*1.5,r*0.4,0,7); ctx.fill();
    ctx.fillStyle='#b5502e'; ctx.beginPath(); ctx.arc(0,-r*1.6,r*0.44,Math.PI,0); ctx.fill();
    ctx.strokeStyle='#d8dee8'; ctx.lineWidth=3;
    for(const s5 of [-1,1]){ ctx.beginPath(); ctx.moveTo(s5*r*0.7,-r*0.9); ctx.lineTo(s5*r*1.3,-r*1.4); ctx.stroke(); }
  } else if(K==='bomber'){
    ctx.fillStyle='#5a6b4a'; ctx.beginPath(); ctx.moveTo(-r*0.5,0); ctx.quadraticCurveTo(0,-r*1.35,r*0.5,0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#7fce5a'; ctx.beginPath(); ctx.arc(0,-r*1.3,r*0.34,0,7); ctx.fill();
    ctx.fillStyle='#232830'; ctx.beginPath(); ctx.arc(r*0.75,-r*1.2,r*0.42,0,7); ctx.fill();
    ctx.strokeStyle='#c9a227'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(r*0.9,-r*1.6); ctx.quadraticCurveTo(r*1.1,-r*1.8,r*1.0,-r*2.0); ctx.stroke();
  } else if(K==='babyd'){
    ctx.fillStyle='#9a5fd0'; ctx.beginPath(); ctx.arc(0,-r*0.9,r*0.7,0,7); ctx.fill(); ctx.stroke();
    const flap2=Math.sin(now*9+u.bob)*7;
    for(const s5 of [-1,1]){ ctx.save(); ctx.scale(s5,1); ctx.fillStyle='#7a3fd0';
      ctx.beginPath(); ctx.moveTo(r*0.5,-r*1.0); ctx.quadraticCurveTo(r*1.25,-r*1.5-flap2,r*1.0,-r*0.55); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.fillStyle='#b57ee8'; ctx.beginPath(); ctx.ellipse(0,-r*0.65,r*0.4,r*0.3,0,0,7); ctx.fill();
    ctx.fillStyle='#ffd75e'; ctx.beginPath(); ctx.arc(0,-r*1.75,r*0.3,0,7); ctx.fill();
  } else if(K==='cleric'){
    ctx.fillStyle='#f0ead8'; ctx.beginPath(); ctx.moveTo(-r*0.5,0); ctx.quadraticCurveTo(0,-r*1.4,r*0.5,0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle=skin; ctx.beginPath(); ctx.arc(0,-r*1.35,r*0.36,0,7); ctx.fill();
    ctx.fillStyle='#e8c95a'; ctx.beginPath(); ctx.ellipse(0,-r*1.62,r*0.5,r*0.13,0,0,7); ctx.fill();
    ctx.strokeStyle='#7dffa8'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(r*0.4,-r*1.0); ctx.lineTo(r*0.7,-r*1.9); ctx.stroke();
    ctx.fillStyle='#7dffa8'; ctx.beginPath(); ctx.arc(r*0.7,-r*1.95,4,0,7); ctx.fill();
    } else if(K==='valk'){
    ctx.fillStyle=team==='blue'?'#3f7bf5':'#e64545'; ctx.beginPath(); ctx.arc(0,-r*0.95,r*0.62,0,7); ctx.fill(); ctx.stroke();
    ctx.fillStyle=skin; ctx.beginPath(); ctx.arc(0,-r*1.5,r*0.4,0,7); ctx.fill();
    ctx.fillStyle='#b5502e'; ctx.beginPath(); ctx.arc(0,-r*1.6,r*0.44,Math.PI,0); ctx.fill();
    ctx.strokeStyle='#d8dee8'; ctx.lineWidth=3;
    for(const s5 of [-1,1]){ ctx.beginPath(); ctx.moveTo(s5*r*0.7,-r*0.9); ctx.lineTo(s5*r*1.3,-r*1.4); ctx.stroke(); }
  } else if(K==='bomber'){
    ctx.fillStyle='#5a6b4a'; ctx.beginPath(); ctx.moveTo(-r*0.5,0); ctx.quadraticCurveTo(0,-r*1.35,r*0.5,0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#7fce5a'; ctx.beginPath(); ctx.arc(0,-r*1.3,r*0.34,0,7); ctx.fill();
    ctx.fillStyle='#232830'; ctx.beginPath(); ctx.arc(r*0.75,-r*1.2,r*0.42,0,7); ctx.fill();
    ctx.strokeStyle='#c9a227'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(r*0.9,-r*1.6); ctx.quadraticCurveTo(r*1.1,-r*1.8,r*1.0,-r*2.0); ctx.stroke();
  } else if(K==='babyd'){
    ctx.fillStyle='#9a5fd0'; ctx.beginPath(); ctx.arc(0,-r*0.9,r*0.7,0,7); ctx.fill(); ctx.stroke();
    const flap2=Math.sin(now*9+u.bob)*7;
    for(const s5 of [-1,1]){ ctx.save(); ctx.scale(s5,1); ctx.fillStyle='#7a3fd0';
      ctx.beginPath(); ctx.moveTo(r*0.5,-r*1.0); ctx.quadraticCurveTo(r*1.25,-r*1.5-flap2,r*1.0,-r*0.55); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.fillStyle='#b57ee8'; ctx.beginPath(); ctx.ellipse(0,-r*0.65,r*0.4,r*0.3,0,0,7); ctx.fill();
    ctx.fillStyle='#ffd75e'; ctx.beginPath(); ctx.arc(0,-r*1.75,r*0.3,0,7); ctx.fill();
  } else if(K==='cleric'){
    ctx.fillStyle='#f0ead8'; ctx.beginPath(); ctx.moveTo(-r*0.5,0); ctx.quadraticCurveTo(0,-r*1.4,r*0.5,0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle=skin; ctx.beginPath(); ctx.arc(0,-r*1.35,r*0.36,0,7); ctx.fill();
    ctx.fillStyle='#e8c95a'; ctx.beginPath(); ctx.ellipse(0,-r*1.62,r*0.5,r*0.13,0,0,7); ctx.fill();
    ctx.strokeStyle='#7dffa8'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(r*0.4,-r*1.0); ctx.lineTo(r*0.7,-r*1.9); ctx.stroke();
    ctx.fillStyle='#7dffa8'; ctx.beginPath(); ctx.arc(r*0.7,-r*1.95,4,0,7); ctx.fill();
  } else if(K==='boar'){
    ctx.fillStyle='#6b4a2f'; ctx.beginPath(); ctx.ellipse(0,-r*0.55,r*0.85,r*0.55,0,0,7); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#8a6242'; ctx.beginPath(); ctx.ellipse(-r*0.1,-r*0.5,r*0.6,r*0.4,0,0,7); ctx.fill();
    ctx.fillStyle='#54381f'; ctx.beginPath(); ctx.arc(-r*0.8,-r*0.45,r*0.22,0,7); ctx.fill();
    ctx.strokeStyle='#d8dee8'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(-r*0.75,-r*0.3); ctx.lineTo(-r*0.9,-r*0.7); ctx.stroke();
    ctx.fillStyle=team==='blue'?'#3f7bf5':'#e64545'; ctx.beginPath(); ctx.arc(r*0.15,-r*1.15,r*0.34,0,7); ctx.fill(); ctx.stroke();
    ctx.strokeStyle='#8a5a2b'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.moveTo(r*0.4,-r*1.0); ctx.lineTo(r*1.05,-r*1.45); ctx.stroke();
  } else if(K==='icem'){
    ctx.fillStyle='#7fb6e8'; ctx.beginPath(); ctx.moveTo(-r*0.5,0); ctx.quadraticCurveTo(0,-r*1.35,r*0.5,0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle=skin; ctx.beginPath(); ctx.arc(0,-r*1.3,r*0.34,0,7); ctx.fill();
    ctx.fillStyle='#cfe8ff'; ctx.beginPath(); ctx.ellipse(0,-r*1.55,r*0.5,r*0.13,0,0,7); ctx.fill();
    ctx.strokeStyle='#a8d8ff'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(r*0.35,-r*0.95); ctx.lineTo(r*0.75,-r*1.9); ctx.stroke();
    ctx.fillStyle='#e8f6ff'; ctx.beginPath(); ctx.arc(r*0.75,-r*1.95,4.5,0,7); ctx.fill();
  } else if(K==='cannon'){
    ctx.fillStyle='#3f4550'; ctx.beginPath(); ctx.ellipse(0,0,r*0.85,r*0.4,0,0,7); ctx.fill();
    ctx.save(); ctx.rotate(Math.cos(la)>=0?0:Math.PI);
    ctx.fillStyle='#6d441c'; roundRect(-r*0.9,-r*0.42,r*1.7,r*0.84,6); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#3a2a14'; ctx.fillRect(-r*0.62,-r*0.42,4,r*0.84); ctx.fillRect(r*0.28,-r*0.42,4,r*0.84);
    ctx.fillStyle='#2a2f3a'; ctx.beginPath(); ctx.arc(r*0.82,0,r*0.3,0,7); ctx.fill();
    ctx.fillStyle='#111820'; ctx.beginPath(); ctx.arc(r*0.86,0,r*0.18,0,7); ctx.fill();
    ctx.restore();
  } else if(K==='prince'){
    ctx.fillStyle='#7a4a26';
    ctx.beginPath(); ctx.ellipse(0,-r*0.55,r*0.9,r*0.5,0,0,7); ctx.fill(); ctx.stroke();
    ctx.strokeStyle='#5a3418'; ctx.lineWidth=3;
    for(const L of [-0.6,-0.35,0.35,0.6]){ ctx.beginPath(); ctx.moveTo(L*r,-r*0.25); ctx.lineTo(L*r,0); ctx.stroke(); }
    ctx.fillStyle='#7a4a26'; ctx.beginPath(); ctx.ellipse(r*0.85,-r*0.95,r*0.4,r*0.3,0.4,0,7); ctx.fill(); ctx.stroke();
    ctx.strokeStyle='#5a3418'; ctx.beginPath(); ctx.moveTo(r*1.05,-r*1.15); ctx.lineTo(r*1.15,-r*1.45); ctx.stroke();
    ctx.fillStyle='#c05df0'; ctx.beginPath();
    ctx.moveTo(-r*0.95,-r*0.8); ctx.quadraticCurveTo(-r*1.3,-r*0.6,-r*1.15,-r*0.2); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#3a4d8f'; roundRect(-r*0.25,-r*1.5,r*0.55,r*0.7,4); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#f2c9a0'; ctx.beginPath(); ctx.arc(0,-r*1.7,r*0.26,0,7); ctx.fill();
    ctx.fillStyle='#e8b93a'; ctx.beginPath(); ctx.arc(0,-r*1.82,r*0.28,Math.PI,0); ctx.fill();
    ctx.strokeStyle='#8892a0'; ctx.lineWidth=3.5;
    ctx.beginPath(); ctx.moveTo(r*0.2,-r*1.35); ctx.lineTo(r*1.55,-r*1.6); ctx.stroke();
    ctx.fillStyle='#d8dee8'; ctx.beginPath();
    ctx.moveTo(r*1.5,-r*1.72); ctx.lineTo(r*1.85,-r*1.55); ctx.lineTo(r*1.5,-r*1.48); ctx.closePath(); ctx.fill();
  } else if(K==='sniper'){
    ctx.fillStyle='#4a6a4a'; ctx.beginPath();
    ctx.moveTo(-r*0.45,0); ctx.lineTo(r*0.45,0); ctx.lineTo(r*0.3,-r*1.0); ctx.lineTo(-r*0.3,-r*1.0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle=skin; ctx.beginPath(); ctx.arc(0,-r*1.22,r*0.32,0,7); ctx.fill();
    ctx.fillStyle='#33502f'; ctx.beginPath(); ctx.ellipse(0,-r*1.4,r*0.5,r*0.16,0,0,7); ctx.fill();
    ctx.beginPath(); ctx.arc(0,-r*1.4,r*0.26,Math.PI,0); ctx.fill();
    ctx.fillStyle='#152238'; ctx.beginPath(); ctx.arc(r*0.1,-r*1.2,r*0.08,0,7); ctx.fill();
    ctx.strokeStyle='#2a2f3a'; ctx.lineWidth=2.6;
    ctx.beginPath(); ctx.moveTo(r*0.15,-r*0.7); ctx.lineTo(r*1.6,-r*0.88); ctx.stroke();
    ctx.fillStyle='#8892a0'; ctx.fillRect(r*1.0,-r*1.02,5,5);
    if(u.swing>0){ ctx.fillStyle='#ffe9a8'; ctx.beginPath(); ctx.arc(r*1.62,-r*0.88,4,0,7); ctx.fill(); }
  } else {
    ctx.fillStyle=team==='blue'?'#3f7bf5':'#e64545';
    ctx.beginPath(); ctx.arc(0,-r*0.7,r*0.6,0,7); ctx.fill(); ctx.stroke();
    ctx.font=Math.max(11,r*0.9)+'px sans-serif'; ctx.fillText(u.c.emoji,0,-r*0.6);
  }
}
const FIREARC={kingshot:30,arrow:10,bullet:3,wizfb:18,dragon:14,ice:16,bomb:34,cannon:46};
const PROJ_BASE={net:0,stone:0,arrow:2.3562,bomb:0,bullet:0,cannon:3.1416,dragon:1.5708,fireball:0,ice:1.5708,kingshot:0,wizfb:2.3562,zap:0};
const PROJ16={};
function cv16(fn){ const c=document.createElement('canvas'); c.width=64; c.height=64; fn(c.getContext('2d')); return c; }
function pArrow(g){
  const grd=g.createLinearGradient(-24,0,18,0); grd.addColorStop(0,'#7c5228'); grd.addColorStop(.45,'#c09a58'); grd.addColorStop(1,'#7c5228');
  g.strokeStyle=grd; g.lineWidth=4; g.lineCap='round'; g.beginPath(); g.moveTo(-23,0); g.lineTo(15,0); g.stroke();
  g.fillStyle='#e8eef6'; g.beginPath(); g.moveTo(30,0); g.lineTo(13,-6.5); g.lineTo(17,0); g.lineTo(13,6.5); g.closePath(); g.fill();
  g.strokeStyle='#8f9cab'; g.lineWidth=1.2; g.stroke();
  g.fillStyle='rgba(232,238,246,.95)';
  g.beginPath(); g.moveTo(-23,0); g.lineTo(-31,-8); g.lineTo(-18,-2.5); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(-23,0); g.lineTo(-31,8); g.lineTo(-18,2.5); g.closePath(); g.fill();
  g.strokeStyle='rgba(120,90,40,.8)'; g.lineWidth=1.5; g.beginPath(); g.moveTo(-19,-2.5); g.lineTo(-19,2.5); g.stroke();
}
function pBolt(g,core,glow){
  const grd=g.createLinearGradient(-26,0,14,0); grd.addColorStop(0,'rgba(255,120,30,0)'); grd.addColorStop(.55,glow); grd.addColorStop(1,core);
  g.fillStyle=grd; g.beginPath(); g.moveTo(-27,0); g.quadraticCurveTo(-6,-8,13,0); g.quadraticCurveTo(-6,8,-27,0); g.fill();
  const rg=g.createRadialGradient(12,-2,1,12,0,11); rg.addColorStop(0,'#fff8dc'); rg.addColorStop(.55,core); rg.addColorStop(1,glow);
  g.fillStyle=rg; g.beginPath(); g.arc(12,0,10,0,7); g.fill();
}
function pIce(g){
  g.fillStyle='rgba(156,220,255,.9)'; g.beginPath(); g.moveTo(30,0); g.lineTo(6,-7); g.lineTo(-24,-3); g.lineTo(-28,0); g.lineTo(-24,3); g.lineTo(6,7); g.closePath(); g.fill();
  g.fillStyle='rgba(240,252,255,.95)'; g.beginPath(); g.moveTo(30,0); g.lineTo(2,-2.5); g.lineTo(-20,-1); g.lineTo(-20,1); g.lineTo(2,2.5); g.closePath(); g.fill();
  g.strokeStyle='rgba(110,180,230,.9)'; g.lineWidth=1.2;
  g.beginPath(); g.moveTo(30,0); g.lineTo(6,-7); g.lineTo(-24,-3); g.stroke();
  g.beginPath(); g.moveTo(30,0); g.lineTo(6,7); g.lineTo(-24,3); g.stroke();
}
function pBall(g,base,hi){
  const rg=g.createRadialGradient(4,-5,2,0,0,15); rg.addColorStop(0,hi); rg.addColorStop(1,base);
  g.fillStyle=rg; g.beginPath(); g.arc(0,0,14,0,7); g.fill();
  g.strokeStyle='rgba(0,0,0,.35)'; g.lineWidth=1.5; g.stroke();
}
function pBomb(g){ pBall(g,'#23262e','#8a93a6'); g.strokeStyle='#6b4a26'; g.lineWidth=3; g.beginPath(); g.moveTo(2,-13); g.quadraticCurveTo(8,-22,14,-20); g.stroke(); g.fillStyle='#ffb84d'; g.beginPath(); g.arc(14,-20,2.6,0,7); g.fill(); }
function pBullet(g){ pBall(g,'#c9a24a','#ffe9a8'); g.fillStyle='#8f9cab'; g.beginPath(); g.moveTo(29,0); g.lineTo(10,-5); g.lineTo(10,5); g.closePath(); g.fill(); }
function bake16(){
  if(window.__p16) return;
  let pend=0;
  for(const k in PSPR){ if(PROJ16[k]) continue; const im=PSPR[k];
    if(!im||!im.complete||!im.naturalWidth||im.__valid===false){ pend++; continue; }
    const arr=[];
    for(let i=0;i<16;i++){ const c=document.createElement('canvas'); c.width=64; c.height=64; const g2=c.getContext('2d');
      g2.translate(32,32); g2.rotate(i*Math.PI/8-(PROJ_BASE[k]||0)); g2.drawImage(im,-32,-32,64,64); arr.push(c); }
    PROJ16[k]=arr; }
  if(!pend) window.__p16=true;
}
function visAngle(p,px,py2){ let va; if(p._lx!=null&&(px!==p._lx||py2!==p._ly)) va=Math.atan2(py2-p._ly,px-p._lx); else va=Math.atan2(p.ty-p.y,p.tx-p.x); p._lx=px; p._ly=py2; return va; }
function drawProj(p){
  const px=p.x*TILE, py=p.y*TILE;
  if(p.kind==='plasmabolt'){ const _pl=Math.sin(Math.min(1,Math.max(0,p.t))*Math.PI)*12, _py3=py-_pl;   /* v380: 플라즈마탄 — 발광 코어+바이올렛 트레일 */
    const _pa=Math.atan2(p.y1-p.y0,p.x1-p.x0), _tsx=px-Math.cos(_pa)*26, _tsy=_py3-Math.sin(_pa)*26;
    const _tg=ctx.createLinearGradient(_tsx,_tsy,px,_py3); _tg.addColorStop(0,'rgba(207,157,255,0)'); _tg.addColorStop(1,'rgba(230,210,255,.95)');
    ctx.strokeStyle=_tg; ctx.lineWidth=3.2; ctx.beginPath(); ctx.moveTo(_tsx,_tsy); ctx.lineTo(px,_py3); ctx.stroke();
    const _pg=ctx.createRadialGradient(px,_py3,1,px,_py3,22); _pg.addColorStop(0,'rgba(230,210,255,.85)'); _pg.addColorStop(0.5,'rgba(175,120,255,.45)'); _pg.addColorStop(1,'rgba(175,120,255,0)');
    ctx.fillStyle=_pg; ctx.beginPath(); ctx.arc(px,_py3,22,0,7); ctx.fill();
    ctx.fillStyle='#f4ecff'; ctx.beginPath(); ctx.arc(px,_py3,4.6,0,7); ctx.fill();
    return; }
  if(p.kind==='fireball'||p.kind==='meteorbit'){
    const lift=Math.sin(Math.min(1,Math.max(0,p.t))*Math.PI)*(p.kind==='meteorbit'?10:14), sz=p.kind==='meteorbit'?36:54, _gr2=p.kind==='meteorbit'?22:36;   /* v380: 파편 유성 — 소형 계열 */
    const gl=ctx.createRadialGradient(px,py-lift,2,px,py-lift,_gr2);
    gl.addColorStop(0,'rgba(255,140,40,.5)'); gl.addColorStop(1,'rgba(255,140,40,0)');
    ctx.fillStyle=gl; ctx.beginPath(); ctx.arc(px,py-lift,_gr2,0,7); ctx.fill();
    const fim=(typeof PSPR!=='undefined')?PSPR.fireball:null;
    if(fim&&fim.complete){ ctx.save();
      bake16(); const ff=PROJ16.fireball; const va2=visAngle(p,px,py-lift);
      if(ff){ const fi2=((Math.round(va2/(Math.PI/8))%16)+16)%16; ctx.drawImage(ff[fi2],px-sz/2,py-lift-sz/2,sz,sz); }
      else{ ctx.translate(px,py-lift); ctx.rotate(va2); ctx.drawImage(fim,-sz/2,-sz/2,sz,sz); }
      ctx.restore(); }
    else{ ctx.fillStyle='#ff7b1c'; ctx.beginPath(); ctx.arc(px,py-lift,9,0,7); ctx.fill();
      ctx.fillStyle='#ffd75e'; ctx.beginPath(); ctx.arc(px,py-lift,4.5,0,7); ctx.fill(); }
    return;
  }
  const a=Math.atan2(p.ty-p.y,p.tx-p.x);
  const tc=p.team==='blue'?'96,158,255':'255,110,110';
  const LIFT=(p.arc&&p.dur)?Math.sin(Math.min(1,p.t/p.dur)*Math.PI)*(FIREARC[p.kind]||16):0;
  const py2=py-LIFT;
  const SZ={net:40,stone:52,kingshot:40,arrow:46,bullet:30,bomb:40,wizfb:46,dragon:44,ice:38,cannon:34}[p.kind]||44;

  const va=visAngle(p,px,py2);

  bake16();
  const fr=PROJ16[p.kind];
  if(fr){ const fi=((Math.round(va/(Math.PI/8))%16)+16)%16; ctx.drawImage(fr[fi],px-SZ/2,py2-SZ/2,SZ,SZ); }
  else if(p.kind==='bullet'){ var __ba=Math.atan2(p.ty-p.y,p.tx-p.x), __sx=px-Math.cos(__ba)*15, __sy=py2-Math.sin(__ba)*15;   /* v321: 머스키타이어 추적 탄환 — 꼬리 스트릭+발광탄두 */
    var __gr=ctx.createLinearGradient(__sx,__sy,px,py2); __gr.addColorStop(0,'rgba(255,233,168,0)'); __gr.addColorStop(1,'rgba(255,233,168,.95)');
    ctx.strokeStyle=__gr; ctx.lineWidth=2.6; ctx.beginPath(); ctx.moveTo(__sx,__sy); ctx.lineTo(px,py2); ctx.stroke();
    ctx.fillStyle='#fff6d8'; ctx.beginPath(); ctx.arc(px,py2,3.4,0,7); ctx.fill(); }
  else if(p.kind==='bolt'){ var __b2=Math.atan2(p.ty-p.y,p.tx-p.x); ctx.save(); ctx.translate(px,py2); ctx.rotate(__b2);   /* v332: 석궁병 볼트 — 가시성 강화(발광 촉·밝은 강철 몸통·확대) */
    ctx.shadowColor='rgba(214,232,255,.95)'; ctx.shadowBlur=6;
    ctx.strokeStyle='#e8f0fa'; ctx.lineWidth=3.2; ctx.beginPath(); ctx.moveTo(-11,0); ctx.lineTo(6,0); ctx.stroke();
    ctx.fillStyle='#ffffff'; ctx.beginPath(); ctx.moveTo(10,0); ctx.lineTo(2,-3.2); ctx.lineTo(2,3.2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#9fb4d4'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(-11,-3); ctx.lineTo(-6,0); ctx.lineTo(-11,3); ctx.stroke();
    ctx.shadowBlur=0; ctx.restore(); }
  else { ctx.strokeStyle='#f4e9c8'; ctx.lineWidth=2.5; ctx.beginPath();
    ctx.moveTo(px-Math.cos(va)*8,py2-Math.sin(va)*8); ctx.lineTo(px+Math.cos(va)*5,py2+Math.sin(va)*5); ctx.stroke(); }
}
const ZK=new Set(['snowzone','crater','venomzone','burnzone','plasmazone','stormzone','healzone']);   /* v404: 지면 지속 존 종류 — 렌더 순서 분리용 */
const FXBEAM={img:null,ok:false}; try{ const __bi=new Image(); __bi.onload=function(){FXBEAM.ok=true;}; __bi.src='assets/ra_fx_plasma_beam.png'; FXBEAM.img=__bi; }catch(e){}   /* v406: 플라즈마 발사 빔 생성 스프라이트(실패 시 캔버스 폴백) */
function drawFx(f){
  const k=f.t/f.dur, px=f.x*TILE, py=f.y*TILE;
  ctx.globalAlpha=Math.max(0,1-k);
  if(f.kind==='beam'){   /* v406: 플라즈마 타워 발사 빔 — 생성 스프라이트 신축(폴백 그라디언트 내장) */
    const bx0=f.x0*TILE, by0=f.y0*TILE, bl=Math.hypot(px-bx0,py-by0), ba=Math.atan2(py-by0,px-bx0);
    const bp=Math.min(1,f.t/(f.T||0.2)), bw=TILE*0.55, fd=Math.max(0,Math.min(1,f.t*8))*Math.max(0,Math.min(1,(f.dur-f.t)*4));
    ctx.save(); ctx.translate(bx0,by0); ctx.rotate(ba); ctx.globalAlpha=fd;
    if(FXBEAM.ok&&FXBEAM.img&&FXBEAM.img.naturalWidth){ ctx.shadowColor='#b47cff'; ctx.shadowBlur=18; ctx.drawImage(FXBEAM.img,0,-bw/2,Math.max(1,bl*bp),bw); }
    else { const bg=ctx.createLinearGradient(0,0,Math.max(1,bl*bp),0); bg.addColorStop(0,'rgba(207,157,255,0)'); bg.addColorStop(0.55,'rgba(207,157,255,.9)'); bg.addColorStop(1,'rgba(255,255,255,.95)'); ctx.strokeStyle=bg; ctx.lineWidth=bw*0.4; ctx.lineCap='round'; ctx.shadowColor='#cf9dff'; ctx.shadowBlur=22; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(bl*bp,0); ctx.stroke(); }
    ctx.restore(); return; }

  if(f.kind==='hit'){ var __hb=window.__FXIMG&&window.__FXIMG.hitburst; if(__hb&&__hb.complete&&__hb.naturalWidth>0&&__hb.__valid!==false){ var _hx=f.x*TILE,_hy=f.y*TILE,_hw=TILE*1.25; ctx.save(); ctx.globalAlpha=0.92; ctx.drawImage(__hb,_hx-_hw/2,_hy-_hw*0.6,_hw,_hw); ctx.restore(); }   /* v329: 타격 버스트 스프라이트(타워 화살 포함) */
   ctx.fillStyle='#fff';
    for(let i=0;i<4;i++){ const a=i*1.57+0.6;
      ctx.fillRect(px+Math.cos(a)*6*(1+k*2)-1.5,py+Math.sin(a)*6*(1+k*2)-1.5,3,3); } }
    else if(f.kind==='slash360'){ var __s3=window.__FXIMG&&window.__FXIMG.slash360; if(__s3&&__s3.complete&&__s3.naturalWidth>0&&__s3.__valid!==false){ var _sw3=TILE*1.9; ctx.globalAlpha=Math.min(1,2.2*(1-f.t/f.dur)); ctx.drawImage(__s3,f.x*TILE-_sw3/2,f.y*TILE-_sw3/2,_sw3,_sw3); ctx.globalAlpha=1; } }   /* v469: 발키리 360 참격 스프라이트 — 페이드아웃 */ else if(f.kind==='slash'){ var __sl=window.__FXIMG&&window.__FXIMG.slash; if(__sl&&__sl.complete&&__sl.naturalWidth>0&&__sl.__valid!==false){ ctx.save(); ctx.translate(f.x*TILE,f.y*TILE); ctx.rotate(f.a||0); var _sw2=TILE*1.5; ctx.globalAlpha=0.9; ctx.drawImage(__sl,-_sw2/2,-_sw2/2,_sw2,_sw2); ctx.restore(); }   /* v329: 근접 베기 스프라이트(보스 포함) */
    ctx.strokeStyle=f.col; ctx.lineWidth=3.5; ctx.beginPath();
    ctx.arc(px,py,TILE*0.42,(f.a||0)-0.9+(1-k)*0.4,(f.a||0)+0.9+(1-k)*0.4); ctx.stroke();
  }
  else if(f.kind==='muzzle'){ ctx.fillStyle='#ffe9a8'; ctx.beginPath(); ctx.arc(px,py-10,5+k*9,0,7); ctx.fill(); ctx.fillStyle='#ff9d3c'; ctx.beginPath(); ctx.arc(px,py-10,3+k*5,0,7); ctx.fill(); }
  else if(f.kind==='stmuz'){ const r1=6+k*18, r0=r1*0.42; ctx.save(); ctx.translate(px,py); ctx.rotate((f.rot||0)+(1-k)*0.9); ctx.fillStyle='rgba(255,233,168,.95)'; ctx.beginPath(); for(let si=0;si<10;si++){ const rr=(si%2)?r0:r1, an=si*Math.PI/5; ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr); } ctx.closePath(); ctx.fill(); ctx.fillStyle='#ff9d3c'; ctx.beginPath(); ctx.arc(0,0,Math.max(2,r0*0.8),0,7); ctx.fill(); ctx.restore(); }
  else if(f.kind==='bolt'){ const qx=f.tx*TILE,qy=f.ty*TILE; ctx.strokeStyle='#fff59d'; ctx.lineWidth=3; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(px,py);
    for(let bi2=1;bi2<=3;bi2++){ const tt=bi2/3; ctx.lineTo(px+(qx-px)*tt+(bi2<3?(Math.random()-0.5)*16:0), py+(qy-py)*tt+(bi2<3?(Math.random()-0.5)*16:0)); }
    ctx.stroke(); ctx.lineWidth=1.4; ctx.strokeStyle='#fffde7'; ctx.stroke(); }
  else if(f.kind==='poof'){ ctx.fillStyle='#cfd6e0'; ctx.beginPath(); ctx.arc(px,py,4+k*14,0,7); ctx.fill(); }
  else if(f.kind==='die'){ const im2=DIESPR[f.key]?raTint(DIESPR[f.key],f.team,f.key):null;
    if(im2&&im2.complete){ ctx.save(); ctx.translate(px,py); ctx.rotate((f.team==='blue'?-1:1)*k*0.9);
      const dsz=TILE*3.2*(1-k*0.15); ctx.globalAlpha=Math.max(0,1-k);
      ctx.globalAlpha=Math.max(0,1-(f.t/f.dur)*0.75);ctx.drawImage(im2,-dsz/2,-dsz*0.8,dsz,dsz); ctx.restore(); } }
  else if(f.kind==='star'){ const p=f.t/f.dur, r1=4+k*9, r0=r1*0.45; ctx.save(); ctx.translate(px,py); ctx.rotate(p*1.1); ctx.globalAlpha=1-p; ctx.fillStyle=f.col; ctx.beginPath(); for(let i=0;i<10;i++){ const rr=(i%2)?r0:r1, an=i*Math.PI/5; ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr); } ctx.closePath(); ctx.fill(); ctx.restore(); }   /* v195: 픽셀 좌표·소형 수복 */
  else if(f.kind==='ring'){ ctx.strokeStyle=f.col; ctx.lineWidth=3; ctx.beginPath();
    ctx.ellipse(px,py,8+k*26,(8+k*26)*0.5,0,0,7); ctx.stroke(); }
  else if(f.kind==='flamegrow'){ var __p2=f.t/f.dur, __r=TILE*(0.18+__p2*0.62), __fl=0.75+Math.random()*0.25;   /* v322: 커지는 화염 — 3층 확산+플리커 */
    ctx.globalAlpha=Math.max(0,(1-__p2)*0.9);
    ctx.fillStyle='rgba(255,110,40,'+(0.75*__fl).toFixed(3)+')'; ctx.beginPath(); ctx.ellipse(px,py-__r*0.15,__r,__r*0.72,0,0,7); ctx.fill();
    ctx.fillStyle='rgba(255,170,60,'+(0.8*__fl).toFixed(3)+')'; ctx.beginPath(); ctx.ellipse(px,py-__r*0.1,__r*0.66,__r*0.5,0,0,7); ctx.fill();
    ctx.fillStyle='rgba(255,235,150,'+(0.9*__fl).toFixed(3)+')'; ctx.beginPath(); ctx.ellipse(px,py,__r*0.36,__r*0.28,0,0,7); ctx.fill();
    ctx.globalAlpha=Math.max(0,1-k); }
  else if(f.kind==='snowzone'){   /* v327: 눈보라 지역 — 게임 화풍(서리 그라디언트+반짝이 눈송이+차가운 림) */
    const _px=f.x*TILE, _py=f.y*TILE, _rr=f.r*TILE, _a0=Math.min(1,f.t*2)*Math.min(1,(f.dur-f.t)*2);
    ctx.save();
    var __fim=(window.__FXIMG&&window.__FXIMG.frost&&window.__FXIMG.frost.complete&&window.__FXIMG.frost.naturalWidth>0&&window.__FXIMG.frost.__valid!==false)?window.__FXIMG.frost:null;
    if(__fim){ ctx.globalAlpha=0.95*_a0; ctx.drawImage(__fim,_px-_rr*1.02,_py-_rr*0.55,_rr*2.04,_rr*1.1); }   /* v328: 서리 스프라이트 */
    const _gr=ctx.createRadialGradient(_px,_py,_rr*0.1,_px,_py,_rr);
    _gr.addColorStop(0,'rgba(228,243,255,'+((__fim?0.16:0.44)*_a0)+')');
    _gr.addColorStop(0.65,'rgba(206,231,252,'+(0.27*_a0)+')');
    _gr.addColorStop(1,'rgba(206,231,252,0)');
    ctx.fillStyle=_gr; ctx.beginPath(); ctx.ellipse(_px,_py,_rr,_rr*0.52,0,0,7); ctx.fill();
    ctx.globalAlpha=0.5*_a0; ctx.fillStyle='#ffffff';   /* 서리 반점 */
    for(let i=0;i<5;i++){ const _fx2=_px+Math.sin(i*2.4+f.x*7)*_rr*0.55, _fy2=_py+Math.cos(i*1.9+f.y*5)*_rr*0.22;
      ctx.beginPath(); ctx.ellipse(_fx2,_fy2,_rr*0.15,_rr*0.06,0,0,7); ctx.fill(); }
    ctx.shadowColor='rgba(214,238,255,.95)'; ctx.shadowBlur=5; ctx.fillStyle='#ffffff';   /* v380: 랜덤 낙설 — 원 균일분포(√r)·개별 낙속/드리프트/크기(시드 결정형, 무플리커) */
    for(let i=0;i<20;i++){ const _s1=Math.sin(i*127.1+f.x*13.7+f.y*7.3)*43758.5453, _r1=_s1-Math.floor(_s1);
      const _s2=Math.sin(i*311.7+f.y*5.1+1.7)*12543.21, _r2=_s2-Math.floor(_s2);
      const _ang=_r1*6.2832, _rd=Math.sqrt(_r2)*0.92;
      const _bx=_px+Math.cos(_ang)*_rd*_rr, _by=_py+Math.sin(_ang)*_rd*_rr*0.5;
      const _sy=((f.t*(0.5+_r1*0.55)+_r2*9)%1);
      const _cx=_bx+Math.sin(f.t*(1.1+_r1*1.4)+i)*_rr*0.05, _cy=_by-_rr*0.52+_sy*_rr*1.05;
      const _tw=0.55+0.45*Math.sin(now*6+i*2.3);
      ctx.globalAlpha=(0.45+0.55*_tw)*_a0;
      ctx.beginPath(); ctx.arc(_cx,_cy,1.5+_r2*2.3,0,7); ctx.fill(); }
    for(let i=0;i<6;i++){ const _s3=Math.sin(i*91.3+f.x*3.3+0.9)*999.77, _g3=_s3-Math.floor(_s3);   /* v380: 지면 반짝임 글린트 */
      const _tw2=0.5+0.5*Math.sin(now*5+i*2.9+_g3*6);
      ctx.globalAlpha=(0.25+0.55*_tw2)*_a0;
      ctx.beginPath(); ctx.arc(_px+(Math.sin(i*2.7+f.x*11)*0.8)*_rr, _py+(Math.cos(i*1.9+f.y*7)*0.3)*_rr, 1.2+_g3*1.6, 0, 7); ctx.fill(); }
    ctx.shadowBlur=0;
    ctx.globalAlpha=0.4*_a0; ctx.strokeStyle='#eaf6ff'; ctx.lineWidth=1.5;   /* 차가운 림 */
    ctx.beginPath(); ctx.ellipse(_px,_py,_rr,_rr*0.52,0,0,7); ctx.stroke();
    ctx.restore();
  }
  else if(f.kind==='stormzone'){   /* v408: 번개 폭풍 존 — 발광 원판+낙뢰 지그재그 오버레이(페이드 인아웃·v327 화풍 표준) */
    const _sx=f.x*TILE, _sy=f.y*TILE, _sr=f.r*TILE, _sa0=Math.min(1,f.t*2.5)*Math.min(1,(f.dur-f.t)*2);
    ctx.save();
    const _sg=ctx.createRadialGradient(_sx,_sy,_sr*0.05,_sx,_sy,_sr);
    _sg.addColorStop(0,'rgba(70,50,110,0.55)'); _sg.addColorStop(0.65,'rgba(45,32,80,0.42)'); _sg.addColorStop(1,'rgba(80,60,140,0)');
    ctx.globalAlpha=_sa0; ctx.fillStyle=_sg; ctx.beginPath(); ctx.arc(_sx,_sy,_sr,0,7); ctx.fill();
    ctx.shadowColor='#ffe95e'; ctx.shadowBlur=14;
    for(let i=0;i<3;i++){   /* 낙뢰 지그재그 — 위상 오프셋 페이즈 */
      const _ph=now*1.9+i*2.09, _lx=_sx+Math.cos(_ph)*_sr*0.5, _ly=_sy+Math.sin(_ph)*_sr*0.28;
      ctx.globalAlpha=_sa0*(0.55+0.45*Math.sin(now*7+i*2.6));
      ctx.strokeStyle='#ffe95e'; ctx.lineWidth=2; ctx.beginPath();
      let _jx=_lx, _jy=_ly-_sr*0.85; ctx.moveTo(_jx,_jy);
      for(let s2=1;s2<=4;s2++){ _jx=_lx+Math.sin(now*9+i*3+s2*2.2)*7; _jy=_ly-_sr*0.85+_sr*0.85*(s2/4); ctx.lineTo(_jx,_jy); }
      ctx.stroke(); }
    ctx.shadowBlur=0; ctx.restore(); }
  else if(f.kind==='healzone'){   /* v409: 잔류 회복 존 — 연녹색 발광 원판+상승 글린트(v327 화풍 표준) */
    const _hx=f.x*TILE, _hy=f.y*TILE, _hr=f.r*TILE, _ha0=Math.min(1,f.t*2.5)*Math.min(1,(f.dur-f.t)*2);
    ctx.save();
    const _hg=ctx.createRadialGradient(_hx,_hy,_hr*0.05,_hx,_hy,_hr);
    _hg.addColorStop(0,'rgba(80,160,110,0.5)'); _hg.addColorStop(0.65,'rgba(60,130,90,0.38)'); _hg.addColorStop(1,'rgba(100,200,140,0)');
    ctx.globalAlpha=_ha0; ctx.fillStyle=_hg; ctx.beginPath(); ctx.arc(_hx,_hy,_hr,0,7); ctx.fill();
    ctx.shadowColor='#8fe6a8'; ctx.shadowBlur=12;
    for(let i=0;i<5;i++){ const _gs=Math.sin(i*77.7+f.x*5.1)*999.9, _gq=_gs-Math.floor(_gs);
      const _gx=_hx+(_gq-0.5)*_hr*1.5, _gy=_hy+_hr*0.4-((now*0.35+_gq)%1)*_hr*0.9;
      ctx.globalAlpha=_ha0*(0.3+0.5*Math.sin(now*5+i*2.2)); ctx.fillStyle='#bdf0cf';
      ctx.beginPath(); ctx.arc(_gx,_gy,1.4+((now+i*0.7)%1)*1.8,0,7); ctx.fill(); }
    ctx.shadowBlur=0; ctx.restore(); }
  else if(f.kind==='plasmazone'){   /* v380: 플라즈마 잔류 존 — 전기 아크+상승 스파크(시각 전용·페이드 인아웃) */
    const _px=f.x*TILE, _py=f.y*TILE, _rr=f.r*TILE, _a0=Math.min(1,f.t*2.5)*Math.min(1,(f.dur-f.t)*2);
    ctx.save();
    const _pg=ctx.createRadialGradient(_px,_py,_rr*0.05,_px,_py,_rr);
    _pg.addColorStop(0,'rgba(120,80,200,'+(0.30*_a0)+')'); _pg.addColorStop(0.6,'rgba(160,110,255,'+(0.20*_a0)+')'); _pg.addColorStop(1,'rgba(160,110,255,0)');
    ctx.fillStyle=_pg; ctx.beginPath(); ctx.ellipse(_px,_py,_rr,_rr*0.52,0,0,7); ctx.fill();
    ctx.strokeStyle='rgba(225,205,255,'+(0.85*_a0)+')'; ctx.lineWidth=1.8; ctx.shadowColor='rgba(190,150,255,.9)'; ctx.shadowBlur=6; ctx.globalAlpha=_a0;   /* 전기 아크 2선 — 0.12초마다 재생성(위상 시드) */
    for(let i=0;i<2;i++){ const _seed=Math.floor(f.t*8)*3.7+i*11.3;
      ctx.beginPath(); let _ax=_px+(Math.sin(_seed)*0.8)*_rr, _ay=_py+(Math.cos(_seed*1.7)*0.35)*_rr; ctx.moveTo(_ax,_ay);
      for(let s2=1;s2<=4;s2++){ const _ss=_seed+s2*2.3; _ax=_px+(Math.sin(_ss)*0.85)*_rr; _ay=_py+(Math.cos(_ss*1.3)*0.42)*_rr; ctx.lineTo(_ax,_ay); }
      ctx.stroke(); }
    ctx.shadowBlur=0;
    for(let i=0;i<8;i++){ const _sd=Math.sin(i*53.7+f.x*3.1)*777.7, _g=_sd-Math.floor(_sd); const _gp=((f.t*(0.7+_g*0.8)+_g)%1);   /* 상승 스파크 */
      ctx.globalAlpha=(1-_gp)*0.8*_a0; ctx.fillStyle='#e6d2ff';
      ctx.beginPath(); ctx.arc(_px+Math.sin(i*4.1+_g*9)*_rr*0.6, _py-_gp*_rr*0.6, 1.7, 0, 7); ctx.fill(); }
    ctx.globalAlpha=0.5*_a0; ctx.strokeStyle='#d9c2ff'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.ellipse(_px,_py,_rr,_rr*0.52,0,0,7); ctx.stroke();
    ctx.restore();
  }
  else if(f.kind==='crater'){   /* v327: 화염 분화구 — 게임 화풍(깊이 그라디언트+융기 림+발광 균열+상승 잔불·연기) */
    const _px=f.x*TILE, _py=f.y*TILE, _rr=f.r*TILE, _a0=Math.min(1,f.t*3)*Math.min(1,(f.dur-f.t)*1.2), _pu=0.6+0.4*Math.abs(Math.sin(now*5+f.y*2));
    ctx.save();
    var __cim=(window.__FXIMG&&window.__FXIMG.crater&&window.__FXIMG.crater.complete&&window.__FXIMG.crater.naturalWidth>0&&window.__FXIMG.crater.__valid!==false)?window.__FXIMG.crater:null;
    if(__cim){ ctx.globalAlpha=0.96*_a0; ctx.drawImage(__cim,_px-_rr*1.0,_py-_rr*0.56,_rr*2.0,_rr*1.12); }   /* v328: 분화구 스프라이트 */
    const _gg=ctx.createRadialGradient(_px,_py,1,_px,_py,_rr*0.85);   /* 그을린 움푹함 */
    _gg.addColorStop(0,'rgba(22,11,8,'+((__cim?0.10:0.92)*_a0)+')');
    _gg.addColorStop(0.6,'rgba(48,26,18,'+(0.75*_a0)+')');
    _gg.addColorStop(1,'rgba(70,40,26,0)');
    ctx.fillStyle=_gg; ctx.beginPath(); ctx.ellipse(_px,_py,_rr*0.85,_rr*0.46,0,0,7); ctx.fill();
    if(!__cim){ ctx.globalAlpha=0.8*_a0; ctx.strokeStyle='#6b4527'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.ellipse(_px,_py,_rr*0.85,_rr*0.46,0,Math.PI*1.05,Math.PI*1.95); ctx.stroke(); }   /* v328: 스프라이트 부재 시 폴백 림 */
    for(let i=0;i<7;i++){ const _an=now*0.9+i*0.9, _rd=_rr*(0.2+((i*0.19)%0.4));   /* 잔불 펄스 */
      ctx.globalAlpha=(0.4+0.35*Math.abs(Math.sin(now*7+i*2)))*_a0; ctx.fillStyle=i%2?'#ffb14d':'#ff8a3c';
      ctx.beginPath(); ctx.arc(_px+Math.cos(_an*1.3)*_rd, _py+Math.sin(_an)*_rd*0.45, 2.6, 0, 7); ctx.fill(); }
    for(let i=0;i<4;i++){ const _rt=((f.t*0.35+i*0.27)%1);   /* 상승 잔불 입자 */
      ctx.globalAlpha=(1-_rt)*0.8*_a0; ctx.fillStyle='#ffd27a';
      ctx.beginPath(); ctx.arc(_px+Math.sin(i*3.1+f.x)*_rr*0.4, _py-_rt*_rr*0.75, 1.8, 0, 7); ctx.fill(); }
    for(let i=0;i<3;i++){ const _st=((f.t*0.16+i*0.37)%1);   /* 연기 */
      ctx.globalAlpha=(1-_st)*0.22*_a0; ctx.fillStyle='#8a8078';
      ctx.beginPath(); ctx.arc(_px+Math.sin(i*2.2)*_rr*0.2, _py-_st*_rr*0.95-_rr*0.1, 4+_st*7, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  else if(f.kind==='shockring'){   /* v329: 전기 충격 링 스프라이트(플라즈마·충격파·자패) */
    var __sk=window.__FXIMG&&window.__FXIMG.shockring;
    var _px=f.x*TILE,_py=f.y*TILE,_sc=TILE*2.4*(0.55+0.5*k);
    if(__sk&&__sk.complete&&__sk.naturalWidth>0&&__sk.__valid!==false){ ctx.save(); ctx.globalAlpha=0.95*(1-k*0.4); ctx.drawImage(__sk,_px-_sc/2,_py-_sc*0.55,_sc,_sc); ctx.restore(); }
  }
  else if(f.kind==='healzone'){   /* v329: 회복 오라 스프라이트(회복의 바람) */
    var __hl=window.__FXIMG&&window.__FXIMG.heal;
    var _px2=f.x*TILE,_py2=f.y*TILE,_sc2=TILE*2.2*(0.85+0.15*Math.sin(now*6));
    if(__hl&&__hl.complete&&__hl.naturalWidth>0&&__hl.__valid!==false){ ctx.save(); ctx.globalAlpha=0.85*(1-k); ctx.drawImage(__hl,_px2-_sc2/2,_py2-_sc2*0.55,_sc2,_sc2); ctx.restore(); }
  }
  else if(f.kind==='venomzone'){   /* v329: 맹독 안개 스프라이트(시전 지역 6초) */
    var __vf=window.__FXIMG&&window.__FXIMG.venomfog;
    var _px3=f.x*TILE,_py3=f.y*TILE,_a0=Math.min(1,f.t*1.5)*Math.min(1,(f.dur-f.t)*1.5);
    if(__vf&&__vf.complete&&__vf.naturalWidth>0&&__vf.__valid!==false){ ctx.save(); ctx.globalAlpha=(0.8+0.12*Math.sin(now*3+f.x))*_a0; var _sc3=TILE*(f.r||2.2)*2; ctx.drawImage(__vf,_px3-_sc3/2,_py3-_sc3*0.55,_sc3,_sc3); ctx.restore(); }
  }
  else if(f.kind==='warnring'){
    const rr=CARDS.fireball.radius*TILE*(0.9+0.1*Math.sin(now*10));
    ctx.globalAlpha=0.55+0.25*Math.sin(now*10);
    ctx.strokeStyle='#ff6b4d'; ctx.lineWidth=3; ctx.setLineDash([8,7]);
    ctx.beginPath(); ctx.ellipse(px,py,rr,rr*0.5,0,0,7); ctx.stroke(); ctx.setLineDash([]);
    ctx.globalAlpha=1;
  }
  else if(f.kind==='zapx'){
    for(let bi=0;bi<3;bi++){ const ox=(bi-1)*7;
      ctx.strokeStyle=bi===0?'#fff8c8':'rgba(255,233,94,.8)'; ctx.lineWidth=bi===0?2:1.5;
      ctx.beginPath(); let bx=px+ox, by=py-70;
      ctx.moveTo(bx,by);
      for(let seg=0;seg<5;seg++){ bx+=Math.random()*16-8; by+=14; ctx.lineTo(bx,by); }
      ctx.lineTo(px,py); ctx.stroke(); }
    ctx.globalAlpha=1;
  }
  else if(f.kind==='zap'){
    const zim=PSPR.zap;
    if(zim&&zim.complete){ const zs=88;
      ctx.globalAlpha=Math.max(0,1-k)*(0.8+0.2*Math.sin(now*40));
      ctx.drawImage(zim,px-zs/2,py-zs+12,zs,zs); ctx.globalAlpha=Math.max(0,1-k); }
    else{ ctx.strokeStyle='#ffe95e'; ctx.lineWidth=2.5;
      for(let b=0;b<3;b++){ let lx=px+(b-1)*9, ly=py-64;
        ctx.beginPath(); ctx.moveTo(lx,ly);
        for(let s4=0;s4<4;s4++){ lx+=Math.random()*14-7; ly+=16; ctx.lineTo(lx,ly); }
        ctx.stroke(); } }
    ctx.strokeStyle='rgba(255,233,94,.55)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(px,py,8+k*24,0,7); ctx.stroke();
  }
  else if(f.kind==='pillar'){
    ctx.globalAlpha=(1-k)*0.75;
    const g2=ctx.createLinearGradient(px,py-70,px,py+8);
    g2.addColorStop(0,'rgba(255,255,255,0)'); g2.addColorStop(1,f.col||'#cfe0ff');
    ctx.fillStyle=g2; ctx.fillRect(px-9,py-70,18,78);
    ctx.fillStyle=f.col||'#cfe0ff'; ctx.beginPath(); ctx.ellipse(px,py+2,16*(1-k)+4,7*(1-k)+2,0,0,7); ctx.fill();
  }
  else if(f.kind==='muzzle'){ const mx=px+Math.cos(f.a)*13, my=py+Math.sin(f.a)*13;
      ctx.fillStyle='#ffe9a8'; ctx.beginPath(); ctx.arc(mx,my,4*(1-k)+2,0,7); ctx.fill(); }
  else if(f.kind==='flash'){ ctx.globalAlpha=(1-k)*0.45; ctx.fillStyle='#fff'; ctx.fillRect(-BAND-24,-24,VW+48,VH+48); }
  else if(f.kind==='crownfly'){
    const e=1-Math.pow(1-k,3), cx2=lerp(px,f.tx,e), cy2=lerp(py,f.ty,e)-Math.sin(Math.PI*e)*40;
    ctx.globalAlpha=1; ctx.font='26px sans-serif'; ctx.textAlign='center';
    ctx.fillText('👑',cx2,cy2);
  }
  else if(f.kind==='boom'){ var __bm=window.__FXIMG&&window.__FXIMG.boom; if(__bm&&__bm.complete&&__bm.naturalWidth>0&&__bm.__valid!==false){ var _bw=TILE*1.9*(0.8+0.25*k); ctx.save(); ctx.globalAlpha=0.95*(1-k*0.55); ctx.drawImage(__bm,f.x*TILE-_bw/2,f.y*TILE-_bw*0.6,_bw,_bw); ctx.restore(); }   /* v329: 폭발 스프라이트(성장+페이드) */
    if(k<0.3){ ctx.globalAlpha=(0.3-k)*3.3; ctx.fillStyle='#fff';
      ctx.beginPath(); ctx.arc(px,py,16+k*90,0,7); ctx.fill(); ctx.globalAlpha=Math.max(0,1-k); }
    ctx.fillStyle=k<0.4?'#ffdd55':'#ff7b1c'; ctx.beginPath(); ctx.arc(px,py,10+k*44,0,7); ctx.fill();
    ctx.strokeStyle='#fff'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(px,py,12+k*54,0,7); ctx.stroke(); }
  ctx.globalAlpha=1;
}
function render(){
  if(S.scene!=='battle') return;
  ctx.setTransform(BSCALE,0,0,BSCALE,0,0);   // v117: 프레임 시작마다 절대 기준 변환 고정 — 렌더 도중 예외로 save 잔여분이 스택에 누적돼 확대 배율이 프레임마다 쌓이던 것(칩 1.01x·화면 지속 줌인) 근본 차단
  ctx.save();
  if(S.shake>0){ ctx.translate((Math.random()-0.5)*S.shake*14,(Math.random()-0.5)*S.shake*14); S.shake=Math.max(0,S.shake-0.02); }
  ctx.clearRect(-24,-24,VW+48,VH+48);
  try{ const T0=THEMES[S.theme]; ctx.fillStyle=T0?T0.g1:'#0b1220'; ctx.fillRect(0,0,VW,VH);   /* v393: 베이스 단색 — 배경 절대 노출 금지 */
    const __bg2=(typeof GT_IM!=='undefined')&&GT_IM[S.theme]; if(__bg2&&__bg2.complete&&__bg2.naturalWidth) ctx.drawImage(__bg2,0,0,VW,VH);   /* v396: 텍스처 연장 커버 복원 — bgc 결함 시에도 텍스처가 그 자리를 채움 */
  }catch(__e){}
  { const cam=S.cam||{x:W/2,y:H/2,z:1};
    ctx.translate(VW/2,VH/2); ctx.scale(cam.z,cam.z); ctx.translate(-cam.x,-cam.y); }
  ctx.drawImage(bgc,-BAND,0,VW,VH); try{for(const f of fx) if(ZK.has(f.kind)) drawFx(f);}catch(__e){} tilehlDraw(ctx);   /* v404: 지면 존(눈보라·분화구·맹독 등)은 유닛·타워·보스 아래에서 렌더 — 가림 제거 */   /* v399: 합성 dest x=-BAND — bgc 내부 +BAND 쉬프트 상쇄(지면+2BAND 우편위 해소), 화면 0..BAND 언더레이어 노출(좌측 밝은 올리브 띠) 제거 */   /* v149 */
  const T=THEMES[S.theme];
  ctx.strokeStyle=T.spark; ctx.lineWidth=S.theme==='lava'?3:2;
  if(S.theme==='lava'){ ctx.save(); ctx.shadowColor='#ff8a2a'; ctx.shadowBlur=14; }
  for(let i=0;i<5;i++){
    const yy=(RIVER_Y0+0.35+i*0.4)*TILE, off=(now*36+i*77)%(VW+80)-40;
    ctx.beginPath();
    ctx.moveTo(off-16,yy+Math.sin(now*2.4+i)*1.6);
    ctx.quadraticCurveTo(off-5,yy-3+Math.sin(now*2.4+i)*1.6, off+6,yy+Math.sin(now*2.4+i+1)*1.6);
    ctx.stroke();
  }
  if(S.theme==='lava') ctx.restore();
  { const im=DSPR[S.theme], DEC=DECO[S.theme];
    if(im&&im.complete&&DEC) for(const d of DEC){
      const sz=2.1*TILE*d.s;
      ctx.save(); ctx.translate(d.x*TILE,d.y*TILE); ctx.rotate(d.rot); if(d.f) ctx.scale(-1,1);
      ctx.fillStyle='rgba(0,0,0,.5)'; ctx.beginPath(); ctx.ellipse(0,sz*0.46,sz*0.60,sz*0.15,0,0,7); ctx.fill();
      if(S.theme==='lava'){ const pul=0.5+0.5*Math.sin(now*2.2+d.x*3);
        const gl=ctx.createRadialGradient(0,0,sz*0.15,0,0,sz*0.6);
        gl.addColorStop(0,'rgba(255,122,26,'+(0.30+0.18*pul).toFixed(3)+')'); gl.addColorStop(1,'rgba(255,122,26,0)');
        ctx.fillStyle=gl; ctx.beginPath(); ctx.arc(0,0,sz*0.6,0,7); ctx.fill(); }
      ctx.drawImage(im,-sz/2,-sz/2,sz,sz); ctx.restore(); } }
  if(S.theme==='classic'){ for(const d of DECOC){ const gim=GSPR[d.k];
    if(!gim||!gim.complete||!gim.naturalWidth) continue;
    const gsz=2.1*TILE*d.s;
    ctx.save(); ctx.translate(d.x*TILE,d.y*TILE); if(d.f) ctx.scale(-1,1); if(d.rot) ctx.rotate(d.rot);
    ctx.fillStyle='rgba(0,0,0,.26)'; ctx.beginPath(); ctx.ellipse(2,gsz*0.42,gsz*0.40,gsz*0.12,0,0,7); ctx.fill();
    ctx.drawImage(gim,-gsz/2,-gsz/2,gsz,gsz); ctx.restore(); } }
  if(P.sel!=null&&!S.over){
    try{ ctx.save(); ctx.globalAlpha=0.09+0.05*Math.sin((S._now||0)*5); ctx.fillStyle='#ffd75e'; ctx.fillRect(0,BLUE_DEPLOY_MIN*TILE,W,(ROWS-BLUE_DEPLOY_MIN)*TILE); ctx.restore(); }catch(e){ }   /* v192 P13: 배치 구역 펄스 */
    const c=CARDS[P.hand[P.sel]];
    ctx.fillStyle=c.kind==='spell'?'rgba(199,125,255,.15)':'rgba(63,123,245,.17)';
    if(c.kind==='spell') ctx.fillRect(-BAND,-VBAND,VW,VH);
    else ctx.fillRect(0,BLUE_DEPLOY_MIN*TILE,W,H-BLUE_DEPLOY_MIN*TILE);
    ctx.strokeStyle='rgba(255,255,255,.5)'; ctx.setLineDash([10,7]); ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(-BAND,BLUE_DEPLOY_MIN*TILE); ctx.lineTo(VW-BAND,BLUE_DEPLOY_MIN*TILE); ctx.stroke(); ctx.setLineDash([]);
  }
  try{for(const t of towers) if(t.dead) drawRubble(t);}catch(__e){window.__skip=(window.__skip||0)+1;console.warn("draw-skip",__e.message);}
  try{for(const t of towers) if(!t.dead) drawTower(t);}catch(__e){window.__skip=(window.__skip||0)+1;console.warn("draw-skip",__e.message);}
  try{for(const u of [...units].sort((a,b)=>a.y-b.y)) drawUnit(u);}catch(__e){window.__skip=(window.__skip||0)+1;console.warn("draw-skip",__e.message);}
  try{for(const p of projs) drawProj(p);}catch(__e){window.__skip=(window.__skip||0)+1;console.warn("draw-skip",__e.message);}
  for(const f of fx) if(!ZK.has(f.kind)) drawFx(f);   /* v404: 지면 존은 아래 패스로 이동(순수 렌더 변경 — 틱 데미지 로직 무변경) */
  drawParts();
  drawAmbient();
  if(S.clash&&S.clash.a>0){   // 황금 교전 링 + 발광
    const cx2=S.clash.x*TILE, cy2=S.clash.y*TILE, rr=(3.2+Math.sin(now*6)*0.4)*TILE;
    ctx.globalAlpha=S.clash.a*0.75; ctx.strokeStyle='#ffd75e'; ctx.lineWidth=3.5;
    ctx.beginPath(); ctx.ellipse(cx2,cy2,rr,rr*0.62,0,0,7); ctx.stroke();
    const gl=ctx.createRadialGradient(cx2,cy2,rr*0.2,cx2,cy2,rr);
    gl.addColorStop(0,'rgba(255,215,94,'+(0.22*S.clash.a)+')'); gl.addColorStop(1,'rgba(255,215,94,0)');
    ctx.fillStyle=gl; ctx.beginPath(); ctx.ellipse(cx2,cy2,rr,rr*0.62,0,0,7); ctx.fill();
    ctx.globalAlpha=1;
  }
  if(S.boss) syncBossHud();
  for(const f of floats){
    const k=1-f.t/0.7;
    ctx.globalAlpha=Math.min(1,f.t*2);
    ctx.font=(f.big?'900 22px':'900 15px')+' Jua, sans-serif';  ctx.textAlign='center';
    ctx.strokeStyle='rgba(0,0,0,.8)'; ctx.lineWidth=3;
    ctx.strokeText(f.txt,f.x*TILE,f.y*TILE-k*18);
    ctx.fillStyle=f.col; ctx.fillText(f.txt,(f.dx||0)+f.x*TILE,(f.dy||0)+f.y*TILE-k*18);
    ctx.globalAlpha=1;
  }
  ctx.restore();
  drawVignette();

  try{ drawFrame(); }catch(e){}   // v123: 프레임 드로우 — 최상위 레이어(스크린 공간)
}

/* ---------- 입력 ---------- */
function evtPos(e){
  const r=canvas.getBoundingClientRect();
  let px=(e.clientX-r.left)*VW/Math.max(1,r.width), py=(e.clientY-r.top)*VH/Math.max(1,r.height);
  const cam=S.cam||{x:W/2,y:H/2,z:1};
  px=(px-VW/2)/cam.z+cam.x; py=(py-VH/2)/cam.z+cam.y;   // 컴뱃 캠 역변환
  return {x:px/TILE, y:py/TILE};
}
function tryDeploy(e){
  if(S.scene!=='battle'||S.over) return;
  if(S.ks){ fireKingShot(evtPos(e)); return; }
  const p=evtPos(e);
  if(P.sel==null){ toast('아래 카드를 먼저 선택하세요'); return; }
  const key=P.hand[P.sel], c=CARDS[key];
  if(c.kind!=='spell'&&p.y<BLUE_DEPLOY_MIN){ toast('아군 진영(아래쪽)에만 배치할 수 있어요'); return; }
  if(c.cost>P.elixir){ toast('엘릭서가 부족해요'); return; }
  playCard(P,P.sel,clamp(p.x,0.7,COLS-0.7), c.kind==='spell'?clamp(p.y,0.7,ROWS-0.7):Math.max(p.y,BLUE_DEPLOY_MIN));
  P.sel=null; dragFrom=-1; syncHand();
}
canvas.addEventListener('pointerdown',e=>{ ensureAudio(); S._pan={x:e.clientX,y:e.clientY,moved:false}; try{ if(canvas.setPointerCapture&&e.pointerId!=null) canvas.setPointerCapture(e.pointerId); }catch(err){} });   // v115: \ud3ec\uc778\ud130 \uce99\cc98 — \uc908\uc778 \uc0c1\ud0dc \ub4dc\ub798\uadf8 \ud3f0 \uc720\uc9c0
window.addEventListener('pointermove',e=>{
  if(!S._pan) return;
  const dx=e.clientX-S._pan.x, dy=e.clientY-S._pan.y;
  if(!S._pan.moved&&Math.hypot(dx,dy)>12&&S.cam&&S.cam.z>1.05) S._pan.moved=true;
  if(S._pan.moved&&S.scene==='battle'){
    const c=S.cam, vw=VW/c.z, vh=VH/c.z;
    c.x=(vw>=W)?W/2:clamp(c.x-dx/c.z,vw/2,W-vw/2); c.y=(vh>=H)?H/2:clamp(c.y-dy/c.z,vh/2,H-vh/2);
    if(S.focus){ S.focus.x=c.x; S.focus.y=c.y; S.focus.v=null; }   // v111: 팬 전환 시 추적 해제(고정 클로즈업 유지)
    S._pan.x=e.clientX; S._pan.y=e.clientY;
  }
});
let dragFrom=-1;
window.addEventListener('pointerup',e=>{
  if(S._pan){ if(!S._pan.moved) tryDeploy(e); S._pan=null; return; }
  if(dragFrom<0) return;
  const r=canvas.getBoundingClientRect();
  const inside=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
  if(inside&&P.sel!=null) tryDeploy(e);
  dragFrom=-1;
});
canvas.addEventListener('contextmenu',e=>{ e.preventDefault(); if(P.sel!=null){ P.sel=null; syncHand(); } });
document.addEventListener('keydown',e=>{
  if(S.scene!=='battle') return;
  const n=parseInt(e.key,10);
  if(n>=1&&n<=4){ P.sel=(P.sel===n-1?null:n-1); syncHand(); }
  if(e.key==='Escape'){ if(P.sel!=null){ P.sel=null; syncHand(); } if(S.ks){ S.ks=false; syncHUD(); } }
});

/* ---------- HUD ---------- */
let cardEls=[];
window.__raTierCards=function(){ try{
  if(!window.cardEls||!cardEls.length) return;
  cardEls.forEach(function(c){
    var nm=c.querySelector('.nm'); if(!nm) return; var key=nm.textContent.trim();
    var cd=CARDS[key]; if(!cd) return;
    c.classList.remove('ra-t1','ra-t2','ra-t3');
    c.classList.add(cd.cost<=2?'ra-t1':(cd.cost===3?'ra-t2':'ra-t3'));
    var __lv=(typeof __cLv==='function')?__cLv(key):1; var __lb=c.querySelector('.ra-lv'); if(!__lb){ __lb=document.createElement('div'); __lb.className='ra-lv'; c.appendChild(__lb); } __lb.textContent='Lv.'+__lv;   /* v210 P17 */
  });
}catch(e){} };
function buildHandUI(){
  const box=$('#cards'); box.innerHTML=''; cardEls=[];
  try{ if(box&&!box.dataset.dlg310){ box.dataset.dlg310='1'; box.addEventListener('pointerdown',function(ev){   /* v310: 이벤트 위임 — 카드 DOM 재생성과 무관하게 탭 보장 */
    try{ var __t=ev.target&&ev.target.closest?ev.target.closest('.card'):null; if(!__t) return;
      var __list=box.querySelectorAll('.card'), __idx=-1; for(var __i2=0;__i2<__list.length;__i2++){ if(__list[__i2]===__t){ __idx=__i2; break; } }
      if(__idx<0||__idx>3) return;
      try{ ensureAudio(); }catch(e1){}
      if(S.over) return;
      P.sel=__idx; dragFrom=__idx;
      try{ syncHand(); }catch(e2){ try{ P.sel=__idx; }catch(e3){} }
      try{ tutCardTap(__idx); }catch(e4){}
    }catch(e){}
  }); } }catch(e){}
  for(let i=0;i<4;i++){
    const d=document.createElement('div'); d.className='card';
    d.innerHTML='<div class="cost"><span></span></div><div class="emoji"></div><div class="nm"></div>';
    d.addEventListener('pointerdown',()=>{ try{ ensureAudio(); if(S.over) return; }catch(e){}
      try{ P.sel=i; dragFrom=i; syncHand(); try{ tutCardTap(i); }catch(e){} }catch(e2){ P.sel=i; dragFrom=i; } });   /* v307: 선택 등록 무조건 보장 — 오버레이/오디오 예외가 탭을 죽이지 않는다 */
    box.appendChild(d); cardEls.push(d);
  }
  setTimeout(function(){ try{ __raTierCards(); }catch(e){} },0);   /* v207: 등급 프레임 전투 손카드 확장 */
  syncHand();
}
function syncHand(){
  try{ __raZoneHL(dragFrom>=0||P.sel!=null||(TUT.on&&TUT.step===2)); }catch(e){}   /* v208 P13 + v212: 튜토리얼 배치 단계 상시 */
  try{ var __px2=(typeof P!=='undefined'&&P)?P.elixir:0, __tr=document.getElementById('elixir-track'); if(__tr){ var __full=__px2>=ELX_MAX-0.1; __tr.classList.toggle('ra-full',__full); if(__full&&!S.__elxFull){ S.__elxFull=1; toast('엘릭서 만원 — 카드를 배치하세요'); } if(!__full) S.__elxFull=0; } }catch(e){}   /* v214: 엘릭서 만원 UX(게이지 펄스+1회 토스트) */
  try{ if(TUT.on&&(TUT.step===1||TUT.step===4)) setTimeout(tutShow,0); }catch(e){}   /* v147: 핸드 재구성 후 링·디밍 재적용(buildHandUI가 카드 DOM을 재생성하는 결함 수복) */
  for(let i=0;i<4;i++){
    const d=cardEls[i]; if(!d) continue;
    const k=P.hand[i], c=CARDS[k]; if(!c){ continue; }   /* v310: 공백 슬롯 가드 */
    d.classList.remove('rar-c','rar-r','rar-e'); d.classList.add('rar-'+((k&&RAR[k])||'c'));
    if(d.dataset.k!==k){ d.dataset.k=k;
      d.querySelector('.emoji').innerHTML=ART[k]?`<img class="art" src="${ART[k]}" alt="">`:c.emoji;
      d.querySelector('.nm').textContent=c.name;
      d.querySelector('.cost span').textContent=c.cost;
      const rr=RARC[RKEY[k]||'c'];
      d.style.setProperty('--c-top',rr[0]); d.style.setProperty('--c-mid',rr[1]); d.style.setProperty('--c-bot',rr[2]); }
    d.classList.toggle('sel',P.sel===i);
  }
  try{ window.__exSync(); }catch(e){}   /* v319 */
  const nk=P.queue[0];
  $('#next-card').innerHTML= nk?`<span class="emoji">${ART[nk]?`<img class="art" src="${ART[nk]}" alt="">`:CARDS[nk].emoji}</span><span class="nm">${CARDS[nk].name}</span>`:'';
}
function syncHUD(){
  $('#elixir-fill').style.width=(P.elixir/ELX_MAX*100)+'%';
  $('#elixir-num').textContent=Math.floor(P.elixir);
  var __full=P.elixir>=9.999;
  var __ef=document.getElementById('elixir-fill');
  if(__ef){ var __fw=__ef.classList.toggle('exl-full',__full&&!S.over); try{ if(__fw&&!P._warned){ P._warned=true; toast('엘릭서 만땅 — 카드를 사용해 주세요'); } }catch(e2){} if(!__full) P._warned=false; }   /* v139: 만원 낭비 방지 펄스 */
  $('#elixir-fill').classList.toggle('full',__full);
  $('#elixir-track').classList.toggle('full',__full);
  $('#elixir-num').classList.toggle('full',__full);
  try{ if(__full&&!P._full){ tone(620,.09,'sine',.05); setTimeout(function(){ tone(930,.14,'sine',.05); },90); } }catch(e){}   /* v314: 만땅 톤 예외가 syncHUD를 죽이지 않는다 */
  P._full=__full;
  const ksBtn=document.getElementById('ks-btn');
  if(ksBtn){ const bo=!!(S.boss&&!S.boss.dead);
    ksBtn.classList.toggle('dim',!(bo&&S.ksCd<=0));   // v124: 보스 부재·쿨다운은 dim(비활성 표현)
    if(bo) ksBtn.textContent=S.ks?'🎯 조준 중… 탭=발사':(S.ksCd>0?'🎯 킹샷 '+Math.ceil(S.ksCd)+'s':'🎯 킹샷 READY'); else ksBtn.textContent='🎯 킹샷'; }
  $('#badge-double').classList.toggle('hidden',!S.double);
  try{ syncBossHud(); }catch(e){}   // v104: DOM 보스 상태 HUD
  try{ syncRepairBtn(); }catch(e){}   // v106: 수리 버튼 상태
  const mm=Math.max(0,Math.floor(S.t/60)), ss=Math.max(0,Math.floor(S.t%60));
  const tEl=$('#timer');
  tEl.textContent=(S.overtime?'+':'')+mm+':'+String(ss).padStart(2,'0');
  tEl.classList.toggle('urgent',S.t<=60);
  $('#crowns-blue').textContent=S.crowns.blue;
  $('#crowns-red').textContent=S.crowns.red;
  if(S.scene==='battle') try{ window.__exSync(); }catch(e){}   /* v319: 단일 활성화 갱신 함수 */
}
window.__exSync=function(){ try{   /* v319: 재구현 — ex-off 클래스 하나만 토글(테두리·투명도는 CSS 상시 선언), 슬롯 가드 포함 */
  if(typeof P==='undefined'||!P||!P.hand) return;
  var __cs=document.querySelectorAll('#cards .card');
  for(var __i=0;__i<__cs.length;__i++){
    var __k=P.hand[__i], __c=__k?CARDS[__k]:null;
    __cs[__i].classList.toggle('ex-off',!( __c&&__c.cost<=P.elixir ));
  }
}catch(e){} };
try{ (function(){   /* v310: 핸드 공백 슬롯 자동 치유 — 사이클 불량이 손 전체 동결로 가지 않는다 */
  setInterval(function(){ try{
    if(typeof S==='undefined'||!S||S.scene!=='battle'||typeof P==='undefined'||!P||!P.hand) return;
    for(var __hi=0;__hi<4;__hi++){ if(!P.hand[__hi]||!CARDS[P.hand[__hi]]){ P.hand[__hi]=(P.queue&&P.queue.length)?P.queue.shift():Object.keys(CARDS)[Math.floor(Math.random()*Object.keys(CARDS).length)]; try{ syncHand(); }catch(e2){} } }
  }catch(e){} },800);
})(); }catch(e){}

/* ---------- 화면 전환 & 시작 ---------- */
function show(scene){
  S.scene=scene;
  $('#screen-title').classList.toggle('hidden',scene!=='title');
  $('#screen-battle').classList.toggle('hidden',scene!=='battle');
  if(scene!=='battle') $('#overlay-result').classList.add('hidden');
}

/* v147 인터랙티브 튜토리얼(§4): 첫 실행 전용 FSM 6단계 — 배너·펄스 링·반투명·엘릭서 플로어 */
const TUT={on:false,step:0,comb:false};
const TUT_STEPS=['카드를 선택하세요','아군 진영에 유닛을 배치하세요','첫 교전을 관전하세요','주문을 시전하세요','왕관을 획득하세요','튜토리얼 완료!'];
function tutEnsureUI(){ if(document.getElementById('tutbar')) return; const st=document.createElement('style'); st.id='tutst'; st.textContent='#tutbar{position:fixed;top:calc(8px + env(safe-area-inset-top,0px));left:50%;transform:translateX(-50%);z-index:1450;background:rgba(13,27,46,.92);border:1px solid #f7c531;border-radius:12px;padding:8px 10px;display:flex;gap:8px;align-items:center;font-family:var(--fd);box-shadow:0 4px 14px rgba(0,0,0,.45)}#tutbar .tt{color:#f7c531;font-weight:800;font-size:12px;white-space:nowrap}#tutbar .ts{background:#e64545;color:#fff;border:0;border-radius:8px;font:800 11px var(--fd);padding:5px 8px}#tutbar{flex-direction:row}#tutbar .tt{color:#f7c531}@keyframes tutring{0%{box-shadow:0 0 0 0 rgba(247,197,49,.9)}100%{box-shadow:0 0 0 12px rgba(247,197,49,0)}}.card.tut-ring{animation:tutring 1s infinite}.card.tut-dim{opacity:.38}'; document.head.appendChild(st); const b=document.createElement('div'); b.id='tutbar'; b.innerHTML='<span class="tt"></span><button class="ts">건너뛰기</button>'; b.querySelector('.ts').addEventListener('pointerdown',function(e){ e.stopPropagation(); tutSkip(); }); document.body.appendChild(b); }
function tutShow(){ tutEnsureUI(); const b=document.getElementById('tutbar'); b.style.display='flex'; b.querySelector('.tt').textContent='Step '+TUT.step+'/6 · '+TUT_STEPS[TUT.step-1]; const cards=document.querySelectorAll('#cards .card'); cards.forEach(function(d,i){ const tgt=TUT.on&&(TUT.step===1||TUT.step===4)&&i===0; d.classList.toggle('tut-ring',tgt); d.classList.toggle('tut-dim',TUT.on&&(TUT.step===1||TUT.step===4)&&i!==0); }); }
function tutBegin(){ try{ if(typeof localStorage==='undefined'||TUT.on) return; if(localStorage.getItem('ra_tut_done')==='1'||localStorage.getItem('ra_hist_v1')) return; tutEnsureUI(); TUT.on=true; TUT.step=1; tutShow(); }catch(e){ TUT.on=false; } }
function tutGo(n){ if(!TUT.on) return; TUT.step=n; tutShow(); if(n===3){ TUT.comb=false; setTimeout(function(){ if(TUT.on&&TUT.step===3) tutGo(4); },6000); } if(n===4){ setTimeout(function(){ if(TUT.on&&TUT.step===4) tutGo(5); },20000); } if(n===5){ setTimeout(function(){ if(TUT.on&&TUT.step===5) tutGo(6); },15000); } if(n===6){ tutModal(); } }
function tutAdvance__unused(){}
function tutCardTap(i){ if(TUT.on&&TUT.step===1) tutGo(2); }
function tutOnSpawn(key,team){ if(!TUT.on||team!=='blue') return; let c=null; try{ c=CARDS[key]||{}; }catch(e){} if(TUT.step===2&&c&&c.kind!=='spell') tutGo(3); if(TUT.step===4&&c&&c.kind==='spell') tutGo(5); }
function tutCombat(){ if(TUT.on&&TUT.step===3&&!TUT.comb){ TUT.comb=true; setTimeout(function(){ if(TUT.on&&TUT.step===3) tutGo(4); },1200); } }
function tutCrown(t){ if(TUT.on&&TUT.step===5&&t==='blue') tutGo(6); }
function tutModal(){ const m=document.createElement('div'); m.id='tutdone'; m.style.cssText='position:fixed;inset:0;z-index:2147483650;background:rgba(8,15,30,.82);display:flex;align-items:center;justify-content:center'; m.innerHTML='<div style="background:#0d1b2e;border:2px solid #f7c531;border-radius:16px;padding:22px 26px;text-align:center;font-family:var(--fd);max-width:78vw"><div style="font-size:26px">🎓</div><div style="color:#f7c531;font-weight:900;font-size:19px;margin:8px 0">튜토리얼 완료!</div><div style="color:#dfe8f5;font-size:12.5px;line-height:1.55">이제 전략대로 싸울 준비가 됐어요.<br>왕관 3개를 모아 승리하세요!</div><button id="tutok" style="margin-top:12px;background:#f7c531;color:#0d1b2e;border:0;border-radius:10px;font:900 14px var(--fd);padding:9px 22px">확인</button></div>'; document.body.appendChild(m); m.querySelector('#tutok').addEventListener('pointerdown',function(){ tutFinish(); }); }
function tutFinish(){ try{ localStorage.setItem('ra_tut_done','1'); }catch(e){} TUT.on=false; TUT.step=0; try{ const b=document.getElementById('tutbar'); if(b) b.style.display='none'; const m=document.getElementById('tutdone'); if(m) m.remove(); document.querySelectorAll('#cards .card').forEach(function(d){ d.classList.remove('tut-ring','tut-dim'); }); }catch(e){} }
function tutSkip(){ tutFinish(); try{ toast('튜토리얼을 건너뛰었어요'); }catch(e){} }


/* v148 실시간 DPS 위젯(§4): 우상단 유닛별 누적 피해/경과 DPS·배치수 브리핑 — 펼침/접기 토글, 표시 전용(배치 영역 비침범) */
const DPSW={acc:{},cnt:{},time:0,open:true,_c:0};
function dpswEnsure(){ if(document.getElementById('dpsw')) return; const st=document.createElement('style'); st.id='dpswst'; st.textContent='#dpsw{position:fixed;right:8px;top:calc(64px + env(safe-area-inset-top,0px));z-index:1400;font-family:var(--fd);pointer-events:none;max-width:118px}#dpsw .dw-t{pointer-events:auto;background:rgba(13,27,46,.74);border:1px solid #f7c531;color:#f7c531;border-radius:10px;font:800 11px var(--fd);padding:4px 8px;box-shadow:0 3px 10px rgba(0,0,0,.4);width:100%;text-align:right}#dpsw .dw-b{margin-top:4px;background:rgba(13,27,46,.74);border:1px solid rgba(247,197,49,.45);border-radius:10px;padding:5px 7px;display:flex;flex-direction:column;gap:3px}#dpsw.hidden{display:none}#dpsw .dw-r{display:flex;align-items:center;gap:4px;color:#dfe8f5;font-size:10px;white-space:nowrap}#dpsw .dw-r b{color:#f7c531;font-size:10px}#dpsw .dw-r .dw-n{overflow:hidden;text-overflow:ellipsis;max-width:54px}'; document.head.appendChild(st); const w=document.createElement('div'); w.id='dpsw'; w.className='hidden'; w.innerHTML='<button class="dw-t">📊 DPS</button><div class="dw-b"></div>'; w.querySelector('.dw-t').addEventListener('pointerdown',function(e){ e.stopPropagation(); DPSW.open=!DPSW.open; dpswRender(); }); document.body.appendChild(w); }
function dpswRender(){ try{ const w=document.getElementById('dpsw'); if(!w||typeof S==='undefined'||!S||S.pre!==0||S.over){ if(w) w.classList.add('hidden'); return; } w.classList.remove('hidden'); const ks=Object.keys(DPSW.cnt).filter(function(k){ return DPSW.cnt[k]>0; }); let tot=0; ks.forEach(function(k){ tot+=DPSW.acc[k]||0; }); const dps=tot/Math.max(1,DPSW.time); var __al=0; if(typeof units!=='undefined'){ for(var __ui=0;__ui<units.length;__ui++){ if(!units[__ui].dead&&units[__ui].team==='blue') __al++; } }   /* v210 P7: 생존 브리핑 */
  w.querySelector('.dw-t').textContent=DPSW.open?('📊 DPS '+Math.round(dps)+' · 🛡 '+__al+' ▾'):'📊 DPS · 🛡 '+__al+' ▸'; const b=w.querySelector('.dw-b'); if(!DPSW.open){ b.style.display='none'; return; } b.style.display='flex'; b.innerHTML=ks.sort(function(a,c){ return (DPSW.acc[c]||0)-(DPSW.acc[a]||0); }).slice(0,5).map(function(k){ const c=CARDS[k]||{}; const d=Math.round((DPSW.acc[k]||0)/Math.max(1,DPSW.time)); return '<div class="dw-r"><b>'+d+'</b><span class="dw-n">'+(c.name||k)+'</span><span>×'+DPSW.cnt[k]+'</span></div>'; }).join('')||'<div class="dw-r"><span>배치 대기 중</span></div>'; }catch(e){} }


/* v149 캔버스 타일 하이라이트(§5-2): 카드 선택 중 배치 가능 타일 점선 회전+펄스 스케일 발광 — 배치 가이드·튜토리얼 겸용 */
const TILEHL={dash:0};
function tilehlDraw(ctx){ try{
  if(S.scene!=='battle'||S.over||S.pre!==0) return;
  if(P.sel==null) return;
  TILEHL.dash=(TILEHL.dash+0.35)%9;
  const ph=Math.sin(performance.now()/300);
  const pulse=(0.30+0.16*ph).toFixed(3);
  const inset=4.5+1.5*ph;
  ctx.save();
  ctx.strokeStyle='rgba(247,197,49,'+pulse+')';
  ctx.lineWidth=1.4; ctx.setLineDash([5,4]); ctx.lineDashOffset=-TILEHL.dash;
  ctx.beginPath();
  for(let r=RIVER_Y1+1;r<ROWS;r++) for(let c2=0;c2<COLS;c2++) ctx.rect(c2*TILE+inset, r*TILE+inset, TILE-inset*2, TILE-inset*2);
  ctx.stroke();
  ctx.restore();
}catch(e){} }


/* v150 히어로 패럴럭스(§4): 타이틀 배경 — 기기 기울기(deviceorientation·iOS 권한 게이트)와 포인터 이동을 융합해 히어로 아트를 스무딩 시프트, 전투 진입 시 리셋 */
const HEROPLX={x:0,y:0,tx:0,ty:0,_t:0,_perm:false};
function heroPlxTarget(){ try{ return document.querySelector('#screen-title .t-hero img')||document.querySelector('#screen-title .t-hero h1')||document.querySelector('#screen-title .t-hero'); }catch(e){ return null; } }
function heroPlxEnsure(){ if(document.getElementById('plxst')) return; const st=document.createElement('style'); st.id='plxst'; st.textContent='#screen-title .t-hero img,#screen-title .t-hero h1,#screen-title .t-hero{transition:transform .18s ease-out;will-change:transform}@keyframes raHeroFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}#screen-title .t-hero h1{animation:raHeroFloat 6s ease-in-out infinite}'; document.head.appendChild(st); }
function heroPlxApply(){ try{ const el=heroPlxTarget(); if(!el) return; el.style.transform='translate3d('+(HEROPLX.tx*16).toFixed(1)+'px,'+(HEROPLX.ty*11).toFixed(1)+'px,0) scale(1.045)'; }catch(e){} }
function heroPlxReset(){ try{ HEROPLX.x=HEROPLX.y=HEROPLX.tx=HEROPLX.ty=0; const el=heroPlxTarget(); if(el) el.style.transform=''; }catch(e){} }
function heroPlxListenOri(){ try{ window.addEventListener('deviceorientation',function(e){ try{ if(e.gamma==null&&e.beta==null) return; if(S.scene==='battle') return; HEROPLX.tx=Math.max(-1,Math.min(1,(e.gamma||0)/28)); HEROPLX.ty=Math.max(-1,Math.min(1,((e.beta||70)-70)/28)); heroPlxApply(); }catch(e2){} }); }catch(e){} }
function heroPlxRequestPerm(){ try{ if(HEROPLX._perm) return; HEROPLX._perm=true; heroPlxEnsure(); if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){ DeviceOrientationEvent.requestPermission().then(function(s){ if(s==='granted') heroPlxListenOri(); }).catch(function(){}); } else heroPlxListenOri(); }catch(e){} }
function heroPlxPointer(e){ try{ if(S.scene==='battle') return; HEROPLX.tx=Math.max(-1,Math.min(1,(e.clientX/window.innerWidth-0.5)*2)); HEROPLX.ty=Math.max(-1,Math.min(1,(e.clientY/window.innerHeight-0.5)*2)); heroPlxApply(); }catch(e){} }
window.addEventListener('pointerdown',heroPlxRequestPerm,true);
window.addEventListener('pointermove',heroPlxPointer,{passive:true});


/* v157 유닛 절차 모션 — 다리 스윙 / v158 팔 스윙·공격 뻗기 / v159 비행 날갯짓 (기존 보행 위상 step·moving 재사용 — 사인파 관절, 스프라이트 뒤 다리·앞 팔) */
/* v167 관절 아트화 — 생성형 그래픽과 동일한 카툰 스타일(외곽선+그라데이션+광택)·유닛별 무기 장착·자이언트 팔 내림 */
const LIMB_OUT='rgba(20,26,46,.94)';
function limbCapsule(hx,hy,fx,fy,c0,c1,lw){
  ctx.strokeStyle=LIMB_OUT; ctx.lineWidth=lw;
  ctx.beginPath(); ctx.moveTo(hx,hy); ctx.quadraticCurveTo((hx+fx)/2,(hy+fy)/2,fx,fy); ctx.stroke();
  const grd=ctx.createLinearGradient(hx,hy,fx,fy); grd.addColorStop(0,c0); grd.addColorStop(1,c1);
  ctx.strokeStyle=grd; ctx.lineWidth=lw*0.60;
  ctx.beginPath(); ctx.moveTo(hx,hy); ctx.quadraticCurveTo((hx+fx)/2,(hy+fy)/2,fx,fy); ctx.stroke();
}
function limbLegs(u,moving,shL){ try{
  if(u.c.flying||u.building) return;
  const mv=moving?1:0.12, ph=now*7.5+u.bob;
  const c0=u.team==='blue'?'#5c86e0':'#e07070', c1=u.team==='blue'?'#39509e':'#9e3c3c';
  const lw=Math.max(5,shL*0.13);
  const __pl=(typeof PARTS!=='undefined')?PARTS[u.key+'_leg']:null;
  const legOK=__pl&&__pl.complete&&__pl.naturalWidth>0&&__pl.__valid!==false;
  ctx.save(); ctx.lineCap='round';
  for(const side of [-1,1]){
    const sw=Math.sin(ph+(side>0?0:Math.PI))*mv;
    const hx=side*shL*0.13, hy=-shL*0.30;
    if(legOK){   /* v168: 생성형 다리 파트 — 힙 피벗 스윙(v167 궤적 등가각), 부츠 포함 */
      const ang=sw*0.55, ll=shL*(RIG_R(u.key).p2||0.5), iw=ll*(__pl.naturalWidth/__pl.naturalHeight);
      ctx.save(); ctx.translate(hx,hy); ctx.rotate(ang);
      ctx.drawImage(__pl,-iw/2,0,iw,ll); ctx.restore();
      continue;
    }
    const kx=hx+sw*shL*0.15, ky=hy+shL*0.26-Math.abs(sw)*shL*0.05;
    const fx=hx+sw*shL*0.30, fy=shL*0.16;
    limbCapsule(hx,hy,fx,fy,c0,c1,lw);
    ctx.fillStyle=u.team==='blue'?'#2c3f77':'#7d3030';
    ctx.beginPath(); ctx.ellipse(fx,fy+2,lw*0.44,lw*0.30,0,0,7); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.28)';
    ctx.beginPath(); ctx.ellipse(hx-side*1.5,hy+shL*0.05,lw*0.16,lw*0.10,0,0,7); ctx.fill();
  }
  ctx.restore();
}catch(e){} }
const WMAP={knight:'sword',prince:'sword',valk:'axe',skarmy:'dagger',archers:'bow',musketeer:'gun',sniper:'gun',wizard:'staff',cleric:'staff',icem:'staff',bomber:'bomb',giant:'',boar:'',minions:'',babyd:'',boss:'greatsword'};
function limbArm(u,moving,shL,sx,la){ try{
  if(u.c.flying||u.building||u.key==='boar') return;   /* v172b: 4족 멧돼지 — 캡슐 팔 억제(무기·팔 파트 없음) */
  const wtype=WMAP[u.key]||'';
  const mv=moving?1:0.2, ph=now*7.5+u.bob;
  const swingF=(u.swing>0)?Math.sin(Math.min(1,u.swing/(u._swd||0.4))*Math.PI):0;
  const hx=sx*shL*0.14, hy=-shL*0.42;
  const ex=hx+sx*(shL*0.10+Math.sin(ph)*mv*shL*0.13)+sx*swingF*shL*0.30;
  const ey=hy+shL*0.30-swingF*shL*0.12;
  const c0=u.team==='blue'?'#6f93e8':'#e88383', c1=u.team==='blue'?'#43589f':'#a04a4a';
  const lw=Math.max(4.5,shL*0.115);
  const __pa=(typeof PARTS!=='undefined')?PARTS[u.key+'_arm']:null;
  const armOK=__pa&&__pa.complete&&__pa.naturalWidth>0&&__pa.__valid!==false;
  if(armOK){   /* v168: 생성형 팔 파트 — 어깨 피벗, 손 좌표(ex,ey)는 v167 수학 그대로 */
    const aa=Math.atan2(ey-hy,ex-hx), al=Math.max(shL*0.2,Math.hypot(ex-hx,ey-hy));
    const iw=al*(__pa.naturalWidth/__pa.naturalHeight);
    ctx.save(); ctx.translate(hx,hy); ctx.rotate(aa-Math.PI/2);
    ctx.drawImage(__pa,-iw/2,0,iw,al); ctx.restore();
  } else {
    limbCapsule(hx,hy,ex,ey,c0,c1,lw);
    ctx.save();
    ctx.fillStyle=LIMB_OUT; ctx.beginPath(); ctx.arc(ex,ey,lw*0.40,0,7); ctx.fill();
    ctx.fillStyle='#f2c9a0'; ctx.beginPath(); ctx.arc(ex,ey,lw*0.30,0,7); ctx.fill();
    ctx.restore();
  }
  if(!wtype||(WEMBED[u.key]&&PARTS[u.key+'_arm']&&PARTS[u.key+'_arm'].__valid)) return;
  const rest=sx>0?0.55:-0.55;
  const aim=(u.target?la:u.dir);
  let dA=aim-rest; dA=Math.atan2(Math.sin(dA),Math.cos(dA));
  const ang=rest+dA*swingF;
  ctx.save(); ctx.translate(ex,ey); ctx.rotate(ang);
  const L=shL;
  const __wmap={sword:'w_sword',axe:'w_axe',dagger:'w_dagger',bow:'w_bow',gun:(u.key==='sniper'?'w_sniper':'w_musket'),staff:'w_staff',bomb:'w_bomb',greatsword:'w_greatsword'};
  const wk=__wmap[wtype];
  const __pw=(wk&&(typeof PARTS!=='undefined'))?PARTS[wk]:null;
  const wOK=__pw&&__pw.complete&&__pw.naturalWidth>0&&__pw.__valid!==false;
  if(wOK){   /* v168: 생성형 무기 파트 — 그립=손 좌표 */
    if(wk==='w_staff'){ const iw=L*0.54, ih=iw*(__pw.naturalHeight/__pw.naturalWidth);
      ctx.drawImage(__pw,-iw*0.22,-ih*0.92,iw,ih); }
    else if(wk==='w_bow'){ const ih=L*0.56, iw=ih*(__pw.naturalWidth/__pw.naturalHeight);
      ctx.drawImage(__pw,-iw*0.1,-ih/2,iw,ih); }
    else if(wk==='w_bomb'){ const ib=L*0.20;
      ctx.drawImage(__pw,-ib/2,-ib/2,ib,ib); }
    else { const bl=((wk==='w_dagger')?L*0.30:(wk==='w_axe')?L*0.38:(wk==='w_sword')?L*0.50:L*0.64);
      const iw=bl*1.12, ih=iw*(__pw.naturalHeight/__pw.naturalWidth);
      ctx.drawImage(__pw,-iw*0.10,-ih*0.50,iw,ih); }
  } else if(wtype==='sword'||wtype==='axe'||wtype==='dagger'){
    const bl=wtype==='dagger'?L*0.34:wtype==='axe'?L*0.44:L*0.58, bw=L*(wtype==='axe'?0.11:0.085);
    ctx.strokeStyle=LIMB_OUT; ctx.lineWidth=3.2;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(bl,0); ctx.stroke();
    const g2=ctx.createLinearGradient(0,-bw/2,0,bw/2); g2.addColorStop(0,'#f0f5fb'); g2.addColorStop(1,'#93a7c4');
    ctx.strokeStyle=g2; ctx.lineWidth=3.2*0.55; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(bl,0); ctx.stroke();
    ctx.fillStyle='#f7c531'; ctx.strokeStyle=LIMB_OUT; ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.ellipse(0,0,L*0.035,L*0.075,0,0,7); ctx.fill(); ctx.stroke();
    if(wtype==='axe'){ ctx.fillStyle='#cfd9e6'; ctx.beginPath(); ctx.moveTo(bl*0.82,-L*0.02); ctx.quadraticCurveTo(bl*1.02,-L*0.16,bl*1.06,-L*0.02); ctx.quadraticCurveTo(bl*1.02,L*0.10,bl*0.82,L*0.02); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  } else if(wtype==='gun'){
    const bl=L*(u.key==='sniper'?0.74:0.60);
    ctx.strokeStyle=LIMB_OUT; ctx.lineWidth=6.5; ctx.beginPath(); ctx.moveTo(-L*0.06,0); ctx.lineTo(bl,0); ctx.stroke();
    ctx.strokeStyle='#3a4666'; ctx.lineWidth=3.4; ctx.beginPath(); ctx.moveTo(-L*0.06,0); ctx.lineTo(bl,0); ctx.stroke();
    ctx.strokeStyle=LIMB_OUT; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(-L*0.08,0); ctx.lineTo(L*0.16,0); ctx.stroke();
    ctx.strokeStyle='#8a5a33'; ctx.lineWidth=3.2; ctx.beginPath(); ctx.moveTo(-L*0.08,0); ctx.lineTo(L*0.16,0); ctx.stroke();
    if(u.key==='sniper'){ ctx.fillStyle='#222c46'; ctx.beginPath(); ctx.arc(bl*0.42,-4,3.4,0,7); ctx.fill(); }
    if(u.swing>0){ ctx.fillStyle='#ffdf8a'; ctx.beginPath(); ctx.arc(bl+3,0,4.2,0,7); ctx.fill(); }
  } else if(wtype==='bow'){
    ctx.strokeStyle=LIMB_OUT; ctx.lineWidth=5; ctx.beginPath(); ctx.arc(0,0,L*0.34,-1.15,1.15); ctx.stroke();
    ctx.strokeStyle='#8a5a33'; ctx.lineWidth=2.8; ctx.beginPath(); ctx.arc(0,0,L*0.34,-1.15,1.15); ctx.stroke();
    ctx.strokeStyle='rgba(235,240,250,.9)'; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(Math.cos(-1.15)*L*0.34,Math.sin(-1.15)*L*0.34); ctx.lineTo(Math.cos(1.15)*L*0.34,Math.sin(1.15)*L*0.34); ctx.stroke();
    if(u.swing>0){ ctx.strokeStyle='#dfe6f0'; ctx.lineWidth=2.6; ctx.beginPath(); ctx.moveTo(-L*0.05,0); ctx.lineTo(L*0.5,0); ctx.stroke(); }
  } else if(wtype==='staff'){
    ctx.strokeStyle=LIMB_OUT; ctx.lineWidth=5.5; ctx.beginPath(); ctx.moveTo(-L*0.10,0); ctx.lineTo(L*0.56,0); ctx.stroke();
    ctx.strokeStyle='#7c5b3a'; ctx.lineWidth=3.2; ctx.beginPath(); ctx.moveTo(-L*0.10,0); ctx.lineTo(L*0.56,0); ctx.stroke();
    const oc=u.key==='wizard'?'#c77dff':u.key==='icem'?'#9fdcff':'#ffd75e';
    const gr=ctx.createRadialGradient(L*0.62,0,1,L*0.62,0,L*0.15); gr.addColorStop(0,oc); gr.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=gr; ctx.beginPath(); ctx.arc(L*0.62,0,L*0.15,0,7); ctx.fill();
    ctx.fillStyle=oc; ctx.strokeStyle=LIMB_OUT; ctx.lineWidth=2.4;
    ctx.beginPath(); ctx.arc(L*0.62,0,L*0.075,0,7); ctx.fill(); ctx.stroke();
  } else if(wtype==='bomb'){
    ctx.fillStyle=LIMB_OUT; ctx.beginPath(); ctx.arc(0,0,L*0.115,0,7); ctx.fill();
    const g3=ctx.createRadialGradient(-L*0.03,-L*0.03,1,0,0,L*0.115); g3.addColorStop(0,'#5a6a94'); g3.addColorStop(1,'#222c46');
    ctx.fillStyle=g3; ctx.beginPath(); ctx.arc(0,0,L*0.095,0,7); ctx.fill();
  }
  ctx.restore();
}catch(e){} }
function limbHead(u,sh,shL,hop){ try{   /* v173: 머리(얼굴) 파트 — 스프라이트 상단 p3 */
  const __ph=(typeof PARTS!=='undefined')?PARTS[u.key+'_head']:null;
  const hOK=__ph&&__ph.complete&&__ph.naturalWidth>0&&__ph.__valid!==false;
  if(!hOK) return;
  const ih=sh*(RIG_R(u.key).p3||0.36), iw=ih*(__ph.naturalWidth/__ph.naturalHeight);
  ctx.drawImage(__ph,-iw/2,-sh*0.82-hop,iw,ih);
}catch(e){} }
function limbWings(u,shL){ try{
  if(!u.c.flying) return;
  const fl=Math.sin(now*13+u.bob);
  const __pw=(typeof PARTS!=='undefined')?PARTS[u.key==='babyd'?'wing_babyd':'wing_minion']:null;
  const wOK=__pw&&__pw.complete&&__pw.naturalWidth>0&&__pw.__valid!==false;
  ctx.save();
  if(!wOK){ ctx.strokeStyle='rgba(255,255,255,.75)'; ctx.lineWidth=Math.max(2,shL*0.06); ctx.lineCap='round';
    for(const side of [-1,1]) ctx.beginPath(), ctx.ellipse(side*shL*0.30,-shL*0.55,shL*0.22,shL*0.10,fl*0.5*side,0,7), ctx.stroke();
  } else {   /* v168: 생성형 날개 파트 — 날갯짓 위상 유지 */
    for(const side of [-1,1]){ const ww=shL*0.48, wh=ww*(__pw.naturalHeight/__pw.naturalWidth);
      ctx.save(); ctx.translate(side*shL*0.30,-shL*0.55); ctx.rotate(fl*0.5*side); if(side<0) ctx.scale(-1,1);
      ctx.drawImage(__pw,-ww*0.12,-wh/2,ww,wh); ctx.restore(); }
  }
  ctx.restore();
}catch(e){} }

function startMatch(){ try{ localStorage.setItem('ra_slot_used_v1',String(activeSlot())); }catch(e){}   /* v298: 사용 슬롯 기록 */
  S.boss=null; S.bossSpawned=false; S.ks=false; S.ksCd=0; S.__bossWave=0; S.doom=0;   /* v491: 스테이지 시작 시 보스 상태 완전 리셋 — 잔여 90초 폴백이 이전 경기 상태 이어받아 갑자기 강림하지 않도록 */
  try{ if(false&&typeof localStorage!=='undefined'&&localStorage.getItem('ra_tut_done')!=='1'&&!localStorage.getItem('ra_hist_v1')) tutBegin();   /* v176: 튜토리얼 모드 일단 제외 — 재활성 시 if(false&&) 제거 */ }catch(e){}   /* v147: 첫 실행(기록 없음)만 활성 */
  units=[];projs=[];fx=[];floats=[];parts=[];ambient=[];
  S.over=false;S.shown=false;S.winner=null;S.t=300;S.overtime=false;S.double=false;   /* v142: 경기 시간 5분 */
  try{ DPSW.acc={}; DPSW.cnt={}; DPSW.time=0; DPSW._c=0; dpswEnsure(); }catch(e){}  try{ heroPlxReset(); }catch(e){}   /* v150: 전투 진입 시 패럴럭스 리셋 */try{ __rollWide(); }catch(__e){}   /* v390 */
  S.crowns={blue:0,red:0};   /* v148: 위젯 리셋 */ S.kills={blue:0,red:0}; S.deaths={blue:0,red:0}; S.spells={blue:0,red:0}; S.shake=0; S.clash=null; S.cam={x:W/2,y:H/2,z:1}; S._home={x:W/2,y:H/2,z:1}; S.focus=null; S.slow=0; S.spellQuiet=0; S._sk={}; S.__rin=(function(){try{var r=localStorage.getItem('ra_relic_inrun_v1'); if(r) localStorage.removeItem('ra_relic_inrun_v1'); return r;}catch(e){return null;}})(); S.__rinRoll=(S.__rin==='relic_gamble')?(Math.random()<0.5?1.25:0.85):1; S.__rinMul=1+0.05*__raClearLv();   /* v212 소비 + v218: 토벌 단계 렐릭 증폭 */ try{ relayoutHud(); }catch(e){}   // v122: 경기 시작 기둥 배치   // v115: 초기 화면 상태 기억 — 강제 복귀 기준점 + v118: 주문 진정 기간 리셋   // v111: 구 추적 객체 2종 폐지(단일 S.focus만) S.boss=null; S.bossSpawned=false; S.ks=false; S.ksCd=0; S.focusGap=0; S.zHold=0; S._tp=0; S.repCd=0; S.__used={}; try{ syncGradeVisual(); }catch(e){} try{ S.relic=(function(){try{return localStorage.getItem('ra_relic_v1')||''}catch(e){return ''}})(); applyRelics(); applySkills(); }catch(e){}   // v119: 스킬트리 반영
  P.elixir=5;A.elixir=5;A.timer=5;A._opened=0;P.sel=null;P._full=false;   /* v403: 적 첫 스폰 5초 보장(A._opened) — 엘릭서 게이트 대기(체감 최악 ~20s) 제거 */
  try{ var __sb2=document.getElementById('screen-battle'); if(__sb2) __sb2.classList.remove('ended'); }catch(e){}
  initDeck(P);initDeck(A,true);   /* v192: 적 덱 = 아군과 무관 랜덤 */
  try{ window.__qaDecks={blue:P.hand.join(','),red:A.hand.join(',')}; }catch(e){ }
  buildTowers(); drawStatic();
  buildHandUI();
  show('battle');
  try{ __raHudInline(); setTimeout(__raHudInline,400); setTimeout(__raHudInline,1200); }catch(e){ }   /* v202: HUD 인라인 */
  bgmStart();
  S.pre=3.6;
  try{ if(typeof localStorage!=='undefined'&&!localStorage.getItem('ra_hint_done')&&!localStorage.getItem('ra_hist_v1')){ banner('🎴 아래 카드를 탭해 선택',2000); setTimeout(function(){ banner('🗺️ 원하는 위치를 탭해 배치!',2200); },2400); setTimeout(function(){ banner('💧 엘릭서가 차오르면 다음 카드!',2000); },5000); localStorage.setItem('ra_hint_done','1'); } }catch(e){ }   /* v195 P1 간이 온보딩 */
  if(window.__auto){
    spawnCard('knight','blue',6,20); spawnCard('archers','blue',9.5,21);
    spawnCard('wizard','blue',12,20.5); spawnCard('prince','red',6,11);
    spawnCard('musketeer','red',9,10.5); spawnCard('minions','red',12.5,10);
    P.elixir=7;A.elixir=7;
  }
}
function buildCodex(){
  const box=$('#codex');
  for(const k of DECK){ const c=CARDS[k];
    const d=document.createElement('div'); d.className='cx';
    d.innerHTML=`<div class="e${(function(){try{var __l=(typeof __cardLv==='function'?__cardLv(k):(__CARD_LV&&__CARD_LV[k])||0);return __l>=9?' g3':__l>=6?' g2':__l>=3?' g1':''}catch(_){return ''}})()}"${ART[k]?`<img class="art" src="${ART[k]}" alt="">`:c.emoji}</div><div class="n">${c.name}</div><div class="s">${c.desc}</div><div class="c">💧${c.cost}</div>`;
    box.appendChild(d); }
}
$('#btn-start').addEventListener('click',()=>{ ensureAudio(); startMatch(); });
$('#btn-again').addEventListener('click',()=>{ $('#overlay-result').classList.add('hidden'); startMatch(); });
document.addEventListener('pointerdown',function(ev){ try{ if(S.scene!=='battle') return; const cc=S.cam; if(!cc||!(cc.z>1.05)) return; if(S.focus||S.zHold>0){ S.zHold=0; S.focus=null; if(!(S.focusGap>0.4)) S.focusGap=0.8; S._hiAge=0; S._zSpot=null; } }catch(e){} },true);   /* v178: 줌 상태 클릭·터치 즉시 해제(원본 동작은 유지) */
window.__uiUp=function(){ try{   /* v178: 메인·게임 내 UI 업그레이드 — 텍스트 타깃·멱등 */
  if(document.getElementById('ui-v178')) return;
  var st=document.createElement('style'); st.id='ui-v178';
  st.textContent='body{font-variant-numeric:tabular-nums}'
   +'.ui-cta{height:58px!important;font-size:21px!important;letter-spacing:.02em;box-shadow:0 6px 22px rgba(247,197,49,.35)!important}'
   +'.ui-nav{height:46px!important;font-size:14px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:5px!important}'
   +'.ui-how{height:42px!important;font-size:13px!important}'
   +'.ui-skill:not([disabled]){box-shadow:0 0 0 3px rgba(247,197,49,.45),0 0 14px rgba(247,197,49,.30)!important;animation:uiPulse 1.6s ease-in-out infinite}'
   +'@keyframes uiPulse{50%{box-shadow:0 0 0 5px rgba(247,197,49,.22),0 0 8px rgba(247,197,49,.18)!important}}'
   +'.card b,.card .nm{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
   +'.timerchip,.mutechip{backdrop-filter:blur(6px);background:rgba(10,20,38,.55)!important}';
  document.head.appendChild(st);
  var n=0; var __hits=[]; document.querySelectorAll('button,[class*=btn],[class*=nav],[class*=pill],[class*=skill],[class*=card],[class*=menu],[class*=link],[id^="btn-"],[onclick]').forEach(function(b){ var t=(b.textContent||'').trim(); var c=null;
    if(/배틀 시작/.test(t)){ c='ui-cta'; }
    else if(/훈련 캠프|덱 편성|유물|명예의 전당|프로필|전술 연구소/.test(t)){ c='ui-nav'; }
    else if(/게임 방법/.test(t)){ c='ui-how'; }
    else if(/킹샷|수리/.test(t)){ c='ui-skill'; }
    if(c) __hits.push([b,c]);
  });
  __hits.forEach(function(h){ var __inner=__hits.some(function(h2){ return h2[0]!==h[0]&&h[0].contains(h2[0]); }); if(!__inner){ h[0].classList.add(h[1]); if(h[1]==='ui-nav'){ n++; var __t=(h[0].textContent||''); var __map=[['훈련 캠프','nav-camp'],['덱 편성','nav-deck'],['유물','nav-relic'],['명예의 전당','nav-hof'],['프로필','nav-profile'],['전술 연구소','nav-skill']],__i;for(__i=0;__i<__map.length;__i++){if(__t.indexOf(__map[__i][0])>=0){h[0].classList.add(__map[__i][1]);break;}} } } });
  ['ks-btn','repair-btn'].forEach(function(id){ var b=document.getElementById(id); if(b){ b.classList.add('ui-skill'); } });

}catch(e){} };
(function(){ try{ if(!document.getElementById('ui-v179')){ var s2=document.createElement('style'); s2.id='ui-v179'; s2.textContent='#overlay-result #btn-again{display:inline-block!important;width:57%!important;vertical-align:top!important;box-sizing:border-box!important}#overlay-result #btn-home{display:inline-block!important;width:40%!important;margin-left:2%!important;vertical-align:top!important;box-sizing:border-box!important}'; document.head.appendChild(s2); } }catch(e){} })();
(function(){ try{ var stHof=document.getElementById('ui-v182'); if(!stHof){ stHof=document.createElement('style'); stHof.id='ui-v182'; stHof.textContent='#overlay-hof{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column}#overlay-hof.hidden{display:none!important}#overlay-hof .hof-card{display:flex;flex-direction:column;position:relative;height:auto;min-height:340px;max-height:86vh;transform:none!important;animation:none!important}#overlay-hof .hof-card>*{flex:none;position:static!important;height:auto!important;transform:none!important;animation:none!important}#overlay-hof .hof-rows{min-height:0;overflow-y:auto}'; document.head.appendChild(stHof); } }catch(e){} })();
window.__uiUp(); window.addEventListener('load',function(){ try{ window.__uiUp(); }catch(e){} }); setInterval(function(){ try{ window.__uiUp(); }catch(e){} },1000);
$('#btn-home').addEventListener('click',()=>show('title'));
$('#btn-sound').addEventListener('click',()=>{ S.muted=!S.muted; try{ localStorage.setItem('ra_muted',S.muted?'1':'0'); }catch(e){}; $('#btn-sound').textContent=S.muted?'🔇':'🔊'; if(!S.muted){ try{ sfx('deploy'); }catch(e){} } });
$('#btn-info').addEventListener('click',()=>$('#overlay-info').classList.remove('hidden'));
$('#btn-info-close').addEventListener('click',()=>$('#overlay-info').classList.add('hidden'));
(function(){
  const sp=$('#splash'), img=sp?sp.querySelector('img'):null;
  const re=/const ART=\{[\s\S]*?"\};/.exec(document.body.innerHTML)||[''];
  fetch('icon-512.png').then(r=>r.blob()).then(()=>{}).catch(()=>{});
  if(img)img.src=''; /* splash removed */
  window.__SP_ICON='';
})();
(function(){
  setTimeout(()=>{ const _s=$('#splash'); if(_s){ _s.classList.add('hide'); setTimeout(()=>_s.remove(),700); } },1500);
})();
const eb=$('#emote-bubble');
function showEmote(e,team){ return;   // v124: 이모티콘 표시 무효화 — 버튼 제거(사용자 지정)
  eb.textContent=e;
  eb.style.bottom=team==='blue'?'34%':'50%';
  eb.classList.remove('show'); void eb.offsetWidth; eb.classList.add('show');
  clearTimeout(eb._t); eb._t=setTimeout(()=>eb.classList.remove('show'),1300);
}
document.querySelectorAll('.emote-btn').forEach(b=>b.addEventListener('click',()=>{ ensureAudio(); showEmote(b.dataset.e,'blue'); }));
$('#btn-quit').addEventListener('click' ,()=>{ if(!S.over){ banner('기권 — 패배'); finish('red'); } });

/* ---------- v74: P9 보스 레이드 — 부활한 왕 ---------- */
const BOSS_STATS={name:'부활한 왕',cost:0,hp:3200,dmg:200,hs:2.0,range:1.3,spd:0.62,flying:false,hitsAir:true,targets:'any',r:1.05};
function ensureKsBtn(){
  let btn=document.getElementById('ks-btn'); if(btn) return;
  btn=document.createElement('button'); btn.id='ks-btn'; btn.className='';   // v124: 상시 버튼 — dim으로 활성/비활성 표현(나타났다 사라지지 않음)
  btn.textContent='🎯 킹샷';
  btn.style.cssText='position:absolute;left:calc(var(--fx,0px) + 16px) !important;bottom:16px !important;   /* v124e: body 후순위 시트의 !important(left:10px)를 인라인으로 제침 */z-index:56;font-family:var(--fd,\'Pretendard Variable\',\'Noto Sans KR\',sans-serif);font-size:15px;font-weight:800;padding:0 16px;height:44px;background:#4a2d7d;border:2px solid #c77dff;border-radius:14px;color:#fff;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.5)';
  btn.onclick=function(){ ensureAudio(); if(S.boss&&!S.boss.dead&&S.ksCd<=0){ S.ks=!S.ks; toast(S.ks?'조준할 위치를 탭하세요':'조준 취소'); syncHUD(); } };
  var __aw=document.getElementById('arena-wrap'); if(__aw) __aw.appendChild(btn); else if(sc) sc.appendChild(btn);
}
function fireKingShot(p){
  S.ks=false; S.ksCd=8; syncHUD();
  const kt=towers.find(t=>t.team==='blue'&&t.kind==='king'&&!t.dead)||{x:9,y:29};
  projs.push({kind:'kingshot',team:'blue',x:kt.x,y:kt.y-0.8,tx:clamp(p.x,0.7,COLS-0.7),ty:clamp(p.y,0.7,ROWS-0.7),spd:7,dmg:250,t:0,dur:0.4});
  sfx('cast'); toast('🎯 킹샷 발사');
}
function drawBossHUD(){
  const b=S.boss; if(!b||b.dead) return;
  ctx.save(); ctx.setTransform(BSCALE,0,0,BSCALE,0,0);
  const bw=Math.min(380,VW-60), x=(VW-bw)/2, y=10, h=30;
  ctx.fillStyle='rgba(8,12,24,.88)'; ctx.strokeStyle='#f7c531'; ctx.lineWidth=2;
  ctx.fillRect(x,y,bw,h); ctx.strokeRect(x,y,bw,h);
  const hf=Math.max(0,b.hp/b.maxHp);
  ctx.fillStyle='#8b1d2c'; ctx.fillRect(x+4,y+4,bw-8,11);
  ctx.fillStyle='#e0455a'; ctx.fillRect(x+4,y+4,(bw-8)*hf,11);
  if((b.shield||0)>0){ ctx.fillStyle='rgba(226,236,255,.9)'; ctx.fillRect(x+4,y+4,(bw-8)*hf*Math.min(1,b.shield/900),4); }
  ctx.fillStyle='#7a3d10'; ctx.fillRect(x+4,y+19,bw-8,6);
  ctx.fillStyle='#ffa02e'; ctx.fillRect(x+4,y+19,(bw-8)*Math.min(1,b.doom/12),6);
  ctx.font="'Pretendard Variable','Noto Sans KR',sans-serif"; ctx.textAlign='left'; ctx.textBaseline='middle';
  ctx.fillStyle='#ffe08a'; ctx.fillText('💀 부활한 왕',x+8,y+9);
  ctx.textAlign='right'; ctx.fillStyle='#fff'; ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(Math.ceil(b.hp)+' / '+b.maxHp,x+bw-8,y+9);ctx.fillText(Math.ceil(b.hp)+' / '+b.maxHp,x+bw-8,y+9);
  ctx.textAlign='left'; ctx.fillStyle='#ffd7a8'; ctx.fillText('파멸기 '+Math.min(12,b.doom).toFixed(1)+'s',x+8,y+25);
  ctx.restore();
}

/* ---------- v80: P6 명예의 전당 ---------- */
function __raProfName(){ try{
  var ks=['ra_prof_name','ra_profile_name','ra_pf_name'];   /* v418b: 중첩 배열 버그 수복 — getItem(배열)이 실패해 항상 폴백 '지휘관'이던 것 */
  for(var i=0;i<ks.length;i++){ var v=localStorage.getItem(ks[i]); if(v) return v; }
  try{ var __pd=JSON.parse(localStorage.getItem('ra_profiles_v1')||'null'); if(__pd&&__pd.active) return __pd.active; }catch(__pe){}   /* v427 */
  var pk='ra_prof_v1'; if(pk){ var o=JSON.parse(localStorage.getItem(pk)||'null');
    if(Array.isArray(o)){ var act=o.filter(function(x){return x&&x.active;})[0]||o[o.length-1]; if(act&&(act.name||act.nick)) return act.name||act.nick; }
    else if(o&&typeof o==='object'){ for(var k2 in o){ if(o[k2]&&o[k2].name) return o[k2].name; } } }
}catch(e){} return '지휘관'; }
const HOF_KEY='ra_hof_v1';
function hofLoad(){ try{ const a=JSON.parse(localStorage.getItem(HOF_KEY)||'[]'); if(!Array.isArray(a)) return []; return a.filter(function(e){ return e&&typeof e.s==='number'&&isFinite(e.s); }).slice(0,5); }catch(e){ return []; } }
function hofSave(a){ try{ localStorage.setItem(HOF_KEY,JSON.stringify(a)); }catch(e){} }
function hofRecord(sc){ try{ if(typeof sc!=='number'||!isFinite(sc)||sc<=0) return; const a=hofLoad(); a.push({ n:__raProfName(), s:Math.round(sc), w:(S.winner==='blue')?1:0, d:new Date().toLocaleDateString('ko-KR'), t:Date.now() }); a.sort(function(x,y){ return y.s-x.s||x.t-y.t; }); hofSave(a.slice(0,5)); }catch(e){} }
function fmtScore(n){ n=Math.round(n); return n.toLocaleString('ko-KR'); }   /* v345: 점수 표기 통일(1.4k→1,400) — 포디엄·행 일관 */
function renderHof(){ try{
  const a=hofLoad(), pod=document.getElementById('hof-pod'), rows=document.getElementById('hof-rows');
  if(!pod||!rows) return;
  const cell=function(ri){ const e=a[ri]; const rc=['','r1','r2','r3'][ri+1];
    if(!e) return '<div class="pod p'+(ri+1)+'"><div class="pod-rank '+rc+'">'+(ri+1)+'위</div><div class="pod-score">—</div><div class="pod-date">기록 없음</div></div>';
    return '<div class="pod p'+(ri+1)+'"><div class="pod-rank '+rc+'">'+(ri+1)+'위</div><div class="pod-name">'+(e.n||__raProfName())+'</div><div class="pod-score">'+fmtScore(e.s)+'</div><div class="pod-date">'+e.d+(e.w?' 🏆':'')+'</div></div>'; };
  pod.innerHTML=cell(1)+cell(0)+cell(2);
  rows.innerHTML=a.slice(3).map(function(e,i){ return '<div class="hof-row"><span class="hr-rank">'+(i+4)+'위</span><span class="hr-name">'+(e.n||__raProfName())+'</span><span class="hr-score">'+fmtScore(e.s)+'</span><span class="hr-date">'+e.d+(e.w?' 🏆':'')+'</span></div>'; }).join('')||(a.length?'':'<div class="hof-empty">아직 기록이 없습니다 — 전투에서 최고 스코어를 남겨 보세요!</div>');
}catch(e){} }
(function hofInit(){ let n=0;
  const place=function(par,ref){ try{ const b=document.createElement('button'); b.id='btn-hof'; b.textContent='🏆 명예의 전당';
    b.onclick=function(){ renderHof(); const o=document.getElementById('overlay-hof'); if(o) o.classList.remove('hidden'); };
    par.insertBefore(b,ref); }catch(e){} };
  const tick=function(){ try{ const db=document.getElementById('btn-deck');
    if(db&&db.parentNode){ place(db.parentNode,db.nextSibling); return; }
    const host=document.querySelector('.t-hero'); if(host){ place(host,null); return; } }catch(e){}
    if(++n<40) setTimeout(tick,50); };
  setTimeout(tick,50);
  try{ const xh=document.getElementById('btn-hof-close');
    if(xh) xh.onclick=function(){ const o=document.getElementById('overlay-hof'); if(o) o.classList.add('hidden'); };
    const oh=document.getElementById('overlay-hof');
    if(oh) oh.addEventListener('click',function(ev){ if(ev.target===oh) oh.classList.add('hidden'); }); }catch(e){}
})();

/* ---------- 메인 루프 ---------- */
let last=performance.now();
/* v130: 줌인 2.5배 */
function raFocus(x,y,dur,v,force){   // v111: 카메라 포커스 단일 생성자 — x·y·t·dur·a·v 상시 보유(무좌표 포커스 원천 차단)
  if(!force&&(S.focusGap>0||S.focus)) return;
  S.focus={x:x||0,y:y||0,t:dur,dur:dur,a:0,v:(v&&!v.dead)?v:null};
}
function forceHomeCam(){   // v115: 초기 화면 상태 강제 복귀 — ⟲ 버튼·감시견 공용(즉시 스냅)
  S.focus=null; S.focusGap=0.8; S._hiAge=0;
  var hm=S._home||{x:W/2,y:H/2,z:1};
  if(S.cam){ S.cam.x=hm.x; S.cam.y=hm.y; S.cam.z=hm.z; }
}
function updateCam(dt){
  const c=S.cam||(S.cam={x:W/2,y:H/2,z:1});
  S._now=(S._now||0)+dt;
  if(S.focus){ const f=S.focus; f.t-=dt; f.a=(f.a||0)+dt;
    if(f.v){ if(f.v.dead){ f.v=null; } else { f.x=f.v.x*TILE; f.y=f.v.y*TILE; } }
    const __clash=!!(f.v&&!f.v.dead&&f.v.target); if(__clash) f.t=Math.max(f.t,0.35);   /* v175 P2: 교전 지속 중 만료 억제 — f.t 갱신(연령캡 유예, 감시견 3.5s 캡 유지) */
    if(f.t<=0||(!__clash&&f.a>(((f.dur)||1.6)+1.2))){ if(!(S.zHold>0)) S.zHold=1.0; S.zHold-=dt; if(S.zHold>0){ f.t=Math.max(f.t,0.0001); } else { S.zHold=0; S.focus=null; S.focusGap=2.2; } } }   // v111: 신 포커스 감시 — 단일 상태·전 필드 상시 보유·연령 하드캡(dur+1.2s) + v169: 복귀 전 줌 화면 1초 유지
  if(S.focusGap>0) S.focusGap-=dt; if(S._zSpot&&S._now>S._zSpot.exp) S._zSpot=null;   /* v175 */   // v91: 쿨다운 동안 1배 유지
  if(S.spellQuiet>0) S.spellQuiet-=dt;   // v118: 주문 진정 기간 감소
  if(c.z>1.05){ S._hiAge=(S._hiAge||0)+dt; if(S._hiAge>3.5){ S.focus=null; S.focusGap=1.0; S._hiAge=0; S._zSpot={x:c.x,y:c.y,exp:S._now+6}; }   /* v175: 해제 지점 기억 — 동일 교전 재점화 6s 억제(캡 3.5s 유지) */ } else S._hiAge=0;   // v112: 고정 감시견 — 5s 초과 줌인 지속 강제 해제
  const tgt=S.focus? {x:S.focus.x, y:S.focus.y, z:2.5} : {x:W/2,y:H/2,z:1};
  const k=1-Math.exp(-5.0*dt), kz=1-Math.exp(-3.2*dt);
  c.x=lerp(c.x,tgt.x,k); c.y=lerp(c.y,tgt.y,k); c.z=lerp(c.z,tgt.z,kz);
  const vw=VW/c.z, vh=VH/c.z;
  c.x=(vw>=W)?W/2:clamp(c.x,vw/2,W-vw/2); c.y=(vh>=H)?H/2:clamp(c.y,vh/2,H-vh/2);   // 아레나 밖 노출 방지
  var zc=document.getElementById('zoom-chip');
  if(!zc){ zc=document.createElement('div'); zc.id='zoom-chip';
    zc.style.cssText="z-index:61;font-family:var(--fd,'Pretendard Variable','Noto Sans KR',sans-serif);font-size:14px;font-weight:700;letter-spacing:-.3px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.8);pointer-events:none;white-space:nowrap";
    var __tb=document.getElementById('topbar'); if(__tb){ __tb.insertBefore(zc, document.getElementById('btn-sound')); } else { var __sc=document.getElementById('arena-wrap'); if(__sc) __sc.appendChild(zc); } } try{ relayoutHud(); }catch(e){}   // v122: 칩 생성 직후 기둥 배치 반영
  var hb=document.getElementById('cam-home-btn');
  if(!hb){ hb=document.createElement('button'); hb.id='cam-home-btn'; hb.textContent='\u27F2'; hb.title='\uc908 \ud574\uc81c\u00b7\ud654\uba74 \uc6d0\uc0c1\ud0dc \ubcf5\uadc0';
    hb.style.cssText="z-index:61;font-family:var(--fd,'Pretendard Variable','Noto Sans KR',sans-serif);font-size:15px;font-weight:800;line-height:1;color:#FFD54F;background:rgba(18,24,43,.88);border:1px solid rgba(255,213,79,.55);border-radius:9px;padding:5px 9px;cursor:pointer;pointer-events:auto";
    hb.addEventListener('click',function(){ ensureAudio(); forceHomeCam(); });
    var __tb2=document.getElementById('topbar'); if(__tb2){ __tb2.insertBefore(hb, document.getElementById('btn-sound')); } else { var __aw2=document.getElementById('arena-wrap'); if(__aw2) __aw2.appendChild(hb); } }
  hb.classList.toggle('hidden',!(c.z>1.05));   // v115: \uc908\uc778 \uc911\uc5d0\ub9cc \uc6d0\uc0c1\ubcf5\uadc0 \ubc84\ud2bc \ub178\ucd9c
  if(zc.__v==null||Math.abs(zc.__v-c.z)>0.009){ zc.__v=c.z; zc.textContent='🔍 '+c.z.toFixed(2)+'x'+(S.focus?(S.focus.v?' · 추적':' · 주시'):''); }
}
function loop(t){
  let dt=Math.min(0.05,(t-last)/1000); last=t; now=t/1000;
  const real=dt;
  if(S.slow>0){ S.slow-=real; dt=real*0.42; }   // 하이라이트 슬로모션
  try{ update(dt); }catch(e){}
  try{ updateCam(real); }catch(e){}   // v112: 카메라 예외 격리 — 루프 사망·프레임 영구 동결 차단
  try{ render(); }catch(e){}
  try{ ctx.setTransform(BSCALE,0,0,BSCALE,0,0); }catch(e){}   // v117: 프레임 말미 절대 변환 고정 — 렌더 예외로 save/restore 불균형이 남아도 누적되지 않음
  try{ syncHUD(); }catch(e){}   // v112: HUD 예외 격리

  requestAnimationFrame(loop);
}
buildCodex();   /* v194: 스탯·레벨 변경 시 도감 강제 동기화 */
function __syncCodex(){ try{ var sig=JSON.stringify(CARDS); for(const k of DECK) sig+='|'+k+':'+(window.__CARD_LV&&__CARD_LV[k]||0); if(window.__cxSig===sig) return; window.__cxSig=sig; var box=document.getElementById('codex'); if(box){ box.innerHTML=''; buildCodex(); } }catch(e){ } }
window.__syncCodex=__syncCodex; window.__qaCodex=function(){ try{ return DECK.length+':'+document.querySelectorAll('#codex .cx').length; }catch(e){ return 'n/a'; } };
$('#elixir-ticks').innerHTML='<i></i>'.repeat(9);
try{ var __st0=localStorage.getItem('ra_theme_v1'); if(__st0){   /* v488: 부팅 시 선택 테마 복원 — .sel 칩만 복원하던 결함(S.theme은 classic으로 시작 → 간헐적 클래식 바닥) */
    var __map={sky:'ice',tomb:'abyss',dusk:'lava',divine:'classic'}, __th=__map[__st0]||__st0;
    if(typeof THEMES!=='undefined'&&THEMES[__th]) S.theme=__th;
    document.querySelectorAll('.t-btn[data-theme]').forEach(function(x){ x.classList.toggle('sel',x.dataset.theme===__st0); });
  } }catch(e){}
document.querySelectorAll('.t-btn[data-theme]').forEach(b=>b.addEventListener('click',()=>{
  S.theme=b.dataset.theme; try{ drawStatic(); }catch(__te){ try{ var __old=S.theme; S.theme={sky:'ice',tomb:'abyss',dusk:'lava',divine:'classic'}[b.dataset.theme]||'classic'; drawStatic(); S.theme=__old; }catch(__te2){} }   /* v434d: 신규 테마 무케이스(THEMES.g1 조회 실패 실측) — 자매 팔레트로 재페인트 폴백, S.theme 원복(보너스 체인은 신규 키 유지) */
  document.querySelectorAll('.t-btn[data-theme]').forEach(x=>x.classList.toggle('sel',x===b)); try{ localStorage.setItem('ra_theme_v1',S.theme); }catch(e){}   /* v222 */
}));
window.__auto=new URLSearchParams(location.search).has('auto');
if(window.__auto) startMatch();
try{ var __rq=new URLSearchParams(location.search); var __rw=__rq.get('result');
  if(__rw){ S.winner=__rw; S.over=true; if(__rw==='blue'){ S.crowns={blue:2,red:1}; S.kills={blue:14,red:9}; S.deaths={blue:6,red:10}; S.spells={blue:4,red:3}; } S.t=95; showResult(); } }catch(e){}
requestAnimationFrame(loop);


/* v192: 덱 편성 화면 — 🎲 랜덤 선택(18종 풀 → 랜덤 8장 저장·재렌더) */
function __raSaveDeck(q){ localStorage.setItem(DECK_SLOTS[activeSlot()], JSON.stringify(q)); }
function __raAddRandomBtn(){
  var de=document.getElementById('deck-edit'); if(!de||document.getElementById('btn-deck-random')) return;
  var btn=document.createElement('button'); btn.id='btn-deck-random'; btn.textContent='🎲 랜덤';
  btn.style.cssText='flex:0 0 auto!important;height:42px!important;min-height:42px!important;max-height:42px!important;border-radius:12px;font-weight:800;background:linear-gradient(180deg,#2f6d4f,#1c4231);color:#d9fbe8;border:1.5px solid #63d69a';   /* v199b: 인라인 강제 — 시트 규칙 무시 환경 차단 */
  btn.onclick=function(){
    var q=shuffle([...DECK]).slice(0,10);   /* v414: 랜덤 버튼 10장 */
    try{ __raSaveDeck(q); }catch(e){ }
    var cur=document.getElementById('deck-edit'); if(cur) cur.remove();
    openDeckEditor();
    try{ toast('덱을 랜덤으로 구성했어요'); }catch(e){ }
  };
  var saveB=null; [].slice.call(de.querySelectorAll('button')).forEach(function(b){ if(/저장/.test(b.textContent||'')) saveB=b; });
  if(saveB&&saveB.parentNode){ var row=saveB.parentNode, closeB=de.querySelector('#dk-close');
    if(closeB&&closeB.parentNode!==row) row.appendChild(closeB);
    try{ row.style.display='grid'; row.style.gridTemplateColumns='repeat(3,1fr)'; row.style.gap='10px'; row.style.width='100%'; row.style.margin='14px 0 4px'; }catch(e){}
    saveB.parentNode.insertBefore(btn,saveB.nextSibling);
    [saveB,btn,closeB].forEach(function(b){ if(!b) return; b.style.height='42px'; b.style.minHeight='42px'; b.style.maxHeight='42px'; b.style.borderRadius='12px'; b.style.width='100%'; b.style.minWidth='0'; b.style.fontSize='13.5px'; });
  } else de.appendChild(btn);   /* v198: 랜덤 버튼 독립 행 — 저장행 3열 랩 비대칭 해소 */
}
(function(){ var orig=openDeckEditor;
  openDeckEditor=function(){ var r=orig.apply(this,arguments); try{ setTimeout(__raAddRandomBtn,40); }catch(e){ } return r; };
  setInterval(function(){ try{ __raAddRandomBtn(); }catch(e){ } },300);   /* v193: 재시도 보장 */
})();
