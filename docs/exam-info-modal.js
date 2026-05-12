/*
 * KoPASS — 시험 안내 모달 (응시 직전 게이트)
 *
 * 사용법:
 *   <button data-exam-start
 *           data-exam-name="TOPIK 말하기 초급"
 *           data-exam-mode="IBT 진단평가(말하기)"
 *           data-exam-period="2026/05/12 ~ 2026/05/24"
 *           data-exam-time="25"
 *           data-exam-questions="23"
 *           data-exam-d-day="D-12"
 *           data-next="ui-exam.html">응시하기</button>
 *   <script src="env-check-modal.js"></script>
 *   <script src="exam-info-modal.js"></script>
 *
 * 동작:
 *   1. 클릭 시 30일 이내 환경 점검 통과 이력 확인
 *   2. 이력 있으면 → 시험 안내 모달 표시
 *   3. 이력 없거나 만료 → 환경 점검 모달 (응시 모드, 약관 스킵) → 통과 후 시험 안내 모달
 *   4. "응시하기" 누르면 data-next 로 이동 (시험 시작)
 *   5. 하단 "환경을 다시 점검하기" 링크로 사용자가 직접 재점검 가능
 */
(function () {
  const css = `
  .ei-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); display: none; align-items: center; justify-content: center; z-index: 1100; padding: 20px; }
  .ei-overlay.open { display: flex; animation: ei-fade 0.2s ease-out; }
  @keyframes ei-fade { from { opacity: 0; } to { opacity: 1; } }
  .ei-modal { background: white; border-radius: 20px; width: min(480px, 100%); max-height: 92vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 24px 80px rgba(0,0,0,0.3); animation: ei-pop 0.25s ease-out; }
  @keyframes ei-pop { from { transform: translateY(20px) scale(0.98); opacity: 0; } to { transform: none; opacity: 1; } }
  @media (max-width: 520px) { .ei-modal { max-height: 100vh; height: 100vh; border-radius: 0; width: 100%; } .ei-overlay { padding: 0; } }

  .ei-header { padding: 18px 22px; display: flex; justify-content: flex-end; align-items: center; flex-shrink: 0; }
  .ei-close { background: #f2f4f6; border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #6b7684; font-size: 18px; }
  .ei-close:hover { background: #e5e8eb; }

  .ei-body { padding: 0 22px 18px; overflow-y: auto; flex: 1; }
  .ei-title { font-size: 22px; font-weight: 800; color: #191f28; margin: 0 0 18px; line-height: 1.3; }

  .ei-card { background: #f2f4f6; border-radius: 14px; padding: 18px 18px 18px 18px; margin-bottom: 12px; }
  .ei-card-title { font-size: 15px; font-weight: 800; color: #191f28; margin: 0 0 12px; }
  .ei-subgroup { margin-bottom: 14px; }
  .ei-subgroup:last-child { margin-bottom: 0; }
  .ei-sub-label { font-size: 12px; color: #8b95a1; margin-bottom: 6px; }
  .ei-bullet { font-size: 13px; color: #191f28; line-height: 1.6; margin: 0; padding-left: 16px; }
  .ei-bullet li { margin-bottom: 4px; }

  .ei-info-row { padding: 10px 0; border-bottom: 1px solid #e5e8eb; }
  .ei-info-row:last-child { border-bottom: none; }
  .ei-info-label { font-size: 12px; color: #8b95a1; margin-bottom: 4px; }
  .ei-info-value { font-size: 15px; font-weight: 700; color: #191f28; }
  .ei-info-value .ei-d-day { display: inline-block; margin-left: 8px; padding: 2px 8px; background: #fe9800; color: white; border-radius: 4px; font-size: 11px; vertical-align: middle; }

  .ei-footer { padding: 16px 22px 20px; flex-shrink: 0; }
  .ei-cta { width: 100%; padding: 14px; background: #2e84ff; color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 16px rgba(46,132,255,0.2); transition: all 0.15s; }
  .ei-cta:hover { background: #2272eb; transform: translateY(-1px); }
  .ei-cta-hint { text-align: center; font-size: 12px; color: #8b95a1; margin-top: 10px; }
  .ei-recheck { display: block; text-align: center; margin-top: 12px; font-size: 12px; color: #6b7684; text-decoration: underline; cursor: pointer; background: none; border: none; width: 100%; }
  .ei-recheck:hover { color: #2272eb; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const html = `
  <div class="ei-overlay" id="eiOverlay" role="dialog" aria-modal="true">
    <div class="ei-modal">
      <div class="ei-header">
        <button class="ei-close" id="eiClose" aria-label="닫기">×</button>
      </div>
      <div class="ei-body">
        <h2 class="ei-title" id="eiTitle">시험 안내</h2>

        <div class="ei-card">
          <div class="ei-card-title">시험 안내</div>
          <div class="ei-subgroup">
            <div class="ei-sub-label">기본 정보</div>
            <ul class="ei-bullet">
              <li id="eiIntroMode">본 모의고사는 IBT 진단평가 말하기 평가의 IBT(컴퓨터 기반) 방식으로 진행됩니다.</li>
              <li id="eiIntroCount">총 23문항으로 구성되며, 시험 시간은 약 25분입니다.</li>
              <li>모든 답변은 녹음되며, 녹음된 파일은 이후 한국어 교육 전문가에 의해 발음, 유창성, 내용의 정확성 및 논리성을 기준으로 채점됩니다.</li>
            </ul>
          </div>
          <div class="ei-subgroup">
            <div class="ei-sub-label">합격 기준</div>
            <ul class="ei-bullet">
              <li>총점에 따라 1급부터 6급까지의 말하기 등급이 부여됩니다.</li>
            </ul>
          </div>
        </div>

        <div class="ei-card">
          <div class="ei-card-title">시험지 정보</div>
          <div class="ei-info-row">
            <div class="ei-info-label">응시 가능 기간</div>
            <div class="ei-info-value" id="eiPeriod">— <span class="ei-d-day" id="eiDDay" style="display:none;">D-?</span></div>
          </div>
          <div class="ei-info-row">
            <div class="ei-info-label">시험 제한 시간</div>
            <div class="ei-info-value" id="eiTime">25분</div>
          </div>
          <div class="ei-info-row">
            <div class="ei-info-label">문항수</div>
            <div class="ei-info-value" id="eiQuestions">총 23문항</div>
          </div>
        </div>
      </div>

      <div class="ei-footer">
        <button class="ei-cta" id="eiCta">응시하기</button>
        <div class="ei-cta-hint">응시하기 버튼을 클릭하면 바로 시험이 시작됩니다.</div>
        <button class="ei-recheck" id="eiRecheck">환경을 다시 점검하기</button>
      </div>
    </div>
  </div>
  `;
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap.firstElementChild);

  const overlay = document.getElementById('eiOverlay');
  const closeBtn = document.getElementById('eiClose');
  const cta = document.getElementById('eiCta');
  const recheckBtn = document.getElementById('eiRecheck');
  const titleEl = document.getElementById('eiTitle');
  const introMode = document.getElementById('eiIntroMode');
  const introCount = document.getElementById('eiIntroCount');
  const periodEl = document.getElementById('eiPeriod');
  const dDayEl = document.getElementById('eiDDay');
  const timeEl = document.getElementById('eiTime');
  const qEl = document.getElementById('eiQuestions');

  let state = { nextUrl: '', context: '' };

  function showInfo(data) {
    titleEl.textContent = data.name || '시험 안내';
    if (data.mode) introMode.textContent = `본 모의고사는 ${data.mode}의 IBT(컴퓨터 기반) 방식으로 진행됩니다.`;
    if (data.questions || data.time) introCount.textContent = `총 ${data.questions || '?'}문항으로 구성되며, 시험 시간은 약 ${data.time || '?'}분입니다.`;
    if (data.period) {
      periodEl.firstChild.nodeValue = data.period + ' ';
    } else {
      periodEl.firstChild.nodeValue = '— ';
    }
    if (data.dDay) {
      dDayEl.textContent = data.dDay;
      dDayEl.style.display = 'inline-block';
    } else {
      dDayEl.style.display = 'none';
    }
    timeEl.textContent = (data.time || '25') + '분';
    qEl.textContent = '총 ' + (data.questions || '23') + '문항';

    state.nextUrl = data.next || '';
    state.context = data.name || '';
    overlay.classList.add('open');
  }
  function close() { overlay.classList.remove('open'); }
  function startExam() {
    close();
    if (state.nextUrl) location.href = state.nextUrl;
  }

  function readTriggerData(el) {
    return {
      name: el.dataset.examName || '',
      mode: el.dataset.examMode || '',
      period: el.dataset.examPeriod || '',
      time: el.dataset.examTime || '',
      questions: el.dataset.examQuestions || '',
      dDay: el.dataset.examDDay || '',
      next: el.dataset.next || ''
    };
  }

  let pendingData = null;
  function handleStart(el) {
    const data = readTriggerData(el);
    pendingData = data;
    const valid = typeof window.kopassEnvCheckIsValid === 'function' && window.kopassEnvCheckIsValid(30);
    if (valid) {
      showInfo(data);
    } else if (typeof window.kopassOpenEnvCheck === 'function') {
      window.kopassOpenEnvCheck({
        context: data.name + ' — 응시 직전 환경 점검',
        then: 'exam-info',
        skipAgree: true
      });
    } else {
      // 환경 점검 모달 미로드 시 fallback — 그냥 시험 안내만 표시
      showInfo(data);
    }
  }

  window.addEventListener('kopassEnvCheckPassed', () => {
    if (pendingData) showInfo(pendingData);
  });

  document.addEventListener('click', (e) => {
    const trg = e.target.closest('[data-exam-start]');
    if (trg) { e.preventDefault(); handleStart(trg); }
  });
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });
  cta.addEventListener('click', startExam);
  recheckBtn.addEventListener('click', () => {
    close();
    if (typeof window.kopassOpenEnvCheck === 'function') {
      window.kopassOpenEnvCheck({
        context: (state.context || '응시 직전') + ' — 환경 다시 점검',
        then: 'exam-info',
        skipAgree: true
      });
    }
  });
})();
