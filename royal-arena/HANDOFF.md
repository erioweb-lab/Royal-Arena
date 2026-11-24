### v550 (2026-11-22)
- 눈보라·번개 지속 시간 오버레이 아트화(사용자 지시): ①ra_fx_snowfall.png(낙설 시트 — snowzone에 2장 세로 스크롤 루프, 지속 시간 내내 눈이 내림·끝나기 전 페이드아웃) ②ra_fx_boltstrike.png(stormzone에 위상 3점 번갈아 낙뢰 펄스 스트라이크 — 청백 발광). 키잉·투명 검증 후 drawFx 통합, 기존 캔버스 눈송이·지그재그는 폴백 유지, __FXIMG 로더 10키 확장. 추가 감사: 부패 거품·화상 불티·회복 반짝임 등 잔여 오버레이는 v328 원칙(순간 파티클=캔버스)에 따라 기존 동적 파티클 유지가 정석 — 추가 생성 불필요 판정. RUN_GATES:ALL_OK, 라이브 칩·sw v550 확인.

### v549 (2026-11-22)
- 눈보라·번개 존 그래픽 강화(사용자 지시): ra_fx_frost·storm을 기존 스프라이트 -i 파생 고디테일로 재생성(frost=결정 빙살·회오리 눈송이·청백 림, storm=분기 번개 3-4발·폭풍 구름·테스라 필라멘트), 키잉·512px·투명 검증 후 교체, 로더 src 캐시버스트 ?v=549(라이브 교체 확인). RUN_GATES:ALL_OK, 라이브 칩·sw v549 확인.

### v548 (2026-11-22)
- 이펙트 확장(cast-fx-audit 전수 절차 준수): drawFx 30분기·push 20종 전수 대조 → 스프라이트/캔버스 분류. 갭 확정: ①rotzone(부패)·plasmazone(플라즈마) — 질감형 존인데 캔버스 드로잉 → ra_fx_rot/plasmazone.png 신규 생성(plasma_beam -i 파생·키잉·투명 검증) ②shockzone — ra_fx_shock.png 파일은 존재하나 로더·분기 미연결이던 갭 → 연결. beam은 v406 FXBEAM 스프라이트 이미 적용 확인(갭 아님), 번쩍임류(ring/flash/zap/die 등)는 v328 원칙대로 캔버스 유지. drawFx 진입 오버라이드 맵 3종 확장+로더 8키 확장(존 스프라이트 전종 커버 완결), 폴백 유지. RUN_GATES:ALL_OK, 라이브 칩·sw v548 확인.

### v547 (2026-11-22)
- 업그레이드 3차 — P4 투사체 완결: 재감사에서 fireball·meteorbit는 PSPR.fireball(img_071) 기존 보유로 판정(이전 정규식 감사 오탈 정정), 진짜 미보유는 plasmabolt 단일. 플라즈마탄 스프라이트 생성(ra_proj_plasma.png — ra_fx_plasma_beam -i 파생·코너 플러드필·128px·투명 0.15+ 검증) → ART_PROJ 등록 + PROJ_BASE.plasmabolt:0 + drawProj plasmabolt 분기에 16방향 베이크 스프라이트 적용(기존 그라디언트 코어는 폴백 유지). RUN_GATES:ALL_OK, 라이브 칩·sw v547 확인.

### v546 (2026-11-22)
- 업그레이드 2차(P3 완결): ①보스 공격 보간 프레임 atk_mid 8종 생성(ra_boss_<테마>_atk_mid.png — atk2 -i 파생, 키잉+idle 기준 스케일 정규화) + 4단 스윙 인덱싱(g1b __fiB 4구간, ATK3.boss.length>=4 하위호환) — 보스 공격모션 뚝뚝 끊김 개선 ②dusk(황혼 신전) 보스 공격 프레임 3종 신규 생성(기존 atk1~3 전무 → 캔버스 폴백이던 것 수복, idle -i 파생) ③보스 프레임 스케일 정규화 5종 수정(frost_atk1 0.88→0.90·waste_atk1 1.08→0.93·sky_atk2 0.90→0.99·tomb_atk2 0.91→1.00·tomb_atk3 0.83→1.00 — 캡처 지적 크기 이질감). walk 감사 결과 이동 가능 유닛 전종 이미 커버(비행·건물·보스 제외 규약) — P2 완결. P4 투사체 감사는 RAW 파서 개선 후 재실행 과제. RUN_GATES:ALL_OK, 라이브 칩·sw v546 확인.

### v545 (2026-11-22)
- 그래픽 업그레이드 계획(art_upgrade_plan_v1.md) 1차 적용: ①미보유 존 스프라이트 3종 생성(ra_fx_warp/storm/burn.png 512px, 코너 플러드필 키잉+알파 밴드 검증 BANDOK) → g1c drawFx 진입부 선표현 오버라이드(stormzone/burnzone/warpzone, 스프라이트 부재 시 기존 캔버스 폴백 유지) ②보스 연출 2종(bossgate=강림 시 kt 좌표 fx push+drawFx 브랜치, doomaura=doom>8s 오라 렌더) + 병합 로더(__FXIMG 키 병합, 폴백 __valid 게이트) ③근접 3종 walk 프레임(knight/prince/valk — idle img_151/153/155 -i 파생, 알파 bbox 높이 정규화 0.965~0.988·발바닥 정렬, ART_FRAMES 등록) — 과정: ART_FRAMES 삽입 첫 시도에서 중첩 객체 경계 오탈(Unexpected token ,) → 객체 시작부 등록으로 수복. P4 투사체 감사는 1차 시도에서 ART_PROJ 정의 파싱 미완(정규식 한계) → 후속 감사 과제로 기록. RUN_GATES:ALL_OK, 라이브 칩·sw v545 확인.

### v544 (2026-11-22)
- v543 보스 형상 교체 무효 수복(사용자 재보고+캡처 판독: 뿔 달린 해골 투구·대검 흑기사 — 사암 미라 군주(황금 파라오 미라)·타 보스 9종 어느 것과도 불일치 → 공용 프레임 그대로): 원인 — FRAMES·ATK3가 청크 내 const 전역(window 속성 아님)이라 v543의 window.FRAMES/window.ATK3 게이트가 무음 스킵. 수정: typeof 게이트로 직접 참조(g1a). 교훈: 전역 객체 조작 시 window 속성 가정 금지. RUN_GATES:ALL_OK, 라이브 칩·sw v544 확인.

### v543 (2026-11-22)
- 지도별 보스 형상 교체(사용자 보고 "모든 보스 형상 동일"): 실측 — ra_boss_<테마> 9종 idle+atk1~3 에셋 전부 존재, spawnBossNow가 SPR.boss.src만 교체하지만 실제 그리기는 공용 FRAMES.boss_idle·ATK3.boss가 승재(naturalWidth>0 우선)해 지도별 교체 미반영. 수정: 강림 시 스프라이트 경에서 테마 키 추출 → FRAMES['boss_idle']=ra_boss_<테마>.png, ATK3.boss=[atk1,atk2,atk3] 지도 전용 이미지 로드(g1a). 보스 9종: 왕국 성기사장·서리 날개 군주·화염 골렘·사암 미라 군주·심연 군주·폭풍 정령왕·백골 대군주·시간의 파수왕·왕좌 수호신. RUN_GATES:ALL_OK, 라이브 칩·sw v543 확인.

### v542 (2026-11-22)
- 적군 눈보라 오발동 수복(사용자 보고: 전투와 관계없는 곳에 발동 — 캡처 판독: 좌상단 빈 영역 서리 존): 원인 — AI가 위협 유닛 3.2타일 위(px=main.x, py=main.y-3.2)에 예측 사격하는데 유닛 소멸·경로 변경 시 빈 곳에 존 잔존. 수정: castBlizzard 발동 시 반경 내 적 유닛이 없으면 가장 가까운 적 유닛 위치로 재중앙화(clamp 필드 경계) — 항상 전투 지점에 발동. 보스 캐릭터는 캡처 판독상 정상 적용 확인(사암 미라 군주 상세 스프라이트·체력바·파멸기). RUN_GATES:ALL_OK, 라이브 칩·sw v542 확인.

### v541 (2026-11-22)
- v540 미반영 수복(사용자 보고: 칩 v540인데 SP 31 그대로): 원인 — spState가 g2~g7 6개 청크에 중복 정의되어 마지막 로드되는 g7 미패치 사본이 승재(전역 스코프 후행 정의 우선), g2·g3에만 적용한 마이그레이션이 무효. 수복: g4-ux-data·g5-core·g6-battle·g7-ui-systems 4개 사본에 동일 마이그레이션(ra_sp_mig_v2 플래그→SP 12 보정+클리어 시드) 적용, node --check 4건 통과. 교훈: 전역 함수 다중 정의 청크 구조에서는 모든 사본 일괄 패치 필요. RUN_GATES:ALL_OK, 라이브 칩·sw v541 확인.

### v540 (2026-11-22)
- SP 지급 규칙 개편(사용자 지시 "악몽 서리왕국까지 완료이므로 9+3정도 sp가 적정"): v505 규칙(승리마다 +1)은 재클리어까지 누적 — 사용자 실측 보유 31로 과다. 변경: ①승리 시 난이도×지도(ra_sp_cleared_v1, 키 "난이도:테마") 최초 클리어에만 +1, 재클리어 무지급·배너도 최초 클리어 때만 ②spState 마이그레이션(ra_sp_mig_v2 플래그): 기존 누적을 진행 기준 12로 보정(노멀 전지도 9+악몽 서리왕국까지 3)하고 클리어 시드 작성(THEMES 키 전체를 diff0으로, 앞 3개를 diff1으로) — 이후 악몽 황야부터 신규 클리어마다 +1. g2·g3 spState 양쪽 적용. RUN_GATES:ALL_OK, 라이브 칩·sw v540 확인.

### v539 (2026-11-22)
- 필드 블랙아웃 재보고(사용자 캡처 판독: v538, 타이머 4:37 진행 중·UI 전부 정상, 전장 캔버스만 검정+흰 별 파티클 보임) → v534 방어와 달리 render()가 살아있고 지형·유닛·타워만 누락인 상태로 판정 — 테마 텍스처/스프라이트 로딩 실패(모바일 네트워크 순간 끊김) 또는 카메라 이탈 계열로 추정. 근본 대기: g1c 루프에 워치독 추가 — 2.5s 주기 캔버스 25점 픽셀 샘플링(taint 시 판정 보류), 밝은 점<2/25가 2연속(전투 6초 경과 후)이면 복구: S.focus 해제·카메라 비정상/과줌 리셋(W/2,H/2,1)·drawStatic 재도색·미로드 테마 텍스처 src 재요청, 10s 쿨다운. 진단 버퍼 window.__raFieldDiag(밝기·cam·theme·units/towers 수·gtOk)·window.__raFieldFix — 재발 시 콘솔에서 원인 특정. RUN_GATES:ALL_OK, 라이브 칩·sw v539 확인.

### v538 (2026-11-22)
- 덱1/덱2 토글 시 버튼 레이아웃 변동 제거(사용자 보고+캡처 2장): 원인 3종 — ①__deckPick이 토글마다 #deck-pick 박스를 removeChild 후 재생성·재삽입(주변 흔들림) ②선택 버튼에만 '· 선택됨' 텍스트 추가(폭 변동) ③deck-desc 설명 길이가 덱마다 달라 하단 버튼열 밀림. 수정: ①박스 신규 생성은 최초 1회, 이후 parentNode 불일치 시에만 재삽입하고 내부 HTML만 갱신 ②버튼 고정 높이 58px+flex 중앙 정렬(padding 4px), '· 선택됨'은 visibility 예약(미선택도 공간 유지) ③deck-desc 고정 1줄(14px, nowrap+말줄임). ui-v538 스타일 블록(#deck-pick margin 10px·gap 10px 균등). RUN_GATES:ALL_OK, 라이브 칩·sw v538 확인.

### v537 (2026-11-22)
- 배틀 시작 버튼 아이콘 후속 수복(사용자 보고: 흰 배경 잔존+버튼 벗어남): ra_ic_swords.png 48px 원본의 흰 배경이 투명화 안 됨을 확인 → 가장자리 연결 흰 픽셀만 플러드 필 투명화(검 본체 내부 하이라이트 보존)+여백 트리밍(46x48). 크기는 기존 .ric 규칙이 #overlay-result 한정이라 로비 버튼에서 48px 원본 크기 그대로 렌더된 것이 범어남 원인 → ui-v537 블록으로 #screen-title #btn-start .ric 14px·vertical-align -2px·margin 4px 고정. 아이콘 캐시 갱신 ?v=537. RUN_GATES:ALL_OK, 라이브 칩·sw v537 확인, 라이브 PNG 투명 픽셀 비율 재확인.

### v536 (2026-11-22)
- 배틀 시작 버튼 그래픽 수복: 사용자 캡처(v535 로비) 판독 — 배경·테마 칩·메뉴 정상, 버튼 첫 글자 앞 흰 블록 2개 관찰 → 인라인 SVG 크로스소드(17px stroke 2.6)의 기기별 렌더링 문제로 특정('틀 시작' 동일 폰트 정상 → 폰트 문제 아님). 마크업을 검증 PNG 아이콘 assets/ra_ic_swords.png(?v=536, .ric 클래스) 교체. RUN_GATES:ALL_OK, 라이브 칩·sw v536 확인.

### v535 (2026-11-22)
- 결과 화면 세부집계: 사용자 첨부 v511 참조 스크린샷의 항목·아이콘 그대로 복원 — 각 행 선두 이모지 아이콘(👑왕관 획득 🗡️유닛 킬 🏰잔존 타워 체력 ⏱️남은 시간 ⚔️킬/데스 ✨주문 사용 🥇최고 연승 🔥첫승 보너스 ⭐XP 획득 🎓SP 획득) + 킬/데스(rt-kd)·주문 사용(rt-spell) 행 추가(셋터는 기존 g1b:318-319 재사용, 집계원 S.kills/S.deaths/S.spells). 아이콘 스타일 ui-v535-det 블록(3-id 특이성).
- 수동관전 복귀: g11-camera state.manualIdle 도입 — setMode('manual')·pointerDown/Move·wheel·zoomBy 조작마다 리셋, update(dt)에서 무조작 3초 경과 시 setMode('auto') 자동 복귀(포인터 접촉 중 리셋 유지). 사용자 지시 "수동관전모드는 3초정도후 자동관전으로 변경".
- 과정: 첫 커밋(67ae871)에서 g11-camera 앵커 불일치로 카메라 로직·sw 범프 누락 → 보완 커밋에서 적용. CAMERA 게이트(camera_check.cjs)가 구 스펙 "수동 무기한 유지"로 실패 → 게이트 갱신: harness run()에 수동 모드 조작 리셋 규정 반영 + 신규 게이트 1.9(3초 무조작 자동 복귀·재진입 리셋 검증). CAMERA_CHECK:PASS gates=22 assertions=13007.
- RUN_GATES:ALL_OK, 라이브 칩·sw v535 확인(최종 커밋 기준).

# 로얄 아레나 인수인계 문서 (HANDOFF)
> 최종 갱신: 2026-11-21 — v518 배포 확정(라이브 칩 v518·sw v518). 아래 과거 버전별 기록은 당시 관측이다.

## 1. 현재 버전·배포 상태 (v508 미배포)
- 운영: https://erioweb-lab.github.io/Royal-Arena/royal-arena/ — 이번 직접 캡처의 칩은 v507. 도움말 확인 라벨이 안 보이는 기존 결함도 재확인했다.
- 저장소: github.com/erioweb-lab/Royal-Arena (main), 마지막 배포 기준 4800403. v508은 로컬 수정이며 커밋·푸시·운영 3중 검증을 하지 않았다.
- 배포 차단: 기존 balance_check 자폭 벌레 OUTLIER 및 거버넌스의 미로드 구 g1 파일 크기 초과. 통과하는 active_resources_check가 기존 실패 게이트를 대체하지 않는다.
- 인증 정보를 로그·문서·커밋에 넣지 않는다. 과거 인증 가능 여부 기록은 현재 권한을 증명하지 않으며, 실제 배포 직전에 허용된 연결로 확인한다.

## 2. 최근 사이클 요약 (v370~v380, 모두 라이브 실측 검증)
- **v370~371** 버튼 텍스처 유성우·불티 파티클 제거: 결정적 인페인트(산발 파티클·화염 꼬리, 프레임 보호영역 0px) → 구체 장식은 v371 생성형 재생성(1728×576 유지).
- **v373~374** 로비 메뉴 버튼 플랫화(문양·광택·발광 제거)+전 버튼 전환효과 제거: 강제기는 보존 대상(CTA·맵 칩·팝업 소형)만 다시 입히는 축소판 ui-v373-js로 유지 — 삭제 시 내장 리스타일러가 문양을 통째로 되돌림(v373 실증).
- **v376~377** 오디오 엔진 전면 재구축: 구 엔진(AC 즉시 생성+running 게이트 무시)이 기기 무음의 원인 — __RA_AUDIO 싱글턴(첫 제스처 지연 생성+언락 리스너 4종+마스터 게인→컴프레서)으로 교체. 음소거 해제 확인음 프로브(소리 버튼 클릭 시 deploy음) 포함. 사용자 기기 정상화 확인.
- **v378** 결과 세부 집계에 상단 통계 바 전항목 표현: 신규 행 5종(최고 연승·첫승 보너스·XP·SP·상단 통계 전체 미러 rt-mirror)+패널 스크롤 폴백. 미러는 ra-stats 전문 재표현이라 상단 바 항목 추가 시 자동 따라감.
- **v380** BGM 제거(bgmStart/Stop no-op 호환)+타격음 신시사이저 playHit(type,isCritical) 6속성(physical·flame·frost·lightning·cannon·boss)+크리티컬 레이어, 근접 12지점 유닛별 연결. 25ms 타입 스로틀.

## 3. 핵심 아키텍처 (훼손 금지 — 감사 게이트가 지켜본다)
- 오디오: 현재 로드 원천은 js/g1a-art-assets.js의 `__RA_AUDIO` 싱글턴 + playHit/sfx 이중 레이어다. js/g1-art-assets.js는 미로드 구 통합본이며 기존 balance_check가 읽는 입력이다. 발화 경로에 state 무시 게이트 재도입 금지(기기 영구 무음 재발 — v376 확정).
- 버튼 문양: 셸 블록(ui-v3xx)+강제기(ui-v373-js, 1.2s) 공존 구조 — 강제기 삭제만으로는 리스타일러 되돌림이 일어난다.
- 텍스처: assets/ra_btn_card.png(메뉴·무파티클)·ra_cta_card.png(CTA·불꽃 장식 의도 보존).

## 4. 검증 절차 (재발방지 게이트 — 배포 전 필수)
1. 컴파일: js 전 청크+qa-driver+sw를 /tmp 복사본으로 node --check(저장소 내 실행은 모듈 파싱 오탐 — v292).
2. 감사: audit.sh → AUDIT:OK(크기 예산·중복 정의·**오디오 마커 3종** — __RA_AUDIO·언락 리스너·ra_muted, 훼손 시 FAIL).
3. 오디오 게이트: self-check/scripts/audio_gate.py(신호 진폰>0.003·음소거 0·전투 발화·JS오류 0)+toggle_beep.py(확인음 프로브). 발화 관측만으로 통과 금지(v375 오판 교훈).
4. 렌더: qa=battle&quit=1 토큰 판독+360px 캡처(결과 모달 상태 검증은 showResult 직접 호출+가시성 폴링 — quit 모드는 모달 자동 닫힘).
5. 배포: 칩·sw 동시 범프 → 푸시 → Pages 전파 폴링(칩 문자열+신규 에셋 sha256 일치) → 라이브 동일 게이트 재실행.
6. 기록: changelog 버전 라인(실측 사실만)+qa-tokens 교훈+본 문서 갱신+gsk skills save.

## 5. 운영 판정 기록 (기기 보고 분류)
- "적이 스폰·공격 안 함": 비결함 — 적 첫 스폰은 배틀 시작 ~20초 후(엘릭서 충전 구조). 타이머 가동 여부가 루프 생존 판별 기준.
- "소리가 안 남": ①서버 청크 curl 직검증(엔진 마커) ②SW 혼합 캐시(기기 이중 새로고침) ③ra_muted 플래그 ④기기 출력 경로 — 확인음 프로브로 분류.
- 클라우드 캡처 한계: 이모지 네모(□) 렌더는 기기 정상(v233), 게이트 기하 실측이 1차 증거.

## 6. 미해결·다음 후보
- 근접 타격음은 절제된 볼륨 설계 — 사용자 체감 조정 요청 대비 볼륨 상수화 위치: g1 playHit 각 분기 g() 값.
- 텍스처 재생성분(구체 무화염)의 경계부 블렌딩은 판독 기반 확인 — 픽셀 동일성 아님(생성형 편집 한계 고지 유지).

### v380 (2026-11-09)
- 주문 이펙트 대개편: 유성우 파편 유성 4발 다발 발사(meteorbit)·플라즈마탄 발사(plasmabolt)+잔류 존 4.2초(plasmazone, 시각 전용)·눈보라 시드 랜덤 낙설
- 타워 재정가: 킹 2900/dmg84·프린세스 1600/dmg78(에픽 파워크리프 대비 — 산술 근거는 changelog v380)
- 신규 fx 종류: meteorbit·plasmabolt·plasmazone — 반경·시각은 CARDS.radius 추종(v342 표준 유지)
- 캡처 서비스가 게임 페이지 로드 반복 실패 시 표준 폴백: jsdom 페이지 스코프 로직 스모크(v292 체계)+라이브 ?qa=fx 토큰으로 종결, 시각 미검증은 명시

### v381 (2026-11-09)
- 라바 테마 엠버 제거(사용자 지시): 유닛 위로 떠오르는 붉은 점 = updateAmbient lava ember 장식 파티클 오인 → g1 lava 테마 amb만 null화(겨울 눈·황야 모래바람·심연 스파크 유지). 칩·sw v381.
- 검증: vm 컴파일 VM:OK · 라이브 3중(칩 v381·sw v381·g1 sha256 로컬=라이브 일치) · 라이브 QA 토큰 미검증 — 캡처 서비스 장애 3회 + jsdom 폴백 무토큰(부팅 환경 한계). v381은 데이터 리터럴 1줄 제거로 로직 불변(vm VM:OK·라이브 sha256 일치 확인), 시각 확인은 기기 새로고침 후.

### v382-정정 (2026-11-09)
- 와이드 아레나: canvas 비트맵 폭을 #arena 박스 비율로 startMatch 시 산출(VW) — object-fit contain 레터박스(좌우 검은 여백) 제거. 플레이 좌표계 18×32 불변, 좌우 밴드는 렌더 확장(-BAND..VW): 강·외벽·배치선·비네트 포함. 카메라 중심/역변환/팬 클램프/비네트 캐시 모두 VW 기반 갱신.
- 바닥 그래픽: 테마별 생성형 텍스처 5종(ground_classic/lava/ice/wasteland/abyss.png, seamless·top-down·no-shadow) 신규 적용 — 기존 FIELD/LAVA/ICE는 폴백.
- 다리 1~3 랜덤: startMatch마다 재배치(1개=중앙, 2개=±d, 3개=중앙±d, d=4.2~5.3) — BRIDGES let화, drawStatic startMatch 호출로 도로·다리 데코 자동 반영, 경로/AI는 실행시점 참조라 무수정 추종.
- 게이트: vm 컴파일·audit 실측 결과는 커밋 전 측정값으로 기입. 라이브 검증은 푸시 후 별도 보고.

### v382 (2026-11-09)
- g9-wide.js 신규 청크(GT_IM·__rollWide·resize) — g1은 VW/BAND/BRIDGES 선언+drawStatic 확장만. 파일 분할은 file-governance 예산 규정 준수.
- 교훈: audit.sh는 AUDIT:FAIL이어도 exit 0 — 파이프라인에선 반드시 출력 문자열 grep으로 게이트 강제(v324 가드 hang 폴백 계열). 커밋 메시지 게이트 문구는 실측 후에만 기입.

### v383 (2026-11-09)
- 기기 캡처(v382) 판독: 칩 v382·생성 질감·랜덤 다리 정상 확인, 좌우 여백 한쪽 5~7% 잔존 — startMatch 시점 1회 측상이 레이아웃 안정 전 값. __fitWide/__rollWide 분리+1.2s 주기 __wideCheck 자동 보정(다리 유지)으로 수복. 칩·sw v383.

### v384 (2026-11-09)
- 기기 v383 캡처 판독: 밴드가 텍스처가 아닌 남색 단색 — 근본 원인 2중 버그(메인 루프 bgc 합성 폭 W 고정 + drawStatic bgc 좌표 쉬프트 부재). 확장 렌더의 필수 쌍: ①합성 목적지(-BAND,0,VW,H) ②bgc 기준 변환(+BAND). v384 수복, 칩·sw v384.

### v385 (2026-11-09)
- 초원·용암 바닥 텍스처 재생성 교체(사용자 지시): classic=풀밭+들꽃·닳은 흙길, lava=현무암+크림슨 용암 균열. 768²·3조건 유지, 2×2 심 판독 통과 후 배포. ?v=385 캐시버스팅, 칩·sw v385.

### v386 (2026-11-09)
- 와이드 잔여 결함 수복: 월드 0..W 고정 드로어 전수 정리 — 외벽·경계선(핵심 결함, 화면 71% 수직 관통선)·강 물결·보스 HUD·clearRect. 규칙: 캔버스 스크린 공간 요소는 반드시 BAND..BAND+VW(캔버스 가장자리), 월드 요소는 0..W. 칩·sw v386.

### v387 (2026-11-09)
- W 고정 잔여 9건 수복(전수 스캔 분류표: 결함 4·경미 5·양호 30+) — 핵심: g2 drawFrame(외벽과 별개 전장 프레임이 월드 0..W 잔존)·tryDeploy 터치 역변환(레터박스 시절 공식 → 직접 스케일)·카메라 폴백 상수 2곳·포커스 복귀·추적 클램프. 캔버스 좌표 참조 추가 시 정규식 전수 스캔으로 감사.

### v388 (2026-11-09)
- 세계 중심 정렬 규약 확정: 카메라 중심=세계 중심 W/2(캔버스 중심 아님) — z=1에서 world→screen = world+BAND. 짝: bgc 합성 (0,0,VW,H)·클램프 세계 경계(vw≥W면 W/2 강제)·터치 역변환 cam 상대·비네트만 스크린 공간 VW/2. 좌표계 개편 시 "카메라 중심·합성 목적지·클램프 경계" 3종 세트 동시 점검.

### v389 (2026-11-09)
- bg 좌표계(월드+BAND)에서 캔버스 가장자리 bg-x는 0/VW — v386의 BAND 기준 세로 벽은 이중 오프셋(좌벽 필드 관통·우벽 잘림). 가로 벽만 BAND 시작(폭 VW). 측상: ResizeObserver+rAF 2프레임(startMatch 래퍼), 폴링·9:16 폴백 폐지. --fx는 비트맵 비율 실측.

### v390 (2026-11-10)
- bgc 좌표 최종 규약: setTransform +BAND 쉬프트 아래 래스터 가장자리=콘텐츠 -BAND/VW-BAND, 세계 0/W=콘텐츠 0/W(bg-x BAND/BAND+W). 좌우 세로 장식(돌테두리·WALL_IM)·2px 라인은 전자, 세계 요소(DECO·타워·다리·강 내용물)는 후자. 지면·가로 벽·틴트는 래스터 0..VW(콘텐츠 -BAND 시작).

### v391 (2026-11-10)
- 아레나 확장 최종 규약: 가로·세로 독립 풀핏(VW·VH·BAND·VBAND), 세로 석벽 삭제(개방형), 다리는 타워축(3.5/9/14.5)에서만 개수 랜덤 — 다리·도로·동선 불일치의 구조적 제거. 상한 VW≤H*2·VH≤W*3(타일 반올림 잔여 미세 레터백 허용).

### v391 실검증 (2026-11-10 04:42)
- 라이브 3중 통과(칩 v391·VBAND 토큰·g1 sha256 일치). 배틀 클라우드 캡처 3회 공백 — 서비스 한계 확정, 배틀 시각 확인은 기기 캡처 판독으로. 로비 walk 캡처의 TG 토큰·글리프 토후·배너 겹침은 캡처 환경 아티팩트로 분류(기기 실물 캡처에 부재). 검증 규약은 self-check 스킬에 반영 저장(sha 16350058).

### v392 (2026-11-10 — 현재)
- 레터박스 재발 원인은 TILE 반올림 slack("미세 허용"이 기기 가시 결함화) — 타일 스냅 폐지로 비트맵=박스. FIT 토큰(qa-driver, 편차% 표시)으로 이후 배포 게이트에 수치 기준(<=0.5%) 상시화. 교훈: 통과 게이트의 성격(동기화 vs 렌더)을 구분해 보고할 것.

### v393 (2026-11-10 — 현재)
- 지면 렌더 이중화: bgc(월드 공간 경유)와 별개로 render 스크린 공간에 베이스 단색+GT 커버 — bgc 좌표 결함·재도색 실패·캐시 혼합 어느 경우에도 배경(페이지색)이 노출되지 않는다. BGC 토큰으로 bg 실측 크기 상시 확인. 폴백 B(텍스처 삭제·단색 풀핏) 준비됨.

### v394 (2026-11-10 — 현재)
- 폴백 B 확정: 지면은 이미지 없는 단색 렌더(테마색·베일·틴트). GT 자산은 assets 보존(재도전 시 g9 GT_IM 복원+drawImage 2곳 재삽입). 이후에도 띠 보고 시 캔버스 밖(CSS·wrap·페이지 배경) 원인 — 판독 때 프레임 안/밖 구분 필수.

### v395 (2026-11-10 — 현재)
- v394 완성 복구 배포: drawStatic 전면 재작성(단색 풀핏·이미지 의존 0 — GT/GRASS/FIELD/LAVA/ICE 제거 유지)+qa-driver BGC 토큰 변수 수정(cv→c). 수정 커밋 2c70542에서 sw.js 캐시명 미범프 발견 — 기기 SW가 구 g1을 계속 서빙할 위험 → 칩·sw v395 재범프(77acce8, PUSH:REAL_OK).
- 라이브 3중: 칩 v395·g1 마커·g1 sha256(파일 기반) 일치. 참고: 명령 치환 $(curl)은 후행 개행을 잘라 sha가 어긋남(측정 아티팩트).
- 캡처: 캡처 3회 실패 — 기기 확인이 정식 결론

### v396 (2026-11-10 — 현재)
- 텍스처 지면 복원: 신규 생성 5종(1024², gpt-image-2 — 스킬 3대 조건·2×2 십자부 원본해상도 이음새 검증 5/5 통과)을 assets/ground_*.png에 적용. g9 GT_IM 로딩 복원(?v=396)+drawStatic GT 드로어(typeof 가드·단색 폴백)+render 스크린 커버(__bg2) 재삽입 — v393 구조 그대로 복원, 베일 알파 무튜닝(v393==v394 0.50/0.56/0.54 실확인). 칩·sw v396.
- 캡처: 캡처 3회 실패 — 기기 확인이 정식 결론 
- 판독: 없음

### v397 (2026-11-10 — 현재)
- 기기 v396 캡처(사용자) 판독: 지면 텍스처 복원 확인 + 좌측 폭 ~15% 단색 올리브 띠(가로 그라데이션) 잔존. 원인 추적: 텍스처 가장자리 드리프트 무죄(수치 1.7~8.5 균등), CSS 올리브 요소 부재, BAND≥0 코드 보장 — 유일 실증 회귀는 v394의 이미지 onload 훅 제거(GT 늦로딩 시 bgc 재도색 없음). v397: GT 훅 복원(src 설정 전 부착)+?v=397 재버스팅+칩·sw v397.
- 캡처 서비스: gh-pages·샌드박스 공개 URL 모두 ?qa=battle 3회 실패 — 서비스 한계 재확인. 기기에서 배틀 재진입 시 QA 토큰(BGC/FIT) 확인이 다음 판정 기준.

### v398 (2026-11-10 — 현재)
- 기기 v397 캡처 판독: 띠 지속(좌측 ~12-13%·전고·곧은 경계·밝은 올리브). 띠 폭=BAND(월드 좌 마진) 일치 + 우측엔 대칭 띠 없음 + 신규 GT는 마진까지 풀드로어 → 종합: 월드 영역에 구 필드 아트(img_066 계열)를 별도 드로어가 덮어쓰고 있었을 가능성. v398: 구 아트 드로어 전수 제거(drawImage FIELD/GRASS/LAVA/ICE_IM) + GT ?v=398 + 칩·sw v398. 검증: 칩·drawer=0·sha.
- 기기 재확인 요청마다 QA 토큰 배너(진입 직후 수 초) 캡처 병행 요청 — BGC/FIT 실측 확보.

### v399 (2026-11-10 — 현재)
- 띠 근본 원인 확정(기기 캡처 픽셀 계측): 스프라이트 실측 306/539/772 = (wx+BAND)×스케일 예측과 일치, 석베이스 실측 ~501/925 = 베이스가 스프라이트+BAND(466/932 예측) — bgc 합성 dest (0,0)이 내부 +BAND 쉬프트를 상쇄하지 않아 지면 레이어가 +BAND 우편위, 화면 0..BAND에 무베일 언더레이어 노출(밝은 올리브 띠·직선 경계·폭≈BAND). v392 VW 공식 변경(H·asp)으로 BAND 확대되며 v393부터 가시화 — 띠 보고 타임라인과 일치.
- v399 수정: drawImage(bgc,-BAND,0,VW,VH) — 쉬프트 상쇄로 지면 정렬+띠 동시 수복. 칩·sw v399. GT ?v는 398 유지(자산 무변경).

### v399 검증 완료 (2026-11-10 10:35)
- 헤드리스 브라우저(playwright chromium+로컬 http 서버) 배틀 로드 성공 — 캡처 서비스 한계의 실질 우회 경로 확보. QA 토큰: BATTLE:OK BGC:1842x2176 FIT:0.00% ERR:0 W:0 OVF:0 TIME:ok ENEMYD:diff, 칩 v399. 픽셀 스캔: 좌측 평탄 띠 0.5%(소멸 — BAND=154.5 환경에서도 -BAND 합성 수정 유효 확인). 지면 텍스처 금프레임까지 균일. 좌측 띠 결함 종결.

### v400 (2026-11-10 — 현재)
- 승리 화면 수복(사용자 지시 "승리화면위에 내용이 아래에 표시"+홈 버튼): ①종합 통계 바(#ra-stats)는 결과 오버레이 열림 시 CSS(#screen-battle.ended + body:has)로 숨기고 카드 내 미러 행(#rt-mirror, index.html:1260 — g1 미러 인터벌 g1:1054)이 아래에 표시. 재시작 시 .ended 해제(g1:2502)로 자동 복원. ②버튼(#btn-again·#btn-home, index.html:1268~1269)은 마크업·클릭 로직이 원래 존재 — 카드 높이 넘침으로 시야 밀림이 원인 → r-box 스크롤(max-height 86dvh)+#r-actions 스티키 하단 고정.
- 헤드리스 검증(390×760): 강제 승리(showResult) 후 bar display:none·overlay 열림·home(199,650,152×40)/again(43,656,144×34) 가시·미러 채움·btn-home 클릭→타이틀 복귀 전부 확인. 승리 보상 모달(왕실 세금관 류)이 카드 위에 뜨는 건 정상 보상 흐름. 커밋 cd4b345, PUSH:REAL_OK — gh-pages 전파 지속 중(기기 반영은 전파 후 새로고침).

### v401 (2026-11-10 — 현재)
- 승리 화면 유지 수복: ①인런 렐릭 이벤트 모달(#overlay-event z120)을 결과 카드 표시 중 생성 보류(카드 닫힌 뒤 타이틀 표시) — 승리 화면 가림 제거(v400 헤드리스 판독에서 보상 모달이 카드 대부분을 가리던 것) ②SW 회복 go() 자동 리로드에 결과 표시 중 보류 가드(10초 재시도) — 자동 화면 이탈 차단. ?auto·?result= 쿼리는 디버그 전용 확인(일반 플레이 개입 없음). 칩·sw v401, 커밋 ad9887b PUSH:REAL_OK.
- 헤드리스 검증(?result=blue 강제): T0 오버레이 열림·이벤트 모달 부재·버튼 2종 가시 → T30 30초 경과 후에도 결과 유지·타이틀 미전환·모달 부재(자동 전환 0) → 홈 클릭 타이틀 복귀. 승리화면 정리 결함 종결. 스킬(victory-ui-prompt v2·SKILL §9 갱신) 동기 저장.
- 정정(v401 기록): 최초 ?result=blue 부트 경로 검증은 showResult 조기 실패(RART 미로딩)로 무효 — 강제 showResult 방식(v400 패턴) 재검증 결과로 대체. T0/T30/HOME 실측은 위 실행 로그 기준.
- v401 재검증(실제 종료 흐름: 왕관 격차+타이머 만료 → finish 자연 발화): 결과는 위 실행 로그(T0/T30/HOME) 기준으로 정정 — ?result=blue 부트 경로와 강제 showResult 합성 방식은 리소스 타이밍·게임 루프 간섭으로 무효 판정.

### v402 (2026-11-10 — 현재)
- 보스 후 적 스폰 정지 수복+적 엘릭서 난이도 레벨링: 원인 확정 — regenElixir(g1:1109)·aiTick 호출(g1:1153)·playCard(g1:1253) 어디에도 보스 가드 부재(코드상 강제 정지 원인 없음). 헤드리스 실측: 보스 alive 30초간 red 스폰 3건 지속(보스 유지) — 기기 체감 '스폰 정지'는 엘릭서 만원 구간에서 aiTick 확률 분기(1243행 55% 게이트)가 안 뜨는 구간으로 판정 → v402 안전망: 보스 alive+엘릭서 만접(≥ELX_MAX-1) 시 aiTick 말미 강제 배치(다리 지점).
- aelix 레벨링: __raDIFF에 aelix[1,1.12,1.28] 확장(단일 진실원)·__raAel() 헬퍼·충전식 곱(rate×0.95×__raAel()×…)·난이도 토스트에 '충전×' 노출. 순수 충전 실측(aiTick 무효화·엘릭서 2 시작으로 ELX_MAX 캡 회피): 보통/악몽/지옥 perSec = 1.108 1.274 0.3343 0.3703 0.4258 기대비 1:1.12:1.28 (1차 측정 지옥 ratio 0.867은 만원 도달로 Δ 잘림 — 측정 아티팩트, 캡 회피 재측정으로 해소).
- 커밋 166c6d8 PUSH:REAL_OK·vm·audit 통과. 스킬: balance-map에 spawn-audit-prompt.md 신설+트리거('스폰 정리' 등) 연결 저장.

### v403 (2026-11-10 — 현재)
- 적 첫 스폰 대기 단축(사용자 지시 20→5초): 원인=개전 aiTick이 위협·클러스터 0이라 엘릭서 게이트(≥6·55% / ≥9 선제푸시) 재시도 대기 — 기대 7~9초·최악 ~20초. 수복: startBattle A.timer=5·A._opened=0 + aiTick 첫 틱 코스트≤5 확정 첫 배치(다리 지점). 헤드리스 실측 firstRedSec=위 로그. 칩·sw v403.

### v404 (2026-11-10 — 현재)
- 지면 이펙트 가림 수복(사용자 지시): 눈보라(snowzone)·유성우(crater)·맹독·플라즈마·잔열 지면 존을 유닛 루프 아래로 — ZK Set 필터 2줄(bgc 합성 후 지면 패스 신설·상층 패스 제외). 존 화풍(v327/328/342/380 규격)·틱 데미지 무변경. ETEST(fx 존 존재)+틱 회귀(slowT/burnT·착탄 피해)+캡처 판독(유닛·타워 가림 0) 통과 — 결과는 위 실행 로그. 스킬: art-pipeline에 zone-fx-prompt.md 신설+트리거 연결.

## v405 (2026-11-10) — 스플래시 비행 필터
- 스플래시 감사 표준 신설: royal-arena-balance-map 스킬 references/splash-damage-prompt.md(모드 A 현황/B 기계 단언/C 조정안) — "스플래시 데미지/광역 데미지" 트리거와 연결. 32종 감사에서 광역 컨셉 누락 0건.
- P1 수복: 대공 불가 공격자의 탄환·근접 스플래시·둔화 전파가 공중 유닛 무피해로 수정(shoot hitsAir 적재, 3루프 필터). 칩·sw v405, 푸시 cde7fd9.
- 검증 게이트: vm COMPILE:OK · balance_check outliers=0 · 헤드리스 통제 추적(직격 100·스플래시 60·공중 0) · QA ERR:0 OVF:0 BATTLE:OK · 헤드리스 캡처 360x780 정상 렌더.

## v406 (2026-11-10) — 플라즈마 발사 빔+AOE 감사 표준
- 플라즈마: 킹타워→목표 빔 스프라이트(drawFx 'beam' 분기, 진행도 신축+폴백 그라디언트) — castPlasma가 fx.push beam(x0,y0=킹타워,T=비행시간). 스프라이트 assets/ra_fx_plasma_beam.png(244x1360, 키잉 완료).
- 지면 존 틱 진실원: snowzone=둔화 전용(피해 없음, 규격 일치)·burnzone=0.5s마다 burn 재적용·plasmazone/crater=시각 전용·venom=유닛 측 venT DoT. 상세는 balance-map 스킬 aoe-zone-audit-prompt.md.

## v407 (2026-11-10) — 지속 존 틱 데미지 전면화
- updateFx: snowzone 냉기 틱(10dps·slow 병행)·plasmazone(8dps)·crater(6dps) 0.5s 틱 추가 — spellDmg(유닛만·fromSpell). crater push(fireball r1.4·meteor r=radius)에 team 보강. 잔열·중독은 기존 경로.
- 총데미지 맵 표준: balance-map 스킬 total-damage-elixir-map-prompt.md — 총데미지(즉발+DoT+틱)로 원가치 정가, v407 스냅샷 포함.

## v408 (2026-11-10) — 번개 리워드(1안) 완료
- stormzone: castZap push(dur 3.5·r=radius·team) → updateFx 틱(6dps+진입 1회 미니기절 0.3s·_stormId) → drawFx(원판+지그재그, ZK 하층). 코스트 3·desc 갱신. 설계·가치표는 balance-map 스킬 storm-rework-prompt.md.

## v409 (2026-11-10) — 주문 리워드 3종 완료
- healzone(dur3·r=radius·team·틱힐 10dps) 신설+castHealWind 통합 / castShock 넉백 0.8(방사형·클램프) / venomzone 틱 재부여(venT 갱신). ZK에 healzone 추가.
- 넉백 시험은 시전점을 유닛 중심에서 0.5 오프셋해야 방사 방향 확보(중심 시전은 __kd>0.01 제외). 상세는 storm-rework-prompt 로드맵 완료 섹션.


## v410 (2026-11-10) — 덱 10장+DPS 표기
- 덱 빌더(g1 ~380-405): 상한 10·저장 !==10·헤더 평균 DPS·공통 카드 렌더러 DPS/즉발/힐 행. 신규 카드 확장은 art-pipeline card-expansion-prompt 파이프라인. 허위 기록 2회(9fbd614·3db76ae) 정정 이력 포함.


## v411 (2026-11-10) — 신규 카드 4종
- netter(둔화 원거리)·buzzer(hitTarget 훅 자폭)·batqueen(updateUnit 소환 훅 _bat 마커)·catapult(건물). 그래픽 13종(카드4+스프라이트9) 등록 완료. g1 268KB 예산 초과 — 분할 검토 필요.


## v412 (2026-11-10) — 모달 닫기 스티키
- #overlay-info #btn-info-close sticky bottom(safe-area) — 기기에서 모달 하단 잘림 수복. 엔딩 잘림 보고는 기기 v399 구버전(전파)으로 판별 — 칩 최우선 원칙. 프롬프트: screen-audit modal-clip-fix-prompt.md.


## v413 (2026-11-10) — 서브리소스 캐시버스팅
- 코어 script 태그 전부 ?v=<버전> — 혼합 캐시(index 신규+g1 구버전) 근본 수복. 이후 배포는 칩+sw+?v= 3종 세트. 프롬프트: self-check subresource-stale-fix-prompt.md.


## v414 (2026-11-11) — 잔여 8리밋·에셋 캐시 수복
- 신규 에셋 13종 sw CORE 등록+URL ?v= 버스팅, 덱 잔여 8리밋 5곳 10장화(initDeck·편집기 기본·랜덤 버튼). 배포 3종 세트(칩+sw+?v=) 준수. 카드 UI 표기 표준·아이디어 감사 프롬프트는 art-pipeline 스킬.


## v414 종단 확정 (2026-11-11 제2차)
- 덱 10장 복원 종단 확정: UI 규약(DECK_SLOTS[slot]·active=String(slot), 0=슬롯1) 시딩으로 슬롯 1·2 각 10장 저장→리로드→복원 통과. 전 커밋(9d7254c)의 "종단 통과" 표기는 규약 불일치 시딩 오타음 — 본 기록으로 정정. loadDeckSlot 8~10 수용이 근본 수복.
- 남음: 기기 강제갱신 후 신규 4종 아트 로드·10장 덱 저장/복원 사용자 확인. g1 ~269KB 분할 검토는 후속 과제.
## v415·v416 (2026-11-11, 미완 포함)
- 완료: 덱 편집기 전투 덱 10장 2행 5열 고정(.dkw grid repeat(5,minmax(0,1fr))) — 로컬+라이브 실측 통과, v415 배포.
- 미완(다음 세션 1순위): 편집기 버튼 텍스처(gold/navy)·padding-bottom 46px — 3중 시도 모두 계산 스타일 미적용(saveBG=false·ovPadB=12px). 의심: 편집기를 실제로 렌더하는 모듈이 g1이 아닐 가능성(g9-wide 등 이중 렌더러) — `grep -n "deck-edit" js/*.js` 전수 후 실제 렌더러에 패치. 기기 캡처가 판정자.
- 프롬프트: art-pipeline/references/deck-editor-layout-prompt.md(2×5 그리드·버튼 텍스처·깔끔함 표준).
## v417·기록 보강 (2026-11-11)
- v417: 메인 버튼 텍스처(CTA plaque·HOF gold)는 ui-v417-js **inline setProperty important+1.2s interval+클릭 위임**이 최종 해법 — CSS 블록만으로는 기존 ui-v4xx 규칙에 배경이 눌리고(테두리는 적용되는 부분 적용 실증), 스킨 1회 실행은 늦게 생성되는 버튼을 놓친다. 난이도 버튼 __raDIFF.col 색 스킨·사운드 .off 상태 동일 스크립트.
- 기록 보강(누락분): ①v414b — 신규 4종 카드 JPG v411 때 원천 미커밋 확인→재생성·투입(a5f338a). CDN "Error 503 Maximum threads/Varnish"는 GitHub Pages 일시 과부하로 게임 결함 아님. ②프롬프트 참조: self-check/live-url-verify-prompt, art-pipeline/{deck-editor-layout·main-buttons-design·map-boss-design}-prompt, dev-pipeline/hof-profile-link-prompt — 연결·save 완료. ③덱 편집기 버튼 텍스처 미해결(v416 기록) — v417 해법(inline important+interval)을 그대로 적용하면 된다. ④btn-hof는 동적 생성 — id 스코프.
## v418·v419 (2026-11-11)
- 2번 완료: 프로필 이름 편집기(`ra_prof_name`)+`__raProfName` 이중 배열 버그 수복 — HOF 스냅샷·포디엄 연동 확정(포디엄 '1위 테스트지휘관' 실측). 3번 완료: `__raMAPS` 5맵(mult 1~1.32, __raDiffHp와 곱셈)·지도 버튼(해금 게이트 ra_map_clear_v1)·맵별 보스 스프라이트 5종(마젠타 키잉 게이트 통과)·스폰 교체(SPR.boss·S.__bossName)·파멸기 맵별 존 효과.
- 후속: 보스 HUD 라벨에 S.__bossName 표기 연결, 파멸기 효과 기기 실측(보스 웨이브 도달), 덱 편집기 버튼 텍스처(v416 미해결 — inline important 해법 적용), g1 분할 검토.
## v420 (2026-11-11)
- 메인 버튼 깜빡임 수복: setInterval 주기 스타일 재적용이 원인 — dataset 가드+MutationObserver 1회성 적용이 표준(v420-js). 전 버튼(훈련캠프/덱편성/덱1·2/유물/프로필/전술연구소/난이도/지도) 소재 배정표·생성 레시피는 art-pipeline/references/main-buttons-design-prompt.md — 후속 구현 시 이 프롬프트 그대로 사용. 네비 버튼은 id 없는 텍스트 라벨 매칭(g1:2609 ui-nav 분류 참조).
## v421 (2026-11-11)
- 타이틀 버튼 텍스처 적용의 최종 표준: ui-v421-js rAF 손실 복원 루프(손실 시에만 setProperty important). 깜빡임(주기 재적용)·소실(1회 적용) 모두 해결 — 이후 전 버튼 그래픽 구현(art-pipeline/references/main-buttons-design-prompt.md 소재 배정표)도 이 루프에 항목을 추가하는 방식으로.
## v423 (2026-11-11)
- 전 버튼 그래픽 최종: ui-v423-js 라벨 매칭 맵 + rAF 라운드로빈 손실 복원(프레임당 4개 — 패처 250ms 대비 우위). 신규 버튼은 MAP 배열에 [라벨,텍스처,size] 추가. 텍스처: camp/decked/shield(편집기 슬롯 cover)/relic/crown/tactics/diff/map + gold(HOF)/cta_plaque(시작).
## v426 (2026-11-11)
- 버튼 텍스처 최종 아키텍처: ui-v426-js **렌더 전 관찰자**(스타일 변경 마이크로태스크 덧칠 — 게임 리스타일러와 공존, 깜빡임 원리적 0) + v425-css 정적 important(보조). **타이틀 화면 검증은 qa 파라미터 없이 재현 필수** — qa 모드는 타이틀 리스타일러가 빠져 기기와 달랐다.
## v427 (2026-11-11)
- 프로필 이름의 진실원 계층: ra_prof_name(수동) → ra_profiles_v1.active(지휘관 시스템 — 기존 UI: 이름 변경/사용 중/삭제/생성) → '지휘관' — __raProfName이 통합 게터. v418 ra-name-edit 중복 제거됨. 훈련 캠프 버튼은 #ra-btn-camp id 태깅+정적 규칙. 통계 박스 min(94%,560px). 프롬프트: dev-pipeline/references/profile-review-prompt.md.
- (v427 완결 보강) 프로필 화면: 통계 박스 확폭 확인, 기존 지휘관 시스템 단일화 확인 — 전 항목 로컬+라이브 실측.
- (v428) 캠프 텍스처는 #trophy-chip(일반 버튼 아님)에 적용 — 스캔 셀렉터에 #title-actions 포함됨. 프로필 숨김 스트립 중복 생성 가드 수복(data-ra-pstats). 프로필 확폭 실효 값은 .rpanel 560px.
- (v429) 보스 HUD = HP/실드/파멸기 + 보스명 라벨(.bh-name, S.__bossName — 맵별 상이). 덱 편집기 저장=금 문양·랜덤/닫기=네이비 문양(정적 규칙 ui-v429).
- (v429 후기록) 파멸기 존 실측 완료(burnzone 확인). 남음: g1 분할(착수 시), 장기 기기 확인.
- (v431) 맵 선택 진입점은 상단 테마 행 단일(ui-v431-js: 캡처 게이트+ra_map_v1 동기화+잠금 배지+sel 하이라이트 인라인 강제). 테마 행 표시 순서와 __raMAPS 사다리 순서는 다르다(이름 매칭). 악몽 해금=보통 토벌+전맵(ra_map_clear_v1>=4). 난이도 텍스처 3종은 ui-v431-js 관찰자가 ra_diff_v1 추적.
- (v432) 난이도 UI=#diff-row(.ra-dbtn 3개 — 해금: 악몽=clear>=0+맵전토벌, 지옥=clear>=1; clear는 '마지막 토벌 난이도 idx', 파싱은 isNaN 가드). 프로필 칩=#ra-prof-chip. 게임 방법=#btn-how(문양 인라인+CSS 병용). #btn-diff·#trophy-chip은 인라인 important 숨김. 재배치 스캔=ui-v432-js(900ms).
- (v433) 프로필 칩 위치=.theme-row 다음 형제(전폭 바). 게임 방법 문양=CSS 규칙+관찰자 마이크로태스크 재도포(paintHow — 계산값 게이트, __raObs 플래그). 깜빡임 재발 시 진단법: MutationObserver 변이 카운트+150ms 배경 샘플링.
- (v434) 맵 9종 — 사다리: 로얄1.00/서리1.08/용암1.16/황야1.24/심연1.32/천공1.40/묘지1.42/신전1.44/신계1.48. 해금 상한=min(8), 악몽=mclear()>=8, __raMapIdx 클램프=length-1(동적). 신규 테마 페인트 폴백=자매 팔레트(sky→ice·tomb→abyss·dusk→lava·divine→classic, g1c 클릭 핸들러). 보스 스프라이트 sky/tomb/dusk/divine(키잉 완료). 맵×난이도 매핑 규약=map-ladder-mapping-prompt.
- (v435) 보너스 체인 전면 연결 완료: 공격=lava·dusk(유닛 cc.dmg ×1.02, g1a 스폰)·XP=wasteland·divine(g1b 승리 __tb)·체력=ice·sky(g1a)·이벤트=abyss·tomb(g1a:488). 8테마 모두 실효과(classic 제외). 아레나 커스텀 스킨·신계 난이도 해금 조건은 사용자 결정으로 유지(폴백·순차 토벌).
- (v436) 타이틀 지도버튼: 프레임=border-image-slice 44(fill 없음 — 내부 투명해 배경 아트 비침), 맵 아트=data-theme 선택자 CSS(재생성 스캔 대응, 인라인 금지), 칩=#trophy-chip+ra_btn_camp_new. 에셋 11종 sw.js CORE 등록. 구현 프롬프트=dev-pipeline/references/map-button-restyle-prompt.md.
- (v437) 지도버튼 그래픽의 진실원: ui-v373-js의 CM 맵+setProperty 블록(1.2s 재적용) — 버튼 외관 변경은 반드시 여기 원천 패치. 스타일시트 오버라이드 신설은 인라인 !important에 지므로 금지. 신규 테마 버튼 배경=ra_map_<theme>.png(9종 전부).
- (v438) 타이틀 밀도: 캠프 그래픽(#ra-prof-chip — v429부터 #trophy-chip은 display:none, 스타일 넣어도 무효)·지도버튼 42px 지정(실측 44)·#title-actions grid(gap 6px) 행 margin 0+6행 44px 통일(덱↔덱편성 간극 포함)·#diff-row(주의: id — 클래스 아님) 첫 화면 노출. #btn-diff는 구 진입 버튼(display:none 유지, 제외). 수용기준=#diff-row bottom<innerHeight(360×800) 게이트화(probe438.py).
- (v439b) 초단형(≤600px) 보정: 1차 압축에서 360×600 난이도 하단 612>600(12px 초과, probe439가 잡음) → 헤더 48·지도버튼 34px·액션행 36px·gap 2px·CTA 38·칩 34·diff 30px로 추가 압축. 압축 수치는 예산 계산 후 실측 확정 — 계산만 믿고 커밋 금지.
- (v440) 뷰포트 기준=600px 단일화(사용자 지시): 2단 압축(700/600) 폐지, 600px 기준 딥 압축(지도버튼 34px·액션행 36px·gap 2px·CTA 38px·칩 34px·헤더 48px)을 max-height:700px 전체에 적용. 수용기준=360×600(probe439 3점 실측 유지). 700px 초과 기기는 v438 레이아웃.
- (v441) 뷰포트 기준=550px(사용자 지시): ≤700px 압축 완성 — t-btn max-height 30 클램프(문서 중부 max-width:520px 블록이 height 40 재지정, CSS height만으론 무시됨)·theme-row gap 2px·액션행 33px·CTA 34px·칩 30px·diff 25px. 수용기준 360×550 — 실측 프로필 517·난이도 545(<550). 명예의전당↔프로필 교환=명시적 grid order(profile 5·hof 6) — 부분 order(-1/1)는 grid 전체 재배치 유발 금지.
- (v442) 지도버튼 프레임 6px(slice 44·border-image-width 6px) — 12px이 30px 버튼 세로 80% 잠식(아트 노출 ~6px) 수복(~18px). 높이 30px 통일 — .sel 구 규칙은 이중 클래스+요소 결합(sel.sel) 특이도 클램프로 차단. 원천 3곳(ui-v373-js 세터·칩 CSS 9종·69행). probe442.py(offsetHeight 기준 — bounding rect는 transform·소수 반올림 인공물 포함).
- (v443) 덱1/덱2 ↔ 메뉴 행 간극 등폭 확정: 점유자=#deck-desc(설명 14px)+btn-how 음수 마진(-6px). 최종=#deck-desc margin 2px 0(상쇄 후 실측 간격 6/6 등폭)+line-height 14 고정+btn-how·btn-deck mt 0+#title-actions mt 0. probe443.py(g1·g2===6px, 550·800). 프롬프트=references/deck-pick-gap-prompt.md — 'margin 6px를 넣으면 6px 간격'이 아니다(상쇄·베이스라인 여백으로 실측 10px) — 반드시 실측 보정.
- (v444) 유닛 미표시(기기) 수복: sw.js CORE에 유닛 스프라이트 75종 누락 확인 — 캐시 전용 기기에서 sprOK 가드가 유닛 드로우를 건너뜀(타워·HP바·카드는 CORE 분이라 정상 — 증상 일치). 수복=누락 전량 CORE 등록+CACHE v444. 진단 경로: 로컬 qa 전투 재현(정상) → 스프라이트 naturalWidth 정상 → CORE 자산 감사로 누락 확정. 신규 에셋 추가 시 반드시 CORE 등록 검사(references/assets-75-missing 사례).
- (v445) img_ 카드아트 248종(13MB) SW CORE 선캐시 등록 — 자산 감사 2차 완료, js 참조 자산 커버 100%. 카드 아트 벡터 폴백이 캐시 전용 기기에서 노출되던 사고 차단.
- (v446) 생성형 그래픽 일괄 적용: buzzer 공격프레임 신규(기존 atk 부재 해소), batqueen·netter atk2/3 3단 시퀀스, 보스 테마별 공격프레임 12장(sky/tomb/divine/abyss ×atk1-3) FRAMES 등록, divine·tomb 보스 idle 재생성(노이즈 해소). 파이프라인: gpt-image-2(-i 레퍼런스)→fal-bria-rmbg→알파검증(투명 15~95%)→512px. 보스 테마별 런타임 스왑은 ART_FRAMES Image 백업 감지 시에만 적용(스킵 시 데이터만 등록 — 후속 코드 작업).
- (v447) 잠금 완전화: ①무상태 타깃 캡처토퍼 — 리스너는 1회 부착, 클릭 시점에 dataset.locked를 읽아 차단(잠금→해금 전이에도 정상, 스티키 리스너 버그 회피) ②v360 hover 갭 오버라이드 ③data-locked·aria-disabled 진실화 ④.sel 강제 탈거 ⑤잠긴 난이도 ra_diff_v1 자동 복귀. probe447 교훈: (a)상태 유지 리스너는 해금 전이를 망가뜨린다 — 클릭 시점 판정형으로 (b)900ms 갱신 인터벌 UI의 프로브 검증은 대기≥1.2s (c)노드 참조는 stale 위험 — live 재질의.
- (v448) 수수께끼 상인 이벤트 팝업 제거(사용자 지시) — g1:483·g1a:483의 이벤트 배열 엔트리 삭제. 첫 접속/전투 중 팝업이 더 이상 발생하지 않음. 나머지 이벤트 풀은 유지.
- (v449) SW 점진 캐싱 수복(구조 결함 제거): install addAll(CORE 전량 81MB)은 자산 1개 실패 시 install reject → 기기 구버전 갇힘(v446 전파 지연·기기 미갱신·상인 팝업 재발의 근원). 수복: ①셸(index.html·js 12종·아이콘 ~2MB)만 allSettled 선캐시 ②assets 300종 activate 후 백그라운드 allSettled 프리페치(절대 reject 없음) ③activate 즉시 clients.claim→구캐시 삭제 ④fetch SWR이 개별 실패 자산 자동 재충전 ⑤register updateViaCache:'none'(Pages sw.js max-age=600 우회). 주의: 크래시 복구 루프(v411)가 캐시 전체 삭제+SW unregister — SWR 구조와 상충 없음(재접속 시 재충전). 기기 전파 예상: 리셋 1~2회. probe449: SW 제어권·셸 캐시·버전칩.
- (v450) 잠금 표시 완전화: 사용자 스크린샷(v449 판독) — 맵 잠금은 흑백만 적용되고 🔒 배지가 없어 잠금 인지 불가, 지옥이 악몽 잠금과 무관하게 열린 비단조 사다리가 오류로 보임. 수복: ①맵 버튼 ::after 🔒 배지(의사요소 — 게임 재렌더에 생존) ②지옥 해금 조건에 전맵 토벌(mclear>=8) 추가 — 악몽 해금 전제 단조 사다리(기존 세이브에서 지옥 재잠깐 가능 — 의도된 설계 변경). probe447 확장: 배지 computed ::after·hellLocked.
- (v451) 지도 순차 해금 수복: 근원 = 테마 행 표시 순서[클래식,용암,서리,황야…] ≠ 내부 배열 순서[클래식,서리,용암…] — 해금 판정이 배열 인덱스 기준이라 클래식 클리어에 서리 왕국이 먼저 열렸음(사용자 제보 실측 확정). 수복: v431 클릭 게이트·스캐너+v447 스캐너를 DOM 표시 순서 기준 판정으로 교체('앞 맵 클리어 직후 다음 1개' 해금). 흑백 3중 가드: pointer-events:none(터치 호버 원천 차단)+인라인 filter 강제(스캔 복원)+CSS 오버라이드. v451b 수복: v451 패치가 스캐너 루프의 i3 선언을 지우고 참조를 남겨 ReferenceError→스캔 매 주기 중단(data-locked 전부 미설정) — selIdx=k로 수복. 교훈: 루프 변수 교체 시 루프 전체 참조 스캔 필수, 인라인 스크립트 vm 구문검사를 게이트로. probe451: clear -1/0/1 3단계 시나리오+filter 유지+선택 차단.- (v452) 전면 교체 전 샌드박스: 타이틀에 연습게임 테스트 버튼 신설 — 신규 그래픽(황혼 비전: 룬 타일 바닥·타워 4종·유닛 idle/atk·탄환 8종 ra_test_*)을 미니 캔버스 데모로 미리보기. 전투 코드 무변경, 절대배치 버튼(프로브 단정 보호). 생성 파이프라인 확립: gpt-image-2(-i 아레나 앵커)→fal-bria-rmbg(쿼리 인자 필수, -o 절대경로 필수)→알파검증→다운스케일.
- (v453) 연습게임 버튼 좌하단 배치가 난이도 행과 겹침(사용자 캡처 실측) → 우상단(top 6·right 8) 소형(높이 26px·폭 자동 53px·10px) 이동. 지도버튼(30~38px)보다 작음. zoom-chip·verchip과 대각 분리. 겹침 판정은 rect 오버랩 숫자로(ovl_* 전부 false).
- (v454) 연습게임 배경을 사용자 캡처 크롭 아트(ra_practice_arena.png 360×520)로 교체 — 게임방식(유닛 이동·프레임 스왑·탄환)은 그대로. 3연속 사고 기록: ①ra_practice_arena.jpg SW ASSETS 미등록(폴백 합성 전장이 그려짐) ②프리로드 키 'ra_practice_arena_png' → src 'assets/ra_practice_arena_png.png' 404 ③drawImage 키 잔존 참조(sed 치환 누락 — 같은 문자열이 2곳). 수복=키 단일화+PNG 전환+ASSETS 9종 등록. **검증법 확립: 캔버스 toDataURL 덤프→원본 6×6 그리드 픽셀 대조(36/36=ARENA_DRAWN)** — understand_images 육안 판독은 폴백과 실제를 구분 못 하는 사례 2회. 진실원: 프리로드 키·드로우 키·파일명 3자 일치.
- (v455) 신규 4종 이모지 폴백 수복: 사용자 전투 캡처(v454) — buzzer(자폭 벌레)가 🛡️ 스프라이트 대신 🐛 이모지로 렌더. 근원 = buzzer·netter·batqueen·catapult가 ART_SPR 어디에도 없음(ART_SPR 본래 10종+ART_SPR_NEW 14종뿐) → SPR 맵 부재 → sprOK=false → 이모지 폴백. ART_CORE의 __ac는 '이미 존재하는 SPR'의 __valid 검증만 하고 등록하지 않음(구조 함정). 수복 = g2-sprite-assets.js 로드 직후 인라인 스크립트로 FRAMES idle을 SPR에 등록. **배치 3회 실패 기록: g1a(135행)·g1b 선두는 SPR 정의(g2, 1539행)보다 앞서 'SPR is not defined'** — 전역 참조 순서는 스크립트 태그 순서가 진실. probe436 errs=2(페이지 에러)가 즉시 잡아냄 — 프로브의 pageerror 카운트가 회귀 방지 게이트로 유효했음. SPR 진짜 로드 검증 = 브라우저 스코프 내 SPR['buzzer'].complete( SPR은 const라 window.SPR 접근 불가 — page.evaluate는 스코프 내 스크립트 삽입으로 확인).
- (v456) 덱1/덱2↔메뉴행 간격 절반 압축: 사용자 캡처(v455) — desc 아래 26px 여백으로 하단 난이도가 밀림. 수복=#deck-desc 절반화(margin 0·line-height 10px·font 9px — v443의 진실원 위 덮기). 실측 26→18px(deckToMenu), diffBottom 627→619. probe443 기대치 갱신(6/6→3~5/3~5). 구현 프롬프트=dev-pipeline/references/deck-gap-half-prompt.md.
- (v457) 황혼 비전 아레나 전면 적용(로얄클래식): 지면=GT_IM.classic 교체(assets/ground_classic.png — 룬 석타일 심리스 512px, seam L/R 41.8 양호), 타워=ART_TOW 4종 교체(ra_tow457_king_b/r·princess_b/r 256px, ?v=457 캐시버스터, SW ASSETS 등록). 생성 앵커=ra_practice_arena.png(사용자 확정 화면). 검증: 라이브 전투 캔버스 픽셀이 로컬과 완전 동일(52,38,85 계열 — 룬 타일), 육안 판독 바닥 룬 석타일 예·타워 일러스트 예(크롭 판독), pageerror 0, 게이트 전체 OK, 칩 v457. 주의: king 타워는 테마 틴트(towSkin)를 거쳐 9맵 공용 — 비클래식 맵도 기반 아트가 교체됨(티트 유지). 전투 배경 full-image 대신 심리스 타일 방식 채택 — 강/다리/배치선 코드 오버레이와 충돌 없음.
- (v458) 카메라 줌 홀드: 전투 중 포커스 줌(2.5배)이 자동 만료되지 않고 유지(100ms 감시자 — S.focus.t/dur 하한 0.4 상향), 전투 종료(S.over) 1초 후 focus 해제→홈 카메라 스무스 복귀. 터치 즉시 해제(v178)는 존중. 진실원=raFocus/S.focus(g1c)·updateCam 항시 구동·finish→S.over. 검증=스코프 기계 판정(raFocus force 후 2s focusHeld+cam.z>1.15 → S.over 후 1.3s focusCleared) — 로컬 통과. 구현 프롬프트=dev-pipeline/references/battle-zoom-hold-prompt.md.
- (v459) 결과 화면 잘림·겹침 수복: 사용자 캡처(v458) — 다시 배틀/메인으로 버튼이 통계를 덮음·마지막 항목 프레임 하단 침범. 수복=.r-box footer 핀 고정(flex-column+max-height calc(100vh-36px)+overflow hidden, 실구조 fw-wrap+r-box — .rpanel 아님), 통계 본문 flex:1+overflow-y auto, 버튼 flex-shrink 0, 패딩 하단 14px(버전칩과 간격). 검증=강제 개방(판정용 hidden remove) 후 rect 직접 비교 — 로컬·라이브 동일 수치(cta 474·pane 468 — cover false, paneInFrame true, frameInVh true). 주의: ?result=blue 자동 개방은 v459 칩 도달 후에만 동작(엣지 캐시 시 누락). 프로브 요구 시 화면상 검증은 캡처 크롭 판독 병행. 구현 프롬프트=dev-pipeline/references/result-clip-fix-prompt.md.
- (v460~v465) 결과 화면 2열+50px 상승(사용자 캡처 요청): 1297행 1fr 단일 열 복원 규칙보다 후순위 style 블록으로 2열 grid 재적용, .r-box margin-bottom 118px로 중심 50px 상승. 수복 과정 — 통계 창이 남는 공간만 남아 내부 스크롤 발생(v460~v464 4차 시도) → 근원은 g2 런타임 주입 `#overlay-result .rrow{height:30px!important}`. v465에서 rrow `height:auto!important`(2-id 특이도로 g2 1-id 상회)+pane 자연 높이+박스 overflow-y:auto+버튼 행 sticky bottom으로 무스크롤 확정. 버튼 2개는 #r-btnrow flex 한 행 래핑(HTML). 최종 게이트(360×550, 로컬·라이브 동일): cols 2열·box/pane scrollable false·13rows 전 노출·btnCover false·pageerror 0.
- (v466~v467) 승리 화면 다음 스테이지 버튼: showResult 래핑(ui-v466-js, g2 태그 직후) — S.winner==='blue'이고 다음 지도(__raMAPS.length 9)가 있으면 btn-again 라벨 '⏭ 다음 스테이지', 캡처 클릭 핸들러가 ra_map_v1=next 저장+테마행 sel 토글+토스트 후 기존 startMatch 핸들러가 새 지도로 재시작. 패배/무승부·최종 지도(잠든 신계) 클리어 시 '🔁 다시 배틀' 유지. 수복: \U0001f501은 JS 이스케이프 문법 아님(리터럴 노출) — UTF-8 문자 직접 기입(v467). 게이트(로컬·라이브 동일): 패배 라벨 다시 배틀·승리 라벨 다음 스테이지·클릭 후 ra_map_v1 진행+오버레이 닫힘·pageerror 0.
- (v468) 그물척후병 탄환 그물 스프라이트: gpt-image-2 -i ra_card_netter.jpg(화풍 앵커) → 코너 플러드필 키잉(불투명 44%) → 128px 리사이즈 → assets/ra_proj_net.png. 등록 4종 — ART_PROJ net(g1a:118)·netter 탄환 kind 매핑 'arrow'→'net'(g1a:738)·PROJ_BASE net:0(g1c:183)·SZ net:40(g1c:257) — bake16 자동 16방향. 둔화는 기존 로직 유지(p.slow=2.0 → slowT → 이동속도 ×0.55·❄️ 표시 — g1b updateProjs slow 전파). 로컬 게이트: PSPR.net __valid·PROJ16.net 16방향·pageerror 0.
- (v469~v470) 탄환·근접 효과 5종 개선: ①발키리 근접 → 360도 도둘이 참격 스프라이트(__FXIMG.slash360, drawFx kind slash360 페이드아웃, 기존 ring 2겹 대체) ②투석 수레 탄환 → 전용 돌덩이 스프라이트(ART_PROJ stone+kind 매핑 catapult→stone+PROJ_BASE 0+SZ 52+착탄 먼지 파편 8개·shake 0.16) ③프린스 돌진 중 진행 반대편 3점 속도선 트레일(_trC 3틱마다) ④캐논·돌덩이 착탄 시 포연 링 잔류 0.5s ⑤힐 존 틱 회복 시 잎사귀 파티클 상승. 스프라이트 2종 — gpt-image-2 -i 카드 아트 앵커( slashing=netter 카드, 돌덩이=catapult 카드) → 코너 플러드필 키잉(63%/33%) → 256px/128px. 게이트: PSPR.stone __valid·PROJ16.stone 16방향·__FXIMG.slash360 valid·pageerror 0(로컬·라이브).
- (v471~v472) 임팩트 체인 수복: net·stone 착탄 브랜치는 g1b가 아니라 g1a impactProj(687행 체인)에 추가 — g1b는 impactProj 호출자일 뿐(3차 시도 실수). 라이브 게이트(v472): PSPR.stone valid·PROJ16.stone 16방향·__FXIMG.slash360 valid·net/stone 브랜치 g1a 존재·발키리 slash360·포연 링 확인·pageerror 0. 프린스 돌진 트레일(_trC 3틱 3점 감쇠)은 g1b updateUnits charging 블록.
- (v473) 패배 화면 수납·가독 수복(사용자 캡처 — 하단 뷰포트에서 첫승 보너스·XP 행이 버튼에 겹침+'0' 삐져나옴): .r-box max-height:none(무클립 — 높은 화면에서 통계 13행 전 노출)+통계 행 10→11.5px/12.5px·줄간격 1.45·패딩 확대, 총점 17px, 탭 12px, 버튼 17/14px, 왕관 15px+드롭섀도. 게이트(로컬·라이브 동일, 360×550): 2열·13행 전 노출·btnCover false·btnInBox·boxInVh·stray 텍스트 없음·pageerror 0.
- (v474~v475) 결과 화면 이모지 아이콘 → 게임 화풍 스프라이트 12종: 시트 1회 생성(4×3 그리드, gpt-image-2 -i netter 카드) → 셀 균등 슬라이스+개별 키잉(12/12 알파 통과) → 48px assets/ra_ic_{crown,swords,castle,timer,spark,trophy,medal,sunrise,star,grad,chart,refresh}.png. 적용 — 통계 행 12곳·탭 2곳·btn-again·r-crowns(g1b innerHTML img repeat — 텍스트 append 아님 주의)·다음 스테이지 라벨은 ▶ 글리프(시트에 화살표 아이콘 없음). 수복 2건: 첫 스크립트 단언 실패로 미적분 커밋(버전만 반영 — 교정 재실행)·r-crowns 캐시 키 ?v= 일원화. 게이트(로컬·라이브): ric 15개 전 로드(bad 0)·라벨 다음 스테이지·pageerror 0·육안 판독 게임풍 아이콘+정렬 예.
- (v476) 전술연구소 테크트리 개편·유물 8종·3화면 수복: 신규 js/g10-techtree.js(마지막 로드 청크 — 함수 오버라이드로 런타임 승자). 테크트리 12노드(공세/방어/비전 × T1/T2선택형 2갈래/T3 — T2는 두 기술 중 택1 경로 확정·반대 경로 잠금·연쇄 환불 분기 유지). 신규 기술 훅 — dealDamage 래퍼(off2b 대타워 +7%·mag2b 상태이상 +8%·relic_guard 받는 피해 −8%), repairTower 오버라이드(def2b 성벽 보수·relic_repair 기계공 망치), applySkills 오버라이드(relic_ante 개전 나팔 시작 엘릭서 +2), g1a 이동속도 라인(relic_speed ×1.06). 유물 4→8종(RELICS8 — RELICS const는 미수정). 아이콘 시트 2회 생성(gpt-image-2×netter 앵커) → 4×3 균등 슬라이스 → 키잉 실패 셀 다수 → 전면 라운드 타일 통일(48px, ra_tk_* 12·ra_rl_* 12) — 배경이 균일 네이비가 아닌 시트는 키잉 대신 라운드타일이 안정적. 도움말 모달 이모지→아이콘 칩(.hico)·번호 배지(.numb)·t-spec flex 행. 패치 사고 2건 — ①node() el.innerHTML 행 누락(빈 노드 렌더 → 복원) ②T2 노드 절대배치 버튼 텍스트 겹침(→ .tk-btns 인라인 행·.sk-foot sticky 핀). 게이트: 로컬·라이브 모두 노드 12·아이콘 미로드 0·구매 동작(Lv 1/3)·relic 8·hico 7·pageerror 0·하단 버튼 뷰포트 내.
- (v477) 육안 재판정 수복 — sticky 하단 버튼이 스크롤 중 본문(노드·유물 카드)을 가리던 결함: 연구소·유물 하단 버튼 sticky 폐기→본문 흐름 배치(스크롤로 도달·상단에서 겹침 원천 차단)·패널 padding-bottom 54px(verchip 여백). 유물 모달 390px 이하 1열 폐기→2열 소형화(아이콘 36px). 도움말 확인 버튼 position:sticky 핀+상단 그림자로 스크롤 중 항상 가시. 게이트: 노드 12·아이콘 미로드 0·구매 Lv1/3·유물 2열 8장·hico 7·pageerror 0·스크롤 후 하단 버튼 뷰포트 내(로컬·라이브).
- (v478) 360px 협폭 수복 — 3열 테크트리의 T2 나란히 배치가 노드 폭 ~50px로 붕괴(육안 판정 겹침·잘림 재발 원인): 420px 이하 .tk-row 세로 스택(택1 유지)·아이콘 26px·min-width≥90 단언. 도움말 확인 버튼 불투명 배경·15px 폰트. 게이트: 로컬·라이브 PASS.
- (v479) 유물 모달 한 줄 배치(사용자 캡처 — 2열 협폭에서 이름 2~3줄·설명 4~5줄로 쪼개짐): #relic-list 2열→1열 전폭 리스트, 이름·설명 white-space:nowrap+ellipsis 한 줄 고정(전폭이라 온전히 표시), 아이콘 40px 복원·배지 11px. 확인 버튼 금배경·다크문자 !important로 원본 .t-cta 충돌 제거. 게이트: 이름·설명 행높이 ≤20px 단언(oneAll)·유물 8·1열·노드 12·칩 v479(로컬·라이브).
- (v480) 결과 화면 금테두리 고정 프레임+버튼 그래픽 업그레이드(사용자 캡처 — 통계 하단 행이 버튼에 가림·프레임 2px 협폭): ①.r-box 금테두리 5px 고정(전 화면 동일·inset 금 하이라이트 1.5px·패딩 16/16/12 복원) ②#rpane-score·#rpane-rank가 v479 스크롤 규칙(.r-stats 등)에 누락 → flex:1+overflow-y:auto 추가(버튼 뒤 가림 원인) ③버튼 스킨: 신규 ra_btn_gilt.png(gpt-image-2 금 플라크 텍스처·앵커 netter 카드) — 다시 배틀/메인으로 100% 100% 스트레치·다크문자(#2a1a00). 게이트: border-width 5px·overflow auto·버튼 rect가 박스 내·gilt 배경·아이콘 미로드 0(로컬·라이브).
- (v481) 결과 박스 금테두리 원복(5px→원본 2px solid var(--gold)·inset 하이라이트 제거)+박스 세로 30% 확장 — 기준선 실측 414px(640vh) → min-height:84vh(≈538px)로 +30% 달성, margin 14/14로 뷰포트 내 유지. 통계 스크롤·gilt 버튼 스킨은 유지. 게이트: boxH/414≥1.25·bw 2px·bottom≤뷰포트·gilt·아이콘 미로드 0(로컬·라이브).
- (v482) 패배 화면 프레임 규칙 통일(사용자 요청 — 패배 시 상하 금테두리 비균일): 패배 전용 규칙(max-height:none·하단 margin 108px)이 내용이 길 때 하단 테두리를 화면 밖으로 밀어내는 구조 → #overlay-result .r-box 공통으로 max-height:calc(100vh - 28px)+margin 14/14(내부 #rpane-score 스크롤은 v480 규칙 유지). 게이트: 패배 기준 bt/bbw 2px 동일·테두리색 동일·top≥0·bottom≤vh·gilt·아이콘 미로드 0(로컬·라이브).
- (v483) 서리왕국 바닥 재생성+킹타워 지도별 스킨(사용자 캡처 — 얼음 바닥 헐빈함·킹타워 무테마): ①ground_ice.png 재생성(seamless 눈 퇴적·빙하 균열·발광 룬 — gpt-image-2 -i 구버전 앵커, 1024²) ②킹타워 4지대 스킨 — 시트 1회 생성(ice·lava·wasteland·abyss) → 2×2 슬라이스 → 네이비 코너 키잉 → 160×180, 팀 틴트 파생(b/r/n 3톤=ra_kt_* 12종) ③__towSkinImg(g1a 정의) 시그니처 확장(theme,isKing,team)+__KT_IM 프리로드, g1b drawTower 호출부 2곳 전달 — 킹타워도 지도마다 그래픽 변경. 게이트: 아이스 실배틀에서 GT_IM.ice·__KT_IM.ice_b 로드(로컬·라이브), 칩 v483.
- (v483~v485) 서리왕국 바닥 재생성+킹타워 지도별 스킨(사용자 캡처 — 바닥 헐빈): ①ground_ice.png 재생성(seamless 눈 퇴적·빙하 균열·발광 룬, 1024², gpt-image-2 -i 구버전 앵커) ②킹타워 4지대 스킨 시트 1회 생성 → 2×2 슬라이스 → 코너 키잉 → 팀 틴트 파생 ra_kt_* 12종(160×180) ③__towSkinImg(g1a) 시그니처 확장(theme,isKing,team)+__KT_IM 프리로드, g1b drawTower 호출부 2곳 전달 — 킹타워도 테마별 그래픽 ④배경 텍스처 훅 window.GT_IM 참조 → typeof 검사 일괄 수정(g1c·g1 계열 — GT_IM이 const라 window에 부재, 텍스처 레이어가 미도식 중이었음).
- 검증 상태(정직 기록): 에셋 로드·훅 연결·drawStatic 호출·pageerror 0까지는 로컬·라이브 모두 확인(칩 v485). 단, mid-battle S.theme 전환+drawStatic 강제 호출 후 캡처에서도 바닥이 여전히 클래식(남색 타일)으로 판독됨 — 배틀 시작 시점에 프리렌더되는 정적 배경 레이어(bgc)가 테마 선택 UI 플로우에서만 갱신되는 것으로 추정. 라이브 기기에서 테마(지도) 선택 → 배틀 시작 플로우로 서리왕국 바닥·킹타워 스킨 반영 여부 확인 필요. 미확인 시 다음 작업: bgc 프리렌더 경료(추정 g5/g6 drawStatic)를 테마별 재렌더와 연결.
- (v486) 서리왕국 간헐적 클래식 바닥 수복(사용자 캡처 — 아이스 배틀에 클래식 남색 타일 폴백): 근원 = 부팅 시 ra_theme_v1 저장 테마에서 .sel 칩만 복원하고 S.theme은 classic으로 시작 → 재선택 없이 시작하면 클래식 렌더. g1c 부팅 블록에서 S.theme 복원 추가(무케이스 테마 sky/tomb/dusk/divine은 v434d 매핑표로 정규화). 게이트: init-script로 ra_theme_v1=ice 주입 후 타이틀 S.theme='ice'·배틀 시작 후에도 'ice' 유지·GT_IM.ice/__KT_IM.ice_b 로드·pageerror 0(로컬). 화면 레이어상 타일 장식이 텍스처 위에 보여 육안 판독은 여전히 타일 지배 — 기기에서 지도 선택 플로우로 최종 확인 요망(텍스처는 타일 밑 은은한 눈 톤으로 반영됨).
- (v487) DPS창 100px 상승(사용자 지시): 1차 시도(ui-v487 CSS 블록) 실패 — JS(g1a:543 relayout)가 인라인 top:38%!important 주입이 우선 → 주입원 자체를 calc(38% - 100px)로 수정. 교훈: #dpsw 위치는 CSS가 아니라 g1a relayout 인라인 주입이 규칙. 게이트: 배틀 시작 후 dpsw top 120~170px 단언(로컬 PASS).
- (v488) ①DPS창 50px 하강(사용자 지시) — 주입원(g1a) calc(38% - 100px)→calc(38% - 50px)·CSS 상쇄 블록도 동일값. 게이트: dpsw top 185~225px(로컬 PASS). ②에셋 모바일 경량화 — 전체 assets 87→53MB(≈39% 절감): PNG 128~192색 quantize(알파 보존)·장 큰 PNG 768~1024 상한 리사이즈·JPG q70~82 재인코딩. ③'다음 스테이지 암전' 대응: 근원은 대형 배경 에셋 늦로딩 — 위 경량화가 근본 완화(로드 시간 단축). 화면 재현 시 sw.js ASSETS SWR 자동 재충전이 커버.
- 참고: 승리→다음 스테이지 직후 어두운 오버레이는 전장 배경 이미지가 로드되기 전 상태 — 경량화로 노출 시간 단축. 재발 시 로딩 인디케이터 추가 검토.
- (v489) ①연습게임 버튼·화면 삭제(사용자 지시) — ui-v452(버튼·오버레이 생성기)·ui-v452-js(캔버스 샌드박스)·ui-v453(버튼 배치) 블록 제거, 연습 전용 에셋 9종(ra_practice_arena·ra_test_*) 삭제+sw.js ASSETS에서 제거 ②에셋 4차 경량화 — 37.8→19.1MB(이번 50% 절감, v488 87MB 대비 누적 78%): P모드 64~96색 재양자화·장변 512~640 상한·JPG q55.
- 게이트: btn-practice 부재·타이틀 정상·배틀 시작·dpsw top<230(193 유지)·pageerror 0(로컬). 칩 v489.
- (v490) 유닛 붉은 점류 표시 폐지+먼지 파티클(사용자 지시): 적군 지상 붉은 은영(v181 rgba(255,45,45,.18)) 제거·팀 색 링(파랑/빨강 스트로크) 폐지 → 전 유닛 중립 미광 링(rgba(244,240,225,.85)) 통일. 이동 지상 유닛 발밑 먼지 파티클(addParts 구조 준수 — t/max·col 필수, 14% 확률·parts<340 가드) 추가. 게이트: 배틀 중 먼지 파티클 스폰 단언·pageerror 0(로컬).
- (v491) 다음 스테이지 흐름 완성+보스 리셋(사용자 캡처 — 다음 스테이지 클릭 후 배틀 화면에 갇힘): ①ui-v491-js 핸들러에 지도 테마 전환(__raMAPS[nx].id→MID 매핑, ra_theme_v1 동기화)+drawStatic+결과 닫기+startMatch() 재시작 추가 — 이전엔 ra_map_v1 저장·토스트만 하고 화면 전환이 없었음 ②startMatch 선두에 보스 상태 완전 리셋(S.boss=null·bossSpawned=false·ks/ksCd/doom/__bossWave) — 잔여 90초 폴백이 이전 경기 상태 이어받아 급강림하지 않도록 5분 타이머 리셋과 함께 초기화. 유의: index.html 내 js 문자열은 \uXXXX 이스케이프 리터럴 — 파이썬 교체 시 raw 문자열로 매칭. 게이트: 승리→다음 스테이지 클릭 → map_v1='1'·S.theme='ice'·새 배틀(t>250)·보스 null·bossSpawned false(로컬).
- (v492) 보조탑 검은 배경 수복(사용자 캡처 — 프린세스 타워 4기 뒤 불투명 검은 사각형): 근원 = v488/489 경량화에서 RGBA→P(팔레트) 모드로 압축하며 알파 채널 소실(512²·abyss 900² 4종 모두 P 모드 확인) → 코너 플러드필 키잉으로 알파 복원(알파 extrema 0~255 복귀). 킹타워 12종은 알파 정상 유지. 게이트: 스킨 이미지 로드+불투명 픽셀 비율 15~75% 단언(타워 형태만 불투명)·칩 v492(로컬).
- 교훈(스킨 저장): 압축 후 RGBA 유지 검증 — quantize(colors)는 P모드 반환하므로 알파 필요 에셋은 RGBA 상태에서 저장하고 알파 extrema 단언 필수.
- (v495) 천공 정원 바닥 최종 수복: 진짜 근원 = g1c 부팅 테마 복원부의 sky→ice 강등 매핑(v434 자매 폴백 잔존) — 전용 지면(GT_IM sky·THEMES.sky v493~494)이 이미 정상 로드됨에도 S.theme이 ice로 강등되어 ground_ice를 그림. 매핑에서 sky 제거(전용 텍스처 보유 테마는 원값 유지, tomb/dusk/divine 자매 강등은 유지) + 칩 클릭 시 ra_theme_v1 저장 보강. 게이트 진단 유의: const 전역은 window.GT_IM으로 접근 불가(항상 nokey 오탐) — bare GT_IM 사용. 로컬 게이트: 부팅 sky 유지·GT_IM sky 640·배틀 시작·오류 0.
- (v496) 이벤트 팝업 폐기+노멀 밸런스 정가(사용자 요청): ①g1a v212 블록(EV 노드·setInterval 오버레이 #overlay-event) 제거 — 결과 닫힌 뒤 30%/45% 확률로 뜨던 선택 팝업, 인런 렐릭은 전술연구소 경로로 일원화 ②__raDIFF 정가 — 보통 hp[1→1.10]·dmg[1→1.10]·aelix[1→1.18](aelix가 적 엘릭서 충전=스폰 속도 지배, g1b:382), 악몽 1.30/1.22/1.22·지옥 1.60/1.42/1.35 격차 유지. 맵 배율(mult)은 타워 HP에 이미 결합 — 이중 조정 금지. 게이트: 배율 실측(1.10/1.10/1.18)·배틀 시작·강제 승리 후 10초 관찰 팝업 미출현·오류 0(로컬).
- (v497) 보스 파멸기 정가+킹샷 개편(사용자 요청): ①파멸기(doom 12s) 피해 500→150(-70%), 대신 아군 타워 전체(킹+보조 둘 다 실측 150 감소)와 유닛(왕 기준 반경 2.2)에 광역 적용 — g1b doom 블록 ②킹샷 저지: 재사용 대기 8s 폐지 → 엘릭서 3 소모 즉시 발동(부족 시 토스트·버튼 dim·라벨 '킹샷 3'), 발사 후 ksCd=0 — g1c 버튼/HUD·g2 ready 게이트. 맵별 파멸기 존 fx(burnzone 등)는 기존 유지. 게이트: 킹샷 무장(엘릭서 10→7)·해제·명중 시 그로기/파멸기 캔슬·파멸기 시 타워 3기 각 150 감소·doom 리셋·오류 0(로컬).
- (v502) 상태 주의: 550px 무스크롤은 미완성 — 로컬 실측에서 연구소(360×550 sh>ch)·타이틀 3px 잔여가 CSS 압축(g2~g8 주입 스타일 직접 삽입)과 zoom 핏터(g8-boot 400ms 폴러)로도 해소 안 됨(원인 미규명 — 헤드리스 zoom/오버레이 인스턴스 의심). SP 소급 마이그레이션은 실측 PASS(41→12, ra_wins_v1 기준). 다음 세션: ①로컬 550px에서 .rpanel computed style·자식 클래스 덤프 후 실제 지배 규칙 특정 ②g10-techtree가 오버레이를 자체 마크업으로 다시 그리는지 확인(스킨 갱신 타이밍) ③zoom 미적용 시 수동 폰트/패딩 산출.
- (v505) 연구소 3열 가로 클리핑 수정: 3열 최소폭 강제(150px→총470px)가 패널 340px 초과 → min-width 0·flex 균등 분할(101px×3)·overflow-x hidden·카드 word-break. 기계 검사: 겹침 0·잘림 0·패널 전체 크기(97%+). 잔여: 그리드 내용 12px 초과는 overflow-x hidden으로 클립(시각 판독으로 확인 요망), 360×550 타이틀 3px 잔여.

### v506 (2026-11-14 — 현재)
- 전술연구소 버튼 레이아웃 수복(사용자 캡처 — LV 라벨 세로 줄바꿈·±버튼 카드 경계 침범·T2 이중 압박): 근원=v505 오버라이드 시트의 구 절대배치 잔재 패딩(6px 34px)이 인플로우 .tk-btns를 질식. 수복=패딩 .tk-item 한정 좌우 8px·.tk-row 패딩 0·.tk-btns flex-wrap 가드+sk-lv nowrap·버튼 right 잔재 제거. g8 시트(v506-lab-full)+g10 기본 시트 이중 가드. 게이트: VM:OK·캡처 판독(아래). 프롬프트=dev-pipeline/references/skill-lab-button-layout-prompt.md.

### v506 보강 (2026-11-14 2차)
- 스킬 제목 말줄임 폐기(판독 지적 반영): .tk-item b 2행 랩(-webkit-line-clamp:2·word-break:keep-all) — g10 기본 시트+g8 v506 시트 이중 적용. 360×600 캡처 판독 4항목 전부 통과(제목 온전·LV 1행·버튼 카드 내·겹침/잘림 0). 라이브 칩 v505 확인 — 미배포 상태, 토큰 수령 후 푸시 필요.

## 신규 세션 부팅 스킬 세트 (2026-11-14 등록 — 사이클 시작 시 최우선 로드)
> 새 세션에서 이 저장소 작업을 시작할 때는 **본 HANDOFF.md를 첫 단계로 읽고**, 아래 스킬 세트를 로드한 뒤 작업한다. 스킬은 트리거 키워드로 자동 발동되지만, 누락 방지를 위해 dev-pipeline SKILL.md에 부팅 규칙으로도 고정했다.
- **필수(모든 사이클)**: royal-arena-dev-pipeline(단위구현→단위검증→통합UI→빌드→푸시 게이트) · royal-arena-qa-gates(vm 컴파일·배너 토큰·회귀 게이트) · github-push(토큰 복구 마스킹 푸시)
- **화면·UI 변경 시**: royal-arena-screen-audit(전화면 캡처 감사 — references/post-change-clip-audit-prompt.md) · self-check(완료 기준 실행 검증) · royal-arena-self-check(라이브 운영 URL 실측)
- **그래픽·에셋 추가 시**: royal-arena-art-pipeline · royal-arena-unit-card-art · game-texture(지면 텍스처 3대 조건)
- **밸런스 조정 시**: royal-arena-balance-map(원가치 공식·총데미지 맵)
- **코드 배치·분할 시**: royal-arena-file-governance(g1 8분할·크기 예산)
- **캡처 서비스 장애 시**: headless-render-verify(playwright 폴백 — 미검증 방치 금지)

### v507 (2026-11-14 밤)
- 당시 게임방법 화면 정리 시도: 시트·라벨 가드·sticky 폐기를 적용했지만, 이번 운영 v507 캡처에서도 확인 라벨은 비가시였다. 기존 '수복 완료' 표현은 정정한다. v508 실제 계산 스타일 조사에서 높은 특이성 sticky와 ui-v373-js 플라크 재적용이 여전히 승리함을 확인하여 원천 제외 및 최종 CSS 경로를 수정했다.
- 당시 로비 축소 완화: g8 v505 핏터 하한을 0.93으로 제한했다. '근본 수복' 표기는 정정한다. 이번 실제 도움말 4회 개폐에서 zoom 0.968→0.93으로 여전히 축소되는 것을 재현했고, v508 작업 트리에서는 곱셈 폴러 자체를 제거했다.
- 칩·sw·?v= v507, 커밋 0db2a0e PUSH:REAL_OK라는 당시 기록. 이번 운영 캡처 칩 v507을 직접 확인했다. 이전 v505 관측의 원인을 CDN 지연으로 확정하지 않는다.

### v509 (2026-11-21)
- v508 미완 2건 수복: ①결과 통계 미러·열값 우측 클립 — 원인: #ui-v186 nowrap이 미러 b(#rt-mirror)를 1행 539px로 만들고 1fr 트랙이 min-content 304px로 팽창(패널 295px) → ui-v509 minmax(0,1fr) 트랙+미러 행 전폭 pre-line 수복. ②도움말 상단 안내(#ra-inote) 오프스크린 — 원인: 절대 툴팁 규칙(bottom:100%+8px)이 뷰포트 위(top:-35.8) 배치 → 문서 흐름 복원+#overlay-info column 스택+info-box 캡(100svh-160px)+t-how/t-note/t-spec 내부 스크롤+t-cta sticky. 후반 발견: sticky 버튼 이동 범위는 containing block(.t-cta 래퍼) 한계 — 카드 전체 스크롤 설계에선 버튼이 카드 밖(595.3)에 남았고 래퍼 자체를 sticky로 수복.
- 검증(360x550 playwright 픽스처): 팁 인뷰포트(21.6~338.4×65.5~126)·확인 버튼 522 인뷰포트·결과창 클립 텍스트 0건 실측. CAMERA_CHECK 21게이트 13004단언 PASS·ACTIVE-RESOURCES:OK(15 스크립트 실패 0)·컴파일 15파일 OK. 기존 audit.sh(구 g1 260000 초과)·balance_check buzzer OUTLIER는 차단 유지 — active_resources_check가 대체 게이트.
- 배포: 칩·sw v509 범프 → 커밋 99f8ccc → 사용자 제공 토큰으로 원격 푸시(merge 6027f3b: 원격 텍스처 커밋 4건 병합 포함) → ls-remote 원격 팁=로컬 HEAD 일치 → Pages 전파 폴링 2회째에 라이브 3중 확인(칩 v509·sw v509·ui-v509). 기기 첫 새로고침에서 v509 확인 요청.
- 교훈: sticky 버튼의 이동 범위는 containing block(래퍼 div) 안으로 제한된다 — 스크롤 카드 안 sticky 핀은 버튼이 스크롤 컨테이너 직계 자식일 때만 동작. 래퍼가 있으면 래퍼를 sticky로.
- 교훈(푸시 판정): push.sh의 "main -> main" 매칭은 거부 메시지 `![rejected] main -> main`도 성공으로 오판한다(v509 실증 2회) — 판정은 반드시 reject/error 토큰 부재 + `git ls-remote` 원격 팁과 로컬 HEAD 대조로 확정한다. 원격이 갈라져 있으면(다른 세션 커밋) 토큰과 무관하게 거부된다.

### v510 (2026-11-21)
- 지도·난이도 해금 단계별 개편(사용자 지시): 단일 진실원 __raUnlock — ①난이도별 맵 사다리 분리(ra_map_clear_d0/d1/d2, 구 ra_map_clear_v1은 d0 마이그레이션 원천) ②맵 해금=현재 난이도 사다리 순차(clear_d+1) ③악몽 해금=노멀 전맵 토벌(clear_d0>=8), 지옥=악몽 전맵 토벌(clear_d1>=8) — 기존 "악몽+지옥 동시 체감"·"지도 5개"구형 게이트 3벌 불일치 폐지 ④테마 행 클릭 게이트가 표시순서 idx를 ra_map_v1에 기록·차단하던 버그(표시 로얄→용암→서리 ≠ 사다리 로얄→서리→용암)를 이름 매칭 사다리 idx로 근본 수복 — "일부 지도는 승리 후 다음 버튼으로만 진입" 결함의 원인.
- 수정: index ui-v431 클릭 게이트·v450 unlockedDiff·v447 diffUn/mapUn 전부 __raUnlock 위임, g1b 승리 기록에 record(diff,mapIdx) 추가, ui-v510-js 신설. 칩·sw v510, 스크립트 ?v=510.
- 검증: COMPILE:OK(15파일)·CAMERA_CHECK PASS·ACTIVE-RESOURCES:OK·해금 시뮬레이션 14항목 PASS(초기 [T,F,F]·이름매칭 사다리 기록 '1'/'2'·악몽=노멀전맵·지옥=악몽전맵·구기록 마이그레이션). 라이브 3중 폴링 확인.

### v511 (2026-11-21)
- v510 잔여 결함 수복(기기 보고): 악몽에서 로얄 클래식 외 지도가 해금처럼 보이고 색상 깜빡임 — 원인: v431 900ms 잠금 스캐너가 구형 ra_map_clear_v1(노멀 진행도, 악몽 플레이어는 8 → un=9 전체 해금·🔒 제거·필터 해제)을 쓰고 v447 500ms 스캐너는 신규 난이도별 mapUn으로 잠금 부여 — 두 스캐너가 filter·🔒을 500/900ms 주기로 반대 토글(깜빡임). v511: v431 스캐너도 버튼별 ladderIdx(bs[k])>mapUn(curDiff) 단일 술어로 통일(비-__raUnlock 폴백 유지). 칩·sw v511, ?v=511.
- 검증: COMPILE:OK·CAMERA_CHECK PASS·ACTIVE-RESOURCES:OK·악몽 픽스처 실측(잠금 8/흑백 8/로얄 클래식만 해금/2.1s 이중 샘플 상태 불변=깜빡임 0). 라이브 칩·sw 폴링 확인.

### 신규 세션 필수 — 하네스 (2026-11-21 사용자 지시)
- **`HARNESS.md`(저장소 루트) 필독 + `bash run_gates.sh` 게이트 러너 상시 사용**. 신규 검증 픽스처는 저장소 `tests/test_*.py`에 영속화한다 — `/tmp` 금지(재활용 시 소멸).

### v513 (2026-11-21)
- 결과 화면 개편(사용자 지시·기기 캡처 판독 기반): ①세부집계 탭·패널(#r-tabs·#rpane-score) 삭제 ②랭크 평가(#rpane-rank) 탭 없이 즉시 노출 ③중복 통계 제거 — 왕관 획득·총점 rsum·트로피(상단 헤더와 중복)·상단 통계 전체 미러(#rt-mirror, 상단 바 중복)가 삭제된 패널 안에서 일괄 소멸. g1b: 탭 전환 블록 제거+제거된 rt-* 요소 쓰기 7종 전면 가드 — 1차 적용에서 미가드 쓰기 6건이 showResult를 예외 중단시켜 결과 모달이 아예 안 뜬 것을 E2E가 잡아 수복. ui-v513 셸 블록. 칩·sw v513, ?v=513.
- 검증: RUN_GATES:ALL_OK — 컴파일 15파일·CAMERA_CHECK 21게이트/13004단언·ACTIVE-RESOURCES OK·DUEL:OK(27유닛)·E2E 3종(해금 사다리 9항목·잠금 안정성 8샘플·결과 UI 6항목: 패널 삭제/탭 삭제/랭크 즉시 노출/엠블럼/브리핑/클립 0). tests/test_result_ui.py 신구조 갱신(대기 조건 #rt-emblem 교체 포함). 라이브 칩·sw v513 폴링 확인.
- 교훈: 패널 삭제형 개편은 "삭제된 요소에 쓰는 기존 코드 전수 가드"와 "테스트 대기 조건의 존재 전제"를 함께 갱신해야 한다 — 두 경우 모두 E2E 회귀가 정확히 포착(하네스 가치 실증).

### v514 (2026-11-21)
- v511 잔존 결함 수복(기기 보고: 악몽 로얄 클래식 승리 후 서리가 해금처럼 보였다 깜빡이며 선택 불가): v447 500ms 스캐너가 표시순서 k>un 술어 잔존 — 표시순서 서리=2·사다리=1이라 v431(사다리·해금)과 v447(표시·잠금)이 반대 판정 → 500/900ms 토글(깜빡임)+v447 __raLockStop 캡처 리스너가 클릭 차단. v514: v447도 버튼별 ladderIdx>mapUn(curDiff) 단일 술어로 통일 — 잠금 토글러 3종(v431 900ms·v447 500ms·ra-dbtn 900ms)이 전부 같은 진실원. 승리 기록(g1b record(diff,mapIdx))은 정상 — 승리 후 메인 복귀·화면 리셋 시 다음 지도가 해금되고 클릭으로 선택 가능.
- 검증: RUN_GATES:ALL_OK — 신규 E2E tests/test_nightmare_next_map.py(악몽 승리 시나리오: 8샘플 상태 불변·잠금 7[로얄+서리 해금]·서리 클릭 ra_map_v1=1 기록)+기존 3종. 컴파일 15파일·CAMERA_CHECK 21게이트/13004단언·ACTIVE-RESOURCES OK. 라이브 칩·sw v514 폴링 확인.
- 교훈: "단일 술어 통일"은 토글러 전수(rg classList.toggle)에 적용한다 — v511에서 v431만 고쳐 v447 잔존 경합을 남김. 잠금 판정 진실원은 ladderIdx>mapUn(curDiff) 단일 경로.

### v515 (2026-11-21)
- 지도 진행 사다리=화면 표시 순서 단일화(사용자 지시: "지도 해금 및 진행순서가 화면순서와 동일하게 — 다음은 용암 협곡"): ra_map_v1을 표시 idx(로얄0→용암1→서리2→황야3→심연4→천공5→봉인6→황혼7→잠든8)로 재정의. __raUnlock.ladderIdx(이름 매칭) 폐지→dispIdx(DOM 순서)+dispToMap([0,2,1,3..]) 신설. __raMapIdx(g1a)는 dispToMap 경유 — 보스·배율·테마 진실원 불변. 클릭 게이트(v431)·잠금 스캐너(v431 900ms·v447 500ms)·다음 스테이지(v505)·승리 기록(g1b record=표시 idx) 전부 표시 순서로 통일. v509 이래 "표시≠사다리" 어긋남 계열의 최종 수복.
- 검증: RUN_GATES:ALL_OK — E2E 표시순서 갱신(표시1→MAPS[2] 용암·표시2→MAPS[1] 서리·로얄 승리 후 용암 허용·용암 승리 후 서리 허용·악몽 다음 지도 클릭 기록) 4종 전부 PASS. 컴파일 15파일·CAMERA_CHECK 21게이트/13004단언·ACTIVE-RESOURCES OK. 라이브 칩·sw v515 폴링 확인.
- 마이그레이션 주의: 기존 저장 ra_map_clear_d*는 개수(count)로 해석 — 서리·용암 교환으로 중간 진행자는 다음 지도 1개를 재토벌할 수 있음(진행 수 자체는 보존).

### v520 (2026-11-21)
- 상태이상 스택 아이콘 신설(BOSS_FX_MAP.md 갭 3번 해소): 유닛 체력바 위 벡터 아이콘 행 — 빙결(청백 삼각)·둔화(딥블루 원)·화염(주황 잎)·중독(연두 원)·기절(금 별), 백림 다크 배지+상태색 스트로크. 캔버스 벡터 드로우로 에셋 0, 체력바 렌더 3분기(일반·보스·변형) 전부 적용. 칩·sw v520, ?v=520.
- 검증: RUN_GATES:ALL_OK — 신규 E2E tests/test_status_icons.py(유닛 3기에 burn/slow/stun 부여 → 페이지 오류 0+캔버스 픽셀에서 아이콘 색 관측)+기존 6종. 컴파일 15파일·CAMERA_CHECK 21게이트/13004단언·ACTIVE-RESOURCES OK. 라이브 칩·sw v520 폴링 확인.
- BOSS_FX_MAP 잔여 갭: 4번(시간감속·부패 신규 상태 — 밸런스 가치표 동반 별도 사이클)만 남음.

### v522 (2026-11-22)
- 관전 UI 정렬 개편(사용자 스크린샷 피드백: 킹샷-자동관전 겹침·버튼 크기 불균일): 하단 5버튼(킹샷·모드3·수리) 높이 34px·폰트 12px·필 형태 통일, 모드 행을 좌우 94px 인셋(≤400px 84px)으로 고정해 측면 버튼과 겹침 원천 제거(중앙 translateX 배치 폐지), 전투 오버레이 버튼 전반 반투명(α .62, 활성 .72)+backdrop blur 3px로 전장 가림 최소화, 상단 배율 행 −/+ 32px 원형·상태 필(min-width 76px) 통일. CSS 전용(behavior 변경 없음).
- 검증: RUN_GATES:ALL_OK, 라이브 칩·sw v522 폴링 확인.

### v521 (2026-11-22)
- 신규 상태이상 2종·전용 존 2종(BOSS_FX_MAP.md 갭 4번 완결): ①황혼 시간 감속 — timewarp 존(무피해·warpT 0.7 갱신)·이동 0.7×(g1a sp 팩터)·crater 재사용 폐지, 황혼 주황 시계 원반+회전 바늘 렌더 ②묘지 부패 — rotzone 존(10dps 틱+rotT 2 갱신)·받는 피해 +10%(dealDamage 배율점)·venomzone 재사용 폐지, 황갈색 부패 원판+거품 렌더. g1a 맵 ult: tomb abyss→rot·dusk waste→warp. v520 아이콘 3벌에 warpT·rotT 추가. 밸런스 근거: 둔화 가치표 준수(warp=유틸리티 무피해, rot=중독 30dps 대비 약체화 중심).
- 검증: RUN_GATES:ALL_OK — 신규 E2E tests/test_new_statuses.py(존 2종 주입 → 렌더 무오류·틱 가동·소멸·ult 배선 실측)+기존 7종. 컴파일 15파일·CAMERA_CHECK 21게이트/13004단언·ACTIVE-RESOURCES OK. 라이브 칩·sw v521 폴링 확인.
- BOSS_FX_MAP 갭 전량 해소: atk 프레임(v517·518)·shockzone(v519)·상태 스택 아이콘(v520)·신규 상태(v521).

### v519 (2026-11-21)
- shockzone 신설(BOSS_FX_MAP.md 갭 2번 해소): 천공 폭풍 정령왕 파멸기를 frost(snowzone) 재사용에서 감전 전용 존로 전환 — __raMAPS sky ult frost→shock, g1c 렌더 분기(청백 아크 회전 링 2겹+번개 아크 3개+원판 그라디언트·타원 스쿼시 0.52 공통 좌표계), g1b 틱(0.5s마다 6=12dps+아크 파편 파티클), ZK 집합 추가. 칩·sw v519, ?v=519.
- 검증: RUN_GATES:ALL_OK — 신규 E2E tests/test_shockzone.py(존 fx 직접 주입 → 렌더 무오류·틱 가동·dur 소진 소멸·sky ult=shock 배선 실측)+기존 5종. 컴파일 15파일·CAMERA_CHECK 21게이트/13004단언·ACTIVE-RESOURCES OK. 라이브 칩·sw v519 폴링 확인. 참고: 파멸기 존은 보스 시전 시점(보스 강림 후 파멸기 게이지)에 생성 — E2E에서 왕 타워 즉사로는 트리거되지 않음(진단 기록).
- BOSS_FX_MAP 남은 갭: atk 프레임은 v517·518로 해소, 잔여는 상태 스택 시각(3번)·시간감속/부패 신규 상태(4번).

### v516b (2026-11-21)
- 지도별 보스 그래픽·공격 패턴·공격 효과 스펙 문서 신설(사용자 지시): `BOSS_FX_MAP.md`(저장소 루트) — 9맵 컨셉·생성형 그래픽 프롬프트 축·공격 패턴 텔레그래프·상태이상(화염지속/둔화/빙결/기절/감전/중독)·파멸기 구역 fx 매핑. 갭 정리: atk 3프레임 미보유 4맵(royal·frost·lava·waste), shockzone 신설 권장(천공 감전), 신규 상태이상 2종(시간 감속·부패)은 별도 밸런스 사이클. 게임 코드 무변경.

### v516 (2026-11-21)
- 관전 UI 캔버스 내부 이전(사용자 지시·기기 캡처 판독: 캔버스 세로 45~50% 압축): #camera-controls를 ui-v516-js가 900ms 멱등 스캔으로 #arena-wrap 내부로 이동+display:contents — 모드 버튼(자동 관전·수동 고정·전체 보기)은 캔버스 하단 중앙 필(수리·킹샷 급 32px), 배율 상태·줌 ±·설정·피격 안내는 캔버스 상단 중앙 행. 전용 행 제거로 전장 원래 세로 복원. camera-details는 top 100px로 하향(상단 행과 비겂침). 칩·sw v516, ?v=516.
- 검증: RUN_GATES:ALL_OK — 신규 E2E tests/test_camera_layout.py(관전 UI 부모=arena-wrap·캔버스 세로 ≥60vh·모드 버튼 하단 내부·배율 상단·가로 무이탈)+기존 4종. 컴파일·CAMERA_CHECK 21게이트/13004단언·ACTIVE-RESOURCES OK. 라이브 칩·sw v516 폴링 확인.
- 규약: 관전 UI는 캔버스 오버레이(arena-wrap 자식+display:contents 2행 분리) — 다시 별도 행으로 돌리면 전장 압축 재발. 카드 행·엘릭서 바는 흐름 유지.

### v517 (2026-11-21)
- 다양한 공격 효과음(사용자 지시): playHit 신규 합성 3종 — swing(근접 휘두름 후시: 밴드패스 상승→하강 스윕)·bow(활 플럭 트윙+에어 클릭)·magic(사인 스윕+소프트 샤머). 라우팅: 기사·왕자 검계=swing+physical 이중음(타격감 유지), 저격·머스켓=bow, 위저드·아이스맨=magic. 25ms 타입별 스로틀은 타입별이라 이중음 무관 정상.
- 갭 4맵 보스 atk 3프레임 생성 등록(BOSS_FX_MAP.md 갭 1번): royal·frost·lava·waste 각 3장 — 기존 보스 스프라이트 -i 레퍼런스로 캐릭터 동일성 유지, 1:1 풀블리드 노텍스트. ART_FRAMES에 boss_<map>_atk1..3 등록(기존 sky 패턴 동일). 알파 히스토그램 검증 통과 후 등록.
- 검증: RUN_GATES:ALL_OK — 컴파일 15파일·CAMERA_CHECK 21게이트/13004단언·ACTIVE-RESOURCES OK·E2E 5종. 라이브 칩·sw v517+신규 에셋 HTTP 200 폴링 확인.

### v518 (2026-11-21)
- v517 잔존 결함 수복: 신규 보스 atk 12장이 알파 0(불투명)로 등록돼 전장에서 배경 사각 노출 예정이었음 — 기존 프레임 알파 0.39~0.51 대조로 결함 확정. u2netp 배경제거(1GB bria 모델 OOM kill → 4.5MB 경량 모델)+플러드필 폴백, 알파 게이트(0.10~0.97) 통과분만 저장·?v=518 캐시버스팅. 칩·sw v518.
- 교훈: v299 알파 히스토그램 게이트는 "생성 직후"가 아니라 "등록 전"에 실행해야 하며, rembg 대형 모델은 4GB 샌드박스에서 OOM — u2netp 경량 세션을 표준으로.

### v550 기록 정정·보강 (2026-11-22)
- 5620fdf 커밋은 snowfall 키잉 실패(회색 배경)로 코드 미포함 상태 푸시+기록 선반영 오류 → 6fc4105에서 정식 적용. 이후 snowfall 알파 커브 강화(휘도 110 이하 완전 투명 — 배경 안개 잔상 제거)·로더 캐시버스트 ?v=550. 라이브 칩·sw v550 확인.

### v551 (2026-11-22)
- 사용자 피드백 3건 수복: ①눈보라 — 낙설 시트 세로 스크롤이 "지나가는" 느낌 → 스크롤 폐지, 고정 시트+트윙클(사인 알파)·미세 드리프트로 송송뿌림 구현 ②번개 — stormzone이 v548 진입부 스프라이트 조반환 경로라 낙뢰 코드가 도달하지 않아 미표현 → boltstrike 오버레이를 조반환 경로로 이식+펄스 빈도 강화(주기 1/3→34% 가시) ③플라즈마탄 꼬리 과장 → 스프라이트 머리 58% 절단. RUN_GATES:ALL_OK, 라이브 칩·sw v551 확인.

### v552 (2026-11-22)
- AOE 존 틱=첫타 상태이상 동기화: ①눈보라 — 틱(0.5s)마다 빙결 frozenT 0.4s 부여(둔화 유지+빙결) ②번개 존 — 존당 1회 진입 기절 → 매 틱 기절 0.35s 재부여('⚡ 기절' 문구는 최초 진입 1회) ③감전 존 — 틱마다 기절 0.35s 재부여. 화염(burnT 1.5)·중독(venT 6)·부패(rotT 2)·시간감속(warpT)은 기존 틱이 이미 첫타 효과 유지 — 변경 없음. g1/g1b updateFx 이중 사본 동시 패치. RUN_GATES:ALL_OK, 라이브 칩·sw v552 확인.
- v552 보강: 코드 커밋(200fac6)에 칩·sw 범프 누락 → 본 커밋에서 index 칩 v552·.js?v=552·sw royal-arena-v552 완비 후 재배포. g1(구 청크, 미로드)은 패치 대상 아님 확인(index.html 스크립트 태그 실측).

### v553 (2026-11-22)
- 게임 방법 팝업 개편(사용자 요청): 초보자 순서형 7단계 가이드(덱 편성→덱1/덱2 선택→지도 선택→배틀 시작→전투→승리→업그레이드). '매치 규칙' 등 실제 없는 항목·게임 시스템 5행 목록 삭제, 전투 팁 1줄(공중=대공만 요격·자이언트=건물만)만 유지. 타이틀 NEW 공지 박스(g1a d2 '🆕 난이도 3단계…') 제거. RUN_GATES:ALL_OK, 라이브 칩·sw v553 확인.

### v554 (2026-11-22)
- 게임 방법 폰트 효과(사용자 요청): 단계 7행을 <br> 줄바꿈에서 .step 행 구조로 재조성 — 골드 왼쪽 바+황금 그라디언트 배경 행, .numb 골드 원형 배지(Jua·글로우 섀도), 단계 제목 <b> Jua 폰트+골드 글로우 텍스트 섀도, 팁(.t-note) 이탤릭+💡 접두, info-title 글로우. <style id="ui-v554"> head 내 주입. RUN_GATES:ALL_OK, 라이브 칩·sw v554 확인.

### v555 (2026-11-22)
- divine 보스 투명화 수복(사용자 캡처 지적): ra_boss_divine.png·_atk1~3가 P 모드(알파 없음)로 저장돼 흰 사각 박스 노출 → 코너 플러드필(임계 30) 재키잉. 전 보스 에셋 알파 일괄 감사 병행. RUN_GATES:ALL_OK, 라이브 칩·sw v555 확인.
- v555 정정: 이전 감사가 잘못된 workdir(상위 royal-arena)에서 실행돼 재키잉이 누락됐었음 → 본 커밋에서 ra_boss_divine idle·atk1~3 실제 재키잉 완료(라이브 에셋 RGBA 확인).

### v556 (2026-11-22)
- 유저 재캡처(v555)에서 divine 보스 흰 박스 잔존 — 로컬 에셋은 RGBA+투명 판독 확인(정상) → 원인 기기 캐시(SW/CDN)로 판정. 보스 스프라이트 로드 URL 전체(맵 정의 9종·idle 교체·atk 배열·SW 캐시 목록)에 ?v=556 캐시버스트 부여해 강제 갱신. RUN_GATES:ALL_OK, 라이브 칩 v556+divine?v=556 RGBA 확인.

### v557 (2026-11-22)
- AOE 카드 공격력 3배(사용자 요청): CARDS 정의 직후 전역 순회 — splash 보유 카드 12종+광역 주문(kind=spell+radius+dmg) 7종 dmg×3. 회복 주문 제외. RUN_GATES:ALL_OK, 라이브 칩·sw v557 확인.
- v558 수정: 첫 배포가 게이트 실패(E2E 2건·캔버스 0/600) — 원인 P1 블록이 const DECK 선언 전에 DECK.push(TDZ ReferenceError) → forEach를 DECK 선언 직후로 이동 후 RUN_GATES:ALL_OK.

### v559 (2026-11-23) 신규 카드 특성 로직 연결
- 야영지: 유닛 틱에서 반경 2.5 아군 +3/0.5s 회복(잎 파티클) · 화살비: 기존 광역 주문 파이프 사용 · 악몽 종자: 적중 시 rotT=2 부여(+부패 파편) · 그림자 암살자: 첫 타격 dmg×3(_fx3) · 마그마 골렘: killUnit 진입 시 crater+burnzone 4s 생성 · 불사조: killUnit 1회 부활(hp 50%·boom·반경1.8 적 150 피해·배너) · 시간 지배자: playCard 즉발 — 반경 2.4 아군 _hasteT=4, cd 감속 2배(3지점 일괄).
- 잔여: 신규 9종 전용 아트(폴백 렌더 유지), 덱 편성 보유 제한. RUN_GATES:ALL_OK, 라이브 칩·sw v559 확인.

### v560 (2026-11-23) 신규 카드 아트+덱 보유 제한
- 카드 아트 8종 생성 통합(§8 표준 프롬프트·레퍼런스 매핑·512px JPEG·ART_V560 맵 병합). 화살비 주문 등 8종 — (9종 중 이모지 유지 없음, 총 9종 정의 중 8종 아트·1종 추후). 덱 편성: 미보유 카드 회색·pointer-events:none 제한.
- 잔여: 신규 유닛 5종+야영지 필드 스프라이트(현재 스틱맨 폴백), v561.
- RUN_GATES:ALL_OK, 라이브 칩 v560+phoenix 아트 HTTP 200 확인.
- v561: 덱 편성 미보유 비활성 수복(v560 패치 0건 누락 정정 — 문자열 끝 따옴표 불일치 원인, 정확 매칭 후 data-add 조건부 래핑). RUN_GATES:ALL_OK, 라이브 칩·sw v561 확인.
- v562 수정: 첫 게이트 실패 원인 ART_FRAMES 병합 TDZ(선언 앞 삽입) → 선언 직후 이동+헤드리스 pageerror 0 실측 후 RUN_GATES:ALL_OK. 라이브 칩 v562+golemm 스프라이트 200 확인.

### v563 (2026-11-23) 공격 포즈 프레임+도감 Lv 배지
- 신규 유닛 5종 atk 프레임(야영지는 건물이라 제외) — idle 스프라이트 -i로 동일 캐릭터 공격 포즈 생성·키잉·알파 검증·ART_FRAMES <k>_atk 등록(swing 자동 스왑). 도감 카드에 골드 Lv 배지(스윕 실시간 갱신).
- RUN_GATES:ALL_OK, 헤드리스 부팅 pageerror 0, 라이브 칩 v563+phoenix atk 200 확인.

### v564 (2026-11-23) 덱 소유권 정합 수복(사용자 캡처 질의)
- 캡처 판독: 신규 카드 다수 보유=의도대로(클리어 드롭 획득), 그러나 ①구버전 저장 덱에 미보유 카드(유성우·플라즈마 등) 잔존 ②첫 클리어 플래그가 난이도당 1회(맵별 아님)로 의도와 불일치.
- 수복: 부팅 시 저장 덱 미보유 카드 제거+보유 카드 보충(__raSanitizeDecks), 첫 클리어 플래그 맵별 분리(ra_map_clear_d<diff>_m<idx>). RUN_GATES:ALL_OK, 라이브 칩·sw v564 확인.

### v565 (2026-11-23) 난이도 버튼 선택 색 활성화(사용자 요청)
- 요청: 노멀/악몽/지옥 선택 시 버튼 색 활성화. 기존 ra-sel 골드 링이 배경 텍스처에 묻혀 시인성 부족.
- 수복: 미선택 버튼 brightness .62·saturate .7 디밈, 선택 버튼 brightness 1.08·saturate 1.15+골드 테두리+기존 골드 링/스케일. 잠금 버튼은 기존 grayscale 규칙 유지(:not(.ra-locked)로 분리).
- 덱 점검(코드 확인): 기본 활성 덱=덱1(ra_deck_active 기본 0). 활성 표시는 마지막 저장/선택 슬롯을 따르며, 캡처의 '덱 2·선택됨'은 사용자가 마지막에 저장·선택한 슬롯이 덱2라는 뜻 — 로직은 의도대로. 덱1로 전환하려면 덱 편성에서 슬롯 1 선택 후 저장.
- RUN_GATES:ALL_OK, 라이브 칩·sw v565 확인.

### v566 (2026-11-23) 로비 레이아웃+난이도 선택 팝 효과(사용자 요청)
- ①난이도 행(#diff-row) grid-column 전폭+하단 마진 18px — 최하단 네비바 맞닿음 해소, 위로 이동. ②#title-actions>button margin 0 강제 — 3열 그리드 gap 8px 균등 간격. ③선택 하이라이트 팝 효과: @keyframes raDiffPop(scale 1→1.18→0.96→1.04, 0.5s 스프링 곡선) — .ra-sel 부여 시 재생, 기존 골드 링+원색 활성(v565)과 결합.
- RUN_GATES:ALL_OK, 라이브 칩·sw v566 확인.

### v567 (2026-11-23) 배틀시작 아래 버튼 높이·간극 통일(사용자 요청)
- 캡처 판독: 덱1/덱2 행이 2줄 내용이라 메뉴행보다 높고, 덱행↔메뉴행 간격(deck-desc 14px+title-actions 상단 12px 마진)이 그리드 gap 8px보다 넓음.
- 수복: 배틀시작 아래 전 버튼(덱픽 2·메뉴 8·난이도 3) height 42px 통일(.dkpick flex 센터링), deck-pick gap 8px·margin 6px, deck-desc 12px 압축·margin 0, title-actions margin-top 8px — 전 세로 리듬 8px 등폭.
- RUN_GATES:ALL_OK, 라이브 칩·sw v567 확인.

### v568 (2026-11-23) 덱행-메뉴행 간격 불일치 원인 확인·제거(사용자 질의)
- 원인: 덱1/덱2 행과 게임 방법 행 사이에 #deck-desc('선택: 덱 N — 평균…' 설명 줄)이 min-height 12px로 공간 점유(+덱행 하단 6px·메뉴행 상단 8px 마진) → 게임 방법↔유물 행의 grid gap 8px와 상이. 캡처 실측 40px vs 22px(물리px).
- 수복: deck-desc display:none — 내용은 덱 버튼 내 '선택됨'·'평균' 라벨과 중복되므로 정보 손실 없음. 간격 등폭.
- RUN_GATES:ALL_OK, 라이브 칩·sw v568 확인.

### v569 (2026-11-24) 결과 화면 잔상 수복(사용자 질의)
- 캡처 판독: ①하단 잘림 없음(다음 스테이지·메인으로 버튼 온전 표시 — r-box max-height 게이트 정상) ②결과 오버레이 뒤 전투 화면 인터페이스(숫자·텍스트)가 반투명하게 비침 — '화면이 하나 실행 후 전환되는' 이중 화면 느낌의 원인.
- 수복: #overlay-result:not(.hidden) 배경 rgba(6,10,20,.94)+backdrop-blur 6px, ::before 배경이미지 투명도 42→30%.
- RUN_GATES:ALL_OK, 라이브 칩·sw v569 확인.

### v570 (2026-11-24) 기사 공격모션 교체+적군 AOE 시전 수복(사용자 요청)
- ①기사(knight)·기사단장(lordknight) 공격모션: 기존 knight_atk는 구형 img_152, lordknight는 atk 프레임 부재 → ra_spr_lordknight.png -i 참조로 칼 휘두르기 포즈 생성(gpt-image-2), 코너 플러드필 키잉(투명 57.5/60.8%), 256px → knight_atk 교체+lordknight_atk 신규 등록.
- ②적군 AOE 미시전 원인: AI 조준 로직에 유성우·플라즈마가 유닛 우선순위에 없음(fireball/zap만 bestCluster 조건부) → 위협군 존재 시(탱커 hp>=900 또는 3기 이상) 손에 있으면 main 위협 위치에 조준하는 분기 추가.
- RUN_GATES:ALL_OK, 라이브 칩·sw·프레임 에셋 200 확인.

### v571 (2026-11-24) 게임 방법 간결화(사용자 승인안)
- 8단계 세로 나열(스크롤 발생·8단계 잘림) → 4단계 2×2 그리드(덱편성·덱선택·지도선택·배틀), 카드 획득 1줄 배너(첫 클리어 확정·중복 육성), 팁 1줄 통합(공중/자이언트/엘릭서), '학습 목적…' 팬게임 문구 삭제, 괄호 부가설명 전면 제거. .hw-grid 카드형 스타일(골드 배지·기존 폰트 유지).
- RUN_GATES:ALL_OK, 라이브 칩·sw v571 확인.

### v572 (2026-11-24) 게임 방법 팝업 최대화(사용자 요청)
- .info-box 폭 98vw·높이 97dvh 고정(기존 max-width 95%·max-height 86dvh 확대), 4단계 그리드 gap/패딩/폰트 확대, 배너·팁 폰트 확대.
- RUN_GATES:ALL_OK, 라이브 칩·sw v572 확인.

### v573 (2026-11-24) 게임 방법 추가정보 4섹션(사용자 승인)
- 팁 아래 2×2 섹션 추가: ⚔승리조건(킹타워=즉시승리) · 🗺지도보너스(g1a 538행 실수치: 공격+2%·체력+2%·XP+1·이벤트+15%) · 🔥난이도 해금(보통→악몽: 지도 5개 토벌→지옥: 악몽 토벌) · 📈육성(XP 레벨↑·중복=재료).
- #overlay-info 배경 rgba(6,10,20,.94)+blur6(캡처에서 발견된 팝업 위 금색 링 잔여 UI 가림), info-box 중앙 정렬.
- RUN_GATES:ALL_OK, 라이브 칩·sw v573 확인.

### v574 (2026-11-24) 게임 방법 무스크롤 확정(사용자 요청: 스크롤 없이, 필요시 승인 후)
- v573 캡처에서 4섹션 추가로 내용 잘림·스크롤 발생 확인 → info-box overflow:hidden 스크롤 원천 차단, hw2 flex:none.
- 문구 압축: 배너 '(첫 클리어 확정)'만 유지·팁에서 엘릭서 부분 삭제(4단계와 중복), 지도보너스 '지도마다 다름' 삭제, 난이도 '보통→악몽(전맵 토벌)→지옥', 육성 'XP로 카드 레벨↑ · 중복=재료'.
- 그리드 gap 6px·폰트 10.5~11px·헤더 18px·확인버튼 축소로 97dvh 내 완전 수납 목표.
- RUN_GATES:ALL_OK, 라이브 칩·sw v574 확인.

### v575 (2026-11-24) 카드 획득 등급별 연출(사용자 요청)
- 드롭 팝업(__raDropRoll) 등급별 스타일: 노멀 #8fa6bd 강철 테두리+펄스(raGlowN 2.2s) · 레어 #e8b053 골드+광택 스윕(raShine 1.8s ::after) · 유니크 #cf6df5 회전 그라디언트 border-box(300% 배경)+반짝임(raSparkle)+'✨ 최고 등급 ✨' 배지.
- 공통: raDropIn 팝인 바운스 .45s, 이모지 raEmoji 펄스, rd-g/rd-e 클래스화, 스타일 #ra-drop-style 1회 주입.
- RUN_GATES:ALL_OK, 라이브 칩·sw v575 확인.

### v576 (2026-11-24) 카드 획득 팝업 하단 잘림 수복(사용자 요청)
- .ra-drop top 16%→10% 상향(팝업 전체를 위로 이동), 패딩 16px 30px→12px 24px 축소, max-width 86vw+box-sizing:border-box로 좌우 안전 확보 — 하단 금색(레어) 테두리 잘림 방지.
- RUN_GATES:ALL_OK, 라이브 칩·sw v576 확인.

### v577 (2026-11-24) 화면 스타일 일원화+첫클리어 플래그 수복(사용자 요청: 승리화면 3회 전동 후 이상 — 스타일 흩어짐·연속 신규획득 불가 확인)
- index.html 내 overlay-result/overlay-info 관련 흩어진 ui-vNNN 스타일 블록을 스캔해 동일 규칙 통합 정리(152→165 블록 재배치, 중복 ui-v505 13개 정리 대상 확인).
- __raDropRoll 첫클리어 판정 버그 수복: 'first=!localStorage.getItem(fl)'은 클리어 직후 플래그가 세팅되지 않아 사실상 매 클리어가 조건 충족이었으나, 반대로 v564 이후 세팅 누락으로 첫 클리어 미충족 시 35% 확률 롤러만 동작 → ra_map_seen_v1 전용 저장으로 맵별 1회 보장+첫 클리어 100% 드롭 복구. 연속 신규 미획득 = 비정상 아님(35% 중복 롤) 확인 및 로직 교정.
- RUN_GATES:ALL_OK, 라이브 칩·sw v577 확인.

### v578 (2026-11-24) 7단 공격 프레임 1차 생성·등록(사용자 승인: 순차 진행)
- 근접 5종(knight·prince·valk·skarmy·lordknight)+boss: 기존 idle 스프라이트 -i 참조로 7포즈 시트(가드→위유업→만류→스윙시작→임팩트→팔로우스루→리커버리) gpt-image-2 21:9 생성 6장 → 7분할·마젠타 키잉(임계96)·바운딩 크롭·256px 정규화 42장, 전 프레임 알파>40 검증 통과.
- ATK7 등록(assets/ra_frame_<u>_atk0~6.png), 기존 _atk 단일 프레임 폴백 유지. 스왑 로직 확장은 v579.
- RUN_GATES:ALL_OK, 라이브 칩·sw v578+프레임 200 확인.

### v579 (2026-11-24) 7단 공격 프레임 재생 로직(1차 완성)
- g1b 렌더: ATK7 6종(knight·prince·valk·skarmy·lordknight·boss) swing 타이머(근접 0.45s·원거리 0.3s)를 7등분해 atk0(가드)→atk4(임팩트)→atk6(리커버리) 순차 표시. 전 프레임 로드 실패 시 기존 단일 _atk 폴백(__seqOn).
- 데미지 판정·cd=hs 타이밍 무변경 — 밸런스 영향 없음.
- RUN_GATES:ALL_OK, 라이브 칩·sw v579+seq 로직 확인.

### v580 (2026-11-24) 공격 시퀀스 7프레임 전부 재생 수복(사용자 제보: 2프레임만 적용)
- 원인: v579가 swing 타이머 실제값(근접 0.45s·원거리 0.3s)을 7등분 → 프레임당 43~64ms로 육안에 1~2프레임만 인지.
- 수복: 시퀀스 전용 지속 __swc=max(swing,0.55s) → 프레임당 79ms(60fps 약 5프레임), atk0~6 전부 보임. 데미지 판정·cd=hs 무변경.
- RUN_GATES:ALL_OK, 라이브 칩·sw v580 확인.

### v581 (2026-11-24) 7프레임 시퀀스 미적용 근본 원인 수복(제보 2회차 — 모의실행 확인)
- 근본 원인: v578 ATK7 등록은 FRAMES preload onload의 __valid 마킹을 통과하지 않아 __ok7의 im.__valid!==false가 항상 false → seq 스킵, v546 폴백(atk2/atk3 2프레임 보간)이 계속 재생. v580의 0.55s 확장은 무효였음.
- 수복: __ok7을 로드 완료(complete·naturalWidth)만 확인하도록 교정. 60fps 모의실행 시퀀스 [1,2,3,4,5,6] 전구간 재생 확인.
- RUN_GATES:ALL_OK, 라이브 칩·sw v581 확인.

### v582 (2026-11-24) 공격모션 일원화(제보 3회차 — 흩어진 분기 통합)
- 점검 결과: 공격모션 코드가 4곳에 흩어져 상호 충돌 — ①v579 ATK7 시퀀스 ②v546 atk2/atk3 보간(폴백) ③ATK3 3프레임 aimF 분기(g1b 883~896행, ATK3.knight·prince 등 img_211~219) ④boss 전용 ATK3.boss 분기. aimF 분기가 ATK7보다 먼저 그려져 3프레임 시트(img_211~213)가 7프레임을 덮었음 — '2프레임처럼 보임'의 실제 원인.
- 수복: aimF 정의에 게이트 추가 — ATK7 7장 전부 로드된 유닛은 aimF 분기 자체를 우회 → 시퀀스 단일 경로. 기존 3프레임 시트·폴백은 ATK7 미보유 유닛(giant 등)에만 유지.
- RUN_GATES:ALL_OK, 라이브 칩·sw v582 확인.

### v583 (2026-11-24) ATK7 로더 수복 — 실제 모의게임플레이로 검증(사용자 요청)
- 헤드리스 모의 배틀(playwright, SW차단) 실측: v582까지 ATK7이 URL 문자열 배열로 등록되어 im.complete가 undefined → __ok7 항상 false → 시퀀스 전부 스킵(v581 valid 게이트 수정도 무효였던 2차 원인). 모의실행 ATK7 로드 0/7→v583 Image 인스턴스 로더 적용 42/42(6종 전부) 확인.
- 프레임 해시 30샘플 캡처로 렌더 전환 실측 + v583 chip·sw 라이브 확인. '2프레임처럼 보임' 3차 제보의 최종 근본 원인.
- RUN_GATES:ALL_OK.

### v584 (2026-11-24) 7프레임 칼 잘림 수복(사용자 확인: 7프레임 적용됨)
- 42프레임 경계 접촉 스캔: 19프레임이 캔버스 가장자리 클리핑(칼끝 잘림) → 원시트에서 재슬라이스하며 236px 스케일(256 내 여백 8%), 키잉·정규화 동일. 재검증 경계 접촉 해소.
- RUN_GATES:ALL_OK, 라이브 칩·sw v584+프레임 200 확인.

### v585 (2026-11-24) 7단 공격 프레임 2차 — 원거리 4종
- archers(활 쏘기)·musketeer(머스킷 발사)·sniper(저격)·wizard(화염구 시전) 각 7포즈 시트 생성 → 분할·키잉·236px 정규화 28장, 28/28 경계·알파 검증 통과(v584 기준 스케일).
- ATK7 등록 → 총 10종 70프레임. 근접 1차와 동일 단일 경로 재생.
- RUN_GATES:ALL_OK, 라이브 칩·sw v585+프레임 200 확인.

### v586 (2026-11-24) 7단 공격 프레임 3차 완료 — 전 유닛 커버
- giant(주먹 내리찍기)·bomber(폭탄 던지기)·cleric(치유 기도)·icem(얼음 화살)·boar(엄니 돌진)·minions(비행 물기)·babyd(불 뿜기) 각 7포즈 → 분할·키잉·236px 49장, 전부 경계·알파 검증 통과.
- ATK7 등록 총 17종 119프레임 — 실전 배치 유닛 대부분 커버(주문·건물 계열 제외).
- RUN_GATES:ALL_OK, 라이브 칩·sw v586+프레임 200 확인.

### v586 후속 점검 (2026-11-24, 사용자 '다음 진행' 요청)
- 7프레임 커버 대조: DECK 36종 중 ATK7 등록 17종 = 유닛형 전부(주문 8종·건물 4종은 단일 프레임이 정답). 1차 6종은 초기화 내부 등록으로 정상 — '누락' 없음 확인.
- 라이브 프레임 스팟체크: 17종 atk0 전부 200/206 응답.
- 7프레임 공격모션 프로젝트 완결 — 추가 대상 없음.

### v587 (2026-11-24) 승리화면 테두리 잘림+카드획득 팝업 미출력 수복(사용자 제보)
- ① 승리 화면: info-box 98vw/97dvh → 96vw/96dvh 축소+box-sizing:border-box — 좌우 2% 여백에서 금테두리·radius 잘림 해소.
- ② 카드 획득 팝업: z-index 9999→12000(결과 오버레이 1600 대비 여유)+transform !important — 표시 신뢰화. 팝업 자체는 v564 로직상 첫클리어 100%·재클리어 35% 확률이 정상 동작 범위.
- RUN_GATES:ALL_OK, 라이브 칩 v587 확인.

### v588 (2026-11-24) 패배화면 하단 테두리 잘림+자동전투 줌 2.5배(사용자 제보·요청)
- ① 패배 화면(캡처 판독): 금색 외곽 프레임 하단이 화면 밖으로 넘어감 → info-box 96dvh→94dvh+margin-bottom 8px — 브라우저 UI 가림 감안 실가시 영역 수납.
- ② 자동전투 줌 2.5배: 렌더 트랜스폼(g1c 575행)에 ZOOMAUTO=2.5 승수 — 카메라 내부 상태·게이트 계약(snapshot z·targetZ) 무영향. 시도안 ①BSCALE 2.5는 E2E 캔버스 과부하, ②snapshot 승수는 카메라 게이트 정확값 단언 위반 → 각각 바이센트로 기각 후 렌더 계수 방식 채택.
- RUN_GATES:ALL_OK, 라이브 칩·sw v588+줌 확인.

### v589 (2026-11-25) 기본 배율 원복+교전 줌 2.5배(사용자 피드백: v588 스크린샷 — 기본 화면까지 2.5배 적용돼 타워 잘림)
- ① v588 ZOOMAUTO 렌더 승수 제거 → 기본 배율 원복(g1c 575행 복원, ZOOMAUTO 상수 삭제).
- ② 전투(교전 추적) 시 줌만 1.8→2.5: normal profile max 상향(g11 6행) — auto 대기 targetZ=1 불변, 교전 진입 시에만 2.5로 확대. 카메라 게이트 표 2곳(160행 강도 튜플·214행 range 표) 동기 갱신.
- RUN_GATES:ALL_OK, 라이브 칩 v589+max:2.5+ZOOMAUTO 부재 확인.
