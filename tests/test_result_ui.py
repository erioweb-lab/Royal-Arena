import asyncio,os
from playwright.async_api import async_playwright
BASE=os.environ.get('BASE','http://127.0.0.1:4183/index.html')
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(args=['--no-sandbox'])
  c=await b.new_context(viewport={'width':360,'height':550},device_scale_factor=1,service_workers='block');page=await c.new_page()
  await page.goto(BASE+'?ru=1',wait_until='load');await page.wait_for_timeout(4000)
  await page.locator('#btn-how').click();await page.locator('#ra-inote').wait_for(state='attached');await page.wait_for_timeout(1000)
  tip=await page.evaluate('''()=>{const r=document.querySelector('#ra-inote').getBoundingClientRect();return [r.left,r.top,r.right,r.bottom]}''')
  await page.goto(BASE+'?ru=2',wait_until='load');await page.wait_for_timeout(4000)
  await page.locator('#btn-start').click();await page.wait_for_timeout(4500)
  await page.evaluate("() => window.eval(\"finish('red')\")")
  await page.locator('#overlay-result:not(.hidden)').wait_for(state='visible');await page.wait_for_function("document.querySelector('#rt-emblem')&&document.querySelector('#rt-emblem').textContent.length>0");await page.wait_for_timeout(1200)
  e=await page.evaluate('''()=>{const rank=document.querySelector('#rpane-rank');const rr=rank?rank.getBoundingClientRect():null;let clip=0;for(const el of document.querySelectorAll('#overlay-result *')){if(!el.getClientRects().length||getComputedStyle(el).display==='none')continue;for(const n of el.childNodes){if(n.nodeType!==3||!n.textContent.trim())continue;const rg=document.createRange();rg.selectNodeContents(n);if(!rg.getBoundingClientRect().height)continue;for(const r2 of rg.getClientRects()){if(r2.left<-0.5||r2.right>360.5)clip++;}}}return {clip,noScore:!document.querySelector('#rpane-score'),noTabs:document.querySelectorAll('.r-tabs,.rtab').length,rankVisible:!!(rr&&rr.height>0&&getComputedStyle(rank).display!=='none'),emblem:(document.querySelector('#rt-emblem')||{}).textContent||'',brief:((document.querySelector('#rt-brief')||{}).textContent||'').length}}''')
  ok=True
  def chk(c,l):
   nonlocal ok
   print(('PASS ' if c else 'FAIL ')+l+' '+str(c))
   if not c: ok=False
  chk(tip[0]>=-0.5 and tip[1]>=-0.5 and tip[2]<=360.5 and tip[3]<=550.5,'도움말 팁 인뷰포트')
  chk(e['noScore'],'세부집계 패널 삭제'); chk(e['noTabs']==0,'탭 UI 삭제')
  chk(e['rankVisible'],'랭크 평가 즉시 노출'); chk(e['emblem']!='','랭크 엠블럼 존재'); chk(e['brief']>0,'랭크 브리핑 존재')
  chk(e['clip']==0,'클립 텍스트 0')
  await b.close(); raise SystemExit(0 if ok else 1)
asyncio.run(main())
