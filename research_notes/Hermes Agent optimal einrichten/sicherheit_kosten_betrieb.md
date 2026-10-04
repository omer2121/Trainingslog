# Hermes Agent: security hardening, cost control, reliability and maintenance (verified notes)

Prepared 2026-10-04 as input for the German guide "Hermes Agent optimal einrichten".

**Target setup** (per coordinator):
- an always-on Apple-Silicon Mac (for example a Mac mini), not a VPS;
- Telegram as the only messenger;
- a model budget of about 60–200 € per month;
- use cases: personal assistant (calendar and email), research, programming on a GitHub repo, and automations.

---

## 0. Method, legend, version markers

**Primary source**
- A shallow clone of `NousResearch/hermes-agent` `main` at commit `1298c8e` (2026-10-03 19:11 -0700, "plugin-catalog: bump thomas to v0.1.2").
- Docs live under `website/docs/`; the code is in `tools/`, `agent/`, `gateway/`, `hermes_cli/`, `cron/`, `docker/` and `scripts/`.

**Stable release**
- The latest stable is v0.21.5 (tag v2026.9.24, 2026-09-24), per the coordinator. `main` may contain unreleased changes.
- I could not diff `main` against v0.21.5. The clone is shallow and has no history.
- I also could not query GitHub issues or advisories. The GitHub MCP denied access to `NousResearch/hermes-agent` in this session; only the user's own repo is allowed. Every issue number and CVE below therefore comes from the earlier notes, unless a code or docs reference is given.

**Legend**

| Tag | Meaning |
|---|---|
| `[DOC]` | Stated in the repo docs |
| `[CODE]` | Verified in source at commit 1298c8e |
| `[NOTES]` | From the earlier research notes, which rest on search snippets; not verifiable here |
| `[GENERAL]` | General best practice, not from the Hermes docs |
| `[INFERENCE]` | My own analysis |

**Citation format**
- Every repo path `P` resolves to `https://github.com/NousResearch/hermes-agent/blob/main/P`. The full URL is given in each section's source list.
- `Lx–y` line numbers refer to commit 1298c8e and may drift on `main`.

**Version and date markers found in the repo**

| Marker | What it refers to | Source |
|---|---|---|
| "June 2026 hardening" / "June 2026 hermes-0day campaign" | `--insecure` became a no-op; the dashboard auth gate is now mandatory on non-loopback binds | `website/docs/user-guide/docker.md` L172–176; `hermes_cli/web_server.py` L1168–1176 |
| "Breaking change (July 2026)" | API-server keys are bound per profile on `/p/<profile>/` | `website/docs/user-guide/features/api-server.md` L701–705 |
| "since v2026.9.14" | `state.db` is created in DELETE journal mode on virtiofs/9p mounts | `website/docs/user-guide/docker.md` L218 |
| "Images built before late August 2026" | The `/opt/hermes` 0700 permission bug | `docker.md` L903–911 |
| "April 2026" | Iteration-budget pressure warnings were removed | `website/docs/user-guide/configuration.md` L1220 |
| "v0.5.1" | Skill-declared env vars are auto-forwarded into Docker and Modal | `website/docs/user-guide/security.md` L623–625 |
| iron-proxy v0.39 | Version pinned for the egress proxy | `website/docs/user-guide/egress/iron-proxy.md` |
| Python 3.14 only | Runtime requirement | `website/docs/getting-started/updating.md` L406ff |

- **Tag scheme** `[CODE]`: `hermes_cli/update_channel.py` (constant `STABLE_TAG_RE` and its comment) treats only SemVer tags `vX.Y.Z` as stable. The comment calls CalVer tags such as `v2026.7.20` "historical". Release naming therefore appears to be moving from CalVer to SemVer tags.

---

## 1. Bottom line for this user (synthesis `[INFERENCE]` built on the verified facts below)

1. **The only real boundary is the operating system** ([§2](#2-trust-model-securitymd)). For an always-on Mac this means three things:
   - Run Hermes under a dedicated **Standard (non-admin) macOS user** `[GENERAL]`.
   - Route agent shell and file work into a container (`terminal.backend: docker`) `[DOC]`.
   - Grant no broad macOS privacy permissions ([§11](#11-macos-baseline-hardening-mostly-general-not-from-hermes-docs)).

   Approvals, deny rules, scanners and redaction are *accident prevention*, not containment. `SECURITY.md` §2.2 and §2.4 say so explicitly.
2. **Safest practical backend and approval combination** ([§4](#4-isolation-on-macos-container-backend-egress-checkpoints)). Use `terminal.backend: docker` (Docker Desktop or OrbStack) and the settings below:
   - `docker_forward_env` empty, except a repo-scoped `GITHUB_TOKEN` if the agent must push.
   - `approvals.mode: manual` during the first weeks, then optionally `smart` with a cheap `auxiliary.approval` model.
   - `cron_mode`, `single_query_mode` and `unattended_mode` all left at `deny`.
   - `approvals.deny` rules for force-push and pipe-to-shell.
   - A `pre_tool_call` shell hook that escalates "send email", "git push" and "merge" to the human gate ([§2.9](#29-closing-the-gap-human-approval-for-outbound-actions-via-hooks-doc-protocol-example-is-mine)).

   **Caveats** `[CODE]`:
   - A Docker sandbox *without host bind mounts* skips all approval checks **and the hardline blocklist**. Only `approvals.deny` and hooks still apply.
   - Mounting a host project directory (`docker_volumes` or `docker_mount_cwd_to_workspace`) re-enables approvals.
   - Checkpoints and `/rollback` do not work on container backends. Use git branches or worktrees instead.
3. **Telegram** ([§6](#6-access-control-and-exposure-telegram-focus)):
   - Put only your own numeric ID in `TELEGRAM_ALLOWED_USERS`.
   - Use DMs only and keep the bot out of groups. Optionally set `unauthorized_dm_behavior: ignore` explicitly.
   - With an allowlist configured, unknown senders are silently ignored. The owner gets one notice per sender `[CODE]`.
   - `/yolo`, `/approvals off` and `/update` work from Telegram, so the Telegram account itself is a high-value credential.
4. **Nothing needs to listen on the network**:
   - Telegram uses outbound long polling by default.
   - The dashboard (127.0.0.1), the API server (off by default) and webhooks (off) stay off or loopback-only.
   - For remote management use the Desktop app's **SSH** connection type or an SSH tunnel over Tailscale ([§6.7](#67-reaching-dashboard--desktop-backend-remotely-without-public-exposure)).
5. **Costs** ([§8](#8-cost-control-tuned-to-60200--per-month)):
   - Hermes has **no monetary spend cap** `[CODE]`. Set hard limits at the provider and cap every key in any credential pool or fallback chain, because pools and fallbacks rotate *past* a capped key.
   - Then cap the Hermes token multipliers: `agent.max_turns`, background review, delegation fan-out, cron frequency, compression trigger on 1M-context models, and auxiliary models.
   - The built-in cost figures are a **lower-bound estimate**. One code comment says they can be 10–100× under the bill.
6. **Updates** ([§9.4](#94-updates-safe-strategy)):
   - The `install.sh` source install tracks **`main`**, not the stable release `[DOC][CODE]`.
   - For stability use the Desktop app (stable channel) or the Docker image with a version tag or digest. Otherwise update deliberately with `updates.pre_update_backup: full`, `hermes update --check` and `--plan`, and post-update validation.
   - Never update blind from Telegram (`/update`).

---

## 2. Trust model (`SECURITY.md`)

Source: `SECURITY.md` — https://github.com/NousResearch/hermes-agent/blob/main/SECURITY.md `[DOC]`

**Scope of the product (§2)**
- Hermes is a "single-tenant personal agent".
- The layers are "not equally load-bearing".

**The one boundary (§2.2)**
- "**The only security boundary against an adversarial LLM is the operating system.** Nothing inside the agent process constitutes containment — not the approval gate, not output redaction, not any pattern scanner, not any tool allowlist."

**Two supported isolation postures**

| Posture | What it confines | What it does NOT confine | When it is the right choice |
|---|---|---|---|
| **Terminal-backend isolation** (non-default backend: container, remote host, cloud sandbox) | Shell commands. File tools (`read_file`, `write_file`, `patch`) too, "since they are implemented on top of the shell contract". | "Everything the agent does in its own Python process": the code-execution tool ("spawned as a host subprocess"), MCP subprocesses, plugin loading, hook dispatch, skill loading | Destructive shell and unwanted file writes are the concern, and the operator is otherwise trusted |
| **Whole-process wrapping** (Hermes' own Docker image and Compose, or NVIDIA OpenShell) | The whole process tree | — | "The supported posture when the agent ingests content from surfaces the operator does not control — the open web, inbound email, multi-user channels, untrusted MCP servers" |

- **Out of posture:** "Operators running the default local backend with untrusted input surfaces … are operating outside the supported security posture."
- **Relevance here:** this user's assistant reads email and the web.

**Contradiction: where `execute_code` runs** `[CODE]`
- `SECURITY.md` says the code-execution tool is a host subprocess that terminal-backend isolation does not confine.
- But `website/docs/user-guide/features/code-execution.md` L207 says "Remote backends (Docker, SSH, Modal) run a remote session kernel with the same contract".
- `tools/code_kernel_remote.py` implements exactly that: the Python kernel runs *inside* the backend, and tool RPC calls go back to the host.
- Treat `SECURITY.md` as the conservative baseline. The tools the script calls (web, MCP and so on) still run on the host.

**Credential scoping (§2.3)**
- Provider keys and gateway tokens are stripped from shell, MCP, cron-script and code-execution children.
- "This reduces casual exfiltration. It is not containment. Any component running inside the agent process (skills, plugins, hook handlers) can read whatever the agent itself can read, including in-memory credentials."

**Heuristics, not boundaries (§2.4)**
- These are the approval gate ("a denylist over shell strings is structurally incomplete"), output redaction and Skills Guard.
- Skills Guard: "Reviewing a skill means reading its Python code and scripts, not just its SKILL.md … skills execute arbitrary Python at import time."

**Plugins (§2.5)**
- Plugins "run with full agent privileges". Review before install is the boundary.

**External surfaces (§2.6)**
- Every network-exposed adapter needs an allowlist, and adapters must refuse to run without one.
- Session IDs are not authorization.
- "Within the authorized set, all callers are equally trusted".
- Binding a local-only surface (dashboard) to non-loopback is a "break-glass operator decision".

**Out of scope (§3.2)**, meaning no advisories are issued for:
- heuristic bypasses: approval regex, redaction, Skills Guard;
- prompt injection without a chained exploit;
- break-glass settings (`--insecure`, disabled approvals, local backend in production);
- community skills and plugins;
- public exposure without external controls.

**Deployment hardening (§4)**
- Match isolation to how trusted the ingested content is.
- Run as non-root.
- Keep credentials in the operator credential file "with tight permissions, never in the main config, never in version control".
- No public exposure without "VPN, Tailscale, or firewall protection".
- Configure an allowlist for every adapter.
- Review third-party skills and plugins by reading the code.

**Disclosure (§1, §5)**
- Report privately via GitHub Security Advisories or **security@nousresearch.com**. "Does not operate a bug bounty program."
- Coordinated disclosure window: 90 days, or until a fix ships. Reporters are credited in the release notes.

---

## 3. Approvals (the dangerous-command gate)

Sources:
- `website/docs/user-guide/security.md` L24–352 — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md
- `hermes_cli/config_defaults.py` L1660–1712 (approvals block) — https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/config_defaults.py
- `tools/approval.py` L1024–1313 — https://github.com/NousResearch/hermes-agent/blob/main/tools/approval.py
- `tools/approval_context.py` L198–300 — https://github.com/NousResearch/hermes-agent/blob/main/tools/approval_context.py
- `hermes_cli/approval_mode.py` L16 — https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/approval_mode.py
- `tools/approval_smart.py` L1–31 — https://github.com/NousResearch/hermes-agent/blob/main/tools/approval_smart.py
- `tools/approval_detection.py` L419–430 — https://github.com/NousResearch/hermes-agent/blob/main/tools/approval_detection.py
- `website/docs/user-guide/configuration.md` L2871–2925 — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/configuration.md

### 3.1 Modes (exact names)

**Exactly three valid values: `manual`, `smart` and `off`** `[CODE]`. Source: `VALID_APPROVAL_MODES = ("manual", "smart", "off")`, in `hermes_cli/approval_mode.py` L16 and `tools/approval_context.py` L198.
- There is **no** `yolo` value. YOLO is a separate session toggle that behaves like `off`.
- The default in `DEFAULT_CONFIG` is **`smart`**.
- Pitfalls `[CODE]` (`approval_context.py` L201–215):
  - An unknown value such as `auto` logs a warning and falls back to `manual`.
  - An unquoted YAML `mode: off` is parsed as boolean `false` and treated as `off`.
  - The runtime fallback, used when the key is missing from the loaded config, is `manual` (L237).

| Mode | Behaviour `[DOC]` |
|---|---|
| `smart` (default) | "Use an auxiliary LLM to assess risk. Low-risk commands … are auto-approved for that command only. Genuinely dangerous commands are auto-denied. Uncertain cases escalate to a manual prompt." |
| `manual` | "Always prompt the user for approval on dangerous commands." On messaging, it queues a pending approval. |
| `off` | "Disable all approval checks — equivalent to running with `--yolo`." |

**Smart-mode guardian** `[CODE]`
- A cost note: each flagged command costs one auxiliary LLM call on `auxiliary.approval` (default `provider: auto`, meaning the main model; "a fast/cheap model is recommended"; `config_defaults.py` L769).
- The guardian prompt (`tools/approval_smart.py` L17–31) lists "benign script execution, safe file operations, development tools, **package installs, git operations**" as APPROVE examples.
- `[INFERENCE]` For GitHub work, therefore, do not rely on smart mode to stop git operations. Use `approvals.deny` plus GitHub branch protection.
- `approvals.denial_breaker_threshold` (default `3`) escalates to a hard stop after 3 consecutive guardian denials.
- `approvals.smart_policy` (default `""`) appends your own rules to the guardian's system prompt.

### 3.2 All `approvals.*` keys, with defaults `[CODE]`, `config_defaults.py` L1668–1712

```yaml
approvals:
  mode: smart                     # manual | smart | off
  timeout: 300                    # s; unanswered prompt => DENY (fail-closed)
  cron_mode: deny                 # deny | approve  (cron jobs)
  single_query_mode: deny         # deny | approve  (hermes chat -q / one-shot)
  unattended_mode: deny           # deny | approve  (webhook, msgraph_webhook, api_server)
  smart_policy: ""                # extra rules for the smart guardian
  denial_breaker_threshold: 3     # 0 = off
  deny: []                        # fnmatch globs, blocks even under --yolo / mode off
  mcp_reload_confirm: true
  destructive_slash_confirm: true # /clear /new /reset /undo confirm
command_allowlist: []             # permanent "always" approvals (top-level key)
security:
  approval: {transport: builtin, transport_fallback: deny}
```

**Notes on these keys**
- `_binary_approval_mode` only treats `approve`, `off`, `allow` or `yes` as approve. Anything else means deny (`approval_context.py` L282–288).
- `timeout` is clamped to a platform-safe maximum.
- The docs explain the 300 s default this way: "60s proved too tight for Telegram/Discord push notifications".

### 3.3 YOLO

**How to turn it on** `[DOC]`: any of `hermes --yolo`, `hermes chat --yolo`, the `/yolo` toggle, or `HERMES_YOLO_MODE=1`.
- It works "in both CLI and gateway sessions". `/yolo` and `/approvals [manual|smart|off]` are listed as working in **both** the CLI and the messaging gateway (`website/docs/reference/slash-commands.md` L317).
- `/approvals off` **persists** `approvals.mode` through `set_config_value` (`hermes_cli/approval_mode.py` L33–64) `[CODE]`.
- An admin-pinned managed scope (`/etc/hermes/config.yaml`) refuses this change ([§5.1](#51-where-keys-live-and-what-the-agent-can-read)). `/yolo` is a session environment toggle, so managed scope does not cover it `[INFERENCE]`.

### 3.4 Hardline blocklist (the floor below YOLO)

**What it blocks** `[DOC]` (`security.md` L133–155)
- `rm -rf /` and variants, including `--no-preserve-root`;
- the bash fork bomb;
- `mkfs.*` on a mounted root;
- `dd if=/dev/zero of=/dev/sd*`;
- piping untrusted URLs to `sh` at the rootfs top level.

**When it applies**
- It holds even under `--yolo`, `approvals.mode: off`, cron `approve` mode, or "allow always". There is no override flag.
- It fails closed on unparseable shell quoting ("malformed executable payload").

**Additional unconditional floors** `[CODE]` (`approval.py` `_floor_block` L1052–1075)
- deleting the Python interpreter or venv Hermes runs from;
- `sudo -S` password piping without `SUDO_PASSWORD`;
- the user's own `approvals.deny`.

**Contradiction / nuance** `[CODE]`
- On container backends **the hardline floor is not evaluated at all**.
- `check_all_command_guards()` (L1168–1180) and `check_dangerous_command()` (L1078–1088) return `_user_deny_block(command) or _approved()` on the container fast path, *before* `_floor_block()`.
- The docs present the blocklist as absolute; on Docker and other container backends, only `approvals.deny` survives.

### 3.5 User deny rules (`approvals.deny`) `[DOC]` (`security.md` L157–184)

- **Matching:** fnmatch globs, case-insensitive, applied to the whole command and to the parsed executable candidates. Normalization defeats simple quoting tricks (`git pu""sh --force`).
- **Precedence:** evaluated **before** `--yolo`, `mode: off` and the container fast path.
- **Docs example:**
  ```yaml
  approvals:
    deny:
      - "git push --force*"
      - "*curl*|*sh*"
      - "dd if=* of=/dev/*"
  ```
- **Pitfalls:**
  - Always quote patterns; a bare leading `*` is a YAML alias, which is a parse error.
  - The docs' threat-model note: "a shell-command policy, not a complete shell interpreter or an OS capability sandbox". It does not resolve variables, aliases, functions, renamed binaries or scripts.
- **Reload:** changes apply immediately (the config cache is keyed on mtime).
- **Testing a rule** `[CODE]`: `hermes approvals test -- <command>`, optionally with `--env-type docker` and `--json`.
  - Exit codes: 0 allow, 2 ask-approval, 3 deny.
  - It never runs or prompts anything (`hermes_cli/subcommands/approvals.py` L46–66).
  - It is **not** listed in the reference docs, only in the code's help text.

### 3.6 What triggers a prompt, and what does not

**Flagged patterns** `[DOC]` (`security.md` L199–236):
- recursive `rm`, `rm` under `/`;
- `chmod 777/666/o+w/a+w`, `chown -R root`;
- `mkfs`, `dd if=`, `> /dev/sd`;
- SQL `DROP`, `DELETE` without `WHERE`, `TRUNCATE`;
- writes, tee, cp, mv or `sed -i` into `/etc/`, plus writes to `~/.ssh/` and `~/.hermes/.env`;
- `systemctl stop/restart/disable/mask`, `kill -9 -1`, `pkill -9`, killall of hermes;
- `bash -c`, `sh -c`, `python -e`, `node -c`, `curl|sh`, `bash <(curl …)`;
- `xargs rm`, `find -delete/-exec rm`;
- docker and podman lifecycle commands and daemon redirects.

**Git patterns** `[CODE]` (`approval_detection.py` L419–430): `git reset --hard`, `git push --force` and `-f`, `git clean -f`, `git branch -D`.

**Not flagged** `[CODE]` `[INFERENCE]`:
- a plain `git push`, `gh pr merge` or `gh release`;
- `curl -X POST …` to an arbitrary host;
- a skill CLI that sends mail or creates events (for example the Google Workspace skill's `$GAPI gmail send` and `$GAPI calendar create`);
- MCP tool calls.

The Google Workspace skill's rule "Never send email … without confirming with the user first" is a **prompt-level instruction** (`website/docs/user-guide/skills/bundled/productivity/productivity-google-workspace.md` L333), not an enforced gate.

### 3.7 Approval flow, allowlist, history mining `[DOC]`

**CLI choices:** `[o]nce | [s]ession | [a]lways | [d]eny`, with deny as the default.

**Messaging**
- Reply `yes`, `y`, `approve`, `ok` or `go`, or `no`, `n`, `deny` or `cancel`.
- `/approve [session|always]` and `/deny` are messaging-only commands.
- Telegram uses the same yes/no flow (`telegram.md` L1390–1396).
- An expired prompt cannot be reopened; ask again instead.

**`command_allowlist`** (written by "always")
- Rule keys are honoured on **every surface, including unattended deny contexts**: "a cron job … under `cron_mode: deny` still runs a command whose detected rule key is in `command_allowlist`" (`security.md` L284–290).
- Pitfall: an "always" given in an interactive chat silently widens what cron can do.
- Removing an entry does not apply to a session already running; restart.

**`hermes approvals suggest`**
- Flags: `--apply 1,3`, `--json`, `--days 90`, `--min-count 2`, `--limit`, `--db`.
- It mines `state.db` and never proposes destructive classes.

### 3.8 Unattended contexts (cron, one-shot, webhook and API) `[CODE]` (`approval.py` L618–672, L934–948, L1193–1201, L1242–1300)

**Command decisions**
- In cron and `-q` contexts the presence flags are cleared, so no prompt can hang. Decisions come from `cron_mode`, `single_query_mode` or `unattended_mode`.
- Under `deny`, any dangerous-pattern match **or a Tirith warn/block** is refused instantly. An unimportable Tirith blocks too when `security.tirith_fail_open: false`.

**`execute_code` in cron** (relevant for automations)
- On local, SSH and Docker-with-host-mount backends, a cron, one-shot or webhook context in `deny` mode refuses **every** `execute_code` call. The error reads: "BLOCKED: execute_code runs arbitrary local Python …".
- On a Docker sandbox without host mounts, `execute_code` is approved.

**Other non-interactive contexts**
- `request_tool_approval()` (plugin and hook escalations) fails **closed** in non-interactive, non-cron contexts with no approval bridge. Cron follows `cron_mode`.

**Subagents**
- `delegation.subagent_auto_approve: false` (default) means subagent threads auto-**deny** flagged commands (`config_defaults.py` L1390–1393).

### 3.9 Closing the gap: human approval for outbound actions via hooks (`[DOC]` protocol; the example is mine)

Source: `website/docs/user-guide/features/hooks.md` L543–590 and L1700–1790 — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/hooks.md

**Protocol** `[DOC]`
- A shell `pre_tool_call` hook can return `{"action":"approve","message":…,"rule_key":…}`. This "escalates the call to the existing human-approval gate; … denial, timeout, or gate error fails closed".
- Or it can return `{"action":"block","message":…}`. Exit code 2 also blocks.
- Config schema: `hooks.<event>[] = {matcher (regex on tool name), command, timeout (default 60, max 300), fail_closed}`.

**Consent requirement**
- New shell hooks need a one-time consent per `(event, command)` pair, granted in an interactive CLI.
- The gateway and cron only pick up new hooks if `hooks_auto_accept: true`, `--accept-hooks` or `HERMES_ACCEPT_HOOKS=1` is set (`config_defaults.py` L1749–1756).
- Consent is stored in `~/.hermes/shell-hooks-allowlist.json`.

**Illustrative configuration** (untested):

```yaml
# ~/.hermes/config.yaml   (keys per hooks.md; matcher is a regex on tool name)
hooks:
  pre_tool_call:
    - matcher: "terminal"
      command: "~/.hermes/agent-hooks/outbound-gate.sh"
      timeout: 10
      fail_closed: true
```

```bash
#!/usr/bin/env bash
# ~/.hermes/agent-hooks/outbound-gate.sh  — stdin = JSON payload (tool_name, tool_input.command, ...)
payload="$(cat)"
if printf '%s' "$payload" | grep -Eq 'gmail (send|reply|forward)|calendar (create|delete)|git push|gh (pr merge|release)'; then
  printf '{"action":"approve","message":"Outbound/irreversible action needs owner approval","rule_key":"outbound"}\n'
fi
exit 0
```

**How this behaves** `[INFERENCE]`
- Hook escalations go through `_run_approval_gate()`, which does **not** consult the container fast path. The gate therefore still works on the Docker backend, and it arrives as a Telegram approval prompt.
- In cron with `cron_mode: deny`, the escalated action is refused.
- For MCP tools, add a second entry with a regex on the MCP tool name. MCP tools carry the `mcp_` prefix (`tools/budget_config.py` L22). Check the actual names with `/tools`.

---

## 4. Isolation on macOS: container backend, egress, checkpoints

Sources:
- `website/docs/user-guide/configuration.md` L221–745 — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/configuration.md
- `website/docs/user-guide/security.md` L535–597
- `tools/terminal_tool.py` L139–145 and L1455–1463 — https://github.com/NousResearch/hermes-agent/blob/main/tools/terminal_tool.py
- `tools/environments/docker.py` L520–555 and L825–895 — https://github.com/NousResearch/hermes-agent/blob/main/tools/environments/docker.py
- `hermes_cli/config_defaults.py` L299–394

### 4.1 Backend choice

| Backend | Isolation | Dangerous-command check `[DOC]` |
|---|---|---|
| `local` (default) | None; runs as your OS user | ✅ |
| `ssh` | Remote machine | ✅ |
| `docker` | Container | ❌ "skipped (container is boundary)" — see the precise rule below |
| `singularity`, `modal`, `daytona`, `vercel_sandbox` | Container or cloud | ❌ |

**Precise skip rule** `[CODE]` (`approval.py` L1024–1038)
- `docker` skips guards **only when no host paths are bind-mounted**. `_docker_has_host_access()` (`terminal_tool.py` L139–145) returns true when either:
  - `docker_mount_cwd_to_workspace: true` and a host cwd exists; or
  - any `docker_volumes` entry uses a host path starting with `/`, `~`, `./` or `../`, or a Windows drive.
- With such a mount, the **normal approval flow** applies inside the container.
- The other container backends always skip.

**Practical consequence for this user** `[INFERENCE]`. There are two good variants:
- **(a) Max isolation, fewest prompts.**
  - No host mounts.
  - The agent clones the GitHub repo inside the sandbox (`/workspace` persists under `~/.hermes/sandboxes/docker/<task_id>/`) and pushes branches with a repo-scoped token.
  - GitHub branch protection plus a PR review is the real gate.
  - Prompts appear only for `approvals.deny` and hook escalations.
- **(b) Edit host files.**
  - Mount exactly one project directory through `docker_volumes`.
  - Approvals stay active for container commands, the hardline floor applies again, and you get more prompts.

### 4.2 Docker terminal-backend config (defaults from `config_defaults.py` L299–394; keys from `configuration.md` L346–402)

```yaml
terminal:
  backend: docker                     # default: local
  docker_image: "nousresearch/hermes-sandbox:desktop"   # default sandbox image (built for amd64 + arm64)
  docker_forward_env: []              # default []; host env vars forwarded into container (secrets!)
  docker_env: {}                      # literal KEY: value pairs (lands in config.yaml)
  docker_volumes: []                  # "host:container[:ro]"; any host path => approvals stay ON
  docker_mount_cwd_to_workspace: false  # true = mount launch dir at /workspace (weakens isolation)
  docker_network: true                # false = --network=none (no egress at all)
  docker_extra_args: []               # appended last to docker run — can silently undo hardening
  docker_run_as_host_user: false
  container_cpu: 1                    # cores
  container_memory: 5120              # MB
  container_disk: 51200               # MB (needs overlay2 on XFS+pquota; likely no-op on Docker Desktop [INFERENCE])
  container_persistent: true          # false = fresh container per session (security boundary between chats)
  docker_persist_across_processes: true
  docker_orphan_reaper: true
  lifetime_seconds: 300
  env_passthrough: []                 # also applies to execute_code and no_agent cron scripts
  cwd: "."                            # gateway/cron working dir — set it explicitly
```

**Hardening flags** `[DOC]` and `[CODE]`
- `--cap-drop ALL`, then `--cap-add DAC_OVERRIDE,CHOWN,FOWNER`
- `--security-opt no-new-privileges`
- `--pids-limit 256`
- tmpfs `/tmp` 512 MB, `/var/tmp` 256 MB with `noexec`, `/run` 64 MB
- `SETUID` and `SETGID` are added only for root-start images that must drop privileges.

**What is mounted by default** `[CODE]`
- Persistent bind mounts of `/workspace` and `/root` from `~/.hermes/sandboxes/docker/<task_id>/`.
- **Read-only** mounts of the skills directory, skill-declared credential files (for example `google_token.json`) and cache directories (`docker.py` L524–555).
- `~/.hermes/.env`, `auth.json` and the vault are **not** mounted.

**Persistence model**
- One long-lived container is shared across sessions, `/new` and subagents, and it survives Hermes restarts.
- Set `container_persistent: false` to get one container per session, which the docs call the setting for "when the sandbox is a security boundary between conversations".

**Keeping secrets out** `[DOC]`
- Leave `docker_forward_env: []`. The docs say "Anything listed in `docker_forward_env` becomes visible to commands run inside the container."
- Skill-declared `required_environment_variables` are forwarded automatically (since v0.5.1).
- Provider credentials are refused for passthrough (GHSA-rhgp-j443-p4rf, `tools/env_passthrough.py` L37–70) `[CODE]`.

**macOS specifics**
- `[DOC]` "Requirements: Docker Desktop or Docker Engine … Hermes probes `$PATH` plus common macOS install locations (`/usr/local/bin/docker`, `/opt/homebrew/bin/docker`, Docker Desktop app bundle)."
- `[DOC]` Podman: `HERMES_DOCKER_BINARY=podman`.
- **OrbStack and colima are not documented** for the terminal backend. OrbStack is mentioned only in the virtiofs note. Assume they work through the `docker` CLI, but this is **unverified**.
- `[CODE]` The sandbox image is built for `linux/arm64` (`.github/workflows/sandbox-image.yml`).
- `[GENERAL]` Restrict Docker Desktop's **File sharing** to the directories you really mount. By default Docker Desktop shares `/Users` and more.
  - Never enable the daemon's unauthenticated TCP socket (port 2375).
  - Never mount the Docker socket into the sandbox. The Carbonato botnet `[NOTES]` targeted exposed port-2375 daemons.

**Background commands**
- `[CODE]` In `terminal_tool.py`, `_run_approval_guards()` (L1455) runs before `spawn_background_process()` (L1463).
- The earlier report "terminal(background=true) bypasses consent gate" (#90789 `[NOTES]`) therefore appears addressed on `main`. This is an `[INFERENCE]`.

### 4.3 What container isolation does NOT cover (on any backend) `[DOC]` (`SECURITY.md` §2.2)

These run in the host-side Hermes process as the Hermes OS user:
- MCP stdio servers;
- plugins and hooks;
- skill loading;
- web, browser and vision fetches;
- `no_agent` cron scripts, which are "sanitized" host subprocesses (`cron.md` L889–922).

**This is why the dedicated macOS user matters** ([§11](#11-macos-baseline-hardening-mostly-general-not-from-hermes-docs)).

### 4.4 Checkpoints and `/rollback`

Sources: `website/docs/user-guide/checkpoints-and-rollback.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/checkpoints-and-rollback.md and `config_defaults.py` L498–518.

**Turning it on** `[DOC]`
- Opt-in: `checkpoints.enabled: false` by default, or `hermes chat --checkpoints` per session.
- Shadow git store at `~/.hermes/checkpoints/store/`; the real `.git` is never touched.

**What triggers a snapshot**
- Snapshots are taken before `write_file` and `patch`.
- They are also taken before destructive terminal commands: `rm`, `rmdir`, `cp`, `install`, `mv`, `sed -i`, `truncate`, `dd`, `shred`, `>` redirects, and `git reset/clean/checkout`.
- At most one snapshot per directory per turn.
- Inconsistency: the `config_defaults.py` comment says "once per turn (on the first write_file/patch call)".

**Defaults:**
```yaml
checkpoints: {enabled: false, max_snapshots: 20, max_total_size_mb: 500, max_file_size_mb: 10, auto_prune: true, retention_days: 7, min_interval_hours: 24}
```

**Commands**
- In a session: `/rollback`, `/rollback diff <N>`, `/rollback <N>`, `/rollback <N> --all`, `/rollback <N> <file>`.
- From the CLI: `hermes checkpoints [status|prune|clear|clear-legacy]`.

**Container backends** `[DOC]` (L254–256):
- With `docker` and other container backends, Hermes "does not take checkpoints". `/rollback` refuses diff and restore.
- **Docker users must rely on git: branches, worktrees and frequent commits.**

**Worktrees** `[DOC]` (`git-worktrees.md`; `configuration.md` L962–990)
- `hermes -w`, `/worktree new <name>`, or the config key `worktree: true`.
- Hermes-created worktrees disable the repo's hooks, `core.fsmonitor` and clean/smudge filters.
- `delegation.worktree_isolation: true` gives each subagent its own worktree, but only on the local backend.
- Pitfall: `.worktreeinclude` can copy `.env` into worktrees.

### 4.5 Network egress

**`terminal.docker_network: false`** `[DOC]`
- The container runs with `--network=none`, the cleanest egress cut.
- It breaks git, pip and npm inside the sandbox.

**`network-isolation.md`** `[DOC]` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/egress/network-isolation.md
- This is a Compose override with an `internal: true` network plus a squid allowlist proxy, for the **whole-process** Docker deployment.
- Example allowlist: `api.openai.com`, `api.anthropic.com`, `openrouter.ai`, `api.telegram.org`, `api.github.com` and others. It publishes the dashboard as `127.0.0.1:9119:9119`.
- Limitation stated in the doc: DNS still resolves externally.
- Note: the gateway (which hosts the agent) is dual-homed to egress in the example, so this mainly constrains through the proxy. `[INFERENCE]`

**iron-proxy credential-injection egress** `[DOC]` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/egress/iron-proxy.md
- Commands: `hermes egress install`, then `hermes egress setup`, `hermes egress start` and `hermes egress status`. Config lives under `proxy:` (`enabled: false` by default).
- The sandbox gets opaque proxy tokens instead of the real provider keys.
- Default upstream allowlist: OpenRouter, OpenAI, Anthropic, Google, xAI, Mistral, Groq, Together, DeepSeek and Nous; extend it with `proxy.extra_allowed_hosts`.
- SSRF deny CIDRs are on by default.
- Bind address: loopback `127.0.0.1:9090` on macOS Docker Desktop.
- Docker backend only.
- Limitations stated in the doc:
  - it does not stop raw sockets that bypass `HTTPS_PROXY`;
  - it does not stop exfiltration through allowlisted hosts;
  - it does not cover GitHub tokens (only provider keys such as `*_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`).
- Relevance: only useful if provider keys must exist inside the sandbox, which they do not by default.

**SSRF guard** `[DOC]` (`security.md` L753–803)
- URL-capable tools block private networks (RFC1918), loopback, link-local and metadata addresses, **CGNAT 100.64/10 (Tailscale)**, and fail closed on DNS errors.
- `security.allow_private_urls: false` (default) — keep it on a home LAN.
- `security.website_blocklist` (default off) blocks domains per tool.

**macOS Local Network privacy** `[DOC]` (`messaging/index.md` L681–683)
- The generated LaunchAgent starts the gateway **through `/usr/bin/osascript`**, so macOS treats it as an Apple platform binary "exempt from the check".
- As a result, the macOS "Local Network" permission is **not** a control over the gateway, and terminal commands on the local backend can reach your LAN.

### 4.6 Whole-process Docker on the Mac (the alternative posture)

Source: `website/docs/user-guide/docker.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/docker.md `[DOC]`

**What it gives you**
- This is the `SECURITY.md` "supported posture" for untrusted inputs.
- On a Mac it also adds the Docker VM boundary `[INFERENCE]`.

**Image channels**
- Tags: `latest`/`stable` (stable gate), `main` (development), or `X.Y.Z`. "Use a digest for an exact deployment pin."

**Privileges**
- The image runs as the non-root `hermes` user (UID 10000) via s6.
- `/opt/hermes` is root-owned and read-only.
- The image sets `HERMES_WRITE_SAFE_ROOT=/opt/data` and disables lazy installs.
- `docker exec` auto-drops to the `hermes` user.

**State database on macOS volumes**
- `state.db` on Docker Desktop, OrbStack or Podman bind mounts uses virtiofs. With WAL, concurrent writers can corrupt it silently.
- Since v2026.9.14, fresh databases are created in DELETE journal mode on such mounts.
- Better: use a **named volume** (`-v hermes-data:/opt/data`), or set `database.journal_mode: delete`.

**Ports and dashboard**
- The docs' `-p 8642:8642` publishes on **all host interfaces** `[GENERAL]`. Prefer `127.0.0.1:` prefixes, as the `network-isolation.md` example does.
- The dashboard inside the image binds `0.0.0.0` by default and fails closed without an auth provider.

**Trade-off** `[INFERENCE]`
- macOS-native integrations are unavailable inside the Linux container: Apple Notes, Reminders and iMessage skills, the Keychain, and `cua-driver` computer use.
- Docker Desktop must run in a logged-in GUI session.

---

## 5. Secrets

Sources:
- `website/docs/user-guide/secrets/index.md`, `onepassword.md`, `bitwarden.md`, `command.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/secrets/index.md
- `website/docs/user-guide/features/credential-vault.md`
- `website/docs/user-guide/features/credential-pools.md`
- `website/docs/user-guide/managed-scope.md`
- `tools/environments/local_env_policy.py` L20–60 and L360–392 — https://github.com/NousResearch/hermes-agent/blob/main/tools/environments/local_env_policy.py
- `hermes_cli/config.py` L503–512

### 5.1 Where keys live and what the agent can read

**Default store** `[DOC]`
- API keys and bot tokens go in `~/.hermes/.env`, never in `config.yaml`.
- `hermes config set FOO_KEY …` writes UPPER_SNAKE names to `.env`.
- Hermes chmods `.env` to `0600` when writing outside containers `[CODE]` (`config.py` L503–512).
- Outside containers, `HERMES_HOME` and its `cron/`, `sessions/`, `logs/` and `memories/` directories are locked to `0700` on every start (`docker.md` L901).

**Managed scope** `[DOC]`
- An admin can put `/etc/hermes/config.yaml` and `.env` (root-owned, `0644`) in place. Their values win per key over the user config, the user `.env` and even the shell.
- `hermes config set` refuses managed keys.
- The managed `.env` is world-readable, so use it for non-secrets only.
- Useful to pin, for example, `approvals.mode` or `security.redact_secrets` for the dedicated Hermes user.
- `HERMES_MANAGED_DIR` relocates it; a user who can set that variable defeats the mechanism.

**What can read what**

| Reader | `.env` / `auth.json` / vault | Notes |
|---|---|---|
| File tools (`read_file`, `search_files`) | **Read-denied** | Also read-denied: project `.env`, `.env.local`, `.env.production`, `.envrc`, and `config.yaml`. Always write-blocked: `~/.ssh` (except `~/.ssh/config`, which is approval-gated), `~/.aws`, `~/.kube`, `/etc/sudoers`, `~/.netrc`, `vault/`, `mcp-tokens/`, `pairing/`, `browser-profile/` (`security.md` L353–407) `[DOC]` |
| Terminal on the **local** backend | **Can `cat` them** ("The `terminal` tool runs as the same OS user and can still `cat` or overwrite denied paths") | `security.redact_secrets: true` (default) masks credential-shaped assignments in output (`configuration.md` L2838). "A motivated output producer will defeat it." `[DOC]` |
| Terminal on the **Docker** backend | Not mounted | Only forwarded env vars, skill credential files (read-only) and the skills directory (read-only) |
| Subprocess environment | Scrubbed | **Tier 1, always stripped** `[CODE]` (L374–392): `GH_TOKEN`, `GITHUB_TOKEN`, `GITHUB_APP_*`, `TELEGRAM_BOT_TOKEN`, `DISCORD_BOT_TOKEN`, Slack tokens, `GATEWAY_ALLOWED_USERS`, `GATEWAY_ALLOW_ALL_USERS`, `EMAIL_PASSWORD`, dashboard secrets, `MODAL_*`, `DAYTONA_API_KEY`, and every adapter secret. **Tier 2:** provider and tool keys are stripped unless the child is credential-inheriting. `env_passthrough` refuses provider credentials, for example `GH_TOKEN` (GHSA-rhgp-j443-p4rf). |
| In-process code: skills, plugins, hooks, MCP | **Everything in memory** | `SECURITY.md` §2.3. MCP stdio children get only `PATH, HOME, USER, LANG, LC_ALL, TERM, SHELL, TMPDIR, XDG_*` plus their `env:` block `[DOC]`. |

**Protected instruction files** `[CODE]`
- `security.protected_instruction_files: true` (default) means writes to `AGENTS.md`, `CLAUDE.md`, `SOUL.md`, `.cursorrules` and project `.hermes` config always need human approval, "even under yolo" (`config_defaults.py` L1790–1794).

**Write sandbox** `[DOC]`
- `HERMES_WRITE_SAFE_ROOT=/path/project:/Users/<hermes>/.hermes` hard-blocks `write_file` and `patch` outside the listed roots.
- Pitfall: if you leave out the Hermes home, cron and skills writes break.

### 5.2 Secret managers `[DOC]`

**Common behaviour**
- Bitwarden Secrets Manager (`bws`), 1Password (`op://` references) and a command helper are pulled at **process startup**.
- The bootstrap token (`BWS_ACCESS_TOKEN` or `OP_SERVICE_ACCOUNT_TOKEN`) stays in `.env`, or for 1Password optionally in `~/.hermes/.op.env`, which is gitignored and `0600`.

**1Password**
- `hermes secrets onepassword setup`, `set ENV "op://Vault/Item/field"`, `sync` and `status`.
- Config: `secrets.onepassword.{enabled, env, account, service_account_token_env, binary_path, cache_ttl_seconds: 300, override_existing: true}`.
- Values are cached in `cache/op_cache.json` (`0600`). Set `cache_ttl_seconds: 0` to disable both cache layers.
- A service-account token "can read every secret the account has access to". Grant it **one dedicated vault**.
- The docs themselves say **"When NOT to use this: Single-machine personal setups where `~/.hermes/.env` is fine."**

**Command helper**
- `secrets.command.{enabled, command, helper_timeout_seconds: 3, override_existing: false}` runs once via `/bin/sh -c` and must be **non-interactive**.
- `[INFERENCE]` A macOS Keychain lookup (`security find-generic-password -w …` wrapped to print `KEY=VALUE`) is possible in principle but **undocumented and untested**. Keychain unlock prompts would break the 3 s non-interactive contract.
- The docs say OS keystores belong in plugins, not core.

**Resolved secrets are in the process environment**
- They end up in `os.environ` of the Hermes process, so §5.1's in-process row applies `[INFERENCE]`.

### 5.3 Vault for website logins, card fills and borrowed logins `[DOC]`

**Vault**
- `hermes vault list|add|rm|sources`.
- Items are stored encrypted under `~/.hermes/vault/` as a Fernet key plus the vault file, both `0600`, **in the same directory**. `[INFERENCE]` This protects against copying, not against same-user processes; FileVault is the at-rest control.

**Password-manager auto-detection**
- A detected `op` or `bw` CLI is **auto-used** for website logins (`vault.onepassword.enabled` and `vault.bitwarden.enabled` can turn this off).
- **Do not** sign the owner's personal password manager CLI into the agent's account `[GENERAL]`.

**Card fills**
- Every card fill asks first. Headless sessions are refused.

**Borrowed CLI logins**
- `auth.adopt_external_logins: true` is the default. Hermes then borrows and refreshes `~/.codex/auth.json` and Claude Code credentials (`security.md` L669–679).
- Set it to `false` on the agent account. This avoids rotating-token conflicts and accidental billing routes ([§8.4](#84-provider-side-hard-limits-the-only-real-spend-cap)).

### 5.4 Credential pools

- `hermes auth add <provider> …` adds keys.
- A 402 billing error rotates immediately to the next key with a 1 h cooldown. When all keys are exhausted, the request goes to `fallback_providers` (`credential-pools.md` L26–45).
- **Cost pitfall** ([§8](#8-cost-control-tuned-to-60200--per-month)): a capped key does not stop spending if another uncapped key or fallback exists.
- Rotation also resets the provider prompt cache.

---

## 6. Access control and exposure (Telegram focus)

Sources:
- `website/docs/user-guide/security.md` L409–534 — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md
- `website/docs/user-guide/messaging/telegram.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/telegram.md
- `website/docs/user-guide/messaging/index.md` L350–430
- `website/docs/user-guide/configuration.md` L2570–2642
- `gateway/authz_mixin.py` L698–738 — https://github.com/NousResearch/hermes-agent/blob/main/gateway/authz_mixin.py
- `gateway/run_inbound.py` L190–203 and L276–297 — https://github.com/NousResearch/hermes-agent/blob/main/gateway/run_inbound.py

### 6.1 Authorization order and defaults `[DOC]`

The checks run in this order:
1. per-platform allow-all. `TELEGRAM_ALLOW_ALL_USERS` exists and is documented as "Allow any Telegram user to trigger the bot (dev only)" (`reference/environment-variables.md` L321; `plugins/platforms/telegram/adapter.py` L1022) `[DOC][CODE]`. Never set it;
2. the DM-pairing approved list;
3. platform allowlists (`TELEGRAM_ALLOWED_USERS=123456789`);
4. `GATEWAY_ALLOWED_USERS`;
5. `GATEWAY_ALLOW_ALL_USERS=true`;
6. **deny**.

**Defaults**
- No allowlist means all users are denied, and the gateway logs a warning.
- The global allow-all can also come from `config.yaml` (`gateway.allow_all_users: true`, default `false`, `config_defaults.py` L2139), which is bridged at startup. **Never set it.**

**Setup**
- `hermes gateway setup` (pick Telegram) asks for the bot token and the allowed user IDs.
- Manual alternative in `~/.hermes/.env`:
  ```bash
  TELEGRAM_BOT_TOKEN=123456789:ABC...
  TELEGRAM_ALLOWED_USERS=<your numeric id>      # get it from @userinfobot
  ```
- The Desktop app also has a Telegram "Create with QR" quick setup that detects your user ID for the allowlist (`desktop.md` L279).

### 6.2 What happens with unknown senders (verified in code)

**Behaviour key** `[DOC]`
- `unauthorized_dm_behavior`: `pair` (default for chat platforms), `ignore` or `decline`.
- `decline` sends one polite reply, then 24 h silence; the text comes from `unauthorized_dm_decline_message`.
- It can be set globally or per platform.

**Resolution order** `[CODE]` (`authz_mixin.py` L698–738)
1. Explicit per-platform setting.
2. Email always resolves to `ignore`.
3. An explicit non-`pair` global setting.
4. The adapter's DM policy.
5. **If any allowlist is configured (`TELEGRAM_ALLOWED_USERS`, the group variants, or `GATEWAY_ALLOWED_USERS`), the result is `ignore`**. The code comment: "spamming unknown contacts with pairing codes is both noisy and a potential info-leak" (#9337).
6. Otherwise `pair`.

So the docs' "pair is the default" holds only **without** an allowlist.

**What happens per case** `[CODE]` (`run_inbound.py` L276–297)
- **Ignored DM:** nothing is sent to the sender. The owner gets a WARNING log line and, **once per sender, a notice in the home channel** containing the sender ID and the allowlist fix (L190–203).
- **Unauthorized messages in groups** are ignored and logged.
- **Messages without a user ID** (channel posts, anonymous admins) are ignored unless the chat is allowlisted.
- **Bots** can never pair.

### 6.3 Pairing `[DOC]`

- **Commands:** `hermes pairing list`, `hermes pairing approve telegram <CODE>`, `hermes pairing revoke telegram <id>`, `hermes pairing clear-pending`.
- **Code security:** 8 characters from a 32-character unambiguous alphabet, cryptographic randomness, valid for 1 h. Rate limit: 1 request per user per 10 min. At most 3 pending codes per platform; 5 failed approvals trigger a 1 h lockout. Files are `0600` under `~/.hermes/pairing/`, and codes are never logged.
- **Risk:** a stranger cannot self-approve, because approval needs the CLI on the Mac. The residual risk is social engineering ("please approve code X") `[INFERENCE]`.

### 6.4 Groups, mentions and bot loops `[DOC]`

**Groups and DMs**
- `TELEGRAM_ALLOWED_USERS` applies to DMs **and** groups.
- `TELEGRAM_GROUP_ALLOWED_USERS` (alias `group_allow_from`) authorizes senders in groups only.
- `TELEGRAM_GROUP_ALLOWED_CHATS` (alias `group_allowed_chats`) authorizes **every member** of the listed chats.
- `*` allows any sender.
- `guest_mode` (default `false`) lets non-allowlisted groups through on an explicit @mention only.

**Privacy and mentions**
- BotFather privacy mode is on by default. With it on, the bot sees only commands, replies to itself, and service messages.
- **If `telegram.require_mention` is unset or false, Hermes keeps the open-group behaviour** and answers any visible group message from authorized users.
- `observe_unmentioned_group_messages` appends other members' messages to the session context. This is untrusted content, and therefore a prompt-injection surface `[INFERENCE]`.

**Sessions in groups**
- `group_sessions_per_user: true` (default) gives each sender their own session in groups.

**Bot-to-bot loops**
- A guard is on by default: `gateway.bot_loop_guard: {enabled: true, max_events: 20, window_seconds: 300, cooldown_seconds: 600}`.

**Recommendation for this user** `[INFERENCE]`
- DM only and no groups.
- If a group is ever needed: privacy mode on, `require_mention: true`, `group_allowed_chats` limited to that chat, and `gateway.strict: true`.

### 6.5 Slash-command access and dangerous commands from chat `[DOC]`

**Admin and user split**
- `gateway.platforms.telegram.extra.allow_admin_from`, `user_allowed_commands`, and `group_*` variants.
- If `allow_admin_from` is unset, every allowed user is unrestricted.

**Risky commands that work from Telegram**
- `/yolo`, `/approvals`, `/update`, `/approve` and `/deny` all work in the gateway.
- `[INFERENCE]` Whoever controls your Telegram account (a stolen session or a SIM swap) can switch approvals off and run commands. Protect the Telegram account ([§11](#11-macos-baseline-hardening-mostly-general-not-from-hermes-docs)).
- `approvals.deny`, the container boundary and the OS user still hold.

**Per-platform tool scope**
- `platform_toolsets.telegram` (set with `hermes tools`) and `agent.disabled_toolsets` can remove, for example, `terminal` or `code_execution` from Telegram entirely (`configuration.md` L942–960).

**Push notifications and media**
- `display.platforms.telegram.notifications: important` (default) rings only on final answers and approvals.
- `gateway.strict: false` (default). When true, files the agent emits via `MEDIA:` must come from the Hermes cache or `media_delivery_allow_dirs`. The docs recommend this for public-facing gateways (`config_defaults.py` L2221–2236).

### 6.6 Listening services and their default binds

| Surface | Default | Auth | Source |
|---|---|---|---|
| Telegram adapter | **Long polling (outbound only), no port** | Bot token | `telegram.md` L346–375 `[DOC]` |
| Telegram webhook mode | Only if `TELEGRAM_WEBHOOK_URL` is set; listens on `TELEGRAM_WEBHOOK_PORT`, default 8443 | `TELEGRAM_WEBHOOK_SECRET` **required**; the gateway refuses to start without it (GHSA-3vpc-7q5r-276h) | `telegram.md` L359–375 `[DOC]` |
| Web dashboard `hermes dashboard` | `127.0.0.1:9119`. On loopback: no auth, no login page. | Any non-loopback bind **or** non-loopback `dashboard.public_url` engages the gate. RFC1918, CGNAT and link-local count as **public**. No provider means fail-closed at startup. `--insecure` is a **no-op** since the June 2026 hardening. | `web-dashboard.md` L23–42, L634–662; `hermes_cli/web_server.py` L517–533, L1168–1188 `[DOC][CODE]` |
| Dashboard inside the official Docker image | `HERMES_DASHBOARD_HOST` default `0.0.0.0`; off unless `HERMES_DASHBOARD=1` | Same gate | `docker.md` L132–176 `[DOC]` |
| OpenAI-compatible API server | **Off** (`API_SERVER_ENABLED=false`); `127.0.0.1:8642` | `API_SERVER_KEY` "required for every deployment, including the default loopback bind". It "gives full access … including terminal commands". | `api-server.md` L673–735 `[DOC]` |
| Webhook adapter | Off unless configured; port 8644; **binds all interfaces (IPv4 + IPv6) by default** (`DEFAULT_HOST = None`); pin it with `platforms.webhook.extra.host` | HMAC per route. `INSECURE_NO_AUTH` is accepted only on loopback. The default run toolset is constrained to `web_search`, `web_extract`, `vision_analyze` and `clarify`. | `gateway/platforms/webhook.py` L57–61 `[CODE]`; `webhooks.md` L540–612 `[DOC]` |
| ACP (editor integration) | stdio, no port | OS user | `features/acp.md` `[DOC]` |
| TUI gateway | local IPC | OS user | `SECURITY.md` §2.6 |
| iron-proxy | `127.0.0.1:9090` on macOS Docker Desktop | proxy tokens | `iron-proxy.md` L135–146 |
| Codex OAuth `browser` flow | temporary `localhost:1455` callback | — | `config_defaults.py` L1764–1769 |

**Gateway health endpoint**
- `/health` exists only on the API server (`api-server.md` L428–442).

**Startup security audit** `[CODE]` (`hermes_cli/security_audit_startup.py` L30–140). It warns when:
- the process runs as root;
- `sshd_config` (including drop-ins) lacks `PasswordAuthentication no`. Note that it reads the file even when macOS Remote Login is off.
- the API server is network-accessible without a key.

### 6.7 Reaching dashboard / desktop backend remotely without public exposure

**Hermes Desktop "SSH" connection type** `[DOC]` (`multi-connection-desktop.md` L44–46, L130–141)
- "The app opens the tunnel and starts the dashboard for you", using your SSH key.
- Nothing listens on the network. **Best fit over Tailscale.**

**SSH tunnel to a loopback dashboard** `[DOC]` (`docker-compose.yml` comment)
- `ssh -L 9119:localhost:9119 <mac>`.

**Tailscale Serve** `[DOC]` (`web-dashboard.md` L1013–1018)
- Use tailnet-only HTTPS to the loopback dashboard. Set `dashboard.public_url: "https://<machine>.<tailnet>.ts.net"`; this still **requires** an auth provider.

**Bind to the Tailscale IP with username/password** `[DOC]` (`web-dashboard.md` L1149)
- The docs recommend `--host <tailscale-ip>`.
- Username/password is "not suitable for direct public-internet exposure"; use OAuth (Nous) or OIDC for internet-facing dashboards.
- Basic-auth login is rate-limited to 10 per minute per IP. Login events go to `$HERMES_HOME/logs/dashboard-auth.log`.

**Desktop token storage** `[DOC]`
- Desktop stores remote tokens as `0600` files.
- Optional Keychain encryption: Settings → Gateway → "Encrypt saved secrets with the OS keychain".

**Incident (repo-documented)**
- "An unauthenticated public dashboard was the entry point for the June 2026 MCP-config persistence campaign: internet scanners reached exposed dashboards (and OpenAI API servers) and drove the agent into planting an SSH-key backdoor" (`docker.md` L174–176).

**Doc contradictions**
- What the Desktop's "Remote gateway" connects to: `desktop.md` L457 says a **`hermes serve`** backend; `web-dashboard.md` L172–176 says a **`hermes dashboard`** process.
- `docker-compose.windows.yml` still passes `--insecure --host 0.0.0.0`. Without an auth provider this now exits at startup `[CODE]`. This is a stale example.

---

## 7. Supply chain: skills, MCP, plugins

Sources:
- `website/docs/user-guide/features/skills.md` L357–395, L457–510, L885–939 — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md
- `tools/skills_guard.py` L618–627 — https://github.com/NousResearch/hermes-agent/blob/main/tools/skills_guard.py
- `website/docs/user-guide/features/mcp.md` L58–212, L794–807
- `optional-mcps/`
- `tools/osv_check.py`
- `plugin-catalog/README.md` — https://github.com/NousResearch/hermes-agent/blob/main/plugin-catalog/README.md
- `website/docs/user-guide/features/plugins.md` L149–155, L796–835
- `website/docs/user-guide/features/plugin-catalog.md` L67–95
- `security.md` L954–1030

### 7.1 Skills

**Trust levels** `[DOC]`

| Level | Source | Policy |
|---|---|---|
| `builtin` | Ships with Hermes | Always trusted |
| `official` | `optional-skills/` in the repo | Built-in trust |
| `trusted` | `openai/skills`, `anthropics/skills`, `huggingface/skills`, `NVIDIA/skills` | "More permissive" |
| `community` | Everything else: skills.sh, well-known endpoints, GitHub, ClawHub, LobeHub, browse.sh, URL | Strictest |

**Install scanning**
- Hub installs are always scanned.
- `--force` overrides caution/warn findings but **never a `dangerous` verdict**.
- Before installing: `hermes skills inspect …`.
- Updates: `hermes skills check` and `hermes skills update` (locally edited skills are skipped).

**Other skill settings**

| Key / feature | Default | Effect |
|---|---|---|
| NVIDIA SkillEvaluator | `skills.tier1_advisory: true` | Advisory only; runs only if the binaries are installed |
| Project skills | Not auto-loaded | `hermes skills trust`; "dangerous" verdicts are quarantined |
| `skills.inline_shell` | `false` | Keep it off |
| `skills.guard_agent_created` | `false` | Agent-created skills are not scanned |
| `skills.write_approval` | `false` | `true` stages all skill writes, including the background review's, for `/skills pending`, `diff`, `approve` and `reject` |

**Known scanner bypass, verified in code** `[CODE]`
- `scan_file()` returns **no findings** when the file cannot be decoded: `except (UnicodeDecodeError, OSError): return []` (L625–627 at commit 1298c8e).
- A single invalid UTF-8 byte therefore exempts a file from the content scan. This matches the reported #132192 `[NOTES]` and is **still present on `main` at 2026-10-04**.
- Per `SECURITY.md` §3.2, Skills Guard bypasses are out of scope, so no advisory or CVE will follow.
- `[INFERENCE]` Shell scripts with such a byte still run, and so would Python with a coding declaration.
- **Conclusion:** read third-party skill code yourself, and prefer builtin and official skills.

### 7.2 MCP

**Catalog** `[DOC]`
- "Nous-approved", entries merged through PRs, disabled by default.
- Commands: `hermes mcp catalog`, `hermes mcp install <name>`.
- The docs still say "**you should still read the manifest before installing**".
- **All 65 current catalog entries are remote `type: http` transports**, with no local stdio installs (counted in `optional-mcps/*/manifest.yaml`) `[CODE]`.
- `[INFERENCE]` This structurally limits the earlier `[NOTES]` issue CVE-2026-82021 (catalog referenced via a mutable branch; reportedly fixed in 0.19.0). Remote MCP vendors still receive the data you send them.

**Runtime protections**
- **OSV malware check** `[CODE]` (`tools/osv_check.py` header): it runs before launching npx and uvx MCP servers, blocks only confirmed `MAL-*` advisories, and is **fail-open** on network errors.
- `hermes security audit` `[DOC]` runs OSV over the venv, plugin requirements and pinned `npx`/`uvx` MCP servers. Flags: `--json`, `--fail-on critical` (default), `--skip-venv`, `--skip-plugins`, `--skip-mcp`.
- **Exposure control:** per-server `tools: {include: […], exclude: […], prompts: false, resources: false}`. Use it to drop send/delete tools.

**Where MCP runs**
- MCP servers run on the host in the agent process tree, outside any terminal sandbox (`SECURITY.md` §2.2).

### 7.3 Plugins and hooks

**Opt-in loading** `[DOC]`
- General plugins load only after being listed in `plugins.enabled`.
- Project-local plugins are disabled unless `HERMES_ENABLE_PROJECT_PLUGINS=true`.

**Catalog rules** `[DOC]`
- Human-merged entries only, an **exact 40-character SHA pin** per entry, and "no self-updating code".
- `tier: official | community`.
- The install scanner runs at admission.

**Updates** `[CODE]`
- `plugins.auto_update_check_hours: 24`, but `plugins.auto_apply: false`. Updating stays explicit: `hermes plugins update <name>`.

**Isolation**
- `plugins.isolation: in_process` is the default. `host` runs third-party plugins in a separate plugin-host process per profile. This contains crashes and keeps them out of Hermes memory, but is "not isolation" from the OS user (`plugins.md` L796–835).

**Hooks**
- Gateway event hooks in `~/.hermes/hooks/<name>/` are **trusted by placement**: no opt-in, and `HERMES_SAFE_MODE` does not skip them. Audit that directory (`security.md` L954–962).
- Shell hooks need consent (`hooks_auto_accept: false`).

**Supply-chain advisories**
- A startup and `hermes doctor` check flags known-compromised PyPI versions, for example "the May 2026 `mistralai 2.4.6` poisoning".
- `hermes doctor --ack <advisory-id>` acknowledges an advisory.
- `security.allow_lazy_installs: true` is the default. `hermes config set security.allow_lazy_installs false` stops on-demand PyPI installs once setup is done.

---

## 8. Cost control (tuned to 60–200 € per month)

Sources:
- `website/docs/reference/cli-commands.md` (`hermes usage` L699–740, `hermes insights` L1777–1786, `--usage-file` L255–266, `hermes prompt-size` L1293–1333) — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/cli-commands.md
- `website/docs/user-guide/configuration.md` L1218–1295, L1370–1395, L2066–2115
- `website/docs/user-guide/features/memory.md` L293–440
- `website/docs/user-guide/features/delegation.md`
- `website/docs/integrations/providers.md` L134–150
- `hermes_cli/config_defaults.py` (all lines cited)

### 8.1 Seeing usage and cost

**Commands** `[DOC]`

| Command | What it shows |
|---|---|
| `/usage` | Session tokens, an estimated cost breakdown, context state, and "Account limits" when the provider supports them |
| `hermes usage [--provider openai-codex\|anthropic\|openrouter] [--json]` | The account-limits block without a session: Codex windows, Anthropic OAuth windows, **OpenRouter credits**. Exit code 1 if unsupported. |
| `/insights [days]` and `hermes insights [--days N] [--source telegram]` | 30-day analytics |
| `display.show_cost: false` (default) | Set `true` to show estimated $ in the CLI status bar |
| `hermes -z "…" --usage-file report.json` | One-shot runs only. The report splits main loop and auxiliary, and **`total_including_auxiliary.estimated_cost_usd`** is the grand total. |
| `hermes prompt-size [--platform telegram] [--json]` | Fixed per-call prompt overhead, offline |
| `/context all` | Per-skill and per-toolset token cost |

**Nous Portal billing**
- `/topup` shows the balance and manages billing.
- The **monthly spend limit is set on the portal; the terminal shows it read-only** `[CODE]` (`hermes_cli/cli_billing_mixin.py` L1074–1085; `locales/en.yaml` "The monthly limit is set on the portal").
- `display.credits_notices: true` shows credits bands in the status bar.

**Under-counting**
- `[CODE]` Comment at `config_defaults.py` L1010–1015: dashboard token and cost analytics "are a local LOWER-BOUND estimate, not billing — only successful main-agent responses with a response.usage count; auxiliary calls, retries, fallbacks and cache writes are missed, so the total can be **10x-100x under the provider bill**". For that reason `dashboard.show_token_analytics: false` by default.
- `[DOC]` The CLI cost shows `n/a` for proxies, relays and custom endpoints.
- `[NOTES]` Reported cases:
  - local tracking 2.3× under the DeepSeek bill (#87450);
  - reasoning tokens omitted, 55–75 % under on OpenRouter reasoning models (#68081);
  - cost always 0 for Anthropic and Google (#18304);
  - stale DeepSeek prices (#94221).
- **Rule:** reconcile with the provider dashboard; never budget on Hermes figures.

### 8.2 Hermes-side caps (no monetary cap exists)

- `[CODE]` A search of the code and `DEFAULT_CONFIG` found no USD or EUR budget or spend-limit key.
- The only money-based guards:
  - The expensive-model confirmation when known pricing exceeds **$20 per M input** or **$100 per M output** (`hermes_cli/model_cost_guard.py` L12–13).
  - `agent.empty_response_guard.cost_threshold_usd: 0.25`, which reduces empty-response retries.

**Turn and iteration caps**

| Key | Default | Notes |
|---|---|---|
| `agent.max_turns` | **`null` = unlimited** `[CODE]` (L78; `resolve_turn_limit` in `hermes_cli/config.py` L1891ff) | See the contradiction list below |
| `agent.budget_warning_ratio` | `null` | Needs a finite `max_turns` |
| `agent.run_budget_seconds` | `null` | Wall-clock per run; wrap-up notice at 80 %; CLI `--run-budget N` |
| `agent.gateway_timeout` | `1800` s | Inactivity |
| `agent.api_max_retries` | `3` | — |
| `agent.auto_recovery_cycles` | `5` | Transient-outage waits; only before any text is delivered |

**Contradictions for `agent.max_turns`**
- `cli-config.yaml.example` L1171–1174 ships `max_turns: 500` with the comment "(default: 500)".
- `configuration.md` L1220 says "default: 500 turns" right above "unlimited by default".
- `developer-guide/agent-loop.md` L184 says "Default: 500".
- `reference/environment-variables.md` L820 says `HERMES_MAX_ITERATIONS` "(default: 500)".
- **The code says unlimited.** Copying the example config silently sets 500.

**Loop and delegation caps**

| Key | Default | Notes |
|---|---|---|
| `goals.max_turns` | `20` | `/goal` continuation turns; the judge fails **open** (L1405–1409) |
| `loops.max_ticks` | `100` | `/loop`; minimum interval 30 s (L1413–1418) |
| `delegation.max_iterations` | `250` per child | `developer-guide/agent-loop.md` L185 wrongly says 50 |
| `delegation.max_concurrent_children` | `10` | — |
| `delegation.max_spawn_depth` | `1` (flat) | — |
| `delegation.child_timeout_seconds` | `0` = none | — |
| `delegation.oneshot_max_children` | `2` | — |
| `delegation.model` / `delegation.provider` | `""` = inherit | Set a cheaper model here |
| `tool_loop_guardrails.loop_caps` | `max_web_searches: 50`, `max_subagents: 50` **per turn** | — |
| `tool_loop_guardrails.non_interactive_hard_stop_enabled` | `true` | Gateway and cron hard-stop repeated failing or no-progress calls; Telegram is non-interactive (L553–577) |
| `approvals.denial_breaker_threshold` | `3` | Stops guardian-call churn |

**Cron caps**

| Key | Default | Notes |
|---|---|---|
| `cron.max_parallel_jobs` | `null` = **unbounded** `[CODE]` (`cron/scheduler.py` L4255–4265) | Docs conflict: `environment-variables.md` L808 says `HERMES_CRON_MAX_PARALLEL` "(default: 4)"; `cron-troubleshooting.md` says jobs run "sequentially" |
| `HERMES_CRON_TIMEOUT` | `600` s | Inactivity |
| `cron.script_timeout_seconds` | `3600` | — |
| `cron.preflight` | `true` | Blocks a misconfigured job before any LLM call ("never spends tokens") |
| `cron.model` / `cron.model_provider` | `""` | Pin a cheaper model for all unpinned jobs |

**Background self-improvement review** (on by default)
- `auxiliary.background_review: {enabled: true, provider: auto, model: ""}` (L814). It runs after turns on the **main model**.
- Trigger frequency:
  - `memory.nudge_interval: 10` (L1323);
  - `skills.creation_nudge_interval`, default **10**, read in code (`agent/agent_init.py` L1410–1413) but absent from `DEFAULT_CONFIG`.
- **Default per-review budget:** "75% of the window, capped at 600,000 tokens" (`memory.md` L418–420).
- Mitigations:
  - `auxiliary.background_review.max_input_tokens: 48000` (docs example);
  - a different, cheaper model ("~3–5× cheaper"; it replays a digest instead of the full transcript);
  - `enabled: false` (manual `/refine` still works).
- Usage is recorded in `session_model_usage` as `task='background_review'`. `agent.log` gets the line "Background review complete: … in=… out=…".

**Auxiliary tasks**
- Default `provider: auto` means the **main model** for compression, vision, title generation, the approval guardian, goal judge, curator and more (`configuration.md` L1391–1397).
- Route them to a cheap model per task: `auxiliary.<task>.provider` and `.model`.
- Pitfall `[CODE]` (L740–751): the auto-chain's fallback uses OpenRouter, defaulting to a **paid** `google/gemini-3.6-flash`, whenever `OPENROUTER_API_KEY` is set. `auxiliary.free_only: true` restricts it to `:free` models.
- Note: the curator's LLM consolidation is off by default (`curator.consolidate: false`).

**Context and caching**

| Key | Default | Notes |
|---|---|---|
| `compression.threshold` | `0.50` of the window | Windows under 512K are floored to 0.75. **On a 1M-context model nothing compresses until about 500K tokens per call** `[INFERENCE]`. |
| `compression.threshold_tokens` | `null` | Set an absolute cap, e.g. `150000`; the lower of the two applies (L590–594) |
| `prompt_caching.cache_ttl` | `"5m"` (L704) | `"auto"` uses 1 h for human-paced sessions (Telegram, CLI) and 5 m for machine-paced ones. The docs say it "cut the interactive cache-write bill by roughly 40%". 1 h writes cost 2×, 5 m writes 1.25× (L1370–1389). |
| `openrouter.response_cache` | `true` | Identical requests are free |

- **Doc contradiction:** `configuration.md` L1372 says Hermes attaches 1 h TTL breakpoints, but the default value is `"5m"`.

**Emergency stop**
- `hermes pause [--reason …]` and `hermes resume` act as a global stop for scheduled cron fires (`cron.md` L273–276).

### 8.3 What typically blows the budget (Hermes-specific, ranked) `[INFERENCE]` from the facts above

1. **Large context resent every call.** Unlimited turns, a 0.50 or 0.75 compression trigger, and a fixed system and tool overhead. Earlier notes `[NOTES]` measured about 14K tokens per call at v0.6.0. Check with `hermes prompt-size` and `/context all`; shrink with `hermes tools` and fewer skills. `tools.tool_search.enabled: auto` defers cold tools.
2. **Background review forks** on the main model, with up to 600K replayed tokens per review by default.
3. **Delegation fan-out.** Up to 10 parallel children × 250 iterations, each re-paying a cold system prompt. The docs: "the children are where the tokens go".
4. **Frequent LLM cron jobs.** Each is a fresh session at 5 m cache TTL; `max_parallel_jobs` is unbounded. Use `--no-agent` scripts or `wakeAgent` gates (`cron.md` L889–940, L1227–1330), plus `cron.model`.
5. **Credential pools and fallback chains routing around a capped key** (402 rotates to the next key, then to `fallback_providers`).
6. **Auxiliary tasks on an expensive main model**: approval guardian, compression, vision, titles, goal judge.
7. **Cache busting.** `/reload-mcp`, model switches, credential rotation and `compression.micro_compact: true` (off by default) all re-send the full prefix.
8. **Opt-in multipliers.** `/heartbeat` re-enters the whole session (minimum 60 s); `/loop`, `/goal`, and `/moa`. The default MoA preset uses `gpt-5.5`, `deepseek-v4-pro` and a `claude-opus-4.8` aggregator (`config_defaults.py` L1438–1446).
9. **High reasoning effort** (`xhigh`, `max`, `ultra`). Reasoning tokens bill as output and may be missing from Hermes' estimate `[NOTES]`.

Note: unlike OpenClaw, Hermes has **no default idle heartbeat**. Heartbeats are opt-in per session (`features/heartbeat.md`).

### 8.4 Provider-side hard limits (the only real spend cap)

**Hermes-documented facts** `[DOC]` (`integrations/providers.md` L134–150, "Subscription plans: what your plan pays for")
- **Claude Max via OAuth**: "All Hermes usage bills as 'extra usage'"; the base Max allowance is not consumed.
- **Claude Pro** cannot use the OAuth path; use `ANTHROPIC_API_KEY` instead.
- **ChatGPT/Codex OAuth**: plan-quota semantics "not currently documented".
- **Gemini consumer plans**: no path.
- **Nous Portal**: a monthly spend limit managed on the portal. Avoid auto-reload `[CODE]`; `hermes_cli/cli_billing_mixin.py` has the auto-top-up flows.

**General provider practice** `[GENERAL]` — verify the current UI wording in each console:
- **OpenRouter:** create a **dedicated API key per Hermes install with a credit limit**, and leave auto top-up off. `hermes usage --provider openrouter` shows the credits.
- **Anthropic Console:** a separate workspace for Hermes with a workspace **spend limit**; prepaid credits with auto-reload off.
- **OpenAI Platform:** a separate project; prepaid credits with **auto-recharge off**; project budget alerts.
- **Every key** in `credential_pool` and `fallback_providers` needs its own cap (§5.4).
- Set the hard cap at or below 200 € and a usage alert around 50–60 €. That leaves about 2–6.5 € per day.

### 8.5 Budget configuration sketch (all keys verified; values are suggestions `[INFERENCE]`)

```yaml
agent:
  max_turns: 100              # default unlimited; finite cap + grace call at exhaustion
  budget_warning_ratio: 0.8   # needs finite max_turns
prompt_caching:
  cache_ttl: auto             # 1h for Telegram/CLI, 5m for cron/subagents
compression:
  threshold_tokens: 150000    # cap context on big-window models
auxiliary:
  background_review:
    provider: openrouter      # or another cheap provider you have keyed
    model: "<cheap-model>"
    max_input_tokens: 48000
  approval:   {provider: openrouter, model: "<cheap-fast-model>"}
  compression: {provider: openrouter, model: "<cheap-model>"}
delegation:
  provider: openrouter
  model: "<cheap-model>"
  max_iterations: 60
  max_concurrent_children: 3
goals: {max_turns: 10}
loops: {max_ticks: 20}
tool_loop_guardrails:
  loop_caps: {max_web_searches: 25, max_subagents: 10}
cron:
  model: "<cheap-model>"
  model_provider: openrouter
  max_parallel_jobs: 2
fallback_providers: []        # or only capped accounts
display:
  show_cost: true             # estimate only
```

**Optional budget watchdog (zero LLM tokens)**
- Uses the documented `--no-agent` cron pattern (`cron.md` L889–910):
  ```bash
  hermes cron create "every 6h" --no-agent --script budget-check.sh --deliver telegram --name budget-watchdog
  ```
- The script, in `~/.hermes/scripts/`, would call `hermes usage --provider openrouter --json` and print a line only when credits fall below a threshold, because empty stdout means a silent tick.
- **Untested:** the JSON shape for OpenRouter is not documented (only a Codex example is shown), and access to `HERMES_HOME` from the script is unverified.

---

## 9. Reliability and maintenance

Sources:
- `website/docs/user-guide/features/cron.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/cron.md
- `website/docs/guides/cron-troubleshooting.md`
- `website/docs/user-guide/session-storage-recovery.md`
- `website/docs/getting-started/updating.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/updating.md
- `website/docs/reference/cli-commands.md`
- `website/docs/user-guide/messaging/index.md` L657–694
- `website/docs/user-guide/multi-profile-gateways.md` L1020–1050
- `scripts/install.sh` — https://github.com/NousResearch/hermes-agent/blob/main/scripts/install.sh
- `hermes_cli/update_channel.py` L139–176

### 9.1 Known reliability problems and built-in safeguards

**`state.db` (SQLite WAL)** `[DOC]`
- **Never** delete `state.db-wal` or `state.db-shm`, and never `cp state.db` alone.
- A "retired WAL" refusal means another process holds an old log. Fix:
  1. Stop *all* Hermes processes with `hermes gateway stop`, quitting Desktop, and `hermes dashboard --stop`.
  2. Run `hermes doctor` until it shows no holders.
  3. Restart one process.
- Damaged file: `hermes sessions recover --source ~/.hermes/state.db --inspect-only`, or restore from `state-snapshots/`.
- Maintenance commands (`hermes sessions optimize`, `optimize-storage`, `prune`) refuse to run under a live writer.
- On macOS, `database.synchronous` values below `FULL` are refused because of Darwin fsync reordering (`configuration.md` L114–117).
- WAL on virtiofs bind mounts can corrupt silently; see §4.6.

**Earlier-notes context** `[NOTES]`: a 44-issue `state.db` corruption, WAL and FTS fix campaign landed in v0.21.2 (2026-09-11). Not verifiable here.

**Cron after upgrades** `[DOC]` (`cron.md` L410–425)
- "A run that fails before the agent is reached at all — a bad import after a half-applied update, a provider client that cannot be constructed — counts and alerts the same as one the agent itself failed."
- This addresses the "silent failure after upgrade" class; #114690 is `[NOTES]`, not verifiable here.
- An interrupted cron run counts as a permanent failure. `agent.cron_drain_timeout: 30` protects runs during restarts.

**Gateway watchdogs** `[CODE]`, `config_defaults.py` L119–296 (agent block) and L2101–2205 (gateway block)

| Setting | Default | What it does |
|---|---|---|
| `gateway.loop_watchdog` | `true` | Hard-exits with code 75 after about 90–120 s of a blocked event loop, so launchd's KeepAlive restarts the process |
| `gateway.startup_watchdog` | `true` (300 s) | Hard-exits if the loop is not live within the deadline |
| `gateway.restart_loop_guard` | `3` restarts / `60` s | Breaks auto-resume crash loops |
| `gateway.respawn_storm` | `5` starts / `120` s | Backoff before booting |
| `agent.turn_liveness.timeout_s` | `600` | Interrupts a wedged turn |
| `agent.session_stall_timeout` | `300` | Notify only |
| `gateway.reconnect_attention_after` | `7200` s | Flags a platform as `needs_attention` |
| `gateway.delivery_ledger` | `true` | At-least-once redelivery of final replies after a crash |

### 9.2 Monitoring

**Logs** `[DOC]`
- Location: `~/.hermes/logs/`: `agent.log` (INFO+), `errors.log` (WARNING+), `gateway.log`, `gui.log`, `desktop.log`, `mcp-stderr.log`, `update.log`, `dashboard-auth.log`; `update_receipts/` holds the last 20 receipts plus `latest.json`.
- Command: `hermes logs [agent|errors|gateway|…] [-f] [--level WARNING] [--since 1h] [--component cron]`.
- Rotation: `logging: {level: INFO, max_size_mb: 5, backup_count: 3}`.

**Health and status**
- `hermes status [--full] [--deep]`;
- `hermes gateway status`;
- `hermes doctor` (exit 1 if problems remain; `--fix`).

**Cron health** `[DOC]` (`cron.md` L336–543)

| Command | What it does |
|---|---|
| `hermes cron status` | Scheduler alive, last tick, flags OVERDUE jobs |
| `hermes cron list` | Status, `last_error`, failure streak |
| `hermes cron doctor` | Read-only; **exit 1 on findings**, so it can serve as a watchdog |
| `hermes cron incidents [--state alerted]` / `hermes cron incidents ack <id>` | Durable failure records |
| `hermes cron runs` | Attempt ledger |
| `hermes cron tick` | Manual tick |

**Cron failure alerts** `[DOC]` and `[CODE]`
- The first failure of a given error signature is always delivered.
- Repeats are suppressed until `cron.failure_repeat_alert_hours: 6` passes.
- `cron.failure_nudge_threshold: 3` adds a review nudge to the alert.
- `cron.retry_unreachable: true` re-runs after 5, 15 and 30 min when the model was unreachable before any call, for example right after the Mac wakes.
- `cron.preflight: true` gives `blocked_config` plus one alert.
- `cron.delivery.notify: true` makes deliveries ring.
- **Silent-drop pitfalls:**
  - A wrong delivery target "silently drops the response".
  - `[SILENT]` in output suppresses delivery.
  - An empty `no_agent` stdout means a silent tick.

**OTLP export** `[CODE]`
- `monitoring.gateway_health_export.enabled: false` by default; exports content-free health data.

**Health check from outside** `[GENERAL]`
- A dead-man's-switch ping (an external heartbeat URL) from a `--no-agent` cron job catches the case where the gateway itself is down.
- `hermes cron doctor` cannot run if the gateway host is off.

### 9.3 macOS operations

**Service** `[DOC]` (`messaging/index.md` L657–694)
- Commands: `hermes gateway install` (LaunchAgent `~/Library/LaunchAgents/ai.hermes.gateway.plist`, `RunAtLoad`), `start`, `stop`, `status`.
- The plist snapshots `PATH`, `VIRTUAL_ENV` and `HERMES_HOME`. Re-run `hermes gateway install` after installing new tools.
- Logs: `tail -f ~/.hermes/logs/gateway.log`.
- **It is a per-user LaunchAgent.** The code picks the `gui/<uid>` domain, or `user/<uid>`, "the recommended domain on macOS 26+" (`hermes_cli/gateway_launchd.py` L31–54).
- There is no documented system-wide LaunchDaemon. `nix-setup.md` L675: "A `launchd` agent with `RunAtLoad` starts at login".

**Login requirement** `[INFERENCE]`
- The dedicated user must be logged in (Fast User Switching keeps the session alive) for the gateway, and for Docker Desktop or OrbStack, to run after a reboot.

**Restarts** `[DOC]`
- `hermes gateway restart` drains first, waiting up to `agent.restart_after_turn_timeout: 1800`.
- `launchctl kickstart -k gui/$UID/ai.hermes.gateway` interrupts immediately.

**Sleep** `[DOC]` (`multi-profile-gateways.md` L1020–1050)
- `caffeinate -dis` (persistent: `nohup caffeinate -dis >/dev/null 2>&1 &`).
- Check with `pmset -g assertions`.
- Avoid `-u`, because it prevents the screen lock `[INFERENCE]`.
- `[GENERAL]` Prefer the Energy settings ("Prevent automatic sleeping when the display is off" and "Start up automatically after a power failure").

**Missed cron fires** `[DOC]`
- `cron.catch_up_missed: true` runs a missed slot once after downtime, collapsing a long outage into one run.

### 9.4 Updates (safe strategy)

**Install methods and their update channels** `[DOC][CODE]`

| Install | Updates via | Channel |
|---|---|---|
| `curl -fsSL https://hermes-agent.nousresearch.com/install.sh \| bash` (source checkout in `~/.hermes/hermes-agent/`) | `hermes update` | **`origin/main`**. The installer uses `BRANCH="main"` (`scripts/install.sh` L24). The docs say "Source installs track `main`, the only valid source channel" (`updating.md` L32–33). `--set-channel` / `--channel`: "`main` is the only valid one" (`cli-commands.md` L2007–2008). |
| macOS Desktop app (DMG) | In-app update (electron-updater) | **Stable vs. canary are separate apps.** The canary has a yellow icon and the `hermes-canary` CLI. |
| Docker image | Pull and recreate | `stable`/`latest`, `X.Y.Z`, or a digest; `main` = development |

**Channel nuance** `[CODE]`
- `hermes_cli/update_channel.py` and `hermes_cli/source_check.py` contain release-channel resolution for source installs. A channel can map to a pinned commit.
- `install.sh` accepts `--commit SHA`, but the SHA must be an ancestor of `origin/main`.
- Whether a source install can follow "stable" is **undocumented and unverified**. Rely on the documented channels.

**What `hermes update` does** `[DOC]` (`updating.md` L91–103)
1. A quick pre-update snapshot of state files into `state-snapshots/`.
2. Pull the code.
3. A syntax check with **auto-rollback**: `git reset --hard <pre-pull-sha>` if the critical files do not parse.
4. Dependency preparation. A plugin that no longer fits is **disabled** with a warning.
5. Config migration prompts.
6. Desktop rebuild.
7. Gateway restart through launchd.

Receipts go to `~/.hermes/logs/update_receipts/`. A mixed-version fleet makes the update exit non-zero.

**Before and after** `[DOC]`
- Before: `hermes update --check` (compare against `origin/main`) and `hermes update --plan` (read-only).
- Full backup for one run: `hermes update --backup`; permanently: `updates.pre_update_backup: full` (default `quick`; `off` is possible); `updates.backup_keep: 5`.
- After: `git status --short`, `hermes doctor`, `hermes --version`, `hermes gateway status`, `hermes pm status`.

**Rollback** `[DOC]`
- "A code checkout alone is not a data rollback. Newer releases can migrate configuration or databases in ways older code cannot read."
- Keep a coherent backup from before the update.

**Messaging and passive checks**
- `/update` from Telegram pulls and restarts.
- `updates.check: false` silences passive update banners.

**Recommendation** `[INFERENCE]`
- Do not auto-update. Update manually after reading the release notes; `[GENERAL]` wait a few days after a release.
- Use `pre_update_backup: full` and the `--plan` and `--check` previews, then the validation steps.
- Prefer the stable Desktop app or a pinned Docker tag if you want to stay on releases.
- Security fixes land on `main` first; follow the GitHub releases and advisories.

### 9.5 Backups `[DOC]` (`cli-commands.md` L1102–1180; `faq.md` L841–875)

**`hermes backup`**
- Flags: `-o PATH`, `-q`/`--quick`, `-l LABEL`, `-k N` (default 3).
- Writes a consistent SQLite copy via `sqlite3.backup()`, safe while running.
- **The archive includes `.env` and `auth.json`.**
- Excludes: code, models and runtimes, checkpoints, earlier backups and snapshots, browser profiles, WAL sidecars and sockets.
- Exit codes: 1 = incomplete (`--keep` pruning is skipped), 2 = another backup is running.

**`hermes import <zip> [-f]`**
- Stop the gateway first.
- The import CRC-checks every member before writing, and writes databases page-wise into the live file.
- It warns when an older backup replaces newer sessions.

**Other recovery tools**
- `/snapshot [create|restore <id>|prune]` (CLI) for state snapshots.
- `state-snapshots/` (made by update and quick backups) restores state files, not code.

**What to back up**
- The whole `HERMES_HOME` of the agent user: `config.yaml`, `.env`, `auth.json`, `state.db`, `memories/`, `skills/`, `cron/`, `pairing/`, `vault/`, `home/` (credentials of tool CLIs), `hooks/`, `scripts/`, `SOUL.md` and plugins.
- Plus any project repos not yet pushed.

**Practice** `[GENERAL]`
- Store backup zips only on an encrypted volume, because they contain secrets.
- Time Machine to an **encrypted** disk adds a second layer.

---

## 10. Known vulnerabilities and the minimum safe version

**Verified locally (repo evidence)**

| Item | Evidence |
|---|---|
| Disclosure process | GHSA private reporting or security@nousresearch.com; no bug bounty; 90 days (`SECURITY.md` §1, §5) |
| "June 2026 hermes-0day / MCP-config persistence campaign" | Exposed dashboards and API servers led to an SSH-key backdoor. Fix: dashboard auth is mandatory on non-loopback binds and `--insecure` is a no-op (`docker.md` L172–176; `web_server.py` L517–523, L1168–1176). |
| Telegram webhook secret now required | `GHSA-3vpc-7q5r-276h` (`telegram.md` L372; `environment-variables.md` L329). The doc links to `github.com/NousResearch/hermes-agent/security/advisories/GHSA-3vpc-7q5r-276h`. This **contradicts** the earlier note that the repo shows "no published security advisories". |
| Malicious-repo git-config execution (fsmonitor, hooks, filters) | Hermes now pins `core.fsmonitor=false` and disables hooks and pagers in its non-interactive git env (`hermes_cli/_subprocess_compat.py` L266–271, L414–441; `GHSA-7x36-8jrh-v4pw` referenced in `hermes_cli/worktree_gc.py` L75). Consistent with the earlier notes' CVE-2026-71963. |
| Other GHSA IDs referenced in code fixes | `GHSA-rhgp-j443-p4rf` (skill env-passthrough credential bypass), `GHSA-ppp5-vxwm-4cf7` (dashboard DNS rebinding Host check), `GHSA-5qr3-c538-wm9j`, `GHSA-mcfc-hp25-cjv7` (dashboard plugins), `GHSA-rxqh-5572-8m77` (email From spoofing), `GHSA-96vc-wcxf-jjff` (ACP auto-approve), `GHSA-2fmg-cjqm-hhrj` (webhook), `GHSA-qg5c-hvr5-hjgr` (approval in thread context), and others. Severities are unknown locally. |
| Still open on `main` | The Skills Guard invalid-UTF-8 skip (§7.1). |

**From the earlier notes** `[NOTES]` — search-snippet based, not verifiable here:
- **CVE-2026-82021** (Critical 9.0): MCP catalog referenced via a mutable branch. Fixed in 0.19.0.
- **CVE-2026-71963** (High 8.6 v4): RCE via a malicious repo's `.git/config` `core.fsmonitor`. Affects 0.18.2–0.21.0; fixed in commit `f6234d0`.
- **CVE-2026-53869** (High): DNS rebinding in WebSocket endpoints. Fixed in 0.16.0.
- **CVE-2026-53870** (Moderate): world-readable `response_store.db` and `webhook_subscriptions.json` before 0.16.0.
- **CVE-2026-82020** (High): path restriction, 0.16.0–0.17.0.
- Earlier ones (CVE-2026-7112, -7396, -9366, -9368, -11461, -10223) affected ≤0.15.
- The **April 2026 audit (#7826)** and the **2026-10-02 full-code audit (#131566, 403 findings)** are also `[NOTES]`.

**Minimum safe version** `[INFERENCE]`
- The newest affected range in the notes ends at 0.21.0.
- Recommendation: **at least v0.21.5 (the latest stable, 2026-09-24)**, or a current `main` (the `install.sh` default).
- A Docker image pinned to an older tag should be bumped.

**Practical consequence of `SECURITY.md` §3.2**
- Heuristic bypasses (approval regex, redaction, Skills Guard) and prompt injection never get advisories. Users must not wait for CVEs before tightening the OS-level posture.

---

## 11. macOS baseline hardening (mostly `[GENERAL]`, not from Hermes docs)

### 11.1 Hermes-docs facts relevant to macOS

**Platform support** `[DOC]` (`getting-started/platform-support.md` L17–23; `installation.md` L17–40)
- macOS on Apple Silicon is Tier 1, via Hermes Desktop or `install.sh`.
- The macOS DMG is Apple Silicon only.

**Dedicated service user** `[DOC]` (`installation.md` L184–210)
- "Run the source installer as the intended service user. Its home, tool store, configuration, and launcher must belong to that user."
- An administrator installs the prerequisites (Git and the rest) first.

**Optional components installed by default** `[DOC]` (`installation.md` L66–84)
- `install.sh` installs `agent-browser` with Chromium and **`cua-driver`** (computer use) by default.
- `--skip-browser` and `--skip-computer-use` leave them out, and later installs and updates remember that choice.
- **Recommendation:** use `--skip-computer-use` unless you deliberately need GUI automation.

**Full Disk Access tip** `[DOC]` (`desktop.md` L767–835)
- The docs *recommend* granting **Full Disk Access** to the terminal app and Hermes.app "to silence every folder prompt".
- `hermes doctor` reports whether the grant exists.
- **Security conflict** `[INFERENCE]`: FDA gives the agent your Mail, Messages and Safari data. **Do not follow this tip on an assistant that processes untrusted email and web content.** Under a dedicated user it matters less, but stays unnecessary.

**Computer use** `[DOC]` (`features/computer-use.md` L101–106; `cli-commands.md` L1682–1697)
- Needs **Accessibility + Screen Recording** for CuaDriver (`com.trycua.driver`).
- Commands: `hermes computer-use permissions status|grant`; reset with `tccutil reset Accessibility com.trycua.driver`.
- Off unless the `computer_use` toolset is enabled.

**Apple skills** `[DOC]`
- The iMessage skill needs Full Disk Access for the terminal plus Automation for Messages.
- The FindMy skill needs Screen Recording. Avoid both on this setup.

**TCC grants and signing identity** `[DOC]`
- macOS keys TCC grants to the code-signing identity.
- `hermes desktop --setup-tcc-identity` creates a stable self-signed identity so grants survive updates.
- `tccutil reset All com.nousresearch.hermes` resets them.

### 11.2 Checklist `[GENERAL]` (not from Hermes docs; verify on your macOS version)

1. **Dedicated Standard user** (not admin), for example `hermes`.
   - Install and run Hermes, its gateway and the Docker engine (Docker Desktop or OrbStack) in that account.
   - No Apple ID/iCloud, no personal Keychain items, no browser logins, no personal password-manager CLI.
   - The owner keeps a separate admin account.
   - Keep the agent session alive with Fast User Switching and lock the screen.
2. **FileVault on.** Session transcripts in `state.db`, `.env`, backups and `vault/` are plaintext to the OS user.
   - FileVault disables automatic login, so after a power cut the Mac waits for the unlock password.
   - Use `sudo fdesetup authrestart` for planned reboots and consider a UPS.
   - Unlocking FileVault remotely over SSH on newer macOS is reported but **unverified**.
3. **Firewall** on (System Settings → Network → Firewall), with stealth mode.
   - Nothing needs inbound access: Telegram is outbound polling.
   - No router port-forwards.
4. **Privacy permissions (TCC) for the agent account.**
   - **Do not grant** Full Disk Access, Accessibility, Screen Recording, Input Monitoring or Camera/Microphone, unless a specific feature needs it.
   - Grant **Automation** (Apple Events) only per app, and only if you use the Apple Notes/Reminders/Calendar skills.
   - Prefer a dedicated or shared calendar in that account over your main account.
   - Remember that "Local Network" does not restrict the gateway (§4.5).
5. **Secrets.**
   - `.env` stays `0600` (Hermes enforces this).
   - Optionally use a 1Password service account limited to one Hermes-only vault, or Bitwarden SM (§5.2).
   - Native Keychain integration is not a Hermes feature.
   - Turn off `auth.adopt_external_logins`.
6. **Remote access only over Tailscale.**
   - Use macOS Remote Login (SSH) with **keys only**: put `PasswordAuthentication no` and `KbdInteractiveAuthentication no` in an `/etc/ssh/sshd_config.d/*.conf` drop-in. This also silences Hermes' startup audit warning.
   - Allow only the needed users.
   - Use tailnet ACLs.
   - Manage Hermes through the Desktop app's SSH connection or an SSH tunnel to `127.0.0.1:9119`. Never use a public dashboard.
7. **Updates.**
   - Turn on automatic macOS security updates.
   - Keep Docker Desktop or OrbStack updated.
   - Update Hermes deliberately (§9.4).
8. **Energy.** Configure no system sleep, auto-restart after a power failure and wake for network (Energy settings, or `caffeinate` per §9.3).
9. **Docker Desktop.**
   - Limit File Sharing to the mounted project directories.
   - Never expose the daemon on TCP.
   - Set CPU and memory limits.
10. **Telegram account.**
    - Turn on two-step verification (a cloud password) and review active sessions regularly.
    - Keep the bot token secret; rotate it with BotFather `/revoke` if it leaks.
11. **Separate service accounts.**
    - Give the agent its own or delegated calendar and email access with the narrowest scopes.
    - The Google Workspace skill's `--services email,calendar` limits consent scopes (`productivity-google-workspace.md` L75–87).
    - Note that the skill's OAuth token (`google_token.json`) is mounted read-only into the Docker sandbox, so code there can read it.

---

## 12. GitHub access for coding (least privilege)

**Hermes facts** `[DOC]`/`[CODE]`

**Default GitHub skill auth guidance is broad**
- The bundled GitHub skill's auth reference (`skills/software-development/github/references/auth.md` L41–55; https://github.com/NousResearch/hermes-agent/blob/main/skills/software-development/github/references/auth.md) tells the agent to have the user create a **classic PAT** with **`repo` (full), `workflow` and `read:org`** scopes.
- It stores the PAT with `git config --global credential.helper store` (**plaintext** `~/.git-credentials`), or embeds it in the remote URL.
- The device flow requests `repo,read:org,gist` (L168).
- **This conflicts with least privilege.** Do not let the agent run this flow unattended.

**Copilot provider**
- Accepts fine-grained PATs (`github_pat_*`) but not classic ones (`environment-variables.md` L29).

**Environment handling**
- `GH_TOKEN` and `GITHUB_TOKEN` in `.env` are always stripped from subprocess environments (Tier 1, §5.1).
- Forward one deliberately into the Docker sandbox: `terminal.docker_forward_env: ["GITHUB_TOKEN"]` (`configuration.md` L666–681). Anything forwarded is readable by code in the container.
- `GH_TOKEN` cannot be added to `env_passthrough`; it is blocked as a provider credential.

**Other uses of a configured `GITHUB_TOKEN`/`GH_TOKEN`**
- `hermes doctor` sends it to `api.github.com`.
- It is also used for Skills-hub rate limits and plugin and catalog installs (`plugins.md` L228–245; `skills.md` L935–938).

**Local backend note**
- On the local backend with `terminal.home_mode: auto` (default), tool subprocesses use the **real `HOME`**. The agent therefore uses (and can read, for example with `gh auth token`) whatever `gh` or git login exists in that account.
- `home_mode: profile` isolates CLI credentials per profile (`configuration.md` L305–343).

**Git safety built in**
- Force push, `reset --hard`, `clean -f` and `branch -D` are flagged; a plain `git push` is not (§3.6).
- Hermes-created worktrees (`hermes -w`, `/worktree new`, kanban and subagents) and Hermes' internal git calls disable the repo's hooks, `core.fsmonitor` and filters (`git-worktrees.md` L174; `_subprocess_compat.py`).
- `[NOTES]` CVE-2026-71963 was exactly this vector.
- `[INFERENCE]` Repo hooks still run when the agent itself runs plain `git` in the terminal. This is another reason for the Docker sandbox when cloning untrusted repos.

**Recommended practice** `[GENERAL]`
1. A **fine-grained PAT**, ideally on a dedicated GitHub machine account added as a collaborator, or on your own account, with these settings:
   - Repository access: **only the one repo**.
   - Permissions: Contents read/write, Pull requests read/write, Metadata read (mandatory); Issues optional.
   - **No** Administration, Workflows, Secrets/Variables, Actions-write or Environments.
   - Expiry 30–90 days.
2. **Branch protection or rulesets on `main`**: require a PR plus your review; block force pushes and deletions. The agent pushes only `hermes/*` feature branches.
   - Without the Workflows permission, the agent cannot modify `.github/workflows/`, which protects CI secrets.
3. Put the PAT in the agent user's `~/.hermes/.env` as `GITHUB_TOKEN`.
   - Forward it only into the Docker sandbox via `docker_forward_env`.
   - Inside the sandbox, `gh` and `git` use it (`gh auth setup-git` per the skill reference).
   - Never use `credential.helper store` on the host, and never log the owner's GitHub account into the agent user.
4. Add `approvals.deny: ["git push --force*", "git push * --force*", "*curl*|*sh*"]`.
   - Add the §3.9 hook so that `git push` and `gh pr merge` ask on Telegram.
   - Run `hermes approvals test -- git push --force origin main` to confirm the rule.
5. Work in worktrees or branches; commit early. `/rollback` is unavailable on the Docker backend.

---

## 13. Contradictions and unverifiable items (consolidated)

**Contradictions**

| # | Topic | Statement A | Statement B | What wins |
|---|---|---|---|---|
| 1 | `agent.max_turns` default | Unlimited (code; `configuration.md` L1234) | 500 (`cli-config.yaml.example` L1171–1174; `configuration.md` L1220; `agent-loop.md` L184; `environment-variables.md` L820) | **Code: unlimited.** Copying the example config sets 500. |
| 2 | `delegation.max_iterations` | 250 (code, `delegation.md`, example config) | 50 (`agent-loop.md` L185) | 250 |
| 3 | Cron parallelism | Unbounded (code `cron/scheduler.py` L4255; `config_defaults.py` "None/0 = unbounded") | 4 (`environment-variables.md` L808) / "sequentially" (`cron-troubleshooting.md`) | Unbounded |
| 4 | Hardline blocklist "regardless" | Always applies (`security.md` L133–142) | **Skipped on the container fast path**; only `approvals.deny` remains (`approval.py` L1084–1085, L1175–1180) | Code |
| 5 | Docker approval skip | Docs: "skipped" on docker | Code: only when no host bind mounts | Code |
| 6 | `execute_code` confinement | `SECURITY.md`: a host subprocess, not confined | `code-execution.md` L207 and `code_kernel_remote.py`: kernel runs inside the Docker/SSH/Modal backend | Code; keep `SECURITY.md` as the conservative baseline |
| 7 | Unknown DMs | Docs: `pair` by default | Code: `ignore` whenever any allowlist is configured | Code |
| 8 | Prompt cache TTL | `configuration.md` L1372: Hermes attaches 1 h TTL | Default `prompt_caching.cache_ttl: "5m"` (`config_defaults.py` L704; same doc L1382) | Default `"5m"` |
| 9 | Checkpoint trigger | "once per turn (on the first write_file/patch call)" (`config_defaults.py`) | Also before destructive terminal commands (`checkpoints-and-rollback.md`) | Unresolved |
| 10 | Desktop remote backend | `hermes serve` (`desktop.md` L457) | `hermes dashboard` (`web-dashboard.md` L172) | Unresolved |
| 11 | `docker-compose.windows.yml` | Uses `--insecure --host 0.0.0.0` | `--insecure` is a no-op and a non-loopback bind without a provider exits at startup | Stale example |
| 12 | Quote in `guides/secure-hermes-on-a-work-machine.md` | Quotes `security.md` ("Deny rules are a guardrail against an honest-but-wrong agent…") | That text is no longer in `security.md`; the current wording is "a shell-command policy…" | Minor |
| 13 | Earlier-notes claim | "No published security advisories" | The docs link a repo GHSA (`GHSA-3vpc-7q5r-276h`) | Repo docs |
| 14 | Source update channel | Docs: "`main` is the only valid source channel" | Code contains release-channel (stable/canary) resolution for source installs | Docs as user-facing truth; code path unverified |
| 15 | Undocumented in the reference | `hermes approvals test` (exists in code) | `skills.creation_nudge_interval` (read in code, default 10, not in `DEFAULT_CONFIG`) | Code |

**Unverifiable here (no network, no GitHub API)**
- issues #114690, #132192, #90789, #87450, #68081, #18304;
- the CVE severities and fixed versions;
- the v0.21.x release notes;
- the exact diff between `main` and v0.21.5;
- OrbStack and colima behaviour for the terminal backend;
- the OpenRouter JSON shape of `hermes usage --json`;
- the current UI wording of provider spend-limit features;
- macOS 26 FileVault SSH unlock.

---

## 14. Hardening and cost-control checklist

Verified items cite the sections above. `[GENERAL]` marks practices that do not come from the Hermes docs.

**Install and OS**
- [ ] `[GENERAL]` Create a dedicated Standard macOS user for Hermes; FileVault on; firewall on with stealth mode; no FDA, Accessibility or Screen Recording; Automation per app only (§11).
- [ ] Install as that user (`installation.md` L184–210). Use `--skip-computer-use` unless needed. Pin `terminal.cwd` to a dedicated workspace.
- [ ] Choose the update channel deliberately. `install.sh` follows `main`; the Desktop app and Docker image have stable channels (§9.4).
- [ ] Set `updates.pre_update_backup: full`. Before updating run `hermes update --check` and `--plan`; afterwards run `hermes doctor` and `hermes gateway status`. Do not use `/update` blindly from chat.

**Isolation and approvals**
- [ ] Set `terminal.backend: docker`, `docker_forward_env: []` (or only a repo-scoped `GITHUB_TOKEN`), and resource limits. Mount no host paths for max isolation, or exactly one project directory to keep approvals active (§4.1–4.2).
- [ ] Set `approvals.mode: manual` to start; `cron_mode`, `single_query_mode` and `unattended_mode` at `deny`; `timeout: 300`.
- [ ] Add `approvals.deny` for `git push --force*` and `*curl*|*sh*`, and test them with `hermes approvals test -- …`.
- [ ] Never use `approvals.mode: off`, `/yolo` or `GATEWAY_ALLOW_ALL_USERS`. Audit `command_allowlist` regularly, because "always" also applies in cron.
- [ ] Add a `pre_tool_call` hook that escalates sends, pushes and merges to human approval, and approve it once interactively (§3.9).
- [ ] Optionally set `memory.write_approval: true` and `skills.write_approval: true` if the agent ingests email or web content. Keep `security.protected_instruction_files: true` (default).
- [ ] Keep `security.allow_private_urls: false`, `skills.inline_shell: false` and `plugins.auto_apply: false`. After setup, set `security.allow_lazy_installs: false`.

**Telegram and exposure**
- [ ] `TELEGRAM_ALLOWED_USERS=<own id>`; DM only; no groups. Optionally `unauthorized_dm_behavior: ignore` explicitly.
- [ ] `[GENERAL]` Protect the Telegram account with two-step verification.
- [ ] Leave the API server and webhooks off. Keep the dashboard on 127.0.0.1 and reach it via the Desktop SSH connection or an SSH tunnel over Tailscale. Never use a public bind with only basic auth (§6.6–6.7).
- [ ] `[GENERAL]` Remote Login with SSH keys only (`PasswordAuthentication no`); Tailscale ACLs; no port forwards.

**Supply chain**
- [ ] Use only builtin and official skills, or read third-party skill code yourself, because the scanner skips undecodable files (§7.1).
- [ ] Use only catalog or trusted MCP servers. Filter tools with `tools.include`/`exclude`, and run `hermes security audit` periodically.
- [ ] Use catalog plugins pinned by SHA; consider `plugins.isolation: host`; audit `~/.hermes/hooks/`.

**Secrets**
- [ ] Keep keys in `~/.hermes/.env` (`0600`), never in `config.yaml`.
- [ ] Set `auth.adopt_external_logins: false`.
- [ ] If you use 1Password, use a service account limited to one Hermes-only vault.
- [ ] `[GENERAL]` Store backup zips on encrypted storage only; they contain `.env` and `auth.json`.

**Costs**
- [ ] `[GENERAL]` Set a provider-side hard cap at or below 200 € on a **dedicated key**, with auto-reload or top-up **off** and an alert around 60 €. Cap every key in pools and fallbacks, or keep `fallback_providers: []` (§8.4).
- [ ] Set a finite `agent.max_turns` (for example 100); `delegation.max_iterations` 60 and `max_concurrent_children` 3 with a cheap `delegation.model`; `goals.max_turns` 10; `loops.max_ticks` 20; smaller `tool_loop_guardrails.loop_caps`.
- [ ] Set `auxiliary.background_review.max_input_tokens` (for example 48000) and/or a cheap review model; route `auxiliary.approval` and `auxiliary.compression` to cheap models.
- [ ] Set `compression.threshold_tokens` (for example 150000) on large-window models, and `prompt_caching.cache_ttl: auto`.
- [ ] Use `cron.model` (cheap), `cron.max_parallel_jobs: 2`, `--no-agent` or `wakeAgent` gates for watchdogs, and create new jobs `--paused` to test them first.
- [ ] Review spend weekly in the **provider dashboard**. Treat `/usage`, `hermes insights` and the dashboard as lower-bound estimates.
- [ ] In an emergency: `hermes pause` stops all scheduled fires.

**Monitoring and backups**
- [ ] Check weekly: `hermes cron doctor` (exit 1 means findings), `hermes cron incidents`, `hermes logs errors --since 24h`.
- [ ] Back up `HERMES_HOME` with `hermes backup -o <encrypted path> -k 7` on a schedule. Restore with `hermes import <zip>` after `hermes gateway stop`.
- [ ] Never delete `state.db-wal` or `state.db-shm` and never copy `state.db` alone. If writes are refused, follow `session-storage-recovery.md`.
