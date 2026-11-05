/* v210 헤드리스 밸런스 체크 — CARDS 테이블 파싱·코스트 효율 이상 감지 */
const fs=require('fs');
const src=fs.readFileSync(__dirname+'/../royal-arena/js/g1-art-assets.js','utf8');
const block=src.match(/const CARDS=\{([\s\S]*?)\n\};/);
if(!block){ console.log('BALANCE:CARDS-NOT-FOUND'); process.exit(1); }
const rows=[];
for(const m of block[1].matchAll(/(\w+):\s*\{name:'([^']+)'[^}]*?cost:(\d+)[^}]*?(?:hp:(\d+),\s*dmg:(\d+),\s*hs:([\d.]+))?/g)){
  const [,key,name,cost,hp,dmg,hs]=m;
  rows.push({key,name,cost:+cost,unit:!!hp,dps:hp&&dmg&&hs?Math.round(+dmg/+hs):0,eff:hp&&dmg&&hs?Math.round((+hp*0.3+(+dmg/+hs)*12)/+cost):0});
}
const units=rows.filter(r=>r.unit);
const med=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length/2)];};
const mEff=med(units.map(r=>r.eff));
let bad=0;
for(const r of rows){
  if(r.unit){ const dev=(r.eff-mEff)/mEff; if(Math.abs(dev)>0.45){ bad++; console.log(`OUTLIER ${r.name}(${r.key}) cost=${r.cost} eff=${r.eff} 중앙=${mEff} 편차=${(dev*100).toFixed(0)}%`); } }
  else console.log(`SPELL ${r.name}(${r.key}) cost=${r.cost}`);
}
console.log(`BALANCE:OK units=${units.length} spells=${rows.length-units.length} outliers=${bad} medianEff=${mEff}`);
process.exit(bad>0?2:0);
