# Claude + Adobe video tools via MCP (Premiere Pro, After Effects, Firefly, Express, Frame.io): state as of 23 Sep 2026

> **How the sources were read.** Nearly all news, Adobe (blog/news/helpx/developer/community), Reddit, YouTube, Glama, mcp.so and vendor domains were blocked by this environment's egress proxy. GitHub READMEs and issues, anthropic.com and claude.com were **read directly**. Items marked **(snippet)** come from search-engine result summaries of the linked page, not a full read of it. Items marked **(title only)** rest only on the page or video title. Star counts and "last activity" dates come from the GitHub repository search API on 2026-09-23. "Last activity" is GitHub's `updated_at`, which also moves when a repo gets a star.

## 1. Official Adobe MCP servers and Claude connectors, and Adobe's own agentic AI

### Takeaway
Adobe has exactly one official Claude connector for creative work: **"Adobe for creativity"**, launched 28 Apr 2026. It is a hosted remote MCP server at `https://adobe-creativity.adobe.io/mcp` with 50+ (now listed as 67+) tools. It runs Adobe's cloud services (roughly Adobe Express level) on files you upload. It does **not** open or drive the desktop Premiere Pro or After Effects timeline. Adobe's real in-app agents (the Premiere AI Assistant, in beta since 18 Jun 2026, and the After Effects AI Assistant, in beta at IBC in Sep 2026) run only inside the apps and have no MCP interface for Claude. The official Frame.io MCP server is still a private beta.

### Cited Findings
**Anthropic launch and directory listing**
- On 28 Apr 2026 Anthropic launched 9 creative connectors: Ableton, Adobe for creativity, Affinity by Canva, Autodesk Fusion, Blender, Resolume Arena, Resolume Wire, SketchUp and Splice. The Adobe connector "enables users to bring images, videos, and designs to life, drawing from 50+ tools across Creative Cloud apps including Photoshop, Premiere, Express, and more." The post names no specific Premiere Pro desktop or After Effects capability and does not say which Claude plans or surfaces support it. — [Anthropic: Claude for Creative Work](https://www.anthropic.com/news/claude-for-creative-work)
- **Claude directory page.**
  - Publisher: "Adobe Inc.", Anthropic-verified, sign-in required, added April 2026, connector URL `https://adobe-creativity.adobe.io/mcp`, "67+ tools".
  - Example tools: `adobe_mandatory_init`, `animate_design`, `asset_search`, `asset_preview_file`, `asset_license_and_download_stock`, `create_firefly_board`, `change_background_color`, `document_convert_pdf`, `document_merge_data_layout`.
  - Listed capability areas: design templates, PDF management, photo editing (color/lighting, background removal, crop, expand), Creative Cloud asset management, and resizing/cropping images for platforms.
  - The page lists **no explicit video-editing tools** (trim, reframe, captions, Premiere). — [Claude connector page: Adobe for creativity](https://claude.com/connectors/adobe-creativity)
- **Registry query (researcher's own).** I searched Anthropic's MCP registry on 2026-09-23 for "Adobe / Premiere Pro / After Effects / Firefly / Frame.io / Photoshop / Adobe Express / video editing". It returned only one creative Adobe connector ("Adobe": "Design, combine, and edit with Adobe pro tools"; tools such as `adobe_mandatory_init`, `animate_design`, `asset_add_file` "+59 more"). The other Adobe results were enterprise connectors: Adobe Experience Manager, Workfront, Marketing Agent, Journey Optimizer and Customer Journey Analytics. There is **no dedicated Premiere Pro, After Effects, Firefly or Frame.io connector** in the directory. — Anthropic connector registry, queried via the SearchMcpRegistry tool (no public URL; see [claude.com connector page](https://claude.com/connectors/adobe-creativity) for the one Adobe creative listing)

**What the official connector does for video**
- Adobe says it spans Photoshop, Lightroom, Illustrator, Firefly, Premiere, Express, InDesign and Adobe Stock. Example use: upload a horizontal clip and have it reformatted for YouTube Shorts or Instagram Reels. "More tools are available when you sign in, including Gen Expand and video tools." — [Adobe developer: Adobe for Creativity](https://developer.adobe.com/adobe-for-creativity/) (snippet); [Adobe blog, 28 Apr 2026](https://blog.adobe.com/en/publish/2026/04/28/adobe-for-creativity-connector) (snippet)
- Secondary coverage says it can "trim video and create and animate assets". For a horizontal video, it reportedly identifies the subject, calculates a center of interest and reframes to 9:16. — [WeAndTheColor](https://weandthecolor.com/how-does-the-adobe-for-creativity-connector-work-in-claude/210357); [Pasquale Pillitteri](https://pasqualepillitteri.it/en/news/1558/claude-adobe-creative-cloud-50-tools-single-prompt-2026) (snippet; which of the two said which is unclear)
- Photo-oriented coverage lists four core use cases: portrait retouching, generative expand/outpaint, multi-format resizing "with intelligent crop-and-keyframe behaviour", and social media asset design. — [PhotoWorkout](https://www.photoworkout.com/adobe-claude-connector/) (snippet)

**Hands-on limitations (independent testers)**
- **MindStudio:** "The Adobe MCP connector operates at Adobe Express level, not Photoshop or Premiere." In their test it took **3 min 14 s to reframe an image to 9:16, and the subject was not centered**. — [MindStudio](https://www.mindstudio.ai/blog/claude-mcp-adobe-vs-photoshop-premiere-what-it-does) (snippet)
- **Lead Wolf:**
  - A 6.78 GB interview upload froze; the practical upload limit was about 500 MB, so compressed proxies were needed.
  - "Claude does not open Lightroom, does not touch Premiere timelines, does not access local catalogs or custom presets — everything happens in Adobe's cloud on pre-exported files."
  - Only Adobe's built-in presets can be used.
  - It is useful for background removal, format conversion, Reels resizing, quick highlight cuts and speech cleanup, but it is "not a production suite". — [Lead Wolf](https://theleadwolf.com/we-tested-adobe-cloud-claude-ai-so-you-dont-have-to-heres-the-truth/) (snippet)
- YouTube: "Adobe's Claude AI integration is NOT good…" — [YouTube](https://www.youtube.com/watch?v=bncauA2b67E) (title only)
- XDA reports using the connector "without paying for Creative Cloud", which suggests a free Adobe account works for at least part of the toolset. — [XDA](https://www.xda-developers.com/integrated-claude-with-adobe-without-paying-for-creative-cloud/) (title only)

**Adobe on ChatGPT (for comparison)**
- 10 Dec 2025: separate Photoshop, Express and Acrobat apps launched in ChatGPT. — [Adobe News, Dec 2025](https://news.adobe.com/news/2025/12/adobe-photoshop-express-acrobat-chatgpt) (snippet)
- 6 Aug 2026: a single "Adobe for ChatGPT" plugin replaced the three apps. It orchestrates **70+ tools**, including Premiere, Lightroom, Illustrator, InDesign, Stock and Firefly, and TechTimes calls it free. — [Adobe blog, 6 Aug 2026](https://blog.adobe.com/en/publish/2026/08/06/introducing-adobe-chatgpt-create-edit-get-work-done-all-in-chatgpt); [9to5Mac](https://9to5mac.com/2026/08/06/new-adobe-plugin-in-chatgpt-combines-photoshop-firefly-premiere-acrobat-and-more/); [MarketScale](https://www.marketscale.com/industries/software-and-technology/adobes-single-chatgpt-plugin-now-covers-70-creative-tools-from-photoshop-to-premiere); [TechTimes](https://www.techtimes.com/articles/323555/20260807/adobe-launches-free-chatgpt-plugin-routing-photoshop-premiere-automatically.htm) (snippets)

**Adobe's own agents (inside its apps; not exposed to Claude)**
- **Firefly AI Assistant**, powered by Adobe's "creative agent", was unveiled 15 Apr 2026 and entered public beta 27 Apr 2026. It orchestrates multi-step workflows across Firefly, Photoshop, Premiere, Lightroom, Express, Illustrator and more. It requires Creative Cloud Pro or Firefly Pro, Pro Plus or Premium. — [Adobe blog, 15 Apr 2026](https://blog.adobe.com/en/publish/2026/04/15/introducing-firefly-ai-assistant-new-way-create-with-our-creative-agent); [Adobe blog, 27 Apr 2026](https://blog.adobe.com/en/publish/2026/04/27/firefly-ai-assistant-public-beta); [Adobe product page](https://www.adobe.com/products/firefly/features/ai-assistant.html) (snippets)
- **18 Jun 2026:** "AI Assistant" entered public beta across Premiere, Photoshop, Illustrator, InDesign and Frame.io. Adobe also said it is putting its creative agent into third-party platforms: ChatGPT, Claude, Microsoft 365 Copilot, and "soon" Google Gemini and Slack. — [Adobe News, Jun 2026](https://news.adobe.com/news/2026/06/adobe-unveils-major-expansion); [BusinessWire](https://www.businesswire.com/news/home/20260618386522/en/Adobe-Unveils-Major-Expansion-of-Creative-Agent-Across-Firefly-and-Creative-Cloud-Apps-Including-Photoshop-and-Premiere); [VentureBeat](https://venturebeat.com/orchestration/adobe-embeds-agentic-ai-workflows-across-creative-cloud-shifting-from-media-generation-to-production-orchestration) (snippets)
- **Premiere AI Assistant** (panel at Window > Assistant):
  - Organizes media into bins, batch-renames clips, identifies interview questions, adds markers and builds rough assemblies from natural language. "If you can do it in the Project panel or Timeline, AI Assistant can help."
  - The beta focuses on organization and assembly *before* the creative edit. — [Adobe HelpX](https://helpx.adobe.com/premiere/desktop/premiere-ai-assistant/overview.html); [Adobe Community announcement](https://community.adobe.com/announcements-727/meet-your-new-assistant-editor-ai-assistant-in-premiere-pro-is-now-in-public-beta-1629317); [Kyler Holland](https://www.kylerholland.com/blog/premiere-ai-assistant-beta-overview); [Broadcast](https://www.broadcastnow.co.uk/production-and-post/adobe-rolls-out-ai-agent-on-premiere/5217912.article) (snippets)
- **After Effects AI Assistant** entered public beta at IBC in Sep 2026, alongside the AE 26.5 release:
  - It works across the whole project and writes and debugs expressions, building rigs with adjustable sliders.
  - It finds and fixes broken expression links, and summarizes and reorganizes messy projects. — [CG Channel](https://www.cgchannel.com/2026/09/adobe-releases-after-effects-26-5-and-new-ai-assistant-in-beta/); [RedShark](https://www.redsharknews.com/after-effects-ai-assistant-ibc2026); [Adobe Community](https://community.adobe.com/announcements-532/new-in-after-effects-beta-after-effects-ai-assistant-1635658) (snippets)

**Frame.io**
- There is an official, experimental **Frame.io MCP server in private beta**, announced in a Frame.io developer-forum thread. As of 22 Aug 2026:
  - access was still granted privately by DM;
  - the source had been rewritten into a remote Cloudflare Workers server;
  - there was no public endpoint.
  - One summary dates the announcement 29 Jul 2026 (unverified). — [Frame.io forum](https://forum.frame.io/t/introducing-the-frame-io-mcp-server/3466); [mcp.film](https://mcp.film/mcps/frameio/) (snippets)
- Community and iPaaS options can pull transcripts, post frame-accurate comments, list comments and upload attachments from Claude Desktop, Claude Code or Cowork. Merge and Pipedream also offer Frame.io MCP endpoints. — [Glama: aiscalestudio/frameio-mcp](https://glama.ai/mcp/servers/aiscalestudio/frameio-mcp); [Merge](https://www.merge.dev/connectors/frameio); [Pipedream](https://mcp.pipedream.com/app/frame) (snippets)

**Mike Chambers' adb-mcp** (often mistaken for official)
- The README says it is a "proof of concept project" and "not endorsed by nor supported by Adobe." It has 712★ and was created 2025-03-16. — [GitHub mikechambers/adb-mcp](https://github.com/mikechambers/adb-mcp)

### Inferences
- For a Higgsfield user, the official connector suits **cloud-side social reformatting and trimming of single uploaded clips** (for example 16:9 to 9:16), light asset work and Firefly generation. It is **not** a way to have Claude assemble or edit a Premiere sequence or build After Effects comps.
- Adobe's strategy is to keep deep app control inside its own in-app agents (Premiere and AE AI Assistants, Firefly AI Assistant) and to expose a cloud tool layer to third-party chat apps. The ChatGPT plugin (70+ tools, Aug 2026) now appears broader than what the Claude directory lists (67+ tools).
- Anyone who wants Claude to drive the **desktop** Premiere Pro or After Effects today must use community or third-party MCP servers (Section 2).

### Gaps
- I could not read Adobe's own connector blog, FAQ or developer page in full. The exact video tool list, file size and duration limits, and generative credit consumption of the Claude connector are therefore unverified.
- It is unclear which Claude plans (Free, Pro, Max, Team, Enterprise) and surfaces (web, Desktop, mobile, Claude Code) support the Adobe connector; Anthropic's post does not say.
- No evidence was found that the Premiere or AE in-app AI Assistants have any API or MCP interface that Claude could call.
- It is unconfirmed whether the Claude connector received the same 70+ tool expansion as the Aug 2026 ChatGPT plugin.

## 2. Community and third-party MCP servers for Premiere Pro and After Effects

### Takeaway
The ecosystem is large and very young: GitHub search returns 68 "premiere mcp" and 69 "after effects mcp" repositories, most created in 2026. Three projects lead:
- **hetpatel-11/Adobe_Premiere_Pro_MCP** (600★, 283 tools)
- **leancoderkavy/premiere-pro-mcp** (282★, 384+ tools)
- **Dakkshin/after-effects-mcp** (645★)

Almost all production-grade servers run on the legacy **CEP panel + ExtendScript** bridge, which only works locally on macOS or Windows. The notable development for this user: **Higgsfield itself shipped Premiere and After Effects plugins (late May 2026) and an After Effects MCP connector for Claude (14 Jul 2026)**.

### Cited Findings
**Scale**
- GitHub repository search on 2026-09-23 returned 68 results for "premiere mcp" and 69 for "after effects mcp". — [GitHub search: premiere mcp](https://github.com/search?q=premiere+mcp&type=repositories); [GitHub search: after effects mcp](https://github.com/search?q=after+effects+mcp&type=repositories)

**Premiere Pro servers** (★ and last activity as of 2026-09-23)

| Repo | ★ / created / last activity | Architecture | Scope & notable details | Platforms / versions | Source |
|---|---|---|---|---|---|
| hetpatel-11/Adobe_Premiere_Pro_MCP (MIT) | 600★, 118 forks, 19 open issues / 2025-07-07 / 2026-09-23 | Node server generates ExtendScript, writes it to a temp bridge folder; CEP panel polls and runs it via `CSInterface.evalScript()` (QE DOM included). **CEP = production, UXP = experimental** | 283 tools behind `search_tools`/`invoke_tool` (progressive discovery), 13 resources, 10 prompts. Covers ingest, bins, sequences, trimming/ripple, transitions, effects, keyframes, Lumetri/LUTs, MOGRTs/Essential Graphics text, captions, markers, proxies, multicam, AME export (`export_sequence`, `add_to_render_queue`), `auto_reframe_sequence`, scene-edit detection, `capture_frame`. Stated limits below this table. | macOS + Windows; Premiere 2020+, "actively tested on 26.0"; Node 20+. Install: `npm i -g adobe-premiere-pro-mcp` → `premiere-pro-mcp --install-cep` → restart → Window > Extensions > MCP Bridge (CEP) → `verify_premiere_connection`. Unsigned `.mcpb` bundle for Claude Desktop, plus Claude Code and Codex plugins | [GitHub README](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP) |
| leancoderkavy/premiere-pro-mcp (MIT, npm `premiere-pro-mcp`) | 282★, 47 forks / 2026-02-27 / 2026-09-23 | CEP/ExtendScript + QE production bridge; optional UXP preview bridge (Premiere 25.6+) | v1.18.0: **384 core tools** (382 in the default profile), **477 with a UXP connection**. "Verified readback" results distinguish committed-but-unverified edits. Insert edits ripple QE sync-locked tracks. Optional After Effects CEP connector for MOGRT authoring and AE render → Premiere handoff | Windows + macOS, Premiere 2020–2026; Node ≥20.19; ffmpeg; signed `.zxp`; Claude Desktop `.mcpb` | [GitHub README](https://github.com/leancoderkavy/premiere-pro-mcp) |
| ayushozha/AdobePremiereProMCP | 106★, 15 open issues / 2026-03-19 / 2026-09-22 | Go + TypeScript backends → authenticated loopback WebSocket → CEP/ExtendScript | Claims "1,027 tools". Audited caption/transition/effect/graphics routes return explicit `unsupported` errors; README admits some experimental handlers are not audited. Full Windows supervision "not yet" | macOS/Windows; manifest declares Premiere 14.0+ (badge says 2020–2026); needs Go 1.26.1+ | [GitHub README](https://github.com/ayushozha/AdobePremiereProMCP) |
| antipaster/Adobe-Premiere-Pro-MCP | 32★ / 2026-03-05 / 2026-09-04 | Node ↔ WebSocket (port 8097) ↔ CEP ↔ ExtendScript | 170+ tools: project 28, sequence 23, timeline 24, effects/transitions 19, audio 10, export 9, graphics/captions 18, playback/scripting 22 (incl. raw ExtendScript + QE) | Premiere 2023+ (tested on 2026); Windows listed | [GitHub README](https://github.com/antipaster/Adobe-Premiere-Pro-MCP) |
| mikechambers/adb-mcp | 712★, 102 forks / 2025-03-16 / 2026-09-23 | AI ↔ Python MCP server ↔ Node proxy ↔ **UXP** plugin (Premiere, Photoshop, InDesign); CEP for AE/Illustrator | Proof of concept. "The Premiere agent is a bit more limited… due to current limitations of the Premiere plugin API." The plugin must be reloaded in the UXP Developer Tool after every app restart | Mac + Windows; Premiere 25.3+ | [GitHub README](https://github.com/mikechambers/adb-mcp) |
| nepfaff/premiere-pro-mcp | 5★ / 2026-02-09 | UXP plugin `eval()`s arbitrary JS sent via a file bridge | Single `execute-script` tool: the LLM writes Premiere UXP API code on the fly. The UXP Developer Tool must stay open, and the plugin must be reloaded after each restart | macOS (Windows untested); Premiere 25.3.0+ | [GitHub README](https://github.com/nepfaff/premiere-pro-mcp) |
| CaYatur/PremiereProMCP | 3★ / 2026-07-10 | **UXP-first**; optional CEP only for editable MOGRT titles | 277 tools (109 registered by default). Tested end to end on a ~48 s multi-track sequence (transitions, gain, keyframed fades, markers, title, screenshot). Adobe limits it documents are below this table | Windows primary; Premiere 25/26+ | [GitHub README](https://github.com/CaYatur/PremiereProMCP) |
| tro2789/scout-premiere-mcp (Scout, **commercial, $59 one-time**) | 0★ / 2026-09-01 | Scout extension + 266 ExtendScript tools adapted from the MIT adobe-premiere-pro-mcp | 277 tools: transcript search, markers, cuts (`razor_at`), exports; audio-based multicam podcast cutting; auto-registers with Claude Code; `.mcpb` for Claude Desktop | Windows 10/11 only; Premiere 26.2+ | [GitHub README](https://github.com/tro2789/scout-premiere-mcp) |

- **Limits stated by hetpatel-11:**
  - "Premiere 26 has no scripting API to remove effects."
  - Premiere's DOM often cannot read existing caption text.
  - `import_ae_comps` is hidden because a generic `.aep` import "can wedge the CEP bridge".
  - Sequence settings must be verified because Premiere may quantize or reject them.
  - The render-queue status tool only works when Adobe Media Encoder integration is available. — [GitHub README](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP)
- **Adobe limits documented by CaYatur:** the Premiere UXP API has **no method to add an empty track** (verified 2026-07-11). New sequences therefore keep the preset's roughly 3 video + 3–4 audio tracks. — [GitHub README](https://github.com/CaYatur/PremiereProMCP)
- **Smaller or niche Premiere servers:**
  - jordanl61/premiere-pro-mcp-server (14★)
  - stewberticus/adobe-mcp (10★; PS, Premiere, AI, ID)
  - sylphiette269/premiere-mcp-editor-cn (7★; Chinese; rough cuts from documents, reference videos and footage folders)
  - CodeBuffalo0225/claude-ai-mcp-bridge (5★; CEP WebSocket)
  - quadlzzz/premiere-mcp (UXP; verifies cuts with rendered frames)
  - skrfilms/premiere-mcp (fork with "fail-closed verification", 643 tools)
  - MarvelCollin/adobe-premiere-cc-mcp (colour and EBU R128 loudness checks)
  - bis-code/premiere-pro-mcp (archived)
  - Sources: [jordanl61](https://github.com/jordanl61/premiere-pro-mcp-server); [stewberticus](https://github.com/stewberticus/adobe-mcp); [sylphiette269](https://github.com/sylphiette269/premiere-mcp-editor-cn); [CodeBuffalo0225](https://github.com/CodeBuffalo0225/claude-ai-mcp-bridge); [quadlzzz](https://github.com/quadlzzz/premiere-mcp); [skrfilms](https://github.com/skrfilms/premiere-mcp); [MarvelCollin](https://github.com/MarvelCollin/adobe-premiere-cc-mcp)
- **Protocol version:** one leading Premiere server (probably leancoderkavy's) reportedly uses MCP TypeScript SDK v2 and serves the "2026-07-28 stateless protocol over HTTP and stdio", with legacy compatibility back to 2025-11-25. — [leancoderkavy/premiere-pro-mcp](https://github.com/leancoderkavy/premiere-pro-mcp) (snippet; attribution not certain)

**After Effects servers**

| Repo | ★ / created / last activity | Architecture | Scope & notable details | Platforms / versions | Source |
|---|---|---|---|---|---|
| Dakkshin/after-effects-mcp | 645★, 126 forks, 22 open issues / 2025-04-12 / 2026-09-23 | ExtendScript bridge panel (`mcp-bridge-auto.jsx`) polls file-based commands every few seconds | Comps, text/shape/solid/adjustment/camera/null layers, keyframes (position/scale/rotation/opacity…), expressions, batch property edits, masks, blend modes, track mattes | AE 2022+; Node 14+; install: clone → build → `npm run install-bridge` | [GitHub README](https://github.com/Dakkshin/after-effects-mcp) |
| JUNKDOGE-JOE/after-effects-mcp | 72★ / 2026-04-21 / 2026-09-23 | CEP panel hosts a Streamable HTTP MCP endpoint at `127.0.0.1:11488/mcp`; ExtendScript plus a native AEGP plugin (`.aex` / `AeMcpNative.plugin`) | README: 13 public tools incl. `ae_status`, `ae_exec` (arbitrary ExtendScript), `ae_execRecover`; the repo description says 30 `ae.*` tools (inconsistent). "Undo must be executed and verified separately" | macOS + Windows; `claude mcp add --transport http ae http://127.0.0.1:11488/mcp` | [GitHub README](https://github.com/JUNKDOGE-JOE/after-effects-mcp) |
| kumoproductions/mcp-aftereffects (Cumuloworks) | 66★ / 2026-08-08 / 2026-09-21 | TypeScript MCP + ExtendScript via file IPC | Project/comp/layer introspection, atomic undo-grouped operations, JSON project export/import, single-frame rendering for preview, optional arbitrary ExtendScript (warned: it "allows operations outside of After Effects"), permission scoping. Warns that comp/layer names, expressions and footage paths are sent to the AI service | Windows + macOS; AE 2024–2026; Node 24+; needs "Allow Scripts to Write Files and Access Network"; macOS Automation permission | [GitHub README](https://github.com/kumoproductions/mcp-aftereffects) |
| ishu86/after-effects-mcp | 30★ / 2026-02-02 / 2026-09-22 | CEP extension + ExtendScript host | 70+ tools; keyframe easing tools; expression library (20+ presets: wiggle, loop, physics); templates for lower thirds, title cards, transitions | AE 2024+; macOS/Windows | [GitHub README](https://github.com/ishu86/after-effects-mcp) |
| Engine-Room-Games/after-effects-mcp | 22★ / 2026-07-27 / 2026-09-23 | CEP + ExtendScript | 76 tools. `screenshot_frame`/`screenshot_layer` let the model check its own work. `run_batch`: up to 500 ops in one undo step. `export_mogrt` writes Premiere MOGRTs and suppresses modal dialogs. `run_jsx` runs arbitrary ExtendScript | AE 2026; macOS build signed and notarized, Windows unsigned | [GitHub README](https://github.com/Engine-Room-Games/after-effects-mcp) |
| Arman-Luthra/aftr | 21★ / 2026-07-13 / 2026-09-18 | Node controller ↔ WebSocket ↔ CEP panel ↔ ExtendScript; spawns `aerender` | ~100 commands: comps, layers, keyframes with easing, expressions, effects by matchName incl. third-party plugins, masks, text animators, render. An autonomous spec pipeline renders, reviews visually, self-corrects and concatenates. Demo title sequence "built and rendered entirely through aftr" | AE 2024–2026; Node 18+; ffmpeg; Win/macOS; `claude mcp add --transport http aftr http://127.0.0.1:8787/mcp` | [GitHub README](https://github.com/Arman-Luthra/aftr) |
| a-y-ibrahim/after-effects-mcp | 18★ / 2026-07-02 / 2026-09-19 | File bridge + ExtendScript | 57 tools per README (47 per repo description). `see-frame` renders a frame back so the AI can self-correct; contact sheets; `match-reference`; background `aerender`; `execute-script`; one undo group per command; Arabic/RTL support | Windows/macOS; needs "Allow Scripts to Write Files and Access Network" | [GitHub README](https://github.com/a-y-ibrahim/after-effects-mcp) |
| plainly-videos/mcp-server | 6★ / 2025-08-14 | Cloud API (Plainly renders AE templates server-side) | Template-based AE video automation, no local AE control | cloud | [GitHub](https://github.com/plainly-videos/mcp-server) |

**Third-party vendor bridges (commercial)**
- **Higgsfield Adobe plugins.**
  - One installer covers Premiere Pro and After Effects; the panel is at Window → Extensions → Higgsfield AI.
  - Features: generate AI video and images into the timeline, one-click AI **Reframe** (9:16 or 1:1 with subject tracking), background removal, upscaling and "Draw to Edit".
  - Requires Premiere Pro 25.0+ or AE 25.0+ and a live internet connection; inference runs on Higgsfield's servers.
  - Launch post on X dated 2026-05-27. — [Higgsfield plugins page](https://higgsfield.ai/plugins/after-effects); [Higgsfield blog](https://higgsfield.ai/blog/higgsfield-after-effects); [Higgsfield on X](https://x.com/higgsfield/status/2059690191187824681); [No Film School](https://nofilmschool.com/higgsfield-adobe-ai-plugin); [Plugin Play](https://www.pluginplay.app/blog/higgsfield-launches-ai-plugins-for-premiere-pro-after-effects) (snippets)
  - A Japanese user reviewing the Premiere plugin (2026-05-28) confirms the same features plus drag-and-drop of Higgsfield generations onto the timeline. — [@projectmuse_ai on X](https://x.com/projectmuse_ai/status/2060075342715642044) (snippet)
- **Higgsfield After Effects MCP connector for Claude** (announced 14 Jul 2026):
  - Setup: install the Higgsfield Adobe plugin, then add `bridge.higgsfield.ai/mcp` as a connector in Claude.
  - Claude then works in the open AE project: it builds comps, sets keyframes, writes expressions, runs repetitive ExtendScript, recreates designs from references and imports Higgsfield generations.
  - The output "becomes an editable AE scene". — [@omarsar0 on X](https://x.com/omarsar0/status/2077132773031088571); [@DataChaz on X](https://x.com/DataChaz/status/2077101631469236624); [@aakashgupta on X](https://x.com/aakashgupta/status/2077089410945024189); [Higgsfield blog](https://higgsfield.ai/blog/higgsfield-after-effects) (snippets)
  - A YouTube setup guide is titled "How to Connect Claude MCP with Adobe After Effects & Premiere Pro | Higgsfield AI Full Setup Guide". — [YouTube](https://www.youtube.com/watch?v=z22lDHL6O28) (title only)
  - Separately, the **Higgsfield MCP** lets Claude generate with Higgsfield-hosted models (Sora, Veo, Kling), and Higgsfield markets an "Unlimited MCP" plan. — [ClaudeFast](https://claudefa.st/blog/tools/mcp-extensions/higgsfield-mcp); [Higgsfield blog: Unlimited MCP](https://higgsfield.ai/blog/unlimited-mcp) (title/snippet)
- **Jumper:** a commercial local MCP server for Claude and Codex across Premiere Pro, DaVinci Resolve, Final Cut Pro and Avid. It offers visual, transcript and face-based search and exports while media stays local. — [Jumper](https://getjumper.io/ai-agents) (snippet)
- **PremiereCopilot** (commercial vendor blog): "A Premiere Pro extension hands Claude your sequence data, lets it reason about the edit, and applies the result as native timeline operations," undoable with Cmd/Ctrl+Z. — [PremiereCopilot](https://www.premierecopilot.com/en/blog/how-to-use-claude-ai-in-premiere-pro) (snippet; vendor bias)

### Inferences
- **Premiere:** Claude can do real timeline work through hetpatel-11 or leancoderkavy: import Higgsfield clips, build a sequence, trim, add transitions, Lumetri, keyframes, MOGRT titles and an AME export. But these tools wrap an old scripting API. Treat them as power-user and beta tooling, and prefer servers that verify their own edits (leancoderkavy's verified readback, skrfilms, quadlzzz).
- **After Effects:** this is the stronger Adobe target for Claude. ExtendScript exposes almost the whole AE document model, so generating motion graphics, titles, expressions and batch variants works well. Servers that render frames back to the model (Engine Room, a-y-ibrahim, aftr, kumo) close the visual feedback loop.
- **Higgsfield users:** the Higgsfield plugin and AE connector give an Adobe-side path to generate, reframe and upscale inside Premiere and AE, and to let Claude animate in AE with Higgsfield assets. **Nothing equivalent from Higgsfield was found for DaVinci Resolve** (not researched here; the other researcher should check).
- All serious desktop bridges require local installs (Node, CEP debug mode or UXP Developer Tool, sometimes signed ZXPs). None works from claude.ai web alone except Higgsfield's hosted bridge, which still needs the local Adobe plugin.

### Gaps
- I could not fetch Higgsfield's pages. It is unconfirmed whether the Higgsfield MCP bridge also drives **Premiere** (the YouTube title implies it; the X posts only mention AE), which Higgsfield plan it requires, and how many tools it exposes.
- GitHub `pushed_at` and commit cadence were not retrieved (the API was blocked); "last activity" can be inflated by stars.
- No independent benchmark compares the servers' reliability side by side.

## 3. API constraints: Premiere UXP vs ExtendScript/CEP (deprecation) and After Effects scripting

### Takeaway
Premiere moved third-party extensibility to **UXP**: beta from Dec 2024, GA in **Premiere 25.6** (Dec 2025). The UXP API still misses things agents need, such as adding tracks and removing effects, and the undocumented QE DOM (which handles effects, ripple deletes and advanced trims) exists only on the ExtendScript side. Adobe's stated plan was to support **ExtendScript "through September 2026"**, which is now. Most Premiere MCPs are therefore on legacy tech approaching end of support. After Effects has **no UXP panel framework**; CEP + ExtendScript remain fully supported with no announced end date, and give agents near-complete control.

### Cited Findings
- **Scripting guide:** "As of November 2025, Premiere Pro has moved to extensibility based on UXP… ExtendScript-based integrations are still supported, and the plan is for them to remain so, through September 2026." — [Premiere Pro Scripting Guide](https://ppro-scripting.docsforadobe.dev/) (read via its GitHub source: [docsforadobe/premiere-scripting-guide](https://github.com/docsforadobe/premiere-scripting-guide))
- **UXP timeline:** public beta 4 Dec 2024. GA in Adobe Premiere 25.6, with Adobe Marketplace distribution and UXP Developer Tools v2.2.1. Adobe says the UXP APIs are "approaching parity" with CEP/ExtendScript. — [Adobe Developer Blog, Dec 2025](https://blog.developer.adobe.com/en/publish/2025/12/uxp-arrives-in-premiere-a-new-era-for-plugin-development) (snippet); [Adobe Developers on X, 2026-02-11](https://x.com/adobedevs/status/2021692023388983775); [Adobe Developers on X, 2026-04-01](https://x.com/adobedevs/status/2039417843779797088) (snippets)
- **CEP:** plugins still load in Premiere 2026 and current AE. Adobe has promised only a "several years" horizon for CEP retirement and no cut-off date; ExtendScript's September 2026 date is separate. — [Hyper Brew](https://hyperbrew.co/blog/uxp-plugins-in-premiere-2026/); [Filmit.io](https://filmit.io/blog/future-of-adobe-plugins-uxp-cep-ai) (snippets)
- **UXP gaps in practice:**
  - No UXP method to add an empty track (verified 2026-07-11). — [CaYatur/PremiereProMCP](https://github.com/CaYatur/PremiereProMCP)
  - The Premiere agent is limited "due to current limitations of the Premiere plugin API". — [adb-mcp](https://github.com/mikechambers/adb-mcp)
  - "Premiere 26 has no scripting API to remove effects." — [hetpatel-11](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP)
  - CEP stays the production backend because it gives "broad ExtendScript access and the undocumented QE DOM used for effects, ripple deletes, and advanced trims across Premiere Pro 2020–2026". — [leancoderkavy/premiere-pro-mcp](https://github.com/leancoderkavy/premiere-pro-mcp) (snippet)
- **Conflicting evidence on whether CEP still loads in Premiere 2026:**
  - One user issue (6 Jun 2026) says the CEP-based AutoSubs extension "fails to load entirely in Premiere Pro 2026" and blames the UXP migration. — [tmoroney/auto-subs #571](https://github.com/tmoroney/auto-subs/issues/571)
  - This is contradicted by CEP-based MCPs that are tested on Premiere 26.0 and 26.3.0 or require 26.2+ ([hetpatel-11](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP); [issue #46](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP/issues/46); [Scout](https://github.com/tro2789/scout-premiere-mcp)).
  - hetpatel's troubleshooting advice: if the CEP panel does not appear, enable Preferences > **UXP Plugins > Enable developer mode** and restart. — [hetpatel-11 README](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP)
- **After Effects:**
  - As of 19 Apr 2026, UXP panels were "not yet available"; AE has only "scripting-only UXP APIs" in the version matrix (since AE 22.0/UXP 5.5) and no `developer.adobe.com/after-effects/uxp/` documentation.
  - CEP + ExtendScript remain "fully supported in AE", and nothing announces their deprecation. — [pushREC/after-effects-sdk-kb UXP-STATUS-NOTE](https://github.com/pushREC/after-effects-sdk-kb/blob/main/scripting/UXP-STATUS-NOTE.md)
- **What AE scripting reaches (README evidence):**
  - Comps; solid, text, shape, null, camera, light and adjustment layers; any transform or effect property, including nested params and third-party effects by matchName; keyframes with easing; expressions; masks; text animators; parenting.
  - Render queue plus non-blocking `aerender` CLI renders. — [aftr](https://github.com/Arman-Luthra/aftr); [a-y-ibrahim](https://github.com/a-y-ibrahim/after-effects-mcp); [Engine Room Games](https://github.com/Engine-Room-Games/after-effects-mcp)
  - Arbitrary ExtendScript execution (`run_jsx`, `execute-script`, `ae_exec`) covers anything the fixed tools do not. — same sources; [JUNKDOGE-JOE](https://github.com/JUNKDOGE-JOE/after-effects-mcp)
- **Practical AE limits noted by developers:**
  - AE will not keep one undo group beyond a large batch; Engine Room chunks after 500 ops.
  - Modal dialogs block automation (e.g. MOGRT export).
  - An AE bug makes SVGs with a mismatched `viewBox` import as nothing, without an error.
  - Long renders need timeout tuning. — [Engine Room Games README](https://github.com/Engine-Room-Games/after-effects-mcp)
  - Setup needs "Allow Scripts to Write Files and Access Network" and, on macOS, Automation permission. — [kumoproductions](https://github.com/kumoproductions/mcp-aftereffects)
- **Premiere ↔ AE interop through MCP is fragile:** importing a generic `.aep` "can wedge the CEP bridge". — [hetpatel-11](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP)

### Inferences
- **Premiere bridges face an ExtendScript cliff.** Anything built on CEP/ExtendScript (the most capable servers today) could break or lose support in a Premiere release after Sep 2026. UXP-based servers (adb-mcp, nepfaff, CaYatur, the UXP previews in hetpatel and leancoderkavy) are future-proof but currently less capable.
- An agent in **After Effects** can do almost anything a human can express in script (except UI-only operations and some modal flows). That makes AE the most "AI-drivable" Adobe video app for motion graphics.
- Agents currently see the edit mainly through metadata and transcripts. Frame capture or render-back tools are the key to reliable visual decisions.

### Gaps
- I could not confirm whether Adobe extended ExtendScript support beyond September 2026, or whether Premiere 26.5 or the next major version disables it.
- I could not read Adobe's official ExtendScript→UXP migration guide ([developer.adobe.com](https://developer.adobe.com/premiere-pro/uxp/resources/migration-guides/extendscript/)) for a complete list of gaps (e.g. Essential Graphics text editing, transitions, QE equivalents, AME control).
- No public AE UXP beta timeline was found.

## 4. Real-world experience reports (Reddit, X, YouTube, blogs, GitHub issues)

### Takeaway
Public evidence is mostly launch hype on X, vendor blogs and GitHub issues. Reddit threads could not be accessed or surfaced. The consistent picture:
- **After Effects motion-graphics generation** gets the most enthusiasm (Higgsfield connector, Cumuloworks, aftr demos).
- **Premiere automation** works for structured tasks, but tools sometimes report success without making a change, and transcript-driven cuts without visual feedback land imprecisely.
- The **official Adobe connector** draws negative hands-on reviews for anything beyond simple reformatting.

### Cited Findings
**GitHub issues on the most popular Premiere MCP (hetpatel-11)**
- #46 (28 Jun 2026): "trim_clip and batch_add_transitions report success but make no change on Premiere Pro 26.3.0" (closed). — [Issue #46](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP/issues/46)
- #97 (13 Sep 2026, open): "batch_apply_effect ignores its clips list and applies the effect to every clip in the sequence." — [Issue #97](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP/issues/97)
- #99 (13 Sep 2026, open): "Five smaller bridge defects from one session: execute_extendscript, remove_from_timeline, readOnly, apply_effect properties, heartbeat." — [Issue #99](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP/issues/99)
- Other issues, all closed:
  - #64: MOGRT imports but Source Text cannot be replaced in Premiere Pro 2026. — [#64](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP/issues/64)
  - #65: `trim_clip` cannot extend a native Graphic. — [#65](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP/issues/65)
  - #66: a transition applies but the tool returns success:false. — [#66](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP/issues/66)
  - #22: bridge timeout or deadlock when no project is active. — [#22](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP/issues/22)
  - #5/#6 (Feb–Mar 2026): ExtendScript execution failures via CEP. — [#5](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP/issues/5), [#6](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP/issues/6)

**Practitioner and vendor blogs**
- **Selects/Cutback** (a competing video-AI vendor): "Claude only reads the transcript and never sees the frame, so cuts land in wrong places with no way to preview or fix the result." Multicam and motion graphics are "off the table" in that pipeline. Real projects still finish in Premiere, FCP or Resolve, and the AI rough cut is "just the first 40% of the job" (May 2026). — [Cutback/Selects blog](https://cutback.video/blog/claude-for-video-editing-in-2026-what-works-what-breaks-and-the-real-pipeline) (snippet; vendor bias)
- **Heimdex** (a footage-search vendor): at archive scale, vision-based search "cost scales with every search" because frames are analysed per request. — [Heimdex blog](https://blog.heimdex.co/can-claude-premiere-pro-mcp-search-your-footage-what-it-actually-does-at-scale/) (snippet; vendor bias)
- **PremiereCopilot** (vendor): Claude "excels at precise, instruction-following edits like cutting takes and tightening dialogue." — [PremiereCopilot](https://www.premierecopilot.com/en/blog/how-to-use-claude-ai-in-premiere-pro) (snippet; vendor bias)
- **Digital Production, 4 Sep 2026:** "Automation Agent for Premiere: Why I Built an AI Workflow Layer Around the Timeline". — [Digital Production](https://digitalproduction.com/2026/09/04/automation-agent-premiere-timeline-aware-ai-workflows/) (title only)

**X/Twitter**
- 14 Jul 2026, launch posts about Higgsfield's AE connector:
  - "HOLY F*CK YOU CAN NOW USE CLAUDE DIRECTLY INSIDE AFTER EFFECTS… hand off the tedious, syntax-heavy grunt work." — [@DataChaz](https://x.com/DataChaz/status/2077101631469236624)
  - "wiggle locked to one axis", spreadsheet-driven localization, "everything it makes becomes an editable AE scene." — [@omarsar0](https://x.com/omarsar0/status/2077132773031088571)
  - (snippets; promotional tone)
- 11 Aug 2026, Cumuloworks (Japanese), after their Cinema 4D MCP: their AE MCP lets Claude handle "almost all" AE operations colloquially, e.g. "import this Illustrator file and animate the text", "apply these PowerPoint corrections", "blend footage with aerial perspective". — [@cumuloworks](https://x.com/cumuloworks/status/2087169430480732178) (snippet)
- 24 Apr 2026, Japanese user on running AE basics via Claude Code + Adobe-mcp. — [@yama_kiyo](https://x.com/yama_kiyo/status/2047545061584564555) (title/snippet only)
- 19 May 2026, "After Effects x Claude Code Guide" (X article). — [@GuptaSayujya](https://x.com/GuptaSayujya/article/2056631966917894600) (title only)

**YouTube**
- "I Tested Premiere Pro's MCP In Claude". — [YouTube](https://www.youtube.com/watch?v=QSXyT2fJi2E) (title only)
- aftr's demo: a title sequence "built and rendered entirely through aftr. No manual After Effects work." — [aftr README](https://github.com/Arman-Luthra/aftr)

**Official connector reviews:** see Section 1 (MindStudio's 3 min 14 s off-center reframe; Lead Wolf's 500 MB practical upload limit and no Premiere timeline access). — [MindStudio](https://www.mindstudio.ai/blog/claude-mcp-adobe-vs-photoshop-premiere-what-it-does); [Lead Wolf](https://theleadwolf.com/we-tested-adobe-cloud-claude-ai-so-you-dont-have-to-heres-the-truth/) (snippets)

### Inferences
- **What people actually automate:**
  - AE: motion graphics, titles, expressions, templated or localized variants, batch renders.
  - Premiere: rough assemblies from transcripts or clip lists, batch transitions and effects, markers, captions, export queues.
  - Official connector: social reformatting.
- **Reliability is "works with supervision".** Silent no-op successes and over-broad batch operations mean an editor should verify every agent change: undo history, frame capture, `verify_*` tools.
- **For Higgsfield clips** (short, generated shots without dialogue), transcript-driven cutting helps little. Visual verification tools (frame capture or render-back) matter more; the AE servers offer them more consistently than the Premiere servers do.

### Gaps
- Reddit (r/premiere, r/AfterEffects, r/editors, r/ClaudeAI, r/mcp) could not be accessed (egress blocked), and search did not surface relevant threads. **No Reddit evidence is included.**
- YouTube demos could only be identified by title, not watched.
- Independent (non-vendor) long-term reports on reliability with Premiere MCPs remain scarce.

## 5. Adobe's generative AI features relevant to editing AI footage, and whether an agent can trigger them

### Takeaway
Premiere now has substantial built-in generative AI:
- **Generative Extend** (up to 4K UHD);
- a new **Generative Media tool** in Premiere 26.5 (Sep 2026) that generates video with Firefly or partner models (Veo, Kling, Runway, Luma), plus sound effects and soundscapes;
- **Media Intelligence** search;
- in-app AI Assistants.

None of these was found to be triggerable from Claude through MCP. Agents reach Adobe generation only through the cloud connector (Firefly tools), the enterprise-only Firefly Services API, or third-party routes such as Higgsfield's plugin and MCP.

### Cited Findings
- **Premiere 26.5 (Sep 2026, IBC): Generative Media tool.**
  - *Generate Video* fills timeline gaps using reference frames sampled from the project.
  - *Generate Sound Effects* uses Adobe's audio model, with the user's voice able to guide timing.
  - *Generate Soundscape (beta)* analyzes up to 15 s of video.
  - Other 26.5 additions: expanded Generative Extend, smoother Object Masks, Match Source audio. — [Adobe blog, 8 Sep 2026](https://blog.adobe.com/en/publish/2026/09/08/generate-create-directly-in-your-timeline-with-new-ai-powered-innovations-in-premiere-after-effects); [No Film School](https://nofilmschool.com/adobe-generative-media-tool); [Adobe Community: What's new in 26.5](https://community.adobe.com/announcements-727/what-s-new-in-adobe-premiere-26-5-september-2026-1641187); [Kyler Holland](https://www.kylerholland.com/blog/premiere-pro-september-2026-whats-new/) (snippets)
- **Model choice in Premiere:** Adobe Firefly plus partner models including Google Veo, Kling, Runway and Luma. TechTimes calls it "five competing AI video models… killing round-trip export". — [TechTimes](https://www.techtimes.com/articles/327054/20260909/adobe-embeds-five-competing-ai-video-models-premiere-killing-round-trip-export.htm); [No Film School](https://nofilmschool.com/adobe-generative-media-tool) (snippets)
- **Firefly (web)** offers 30+ models (including Nano Banana 2, Veo 3.1, Runway Gen-4.5). Kling 3.0 and Kling 3.0 Omni were added to the Firefly Video Editor (NAB, Apr 2026). — [No Film School, NAB 2026](https://nofilmschool.com/adobe-updates-nab-2026); [Adobe blog, 15 Apr 2026](https://blog.adobe.com/en/publish/2026/04/15/adobe-extends-leadership-video-unleashing-new-ai-powered-creation-firefly-reinventing-color-editors-in-premiere) (snippets)
- **Generative Extend** extends video and audio clips and now supports source media from 360p to 4K UHD, any aspect ratio, and interlaced or non-square-pixel footage. **Media Intelligence** searches terabytes of footage by content. Media Intelligence dates from the April 2025 launch, i.e. older information. — [BusinessWire, Apr 2025](https://www.businesswire.com/news/home/20250402472642/en/New-AI-Innovation-in-Industry-Leading-Adobe-Premiere-Pro-Empowers-Video-Pros-to-Generate-Edit-and-Search-Footage-at-Lightning-Speed); [No Film School](https://nofilmschool.com/adobe-generative-media-tool) (snippets)
- **Agent triggerability:**
  - Premiere's AI Assistant (organize, prep, assemble) and AE's AI Assistant (expressions, project cleanup) run inside the apps. — see Section 1 sources ([HelpX](https://helpx.adobe.com/premiere/desktop/premiere-ai-assistant/overview.html); [CG Channel](https://www.cgchannel.com/2026/09/adobe-releases-after-effects-26-5-and-new-ai-assistant-in-beta/))
  - The Claude connector exposes Firefly-related tools (e.g. `create_firefly_board`) and "Gen Expand". — [Claude connector page](https://claude.com/connectors/adobe-creativity); [Adobe developer page](https://developer.adobe.com/adobe-for-creativity/) (snippet)
- **Firefly Services API:**
  - It has a `generateVideoV3` text-to-video endpoint, MOGRT-based video variations and avatar video.
  - Access requires an **enterprise Firefly Services contract**: no self-service signup, pricing negotiated with Adobe Sales. — [Firefly API reference](https://developer.adobe.com/firefly-services/docs/firefly-api/api/); [Audio/Video API overview](https://developer.adobe.com/audio-video-firefly-services/); [Adobe Community Q&A](https://community.adobe.com/questions-404/does-adobe-firefly-ai-supports-text-to-video-api-calls-1639384) (snippets)
- **Higgsfield inside Adobe:** generate video/images, AI Reframe, background removal, upscale and Draw-to-Edit from a panel in Premiere/AE; inference runs on Higgsfield servers. — [Higgsfield plugins page](https://higgsfield.ai/plugins/after-effects); [Phantom Editor](https://phantomeditor.video/blog/3-tips-higgsfield-plugin-adobe-premiere-pro) (snippets)

### Inferences
- **Useful Adobe features for Higgsfield footage:**
  - Generative Extend: lengthen short 5–10 s AI shots to fit edit timing.
  - Generate Video: fill timeline gaps, with a choice of Veo, Kling, Runway, Luma or Firefly.
  - Object Mask.
  - Generative Soundscape and Sound Effects: add audio to silent AI clips.
- These are **manual, in-app actions**. A Claude-driven MCP workflow in Premiere would have to stop and let the human click them. Since no scripting API for them was found, no MCP server exposes them.
- **Adobe vs. Higgsfield for editing Higgsfield clips:** Adobe's advantage is having these generative tools in the NLE. Higgsfield's own plugin and MCP partly duplicate them (reframe, upscale, generate) and keep the user's Higgsfield credits and models in the loop.

### Gaps
- I found no source confirming whether Generative Extend, the Generative Media tool, Enhance Speech or Media Intelligence are exposed in the Premiere UXP API or ExtendScript. Most likely they are not, but that is unverified.
- Enhance Speech: no 2026-specific source on agent triggerability was found. Lead Wolf's "speech cleanup" via the Claude connector (Section 1) is the only related data point.

## 6. Pricing implications (Creative Cloud plans, generative credits, 2026)

### Takeaway
Driving Premiere or After Effects through community MCPs needs a normal desktop Creative Cloud subscription, and the MCP servers are mostly free (MIT). Commercial add-ons exist: Scout costs $59 one-time; Higgsfield plugins run on Higgsfield credits. Adobe's generative video features (Generative Extend, partner models, Firefly video) are "premium" features that use generative credits. Creative Cloud Pro includes 4,000 per month (2025 figure), which is enough for only about 40 five-second generated videos. Firefly AI Assistant requires CC Pro or a Firefly Pro-tier plan.

### Cited Findings
- **Creative Cloud Pro** (2025 figure; flag as possibly outdated): price rose from $59.99 to **$69.99/month**. The plan includes unlimited "standard" AI and **4,000 generative credits** for premium features, which Adobe equates to about 40 five-second videos a month. Premium features include text-to-4K video, **Generative Extend in Premiere**, and third-party models (OpenAI, Google, Flux…). — [PhotoshopCAFE](https://photoshopcafe.com/generative-credits-to-be-enforced-adobe-cc-plans-change/) (snippet)
- **Partner models** (Google, OpenAI, ElevenLabs, …) are premium features; they are available in Firefly's Generate Video, the Video Editor and Boards, plus Express, Illustrator and Photoshop. — [Adobe HelpX: Partner models](https://helpx.adobe.com/firefly/web/get-started/learn-the-basics/non-adobe-models-in-adobe-products.html) (snippet)
- **Generative Extend credit costs (per second):**

  | Resolution | 30 fps | 24 fps |
  |---|---|---|
  | 4K | 175 | 150 |
  | 1080p | 125 | 100 |
  | 720p | 75 | 50 |

  At 1080p/24, 4,000 credits buy about 40 seconds of extension a month. — [Adobe HelpX: Generative credits access and use](https://helpx.adobe.com/creative-cloud/apps/generative-ai/generative-credits-access-and-use.html); [ONES 2026 credits guide](https://ones.com/blog/ones-solutions/adobe-generative-credits-pricing-2026-cost-breakdown-guide/) (snippets; not checked on the page itself)
- **Firefly AI Assistant** needs Creative Cloud Pro or Firefly Pro, Pro Plus or Premium. — [Adobe product page](https://www.adobe.com/products/firefly/features/ai-assistant.html) (snippet)
- **Firefly Services API:** enterprise contract only, with negotiated pricing. — [Firefly API reference](https://developer.adobe.com/firefly-services/docs/firefly-api/api/) (snippet)
- **Adobe for ChatGPT** is described as free (Aug 2026). The Claude connector appears usable with a free Adobe account for some tools; more tools unlock after sign-in. — [TechTimes](https://www.techtimes.com/articles/323555/20260807/adobe-launches-free-chatgpt-plugin-routing-photoshop-premiere-automatically.htm); [XDA](https://www.xda-developers.com/integrated-claude-with-adobe-without-paying-for-creative-cloud/); [Adobe developer page](https://developer.adobe.com/adobe-for-creativity/) (title/snippets)
- **Community MCP servers:**
  - hetpatel-11, leancoderkavy and antipaster are free/MIT; ayushozha says "No separate MCP subscription". — [hetpatel-11](https://github.com/hetpatel-11/Adobe_Premiere_Pro_MCP); [leancoderkavy](https://github.com/leancoderkavy/premiere-pro-mcp); [ayushozha](https://github.com/ayushozha/AdobePremiereProMCP)
  - Scout is $59 one-time. — [Scout](https://github.com/tro2789/scout-premiere-mcp)
  - Higgsfield plugins run inference on Higgsfield servers (i.e. Higgsfield plan/credits). — [Higgsfield](https://higgsfield.ai/plugins/after-effects) (snippet)

### Inferences
- An Adobe-based Claude workflow costs about CC Pro (~$70/month, or single-app Premiere/AE plans), plus Claude, plus Higgsfield credits.
- Heavy use of Adobe's premium generative video would quickly exhaust the 4,000 monthly credits: Generative Extend at 1080p/24 costs about 100 credits per second. Extra credit packs would then be needed.

### Gaps
- Exact 2026 prices for CC Pro and Standard, single-app Premiere and After Effects, and Firefly plans in Germany (EUR, incl. VAT) could not be verified; Adobe pages were blocked.
- Credit consumption of the Claude "Adobe for creativity" connector and of Premiere 26.5's Generative Media tool per model is unknown.
- Higgsfield plugin and MCP pricing is unverified.
