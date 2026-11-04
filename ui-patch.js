/* ==========================================================================
   ui-patch.js — 로얄 아레나 전 화면 UI/UX 완성 패치
   [핵심 반영] 덱 편성 화면:
   1) 상단 '전투 덱 편성부(4열x2행=8칸 고정)' + 빈 슬롯 점선 가이드 자동 생성
   2) 하단 '보유 카드 풀부(6열x가변행)' flex: 1 1 0% & overflow-y: auto 적용하여 모바일 화면 크기에 완전 적응
   3) 모바일 브라우저(하단 툴바 등)에서도 하단 [이 슬롯에 저장] + [닫기] 버튼이 100% 잘림 없이 선명하게 노출
   4) 전투 덱 0/8일 때 '평균 엘릭서 NaN' -> '평균 엘릭서 0.0' 자동 교정
   5) 덱 슬롯 A / B 아이콘 밝은 골드 가시성 복원 및 자동 닫기 바인딩
   ========================================================================== */
(function () {
  const PATCH_STYLE_ID = 'ra-final-override';

  function injectStyle() {
    if (!document.head) return;

    ['rf-style', 'ui-v179', 'ui-v183', 'ui-v185', 'ui-v186'].forEach(id => {
      const old = document.getElementById(id);
      if (old) old.remove();
    });

    let style = document.getElementById(PATCH_STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = PATCH_STYLE_ID;
    }
    document.head.appendChild(style);

    style.textContent = `
      /* ===== 0. 전역 스크롤바 제거 & 폰트 선명화 ===== */
      *, *::before, *::after {
        box-sizing: border-box !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
        -webkit-text-stroke: 0px transparent !important;
      }

      *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }

      html, body, #app,
      #screen-title, #screen-title *,
      #screen-battle button,
      #overlay-result, #overlay-result *,
      #deck-edit, #deck-edit *,
      #overlay-hof, #overlay-hof *,
      #overlay-skill, #overlay-skill *,
      #overlay-profile, #overlay-profile *,
      #overlay-relic, #overlay-relic *,
      #overlay-info, #overlay-info * {
        font-family: 'Pretendard Variable', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif !important;
      }

      .hidden {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      /* ==========================================================================
         1. 메인 타이틀 화면 (#screen-title)
         ========================================================================== */
      #screen-title .t-panel,
      #screen-title .t-codex,
      #screen-title .cards-sec,
      #screen-title #codex {
        display: none !important;
      }

      #screen-title:not(.hidden) {
        width: 100% !important;
        max-width: 430px !important;
        height: calc(100dvh - 16px) !important;
        max-height: calc(100dvh - 16px) !important;
        margin: 8px auto !important;
        padding: 16px 16px 14px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        align-items: center !important;
        gap: 8px !important;
        overflow: hidden !important;
        background: radial-gradient(circle at 50% 12%, #1a2c54 0%, #0d172e 55%, #080f1e 100%) !important;
        border: 1.5px solid rgba(255, 202, 40, 0.55) !important;
        border-radius: 22px !important;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
      }

      #screen-title h1, #screen-title .t-logo {
        font-size: 26px !important;
        font-weight: 900 !important;
        letter-spacing: 1px !important;
        color: #ffd54f !important;
        text-shadow: 0 2px 8px rgba(255, 179, 0, 0.35), 0 2px 3px rgba(0, 0, 0, 0.9) !important;
        margin: 0 !important;
      }

      #screen-title .theme-row {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 7px !important;
        width: 100% !important;
        padding: 5px !important;
        background: rgba(8, 14, 28, 0.75) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 16px !important;
        margin: 0 !important;
      }

      #screen-title .theme-row .t-btn,
      #screen-title .theme-row button {
        height: 38px !important;
        border-radius: 12px !important;
        font-size: 12.5px !important;
        font-weight: 800 !important;
        padding: 0 6px !important;
        background: rgba(20, 32, 58, 0.65) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        color: #8fa4c8 !important;
        display: inline-flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 5px !important;
        white-space: nowrap !important;
      }

      #screen-title .theme-row .t-btn.sel,
      #screen-title .theme-row .t-btn.active,
      #screen-title .theme-row button.sel,
      #screen-title .theme-row button.active {
        background: linear-gradient(180deg, #ffca28 0%, #f57c00 100%) !important;
        border: 1.5px solid #fff3c4 !important;
        color: #1a0e00 !important;
        font-weight: 900 !important;
        box-shadow: 0 3px 12px rgba(255, 160, 0, 0.45) !important;
      }

      #screen-title #deck-pick {
        display: flex !important;
        flex-direction: column !important;
        gap: 7px !important;
        width: 100% !important;
        margin: 0 !important;
      }

      #screen-title #title-actions {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 8px !important;
        width: 100% !important;
        margin: 0 !important;
      }

      #screen-title .t-links {
        width: 100% !important;
        margin: 0 !important;
      }

      /* ==========================================================================
         2. 전투 화면 (#screen-battle)
         ========================================================================== */
      #screen-battle:not(.hidden) {
        width: 100% !important;
        max-width: 480px !important;
        height: 100dvh !important;
        max-height: 100dvh !important;
        margin: 0 auto !important;
        padding: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        background: #08101f !important;
        overflow: hidden !important;
        position: relative !important;
      }

      #screen-battle #topbar {
        position: absolute !important;
        top: calc(6px + env(safe-area-inset-top, 0px)) !important;
        left: 10px !important;
        right: 10px !important;
        width: auto !important;
        height: 36px !important;
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        pointer-events: none !important;
        z-index: 50 !important;
      }

      #screen-battle #topbar > * {
        pointer-events: auto !important;
      }

      #gutL, #gutR {
        z-index: 55 !important;
        pointer-events: auto !important;
      }
      #gutL { left: 10px !important; top: 8px !important; }
      #gutR { right: 10px !important; top: 8px !important; }

      #arena-wrap {
        flex: 1 1 0% !important;
        min-height: 0 !important;
        width: 100% !important;
        height: 100% !important;
        padding: 2px 0 !important;
        margin: 0 auto !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        overflow: hidden !important;
        position: relative !important;
      }

      #arena, canvas#arena {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        object-fit: contain !important;
        display: block !important;
        margin: 0 auto !important;
        border: none !important;
      }

      #ks-btn, #btn-kingshot, .kingshot-btn {
        bottom: 8px !important;
        left: 12px !important;
        height: 32px !important;
        padding: 0 10px !important;
        font-size: 12px !important;
        font-weight: 800 !important;
        border-radius: 10px !important;
        z-index: 45 !important;
      }
      #repair-btn, #btn-repair, .repair-btn {
        bottom: 8px !important;
        right: 12px !important;
        height: 32px !important;
        padding: 0 10px !important;
        font-size: 12px !important;
        font-weight: 800 !important;
        border-radius: 10px !important;
        z-index: 45 !important;
      }

      #hud {
        flex: 0 0 auto !important;
        width: 100% !important;
        padding: 6px 8px calc(5px + env(safe-area-inset-bottom, 0px)) !important;
        background: linear-gradient(180deg, #0f1b33 0%, #091120 100%) !important;
        border-top: 1px solid rgba(247, 197, 49, 0.3) !important;
        overflow: visible !important;
        z-index: 45 !important;
      }

      #hand-row {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
        margin-bottom: 5px !important;
        overflow: visible !important;
      }

      #next-slot, #next-wrap, #next-card {
        flex: 0 0 40px !important;
        width: 40px !important;
        height: 50px !important;
        transform: scale(0.88) !important;
      }

      #cards {
        flex: 0 1 auto !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
        overflow: visible !important;
      }

      #cards .card, #cards .hcard {
        flex: 0 0 56px !important;
        width: 56px !important;
        max-width: 56px !important;
        height: 66px !important;
        border-radius: 9px !important;
        padding: 2px !important;
        position: relative !important;
        overflow: visible !important;
      }

      #cards .card .nm, #cards .card b {
        font-size: 10px !important;
        font-weight: 800 !important;
        line-height: 1.05 !important;
        white-space: nowrap !important;
      }

      #cards .card .cost {
        width: 19px !important;
        height: 19px !important;
        font-size: 10.5px !important;
        font-weight: 900 !important;
        top: -5px !important;
        left: -3px !important;
        z-index: 15 !important;
      }

      #elixir-row {
        width: 100% !important;
        max-width: 280px !important;
        height: 20px !important;
        margin: 0 auto !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 7px !important;
      }

      #elixir-row .hidden, #x2-chip.hidden, #elixir-x2.hidden {
        display: none !important;
      }

      #elixir-num {
        flex: 0 0 auto !important;
        font-size: 15px !important;
        font-weight: 900 !important;
        color: #f3e8ff !important;
        line-height: 1 !important;
      }

      #elixir-track, #elixir-bar {
        flex: 1 1 auto !important;
        width: 100% !important;
        height: 13px !important;
        background: rgba(11, 18, 34, 0.95) !important;
        border: 1.5px solid rgba(199, 125, 255, 0.65) !important;
        border-radius: 999px !important;
        overflow: hidden !important;
        position: relative !important;
        display: block !important;
      }

      #elixir-fill {
        height: 100% !important;
        display: block !important;
        background: linear-gradient(90deg, #8a3fd0 0%, #c77dff 100%) !important;
        border-radius: 999px !important;
      }

      /* ==========================================================================
         3. [완벽 고정] 🃏 덱 편성 (#deck-edit)
         - 모바일 화면 완전 맞춤: 상단 8칸 고정 + 하단 가변 카드 풀 + 하단 [이 슬롯에 저장] 100% 상시 노출!
         ========================================================================== */
      #deck-edit:not(.hidden) {
        position: fixed !important;
        inset: 0 !important;
        width: min(430px, 96vw) !important;
        height: calc(100dvh - 12px) !important;
        max-width: 430px !important;
        max-height: calc(100dvh - 12px) !important;
        margin: auto !important;
        padding: 8px 10px !important;
        border-radius: 18px !important;
        border: 1.5px solid rgba(255, 202, 40, 0.65) !important;
        background: linear-gradient(180deg, #152544 0%, #0b1426 100%) !important;
        box-shadow: 0 18px 44px rgba(0, 0, 0, 0.92), 0 0 0 100vmax rgba(4, 9, 18, 0.85) !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        align-items: stretch !important;
        gap: 4px !important;
        z-index: 99990 !important;
        overflow: hidden !important;
      }

      /* 빈 슬롯 가이드 박스 (전투 덱이 8장 미만일 때 자리 유지용) */
      .ra-empty-slot {
        width: 100% !important;
        height: 52px !important;
        border-radius: 8px !important;
        border: 1.5px dashed rgba(255, 213, 79, 0.25) !important;
        background: rgba(10, 18, 34, 0.45) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: rgba(255, 213, 79, 0.35) !important;
        font-size: 10px !important;
        font-weight: 700 !important;
        pointer-events: none !important;
        user-select: none !important;
      }

      /* 덱 편집 모달 버튼 텍스트 겹침 방지 및 1:1 대칭 정렬 패치 */
      #deck-edit button,
      #deck-edit .dk-act,
      #deck-edit .dk-sub,
      #dk-save,
      #dk-close {
        text-shadow: none !important;
        -webkit-text-stroke: 0px transparent !important;
        letter-spacing: -0.2px !important;
      }

      #deck-edit .dk-act, #deck-edit #dk-save {
        background: linear-gradient(180deg, #ffca28 0%, #ff8f00 100%) !important;
        color: #120a00 !important;
        border: 1.5px solid #ffe082 !important;
        font-size: 14.5px !important;
        font-weight: 900 !important;
        height: 44px !important;
        border-radius: 12px !important;
        text-shadow: none !important;
        box-shadow: 0 4px 12px rgba(255, 160, 0, 0.35) !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        white-space: nowrap !important;
      }

      #deck-edit .dk-sub, #deck-edit #dk-close {
        background: linear-gradient(180deg, #2b3f66 0%, #18243d 100%) !important;
        color: #f0f6ff !important;
        border: 1.5px solid #4f6d9e !important;
        font-size: 14.5px !important;
        font-weight: 800 !important;
        height: 44px !important;
        border-radius: 12px !important;
        text-shadow: none !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        white-space: nowrap !important;
      }

      /* ==========================================================================
         4. 나머지 오버레이 모달 (#overlay-result, #overlay-hof, #overlay-skill, #overlay-profile, #overlay-relic, #overlay-info)
         ========================================================================== */
      #overlay-result:not(.hidden),
      #overlay-hof:not(.hidden),
      #overlay-skill:not(.hidden),
      #overlay-profile:not(.hidden),
      #overlay-relic:not(.hidden),
      #overlay-info:not(.hidden) {
        position: fixed !important;
        inset: 0 !important;
        width: 100vw !important;
        height: 100dvh !important;
        margin: 0 !important;
        padding: 10px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        background: rgba(4, 9, 18, 0.85) !important;
        backdrop-filter: blur(6px) !important;
        z-index: 99990 !important;
        overflow: hidden !important;
      }

      #overlay-result > .r-box,
      #overlay-hof > .hof-card,
      #overlay-skill > .rpanel,
      #overlay-profile > .rpanel,
      #overlay-relic > .rpanel,
      #overlay-info > .info-box {
        position: relative !important;
        inset: auto !important;
        transform: none !important;
        width: min(410px, 95vw) !important;
        max-width: 410px !important;
        max-height: calc(100dvh - 20px) !important;
        margin: 0 auto !important;
        padding: 14px 16px !important;
        border-radius: 20px !important;
        border: 1.5px solid rgba(255, 202, 40, 0.65) !important;
        background: linear-gradient(180deg, #162645 0%, #0b1426 100%) !important;
        box-shadow: 0 18px 44px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 6px !important;
        overflow: hidden !important;
      }

      /* 🏆 명예의 전당 */
      #overlay-hof > .hof-card { max-width: 380px !important; padding: 16px !important; }
      #overlay-hof .hof-podium {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        align-items: end !important;
        gap: 8px !important;
        width: 100% !important;
      }
      #overlay-hof .hof-podium * { white-space: nowrap !important; }

      /* 🎓 전술 연구소 */
      #overlay-skill > .rpanel { width: min(430px, 96vw) !important; max-width: 430px !important; padding: 12px !important; }
      #overlay-skill #sk-grid {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 6px !important;
        width: 100% !important;
        overflow: hidden !important;
      }
      #overlay-skill .sk-col {
        width: 100% !important;
        min-width: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 6px !important;
      }
      #overlay-skill .sk-item {
        width: 100% !important;
        min-height: 76px !important;
        padding: 6px 6px 26px !important;
        border-radius: 10px !important;
        background: rgba(11, 19, 38, 0.85) !important;
        border: 1px solid rgba(255, 255, 255, 0.14) !important;
        position: relative !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
      }
      #overlay-skill .sk-item b { font-size: 11px !important; white-space: nowrap !important; }
      #overlay-skill .sk-item small { font-size: 9.5px !important; line-height: 1.15 !important; }
      #overlay-skill .sk-item .sk-lv {
        position: absolute !important;
        left: 6px !important;
        bottom: 5px !important;
        font-size: 10px !important;
        color: #ffd54f !important;
      }
      #overlay-skill .sk-item button {
        position: absolute !important;
        bottom: 4px !important;
        width: 22px !important;
        height: 22px !important;
        min-width: 22px !important;
        min-height: 22px !important;
        padding: 0 !important;
        border-radius: 6px !important;
        font-size: 13px !important;
      }
      #overlay-skill .sk-item button:first-of-type { right: 4px !important; }
      #overlay-skill .sk-item button:last-of-type { right: 28px !important; }

      /* 🎖️ 지휘관 프로필 */
      #overlay-profile > .rpanel {
        width: min(390px, 94vw) !important;
        max-width: 390px !important;
        padding: 15px 16px !important;
        gap: 7px !important;
      }
      #overlay-profile .prf-row {
        width: 100% !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      }
      #overlay-profile .prf-row input {
        flex: 1 1 auto !important;
        height: 38px !important;
        padding: 0 12px !important;
        border-radius: 10px !important;
        background: rgba(8, 14, 28, 0.9) !important;
        border: 1.5px solid #3b5280 !important;
        color: #fff !important;
      }
      #overlay-profile #prf-list {
        width: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 5px !important;
        max-height: 160px !important;
      }
      #overlay-profile .prf-item {
        width: 100% !important;
        height: 38px !important;
        padding: 0 12px !important;
        border-radius: 10px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
      }

      /* 엔딩 결과 화면 (#overlay-result) */
      #overlay-result > *:not(.r-box) { display: none !important; }
      #overlay-result > .r-box { width: min(350px, 92vw) !important; max-width: 350px !important; }
      #overlay-result #r-art { width: 58px !important; height: 58px !important; border-radius: 12px !important; }
      #overlay-result .rsnap, #overlay-result #rf-snap {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 8px !important;
        width: 100% !important;
      }
      #overlay-result .r-tabs {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 8px !important;
        width: 100% !important;
      }
      #overlay-result #rpane-score {
        width: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 2px !important;
      }
      #overlay-result .rrow {
        width: 100% !important;
        height: 22px !important;
        padding: 1px 6px !important;
        font-size: 12px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
      }
      #overlay-result #r-actions, #overlay-result .rbrow {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 10px !important;
        width: 100% !important;
        margin-top: 6px !important;
      }
      #overlay-result #btn-again, #overlay-result #btn-home, #overlay-result #btn-main {
        width: 100% !important;
        height: 42px !important;
        margin: 0 !important;
        border-radius: 12px !important;
        font-size: 14.5px !important;
        font-weight: 800 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
      }
      #overlay-result #btn-again {
        background: linear-gradient(180deg, #ffca28 0%, #ff8f00 100%) !important;
        color: #1f1100 !important;
        border: 1.5px solid #ffe082 !important;
      }
      #overlay-result #btn-home, #overlay-result #btn-main {
        background: linear-gradient(180deg, #2b3f66 0%, #18243d 100%) !important;
        color: #f0f6ff !important;
        border: 1.5px solid #4f6d9e !important;
      }
    `;
  }

  function applyInlineOverrides() {
    if (typeof window.__navUp === 'function') window.__navUp = function () {};
    if (typeof window.__uiUp === 'function') window.__uiUp = function () {};

    const setImp = (el, prop, val) => {
      if (el && el.style) el.style.setProperty(prop, val, 'important');
    };

    // 1. 메인 화면 '배틀 시작' 버튼
    const startBtn = document.getElementById('btn-start');
    if (startBtn) {
      setImp(startBtn, 'background', 'linear-gradient(90deg, #ffb300 0%, #ff6d00 50%, #ff8f00 100%)');
      setImp(startBtn, 'border', '2px solid #ffe082');
      setImp(startBtn, 'color', '#1b0e00');
      setImp(startBtn, 'font-size', '18.5px');
      setImp(startBtn, 'font-weight', '900');
      setImp(startBtn, 'height', '50px');
      setImp(startBtn, 'border-radius', '16px');
    }

    // 2. 메인 화면 덱 1 / 덱 2 선택 강조
    const deckPick = document.getElementById('deck-pick');
    if (deckPick) {
      Array.from(deckPick.children).forEach(card => {
        const txt = (card.textContent || '').trim();
        const isSelected = txt.includes('선택됨') || card.classList.contains('on') || card.classList.contains('active');
        setImp(card, 'width', '100%');
        setImp(card, 'min-height', '52px');
        setImp(card, 'padding', '8px 14px');
        setImp(card, 'border-radius', '14px');
        if (isSelected) {
          setImp(card, 'background', 'linear-gradient(135deg, rgba(66, 50, 18, 0.92) 0%, rgba(26, 38, 68, 0.96) 100%)');
          setImp(card, 'border', '2px solid #ffd54f');
          setImp(card, 'box-shadow', '0 0 16px rgba(255, 213, 79, 0.35)');
          setImp(card, 'opacity', '1');
        } else {
          setImp(card, 'background', 'rgba(13, 22, 42, 0.72)');
          setImp(card, 'border', '1px solid rgba(148, 163, 184, 0.25)');
          setImp(card, 'box-shadow', 'none');
          setImp(card, 'opacity', '0.68');
        }
      });
    }

    // 3. 메인 하단 메뉴 버튼 컬러 포인트
    document.querySelectorAll('#title-actions > *, .t-links button, #btn-info').forEach(btn => {
      const t = (btn.textContent || '').trim();
      setImp(btn, 'width', '100%');
      setImp(btn, 'height', '43px');
      setImp(btn, 'min-height', '43px');
      setImp(btn, 'margin', '0');
      setImp(btn, 'border-radius', '12px');
      setImp(btn, 'font-size', '13.5px');
      setImp(btn, 'font-weight', '800');
      if (t.includes('덱 편성')) {
        setImp(btn, 'background', 'linear-gradient(180deg, #432371 0%, #2a144a 100%)');
        setImp(btn, 'border', '1.5px solid #9d5ce6');
        setImp(btn, 'color', '#f3e8ff');
      } else if (t.includes('전술 연구소')) {
        setImp(btn, 'background', 'linear-gradient(180deg, #542c0e 0%, #331906 100%)');
        setImp(btn, 'border', '1.5px solid #e08b32');
        setImp(btn, 'color', '#ffdfb8');
      } else if (t.includes('게임 방법')) {
        setImp(btn, 'background', 'linear-gradient(180deg, #114b46 0%, #0a2e2b 100%)');
        setImp(btn, 'border', '1.5px solid #2ec4b6');
        setImp(btn, 'color', '#d8fbf8');
      } else {
        setImp(btn, 'background', 'linear-gradient(180deg, #182848 0%, #0f192f 100%)');
        setImp(btn, 'border', '1.5px solid rgba(247, 197, 49, 0.52)');
        setImp(btn, 'color', '#ffd54f');
      }
    });

    // 4. [핵심 수복] 🃏 덱 편성(#deck-edit) — 모바일 화면 완전 맞춤 & 하단 저장버튼 고정
    const deckEdit = document.getElementById('deck-edit');
    if (deckEdit) {
      if (deckEdit.parentElement !== document.body) {
        document.body.appendChild(deckEdit);
      }

      // (1) '평균 엘릭서 NaN' 오류 문구를 '평균 엘릭서 0.0'으로 즉시 교정 & 검은색 A/B 아이콘 골드화
      deckEdit.querySelectorAll('span, div, b, p, button').forEach(el => {
        if (el.children.length === 0 && el.textContent) {
          if (el.textContent.includes('NaN')) {
            el.textContent = el.textContent.replace(/NaN/g, '0.0');
          }
          const t = el.textContent.trim();
          if (t === 'A' || t === 'B' || t === '🅰' || t === '🅱' || t === '🅰️' || t === '🅱️') {
            el.textContent = t.includes('A') || t.includes('🅰') ? 'A' : 'B';
            setImp(el, 'color', '#ffd54f');
            setImp(el, 'background', 'rgba(255, 213, 79, 0.16)');
            setImp(el, 'border', '1px solid rgba(255, 213, 79, 0.5)');
            setImp(el, 'border-radius', '6px');
            setImp(el, 'padding', '1px 7px');
            setImp(el, 'font-size', '13px');
            setImp(el, 'font-weight', '900');
          }
        }
      });

      // (2) 상단 슬롯 1 / 슬롯 2 선택 바 컴팩트 정렬
      const allEls = Array.from(deckEdit.querySelectorAll('button, div'));
      const slot1Btn = allEls.find(el => (el.textContent || '').trim().includes('덱 슬롯 1') && el.children.length <= 3);
      if (slot1Btn && slot1Btn.parentElement && slot1Btn.parentElement !== deckEdit) {
        const slotRow = slot1Btn.parentElement;
        setImp(slotRow, 'flex', '0 0 auto');
        setImp(slotRow, 'display', 'flex');
        setImp(slotRow, 'flex-direction', 'row');
        setImp(slotRow, 'align-items', 'center');
        setImp(slotRow, 'gap', '8px');
        setImp(slotRow, 'width', '100%');
        Array.from(slotRow.querySelectorAll('button')).forEach(sb => {
          setImp(sb, 'height', '40px');
          setImp(sb, 'min-width', '74px');
          setImp(sb, 'padding', '3px 8px');
          setImp(sb, 'border-radius', '12px');
        });
      }

      // (3) 전투 덱 그리드(위쪽)와 보유 카드 풀 그리드(아래쪽) 정확히 식별하여 고정 높이 적용
      let curGrid = document.getElementById('dk-cur') || document.getElementById('deck-slots');
      let poolGrid = document.getElementById('dk-pool') || document.getElementById('deck-pool');

      if (!curGrid || !poolGrid) {
        const children = Array.from(deckEdit.children);
        children.forEach((ch, idx) => {
          const txt = (ch.textContent || '').trim();
          if (txt.startsWith('전투 덱') && children[idx + 1]) curGrid = children[idx + 1];
          if (txt.startsWith('보유 카드 풀') && children[idx + 1]) poolGrid = children[idx + 1];
        });
      }

      const styleCardItem = (card, imgSize) => {
        setImp(card, 'width', '100%');
        setImp(card, 'min-width', '0');
        setImp(card, 'max-width', 'none');
        setImp(card, 'height', '100%');
        setImp(card, 'min-height', '0');
        setImp(card, 'margin', '0');
        setImp(card, 'padding', '2px 1px');
        setImp(card, 'border-radius', '8px');
        setImp(card, 'background', 'rgba(18, 31, 58, 0.92)');
        setImp(card, 'border', '1px solid rgba(255, 255, 255, 0.16)');
        setImp(card, 'display', 'flex');
        setImp(card, 'flex-direction', 'column');
        setImp(card, 'align-items', 'center');
        setImp(card, 'justify-content', 'center');
        setImp(card, 'gap', '1px');
        const img = card.querySelector('img');
        if (img) {
          setImp(img, 'width', imgSize + 'px');
          setImp(img, 'height', imgSize + 'px');
          setImp(img, 'border-radius', '5px');
          setImp(img, 'object-fit', 'cover');
        }
        card.querySelectorAll('b, span, div').forEach(t => {
          if (t.children.length === 0) {
            setImp(t, 'font-size', '9.5px');
            setImp(t, 'line-height', '1.05');
            setImp(t, 'white-space', 'nowrap');
          }
        });
      };

      // ① 상단 전투 덱 편성부: 4열 x 2행 = 8칸 고정 높이 박스 (카드가 빠져도 빈 슬롯으로 8칸 유지!)
      if (curGrid) {
        setImp(curGrid, 'flex', '0 0 auto');
        setImp(curGrid, 'display', 'grid');
        setImp(curGrid, 'grid-template-columns', 'repeat(4, 1fr)');
        setImp(curGrid, 'grid-template-rows', 'repeat(2, 54px)');
        setImp(curGrid, 'gap', '4px');
        setImp(curGrid, 'width', '100%');
        setImp(curGrid, 'height', '118px');
        setImp(curGrid, 'min-height', '118px');
        setImp(curGrid, 'max-height', '118px');
        setImp(curGrid, 'padding', '4px');
        setImp(curGrid, 'background', 'rgba(8, 15, 30, 0.72)');
        setImp(curGrid, 'border', '1.5px solid rgba(255, 213, 79, 0.4)');
        setImp(curGrid, 'border-radius', '12px');
        setImp(curGrid, 'overflow', 'hidden');

        // 실제 카드들과 우리가 만든 빈 슬롯 분리
        const realCards = Array.from(curGrid.children).filter(c => !c.classList.contains('ra-empty-slot'));
        const emptySlots = Array.from(curGrid.querySelectorAll('.ra-empty-slot'));

        realCards.forEach(c => styleCardItem(c, 28));

        // 부족한 슬롯(8 - 현재 카드 수)만큼 점선 빈 슬롯을 채워 8칸 고정 유지
        const needed = Math.max(0, 8 - realCards.length);
        if (emptySlots.length !== needed) {
          emptySlots.forEach(s => s.remove());
          for (let i = 0; i < needed; i++) {
            const slot = document.createElement('div');
            slot.className = 'ra-empty-slot';
            slot.textContent = '빈 슬롯';
            curGrid.appendChild(slot);
          }
        }
      }

      // ② 하단 보유 카드 풀부: 모바일 화면 높이에 맞춰 flex: 1 1 0% 가변 + 내부 스크롤 허용! (저장 버튼 잘림 원천 차단)
      if (poolGrid) {
        setImp(poolGrid, 'flex', '1 1 0%');
        setImp(poolGrid, 'display', 'grid');
        setImp(poolGrid, 'grid-template-columns', 'repeat(6, 1fr)');
        setImp(poolGrid, 'grid-auto-rows', '52px');
        setImp(poolGrid, 'gap', '4px');
        setImp(poolGrid, 'width', '100%');
        setImp(poolGrid, 'min-height', '80px');
        setImp(poolGrid, 'padding', '4px');
        setImp(poolGrid, 'background', 'rgba(8, 15, 30, 0.55)');
        setImp(poolGrid, 'border', '1px solid rgba(148, 163, 184, 0.25)');
        setImp(poolGrid, 'border-radius', '12px');
        setImp(poolGrid, 'overflow-y', 'auto');

        Array.from(poolGrid.children).forEach(c => styleCardItem(c, 26));
      }

      // (4) 하단 '[이 슬롯에 저장]' + '[닫기]' 버튼 행 상시 고정 노출 (flex-shrink: 0, 1:1 대칭 정렬)
      const realBtns = Array.from(deckEdit.querySelectorAll('button'));
      const saveBtn = realBtns.find(b => (b.textContent || '').includes('저장'));
      let closeBtn = realBtns.find(b => (b.textContent || '').includes('닫기') || b.id === 'deck-close' || b.id === 'btn-deck-close' || b.id === 'ra-deck-close-btn');

      if (saveBtn) {
        const actionRow = saveBtn.parentElement;
        if (actionRow && actionRow !== deckEdit) {
          setImp(actionRow, 'flex', '0 0 auto');
          setImp(actionRow, 'display', 'grid');
          setImp(actionRow, 'grid-template-columns', '1fr 1fr');
          setImp(actionRow, 'gap', '10px');
          setImp(actionRow, 'width', '100%');
          setImp(actionRow, 'margin-top', '4px');
          setImp(actionRow, 'padding', '2px 0 0');
          setImp(actionRow, 'border', 'none');
          setImp(actionRow, 'background', 'transparent');
          setImp(actionRow, 'z-index', '10');

          if (!closeBtn) {
            closeBtn = document.createElement('button');
            closeBtn.id = 'ra-deck-close-btn';
            closeBtn.textContent = '닫기';
            closeBtn.onclick = () => deckEdit.classList.add('hidden');
            actionRow.appendChild(closeBtn);
          }

          saveBtn.textContent = '이 슬롯에 저장';
          setImp(saveBtn, 'display', 'inline-flex');
          setImp(saveBtn, 'align-items', 'center');
          setImp(saveBtn, 'justify-content', 'center');
          setImp(saveBtn, 'width', '100%');
          setImp(saveBtn, 'height', '44px');
          setImp(saveBtn, 'margin', '0');
          setImp(saveBtn, 'border-radius', '12px');
          setImp(saveBtn, 'background', 'linear-gradient(180deg, #ffca28 0%, #ff8f00 100%)');
          setImp(saveBtn, 'color', '#120a00');
          setImp(saveBtn, 'border', '1.5px solid #ffe082');
          setImp(saveBtn, 'font-size', '14.5px');
          setImp(saveBtn, 'font-weight', '900');
          setImp(saveBtn, 'text-shadow', 'none');
          setImp(saveBtn, '-webkit-text-stroke', '0px transparent');
          setImp(saveBtn, 'letter-spacing', '-0.2px');
          setImp(saveBtn, 'box-shadow', '0 4px 12px rgba(255, 160, 0, 0.35)');

          if (!saveBtn.__autoCloseBound) {
            saveBtn.__autoCloseBound = true;
            saveBtn.addEventListener('click', () => {
              const count = curGrid ? curGrid.querySelectorAll(':not(.ra-empty-slot)').length : 8;
              if (count === 8) {
                setTimeout(() => deckEdit.classList.add('hidden'), 120);
              }
            });
          }

          if (closeBtn) {
            closeBtn.textContent = '닫기';
            setImp(closeBtn, 'display', 'inline-flex');
            setImp(closeBtn, 'align-items', 'center');
            setImp(closeBtn, 'justify-content', 'center');
            setImp(closeBtn, 'width', '100%');
            setImp(closeBtn, 'height', '44px');
            setImp(closeBtn, 'margin', '0');
            setImp(closeBtn, 'border-radius', '12px');
            setImp(closeBtn, 'background', 'linear-gradient(180deg, #2b3f66 0%, #18243d 100%)');
            setImp(closeBtn, 'color', '#f0f6ff');
            setImp(closeBtn, 'border', '1.5px solid #4f6d9e');
            setImp(closeBtn, 'font-size', '14.5px');
            setImp(closeBtn, 'font-weight', '800');
            setImp(closeBtn, 'text-shadow', 'none');
            setImp(closeBtn, '-webkit-text-stroke', '0px transparent');
            setImp(closeBtn, 'letter-spacing', '-0.2px');
            if (!closeBtn.__closeBound) {
              closeBtn.__closeBound = true;
              closeBtn.addEventListener('click', () => deckEdit.classList.add('hidden'));
            }
          }
        }
      }
    }

    // 5. 연구소 / 프로필 / 명예의 전당 / 유물 / 게임방법 버튼 정리
    ['overlay-skill', 'overlay-profile', 'overlay-hof', 'overlay-relic', 'overlay-info'].forEach(id => {
      const modal = document.getElementById(id);
      if (!modal) return;
      if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
      }
      modal.querySelectorAll('button').forEach(b => {
        if (b.closest('.sk-item')) return;
        const txt = (b.textContent || '').trim();
        setImp(b, 'height', '40px');
        setImp(b, 'min-height', '40px');
        setImp(b, 'border-radius', '11px');
        setImp(b, 'font-size', '13.5px');
        setImp(b, 'font-weight', '800');
        setImp(b, 'padding', '0 14px');
        if (txt.includes('저장') || txt === '생성' || txt === '이름 변경') {
          setImp(b, 'background', 'linear-gradient(180deg, #ffca28 0%, #ff8f00 100%)');
          setImp(b, 'color', '#1f1100');
          setImp(b, 'border', '1.5px solid #ffe082');
        } else if (txt.includes('리셋') || txt.includes('초기화') || txt === '삭제') {
          setImp(b, 'background', 'linear-gradient(180deg, #5c1d2e 0%, #38101b 100%)');
          setImp(b, 'color', '#ffb4c4');
          setImp(b, 'border', '1.5px solid #e11d48');
        } else if (txt === '닫기' || txt === '복원' || txt === '선택' || txt === '사용 중') {
          setImp(b, 'background', 'linear-gradient(180deg, #243556 0%, #152036 100%)');
          setImp(b, 'color', '#ffd54f');
          setImp(b, 'border', '1.5px solid rgba(247, 197, 49, 0.5)');
        }
      });
    });

    // 6. 전투 화면 상단 타이머/사운드 노출 유지
    const battleScreen = document.getElementById('screen-battle');
    if (battleScreen && !battleScreen.classList.contains('hidden')) {
      const gutL = document.getElementById('gutL');
      const gutR = document.getElementById('gutR');
      if (gutL) {
        gutL.classList.add('on');
        setImp(gutL, 'display', 'flex');
      }
      if (gutR) {
        gutR.classList.add('on');
        setImp(gutR, 'display', 'flex');
      }
    }
  }

  function runAll() {
    injectStyle();
    applyInlineOverrides();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAll);
  } else {
    runAll();
  }

  window.addEventListener('load', () => {
    runAll();
    window.dispatchEvent(new Event('resize'));
  });

  document.addEventListener('click', () => {
    setTimeout(runAll, 15);
    setTimeout(runAll, 100);
  });

  setInterval(runAll, 250);
})();
