# 디자인 시스템

> 외부 베이스 디자인 자료(`newinDESIGN.md`)를 참조하되, 일본 시장·시험 UI·1차 오픈 light에 맞게 정정한 KoPASS 디자인 시스템.

## 한 줄

**kopass 시각 언어는 *calm·optimistic·trustworthy* 톤을 채택하되, 폰트는 일본어 우선·시험 UI 토큰을 추가·fintech 전용 요소는 뺀다.**

## 이 한 줄을 지지하는 이유 5개

1. 차분·신뢰·안정 톤은 일본인 학습자가 시험에서 원하는 *예측 가능성*과 정확히 일치한다.
2. `#2e84ff` 블루는 학습·진단 도메인에도 어울리는 중립적 신뢰 컬러다.
3. fintech 전용 요소(Tabular numerals·장식 이모지 폰트·super-compact density)는 시험 UI에 의미가 없거나 반대로 작용하므로 뺀다.
4. 일본 시장은 폰트 가독성에 특히 민감하므로, 일본어 폰트를 1순위로 두고 한국어 시험 콘텐츠는 별도 lang 분기로 처리한다.
5. Phase 1 light에서는 *primitive → semantic* 2-tier 토큰만으로 충분하고, *component-level* 토큰은 라운드 2 이후 디자인 발주 시 채운다.

---

## 1. Visual Theme

**Calm · Optimistic · Trustworthy**.

- 흰 캔버스(`#ffffff`) + 짙은 차콜 헤딩(`#191f28`) + Primary Blue(`#2e84ff`) 인터랙션 컬러
- 그림자 최소화, 컬러 대비로 위계 표현
- 일본인 학습자의 *안정성·명확성·예측 가능성* 선호와 정합

## 2. Color Palette

### Primary
| 토큰 | 값 | 용도 |
|---|---|---|
| `blue-500` | `#2e84ff` | **Primary CTA**, 링크, 활성 상태, 선택 하이라이트 |
| `blue-600` | `#2272eb` | Hover/Pressed |
| `blue-50` | `#e8f3ff` | Informational 배경, 선택된 카드 |

### Background & Text
| 토큰 | 값 | 용도 |
|---|---|---|
| `background` | `#ffffff` | 페이지·카드 |
| `surface` | `#f9fafb` | grey-50, 보조 배경 |
| `text-heading` | `#191f28` | grey-900, 헤딩 |
| `text-body` | `#6b7684` | grey-600, 본문 |
| `text-caption` | `#8b95a1` | grey-500, 보조 |
| `text-placeholder` | `#b0b8c1` | grey-400 |

### Border
| 토큰 | 값 | 용도 |
|---|---|---|
| `border-default` | `#e5e8eb` | grey-200 |
| `border-strong` | `#d1d6db` | grey-300, 활성 입력 |

### Semantic
| 토큰 | 값 | 용도 |
|---|---|---|
| `success` | `#03b26c` | 성공·통과·정답 |
| `error` | `#f04452` | 오류·실패·녹음 중 (빨간 타이머) |
| `warning` | `#fe9800` | 주의·환경 점검 미통과 |
| `info` | `#18a5a5` | 정보 강조 |

### kopass 특수 — 시험 UI 전용

| 토큰 | 값 | 용도 |
|---|---|---|
| `timer-prep` | `#2e84ff` (blue-500) | **준비 시간** 카운트다운 |
| `timer-record` | `#f04452` (red-500) | **녹음 시간** 카운트다운 + "녹음 중" 인디케이터 |
| `beep` | `#ef4444` | 비프음 시점 강조 (짧은 플래시) |
| `waveform-base` | `#fda4af` (red-300) | Waveform 도트 비활성 |
| `waveform-active` | `#f04452` (red-500) | Waveform 도트 활성 |
| `grade-1` ~ `grade-6` | (색상 매핑 미정 — GAP-01 결정 후) | 1~6급 또는 A~D 등급 배지 |
| `radar-axis` × 5 | (5각 차트 — 발음·유창성·어휘·문법·내용 구성 컬러 매핑 미정) | 결과 화면 |

> 등급·5각 차트 색상은 GAP-01(등급 체계) 결정 후 확정.

---

## 3. Typography

### Font Stack — 일본어 우선, 한국어 콘텐츠 분리

```
/* UI 기본 (일본어) */
font-family: "Noto Sans JP", "Hiragino Sans", "Hiragino Kaku Gothic ProN",
             "Yu Gothic", "Meiryo", -apple-system, BlinkMacSystemFont,
             "Helvetica Neue", Arial, sans-serif;

/* 한국어 시험 콘텐츠 */
:lang(ko), .lang-ko {
  font-family: "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic",
               -apple-system, sans-serif;
}

/* 모노스페이스 (점수·시간 표기) */
font-family: "SF Mono", SFMono-Regular, Menlo, Consolas, monospace;
```

> Toss의 *Toss Product Sans*는 한국어·라틴 최적화 전용 폰트라 일본어 가독성에 부적합. 일본어용으로 **Noto Sans JP**를 1순위로 둔다.

### Hierarchy (Toss 기반, 일부 정정)

| Role | Size | Weight | Line Height | 용도 |
|---|---|---|---|---|
| Display | 30px | 700 | 1.33 | 시험 결과 점수 (예: `30점`) |
| Heading L | 26px | 700 | 1.38 | 페이지 타이틀 |
| Heading | 22px | 700 | 1.36 | 섹션 헤딩 |
| Subtitle | 20px | 600 | 1.40 | 카드 제목 |
| Body L | 16px | 400 | 1.50 | 본문 (시험 지시문 등) |
| Body | 14px | 400 | 1.57 | 표준 본문 |
| Caption | 13px | 400 | 1.54 | 보조 정보·시간 |
| Tiny | 12px | 400 | 1.50 | 타임스탬프·미세 |

### 원칙
- 5 weight만 사용: 400 / 600 / 700 (+ 500은 아이콘 라벨용 옵션)
- **Tabular numerals 사용 안 함** — Toss는 fintech라 사용하지만 kopass 시험 점수에는 변별력 없음
- **일본어/한국어 동시 렌더링 시 라인 높이 1.5+ 유지** (받침 잘림 방지)
- 시험 점수 (예: `30 / 200`)는 Display + 700 + 모노스페이스로 가독성 확보

---

## 4. Components

### Button
| Variant | 배경 | 테두리 | 텍스트 | Radius |
|---|---|---|---|---|
| Primary | `blue-500` | `blue-500` | 흰색, 600 | 8px |
| Secondary | 투명 | `border-default` | `text-heading`, 600 | 8px |
| Ghost | 투명 | 없음 | `blue-500`, 600 | 8px |
| Destructive | `error` | `error` | 흰색, 600 | 8px |
| Disabled | opacity 0.5 | (유지) | (유지) | 8px |

- Padding: `8px 16px` (default), `12px 20px` (large), `6px 12px` (compact)
- 시험 화면의 *제출* 버튼은 Large + Primary
- 환경 점검 *마이크 테스트* 버튼은 Large + Primary, 5초 카운트다운 후 *Replay* 변환

### Input
- Background: `surface` (`#f9fafb`) for filled / `background` for outlined
- Border: 1px `border-default` → focus 2px `blue-500`
- Radius: 8px
- Error: 2px `error` 테두리 + 13px 에러 텍스트
- 비밀번호·OTP·이메일 인증 코드는 별도 SplitTextField 컴포넌트

### Card
- Background: `background`
- Border: 1px `border-default` 또는 무테두리
- Radius: 12px (표준), 16px (피처드)
- Shadow: `0 2px 8px rgba(0,0,0,0.06)` 또는 무그림자
- 시험 안내 모달·문항 카드·결과 카드 모두 Card

### Dialog (모달)
- Background: `background`
- Radius: 16px
- Width: 모바일 360px / 데스크탑 480px
- 환경 점검·재응시·결과 공개·환불 신청 모두 Dialog 또는 Bottom Sheet

### Bottom Sheet (모바일·앱)
- Background: `background`
- Top Radius: 16px
- 모바일에서 Dialog 대신 Bottom Sheet 우선

### Badge / Chip
- Radius: 9999px (pill)
- Padding: `2px 8px`
- 등급 배지·상태 배지(준비중·진행중·완료)·우선순위 배지

### Waveform Indicator (kopass 특수)
- 4 도트 가로 배열 (자료의 `녹음중-2.png` 기준)
- 비활성: `waveform-base`
- 활성: `waveform-active`
- 애니메이션: 펄스 250ms 시계 반대 방향

### Timer (kopass 특수)
- **Prep Timer**: `timer-prep` 컬러 + `MM:SS` 모노스페이스 + 시계 아이콘 (Lucide `Timer`)
- **Record Timer**: `timer-record` 컬러 + `MM:SS` + 마이크 아이콘 (Lucide `Mic`)

---

## 5. Layout

### Spacing
- Base unit: 8px
- 사용 값: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- 가로 패딩: 데스크탑 32px, 태블릿 24px, 모바일 20px
- 시험 화면은 *breathing room* 우선 — Toss의 fintech compact density 아님

### Breakpoints
| 이름 | 너비 | 키 변화 |
|---|---|---|
| Mobile | <768px | 1단 스택, Bottom Sheet, 하단 탭 |
| Tablet | 768~1023 | 1단 / 일부 2단, Sticky CTA |
| Desktop | ≥1024 | **응시 화면 2단 (좌:문제 / 우:응시)**, 사이드바 메뉴 |
| Wide | ≥1440 | 콘텐츠 max-width 1280px 중앙 정렬 |

### Touch Targets (모바일·앱)
- 최소 44×44px (iOS HIG) / 48×48px (Material)
- Bottom Sheet 닫기 영역 56px

### 시험 응시 — 데스크탑 2단 레이아웃

```
┌──────────────────────────────────────────────┐
│ Header (시험명·진행 N/M·전체 타이머·종료 X)   │ 56px
├────────────────────────┬─────────────────────┤
│                        │                     │
│  좌: 문제 영역          │  우: 응시 영역        │
│  - 지시문 텍스트         │  - 상태 메시지        │
│  - 이미지/오디오         │  - 타이머 (준비/녹음) │
│  - 자료                │  - 녹음 인디케이터    │
│  - 폰트 크기 조절       │  - 메모장            │
│  ~60% width            │  ~40% width         │
│                        │                     │
└────────────────────────┴─────────────────────┘
```

### 시험 응시 — 모바일 1단

```
┌──────────────────────────┐
│ Header                   │
├──────────────────────────┤
│ 지시문 카드               │
├──────────────────────────┤
│ 콘텐츠 (이미지/오디오)    │
├──────────────────────────┤
│ 타이머 + 인디케이터       │
├──────────────────────────┤
│ 메모장 (접힘 가능)        │
└──────────────────────────┘
```

---

## 6. Depth & Elevation

| Level | Shadow | 용도 |
|---|---|---|
| Flat | 없음 | 페이지·인라인 요소 |
| Subtle | `0 1px 3px rgba(0,0,0,0.06)` | 리스트 분리·카드 |
| Standard | `0 2px 8px rgba(0,0,0,0.08)` | 콘텐츠 패널·환경 점검 카드 |
| Elevated | `0 4px 12px rgba(0,0,0,0.12)` | 드롭다운·플로팅 |
| Modal | `0 8px 24px rgba(0,0,0,0.16)` | 다이얼로그·바텀시트 |

> **시험 화면**은 Subtle 이상 사용 금지. 응시자가 시각 노이즈에 분산되지 않도록.

## 7. Iconography

- **단일 라이브러리**: **Lucide React** (1,400+ 아이콘, 24×24 그리드, tree-shakeable)
- 사이즈: 인라인 16px / 버튼 18px / 단독 24px / 피처 32~48px
- Stroke width: **1.75px** (Toss 기본값보다 약간 강함, 시험 가독성 우선)
- `currentColor` 상속 — 색상 하드코딩 금지

### 핵심 아이콘 매핑

| 용도 | Lucide |
|---|---|
| 마이크 | `Mic`, `MicOff` |
| 타이머 | `Timer`, `TimerReset` |
| 재생/녹음 | `Play`, `Pause`, `Disc` |
| 시험 결과 | `Award`, `Trophy` |
| 인증서 | `FileText`, `BadgeCheck` |
| 결제 | `CreditCard`, `Receipt` |
| 알림 | `Bell` (1차 오픈은 이메일만이라 미사용 가능) |
| 상태 | `CheckCircle2`, `XCircle`, `AlertTriangle` |

> Toss의 Tossface 이모지는 **사용 금지**. 일본 시장 톤·가독성 정합성 모두에서 부적합.

---

## 8. Do's & Don'ts

### Do
- 모든 인터랙티브 요소에 `blue-500` 사용
- 응시 화면은 *breathing room* 우선 (Toss fintech compact density 미적용)
- 일본어 폰트 1순위, 한국어 콘텐츠는 `:lang(ko)` 분기
- 시험 점수는 Display + 700 + 모노스페이스
- 그림자는 단일 레이어, 검정 + 낮은 opacity

### Don't
- Tabular numerals는 사용 안 함 (시험 점수는 비교 정렬이 핵심이 아님)
- Tossface·이모지 일체 사용 금지
- 7px 미만의 마이크로 텍스트 금지
- 빨강(`#f04452`)을 *녹음 중* 외 다른 강조에 쓰지 않기
- 그림자 색상에 색조 추가 금지

---

## 9. i18n — 다국어 지원 아키텍처

> **두 트랙**: (1) **UI 라벨·메시지·버튼** = 사용자 언어 (일본어 메인 / 한국어 검토용) / (2) **시험 콘텐츠** = 한국어 고정 (UI 토글과 무관).

### 9.1 라이트 i18n 구조 (Phase 1)

| 항목 | 결정 |
|---|---|
| **기본 locale** | `ko` (개발·기획 단계) → `ja` (서비스 개시 시 전환) |
| **지원 locale** | `ko`, `ja` (Phase 1) — `en` 등은 라운드 3 이후 |
| **locale 코드** | BCP 47 — `ko`, `ja`, `en` (지역 코드 미사용 — `ko-KR`/`ja-JP` 분리 불필요) |
| **fallback** | `ja` → `ko` → 키 그대로 표시 |
| **저장 위치** | `<html lang="ko|ja">` + 사용자 설정 localStorage |
| **번역 파일** | Phase 1: 단일 JS 객체 (`i18n.ko = {...}`, `i18n.ja = {...}`) / 라운드 3: JSON 분리 |
| **키 네이밍** | `섹션_의미` 패턴 — `nav_tests`, `auth_login`, `exam_record_time`, `result_grade` |
| **시험 콘텐츠 마킹** | `<element lang="ko">` — 토글 영향 받지 않음, 자동 폰트 분기 |

### 9.2 콘텐츠 종류별 처리

| 콘텐츠 종류 | locale | 비고 |
|---|---|---|
| UI 라벨·버튼·메시지 | `i18n[locale]` 사전 | 토글 대상 |
| 시험 지시문·문제 텍스트 | `lang="ko"` 고정 | 토글 무관, Noto Sans KR |
| 시험 안내·합격 기준 | UI 사전 | 일본어 메인 |
| AI 종합 피드백 | `lang="ko"` 고정 (GAP-10) | 한국어 콘텐츠 |
| 인증서 PDF | UI 사전 (헤더) + `lang="ko"` (점수·내용) | 병기 |
| 약관·개인정보 | UI 사전 | 일본 법적 — 일본어 정문 필요 |

### 9.3 폰트 스위칭

```css
html { font-family: "Noto Sans JP", "Hiragino Sans", "Yu Gothic", sans-serif; }
html[lang="ko"] { font-family: "Noto Sans KR", "Apple SD Gothic Neo", sans-serif; }
[lang="ko"] { font-family: "Noto Sans KR", "Apple SD Gothic Neo", sans-serif; } /* 인라인 한국어 콘텐츠 */
```

### 9.4 i18n 함수 시그니처 (라이트 버전)

```js
const i18n = {
  ko: { nav_tests: '시험 목록', exam_take: '응시하기', ... },
  ja: { nav_tests: '試験一覧', exam_take: '受験する', ... }
};
let locale = localStorage.getItem('kopass_locale') || 'ko';

function t(key) {
  return i18n[locale]?.[key] ?? i18n.ko?.[key] ?? key;
}
function setLocale(loc) {
  locale = loc;
  localStorage.setItem('kopass_locale', loc);
  document.documentElement.lang = loc;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
}
```

### 9.5 날짜·시간·숫자·통화 포맷

| 항목 | 패턴 |
|---|---|
| 날짜 | `Intl.DateTimeFormat(locale).format(date)` — 한국어 *2026년 5월 7일* / 일본어 *2026年5月7日* |
| 시간 | 24시간 표기 통일 — `00:13:24` |
| 점수 | `획득점/만점` — `30/200` (locale 무관) |
| 통화 | `Intl.NumberFormat('ja-JP', {style:'currency', currency:'JPY'}).format(value)` — `¥4,950` (1차 오픈은 엔화 단일) |
| 시험 시간 (분) | UI 사전의 `unit_minutes` 키 사용 — `25분` / `25分` |

### 9.6 라운드 3 확장 (`11-i18n.md`)

- 번역 JSON 분리 (`locales/ko.json`, `locales/ja.json`)
- 플루럴 룰 (`Intl.PluralRules`)
- RTL 대비 (현재 없음)
- 다국어 메일 템플릿
- URL 전략 (서브도메인 `ja.kopass.jp` vs 패스 `/ja/` vs 쿠키)
- 외부 번역 워크플로우 (Crowdin / Lokalise 등)
- 시험 콘텐츠 다국어화 (Phase 1은 한국어 단일)

---

## 10. 기술 매핑 (1차 오픈 가설)

| 항목 | 1차 오픈 |
|---|---|
| CSS 프레임워크 | **Tailwind CSS** (CDN 또는 빌드, 결정 미정) |
| 컴포넌트 라이브러리 | **shadcn/ui** (Tailwind + Radix) 가설 / 또는 자체 컴포넌트 |
| 아이콘 | **Lucide React** |
| 폰트 호스팅 | Google Fonts (Noto Sans JP, Noto Sans KR) |
| 토큰 매핑 | CSS Custom Properties → Tailwind config |
| 다크 모드 | ❌ 1차 오픈 미지원 (라운드 3) |

---

## 10b. 공숲(Gongsoop) 하이브리드 톤 — 마케팅·홈 화면 한정

> Toss의 *clinical clarity*에 공숲(`fullservice.conects.com`)의 *친근·따뜻함*을 부분 흡수. **마케팅·홈·랜딩 한정**, 응시·결제·결과 화면은 Toss 베이스 그대로.

### 10b.1 적용 범위

| 영역 | 적용 톤 |
|---|---|
| 메인 홈·랜딩·시험 목록·시험 상세 | **하이브리드** (Toss 카드/타이포 + 공숲 그라디언트/블롭) |
| 환경 점검·응시 클라이언트·결과·인증서 | **Toss 그대로** (집중·신뢰·차분) |
| 마이페이지 | **Toss 베이스 + 마이크로 강조** (그라디언트는 헤더 한정) |
| 관리자 백오피스 | **Toss 그대로** (도구적 명확성) |

### 10b.2 그라디언트 토큰 (마케팅용)

| 토큰 | 값 | 용도 |
|---|---|---|
| `gradient-hero-soft` | `linear-gradient(135deg, #fef9e7 0%, #e8f3ff 50%, #ecfdf5 100%)` | 헤로 배경 (노랑 → 파랑 → 그린, 부드러운 파스텔) |
| `gradient-cta-success` | `linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)` | 통계 카드 강조 (응시 수 등) |
| `gradient-cta-blue` | `linear-gradient(135deg, #e8f3ff 0%, #bfdbfe 100%)` | 시험 카드 강조 |
| `gradient-overlay-blob` | radial-gradient 다중 블롭 합성 | 헤로 추상 블롭 일러스트 |

### 10b.3 일러스트 가이드라인

| 항목 | 1차 오픈 | 라운드 2~ |
|---|---|---|
| **스타일** | 추상 블롭·기하 도형 (CSS+SVG로 표현) | 일러스트레이터 외주 — 모더 일러스트 |
| **마스코트** | ❌ (없음) | 검토 — 일본·한국 톤 동시 호환 캐릭터 |
| **컬러** | 파스텔 다중 (노·파·그린·핑크) | 동일 톤 유지 |
| **선** | 부드러운 라운드, 1.5~2px | 동일 |
| **위치** | 헤로·통계 카드 헤더·빈 상태(empty state) | 동일 + 결과 화면 축하 모먼트 |

### 10b.4 마이크로 인터랙션 (공숲 흡수)

- 카드 호버 시 *0.5° 미세 기울기* + 그림자 강화 (Toss는 정적, 공숲은 약간 살아있음)
- CTA 클릭 시 *짧은 펄스 애니메이션* (200ms scale 0.97 → 1)
- 통계 숫자 *카운트업 애니메이션* (500ms, ease-out) — 공숲의 *26,773건* 같은 효과
- 단, *시험·결과·인증서 화면에는 적용 금지* — 시험 도중 시각 노이즈는 신뢰도 훼손

### 10b.5 Don't (공숲 흡수 시 주의)

- 만화풍 캐릭터·말풍선 → 일본 시장에서 *유아용*으로 오인 가능. 1차 오픈 미적용
- 형광 컬러·고채도 그라디언트 → 신뢰도 훼손
- 흔들리는 애니메이션·번쩍임 → 시험 집중 방해
- *공숲의 sub-nav (8개 탭 + 더보기)* 미차용 — Phase 1 단순 GNB

---

## 11. 본 문서가 다루지 않는 것

- 화면 단위 레이아웃 → `05-screen-inventory.md`
- 컴포넌트 코드 구현 → 라운드 2 디자인 발주 후 `08b-component-library.md` (작성 예정)
- 디자인 토큰 JSON·Style Dictionary → 라운드 2
- 다크 모드·고대비 모드 → 라운드 3
- 접근성 (WCAG AA) 디테일 → 라운드 3 `12-security.md` + 별도

## 12. 본 문서를 결정·관리하는 자료

| 자료 | 역할 |
|---|---|
| `newinDESIGN.md` | 본 문서의 베이스 (Toss 디자인 시스템 원본) |
| `05-screen-inventory.md` | 본 시스템의 적용 대상 화면 목록 |
| `01-glossary.md` | 본 시스템의 용어와 정합 (혼동 용어 표 포함) |
