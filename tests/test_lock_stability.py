import asyncio,os
from playwright.async_api import async_playwright
BASE=os.environ.get('BASE','http://127.0.0.1:4183/index.html')
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(args=['--no-sandbox'])
  c=await b.new_context(viewport={'width':360,'height':600},service_workers='block');page=await c.new_page()
  await page.goto(BASE+'?ls=1',wait_until='load');await page.wait_for_timeout(2500)
  await page.evaluate("()=>{localStorage.setItem('ra_map_clear_d0','8');localStorage.setItem('ra_map_clear_d1','-1');localStorage.setItem('ra_diff_v1','1');localStorage.setItem('ra_map_v1','0');}")
  await page.goto(BASE+'?ls=2',wait_until='load');await page.wait_for_timeout(3000)
  states=[]
  for i in range(8):
   s=await page.evaluate('''()=>[...document.querySelectorAll('.theme-row .t-btn')].map(b=>(b.classList.contains('ra-locked')?'1':'0')+(b.textContent.includes('🔒')?'L':'-')+(getComputedStyle(b).filter.includes('grayscale')?'G':'-')).join('')''')
   states.append(s);await page.wait_for_timeout(400)
  uniq=set(states); locked=states[0].split('0-LG') and states[0]
  n_lock=states[0].count('1LG')
  print('상태 종류:',len(uniq),'잠금 수:',n_lock)
  ok=len(uniq)==1 and n_lock==8
  print('STABLE:', 'PASS' if ok else 'FAIL')
  await b.close(); raise SystemExit(0 if ok else 1)
asyncio.run(main())
