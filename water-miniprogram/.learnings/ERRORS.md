## 2026-03-20 PowerShell heredoc mismatch
- Priority: low
- Context: Tried using bash-style `node - <<'NODE'` inside PowerShell.
- Symptom: PowerShell parsed the redirection operator and the command failed before Node ran.
- Fix: Use a PowerShell here-string piped into `node -` instead.
- Example: `@'...js...'@ | node -`
## 2026-03-20 WeChat DevTools includes helper issue
- Priority: medium
- Context: `pages/order/list/list` failed in WeChat DevTools with `@babel/runtime/helpers/Arrayincludes.js` missing.
- Symptom: Page script failed to initialize, causing follow-up event errors like `onSearchInput` not found.
- Root cause: DevTools transpilation introduced a missing helper for `.includes()` in this environment.
- Fix: Replace runtime `.includes()` usage with `indexOf(...) > -1` in mini-program page/runtime code.
- Affected files: `pages/order/list/list.js`, `pages/confirm/confirm.js`, `utils/constants.js`, `utils/products.js`
## 2026-03-21 rg.exe access denied in this desktop environment
- Priority: low
- Context: Tried using `rg -n` from PowerShell to fetch exact line numbers for updated manual docs.
- Symptom: `rg.exe` failed immediately with `Access is denied`.
- Root cause: In this environment, `rg.exe` is present but not executable from the current PowerShell session.
- Fix: Fall back to `Select-String` for line-number lookups when `rg` is blocked.
- Affected workflow: file search and line reference collection during documentation tasks.
## 2026-03-21 skills install intermittently fails on GitHub clone
- Priority: medium
- Context: Tried installing writing-related skills with `npx skills add ... -g -y`.
- Symptom: some installs succeeded, while others failed during repository clone with `Connection was reset`, `curl 28`, or `Could not connect to server`.
- Root cause: intermittent network/connectivity issues reaching GitHub from this environment, not a bad package name.
- Fix: keep successful installs; retry failed skills later when network is stable, preferably one-by-one instead of in parallel.
- Affected commands: `npx skills add obra/superpowers@writing-plans -g -y`, `npx skills add supercent-io/skills-template@user-guide-writing -g -y`, `npx skills add github/awesome-copilot@documentation-writer -g -y`.
## 2026-03-21 sub-agent batch failed with 502 Bad Gateway
- Priority: high
- Context: Tried launching five parallel sub-agents to draft and review `builder-manual` book sections during the full-book rewrite sprint.
- Symptom: every spawned agent errored with `502 Bad Gateway` from `https://aixj.vip/responses` before returning any output.
- Root cause: external sub-agent response service outage / upstream gateway failure, not a bad task prompt.
- Fix: do not block on agent retries during book sprints; switch to single-agent internal role simulation, keep final-file write ownership local, and record the outage in the worklog.
- Affected workflow: multi-agent drafting and review for `builder-manual`.
