# Todo Calendar Project

## 작업 원칙

- **동의없이 진행**: 작업 중 매번 허락을 구하지 말 것. 단계 시작/끝에서만 상태 보고.
- **TDD**: 모든 구현은 테스트 먼저 작성 후 구현. 테스트 없는 코드는 미완성.
- **작업 완료 시 결과 보고 필수**: 무엇을 했고 완료되었는지 반드시 명확히 전달.

---

## 워크플로우

### Case 1: 구현할 내용이 명확할 때

```
1. 요청 분석 → Git Issue 생성 (병렬 가능한 단위로 분할)
2. 이해도 점검 → 사용자에게 "이렇게 작동해야 하는 것이 맞는지" 확인
   - 일치하면 → 3번으로
   - 불일치하면 → 재확인 반복
3. Phase A (의사결정) → /office-hours + /plan-ceo-review
4. Phase B (자율 실행, 동의없이 진행)
   → /design-consultation → /frontend-design → /plan-eng-review → TDD 구현 → /simplify → /qa → /cso → /review
5. PR 생성
```

### Case 2: 구현할 내용이 명확하지 않을 때

```
1. /office-hours 로 브레인스토밍
2. 아이디어가 구체화되면 → Case 1의 1번부터 진행
```

### Case 3: 버그 수정

```
/investigate → TDD 수정 (회귀 테스트 먼저) → /qa → /review → PR
```

### Case 4: 디자인 개선

```
/design-review → 수정 → /qa → PR
```

---

## Git Issue 전략

### 단일 작업

- main 브랜치에서 feature 브랜치 생성
- 1 issue = 1 branch = 1 PR

### 병렬 작업 (큰 기능)

- **Release Issue** 를 먼저 생성 (부모)
- Release Issue 아래에 병렬 sub-issue 생성
- 각 sub-issue 별로 feature 브랜치 생성
- 모든 sub-issue PR이 완료되면 Release Issue 종료

```
예시:
Release Issue: "뮤직 플레이어 모션 추가" (#10)
├── Sub-issue: "리스트 애니메이션" (#11) → feature/list-animation
├── Sub-issue: "커버 회전 효과" (#12) → feature/cover-rotation
└── Sub-issue: "통계 대시보드" (#13) → feature/stats-dashboard
```

---

## gstack Skills 파이프라인

### Phase A: 의사결정 (사용자 참여)

| 단계      | Skill              | 역할                       |
| --------- | ------------------ | -------------------------- |
| 기획      | `/office-hours`    | 아이디어 구체화, 문제 정의 |
| 전략 리뷰 | `/plan-ceo-review` | 범위, 방향성 검증          |

### Phase B: 자율 실행 (동의없이 진행)

| 단계            | Skill                  | 역할                                    |
| --------------- | ---------------------- | --------------------------------------- |
| 디자인 시스템   | `/design-consultation` | DESIGN.md 생성                          |
| 화면 디자인     | `/frontend-design`     | 화면별 디자인 방향 설정 + 구현 가이드   |
| 디자인 리뷰     | `/plan-design-review`  | UI/UX 계획 리뷰                         |
| 엔지니어링 리뷰 | `/plan-eng-review`     | 아키텍처, 엣지케이스, 테스트 커버리지   |
| 자동 리뷰       | `/autoplan`            | CEO + 디자인 + 엔지니어링 리뷰 한번에   |
| 구현            | TDD 코딩               | 테스트 먼저, 구현 후                    |
| 코드 정리       | `/simplify`            | 재사용성, 효율성, 품질 검토 + 자동 수정 |
| QA 테스트       | `/qa`                  | 체계적 QA + 버그 자동 수정              |
| 보안 감사       | `/cso`                 | OWASP, STRIDE, 의존성 검사              |
| 코드 리뷰       | `/review`              | diff 분석, 구조적 이슈                  |
| PR 생성         | `/ship`                | PR 생성                                 |

### 보조 Skills

| Skill                                           | 역할                          |
| ----------------------------------------------- | ----------------------------- |
| `/investigate`                                  | 버그 디버깅, 근본 원인 분석   |
| `/design-review`                                | 라이브 사이트 비주얼 QA       |
| `/browse`                                       | 헤드리스 브라우저 테스트      |
| `/benchmark`                                    | 성능 벤치마크                 |
| `/retro`                                        | 주간 회고                     |
| `/careful` / `/freeze` / `/guard` / `/unfreeze` | 안전 모드                     |
| `/codex`                                        | 세컨드 오피니언               |
| `/loop`                                         | 명령 반복 실행                |
| `/schedule`                                     | cron 기반 스케줄링            |
| `/setup-browser-cookies`                        | 인증 페이지 QA 전 쿠키 임포트 |
| `/land-and-deploy` → `/canary`                  | 머지 & 배포 → 모니터링        |
| `/document-release`                             | README, CHANGELOG 업데이트    |

---

## 기술 스택

- **Framework**: Next.js 16 (App Router, Full CSR)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand (persist + skipHydration)
- **Testing**: Vitest + Playwright
- **Animation**: Framer Motion
- **Auth**: Supabase Auth (카카오, 구글)
- **DB/Backend**: Supabase (PostgreSQL)
- **Deploy**: Vercel (https://todo-calendar.vercel.app/)
- **Repo**: https://github.com/kimbh7602/todo-calendar

---

## 배포

- **플랫폼**: Vercel
- GitHub main 브랜치 push 시 자동 배포

## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
