/* ═══════════════════════════════════════════════════════════
   MaroPass 학습자 사이트 — 공유 셸 (GNB + 공지 + 푸터 + i18n 주입)
   페이지는 <body data-page="키" data-authed="true|false"> 만 두면
   이 스크립트가 상단 공지·GNB 와 하단 푸터·플로팅 도움말을 주입한다.
   네비게이션·번역 사전은 여기 한 곳에서 관리 → 전 페이지 일관.
   ── 로케일(ko/ja)은 localStorage 'kopass_main_locale' 로 전 페이지 공유.
   ═══════════════════════════════════════════════════════════ */
(function () {
  var NAV = [
    { key: 'home', href: 'index.html', ko: '홈', ja: 'ホーム' },
    { key: 'tests', href: 'tests.html', ko: '시험 목록', ja: '試験一覧' },
    { key: 'mypage', href: 'mypage.html', ko: '마이페이지', ja: 'マイページ' },
    { key: 'support', href: 'faq.html', ko: '고객센터', ja: 'サポート' }
  ];

  // 셸(공지·GNB·푸터) 공통 문구 사전
  var CHROME = {
    ko: {
      notice_tag: '점검', notice_text: '정기 서버 점검 안내 · 8/20(수) 02:00~04:00 (JST) →',
      login: '로그인', signup: '회원가입',
      footer_about: '일본인 한국어 학습자를 위한 IBT 진단평가 플랫폼. TOPIK 말하기를 보완하는 1차 진단 단계.',
      f_service: '서비스', f_tests: '시험 목록', f_pricing: '가격', f_cert: '인증서', f_about: '서비스 소개',
      f_support: '고객센터', f_notice: '공지사항', f_faq: 'FAQ', f_contact: '1:1 문의',
      f_policy: '정책', f_terms: '이용약관', f_privacy: '개인정보처리방침', f_commerce: '특정상거래법 표시',
      f_company: '사업자 정보 · 회사명 · 주소',
      flow_open: '흐름', flow_title: '화면 흐름 미리보기',
      flow_guest: '비회원', flow_member: '회원',
      fs_home: '홈', fs_tests: '시험 목록', fs_detail: '시험 상세', fs_auth: '회원가입 · 로그인',
      fs_my: '마이페이지', fs_mytests: '응시할 시험', fs_gate: '환경 점검', fs_exam: '응시', fs_result: '결과', fs_cert: '인증서',
      flow_index: '← ui2 인덱스'
    },
    ja: {
      notice_tag: 'メンテ', notice_text: '定期サーバーメンテナンスのお知らせ · 8/20(水) 02:00~04:00 (JST) →',
      login: 'ログイン', signup: '会員登録',
      footer_about: '日本人韓国語学習者のためのIBT診断評価プラットフォーム。TOPIKスピーキングを補完する1次診断段階。',
      f_service: 'サービス', f_tests: '試験一覧', f_pricing: '価格', f_cert: '証明書', f_about: 'サービス紹介',
      f_support: 'サポート', f_notice: 'お知らせ', f_faq: 'FAQ', f_contact: 'お問い合わせ',
      f_policy: 'ポリシー', f_terms: '利用規約', f_privacy: 'プライバシーポリシー', f_commerce: '特定商取引法に基づく表記',
      f_company: '会社情報 · 会社名 · 住所',
      flow_open: 'フロー', flow_title: '画面フロープレビュー',
      flow_guest: '未登録', flow_member: '会員',
      fs_home: 'ホーム', fs_tests: '試験一覧', fs_detail: '試験詳細', fs_auth: '会員登録 · ログイン',
      fs_my: 'マイページ', fs_mytests: '受験する試験', fs_gate: '環境チェック', fs_exam: '受験', fs_result: '結果', fs_cert: '証明書',
      flow_index: '← ui2 インデックス'
    }
  };

  // 푸터 정책 문서 본문 (관리자 「약관·정책」에서 게시하는 문서와 동일 구성)
  function sctTable(rows) {
    return '<table class="policy-sct"><tbody>' + rows.map(function (r) {
      return '<tr><th>' + r[0] + '</th><td>' + r[1] + '</td></tr>';
    }).join('') + '</tbody></table>';
  }
  var POLICY_DOCS = {
    terms: {
      ko: { title: '이용약관', html:
        '<h3>제1조 (목적)</h3><p>이 약관은 주식회사 뉴인(이하 "회사")이 제공하는 MaroPass 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>' +
        '<h3>제2조 (정의)</h3><ul><li><strong>서비스</strong>: 회사가 제공하는 온라인 한국어 능력 진단·모의고사 응시 및 결과 제공 플랫폼을 의미합니다.</li><li><strong>이용자</strong>: 이 약관에 따라 회사가 제공하는 서비스를 이용하는 회원을 말합니다.</li><li><strong>응시권</strong>: 상품을 결제하여 취득하는, 특정 시험을 정해진 기간 내에 응시할 수 있는 권리를 말합니다.</li></ul>' +
        '<h3>제3조 (응시권 및 이용 기간)</h3><p>응시권은 결제 완료 시 부여되며, 상품별로 정해진 응시 기간 내에 사용해야 합니다. 기간이 경과한 응시권은 사용할 수 없습니다.</p>' +
        '<h3>제4조 (금지행위)</h3><p>이용자는 시험 문항의 복제·유출·부정 응시 등 서비스의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.</p>' },
      ja: { title: '利用規約', html:
        '<h3>第1条（目的）</h3><p>本規約は、株式会社Newin（以下「当社」）が提供するMaroPassサービス（以下「本サービス」）の利用に関して、当社と利用者との間の権利、義務および責任事項その他必要な事項を定めることを目的とします。</p>' +
        '<h3>第2条（定義）</h3><ul><li><strong>本サービス</strong>：当社が提供するオンライン韓国語能力診断・模擬試験の受験および結果提供プラットフォームをいいます。</li><li><strong>利用者</strong>：本規約に従い当社が提供する本サービスを利用する会員をいいます。</li><li><strong>受験権</strong>：商品を決済して取得する、特定の試験を所定の期間内に受験できる権利をいいます。</li></ul>' +
        '<h3>第3条（受験権および利用期間）</h3><p>受験権は決済完了時に付与され、商品ごとに定められた受験期間内に使用する必要があります。期間を経過した受験権は使用できません。</p>' +
        '<h3>第4条（禁止行為）</h3><p>利用者は、試験問題の複製・流出・不正受験など、本サービスの正常な運営を妨げる行為を行ってはなりません。</p>' }
    },
    privacy: {
      ko: { title: '개인정보처리방침', html:
        '<h3>1. 수집하는 개인정보 항목</h3><p>회사는 회원가입, 상품 결제, 시험 응시 및 결과 제공을 위해 다음의 개인정보를 수집합니다.</p><ul><li>필수: 이름, 이메일 주소, 결제 정보</li><li>응시 과정에서 생성: 응답 데이터, 음성 녹음(말하기 평가 상품), 채점 결과</li></ul>' +
        '<h3>2. 개인정보의 이용 목적</h3><p>수집한 개인정보는 서비스 제공, 본인 확인, 결제 처리, 채점 및 결과 통지, 고객 문의 대응의 목적으로만 이용합니다.</p>' +
        '<h3>3. 보관 및 파기</h3><p>관련 법령이 정한 기간 동안 보관하며, 목적 달성 후 지체 없이 파기합니다.</p>' +
        '<h3>4. 이용자의 권리</h3><p>이용자는 언제든지 자신의 개인정보에 대한 열람·정정·삭제를 요청할 수 있습니다.</p>' },
      ja: { title: 'プライバシーポリシー', html:
        '<h3>1. 収集する個人情報の項目</h3><p>当社は、会員登録、商品決済、試験受験および結果提供のため、以下の個人情報を収集します。</p><ul><li>必須：氏名、メールアドレス、決済情報</li><li>受験過程で生成：回答データ、音声録音（スピーキング評価商品）、採点結果</li></ul>' +
        '<h3>2. 個人情報の利用目的</h3><p>収集した個人情報は、サービス提供、本人確認、決済処理、採点および結果通知、お問い合わせ対応の目的にのみ利用します。</p>' +
        '<h3>3. 保管および廃棄</h3><p>関連法令が定める期間保管し、目的達成後は遅滞なく廃棄します。</p>' +
        '<h3>4. 利用者の権利</h3><p>利用者はいつでも自己の個人情報の開示・訂正・削除を請求できます。</p>' }
    },
    commerce: {
      ko: { title: '특정상거래법에 근거한 표기', html: sctTable([
        ['판매 사업자명', '주식회사 뉴인 (株式会社 Newin)'],
        ['운영 총괄 책임자', '이성민'],
        ['소재지', '東京都○○区○○ 1-2-3 ○○ビル 4F'],
        ['전화번호', '03-0000-0000 (평일 10:00–18:00)'],
        ['이메일 주소', 'support@maropass.jp'],
        ['판매 가격', '각 상품 페이지에 표시된 금액 (소비세 포함)'],
        ['상품 대금 외 필요 요금', '없음 (인터넷 접속에 필요한 통신비는 이용자 부담)'],
        ['지불 방법', '신용카드, 각종 페이 등'],
        ['지불 시기', '주문 시 즉시 결제'],
        ['상품 인도 시기', '결제 완료 즉시 응시권 부여 (디지털 서비스)'],
        ['반품·환불(취소) 조건', '디지털 콘텐츠 특성상 응시(콘텐츠 열람)를 시작한 후에는 환불이 불가합니다. 미응시 상태에 한해 결제일로부터 8일 이내 취소·환불이 가능합니다.'],
        ['동작 환경', '최신 버전의 Chrome / Safari / Edge, 마이크(말하기 평가 상품)']
      ]) },
      ja: { title: '特定商取引法に基づく表記', html: sctTable([
        ['販売業者', '株式会社 Newin'],
        ['運営統括責任者', 'イ・ソンミン'],
        ['所在地', '東京都○○区○○ 1-2-3 ○○ビル 4F'],
        ['電話番号', '03-0000-0000（平日 10:00–18:00）'],
        ['メールアドレス', 'support@maropass.jp'],
        ['販売価格', '各商品ページに表示された金額（消費税込み）'],
        ['商品代金以外の必要料金', 'なし（インターネット接続に必要な通信費はお客様負担）'],
        ['お支払い方法', 'クレジットカード、各種ペイ等'],
        ['お支払い時期', 'ご注文時に即時決済'],
        ['商品の引渡し時期', '決済完了後、直ちに受験権を付与（デジタルサービス）'],
        ['返品・キャンセルについて', 'デジタルコンテンツの性質上、受験（コンテンツ閲覧）開始後の返金はできません。未受験の場合に限り、決済日から8日以内にキャンセル・返金が可能です。'],
        ['動作環境', '最新版のChrome / Safari / Edge、マイク（スピーキング評価商品）']
      ]) }
    }
  };

  var locale = localStorage.getItem('kopass_main_locale') || 'ko';
  function c(k) { return (CHROME[locale] && CHROME[locale][k]) || CHROME.ko[k] || k; }

  // ── 로그인 상태(데모) — 비회원/회원 흐름 선택에 따라 GNB·마이페이지 링크가 바뀜 ──
  var AUTH_KEY = 'kopass_demo_authed';
  function getMode() {
    var v = localStorage.getItem(AUTH_KEY);
    if (v === '1') return 'member';
    if (v === '0') return 'guest';
    return (document.body.getAttribute('data-authed') === 'true') ? 'member' : 'guest';
  }
  function setMode(m) { localStorage.setItem(AUTH_KEY, m === 'member' ? '1' : '0'); }
  // GNB 우측(로그인/아바타)·마이페이지 링크·흐름 팝오버를 현재 모드에 맞게 갱신
  function applyAuthMode(mode) {
    var member = (mode === 'member');
    // 비회원이면 마이페이지 → 회원가입(auth)로 유도
    document.querySelectorAll('.gnb-item[data-nav="mypage"]').forEach(function (el) {
      el.setAttribute('href', member ? 'mypage.html' : 'auth.html');
    });
    var auth = document.querySelector('.gnb-auth');
    if (auth) {
      auth.innerHTML = member
        ? '<a href="mypage.html" class="gnb-profile" title="마이페이지"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>홍길동</a>'
        : '<button class="btn btn-ghost" data-c="login" onclick="location.href=\'auth.html#login\'">' + c('login') + '</button>' +
          '<button class="btn btn-primary" data-c="signup" onclick="location.href=\'auth.html\'">' + c('signup') + '</button>';
    }
    var nav = document.querySelector('.flow-nav');
    if (nav) {
      nav.setAttribute('data-mode', mode);
      nav.querySelectorAll('.flow-mode-btn').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-mode') === mode);
      });
    }
  }

  // 비회원이 회원 전용(1:1 문의 등) 링크 클릭 시 → 안내 후 회원가입으로 유도
  function guardMemberLinks() {
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (/mypage-inquiries\.html(\?|#|$)/.test(href) && getMode() !== 'member') {
        e.preventDefault();
        alert(locale === 'ja'
          ? '会員登録が必要なサービスです。会員登録ページに移動します。'
          : '회원가입이 필요한 서비스입니다. 회원가입 페이지로 이동합니다.');
        location.href = 'auth.html';
      }
    });
  }

  function buildNotice() {
    var el = document.createElement('div');
    el.className = 'notice-bar';
    el.innerHTML =
      '<span class="notice-bar-tag" data-c="notice_tag">' + c('notice_tag') + '</span>' +
      '<a href="notice.html" class="notice-bar-text" data-c="notice_text">' + c('notice_text') + '</a>' +
      '<span class="notice-bar-close" role="button" aria-label="닫기">×</span>';
    el.querySelector('.notice-bar-close').addEventListener('click', function () { el.style.display = 'none'; });
    return el;
  }

  function buildGnb(activeKey) {
    var menu = NAV.map(function (n) {
      return '<a href="' + n.href + '" class="gnb-item' + (n.key === activeKey ? ' active' : '') +
        '" data-nav="' + n.key + '">' + (locale === 'ja' ? n.ja : n.ko) + '</a>';
    }).join('');

    var g = document.createElement('header');
    g.className = 'gnb';
    g.innerHTML =
      '<a href="index.html" class="gnb-logo"><span class="wm">Maro<span class="wm-accent">Pass</span></span></a>' +
      '<nav class="gnb-menu">' + menu + '</nav>' +
      '<div class="gnb-cta">' +
      '  <div class="locale-toggle">' +
      '    <button data-loc="ko"' + (locale === 'ko' ? ' class="active"' : '') + '>한국어</button>' +
      '    <button data-loc="ja"' + (locale === 'ja' ? ' class="active"' : '') + '>日本語</button>' +
      '  </div><span class="gnb-auth"></span>' +
      '</div>' +
      '<button class="gnb-burger" aria-label="메뉴"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>';

    g.querySelector('.gnb-burger').addEventListener('click', function () { g.classList.toggle('mobile-open'); });
    g.querySelectorAll('.locale-toggle button').forEach(function (b) {
      b.addEventListener('click', function () { setLocale(b.getAttribute('data-loc')); });
    });
    return g;
  }

  function buildFooter() {
    var f = document.createElement('footer');
    f.className = 'site-footer';
    f.innerHTML =
      '<div class="footer-grid">' +
      '  <div><div class="gnb-logo"><span class="wm">Maro<span class="wm-accent">Pass</span></span></div>' +
      '    <p class="footer-brand-text" data-c="footer_about">' + c('footer_about') + '</p></div>' +
      '  <div class="footer-col"><div class="footer-col-title" data-c="f_service">' + c('f_service') + '</div><ul>' +
      '    <li data-c="f_tests">' + c('f_tests') + '</li><li data-c="f_pricing">' + c('f_pricing') + '</li><li data-c="f_cert">' + c('f_cert') + '</li><li data-c="f_about">' + c('f_about') + '</li></ul></div>' +
      '  <div class="footer-col"><div class="footer-col-title" data-c="f_support">' + c('f_support') + '</div><ul>' +
      '    <li><a href="notice.html" data-c="f_notice">' + c('f_notice') + '</a></li><li><a href="faq.html" data-c="f_faq">' + c('f_faq') + '</a></li><li><a href="mypage-inquiries.html" data-c="f_contact">' + c('f_contact') + '</a></li></ul></div>' +
      '  <div class="footer-col"><div class="footer-col-title" data-c="f_policy">' + c('f_policy') + '</div><ul>' +
      '    <li><a href="#" class="policy-link" data-policy="terms" data-c="f_terms">' + c('f_terms') + '</a></li>' +
      '    <li><a href="#" class="policy-link" data-policy="privacy" data-c="f_privacy">' + c('f_privacy') + '</a></li>' +
      '    <li><a href="#" class="policy-link" data-policy="commerce" data-c="f_commerce">' + c('f_commerce') + '</a></li></ul></div>' +
      '</div>' +
      '<div class="footer-bottom"><span>© 2026 MaroPass · Newin Japan</span><span data-c="f_company">' + c('f_company') + '</span></div>';
    // 정책 문서 클릭 → 모달
    f.querySelectorAll('.policy-link').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); openPolicy(a.getAttribute('data-policy')); });
    });
    return f;
  }

  // ── 정책 문서 모달 (푸터 공통) ──
  var openPolicyKey = null;
  function injectPolicyStyles() {
    if (document.getElementById('policy-modal-style')) return;
    var s = document.createElement('style');
    s.id = 'policy-modal-style';
    s.textContent =
      '.policy-modal{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;padding:20px}' +
      '.policy-modal.open{display:flex}' +
      '.policy-modal .pm-backdrop{position:absolute;inset:0;background:rgba(15,23,42,.5);backdrop-filter:blur(2px);opacity:0;transition:opacity .2s ease}' +
      '.policy-modal.open .pm-backdrop{opacity:1}' +
      '.policy-modal .pm-dialog{position:relative;width:100%;max-width:640px;max-height:86vh;display:flex;flex-direction:column;background:#fff;border-radius:16px;box-shadow:0 24px 60px rgba(15,23,42,.28);transform:translateY(10px) scale(.98);opacity:0;transition:transform .22s var(--ease-out-cubic,cubic-bezier(.22,1,.36,1)),opacity .22s ease}' +
      '.policy-modal.open .pm-dialog{transform:none;opacity:1}' +
      '.policy-modal .pm-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 22px;border-bottom:1px solid var(--grey-200,#e5e7eb)}' +
      '.policy-modal .pm-title{font-size:17px;font-weight:800;color:var(--grey-900,#0f172a);margin:0}' +
      '.policy-modal .pm-close{width:34px;height:34px;border:none;background:var(--grey-100,#f1f5f9);border-radius:9px;color:var(--grey-500,#64748b);cursor:pointer;font-size:20px;line-height:1;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:background-color .12s}' +
      '.policy-modal .pm-close:hover{background:var(--grey-200,#e5e7eb)}' +
      '.policy-modal .pm-body{padding:22px;overflow:auto;font-size:14px;line-height:1.75;color:var(--grey-700,#334155)}' +
      '.policy-modal .pm-body h3{font-size:14.5px;font-weight:800;color:var(--grey-900,#0f172a);margin:18px 0 7px}' +
      '.policy-modal .pm-body h3:first-child{margin-top:0}' +
      '.policy-modal .pm-body p{margin:0 0 10px}.policy-modal .pm-body ul{padding-left:20px;margin:0 0 10px}.policy-modal .pm-body li{margin-bottom:4px}' +
      '.policy-modal .policy-sct{width:100%;border-collapse:collapse;border:1px solid var(--grey-200,#e5e7eb);border-radius:10px;overflow:hidden}' +
      '.policy-modal .policy-sct th{text-align:left;vertical-align:top;width:38%;background:var(--grey-50,#f8fafc);padding:11px 13px;font-size:12.5px;font-weight:700;color:var(--grey-800,#1e293b);border-bottom:1px solid var(--grey-200,#e5e7eb);border-right:1px solid var(--grey-200,#e5e7eb)}' +
      '.policy-modal .policy-sct td{padding:11px 13px;font-size:12.5px;color:var(--grey-700,#334155);border-bottom:1px solid var(--grey-200,#e5e7eb)}' +
      '.policy-modal .policy-sct tr:last-child th,.policy-modal .policy-sct tr:last-child td{border-bottom:none}' +
      '@media(max-width:520px){.policy-modal .policy-sct th{width:42%}}';
    document.head.appendChild(s);
  }
  function buildPolicyModal() {
    var m = document.createElement('div');
    m.className = 'policy-modal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.innerHTML =
      '<div class="pm-backdrop" data-close></div>' +
      '<div class="pm-dialog">' +
      '  <div class="pm-head"><h2 class="pm-title"></h2>' +
      '    <button class="pm-close" data-close aria-label="닫기">&times;</button></div>' +
      '  <div class="pm-body"></div>' +
      '</div>';
    m.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closePolicy);
    });
    return m;
  }
  function renderPolicy() {
    var m = document.getElementById('policy-modal');
    if (!m || !openPolicyKey) return;
    var doc = POLICY_DOCS[openPolicyKey];
    var d = (doc && (doc[locale] || doc.ko)) || null;
    if (!d) return;
    m.querySelector('.pm-title').textContent = d.title;
    m.querySelector('.pm-body').innerHTML = d.html;
    m.querySelector('.pm-body').scrollTop = 0;
  }
  function openPolicy(key) {
    if (!POLICY_DOCS[key]) return;
    openPolicyKey = key;
    var m = document.getElementById('policy-modal');
    if (!m) return;
    renderPolicy();
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closePolicy() {
    var m = document.getElementById('policy-modal');
    if (m) m.classList.remove('open');
    openPolicyKey = null;
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePolicy(); });

  function buildFloatHelp() {
    var b = document.createElement('button');
    b.className = 'float-help';
    b.setAttribute('aria-label', '문의/FAQ');
    b.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    b.addEventListener('click', function () { location.href = 'faq.html'; });
    return b;
  }

  // 로케일 전환 — 셸 문구 + 페이지의 data-i18n/data-i18n-html 갱신
  window.setLocale = function (loc) {
    locale = loc;
    localStorage.setItem('kopass_main_locale', loc);
    document.documentElement.lang = loc;
    // 셸 문구
    document.querySelectorAll('[data-c]').forEach(function (el) { el.textContent = c(el.getAttribute('data-c')); });
    // GNB 메뉴 라벨
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      var n = NAV.filter(function (x) { return x.key === el.getAttribute('data-nav'); })[0];
      if (n) el.textContent = (loc === 'ja' ? n.ja : n.ko);
    });
    document.querySelectorAll('.locale-toggle button').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-loc') === loc);
    });
    // 페이지별 i18n (window.PAGE_I18N = {ko:{}, ja:{}})
    if (window.PAGE_I18N) {
      var dict = window.PAGE_I18N[loc] || window.PAGE_I18N.ko || {};
      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var k = el.getAttribute('data-i18n'); if (dict[k] != null) el.textContent = dict[k];
      });
      document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
        var k = el.getAttribute('data-i18n-html'); if (dict[k] != null) el.innerHTML = dict[k];
      });
    }
    // 정책 모달이 열려 있으면 현재 로케일로 다시 렌더
    if (openPolicyKey) renderPolicy();
    if (typeof window.onLocaleChange === 'function') window.onLocaleChange(loc);
  };

  // 화면 흐름 미리보기 (좌하단) — 비회원/회원 케이스별 동선을 단계로 표시·이동
  function buildFlowNav() {
    var file = (location.pathname.split('/').pop() || 'index.html') || 'index.html';
    var GUEST = [['index.html', 'fs_home'], ['tests.html', 'fs_tests'], ['test-detail.html', 'fs_detail'], ['auth.html', 'fs_auth']];
    var MEMBER = [['mypage.html', 'fs_my'], ['mypage-tests.html', 'fs_mytests'], ['exam-gate.html', 'fs_gate'], ['exam.html', 'fs_exam'], ['exam-result.html', 'fs_result'], ['mypage-certificates.html', 'fs_cert']];
    function steps(arr) {
      return '<ol class="flow-steps">' + arr.map(function (s, i) {
        var cur = (s[0] === file) ? ' current' : '';
        return '<li><a class="flow-step' + cur + '" href="' + s[0] + '"><span class="n">' + (i + 1) + '</span>' +
          '<span data-c="' + s[1] + '">' + c(s[1]) + '</span></a></li>';
      }).join('') + '</ol>';
    }
    var nav = document.createElement('div');
    nav.className = 'flow-nav';
    nav.innerHTML =
      '<button class="flow-toggle" aria-label="화면 흐름">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>' +
      '<span data-c="flow_open">' + c('flow_open') + '</span></button>' +
      '<div class="flow-pop">' +
      '  <div class="flow-pop-title" data-c="flow_title">' + c('flow_title') + '</div>' +
      '  <div class="flow-seg">' +
      '    <button class="flow-mode-btn" data-mode="guest" data-c="flow_guest">' + c('flow_guest') + '</button>' +
      '    <button class="flow-mode-btn" data-mode="member" data-c="flow_member">' + c('flow_member') + '</button>' +
      '  </div>' +
      '  <div class="flow-case guest">' + steps(GUEST) + '</div>' +
      '  <div class="flow-case member">' + steps(MEMBER) + '</div>' +
      '  <a class="flow-index" href="../index.html" data-c="flow_index">' + c('flow_index') + '</a>' +
      '</div>';
    nav.querySelector('.flow-toggle').addEventListener('click', function (e) { e.stopPropagation(); nav.classList.toggle('open'); });
    nav.querySelectorAll('.flow-mode-btn').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var m = b.getAttribute('data-mode');
        setMode(m); applyAuthMode(m);
      });
    });
    document.addEventListener('click', function (e) { if (!nav.contains(e.target)) nav.classList.remove('open'); });
    return nav;
  }

  // 스크롤 다운 → 헤더 페이드아웃(숨김) / 스크롤 업 → 페이드인(표시)
  function initHeaderHide(gnb) {
    if (!gnb) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var lastY = window.pageYOffset || 0, THRESHOLD = 90, DELTA = 6;
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      if (Math.abs(y - lastY) < DELTA) return;                             // 미세 흔들림 무시
      if (!gnb.classList.contains('mobile-open')) {
        if (y > lastY && y > THRESHOLD) gnb.classList.add('gnb--hidden');  // 아래로 → 숨김
        else if (y < lastY) gnb.classList.remove('gnb--hidden');          // 위로 → 표시
      }
      lastY = y;
    }, { passive: true });
  }

  function init() {
    var activeKey = document.body.getAttribute('data-page') || '';
    var noChrome = document.body.getAttribute('data-chrome') === 'off';
    if (!noChrome) {
      // 페이지 콘텐츠를 성장 영역으로 감싼다 → 콘텐츠가 짧아도 푸터가 화면 맨 아래에 붙음(sticky footer)
      document.body.classList.add('has-shell');
      var main = document.createElement('main');
      main.className = 'shell-main';
      while (document.body.firstChild) { main.appendChild(document.body.firstChild); }
      document.body.appendChild(main);

      var gnbEl = buildGnb(activeKey);
      document.body.insertBefore(gnbEl, document.body.firstChild);
      document.body.insertBefore(buildNotice(), document.body.firstChild);
      document.body.appendChild(buildFooter());
      injectPolicyStyles();
      var pm = buildPolicyModal(); pm.id = 'policy-modal';
      document.body.appendChild(pm);
      document.body.appendChild(buildFlowNav());
      applyAuthMode(getMode());
      guardMemberLinks();
      initHeaderHide(gnbEl);
    }
    // 최초 로케일 적용
    window.setLocale(locale);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
