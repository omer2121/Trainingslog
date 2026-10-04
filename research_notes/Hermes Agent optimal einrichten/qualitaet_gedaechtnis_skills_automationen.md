# Hermes Agent: quality, memory, skills, tools and automations (research notes)

These are research notes, written in English, for a German step-by-step guide: "Hermes Agent optimal einrichten". The reader runs Hermes on an always-on Apple-Silicon Mac (for example a Mac mini). They use Telegram as the main interface, want maximum output quality and have a model budget of about 60–200 € per month. They have four use cases:

- (a) personal assistant
- (b) research and knowledge
- (c) maintaining a small GitHub web app
- (d) automations, including monitoring and possibly a smart home

The notes cover output quality and effectiveness. Installation, providers and model choice, and gateway setup are covered by sibling notes and appear here only where they affect quality.

---

## 0. Sources, versions, how to read these notes

- **Primary source.** A local shallow clone of `NousResearch/hermes-agent`, branch `main`, commit `1298c8e` (2026-10-04). It includes the docs in `website/docs/`, `cli-config.yaml.example`, the root `SOUL.md`, `skills/`, `optional-skills/`, `optional-mcps/`, `plugin-catalog/` and the source code. Nothing in the clone was modified.
- **How citations work.** `path Lx-y` means https://github.com/NousResearch/hermes-agent/blob/main/path, lines x–y as of commit 1298c8e. `main` moves, so the line numbers may drift. Appendix A lists every cited path with its full URL.
- **Version caveat.**
  - Latest stable is v0.21.5 (tag `v2026.9.24`, 2026-09-24). The clone has depth 1, no tags and no changelog, and the GitHub release API was not reachable from this session. So I could not determine which `main` features are already in v0.21.5.
  - Version markers I did find:
    - The `homeassistant` plugin needs `requires_hermes: ">=0.21.5"` (`plugin-catalog/homeassistant.yaml`).
    - The `microsoft365` community plugin is pinned to `">=0.21.3,<0.22"` (`plugin-catalog/microsoft365.yaml`).
    - Session auto-prune is "on by default since #54189" (`website/docs/user-guide/sessions.md` L1077).
    - Source installs track `main` (`website/docs/getting-started/updating.md`).
  - **Advice for the guide.** Tell readers to confirm any flag with `hermes <command> --help` on their own install.
  - **Release-note markers** (taken from the earlier background note `/home/user/Trainingslog/research_notes/Autonome KI Assistenten wie Hermes/hermes_agent.md`; secondary, not re-verified here):
    - v0.17.0 (tag `v2026.6.19`): curator LLM consolidation off by default.
    - v0.18.0: `/journey`.
    - v0.21.0 (tag `v2026.8.31`): cron jobs keep persistent memory between runs ("Your 9am briefing job now knows what it told you yesterday."), and protected instruction files (AGENTS.md, skills, memory) require write approval for file-tool writes. In the current code this is `security.protected_instruction_files: True` in `hermes_cli/config_defaults.py`.
    - Everything else in these notes may be main-only.
- **Not executed.** Hermes was not run here: Python dependencies were missing and nothing was installed. So there are no measured prompt sizes. Wherever a number matters, the guide should tell the reader to measure it (Section 6.1).
- **Tags used in the text:**
  - **[DOC]**: stated in the docs.
  - **[CODE]**: verified in source code.
  - **[REC]**: my recommendation, derived from the cited facts.
  - **[CONFLICT]**: docs contradict docs or code. All conflicts are collected in Section 14.
  - **[UNVERIFIED]**: not confirmed in the repo.

---

## 1. Profile, priorities and where tokens go

**Fixed facts for this profile:**

- **The gateway runs as a launchd user service on macOS.**
  - `hermes gateway install` snapshots the shell PATH into the plist. Re-run `hermes gateway install` and then `hermes gateway start` after brew-installing any CLI the agent should use, such as `remindctl`, `memo`, `imsg`, `gh`, `ffmpeg` or `claude` (`website/docs/reference/faq.md` L514-529) [DOC].
  - To keep the Mac awake, the docs give `caffeinate -dis` (persistent: `nohup caffeinate -dis >/dev/null 2>&1 &` then `disown`) or `caffeinate -i -w $(cat ~/.hermes/gateway.pid) &`. They warn that lid-close still sleeps a MacBook (`website/docs/user-guide/multi-profile-gateways.md` L1018-1050) [DOC].
  - Cron needs the gateway running. The scheduler is the gateway's ticker, and missed slots catch up once by default (`cron.catch_up_missed: true`) (`website/docs/user-guide/features/cron.md` L1057-1080) [DOC].
- **A Telegram chat is one continuous session.** It survives restarts and reboots and never resets on its own. Memory quality therefore depends on the user creating session boundaries (`/new`), see Section 3.6 [DOC].

**Where tokens go,** so the budget is spent on quality and not on waste:

| Cost driver | Why | Lever |
|---|---|---|
| Fixed prompt per API call (system prompt, skills index, memory, tool schemas) | Sent on every call, but mostly cached | Measure with `hermes prompt-size`. Tool search defers cold tools. Remove unused toolsets per platform (Section 6) |
| Long never-reset Telegram sessions | Each turn carries a large compacted prefix | `/new` at boundaries, `compression.idle_compact_after_seconds` (Section 3.6, 6.5) |
| Background self-improvement review fork | Replays the conversation after the nudge interval | Keep it (quality), cap it via `auxiliary.background_review.max_input_tokens`, or route it to a cheaper model (Section 3.5) |
| Cron jobs | Each run is a fresh agent with full system prompt and tool schemas | Per-job `enabled_toolsets`, `no_agent`, `wakeAgent` gate, monitor mode, sensible intervals (Section 7) |
| Delegation fan-out | "a parallel batch of subagents typically burns the large majority of a run's total tokens" (`website/docs/user-guide/features/delegation.md` L279) | `delegation.model` (Section 7.6) |
| Mixture of Agents | The aggregator is billed for the whole tool loop, plus reference calls | Use one-shot `/moa` only for hard questions (Section 7.7) |
| Computer use | "A 20-action session on a 1568×900 display typically costs ~30K tokens" (`website/docs/user-guide/features/computer-use.md` L412) | Prefer CLIs, skills and the browser over GUI control (Section 9) |
| 1h prompt-cache writes | 2× base input price, compared with 1.25× for 5m | `prompt_caching.cache_ttl: "auto"` (Section 6.4) |

---

## 2. Quality levers and diagnosis

### 2.1 Levers in order of how often they are the cause
Source: `website/docs/guides/troubleshooting-agent-quality.md` L7-140 [DOC]. The steps are "sorted by how often each one turns out to be the answer".

1. **Which model is actually running.**
   - Check with `/model` (no args) or `/status`.
   - `/model <name>` is session-only unless `model.persist_switch_by_default: true` is set. Use `/model <name> --global` to persist the switch to `config.yaml`.
   - A model changed in the dashboard applies to new sessions only.
   - A mid-session switch resets the prompt cache, so on a long session it is cheaper to start fresh.
2. **Context pressure.**
   - `/usage` shows token usage. `/context` shows a breakdown, and `/context all` gives a per-skill and per-toolset cost list, which doubles as an inventory of what is loaded.
   - Fixes: `/compress`, `/compress here [N]` (keeps the last N exchanges verbatim), `/compress focus <topic>`, or `/new`.
   - The command registry also lists a `--preview` option for `/compress` (`hermes_cli/commands.py` L113).
3. **Wrong detected context length.**
   - The CLI startup line shows it as `📊 Context limit: …`.
   - Override it with `model.context_length: <int>` under `model:`, or per model on a custom provider entry.
   - Edits to `model.context_length` and `compression.*` hot-reload on a running gateway.
4. **Frozen memory snapshot.**
   - "remember X" during a session is guaranteed only for the **next** session (details in Section 3).
5. **Memory is bounded and curated, not a transcript.**
   - Use `session_search` for "did we discuss X last week?".
6. **Skills and tools actually loaded.**
   - Check with `/skills` (CLI-only, see 2.3), `/reload-skills`, `/tools list` (CLI-only) and `/context all`.
   - The doc's example `/github-pr-workflow` is an outdated skill name. It is now consolidated into `github`, see Section 14.
7. **Compression side effects.**
   - The last 20 messages are protected (`protect_last_n`) and the first exchange is pinned (`protect_first_n: 3`).
   - With `in_place: true`, pre-compaction turns are soft-archived and still reachable via `session_search`.

### 2.2 Diagnosis toolbox (exact commands)

| Purpose | Command | Notes |
|---|---|---|
| Model and session state | `/model`, `/status` | CLI and Telegram |
| Context usage | `/usage`, `/context`, `/context all` | CLI and Telegram (`hermes_cli/commands.py` L175-176, L318) |
| Usage trends | `/insights [days]` / `hermes insights` | "broader view of usage patterns over the last 30 days" (`website/docs/guides/tips.md` L154-156) |
| Fixed prompt size per call | `hermes prompt-size [--platform <name>] [--json]` | Runs offline and needs no credentials. Use `--platform telegram` for the Telegram hint (`website/docs/reference/cli-commands.md` L1293-1333) |
| Memory contents | `cat ~/.hermes/memories/MEMORY.md`, `cat ~/.hermes/memories/USER.md` | Named-profile path: `~/.hermes/profiles/<name>/memories/` (`website/docs/user-guide/features/memory.md` L67-88) |
| Learned skills and memories over time | `hermes journey`, `hermes journey list`, `hermes journey delete <id> [-y]`, `hermes journey edit <id>` | `/journey` is CLI-only (`hermes_cli/commands.py` L140-141) |
| Tools enabled per platform | `hermes tools list --platform telegram`, `hermes tools --summary` | (`hermes_cli/subcommands/tools.py` L8-36) |
| Cron health | `hermes cron status`, `hermes cron list`, `hermes cron doctor`, `hermes cron runs [job-id] --limit 20`, `hermes cron incidents` | (`website/docs/user-guide/features/cron.md` L345-541) |
| Install and config health | `hermes doctor` | Also flags an invalid `timezone` (`website/docs/user-guide/configuration.md` L2798) |
| Computer use | `hermes computer-use doctor`, `hermes computer-use status` | (`website/docs/user-guide/features/computer-use.md` L189-234) |
| Background review cost | `agent.log` lines `Background review complete: thread=bg-review calls=… in=… out=…`; `session_model_usage` rows with `task='background_review'` | (`website/docs/user-guide/features/memory.md` L425-427) |

### 2.3 Telegram vs CLI-only commands (important for a Telegram-first user)

- **CLI-only** (`website/docs/reference/slash-commands.md` L312):
  - `/skin`, `/snapshot`, `/export`, `/import`, `/reload`, `/tools`, `/toolsets`, `/browser`, `/config`, `/cron`, `/platforms`, `/paste`, `/image`, `/statusbar`, `/battery`, `/focus`, `/plugins`, `/indicator`, `/wake`, `/journey`, `/redraw`, `/clear`, `/history`, `/save`, `/copy`, `/handoff`, `/prompt`, `/pet`, `/hatch`, `/timestamps`, `/subscription`, `/quit`.
  - `/skills` is also `cli_only=True`. On the gateway only its approval slice (`pending`, `approve`, `reject`, `diff`, `approval`) works, and only when `skills.write_approval` is truthy (`hermes_cli/commands.py` L249-260) [CODE].
- **Works on CLI and gateway** (`website/docs/reference/slash-commands.md` L317, plus the registry):
  - `/status`, `/version`, `/whoami`, `/bg`, `/btw`, `/queue`, `/steer`, `/voice`, `/reload-mcp`, `/reload-skills`, `/rollback`, `/diff`, `/debug`, `/fast`, `/approvals`, `/busy`, `/footer`, `/curator`, `/kanban`, `/topup`, `/login`, `/suggestions`, `/blueprint`, `/learn`, `/init`, `/sessions`, `/loop`, `/yolo`.
  - Also `/goal`, `/subgoal`, `/heartbeat`, `/refine`, `/review`, `/moa`, `/model`, `/new`, `/compress`, `/context`, `/usage`, `/memory`, `/personality`, `/insights`.
- **Pitfall [DOC + inference].**
  - The docs say a CLI-only command typed in Telegram "will be sent to the agent as plain text and the command will not execute". They say it for `/browser connect` (`website/docs/user-guide/features/browser.md` L518).
  - So `/cron add …` from the daily-briefing tutorial only works on Telegram indirectly: the agent receives it as text and may then call its `cronjob_manage` tool.
  - For deterministic results, create jobs with `hermes cron create` in the Mac terminal, or ask in natural language on Telegram.

---

## 3. Memory

### 3.1 Mechanics [DOC] (`website/docs/user-guide/features/memory.md` L11-57)

**The two files** live in `~/.hermes/memories/`:

| File | Purpose | Limit |
|---|---|---|
| `MEMORY.md` | Agent's notes: environment facts, conventions, lessons | 2,200 chars (~800 tokens) |
| `USER.md` | User profile: preferences, communication style, expectations | 1,375 chars (~500 tokens) |

**How they are loaded:**

- Both files are injected into the system prompt as a **frozen snapshot at session start**. Writes persist to disk immediately but show up in the prompt only in the next session. This "preserves the LLM's prefix cache".
- The rendered block carries a usage header, for example `MEMORY (your personal notes) [67% — 1,474/2,200 chars]`.
- Entries are separated by `§`. The on-disk delimiter is `"\n§\n"` (`tools/memory_tool_store.py`, `ENTRY_DELIMITER`) [CODE].

**Writing limits:**

- There is **no auto-compaction**. A write over the limit returns an error and the agent must consolidate in the same turn. A `replace` is bound by the limit too.
- Duplicate prevention and security scanning apply (L210-216).

**Hand-editing is viable [CODE]:**

- `load_from_disk` de-duplicates entries and threat-scans them into the snapshot.
- It keeps an over-limit file, but warns and blocks further adds until the file is shrunk (`tools/memory_tool_store.py`).
- When hand-editing, keep the `§` separators and stay under the limits.

**Two cautions:**

- **One agent per Hermes home.** Memory is per profile. A second agent needs its own profile, or an external provider if memory must be shared (L23-25).
- **The model must actually call the tool.** "a sentence like 'I've added that to my memory' is just text". Small or weak tool-calling models fake saves. Fix: a stronger model for setup, then verify the file (L71-78).

### 3.2 Config keys, defaults, recommendations

```yaml
# ~/.hermes/config.yaml  (defaults shown; memory.md L266-276, cli-config.yaml.example L1003-1016)
memory:
  memory_enabled: true
  user_profile_enabled: true
  memory_char_limit: 2200   # ~800 tokens
  user_char_limit: 1375     # ~500 tokens
  write_approval: false     # false = write freely (default) | true = require approval
  nudge_interval: 10        # memory review every N user turns; 0 = disabled
  provider: ""              # external provider plugin name (Section 3.8)
```

- **What the switches do:**
  - Setting both `memory_enabled` and `user_profile_enabled` to `false` removes the `memory` tool and its guidance completely. An external provider keeps working.
  - Putting `memory` under `agent.disabled_toolsets` is "the heavier switch" and also hides external provider tools (L278-291).
- **[REC] character limits:**
  - The defaults are deliberately small. For a four-use-case personal assistant, `USER.md` at 1,375 chars is tight.
  - Raising both limits moderately (for example 3000/2000) is supported by the keys and costs a few hundred extra prompt tokens per call. These tokens are cached in the frozen prefix.
  - The docs give no recommended higher value, so this is a judgement call.
  - Anything procedural or task-specific belongs in a **skill**, not in memory: "a skill … loads only when relevant and does not compete for the 2,200-character budget" (L86-88).

### 3.3 Seeding memory well [REC on top of DOC]

- **Accept the onboarding offer.**
  - On the profile's first direct Telegram message, Hermes offers to build a user profile (`onboarding.profile_build: "ask"`, the default). It is "opt-in and consent-gated" and fires at most once (`website/docs/user-guide/configuration.md` L3053-3064) [DOC].
  - Accept it, then check `USER.md`.
- **Seed explicitly.** The memory doc's own fix is to say "use the `memory` tool to save …" and then confirm with `cat` (L78).
- **What goes where.** The docs say memory is for "what" and skills are for "how" (`website/docs/guides/tips.md` L112-114).
  - **USER.md** (who you are and how to talk to you):
    - name and form of address (du or Sie)
    - reply language (German) and length preference
    - time zone and city (Europe/Berlin)
    - working hours
    - family and important contacts (needed for mail-triage criteria)
    - priorities, things to avoid
  - **MEMORY.md** (environment facts):
    - "Mac mini M-series, Homebrew in /opt/homebrew"
    - the GitHub repo slug and local path of the web app, its deploy target, test command
    - the Obsidian vault path, if used
    - which mail and calendar accounts are connected and how (google-workspace, himalaya, remindctl)
    - where feed and watch configs live
- **Packing.** Pack several related facts into one entry. The doc's good and bad examples (L188-208): "Good: Packs multiple related facts", "Bad: Too vague", "Bad: Too verbose".
- **Example seed entries** in German, ready to dictate [REC]:
  - USER.md: `Name: <Vorname>. Ansprache: du. Antworte auf Deutsch, knapp; Details nur auf Nachfrage. Zeitzone Europe/Berlin, Arbeitszeit Mo–Fr 9–18 Uhr. Datumsformat TT.MM.JJJJ, 24-h-Uhr, Euro.`
  - MEMORY.md: `Web-App: GitHub <owner>/<repo>, lokal ~/code/<repo>, Tests: <command>, Deploy: <target>. Mac mini (Apple Silicon), Homebrew /opt/homebrew, Gateway läuft als launchd-Dienst.`

### 3.4 Write control and transparency [DOC]

- **`memory.write_approval: true`**
  - Interactive CLI writes are prompted inline.
  - Telegram writes and background-review writes are **staged**.
  - Manage them with:
    ```
    /memory pending             # list staged memory writes (auto ones tagged [auto])
    /memory approve <id>        # apply one (or 'all')
    /memory reject <id>         # drop one (or 'all')
    /memory approval on         # turn the gate on (or 'off') and persist it
    ```
    (`website/docs/user-guide/features/memory.md` L293-326). `/memory` works on the gateway (`hermes_cli/commands.py` L261-263) [CODE].
- **`display.memory_notifications`:** `off` | `on` (default, e.g. `💾 Memory updated`) | `verbose` (shows a preview such as `💾 Memory ➕ User prefers terse replies`, or a skill diff snippet). It can be set per platform via `display.platforms.<platform>.memory_notifications` (L328-356).
- **Injection risk [DOC + REC].** Memory entries are scanned for injection and exfiltration patterns and invisible Unicode, and matches are blocked (`memory.md` L214-216). Skill writes get only the optional `skills.guard_agent_created` scan. Email triage and web research expose the agent to untrusted text, so reviewing what was learned is a safety habit as well as a quality one.
- **[REC]** Use `verbose` on Telegram for the first weeks. Every learned fact then becomes visible and wrong ones can be corrected at once ("vergiss …" or `hermes journey delete <id>`). Turning on `write_approval` adds friction on every save. Use it only if verbose notifications show too many bad writes.

### 3.5 The background self-improvement review (memory and skill learning)

**What triggers it [CODE]:**

- **Memory review:** fires every `memory.nudge_interval` **user turns**. The default is 10 (`agent/agent_init.py` L1327-1364; `agent/turn_context.py` L744-754).
- **Skill review:** fires when tool-calling iterations since the last review reach `skills.creation_nudge_interval`. **[CONFLICT]** on the default:
  - `cli-config.yaml.example` L1153-1156 says `15`.
  - The code fallback is `10` (`agent/agent_init.py` L1409-1413).
  - The key is not in `DEFAULT_CONFIG`.
  - Effective value: 15 if the installer copied the example config, otherwise 10.

**How it runs [DOC]** (`website/docs/user-guide/features/memory.md` L358-478):

- It runs as a **background fork** after the turn, on the **main chat model** by default. It replays the conversation from the warm prompt cache, which is mostly cheap cache reads.
- `auxiliary.background_review.provider/model` routes it to another model. That model gets a compact **digest** (recent turns verbatim plus a summary of older ones) and runs "for substantially lower cost (~3–5× in benchmarks)". Test results: "memory capture was identical and skill capture near-identical".
- **Same-model reasoning.** A same-model review always inherits the parent's reasoning effort. `auxiliary.background_review.reasoning_effort` is honoured only on a different-model route.
- **`enabled: false`** stops the automatic forks, but `/refine` still works.
- **`max_input_tokens`** caps the **sum** of replayed input tokens per review.
  - Unset, the cap is 75% of the review model's context window, capped at 600,000. If the window cannot be resolved, the fallback is 120,000.
  - `<= 0` means unlimited.
  - The key must sit under `auxiliary:`. A top-level `background_review:` block is ignored.
- **`extra_tools`** whitelists an extra tool by name (default empty).
- **`defer`** matters only for the managed *local* llama-server.
- **Cron runs never spawn a review** [CODE]. Cron constructs agents with `skip_background_review=True` and the comment "(~30K tok/event)" (`cron/scheduler.py` L2532; `agent/turn_finalizer.py` L764-765).

**On-demand review:** `/refine [focus]` runs the review **now** with optional steering, for example `/refine save the deploy workflow as a skill`. "the live session and prompt cache are untouched" (`website/docs/reference/slash-commands.md` L58, L277). It is available on Telegram (`gateway/slash_commands_goals.py` L160-178) [CODE].

**Config for maximum quality [REC]:**

```yaml
auxiliary:
  background_review:
    enabled: true
    provider: "auto"      # = main chat model (best capture, warm cache)
    model: ""
    # max_input_tokens: 0   # leave unset (derived cap); set e.g. 48000 only if agent.log shows runaway reviews
```

- **Why.** With a frontier main model, a same-model review is the best learner, and most of its input is cache reads.
- **If budget is tight.** When the main model is the most expensive tier, route the review to a strong mid-tier model. The docs show capture holds. Do not set the nudge intervals to 0, because that kills learning.

### 3.6 Session boundaries on Telegram (the biggest memory-quality habit)

- **What the docs say [DOC]** (`website/docs/user-guide/sessions.md` L966-999; `website/docs/user-guide/features/memory.md` L59-65):
  - Gateway conversations never reset after inactivity or at a daily boundary. "Restarting the machine or the gateway is **not** a boundary."
  - In a never-ending session "the learning loop of forget → recall from memory → search past sessions almost never gets to fire". Costs also grow with history.
  - "Practice: run `/new` at natural boundaries — a finished task, a change of topic, the start of a day." Use `/new <name>` for a named session.
- **[CONFLICT/CODE] Saving at reset.**
  - `sessions.md` L999 and L1076 say the agent "saves memories and skills from the expiring session automatically" before a reset.
  - In code, the only end-of-session hook is `commit_memory_session()`, which calls the **external** memory provider's `on_session_end` (`run_agent.py` L916-921). `_memory_manager` is created only for external providers (`agent/agent_init.py` L1366-1403).
  - The gateway calls `_spawn_background_review` only from `/refine` (`gateway/slash_commands_goals.py` L171).
  - I found no built-in memory extraction on `/new` or `/reset`.
- **[REC] Habit:** run `/refine` (optionally with focus, e.g. `/refine Merke dir meine Präferenzen aus diesem Gespräch`) **before** `/new`, or say "merk dir das". A short session (fewer than 10 user turns) otherwise may never trigger the automatic memory review.
- **Separate parallel contexts:**
  - Telegram DM topics (operator-configured) or `/topic` (user-driven multi-session DM). Each topic is its own session (Section 4.6).
- **Long-lived threads you come back to:**
  - `compression.idle_compact_after_seconds: 1800` compacts history up front after 30 min idle (`website/docs/user-guide/configuration.md` L1058) [DOC].
- **Time-based resets.** Core ignores the legacy `session_reset` settings. The docs point to the catalog plugin: `hermes plugins install hermes-session-reset-policy` (`sessions.md` L966-975) [DOC]. It is a community plugin, so treat it as optional.

### 3.7 session_search (recall of past conversations)

- **How it works [DOC]:**
  - All CLI and messaging sessions are stored in `~/.hermes/state.db` (SQLite FTS5).
  - It returns actual messages, with no LLM summarization; about 20 ms per query; free (`memory.md` L218-244).
  - Prompt it explicitly: "search our past sessions for the deploy discussion".
- **Tool search defers it [CODE].** `session_search` is in the curated `tools.tool_search.defer` list, so the model reaches it through `tool_search`/`tool_describe`/`tool_call` (`hermes_cli/config_defaults.py`, defer list).
  - **[REC, optional]** For an assistant that should recall often, write an explicit `defer:` list that omits `session_search`. An explicit list replaces the curated one (`website/docs/user-guide/features/tool-search.md` L22-27). The effect on quality is untested [UNVERIFIED].
- **Retention [DOC]:**
  - `sessions.auto_prune: true` prunes ended sessions inactive for `sessions.retention_days`, default **90**, at startup (`sessions.md` L1077-1081).
  - Anything older is gone from `session_search`.
  - **[REC]** For long-term personal recall set `retention_days: 365`, or `auto_prune: false`. The docs warn of "multi-GB files within weeks" on gateway plus cron installs without pruning, so watch disk use.
  ```yaml
  sessions:
    auto_prune: true
    retention_days: 365
  ```

### 3.8 External memory providers (optional; additive to built-in memory)

Source: `website/docs/user-guide/features/memory-providers.md` [DOC].

- **Commands:** `hermes memory setup` (interactive picker), `hermes memory status`, `hermes memory off`. Or set `memory.provider`. Honcho, Hindsight and Supermemory come from the plugin catalog, so run `hermes plugins install <name>` first.
- **What an active provider does:**
  - injects provider context
  - prefetches before each turn
  - syncs every turn after the response
  - extracts at session end (where supported)
  - mirrors built-in writes
  - adds its own tools

  Built-in `MEMORY.md`/`USER.md` keep working and only one provider can be active (L30-42).

| Provider | Best for (doc wording) | Storage | Cost |
|---|---|---|---|
| Honcho | multi-agent, user-agent alignment, dialectic user modelling | Honcho Cloud or self-hosted | Honcho pricing / free self-hosted |
| OpenViking | self-hosted knowledge management | self-hosted | free (AGPL-3.0) |
| Mem0 | hands-off automatic extraction | Mem0 Cloud / own server / in-process OSS | Mem0 pricing / free |
| Hindsight | knowledge-graph recall with entity relationships | Hindsight Cloud, local embedded PostgreSQL, or local server | Hindsight pricing / free local |
| Holographic | local-only, advanced retrieval, no external deps | local SQLite (`$HERMES_HOME/memory_store.db`) | free |
| RetainDB | teams already on RetainDB | RetainDB Cloud | $20/month |
| ByteRover | portable local-first memory with CLI | local or cloud sync | free local |
| Supermemory | semantic recall, user profiling, session graphs | cloud or self-hosted | Supermemory pricing / free self-hosted |
| Memori | agent-controlled recall with project attribution | Memori Cloud | Memori pricing |

- **Holographic details** (L518-553):
  - tools `fact_store` (add, search, probe, related, reason, contradict, update, remove, list) and `fact_feedback`
  - setup: `hermes memory setup` → "holographic", or `hermes config set memory.provider holographic`
  - config under `plugins.hermes-memory-store`, with `auto_extract: false` by default
- **Code comment on `memory.nudge_interval`:** "0 when an external provider auto-extracts" (`hermes_cli/config_defaults.py`) [CODE].
- **[REC]**
  - Start with built-in memory plus `session_search`. That is enough for most single-user setups.
  - If recall across months becomes the bottleneck, try **Holographic** first. It is local, free and avoids GDPR questions.
  - Cloud providers receive every conversation turn ("Syncs conversation turns to the provider after each response"). A German user should weigh that for privacy and data protection.
  - Honcho is the richest user-modelling option but adds per-turn calls (`dialecticCadence`, `contextCadence`).

---

## 4. Persona, language and context

### 4.1 SOUL.md [DOC] (`website/docs/user-guide/features/personality.md` L9-140)

- **Where it lives and how it loads:**
  - It is the primary identity, "slot #1 in the system prompt", and lives at `~/.hermes/SOUL.md` (`$HERMES_HOME/SOUL.md`).
  - It is seeded on first run and never overwritten.
  - It is never read from the working directory.
  - Empty or unreadable falls back to the built-in identity. Content is injected verbatim after injection scanning and truncation.
  - It is not duplicated in the context-files block.
- **Scanner [CODE].** A user-authored SOUL.md hit by the injection scanner is **warned, not blocked** (`agent/prompt_builder.py` L1588-1630).
- **Seeded default text** (root `SOUL.md`, `hermes_cli/default_soul.py`), verbatim:
  > You are Hermes Agent, built by Nous Research. Be direct: match the length of your reply to the weight of the ask — a one-line question gets a one-line answer, and finished work gets a short report of what changed, what's verified, and what's left, never a replay of the process. No filler ("Great question," "I'd be happy to"), no restating the request back, no re-summarizing what you already said, no narrating tool calls the user can see. Plain claims over adjectives; when unsure, say so plainly. Agree because it's right, not because the user said it. Depth is earned — give it when the user asks for detail, teaches, or the stakes demand it, not by default.
- **What belongs in it.** Use SOUL.md for durable voice: tone, directness, how to handle uncertainty and disagreement, what to avoid. Leave out one-off project instructions, file paths and repo conventions; those go in `AGENTS.md` (L68-82).
- **Where SOUL.md applies:**
  - Subagents get the fallback identity instead of SOUL.md, because `skip_context_files` is set for delegation (L127).
  - Cron jobs **do** load SOUL.md (`load_soul_identity=True`, `cron/scheduler.py` L2530) [CODE].
- **[CONFLICT] When edits apply.**
  - The legacy scaffold text in `hermes_cli/default_soul.py` L24 says "This file is loaded fresh each message -- no restart needed."
  - `website/docs/guides/use-soul-with-hermes.md` L226 says "Then restart Hermes or start a new session."
  - Given the frozen system-prompt design, **[REC]** treat it as: edit, then `/new`.

### 4.2 German-by-default SOUL.md template [REC]

Keep the default's directness and add language and locale rules. Keep it persona-only. Suggested content, to paste into `~/.hermes/SOUL.md` and then run `/new`:

```markdown
# Identität
Du bist Hermes, der persönliche Assistent von <Vorname>. Sei direkt: Die Länge der Antwort richtet sich nach dem Gewicht der Frage. Fertige Arbeit = kurzer Bericht (was geändert, was geprüft, was offen), keine Nacherzählung des Prozesses.

## Sprache und Format
- Antworte standardmäßig auf Deutsch (du-Form), auch wenn Quellen englisch sind. Code, Befehle, Dateinamen und Fachbegriffe bleiben im Original.
- Wechsle nur ins Englische, wenn ich englisch schreibe oder es verlange.
- Datumsformat TT.MM.JJJJ, 24-Stunden-Uhr, Euro, metrische Einheiten.

## Haltung
- Keine Floskeln, kein Wiederholen der Frage, keine Lobhudelei.
- Unsicherheit klar benennen; bei Recherche Quellen mit Link angeben; nichts erfinden (keine Termine, Zahlen, Befehle).
- Widersprich, wenn etwas falsch oder riskant ist.

## Grenzen
- Vor Senden, Löschen, Bezahlen oder Veröffentlichen: Entwurf zeigen und auf mein OK warten.
```

### 4.3 Language and locale settings (what does and does not make Hermes German)

| Setting | Effect | Default | Recommended | Source |
|---|---|---|---|---|
| SOUL.md or USER.md instruction | **This** is what makes answers German | English persona | German rule as above | personality.md; configuration.md L2279 ("If you want the agent itself to reply in another language, just tell it in your prompt or system message") |
| `display.language` | Translates only static UI messages (approval prompt, a few gateway replies) | `en` | `de` (bundled) | configuration.md L2277-2303 |
| `HERMES_LANGUAGE` env | Per-session override of `display.language` | – | – | same |
| `stt.language` | Language hint for voice transcription. "The default is `stt.language: "en"`… Non-English speakers should set `stt.language`" | `"en"` | `"de"` | configuration.md L2431-2457 |
| `auxiliary.title_generation.language` | Session titles; `""` = "match the user's language" | `""` | keep | cli-config.yaml.example L937-943 |
| `timezone` | Agent clock, cron schedules and time-aware tools; `hermes doctor` flags a bad value; `HERMES_TIMEZONE` overrides | `""` (server-local) | `"Europe/Berlin"` | configuration.md L2790-2802 |
| `gateway.message_timestamps.enabled` | Prepends `[Tue 2026-04-28 13:40:53 CEST]` to each **user** message in model context, for temporal reasoning in long chats | `false` | `true` [REC] | messaging/index.md L505-520 |
| `tts.edge.voice` | Default `en-US-AriaNeural` ("322 voices, 74 languages") | English | a German Edge voice [UNVERIFIED: no German voice ID appears in the repo] | features/tts.md L50-56 |

### 4.4 Context files and AGENTS.md (mostly for the coding use case)

Source: `website/docs/user-guide/features/context-files.md`, `agent/prompt_builder.py` L1671-1817 [DOC/CODE].

- **Which file loads:**
  - Only **one** project context type loads per session, first match wins: `.hermes.md`/`HERMES.md` → `AGENTS.override.md` → `AGENTS.md` → `CLAUDE.md` → `.cursorrules` (plus `.cursor/rules/*.mdc`).
  - `AGENTS.md` is collected along the chain from git root to cwd. In each directory, `AGENTS.override.md` wins over `AGENTS.md`, which allows a personal, git-ignored override (L24; `agent/prompt_builder.py` L1671-1676, L1750-1752).
- **Size caps:**
  - At startup, files are truncated to `context_file_max_chars`, or dynamically (floor 20,000 chars, ceiling 500,000), keeping 70% head and 20% tail.
  - Progressive subdirectory discovery during a session caps each hint at 32,000 chars (L122-145).
- **Generate or update AGENTS.md:** `/init [notes]` scans the repo read-only and writes or merge-updates `AGENTS.md`. It works in CLI, gateway and TUI (`website/docs/reference/slash-commands.md` L113).
- **Cron:** context files load only when the job has `--workdir` (`website/docs/user-guide/features/cron.md` L168-198; code `skip_context_files=not bool(workdir)`, `cron/scheduler.py` L2529).
- **Per-platform opt-out:** `gateway.platforms.<platform>.skip_context_files` (`gateway/run_turn_runner.py` L1003-1012) [CODE; not found in the docs].
- **Coding posture keys** [CODE, partly undocumented] (`hermes_cli/config_defaults.py` L201-215; `website/docs/user-guide/configuration.md` L1258-1280):
  - `agent.coding_context` (default `"auto"`). Values:
    - `"auto"`: adds a coding brief plus a live git and workspace snapshot on interactive coding surfaces when cwd is a code workspace.
    - `"focus"`: auto plus "collapse toolset to the lean coding set (+ enabled MCP servers) + demote non-coding skill categories to names-only".
    - `"on"` or `"off"`.
    - This key is **not in the website docs**.
  - `agent.coding_instructions` (documented): standing project rules appended to the coding brief.
  - `agent.verify_on_stop` (documented, default `false`): refuses a final answer after code edits without fresh test, build or lint evidence. Values `true` | `"auto"`.

### 4.5 Personalities and platform hints

- **Custom personalities** (`personality.md` L205-240) [DOC]:
  ```yaml
  agent:
    personalities:
      rechercheur: >
        Du bist ein gründlicher Recherche-Analyst. Belege jede Aussage mit Quelle und Datum,
        trenne Fakten von Einschätzungen, nenne Gegenpositionen.
  ```
  Switch with `/personality rechercheur` and reset with `/personality none` (or `default` or `neutral`). The choice is stored in `display.personality`. Personalities are overlays on top of SOUL.md.
- **Platform hints** (`website/docs/developer-guide/prompt-assembly.md` L136-176) [DOC]:
  ```yaml
  platform_hints:
    telegram:
      append: "Antworte in kurzen, gut scannbaren Telegram-Nachrichten; lange Inhalte in Abschnitte teilen."
  ```
  - A bare string is shorthand for `append`; `replace` swaps out the built-in hint.
  - Hints live in the stable prompt tier and are cache-safe.
  - Cron jobs delivered to Telegram also carry the Telegram hint, under `Delivery destination (telegram):`.

### 4.6 Telegram structure for clean contexts [DOC] (`website/docs/user-guide/messaging/telegram.md`)

- **Operator-configured DM topics.** Needs **Threaded Mode** enabled in the BotFather **Mini App** (My bots → bot → Bot Settings → Threads Settings) (L749-842):
  ```yaml
  platforms:
    telegram:
      extra:
        ignore_root_dm: true          # optional: root DM becomes a lobby
        dm_topics:
        - chat_id: 123456789          # your Telegram user ID
          topics:
          - name: Assistent
          - name: Recherche
            skill: grounded-citations # auto-loads on new sessions in this topic
          - name: Web-App
            skill: github
          - name: Automationen
  ```
  - Each topic is an isolated session: `agent:main:telegram:dm:{chat_id}:{thread_id}`.
  - A topic `skill:` loads on each new session in that topic, "exactly like typing `/skill-name`".
  - `thread_id` is written back automatically.
- **User-driven alternative.** Send `/topic` in the root DM, then create topics with the Telegram **+** button. Use `/topic <session-id>` to restore an old session (L842-935).
- **Cron in topic mode.**
  - Root-DM deliveries land in the lobby, so create a `Cron` topic and set `TELEGRAM_CRON_THREAD_ID=<topic_thread_id>` in `~/.hermes/.env`.
  - Replies there continue that topic's session (L444-452).
  - Explicit `deliver="telegram:chat_id:thread_id"` targets also work (`cron.md` L631).
- **Home channel.** `/sethome` in the DM, or `TELEGRAM_HOME_CHANNEL=<id>` (L429-442). A bare `--deliver telegram` uses it.
- **Group and forum prompts.** `telegram.channel_prompts` maps a chat or topic ID to an ephemeral per-turn system prompt (L1354-1376).
- **Command menu.**
  - It is capped at **60** commands by default (clamped to 1..100). To keep important skills visible:
    ```yaml
    platforms:
      telegram:
        extra:
          command_menu:
            max_commands: 60
            priority_mode: prepend
            priority: [github, grounded-citations]
    ```
  - Enable the uncapped inline picker with BotFather `/setinline`, then type `@yourbot <term>` (L164-207).
  - The FAQ's older "100 command limit" advice remains valid for pruning: `skills.platform_disabled.telegram: [...]` via `hermes skills config`, then restart the gateway (`website/docs/reference/faq.md` L763-780).

---

## 5. Skills

### 5.1 Mechanics that matter for quality [DOC/CODE]

- **Progressive disclosure** (`website/docs/user-guide/features/skills.md` L172-182):
  - Level 0: `skills_list()` (name and description, "~3k tokens").
  - Level 1: `skill_view(name)`, the full content.
  - Level 2: `skill_view(name, path)`, a reference file.
  - Full skill text costs tokens only when loaded.
- **Index truncation.** The system-prompt skill index truncates each description: `SKILL_PROMPT_DESC_LIMIT = 60` (`agent/skill_utils.py` L822). The authoring skill says "truncates at 57 chars + '...'". The trigger words must fit in that window.
- **Loading paths:**
  - Invoke a skill explicitly with `/<skill-name>` (CLI and Telegram), or stack several in one command (skills.md L73-116).
  - `skills.auto_load: [..]` fully loads skills in every new session. Use it sparingly: it is a per-session token cost (`website/docs/user-guide/configuration.md` L810-821).
  - Skill bundles (`/bundles`, files in `~/.hermes/skill-bundles/`) alias several skills under one `/name` (skills.md L511-595).
- **Platform gating.** `platforms: [macos]` hides a skill elsewhere. All Apple skills are macOS-only, which fits the Mac mini (skills.md L221-236).
- **Precedence on name clashes:** project → local (`~/.hermes/skills/`) → `skills.create_dir` → `external_dirs` (skills.md L416).

### 5.2 Most valuable bundled skills for the four use cases

The repo ships 58 bundled and 152 optional skills (`find skills -name SKILL.md` / `optional-skills`). The descriptions below are verbatim from the frontmatter; sizes are in characters.

- **(a) Personal assistant**
  - `google-workspace`: "Gmail, Calendar, Drive, Docs, Sheets via gws CLI or Python." (14,241). It includes `references/daily-brief.md` (schedule, conflicts, meeting prep, mail-to-meeting links).
  - `himalaya`: "Himalaya CLI: IMAP/SMTP email from terminal."
  - `email-inbox-triage`: "Triage an inbox: prioritize threads, draft replies safely." It defaults to read plus draft, not send or delete ("'handle my inbox' does not imply permission to send or delete").
  - `apple-reminders`: "Apple Reminders via remindctl: add, list, complete."
  - `apple-notes`: "Manage Apple Notes via memo CLI: create, search, edit."
  - `imessage`: "Send and receive iMessages/SMS via the imsg CLI on macOS."
  - `findmy`: "Track Apple devices/AirTags via FindMy.app on macOS."
  - `maps`: "Geocode, POIs, routes, timezones via OpenStreetMap/OSRM."
  - `weekly-review-planning`: "Weekly reset: commitments, stalled work, next-week plan."
  - `document-to-action-items`, `meeting-action-items`, `pdf` (includes OCR), `docx`, `xlsx`, `powerpoint`, `notion`, `obsidian`.
- **(b) Research and knowledge**
  - `grounded-citations`: "Ground answers and documents in cited, verifiable sources." (12,652)
  - `arxiv`
  - `llm-wiki`: "Karpathy's LLM Wiki: build/query interlinked markdown KB."
  - `competitor-news-monitor`: "Watch named companies for material news; cited digests."
  - `youtube-content`
  - `blocked-page-recovery`: "Use when a fetch fails: 403/429, paywall, WAF, bot wall."
  - `xurl`: X/Twitter via the xurl CLI.
- **(c) Coding**
  - `github`: "GitHub via gh CLI: PRs, issues, reviews, repos, auth." Only 2,446 chars, because it routes to reference files: `references/auth.md`, `issues.md`, `pr-workflow.md`, `issue-to-pr.md`, … "This skill consolidates six former skills" (`skills/software-development/github/SKILL.md` L1-30).
  - `requesting-code-review`, `systematic-debugging`, `test-driven-development`, `codebase-inspection`, `simplify-code`, `spike`.
  - `dogfood`: "Exploratory QA of web apps: find bugs, evidence, reports."
  - `node-inspect-debugger`, `python-debugpy`.
  - `claude-code` (35,175 chars), `codex`, `opencode`: delegate to external coding CLIs.
  - `hermes-agent`: "Use, configure, theme, extend, and orchestrate Hermes Agent." Useful for letting Hermes configure itself.
- **(d) Automations**
  - `product-price-monitor`: "Watch product, flight, or listing prices; alert on target."
  - `competitor-news-monitor`, `computer-use`.

**Optional skills worth installing** (names verified in `optional-skills/`). Install with `hermes skills install official/<category>/<name>`:

| Install ID | Description (frontmatter) | Use case |
|---|---|---|
| `official/devops/watchers` | Poll RSS, JSON APIs, and GitHub with watermark dedup. (`platforms: [linux, macos]`) | d |
| `official/research/rss-feeds` | Read RSS, Atom, JSON feeds; discover feeds behind a page. | b/d |
| `official/research/blogwatcher` | Monitor blogs and RSS/Atom feeds via blogwatcher-cli tool. Needs `go install github.com/JulienTant/blogwatcher-cli/cmd/blogwatcher-cli@latest` or similar (SKILL.md L30-34) | b/d |
| `official/research/parallel-cli` | Agent-native web search, deep research, and enrichment. | b |
| `official/research/searxng-search` / `official/research/duckduckgo-search` | Free keyless meta-search / web, news and image search | b |
| `official/research/qmd` | Hybrid local search over notes, docs, and transcripts. | b |
| `official/social-media/reddit-reading` | Read Reddit: subreddits, search, threads, users. No browser. | b |
| `official/communication/one-three-one-rule` | 1-3-1 decision briefs: problem, three options, one pick. | a |
| `official/software-development/subagent-driven-development` | Execute plans via delegate_task subagents (2-stage review). | c |
| `official/autonomous-ai-agents/dynamic-workflow` | Plan-in-code fan-outs, adversarial verification, waves. | c/b |
| `official/smart-home/openhue` | Control Philips Hue lights, scenes, rooms via OpenHue CLI. | d |
| `official/security/1password` | Set up op CLI, sign in, and read or inject secrets. | all |

**[CONFLICT, minor]** `optional-skills/research/blogwatcher/SKILL.md` L27 calls `rss-feeds` "the bundled `rss-feeds` skill", but it lives in `optional-skills/`.

### 5.3 Installing from the hub safely [DOC] (skills.md L695-925)

```bash
hermes skills browse --source official            # official optional skills first
hermes skills search <query>                      # all sources
hermes skills inspect <identifier>                # preview + upstream metadata (repo, installs, audits)
hermes skills install official/devops/watchers    # official = built-in trust, no warning panel
hermes skills list --source hub
hermes skills check                               # upstream changes?
hermes skills update                              # reinstall changed hub skills
hermes skills audit                               # re-scan all hub skills
hermes skills uninstall <name>
```

- **Trust levels:**
  - `builtin` (shipped)
  - `official` (`optional-skills/`)
  - `trusted` (openai/skills, anthropics/skills, huggingface/skills, NVIDIA/skills)
  - `community` (everything else: skills.sh, well-known endpoints, custom GitHub, URL installs)
- **Security scan.** Every hub install is scanned for exfiltration, prompt injection, destructive commands and supply-chain signals.
  - `--force` overrides only caution or warn findings and **never** a `dangerous` verdict.
  - URL installs are always `community`.
- **[REC]** Prefer `official/...`. For anything else, run `inspect` first and read the SKILL.md and its scripts before installing. Never `--force` without reading.

### 5.4 Writing good skills (house standards) [DOC/CODE]

**Hard limits** (`tools/skill_manager_tool.py`):

- name ≤ 64 chars (`MAX_NAME_LENGTH`, `tools/skill_manager_tool.py` L108). URL-derived names must match `^[a-z][a-z0-9_-]*$` (skills.md, Direct URL section)
- description ≤ 1,024 chars (validator)
- SKILL.md ≤ 100,000 chars (`MAX_SKILL_CONTENT_CHARS`)

**House standard** (`skills/software-development/hermes-agent-skill-authoring/SKILL.md` L73-128):

- **Description:**
  - "≤ 60 characters. One sentence. Ends with a period."
  - No marketing words ("powerful", "comprehensive", "seamless", "advanced").
  - The trigger must sit in the first 57 chars.
  - Quote a description that contains `:`.
- **Size:** "target ~100 lines for a simple skill, ~200 for a complex one. Peer skills sit at 8-14k chars."
- **Section order:** `## When to Use` (with "Don't use for:" counter-triggers) → Prerequisites → How to Run → Quick Reference → Procedure → `## Pitfalls` → `## Verification`. When to Use, an actionable body, Pitfalls and Verification are the minimum.
- **No router or index skills.**
- **Frontmatter template** (skills.md L184-219):
  - `name`, `description`, `version`
  - optional `platforms`
  - `metadata.hermes.tags/category/fallback_for_toolsets/requires_toolsets/config`

**Advisory linter** (`tools/skill_linter.py`) [CODE]:

- It runs automatically after every `skill_manage` write and attaches `lint_warnings` ("The write succeeded. These are advisory…"). There is **no standalone `hermes skills lint` command**.
- Rules:
  - shell utilities named in prose (`grep`/`rg`/`find`/`ls` → `search_files`; `cat`/`head`/`tail` → `read_file`; `sed`/`awk` → `patch`)
  - marketing words (`powerful`, `comprehensive`, `seamless`, `advanced`, `cutting-edge`, `state-of-the-art`, `revolutionary`, `robust`)
  - `oversized-body` (>24,000 chars body)
  - `references-sprawl` (>60 reference files)
  - `incident-log-shape` (≥4 PR/issue refs and ≥0.5 per 1k chars)
  - forbidden files such as `README.md`
  - a missing "When to Use"
  - POSIX primitives in `scripts/` without `platforms:`

**Ways to create skills:**

- **`/learn <anything>`** (skills.md L117-170): a directory, a URL, "how I just deployed the staging server", pasted notes, or a whole book or PDF.
  - Large sources become knowledge-base skills: a lean SKILL.md plus `references/` per chapter.
  - Re-running `/learn` on the same topic folds new material into the existing skill.
  - It works on Telegram. Writes go through `skill_manage`, so `skills.write_approval` applies.
- **The quick habit** from the tips: after a 5+ step task you will repeat, say "save what you just did as a skill called `deploy-staging`" (`website/docs/guides/tips.md` L116-118).

### 5.5 Governance: approval, guard, curator

- **`skills.write_approval: true`** (skills.md L658-693). Every `skill_manage` write is **staged** under `~/.hermes/pending/skills/`, including writes from foreground turns and the background review. Review with:
  ```
  /skills pending
  /skills diff <id>
  /skills approve <id>        # or 'all'
  /skills reject <id>         # or 'all'
  /skills approval on         # or 'off'
  ```
  The Telegram slash slice of `/skills` exists only while this gate is on (`hermes_cli/commands.py` L249-260).
- **`skills.guard_agent_created: true`** (default `false`) is a content scanner for dangerous patterns, independent of approval (`website/docs/user-guide/configuration.md` L823-832).
- **Curator** (`website/docs/user-guide/features/curator.md`):
  - It maintains **agent-created** skills only. Hub skills are never touched; bundled skills only with `prune_builtins: true`. It never deletes; it archives to `~/.hermes/skills/.archive/`.
  - **Trigger:** an inactivity check, not cron. A run needs `interval_hours` (168) since the last run **and** `min_idle_hours` (2) of agent idleness. The first run is deferred by one full interval.
  - **Defaults:**
    ```yaml
    curator:
      enabled: true
      interval_hours: 168
      min_idle_hours: 2
      stale_after_days: 14
      archive_after_days: 30
      consolidate: false        # LLM umbrella-building pass, opt-in (50–100 API calls per sweep)
      prune_builtins: false
      backup: {enabled: true, keep: 2}
    ```
  - Pinned skills and skills referenced by any cron job are skipped.
  - **Key commands:**
    - `hermes curator status`
    - `hermes curator run --dry-run`, `hermes curator run --consolidate`
    - `hermes curator pin <skill>`
    - `hermes curator restore <skill>`
    - `hermes curator rollback [--list|--id <ts>|<entry-id>]`
    - `hermes curator ledger`
    - `/curator` in chat
  - **Model:** the LLM pass uses `auxiliary.curator` (default `auto` = main model), configurable via `hermes model` → "Auxiliary models".
  - **[CONFLICT]** curator.md L305 says agent-created skills go "`active` → (30d unused) `stale` → (90d unused) `archived`". The config defaults and the same page's L49-62 say 14 and 30 days.
- **[REC] for quality:**
  - Keep `write_approval: false` with `display.memory_notifications: verbose`. With a frontier model, self-written skills are usually good, and the curator, the ledger and rollback give an undo path.
  - Switch to `skills.write_approval: true` if verbose notices show noisy or wrong skills.
  - `hermes curator pin` your hand-written core skills.
  - Run `hermes curator run --dry-run`, then an occasional `--consolidate` (monthly) once more than about 20 agent-created skills exist.

---

## 6. Tools and token efficiency

### 6.1 The "~14K-token fixed overhead" question

- **No figure in the repo.** The repo contains no "14K" figure for the fixed prompt [checked: grep over the docs and README]. The only documented sub-figure is `skills_list` at "~3k tokens".
- **How to measure** [DOC]:
  ```bash
  hermes prompt-size                       # CLI platform, human-readable
  hermes prompt-size --platform telegram   # Telegram platform hint
  hermes prompt-size --json
  ```
  - It reports the system prompt total, the skills index, memory and user profile, the prompt tiers (stable, context, volatile), and the tool schemas. It runs offline with no credentials (`website/docs/reference/cli-commands.md` L1293-1333).
  - In-session, `/context all` lists the cost per skill and per toolset.
- **Shrinking it:** disable unused toolsets (`hermes tools`), uninstall unneeded skills, and keep context files small (same doc, tip).
- **The fixed prefix is mostly cache reads** on providers with prompt caching, so per-call cost is dominated by uncached tail tokens and output (Section 6.4). Tool-schema size matters most for **cron jobs** and **subagents**: machine-paced runs use a 5m cache and are often first-call-only.

### 6.2 Tool search (lazy tool loading)

Sources: `website/docs/user-guide/features/tool-search.md`, `tools/tool_search.py` [DOC/CODE].

- **What it does.** It replaces deferrable tools in the tools array with three bridge tools: `tool_search(queries, limit?)`, `tool_describe(names)`, `tool_call(calls)`. Hooks, approvals and guardrails still run against the real tool name.
- **[CONFLICT] It is effectively ON by default.**
  - Config default `tools.tool_search.enabled: "auto"`. The code says "'auto' is an alias of 'on' today" (`tools/tool_search.py` L43).
  - It activates "whenever any deferrable tool exists" (L195-204).
  - The doc intro calls it "opt-in" (tool-search.md L13).
- **What is deferred:**
  - All MCP tools and non-core plugin tools, including the Home Assistant `ha_*` tools (`website/docs/user-guide/messaging/homeassistant.md` L32).
  - The curated built-ins: `computer_use`, `session_search`, `image_generate`, `todo_list`, `process_manage`, `cronjob_manage`, plus desktop GUI helpers (`hermes_cli/config_defaults.py` L2025-2032).
  - Because `session_search` is part of the default Telegram toolset, the bridge is active in ordinary Telegram sessions.
- **Never deferred:**
  - Core working-set tools (`terminal`, `read_file`, `write_file`, `patch`, `search_files`, `todo`, `memory`, `browser_*`, `web_search`, `web_extract`, `clarify`, `execute_code`, `delegate_task`, …).
  - `clarify` is deliberately kept eager: "A/B showed deferring it collapsed structured-clarify usage (18/18 -> 7/18)" (`tools/tool_search.py` L142-146).
- **Tiers.** Tier 0 means no deferrable tools. Tier 1 means bridge plus a name-and-description manifest within budget. Tier 2 means bridge plus one-line-per-server summaries. Listing budget = `min(threshold_pct% of context, listing_max_tokens)` (defaults 5% and 4000) (tool-search.md L84-98).
- **Config:**
  ```yaml
  tools:
    tool_search:
      enabled: auto       # auto (default), on, or off
      threshold_pct: 5
      search_default_limit: 5
      max_search_limit: 25
      listing: auto
      listing_max_tokens: 4000
      # defer: [...]      # explicit list REPLACES the curated default; [] = everything eager
  ```
- **Savings: not quantified** in the docs. The trade-off they describe: a fixed cost (three bridge schemas plus the listing) and at least one extra round trip for cold tools. "Live benchmarking showed the listing mode matching eager loading's task success while costing less than the bare bridge" (L214-225).
- **[REC]** Keep `auto`. The benefit grows with every MCP server added. Turn it `off` only for a tiny toolset where eager loading is simpler.

### 6.3 Toolsets per platform (what to keep)

- **Commands** (`hermes_cli/subcommands/tools.py` L8-52) [CODE]:
  ```bash
  hermes tools                                   # interactive curses UI (includes the "cron" platform)
  hermes tools list --platform telegram
  hermes tools disable image_gen --platform telegram
  hermes tools enable kanban --platform telegram  # example syntax; MCP tools use server:tool
  hermes tools --summary
  ```
- **Config form** (`cli-config.yaml.example` L1370-1422):
  - `platform_toolsets: { telegram: [hermes-telegram] }`, a preset, or a list of individual toolsets such as `telegram: [web, terminal, file, todo]`.
  - `agent.disabled_toolsets: [...]` is a global denylist.
- **Toolset names** (`website/docs/reference/toolsets-reference.md` L55-119): `web`, `search`, `browser`, `terminal`, `file`, `code_execution`, `vision`, `image_gen`, `video`, `tts`, `skills`, `memory`, `session_search`, `todo`, `clarify`, `delegation`, `cronjob`, `computer_use`, `kanban`, `x_search`, `homeassistant` (via plugin), `connections`, `safe`, `coding`, `debugging`.
- **[CONFLICT, minor]** The toolsets reference says `hermes-telegram` is "Same as `hermes-cli`". The example config comment lists a smaller set: "terminal, file, web, vision, image, tts, browser, skills, todo, cronjob, messaging".
- **[REC] for a quality-first Telegram assistant:**
  - Keep the full preset. The quality-critical tools are `web`, `browser`, `terminal`, `file`, `skills`, `memory`, `session_search`, `todo`, `clarify`, `delegation`, `code_execution`, `vision`, `cronjob` and `tts`.
  - Remove only what you never use (for example `image_gen`, `computer_use` on Telegram) and remeasure with `hermes prompt-size --platform telegram`.
- **Cron** (Section 7.2) is where trimming pays: cron runs use per-job `enabled_toolsets` or the `cron` platform config. "carrying `browser`, `delegation` into every tiny 'fetch news' job bloats the tool-schema prompt on every LLM call" (`cron.md` L1204-1222).

### 6.4 Prompt caching

- **[CONFLICT]** on the default TTL:
  - `overview.md` L47 says "1-hour prefix cache … Always-on; no configuration required".
  - `configuration.md` L1374 says Hermes attaches `ttl: "1h"`.
  - The **default is `cache_ttl: "5m"`** (`hermes_cli/config_defaults.py`; configuration.md L1381-1384).
- **The knob** [DOC]:
  ```yaml
  prompt_caching:
    cache_ttl: "auto"   # "5m" | "1h" | "auto"
  ```
  - Pricing: 1h writes cost 2× base input and 5m writes 1.25×.
  - `"auto"` = `1h` for human-paced sessions (CLI, TUI, Desktop, Telegram and other messaging) and `5m` for subagents, cron, one-shots, webhooks, Kanban, API and batch runs. "`auto` cut the interactive cache-write bill by roughly 40%". Delegated subagents are always clamped to 5m.
  - Applies to Claude via native Anthropic, OpenRouter and Nous Portal (configuration.md L1370-1389).
- **[REC]** Set `cache_ttl: "auto"`. Telegram replies are often more than 5 minutes apart, so the 1h tier keeps the prefix warm between messages.
- **Things that break the cache:**
  - `/model` switches, provider fallback and credential-pool rotation (`website/docs/guides/tips.md` L134-136).
  - MCP config reloads. "Every reload rebuilds the tool surface and INVALIDATES the provider prompt cache" (`hermes_cli/config_defaults.py` L543-547, `mcp.auto_reload_on_config_change: True`). Batch MCP edits instead of making them mid-conversation.
- **Not a cache break:** editing SOUL.md or memory affects only new sessions, because the prompt is frozen per session.

### 6.5 Compression and pruning

```yaml
compression:            # defaults (configuration.md L996-1018; config_defaults.py L584-600)
  enabled: true
  threshold: 0.50       # models with windows < 512K are floored at 0.75 (raise-only) [CODE]
  threshold_tokens: null
  target_ratio: 0.20
  tail_mode: lean
  protect_last_n: 20
  protect_first_n: 3
  in_place: true
  idle_compact_after_seconds: 0
  proactive_prune_tokens: 0
auxiliary:
  compression:
    provider: "auto"    # empty model = main chat model
    model: ""
```

- **Threshold floor** [CODE]. "Models with windows below 512K are floored at 0.75 (raise-only)" (`hermes_cli/config_defaults.py` L588-591; `agent/context_compressor.py` L1180-1181). The main config doc does not mention this floor.
- **[REC]:**
  - `idle_compact_after_seconds: 1800` for Telegram, so threads you return to are compacted before the reply.
  - `proactive_prune_tokens: 48000` only on large-window models. The docs say "try `48000` to enable"; it is a no-LLM prune of old bulky tool outputs.
  - `threshold_tokens` (for example `256000`) when a 1M-window model would otherwise carry 500K-token prefixes.
  - Keep `auxiliary.compression` on a competent model. Summary quality is what remains after compaction. A cheap model is fine for cost, but it is the detail-loss point.

### 6.6 Web search and extraction (research quality)

Source: `website/docs/user-guide/features/web-search.md` [DOC].

**Backends:**

| Backend | Env var | Search | Extract | Free tier (doc wording) |
|---|---|---|---|---|
| Firecrawl (default) | `FIRECRAWL_API_KEY` (optional) | ✔ | ✔ | 500 credits/mo · keyless cloud when selected |
| SearXNG | `SEARXNG_URL` | ✔ | – | free (self-hosted) |
| Brave Search (free tier) | `BRAVE_SEARCH_API_KEY` | ✔ | – | 2 000 queries/mo |
| DDGS (DuckDuckGo) | – | ✔ | – | free |
| Exa | `EXA_API_KEY` (optional) | ✔ | ✔ | keyless ring member · 1 000 searches/mo with key |
| Parallel | `PARALLEL_API_KEY` (optional) | ✔ | ✔ | keyless ring member · paid with key |
| Tavily | `TAVILY_API_KEY` (optional) | ✔ | ✔ | opt-in keyless when selected |
| Perplexity | `PERPLEXITY_API_KEY` | ✔ | ✔ (query-relevant snippets) | paid (per-request) |
| Keenable | `KEENABLE_API_KEY` (optional) | ✔ | ✔ | keyless ring member |
| xAI (Grok) | `XAI_API_KEY` / xAI OAuth | ✔ | – | paid; "results are LLM-generated rather than index-backed" |
| OpenAI Native (Codex) | `hermes auth add openai-codex` | ✔ | – | needs a ChatGPT/Codex subscription; Codex Responses transport only |

**Facts:**

- **Keyless ring.** A fresh install with no keys rotates across the free tiers of Exa, Parallel, Firecrawl and Keenable, with failover on rate limits.
  - "strictly last-resort"; turn it off with `web.keyless_fallback: false`.
  - The one-shot rescue for failed keyed calls is `web.keyless_rescue` (default on).
- **Per-capability split:**
  ```yaml
  web:
    search_backend: "exa"         # used by web_search
    extract_backend: "firecrawl"  # used by web_extract
  ```
  - Valid `web.backend` values: `firecrawl | searxng | brave-free | ddgs | tavily | perplexity | keenable | exa | parallel | xai`. `openai-native` is a search backend and `nous` is the Tool Gateway route.
  - Once a shared web selection exists, adding a key to `.env` does **not** reroute traffic (L426).
  - `hermes tools` → "Web Search & Extract" is the guided path. For Exa, Parallel and Keenable it offers separate **Free (keyless)** and **Paid (API key)** rows, stored as `web.provider_tier.<name>`.
- **Long pages.**
  - Pages up to `web.extract_char_limit` (default 15,000, clamped to 2,000–500,000) are returned whole.
  - Longer pages get a head+tail window (~75/25) plus a `[TRUNCATED]` footer, and the full text is stored on disk for paging with `read_file`.
  - The agent can raise the limit per call (`char_limit`).
  - `web.extract_timeout` defaults to 120 s.
- **Caching.**
  - `web.cache_enabled: true`, `web.cache_ttl_minutes: 20` (clamped 1–1440).
  - Extract results are shared across CLI, gateway, cron and subagents.
  - Lower the TTL for live data.
- **Nous Portal subscribers** get managed web search and extract through the Tool Gateway (`hermes setup --portal`). The docs state no Portal pricing.

**[REC] for research quality** (the repo has no quality benchmark between backends, so this is a judgement from the doc descriptions):

- Use a keyed **Exa** ("Neural search with semantic understanding. Good for research") or **Parallel** ("deep research capabilities") for search.
- Use **Firecrawl** ("Recommended for most users") for full-page extract.
- Keep `keyless_rescue` on as a safety net.
- Avoid Perplexity as the extract backend when whole pages matter (it returns snippets), and xAI for factual retrieval (LLM-generated results).
- Pair with the `grounded-citations` skill, or a Telegram research topic bound to it, so answers carry verifiable sources.
- If budget is spare, consider raising `extract_char_limit` to 30,000. This is a judgement call: it means more tokens per page.

### 6.7 Browser options (for logged-in sites and JS-heavy pages)

Source: `website/docs/user-guide/features/browser.md` [DOC].

- **Default local mode** (L72-92): "Browser Use" mode drives Hermes' packaged headless Chromium and never touches your Chrome.
- **Real profile** (L163-215):
  - `browser.use_real_profile: true` copies your default browser's **active** profile (cookies, logins) into `~/.hermes/browser-profile/<browser>/` and launches the real browser binary headless.
  - On macOS this keeps Keychain-encrypted cookies decryptable.
  - Pin a specific profile with `browser.real_profile_pin: "Profile 2"`.
- **For cron on logged-in sites** (L270-300):
  - turn on `use_real_profile`
  - give the job the browser toolset (`enabled_toolsets=["browser", ...]`)
  - store credentials and authenticator keys in the credential vault, since nobody can answer a 2FA prompt
- **`/browser connect`** (attach to your own Chrome over CDP) is an **interactive CLI command only**. With Chrome 136+ it needs a dedicated `--user-data-dir` (L513-571).
- **Alternatives:** Browserbase, Browser Use cloud, Firecrawl cloud browser, Camofox (local Docker), Lightpanda engine.
- **[REC]** Use the default local mode. Use `use_real_profile` only if the agent must act on logged-in sites, and pin a dedicated Chrome profile for it.

### 6.8 MCP servers

Source: `website/docs/user-guide/features/mcp.md` [DOC].

- **Catalog of Nous-approved servers** (`optional-mcps/`, install with `hermes mcp install <name>`):
  - airtable, asana, atlassian, calendly, canva, cloudflare, **context7**, craft, **deepwiki**, dropbox, figma, gitlab, linear, monday, **n8n-official**, netlify, **notion**, sentry, stripe, supabase, **todoist**, vercel, wolfram, …
  - `context7` and `deepwiki` need no auth: `https://mcp.context7.com/mcp` ("Up-to-date, version-specific library docs") and `https://mcp.deepwiki.com/mcp` ("Ask questions about any public GitHub repo") (`optional-mcps/context7/manifest.yaml`, `optional-mcps/deepwiki/manifest.yaml`).
- **GitHub is deliberately not in the catalog.** The `gh`-based `github` skill is the recommended path (mcp.md L302-306).
- **Lifecycle:**
  ```bash
  hermes mcp install context7
  hermes mcp configure <name>     # pick which tools to register
  hermes mcp login <name>         # OAuth (5-min wait; --flow device for device code)
  /reload-mcp                     # in chat
  ```
- **Manual config:**
  ```yaml
  mcp_servers:
    filesystem:
      command: "npx"
      args: ["-y", "@modelcontextprotocol/server-filesystem", "/Users/<you>/Documents"]
    company_api:
      url: "https://mcp.example.com"
      headers:
        Authorization: "Bearer ***"
      tools:
        include: [create_issue, list_issues]   # or exclude: [...]; globs allowed
      # lazy: true                    # connect on first call (needs one prior live connect)
      # idle_timeout_seconds: 900     # recycle stdio servers (e.g. Playwright)
      # enabled: false
  ```
  (L29-56, L479-540, L612-660)
- **Pitfalls:**
  - Editing `config.yaml` inside a running session auto-reloads MCP with a 30 s timeout. That is too short for OAuth, so run `hermes mcp login <server>` from a fresh terminal (L421).
  - Google's Drive MCP rejects dynamic client registration and needs your own OAuth client (L407-419).
  - MCP tools sit behind tool search (Section 6.2).
- **[CONFLICT] Tool naming.**
  - mcp.md L565-582 says `mcp_<server>_<tool>`.
  - The code registers `mcp__<server>__<tool>`, clamped to 64 chars (`tools/mcp_tool_schema.py` L153-175), which matches `website/docs/reference/tools-reference.md` L14.
- **[REC] for this user:**
  - `context7` and `deepwiki` for coding.
  - `notion` or `todoist` only if those are already in use.
  - `n8n-official` if the user runs n8n for smart-home or web automations.
  - Each server adds deferred tools. That is cheap under tool search, but every server is also a trust decision: read the trust model at mcp.md L192-211.

---

## 7. Automations

### 7.1 Which mechanism for which job [DOC]

| Mechanism | Runs in | Survives restart | Best for | Source |
|---|---|---|---|---|
| `hermes cron` (and the agent's `cronjob_manage` tool) | A fresh isolated session per run | Yes, a durable scheduler in the gateway | Briefings, digests, monitors, watchdogs | features/cron.md |
| `/heartbeat every <interval> <prompt>` | **This** conversation, when idle | State persists and the gateway resumes it | "Keep an eye on X in this thread" (one per session, min 60 s) | features/heartbeat.md L7-60 |
| `/loop [interval] <prompt>` | This session; fixed or self-paced (1–15 min back-off) | Session-bound | Polling CI or a deploy during a work session, iterate-until-green | features/loops.md L7-50 |
| `/goal <text>` | This session; judge-driven continuation | Goal state persists (`/resume`) | One objective with a definition of done | features/goals.md |
| `delegate_task` / `/review` | Isolated child agents | Background completions are durable | Parallel research, independent review | features/delegation.md |
| `/moa <prompt>` | One turn through a Mixture-of-Agents preset | – | Hard one-off decisions | features/mixture-of-agents.md |
| Webhooks (`hermes webhook subscribe …`) | Event-triggered agent runs | Yes | GitHub PR or CI events; needs an endpoint reachable from the internet | guides/automation-blueprints.md |
| Home Assistant events | Gateway platform, state_changed events | Yes | Reacting to sensors; replies go to HA notifications | messaging/homeassistant.md |

### 7.2 Cron essentials (verified)

- **The gateway must be running.**
  - On a Mac, `hermes gateway install` sets up the launchd service. The scheduler ticks inside the gateway.
  - Check health with `hermes cron status`. An overdue job shows `⚠ Next run … is OVERDUE`; fix it with `hermes gateway restart`, or run the job now with `hermes cron run <id>` (cron.md L345-351).
- **Creating jobs.**
  - Use `hermes cron create` (alias `add`) in the terminal, or ask in natural language on Telegram. The agent then uses `cronjob_manage`.
  - `/cron` is **CLI-only** (`hermes_cli/commands.py` L274-277).
  - Cron sessions cannot create cron jobs (cron.md L40-42).
- **Schedules** [DOC + CODE] (cron.md L1093-1143; `cron/jobs.py` L699-784):
  - `in 30m`, `30m`/`every 2h`
  - `every monday 9am`, `every day at 9am`, `weekdays at 9am`, `weekends at 10am`, `daily at 7am`, `monday, wednesday at 9am`
  - cron expressions (`0 9 * * 1-5`, named weekdays allowed)
  - ISO timestamps
  - Times accept `9am`, `9:30pm`, `14:00`, `at 7`, `noon`, `midnight`.
  - Phrases are **English only**.
  - Schedules follow `timezone`. Set `Europe/Berlin` so "7:30" means Berlin time.
- **Delivery** (cron.md L544-600):
  - `origin` is the default from chat; `local` is the default from the CLI and saves to `~/.hermes/cron/output/`.
  - `telegram` means the home channel (`/sethome` or `TELEGRAM_HOME_CHANNEL`).
  - `telegram:<chat_id>` or `telegram:<chat_id>:<thread_id>` target a chat or topic.
  - A comma list fans out; `all` goes to every home channel.
  - **The agent's final response is delivered automatically.** Prompts should not tell it to "send" anything.
  - Delivered output is secret-redacted.
  - `--failure-deliver local` silences failure notices.
- **Quiet runs:**
  - A final response containing `[SILENT]` suppresses delivery (output is still saved). Failed runs always deliver (L798-810).
  - Repeated failures alert once, then remind after a cooldown (`cron.failure_repeat_alert_hours: 6`). Inspect with `hermes cron incidents`.
- **Preflight** (on by default): missing credentials, unready skills, an unknown delivery target or a missing MCP server blocks the run **before any LLM call** and alerts once (L77-120).
- **Model per job:**
  - Resolution order: per-job pin (`--model … --provider …` or `--pin`) → `cron.model`/`cron.model_provider` → main model at fire time.
  - `--reasoning-effort none|minimal|low|medium|high|xhigh|max|ultra` sets reasoning per job (L26-38).
  - **Pitfall:** `cron.provider` is **not** the inference provider. It selects the scheduler backend (`chronos`) (`website/docs/developer-guide/cron-internals.md` L195-253).
- **What a cron agent gets** [CODE `cron/scheduler.py` L2529-2532]:
  - SOUL.md and MEMORY.md/USER.md: **yes**.
  - Project context files: only with `--workdir`.
  - Background review: **never**.
  - Prompts still must be self-contained: "no conversation history from previous runs" (`guides/automate-with-cron.md` L130).
- **Toolsets:**
  - Per-job `enabled_toolsets` (via the `cronjob` tool; no CLI flag) beats the `cron` platform config in `hermes tools`, which beats the built-in defaults.
  - A malformed config fails closed (L1204-1222; `cron/scheduler.py` L490-514).
- **Continuity and chaining** (L943-1010):
  - `--continuity` injects the job's own previous output ("avoid repeating what was already reported").
  - `context_from` (via the tool) chains jobs.
  - Toggle on existing jobs with `hermes cron edit <id> --continuity` or `--no-continuity`.
- **Continuable deliveries** (reply to a brief with context):
  - Opt-in with `cron.mirror_delivery: true`, or per job via the tool's `attach_to_session`.
  - On thread-capable platforms (Telegram topics) each delivery opens its own thread. When no thread can be created, the code falls back to mirroring into the DM (`cron/scheduler_delivery.py` L257-260) (cron.md L691-740).
- **Approvals.** `approvals.cron_mode: deny` (default) blocks dangerous commands in cron, so the agent must find another path (`website/docs/user-guide/security.md` L36-49). Computer use is refused in cron unless running in bounded or yolo mode.
- **Scripts:**
  - They must live in `~/.hermes/scripts/`.
  - `.sh` runs under bash, anything else under Hermes' Python. `--interpreter ~/venvs/x/bin/python` selects your own venv.
  - The environment is sanitized: provider keys are not inherited. Pass your own secrets via `terminal.env_passthrough: [MY_TOKEN]` plus `.env` (L889-922).
- **Missed runs.** A slot missed during downtime fires **once** when the scheduler is back (`cron.catch_up_missed: true`) (L1057-1080).
- **Concurrency.** Jobs run in parallel by default (`cron.max_parallel_jobs: null`) [CODE, config_defaults]. **[CONFLICT]** `guides/cron-troubleshooting.md` L201 says jobs run sequentially.

### 7.3 Recipes for this user (exact commands)

All recipes assume the gateway runs as a launchd service, `timezone: "Europe/Berlin"`, and `/sethome` was sent in the Telegram DM. In topic mode, also set `TELEGRAM_CRON_THREAD_ID`. Test any job with `hermes cron run "<name>"` (names are accepted, cron.md L200-206) and inspect it with `hermes cron runs <id> --limit 5`.

#### A. Daily briefing via Telegram

**Prerequisites:**

- **Google** (Section 10): the google-workspace OAuth is done and `python ${HERMES_HOME:-$HOME/.hermes}/skills/productivity/google-workspace/scripts/setup.py --check` prints `AUTHENTICATED`.
- **Apple Reminders:** `brew install steipete/tap/remindctl`, `remindctl authorize`, then re-run `hermes gateway install` to refresh the launchd PATH.

**Variant 1: blueprint from the Telegram chat** (`cron/blueprint_catalog.py` L104-122):

```
/blueprint morning-brief time=07:30 deliver=origin
```

- The job runs daily (`{minute} {hour} * * *`) with skill `google-workspace`.
- Its prompt covers calendar, weather and urgent items, following `references/daily-brief.md`.
- Bare `/blueprint` lists the catalog. `/blueprint <name>` without slots starts a guided Q&A (`website/docs/reference/slash-commands.md` L116). Quoted values are supported (the handler uses `shlex.split`, `hermes_cli/blueprint_cmd.py` L195).

**Variant 2: explicit job from the Mac terminal** (full control, German prompt) [REC; flags verified in `hermes_cli/subcommands/cron.py` L23-93]:

```bash
hermes cron create "weekdays at 7:30" \
"Erstelle mein Morgenbriefing für heute (Europe/Berlin), auf Deutsch.
1) Kalender: Folge references/daily-brief.md des google-workspace-Skills (exaktes Tagesfenster, Konflikte, Vorbereitung, Mail-zu-Termin-Bezüge).
2) Apple-Erinnerungen: mit remindctl die heute fälligen und überfälligen Einträge.
3) Wetter für <Stadt> heute (Websuche, Quelle nennen).
4) Mails: nur, was heute eine Antwort oder Entscheidung braucht.
Format: kurze Abschnitte, höchstens 15 Zeilen, Links wo nützlich. Nichts senden, löschen oder ändern." \
  --name "Morgenbriefing" \
  --skill google-workspace \
  --skill apple-reminders \
  --deliver telegram \
  --reasoning-effort medium
```

- Add `--pin` to lock today's main model onto the job.
- To be able to reply to the brief with full context, ask Hermes on Telegram: "Setze für den Job Morgenbriefing attach_to_session=true". The `cronjob` tool accepts `attach_to_session` (`tools/cronjob_tools.py`). Alternatively set `cron.mirror_delivery: true` globally.
- **Preflight catches missing CLIs.** `apple-reminders` declares `prerequisites: commands: [remindctl]` (`skills/apple/apple-reminders/SKILL.md` L11-12), and cron preflight checks that attached skills are ready, including required commands (cron.md L77-90). If `remindctl` is not on the launchd PATH, the job is `blocked_config` before any LLM call. Fix: `hermes gateway install`, then `hermes gateway start`.
- **Weather:** there is no weather skill in the repo. The agent uses web search, so expect variable sources [UNVERIFIED quality].
- **Pitfall:** the `morning-brief` blueprint runs on weekends too. Use Variant 2, or edit it with `hermes cron edit <id> --schedule "30 7 * * 1-5"`.

#### B. Website change monitoring

**B1. Cheap, precise: monitor mode with a stable extraction script** [CODE `cron/monitor.py`; flags in `hermes_cli/subcommands/cron.py` L51-62]:

```bash
# ~/.hermes/scripts/watch-produkt.sh   (must print STABLE output: no timestamps, no session tokens)
#!/usr/bin/env bash
curl -fsSL "https://example.com/produkt" | grep -o 'data-price="[^"]*"' | head -1
```
```bash
chmod +x ~/.hermes/scripts/watch-produkt.sh
hermes cron create "every 2h" \
  "Die überwachte Seite hat sich geändert (siehe MONITOR CHANGE DETECTED). Beschreibe die Änderung alt → neu in einem Satz und nenne den Link https://example.com/produkt. Beim ersten Lauf (Baseline) nur den aktuellen Stand bestätigen." \
  --name "Produktseite" \
  --monitor-script watch-produkt.sh \
  --deliver telegram
```

How monitor mode behaves [CODE]:

- Each tick runs the source first and hashes the **exact output bytes**.
- **Unchanged:** the agent run is suppressed (a silent `no_change` run, zero tokens).
- **Changed:** a `## MONITOR CHANGE DETECTED` block with a unified diff (≤4,000 chars) plus the current output (≤8,000 chars) is injected into the prompt.
- **First run:** a `## Monitor Baseline (first run)` block, so the agent **does** run once.
- **Source failure:** recorded as an error, and the stored hash is untouched.
- **`--monitor-url <url>`:** a bounded GET (30 s, 256 KiB) hashes the **raw** response. Use it only for stable endpoints such as JSON APIs or plain text. Dynamic HTML (ads, CSRF tokens, timestamps) changes every tick and fires the agent every time.
- Monitor mode is mutually exclusive with `--no-agent`. It is barely mentioned in the website docs; the CLI help is the main reference.

**B2. Zero-token watchdog:** `--no-agent`. Script stdout is delivered verbatim, empty stdout is silent, and a non-zero exit sends an error alert (cron.md L889-922):

```bash
# ~/.hermes/scripts/disk-watch.sh   [REC, macOS-specific; the docs' examples use Linux tools like `free`]
#!/usr/bin/env bash
USED=$(df -P /System/Volumes/Data | awk 'NR==2 {gsub("%","",$5); print $5}')
[ "$USED" -ge 90 ] && echo "Mac mini: Datenvolume zu ${USED}% voll"
exit 0
```
```bash
hermes cron create "every 30m" --no-agent --script disk-watch.sh --deliver telegram --name "disk-watch"
```

**B3. Prices and availability with judgement:**

```
/blueprint price-watch item="https://example.com/produkt" condition="Gesamtpreis unter 199 €" interval_h=6 deliver=origin
```

- Uses the skill `product-price-monitor`. The first run pins the item and writes a watch contract, then it answers `[SILENT]` unless the condition is met (`cron/blueprint_catalog.py` L294-331).
- Every tick is a full agent run, so `interval_h` options 1/3/6/12/24 drive the cost.

#### C. Feed monitoring (RSS/Atom, GitHub releases)

**C1. Token-efficient: watcher script plus `wakeAgent` gate** [REC built from DOC facts]:

- `hermes skills install official/devops/watchers`. The scripts land in `~/.hermes/skills/devops/watchers/scripts/`. They are stdlib-only and print nothing when there are no new items. The first run records a baseline (`optional-skills/devops/watchers/SKILL.md`).
- A cron `--script` must live in `~/.hermes/scripts/`, so wrap the watcher. Any `python3` works, because the watcher scripts are stdlib-only:

```bash
# ~/.hermes/scripts/feeds-gate.sh
#!/usr/bin/env bash
OUT=$(python3 "$HOME/.hermes/skills/devops/watchers/scripts/watch_rss.py" --name meinfeed --url "https://example.com/feed.xml" --max 10)
if [ -z "$OUT" ]; then echo '{"wakeAgent": false}'; else echo "$OUT"; fi
```
```bash
hermes cron create "every 1h" \
  "Unten stehen neue Feed-Einträge aus dem Skript. Fasse nur die zu <Themen> relevanten in je einem deutschen Satz mit Link zusammen. Ist nichts relevant, antworte nur mit [SILENT]." \
  --name "Feed-Wächter" \
  --script feeds-gate.sh \
  --deliver telegram
```

- **How it works:** in default `--script` mode, the script output is injected into the prompt. A final line `{"wakeAgent": false}` skips the LLM run entirely: "a $0 way to decide whether a scheduled job should spend any LLM tokens" (cron.md L1227-1253).
- **Why not monitor mode here:** a delta-style watcher prints items once and then nothing. That flip from items to empty counts as a "change" and would wake the agent again. Monitor mode suits **state snapshots**; `wakeAgent` suits **deltas** [REC, from code semantics].
- For GitHub, use `watch_github.py --name <n> --repo <owner/repo> --scope releases|issues|pulls|commits`. Set `GITHUB_TOKEN` in `.env` **and** `terminal.env_passthrough: [GITHUB_TOKEN]`, because cron scripts get a sanitized environment.

**C2. Simpler, costs one agent run per tick** (doc example): `hermes cron create "every 1h" "Summarize new feed items" --skill blogwatcher`. The blogwatcher skill needs `blogwatcher-cli` (Go).

#### D. Weekly research digest

```bash
hermes cron create "every friday at 17:00" \
"Wöchentlicher Recherche-Digest auf Deutsch zu: <Thema 1>; <Thema 2>.
Suche substanzielle neue Entwicklungen der letzten 7 Tage, bevorzugt Primärquellen.
Folge dem grounded-citations-Skill: jede Aussage mit Quelle (Titel, Datum, Link); Fakten und Einschätzungen trennen.
Wiederhole nichts aus der vorherigen Ausgabe (steht im Kontext).
Format: höchstens 7 Punkte à 2–3 Sätze, danach 'Was das für mich bedeutet' (3 Stichpunkte).
Wenn es nichts Neues gibt: antworte nur mit [SILENT]." \
  --name "Recherche-Digest" \
  --skill grounded-citations \
  --continuity \
  --deliver telegram \
  --reasoning-effort high
```

- `--continuity` matters here: "Each run wakes up with the job's own previous output injected … so it can dedupe" (CLI help).
- **Blueprint alternative:** `/blueprint news-digest topic="KI-Agenten und Open-Source-LLMs" time=18:00 recurrence=weekdays count=5 deliver=origin`, then `hermes cron edit <id> --continuity`.
  - The blueprint prompt says "Dedupe against what you sent in previous runs", but blueprints do not set continuity.
  - `recurrence` only offers `everyday`, `weekdays` and `weekends` (`cron/blueprint_catalog.py` L37-41), so a weekly digest needs the manual job.
- **Bug [CODE, reproduced on a scratch copy of the catalog]:** `competitor-watch` defaults `recurrence` to `monday`, which is not a valid preset. Filling it with defaults raises `BlueprintFillError unknown recurrence 'monday' — one of everyday, weekdays, weekends`. Pass `recurrence=weekdays` (or another preset), or create the job manually (L332-370).
- **[REC]** For a broad digest, the prompt may ask for "delegate_task, ein Subagent pro Thema". This gives better coverage but multiplies tokens (Section 7.6).

#### E. Important-mail monitor

```
/blueprint important-mail interval_min=60 criteria="braucht heute eine Antwort, ist von <Chef/Familie>, oder nennt eine Frist" deliver=origin
```

- Uses the skill `email-inbox-triage` (`cron/blueprint_catalog.py` L124-153).
- Options for `interval_min` are 15/30/60. Every tick is an LLM run, so 30 min means 48 runs a day.
- **[REC]** Restrict it to working hours: `hermes cron edit <id> --schedule "0 8-19 * * 1-5"`.

#### F. Smart home: see Section 11.

### 7.4 Heartbeat and /loop [DOC]

- **Heartbeat** (heartbeat.md L7-60):
  - `/heartbeat every 15m Prüfe, ob der CI-Lauf für PR #12 fertig ist; fasse das Ergebnis zusammen, sobald er fertig ist`
  - Also `/heartbeat status|pause|resume|clear` (alias `/hb`).
  - It fires only between turns and missed ticks coalesce. On the gateway, a heartbeat turn may answer `[SILENT]`/`NO_REPLY` to stay quiet. It is cache-safe.
- **Loop** (loops.md L7-50):
  - `/loop 5m <prompt>` uses a fixed interval.
  - `/loop <prompt>` is self-paced: it starts at 1 min and backs off to 15 min while replies do not change.
  - `/loop 10m /recap` loops a slash command.

### 7.5 /goal: judge-driven persistence [DOC] (goals.md)

- **Commands** (L56-75):
  - `/goal <text>`, `/goal draft <text>` (drafts a contract via the `goal_judge` aux model)
  - `/goal show`, `/goal status`, `/goal pause`, `/goal resume` (resets the counter), `/goal clear`
  - `/goal wait <pid>`, `/goal unwait`
  - `/goal gate add <command>`, `/goal gate list|remove <N>|clear`
  - `/subgoal …`
- **Contract fields** (L81-118): `verify:`, `constraints:`, `boundaries:`/`scope:`, `stop when:`. Example:
  ```
  /goal Login-Seite auf OAuth umstellen
  verify: npm test passes and the login E2E test is green
  constraints: keep the /login response shape unchanged
  boundaries: only touch src/auth and its tests
  stop when: a database migration is required
  ```
- **Quality gates** (L136-154): deterministic shell commands that must exit 0 before the judge even runs, with 3 retries and a 5-minute timeout per gate.
  - **Telegram pitfall [CODE]:** `/goal gate add` needs an **explicitly configured gateway admin** (`gateway/slash_commands_goals.py` L41-44; `gateway/slash_commands_session.py` L303-313). Add yourself:
    ```yaml
    gateway:
      platforms:
        telegram:
          extra:
            allow_admin_from:
              - "<your Telegram user id>"
    ```
    (`website/docs/user-guide/messaging/telegram.md` L1202-1232)
- **Budget and judge:**
  - `goals.max_turns: 20` (default).
  - Judge: `auxiliary.goal_judge`, which defaults to the main model. Each call sends the goal plus the last ~4 KB of the response and gets back about 200 output tokens. On judge errors it "fails open" (continue).
  - **[REC]** Keep the judge on the main model (`auto`). Calls are tiny, and judge accuracy decides between a premature "done" and endless continuation. Only route it to a cheaper model if `/usage` shows it matters.

### 7.6 Delegation and /review [DOC/CODE]

- **Defaults** (delegation.md L631-660; `hermes_cli/config_defaults.py`):
  - `max_concurrent_children: 10` (**[CONFLICT]** overview.md L27 says 3)
  - `max_spawn_depth: 1`
  - `max_iterations: 250` per child
  - `child_timeout_seconds: 0`
  - `subagent_auto_approve: false`: dangerous commands in children are auto-denied, "true only for trusted batch work"
  - `worktree_isolation: false`, which gives each child its own git worktree off HEAD, local backend only (L581-616)
  - Children inherit MCP toolsets.
  - Subagents do **not** get SOUL.md (fallback identity).
- **Cost lever:** `delegation.model` / `delegation.provider`.
  - "Pinning `delegation.model` to an inexpensive model while your main session stays on a frontier model keeps the planning quality where it matters and cuts spend where the volume is."
  - The pin applies to all children; there is no per-task model (L264-292).
- **`/review [focus]`** spawns a full-privilege reviewer subagent over the last 10 messages and the actual work (PR, diff). Choose its model with:
  ```yaml
  auxiliary:
    review:
      provider: openrouter
      model: anthropic/claude-opus-4.6   # doc example: "a strong reviewer model"
  ```
  (L294-327)
- **[REC] for this budget:**
  - For research fan-outs, set `delegation.model` to a capable mid-tier model and keep the main model frontier.
  - Set `auxiliary.review` to a **different** frontier model family for a genuine second opinion. The model ID above is the doc's example; check what your provider offers.

### 7.7 Mixture of Agents [DOC] (mixture-of-agents.md)

- **What it is.** A virtual provider: reference models advise once per user turn (`fanout: user_turn` by default), and the aggregator acts and is billed for "the whole run".
- **Default preset:**
  - references `openai-codex:gpt-5.5` and `openrouter:deepseek/deepseek-v4-pro`
  - aggregator `openrouter:anthropic/claude-opus-4.8`
  - The `openai-codex` reference needs Codex OAuth (`hermes auth add openai-codex`).
- **Benchmark:** HermesBench MoA (opus-4.8 aggregating a gpt-5.5 reference) **0.8202**, vs. opus-4.8 alone 0.7607 and gpt-5.5 alone 0.7412.
- **Usage:**
  - `/moa <prompt>` is one-shot: it runs that turn through the default preset and then restores your model.
  - `/model <preset> --provider moa` switches the session.
  - Manage presets with `hermes moa list`, `hermes moa configure [name]`, `hermes moa delete <name>`.
- **Caching:** MoA does not break the prompt cache. Its extra cost is the reference calls.
- **[REC]** Do not run MoA as the session model on this budget. Use `/moa` for genuinely hard decisions: architecture choices, an important email, contradictory research. Configure a cheaper preset if the default providers are not set up.

### 7.8 Blueprints and /suggestions

- **Catalog keys** (`cron/blueprint_catalog.py`):
  - morning-brief, important-mail, weekly-review (skill weekly-review-planning; day sunday/monday/friday/saturday; default 18:00)
  - workday-start, custom-reminder, evening-winddown
  - news-digest, bill-renewal-watch, price-watch, competitor-watch (bug, see 7.3 D)
  - habit-checkin, hydration-move, meal-plan, learn-daily, gratitude-journal, on-this-day
- `/suggestions [accept|dismiss N | catalog]` reviews suggested automations (`hermes_cli/commands.py` L278-280).

### 7.9 Other automation surfaces (brief)

- **Webhooks:** `hermes webhook subscribe <name> --events "pull_request" --prompt "…" --deliver github_comment`. GitHub must reach the gateway's webhook port (8644 in the doc example), which for a home Mac means a tunnel or port forward. **[REC]** Prefer a scheduled `gh`-based cron job unless real-time reaction matters. The blueprint guide's `--skills github-code-review` uses an outdated skill name; use `github` (`guides/automation-blueprints.md` L56-100).
- **BOOT.md:** a DIY gateway-startup hook (tutorial in `features/hooks.md` L203-245). "Hermes does not ship a built-in BOOT.md hook."
- **Kanban:** a multi-profile task board (`features/kanban.md`). It is overkill for a single user.

---

## 8. Coding workflows (small GitHub-hosted web app)

1. **Project context.**
   - In the repo, run `/init` (or `/init Fokus auf Tests und Deploy`) to generate or update `AGENTS.md` (slash-commands.md L113).
   - Put personal, untracked rules in `AGENTS.override.md` (Section 4.4).
   - Set `agent.coding_instructions: "…"` for standing rules across projects.
2. **GitHub via `gh`.**
   - Use the `github` skill. Auth, issues, PR workflow and issue-to-PR live in its references.
   - `brew install gh` and `gh auth login` are general tooling, not quoted from the repo. The skill's `references/auth.md` covers auth, and the GitHub MCP is deliberately not in the catalog.
   - Pair it with `requesting-code-review`, `systematic-debugging`, `test-driven-development`, `dogfood` (QA of web apps) and `simplify-code`.
3. **Safety nets:**
   - Turn on checkpoints with `checkpoints.enabled: true`, or `hermes chat --checkpoints`. Then `/rollback`, `/rollback diff <N>`, `/rollback <N> <file>`. They are opt-in; the store lives in `~/.hermes/checkpoints/store/` and your `.git` is untouched (`website/docs/user-guide/checkpoints-and-rollback.md` L10-46).
   - **[CONFLICT]** `overview.md` L22 says checkpoints are automatic.
4. **Isolation:**
   - `/worktree new <name>` (interactive CLI) creates `.worktrees/<name>/` on branch `hermes/<name>` and retargets the session's terminal and file tools. `/worktree list` lists the trees. On exit a tree is kept only if it has unpushed commits, "exactly like `hermes -w`" (`website/docs/user-guide/git-worktrees.md` L38-56).
   - `delegation.worktree_isolation: true` gives parallel children separate worktrees.
5. **Getting to done:**
   - Run `/goal` with a contract and `/goal gate add npm test`, or your test command (Section 7.5).
   - `agent.verify_on_stop: "auto"` (opt-in; on for CLI/TUI/desktop, off for messaging) refuses "done" without fresh test, build or lint evidence (`website/docs/user-guide/configuration.md` L1258-1280).
   - `/review` with a strong `auxiliary.review` model before merging.
6. **External coding agents:**
   - `claude-code` skill: install `npm install -g @anthropic-ai/claude-code`, auth by running `claude` once. Its preferred print mode is `claude -p '…' --allowedTools 'Read,Edit' --max-turns 10` run from the terminal tool (`skills/autonomous-ai-agents/claude-code/SKILL.md` L17-40).
   - `codex` skill: `npm install -g @openai/codex`. It must run inside a git repo with `pty=true` (`skills/autonomous-ai-agents/codex/SKILL.md` L26-37).
   - `opencode` skill.
   - Codex as an MCP server: `hermes mcp add codex --preset codex` (mcp.md L541-563).
7. **IDE (ACP):**
   - `hermes acp` serves Hermes to ACP clients. Check with `hermes acp --check`; optional browser bootstrap with `hermes acp --setup-browser`.
   - VS Code: the "ACP Client" extension, or `"acp.agents": {"Hermes Agent": {"command": "hermes", "args": ["acp"]}}`.
   - Zed: `"agent_servers": {"hermes-agent": {"type": "custom", "command": "hermes", "args": ["acp"]}}` (`website/docs/user-guide/features/acp.md` L62-112, L198-250).
   - `/goal` is not available over ACP (goals.md L75).
8. **Codex app-server runtime** (opt-in; `website/docs/user-guide/features/codex-app-server-runtime.md`):
   - **What it does:** hands `openai/*`, `openai-codex/*` and named-custom-provider turns to `codex app-server`. That gives ChatGPT-subscription billing, Codex's sandbox and native Codex plugins (Gmail, Google Calendar, Outlook, GitHub, Linear …).
   - **Commands:** `/codex-runtime codex_app_server` turns it on and `/codex-runtime auto` turns it off. Synonyms are `on`/`off`.
   - **What still works:** the persona (SOUL, MEMORY, USER) is sent once at thread start and memory/skill nudges keep working.
   - **What is lost:** `delegate_task`, the `memory` tool, `session_search` and `todo` are **unavailable** on this runtime (L72-80, L107-114). Cron on it is "Not specifically tested".
   - **[REC]** Do not use it for the assistant profile. Consider it only for a separate coding profile when the ChatGPT subscription is the budget lever.
9. **Library docs:** add `hermes mcp install context7` and `hermes mcp install deepwiki` (Section 6.8).
10. **Scheduled repo hygiene:** a cron job with `--workdir`, which loads `AGENTS.md` and runs the tools from the repo:
    ```bash
    hermes cron create "every monday at 8:00" \
      "Prüfe offene PRs, Issues und den CI-Status von <owner>/<repo> mit gh. Fasse auf Deutsch zusammen: was blockiert, was ist reif zum Mergen, welche Abhängigkeiten sind veraltet. Nichts ändern." \
      --name "Repo-Wochencheck" --skill github --workdir /Users/<you>/code/<repo> --deliver telegram
    ```

---

## 9. macOS / Apple integrations

| Need | Integration | Setup (verbatim from skill) | Permission notes |
|---|---|---|---|
| Reminders | `apple-reminders` (remindctl) | `brew install steipete/tap/remindctl`; check `remindctl status`, request `remindctl authorize` | "Grant Reminders permission when prompted" |
| Notes | `apple-notes` (memo) | `brew tap antoniorodr/memo && brew install antoniorodr/memo/memo` | Automation access to Notes.app (Privacy → Automation) |
| iMessage/SMS | `imessage` (imsg) | `brew install steipete/tap/imsg` | Full Disk Access for the terminal and Automation for Messages.app |
| Find My | `findmy` | `brew install steipete/tap/peekaboo` (UI automation method) | Screen Recording |
| **Calendar** | **No Apple Calendar skill, MCP or tool in the repo** (searched skills, optional-skills, optional-mcps, plugin-catalog). `apple-reminders` itself says "Calendar events → use Apple Calendar or Google Calendar" | Use Google Calendar via `google-workspace`, Microsoft via the `microsoft365` plugin, or Codex-runtime plugins (Section 10) | – |
| **Mail.app** | **No Mail.app integration in the repo** | Use `himalaya` (IMAP/SMTP; works with any IMAP provider) or `google-workspace` | – |
| GUI control | `computer_use` toolset (cua-driver) | `hermes computer-use install`, `hermes computer-use doctor`, `hermes computer-use permissions grant`; start a session with `hermes -t computer_use chat` | Accessibility and Screen Recording for **CuaDriver (`com.trycua.driver`)**; reset stale grants with `tccutil reset Accessibility com.trycua.driver` |

Sources: `skills/apple/*/SKILL.md`; `website/docs/user-guide/features/computer-use.md` L60-150, L370-385, L645-670.

- **launchd PATH.** Every brew-installed CLI used by the gateway or cron requires re-running `hermes gateway install` (FAQ L514-529). Verify with `/usr/libexec/PlistBuddy -c "Print :EnvironmentVariables:PATH" ~/Library/LaunchAgents/ai.hermes.gateway.plist`.
- **[UNVERIFIED] TCC under launchd.** The docs describe granting permissions to "the terminal". When the CLIs run from the launchd gateway (Telegram or cron), I could not find which process identity macOS attributes the request to. **Test each integration once from Telegram** after setup. If it fails while the terminal works, grant Full Disk Access or Automation to the binary named in the macOS prompt or log.
  - The desktop doc advises one **Full Disk Access** grant for the terminal app (and Hermes.app) to silence folder prompts. `hermes doctor` reports whether the current terminal has it (`website/docs/user-guide/desktop.md` L767-781).
- **Computer use specifics:**
  - Its actions (click, type, …) require approval like dangerous commands. In cron they are refused unless `computer_use.permission_mode: bounded` with a reviewed `capability_manifest`, or yolo mode.
  - Hard-blocked: empty trash, force delete, lock screen, log out.
  - It costs about 30K tokens per 20 actions.
  - Browser work goes through the `browser` toolset, not `computer_use`.
  - **[CONFLICT]** `cli-commands.md` L1699-1704 says `hermes computer-use install` "runs the same upstream installer". `computer-use.md` L76-81 says it "asks PM to prepare the pinned `cua-driver` package … it does not run the upstream installer".
- **Keeping the Mac awake:** `caffeinate` (Section 1).

---

## 10. Google and Microsoft mail and calendar

- **Google: `google-workspace`** (`skills/productivity/google-workspace/SKILL.md`). It uses `gws` when installed, otherwise the bundled Python client.
  - **Easiest path [REC]:** ask Hermes (CLI or Telegram) to set up Google Workspace. The skill is written so "you drive it step by step so it works on CLI, Telegram, Discord". The script must run with "Python from the Hermes environment, not an unrelated system Python", which matters on macOS, where a bare `python` may not exist in your shell.
  - Shorthand: `GSETUP="python ${HERMES_HOME:-$HOME/.hermes}/skills/productivity/google-workspace/scripts/setup.py"`.
  - **Steps:**
    1. Create a Google Cloud project and enable the APIs (Gmail, Calendar, Drive, Sheets, Docs, People).
    2. Create an OAuth client of type **"Desktop app"**. Add yourself as a test user while the app is in Testing.
    3. `$GSETUP --client-secret /path/to/client_secret.json`
    4. `$GSETUP --auth-url --services email,calendar --format json`. Open the URL; the browser ends on `http://localhost:1/?code=…`, which is expected. Copy the full URL.
    5. `$GSETUP --auth-code "<pasted URL or code>" --format json`
    6. `$GSETUP --check` → `AUTHENTICATED`. The token in `~/.hermes/google_token.json` auto-refreshes.
  - **Email only?** The skill itself says to use `himalaya` with a Gmail App Password instead: "takes 2 minutes … No Google Cloud project needed."
  - **[UNVERIFIED, outside-repo knowledge]** Google may expire refresh tokens of OAuth apps left in "Testing" status after a short period. If the morning brief starts failing with `REFRESH_FAILED` ("Token revoked or expired — redo Steps 3-5", SKILL.md L332), publish the OAuth app or re-authorize.
- **Any IMAP provider: `himalaya`** ("IMAP/SMTP email from terminal"). Whether iCloud or Outlook.com work with it depends on their IMAP auth requirements, which are not covered in the repo [UNVERIFIED].
- **Microsoft 365:**
  - **Community plugin `microsoft365`** (`plugin-catalog/microsoft365.yaml`): "Pre-release Microsoft 365 Graph tools for Outlook, SharePoint, OneDrive, Calendar, Teams, To Do, and Planner".
  - Version `0.1.0a4`, `requires_hermes: ">=0.21.3,<0.22"`, needs `MICROSOFT365_CLIENT_SECRET` and an Entra app registration (`website/docs/guides/microsoft-graph-app-registration.md` covers the registration for the Teams pipeline).
  - **[REC]** Treat it as experimental. Its version pin excludes a future 0.22.
- **Other routes:**
  - The Codex app-server runtime auto-migrates Codex plugins (Gmail, Google Calendar, Outlook calendar and email), with the tool losses noted in Section 8.
  - On a Nous account, `manage_connections` can connect managed connector accounts (`connections` toolset, `toolsets-reference.md` L58). Availability depends on the account [UNVERIFIED].
- **Triage policy:** `email-inbox-triage` defaults to "read + draft, not send/delete — 'handle my inbox' does not imply permission to send or delete". Keep it that way. The SOUL.md template in 4.2 adds the same boundary.

---

## 11. Home Assistant (smart home)

Source: `website/docs/user-guide/messaging/homeassistant.md` [DOC].

- **Install:** `hermes plugins install homeassistant`. This is an **official plugin**, formerly built into core, and requires Hermes ≥ 0.21.5 (`plugin-catalog/homeassistant.yaml`).
- **`~/.hermes/.env`:**
  ```bash
  HASS_TOKEN=<long-lived access token>
  HASS_URL=http://<ha-ip>:8123              # default http://homeassistant.local:8123
  HASS_HOME_CHANNEL=mobile_app_<your_phone> # default notify target for bare `deliver: homeassistant`
  ```
- **Tools:** `ha_list_entities`, `ha_get_state`, `ha_list_services`, `ha_call_service`. The toolset is enabled automatically when `HASS_TOKEN` is set, and the tools sit behind tool search.
- **Blocked service domains:** `shell_command`, `command_line`, `python_script`, `pyscript`, `hassio`, `rest_command`. Entity IDs are validated.
- **From Telegram:** "Schalte im Wohnzimmer das Licht aus" → `ha_call_service(domain="light", service="turn_off", …)`.
- **Scheduled check** [REC]:
  ```bash
  hermes cron create "every day at 22:30" \
    "Prüfe mit den Home-Assistant-Tools, ob alle Türen und Fenster (binary_sensor) geschlossen sind und die Alarmanlage scharf ist. Melde nur Abweichungen; ist alles in Ordnung, antworte nur mit [SILENT]." \
    --name "Abendcheck Haus" --deliver telegram
  ```
  `deliver: homeassistant:<notify target>` or `deliver: homeassistant` sends to HA notify instead.
- **Real-time events.**
  - The gateway platform subscribes to `state_changed` events. **Nothing is forwarded until you configure filters**:
    ```yaml
    platforms:
      homeassistant:
        enabled: true
        extra:
          watch_domains: [climate, binary_sensor, alarm_control_panel]
          ignore_entities: [sensor.uptime]
          cooldown_seconds: 30
    ```
  - The agent's responses to HA events are posted as **HA persistent notifications** (title "Hermes Agent"), not to Telegram.
  - Routing event reactions to Telegram is not documented [UNVERIFIED]. The documented way to get HA-based alerts on Telegram is a cron poll with `--deliver telegram`, as in the scheduled check above.
- **Philips Hue without HA:** `hermes skills install official/smart-home/openhue`.

---

## 12. Voice (brief)

Sources: `website/docs/user-guide/configuration.md` L2428-2530; `features/tts.md`; `messaging/telegram.md` L454-500; `features/voice-mode.md` L280-297 [DOC].

- **Incoming Telegram voice notes** are transcribed automatically (`stt.enabled: true`).
  - Set `stt.language: "de"`. The default `"en"` mis-transcribes German.
  - `stt.echo_transcripts: true` posts the transcript back (`🎙️ "…"`).
  - `stt.prompt: "<Namen, Fachbegriffe>"` biases vocabulary for local, OpenAI, Groq, Mistral and DeepInfra, up to about 224 tokens. The prompt is uploaded to cloud providers.
- **STT providers:**
  - `local` (faster-whisper; models tiny/base/small/medium/large-v3; default `base`). Install with `python -c "import pm; pm.sync_venv(['stt-whisper'], explicit=True)"`.
  - `groq` (`GROQ_API_KEY`; `STT_GROQ_MODEL=whisper-large-v3-turbo`).
  - `openai` (`VOICE_TOOLS_OPENAI_KEY`; whisper-1, gpt-4o-mini-transcribe, gpt-4o-transcribe or gpt-transcribe). The repo cites $0.0045/min for OpenAI gpt-transcribe (`features/voice-mode.md` L538).
  - An explicitly chosen provider is used strictly, with no silent fallback.
  - **[REC]** For German accuracy, use a larger local model (`small` or `medium`) or Groq or OpenAI. faster-whisper speed on Apple-Silicon CPUs is not documented [UNVERIFIED].
- **Voice replies on Telegram:** `/voice on` speaks replies only to voice messages; `/voice tts` speaks every reply; `/voice off`; `/voice status`.
- **TTS providers:**
  - `edge` is the free default. It needs `brew install ffmpeg` for real voice bubbles (otherwise it sends an audio file), followed by `hermes gateway install` for PATH. Pick a German voice; the voice IDs are not in the repo [UNVERIFIED].
  - `elevenlabs` (default model `eleven_multilingual_v2`), `openai` (`gpt-4o-mini-tts`), `gemini` (free tier), `xai`, `mistral`, `minimax`, and local `piper`, `kittentts` and `neutts`.
  - ElevenLabs and OpenAI produce Opus natively.
  - Nous Portal subscribers get OpenAI TTS through the Tool Gateway.
- **Desktop GPT-Live voice** (`voice.voice_chat_mode: gpt-live`) costs "$0.05/min voice layer billing" (`hermes_cli/config_defaults.py`). It does not apply to Telegram.

---

## 13. Consolidated quality-first config for this profile [REC; every key verified above]

```yaml
# ~/.hermes/config.yaml — additions/overrides (merge into the installer-generated file)
timezone: "Europe/Berlin"

display:
  language: de                     # static UI only; German answers come from SOUL.md
  memory_notifications: verbose    # see every learned fact; later "on"

gateway:
  message_timestamps:
    enabled: true                  # temporal reasoning in long Telegram chats
  # NOTE: gateway.platforms.* and top-level platforms.* blocks are both read and merged
  # (top-level wins on conflicts; `extra` is deep-merged) — gateway/config_loader.py L139-169
  platforms:
    telegram:
      extra:
        allow_admin_from: ["<your Telegram user id>"]   # needed for /goal gate add on Telegram

platform_hints:
  telegram:
    append: "Kurze, gut scannbare Telegram-Nachrichten; lange Inhalte gliedern."

memory:
  write_approval: false
  nudge_interval: 10
  # memory_char_limit: 3000        # optional raise (default 2200)
  # user_char_limit: 2000          # optional raise (default 1375)

skills:
  creation_nudge_interval: 15      # explicit (example config 15 vs code fallback 10)
  write_approval: false            # switch to true if verbose notices show bad skills
  guard_agent_created: true        # optional dangerous-pattern scan

auxiliary:
  background_review:
    enabled: true
    provider: "auto"               # main (frontier) model = best learning, warm cache
  goal_judge:
    provider: "auto"               # tiny calls; accuracy matters
  # review:                        # strong second-opinion model for /review
  #   provider: <provider>
  #   model: <model>

prompt_caching:
  cache_ttl: "auto"                # 1h for chats, 5m for machine-paced runs

compression:
  idle_compact_after_seconds: 1800
  # threshold_tokens: 256000       # only for 1M-window main models

sessions:
  auto_prune: true
  retention_days: 365              # longer session_search recall (watch disk)

web:
  search_backend: "exa"            # or "parallel"; set keys in ~/.hermes/.env
  extract_backend: "firecrawl"

stt:
  language: "de"

checkpoints:
  enabled: true                    # /rollback safety net for coding

# agent:
#   verify_on_stop: "auto"         # coding: require test/build evidence on CLI/TUI
#   coding_instructions: ""        # standing coding rules
```

```bash
# ~/.hermes/.env (names only; values from the providers)
EXA_API_KEY=...
FIRECRAWL_API_KEY=...
TELEGRAM_HOME_CHANNEL=...           # or send /sethome in the DM
# TELEGRAM_CRON_THREAD_ID=...       # if DM topic mode is on
# HASS_TOKEN=... HASS_URL=... HASS_HOME_CHANNEL=...
```

After editing: run `hermes doctor`, restart the gateway with `hermes gateway restart` (tool and skill config changes need it; `compression.*` and `model.context_length` hot-reload), then `/new` in Telegram.

---

## 14. Contradictions found (docs vs docs or docs vs code)

| # | Topic | Claim A | Claim B (authoritative) |
|---|---|---|---|
| 1 | Tool search default | "opt-in" (`features/tool-search.md` L13) | Default `enabled: auto`, and "'auto' is an alias of 'on' today"; activates whenever deferrable tools exist (`tools/tool_search.py` L43, L195-204) |
| 2 | Prompt-cache TTL | "1-hour prefix cache … Always-on" (`features/overview.md` L47); "attaches … 1-hour TTL" (`configuration.md` L1374) | Default `cache_ttl: "5m"` (`config_defaults.py`; `configuration.md` L1381-1384) |
| 3 | Subagent concurrency | "Run 3 concurrent subagents by default" (`features/overview.md` L27) | 10 (`features/delegation.md` L211; code default) |
| 4 | Checkpoints | "Hermes automatically snapshots" (`features/overview.md` L22) | Opt-in, `checkpoints.enabled: false` (`checkpoints-and-rollback.md` L10) |
| 5 | Natural-language schedules | "Natural language like `daily at 9am` is not supported" (`guides/automate-with-cron.md` L288) | Supported (`features/cron.md` L1115-1126; `cron/jobs.py` L699-764) |
| 6 | Cron execution | "executes jobs sequentially" and "Jobs use the local timezone" (`guides/cron-troubleshooting.md` L201, L47) | Parallel by default (`cron.max_parallel_jobs: null`); `timezone` key governs schedules (`configuration.md` L2790-2802) |
| 7 | Cron and memory (misleading wording rather than a hard contradiction) | "cron jobs run in fresh sessions without conversational memory" and "no memory of your previous conversations" (`guides/daily-briefing-bot.md` L122, L195) | SOUL.md and MEMORY.md/USER.md load in cron (`cron/scheduler.py` L2529-2532); "Persistent memory does load" (`guides/automate-with-cron.md` L130). (No *conversation history* is correct.) |
| 8 | Curator timings | "(30d unused) stale → (90d unused) archived" (`features/curator.md` L305) | 14 / 30 days (same page L49-62; defaults) |
| 9 | Skill nudge default | `creation_nudge_interval: 15` (`cli-config.yaml.example` L1156) | Code fallback 10 (`agent/agent_init.py` L1409-1413); key absent from `DEFAULT_CONFIG` |
| 10 | Turn cap | `max_turns: 500` "(default: 500)" (`cli-config.yaml.example` L1170-1174) | `None` = unlimited; "caps caused silent mid-task truncation" (`config_defaults.py` L75-78). The installer copies the example, so new installs have 500 |
| 11 | MCP tool names | `mcp_<server>_<tool>` (`features/mcp.md` L565-582) | `mcp__<server>__<tool>`, 64-char clamp (`tools/mcp_tool_schema.py` L153-175; `reference/tools-reference.md` L14) |
| 12 | SOUL.md reload | "loaded fresh each message -- no restart needed" (`hermes_cli/default_soul.py` L24) | "restart Hermes or start a new session" (`guides/use-soul-with-hermes.md` L226); the system prompt is frozen per session |
| 13 | Memory at reset | "Before reset, the agent saves memories and skills" (`sessions.md` L999, L1076) | No built-in extraction on `/new`/`/reset` found; only external-provider `on_session_end` and post-turn reviews (`run_agent.py` L916-921; `agent/agent_init.py` L1366-1403) |
| 14 | `hermes computer-use install` | "runs the same upstream installer" (`reference/cli-commands.md` L1699-1704) | "does not run the upstream installer" (PM-pinned package) (`features/computer-use.md` L76-81) |
| 15 | UI languages | "ships 17 UI languages" (`features/language-packs.md` L9) | "the 16 bundled" (same file L150); `configuration.md` lists 17 values including `en` |
| 16 | Outdated skill names | `/github-pr-workflow` (troubleshooting-agent-quality L114), `github-pr-workflow` in the `skills.auto_load` example (configuration.md L818), `--skills github-code-review` (automation-blueprints L79, L102), `github-auth` (mcp.md L306) | Consolidated into the `github` skill (`skills/software-development/github/SKILL.md`) |
| 17 | rss-feeds location | "the bundled `rss-feeds` skill" (`optional-skills/research/blogwatcher/SKILL.md` L27) | It is in `optional-skills/research/rss-feeds` |
| 18 | `hermes-telegram` toolset | "Same as `hermes-cli`" (`reference/toolsets-reference.md` L101) | Example-config comment lists a smaller set (`cli-config.yaml.example` L1403) |
| 19 | Telegram command limit | "Telegram has a 100 slash command limit" (`reference/faq.md` L766) | Menu cap default 60, clamped 1..100; inline picker uncapped (`messaging/telegram.md` L164-207) |
| 20 | tool_use_enforcement auto list | Config comment: "'auto' = gpt/codex models" (`config_defaults.py` L163-166) | Code and docs: gpt, codex, gemini, gemma, grok, glm, qwen, deepseek, muse (`agent/prompt_builder.py` L362; `configuration.md` L2015) |

---

## 15. Not verified / open questions (flag these in the German guide)

1. **v0.21.5 vs main.** No tags or changelog in the shallow clone and no API access, so it is unknown which features described here are in the stable release. The reader should check `--help` output on their own install.
2. **Real prompt sizes** and **tool-search savings** were not measured, because Hermes was not run. Use `hermes prompt-size --platform telegram` and `/context all`.
3. **Built-in memory saving on `/new`**: the code shows none. The `/refine`-before-`/new` habit covers it either way.
4. **Effect of removing `session_search` from the `defer` list** on recall quality is untested.
5. **German Edge TTS voice IDs** are not in the repo.
6. **TCC permission attribution** when Apple CLIs run from the launchd gateway is undocumented. Test from Telegram.
7. **Google OAuth "Testing" refresh-token expiry** is outside-repo knowledge.
8. **Continuable cron on a Telegram DM without topic mode.** The docs list only Telegram topics. The code falls back to a DM mirror when no thread can be created.
9. **`hermes tools disable … --platform cron`.** The platform key `cron` exists in `hermes_cli/platforms.py` L35, but the command was not run.
10. **Nous Portal / Tool Gateway pricing** is not in the repo.
11. **faster-whisper performance on Apple Silicon**, and which local model size suits German, is undocumented.
12. **`microsoft365` plugin** maturity (0.1.0a4) and its compatibility with `main` builds beyond 0.21.x.
13. **Web backend quality ranking.** There is no benchmark in the repo; the recommendations derive from the doc descriptions.
14. Whether `hermes curator run --consolidate --dry-run` can be combined is not documented as a pair.
15. **Routing Home Assistant event reactions to Telegram** is undocumented.
16. **Weather in the morning brief.** There is no weather skill; the agent uses web search.

---

## 16. Top 10 quality and effectiveness settings and habits (based only on verified facts)

1. **German by design, not by luck.**
   - Put the language rule in `~/.hermes/SOUL.md` (persona slot #1), then `/new`.
   - Set `stt.language: "de"` and `timezone: "Europe/Berlin"`.
   - `display.language: de` only translates static UI.
2. **Seed memory deliberately and verify it.**
   - Accept the first-DM profile-build offer.
   - Have facts saved with the `memory` tool and check `~/.hermes/memories/USER.md` and `MEMORY.md`.
   - Put procedures into skills, not memory (2,200/1,375-char budgets).
3. **Create session boundaries on Telegram.**
   - `/refine`, then `/new`, at task, topic or day boundaries. A Telegram chat never resets by itself and memory "pays off at boundaries".
   - Use DM topics, one per use case, with `skill:` binding.
4. **Keep the learning loop on the strong model, visibly.**
   - `auxiliary.background_review.provider: auto` (main model, warm cache) plus `display.memory_notifications: verbose`.
   - Prune with `hermes journey list`/`delete`, `hermes curator status` and `hermes curator pin`.
5. **Protect the prompt cache.**
   - `prompt_caching.cache_ttl: "auto"` (about 40% lower interactive cache-write bill per the docs).
   - Avoid mid-session `/model` switches.
   - `compression.idle_compact_after_seconds: 1800` for threads you return to.
6. **Research quality.**
   - A keyed semantic search backend (Exa or Parallel) plus full-page extract (Firecrawl), via `web.search_backend`/`web.extract_backend`.
   - Answers grounded with the `grounded-citations` skill.
   - `--continuity` on recurring digests so they do not repeat themselves.
7. **Lean, gated automations.**
   - Self-contained cron prompts with `[SILENT]` when there is nothing to say.
   - For monitors: `--no-agent` for watchdogs, `--monitor-script` for stable state, a `wakeAgent:false` gate for feeds.
   - Health checks with `hermes cron status` and `hermes cron doctor`.
   - Create jobs with `hermes cron create`; `/cron` is CLI-only.
8. **Measure instead of guessing.** `hermes prompt-size --platform telegram`, `/context all`, `/usage`, `/insights`. Trim only toolsets you never use; tool search already defers MCP, plugin and cold tools.
9. **Coding with mechanical proof.**
   - `/init` → AGENTS.md, the `github` skill with `gh`, and `checkpoints.enabled: true`.
   - `/goal` with a contract plus `/goal gate add <test command>`. On Telegram, set `allow_admin_from` first.
   - `/review` on a strong, different reviewer model (`auxiliary.review`).
10. **Spend extra tokens only where they buy quality.**
    - `/moa` as a one-shot for hard decisions (MoA 0.8202 vs 0.7607 on HermesBench). Never use it as the session model on this budget.
    - `delegation.model` on a capable mid-tier model for fan-outs.
    - Keep the goal judge on the main model (tiny calls).
    - Set `sessions.retention_days: 365` if long-term recall matters.

---

## Appendix A. Sources (repo-relative path and GitHub URL)

Line numbers in the text refer to commit `1298c8e` on `main`.

**Shorthand used in the text:**

| Shorthand | Full path |
|---|---|
| `features/<x>.md` | `website/docs/user-guide/features/<x>.md` |
| `messaging/<x>.md` | `website/docs/user-guide/messaging/<x>.md` |
| `guides/<x>.md` | `website/docs/guides/<x>.md` |
| `reference/<x>.md` | `website/docs/reference/<x>.md` |
| bare `configuration.md`, `sessions.md`, `desktop.md` | `website/docs/user-guide/<file>` |
| bare `memory.md`, `skills.md`, `curator.md`, `cron.md`, `goals.md`, `heartbeat.md`, `loops.md`, `mcp.md`, `browser.md`, `web-search.md`, `tool-search.md`, `personality.md`, `context-files.md`, `delegation.md`, `overview.md` | `website/docs/user-guide/features/<file>` |
| bare `tips.md` | `website/docs/guides/tips.md` |
| bare `slash-commands.md`, `cli-commands.md`, `toolsets-reference.md` | `website/docs/reference/<file>` |

**Sources:**

- `SOUL.md` — https://github.com/NousResearch/hermes-agent/blob/main/SOUL.md
- `cli-config.yaml.example` — https://github.com/NousResearch/hermes-agent/blob/main/cli-config.yaml.example
- `run_agent.py` — https://github.com/NousResearch/hermes-agent/blob/main/run_agent.py
- `agent/agent_init.py` — https://github.com/NousResearch/hermes-agent/blob/main/agent/agent_init.py
- `agent/context_compressor.py` — https://github.com/NousResearch/hermes-agent/blob/main/agent/context_compressor.py
- `agent/prompt_builder.py` — https://github.com/NousResearch/hermes-agent/blob/main/agent/prompt_builder.py
- `agent/skill_utils.py` — https://github.com/NousResearch/hermes-agent/blob/main/agent/skill_utils.py
- `agent/turn_context.py` — https://github.com/NousResearch/hermes-agent/blob/main/agent/turn_context.py
- `agent/turn_finalizer.py` — https://github.com/NousResearch/hermes-agent/blob/main/agent/turn_finalizer.py
- `cron/blueprint_catalog.py` — https://github.com/NousResearch/hermes-agent/blob/main/cron/blueprint_catalog.py
- `cron/jobs.py` — https://github.com/NousResearch/hermes-agent/blob/main/cron/jobs.py
- `cron/monitor.py` — https://github.com/NousResearch/hermes-agent/blob/main/cron/monitor.py
- `cron/scheduler.py` — https://github.com/NousResearch/hermes-agent/blob/main/cron/scheduler.py
- `cron/scheduler_delivery.py` — https://github.com/NousResearch/hermes-agent/blob/main/cron/scheduler_delivery.py
- `gateway/config_loader.py` — https://github.com/NousResearch/hermes-agent/blob/main/gateway/config_loader.py
- `gateway/run_turn_runner.py` — https://github.com/NousResearch/hermes-agent/blob/main/gateway/run_turn_runner.py
- `gateway/slash_commands_goals.py` — https://github.com/NousResearch/hermes-agent/blob/main/gateway/slash_commands_goals.py
- `gateway/slash_commands_session.py` — https://github.com/NousResearch/hermes-agent/blob/main/gateway/slash_commands_session.py
- `hermes_cli/blueprint_cmd.py` — https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/blueprint_cmd.py
- `hermes_cli/commands.py` — https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/commands.py
- `hermes_cli/config_defaults.py` — https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/config_defaults.py
- `hermes_cli/default_soul.py` — https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/default_soul.py
- `hermes_cli/platforms.py` — https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/platforms.py
- `hermes_cli/subcommands/cron.py` — https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/subcommands/cron.py
- `hermes_cli/subcommands/tools.py` — https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/subcommands/tools.py
- `tools/cronjob_tools.py` — https://github.com/NousResearch/hermes-agent/blob/main/tools/cronjob_tools.py
- `tools/mcp_tool_schema.py` — https://github.com/NousResearch/hermes-agent/blob/main/tools/mcp_tool_schema.py
- `tools/memory_tool_store.py` — https://github.com/NousResearch/hermes-agent/blob/main/tools/memory_tool_store.py
- `tools/skill_linter.py` — https://github.com/NousResearch/hermes-agent/blob/main/tools/skill_linter.py
- `tools/skill_manager_tool.py` — https://github.com/NousResearch/hermes-agent/blob/main/tools/skill_manager_tool.py
- `tools/tool_search.py` — https://github.com/NousResearch/hermes-agent/blob/main/tools/tool_search.py
- `optional-mcps/context7/manifest.yaml` — https://github.com/NousResearch/hermes-agent/blob/main/optional-mcps/context7/manifest.yaml
- `optional-mcps/deepwiki/manifest.yaml` — https://github.com/NousResearch/hermes-agent/blob/main/optional-mcps/deepwiki/manifest.yaml
- `optional-skills/devops/watchers/SKILL.md` — https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/devops/watchers/SKILL.md
- `optional-skills/research/blogwatcher/SKILL.md` — https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/research/blogwatcher/SKILL.md
- `optional-skills/research/rss-feeds/SKILL.md` — https://github.com/NousResearch/hermes-agent/blob/main/optional-skills/research/rss-feeds/SKILL.md
- `plugin-catalog/homeassistant.yaml` — https://github.com/NousResearch/hermes-agent/blob/main/plugin-catalog/homeassistant.yaml
- `plugin-catalog/microsoft365.yaml` — https://github.com/NousResearch/hermes-agent/blob/main/plugin-catalog/microsoft365.yaml
- `skills/apple/apple-reminders/SKILL.md` — https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/apple-reminders/SKILL.md
- `skills/apple/apple-notes/SKILL.md` — https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/apple-notes/SKILL.md
- `skills/apple/imessage/SKILL.md` — https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/imessage/SKILL.md
- `skills/apple/findmy/SKILL.md` — https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/findmy/SKILL.md
- `skills/autonomous-ai-agents/claude-code/SKILL.md` — https://github.com/NousResearch/hermes-agent/blob/main/skills/autonomous-ai-agents/claude-code/SKILL.md
- `skills/autonomous-ai-agents/codex/SKILL.md` — https://github.com/NousResearch/hermes-agent/blob/main/skills/autonomous-ai-agents/codex/SKILL.md
- `skills/email/email-inbox-triage/SKILL.md` — https://github.com/NousResearch/hermes-agent/blob/main/skills/email/email-inbox-triage/SKILL.md
- `skills/productivity/google-workspace/SKILL.md` — https://github.com/NousResearch/hermes-agent/blob/main/skills/productivity/google-workspace/SKILL.md
- `skills/productivity/google-workspace/references/daily-brief.md` — https://github.com/NousResearch/hermes-agent/blob/main/skills/productivity/google-workspace/references/daily-brief.md
- `skills/software-development/github/SKILL.md` — https://github.com/NousResearch/hermes-agent/blob/main/skills/software-development/github/SKILL.md
- `skills/software-development/hermes-agent-skill-authoring/SKILL.md` — https://github.com/NousResearch/hermes-agent/blob/main/skills/software-development/hermes-agent-skill-authoring/SKILL.md
- `website/docs/developer-guide/cron-internals.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/developer-guide/cron-internals.md
- `website/docs/developer-guide/prompt-assembly.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/developer-guide/prompt-assembly.md
- `website/docs/getting-started/updating.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/updating.md
- `website/docs/guides/automate-with-cron.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/automate-with-cron.md
- `website/docs/guides/automation-blueprints.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/automation-blueprints.md
- `website/docs/guides/cron-troubleshooting.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/cron-troubleshooting.md
- `website/docs/guides/daily-briefing-bot.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/daily-briefing-bot.md
- `website/docs/guides/microsoft-graph-app-registration.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/microsoft-graph-app-registration.md
- `website/docs/guides/tips.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/tips.md
- `website/docs/guides/troubleshooting-agent-quality.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/troubleshooting-agent-quality.md
- `website/docs/guides/use-soul-with-hermes.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/use-soul-with-hermes.md
- `website/docs/reference/automation-blueprints-catalog.mdx` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/automation-blueprints-catalog.mdx
- `website/docs/reference/cli-commands.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/cli-commands.md
- `website/docs/reference/faq.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/faq.md
- `website/docs/reference/slash-commands.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/slash-commands.md
- `website/docs/reference/tools-reference.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/tools-reference.md
- `website/docs/reference/toolsets-reference.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/toolsets-reference.md
- `website/docs/user-guide/checkpoints-and-rollback.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/checkpoints-and-rollback.md
- `website/docs/user-guide/configuration.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/configuration.md
- `website/docs/user-guide/desktop.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/desktop.md
- `website/docs/user-guide/git-worktrees.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/git-worktrees.md
- `website/docs/user-guide/multi-profile-gateways.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/multi-profile-gateways.md
- `website/docs/user-guide/security.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md
- `website/docs/user-guide/sessions.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/sessions.md
- `website/docs/user-guide/features/acp.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/acp.md
- `website/docs/user-guide/features/browser.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/browser.md
- `website/docs/user-guide/features/codex-app-server-runtime.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/codex-app-server-runtime.md
- `website/docs/user-guide/features/computer-use.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/computer-use.md
- `website/docs/user-guide/features/context-files.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/context-files.md
- `website/docs/user-guide/features/cron.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/cron.md
- `website/docs/user-guide/features/curator.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/curator.md
- `website/docs/user-guide/features/delegation.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/delegation.md
- `website/docs/user-guide/features/goals.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/goals.md
- `website/docs/user-guide/features/heartbeat.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/heartbeat.md
- `website/docs/user-guide/features/hooks.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/hooks.md
- `website/docs/user-guide/features/kanban.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/kanban.md
- `website/docs/user-guide/features/language-packs.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/language-packs.md
- `website/docs/user-guide/features/loops.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/loops.md
- `website/docs/user-guide/features/mcp.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/mcp.md
- `website/docs/user-guide/features/memory-providers.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory-providers.md
- `website/docs/user-guide/features/memory.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md
- `website/docs/user-guide/features/mixture-of-agents.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/mixture-of-agents.md
- `website/docs/user-guide/features/overview.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/overview.md
- `website/docs/user-guide/features/personality.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/personality.md
- `website/docs/user-guide/features/skills.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md
- `website/docs/user-guide/features/tool-search.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/tool-search.md
- `website/docs/user-guide/features/tts.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/tts.md
- `website/docs/user-guide/features/voice-mode.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/voice-mode.md
- `website/docs/user-guide/features/web-search.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/web-search.md
- `website/docs/user-guide/messaging/homeassistant.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/homeassistant.md
- `website/docs/user-guide/messaging/index.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/index.md
- `website/docs/user-guide/messaging/telegram.md` — https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/telegram.md

Also consulted, but not cited line by line:

- `skills/` (58 bundled SKILL.md files) — https://github.com/NousResearch/hermes-agent/tree/main/skills
- `optional-skills/` (152 optional SKILL.md files) — https://github.com/NousResearch/hermes-agent/tree/main/optional-skills
- `optional-mcps/` (Nous-approved MCP catalog) — https://github.com/NousResearch/hermes-agent/tree/main/optional-mcps
- `plugin-catalog/` — https://github.com/NousResearch/hermes-agent/tree/main/plugin-catalog
- Background note (secondary, superseded where it conflicts): `/home/user/Trainingslog/research_notes/Autonome KI Assistenten wie Hermes/hermes_agent.md`
