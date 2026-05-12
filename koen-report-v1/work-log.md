
---

## 2026-05-12 19:39:41  `session: 04ca3be1-06ea-4860-8e92-47bad13879f0`

설정 완료. 정리하면:

**작성된 것**
- 스크립트: `C:\Users\happy\.claude\hooks\work-log.ps1` — stdin JSON 파싱 → transcript JSONL 읽어 마지막 assistant turn의 text 블록만 추출 → `<cwd>\work-log.md`에 `--- ## 타임스탬프 \`session: <id>\`` 헤더와 함께 append
- 전역 설정: `~/.claude/settings.json`에 `hooks.Stop` 등록 (shell=powershell, timeout=30s)

**검증**
- 더미 transcript로 pipe-test 통과 ✓
- JSON schema 파싱 정상 ✓

**작동 방식**
- Claude 응답이 끝날 때마다 (Stop 이벤트) → 현재 작업 디렉토리에 `work-log.md`가 자동 생성/추가됨
- 도구 호출 결과나 thinking은 빼고 사용자에게 보이는 텍스트 응답만 저장
- transcript 파일이 없거나 빈 응답이면 조용히 스킵 (오류 없음)

**중요 — 활성화하려면**
현재 세션은 시작 시점 settings를 캐싱했으므로, 새로 추가한 hook이 이 세션에서는 동작 안 함. **`/hooks` 한 번 열거나 Claude Code 재시작**하면 활성화됩니다. 그 다음 응답부터 `J:\claude\work-log.md` (또는 cwd가 어디든 그 위치)가 자동 생성됩니다.

수정 원하면: `/hooks` UI에서 끄거나, `~/.claude/settings.json`의 `hooks.Stop` 블록 삭제, 또는 `~/.claude/hooks/work-log.ps1` 직접 편집.

```powershell
[console]::beep(1000,200); Start-Sleep -Milliseconds 100; [console]::beep(1000,200)
```

---

## 2026-05-12 19:40:20  `session: 04ca3be1-06ea-4860-8e92-47bad13879f0`

네, 맞아요.

저장 위치는 **현재 작업 디렉토리(cwd) 안의 `work-log.md`** 입니다. 즉:

- `J:\claude\kopass`에서 작업하면 → `J:\claude\kopass\work-log.md`
- `J:\claude\newcourse`에서 작업하면 → `J:\claude\newcourse\work-log.md`
- 다른 폴더에서 Claude Code 띄우면 → 그 폴더의 `work-log.md`

**핵심**: Claude Code가 실행될 때의 cwd 기준이라, 같은 프로젝트면 같은 파일에 누적되고, 프로젝트별로 자연스럽게 분리됩니다. hook 스크립트가 매번 stdin으로 받는 `cwd` 값을 그대로 사용하기 때문이에요.

확인하려면 활성화 후 아무 응답 하나 받고 그 폴더 루트에 `work-log.md`가 생겼는지 보면 돼요.
