# Design System — Living Calendar (v6: Content Calendar)

## Product Context
- **What this is:** 캘린더 기반 투두리스트 앱. 공간 줌 전환과 완료 효과로 차별화.
- **Who it's for:** 매일 할 일을 관리하는 사람. 직접 사용 + 개발자 포트폴리오.
- **Project type:** 반응형 웹앱 (모바일 우선, 데스크톱 사이드패널)

## Aesthetic Direction
- **Direction:** Clean Minimal — Figma Content Calendar 레퍼런스 기반
- **Decoration level:** Subtle — 장식 최소화, 정보와 여백으로 디자인
- **Mood:** 깔끔하고 프로페셔널. 노이즈 없이 기능에 집중.
- **Reference:** Figma Content Calendar with Auto Layout 2025

## Typography
- **Title:** Pretendard Variable 600 / 19px — 월 헤더
- **Subtitle:** Pretendard Variable 600 / 17px — 날짜 헤더
- **Body:** Pretendard Variable 400 / 14px — 투두 텍스트
- **Small:** Pretendard Variable 500 / 12px — 레이블, 카테고리
- **Micro:** Pretendard Variable 500 / 10-11px — 셀 내 미리보기, 뱃지

## Color

### Light Mode
| Token | Value | Usage |
|-------|-------|-------|
| --bg-primary | #FFFFFF | 카드, 캘린더 배경 |
| --bg-secondary | #F8F9FA | 앱 배경, 입력 필드 |
| --bg-elevated | #FFFFFF | 패널, 모달 |
| --border | #E5E7EB | 주요 보더 |
| --border-light | #F0F1F3 | 셀 구분선 |
| --text-primary | #111827 | 본문 |
| --text-secondary | #6B7280 | 보조 |
| --text-tertiary | #9CA3AF | placeholder |
| --accent | #6366F1 | CTA, 선택 상태 (Indigo) |
| --accent-light | #EEF2FF | 선택된 셀, hover |
| --success | #10B981 | 완료 |
| --error | #EF4444 | 에러 |
| --sun | #EF4444 | 일요일 |
| --sat | #3B82F6 | 토요일 |

### Dark Mode
| Token | Value |
|-------|-------|
| --bg-primary | #111111 |
| --bg-secondary | #1A1A1A |
| --bg-elevated | #1F1F1F |
| --border | #2E2E2E |
| --border-light | #252525 |
| --text-primary | #F3F4F6 |
| --accent | #818CF8 |

## Layout

### Breakpoints
| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 768px | 전체 너비, 패딩 12px, 캘린더/투두 전환 |
| Desktop | 1024px+ | 캘린더(flex-1) + 투두 사이드패널(380px), 패딩 12px |

### Spacing
- 앱 배경에 패딩 → 카드가 떠 있는 느낌
- 카드 내부 패딩: 16-20px
- 요소 간 gap: 12px

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| --radius-sm | 6px | 체크박스, 인풋 |
| --radius-md | 10px | 카드, 버튼 |
| --radius-lg | 14px | 패널, 모달 |
| --radius-full | 9999px | 뱃지, 태그 |

### Card Style
- Background: var(--bg-elevated)
- Border: 1px solid var(--border)
- Border-radius: var(--radius-lg) (desktop), var(--radius-md) (mobile)
- Shadow: none

## Calendar Grid
- **Header:** 좌우 화살표 (SVG) + 월 타이틀 + 테마토글 + 로그아웃
- **Weekday Row:** 일=빨강, 토=파랑, 나머지=tertiary
- **Cell:** 날짜 + 카테고리 dot (모바일) / 투두 미리보기 2줄 (데스크톱)
- **Today:** accent 원 배경 + 흰 텍스트
- **Selected:** accent-light 배경
- **MultiDay Bar:** 카테고리 컬러 왼쪽 보더 + 투명 배경

## Side Panel
- **Header:** 날짜 + 요일 + 진행률 (프로그레스 바)
- **Empty state:** + 아이콘 + 안내 문구
- **Todo item:** 체크박스(둥근 사각형) + 텍스트 + 카테고리 뱃지

## Motion
- **Library:** Framer Motion
- 체크 완료: 바운스 + 파티클
- 월 전환: 좌우 슬라이드 (스와이프)
- 투두 리스트: stagger fade-in

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-08 | v6: Content Calendar 스타일 전면 리디자인 | 기존 Gumroad 스타일이 조잡함. Figma Content Calendar 기반 클린 미니멀로 전환 |
| 2026-04-08 | Indigo accent (#6366F1) | 핑크에서 인디고로. 프로페셔널하면서 차분한 톤 |
| 2026-04-08 | 가벼운 보더 (1px, #E5E7EB) | 검정 2px 보더 제거. 미세한 그레이 보더로 구분 |
| 2026-04-08 | 배경에 패딩 + 카드 분리 | 앱 배경(secondary) 위에 카드(elevated)가 떠 있는 레이아웃 |
| 2026-04-08 | Doto 캐릭터 제거 | 클린 미니멀에 캐릭터가 안 어울림. SVG 아이콘으로 대체 |
