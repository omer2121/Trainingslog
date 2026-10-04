# Hermes Agent (Nous Research): profile with a focus on autonomy, as of 2026-10-04

> **Source note for the report writer:** All repository data, docs, release notes, issues and GitHub advisories were read directly from github.com / raw.githubusercontent.com on **2026-10-04**. Docs are cited by their GitHub file path (`website/docs/...` on `main`). The same pages appear on hermes-agent.nousresearch.com/docs, which the sandbox proxy blocked. Most press, blog, HN, Reddit, X and YouTube pages were also blocked. Findings marked **(snippet)** come only from web-search result summaries. The full page was not read, so treat those as less verified. Anything that comes from Nous Research is vendor material and is marked as such where it matters.

## 1. What is Hermes Agent? Who builds it, license, launch date, version timeline, GitHub metrics, development activity

### Takeaway
Hermes Agent is Nous Research's MIT-licensed, Python-based, self-hosted "self-improving" personal agent. It launched publicly around 25 Feb 2026, and the repo has existed since July 2025. By 4 Oct 2026 it had about 251k GitHub stars and about 54k forks, and the latest stable release was **v0.21.5 (tag v2026.9.24, 24 Sep 2026)**. Development runs at an extreme pace: 36 GitHub releases in about 28 weeks, thousands of PRs per minor release, and daily canary builds.

### Cited Findings
**Identity and maker**
- Vendor self-description: "The self-improving AI agent built by Nous Research. The only agent with a built-in learning loop — it creates skills from experience, improves them during use, nudges itself to persist knowledge, and builds a deepening model of who you are across sessions." (vendor claim) — [docs index.mdx](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/index.mdx)
- The docs call Nous Research "the lab behind Hermes, Nomos, and Psyche models". The agent is a separate product from the Hermes LLMs. Nous's own docs say the Hermes 4 models (Hermes-4-70B/405B) are "**not recommended for use inside Hermes Agent**" because they are "tuned for chat and reasoning, not the rapid-fire tool-calling loop the agent relies on." — [index.mdx](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/index.mdx); [nous-portal.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/integrations/nous-portal.md)
- Repo metadata from the GitHub API on 2026-10-04: `NousResearch/hermes-agent`, description "The agent that grows with you", license **MIT**, language Python, homepage hermes-agent.nousresearch.com, **created 2025-07-22**, last push 2026-10-04. — [GitHub repo](https://github.com/NousResearch/hermes-agent)

**GitHub metrics on 2026-10-04**
- **251,088 stars, 53,872 forks, 971 watchers, 48,476 commits on main.** The API's `open_issues_count` is 47,886, but that figure counts open issues and open PRs together. The tabs show "5k+" for each. — [GitHub repo page / API](https://github.com/NousResearch/hermes-agent)
- An issue search sorted by reactions returned 33,231 issues. Issue/PR numbers passed **#110,000** by Sep 2026 (e.g. #110912). — [issues sorted by reactions](https://github.com/NousResearch/hermes-agent/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc); [token/cost issue search](https://github.com/NousResearch/hermes-agent/issues?q=is%3Aissue%20token%20usage%20cost%20sort%3Acomments-desc)
- The GitHub contributor count would not render (the graph page stayed on "Loading"). Contributor figures from release notes:
  - v0.2.0 (Mar 2026): 63 contributors
  - v0.17.0 (Jun 2026): 245 community contributors
  - v0.18.0 (Jul 2026): 381 contributors credited
  - v0.21.0 (Aug 2026): 760+ contributors
  — [v0.2.0](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.3.12); [v0.17.0](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.6.19); [v0.18.0](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.1); [v0.21.0](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31)
- Early secondary report: 22,000 stars and 242 contributors "within weeks" of the February 2026 launch (snippet). — [techjacksolutions](https://techjacksolutions.com/ai-tools/hermes/hermes-breakdown/); [bitcoin.com explainer](https://news.bitcoin.com/what-is-hermes-agent-nous-researchs-self-improving-ai-explained/)

**Launch date**
- Several secondary sources give the public launch as **25 Feb 2026**. Dealroom: about 99K stars "in 8 weeks since its February 25, 2026 launch" (snippet). — [Dealroom](https://app.dealroom.co/news/note/hermes-agent-hits-99k-github-stars-in-8-weeks-fastest-growing-open-source-agent-framework-of-2026); [dupple review](https://dupple.com/reviews/hermes-agent)
- The v0.2.0 release notes (12 Mar 2026) support this: "In just over two weeks, Hermes Agent went from a small internal project to a full-featured AI agent platform." That release had 216 merged PRs from 63 contributors, 119 issues resolved and 3,289 tests. — [v0.2.0 release](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.3.12)
- Conflicting date: Crypto Briefing says "since its launch in March 2026" (snippet). — [cryptobriefing](https://cryptobriefing.com/hermes-agent-1-5-trillion-tokens-openrouter/)
- No GitHub release exists for v0.1.0. The oldest GitHub release is v0.2.0. — [releases p.4](https://github.com/NousResearch/hermes-agent/releases?page=4); [releases p.5 (empty)](https://github.com/NousResearch/hermes-agent/releases?page=5)

**Release timeline**

Versions follow SemVer, and each release also carries a CalVer tag (`v2026.M.D`). Sources: [releases p.1](https://github.com/NousResearch/hermes-agent/releases?page=1), [p.2](https://github.com/NousResearch/hermes-agent/releases?page=2), [p.3](https://github.com/NousResearch/hermes-agent/releases?page=3), [p.4](https://github.com/NousResearch/hermes-agent/releases?page=4).

| Version (tag) | Date (2026) | Codename / headline changes |
|---|---|---|
| v0.2.0 (v2026.3.12) | 12 Mar | Multi-platform gateway (Telegram, Discord, Slack, WhatsApp, Signal, Email); MCP client; 70+ skills; ACP editor integration (VS Code, Zed, JetBrains); filesystem checkpoints |
| v0.3.0 (v2026.3.17) | 17 Mar | Streaming; plugin architecture; native Anthropic provider; **smart approvals**; voice mode; concurrent tool execution |
| v0.4.0 (v2026.3.23) | 23 Mar | OpenAI-compatible API server; Signal, DingTalk, SMS, Mattermost, Matrix and Webhook adapters; MCP management CLI |
| v0.5.0 (v2026.3.28) | 28 Mar | Hugging Face provider; native Modal SDK; plugin lifecycle hooks; Nix flake |
| v0.6.0 (v2026.3.30) | 30 Mar | Profiles (multi-instance); **MCP server mode**; Docker container; fallback provider chains; Feishu/WeCom |
| v0.7.0 (v2026.4.3) | 3 Apr | Pluggable memory providers; credential pool rotation; Camofox anti-detection browser |
| v0.8.0 (v2026.4.8) | 8 Apr | — |
| v0.9.0 (v2026.4.13) | 13 Apr | — |
| v0.10.0 (v2026.4.16) | 16 Apr | — |
| v0.11.0 (v2026.4.23) | 23 Apr | — |
| v0.12.0 (v2026.4.30) | 30 Apr | — |
| v0.13.0 (v2026.5.7) | 7 May | "Tenacity": durable multi-agent Kanban with heartbeats and "hallucination recovery"; `/goal`; video analysis |
| v0.14.0 (v2026.5.16) | 16 May | "Foundation": xAI Grok via SuperGrok OAuth; OAuth-to-OpenAI-compatible local proxy; X search tool |
| v0.15.0 (v2026.5.28) | 28 May | "Velocity": core agent loop refactored from 16,083 to 3,821 lines (-76%); Kanban retry and zombie detection; session search rebuilt without an LLM (claimed 4,500× faster) |
| v0.15.1 / v0.15.2 | 29 May | Patches. Docker `--insecure` now needs an explicit env opt-in |
| v0.16.0 (v2026.6.5) | 5 Jun | "Surface": put Hermes on the desktop (Hermes Desktop app) |
| v0.17.0 (v2026.6.19) | 19 Jun | "Reach": background subagents (`delegate_task(background=true)`); iMessage via Photon; WhatsApp Business Cloud API; Raft. About 1,475 commits and 800 PRs |
| v0.18.0 (v2026.7.1) | 1 Jul | "Judgment": all P0/P1 issues resolved (about 692 items in 12 days); Mixture-of-Agents as a model; `/goal` completion contracts; `/learn`; `/journey`; background fan-out delegation; gateway scale-to-zero. About 1,720 commits, 998 PRs, 949 issues closed |
| v0.18.1 / v0.18.2 | 7–8 Jul | Patches |
| v0.19.0 (v2026.7.20) | 20 Jul | "Quicksilver": 80% faster first token; **smart approvals by default**; Bitwarden/1Password; live subagent transcripts; durable delivery ledger; Fireworks and DeepInfra |
| v0.19.1 (v2026.7.30) | 30 Jul | Patch rollup (1,000+ PRs) |
| v0.20.0 (v2026.8.3) | 3 Aug | "Herald": streaming voice with barge-in; wake words; grounded research with fact-checking; outbound webhooks; A2A v1.0; tool self-recovery |
| v0.20.1–v0.20.6 | 13–27 Aug | Patches (tags v2026.8.13, .8.16, .8.16.2, .8.18, .8.19, .8.27) |
| v0.21.0 (v2026.8.31) | 31 Aug | "Pantheon": Bot Mode (agent "society" in group chats); `hermes peer` agent-to-agent DMs; **cron jobs with persistent memory**; live subagent steering; MCP command center; agent-controlled in-app browser; 6 new providers |
| v0.21.1 (v2026.9.7) | 7 Sep | 632 PRs; modularization |
| v0.21.2 (v2026.9.11) | 11 Sep | state.db reliability campaign (44 issues): second-writer corruption, WAL wedging, FTS index damage |
| v0.21.3 (v2026.9.14) | 14 Sep | Remote-gateway session-expiry bugs "affecting Cloud users" |
| v0.21.4 (v2026.9.21) | 21 Sep | About 1,800 PRs; skill auto-loading; JSONL CLI output |
| **v0.21.5 (v2026.9.24)** | **24 Sep** | Latest stable as of 4 Oct. About 460 PRs, 1,610 non-merge commits, 475 issues closed. Desktop UI in French, German and Spanish; GPT-6 Sol/Terra/Luna and Claude Opus 5.5 added to catalogs |

- [v0.21.5 release](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.24) is listed as "latest". Its contributor credits are "deferred to v0.22.0 release notes".
- The v0.21.0 window alone had about 5,800 commits, about 2,475 merged PRs, about 2,100 issues closed and about 869,000 insertions. — [v0.21.0 release](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31)
- Tags on 1–4 Oct 2026 show **daily canary builds** (e.g. `v0.21.4+canary.20261004T084456Z`) and release candidates such as `rc.35-v0.21.5` (2 Oct). Calling these "v0.21.5 RCs" after v0.21.5 has already shipped is inconsistent. The likely reading is that a v0.22.0 or further patch release is pending. — [tags](https://github.com/NousResearch/hermes-agent/tags)
- PyPI lags well behind GitHub. The newest PyPI version is **0.19.0** (uploaded 2026-07-20) and the first PyPI upload was 0.13.0 (2026-05-14). The docs list PyPI installs as "Unsupported". — [PyPI hermes-agent](https://pypi.org/project/hermes-agent/); [platform-support.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/platform-support.md)

**Star growth (secondary sources, snippets)**
- About 8K stars by 5 Mar, about 25K by 18 Mar, about 68K by 8 Apr and about 112K by 20 Apr 2026. — [gitstarclub](https://gitstarclub.com/NousResearch/hermes-agent) / [heyuan110 v0.10 review](https://www.heyuan110.com/posts/ai/2026-04-24-hermes-agent-v010-deep-review/)
- 95.6K stars in April 2026. — [dev.to review](https://dev.to/tokenmixai/hermes-agent-review-956k-stars-self-improving-ai-agent-april-2026-11le)
- 140K stars. — [geekqu](https://www.geekqu.com/hermes-agent-crossed-140000-github-stars/)
- 188,781 stars on 10 Jun 2026. — [the-agent-report](https://the-agent-report.com/2026/06/hermes-agent-188k-stars-90k-skills-ecosystem-june2026/)
- 214K stars "in six months". — [Startup Fortune](https://startupfortune.com/hermes-agent-crosses-214000-github-stars-as-developers-abandon-commercial-ai-agent-frameworks/)
- 251K stars on 4 Oct 2026 (GitHub).
- Dealroom called it the "fastest-growing open-source agent framework of 2026". — [Dealroom](https://app.dealroom.co/news/note/hermes-agent-hits-99k-github-stars-in-8-weeks-fastest-growing-open-source-agent-framework-of-2026)

### Inferences
- Cadence: 36 GitHub releases from 12 Mar to 24 Sep 2026 is about 1.3 per week. Minor versions came every 4–10 days in March–May and slowed to roughly monthly minors plus patch rollups from July to September.
- 1,800 PRs in the week of v0.21.4, issue numbers past 110k, and labels such as "sweeper:incoherent" and "sweeper:implemented-on-main" together suggest that much of the issue/PR traffic and triage is bot- or agent-driven. Raw PR and contributor counts therefore overstate human engineering effort. This is an inference, not a documented fact.
- The README is stale in places. It still says "40+ tools" and "FTS5 session search with LLM summarization", while the current docs list about 100 tools and LLM-free session search. Reviews that quote the README may be outdated.

### Gaps
- The exact v0.1.0 tag/date and the total contributor count (GitHub graph did not load) could not be verified.
- No feature details for v0.8–v0.12 (release bodies were not read).
- Star-history data comes only from secondary snippets. star-history.com was not reachable.

## 2. Architecture and features: agent loop, memory, skills, tools, subagents, cron, messaging gateway, terminal backends, MCP/ACP, model providers, research features

### Takeaway
Hermes is a single Python agent loop (`AIAgent`) with two kinds of persistent state. The first is small curated memory files (MEMORY.md/USER.md) plus SQLite FTS5 search over all past sessions. The second is self-written procedural "skills" (SKILL.md, agentskills.io-compatible). Around this sit about 100 tools, a cron scheduler, subagents and a Kanban board, and a messaging gateway for about 25 platforms. Commands can run on 7 terminal backends, and the agent works with almost any LLM provider, including local ones.

### Cited Findings
**Agent loop**
- `AIAgent` is importable as a library. Context compression runs preflight when context passes 50% and between turns in the gateway when it passes 85%. The last 20 messages stay intact. The loop has fallback model chains and iteration budgets per agent. — [agent-loop.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/developer-guide/agent-loop.md); [faq.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/faq.md)

**Memory**
- `MEMORY.md` (agent notes, 2,200 chars, about 800 tokens) and `USER.md` (user profile, 1,375 chars, about 500 tokens) live in `~/.hermes/memories/`.
- They are injected as a "frozen snapshot" at session start so the prompt cache survives. Mid-session edits only take effect in the next session.
- The agent edits them itself with the `memory` tool (add/replace/remove). Memory does **not** auto-compact: when full, the tool errors and the agent consolidates the entries.
- Memory entries are scanned for injection and exfiltration patterns.
- Docs: "Don't point two agent processes at the same Hermes home."
- [memory.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md)

**Session search**
- Every CLI and messaging session is stored in SQLite at `~/.hermes/state.db` with FTS5.
- The `session_search` tool returns the actual messages with "no LLM summarization". A query takes about 20 ms. — [memory.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md)

**User modelling and memory providers**
- Five external memory providers ship with Hermes: OpenViking, Mem0, Holographic, RetainDB and ByteRover. Honcho, Hindsight and Supermemory install from the plugin catalog.
- **Honcho** (Plastic Labs) adds "dialectic reasoning and deep user modeling". It is a plugin, not built in.
- [memory.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md); [honcho.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/honcho.md); [tools.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/tools.md)

**Skills**
- Skills live in `~/.hermes/skills/` as `SKILL.md` files and use progressive disclosure.
- They are compatible with the agentskills.io standard. "The agent can modify or delete any skill." — [skills.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md)
- The `skill_manage` tool is the agent's "procedural memory". The system prompt asks it to record non-trivial workflows: multi-step workflows worth repeating, paths found after errors and dead ends, and approaches the user corrected.
- A linter warns about "incident-log"-style skills, sprawling references and oversized bodies.
- `/learn` (v0.18.0) distils skills from directories, URLs, the current workflow, or whole books. Large sources become "knowledge-base skills".
- [skills.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md); [v0.18.0](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.1)
- **Skills Hub sources**: official skills, skills.sh, ClawHub (OpenClaw's registry), LobeHub, browse-sh, and GitHub repos/taps.
- Every install gets a security scan, and NVIDIA SkillEvaluator/SkillSpector can run as an optional second opinion.
- Project-local skills load only after `hermes skills trust`. — [skills.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md)
- Secondary: the Skills Hub "explodes past 90,000 skills" (June 2026, snippet). — [the-agent-report](https://the-agent-report.com/2026/06/hermes-agent-188k-stars-90k-skills-ecosystem-june2026/)

**Curator**
- A background maintenance pass for agent-created skills.
- It runs after `interval_hours` (default 168 h, i.e. 7 days) once the agent has been idle for 2 h.
- Skills unused for 14 days become stale; after 30 days they are archived (recoverable).
- Pinned skills and skills used by cron jobs are skipped.
- LLM "consolidation" (50–100 API calls per sweep) is **off by default**. Bundled and hub skills are never touched.
- [curator.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/curator.md)

**Tools**
- The current registry has "~100 tools". Highlights:
  - terminal and process management
  - file read/write/patch/search
  - `web_search` / `web_extract`, `x_search`
  - about 18 browser tools
  - `vision_analyze`, `video_analyze` / `video_generate`, `image_generate`
  - `text_to_speech`
  - `execute_code`
  - `computer_use` (background desktop control via cua-driver)
  - `memory`, `session_search`, `skill_manage`
  - `cronjob_manage`, `delegate_task`, 14 kanban tools
  - `todo_list`, `clarify`
  - Spotify and Discord tools

  The README still says "40+". — [tools-reference.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/tools-reference.md); [README](https://github.com/NousResearch/hermes-agent/blob/main/README.md)
- `execute_code` lets the agent "write Python scripts that call tools via RPC, collapsing multi-step pipelines into zero-context-cost turns" (vendor claim). — [README](https://github.com/NousResearch/hermes-agent/blob/main/README.md)
- Browser providers:
  - Browser Use CLI (default driver)
  - Browser Use cloud and Browserbase (cloud)
  - Camofox (local anti-detection)
  - Lightpanda
  - your own Chrome/Edge/Brave via CDP (`/browser connect`)

  — [browser.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/browser.md)
- Voice: local Faster-Whisper STT, OpenAI TTS (via the Nous Tool Gateway), ElevenLabs, or local NeuTTS. v0.20.0 added streaming voice with barge-in and wake words. — [voice-mode.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/voice-mode.md); [releases p.2](https://github.com/NousResearch/hermes-agent/releases?page=2)

**Subagents**
- `delegate_task` spawns child agents with isolated context. Only each child's final summary returns to the parent.
- Up to **10 concurrent** children by default (configurable, "no hard ceiling"). Top-level delegations run in the background.
- Leaf children cannot delegate further or ask the user anything (`clarify` is blocked). Depth is bounded by `max_spawn_depth`. Children inherit the parent's toolsets and cannot gain more.
- `/review` spawns an independent reviewer subagent.
- [delegation.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/delegation.md)

**Kanban**
- A durable SQLite task board (`~/.hermes/kanban.db`) shared across profiles. Each worker is a full OS process.
- Built-in heartbeats, retries and a circuit breaker. — [kanban.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/kanban.md)

**Cron**
- Jobs are created in natural language or as cron expressions through one `cronjob_manage` tool.
- Results can be delivered to the origin chat, files, any platform, or "all".
- Other modes: event-triggered jobs via webhooks, and "no-agent" script jobs with zero LLM calls.
- [cron.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/cron.md)

**Messaging gateway**
- A single background process that "connects to all your configured platforms, handles sessions, runs cron jobs, and delivers voice messages".
- Platforms listed: Telegram, Discord, Slack, Google Chat, WhatsApp (plus the WhatsApp Cloud API), Signal, SMS, Email, Home Assistant (plugin), Mattermost, Matrix, DingTalk, Feishu/Lark, WeCom, Weixin, BlueBubbles and Photon (iMessage), QQ, Yuanbao, Microsoft Teams, LINE, ntfy, Raft and IRC.
- Also an OpenAI-compatible API server and webhooks.
- [messaging/index.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/index.md)

**Terminal backends**
- Seven: local, Docker, SSH, Singularity, Modal, Daytona and Vercel Sandbox.
- Daytona and Modal offer "serverless persistence" and hibernate when idle. — [README](https://github.com/NousResearch/hermes-agent/blob/main/README.md); [tools.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/tools.md)

**MCP, ACP and other protocols**
- MCP client since v0.2.0 (stdio/HTTP, sampling). MCP server mode since v0.6.0. MCP command center in v0.21.0.
- `hermes import-agent claude-code` migrates Claude Code `mcpServers`, skills and instructions. — [mcp.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/mcp.md); [releases p.4](https://github.com/NousResearch/hermes-agent/releases?page=4)
- ACP: Hermes runs as an ACP server over stdio, so editors can render chat, diffs, terminal commands and approval prompts. VS Code, Zed and JetBrains were named in v0.2.0. — [acp.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/acp.md); [v0.2.0](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.3.12)
- Other surfaces: CLI, TUI, Hermes Desktop (macOS/Windows, since v0.16.0), A2A v1.0 (v0.20.0), and `hermes peer` agent-to-agent messaging plus "Bot Mode" group chats of agents (v0.21.0). — [v0.21.0](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31)

**Model providers**
- Any OpenAI-compatible API works. Named providers:
  - Nous Portal (300+ models)
  - OpenRouter
  - OpenAI, including Codex (GPT-5.x)
  - Anthropic (API key or OAuth)
  - Google Gemini and Vertex AI
  - z.ai GLM
  - Kimi/Moonshot
  - MiniMax
  - xAI Grok (SuperGrok OAuth)
  - GitHub Copilot
  - Hugging Face
  - Fireworks and DeepInfra
  - Local servers: Ollama, vLLM, llama.cpp, SGLang, LocalAI
- v0.18.0 added a Mixture-of-Agents "model". v0.21.0 added six more providers (Meta Model API, CommandCode, Tencent TokenPlan, Nebius, Ramp Router, Actual Computer).
- A request for a native Mistral provider (#20859) is labelled "wontfix".
- [faq.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/faq.md); [providers.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/integrations/providers.md); [v0.21.0](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31); [issues by reactions](https://github.com/NousResearch/hermes-agent/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)

**Research features**
- `batch_runner.py` runs the agent over JSONL prompt datasets in parallel and writes ShareGPT-format trajectories with tool statistics, for fine-tuning and evaluation.
- Trajectory compression.
- RL training pipeline "powered by Atropos" (Nous's RL environment framework).
- [batch-processing.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/batch-processing.md); [learning-path.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/learning-path.md); [index.mdx](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/index.mdx)

### Inferences
- The "learning loop" is not weight-level learning. It is prompt-level state: about 1,300 tokens of curated memory, retrieval over past sessions, and a growing library of Markdown procedures. Its quality depends entirely on the underlying LLM and on how good the self-written skills are.
- The feature surface is very broad. Desktop, about 25 messaging platforms, Kanban, MoA, voice, A2A, and Chinese platforms (DingTalk, Feishu, WeCom, Weixin, QQ, Yuanbao) point to a strategy of breadth plus a strong China user base. The latter is also suggested by the Chinese "Orange Book" guide ([alchaincyf/hermes-agent-orange-book](https://github.com/alchaincyf/hermes-agent-orange-book)).

### Gaps
- Could not verify how much the `/goal` judge and "smart approval" auxiliary LLM calls cost per task.
- No independent measurement of skill quality over time was found.

## 3. Autonomy in detail: what it does without a human, the mechanisms, how long it runs, the learning loop in practice, approval and sandbox controls, trade-offs

### Takeaway
Hermes can run 24/7 as a system service and act "proactively". In practice that means triggered by schedules (cron ticks every 60 s), webhooks/events, watchdog scripts, background subagents and Kanban workers. I found no mechanism for spontaneous, untriggered initiative.

By default, a single turn has no turn cap and subagents have no wall-clock timeout. The self-improvement loop writes memory and skills on its own after turns unless you switch on approval gating.

Out of the box, safety rests on three things:
- an LLM-judged "smart" approval mode
- a hardline blocklist
- headless contexts that deny dangerous commands by default

The project itself says these are **heuristics, not containment**. Only OS or container isolation is a real boundary. A real-world attacker ran it unattended with YOLO mode against a government network.

### Cited Findings
**Always-on operation and triggers**
- The gateway installs as a user or boot-time system service (`hermes gateway install`, `--system` on Linux, plus launchd, s6 and Windows Scheduled Task launchers).
- "Cron execution is handled by the gateway daemon. The gateway ticks the scheduler every 60 seconds, running any due jobs in isolated agent sessions."
- Each due job gets a fresh `AIAgent` session, which runs the prompt to completion, delivers the result and reschedules.
- [cron.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/cron.md); [security.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md)
- Event-driven and quiet-by-default patterns:
  - jobs can "fire on external events" via webhook routes
  - "no-agent mode" runs a script on a schedule with zero LLM calls ("Empty stdout → silent tick")
  - a script can wake the agent only when needed (`{"wakeAgent": true, "context": …}`)
  - global emergency stop: `hermes pause`
  - [cron.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/cron.md)
- Since v0.21.0, cron jobs keep persistent memory between runs. Release note: "Your 9am briefing job now knows what it told you yesterday." — [v0.21.0](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31)
- Self-scheduling is **opt-in**. "By default, agents launched by the scheduler cannot use the cronjob_manage tool." With `cron.allow_agent_scheduling: true`, scheduled agents can create, edit and remove jobs, including removing themselves. The agent "cannot point a job at a different model"; model pins belong to the user. — [cron.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/cron.md)

**How long it can run unattended**
- "`agent.max_turns` is **unlimited by default** — the turn cap caused more problems than it solved (silent mid-task truncation)". — [configuration.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/configuration.md)
- Conflict: the developer guide says "Default: 500 iterations". — [agent-loop.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/developer-guide/agent-loop.md)
- Subagents get an iteration limit "default: 250". "By default there is **no wall-clock timeout** on subagents." — [delegation.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/delegation.md)
- Conflict: the developer guide gives `delegation.max_iterations` a default of 50. — [agent-loop.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/developer-guide/agent-loop.md)
- `/goal` (a "Ralph loop" explicitly inspired by Codex CLI's `/goal`):
  - after every turn, "a lightweight judge model checks whether the goal is satisfied"; if not, Hermes feeds back a continuation prompt
  - default budget is **20 continuation turns** (`goals.max_turns`), then it auto-pauses
  - if the judge errors, the verdict defaults to "continue"
  - verification gates retry 3× with a 5-min timeout
  - since v0.18.0, completion contracts judge "done" by running real project checks ("'done' means proven, not claimed", vendor claim)
  - [goals.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/goals.md); [configuration.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/configuration.md); [v0.18.0](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.1)
- Kanban workers get a checkpoint notice at about 90% of their iteration budget, plus bounded retries and a consecutive-failure circuit breaker. Docs: "a commit or diff alone never automatically completes a task". — [kanban.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/kanban.md)
- Cron pre-run scripts time out after 3,600 s by default. LLM-driven jobs have a separate inactivity budget instead. — [cron.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/cron.md)

**The "closed learning loop" in practice**
- After a turn, a **background self-improvement review** (a forked agent) "may quietly save a memory or update a skill".
- "By default the agent saves memory freely — including from the background self-improvement review".
- Defaults are `memory.write_approval: false` and `skills.write_approval: false`. With `true`, writes are staged for review (`/skills pending|diff|approve|reject`).
- The chat shows "💾 Memory updated" by default.
- Docs admit the review fork "can burn a meaningful share of total tokens on busy hosts". It can be disabled, capped with `max_input_tokens`, or moved to a cheaper model (claimed about 3–5× cheaper).
- [memory.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md); [skills.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md)
- `/journey` (v0.18.0) shows a timeline of learned skills and memories that the user can list, edit and delete. Curator pruning runs weekly; LLM consolidation is off by default since v0.17.0. — [memory.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md); [curator.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/curator.md); [v0.17.0](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.6.19)
- v0.21.0 hardening: "Protected instruction files (AGENTS.md, skills, memory) now require write approval, preventing prompt-injected agents from rewriting standing orders." This apparently applies to file-tool writes; the memory and skill tools still default to free writes per the docs. — [v0.21.0](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31)

**Approval and permission controls**

Source for all of the following unless noted: [security.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md)
- `approvals.mode` has three settings:
  - **smart** (default; default since v0.19.0): "Use an auxiliary LLM to assess risk. Low-risk commands … are auto-approved … Genuinely dangerous commands are auto-denied. Uncertain cases escalate to a manual prompt."
  - **manual**: always prompt
  - **off**: equivalent to `--yolo`
  - (Default change: [v0.19.0 notes](https://github.com/NousResearch/hermes-agent/releases?page=2))
- Headless defaults: `cron_mode: deny`, `single_query_mode: deny` and `unattended_mode: deny` (webhook/API sessions). Each can be set to `approve`.
- The approval timeout is 300 s and **fails closed** (deny).
- **YOLO mode** (`hermes --yolo`, `/yolo` toggle, or `HERMES_YOLO_MODE=1`) "bypasses all dangerous command approval prompts". It works in CLI and gateway sessions and shows a red banner and status-bar marker.
- The **hardline blocklist** cannot be overridden even with yolo, mode off, or "allow always":
  - `rm -rf /` and its variants
  - fork bombs
  - `mkfs` on a mounted root
  - `dd` to disks
  - piping URLs to `sh` at the rootfs top level
- User-defined `approvals.deny` globs block commands before yolo is consulted ("yolo-with-exceptions"). The docs warn this "is a shell-command policy, not … an OS capability sandbox".
- There is a permanent allowlist, and `hermes approvals suggest` mines approval history.
- Dangerous patterns that trigger approval include recursive `rm`, `chmod 777`, SQL `DROP`/`DELETE` without `WHERE`, `systemctl stop`, `curl | sh`, writes to `/etc` or `~/.ssh`, and docker daemon redirects.
- **Container bypass:** on the docker, singularity, modal, daytona and vercel_sandbox backends, "dangerous command checks are skipped because the container itself is the security boundary".
- File-write safety:
  - always-blocked paths include `~/.ssh`, `~/.aws`, `~/.kube`, the Hermes `.env`, OAuth files and the vault
  - project `.env` files are read-denied
  - `HERMES_WRITE_SAFE_ROOT` is an optional write sandbox
  - the docs note "The terminal tool runs as the same OS user and can still cat or overwrite denied paths"
- Checkpoints/`/rollback` (shadow git snapshots before destructive operations) are **opt-in** ("default is off"). — [checkpoints-and-rollback.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/checkpoints-and-rollback.md)
- The gateway restricts who can talk to it: platform allowlists, DM pairing (8-character code approved on the CLI), and a production warning against `GATEWAY_ALLOW_ALL_USERS=true`.

**Vendor statement on the limits of these controls**
- "The only security boundary against an adversarial LLM is the operating system. Nothing inside the agent process constitutes containment — not the approval gate, not output redaction, not any pattern scanner, not any tool allowlist."
- Hermes is "a single-tenant personal agent".
- [SECURITY.md](https://github.com/NousResearch/hermes-agent/blob/main/SECURITY.md)

**Real-world demonstrations of unattended autonomy (snippets)**
- An operator ran Hermes on a rented server "with approval prompts disabled" (YOLO mode) against Thailand's Ministry of Finance.
- "The agent then worked through the ministry's network on its own, checking hosts for ways to gain root access, hunting through file systems, and crawling a folder of staff personnel records going back to 2012."
- Hunt.io and Bob Diachenko found the operator's exposed logs together with 585 files (470 MB) of tooling. Reported July 2026.
- [The Hacker News](https://thehackernews.com/2026/07/hacker-runs-hermes-ai-agent-unattended.html); [BleepingComputer](https://www.bleepingcomputer.com/news/security/hermes-ai-agent-used-to-automate-attack-on-thai-finance-ministry/); [CSA research note](https://labs.cloudsecurityalliance.org/research/csa-research-note-hermes-ai-agent-thai-finance-ministry-2026/); [cyber-ivy, 2026-07-23](https://cyber-ivy.com/en/articles/hermes-agent-yolo-thai-finance-attack-2026-07-23)

**User report on the limits of autonomous completion**
- Issue #99752 "Hermes: the agent that grows against you" (31 Aug 2026, v0.20.5): the user asked for a complete trading-execution model and got only a control-plane framework with execution disabled. They complained about wasted tokens and time.
- Labels: P2, duplicate, needs-repro. No maintainer reply was visible.
- [issue #99752](https://github.com/NousResearch/hermes-agent/issues/99752)

### Inferences
- **What "autonomy" means here**:
  - unattended execution of user-defined or agent-defined (opt-in) schedules and events
  - indefinite multi-step work within a turn
  - goal loops with a judge
  - parallel subagents
  - self-modification of its own prompt-level knowledge (memory/skills)

  It is not open-ended self-direction. Every run is still started by a message, a timer, a webhook or a board card.
- **The trade-off**:
  - The defaults that keep it safe headless (deny in cron and unattended contexts) also stop scheduled jobs from doing anything dangerous. Operators who want full unattended power must flip `cron_mode: approve`, use YOLO, or move to a container backend, where approval checks are skipped entirely.
  - The safest high-autonomy setup the docs recommend is therefore a hardened container or cloud sandbox with no forwarded secrets, not approval prompts.
  - The Thai incident shows that YOLO plus no containment gives a capable unattended agent, and the controls are trivially switched off by whoever operates it.
- Default-on autonomous memory and skill writes give a persistent self-modification path. If injected content (e.g. from web pages or emails) gets into a memory or skill, it carries over to future sessions. Docs and release notes add scanning and write-approval gates, but these are off or heuristic by default.

### Gaps
- No independent, systematic measurement of how long Hermes completes tasks reliably unattended, e.g. hours or days of work before failure. Only vendor claims and anecdotes were found.
- The default nudge intervals for the post-turn review (`memory.nudge_interval`, `skills.creation_nudge_interval`) were not confirmed. They were not in the docs pages that were read.
- The docs contradict themselves on the main agent turn cap (unlimited vs 500) and the subagent iteration default (250 vs 50). The user-facing docs probably reflect the current state, but this is not verified.

## 4. Setup, operation and costs: OS support, installation, hardware, recommended models, API costs, OpenClaw migration, EU considerations

### Takeaway
Installation is a one-line script (Linux/macOS/WSL2), a PowerShell one-liner (native Windows), desktop installers, Docker, or a Termux APT repo. The software is free (MIT). Running costs are your own LLM/API spend plus an optional VPS: a few dollars to roughly $150 per month depending on model and usage.

Each call carries large fixed token overhead: roughly 14K tokens per call measured in April 2026. A 64K-context minimum rules out small local models. Migration from OpenClaw is built in (`hermes claw migrate`). No telemetry is collected, which helps with EU/GDPR self-hosting, but provider routing through Nous Portal is opaque.

### Cited Findings
**OS support tiers**
- **Tier 1**: macOS (Apple Silicon), Windows 10/11 native (x86_64, aarch64; the MSIX desktop package needs Windows 11 22H2+), Linux and WSL2 (x86_64, aarch64; tested on the latest Ubuntu), and Docker.
- **Tier 2**: Nix, and Android/Termux (aarch64 only). Docs: "Android can terminate background processes".
- **Unsupported**: pip/PyPI, Homebrew, AUR, and non-aarch64 Termux.
- [platform-support.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/platform-support.md)

**Installation**
- Commands:
  - Linux/macOS/WSL2: `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash`
  - Windows: `iex (irm https://hermes-agent.nousresearch.com/install.ps1)`
- The installer provisions Python 3.14, Node.js, npm, ripgrep and FFmpeg via the bundled `uv`.
- First steps: `hermes setup` (wizard), `hermes model`, `hermes tools`, `hermes gateway`.
- The README warns that antivirus may flag the bundled `uv.exe` as a false positive.
- [README](https://github.com/NousResearch/hermes-agent/blob/main/README.md); [installation.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/getting-started/installation.md)

**Setup effort (secondary, snippet)**
- One comparison claims basic setup takes "2–4 hours" for Hermes versus under 30 minutes for OpenClaw. The search summary did not say which article this came from, and it may be dated or biased. — [comparison set: ishosting](https://blog.ishosting.com/en/hermes-agent-vs-openclaw), [hundredtabs](https://hundredtabs.com/blog/hermes-agent-vs-openclaw), [lushbinary (May 2026)](https://lushbinary.com/blog/hermes-agent-vs-openclaw-updated-comparison-may-2026/)

**Hardware**
- Vendor: "Run it on a $5 VPS or a GPU cluster". Daytona/Modal backends hibernate when idle, "costing nearly nothing between sessions". — [README](https://github.com/NousResearch/hermes-agent/blob/main/README.md)
- Local models need a context window of at least **64,000 tokens** ("Hermes minimum"). The FAQ's example is `qwen3.5:27b` on Ollama. Local endpoints get relaxed streaming timeouts (read timeout 1,800 s). — [faq.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/faq.md)
- Reviews say the 64K floor "rules out most small local models and pushes you toward paid API inference" (snippet, ~June 2026). — [dupple review](https://dupple.com/reviews/hermes-agent)
- Default Docker sandbox limits: 1 CPU, 5 GB RAM, 50 GB disk. — [security.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md)

**Recommended models**
- Nous Portal docs list:
  - `anthropic/claude-sonnet-4.6`: "best general-purpose agentic model"
  - `openai/gpt-5.5-pro`: "strong reasoning + tool calling"
  - `google/gemini-3-pro-preview`: "huge context window"
  - `deepseek/deepseek-v4-pro`: "cost-effective coder"

  The doc may lag behind the catalog: v0.21.5 added GPT-6 Sol/Terra/Luna and Claude Opus 5.5. — [nous-portal.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/integrations/nous-portal.md); [v0.21.5](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.24)
- The FAQ recommends OpenRouter for flexibility and Nous Portal for newcomers. Nous Portal is called "the recommended way to run Hermes Agent" (vendor's own paid service). — [faq.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/faq.md); [nous-portal.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/integrations/nous-portal.md)

**Nous Portal and Tool Gateway (vendor)**
- One OAuth login covers 300+ models.
- The Tool Gateway (web search, image generation, TTS, cloud browser) is "included with every paid Nous Portal subscription" and billed pay-as-you-use.
- The Portal routes models "through OpenRouter, others through proprietary or secondary providers, and the routing for a given model can change over time".
- [nous-portal.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/integrations/nous-portal.md); [tool-gateway.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/tool-gateway.md)

**Token overhead (primary measurement)**
- Issue #4379, opened 1 Apr 2026 against v0.6.0 with Claude Sonnet 4.5 via OpenRouter:
  - "**73% of each API call is fixed overhead (~13.9K tokens)**"
  - 31 tool definitions: 8,759 tokens
  - system prompt plus skills catalog: 5,176 tokens
  - 17–23K tokens per request in total
  - about 3.9M input tokens across 207 API calls in three evening gateway sessions
- The issue list shows it closed on 12 Sep 2026. The related #6839 "Lazy Tool Schema Loading" closed on 2 Sep 2026.
- [issue #4379](https://github.com/NousResearch/hermes-agent/issues/4379); [issue search](https://github.com/NousResearch/hermes-agent/issues?q=is%3Aissue%20token%20usage%20cost%20sort%3Acomments-desc)
- Built-in memory adds about 1,300 tokens to every session. — [memory.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md)

**Reported running costs (secondary, snippets)**

The search summary did not map each figure to a specific page among [gradually.ai](https://www.gradually.ai/en/hermes-agent-costs/), [techjacksolutions](https://techjacksolutions.com/ai-tools/hermes/hermes-agent-cost-breakdown/), [aitokenprice](https://aitokenprice.com/guides/hermes-agent-cost-to-run), [markaicode](https://markaicode.com/pricing/hermes-agent-self-hosted-server-cost-analysis/), [hundredtabs](https://hundredtabs.com/blog/hermes-agent-cost-breakdown) and [getopenclaw.ai](https://www.getopenclaw.ai/blog/hermes-agent-cost), so treat attribution as approximate:
- API costs of "$0 to $85 or more a month", plus $3–32/month hosting for 24/7 channels
- $2–150/month depending on model
- a CLI developer with 50–100 turns/day at 6–8K tokens/turn uses 300K–800K tokens/day
- a small team on the gateway with 200–500 turns/day at 15–20K tokens/turn uses 3–10M tokens/day
- about 9M input and 1.2M output tokens/month for about 50 exchanges/day
- real user costs from "$6 for a bug fix to $405 for a full project"

**Billing issue**
- #110912 "Nous Portal: full/list price charged on some model routes while subscription credits active" (P1, closed 16 Sep 2026). — [issue search](https://github.com/NousResearch/hermes-agent/issues?q=is%3Aissue%20token%20usage%20cost%20sort%3Acomments-desc)

**OpenClaw migration**
- Commands:
  - `hermes claw migrate` (always previews first)
  - `--dry-run`
  - `--preset user-data` (no secrets)
  - `--preset full --migrate-secrets --yes`
  - `--overwrite`
- `hermes setup` detects `~/.openclaw` and offers to migrate. Legacy `~/.clawdbot` and `~/.moltbot` are detected too.
- What it imports:
  - SOUL.md
  - MEMORY.md / USER.md
  - user skills (into `~/.hermes/skills/openclaw-imports/`)
  - command allowlist and approval patterns
  - messaging settings
  - API keys
  - TTS assets
  - workspace instructions
- An `openclaw-migration` skill offers an agent-guided migration. `hermes import-agent` covers Claude Code and Codex CLI.
- [README](https://github.com/NousResearch/hermes-agent/blob/main/README.md); [migrate-from-openclaw.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/guides/migrate-from-openclaw.md)

**EU-relevant facts**
- "Hermes Agent does not collect telemetry, usage data, or analytics. Your conversations, memory, and skills are stored locally in `~/.hermes/`." API calls go only to the configured provider. — [faq.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/faq.md)
- v0.21.5 added a German desktop UI. — [v0.21.5](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.9.24)
- Docs mention a "Hermes Cloud" backend for the desktop app and "managed cron on hosted deployments". The v0.21.3 notes mention "Cloud users". Older reviews said there is "no hosted option". — [tools-reference.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/reference/tools-reference.md); [releases p.1](https://github.com/NousResearch/hermes-agent/releases?page=1); [dupple review](https://dupple.com/reviews/hermes-agent)

### Inferences
- **EU/GDPR**:
  - Self-hosting on an EU VPS with an EU-hosted or local model (Ollama/vLLM via a custom endpoint) keeps data under the operator's control, and the lack of telemetry helps.
  - Nous Portal's changing, multi-backend routing ("can change over time") makes it hard to name sub-processors and data locations for a data-processing agreement. EU businesses handling personal data should prefer direct providers with EU data residency or local models.
  - Messaging channels (Telegram, WhatsApp, etc.) add their own third-party processors.
  - There is no native Mistral provider (wontfix). Mistral can probably still be used through the generic OpenAI-compatible custom endpoint (unverified).
- Cost realism: with about 14K tokens of fixed overhead per call (April 2026 measurement; later lazy-loading work may have reduced it) and background review forks, heavy gateway use on frontier models can reach tens of millions of tokens per day for a team. Prompt caching and cheaper auxiliary models are the main levers.
- Local models are feasible only on hardware that can serve a model of roughly 27B+ parameters at 64K context. A "$5 VPS" works only as a thin host calling remote APIs.

### Gaps
- Nous Portal subscription prices and tiers were not found in the docs read; the pricing page was not reachable.
- No official minimum RAM/CPU figure for the host itself.
- Hermes Cloud availability, pricing and hosting region could not be verified.
- No German or EU-specific (DSGVO) sources could be retrieved: search budget exhausted and German sites blocked.

## 5. Security: model, known vulnerabilities/CVEs and incidents, prompt-injection defences, credential handling

### Takeaway
Hermes documents an eight-layer, defence-in-depth model with extensive heuristics. Its own security policy says only OS-level isolation is a real boundary, and treats prompt injection without a chained exploit as out of scope.

By 4 Oct 2026 the GitHub Advisory Database listed about 47 Hermes-related CVEs. Most were low severity and filed by third parties, but they include one critical (CVSS 9.0) and several high: RCE through a malicious repository, MCP-catalog supply chain, DNS rebinding, and path issues. The two highest-profile incidents were abuses of unmodified Hermes, not exploits of a bug: the YOLO-mode Thai ministry intrusion (July 2026) and the Carbonato Docker botnet (September 2026).

### Cited Findings
**Security model**
- The docs list eight layers:
  1. user authorization
  2. dangerous-command approval
  3. file-write safety
  4. container isolation
  5. MCP credential filtering
  6. context-file injection scanning
  7. cross-session isolation
  8. input sanitization
- The production checklist: explicit allowlists, a container backend, resource limits, chmod 600 on `.env`, DM pairing, a non-root gateway, and `hermes update` regularly.
- [security.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md)
- SECURITY.md trust model and policy:
  - a "single-tenant personal agent"
  - "The only security boundary against an adversarial LLM is the operating system"
  - supported isolation postures are terminal-backend isolation and whole-process wrapping (Docker, NVIDIA OpenShell)
  - out of scope: bypasses of in-process heuristics such as approval-gate regexes and redaction, prompt injection without chained exploitation, and third-party skills/plugins
  - **no bug bounty**; 90-day disclosure; reports to security@nousresearch.com or via GitHub advisories
  - the repo shows "no published security advisories"
  - [SECURITY.md](https://github.com/NousResearch/hermes-agent/blob/main/SECURITY.md); [Security tab](https://github.com/NousResearch/hermes-agent/security)

**Prompt-injection defences**
- Context files (AGENTS.md, .cursorrules, SOUL.md) are scanned before loading for:
  - "ignore previous instructions" patterns
  - hidden HTML comments
  - secret-reading and `curl` exfiltration
  - invisible Unicode

  Blocked files are not loaded. Docs: "These patterns are heuristics, not semantic intent detection."
- The user's own SOUL.md is loaded with a warning rather than blocked, unless it was shipped by a profile distribution.
- [security.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md)
- Memory entries and Skills Hub or project skills are scanned for injection and exfiltration patterns. — [memory.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/memory.md); [skills.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md)
- Other layers:
  - **Tirith** pre-exec scanning for homograph URLs, pipe-to-interpreter and terminal injection. Default `tirith_fail_open: true`. It is unavailable on native Windows and Termux.
  - SSRF protection.
  - A website access policy.
  - An MCP environment-variable allowlist.
  - Credential redaction (`ghp_…`, `sk-…`, bearer tokens) in MCP errors.
  - [security.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md)
- v0.21.0 made protected instruction files require write approval and ran a "comprehensive redaction sweep" over terminal errors, `.env` reads, checkpoints and ACP logs. — [v0.21.0](https://github.com/NousResearch/hermes-agent/releases/tag/v2026.8.31)

**Credentials and supply chain**
- Secrets live in `~/.hermes/.env`. File tools cannot write credential stores or read project `.env` files.
- `terminal.docker_forward_env` is empty by default. Docs warn that any forwarded variable can be read and exfiltrated by code in the container.
- Credential pool rotation since v0.7.0; Bitwarden/1Password integration since v0.19.0.
- Nous Portal uses short-lived JWTs minted from a refresh token.
- [security.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md); [releases p.2](https://github.com/NousResearch/hermes-agent/releases?page=2); [releases p.4](https://github.com/NousResearch/hermes-agent/releases?page=4); [nous-portal.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/integrations/nous-portal.md)
- A built-in supply-chain advisory scanner flags known-compromised Python packages, e.g. "the May 2026 `mistralai 2.4.6` poisoning", at startup and in `hermes doctor`. — [security.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/security.md)

**CVEs**
- The GitHub Advisory DB search for "hermes-agent" returned **48 advisories** on 2026-10-04. At least one is for a different package (mcp-atlassian). — [GitHub advisories](https://github.com/advisories?query=hermes-agent)
- **CVE-2026-82021 (Critical, CVSS 9.0)**, published 28 Aug 2026: "supply chain vulnerability in its bundled MCP catalog … referenced via a mutable branch rather than a pinned commit SHA". Affects 0.18.2 up to 0.19.0; fixed in 0.19.0. — [GHSA-w9gw-vgmg-q67h](https://github.com/advisories/GHSA-w9gw-vgmg-q67h)
- **CVE-2026-71963 (High, CVSS 8.6 v4)**, published 3 Sep 2026: RCE via a malicious repository whose `.git/config` sets `core.fsmonitor`, triggered through git-status index refresh. Affects 0.18.2–0.21.0; fixed in commit f6234d0. Credits Manifold Security and VulnCheck. Can expose provider API keys. — [GHSA-cc88-9pxf-j2wv](https://github.com/advisories/GHSA-cc88-9pxf-j2wv)
- Other notable entries:
  - CVE-2026-82020: High, improper path restriction, 0.16.0 until 0.17.0
  - CVE-2026-53869: High, DNS rebinding in WebSocket endpoints, 17 Jun 2026
  - CVE-2026-53870: Moderate, world-readable `response_store.db` and `webhook_subscriptions.json` before 0.16.0
  - a series of Low-severity CVEs (Jul–Sep 2026) with generic titles such as "Vulnerability in hermes-agent up to 0.16.0"
  - [GitHub advisories](https://github.com/advisories?query=hermes-agent); [VulnCheck](https://www.vulncheck.com/advisories/hermes-agent-sensitive-file-permission-vulnerability-in-store-files)
- Earlier CVEs (snippets):
  - CVE-2026-7112: auth bypass in the API_SERVER_KEY check, v0.8.0
  - CVE-2026-7396: path traversal in the WeCom adapter, v0.8.0
  - CVE-2026-9366: injection in `_scan_context_content` in `agent/prompt_builder.py`, 2026.4.23, network-reachable without auth; patched in 0.15.0
  - CVE-2026-9368: sandbox issue in `execute_code`, ≤2026.4.16
  - CVE-2026-11461: authorization bypass to other users' sessions via session titles, ≤0.12.0
  - [SentinelOne CVE-2026-7112](https://www.sentinelone.com/vulnerability-database/cve-2026-7112/); [SentinelOne CVE-2026-7396](https://www.sentinelone.com/vulnerability-database/cve-2026-7396/); [GHSA-pgp4-xr4j-h5cg / CVE-2026-9366](https://github.com/advisories/GHSA-pgp4-xr4j-h5cg); [GitLab CVE-2026-9368](https://advisories.gitlab.com/pypi/hermes-agent/CVE-2026-9368/); [SentinelOne CVE-2026-11461](https://www.sentinelone.com/vulnerability-database/cve-2026-11461/)
- Conflict: a May 2026 comparison claimed "no reported CVEs as of May 2026" (snippet). The April-dated CVEs above contradict it. — [comparison search set, e.g. lushbinary](https://lushbinary.com/blog/hermes-agent-vs-openclaw-updated-comparison-may-2026/)

**Incidents**
- **Thai Ministry of Finance (reported July 2026)**: Hermes was run "with approval prompts disabled" (YOLO mode) on a rented server for post-exploitation.
  - What the operator's agent did: scanned hosts for root access and crawled staff records back to 2012.
  - What Hunt.io recovered: a hidden web shell, scripts against internal Hadoop systems, and hardcoded stolen mailbox passwords. The logs and 585 files (470 MB) were found in an open directory by Hunt.io and Bob Diachenko.
  - (snippets) [The Hacker News](https://thehackernews.com/2026/07/hacker-runs-hermes-ai-agent-unattended.html); [BleepingComputer](https://www.bleepingcomputer.com/news/security/hermes-ai-agent-used-to-automate-attack-on-thai-finance-ministry/); [nhimg: "YOLO mode shows approval prompts are not enough"](https://nhimg.org/articles/hermes-yolo-mode-shows-approval-prompts-are-not-enough/); [Cakewalk](https://www.cakewalk.security/blog/hermes-agent-yolo-mode-attack)
- **CARBONATO botnet (reported Sept 2026)**:
  - Breaks into Docker daemons exposed without authentication on port 2375, starts privileged containers, and scans neighbouring networks every 5 minutes.
  - "installs the framework unchanged, then overwrites its SOUL.md persona file". The 39-line prompt tells the agent to execute tasks received via **Telegram**, maintain persistence, and collect credentials (AI API keys, SSH credentials, tokens).
  - Discovered through an unauthenticated Docker registry, public since May 2026. Operators are possibly in Costa Rica. Research by ThreatDown.
  - (snippets) [The Hacker News](https://thehackernews.com/2026/09/carbonato-botnet-compromises-docker.html); [ThreatDown](https://www.threatdown.com/blog/carbonato/); [Dark Reading](https://www.darkreading.com/identity-access-management-security/carbonato-botnet-ai-agent-hacked-docker-hosts); [BleepingComputer](https://www.bleepingcomputer.com/news/security/new-carbonato-malware-uses-ai-agents-to-hijack-exposed-docker-hosts/); [SC World](https://www.scworld.com/brief/new-carbonato-botnet-uses-ai-framework-to-target-insecure-docker-daemons)

### Inferences
- **The CVEs**: most low-severity entries look like auto-generated third-party CNA filings (VulDB style). The repo publishes no advisories of its own, so users must watch NVD/GHSA rather than the project's Security tab.
- **The critical and high CVEs** come from two kinds of feature:
  - supply-chain-heavy features (MCP catalog, Skills Hub, plugins)
  - repo-touching features (git integration)

  For an always-on agent with real API keys, prompt updates are important. Hermes' pace (patches every few days) both helps, through fast fixes, and hurts, through new attack surface.
- **The incidents**: both relied on intended features (YOLO mode, the SOUL.md persona, the Telegram gateway, cron/persistence) rather than bugs. Hermes is now a dual-use "autonomous operator" platform that threat actors use.

### Gaps
- Could not read the full THN, BleepingComputer, CSA or ThreatDown articles (blocked). The model/provider the attackers used, how long the agent ran unattended, the Carbonato host count, and any Nous Research statement remain unverified.
- No independent audit or pentest report of Hermes Agent was found.

## 6. Reception: reviews, press, community, praise and complaints, known bugs, benchmarks, comparisons with OpenClaw

### Takeaway
Adoption has been very fast. Hermes went from about 0 to about 251k GitHub stars in about 7 months and reportedly became #1 on OpenRouter's app token rankings in May 2026, overtaking OpenClaw in daily tokens.

Reviews praise the learning loop, memory, cron and messaging breadth. They criticise the 64K-context floor and dependence on paid APIs, the token overhead, setup complexity and the reliability churn. There is also an unresolved plagiarism controversy (EvoMap "Evolver") that maintainers dismissed and partly erased.

Most mainstream press coverage in July–September 2026 was about security abuse. I found no independent head-to-head benchmark with OpenClaw.

### Cited Findings
**Usage metrics (secondary, snippets)**
- On 6 May 2026 Nous announced #1 on OpenRouter's global token rankings with 271B tokens. — [Phemex](https://phemex.com/news/article/hermes-agent-leads-openrouter-usage-with-271-billion-tokens-80104); [explainx](https://explainx.ai/blog/hermes-agent-openrouter-number-one-ranking-nous-research-2026)
- "224 billion tokens per day against OpenClaw's 186 billion". — [buildfastwithai](https://www.buildfastwithai.com/blogs/hermes-agent-openrouter-number-one-2026)
- 1.5T tokens processed in early August 2026, "nearly matching 49 other apps combined", and 33.1T all-time. — [Crypto Briefing](https://cryptobriefing.com/hermes-agent-1-5-trillion-tokens-openrouter/)
- More than 17T cumulative tokens by June 2026 (snippet; exact source page uncertain). — [tokenscost](https://tokenscost.com/blog/hermes-agent-rank-1-openrouter-token-usage)
- A sceptical take exists: "Hermes Agent Leads Global Token Use. What Does That Actually Mean?" (dev.to; not readable). — [dev.to](https://dev.to/jacob_is_surfing/hermes-agent-leads-global-token-use-what-does-that-actually-mean-4n0n)

**Reviews (snippets)**
- Praise: Hermes "improves itself by turning solved problems into reusable skills". "Unusually wide messaging reach across 20+ platforms". "Persistence and scheduling are first-class".
- Criticism: a "hard 64,000-token context floor", and no hosted option or pricing of its own.
- The same review notes HN threads about plagiarism allegations.
- [dupple (2026, references v0.17)](https://dupple.com/reviews/hermes-agent); also [eesel "honest 2026 take"](https://www.eesel.ai/blog/hermes-agent-review), [Medium/kisztof](https://kisztof.medium.com/hermes-agent-review-nous-researchs-self-improving-ai-agent-e72bc244435a), [utilo](https://utilo.io/en/home/blog/hermes-agent-review-2026)

**Plagiarism controversy**
- Issue #17688 "Serious Plagiarism of Open-Source Evolver Core Architecture" (30 Apr 2026). It alleges the self-evolution architecture and "10-step main loop" copy EvoMap's Evolver with "zero citation".
- It was closed "not planned" and labelled duplicate, invalid and "sweeper:incoherent", with no substantive maintainer reply visible. Related issues: #10642, #11507.
- [issue #17688](https://github.com/NousResearch/hermes-agent/issues/17688); [issue #10642](https://github.com/NousResearch/hermes-agent/issues/10642); [issue #11507](https://github.com/NousResearch/hermes-agent/issues/11507)
- Secondary (snippets):
  - EvoMap published a comparison claiming a "one-to-one correspondence in the 10-step main loop, a systematic replacement of 12 groups of terms, and zero attribution in seven public materials".
  - Teknium1 reportedly retitled the original issue to "." and blanked its text, deleted comments from 4 users and blocked them.
  - The reported response was "Delete your account".
  - HN thread: "Nous Research edits GitHub issue to remove plagiarism claims about Hermes Agent".
  - [36kr](https://eu.36kr.com/en/p/3767967755371011); [HN 48187581](https://news.ycombinator.com/item?id=48187581)
  - These are allegations; no independent code comparison was verified.

**Community complaints and bugs (GitHub)**
- Token overhead (#4379, #6839). — [issue #4379](https://github.com/NousResearch/hermes-agent/issues/4379)
- Nous Portal overbilling (#110912, P1).
- Memory limits too small (#5320, open). — [issue search](https://github.com/NousResearch/hermes-agent/issues?q=is%3Aissue%20token%20usage%20cost%20sort%3Acomments-desc)
- "The agent that grows against you" (#99752). — [issue #99752](https://github.com/NousResearch/hermes-agent/issues/99752)
- state.db corruption, WAL wedging and FTS index damage needed a 44-issue fix campaign (v0.21.2, 11 Sep 2026). Cloud session-revocation bugs were fixed in v0.21.3. — [releases p.1](https://github.com/NousResearch/hermes-agent/releases?page=1)
- The most-upvoted issues have modest reaction counts (≤38):
  - Codex "NoneType object is not iterable" (38)
  - dashboard themes "hard to read" (28)
  - A2A support (25)
  - remote agent with local tool execution (23, open)
  - Claude Agent SDK provider with subscription OAuth (20, "blocked")
  - Mistral provider (wontfix)
  - [issues by reactions](https://github.com/NousResearch/hermes-agent/issues?q=is%3Aissue%20sort%3Areactions-%2B1-desc)

**Press**
- Mainstream security press covered the Thai ministry case (The Hacker News, BleepingComputer, CSA, July 2026) and Carbonato (THN, Dark Reading, BleepingComputer, SC World, Sept 2026). — see Q5 links
- Business and tech outlets covered growth (Dealroom, Startup Fortune, Crypto Briefing). — see Q1 and the usage metrics above

**Hacker News**
- Threads exist, including a user report "I've been using the NousResearch Hermes agent for the past couple of weeks…", an orchestrator use case, and the plagiarism thread. Their content could not be retrieved. — [HN 47786673](https://news.ycombinator.com/item?id=47786673); [HN 48581502](https://news.ycombinator.com/item?id=48581502); [HN 48187581](https://news.ycombinator.com/item?id=48187581)

**Comparisons with OpenClaw (secondary, snippets, mostly marketing or affiliate blogs)**
- Framing: "OpenClaw bets on breadth with a giant marketplace … Hermes Agent bets on depth with an agent that remembers and improves itself". OpenClaw is "here are 5,700 skills you can install"; Hermes is "I'll build the skills myself".
- Snapshot figures (likely around May 2026): OpenClaw had 345K stars and 13,700+ community skills; Hermes had 110K stars.
- Verdict: OpenClaw is "the better general-purpose agent platform today", Hermes "the better long-term bet".
- [ishosting](https://blog.ishosting.com/en/hermes-agent-vs-openclaw); [innfactory](https://innfactory.ai/en/blog/openclaw-vs-hermes-agent-comparison/); [pickaxe](https://pickaxe.co/post/hermes-agent-vs-openclaw); [CometAPI](https://www.cometapi.com/hermes-vs-openclaw/); [vdf.ai](https://vdf.ai/blog/hermes-agent-vs-openclaw/); [flowtivity (June 2026)](https://flowtivity.ai/blog/openclaw-vs-hermes-agent-comparison/); [petronellatech](https://petronellatech.com/blog/openclaw-vs-hermes-agent-2026)
- The OpenClaw-compatibility features are verified in the docs: `hermes claw migrate`, the ClawHub skill source, and the community HermesClaw WeChat bridge that runs both agents. — [README](https://github.com/NousResearch/hermes-agent/blob/main/README.md); [skills.md](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/skills.md)

**Benchmarks**
- An arXiv paper "PAST-Bench: Benchmarking the Foundations of Recursive Self-Improvement in Personal Agents" (arXiv 2608.04003, ~Aug 2026) came up in Hermes searches. Whether and how it evaluates Hermes could not be verified (arXiv blocked). — [arXiv 2608.04003](https://arxiv.org/pdf/2608.04003)

### Inferences
- OpenRouter token leadership measures consumption, not efficiency. Given the documented fixed overhead of about 14K tokens per call and the background review forks, a high token count partly reflects verbosity of the architecture as well as adoption. The dev.to critique headline points the same way.
- How the plagiarism dispute was handled (closing with a "sweeper:incoherent" label, reported deletions) is a reputational risk for an open-source project that depends on community trust. Whether the allegation has merit cannot be judged from the sources available.
- Comparison articles mostly come from hosting providers, AI-tool marketers or affiliate sites and should not be treated as independent benchmarks. No neutral, reproducible head-to-head test with OpenClaw was found.

### Gaps
- Reddit (r/LocalLLaMA, r/NousResearch), X/Twitter and YouTube reviews could not be accessed. Proxy blocks and an exhausted web-search budget limited this. Sentiment there is unverified.
- No independent benchmark results (task success rates, reliability) for Hermes Agent vs OpenClaw were found.
- Nous Research's official statements on the security incidents and the plagiarism allegation could not be retrieved.
