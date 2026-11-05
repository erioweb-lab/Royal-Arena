/* ==========================================================================
   ui-patch.js — 로얄 아레나 전 화면 시인성·타이포그래피·정렬 마스터 패치 (최종 완성본)
   - 글자 번짐/뭉개짐(Black Han Sans 합성 볼드 & text-shadow) 100% 제거 및 고딕(700) 통일
   - 메인 / 덱편성 / 명예의전당 / 프로필 / 연구소 / 유물 / 전투 / 엔딩 전 화면 무스크롤 대칭 정렬
   ========================================================================== */
(function () {
  const PATCH_STYLE_ID = 'ra-final-override';

  function injectStyle() {
    if (!document.head) return;

    // 폰트 뭉개짐과 레이아웃 깨짐을 유발하는 구버전 내장 스타일 태그 일괄 제거
    [
      'ui-v108', 'ui-v133', 'ui-v134', 'ui-v135',
      'ui-v151', 'ui-v156', 'rf-style', 'ui-v179',
      'ui-v183', 'ui-v185', 'ui-v186', 'sk-style', 'prf-style'
    ].forEach(id => {
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
      /* ==========================================================================
         0. 전역 타이포그래피 & 스크롤바 박멸 (번짐 없는 선명한 폰트 통일)
         ========================================================================== */
      *, *::before, *::after {
        box-sizing: border-box !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
        -webkit-text-stroke: 0px transparent !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
        text-rendering: optimizeLegibility !important;
      }

      *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }

      html, body, #app,
      #screen-title, #screen-title *,
      #screen-battle, #screen-battle *,
      #overlay-result, #overlay-result *,
      #deck-edit, #deck-edit *,
      #overlay-hof, #overlay-hof *,
      #overlay-skill, #overlay-skill *,
      #overlay-profile, #overlay-profile *,
      #overlay-relic, #overlay-relic *,
      #overlay-info, #overlay-info *,
      #dpsw, #dpsw * {
        font-family: 'Pretendard Variable', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif !important;
        text-shadow: none !important;
        letter-spacing: -0.2px !important;
      }

      .hidden {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }

      /* ==========================================================================
         1. 메인 타이틀 화면 (#screen-title) — 좌우 100% 정렬 & 선명한 텍스트
         ========================================================================== */
      #screen-title .t-panel,
      #screen-title .t-codex,
      #screen-title .cards-sec,
      #screen-title #codex {
        display: none !important;
      }

      #screen-title:not(.hidden) {
        width: 100% !important;
        max-width: 420px !important;
        height: calc(100dvh - 16px) !important;
        max-height: calc(100dvh - 16px) !important;
        margin: 8px auto !important;
        padding: 16px 16px 14px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        align-items: stretch !important;
        gap: 8px !important;
        overflow: hidden !important;
        background: radial-gradient(circle at 50% 10%, #192b52 0%, #0d172e 58%, #080f1e 100%) !important;
        border: 1.5px solid rgba(255, 202, 40, 0.55) !important;
        border-radius: 22px !important;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85) !important;
      }

      #screen-title .t-hero {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 4px !important;
        margin: 0 !important;
      }

      #screen-title h1, #screen-title .t-logo {
        font-size: 25px !important;
        font-weight: 800 !important;
        letter-spacing: 0.5px !important;
        color: #ffd54f !important;
        margin: 0 !important;
        text-align: center !important;
      }

      /* 테마 선택 3열 */
      #screen-title .theme-row {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 7px !important;
        width: 100% !important;
        padding: 5px !important;
        background: rgba(8, 14, 28, 0.75) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 14px !important;
        margin: 0 !important;
      }

      #screen-title .theme-row .t-btn,
      #screen-title .theme-row button {
        height: 38px !important;
        border-radius: 10px !important;
        font-size: 12.5px !important;
        font-weight: 700 !important;
        padding: 0 6px !important;
        background: rgba(20, 32, 58, 0.7) !important;
        border: 1px solid rgba(255, 255, 255, 0.14) !important;
        color: #9ab0d6 !important;
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
        background: linear-gradient(180deg, #ffd54f 0%, #ffa000 100%) !important;
        border: 1.5px solid #fff8e1 !important;
        color: #1a0e00 !important;
        font-weight: 800 !important;
        box-shadow: 0 3px 10px rgba(255, 160, 0, 0.4) !important;
      }

      /* 덱 1 / 덱 2 슬롯 */
      #screen-title #deck-pick {
        display: flex !important;
        flex-direction: column !important;
        gap: 7px !important;
        width: 100% !important;
        margin: 0 !important;
      }

      /* 하단 6개 메뉴 버튼 2열 그리드 */
      #screen-title #title-actions {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 7px !important;
        width: 100% !important;
        margin: 0 !important;
      }

      #screen-title .t-links {
        width: 100% !important;
        margin: 0 !important;
      }

      /* ==========================================================================
         2. 전투 화면 (#screen-battle) — 상태창/버튼 전장 내 정렬 & 원본 비율
         ========================================================================== */
      #screen-battle:not(.hidden) {
        width: 100% !important;
        max-width: 440px !important;
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
        top: calc(8px + env(safe-area-inset-top, 0px)) !important;
        left: 12px !important;
        right: 12px !important;
        width: auto !important;
        height: 36px !important;
        padding: 0 !important;
        margin: 0 !important;
        background: transparent !important;
        border: none !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        pointer-events: none !important;
        z-index: 50 !important;
      }

      #screen-battle #topbar > * {
        pointer-events: auto !important;
      }

      /* 좌상단 타이머 & 우상단 사운드 버튼 대칭 정렬 */
      #screen-battle #timer,
      #gutL {
        position: absolute !important;
        top: 8px !important;
        left: 12px !important;
        height: 34px !important;
        padding: 0 12px !important;
        border-radius: 999px !important;
        background: rgba(10, 18, 34, 0.88) !important;
        border: 1.5px solid rgba(255, 202, 40, 0.65) !important;
        color: #ffd54f !important;
        font-size: 15px !important;
        font-weight: 800 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 55 !important;
      }

      #screen-battle #btn-sound,
      #gutR {
        position: absolute !important;
        top: 8px !important;
        right: 12px !important;
        width: 34px !important;
        height: 34px !important;
        border-radius: 50% !important;
        background: rgba(10, 18, 34, 0.88) !important;
        border: 1.5px solid rgba(255, 202, 40, 0.65) !important;
        font-size: 15px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 55 !important;
      }

      /* 우측 DPS 상태창(#dpsw): 전장 우측 밖으로 튀어나가지 않도록 전장 안쪽 우상단에 정렬 */
      #dpsw:not(.hidden) {
        position: fixed !important;
        top: calc(50px + env(safe-area-inset-top, 0px)) !important;
        right: max(12px, calc(50vw - 208px)) !important;
        width: 112px !important;
        max-width: 112px !important;
        z-index: 48 !important;
      }

      #dpsw .dw-t {
        height: 26px !important;
        padding: 0 8px !important;
        border-radius: 8px !important;
        font-size: 11px !important;
        font-weight: 700 !important;
        background: rgba(10, 18, 34, 0.88) !important;
        border: 1px solid rgba(255, 202, 40, 0.6) !important;
        color: #ffd54f !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      #dpsw .dw-b {
        margin-top: 3px !important;
        padding: 4px 6px !important;
        border-radius: 8px !important;
        background: rgba(10, 18, 34, 0.88) !important;
        border: 1px solid rgba(255, 202, 40, 0.35) !important;
        font-size: 10px !important;
      }

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
      }

      /* 좌하단 킹샷 & 우하단 수리 버튼 전장 안쪽 대칭 정렬 */
      #ks-btn, #btn-kingshot, .kingshot-btn {
        position: absolute !important;
        bottom: 8px !important;
        left: 14px !important;
        height: 32px !important;
        padding: 0 11px !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        border-radius: 10px !important;
        background: rgba(12, 22, 42, 0.88) !important;
        border: 1.5px solid rgba(255, 202, 40, 0.55) !important;
        color: #ffd54f !important;
        z-index: 45 !important;
      }

      #repair-btn, #btn-repair, .repair-btn {
        position: absolute !important;
        bottom: 8px !important;
        right: 14px !important;
        height: 32px !important;
        padding: 0 11px !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        border-radius: 10px !important;
        background: rgba(12, 22, 42, 0.88) !important;
        border: 1.5px solid rgba(255, 202, 40, 0.55) !important;
        color: #ffd54f !important;
        z-index: 45 !important;
      }

      /* 하단 카드 & 엘릭서 HUD */
      #hud {
        flex: 0 0 auto !important;
        width: 100% !important;
        padding: 6px 10px calc(5px + env(safe-area-inset-bottom, 0px)) !important;
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
        font-weight: 700 !important;
        line-height: 1.1 !important;
        white-space: nowrap !important;
      }

      #cards .card .cost {
        width: 19px !important;
        height: 19px !important;
        font-size: 10.5px !important;
        font-weight: 800 !important;
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
        font-weight: 800 !important;
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
         3. 🃏 덱 편성 (#deck-edit) — 고정 영역 분할 & 무스크롤 정렬
         ========================================================================== */
      #deck-edit:not(.hidden) {
        position: fixed !important;
        inset: 0 !important;
        width: min(420px, 95vw) !important;
        height: calc(100dvh - 16px) !important;
        max-width: 420px !important;
        max-height: calc(100dvh - 16px) !important;
        margin: auto !important;
        padding: 12px 14px !important;
        border-radius: 20px !important;
        border: 1.5px solid rgba(255, 202, 40, 0.65) !important;
        background: linear-gradient(180deg, #152544 0%, #0b1426 100%) !important;
        box-shadow: 0 18px 44px rgba(0, 0, 0, 0.92), 0 0 0 100vmax rgba(4, 9, 18, 0.85) !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        align-items: stretch !important;
        gap: 5px !important;
        z-index: 99990 !important;
        overflow: hidden !important;
      }

      .ra-empty-slot {
        width: 100% !important;
        height: 52px !important;
        border-radius: 8px !important;
        border: 1.5px dashed rgba(255, 213, 79, 0.28) !important;
        background: rgba(10, 18, 34, 0.45) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: rgba(255, 213, 79, 0.4) !important;
        font-size: 10px !important;
        font-weight: 700 !important;
      }

      /* ==========================================================================
         4. 모든 오버레이 모달 공통 래퍼 & 카드 프레임
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
        background: rgba(4, 9, 18, 0.86) !important;
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
        width: min(400px, 94vw) !important;
        max-width: 400px !important;
        max-height: calc(100dvh - 20px) !important;
        margin: 0 auto !important;
        padding: 16px 18px !important;
        border-radius: 20px !important;
        border: 1.5px solid rgba(255, 202, 40, 0.65) !important;
        background: linear-gradient(180deg, #162645 0%, #0b1426 100%) !important;
        box-shadow: 0 18px 44px rgba(0, 0, 0, 0.9) !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 8px !important;
        overflow: hidden !important;
      }

      /* ==========================================================================
         5. 🏆 명예의 전당 (#overlay-hof) — 단상 압축 및 하단 [닫기] 버튼 온전 노출
         ========================================================================== */
      #overlay-hof > .hof-card {
        max-width: 380px !important;
        padding: 16px 16px 14px !important;
        gap: 6px !important;
      }

      #overlay-hof h2, #overlay-hof .hof-title {
        font-size: 20px !important;
        font-weight: 800 !important;
        color: #ffd54f !important;
        margin: 0 !important;
      }

      #overlay-hof .hof-sub, #overlay-hof p {
        font-size: 11.5px !important;
        color: #9ab0d6 !important;
        margin: 0 !important;
      }

      #overlay-hof .hof-podium {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        align-items: end !important;
        gap: 8px !important;
        width: 100% !important;
        margin: 2px 0 !important;
      }

      #overlay-hof .hof-podium > * {
        width: 100% !important;
        padding: 8px 4px !important;
        border-radius: 12px !important;
        min-height: 0 !important;
      }

      /* 1위/2위/3위 단상 높이를 컴팩트하게 줄여 하단 닫기 버튼 공간 확보 */
      #overlay-hof .hof-podium > *:nth-child(1) { height: 102px !important; }
      #overlay-hof .hof-podium > *:nth-child(2) { height: 120px !important; }
      #overlay-hof .hof-podium > *:nth-child(3) { height: 92px !important; }

      #overlay-hof .hof-podium * {
        white-space: nowrap !important;
      }

      #overlay-hof .hof-rows, #overlay-hof #hof-list {
        width: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 4px !important;
        margin: 2px 0 !important;
      }

      /* ==========================================================================
         6. 🎖️ 지휘관 프로필 (#overlay-profile) — 입력창·버튼 그리드 대칭 정렬
         ========================================================================== */
      #overlay-profile > .rpanel {
        width: min(390px, 94vw) !important;
        max-width: 390px !important;
        padding: 16px 16px 14px !important;
        gap: 7px !important;
        align-items: stretch !important;
      }

      #overlay-profile h2 {
        font-size: 20px !important;
        font-weight: 800 !important;
        color: #ffd54f !important;
        text-align: center !important;
        margin: 0 !important;
      }

      #overlay-profile .rsub {
        font-size: 11px !important;
        color: #9ab0d6 !important;
        text-align: center !important;
        margin: 0 !important;
        line-height: 1.3 !important;
      }

      #overlay-profile #prf-stats {
        width: 100% !important;
        padding: 8px 10px !important;
        border-radius: 10px !important;
        background: rgba(9, 16, 32, 0.8) !important;
        border: 1px solid rgba(255, 213, 79, 0.3) !important;
        font-size: 12.5px !important;
        line-height: 1.45 !important;
        text-align: center !important;
        color: #e2e8f0 !important;
        margin: 0 !important;
      }

      #overlay-profile #prf-stats b {
        color: #ffd54f !important;
        font-weight: 800 !important;
      }

      /* 입력창 행: 좌측 입력창(1fr) + 우측 버튼(90px 고정) 대칭 정렬 */
      #overlay-profile .prf-row {
        width: 100% !important;
        display: grid !important;
        grid-template-columns: 1fr 90px !important;
        gap: 8px !important;
        margin: 0 !important;
        align-items: center !important;
      }

      /* 진행도 리셋 + 복원 행은 1:1 2열 대칭 */
      #overlay-profile .prf-row.ra-two-col {
        grid-template-columns: 1fr 1fr !important;
      }

      #overlay-profile .prf-row input {
        width: 100% !important;
        height: 38px !important;
        padding: 0 12px !important;
        border-radius: 10px !important;
        background: rgba(8, 14, 28, 0.95) !important;
        border: 1.5px solid #3b5280 !important;
        color: #ffffff !important;
        font-size: 13px !important;
      }

      #overlay-profile #prf-list {
        width: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 5px !important;
        max-height: 145px !important;
        margin: 0 !important;
      }

      #overlay-profile .prf-item {
        width: 100% !important;
        height: 40px !important;
        padding: 0 10px 0 12px !important;
        border-radius: 10px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        background: rgba(15, 26, 48, 0.9) !important;
        border: 1px solid rgba(255, 255, 255, 0.14) !important;
        font-size: 13.5px !important;
        font-weight: 700 !important;
      }

      #overlay-profile .prf-item.on {
        border: 1.5px solid #ffd54f !important;
        background: linear-gradient(90deg, rgba(66, 50, 18, 0.75), rgba(20, 34, 62, 0.95)) !important;
      }

      #overlay-profile .prf-item > span:last-child {
        display: inline-flex !important;
        gap: 6px !important;
      }

      /* ==========================================================================
         7. 🎓 전술 연구소 (#overlay-skill) — 3열 그리드 & 하단 2열 버튼
         ========================================================================== */
      #overlay-skill > .rpanel {
        width: min(430px, 96vw) !important;
        max-width: 430px !important;
        padding: 14px 12px !important;
        gap: 6px !important;
      }

      #overlay-skill h2 {
        font-size: 20px !important;
        font-weight: 800 !important;
        color: #ffd54f !important;
        margin: 0 !important;
      }

      #overlay-skill #sk-grid {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 6px !important;
        width: 100% !important;
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
        background: rgba(11, 19, 38, 0.9) !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        position: relative !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
      }

      #overlay-skill .sk-item b { font-size: 11px !important; font-weight: 800 !important; white-space: nowrap !important; }
      #overlay-skill .sk-item small { font-size: 9.5px !important; line-height: 1.15 !important; color: #9ab0d6 !important; }
      #overlay-skill .sk-item .sk-lv {
        position: absolute !important;
        left: 6px !important;
        bottom: 5px !important;
        font-size: 10px !important;
        font-weight: 800 !important;
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
        font-weight: 800 !important;
      }
      #overlay-skill .sk-item button:first-of-type { right: 4px !important; }
      #overlay-skill .sk-item button:last-of-type { right: 28px !important; }

      /* ==========================================================================
         8. 엔딩 결과 화면 (#overlay-result) — 요약 2단 분리 & 또렷한 버튼 폰트
         ========================================================================== */
      #overlay-result > *:not(.r-box) {
        display: none !important;
      }

      #overlay-result > .r-box {
        width: min(360px, 92vw) !important;
        max-width: 360px !important;
        padding: 16px 18px !important;
        gap: 6px !important;
      }

      #overlay-result #r-art {
        width: 58px !important;
        height: 58px !important;
        margin: 0 auto !important;
        border-radius: 12px !important;
      }

      #overlay-result #rf-badge,
      #overlay-result #r-title,
      #overlay-result .r-title {
        font-size: 17px !important;
        font-weight: 800 !important;
        height: 28px !important;
        line-height: 24px !important;
        padding: 2px 22px !important;
        border-radius: 999px !important;
      }

      /* 3:0 왕관 / 1348 총점 / +30 트로피 2단 카드 분리 (글자 붙음 완벽 해결) */
      #overlay-result .rsnap,
      #overlay-result #rf-snap {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 8px !important;
        width: 100% !important;
        margin: 2px 0 !important;
      }

      #overlay-result .rsnap > div,
      #overlay-result #rf-snap > div {
        padding: 6px 4px !important;
        border-radius: 10px !important;
        background: rgba(10, 18, 36, 0.78) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 2px !important;
        min-width: 0 !important;
      }

      #overlay-result .rsnap b,
      #overlay-result #rf-snap b {
        display: block !important;
        font-size: 16px !important;
        font-weight: 800 !important;
        color: #ffd54f !important;
        line-height: 1.1 !important;
        white-space: nowrap !important;
      }

      #overlay-result .rsnap span,
      #overlay-result #rf-snap span {
        display: block !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        color: #9ab0d6 !important;
        line-height: 1.1 !important;
        white-space: nowrap !important;
      }

      #overlay-result .r-tabs {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 8px !important;
        width: 100% !important;
        margin: 2px 0 !important;
      }

      #overlay-result .rtab {
        width: 100% !important;
        height: 32px !important;
        font-size: 12.5px !important;
        font-weight: 700 !important;
        border-radius: 10px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 4px !important;
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
        padding: 1px 4px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
      }

      #overlay-result .rrow b {
        font-weight: 800 !important;
      }

      #overlay-result #r-actions,
      #overlay-result .rbrow {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 10px !important;
        width: 100% !important;
        margin-top: 4px !important;
      }

      /* 다시 배틀 / 메인으로 버튼: 번짐 없는 선명한 폰트(font-weight: 700) */
      #overlay-result #btn-again,
      #overlay-result #btn-home,
      #overlay-result #btn-main {
        width: 100% !important;
        height: 42px !important;
        margin: 0 !important;
        padding: 0 10px !important;
        border-radius: 12px !important;
        font-size: 14.5px !important;
        font-weight: 700 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
      }

      #overlay-result #btn-again {
        background: linear-gradient(180deg, #ffca28 0%, #ff8f00 100%) !important;
        color: #1a0e00 !important;
        border: 1.5px solid #ffe082 !important;
      }

      #overlay-result #btn-home,
      #overlay-result #btn-main {
        background: linear-gradient(180deg, #2b3f66 0%, #18243d 100%) !important;
        color: #ffffff !important;
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

    const cleanFont = (el, weight = '700') => {
      if (!el) return;
      setImp(el, 'font-family', "'Pretendard Variable', 'Noto Sans KR', sans-serif");
      setImp(el, 'font-weight', weight);
      setImp(el, 'text-shadow', 'none');
      setImp(el, '-webkit-text-stroke', '0px transparent');
      setImp(el, 'letter-spacing', '-0.2px');
    };

    // 1. 메인 화면 '배틀 시작' 버튼 (번짐 없는 선명한 텍스트)
    const startBtn = document.getElementById('btn-start');
    if (startBtn) {
      cleanFont(startBtn, '800');
      setImp(startBtn, 'background', 'linear-gradient(180deg, #ffca28 0%, #ff8f00 100%)');
      setImp(startBtn, 'border', '1.5px solid #ffe082');
      setImp(startBtn, 'color', '#1a0e00');
      setImp(startBtn, 'font-size', '18px');
      setImp(startBtn, 'height', '48px');
      setImp(startBtn, 'border-radius', '14px');
      setImp(startBtn, 'box-shadow', '0 4px 14px rgba(255, 143, 0, 0.4)');
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
          setImp(card, 'box-shadow', '0 0 14px rgba(255, 213, 79, 0.3)');
          setImp(card, 'opacity', '1');
        } else {
          setImp(card, 'background', 'rgba(13, 22, 42, 0.72)');
          setImp(card, 'border', '1px solid rgba(148, 163, 184, 0.25)');
          setImp(card, 'box-shadow', 'none');
          setImp(card, 'opacity', '0.68');
        }
        card.querySelectorAll('*').forEach(ch => cleanFont(ch, '700'));
      });
    }

    // 3. 메인 하단 메뉴 버튼 컬러 & 정렬
    document.querySelectorAll('#title-actions > *, .t-links button, #btn-info').forEach(btn => {
      const t = (btn.textContent || '').trim();
      cleanFont(btn, '700');
      setImp(btn, 'width', '100%');
      setImp(btn, 'height', '42px');
      setImp(btn, 'min-height', '42px');
      setImp(btn, 'margin', '0');
      setImp(btn, 'border-radius', '12px');
      setImp(btn, 'font-size', '13.5px');
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

    // 4. 🃏 덱 편성 모달(#deck-edit) 고정 그리드 & 하단 1:1 버튼
    const deckEdit = document.getElementById('deck-edit');
    if (deckEdit) {
      if (deckEdit.parentElement !== document.body) document.body.appendChild(deckEdit);
      setImp(deckEdit, 'padding-bottom', '80px');

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
            setImp(el, 'font-weight', '800');
          }
        }
      });

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
        setImp(card, 'height', '100%');
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
        }
        card.querySelectorAll('b, span, div').forEach(t => {
          if (t.children.length === 0) {
            cleanFont(t, '700');
            setImp(t, 'font-size', '9px');
            setImp(t, 'line-height', '1.15');
            setImp(t, 'letter-spacing', '-0.2px');
            setImp(t, 'white-space', 'nowrap');
            setImp(t, 'overflow', 'hidden');
            setImp(t, 'text-overflow', 'ellipsis');
          }
        });
      };

      if (curGrid) {
        setImp(curGrid, 'flex', '0 0 auto');
        setImp(curGrid, 'display', 'grid');
        setImp(curGrid, 'grid-template-columns', 'repeat(4, 1fr)');
        setImp(curGrid, 'grid-template-rows', 'repeat(2, 54px)');
        setImp(curGrid, 'gap', '5px');
        setImp(curGrid, 'width', '100%');
        setImp(curGrid, 'height', '120px');
        setImp(curGrid, 'min-height', '120px');
        setImp(curGrid, 'max-height', '120px');
        setImp(curGrid, 'padding', '5px');
        setImp(curGrid, 'background', 'rgba(8, 15, 30, 0.72)');
        setImp(curGrid, 'border', '1.5px solid rgba(255, 213, 79, 0.4)');
        setImp(curGrid, 'border-radius', '12px');

        const realCards = Array.from(curGrid.children).filter(c => !c.classList.contains('ra-empty-slot'));
        const emptySlots = Array.from(curGrid.querySelectorAll('.ra-empty-slot'));
        realCards.forEach(c => styleCardItem(c, 28));

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

      if (poolGrid) {
        setImp(poolGrid, 'flex', '1 1 0%');
        setImp(poolGrid, 'display', 'grid');
        setImp(poolGrid, 'grid-template-columns', 'repeat(6, 1fr)');
        setImp(poolGrid, 'grid-template-rows', 'auto');
        setImp(poolGrid, 'gap', '4px');
        setImp(poolGrid, 'width', '100%');
        setImp(poolGrid, 'min-height', '0px');
        setImp(poolGrid, 'max-height', 'none');
        setImp(poolGrid, 'padding', '5px');
        setImp(poolGrid, 'background', 'rgba(8, 15, 30, 0.55)');
        setImp(poolGrid, 'overflow-y', 'auto');
        setImp(poolGrid, 'border', '1px solid rgba(148, 163, 184, 0.25)');
        setImp(poolGrid, 'border-radius', '12px');
        setImp(poolGrid, 'margin-bottom', '10px');
        Array.from(poolGrid.children).forEach(c => styleCardItem(c, 24));
      }

      const realBtns = Array.from(deckEdit.querySelectorAll('button'));
      const saveBtn = realBtns.find(b => (b.textContent || '').includes('저장'));
      let closeBtn = realBtns.find(b => (b.textContent || '').includes('닫기') || b.id === 'deck-close' || b.id === 'ra-deck-close-btn');

      if (saveBtn && saveBtn.parentElement && saveBtn.parentElement !== deckEdit) {
        const actionRow = saveBtn.parentElement;
        setImp(actionRow, 'flex', '0 0 auto');
        setImp(actionRow, 'display', 'grid');
        setImp(actionRow, 'grid-template-columns', 'repeat(3, 1fr)');
        setImp(actionRow, 'gap', '10px');
        setImp(actionRow, 'width', '100%');

        if (!closeBtn) {
          closeBtn = document.createElement('button');
          closeBtn.id = 'ra-deck-close-btn';
          closeBtn.textContent = '닫기';
          actionRow.appendChild(closeBtn);
        }

        cleanFont(saveBtn, '900');
        setImp(saveBtn, 'width', '100%');
        setImp(saveBtn, 'height', '42px');
        setImp(saveBtn, 'border-radius', '12px');
        setImp(saveBtn, 'background', 'linear-gradient(180deg, #ffca28 0%, #ff8f00 100%)');
        setImp(saveBtn, 'color', '#000000');
        setImp(saveBtn, 'border', '1.5px solid #ffe082');
        setImp(saveBtn, 'font-size', '16.5px');
        setImp(saveBtn, 'text-shadow', '0 1px 1px rgba(255,255,255,.7)');
        setImp(saveBtn, 'letter-spacing', '-0.2px');

        if (!saveBtn.__autoCloseBound) {
          saveBtn.__autoCloseBound = true;
          saveBtn.addEventListener('click', () => {
            const count = curGrid ? curGrid.querySelectorAll(':not(.ra-empty-slot)').length : 8;
            if (count === 8) setTimeout(() => deckEdit.classList.add('hidden'), 120);
          });
        }

        if (closeBtn) {
          cleanFont(closeBtn, '700');
          setImp(closeBtn, 'width', '100%');
          setImp(closeBtn, 'height', '42px');
          setImp(closeBtn, 'border-radius', '12px');
          setImp(closeBtn, 'background', 'linear-gradient(180deg, #2b3f66 0%, #18243d 100%)');
          setImp(closeBtn, 'color', '#ffffff');
          setImp(closeBtn, 'border', '1.5px solid #4f6d9e');
          setImp(closeBtn, 'font-size', '14px');
          if (!closeBtn.__closeBound) {
            closeBtn.__closeBound = true;
            closeBtn.addEventListener('click', () => deckEdit.classList.add('hidden'));
          }
        }
      }
    }

    // 5. 프로필 / 명예의 전당 / 연구소 / 유물 / 게임방법 버튼 대칭 정렬
    ['overlay-skill', 'overlay-profile', 'overlay-hof', 'overlay-relic', 'overlay-info'].forEach(id => {
      const modal = document.getElementById(id);
      if (!modal) return;
      if (modal.parentElement !== document.body) document.body.appendChild(modal);

      // 프로필 모달의 '진행도 리셋 + 복원' 행을 1:1 2열로 지정
      if (id === 'overlay-profile') {
        const rstBtn = document.getElementById('btn-profile-reset');
        if (rstBtn && rstBtn.parentElement && rstBtn.parentElement.classList.contains('prf-row')) {
          rstBtn.parentElement.classList.add('ra-two-col');
        }
        const closePrf = document.getElementById('btn-prf-close');
        if (closePrf) setImp(closePrf, 'width', '100%');
      }

      // 연구소 모달의 '전체 초기화' + '닫기' 버튼을 가로 1:1 2열 그리드로 묶기
      if (id === 'overlay-skill') {
        const skReset = document.getElementById('btn-skill-reset');
        const skClose = document.getElementById('btn-skill-close');
        if (skReset && skClose && skReset.parentElement === skClose.parentElement && skReset.parentElement.id !== 'sk-act-row') {
          const row = document.createElement('div');
          row.id = 'sk-act-row';
          row.style.cssText = 'display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important;width:100%!important;margin-top:4px!important;';
          skReset.parentNode.insertBefore(row, skReset);
          row.appendChild(skReset);
          row.appendChild(skClose);
        }
      }

      // 명예의 전당 닫기 버튼 100% 폭 고정
      if (id === 'overlay-hof') {
        const hofClose = modal.querySelector('button');
        if (hofClose) setImp(hofClose, 'width', '100%');
      }

      modal.querySelectorAll('button').forEach(b => {
        cleanFont(b, '700');
        if (b.closest('.sk-item')) return;
        const txt = (b.textContent || '').trim();
        if (b.closest('.prf-item')) {
          setImp(b, 'height', '28px');
          setImp(b, 'padding', '0 10px');
          setImp(b, 'border-radius', '8px');
          setImp(b, 'font-size', '12px');
        } else {
          setImp(b, 'height', '40px');
          setImp(b, 'min-height', '40px');
          setImp(b, 'width', '100%');
          setImp(b, 'margin', '0');
          setImp(b, 'border-radius', '11px');
          setImp(b, 'font-size', '13.5px');
        }

        if (txt.includes('저장') || txt === '생성' || txt === '이름 변경') {
          setImp(b, 'background', 'linear-gradient(180deg, #ffca28 0%, #ff8f00 100%)');
          setImp(b, 'color', '#1a0e00');
          setImp(b, 'border', '1.5px solid #ffe082');
          setImp(b, 'font-weight', '800');
        } else if (txt.includes('리셋') || txt.includes('초기화') || txt === '삭제') {
          setImp(b, 'background', 'linear-gradient(180deg, #5c1d2e 0%, #38101b 100%)');
          setImp(b, 'color', '#ffc2d1');
          setImp(b, 'border', '1.5px solid #e11d48');
        } else {
          setImp(b, 'background', 'linear-gradient(180deg, #2b3f66 0%, #18243d 100%)');
          setImp(b, 'color', '#ffd54f');
          setImp(b, 'border', '1.5px solid rgba(247, 197, 49, 0.5)');
        }
      });
    });

    // 6. 엔딩 모달 버튼 글자 번짐 제거
    const ovRes = document.getElementById('overlay-result');
    if (ovRes) {
      ovRes.querySelectorAll('button').forEach(b => cleanFont(b, '700'));
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
