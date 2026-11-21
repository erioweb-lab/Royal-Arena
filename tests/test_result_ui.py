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
  await page.locator('#overlay-result:not(.hidden)').wait_for(state='visible');await page.wait_for_function("document.querySelector('#rt-mirror').textContent.length>2");await page.wait_for_timeout(1200)
  e=await page.evaluate('''()=>{const pane=document.querySelector('#rpane-score');const pr=pane.getBoundingClientRect();let clip=0;for(const el of document.querySelectorAll('#overlay-result *')){if(!el.getClientRects().length||getComputedStyle(el).display==='none')continue;for(const n of el.childNodes){if(n.nodeType!==3||!n.textContent.trim())continue;const rg=document.createRange();rg.selectNodeContents(n);if(!rg.getBoundingClientRect().height)continue;for(const rr of rg.getClientRects()){if(rr.left<pr.left-0.5||rr.right>pr.right+0.5||rr.left<-0.5||rr.right>360.5)clip++;}}}return {clip,ws:getComputedStyle(document.querySelector('#rt-mirror')).whiteSpace,btn:[...document.querySelectorAll('#overlay-info button')].length} }''')
  ok=True
  def chk(c,l):
   nonlocal ok
   print(('PASS ' if c else 'FAIL ')+l)
   if not c: ok=False
  chk(tip[0]>=-0.5 and tip[1]>=-0.5 and tip[2]<=360.5 and tip[3]<=550.5,'도움말 팁 인뷰포트')
  chk(e['clip']==0,'결과창 클립 텍스트 0'); chk(e['ws']=='pre-line','미러 pre-line')
  await b.close(); raise SystemExit(0 if ok else 1)
asyncio.run(main())
