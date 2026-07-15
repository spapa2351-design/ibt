# MaroPass IBT — 기획·설계 문서

## 한 줄

**일본인 한국어 학습자가 말하기 실력을 객관적으로 진단할 수 있는 IBT 플랫폼을 만든다.**

## 이 한 줄을 지지하는 이유 5개

1. 일본 내 TOPIK 응시자 4.9만명/년 중 92.6%가 말하기 응시를 희망하지만, TOPIK 말하기는 일본 시행 구조가 없다.
2. 한국 TOPIK IBT는 전용 시험장과 전용 브라우저 설치를 요구하는데, 일본 내 보안 정서·기업/학교 PC 정책상 설치가 사실상 불가능하다.
3. 한국이 2029년 재택형 IBT를 예고하고 있어, 일본형 솔루션을 선제 구축하면 기술 우위를 확보할 수 있다.
4. 일본인 학습자는 편리함보다 안정성·명확성·예측 가능성을 우선시하므로, 일본 환경에 재설계된 시스템이 별도로 필요하다.
5. 시험을 일회성 이벤트가 아니라 응시 → 평가 → 피드백 → 학습으로 이어지는 진단 플랫폼으로 설계할 수 있다.

---

## 30초 컨텍스트

| 항목 | 내용 |
|---|---|
| 사업명 | MaroPass IBT (IBT = Internet Based Test · 풀네임 추후 확정) |
| 포지셔닝 | TOPIK 대체 아님. 일본인 학습자용 진단·모의고사 (공인 X) |
| **Phase 1 범위** | **말하기 단독.** 다른 영역(쓰기·듣기·읽기)은 본 문서 범위 외 |
| 응시 모드 | **온라인 전용**. 오프라인 시험장 없음 |
| **시스템 구조** | **3개 시스템 분담** — 서비스 사이트 (MaroPass) + 터치클래스 사용자 web (새창 응시) + 터치클래스 관리자 web |
| **1차 오픈 디바이스** | **데스크탑·모바일 웹만**. iOS/Android 네이티브 앱과 푸시 알림은 라운드 2 이후 |
| **응시 진입 정책** | 마이페이지 "응시하기" → **새 창**으로 사용자 web home (팝업 차단 안내 포함) |
| **결과·PDF 분리** | 결과 확인 = 사용자 web / PDF 다운로드(영수증·인증서·결과지) = 서비스 사이트 마이페이지 |
| 운영 분담 | Newin = 시스템 개발·운영·유지보수 / KOEN = 시행 운영·1:1 문의 대응·결과 공개 처리·환불 승인 |
| 디자인 톤 | calm·optimistic·trustworthy. 일본어 우선 · 한국어 콘텐츠는 `:lang(ko)` 분기 |
| 폰트 | Pretendard Variable + Pretendard JP Variable (한·일 동시 지원) |
| 개발사 | Newin 단독 개발 |
| 일정 | 기획 초안 → 디자인 → 개발 → 베타 → 정식 개시 (날짜 별도 합의) |

---

## 시작 지점 (Quick Links)

- 🎯 **`../ui/ui-index.html`** — UI 디자인 허브 (모든 화면으로 점프)
- 📋 **`spec.html`** — 통합 SSOT (13섹션 설계서)
- ⚠️ **`critical-decisions.md`** — Critical 4개 결정 안건 (외부 미팅용)

## 프로젝트 폴더 구조

docs/ 는 **문서 전용**. UI 구현은 별도 `ui/` 트리에서 정책 10의 3개 시스템 분담을 그대로 따른다.

```
kopass/
├── docs/                    ← 본 폴더, 기획·설계 문서만
│   ├── README.md            ← 본 파일
│   ├── 01-glossary.md ~ 08-design-system.md  (기획 md 11)
│   ├── critical-decisions.md
│   ├── open-questions.md
│   ├── phase-roadmap.md
│   ├── newinDESIGN.md
│   ├── reference-existing-topik-jp.md
│   ├── spec.html            ← 통합 SSOT
│   ├── feature-spec.html
│   └── koen-report-v1/      ← 외부 보고서 자료
├── ui/                      ← UI 구현 (정책 10 — MaroPass portal + 터치클래스 자산 재사용)
│   ├── ui-index.html        ← UI 디자인 허브 (모든 화면 점프)
│   ├── service-site/  (15)  ← ★ 신규 — MaroPass portal (결제·환불·인증서)
│   ├── user-web/      ( 4)  ← ◇ 기존 터치클래스 사용자 web — MaroPass 시험 응시 영역 추가분
│   ├── admin/         ( 5)  ← ◇ 기존 터치클래스 관리자 web — MaroPass 메뉴 5개 추가분
│   └── shared/        ( 2)  ← 공유 JS 모듈 (env-check-modal, exam-info-modal)
├── design/                  ← 디자인 가이드(DESIGN.md 등)
├── img/
├── re/                      ← 회의록·계획안·실증 보고서
└── index.html               ← 프로젝트 진입점
```

---

## 문서 인덱스

### 📐 기획·설계 마크다운 (11)

| 파일 | 내용 |
|---|---|
| `01-glossary.md` | 도메인 용어 — TOPIK 말하기 1형~6형, 등급 체계, 채점 단계 |
| `02-system-map.md` | **3개 시스템 분담** (서비스 사이트 / 사용자 web / 관리자 web) + AI 엔진 + 책임 경계 + Newin × KOEN 역할 |
| `03-user-flows.md` | 주체·권한 매트릭스 + 사이트맵 + 응시자 5단계 플로우 (새창 정책 포함) |
| `04-policy.md` | 1차 오픈 운영 정책 10개 (환경 점검·응시 진행·자동 저장·종료·결과 공개·재응시·환불·회차·회원 자격·**새창 정책**) |
| `05-screen-inventory.md` | 화면 인벤토리 + 빠진 화면 + 반응형 매트릭스 + 디자인 발주 우선순위 |
| `06-feature-spec.md` | **응시자 측** 라인 아이템 기능 명세 5×11 (한국 LMS 스펙 → 일본·라이트 정정) + Phase 1 라벨 |
| `06-admin-feature-spec.md` | **관리자 측** 라인 아이템 기능 명세 5메뉴 + ★ [향후 핵심] 문제 만들기 |
| `07-ia.md` | 정보 구조 (IA) — GNB·하단탭·페이지 인벤토리·콘텐츠 블록·라벨 사전 |
| `08-design-system.md` | 디자인 시스템 — 컬러·타이포·컴포넌트 토큰 + 시험 UI 특수 요소 + i18n 폰트 분기 |
| `09-edge-cases.md` | 엣지케이스 카탈로그 — 6묶음(응시 중단·환경 변화·결제 정합성·시간 경계·운영 SLA·어뷰징) |
| `phase-roadmap.md` | Phase 1 (1차 오픈) 범위, Phase 2/3 후속, 작성 예정 문서 목차 |
| `open-questions.md` | 갭 트래커 (GAP-01~15 + 심각도 라벨 🔴Critical / 🟠Important / 🟡Minor / DEFERRED) |

### 🎯 의사결정·통합 SSOT·참고

| 파일 | 내용 |
|---|---|
| `critical-decisions.md` | ⚠ Critical 4개 결정 안건 (외부 미팅용 1페이지) — 결정 후 삭제 |
| `spec.html` | **통합 SSOT** — 13섹션 설계서 |
| `feature-spec.html` | 기능명세서 v1 — 응시자 U1~U6 + 관리자 A1~A6 130케이스 / 좌측 필터 + 우측 미리보기 iframe |
| `feature-spec-v2.html` | 기능명세서 v2 — v1 데이터 + 📍 위치 하이라이트 (data-feature-id) + file:// 환경 감지 배너 |
| `edge-case-demo.html` | 응시자 시점 엣지케이스 데모 (30 케이스 버튼 → 우측 프리뷰) |
| `newinDESIGN.md` | 외부 디자인 시스템 베이스 자료 (`08-design-system.md`가 참조) — reference only |
| `reference-existing-topik-jp.md` | 현행 TOPIK 일본 사이트 분석 — 응시자가 익숙한 동선 |

### 🎨 service-site/ — ★ 신규 MaroPass portal (결제·환불·인증서 — 응시자 측 15)

| 파일 | 내용 |
|---|---|
| `../ui/service-site/ui-main-home.html` | 메인 홈 + GNB (Hero·통계·추천·TOPIK 관계·서비스 소개·FAQ 6개 아코디언) |
| `../ui/service-site/ui-tests-list.html` | 시험 목록 (필터·검색·카드 그리드·페이지네이션) |
| `../ui/service-site/ui-test-detail.html` | 시험 상세 (헤로 + 콘텐츠 + sticky 구매 카드 + 회원 게이트 정책 9) |
| `../ui/service-site/ui-auth.html` | 회원가입 / 로그인 (모드 토글, `?intent=sample\|purchase&return=…` 자동 복귀) |
| `../ui/service-site/ui-checkout.html` | 결제 페이지 (Step 인디케이터 3단 + 새창 응시 안내 + 환경 점검 30일 안내 + 결제 수단 + sticky 요약, i18n) |
| `../ui/service-site/ui-checkout-complete.html` | 결제 완료 (애니메이션 체크 + 영수증 + 새창 응시 진입 CTA) |
| `../ui/service-site/ui-mypage.html` | 마이페이지 대시보드 (사이드바 8 + 환영 카드 + 빠른 진입 + 응시·결과 위젯 + 새창 응시 진입) |
| `../ui/service-site/ui-mypage-tests.html` | 마이페이지 / 응시할 시험 (D-day 카운트, 새창 응시 트리거) |
| `../ui/service-site/ui-mypage-results.html` | 마이페이지 / 결과 (3건 + 필터 칩) |
| `../ui/service-site/ui-mypage-certificates.html` | 마이페이지 / 인증서 (PDF 카드 + 빈 슬롯) |
| `../ui/service-site/ui-mypage-payments.html` | 마이페이지 / 결제 내역 (요약 + 테이블) |
| `../ui/service-site/ui-mypage-refunds.html` | 마이페이지 / 환불 (Empty State + 정책) |
| `../ui/service-site/ui-mypage-profile.html` | 마이페이지 / 프로필 (폼 + 알림 + 탈퇴) |
| `../ui/service-site/ui-mypage-inquiries.html` | 마이페이지 / 문의 내역 (2건 + 답변 상태) |
| `../ui/service-site/ui-faq.html` | FAQ (Hero 검색 + 5 카테고리 + 15개 아코디언) |

### 🪟 user-web/ — ◇ 기존 터치클래스 사용자 web + MaroPass 응시 영역 추가 (4)

| 파일 | 내용 |
|---|---|
| `../ui/user-web/ui-exam-home.html` | **사용자 web 홈** — 다크 탑바 · 결제된 시험 + 응시 완료 + 안내 · 본인 확인 → 환경 점검 same-window 분기 (정책 10 새창 진입점) |
| `../ui/user-web/ui-exam.html` | 응시 화면 (**상하 70/30** · 1080px shell · 32px 타이머 + 미니 원형 progress · 헤더 stage pill · 준비/녹음 상태 토글) |
| `../ui/user-web/ui-env-check.html` | 환경 점검 standalone (모달 외 페이지 버전) |
| `../ui/user-web/ui-result.html` | 결과 화면 (5각 차트 + AI 피드백 + 문항별 + 인증서 CTA + 모달) |

### 🛠 admin/ — ◇ 기존 터치클래스 관리자 web + MaroPass 메뉴 5개 추가

**기존 터치클래스 관리자 web에 MaroPass 메뉴 5개(회원·결제·환불 승인·결과 공개·인증서 템플릿)와 문제 만들기 안 MaroPass 말하기 5영역 탭만 신설**. 시험 관리·문제 은행·응시자 관리·평가/채점·통계·시스템 설정은 기존 자산 그대로. 좌측 사이드바 5블록 — **대시보드 → 응시자 → 회원 → 시험 → 설정** (회원/응시자 그룹이 최상단, 운영팀 일상 사용 빈도 기준). 응시 결과·관리자 계정·인증서 템플릿·통계는 라운드 2.

| 파일 | 내용 |
|---|---|
| `../ui/admin/ui-admin-dashboard.html` | 대시보드 — 4 KPI + 미답변 문의 4건 + 빠른 액션 + 최근 7일 응시 추이 막대 그래프 |
| `../ui/admin/ui-admin-members.html` | 응시자 회원 목록 (상태·이름·이메일·등급·최근 응시일·누적 응시·임시 PW·관리) |
| `../ui/admin/ui-admin-payments.html` | 결제 관리 (결제일·응시자·시험·금액 ¥·상태 5종·영수증+환불 처리) |
| `../ui/admin/ui-admin-question-bank.html` | 문제 은행 (분류 트리 — 초급/중상급 × 5영역 + 표) |
| `../ui/admin/ui-admin-question-create.html` | 문제 만들기 — 251020 ver.3 5영역 탭 + sticky 핸드폰 frame 라이브 프리뷰 |

> MaroPass admin은 **말하기 전용**. 객관식·주관식은 본가 시스템(별도 인프라) 사용.

### 🔌 shared/ — 공유 JS 모듈

| 파일 | 내용 |
|---|---|
| `../ui/shared/env-check-modal.js` | 환경 점검 모달 (마이크·볼륨·5초 리플레이·네트워크), 통과 이력 30일 유효 |
| `../ui/shared/exam-info-modal.js` | 시험 안내 모달 (서비스 사이트에서 새창 응시 트리거 — `window.open`) |
| `../ui/shared/feature-highlight.js` | 기능명세서 미리보기 iframe 내부 수신 스크립트 — `postMessage` → `data-feature-id` 매칭 → 5초 점멸·툴팁 |

---

## 응시자 측 화면 동선 (3 시스템 분담 반영)

```
ui/ui-index.html (허브)
  ↓
ui/service-site/
  ui-main-home.html ──→ ui-tests-list.html ──→ ui-test-detail.html
                                                    ├─ 바로 구매 ─→ ui-checkout.html ─→ ui-checkout-complete.html
                                                    └─ 무료 샘플 (회원 게이트) ──→ ui-auth.html?intent=sample
                                                                              ↓ 가입 후 복귀
                                                                              ../user-web/ui-exam.html (sample)

  ui-mypage.html (대시보드, 사이드바 8)
       ├─ 응시하기 ──[window.open, 정책 10]──→ user-web/ui-exam-home.html (새 창)
       ├─ 결과 보기 ──→ user-web/ui-result.html
       └─ PDF 다운로드 (영수증·인증서·결과지) ─── 본 사이트에서 처리

  ui-faq.html (모든 GNB 고객센터 진입점)

ui/user-web/  (새 창 — 응시 전용, SSO 자동 로그인)
  ui-exam-home.html  ──→ 본인 확인 → 환경 점검 (30일 유효 캐시) → ui-exam.html → ui-result.html
                         (모두 same-window, 새 창 안에서 완결)
  ui-result.html  ──→ "시험 창 닫기" → 본 사이트 ../service-site/ui-mypage.html

ui/admin/  (관리자 web — 운영자 단독 진입, SSO 별도)
  ui-admin-dashboard.html  ↔ members / payments / question-bank / question-create

ui/shared/
  env-check-modal.js  ←  service-site 모든 결제·진입 경로 + user-web 응시 홈
  exam-info-modal.js  ←  service-site 무료 샘플 트리거 (window.open)
```

**모든 페이지 공통**:
- 좌하단 *← UI 인덱스* 버튼 (서브폴더에선 `../ui-index.html`)
- 한국어 / 日本語 i18n 토글 (localStorage `kopass_main_locale` 공유)
- 햄버거 메뉴 (≤768px) — 풀너비 드로어 + 좌우 20px 패딩
- 반응형 — 데스크탑 / 태블릿 / 모바일 (자동 1단 스택)
- 폰트 — Pretendard Variable + Pretendard JP Variable 통일
- 베이스 리셋 — `box-sizing: border-box` + `overflow-x: clip` + 미디어 max-width
- 응시 화면(user-web/ui-exam.html)은 **1080px shell 카드 + grey-100 배경**으로 집중 환경 구성

> **응시 진입 = 새 창** (정책 10): `../ui/service-site/ui-mypage*.html`의 "응시하기" → `window.open()` → `../ui/user-web/ui-exam-home.html`. 새 창 안에서 본인 확인 → 환경 점검 → 응시 → 결과까지 same-window로 완결. 보관 자료(영수증·인증서·결과지 PDF) 다운로드만 본 사이트(service-site) 마이페이지에서 처리.

---

## 작성 원칙

- 팩트만 기술. 추측은 `open-questions.md`로.
- "완료" "확정" "100%" 같은 진척 표현 금지. 결정은 git history에서 트래킹.
- 결정자 이름·날짜 본문에 박지 않는다.
- 시각적 장식(배지·매트릭스)은 v2에서 검토.
- 본 라운드는 Phase 1(말하기)에 집중. 향후 영역 확장 가설은 본문에 쓰지 않는다.
- **1차 오픈은 라이트하게**. 환불 분기·재응시 티켓·딥링크 같은 무거운 동선은 라운드 2 이후로 미룬다.

## 자료 우선순위

자료가 충돌할 때의 기준선:

1. **`Kopass 서비스 개발 기능 명세.pdf`** ← **가장 최근 합의 문서.** 본 라운드의 골격은 여기에서 따온다.
2. `re/MaroPass IBT 시스템 개발 (1차 말하기) ... .md` — 마스터 작업 노트 (디테일 풍부, 일부는 구버전)
3. `re/251231_MaroPass_개발_프로젝트.pdf` — Newin 내부 개발 플로우
4. `re/251222_MaroPass_IBT_시스템_개발_계획(안).pdf` — 재단 측 공식 계획안
5. `re/260106_한국어_말하기_평가_실증실험_설문조사_결과.pdf` — 실증 페인포인트
6. `img/` 디자인 자료 — 모바일 1단 위주, 일부 화면만 존재
7. `re/*.docx`, `re/*.pptx` — 본 라운드 미열람
