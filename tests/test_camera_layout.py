import asyncio,os
from playwright.async_api import async_playwright
BASE=os.environ.get('BASE','http://127.0.0.1:4183/index.html')
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(args=['--no-sandbox'])
  c=await b.new_context(viewport={'width':360,'height':600},service_workers='block');page=await c.new_page()
  await page.goto(BASE+'?cl=1',wait_until='load');await page.wait_for_timeout(4000)
  await page.locator('#btn-start').click();await page.wait_for_timeout(4500)
  r=await page.evaluate('''()=>{const w=document.getElementById('arena-wrap');const wr=w.getBoundingClientRect();const n=document.getElementById('camera-controls');const m=document.querySelector('.camera-modes');const t=document.querySelector('.camera-tools');const st=document.getElementById('camera-status');const mr=m.getBoundingClientRect();const tr=t.getBoundingClientRect();return{parent:n.parentElement.id,cH:wr.height,vh:innerHeight,cTop:wr.top,cBot:wr.bottom,modes:{top:mr.top,bot:mr.bottom,l:mr.left,rt:mr.right},tools:{top:tr.top,bot:tr.bottom},stTop:st.getBoundingClientRect().top,errs:0}}''')
  ok=True
  def chk(c,l):
   nonlocal ok
   print(('PASS ' if c else 'FAIL ')+l+' '+str(c))
   if not c: ok=False
  chk(r['parent']=='arena-wrap','관전 UI가 캔버스 내부로 이동: '+str(r['parent']))
  chk(r['cH']>=r['vh']*0.60,f"캔버스 세로 복원(>=60%): {r['cH']:.0f}/{r['vh']}")
  chk(r['modes']['bot']<=r['cBot']+2 and r['modes']['top']>=r['cTop']-2,'모드 버튼 캔버스 하단 내부')
  chk(r['stTop']<=r['cTop']+80,'배율 표시 캔버스 상단')
  chk(r['modes']['l']>=0 and r['modes']['rt']<=360.5,'모드 버튼 가로 무이탈')
  await b.close(); raise SystemExit(0 if ok else 1)
asyncio.run(main())
