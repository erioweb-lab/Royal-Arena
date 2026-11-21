import asyncio,json,os
from playwright.async_api import async_playwright
BASE=os.environ.get('BASE','http://127.0.0.1:4183/index.html')
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(args=['--no-sandbox'])
  c=await b.new_context(viewport={'width':360,'height':600},service_workers='block');page=await c.new_page()
  errs=[]
  page.on('pageerror',lambda e:errs.append(str(e)[:120]))
  await page.goto(BASE+'?sz=1',wait_until='load');await page.wait_for_timeout(3000)
  await page.locator('#btn-start').click();await page.wait_for_timeout(4000)
  await page.evaluate("() => window.eval(\"fx.push({x:9,y:9,t:0,dur:2.5,kind:'shockzone',r:2.2,team:'red'})\")")
  await page.wait_for_timeout(800)
  r1=await page.evaluate("() => window.eval(\"JSON.stringify({alive:fx.some(f=>f.kind==='shockzone'),ticks:(fx.find(f=>f.kind==='shockzone')||{})._acc!==undefined})\")")
  await page.wait_for_timeout(2200)
  r2=await page.evaluate("() => window.eval(\"JSON.stringify({gone:!fx.some(f=>f.kind==='shockzone')})\")")
  d1=json.loads(r1);d2=json.loads(r2)
  # 정적 배선 단언: ult shock·doom 분기·ZK·렌더
  wire=await page.evaluate("() => window.eval(\"JSON.stringify({ultSh:(__raMAPS.find(m=>m.id==='sky')||{}).ult,zk:fx._zk||'na'})\")")
  ok=True
  def chk(cond,l):
   nonlocal ok
   print(('PASS ' if cond else 'FAIL ')+l+' '+str(cond))
   if not cond: ok=False
  chk(d1['alive'],'shockzone fx 지속(렌더 분기 예외 없음)'); chk(d1['ticks'],'틱 어큐뮬레이터 가동')
  chk(d2['gone'],'dur 소진 후 소멸'); chk(len(errs)==0,'페이지 오류 0: '+str(errs[:2]))
  chk(json.loads(wire)['ultSh']=='shock','sky ult=shock 배선')
  await b.close(); raise SystemExit(0 if ok else 1)
asyncio.run(main())
