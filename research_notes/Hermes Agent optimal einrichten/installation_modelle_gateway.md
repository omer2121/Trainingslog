# Hermes Agent: installation, models/providers, Telegram gateway, operations (research notes)

**Target user:** German-speaking. Runs Hermes on their **own always-on Apple-Silicon Mac** (assume a Mac mini). Wants **maximum quality** within a model budget of **about 60–200 €/month**; frontier models are fine. Messenger is **Telegram**. Use cases:
- personal assistant (briefings, reminders, calendar, email)
- research and knowledge
- programming
- automations

**Source:** a local clone of `NousResearch/hermes-agent`, branch `main`, commit `1298c8e74baa73e1a2b90124228d017261ac6bc4` (2026-10-04). The research was offline: no web access was used, and nothing in the clone was modified.
- Line numbers (`#Lnnn`) refer to that commit.
- Every link points at `https://github.com/NousResearch/hermes-agent/blob/main/<path>`.

**Legend**

| Tag | Meaning |
|---|---|
| **[D]** | Stated in the docs |
| **[C]** | Verified in code |
| **[A]** | My assessment, or general macOS/provider knowledge that is not in the repo |
| **[!]** | Contradiction, or not verifiable offline |

Prices are USD per 1M tokens, taken from the repo's pricing snapshots (not live prices).

---

## 0. TL;DR for this user

1. **Install shape.** Use the source install with the official script, run as your normal macOS user (not root, no `sudo`). Command: `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash`. **[D]**
   - The CLI then tracks the `main` branch (rolling).
   - The Desktop DMG and Docker `latest`/`stable` are the stable channel. **[D][C]**
   - Details are in §1–2.
2. **24/7 operation.** `hermes gateway install` creates a **launchd LaunchAgent** `ai.hermes.gateway` with `KeepAlive` and `RunAtLoad`, logging to `~/.hermes/logs/gateway.log`. **[D][C]**
   - A LaunchAgent only runs while your user is logged in. **[A]**
   - Prevent system sleep in System Settings, or with `caffeinate`. **[D][A]**
   - Grant **Full Disk Access** to Terminal (and Hermes.app). **[D]**
3. **Main model (quality per €).** Use **Claude Opus 5.5 via a native Anthropic API key**: `model.provider: anthropic`, `model.default: claude-opus-5-5`.
   - Price snapshot: $4 in / $20 out / **$0.20 cache read** / $5 cache write; 1M context. **[C]**
   - Because cache hits cost 0.05× input, Opus 5.5 costs only modestly more than Sonnet 5 ($3/$15) in an agent loop. **[A]**
4. **Do not use the Anthropic subscription OAuth path.**
   - It works **only on Claude Max with purchased extra-usage credits**; the base Max allowance is never consumed, and Claude Pro is unsupported. **[D]**
   - Technically, it impersonates Claude Code: it injects the system prefix "You are Claude Code…" and renames tools. **[C]**
5. **ChatGPT/Codex OAuth is a legitimate extra.** Hermes identifies itself to OpenAI as a third-party harness. **[C]**
   - Plan quotas are **not documented**; check them with `hermes usage --provider openai-codex`. **[D]**
   - Codex routes advertise a 272K context (an opt-in `-900k` variant exists). **[C]**
   - Good uses: a fallback, or a separate `coder` profile.
6. **Fallback and cheap side models.** Add an **OpenRouter key**. Use it for the fallback (`openai/gpt-6.1-sol`, $2/$10) and for cheap auxiliary tasks (`google/gemini-3.8-flash`, $0.75/$3.75, 1M context). **[C]**
   - Put small, frequent side tasks (titles, approval classifier, goal judge) on **Claude Haiku 4.5** ($1/$5). **[C]**
   - Details are in §5.12.
7. **Cost knobs with the biggest effect:**
   - `prompt_caching.cache_ttl: "auto"`: a 1h cache for chat surfaces, 5m for cron and subagents. **[D][C]**
   - `compression.threshold_tokens: 200000`. **[D]**
   - Route `auxiliary.background_review` to a cheaper model. **[D]**
   - Measure with `/usage`, `hermes insights` and `hermes prompt-size --platform telegram`. **[D]**
   - There is **no built-in spend cap**, so set limits at the provider. **[A]**
8. **Telegram setup:**
   - Create the bot with BotFather; the manual route avoids the Nous onboarding relay. **[C]**
   - Set `TELEGRAM_ALLOWED_USERS=<your numeric id>`, then send `/sethome` in your DM; cron results go there. **[D]**
   - For voice, set `stt.language: "de"` (the default is `"en"`, which mis-transcribes German). **[D]**
   - Use `/voice on` for voice replies to voice notes. **[D]**
   - Set **top-level** `streaming.enabled: true`. The seeded config has a top-level `streaming:` block that overrides `gateway.streaming`. **[C]**
9. **German settings:** `timezone: "Europe/Berlin"` (this affects cron), `display.language: de` (static UI strings only), and `stt.language: "de"`. **[D]**
10. **Operations:**
    - `hermes update` (auto-restarts the gateway), `hermes doctor`, `hermes gateway status`.
    - `hermes backup -o <dir> -k N` (the zip includes `.env` and `auth.json`).
    - Never copy `state.db` alone. **[D][C]**

---

## 1. Versions, channels, and what you actually install

- **Source installs track `main`.**
  - Installer defaults: `BRANCH="main"`, `INSTALL_DIR=$HERMES_HOME/hermes-agent`, `HERMES_HOME=$HOME/.hermes`. The repo is cloned with `git clone --filter=tree:0 --branch "$BRANCH"`. **[C]** ([scripts/install.sh](https://github.com/NousResearch/hermes-agent/blob/main/scripts/install.sh))
  - Docs: "Source installs track `main`, the only valid source channel." **[D]** ([website/docs/getting-started/updating.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/updating.md))
- **[!] Contradiction: the code has release channels for source installs.**
  - `hermes update --channel CHANNEL`, help text: "'stable' and 'canary' select published releases, 'main' the branch tip. Source installs only."
  - `hermes update --set-channel CHANNEL`, help text: "Persist the update channel for THIS install … Source installs check out the published build's exact commit; main follows the source branch." **[C]** ([hermes_cli/subcommands/update.py#L76-L108](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/subcommands/update.py#L76-L108))
  - Channel names are resolved from a release archive (R2 at `hermes-assets.nousresearch.com`). **[C]** ([hermes_cli/source_releases.py](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/source_releases.py), [hermes_cli/update_channel.py](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/update_channel.py))
  - Whether a stable source record is actually published could not be verified offline.
- **Stable channel.**
  - Desktop bundles (DMG/MSIX) carry stable or canary as separate apps. Docker tags are `latest`/`stable`, `main` and `X.Y.Z`. **[D]** ([website/docs/getting-started/updating.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/updating.md), [website/docs/user-guide/docker.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/docker.md))
  - Canary is built daily at 06:41 UTC.
  - The committed project version is always `0.0.0`; the SemVer family is "seeded at `0.21.4`". **[D]** ([website/docs/developer-guide/stable-releases.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/developer-guide/stable-releases.md), [pyproject.toml](https://github.com/NousResearch/hermes-agent/blob/main/pyproject.toml))
  - **[!]** The clone has no tags, so the current stable version is unknown. `0.21.5` appears in the developer docs only as an example.
- **Pinned toolchain (the PM package manager).** **[C]** ([pm/lock.json](https://github.com/NousResearch/hermes-agent/blob/main/pm/lock.json))
  - uv 0.12.3, Python 3.14.7, Node 26.7.0, npm 12.0.2, ripgrep 15.2.0, FFmpeg 9.0.1.
  - agent-browser 0.26.0 plus pinned Chromium 145.0.7632.6, cua-driver 0.21.0, gh 2.97.0, tirith 0.4.2, iron-proxy 0.39.0.
  - `pyproject.toml`: `requires-python = ">=3.11,<3.15"`. The `all` extra (cron, pty, mcp, uvloop, sms, acp, google, web, youtube) is what the installer selects. **[C]**
  - It does **not** include `stt-whisper`, `telegram` or `messaging`; those are lazily installed (see §6).
  - PM puts its tool directories **first** on PATH for Hermes and its children ("pinned bundled versions win"). **[C]** ([pm/install.py#L955-L975](https://github.com/NousResearch/hermes-agent/blob/main/pm/install.py#L955-L975))

---

## 2. macOS install (Apple Silicon): the priority path

### 2.1 Platform support
- **Tier 1:** macOS on Apple Silicon, via Hermes Desktop or `install.sh`. **[D]** ([website/docs/getting-started/platform-support.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/platform-support.md))
- **Explicitly unsupported install routes:** **pypi installs, brew installs**, AUR, 32-bit x86 macOS. So do **not** `brew install hermes-agent`. **[D]**
- **[!] Intel Macs.**
  - platform-support.md mentions a darwin-x64 bundle and the CLI, and `install.sh` has a `darwin-x64` uv pin. **[C]**
  - installation.md says Intel macOS is "not a supported platform". This does not matter for an M-series Mac mini.

### 2.2 Prerequisites
- **Docs:** "provide Git, curl, tar, and SHA-256 utilities"; Python 3.14 is provided by PM. **[D]** ([website/docs/getting-started/installation.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/installation.md))
- **Installer checks** **[C]** ([scripts/install.sh](https://github.com/NousResearch/hermes-agent/blob/main/scripts/install.sh)):
  - `git` and `curl` are required; on failure it prints "git is required. Install it with your system package manager."
  - It uses `sha256sum` or `shasum -a 256`.
  - It accepts `Darwin` and `Linux`, and refuses Termux.
  - It downloads its **own pinned uv** into `$HERMES_HOME/tools`; it never uses a uv already on PATH.
- **Xcode Command Line Tools:** not mentioned by the installer. **[!]**
  - On a fresh macOS, `/usr/bin/git` is a stub that asks you to install the CLT. Run `xcode-select --install` once before installing. **[A]**
  - Docs mention "the existing Xcode command-line tools prerequisite" only for **building the Desktop app from source**. **[D]** ([website/docs/user-guide/desktop.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/desktop.md))
- **Homebrew: not required by Hermes.** It is only needed for optional extras:
  - `brew install steipete/tap/remindctl` for the Apple Reminders skill. **[D]** ([skills/apple/apple-reminders/SKILL.md](https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/apple-reminders/SKILL.md))
  - `brew install signal-cli` and `brew install llama.cpp` for local LLMs. **[D]**
  - The Telegram doc's `brew install ffmpeg` is redundant for source installs, because PM ships FFmpeg (see §6.7). **[!]**

### 2.3 The install command and what it does
```bash
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
source ~/.zshrc        # docs: "source ~/.bashrc   # or: source ~/.zshrc"
hermes                 # or: hermes --tui  ("modern TUI (recommended)")
```
**[D]** ([website/docs/getting-started/installation.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/installation.md), [website/docs/getting-started/quickstart.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/quickstart.md))

- **Stages** **[C]** ([scripts/install.sh](https://github.com/NousResearch/hermes-agent/blob/main/scripts/install.sh)): prerequisites → repository → venv → python-deps → config → products → setup → gateway → complete.
  - The **config** stage creates `cron, sessions, logs, pairing, hooks, image_cache, audio_cache, memories, skills`. It seeds `.env` from `.env.example` (chmod 600) and **`config.yaml` from `cli-config.yaml.example`** if they are absent.
  - The **products** stage installs agent-browser plus pinned Chromium, and `cua-driver`, by default. **[D]**
  - The **setup** stage runs `hermes setup`. The **gateway** stage runs `hermes gateway install --if-missing` ("Do nothing when a gateway service is already installed"). Both run only with a TTY; otherwise you get "run 'hermes setup' after install" and "run 'hermes gateway install' after install". **[C]** ([scripts/install.sh#L784-L801](https://github.com/NousResearch/hermes-agent/blob/main/scripts/install.sh#L784-L801), [hermes_cli/subcommands/gateway.py#L132-L135](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/subcommands/gateway.py#L132-L135))
  - **PATH:** for zsh it appends to `~/.zshrc` **and** `~/.zprofile`: `case ":$PATH:" in *":$HOME/.local/bin:"*) ;; *) export PATH="$HOME/.local/bin:$PATH" ;; esac`. **[C]**
  - **Log:** `~/.hermes/logs/install.log`. A completion marker `.hermes-bootstrap-complete` records `pinnedCommit` and `pinnedBranch`. **[C]**
- **Installer flags** **[C]**:
  - `--branch NAME`, `--commit SHA`, `--dir PATH`, `--hermes-home PATH`
  - `--non-interactive` (alias `--skip-setup`)
  - `--skip-browser` (alias `--no-playwright`), `--skip-computer-use`
  - `--include-desktop` (builds the desktop from source)
  - `--manifest`, `--stage NAME`, `--json`, `--verbose`
  - Skips are remembered; undo them with `hermes pm install agent-browser` or `hermes pm install cua-driver`. **[D]**
  - Passing flags through the pipe needs `curl … | bash -s -- --skip-computer-use`. This is a standard bash idiom; the docs do not show it. **[A]**
- **Install layout (POSIX):** code in `~/.hermes/hermes-agent/`, CLI wrapper `~/.local/bin/hermes`, data in `~/.hermes/`. **[D]**
- **Never use `sudo`.** FAQ: "Don't use sudo with the installer". Running the script as root uses root's home. **[D]** ([website/docs/reference/faq.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/faq.md), installation.md)
- **Afterwards:** `hermes doctor`, `hermes --version`, `hermes pm status`. **[D]** (updating.md)

### 2.4 Desktop app: optional, and a separate shape
- **Two ways to get it** **[D]** ([website/docs/getting-started/installation.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/installation.md), [website/docs/user-guide/desktop.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/desktop.md)):
  - The **DMG** from https://hermes-agent.nousresearch.com/ (Apple Silicon only; this is the stable channel; the ZIP is used by the auto-updater).
  - `hermes desktop` from a source install.
  - "A `Hermes-Setup` bootstrap installer is different: it downloads a source installation and builds the desktop app."
- **CLI links.** The bundled app symlinks its CLI into `~/.local/bin` **only if no working `hermes` entry exists there**. It never replaces a non-symlink and never replaces a working symlink. **[C]** ([apps/desktop/electron/cli-provision.ts](https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/electron/cli-provision.ts))
  - So whichever shape you install first owns `hermes` on PATH. Pick one shape on purpose. **[A]**
- **Cron.** The Desktop backend runs the cron tick **only while the app is open** ("the gateway isn't running under the app"). **[C]** ([apps/desktop/electron/main.ts#L12352](https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/electron/main.ts#L12352))
  - On an always-on Mac, the **launchd gateway** is the reliable scheduler. **[A]**
- **Useful Desktop extras:**
  - Messaging pane with Telegram "Create with QR".
  - **Settings → Advanced → Keep computer awake** (While working / Always), which works only while the app runs.
  - Local Models UI: canary builds, or the `--local` launch flag. **[D]**

---

## 3. First run and configuration basics

### 3.1 `hermes setup`
- **First-time modes** **[C]** ([hermes_cli/setup.py](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/setup.py)):
  - "Quick Setup (Nous Portal) — free OAuth login, no API keys, model + tools (recommended)"
  - "Full setup — configure every provider, tool & option yourself (bring your own keys)"
  - "Blank Slate — everything off except the bare minimum; opt in to each capability"
- **Full-setup order:** Model & Provider → Terminal Backend → Messaging Platforms → Tools. Agent settings get defaults.
- **Re-running:** on an existing install the full wizard re-runs (Enter keeps each value), and `--quick` fills only missing items. The config is backed up first ("pre-setup").
- **Shared metrics:** a one-time consent prompt appears at the end. Both defaults are off: `telemetry.shared_metrics.enabled: False` and `send: False`. **[C]**
- **Section commands:** `hermes setup [model|tts|terminal|gateway|tools|agent] [--non-interactive] [--reset] [--quick] [--reconfigure] [--portal]`. **[D]** ([website/docs/reference/cli-commands.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/cli-commands.md))
- **Targeted reconfiguration:** `hermes model`, `hermes tools`, `hermes gateway setup`, `hermes config set`, `hermes config get`. **[D]** (installation.md)
- **For this user:** choose **Full setup** and pick Anthropic with an API key, not Quick Setup/Nous Portal. Portal pricing is not documented anywhere in the repo. **[A][!]**

### 3.2 Files under `~/.hermes/` (HERMES_HOME)
**[D]** ([website/docs/user-guide/configuration.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/configuration.md))
- `config.yaml` holds non-secret settings.
- `.env` holds secrets (API keys, bot tokens); keep it `chmod 600`.
- `auth.json` holds OAuth tokens and credential pools.
- `state.db` is the SQLite session store in WAL mode, with `state.db-wal` and `state.db-shm` beside it.
- `SOUL.md` (persona), `memories/MEMORY.md`, `memories/USER.md`, `skills/`, `cron/jobs.json`.
- `logs/` (`agent.log`, `errors`, `gateway.log`, `gateway.error.log`, `update.log`, `install.log`).
- Profiles live in `~/.hermes/profiles/<name>/`.

### 3.3 Precedence and editing
- **Precedence:** CLI args > `config.yaml` > `.env` > defaults. **[D]** (configuration.md)
- **Commands:** `hermes config`, `hermes config edit`, `hermes config get <key>`, `hermes config set <section.key> <value>`, `hermes config unset`, `hermes config check`, `hermes config migrate`. **[D]**
- **Secrets go to `.env`.** Example from the docs: `hermes config set OPENROUTER_API_KEY sk-or-...`. **[D]** (quickstart.md)

### 3.4 Pitfalls in the **seeded** `config.yaml`
- **Model block.** The installer copies `cli-config.yaml.example` (`_config_version: 49`), which contains `model.default: "anthropic/claude-opus-4.6"`, `provider: "auto"` and `base_url: "https://openrouter.ai/api/v1"`. **[C]** ([cli-config.yaml.example#L72-L112](https://github.com/NousResearch/hermes-agent/blob/main/cli-config.yaml.example#L72-L112))
  - The code default is `"model": ""` ([hermes_cli/config_defaults.py#L34](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/config_defaults.py#L34)).
  - **[!]** configuring-models.md says the "bundled default config has `model: ""`", but a fresh install actually starts from the example values.
  - Use `hermes model` to switch providers; it rewrites provider, model and base_url together. **[A]**
  - For native Anthropic, a stale non-Anthropic `base_url` is ignored and Hermes falls back to `https://api.anthropic.com`. **[C]** ([hermes_cli/runtime_provider.py#L311-L348](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/runtime_provider.py#L311-L348))
- **Streaming block.** The seeded file has a **top-level** `streaming: {enabled: false}` block (`cli-config.yaml.example` ~L1139). The gateway's config bridge reads a top-level `streaming` dict **in preference to** `gateway.streaming`. **[C]** ([gateway/config_loader.py#L96-L125](https://github.com/NousResearch/hermes-agent/blob/main/gateway/config_loader.py#L96-L125))
  - So to enable Telegram streaming, set **`streaming.enabled: true`** at top level (`hermes config set streaming.enabled true`). Adding `gateway.streaming.enabled: true` alone is ignored. **[C]**
- **Stale comment.** The example's auxiliary comment block ("By default these use Gemini Flash via OpenRouter or Nous Portal") is stale; `auto` now means the main model (see §5.12). **[!]**

### 3.5 Profiles (brief)
**[D]** ([website/docs/user-guide/profiles.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/profiles.md))
- **Creating and using:** `hermes profile create coder` creates a `coder` alias command. Use `-p <name>` or `hermes profile use`. Cloning flags: `--clone`, `--clone-all`, `--clone-from`, `--clone-channels`.
- **What is shared:** channels are never cloned, and OAuth logins are shared through the root `auth.json`.
- **Warnings:** "Never point two agent processes at the same profile". Profiles are **not** a sandbox.
- **Gateways:** a per-profile `coder gateway install` creates a separate service; `hermes update` multiplex-migrates gateways.
  - **[!]** profiles.md says "each profile runs its own gateway process", but updates fold them into a multiplexed gateway.
- **Possible use here:** a `coder` profile on Codex OAuth or GPT for programming, while the default profile stays the Telegram assistant. **[A]**

---

## 4. Running 24/7 on the Mac

### 4.1 launchd gateway: exact commands
```bash
hermes gateway install               # Install as launchd agent
hermes gateway start                 # Start the service
hermes gateway stop                  # Stop the service
hermes gateway status                # Check status
tail -f ~/.hermes/logs/gateway.log   # View logs
```
**[D]** ([website/docs/user-guide/messaging/index.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/index.md), section "macOS (launchd)")

- **More commands** **[C]** ([hermes_cli/subcommands/gateway.py](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/subcommands/gateway.py)):
  - `hermes gateway restart [--all]`, `hermes gateway status --deep` / `-l` (`--full`), `hermes gateway list`, `hermes gateway uninstall`.
  - `hermes gateway` / `hermes gateway run` runs in the foreground.
  - Install flags: `--force`, `--start-now` / `--no-start-now`, `--start-on-login` / `--no-start-on-login`, `--if-missing`.
  - `--system` and `--run-as-user` are Linux only.
- **Plist:** `~/Library/LaunchAgents/ai.hermes.gateway.plist`. Other HERMES_HOMEs or profiles get `ai.hermes.gateway-<suffix>`. **[D]**
  - Environment: `PATH` (your shell PATH at install time, with venv `bin/` and `node_modules/.bin` prepended), `VIRTUAL_ENV`, `HERMES_HOME`. The code also adds `HERMES_SUPERVISED_CHILD=1`. **[D][C]**
  - "launchd plists are static": **re-run `hermes gateway install` after installing new tools** (Homebrew, nvm) so the PATH is captured again. Check it with `/usr/libexec/PlistBuddy -c "Print :EnvironmentVariables:PATH" ~/Library/LaunchAgents/ai.hermes.gateway.plist`. **[D]** (index.md, [website/docs/reference/faq.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/faq.md))
- **Plist keys** **[C]** ([hermes_cli/gateway_launchd.py](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/gateway_launchd.py), ~L410-L450):
  - `LimitLoadToSessionType` = [Aqua, Background]
  - `RunAtLoad` true
  - `KeepAlive {SuccessfulExit: false}`: a clean exit 0 "parks" the gateway; a crash or the watchdog exit 75 relaunches it.
  - `ThrottleInterval` 30 s, `ExitTimeOut` 60 s
  - `SoftResourceLimits.NumberOfFiles` from `runtime.nofile_soft_limit` (4096)
  - `StandardOutPath` `logs/gateway.log`, `StandardErrorPath` `logs/gateway.error.log`
- **Domain choice** **[C]** ([hermes_cli/gateway_launchd.py#L31-L56](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/gateway_launchd.py#L31-L56)):
  - It uses `gui/<uid>` when the session is Aqua (a local GUI login).
  - Otherwise it uses `user/<uid>`, which the code calls "the recommended domain on macOS 26+". This applies, for example, to an install done over SSH.
  - If `launchctl` fails with exit 5 or 125, it writes `~/.hermes/.gateway-launchd-unsupported` and falls back to an unsupervised gateway. `hermes gateway status` explains this. The fallback is undocumented in the user docs. **[C][!]**
- **Local Network privacy.** The plist runs the gateway via `/usr/bin/osascript`, so LAN hosts (Home Assistant, local model servers) are reachable from the launchd job. `ps` shows `osascript → stderr_timestamp → gateway run`. **[D]**
- **Start without loading:** `hermes gateway install --no-start-now`. The gateway then starts at next login or on `hermes gateway start`. **[D]**

### 4.2 Restart and drain semantics (Mac)
**[D]** (index.md)
- **`hermes gateway restart`:** sends SIGUSR1, refuses new turns, waits up to `agent.restart_after_turn_timeout` (default **1800 s**), exits, and launchd `KeepAlive` relaunches it. **This is the preferred way to restart.**
- **`launchctl kickstart -k gui/$UID/ai.hermes.gateway`:** sends SIGTERM. In-flight turns are interrupted after `agent.restart_drain_timeout` (default **0**); cron gets `agent.cron_drain_timeout` (default **30 s**).
  - **[!]** If the job lives in `user/<uid>` (see §4.1), this documented `gui/$UID/...` target would not match. **[C]**
- **After `hermes auth add` / `reset`:** restart the gateway. If a 401 persists, look for a second gateway PID with `hermes gateway status` and `launchctl list | grep hermes`. **[D]**
- **`hermes update`:** restarts the gateway itself (drain-aware) unless you pass `--no-gateway-restart`. **[D]** (updating.md)

### 4.3 Keeping the Mac awake, and reboot behaviour
- **Docs: `caffeinate`** **[D]** ([website/docs/user-guide/multi-profile-gateways.md#keeping-the-host-awake](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/multi-profile-gateways.md)):
  ```bash
  caffeinate -dis                    # block display, idle, and system sleep
  nohup caffeinate -dis >/dev/null 2>&1 &
  disown
  pmset -g assertions | grep -iE 'caffeinate|prevent|user is active'
  pkill caffeinate
  ```
  - `-s` = "block system sleep (AC-powered Macs only)". A Mac mini is always on AC.
  - "Lid-close still sleeps the Mac" applies to MacBooks only.
- **[!] Bug in the docs.** They also show `caffeinate -i -w $(cat ~/.hermes/gateway.pid) &`. But `gateway.pid` is a **JSON record** (`{"pid": …, "kind": …, "argv": …}`), not a bare PID. **[C]** ([gateway/status.py#L898-L1200](https://github.com/NousResearch/hermes-agent/blob/main/gateway/status.py#L898-L1200))
  - So `$(cat …)` will not work, and the PID changes on every restart anyway. Use a plain `caffeinate -dis` or the System Settings approach instead. **[A]**
- **Desktop app:** "Keep computer awake → Always" works only while Hermes.app is open (Electron `powerSaveBlocker`). **[D][C]** ([website/docs/user-guide/desktop.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/desktop.md), [apps/desktop/electron/power-save.ts](https://github.com/NousResearch/hermes-agent/blob/main/apps/desktop/electron/power-save.ts))
- **Most robust approach for a Mac mini** **[A, not in repo]:**
  - System Settings → Energy: turn on "Prevent automatic sleeping when the display is off" and "Start up automatically after a power failure"; set the display to sleep.
  - `caffeinate` is then optional.
- **Reboots** **[A, not in repo; [!] unverified for Hermes]:**
  - A **LaunchAgent only runs inside a user session**, so after a reboot (macOS update, power loss) the gateway starts at **login**.
  - For unattended restarts you need automatic login, which macOS disables when FileVault is on. The alternative is to log in remotely after updates. Decide which you want; there is a security trade-off.
  - `LimitLoadToSessionType` includes `Background`, so an SSH login can also host it (`user/<uid>`) [C]. Whether it starts **without any login** was not verified.
- **Telegram messages sent while the Mac was down** are dropped on cold boot by default. Set `drop_pending_on_cold_boot: false` (§6.9). **[D]**

### 4.4 macOS permissions (TCC)

**Full Disk Access (recommended)**
- Docs: "A single **Full Disk Access** grant covers all of them, permanently". Steps:
  1. System Settings → Privacy & Security → Full Disk Access, or run `open "x-apple.systempreferences:com.apple.preference.security?Privacy_AllFiles"`.
  2. Enable your **terminal app**, and **Hermes.app** if you use Desktop.
  3. Fully quit and relaunch them.
  - **[D]** ([website/docs/user-guide/desktop.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/desktop.md))
- `hermes doctor` probes `~/Library/Application Support/com.apple.TCC` and prints this tip if FDA is missing. **[C]** ([hermes_cli/doctor_platform.py#L358-L383](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/doctor_platform.py#L358-L383))
- Grants persist across interpreter upgrades because of a signed real-file "TCC anchor" copy of the venv Python. **[C]** ([hermes_cli/macos_tcc_anchor.py](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/macos_tcc_anchor.py))
- **[!] Unverified:** which TCC identity the **launchd** gateway uses (osascript → python) is not documented. Test it by asking the bot via Telegram to list `~/Documents`. If you get prompts or EPERM, check `hermes doctor`. **[A]**

**Feature-specific permissions**

| Feature | Permission | Source |
|---|---|---|
| Computer use (CuaDriver) | **Accessibility** + **Screen Recording** for the identity named by `hermes computer-use doctor` (`com.trycua.driver`) | [features/computer-use.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/computer-use.md) **[D]** |
| Apple Notes skill | Automation → Notes.app | [skills/apple/apple-notes/SKILL.md](https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/apple-notes/SKILL.md) **[D]** |
| iMessage skill | Full Disk Access for the terminal + Automation for Messages | [skills/apple/imessage/SKILL.md](https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/imessage/SKILL.md) **[D]** |
| Apple Reminders skill | Reminders permission (`remindctl authorize`; check with `remindctl status`) | [skills/apple/apple-reminders/SKILL.md](https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/apple-reminders/SKILL.md) **[D]** |
| Find My skill | Screen Recording | [skills/apple/findmy/SKILL.md](https://github.com/NousResearch/hermes-agent/blob/main/skills/apple/findmy/SKILL.md) **[D]** |
| Desktop app | Grants are keyed to the code-signing identity. Stuck grant: `tccutil reset All com.nousresearch.hermes`. Certificate-anchored identity: `hermes desktop --setup-tcc-identity` | desktop.md **[D]** |

- The Reminders skill says "Calendar events → use Apple Calendar or Google Calendar". For Calendar and Gmail there is the `skills/productivity/google-workspace` skill; for email, `skills/email/himalaya` and `email-inbox-triage`. **[D]** Their setup is out of scope here.

### 4.5 Docker / containers on macOS
- **Docker as the terminal sandbox (recommended use)** **[D]** ([website/docs/user-guide/configuration.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/configuration.md)):
  - Enable it with `hermes config set terminal.backend docker`.
  - Requirement, quoted: "Docker Desktop or Docker Engine installed and running. Hermes probes `$PATH` plus common macOS install locations (`/usr/local/bin/docker`, `/opt/homebrew/bin/docker`, Docker Desktop app bundle). Podman … `HERMES_DOCKER_BINARY=podman`".
  - Defaults: `container_cpu: 1`, `container_memory: 5120` (MB), `container_disk: 51200`, `docker_image: "nousresearch/hermes-sandbox:desktop"`.
- **Hermes itself in Docker on a Mac (not recommended here).**
  - Docker Desktop, Podman on macOS and **OrbStack** use virtiofs/9p mounts, where **SQLite WAL is unsafe**.
  - "since v2026.9.14" fresh DBs on such mounts use DELETE journal mode.
  - The fix is a **named volume** (`-v hermes-data:/opt/data`) or `database.journal_mode: delete`. **[D]** ([website/docs/user-guide/docker.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/docker.md))
  - Never run two gateway containers on one data directory. A root gateway is refused unless `HERMES_ALLOW_ROOT_GATEWAY=1`. **[D]**
  - Containerised Hermes also loses the macOS integrations (TCC, Apple apps, Keychain). **[A]**
- **Colima:** not documented anywhere. **[!]**
- **For this user:** run Hermes natively. Docker Desktop or OrbStack is optional, only as `terminal.backend: docker` for risky coding work. **[A]**

### 4.6 Security posture on the Mac
**[D]** ([SECURITY.md](https://github.com/NousResearch/hermes-agent/blob/main/SECURITY.md), [website/docs/user-guide/security.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md))
- SECURITY.md: "The only security boundary against an adversarial LLM is the operating system." §4: "Run the agent as a non-root user."; "Do not expose the gateway or API to the public internet without VPN, Tailscale, or firewall protection."
- **Approvals.** Defaults **[C]** ([hermes_cli/config_defaults.py](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/config_defaults.py)): `approvals.mode: smart`, `timeout: 300`, `cron_mode: deny`, `single_query_mode: deny`, `unattended_mode: deny`.
  - In `smart` mode the auxiliary `approval` model auto-approves low-risk flagged commands, denies risky ones, and escalates uncertain ones. **[D]**
  - Use `approvals.deny` globs and `approvals.smart_policy` to tune it. Never use `mode: off` on a Mac with your data. **[D]**
- **Checkpoints** are opt-in (`checkpoints.enabled: false` by default). Turn them on for coding. **[D]**
- **Borrowed CLI logins.** If you also use Claude Code or Codex CLI on this Mac, set `auth.adopt_external_logins: false`, because both use single-use rotating refresh tokens. **[D]** (security.md)
- **Dedicated macOS user** **[A]:** a separate standard user for Hermes is the strongest isolation. But Apple-app integrations (Reminders, Notes, iCloud) are per-user, so most personal-assistant users keep their own account. Decide consciously.
- A cautious work-machine baseline is in [website/docs/guides/secure-hermes-on-a-work-machine.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/secure-hermes-on-a-work-machine.md) **[D]**: `approvals.mode: manual`, `deny` list, `security.redact_secrets: true`, `checkpoints.enabled: true`, `terminal.backend: docker`, `docker_forward_env: []`, `HERMES_WRITE_SAFE_ROOT`.

---

## 5. Models and providers

### 5.1 Hard requirements and warnings
- **Minimum context of 64K.** `MINIMUM_CONTEXT_LENGTH = 64_000`. **[C]** ([agent/model_metadata.py#L272](https://github.com/NousResearch/hermes-agent/blob/main/agent/model_metadata.py#L272))
  - Quote: "Hermes Agent requires a model with at least **64,000 tokens** of context … will be rejected at startup". **[D]** (quickstart.md)
  - An auxiliary compression model under 64K raises at session start. **[C]** ([agent/conversation_compression.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/conversation_compression.py))
- **Hermes 4 / Hermes 3 models:** "They are **not recommended for use inside Hermes Agent**, however. Hermes 4 is tuned for chat and reasoning, not the rapid-fire tool-calling loop". **[D]** ([website/docs/integrations/nous-portal.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/integrations/nous-portal.md))
- **The silent default model** (when the user never picks one) is "deliberately a capable low-cost model, never the priciest flagship". It is `z-ai/glm-5.2` on OpenRouter. **[D][C]** ([website/docs/reference/model-catalog.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/model-catalog.md), [website/static/api/model-catalog.json](https://github.com/NousResearch/hermes-agent/blob/main/website/static/api/model-catalog.json))

### 5.2 What the catalog and docs say about frontier models
- **Catalog contents.** The catalog (updated 2026-10-02) lists frontier models **without** quality ranking; descriptions are empty except "2x price" / "0.5x price" tiers. **[C]** (model-catalog.json)
  - OpenRouter order: `anthropic/claude-fable-5.1`, `claude-fable-5`, `claude-opus-5.5`, `claude-opus-5`, `claude-opus-5-fast`, `claude-opus-4.8(-fast)`, `claude-sonnet-5.5`, `claude-sonnet-5`, `claude-haiku-4.5`, `openai/gpt-6-astra(-fast/-flex/-pro…)`, `gpt-6.1-sol(-pro)`, `gpt-6-sol(-pro)`, `gpt-6-luna(-pro)`, `gpt-5.5(-pro)`, `gpt-5.4-mini`, `google/gemini-3.1-pro-preview`, `gemini-3.8-flash`, `gemini-3.7-flash`, `x-ai/grok-4.7`, …
  - `moonshotai/kimi-k3` is tagged "recommended" and `z-ai/glm-5.2` "default".
- **Native Anthropic IDs** (dash form): `claude-fable-5.1`, `claude-fable-5`, `claude-opus-5-5`, `claude-opus-5`, `claude-sonnet-5`, `claude-opus-4-8`, …, `claude-haiku-4-5-20251001`. **[C]** ([hermes_cli/models_catalog_static.py#L218-L223](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/models_catalog_static.py#L218-L223))
  - `claude-sonnet-5.5` exists **only** in the OpenRouter list and has no pricing snapshot. **[C]**
- **OpenAI direct (`openai-api`):** `gpt-6.1-sol`, `gpt-6.1-sol-pro`, `gpt-6-sol(-pro)`, `gpt-6-luna(-pro)`, `gpt-5.6-sol/terra/luna`, `gpt-5.5(-pro)`, `gpt-5.4`, `gpt-5.4-mini`, `gpt-5.4-nano`, … **[C]** (models_catalog_static.py)
  - `gpt-6-astra` is described as "account-gated" in the pricing code. **[C]** ([agent/usage_pricing.py#L259-L272](https://github.com/NousResearch/hermes-agent/blob/main/agent/usage_pricing.py#L259-L272))
- **Context windows** **[C]** ([agent/model_metadata.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/model_metadata.py)):
  - Claude Fable, Opus 5.x, Sonnet 5 and Opus 4.6–4.8: 1,000,000.
  - GPT-6.x / 5.5 / 5.4 direct API: 1,050,000.
  - Gemini: 1,048,576.
- **Claude Fable** is "Mythos-class", with mandatory thinking and 128K output. **[C]** ([agent/anthropic_adapter.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/anthropic_adapter.py)) There is **no price snapshot**, so it cannot be budgeted from the repo. **[!]**
- **Prose recommendations are older than the catalog.** **[!]**
  - nous-portal.md: `/model anthropic/claude-sonnet-4.6 # best general-purpose agentic model`.
  - Provider examples use `claude-sonnet-4-6`.
- **The only benchmark in the docs (HermesBench):** MoA (opus-4.8 aggregator + gpt-5.5 reference) **0.8202**, `claude-opus-4.8` **0.7607**, `gpt-5.5` **0.7412**. **[D]** ([website/docs/user-guide/features/mixture-of-agents.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/mixture-of-agents.md))
  - The aggregator pays for the whole tool loop. MoA is useful for hard one-offs via `/moa <prompt>`; it is not a daily driver within this budget. **[A]**

### 5.3 Price snapshot (USD per 1M tokens: input / output / cache read / cache write)
Source: **[C]** [agent/usage_pricing.py#L161-L300](https://github.com/NousResearch/hermes-agent/blob/main/agent/usage_pricing.py#L161-L300). These are snapshots from official pages, not live prices.

| Model | In | Out | Cache read | Cache write | Notes |
|---|---|---|---|---|---|
| claude-opus-5-5 | 4.00 | 20.00 | **0.20** | 5.00 | cache hits 0.05× input; fast mode 8/40 |
| claude-opus-5, opus-4-5…4-8 | 5.00 | 25.00 | 0.50 | 6.25 | Opus fast = 2× |
| claude-sonnet-5 | 2.00 | 10.00 | 0.20 | 2.50 | **intro "through 2026-08-31, then $3/$15"**; the snapshot is stale **[!]** → assume 3/15/0.30/3.75 |
| claude-sonnet-4-6 | 3.00 | 15.00 | 0.30 | 3.75 | |
| claude-haiku-4-5 | 1.00 | 5.00 | 0.10 | 1.25 | |
| gpt-6-astra | 10.00 | 50.00 | 1.00 | 12.50 | above 272K prompt: 20/75; account-gated |
| gpt-6.1-sol | 2.00 | 10.00 | 0.10 | 2.50 | above 272K: 4/15 |
| gpt-6-sol | 2.00 | 10.00 | 0.20 | 2.50 | above 272K: 4/15 |
| gpt-6-luna | 0.10 | 0.50 | 0.01 | 0.125 | above 272K: 0.20/0.75 |
| gpt-5.6-sol / terra / luna | 5/30, 2.5/15, 1/6 | | | | |
| gemini-3.1-pro | 2.00 | 12.00 | | | above 200K: 4/18 |
| gemini-3.8-flash / 3.7-flash | 0.75 | 3.75 | 0.075 | | |
| gemini-3.1-flash-lite | 0.25 | 1.50 | 0.025 | | |
| deepseek-v4-pro | 0.66 | 1.98 | 0.022 | | |

### 5.4 Anthropic (native API key): recommended main provider
- **Setup** **[D]** ([website/docs/integrations/providers.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/integrations/providers.md), section "Anthropic (Native)"):
  ```bash
  # With an API key (pay-per-token)
  export ANTHROPIC_API_KEY=***
  hermes chat --provider anthropic --model claude-sonnet-4-6
  ```
  Permanent config:
  ```yaml
  model:
    provider: "anthropic"
    default: "claude-sonnet-4-6"   # for this user: "claude-opus-5-5"
  ```
  - `--provider claude` and `--provider claude-code` are aliases.
  - In practice, put `ANTHROPIC_API_KEY=...` into `~/.hermes/.env` or use `hermes model` → Anthropic → API key. **[D]**
  - Pooled keys: `hermes auth add anthropic --type api-key --api-key ...`. **[D]** ([website/docs/user-guide/features/credential-pools.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/credential-pools.md))
- **Subscription OAuth: avoid it.**
  - Docs: the OAuth path "routes as Claude Code against your Anthropic account and **only works on a Claude Max plan with purchased extra usage credits** — the base Max allowance is never consumed by Hermes". Claude **Pro**: "❌ No — Pro subscribers cannot use the OAuth path". **[D]** (providers.md, "Subscription plans" table)
  - **Code** **[C]** ([agent/anthropic_adapter.py#L291-L299](https://github.com/NousResearch/hermes-agent/blob/main/agent/anthropic_adapter.py#L291-L299), ~L516):
    - OAuth requests get the system prefix `"You are Claude Code, Anthropic's official CLI for Claude."`.
    - Tools are renamed (`session_search` → `chat_history_lookup`, `memory` → `context_notes`), because "Anthropic's OAuth billing classifier fingerprints certain Hermes tool schemas/prose as a third-party app". Errors quoted: `"You're out of extra usage"`, `"Third-party apps now draw from extra usage"`.
  - **[A]** This is impersonation of Claude Code; ToS and ban risk are **not discussed anywhere in the repo**. The "April 2026 restriction" is not mentioned in any doc. **[!]**
  - Native API keys get none of these transforms. **[C]**
- `ANTHROPIC_TOKEN` (setup-token) and auto-reading Claude Code credentials also exist. **Not recommended** here. **[D]**

### 5.5 OpenAI API (direct)
- **Setup:** `OPENAI_API_KEY` in `~/.hermes/.env`, provider **`openai-api`**, optional `OPENAI_BASE_URL`. **[D]** (providers.md provider table) It uses the Responses transport (`codex_responses`). **[C]** ([hermes_cli/providers.py#L34](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/providers.py#L34))
- **Main-model config** **[A]** (keys documented):
  ```yaml
  model:
    provider: "openai-api"
    default: "gpt-6.1-sol"
  ```
- **As an auxiliary provider,** `provider: openai` is a direct-API alias using `OPENAI_API_KEY`. **[D]** (configuration.md)
- **As a fallback:** `openai-api` is **not in the docs' fallback table**. **[!]**
  - The fallback activation path builds clients through the generic `resolve_provider_client`, and `openai-api` is a registered API-key provider. **[C]** ([agent/chat_completion_helpers.py#L2074-L2110](https://github.com/NousResearch/hermes-agent/blob/main/agent/chat_completion_helpers.py#L2074-L2110), [hermes_cli/auth.py#L181](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/auth.py#L181))
  - So it should work, but verify with `hermes doctor`. The documented alternative is OpenRouter `openai/gpt-6.1-sol`.

### 5.6 ChatGPT / Codex subscription OAuth (provider `openai-codex`)
- **Allowed?** Yes: "✅ Yes — `hermes model` → **ChatGPT or Codex Subscription** (ChatGPT OAuth device-code login, uses Codex models)". **[D]** (providers.md)
  - Hermes **identifies itself**: "OpenAI requires third-party harnesses to identify themselves". The official endpoint gets `User-Agent: HermesAgent/<ver>` and `originator: hermes-agent`, plus a residency header for residency-enforced workspaces. **[C]** ([agent/codex_headers.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/codex_headers.py))
  - This is the opposite of the Anthropic OAuth approach. **[A]**
- **Limits:** "Which ChatGPT plan tiers are eligible, and how Hermes usage counts against your plan's Codex limits, are **not currently documented**". **[D]**
  - `hermes usage --provider openai-codex` shows the "Codex 5-hour / weekly windows, plan and banked resets". **[D]** ([website/docs/reference/cli-commands.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/cli-commands.md))
- **Login:**
  - `hermes auth add openai-codex` (device code by default).
  - `--browser` uses PKCE on the fixed port `localhost:1455`; over SSH, `ssh -N -L 1455:127.0.0.1:1455 user@host`.
  - Hermes can import `~/.codex/auth.json`. **[D]** (providers.md, [website/docs/guides/oauth-over-ssh.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/oauth-over-ssh.md))
- **Models on Codex** (`DEFAULT_CODEX_MODELS`): `gpt-6-sol`, `gpt-6-luna`, `gpt-5.6-sol/terra/luna`, `gpt-5.5`, `gpt-5.4-mini`, `gpt-5.4`, `gpt-5.3-codex-spark` (research preview, "ChatGPT Pro subscribers" only). **[C]** ([hermes_cli/codex_models.py#L22-L35](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/codex_models.py#L22-L35))
  - The live catalog may add `gpt-6.1-sol` and `gpt-6-astra`; the context table lists both. **[C]**
- **Context on Codex** **[C]** ([agent/model_metadata.py#L1693-L1722](https://github.com/NousResearch/hermes-agent/blob/main/agent/model_metadata.py#L1693-L1722)):
  - The advertised window is **272K**.
  - Opt-in `-900k` picker variants exist for gpt-6.x and 5.6. Code comment: "a 900K default burned subscription usage".
  - `-pro` slugs are not routable on Codex.
- **Dead tokens.** A terminal refresh failure quarantines the token; re-run `hermes auth add openai-codex`. **[D]**
  - Credential-pools doc: "Every Codex login in an always-on home is dead: sign in again, do not wait for adoption". **[D]**
- **Codex app-server runtime** (`/codex-runtime codex_app_server`, needs `npm i -g @openai/codex`):
  - Opt-in **beta**, documented as "Working as of Hermes Agent 2026.5 + Codex CLI 0.130.0".
  - It loses `delegate_task`, memory, `session_search` and todo, so it is **unsuitable for the assistant**. **[D]** ([website/docs/user-guide/features/codex-app-server-runtime.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/codex-app-server-runtime.md))

### 5.7 OpenRouter
- **Auth:** `OPENROUTER_API_KEY` in `~/.hermes/.env`, or `hermes auth add openrouter --type oauth` (PKCE; stores a key in the pool). **[D]** (providers.md)
- **Privacy routing** (OpenRouter's provider preferences) **[D]** (providers.md, cli-config.yaml.example):
  - `provider_routing:` with `data_collection: "deny"`.
  - Per-model `models:` pins.
- **Auxiliary tasks do not inherit routing.** The main `provider_routing` and `openrouter.min_coding_score` **do not propagate** to auxiliary tasks; set them per task via `extra_body.provider`. **[D]** (configuration.md)
- **Pareto Code router** `openrouter/pareto-code` with `openrouter.min_coding_score: 0.65` is **experimental**. **[D]**

### 5.8 Nous Portal and the subscription proxy (brief)
- **Positioning:** the docs call Portal "the recommended way to run Hermes Agent", with one OAuth login for 300+ models and the Tool Gateway (web, image, TTS, browser). **[D]** ([website/docs/integrations/nous-portal.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/integrations/nous-portal.md))
  - Setup: `hermes setup --portal`; `hermes portal [info|status|tools|open]`.
  - Config: `model.provider: nous`, `base_url: https://inference-api.nousresearch.com/v1`.
  - Tool Gateway keys: `web.backend: nous`, `image_gen.provider: nous`, `tts.provider: nous`, `browser.cloud_provider: nous`.
- **Pricing is not documented in the repo.** Only "10% off token-billed providers" for subscribers is mentioned. **[!]**
- **[!] Profile handling is contradictory:** "token automatically shared across all profiles" (nous-portal.md) vs "independent credential island" / `hermes -p <name> portal` ([website/docs/guides/run-hermes-with-nous-portal.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/run-hermes-with-nous-portal.md)).
- **Subscription proxy** **[D]** ([website/docs/user-guide/features/subscription-proxy.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/subscription-proxy.md)):
  - `hermes proxy start` → `http://127.0.0.1:8645/v1`; providers are only `nous` and `xai`.
  - `--host 0.0.0.0` has **no auth**. Not relevant for this user.

### 5.9 Fallback chain and credential pools
**Fallback chain** **[D]** ([website/docs/user-guide/features/fallback-providers.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/fallback-providers.md))
- Manage it with `hermes fallback` (subcommands `add`, `list`/`ls`, `remove`/`rm`, `clear`); it is written to the top-level `fallback_providers:` key.
  ```yaml
  fallback_providers:
    - provider: openrouter
      model: anthropic/claude-sonnet-4
  ```
- **Triggers:** 429/5xx after retries; 401/403/404 immediately.
  - "Transient HTTP 429 rate limits (`Retry-After: ...`) are treated as request constraints … do **not** trigger the fallback ladder". Only quota exhaustion, payment and connection failures bypass the explicit-provider gate.
  - `agent.api_max_retries` defaults to 3; `0` gives faster failover.
  - `fallback.min_switch_reset_seconds` defaults to 0.
- **Where it applies:** CLI, gateway, Desktop, delegation, unpinned cron jobs, and auxiliary tasks on `auto`.
- **Example:** `- provider: openai-codex` / `model: gpt-5.4` as a Codex fallback. A MoA preset can also be a fallback.
- **[!]** The docs' example `nous-hermes-3` contradicts their own Hermes-3/4 warning.
- Switching provider resets the prompt cache, so a fallback turn is pricier. **[D]**

**Credential pools** **[D]** ([website/docs/user-guide/features/credential-pools.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/credential-pools.md))
- Commands: `hermes auth add|list|remove|reset|priority|refresh|status|logout`.
- Strategies (`credential_pool_strategies:`): `fill_first` (default), `round_robin`, `least_used`, `random`.
- Numbered env siblings such as `OPENROUTER_API_KEY_2` also form a pool.
- Rotation resets the cache.

### 5.10 Prompt caching
- **Behaviour:** caching is always on for Claude via native Anthropic, OpenRouter and Nous Portal. The one knob is the TTL tier:
  ```yaml
  prompt_caching:
    cache_ttl: "5m"   # "5m", "1h" (Anthropic-supported tiers) or "auto"; other values are ignored
  ```
  **[D]** (configuration.md, "Prompt caching")
- **Defaults:** code `"prompt_caching": {"cache_ttl": "5m"}`. **[C]** ([hermes_cli/config_defaults.py#L704](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/config_defaults.py#L704)) The example config also seeds `"5m"`.
- **`"auto"`:** 1h for human-paced sessions (CLI, TUI, Desktop, **Telegram**); 5m for machine-paced ones (`subagent, cron, oneshot, webhook, kanban, api, tool, batch`). **[C]** ([agent/prompt_caching.py#L121-L122](https://github.com/NousResearch/hermes-agent/blob/main/agent/prompt_caching.py#L121-L122))
  - "1h tier writes at 2x the base input price (5m writes at 1.25x)"; `auto` "cut the interactive cache-write bill by roughly 40%". Delegated subagents are always clamped to 5m. **[D]**
- **[!] Contradiction:** the same doc section says Hermes attaches "the 1-hour TTL (`ttl: "1h"`)" for Claude, while the knob's default is `"5m"`.
- **Recommendation:** `cache_ttl: "auto"`. **[A]** On Telegram your messages are often more than 5 minutes apart. With 5m, every such gap re-writes the whole prefix at write price; with 1h it is a cheap cache read.

### 5.11 Compression (long sessions)
- **Defaults** **[C][D]** (config_defaults.py, configuration.md):
  - `compression.threshold: 0.50`, `threshold_tokens: null`, `target_ratio: 0.20`, `tail_mode: lean`, `protect_last_n: 20`, `protect_first_n: 3`, `in_place: true`.
  - `idle_compact_after_seconds: 0`, `proactive_prune_tokens: 0`, `progress_notices: false`.
- **`threshold_tokens`:** "for example `threshold_tokens: 256000` to compact a 1M-window model at 256K instead of 500K". **[D]**
  - **Recommendation:** 200000–256000 with 1M-window models, for both cost and focus. **[A]**
- **`idle_compact_after_seconds`:** "e.g. a Telegram conversation you come back to hours later". The example `1800` compacts after 30 minutes idle. **[D]**
  - **Recommendation:** about 3600 for Telegram (an hour later the cache is cold anyway). **[A]**
- **`proactive_prune_tokens`:** "try `48000` to enable"; it prunes bulky old tool results without an LLM call. **[D]** Optional.
- **The summarizer** is `auxiliary.compression` (provider, model, base_url, timeout, `reasoning_effort`). **[D]**
  - **[!]** The docs warn the summary model needs a context ≥ the main model's, or "middle turns are dropped". The code instead auto-lowers the threshold to the auxiliary context and **rejects** summarizers under 64K. **[C]** (agent/conversation_compression.py)
  - Use a 1M-window summarizer with Opus anyway. **[A]**
- **Hot reload:** compression and `model.context_length` edits take effect on the next message on a running gateway. **[D]**

### 5.12 Auxiliary slots: exact keys, defaults, recommendations
- **Semantics.** `auxiliary.<task>.provider: "auto"` = **main provider plus main model** for every task. **[D][C]** (configuration.md; [agent/auxiliary_client.py](https://github.com/NousResearch/hermes-agent/blob/main/agent/auxiliary_client.py) `_resolve_auto_route`)
  - With Opus as the main model, every side task runs on Opus unless overridden.
  - Docs: "on expensive reasoning models (Opus, MiniMax M2.7, etc.) auxiliary tasks add meaningful cost".
- **Knobs per task:** `provider`, `model`, `base_url`, `api_key`, `timeout`, `reasoning_effort` (`none|minimal|low|medium|high|xhigh|max|ultra`), `extra_body`, `fallback_chain`, `max_concurrency`. **[D]**
  - Interactive picker: `hermes model` → "Configure auxiliary models". **[D]**
  - Provider names: `auto`, `main`, `openrouter`, `nous`, `openai-codex`/`codex`, `anthropic`, `gemini`, … (`codex` aliases to `openai-codex`). **[C]** ([agent/auxiliary_client.py#L3173](https://github.com/NousResearch/hermes-agent/blob/main/agent/auxiliary_client.py#L3173))
- **Docs guidance** ([website/docs/user-guide/configuring-models.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/configuring-models.md), "Common override patterns") **[D]**:
  - Compression: "A fast chat model does the job at 1/50th the cost".
  - Approval: "a fast/cheap model (haiku, flash, gpt-5-mini)... Expensive models here are waste".
  - Curator: cheaper.

| Slot (`auxiliary.<key>`) | Default timeout / notes **[C]** ([hermes_cli/config_defaults.py#L740](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/config_defaults.py#L740)) | Recommendation for this user **[A]** |
|---|---|---|
| `vision` | 120 s, download 30 s | `auto` (Opus 5.5 is multimodal) |
| `compression` | 120 s (Responses `no_progress_timeout` 60 s) | `openrouter` / `google/gemini-3.8-flash` (1M ctx, $0.75/$3.75), `reasoning_effort: low`. Without OpenRouter: `anthropic` / `claude-sonnet-5` |
| `title_generation` | 30 s; `enabled`, `model_upgrade_enabled`, `prefer_fast_model: false`, `language: ""` | `anthropic` / `claude-haiku-4-5-20251001` |
| `approval` | 30 s, "classifier — a fast/cheap model is recommended" | `anthropic` / `claude-haiku-4-5-20251001`. Keep it a capable model: it decides about commands on your Mac |
| `goal_judge` | 60 s (~200 output tokens per turn) | Haiku 4.5 |
| `curator` | 600 s | `claude-sonnet-5` |
| `monitor` | 60 s, "important-mail 0-10 scorer; high-volume, small model fine" | `google/gemini-3.8-flash` or Haiku |
| `background_review` | `enabled: true`, 120 s. `auto` = full warm-cache replay; another model = digest, "~3–5×" cheaper; "memory capture was identical and skill capture near-identical" **[D]** ([features/memory.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md)) | `anthropic` / `claude-sonnet-5` (biggest saver). Optional cap `max_input_tokens` |
| `skills_hub`, `mcp` | 30 s | `auto` (rare) |
| `tts_audio_tags` | 30 s (Gemini 3.1 TTS only) | `auto` |
| `triage_specifier`, `kanban_decomposer`, `profile_describer` | 120 / 180 / 60 s | `auto` (rare) |
| `memory_query_rewrite` | 8 s, reasoning off | Haiku or Gemini Flash (latency-sensitive) |
| `moa_reference`, `moa_aggregator` | 900 s; reasoning per MoA preset | `auto` |

- **Not auxiliary tasks.** `web_extract` and `session_search` no longer use an auxiliary LLM. **[D][C]**
- **Delegation** is separate (`delegation.provider` / `delegation.model`). **[D]**

### 5.13 Delegation, cron model, reasoning effort
- **Delegation** **[D]** (configuration.md, "Delegation"):
  - `delegation.provider`/`model` default to inheriting the parent; `max_concurrent_children: 3`; `max_spawn_depth: 1`; `delegation.fallback_providers`.
  - **Recommendation:** inherit (Opus) for research quality, or `claude-sonnet-5` to save. **[A]**
- **Cron model** **[D]** ([website/docs/user-guide/features/cron.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/cron.md)):
  - Resolution order: per-job pin → `cron.model` / `cron.model_provider` → main model.
  - Commands: `hermes cron edit <id> --provider <p> --model <m>`, `--pin` / `--unpin`, `--reasoning-effort high`.
- **Reasoning effort:** global `agent.reasoning_effort` (empty = medium); per auxiliary task `reasoning_effort`. **[D]**
- **Mid-session `/model` switches** reset the cache. Confirmation is required above `model.switch_context_confirm_tokens: 100000`. Syntax: `/model <name> --provider <p> [--global|--once]`. **[D]** (configuring-models.md)

### 5.14 Cost control
- **No built-in spend cap exists in the user docs.** **[!]** Set spend limits in the Anthropic, OpenAI and OpenRouter consoles. **[A]**
- **Measuring** **[D]** ([website/docs/reference/slash-commands.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/slash-commands.md), cli-commands.md):
  - `/usage` in chat: tokens, estimated cost, account limits.
  - `hermes usage [--provider openai-codex|anthropic|openrouter] [--json]`.
  - `hermes insights [--days N] [--source telegram]`.
  - `hermes prompt-size --platform telegram`: the fixed per-call payload. Shrink it by disabling unused toolsets in `hermes tools`.
- **Rough monthly estimate.** **[A, my arithmetic, not from the repo]**
  - **Assumptions:** 15 Telegram/CLI requests per day; 6 model calls per request; per call a 30K cached prefix, 3K new input written to cache, and 700 output tokens. That is about 2,700 calls per month. Measure your own prefix with `hermes prompt-size`.

| Main model | ≈ $/call | ≈ $/month (≈ 2,700 calls) |
|---|---|---|
| Opus 5.5 (read 0.20, write 5.00, out 20) | 0.035 | ~95 |
| Sonnet 5 at $3/$15 (read 0.30, write 3.75) | 0.031 | ~85 |
| GPT-6.1 Sol (read 0.10, write 2.50, out 10) | 0.018 | ~50 |

  - Add cron briefings: each run is a fresh session with a cold prefix; ~$0.2–0.5 per researched briefing with Opus, i.e. ~$6–15/month per daily job.
  - Add auxiliary tasks and heavy coding days: long contexts multiply cost.
  - **Conclusion:** Opus 5.5 fits the 60–200 € budget for moderate use when caching, compression and auxiliary routing are configured. Heavy all-day coding needs Codex OAuth or GPT-6.1 Sol for the coder profile. **[A]**

### 5.15 EU / data residency
- **No EU data-residency guide exists in the repo.** **[!]**
- **Knobs that exist:**
  - OpenRouter `provider_routing.data_collection: "deny"`. **[D]**
  - Bedrock region via `bedrock.region` → `AWS_REGION` → `AWS_DEFAULT_REGION`; the docs example is `eu-central-1`. **[D]** ([website/docs/guides/aws-bedrock.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/aws-bedrock.md), [website/docs/reference/environment-variables.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/environment-variables.md))
  - The docs only document `us.` and `global.` Bedrock inference profiles. EU (`eu.`) profiles are not covered. **[!]**
  - Vertex: `region: global` is required for Gemini 3.x previews. **[D]** ([website/docs/guides/google-vertex.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/google-vertex.md))
  - Codex sends a residency header for residency-enforced ChatGPT workspaces. **[C]**
  - `privacy.redact_pii` exists. **[D]** (configuration.md)

---

## 6. Telegram: full setup

### 6.1 Create the bot
**[D]** ([website/docs/user-guide/messaging/telegram.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/telegram.md))

- **Quick (QR):** Dashboard or Desktop → Messaging → Telegram → **Create with QR**. This writes `TELEGRAM_BOT_TOKEN` and `TELEGRAM_ALLOWED_USERS` and restarts the gateway.
  - `hermes gateway setup` offers the same choice: "[1] Automatic (scan QR → confirm in Telegram → done)" or "[2] Manual BotFather token". **[C]** ([hermes_cli/gateway_setup_wizard.py](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/gateway_setup_wizard.py))
  - The automatic path "creates a user-owned child bot via the **Nous onboarding service** … the raw Telegram token is saved locally after one retrieval" (`DEFAULT_API_URL = "https://setup.hermes-agent.nousresearch.com"`). **[C]** ([hermes_cli/telegram_managed_bot.py#L1-L18](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/telegram_managed_bot.py#L1-L18))
  - Privacy-minded users should prefer the manual path. **[A]**
- **Manual:**
  1. Open @BotFather and send `/newbot`. Choose a display name, then a username that **ends in `bot`**.
  2. The token looks like `123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`. If it leaks, use `/revoke`.
  3. Optional: `/setdescription`, `/setabouttext`, `/setuserpic`, `/setcommands`. "Telegram now requires bots to have a privacy policy": `/setprivacy_policy`.
  4. Groups only: turn Group Privacy off (`/mybots` → Bot Settings → Group Privacy → Turn off, then remove and re-add the bot) or make the bot an admin.
  5. Get your numeric **user ID** from @userinfobot (or @get_id_bot). It is a number, not your @username.

### 6.2 Configure Hermes
- **Interactive (recommended):** `hermes gateway setup` → Telegram.
  - It asks "Allow this Telegram account to use the bot?" for the detected ID, and offers the first allowlisted ID as the home channel. **[D][C]**
- **Manual** (`~/.hermes/.env`):
  ```bash
  TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
  TELEGRAM_ALLOWED_USERS=123456789    # Comma-separated for multiple users
  ```
  Then start it: `hermes gateway` (foreground test) or the launchd service (§4.1). **[D]**
- **Adapter dependency:** the Telegram adapter dependency is lazily installed (`pm.ensure_import("telegram")`). **[C]** ([plugins/platforms/telegram/adapter.py](https://github.com/NousResearch/hermes-agent/blob/main/plugins/platforms/telegram/adapter.py))
  - This is gated by `security.allow_lazy_installs` (default `True`). **[C]**
  - The FAQ's manual fallback: `cd ~/.hermes/hermes-agent && python -c "import pm; pm.sync_venv(['messaging'], explicit=True)"`. **[D]**

### 6.3 Access control
- **Quote:** "Always set `TELEGRAM_ALLOWED_USERS` … Without it, the gateway denies all users by default". Unknown DMs get a **pairing code** by default. **[D]** (telegram.md, [website/docs/user-guide/messaging/index.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/index.md))
- **Pairing commands:** `hermes pairing approve telegram <CODE>`, `hermes pairing list`, `hermes pairing revoke telegram <id>`, `hermes pairing clear-pending`. Codes are 8 characters, expire after 1 h and are rate-limited. **[D]** (index.md, security.md)
- **Single-owner bot:** set `unauthorized_dm_behavior: ignore` (global or per platform) so strangers get nothing. `decline` sends one polite refusal. **[D]** (security.md) **[A]** recommended.
- **Never set** `GATEWAY_ALLOW_ALL_USERS=true` on a bot with terminal access. **[D]**
- **[!] FAQ is wrong:** it says "DM pairing — First user to message … claims exclusive access". The real flow is a code plus owner approval.

### 6.4 Run it permanently (Mac)
- `hermes gateway install` → `hermes gateway status` → `tail -f ~/.hermes/logs/gateway.log` (or `hermes logs gateway -f`). Details and restart semantics are in §4.1–4.2. **[D]**
- Re-run `hermes gateway install` after changing PATH-relevant tools. **[D]**

### 6.5 Home channel and cron deliveries
- **Setting it:** send `/sethome` in the chat (your DM). Or in `.env`:
  ```bash
  TELEGRAM_HOME_CHANNEL=-1001234567890
  TELEGRAM_HOME_CHANNEL_NAME="My Notes"
  ```
  "Your personal DM chat ID is the same as your user ID." **[D]** (telegram.md)
- **Topic mode:** if you use topics in the bot DM, cron messages land in a system-only lobby. Create a `Cron` topic and set `TELEGRAM_CRON_THREAD_ID=<topic_thread_id>`. **[D]**
- **Delivery targets** **[D]** (cron.md):
  - `origin` (default from a messaging chat), `local`, `telegram` (home channel), `telegram:<chat_id>`, `telegram:<chat>:<thread>`, `all`, comma lists.
  - Output is secret-redacted.
  - A run that succeeds but cannot be delivered gets `last_status: delivery_failed`.
- **Creating a job** **[C]** ([hermes_cli/subcommands/cron.py#L29](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/subcommands/cron.py#L29); schedule grammar from cron.md):
  ```bash
  hermes cron create "every 1d at 07:30" "Morgenbriefing: Wetter Berlin, heutige Termine, wichtige Mails, Top-News — auf Deutsch, kurz." --deliver telegram
  hermes cron list
  hermes cron status       # scheduler alive? last tick? overdue jobs?
  hermes cron run <id>     # run now
  ```
  - In chat: `/cron add "every 2h" "…"`, or ask in natural language. **[D]**
- **Cron rules** **[D]**:
  - Cron runs inside the gateway on a 60-second tick.
  - Cron sessions **cannot create cron jobs**, and `approvals.cron_mode: deny` blocks flagged commands in cron.
  - Set `timezone: "Europe/Berlin"`, or schedules follow server-local time (§13). **[D]** (configuration.md, "Timezone")
- **Reminders:** "Remind me in 30 minutes" becomes a cron job (`/cron add "in 30m" "Remind me to …"`). **[D]**
  - For iPhone-synced reminders use the Apple Reminders skill (remindctl). **[D]**

### 6.6 Voice in (speech-to-text)
- **Pipeline:** voice notes are auto-transcribed (`stt.enabled: true` by default) and the transcript is echoed back as 🎙️ (`stt.echo_transcripts: true`). **[D]** (configuration.md, "Speech-to-Text (STT)")
- **Language: change it.** Quote: "**The default is `stt.language: "en"`** — Whisper auto-detection frequently misidentifies short or accented clips … Non-English speakers should set `stt.language` to their language code once". **[D]**
  - Fix: `hermes config set stt.language de`. Use `""` for auto-detection if you mix languages.
- **Providers:**
  - `local` (faster-whisper, free, no key). Model choices for `stt.local.model`: `tiny|base|small|medium|large-v3`, default `base`.
  - `groq` (`GROQ_API_KEY`).
  - `openai` (`VOICE_TOOLS_OPENAI_KEY`, falls back to `OPENAI_API_KEY`). Model choices for `stt.openai.model`: `whisper-1|gpt-4o-mini-transcribe|gpt-4o-transcribe|gpt-transcribe`.
  - Also mistral, xai, elevenlabs, deepinfra.
  - When unset, auto-detection order is `local` → `groq` → `openai`. **[D]** ([website/docs/user-guide/features/tts.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/tts.md), configuration.md)
- **Installing local Whisper:**
  - The documented route is `hermes tools` → Speech-to-Text → Local Whisper, or `python -c "import pm; pm.sync_venv(['stt-whisper'], explicit=True)"` from a prepared checkout.
  - It is also lazily installed on first use via `pm.ensure_import("stt-whisper")`. **[D][C]** ([tools/transcription_local.py#L58-L80](https://github.com/NousResearch/hermes-agent/blob/main/tools/transcription_local.py#L58-L80))
  - The `stt-whisper` extra excludes only Windows ARM64 and Intel macOS, so it works on Apple Silicon. **[C]** (pyproject.toml)
- **Model size for German** **[A]:** `base` is weak on German. Start with `small`, try `medium`; `large-v3` is best but slow on CPU. faster-whisper does not use the Apple GPU; that is general knowledge, not in the repo.
  - Cloud alternative: `stt.provider: openai` with `stt.openai.model: gpt-4o-transcribe` (paid; audio leaves the Mac).
- **Vocabulary hints:** `stt.prompt` (names, jargon). The prompt is uploaded with the audio on cloud providers. **[D]**
- **Raw audio:** `stt.enabled: false` hands the agent the `.ogg` path instead of a transcript. **[D]** (telegram.md)
- **File limits:** Telegram's getFile limit is 20 MB; a local Bot API server raises it to 2 GB. **[D]**

### 6.7 Voice out (text-to-speech) and voice replies

**Reply modes** **[D]** ([website/docs/user-guide/features/voice-mode.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/voice-mode.md))
- `/voice on` (voice_only): "Speaks reply only when you send a voice message".
- `/voice tts` (all): speaks every reply.
- `/voice off`: text only; this is the default.
- `/voice status` shows the current mode. The setting persists across restarts.

**TTS providers** **[D]** (tts.md, configuration.md)
- `tts.provider` options: `edge` (default, free; "322 voices, 74 languages"; default voice `en-US-AriaNeural`), `elevenlabs` (`ELEVENLABS_API_KEY`, default model `eleven_multilingual_v2`), `openai` (`VOICE_TOOLS_OPENAI_KEY`, `gpt-4o-mini-tts`), `gemini` (`GEMINI_API_KEY`, free tier), `minimax`, `mistral`, `xai`, `deepinfra`, and local `piper` (44 languages incl. German, installed via `hermes tools`), `neutts`, `kittentts`.
- **German voices are not named anywhere in the repo.** **[!]** The names below are general knowledge to verify:
  - Edge: `de-DE-KatjaNeural`, `de-DE-ConradNeural`.
  - Piper: `de_DE-thorsten-high`.
  - **[A]** For quality, use ElevenLabs multilingual; for free, use Edge with a de-DE voice.

**Telegram voice bubbles** **[D][C]**
- OpenAI and ElevenLabs produce Opus natively. Edge outputs MP3 and needs **ffmpeg** for Opus voice bubbles; without ffmpeg it is sent as an audio file.
- The doc says `brew install ffmpeg`. **[!]** For source installs PM already ships FFmpeg 9.0.1 and puts its tool directories first on PATH ([pm/install.py](https://github.com/NousResearch/hermes-agent/blob/main/pm/install.py)); the code finds ffmpeg via `shutil.which("ffmpeg")` ([tools/tts_tool_delivery.py](https://github.com/NousResearch/hermes-agent/blob/main/tools/tts_tool_delivery.py)).
- Check with `hermes pm status` before installing Homebrew ffmpeg. **[A]**

### 6.8 Streaming and chat UX
- **Master switch** (`StreamingConfig`): `enabled: bool = False`, `transport: str = "auto"`. **[C]** ([gateway/config.py#L487-L495](https://github.com/NousResearch/hermes-agent/blob/main/gateway/config.py#L487-L495))
  - Transports: `auto` (native `sendMessageDraft` in DMs, Bot API 9.5) | `draft` | `edit` | `off`. **[D]** (telegram.md)
  - **[!]** The same doc calls both `auto` and `edit` "default". The code default is `auto`.
- **Enable it at top level** (see §3.4): `hermes config set streaming.enabled true`. **[C]**
- **Mobile defaults for Telegram:** `tool_progress: off`, `busy_ack_detail: off`, `interim_assistant_messages: on`, `long_running_notifications: on`. **[D]** (index.md)
  - Override them per platform under `display.platforms.telegram`.
  - A **global** `display.tool_progress` etc. would override them. **[D]**
- **Other features:**
  - `/model` inline picker; reactions (`TELEGRAM_REACTIONS=true`); `HERMES_TELEGRAM_NOTIFICATIONS=all`.
  - Clarify buttons (`agent.clarify_timeout` 3600 s).
  - Exec approvals: answer "yes" or use `/approve`.
  - `/bg` background sessions. **[D]**
- **`display.language: de`** translates only static messages (approval prompts, a few gateway replies), **not** the agent's answers. Tell the agent to answer in German in `SOUL.md` or `USER.md`. **[D]** (configuration.md)

### 6.9 Reliability knobs
- **Cold-boot queue:** by default pending Telegram updates are dropped on cold boot. For hosts that restart:
  ```yaml
  platforms:
    telegram:
      extra:
        drop_pending_on_cold_boot: false
  ```
  **[D]** (telegram.md) **[A]** Recommended, so messages sent during a reboot or update are not silently lost.
- **Network:** `TELEGRAM_PROXY=socks5://…`; DoH fallback IPs (`TELEGRAM_FALLBACK_IPS`, `HERMES_TELEGRAM_DISABLE_FALLBACK_IPS`). **[D]**
- **Webhook mode** needs a public HTTPS URL (`TELEGRAM_WEBHOOK_URL` plus the **required** `TELEGRAM_WEBHOOK_SECRET`). **[D]** Do not use it on a home Mac; long-polling needs no open ports. **[A]**
- **Automatic circuit breaker and `/platform`** for pausing a broken platform. **[D]** (index.md)

### 6.10 Topics and groups (brief)
**[D]** (telegram.md)
- `/topic` gives a multi-session DM; it needs BotFather Threaded Mode (Bot API 9.4).
- Groups: `require_mention`, `TELEGRAM_GROUP_ALLOWED_USERS`, `TELEGRAM_GROUP_ALLOWED_CHATS`, `guest_mode`, admin tiers (`allow_admin_from`, `user_allowed_commands`).

### 6.11 Troubleshooting order
**[D]** (quickstart.md)
1. `hermes doctor`
2. `hermes gateway status` (`--deep`)
3. `hermes logs gateway -f`
4. `hermes model` / `hermes setup`
5. `hermes sessions list`
6. `hermes --continue`

---

## 7. Day-to-day operation

### 7.1 Updating
**[D]** ([website/docs/getting-started/updating.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/updating.md))
- **Commands:** `hermes update`, or `/update` from Telegram (the bot is offline for ~5–15 s).
- **Phases:**
  1. Snapshot (`updates.pre_update_backup: quick|full|off`)
  2. Code
  3. Syntax check with **auto-rollback**
  4. Dependencies
  5. Config migration
  6. Desktop rebuild
  7. Gateway auto-restart (drains up to 1800 s)
- **Flags:** `--check`, `--plan`, `--backup`, `--branch NAME`, `--keep-stash`, `--no-gateway-restart`, plus `--channel` / `--set-channel` (§1).
- **Logs:** `~/.hermes/logs/update.log` and receipts in `~/.hermes/logs/update_receipts/`.
  - `updates.check: true` (default); `updates.non_interactive_local_changes: stash|discard`.
- **Validate afterwards:** `git status --short`, `hermes doctor`, `hermes --version`, `hermes gateway status`, `hermes pm status`.
- **Rollback:** manually check out a git revision, then `python -m pm.cli install`. "A code checkout alone is not a data rollback."
- **[!] Command that does not exist:** `hermes backup restore --state pre-update` (cli-commands.md) is not in the parser. **[C]** ([hermes_cli/subcommands/backup.py](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/subcommands/backup.py)) `/snapshot [create|restore <id>|prune]` exists as a CLI slash command.
- **Pinning:** `install.sh --commit SHA` installs an exact commit. **[C]** **[A]** Update deliberately (e.g. weekly), not blindly every day.

### 7.2 Backups and restore
- **`hermes backup [-o PATH] [-q] [-l LABEL] [-k N]`** **[C]** ([hermes_cli/subcommands/backup.py#L23-L35](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/subcommands/backup.py#L23-L35), [hermes_cli/backup.py#L549-L565](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/backup.py#L549-L565)):
  - `-o` may be a zip path **or an existing directory**.
  - `-k` keeps the newest N zips (default **3**; `0` keeps all).
  - `-q` takes a quick snapshot of critical state (config, `state.db`, `.env`, auth, cron).
- **What the zip contains** **[D]** (cli-commands.md):
  - Included: **`.env` and `auth.json`**, so store it encrypted.
  - Excluded: code, models, runtimes, browser profiles and caches.
  - Exit codes: 0 ok / 1 incomplete / 2 already running.
- **Restore:** `hermes import <zip> [--force]`; stop the gateway first. **[D]**
- **[A] Time Machine** copies `state.db`, `-wal` and `-shm` as separate files. Treat the `hermes backup` zips as the restore source, because the docs say "Do not copy `state.db` alone".

### 7.3 Session storage recovery
**[D]** ([website/docs/user-guide/session-storage-recovery.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/session-storage-recovery.md))
- **Symptom:** "another Hermes process still holds an old copy of the session database's write-ahead log…"
- **Fix:**
  1. Stop **all** Hermes processes: `hermes gateway stop`, quit Desktop, `hermes dashboard --stop`.
  2. Run `hermes doctor` until no holder is listed.
  3. Start one process again.
- **Never:** delete `state.db-wal` or `state.db-shm`; copy `state.db` alone; run `doctor --fix` while processes run; ask the agent to fix it.
- **Inspect without writing:** `hermes sessions recover --source ~/.hermes/state.db --inspect-only`.
- `hermes sessions optimize`, `optimize-storage` and `prune` refuse while a writer is live (`--force` overrides).

### 7.4 Logs, status, diagnostics
**[D]** (cli-commands.md)
- `hermes logs [agent|errors|gateway|gui|desktop|mcp|update|handoff] [-n] [-f] [--level] [--session] [--since] [--component]`
- `hermes status [--full] [--deep]`
- `hermes doctor [--fix]`
- `hermes pm doctor|status|repair`
- `hermes config check`

### 7.5 Remote access to the Mac (dashboard, Desktop)
- **Local dashboard:** `hermes dashboard` serves `http://127.0.0.1:9119`. On loopback it has **no auth**. **[D]** ([website/docs/user-guide/features/web-dashboard.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/web-dashboard.md))
- **Remote access:**
  - "If you want an auth-free dashboard, bind to `127.0.0.1` and reach it over an SSH tunnel or Tailscale."
  - A non-loopback bind always needs an auth provider (basic auth or OAuth). "Since the June 2026 hardening, `--insecure` no longer bypasses dashboard authentication". **[D]**
  - Tailscale Serve on loopback is documented (it still needs an auth provider for the browser-facing origin). **[D]**
  - SSH tunnel, following the `oauth-over-ssh.md` pattern: `ssh -N -L 9119:127.0.0.1:9119 you@mac-mini`. **[A]**
- **Hermes Desktop on a laptop** can connect via **SSH** ("The app opens the tunnel and starts the dashboard for you") or "Remote gateway". **[D]** ([website/docs/user-guide/multi-connection-desktop.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/multi-connection-desktop.md))
- **[!] Remote backend command differs between docs:**
  - desktop.md and multi-connection use `hermes serve --host 0.0.0.0 --port 9119` with `HERMES_DASHBOARD_BASIC_AUTH_*`.
  - web-dashboard.md uses `hermes dashboard --host 0.0.0.0 --port 9119 --no-open`.
- **Never expose 9119 or the gateway publicly.** **[D]** (SECURITY.md)

### 7.6 Uninstall
- `hermes uninstall [--dry-run] [--full] [--data]`. **[D]** (updating.md)
- Manual removal on macOS: `hermes gateway stop`, then `launchctl remove ai.hermes.gateway`. **[D]**

---

## 8. Linux VPS (brief)
- **Installer:** same `install.sh`, run as a **dedicated non-root user**. **[D]** (installation.md, SECURITY.md)
- **Headless user service** **[D]** (installation.md, index.md):
  ```bash
  export PATH="$HOME/.local/bin:$PATH"
  hermes doctor
  hermes gateway install               # user service
  sudo loginctl enable-linger $USER    # start at boot, survive logout
  journalctl --user -u hermes-gateway -f
  ```
  - The alternative is `sudo hermes gateway install --system` (boot-time system service running as your user). With it, `hermes update` needs passwordless sudo for the restart.
  - Do not add `ExecStopPost` kill drop-ins.
- **Chromium dependencies.** "The current source installer does not run Playwright's `--with-deps` step". **[D]**
  - Install the system libraries: `npx playwright install-deps chromium`, or the Debian package list in the [Dockerfile](https://github.com/NousResearch/hermes-agent/blob/main/Dockerfile). **[D][C]**
  - As root or under AppArmor, `--no-sandbox,--disable-dev-shm-usage` are auto-injected. **[D]**
- **Sizing.** README: "$5 VPS". Docker table: minimum 1 GB / 1 core / 500 MB; recommended **2–4 GB / 2 cores / 2+ GB**; "With browser tools active, allocate at least 2 GB"; `--shm-size=1g`. **[D]** ([README.md](https://github.com/NousResearch/hermes-agent/blob/main/README.md), docker.md)
  - **[A]** 2 vCPU / 4 GB is comfortable with local Chromium; `--skip-browser` or Lightpanda (`browser.engine: lightpanda`) saves RAM.
- **Docker alternative:** `docker run -d --name hermes --restart unless-stopped -v ~/.hermes:/opt/data -p 8642:8642 nousresearch/hermes-agent gateway run`. Upgrade with `docker compose pull && docker compose up -d`; `hermes update` does not apply inside the image. **[D]** (docker.md)
- **Never use the Hetzner browser console for interactive OAuth; use SSH.** **[D]** (docker.md)

## 9. Windows (brief)
**[D]** ([website/docs/user-guide/windows-native.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/windows-native.md), [website/docs/user-guide/windows-wsl-quickstart.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/windows-wsl-quickstart.md))
- **Install:** `iex (irm https://hermes-agent.nousresearch.com/install.ps1)`, no admin rights, into `%LOCALAPPDATA%\hermes\`.
- **Gateway:** `hermes gateway install` creates the Scheduled Task `Hermes_Gateway` (at logon).
  - `RestartOnFailure` covers only the launcher, not later crashes.
- **Desktop MSIX** needs Windows 11 22H2+. WSL2 is a Linux-path option (enable systemd).
- **Defender** may flag `uv.exe` as a false positive (README).

## 10. Other messengers (brief)
- **Signal:** `signal-cli` (Java 17+, `brew install signal-cli`), linked device `signal-cli link -n "HermesAgent"`. **[D]** ([website/docs/user-guide/messaging/signal.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/signal.md))
- **WhatsApp (Baileys):** unofficial, with a "Ban Risk"; use a dedicated number. WhatsApp Cloud API needs Meta Business, public HTTPS and the 24 h template rule. **[D]** ([whatsapp.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/whatsapp.md), [whatsapp-cloud.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/whatsapp-cloud.md))
- **Email gateway:** a dedicated account plus app password.
  - Variables: `EMAIL_ADDRESS`, `EMAIL_PASSWORD`, `EMAIL_IMAP_HOST`, `EMAIL_SMTP_HOST`, `EMAIL_ALLOWED_USERS`, `EMAIL_AUTHSERV_ID` (required; Gmail: `mx.google.com`), `EMAIL_HOME_ADDRESS`.
  - Unknown senders are ignored by default. **[D]** ([email.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/email.md))
  - For an agent-operated mailbox, use the Himalaya skill: "never hand it your personal inbox". **[D]** ([website/docs/guides/agent-email-address.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/agent-email-address.md))

## 11. Migration and import (brief)
- **From Claude Code or Codex:** `hermes import-agent [claude-code|codex] [--dry-run] [--source] [--overwrite --yes] [--sync]`. Credentials are never imported. **[D]** ([website/docs/user-guide/import-from-other-agents.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/import-from-other-agents.md))
- **From OpenClaw:** `hermes claw migrate [--dry-run] [--preset full|user-data] [--migrate-secrets] [--overwrite] [--no-backup] [--source] [--workspace-target] [--skill-conflict] [--yes]`. "Neither preset imports secrets". Setup also offers this when `~/.openclaw` exists. **[D]** ([website/docs/guides/migrate-from-openclaw.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/migrate-from-openclaw.md), cli-commands.md)
  - **[!]** The README implies API keys are imported.
- **Hermes to Hermes:** `hermes backup` on the old machine, then `hermes import <zip>` on the new one (gateway stopped). **[D]**

---

## 12. Contradictions and unverified items

### Contradictions
1. **Update channels.** Docs: `main` is "the only valid source channel". Code: `hermes update --channel stable|canary|main` and `--set-channel` exist for source installs. Published stable source records are unverifiable offline. ([updating.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/updating.md) vs [hermes_cli/subcommands/update.py](https://github.com/NousResearch/hermes-agent/blob/main/hermes_cli/subcommands/update.py))
2. **Auxiliary "auto".** The example-config comments ("Gemini Flash via OpenRouter or Nous Portal") are stale; docs and code use the main model.
3. **Prompt caching TTL.** The docs say the 1h TTL is attached for Claude, but the knob default and the code use `"5m"` (`"auto"` is opt-in).
4. **Compression summarizer.** The docs warn "middle turns are dropped" with a smaller-context summarizer; the code auto-lowers the threshold and rejects summarizers under 64K.
5. **Nous Portal across profiles.** "Shared across all profiles" vs "independent credential island".
6. **Portal OAuth over SSH.** The guide says forward port 8642; oauth-over-ssh.md says device code, no tunnel.
7. **Telegram streaming transport.** Both `auto` and `edit` are called "default"; the code says `auto`. The master switch defaults to off, and a top-level `streaming:` block overrides `gateway.streaming`.
8. **ffmpeg.** The docs say `brew install ffmpeg`; PM already provides FFmpeg 9.0.1.
9. **Intel macOS.** Supported via the darwin-x64 bundle (platform-support.md) vs "not a supported platform" (installation.md).
10. **Remote backend command.** `hermes serve` (desktop.md, multi-connection) vs `hermes dashboard --host 0.0.0.0` (web-dashboard.md).
11. **Desktop token storage.** "Encrypted with the OS keyring" (desktop.md) vs keychain encryption being optional and tokens in 0600 files (multi-connection-desktop.md).
12. **Non-existent commands.** `hermes backup restore --state pre-update` and `hermes snapshot list` are documented but absent from the parser.
13. **FAQ pairing.** The FAQ's "first user claims exclusive access" pairing description is wrong.
14. **FAQ uv.** The FAQ suggests installing uv from Astral, but the installer always uses its own pinned uv.
15. **Seeded model.** configuring-models.md says the bundled config has `model: ""`, but the installer seeds `anthropic/claude-opus-4.6` + `provider: auto` + an OpenRouter base_url.
16. **Fallback example.** It uses `nous-hermes-3`, despite the Hermes-3/4 warning.
17. **OpenClaw secrets.** The README implies keys are imported; the guide requires `--migrate-secrets`.
18. **Stale prose model names.** Sonnet 4.6, GPT-5.5 and Opus 4.6/4.7 in the docs are older than the catalog (Opus 5.5, Fable 5.1, GPT-6.1 Sol, Gemini 3.8 Flash).
19. **Sonnet 5 price.** The snapshot is past its own end date (2026-08-31).
20. **Profiles and gateways.** "Each profile runs its own gateway process" vs the multiplexed gateway after `hermes update`.
21. **caffeinate example.** `caffeinate -w $(cat ~/.hermes/gateway.pid)` cannot work, because `gateway.pid` is JSON.
22. **launchctl target.** The documented `launchctl kickstart -k gui/$UID/…` assumes the `gui` domain; installs from non-GUI sessions land in `user/<uid>`.

### Not documented or not verifiable
- Nous Portal and Tool Gateway pricing.
- ChatGPT/Codex plan eligibility and quota accounting.
- Anthropic ToS or ban risk of the OAuth/Claude-Code-impersonation path; any "April 2026" policy.
- Colima.
- Which TCC identity the launchd gateway (osascript → python) presents.
- Whether the LaunchAgent starts with no user login; auto-login and FileVault interplay.
- Xcode CLT as a prerequisite (inferred from `git`).
- German TTS voice names.
- Behaviour of a launchd gateway across Desktop-bundle updates.
- Whether the hosted `install.sh` is byte-identical to the repo script.
- The current stable version number.
- Claude Fable pricing.
- Any EU data-residency guidance.
- `openai-api` as a fallback provider (code suggests it works; the docs table omits it).

---

## 13. Recommended default setup: always-on Mac mini, Telegram, frontier models

Everything below uses documented commands and keys. Value choices are **[A]** unless marked otherwise.

### 13.1 Steps
1. **macOS prep [A]**
   - Run `xcode-select --install` (for git).
   - System Settings → Energy: prevent automatic sleeping, and start up after power failure.
   - Decide about automatic login versus FileVault (§4.3).
   - Homebrew only if you want `remindctl` or `signal-cli`.
2. **Install** as your normal user, without sudo:
   ```bash
   curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
   source ~/.zshrc
   ```
   In the setup wizard, choose **Full setup**:
   - Model & Provider: **Anthropic → API key**, model **`claude-opus-5-5`**.
   - Terminal backend: **local**.
   - Messaging: **Telegram**, manual BotFather token. Allow your user ID and accept the home-channel offer.
   - Tools: enable what you need, then **Local Whisper** for speech-to-text.

   When the installer asks about the gateway service, accept; this runs `hermes gateway install`.
3. **Add a second key and a fallback:**
   - Put `OPENROUTER_API_KEY` into `~/.hermes/.env`.
   - Run `hermes fallback` and add `openrouter` → `openai/gpt-6.1-sol`.
4. **Apply the config** from §13.3 with `hermes config edit` or `hermes config set …`. Then run `hermes config check` and `hermes doctor`.
5. **Permissions:**
   - Give Terminal (and Hermes.app, if used) **Full Disk Access**, then relaunch them.
   - Grant Automation and Reminders only for the skills you use (§4.4).
6. **Service:**
   - Run `hermes gateway install` again after any PATH-relevant change, then `hermes gateway status`.
   - Send a test message in Telegram; send `/sethome` if the home channel is not set yet.
   - Send a German voice note to check transcription, then `/voice on`.
7. **First automations:** see §6.5, e.g. a morning briefing with `--deliver telegram`. Afterwards check `hermes cron status`.
8. **Cost hygiene:**
   - Set spend limits in the Anthropic and OpenRouter consoles.
   - After a week, review `hermes insights --days 7` and `/usage`.
   - Trim toolsets via `hermes tools` if `hermes prompt-size --platform telegram` is large.
9. **Backups:** run `hermes backup -o ~/HermesBackups -k 7` periodically. Create the directory first, and keep the zips encrypted, because they contain `.env` and `auth.json`.
10. **Updates:** run `hermes update --check` weekly, then `hermes update`; afterwards `hermes doctor` and `hermes gateway status`.

### 13.2 `~/.hermes/.env` (secrets; `chmod 600`)
```bash
ANTHROPIC_API_KEY=sk-ant-...
OPENROUTER_API_KEY=sk-or-...
TELEGRAM_BOT_TOKEN=123456789:ABC...
TELEGRAM_ALLOWED_USERS=123456789          # your numeric Telegram user id
TELEGRAM_HOME_CHANNEL=123456789           # DM chat id == user id (or use /sethome)
TELEGRAM_HOME_CHANNEL_NAME="Hermes"
# optional:
# VOICE_TOOLS_OPENAI_KEY=sk-...           # OpenAI STT (gpt-4o-transcribe) / TTS
# ELEVENLABS_API_KEY=...                  # best TTS voices
```

### 13.3 `~/.hermes/config.yaml` (merge into the seeded file; keys verified, values [A])
```yaml
model:
  provider: "anthropic"
  default: "claude-opus-5-5"          # $4/$20, cache read $0.20, 1M ctx [C]
  # a leftover OpenRouter base_url is ignored for native Anthropic [C]; removing it is cleaner

fallback_providers:
  - provider: openrouter
    model: openai/gpt-6.1-sol        # $2/$10; different vendor = real redundancy

prompt_caching:
  cache_ttl: "auto"                   # 1h for Telegram/CLI, 5m for cron/subagents

compression:
  threshold: 0.50
  threshold_tokens: 200000            # compact 1M-window sessions at 200K
  idle_compact_after_seconds: 3600    # Telegram threads you return to later

auxiliary:
  compression:
    provider: openrouter
    model: google/gemini-3.8-flash    # 1M ctx, $0.75/$3.75
    reasoning_effort: "low"
  title_generation:
    provider: anthropic
    model: claude-haiku-4-5-20251001
  approval:
    provider: anthropic
    model: claude-haiku-4-5-20251001
  goal_judge:
    provider: anthropic
    model: claude-haiku-4-5-20251001
  curator:
    provider: anthropic
    model: claude-sonnet-5
  monitor:
    provider: openrouter
    model: google/gemini-3.8-flash
  background_review:
    provider: anthropic
    model: claude-sonnet-5            # digest replay, ~3–5x cheaper per docs
  # vision: leave on auto (Opus is multimodal)

# delegation: inherit Opus for research quality; to save money uncomment:
# delegation:
#   provider: anthropic
#   model: claude-sonnet-5

timezone: "Europe/Berlin"
display:
  language: de                        # static UI strings only

stt:
  enabled: true
  provider: "local"
  language: "de"
  local:
    model: "small"                    # try "medium"; "base" is weak for German

tts:
  provider: "edge"
  edge:
    voice: "de-DE-KatjaNeural"        # [!] name from general knowledge, verify

streaming:                            # TOP-LEVEL block (overrides gateway.streaming) [C]
  enabled: true
  transport: auto

platforms:
  telegram:
    extra:
      drop_pending_on_cold_boot: false

unauthorized_dm_behavior: ignore      # single-owner bot

approvals:
  mode: smart                         # default; cron_mode stays "deny"
checkpoints:
  enabled: true

# only if Claude Code / Codex CLI also run on this Mac:
# auth:
#   adopt_external_logins: false
```

**Optional coder profile [A]:**
- Run `hermes profile create coder`, then `coder model`. Choose either:
  - **ChatGPT or Codex Subscription** (`openai-codex`, e.g. `gpt-6-sol`; watch `hermes usage --provider openai-codex`), or
  - `openai-api` / `gpt-6.1-sol`.
- Give it `terminal.backend: docker` and `checkpoints.enabled: true`.
- Do **not** run a second Telegram gateway on the same bot token.

### 13.4 Verification checklist
- `hermes doctor` is clean. FDA is granted (no tip printed).
- `hermes gateway status` shows the service running under launchd. `launchctl list | grep hermes` shows exactly one gateway.
- `hermes cron status` shows the scheduler alive. The timezone shows Europe/Berlin (doctor reports invalid zones).
- In Telegram:
  - text reply works;
  - a voice note is transcribed in German;
  - `/voice on` gives voice replies;
  - `/usage` shows Opus 5.5;
  - `/model` lists the fallback.

### 13.5 Variant: German user on an EU VPS (brief)
- **Host:** Ubuntu LTS VPS (e.g. 2 vCPU / 4 GB) with a non-root `hermes` user and SSH keys only.
  - Do **not** open 9119/8642. Use Tailscale or SSH tunnels. **[D]** SECURITY.md **[A]** sizing.
- **Install:** `install.sh` as that user. Install the Chromium system libraries (`npx playwright install-deps chromium`, or skip with `--skip-browser`). **[D]**
- **Service:** `hermes gateway install` plus `sudo loginctl enable-linger $USER`. **[D]**
- **Models:** same as §13.3.
  - For stricter EU data handling: OpenRouter `provider_routing` with `data_collection: "deny"`, or Bedrock in `eu-central-1`. Note that the docs only document `us.` and `global.` inference profiles. **[D][!]**
- **Telegram:** identical to §6, with long polling, so no inbound port is needed. Keep the default `drop_pending_on_cold_boot` or set it to `false` as on the Mac. **[A]**
- **Not available on Linux:** the Mac-only parts (launchd, TCC, Apple skills) are replaced by systemd and Linux tooling.
