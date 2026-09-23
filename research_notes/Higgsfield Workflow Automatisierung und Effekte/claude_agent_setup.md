# Setting up Claude (Claude app + connectors, and Claude Code) as an autonomous "video production agent" for a Higgsfield user: frameworks, surfaces, instruction design, QA loops, expectations (state: 23 Sep 2026)

> Method note for the report writer (not a findings section):
> - Research date: 2026-09-23.
> - **Fetched and read in full:** GitHub READMEs and docs, downloaded raw. Repo stats (stars, open issues, created, last push) come from the GitHub search API on the same day. They are a snapshot and measure popularity, not quality.
> - **Fetched directly:** claude.com, code.claude.com, support.claude.com and platform.claude.com.
> - **Snippets only:** almost all vendor and blog sites were egress-blocked (higgsfield.ai, runway.com, elevenlabs.io, heygen, dev.to, mindstudio, invideo, ltx.io, twelvelabs, arxiv, ffmpeg.org, German blogs). Facts from them come from search-result snippets and are marked **[snippet]**.
> - **Scope:** the earlier notes in `research_notes/Higgsfield Workflow Resolve vs Adobe/` already cover the Resolve MCP landscape, Blender MCPs, Higgsfield's API/CLI/plugins and generic MCP maturity. This file goes deeper on agent frameworks, instruction design, gates, budget control, QA loops and the differences between Claude surfaces. It reuses earlier facts only where the blueprint needs them, marked "(via earlier notes)".

## 1. Existing agentic systems and templates: what they automate end-to-end, which effects and editing steps they cover, requirements, costs, maturity and limits

### Takeaway
There are two families of tools.

The first is **full "production OS" frameworks** in which Claude Code itself is the orchestrator:
- **OpenMontage** (≈61k★) is the most complete. It has enforced approval gates, a live storyboard/contact-sheet gate, cost caps and a mandatory post-render self-review.
- **vibeframe** (170★) is small, with strict dry-run and `--max-cost` ceilings.
- Also in this family: digitalsamba's **claude-code-video-toolkit**, Remotion-based kits (**video-shotcraft/-talkcraft**) and the desktop app **Nomi**.

The second is **narrower building blocks** that you compose yourself:
- **Higgsfield's official CLI + skills**: generation on 30+ models, Soul ID, Marketing Studio, a server-side explainer assembler and a "Virality Predictor".
- **Seedance 2.0 Skill OS**: shot contracts, retake discipline, continuation from accepted footage. It does no rendering.
- **film-studio-skills**: pre-production consistency gates, explicitly Higgsfield/Seedance-oriented.
- **Remotion / HyperFrames skills**: code-rendered titles, captions, motion graphics, transitions and audio mixing.
- **kinocut**: guardrailed FFmpeg MCP with provenance receipts.
- **samuelgursky/davinci-resolve-mcp**: live Resolve control plus a measured headless edit loop.

For a Higgsfield user, neither big framework has a current Higgsfield adapter. OpenMontage's adapter is explicitly stale, and vibeframe has none. The practical core is therefore **Higgsfield CLI/MCP + skills**, wrapped in the gate/budget/QA discipline these frameworks demonstrate.

### Cited Findings

#### Maturity snapshot (GitHub search API, 2026-09-23)
| Repo | ★ / forks | Open issues | Created → last push | Licence | One-line role |
|---|---|---|---|---|---|
| calesthio/OpenMontage | 60,979 / 7,754 | 329 | 2026-03-29 → 2026-09-06 | AGPL-3.0 | "agentic video production system. 12 production pipelines, 100+ tools, 700+ agent skill and production-knowledge files" — [repo](https://github.com/calesthio/OpenMontage) |
| heygen-com/hyperframes | 52,521 / 4,793 | 192 | 2026-03-10 → 2026-09-23 | Apache-2.0 | "Write HTML. Render video. Built for agents." — [repo](https://github.com/heygen-com/hyperframes) |
| Vincentwei1021/video-shotcraft | 9,277 / 844 | 7 | 2026-07-19 → 2026-09-09 | Apache-2.0 | Remotion product-video skill — [repo](https://github.com/Vincentwei1021/video-shotcraft) |
| Emily2040/seedance-2.0 | 7,403 / 1,074 | 8 | 2026-02-25 → 2026-09-08 | MIT | Seedance 2.0 prompt/production skill — [repo](https://github.com/Emily2040/seedance-2.0) |
| remotion-dev/skills | 4,697 / 527 | 21 | 2026-01-19 → 2026-09-22 | none stated | official Remotion Agent Skills — [repo](https://github.com/remotion-dev/skills) |
| samuelgursky/davinci-resolve-mcp | 3,085 / 358 | 2 | 2025-03-18 → 2026-09-22 | MIT | Resolve Studio MCP — [repo](https://github.com/samuelgursky/davinci-resolve-mcp) |
| digitalsamba/claude-code-video-toolkit | 2,111 / 365 | 7 | 2025-12-09 → 2026-09-21 | MIT | "AI-native video production toolkit for Claude Code" — [repo](https://github.com/digitalsamba/claude-code-video-toolkit) |
| Vincentwei1021/video-talkcraft | 1,202 / 113 | 1 | 2026-08-22 → (updated 2026-09-23) | n/a | narration-video skill with QA gates — [repo](https://github.com/Vincentwei1021/video-talkcraft) |
| higgsfield-ai/skills | 1,100 / 215 | 3 | 2026-04-09 → 2026-09-14 | MIT | official Higgsfield agent skills v0.12.0 — [repo](https://github.com/higgsfield-ai/skills) |
| higgsfield-ai/cli | 577 / 128 | 60 | 2026-04-29 → 2026-09-18 | MIT | official Higgsfield CLI — [repo](https://github.com/higgsfield-ai/cli) |
| aqm857886159/Nomi | 521 / 114 | 3 | 2026-05-04 → 2026-09-23 | AGPL-3.0 | local-first AI-video desktop workbench, drivable over MCP — [repo](https://github.com/aqm857886159/Nomi) |
| vericontext/vibeframe | 170 / 31 | 0 | 2026-02-01 → 2026-07-26 | MIT | generation CLI+MCP "behind a hard cost cap" — [repo](https://github.com/vericontext/vibeframe) |
| KyaniteLabs/kinocut | 163 / 39 | 13 | 2026-03-21 → 2026-09-19 | Apache-2.0 | "Guardrailed video editing MCP server" — [repo](https://github.com/KyaniteLabs/kinocut) |
| charlesdove977/re-walkthrough-pro | 157 / 39 | 0 | 2026-06-27 → (updated 2026-09-22) | MIT | Claude Code skill: Zillow → Higgsfield → ffmpeg walkthroughs — [repo](https://github.com/charlesdove977/re-walkthrough-pro) |
| machina-exm/film-studio-skills | 139 / 22 | 0 | 2026-08-14 → (updated 2026-09-23) | n/a | 7 pre-production skills, topics `higgsfield`, `seedance` — [repo](https://github.com/machina-exm/film-studio-skills) |
| DojoCodingLabs/remotion-superpowers | 123 / 27 | 10 | 2026-02-09 → **2026-02-11** | MIT | Claude Code plugin with 5 MCP servers. **Stale for 7 months** — [repo](https://github.com/DojoCodingLabs/remotion-superpowers) |
| AlexandreRL/claude-video-studio | 0 / 0 | 0 | 2026-09-16 → 2026-09-16 | MIT | brand-new, Windows-local Claude Code video studio — [repo](https://github.com/AlexandreRL/claude-video-studio) |

#### OpenMontage (calesthio/OpenMontage), read in full: README, AGENT_GUIDE.md, cinematic pipeline manifest, reviewer skill, PROVIDERS.md
- **Architecture:** "There is no code orchestrator. Your AI coding assistant IS the orchestrator." Python supplies tools and persistence. YAML manifests and Markdown "director skills" hold the process. Every pipeline runs `research -> proposal -> script -> scene_plan -> assets -> edit -> compose` — [README](https://github.com/calesthio/OpenMontage).
- **Pipelines:** animated explainer, animation, avatar spokesperson, cinematic, clip factory, documentary montage (real free/open footage, CLIP-indexed), hybrid, localization & dub, podcast repurpose, screen demo and talking head — [README](https://github.com/calesthio/OpenMontage). Stability labels matter. talking-head, clip-factory, podcast-repurpose, character-animation and localization-dub are **beta**: "have not been fully audited… expect rough edges" — [AGENT_GUIDE](https://github.com/calesthio/OpenMontage/blob/main/AGENT_GUIDE.md).
- **Effects and editing steps** — all from the [README](https://github.com/calesthio/OpenMontage):
  - **Remotion:** spring-animated image scenes, stat/chart cards, TikTok-style word-level captions, fade/slide/wipe/flip transitions, TalkingHead.
  - **HyperFrames:** kinetic typography, shader transitions, data charts, grain overlays, rigged SVG character animation.
  - **FFmpeg:** subtitle burn-in, mixing with ducking and fades, LUT colour grading.
  - **Enhancement:** Real-ESRGAN upscaling, rembg background removal, CodeFormer/GFPGAN face restoration.
  - **Analysis:** WhisperX word timestamps, scene detection, frame sampling, CLIP/BLIP-2.
  - **Avatar and lip-sync:** SadTalker/MuseTalk, Wav2Lip, Kling avatar and lip-sync.
  - **Rendering:** a Blender path, e.g. the "OBJECTS IN OVERDRIVE" showcase, "Rendered with Blender Eevee/Cycles and assembled with FFmpeg".
  - **Output profiles:** 16:9, 4K, 9:16, 1:1 and 21:9.
- **Requirements:** Python 3.10+, FFmpeg, Node.js 18+ (HyperFrames needs Node ≥22) and an AI coding assistant ("Claude Code, Cursor, Copilot, Windsurf, or Codex") — [README](https://github.com/calesthio/OpenMontage).
  - All API keys are optional (`FAL_KEY`, `ATLASCLOUD_API_KEY`, `KLING_API_KEY`, `ELEVENLABS_API_KEY`, `RUNWAY_API_KEY`, `HEYGEN_API_KEY`, `ARK_API_KEY` …). A zero-key path uses Piper TTS, open archives and stock.
  - An optional GPU path (`make install-gpu`) runs local WAN 2.1/2.2, Hunyuan, LTX-2 and CogVideo — [README](https://github.com/calesthio/OpenMontage).
- **Governance** — [README](https://github.com/calesthio/OpenMontage); [AGENT_GUIDE](https://github.com/calesthio/OpenMontage/blob/main/AGENT_GUIDE.md):
  - "Human approval gates are enforced, not suggested — proposal, script, scene plan, generated assets, and publish all pause for your sign-off. The checkpoint writer rejects a 'completed' gated stage without recorded approval".
  - Asset generation "pauses on a scene-by-scene contact sheet — takes, prompts, per-asset cost, quality scores" on the local "Backlot" board.
  - Budget: "Per-action approval — pause for confirmation above a threshold (default: $0.50)", "Total budget cap — default $10", and modes `observe`/`warn`/`cap`.
  - Every provider choice is scored on 7 weighted dimensions (task fit 30%, quality 20%, control 15%, reliability 15%, cost 10%, latency 5%, continuity 5%) and logged.
- **Per-pipeline defaults:** the cinematic manifest sets `budget_default_usd: 2.00`, `max_revisions_per_stage: 3`, `max_send_backs: 3` and `max_wall_time_minutes: 12`. It gates `proposal`, a "10-15 second cinematic preview" `sample`, `script`, `scene_plan`, `assets` and `publish` (`human_approval_default: true`), and leaves `research`, `edit` and `compose` ungated — [cinematic.yaml](https://github.com/calesthio/OpenMontage/blob/main/pipeline_defs/cinematic.yaml).
- **Showcase costs** — [README](https://github.com/calesthio/OpenMontage):
  - "THE LAST BANANA": 60 s, 6 Kling v3 clips via fal.ai, Chirp3-HD narration, Remotion. **$1.33** total.
  - "Reimagine Your Universe": 50 s vertical, HyperFrames. **About $4**.
  - "Imagine the Possibilities": source generation **about $5**.
  - Prompt gallery tiers: "~$0.15–$1.50" with one provider, "~$1–$3" with full setup.
- **Higgsfield integration is stale.** It uses `HIGGSFIELD_API_KEY` + `HIGGSFIELD_API_SECRET` from cloud.higgsfield.ai and lists Kling 3.0, Veo 3.1, Sora 2, WAN 2.5 and Soul Cinema. The doc states: "Replicate, HeyGen, and Higgsfield were not updated for these exact model versions because their public API documentation did not expose a current, stable contract" — [PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md).

#### vibeframe (vericontext/vibeframe), read in full: README, docs/projects.md, docs/ai-video-prompting.md
- **What it is:** "a CLI and MCP server for Claude Code, Codex, Cursor, or any bash-capable agent". It turns a brief into a plan, generates assets on **your own keys** (Seedance, Runway, Veo, Kling; images via OpenAI or Gemini) and renders an MP4. "Every paid step sits behind a dry run and a hard `--max-cost` ceiling" — [README](https://github.com/vericontext/vibeframe).
- **Cost-cap refusal:** `vibe build film --dry-run --max-cost 3 --json` returns `COST_CAP_EXCEEDED` ("Estimated cost $10.93 exceeds --max-cost $3.00") and exits 1. It adds `retryWith` cheaper alternatives, "so an agent loop stops instead of guessing" — [README](https://github.com/vericontext/vibeframe).
- **Project format:**
  - `STORYBOARD.md` holds title, duration, aspect, providers, cast and direction. `DESIGN.md` holds palette, type, motion and transitions.
  - `scenes/NN-name.md` holds one scene per file, with frontmatter cues (`duration`, `narration`, `backdrop`, `video`, `voice`, `characters`, `keyframe`).
  - A cue can point to your own footage instead of generating.
  - "Generate the cheap image storyboard first, review it, then animate only the stills you approve" (`--skip-video`, then a per-beat `--beat … --force`).
  - Source: [README](https://github.com/vericontext/vibeframe).
- **Edit and effects commands:** silence-cut, captions, scene detection, highlights remix, audio ducking, and a budgeted `vibe run pipeline.yaml` with `--dry-run`/`--resume` — [README](https://github.com/vericontext/vibeframe).
- **Requirements:** Node.js 20+, FFmpeg and Chrome. The free local half is Kokoro narration, HTML scenes, and headless Chrome + FFmpeg. `vibe init` writes `AGENTS.md` "plus a `CLAUDE.md` that imports it". Claude Desktop users can install a prebuilt `.mcpb` extension. "VibeFrame is not affiliated with HeyGen" — [README](https://github.com/vericontext/vibeframe).
- **No Higgsfield provider.** Per-beat provider overrides are `seedance`/`runway`/`kling`/`veo`/`grok` — [docs/projects.md](https://github.com/vericontext/vibeframe/blob/main/docs/projects.md).

#### Higgsfield official CLI + skills (higgsfield-ai/cli, higgsfield-ai/skills), read in full: README, generate and video-explainer SKILL.md
- **Skills:** 9 skills, v0.12.0: generate, soul-id, product-photoshoot, brandkit, marketplace-cards, websites, video-explainer, youtube-thumbnail and game-generation. Install with `npx skills add higgsfield-ai/skills`, `gh skill install`, or in Claude Code `/plugin marketplace add higgsfield-ai/skills` then `/plugin install higgsfield@higgsfield` — [skills README](https://github.com/higgsfield-ai/skills).
- **Defaults and what the skills can do** — [skills README](https://github.com/higgsfield-ai/skills); [generate SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md):
  - Default models: `gpt_image_2_5`/`nano_banana_2` for images and `seedance_2_5` for video. For image-to-video: "Prefer `seedance_2_0` with `--start-image`; use `kling3_0` as lower-cost fallback".
  - Marketing Studio ad modes: ugc, how-to, unboxing, showcase, review, tv_spot, virtual try-on.
  - "Virality Predictor (`brain_activity`)" returns "score metrics plus an Open report link" for a finished video.
  - Also 3D, audio (`seed_audio`, `sonilo_music`, `mirelo_text_to_audio`) and workflows (reframe, draw_to_video, dubbing, voice-change).
- **Server-side explainer assembly** (the only end-to-end "finished MP4" path inside Higgsfield itself) — [video-explainer SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-video-explainer/SKILL.md):
  - Output: a narrated **non-photoreal** explainer or story of 1–10 minutes, built as ordered **10-second blocks**. Each block has one `seed_audio` voice take and one `gemini_omni` clip, all attached to one style-key image.
  - Assembly: `explainer_video` "centers short voice takes, pitch-safely speeds small overruns, never stretches video… Total duration is exactly `N × 10` seconds".
  - Subtitles "cost 0.05 credit per voiced block".
  - Rules: "Research real topics before scripting", "Write all image/video prompts in English. Only narration uses the selected language", and "Returning loose clips is a failure".
- **MCP ↔ CLI parity.** The same skill maps MCP operations to CLI commands: `get_explainer_presets`, `resolve_explainer_preset`, `generate_image`, `list_voices`, `generate_audio`, `generate_video`, `job_status`, `explainer_video`. So the hosted MCP exposes the same workflow family — [video-explainer SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-video-explainer/SKILL.md).
- **Cost stance of the official skill.** UX rule 5 reads "Don't pre-estimate cost or optimize for cheaper models unless the user asks. Prefer the quality default first." Rule 2 reads "Don't narrate 'calling higgsfield cost'" — [generate SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md).
  - Cost estimation does exist in the CLI: `higgsfield generate` covers "create / cost / wait / get / list jobs", and there is `higgsfield generate cost workflow …`. "`voice-change` and `dubbing` do not support cost estimation". `higgsfield account` shows "credits balance, transactions" — [CLI README](https://github.com/higgsfield-ai/cli).
- **CLI mechanics:**
  - `--wait` blocks and prints the result URL, with `--wait-timeout` defaulting to 10 m. `--json` gives machine-readable output.
  - Timeouts are rejoined with `higgsfield generate wait <id>`: "never duplicate a running job"; "Two identical failures mean the prompt or parameters must change".
  - Sources: [generate SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md); [video-explainer SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-video-explainer/SKILL.md).
  - CLI v1.1.26 was released on 18 Sep 2026 and runs on macOS/Linux/Windows — [npm](https://www.npmjs.com/package/@higgsfield/cli) (via earlier notes).
- **Known limitations:**
  - Auth is interactive OAuth (`higgsfield auth login`), and "tokens are short-lived" — [CLI README](https://github.com/higgsfield-ai/cli).
  - Open issue #47 "Headless / long-lived auth for CI" (opened 2026-07-08). Open issue #56 "auth login succeeds but model list / workflow list / auth token reject the fresh credentials with 'older auth flow'" (2026-08-01). #38/#39 were loopback OAuth failures, now closed — [higgsfield-ai/cli issues](https://github.com/higgsfield-ai/cli/issues).

#### Remotion Agent Skills (remotion-dev/skills), read in full
- **Install and skills:** `npx skills add remotion-dev/skills`, or they are offered in `bun create video`. The skills are `/remotion-best-practices` (umbrella), `/remotion-create`, `/remotion-markup` (compositions, animations, typography, effects, audio, timing), `/remotion-studio` (preview), `/remotion-render`, `/remotion-maps` (Mapbox/MapLibre/CesiumJS flyovers), `/remotion-captions`, `/remotion-saas`, `/remotion-interactivity`, `/remotion-docs`, `/remotion-upgrade` and `/remotion-multimedia` (Mediabunny metadata) — [README](https://github.com/remotion-dev/skills).
- **Licence:** Remotion itself is under a "Source-available Remotion License". HyperFrames, by contrast, is Apache 2.0 — [HyperFrames README comparison table](https://github.com/heygen-com/hyperframes).

#### HyperFrames by HeyGen, read in full
- **Engine:** turns "HTML, CSS, media, and seekable animations into deterministic MP4 videos". It renders by seeking frames in headless Chrome and encoding with FFmpeg ("same input produces the same video"). Requires Node.js 22+ and FFmpeg. Apache 2.0, "no per-render fees" — [README](https://github.com/heygen-com/hyperframes).
- **Skills:** 21 skills; the `/hyperframes` router "confirms every creation brief up front" — [README](https://github.com/heygen-com/hyperframes).
  - Creation workflows: `/product-launch-video` (up to ~3 min, sweet spot 30–90 s), `/faceless-explainer`, `/pr-to-video`, `/embedded-captions` ("footage untouched… embedded climax behind the subject"), `/talking-head-recut` (lower-thirds, callouts, kinetic titles, PiP), `/motion-graphics` (<10 s, "MP4 or transparent overlay"), `/music-to-video` ("beat-synced"), `/slideshow`, `/general-video`, `/remotion-to-hyperframes`.
  - Domain skills: `/hyperframes-audio` ("voiceover carve", EQ, compressor, limiter, gate, saturation, delay, reverb, chorus, phaser, bitcrush, automation, submix buses); `/media-use` (TTS/music/image generation, transcription, captions, background removal, LUT); `/hyperframes-cli` (`lint`, `check`, `snapshot`, `preview`, `render`, HeyGen `cloud render`, AWS Lambda).
  - Catalog blocks, e.g. `flash-through-white` shader transition, `instagram-follow`, `data-chart`.
- **Hosted Claude connector:** "HyperFrames by HeyGen", added June 2026, Anthropic-verified. Tools `compose` and `render_video`; endpoint `https://mcp.heygen.com/mcp/hyperframes`; sign-in required — [claude.com/connectors/hyperframes](https://claude.com/connectors/hyperframes).
  - [snippet] "video generation uses your existing premium credit balance with no additional cost for the integration itself. You need a HeyGen account" — [HeyGen × Claude](https://www.heygen.com/integrations/claude) / [HeyGen help](https://help.heygen.com/en/articles/15001510-hyperframes-x-heygen).

#### Seedance 2.0 Skill OS (Emily2040/seedance-2.0), read in full: README, root SKILL.md, retake-protocol, continuity-qc, delivery-qc
- **What it is:** an agent skill (v6.7.0, MIT) for "planning shots, binding references and continuing from an accepted clip. Your video provider handles generation and its costs." It is **prompt/production craft only**, with no generation or rendering — [README](https://github.com/Emily2040/seedance-2.0).
- **Operating loop** (runs as numbered gates) — [SKILL.md](https://github.com/Emily2040/seedance-2.0/blob/main/SKILL.md):
  - intake → source gate (dated platform facts) → professional gate → **Sequence Gate** (`standalone_clip` vs `sequence_project`) → mode gate (T2V/I2V/V2V/R2V/FLF2V/edit/extend) → capability check.
  - → **reference authority** ("for each target and each controlled dimension, name exactly one winning asset") → multilingual gate → safety/IP gate → Director's Read → prompt build → quality pass → **repair loop** via the retake protocol.
  - A "Fast Lane" writes a compact prompt of ~40–110 words for simple single clips.
- **Professional scope:** "treatment-to-shot-list planning, shot contracts, continuity ledgers, ACES/color handoff, audio post, subtitles/localization, aspect-ratio variants, campaign cutdowns, delivery/QC, and client review packets". For such requests "the skill should not stop at a single prompt. It should return the production object first" — [README](https://github.com/Emily2040/seedance-2.0).
- **Long videos** — [README](https://github.com/Emily2040/seedance-2.0):
  - "A continuation must be based on accepted generated footage because Seedance may not end exactly where the original prompt expected."
  - Tooling includes `extract_last_frame.py`, with a 120-second FFmpeg budget.
- **Honest evidence status:** "Live model scores and rendered-pilot results remain pending." "This skill is for Seedance 2.0. A newer line exists and is out of scope". The numbers are 2.0-specific — [README](https://github.com/Emily2040/seedance-2.0); [SKILL.md](https://github.com/Emily2040/seedance-2.0/blob/main/SKILL.md).

#### samuelgursky/davinci-resolve-mcp (v4.8.17) and its headless-edit-loop guide, read in full
- **Scope:** Resolve Studio control through the official scripting API.
  - 37 "compound" tools (136 guarded actions), or 389 granular ones. A second, optional Node "advanced" server has 18 tools that read and edit `.drp/.drt/.drx` "with no Resolve running". It claims 361/361 API methods covered and 338 live-tested.
  - One setup command, `npx davinci-resolve-mcp setup`, configures Claude Desktop, Claude Code, Cursor, Codex CLI and more.
  - Source: [README](https://github.com/samuelgursky/davinci-resolve-mcp).
- **Editing and effects surface:** timeline editing and conform, markers and review reports, colour (node graph probe, CDL validation, grade copy, DRX/LUT helpers), Fusion (TextPlus overlays, validated connections), Fairlight (voice isolation, audio probes), render-queue validation, multicam prep, 2-pop/slate sync. The offline server adds match-to-reference and skin-line grading, and broadcast-legal QC — [README](https://github.com/samuelgursky/davinci-resolve-mcp).
- **Trust features:**
  - Every tool result carries `_operation.verification`, including a `contradiction` state: "Resolve reported success and the readback disagreed".
  - Execution traces can be exported as audit reports.
  - A "Verified-Trap Guard" refuses `CopyGrades` (which "replaces the target's grade wholesale… returns True while doing it") unless `acknowledge_trap: true` is passed.
  - Source: [README](https://github.com/samuelgursky/davinci-resolve-mcp).
- **Edition caveat:** "Resolve 21.1 moved Python scripting to Studio". The free-edition in-app bridge is "a 21.0.x path" — [README](https://github.com/samuelgursky/davinci-resolve-mcp).
- **Headless edit loop** (measured on Studio 19.1.3.7, GUI and `-nogui`, 2026-08-01) — [headless-edit-loop.md](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/docs/guides/headless-edit-loop.md):
  - "Mode does not matter": results were byte-identical between GUI and `-nogui`.
  - Formats: DRT for full-fidelity one-shot hand-off; **FCP7 XML** (or AAF) for iterative loops; FCP7 XML/AAF/FCPXML 1.10 are the only formats that relink moved media.
  - Loop recipe: `timelineName: f"CUT_v{iteration:03d}"  # MUST be unique per import`, with `importSourceClips: False`.
  - Traps: a reused name makes `ImportTimelineFromFile` return `None` silently; the file's internal sequence name wins; `SaveProject()` on "Untitled Project" "blocks the entire application".
  - Rules: "**Verify structure, not return values.**" "Stability under long renders is not established."

#### Other Claude Code video repos (READMEs read in full unless noted)
- **digitalsamba/claude-code-video-toolkit** — [README](https://github.com/digitalsamba/claude-code-video-toolkit); [CLAUDE.md](https://github.com/digitalsamba/claude-code-video-toolkit/blob/main/CLAUDE.md):
  - Pitch: "Tell Claude Code what video you want — it writes the script, generates the voiceover, music, and visuals, and renders the MP4". It targets explainer-style video with Remotion templates (sprint-review, product-demo, 9:16 concept-explainer-short).
  - Commands: `/setup`, `/video`, `/scene-review` (scene-by-scene review in Remotion Studio), `/design`, `/generate-voiceover`, `/redub`, `/voice-clone`, `/publish` (YouTube).
  - Cloud-GPU tools run on Modal or RunPod: Qwen3-TTS ~$0.01, FLUX.2 ~$0.02, upscale ~$0.01, LTX-2.3 video "~$0.23" per clip, SoulX talking head ~$0.0024/s, dewatermark ~$0.10. Modal's Starter plan gives "$30/month free compute… typical usage is $1-2/month".
  - Example: a "52s vertical short" cost "~$0.80 in generation".
  - Requirements: Node 18+, Claude Code, uv; FFmpeg optional.
  - Per-project `project.json` lifecycle (`planning → assets → review → audio → editing → rendering → complete`). It "generates a `CLAUDE.md` per project for instant context when resuming".
  - The author: "Autonomous video creation is a lofty ideal for such a subjective field… You are the director, editor, and designer."
- **video-shotcraft** — [README](https://github.com/Vincentwei1021/video-shotcraft):
  - Turns "Claude Code or Codex into a motion-design studio" for product promos with Remotion: "real page captures, 2.5D camera moves, beat-synced cuts, and film-grade SFX".
  - The recipe-card count is 152–157 (tagline and repo description differ).
  - 2026-09: a CapCut-style "Motion Workbench" for post-delivery edits; editable JianYing (CapCut CN) project export, "Verified on JianYing Pro 11.2 for macOS".
- **video-talkcraft** (README mostly Chinese) — [README](https://github.com/Vincentwei1021/video-talkcraft):
  - A narration-video skill with word-level voice sync. Local ASR alignment gives a "median 20–40 ms" per-character deviation on a 110 s mixed CN/EN test.
  - 108 motion recipe cards, an "anti-slideshow" camera system, and a **triple acceptance gate**.
  - Also a contact-sheet review tool (details in Q4).
- **kinocut** (formerly mcp-video) — [README](https://github.com/KyaniteLabs/kinocut); [AI_VIDEO_REVIEW_AND_SALVAGE.md](https://github.com/KyaniteLabs/kinocut/blob/master/docs/AI_VIDEO_REVIEW_AND_SALVAGE.md):
  - A local FFmpeg MCP, Python client and `kino` CLI. v1.15.1 (2026-08-31) has "196 MCP / 167 CLI" tools; Apache-2.0; runs on macOS/Linux/Windows with FFmpeg on PATH.
  - Effects: trim, captions, resize/vertical, merge, add_text, normalize audio, and `composite-layers` with blend modes (multiply/screen/overlay/darken/lighten), masks and rotation.
  - A JSON workflow engine (`workflow-validate/plan/render/inspect`) writes "Video Receipts" with per-step input/output hashes and resume cursors.
  - "Governed AI-video review": "There is no force/bypass flag. Analyzer output alone cannot approve."
- **film-studio-skills (Machina)** — [README](https://github.com/machina-exm/film-studio-skills):
  - "7 installable agent skills… script to locked, generation-ready shot prompts", chained as `setup → studio-init → film-breakdown → reference-board → asset-passport → stress-test → shot-prompt`.
  - Two of the stages are gates "that refuse to let inconsistent work through". Pre-production only: it does not call generators. Details in Q3.
- **re-walkthrough-pro** — [README](https://github.com/charlesdove977/re-walkthrough-pro):
  - A Claude Code skill: "Apify pulls the photos, Higgsfield animates each room, ffmpeg stitches the final cut". It needs the **Higgsfield MCP**, the Apify MCP and ffmpeg.
  - Six steps: RESOLVE → PERSIST → CURATE ("vision pass: best photo per room") → ANIMATE (Seedance 2.0 / Kling 3.0 image-to-video with a "room-matched camera move") → STITCH (ffmpeg concat, 16:9 + optional 9:16) → DELIVER.
  - It auto-curates "~6–10 hero rooms" because "The real cost is Higgsfield credits".
  - Honest framing: "not a true 3D / Matterport reconstruction". Contains affiliate links (possible bias).
- **Nomi** — [README](https://github.com/aqm857886159/Nomi):
  - An "open-source, local-first desktop workbench for AI video" (macOS arm64/x64, Windows x64; AGPL-3.0) covering script, storyboard, generation and editing.
  - "24 MCP tools let Codex / Claude Code / Cursor drive Nomi". Any provider, including local ComfyUI; APIMart and Kie.ai are built in, with "66 certified entries".
- **remotion-superpowers** — [README](https://github.com/DojoCodingLabs/remotion-superpowers):
  - A Claude Code plugin with 5 MCP servers (KIE for Suno/ElevenLabs/Veo/Kling, TwelveLabs, Pexels, ElevenLabs, Replicate) and a `/review-video` "render, review, improve, repeat" loop via TwelveLabs.
  - It needs a paid `KIE_API_KEY`. Last push was 2026-02-11 (stale).
- **claude-video-studio** (Portuguese) — [README](https://github.com/AlexandreRL/claude-video-studio):
  - A 100% local Windows studio: FFmpeg, MLT/Shotcut, faster-whisper, DeepFilterNet, MediaPipe, Kokoro, HyperFrames, ACE-Step, and Wan 2.2 in ComfyUI.
  - The agent "monta uma timeline que abre no Shotcut para ajuste manual, confere frames visualmente e renderiza com NVENC" (builds a timeline that opens in Shotcut for manual adjustment, checks frames visually and renders with NVENC). Created 2026-09-16, 0★.
- **calesthio/generative-media-skills** (by the OpenMontage author): "150+ research-backed skills across 25 categories", each with an `EVAL.md`, including "Run deterministic checks — inspect media, captions… loudness, checksums, and QA reports" — [README](https://github.com/calesthio/generative-media-skills).
- **Further repos seen in the GitHub search (not read in full):** SamurAIGPT/Generative-Media-Skills (4,320★, muapi.ai) — [repo](https://github.com/SamurAIGPT/Generative-Media-Skills); Agentchengfeng/chengfeng-videocut-skills (3,008★; a Codex plugin for talking-head cutting — its README says the public runtime v0.4.11 does not meet the newest skill's requirements) — [repo](https://github.com/Agentchengfeng/chengfeng-videocut-skills); bangtutorial/bang-motion (462★) — [repo](https://github.com/bangtutorial/bang-motion); Anil-matcha/vox-ai-motion-graphics-generator (218★) — [repo](https://github.com/Anil-matcha/vox-ai-motion-graphics-generator); SlavaSexton/ComfyUI-Agent-Kit (101★) — [repo](https://github.com/SlavaSexton/ComfyUI-Agent-Kit); banodoco/hivemind (71★; searches the Banodoco Discord for generation best practices) — [repo](https://github.com/banodoco/hivemind).

### Inferences
- **Best fit for a Higgsfield + Resolve Studio 21.1 + Blender user:** don't adopt a whole framework. Compose these pieces:
  - **Generation:** Higgsfield CLI + official skills in Claude Code, or the Higgsfield MCP. This is the only route with current Higgsfield model coverage.
  - **Prompt and shot discipline:** Seedance Skill OS and/or film-studio-skills.
  - **Graphics, captions and titles:** HyperFrames or Remotion skills.
  - **Deterministic FFmpeg work:** kinocut or plain ffmpeg.
  - **Timeline:** Resolve, via the native 21.1 MCP or samuelgursky's server.

  From OpenMontage, copy the *governance ideas* (per-gate approvals, budget thresholds, final self-review), not necessarily the codebase. It is AGPL, has 329 open issues and a stale Higgsfield adapter.
- **vibeframe** has the cleanest cost-cap contract (dry-run → hard ceiling → machine-readable `nextActions`). It lacks Higgsfield support. It is attractive only if the user also holds fal/Runway/Kling keys.
- **What the frameworks automate end-to-end** is mostly *explainer/motion-graphics/stock-montage* video, where code rendering (Remotion/HyperFrames) produces the frames deterministically. **Cinematic, generative-footage work** (the Higgsfield use case) is automated only up to "clips generated and stitched". The creative selection of takes and the final cut remain human (see Q5).
- **Blender** fits as a previs stage (blockout, camera path, playblast → Seedance reference). OpenMontage already has a Blender render path, and Higgsfield sells a Blender add-on + MCP bridge (Aug 2026; via earlier notes).

### Gaps
- OpenMontage's issue tracker could not be listed from this session. Its dominant failure modes (e.g. Windows installs, Remotion render failures) are therefore unknown beyond the 329-open-issues signal.
- No source measured OpenMontage, vibeframe or digitalsamba output quality against a human editor. The showcase costs are author-reported.
- I found no public repo that wires **Higgsfield + Resolve 21.1 native MCP** end-to-end. re-walkthrough-pro stops at ffmpeg stitching.
- Whether video-talkcraft and video-shotcraft (Remotion motion-design skills) can ingest Higgsfield clips as B-roll without breaking their "anti-slideshow" rules was not checked.

---

## 2. What can be done entirely in the Claude app (web, desktop, mobile) with hosted connectors, and what requires Claude Code or another local install on a Mac/PC?

### Takeaway
**Generation and cloud-side assembly can run entirely from the Claude app.**
- Generation: the Higgsfield MCP (a custom connector, OAuth, 30 Apr 2026). The Runway MCP (custom connector, May 2026) also works, as do ElevenLabs (voice/music/SFX), HyperFrames, Descript and Canva connectors.
- Approvals: every tool call can be approved in chat, including from mobile.
- Instructions: they can live in an uploaded custom Skill.

**What the plain chat cannot do**, for a documented reason each:
- **watch video.** Claude has no native video input (Sept 2026).
- **handle media files robustly.** Code-execution file limit is 30 MB, video is not a supported upload type, and the sandbox is ephemeral.
- **drive local apps** like DaVinci Resolve or Blender.

**Three middle tiers need no terminal:**
- **Cowork** (paid plans; runs code and shell in a cloud sandbox, reaches local folders via the desktop app, schedules tasks).
- **Claude Desktop with local MCP servers.** The Resolve Studio 21.1 native MCP, Blender connector and `.mcpb` extensions all attach to the desktop app.
- **Claude Code cloud sessions**, reachable from browser or phone.

**Full autonomy with QA** (ffmpeg frame extraction, contact sheets, rendering, Resolve timeline building, file management) runs best in **Claude Code on the user's Mac/PC**, with approvals from the phone via Remote Control.

### Cited Findings

#### Claude app surfaces and their documented limits
- **Custom connectors (remote MCP):**
  - Available on "Free, Pro, Max, Team, and Enterprise plans"; "Free users are limited to one custom connector".
  - Pro/Max path: "Customize > Connectors," click "+", then "Add custom connector".
  - Works on claude.ai web, Claude Desktop and Cowork. Mobile is mentioned only generally.
  - Warnings: "Only connect to trusted servers", "Be aware of prompt injections", and users should monitor "tool approvals".
  - Source: [Claude Help Center: custom connectors](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).
- **Code execution and file creation:**
  - Available "to all Claude users (Free, Pro, Max, Team, and Enterprise) on the web, Claude Desktop, and Claude Mobile".
  - Network: on Free/Pro/Max, network access "is enabled, allowing Claude to install packages from approved sources"; on Team/Enterprise it is "disabled by default".
  - "The maximum file size is 30MB per file for both uploads and downloads". Documented output types are .xlsx/.pptx/.docx/.pdf; video output is not mentioned.
  - Source: [Help Center: create and edit files](https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude).
  - **Conflict:** the upload article says chat uploads are "500MB per file", "Up to 20 files per chat". It lists no video or audio formats — [Help Center: upload files](https://support.claude.com/en/articles/8241126-upload-files-to-claude).
- **Vision limits** relevant to reviewing frames in the app — [Vision docs](https://platform.claude.com/docs/en/build-with-claude/vision):
  - Max images: "20 per message on claude.ai", 100/600 per API request. Max 8000×8000 px, 10 MB on claude.ai.
  - Newer models: "Claude 4.7 and later models" read images at up to 2576 px on the long edge (4,784 visual tokens).
  - Formats: JPEG/PNG/GIF/WebP. For animations, "only the first frame is used".
- **No native video understanding:**
  - [snippet] A March 2026 feature request for native video analysis in Claude Code was reportedly closed "not planned" — [anthropics/claude-code#32130](https://github.com/anthropics/claude-code/issues/32130).
  - [snippet] "Claude Code didn't get a native video feature, but three plugins shipped in late April that converge on the same recipe - ffmpeg for frames, Whisper for audio" — [Claude Camp](https://claudecamp.ai/blog/claude-code-video-processing).
  - [snippet, vendor with an editing product] "Claude reads transcripts and other text or code passed to it. It does not ingest video frames or audio waveforms natively" — [Selects/cutback](https://cutback.video/blog/claude-for-video-editing-in-2026-what-works-what-breaks-and-the-real-pipeline).
- **Skills in the app** [snippet]:
  - "Skills are available for users on Free, Pro, Max, Team, and Enterprise plans" and require code execution.
  - Custom skills are uploaded in "Customize > Skills" (Team/Enterprise: owner enables "Skills" and code execution).
  - Source: [Help Center: use skills](https://support.claude.com/en/articles/12512180-use-skills-in-claude).
  - Skills enabled on the claude.ai account also load in "Cowork sessions, cloud sessions, terminal sessions with sign-in" — [Claude Code skills docs](https://code.claude.com/docs/en/skills).
- **Cowork (Sept 2026 state)** — [Help Center: get started with Cowork](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork):
  - Plans: "available on paid plans (Pro, Max, Team, Enterprise)". Surfaces: Desktop (macOS/Windows), web, mobile and the Chrome side panel.
  - Execution: "Cowork runs your tasks in the cloud (in beta)". Claude can "Run code and shell commands in an isolated environment on Anthropic's servers" and access local files via the desktop app.
  - Also: connectors and plugins, three permission modes (Manual/Auto/Skip), `/schedule` for tasks that "run in the cloud", and "Multi-step tasks… use more of your usage".
  - **Change over time:** an earlier Cowork description said "The VM is an isolated Linux environment that runs on your machine" [snippet] — [support.claude.com search result](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork). "Folder instructions add project-specific context to Cowork when you select a local folder on desktop" [snippet] — same source.
- **Cowork + ffmpeg in practice** [snippets]:
  - An Anthropic staff post: "Claude Cowork is also super useful for editing files… run ffmpeg based on simple instructions" — [X/Lydia Hallie](https://x.com/lydiahallie/status/2010872290918207626).
  - The Rundown's guide (30 Jan 2026): a Cowork system that reviews a long video plus a timestamped transcript, writes `clip-review.md` and cuts clips into `/clips` — [The Rundown](https://app.therundown.ai/guides/our-claude-cowork-system-for-video-clipping-and-editing).
- **Claude Code cloud sessions** — [Claude Code docs: cloud](https://code.claude.com/docs/en/claude-code-on-the-web):
  - A "research preview for Pro, Max, and Team users" (Enterprise with premium seats). Startable from browser, the mobile **Code** tab or the Desktop app.
  - They run in "an isolated, Anthropic-managed VM", with network access "limited by default". On Pro/Max, API keys added to a cloud environment "stay outside the sandbox".
  - "There is no separate compute charge for the cloud VM", but sessions "share rate limits". Repo cloning and PRs need GitHub.
  - A session "counts as inactive while it waits for you to approve an MCP connector tool call… and it can expire during that wait".
  - Local sessions can be steered "from your phone or browser" with **Remote Control**.
- **Cowork shell tools:** Cowork runs shell commands via `mcp__workspace__bash` — [Claude Code docs: permissions](https://code.claude.com/docs/en/permissions).

#### Hosted connectors relevant to the video pipeline
- **Higgsfield MCP (custom connector, not in Anthropic's directory):**
  - `https://mcp.higgsfield.ai/mcp`, OAuth, launched 30 Apr 2026. Works in Claude web, desktop, mobile and Claude Code with "one shared library and credit pool" — [Higgsfield blog](https://higgsfield.ai/blog/Generate-AI-Videos-From-Claude-with-Higgsfield-MCP) (via earlier notes).
  - Directory check: claude.com/connectors/higgsfield returns HTTP 404, and a connector-registry search found no Higgsfield entry — [claude.com/connectors](https://claude.com/connectors) (checked 2026-09-23).
  - Tools [snippet, launch-era description]: `generate_image`, `generate_video` ("clips up to 15 seconds"), `create_character`, `get_generation_status`, `list_characters`; video jobs "can take 90 seconds or more" — [Higgsfield blog](https://higgsfield.ai/blog/Generate-AI-Videos-From-Claude-with-Higgsfield-MCP); [ClaudeFast](https://claudefa.st/blog/tools/mcp-extensions/higgsfield-mcp). The Sept 2026 skill mapping shows a larger operation set (voices, audio, explainer presets, `explainer_video`) — [video-explainer SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-video-explainer/SKILL.md).
  - Credits [snippet, German guide, Aug 2026]: "MCP, CLI, Canvas, and the Studio surfaces burn credits". Credit prices observed: "$0.075 Basic, $0.05 refill". A 15-second clip limit.
  - Trial warning [snippet]: "an uncancelled 24-hour trial activates a paid Plus plan at $49, with a warning email sent only 6 hours before the charge".
  - Sources: [aireiter.com (DE)](https://aireiter.com/de/blog/higgsfield-mcp-claude-video-generation-setup-guide); [aireiter.com review](https://aireiter.com/blog/higgsfield-ai-reviews-pricing-vs-api). The two pages are not isolated, so exact attribution between them is uncertain.
- **Runway MCP (custom connector)** [snippets] — [AI Weekly](https://aiweekly.co/alerts/runway-opens-mcp-server-for-chatgpt-claude-cursor-replit); [Runway help](https://help.runwayml.com/hc/en-us/articles/51931843164691-Connecting-to-Runway-MCP); [Runway news](https://runway.com/news/company-news/mcp); [mcp.directory](https://mcp.directory/blog/runway-mcp-complete-guide-2026):
  - Hosted server opened on 27 May 2026 at `https://mcp.runwayml.com/mcp`.
  - "No separate API key is required – generations are tied to your existing Runway plan".
  - Models listed (Sept 2026): Gen-4.5, Gen-4 Turbo, Gen-4 Image, Seedance 2.5, Kling 3.0, Veo 3.1, GPT Image 2 and Nano Banana Pro, "routed by plan".
  - This corrects the earlier notes, which found no Runway video connector. That remains true for the *directory*, not for custom connectors.
- **ElevenLabs** [snippets]:
  - Hosted MCP at `https://api.elevenlabs.io/v1/mcp`, OAuth. It generates "voice, music, sound effects, images, and video… over 50 models". Outputs land in the ElevenCreative workspace. Installable "from the Claude connectors directory".
  - Sources: [ElevenLabs MCP page](https://elevenlabs.io/mcp); [ElevenLabs blog](https://elevenlabs.io/blog/introducing-voice-music-image-and-video-generation-in-the-elevenlabs-mcp); [changelog Aug 2026](https://elevenlabs.io/docs/changelog/2026/8/22).
  - **Conflict:** on 2026-09-23 the Claude registry entry still reads "Manage your ElevenAgents voice agents in your chat" and lists agent tools (79+) — [claude.com/connectors/elevenlabs](https://claude.com/connectors/elevenlabs).
- **Descript** (directory, May 2026, Anthropic-verified):
  - "Import, edit, or create video with prompts". Tools: `import_media`, `prompt_project_agent`, `get_job`, `list_jobs`, `cancel_job`. Endpoint `https://api.descript.com/v2/mcp/claude` — [claude.com/connectors/descript](https://claude.com/connectors/descript).
  - [snippet] "Imports and Underlord edits through MCP use your media minutes and AI credits". Underlord can remove filler words, add Studio Sound, caption, clip, translate/dub and build rough cuts — [Descript help](https://help.descript.com/hc/en-us/articles/45008080343053-Connect-Descript-to-Claude); [Underlord help](https://help.descript.com/hc/en-us/articles/36803785502221-Underlord-beta-Your-AI-co-editor-in-Descript).
- **Canva** (directory): "Search, create, autofill, and export Canva designs", 17 tools — [Claude connector registry](https://claude.com/connectors/canva). [snippet] Exports include "PNG, JPG, PDF, PPTX, MP4"; resizing needs Canva Pro+ — [Canva help](https://www.canva.com/help/mcp-agent-setup/); [AIToolsReview](https://aitoolsreview.co.uk/insights/canva-claude-connector).
- **HyperFrames:** `compose` + `render_video`, HeyGen credits (see Q1).
- **Blender** (directory, April 2026, Blender Lab) is a **local/desktop** connector: "requires Blender to be running locally with the necessary add-on installed" — [claude.com/connectors/blender](https://claude.com/connectors/blender).
- **DaVinci Resolve:** no directory page (claude.com/connectors/davinci-resolve → 404).
  - Resolve **Studio** 21.1 (8 Sep 2026) ships a local stdio MCP (`ResolveMCP.exe`), wired to "Claude, Claude Code and ChatGPT Codex… through File > Setup AI Assistants". The free edition lacks it — [YMCinema](https://ymcinema.com/2026/09/09/davinci-resolve-21-1-chatgpt-claude-ai-assistants/); [burn-bench SETUP](https://github.com/RajanthaR/resolve-mcp-burn-bench/blob/main/docs/SETUP.md) (via earlier notes).
  - The Higgsfield **Resolve panel** (Generate/Edit/Reframe/Upscale/LUT into the Media Pool) is a manual UI that Claude cannot operate (via earlier notes, [Higgsfield Resolve plugin](https://higgsfield.ai/plugins/davinci)).
- **Local-only building blocks (need Claude Desktop with local MCP, or Claude Code):**
  - Resolve native MCP or samuelgursky's server; the Blender connector/add-on.
  - vibeframe's `.mcpb`; kinocut; local ffmpeg/Remotion/HyperFrames rendering.
  - OpenMontage and the digitalsamba toolkit (terminal-based by design).
  - Sources: [vibeframe README](https://github.com/vericontext/vibeframe); [kinocut README](https://github.com/KyaniteLabs/kinocut); [samuelgursky README](https://github.com/samuelgursky/davinci-resolve-mcp).
- **German practitioner comparison** [snippet]: three ways to bring generation into Claude Code:
  - "Replicate MCP" (no subscription, pay per generation, "Ein Bild kostet oft weniger als 0,10 $").
  - "Higgsfield CLI" ("über 50 KI-Modelle… Setup unter 10 Minuten").
  - "Claude Code Video Toolkit" ("günstigste Option bei häufiger Nutzung, braucht aber mehr Einrichtungsaufwand").
  - Example: one Claude Code skill produces weekly 1080×1920 event reels for traube.club "vollautomatisch" (fully automatically).
  - Source: [wolfgegenlicht.de](https://www.wolfgegenlicht.de/ki-videos-erstellen-claude-code/). Other German guides: [jonaskeil.com](https://jonaskeil.com/blog/higgsfield-mit-claude-verbinden/), [schwarzwald-anker.de](https://schwarzwald-anker.de/lernen/ki-video-effekte-claude-higgsfield/) (content not accessible).

### Inferences
- **Capability matrix** (my synthesis from the findings above):

| Task | Claude app chat (+connectors, no installs) | Cowork (no terminal) | Claude Code cloud session | Claude Code / Desktop local on Mac/PC |
|---|---|---|---|---|
| Brief, treatment, shot list, prompts | ✅ (custom Skill with SOP) | ✅ (+ folder instructions) | ✅ | ✅ (CLAUDE.md + skills) |
| Higgsfield generation | ✅ MCP; approve each call | ✅ MCP | ⚠️ MCP connector likely usable; CLI auth is headless-unfriendly (#47) | ✅ MCP or CLI (`--wait --json`) |
| Download clips to disk, name/version them | ❌ (URLs only) | ✅ (cloud sandbox + local folder) | ✅ (cloud disk, then git/artifact) | ✅ |
| Frame extraction / contact sheets / ffmpeg QA | ⚠️ only via code-exec sandbox (30 MB limit, ffmpeg undocumented) or user-uploaded stills | ✅ (shell) | ✅ | ✅ |
| Titles/captions/motion graphics | ✅ HyperFrames connector (HeyGen credits); Canva MP4 | ✅ | ✅ (render CPU) | ✅ (HyperFrames/Remotion) |
| Voice/music/SFX | ✅ ElevenLabs connector; Higgsfield `seed_audio` | ✅ | ✅ | ✅ |
| Text-based editing, captions, rough cut | ✅ Descript connector (media minutes) | ✅ | ✅ | ✅ |
| DaVinci Resolve timeline/grade/render | ❌ | ❌ (cloud) / ⚠️ desktop | ❌ | ✅ (Studio 21.1 native MCP or samuelgursky) |
| Blender previs | ❌ | ❌ | ❌ | ✅ (Blender connector / Higgsfield bridge) |

- **Blueprint tiers:**
  1. **App-only (quick start, mobile-friendly).**
     - Setup: Claude Pro/Max; Higgsfield custom connector; ElevenLabs, HyperFrames, Descript and Canva connectors; one uploaded "Video-Produktion SOP" Skill.
     - Gates: keep Higgsfield generation tools on per-call approval.
     - QA: the human watches the clips; Claude reviews only stills or contact sheets the user uploads (≤20 images per message).
     - Final assembly: Descript, HyperFrames, or the user's NLE.
  2. **Cowork tier (no terminal).** As tier 1, plus a local project folder with folder instructions. Claude can run ffmpeg in the sandbox for contact sheets and simple concatenation, plus scheduled batch jobs. This is the least-effort way to get self-review.
  3. **Full agent tier (recommended for "Claude does the work, I approve").**
     - Claude Code on the Mac/PC, with Higgsfield CLI + skills and the Higgsfield MCP, and HyperFrames/Remotion skills.
     - ffmpeg + kinocut; Seedance and film-studio skills.
     - Resolve Studio 21.1 native MCP (plus samuelgursky's server for verified/guarded operations); the Blender connector.
     - Approvals from the phone via Remote Control.
     - Cloud sessions are useful for rendering HyperFrames/Remotion or QA without the local machine. They are not useful for Resolve or Blender.
- **Higgsfield "Unlimited" plans do not help agents.** MCP, CLI and plugin generations all burn credits (German guide; earlier notes on plugins). Budget caps must be expressed in credits. Automating the web UI to use "Unlimited" would likely raise ToS questions; this was not verified.

### Gaps
- Whether a claude.ai custom connector (Higgsfield) is automatically available inside Claude Code *cloud* sessions and Cowork *cloud* runs was not documented in fetched sources.
- Whether the claude.ai code-execution sandbox ships ffmpeg (or allows `pip install imageio-ffmpeg`), and its per-session time limit, are undocumented. The two Anthropic help pages disagree on upload size (500 MB vs 30 MB).
- Whether Higgsfield MCP result URLs expire, and whether the MCP returns image content Claude can *see* (vs URLs), remain unknown (also flagged in earlier notes).
- Mobile support for *custom* connectors is only "mentioned generally" in the help article.

---

## 3. How to structure the instructions (brief → treatment → shot list → approval gate → generation → review → edit), CLAUDE.md patterns, per-model prompt templates, budget caps, asset naming and versioning

### Takeaway
The successful systems converge on **stage artifacts with written approval gates**:
- one canonical file per stage (brief/proposal, script, scene plan or shot cards, asset manifest, edit decisions, render report);
- a hard rule that the agent **stops and ends its turn** at each gate;
- "approval is per-gate";
- **cheap-before-expensive** ordering: stills/keyframes and a 10–15 s sample before batch video;
- **budget as numbers** (per-action threshold, total cap, attempt caps per shot);
- **append-only logs** (decision log, generation log with one changed variable per attempt);
- **immutable, versioned files** ("a new version is a new file"; only `selects/` feeds the edit).

Claude Code provides enforcement primitives that make these rules hard rather than advisory:
- permission `ask`/`deny` rules on specific MCP tools;
- `PreToolUse` hooks that can deny or ask with a reason;
- skills with `disable-model-invocation: true`, so only the human can trigger a paid "shoot";
- restricted reviewer subagents.

### Cited Findings

#### Stage chains used by real systems
- **OpenMontage** — [README](https://github.com/calesthio/OpenMontage); [AGENT_GUIDE](https://github.com/calesthio/OpenMontage/blob/main/AGENT_GUIDE.md):
  - Stages and artifacts: `idea/brief → script → scene_plan → asset_manifest → edit_decisions → render_report`, "Each stage produces one canonical artifact that becomes the contract for the next stage".
  - Planning protocol before execution: "4-5 concept directions… Recommended pipeline… Cost estimate… Music plan… Approval gate before asset generation".
  - Gate behaviour: "write the checkpoint as `awaiting_human`… then **END YOUR TURN**. Doing further pipeline work in the same response is a gate violation".
  - "**Approval is per-gate.** An early 'go ahead' never covers later gates".
- **OpenMontage decision contract** — [AGENT_GUIDE](https://github.com/calesthio/OpenMontage/blob/main/AGENT_GUIDE.md):
  - "Before any paid or consequential generation call, state: the exact tool name, the provider, the model… the reason… whether it is a sample or a batch run".
  - "Ask Before Major Changes" (provider/model switch, "switching from video-led to still-led", "changing from sample mode to batch mode"); "No Unilateral Substitutions".
  - Blockers are escalated in 5 parts: what was attempted / what failed / auth-vs-tool-vs-prompt / options / recommendation.
  - `decision_log` is "append-only history, not a scratchpad".
- **film-studio-skills** — [README](https://github.com/machina-exm/film-studio-skills):
  - Chain: `setup → studio-init → film-breakdown → reference-board → asset-passport → stress-test → shot-prompt`.
  - Four rules: "Lock assets first · one asset, one passport · surgical one-line edits · log everything".
  - Shot cards have "22 fields… across three lanes (identity, direction, camera + edit)". In-frame text goes "onto its own task list… because video models write text badly and titles belong to the edit". "One action per clip, never a sequence."
  - The **stress-test gate** uses "cheap static images" across angles and lighting: "Characters need 10 out of 10 repeatability… Generation for a scene starts only when every registry row it touches reads locked."
  - `/shot-prompt` "refuses to write a generation-ready prompt while any of those assets is still draft", writes "15 blocks in the same fixed order (no negative prompt…)" and keeps "one line changed per attempt, every attempt logged with its verdict".
- **vibeframe** — [README](https://github.com/vericontext/vibeframe); [docs/projects.md](https://github.com/vericontext/vibeframe/blob/main/docs/projects.md):
  - Flow: `vibe init` (brief → STORYBOARD/DESIGN/scenes) → `build --dry-run --max-cost` → build → render → `inspect render`.
  - The outer loop "should stop only when the final MP4 path exists, duration and aspect ratio match the brief, render inspection has no errors, any AI review score meets the review threshold… and unresolved `fixOwner:"host-agent"` issues are fixed, accepted with rationale, or reported as blocked".
- **digitalsamba** — [CLAUDE.md](https://github.com/digitalsamba/claude-code-video-toolkit/blob/main/CLAUDE.md):
  - Flow: `/video → Script → Assets → Scene Review → Design → Audio → Preview → Render → Publish`.
  - Timing rules sit in CLAUDE.md: "Voiceover drives timing", "~150 words/minute", "Target duration × 2.5 = word budget", and "TTS engines do NOT consistently produce 150 WPM… ElevenLabs tends to compress pauses… A 50s script may produce 40-45s of audio". It fixes this with `sync_timing.py --apply` after TTS.
- **Higgsfield video-explainer** — [SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-video-explainer/SKILL.md):
  - "Collect choices in two separate turns… Never merge them." Style first, then duration/language/character/aspect/subtitles. "Every choice belongs to the user unless they explicitly delegate it."
  - Hard ordering: all voice takes, then all clips, then assembly, with checkpoints ("require… exactly `N` narration lines and prompts, one selected voice, and `N` completed audio jobs").
- **Seedance Skill OS** — [SKILL.md](https://github.com/Emily2040/seedance-2.0/blob/main/SKILL.md):
  - An explicit **authority order** for conflicts: "Safety… Verified limits… The user's explicit must-haves… Reference contracts… Continuity… Physical causality… Camera and editorial logic… Style… This skill's own defaults".
  - Sequence projects must fix "story objective, final story outcome, ordered major beats… clip budget… current clip completed endpoint" before Clip 01.
  - "Accepted observed state overrides planned state."
- **HyperFrames router:** it is "the intent layer that confirms every creation brief up front" — [README](https://github.com/heygen-com/hyperframes).
- **Seedance "Agent Trust Boundary":** "Prompt writing does not authorize a paid generation… Before executing one, establish the user's authorized provider, assets, action and spending limit" — [SKILL.md](https://github.com/Emily2040/seedance-2.0/blob/main/SKILL.md).

#### Budget caps and cost authorization, as written in real files
- **OpenMontage:** estimate → reserve → reconcile; modes observe/warn/cap; default per-action approval above $0.50 and a $10 total cap — [README](https://github.com/calesthio/OpenMontage).
- **vibeframe:** `--dry-run` "prices the whole build without calling a provider or needing a single key"; a hard `--max-cost`; `retryWith` cheaper paths — [README](https://github.com/vericontext/vibeframe).
- **Seedance retake protocol:** "Track each take and currency cap against its own authorization baseline. 'One more take' after Take 3 grants one additional attempt… Never default to five Standard takes or ten Fast drafts. A cost example is not a spending allowance." An uncertain timeout "is not permission to submit a duplicate" — [retake-protocol.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/retake-protocol.md).
- **film-studio-skills:** "A shot that hasn't landed by attempt 15 needs a simpler shot, not better words" — [README](https://github.com/machina-exm/film-studio-skills).
- **Higgsfield's official skill works against budget gating by default** ("Don't pre-estimate cost… Prefer the quality default first"). A user CLAUDE.md must override it explicitly. Estimation exists (`higgsfield generate cost …`, `higgsfield account`) — [generate SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md); [CLI README](https://github.com/higgsfield-ai/cli).

#### Claude Code enforcement primitives (official docs)
- **Permissions** — [permissions docs](https://code.claude.com/docs/en/permissions):
  - "Rules are evaluated in order: deny, then ask, then allow."
  - MCP patterns: `mcp__puppeteer` (whole server), `mcp__puppeteer__*`, `mcp__puppeteer__puppeteer_navigate` (single tool).
  - "Hook decisions don't bypass permission rules… a matching ask rule still prompts even when the hook returned 'allow'".
  - Parameter-level MCP rules are **not** possible in settings: "it skips any `mcp__` rule that has parentheses".
  - An org-level claude.ai connector tool set to `ask` "prompts on every call, even in auto and bypassPermissions".
- **Hooks** — [hooks docs](https://code.claude.com/docs/en/hooks):
  - `PreToolUse` can block (exit code 2), or return `permissionDecision` `"allow" | "deny" | "ask"` with a reason and `additionalContext`.
  - Matchers take regex over `mcp__<server>__<tool>` names (e.g. `mcp__.*__write.*`).
  - Hooks can live in `.claude/settings.json`, `~/.claude/settings.json`, plugins, or skill/agent frontmatter.
- **Skills** — [skills docs](https://code.claude.com/docs/en/skills):
  - `disable-model-invocation: true` means "Only you can invoke it with `/name`… Prevents running when a scheduled task fires". Other fields: `allowed-tools` (pre-approved during that turn), `disallowed-tools`, `context: fork` + `agent` (run in an isolated subagent), `model`, `effort`, `hooks`, and `paths`.
  - Guidance: "Keep `SKILL.md` under 500 lines". Descriptions are truncated at 1,536 characters. After compaction, skills are re-attached "keeping the first 5,000 tokens of each… combined budget of 25,000 tokens".
  - `skillOverrides` in settings can force "user-invocable-only" on third-party skills.
- **Subagents** — [sub-agents docs](https://code.claude.com/docs/en/sub-agents):
  - "Each subagent runs in its own context window with a custom system prompt, specific tool access, and independent permissions".
  - Frontmatter: `tools`, `disallowedTools`, `model`, `permissionMode`, `skills`, `hooks`, `maxTurns`, `mcpServers`, `isolation: worktree`.
  - A read-only reviewer is defined by listing only read tools.

#### Per-model prompt templates found (copyable)
- **Image model** (GPT Image 2 / Nano Banana Pro) order: `[purpose/context] → [scene/background] → [subject/character] → [key details…] → [style/medium] → [quality cues…] → [constraints: keep / exclude]`. Template A is a character turnaround sheet (front/side/back + 4 expressions + palette); Template B edits the sheet into scene keyframes — [vibeframe ai-video-prompting.md](https://github.com/vericontext/vibeframe/blob/main/docs/ai-video-prompting.md).
- **Seedance 2.0 video** — [vibeframe ai-video-prompting.md](https://github.com/vericontext/vibeframe/blob/main/docs/ai-video-prompting.md):
  - "6-step formula (60–100 words): [Subject], [Action: specific verb + intensity], in [Environment + lighting], camera [ONE movement], style [specific reference], avoid [unwanted effects]".
  - "The 8 camera moves (pick exactly ONE)… Multiple conflicting camera instructions = jitter."
  - Image-to-video: "Describe **motion only** - do not redescribe the still… Avoid jitter, bent limbs, temporal flicker, identity drift."
  - Per-scene prompt = 6 blocks (identity block verbatim, scene, action, camera, continuity statement, negative). "Repair only weak scenes, one variable at a time."
- **Higgsfield official prompt rules:** for image-to-video "motion only"; Seedance 2.x and Kling 3.0 accept start and end frames — [media-inputs.md / prompt-engineering.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/prompt-engineering.md) (via earlier notes).
- **Higgsfield explainer block template:** `STYLE REFERENCE: Match the attached reference image EXACTLY… SCENE… MOTION… AUDIO: <ambient SFX or music only; no voice…> NEGATIVE…` — [video-explainer SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-video-explainer/SKILL.md).
- **Seedance fast lane:** "Keep the single-clip prompt compact (about 40-110 words)… keep director language (blocking, directorial voice, shot contracts) inside the internal brief" — [SKILL.md](https://github.com/Emily2040/seedance-2.0/blob/main/SKILL.md).

#### Asset naming, folders and versioning conventions
- **film-studio-skills folders:** `assets/` (passports), `prompts/` (shot cards), `generations/` (raw attempts), `selects/` (accepted takes). Laws: "Only `selects/` is visible to the edit · nobody but the prompt engineer enters `generations/` · a reference file is never renamed — a new version is a new file." State variants get separate tags (`@cal`, `@cal_wet`, `@cal_blood`) — [README](https://github.com/machina-exm/film-studio-skills).
- **OpenMontage:** `projects/<kebab-case-title>/{artifacts, assets/{images,video,audio,music}, renders/final.mp4}`. "Always pass an explicit `output_path` under `projects/<project-id>/`"; superseded checkpoints are archived to `history/` — [AGENT_GUIDE](https://github.com/calesthio/OpenMontage/blob/main/AGENT_GUIDE.md).
- **Seedance delivery naming:** `PROJECT_CAMPAIGN_VERSION_RATIO_LANG_DATE_STATUS`, e.g. `LUMA_BOTTLE_HERO_15S_9x16_TEXTLESS_2026-05-30_REVIEW01`. Delivery metadata to keep: "job ID, model/surface, prompt version, seed/settings if available, source URLs, approval owner" — [delivery-qc.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/delivery-qc.md).
- **re-walkthrough-pro:** `scenes/room-01-exterior.mp4…`, `final/walkthrough-16x9.mp4` + `-9x16`, and a `PROPERTY.md` with the shot list — [README](https://github.com/charlesdove977/re-walkthrough-pro).
- **Resolve loop:** unique timeline versions `CUT_v001…`, plus bumping the XML's internal `<sequence><name>` each iteration — [headless-edit-loop.md](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/docs/guides/headless-edit-loop.md).
- **kinocut** receipts record `spec_hash`, per-step input/output SHA-256 and a resume cursor — [README](https://github.com/KyaniteLabs/kinocut).

### Inferences
**Proposed project layout for this user** (synthesis; the names are suggestions):
```
<projekt>/
  CLAUDE.md                 # imports @docs/SOP.md; short rules below
  00_brief/brief.md         # goal, audience, length, aspect, deadline, budget (credits + €)
  01_treatment/treatment.md # 2–3 concepts → chosen one (GATE 1)
  02_bible/                 # style bible, character passports (Soul ID ref ids), locations, LUT refs
  03_shots/shotlist.md      # table; one file per shot: S010.md … (22-field card style)
  04_keyframes/S010_kf_v01.png …           # cheap stills (GATE 3: contact sheet)
  05_generations/S010_seedance25_1080p_t01.mp4 …  # raw, never edited, never renamed
  06_selects/S010_t03.mp4   # only accepted takes (GATE 4)
  07_qa/S010_t03_sheet.png, qa_log.md
  08_audio/  09_graphics/ (HyperFrames/Remotion)  10_edit/CUT_v001.xml …
  11_deliver/<PROJECT>_<VERSION>_<RATIO>_<LANG>_<DATE>_<STATUS>.mp4
  logs/decisions.md, logs/generation_log.csv (shot, take, model, params, credits, verdict, reason)
```

**CLAUDE.md skeleton.** Keep it short and put procedures in skills; the skills doc advises conciseness. The user can write it in German, but model prompts should stay English, following Higgsfield's own rule.
```
# Rolle
Du bist Produktionsassistent (Producer + Editor-Assistent). Der Mensch ist Regisseur und hat das letzte Wort.
# Phasen & Gates (jede Gate-Phase endet mit STOP – Zug beenden, auf Freigabe warten; Freigabe gilt nur für diese Phase)
1 Brief → 2 Treatment (2–3 Konzepte) [GATE] → 3 Bible/Passports [GATE] → 4 Shotlist [GATE]
→ 5 Keyframes (Standbilder, günstig) + Kontaktbogen [GATE] → 6 Sample (1 Shot, 1 Take) [GATE]
→ 7 Batch-Generierung innerhalb Budget → 8 QA (automatisch) → 9 Selects-Review [GATE]
→ 10 Schnitt/Resolve-Timeline CUT_vNNN [GATE] → 11 Finish/Export [GATE]
# Budget (überschreibt Higgsfield-Skill-Regel "don't pre-estimate cost")
- Vor jedem Generierungsjob: Kosten mit `higgsfield generate cost …` schätzen, in logs/generation_log.csv eintragen.
- Einzeljob > 40 Credits oder Projekt > <X> Credits → vorher fragen. Max. 3 Takes pro Shot ohne Rückfrage; nie Modell/Auflösung wechseln ohne Freigabe.
# Generierung
- Immer I2V aus freigegebenem Keyframe (Seedance 2.x / Kling 3.0 Fallback); Prompts englisch, nur Bewegung beschreiben, genau 1 Kamerabewegung.
- Gesichter: Soul-ID reference_id; Charakter-Passport wörtlich übernehmen.
# QA
- Nach jedem Clip: ffprobe-Specs, Kontaktbogen 4×3, Prüfliste (Identität, Kleidung, Produktform, Hände, Text, Komposition vs. Shotkarte, Anschluss an letztes Frame). Urteil: Keep / Fix in Post / Re-roll / Rewrite / Stop.
- Nie behaupten, ein Video "gesehen" zu haben – nur Frames/Metriken.
# Dateien
- 05_generations ist unveränderlich; neue Version = neue Datei; nur 06_selects geht in den Schnitt.
# Menschliche Entscheidungen (nie selbst entscheiden)
Konzeptwahl, Take-Auswahl bei Gleichstand, finaler Schnitt/Rhythmus, Farblook, Musik, Veröffentlichung.
```

**Enforcement sketch** (`.claude/settings.json`; the tool names are placeholders, so check the real names with `/mcp`):
```json
{
  "permissions": {
    "ask":  ["mcp__higgsfield__generate_video", "mcp__higgsfield__generate_image",
             "Bash(higgsfield generate create *)", "Bash(higgsfield generate workflow *)"],
    "deny": ["Bash(higgsfield auth *)"]
  },
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [ { "type": "command", "if": "Bash(higgsfield generate create *)",
        "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/budget_gate.sh" } ] }
    ]
  }
}
```
The hook script would estimate the job's cost and compare the running ledger with the cap. It returns `deny` with `additionalContext` when over the cap, or `ask` when above the per-job threshold. Settings cannot match MCP parameters, so any resolution- or duration-aware logic must live in a hook (for CLI calls) or in CLAUDE.md (for MCP calls).

**Skills to write:**
- `/shoot` with `disable-model-invocation: true`, so paid batch generation is always human-triggered.
- `/qa` with `context: fork` and a read-only reviewer agent. The agent gets `Read`, `Bash` limited to ffmpeg/ffprobe, and `Glob`, runs on a cheaper model, and returns a JSON verdict.
- `/resolve-handoff`, which exports FCP7 XML or builds via MCP, using unique `CUT_vNNN` names and verified item counts.

This mirrors OpenMontage and vibeframe governance with native Claude Code primitives.

**App-only equivalent:** put the same SOP into an uploaded custom Skill or Cowork folder instructions. In the app, rely on per-call tool approval, since hooks and settings are Claude Code features.

### Gaps
- There is no published CLAUDE.md for a *Higgsfield-centred* cinematic pipeline. The closest are film-studio-skills (pre-production), re-walkthrough-pro (single-purpose) and Higgsfield's own skills, which lean the opposite way on cost.
- The exact Higgsfield MCP tool names as seen in Claude Code (`mcp__higgsfield__…`) were not verified, so the permission rules above are placeholders.
- `higgsfield generate cost` syntax for single models (vs `cost workflow`) is only implied by the CLI README's command table.

---

## 4. Self-review / QA loops: can Claude inspect generated videos (frames → contact sheet → vision), detect artifacts or inconsistencies, and regenerate automatically?

### Takeaway
**Partly.**
- **What works in shipping systems today:** Claude inspects *frames*, not video. The recipe is ffmpeg sampling → images, often tiled into contact sheets and read in a separate subagent context, combined with **deterministic machine checks** (ffprobe specs, black/frozen frames, silence and clipping, caption presence, promise violations) and **structural readback** in NLEs.
- **Self-correction:** it works when failures are rule-based. OpenMontage blocks presentation on a failed self-review, and vibeframe auto-runs `safeToAutoRun` fixes.
- **Auto-regeneration** is feasible within an explicit attempt/credit budget. The best practice is a Seedance-style verdict taxonomy (keep / fix in post / edit / re-roll / rewrite / stop) with one variable changed per retake.
- **Hard limit:** research in 2026 shows multimodal LLMs are weak at fine-grained and *temporal* artifact detection (Artifact-Bench: many of 19 models near random in hard settings). Claude's docs say it "cannot determine whether an image is AI-generated". Frame-based review therefore catches gross errors (wrong subject or composition, identity or wardrobe drift, broken text, black frames). It is unreliable for morphing, flicker and subtle physics, which still need a human watching at normal speed.

### Cited Findings

#### Implemented self-review loops
- **OpenMontage post-render self-review** — [README](https://github.com/calesthio/OpenMontage); [reviewer.md](https://github.com/calesthio/OpenMontage/blob/main/skills/meta/reviewer.md):
  - "after every render, the runtime runs ffprobe validation, extracts frames at 4 positions to check for black frames and broken overlays, analyzes audio levels for silence and clipping, verifies the delivery promise was honored, and checks subtitle presence. If the review fails, the video is not presented."
  - Required `final_review` checks: `technical_probe`, `visual_spotcheck` with "`frames_sampled >= 4`", `audio_spotcheck`, `promise_preservation` (catches "silent downgrade from motion-led to still-led") and `subtitle_check`.
  - Reviewer rules: "Maximum two review rounds." Critiques must be "Accurate… Complete… Constructive" (citing a CMU/Harvard "CHAI" study).
  - Slideshow-risk scoring on 6 dimensions.
- **vibeframe inspect/repair loop** — [README](https://github.com/vericontext/vibeframe); [docs/projects.md](https://github.com/vericontext/vibeframe/blob/main/docs/projects.md):
  - `vibe inspect render --cheap --json` returns pre-classified `nextActions`: "run `safeToAutoRun:true` automatically, ask before `requiresConfirmation:true`".
  - `fixOwner` is `"vibe"` (deterministic repair) or `"host-agent"` (edit the sources). Repairs go through `vibe scene repair`.
- **samuelgursky Resolve MCP visual analysis via the host chat** — [README](https://github.com/samuelgursky/davinci-resolve-mcp):
  - `analyze_media` "requests host-chat visual analysis via the `host_chat_paths` protocol (analyze returns absolute frame paths + a JSON schema; the host chat reads each frame as an image and calls `media_analysis(action="commit_vision", ...)` to finalize)".
  - "Skipping `commit_vision`… surfaced as a failure mode, not silently downgraded".
  - The results envelope separates "unverified" from "checked": "A report for a run where nothing was verified says 'not established — no checks recorded'".
- **video-talkcraft contact sheets + triple acceptance** — [README](https://github.com/Vincentwei1021/video-talkcraft) (Chinese; translated):
  - `scripts/contact_sheet.py` tiles QA frames "into a 3×4 grid for the review subagent".
  - Measured on a 201 s vertical video: reviewing 160 QA frames dropped from "≈16万 token / 21 min" (≈160k tokens) to "≈4万 token / 7 min" (≈40k) with contact sheets.
  - Acceptance is triple:
    - machine picture-health checks: "静止段 + 并发光栅抖动，时域缺陷机器抓" (static segments + raster jitter; temporal defects caught by machine);
    - per-cue SFX energy verification;
    - independent review with anchor frames and contact sheets.
  - Policy: after machine gates pass, run one independent review round, fix P0/P1, deliver, then ask whether to continue ("累计封顶 3 轮", capped at 3 rounds).
- **fabriqaai/ffmpeg-analyse-video-skill** (30★) — [repo](https://github.com/fabriqaai/ffmpeg-analyse-video-skill):
  - Adaptive sampling: 0–60 s → 1 frame per 2 s; 1–10 min → scene detection (15–60 frames); 10–30 min → keyframes (30–80); 30+ min → capped at 60.
  - "Frame images are only ever read inside disposable sub-agent contexts" (~90% context reduction).
- **remotion-superpowers `/review-video`:** "AI watches your render and gives feedback… render, review, improve, repeat" via TwelveLabs — [README](https://github.com/DojoCodingLabs/remotion-superpowers). Stale repo.
- **TwelveLabs Pegasus QC node** [snippet, vendor]:
  - "The exact pattern running in production today at generative-video studios doing tens of thousands of QC calls is: generate → QC → auto-route failures back to the generator → composite only green clips".
  - The verdict "says where, not just whether… the hands warp from 2.4s to 3.1s".
  - Sources: [TwelveLabs blog](https://www.twelvelabs.io/blog/catch-ai-video-slop); [QC node](https://www.twelvelabs.io/blog/the-qc-node).
- **kinocut governed review:** "Inspect before deciding… Do not manufacture acceptance evidence from analyzer output… an approved disposition fails closed unless the exact active human evidence satisfies the acceptance spec". "Every salvage derivative… starts in a fresh non-approved review slot" — [AI_VIDEO_REVIEW_AND_SALVAGE.md](https://github.com/KyaniteLabs/kinocut/blob/master/docs/AI_VIDEO_REVIEW_AND_SALVAGE.md).
- **Higgsfield Virality Predictor** (`brain_activity`) scores a finished video's hook and attention — [skills README](https://github.com/higgsfield-ai/skills). It is a marketing metric, not an artifact detector.
- **re-walkthrough-pro** uses a "vision pass" to pick the best input photo per room *before* spending credits — [README](https://github.com/charlesdove977/re-walkthrough-pro).
- **claude-video-studio** "confere frames visualmente" (checks frames visually) before rendering — [README](https://github.com/AlexandreRL/claude-video-studio).

#### Decision frameworks for "regenerate or fix"
- **Seedance retake protocol verdicts** — [retake-protocol.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/retake-protocol.md):
  - The six verdicts: **Keep / Fix in post / Edit / Re-roll / Rewrite / Stop-change approach**.
  - "Prefer changing one relevant variable when the purpose is diagnosis."
  - Take-log line: `Take N · failed criterion and evidence · kept strengths · hypothesis · proposed change · preserved settings · remaining authorized limits · verdict / stop reason`.
  - "If the host cannot inspect the relevant media, say so… Do not claim the take was watched or measured".
- **Continuity QC:** hard-fail "canonical identity; wardrobe; product identity; product geometry; prop ownership; location…". Warn on pose, screen direction, lighting phase and similar — [continuity-qc.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/continuity-qc.md).
- **QC failure routing:** "face/product/text drift → I2V lock, edit pass, composite in post, or regenerate from stable frame"; "color mismatch → grade/conform first; only regenerate if lighting intent is wrong"; "caption/text issue → remove generated text and add typography in post"; "Human QC: watch all outputs at normal speed and pause on fragile frames" — [delivery-qc.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/delivery-qc.md).
- **Higgsfield explainer recovery:** "Style drift or realism: strengthen the shared STYLE and NEGATIVE text, then regenerate only that clip… Two identical failures mean the prompt or parameters must change" — [video-explainer SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-video-explainer/SKILL.md).
- **Resolve side:** "Verify structure, not return values… read the item count and each item's `GetLeftOffset()` back" — [headless-edit-loop.md](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/docs/guides/headless-edit-loop.md).

#### Limits of vision-based review
- **Claude image limits and cost** — [Vision docs](https://platform.claude.com/docs/en/build-with-claude/vision):
  - "20 per message on claude.ai". An image costs `⌈width / 28⌉ × ⌈height / 28⌉` visual tokens; a 1920×1080 frame costs 2,691 tokens on the high-res tier (Claude 4.7+).
  - "Claude cannot determine whether an image is AI-generated and might be incorrect if asked. Do not rely on it to detect fake or synthetic images." Accuracy drops for "low-quality, rotated, or very small images under 200 pixels"; counting is approximate.
- **GenVideoLens** (arXiv 2603.18625, Mar 2026) [snippet]:
  - 400 AI-generated + 100 real videos, 15 dimensions.
  - Findings: LVLMs "perform relatively well on perceptual cues, they struggle with optical consistency, physical interactions, and temporal-causal reasoning… current LVLMs make limited use of temporal information".
  - Source: [arXiv](https://arxiv.org/abs/2603.18625).
- **Artifact-Bench** (arXiv 2605.18984, May 2026) [snippet]: "Experiments on 19 leading MLLMs reveal substantial limitations in artifact perception and reasoning, with many models approaching random or even below-random performance in challenging settings… significant misalignment between MLLM judgments and human perceptual preferences" — [arXiv](https://arxiv.org/abs/2605.18984). Whether Claude was among the 19 is unknown.

### Inferences
**A realistic QA loop for Higgsfield clips** (synthesis):
1. **Machine gate, free and deterministic.** Run `ffprobe` to check resolution, fps, duration, audio stream and codec. Then run standard FFmpeg detectors: black frames, frozen frames, silence, loudness (EBU R128) and scene-cut count. These are standard FFmpeg filters (`blackdetect`, `freezedetect`, `silencedetect`, `ebur128`, `scdet`); their docs were not fetchable here. This is what OpenMontage, talkcraft and samuelgursky automate.
2. **Contact sheet per clip.** Take frames at 0/25/50/75/100% plus 4–7 frames around motion peaks, tiled 4×3 at 640×360 each (one 2560×1080 image).
   - By the vision docs' formula that is ⌈2560/28⌉×⌈1080/28⌉ = 92×39 ≈ **3.6k visual tokens**. Sending the 12 frames separately at 1080p would cost ≈32k (12 × 2,691).
   - This matches talkcraft's measured ~4× token and ~3× time saving.
   - In claude.ai, 20 sheets per message would allow ~240 frames per turn.
3. **Reviewer subagent** (read-only tools, cheaper model) compares the sheet against the shot card, keyframe and passport. Checks: identity and wardrobe, product geometry, hands and anatomy, legible text, composition, screen direction, and continuity against the previous select's last frame (Seedance continuity list). It returns a verdict from the Seedance taxonomy, with timestamps.
4. **Automatic action only inside pre-authorized limits.** For example, re-roll with the same settings once. Rewrite by changing one prompt variable. Stop after 2–3 failed takes per shot, or at the credit cap. Anything else escalates to the human with the sheet, the diagnosis and remaining budget.
5. **Human review of selects at normal speed.** Temporal artifacts (morphing, flicker, physics) are exactly where MLLMs are weakest, so this cannot be replaced. Optionally add a video-native model (e.g. TwelveLabs Pegasus, vendor-claimed) for timestamped defect flags as a second automated opinion.

**Where this runs:** in Claude Code or Cowork, where Claude can run ffmpeg. In plain claude.ai chat the loop degrades to "user uploads stills or sheets", or relies on the Higgsfield side (the Virality Predictor scores engagement, not defects).

**Expectation to set:** automatic QA should be treated as a *filter* that removes obvious rejects and documents why. It is not a judge of quality; kinocut's rule "Analyzer output alone cannot approve" is the right default.

### Gaps
- No public benchmark measures **Claude specifically** on detecting AI-video artifacts from frames or contact sheets. Artifact-Bench and GenVideoLens are the closest evidence, and their model lists were not visible.
- No repo was found that closes the loop **Higgsfield → automatic frame QA → automatic Higgsfield re-roll** end-to-end. OpenMontage and vibeframe do it for other providers, and re-walkthrough-pro only curates inputs.
- The TwelveLabs production-scale claim ("tens of thousands of QC calls") is vendor marketing and unverified.
- FFmpeg filter documentation (ffmpeg.org) was egress-blocked. Filter names come from general knowledge and the repos' descriptions, not a fetched doc.

---

## 5. Realistic expectations: what still needs human decisions (taste, story, final cut), and typical cost and time per minute of finished video

### Takeaway
**The mature tools all keep the human as the director.**
- The tool authors explicitly exclude choosing the best take, judging a cut, and final approval. OpenMontage, Seedance, kinocut and the Resolve MCP all require human sign-off at concept, assets and final.
- Claude realistically does producer and assistant-editor work: planning, prompt writing, batch generation within budget, file management, deterministic QA, rough assembly, titles and captions, and Resolve housekeeping.

**Cost.**
- **Code-rendered** explainers and motion graphics cost **cents to a few dollars per minute** (OpenMontage $1.33 per 60 s; digitalsamba ~$0.80 per 52 s).
- **Generative cinematic footage** costs about **$13–220 per finished minute at the generation layer** (LTX analysis).
- Documented productions including overgeneration and all tools cost **$315–750 per finished minute** (invideo analysis).
- For Higgsfield Seedance 2.0, a plausible generation cost is **~$50–200 per finished minute** (my estimate from per-clip prices and ~3 attempts per usable shot).

**Time.** Human time still dominates: first projects run **~20–40 h for a 3–8 min film** (sources disagree on the length), and render and wait time is minor in comparison.

### Cited Findings

#### What stays human (stated by tool authors)
- **samuelgursky "What This Does Not Do"** — [README](https://github.com/samuelgursky/davinci-resolve-mcp):
  - "**Choosing the best take** — Performance is most of what makes a take right, and none of it is measurable… The take that plays is regularly the least fluent one".
  - "**Judging a cut** — Nothing here has an opinion about whether an edit is good".
  - "**Replacing an editor** — The output is a first-pass assembly, in the assistant-editor sense… a starting point you cut, not a finished cut".
- **Seedance "Done Definition":** "done only when the creative owner approves the shot, the rights map is clean, continuity is tracked, the post handoff is explicit, and the delivery target has passed human QC" — [delivery-qc.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/delivery-qc.md).
- **kinocut:** "Do not publish agent-generated video without `video_quality_check`, `video_release_checkpoint`, and human visual/audio inspection" — [README](https://github.com/KyaniteLabs/kinocut).
- **digitalsamba author:** "Autonomous video creation is a lofty ideal for such a subjective field… You are the director, editor, and designer" — [README](https://github.com/digitalsamba/claude-code-video-toolkit).
- **OpenMontage:** creative gates on proposal/script/scene plan/assets/publish; "Every creative decision gets your approval" — [README](https://github.com/calesthio/OpenMontage).
- **Resolve + Claude** (via earlier notes):
  - "The AI control is real but early" — [Kompozy](https://kompozy.io/reviews/davinci-resolve-21-1).
  - A native-MCP benchmark (Codex, Resolve Studio 21.1) needed 40 tool calls for a 33 s edit, "46% of a 5-hour limit… in 8m39s", with retries as "a big multiplier" — [burn-bench RESULTS](https://github.com/RajanthaR/resolve-mcp-burn-bench/blob/main/docs/RESULTS.md).
- **Selects** [snippet; vendor bias]: "The right pattern in 2026 is Claude as the brain, a real-footage editor as the hands" — [cutback.video](https://cutback.video/blog/claude-for-video-editing-in-2026-what-works-what-breaks-and-the-real-pipeline).

#### Cost evidence
- **Code-rendered or stock-based video:**
  - OpenMontage: "THE LAST BANANA" 60 s for **$1.33** (6 Kling v3 clips via fal + TTS + Remotion); ~$4 for a 50 s HyperFrames piece — [README](https://github.com/calesthio/OpenMontage).
  - digitalsamba: ~$0.80 generation for a 52 s vertical short; LTX clip ~$0.23; TTS ~$0.01 — [README](https://github.com/digitalsamba/claude-code-video-toolkit).
- **Generation layer (LTX, vendor of its own model)** [snippet] — [LTX blog](https://ltx.io/blog/ai-video-generation-cost):
  - "$13 and $220 per finished minute at the generation layer, depending on model tier and iteration rate".
  - One finished minute is "roughly 10 to 15 shots… most in the 3 to 5 second range". Examples: entry tier with 8 attempts $19.20; mid tier with 5 attempts $96; premium tier with 3 attempts $216.
  - "A model that costs 30 cents per second but averages eight attempts per usable shot ends up more expensive than a model that costs 60 cents per second but lands the shot in three attempts."
- **Documented productions (invideo, sells an AI video tool)** [snippet] — [invideo](https://invideo.io/blog/ai-film-production-cost/):
  - "$315–$750 per finished minute", e.g. "$315/min for a 3-minute animated episode, ~$580/min for a 90-second horror short, ~$643/min for a 70-second film, and $750/min for a 2-minute brand film".
  - One episode "generated 164 clips and used 41 — a 25% selection rate — with an average of only 5 seconds kept from each 15-second clip, and roughly 3 generations per usable shot".
- **Higgsfield/Seedance prices** [snippets; vendor blog, conflicting]:
  - Higgsfield blog: Seedance 2.0 on Higgsfield "$1.55 per standard 720p 8-second clip and $1.20 on Fast". Comparisons: Dreamina $1.29; Runway $2.88; fal Fast 10 s ≈ $0.22. "Starter plan at $9/mo gives 120 credits. The Ultra plan at $129/mo gives 3,000 credits, covering roughly 83 standard Seedance 2.0 clips at 720p" — [Higgsfield blog](https://higgsfield.ai/blog/seedance-2-0-pricing-2026).
  - Unrestricted search summary: Seedance 2.0 "23 credits at 720p to 45 credits at 1080p for a five-second clip. A ten-second clip at 1080p uses 90 credits"; Kling 3.0 "about 6–7 credits"; "paid plans start at $19 a month for 270 credits… Plus at $59 for 1,200" — [Krea](https://www.krea.ai/blog/higgsfield-pricing-explained-2026-unlimited-credits-and-real-monthly-costs) / [Higgsfield blog](https://higgsfield.ai/blog/seedance-2-5-pricing-2026) (exact page not isolated).
  - OpenMontage lists plans of $15/$34/$84 and ~$0.10 per Kling 3.0 clip — [PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md).
  - German guide: credit value $0.075 Basic / $0.05 refill — [aireiter.com](https://aireiter.com/de/blog/higgsfield-mcp-claude-video-generation-setup-guide).
  - **The plan figures conflict across sources and change frequently.**
- **Real estate example:** "sub-cents of scraping plus a handful of Higgsfield credits" per tour, "auto-curates to ~6–10 hero rooms by default" — [re-walkthrough-pro](https://github.com/charlesdove977/re-walkthrough-pro).

#### Time evidence
- **Human production time** [snippets; attribution between invideo and MindStudio pages not fully isolated]:
  - "For a 3–5 minute film, expect 20–40 hours of total work for a first project": scripting and storyboard 4–6 h, generation 8–15 h (iterations and waiting), audio 3–5 h, editing/finishing 6–10 h. "first-time users should add 20–30% for learning curve" — [invideo FAQ](https://invideo.io/faq/how-long-does-it-take-to-produce-an-ai-short-film-and/); [MindStudio](https://www.mindstudio.ai/blog/ai-one-person-short-film-production-workflow).
  - An unrestricted search summary instead said "5–8 minute… 20–40 hours… once a workflow is established… 8–15 hours" (conflict).
  - "Documented AI short films cost $750 to $5,000 total and are made in 2 to 5 days by teams of 1 to 4" — [invideo](https://invideo.io/blog/ai-film-production-cost/).
- **Machine time:**
  - Higgsfield video jobs "can take 90 seconds or more" [snippet] — [Higgsfield blog](https://higgsfield.ai/blog/Generate-AI-Videos-From-Claude-with-Higgsfield-MCP).
  - The explainer skill runs independent clip jobs concurrently within a phase — [SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-video-explainer/SKILL.md).
  - talkcraft, measured on a 201 s vertical video: first full render "13 min → 9 min"; changing one shot re-renders in "53 s"; 43 stills in "~1 min" — [README](https://github.com/Vincentwei1021/video-talkcraft).
  - OpenMontage's cinematic pipeline default is `max_wall_time_minutes: 12` — [cinematic.yaml](https://github.com/calesthio/OpenMontage/blob/main/pipeline_defs/cinematic.yaml).
- **Claude usage:** "Multi-step tasks… use more of your usage… Each step Claude takes uses tokens" (Cowork) — [Help Center](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork). Cloud sessions "share rate limits with all other Claude and Claude Code usage" — [Claude Code docs](https://code.claude.com/docs/en/claude-code-on-the-web).

### Inferences
- **Higgsfield generation cost model per finished minute.** This is my arithmetic. The Higgsfield blog's $1.55 per 8 s 720p clip implies ~$0.043 per credit, which equals Ultra's $129/3,000.
  - Assumptions: 12–15 shots per minute, one 8 s Seedance 2.0 clip per attempt, ~3 attempts per usable shot (invideo; LTX's mid case).
  - 720p standard at Ultra pricing: 12 × 3 × $1.55 ≈ **$56**, up to 15 × 3 × $1.55 ≈ $70.
  - 1080p (~2× credits): ≈ **$110–140**. At the Basic credit price ($0.075, ~1.75×): ≈ $100–245.
  - Add keyframe stills (cheap), audio and upscaling. That gives **~$50–200+ per finished minute** at the generation layer, consistent with LTX's range. It excludes the Claude subscription and human time.
- **Time for a solo Higgsfield user with a tuned Claude pipeline** (estimate):
  - Claude can remove most of the "mechanical" hours: prompt writing, job babysitting, downloads, naming, logs, contact sheets, rough assembly, captions and Resolve housekeeping.
  - The remaining human hours are taste decisions, done at gates:
    - approving concept and shot list;
    - approving keyframes;
    - picking takes;
    - watching selects at speed;
    - cutting the rhythm, grading and music.
  - Expect the per-minute human effort to fall well below the invideo "first project" figures once the SOP and skills are stable. There is no measured number for this.
- **Autonomy boundaries to state in CLAUDE.md:** the agent may autonomously generate *within* an approved shot list and budget, and may auto-re-roll only with the same settings and a small attempt cap. Take selection among passing candidates, the final cut, the look and publishing stay with the human, as every framework in Q1 does.
- **Avoid over-automation on the Resolve side.** The native 21.1 MCP is token-hungry ("46% of a 5-hour limit" for 33 s, on Codex). Prefer generating FCP7 XML or DRT timelines from the shot list and let Claude verify structure, or use samuelgursky's guarded tools. Keep live MCP for housekeeping, markers and render queues.

### Gaps
- There is no independent (non-vendor) measurement of cost or time per finished minute for Claude-driven Higgsfield pipelines specifically. The numbers above combine vendor analyses (LTX, invideo, the Higgsfield blog) and framework showcases.
- A figure of "~$112 in cash and roughly 60 hours" for a six-minute solo AI short appeared in a search summary but could not be tied to a specific page. It is excluded from the findings.
- There is no Claude-specific (vs Codex) measurement of subscription usage for long video-agent sessions. Plan choice (Pro vs Max) therefore cannot be sized from evidence.
- Higgsfield credit prices per model and resolution in Sept 2026 are only available through conflicting third-party or vendor snippets. higgsfield.ai was not fetchable.
