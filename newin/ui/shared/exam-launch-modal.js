/*
 * MaroPass — 응시 시작 트랜지션 모달
 *
 * 목적: service-site (MaroPass 마이페이지) 에서 응시하기 → 새 창 전환 직전에
 *       "지금 응시 전용 화면(터치클래스 사용자 web)으로 이동합니다" 신호 + 사용자 의도 확인.
 *       풀 게이트가 아니라 가벼운 트랜지션 모달. 실제 본인 확인·환경 점검은 새 창에서 처리.
 *
 * 사용법:
 *   <button onclick="kopassLaunchExam({
 *     name: 'TOPIK 말하기 초급',
 *     time: '25', questions: '23', dDay: 'D-12',
 *     next: '../user-web/ui-exam-home.html'
 *   })">응시하기</button>
 *   <script src="../shared/exam-launch-modal.js"></script>
 *
 * 동작:
 *   1. 모달 노출 (시험 이름 + 시간/문항/D-day + 이동 안내)
 *   2. CTA "↗ 응시 시작" → ?exam=<name>&autostart=1 붙여서 window.open (사용자 제스처 안)
 *   3. 팝업 차단 감지 시 모달 유지 + 경고 노출
 */
(function () {
  const css = `
  .kl-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.55); backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; z-index: 1100; padding: 20px; }
  .kl-overlay.open { display: flex; animation: kl-fade 0.18s ease-out; }
  @keyframes kl-fade { from { opacity: 0; } to { opacity: 1; } }
  .kl-modal { background: white; border-radius: 20px; width: min(420px, 100%); max-height: 92vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 24px 80px rgba(0,0,0,0.3); animation: kl-pop 0.22s ease-out; }
  @keyframes kl-pop { from { transform: translateY(16px) scale(0.97); opacity: 0; } to { transform: none; opacity: 1; } }
  @media (max-width: 520px) { .kl-modal { max-height: 100vh; height: auto; border-radius: 18px; } .kl-overlay { padding: 16px; } }

  .kl-body { padding: 26px 24px 18px; text-align: center; }
  .kl-icon-wrap { width: 56px; height: 56px; margin: 0 auto 14px; background: linear-gradient(135deg, #e8f3ff, #dbeafe); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
  .kl-title { font-size: 18px; font-weight: 800; color: #191f28; margin: 0 0 6px; line-height: 1.35; }
  .kl-sub { font-size: 13px; color: #6b7684; line-height: 1.55; margin: 0 0 18px; }

  .kl-card { background: #f9fafb; border: 1px solid #eceef1; border-radius: 12px; padding: 14px 16px; text-align: left; margin-bottom: 14px; }
  .kl-card-name { font-size: 15px; font-weight: 700; color: #191f28; margin-bottom: 6px; }
  .kl-card-meta { font-size: 12px; color: #6b7684; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .kl-sep { color: #d1d6db; }
  .kl-dday { display: inline-block; background: #fe9800; color: white; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; }
  .kl-dday.warn { background: #f04452; }

  .kl-hints { background: #eff6ff; border: 1px solid #dbeafe; border-radius: 10px; padding: 10px 12px; font-size: 12px; color: #1e3a5f; line-height: 1.6; text-align: left; margin-bottom: 14px; }
  .kl-hint-row { display: flex; align-items: flex-start; gap: 6px; }
  .kl-hint-row + .kl-hint-row { margin-top: 4px; }
  .kl-hint-icon { flex-shrink: 0; }

  .kl-warn { display: none; background: #fef3c7; border: 1px solid #fde68a; color: #92400e; border-radius: 10px; padding: 10px 12px; font-size: 12px; margin-bottom: 12px; line-height: 1.5; text-align: left; }
  .kl-warn.show { display: block; }

  .kl-actions { display: flex; gap: 8px; padding: 0 24px 22px; }
  .kl-btn { flex: 1; padding: 13px; border-radius: 12px; font-size: 14px; font-weight: 700; cursor: pointer; border: none; font-family: inherit; transition: all 0.15s; }
  .kl-btn.ghost { background: #f2f4f6; color: #4e5968; }
  .kl-btn.ghost:hover { background: #e5e8eb; }
  .kl-btn.primary { background: #2e84ff; color: white; box-shadow: 0 6px 14px rgba(46,132,255,0.22); }
  .kl-btn.primary:hover { background: #2272eb; transform: translateY(-1px); }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const html = `
  <div class="kl-overlay" id="klOverlay" role="dialog" aria-modal="true" aria-labelledby="klTitle">
    <div class="kl-modal">
      <div class="kl-body">
        <div class="kl-icon-wrap" aria-hidden="true">🪟</div>
        <h2 class="kl-title" id="klTitle">응시 전용 화면을 새 창에서 열어요</h2>
        <p class="kl-sub">결과 확인까지 새 창 안에서 진행되며, 본 화면(MaroPass)에서는 영수증·인증서·결과지 PDF를 받을 수 있어요.</p>

        <div class="kl-card">
          <div class="kl-card-name" id="klExamName">—</div>
          <div class="kl-card-meta" id="klExamMeta"></div>
        </div>

        <div class="kl-hints">
          <div class="kl-hint-row"><span class="kl-hint-icon">🎙</span><span>새 창에서 <strong>본인 확인 → 환경 점검</strong> 순으로 자동 진행돼요. 30일 내 같은 기기 이력이 있으면 환경 점검은 생략됩니다.</span></div>
          <div class="kl-hint-row"><span class="kl-hint-icon">🔒</span><span>마이크 권한과 <strong>팝업 차단 허용</strong>이 필요해요.</span></div>
        </div>

        <div class="kl-warn" id="klWarn">
          ⚠ <strong>팝업이 차단되었어요.</strong> 주소창의 차단 아이콘에서 MaroPass 팝업을 허용한 뒤 다시 눌러주세요.
        </div>
      </div>
      <div class="kl-actions">
        <button class="kl-btn ghost" id="klCancel">취소</button>
        <button class="kl-btn primary" id="klStart">↗ 응시 시작</button>
      </div>
    </div>
  </div>
  `;
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap.firstElementChild);

  const overlay = document.getElementById('klOverlay');
  const nameEl = document.getElementById('klExamName');
  const metaEl = document.getElementById('klExamMeta');
  const warnEl = document.getElementById('klWarn');
  const startBtn = document.getElementById('klStart');
  const cancelBtn = document.getElementById('klCancel');

  let pending = null;

  function open(data) {
    pending = data || {};
    nameEl.textContent = pending.name || '시험';
    const parts = [];
    if (pending.time) parts.push(pending.time + '분');
    if (pending.questions) parts.push(pending.questions + '문항');
    metaEl.innerHTML = '';
    parts.forEach((p, i) => {
      if (i > 0) metaEl.appendChild(Object.assign(document.createElement('span'), { className: 'kl-sep', textContent: '·' }));
      metaEl.appendChild(Object.assign(document.createElement('span'), { textContent: p }));
    });
    if (pending.dDay) {
      if (parts.length > 0) metaEl.appendChild(Object.assign(document.createElement('span'), { className: 'kl-sep', textContent: '·' }));
      const isWarn = /D-[1-3]$/.test(pending.dDay);
      metaEl.appendChild(Object.assign(document.createElement('span'), { className: 'kl-dday' + (isWarn ? ' warn' : ''), textContent: pending.dDay }));
    }
    warnEl.classList.remove('show');
    overlay.classList.add('open');
  }
  function close() { overlay.classList.remove('open'); pending = null; }

  function launch() {
    if (!pending) return close();
    const base = pending.next || '../user-web/ui-exam-home.html';
    const url = base + (base.includes('?') ? '&' : '?') + 'exam=' + encodeURIComponent(pending.name || '') + '&autostart=1';
    const win = window.open(url, 'maropass_exam', 'noopener=no,noreferrer=no');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      warnEl.classList.add('show');
      return;
    }
    try { win.focus(); } catch (e) {}
    close();
  }

  startBtn.addEventListener('click', launch);
  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });

  // 외부 공개 API
  window.kopassLaunchExam = open;
})();
