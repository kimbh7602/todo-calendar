# Design System — Living Calendar (v2)

## Product Context
- **What this is:** 캘린더 기반 투두리스트 앱. 공간 줌 전환과 완료 효과로 차별화.
- **Who it's for:** 매일 할 일을 관리하는 사람. 직접 사용 + 개발자 포트폴리오.
- **Space/industry:** 생산성 / 투두 앱 (Todoist, Things 3, Structured, TimeBlocks 참고)
- **Project type:** 반응형 웹앱 (모바일 우선, 데스크톱 지원)

## Aesthetic Direction
- **Direction:** Soft-Warm Minimal — 따뜻한 크림/베이지 배경에 파스텔 액센트
- **Decoration level:** Intentional — 미세한 그림자, 카드 기반 UI, 둥근 모서리
- **Mood:** 따뜻하고 편안한 도구. 매일 열 때 스트레스 없이 깔끔하게 정리되는 느낌. Things 3의 여유 + Structured의 깔끔함.
- **Reference:** Things 3 (미적 완성도), Todoist (미니멀 레이아웃), Structured (깔끔한 타임라인), TimeBlocks (한국형 캘린더)

## Typography
- **Display/Hero:** Pretendard Variable 700 / 24px — 한국어+라틴 최적의 가변 폰트
- **Title:** Pretendard Variable 600 / 18px
- **Body:** Pretendard Variable 400 / 15px — line-height 1.5
- **UI/Labels:** Pretendard Variable 500 / 12px — letter-spacing 0.02em
- **Data/Tables:** Geist Mono — 숫자 정렬이 필요한 곳에
- **Code:** Geist Mono
- **Loading:** CDN `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css` (dynamic subset)
- **Scale:**

| Level | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| hero | 24px / 1.5rem | 700 | 1.2 | 월 헤더 |
| title | 18px / 1.125rem | 600 | 1.3 | 투두 화면 날짜 |
| body | 15px / 0.9375rem | 400 | 1.5 | 투두 제목 |
| label | 12px / 0.75rem | 500 | 1.0 | 카테고리 라벨 |
| caption | 11px / 0.6875rem | 500 | 1.0 | 멀티데이 바 텍스트 |
| day-number | 14px / 0.875rem | 500 (700 today) | 1.0 | 캘린더 날짜 |

## Color (v3 — 2026 Trends: Dark Glassmorphism + Elevated Neutrals)
- **Approach:** Elevated neutral base + glassmorphism cards + high-contrast dark mode
- **Trends applied:** Dark Glassmorphism, Elevated Neutrals, Soft Gradients 2.0, Explosion of Color

### Light Mode (기본) — Elevated Neutrals
순백(#FFF) 대신 warm sand/clay 톤으로 눈의 피로 감소.

#### Surfaces
| Token | Hex | Usage |
|-------|-----|-------|
| --bg-primary | #EDE8E1 | 앱 배경 (warm sand) |
| --bg-secondary | rgba(255,255,255,0.65) | 글래스모피즘 카드 (반투명) |
| --bg-elevated | #E5E0D8 | hover, 사이드바 |
| --border-subtle | rgba(0,0,0,0.08) | 구분선, 글래스 테두리 |

#### Text
| Token | Hex | Usage |
|-------|-----|-------|
| --text-primary | #1A1A1A | 주요 텍스트 |
| --text-secondary | #5C5C5C | 날짜 숫자, 부가 정보 |
| --text-tertiary | #8C8C8C | 완료 항목, placeholder |

#### Categories
| Token | Hex | Name | Default Usage |
|-------|-----|------|---------------|
| --cat-coral | #FF6B6B | Coral | 개인 |
| --cat-amber | #F5A623 | Amber | 업무 |
| --cat-sage | #7CB342 | Sage | 운동 |
| --cat-sky | #4FC3F7 | Sky | 학습 |
| --cat-violet | #AB7BFF | Violet | 창작 |
| --cat-rose | #FF7EB3 | Rose | 소셜 |
| --cat-teal | #26A69A | Teal | 재정 |

카테고리 색상은 15% opacity variant를 배경으로 사용

#### Semantic
| Token | Hex | Usage |
|-------|-----|-------|
| --accent | #5B6EF5 | CTA 버튼, 오늘 표시, 링크 |
| --success | #7CB342 | 완료, 성공 |
| --warning | #F5A623 | 경고, 주의 |
| --error | #FF6B6B | 오류, 삭제 |

#### Today Indicator
- 배경: accent color (#5B6EF5)
- 날짜 숫자: white
- 원형: 28x28px, border-radius: 50%

### Dark Mode — Dark Glassmorphism
깊은 검정 배경 + ambient gradient + 글래스모피즘 카드로 고대비 달성.

| Token | Light | Dark |
|-------|-------|------|
| --bg-primary | #EDE8E1 | #0C0C10 |
| --bg-secondary | rgba(255,255,255,0.65) | rgba(255,255,255,0.06) |
| --bg-elevated | #E5E0D8 | rgba(255,255,255,0.10) |
| --border-subtle | rgba(0,0,0,0.08) | rgba(255,255,255,0.10) |
| --text-primary | #1A1A1A | #F0F0F2 |
| --text-secondary | #5C5C5C | #9A9AA8 |
| --text-tertiary | #8C8C8C | #5A5A68 |
| --accent | #5B6EF5 | #7B8FFF |

#### Ambient Gradient (다크모드 배경)
- `radial-gradient(ellipse at 20% 50%, rgba(91,110,245,0.08), transparent 60%)`
- `radial-gradient(ellipse at 80% 20%, rgba(171,123,255,0.06), transparent 50%)`
- 미세한 accent/violet 오브가 배경에 떠서 glassmorphism 카드가 돋보이게 함

#### Glassmorphism Card Style
- `backdrop-filter: blur(12px)`
- `border: 1px solid rgba(255,255,255,0.10)`
- `box-shadow: 0 8px 32px rgba(0,0,0,0.2)`
- `border-radius: var(--radius-lg)` (16px)

## Spacing
- **Base unit:** 4px
- **Density:** Comfortable
- **Scale:**

| Token | Value | Usage |
|-------|-------|-------|
| 2xs | 2px | 멀티데이 바 간격 |
| xs | 4px | 아이콘 간격 |
| sm | 8px | 캘린더 셀 패딩 |
| md | 16px | 투두 아이템 패딩, 페이지 모바일 마진 |
| lg | 24px | 섹션 간 간격 |
| xl | 32px | 페이지 데스크톱 마진 |
| 2xl | 48px | 큰 섹션 간격 |
| 3xl | 64px | 페이지 최상위 간격 |

## Layout
- **Approach:** 반응형 (모바일 우선 → 데스크톱 확장)

### Breakpoints
| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 768px | 전체 너비, 캘린더/투두 전환 (줌 애니메이션) |
| Tablet | 768px+ | 중앙 정렬, max-w 480px, 캘린더/투두 전환 |
| Desktop | 1024px+ | 사이드바이사이드: 좌측 캘린더(400px) + 우측 투두(flex-1), max-w 900px |

### Grid
- 캘린더: 7 columns, 5-6 rows, 1px gap
- Cell min-height: 72px mobile / 84px desktop
- Page margin: 16px mobile / 32px desktop

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| --radius-sm | 6px | 체크박스, 멀티데이 바 |
| --radius-md | 12px | 카드, 인풋, 캘린더 셀 |
| --radius-lg | 16px | 투두 화면 컨테이너, 모달 |
| --radius-full | 9999px | 버튼, 카테고리 뱃지, 오늘 표시 |

### Card Style (Glassmorphism)
- Background: var(--bg-secondary) (반투명)
- Backdrop-filter: blur(12px)
- Border: 1px solid var(--border-subtle)
- Shadow: 0 4px 24px rgba(0,0,0,0.06) (light) / 0 8px 32px rgba(0,0,0,0.2) (dark)
- Border-radius: var(--radius-lg) (16px)

## Motion
- **Approach:** Intentional — 의미 있는 전환과 피드백
- **Library:** Framer Motion

### Springs
| Name | Config | Usage |
|------|--------|-------|
| zoom | `{ stiffness: 300, damping: 30, mass: 0.8 }` | 캘린더 ↔ 투두 줌 전환 |
| check | `{ stiffness: 400, damping: 15, mass: 0.5 }` | 체크박스 바운스 |
| reorder | `{ stiffness: 250, damping: 25, mass: 0.6 }` | 리스트 순서 변경 |
| elastic | `{ stiffness: 200, damping: 20, mass: 1.0 }` | 멀티데이 바 |
| navigate | `{ stiffness: 350, damping: 35, mass: 0.7 }` | 월 전환, 페이지 전환 |
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
| 1 | 단일 투두 완료 | 체크박스 바운스(1→1.2→1) + 카테고리 색 파티클 12개 + pop 사운드 |
| 2 | 하루 전체 완료 | 화면 상단 컨페티 2초간 |
| 3 | 루틴 주간 완료 | 캘린더 7셀 순차 웨이브 펄스 (좌→우 300ms 간격) |

### Sound
- 완료 사운드: Web Audio API, 880Hz sine wave, 50ms, ADSR envelope

## Interaction Patterns
| Action | Gesture | Animation |
|--------|---------|-----------|
| 월 이동 | 좌우 스와이프 / 버튼 | 방향별 슬라이드 + navigate 스프링 |
| 날짜 열기 | 탭 | 공간 줌 (layoutId) — 모바일 only |
| 날짜 열기 | 클릭 | 사이드 패널 표시 — 데스크톱 only |
| 뒤로가기 | 우측 스와이프 / 뒤로 버튼 | 역방향 줌 — 모바일 only |
| 투두 완료 | 체크박스 탭 | 바운스 → 취소선 와이프 → 파티클 → fade |
| 투두 삭제 | 좌측 스와이프 | 빨간 영역 노출, 놓으면 collapse |
| 순서 변경 | 길게 누르기 → 드래그 | scale 1.03 + 그림자 증가 → reorder |

## Empty States
- 빈 투두 리스트: "오늘 할 일이 없어요" + 연필 일러스트 (opacity 0.4)
- 앱 전체가 빈 경우: 온보딩 → "첫 할 일을 추가해보세요"

## Component Library

### Button
- Primary: bg accent, text white, rounded-full, py-3 px-6, shadow-sm
- Secondary: bg bg-elevated, text text-primary, rounded-full, border
- Ghost: text text-secondary, no bg, no border

### Input
- bg bg-secondary, border border-subtle, rounded-md, py-3 px-4
- Focus: border accent, ring-2 ring-accent/20

### Checkbox
- 22x22px, rounded-sm, border 2px category color
- Completed: filled with category color, white checkmark
- Animation: scale 1→1.2→1 on toggle

### Category Badge
- text 11px, font-semibold, px-2.5 py-0.5, rounded-full
- bg: category color 12% opacity
- text: category color

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-07 | 다크모드 only (v1) | 초기 구현 |
| 2026-04-08 | 라이트모드 기본 + 다크모드 토글 (v2) | 사용자 피드백: 가시성 부족. 2026 트렌드: warm neutral. 포트폴리오 임팩트 향상 |
| 2026-04-08 | Warm neutral 배경 (#FAFAF8) | 순백 대비 편안하고 고급스러운 느낌. Things 3, Notion 참고 |
| 2026-04-08 | 반응형 레이아웃 추가 | 모바일 전용 → 데스크톱 사이드바이사이드. 포트폴리오에서 반응형 필수 |
| 2026-04-08 | Card-based UI | 미세한 그림자 + 테두리로 시각적 계층 구조 명확화 |
| 2026-04-08 | Accent color #4F6EF7 | 차분한 블루. 생산성 앱에서 신뢰감 + 집중 유도 |
