# 로얄 아레나 인수인계 문서 (HANDOFF)
> 최종 갱신: 2026-11-10 (v391 기준) — 이전 세션의 작업 결과·현재 상태·검증 절차를 담는다. 매 사이클 종료 시 갱신 의무(dev-pipeline G5).

## 1. 현재 버전·배포 상태 (v382, 코드 게이트 통과·라이브 검증 진행)
- 라이브: https://erioweb-lab.github.io/Royal-Arena/royal-arena/ — 칩 v381·sw 캐시 v381 동기화 확인.
- 저장소: github.com/erioweb-lab/Royal-Arena (main) — 푸시는 사용자 제공 토큰으로만 가능(샌드박스 미보유). 사용 후 즉시 삭제, 세션마다 재수령.

## 2. 최근 사이클 요약 (v370~v380, 모두 라이브 실측 검증)
- **v370~371** 버튼 텍스처 유성우·불티 파티클 제거: 결정적 인페인트(산발 파티클·화염 꼬리, 프레임 보호영역 0px) → 구체 장식은 v371 생성형 재생성(1728×576 유지).
- **v373~374** 로비 메뉴 버튼 플랫화(문양·광택·발광 제거)+전 버튼 전환효과 제거: 강제기는 보존 대상(CTA·맵 칩·팝업 소형)만 다시 입히는 축소판 ui-v373-js로 유지 — 삭제 시 내장 리스타일러가 문양을 통째로 되돌림(v373 실증).
- **v376~377** 오디오 엔진 전면 재구축: 구 엔진(AC 즉시 생성+running 게이트 무시)이 기기 무음의 원인 — __RA_AUDIO 싱글턴(첫 제스처 지연 생성+언락 리스너 4종+마스터 게인→컴프레서)으로 교체. 음소거 해제 확인음 프로브(소리 버튼 클릭 시 deploy음) 포함. 사용자 기기 정상화 확인.
- **v378** 결과 세부 집계에 상단 통계 바 전항목 표현: 신규 행 5종(최고 연승·첫승 보너스·XP·SP·상단 통계 전체 미러 rt-mirror)+패널 스크롤 폴백. 미러는 ra-stats 전문 재표현이라 상단 바 항목 추가 시 자동 따라감.
- **v380** BGM 제거(bgmStart/Stop no-op 호환)+타격음 신시사이저 playHit(type,isCritical) 6속성(physical·flame·frost·lightning·cannon·boss)+크리티컬 레이어, 근접 12지점 유닛별 연결. 25ms 타입 스로틀.

## 3. 핵심 아키텍처 (훼손 금지 — 감사 게이트가 지켜본다)
- 오디오: js/g1-art-assets.js의 `__RA_AUDIO` 싱글턴 + playHit/sfx 이중 레이어. 발화 경로에 state 무시 게이트 재도입 금지(기기 영구 무음 재발 — v376 확정).
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
