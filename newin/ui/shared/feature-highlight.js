/**
 * feature-highlight.js
 *
 * 기능명세서(`docs/feature-spec.html`)의 우측 미리보기 iframe 안에서
 * postMessage로 들어온 selector를 받아 해당 요소를 5초 동안 점멸·툴팁 표시.
 *
 * 사용:
 *   1) ui/ 안 html에 본 파일을 `<script defer src="../shared/feature-highlight.js"></script>` 로딩.
 *   2) 명세서에서 하이라이트 대상인 요소에 `data-feature-id="A6-21"` 등 박기.
 *   3) FEATURE_SELECTORS 매핑은 `docs/feature-spec.html` 안에 추가.
 *
 * 매칭 안 되거나 단독 열림(parent 없음)이면 조용히 무시.
 *
 * 보안: 본 스크립트는 type === 'feature-highlight' 메시지만 처리하며,
 * 출처는 검사하지 않음(로컬 데모용). 운영 배포 시 origin 화이트리스트 추가.
 */
(function () {
  if (window.__featureHighlightLoaded) return;
  window.__featureHighlightLoaded = true;

  let currentTooltip = null;
  let currentEl = null;
  let removeTimer = null;

  function clearHighlight() {
    if (removeTimer) { clearTimeout(removeTimer); removeTimer = null; }
    if (currentEl) {
      currentEl.style.outline = '';
      currentEl.style.outlineOffset = '';
      currentEl.style.boxShadow = '';
      currentEl = null;
    }
    if (currentTooltip) {
      currentTooltip.remove();
      currentTooltip = null;
    }
  }

  function highlight(selector, featureId, featureName) {
    clearHighlight();
    if (!selector) return;

    const el = document.querySelector(selector);
    if (!el) return; // 매칭 실패 — 조용히 무시

    el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    el.style.outline = '2px solid #5569FF';
    el.style.outlineOffset = '3px';
    el.style.boxShadow = '0 0 0 6px rgba(85,105,255,.15), 0 8px 24px rgba(85,105,255,.25)';
    currentEl = el;

    const rect = el.getBoundingClientRect();
    const tooltip = document.createElement('div');
    tooltip.setAttribute('role', 'status');
    tooltip.style.cssText = [
      'position:fixed',
      'z-index:2147483647',
      'background:#0b1220',
      'color:#fff',
      'font:600 12px/1.5 "Pretendard Variable",Pretendard,system-ui,sans-serif',
      'padding:8px 12px',
      'border-radius:8px',
      'box-shadow:0 6px 18px rgba(11,18,32,.25)',
      'pointer-events:auto',
      'cursor:pointer',
      'max-width:280px',
    ].join(';');
    tooltip.innerHTML =
      '<span style="display:inline-block;background:#5569FF;color:#fff;font-size:10px;font-weight:900;padding:2px 6px;border-radius:999px;margin-right:6px">📍 ' +
      (featureId || '') +
      '</span>' +
      (featureName || '');

    const top = Math.max(8, rect.top - 44);
    const left = Math.min(window.innerWidth - 300, Math.max(8, rect.left));
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
    tooltip.addEventListener('click', clearHighlight);
    document.body.appendChild(tooltip);
    currentTooltip = tooltip;

    removeTimer = setTimeout(clearHighlight, 5000);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') clearHighlight();
  });

  window.addEventListener('message', (e) => {
    const data = e && e.data;
    if (!data || data.type !== 'feature-highlight') return;
    highlight(data.selector, data.featureId, data.featureName);
  });
})();
