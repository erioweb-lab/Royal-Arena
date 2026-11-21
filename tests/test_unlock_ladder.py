import asyncio,os
from playwright.async_api import async_playwright
BASE=os.environ.get('BASE','http://127.0.0.1:4183/index.html')
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(args=['--no-sandbox'])
  c=await b.new_context(viewport={'width':360,'height':600},service_workers='block');page=await c.new_page()
  await page.goto(BASE+'?ut=1',wait_until='load');await page.wait_for_timeout(4000)
  r=await page.evaluate('''()=>{const U=window.__raUnlock;if(!U)return{fail:'no module'};const out={};
   localStorage.clear();U.mig();
   const btns=[...document.querySelectorAll('.theme-row .t-btn')];
   const frost=btns.find(b=>b.textContent.includes('서리')||(b.getAttribute('data-theme')||'').includes('ice'));
   const lava=btns.find(b=>b.textContent.includes('용암')||(b.getAttribute('data-theme')||'').includes('lava'));
   out.frostLI=U.ladderIdx(frost);out.lavaLI=U.ladderIdx(lava);
   frost.click();out.frostBlocked=localStorage.getItem('ra_map_v1');
   U.record(0,0);frost.click();out.frostAllowed=localStorage.getItem('ra_map_v1');
   U.record(0,1);lava.click();out.lavaAllowed=localStorage.getItem('ra_map_v1');
   out.gates=[U.diffUn(0),U.diffUn(1),U.diffUn(2)];
   U.record(0,8);out.nmAt8=U.diffUn(1);out.hellAt8=U.diffUn(2);
   U.record(1,8);out.hellFull=U.diffUn(2);
   return out;}''')
  ok=True
  def chk(k,want,label):
   nonlocal ok
   good=r.get(k)==want; print(('PASS ' if good else 'FAIL ')+label)
   if not good: ok=False
  chk('frostLI',1,'서리 사다리idx 이름매칭'); chk('lavaLI',2,'용암 사다리idx')
  chk('frostBlocked',None,'0맵 서리 차단'); chk('frostAllowed','1','1맵 후 서리 허용')
  chk('lavaAllowed','2','2맵 후 용암 허용'); chk('gates',[True,False,False],'초기 게이트')
  chk('nmAt8',True,'악몽=노멀전맵'); chk('hellAt8',False,'지옥 잠금'); chk('hellFull',True,'지옥=악몽전맵')
  await b.close(); raise SystemExit(0 if ok else 1)
asyncio.run(main())
