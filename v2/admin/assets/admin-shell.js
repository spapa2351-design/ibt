/* ═══════════════════════════════════════════════════════════
   MaroPass Admin — 공유 셸 (사이드바 + 상단바 주입)
   페이지는 <body data-page="키" data-title="제목"> + <div class="page">본문</div> 만 두면
   이 스크립트가 좌측 사이드바와 상단바를 감싸 렌더링한다.
   네비게이션은 여기 NAV 한 곳에서만 관리 → 전 페이지 일관.
   ═══════════════════════════════════════════════════════════ */
(function () {
  var ICON = {
    dash: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
    service: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    exam: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
    build: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
    product: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>',
    ops: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="9.17" y1="14.83" x2="4.93" y2="19.07"/></svg>',
    system: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>'
  };

  // 확정된 3그룹 통합 네비 (서비스 관리 / 시험 관리 / 문제 빌더)
  var NAV = [
    {
      title: '대시보드', icon: ICON.dash, items: [
        { key: 'dashboard', label: '대시보드', href: 'dashboard.html' }
      ]
    },
    {
      title: '회원', icon: ICON.service, items: [
        { key: 'members', label: '회원', href: 'members.html' },
        { key: 'admin-list', label: '관리자 관리', href: 'admin-list.html' }
      ]
    },
    {
      title: '시험 관리', icon: ICON.exam, items: [
        { key: 'tests-list', label: '시험 목록', href: 'tests-list.html' },
        { key: 'test-create', label: '시험 등록', href: 'test-create.html' }
      ]
    },
    {
      title: '상품 관리', icon: ICON.product, items: [
        { key: 'products', label: '상품 목록', href: 'products.html' },
        { key: 'product-create', label: '상품 등록', href: 'product-create.html' }
      ]
    },
    {
      title: '문제 빌더', icon: ICON.build, items: [
        { key: 'question-bank', label: '문제 은행', href: 'question-bank.html' },
        { key: 'question-create', label: '문제 만들기', href: 'question-create.html', star: true }
      ]
    },
    {
      title: '서비스', icon: ICON.ops, items: [
        { key: 'payments', label: '결제·매출', href: 'payments.html' },
        { key: 'inquiries', label: '문의', href: 'inquiries.html', count: 5 },
        { key: 'refunds', label: '환불', href: 'refunds.html', count: 3 },
        { key: 'notices', label: '공지사항', href: 'notices.html' }
      ]
    },
    {
      title: '시스템', icon: ICON.system, items: [
        { key: 'activity-log', label: '활동 로그', href: 'activity-log.html' }
      ]
    }
  ];

  function findNav(key) {
    for (var g = 0; g < NAV.length; g++) {
      for (var i = 0; i < NAV[g].items.length; i++) {
        if (NAV[g].items[i].key === key) return { group: NAV[g], item: NAV[g].items[i] };
      }
    }
    return null;
  }

  function buildSidebar(activeKey) {
    var html = ''
      + '<a class="sb-brand" href="dashboard.html" style="text-decoration:none">'
      + '  <div><div class="name">MaroPass</div><div class="sub">ADMIN</div></div>'
      + '</a>'
      + '<nav class="sb-nav">';
    for (var g = 0; g < NAV.length; g++) {
      var grp = NAV[g];
      html += '<div class="sb-group"><div class="sb-group-title">' + grp.icon + '<span>' + grp.title + '</span></div>';
      for (var i = 0; i < grp.items.length; i++) {
        var it = grp.items[i];
        var extra = it.count ? ' <span class="count">' + it.count + '</span>' : (it.star ? ' <span class="star">★</span>' : '');
        html += '<a class="sb-item' + (it.key === activeKey ? ' active' : '') + '" href="' + it.href + '">' + it.label + extra + '</a>';
      }
      html += '</div>';
    }
    html += '</nav>';
    html += '<div class="sb-foot"><a href="login.html" style="color:var(--grey-500);text-decoration:none">로그아웃 →</a><div style="margin-top:6px">통합 관리자 · v0.1</div></div>';

    var aside = document.createElement('aside');
    aside.className = 'sidebar';
    aside.innerHTML = html;
    return aside;
  }

  function buildTopbar(activeKey, title) {
    var nav = findNav(activeKey);
    var groupName = nav ? nav.group.title : '';
    var crumb = (groupName ? '<span>' + groupName + '</span><span>›</span>' : '') + '<strong>' + (title || (nav ? nav.item.label : '')) + '</strong>';
    var bar = document.createElement('header');
    bar.className = 'topbar';
    bar.innerHTML = ''
      + '<div class="topbar-crumb">' + crumb + '</div>'
      + '<div class="topbar-spacer"></div>'
      + '<a class="btn btn-secondary" href="login.html" style="padding:7px 14px;font-size:13px">'
      + '  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'
      + '  로그아웃'
      + '</a>';
    return bar;
  }

  // 세그먼트 탭(.seg) 클릭 → 같은 그룹 내 active 전환 (전 페이지 공통)
  function bindSegTabs() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.seg button') : null;
      if (!btn) return;
      var seg = btn.parentElement;
      var siblings = seg.querySelectorAll('button');
      for (var i = 0; i < siblings.length; i++) siblings[i].classList.remove('active');
      btn.classList.add('active');
    });
  }

  function init() {
    var activeKey = document.body.getAttribute('data-page') || '';
    var title = document.body.getAttribute('data-title') || '';
    var pageEl = document.querySelector('body > .page');

    var aside = buildSidebar(activeKey);
    var main = document.createElement('div');
    main.className = 'main';
    main.appendChild(buildTopbar(activeKey, title));
    if (pageEl) main.appendChild(pageEl); // 본문을 main 안으로 이동

    document.body.insertBefore(main, document.body.firstChild);
    document.body.insertBefore(aside, document.body.firstChild);
    if (title) document.title = 'MaroPass Admin — ' + title;

    bindSegTabs();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ────────────────────────────────────────────────────────────
   전역 피드백 — 토스트 + 확인 모달 (전 페이지 공통)
   window.toast(메시지, 'success'|'error'|'info')
   window.confirmAction({ title, desc, confirmText, danger, onConfirm })
──────────────────────────────────────────────────────────── */
(function () {
  var css = ''
    + '.mp-toast-wrap{position:fixed;left:0;right:0;bottom:28px;z-index:9999;display:flex;flex-direction:column;align-items:center;gap:10px;pointer-events:none;padding:0 16px}'
    + '.mp-toast{pointer-events:auto;min-width:240px;max-width:360px;display:flex;align-items:center;gap:10px;background:#191f28;color:#fff;border-radius:12px;padding:13px 16px;font-size:13.5px;font-weight:600;box-shadow:0 8px 30px rgba(15,23,42,.28);transform:translateY(12px);opacity:0;transition:transform .22s,opacity .22s;font-family:inherit}'
    + '.mp-toast.show{transform:translateY(0);opacity:1}'
    + '.mp-toast .ic{width:20px;height:20px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:50%}'
    + '.mp-toast.success .ic{background:#03b26c}.mp-toast.error .ic{background:#f04452}.mp-toast.info .ic{background:#2e84ff}'
    + '.mp-toast .ic svg{width:12px;height:12px;color:#fff}'
    + '.mp-cf-overlay{position:fixed;inset:0;background:rgba(15,23,42,.5);display:none;align-items:center;justify-content:center;z-index:9998;padding:24px}'
    + '.mp-cf-overlay.open{display:flex}'
    + '.mp-cf{background:#fff;border-radius:18px;width:100%;max-width:420px;padding:28px 26px 22px;box-shadow:0 24px 70px rgba(15,23,42,.3);text-align:center;font-family:inherit}'
    + '.mp-cf-ic{width:56px;height:56px;border-radius:50%;background:#e8f3ff;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}'
    + '.mp-cf-ic svg{width:28px;height:28px;color:#2e84ff}'
    + '.mp-cf.danger .mp-cf-ic{background:#fef2f2}.mp-cf.danger .mp-cf-ic svg{color:#f04452}'
    + '.mp-cf-title{font-size:18px;font-weight:800;color:#191f28;margin:0 0 8px}'
    + '.mp-cf-desc{font-size:13.5px;color:#6b7684;line-height:1.6;margin:0 0 20px}'
    + '.mp-cf-actions{display:flex;gap:10px;justify-content:center}'
    + '.mp-cf-actions button{min-width:104px;padding:12px 18px;border-radius:10px;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;border:none}'
    + '.mp-cf-cancel{background:#fff;color:#191f28;border:1px solid #e5e8eb!important}'
    + '.mp-cf-cancel:hover{border-color:#d1d6db!important}'
    + '.mp-cf-ok{background:#2e84ff;color:#fff}.mp-cf-ok:hover{background:#2272eb}'
    + '.mp-cf.danger .mp-cf-ok{background:#f04452}.mp-cf.danger .mp-cf-ok:hover{background:#d63a46}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var wrap = document.createElement('div'); wrap.className = 'mp-toast-wrap'; document.body.appendChild(wrap);
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  var BANG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
  var INFO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="7" x2="12.01" y2="7"/></svg>';

  window.toast = function (msg, type) {
    type = type || 'success';
    var ic = type === 'error' ? BANG : (type === 'info' ? INFO : CHECK);
    var el = document.createElement('div');
    el.className = 'mp-toast ' + type;
    el.innerHTML = '<span class="ic">' + ic + '</span><span>' + msg + '</span>';
    wrap.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('show'); });
    setTimeout(function () {
      el.classList.remove('show');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 240);
    }, 2600);
  };

  var ov = document.createElement('div');
  ov.className = 'mp-cf-overlay';
  ov.innerHTML = '<div class="mp-cf"><div class="mp-cf-ic"></div><h3 class="mp-cf-title"></h3><p class="mp-cf-desc"></p><div class="mp-cf-actions"><button class="mp-cf-cancel">취소</button><button class="mp-cf-ok">확인</button></div></div>';
  document.body.appendChild(ov);
  var cf = ov.querySelector('.mp-cf'), cfIc = ov.querySelector('.mp-cf-ic'), cfTitle = ov.querySelector('.mp-cf-title'),
      cfDesc = ov.querySelector('.mp-cf-desc'), cfCancel = ov.querySelector('.mp-cf-cancel'), cfOk = ov.querySelector('.mp-cf-ok');
  var pending = null;
  function closeCf() { ov.classList.remove('open'); pending = null; }
  cfCancel.addEventListener('click', closeCf);
  ov.addEventListener('click', function (e) { if (e.target === ov) closeCf(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('open')) closeCf(); });
  cfOk.addEventListener('click', function () { var fn = pending; closeCf(); if (fn) fn(); });

  window.confirmAction = function (opts) {
    opts = opts || {};
    cf.classList.toggle('danger', !!opts.danger);
    cfIc.innerHTML = opts.danger ? BANG : (opts.icon || CHECK);
    cfTitle.textContent = opts.title || '진행하시겠습니까?';
    cfDesc.textContent = opts.desc || '';
    cfDesc.style.display = opts.desc ? 'block' : 'none';
    cfOk.textContent = opts.confirmText || '확인';
    pending = opts.onConfirm || null;
    ov.classList.add('open');
  };
})();
