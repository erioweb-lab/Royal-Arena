import asyncio,json,os
from playwright.async_api import async_playwright
BASE=os.environ.get('BASE','http://127.0.0.1:4183/index.html')
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(args=['--no-sandbox'])
  c=await b.new_context(viewport={'width':360,'height':600},service_workers='block');page=await c.new_page()
  errs=[];page.on('pageerror',lambda e:errs.append(str(e)[:120]))
  await page.goto(BASE+'?ns=1',wait_until='load');await page.wait_for_timeout(3000)
  await page.locator('#btn-start').click();await page.wait_for_timeout(4000)
  await page.evaluate("() => window.eval(\"fx.push({x:9,y:9,t:0,dur:2.5,kind:'rotzone',r:2.2,team:'red'},{x:12,y:9,t:0,dur:2.5,kind:'timewarp',r:2.2,team:'red'})\")")
  await page.wait_for_timeout(1000)
  r1=await page.evaluate("() => window.eval(\"JSON.stringify({rot:fx.some(f=>f.kind==='rotzone'),warp:fx.some(f=>f.kind==='timewarp'),warpAcc:(fx.find(f=>f.kind==='timewarp')||{})._acc!==undefined})\")")
  await page.wait_for_timeout(2400)
  r2=await page.evaluate("() => window.eval(\"JSON.stringify({gone:!fx.some(f=>f.kind==='rotzone'||f.kind==='timewarp')})\")")
  wire=await page.evaluate("() => window.eval(\"JSON.stringify({tomb:(__raMAPS.find(m=>m.id==='tomb')||{}).ult,dusk:(__raMAPS.find(m=>m.id==='dusk')||{}).ult})\")")
  d1=json.loads(r1);d2=json.loads(r2);w=json.loads(wire)
  ok=True
  def chk(cond,l):
   nonlocal ok
   print(('PASS ' if cond else 'FAIL ')+l+' '+str(cond))
   if not cond: ok=False
  chk(d1['rot'] and d1['warp'],'rotzone·timewarp 지속(렌더 무오류)'); chk(d1['warpAcc'],'틱 어큐뮬레이터 가동')
  chk(d2['gone'],'dur 소진 소멸'); chk(w['tomb']=='rot' and w['dusk']=='warp','tomb=rot·dusk=warp 배선')
  chk(len(errs)==0,'페이지 오류 0: '+str(errs[:2]))
  await b.close(); raise SystemExit(0 if ok else 1)
asyncio.run(main())
