# Design System — Living Calendar (v5: Gumroad Bold + Planner)

## Product Context
- **What this is:** 캘린더 기반 투두리스트 앱. 공간 줌 전환과 완료 효과로 차별화.
- **Who it's for:** 매일 할 일을 관리하는 사람. 직접 사용 + 개발자 포트폴리오.
- **Project type:** 반응형 웹앱 (모바일 우선, 데스크톱 풀스크린 캘린더)

## Aesthetic Direction
- **Direction:** Bold Planner Kitsch — Gumroad 에너지 + 한국 월간 플래너 밀도
- **Decoration level:** Bold — 핑크 헤더 바, 셀 안 투두 미리보기, 장식 요소, 월간 통계
- **Mood:** 실제 플래너처럼 정보가 빽빽한 + Gumroad의 핑크 에너지. 빈 공간 최소화.
- **Reference:** Gumroad (흑백+핑크, 볼드), 한국 월간 플래너 (셀 밀도, 요일 컬러, 메모)

## Typography
- **Display/Hero:** Pretendard Variable 800 / 48px — 랜딩 페이지 헤드라인
- **Title:** Pretendard Variable 700 / 24px — 월 헤더
- **Subtitle:** Pretendard Variable 600 / 18px — 투두 화면 날짜
- **Body:** Pretendard Variable 400 / 15px — line-height 1.5
- **UI/Labels:** Pretendard Variable 600 / 12px — letter-spacing 0.02em
- **Code:** Geist Mono

## Color
- **Approach:** 흑백 고대비 + #FF90E8 핑크 포인트 (Gumroad signature)

### Light Mode (기본)

#### Surfaces
| Token | Value | Usage |
|-------|-------|-------|
| --bg-primary | #FFFFFF | 앱 배경 (순백) |
| --bg-secondary | #F4F4F0 | 카드, 캘린더 셀 (따뜻한 오프화이트) |
| --bg-elevated | #E8E8E4 | hover, 선택된 셀 |
| --border-subtle | #E0E0DC | 구분선, 그리드 |

#### Text
| Token | Value | Usage |
|-------|-------|-------|
| --text-primary | #000000 | 주요 텍스트 (순흑) |
| --text-secondary | #666666 | 부가 정보 |
| --text-tertiary | #999999 | placeholder, 완료 항목 |

#### Accent & Semantic
| Token | Value | Usage |
|-------|-------|-------|
| --accent | #FF90E8 | CTA 버튼, 오늘 표시, 포인트 (Gumroad Pink) |
| --accent-hover | #FF6AD5 | 버튼 hover |
| --success | #23C45E | 완료 체크 |
| --warning | #FFB800 | 경고 |
| --error | #FF4444 | 오류, 삭제 |

#### Categories (키치한 컬러셋)
| Token | Value | Name |
|-------|-------|------|
| --cat-pink | #FF90E8 | Pink |
| --cat-yellow | #FFE14D | Yellow |
| --cat-green | #23C45E | Green |
| --cat-blue | #4DA6FF | Blue |
| --cat-purple | #B266FF | Purple |
| --cat-orange | #FF8A4D | Orange |
| --cat-red | #FF4D6A | Red |

### Dark Mode
| Token | Light | Dark |
|-------|-------|------|
| --bg-primary | #FFFFFF | #000000 |
| --bg-secondary | #F4F4F0 | #1A1A1A |
| --bg-elevated | #E8E8E4 | #2A2A2A |
| --border-subtle | #E0E0DC | #333333 |
| --text-primary | #000000 | #FFFFFF |
| --text-secondary | #666666 | #999999 |
| --text-tertiary | #999999 | #666666 |
| --accent | #FF90E8 | #FF90E8 (동일) |

## Layout

### Breakpoints
| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 768px | 전체 너비, 캘린더/투두 전환 |
| Tablet | 768px+ | 중앙 정렬, 캘린더/투두 전환 |
| Desktop | 1024px+ | 풀스크린 캘린더(좌 flex-1) + 투두 사이드패널(400px) |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| --radius-sm | 4px | 체크박스 |
| --radius-md | 8px | 입력 필드, 카드 |
| --radius-lg | 12px | 모달, 큰 카드 |
| --radius-full | 9999px | 버튼, 뱃지, 오늘 표시 |

### Card Style
- Background: var(--bg-secondary)
- Border: 2px solid var(--border-subtle)
- Shadow: none (flat design)
- Border-radius: var(--radius-md)

## Character — Doto (도토)
- 연필 모양 캐릭터, 체크마크 머리
- SVG로 구현, 다양한 표정/포즈
- 랜딩: 큰 사이즈, 인사 포즈
- 빈 상태: 작은 사이즈, 졸고 있는 포즈
- 완료 시: 축하 포즈

## Calendar Grid (v5 추가)
- **Header:** 핑크(accent) 배경 바. Doto 캐릭터 + 월 타이틀
- **Weekday Row:** bg-secondary 배경. 일요일 빨강, 토요일 파랑
- **Cell 미리보기:** 데스크톱에서 셀 안에 투두 타이틀 최대 3개 표시 (9px)
- **Cell 배경:** 투두 있으면 accent/6% 틴트, 모두 완료 시 success/8% 틴트
- **Selected Cell:** accent/20% 배경 + accent ring
- **Stats Bar:** 하단에 월간 통계 (할 일 수, 완료 수, 달성률, Doto 무드)

## Side Panel (v5 추가)
- **Header:** 핑크 배경 + 날짜/요일 + 미니 프로그레스 바
- **Close button:** 헤더 안에 통합

## Landing Page
- **Nav:** 핑크 배경 헤더 바 (앱과 동일한 무드)
- 대형 타이포: "할 일을 끝내는\n가장 쉬운 방법" (48px, bold)
- **장식 요소:** 플로팅 원/사각형 (accent, yellow, green, blue, purple)
- Doto 캐릭터 배치
- CTA 버튼: #FF90E8 핑크, 큰 사이즈, rounded-full

## Motion
- **Library:** Framer Motion
- 체크박스 완료: 바운스 + 핑크 파티클
- 월 전환: 좌우 슬라이드
- 투두 리스트: stagger fade-in

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-08 | v4: Gumroad 스타일 전면 리디자인 | 사용자 피드백: 가시성 부족, 눈 피로. Gumroad의 심플+키치+고대비 스타일 채택 |
| 2026-04-08 | 흑백+핑크 컬러 시스템 | 높은 가시성 + 개성. #FF90E8 Gumroad signature pink |
| 2026-04-08 | Doto 캐릭터 추가 | 키치한 개성, 빈 상태/랜딩 활용 |
| 2026-04-08 | 데스크톱 풀스크린 캘린더 | 캘린더가 주인공. 데스크톱에서 화면 가득 차도록 |
| 2026-04-08 | v5: 핑크 헤더 바 + 셀 투두 미리보기 | 피드백: 보더만으로는 무드 안 나옴. 플래너 레퍼런스 참고하여 정보 밀도 + 핑크 에너지 강화 |
| 2026-04-08 | 월간 통계 바 | 하단 통계로 빈 공간 활용 + 달성감 제공 |
| 2026-04-08 | 요일별 컬러 (일=빨강, 토=파랑) | 한국 플래너 관례. 가독성 향상 |
| 2026-04-08 | 사이드패널 핑크 헤더 + 프로그레스 바 | 사이드패널도 핑크 에너지. 진행률 시각화 |
