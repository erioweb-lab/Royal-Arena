import asyncio,os
from playwright.async_api import async_playwright
BASE=os.environ.get('BASE','http://127.0.0.1:4183/index.html')
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(args=['--no-sandbox'])
  c=await b.new_context(viewport={'width':360,'height':600},service_workers='block');page=await c.new_page()
  errs=[];page.on('pageerror',lambda e:errs.append(str(e)[:120]))
  await page.goto(BASE+'?si=1',wait_until='load');await page.wait_for_timeout(3000)
  await page.locator('#btn-start').click();await page.wait_for_timeout(4000)
  await page.evaluate("() => window.eval(\"(function(){ let n=0; for(const u of units){ if(u.dead||u.isTower) continue; u.burnT=3;u.slowT=2;u.stun=0.5; if(++n>=3) break; } })()\")")
  await page.wait_for_timeout(1200)
  # 캔버스 픽셀 판정: 유닛 머리 높이 근처에서 아이콘 스트로크 색(주황·파랑) 존재
  px=await page.evaluate("() => window.eval(\"(function(){ const cv=document.querySelector('canvas'); if(!cv) return 'nocanvas'; const cx=cv.getContext('2d'); const W=cv.width,H=cv.height; const d=cx.getImageData(0,0,W,H).data; let hit=0; for(let i=0;i<d.length;i+=16){ const r=d[i],g2=d[i+1],bl=d[i+2]; if(r>220&&g2>120&&g2<190&&bl<90) hit++; if(bl>200&&r<130&&g2>130) hit++; } return hit; })()\")")
  ok=True
  def chk(cond,l):
   nonlocal ok
   print(('PASS ' if cond else 'FAIL ')+l+' '+str(cond))
   if not cond: ok=False
  chk(len(errs)==0,'상태 부여 후 페이지 오류 0: '+str(errs[:2]))
  chk(isinstance(px,int) and px>30,'아이콘 색 픽셀 관측(주황+청파): '+str(px))
  await b.close(); raise SystemExit(0 if ok else 1)
asyncio.run(main())
