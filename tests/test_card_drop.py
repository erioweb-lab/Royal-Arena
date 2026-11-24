# v594 회귀 테스트: 첫클리어 카드획득 팝업 20/20 강제 재현 — 미표시 결함 재발 방지 게이트
import os
from playwright.sync_api import sync_playwright
BASE=os.environ.get('CARD_BASE','http://127.0.0.1:4183/index.html')
def test_card_drop_popup_shows_on_first_clear():
    with sync_playwright() as p:
        b=p.chromium.launch(); pg=b.new_page(viewport={'width':360,'height':740})
        pg.goto(BASE,wait_until='networkidle',timeout=30000)
        pg.evaluate("localStorage.setItem('ra_map_seen_v1','{}');localStorage.setItem('ra_diff_v1','0');localStorage.setItem('ra_map_sel_v1','0');localStorage.setItem('ra_collection_v1','{\"owned\":[]}')")
        pg.reload(wait_until='networkidle')
        shown=0
        for i in range(20):
            pg.evaluate("localStorage.setItem('ra_map_seen_v1','{}')")
            pg.evaluate("typeof __raDropRoll==='function'&&__raDropRoll()")
            pg.wait_for_timeout(50)
            if pg.evaluate("!!document.querySelector('.ra-drop')"): shown+=1
            pg.evaluate("document.querySelectorAll('.ra-drop').forEach(e=>e.remove())")
        saved=pg.evaluate("localStorage.getItem('ra_map_seen_v1')")
        b.close()
    assert shown==20, '팝업 표시 %d/20 — 근본 결함 재발'%shown
    assert saved and saved!='{}', '첫클리어 플래그 미저장: %r'%saved
