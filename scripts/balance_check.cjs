/* v211 헤드리스 밸런스 체크 — CARDS 파싱·코스트 효율 이상 감지 */
const fs=require('fs');
const src=fs.readFileSync(__dirname+'/../royal-arena/js/g1-art-assets.js','utf8');
const block=src.match(/const CARDS=\{([\s\S]*?)\n\};/);
if(!block){ console.log('BALANCE:CARDS-NOT-FOUND'); process.exit(1); }
const body=block[1], rows=[];
for(const m of body.matchAll(/(\w+):\s*\{name:'([^']+)'/g)){
  const seg=body.slice(m.index, body.indexOf('\n', m.index));
  const cost=(seg.match(/cost:(\d+)/)||[])[1]; if(!cost) continue;
  const hp=(seg.match(/hp:(\d+)/)||[])[1], dmg=(seg.match(/dmg:(\d+)/)||[])[1], hs=(seg.match(/hs:([\d.]+)/)||[])[1], cnt=(seg.match(/count:(\d+)/)||[])[1];
  const unit=!!(hp&&dmg&&hs);
  const n=cnt?+cnt:1, sw=Math.sqrt(n);   /* v211: 다중 스폰 √count 감쇠(뗴전 AOE 취약 반영) */
  rows.push({key:m[1],name:m[2],cost:+cost,unit,eff:unit?Math.round(((+hp*0.3)+((+dmg/+hs)*12))*sw/(+cost)):0});
}
const WLIST={greed:'트레이드오프 특례(최소 체력 보상)'};   /* v211: 의도된 특례 */
const units=rows.filter(r=>r.unit);
const med=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length/2)];};
const mEff=med(units.map(r=>r.eff));
let bad=0;
for(const r of rows){
  if(r.unit){ const dev=(r.eff-mEff)/mEff;
    if(Math.abs(dev)>0.45){ if(WLIST[r.key]) console.log(`WHITELIST ${r.name}(${r.key}) — ${WLIST[r.key]}`);
      else { bad++; console.log(`OUTLIER ${r.name}(${r.key}) cost=${r.cost} eff=${r.eff} 중앙=${mEff} 편차=${(dev*100).toFixed(0)}%`); } } }
  else console.log(`SPELL ${r.name}(${r.key}) cost=${r.cost}`);
}
console.log(`BALANCE:${bad>0?'WARN':'OK'} units=${units.length} spells=${rows.length-units.length} outliers=${bad} medianEff=${mEff}`);
process.exit(bad>0?2:0);
