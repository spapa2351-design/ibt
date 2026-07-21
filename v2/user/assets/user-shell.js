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
      '    <li data-c="f_terms">' + c('f_terms') + '</li><li data-c="f_privacy">' + c('f_privacy') + '</li><li data-c="f_commerce">' + c('f_commerce') + '</li></ul></div>' +
      '</div>' +
      '<div class="footer-bottom"><span>© 2026 MaroPass · Newin Japan</span><span data-c="f_company">' + c('f_company') + '</span></div>';
    return f;
  }

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
