import asyncio,os
from playwright.async_api import async_playwright
BASE=os.environ.get('BASE','http://127.0.0.1:4183/index.html')
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(args=['--no-sandbox'])
  c=await b.new_context(viewport={'width':360,'height':600},service_workers='block');page=await c.new_page()
  # 시나리오: 노멀 전맵 완료(악몽 해금 상태) + 악몽에서 로얄 클래식(사다리 0) 방금 승리
  await page.goto(BASE+'?nm=1',wait_until='load');await page.wait_for_timeout(2500)
  await page.evaluate("()=>{localStorage.clear();localStorage.setItem('ra_map_clear_d0','8');localStorage.setItem('ra_map_clear_d1','-1');localStorage.setItem('ra_map_clear_d2','-1');localStorage.setItem('ra_diff_v1','1');localStorage.setItem('ra_map_v1','0');window.__raUnlock&&window.__raUnlock.record(1,0);}")
  await page.goto(BASE+'?nm=2',wait_until='load');await page.wait_for_timeout(3000)  # 메인 복귀(리셋) 상태
  states=[]
  for i in range(8):
   s=await page.evaluate('''()=>[...document.querySelectorAll('.theme-row .t-btn')].map(b=>(b.classList.contains('ra-locked')||b.dataset.locked==='1'?'1':'0')+(b.textContent.includes('🔒')?'L':'-')+(getComputedStyle(b).filter.includes('grayscale')?'G':'-')).join('')''')
   states.append(s);await page.wait_for_timeout(400)
  uniq=set(states)
  # 클릭 선택 가능 검증: 서리(사다리1) 클릭 → ra_map_v1=1 기록
  sel=await page.evaluate('''()=>{const bs=[...document.querySelectorAll('.theme-row .t-btn')];const f=bs.find(b=>b.textContent.includes('용암')||(b.getAttribute('data-theme')||'').includes('lava'));f.click();return localStorage.getItem('ra_map_v1')}''')
  first=states[0]; nlock=first.count('1')
  ok=True
  def chk(c,l):
   nonlocal ok
   print(('PASS ' if c else 'FAIL ')+l+' '+str(c))
   if not c: ok=False
  chk(len(uniq)==1,f'8샘플 상태 불변(깜빡임 0): {len(uniq)}종'); chk(nlock==7,f'악몽 잠금 7개(로얄+서리 해금): {nlock}')
  chk(first[0]=='0-' and '1LG' in first[:6] or first[0:2]=='0-',f'로얄 클래식 해금 유지: {first[:2]}')
  chk(sel=='1',f'용암 클릭 선택 기록(ra_map_v1·표시순서 다음): {sel}')
  await b.close(); raise SystemExit(0 if ok else 1)
asyncio.run(main())
