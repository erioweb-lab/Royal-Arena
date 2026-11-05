/* v212 밸런스 시뮬 1종 — 유닛 듀얼 TTK 매트릭스(정보 제공) */
const fs=require('fs');
const src=fs.readFileSync(__dirname+'/../royal-arena/js/g1-art-assets.js','utf8');
const body=src.match(/const CARDS=\{([\s\S]*?)\n\};/)[1];
const units=[];
for(const m of body.matchAll(/(\w+):\s*\{name:'([^']+)'/g)){
  const seg=body.slice(m.index, body.indexOf('\n', m.index));
  const hp=(seg.match(/hp:(\d+)/)||[])[1], dmg=(seg.match(/dmg:(\d+)/)||[])[1], hs=(seg.match(/hs:([\d.]+)/)||[])[1];
  if(hp&&dmg&&hs) units.push({key:m[1],name:m[2],hp:+hp,dps:+dmg/+hs});
}
let maxTTK=0,who='';
for(const a of units) for(const d of units){ if(a===d) continue;
  const ttk=d.hp/a.dps; if(ttk>maxTTK){ maxTTK=ttk; who=a.name+'→'+d.name; } }
const tanks=[...units].sort((x,y)=>(y.hp/y.dps)-(x.hp/x.dps)).slice(0,3).map(u=>`${u.name} ${(u.hp/u.dps).toFixed(1)}s`);
const dps3=[...units].sort((x,y)=>y.dps-x.dps).slice(0,3).map(u=>`${u.name} ${Math.round(u.dps)}`);
console.log(`DUEL:OK units=${units.length} 최대TTK=${maxTTK.toFixed(1)}s(${who}) 탱크TOP=[${tanks.join(' · ')}] 딜TOP=[${dps3.join(' · ')}]`);
