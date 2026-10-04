# Open-source / self-hostable autonomous agents & personal assistants other than Hermes Agent and the OpenClaw family (state: 2026-10-04)

> Scope: excludes Hermes Agent (Nous Research) and the OpenClaw family (OpenClaw, NanoClaw, nanobot, PicoClaw, ZeroClaw, IronClaw), which other researchers cover, and excludes closed-source cloud assistants. Categories used throughout: **(a)** Hermes-like always-on personal assistants, **(b)** general autonomous task agents (computer-use / browser / research), **(c)** coding agents, **(d)** frameworks/platforms where you build your own assistant.
>
> **Data provenance:** All star, fork, license, creation and last-push figures come from the GitHub Search API (via the GitHub MCP connector) and were retrieved on **2026-10-04**. Release versions and dates come from each repo's GitHub Releases page or Releases Atom feed, fetched on 2026-10-04. Where GitHub's page shows a date without a year, I resolved it via the Atom feed's ISO timestamp. **Contributor counts could not be retrieved.** The per-repo GitHub API (contributors/releases endpoints) is blocked for non-session repos in this environment, and the repo-page fetches did not expose the sidebar count. The session's WebSearch budget also ran out midway, so Reddit/HN sentiment is thin (see Gaps).

## 1. Which projects compete most directly with Hermes Agent as a self-hosted, always-on personal assistant as of October 2026? (activity check of the candidate list plus new 2026 entrants)

### Takeaway
Outside Hermes and the OpenClaw family, four projects are the most direct, actively maintained Hermes-style competitors in October 2026:
- **QwenPaw** (formerly CoPaw; Alibaba's AgentScope team; 35.4k★; Apache-2.0; v2.2.1 on 2026-09-10)
- **Letta Code** (memory-first and self-improving; chat channels plus heartbeats, crons and schedules; v0.34.2 on 2026-10-02; replaced the archived "lettabot")
- **Agent Zero** (19.4k★; MIT; v2.13 on 2026-09-23; Docker Linux desktop, scheduler, Telegram/WhatsApp)
- **Moltis** (2.9k★; MIT; Rust single binary built security-first; release 2026-09-14)

A second tier is either young, niche, source-available or stalled: Vellum Assistant, Spacebot, OpenFang and AionUi. Several older candidates have faded:
- **Khoj:** cloud deprecation announced; last release 2026-03-26.
- **Leon:** 2.0 is still a developer preview.
- **Second Me:** no push since 2025-09-30.
- **Bytebot** and **Roo Code:** archived.

All of them remain far smaller than Hermes (251k★) and OpenClaw (391k★).

### Cited Findings

#### Baseline (for scale only, not profiled)
- Hermes Agent has ★251,088 and 53,872 forks. It is MIT-licensed, was created 2025-07-22 and was last pushed 2026-10-04. Tagline: "The agent that grows with you". — [GitHub NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent) (GitHub API, 2026-10-04)
- OpenClaw has ★391,278 and 82,252 forks. It is MIT-licensed and was created 2025-11-24. — [GitHub openclaw/openclaw](https://github.com/openclaw/openclaw) (GitHub API, 2026-10-04)
- Hermes's defining trait, as described by a third party, is a "closed learning loop": when it solves a task it writes a reusable Markdown skill file, stores the outcome in persistent memory and adjusts its approach next time. The same article reports community consensus that Hermes and OpenClaw are complementary rather than substitutes. — [MindStudio, "What is Hermes Agent" (undated, 2026)](https://www.mindstudio.ai/blog/what-is-hermes-agent-openclaw-alternative)

#### Overview table, category (a): Hermes-like always-on assistants (sorted by relevance)

| Project | ★ (2026-10-04) | License | Latest release (date) | Last push | Chat channels | Scheduling / proactive | Memory / self-improvement | Local LLMs | Sources |
|---|---|---|---|---|---|---|---|---|---|
| **QwenPaw** (ex-CoPaw), agentscope-ai/QwenPaw | 35,439 | Apache-2.0 | v2.2.1 (2026-09-10) | 2026-09-30 | DingTalk, Lark, WeChat, Discord, Telegram, iMessage, QQ | Cron, heartbeat check-ins, proactive interaction | 3-layer memory; "self-evolving personal knowledge base powered by ReMe" | Ollama, LM Studio, own QwenPaw-Flash 2B/4B/9B | [README](https://github.com/agentscope-ai/QwenPaw), [API](https://github.com/agentscope-ai/QwenPaw) |
| **Letta Code**, letta-ai/letta-code | 3,512 (Letta platform: 25,025) | Apache-2.0 | v0.34.2 (2026-10-02) | 2026-10-04 | Telegram, Slack, Discord (WhatsApp per docs); channels in beta | Heartbeats, crons, Schedules page | Memory blocks, sleep-time "dreaming", skill learning, context self-rewrite | Runs "locally" or with Letta Cloud; local models not explicit | [README](https://github.com/letta-ai/letta-code), [Atom](https://github.com/letta-ai/letta-code/releases.atom), [Docs](https://docs.letta.com/letta-code/channels/) |
| **Agent Zero**, agent0ai/agent-zero | 19,369 | MIT (LICENSE file; GitHub API shows "Other") | v2.13 (2026-09-23) | 2026-10-02 | Telegram, WhatsApp | "Scheduled operations: run recurring checks and monitoring tasks" | Memory systems via plugins | Not verified in current README | [README](https://github.com/agent0ai/agent-zero), [Releases](https://github.com/agent0ai/agent-zero/releases), [Atom](https://github.com/agent0ai/agent-zero/releases.atom), [LICENSE](https://raw.githubusercontent.com/agent0ai/agent-zero/main/LICENSE) |
| **Moltis**, moltis-org/moltis | 2,884 | MIT | 20260913.02 (2026-09-14) | n/a (release 2026-09-14) | Telegram, WhatsApp, Discord, Teams | "Cron scheduling, durable local CalDAV" | SQLite + FTS + vector memory; skills with "autonomous improvement + OpenClaw import" | Local models supported | [README](https://github.com/moltis-org/moltis), [Releases](https://github.com/moltis-org/moltis/releases) |
| **Vellum Assistant**, vellum-ai/vellum-assistant | 1,384 | MIT | n/a | 2026-10-04 | macOS, Windows, iOS, Web, Voice, Email, Telegram, Slack, Twilio | Hourly self-check that messages you if something is due | 8 memory types | Ollama | [README](https://github.com/vellum-ai/vellum-assistant) |
| **Spacebot**, spacedriveapp/spacebot | 2,402 | FSL-1.1-ALv2 (source-available, converts to Apache-2.0 after 2 years) | n/a (beta) | 2026-09-25 | Discord, Slack, Telegram, Twitch, Signal, Mattermost, Email, Webchat | Cron created conversationally; durable task graph | 8 typed memory types, graph-linked | Ollama | [README](https://github.com/spacedriveapp/spacebot) |
| **OpenFang**, RightNow-AI/openfang | 18,210 | Apache-2.0 / MIT | v0.6.9 (2026-05-12); no v1.0 | **2026-07-02 (stalling)** | 40 adapters incl. Telegram, Discord, Slack, WhatsApp, Signal, Matrix, Email | "Hands" run on schedules without prompts; multi-destination cron delivery | SQLite + vector embeddings | Ollama, vLLM | [README](https://github.com/RightNow-AI/openfang), [Releases](https://github.com/RightNow-AI/openfang/releases) |
| **AionUi**, iOfficeAI/AionUi | 33,308 | Apache-2.0 | n/a | n/a | WebUI, Telegram, Lark, DingTalk, WeChat | Cron, intervals, one-time triggers; "truly 24/7 unattended operation" | Depends on the agent it drives | Ollama, LM Studio | [README](https://github.com/iOfficeAI/AionUi) |
| **Khoj**, khoj-ai/khoj | 37,559 | AGPL-3.0 | 2.0.0-beta.28 (2026-03-26) | 2026-08-02 | Browser, Obsidian, Emacs, Desktop, Phone, WhatsApp | Scheduled automations | Memories feature | Local LLMs | [README](https://github.com/khoj-ai/khoj), [Atom](https://github.com/khoj-ai/khoj/releases.atom) |
| **AnythingLLM**, Mintplex-Labs/anything-llm | 66,703 | MIT | v1.17.0 (2026-10-01) | 2026-10-04 | None verified | Cron-scheduled tasks "with full agent capabilities" | "Automatic & User Managed Memories" | Built-in llama.cpp-compatible models, Ollama, LM Studio | [README](https://github.com/Mintplex-Labs/anything-llm), [Atom](https://github.com/Mintplex-Labs/anything-llm/releases.atom) |
| **Leon**, leon-ai/leon | 17,555 | MIT | No core release; component pre-releases 2026-02-19 | 2026-10-04 | n/a | n/a | "Layered memory system" | Local and remote providers | [README](https://github.com/leon-ai/leon), [Atom](https://github.com/leon-ai/leon/releases.atom) |
| **elizaOS**, elizaOS/eliza | 19,538 | MIT | No product release identifiable (GitHub "releases" are PR-evidence asset stores) | 2026-10-04 | Discord, Telegram, Slack connectors | "Scheduled workflows" | Memory, knowledge | Eliza-1 local models (2B–27B) | [README](https://github.com/elizaOS/eliza), [Releases](https://github.com/elizaOS/eliza/releases) |

#### Status of the coordinator's candidate list (verified 2026-10-04)

**Active**
- **Agent Zero:** active, v2.13 (2026-09-23). — [Atom](https://github.com/agent0ai/agent-zero/releases.atom)
- **Letta:**
  - The Letta platform has ★25,025 and was last pushed 2026-09-10. Its repo metadata shows PR creation limited to collaborators and 0 open issues. — [GitHub letta-ai/letta](https://github.com/letta-ai/letta)
  - Letta Code is very active: last push 2026-10-04, 499 open issues, v0.34.2. — [GitHub letta-ai/letta-code](https://github.com/letta-ai/letta-code), [Atom](https://github.com/letta-ai/letta-code/releases.atom)
- **Goose:**
  - Goose now lives at **aaif-goose/goose** (★54,931, 6,356 forks, Rust, created 2024-08-23) and describes itself as "part of the Agentic AI Foundation (AAIF) at the Linux Foundation" under Apache-2.0. — [GitHub aaif-goose/goose](https://github.com/aaif-goose/goose)
  - Latest release v1.53.0 (2026-10-02); v1.52.0 (2026-09-23) added "Live voice conversations in the desktop application". — [Goose releases](https://github.com/aaif-goose/goose/releases)
- **OpenHands:** now at **OpenHands/OpenHands** (★89,955, 11,883 forks, MIT); the README references Docker image 1.24.0. — [GitHub OpenHands/OpenHands](https://github.com/OpenHands/OpenHands)
- **Suna/Kortix:** active (★20,246, last push 2026-10-04). GitHub reports its license as "Other" and **issues are disabled**. — [GitHub kortix-ai/suna](https://github.com/kortix-ai/suna)
- **II-Agent:** low traction (★3,391, last push 2026-08-16). — [GitHub Intelligent-Internet/ii-agent](https://github.com/Intelligent-Internet/ii-agent)
- **OWL / CAMEL:** active (★20,151 / ★17,810; both pushed 2026-09-30). — [OWL](https://github.com/camel-ai/owl), [CAMEL](https://github.com/camel-ai/camel)
- **Agent S (Simular):** ★12,529, last push 2026-09-05. — [GitHub simular-ai/Agent-S](https://github.com/simular-ai/Agent-S)
- **Microsoft UFO:** now branded "UFO³: Weaving the Digital Agent Galaxy" (★9,915, last push 2026-09-29). — [GitHub microsoft/UFO](https://github.com/microsoft/UFO)
- **Browser Use:** ★117,107, last push 2026-10-03. — [GitHub browser-use/browser-use](https://github.com/browser-use/browser-use)
- **Jan:** ★44,785, last push 2026-10-02. — [GitHub janhq/jan](https://github.com/janhq/jan)
- **AnythingLLM:** active (v1.17.0, 2026-10-01). It now tags itself with "hermes-agent", "agent-harness" and "computer-use" topics. — [GitHub](https://github.com/Mintplex-Labs/anything-llm)
- **LibreChat:** now at **LibreChat-AI/LibreChat** (★45,252); **Open WebUI** (★153,921, last push 2026-10-03). — [LibreChat](https://github.com/LibreChat-AI/LibreChat), [Open WebUI](https://github.com/open-webui/open-webui)
- **n8n, Dify, Activepieces:** all active, last pushed 2026-10-04 (★206,625 / 157,815 / 24,894). — [n8n](https://github.com/n8n-io/n8n), [Dify](https://github.com/langgenius/dify), [Activepieces](https://github.com/activepieces/activepieces)
- **OpenCode:** now at **anomalyco/opencode** (★211,687, MIT, last push 2026-10-04). The older Go project opencode-ai/opencode (★13,787) is **archived**. — [anomalyco/opencode](https://github.com/anomalyco/opencode), [opencode-ai/opencode](https://github.com/opencode-ai/opencode)
- **Cline** and **Kilo Code:** both active. Cline: ★69,821, last push 2026-10-03. Kilo: ★27,488, MIT, last push 2026-10-04. — [Cline](https://github.com/cline/cline), [Kilo](https://github.com/Kilo-Org/kilocode)
- **Moltis:** active (release 2026-09-14). **memU:** active (last push 2026-10-01), but it is a memory layer, not an assistant (see Q2). — [Moltis](https://github.com/moltis-org/moltis/releases), [memU](https://github.com/NevaMind-AI/memU)

**Changed direction**
- **Open Interpreter:**
  - Now **openinterpreter/openinterpreter** (★68,504, Rust), described as "A coding agent for open models like Kimi K3 and GLM 5.3". — [GitHub openinterpreter/openinterpreter](https://github.com/openinterpreter/openinterpreter)
  - The README says this is "the new Rust version of Open Interpreter, based on Codex". The original Python project "lives on as a community-maintained fork at endolith/open-interpreter". — [README](https://github.com/openinterpreter/openinterpreter)
  - It is therefore no longer a personal assistant; it is now category (c).

**Faded, stalled or archived**
- **Khoj:**
  - The last release is 2.0.0-beta.28 (2026-03-26T03:41Z).
  - beta.26 added a "Banner to notify Khoj cloud users about the upcoming cloud deprecation" and disabled new cloud subscriptions.
  - Last push 2026-08-02.
  - — [Khoj releases Atom](https://github.com/khoj-ai/khoj/releases.atom), [GitHub](https://github.com/khoj-ai/khoj)
- **Leon:**
  - The README states Leon "is currently focused on the 2.0 Developer Preview on the develop branch" and "The new documentation is not ready yet". It recommends master for stability. — [GitHub leon-ai/leon](https://github.com/leon-ai/leon)
  - The release feed contains only component pre-releases (TCP Server 2.0.0, Node.js Bridge 1.3.0, Python Bridge 1.4.0, all 2026-02-19) and no core release. — [Leon Atom](https://github.com/leon-ai/leon/releases.atom)
- **ElizaOS:** very active (pushed 2026-10-04), but its recent GitHub "releases" are internal PR-evidence asset stores (e.g., pr-evidence-14, 2026-09-26), not product releases. — [elizaOS releases](https://github.com/elizaOS/eliza/releases)
- **AutoGPT:** active (★187,648, last push 2026-10-04). — [GitHub](https://github.com/Significant-Gravitas/AutoGPT)
- **Roo Code: discontinued.**
  - The repo is archived on GitHub (archived=true, last push 2026-05-15). — [GitHub RooCodeInc/Roo-Code](https://github.com/RooCodeInc/Roo-Code)
  - Secondary 2026 sources report: last release v3.54.0; roocode.com redirects to roomote.dev; a community fork exists ("ZooCode"). — [WeTheFlywheel (2026)](https://wetheflywheel.com/en/comparisons/opencode-vs-roo-code-vs-cline/), [Zynovix (2026)](https://zynovix.github.io/roo-code-review-2026.html), [SyntaxDispatch](https://www.syntaxdispatch.com/blog/roo-code-review)
- **Aider: slowing.** No push since 2026-05-22 (★49,369). — [GitHub Aider-AI/aider](https://github.com/Aider-AI/aider)
- **Bytebot: archived** (last push 2025-09-12). **Second Me: stale** (last push 2025-09-30). — [Bytebot](https://github.com/bytebot-ai/bytebot), [Second Me](https://github.com/mindverse/Second-Me)
- **lettabot: archived.** Description: "Archived - has been replaced by Letta Code channels/schedules!" (★326, created 2026-01-29). — [GitHub letta-ai/lettabot](https://github.com/letta-ai/lettabot)

#### New 2026 entrants found (not on the coordinator's list)
- **QwenPaw (formerly CoPaw):**
  - Created 2026-02-24 by the AgentScope team at Alibaba. — [GitHub agentscope-ai/QwenPaw](https://github.com/agentscope-ai/QwenPaw)
  - A community Docker repo describes it as "QwenPaw（原 CoPaw 项目）" ("QwenPaw, formerly the CoPaw project"). — [log-z/copaw-docker](https://github.com/log-z/copaw-docker)
- **OpenFang:**
  - Created 2026-02-24 and describes itself as an "Open-source Agent Operating System". — [GitHub](https://github.com/RightNow-AI/openfang)
  - Built by Jaber, founder of RightNow AI. — [README](https://github.com/RightNow-AI/openfang)
- **Moltis** (created 2026-01-29): "A secure persistent personal agent server in Rust". — [GitHub](https://github.com/moltis-org/moltis)
- **Spacebot** (created 2026-02-11 by Spacedrive): "An AI agent for teams, communities, and multi-user environments". — [GitHub](https://github.com/spacedriveapp/spacebot)
- **Vellum Assistant** (created 2026-02-07): "An AI Assistant that's easy to setup, does your work 24/7, knows your preferences and gets better over time". It is open-source software "built by Vellum AI, a for-profit company". — [GitHub](https://github.com/vellum-ai/vellum-assistant)
- **AionUi** (created 2025-08-07, ★33,308): "Open-source 24/7 Cowork app for OpenClaw, Hermes, Claude Code, Codex, OpenCode and 20+ more CLI Agent". — [GitHub](https://github.com/iOfficeAI/AionUi)
- **LobsterAI** (NetEase Youdao, created 2026-02-12, ★6,084, MIT): "Built on OpenClaw … takes commands from your phone via WeChat, Feishu, DingTalk & Telegram". It is effectively an OpenClaw derivative. — [GitHub](https://github.com/netease-youdao/LobsterAI)
- **Eigent** (★15,456, Apache-2.0): "The Open Source Cowork Desktop - Local and Free Alternative to Claude Cowork and Codex". — [GitHub](https://github.com/eigent-ai/eigent)
- Smaller privacy-oriented desktop assistants:
  - ClaraVerse (★3,898): "privacy focused ecosystem to replace ChatGPT, Claude, N8N, ImageGen with your own hosted llm". — [GitHub](https://github.com/claraverse-space/ClaraVerse)
  - PyGPT (★1,970): a desktop assistant with "agents, tools, MCP … memory … computer use". — [GitHub](https://github.com/szczyglis-dev/py-gpt)
- Claw-family projects that also surfaced in the discovery search are **out of scope** here and flagged for the OpenClaw researcher:
  - ZeroClaw (★32,928)
  - MimiClaw, "Personal Agent on a $5 chip" (★5,781)
  - NullClaw's nullhub (★1,829)
  - — [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw), [MimiClaw](https://github.com/memovai/mimiclaw), [nullhub](https://github.com/nullclaw/nullhub)

#### What 2026 "alternatives" listicles recommend (read with skepticism)
- 2026 "Hermes Agent alternatives" articles commonly list OpenClaw, n8n, Goose, OpenHands, Cline, Dify and Vellum. — [Vellum (2026)](https://www.vellum.ai/blog/best-hermes-agent-alternatives), [eesel (2026)](https://www.eesel.ai/blog/hermes-agent-alternatives), [fast.io (2026)](https://fast.io/resources/hermes-agent-alternative/), [Eden AI](https://www.edenai.co/post/best-ai-agent-harnesses-comparison-guide), [BetterClaw (2026)](https://www.betterclaw.io/blog/hermes-agent-alternative)
- **Vendor bias:** Vellum's own blog calls Vellum "the best Hermes Agent alternative in 2026", citing MIT code, 8 memory types, a default-deny permission system and free managed hosting. — [Vellum blog](https://www.vellum.ai/blog/best-hermes-agent-alternatives)
- "OpenClaw alternatives" lists (several written by vendors: Vellum, Composio, Simular, Relevance) name Vellum, NanoClaw, nanobot, n8n, Jan and AnythingLLM. — [Vellum](https://www.vellum.ai/blog/best-openclaw-alternatives), [Composio](https://composio.dev/content/openclaw-alternatives), [Simular](https://www.simular.ai/alternatives/openclaw-alternatives), [Relevance AI](https://marketplace.relevanceai.com/compare/openclaw-alternatives), [BuildBetter](https://blog.buildbetter.ai/best-openclaw-alternatives-in-2026-local-first-personal-ai-agents-compared/)
- None of the listicles I sampled mention QwenPaw, Letta Code, Moltis or Spacebot. — Same sources as above.

### Inferences
- **QwenPaw is the strongest non-claw, non-Hermes "Hermes-like" project by both features and traction** (35k★ in about 7 months). Its feature list maps almost 1:1 to Hermes's pillars: channels, cron and heartbeat, proactive behaviour, self-evolving memory, sandbox, local models. Its channel set, however, skews towards Chinese platforms.
- **Letta Code is the closest philosophical competitor.** Like Hermes it centres on memory and self-improvement, now with channels and schedules. Its star count is low (3.5k), but it draws on the Letta/MemGPT lineage (25k★).
- **Agent Zero is the most mature "agent-in-a-box" alternative.** It has been around since 2024 and ships v2.x every ~2 weeks, but it is more of a Docker computer-use workspace that gained chat channels than a learning-loop assistant.
- **Western listicles lag.** They mostly recycle OpenClaw / n8n / Goose / OpenHands, which are not true always-on personal assistants except OpenClaw. The real 2026 competitors only show up through GitHub discovery.
- **Many 2026 projects position themselves as complements to Hermes/OpenClaw, not replacements:**
  - AionUi hosts Hermes and OpenClaw as backends.
  - memU sells itself as a memory layer for OpenClaw and Hermes.
  - Moltis imports OpenClaw skills.
  - LobsterAI is built on OpenClaw.
- **Traction gap:** the largest true alternative (QwenPaw, ~35k★) has about 14% of Hermes's stars and about 9% of OpenClaw's. The ecosystem is very top-heavy.

### Gaps
- Contributor counts for every project (blocked API; see provenance note).
- Release versions and dates for Vellum Assistant, Spacebot, AionUi, Jan, Kortix and the (b)/(c)/(d) projects were not individually verified. Last-push dates serve as the activity proxy.
- The date and terms of Goose's transfer from Block to the AAIF org were not verified in this session. The README only confirms AAIF membership.
- Why the Letta server repo restricts PRs to collaborators (a possible shift of focus to Letta Code or cloud) is not documented in the sources I retrieved.
- Real Reddit/HN community comparisons (r/selfhosted, r/LocalLLaMA) could not be retrieved. Searches returned SEO aggregators, and the WebSearch budget was exhausted.

## 2. Profiles: purpose, features (memory, skills, MCP, channels, scheduling, computer/browser use, multi-agent), models, autonomy, setup, maturity, security, strengths and weaknesses vs. Hermes

### Takeaway
Only the category-(a) projects combine all of the following:
- persistent memory
- an always-on daemon
- chat-app reachability
- schedules and proactive behaviour
- some form of self-improvement

Within that group:
- **Letta Code** and **QwenPaw** come closest to Hermes's "learning loop".
- **Agent Zero** offers the richest built-in computer and browser workspace.
- **Moltis, Spacebot and OpenFang** lead on security engineering (Rust single binaries, sandboxes, encrypted vaults). OpenFang, however, has stalled since mid-2026.

The (b), (c) and (d) projects are highly autonomous once started, but they are on-demand tools or building kits, not companions.

### Cited Findings

#### (a) Hermes-like personal assistants: detailed profiles

**QwenPaw (ex-CoPaw), Alibaba AgentScope team**
- **Purpose:** "Personal AI Assistant; easy to install, deploy on your own machine or on the cloud; supports multiple chat apps." The name stands for "Qwen Personal Agent Workstation". License Apache-2.0. — [GitHub README](https://github.com/agentscope-ai/QwenPaw)
- **Release:** v2.2.1 (2026-09-10), with "Creator 1.2 blueprint workbench, per-Agent model routing, and unified environment management". — [README](https://github.com/agentscope-ai/QwenPaw)
- **Channels:** "DingTalk, Lark, WeChat, Discord, Telegram, iMessage, QQ"; "one instance, all channels". — [README](https://github.com/agentscope-ai/QwenPaw)
- **Memory:** "live working context, full verbatim history, and a self-evolving personal knowledge base powered by ReMe". Memories are stored as "readable, editable, searchable, and linked Markdown memory". — [README](https://github.com/agentscope-ai/QwenPaw)
- **Autonomy:** cron scheduled tasks, heartbeat check-ins, proactive interaction. — [README](https://github.com/agentscope-ai/QwenPaw)
- **Models:** QwenPaw-Flash models (2B/4B/9B), plus "Ollama, LM Studio, or 14+ cloud providers" (DashScope, OpenAI, Anthropic, Gemini, …). — [README](https://github.com/agentscope-ai/QwenPaw)
- **Security:** "Kernel-level Sandbox, Tool Guard, File Guard, Skill Scanner, and Access Policy", with approval levels STRICT / SMART / AUTO / OFF. — [README](https://github.com/agentscope-ai/QwenPaw)
- **Setup:** pip, script install, Docker, Alibaba Cloud ECS one-click, AgentScope Platform, ModelScope Studio, and a desktop app (Tauri, beta). — [README](https://github.com/agentscope-ai/QwenPaw)
- **Maturity:** ★35,439, 3,151 forks, **1,027 open issues**; topics include "mcp", "skills", "agent-harness". — [GitHub API](https://github.com/agentscope-ai/QwenPaw)

**Letta Code (+ Letta platform; formerly MemGPT)**
- **Purpose:** "a stateful agent harness for creating agents that are more like people than tools", with "memory, identity, and a sense of experience over time". Used for coding and general purposes. Apache-2.0. — [GitHub README](https://github.com/letta-ai/letta-code)
- **Self-improvement:** "system prompt learning (through memory blocks)", "skill learning", sleep-time compute ("dreaming") enabling "self-managed schedules"; agents can "programmatically rewrite their context to improve and adapt over time". — [README](https://github.com/letta-ai/letta-code)
- **Channels:** Telegram (pairing code), Slack (`letta channels bind`) and Discord; the docs also list WhatsApp. The channels page is labelled "beta". — [Letta docs: Channels (beta)](https://docs.letta.com/letta-code/channels/); README lists Slack, Telegram and Discord only — [README](https://github.com/letta-ai/letta-code)
- **Scheduling:** "heartbeats and crons" let agents "work across time". A Schedules page supports one-time or recurring prompts ("morning briefing", "hourly email triage") and lets you pick which computer and conversation the prompt runs in. — [README](https://github.com/letta-ai/letta-code), [Letta docs](https://docs.letta.com/letta-code/channels/)
- **Desktop and deployment:**
  - A desktop app exists "for macOS, Windows, and Linux". — [README](https://github.com/letta-ai/letta-code)
  - It can run "locally" or with Letta Cloud; "Remote computers require Letta Cloud for state storage". — [README](https://github.com/letta-ai/letta-code)
- **Models:** "OpenAI / ChatGPT, Anthropic, Z.ai coding plan, etc." — [README](https://github.com/letta-ai/letta-code)
- **Controls:** "Set permission modes and customize what actions are auto-approved or auto-denied". — [README](https://github.com/letta-ai/letta-code)
- **Releases:** v0.34.2 (2026-10-02) added an "opt-in automatic reply relay" for channels; v0.34.1 is dated 2026-09-30. — [Releases](https://github.com/letta-ai/letta-code/releases), [Atom](https://github.com/letta-ai/letta-code/releases.atom)

**Agent Zero (agent0ai)**
- **Purpose:** "an open agent framework for work that needs more than chat: a Dockerized Linux desktop, a browser with DOM annotation, live document cowork, projects, skills, plugins, and a bridge back to your host machine." — [GitHub README](https://github.com/agent0ai/agent-zero)
- **Features:**
  - Multi-agent: "Every agent can create subordinate agents to break down work."
  - MCP servers and A2A connectors.
  - Skills, either loaded on demand or pinned.
  - Memory backends via plugins.
  - An XFCE desktop and a native browser with "Annotate mode".
  - "Scheduled operations: run recurring checks and monitoring tasks with project-scoped context and credentials".
  - — [README](https://github.com/agent0ai/agent-zero)
- **Channels:**
  - v2.13 (2026-09-23) added "Slash commands for Telegram and WhatsApp messaging integrations".
  - v2.12 (2026-09-09) included "Security fixes for WhatsApp path traversal, Telegram webhook authentication bypass" and "Connector & Transport Hardening".
  - — [Releases](https://github.com/agent0ai/agent-zero/releases), [Atom](https://github.com/agent0ai/agent-zero/releases.atom)
- **Security guidance:** "Keep it running inside Docker or another isolated environment… Do not mount your entire home directory unless you understand the risk." — [README](https://github.com/agent0ai/agent-zero)
- **Setup:** A0 Launcher desktop app (v1.8 mentioned), a terminal installer (curl/PowerShell), or Docker. — [README](https://github.com/agent0ai/agent-zero)
- **License:** the LICENSE file is MIT, while the GitHub API reports "Other/NOASSERTION". — [LICENSE](https://raw.githubusercontent.com/agent0ai/agent-zero/main/LICENSE), [GitHub API](https://github.com/agent0ai/agent-zero)

**Moltis (moltis-org)**
- **Purpose:** "A secure persistent personal agent server in Rust. One binary, sandboxed execution, multi-provider LLMs, voice, memory, Telegram, WhatsApp, Discord, Teams, and MCP tools. Secure by design, runs on your hardware." MIT. About 270K lines of Rust across 59 crates. — [GitHub README](https://github.com/moltis-org/moltis)
- **Security:**
  - "Docker + Apple Container, per-session isolation".
  - SSRF protection that blocks loopback/private/link-local addresses.
  - Secrets zeroed on drop.
  - An "Encryption-at-rest vault (XChaCha20-Poly1305 + Argon2id)".
  - — [README](https://github.com/moltis-org/moltis)
- **Memory and scheduling:** "SQLite + FTS + vector memory"; "Cron scheduling, durable local CalDAV". — [README](https://github.com/moltis-org/moltis)
- **Voice:** "8 TTS + 7 STT providers". — [README](https://github.com/moltis-org/moltis)
- **MCP and skills:** MCP over stdio and HTTP/SSE; skills described as "Bundled/workspace skills + autonomous improvement + OpenClaw import". — [README](https://github.com/moltis-org/moltis)
- **Models:** OpenAI Codex, GitHub Copilot and local models. — [README](https://github.com/moltis-org/moltis)
- **Install:** one-liner script, Homebrew, multi-arch Docker, or Cargo. — [README](https://github.com/moltis-org/moltis)
- **Releases:** date-based tags 20260913.02 (2026-09-14) and 20260902.03 (2026-09-02). The release notes are terse ("chore: prepare release"). — [Releases](https://github.com/moltis-org/moltis/releases)

**Vellum Assistant (vellum-ai), vendor-backed**
- **Memory:** "8 different types of memory (episodic, semantic, procedural, emotional, prospective, behavioral, narrative, shared)", with hybrid dense + sparse retrieval and per-user and per-channel isolation. — [GitHub README](https://github.com/vellum-ai/vellum-assistant)
- **Proactive behaviour:** "Every hour the assistant re-reads its notes, looks for anything unfinished or due soon, and messages you if something needs attention." — [README](https://github.com/vellum-ai/vellum-assistant)
- **Channels:** macOS, Windows, iOS, Web, Voice, Email, Telegram, Slack, Twilio — "One assistant, one memory, every channel". — [README](https://github.com/vellum-ai/vellum-assistant)
- **Models:** Anthropic, OpenAI, Gemini, Fireworks, OpenRouter, MiniMax, any OpenAI-compatible endpoint; "Local models run through Ollama". — [README](https://github.com/vellum-ai/vellum-assistant)
- **Security:** actor identities (guardian / trusted / unknown); credentials held in "a separate process"; sandboxed tools where "The default is to deny". — [README](https://github.com/vellum-ai/vellum-assistant)
- **Hosting:** "Managed runtime on Vellum Platform, or self-hosted. Same codebase, same data model." — [README](https://github.com/vellum-ai/vellum-assistant)

**Spacebot (Spacedrive)**
- **Architecture:** "The multi-threaded agent harness. Built to run teams, communities, and companies". It runs four process types:
  - Channels: one user-facing LLM process per conversation.
  - Branches: concurrent context forks for thinking and memory recall.
  - Workers: independent processes that do the real work.
  - Compactor: a non-LLM process that manages context size.
  - — [GitHub README](https://github.com/spacedriveapp/spacebot)
- **Memory:** "Eight memory types — Fact, Preference, Decision, Identity, Event, Observation, Goal, Todo", stored in SQLite/LanceDB with hybrid search. — [README](https://github.com/spacedriveapp/spacebot)
- **Scheduling:** cron jobs created conversationally; a durable task system with dependency graphs. — [README](https://github.com/spacedriveapp/spacebot)
- **Channels:** Discord, Slack, Telegram, Twitch, Signal, Mattermost, Email, Webchat. — [README](https://github.com/spacedriveapp/spacebot)
- **Models:** OpenAI- and Anthropic-compatible endpoints, including "a local model over Ollama". — [README](https://github.com/spacedriveapp/spacebot)
- **Deployment:** "One Rust binary" or Docker. — [README](https://github.com/spacedriveapp/spacebot)
- **Security:** bubblewrap (Linux) and sandbox-exec (macOS) containment; AES-256-GCM secrets at rest; credential scrubbing of output. — [README](https://github.com/spacedriveapp/spacebot)
- **License and status:** FSL-1.1-ALv2 (converts to Apache 2.0 after two years); in beta. — [README](https://github.com/spacedriveapp/spacebot)

**OpenFang (RightNow AI)**
- **Scale:** single binary of about 32 MB; 137,728 lines across 14 crates; "1,767+ tests". — [GitHub README](https://github.com/RightNow-AI/openfang)
- **"Hands":** seven pre-built autonomous packages (Clip, Lead, Collector, Predictor, Researcher, Twitter, Browser) that "operate independently on schedules without user prompts". The Browser Hand has "mandatory purchase approval gates". — [README](https://github.com/RightNow-AI/openfang)
- **Channels:** 40 adapters (Telegram, Discord, Slack, WhatsApp, Signal, Matrix, Email, Teams, Mattermost, …). — [README](https://github.com/RightNow-AI/openfang)
- **Models:** 27 providers, including Ollama and vLLM. — [README](https://github.com/RightNow-AI/openfang)
- **Protocols:** MCP, plus A2A via the OFP P2P protocol. — [README](https://github.com/RightNow-AI/openfang)
- **Security:** 16 systems, including a WASM sandbox, Merkle hash-chain audit trail, Ed25519-signed manifests, prompt-injection scanning and RBAC. — [README](https://github.com/RightNow-AI/openfang)
- **Maturity:**
  - The README itself warns: "feature complete but still pre-1.0. Expect rough edges and breaking changes"; "Pin to a specific commit for production use until v1.0". v1.0 was targeted for mid-2026. — [README](https://github.com/RightNow-AI/openfang)
  - The latest release is v0.6.9 (2026-05-12, RUSTSEC security patches) and there is no v1.0. — [Releases](https://github.com/RightNow-AI/openfang/releases)
  - Last push 2026-07-02. — [GitHub API](https://github.com/RightNow-AI/openfang)

**AionUi (iOfficeAI)**
- **Purpose:** "a free, open-source, Cowork app with AI Agents". It auto-detects OpenClaw, Hermes, Claude Code, Codex, Gemini CLI, Qwen Code, OpenCode and "20+ more CLI Agent" tools, and also ships an embedded "Zero Setup" agent engine. Apache-2.0. — [GitHub README](https://github.com/iOfficeAI/AionUi)
- **Scheduling:** "Scheduled tasks — Cowork on autopilot", with cron expressions plus timezones, fixed intervals and one-time triggers; "truly 24/7 unattended operation". — [README](https://github.com/iOfficeAI/AionUi)
- **Remote access:** a WebUI mode, plus Telegram, Lark/Feishu, DingTalk and WeChat. — [README](https://github.com/iOfficeAI/AionUi)
- **Local models:** Ollama and LM Studio. — [README](https://github.com/iOfficeAI/AionUi)
- **Data and permissions:** "All data is stored locally in a SQLite database"; the agent has "Full file access". — [README](https://github.com/iOfficeAI/AionUi)
- **Maturity:** 936 open issues. — [GitHub API](https://github.com/iOfficeAI/AionUi)

**AnythingLLM (Mintplex Labs)**
- **Features:**
  - "No-code AI Agent builder" and custom agents.
  - "Scheduled Tasks", described as "Run recurring tasks or prompts on a cron schedule with full agent capabilities".
  - MCP compatibility and agent web browsing.
  - "Automatic & User Managed Memories".
  - — [GitHub README](https://github.com/Mintplex-Labs/anything-llm)
- **Models:** "any open-source llama.cpp compatible model", plus Ollama and LM Studio. — [README](https://github.com/Mintplex-Labs/anything-llm)
- **Deployment:** desktop app (Mac, Windows, Linux) or Docker. — [README](https://github.com/Mintplex-Labs/anything-llm)
- **Releases:**
  - v1.17.0 (2026-10-01): agent web browsing improvements and new image-generation providers.
  - v1.16.2 (2026-09-22): "LLMman - OSS as a local LLM provider" and a new "generate-image" agent skill.
  - — [Atom](https://github.com/Mintplex-Labs/anything-llm/releases.atom), [Releases](https://github.com/Mintplex-Labs/anything-llm/releases)

**Goose (AAIF / Linux Foundation; originally Block)**
- **Purpose:** "your native open source AI agent — desktop app, CLI, and API — for code, workflows, and everything in between", "a general-purpose AI agent that runs on your machine". Built in Rust. — [GitHub README](https://github.com/aaif-goose/goose)
- **Models:** "works with 15+ providers — Anthropic, OpenAI, Google, Ollama, OpenRouter, Azure, Bedrock". — [README](https://github.com/aaif-goose/goose)
- **Extensions:** "70+ extensions via the Model Context Protocol"; ACP providers let it reuse existing Claude, ChatGPT or Gemini subscriptions. — [README](https://github.com/aaif-goose/goose)
- **Releases:** v1.53.0 (2026-10-02) added Opus 5.5 and GPT-6 support; v1.52.0 (2026-09-23) added live voice in the desktop app. — [Releases](https://github.com/aaif-goose/goose/releases)

**Khoj**
- "Your AI second brain. Self-hostable … Build custom agents, schedule automations, do deep research. Turn any online or local LLM into your personal, autonomous AI." AGPL-3.0. — [GitHub](https://github.com/khoj-ai/khoj)
- Accessible from "Browser, Obsidian, Emacs, Desktop, Phone or Whatsapp". — [README](https://github.com/khoj-ai/khoj)
- Cloud deprecation was announced in 2.0.0-beta.26 (2026-03-25). — [Atom](https://github.com/khoj-ai/khoj/releases.atom)

**Leon**
- "Leon is no longer just a classic intent-classification assistant like it was for its first release in 2019." — [GitHub README](https://github.com/leon-ai/leon)
- The 2.0 preview lists local and remote AI providers, skills, agent-based execution, "advanced computer use", a layered memory system and voice. — [README](https://github.com/leon-ai/leon)
- MIT. Docs "not ready yet". — [README](https://github.com/leon-ai/leon)

**elizaOS**
- **Purpose:** "open-source TypeScript framework and product stack for autonomous AI agents". — [GitHub README](https://github.com/elizaOS/eliza)
- **Features:**
  - "chat, voice, memory, knowledge, and document workflows" and "messaging and workspace connectors".
  - "scheduled workflows, coding-agent orchestration".
  - "non-custodial EVM and Solana wallet operations with approval boundaries".
  - Local inference via Eliza-1 models (2B–27B).
  - Setup via `bun install` and `bun run dev`.
  - — [README](https://github.com/elizaOS/eliza)
- **Positioning:** topics include "crypto", "discord", "telegram", "swarm". — [GitHub API](https://github.com/elizaOS/eliza)

**memU (NevaMind): memory layer, not an assistant**
- "a lightweight, agent-driven memory system that gives users a shared LLM wiki across sessions, agents, and devices". — [GitHub README](https://github.com/NevaMind-AI/memU)
- It can "turn useful agent history into reusable Markdown skills automatically" and integrates with "ChatGPT, Claude Code, Cursor, OpenClaw, Hermes, WorkBuddy, Cola, pi". — [README](https://github.com/NevaMind-AI/memU)
- The README says Apache-2.0; the GitHub API reports "Other". ★14,492. — [README](https://github.com/NevaMind-AI/memU), [GitHub API](https://github.com/NevaMind-AI/memU)

#### (b) General autonomous task agents (computer-use / browser / research)

**Kortix (Suna)**
- **Positioning:** "the open-source AI Operating System" and "the leading open-source alternative to Claude Cowork and ChatGPT Work". — [GitHub README](https://github.com/kortix-ai/suna)
- **Features:**
  - "An isolated sandbox per session, on its own branch", plus a "Change request a human approves".
  - "Cron and signed webhooks that spawn sessions automatically".
  - "3,000+ apps in a click" and MCP.
  - "any provider, your own API keys".
  - — [README](https://github.com/kortix-ai/suna)
- **License:** reported as "Other" by GitHub; issues disabled. — [GitHub API](https://github.com/kortix-ai/suna)

**AutoGPT Platform**
- **Licensing is split:**
  - `autogpt_platform/` uses Polyform Shield: "Free for personal and internal business use; cannot be sold as a competing hosted service".
  - `classic/` and everything else is MIT.
  - — [GitHub README](https://github.com/Significant-Gravitas/AutoGPT)
- **Features:** AutoPilot, an agents dashboard, a marketplace and a build canvas. Agents run "on demand, on schedules, and from triggers" across "45+ connected platforms". — [README](https://github.com/Significant-Gravitas/AutoGPT)
- **Self-hosting:** Docker; "You provide the infrastructure and model API keys". — [README](https://github.com/Significant-Gravitas/AutoGPT)

**OpenManus**
- ★58,456, MIT, last push 2026-09-30. — [GitHub](https://github.com/FoundationAgents/OpenManus)

**AgenticSeek**
- "Fully Local Manus AI. No APIs, No $200 monthly bills. Enjoy an autonomous agent that thinks, browses the web, and code for the sole cost of electricity." GPL-3.0, ★27,421, last push 2026-10-02. — [GitHub](https://github.com/Fosowl/agenticSeek)

**Eigent**
- "Open Source Cowork Desktop - Local and Free Alternative to Claude Cowork and Codex". Apache-2.0, ★15,456, last push 2026-10-02. — [GitHub](https://github.com/eigent-ai/eigent)

**OWL and CAMEL**
- OWL: "Optimized Workforce Learning for General Multi-Agent Assistance in Real-World Task Automation". — [GitHub](https://github.com/camel-ai/owl)
- CAMEL: a multi-agent framework, Apache-2.0. — [GitHub](https://github.com/camel-ai/camel)

**Computer-use and browser agents**
- **Agent S:** "an open agentic framework that uses computers like a human", Apache-2.0. — [GitHub](https://github.com/simular-ai/Agent-S)
- **Microsoft UFO³:** a Windows-focused GUI agent, MIT. — [GitHub](https://github.com/microsoft/UFO)
- **Cua:** "Scale computer-use 2.0 with open-source drivers, cross-OS fleets, and benchmarks", MIT, ★27,991. — [GitHub](https://github.com/trycua/cua)
- **Browser Use:** "Agents that use the browser.", MIT, ★117,107. — [GitHub](https://github.com/browser-use/browser-use)

**Bytebot**
- "self-hosted AI desktop agent … within a containerized Linux desktop". **Archived.** — [GitHub](https://github.com/bytebot-ai/bytebot)

#### (c) Coding agents
- **OpenCode** (anomalyco): "The open source coding agent". MIT, ★211,687, the largest repo in this whole survey. — [GitHub](https://github.com/anomalyco/opencode)
- **OpenHands:**
  - "The self-hosted developer control center for coding agents and automations". It can run "OpenHands, Claude Code, Codex, Gemini, or any ACP-compatible agent" locally, in Docker or on VMs. — [GitHub README](https://github.com/OpenHands/OpenHands)
  - "Create automations and workflows that integrate with Slack, GitHub, Linear". MIT. — [README](https://github.com/OpenHands/OpenHands)
- **Cline:** "Autonomous coding agent as an SDK, IDE extension, or CLI assistant". Apache-2.0. — [GitHub](https://github.com/cline/cline)
- **Kilo Code:** "the all-in-one agentic engineering platform". MIT. — [GitHub](https://github.com/Kilo-Org/kilocode)
- **Open Interpreter (Rust):** "A coding agent optimized for low-cost models", a Codex fork that "Runs commands inside native sandboxing on macOS, Linux, and Windows". Apache-2.0. — [GitHub README](https://github.com/openinterpreter/openinterpreter)
- **Aider:** still Apache-2.0, but no push since 2026-05-22. **Roo Code** was discontinued and archived on 2026-05-15 (see Q1). — [Aider](https://github.com/Aider-AI/aider), [Roo Code](https://github.com/RooCodeInc/Roo-Code)

#### (d) Frameworks and platforms (build-your-own assistant)
- **n8n:** "Fair-code workflow automation platform with native AI capabilities … self-host or cloud, 400+ integrations"; topics include mcp-client and mcp-server; GitHub license "Other". — [GitHub](https://github.com/n8n-io/n8n)
- **Dify:** "Build Agentic workflows, RAG pipelines … Deploy on cloud, VPC, or self-hosted"; license "Other". — [GitHub](https://github.com/langgenius/dify)
- **Activepieces:** "AI Agents & MCPs & AI Workflow Automation • (~400 MCP servers for AI agents)"; license "Other". — [GitHub](https://github.com/activepieces/activepieces)
- **Open WebUI:** "User-friendly AI Interface (Supports Ollama, OpenAI API, ...)"; license "Other". — [GitHub](https://github.com/open-webui/open-webui)
- **LibreChat:** "Enhanced ChatGPT Clone: Features Agents, MCP, Skills … open-source for self-hosting". — [GitHub](https://github.com/LibreChat-AI/LibreChat)
- **Jan:** "an open source alternative to ChatGPT that runs 100% offline on your computer"; license "Other". — [GitHub](https://github.com/janhq/jan)
- The **Letta platform**, **CAMEL**, **elizaOS** and **memU** also belong here when used as SDKs or components. — See their entries above.

### Inferences

#### Autonomy scale (my own rubric)
| Level | Name | Description |
|---|---|---|
| **A1** | Reactive | Chat plus single-step tool use when asked. |
| **A2** | Task-autonomous | Plans and executes multi-step work (shell, browser, code) until done, but a human starts each run. |
| **A3** | Unattended | Runs jobs on cron, webhooks or triggers with no human present. |
| **A4** | Always-on companion | A3 plus persistent memory, chat-app reachability and proactive outreach (heartbeat or check-ins). |
| **A5** | Self-improving companion | A4 plus learns skills or rewrites its own memory/prompt from experience. This is Hermes's defining trait per [MindStudio](https://www.mindstudio.ai/blog/what-is-hermes-agent-openclaw-alternative). |

#### Ratings (based on the cited features)
- **A5:** Letta Code. Its channels are still beta.
- **A4–A5:** QwenPaw (self-evolving knowledge base, proactive heartbeat); Moltis (claims "autonomous improvement" of skills).
- **A4:**
  - Agent Zero (self-improvement not verified)
  - Vellum Assistant (hourly proactive check)
  - Spacebot (multi-user)
  - OpenFang (Hands run unprompted, but the project is stalling)
- **A3–A4:** AionUi (depends on the backend agent); LobsterAI (OpenClaw-based); elizaOS.
- **A3:**
  - AnythingLLM (cron tasks; no verified chat channels)
  - Khoj (scheduled automations; declining)
  - Kortix (cron and webhooks, human-approved merges)
  - AutoGPT Platform (schedules and triggers)
  - n8n, Dify and Activepieces (A3 only after you build the assistant)
- **A2:**
  - Goose (A3 only if its scheduler is confirmed; see Gaps)
  - Leon (dev preview)
  - OpenManus, AgenticSeek, Eigent, OWL, Agent S, UFO³, Browser Use, Cua
  - All coding agents. OpenHands reaches about A3 via Slack/GitHub/Linear automations.
- **A1–A2:** Open WebUI, LibreChat, Jan (chat front-ends with tools, agents and MCP).

#### Setup difficulty (from the documented install paths)
- **Easiest:**
  - Desktop installers: AnythingLLM, Goose, Letta Code app, AionUi, Eigent, Jan; Agent Zero's A0 Launcher.
  - One-liners: Moltis (brew/curl), OpenFang (curl).
- **Moderate:** QwenPaw (pip/Docker; desktop app is beta); Spacebot (binary/Docker plus config); self-hosted Vellum; elizaOS (bun from source). Any messaging channel requires creating bot tokens and webhooks.
- **Hard:** self-hosted Kortix and AutoGPT Platform (multi-service Docker stacks, bring your own keys); Leon 2.0 (docs not ready).

#### Security posture (ranked by documented controls, not audited)
- Moltis, OpenFang, Spacebot and QwenPaw document the deepest built-in controls: per-session sandboxes, encrypted secret vaults, SSRF protection, approval levels, signed skills and audit trails.
- Vellum documents default-deny.
- Agent Zero relies mainly on Docker isolation. Its September 2026 fixes for WhatsApp path traversal and a Telegram webhook auth bypass show that the new channel surface has real attack exposure.
- AionUi grants "Full file access".
- None of these projects showed an independent security audit in the sources retrieved.

#### Strengths and weaknesses vs. Hermes
- **QwenPaw**
  - Strengths: more channels in the Chinese ecosystem; explicit STRICT/SMART/AUTO approval levels; its own small local models.
  - Weaknesses: no WhatsApp or Signal listed (matters for EU users); Alibaba-cloud defaults; large issue backlog (1,027).
- **Letta Code**
  - Strengths: the most research-grounded memory and self-learning stack (MemGPT lineage); polished desktop app.
  - Weaknesses: channels are beta; small community (3.5k★); remote-computer setups depend on Letta Cloud.
- **Agent Zero**
  - Strengths: the richest built-in workspace (Linux desktop, browser, sub-agents, plugins, MCP/A2A); fast release cadence.
  - Weaknesses: heavier footprint; channels are recent; learning loop less central than in Hermes.
- **Moltis**
  - Strengths: security-first single binary; voice; imports OpenClaw skills.
  - Weaknesses: small community; terse release notes.
- **Spacebot**
  - Strengths: true multi-user concurrency; Signal and Email channels.
  - Weaknesses: not OSI open source (FSL); beta.
- **OpenFang**
  - Strengths: ambitious autonomy ("Hands") and security design.
  - Weaknesses: pre-1.0 and quiet since July 2026, so a stall or abandonment risk.
- **AionUi**
  - Best used together with Hermes (a GUI and scheduler around it), not instead of it.
- **AnythingLLM / Goose**
  - Strengths: easiest local start.
  - Weaknesses: no documented chat-app gateway, so they are not Hermes-style "reach me anywhere" assistants.

### Gaps
- Goose scheduler/"scheduled recipes", permission modes and sandboxing are not in the fetched README or release notes, and could not be verified (WebSearch budget exhausted).
- Agent Zero's current local-model providers (e.g., Ollama, LM Studio) are not listed explicitly in the 2026 README fetch. Its built-in self-improvement mechanisms were also not verified.
- Letta Code: explicit local-model (Ollama) support is not stated in the README fetch. WhatsApp support conflicts between README and docs.
- Kortix's exact license name and its self-hosting dependencies were not captured.
- Latest-release data for Open WebUI, LibreChat, n8n, Dify, Activepieces, Jan, Cline, Kilo, Browser Use, Agent S, UFO and Cua was not collected.
- Benchmarks (OSWorld for Agent S/UFO, SWE-bench for OpenHands) were not verified.
- No independent security audits or CVE histories were found for any (a)-category project.

## 3. Which projects best suit (a) non-technical users, (b) developers, (c) privacy-focused fully local setups (no cloud LLM)? Including the EU/German angle

### Takeaway
- **Non-technical users:** AnythingLLM Desktop (local, cron tasks), AionUi (GUI, 24/7 schedules, Telegram remote) and Letta Code's desktop app are the easiest on-ramps. QwenPaw's desktop app is still beta, and Agent Zero's launcher still means running Docker.
- **Developers:** Letta Code, Agent Zero and QwenPaw offer the deepest hackable Hermes-like stacks. Moltis and Spacebot suit Rust/ops-minded self-hosters; n8n and Dify suit those who want to assemble their own assistant.
- **Fully local, privacy-first (EU):** the best-documented options are AnythingLLM, Jan (chat only), AgenticSeek, QwenPaw (with its 2B–9B local models), Moltis, Spacebot ("fully self-contained" with Ollama) and Goose. Using Telegram, WhatsApp or Slack as the interface reintroduces third-party data flows.

### Cited Findings

#### (a) Non-technical users
- AnythingLLM ships a desktop app for Mac, Windows and Linux, built-in local models and cron "Scheduled Tasks". — [GitHub README](https://github.com/Mintplex-Labs/anything-llm)
- AionUi has an embedded agent engine needing "Zero Setup", a WebUI, Telegram/Lark/DingTalk/WeChat remote access and cron scheduling. — [GitHub README](https://github.com/iOfficeAI/AionUi)
- Letta Code has a desktop app (macOS, Windows, Linux) and a visual channel setup in the app's Channels tab. — [README](https://github.com/letta-ai/letta-code), [Letta docs](https://docs.letta.com/letta-code/channels/)
- Goose has native desktop apps for macOS, Linux and Windows. — [README](https://github.com/aaif-goose/goose)
- QwenPaw offers a desktop app (Tauri, Beta) and a one-click deployment on Alibaba Cloud ECS. — [README](https://github.com/agentscope-ai/QwenPaw)
- Agent Zero offers the A0 Launcher desktop app, but recommends running inside Docker or another isolated environment. — [README](https://github.com/agent0ai/agent-zero)
- Vellum offers a managed runtime and native iOS/macOS apps; it can also be self-hosted. — [README](https://github.com/vellum-ai/vellum-assistant)
- Eigent is an "Open Source Cowork Desktop"; Jan is an offline desktop ChatGPT alternative. — [Eigent](https://github.com/eigent-ai/eigent), [Jan](https://github.com/janhq/jan)

#### (b) Developers
- Letta Code offers permission modes and runs locally or on Letta Cloud; the Letta platform is a "Platform for stateful agents". — [Letta Code](https://github.com/letta-ai/letta-code), [Letta](https://github.com/letta-ai/letta)
- Agent Zero offers plugins, MCP, A2A and subordinate agents. — [README](https://github.com/agent0ai/agent-zero)
- Moltis (59 Rust crates; Homebrew/Docker/Cargo) and Spacebot ("One Rust binary") are single-binary options. — [Moltis](https://github.com/moltis-org/moltis), [Spacebot](https://github.com/spacedriveapp/spacebot)
- elizaOS is a TypeScript framework run from source with bun. — [elizaOS](https://github.com/elizaOS/eliza)
- Goose provides a CLI, an API, 70+ MCP extensions and ACP. — [Goose](https://github.com/aaif-goose/goose)
- Coding agents: OpenCode, OpenHands, Cline, Kilo. Build-your-own platforms: n8n, Dify, Activepieces. — [OpenCode](https://github.com/anomalyco/opencode), [OpenHands](https://github.com/OpenHands/OpenHands), [n8n](https://github.com/n8n-io/n8n), [Dify](https://github.com/langgenius/dify)

#### (c) Fully local / privacy-first
- **Jan:** "runs 100% offline on your computer". — [GitHub](https://github.com/janhq/jan)
- **AgenticSeek:** "Fully Local Manus AI. No APIs". — [GitHub](https://github.com/Fosowl/agenticSeek)
- **AnythingLLM:** "any open-source llama.cpp compatible model", Ollama, LM Studio; v1.16.2 added "LLMman - OSS as a local LLM provider". — [README](https://github.com/Mintplex-Labs/anything-llm), [Atom](https://github.com/Mintplex-Labs/anything-llm/releases.atom)
- **QwenPaw:** QwenPaw-Flash 2B/4B/9B plus Ollama and LM Studio, with a kernel-level sandbox. — [README](https://github.com/agentscope-ai/QwenPaw)
- **Moltis:** "runs on your hardware"; local models; an encryption-at-rest vault. — [README](https://github.com/moltis-org/moltis)
- **Spacebot:** "a local model over Ollama" for fully self-contained deployments; AES-256-GCM secrets. — [README](https://github.com/spacedriveapp/spacebot)
- **AionUi:** "All data is stored locally in a SQLite database"; Ollama and LM Studio. — [README](https://github.com/iOfficeAI/AionUi)
- **Goose:** Ollama among 15+ providers. **OpenFang:** Ollama and vLLM. **Vellum:** "Local models run through Ollama". — [Goose](https://github.com/aaif-goose/goose), [OpenFang](https://github.com/RightNow-AI/openfang), [Vellum](https://github.com/vellum-ai/vellum-assistant)
- **elizaOS:** local Eliza-1 models (2B–27B). **Khoj:** "Chat with any local or online LLM"; self-hostable. — [elizaOS](https://github.com/elizaOS/eliza), [Khoj](https://github.com/khoj-ai/khoj)
- **Open Interpreter (new):** explicitly "optimized for low-cost models" and "open models like Kimi K3 and GLM 5.3". — [GitHub](https://github.com/openinterpreter/openinterpreter)

#### Licensing notes relevant to EU/business users
- Khoj is AGPL-3.0. — [GitHub](https://github.com/khoj-ai/khoj)
- Spacebot is FSL-1.1-ALv2 (source-available; converts to Apache 2.0 after two years). — [README](https://github.com/spacedriveapp/spacebot)
- AutoGPT's platform is Polyform Shield ("cannot be sold as a competing hosted service"). — [README](https://github.com/Significant-Gravitas/AutoGPT)
- n8n describes itself as "Fair-code". — [GitHub](https://github.com/n8n-io/n8n)
- Permissive licenses (MIT or Apache-2.0): QwenPaw, Letta/Letta Code, Agent Zero, Moltis, Vellum, AionUi, AnythingLLM, Goose, OpenFang, OpenHands, OpenCode. — See the per-project sources above.

### Inferences
- **Best fully local Hermes-like pick for an EU user:**
  - **Moltis** or **Spacebot** for a server/NAS. Both are single binaries with sandboxes, encrypted secrets and Ollama-backed operation. Spacebot's FSL license and beta status are caveats.
  - **QwenPaw** if the user wants the richest feature set and accepts a younger, China-centric project whose defaults should be switched to local or EU-hosted models.
  - **AnythingLLM** for the simplest fully local desktop experience, at the cost of no chat-app gateway.
- **Chat-app reachability vs. privacy:**
  - Routing an otherwise local agent through Telegram, WhatsApp, Discord or Slack sends message content via third-party (mostly US-based) servers. That undercuts a "no cloud" goal under GDPR thinking.
  - Better options are the agent's own WebUI behind a VPN, or E2E-oriented or self-hostable channels: Signal and Email (Spacebot, OpenFang), or Matrix and Mattermost (OpenFang, Spacebot).
- **Local small models (2B–9B) will likely reduce reliability** for long autonomous multi-step tasks compared with frontier cloud models. Open Interpreter's pivot to harnesses "optimized for low-cost models" suggests the harness design matters a lot. Expect to trade autonomy for privacy.
- **Vendor and jurisdiction:** QwenPaw (Alibaba) and LobsterAI (NetEase Youdao) are open source and self-hostable. Their default integrations (DashScope, DingTalk, WeChat, Feishu) are China-centric, so EU users should explicitly configure local or EU providers. This is an inference about defaults, not evidence of any data transfer.
- **Licensing for businesses:** for a small business in Germany, MIT/Apache projects carry the least legal friction. AGPL (Khoj), FSL (Spacebot), Polyform Shield (AutoGPT platform) and fair-code (n8n) need a license review before commercial or hosted use.

### Gaps
- No independent benchmarks compare these assistants' autonomy or reliability on local models (e.g., Qwen/Llama 7–30B via Ollama).
- German-language UX, localization and German voice (TTS/STT) quality were not researched. Moltis advertises "8 TTS + 7 STT providers" but language coverage was not checked.
- No GDPR- or EU-specific documentation (data-processing statements, telemetry defaults) was retrieved for any project. Telemetry and phone-home behaviour remains unverified.
- No first-hand user reports (Reddit/HN) on day-to-day reliability were retrieved, because the WebSearch budget was exhausted.
