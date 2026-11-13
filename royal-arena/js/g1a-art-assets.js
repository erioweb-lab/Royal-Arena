/* royal-arena v188 split — blocks [0,1,2,3,4,5,6,7,8,9,10,11] order-preserved */
'use strict';
const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
let uid=1, now=0;

/* ---------- 아레나 상수 (REA 설계도 §1) ---------- */
const COLS=18, ROWS=32, TILE=34, W=COLS*TILE, H=ROWS*TILE;   // 플레이 영역 612×1088
let VW=W, BAND=0, VH=H, VBAND=0;   /* v391 */
var __rollWide=function(){ try{ VW=W; BAND=0; VH=H; VBAND=0; drawStatic(); }catch(e){} };   /* v390: g9 미로드 폴백 */
const RIVER_Y0=15, RIVER_Y1=17, RIVER_MID=16;                 // 강: 15~17행
let BRIDGES=[3.5,14.5];
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
  zap:      {name:'번개',     emoji:'⚡', cost:3, kind:'spell', dmg:140, towerDmg:40, radius:1.6, stun:0.8, desc:'기절 0.8초+번개 폭풍 3.5초'}   /* v408: 지속 번개 존 리워드(1안) — 코스트 2→3, 틱 6dps+진입 미니기절 0.3s */,
  valk:     {name:'도끼전사', emoji:'🪓', cost:4, count:1, hp:2600, dmg:130, hs:1.5, range:1.0, spd:1.1, flying:false, hitsAir:false, targets:'any', r:0.55, splash:1.3, desc:'주변 광역 근접'},
  bomber:   {name:'폭탄병',   emoji:'🧨', cost:3, count:1, hp:600,  dmg:130, hs:1.9, range:4.5, spd:1.3, flying:false, hitsAir:false, targets:'ground', r:0.40, splash:1.3, desc:'지상 폭탄 던지기'},
  babyd:    {name:'아기 드래곤', emoji:'🐉', cost:4, count:1, hp:1800, dmg:100, hs:1.6, range:3.2, spd:1.2, flying:true, hitsAir:true, targets:'any', r:0.50, splash:1.0, desc:'비행 화염 브레스'},
  cleric:   {name:'성직자',   emoji:'💚', cost:3, count:1, hp:900,  heal:60, hs:1.4, range:0, spd:1.1, flying:false, hitsAir:false, targets:'any', r:0.45, desc:'아군 지속 회복 60'},
  boar:     {name:'돌격 멧돼지', emoji:'🐗', cost:4, count:1, hp:2300, dmg:160, hs:1.5, range:0.9, spd:2.0, flying:false, hitsAir:false, targets:'buildings', r:0.55, charge:true, desc:'건물만 빠른 돌진'},
  icem:     {name:'서리 마법사', emoji:'❄️', cost:4, count:1, hp:840,  dmg:90,  hs:1.4, range:5.0, spd:1.1, flying:false, hitsAir:true, targets:'any', r:0.45, splash:1.4, slow:1.5, desc:'적중 시 둔화 · 광역'}   /* v213 보정: 밸런스 패스(중앙값 대비 -45% 경계 → hs 1.4) */,
  meteor:   {name:'유성우',     emoji:'☄️', cost:5, kind:'spell', dmg:420, towerDmg:150, radius:2.0, desc:'낙하 유성 · 착탄 화상 3초'},
  blizzard: {name:'눈보라',     emoji:'🌨️', cost:4, kind:'spell', dmg:180, towerDmg:60, radius:2.4, slow:3, desc:'광역 둔화 3초 주문'},
  greed:    {name:'탐욕 정령',   emoji:'😈', cost:2, count:1, hp:520,  dmg:230, hs:1.3, range:0.9, spd:2.2, flying:false, hitsAir:false, targets:'any', r:0.42, charge:true, desc:'트레이드오프 — 초고속 고화력·최소 체력'},
  glass:    {name:'유리 대포',   emoji:'🎇', cost:4, kind:'building', count:1, hp:520, dmg:230, hs:1.6, range:6.0, hitsAir:true, targets:'any', r:0.68, life:15, splash:1.2, desc:'트레이드오프 — 강력 포격·수명 15초'},
  fort:     {name:'최전방 요새', emoji:'🏰', cost:5, kind:'building', count:1, hp:2600, dmg:45, hs:1.8, range:4.5, hitsAir:true, targets:'any', r:0.75, life:40, desc:'트레이드오프 — 견고한 방벽·약한 화력'},
  lordknight:{name:'기사단장',   emoji:'👑', cost:6, count:1, hp:3200, dmg:220, hs:1.3, range:1.0, spd:1.0, flying:false, hitsAir:false, targets:'any', r:0.60, splash:1.4, desc:'에픽 — 광역 일격 근접 대장'},
  xbow:     {name:'석궁병',     emoji:'🏹', cost:3, count:1, hp:640,  dmg:95,  hs:1.0, range:4.5, spd:1.2, flying:false, hitsAir:true, targets:'any', r:0.42, desc:'속사 원거리 · 대공'},
  healwind: {name:'회복의 바람', emoji:'🍃', cost:3, kind:'spell', heal:160, radius:2.5, desc:'아군 광역 회복+잔류 존 3초'}   /* v409: 잔류 회복 존 리워드 — 즉발 160+존 틱 10dps(총 190) */,
  flamer:   {name:'화염방사병', emoji:'🔥', cost:4, count:1, hp:960,  dmg:85,  hs:0.8, range:1.2, spd:1.1, flying:false, hitsAir:false, targets:'any', r:0.45, splash:1.0, desc:'근접 속사 광역 화염'},
  golem:    {name:'수정 골렘',  emoji:'💎', cost:6, count:1, hp:5200, dmg:140, hs:1.8, range:1.0, spd:0.7, flying:false, hitsAir:false, targets:'buildings', r:0.70, desc:'초대형 건물 탱커'},
  scarecrow:{name:'허수아비',   emoji:'🎭', cost:1, count:1, hp:950,  dmg:6,   hs:1.0, range:0.5, spd:1.4, flying:false, hitsAir:false, targets:'any', r:0.40, desc:'미끼 — 값싼 어그로 방벽'},
  plasma:{name:'플라즈마',    emoji:'🌀', cost:4, kind:'spell', dmg:280, towerDmg:110, radius:1.4, desc:'플라즈마탄 발사 — 피해+화상 3초+잔류 존'},
  venom:{name:'맹독 안개',    emoji:'☠️', cost:4, kind:'spell', dmg:85,  towerDmg:50,  radius:2.2, desc:'광역 맹독 — 중독 틱 6초'},
  shock:{name:'충격파',      emoji:'💫', cost:5, kind:'spell', dmg:160, towerDmg:70,  radius:2.6, stun:0.5, desc:'광역 기절 0.5초+넉백'}   /* v409: 넉백 추가 */,
  netter:   {name:'그물 척후병', emoji:'🥅', cost:3, count:1, hp:620,  dmg:60,  hs:1.3, range:4.5, spd:1.1, flying:false, hitsAir:true, targets:'any', r:0.42, splash:0.9, slow:2.0, desc:'적중 시 둔화 2초 · 소형 그물'},
  buzzer:   {name:'자폭 벌레',   emoji:'🐛', cost:2, count:1, hp:380,  dmg:190, hs:1.0, range:0.8, spd:1.6, flying:false, hitsAir:false, targets:'any', r:0.40, splash:1.6, desc:'적에게 폭발 후 소멸 — 광역 190'},
  batqueen: {name:'박쥐 여왕',   emoji:'🦇', cost:5, count:1, hp:2400, dmg:80,  hs:1.6, range:0.9, spd:0.9, flying:false, hitsAir:false, targets:'any', r:0.60, desc:'5초마다 아기 박쥐 소환(최대 3)'},
  catapult: {name:'투석 수레',   emoji:'🎪', cost:4, kind:'building', count:1, hp:850, dmg:150, hs:2.4, range:6.5, hitsAir:false, targets:'ground', r:0.72, life:30, splash:1.6, desc:'최장 사거리 투석 · 지상 광역'},
};
const DECK=['knight','archers','giant','minions','musketeer','fireball','skarmy','cannon','wizard','sniper','prince','zap','valk','bomber','babyd','cleric','boar','icem','meteor','blizzard','greed','glass','fort','lordknight','xbow','healwind','flamer','golem','scarecrow','plasma','venom','shock','netter','buzzer','batqueen','catapult'];   /* v411: 신규 4종 — 그물·자폭·소환사·투석 */   /* v214: 29종 — 화염방사병·수정 골렘·허수아비 */   /* v324: 주문 3종 추가 — 32종 */
const __ch2=document.getElementById('cards-h2'); if(__ch2) __ch2.textContent='🃏 카드 도감 ('+DECK.length+'종)';
const __cs=document.getElementById('cards-sub'); if(__cs) __cs.textContent=DECK.length+'종 카드로 승부하는 실시간 아레나 배틀';
/* ---------- 아레나 테마 (레퍼런스: 클래시 로얄 스토어 스크린샷) ---------- */
const THEMES={
  classic:{g1:'#59963e',g2:'#67ab49',speck:'rgba(255,255,255,.07)',blade:'rgba(30,70,20,.28)',
    road:'rgba(196,164,108,.30)',riverA:'#2874ae',riverB:'#3d9be9',spark:'rgba(255,255,255,.35)',
    bush:'#3f7a2f',flower:'#e8b4d8',stone:'#9aa3ae',stoneHi:'#b7bfc9',stoneEdge:'rgba(60,70,80,.5)',amb:null},
  lava:{g1:'#54403c',g2:'#63493f',speck:'rgba(255,140,60,.10)',blade:'rgba(255,120,40,.20)',
    road:'rgba(255,180,110,.22)',riverA:'#a83b12',riverB:'#e86a1e',spark:'rgba(255,220,120,.65)',
    bush:'#8a4a20',flower:'#ffcf5e',stone:'#6f6a72',stoneHi:'#8a8490',stoneEdge:'rgba(35,25,30,.6)',amb:null},   /* v381: 라바 엠버 제거 — 유닛 위로 떠오르는 붉은 점을 투사체로 오인하는 혼란 방지(순수 장식, 전투 기능 없음) */
  ice:{g1:'#a9cde3',g2:'#c2e0f0',speck:'rgba(255,255,255,.50)',blade:'rgba(120,170,210,.35)',
    road:'rgba(180,205,230,.55)',riverA:'#7fb6d9',riverB:'#a8d8f0',spark:'rgba(255,255,255,.65)',
    bush:'#7fa8c4',flower:'#ffffff',stone:'#9fb4c4',stoneHi:'#c4d6e4',stoneEdge:'rgba(70,95,120,.5)',amb:'snow'},
  wasteland:{g1:'#8a7a4a',g2:'#9c8a56',speck:'rgba(255,240,180,.10)',blade:'rgba(120,100,40,.25)',
    road:'rgba(210,180,120,.35)',riverA:'#3a7d6b',riverB:'#57a68f',spark:'rgba(255,235,170,.5)',
    bush:'#6b6a2f',flower:'#d9c46b',stone:'#8f8574',stoneHi:'#ab9f8a',stoneEdge:'rgba(60,50,30,.55)',amb:null},
  abyss:{g1:'#2a2d4a',g2:'#343857',speck:'rgba(140,120,255,.10)',blade:'rgba(90,80,180,.28)',
    road:'rgba(120,110,200,.22)',riverA:'#453a8f',riverB:'#6a5ac9',spark:'rgba(180,160,255,.6)',
    bush:'#3a3a6e',flower:'#9f8fff',stone:'#5a5f7d',stoneHi:'#767c9d',stoneEdge:'rgba(20,20,45,.6)',amb:null}
};
const RARC={c:['#8fa6bd','#4a5f85','#22304f'], r:['#e8b053','#916022','#4e2f10'], e:['#cf6df5','#7233a8','#2e1150']};
const RKEY={giant:'r',musketeer:'r',wizard:'r',fireball:'r',sniper:'r',prince:'e',zap:'e',valk:'r',babyd:'r',cleric:'e',boar:'r',icem:'r'};
const RAR={knight:'c',archers:'c',minions:'c',cannon:'c',zap:'c',giant:'r',musketeer:'r',fireball:'r',wizard:'r',sniper:'r',skarmy:'e',prince:'e',valk:'r',bomber:'c',babyd:'r',cleric:'e',boar:'r',icem:'r'};
const ART={knight:"assets/img_017.jpg",archers:"assets/img_018.jpg",giant:"assets/img_019.jpg",minions:"assets/img_020.jpg",musketeer:"assets/img_021.jpg",fireball:"assets/img_022.jpg",skarmy:"assets/img_023.jpg",cannon:"assets/img_024.jpg",wizard:"assets/img_025.jpg",sniper:"assets/img_026.jpg",prince:"assets/img_027.jpg",zap:"assets/img_028.jpg",boss:"assets/img_029.png",valk:"assets/ra_card_valk.jpg",cleric:"assets/ra_card_cleric.jpg",icem:"assets/ra_card_icem.jpg",bomber:"assets/ra_card_bomber.jpg",boar:"assets/ra_card_boar.jpg",babyd:"assets/ra_card_babyd.jpg"};   /* v299: 신규 유닛 카드 아트 */


'use strict';
const ART_SPR={knight:"assets/img_030.png",archers:"assets/img_031.png",giant:"assets/img_032.png",minions:"assets/img_033.png",musketeer:"assets/img_034.png",wizard:"assets/img_035.png",skarmy:"assets/img_036.png",prince:"assets/img_037.png",sniper:"assets/img_038.png",cannon:"assets/img_039.png"};


'use strict';
const ART_TOW={t_princess_b:"assets/img_040.png",t_princess_r:"assets/img_041.png",t_king_b:"assets/img_042.png",t_king_r:"assets/img_043.png",t_rubble:"assets/img_044.png",t_princess_lava:"assets/ra_tow_princess_lava.png",t_princess_ice:"assets/ra_tow_princess_ice.png",t_princess_wasteland:"assets/ra_tow_princess_wasteland.png",t_princess_abyss:"assets/ra_tow_princess_abyss.png"};   /* v324: 프린세스 타워 테마 스킨 */
const ART_NEW={valk:"assets/img_045.jpg",bomber:"assets/img_046.jpg",babyd:"assets/img_047.jpg",cleric:"assets/img_048.jpg",boar:"assets/img_049.jpg",icem:"assets/img_050.jpg",lordknight:"assets/ra_card_lordknight.jpg",scarecrow:"assets/ra_card_scarecrow.jpg",meteor:"assets/ra_card_meteor.jpg",blizzard:"assets/ra_card_blizzard.jpg",greed:"assets/ra_card_greed.jpg",glass:"assets/ra_card_glass.jpg",fort:"assets/ra_card_fort.jpg",xbow:"assets/ra_card_xbow.jpg",healwind:"assets/ra_card_healwind.jpg",flamer:"assets/ra_card_flamer.jpg",golem:"assets/ra_card_golem.jpg",plasma:"assets/ra_card_plasma.jpg",venom:"assets/ra_card_venom.jpg",shock:"assets/ra_card_shock.jpg",netter:"assets/ra_card_netter.jpg?v=411",buzzer:"assets/ra_card_buzzer.jpg?v=411",batqueen:"assets/ra_card_batqueen.jpg?v=411",catapult:"assets/ra_card_catapult.jpg?v=411"}   /* v411: 신규 4종 카드 아트 */;   /* v300: 이모지 카드 아트 + 무프레임 재생성 */


'use strict';
const ART_SPR_NEW={valk:"assets/img_051.png",bomber:"assets/img_052.png",babyd:"assets/img_053.png",cleric:"assets/img_054.png",boar:"assets/img_055.png",icem:"assets/img_056.png",xbow:"assets/ra_spr_xbow.png",flamer:"assets/ra_spr_flamer.png",golem:"assets/ra_spr_golem.png",greed:"assets/ra_spr_greed.png",lordknight:"assets/ra_spr_lordknight.png",scarecrow:"assets/ra_spr_scarecrow.png",fort:"assets/ra_spr_fort.png",glass:"assets/ra_spr_glass.png"};   /* v304: 확장 유닛 필드 스프라이트 */
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
const ART_PROJ={fireball:"assets/img_071.png",zap:"assets/img_072.png","arrow":"assets/img_073.png","bullet":"assets/img_074.png","bomb":"assets/img_075.png","wizfb":"assets/img_076.png","dragon":"assets/img_077.png","ice":"assets/img_078.png","cannon":"assets/img_079.png",bolt:"assets/ra_proj_bolt.png",kingshot:"assets/ra_proj_kingshot.png",net:"assets/ra_proj_net.png?v=468",stone:"assets/ra_proj_stone.png?v=469"};   /* v334: 석궁 볼트·킹샷 스프라이트 — 캔버스 폴백 해소(화풍 통일) */


'use strict';
const ART_PARTS={wizard_head:"assets/img_080.png",valk_head:"assets/img_081.png",sniper_head:"assets/img_082.png",skarmy_head:"assets/img_083.png",prince_head:"assets/img_084.png",musketeer_head:"assets/img_085.png",minions_head:"assets/img_086.png",knight_head:"assets/img_087.png",icem_head:"assets/img_088.png",giant_head:"assets/img_089.png",cleric_head:"assets/img_090.png",boss_head:"assets/img_091.png",bomber_head:"assets/img_092.png",boar_head:"assets/img_093.png",babyd_head:"assets/img_094.png",archers_head:"assets/img_095.png",archers_arm:"assets/img_096.png",archers_leg:"assets/img_097.png",arrow:"assets/img_098.png",boar_leg:"assets/img_099.png",bomber_arm:"assets/img_100.png",bomber_leg:"assets/img_101.png",boss_arm:"assets/img_102.png",boss_leg:"assets/img_103.png",cleric_arm:"assets/img_104.png",cleric_leg:"assets/img_105.png",giant_arm:"assets/img_106.png",giant_leg:"assets/img_107.png",icem_arm:"assets/img_108.png",icem_leg:"assets/img_109.png",knight_arm:"assets/img_110.png",knight_leg:"assets/img_111.png",musketeer_arm:"assets/img_112.png",musketeer_leg:"assets/img_113.png",prince_arm:"assets/img_114.png",prince_leg:"assets/img_115.png",skarmy_arm:"assets/img_116.png",skarmy_leg:"assets/img_117.png",sniper_arm:"assets/img_118.png",sniper_leg:"assets/img_119.png",valk_arm:"assets/img_120.png",valk_leg:"assets/img_121.png",w_axe:"assets/img_122.png",w_bomb:"assets/img_123.png",w_bow:"assets/img_124.png",w_dagger:"assets/img_125.png",w_greatsword:"assets/img_126.png",w_musket:"assets/img_127.png",w_sniper:"assets/img_128.png",w_staff:"assets/img_129.png",w_sword:"assets/img_130.png",wing_babyd:"assets/img_131.png",wing_minion:"assets/img_132.png",wizard_arm:"assets/img_133.png",wizard_leg:"assets/img_134.png"};


'use strict';
const ART_CORE={archers:"assets/img_135.png",babyd:"assets/img_136.png",boar:"assets/img_137.png",bomber:"assets/img_138.png",boss:"assets/img_139.png",cleric:"assets/img_140.png",giant:"assets/img_141.png",icem:"assets/img_142.png",knight:"assets/img_143.png",minions:"assets/img_144.png",musketeer:"assets/img_145.png",prince:"assets/img_146.png",skarmy:"assets/img_147.png",sniper:"assets/img_148.png",valk:"assets/img_149.png",wizard:"assets/img_150.png",netter:"assets/ra_spr_netter.png?v=411",buzzer:"assets/ra_spr_buzzer.png?v=411",batqueen:"assets/ra_spr_batqueen.png?v=411",catapult:"assets/ra_spr_catapult.png?v=411"}   /* v411: 신규 본체 */;


'use strict';
const ART_FRAMES={knight_idle:"assets/img_151.png",knight_atk:"assets/img_152.png",prince_idle:"assets/img_153.png",prince_atk:"assets/img_154.png",valk_idle:"assets/img_155.png",valk_atk:"assets/img_156.png",skarmy_idle:"assets/img_157.png",skarmy_atk:"assets/img_158.png",archers_idle:"assets/img_159.png",archers_atk:"assets/img_160.png",musketeer_idle:"assets/img_161.png",musketeer_atk:"assets/img_162.png",sniper_idle:"assets/img_163.png",sniper_atk:"assets/img_164.png",wizard_idle:"assets/img_165.png",wizard_atk:"assets/img_166.png",cleric_idle:"assets/img_167.png",cleric_atk:"assets/img_168.png",icem_idle:"assets/img_169.png",icem_atk:"assets/img_170.png",bomber_idle:"assets/img_171.png",bomber_atk:"assets/img_172.png",giant_idle:"assets/img_173.png",giant_atk:"assets/img_174.png",boar_idle:"assets/img_175.png",boar_atk:"assets/img_176.png",minions_idle:"assets/img_177.png",minions_atk:"assets/img_178.png",babyd_idle:"assets/img_179.png",babyd_atk:"assets/img_180.png",boss_idle:"assets/img_181.png",boss_atk:"assets/ra_frame_boss_atk.png",boss_sky_atk1:"assets/ra_boss_sky_atk1.png",boss_sky_atk2:"assets/ra_boss_sky_atk2.png",boss_sky_atk3:"assets/ra_boss_sky_atk3.png",boss_tomb_atk1:"assets/ra_boss_tomb_atk1.png",boss_tomb_atk2:"assets/ra_boss_tomb_atk2.png",boss_tomb_atk3:"assets/ra_boss_tomb_atk3.png",boss_divine_atk1:"assets/ra_boss_divine_atk1.png",boss_divine_atk2:"assets/ra_boss_divine_atk2.png",boss_divine_atk3:"assets/ra_boss_divine_atk3.png",boss_abyss_atk1:"assets/ra_boss_abyss_atk1.png",boss_abyss_atk2:"assets/ra_boss_abyss_atk2.png",boss_abyss_atk3:"assets/ra_boss_abyss_atk3.png",cleric_atk2:"assets/ra_pose_cleric_1.png",cleric_atk3:"assets/ra_pose_cleric_2.png",icem_atk2:"assets/ra_pose_icem_1.png",icem_atk3:"assets/ra_pose_icem_2.png",babyd_atk2:"assets/ra_pose_babyd_1.png",babyd_atk3:"assets/ra_pose_babyd_2.png",knight_walk:"assets/ra_walk_knight.png",prince_walk:"assets/ra_walk_prince.png",valk_walk:"assets/ra_walk_valk.png",skarmy_walk:"assets/ra_walk_skarmy.png",archers_walk:"assets/ra_walk_archers.png",musketeer_walk:"assets/ra_walk_musketeer.png",sniper_walk:"assets/ra_walk_sniper.png",wizard_walk:"assets/ra_walk_wizard.png",cleric_walk:"assets/ra_walk_cleric.png",icem_walk:"assets/ra_walk_icem.png",bomber_walk:"assets/ra_walk_bomber.png",giant_walk:"assets/ra_walk_giant.png",boar_walk:"assets/ra_walk_boar.png",flamer_walk:"assets/ra_walk_flamer.png",xbow_walk:"assets/ra_walk_xbow.png",golem_walk:"assets/ra_walk_golem.png",greed_walk:"assets/ra_walk_greed.png",lordknight_walk:"assets/ra_walk_lordknight.png",scarecrow_walk:"assets/ra_walk_scarecrow.png",xbow_idle:"assets/ra_spr_xbow.png",xbow_atk:"assets/ra_fat_xbow.png",flamer_idle:"assets/ra_spr_flamer.png",flamer_atk:"assets/ra_fat_flamer.png",golem_idle:"assets/ra_spr_golem.png",golem_atk:"assets/ra_fat_golem.png",greed_idle:"assets/ra_spr_greed.png",greed_atk:"assets/ra_fat_greed.png",lordknight_idle:"assets/ra_spr_lordknight.png",lordknight_atk:"assets/ra_fat_lordknight.png",scarecrow_idle:"assets/ra_spr_scarecrow.png",scarecrow_atk:"assets/ra_fat_scarecrow.png",fort_idle:"assets/ra_spr_fort.png",glass_idle:"assets/ra_spr_glass.png",netter_idle:"assets/ra_spr_netter.png?v=411",netter_atk:"assets/ra_atk_netter.png?v=411",netter_walk:"assets/ra_walk_netter.png?v=411",netter_atk2:"assets/ra_pose_netter_1.png",netter_atk3:"assets/ra_pose_netter_2.png",buzzer_idle:"assets/ra_spr_buzzer.png?v=411",buzzer_walk:"assets/ra_walk_buzzer.png?v=411",buzzer_atk:"assets/ra_atk_buzzer.png",buzzer_atk2:"assets/ra_pose_buzzer_1.png",buzzer_atk3:"assets/ra_pose_buzzer_2.png",batqueen_idle:"assets/ra_spr_batqueen.png?v=411",batqueen_atk:"assets/ra_atk_batqueen.png?v=411",batqueen_walk:"assets/ra_walk_batqueen.png?v=411",batqueen_atk2:"assets/ra_pose_batqueen_1.png",batqueen_atk3:"assets/ra_pose_batqueen_2.png",catapult_idle:"assets/ra_spr_catapult.png?v=411"}   /* v411: 신규 포즈 세트 — 자폭 벌레 atk는 폭발 fx 대체 */;   /* v304: 확장 유닛 포즈 */   /* v303: 이동 포즈 */   /* v302: 공격 3단 포즈(경년·타격·마무리) */   /* v302: 공격 시퀀스 포즈 */   /* v299: 보스 공격 프레임 */


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
         crowns:{blue:0,red:0}, kills:{blue:0,red:0}, endTimer:0, slow:0, muted:(function(){ try{ return localStorage.getItem('ra_muted')==='1'; }catch(e){ return false; } })(), shake:0, theme:(function(){ try{ var t=localStorage.getItem('ra_theme_v1'); return (t&&window.THEMES&&THEMES[t])?t:'classic'; }catch(e){ return 'classic'; } })(), pre:0};   /* v222: 테마 선택 기억 */
const ELX_MAX=10;   /* v326: 엘릭서 맥스 상수화 — 확장 시 이 값 1곳만 변경(게이지·AI·만원 UX 전파) */
const P={elixir:5, hand:[], queue:[], sel:null};        // 플레이어(파랑)
const A={elixir:5, hand:[], queue:[], timer:2.0};       // AI(빨강)
let units=[], towers=[], projs=[], fx=[], floats=[], parts=[];
const AUTO=false; // 테스트용 자동 시작 플래그 (?auto=1로도 활성화)

/* ---------- 사운드 (WebAudio 합성 — v376 전면 재구축: game-audio-synth-system 아키텍처, 제스처 지연 생성+복수 복구 경로) ---------- */
const RA_AUDIO=(function(){
  let ctx=null, master=null;
  function build(){ try{
    ctx=new (window.AudioContext||window.webkitAudioContext)();
    master=ctx.createGain(); master.gain.value=1.0;
    const comp=ctx.createDynamicsCompressor();
    comp.threshold.setValueAtTime(-20,ctx.currentTime); comp.knee.setValueAtTime(40,ctx.currentTime);
    comp.ratio.setValueAtTime(12,ctx.currentTime); comp.attack.setValueAtTime(0,ctx.currentTime); comp.release.setValueAtTime(0.25,ctx.currentTime);
    master.connect(comp); comp.connect(ctx.destination);
  }catch(e){ ctx=null; } }
  function unlock(){ try{ if(!ctx) build(); if(ctx&&ctx.state==='suspended'){ const __pr=ctx.resume(); if(__pr&&__pr.catch) __pr.catch(()=>{}); } }catch(e){} }
  window.addEventListener('pointerdown',unlock,true);
  window.addEventListener('pointerup',unlock,true);
  window.addEventListener('touchstart',unlock,true);
  window.addEventListener('touchend',unlock,true);
  document.addEventListener('visibilitychange',function(){ try{ if(!document.hidden&&ctx&&ctx.state==='suspended') ctx.resume(); }catch(e){} });
  return { unlock:unlock, getCtx:function(){return ctx;}, getMaster:function(){return master;}, state:function(){ return ctx?ctx.state:'null'; } };
})();
window.__RA_AUDIO=RA_AUDIO;
function ensureAudio(){ RA_AUDIO.unlock(); }
function tone(f,d,type,v,slide){ try{ const C=RA_AUDIO.getCtx(); if(!C||S.muted) return; if(C.state==='suspended') RA_AUDIO.unlock(); const o=C.createOscillator(), g=C.createGain(); o.type=type||'sine'; o.frequency.setValueAtTime(f,C.currentTime); if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(20,f+slide),C.currentTime+d); g.gain.setValueAtTime(v,C.currentTime); g.gain.exponentialRampToValueAtTime(0.001,C.currentTime+d); o.connect(g); g.connect(RA_AUDIO.getMaster()); o.start(); o.stop(C.currentTime+d); }catch(e){} }
function noiseBurst(d,v){ try{ const C=RA_AUDIO.getCtx(); if(!C||S.muted) return; if(C.state==='suspended') RA_AUDIO.unlock(); const n=C.sampleRate*d, buf=C.createBuffer(1,n,C.sampleRate), ch=buf.getChannelData(0); for(let i=0;i<n;i++) ch[i]=(Math.random()*2-1)*(1-i/n); const src=C.createBufferSource(); src.buffer=buf; const g=C.createGain(); g.gain.value=v; src.connect(g); g.connect(RA_AUDIO.getMaster()); src.start(); }catch(e){} }
function sfxBP(d,v,f0,f1){ try{ const C=RA_AUDIO.getCtx(); if(!C||S.muted) return; if(C.state==='suspended') RA_AUDIO.unlock(); const n=C.sampleRate*d, buf=C.createBuffer(1,n,C.sampleRate), ch=buf.getChannelData(0); for(let i=0;i<n;i++) ch[i]=(Math.random()*2-1)*(1-i/n); const src=C.createBufferSource(); src.buffer=buf; const bp=C.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=1.1; bp.frequency.setValueAtTime(f0,C.currentTime); bp.frequency.linearRampToValueAtTime(f1,C.currentTime+d); const g=C.createGain(); g.gain.value=v; src.connect(bp); bp.connect(g); g.connect(RA_AUDIO.getMaster()); src.start(); }catch(e){} }
function sfx(k){
  try{ const __n=performance.now(); if(!window.__sfxT) window.__sfxT={}; if(__n-(window.__sfxT[k]||0)<25) return; window.__sfxT[k]=__n; }catch(e){}   /* v194: 25ms 전역 스로틀 */
  try{ if(!sfx._t) sfx._t={}; const __n2=performance.now(); if((k==='hit'||k==='shoot'||k==='thud'||k==='spark'||k==='bow'||k==='musket'||k==='clank'||k==='heavy'||k==='tick'||k==='impact'||k==='thudL'||k==='xbow'||k==='cannon')&&__n2-(sfx._t[k]||0)<30) return; sfx._t[k]=__n2; }catch(e){}   /* v163+ */
  if(k==='deploy'){ tone(500,.12,'triangle',.10,140); }
  else if(k==='shoot'){ tone(900,.06,'square',.03); }
  else if(k==='hit'){ const __d=1+(Math.random()*.16-.08); tone(210*__d,.05,'square',.05); }
  else if(k==='cast'){ tone(300,.3,'sawtooth',.06,260); }
  else if(k==='zap'){ tone(1500,.14,'square',.06,-1250); tone(2230,.12,'square',.045,-1900); noiseBurst(.07,.05); }
  else if(k==='boom'){ noiseBurst(.4,.18); tone(70,.45,'sine',.22,-40); tone(45,.5,'sine',.14,-15); }
  else if(k==='crown'){ tone(1100,.05,'square',.07,-200); [262,330,392,523].forEach((f,i)=>setTimeout(()=>tone(f,.22,'triangle',.10),90+i*120)); }
  else if(k==='win'){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>tone(f,.24,'triangle',.13),i*170)); }
  else if(k==='lose'){ [392,311,262].forEach((f,i)=>setTimeout(()=>tone(f,.3,'sawtooth',.07),i*210)); }
  else if(k==='bow'){ tone(420,.06,'triangle',.045,-140); noiseBurst(.04,.015); }
  else if(k==='musket'){ noiseBurst(.08,.09); tone(170,.07,'square',.05,-70); }
  else if(k==='firel'){ noiseBurst(.16,.045); tone(210,.18,'sawtooth',.035,110); }
  else if(k==='toss'){ tone(300,.12,'sine',.04,180); }
  else if(k==='icel'){ tone(1200,.08,'triangle',.04,380); }
  else if(k==='cannon'){ noiseBurst(.14,.13); tone(110,.2,'sine',.15,-50); }
  else if(k==='thud'){ const __d=1+(Math.random()*.16-.08); tone(180*__d,.05,'square',.05,-60); }
  else if(k==='spark'){ tone(1400,.05,'sawtooth',.03,-900); }
  else if(k==='icehit'){ [1800,2400,3200].forEach((f,i)=>tone(f,.07,'sine',.03-i*0.006,120)); noiseBurst(.05,.04); }
  else if(k==='fwhit'){ sfxBP(.2,.05,300,1400); tone(120,.16,'sine',.07,-30); }
  else if(k==='boomL'){ noiseBurst(.26,.16); tone(95,.26,'sine',.14,-40); }
  else if(k==='clank'){ const __d=1+(Math.random()*.16-.08); sfxBP(.09,.08,2200*__d,700*__d); tone(1318*__d,.06,'square',.055,-400); noiseBurst(.05,.045); }
  else if(k==='heavy'){ const __d=1+(Math.random()*.16-.08); tone(110*__d,.09,'sine',.13,-30); noiseBurst(.05,.055); }
  else if(k==='tick'){ const __d=1+(Math.random()*.2-.1); tone(1900*__d,.03,'square',.05,-500); }
  else if(k==='impact'){ const __d=1+(Math.random()*.16-.08); tone(1500*__d,.045,'square',.07,-700); noiseBurst(.035,.05); }
  else if(k==='thudL'){ const __d=1+(Math.random()*.16-.08); tone(150*__d,.07,'square',.075,-40); noiseBurst(.04,.05); }
  else if(k==='xbow'){ const __d=1+(Math.random()*.16-.08); tone(700*__d,.05,'square',.055,-300); noiseBurst(.03,.035); }
}
/* ---------- v379: 타격음 신시사이저 (playHit — 속성별 절차 합성, 외부 파일 0) ---------- */
function __raNoise(C,d,pink){ const n=Math.max(1,Math.floor(C.sampleRate*d)), buf=C.createBuffer(1,n,C.sampleRate), ch=buf.getChannelData(0); let b0=0; for(let i=0;i<n;i++){ const w=Math.random()*2-1; if(pink){ b0=b0*0.94+w*0.06; ch[i]=b0*2.2; } else ch[i]=w; } return buf; }
function playHit(type,isCritical){
  try{
    type=type||'physical';
    if(!window.__raHitT) window.__raHitT={}; const __n=performance.now();
    if(__n-(window.__raHitT[type]||0)<25) return;   /* v379: 타격음 25ms 타입별 스로틀(버퍼 오버플로우 방지) */
    window.__raHitT[type]=__n;
    const C=RA_AUDIO.getCtx(); if(!C||S.muted) return; if(C.state==='suspended') RA_AUDIO.unlock();
    const M=RA_AUDIO.getMaster(); const t=C.currentTime;
    const ng=(d,pink)=>{ const src=C.createBufferSource(); src.buffer=__raNoise(C,d,pink); return src; };
    const g=(v,d)=>{ const x=C.createGain(); x.gain.setValueAtTime(v,t); x.gain.exponentialRampToValueAtTime(0.001,t+(d||0.14)); x.connect(M); return x; };
    if(type==='physical'){   /* 밴드패스 노이즈 팝+피치 드롭 트랜지언트 — 날카로운 관통음 */
      const d1=Math.random()*.16-.08;
      const nz=ng(0.07), bp=C.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=1.4; bp.frequency.setValueAtTime(2400*(1+d1),t); bp.frequency.exponentialRampToValueAtTime(600,t+0.07);
      const g1=g(0.10); nz.connect(bp); bp.connect(g1); nz.start();
      const o=C.createOscillator(); o.type='triangle'; o.frequency.setValueAtTime(950*(1+d1),t); o.frequency.exponentialRampToValueAtTime(160,t+0.06);
      const g2=g(0.075); o.connect(g2); o.start(); o.stop(t+0.07);
    } else if(type==='flame'){   /* 노이즈+로우패스 스위프 — 불꽃 소각·파열음 */
      const nz=ng(0.28), lp=C.createBiquadFilter(); lp.type='lowpass'; lp.frequency.setValueAtTime(2600,t); lp.frequency.exponentialRampToValueAtTime(180,t+0.26); lp.Q.value=0.8;
      const g1=g(0.085); nz.connect(lp); lp.connect(g1); nz.start();
      const o=C.createOscillator(); o.type='sawtooth'; o.frequency.setValueAtTime(190,t); o.frequency.exponentialRampToValueAtTime(70,t+0.24);
      const g2=g(0.05,0.26); o.connect(g2); o.start(); o.stop(t+0.26);
    } else if(type==='frost'){   /* 고주파 사인 클러스터+파쇄 노이즈 — 크리스탈 파쇄음 */
      [2093,2637,3136].forEach((f,i)=>{ const o=C.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(f*(1+(Math.random()*.04-.02)),t); const gg=g(0.045-i*0.008); o.connect(gg); o.start(t+i*0.012); o.stop(t+0.14); });
      const nz=ng(0.06), hp=C.createBiquadFilter(); hp.type='highpass'; hp.frequency.setValueAtTime(3800,t);
      const g1=g(0.055); nz.connect(hp); hp.connect(g1); nz.start();
    } else if(type==='lightning'){   /* 사각파 FM 변조+급 디케이 — 전기 아크 방전음 */
      const car=C.createOscillator(); car.type='square'; car.frequency.setValueAtTime(1600,t);
      const mod=C.createOscillator(); mod.type='sine'; mod.frequency.setValueAtTime(140,t);
      const mg=C.createGain(); mg.gain.setValueAtTime(900,t); mg.gain.exponentialRampToValueAtTime(60,t+0.12);
      mod.connect(mg); mg.connect(car.frequency);
      const g1=g(0.06); car.connect(g1); car.start(); mod.start(); car.stop(t+0.14); mod.stop(t+0.14);
      const nz=ng(0.05); const g2=g(0.045); nz.connect(g2); nz.start();
    } else if(type==='cannon'){   /* 서브베이스 럼블 드롭+핑크 노이즈 — 대지 분쇄 폭발음 */
      const o=C.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(78,t); o.frequency.exponentialRampToValueAtTime(38,t+0.34);
      const g1=g(0.20,0.36); o.connect(g1); o.start(); o.stop(t+0.36);
      const nz=ng(0.22,true); const lp=C.createBiquadFilter(); lp.type='lowpass'; lp.frequency.setValueAtTime(500,t); lp.frequency.exponentialRampToValueAtTime(120,t+0.2);
      const g2=g(0.12); nz.connect(lp); lp.connect(g2); nz.start();
    } else if(type==='boss'){   /* 서브 럼블+글로켄 옥타브 반짝임+앰비언트 공명 */
      const o=C.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(72,t); o.frequency.exponentialRampToValueAtTime(34,t+0.42);
      const g1=g(0.22,0.45); o.connect(g1); o.start(); o.stop(t+0.45);
      [1046,2093,4186].forEach((f,i)=>{ const o2=C.createOscillator(); o2.type='sine'; o2.frequency.setValueAtTime(f,t+i*0.055); const gg=g(0.075-i*0.018); o2.connect(gg); o2.start(t+i*0.055); o2.stop(t+i*0.055+0.3); });
      const amb=C.createOscillator(); amb.type='sawtooth'; amb.frequency.setValueAtTime(55,t);
      const af=C.createBiquadFilter(); af.type='lowpass'; af.frequency.setValueAtTime(240,t);
      const g3=g(0.06,0.4); amb.connect(af); af.connect(g3); amb.start(); amb.stop(t+0.4);
    } else { playHit('physical',isCritical); return; }
    if(isCritical){   /* 크리티컬 레이어: 서브 펑치+금속 핑 */
      const o=C.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(95,t); o.frequency.exponentialRampToValueAtTime(40,t+0.16);
      const g1=g(0.16); o.connect(g1); o.start(); o.stop(t+0.18);
      const p=C.createOscillator(); p.type='sine'; p.frequency.setValueAtTime(2093,t); const g2=g(0.06); p.connect(g2); p.start(t+0.02); p.stop(t+0.2);
    }
  }catch(e){}
}
let bgmTimer=null;
function bgmStart(){ }   /* v379: BGM 제거(사용자 지시) — 호출부 호환 no-op */
function bgmStop(){ if(typeof window!=='undefined') window.__RA_BGM=false; }   /* v379 */
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
const DECK_SLOTS=['ra_deck_slot1','ra_deck_slot2'];   /* v262: 슬롯 3 제거 — activeSlot()이 1·2만 사용하는 유령 슬롯 */
const DECK_DEFAULTS=[['knight','archers','giant','minions','musketeer','fireball','skarmy','cannon'],
                     ['prince','wizard','sniper','valk','boar','bomber','babyd','cleric']];
function loadDeckSlot(n){ try{ if(typeof localStorage==='undefined') return null;
  const s=JSON.parse(localStorage.getItem(DECK_SLOTS[n])||'null');
  if(!Array.isArray(s)) return DECK_DEFAULTS[n];
  const ok=s.filter(k=>CARDS[k]);
  return (ok.length>=8&&ok.length<=10)?ok:DECK_DEFAULTS[n];   /* v414: 8~10장 모두 수용 — 10장 저장이 검증 실패로 기본 8장 폴백하던 근원 수복 */ }catch(e){ return DECK_DEFAULTS[n]; } }
function activeSlot(){ try{ if(typeof localStorage==='undefined') return 0;
  return parseInt(localStorage.getItem('ra_deck_active')||'0',10)===1?1:0; }catch(e){ return 0; } }
function getActiveDeck(){ if(typeof localStorage==='undefined') return null; return loadDeckSlot(activeSlot()); }
function initDeck(p,rd){ if(!rd){ const q=shuffle([...(getActiveDeck()||DECK)]); p.hand=q.slice(0,4); p.queue=q.slice(4); return; }
  var __df=0; try{ __df=parseInt(localStorage.getItem('ra_diff_v1')||'0',10)||0; }catch(e){}
  var __bias=1+0.35*__df, __pool=DECK.slice(), __q=[];
  while(__q.length<10&&__pool.length){   /* v414: 잔여 8리밋 수복 — 전투 랜덤 덱도 10장 */ var __bi=0,__bsc=-1; for(var __i=0;__i<__pool.length;__i++){ var __sc=Math.random()+CARDS[__pool[__i]].cost*0.09*__bias; if(__sc>__bsc){__bsc=__sc;__bi=__i;} } __q.push(__pool.splice(__bi,1)[0]); }
  p.hand=__q.slice(0,4); p.queue=__q.slice(4); }   /* v192 랜덤 → v218: 난이도 고코스트 가중치 */
/* v72: 덱 편성 오버레이 — 덱 슬롯 2개 + 카드 교체 */
function openDeckEditor(){
  if(document.getElementById('deck-edit')) return;
  let slot=activeSlot(); let deck=(loadDeckSlot(slot)||DECK.slice(0,10)).slice();   /* v414: 슬롯 빈 기본 10장 */
  const ov=document.createElement('div'); ov.id='deck-edit';
  ov.style.cssText='position:fixed;inset:0;z-index:80;background:rgba(5,8,18,.94);display:flex;flex-direction:column;align-items:center;padding:12px 12px 46px;overflow-y:auto;';
  const style=document.createElement('style');
  style.textContent='.dk{background:#101a30;border:2px solid #2a3f6e;border-radius:12px;padding:6px;margin:3px;cursor:pointer;min-width:64px;text-align:center;font-family:Jua,sans-serif}'+
   '.dk.on{border-color:#f7c531;box-shadow:0 0 10px rgba(247,197,49,.5)}'+
   '.dk .dke{font-size:26px;line-height:1.1}.dk .dkn{font-size:11px;color:#dfe8ff}.dk .dkc{font-size:10px;color:#c77dff}.dkw .dk{min-width:0}html body button#dk-save,html body button.dk-act{background:url(assets/ra_btn_gold.png)!important;background-size:100% 100%!important;color:#3a2400!important;border:1px solid #c89b3c!important;box-shadow:inset 0 0 8px rgba(255,215,120,.4),0 0 10px rgba(247,197,49,.35);font-family:Jua,sans-serif}html body button#btn-deck-random,html body button#dk-close,html body button.dk-sub{background:url(assets/ra_btn_navy.png)!important;background-size:100% 100%!important;color:#ffe9b8!important;border:1px solid #6a7ea8!important;box-shadow:inset 0 0 8px rgba(120,150,220,.28);font-family:Jua,sans-serif}html body button#dk-save:active,html body button#btn-deck-random:active,html body button#dk-close:active,html body button.dk-act:active,html body button.dk-sub:active{filter:brightness(1.18);outline:2px solid #ffd76a}html body #deck-edit{padding:12px 12px 46px!important}';
  document.head.appendChild(style);
  function render(){
    const cost=Math.round(deck.reduce((a,k)=>a+CARDS[k].cost,0)/deck.length*10)/10; const dpsAvg=Math.round(deck.reduce((a,k)=>{const c2=CARDS[k]; return a+((c2.dmg&&c2.hs)?(c2.dmg/c2.hs):0);},0)/deck.length);
    ov.innerHTML=
   '<div style="text-align:center;margin-top:2px"><span style="font-family:Jua,sans-serif;font-size:21px;color:#f7c531;white-space:nowrap">🃏 덱 편성</span></div>'+
   '<div style="display:flex;gap:8px;align-items:stretch;justify-content:center;margin-top:4px">'+
      DECK_SLOTS.map((_,n)=>'<button class="dk'+(n===slot?' on':'')+'" data-slot="'+n+'"><div class="dke">'+(n===0?'🅰':(n===1?'🅱':'🅲'))+'</div><div class="dkn">덱 슬롯 '+(n+1)+'</div></button>').join('')+'</div>'+

   '<div style="font-family:Jua,sans-serif;color:#c3d2f2;font-size:13px;margin-top:6px;padding-bottom:3px;line-height:1.45;text-align:center">평균 엘릭서 '+cost+' · 평균 DPS '+dpsAvg+' · 슬롯 '+(slot+1)+' 편집 중</div>'+
      
      
     '<div style="font-family:Jua,sans-serif;color:#dfe8ff;font-size:14px;margin-top:10px">전투 덱 '+deck.length+'/10 — 카드를 누르면 빠짐</div>'+
     '<div class="dkw" style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px;width:100%;max-width:430px">'+deck.map(k=>
       '<div class="dk" data-rm="'+k+'"><div class="dke">'+(ART[k]?'<img class="art" style="width:34px" src="'+ART[k]+'">':CARDS[k].emoji)+'</div><div class="dkn">'+CARDS[k].name+'</div><div style="font-size:9.5px;color:#9fb0d0;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(function(c2){ if(c2.dmg&&c2.hs) return 'DPS '+Math.round(c2.dmg/c2.hs); if(c2.dmg) return '즉발 '+c2.dmg; if(c2.heal) return '힐 '+c2.heal; return '—'; })(CARDS[k])+'</div><div class="dkc">'+CARDS[k].cost+'</div></div>').join('')+'</div>'+
     '<div style="font-family:Jua,sans-serif;color:#c3d2f2;font-size:13px;margin-top:10px;word-break:keep-all;line-height:1.45;text-align:center">보유 카드 풀 — 카드를 누르면 추가<br><span style="font-size:11.5px;color:#a9bce6">(10장이면 마지막 카드와 교체)</span></div>'+
     '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;width:100%;max-width:430px">'+Object.keys(CARDS).filter(k=>!deck.includes(k)).map(k=>
       '<div class="dk" data-add="'+k+'"><div class="dke">'+(ART[k]?'<img class="art" style="width:34px" src="'+ART[k]+'">':CARDS[k].emoji)+'</div><div class="dkn">'+CARDS[k].name+'</div><div style="font-size:9.5px;color:#9fb0d0;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(function(c2){ if(c2.dmg&&c2.hs) return 'DPS '+Math.round(c2.dmg/c2.hs); if(c2.dmg) return '즉발 '+c2.dmg; if(c2.heal) return '힐 '+c2.heal; return '—'; })(CARDS[k])+'</div><div class="dkc">'+CARDS[k].cost+'</div></div>').join('')+'</div>'+
     '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px auto 0;width:100%;max-width:300px">'+
      '<button id="dk-save" class="dk-act">💾 저장</button>'+
      '<button id="btn-deck-random" class="dk-sub">🎲 랜덤</button>'+
      '<button id="dk-close" class="dk-sub">닫기</button></div>';
    ov.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{ slot=parseInt(b.dataset.slot,10); deck=(loadDeckSlot(slot)||DECK.slice(0,10)).slice();   /* v414: 슬롯 빈 기본 10장 */ render(); });
    ov.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>{ deck=deck.filter(k=>k!==b.dataset.rm); render(); });
    ov.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{ if(deck.includes(b.dataset.add)) return;
      if(deck.length>=10) deck.shift(); deck.push(b.dataset.add); render(); });
    ov.querySelector('#dk-close').onclick=()=>{ ov.remove(); style.remove(); };
    var __rb=ov.querySelector('#btn-deck-random'); if(__rb) __rb.onclick=function(){ var q=shuffle([...DECK]).slice(0,10);   /* v414: 랜덤 버튼 10장 */ try{ localStorage.setItem(DECK_SLOTS[slot],JSON.stringify(q)); }catch(e){} deck=q.slice(); render(); try{ toast('덱을 랜덤으로 구성했어요'); }catch(e){} try{ sfx('tap'); }catch(e){} };   /* v267: 랜덤 버튼 빌더 내장 — 렌더 후에도 생존·편집 슬롯에 저장 */
    ov.querySelector('#dk-save').onclick=()=>{ if(deck.length!==10) return;
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

/* v207: 결과 화면 전적 집계 바(P8) — 킬·데스·주문 사용 요약 */
try{ (function(){ var iv=setInterval(function(){
  var ov=document.getElementById('overlay-result'); if(!ov) return;
  if(ov.classList.contains('hidden')){ var x=document.getElementById('ra-stats'); if(x) x.remove(); return; }
  if(document.getElementById('ra-stats')) return;
  var bar=document.createElement('div'); bar.id='ra-stats';
  var k=(window.S&&S.kills)?S.kills:{}, d=(window.S&&S.deaths)?S.deaths:{}, sp=(window.S&&S.spells)?S.spells:{};
  var kb=(k.blue||0),kr=(k.red||0),db=(d.blue||0),dr=(d.red||0),sb=(sp.blue||0);
  bar.style.cssText='margin:8px auto 0;padding:6px 12px;border-radius:10px;background:rgba(18,24,43,.85);border:1px solid rgba(255,179,0,.4);font-size:12px;color:#ffd54f;font-weight:700;text-align:center;max-width:340px';
  bar.textContent='⚔ 킬 '+kb+' : '+kr+' · 💀 데스 '+db+' : '+dr+' · ✨ 주문 '+sb+'회';
  try{ var __w=(parseInt(localStorage.getItem('ra_wins_v1')||'0',10)||0)+(S.winner==='blue'?1:0), __l=(parseInt(localStorage.getItem('ra_losses_v1')||'0',10)||0)+(S.winner!=='blue'?1:0), __st=parseInt(localStorage.getItem('ra_streak_v1')||'0',10)||0; var __rt=((__w+__l)>0)?Math.round(__w/(__w+__l)*100):0; bar.textContent+=' · 🏆 '+__w+'승 '+__l+'패('+__rt+'%)'+(__st>=2?' · 🔥 '+__st+'연승':'');
  var __sb=parseInt(localStorage.getItem('ra_streak_best_v1')||'0',10)||0; if(__st>__sb){ __sb=__st; try{ localStorage.setItem('ra_streak_best_v1',String(__sb)); }catch(e2){} } if(__sb>=2) bar.textContent+=' · 🥇 최고 '+__sb+'연승';   /* v214: 최고 연승 */
  var __td=new Date().toISOString().slice(0,10); bar.textContent+=' · 🌅 첫승 보너스 '+(localStorage.getItem('ra_daily_v1')===__td?'소진':'대기');   /* v214: 첫승 상태 */
  var __lv=localStorage.getItem('ra_lvup_v1'); if(__lv) bar.textContent+=' · 🆙 Lv.UP '+(CARDS[__lv.split(',')[0]]||{}).name;
  var __dd=parseInt(localStorage.getItem('ra_diff_v1')||'0',10)||0; bar.textContent+=' · ⚔ '+(window.__raDIFF?__raDIFF.name[__dd]:__dd)+' · 💀 보스 '+(S.__bossWave||0)+'/5';
  var __xg2=localStorage.getItem('ra_xp_gain_v1'); if(__xg2) bar.textContent+=' · ⭐ XP +'+__xg2; var __spg2=localStorage.getItem('ra_sp_gain_v1'); if(__spg2) bar.textContent+=' · 🎓 SP +'+__spg2;   /* v220 */
  var __tb={lava:'⚔ 공격 +2%',ice:'🛡 체력 +2%',wasteland:'⭐ XP +1',abyss:'📦 이벤트 +15%',sky:'🛡 체력 +2%',tomb:'📦 이벤트 +15%',dusk:'⚔ 공격 +2%',divine:'⭐ XP +1'}[S.theme]; if(__tb) bar.textContent+=' · 🗺 '+__tb;   /* v222: 테마 보너스 */   /* v214: Lv.UP 카드 표시 */
 }catch(e){}   /* v213~214: 누적 승률·연승·첫승·Lv.UP */
  ov.insertBefore(bar, ov.firstChild.nextSibling||ov.firstChild);
 },600); })(); }catch(e){}

/* v220: HOF 기록 바 + 게임방법 신규 시스템 안내 */
try{ (function(){ var iv4=setInterval(function(){
  var hw=document.getElementById('overlay-hof'); if(hw&&!hw.classList.contains('hidden')&&!document.getElementById('ra-hstats')){
    var __w=parseInt(localStorage.getItem('ra_wins_v1')||'0',10)||0, __l=parseInt(localStorage.getItem('ra_losses_v1')||'0',10)||0, __sb=parseInt(localStorage.getItem('ra_streak_best_v1')||'0',10)||0;
    var d1=document.createElement('div'); d1.id='ra-hstats'; d1.style.cssText='margin:8px auto;padding:6px 10px;border-radius:10px;background:rgba(18,24,43,.85);border:1px solid rgba(255,179,0,.4);font-size:12px;color:#ffd54f;font-weight:700;text-align:center;max-width:320px';
    d1.textContent='🥇 최고 '+__sb+'연승 · 🏆 '+__w+'승 '+__l+'패'; hw.insertBefore(d1, hw.firstChild); }
  var iw=document.getElementById('overlay-info'); if(iw&&!iw.classList.contains('hidden')&&!document.getElementById('ra-inote')){
    var d2=document.createElement('div'); d2.id='ra-inote'; d2.style.cssText='margin:6px auto;padding:6px 10px;border-radius:10px;background:rgba(18,24,43,.85);border:1px solid rgba(255,179,0,.4);font-size:11.5px;color:#ffd54f;font-weight:700;text-align:center;max-width:340px';
    d2.textContent='🆕 난이도 3단계(토벌 해금) · 인런 렐릭(승리 후 이벤트 보상·다음 배틀 1회) · 연승·첫승 보너스 · 테마별 보너스(용암 공격/서리 체력/황야 XP/심연 이벤트)';
    iw.insertBefore(d2, iw.firstChild); }
  if(hw&&hw.classList.contains('hidden')){ var x1=document.getElementById('ra-hstats'); if(x1) x1.remove(); }
  if(iw&&iw.classList.contains('hidden')){ var x2=document.getElementById('ra-inote'); if(x2) x2.remove(); }
 },700); })(); }catch(e){}

/* v218: 프로필 통계 주입(승/패/승률/최고연승/트로피) */
try{ (function(){ var iv3=setInterval(function(){
  var ov=document.getElementById('overlay-profile'); if(!ov) return;
  if(ov.classList.contains('hidden')){ var x0=ov.querySelector('[data-ra-pstats]'); if(x0) x0.remove(); return; }
  if(ov.querySelector('[data-ra-pstats]')) return;   /* v428: v218 가드가 존재하지 않는 id를 봐 개방 중 매 700ms 숨김 스트립 중복 생성되던 것 수복 */
  var __w=parseInt(localStorage.getItem('ra_wins_v1')||'0',10)||0, __l=parseInt(localStorage.getItem('ra_losses_v1')||'0',10)||0;
  var __sb=parseInt(localStorage.getItem('ra_streak_best_v1')||'0',10)||0, __tp=(typeof loadTrophies==='function')?loadTrophies():0;
  var __d=document.createElement('div'); __d.setAttribute('data-ra-pstats','1');
  __d.style.cssText='margin:8px auto;padding:6px 10px;border-radius:10px;background:rgba(18,24,43,.85);border:1px solid rgba(255,179,0,.4);font-size:12px;color:#ffd54f;font-weight:700;text-align:center;max-width:min(94%,560px)';
  var __hist=(function(){ try{ return (JSON.parse(localStorage.getItem('ra_hist_v1')||'[]')||[]).map(function(x){ return x==='W'?'승':(x==='L'?'패':'무'); }).join(' ')||'기록 없음'; }catch(e){ return '기록 없음'; } })();
  __d.id='ra-title-strip';__d.textContent='🏆 '+__w+'승 '+__l+'패('+((__w+__l)?Math.round(__w/(__w+__l)*100):0)+'%) · 🥇 최고 '+__sb+'연승 · 👑 '+__tp+'트로피';
  var __d2=document.createElement('div'); __d2.style.cssText='font-size:11px;color:#c3d2f2;margin-top:2px'; __d2.textContent='최근 5전: '+__hist; __d.appendChild(__d2);   /* v222 */
  ov.insertBefore(__d, ov.firstChild);
 },700); })(); }catch(e){}

/* v221 긴급: 엘릭서 실시간 카드 상태 — 흐림 고착 수복(회복 시 즉시 해제) */
try{ setInterval(function(){ try{
  if(typeof P==='undefined'||!P||!window.cardEls) return;
  for(var __di=0;__di<4;__di++){ var __de=cardEls[__di], __dk=P.hand?P.hand[__di]:null, __dc=__dk?CARDS[__dk]:null;
    if(__de) __de.classList.toggle('ra-noelx', !!(__dc&&__dc.cost>P.elixir)); }
 }catch(e){} },300); }catch(e){}

/* v212: 선택형 이벤트 노드 + 인런 렐릭(다음 배틀 1회) */
try{ (function(){ var EV=[
 {t:'📦 보물 상자', d:'나무 상자가 반짝인다.', a:['안전 회수 — 금고','relic_hoard'], b:['도박 — 확률 강화','relic_gamble']},
 {t:'🧙 전술 상담', d:'노병이 전술서를 내민다.', a:['공세 중시','relic_frenzy'], b:['방벽 중시','relic_bulwark']},
 {t:'🏕️ 급행 훈련', d:'훈련관이 두 코스를 제안한다.', a:['기동 중시','relic_sprint'], b:['재생 중시','relic_mend']},
 {t:'💰 왕실 세금관', d:'세금관이 금화 자루를 내민다.', a:['재정 확충','relic_gravy'], b:['번영 계약','relic_boom']},
 {t:'❄️ 서리 주술사', d:'주술사가 룬을 내밀며 거래를 청한다.', a:['서리 계약','relic_frost'], b:['수호 룬','relic_guard']}];   /* v297: 신규 렐릭 노드 */
 var iv2=setInterval(function(){ var ov=document.getElementById('overlay-result'); if(!ov) return;
  if(!ov.classList.contains('hidden')){ window.__raEvSeen=false; return; }   /* v401: 결과 카드(승리 화면) 표시 중엔 이벤트 보류 — 카드 가림 제거, 카드가 닫힌 뒤 타이틀에서 표시 */
  if(window.__raEvSeen) return; window.__raEvSeen=true; var __ec=(window.S&&(S.theme==='abyss'||S.theme==='tomb'))?0.45:0.30;   /* v434: tomb(묘지) — abyss 체인 재사용 */ if(Math.random()>=__ec) return;   /* v220: 심연 테마 — 이벤트 확률 +15%p */
  var ev=EV[Math.floor(Math.random()*EV.length)];
  var m=document.createElement('div'); m.id='overlay-event'; m.style.cssText='position:fixed;inset:0;z-index:120;background:rgba(5,8,18,.9);display:flex;align-items:center;justify-content:center';
  var box=document.createElement('div'); box.style.cssText='width:min(340px,88vw);background:linear-gradient(180deg,#152544,#0b1426);border:1.5px solid rgba(255,202,40,.65);border-radius:16px;padding:16px;text-align:center;font-family:Jua,sans-serif';
  box.innerHTML='<div style="font-size:19px;color:#f7c531;margin-bottom:6px">'+ev.t+'</div><div style="font-size:12.5px;color:#c3d2f2;margin-bottom:10px">'+ev.d+'</div><div style="font-size:11px;color:#9fb3dd;margin-bottom:10px">선택 시 다음 배틀 1회에만 적용</div>';
  [['a'],['b']].forEach(function(p){ var opt=ev[p[0]], btn=document.createElement('button'); btn.textContent=opt[0]; btn.className='dk-act'; btn.style.cssText='display:block;width:100%;margin:6px 0;font-family:Jua,sans-serif';
   btn.onclick=function(){ if(opt[1]!=='null'){ try{ localStorage.setItem('ra_relic_inrun_v1',opt[1]); }catch(e){} toast('인런 렐릭: '+opt[0]); } sfx('tap'); m.remove(); }; box.appendChild(btn); });
  m.appendChild(box); document.body.appendChild(m);
 },700); })(); }catch(e){}

/* v208: 난이도 3단계(영구 저장) + P13 배치 구역 하이라이트 */
try{ (function(){
  window.__raDIFF={name:['보통','악몽','지옥'],col:['#67d98a','#e0a13c','#e05c6e'],hp:[1,1.25,1.55],dmg:[1,1.15,1.35],aelix:[1,1.12,1.28]};
  window.__raMAPS=[{id:'royal',name:'로얄 클래식',boss:'왕국 성기사장',sprite:'assets/ra_boss_royal.png',mult:1,ult:null},{id:'frost',name:'서리 호수',boss:'서리 날개 군주',sprite:'assets/ra_boss_frost.png',mult:1.08,ult:'frost'},{id:'lava',name:'용암 협곡',boss:'화염 골렘',sprite:'assets/ra_boss_lava.png',mult:1.16,ult:'lava'},{id:'waste',name:'황야 유적',boss:'사암 미라 군주',sprite:'assets/ra_boss_waste.png',mult:1.24,ult:'waste'},{id:'abyss',name:'심연의 소굴',boss:'심연 군주',sprite:'assets/ra_boss_abyss.png',mult:1.32,ult:'abyss'},{id:'sky',name:'천공 정원',boss:'폭풍 정령왕',sprite:'assets/ra_boss_sky.png',mult:1.40,ult:'frost'},{id:'tomb',name:'봉인 묘지',boss:'백골 대군주',sprite:'assets/ra_boss_tomb.png',mult:1.42,ult:'abyss'},{id:'dusk',name:'황혼 신전',boss:'시간의 파수왕',sprite:'assets/ra_boss_dusk.png',mult:1.44,ult:'waste'},{id:'divine',name:'잠든 신계',boss:'왕좌 수호신',sprite:'assets/ra_boss_divine.png',mult:1.48,ult:'lava'}];   /* v434: 4맵 일괄 추가 — mult 오름차순 단계 사다리(맵-ladder-mapping 규약) */   /* v419: 지도 사다리 단일 진실원 — 스테이지 hp 배율·맵별 보스 스프라이트/이름/파멸기 효과 */
  window.__raMapIdx=function(){ try{ return Math.max(0,Math.min(__raMAPS.length-1,parseInt(localStorage.getItem('ra_map_v1')||'0',10)||0)); }catch(e){ return 0; } };
  window.__raMapHp=function(){ return __raMAPS[__raMapIdx()].mult; };   /* v419: 난이도 배율과 곱셈 결합 */   /* v402: 적 엘릭서 충전 배율 — 스폰 속도 레벨링(단일 진실원) */   /* v210: 단일 진실원 통합 */
  window.__raDiffHp=function(){ var d=parseInt(localStorage.getItem('ra_diff_v1')||'0',10)||0; return __raDIFF.hp[d]||1; };
  window.__raDiffDmg=function(){ var d=parseInt(localStorage.getItem('ra_diff_v1')||'0',10)||0; return __raDIFF.dmg[d]||1; };
  window.__raAel=function(){ var d=parseInt(localStorage.getItem('ra_diff_v1')||'0',10)||0; return __raDIFF.aelix[d]||1; };   /* v402 */
  window.__raClearLv=function(){ try{ return Math.max(0,parseInt(localStorage.getItem('ra_diff_clear_v1')||'-1',10)+1); }catch(e){ return 0; } };   /* v218 */
  window.__raWaveHp=function(el){ try{ if(typeof el!=='number'){ var S0=(typeof S!=='undefined'&&S)?S:0; el=S0?Math.max(0,180-(S0.t||180)):0; } return 1+0.10*Math.pow(el/60,1.8); }catch(e){ return 1; } };   /* v212: 웨이브 HP 이중 곡선 — 경과 180s 최대 ×1.9 */
  var DN=__raDIFF.name, DC=__raDIFF.col;
  var iv=setInterval(function(){ var ta=document.getElementById('title-actions'); if(!ta) return; clearInterval(iv);
    var b=document.createElement('button'); b.id='btn-diff';
    var __cl0=parseInt(localStorage.getItem('ra_diff_clear_v1')||'-1',10)+1; var d=Math.max(0,Math.min(2,Math.min(parseInt(localStorage.getItem('ra_diff_v1')||'0',10)||0,__cl0)));   /* v209: 미해금 난이도 저장값 클램프 */
    b.textContent='⚔ 난이도: '+DN[d]; b.style.marginTop='12px'; b.style.color=DC[d]; b.title='토벌 단계당 아군 성벽 HP +6%·처치 시 엘릭서 +4%×단계'; if(__cl0>0) b.textContent+=' 🏆'+__cl0;   /* v211: 토벌 단계 표시 */
    b.onclick=function(){ var __cl=parseInt(localStorage.getItem('ra_diff_clear_v1')||'-1',10)+1; var __nd=(d+1)%3; if(__nd===1&&(__cl<1||(parseInt(localStorage.getItem('ra_map_clear_v1')||'-1',10))<4)){ toast('잠금 — 보통에서 지도 5개 토벌 후 악몽 해금'); sfx('tap'); return; } if(__nd===2&&__cl<2){ toast('잠금 — 악몽 토벌 후 지옥 해금'); sfx('tap'); return; } if(__nd>__cl){ toast('잠금 — 이전 난이도 토벌(왕 타워 파괴) 후 해금'); sfx('tap'); return; } d=__nd; localStorage.setItem('ra_diff_v1',String(d));try{ window.dispatchEvent(new Event('ra-diff-changed')); }catch(__e){}   /* v431: 난이도 전환 시 텍스처 즉시 갱신 */ b.textContent='⚔ 난이도: '+DN[d]; b.style.color=DC[d]; sfx('tap'); toast('난이도: '+DN[d]+' — 적 체력×'+__raDIFF.hp[d]+' 공격×'+__raDIFF.dmg[d]+' 충전×'+__raDIFF.aelix[d]); };   /* v209: 토벌 해금 게이트 */
    ta.appendChild(b); },300);
  window.__raZoneHL=function(on){ try{
    var w=document.getElementById('arena-wrap'); if(!w) return;
    var z=document.getElementById('ra-zone-hl');
    if(on){ if(!z){ z=document.createElement('div'); z.id='ra-zone-hl'; w.appendChild(z); } z.style.display='block'; }
    else if(z) z.style.display='none';
  }catch(e){} };
})(); }catch(e){}

/* ---------- 타워 생성 (REA 설계도 §2) ---------- */
function mkTower(team,kind,x,y){
  const st= kind==='king' ? {hp:2900,dmg:84,hs:1.0,range:7.0,r:1.6} : {hp:1600,dmg:78,hs:0.8,range:7.5,r:1.3};   /* v380: 유닛 파워크리프(에픽 hp3200~5200·dps100~169) 대비 타워 기준선 재정가 — dmg+hp 미세 상향(승패 페이스 +12% 이내) */
  if(team==='blue'){ try{ var __cl2=parseInt(localStorage.getItem('ra_diff_clear_v1')||'-1',10)+1; if(__cl2>0) st.hp=Math.round(st.hp*(1+0.06*__cl2)); if(S&&S.__rin==='relic_bulwark') st.hp=Math.round(st.hp*1.3*(S.__rinMul||1));   /* v218 증폭 */ if(S&&S.__rin==='relic_frenzy') st.hp=Math.round(st.hp*0.9); }catch(__e){} }   /* v209 영구 강화 + v212 인런 방벽·공세 */
  return {isTower:true, kind, team, x, y, hp:st.hp, maxHp:st.hp, dmg:st.dmg, hs:st.hs, range:st.range, r:st.r, cd:0, dead:false, active:kind!=='king'};
}
function spawnBossNow(){ if(S.bossSpawned||S.over) return; S.bossSpawned=true;
    const kt=towers.find(t=>t.team==='blue'&&t.kind==='king'&&!t.dead);
    if(kt){ var __mp=__raMAPS[__raMapIdx()]; try{ if(__mp&&SPR.boss&&__mp.sprite) SPR.boss.src=__mp.sprite;try{var __th=(__mp&&__mp.sprite&&(__mp.sprite.match(/ra_boss_(\w+)\.png/)||[])[1])||null;var __AF=(typeof ART_FRAMES!=='undefined')&&ART_FRAMES;if(__th&&__AF&&__AF.boss_atk&&__AF.boss_atk.src!==undefined)__AF.boss_atk.src='assets/ra_boss_'+__th+'_atk1.png';}catch(e){} }catch(e){} try{ S.__bossName=__mp?__mp.boss:null; }catch(e){} var __bw=(S.__bossWave||0), __bh=Math.round(BOSS_STATS.hp*__raDiffHp()*__raMapHp()*(1+0.35*__bw)), __bs2=Object.assign({},BOSS_STATS,{dmg:Math.round(BOSS_STATS.dmg*(1+0.15*__bw))}); const BU={key:'boss',team:'red',x:9,y:3.2,c:__bs2,hp:__bh,maxHp:__bh,shield:900,cd:1.2,dir:Math.PI/2,dead:false,swing:0,bob:1,spawnFx:0.45,doom:0,chargeT:0};
      BU.target=kt; units.push(BU); S.boss=BU; ensureKsBtn(); banner('💀 부활한 왕이 강림했다!',2200); sfx('boomL'); } }   /* v192: 보스 강림(최상위 — 타워 파괴·타이머 폴백 공용) */


function __raHudInline(){ try{   /* v202: HUD 4요소+DPS 인라인 !important — 시트 경쟁(잘림·정렬) 근절 */
  var q=function(s){ return document.querySelector(s); };
  function st(el,p,v){ if(el) el.style.setProperty(p,v,'important'); }
  var tm=q('#timer'); if(tm){ st(tm,'position','absolute'); st(tm,'top','calc(12px + env(safe-area-inset-top,0px))'); st(tm,'left','12px'); st(tm,'height','36px'); st(tm,'line-height','36px'); st(tm,'padding','0 14px'); st(tm,'border-radius','999px'); st(tm,'background','rgba(10,18,34,.88)'); st(tm,'border','1.5px solid rgba(255,202,40,.65)'); st(tm,'color','#ffd54f'); st(tm,'font-weight','800'); st(tm,'font-size','16px'); st(tm,'white-space','nowrap'); st(tm,'overflow','visible'); st(tm,'display','inline-flex'); st(tm,'align-items','center'); st(tm,'justify-content','center'); st(tm,'opacity','.92'); }
  var so=q('#btn-sound'); if(so){ st(so,'position','absolute'); st(so,'top','calc(12px + env(safe-area-inset-top,0px))'); st(so,'right','12px'); st(so,'height','36px'); st(so,'min-width','46px'); st(so,'padding','0 10px'); st(so,'border-radius','999px'); st(so,'background','rgba(10,18,34,.88)'); st(so,'border','1.5px solid rgba(255,202,40,.65)'); st(so,'color','#ffd54f'); st(so,'font-size','16px'); st(so,'opacity','.92'); st(so,'display','inline-flex'); st(so,'align-items','center'); st(so,'justify-content','center'); }
  ['ks-btn','btn-kingshot','repair-btn','btn-repair'].forEach(function(id){ var el=q('#'+id); if(!el) return; st(el,'position','absolute'); st(el,'bottom','calc(12px + env(safe-area-inset-bottom,0px))'); st(el,'height','36px'); st(el,'border-radius','999px'); st(el,'padding','0 14px'); st(el,'background','rgba(12,22,42,.88)'); st(el,'border','1.5px solid rgba(255,202,40,.55)'); st(el,'color','#ffd54f'); st(el,'font-weight','700'); st(el,'font-size','13px'); });
  var ks=q('#ks-btn')||q('.kingshot-btn'); if(ks) st(ks,'left','14px');
  var rp=q('#repair-btn')||q('.repair-btn'); if(rp) st(rp,'right','14px');
  var dp=q('#dpsw'); if(dp){ st(dp,'top','calc(38% - 100px)');   /* v487: 100px 상승 */ st(dp,'right','8px'); st(dp,'width','96px'); st(dp,'opacity','.7'); st(dp,'pointer-events','none'); }
}catch(e){ } }
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
  if(team==='blue'&&(S.theme==='ice'||S.theme==='sky')) cc.hp=Math.round(cc.hp*1.02);
  if(team==='blue'&&(S.theme==='lava'||S.theme==='dusk')&&cc.dmg) cc.dmg=Math.round(cc.dmg*1.02);   /* v435: dusk(황혼) — lava 공격 체인 재사용 · lava·wasteland 표기 전용 해소(전면 연결) */   /* v434: sky(천공) — ice 체인 재사용 */   /* v220: 서리 테마 보너스 — 아군 HP +2% */
  var __dm=(team==='red')?__raDiffHp()*__raWaveHp()*__raMapHp():1;   /* v208 난이도 + v212 웨이브 곡선 */
  var __sh=0,__hl=false,__sp=false; if(team==='red'&&!c.kind&&key!=='boss'){ var __tq=Math.random(); if(__tq<0.08){ __sh=Math.round(cc.hp*0.3); } else if(__tq<0.15){ __hl=true; } else if(__tq<0.22){ __sp=true; } }   /* v209: 적 특성 패턴 — 실드·힐러·분열 */
  for(const o of formation(c.count||1)){
    let ux=clamp(x+o[0],0.7,COLS-0.7), uy=clamp(y+o[1],0.7,ROWS-0.7);
    if(!c.flying && uy>RIVER_Y0-0.2 && uy<RIVER_Y1+0.2) uy = team==='blue'? RIVER_Y1+0.25 : RIVER_Y0-0.25;
    units.push({id:uid++, key, team, c:cc, r:cc.r, x:ux, y:uy, hp:Math.round(cc.hp*__dm), maxHp:Math.round(cc.hp*__dm), cd:0.35, swing:0, bob:Math.random()*6.28,
                target:null, spawnFx:0.45, building:c.kind==='building', life:c.life||0, dead:false,
                stun:0, slowT:0, frozenT:0, chargeT:0, charging:false, shield:__sh, healer:__hl, split:__sp, dir:team==='blue'?-Math.PI/2:Math.PI/2});
  }
  if(__sh) floats.push({dx:0,dy:0,x,y:y-0.6,txt:'실드!',t:0.8,col:'#7fe6ff',big:false}); else if(__hl) floats.push({dx:0,dy:0,x,y:y-0.6,txt:'힐러',t:0.8,col:'#8fe6a8',big:false}); else if(__sp) floats.push({dx:0,dy:0,x,y:y-0.6,txt:'분열체',t:0.8,col:'#e0a1ff',big:false});   /* v209: 특성 알림 */
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
  const sp=u.c.spd*(u.charging?1.7:1)*(u.slowT>0?0.55:1)*(u.team==='blue'&&S.__rin==='relic_sprint'?1.15:1)*(u.team==='red'&&S.__rin==='relic_frost'?0.9:1)*(u.team==='blue'&&S.relic==='relic_speed'?1.06:1);   /* v476: 유물 바람 깃털 */   /* v297: 서리의 인장 */   /* v212: 기동의 인장 */
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
const TRAIL={kingshot:'rgba(255,215,94,.9)',arrow:'rgba(232,226,200,.9)',bullet:'#ffe9a8',bomb:'#ffcf7a',wizfb:'#ffb14d',dragon:'#ff9d3c',ice:'#9cdcff',cannon:'#cfd6e0',bolt:'#e8f0fa'};   /* v332: 볼트 꼬리 추가 */
const PROJ_SFX_LAUNCH={arrow:'bow',bullet:'musket',bolt:'xbow',wizfb:'firel',dragon:'firel',bomb:'toss',ice:'icel',cannon:'cannon'};   /* v321 */
/* v324: 프린세스 타워 테마 스킨 게터 — 현재 테마 전용 아트(TSPR 자동 로딩) */
function __towSkinImg(theme,isKing,team){ try{
  if(!theme) return null;
  if(isKing){ var kk=window.__KT_IM&&window.__KT_IM[theme+'_'+(team||'n')]; return (kk&&kk.complete&&kk.naturalWidth>0)?kk:null; }
  var s=TSPR['t_princess_'+theme]; return (s&&s.complete&&s.naturalWidth>0&&s.__valid!==false)?s:null; }catch(e){ return null; } }
window.__KT_IM={};['ice','lava','wasteland','abyss'].forEach(function(th){['b','r','n'].forEach(function(tm){var im=new Image();im.src='assets/ra_kt_'+th+(tm==='n'?'':'_'+tm)+'.png?v=483';window.__KT_IM[th+'_'+tm]=im;});});   /* v483: 킹타워 테마 스킨 4지대×3톤 */
/* v324: 원소 콤보 엔진 — 4초 내 이종 원소 재적중 보너스 */
const ELEM_OF={wizard:'fire',babyd:'fire',flamer:'fire',bomber:'fire',prince:'fire',boar:'fire',boss:'fire',icem:'ice',golem:'ice',giant:'ice',musketeer:'thunder',sniper:'thunder',xbow:'thunder',minions:'thunder',lordknight:'thunder',greed:'poison',scarecrow:'poison',skarmy:'poison'};
const RA_COMBOS={'fire|ice':['증발',0.25,'#ffd9a8','#ffb14d'],'ice|fire':['증발',0.25,'#ffd9a8','#ffb14d'],'fire|poison':['폭발',0.20,'#ffb14d','#ff8a3c'],'poison|fire':['폭발',0.20,'#ffb14d','#ff8a3c'],'thunder|ice':['감전',0.20,'#ffe95e','#fff2a8'],'ice|thunder':['감전',0.20,'#ffe95e','#fff2a8'],'ice|poison':['부식',0.10,'#a5e85c','#c8f09a'],'poison|ice':['부식',0.10,'#a5e85c','#c8f09a'],'thunder|poison':['격발',0.10,'#cf9dff','#ffe95e'],'poison|thunder':['격발',0.10,'#cf9dff','#ffe95e'],'thunder|fire':['융합',0.10,'#ffcf7a','#ffe08a'],'fire|thunder':['융합',0.10,'#ffcf7a','#ffe08a']};
window.__raCombo=function(el,tgt,dmg,team){
  try{
    if(!el||!tgt||tgt.dead||!tgt.key||tgt.isTower) return;
    var nowS=performance.now()/1000, prev=tgt.__lastEl;
    if(prev&&prev.el!==el&&(nowS-prev.t)<4&&(tgt.comboCd||0)<=0){
      var cb=RA_COMBOS[prev.el+'|'+el];
      if(cb){ tgt.comboCd=1.0; tgt.__lastEl=null;
        var bd=Math.max(1,Math.round((dmg||40)*cb[1]));
        dealDamage(tgt,bd,team,true);
        floats.push({dx:(Math.random()*10-5),dy:0,x:tgt.x,y:tgt.y-1.6,txt:cb[0]+' 콤보! +'+bd,t:1.0,col:cb[2],big:true});
        fx.push({x:tgt.x,y:tgt.y,t:0,dur:0.45,kind:'ring',col:cb[2]}); addParts(tgt.x,tgt.y,8,cb[3],2.6,0.5,45); sfx('spark');
        if(cb[0]==='감전') tgt.stun=Math.max(tgt.stun||0,0.4);
        if(cb[0]==='부식') tgt.slowT=Math.max(tgt.slowT||0,2);
      }
    }
    tgt.__lastEl={el:el,t:nowS};
  }catch(__ec){}
};
window.__ROCKS=[1,2].map(function(n){ var im=new Image(); im.src='assets/ra_rock_'+n+'.png'; im.onload=function(){ im.__valid=true; }; im.onerror=function(){ im.__valid=false; }; return im; });   /* v324: 바위 이미지 로더 */
window.__FXIMG={frost:(function(){var im=new Image(); im.src='assets/ra_fx_frost.png'; im.onload=function(){ im.__valid=true; }; im.onerror=function(){ im.__valid=false; }; return im; })(), crater:(function(){var im=new Image(); im.src='assets/ra_fx_crater.png'; im.onload=function(){ im.__valid=true; }; im.onerror=function(){ im.__valid=false; }; return im; })(), slash360:(function(){var im=new Image(); im.src='assets/ra_fx_slash360.png?v=469'; im.onload=function(){ im.__valid=true; }; im.onerror=function(){ im.__valid=false; }; return im; })()};   /* v328: 주문 지역 프리렌더 스프라이트 */
Object.assign(window.__FXIMG,{hitburst:(function(){var im=new Image(); im.src='assets/ra_fx_hit.png'; im.onload=function(){ im.__valid=true; }; im.onerror=function(){ im.__valid=false; }; return im; })(),boom:(function(){var im=new Image(); im.src='assets/ra_fx_boom.png'; im.onload=function(){ im.__valid=true; }; im.onerror=function(){ im.__valid=false; }; return im; })(),slash:(function(){var im=new Image(); im.src='assets/ra_fx_slash.png'; im.onload=function(){ im.__valid=true; }; im.onerror=function(){ im.__valid=false; }; return im; })(),shockring:(function(){var im=new Image(); im.src='assets/ra_fx_shock.png'; im.onload=function(){ im.__valid=true; }; im.onerror=function(){ im.__valid=false; }; return im; })(),heal:(function(){var im=new Image(); im.src='assets/ra_fx_heal.png'; im.onload=function(){ im.__valid=true; }; im.onerror=function(){ im.__valid=false; }; return im; })(),venomfog:(function(){var im=new Image(); im.src='assets/ra_fx_venom.png'; im.onload=function(){ im.__valid=true; }; im.onerror=function(){ im.__valid=false; }; return im; })()});   /* v329: 공격·광역 이펙트 스프라이트 */
function impactProj(p,tgt){
  try{ if(p.elem&&tgt&&!tgt.dead&&tgt.key&&!tgt.isTower) window.__raCombo(p.elem,tgt,p.dmg,p.team); }catch(__ec){}   /* v324: 원거리 원소 콤보 */
  if(p.kind==='kingshot'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.35,kind:'flash'}); fx.push({x:p.tx,y:p.ty,t:0,dur:0.5,kind:'ring',col:'rgba(255,215,94,.95)'}); fx.push({x:p.tx,y:p.ty,t:0,dur:0.45,kind:'boom'}); addParts(p.tx,p.ty,14,'#ffe08a',3,0.5,40); sfx('boomL');
    const bs=S.boss;
    if(bs&&!bs.dead&&Math.hypot(bs.x-p.tx,bs.y-p.ty)<=1.3){ bs.doom=0; bs.stun=3; bs.shield=(bs.shield||0)*0.4; dealDamage(bs,250,'blue'); banner('🎯 킹샷 명중! 파멸기 캔슬 · 그로기 3s',1700); }
    return; }
  if(p.kind==='bullet'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.16,kind:'hit'}); addParts(p.tx,p.ty,3,'#ffe9a8',2.2,0.25,0); sfx('impact'); }
  else if(p.kind==='bolt'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.16,kind:'hit'}); addParts(p.tx,p.ty,2,'#d7e3f4',1.8,0.25,0); sfx('thudL'); }   /* v321 */
  else if(p.kind==='arrow'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.16,kind:'hit'}); sfx('thudL'); } else if(p.kind==='net'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.35,kind:'ring',col:'rgba(196,150,90,.85)'}); sfx('thudL'); }   /* v468: 그물 적중 링 */
  else if(p.kind==='bomb'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.4,kind:'boom'}); addParts(p.tx,p.ty,10,'#ffcf7a',2.8,0.5,50); S.shake=Math.max(S.shake||0,0.18); sfx('boom'); }
  else if(p.kind==='wizfb'||p.kind==='dragon'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.18,kind:'flash'}); addParts(p.tx,p.ty,7,'#ffb14d',2.4,0.4,30); sfx('fwhit');
    if(tgt&&!tgt.dead&&!tgt.isTower){ tgt.burnT=3; tgt.burnDps=22; tgt.burnAcc=0; } }
  else if(p.kind==='ice'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.3,kind:'ring',col:'rgba(156,220,255,.85)'}); addParts(p.tx,p.ty,8,'#9cdcff',2.6,0.45,40); sfx('icehit'); }
  else if(p.kind==='cannon'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.3,kind:'boom'}); addParts(p.tx,p.ty,6,'#cfd6e0',2.2,0.4,40); S.shake=Math.max(S.shake||0,0.12); sfx('boomL'); }
  if(p.kind==='cannon'||p.kind==='stone'){ fx.push({x:p.tx,y:p.ty,t:0,dur:0.5,kind:'ring',col:'rgba(214,205,190,.55)'}); }   /* v469: 착탄 포연 링 잔류 0.5s */
  else { fx.push({x:p.tx,y:p.ty,t:0,dur:0.16,kind:'hit'}); }
}
function shoot(src,tgt,dmg,kind,splash){
  kind=kind||'arrow';
  const d0=Math.hypot(tgt.x-src.x,tgt.y-src.y);
  const v=kind==='bullet'?2.75:(kind==='bolt'?3.0:(kind==='bomb'?1.45:2.25));   /* v321: 볼트 최속 */
  try{ fx.push({x:src.x+(tgt.x-src.x)*0.3,y:src.y+(tgt.y-src.y)*0.3,t:0,dur:0.16,kind:'star',col:'#ffd754',n:5}); }catch(e){ }   /* v195: 포구 방향 오프셋 */
  projs.push({x:src.x, y:src.y-(src.isTower?0.8:0.3), target:tgt, tx:tgt.x, ty:tgt.y,
              spd:v, dmg, team:src.team, kind, splash:splash||0, slow:src.c?src.c.slow:0, hitsAir:src.c?!!src.c.hitsAir:true, fromTower:!!src.isTower,   /* v405: 탄환 스플래시 비행 필터용 — 발사자 대공 여부 적재 */ elem:ELEM_OF[src.key]||null,
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
  try{ if(u&&t&&u.key&&u.c&&u.c.range<=1.6&&t.key&&!t.isTower&&!t.dead) window.__raCombo(ELEM_OF[u.key]||null,t,u.c.dmg,u.team); }catch(__ec){}   /* v324: 근접 원소 콤보 */
  try{
    const k=u.key, tx=t.x, ty=t.y, melee=u.c.range<=1.6;
    if(k==='knight'&&melee){ fx.push({x:tx,y:ty,t:0,dur:0.24,kind:'ring',col:'rgba(223,232,255,.8)'}); addParts(tx,ty,4,'#dfe8ff',2.2,0.3,30); playHit('physical'); }
    else if(k==='giant'&&melee){ S.shake=Math.max(S.shake||0,0.10); fx.push({x:tx,y:ty,t:0,dur:0.35,kind:'ring',col:'rgba(217,185,138,.75)'}); addParts(tx,ty,7,'#d9b98a',2.6,0.5,60); playHit('cannon'); }
    else if(k==='minions'&&melee){ addParts(tx,ty,4,'#b388ff',2.2,0.35,40); playHit('physical'); }
    else if(k==='skarmy'&&melee){ addParts(tx,ty,3,'#eceff1',1.8,0.3,50); playHit('physical'); }
    else if(k==='prince'&&melee){ fx.push({x:tx,y:ty,t:0,dur:0.3,kind:'ring',col:'rgba(255,213,79,.9)'}); addParts(tx,ty,6,'#ffd54f',2.8,0.45,40); if(u.charging) S.shake=Math.max(S.shake||0,0.08); playHit('physical'); }
    else if(k==='valk'&&melee){ fx.push({x:tx,y:ty,t:0,dur:0.35,kind:'slash360'}); addParts(tx,ty,5,'#ffb74d',2.4,0.4,40); playHit('cannon'); }   /* v469: 360도 도끼 참격 스프라이트 */
    else if(k==='boar'&&melee){ addParts(tx,ty,6,'#e0c9a6',2.4,0.4,50); S.shake=Math.max(S.shake||0,0.05); playHit('cannon'); }
    else if(k==='flamer'){ fx.push({x:tx,y:ty,t:0,dur:0.38,kind:'flamegrow'}); addParts(tx,ty,4,'#ff9d3c',2.2,0.35,-60); addParts(tx,ty,2,'#ffd54f',1.6,0.3,-90); playHit('flame'); }   /* v322: 화염방사병 — 커지는 화염(속사라 경량) */
    else if(k==='lordknight'&&melee){ fx.push({x:tx,y:ty,t:0,dur:0.32,kind:'ring',col:'rgba(255,213,79,.9)'}); fx.push({x:tx,y:ty,t:0.06,dur:0.32,kind:'ring',col:'rgba(207,109,245,.75)'}); addParts(tx,ty,7,'#ffd54f',2.8,0.45,50); S.shake=Math.max(S.shake||0,0.12); playHit('boss'); }   /* v322: 기사단장 — 에픽 광역 일격 */
    else if(k==='greed'&&melee){ fx.push({x:tx,y:ty,t:0,dur:0.22,kind:'slash',col:'rgba(207,109,245,.85)',a:Math.atan2(ty-u.y,tx-u.x)}); addParts(tx,ty,4,'#cf6df5',2.0,0.32,30); playHit('physical'); }   /* v322: 탐욕 정령 — 보라 잔상 베기 */
    else if(k==='golem'&&melee){ S.shake=Math.max(S.shake||0,0.20); fx.push({x:tx,y:ty,t:0,dur:0.4,kind:'ring',col:'rgba(140,220,255,.8)'}); addParts(tx,ty,9,'#8cdcff',3.0,0.55,70); playHit('cannon'); }   /* v322: 수정 골렘 — 수정 파편 강타 */
    else if(k==='scarecrow'&&melee){ addParts(tx,ty,3,'#d9c46b',1.8,0.35,60); playHit('physical'); }   /* v322: 허수아비 — 짚 파편 */
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
  if(u.c.range>1.6){ const __pk=(u.key==='musketeer'||u.key==='sniper')?'bullet':(u.key==='xbow'?'bolt':(u.key==='wizard'?'wizfb':(u.key==='bomber'?'bomb':(u.key==='babyd'?'dragon':(u.key==='icem'?'ice':(u.key==='netter'?'net':(u.key==='catapult'?'stone':'arrow'))))))); shoot(u,t,dm,__pk,u.c.splash); }   /* v321: 석궁병 볼트 컨셉 탄환 */
  else { dealDamage(t,dm,u.team); fx.push({x:t.x,y:t.y,t:0,dur:0.18,kind:'hit'}); fx.push({x:t.x,y:t.y,t:0,dur:0.16,kind:'slash',a:Math.atan2(t.y-u.y,t.x-u.x),col:u.team==='blue'?'rgba(159,201,255,.95)':'rgba(255,150,150,.95)'}); addParts(t.x,t.y,3,'#fff2c8',2.0,0.25,0); playHit('physical');
    if(u.c.splash){ for(const s2 of units){ if(s2.dead||s2.team===u.team||s2===t||(s2.flying&&!u.c.hitsAir)) continue;   /* v405: 근접 스플래시 비행 필터 — 대공 불가 공격자 파장은 공중 무피해 */
      if(Math.hypot(s2.x-t.x,s2.y-t.y)<=u.c.splash) dealDamage(s2,Math.round(dm*0.6),u.team); } } }
    if(u.key==='buzzer'){ fx.push({x:u.x,y:u.y,t:0,dur:0.4,kind:'boom'}); fx.push({x:u.x,y:u.y,t:0,dur:0.35,kind:'ring',col:'rgba(170,255,120,.8)'}); addParts(u.x,u.y,10,'#b6ff6e',2.6,0.4,40); S.shake=0.15; sfx('boom'); for(const s3 of units){ if(s3.dead||s3.team===u.team||s3===t) continue; if(Math.hypot(s3.x-u.x,s3.y-u.y)<=1.6) dealDamage(s3,Math.round(dm*0.5),u.team); } killUnit(u,true); }   /* v411: 자폭 벌레 — 최초 타격 시 광역 폭발·소멸(직격 100%+주변 50%) */
}
