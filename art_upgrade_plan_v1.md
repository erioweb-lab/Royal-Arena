# 로얄 아레나 — AoE 이펙트·공격 모션 생성형 그래픽 업그레이드 계획 + 프롬프트 패키지 (v1, 2026-11-22)

> 기준: royal-arena-art-pipeline 스킬(v328·v329·v323·v404 규약) + v543 캡처 판독(평면 타원 AoE 오버레이·스프라이트 깊이 겹침 지적).
> 모든 프롬프트는 `gsk image_generation "<프롬프트>" -m gpt-image-2` 로 실행. 기존 아트 파생은 반드시 `-i <레퍼런스>`로 화풍 통일.

---

## 0. 공통 스타일 토큰 (모든 프롬프트 뒤에 부착)

```
hand-painted mobile game art, Clash-Royale-like painterly style, rich saturated colors,
clean thick outlines, soft rim light, transparent background, no drop shadow,
no text, no letters, no frame, no watermark
```

- 지면 존류: `+ top-down view, circular seamless ground decal, slight top-down perspective` (정사각 1:1)
- 유닛 프레임류: `+ side-view sprite, same pose proportions as reference` (기존 idle을 `-i`로)
- 투명화: 생성 후 코너 플러드필 키잉 + 알파 밴드(3~85%) 검증을 패치 적용 **전**에 실행(스킬 v323/v328 규약).

---

## 1. 현황 갭 (v543 실측)

| 구분 | 현황 | 갭 |
|---|---|---|
| 지면 존 스프라이트 | frost(눈보라)만 `__FXIMG` 스프라이트 적용, 나머지 존은 캔버스 그라디언트/타원 | 감전·부패·시간왜곡·폭풍·플라즈마·독·화상 존이 평면 타원으로 떠 보임(캡처 지적 ②) |
| 존 렌더 순서 | ZK 2패스(유닛 아래) 정착(v404) | 유지 — 신규 존 추가 시 ZK 등록 감사만 |
| 유닛 공격 모션 | atk 프레임 위주, 일부 유닛 walk 미보유 | 이동 중 다리 고정 미끄러짐(스킬 v323 실증)·공격 예비동작 없음 |
| 보스 모션 | 지도별 idle+atk1~3 존재(v543~544 교체) | 스윙 간 프레임 2장이라 뚝뚝 끊김·강림 연출 없음 |
| 투사체 | ART_PROJ 16방향 베이크 | 신규 탄환 누락 시 단색 선 폴백(v334 감사 유지) |

---

## 2. 적용 계획 (우선순위 순 — 각 단계 dev-pipeline 게이트로 배포)

### P1 — 지면 존 스프라이트화 (캡처 지적 ② 직결, 효과 큼)
- 파일명 규격: `ra_fx_<존>.png` 512px → `__FXIMG.<키>` 로더 등록 → `drawFx` 존 브랜치에 스프라이트 선표현+동적 오버레이(펄스·파티클)만 캔버스 유지(v328 레시피).
- 대상: `shockzone(감전)` → `rotzone(부패)` → `warpzone(시간)` → `stormzone(지속번개)` → `plasmazone` → `venomzone`/`burnzone`(기존 틴트 개선).
- 검증: 존 위에서 유닛·타워 가림 0(판독), 틱 데미지 회귀(ETEST), 폴백 드로잉 유지.

### P2 — 유닛 walk 프레임 보강 (공격·이동 자연스러움)
- walk 미보유 유닛 감사(ART_FRAMES에서 `<k>_walk` 부재 목록) → idle을 `-i`로 걷기 프레임 생성 → 스케일 정규화(알파 bbox 높이 비율 0.92~1.08, 캔버스 분율 계산) → 등록.
- 공격 예비동작(anticipation)은 atk 앞 0.1s 스윙 프레임(`ra_atk_<k>_wind.png`) — 근접 유닛 우선 3종 시범 적용 후 확산.

### P3 — 보스 모션 고도화
- 지도별 atk 프레임 스케일 정규화(캡처 지적 ①: 배경 대비 크기 이질감) — idle 대비 높이 비율 측정 후 발바닥 정렬.
- 강림 연출 스프라이트(`ra_fx_bossgate.png`: 지면에서 솟는 어둠의 문) + 파멸기 충전 오라(`ra_fx_doomaura.png`).

### P4 — 투사체 감사 보강
- 탄환 kind 집합 ⊆ ART_PROJ 키 집합 단언 게이트 상시화(v334) — 누락분 프롬프트는 카드 아트 `-i` 파생.

---

## 3. 프롬프트 패키지

### 3.1 지면 지속 존 (P1 — 512px, top-down)

**감전 존 `ra_fx_shock.png`**
```
Top-down circular ground decal of an electrified storm zone: cracked scorched earth
with crackling blue-white lightning arcs crawling across the ground, small tesla
sparks and glowing electric filaments, faint charged mist at the rim, dark center
that does not obscure the ground, painterly mobile game art style, vivid saturated
colors, clean edges, circular composition filling the square, transparent background,
no drop shadow, no text
```

**부패 존 `ra_fx_rot.png`**
```
Top-down circular ground decal of a rotting corruption zone: sickly green-purple
blighted bog, bubbling slime pools, scattered bone shards and withered tendrils,
toxic mist at the edge, translucent center so units remain visible, painterly mobile
game art style, vivid saturated colors, clean edges, circular composition, transparent
background, no drop shadow, no text
```

**시간 왜곡 존 `ra_fx_warp.png`**
```
Top-down circular ground decal of a time-warp field: golden glowing clock runes
rotating in a ring, floating sand grains frozen mid-air, soft amber lens distortion
at the center, antique gold and deep indigo palette, translucent center so ground and
units stay visible, painterly mobile game art style, clean edges, circular composition,
transparent background, no drop shadow, no text
```

**지속 번개 존 `ra_fx_storm.png`**
```
Top-down circular ground decal of a persistent lightning storm field: dark stormy
ground with vertical lightning bolts striking down inside the circle, electric-blue
afterglow, small scorch marks, translucent center so units remain visible, painterly
mobile game art style, vivid saturated colors, clean edges, circular composition,
transparent background, no drop shadow, no text
```

**플라즈마 존 `ra_fx_plasma.png`** — 기존 플라즈마 카드 아트를 `-i` 레퍼런스로
```
Top-down circular ground decal of a plasma burn zone, matching the referenced card's
magenta-cyan energy palette: molten energy pool with slow electric ripples, glowing
cracks radiating from the center, translucent center so units stay visible, painterly
mobile game art style, clean edges, circular composition, transparent background,
no drop shadow, no text
```

**독 존 `ra_fx_venom.png` / 화상 존 `ra_fx_burn.png`** — 위 템플릿에 각각
`bubbling toxic green pools with dripping venom` / `glowing embers, small flames and
blackened cracks` 로 치환. 눈보라는 frost 스프라이트 기존 유지(보강 시에만 재생성).

### 3.2 타격·스윙 버스트 (P2 시범 — 기존 hit/slash/boom 스프라이트 화풍 리프레시)

**베기 버스트 `ra_fx_slash2.png`**
```
Single-frame melee slash arc effect: bright curved steel-white slash with golden edge
trail, motion smear, transparent background, no character, painterly mobile game art
style, vivid saturated colors, clean edges, no text
```

### 3.3 유닛 걷기/예비동작 프레임 (P2 — 반드시 `-i` 레퍼런스)

**walk 프레임 (유닛별, idle을 `-i`로)**
```
The exact same character from the reference, now mid-walk: one leg forward and one
leg back, arms swinging naturally, identical armor, colors, weapon and proportions,
side-view sprite, transparent background, no drop shadow, no text
```

**공격 예비동작 `ra_atk_<k>_wind.png` (근접 유닛, idle+atk를 `-i`로)**
```
The exact same character from the reference winding up for a melee swing: weapon
pulled back behind the shoulder, body slightly coiled, identical armor, colors and
proportions, side-view sprite, transparent background, no drop shadow, no text
```

### 3.4 보스 모션·연출 (P3)

**보스 공격 스윙 보간 `ra_boss_<테마>_atk_mid.png` (지도별 atk1을 `-i`로)**
```
The exact same boss character from the reference, captured mid-swing between wind-up
and impact: weapon sweeping forward with motion smear, cloak billowing, identical
armor, colors and proportions, transparent background, no drop shadow, no text
```

**강림 문 `ra_fx_bossgate.png`**
```
A dark summoning gate erupting from the ground, top-down-ish 3/4 view: cracked earth,
purple-black shadow tendrils and golden runes spiraling upward, ominous glow at the
center, painterly mobile game art style, vivid saturated colors, transparent background,
no drop shadow, no text
```

**파멸기 충전 오라 `ra_fx_doomaura.png`**
```
A menacing charging aura ring around a giant boss: pulsing crimson-orange energy
spiraling inward, ember particles rising, ground cracks glowing beneath, painterly
mobile game art style, transparent background, no drop shadow, no text
```

---

## 4. 검증 게이트 (생성물마다)

1. 알파 밴드(불투명 3~85%) 통과 — 패치 적용 **전** 단언, 실패 시 체인 중단.
2. 스케일 정규화 — idle 대비 높이 비율 0.92~1.08(캔버스 분율), 발바닥 정렬 ±3%.
3. 존류 — ZK 2패스 렌더 확인(유닛 가림 0) + 틱 데미지 ETEST 회귀 + 폴백 드로잉 유지.
4. 화풍 일치 — 기존 카드/유닛 아트와 나란히 배치 판독(채도·아웃라인·셰이딩).
5. 릴리스 — index 참조 + sw.js 버전 bump + QA 게이트 통과 후 HANDOFF/progress 기록.

## 5. 산출물 등록 위치 (코드 포인트)
- 존 스프라이트: `__FXIMG` 로더(g1c) + `drawFx` 각 존 브랜치 선표현 분기
- walk: `ART_FRAMES`에 `<k>_walk` 등록(boar_walk 앵커 뒤) — 재생 로직(v303) 자동
- 보스 프레임: `spawnBossNow`의 v543~544 스왑 블록이 `ra_boss_<테마>*`를 이미 로드 — 신규 atk_mid는 `__mk` 배열에 'atk_mid' 삽입
- 파티클: 스프라이트는 "질감", 캔버스 파티클은 "생동감" 원칙 유지(v328)
