/* v212 밸런스 시뮬 2종 — 난이도 체인 검증(적 성장 vs 성벽 강화 단조성) */
const hp=[1,1.25,1.55], dmg=[1,1.15,1.35], wall=[1,1.06,1.12], wave=1.9;
let ok=true, prev=0;
for(let d=0;d<3;d++){
  const total=hp[d]*wave;   /* 후반 적 최대 HP 배율 */
  const challenge=total*dmg[d]/wall[d];
  console.log(`DIFF${d} 적HP=${total.toFixed(2)}× 공격=${dmg[d]}× 성벽=${wall[d].toFixed(2)}× 도전도=${challenge.toFixed(2)}`);
  if(challenge<=prev) ok=false; prev=challenge;
}
console.log(`DIFF:${ok?'OK(단조 증가)':'FAIL(역전 발생)'}`); process.exit(ok?0:2);
