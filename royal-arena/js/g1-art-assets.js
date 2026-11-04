/* royal-arena v188 split — blocks [0,1,2,3,4,5,6,7,8,9,10,11] order-preserved */
'use strict';
const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
let uid=1, now=0;

/* ---------- 아레나 상수 (REA 설계도 §1) ---------- */
const COLS=18, ROWS=32, TILE=34, W=COLS*TILE, H=ROWS*TILE;   // 612×1088
const RIVER_Y0=15, RIVER_Y1=17, RIVER_MID=16;                 // 강: 15~17행
const BRIDGES=[3.5,14.5];                                     // 다리 x중심(타일)
const BLUE_DEPLOY_MIN=16.8, RED_DEPLOY_MAX=15.2;

/* ---------- 카드 데이터 (REA 설계도 §5) ---------- */
const CARDS={
  knight:   {name:'기사',     emoji:'🛡️', cost:3, count:1, hp:1240,  dmg:80,  hs:1.1, range:0.9, spd:1.2, flying:false, hitsAir:false, targets:'any',       r:0.45, desc:'밸런스 근접 전사'},
  archers:  {name:'궁수',     emoji:'🏹', cost:3, count:2, hp:260,  dmg:45,  hs:1.2, range:5.0, spd:1.2, flying:false, hitsAir:true,  targets:'any',       r:0.40, desc:'2명 · 대공 원거리'},
  giant:    {name:'자이언트', emoji:'🗿', cost:5, count:1, hp:4200, dmg:130, hs:1.5, range:1.0, spd:0.9, flying:false, hitsAir:false, targets:'buildings', r:0.65, desc:'건물만 공격 탱커'},
  minions:  {name:'미니언',   emoji:'👾', cost:3, count:3, hp:200,  dmg:45,  hs:1.0, range:0.8, spd:1.8, flying:true,  hitsAir:true,  targets:'any',       r:0.38, desc:'공중 유닛 3마리'},
  musketeer:{name:'머스키타', emoji:'🔫', cost:4, count:1, hp:720,  dmg:110, hs:1.1, range:6.5, spd:1.2, flying:false, hitsAir:true,  targets:'any',       r:0.42, desc:'장거리 속사 · 대공'},
  fireball: {name:'파이어볼', emoji:'🔥', cost:4, kind:'spell', dmg:300, towerDmg:110, radius:2.2, desc:'광역 폭발 주문'},
  skarmy:   {name:'해골군단', emoji:'💀', cost:3, count:9, hp:96,   dmg:40,  hs:1.0, range:0.7, spd:1.8, flying:false, hitsAir:false, targets:'any',       r:0.32, desc:'9마리 떼전술'},
  cannon:   {name:'캐논',     emoji:'💣', cost:3, kind:'building', count:1, hp:800, dmg:85, hs:0.9, range:5.5, hitsAir:false, targets:'ground', r:0.70, life:30, splash:1.3, desc:'지상 포탑 30초 · 원형 포격'},
  wizard:   {name:'마법사',   emoji:'🔮', cost:5, count:1, hp:960,  dmg:150, hs:1.4, range:5.0, spd:1.0, flying:false, hitsAir:true,  targets:'any',       r:0.45, splash:1.5, desc:'광역 폭발 · 대공'},
  sniper:   {name:'저격수',   emoji:'🎯', cost:4, count:1, hp:480,  dmg:260, hs:2.6, range:8.5, spd:1.1, flying:false, hitsAir:true,  targets:'any',       r:0.42, desc:'최장 사거리 일격'},
  prince:   {name:'프린스',   emoji:'🐎', cost:5, count:1, hp:2400, dmg:180, hs:1.4, range:1.0, spd:1.3, flying:false, hitsAir:false, targets:'any',       r:0.55, charge:true, desc:'돌진 후 피해 2배'},
  zap:      {name:'번개',     emoji:'⚡', cost:2, kind:'spell', dmg:140, towerDmg:40, radius:1.6, stun:0.8, desc:'0.8초 기절 주문'},
  valk:     {name:'도끼전사', emoji:'🪓', cost:4, count:1, hp:2600, dmg:130, hs:1.5, range:1.0, spd:1.1, flying:false, hitsAir:false, targets:'any', r:0.55, splash:1.3, desc:'주변 광역 근접'},
  bomber:   {name:'폭탄병',   emoji:'🧨', cost:3, count:1, hp:600,  dmg:130, hs:1.9, range:4.5, spd:1.3, flying:false, hitsAir:false, targets:'ground', r:0.40, splash:1.3, desc:'지상 폭탄 던지기'},
  babyd:    {name:'아기 드래곤', emoji:'🐉', cost:4, count:1, hp:1800, dmg:100, hs:1.6, range:3.2, spd:1.2, flying:true, hitsAir:true, targets:'any', r:0.50, splash:1.0, desc:'비행 화염 브레스'},
  cleric:   {name:'성직자',   emoji:'💚', cost:3, count:1, hp:900,  heal:60, hs:1.4, range:0, spd:1.1, flying:false, hitsAir:false, targets:'any', r:0.45, desc:'아군 지속 회복 60'},
  boar:     {name:'돌격 멧돼지', emoji:'🐗', cost:4, count:1, hp:2300, dmg:160, hs:1.5, range:0.9, spd:2.0, flying:false, hitsAir:false, targets:'buildings', r:0.55, charge:true, desc:'건물만 빠른 돌진'},
  icem:     {name:'서리 마법사', emoji:'❄️', cost:4, count:1, hp:840,  dmg:90,  hs:1.5, range:5.0, spd:1.1, flying:false, hitsAir:true, targets:'any', r:0.45, splash:1.4, slow:1.5, desc:'적중 시 둔화 · 광역'}
};
const DECK=['knight','archers','giant','minions','musketeer','fireball','skarmy','cannon','wizard','sniper','prince','zap','valk','bomber','babyd','cleric','boar','icem'];
const __ch2=document.getElementById('cards-h2'); if(__ch2) __ch2.textContent='🃏 카드 도감 ('+DECK.length+'종)';
const __cs=document.getElementById('cards-sub'); if(__cs) __cs.textContent=DECK.length+'종 카드로 승부하는 실시간 아레나 배틀';
/* ---------- 아레나 테마 (레퍼런스: 클래시 로얄 스토어 스크린샷) ---------- */
const THEMES={
  classic:{g1:'#59963e',g2:'#67ab49',speck:'rgba(255,255,255,.07)',blade:'rgba(30,70,20,.28)',
    road:'rgba(196,164,108,.30)',riverA:'#2874ae',riverB:'#3d9be9',spark:'rgba(255,255,255,.35)',
    bush:'#3f7a2f',flower:'#e8b4d8',stone:'#9aa3ae',stoneHi:'#b7bfc9',stoneEdge:'rgba(60,70,80,.5)',amb:null},
  lava:{g1:'#54403c',g2:'#63493f',speck:'rgba(255,140,60,.10)',blade:'rgba(255,120,40,.20)',
    road:'rgba(255,180,110,.22)',riverA:'#a83b12',riverB:'#e86a1e',spark:'rgba(255,220,120,.65)',
    bush:'#8a4a20',flower:'#ffcf5e',stone:'#6f6a72',stoneHi:'#8a8490',stoneEdge:'rgba(35,25,30,.6)',amb:'ember'},
  ice:{g1:'#a9cde3',g2:'#c2e0f0',speck:'rgba(255,255,255,.50)',blade:'rgba(120,170,210,.35)',
    road:'rgba(180,205,230,.55)',riverA:'#7fb6d9',riverB:'#a8d8f0',spark:'rgba(255,255,255,.65)',
    bush:'#7fa8c4',flower:'#ffffff',stone:'#9fb4c4',stoneHi:'#c4d6e4',stoneEdge:'rgba(70,95,120,.5)',amb:'snow'}
};
const RARC={c:['#8fa6bd','#4a5f85','#22304f'], r:['#e8b053','#916022','#4e2f10'], e:['#cf6df5','#7233a8','#2e1150']};
const RKEY={giant:'r',musketeer:'r',wizard:'r',fireball:'r',sniper:'r',prince:'e',zap:'e',valk:'r',babyd:'r',cleric:'e',boar:'r',icem:'r'};
const RAR={knight:'c',archers:'c',minions:'c',cannon:'c',zap:'c',giant:'r',musketeer:'r',fireball:'r',wizard:'r',sniper:'r',skarmy:'e',prince:'e',valk:'r',bomber:'c',babyd:'r',cleric:'e',boar:'r',icem:'r'};
const ART={knight:"assets/img_017.jpg",archers:"assets/img_018.jpg",giant:"assets/img_019.jpg",minions:"assets/img_020.jpg",musketeer:"assets/img_021.jpg",fireball:"assets/img_022.jpg",skarmy:"assets/img_023.jpg",cannon:"assets/img_024.jpg",wizard:"assets/img_025.jpg",sniper:"assets/img_026.jpg",prince:"assets/img_027.jpg",zap:"assets/img_028.jpg",boss:"assets/img_029.png"};


'use strict';
const ART_SPR={knight:"assets/img_030.png",archers:"assets/img_031.png",giant:"assets/img_032.png",minions:"assets/img_033.png",musketeer:"assets/img_034.png",wizard:"assets/img_035.png",skarmy:"assets/img_036.png",prince:"assets/img_037.png",sniper:"assets/img_038.png",cannon:"assets/img_039.png"};


'use strict';
const ART_TOW={t_princess_b:"assets/img_040.png",t_princess_r:"assets/img_041.png",t_king_b:"assets/img_042.png",t_king_r:"assets/img_043.png",t_rubble:"assets/img_044.png"};
const ART_NEW={valk:"assets/img_045.jpg",bomber:"assets/img_046.jpg",babyd:"assets/img_047.jpg",cleric:"assets/img_048.jpg",boar:"assets/img_049.jpg",icem:"assets/img_050.jpg"};


'use strict';
const ART_SPR_NEW={valk:"assets/img_051.png",bomber:"assets/img_052.png",babyd:"assets/img_053.png",cleric:"assets/img_054.png",boar:"assets/img_055.png",icem:"assets/img_056.png"};
for(const nk in ART_NEW) ART[nk]=ART_NEW[nk];
for(const nk in ART_SPR_NEW) ART_SPR[nk]=ART_SPR_NEW[nk];
const GRASS_B64="assets/img_057.jpg";


'use strict';
const ART_DECO={lava:"assets/img_058.png",ice:"assets/img_059.png"};
const ART_GDEC={t1:"assets/img_060.png",t2:"assets/img_061.png",rk:"assets/img_062.png",bs:"assets/img_063.png"};
const DSPR={};for(const kk in ART_DECO){const im=new Image();im.src=ART_DECO[kk];DSPR[kk]=im;}


const GSPR={};for(const kk in ART_GDEC){const im=new Image();im.src=ART_GDEC[kk];GSPR[kk]=im;}
const ART_BRIDGE="assets/img_064.png";
const BRIDGE_IM=new Image();BRIDGE_IM.src='assets/img_065.png';


'use strict';
const ART_FIELD="assets/img_066.jpg";
const FIELD_IM=new Image();FIELD_IM.onload=()=>{try{drawStatic()}catch(e){}};FIELD_IM.src=ART_FIELD;
const BANR_IM=new Image();BANR_IM.src="assets/img_067.png";
const BANB_IM=new Image();BANB_IM.src="assets/img_068.png";
const HPFR_IM=new Image();HPFR_IM.src="assets/img_069.png";
const WALL_IM=new Image();WALL_IM.onload=()=>{try{drawStatic()}catch(e){}};WALL_IM.src="assets/img_070.jpg";
const GRASS_IM=new Image();GRASS_IM.onload=()=>{try{drawStatic()}catch(e){}};GRASS_IM.src=GRASS_B64;
const ART_PROJ={fireball:"assets/img_071.png",zap:"assets/img_072.png","arrow":"assets/img_073.png","bullet":"assets/img_074.png","bomb":"assets/img_075.png","wizfb":"assets/img_076.png","dragon":"assets/img_077.png","ice":"assets/img_078.png","cannon":"assets/img_079.png"};


'use strict';
const ART_PARTS={wizard_head:"assets/img_080.png",valk_head:"assets/img_081.png",sniper_head:"assets/img_082.png",skarmy_head:"assets/img_083.png",prince_head:"assets/img_084.png",musketeer_head:"assets/img_085.png",minions_head:"assets/img_086.png",knight_head:"assets/img_087.png",icem_head:"assets/img_088.png",giant_head:"assets/img_089.png",cleric_head:"assets/img_090.png",boss_head:"assets/img_091.png",bomber_head:"assets/img_092.png",boar_head:"assets/img_093.png",babyd_head:"assets/img_094.png",archers_head:"assets/img_095.png",archers_arm:"assets/img_096.png",archers_leg:"assets/img_097.png",arrow:"assets/img_098.png",boar_leg:"assets/img_099.png",bomber_arm:"assets/img_100.png",bomber_leg:"assets/img_101.png",boss_arm:"assets/img_102.png",boss_leg:"assets/img_103.png",cleric_arm:"assets/img_104.png",cleric_leg:"assets/img_105.png",giant_arm:"assets/img_106.png",giant_leg:"assets/img_107.png",icem_arm:"assets/img_108.png",icem_leg:"assets/img_109.png",knight_arm:"assets/img_110.png",knight_leg:"assets/img_111.png",musketeer_arm:"assets/img_112.png",musketeer_leg:"assets/img_113.png",prince_arm:"assets/img_114.png",prince_leg:"assets/img_115.png",skarmy_arm:"assets/img_116.png",skarmy_leg:"assets/img_117.png",sniper_arm:"assets/img_118.png",sniper_leg:"assets/img_119.png",valk_arm:"assets/img_120.png",valk_leg:"assets/img_121.png",w_axe:"assets/img_122.png",w_bomb:"assets/img_123.png",w_bow:"assets/img_124.png",w_dagger:"assets/img_125.png",w_greatsword:"assets/img_126.png",w_musket:"assets/img_127.png",w_sniper:"assets/img_128.png",w_staff:"assets/img_129.png",w_sword:"assets/img_130.png",wing_babyd:"assets/img_131.png",wing_minion:"assets/img_132.png",wizard_arm:"assets/img_133.png",wizard_leg:"assets/img_134.png"};


'use strict';
const ART_CORE={archers:"assets/img_135.png",babyd:"assets/img_136.png",boar:"assets/img_137.png",bomber:"assets/img_138.png",boss:"assets/img_139.png",cleric:"assets/img_140.png",giant:"assets/img_141.png",icem:"assets/img_142.png",knight:"assets/img_143.png",minions:"assets/img_144.png",musketeer:"assets/img_145.png",prince:"assets/img_146.png",skarmy:"assets/img_147.png",sniper:"assets/img_148.png",valk:"assets/img_149.png",wizard:"assets/img_150.png"};


'use strict';
const ART_FRAMES={knight_idle:"assets/img_151.png",knight_atk:"assets/img_152.png",prince_idle:"assets/img_153.png",prince_atk:"assets/img_154.png",valk_idle:"assets/img_155.png",valk_atk:"assets/img_156.png",skarmy_idle:"assets/img_157.png",skarmy_atk:"assets/img_158.png",archers_idle:"assets/img_159.png",archers_atk:"assets/img_160.png",musketeer_idle:"assets/img_161.png",musketeer_atk:"assets/img_162.png",sniper_idle:"assets/img_163.png",sniper_atk:"assets/img_164.png",wizard_idle:"assets/img_165.png",wizard_atk:"assets/img_166.png",cleric_idle:"assets/img_167.png",cleric_atk:"assets/img_168.png",icem_idle:"assets/img_169.png",icem_atk:"assets/img_170.png",bomber_idle:"assets/img_171.png",bomber_atk:"assets/img_172.png",giant_idle:"assets/img_173.png",giant_atk:"assets/img_174.png",boar_idle:"assets/img_175.png",boar_atk:"assets/img_176.png",minions_idle:"assets/img_177.png",minions_atk:"assets/img_178.png",babyd_idle:"assets/img_179.png",babyd_atk:"assets/img_180.png",boss_idle:"assets/img_181.png"};


'use strict';
(function(){function __ac(){for(const kk in ART_CORE){const im=SPR[kk];if(!im)continue;im.addEventListener('load',function(){try{const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d');g.drawImage(im,0,0);const d=g.getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4){if(d[i]>10)n++;}im.__valid=n>40;}catch(e){}});im.src=ART_CORE[kk];}}if(document.readyState==='complete') try{__ac();}catch(e){} else window.addEventListener('load',__ac);})();const RIG_RATIO={"knight":{"kind":"humanoid","p1":1.143,"p2":0.798,"p3":0.845},"prince":{"kind":"mounted","p1":0.825,"p2":0.448,"p3":0.234},"valk":{"kind":"humanoid","p1":0.918,"p2":0.735,"p3":0.663},"skarmy":{"kind":"humanoid","p1":0.985,"p2":0.836,"p3":1.03},"archers":{"kind":"humanoid","p1":1.266,"p2":0.872,"p3":0.574},"musketeer":{"kind":"humanoid","p1":0.97,"p2":0.683,"p3":0.545},"sniper":{"kind":"humanoid","p1":0.697,"p2":0.934,"p3":0.697},"wizard":{"kind":"humanoid","p1":1.655,"p2":0.691,"p3":0.582},"cleric":{"kind":"humanoid","p1":1.436,"p2":0.864,"p3":0.418},"icem":{"kind":"humanoid","p1":1.336,"p2":0.727,"p3":0.491},"bomber":{"kind":"humanoid","p1":1.076,"p2":0.823,"p3":0.899},"giant":{"kind":"humanoid","p1":1.124,"p2":0.91,"p3":0.607},"boar":{"kind":"boar","p1":0.0,"p2":0.337,"p3":0.331},"minions":{"kind":"flyer","p1":0.879,"p2":0.0,"p3":0.766},"babyd":{"kind":"flyer","p1":0.559,"p2":0.0,"p3":0.793},"boss":{"kind":"humanoid","p1":1.16,"p2":0.681,"p3":0.326}};const RIG_R=k=>(RIG_RATIO[k]||{p1:0.5,p2:0.5});const WEMBED={knight:1,prince:1,valk:1,skarmy:1,archers:1,musketeer:1,sniper:1,wizard:1,cleric:1,icem:1,bomber:1,boss:1};const FRAMES={};if(typeof ART_FRAMES!=='undefined'){for(const kk in ART_FRAMES){const im=new Image();im.src=ART_FRAMES[kk];FRAMES[kk]=im;im.onload=function(){try{const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d');g.drawImage(im,0,0);const d=g.getImageData(0,0,c.width,c.height).data;let a=0;for(let i=3;i<d.length;i+=4)a+=d[i];im.__valid=a>0;}catch(e){im.__valid=false;}};}}
function raTint(im,team,full){ try{   /* v177: 팀 컬러 전면 — 청(222°)/레드(354°) 휴 remap, 무채색 보존, 옷 없는 유닛(몬스터)은 피부 포함 전면 */
  if(!im||!im.naturalWidth) return im;
  if(team!=='red') return im;   /* v180: 아군 원복 — 도감·카드 색 그대로(사용자 지시), 적군만 틴트 */
  const ck=(team==='red')?'__tR':'__tB'; if(im[ck]) return im[ck];
  const isFull=(full&&(('giant','skarmy','boar','bomber','boss','minions','babyd').indexOf(full)>=0))||full===1;
  const w=im.naturalWidth,h=im.naturalHeight,c=document.createElement('canvas'); c.width=w;c.height=h;
  const g=c.getContext('2d'); g.drawImage(im,0,0); const d=g.getImageData(0,0,w,h),p=d.data;
  const TH=(team==='red')?354:222;
  for(let i2=0;i2<p.length;i2+=4){ if(p[i2+3]<8) continue;
    const r=p[i2]/255,gg=p[i2+1]/255,b=p[i2+2]/255,mx=Math.max(r,gg,b),mn=Math.min(r,gg,b);
    if(mx===mn) continue; const df=mx-mn,l=(mx+mn)/2,s=l>0.5?df/(2-mx-mn):df/(mx+mn);
    if(s<0.16) continue;   /* 은갑·뼈·흰 로브 등 무채색 보존 */
    let hh=0; if(mx===r)hh=60*(((gg-b)/df)%6); else if(mx===gg)hh=60*((b-r)/df+2); else hh=60*((r-gg)/df+4);
    if(hh<0)hh+=360;
    if(!isFull&&hh>=8&&hh<52&&s<0.62&&l>0.3&&l<0.85) continue;   /* 옷 있는 유닛: 피부톤 보존 */
    const s2=Math.min(0.78,Math.max(0.42,s*0.92)),c2=(1-Math.abs(2*l-1))*s2,x=c2*(1-Math.abs((TH/60)%2-1)),m2=l-c2/2;
    let r2=0,g2=0,b2=0; const hb=TH/60;
    if(hb<1){r2=c2;g2=x;} else if(hb<2){r2=x;g2=c2;} else if(hb<3){g2=c2;b2=x;} else if(hb<4){g2=x;b2=c2;} else if(hb<5){r2=x;b2=c2;} else {r2=c2;b2=x;}
    p[i2]=Math.round((r2+m2)*255); p[i2+1]=Math.round((g2+m2)*255); p[i2+2]=Math.round((b2+m2)*255);
  }
  g.putImageData(d,0,0); im[ck]=c; return c;
}catch(e){ return im; } }
window.__rFix=function(){
try{ var ag=document.getElementById('btn-again'), hm=document.getElementById('btn-home'); if(ag&&hm&&ag.parentElement&&ag.parentElement.id!=='r-actions'){ var row=document.createElement('div'); row.id='r-actions'; row.style.cssText='display:flex;gap:10px;margin-top:14px;align-items:stretch'; ag.parentNode.insertBefore(row,ag); row.appendChild(ag); row.appendChild(hm); ag.style.flex='1.4'; hm.style.flex='1'; ag.style.width='auto'; hm.style.width='auto'; } }catch(__e){}
 try{   /* v177: 엔딩 개편 — 배지·스냅샷·버튼 2열·스태거 */
  var ov=document.getElementById('overlay-result'); if(!ov) return;
  var st=document.createElement('style'); st.id='rf-style';
  st.textContent='#overlay-result.hidden{display:none!important}'
   +'#overlay-result>div, #overlay-result .r-box {'
   +'width:min(370px,94vw)!important;max-width:370px!important;max-height:calc(100dvh - 20px)!important;'
   +'overflow:hidden!important;margin:auto!important;position:relative!important;inset:auto!important;transform:none!important;'
   +'padding:16px 18px!important;box-sizing:border-box!important}'
   +'.rbadge{display:inline-block;padding:6px 20px;border-radius:999px;font:900 24px var(--fd);letter-spacing:.02em;margin:4px 0 2px}'
   +'#overlay-result:not(.lose) .rbadge{background:linear-gradient(180deg,#ffe08a,#f7c531);color:#5a4a08;box-shadow:0 4px 18px rgba(247,197,49,.35)}'
   +'#overlay-result.lose .rbadge{background:linear-gradient(180deg,#3a465e,#263248);color:#ff9d9d;border:1px solid #ff8f8f66}'
   +'.rsnap{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:6px!important;width:100%!important;margin:4px 0!important}'
   +'.rsnap>div{padding:6px 4px!important;border-radius:10px!important;text-align:center!important;min-width:0!important;background:#0d1b2e;border:1px solid #ffffff22}'
   +'.rsnap b{display:block!important;font:900 16px var(--fd)!important;color:#f7c531!important;white-space:nowrap!important}'
   +'.rsnap span{display:block!important;font:600 11px var(--fd)!important;color:#9fb2cc!important;white-space:nowrap!important}'
   +'.r-tabs{display:grid!important;grid-template-columns:1fr 1fr!important;gap:6px!important;width:100%!important;margin:6px 0!important}'
   +'.rtab{width:100%!important;height:32px!important;font-size:12px!important;white-space:nowrap!important}'
   +'#rpane-score{width:100%!important;display:flex!important;flex-direction:column!important;gap:3px!important}'
   +'.rrow{width:100%!important;height:24px!important;padding:2px 8px!important;font-size:11.5px!important;display:flex!important;justify-content:space-between!important;align-items:center!important}'
   +'.rrow span,.rrow b{white-space:nowrap!important}'
   +'#r-actions,.rbrow{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;width:100%!important;margin-top:6px!important}'
   +'#btn-again,#btn-home,#btn-main{width:100%!important;height:42px!important;margin:0!important;padding:0 8px!important;font-size:14px!important;font-weight:800!important;border-radius:10px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;white-space:nowrap!important}'
   +'#btn-main{background:transparent!important;border:2px solid #ffffff44!important;color:#cfe0ff!important}'
   +'#overlay-result [id^=rt-]{font-variant-numeric:tabular-nums}'
   +'@keyframes rfIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}'
   +'#overlay-result>div>*{animation:rfIn .34s ease both}'
   +'#overlay-result>div>*:nth-child(2){animation-delay:.06s}#overlay-result>div>*:nth-child(3){animation-delay:.12s}#overlay-result>div>*:nth-child(4){animation-delay:.18s}#overlay-result>div>*:nth-child(5){animation-delay:.24s}';
  document.head.appendChild(st);
  var panel=ov.querySelector('div');
  var tit=document.getElementById('r-title');
  if(tit&&!document.getElementById('rf-badge')){ var bd=document.createElement('div'); bd.id='rf-badge'; bd.className='rbadge'; bd.textContent=tit.textContent;
    tit.style.display='none'; tit.parentNode.insertBefore(bd,tit); }
  var bd=document.getElementById('rf-badge'); if(bd) bd.textContent=(S.winner==='blue')?'승리!':(S.winner==='red')?'패배':'무승부';
  if(panel&&!document.getElementById('rf-snap')){ var sn=document.createElement('div'); sn.id='rf-snap'; sn.className='rsnap';
    var cr=(S.crowns&&S.crowns.blue)||0,crR=(S.crowns&&S.crowns.red)||0;
    var tp=document.getElementById('rt-trophy'),sm=document.getElementById('rt-sum');
    sn.innerHTML='<div><b>'+cr+' : '+crR+'</b><span>왕관</span></div><div><b>'+(sm?sm.textContent:'0')+'</b><span>총점</span></div><div><b>'+(tp?tp.textContent:'+0')+'</b><span>트로피</span></div>';
    var sub=document.getElementById('r-sub'); (sub||bd).parentNode.insertBefore(sn,(sub||bd).nextSibling); if(sub) sub.style.display='none'; }
  var ba=document.getElementById('btn-again'),bm=document.getElementById('btn-main');
  if(ba&&bm&&!ba.parentNode.classList.contains('rbrow')){ var row=document.createElement('div'); row.className='rbrow';
    ba.parentNode.insertBefore(row,ba); row.appendChild(ba); row.appendChild(bm); }
  var bd2=document.getElementById('rf-badge'); if(bd2&&bd2.parentNode) bd2.parentNode.classList.toggle('lose',S.winner!=='blue');
}catch(e){} };
const PARTS={};let __pvN=0;for(const kk in ART_PARTS){const im=new Image();im.src=ART_PARTS[kk];im.onload=function(){try{const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d');g.drawImage(im,0,0);const d=g.getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4){if(d[i]>10)n++;}im.__valid=n>40;if(im.__valid)__pvN++;}catch(e){im.__valid=false;}};PARTS[kk]=im;}const PSPR={};for(const kk in ART_PROJ){const im=new Image();im.src=ART_PROJ[kk];PSPR[kk]=im;}
PSPR.kingshot=PSPR.cannon;
const LAVA_IM=new Image();LAVA_IM.src='assets/img_182.jpg';
const ICE_IM=new Image();
ICE_IM.src='assets/img_183.jpg';
BRIDGE_IM.src='assets/img_184.png';
const RIVER_IM={classic:new Image(),lava:new Image(),ice:new Image()};RIVER_IM.classic.src='assets/img_185.jpg';RIVER_IM.lava.src='assets/img_186.jpg';RIVER_IM.ice.src='assets/img_187.jpg';

const ART_ATK={valk:"assets/img_188.png",boar:"assets/img_189.png",bomber:"assets/img_190.png",knight:"assets/img_191.png",archers:"assets/img_192.png",giant:"assets/img_193.png",minions:"assets/img_194.png",musketeer:"assets/img_195.png",wizard:"assets/img_196.png",skarmy:"assets/img_197.png",prince:"assets/img_198.png",sniper:"assets/img_199.png",cannon:"assets/img_200.png"};


'use strict';
const ART_DIE={knight:"assets/img_201.png",archers:"assets/img_202.png",giant:"assets/img_203.png",minions:"assets/img_204.png",musketeer:"assets/img_205.png",wizard:"assets/img_206.png",skarmy:"assets/img_207.png",prince:"assets/img_208.png",sniper:"assets/img_209.png",cannon:"assets/img_210.png"};const ASPR={},DIESPR={};for(const kk in ART_ATK){const im=new Image();im.src=ART_ATK[kk];ASPR[kk]=im;}for(const kk in ART_DIE){const im=new Image();im.src=ART_DIE[kk];DIESPR[kk]=im;}

/* ---------- 전역 상태 ---------- */
const DECO={ // 테마별 아레나 데코 배치(용암 분출구·얼음 결정) — 다리·타워·강 회피
  lava:[{x:1.9,y:12.6,s:1.10,rot:0.25,f:0},{x:16.1,y:19.3,s:0.95,rot:-0.7,f:1},{x:11.8,y:25.6,s:0.80,rot:1.4,f:0},{x:6.4,y:6.6,s:0.85,rot:2.2,f:1}],
  ice:[{x:1.9,y:12.6,s:1.05,rot:-0.4,f:1},{x:16.1,y:19.3,s:0.90,rot:0.6,f:0},{x:11.8,y:25.6,s:0.85,rot:2.0,f:1},{x:6.4,y:6.6,s:0.80,rot:0.9,f:0}]};
const DECOC=[{x:1.9,y:12.6,k:'t1',s:1.05,rot:0.06,f:0},{x:16.1,y:19.3,k:'t1',s:1.00,rot:-0.05,f:1},
  {x:1.2,y:19.6,k:'t2',s:0.95,rot:0.04,f:0},{x:16.8,y:12.7,k:'t2',s:0.90,rot:-0.03,f:1},
  {x:11.8,y:25.6,k:'rk',s:0.62,rot:0.15,f:0},{x:6.4,y:6.6,k:'rk',s:0.58,rot:-0.20,f:1},
  {x:8.9,y:14.5,k:'bs',s:0.50,rot:0,f:0},{x:5.2,y:14.3,k:'bs',s:0.45,rot:0,f:1},{x:12.8,y:17.7,k:'bs',s:0.45,rot:0,f:0}];
const S={scene:'title', over:false, shown:false, winner:null, t:300, overtime:false, double:false,
         crowns:{blue:0,red:0}, kills:{blue:0,red:0}, endTimer:0, slow:0, muted:(function(){ try{ return localStorage.getItem('ra_muted')==='1'; }catch(e){ return false; } })(), shake:0, theme:'classic', pre:0};
const P={elixir:5, hand:[], queue:[], sel:null};        // 플레이어(파랑)
const A={elixir:5, hand:[], queue:[], timer:2.0};       // AI(빨강)
let units=[], towers=[], projs=[], fx=[], floats=[], parts=[];
const AUTO=false; // 테스트용 자동 시작 플래그 (?auto=1로도 활성화)

/* ---------- 사운드 (WebAudio 합성) ---------- */
let AC=null;
function ensureAudio(){
  if(!AC){ try{ AC=new (window.AudioContext||window.webkitAudioContext)(); if(AC){ const __cp=AC.createDynamicsCompressor(); __cp.threshold.value=-20; __cp.knee.value=40; __cp.ratio.value=12; __cp.attack.value=0; __cp.release.value=0.25; __cp.connect(AC.destination); window.__COMP=__cp; } }catch(e){ AC=null; } }   /* v162 마스터 컴프레서 */
  if(AC && AC.state==='suspended') AC.resume();
}
function tone(f,d,type,v,slide){
  if(!AC||S.muted) return;
  const o=AC.createOscillator(), g=AC.createGain();
  o.type=type||'sine'; o.frequency.value=f;
  if(slide) o.frequency.linearRampToValueAtTime(Math.max(30,f+slide), AC.currentTime+d);
  g.gain.value=v||0.08; g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime+d);
  o.connect(g); g.connect(window.__COMP||AC.destination); o.start(); o.stop(AC.currentTime+d);
}
function noiseBurst(d,v){
  if(!AC||S.muted) return;
  const n=AC.sampleRate*d, buf=AC.createBuffer(1,n,AC.sampleRate), ch=buf.getChannelData(0);
  for(let i=0;i<n;i++) ch[i]=(Math.random()*2-1)*(1-i/n);
  const src=AC.createBufferSource(), g=AC.createGain(); src.buffer=buf; g.gain.value=v;
  src.connect(g); g.connect(window.__COMP||AC.destination); src.start();
}
function sfxBP(d,v,f0,f1){ if(!AC||S.muted) return; const n=AC.sampleRate*d, buf=AC.createBuffer(1,n,AC.sampleRate), ch=buf.getChannelData(0); for(let i=0;i<n;i++) ch[i]=(Math.random()*2-1)*(1-i/n); const src=AC.createBufferSource(); src.buffer=buf; const bp=AC.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=1.1; bp.frequency.setValueAtTime(f0,AC.currentTime); bp.frequency.linearRampToValueAtTime(f1,AC.currentTime+d); const g=AC.createGain(); g.gain.value=v; src.connect(bp); bp.connect(g); g.connect(window.__COMP||AC.destination); src.start(); }   /* v164: 화염 밴드패스 스윕 — game-audio-synth-system 스킬 */
function sfx(k){
  if(!AC||S.muted) return;
  try{ const __n=performance.now(); if(!sfx._t) sfx._t={}; if((k==='hit'||k==='shoot'||k==='thud'||k==='spark'||k==='bow'||k==='musket')&&__n-(sfx._t[k]||0)<30) return; sfx._t[k]=__n; }catch(e){}   /* v163: 임팩트 스로틀 30ms */
  if(k==='deploy'){ tone(500,.12,'triangle',.10,140); }
  else if(k==='shoot'){ tone(900,.06,'square',.03); }
  else if(k==='hit'){ tone(210,.05,'square',.045); }
  else if(k==='cast'){ tone(300,.3,'sawtooth',.06,260); }
  else if(k==='zap'){ tone(1500,.14,'square',.06,-1250); tone(2230,.12,'square',.045,-1900); noiseBurst(.07,.05); }
  else if(k==='boom'){ noiseBurst(.4,.18); tone(70,.45,'sine',.22,-40); tone(45,.5,'sine',.14,-15); }
  else if(k==='crown'){ tone(1100,.05,'square',.07,-200); [262,330,392,523].forEach((f,i)=>setTimeout(()=>tone(f,.22,'triangle',.10),90+i*120));   /* v165: 앤빌 클랭+승차 아르페지오 */ }
  else if(k==='win'){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>tone(f,.24,'triangle',.13),i*170)); }
  else if(k==='lose'){ [392,311,262].forEach((f,i)=>setTimeout(()=>tone(f,.3,'sawtooth',.07),i*210)); }
  else if(k==='bow'){ tone(420,.06,'triangle',.045,-140); noiseBurst(.04,.015); }
  else if(k==='musket'){ noiseBurst(.08,.09); tone(170,.07,'square',.05,-70); }
  else if(k==='firel'){ noiseBurst(.16,.045); tone(210,.18,'sawtooth',.035,110); }
  else if(k==='toss'){ tone(300,.12,'sine',.04,180); }
  else if(k==='icel'){ tone(1200,.08,'triangle',.04,380); }
  else if(k==='cannon'){ noiseBurst(.14,.13); tone(110,.2,'sine',.15,-50); }
  else if(k==='thud'){ tone(180,.05,'square',.04,-60); }
  else if(k==='spark'){ tone(1400,.05,'sawtooth',.03,-900); }
  else if(k==='icehit'){ [1800,2400,3200].forEach((f,i)=>tone(f,.07,'sine',.03-i*0.006,120)); noiseBurst(.05,.04); }
  else if(k==='fwhit'){ sfxBP(.2,.05,300,1400); tone(120,.16,'sine',.07,-30); }
  else if(k==='boomL'){ noiseBurst(.26,.16); tone(95,.26,'sine',.14,-40); }
}

/* ---------- v54: 전투 BGM (WebAudio 절차 루프) ---------- */
let bgmTimer=null, bgmStep=0;
function bgmStart(){
  ensureAudio();
  if(!AC||S.muted||bgmTimer) return;
  bgmStep=0;
  bgmTimer=setInterval(function(){
    if(!AC||S.muted) return;
    try{
      bgmStep++;
      const line=[110,0,131,0,110,0,147,165];
      if(bgmStep%2===1){ const f=line[(bgmStep>>1)%8]; if(f) tone(f,0.22,'triangle',0.020); }
      if(bgmStep%4===1) noiseBurst(0.025,0.010);
      if(bgmStep%8===0) tone(55,0.30,'sine',0.038);
      if(bgmStep%8===4) tone(82,0.18,'sine',0.026);
    }catch(e){}
  },250);
}
function bgmStop(){ if(bgmTimer){ clearInterval(bgmTimer); bgmTimer=null; } }

/* ---------- 배너/토스트 ---------- */
let bannerTO=null, toastTO=null;
function banner(txt,ms){
  const b=$('#banner'); b.textContent=txt; b.classList.remove('show'); void b.offsetWidth;
  b.classList.add('show'); clearTimeout(bannerTO); bannerTO=setTimeout(()=>b.classList.remove('show'), ms||1700);
}
function toast(txt,ms){
  const t=$('#toast'); t.textContent=txt; t.classList.add('show');
  clearTimeout(toastTO); toastTO=setTimeout(()=>t.classList.remove('show'), ms||1700);
}

/* ---------- 덱 사이클 ---------- */
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [a[i],a[j]]=[a[j],a[i]]; } return a; }
const DECK_SLOTS=['ra_deck_slot1','ra_deck_slot2'];
const DECK_DEFAULTS=[['knight','archers','giant','minions','musketeer','fireball','skarmy','cannon'],
                     ['prince','wizard','sniper','valk','boar','bomber','babyd','cleric']];
function loadDeckSlot(n){ try{ if(typeof localStorage==='undefined') return null;
  const s=JSON.parse(localStorage.getItem(DECK_SLOTS[n])||'null');
  if(!Array.isArray(s)) return DECK_DEFAULTS[n];
  const ok=s.filter(k=>CARDS[k]);
  return ok.length===8?ok:DECK_DEFAULTS[n]; }catch(e){ return DECK_DEFAULTS[n]; } }
function activeSlot(){ try{ if(typeof localStorage==='undefined') return 0;
  return parseInt(localStorage.getItem('ra_deck_active')||'0',10)===1?1:0; }catch(e){ return 0; } }
function getActiveDeck(){ if(typeof localStorage==='undefined') return null; return loadDeckSlot(activeSlot()); }
function initDeck(p,rd){ const q=shuffle([...(rd?DECK:(getActiveDeck()||DECK))]); p.hand=q.slice(0,4); p.queue=q.slice(4); }   /* v192: rd=true → 18종 풀 랜덤 */
/* v72: 덱 편성 오버레이 — 덱 슬롯 2개 + 카드 교체 */
function openDeckEditor(){
  if(document.getElementById('deck-edit')) return;
  let slot=activeSlot(); let deck=(loadDeckSlot(slot)||DECK.slice(0,8)).slice();
  const ov=document.createElement('div'); ov.id='deck-edit';
  ov.style.cssText='position:fixed;inset:0;z-index:80;background:rgba(5,8,18,.94);display:flex;flex-direction:column;align-items:center;padding:16px;overflow-y:auto;';
  const style=document.createElement('style');
  style.textContent='.dk{background:#101a30;border:2px solid #2a3f6e;border-radius:12px;padding:6px;margin:3px;cursor:pointer;min-width:64px;text-align:center;font-family:Jua,sans-serif}'+
   '.dk.on{border-color:#f7c531;box-shadow:0 0 10px rgba(247,197,49,.5)}'+
   '.dk .dke{font-size:26px;line-height:1.1}.dk .dkn{font-size:11px;color:#dfe8ff}.dk .dkc{font-size:10px;color:#c77dff}';
  document.head.appendChild(style);
  function render(){
    const cost=Math.round(deck.reduce((a,k)=>a+CARDS[k].cost,0)/deck.length*10)/10;
    ov.innerHTML='<div style="font-family:Jua,sans-serif;font-size:24px;color:#f7c531;margin:6px">🃏 덱 편성</div>'+
     '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center">'+
      DECK_SLOTS.map((_,n)=>'<button class="dk'+(n===slot?' on':'')+'" data-slot="'+n+'"><div class="dke">'+(n===0?'🅰':'🅱')+'</div><div class="dkn">덱 슬롯 '+(n+1)+'</div></button>').join('')+
      '<span style="font-family:Jua,sans-serif;color:#9fb3dd;font-size:13px">평균 엘릭서 '+cost+' · '+(slot===0?'슬롯 1':'슬롯 2')+' 편집 중</span></div>'+
     '<div style="font-family:Jua,sans-serif;color:#dfe8ff;font-size:14px;margin-top:8px">전투 덱 '+deck.length+'/8 — 카드를 누르면 빠짐</div>'+
     '<div style="display:flex;flex-wrap:wrap;justify-content:center;max-width:560px">'+deck.map(k=>
       '<div class="dk" data-rm="'+k+'"><div class="dke">'+(ART[k]?'<img class="art" style="width:34px" src="'+ART[k]+'">':CARDS[k].emoji)+'</div><div class="dkn">'+CARDS[k].name+'</div><div class="dkc">'+CARDS[k].cost+'</div></div>').join('')+'</div>'+
     '<div style="font-family:Jua,sans-serif;color:#9fb3dd;font-size:13px;margin-top:10px">보유 카드 풀 — 카드를 누르면 추가(8장이면 마지막 카드와 교체)</div>'+
     '<div style="display:flex;flex-wrap:wrap;justify-content:center;max-width:560px">'+Object.keys(CARDS).filter(k=>!deck.includes(k)).map(k=>
       '<div class="dk" data-add="'+k+'"><div class="dke">'+(ART[k]?'<img class="art" style="width:34px" src="'+ART[k]+'">':CARDS[k].emoji)+'</div><div class="dkn">'+CARDS[k].name+'</div><div class="dkc">'+CARDS[k].cost+'</div></div>').join('')+'</div>'+
     '<div style="margin:14px;display:flex;gap:10px">'+
      '<button id="dk-save" class="dk-act">이 슬롯에 저장</button>'+
      '<button id="dk-close" class="dk-sub">닫기</button></div>';
    ov.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{ slot=parseInt(b.dataset.slot,10); deck=(loadDeckSlot(slot)||DECK.slice(0,8)).slice(); render(); });
    ov.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{ deck=deck.filter(k=>k!==b.dataset.rm); render(); });
    ov.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{ if(deck.includes(b.dataset.add)) return;
      if(deck.length>=8) deck.shift(); deck.push(b.dataset.add); render(); });
    ov.querySelector('#dk-close').onclick=()=>{ ov.remove(); style.remove(); };
    ov.querySelector('#dk-save').onclick=()=>{ if(deck.length!==8) return;
      try{ localStorage.setItem(DECK_SLOTS[slot],JSON.stringify(deck)); localStorage.setItem('ra_deck_active',String(slot)); }catch(e){}
      sfx('crown'); toast('덱 슬롯 '+(slot+1)+'에 저장했어요'); ov.remove(); style.remove(); };
  }
  render(); document.body.appendChild(ov);
}
try{ (function(){ const __db=document.createElement('button'); __db.id='btn-deck';
  __db.textContent='🃏 덱 편성';
  __db.style.marginTop='12px';
  __db.onclick=function(){ ensureAudio(); openDeckEditor(); };
  const __ac=document.getElementById('title-actions'); const __st=document.getElementById('screen-title'); if(__ac) __ac.appendChild(__db); else if(__st) __st.appendChild(__db); })(); }catch(e){}

/* ---------- 타워 생성 (REA 설계도 §2) ---------- */
function mkTower(team,kind,x,y){
  const st= kind==='king' ? {hp:2600,dmg:60,hs:1.0,range:7.0,r:1.6} : {hp:1400,dmg:55,hs:0.8,range:7.5,r:1.3};
  return {isTower:true, kind, team, x, y, hp:st.hp, maxHp:st.hp, dmg:st.dmg, hs:st.hs, range:st.range, r:st.r, cd:0, dead:false, active:kind!=='king'};
}
function spawnBossNow(){ if(S.bossSpawned||S.over) return; S.bossSpawned=true;
    const kt=towers.find(t=>t.team==='blue'&&t.kind==='king'&&!t.dead);
    if(kt){ const BU={key:'boss',team:'red',x:9,y:3.2,c:BOSS_STATS,hp:BOSS_STATS.hp,maxHp:BOSS_STATS.hp,shield:900,cd:1.2,dir:Math.PI/2,dead:false,swing:0,bob:1,spawnFx:0.45,doom:0,chargeT:0};
      BU.target=kt; units.push(BU); S.boss=BU; ensureKsBtn(); banner('💀 부활한 왕이 강림했다!',2200); sfx('boomL'); } }   /* v192: 보스 강림(최상위 — 타워 파괴·타이머 폴백 공용) */

function buildTowers(){
  towers=[
    mkTower('blue','king',9,29.6), mkTower('blue','princess',3.5,25.5), mkTower('blue','princess',14.5,25.5),
    mkTower('red','king',9,2.4),   mkTower('red','princess',3.5,6.5),   mkTower('red','princess',14.5,6.5)
  ];
}

/* ---------- 유닛 생성 ---------- */
function formation(n){
  if(n===1) return [[0,0]];
  if(n===2) return [[-0.45,0],[0.45,0]];
  if(n===3) return [[0,-0.5],[-0.55,0.35],[0.55,0.35]];
  const out=[];
  for(let i=0;i<n;i++) out.push([-0.6+(i%3)*0.6, -0.45+Math.floor(i/3)*0.6]);
  return out;
}
function spawnCard(key,team,x,y){ try{ tutOnSpawn(key,team); }catch(e){}   /* v147 */ try{ if(team==='blue') DPSW.cnt[key]=(DPSW.cnt[key]||0)+1; }catch(e){}   /* v148: 배치수 */
  const c=CARDS[key];
  if(c.kind==='spell'){ castSpell(key,team,x,y); return; }
  try{ if(team==='blue'){ S.__used=S.__used||{}; S.__used[key]=1; } }catch(__e){}   /* v185: 사용 카드 추적(전투 후 XP) */
  var __cL=1; try{ __cL=(team==='blue')?__cLv(key):1; }catch(__e){}   /* v185: 카드 레벨 시스템 */
  var __m=1+0.04*(__cL-1);
  const cc=(__m>1)?Object.assign({},c,{hp:Math.round(c.hp*__m),dmg:Math.round((c.dmg||0)*__m)}):c;   /* CARDS 원본 보존 — 유닛별 클론 */
  for(const o of formation(c.count||1)){
    let ux=clamp(x+o[0],0.7,COLS-0.7), uy=clamp(y+o[1],0.7,ROWS-0.7);
    if(!c.flying && uy>RIVER_Y0-0.2 && uy<RIVER_Y1+0.2) uy = team==='blue'? RIVER_Y1+0.25 : RIVER_Y0-0.25;
    units.push({id:uid++, key, team, c:cc, r:cc.r, x:ux, y:uy, hp:cc.hp, maxHp:cc.hp, cd:0.35, swing:0, bob:Math.random()*6.28,
                target:null, spawnFx:0.45, building:c.kind==='building', life:c.life||0, dead:false,
                stun:0, slowT:0, frozenT:0, chargeT:0, charging:false, dir:team==='blue'?-Math.PI/2:Math.PI/2});
  }
  fx.push({x,y,t:0,dur:0.45,kind:'pillar',col:team==='blue'?'#9cc4ff':'#ff9d9d'});
  fx.push({x,y,t:0,dur:0.5,kind:'ring',col:team==='blue'?'#7fb0ff':'#ff9d9d'});
  addParts(x,y,8,team==='blue'?'#9cc4ff':'#ff9d9d',2.4,0.4,-30);
}
/* ---------- 타겟팅 규칙 (REA 설계도 §4) ---------- */
const enemyOf=t=>t==='blue'?'red':'blue';
function allEnemies(team){
  const et=enemyOf(team), list=[];
  for(const u of units) if(!u.dead&&u.team===et) list.push(u);
  for(const t of towers) if(!t.dead&&t.team===et) list.push(t);
  return list;
}
function acquire(u){
  const et=enemyOf(u.team);
  if(u.building){ // 캐논: 사거리 내 지상 유닛만
    let best=null,bd=1e9;
    for(const e of units){ if(e.dead||e.team!==et||e.c.flying) continue;
      const d=dist(u,e); if(d<=u.c.range+0.3&&d<bd){bd=d;best=e;} }
    return best;
  }
  let best=null,bd=1e9;
  for(const e of allEnemies(u.team)){
    if(u.c.targets==='buildings'&&!(e.isTower||e.building)) continue;   // 자이언트: 건물만
    if(!e.isTower&&e.c.flying&&!u.c.hitsAir) continue;                  // 대공 불가 유닛 처리
    const d=dist(u,e)+(e.isTower?4:0);                                  // 유닛 우선 타격
    if(d<bd){bd=d;best=e;}
  }
  if(!best){ for(const t of towers){ if(t.dead||t.team!==et) continue;
    const d=dist(u,t); if(d<bd){bd=d;best=t;} } }
  return best;
}
function nearestUnitInRange(u,range){
  const et=enemyOf(u.team); let best=null,bd=1e9;
  for(const e of units){ if(e.dead||e.team!==et) continue;
    if(e.c.flying&&(u.building||!u.c.hitsAir)) continue;
    const d=dist(u,e); if(d<=range&&d<bd){bd=d;best=e;} }
  return best;
}

/* ---------- 이동 & 다리 우회 (REA 설계도 §3) ---------- */
function moveUnit(u,dt){
  const tx=u.target.x, ty=u.target.y;
  let gx=tx, gy=ty;
  const crossing=(u.y<RIVER_MID)!==(ty<RIVER_MID);
  if(!u.c.flying&&crossing){
    const bx=Math.abs(u.x-BRIDGES[0])<Math.abs(u.x-BRIDGES[1])?BRIDGES[0]:BRIDGES[1];
    if(Math.abs(u.x-bx)<0.55){ gx=bx; gy=ty; }
    else { gx=bx; gy=u.y<RIVER_MID? RIVER_Y0-0.7 : RIVER_Y1+0.7; }
  }
  const a=Math.atan2(gy-u.y,gx-u.x); u.dir=a;
  const sp=u.c.spd*(u.charging?1.7:1)*(u.slowT>0?0.55:1);
  let nx=u.x+Math.cos(a)*sp*dt, ny=u.y+Math.sin(a)*sp*dt;
  if(!u.c.flying&&ny>RIVER_Y0-0.25&&ny<RIVER_Y1+0.25){
    const onB=BRIDGES.some(b=>Math.abs(nx-b)<0.75);
    if(!onB){
      const bx=Math.abs(u.x-BRIDGES[0])<Math.abs(u.x-BRIDGES[1])?BRIDGES[0]:BRIDGES[1];
      nx=u.x+Math.sign(bx-u.x||1)*sp*dt; ny=u.y;
    }
  }
  u.x=clamp(nx,0.6,COLS-0.6); u.y=clamp(ny,0.6,ROWS-0.6);
  if(!u.c.flying&&u.y>RIVER_Y0-1.2&&u.y<RIVER_Y1+1.2){
    u._stk=(u._stk||0)+dt; if(u._lx===undefined) u._lx=u.x;
    if(Math.abs(u.x-u._lx)>0.15){ u._stk=0; u._lx=u.x; }
    else if(u._stk>1.2){ const bb=Math.abs(u.x-BRIDGES[0])<Math.abs(u.x-BRIDGES[1])?BRIDGES[0]:BRIDGES[1]; u.x+=(bb>u.x?1:-1)*0.3; u._stk=0; }
  } else { u._stk=0; u._lx=undefined; }
}

/* ---------- 전투 ---------- */

/* ---------- v53: 유닛별 투사체 그래픽·사운드 ---------- */
const UMOT={_def:{},babyd:{flut:1},minions:{flut:1},cleric:{halo:1},boar:{dust:1},giant:{dust:1},valk:{dust:1},knight:{dust:1},skarmy:{dust:1}};
const TRAIL={kingshot:'rgba(255,215,94,.9)',arrow:'rgba(232,226,200,.9)',bullet:'#ffe9a8',bomb:'#ffcf7a',wizfb:'#ffb14d',dragon:'#ff9d3c',ice:'#9cdcff',cannon:'#cfd6e0'};
const PROJ_SFX_LAUNCH={arrow:'bow',bullet:'musket',wizfb:'firel',dragon:'firel',bomb:'toss',ice:'icel',cannon:'cannon'};
function impactProj(p,tgt){
  if(p.kind==='kingshot'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.35,kind:'flash'}); fx.push({x:p.tx,y:p.ty,t:0,dur:0.5,kind:'ring',col:'rgba(255,215,94,.95)'}); addParts(p.tx,p.ty,14,'#ffe08a',3,0.5,40); sfx('boomL');
    const bs=S.boss;
    if(bs&&!bs.dead&&Math.hypot(bs.x-p.tx,bs.y-p.ty)<=1.3){ bs.doom=0; bs.stun=3; bs.shield=(bs.shield||0)*0.4; dealDamage(bs,250,'blue'); banner('🎯 킹샷 명중! 파멸기 캔슬 · 그로기 3s',1700); }
    return; }
  if(p.kind==='bullet'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.16,kind:'hit'}); addParts(p.tx,p.ty,3,'#ffe9a8',2.2,0.25,0); sfx('spark'); }
  else if(p.kind==='arrow'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.16,kind:'hit'}); sfx('thud'); }
  else if(p.kind==='bomb'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.4,kind:'boom'}); addParts(p.tx,p.ty,10,'#ffcf7a',2.8,0.5,50); S.shake=Math.max(S.shake||0,0.18); sfx('boom'); }
  else if(p.kind==='wizfb'||p.kind==='dragon'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.18,kind:'flash'}); addParts(p.tx,p.ty,7,'#ffb14d',2.4,0.4,30); sfx('fwhit');
    if(tgt&&!tgt.dead&&!tgt.isTower){ tgt.burnT=3; tgt.burnDps=22; tgt.burnAcc=0; } }
  else if(p.kind==='ice'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.3,kind:'ring',col:'rgba(156,220,255,.85)'}); addParts(p.tx,p.ty,8,'#9cdcff',2.6,0.45,40); sfx('icehit'); }
  else if(p.kind==='cannon'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.3,kind:'boom'}); addParts(p.tx,p.ty,6,'#cfd6e0',2.2,0.4,40); S.shake=Math.max(S.shake||0,0.12); sfx('boomL'); }
  else { fx.push({x:p.tx,y:p.ty,t:0,dur:0.16,kind:'hit'}); }
}
function shoot(src,tgt,dmg,kind,splash){
  kind=kind||'arrow';
  const d0=Math.hypot(tgt.x-src.x,tgt.y-src.y);
  const v=kind==='bullet'?2.75:(kind==='bomb'?1.45:2.25);
  try{ fx.push({x:src.x,y:src.y,t:0,dur:0.16,kind:'ring',col:'rgba(255,213,84,.9)'}); }catch(e){ }   /* v192 P14: 머즐 플래시 */
  projs.push({x:src.x, y:src.y-(src.isTower?0.8:0.3), target:tgt, tx:tgt.x, ty:tgt.y,
              spd:v, dmg, team:src.team, kind, splash:splash||0, slow:src.c?src.c.slow:0, fromTower:!!src.isTower,
              arc:(kind==='bomb'||kind==='cannon'), t:0, dur:Math.max(0.12,d0/v)});
  if(!src.isTower){
    var __ma=Math.atan2(tgt.y-src.y,tgt.x-src.x); 
    src.recoilT=0.14; src.recoilA=__ma;
    if(kind!=='arrow'&&kind!=='ice') fx.push({x:src.x+Math.cos(__ma)*0.5,y:src.y-0.3+Math.sin(__ma)*0.5,t:0,dur:0.12,kind:'muzzle',a:__ma});
    if(kind==='cannon') addParts(src.x+Math.cos(__ma)*0.5,src.y-0.5+Math.sin(__ma)*0.5,3,'#ffcf7a',2.0,0.3,-30);
    else if(kind==='bullet'||kind==='arrow') addParts(src.x+Math.cos(__ma)*0.5,src.y-0.3+Math.sin(__ma)*0.5,2,'#cfd6e0',1.0,0.35,-12);
  }
  sfx(PROJ_SFX_LAUNCH[kind]||'shoot');
}
function unitAtkFx(u,t){   // v135: 유닛별 컨셉 공격 이펙트(디펜스히어로즈식 타격 VFX) — 근접 강화·원거리 발동 액센트
  try{
    const k=u.key, tx=t.x, ty=t.y, melee=u.c.range<=1.6;
    if(k==='knight'&&melee){ fx.push({x:tx,y:ty,t:0,dur:0.24,kind:'ring',col:'rgba(223,232,255,.8)'}); addParts(tx,ty,4,'#dfe8ff',2.2,0.3,30); }
    else if(k==='giant'&&melee){ S.shake=Math.max(S.shake||0,0.10); fx.push({x:tx,y:ty,t:0,dur:0.35,kind:'ring',col:'rgba(217,185,138,.75)'}); addParts(tx,ty,7,'#d9b98a',2.6,0.5,60); }
    else if(k==='minions'&&melee){ addParts(tx,ty,4,'#b388ff',2.2,0.35,40); }
    else if(k==='skarmy'&&melee){ addParts(tx,ty,3,'#eceff1',1.8,0.3,50); }
    else if(k==='prince'&&melee){ fx.push({x:tx,y:ty,t:0,dur:0.3,kind:'ring',col:'rgba(255,213,79,.9)'}); addParts(tx,ty,6,'#ffd54f',2.8,0.45,40); if(u.charging) S.shake=Math.max(S.shake||0,0.08); }
    else if(k==='valk'&&melee){ fx.push({x:tx,y:ty,t:0,dur:0.3,kind:'ring',col:'rgba(255,183,77,.85)'}); fx.push({x:tx,y:ty,t:0.08,dur:0.3,kind:'ring',col:'rgba(255,224,138,.7)'}); addParts(tx,ty,5,'#ffb74d',2.4,0.4,40); }
    else if(k==='boar'&&melee){ addParts(tx,ty,6,'#e0c9a6',2.4,0.4,50); S.shake=Math.max(S.shake||0,0.05); }
    else if(k==='musketeer'&&!melee){ addParts(u.x,u.y-0.3,2,'#ffe9a8',1.6,0.2,-10); }
    else if(k==='sniper'&&!melee){ fx.push({x:u.x,y:u.y-0.3,t:0,dur:0.12,kind:'flash'}); addParts(u.x,u.y-0.3,3,'#9cdcff',1.8,0.25,0); }
    else if(k==='wizard'&&!melee){ fx.push({x:u.x,y:u.y-0.3,t:0,dur:0.15,kind:'ring',col:'rgba(255,177,77,.8)'}); }
    else if(k==='babyd'&&!melee){ addParts(u.x,u.y-0.35,3,'#ff9d3c',1.8,0.3,-10); }
    else if(k==='icem'&&!melee){ fx.push({x:u.x,y:u.y-0.3,t:0,dur:0.2,kind:'ring',col:'rgba(156,220,255,.8)'}); }
    else if(k==='cleric'){ fx.push({x:u.x,y:u.y-0.3,t:0,dur:0.3,kind:'ring',col:'rgba(125,255,168,.7)'}); }
  }catch(e){}
}
function hitTarget(u,t,dm){ try{ if(u&&u.team==='blue'&&u.key) DPSW.acc[u.key]=(DPSW.acc[u.key]||0)+dm; }catch(e){}   /* v148: 피해 귀속 */
  dm=dm||u.c.dmg; unitAtkFx(u,t);
  if(u.c.range>1.6){ const __pk=(u.key==='musketeer'||u.key==='sniper')?'bullet':(u.key==='wizard'?'wizfb':(u.key==='bomber'?'bomb':(u.key==='babyd'?'dragon':(u.key==='icem'?'ice':'arrow')))); shoot(u,t,dm,__pk,u.c.splash); }
  else { dealDamage(t,dm,u.team); fx.push({x:t.x,y:t.y,t:0,dur:0.18,kind:'hit'}); fx.push({x:t.x,y:t.y,t:0,dur:0.16,kind:'slash',a:Math.atan2(t.y-u.y,t.x-u.x),col:u.team==='blue'?'rgba(159,201,255,.95)':'rgba(255,150,150,.95)'}); addParts(t.x,t.y,3,'#fff2c8',2.0,0.25,0); sfx('hit');
    if(u.c.splash){ for(const s2 of units){ if(s2.dead||s2.team===u.team||s2===t) continue;
      if(Math.hypot(s2.x-t.x,s2.y-t.y)<=u.c.splash) dealDamage(s2,Math.round(dm*0.6),u.team); } } }
}
function updateUnit(u,dt){
  if(!isFinite(u.x)||!isFinite(u.y)){ u.x=9; u.y=u.team==='blue'?20:12; }
  if(!isFinite(u.cd)) u.cd=0.1;
  if(u.spawnFx>0){ u.spawnFx-=dt; return; }
  if(u.comboCd>0) u.comboCd-=dt;
  if(u.burnT>0){ u.burnT-=dt; u.burnAcc+=dt;
    if(Math.random()<0.25) addParts(u.x,u.y-0.3,1,'#ff9d3c',0.8,0.3,-30);
    if(u.burnAcc>=0.5){ const __bd=Math.round(u.burnDps*u.burnAcc); u.burnAcc=0; u.hp-=__bd; u.hurt=0.06;
      floats.push({x:u.x+(Math.random()-0.5)*0.5,y:u.y-0.9,txt:__bd,t:0.55,col:'#ff9d3c',big:false});
      if(u.hp<=0){ u.hp=0; u.dead=true; killUnit(u,false); return; } } }
  if(u.slowT>0) u.slowT-=dt;
  if(u.stun>0){ u.stun-=dt; u.swing=0; return; }
  if(u.frozenT>0){ u.frozenT-=dt; u.swing=0; return; }   /* v138: 빙결 — 이동·공격 불가, 콤보 원소 1로 계수 */
  if(u.building){ // 캐논(건물): 고정, 수명 있음
    u.life-=dt; if(u.life<=0){ killUnit(u,true); return; }
    u.cd-=dt; u.swing=Math.max(0,u.swing-dt);
    if(!u.target||u.target.dead){ u.target=null; let nbd=1e9;
      for(const e2 of units){ if(e2.dead||e2.team===u.team||e2.c.flying) continue;
        const nd=Math.hypot(e2.x-u.x,e2.y-u.y); if(nd<=u.c.range+0.3&&nd<nbd){ nbd=nd; u.target=e2; } } }
    if(u.target&&!u.target.dead&&u.cd<=0){ u.cd=u.c.hs; u.swing=0.3;
      shoot(u,u.target,u.c.dmg,'cannon',u.c.splash); }
    return;
  }
  if(u.c.heal){ u.cd-=dt;
    if(u.cd<=0){ u.cd=1.4; let healed=false;
      for(const a2 of units){ if(a2.dead||a2.team!==u.team||a2.hp>=a2.maxHp) continue;
        if(Math.hypot(a2.x-u.x,a2.y-u.y)<=2.5){ a2.hp=Math.min(a2.maxHp,a2.hp+u.c.heal); healed=true;
          floats.push({x:a2.x,y:a2.y-0.8,txt:'+'+u.c.heal,t:0.7,col:'#7dffa8',big:false});
          fx.push({x:a2.x,y:a2.y,t:0,dur:0.4,kind:'ring',col:'rgba(125,255,168,.8)'}); addParts(a2.x,a2.y,3,'#7dffa8',1.2,0.5,-20); } }
      if(healed) sfx('deploy'); }
    return; }
  if(!u.target||u.target.dead) u.target=acquire(u);
  if(!u.target) return;
  if(u.target.isTower&&u.c.targets!=='buildings'){ // 타워 행군 중 근접 적 우회 전환
    const near=nearestUnitInRange(u,3.5); if(near) u.target=near;
  }
  const d=dist(u,u.target);
  if(d<=u.c.range+(u.target.r||((u.target.c&&u.target.c.r)||0.5))){
    u.cd-=dt;
    if(u.cd<=0){ u.cd=u.c.hs; u.swing=(u.c.range>1.6?0.3:0.45); u._swd=u.swing;
      hitTarget(u,u.target, u.charging? u.c.dmg*2 : u.c.dmg);
      u.chargeT=0; u.charging=false; }
  } else {
    if(u.c.charge){ u.chargeT+=dt; u.charging=u.chargeT>1.1;
      if(u.charging&&Math.random()<0.35) addParts(u.x,u.y-0.3,1,'#ff9d3c',0.9,0.3,-20); }
    moveUnit(u,dt);
  }
  u.swing=Math.max(0,u.swing-dt);
}
function updateTower(t,dt){
  if(t.kind==='king'&&!t.active) return;
  t.cd-=dt; if(t.cd>0) return;
  const et=enemyOf(t.team);
  let best=t.target&&!t.target.dead&&dist(t,t.target)<=t.range*1.15?t.target:null; // 타겟 기억
  if(!best){ let bd=1e9;
    for(const u of units){ if(u.dead||u.team!==et||u.spawnFx>0.3) continue;
      const d=dist(t,u); if(d<=t.range&&d<bd){bd=d;best=u;} } }
  if(best){ t.target=best; t.cd=t.hs; shoot(t,best,t.dmg,'cannon'); muzzleStar(t,best);   /* v136 P14: 타워 포구 스타 버스트 머즐 플래시 */ }
  else t.target=null;
}

/* ---------- 투사체 & 파이어볼 ---------- */
function muzzleStar(t,tg){   // v136 P14: 타워 포구 스타 버스트 머즐 플래시(§5 파이프라인 4)
  try{ const a=Math.atan2(tg.y-t.y,tg.x-t.x), bx=t.x+Math.cos(a)*0.85, by=t.y+Math.sin(a)*0.85;
    fx.push({x:bx,y:by,t:0,dur:0.18,kind:'stmuz',a:a,rot:Math.random()*1.2});
    addParts(bx,by,3,'#ffe08a',2.0,0.25,0); }catch(e){}
}
function updateProjs(dt){
  for(const p of projs){
    if(p.kind==='fireball'){
      p.t+=dt/p.T; const k=Math.min(1,p.t);
      p.x=lerp(p.x0,p.x1,k); p.y=lerp(p.y0,p.y1,k);
      if(Math.random()<0.6) addParts(p.x,p.y,1,'#ffb14d',0.7,0.3,0);
      if(k>=1){ p.done=true; explodeFireball(p); }
      continue;
    }
    const tgt=p.target;
    if(tgt&&!tgt.dead){ p.tx=tgt.x; p.ty=tgt.y-((tgt.c&&tgt.c.flying)?0.5:0.2); }
    const dx=p.tx-p.x, dy=p.ty-p.y, d=Math.hypot(dx,dy), step=p.spd*dt;
    if(d<=step+0.05){ p.done=true;
      impactProj(p,tgt);
      if(tgt&&!tgt.dead) dealDamage(tgt,p.dmg,p.team);
      if(p.splash){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.3,kind:'ring',col:'#ffb14d'});
        for(const s2 of units){ if(s2.dead||s2.team===p.team||s2===tgt) continue;
          if(Math.hypot(s2.x-p.tx,s2.y-p.ty)<=p.splash) dealDamage(s2,Math.round(p.dmg*0.7),p.team); }
      if(p.slow){ for(const s2 of units){ if(s2.dead||s2.team===p.team) continue;
        if(Math.hypot(s2.x-p.tx,s2.y-p.ty)<=p.splash) s2.slowT=p.slow; }
        if(tgt&&!tgt.dead&&Math.random()<0.25){ tgt.frozenT=1.2; fx.push({x:tgt.x,y:tgt.y,t:0,dur:0.5,kind:'ring',col:'rgba(180,235,255,.9)'}); addParts(tgt.x,tgt.y,5,'#b4ebff',2.0,0.4,-40); }   /* v138: 빙결 확정 부여(직격 25%) */ } } }
    else { p.x+=dx/d*step; p.y+=dy/d*step;
      if(p.dur) p.t+=dt;
      if(Math.random()<0.5) addParts(p.x,p.y,1,p.team==='blue'?'rgba(120,180,255,.9)':'rgba(255,140,140,.9)',0.4,0.22,0); }
  }
  projs=projs.filter(p=>!p.done);
}
function castSpellBase(key,team,x,y){ if(S.spells) S.spells[team]=(S.spells[team]||0)+1;   // v99 P8: 주문 사용 집계
  if(key==='zap') castZap(team,x,y); else castFireball(team,x,y);
}
function castZap(team,x,y){
  const c=CARDS.zap, et=enemyOf(team);
  fx.push({x,y,t:0,dur:0.4,kind:'zap'}); fx.push({x,y,t:0,dur:0.4,kind:'zapx'}); S.shake=0.3; S.spellQuiet=2.6; sfx('zap');   // v118: 자패 진정 기간
  fx.push({x,y,t:0,dur:0.3,kind:'flash'});
  addParts(x,y,14,'#ffe95e',3.6,0.45,50);
  for(const u of units){ if(u.dead||u.team!==et) continue;
    if(Math.hypot(u.x-x,u.y-y)<=c.radius){ u.stun=c.stun; dealDamage(u,spellDmg(c.dmg),team,true); } }
  var __ch=null,__chd=1e9;
  for(const u2 of units){ if(u2.dead||u2.team!==et||u2.stun>0) continue; var __d2=Math.hypot(u2.x-x,u2.y-y); if(__d2>c.radius&&__d2<=c.radius+2.2&&__d2<__chd){ __chd=__d2; __ch=u2; } }
  if(__ch){ __ch.stun=c.stun*0.8; dealDamage(__ch,Math.round(spellDmg(c.dmg)*0.4),team,true); fx.push({x:x,y:y,tx:__ch.x,ty:__ch.y,t:0,dur:0.22,kind:'bolt'}); addParts(__ch.x,__ch.y,6,'#ffe95e',2.4,0.3,30); }   /* v138: 전기 연쇄 번개 — 반경 밖 최근접 1기 */
  for(const t of towers){ if(t.dead||t.team!==et) continue;
    if(Math.hypot(t.x-x,t.y-y)<=c.radius+0.4) dealDamage(t,spellDmg(c.towerDmg),team); }
}
function castFireball(team,x,y){
  const kt=towers.find(t=>t.team===team&&t.kind==='king'&&!t.dead)||{x:9,y:team==='blue'?29:3};
  const d=Math.hypot(x-kt.x,y-kt.y);
  { const x1c=clamp(x,0.4,COLS-0.4), y1c=clamp(y,0.4,ROWS-0.4), T0=Math.max(0.5,d/9);
    projs.push({kind:'fireball',team,x0:kt.x,y0:kt.y,x1:x1c,y1:y1c,x:kt.x,y:kt.y,t:0,T:T0});
    fx.push({x:x1c,y:y1c,t:0,dur:T0+0.2,kind:'warnring'});S.spellQuiet=T0+2.6; }   // v118: 파이어볼 진정 기간 — 비행·여진 동안 신규 줌인 억제(일반 전투 피해 포함)
  sfx('cast');
}
function explodeFireball(p){
  const c=CARDS.fireball, et=enemyOf(p.team);
  fx.push({x:p.x1,y:p.y1,t:0,dur:0.7,kind:'boom'}); S.shake=0.5; sfx('boom');
  addParts(p.x1,p.y1,22,'#ffb14d',3.4,0.6,60);
  fx.push({x:p.x1,y:p.y1,t:0,dur:0.3,kind:'flash'});
  fx.push({x:p.x1,y:p.y1,t:0,dur:0.5,kind:'ring',col:'rgba(255,177,77,.9)'});
  fx.push({x:p.x1,y:p.y1,t:0,dur:0.2,kind:'flash'});
  for(const u3 of units){ if(u3.dead||u3.team!==et) continue; if(Math.hypot(u3.x-p.x1,u3.y-p.y1)<=c.radius){ u3.burnT=Math.max(u3.burnT||0,2); u3.burnDps=18; u3.burnAcc=0; } }   /* v138: 지속 화염 — 폭발 지점 적 2초 도트 */
  for(const u of units){ if(u.dead||u.team!==et) continue;
    if(Math.hypot(u.x-p.x1,u.y-p.y1)<=c.radius) dealDamage(u,spellDmg(c.dmg),p.team,true); }
  for(const t of towers){ if(t.dead||t.team!==et) continue;
    if(Math.hypot(t.x-p.x1,t.y-p.y1)<=c.radius+0.5) dealDamage(t,spellDmg(c.towerDmg),p.team); }
}

/* ---------- 피해 / 파괴 / 승패 (REA 설계도 §2·§6) ---------- */
function dealDamage(e,dmg,fromTeam,fromSpell){
  try{ if(e&&!e.isTower) tutCombat(); }catch(e2){}   /* v147: 첫 교전 관전 훅 */
   // v114: fromSpell — 주문(파이어볼·자패) 피해는 줌인 유발 없음, 일반 유닛 교전만 줌인
  if(S&&S.relic==='relic_atk'&&fromTeam==='blue'&&e&&e.team==='red'&&!e.isTower) dmg=Math.round(dmg*1.1);   // v109 #13: 유물 — 전투 문장
  if(fromTeam==='blue'&&e&&e.team==='red'&&!e.isTower&&fromSpell!==true) dmg=Math.round(dmg*(1+0.08*((S._sk&&S._sk.off1)||0)+0.06*((S._sk&&S._sk.off2)||0)+0.12*((S._sk&&S._sk.off3)||0)));   // v119: 스킬트리 공세 계통 — 일반 유닛 공격만(주문 제외)
  if(e.dead) return;
  var __st=((e.burnT>0)?1:0)+((e.slowT>0)?1:0)+((e.stun>0)?1:0)+((e.frozenT>0)?1:0);
  var __mult=__st>=3?2:(__st===2?1.4:1);
  dmg=Math.round(dmg*__mult);
  if(__st>=2&&!(e.comboCd>0)){
    e.comboCd=1.2;
    floats.push({x:e.x,y:e.y-(e.r||0.45)-1.1,txt:__st>=3?'3원소 콤보 ×2!':'2원소 콤보 +40%',t:0.8,col:__st>=3?'#ff9d3c':'#ffe95e',big:true});
    fx.push({x:e.x,y:e.y,t:0,dur:0.35,kind:'ring',col:__st>=3?'rgba(255,157,60,.9)':'rgba(255,233,94,.9)'});
  }
  if((e.shield||0)>0){ const ab=Math.min(e.shield,dmg); e.shield-=ab; dmg-=ab; }
  e.hp-=dmg; e.hurt=0.09;
  if(!(e===S.boss)&&!(e.isTower)&&fromSpell!==true&&!(S.focusGap>0)&&!(S.spellQuiet>0)&&S.cam){ if(S.focus){ if((S._now>=(S._rTg||0))&&Math.hypot(e.x*TILE-S.focus.x,e.y*TILE-S.focus.y)>2.5*TILE){ raFocus(e.x*TILE,e.y*TILE,1.9,e,true); S._rTg=S._now+0.8; } }   /* v178: 줌 중 신규 교전 → 줌 이동(0.8s 스로틀·2.5타일 이상) */
  else if(S.cam.z<=1.05&&!(S._zSpot&&S._now<S._zSpot.exp&&Math.abs(e.x*TILE-S._zSpot.x)<3*TILE&&Math.abs(e.y*TILE-S._zSpot.y)<3*TILE)){ raFocus(e.x*TILE,e.y*TILE,1.9,e); } }   /* v175 P2: 감시견 해제 지점 동일교전 재점화 억제(6s) */   // v113 완전복귀 게이트 + v114 주문 피해 제외   // v113: 카메라가 1배로 완전 복귀한 뒤에만 신규 줌인 허용 — 줌인·복귀 중 화염병 등 추가 피해로 재점화되는 것 차단   // v112: 타워 피격은 줌인 유발하지 않음 — 유닛 교전만(왕관 파괴 강제 줌인은 유지)   // v111: 신 포커스 시스템 — 단일 생성자 경유(좌표 즉시 확정)   // v91: 줌 펄스 쿨다운 — 지속 교전 중 1.6배 고정 방지
  const big=dmg>=150;
  floats.push({x:e.x+(Math.random()-0.5)*0.7,y:e.y-(e.r||0.45)-0.35-Math.random()*0.5,txt:Math.round(dmg)+(big?'!':''),t:big?0.9:0.7,col:big?'#ff9d3c':(fromTeam==='blue'?'#bfe0ff':'#ffd2d2'),big});
  if(e.isTower&&e.kind==='king') e.active=true;   // 킹타워 피격 시 각성
  if(e.hp<=0){ e.hp=0; e.dead=true;
    if(fromTeam&&S.kills&&!e.isTower) S.kills[fromTeam]++;
    if(!e.isTower&&S.deaths&&e.team) S.deaths[e.team]=(S.deaths[e.team]||0)+1;   // v99 P8: 데스 집계
    if(e.isTower) destroyTower(e,fromTeam); else killUnit(e,false); }
}
function killUnit(u,expire){
  u.dead=true;
  fx.push({x:u.x,y:u.y,t:0,dur:0.4,kind:'poof'});
  if(DIESPR[u.key]) fx.push({x:u.x,y:u.y,t:0,dur:0.55,kind:'die',key:u.key,team:u.team});
  addParts(u.x,u.y,u.maxHp>=900?16:7,u.maxHp>=900?'#ffe08a':'#cfd6e0',u.maxHp>=900?3:2.2,0.5,-40);
  if(!expire&&u.maxHp>=900){ S.slow=0.45; S.clash={x:u.x,y:u.y,a:1}; }  // 대형 킬 하이라이트
  if(!expire) sfx('hit');
}
function destroyTower(t,fromTeam){
  fx.push({x:t.x,y:t.y,t:0,dur:0.9,kind:'boom'});
  S.shake=0.8; S.slow=0.6; S.clash={x:t.x,y:t.y,a:1};  // 타워 파괴 클로즈업
  sfx('boom');
  addParts(t.x,t.y,24,'#d8dee8',3.6,0.9,90);
  if(fromTeam) fx.push({x:t.x,y:t.y,tx:9*TILE,ty:fromTeam==='blue'?H+30:-30,t:0,dur:0.95,kind:'crownfly'});
  const kt=towers.find(k=>k.team===t.team&&k.kind==='king'); if(kt) kt.active=true;
  if(!fromTeam) return;
  if(t.kind==='king'){
    S.crowns[fromTeam]=3;
    banner(fromTeam==='blue'?'킹타워 파괴! 👑👑👑':'킹타워가 무너졌어요…');
    finish(fromTeam);
  } else {
    S.crowns[fromTeam]++; try{ tutCrown(fromTeam); }catch(e){}   /* v147 */
    if(fromTeam==='blue'&&!S.bossSpawned&&!S.over){ spawnBossNow(); }   /* v192: 첫 적군 타워 파괴 즉시 강림 */
    banner(fromTeam==='blue'?'타워 파괴! 왕관 획득 👑':'아군 타워가 파괴됐어요…');
    S.slow=3.0;   // v116: 타워 파괴 줌인 삭제(사용자 지정) — 슬로모·왕관 연출은 유지   // v113: 이미 줌인 중이면 강제 대체하지 않음(슬로모는 유지)   // v102 #9 슬로모 + v111: 강제 포커스(진행 중 포커스 대체)   // v102 #9: 마지막 왕관 순간 3초 슬로모 하이라이트(고정 클로즈업)
    sfx('crown');
    if(typeof showEmote==='function' && Math.random()<0.5) setTimeout(()=>showEmote(fromTeam==='red'?'😂':'😭','red'),700);
    if(S.overtime) finish(fromTeam);   // 서든데스: 왕관 즉시 승부
  }
}
function finish(winner){
  if(S.over) return;
  S.over=true; S.winner=winner; try{ var __xu=S.__used||{}; var __mx=__cXpMap(); Object.keys(__xu).forEach(function(k){ __mx[k]=(__mx[k]||0)+(winner==='blue'?2:1); }); try{ localStorage.setItem('ra_cardxp_v1',JSON.stringify(__mx)); }catch(__e){} }catch(__e){}   /* v185: 전투 결과 카드 XP — 승 +2/패·무 +1 */
    try{ var __st=spState(); var __g=(winner==='blue')?3:1; __st.sp+=__g; __st.total+=__g; spSave(__st); setTimeout(function(){ toast('🎓 전술 SP +'+__g); },900); }catch(e){}   // v119: 승리 보상 SP — 승리 +3·패배 +1, 영구 저장 S.endTimer=1.4; P.sel=null; syncHand();
  if(winner==='blue') sfx('win'); else if(winner==='red') sfx('lose');
  bgmStop();
}
function fwVictory(){   /* v140: 승리 연출 — 결과 패널 위 폭죽 파티클+왕관 낙하(DOM/CSS — 루프 정지와 무관·모바일 저부담, 파티클 예산 26발) */
  var ov=document.getElementById('overlay-result'); if(!ov) return;
  var fc=document.createElement('div'); fc.className='fw-layer';
  var cols=['#FFD54F','#FF9D3C','#7FB0FF','#F87171','#B4EBFF'];
  for(var i=0;i<26;i++){ var s=document.createElement('span'); s.className='fw-p';
    var ang=Math.random()*6.283, d=40+Math.random()*90;
    s.style.setProperty('--dx',(Math.cos(ang)*d).toFixed(0)+'px');
    s.style.setProperty('--dy',(Math.sin(ang)*d-30).toFixed(0)+'px');
    s.style.setProperty('--dd',(0.7+Math.random()*0.9).toFixed(2)+'s');
    s.style.setProperty('--dl',(Math.random()*0.5).toFixed(2)+'s');
    s.style.left=(38+Math.random()*24)+'%'; s.style.top=(30+Math.random()*20)+'%';
    s.style.background=cols[i%cols.length];
    fc.appendChild(s); }
  var cr=document.createElement('div'); cr.className='fw-crown'; cr.textContent='\uD83D\uDC51'; fc.appendChild(cr);
  ov.appendChild(fc); setTimeout(function(){ try{ fc.remove(); }catch(e){} },4200);
}
function showResult(){
  const w=S.winner;
  const crowns=S.crowns.blue, crownR=S.crowns.red;
  const tHp=towers.filter(t=>t.team==='blue'&&!t.dead).reduce((a,t)=>a+t.hp,0);
  const tMax=towers.filter(t=>t.team==='blue').reduce((a,t)=>a+t.maxHp,0)||1;
  const tPct=Math.round(tHp/tMax*100);
  const timeLeft=Math.max(0,Math.round(S.t||0));
  const killsB=(S.kills&&S.kills.blue)||0;
  const score=crowns*300+killsB*15+Math.round(tPct*2)+timeLeft;
  const ranks=[['SSS',1600],['SS',1200],['S',850],['A',550],['B',0]];
  let ri=(w==='blue')?ranks.findIndex(r=>score>=r[1]):4;
  if(ri<0) ri=4;
  $('#r-title').textContent = w==='blue'?'승리!':w==='red'?'패배…':'무승부';
  if(w==='blue'){ try{ fwVictory(); }catch(e){} }   /* v140: 승리 연출 — 폭죽 파티클+왕관 낙하 */
  $('#r-title').style.color = w==='blue'?'#f7c531':w==='red'?'#ff8f8f':'#cfe0ff';
  $('#r-art').src = w==='blue'? RART.win : w==='red'? RART.lose : RART.win;
  $('#r-crowns').textContent = '👑'.repeat(crowns)+' ⚔️ '+'👑'.repeat(crownR);
  $('#r-sub').innerHTML = `최종 왕관 <b>${crowns} : ${crownR}</b>${S.overtime?' · 연장전':''}<br>총점 <b>${score}</b>`;
  $('#rt-crown').textContent=crowns*300;
  $('#rt-kill').textContent=killsB*15;
  $('#rt-kd').textContent=killsB+' / '+((S.deaths&&S.deaths.blue)||0);
  $('#rt-spell').textContent=((S.spells&&S.spells.blue)||0)+'회';
  $('#rt-hp').textContent=tPct*2;
  $('#rt-time').textContent=timeLeft;
  $('#rt-sum').textContent=score;
  try{ hofRecord(score); }catch(e){}
  if(!S._tp){ S._tp=1; try{ var __d=applyTrophyDelta(S.winner); var __te=document.getElementById('rt-trophy'); if(__te){ __te.textContent=(__d>=0?'+':'')+__d; __te.style.color=__d>=0?'#ffe08a':'#ff8f8f'; } }catch(e){} }   // v105 #11: 트로피 증감
  $('#rt-emblem').textContent=['👑SSS','🎖️SS','⚔️S','🛡️A','🔰B'][ri];
  const next=ranks[ri-1];
  $('#rt-barfill').style.width = next? Math.min(100,Math.round(score/next[1]*100))+'%' : '100%';
  $('#rt-brief').textContent = ['사령부 최고 전술 평가 — 완벽한 정복!','훌륭한 지휘! 조금만 더 다듬으면 SSS입니다.','정예 지휘관의 모습입니다.','무난한 승리 — 왕관을 더 빨리 뽑아보세요.','기본에 충실한 전투였습니다.'][ri];
  if(!window.__rtabInit){ window.__rtabInit=1;
    $('#rtab-score').addEventListener('click',function(){ $('#rpane-score').classList.remove('hidden'); $('#rpane-rank').classList.add('hidden'); $('#rtab-score').classList.add('on'); $('#rtab-rank').classList.remove('on'); });
    $('#rtab-rank').addEventListener('click',function(){ $('#rpane-rank').classList.remove('hidden'); $('#rpane-score').classList.add('hidden'); $('#rtab-rank').classList.add('on'); $('#rtab-score').classList.remove('on'); });
  }
  $('#overlay-result').classList.toggle('lose',S.winner!=='blue');
  try{ var __sb=document.getElementById('screen-battle'); if(__sb) __sb.classList.add('ended'); }catch(e){}
  try{ var __dw=document.getElementById('dpsw'); if(__dw) __dw.classList.add('hidden'); }catch(e){} try{ window.__rFix(); }catch(e){} ambient=[]; parts=[];$('#overlay-result').classList.remove('hidden');   /* v151 결과모달 최적화: 결과 모달 위 위젯 충돌 제거 */
  var __fw=$('#fw-wrap');
  if(__fw){ __fw.innerHTML='';
    if(w==='blue'){
      var cols=['#f7c531','#ff9d3c','#7fb0ff','#ffe95e','#ffffff'];
      for(var b2=0;b2<3;b2++){ (function(bn){
        setTimeout(function(){
          for(var i2=0;i2<26;i2++){
            var sp=document.createElement('span'); sp.className='fw';
            var a2=Math.random()*6.283, dd=40+Math.random()*130;
            sp.style.left=(15+Math.random()*70)+'%'; sp.style.top=(8+Math.random()*40)+'%';
            sp.style.setProperty('--tx',Math.cos(a2)*dd+'px'); sp.style.setProperty('--ty',Math.sin(a2)*dd+'px');
            sp.style.background=cols[(Math.random()*cols.length)|0];
            sp.style.animationDelay=(bn*0.06)+'s';
            __fw.appendChild(sp);
            (function(node){ setTimeout(function(){ if(node.parentNode) node.parentNode.removeChild(node); },1400); })(sp);
          }
        }, bn*280);
      })(b2); }
      var cd=$('#crown-drop'); if(cd){ cd.classList.remove('hidden'); setTimeout(function(){ cd.classList.add('hidden'); },2800); }
    }
  }
}

function aiMeta(){   // v143: 승패 이력 기반 메타 난이도 -0.5(자비)~+1(가혹) — 최근 5전 연승/연패·트로피 등급 반영
  try{
    var h=JSON.parse(localStorage.getItem('ra_hist_v1')||'[]');
    if(!Array.isArray(h)) h=[];
    var streak=0;
    for(var i=h.length-1;i>=0;i--){ if(h[i]==='W') streak++; else if(h[i]==='L') streak--; else break; }
    var tp=Math.max(0,Math.min(1,(loadTrophies?loadTrophies():0)/600));
    return Math.max(-0.5,Math.min(1, streak*0.2 + tp*0.6 - 0.3));
  }catch(e){ return 0; }
}
function aiDiff(){   // v73: 동적 난이도 -1(자비)~+1(가혹) — 플레이어가 앞서면 AI 강화, 뒤처지면 완화
  const lead=S.crowns.blue-S.crowns.red;
  const hpB=towers.reduce((a,t)=>t.team==='blue'&&!t.dead?a+t.hp/t.maxHp:a,0);
  const hpR=towers.reduce((a,t)=>t.team==='red'&&!t.dead?a+t.hp/t.maxHp:a,0);
  const d=lead*0.5+(hpB-hpR)*0.5;
  return Math.max(-1,Math.min(1,d));
}
function regenElixir(dt){
  const rate=(1/2.8)*(S.double?2:1);
  P.elixir=Math.min(10,P.elixir+rate*(S&&S.relic==='relic_gold'?1.1:1)*(1+0.06*((S._sk&&S._sk.mag1)||0)+0.06*((S._sk&&S._sk.mag3)||0))*dt);   // v119: 스킬트리 엘릭서 회복   // v109 #13: 유물 — 황금 엘릭서 통
  A.elixir=Math.min(10,A.elixir+rate*0.95*(1+0.18*(aiDiff()*0.7+aiMeta()*0.3))*dt);   /* v143: 승패 이력 메타 난이도 혼합 */
}
function updateFx(dt){
  updateAmbient(dt);
  updateParts(dt);
  for(const f of fx) f.t+=dt;
  fx=fx.filter(f=>f.t<f.dur);
  for(const f of floats) f.t-=dt;
  floats=floats.filter(f=>f.t>0);
}
function update(dt){
  try{ if(TUT.on&&P.elixir<6) P.elixir=6; }catch(e){}   /* v147: 튜토리얼 중 엘릭서 하한 보장(플로어 6) */
  try{ if(S.pre===0&&!S.over){ DPSW.time+=dt; DPSW._c++; if(DPSW._c%30===0) dpswRender(); } }catch(e){}   /* v148: 경과 가산·위젯 갱신(0.5초) */
  if(S.scene!=='battle') return;
  if(S.over){
    S.endTimer-=dt;
    if(S.endTimer<=0&&!S.shown){ S.shown=true; showResult(); }
    updateProjs(dt); updateFx(dt);
    return;
  }
  if(S.pre>0){
    const b4=Math.ceil(S.pre-0.6); S.pre-=dt; const af=Math.ceil(S.pre-0.6);
    if(af!==b4&&af>=0) banner(af>0?'⏰ '+af:'⚔ 전투 시작!', af>0?650:1200);
    if(S.pre<=0){ S.pre=0; sfx('crown'); }
    updateFx(dt); return;
  }
  S.t-=dt;
  if(!S.overtime&&!S.double&&S.t<=60){ S.double=true; banner('⏱ 엘릭서 2배!'); }
  if(S.t<=0){
    if(!S.overtime){
      if(S.crowns.blue!==S.crowns.red) finish(S.crowns.blue>S.crowns.red?'blue':'red');
      else { S.overtime=true; S.double=true; S.t=60; banner('⚔ 연장전 — 먼저 왕관을 뽑는 팀이 승리!',2200); }
    } else finish('draw');
  }
  regenElixir(dt);
  if(!S.bossSpawned&&S.t<=90&&!S.over){ spawnBossNow(); }   /* v192 폴백: 잔여 90초 */
  aiTick(dt);
  if(S.ksCd>0) S.ksCd-=dt;
  if(S.repCd>0) S.repCd-=dt;   // v106 #12: 수리 쿨다운
  if(S.boss&&!S.boss.dead){ const b=S.boss; b.doom+=dt;
    if(b.doom>=12){ b.doom=0; const kt=towers.find(t=>t.team==='blue'&&t.kind==='king'&&!t.dead);
      if(kt){ dealDamage(kt,500,'red'); fx.push({x:kt.x,y:kt.y,t:0,dur:0.7,kind:'boom'}); S.shake=0.6; banner('💥 파멸기 폭발!',1800); } } }
  if(S.boss&&S.boss.dead){ S.kills.blue+=5; P.elixir=10; P._full=false;
    S.focus=null; S.focusGap=1.5;   // v116: 보스 격파 줌인 삭제(사용자 지정) — 즉시 해제 + 1.5s 신규 포커스 억제
    banner('💀 보스 토벌! 엘릭서 만땅 · 킬 +5',2200); sfx('crown');
    fx.push({x:S.boss.x,y:S.boss.y,t:0,dur:0.9,kind:'ring',col:'rgba(247,197,49,.95)'});
    S.boss=null; const kb=document.getElementById('ks-btn'); if(kb) kb.classList.add('hidden'); }
  for(const u of units) if(!u.dead){ try{ updateUnit(u,dt); }catch(err){ u.target=null; } }
  for(let i=0;i<units.length;i++)for(let j=i+1;j<units.length;j++){
    const a=units[i],b=units[j];
    if(a.c.flying!==b.c.flying) continue;
    const dx=b.x-a.x, dy=b.y-a.y, dd=Math.hypot(dx,dy)||0.01, min=(a.c.r+b.c.r)*0.92;
    if(dd<min){ const push=(min-dd)*0.5, ux=dx/dd, uy=dy/dd;
      a.x=clamp(a.x-ux*push,0.6,COLS-0.6); b.x=clamp(b.x+ux*push,0.6,COLS-0.6);
      if(a.c.flying){ a.y=clamp(a.y-uy*push,0.6,ROWS-0.6); b.y=clamp(b.y+uy*push,0.6,ROWS-0.6); } } }
  for(const u of units){ // 밀어내기 후 강 복귀 방지: 지상 유닛은 다리 밖 밴드 진입 시 X축으로만 재정렬
    if(u.c.flying||u.building) continue;
    if(u.y>RIVER_Y0-0.25&&u.y<RIVER_Y1+0.25){
      const bx=Math.abs(u.x-BRIDGES[0])<Math.abs(u.x-BRIDGES[1])?BRIDGES[0]:BRIDGES[1];
      if(Math.abs(u.x-bx)>=0.75) u.y=u.y>=RIVER_MID?RIVER_Y1+0.25:RIVER_Y0-0.25; } }
  for(const t of towers) if(!t.dead) updateTower(t,dt);
  updateProjs(dt); updateFx(dt);
  units=units.filter(u=>!u.dead);
  { // 전투 하이라이트: 격전 군집화 — 동시 2곳이면 '최근 전투 우선'(현재 추적 격전이 살아있는 한 유지, 블렌딩 없음)
    const fights=[];
    for(const u of units){ if(u.target&&!u.target.dead&&!u.building&&u.spawnFx<=0){
      const rr=u.c.range+(u.target.r||(u.target.c&&u.target.c.r)||0.5);
      if(dist(u,u.target)<=rr) fights.push({x:(u.x+u.target.x)/2,y:(u.y+u.target.y)/2,w:u.target.isTower?2:1}); } }   // 타원 공성 1기도 발화
    for(const p of projs){ const pt=p.target; if(p.kind!=='fireball'&&pt&&!pt.dead)
      fights.push({x:(p.x+pt.x)/2,y:(p.y+pt.y)/2,w:1}); }   // 타워 방어 사격 포함
    const cls=[];
    for(const f of fights){
      let best=null,bd=1e9;
      for(const c of cls){ const d=Math.hypot(c.x-f.x,c.y-f.y); if(d<bd){bd=d;best=c;} }
      if(best&&bd<4.0){ best.x=(best.x*best.n+f.x)/(best.n+1); best.y=(best.y*best.n+f.y)/(best.n+1); best.n++; best.w+=f.w; }
      else cls.push({x:f.x,y:f.y,n:1,w:f.w});
    }
    let pick=null;
    if(S.clash){ let bc=null,bw=0;   // 히스테리시스: 현재 추적 격전 군집이 살아있으면 그쪽 유지
      for(const c of cls){ const d=Math.hypot(c.x-S.clash.x,c.y-S.clash.y);
        if(d<4.5&&c.w>bw){ bw=c.w; bc=c; } }
      pick=bc;
    }
    if(!pick){ let mw=0; for(const c of cls) if(c.w>mw){ mw=c.w; pick=c; } }
    if(pick&&pick.w>=2){
      if(!S.clash) S.clash={x:pick.x,y:pick.y,a:0};
      S.clash.x=lerp(S.clash.x,pick.x,0.1); S.clash.y=lerp(S.clash.y,pick.y,0.1);
      S.clash.a=Math.min(1,S.clash.a+0.08);
    } else if(S.clash){ S.clash.a=Math.max(0,S.clash.a-0.06); if(S.clash.a<=0) S.clash=null; }
  }
}

/* ---------- 적 AI (REA 설계도 §7) ---------- */
function firstIn(hand,prio){ for(const k of prio) if(hand.includes(k)) return k; return null; }
function bestCluster(list,rad){
  let best=null;
  for(const a of list){
    let hp=0,cx=0,cy=0,n=0;
    for(const b of list){ if(Math.hypot(a.x-b.x,a.y-b.y)<=rad){ hp+=b.hp; cx+=b.x; cy+=b.y; n++; } }
    if(n>=3&&(!best||hp>best.hp)) best={x:cx/n,y:cy/n,hp,n};
  }
  return best;
}
function aiTick(dt){
  A.timer-=dt; if(A.timer>0) return;
  A.timer=(1.0+Math.random()*0.8)/(1+0.25*(aiDiff()*0.7+aiMeta()*0.3));   /* v143 */
  const hand=A.hand;
  const threats=units.filter(u=>u.team==='blue'&&!u.dead&&u.spawnFx<=0&&u.y<17.5);
  let pick=null,px=9,py=6;
  if(threats.length){
    let main=threats[0]; for(const t of threats) if(t.hp>main.hp) main=t;
    const anyFly=threats.some(t=>t.c.flying), tank=main.hp>=900;
    const prio= anyFly?['musketeer','wizard','babyd','sniper','archers','minions']
             : tank?['skarmy','minions','cannon','valk','boar','bomber','wizard','knight','archers']
             :['knight','valk','archers','skarmy','musketeer','bomber','icem','cleric','wizard','minions'];
    pick=firstIn(hand,prio);
    px=clamp(main.x,2,16); py=clamp(main.y-3.2,2.5,14.5);
    if(pick==='cannon') py=clamp(main.y-5,3,12);
  } else {
    const cl=bestCluster(units.filter(u=>u.team==='blue'),1.9);
    if(cl&&cl.hp>=330&&hand.includes('fireball')){ pick='fireball'; px=cl.x; py=cl.y; }
    else if(cl&&cl.n>=4&&cl.hp<=620&&hand.includes('zap')){ pick='zap'; px=cl.x; py=cl.y; }
    else if(A.elixir>=9-2*Math.max(0,aiMeta())){   /* v143: 카운터푸시 강도 — 연승·상위 등급일수록 낮은 엘릭서에서 선제 푸시 */
      pick=firstIn(hand,['giant','prince','knight','wizard','musketeer','archers','minions','skarmy'])||hand[0];
      px=Math.random()<0.5?BRIDGES[0]:BRIDGES[1]; py=3.2;
    } else if(A.elixir>=6&&Math.random()<0.55){
      pick=firstIn(hand,['musketeer','wizard','sniper','archers','minions','knight','skarmy']);
      const pusher=units.find(u=>u.team==='red'&&!u.dead&&u.y>16.5);
      if(pusher){ px=clamp(pusher.x,2,16); py=clamp(pusher.y-2.5,2.5,14.5); } // 카운터푸시 합류
      else { px=9+(Math.random()*6-3); py=5+Math.random()*4; }
    }
  }
  if(!pick) return;
  playCard(A,hand.indexOf(pick),px,py);
}
function playCard(side,idx,x,y){
  const key=side.hand[idx]; if(!key) return false;
  const c=CARDS[key]; if(c.cost>side.elixir) return false;
  side.elixir-=c.cost;
  spawnCard(key, side===P?'blue':'red', x, y);
  side.hand[idx]=side.queue.shift(); side.queue.push(key);
  if(side===P) syncHand();
  sfx('deploy');
  return true;
}

/* ---------- 파티클 ---------- */
function addParts(x,y,n,col,spd,life,grav){
  if(parts.length>380) return;
  for(let i=0;i<n;i++){ const a=Math.random()*6.283, v=spd*(0.4+Math.random()*0.6);
    parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-(grav?24:0),t:life*(0.7+Math.random()*0.6),max:life,col,grav:grav||0,r:1.5+Math.random()*2.2}); }
}
function updateParts(dt){
  for(const p of parts){ p.t-=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; if(p.grav) p.vy+=p.grav*dt; }
  parts=parts.filter(p=>p.t>0);
}
function drawParts(){
  for(const p of parts){
    ctx.globalAlpha=Math.max(0,p.t/p.max);
    ctx.fillStyle=p.col;
    ctx.beginPath(); ctx.arc(p.x*TILE,p.y*TILE,p.r,0,7); ctx.fill();
  }
  ctx.globalAlpha=1;
}
let ambient=[];
function updateAmbient(dt){
  const T=THEMES[S.theme];
  if(!T||!T.amb||S.scene!=='battle') return;
  if(ambient.length<50&&Math.random()<0.45){
    if(T.amb==='ember') ambient.push({x:Math.random()*COLS,y:ROWS+0.5,vy:-(1.6+Math.random()*1.6),vx:(Math.random()-0.5)*0.5,t:0,max:5+Math.random()*3});
    else ambient.push({x:Math.random()*COLS,y:-0.6,vy:0.9+Math.random()*0.9,vx:(Math.random()-0.5)*0.6,t:0,max:7+Math.random()*4});
  }
  for(const a of ambient){ a.t+=dt; a.y+=a.vy*dt; a.x+=a.vx*dt; }
  ambient=ambient.filter(a=>a.t<a.max&&a.y>-1&&a.y<ROWS+1.5);
}
function drawAmbient(){
  for(const a of ambient){
    const px=a.x*TILE, py=a.y*TILE, fade=Math.min(1,a.t*2,(a.max-a.t)*2);
    if(S.theme==='lava'){ ctx.globalAlpha=fade*(0.55+0.4*Math.sin(now*6+a.x*7));
      ctx.fillStyle='#ff9d3c'; ctx.beginPath(); ctx.arc(px,py,2.2,0,7); ctx.fill();
      ctx.globalAlpha=fade*0.3; ctx.fillStyle='#ffd75e'; ctx.beginPath(); ctx.arc(px,py,4.5,0,7); ctx.fill(); }
    else { ctx.globalAlpha=fade*0.8; ctx.fillStyle='#fff';
      ctx.beginPath(); ctx.arc(px,py,1.8,0,7); ctx.fill(); }
  }
  ctx.globalAlpha=1;
}
let vig=null;
function drawVignette(){
  if(!vig){ vig=ctx.createRadialGradient(W/2,H/2,H*0.42,W/2,H/2,H*0.75);
    vig.addColorStop(0,'rgba(0,0,0,0)'); vig.addColorStop(1,'rgba(8,14,26,.35)'); }
  ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);
}

/* ---------- 렌더링 ---------- */
const canvas=$('#arena'), ctx=canvas.getContext('2d');
const BSCALE=2;
canvas.width=W*BSCALE; canvas.height=H*BSCALE; ctx.scale(BSCALE,BSCALE);
const bgc=document.createElement('canvas'); bgc.width=W*BSCALE; bgc.height=H*BSCALE;
function roundRect(x,y,w,h,r){
  ctx.beginPath(); ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
}
function drawStatic(){
  const T=THEMES[S.theme];
  const g=bgc.getContext('2d');
  g.setTransform(BSCALE,0,0,BSCALE,0,0);
  for(let r=0;r<ROWS;r++)for(let c2=0;c2<COLS;c2++){
    g.fillStyle=(r+c2)%2?T.g1:T.g2;
    g.fillRect(c2*TILE,r*TILE,TILE,TILE);
  }
  if(S.theme==='classic'&&GRASS_IM.complete&&GRASS_IM.naturalWidth){ g.save(); g.globalAlpha=0.93; g.drawImage(GRASS_IM,0,0,W,H); g.restore();
  
    g.fillStyle='rgba(0,0,0,.055)';
    for(let r=0;r<ROWS;r++)for(let c2=0;c2<COLS;c2++) if((r+c2)%2) g.fillRect(c2*TILE,r*TILE,TILE,TILE); }
  let seed=7;
  const rnd=()=>{ seed=(seed*16807)%2147483647; return seed/2147483647; };
  g.fillStyle=T.speck;
  for(let i=0;i<240;i++){ const x=rnd()*W, y=rnd()*H;
    if(y>RIVER_Y0*TILE-4&&y<RIVER_Y1*TILE+4) continue;
    g.fillRect(x,y,2,3); }
  g.strokeStyle=T.blade; g.lineWidth=1;
  for(let i=0;i<90;i++){ const x=rnd()*W, y=rnd()*H;
    if(y>RIVER_Y0*TILE-6&&y<RIVER_Y1*TILE+6) continue;
    g.beginPath(); g.moveTo(x,y+4); g.quadraticCurveTo(x+1,y+1,x+2,y); g.stroke(); }
  if(S.theme==='classic'&&FIELD_IM.complete&&FIELD_IM.naturalWidth){ g.drawImage(FIELD_IM,0,0,W,H); }
  if(S.theme==='lava'&&LAVA_IM.complete&&LAVA_IM.naturalWidth){ g.save(); g.globalAlpha=0.93; g.drawImage(LAVA_IM,0,0,W,H); g.restore(); }
  if(S.theme==='ice'&&ICE_IM.complete&&ICE_IM.naturalWidth){ g.save(); g.globalAlpha=0.93; g.drawImage(ICE_IM,0,0,W,H); g.restore(); }
  g.fillStyle='rgba(15,23,42,'+((S.theme==='lava')?0.50:(S.theme==='ice')?0.56:0.54)+')';g.fillRect(0,0,W,H);   /* v145b: 슬레이트 베일 — FIELD/LAVA/ICE 전면 텍스처 이후·승부 구역 틴트 이전 배치(구역 색은 베일 위에 선명 유지) */
  g.fillStyle=S.theme==='lava'?'rgba(255,90,30,.16)':S.theme==='ice'?'rgba(140,200,255,.22)':'rgba(63,123,245,.13)';
  g.fillRect(0,RIVER_Y1*TILE,W,H-RIVER_Y1*TILE);
  g.fillStyle='rgba(230,76,76,.14)'; g.fillRect(0,0,W,RIVER_Y0*TILE);
  g.fillStyle=T.road;
  for(const bx of BRIDGES){
    g.fillRect((bx-0.45)*TILE, RIVER_Y1*TILE, 0.9*TILE, 9.2*TILE);
    g.fillRect((bx-0.45)*TILE, RIVER_Y0*TILE-9.2*TILE, 0.9*TILE, 9.2*TILE);
  }
  g.strokeStyle='rgba(255,255,255,.15)'; g.setLineDash([7,9]); g.lineWidth=2;
  g.beginPath(); g.moveTo(0,BLUE_DEPLOY_MIN*TILE); g.lineTo(W,BLUE_DEPLOY_MIN*TILE);
  g.moveTo(0,RED_DEPLOY_MAX*TILE); g.lineTo(W,RED_DEPLOY_MAX*TILE); g.stroke(); g.setLineDash([]);
  g.fillStyle='#c9b27a';
  g.fillRect(0,RIVER_Y0*TILE-6,W,6); g.fillRect(0,RIVER_Y1*TILE,W,6);
  const __rim=RIVER_IM[S.theme];
  if(__rim&&__rim.complete&&__rim.naturalWidth){ g.drawImage(__rim,0,RIVER_Y0*TILE,W,(RIVER_Y1-RIVER_Y0)*TILE); }
  else {
  g.fillStyle=T.riverA; g.fillRect(0,RIVER_Y0*TILE,W,(RIVER_Y1-RIVER_Y0)*TILE);
  g.fillStyle=T.riverB; g.fillRect(0,RIVER_Y0*TILE+4,W,(RIVER_Y1-RIVER_Y0)*TILE-8);
  g.fillStyle='rgba(255,255,255,.20)'; g.fillRect(0,RIVER_Y0*TILE,W,3); g.fillRect(0,RIVER_Y1*TILE-3,W,3);
  }
  for(const b of BRIDGES){
    if(BRIDGE_IM.complete&&BRIDGE_IM.naturalWidth){ const bx2=(b-0.8)*TILE, bw2=1.6*TILE; g.save(); const __bh=BRIDGE_IM.naturalHeight/BRIDGE_IM.naturalWidth*bw2; g.drawImage(BRIDGE_IM,bx2,RIVER_Y0*TILE-7,bw2,__bh); g.restore(); continue; }

    const bx=(b-0.8)*TILE, bw=1.6*TILE, bh=(RIVER_Y1-RIVER_Y0)*TILE+16;
    g.fillStyle='rgba(0,0,0,.20)'; g.fillRect(bx-3,RIVER_Y0*TILE-9,bw+6,bh+7);
    g.fillStyle='#8a5a2b'; g.fillRect(bx,RIVER_Y0*TILE-8,bw,bh);
    g.fillStyle='#a06a33';
    for(let i=0;i<7;i++) g.fillRect(bx+3,RIVER_Y0*TILE-6+i*(bh-6)/7,bw-6,5);
    g.fillStyle='#6d441c'; g.fillRect(bx,RIVER_Y0*TILE-8,5,bh); g.fillRect(bx+bw-5,RIVER_Y0*TILE-8,5,bh);
    g.fillStyle='#5a3a17'; g.fillRect(bx,RIVER_Y0*TILE-11,bw,4); g.fillRect(bx,RIVER_Y0*TILE+bh+3,bw,4);
  }
  for(const t of towers){
    const R=t.kind==='king'?54:44;
    g.fillStyle='rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(t.x*TILE,t.y*TILE+10,R+6,(R+6)*0.42,0,0,7); g.fill();
    g.fillStyle=T.stone; g.beginPath(); g.ellipse(t.x*TILE,t.y*TILE+8,R,R*0.40,0,0,7); g.fill();
    g.fillStyle=T.stoneHi; g.beginPath(); g.ellipse(t.x*TILE,t.y*TILE+6,R,R*0.40,0,0,7); g.fill();
    g.strokeStyle=T.stoneEdge; g.lineWidth=2; g.stroke();
  }
  const deco=S.theme==='classic'?[]:[[0.9,13.2,'b'],[17.1,18.8,'b'],[0.9,19.4,'b'],[17.1,12.8,'b'],[8.9,14.5,'f'],[5.2,14.4,'f'],[12.8,17.6,'f']];
  for(const d of deco){
    const dx=d[0]*TILE, dy=d[1]*TILE;
    if(d[2]==='b'){ g.fillStyle=T.bush; g.beginPath();
      g.arc(dx-6,dy,8,0,7); g.arc(dx+5,dy-3,10,0,7); g.arc(dx+1,dy+5,7,0,7); g.fill();
      g.fillStyle='rgba(255,255,255,.14)'; g.beginPath(); g.arc(dx+3,dy-6,4,0,7); g.fill(); }
    else { g.fillStyle=T.flower; g.beginPath(); g.arc(dx,dy,3.5,0,7); g.fill();
      g.fillStyle='rgba(255,255,255,.7)'; g.beginPath(); g.arc(dx-1,dy-1,1.4,0,7); g.fill(); }
  }
  g.fillStyle=T.stone;
  g.fillRect(0,0,W,7); g.fillRect(0,H-7,W,7); g.fillRect(0,0,7,H); g.fillRect(W-7,0,7,H);
  if(WALL_IM.complete&&WALL_IM.naturalWidth){
    g.drawImage(WALL_IM,0,0,W,22); g.save(); g.translate(W,H); g.rotate(Math.PI); g.drawImage(WALL_IM,0,0,W,22); g.restore();
    g.save(); g.translate(0,H); g.rotate(-Math.PI/2); g.drawImage(WALL_IM,0,0,H,22); g.restore();
    g.save(); g.translate(W,0); g.rotate(Math.PI/2); g.drawImage(WALL_IM,0,0,H,22); g.restore(); }
  g.fillStyle='rgba(255,255,255,.25)'; g.fillRect(0,0,W,2); g.fillStyle='rgba(0,0,0,.25)'; g.fillRect(0,H-2,W,2);
  g.fillStyle='rgba(255,255,255,.25)'; g.fillRect(0,0,W,2); g.fillRect(0,0,2,H);
  g.fillStyle='rgba(0,0,0,.25)'; g.fillRect(0,H-2,W,2); g.fillRect(W-2,0,2,H);
  for(const bx of BRIDGES){   // 다리 끝단 임계(강과 만나는 단면 처리) — 고대비 돌출 돌단
    g.fillStyle='#3d4350';
    g.fillRect((bx-0.54)*TILE, RIVER_Y0*TILE-15, 1.08*TILE, 15);
    g.fillRect((bx-0.54)*TILE, RIVER_Y1*TILE, 1.08*TILE, 15);
    g.fillStyle='#98a0b0';
    g.fillRect((bx-0.54)*TILE, RIVER_Y0*TILE-15, 1.08*TILE, 7);
    g.fillRect((bx-0.54)*TILE, RIVER_Y1*TILE, 1.08*TILE, 7);
    g.strokeStyle='rgba(8,12,22,.8)'; g.lineWidth=2;
    g.strokeRect((bx-0.54)*TILE, RIVER_Y0*TILE-15, 1.08*TILE, 15);
    g.strokeRect((bx-0.54)*TILE, RIVER_Y1*TILE, 1.08*TILE, 15);
  }
  if(BRIDGE_IM.complete&&BRIDGE_IM.naturalWidth){
    for(const b of BRIDGES){
      const bw2=1.9*TILE, bh2=(RIVER_Y1-RIVER_Y0)*TILE+40;
      g.drawImage(BRIDGE_IM,(b-0.95)*TILE,RIVER_Y0*TILE-20,bw2,bh2);
    }
  }

}
function flagPole(px,py,col){
  ctx.strokeStyle='#5a4632'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(px,py-22); ctx.stroke();
  const wv=Math.sin(now*5+px*0.13)*2.5;
  ctx.fillStyle=col; ctx.beginPath();
  ctx.moveTo(px,py-22); ctx.quadraticCurveTo(px+10,py-21+wv,px+18,py-18+wv);
  ctx.lineTo(px,py-13); ctx.closePath(); ctx.fill();
}
function towSkin(k,im){   /* v144: 타워 테마 스킨 — 용암/서리 틴트 캐시(팀 식별은 깃발·HP바 색 유지) */
  try{
    if(S.theme==='classic'||!im||!im.complete||!im.naturalWidth) return im;
    towSkin.c=towSkin.c||{}; var key=S.theme+'|'+k;
    if(towSkin.c[key]) return towSkin.c[key];
    var cv=document.createElement('canvas'); cv.width=im.naturalWidth; cv.height=im.naturalHeight;
    var c2=cv.getContext('2d'); c2.drawImage(im,0,0);
    c2.globalCompositeOperation='source-atop'; c2.globalAlpha=(S.theme==='lava')?0.52:0.46;   /* v144b: 가시 틴트 강도 */
    c2.fillStyle=(S.theme==='lava')?'#ff8a3c':'#9cdcff'; c2.fillRect(0,0,cv.width,cv.height);
    towSkin.c[key]=cv; return cv;
  }catch(e){ return im; }
}
function drawTower(t){try{
      var __tc=(t.kind==='king'?'t_king':'t_princess')+(t.team==='blue'?'_b':'_r');
      var __im=(typeof TSPR!=='undefined')?TSPR[__tc]:null; if(__im) __im=towSkin(__tc,__im);   /* v144: 테마 스킨 적용 */
      if(!(__im&&((__im.getContext)||(__im.complete&&__im.naturalWidth>0&&__im.__valid!==false)))){   /* v144: 틴트 캔버스 허용 */
        var x=t.x*TILE,y=t.y*TILE,king=t.kind==='king';
        var hs=king?128:100,ytop=Math.max(y+14-hs,6);
        ctx.fillStyle='rgba(0,0,0,.22)';ctx.beginPath();ctx.ellipse(x,Math.min(y+10,ytop+hs-6),hs*0.42,hs*0.16,0,0,7);ctx.fill();
        var bw=king?86:70;
        ctx.fillStyle=t.team==='blue'?'#7d97c9':'#c97d7d';ctx.fillRect(x-bw/2,ytop+hs*0.35,bw,hs*0.6);
        ctx.strokeStyle='rgba(20,26,40,.6)';ctx.lineWidth=3;ctx.strokeRect(x-bw/2,ytop+hs*0.35,bw,hs*0.6);
        ctx.fillStyle=t.team==='blue'?'#5c74a8':'#a85c5c';
        for(var i2=0;i2<4;i2++)ctx.fillRect(x-bw/2+i2*(bw/4)+2,ytop+hs*0.22,bw/4-4,hs*0.16);
        ctx.fillStyle=t.team==='blue'?'#3f5f96':'#963f3f';
        ctx.beginPath();ctx.moveTo(x-bw/2-4,ytop+hs*0.36);ctx.lineTo(x+bw/2+4,ytop+hs*0.36);ctx.lineTo(x,ytop+hs*0.06);ctx.closePath();ctx.fill();
        if(king){ctx.fillStyle='#ffd75e';ctx.beginPath();ctx.moveTo(x-14,ytop+hs*0.02);ctx.lineTo(x-7,ytop+hs*0.10);ctx.lineTo(x,ytop);ctx.lineTo(x+7,ytop+hs*0.10);ctx.lineTo(x+14,ytop+hs*0.02);ctx.lineTo(x+10,ytop+hs*0.14);ctx.lineTo(x-10,ytop+hs*0.14);ctx.closePath();ctx.fill();}
        var hr=Math.max(0,t.hp/t.maxHp),bw3=king?80:62,bx=x-bw3/2,by=ytop+hs+8;
        ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(bx-2,by-2,bw3+4,12);
        ctx.fillStyle='#20293a';ctx.fillRect(bx,by,bw3,8);
        ctx.fillStyle=t.team==='blue'?'#4ade80':'#ff7b6b';ctx.fillRect(bx,by,bw3*hr,8);
        ctx.font=" + FD + ";ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='rgba(8,12,22,.95)';
        ctx.strokeText(Math.ceil(t.hp),clamp(x,26,W-26),by-6); ctx.fillStyle='#ffe08a'; ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(Math.ceil(t.hp),clamp(x,26,W-26),by-6);ctx.fillText(Math.ceil(t.hp),clamp(x,26,W-26),by-6);
        return;
      }
    }catch(__pe){ if(!window.__pe1)window.__pe1='towerFb:'+__pe.message; }try{
  const x=t.x*TILE, y=t.y*TILE, king=t.kind==='king';
  const tw=king?'t_king':'t_princess', tc=tw+(t.team==='blue'?'_b':'_r');
  if(TSPR[tc]&&TSPR[tc].complete&&TSPR[tc].naturalWidth>0&&TSPR[tc].__valid!==false){
    const hr=t.hp/t.maxHp, hs=king?128:100, ytop=Math.max(y+14-hs,6), by0=Math.max(ytop-18,10);
    ctx.fillStyle='rgba(0,0,0,.22)'; ctx.beginPath();
    ctx.ellipse(x,Math.min(y+10,ytop+hs-6),hs*0.42,hs*0.16,0,0,7); ctx.fill();
    ctx.drawImage(TSPR[tc],x-hs/2,ytop,hs,hs);
    if(hr<0.55){ ctx.strokeStyle='rgba(25,30,42,.7)'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(x-hs*0.2,ytop+hs*0.45); ctx.lineTo(x-hs*0.1,ytop+hs*0.62); ctx.lineTo(x-hs*0.17,ytop+hs*0.8); ctx.stroke(); }
    if(hr<0.25){ for(let i=0;i<3;i++){ const sy=((now*22+i*26)%50);
      ctx.fillStyle='rgba(90,90,95,'+(0.30-sy*0.005)+')';
      ctx.beginPath(); ctx.arc(x+hs*0.22,ytop+hs*0.1-sy,5+sy*0.14,0,7); ctx.fill(); } }
    if(king&&!t.active){ ctx.font='14px sans-serif'; ctx.textAlign='center'; ctx.fillText('💤',x-hs*0.3,ytop+18); }
    const bw=king?80:62, bx=x-bw/2, by=by0<14?ytop+hs+8:by0;
    ctx.fillStyle='rgba(0,0,0,.6)'; roundRect(bx-2,by-2,bw+4,12,5); ctx.fill();
    ctx.fillStyle='#20293a'; roundRect(bx,by,bw,8,4); ctx.fill();
    ctx.fillStyle=t.team==='blue'?'#4ade80':'#ff7b6b';
    roundRect(bx,by,bw*Math.max(0,hr),8,4); ctx.fill();
    ctx.font="'Pretendard Variable','Noto Sans KR',sans-serif"; ctx.textAlign='center';
    ctx.strokeStyle='rgba(0,0,0,.8)'; ctx.lineWidth=3;
    ctx.font=" + FD + "; ctx.lineWidth=3; ctx.strokeStyle='rgba(8,12,22,.95)';  ctx.strokeText(Math.ceil(t.hp),clamp(x,26,W-26),by-6); ctx.fillStyle='#ffe08a'; ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(Math.ceil(t.hp),clamp(x,26,W-26),by-6);ctx.fillText(Math.ceil(t.hp),clamp(x,26,W-26),by-6);
    return;
  }
  const w=king?108:82, h=king?84:68, top=y-h/2+4;
  const teamCol=t.team==='blue'?'#3f7bf5':'#e64545';
  const roofHi=t.team==='blue'?'#6f9ff8':'#f27a7a', roofLo=t.team==='blue'?'#2c55b0':'#a82e2e';
  const hr=t.hp/t.maxHp;
  const body=ctx.createLinearGradient(x-w/2,0,x+w/2,0);
  body.addColorStop(0,'#cdd4dd'); body.addColorStop(.45,'#aeb8c4'); body.addColorStop(1,'#8b96a4');
  ctx.fillStyle=body; roundRect(x-w/2,y-h/2+6,w,h,6); ctx.fill();
  ctx.strokeStyle='rgba(40,50,65,.6)'; ctx.lineWidth=2; roundRect(x-w/2,y-h/2+6,w,h,6); ctx.stroke();
  ctx.strokeStyle='rgba(60,72,88,.3)'; ctx.lineWidth=1;
  for(let i=1;i<4;i++){ ctx.beginPath(); ctx.moveTo(x-w/2+3,y-h/2+6+i*h/4); ctx.lineTo(x+w/2-3,y-h/2+6+i*h/4); ctx.stroke(); }
  ctx.fillStyle='#39415a'; ctx.beginPath();
  ctx.moveTo(x-w*0.13,y+h*0.3); ctx.lineTo(x-w*0.13,y-h*0.02);
  ctx.arc(x,y-h*0.02,w*0.13,Math.PI,0); ctx.lineTo(x+w*0.13,y+h*0.3); ctx.closePath(); ctx.fill();
  ctx.fillStyle=teamCol; ctx.fillRect(x-w/2,y-h/2+6,w,9);
  ctx.fillStyle='rgba(255,255,255,.3)'; ctx.fillRect(x-w/2,y-h/2+6,w,3);
  ctx.fillStyle='#9aa5b2';
  const nc=king?7:5;
  for(let i=0;i<nc;i++) ctx.fillRect(x-w/2+i*(w/nc)+2,top-7,w/nc-4,7);
  if(!king){
    const roof=ctx.createLinearGradient(x-w*0.5,0,x+w*0.5,0);
    roof.addColorStop(0,roofLo); roof.addColorStop(.5,roofHi); roof.addColorStop(1,roofLo);
    ctx.fillStyle=roof; ctx.beginPath();
    ctx.moveTo(x-w*0.5,top-6); ctx.lineTo(x+w*0.5,top-6); ctx.lineTo(x,top-h*0.6); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(40,50,65,.5)'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.fillStyle='#f7c531'; ctx.beginPath(); ctx.arc(x,top-h*0.6,3.5,0,7); ctx.fill();
    flagPole(x+4,top-h*0.6-4,teamCol);
  } else {
    ctx.fillStyle=teamCol; ctx.fillRect(x-w/2,top-13,w,6);
    ctx.font='20px sans-serif'; ctx.textAlign='center'; ctx.fillText('👑',x,top-16);
    flagPole(x-w*0.4,top-22,teamCol); flagPole(x+w*0.4,top-22,teamCol);
  }
  if(hr<0.55){ ctx.strokeStyle='rgba(25,30,42,.7)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(x-w*0.3,y-h*0.08); ctx.lineTo(x-w*0.18,y+h*0.14); ctx.lineTo(x-w*0.26,y+h*0.3); ctx.stroke();
    if(hr<0.3){ ctx.beginPath(); ctx.moveTo(x+w*0.28,y-h*0.14); ctx.lineTo(x+w*0.16,y+h*0.1); ctx.lineTo(x+w*0.24,y+h*0.3); ctx.stroke(); } }
  if(hr<0.25){ for(let i=0;i<3;i++){ const sy=((now*22+i*26)%50);
    ctx.fillStyle='rgba(90,90,95,'+(0.30-sy*0.005)+')';
    ctx.beginPath(); ctx.arc(x+w*0.26,top-16-sy,5+sy*0.14,0,7); ctx.fill(); } }
  if(king&&!t.active){ ctx.fillStyle='rgba(13,27,46,.30)'; roundRect(x-w/2,y-h/2+6,w,h,6); ctx.fill();
    ctx.font='13px sans-serif'; ctx.textAlign='center'; ctx.fillText('💤',x-w*0.32,y-h/2+26); }
  const bw=king?80:62, bx=x-bw/2, by=top-36;
  ctx.fillStyle='rgba(0,0,0,.6)'; roundRect(bx-2,by-2,bw+4,12,5); ctx.fill();
  ctx.fillStyle='#20293a'; roundRect(bx,by,bw,8,4); ctx.fill();
  ctx.fillStyle=t.team==='blue'?'#4ade80':'#ff7b6b';
  roundRect(bx,by,bw*Math.max(0,hr),8,4); ctx.fill();
  ctx.font="'Pretendard Variable','Noto Sans KR',sans-serif"; ctx.textAlign='center';
  ctx.strokeStyle='rgba(0,0,0,.8)'; ctx.lineWidth=3;
  ctx.font=" + FD + "; ctx.lineWidth=3; ctx.strokeStyle='rgba(8,12,22,.95)';  ctx.strokeText(Math.ceil(t.hp),clamp(x,26,W-26),by-6); ctx.fillStyle='#ffe08a'; ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.8)';ctx.strokeText(Math.ceil(t.hp),clamp(x,26,W-26),by-6);ctx.fillText(Math.ceil(t.hp),clamp(x,26,W-26),by-6);
}catch(__pe){ if(!window.__pe1)window.__pe1=__pe.message; }}
function drawRubble(t){
  if(TSPR.t_rubble&&TSPR.t_rubble.complete){
    const rx=t.x*TILE, ry=t.y*TILE, rs=t.kind==='king'?118:94;
    ctx.fillStyle='rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(rx,ry+8,rs*0.40,rs*0.15,0,0,7); ctx.fill();
    ctx.drawImage(TSPR.t_rubble,rx-rs/2,ry+10-rs,rs,rs);
    for(let i=0;i<2;i++){ const sy=((now*18+i*30)%44);
      ctx.fillStyle='rgba(120,120,125,'+(0.25-sy*0.005)+')';
      ctx.beginPath(); ctx.arc(rx+((i*23)%20)-10,ry-4-sy,5+sy*0.12,0,7); ctx.fill(); }
    return;
  }
  const x=t.x*TILE, y=t.y*TILE;
  ctx.fillStyle='rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(x,y+8,44,17,0,0,7); ctx.fill();
  const stones=[[0,0,13],[-20,6,9],[18,4,10],[-8,-8,7],[10,-7,8]];
  for(const s of stones){
    ctx.fillStyle='#98a1ac'; ctx.beginPath(); ctx.ellipse(x+s[0],y+s[1],s[2],s[2]*0.72,0.3,0,7); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.22)'; ctx.beginPath(); ctx.ellipse(x+s[0]-2,y+s[1]-3,s[2]*0.45,s[2]*0.3,0.3,0,7); ctx.fill();
  }
  for(let i=0;i<2;i++){ const sy=((now*18+i*30)%44);
    ctx.fillStyle='rgba(120,120,125,'+(0.25-sy*0.005)+')';
    ctx.beginPath(); ctx.arc(x+((i*23)%20)-10,y-6-sy,5+sy*0.12,0,7); ctx.fill(); }
}
const ATK3={};


'use strict';
(function(){ var RAW={"knight":["assets/img_211.png","assets/img_212.png","assets/img_213.png"],"giant":["assets/img_214.png","assets/img_215.png","assets/img_216.png"],"skarmy":["assets/img_217.png","assets/img_218.png","assets/img_219.png"],"prince":["assets/img_220.png","assets/img_221.png","assets/img_222.png"],"minions":["assets/img_223.png","assets/img_224.png","assets/img_225.png"],"valk":["assets/img_226.png","assets/img_227.png","assets/img_228.png"],"boar":["assets/img_229.png","assets/img_230.png","assets/img_231.png"],"bomber":["assets/img_232.png","assets/img_233.png","assets/img_234.png"]}; const RAW_BOSSATK=["assets/img_235.png","assets/img_236.png","assets/img_237.png"]; for(var k in RAW){ ATK3[k]=RAW[k].map(function(s){ var im=new Image(); im.src=s; return im; }); } try{ ATK3.boss=RAW_BOSSATK.map(function(s){ var im=new Image(); im.src=s; return im; }); }catch(e){} })();
function drawUnit(u){try{
  const px=u.x*TILE, py=u.y*TILE;
  const fly=u.c.flying, bob=fly?Math.sin(now*5+u.bob)*2.5:0, dy=fly?-15+bob:0;
  if(u.spawnFx>0.28&&Math.random()<0.5) addParts(px,py+3,1,'#cfc3a8',1.8,0.35,-20);
  const scale=u.spawnFx>0?1-(u.spawnFx/0.45)*0.7:1;
  const r=Math.max(8,(u.c.r*TILE*0.92+9)*scale);
  const la=u.target?Math.atan2(u.target.y-u.y,u.target.x-u.x):u.dir;
  const sx=Math.cos(la)>=0?1:-1;
  const lunge=u.swing>0?u.swing*34:0;
  const cx0=px+Math.cos(la)*lunge, cy0=py+dy+Math.sin(la)*lunge*0.5;
  ctx.fillStyle='rgba(0,0,0,.28)'; ctx.beginPath(); ctx.ellipse(px,py+5,r*0.8,r*0.36,0,0,7); ctx.fill();
  if(u.team!=='blue'){ ctx.fillStyle='rgba(255,45,45,.18)'; ctx.beginPath(); ctx.ellipse(px,py+5,r*0.95,r*0.45,0,0,7); ctx.fill(); }   /* v181: 적군 지상 링 강화 */
  ctx.strokeStyle=u.team==='blue'?'rgba(96,158,255,1)':'rgba(255,45,45,.95)';
  ctx.lineWidth=u.team==='blue'?4.5:5.5; ctx.beginPath(); ctx.ellipse(px,py+5,r*0.95,r*0.45,0,0,7); ctx.stroke();
  ctx.strokeStyle=u.team==='blue'?'rgba(96,158,255,.4)':'rgba(255,45,45,.5)';
  ctx.lineWidth=u.team==='blue'?2:2.5; ctx.beginPath(); ctx.ellipse(px,py+5,r*1.3,r*0.62,0,0,7); ctx.stroke();
  if(fly){ ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.setLineDash([3,3]); ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(px,py+2); ctx.lineTo(px,py+dy+r-2); ctx.stroke(); ctx.setLineDash([]); }
  if(u.charging){ ctx.strokeStyle='rgba(255,215,94,.9)'; ctx.lineWidth=2.5;
    for(let s3=-1;s3<=1;s3++){ const a3=u.dir+Math.PI+s3*0.35;
      ctx.beginPath(); ctx.moveTo(cx0+Math.cos(a3)*(r+3),cy0+Math.sin(a3)*(r+3));
      ctx.lineTo(cx0+Math.cos(a3)*(r+15),cy0+Math.sin(a3)*(r+15)); ctx.stroke(); }
    if(Math.random()<0.4) addParts(px,py+3,1,'#e8d9a0',1.8,0.35,-20); }
  const __sp=(typeof SPR!=='undefined')?SPR[u.key]:null;const sprOK=__sp&&__sp.complete&&__sp.naturalWidth>0&&__sp.__valid!==false;
   const __fI=(typeof FRAMES!=='undefined')?FRAMES[u.key+'_idle']:null;const __fA=(typeof FRAMES!=='undefined')?FRAMES[u.key+'_atk']:null;const fOK=__fI&&__fI.complete&&__fI.naturalWidth>0&&__fI.__valid!==false;   /* v174: C안 전신 프레임 */var __ff=(u.swing>0)?((u.key==='boss'&&typeof ATK3!=='undefined'&&ATK3.boss&&ATK3.boss[1]&&ATK3.boss[1].complete&&ATK3.boss[1].naturalWidth>0)?ATK3.boss[1]:((__fA&&__fA.complete&&__fA.naturalWidth>0&&__fA.__valid!==false)?__fA:__fI)):__fI;
  ctx.save(); ctx.translate(cx0,cy0);
  var __face=u.team==='blue'?-Math.PI/2:Math.PI/2, __tw=0;
  if(u.target){ var __df=la-__face; __df=Math.atan2(Math.sin(__df),Math.cos(__df)); __tw=Math.max(-0.55,Math.min(0.55,__df)); }   // v71: Z축=타워 직립, 조준은 상체만
  if(u.recoilT>0){ u.recoilT-=0.017;
    var rb=Math.max(0,Math.sin(Math.min(1,u.recoilT/0.14)*Math.PI))*5.5, ra=(typeof u.recoilA==='number')?u.recoilA:u.dir;
    ctx.translate(-Math.cos(ra)*rb*0.7,-Math.sin(ra)*rb*0.35);
    ctx.rotate((sx>0?-1:1)*rb*0.055); }
  if(u.swing>0&&(u.key==='wizard'||u.key==='icem'||u.key==='babyd')){
    var __cg=u.key==='icem'?'rgba(156,220,255,':u.key==='babyd'?'rgba(255,157,60,':'rgba(255,177,77,';
    ctx.fillStyle=__cg+(0.5*Math.min(1,u.swing/0.2)+0.15)+')';
    ctx.beginPath(); ctx.arc(Math.cos(u.dir)*r*0.9,-r*0.75+Math.sin(u.dir)*r*0.4,r*(0.5+0.3*Math.sin(u.swing*10)),0,7); ctx.fill(); }
  if(u.hurt>0) u.hurt=Math.max(0,u.hurt-0.017);
  const moving=(!u.c.flying&&u.target&&dist(u,u.target)>u.c.range+u.target.r);
  const step=Math.sin(now*7.5+u.bob);
  const __mv=UMOT[u.key]||UMOT._def;
  if(__mv.flut) ctx.translate(0,Math.sin(now*11+u.bob)*1.6);
  if(__mv.halo){ ctx.strokeStyle='rgba(247,207,90,'+(0.35+0.2*Math.sin(now*3+u.bob))+')'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.ellipse(0,-r*1.75,r*0.55,r*0.22,0,0,7); ctx.stroke(); }
  if(__mv.dust&&!fly&&moving&&Math.random()<0.22) addParts(px-Math.cos(la)*r*0.5,py+4,1,'#c9b27a',1.1,0.3,-16);
  if(!fly&&moving){ const __sg=(step>=0)?1:-1; if(u._stl!==__sg){ u._stl=__sg; addParts(px-Math.cos(la)*r*0.35,py+4,1,'#c9b27a',1.0,0.28,-14); } }   /* v160: 발착 먼지 — 보행 위상 반전마다 */
  if(moving){ ctx.rotate(step*0.06); ctx.scale(1,1-Math.abs(step)*0.035); }
  { const shL=r*(u.key==='cannon'?2.55:3.6); if(!fOK) limbLegs(u,moving,shL); }   /* v157: 다리 스윙 — 스프라이트 뒤 */
  const hop=(!u.c.flying&&u.target&&dist(u,u.target)>u.c.range+u.target.r)?Math.abs(Math.sin(now*7.5+u.bob))*2.6:0;
  if(sprOK){ const sh=r*(u.key==='cannon'?2.55:3.6), __rig=(typeof PARTS!=='undefined')&&(PARTS[u.key+'_arm']&&PARTS[u.key+'_arm'].__valid!==false||PARTS[u.key+'_leg']&&PARTS[u.key+'_leg'].__valid!==false), aimF=(!__rig)&&(u.swing>0)&&ASPR[u.key]&&ASPR[u.key].complete;
    if(!moving&&!u.c.flying){ const br=1+Math.sin(now*2.6+u.bob)*0.018; ctx.scale(br,2-br); }
    const punch=u.swing>0?1+Math.sin(u.swing*Math.PI)*0.16:1;
    ctx.save(); ctx.scale(punch,punch);
    if(aimF&&u.key==='boss'&&ATK3.boss&&ATK3.boss[0]&&ATK3.boss[0].complete&&ATK3.boss[0].naturalWidth>0){ var __pB=1-u.swing/(u._swd||0.45), __fiB=__pB<0.33?0:(__pB<0.66?1:2), __bf=ATK3.boss[__fiB]; ctx.drawImage(raTint(__bf,u.team,u.key),-sh/2,-sh*0.82-hop,sh,sh); if(u.hurt>0){ ctx.globalCompositeOperation='lighter'; ctx.globalAlpha=Math.min(1,u.hurt/0.09)*0.75; ctx.drawImage(raTint(__bf,u.team,u.key),-sh/2,-sh*0.82-hop,sh,sh); ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1; } } else if(aimF){ var __IM=SPR[u.key], __AU=ASPR[u.key], __wy=-sh*0.30-hop;
      ctx.drawImage(__IM,0,__IM.naturalHeight*0.44,__IM.naturalWidth,__IM.naturalHeight*0.56,-sh/2,-sh*0.38-hop,sh,sh*0.56);
      ctx.translate(0,__wy);
      var __p=1-u.swing/(u._swd||0.45), __fr=ATK3[u.key], __imU=__AU, __crop=true;
      if(__fr&&__fr[0]&&__fr[0].complete&&__fr[0].naturalWidth>0){ var __fi=__p<0.33?0:(__p<0.66?1:2); __imU=__fr[__fi]; __crop=false; }
      var __ang=(__crop)?Math.sin(__p*Math.PI)*0.30:(__p<0.33?-0.34*(__p/0.33):0.30*Math.sin(Math.min(1,(__p-0.33)/0.67)*Math.PI));
      ctx.rotate(__tw+__ang);
      if(__crop) ctx.drawImage(__AU,0,0,__AU.naturalWidth,__AU.naturalHeight*0.66,-sh/2,-sh*0.32,sh,sh*0.66);
      else ctx.drawImage(__imU,-sh/2,-sh*0.32,sh,sh*0.66);
      if(u.hurt>0){ ctx.globalCompositeOperation='lighter'; ctx.globalAlpha=Math.min(1,u.hurt/0.09)*0.75;
        ctx.drawImage(__IM,0,__IM.naturalHeight*0.44,__IM.naturalWidth,__IM.naturalHeight*0.56,-sh/2,-sh*0.38-hop,sh,sh*0.56);
        if(__crop) ctx.drawImage(__AU,0,0,__AU.naturalWidth,__AU.naturalHeight*0.66,-sh/2,-sh*0.32,sh,sh*0.66);
        else ctx.drawImage(__imU,-sh/2,-sh*0.32,sh,sh*0.66);
        ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1; }
    } else {
      if(u.swing>0) ctx.rotate(Math.sin((1-u.swing/(u._swd||0.3))*Math.PI)*0.30);
      ctx.drawImage(fOK?raTint(__ff,u.team,u.key):raTint(SPR[u.key],u.team,u.key),-sh/2,-sh*0.82-hop,sh,sh);
      if(u.hurt>0){ ctx.globalCompositeOperation='lighter'; ctx.globalAlpha=Math.min(1,u.hurt/0.09)*0.75;
        ctx.drawImage(fOK?raTint(__ff,u.team,u.key):raTint(SPR[u.key],u.team,u.key),-sh/2,-sh*0.82-hop,sh,sh);
        ctx.globalCompositeOperation='source-over'; ctx.globalAlpha=1; }
    }
    { const shL=r*(u.key==='cannon'?2.55:3.6); if(!fOK){ limbArm(u,moving,shL,sx,la); limbHead(u,sh,shL,hop); limbWings(u,shL); } }   /* v158 팔 스윙·공격 뻗기 / v159 비행 날갯짓 */
    ctx.restore(); }
  else { drawBody(u,r,la);
    if(u.swing>0){ ctx.strokeStyle='rgba(255,255,255,.8)'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.arc(0,-r*0.6,r*1.1,-0.5,0.9); ctx.stroke(); } }
  ctx.restore();
  if(u.frozenT>0){ ctx.font='12px sans-serif'; ctx.textAlign='center'; ctx.fillText('🧊',cx0,py+dy-r-8); }
  else if(u.stun>0){ ctx.font='12px sans-serif'; ctx.textAlign='center'; ctx.fillText('💫',cx0,py+dy-r-8); }
  else if(u.burnT>0){ ctx.font='11px sans-serif'; ctx.textAlign='center'; ctx.fillText('🔥',cx0,py+dy-r-8); }
  else if(u.slowT>0){ ctx.font='11px sans-serif'; ctx.textAlign='center'; ctx.fillText('❄️',cx0,py+dy-r-8); }
  const bw=Math.max(24,r*1.5), bx=px-bw/2, by=py+dy-(sprOK?r*2.05:r)-8;
  ctx.fillStyle=u.team==='blue'?'rgba(63,123,245,.55)':'rgba(230,69,69,.55)'; roundRect(bx-1,by-1,bw+2,6,3); ctx.fill();
  const k=Math.max(0,u.hp/u.maxHp);
  ctx.fillStyle=u.team==='blue'?(k>0.5?'#4ade80':k>0.25?'#facc15':'#f87171'):(k>0.5?'#ff5252':k>0.25?'#ff7a45':'#ffb020');   /* v181: 팀별 HP바 — 아군 그린/적군 레드(저체력 경고는 계열 내 완화) */
  roundRect(bx,by,bw*k,4,2); ctx.fill();
  if(HPFR_IM.complete&&HPFR_IM.naturalWidth) ctx.drawImage(HPFR_IM,bx-6,by-7,bw+12,19);
  if(HPFR_IM.complete&&HPFR_IM.naturalWidth) ctx.drawImage(HPFR_IM,bx-4,by-5,bw+8,15);
  if(u.building){ ctx.strokeStyle='rgba(255,255,255,.6)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(px,py+dy-3,r+4,-Math.PI/2,-Math.PI/2+6.283*(u.life/30)); ctx.stroke(); }
}catch(__pe){ if(!window.__pe1)window.__pe1=__pe.message; }}
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
const PROJ_BASE={arrow:2.3562,bomb:0,bullet:0,cannon:3.1416,dragon:1.5708,fireball:0,ice:1.5708,kingshot:3.1416,wizfb:2.3562,zap:0};
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
  if(p.kind==='fireball'){
    const lift=Math.sin(Math.min(1,p.t)*Math.PI)*14, sz=54;
    const gl=ctx.createRadialGradient(px,py-lift,2,px,py-lift,36);
    gl.addColorStop(0,'rgba(255,140,40,.5)'); gl.addColorStop(1,'rgba(255,140,40,0)');
    ctx.fillStyle=gl; ctx.beginPath(); ctx.arc(px,py-lift,36,0,7); ctx.fill();
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
  const SZ={kingshot:40,arrow:46,bullet:30,bomb:40,wizfb:46,dragon:44,ice:38,cannon:34}[p.kind]||44;

  const va=visAngle(p,px,py2);

  bake16();
  const fr=PROJ16[p.kind];
  if(fr){ const fi=((Math.round(va/(Math.PI/8))%16)+16)%16; ctx.drawImage(fr[fi],px-SZ/2,py2-SZ/2,SZ,SZ); }
  else if(p.kind==='bullet'){ ctx.fillStyle='#ffe9a8'; ctx.beginPath(); ctx.arc(px,py2,3.2,0,7); ctx.fill(); }
  else { ctx.strokeStyle='#f4e9c8'; ctx.lineWidth=2.5; ctx.beginPath();
    ctx.moveTo(px-Math.cos(va)*8,py2-Math.sin(va)*8); ctx.lineTo(px+Math.cos(va)*5,py2+Math.sin(va)*5); ctx.stroke(); }
}
function drawFx(f){
  const k=f.t/f.dur, px=f.x*TILE, py=f.y*TILE;
  ctx.globalAlpha=Math.max(0,1-k);
  if(f.kind==='hit'){ ctx.fillStyle='#fff';
    for(let i=0;i<4;i++){ const a=i*1.57+0.6;
      ctx.fillRect(px+Math.cos(a)*6*(1+k*2)-1.5,py+Math.sin(a)*6*(1+k*2)-1.5,3,3); } }
    else if(f.kind==='slash'){
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
  else if(f.kind==='ring'){ ctx.strokeStyle=f.col; ctx.lineWidth=3; ctx.beginPath();
    ctx.ellipse(px,py,8+k*26,(8+k*26)*0.5,0,0,7); ctx.stroke(); }
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
  else if(f.kind==='flash'){ ctx.globalAlpha=(1-k)*0.45; ctx.fillStyle='#fff'; ctx.fillRect(-24,-24,W+48,H+48); }
  else if(f.kind==='crownfly'){
    const e=1-Math.pow(1-k,3), cx2=lerp(px,f.tx,e), cy2=lerp(py,f.ty,e)-Math.sin(Math.PI*e)*40;
    ctx.globalAlpha=1; ctx.font='26px sans-serif'; ctx.textAlign='center';
    ctx.fillText('👑',cx2,cy2);
  }
  else if(f.kind==='boom'){
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
  ctx.clearRect(-24,-24,W+48,H+48);
  { const cam=S.cam||{x:W/2,y:H/2,z:1};
    ctx.translate(W/2,H/2); ctx.scale(cam.z,cam.z); ctx.translate(-cam.x,-cam.y); }
  ctx.drawImage(bgc,0,0,W,H); tilehlDraw(ctx);   /* v149: 배치 가능 타일 하이라이트(유닛 아래 가이드) */
  const T=THEMES[S.theme];
  ctx.strokeStyle=T.spark; ctx.lineWidth=S.theme==='lava'?3:2;
  if(S.theme==='lava'){ ctx.save(); ctx.shadowColor='#ff8a2a'; ctx.shadowBlur=14; }
  for(let i=0;i<5;i++){
    const yy=(RIVER_Y0+0.35+i*0.4)*TILE, off=(now*36+i*77)%(W+80)-40;
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
    if(c.kind==='spell') ctx.fillRect(0,0,W,H);
    else ctx.fillRect(0,BLUE_DEPLOY_MIN*TILE,W,H-BLUE_DEPLOY_MIN*TILE);
    ctx.strokeStyle='rgba(255,255,255,.5)'; ctx.setLineDash([10,7]); ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(0,BLUE_DEPLOY_MIN*TILE); ctx.lineTo(W,BLUE_DEPLOY_MIN*TILE); ctx.stroke(); ctx.setLineDash([]);
  }
  try{for(const t of towers) if(t.dead) drawRubble(t);}catch(__e){window.__skip=(window.__skip||0)+1;console.warn("draw-skip",__e.message);}
  try{for(const t of towers) if(!t.dead) drawTower(t);}catch(__e){window.__skip=(window.__skip||0)+1;console.warn("draw-skip",__e.message);}
  try{for(const u of [...units].sort((a,b)=>a.y-b.y)) drawUnit(u);}catch(__e){window.__skip=(window.__skip||0)+1;console.warn("draw-skip",__e.message);}
  try{for(const p of projs) drawProj(p);}catch(__e){window.__skip=(window.__skip||0)+1;console.warn("draw-skip",__e.message);}
  for(const f of fx) drawFx(f);
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
    ctx.fillStyle=f.col; ctx.fillText(f.txt,f.x*TILE,f.y*TILE-k*18);
    ctx.globalAlpha=1;
  }
  ctx.restore();
  drawVignette();

  try{ drawFrame(); }catch(e){}   // v123: 프레임 드로우 — 최상위 레이어(스크린 공간)
}

/* ---------- 입력 ---------- */
function evtPos(e){
  const r=canvas.getBoundingClientRect();
  const s=Math.min(r.width/W,r.height/H), ox=(r.width-W*s)/2, oy=(r.height-H*s)/2;
  let px=(e.clientX-r.left-ox)/s, py=(e.clientY-r.top-oy)/s;
  const cam=S.cam||{x:W/2,y:H/2,z:1};
  px=(px-W/2)/cam.z+cam.x; py=(py-H/2)/cam.z+cam.y;   // 컴뱃 캠 역변환
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
    const c=S.cam, vw=W/c.z, vh=H/c.z;
    c.x=clamp(c.x-dx/c.z,vw/2,W-vw/2); c.y=clamp(c.y-dy/c.z,vh/2,H-vh/2);
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
function buildHandUI(){
  const box=$('#cards'); box.innerHTML=''; cardEls=[];
  for(let i=0;i<4;i++){
    const d=document.createElement('div'); d.className='card';
    d.innerHTML='<div class="cost"><span></span></div><div class="emoji"></div><div class="nm"></div>';
    d.addEventListener('pointerdown',()=>{ ensureAudio(); if(S.over) return;
      P.sel=i; dragFrom=i; syncHand(); try{ tutCardTap(i); }catch(e){} });   /* v147 */
    box.appendChild(d); cardEls.push(d);
  }
  syncHand();
}
function syncHand(){
  try{ if(TUT.on&&(TUT.step===1||TUT.step===4)) setTimeout(tutShow,0); }catch(e){}   /* v147: 핸드 재구성 후 링·디밍 재적용(buildHandUI가 카드 DOM을 재생성하는 결함 수복) */
  for(let i=0;i<4;i++){
    const d=cardEls[i]; if(!d) continue;
    const k=P.hand[i], c=CARDS[k];
    d.classList.remove('rar-c','rar-r','rar-e'); d.classList.add('rar-'+((k&&RAR[k])||'c'));
    if(d.dataset.k!==k){ d.dataset.k=k;
      d.querySelector('.emoji').innerHTML=ART[k]?`<img class="art" src="${ART[k]}" alt="">`:c.emoji;
      d.querySelector('.nm').textContent=c.name;
      d.querySelector('.cost span').textContent=c.cost;
      const rr=RARC[RKEY[k]||'c'];
      d.style.setProperty('--c-top',rr[0]); d.style.setProperty('--c-mid',rr[1]); d.style.setProperty('--c-bot',rr[2]); }
    d.classList.toggle('sel',P.sel===i);
    d.classList.toggle('poor',P.elixir<c.cost);
  }
  const nk=P.queue[0];
  $('#next-card').innerHTML= nk?`<span class="emoji">${ART[nk]?`<img class="art" src="${ART[nk]}" alt="">`:CARDS[nk].emoji}</span><span class="nm">${CARDS[nk].name}</span>`:'';
}
function syncHUD(){
  $('#elixir-fill').style.width=(P.elixir*10)+'%';
  $('#elixir-num').textContent=Math.floor(P.elixir);
  var __full=P.elixir>=9.999;
  var __ef=document.getElementById('elixir-fill');
  if(__ef){ var __fw=__ef.classList.toggle('exl-full',__full&&!S.over); try{ if(__fw&&!P._warned){ P._warned=true; toast('엘릭서 만땅 — 카드를 사용해 주세요'); } }catch(e2){} if(!__full) P._warned=false; }   /* v139: 만원 낭비 방지 펄스 */
  $('#elixir-fill').classList.toggle('full',__full);
  $('#elixir-track').classList.toggle('full',__full);
  $('#elixir-num').classList.toggle('full',__full);
  if(__full&&!P._full){ tone(620,.09,'sine',.05); setTimeout(function(){ tone(930,.14,'sine',.05); },90); }
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
  if(S.scene==='battle') for(let i=0;i<4;i++){
    const d=cardEls[i]; if(!d) continue;
    d.classList.toggle('poor',P.elixir<CARDS[P.hand[i]].cost);
    d.classList.toggle('sel',P.sel===i);
  }
}

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
function dpswRender(){ try{ const w=document.getElementById('dpsw'); if(!w||typeof S==='undefined'||!S||S.pre!==0||S.over){ if(w) w.classList.add('hidden'); return; } w.classList.remove('hidden'); const ks=Object.keys(DPSW.cnt).filter(function(k){ return DPSW.cnt[k]>0; }); let tot=0; ks.forEach(function(k){ tot+=DPSW.acc[k]||0; }); const dps=tot/Math.max(1,DPSW.time); w.querySelector('.dw-t').textContent=DPSW.open?('📊 DPS '+Math.round(dps)+' ▾'):'📊 DPS ▸'; const b=w.querySelector('.dw-b'); if(!DPSW.open){ b.style.display='none'; return; } b.style.display='flex'; b.innerHTML=ks.sort(function(a,c){ return (DPSW.acc[c]||0)-(DPSW.acc[a]||0); }).slice(0,5).map(function(k){ const c=CARDS[k]||{}; const d=Math.round((DPSW.acc[k]||0)/Math.max(1,DPSW.time)); return '<div class="dw-r"><b>'+d+'</b><span class="dw-n">'+(c.name||k)+'</span><span>×'+DPSW.cnt[k]+'</span></div>'; }).join('')||'<div class="dw-r"><span>배치 대기 중</span></div>'; }catch(e){} }


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
function heroPlxEnsure(){ if(document.getElementById('plxst')) return; const st=document.createElement('style'); st.id='plxst'; st.textContent='#screen-title .t-hero img,#screen-title .t-hero h1,#screen-title .t-hero{transition:transform .18s ease-out;will-change:transform}'; document.head.appendChild(st); }
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

function startMatch(){
  try{ if(false&&typeof localStorage!=='undefined'&&localStorage.getItem('ra_tut_done')!=='1'&&!localStorage.getItem('ra_hist_v1')) tutBegin();   /* v176: 튜토리얼 모드 일단 제외 — 재활성 시 if(false&&) 제거 */ }catch(e){}   /* v147: 첫 실행(기록 없음)만 활성 */
  units=[];projs=[];fx=[];floats=[];parts=[];ambient=[];
  S.over=false;S.shown=false;S.winner=null;S.t=300;S.overtime=false;S.double=false;   /* v142: 경기 시간 5분 */
  try{ DPSW.acc={}; DPSW.cnt={}; DPSW.time=0; DPSW._c=0; dpswEnsure(); }catch(e){}  try{ heroPlxReset(); }catch(e){}   /* v150: 전투 진입 시 패럴럭스 리셋 */S.crowns={blue:0,red:0};   /* v148: 위젯 리셋 */ S.kills={blue:0,red:0}; S.deaths={blue:0,red:0}; S.spells={blue:0,red:0}; S.shake=0; S.clash=null; S.cam={x:W/2,y:H/2,z:1}; S._home={x:W/2,y:H/2,z:1}; S.focus=null; S.slow=0; S.spellQuiet=0; S._sk={}; try{ relayoutHud(); }catch(e){}   // v122: 경기 시작 기둥 배치   // v115: 초기 화면 상태 기억 — 강제 복귀 기준점 + v118: 주문 진정 기간 리셋   // v111: 구 추적 객체 2종 폐지(단일 S.focus만) S.boss=null; S.bossSpawned=false; S.ks=false; S.ksCd=0; S.focusGap=0; S.zHold=0; S._tp=0; S.repCd=0; S.__used={}; try{ syncGradeVisual(); }catch(e){} try{ S.relic=(function(){try{return localStorage.getItem('ra_relic_v1')||''}catch(e){return ''}})(); applyRelics(); applySkills(); }catch(e){}   // v119: 스킬트리 반영
  P.elixir=5;A.elixir=5;A.timer=4.5;P.sel=null;P._full=false;
  try{ var __sb2=document.getElementById('screen-battle'); if(__sb2) __sb2.classList.remove('ended'); }catch(e){}
  initDeck(P);initDeck(A,true);   /* v192: 적 덱 = 아군과 무관 랜덤 */
  try{ window.__qaDecks={blue:P.hand.join(','),red:A.hand.join(',')}; }catch(e){ }
  buildTowers(); drawStatic();
  buildHandUI();
  show('battle');
  bgmStart();
  S.pre=3.6;
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
    d.innerHTML=`<div class="e">${ART[k]?`<img class="art" src="${ART[k]}" alt="">`:c.emoji}</div><div class="n">${c.name}</div><div class="s">${c.desc}</div><div class="c">💧${c.cost}</div>`;
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
  __hits.forEach(function(h){ var __inner=__hits.some(function(h2){ return h2[0]!==h[0]&&h[0].contains(h2[0]); }); if(!__inner){ h[0].classList.add(h[1]); if(h[1]==='ui-nav') n++; } });
  ['ks-btn','repair-btn'].forEach(function(id){ var b=document.getElementById(id); if(b){ b.classList.add('ui-skill'); } });

}catch(e){} };
(function(){ try{ if(!document.getElementById('ui-v179')){ var s2=document.createElement('style'); s2.id='ui-v179'; s2.textContent='#overlay-result #btn-again{display:inline-block!important;width:57%!important;vertical-align:top!important;box-sizing:border-box!important}#overlay-result #btn-home{display:inline-block!important;width:40%!important;margin-left:2%!important;vertical-align:top!important;box-sizing:border-box!important}'; document.head.appendChild(s2); } }catch(e){} })();
(function(){ try{ var stHof=document.getElementById('ui-v182'); if(!stHof){ stHof=document.createElement('style'); stHof.id='ui-v182'; stHof.textContent='#overlay-hof{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column}#overlay-hof.hidden{display:none!important}#overlay-hof .hof-card{display:flex;flex-direction:column;position:relative;height:auto;min-height:340px;max-height:86vh;transform:none!important;animation:none!important}#overlay-hof .hof-card>*{flex:none;position:static!important;height:auto!important;transform:none!important;animation:none!important}#overlay-hof .hof-rows{min-height:0;overflow-y:auto}'; document.head.appendChild(stHof); } }catch(e){} })();
window.__uiUp(); window.addEventListener('load',function(){ try{ window.__uiUp(); }catch(e){} }); setInterval(function(){ try{ window.__uiUp(); }catch(e){} },1000);
$('#btn-home').addEventListener('click',()=>show('title'));
$('#btn-sound').addEventListener('click',()=>{ S.muted=!S.muted; try{ localStorage.setItem('ra_muted',S.muted?'1':'0'); }catch(e){}; $('#btn-sound').textContent=S.muted?'🔇':'🔊'; });
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
  const bw=Math.min(380,W-60), x=(W-bw)/2, y=10, h=30;
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
const HOF_KEY='ra_hof_v1';
function hofLoad(){ try{ const a=JSON.parse(localStorage.getItem(HOF_KEY)||'[]'); if(!Array.isArray(a)) return []; return a.filter(function(e){ return e&&typeof e.s==='number'&&isFinite(e.s); }).slice(0,5); }catch(e){ return []; } }
function hofSave(a){ try{ localStorage.setItem(HOF_KEY,JSON.stringify(a)); }catch(e){} }
function hofRecord(sc){ try{ if(typeof sc!=='number'||!isFinite(sc)||sc<=0) return; const a=hofLoad(); a.push({ s:Math.round(sc), w:(S.winner==='blue')?1:0, d:new Date().toLocaleDateString('ko-KR'), t:Date.now() }); a.sort(function(x,y){ return y.s-x.s||x.t-y.t; }); hofSave(a.slice(0,5)); }catch(e){} }
function fmtScore(n){ n=Math.round(n); if(n>=1e6) return parseFloat((n/1e6).toFixed(1))+'M'; if(n>=1e3) return parseFloat((n/1e3).toFixed(1))+'k'; return String(n); }
function renderHof(){ try{
  const a=hofLoad(), pod=document.getElementById('hof-pod'), rows=document.getElementById('hof-rows');
  if(!pod||!rows) return;
  const cell=function(ri){ const e=a[ri]; const rc=['','r1','r2','r3'][ri+1];
    if(!e) return '<div class="pod p'+(ri+1)+'"><div class="pod-rank '+rc+'">'+(ri+1)+'위</div><div class="pod-score">—</div><div class="pod-date">기록 없음</div></div>';
    return '<div class="pod p'+(ri+1)+'"><div class="pod-rank '+rc+'">'+(ri+1)+'위</div><div class="pod-score">'+fmtScore(e.s)+'</div><div class="pod-date">'+e.d+(e.w?' 🏆':'')+'</div></div>'; };
  pod.innerHTML=cell(1)+cell(0)+cell(2);
  rows.innerHTML=a.slice(3).map(function(e,i){ return '<div class="hof-row"><span class="hr-rank">'+(i+4)+'위</span><span class="hr-score">'+fmtScore(e.s)+'</span><span class="hr-date">'+e.d+(e.w?' 🏆':'')+'</span></div>'; }).join('')||'<div class="hof-empty">아직 기록이 없습니다 — 전투에서 최고 스코어를 남겨 보세요!</div>';
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
  const vw=W/c.z, vh=H/c.z;
  c.x=clamp(c.x,vw/2,W-vw/2); c.y=clamp(c.y,vh/2,H-vh/2);   // 아레나 밖 노출 방지
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
buildCodex();
$('#elixir-ticks').innerHTML='<i></i>'.repeat(9);
document.querySelectorAll('.t-btn[data-theme]').forEach(b=>b.addEventListener('click',()=>{
  S.theme=b.dataset.theme; drawStatic();   // 지면·강 톤 재페인트
  document.querySelectorAll('.t-btn[data-theme]').forEach(x=>x.classList.toggle('sel',x===b));
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
  btn.onclick=function(){
    var q=shuffle([...DECK]).slice(0,8);
    try{ __raSaveDeck(q); }catch(e){ }
    var cur=document.getElementById('deck-edit'); if(cur) cur.remove();
    openDeckEditor();
    try{ toast('덱을 랜덤으로 구성했어요'); }catch(e){ }
  };
  var saveB=null; [].slice.call(de.querySelectorAll('button')).forEach(function(b){ if(/저장/.test(b.textContent||'')) saveB=b; });
  if(saveB&&saveB.parentNode){ saveB.parentNode.insertBefore(btn,saveB); } else de.appendChild(btn);
}
(function(){ var orig=openDeckEditor;
  openDeckEditor=function(){ var r=orig.apply(this,arguments); try{ setTimeout(__raAddRandomBtn,40); }catch(e){ } return r; };
})();
