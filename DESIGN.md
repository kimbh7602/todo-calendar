# Design System — Living Calendar

## Product Context
- **What this is:** 캘린더 기반 투두리스트 앱. 공간 줌 전환과 파티클 완료 효과로 차별화.
- **Who it's for:** 매일 할 일을 관리하는 사람. 직접 사용 + 개발자 포트폴리오.
- **Space/industry:** 생산성 / 투두 앱 (투두메이트, Todoist, Notion Calendar 참고)
- **Project type:** 모바일 우선 웹앱 (Full CSR)

## Aesthetic Direction
- **Direction:** Playful-Refined — 다크모드에서 빛나는 미니멀리즘
- **Decoration level:** Intentional — 파티클과 카테고리 색상 점이 장식 역할. 추가 장식 불필요.
- **Mood:** 어두운 캔버스에서 색상이 빛나는 느낌. 체크할 때 기분 좋은 피드백. 매일 열고 싶은 도구.
- **Reference:** 투두메이트 (캘린더+투두 통합), Superlist (사운드+모션), Google Calendar (멀티데이 바)

## Typography
- **Display/Hero:** Pretendard Variable 700 / 28px — 한국어+라틴 최적의 가변 폰트
- **Body:** Pretendard Variable 400 / 16px — 높은 가독성, line-height 1.4
- **UI/Labels:** Pretendard Variable 600 / 12px — letter-spacing 0.04em
- **Data/Tables:** Geist Mono — 숫자 정렬이 필요한 곳에
- **Code:** Geist Mono
- **Loading:** CDN `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css` (dynamic subset으로 한국어 글리프 최적 로딩)
- **Scale:**

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| hero | 28px / 1.75rem | 700 | 1.2 | 월 헤더 |
| title | 22px / 1.375rem | 700 | 1.2 | 투두 화면 날짜 |
| body | 16px / 1rem | 400 | 1.4 | 투두 제목 |
| label | 12px / 0.75rem | 600 | 1.0 | 카테고리 라벨 |
| caption | 11px / 0.6875rem | 500 | 1.0 | 멀티데이 바 텍스트 |
| day-number | 14px / 0.875rem | 500 (700 selected) | 1.0 | 캘린더 날짜 |

## Color
- **Approach:** Expressive on dark canvas — 어두운 배경에 카테고리 색상이 빛남

### Surfaces
| Token | Hex | Usage |
|-------|-----|-------|
| --bg-primary | #0A0A0C | 앱 배경 (blue undertone) |
| --bg-secondary | #141418 | 카드, 캘린더 배경 |
| --bg-elevated | #1C1C22 | hover, 투두 리스트 배경 |
| --border-subtle | #2A2A32 | 그리드 라인, 구분선 |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| --text-primary | #F0F0F2 | 주요 텍스트 |
| --text-secondary | #8888A0 | 날짜 숫자, 부가 정보 |
| --text-tertiary | #55556A | 완료 항목, placeholder |

### Categories
| Token | Hex | Name | Default Usage |
|-------|-----|------|---------------|
| --cat-coral | #FF6B6B | Coral | 개인 |
| --cat-amber | #FFBE5C | Amber | 업무 |
| --cat-lime | #A8E06C | Lime | 운동 |
| --cat-cyan | #5CC8FF | Cyan | 학습 |
| --cat-violet | #B18CFF | Violet | 창작 |
| --cat-pink | #FF7EB3 | Pink | 소셜 |
| --cat-mint | #6CDFCF | Mint | 재정 |

각 카테고리 색상은 15% opacity variant를 배경으로 사용:
`rgba(255, 107, 107, 0.15)` for coral background

### Semantic
| Token | Hex | Usage |
|-------|-----|-------|
| success | --cat-lime | 완료, 성공 |
| warning | --cat-amber | 경고, 주의 |
| error | --cat-coral | 오류, 삭제 |
| info | --cat-cyan | 정보, 링크 |

### Today Indicator
- 흰색 원: `background: #FFFFFF`, `border-radius: 50%`, `28x28px`
- 날짜 숫자가 검정으로 반전

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable
- **Scale:**

| Token | Value | Usage |
|-------|-------|-------|
| 2xs | 2px | 멀티데이 바 간격 |
| xs | 4px | 캘린더 셀 내부 |
| sm | 8px | 캘린더 셀 패딩, 아이콘 간격 |
| md | 16px | 투두 아이템 패딩, 섹션 내 간격 |
| lg | 24px | 섹션 간 간격 |
| xl | 32px | 페이지 마진 (데스크톱 40px) |
| 2xl | 48px | 큰 섹션 간격 |
| 3xl | 64px | 페이지 최상위 간격 |

## Layout
- **Approach:** Grid-disciplined
- **Calendar grid:** 7 columns, 5-6 rows, 1px gap (hairline)
- **Cell min-height:** 80px desktop / 56px mobile
- **Max content width:** 420px (모바일 퍼스트)
- **Page margin:** 20px mobile / 40px desktop
- **Border radius:**

| Token | Value | Usage |
|-------|-------|-------|
| --radius-sm | 4px | 체크박스, 캘린더 셀, 멀티데이 바 |
| --radius-md | 8px | 카드, 인풋 |
| --radius-lg | 12px | 캘린더 컨테이너, 투두 화면 |
| --radius-full | 9999px | 버튼, 카테고리 뱃지, 오늘 표시 |

## Motion
- **Approach:** Expressive — 모든 상호작용에 물리 기반 스프링
- **Library:** Framer Motion

### Springs
| Name | Config | Usage |
|------|--------|-------|
| zoom | `{ stiffness: 300, damping: 30, mass: 0.8 }` | 캘린더 ↔ 투두 줌 전환 |
| check | `{ stiffness: 400, damping: 15, mass: 0.5 }` | 체크박스 바운스 |
| reorder | `{ stiffness: 250, damping: 25, mass: 0.6 }` | 리스트 순서 변경 |
| elastic | `{ stiffness: 200, damping: 20, mass: 1.0 }` | 멀티데이 바 |
| navigate | `{ stiffness: 350, damping: 35, mass: 0.7 }` | 월 전환 |
| hover | `{ stiffness: 500, damping: 30, mass: 0.3 }` | 호버 효과 |

### Duration Guide
| Type | Duration | Usage |
|------|----------|-------|
| micro | 50-100ms | 체크박스 색상 변화 |
| short | 150-250ms | 취소선 와이프, 토스트 등장 |
| medium | 250-400ms | 줌 전환, 월 전환 |
| long | 400-700ms | 컨페티, 파티클 소멸 |

### Completion Effects (Dopamine Ladder)
| Tier | Trigger | Effect |
|------|---------|--------|
| 1 | 단일 투두 완료 | 체크박스 바운스(1→1.3→1) + 카테고리 색 파티클 15개 + pop 사운드 |
| 2 | 하루 전체 완료 | 화면 상단 컨페티 2초간 |
| 3 | 루틴 주간 완료 | 캘린더 7셀 순차 웨이브 펄스 (좌→우 300ms 간격) |

### Sound
- 완료 사운드: Web Audio API, 880Hz sine wave, 50ms, ADSR envelope (attack 5ms, decay 45ms)
- 무음 설정 존중: `navigator.userActivation` 체크

## Interaction Patterns
| Action | Gesture | Animation |
|--------|---------|-----------|
| 월 이동 | 좌우 스와이프 | 방향별 슬라이드 + navigate 스프링 |
| 날짜 열기 | 탭 | 공간 줌 (layoutId) |
| 뒤로가기 | 우측 스와이프 / 뒤로 버튼 | 역방향 줌 |
| 투두 완료 | 체크박스 탭 | 바운스 → 취소선 와이프 → 파티클 → fade |
| 투두 삭제 | 좌측 스와이프 | 빨간 영역 노출, 놓으면 collapse |
| 순서 변경 | 길게 누르기 → 드래그 | scale 1.03 + 그림자 증가 → reorder |

## Empty States
- 빈 투두 리스트: "nothing here yet" breathing animation (opacity 0.3→0.6, 3s cycle)
- 앱 전체가 텅 빈 경우: 온보딩 가이드 → "첫 할 일을 추가해보세요"

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-07 | 다크모드 only (v1) | 파티클 효과 시각 임팩트 + 포트폴리오 차별화 |
| 2026-04-07 | Pretendard Variable | 한국어+라틴 최적, 가변 폰트로 weight 유연 |
| 2026-04-07 | 7개 카테고리 색상 | 어두운 배경에서 잘 보이는 채도 높은 색상 |
| 2026-04-07 | Canvas 파티클 직접 구현 | tsparticles(50KB+) 제거, 30줄 canvas로 충분 |
| 2026-04-07 | @use-gesture 제거 | Framer Motion drag로 충분 |
| 2026-04-07 | 완료 사운드 추가 | Web Audio API 3줄, Superlist 차별화 참고 |
