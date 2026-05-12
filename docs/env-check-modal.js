/*
 * KoPASS — 환경 점검 모달 컴포넌트
 *
 * 사용법:
 *   <button data-env-check data-next="ui-checkout.html" data-context="TOPIK 말하기 초급 — 결제 전 점검">바로 구매하기</button>
 *   <script src="env-check-modal.js"></script>
 *
 * data-env-check : 트리거 마커
 * data-next      : 3단계 통과 + 약관 동의 후 이동할 URL
 * data-context   : 모달 헤더에 표시할 컨텍스트 (어디서 띄운건지 사용자에게 안내)
 */
(function () {
  // --- Style 주입 ---
  const css = `
  .em-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
  .em-overlay.open { display: flex; animation: em-fade 0.2s ease-out; }
  @keyframes em-fade { from { opacity: 0; } to { opacity: 1; } }
  .em-modal { background: white; border-radius: 20px; width: min(840px, 100%); max-height: 92vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 24px 80px rgba(0,0,0,0.3); animation: em-pop 0.25s ease-out; }
  @keyframes em-pop { from { transform: translateY(20px) scale(0.98); opacity: 0; } to { transform: none; opacity: 1; } }
  @media (max-width: 640px) { .em-modal { max-height: 100vh; height: 100vh; border-radius: 0; width: 100%; } .em-overlay { padding: 0; } }

  .em-header { padding: 20px 28px; border-bottom: 1px solid #e5e8eb; display: flex; align-items: center; gap: 16px; flex-shrink: 0; }
  .em-header-text { flex: 1; }
  .em-header-eyebrow { font-size: 11px; font-weight: 700; color: #2e84ff; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 4px; }
  .em-header-title { font-size: 18px; font-weight: 800; color: #191f28; }
  .em-close { background: #f2f4f6; border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #6b7684; font-size: 18px; }
  .em-close:hover { background: #e5e8eb; }

  .em-substeps { padding: 16px 28px; display: flex; gap: 6px; align-items: center; border-bottom: 1px solid #f2f4f6; flex-shrink: 0; }
  .em-substep { flex: 1; display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-radius: 8px; font-size: 12px; color: #8b95a1; font-weight: 600; }
  .em-substep .em-ico { width: 22px; height: 22px; border-radius: 50%; background: #f2f4f6; color: #8b95a1; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  .em-substep.active { color: #2272eb; background: #e8f3ff; }
  .em-substep.active .em-ico { background: #2e84ff; color: white; }
  .em-substep.done { color: #03b26c; }
  .em-substep.done .em-ico { background: #03b26c; color: white; }
  .em-divider { width: 12px; height: 1px; background: #e5e8eb; flex-shrink: 0; }

  .em-body { padding: 28px; overflow-y: auto; flex: 1; }
  .em-step-tag { font-size: 11px; font-weight: 700; color: #2e84ff; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; }
  .em-step-title { font-size: 20px; font-weight: 800; color: #191f28; margin: 0 0 6px; }
  .em-step-desc { color: #6b7684; font-size: 14px; line-height: 1.6; margin: 0 0 20px; }
  .em-stage { background: #f9fafb; border-radius: 14px; padding: 28px; display: flex; flex-direction: column; align-items: center; gap: 18px; }

  .em-mic { width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(135deg, #e8f3ff 0%, #bfdbfe 100%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 6px rgba(46,132,255,0.12), 0 0 0 12px rgba(46,132,255,0.06); animation: em-pulse 2s ease-in-out infinite; }
  @keyframes em-pulse { 0%,100% { box-shadow: 0 0 0 6px rgba(46,132,255,0.12), 0 0 0 12px rgba(46,132,255,0.06); } 50% { box-shadow: 0 0 0 12px rgba(46,132,255,0.18), 0 0 0 22px rgba(46,132,255,0.08); } }
  .em-mic svg { width: 40px; height: 40px; }
  .em-status { font-size: 13px; color: #2272eb; font-weight: 700; }

  .em-meter { display: flex; gap: 3px; align-items: flex-end; height: 44px; padding: 0 6px; }
  .em-bar { width: 12px; background: #e5e8eb; border-radius: 3px; transition: all 0.15s; }
  .em-bar.on { background: #2e84ff; }
  .em-bar.warn { background: #fe9800; }
  .em-bar.ok { background: #03b26c; }
  .em-value { font-size: 12px; color: #6b7684; }
  .em-value strong { color: #191f28; font-weight: 700; }

  .em-count { font-size: 56px; font-weight: 800; color: #2e84ff; font-variant-numeric: tabular-nums; line-height: 1; }
  .em-count-hint { color: #6b7684; font-size: 12px; }

  .em-deny { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 12px 14px; margin-top: 16px; }
  .em-deny-title { font-weight: 700; color: #f04452; font-size: 13px; margin-bottom: 4px; }
  .em-deny-text { color: #7f1d1d; font-size: 12px; line-height: 1.6; }

  .em-tip { background: #e8f3ff; border-radius: 10px; padding: 12px 14px; margin-top: 16px; font-size: 12px; color: #2272eb; line-height: 1.6; }

  .em-final { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px 18px; margin-top: 16px; }
  .em-final-row { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #065f46; font-weight: 700; margin-bottom: 8px; }
  .em-check-label { display: flex; gap: 10px; align-items: flex-start; cursor: pointer; font-size: 12px; color: #065f46; line-height: 1.6; }
  .em-check-label input { margin-top: 3px; flex-shrink: 0; }

  .em-footer { padding: 16px 28px; border-top: 1px solid #e5e8eb; display: flex; justify-content: space-between; gap: 10px; flex-shrink: 0; background: #f9fafb; }
  .em-btn { padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; border: none; transition: all 0.15s; }
  .em-btn-primary { background: #2e84ff; color: white; }
  .em-btn-primary:hover { background: #2272eb; }
  .em-btn-primary:disabled { background: #e5e8eb; color: #8b95a1; cursor: not-allowed; }
  .em-btn-ghost { background: white; color: #4e5968; border: 1px solid #e5e8eb; }
  .em-btn-ghost:hover { background: #f9fafb; }
  .em-step-hidden { display: none; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // --- Modal HTML 주입 ---
  const html = `
  <div class="em-overlay" id="emOverlay" role="dialog" aria-modal="true" aria-labelledby="emTitle">
    <div class="em-modal">
      <div class="em-header">
        <div class="em-header-text">
          <div class="em-header-eyebrow" id="emEyebrow">응시 환경 점검</div>
          <div class="em-header-title" id="emTitle">마이크 · 볼륨 · 리플레이</div>
        </div>
        <button class="em-close" id="emClose" aria-label="닫기">×</button>
      </div>

      <div class="em-substeps">
        <div class="em-substep active" data-substep="0"><span class="em-ico">1</span><span>마이크</span></div>
        <span class="em-divider"></span>
        <div class="em-substep" data-substep="1"><span class="em-ico">2</span><span>볼륨</span></div>
        <span class="em-divider"></span>
        <div class="em-substep" data-substep="2"><span class="em-ico">3</span><span>리플레이</span></div>
      </div>

      <div class="em-body">
        <!-- Step 0: 마이크 -->
        <div class="em-step" data-step="0">
          <div class="em-step-tag">단계 1 / 3 · 마이크</div>
          <h2 class="em-step-title">마이크가 잘 인식되는지 확인합니다</h2>
          <p class="em-step-desc"><strong>"안녕하세요"</strong>라고 말해 보세요. 게이지가 함께 움직이면 정상입니다.</p>
          <div class="em-stage">
            <div class="em-mic">
              <svg viewBox="0 0 24 24" fill="none" stroke="#2272eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            </div>
            <div class="em-status">● 녹음 중 — 말소리가 잘 잡힙니다</div>
            <div class="em-meter">
              <div class="em-bar on" style="height: 30%"></div>
              <div class="em-bar on" style="height: 45%"></div>
              <div class="em-bar on" style="height: 60%"></div>
              <div class="em-bar on" style="height: 75%"></div>
              <div class="em-bar on" style="height: 90%"></div>
              <div class="em-bar on" style="height: 70%"></div>
              <div class="em-bar" style="height: 50%"></div>
              <div class="em-bar" style="height: 30%"></div>
            </div>
            <div class="em-value">현재 입력 음량 <strong>-18 dB</strong> · 권장 -24dB ~ -6dB</div>
          </div>
          <div class="em-tip">💡 마이크 권한 요청이 떴다면 <strong>허용</strong>을 눌러 주세요. 헤드셋 마이크를 권장합니다.</div>
        </div>

        <!-- Step 1: 볼륨 -->
        <div class="em-step em-step-hidden" data-step="1">
          <div class="em-step-tag">단계 2 / 3 · 볼륨</div>
          <h2 class="em-step-title">스피커 볼륨을 확인합니다</h2>
          <p class="em-step-desc">샘플 음성을 재생합니다. 들리지 않으면 시스템 볼륨을 높이거나 헤드셋 연결을 확인해 주세요.</p>
          <div class="em-stage">
            <button class="em-btn em-btn-primary" id="emPlaySample" style="padding: 14px 28px;">▶ 샘플 음성 재생</button>
            <div class="em-value">음성이 잘 들렸나요?</div>
            <div style="display: flex; gap: 8px;">
              <button class="em-btn em-btn-ghost" id="emVolNo">아니요</button>
              <button class="em-btn em-btn-primary" id="emVolYes">잘 들립니다</button>
            </div>
          </div>
        </div>

        <!-- Step 2: 리플레이 -->
        <div class="em-step em-step-hidden" data-step="2">
          <div class="em-step-tag">단계 3 / 3 · 5초 리플레이</div>
          <h2 class="em-step-title">5초간 녹음 후 재생해 봅니다</h2>
          <p class="em-step-desc">"안녕하세요, KoPASS 응시 환경 점검입니다"라고 5초간 말한 뒤 재생해서 본인 목소리가 잘 녹음됐는지 확인합니다.</p>
          <div class="em-stage">
            <div class="em-count" id="emReplayCount">5</div>
            <div class="em-count-hint" id="emReplayHint">시작 버튼을 누르고 말하세요</div>
            <button class="em-btn em-btn-primary" id="emReplayStart" style="padding: 12px 24px;">● 녹음 시작</button>
            <div id="emReplayConfirm" style="display: none; flex-direction: column; align-items: center; gap: 10px;">
              <div class="em-value">본인 목소리가 잘 들렸나요?</div>
              <div style="display: flex; gap: 8px;">
                <button class="em-btn em-btn-ghost" id="emReplayNo">다시 녹음</button>
                <button class="em-btn em-btn-primary" id="emReplayYes">잘 들립니다</button>
              </div>
            </div>
          </div>

          <div class="em-final" id="emFinal" style="display: none;">
            <div class="em-final-row">✓ 3단계 모두 통과했습니다</div>
            <label class="em-check-label">
              <input type="checkbox" id="emAgree">
              <span>위 점검을 모두 통과했음을 확인하며, 응시 중 마이크 문제로 인한 환불은 점검 통과 이후 발생한 결함에 한정됨에 동의합니다.</span>
            </label>
          </div>
        </div>
      </div>

      <div class="em-footer">
        <button class="em-btn em-btn-ghost" id="emPrev">← 이전</button>
        <button class="em-btn em-btn-primary" id="emNext">다음 단계 →</button>
      </div>
    </div>
  </div>
  `;
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap.firstElementChild);

  // --- 상태 & 로직 ---
  const overlay = document.getElementById('emOverlay');
  const closeBtn = document.getElementById('emClose');
  const prevBtn = document.getElementById('emPrev');
  const nextBtn = document.getElementById('emNext');
  const eyebrowEl = document.getElementById('emEyebrow');
  const substeps = overlay.querySelectorAll('.em-substep');
  const steps = overlay.querySelectorAll('.em-step');
  const finalEl = document.getElementById('emFinal');
  const agreeChk = document.getElementById('emAgree');
  const replayCount = document.getElementById('emReplayCount');
  const replayHint = document.getElementById('emReplayHint');
  const replayStartBtn = document.getElementById('emReplayStart');
  const replayConfirm = document.getElementById('emReplayConfirm');

  let state = { current: 0, passed: [false, false, false], nextUrl: '', context: '', then: '', skipAgree: false };

  function renderStep() {
    steps.forEach(s => s.classList.toggle('em-step-hidden', Number(s.dataset.step) !== state.current));
    substeps.forEach((el, i) => {
      el.classList.toggle('active', i === state.current);
      el.classList.toggle('done', state.passed[i]);
    });
    prevBtn.style.visibility = state.current === 0 ? 'hidden' : 'visible';

    if (state.current === 2) {
      const allPassed = state.passed.every(Boolean);
      // 응시 직전 게이트(skipAgree)는 약관 박스 숨기고 바로 진행 버튼
      if (state.skipAgree) {
        finalEl.style.display = allPassed ? 'block' : 'none';
        // 약관 박스 안의 체크박스/문구 숨기고 통과 메시지만 노출
        const lbl = finalEl.querySelector('.em-check-label');
        if (lbl) lbl.style.display = 'none';
        nextBtn.textContent = state.then === 'exam-info' ? '시험 안내로 이동 →' : (state.nextUrl ? '진행하기 →' : '완료');
        nextBtn.disabled = !allPassed;
      } else {
        finalEl.style.display = allPassed ? 'block' : 'none';
        const lbl = finalEl.querySelector('.em-check-label');
        if (lbl) lbl.style.display = 'flex';
        nextBtn.textContent = '결제로 진행하기 →';
        nextBtn.disabled = !(allPassed && agreeChk.checked);
      }
    } else {
      nextBtn.textContent = '정상입니다, 다음 →';
      nextBtn.disabled = !state.passed[state.current];
    }
  }

  function finish() {
    // 통과 이력 저장
    try { localStorage.setItem('kopass_env_check_passed_at', String(Date.now())); } catch (e) {}
    const then = state.then;
    const url = state.nextUrl;
    close();
    if (then === 'exam-info') {
      window.dispatchEvent(new CustomEvent('kopassEnvCheckPassed'));
    } else if (url) {
      location.href = url;
    }
  }

  function next() {
    if (state.current === 2) {
      const allPassed = state.passed.every(Boolean);
      if (state.skipAgree) {
        if (allPassed) finish();
      } else {
        if (allPassed && agreeChk.checked) finish();
      }
      return;
    }
    state.current++;
    renderStep();
  }
  function prev() {
    if (state.current > 0) { state.current--; renderStep(); }
  }
  function close() { overlay.classList.remove('open'); }

  // Step 0 (마이크) — 모달 열리면 2초 후 자동 통과 처리 (실제 구현은 Web Audio API)
  function autoPassMic() {
    setTimeout(() => { state.passed[0] = true; renderStep(); }, 1500);
  }

  // Step 1 (볼륨)
  document.getElementById('emVolYes').addEventListener('click', () => { state.passed[1] = true; next(); });
  document.getElementById('emVolNo').addEventListener('click', () => {
    alert('시스템 볼륨을 확인하거나 헤드셋 연결을 점검해 주세요.');
  });
  document.getElementById('emPlaySample').addEventListener('click', (e) => {
    e.target.textContent = '▶ 재생 중...';
    setTimeout(() => { e.target.textContent = '▶ 다시 듣기'; }, 1500);
  });

  // Step 2 (리플레이) — 5초 카운트다운
  replayStartBtn.addEventListener('click', () => {
    let n = 5;
    replayCount.textContent = n;
    replayHint.textContent = '● 녹음 중...';
    replayStartBtn.style.display = 'none';
    const iv = setInterval(() => {
      n--;
      replayCount.textContent = n;
      if (n <= 0) {
        clearInterval(iv);
        replayHint.textContent = '재생 중... 본인 목소리를 확인하세요';
        setTimeout(() => {
          replayHint.textContent = '확인해 주세요';
          replayConfirm.style.display = 'flex';
        }, 1500);
      }
    }, 1000);
  });
  document.getElementById('emReplayYes').addEventListener('click', () => { state.passed[2] = true; next(); });
  document.getElementById('emReplayNo').addEventListener('click', () => {
    replayCount.textContent = '5';
    replayHint.textContent = '시작 버튼을 누르고 말하세요';
    replayStartBtn.style.display = 'inline-block';
    replayConfirm.style.display = 'none';
  });

  agreeChk.addEventListener('change', renderStep);

  // 트리거 바인딩
  function open(triggerEl) {
    state = {
      current: 0,
      passed: [false, false, false],
      nextUrl: triggerEl.dataset.next || '',
      context: triggerEl.dataset.context || '',
      then: triggerEl.dataset.then || '',
      skipAgree: triggerEl.dataset.skipAgree === '1'
    };
    if (state.context) eyebrowEl.textContent = state.context;
    agreeChk.checked = false;
    replayCount.textContent = '5';
    replayHint.textContent = '시작 버튼을 누르고 말하세요';
    replayStartBtn.style.display = 'inline-block';
    replayConfirm.style.display = 'none';
    renderStep();
    overlay.classList.add('open');
    autoPassMic();
  }

  document.addEventListener('click', (e) => {
    const trg = e.target.closest('[data-env-check]');
    if (trg) { e.preventDefault(); open(trg); }
  });

  // 외부 프로그래매틱 호출 (exam-info-modal에서 사용)
  window.kopassOpenEnvCheck = function (opts) {
    opts = opts || {};
    const fake = document.createElement('div');
    fake.dataset.next = opts.next || '';
    fake.dataset.context = opts.context || '';
    fake.dataset.then = opts.then || '';
    fake.dataset.skipAgree = opts.skipAgree ? '1' : '';
    open(fake);
  };
  window.kopassEnvCheckIsValid = function (maxAgeDays) {
    const max = (maxAgeDays || 30) * 24 * 3600 * 1000;
    const at = parseInt(localStorage.getItem('kopass_env_check_passed_at') || '0', 10);
    return at > 0 && (Date.now() - at) < max;
  };
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });
})();
