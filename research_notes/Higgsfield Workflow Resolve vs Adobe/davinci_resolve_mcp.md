# DaVinci Resolve MCP integrations for Claude (Edit, Color, Fusion, Fairlight): state as of 2026-09-23

> **How these notes were sourced.** Research date: 2026-09-23. The network egress policy for this session blocked most news, forum, Reddit, YouTube and MCP-directory sites (blackmagicdesign.com, forum.blackmagicdesign.com, reddit.com, cined.com, newsshooter.com, cgchannel.com, digitalproduction.com, ymcinema.com, pugetsystems.com, note.com, glama.ai, pulsemcp.com and others). The facts here therefore come from two kinds of source. **(a) Full reads of GitHub READMEs and docs** (via raw.githubusercontent.com) plus the npm and PyPI registries. These are the strongest sources, and several are hands-on measurements by users of Resolve 21.1. **(b) Web-search result snippets** for news articles and blogs, marked **(snippet)** below: I saw only the search engine's excerpt or summary, not the full page. Star counts come from the GitHub search API on 2026-09-23 around 09:55 UTC. The shared web-search budget ran out near the end of the session.

---

## 1. Which DaVinci Resolve MCP servers exist (official and community)? For each: URL, stars, last activity, tool count, licence, OS, and installation for Claude Desktop / Claude Code

### Takeaway
Since **DaVinci Resolve 21.1 (released 2026-09-08)**, Blackmagic Design ships an **official, built-in MCP server in Resolve Studio only**. It is a local stdio binary (`ResolveMCP.exe` on Windows), wired to Claude Desktop, Claude Code or Codex through **File > Setup AI Assistants**. Its tools are a thin "API docs plus run a Python script" layer, not a curated set of editing tools. The community side is large: 73 GitHub repos match "davinci resolve mcp". One project dominates: **samuelgursky/davinci-resolve-mcp** (3,085 stars, MIT, v4.8.17, released almost daily, 37 compound or 389 granular tools). Almost every other server is a single-maintainer project with fewer than 400 stars, and many are only weeks old.

### Cited Findings

#### Official: Blackmagic's native MCP server (Resolve Studio 21.1+)
- DaVinci Resolve 21.1 was released on **2026-09-08** with "AI assistant integration", "expanded support for still photos and camera formats" and "over 100 new tools and controls" — [YMCinema, 2026-09-09](https://ymcinema.com/2026/09/09/davinci-resolve-21-1-chatgpt-claude-ai-assistants/) (snippet); also covered by [Digital Production, 2026-09-08](https://digitalproduction.com/2026/09/08/resolve-21-1-adds-mcp-and-finally-gets-presets/) (snippet). The Newsshooter article URL is dated 2026-09-07, probably a time-zone or embargo difference — [Newsshooter](https://www.newsshooter.com/2026/09/07/blackmagic-design-davinci-resolve-21-1/) (snippet).
- "Blackmagic Design has built a native MCP server into the Studio edition so that Claude, Claude Code, and ChatGPT Codex can organize media, cut highlight reels, and batch render on your behalf" — [CineD](https://www.cined.com/davinci-resolve-21-1-released-ai-assistant-integration-via-mcp-individual-hdr-trims-and-python-scripting-moves-to-studio/) / [Digital Production](https://digitalproduction.com/2026/09/08/resolve-21-1-adds-mcp-and-finally-gets-presets/) (snippet). Coverage describes the assistant as able to "organize timelines, create custom looks, create and run scripts, with those actions reflected directly inside Resolve" — same sources (snippet).
- **Setup:** "Resolve Studio 21.1 can connect to Claude, Claude Code and ChatGPT Codex, with setup handled through File > Setup AI Assistants" — [YMCinema](https://ymcinema.com/2026/09/09/davinci-resolve-21-1-chatgpt-claude-ai-assistants/) (snippet). One how-to says Resolve detects "Claude Desktop, Claude Code, Codex in ChatGPT, Google Antigravity and Grok". It also says that after setup you quit and relaunch the Claude app, and "Resolve's tools become available inside a normal Claude conversation" — [DownloadSource](https://www.downloadsource.net/how-to-connect-an-ai-assistant-to-davinci-resolve-claude-chatgpt-etc/n/25923/) / [Bottle Rocket](https://www.bottlerocketcontent.com/how-to-connect-claude-davinci-resolve/) (snippet).
- **Studio-only:** "The free version of DaVinci Resolve 21.1 does not include this AI assistant integration. DaVinci Resolve Studio 21.1 is required" — [cutsio](https://cutsio.com/blog/how-to-connect-ai-assistant-davinci-resolve-21-1-mcp) (snippet). saadk408's README says the same: "Blackmagic's own MCP server ships with Studio only" — [saadk408/davinci-resolve-lua-mcp](https://github.com/saadk408/davinci-resolve-lua-mcp).
- **Binary and transport:** the official server is `C:\Program Files\Blackmagic Design\DaVinci Resolve\ResolveMCP.exe` and is **stdio-only**: "The official server has no network transport". Tested 2026-09-18 with Resolve Studio 21.1 on Windows 11. The guide bridges it to Streamable HTTP with `mcp-proxy` (pinned to 0.12.0 with `mcp<2`, because the `mcp` 2.x SDK breaks it) — [theRealAi/davinci-resolve-mcp-over-lan](https://github.com/theRealAi/davinci-resolve-mcp-over-lan).
- `ResolveMCP.exe --test` prints a JSON-RPC handshake with `"serverInfo":{"name":"davinci_resolve","version":"21.1"}`. The Resolve folder also ships a **`DaVinciResolve.mcpb` MCP Bundle** for clients that support bundles. Any stdio MCP client (Claude Desktop, Claude Code, Cursor, …) can be pointed at the same command. That bench's setup also sets Preferences → System → General → *External scripting using: Local* — [RajanthaR/resolve-mcp-burn-bench SETUP.md](https://github.com/RajanthaR/resolve-mcp-burn-bench/blob/main/docs/SETUP.md).
- **Native tool set as observed by users:**
  - Discovery and docs: `launch_resolve`, `get_resolve_status`, `get_whats_new`, `get_scripting_api`, `search_scripting_api` and `get_scripting_docs`.
  - Execution: `run_script` runs sandboxed Python with `resolve` and `project` injected. `run_script_unsafe` does the same "plus filesystem/subprocess access".
  - LUT/DCTL helpers: `generate_lut`, `list_luts`, `update_dctl`, "…".
  - Source: [burn-bench SETUP.md](https://github.com/RajanthaR/resolve-mcp-burn-bench/blob/main/docs/SETUP.md). The bench author sums it up: "Blackmagic's MCP server doesn't expose tidy 'edit the timeline' tools… So the agent spends its budget discovering the API and writing Python" — [burn-bench README](https://github.com/RajanthaR/resolve-mcp-burn-bench).
- A Codex skill written against the native server confirms the same tools: `get_resolve_status`, `get_whats_new`, `search_scripting_api`, `get_scripting_api(types=[...])`, `run_script(script=...)` and `run_script_unsafe`. It notes that on **2026-09-15** the native MCP returned Blackmagic's typed `DaVinciResolveScript.pyi` stub, with host build **21.1.0.17** — [Yasei-no-otoko SKILL.md](https://github.com/Yasei-no-otoko/codex-skill-davinci-resolve-edit/blob/main/SKILL.md) and [references/api-editing.md](https://github.com/Yasei-no-otoko/codex-skill-davinci-resolve-edit/blob/main/references/api-editing.md) (Japanese).
- **Conflicting tool-count claim.** Blogs state that "Resolve 21.1's MCP server exposes 88 tools… 20 read-only resources… code execution via Python and Lua" — [byteiota](https://byteiota.com/davinci-resolve-21-1-mcp-server/), [explainx.ai](https://www.explainx.ai/blog/davinci-resolve-21-1-mcp-server-ai-agents-2026) (snippets). That wording almost exactly matches the README of the **third-party** repo DigitalWorkflowCompany/resolve-mcp, created 2026-02-09 (before 21.1 existed): "Exposes 88 tools and 20 resources… AI analysis (transcription, audio classification, Intellisearch, Slate ID, motion deblur…)… `execute_python`, `execute_lua`". See [DigitalWorkflowCompany/resolve-mcp](https://github.com/DigitalWorkflowCompany/resolve-mcp), which contradicts the blogs. The "88 tools" figure is probably a conflation. The hands-on sources above describe a small, script-centred tool set.

#### Community servers (stars, created date and last push from the GitHub search API, 2026-09-23)

| Repo | Stars / forks | Created → last push | Licence | Tools | Edition / Resolve versions | OS | Claude install | Source |
|---|---|---|---|---|---|---|---|---|
| **samuelgursky/davinci-resolve-mcp** | 3,085 / 358 (2 open issues) | 2025-03-18 → 2026-09-22 | MIT | 37 "compound" tools (136 guarded actions) or 389 granular (`--full`), plus an optional Node "advanced" server with 18 offline tools. Claims 361/361 API methods covered and 338 live-tested | Studio for external scripting. Free ≤21.0.x only through an in-app bridge (broken on free 21.1, see Q3). Resolve 18.5+. Tested on Studio 19.1.3, 20.3.2 and 21.0.2.4, plus free 21.0.3.7. Contributors validated on Studio 21.1.0.14 | macOS, Windows, Linux | `npx davinci-resolve-mcp setup`, or `git clone …; python install.py`. The installer configures Claude Desktop, Claude Code, Cursor, VS Code, Windsurf, Zed, Codex CLI and others. First set Preferences > General > External scripting using: **Local** | [README](https://github.com/samuelgursky/davinci-resolve-mcp) |
| barckley75/resolve-claude-mcp | 366 / 48 | 2026-04-12 → 2026-05-14 | MIT | "core 48 Resolve-control tools", plus local MLX transcription (Apple Silicon only) and a macOS `screenshot` tool | Studio 18.0+ | "Tested only on macOS (Apple Silicon)". Windows/Linux "unverified" | uv + `claude_desktop_config.json`. Warns: "Do not use in production" | [README](https://github.com/barckley75/resolve-claude-mcp) |
| hiteshK03/davinci-resolve-mcp | 91 / 9 | 2026-03-26 → 2026-03-28 | MIT | README badge says **162** tools; repo description says **44** (conflict) | Free and Studio through an in-app bridge (a pre-21.1 design). Claims "155 of 162 tools work on Free" | Paths given for Win/macOS/Linux | venv + bridge script in `Fusion/Scripts/Utility` | [README](https://github.com/hiteshK03/davinci-resolve-mcp) |
| apvlv/davinci-resolve-mcp | 78 / 7 | 2025-03-18 → 2026-04-07 | MIT | A small set: project create/load/save, timeline create/switch, media import, folders, timeline from clips, Fusion comp and node creation, `open_page` (media/edit/fusion/color/fairlight/deliver), plus `execute_python` and `execute_lua` escape hatches. Also resources such as `timeline://current` | n/a | n/a | README install | [README](https://github.com/apvlv/davinci-resolve-mcp); listed on [PulseMCP](https://www.pulsemcp.com/servers/davinci-resolve) |
| wassermanproductions/unofficial-davinci-mcp | 35 / 6 | 2026-07-10 → 2026-07-20 | Apache-2.0 | 37 tools. Every mutating tool defaults to `dry_run=true` | "Live" tier needs Studio ("verified on Studio 21"). An "interchange" tier writes FCPXML 1.9, EDL and `.cube` files for free Resolve | macOS, Linux | `claude mcp add davinci -- unofficial-davinci-mcp` (pip install from GitHub; needs ffmpeg) | [README](https://github.com/wassermanproductions/unofficial-davinci-mcp) |
| hoyt-harness/davinci-mcp-professional | 25 / 8 | 2025-06-23 → 2026-09-03 | GPL-3.0 | 6 "kernel" tools at start. 289 tools across 9 domains, loaded on demand through `tools/list_changed` to save tokens | Studio only | Windows, macOS, Linux (Windows needs a system-wide Python) | `claude mcp add -s user davinci-resolve …` or Claude Desktop JSON | [README](https://github.com/hoyt-harness/davinci-mcp-professional) |
| flamexnreal/davinci-resolve-ai-bridge-mcp | 23 / 1 | 2026-07-26 → 2026-09-07 | MIT | Timeline editing, cuts, zoom animation, frame capture, audio analysis | "Free and Studio" through an in-Resolve menu/Console worker. Live-tested only on **free 21.0.3.7** | macOS tested; Win/Linux need verification | `npx davinci-resolve-ai-bridge-mcp` (npm 1.12.0, 2026-09-07) | [README](https://github.com/flamexnreal/davinci-resolve-ai-bridge-mcp), [npm registry](https://registry.npmjs.org/davinci-resolve-ai-bridge-mcp) |
| Tooflex/davinci-resolve-mcp | 19 / 3 | 2025-03-19 → 2026-07-25 | none stated | n/a | n/a | n/a | n/a | [GitHub](https://github.com/Tooflex/davinci-resolve-mcp); [Glama](https://glama.ai/mcp/servers/Tooflex/davinci-resolve-mcp) |
| mhadifilms/dvr | 14 / 2 | 2026-04-25 → 2026-09-19 | MIT | CLI, Python library and MCP server | Studio 18.5+ | macOS, Windows, Linux | `pip install dvr` or `brew install mhadifilms/tap/dvr` (PyPI 1.7.0 on 2026-09-19, 22 releases) | [README](https://github.com/mhadifilms/dvr), [PyPI](https://pypi.org/project/dvr/) |
| guycochran/resolve-mcp-server | 12 | 2026-02-19 → 2026-09-16 | MIT | "53 tools for AI-powered remote video editing via Claude" | n/a | n/a | n/a | [GitHub](https://github.com/guycochran/resolve-mcp-server) |
| lordhoell/davinci-resolve-mcp | 9 | 2026-04-03 | MIT | "440+ tools" plus a Claude Code skill | n/a | n/a | n/a | [GitHub](https://github.com/lordhoell/davinci-resolve-mcp) |
| CiprianSpiridon/davinci-resolve-mcp | 2 | 2026-07-12 → 2026-08-14 | MIT | 334 tools (316 live + 18 offline), including modules for transitions, keyframes, OFX and AI | "Studio recommended" | macOS, Windows, Linux | `npx github:CiprianSpiridon/davinci-resolve-mcp setup` | [README](https://github.com/CiprianSpiridon/davinci-resolve-mcp) |
| CelaviiHQ/cutmaster-ai | 3 | 2026-04-09 → 2026-07-20 | MIT | "227 tools… Claude Code skills, and domain agents" | Studio | n/a | n/a | [GitHub](https://github.com/CelaviiHQ/cutmaster-ai) |
| 2sem/davinci-resolve-lite-mcp | 4 | 2026-05-31 → 2026-09-16 | MIT | 163 tools. Runs inside Resolve as a Scripts-menu HTTP server | Free (Lite) before 21.1, or Studio. **"Unavailable on DaVinci Resolve Lite 21.1+ (App Store)"** | macOS | `claude mcp add --transport http davinci http://127.0.0.1:8765/mcp` | [README](https://github.com/2sem/davinci-resolve-lite-mcp) |
| **saadk408/davinci-resolve-lua-mcp** | 0 (new) | pushed 2026-09-23 | MIT | 15 tools plus `run_lua`, about 60 ms per call | **Free 21.1** (build 21.1.0.17 measured) through a Lua Scripts-menu script | macOS (Apple Silicon measured). Windows "experimental" | A `.mcpb` Claude Desktop extension (double-click to install). Click `Workspace > Scripts > resolve_mcp_bridge` after every Resolve launch | [README](https://github.com/saadk408/davinci-resolve-lua-mcp) |
| SergioCZ28/Resolve-fusion-mcp | 4 | 2026-04-06 → 2026-04-24 | MIT | Fusion page only | "Works on the free version" (a pre-21.1 claim) | n/a | n/a | [GitHub](https://github.com/SergioCZ28/Resolve-fusion-mcp) |
| EddieRivers/davinci-resolve-mcp-free | 1 | 2026-07-02 → 2026-07-02 | MIT | 150+ tools. A hardened fork built on the in-app bridge | Free 18+ (pre-21.1 design) | Win/macOS/Linux paths | venv + bridge | [README](https://github.com/EddieRivers/davinci-resolve-mcp-free) |
| DigitalWorkflowCompany/resolve-mcp | 2 | 2026-02-09 → 2026-06-06 | none stated | 88 tools, 20 resources | Studio 21 | "Built for macOS" | `pip install -e .` | [README](https://github.com/DigitalWorkflowCompany/resolve-mcp) |

- Smaller or adjacent projects:
  - [SpaceWasTaken/Davinci-Claude-MCP](https://github.com/SpaceWasTaken/Davinci-Claude-MCP): a samuelgursky fork with "smart cut" (4 stars).
  - [MOZARTINOS/davinci-resolve-mcp-v2](https://github.com/MOZARTINOS/davinci-resolve-mcp-v2): extends samuelgursky with a confirm gate.
  - [dmmdea/davinci-resolve-cli](https://github.com/dmmdea/davinci-resolve-cli): "a 146-command Python bridge, a Go CLI + MCP server", created 2026-09-21.
  - [Mun1to/vidorq](https://github.com/Mun1to/vidorq): "AI video editor built on DaVinci Resolve Free".
  - [illmakeithappen/artbeats-plugin](https://github.com/illmakeithappen/artbeats-plugin): "DaVinci Resolve MCP bundle + **German** orientation skill for editors new to coding agents".
  - [ChaiWithJai/davinci-resolve-claude-skills](https://github.com/ChaiWithJai/davinci-resolve-claude-skills): Claude Code skills built from the Resolve 20 PDF documentation.
  - [luquimbo/davinci-resolve-mcp](https://github.com/luquimbo/davinci-resolve-mcp): "189 tools across 12 domains" (search title only).
  - An older PyPI package `davinci-resolve-mcp` 0.1.1 (filmcademy) has a single release dated 2025-03-21 and appears abandoned — [PyPI](https://pypi.org/project/davinci-resolve-mcp/).
- **samuelgursky maintenance cadence:**
  - The npm package was first published 2026-05-17 (v2.23.0) and had reached **400 versions** by 2026-09-22 (v4.8.16 at 22:09 UTC and v4.8.17 at 22:28 UTC) — [npm registry](https://registry.npmjs.org/davinci-resolve-mcp).
  - Outside contributors (e.g. @legionsound) live-validate on Studio 21.1.0.14 — [CHANGELOG](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/CHANGELOG.md).
  - The maintainers also build a closed-beta commercial app, "Bradford Post Assistant", on top of the MCP — [README](https://github.com/samuelgursky/davinci-resolve-mcp).
- **Directory listings:** PulseMCP lists the apvlv server ([PulseMCP](https://www.pulsemcp.com/servers/davinci-resolve)). Glama lists Tooflex, apvlv, samuelgursky and saadk408 ([Glama](https://glama.ai/mcp/servers/saadk408/davinci-resolve-lua-mcp)). Claude Directory calls samuelgursky the "Best Davinci Resolve MCP Server for Claude Code (August 2026)" ([Claude Directory](https://www.claudedirectory.org/mcp-servers/samuelgursky-davinci-resolve-mcp)). mcpservers.org lists Tooflex ([mcpservers.org](https://mcpservers.org/servers/Tooflex/davinci-resolve-mcp)). All from snippets or titles.
- **Commercial:** "DavinciClaude — The AI plugin for DaVinci Resolve" / "Text-to-Edit AI" exists but was not evaluated — [davinciclaude.com](https://www.davinciclaude.com/en) (title only).

### Inferences
- For a Claude user on **Resolve Studio 21.1+**, the native server is the lowest-friction route: first-party, set up from a menu, and automatically current with each Resolve build. In practice, though, it is "Claude writes Python against the Resolve API". samuelgursky's server is the most mature *curated* layer, with guarded, verified actions, dry-runs and a list of known API traps. It can run alongside the native server.
- **claude.ai (web) connectors:** my Anthropic connector-registry search on 2026-09-23 (terms "DaVinci Resolve", "video editing", "Blackmagic") returned **no Resolve connector**. Every option is a local stdio or loopback server for Claude Desktop or Claude Code. Reaching Resolve from the claude.ai web app would require self-hosting a bridge such as `mcp-proxy` and exposing a *script-execution* endpoint to the internet. That is a serious security risk, and I found no documented, supported way to do it. (This is my inference from the stdio-only native binary and the loopback-only community servers.)
- Adoption is concentrated: only samuelgursky has more than 1k stars. The long tail (dozens of repos created in 2026, many single-commit) points to high churn. Many free-edition servers were built around the pre-21.1 Python bridge and are now obsolete (see Q3).

### Gaps
- I could not read Blackmagic's own 21.1 release notes ([forum thread t=239823](https://forum.blackmagicdesign.com/viewtopic.php?f=21&t=239823), which the [2sem README](https://github.com/2sem/davinci-resolve-lite-mcp) links as the official notes), the press release, or the Developer/Scripting README. Egress was blocked.
- The complete, authoritative list and count of native tools is unverified; the observed tool names come from two third-party user repos. Also undocumented in what I could read: the macOS and Linux binary names and paths for the native server, and whether the native setup supports Linux at all.
- Whether the native server exposes MCP resources or prompts, needs authentication, or tolerates concurrent clients is unknown.

---

## 2. What can they actually do through the Resolve scripting API, and what is impossible or unreliable?

### Takeaway
Every server, including the native one, sits on Resolve's scripting API. Through it Claude can reliably handle:
- project, bin and media-pool management
- timeline creation and appending clips by source range and track
- markers, metadata and clip colours
- applying LUTs and CDLs, copying and applying grades (DRX)
- managing Fusion comps
- voice isolation, transcription, and render-queue control

**Resolve 21.1 added** constant speed changes, fades, basic transitions, auto-subtitles from audio, and multicam and render-preset calls, all of them **Studio-only**.

Still **not possible** through the API:
- building Color-page grades from scratch (nodes, wheels, curves, qualifiers, windows)
- blade, trim or roll edits on existing clips
- smooth speed ramps and Edit-page keyframes
- choosing the target track for titles and generators
- importing or placing SRT subtitles

Several calls fail silently or destroy work while reporting success.

### Cited Findings

#### What the curated servers cover
- samuelgursky's compound server covers these areas:
  - App/project control: page switching, projects, folders, databases, archives, presets.
  - Media pool: safe import, image sequences, multicam prep, bins, metadata, relink/proxy guards.
  - Timeline editing and conform: "ripple insert, range operations, gaps/overlaps, source ranges, checked interchange exports/imports".
  - Review markers and flags.
  - Color: "Node graph probing, CDL validation, grade copy, DRX/LUT helpers, versions, Gallery stills, color groups".
  - Fusion: "Timeline-item comps, safe tool creation, input writes, port inspection, validated connections".
  - Audio/Fairlight: "Track/item probes, source mapping, guarded audio property writes, voice isolation, auto-sync planning, transcription/subtitle probes".
  - Render: "Format/codec matrix probing, render settings validation, queued job lifecycle checks, guarded Quick Export".
  - Source: [README](https://github.com/samuelgursky/davinci-resolve-mcp).
- Resolve 21.0 API additions are exposed behind runtime capability detection: "audio classification, speaker-detection transcription, IntelliSearch, slate analysis, motion-deblur, speech generation, session background-task control". `AnalyzeForIntellisearch`, `AnalyzeForSlate` and `GenerateSpeech` "each require a separately-downloaded AI Extras pack, and Resolve reports a missing pack inconsistently" — [README](https://github.com/samuelgursky/davinci-resolve-mcp).
- Voice Isolation get/set per track and per clip was live-tested on Resolve 20.3.2. `RemoveMotionBlur` was live-tested on 21.0.2 and needs the AI Motion Deblur Extra — [api-coverage.md](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/docs/reference/api-coverage.md).
- Neural Engine features in other servers:
  - barckley75 lists "Magic Mask — AI-powered subject isolation" and LUT application — [README](https://github.com/barckley75/resolve-claude-mcp).
  - CiprianSpiridon has an "AI / Neural Engine" module with Magic Mask, Smart Reframe, Stabilize and AI subtitles (6 tools) — [README](https://github.com/CiprianSpiridon/davinci-resolve-mcp).
  - hiteshK03 notes that Smart Reframe and Stabilization are Studio features with no free substitute — [README](https://github.com/hiteshK03/davinci-resolve-mcp).

#### New in the 21.1 API (Studio)
- Reviews list the 21.1 API additions as:
  - creating and flattening multicam clips, triggering multicam SmartSwitch, auto-aligning timeline clips
  - adding transitions, normalising audio, setting fades and speed changes
  - media-pool transcriptions with speaker and timing data
  - render presets and project-setting presets, cloning media files, source audio mapping, output blanking
  - validating and encrypting DCTL
  - Source: [Digital Production](https://digitalproduction.com/2026/09/08/resolve-21-1-adds-mcp-and-finally-gets-presets/) / [Kompozy](https://kompozy.io/reviews/davinci-resolve-21-1) (snippet).
- From the 21.1.0.17 type stub the native MCP returned on 2026-09-15:
  - `TimelineItem.SetSpeed({"Percentage", "RippleTimeline", "PitchCorrection", "StretchKeyframesToFit"})`, where 0% means freeze.
  - `AddTransition({"type","category","position","alignment","duration"})`, with `category="audio"` for audio crossfades.
  - `SetFades({"FadeIn","FadeOut"})`, `Timeline.CreateSubtitlesFromAudio({...})` (chars per line 1–60, gap 0–10 frames), `SetClipsLinked` and `DeleteClips(items, rippleDelete)`.
  - The canonical property access in 21.1 is `GetProperties()/SetProperties(dict)`.
  - The skill tells the agent **not** to reuse older "impossible via API" claims for these operations.
  - Sources: [api-editing.md](https://github.com/Yasei-no-otoko/codex-skill-davinci-resolve-edit/blob/main/references/api-editing.md), [SKILL.md](https://github.com/Yasei-no-otoko/codex-skill-davinci-resolve-edit/blob/main/SKILL.md).
- `AddTransition` measured on Studio 21.1.0.14:
  - A 24-frame centred Cross Dissolve with source handles was created and rendered correctly.
  - "The same request with zero outgoing/incoming handles returned failure and no transition."
  - Adding a transition shifts later item indexes.
  - "Audio transitions, Fusion/OFX effects, other alignments and repeated insertion are not live-validated."
  - Source: [resolve211-native-transitions.md](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/docs/reference/resolve211-native-transitions.md).
- samuelgursky v4.7.0 added the 21.1 `MediaPoolItem.GetTranscription` (timed words) and `TimelineItem.GetType` reads — [CHANGELOG](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/CHANGELOG.md).

#### Impossible, UI-only or unreliable
- **Color page.** The following are **not creatable from structured parameters** through the public API:
  - new serial, parallel, layer or outside nodes, and node reordering
  - Lift/Gamma/Gain wheel values and offset/log/HDR palette values
  - custom and HSL curves, qualifiers, power windows, tracker or window animation
  - Color Warper changes and "detailed OFX or ResolveFX parameter edits"
  - "a fully editable node tree from JSON"
  - "CDL is the main procedural correction surface available to the MCP". The workaround is to apply a prebuilt `.drx`, Gallery still, LUT or DCTL.
  - Source: [color-decision-guide.md](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/docs/guides/color-decision-guide.md).
- **Destructive traps.** `ApplyGradeFromDRX` "replaces the target graph. It is not an append operation" — [color guide](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/docs/guides/color-decision-guide.md). `TimelineItem.CopyGrades` "replaces the target's grade wholesale… returns `True`… and creates no version to go back to". samuelgursky therefore refuses the call unless `acknowledge_trap: true` is passed — [README](https://github.com/samuelgursky/davinci-resolve-mcp).
- **Edit-page gaps.** "The Source/Auto Track Selector… has no get/set in the API, and the `Insert*IntoTimeline` family (titles, generators, OFX, Fusion comps) takes no `trackIndex` — they always drop onto… V1 in practice." Titles and generators "can't be relocated afterward". Media-backed clips *can* target a track through `AppendToTimeline` with `trackIndex` — [api-coverage.md](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/docs/reference/api-coverage.md). "`insert_title` ripples on V1" — [EddieRivers README](https://github.com/EddieRivers/davinci-resolve-mcp-free).
- **Trimming and speed ramps (still UI in 21.1).**
  - Splitting or trimming *existing* clips should be done in the Edit page UI: "deleting and re-inserting can lose grades/Fusion". `DeleteClips` "is a delete API, not a split API".
  - Smooth variable-speed ramps need the Retime Controls or Retime Curve UI. `GetSpeed()` is not a way to verify a curve.
  - The skill drives the UI through the computer-use skill.
  - Sources: [api-editing.md](https://github.com/Yasei-no-otoko/codex-skill-davinci-resolve-edit/blob/main/references/api-editing.md), [ui-editing.md](https://github.com/Yasei-no-otoko/codex-skill-davinci-resolve-edit/blob/main/references/ui-editing.md), [SKILL.md](https://github.com/Yasei-no-otoko/codex-skill-davinci-resolve-edit/blob/main/SKILL.md).
- **Frame-accuracy pitfalls.**
  - `AppendToTimeline` end frames are inclusive, and "the stub does not sufficiently define end inclusivity and source start offset". Verify on a short range first.
  - `recordFrame` is an absolute timeline frame, and the default start is 01:00:00:00, "so do not pass zero".
  - Do not edit VFR media precisely as if it were constant frame rate.
  - Python variables do not persist between MCP calls, so re-fetch objects by ID each time.
  - Source: [api-editing.md](https://github.com/Yasei-no-otoko/codex-skill-davinci-resolve-edit/blob/main/references/api-editing.md) (translated from Japanese).
- **Subtitles.** The 21.1 stub has no API to create or set text for manual subtitle events or to place an SRT. `ImportIntoTimeline` is for AAF, and `ImportTimelineFromFile` does not list SRT. SRTs must be imported and placed in the UI — [api-editing.md](https://github.com/Yasei-no-otoko/codex-skill-davinci-resolve-edit/blob/main/references/api-editing.md).
- **Keyframes.** "The scripting API only supports static property values, not animated keyframes" — [hiteshK03](https://github.com/hiteshK03/davinci-resolve-mcp); also [EddieRivers](https://github.com/EddieRivers/davinci-resolve-mcp-free) ("animated transforms/opacity/etc. are not settable"). Workarounds:
  - Animate through Fusion: flamexnreal offers `animate_zoom` and `keyframe_clip_saturation` using "native Fusion animation" — [flamexnreal](https://github.com/flamexnreal/davinci-resolve-ai-bridge-mcp).
  - CiprianSpiridon *claims* 4 keyframe tools ("read/set/delete animation keyframes on timeline items") — [README](https://github.com/CiprianSpiridon/davinci-resolve-mcp). This conflicts with the other READMEs and is unverified.
- **Fusion.**
  - EddieRivers: you can add, import, export and load comps, but "the values inside them (e.g. a Text+ node's text) are not settable via the API". Validated workaround: export the `.comp`, edit `StyledText`, re-import — [README](https://github.com/EddieRivers/davinci-resolve-mcp-free).
  - samuelgursky advertises Fusion "input writes" and validated connections — [README](https://github.com/samuelgursky/davinci-resolve-mcp). These two claims conflict, probably reflecting differences between the bridges.
- **Transitions before 21.1:** "must be added manually from the Effects Library" — [hiteshK03](https://github.com/hiteshK03/davinci-resolve-mcp). One project bridged to a Workflow Integration plugin "to unlock per-clip volume, transitions, and template aesthetics the standalone scripting API blocks" — [DannyDesert/davinci-mcp-fat](https://github.com/DannyDesert/davinci-mcp-fat).
- **Fairlight.** "the scripting API can't create buses" — [CiprianSpiridon README](https://github.com/CiprianSpiridon/davinci-resolve-mcp). flamexnreal's audio analysis "reads source PCM, not the Fairlight mix" — [README](https://github.com/flamexnreal/davinci-resolve-ai-bridge-mcp).
- **Project archive.** `ArchiveProject` "never produces an archive by script: returns `False`… with source media and proxies off; either on crashes Resolve 21.1.0.14" — [api-coverage.md](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/docs/reference/api-coverage.md), [CHANGELOG v4.6.0](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/CHANGELOG.md).
- **Render.**
  - Supported through the API: `GetRenderFormats/Codecs`, `SetCurrentRenderFormatAndCodec`, `SetRenderSettings` (TargetDir, CustomName, `ExportSubtitle`, `SubtitleFormat` = BurnIn/SeparateFile/EmbeddedCaptions), `AddRenderJob`, `StartRendering([job_id])` and `GetRenderJobStatus`.
  - Guidance: start only your own job, and do not wait for completion inside one long MCP call.
  - Source: [api-editing.md](https://github.com/Yasei-no-otoko/codex-skill-davinci-resolve-edit/blob/main/references/api-editing.md).
- **File-level workarounds for API gaps.**
  - samuelgursky's optional Node "advanced" server edits `.drp`, `.drt` and `.drx` files with no Resolve running (18 tools). It includes DRX grade writes for "power windows, qualifiers, HDR zones, HSL curves, ColorSlice", which are "panel-readback-verified" against Studio, and offline `.drt` authoring of "cuts, retimes, transitions, fades, markers, compounds" — [README](https://github.com/samuelgursky/davinci-resolve-mcp).
  - CiprianSpiridon ships a similar set of 18 offline tools — [README](https://github.com/CiprianSpiridon/davinci-resolve-mcp).

### Inferences
- For the target workflow (short Higgsfield clips of 4–15 s put in order on a timeline, then marked, LUT/CDL-matched, given dissolves and fades and rendered), the API surface is **sufficient on Studio 21.1**. Creative colour work beyond LUT/CDL/DRX and precise trimming of clips already on the timeline remain manual, or need computer-use UI automation.
- "Precise trimming" is feasible when **building** a timeline from source ranges (`AppendToTimeline` with start and end frames). It is not feasible when **modifying** an existing edit (no blade, roll or ripple-trim API).
- Many servers' "AI tool" claims (Magic Mask, Smart Reframe, Stabilize) map to TimelineItem API calls that exist but were not independently live-verified in the sources I could read.

### Gaps
- I found **no evidence** that IntelliScript or Super Scale can be driven through the API or through any MCP. How controllable Magic Mask is (tracking, refinement) is also unverified.
- The list of 21.1 API additions comes from review snippets, not Blackmagic's README. The audio transition type names are "not in the stub" ([api-editing.md](https://github.com/Yasei-no-otoko/codex-skill-davinci-resolve-edit/blob/main/references/api-editing.md)).
- OFX/ResolveFX parameter editing on the Edit page (as opposed to the Color page) is not clearly documented either way.

---

## 3. Does MCP control require Resolve Studio or does it work with the free version? Which versions are supported? What has Blackmagic said, and is there a roadmap?

### Takeaway
**In practice, Studio (a one-time ~$295 licence) is required.**
- External scripting has long been Studio-only.
- In **21.1 (2026-09-08)** Blackmagic moved **Python scripting entirely to Studio** and made the **native MCP server Studio-only**. The stated reason: "The Python API was being used to hack studio features into the free version".
- The free-edition MCP servers built on an in-Resolve Python bridge (the ≤21.0.x workaround) stop working on free 21.1.
- The only remaining free route is **Lua menu scripts**, used by saadk408's Lua MCP. Blackmagic does not document that route and could close it.

### Cited Findings
- **Release-note wording:** "We have moved the ability to script in Python to the Studio version." — quoted by [Puget Systems, 2026-09-10](https://www.pugetsystems.com/blog/2026/09/10/how-davinci-resolve-free-v21-1-scripting-changes-affect-puget-bench/) and [xere.my](https://xere.my/journal/davinci-resolve-21-1-free-python-scripting-removed-lua-benchmark/) (snippet).
- **Blackmagic's reason:** "The Python API was being used to hack studio features into the free version. DaVinci Resolve relies on studio license sales to pay for the engineering team." Blackmagic contrasts this with subscriptions "which lock people's work up unless they pay monthly" — [ProVideo Coalition](https://www.provideocoalition.com/davinci-resolve-21-1-is-a-huge-update/) / [CineD](https://www.cined.com/davinci-resolve-21-1-released-ai-assistant-integration-via-mcp-individual-hdr-trims-and-python-scripting-moves-to-studio/) (snippet).
- **Before 21.1:**
  - On free Resolve, "`scriptapp("Resolve")` refuses a foreign process, whatever the preference says". "Through Resolve 21.0.x the Workspace ▸ Scripts menu was not gated — a script launched from it is handed the live `resolve` object (measured on free 21.0.3.7)". That is how samuelgursky's in-app bridge reached the free edition — [samuelgursky README](https://github.com/samuelgursky/davinci-resolve-mcp).
  - "The free edition of DaVinci Resolve cannot be scripted from outside the app (Blackmagic restricted this in v19.1+)" — [mhadifilms/dvr README](https://github.com/mhadifilms/dvr).
- **After 21.1 (free):**
  - "On free 21.1 the Scripts menu no longer lists `.py` files at all (reported on Fedora 44 in #203; a Lua script in the same folder lists normally). Whether the Console still runs Python there is unconfirmed, so treat the bridge as a 21.0.x path" — [samuelgursky README](https://github.com/samuelgursky/davinci-resolve-mcp).
  - "Unavailable on DaVinci Resolve Lite 21.1+ (App Store) — Python menu scripts are blocked; the MCP server cannot start" — [2sem README](https://github.com/2sem/davinci-resolve-lite-mcp).
  - "DaVinci Resolve 21.1 moved Python scripting and the external scripting API to the Studio edition… One door is still open on the free edition: `Workspace > Scripts` lists and runs Lua files". Measured on free build 21.1.0.17. "Blackmagic documents neither this Lua host nor its sandbox, so a point release can change what works" — [saadk408 README](https://github.com/saadk408/davinci-resolve-lua-mcp).
- **Scope of gating (conflicting snippets):**
  - One source: "Workflow Integrations, the native UIManager and external scripting access (driving Resolve from an outside shell or daemon) are Studio only"; "the 20 new APIs plus the built-in console are Studio-only"; "Python 2 is also no longer supported in either edition" — [cutsio Free vs Studio](https://cutsio.com/blog/davinci-resolve-21-1-free-vs-studio) / [CineD](https://www.cined.com/davinci-resolve-21-1-released-ai-assistant-integration-via-mcp-individual-hdr-trims-and-python-scripting-moves-to-studio/) (snippet).
  - Contradicted in part by: "the scripting API remains available from the console in the free edition" — [Digital Production](https://digitalproduction.com/2026/09/08/resolve-21-1-adds-mcp-and-finally-gets-presets/) (snippet).
  - This matches the uncertainty samuelgursky flags about the Console.
- **Knock-on effect:** Puget announced that from 21.1 onward PugetBench no longer supports the free edition, because it "drives Resolve through Python" — [Puget Systems, 2026-09-10](https://www.pugetsystems.com/blog/2026/09/10/how-davinci-resolve-free-v21-1-scripting-changes-affect-puget-bench/) (snippet).
- **Native MCP is Studio-only** — [cutsio](https://cutsio.com/blog/how-to-connect-ai-assistant-davinci-resolve-21-1-mcp) (snippet); [Kompozy](https://kompozy.io/reviews/davinci-resolve-21-1): "The AI control is real but early, and it lives behind the scripting API, which is now Studio-only" (snippet).
- **Price (conflicting figures):** Studio is "$295 one-time, no subscription" — [byteiota](https://byteiota.com/davinci-resolve-21-1-mcp-server/) (snippet); "one-time $295 perpetual license or via Blackmagic Cloud" — [mhadifilms/dvr README](https://github.com/mhadifilms/dvr). A snippet mentions a "$299 perpetual" licence — [ProVideo Coalition](https://www.provideocoalition.com/davinci-resolve-21-1-is-a-huge-update/) (snippet).
- **Compatibility note:** projects created or opened in 21.1 will not open in 20.3, and full backups are recommended before upgrading. This comes from a search summary of 21.1 coverage ([Newsshooter](https://www.newsshooter.com/2026/09/07/blackmagic-design-davinci-resolve-21-1/) / [CG Channel](https://www.cgchannel.com/2026/09/blackmagic-design-releases-resolve-21-1/), snippet; exact source page not verified).
- **Version support per server:**
  - samuelgursky:
    - Resolve 18.5+. Baseline 19.1.3; 20.x additive; 21.0 additions live-tested on Studio 21.0.2.4 — [README](https://github.com/samuelgursky/davinci-resolve-mcp).
    - Contributors live-validated on **Studio 21.1.0.14** — [CHANGELOG](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/CHANGELOG.md).
    - Python 3.10–3.12 is the "lowest-risk range". 3.13/3.14 work on recent builds, but "older builds may fail to connect on 3.13+" — [README](https://github.com/samuelgursky/davinci-resolve-mcp).
  - barckley75: Studio 18.0+ — [README](https://github.com/barckley75/resolve-claude-mcp).
  - hiteshK03: 18+ — [README](https://github.com/hiteshK03/davinci-resolve-mcp).
  - wassermanproductions: "verified on Studio 21" — [README](https://github.com/wassermanproductions/unofficial-davinci-mcp).
  - Native server: 21.1+ — [burn-bench SETUP](https://github.com/RajanthaR/resolve-mcp-burn-bench/blob/main/docs/SETUP.md).
- **Windows setup gotcha:** "DaVinci Resolve locates Python through the Windows registry and loads `python3.dll` by full path… A uv-managed or user-only Python install uses a different DLL" — [hoyt-harness README](https://github.com/hoyt-harness/davinci-mcp-professional).
- **Roadmap:** apart from shipping the native MCP in 21.1 and naming Claude, Claude Code and ChatGPT Codex as supported assistants ([YMCinema](https://ymcinema.com/2026/09/09/davinci-resolve-21-1-chatgpt-claude-ai-assistants/), snippet), I found no Blackmagic roadmap statement about AI agents.

### Inferences
- **For the user's comparison with Adobe:** Resolve's official agent control costs a **one-time** Studio licence of about $295 (vs Adobe subscriptions), and it is a vendor-supported feature in the current release. But the **free Resolve edition is effectively out** for MCP control from 21.1 onward, except through the fragile, undocumented Lua route (saadk408: 15 tools plus `run_lua`, macOS-first).
- Staying on free 21.0.x keeps the Python in-app bridges (samuelgursky, flamexnreal, hiteshK03, EddieRivers) working, but it freezes the Resolve version. Projects opened in 21.1 cannot go back to earlier versions (the 20.3 note above).
- Blackmagic is now treating agent control as a Studio selling point, which suggests continued investment in the native MCP.

### Gaps
- Full Blackmagic release-note text and scripting README not read directly (egress blocked).
- Whether the native MCP works on Linux Studio, and its macOS binary name, are unverified.
- **Higgsfield plugin on free 21.1: conflicting evidence.**
  - Higgsfield's Resolve plugin is opened from **Workspace → Workflow Integrations → Higgsfield**, and the vendor says it works with free Resolve 19+ ([Higgsfield](https://higgsfield.ai/plugins/davinci), snippet).
  - One 21.1 source says Workflow Integrations are Studio-only ([cutsio](https://cutsio.com/blog/davinci-resolve-21-1-free-vs-studio), snippet).
  - The Resolve 18.6 manual already titles the section "Workflow Integrations in DaVinci Resolve (Studio Version Only)" ([manual mirror](https://www.steakunderwater.com/VFXPedia/__man/Resolve18-6/DaVinciResolve18_Manual_files/part4123.htm), snippet).
  - I could not verify which is true for free 21.1.

---

## 4. Real-world reports: does it work reliably, what are the typical failure modes, and what do people actually automate?

### Takeaway
Reports are **early and cautiously positive**. The native server is only about two weeks old. Reviewers describe AI control as "real but early": good as a **supervised assistant editor** (ingest, organise, rough assemblies, markers, batch renders) on throwaway projects, and not faster than a skilled editor for small UI tasks. The recurring failure modes are:
- environment and connection setup
- API calls that fail silently or report false success
- retry loops
- heavy token and usage consumption

A measured native-MCP run used 40 tool calls for a 33-second edit. I found **no substantive Reddit or X discussions** (none surfaced in search).

### Cited Findings
- **Review verdicts (snippets):**
  - "Transcriptions with speaker data plus multicam creation plus auto-align plus render presets is exactly the toolkit you need to say 'build me a rough cut of the interview and render a review copy'… Whether it happens well is a different question, and anyone tempted should run it on a throwaway project before trusting it with anything a client will see" — [Digital Production](https://digitalproduction.com/2026/09/08/resolve-21-1-adds-mcp-and-finally-gets-presets/) / [Kompozy](https://kompozy.io/reviews/davinci-resolve-21-1) (snippet).
  - "The AI control is real but early" — [Kompozy](https://kompozy.io/reviews/davinci-resolve-21-1) (snippet).
  - A vendor of competing screen-recording software argues that native MCP is "the wrong stack" for product demos and tutorials — [ScreenKite](https://www.screenkite.com/en/blog/davinci-resolve-studio-21-1-mcp-not-for-screen-demos) (snippet; potential bias).
- **Hands-on blogs:**
  - "Still rough around the edges… most of the obvious first tasks are faster to do manually — creating a bin, adding a marker, or setting a clip color takes seconds in Resolve's UI" — [WildLion Media](https://wildlion.media/claude-davinci-resolve/) (snippet; date not visible).
  - Claude Code is "most useful as a supervised Resolve operator for project setup, rough assemblies, graphics, supported finishing work and exports"; "seams, silence markers, crops and performance choices still need an editor". A documented **July 2026** run (samuelgursky-style community MCP, before 21.1) imported three clips, created a 29.97 fps timeline, moved a colour-marked clip to a marker and deleted other markers — [implicator.ai](https://www.implicator.ai/claude-code-davinci-resolve-five-editing-tasks/) (snippet).
- **Measured cost and reliability of the native MCP** ([burn-bench RESULTS](https://github.com/RajanthaR/resolve-mcp-burn-bench/blob/main/docs/RESULTS.md), run 2026-09-14 with **Codex**, not Claude, on Resolve Studio 21.1):
  - A 7-phase, **40-tool-call** edit producing a 33-second render used "46% of a 5-hour limit… in 8m39s".
  - The 40 calls were 22 × `run_script`/`run_script_unsafe`, 8 × API discovery, and the rest status, launch and LUT.
  - "Retries were a big multiplier": a launch timeout, two import retries, three assembly retries, transition failures and three bitrate retries.
  - Dissolves "came out one-sided". The render used "Fusion ColorCorrector rather than Color-page primary grades".
  - The author's recommended levers: pre-validated script libraries, caching API notes in AGENTS.md/CLAUDE.md, and batching operations per `run_script`.
- **Documented failure modes (community server, measured):**
  - **macOS Python discovery:** Resolve only looks in `PYTHON3HOME` or `/usr/local/bin/python3`, so Homebrew, pyenv, uv and conda Pythons are "silently" not found. `launchctl setenv` "does not survive a reboot" (#182). The Windows bridge could leave a stale `fuscript.exe` holding the port — [samuelgursky README](https://github.com/samuelgursky/davinci-resolve-mcp).
  - **Headless mode:** on Studio 21.0.4.5, `-nogui` booted "into an instance that never answers `scriptapp('Resolve')`", which also blocks the GUI from starting (#172) — [headless-edit-loop.md](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/docs/guides/headless-edit-loop.md).
  - **Silent timeline-import failures:** `ImportTimelineFromFile` "just returns None" when a timeline name is reused. Resolve uses the sequence name *inside* the file and hands back the existing timeline (#171) — [headless-edit-loop.md](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/docs/guides/headless-edit-loop.md).
  - **Destructive or crashing calls:** `CopyGrades` destroys work while returning True, and `ArchiveProject` crashes 21.1.0.14 — [README](https://github.com/samuelgursky/davinci-resolve-mcp), [api-coverage.md](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/docs/reference/api-coverage.md).
  - **Missing AI Extras packs are reported inconsistently** — [README](https://github.com/samuelgursky/davinci-resolve-mcp).
  - **Bridge timeouts:** "A client timeout stops waiting; it does not confirm cancellation… UI switches during native execution cannot be locked out" — [flamexnreal README](https://github.com/flamexnreal/davinci-resolve-ai-bridge-mcp).
  - **Maintainer warning:** "Use at your own risk… Do not use in production. AI-assisted tools can modify or delete your project data" — [barckley75 README](https://github.com/barckley75/resolve-claude-mcp).
- **Community venues:**
  - A Blackmagic forum thread titled "Using Claude + ChatGPT AI Agent MCP Integration DVR 21.1" exists, but its content was not readable — [Blackmagic Forum t=239881](https://forum.blackmagicdesign.com/viewtopic.php?f=21&t=239881).
  - Japanese hands-on posts: npaka, "AI Assistant Integration in DaVinci Resolve 21.1 — Video Editing via MCP with Codex and Claude Code" ([note.com](https://note.com/npaka/n/nea00a22e4f57?hl=en)), and "I tried having Claude Code perform cut editing in DaVinci Resolve" ([note.com](https://note.com/datsu_zokujin/n/na65f918c7111?hl=en)). Titles only.
  - YouTube demos (titles only):
    - "Claude Can Now Edit Full Videos Using DaVinci Resolve's Official MCP" ([Shorts](https://www.youtube.com/shorts/7cBexZWBfOo))
    - "DaVinci Resolve 21.1 Claude AI Integration: Full MCP Setup & Workflow Tutorial" ([YouTube](https://www.youtube.com/watch?v=EOaTlsWdAJA)), covering rough cuts and audio syncing
    - "How to Configure Claude with Davinci Resolve and Edit Videos with AI" ([YouTube](https://www.youtube.com/watch?v=jE9OAeeeB-Y))
    - "Claude + DaVinci Resolve Changed How I Edit (Full Setup)" ([YouTube](https://www.youtube.com/watch?v=oXKK7l3-DVc))
- **Workflows people build (from repos):**
  - Transcript-driven first-pass assembly, 2-pop/slate sync, multicam prep and metadata publishing — [samuelgursky](https://github.com/samuelgursky/davinci-resolve-mcp).
  - Beat-snapped assembly into FCPXML, colour matching to a reference with a baked `.cube` LUT, and loudness mix plans — [wassermanproductions](https://github.com/wassermanproductions/unofficial-davinci-mcp).
  - A podcast camera auto-switcher using ffmpeg `silencedetect`, rewriting V2/V3 through the Resolve MCP — [andresrondone-tech/autoswitch](https://github.com/andresrondone-tech/autoswitch).
  - An audio-synced multicam timeline builder — [ericabooth/multicam-resolve-build](https://github.com/ericabooth/multicam-resolve-build).
  - "wanted to make claude code tonemap movies for me" — [Andreansx](https://github.com/Andreansx/davinci-resolve-free-mcp-bridge).
  - Blackmagic's own pitch: "create highlight edits, organizing media or batch rendering" — [implicator.ai](https://www.implicator.ai/claude-code-davinci-resolve-five-editing-tasks/) (snippet).
- **Higgsfield-specific context:**
  - Higgsfield ships an official Resolve panel with 7 tools: Generate Video, Generate Image, AI LUT Creator, Draw to Edit, Reframe, Remove Background and Upscale (up to 8K). Results go "directly into the Media Pool or onto the Timeline". It requires Resolve 19+ on macOS or Windows (not the App Store build) and consumes Higgsfield credits.
  - Higgsfield video clips run "between four and fifteen seconds", so the plugin suits B-roll and inserts.
  - Sources: [Higgsfield plugin page](https://higgsfield.ai/plugins/davinci), [Higgsfield blog](https://higgsfield.ai/blog/higgsfield-davinci-resolve), [AlphaSignal](https://alphasignal.ai/news/higgsfield-ai-ships-davinci-resolve-plugin-with-7-built-in-ai-tools) (snippets).

### Inferences
- **For a Higgsfield user:** a realistic Claude + Resolve Studio 21.1 loop looks like this. Generate clips through the Higgsfield panel, or import downloaded clips. Then ask Claude to list them, order them into a timeline by name or prompt, add markers and notes, apply a LUT or CDL, add constant-speed changes, fades and dissolves (21.1), and queue review renders. Final trimming and grading stay manual.
- Because the native server makes Claude write raw Python, **token cost and retries** dominate. A curated server (samuelgursky's compound tools, hoyt-harness's lazy loading) or a CLAUDE.md holding tested snippets should reduce discovery calls. This is an inference; I found no Claude-specific measurement.
- Both reliability and trust depend on verification. The more mature tooling adds read-back checks, dry-runs and confirmation gates, and raw `run_script` has none of these by default.

### Gaps
- **No Reddit (r/davinciresolve, r/ClaudeAI, r/mcp) or X/Twitter threads** surfaced in search, and I could not load reddit.com or x.com. Community sentiment beyond blogs and repos is therefore unassessed.
- No Claude-specific (as opposed to Codex) cost or success-rate measurements for the native server.
- Blackmagic forum troubleshooting content, YouTube demo contents and comments: not read.

---

## 5. Alternatives to a dedicated MCP (Claude Code writing Python, generated EDL/FCPXML/OTIO timelines, ffmpeg pre-processing): power and reliability compared

### Takeaway
There are four routes:
- **(a) Claude Code writing Python directly** against `DaVinciResolveScript`. This has the full power of the API, but it is Studio-only and has no guard rails. It is essentially what the native MCP's `run_script` does.
- **(b) Generating interchange timelines** (FCP7 XML, AAF, FCPXML, OTIO, EDL, DRT), with ffmpeg doing the analysis and normalisation. This works with the **free** edition through a manual import and is NLE-agnostic, but fidelity differs sharply between formats.
- **(c) Offline project-file editing** (`.drp`, `.drt`, `.drx`) without Resolve running.
- **(d) Computer-use UI automation** for gaps the API cannot reach.

Measured results favour **FCP7 XML or AAF** for iterative loops and **DRT** for one-shot full fidelity. OTIO and EDL fail to relink moved media.

### Cited Findings
- **Interchange formats, measured** on Resolve Studio 19.1.3.7 in GUI and `-nogui` sessions on 2026-08-01, with byte-identical results between modes. Source for all bullets: [headless-edit-loop.md](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/docs/guides/headless-edit-loop.md).
  - "**Full fidelity**, media staying put → **DRT**" (the "only format that kept everything: transforms, colours, flags, item and timeline markers").
  - "**Iterative loop** → **FCP7 XML** or AAF" (no media duplication, controllable timeline name).
  - "**Media has MOVED** (real conform) → FCP7 XML, AAF, FCPXML 1.10 — the only three that relink. **DRT, OTIO and EDL all fail**".
  - OTIO imported with `importSourceClips: False` "arrives fully offline".
  - FCPXML 1.10 export writes a *directory* (`.fcpxmld` with `Info.fcpxml`), which breaks naive re-import.
  - DRT ignores `timelineName` and re-imports media on every import.
- `ImportTimelineFromFile` accepts formats including XML, FCPXML, AAF and OTIO, but "curve and transition compatibility differs by format"; test on a short timeline first — [ui-editing.md](https://github.com/Yasei-no-otoko/codex-skill-davinci-resolve-edit/blob/main/references/ui-editing.md).
- **Free-edition interchange tier:**
  - `assemble_edit` validates an edit plan against probed media and snaps cuts to a beat grid.
  - `generate_fcpxml` writes "an FCPXML 1.9 timeline that imports cleanly into Resolve 19/20". `generate_edl` writes a CM3600 cut list. There are also marker, LUT (`.cube`) and premix outputs.
  - "External scripting is a DaVinci Resolve Studio feature… every creative engine still runs, and the interchange writers give you a timeline, LUTs, markers, and a premix".
  - Source: [wassermanproductions README](https://github.com/wassermanproductions/unofficial-davinci-mcp).
- **ffmpeg and other pre-processing:**
  - samuelgursky's optional extras: ffmpeg ("Silence detection, dead-space markers, level measurement… The single most useful thing to install"), numpy (colour pre-balance), librosa (beats), openai-whisper (transcription), open_clip (visual similarity). All are local and "never bundled" — [README](https://github.com/samuelgursky/davinci-resolve-mcp).
  - wassermanproductions does deterministic beat grids, EBU R128 loudness and LUT math "an LLM shouldn't guess at" — [README](https://github.com/wassermanproductions/unofficial-davinci-mcp).
- **Direct Python via Claude Code:** the native server's `run_script` runs sandboxed Python with `resolve` and `project` injected, and `run_script_unsafe` adds filesystem and subprocess access — [burn-bench SETUP](https://github.com/RajanthaR/resolve-mcp-burn-bench/blob/main/docs/SETUP.md). mhadifilms/dvr offers a typed library (`from dvr import Resolve`) and a CLI that "handles the macOS LAN-IP quirk" where "vanilla `scriptapp('Resolve')` returns `None`" (Studio 18.5+) — [dvr README](https://github.com/mhadifilms/dvr).
- **Offline file editing:** samuelgursky's advanced server "reads and edits Resolve files (`.drp`/`.drt`/`.drx`)… with no Resolve running, so it runs cloud or local" — [README](https://github.com/samuelgursky/davinci-resolve-mcp).
- **Lua on free 21.1:** `run_lua` runs any Lua 5.1 chunk inside Resolve with the live `resolve` object. It covers markers, timeline and project switching, and rendering with status polling — [saadk408 README](https://github.com/saadk408/davinci-resolve-lua-mcp).
- **UI automation fallback:** the 21.1 Codex skill uses the computer-use skill for blade/trim, retime curves and SRT placement — [SKILL.md](https://github.com/Yasei-no-otoko/codex-skill-davinci-resolve-edit/blob/main/SKILL.md). barckley75 provides a macOS `screenshot` tool so Claude can "visually inspect what's on screen" — [README](https://github.com/barckley75/resolve-claude-mcp). flamexnreal's `timeline_frame` returns "a native MCP image" — [README](https://github.com/flamexnreal/davinci-resolve-ai-bridge-mcp).
- **A move away from Resolve Free:** the GitHub description of AlexandreRL/claude-video-studio still reads "Automação do DaVinci Resolve (Free) por agente Claude Code — MCP + OpenTimelineIO…". Its README now describes a fully local Claude Code pipeline on **FFmpeg + MLT/Shotcut**, where the timeline "opens in Shotcut for manual adjustment" — [AlexandreRL/claude-video-studio](https://github.com/AlexandreRL/claude-video-studio).

### Inferences
- **Power ranking** (highest to lowest): live MCP or direct Python on Studio 21.1, which reads back state and can grade, render and caption; then offline `.drt`/`.drx` file authoring, powerful but brittle and version-sensitive; then interchange timelines (FCP7 XML/AAF/FCPXML), which carry cuts and simple transforms only; then EDL/OTIO, the weakest for relinking.
- **Reliability ranking** differs. Interchange import is deterministic and inspectable, and it is the most robust option for the **free** edition and for cross-NLE portability (the same FCP7 XML or FCPXML plan could also feed Premiere, which matters for the Adobe comparison). Live MCP gives verification but suffers from silent-failure and retry issues (Q4).
- **For a Higgsfield clip pipeline on free Resolve:** use Claude Code with ffmpeg (probe fps and codec, normalise to a constant frame rate, detect scenes or silence), then generate FCP7 XML or FCPXML 1.9/1.10 plus `.cube` LUTs, then import manually. That is likely the most dependable route. On Studio 21.1, the native MCP or samuelgursky's server can then finish the job live (markers, fades, dissolves, renders).

### Gaps
- No head-to-head reliability data comparing interchange with MCP for AI-generated footage. In particular, whether Higgsfield exports are VFR or have odd frame rates (relevant to the VFR warning in [api-editing.md](https://github.com/Yasei-no-otoko/codex-skill-davinci-resolve-edit/blob/main/references/api-editing.md)) was not researched.
- The interchange measurements were taken on Studio 19.1.3.7. They were not re-run on 21.1.
- I found no source quantifying how well Resolve imports AI-generated FCPXML for transitions and effects beyond the measured basics.
