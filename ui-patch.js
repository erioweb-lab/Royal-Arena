/* ==========================================================================
   ui-patch.js — 로얄 아레나 통합 UI/UX & 프로필 수복 & 자이언트 유닛 공격 패치
   1) [신규] 자이언트(giant)가 건물뿐만 아니라 일반 적군 유닛도 공격하도록 타겟팅 제한 해제
   2) 지휘관 프로필: AI 스튜디오 confirm() 차단 우회 + [삭제]/[진행도 리셋]/[복원] 100% 작동 보장
   3) 전 화면 폰트 선명화(Pretendard/Noto Sans KR, 번짐/합성볼드 제거) 및 스크롤바 제거
   4) 메인 로비 · 덱 편성(4x2 전투덱 + 6x3 보유풀) · 명예의 전당 · 연구소 · 전투 · 엔딩 완벽 정렬
   ========================================================================== */
(function () {
  const PATCH_STYLE_ID = 'ra-final-override';

  // AI 스튜디오 Preview iframe에서 window.confirm 차단 우회
  try {
    window.confirm = function () { return true; };
  } catch (e) {}

  /* ==========================================================================
     [핵심 추가] 자이언트(giant) 유닛 공격 가능 패치
     - CARDS.giant 원본 및 인게임 소환된 유닛 클론(u.c)의 건물 전용 제한을 모두 해제하여
       기사(knight)와 동일하게 적군 유닛 + 건물을 모두 공격하도록 변경
     ========================================================================== */
  function unlockGiantTarget(obj, knightRef) {
    if (!obj || typeof obj !== 'object') return;

    // 1) 기사(knight)의 타겟팅 속성(target / tgt / atkTarget 등)과 동일하게 동기화
    const targetKeys = ['target', 'tgt', 'targets', 'atkTarget', 'prefer', ' targetType'];
    targetKeys.forEach(k => {
      if (k in obj) {
        if (knightRef && (k in knightRef)) {
          obj[k] = knightRef[k];
        } else if (typeof obj[k] === 'string') {
          obj[k] = 'ground';
        }
      }
    });

    // 2) 건물만 공격하도록 강제하는 모든 불리언/문자열 플래그 해제
    const buildingFlags = ['bOnly', 'buildingOnly', 'buildingsOnly', 'towerOnly', 'onlyBuilding', 'onlyTower', 'siege'];
    buildingFlags.forEach(flag => {
      if (flag in obj) {
        obj[flag] = false;
        try { delete obj[flag]; } catch (e) {}
      }
    });

    // 3) 혹시 값 자체가 'building' / 'buildings' / 'tower' 로 되어 있는 임의의 키가 있다면 'ground'(또는 기사의 값)로 교체
    Object.keys(obj).forEach(k => {
      if (k === 'kind' || k === 'id' || k === 'key' || k === 'name') return;
      const v = obj[k];
      if (v === 'building' || v === 'buildings' || v === 'tower' || v === 'towers' || v === 'struct') {
        obj[k] = (knightRef && knightRef[k]) ? knightRef[k] : 'ground';
      }
    });

    // 4) 카드 설명(desc)에 '건물만' 문구가 있으면 자연스럽게 변경
    if (typeof obj.desc === 'string' && obj.desc.includes('건물만')) {
      obj.desc = obj.desc.replace('건물만', '적 유닛과 건물을');
    }
  }

  function patchGiantUnitAttack() {
    try {
      if (typeof CARDS !== 'undefined' && CARDS && CARDS.giant) {
        const knightRef = CARDS.knight || null;
        unlockGiantTarget(CARDS.giant, knightRef);
      }
      // 이미 전장에 소환되어 있는 자이언트(레벨 보정용 Object.assign 클론 u.c 포함)도 즉시 적용
      if (typeof units !== 'undefined' && Array.isArray(units)) {
        const knightRef = (typeof CARDS !== 'undefined' && CARDS) ? CARDS.knight : null;
        for (let i = 0; i < units.length; i++) {
          const u = units[i];
          if (u && u.key === 'giant') {
            unlockGiantTarget(u, knightRef);
            if (u.c) unlockGiantTarget(u.c, knightRef);
            // 만약 현재 먼 거리의 타워만 타겟으로 잡고 있는데 바로 앞에 적 유닛이 있다면 즉시 재탐색하도록 유도
            if (u.target && u.target.isTower) {
              const nearEnemyUnit = units.find(e =>
                !e.dead && e.team !== u.team && !e.c?.flying &&
                Math.hypot(e.x - u.x, e.y - u.y) <= 3.5
              );
              if (nearEnemyUnit) {
                u.target = nearEnemyUnit;
              }
            }
          }
        }
      }
    } catch (e) {}
  }

  function injectStyle() {
    if (!document.head) return;

    [
      'rf-style', 'ui-v134', 'ui-v135', 'ui-v151', 'ui-v156',
      'ui-v179', 'ui-v183', 'ui-v185', 'ui-v186'
    ].forEach(id => {
      const old = document.getElementById(id);
      if (old) old.remove();
    });

    let style = document.getElementById(PATCH_STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = PATCH_STYLE_ID;
    }
    if (document.head.lastElementChild !== style) {
      document.head.appendChild(style);
    }

    const css = `
      /* ===== 0. 전역 스크롤바 제거 & 선명한 타이포그래피 통일 ===== */
      :root {
        --fd: 'Pretendard Variable', 'Noto Sans KR', system-ui, -apple-system, sans-serif !important;
        --title-font: 'Pretendard Variable', 'Noto Sans KR', system-ui, -apple-system, sans-serif !important;
      }

      *, *::before, *::after {
        box-sizing: border-box !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
        -webkit-text-stroke: 0px transparent !important;
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
      }

      *::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }

      html, body, #app,
      button, input, select, textarea,
      #screen-title, #screen-title *,
      #screen-battle, #screen-battle *,
      #overlay-result, #overlay-result *,
      #deck-edit, #deck-edit *,
      #overlay-hof, #overlay-hof *,
      #overlay-skill, #overlay-skill *,
      #overlay-profile, #overlay-profile *,
      #overlay-relic, #overlay-relic *,
      #overlay-info, #overlay-info * {
        font-family: 'Pretendard Variable', 'Noto Sans KR', system-ui, -apple-system, sans-serif !important;
        letter-spacing: -0.2px !important;
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
        width: min(420px, 96vw) !important;
        max-width: 420px !important;
        height: calc(100dvh - 14px) !important;
        max-height: calc(100dvh - 14px) !important;
        margin: 7px auto !important;
        padding: 14px 15px !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        align-items: stretch !important;
        gap: 6px !important;
        overflow: hidden !important;
        background: linear-gradient(180deg, #142242 0%, #0c152a 55%, #080e1d 100%) !important;
        border: 1.5px solid rgba(255, 202, 40, 0.55) !important;
        border-radius: 22px !important;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85) !important;
      }

      #screen-title .t-hero {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 3px !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      #screen-title .t-hero .t-emblem {
        width: 82px !important;
        height: 82px !important;
        max-height: 11.5dvh !important;
        border-radius: 18px !important;
        border: 2px solid #ffca28 !important;
        object-fit: cover !important;
        margin: 0 auto 2px !important;
      }

      #screen-title h1, #screen-title .t-logo {
        font-size: 23px !important;
        font-weight: 800 !important;
        color: #ffd54f !important;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.75) !important;
        margin: 0 !important;
      }

      #screen-title .t-sub {
        font-size: 11.5px !important;
        font-weight: 600 !important;
        color: #9fb4d8 !important;
        margin: 0 !important;
      }

      #screen-title .theme-row {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 6px !important;
        width: 100% !important;
        padding: 4px !important;
        background: rgba(8, 14, 28, 0.75) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 14px !important;
        margin: 0 !important;
      }

      #screen-title .theme-row .t-btn,
      #screen-title .theme-row button {
        height: 36px !important;
        border-radius: 10px !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        padding: 0 6px !important;
        background: rgba(20, 32, 58, 0.7) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        color: #9ab0d6 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 5px !important;
        white-space: nowrap !important;
      }

      #screen-title .theme-row .t-btn.sel,
      #screen-title .theme-row button.sel {
        background: linear-gradient(180deg, #ffca28 0%, #f57c00 100%) !important;
        border: 1.5px solid #ffe082 !important;
        color: #140b00 !important;
        font-weight: 800 !important;
        text-shadow: none !important;
      }

      #screen-title #deck-pick {
        display: flex !important;
        flex-direction: column !important;
        gap: 6px !important;
        width: 100% !important;
        margin: 0 !important;
      }

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
        height: 34px !important;
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
        padding: 0 !important;
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
        left: 10px !important;
        height: 32px !important;
        padding: 0 11px !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        border-radius: 999px !important;
        z-index: 45 !important;
      }

      #repair-btn, #btn-repair, .repair-btn {
        bottom: 8px !important;
        right: 10px !important;
        height: 32px !important;
        padding: 0 11px !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        border-radius: 999px !important;
        z-index: 45 !important;
      }

      #hud {
        flex: 0 0 auto !important;
        width: 100% !important;
        padding: 5px 8px calc(5px + env(safe-area-inset-bottom, 0px)) !important;
        background: linear-gradient(180deg, #0f1b33 0%, #091120 100%) !important;
        border-top: 1px solid rgba(255, 202, 40, 0.35) !important;
        z-index: 45 !important;
      }

      #hand-row {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
        margin-bottom: 4px !important;
      }

      #next-slot, #next-wrap, #next-card {
        flex: 0 0 38px !important;
        width: 38px !important;
        height: 48px !important;
        transform: scale(0.88) !important;
      }

      #cards {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
      }

      #cards .card, #hand-row .card {
        width: 56px !important;
        min-width: 56px !important;
        max-width: 56px !important;
        height: 66px !important;
        min-height: 66px !important;
        max-height: 66px !important;
        border-radius: 10px !important;
        padding: 2px !important;
        position: relative !important;
      }

      #cards .card .nm, #hand-row .card .nm {
        font-size: 10px !important;
        font-weight: 700 !important;
        line-height: 1.1 !important;
        white-space: nowrap !important;
      }

      #cards .card .cost, #hand-row .card .cost {
        width: 18px !important;
        height: 18px !important;
        font-size: 10.5px !important;
        font-weight: 800 !important;
        line-height: 18px !important;
        top: -4px !important;
        left: -4px !important;
      }

      #elixir-row {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 6px !important;
        width: 100% !important;
        max-width: 280px !important;
        height: 18px !important;
        margin: 0 auto !important;
      }

      #elixir-num {
        font-size: 13.5px !important;
        font-weight: 800 !important;
        color: #f3e8ff !important;
        min-width: 18px !important;
        text-align: center !important;
      }

      #elixir-track {
        flex: 1 1 auto !important;
        width: 100% !important;
        min-width: 150px !important;
        height: 13px !important;
        background: rgba(11, 18, 34, 0.95) !important;
        border: 1.5px solid rgba(199, 125, 255, 0.7) !important;
        border-radius: 999px !important;
        overflow: hidden !important;
        display: block !important;
        position: relative !important;
      }

      #elixir-fill {
        height: 100% !important;
        background: linear-gradient(90deg, #9d4edd 0%, #c77dff 55%, #e0aaff 100%) !important;
        border-radius: 999px !important;
        display: block !important;
      }

      #elixir-row .hidden, #x2-badge.hidden {
        display: none !important;
      }

      /* ==========================================================================
         3. 🃏 덱 편성 (#deck-edit) — 4x2 전투덱 + 6x3 보유풀 고정
         ========================================================================== */
      #deck-edit:not(.hidden) {
        position: fixed !important;
        inset: 0 !important;
        width: min(420px, 96vw) !important;
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
        gap: 6px !important;
        z-index: 99990 !important;
        overflow: hidden !important;
      }

      .ra-empty-slot {
        width: 100% !important;
        height: 58px !important;
        border-radius: 10px !important;
        border: 1.5px dashed rgba(255, 213, 79, 0.28) !important;
        background: rgba(10, 18, 34, 0.45) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: rgba(255, 213, 79, 0.4) !important;
        font-size: 10px !important;
        font-weight: 700 !important;
        pointer-events: none !important;
      }

      /* ==========================================================================
         4. 공통 오버레이 모달 (#overlay-profile, #overlay-hof, #overlay-skill, #overlay-result 등)
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
        padding: 12px !important;
        background: rgba(4, 9, 18, 0.84) !important;
        backdrop-filter: blur(5px) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
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
        max-height: calc(100dvh - 24px) !important;
        margin: auto !important;
        padding: 16px !important;
        border-radius: 20px !important;
        border: 1.5px solid rgba(255, 202, 40, 0.65) !important;
        background: linear-gradient(180deg, #162646 0%, #0b1426 100%) !important;
        box-shadow: 0 18px 44px rgba(0, 0, 0, 0.92) !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: space-between !important;
        align-items: stretch !important;
        gap: 8px !important;
        overflow: hidden !important;
      }

      /* ==========================================================================
         5. 🎖️ 지휘관 프로필 (#overlay-profile) 완벽 정렬 & 클릭 보장
         ========================================================================== */
      #overlay-profile h2 {
        font-size: 20px !important;
        font-weight: 800 !important;
        color: #ffd54f !important;
        text-align: center !important;
        margin: 0 !important;
        text-shadow: none !important;
      }

      #overlay-profile .rsub {
        font-size: 11px !important;
        color: #9fb4d8 !important;
        text-align: center !important;
        margin: 0 !important;
      }

      #overlay-profile #prf-stats {
        background: rgba(9, 16, 32, 0.8) !important;
        border: 1px solid rgba(255, 213, 79, 0.32) !important;
        border-radius: 12px !important;
        padding: 8px 12px !important;
        text-align: center !important;
        color: #e2ecff !important;
        font-size: 12.5px !important;
        line-height: 1.45 !important;
        margin: 0 !important;
      }

      #overlay-profile .prf-row {
        display: grid !important;
        grid-template-columns: 1fr 92px !important;
        gap: 8px !important;
        width: 100% !important;
        margin: 0 !important;
        align-items: center !important;
      }

      #overlay-profile .prf-row.ra-reset-row {
        grid-template-columns: 1fr 1fr !important;
      }

      #overlay-profile .prf-row input {
        width: 100% !important;
        height: 40px !important;
        padding: 0 12px !important;
        border-radius: 10px !important;
        background: rgba(8, 14, 28, 0.95) !important;
        border: 1.5px solid #3b5280 !important;
        color: #ffffff !important;
        font-size: 13px !important;
      }

      #overlay-profile .prf-btn {
        width: 100% !important;
        height: 40px !important;
        min-width: 0 !important;
        padding: 0 10px !important;
        border-radius: 10px !important;
        font-size: 13px !important;
        font-weight: 800 !important;
        cursor: pointer !important;
        pointer-events: auto !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-shadow: none !important;
      }

      #overlay-profile #btn-prf-rename,
      #overlay-profile #btn-prf-new {
        background: linear-gradient(180deg, #ffca28 0%, #f57c00 100%) !important;
        border: 1.5px solid #ffe082 !important;
        color: #170d00 !important;
      }

      #overlay-profile #btn-profile-reset {
        background: linear-gradient(180deg, #7f1d1d 0%, #450a0a 100%) !important;
        border: 1.5px solid #f87171 !important;
        color: #fecaca !important;
      }

      #overlay-profile #btn-profile-undo {
        background: linear-gradient(180deg, #1e3a8a 0%, #172554 100%) !important;
        border: 1.5px solid #60a5fa !important;
        color: #dbeafe !important;
      }

      #overlay-profile #prf-list {
        display: flex !important;
        flex-direction: column !important;
        gap: 6px !important;
        width: 100% !important;
        max-height: 175px !important;
        overflow-y: auto !important;
        margin: 0 !important;
      }

      #overlay-profile .prf-item {
        width: 100% !important;
        min-height: 42px !important;
        padding: 6px 12px !important;
        border-radius: 11px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        background: rgba(14, 23, 42, 0.9) !important;
        border: 1px solid rgba(255, 255, 255, 0.14) !important;
        color: #f1f5f9 !important;
        font-size: 13.5px !important;
        font-weight: 700 !important;
      }

      #overlay-profile .prf-item.on {
        border: 1.5px solid #ffd54f !important;
        background: linear-gradient(90deg, rgba(72, 54, 18, 0.72), rgba(20, 34, 62, 0.92)) !important;
      }

      #overlay-profile .prf-item button {
        height: 30px !important;
        min-width: 52px !important;
        padding: 0 10px !important;
        border-radius: 8px !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        pointer-events: auto !important;
        margin-left: 5px !important;
      }

      #overlay-profile #btn-prf-close,
      #overlay-profile .prf-close-btn {
        width: 100% !important;
        height: 42px !important;
        margin: 2px 0 0 !important;
        border-radius: 12px !important;
        background: linear-gradient(180deg, #283a5e 0%, #17233b 100%) !important;
        border: 1.5px solid rgba(255, 213, 79, 0.55) !important;
        color: #ffd54f !important;
        font-size: 14.5px !important;
        font-weight: 800 !important;
        text-shadow: none !important;
        box-shadow: none !important;
        cursor: pointer !important;
      }

      /* ==========================================================================
         6. 🏆 명예의 전당 (#overlay-hof) & 🎓 전술 연구소 (#overlay-skill) & 엔딩 (#overlay-result)
         ========================================================================== */
      #overlay-hof .hof-podium {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        align-items: end !important;
        gap: 8px !important;
        width: 100% !important;
      }
      #overlay-hof .hof-podium * { white-space: nowrap !important; }
      #overlay-hof #btn-hof-close {
        width: 100% !important;
        height: 42px !important;
        border-radius: 12px !important;
        font-weight: 800 !important;
      }

      #overlay-skill > .rpanel { width: min(430px, 96vw) !important; max-width: 430px !important; padding: 12px !important; }
      #overlay-skill #sk-grid {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 6px !important;
        width: 100% !important;
      }
      #overlay-skill .sk-col { display: flex !important; flex-direction: column !important; gap: 6px !important; }
      #overlay-skill .sk-item {
        width: 100% !important;
        min-height: 74px !important;
        padding: 6px 6px 26px !important;
        border-radius: 10px !important;
        position: relative !important;
      }
      #overlay-skill .sk-item button {
        position: absolute !important;
        bottom: 4px !important;
        top: auto !important;
        transform: none !important;
        width: 22px !important;
        height: 22px !important;
        min-width: 22px !important;
        padding: 0 !important;
        border-radius: 6px !important;
      }
      #overlay-skill .sk-item button:first-of-type { right: 4px !important; }
      #overlay-skill .sk-item button:last-of-type { right: 28px !important; }

      #overlay-result > *:not(.r-box) { display: none !important; }
      #overlay-result > .r-box { width: min(355px, 92vw) !important; max-width: 355px !important; }
      #overlay-result .rsnap, #overlay-result #rf-snap {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 8px !important;
        width: 100% !important;
      }
      #overlay-result .rsnap > div {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 2px !important;
        padding: 6px 4px !important;
        border-radius: 10px !important;
        background: rgba(10, 18, 36, 0.72) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
      }
      #overlay-result .r-tabs, #overlay-result #r-actions, #overlay-result .rbrow {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 8px !important;
        width: 100% !important;
      }
      #overlay-result #btn-again, #overlay-result #btn-home, #overlay-result #btn-main {
        width: 100% !important;
        height: 42px !important;
        border-radius: 12px !important;
        font-size: 14px !important;
        font-weight: 800 !important;
        text-shadow: none !important;
      }
      #overlay-result #btn-again {
        background: linear-gradient(180deg, #ffca28 0%, #ff8f00 100%) !important;
        color: #190e00 !important;
        border: 1.5px solid #ffe082 !important;
      }
      #overlay-result #btn-home, #overlay-result #btn-main {
        background: linear-gradient(180deg, #2b3f66 0%, #18243d 100%) !important;
        color: #f0f6ff !important;
        border: 1.5px solid #5a78b0 !important;
      }
    `;

    if (style.textContent !== css) {
      style.textContent = css;
    }
  }

  function setImp(el, prop, val) {
    if (el && el.style && el.style.getPropertyValue(prop) !== val) {
      el.style.setProperty(prop, val, 'important');
    }
  }

  /* ==========================================================================
     지휘관 프로필 데이터 헬퍼 & 버튼 액션 직접 처리기
     ========================================================================== */
  function showToast(msg) {
    try {
      if (typeof window.toast === 'function') {
        window.toast(msg);
        return;
      }
    } catch (e) {}
    let t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:100000;background:rgba(12,20,38,0.95);color:#ffd54f;border:1.5px solid #ffca28;padding:8px 16px;border-radius:999px;font-weight:800;font-size:13px;pointer-events:none;box-shadow:0 8px 20px rgba(0,0,0,0.7);';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.remove('hidden');
    t.style.display = 'block';
    t.style.opacity = '1';
    clearTimeout(t.__tid);
    t.__tid = setTimeout(() => {
      t.style.opacity = '0';
      t.classList.add('hidden');
    }, 2000);
  }

  function getProfDb() {
    try {
      const d = JSON.parse(localStorage.getItem('ra_profiles_v1') || 'null');
      if (d && Array.isArray(d.list) && d.list.length > 0) {
        if (!d.active || !d.list.includes(d.active)) d.active = d.list[0];
        return d;
      }
    } catch (e) {}
    return { list: ['지휘관'], active: '지휘관' };
  }

  function saveProfDb(d) {
    try {
      localStorage.setItem('ra_profiles_v1', JSON.stringify(d));
    } catch (e) {}
  }

  function getProfKey(name) {
    return 'ra_prof_' + encodeURIComponent(name);
  }

  function getLiveSnapshot() {
    try {
      return {
        tro: parseInt(localStorage.getItem('ra_trophies_v1') || '0', 10) || 0,
        wins: parseInt(localStorage.getItem('ra_wins_v1') || '0', 10) || 0,
        sp: JSON.parse(localStorage.getItem('ra_sp_v1') || '{"sp":0,"total":0}'),
        sk: JSON.parse(localStorage.getItem('ra_skills_v1') || '{}'),
        rel: localStorage.getItem('ra_relic_v1') || ''
      };
    } catch (e) {
      return { tro: 0, wins: 0, sp: { sp: 0, total: 0 }, sk: {}, rel: '' };
    }
  }

  function applySnapshotToLive(s) {
    const snap = s || { tro: 0, wins: 0, sp: { sp: 0, total: 0 }, sk: {}, rel: '' };
    try {
      localStorage.setItem('ra_trophies_v1', String(snap.tro || 0));
      localStorage.setItem('ra_wins_v1', String(snap.wins || 0));
      localStorage.setItem('ra_sp_v1', JSON.stringify(snap.sp || { sp: 0, total: 0 }));
      localStorage.setItem('ra_skills_v1', JSON.stringify(snap.sk || {}));
      if (snap.rel) localStorage.setItem('ra_relic_v1', snap.rel);
      else localStorage.removeItem('ra_relic_v1');
    } catch (e) {}
    try {
      if (typeof window.S === 'object' && window.S) {
        window.S.relic = snap.rel || '';
        window.S._sk = {};
      }
      if (typeof window.applyRelics === 'function') window.applyRelics();
      if (typeof window.syncTrophyChip === 'function') window.syncTrophyChip();
      if (typeof window.syncGradeVisual === 'function') window.syncGradeVisual();
    } catch (e) {}
  }

  function refreshProfileModalUI() {
    const ov = document.getElementById('overlay-profile');
    if (!ov) return;

    const d = getProfDb();
    const s = getLiveSnapshot();
    try {
      localStorage.setItem(getProfKey(d.active), JSON.stringify(s));
      saveProfDb(d);
    } catch (e) {}

    let gname = '훈련 캠프';
    try {
      if (typeof window.GRADES !== 'undefined' && typeof window.gradeOf === 'function') {
        const g = window.GRADES[window.gradeOf(s.tro)];
        if (g && g[0]) gname = g[0];
      }
    } catch (e) {}

    const stEl = document.getElementById('prf-stats');
    if (stEl) {
      const spVal = (s.sp && typeof s.sp.sp === 'number') ? s.sp.sp : 0;
      stEl.innerHTML =
        '현재: <b style="color:#ffd54f">' + d.active + '</b> · 등급 <b style="color:#ffd54f">' + gname + '</b><br>' +
        '트로피 <b style="color:#ffd54f">' + (s.tro || 0) + '</b> · 승리 <b style="color:#ffd54f">' + (s.wins || 0) + '</b> · SP <b style="color:#ffd54f">' + spVal + '</b>';
    }

    const nmInput = document.getElementById('prf-name');
    if (nmInput) nmInput.placeholder = d.active;

    const listBox = document.getElementById('prf-list');
    if (listBox) {
      listBox.innerHTML = '';
      d.list.forEach(name => {
        const isCurrent = (name === d.active);
        const item = document.createElement('div');
        item.className = 'prf-item' + (isCurrent ? ' on' : '');

        const leftSpan = document.createElement('span');
        leftSpan.style.cssText = 'display:flex;align-items:center;gap:6px;font-weight:800;color:' + (isCurrent ? '#ffd54f' : '#e2ecff') + ';';
        leftSpan.textContent = (isCurrent ? '● ' : '') + name;

        const rightBox = document.createElement('span');
        rightBox.style.cssText = 'display:flex;align-items:center;gap:6px;';

        const selBtn = document.createElement('button');
        selBtn.type = 'button';
        selBtn.textContent = isCurrent ? '사용 중' : '선택';
        selBtn.disabled = isCurrent;
        selBtn.style.cssText = isCurrent
          ? 'background:rgba(255,213,79,0.16);border:1px solid rgba(255,213,79,0.55);color:#ffd54f;opacity:0.85;cursor:default;'
          : 'background:rgba(30,48,82,0.95);border:1px solid rgba(255,213,79,0.6);color:#ffd54f;cursor:pointer;';

        selBtn.onclick = function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          if (isCurrent) return;
          const db = getProfDb();
          localStorage.setItem(getProfKey(db.active), JSON.stringify(getLiveSnapshot()));
          db.active = name;
          saveProfDb(db);
          let targetSnap = null;
          try {
            targetSnap = JSON.parse(localStorage.getItem(getProfKey(name)) || 'null');
          } catch (e) {}
          applySnapshotToLive(targetSnap || { tro: 0, wins: 0, sp: { sp: 0, total: 0 }, sk: {}, rel: '' });
          refreshProfileModalUI();
          showToast("지휘관 '" + name + "'(으)로 전환되었습니다");
        };

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.textContent = '삭제';
        const canDelete = d.list.length > 1;
        delBtn.disabled = !canDelete;
        delBtn.style.cssText = canDelete
          ? 'background:rgba(105,22,32,0.92);border:1px solid #f87171;color:#fecaca;cursor:pointer;'
          : 'background:rgba(40,20,28,0.4);border:1px solid rgba(248,113,113,0.25);color:rgba(254,202,202,0.35);cursor:not-allowed;';

        delBtn.onclick = function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          const db = getProfDb();
          if (db.list.length <= 1) {
            showToast('최소 1명의 지휘관은 남겨야 합니다');
            return;
          }
          if (db.active === name) {
            const nextActive = db.list.find(x => x !== name) || db.list[0];
            db.active = nextActive;
            let nextSnap = null;
            try {
              nextSnap = JSON.parse(localStorage.getItem(getProfKey(nextActive)) || 'null');
            } catch (e) {}
            applySnapshotToLive(nextSnap || { tro: 0, wins: 0, sp: { sp: 0, total: 0 }, sk: {}, rel: '' });
          }
          db.list = db.list.filter(x => x !== name);
          try {
            localStorage.removeItem(getProfKey(name));
          } catch (e) {}
          saveProfDb(db);
          refreshProfileModalUI();
          showToast("지휘관 '" + name + "' 삭제 완료!");
        };

        rightBox.appendChild(selBtn);
        rightBox.appendChild(delBtn);
        item.appendChild(leftSpan);
        item.appendChild(rightBox);
        listBox.appendChild(item);
      });
    }
  }

  function bindProfileActions() {
    const ov = document.getElementById('overlay-profile');
    if (!ov) return;

    const resetBtn = document.getElementById('btn-profile-reset');
    const undoBtn = document.getElementById('btn-profile-undo');
    if (resetBtn && resetBtn.parentElement && !resetBtn.parentElement.classList.contains('ra-reset-row')) {
      resetBtn.parentElement.classList.add('ra-reset-row');
    }

    const renameBtn = document.getElementById('btn-prf-rename');
    if (renameBtn && !renameBtn.__raBound) {
      renameBtn.__raBound = true;
      renameBtn.onclick = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        const inp = document.getElementById('prf-name');
        const newName = inp ? inp.value.trim().slice(0, 12) : '';
        if (!newName) {
          showToast('변경할 지휘관 이름을 입력해 주세요');
          return;
        }
        const db = getProfDb();
        if (db.list.includes(newName)) {
          showToast('이미 존재하는 지휘관 이름입니다');
          return;
        }
        const oldName = db.active;
        const snap = getLiveSnapshot();
        try {
          localStorage.setItem(getProfKey(newName), JSON.stringify(snap));
          localStorage.removeItem(getProfKey(oldName));
        } catch (e) {}
        db.list = db.list.map(x => (x === oldName ? newName : x));
        db.active = newName;
        saveProfDb(db);
        if (inp) inp.value = '';
        refreshProfileModalUI();
        showToast("지휘관 이름이 '" + newName + "'(으)로 변경되었습니다");
      };
    }

    const newBtn = document.getElementById('btn-prf-new');
    if (newBtn && !newBtn.__raBound) {
      newBtn.__raBound = true;
      newBtn.onclick = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        const inp = document.getElementById('prf-new');
        const newName = inp ? inp.value.trim().slice(0, 12) : '';
        if (!newName) {
          showToast('새 지휘관 이름을 입력해 주세요');
          return;
        }
        const db = getProfDb();
        if (db.list.includes(newName)) {
          showToast('이미 존재하는 지휘관 이름입니다');
          return;
        }
        try {
          localStorage.setItem(getProfKey(db.active), JSON.stringify(getLiveSnapshot()));
        } catch (e) {}
        const emptySnap = { tro: 0, wins: 0, sp: { sp: 0, total: 0 }, sk: {}, rel: '' };
        db.list.push(newName);
        db.active = newName;
        try {
          localStorage.setItem(getProfKey(newName), JSON.stringify(emptySnap));
        } catch (e) {}
        saveProfDb(db);
        applySnapshotToLive(emptySnap);
        if (inp) inp.value = '';
        refreshProfileModalUI();
        showToast("새 지휘관 '" + newName + "' 생성 완료!");
      };
    }

    if (resetBtn && !resetBtn.__raBound) {
      resetBtn.__raBound = true;
      resetBtn.onclick = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        const db = getProfDb();
        const currentSnap = getLiveSnapshot();
        try {
          localStorage.setItem('ra_prof_backup_v1', JSON.stringify({ n: db.active, s: currentSnap }));
        } catch (e) {}

        const zeroSnap = { tro: 0, wins: 0, sp: { sp: 0, total: 0 }, sk: {}, rel: '' };
        try {
          localStorage.setItem(getProfKey(db.active), JSON.stringify(zeroSnap));
        } catch (e) {}
        applySnapshotToLive(zeroSnap);
        refreshProfileModalUI();
        showToast("'" + db.active + "' 진행도가 초기화되었습니다 ([복원]으로 복구 가능)");
      };
    }

    if (undoBtn && !undoBtn.__raBound) {
      undoBtn.__raBound = true;
      undoBtn.onclick = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        let backup = null;
        try {
          backup = JSON.parse(localStorage.getItem('ra_prof_backup_v1') || 'null');
        } catch (e) {}
        if (!backup || !backup.s) {
          showToast('복원할 리셋 백업 데이터가 없습니다');
          return;
        }
        const db = getProfDb();
        const targetName = backup.n && db.list.includes(backup.n) ? backup.n : db.active;
        try {
          localStorage.setItem(getProfKey(targetName), JSON.stringify(backup.s));
          localStorage.removeItem('ra_prof_backup_v1');
        } catch (e) {}
        if (targetName === db.active) {
          applySnapshotToLive(backup.s);
        } else {
          db.active = targetName;
          saveProfDb(db);
          applySnapshotToLive(backup.s);
        }
        refreshProfileModalUI();
        showToast("'" + targetName + "'의 직전 진행도를 완벽히 복원했습니다!");
      };
    }

    const closeBtn = document.getElementById('btn-prf-close');
    if (closeBtn && !closeBtn.__raBound) {
      closeBtn.__raBound = true;
      closeBtn.onclick = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        ov.classList.add('hidden');
        ov.style.setProperty('display', 'none', 'important');
      };
    }

    const listBox = document.getElementById('prf-list');
    if (listBox && !ov.classList.contains('hidden')) {
      const firstBtn = listBox.querySelector('button');
      if (!firstBtn || !firstBtn.__raListBound) {
        refreshProfileModalUI();
        listBox.querySelectorAll('button').forEach(b => { b.__raListBound = true; });
      }
    }
  }

  function hookProfileFunctions() {
    if (typeof window.renderProfileList === 'function' && !window.renderProfileList.__raHooked) {
      const orig = window.renderProfileList;
      const wrapped = function () {
        try { orig.apply(this, arguments); } catch (e) {}
        refreshProfileModalUI();
      };
      wrapped.__raHooked = true;
      window.renderProfileList = wrapped;
    }
  }

  function applyInlineOverrides() {
    window.__uiUp = function () {};
    window.__navUp = function () {};

    // [적용] 자이언트(giant)가 유닛도 공격 가능하도록 타겟팅 패치 상시 유지
    patchGiantUnitAttack();

    // 1. 메인 배틀 시작 버튼
    const startBtn = document.getElementById('btn-start');
    if (startBtn) {
      setImp(startBtn, 'background', 'linear-gradient(180deg, #ffd54f 0%, #ff9800 50%, #e65100 100%)');
      setImp(startBtn, 'border', '1.5px solid #fff3c4');
      setImp(startBtn, 'color', '#1a0e00');
      setImp(startBtn, 'font-size', '18px');
      setImp(startBtn, 'font-weight', '800');
      setImp(startBtn, 'text-shadow', 'none');
      setImp(startBtn, 'height', '48px');
      setImp(startBtn, 'border-radius', '14px');
    }

    // 2. 메인 덱 1 / 덱 2 선택 강조
    const deckPick = document.getElementById('deck-pick');
    if (deckPick) {
      Array.from(deckPick.children).forEach(el => {
        const txt = (el.textContent || '').trim();
        const isSelected = el.classList.contains('sel') || el.classList.contains('on') || el.classList.contains('active') || txt.includes('✔') || txt.includes('사용');
        setImp(el, 'width', '100%');
        setImp(el, 'min-height', '46px');
        setImp(el, 'padding', '6px 12px');
        setImp(el, 'border-radius', '12px');
        setImp(el, 'display', 'flex');
        setImp(el, 'align-items', 'center');
        setImp(el, 'justify-content', 'space-between');
        if (isSelected) {
          setImp(el, 'background', 'linear-gradient(90deg, rgba(68, 48, 16, 0.92) 0%, rgba(28, 44, 78, 0.95) 100%)');
          setImp(el, 'border', '1.5px solid #ffca28');
          setImp(el, 'color', '#fff8e1');
          setImp(el, 'opacity', '1');
        } else {
          setImp(el, 'background', 'rgba(13, 21, 38, 0.72)');
          setImp(el, 'border', '1px solid rgba(148, 163, 184, 0.25)');
          setImp(el, 'color', '#8fa4c8');
          setImp(el, 'opacity', '0.78');
        }
      });
    }

    // 3. 메인 하단 메뉴 버튼 정렬
    const actions = document.getElementById('title-actions');
    const infoBtn = document.getElementById('btn-info');
    const menuBtns = actions ? Array.from(actions.children) : [];
    if (infoBtn) menuBtns.push(infoBtn);

    menuBtns.forEach(btn => {
      const txt = (btn.textContent || '').trim();
      setImp(btn, 'height', '42px');
      setImp(btn, 'width', '100%');
      setImp(btn, 'border-radius', '12px');
      setImp(btn, 'font-size', '13.5px');
      setImp(btn, 'font-weight', '800');
      setImp(btn, 'text-shadow', 'none');
      setImp(btn, 'display', 'inline-flex');
      setImp(btn, 'align-items', 'center');
      setImp(btn, 'justify-content', 'center');
      setImp(btn, 'gap', '6px');

      if (txt.includes('덱 편성')) {
        setImp(btn, 'background', 'linear-gradient(180deg, #4a2c82 0%, #2a1752 100%)');
        setImp(btn, 'border', '1.5px solid #b388ff');
        setImp(btn, 'color', '#f3e5f5');
      } else if (txt.includes('전술 연구소')) {
        setImp(btn, 'background', 'linear-gradient(180deg, #6d3b14 0%, #3e2008 100%)');
        setImp(btn, 'border', '1.5px solid #ffb74d');
        setImp(btn, 'color', '#fff3e0');
      } else if (txt.includes('게임 방법')) {
        setImp(btn, 'background', 'linear-gradient(180deg, #1b4d5c 0%, #0f2d38 100%)');
        setImp(btn, 'border', '1.5px solid #4dd0e1');
        setImp(btn, 'color', '#e0f7fa');
      } else {
        setImp(btn, 'background', 'linear-gradient(180deg, #203359 0%, #121e36 100%)');
        setImp(btn, 'border', '1.5px solid rgba(255, 202, 40, 0.65)');
        setImp(btn, 'color', '#ffe082');
      }
    });

    // 4. 덱 편성 모달(#deck-edit) 고정 레이아웃 유지
    const deckEdit = document.getElementById('deck-edit');
    if (deckEdit) {
      if (deckEdit.parentElement !== document.body) {
        document.body.appendChild(deckEdit);
      }

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
        setImp(card, 'max-width', 'none');
        setImp(card, 'height', '100%');
        setImp(card, 'min-height', '0');
        setImp(card, 'margin', '0');
        setImp(card, 'padding', '3px 2px');
        setImp(card, 'border-radius', '9px');
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
            setImp(t, 'font-size', '10px');
            setImp(t, 'line-height', '1.05');
            setImp(t, 'white-space', 'nowrap');
          }
        });
      };

      if (curGrid) {
        setImp(curGrid, 'flex', '0 0 auto');
        setImp(curGrid, 'display', 'grid');
        setImp(curGrid, 'grid-template-columns', 'repeat(4, 1fr)');
        setImp(curGrid, 'grid-template-rows', 'repeat(2, 58px)');
        setImp(curGrid, 'gap', '5px');
        setImp(curGrid, 'width', '100%');
        setImp(curGrid, 'height', '134px');
        setImp(curGrid, 'min-height', '134px');
        setImp(curGrid, 'max-height', '134px');
        setImp(curGrid, 'padding', '6px');
        setImp(curGrid, 'background', 'rgba(8, 15, 30, 0.72)');
        setImp(curGrid, 'border', '1.5px solid rgba(255, 213, 79, 0.4)');
        setImp(curGrid, 'border-radius', '14px');
        setImp(curGrid, 'overflow', 'hidden');

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
        setImp(poolGrid, 'min-height', '0');
        setImp(poolGrid, 'display', 'grid');
        setImp(poolGrid, 'grid-template-columns', 'repeat(6, 1fr)');
        setImp(poolGrid, 'grid-auto-rows', '56px');
        setImp(poolGrid, 'gap', '5px');
        setImp(poolGrid, 'width', '100%');
        setImp(poolGrid, 'padding', '6px');
        setImp(poolGrid, 'background', 'rgba(8, 15, 30, 0.55)');
        setImp(poolGrid, 'border', '1px solid rgba(148, 163, 184, 0.25)');
        setImp(poolGrid, 'border-radius', '14px');
        setImp(poolGrid, 'overflow-y', 'auto');
        Array.from(poolGrid.children).forEach(c => styleCardItem(c, 26));
      }

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

          if (!closeBtn) {
            closeBtn = document.createElement('button');
            closeBtn.id = 'ra-deck-close-btn';
            closeBtn.type = 'button';
            closeBtn.textContent = '닫기';
            actionRow.appendChild(closeBtn);
          } else if (closeBtn.parentElement !== actionRow) {
            actionRow.appendChild(closeBtn);
          }

          setImp(saveBtn, 'width', '100%');
          setImp(saveBtn, 'height', '42px');
          setImp(saveBtn, 'border-radius', '12px');
          setImp(saveBtn, 'background', 'linear-gradient(180deg, #ffca28 0%, #ff8f00 100%)');
          setImp(saveBtn, 'border', '1.5px solid #ffe082');
          setImp(saveBtn, 'color', '#140b00');
          setImp(saveBtn, 'font-size', '14px');
          setImp(saveBtn, 'font-weight', '800');
          setImp(saveBtn, 'text-shadow', 'none');

          setImp(closeBtn, 'width', '100%');
          setImp(closeBtn, 'height', '42px');
          setImp(closeBtn, 'border-radius', '12px');
          setImp(closeBtn, 'background', 'linear-gradient(180deg, #2b3f66 0%, #18243d 100%)');
          setImp(closeBtn, 'border', '1.5px solid #6482b8');
          setImp(closeBtn, 'color', '#f0f6ff');
          setImp(closeBtn, 'font-size', '14px');
          setImp(closeBtn, 'font-weight', '800');
          setImp(closeBtn, 'text-shadow', 'none');

          if (!closeBtn.__closeBound) {
            closeBtn.__closeBound = true;
            closeBtn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              deckEdit.classList.add('hidden');
            });
          }
          if (!saveBtn.__autoCloseBound) {
            saveBtn.__autoCloseBound = true;
            saveBtn.addEventListener('click', () => {
              const count = curGrid ? Array.from(curGrid.children).filter(c => !c.classList.contains('ra-empty-slot')).length : 8;
              if (count === 8) {
                setTimeout(() => deckEdit.classList.add('hidden'), 120);
              }
            });
          }
        }
      }
    }

    // 5. 지휘관 프로필 바인딩 및 리스트 갱신
    hookProfileFunctions();
    bindProfileActions();

    // 6. 모달을 body 직속으로 배치
    ['overlay-result', 'overlay-hof', 'overlay-skill', 'overlay-profile', 'overlay-relic', 'overlay-info'].forEach(id => {
      const ov = document.getElementById(id);
      if (ov && ov.parentElement !== document.body) {
        document.body.appendChild(ov);
      }
    });
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
    setTimeout(runAll, 120);
  }, true);

  setInterval(runAll, 250);
})();
