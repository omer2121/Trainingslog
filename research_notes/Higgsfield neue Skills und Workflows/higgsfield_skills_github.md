# Higgsfield AI: skills, workflows and agent tooling from primary sources (GitHub, npm, PyPI), state 26 Sep 2026, focus on changes since ~20 Sep 2026

> **Method and access (26 Sep 2026).** All public `higgsfield-ai` repos were cloned with full history and pull-request refs. The org was enumerated through the GitHub search API, which returned 10 public repos. Every Higgsfield-published agent package on npm (8 packages) was unpacked and read, and PyPI and Homebrew were checked. PR and issue state came from GitHub search.
> - **Blocked (403, not retried):** api.github.com repo endpoints and github.com HTML pages for repos not bound to this session, gist.githubusercontent.com, higgsfield.ai, x.com and youtube.com.
> - **Bridge source:** `higgsfield-ai/fnf-local-pluging-bridge-mcp` is **not publicly accessible**. git asks for credentials and WebFetch returns 404, so the **npm tarballs are the primary source** for the local bridges.
> - **Usage and safety:** 9 web searches were used. No credits were spent and there was no Higgsfield login.
> - **Tags:** **[NEW]** = appeared or changed on/after 20 Sep 2026. **[pre-20 Sep, missing]** = older but absent from the 23 Sep notes. **[known]** = already covered in the earlier notes.
> - **Dates:** npm times are UTC. Git commit times are the committer's local time, mostly +05:00.

---

## 1. What exists now in github.com/higgsfield-ai: all repos, latest versions/tags and dates, and what changed since ~20 Sep 2026

### Takeaway
**The two repos the CLAUDE.md template is built on have not changed since the earlier notes.**
- The skills plugin is still **v0.12.0**, with its last merge on 11 Sep. The CLI is still **1.1.26** (18 Sep).
- All later work in those repos sits in **five unmerged PRs**: skills #6/#7/#8 and CLI #89/#92.

**The post-20-Sep news is elsewhere:**
- **npm, 22–23 Sep:** Higgsfield staff published **five new local MCP bridges** (Premiere Pro, Photoshop, Illustrator, DaVinci Resolve Studio, TouchDesigner). They also shipped large updates to the After Effects and Blender bridges. All of these come from a non-public repo.
- **GitHub:** two **new public repos** appeared: `soul-voice-service` (23 Sep) and `app-templates` (24–25 Sep).
- **Issues:** **four new CLI issues** (19–25 Sep) document real problems with the hosted MCP and the CLI.

### Cited Findings
**Org inventory**
- The GitHub search API (`org:higgsfield-ai`) returns **10 public repos**: soul-voice-service, app-templates, homebrew-tap, cli, higgsfield-js, higgsfield-client, skills, higgsfield (legacy ML framework, 2018), omagotchi and cursor-plugin — [GitHub search, 26 Sep](https://github.com/higgsfield-ai).
  - `fnf-local-pluging-bridge-mcp` and `cloud-cli` are **not** among the public repos, although npm metadata points to both.

**higgsfield-ai/skills** — [repo](https://github.com/higgsfield-ai/skills) — no new version since 11 Sep **[known version; PR details pre-20 Sep, missing]**
- `VERSION` = **0.12.0**. `main` HEAD `d071406` = "Merge pull request #5 … docs: default to GPT Image 2.5 and Seedance 2.5", dated **2026-09-11**. The repo has no git tags and 89 commits on main — [commits](https://github.com/higgsfield-ai/skills/commits/main).
- The repo shows 1,147 stars and 225 forks. `updated_at` reads 26 Sep, but that reflects stars and issues, not commits — [GitHub search](https://github.com/higgsfield-ai/skills).
- **Open PR #6** (opened 2026-09-14 by Higgsfield staff `arsuhf` / arsu@higgsfield.ai, 5 commits on 14–15 Sep): "docs: teach soul and marketing studio v2 preset discovery" — [PR #6](https://github.com/higgsfield-ai/skills/pull/6)
- **Open PR #7** (2026-09-18, external contributor): "fix(claude): declare skills as paths so the plugin installs on Claude Code" — [PR #7](https://github.com/higgsfield-ai/skills/pull/7)
- **Open PR #8** (2026-09-18, external contributor): "docs: fix Claude Code install path in INSTALL_FOR_AGENTS.md" — [PR #8](https://github.com/higgsfield-ai/skills/pull/8)
- **Inconsistency:** README and INSTALL.md still advertise **9 skills**, including `/higgsfield:game-generation`. The repo has only **8 skill folders**, and there is no `higgsfield-game-generation` folder; game content lives under `higgsfield-websites` — [README](https://github.com/higgsfield-ai/skills/blob/main/README.md); [INSTALL.md](https://github.com/higgsfield-ai/skills/blob/main/INSTALL.md); [marketplace.json](https://github.com/higgsfield-ai/skills/blob/main/.claude-plugin/marketplace.json).

**higgsfield-ai/cli** — [repo](https://github.com/higgsfield-ai/cli) — 1.1.26 is still the latest **[known]**
- npm `@higgsfield/cli` has `latest` = **1.1.26**, published 2026-09-18 23:40 UTC. **1.1.25** was published 2026-09-14 21:42 UTC. No newer version exists as of 26 Sep. The binaries are `higgsfield` and `higgs` — [npm registry](https://registry.npmjs.org/@higgsfield/cli); [npm](https://www.npmjs.com/package/@higgsfield/cli).
- Git tags run from v0.1.1 to **v1.1.26**. v1.1.25 and v1.1.26 both point to commit `dc7e2d2` (main, 2026-09-11, "docs: refresh recommended image and video models").
  - The GitHub repo therefore holds docs and install scripts only (language: Shell). Binary changes in 1.1.25/1.1.26 are **not visible**, and there is no changelog in the repo — [tags](https://github.com/higgsfield-ai/cli/tags).
- Homebrew tap: the last commit is "Brew formula update for hf version v1.1.26" (2026-09-19 04:39 +05:00). No newer formula exists — [homebrew-tap](https://github.com/higgsfield-ai/homebrew-tap).
- **Open PR #89** (2026-09-14, staff): "docs: explain soul and marketing studio v2 presets" — [PR #89](https://github.com/higgsfield-ai/cli/pull/89).
- **Open PR #92** (2026-09-20, external): "docs: add OAuth token endpoint troubleshooting". It adds a `Cannot reach token endpoint` fix (logout/login) and points to issue #79 — [PR #92](https://github.com/higgsfield-ai/cli/pull/92).
- **New issues, all open with 0 comments** — [issue search](https://github.com/higgsfield-ai/cli/issues):
  - **[pre-20 Sep, missing]** #90 (2026-09-15) "Blender Bridge OAuth: callback issuer differs from advertised Clerk issuer" — [#90](https://github.com/higgsfield-ai/cli/issues/90)
  - **[pre-20 Sep, missing]** #91 (2026-09-19) "Documentation request: CLI v1.1.26 generation response and billing semantics" — [#91](https://github.com/higgsfield-ai/cli/issues/91)
  - **[NEW]** #93 (2026-09-20) "Remote MCP: generate_image / generate_video advertise an opaque inputSchema … every call fails with `params: Invalid input`" — [#93](https://github.com/higgsfield-ai/cli/issues/93)
  - **[NEW]** #94 (2026-09-23) "CLI silently truncates multi-line --prompt at the first blank line" — [#94](https://github.com/higgsfield-ai/cli/issues/94)
  - **[NEW]** #95 (2026-09-25) "MCP: add a per-call credit ceiling (max_credits), return cost on submit, and idempotent resubmits — prevents agent retry loops" — [#95](https://github.com/higgsfield-ai/cli/issues/95)

**SDKs** **[pre-20 Sep, missing: Agent API]**
- **Python SDK** `higgsfield-client`:
  - PyPI **0.2.0** was published 2026-09-17 and is still the latest — [PyPI](https://pypi.org/project/higgsfield-client/).
  - `main` = merge of PR #6 "feat: add Agent API sessions and media to Python SDK" (2026-09-17) — [PR #6](https://github.com/higgsfield-ai/higgsfield-client/pull/6).
- **JS SDK** `@higgsfield/client`:
  - **0.2.4 and 0.2.6** were published 2026-09-17 — [npm registry](https://registry.npmjs.org/@higgsfield%2Fclient).
  - PR #16 "feat(v2): add Agent API sessions and media" was merged 2026-09-17, and the 0.2.6 release merged 2026-09-17/18. Four PRs are open, from 18–22 Sep. They are upload-header fixes, refactors and Snyk updates — [PR #16](https://github.com/higgsfield-ai/higgsfield-js/pull/16); [repo](https://github.com/higgsfield-ai/higgsfield-js).

**higgsfield-ai/cursor-plugin** — [repo](https://github.com/higgsfield-ai/cursor-plugin) **[pre-20 Sep, missing]**
- Plugin version **1.1.0**. The last commit is 2026-08-22, "fix(plugin): remove stale generation skills".
- It wires Cursor to the hosted MCP (`"type": "http", "url": "https://mcp.higgsfield.ai/mcp"`) and ships a `/higgs` command. It is the best primary source for hosted-MCP tool names; see Q4 — [mcp.json](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/mcp.json); [commands/higgs.md](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/commands/higgs.md).

**New public repos** **[NEW]**
- **`app-templates`** (created 2026-09-24 22:28 UTC, 5 commits on 25 Sep): "Higgsfield app templates (studio, preset, app-detail) as a shadcn registry" — [repo](https://github.com/higgsfield-ai/app-templates); [README](https://github.com/higgsfield-ai/app-templates/blob/main/README.md).
  - It is a Next.js 16 + shadcn "Studio" template that generates via the **platform API** (`https://platform.higgsfield.ai`) with a `cloud.higgsfield.ai` key (`id:secret`).
  - "Templates: **studio** (available now), preset and app-detail (next)." Setup is `pnpm dlx shadcn@latest init … higgsfield-ai/app-templates/studio`, with one model per file.
- **`soul-voice-service`** (created 2026-09-23, 6 commits on 23–25 Sep): "SQS/S3 GPU service for Soul Voice design, cloning and direction" — [repo](https://github.com/higgsfield-ai/soul-voice-service); [README](https://github.com/higgsfield-ai/soul-voice-service/blob/develop/README.md).
  - It is a backend worker, not a user-facing tool. It has modes `design`, `clone` and `direction` and outputs mono 24 kHz WAV. It hints at an upcoming "Soul Voice" feature, but no user-facing product was found (a web search for "Soul Voice" returned nothing specific).

**Other repos**
- `omagotchi` (created 2026-08-26, last commit 2026-09-05) is an "AI-generated desktop avatar for Omarchy — 8-bit sprites … via Higgsfield". It is not relevant to video — [repo](https://github.com/higgsfield-ai/omagotchi).
- `higgsfield` is the legacy 2018 GPU-orchestration framework. It only receives external PRs — [repo](https://github.com/higgsfield-ai/higgsfield).

**The bridge source repo (not public)**
- The npm packages give `repository: git+https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp.git` — [npm registry](https://registry.npmjs.org/fnf-blender-mcp).
- git clone requires credentials and WebFetch of its PR pages returns 404 (26 Sep).
- Search engines still index its PRs:
  - #13 "feat(blender): add independent local mcp package"
  - #15 "docs(blender): add modular skills"
  - #22 "feat(skills): add the Premiere corpus"
  - #27/#28 "feat: add Photoshop, Premiere Pro, and Illustrator MCP packages"
  - #31 "feat(adobe): add optional local lookup for bundled skills"
  - #34/#36 "align Premiere/Illustrator corpus with local MCP"
  - #39 "feat(touch-designer): package protected local MCP and native skill"
  - Sources: [search result: PR #27](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp/pull/27); [Glama listing](https://glama.ai/mcp/servers/higgsfield-ai/fnf-local-pluging-bridge-mcp).
- A search snippet of PR #28 says the first Adobe packages had "31 Photoshop, 26 Premiere Pro, and 33 Illustrator operations". Today's READMEs say 78 / 26 / 45 — [search result: PR #28](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp/pull/28).
- A **public fork** (`nekorytaylor666/fnf-local-pluging-bridge-mcp`) mirrors `main` up to **2026-09-14** (PR #18) — [fork](https://github.com/nekorytaylor666/fnf-local-pluging-bridge-mcp). It shows:
  - AE local skills (10 Sep)
  - "feat(blender)!: replace addon bridge with background process" (12 Sep)
  - Blender modular skills (13–14 Sep)
  - branches from 17 Sep: "file the corpus by application and add Premiere, Photoshop and DaVinci", and "ship skill files as plain assets and resolve them by path"

**npm packages published by Higgsfield npm accounts** (`arsu_higgsfield_ai`, `alensultanov_higgsfield_ai`) — [npm search "higgsfield"](https://www.npmjs.com/search?q=higgsfield)

| Package | Versions (UTC) | Status |
|---|---|---|
| [`fnf-after-effects-mcp`](https://www.npmjs.com/package/fnf-after-effects-mcp) | 0.1.0 (09-10), 0.1.1 (09-14), **0.1.2 (09-23 16:39), 0.1.3 (09-23 19:50)** | known package, **[NEW] update** |
| [`fnf-blender-mcp`](https://www.npmjs.com/package/fnf-blender-mcp) | 0.1.0 (09-11), 0.2.0 (09-12), **0.2.1 (09-23 16:56), 0.2.2 (09-23 19:49)** | known package, **[NEW] update** |
| [`@higgsfield_org/premiere-mcp`](https://www.npmjs.com/package/@higgsfield_org/premiere-mcp) | **0.1.0 (09-22 20:39)**, 0.1.1, 0.1.2, **0.1.3 (09-23 19:48)** | **[NEW]** |
| [`@higgsfield_org/photoshop-mcp`](https://www.npmjs.com/package/@higgsfield_org/photoshop-mcp) | **0.1.0 (09-22 20:35)**, 0.1.1, **0.1.2 (09-23 19:49)** | **[NEW]** |
| [`@higgsfield_org/illustrator-mcp`](https://www.npmjs.com/package/@higgsfield_org/illustrator-mcp) | **0.1.0 (09-22 20:39)**, 0.1.1, **0.1.2 (09-23 19:48)** | **[NEW]** |
| [`@higgsfield_org/davinci-resolve-mcp`](https://www.npmjs.com/package/@higgsfield_org/davinci-resolve-mcp) | **0.1.0 (09-23 17:38), 0.1.1 (09-23 19:49)** | **[NEW]** |
| [`@higgsfield_org/touch-designer-mcp`](https://www.npmjs.com/package/@higgsfield_org/touch-designer-mcp) | **0.1.0 (09-23 16:18), 0.1.1 (09-23 19:49)** | **[NEW]** |
| [`@higgsfield/cloud-cli`](https://www.npmjs.com/package/@higgsfield/cloud-cli) (`hf-api`) | 0.1.0 / 0.1.2 (2026-07-16) | **[pre-20 Sep, missing]** |

**Directory and third-party context**
- The Claude connector directory still has **no Higgsfield entry**. `claude.com/connectors/higgsfield` redirects to `/marketplace/connectors/higgsfield`, which returns **404** (checked 26 Sep) — [claude.com](https://claude.com/connectors/higgsfield).
- **Third-party, not endorsed:** `TheNeuralCube/higgsfield-skills`, an "unofficial fork of higgsfield-ai/skills … Adds a corrected Claude Code plugin manifest". Its last commit is 2026-09-25, "Make the fork installable as a plugin in Claude Code and Codex" — [fork](https://github.com/TheNeuralCube/higgsfield-skills).

### Inferences
- For the template, "skills v0.12.0 / CLI 1.1.26" is still the current baseline, so no version bump is needed. However, the **documented Claude Code install route is broken** (see Q5), and that should change the install instructions.
- The CLI's GitHub tags are release markers on a docs repo. "What changed in 1.1.26" cannot be read from GitHub. Issue #91 asks exactly this, and it is unanswered.
- Higgsfield is clearly moving from "generation via MCP/CLI" to "**agents that operate the user's own desktop apps**" (seven local bridges in two weeks), plus server-side agents (Agent API). The bridges are distributed via npm while their source repo stays private.

### Gaps
- The bridge repo's CHANGELOG, commit history after 14 Sep, and PR texts could not be read (private, 404).
- GitHub **releases** (release notes) for cli/skills could not be read: the repo-scoped API and github.com pages are blocked for this session. The git tags carry no notes.
- The org listing relies on GitHub search. Private or internal repos are invisible by definition.

---

## 2. Complete inventory of Higgsfield's skills and workflows for AI agents: what each does, how Claude invokes it, models, costs, surface, and what is NEW since skills v0.12.0 / CLI 1.1.26

### Takeaway
There are five agent surfaces:
1. **8 Claude Code plugin skills** (v0.12.0). These are CLI-based and unchanged.
2. **CLI workflows and presets.** Unchanged, but pending PRs document Marketing Studio V2 and Soul V2 presets plus `workflow list` discovery.
3. **The hosted MCP** at `mcp.higgsfield.ai/mcp`. It offers a server-side workflow catalog through `get_workflow_instructions`.
4. **The cloud "Bridge" MCP** at `bridge.higgsfield.ai/mcp`, for the Blender add-on.
5. **Seven local stdio MCP bridges.** These are Higgsfield's newest tooling. Each bundles offline "creative skills", but none generates media: they route paid generation to "a separately connected Higgsfield provider" (MCP or CLI).

On the API side there is a **server-side Agent API** (SDK, 17 Sep), an API-key CLI (`hf-api`) and a Studio app template (25 Sep).

### Cited Findings

#### 2a. Claude Code plugin skills — `higgsfield-ai/skills` v0.12.0 (all **[known]**, unchanged since 11 Sep)

All skills declare `allowed-tools: Bash` and wrap the `higgsfield` CLI. Their bootstrap step installs the CLI and asks the user to run `higgsfield auth login` — [generate SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md).

| Skill (invoke) | What it does / inputs → outputs | Models / defaults | Cost notes (documented) |
|---|---|---|---|
| `higgsfield-generate` (`/higgsfield:generate`) | Images, video, 3D (GLB) and audio. Also workflows (`draw_to_video`, `reframe`), Marketing Studio (9 ad modes: `ugc`, `ugc_how_to`, `ugc_unboxing`, `product_showcase`, `product_review`, `tv_spot`, `wild_card`, `ugc_virtual_try_on`, `virtual_try_on`) and Virality Predictor (`brain_activity`: video in → scores + "Open report" URL). Inputs: prompt plus `--image/--start-image/--end-image/--video/--audio` (path or UUID). Output: media URL, or JSON with `--json`. | GPT Image 2.5 (image), **Seedance 2.5** (video, 4–30 s, ≤1080p; Seedance 2.0 for native 4K), Nano Banana 2/Lite/Pro (character/reference), Marketing Studio (ads), Seed Audio 1.0 (audio). Alternatives: Kling 3.0 / **3.0 Turbo** (cheaper), Seedance 1.5 Pro (only if the user asks for cheap), Cinema Studio Video 3.0 (highest fidelity), Minimax Hailuo, Veo 3.1 Lite, **Grok Video 1.5** (stylized I2V, 2–15 s, 480p/720p), **Gemini Omni Flash** (up to 7 image refs or 1 video ref) | No prices in the repo. Preflight: `higgsfield generate cost <jst> …` "returns credit estimate without submitting". Workflows: `generate cost workflow …`. `higgsfield account` = balance/transactions. UX rule 5: "Don't pre-estimate cost…" |
| `higgsfield-soul-id` (`/higgsfield:soul-id`) | Trains a Soul Character from 5–20 face photos → `reference_id` for `--soul-id` | Soul 2.0 / Soul Cinema downstream | "Soul training requires a paid plan (Basic+)". COOKBOOK says training takes "15–45 minutes one-time" |
| `higgsfield-product-photoshoot` | 10 product-image modes, with backend prompt enhancement | `gpt_image_2` | not documented |
| `higgsfield-brandkit` | Palettes, SVG logos, mockups, packaging, PPTX/PDF brandbook | Recraft, Seedream, GPT Image + local scripts | not documented |
| `higgsfield-marketplace-cards` | Marketplace main image, secondary images and A+ modules | backend templates | not documented |
| `higgsfield-websites` | Builds, deploys and publishes sites/apps/games (`higgsfield website …`, Cloudflare Worker), plus game art | – | not documented |
| `higgsfield-video-explainer` | A **finished narrated MP4** of 1–10 min: ordered 10-s blocks, each with one Seed Audio take and one Gemini Omni clip, assembled server-side with `explainer_video` | `nano_banana_2` (style key), `seed_audio`, `gemini_omni`, `explainer_video` | "subtitles cost **0.05 credit per voiced block**" |
| `higgsfield-youtube-thumbnail` | Thumbnails and vertical covers | Nano Banana Pro 4K + Seedream edits | not documented |
| (`higgsfield-game-generation`) | Advertised in README/INSTALL.md, but **the folder does not exist** | – | – |

Sources: [README](https://github.com/higgsfield-ai/skills/blob/main/README.md); [generate SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md); [troubleshooting.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/troubleshooting.md); [video-explainer SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-video-explainer/SKILL.md); [soul-id SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-soul-id/SKILL.md); [COOKBOOK.md](https://github.com/higgsfield-ai/skills/blob/main/COOKBOOK.md).

- **COOKBOOK recipes** — [COOKBOOK.md](https://github.com/higgsfield-ai/skills/blob/main/COOKBOOK.md):
  - (1) Brand campaign from a founder photo
  - (2) **UGC ad batch from a product URL**: 4 modes in parallel, 9:16, 15 s, 720p
  - (3) Founder video update
  - (4) **Narrated explainer from a document**
  - (5) Browser game
- Recipe 2 passes `--output-dir ./ads/$mode`. That flag is **not** in the CLI README's flag table (`--wait`, `--wait-timeout`, `--wait-interval`, `--json`, `--no-color`) — [CLI README](https://github.com/higgsfield-ai/cli/blob/main/README.md).
- **Paid job commands outside `generate create|workflow`** used by the skills: `higgsfield product-photoshoot create`, `marketplace-cards create`, `soul-id create`, and `marketing-studio dtc-ads generate` (has `--cost-only`: "Print credit cost; do not create a job") — [skills repo grep](https://github.com/higgsfield-ai/skills); [marketing-dtc-ads.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/marketing-dtc-ads.md).

#### 2b. CLI workflows and presets (CLI 1.1.26)
- **Workflows on main [known]:**
  - `generate workflow draw_to_video | reframe | voice-change | dubbing`, discovered with `higgsfield workflow list/get`
  - cost: `higgsfield generate cost workflow draw_to_video --duration 8.2 --resolution 720p`
  - "`voice-change` and `dubbing` do not support cost estimation"
  - Source: [CLI README](https://github.com/higgsfield-ai/cli/blob/main/README.md)
- **Preset types on main [known]:**
  - `higgsfield preset list video-explainer` / `preset resolve video-explainer <id>`
  - `preset list animation-action` (3D rig animations)
  - `higgsfield preset` = "list server-managed styles/actions" — [CLI README](https://github.com/higgsfield-ai/cli/blob/main/README.md)
- **Pending docs: open PRs #89 and #6, Higgsfield staff, 14–15 Sep, unmerged [pre-20 Sep, missing]**
  - "Every listed workflow can be submitted through `generate workflow`, including image workflows such as `ms_image`. The list comes from the API catalog; the examples below are not exhaustive." — [PR #89](https://github.com/higgsfield-ai/cli/pull/89)
  - **Marketing Studio V2:**
    - `marketing_studio_2_image`: product shots, posters, ads, marketplace images
    - `marketing_studio_v2_video`: types `hypermotion`, `mixed_media`, `saas_motion`, `2d_motion`, native `ugc`, `ugc_v2`
    - `marketing_studio_v2_reference2video`: no preset selection
    - Discovery: `higgsfield preset list marketing-studio-v2 --type hypermotion --json`, then `generate workflow marketing_studio_v2_video --type hypermotion --preset_id <preset_id> --image ./product.png --wait`
    - "Availability requires the corresponding backend rollout."
    - Sources: [PR #89](https://github.com/higgsfield-ai/cli/pull/89); [PR #6](https://github.com/higgsfield-ai/skills/pull/6)
  - **Soul 2.0 styles:** `higgsfield preset list soul-v2 --query exposure`, then `generate create text2image_soul_v2 --style_id <style_id>`. This can be combined with `--soul-id` but not with image references, and "requires the API schema … to include `style_id`" — [PR #89 (MODELS.md)](https://github.com/higgsfield-ai/cli/pull/89)
  - **Cost:**
    - "Cost parameters come from `workflow get <name> --json` (`cost_params`) … a workflow with no cost schema reports that estimation is unavailable"
    - example `higgsfield generate cost workflow voice_change --duration 8.2`
    - For hypermotion/mixed_media/saas_motion, "cost estimation with `preset_id` reads the selected preset's duration. `2d_motion` defaults to 5 seconds."
    - Source: [PR #89](https://github.com/higgsfield-ai/cli/pull/89)
  - **Schema changes shown in the PR:** `draw_to_video` drops `--timestamp`, and `reframe` drops `--mode std|pro` and gains `--duration` for pricing — [PR #6](https://github.com/higgsfield-ai/skills/pull/6)
  - **Naming inconsistency:** README uses `voice-change` while PR #89 uses `voice_change` — [PR #89](https://github.com/higgsfield-ai/cli/pull/89)
- **Live catalog vs. docs.** `MODELS.md` (generated per-model docs) has no entry for `seedance_2_5`, although README and skills use it — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md).
  - A user on 23 Sep ran `higgsfield generate create minimax_h3 --resolution 2K --duration 15`. That model is documented nowhere in the repos — [#94](https://github.com/higgsfield-ai/cli/issues/94).

#### 2c. Hosted MCP — `https://mcp.higgsfield.ai/mcp` (OAuth; Claude web/desktop custom connector, Claude Code, Cursor) **[pre-20 Sep, missing: workflow catalog]**
- Higgsfield's Cursor `/higgs` command (22 Aug 2026) describes the current routing — [commands/higgs.md](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/commands/higgs.md):
  - one image/video/audio result → `generate_image`, `generate_video` or `generate_audio`, with `models_explore` "when the model or its parameters are unclear"
  - several independent generations → "the matching batch generation tool" plus the `jobs_wait` display protocol
  - specialized production → "call `get_workflow_instructions` with no workflow first to discover the current catalog, then load and follow the matching canonical workflow. This includes **faceless videos, UGC formats, narration, subtitles, thumbnails, brand kits, and character sheets**"
  - edits → "upscale, outpaint, reframe, background removal, **motion control**, voice change, or dubbing"
  - virality → "the MCP virality analysis tool"
  - library, characters, workspaces, billing and account → "browse or account tool"
  - "For an HTTP(S) media URL, import it before passing the returned media ID"
- An issue from 20 Sep reports that read-only tools work: "`models_explore`, explainer presets, balance — all return correct data" — [#93](https://github.com/higgsfield-ai/cli/issues/93).
- A search snippet on Higgsfield's MCP page(s) says the MCP "exposes balance and per-model pricing so the agent can warn you before burning a plan". Attribution is uncertain (higgsfield.ai is blocked) — [higgsfield.ai/mcp](https://higgsfield.ai/mcp) (snippet).
- A Higgsfield help-center snippet says all integrations (Figma/FigJam, Photoshop, Premiere/After Effects, DaVinci Resolve, Blender, Minecraft, game builder) "use your existing Higgsfield plan credits, the same as MCP and CLI" — [help center](https://higgsfield.ai/creator-hub/help-center/integrations/external-integrations-higgsfield) (snippet).

#### 2d. Cloud "Bridge" MCP — `https://bridge.higgsfield.ai/mcp` **[pre-20 Sep, missing]**
- The reporter says Higgsfield's official Blender setup page documents `https://bridge.higgsfield.ai/mcp`. Logging in with `codex mcp login higgsfield` failed with an issuer mismatch after the consent step (reproduced 14 Sep, still open). "Local Blender MCP works. The failure is isolated to the separate cloud Bridge login." — [#90](https://github.com/higgsfield-ai/cli/issues/90)
- The Blender bridge skill lists **cloud-side names** that the local package lacks, with a local route for each — [fnf-blender-mcp 0.2.2 tarball, skills/blender-volatile/SKILL.md](https://registry.npmjs.org/fnf-blender-mcp/-/fnf-blender-mcp-0.2.2.tgz):
  - connection: `get_host_status`
  - scene: `bl_scene_snapshot`, `bl_scene_diff`, `bl_checkpoint`, `bl_build_scene`, `bl_build_blockout`, `bl_review_blockout_pass`
  - viewport and review: `bl_screenshot`, `bl_render_preview`, `bl_audit_render`, `bl_render_contact_sheet`
  - validation: `bl_validate_scene`, `bl_audit_motion`, `bl_finalize_build`
  - **generation:** `bl_list_models`, `bl_estimate_generation`, `bl_generate_*`, `bl_generation_status`, `bl_import_generation`
  - materials: `bl_apply_hdri`, `bl_apply_pbr_maps`
  - video and docs: `bl_render_motion_reference`, `bl_describe_tool`/`bl_search_api`
  - `blender-animation` also names `bl_create_motion_preset` (orbit/dolly/idle).
  - These most likely belong to the cloud Bridge / add-on ("FNF bridge"). The 14 Sep repo README calls the local skills "adapted from the FNF bridge" — [fork README at 14 Sep](https://github.com/nekorytaylor666/fnf-local-pluging-bridge-mcp).

#### 2e. Local app MCP bridges (npm, source repo private) — the main **[NEW]** item
Shared pattern:
- Each package runs as a local stdio server (`node >=24`).
- Each exposes `*_catalog` + `*_do` (typed operations), `*_guide`, `*_get_skill`/`*_get_skill_asset` (bundled offline skills) and `*_status`.
- Setup goes through `doctor`, then `config`, which prints a JSON entry for any desktop MCP client (Claude Desktop / Claude Code). AE and TouchDesigner also have Codex helpers.
- Read-only modes: `AE_MCP_READONLY=1`, `ADOBE_MCP_READONLY=1`.
- "A remote web client cannot directly launch this local stdio process" — [AE tarball, skills/after-effects/use-after-effects/SKILL.md](https://registry.npmjs.org/fnf-after-effects-mcp/-/fnf-after-effects-mcp-0.1.3.tgz).
- **None of them generates media.** Example: "This local Blender server has no model catalog, estimate, generation, polling or download tools. Use an already connected Higgsfield service" — [Blender tarball, blender-generation/SKILL.md](https://registry.npmjs.org/fnf-blender-mcp/-/fnf-blender-mcp-0.2.2.tgz).

| Package → server name | App requirement (tested) | MCP tools (exact) | Native ops | Bundled skills | New since earlier notes |
|---|---|---|---|---|---|
| `fnf-after-effects-mcp` 0.1.3 → registered as `higgsfield-use-after-effects` | After Effects (macOS/Windows); "no cloud account or After Effects panel is required" | `ae_project_info`, `ae_comp_info`, `ae_layer_info`, `ae_context`, `ae_version_info`, `ae_catalog`, `ae_do`, `ae_render_frame`, `ae_save_project`, `ae_project_export_json`, `ae_project_import_json`, `ae_get_skill`, **`ae_get_skill_asset`** | via `ae_catalog` | **13**: `ae-clean-rig` (entry point), `use-after-effects`, `ae-figma-transfer`, **`ae-cleanup`** (VFX object/wire/lettering removal, tracked sign replacement), **`ae-matte-painting`** (editable VFX composite from green-screen footage; generates missing environment/object/FX layers driven by source motion), plus companions `ae-transition-kit`, `ae-animation-principles`, `ae-build-orchestration`, `ae-depth-space`, `ae-design-first`, `ae-liquid-glass`, `ae-mcp-realities`, `ae-ui-mastery` | 0.1.1 (14 Sep) had 11 skills and 12 tools. **`ae-cleanup`, `ae-matte-painting` and `ae_get_skill_asset` were added 23 Sep** |
| `fnf-blender-mcp` 0.2.2 | Blender ≥4.2 as a **background process**; no add-on and no cloud account; verified macOS arm64, Windows/Linux not verified | `bl_health`, `bl_get_scene_summary`, `bl_get_object`, `bl_add_primitive`, `bl_delete_object`, `bl_set_transform`, `bl_set_material`, `bl_import_model`, `bl_add_camera`, `bl_set_active_camera`, `bl_add_light`, `bl_set_frame`, `bl_insert_keyframe`, `bl_save_project`, `bl_open_project`, `bl_render`, `bl_execute`, `bl_job_status`, **`bl_list_skills`**, `bl_get_skill`, **`bl_get_skill_asset`** | Python via `bl_execute` | **17**: `blender-scene`, `use-blender`, `blender-scene-spec` (Scene Passport), `blender-greybox` (animated greybox + motion-reference video), **`blender-camera-blocking`** (bundled Blockstage add-on, rooms, 42-piece furniture, 4 rigged characters), `blender-camera-led-assembly`, `blender-lighting-camera`, `blender-modeling`, `blender-animation`, `blender-lookdev`, `blender-pbr`, `blender-hdri`, **`blender-generation`** (credit workflow), `blender-stylized-materials` (cel/manga/halftone/watercolor addon), `blender-destruction`, `blender-audit-finalize`, `blender-volatile` | 0.2.0 (12 Sep) had 2 skills and 19 tools. **15 skills and 2 tools were added 23 Sep** |
| `@higgsfield_org/premiere-mcp` 0.1.3 | Premiere Pro; tested on **macOS, Premiere 26.5.1**, Windows experimental; installs a **signed CEP extension** (`fnf-premiere install-bridge`) | `pr_document_info`, `pr_catalog`, `pr_do`, `pr_guide`, `pr_get_skill`, `pr_get_skill_asset`, `pr_status` | **26**: project.info/open/create/save_as, media.import, bin.list/create, item.rename, sequence.list/create/info/clone/activate/playhead/range/export, track.list/rename/mute, clip.list/rename/move/disable/source_range, timeline.insert/overwrite | **5**: `premiere-assembly`, `premiere-editing-director` (ingest, dual-system sync via separate `filmsync` CLI, XML turnover), `premiere-editing-reference`, `premiere-radio-edit` (interview/podcast selects), `premiere-vertical-content` (Reels/Shorts/TikTok) | **NEW 22–23 Sep** |
| `@higgsfield_org/photoshop-mcp` 0.1.2 | Photoshop; tested on macOS, PS 27.10.0 | `ps_document_info`, `ps_catalog`, `ps_do`, `ps_preview`, `ps_guide`, `ps_get_skill`, `ps_get_skill_asset`, `ps_status` | **78** | **2**: **`ps-deslop`** ("repair generated locations into coherent photographic scenes with editable layers and masks"), `ps-retouch` (6 profiles; edits "only when an external image_gen editor is actually available") | **NEW 22–23 Sep** |
| `@higgsfield_org/illustrator-mcp` 0.1.2 | Illustrator; tested on macOS, AI 30.8.1 | `ai_document_info`, `ai_catalog`, `ai_do`, `ai_preview`, `ai_guide`, `ai_get_skill`, `ai_get_skill_asset`, `ai_status` | **45** | **1**: `illustrator-vector-art` (staged trace needs a separate Python/JSX runtime) | **NEW 22–23 Sep** |
| `@higgsfield_org/davinci-resolve-mcp` 0.1.1 | **DaVinci Resolve Studio 21.1** (paid) with External scripting = Local; **Color page only**; "Free Resolve … does not establish Studio scripting access" | `dr_status`, `dr_inspect_color`, `dr_create_version`, `dr_set_cdl`, `dr_set_lut`, `dr_save_project`, `dr_acknowledge_uncertain`, `dr_get_skill`, `dr_get_skill_asset` | (no catalog) | **1**: `davinci-film-colorist` (DWG/Intermediate pipeline, camera references, shot matching) + **HF-Astra-Looks** DCTL (49 controls) + 5 film LUTs, installed via a dry-run-first script | **NEW 23 Sep** |
| `@higgsfield_org/touch-designer-mcp` 0.1.1 | TouchDesigner build ≥2025.33230 with a key; loopback `127.0.0.1:9981` plus a private token | `td_get_skill` plus the upstream native catalog (`get_td_info`, `execute_python_script`, …) from MIT `touchdesigner-mcp-server` 2.1.0 | – | **1**: `touch-design-master` (glitch, particles, audio-reactive, thermal, ASCII…); "does not include Workshop preset execution" | **NEW 23 Sep** |

Sources for the table:
- READMEs and tarballs: [AE](https://registry.npmjs.org/fnf-after-effects-mcp/-/fnf-after-effects-mcp-0.1.3.tgz), [Blender](https://registry.npmjs.org/fnf-blender-mcp/-/fnf-blender-mcp-0.2.2.tgz), [Premiere](https://registry.npmjs.org/@higgsfield_org/premiere-mcp/-/premiere-mcp-0.1.3.tgz) (ops from `dist/premiere/catalog.json`), [Photoshop](https://registry.npmjs.org/@higgsfield_org/photoshop-mcp/-/photoshop-mcp-0.1.2.tgz), [Illustrator](https://registry.npmjs.org/@higgsfield_org/illustrator-mcp/-/illustrator-mcp-0.1.2.tgz), [Resolve](https://registry.npmjs.org/@higgsfield_org/davinci-resolve-mcp/-/davinci-resolve-mcp-0.1.1.tgz), [TouchDesigner](https://registry.npmjs.org/@higgsfield_org/touch-designer-mcp/-/touch-designer-mcp-0.1.1.tgz)
- Old versions for comparison: [AE 0.1.1](https://registry.npmjs.org/fnf-after-effects-mcp/-/fnf-after-effects-mcp-0.1.1.tgz), [Blender 0.2.0](https://registry.npmjs.org/fnf-blender-mcp/-/fnf-blender-mcp-0.2.0.tgz)
- Tool names were extracted from each package's `dist/*.js` and match the READMEs.

**Hard limits stated in the bridge docs:**
- **Premiere:**
  - The catalog "has **no effects, transitions, captions, MOGRTs, transforms, speed, gain automation, music ducking, multicam builder, silence/beat analysis, frame preview**"
  - sequences need a local `.sqpreset`, exports need an `.epr`
  - "API success is not visual or audio proof"
  - "Adobe Media Encoder mode reports job submission, not completed encoding"
  - Sources: [premiere-assembly SKILL.md in tarball](https://registry.npmjs.org/@higgsfield_org/premiere-mcp/-/premiere-mcp-0.1.3.tgz); [README](https://www.npmjs.com/package/@higgsfield_org/premiere-mcp)
- **Photoshop:**
  - "does not expose Healing/Patch/Clone, Color Range, Gradient Fill, Smart Blur, Content-Aware/Generative Fill, Lens Blur, Radial Blur, or arbitrary JSX execution"
  - "Seedream is a separate service and is not bundled or implied by this MCP"
  - Source: [ps-deslop SKILL.md in tarball](https://registry.npmjs.org/@higgsfield_org/photoshop-mcp/-/photoshop-mcp-0.1.2.tgz)
- **Resolve:**
  - "`dr_set_cdl` has no readback API"
  - "A timed-out write blocks further writes until you inspect Resolve and call `dr_acknowledge_uncertain`"
  - Source: [README](https://www.npmjs.com/package/@higgsfield_org/davinci-resolve-mcp)
- **Blender:** "Arbitrary Python is not sandboxed". Timed-out jobs keep running, so check `bl_job_status` before retrying — [README](https://www.npmjs.com/package/fnf-blender-mcp).
- **AE:** "A timed-out operation may still have run; inspect After Effects before retrying"; "`batch.run` … does not automatically roll back" — [README](https://www.npmjs.com/package/fnf-after-effects-mcp).

**Media defaults the AE skill applies when a provider is connected** — [ae-clean-rig/references/05-media-generation.md in tarball](https://registry.npmjs.org/fnf-after-effects-mcp/-/fnf-after-effects-mcp-0.1.3.tgz):
- "Moving footage | **Seedance 2.5 at 1080p**; Still images | **Nano Banana Pro at 2K**; Explicitly requested override | Soul 2.0 at 2K"
- Generate "a clean plate with no baked-in UI, logos or typography"

**Blender generation defaults** — [blender-generation SKILL.md](https://registry.npmjs.org/fnf-blender-mcp/-/fnf-blender-mcp-0.2.2.tgz):
- "Unclear image-model choice → `image_auto`"; textures/HDRI → `gpt_image_2`
- Video: "ask about quality, speed, audio, and reference needs; silently picking the most expensive studio chain is not a default"
- 3D routes in `blender-volatile`: `tripo_3d`, `meshy_v6_text_to_3d`, `hunyuan3d_v3_1_text_to_3d`, `sam_3_3d`, `sam_3_3d_body`, `tripo_h3_1_image_to_3d`, `tripo_h3_1_multiview_to_3d`, `hunyuan3d_v3_image_to_3d`, `image_to_3d`, `multi_image_to_3d`, `3d_rigging`, `meshy_v5_remesh`.

#### 2f. API-side agent tooling
- **Agent API [pre-20 Sep, missing]**, in the Python SDK 0.2.0 and JS SDK v2:
  - What it is: "The Agent API runs multi-step creative tasks in persistent sessions. Your account must have Agent API access and enough credits for the turn and its generations."
  - Methods: `client.agents.sessions.create()`, `.run(session_id, "…", on_question=…)` (status `completed | failed | awaiting_input`, `result.text`, `result.asset_urls`), `.send()/.messages()/.interrupt()`, and `client.agents.media.upload(...)`
  - Endpoint and waiting: `{base}/v1/agent…`; default wait 30 min; "Mutating calls are not automatically retried, so a timeout does not silently submit another billable turn"
  - Sources: [Python README](https://github.com/higgsfield-ai/higgsfield-client/blob/main/README.md); [JS README](https://github.com/higgsfield-ai/higgsfield-js/blob/main/README.md)
  - The JS README labels it "**V2 preview** … A published package version with this feature has not been verified."
- **`hf-api` [pre-20 Sep, missing]**, from `@higgsfield/cloud-cli` 0.1.2 (16 Jul): "Agent-driven CLI for the Higgsfield generation API", using API-key auth: `export HIGGSFIELD_API_KEY="<api_key_id>:<secret>"`, then `hf-api generate <slug> --param prompt="a red car" --wait` — [npm](https://www.npmjs.com/package/@higgsfield/cloud-cli).
  - This is relevant to the headless-auth limitation in earlier notes (CLI issue #47).
- **Studio template [NEW]:** `app-templates`, based on the platform API — [README](https://github.com/higgsfield-ai/app-templates/blob/main/README.md). Its model files include:
  - `higgsfield-ai/dop/lite`, `higgsfield-ai/soul/cinema`
  - `bytedance/seedance-2.5`, `…/seedance-2.5/video-edit`, `…/video-extend`
  - `kling-video/v3/motion-control/std|pro`, `kling-video/o3/first-last-frame`
  - `minimax/h3`, `alibaba/wan-3.0(-prime)`, `alibaba/happy-horse`, `pixverse/v6`, `lightricks/ltx-2.5`, `blackforestlabs/flux-3/text-to-video`
  - Source: [models folder](https://github.com/higgsfield-ai/app-templates/tree/main/generation/catalog/models)
  - The CLI's `website create` already takes `--template app-detail|preset|studio|custom` for apps — [CLI README](https://github.com/higgsfield-ai/cli/blob/main/README.md).

### Inferences
- **Nothing in the Claude Code plugin skills is new since v0.12.0.** The genuinely new agent capabilities for this user's pipeline are:
  - (a) the **Premiere** and **Resolve Studio** bridges: assembly and color, both limited
  - (b) the AE **VFX cleanup / matte-painting** skills
  - (c) Blender's much richer previs skill set: `blender-camera-blocking` and `blender-greybox`, which exports motion-reference video
  - (d) Marketing Studio V2 presets and Soul styles, once the PRs merge or the live CLI already accepts them
- **Cost of the bridges:** they cost no Higgsfield credits by themselves (local automation). They require licenses for AE, Premiere, PS, AI, Resolve **Studio** (paid) and TouchDesigner (a key). Any generation they trigger goes through the hosted MCP or the CLI and costs credits.
- **Where each works:** the bridges are local stdio servers. They work in **Claude Desktop / Claude Code on the Mac/PC** where the app runs, never in claude.ai web.
- For a Resolve user on the **free** Resolve, the Higgsfield Resolve MCP does not apply, because it requires Studio 21.1. The earlier `samuelgursky/davinci-resolve-mcp` recommendation stands.
- The Agent API is a server-side "Higgsfield agent", not a Claude tool. It could replace parts of the Claude orchestration, but it needs API-key access. Higgsfield has not documented its skills or its cost per turn.

### Gaps
- No prices per model or workflow appear in any repo. The live catalog and `generate cost` require login, which was not done by design.
- The Agent API's per-turn cost and its capabilities (which workflows it can run) are undocumented.
- The Photoshop (78) and Illustrator (45) operation lists were not enumerated; only the counts from the READMEs are reported.
- The exact slash-command names after a working install are uncertain. PR #7 claims "Claude derives `/higgsfield:<skill>` … the slash commands come out identical", but this was not tested here.

---

## 3. Are Higgsfield's web presets (Earth Zoom, Bullet Time, Transitions app, Vibe Motion, Apps/effects, camera-motion presets) reachable by agents now? Does `--preset_id` have documented values?

### Takeaway
**No for the viral web effects. Partly for presets.**
- None of the repos, bridges, open PRs or the Cursor plugin mention Earth Zoom, Bullet Time, Vibe Motion, the Transitions app or the effects catalog.
- `--preset_id` now **has a documented meaning in unmerged staff PRs**: Marketing Studio V2 ad presets (hypermotion, mixed media, SaaS motion, 2D motion, UGC), discovered live with `higgsfield preset list marketing-studio-v2`.
- Soul 2.0 styles get a parallel `--style_id` (`preset list soul-v2`).
- **No literal preset values are published anywhere.** They are live catalog UUIDs.
- The hosted MCP exposes "motion control" as an edit operation and a server-side workflow catalog, but no preset/effects library is named.

### Cited Findings
- A full-text search of all 10 public repos, all PR branches, the public bridge fork and the 8 npm tarballs found **no occurrence** of "earth zoom", "bullet time", "vibe motion", "viral preset", "motion_id" or "higgsfield.ai/apps" — (this research, 26 Sep; repos: [skills](https://github.com/higgsfield-ai/skills), [cli](https://github.com/higgsfield-ai/cli), [cursor-plugin](https://github.com/higgsfield-ai/cursor-plugin)).
- Skills main (v0.12.0) still says "Current public workflows are `draw_to_video` and `reframe`" — [CLAUDE.md](https://github.com/higgsfield-ai/skills/blob/main/CLAUDE.md). Open PR #6 replaces this with "Discover public workflows with `higgsfield workflow list`; all listed workflows support `generate workflow`" — [PR #6](https://github.com/higgsfield-ai/skills/pull/6).
- **`--preset_id` documentation (unmerged, 14–15 Sep)** — [PR #89](https://github.com/higgsfield-ai/cli/pull/89); [PR #6](https://github.com/higgsfield-ai/skills/pull/6):
  - "Each JSON item includes `job_set_type` and `params` with the matching `type` and `preset_id` or `mode_id`… `ugc_v2` selects presets through `--mode_id`; native `ugc` uses `--preset_id` and the returned `delivery_specs`. Presets and `style_id` are separate selections."
  - "Only published, usable preset rows are listed … IDs from the style catalog and recreate presets can refer to different tables, especially for motion."
  - "Missing presets or unavailable preset durations fail instead of returning an assumed price."
- The Cinematic Studio 3.0 / Video V2 `--preset_id` (from earlier notes) is still undocumented in MODELS.md on main — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md).
- **Web Marketing Studio context** (snippets): the new Marketing Studio has "1,500+ template options", and "The Motion category covers Hypermotion, 2D Product Motion, Mixed Media, and Motion Design, with videos up to 15 seconds per generation" — [Higgsfield blog: new Marketing Studio](https://higgsfield.ai/blog/new-marketing-studio-higgsfield); [Marketing Studio stack blog](https://higgsfield.ai/blog/marketing-studio-video-2) (snippets; dates not visible).
- **Hosted MCP**: its edit operations include "upscale, outpaint, reframe, background removal, **motion control**, voice change, or dubbing", and its canonical workflows cover "faceless videos, UGC formats, narration, subtitles, thumbnails, brand kits, and character sheets". Neither list mentions effects or viral presets — [Cursor /higgs](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/commands/higgs.md).
- **Platform-API DoP.** The new Studio template registers DoP as `videoModel("dop", "DoP", { start: 1 }, { image: "higgsfield-ai/dop/lite" })`, with only a start image and no motion-preset parameter — [dop.ts](https://github.com/higgsfield-ai/app-templates/blob/main/generation/catalog/models/dop.ts). The same template exposes **Kling 3.0 Motion Control** (std/pro) — [kling-3.ts](https://github.com/higgsfield-ai/app-templates/blob/main/generation/catalog/models/kling-3.ts).
- **The TouchDesigner bridge** "does not include Workshop preset execution" — [README](https://www.npmjs.com/package/@higgsfield_org/touch-designer-mcp).
- **A third-party claim repeats (snippet):** the MCP comes with "signature effect templates including the bullet time, earth zoom, and transition libraries". This is phrased as product context, not as MCP-callable tools — [search summary via claudefa.st / mcp.directory](https://mcp.directory/blog/higgsfield-mcp-guide) (snippet; unverified).
- **Unofficial route (old, third-party):** `AKCodez/higgsfield-claude-skills` (Apr 2026) drives the Higgsfield **web UI with Playwright** through 19 Claude Code skills. Browser automation of the web app carries ToS and breakage risk — [repo](https://github.com/AKCodez/higgsfield-claude-skills).

### Inferences
- **Template rule stays:** Earth Zoom, Bullet Time and Transitions are still manual web-app steps. Alternatively, recreate them with prompts and parameters (earlier notes' Cinematic Studio axes, speed ramps, start/end frames).
- For **product ads**, Marketing Studio V2 "Motion" presets (Hypermotion etc.) are the closest agent-reachable "preset" feature. The CLI already has `preset list`. Whether `marketing-studio-v2` works in 1.1.26 depends on the "backend rollout". The user can check that at no cost with `higgsfield preset list marketing-studio-v2 --json` (a read-only listing).
- "Motion control" on the hosted MCP most likely means motion transfer (Kling-style), not camera presets. Unverified.

### Gaps
- Whether `higgsfield preset list marketing-studio-v2` / `soul-v2` already works with CLI 1.1.26 could not be tested (no login).
- The hosted MCP's full workflow catalog (the output of `get_workflow_instructions` with no argument) is not public; it needs an authenticated MCP session.
- No 2026 source says the viral effects library will come to MCP or CLI.

---

## 4. Documented hosted-MCP tool names (exact)

### Takeaway
Higgsfield's own Cursor plugin, its skills and user bug reports document these names:
- **Generation:** `generate_image`, `generate_video`, `generate_audio`
- **Discovery:** `models_explore`, `get_workflow_instructions`
- **Jobs:** `jobs_wait`, `job_status`, `job_display`
- **Uploads:** `media_upload`, `media_confirm`
- **Account and billing:** `balance`, `transactions`, `show_plans_and_credits`, `list_workspaces`, `select_workspace`
- **Browse and widgets:** `show_generations`, `show_characters`, `show_medias`, `show_marketing_studio`
- **Analysis:** `virality_predictor`
- **Explainer:** `get_explainer_presets`, `resolve_explainer_preset`, `list_voices`, `explainer_video`

Two request details matter for cost control. The generate tools take an optional **`get_cost: true`**, and they expect a **nested `params` object**.

In Claude Code, with the server registered as `higgsfield`, tools appear as `mcp__higgsfield__<tool>`. So the template's `mcp__higgsfield__generate_video` happens to be right, but the list is incomplete.

### Cited Findings
| Tool name | Purpose (as documented) | Source and date |
|---|---|---|
| `generate_image`, `generate_video` | generation; "return a job" | Cursor plugin, initial commit 2026-05-13 and current `/higgs` (2026-08-22) — [initial commit](https://github.com/higgsfield-ai/cursor-plugin/commit/7d99efb); [higgs.md](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/commands/higgs.md) |
| `generate_audio` | audio generation | current `/higgs` (2026-08-22) — [higgs.md](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/commands/higgs.md) |
| `models_explore` | "when the model or its parameters are unclear"; "Don't invent model names… call `models_explore` first" | [higgs.md](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/commands/higgs.md); [rules, 2026-05-13](https://github.com/higgsfield-ai/cursor-plugin/commit/7d99efb) |
| (batch generation tool; name not given) + `jobs_wait` | "Several independent generations → use the matching batch generation tool and follow its `jobs_wait` and display protocol" | [higgs.md](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/commands/higgs.md) (2026-08-22) |
| `get_workflow_instructions` | "call … with no workflow first to discover the current catalog, then load and follow the matching canonical workflow" | [higgs.md](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/commands/higgs.md) (2026-08-22) |
| `job_status`, `job_display` | "Poll with `job_status` until completion, then render with `job_display`"; "Don't poll more often than every few seconds" | [rules/higgsfield-usage.mdc, 2026-05-13](https://github.com/higgsfield-ai/cursor-plugin/commit/7d99efb) (removed later; may be superseded by `jobs_wait`) |
| `media_upload`, `media_confirm` | "run `media_upload` → `media_confirm` first … Skipping `media_confirm` will produce an unusable handle" | [rules, 2026-05-13](https://github.com/higgsfield-ai/cursor-plugin/commit/7d99efb); still used until the skills were removed on 2026-08-22 — [commit 5f294c1](https://github.com/higgsfield-ai/cursor-plugin/commit/5f294c1) |
| `balance`, `show_plans_and_credits`, `transactions` | "For quota / balance errors, check `balance` and link the user to `show_plans_and_credits`" | [rules, 2026-05-13](https://github.com/higgsfield-ai/cursor-plugin/commit/7d99efb); pre-22-Aug `/higgs` |
| `list_workspaces`, `select_workspace` | pick the workspace once per session | [rules, 2026-05-13](https://github.com/higgsfield-ai/cursor-plugin/commit/7d99efb) |
| `show_generations`, `show_characters`, `show_medias` | library browsing | pre-22-Aug `/higgs` and the initial commit — [commit 5f294c1 parent](https://github.com/higgsfield-ai/cursor-plugin/commit/5f294c1) |
| `show_marketing_studio` | Marketing Studio widget ("widget action `fetch`" for URL import) | [skills marketing-modes.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/marketing-modes.md); Cursor plugin 2026-05-13 |
| `virality_predictor` | virality scoring (MCP name; the CLI job is `brain_activity`) | pre-22-Aug `/higgs` ("Virality → `virality_predictor`"); now "the MCP virality analysis tool selected by its current description" — [higgs.md](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/commands/higgs.md) |
| `get_explainer_presets`, `resolve_explainer_preset`, `list_voices`, `generate_audio`/`seed_audio`, `generate_video`/`gemini_omni`, `job_status`, `explainer_video` | "MCP workflow operation" ↔ CLI mapping for the explainer | [video-explainer SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-video-explainer/SKILL.md) **[known]** |

- **Request shape, a user report [NEW, 20 Sep]:**
  - "`tools/list` returns the generate tools with an inputSchema of just `{"type": "object"}`", while "the validator … expects a required nested `params` object". Every call from the **Claude desktop custom connector** failed with `params: Invalid input`, and nothing was charged.
  - "Read-only tools on the same connection work": `models_explore`, explainer presets, balance.
  - Workaround used: the CLI.
  - Source: [#93](https://github.com/higgsfield-ai/cli/issues/93)
- **Cost flag, a user report [NEW, 25 Sep]:**
  - "Paid `generate_*` MCP tools charge on submit, before the agent sees a price. **`get_cost:true` exists but is optional**, and the submit response does not include the charge."
  - Proposal: `max_credits`, `{credits_charged, job_id}` in submit responses, and an `idempotency_key`.
  - Source: [#95](https://github.com/higgsfield-ai/cli/issues/95)
- **Conflict:** #95 describes "Claude Code on the hosted MCP server" successfully submitting 20 Seedance jobs on **22 Sep**. That contradicts #93's "every call fails" from the Claude desktop connector on **20 Sep**. The failure may depend on the client, or it may have been fixed in between. Unresolved — [#93](https://github.com/higgsfield-ai/cli/issues/93); [#95](https://github.com/higgsfield-ai/cli/issues/95).
- **Tool lists are live.** Tools "are discovered when your MCP client connects (often after authentication), so they are not enumerated on this public page" — [MCPBundles listing](https://www.mcpbundles.com/skills/higgsfield-mcp) (snippet). Cursor's `/higgs` likewise says "use the current Higgsfield MCP tool descriptions as the source of truth" — [higgs.md](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/commands/higgs.md).
- **OAuth history:** #68 "MCP OAuth fails RFC 9207 issuer validation — mcp.higgsfield.ai forwards Clerk's iss unmodified" (opened 21 Aug, **closed 3 Sep**) — [#68](https://github.com/higgsfield-ai/cli/issues/68).

### Inferences
- The permission list in the template can be made concrete. With the server added as `higgsfield`:
  - `ask` should cover at least `mcp__higgsfield__generate_image`, `…generate_video` and `…generate_audio`, plus the explainer assembler if it is exposed as a tool (`…explainer_video`).
  - A regex hook should also catch unknown batch or workflow tools, e.g. `^mcp__higgsfield__(generate_|explainer_video|virality_predictor|.*batch)`.
  - Read-only tools can be allowed: `models_explore`, `balance`, `get_workflow_instructions`, `show_*`, `list_*`.
  - The real list must still be checked with `/mcp`, because tool lists are live and change (`job_status` → `jobs_wait`).
- **Transport choice:** the hosted MCP is currently the less reliable and less budget-safe path (no per-call cap, charge on submit, no idempotency, possible schema failures). **The CLI remains the better execution path in Claude Code**, with the MCP used for read-only lookups.

### Gaps
- The official complete tool list and the exact name of the batch tool were not verifiable, because enumeration requires an authenticated MCP session.
- Whether `get_cost` returns a price without charging, and its exact field name in the current schema, is known only from the #95 reporter.
- Whether `virality_predictor` and the `explainer_video` assembly are charged is not documented.
- The #95 postmortem and hook gists (gist.githubusercontent.com) are blocked by policy and could not be read.

---

## 5. Guidance inside the skills and bridges that conflicts with or improves the CLAUDE.md template

### Takeaway
Six findings bear on the template:
1. **The "Don't pre-estimate cost" rule is contradicted by Higgsfield's own newer material.** The bridge skills written on 23 Sep mandate a non-spending estimate and stop if the cost is unknown; AE matte-painting adds hard attempt caps; the COOKBOOK says "cheap-first". The template's budget override is therefore aligned with Higgsfield's direction.
2. **The Claude Code plugin install in the template's baseline is broken** (PR #7).
3. **Multi-line CLI prompts get silently truncated** (#94).
4. **The hosted MCP bills on submit, with no cap or idempotency** (#95, a 792-credit incident on 22 Sep).
5. **The bridges bring strong QA language** worth copying.
6. **The model defaults moved:** GPT Image 2.5 / Seedance 2.5, plus Kling 3.0 Turbo, Grok Video 1.5 and Gemini Omni as new options. Some Higgsfield docs are stale on this, notably the README quick-reference and evals.

### Cited Findings
**Cost and budget**
- **The generate skill's rules (unchanged).** Rule 5: "Don't pre-estimate cost or optimize for cheaper models unless the user asks. Prefer the quality default first." Rule 2: "Don't narrate 'calling higgsfield cost'" — [generate SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md) **[known]**.
- **Higgsfield's Blender skill** says the opposite (23 Sep, **[NEW]**) — [blender-generation SKILL.md in tarball](https://registry.npmjs.org/fnf-blender-mcp/-/fnf-blender-mcp-0.2.2.tgz):
  - "Obtain a non-spending estimate for the effective model, inputs and quality settings… **If cost cannot be established, do not submit a paid job to discover it.**"
  - "Report the asset, model, settings and estimated cost… an exceeded budget stops spend"
  - "Do not automatically retry an uncertain submission… If it cannot be reconciled, report uncertainty instead of creating another paid job"
  - "slow generation is not grounds to duplicate it"
- **Higgsfield's AE matte-painting skill** (23 Sep, **[NEW]**) — [ae-matte-painting SKILL.md + source-conditioned-generation.md in tarball](https://registry.npmjs.org/fnf-after-effects-mcp/-/fnf-after-effects-mcp-0.1.3.tgz):
  - "Estimate before the first submission as jobs by duration by model tier… obtain approval before the first spend"
  - "The default budget is **three attempts per generated layer** and a job total of three times the number of generated layers… Only the user can raise it… **never above five**"
  - Each retry needs "a materially different correction… A rewording is not one, a change of seed, resolution or duration alone is not one"
  - "Iterate at the provider's cheapest resolution that still shows the registration cues, promote only accepted layers to the delivery resolution"
- **The skills repo is internally inconsistent** on cost:
  - COOKBOOK: "**Cheap-first iteration.** Test cheap models (`flux`, `z_image`) for prompt iteration; switch to expensive … only on confirmed direction" — [COOKBOOK.md](https://github.com/higgsfield-ai/skills/blob/main/COOKBOOK.md)
  - workflows.md: "If the user asks 'how much will this workflow cost?', run cost first and report credits before creating" — [workflows.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/workflows.md)
  - PR #6: "use preset defaults for motion cost estimates" — [PR #6](https://github.com/higgsfield-ai/skills/pull/6)
- **The 22 Sep incident [NEW]** — [#95](https://github.com/higgsfield-ai/cli/issues/95):
  - "20 paid Seedance submissions, 11 auto-refunded as failed, 9 charged, **792 credits net**… nothing on the server side could have capped it"
  - The reporter offers a "Claude Code PreToolUse/PostToolUse hook that forces a priced preflight, caps per-call and per-session spend, and blocks identical resubmits". That gist could not be read.
  - The reporter also says: "Your docs recommend the CLI for Claude Code." Not verified in primary docs.
- **Billing semantics are undocumented** [pre-20 Sep, missing]. #91 asks whether "one invocation create[s] exactly one billable job", whether "the CLI retry[s] generation requests after timeouts", whether "an idempotency key [is] supported", and "an authoritative way to retrieve actual charges". Unanswered — [#91](https://github.com/higgsfield-ai/cli/issues/91).

**Install**
- **Claude Code plugin install fails [pre-20 Sep, missing; still open 26 Sep].**
  - "`claude plugin install higgsfield@higgsfield` failed with: This plugin's marketplace entry is invalid: skills: Invalid input … Verified against Claude Code 2.1.271". The fix (unmerged) turns `skills` into an array of paths.
  - "Codex's parser accepts the object form … only the Claude side is affected"
  - Source: [PR #7](https://github.com/higgsfield-ai/skills/pull/7)
- **The manual Claude path is also wrong.** "the documented single `git clone … ~/.claude/skills/higgsfield` nests every SKILL.md one level too deep and none of the 8 skills are found". The fix: clone elsewhere and symlink each `higgsfield-*` folder into `~/.claude/skills/` — [PR #8](https://github.com/higgsfield-ai/skills/pull/8).
- **Working routes per the docs:**
  - `npx skills add higgsfield-ai/skills` ("recommended, cross-agent")
  - `gh skill install higgsfield-ai/skills` (GitHub CLI v2.90+)
  - `./setup`, which "symlinks each skill subdirectory into place"
  - Sources: [README](https://github.com/higgsfield-ai/skills/blob/main/README.md); [INSTALL.md](https://github.com/higgsfield-ai/skills/blob/main/INSTALL.md)

**Prompts**
- **Multi-line prompt truncation [NEW, 23 Sep]** — [#94](https://github.com/higgsfield-ai/cli/issues/94):
  - "When a multi-line prompt string is passed to `generate create` (e.g. via `--prompt "$(cat prompt.txt)"`) … only the text **before the first blank line** is actually used … no warning"
  - "In one measured case only ~1,100 characters of a ~6,000-character prompt were effective"
  - Affected: "structured video prompts: anchor block, camera, timed beats"
- **Prompt rules unchanged [known]:** image-to-video prompts should describe motion only, and Seedance 2.x / Kling 3.0 take start and end frames — [prompt-engineering.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/prompt-engineering.md).
- **Hosted MCP guidance** — [higgs.md](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/commands/higgs.md); [rules 2026-05-13](https://github.com/higgsfield-ai/cursor-plugin/commit/7d99efb):
  - "Do not turn a generic generation request into a complex workflow. Do not invent tool names, model IDs, parameters, workflow steps, or defaults when MCP can provide them. Follow typed recovery guidance instead of retrying an unchanged failed call."
  - "surface the actual error… Don't retry silently or hallucinate a result"

**Models**
- **Defaults as of 11 Sep** **[known]**: GPT Image 2.5 (image), Seedance 2.5 (video; 2.0 for native 4K), Nano Banana 2/Lite/Pro, Seed Audio 1.0. Kling 3.0 is the lower-cost option, and Kling 3.0 Turbo "if the user explicitly asks for Turbo, faster, or lower-cost". Cinema Studio Video 3.0 is for "cinema-grade highest fidelity" — [generate SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md).
- **Stale docs conflict:**
  - README quick-reference: "Image-to-video animation … Prefer `seedance_2_0` with `--start-image`; use `kling3_0` as lower-cost fallback" — [README](https://github.com/higgsfield-ai/skills/blob/main/README.md)
  - eval scenario 2: "Picks `kling3_0` (default for image-to-video) or `seedance_2_0`" — [evals/scenarios.md](https://github.com/higgsfield-ai/skills/blob/main/evals/scenarios.md)
  - The SKILL.md defaults to Seedance 2.5 for image-to-video.

**Verification and QA doctrine (all 22–23 Sep, [NEW])**
- **AE:**
  - "verify the actual downloaded dimensions and duration rather than trusting the wording of the prompt"; "Review the whole returned clip for unwanted motion and temporal defects" — [05-media-generation.md](https://registry.npmjs.org/fnf-after-effects-mcp/-/fnf-after-effects-mcp-0.1.3.tgz)
  - "A plausible layer viewed alone, or a matching first frame, is not evidence"
  - temporal QA with "a review movie, whole-duration playback or a labeled frame strip"
  - "an approval given before a detected defect was disclosed is not acceptance"
  - Sources for the last three: [ae-matte-painting](https://registry.npmjs.org/fnf-after-effects-mcp/-/fnf-after-effects-mcp-0.1.3.tgz)
  - "If the same failure recurs without new evidence, change the construction… **another generation is not a diagnosis**" — [ae-cleanup](https://registry.npmjs.org/fnf-after-effects-mcp/-/fnf-after-effects-mcp-0.1.3.tgz)
- **Media manifest (AE):** "A portable project needs a media manifest listing, per asset: the local relative filename, its purpose … the actual provider and model, the requested configuration, the returned dimensions and duration, a generation identifier … Never put credentials, access tokens or expiring signed URLs into the manifest" — [05-media-generation.md](https://registry.npmjs.org/fnf-after-effects-mcp/-/fnf-after-effects-mcp-0.1.3.tgz).
- **Premiere:** "Read `sequence.info`, `track.list`, and affected `clip.list` pages after edits … API success is not visual or audio proof … Check the output exists and decodes; verify duration, dimensions, streams, representative frames, and audio" — [premiere-assembly](https://registry.npmjs.org/@higgsfield_org/premiere-mcp/-/premiere-mcp-0.1.3.tgz).
- **Resolve:** "Pass the exact project, timeline, clip, and local version identifiers … inspect the image and scopes after each grade change … A failed or timed-out write may have changed Resolve: inspect before retrying" — [davinci-film-colorist SKILL.md](https://registry.npmjs.org/@higgsfield_org/davinci-resolve-mcp/-/davinci-resolve-mcp-0.1.1.tgz).

**Explainer and ad workflows** (improvements, **[known]** except the V2 presets)
- **Explainer:**
  - "Research real topics before scripting"; "Write all image/video prompts in English"; "Assemble automatically in the same run. Returning loose clips is a failure"
  - subtitles 0.05 credit per voiced block; style choice via the live preset catalog is "mandatory"
  - Source: [video-explainer SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-video-explainer/SKILL.md)
- **UGC/ad batch:** COOKBOOK Recipe 2 fires **four paid Marketing Studio jobs in parallel** (`&` … `wait`), which conflicts with per-job approval gates. Its advice "Test 4 hooks × 1 mode before testing 1 hook × 4 modes" is useful — [COOKBOOK.md](https://github.com/higgsfield-ai/skills/blob/main/COOKBOOK.md).

### Inferences — concrete template edits for the report writer
1. **Budget section.** Keep the override and cite Higgsfield's own `blender-generation` and `ae-matte-painting` rules as backing. Adopt their three rules:
   - "no estimate → no paid job"
   - "3 attempts per shot/layer, hard ceiling 5, raise only before the first attempt"
   - "a retry must change the input class (model, reference, decomposition), not just wording, seed or resolution"
2. **Resubmit rule.**
   - After a timeout or uncertain response, run `higgsfield generate list --json` or `generate get <id>`, or on the MCP use `jobs_wait`/`job_status`, before any new submit.
   - Never resubmit an identical call.
   - The template already has "nie denselben Job doppelt senden" ("never send the same job twice"). Extend it to the MCP path and name the 792-credit example.
3. **MCP path.**
   - Prefer the CLI for all paid jobs in Claude Code. Allow the hosted MCP for read-only tools (`models_explore`, `balance`, `get_workflow_instructions`, `show_*`).
   - If the MCP is used for generation, require a `get_cost: true` preflight first, if the live schema offers it.
   - Replace the placeholders with the real names and widen the hook regex (see Q4). Verify with `/mcp`.
4. **Bash hook regex.** Beyond `generate (create|workflow)`, also catch:
   - `product-photoshoot create`, `marketplace-cards create`, `soul-id create`, `marketing-studio dtc-ads generate`
   - `hf-api generate`, if the API-key CLI is used
   - Keep `generate cost` and `--cost-only` unblocked.
5. **Prompt rule (new).** Pass prompts to the CLI as a single paragraph with no blank lines. Keep the structure with inline labels, e.g. `CAMERA: … ACTION 0–3 s: …`. Log the prompt length. #94 is unresolved.
6. **Install note (new).**
   - Do not use `/plugin install higgsfield@higgsfield` until PR #7 is merged.
   - Use `npx skills add higgsfield-ai/skills`, or the repo's `./setup`, which symlinks per skill.
   - The third-party fork TheNeuralCube (25 Sep) fixes the manifest but is unofficial.
7. **Model list.**
   - Current defaults: Seedance 2.5 for video, and Seedance 2.0 only for native 4K.
   - Add Kling 3.0 Turbo as the cheapest fast option, Grok Video 1.5 for stylized I2V, and Gemini Omni Flash for multi-reference.
   - The template's "Veo 3.1 für Dialog-Nahaufnahmen" (Veo 3.1 for dialogue close-ups) is not contradicted by the skills, but it is not backed by them either.
8. **QA section.** Add these points:
   - decode-verify the downloaded file (dimensions, duration)
   - "a matching first frame is not evidence"
   - a review movie or labeled frame strip for motion
   - user acceptance only after defects are disclosed
   - a per-asset media manifest (provider, model, requested vs returned specs, job id; no signed URLs)
9. **Post/NLE.** Optional new local tools:
   - The Higgsfield Premiere MCP handles import, sequence and assembly (no transitions, captions or effects).
   - The Higgsfield Resolve MCP handles **Studio 21.1 only**, and only Color-page CDL, LUT and versions. Rules: `dr_create_version` before changes, and after a timeout `dr_acknowledge_uncertain` without an automatic retry.
   - The AE bridge now covers VFX cleanup and matte-painting.
   - Blender adds `blender-camera-blocking` and `blender-greybox` for previs and motion-reference renders.
   - All of these run only locally, in Claude Desktop or Claude Code.
10. **Explainer and ads.**
    - Use `higgsfield-video-explainer` for complete narrated non-photoreal explainers, since it assembles server-side.
    - For product ads, use Marketing Studio (and V2 presets once available). Run COOKBOOK-style parallel batches only after one approved test job.

### Gaps
- Whether `--output-dir` (COOKBOOK) is a real CLI flag. It is not in the flag table; `higgsfield generate create --help` would confirm.
- Whether `higgsfield generate get <id> --json` shows the effective (possibly truncated) prompt was not tested.
- No Higgsfield maintainer response to #91–#95 existed at check time (0 comments), so billing and idempotency semantics remain officially undocumented.

---

## 6. Demo media in the repos and packages: frame-based inspection

### Takeaway
**There is no demo video or GIF** in any of the 10 public `higgsfield-ai` repos, the public bridge fork, or the 8 Higgsfield npm packages, and none of the READMEs embed video (github.com user-attachments, raw or objects.githubusercontent).

The only visual demo material consists of still images:
- a CLI help-screen screenshot
- 11 render previews of the new Blender stylized-materials skill
- the Photoshop "deslop" reference and evidence images

These stills were inspected; there are no frame sequences to analyze. Higgsfield's own demo videos live on higgsfield.ai, X and YouTube, all blocked here.

### Cited Findings
- **The search found no video or GIF files.** `find` over all clones and unpacked tarballs for `*.mp4 *.webm *.gif *.mov *.m4v` returned **zero files**. The only images found are listed below (this research, 26 Sep; repos: [skills](https://github.com/higgsfield-ai/skills), [cli](https://github.com/higgsfield-ai/cli); tarballs: [Blender](https://registry.npmjs.org/fnf-blender-mcp/-/fnf-blender-mcp-0.2.2.tgz), [Photoshop](https://registry.npmjs.org/@higgsfield_org/photoshop-mcp/-/photoshop-mcp-0.1.2.tgz)):
  - `cli/demo.png`
  - `skills/assets/logo.png`
  - `omagotchi/preview.png` and `default-sheet.png`
  - `cursor-plugin/assets/logo.png`
  - Blender `blender-stylized-materials/assets/previews/*.png` (11) and `cube-preview.png`
  - Photoshop `ps-deslop/assets/**.jpg` (reference and evidence images)
- **`cli/demo.png`** (frame-based: one still) — [demo.png](https://github.com/higgsfield-ai/cli/blob/main/demo.png):
  - A dark terminal screenshot with a yellow-green dot-matrix logo and the heading "Higgsfield CLI — All top image and video models in one place".
  - Usage `hf <command> [flags]`, with commands `auth, model, upload, gen, product-photoshoot, soul-id, ms, account, workspace, version`. Examples: `hf auth login`, `hf model list --video`, `hf gen create <model> --prompt "..." --image <upload_id>`.
  - It is **outdated**: current binaries are `higgsfield`/`higgs` with `generate`/`marketing-studio` subcommands ([npm bin](https://registry.npmjs.org/@higgsfield/cli)). Skills PR #4 (4 May) renamed "hf->higgsfield" ([PR #4](https://github.com/higgsfield-ai/skills/pull/4)). No quality artifacts; purely a UI screenshot.
- **Blender stylized-material previews** (frame-based: 11 stills, each a 384×384 RGBA PNG, tiled 4×3 into `scratchpad/videos/blender_stylized_previews_sheet.png`) — [Blender tarball](https://registry.npmjs.org/fnf-blender-mcp/-/fnf-blender-mcp-0.2.2.tgz):
  - **What every frame shows:** the same scene, one cube on a thin dark plinth against a dark vignette background, with soft key light from the upper left.
  - **Per material** (mapping by alphabetical file order):
    - BACKGROUND: mint, mottled
    - CANVAS: lavender, fine grain
    - CEL: flat peach with a soft terminator
    - COMIC_PULSE: red front, orange top, and a side face covered in blue halftone dots
    - DRYBRUSH: tan with brown blotches
    - HALFTONE: light blue with a diagonal line/dot screen on the side
    - MANGA: off-white with fine hatching
    - METAL: pale chrome with dark edge reflections
    - NEON: deep blue with a bright rim or edge glow
    - PAINT: soft pale yellow
    - WATERCOLOR: pale cyan with a mottled wash
  - **Quality:** clean renders with no visible aliasing or noise at this size. Outline or ink effects are not clearly visible at 384 px.
  - **Relevance:** these are material swatches only, with no motion. They show the non-photoreal looks the new `blender-stylized-materials` skill can apply (addon zip + `materials.blend` bundled), which could suit explainer or previs styles.
- **Photoshop `ps-deslop` coverage overview** (frame-based: one still; 4096×1728 JPEG, 2.37:1, downscaled for viewing to `scratchpad/videos/ps_deslop_wall_overview.jpg`) — [ps-deslop temple-coverage-case.md in tarball](https://registry.npmjs.org/@higgsfield_org/photoshop-mcp/-/photoshop-mcp-0.1.2.tgz):
  - **Content:** a photoreal, misty autumn mountain temple scene with a stone stairway, a lantern, a pine tree and a near building on the right. The source file is named `hf_20260910_202510_….png`, so it is a Higgsfield generation from 10 Sep 2026.
  - **Annotations:** coloured ROI boxes (T1–T6 roof tiers, M1–M2, B1–B6, F1–F4 facade panels, R1–R3 right wall) mark plain-wall regions for AI-artifact cleanup. The skill text calls the map "process evidence", "not a default recipe", and a "coverage map, not renewed quality acceptance".
  - **Visible quality:** a plausible image overall. The boxed flat wall panels are exactly where the skill targets generator "slop" (streaks, cloud-like mottling). It is not a before/after comparison.

### Inferences
- The assignment's frame-by-frame video check cannot be done from Higgsfield's GitHub or npm material. Demo videos would need the blocked higgsfield.ai, X or YouTube, or a local run, which was out of scope (no credits).
- The deslop and stylized-material assets are useful signals of *what Higgsfield considers typical generator defects*: flat surfaces with streaks and mottling. That supports adding a "flat-surface slop" check to the template's still-frame QA.

### Gaps
- No Higgsfield demo videos (for example of the Premiere/AE bridges, Marketing Studio V2 Hypermotion or explainer outputs) were reachable, so no motion-quality assessment is possible.
- The other `ps-deslop` images were not individually inspected. There are 144 JPGs in total under `assets/`: 38 reference photos, 7 contact sheets, plus evidence, failure and color-reference images. They are look-reference and failure libraries, not demos.
