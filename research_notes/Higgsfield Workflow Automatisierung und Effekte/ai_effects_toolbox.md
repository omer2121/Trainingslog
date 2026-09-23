# AI-video effects toolbox for a Claude + Higgsfield workflow (VFX, transitions, motion graphics/titles/captions, color/looks, sound): what Claude can trigger, state 23 Sep 2026

**Method note (read first).**
- This session's proxy blocked almost every vendor and review site: higgsfield.ai, x.com, reddit.com, youtube.com, runway.com, lumalabs.ai, fal.ai, elevenlabs.io, seed.bytedance.com, ai.google.dev, artlist.io, techsy.io, segmind, buildfastwithai and others.
- **[verified]** marks an item read in full from a primary source that could be reached:
  - GitHub repositories cloned or read raw: `higgsfield-ai/cli` and `higgsfield-ai/skills` (both last commit 11 Sep 2026), `higgsfield-ai/fnf-local-pluging-bridge-mcp` (last commit 23 Sep 2026), plus the Runway, Luma, Remotion, HyperFrames, ElevenLabs, MMAudio, HunyuanVideo-Foley, ThinkSound, sonic-match and FFmpeg repos
  - npm registry records
  - claude.com connector pages
- Everything else comes from **search-engine summaries** ("snippet"). Its exact wording could not be checked on the page. When one summary merged several results, the attribution is a best guess.
- About 39 web searches were used.
- This file adds to, and does not repeat, `../Higgsfield Workflow Resolve vs Adobe/` (`higgsfield.md`, `end_to_end_pipeline.md`, `adobe_mcp.md`, `davinci_resolve_mcp.md`, `blender_ai_pipeline.md`). Those files are cross-referenced where relevant.
- Dates of X/TikTok posts were decoded from their post IDs.

---

## 0. Objective: the categorized effects toolbox (summary matrix)

### Takeaway
As of September 2026, Claude can drive most effect categories. There are two exceptions:
- Higgsfield's famous one-click web "Effects/Viral presets/Transitions/Vibe Motion" catalogs, which are **not exposed in Higgsfield's official CLI, skills or (as far as documented) MCP**
- creative color work beyond LUT/CDL, meaning film-emulation plugins, wheels and curves

The practical "instructions-only" stack is:
1. **Higgsfield CLI/MCP** for generation, using in-generation style axes (camera style, light scheme, color look, speed ramps), first/last frames, Draw-to-Edit, deflicker, LUT, upscaling and audio
2. **Runway MCP (Aleph 2.0)** or fal/Replicate MCPs for prompt-based VFX edits
3. **HyperFrames or Remotion skills** for titles, captions, overlays and code transitions
4. **Higgsfield's new local After Effects MCP plus skills** for real AE comps, cleanup and matte paintings
5. **Resolve Studio 21.1 MCP** for LUT/CDL, dissolves and renders
6. **ElevenLabs skills/CLI** (or Seed Audio via Higgsfield) for SFX and music

### Cited Findings
Legend for "Claude route":
- **H-MCP**: hosted MCP / Claude connector
- **L-MCP**: local MCP
- **CLI**: a command-line tool Claude Code runs
- **API**: Claude Code writes a script against a REST API or SDK
- **SKILL**: agent skill
- **MANUAL**: no agent route found

| Effect category | Best tools/methods (Sept 2026) | Result quality (reviews/creators) | Cost indications | Claude route | Key sources |
|---|---|---|---|---|---|
| Camera-move and "viral" VFX presets (bullet time, earth zoom, crash zoom, FPV, explode/melt) | Higgsfield web Effects/Viral presets/Motion presets; Pikaffects (62 effects); Kling effect templates | One-click, trend-oriented social look (snippets; no 2026 critical review found) | Per-generation credits; not verified | Higgsfield presets: **MANUAL** (web), since the official CLI/skills have none. Higgsfield DoP `motion_id` presets are reachable via the Cloud API through **unofficial** MCPs. Kling effects: **API**. Otherwise: prompt camera language via CLI/MCP | [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) [verified]; [QalaLabs MCP](https://github.com/QalaLabs/claude-higgsfield-mcp) [verified]; [Kling effects API](https://kling.ai/document-api/api/effects/video-effects); [Pika review](https://videoai.me/blog/pika-ai-review-2026) |
| In-generation look, light and camera style, speed ramps | Higgsfield Cinematic Studio Video 3.5 style axes (`camera_style`, `light_scheme`, `color_grading`, `genre`); Cinematic Studio 3.0 `speedramp` | Higgsfield calls Cinema Studio 3.0 "Top-tier cinema-grade execution" (vendor) | Credits (`higgsfield generate cost`) | **CLI** [verified]; MCP likely, since the skills map MCP ops 1:1 to CLI (inference) | [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md); [model-catalog.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/model-catalog.md) |
| Prompt-based VFX edits of existing clips (relight, weather, restyle, swap/add/remove objects, new angles) | Runway **Aleph 2.0** (21 May 2026); Luma **Ray 3.2 Modify** (9 Jun 2026); **Kling O3** (Feb 2026, 4K upgrade 17 Jun 2026); **Seedance 2.5 edit**; Wan 2.7 edit; Gemini Omni Flash; Higgsfield Draw-to-Edit | Aleph 2.0 is most often named the editing leader (snippets). Kling O3 is limited on adding actions and removing objects (conflicting snippets) | Aleph 2.0 API ≈ $0.28/s; Ray 3.2 on fal ≈ $0.20/s (snippets) | Aleph: **L-MCP** (official Runway MCP `runway_editVideo`, default `aleph2`; self-hostable as a remote connector) or Replicate **H-MCP**. Higgsfield: **CLI** `draw_to_video`, `gemini_omni` with video ref, `seedance_2_5 --mode omni_reference`. Ray 3.2/Wan/Kling O3: **API** or fal's hosted MCP (claimed official, unverified). The Luma official MCP lacks Ray 3.2 | [Runway MCP](https://github.com/runwayml/runway-api-mcp-server) [verified]; [Luma MCP](https://github.com/lumalabs/luma-api-mcp) [verified]; [CLI README](https://github.com/higgsfield-ai/cli) [verified] |
| VFX cleanup and compositing (wire/object removal, sign replacement, matte painting, keying) | After Effects driven by Higgsfield's local AE MCP with the `ae-cleanup` and `ae-matte-painting` skills; Higgsfield `video_background_remover`, `sam_3_video`; Aleph 2.0 | Unproven; the skill itself says "Do not promise a finished shot before reviewing it" | AE licence plus generation credits | **L-MCP + SKILL** (AE), **CLI** (Higgsfield utilities) | [fnf bridge repo](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp) [verified] |
| Transitions | AI morphs via first/last frame (Kling 3.0, Seedance 2.x, Cinematic Studio, Wan 2.7, Veo 3.1 Lite, Hailuo); Higgsfield Transitions app (web); FFmpeg `xfade` (58 built-ins); HyperFrames shader transitions; AE `ae-transition-kit`; Resolve 21.1 dissolves | AI morphs work best when both frames share subject, scale and composition (Kling/Seedance guides) | Credits per clip; code transitions free | **CLI** (`--start-image/--end-image`), **SKILL** (HyperFrames/Remotion), **L-MCP** (AE, Resolve Studio). Higgsfield Transitions app: **MANUAL** | [SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md) [verified]; [vf_xfade.c](https://github.com/FFmpeg/FFmpeg/blob/master/libavfilter/vf_xfade.c) [verified] |
| Motion graphics, titles, kinetic type, lower thirds, overlays | **HyperFrames** (skills + hosted Claude connector); **Remotion** skills; AE via Higgsfield local MCP or cloud bridge, or community AE MCPs; Higgsfield **Vibe Motion** (web) | Creators report recreating reference motion graphics "in a couple of prompts" (Remotion). HeyGen's own benchmark names typical failures (colliding/drifting elements, everything animating at once) | HyperFrames Apache-2.0; Remotion free for individuals and companies with ≤3 employees; AE subscription | **SKILL**, **H-MCP** (HyperFrames connector), **L-MCP** (AE). Vibe Motion: **MANUAL** | [hyperframes](https://github.com/heygen-com/hyperframes) [verified]; [remotion skills](https://github.com/remotion-dev/skills) [verified]; [Remotion licence](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) [verified] |
| Captions/subtitles | Remotion `/remotion-captions`; HyperFrames `/embedded-captions`; Submagic API; Higgsfield `explainer_video` subtitles; Descript connector | Not benchmarked in sources | Submagic pricing not found | **SKILL**, **API**, **CLI**, **H-MCP** (Descript). Resolve API cannot place SRTs (**MANUAL**) | [hyperframes](https://github.com/heygen-com/hyperframes) [verified]; [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) [verified]; [Submagic API docs](https://docs.submagic.co/introduction) |
| Color: shot matching, LUTs, looks | Higgsfield AI LUT Creator (Resolve panel) / `color_grading_lut` job; Resolve Studio 21.1 MCP (`generate_lut`, LUT/CDL/DRX); Resolve Shot Match/Colourlab (UI) | "Match shots before you stylize" is the consistent creator advice | Included in Higgsfield credits / Resolve Studio | **CLI** (`color_grading_lut`, `video_deflicker`), **L-MCP** (Resolve Studio 21.1 LUT/CDL). The Higgsfield LUT panel and Shot Match are **MANUAL** | [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) [verified]; [Higgsfield Resolve blog](https://higgsfield.ai/blog/higgsfield-davinci-resolve) |
| Film emulation, grain, halation | Dehancer, FilmConvert Nitrate; free Kodak 2383/Fuji 3510 LUTs at reduced strength plus 35 mm grain | Dehancer's halation/bloom/gate weave "reads as shot on film" (snippet) | Dehancer $149/yr; FilmConvert Nitrate $99–199 (snippets) | **MANUAL** (OFX parameters are not settable via the Resolve API). A LUT component can be applied via MCP | [invideo](https://invideo.io/blog/luts-film-grain-ai-video/); earlier notes `davinci_resolve_mcp.md` |
| Native audio in generation | Veo 3.1 (best-rated), Seedance 2.5 (8+ languages incl. German), Kling 3.0 (multi-character) | Veo 3.1 "most natural-sounding"; Kling dialogue "can sometimes sound slightly robotic" (snippets) | Part of the generation price | **CLI** flags (`--sound`, `--generate_audio`) [verified] | [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md); [comparison](https://www.buildfastwithai.com/blogs/seedance-2-5-vs-veo-3-1-vs-kling-3-0-best-ai-video-2026) |
| SFX, foley, ambience | ElevenLabs SFX v2 (`eleven_text_to_sound_v2`, 0.5–30 s, loopable); Higgsfield **Seed Audio 1.0** (Higgsfield's default for SFX); Mirelo SFX v1 video-to-audio; open models MMAudio / HunyuanVideo-Foley | Video-to-audio (Mirelo, Hunyuan) syncs to on-screen action; licence limits apply to open models | ElevenLabs/Mirelo pay-per-use (exact prices not found) | **SKILL + CLI + API** (ElevenLabs); **CLI** (Higgsfield `seed_audio`, `mirelo_text_to_audio`); **API** (Mirelo V2A on fal/WaveSpeed); local GPU for open models | [elevenlabs/skills](https://github.com/elevenlabs/skills) [verified]; [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) [verified] |
| Music and mix | ElevenLabs Music v2 (composition plans, inpainting); Lyria 3 Pro; Sonilo (Higgsfield); HyperFrames audio mixing (ducking, EQ, compressor); sonic-match (licensed BGM + ffmpeg ducking spec) | Licence clarity is the deciding factor (earlier notes) | Lyria 3 Pro $0.08/generation (earlier notes) | **SKILL/CLI/API**; **L-MCP** (sonic-match) | [music SKILL.md](https://github.com/elevenlabs/skills/blob/main/music/SKILL.md) [verified]; [hyperframes](https://github.com/heygen-com/hyperframes) [verified] |
| 3D VFX elements (destruction, set extensions, HDRI) | Blender via Higgsfield `fnf-blender-mcp` skills (`blender-destruction`, `blender-hdri`, `blender-camera-blocking` …) or the official Blender connector | No quality reports found | Free (Blender) | **L-MCP + SKILL**; **H-MCP** (Blender connector, needs add-on) | [fnf bridge repo](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp) [verified]; [claude.com/connectors/blender](https://claude.com/connectors/blender) [verified] |

### Inferences
- **Default "mostly instructions" pipeline, sequenced by effect stage (my synthesis):**
  1. Write the shot list with look tokens: camera style, light scheme, color look and genre per shot.
  2. Generate via the Higgsfield CLI/MCP. Use Cinematic Studio 3.5 for style-axis control, and Seedance 2.5 / Kling 3.0 with end frames for planned morph transitions.
  3. Fix or augment with prompt-based VFX edits. Use Aleph 2.0 via the Runway MCP for relight, weather and object edits; Higgsfield `draw_to_video` for sketch-guided local edits.
  4. Run the `video_deflicker` / upscale utilities.
  5. Assemble in Resolve (Studio 21.1 MCP, or FCPXML import on the free version) and apply a match LUT/CDL.
  6. Build titles, captions and overlays as alpha overlays with HyperFrames or Remotion, or native AE comps via the local AE MCP.
  7. Build sound in three layers: native model audio as the base, ElevenLabs/Seed Audio SFX per event, and licensed music with ducking.
  8. Apply film emulation and grain manually as the last creative touch.
- The biggest remaining manual gaps for a "perfect" video are:
  - Higgsfield's web-only viral preset libraries
  - nuanced grading and film emulation
  - final picture/sound QC
- A human should still approve each gate. The Higgsfield AE skills are themselves built around review gates and "user acceptance".

### Gaps
- The exact tool list of the **official hosted Higgsfield MCP** (`mcp.higgsfield.ai`) could not be read, because higgsfield.ai and the reviewers are blocked. It remains unconfirmed whether it exposes web effect presets.
- No independent 2026 benchmark compares effect *quality* across Aleph 2.0, Ray 3.2, Kling O3 and Seedance 2.5 editing.
- Per-effect prices for Higgsfield credits, ElevenLabs SFX, Mirelo, Kling O3 and Submagic were not found.

---

## 1. In-generation effects and presets (Higgsfield Effects/Apps, camera-motion presets, transition library; Kling/Pika/Hailuo templates): which are reachable via Higgsfield's MCP/CLI?

### Takeaway
Higgsfield's web product still markets large one-click libraries: "Effects"/"Viral presets" (Earth Zoom, Bullet Time …), "Motion" camera presets (dolly, crash zoom, FPV, 360 orbit …), a "Transitions" app and Vibe Motion.

The **official CLI (v1.1.26) and skills (v0.12.0) expose none of these libraries.** What they expose instead:
- per-model **style axes**. Cinematic Studio Video 3.5 has 9 camera styles, 6 light schemes, 8 color looks and 7 genres.
- **speed-ramp presets** on Cinematic Studio 3.0 / V2
- an undocumented `--preset_id`
- workflows (`draw_to_video`, `reframe`, `voice-change`, `dubbing`) and utilities (deflicker, LUT, background removal, SAM-3 segmentation, upscalers)

Higgsfield's older **DoP motion presets** (`motion_id`, 100+ camera moves) are reachable through the Cloud API only via *unofficial* MCPs. Kling's effect templates are available through Kling's official API. Pikaffects (62 effects) appear to be UI-first.

### Cited Findings
**What the official Higgsfield CLI exposes (effects-relevant)** — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md); [README](https://github.com/higgsfield-ai/cli/blob/main/README.md) **[verified]**, CLI 1.1.26 published 18 Sep 2026 per [npm](https://www.npmjs.com/package/@higgsfield/cli) **[verified]**
- **Cinematic Studio Video 3.5** (`cinematic_studio_video_3_5`, default 15 s, 480p–1080p, up to 15 media references) has these in-generation style axes:
  - `--camera_style`: `classic_static`, `silent_machine`, `one_take`, `epic_scale`, `intimate_observer`, `impossible_camera`, `documentary_snap`, `raw_chaos`, `dreamy_flow`
  - `--light_scheme`: `soft_cross`, `contre_jour`, `overhead_fall`, `window`, `practicals`, `silhouette`
  - `--color_grading`: `naturalistic_clean`, `bleached_warm`, `hyper_neon`, `teal_orange_epic`, `sodium_decay`, `cold_steel`, `bleach_bypass`, `classic_bw`
  - `--genre`: auto, action, horror, comedy, noir, drama, epic
  - Constraint: "Inline style axes (camera_style/light_scheme/color_grading) and style_prompt are mutually exclusive."
- **Cinematic Studio 3.0** (`cinematic_studio_3_0`, up to 4k) options:
  - `--speedramp`: `auto`, `linear`, `slowmo`, `speedup`, `fast_to_slowmo`, `slowmo_to_fast`, `super_slowmo`, `impact`
  - `--genre`, `--multi_shots`
  - an undocumented `--preset_id` string
- Cinematic Studio Video V2 offers `--speedramp` (auto/custom/linear/slowmo/speedup/impact), genres (…western, suspense, intimate, spectacle) and `--preset_id`. The older Cinematic Studio Video has `--slow_motion`.
- Seedance 2.0 and 2.0 Mini also take `--genre`.
- **Workflows:** `draw_to_video` (source video + edited sketch frame + timestamp + prompt), `reframe`, `voice-change`, `dubbing`. `higgsfield generate cost workflow draw_to_video …` estimates cost; "`voice-change` and `dubbing` do not support cost estimation."
- **Utility jobs:** "`autosprite`, `bytedance_image_upscale`, `bytedance_video_upscale`, `clipify`, `color_grading_lut`, `llm_text`, `sam_3_video`, `speech2text`, `topaz_image`, `topaz_video`, `video_deflicker`, `video_upscale`". Their schemas require `higgsfield model get <job_type>`. Running that failed here without a logged-in workspace ("No workspace selected").
- **`higgsfield preset`** "list[s] server-managed styles/actions". The documented preset types are `video-explainer` (explainer visual styles) and `animation-action` (the rigged 3D animation catalog, e.g. `--group Fighting --category Punching`). **No video-effect preset type is documented.**
- **Name clash to avoid.** The CLI's `website create --type app --template preset` builds *web apps* ("pick-a-style generation, preset galleries, wizards"). It is not the Higgsfield "Apps" effects catalog.

**What the official skills say** — [higgsfield-ai/skills](https://github.com/higgsfield-ai/skills) **[verified]**, v0.12.0, last commit 11 Sep 2026. It has 8 skill folders: generate, soul-id, product-photoshoot, brandkit, marketplace-cards, video-explainer, websites (which contains the game references) and youtube-thumbnail.
- "Current public workflows are `draw_to_video` and `reframe`" — [CLAUDE.md](https://github.com/higgsfield-ai/skills/blob/main/CLAUDE.md) **[verified]**
- The skills contain no instruction for bullet time, earth zoom, the transitions library or any effect preset. A grep for effect, preset, transition, bullet, earth zoom, VFX and relight found only the start/end-frame "transition" language and the explainer presets **[verified]**.
- Camera language is prompt-based: "Camera: lens (35mm, 85mm), angle (low, overhead), motion (dolly in, tracking shot)"; "Verbs: zooms in, dollies left, sweeping pan, slow push, fast whip" — [prompt-engineering.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/prompt-engineering.md) **[verified]**
- **MCP ↔ CLI parity.** The explainer skill maps "MCP workflow operation[s]" to CLI commands: `get_explainer_presets`, `resolve_explainer_preset`, `generate_image`, `list_voices`, `generate_audio`, `generate_video`, `job_status` and `explainer_video`. The media-inputs reference is "Mirrored from MCP server media-handling logic" — [video-explainer SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-video-explainer/SKILL.md); [media-inputs.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/media-inputs.md) **[verified]**
- **Conflicting third-party claim.** A search summary of Higgsfield MCP pages says Higgsfield offers "signature effect templates including bullet time, earth zoom, and transition libraries" alongside the MCP. The source is most likely [higgsfield.ai/claude-ai-video-generator](https://higgsfield.ai/claude-ai-video-generator) (snippet; attribution uncertain). It does not say these are callable through MCP.
- The claude.com connector directory has **no Higgsfield connector**: `claude.com/connectors/higgsfield` returns 404 **[verified]**. The hosted MCP is added as a custom connector (earlier notes: `https://mcp.higgsfield.ai/mcp`).

**Higgsfield web effect libraries (not agent-accessible via official tools)** — all snippets
- Earth Zoom: "camera that plunges from orbit through clouds, past the city grid, and lands at street level in one unbroken move, built for scale, transitions, and dramatic reveals" — [Higgsfield viral preset page](https://higgsfield.ai/viral-presets/examples/earth-zoom-exported); effects hub [higgsfield.ai/effects](https://higgsfield.ai/effects); [viral presets](https://higgsfield.ai/viral-presets); how-to guide [Segmind](https://blog.segmind.com/earth-zoom-out-higgsfield-ai-effect/)
- Bullet Time: Higgsfield "freezes the subject mid-air … while the camera arcs 180 degrees past hanging debris and droplets" — [Higgsfield Motion: Bullet Time](https://higgsfield.ai/motion/bb341c21-9548-4efb-8a91-b6202167b344)
- Higgsfield offers presets "including dolly, crash zoom, bullet-time, FPV, robo-arm, and 360 orbit, where you pick the move from a menu and the platform bakes it into the generation" — [MakerStack review 2026](https://makerstack.co/reviews/higgsfield-review/) (snippet; attribution among merged results uncertain)
- The DoP model is described as having "a library of over 100 motion presets" with quality tiers Lite/Preview/Turbo; the "presets aren't just prompt templates—they're baked into how the model thinks" — [apiframe Higgsfield API guide](https://apiframe.ai/guides/higgsfield-api-guide); [Kolbo: 100+ camera presets](https://kolbo.ai/blog/higgsfield-suite-100-camera-presets) (snippets). Also [Higgsfield Action Movement](https://higgsfield.ai/action-movement).
- DoP is **not** in the official CLI catalog (earlier notes, [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) **[verified]**). The official Python SDK README shows only generic `subscribe('bytedance/seedream/v4/text-to-image', …)` examples and no motion-preset API — [higgsfield-client](https://github.com/higgsfield-ai/higgsfield-client) **[verified]**.

**Unofficial MCPs that do expose Higgsfield motion presets** — **[verified]** READMEs; stars and dates from GitHub search on 23 Sep 2026
- `QalaLabs/claude-higgsfield-mcp` (0 stars; created 4 May 2026; updated 22 Jun 2026) has these tools:
  - `generate_video`: "Convert an image to a 5-second cinematic video using the DoP model", `motion_id` required, quality lite/turbo/standard
  - `search_motions`, and a resource `higgsfield://motions/{category}` with categories "camera, slow-motion, dynamic, character, ambient"
  - `generate_talking_head` (Speak v2)
  - `extract_style_from_image`, and Soul style presets by category
  - It uses Higgsfield Cloud API keys (`HF_API_KEY`/`HF_SECRET` from cloud.higgsfield.ai) — [README](https://github.com/QalaLabs/claude-higgsfield-mcp)
- `geopopos/geo_higgsfield_ai_mcp` (4 stars; created Nov 2025; updated 20 Jul 2026) has these tools:
  - `generate_video_dop` with `motions: [{id, strength}]` and `input_image_end_url` (end frame)
  - `get_motions`, which returns "id, name, description, and preview_url"
  - It uses credentials from platform.higgsfield.ai — [README](https://github.com/geopopos/geo_higgsfield_ai_mcp)
- *Note:* the tool list circulating in search summaries (`generate_talking_head`, `search_motions`, `debug_credentials` …) is QalaLabs' **community** server, not the official hosted MCP.

**Transitions library (web)** — snippets
- Higgsfield's Transitions app: "upload your first video ('Clip 1') and your second video ('Clip 2'), then choose a transition style from the library". Named styles include Morph, Column Wipe, "Seamless Transition" and "Roll Transition" — [higgsfield.ai/apps/transitions](https://higgsfield.ai/apps/transitions); [Seamless Transition](https://higgsfield.ai/motion/77ff4447-ab4c-4816-bb79-bff2f4a4f34f); [Roll Transition](https://higgsfield.ai/motion/a8e2bc3a-e78e-42aa-a0e6-79bc01141ed3); [Creative Pad Media: 10 examples](https://www.creativepadmedia.com/higgsfield-ai-transitions-crazy-vfx-with-1-click-10-examples/)
- **Older creator tip (6 Jul 2025):**
  - "stack effects like FPV Drone, Crash Zoom, Super Dolly In, and even add layers like Glitch, Roll, or Thunder Sparks"
  - "You can mix up to three motion types in Higgsfield's Mix mode, and the transitions usually work best at around 1–1.5 seconds"
  - Source: [TikTok @ai.for.real.life](https://www.tiktok.com/@ai.for.real.life/video/7523999182357679373) (snippet; **2025 information**)

**Other platforms' effect templates** — snippets
- **Kling** has an official "Video Effects" API endpoint — [Kling API docs: video effects](https://kling.ai/document-api/api/effects/video-effects):
  - Some older effects ("kissing, hugging, girlfriends, and boyfriends") "are no longer supported on Kling's official website"
  - examples include `squish` and `rocket`
  - hug/kiss/heart_gesture need exactly two image URLs
  - Kling reportedly added "20 new Christmas, New Year, and winter-themed effects in 2026"
  - Sources: [PiAPI Kling effects](https://piapi.ai/docs/kling-api/kling-effects); [Kling API update log](https://www.klingai.com/document-api/updates/api). Attribution of the "20 new effects" line is uncertain.
- **Pikaffects** — [VIDEOAI.ME Pika review 2026](https://videoai.me/blog/pika-ai-review-2026); [BrandGene Pika review](https://brandgene.io/blog/comparisons/reviews/pika-ai-review):
  - "accepts no prompt at all—you pick one of 62 named effects" (explode, melt, crush, inflate, cakeify, squish, levitate …)
  - Pika remains "focused on these creative effects rather than photorealism"
- **Hailuo/MiniMax:** no 2026 source on effect templates was found. The only snippet says Hailuo is strongest at "videos of people — face expressions, lip sync and portrait-style footage" — [BrandGene](https://brandgene.io/blog/comparisons/reviews/pika-ai-review) (snippet). In Higgsfield's CLI, Hailuo has no effect or template flags **[verified]**.

### Inferences
- **For Claude-driven generation, treat Higgsfield "effects" as prompt and parameter craft, not preset IDs.** Use the Cinematic Studio 3.5 style axes plus explicit camera verbs. For bullet-time-like beats, use `--speedramp super_slowmo`/`impact` (3.0) with an orbit description. For an "earth zoom", write a one-take descent prompt, or use first/last frames of orbit → street.
- Anyone who needs the exact web presets (Earth Zoom, Bullet Time, Transitions app) has three options:
  - generate them manually in the web app, then let Claude handle everything after that
  - accept ToS and breakage risk with unofficial MCPs; earlier notes found cookie-based wrappers "Probably against ToS"
  - use the API-key-based community servers built on the Cloud API, if the DoP endpoint still exists (unverified for Sept 2026)
- `--preset_id` on Cinematic Studio 3.0/V2 suggests server-side presets that may map to web presets. Its values are undiscoverable without a logged-in `higgsfield preset list` / `model get`. The user can run those commands once and let Claude read the JSON.

### Gaps
- It is unconfirmed whether the official hosted MCP exposes `preset_id` values or any "Effects/Apps".
- The valid values of `--preset_id` could not be discovered, because this needs an authenticated CLI.
- Whether Higgsfield's Cloud API still serves DoP/`motion_id` in Sept 2026 is unknown. The community repos date from May–Jul 2026.
- Whether Pikaffects are available through any API or MCP in 2026 was not verified.
- No 2026 review rates the quality of Higgsfield's viral presets against prompt-based equivalents.

---

## 2. Prompt-based VFX editing of existing clips (Aleph 2.0, Ray 3.2 Modify, Higgsfield Draw-to-Edit, Kling O3, Wan 2.7/VACE, Seedance 2.5 edit, Gemini Omni): which effects, quality, limits, API/MCP access

### Takeaway
Every major lab now ships a video-to-video editor.

**Runway Aleph 2.0** (21 May 2026) is the most-cited all-rounder:
- relight, add/remove/swap objects, new angles, restyle
- up to 30 s at 1080p, with multi-shot propagation
- ≈ $0.28/s via API
- Claude can call it through Runway's official MCP (`runway_editVideo`, default `aleph2`) or Replicate

**Luma Ray 3.2 Modify** (9 Jun 2026) gives the most control:
- keyframes, and separate preservation of motion, structure, face and body
- HDR/16-bit EXR ACES
- ≈ $0.20/s on fal
- Luma's own MCP still only knows Ray 2

**Kling O3** (Feb 2026; 4K and 3–15 s since 17 Jun 2026) is good for swaps, style and time-of-day, but reportedly cannot add new actions.

**Seedance 2.5 edit** adds reference-guided, timestamp-level fixes. Wan 2.7 edit is the cheap style-transfer option. Gemini Omni Flash (19 May 2026) does conversational multi-turn edits.

Inside Higgsfield, Claude can use:
- `draw_to_video` (sketch-guided local edits)
- `gemini_omni` with one video reference (720p)
- `seedance_2_5 --mode omni_reference` with video references

### Cited Findings
**Runway Aleph 2.0**
- Launched 21 May 2026 with the new **Edit Studio** — [Runway on X, 21 May 2026](https://x.com/runwayml/status/2057530497597600169); [Runway on X, 22 May 2026](https://x.com/runwayml/status/2057826728769134599); [Runway news](https://runway.com/news/introducing-aleph-2-and-edit-studio) (snippets; dates decoded from post IDs):
  - "edit a single frame in your video, preview the change and then Aleph 2.0 carries that edit across the rest of your video"
  - "multishot sequences up to 30 seconds long at 1080p"
  - Edit Studio "lets users preview an edit as a static image before committing to video generation"
- Capabilities: "change camera angles, rewrite lighting, add or remove objects, and direct cinematic shots from any clip"; "targeted edits, changing only what you want to change". Use cases: "product swaps, packaging updates, background changes, relighting, scene cleanup" — [Picsart: Aleph 2.0](https://picsart.com/ai-models/runway-aleph-2-0/); [Runway product page](https://runway.com/product/aleph-2) (snippets)
- Input limits: "2 and 30 seconds, 480p to 1080p, 24 to 30 FPS, with no more than 10 cuts. Longer videos are trimmed and higher frame rates are downsampled" — [Runware docs](https://runware.ai/docs/models/runway-aleph-2-0/guides/editing-video); [The Rundown](https://www.therundown.ai/tools/aleph) (snippets)
- Price: "28 credits per second with a 56-credit minimum… API credits cost $0.01 each… $0.28 per second"; 10 s = 280 credits. "Runway web credits and API credits use separate balances". Aleph 2.0 costs "5.6 times as many credits per second as Gen-4 Turbo" — [Flowith](https://flowith.io/ai-models/runway-aleph-2/); [The Rundown](https://www.therundown.ai/tools/aleph); [Runway API pricing](https://docs.dev.runwayml.com/guides/pricing/) (snippets)
- Also hosted on [Replicate (runwayml/aleph-2)](https://replicate.com/runwayml/aleph-2), [OpenRouter](https://openrouter.ai/runway/aleph-2) and [Runware](https://runware.ai/models/runway-aleph-2-0) (search results). An official [Aleph 2.0 prompting guide](https://help.runwayml.com/hc/en-us/articles/52150503729171-Aleph-2-0-Prompting-Guide) exists (title only).
- Review voices: "For stylized and VFX work, use Runway; for editing existing footage, use Runway's Aleph 2.0"; "Runway really stands out with post-generation editing" — [VEED: Kling alternatives 2026](https://www.veed.io/learn/kling-alternatives-2026); [HeyGen: Kling alternatives](https://www.heygen.com/blog/kling-ai-alternatives) (snippets; attribution among merged results uncertain)
- **Claude access** — [runwayml/runway-api-mcp-server](https://github.com/runwayml/runway-api-mcp-server) **[verified]**; 22 stars, repo last updated 10 Aug 2026:
  - `runway_editVideo` ("Edits a video, optionally provide reference images"). The README says "Recommended models: … Aleph (`aleph2`) for video editing".
  - The server validates payloads locally.
  - It installs as an unpacked Claude Desktop extension, or deploys as a remote HTTP MCP added to claude.ai as a custom connector (Bearer key).
  - It needs a paid Runway API account.
  - "Images generated by the Runway API lives only for 24 hours at the generated link"

**Luma Ray 3.2 (Modify / video-to-video)**
- Released **9 Jun 2026**, with "frame-level direction through multiple keyframes within a single clip". It has a full API and "native HDR and 16-bit EXR in ACES2065-1" — [IT Brief UK](https://itbrief.co.uk/story/luma-launches-ray3-2-with-tighter-ai-video-control); [Luma news](https://lumalabs.ai/news/introducing-ray-3-2) (snippets)
- Keyframe count conflicts: "up to 16 keyframes" ([IT Brief](https://itbrief.co.uk/story/luma-launches-ray3-2-with-tighter-ai-video-control)) vs "as many as 64 keyframes placed at exact source frames" ([The Rundown: Ray 3.2](https://www.therundown.ai/tools/ray-3-2) or [Picsart](https://picsart.com/ai-models/luma-ray-3-2-edit/); snippet attribution uncertain). The difference may be generation vs modify mode.
- Modify is described as follows — [Luma: Ray 3.2 video-to-video](https://lumalabs.ai/learning-center/articles/ray-3-2-video-to-video); [Ray 3.2 core concepts](https://lumalabs.ai/learning-center/articles/ray-3-2-introduction-and-core-concepts); [MaxVideoAI](https://maxvideoai.com/models/luma-ray-3-2) (snippets):
  - it "can change subjects, environments, lighting, style, camera behavior, and other visual elements while preserving selected motion and structure"
  - users can "independently control how much motion, scene structure, faces, bodies and poses should be preserved"
  - the output has "the same duration, up to 20 seconds"
- Pricing — [The Rundown: Ray3 Modify](https://www.therundown.ai/tools/ray3-modify); [fal: Ray 3.2](https://fal.ai/ray-3.2) (snippets):
  - fal: "$1 per 5-second clip at 720p… $0.20 per second"; 1080p is "also … $0.20 per second"
  - Luma credits: T2V/I2V "starts at 20 credits for a 5-second Draft render and reaches 400 credits for 5 seconds at 1080p. Video-to-video is charged per second, and HDR or HDR plus EXR applies a 2x or 3x multiplier"
- **Claude access:** Luma's official MCP ([lumalabs/luma-api-mcp](https://github.com/lumalabs/luma-api-mcp) **[verified]**; 26 stars, updated 3 Sep 2026) only offers `ray-2`, `ray-flash-2` and `ray-1-6`, with `frame0/frame1` keyframes. It has **no Ray 3.2 and no Modify**. Ray 3.2 therefore needs the Luma API via a Claude Code script, or fal.

**Kling O3 (Kling 3.0 Omni video edit)**
- Kling 3.0 Omni launched **5 Feb 2026**. On **17 Jun 2026** an upgrade brought "4K editing, a 3 to 15 second duration range, and edits that remain faithful to your source footage" — [Atlas Cloud: Kling 3.0 Omni upgrade](https://www.atlascloud.ai/blog/tips/kling-3-0-omni-upgrade) (snippet)
- Capabilities (vendor/reseller descriptions): "swapping backgrounds, inserting new characters, applying visual styles, or re-lighting scenes — without any manual masking"; "swap objects, shift time of day, alter scenes or styles"; "up to 4 reference images … and optional original audio retention" — [Segmind: Kling O3 V2V edit](https://www.segmind.com/models/kling-o3-video2video-edit); [WaveSpeed: Kling O3 video-edit](https://wavespeed.ai/models/kwaivgi/kling-video-o3-std/video-edit) (snippets)
- **Conflicting limitation:** one explainer says "O3 does not change what happens in the clip — it cannot add new actions, remove objects, or alter the sequence of events" — [PonPon: Kling O3 vs Kling 3.0](https://ponpon.ai/blog/kling-o3-vs-kling-3) (snippet; attribution likely). WaveSpeed describes "removing or replacing objects".
- **Claude access:** Higgsfield's CLI has no Kling O3 edit job; `kling3_0` takes only start/end images **[verified]**. Kling O3 is available via its own API and resellers (WaveSpeed, Segmind, eachlabs), so use an API script or an aggregator MCP.

**Seedance 2.5 edit**
- ElevenLabs hosts "Seedance 2.5 Video Edit", which "edits existing footage with reference-guided continuity and motion control". The "endpoint covers video editing and video extension" — [ElevenLabs: Seedance 2.5 Video Edit](https://elevenlabs.io/video/seedance-25-video-edit) (snippet)
- ByteDance says users can input "up to 30 images, 10 video clips, and 10 audio clips as reference materials in a single pass". It offers "timestamp-level control for targeted editing of audio and video content… modify specific areas within the scene… instead of regenerating an entire 30-second clip" — [ByteDance Seed: Introducing Seedance 2.5](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5); [MindStudio](https://www.mindstudio.ai/blog/seedance-2-5-features-30-second-video-4k) (snippets)
- In Higgsfield: `seedance_2_5` accepts "`start_image`, `end_image`, `image_references`, `video_references`, `audio_references`. Use `--mode omni_reference` for reference generation" — [media-inputs.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/media-inputs.md) **[verified]**. Seedance 2.0 via the CLI allows at most 3 video and 3 audio references, 12 files total — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) **[verified]**. Whether Higgsfield exposes Seedance's timestamp-level *edit* mode (vs reference generation) is not documented.

**Wan 2.7 edit / Wan VACE**
- fal launched Wan 2.7 on 3 Apr 2026 with "Instruction-based editing and video recreation" — [fal on X](https://x.com/fal/status/2039939637863407632) (snippet; date decoded). Endpoint `fal-ai/wan/v2.7/edit-video` — [fal](https://fal.ai/models/fal-ai/wan/v2.7/edit-video) (snippet)
- Wan 2.7 Video Edit is "a video-to-video style transfer model … preserving motion, timing, and structure while completely transforming the aesthetic". It can "swap elements, or recreate footage with a reference image, and preserve or regenerate audio" — [Segmind review](https://blog.segmind.com/ai-video-editing-api-wan-2-7-video-edit-review-real-world-use-cases-2026/) (snippet)
- Older open alternative: "Wan VACE Video Edit … Wan 2.2 VACE Fun model" on fal — [fal: Wan VACE video edit](https://fal.ai/models/fal-ai/wan-vace-apps/video-edit) (snippet)
- In Higgsfield's CLI, `wan2_7` has no video input. It takes only start/end image and one audio reference **[verified]**. Editing with it needs fal or another API.

**Gemini Omni Flash (Google)**
- Announced at Google I/O on **19 May 2026** — [Google blog: Introducing Gemini Omni](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-omni/); [Gemini API docs](https://ai.google.dev/gemini-api/docs/omni); [Google Workspace blog](https://workspace.google.com/blog/product-announcements/introducing-gemini-omni-flash-in-google-vids) (snippets):
  - "accepts text, images, audio, and video in a single prompt and produces a single video, with conversational editing"
  - "Edits build on each other through natural language conversation"
  - SynthID and C2PA on every clip
  - available in the Gemini app, Flow, YouTube Shorts/Create and a Gemini API preview
- In Higgsfield: `gemini_omni` takes one video reference (then ≤5 images), durations 4/6/8/10 s, **720p only**, 16:9/9:16 — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) **[verified]**

**Higgsfield Draw-to-Edit / Edit Video**
- CLI: `higgsfield generate workflow draw_to_video --video … --sketch ./frame.png --timestamp 3.2 --prompt "make the jacket red" --wait`. In the plugins it is "Draw To Edit" — [CLI README](https://github.com/higgsfield-ai/cli/blob/main/README.md); [workflows.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/workflows.md) **[verified]**
- Higgsfield describes "seamless blending for realistic integration of new objects and styles". Its "Inpaint tool lets you replace or remove specific objects within existing video frames without regenerating the entire clip" — [Higgsfield blog: Draw-to-Edit](https://higgsfield.ai/blog/Everything-you-should-know-about-Draw-to-Edit); [Higgsfield AI video editor](https://higgsfield.ai/ai-video-editor) (snippets; vendor)
- Independent review (whole platform, not only Draw-to-Edit): 3.6/5. "Video Upscale … transformed 720p test renders into usable 4K outputs without obvious artifacts", but there were "occasional unexpected results requiring regeneration and extra credit costs" — [Hack'celeration review](https://hackceleration.com/higgsfield-review) (snippet)

**Aggregator MCP routes for editing models**
- Replicate's official remote MCP (earlier notes) can run Replicate-hosted models including `runwayml/aleph-2` — [Replicate: aleph-2](https://replicate.com/runwayml/aleph-2) (search result)
- fal: listings describe an "Official fal.ai MCP Server" at `mcp.fal.ai/mcp` that lets an assistant "search those models, check what they cost, and run them", "updated in June 2026" — [PulseMCP](https://www.pulsemcp.com/servers/fal-ai-documentation); [mcpservers.md](https://mcpservers.md/fal-mcp) (snippets)
  - **Conflict:** earlier notes found no official fal MCP.
  - GitHub search for `mcp` in `org:fal-ai` returns 0 repositories **[verified]**, so it may be closed-source or docs-only.

### Inferences
- **Which editor for which effect (my synthesis of the above):**
  - relighting, object add/remove and product swaps with minimal drift → Aleph 2.0
  - restyle or material/environment swap that must keep exact motion, or HDR/EXR delivery → Ray 3.2 Modify
  - quick style/time-of-day swaps and 4K edits → Kling O3
  - fixing a detail inside a long Seedance take → Seedance 2.5 edit
  - cheap stylization → Wan 2.7 edit
  - "sketch it on the frame" local edits inside the Higgsfield pipeline → `draw_to_video`
- For Claude automation, the **Runway MCP is the only official, well-engineered MCP for a top editing model**. It has local schema validation, `listModels` discovery and task polling. Claude can do the rest through fal/Replicate MCPs or API scripts.
- All these editors regenerate pixels. Expect texture/identity drift and re-rolls. Budget 2–3 attempts per effect shot, as the Higgsfield AE matte-painting skill does ("three attempts per generated layer").

### Gaps
- No side-by-side 2026 test of edit quality (flicker, identity drift, prompt adherence) across these models was found. All quality statements are vendor or snippet level.
- No price was found for Kling O3 edit, Seedance 2.5 edit (ElevenLabs/fal), Wan 2.7 edit or Higgsfield `draw_to_video` credits.
- Whether the official Higgsfield MCP exposes `draw_to_video` is unconfirmed; CLI parity is likely but not verified.
- Whether fal's hosted MCP is truly official, and what its tool list is, remain unverified.

---

## 3. Transitions between clips (first/last-frame morphs, match cuts, AI transition presets, code/NLE transitions): how creators build "seamless" transitions and whether Claude can automate them

### Takeaway
"Seamless" AI transitions are mostly built by generating a bridging clip with **start frame = last frame of shot A and end frame = first frame of shot B**. This works when both frames share subject, scale and composition.

Claude can fully automate this with the Higgsfield CLI (`--start-image/--end-image`) plus ffmpeg frame extraction. Supporting models include Kling 3.0, Seedance 2.5/2.0/1.5, Cinematic Studio 3.x, Wan 2.7, Veo 3.1 Lite and Hailuo (non-2.3). **Veo 3.1 standard has no end-frame flag in Higgsfield's CLI.**

Higgsfield's one-click Transitions app remains web-only. For non-generative transitions, Claude can use:
- FFmpeg `xfade` (58 built-ins + custom expressions)
- HyperFrames shader transitions
- AE via the Higgsfield `ae-transition-kit` skill
- Resolve 21.1 dissolves/fades via MCP

Higgsfield's new Premiere MCP explicitly does **not** support transitions.

### Cited Findings
**Start/end-frame support in Higgsfield's CLI** — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) **[verified]**
- `--end-image` exists on:
  - `cinematic_studio_3_0`, `cinematic_studio_video` ("End_image requires start_image"), `cinematic_studio_video_3_5`, `cinematic_studio_video_v2`
  - `kling3_0`, `marketing_studio_video`
  - `minimax_hailuo` ("End_image is not supported for 'minimax-2.3' or 'minimax-2.3-fast'"; "Resolution '512' is incompatible with end_image")
  - `seedance1_5`, `seedance_2_0`, `seedance_2_0_mini`
  - `veo3_1_lite` ("Duration must be 8 when both start_image and end_image are set")
  - `wan2_7`
- `veo3_1` has only `--start-image`; `kling3_0_turbo`, `kling2_6`, `grok_*` and `gemini_omni` have no end frame.
- The skills describe `--start-image` as "first frame for image-to-video transitions" and `--end-image` as "last frame for transitions". Kling 3.0 is "Image-to-video with optional last-frame transition" — [SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md); [media-inputs.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/media-inputs.md) **[verified]**
- Inputs may be local paths or previous job IDs, "paths are auto-uploaded". So Claude can chain "last frame of clip A → start image" without manual upload — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) **[verified]**
- Luma's official MCP offers `frame0_image`/`frame1_image` keyframes (Ray 2 only) — [luma-api-mcp](https://github.com/lumalabs/luma-api-mcp) **[verified]**

**Creator technique** — snippets
- Kling's official guide: "The content of the first and last frame videos should be as similar as possible… choose two similar images with the same theme for smoother transitions within 5 seconds" — [Kling: start & end frames guide](https://kling.ai/quickstart/ai-video-start-end-frames)
- Seedance guidance: the model "interpolates best when the start and end share a subject, scale, and rough composition". Going "from a tight close-up to a wide aerial in 5 seconds asks the AI to invent too much and invites warping". "Use words like smooth, continuous, gradual, seamless to discourage hard cuts, and name the subject that must stay consistent" — [Seedance first & last frame guide](https://www.seedance.tv/blog/seedance-first-and-last-frame)
- Match cuts: "graphic shape matches, action matches that complete a gesture, and scale-jump matches read the strongest" — [Morphic: match-cut transitions](https://morphic.com/resources/videos/match-cut-transition-videos)
- "Reverse storyboarding": establish the final frame first (logo, product, pose), then generate the motion toward it. The same image as start and end gives seamless loops — [Dreamina: start and end frame guide](https://dreamina.capcut.com/ai-video/how-to-use-start-and-end-frame-generators); [Veo 3.1 frames-to-video guide](https://www.veo3ai.io/blog/veo-3-1-frames-to-video-guide-2026) (snippets; merged)
- A marketing-grade claim that "89% of YouTubers now using AI for transitions … reduces transition editing time by 70%" — [Digen](https://resource.digen.ai/ai-video-editing-seamless-transitions-2026/) (snippet). **This is unsourced and should not be used.**
- Higgsfield transition presets (web; Morph, Column Wipe, Roll …) and the 2025 tip of 1–1.5 s transitions with stacked motions: see §1.

**Code/NLE transitions Claude can apply**
- **FFmpeg `xfade`** has 58 named transitions plus `custom`: fade, wipeleft/right/up/down, slideleft/…, circlecrop, rectcrop, distance, fadeblack, fadewhite, radial, smoothleft/…, circleopen/close, vertopen/close, horzopen/close, dissolve, pixelize, diagtl/tr/bl/br, hl/hr/vu/vdslice, hblur, fadegrays, wipetl/tr/bl/br, squeezeh/v, zoomin, fadefast, fadeslow, hl/hr/vu/vdwind, cover*, reveal* — [FFmpeg source: vf_xfade.c](https://github.com/FFmpeg/FFmpeg/blob/master/libavfilter/vf_xfade.c) **[verified]**
- **HyperFrames** — [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) **[verified]**:
  - a `@hyperframes/shader-transitions` package ("WebGL shader transitions for compositions")
  - catalog blocks installable with e.g. `npx hyperframes add flash-through-white   # shader transition`
  - `/hyperframes-registry` should be loaded "before hand-building any named look, effect, treatment or transition"
- **After Effects:** Higgsfield's `ae-transition-kit` skill — [ae-transition-kit SKILL.md](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp/blob/main/skills/after-effects/ae-transition-kit/SKILL.md) **[verified]**:
  - "Use two independently replaceable content sources, A and B"
  - "Expose progress, direction, edge softness"
  - "Door, card and peel transitions can use native 3D"
  - "Test 0%, midpoint and 100%, plus the frames immediately before and after each seam"
- **Resolve:** Studio 21.1's API supports fades and dissolves. A live test found "Dissolves came out one-sided" — earlier notes [davinci_resolve_mcp.md](../Higgsfield%20Workflow%20Resolve%20vs%20Adobe/davinci_resolve_mcp.md). Before 21.1, transitions "must be added manually from the Effects Library" — [hiteshK03 README](https://github.com/hiteshK03/davinci-resolve-mcp) (via earlier notes).
- **Premiere (Higgsfield's local MCP, `@higgsfield_org/premiere-mcp` 0.1.0, 22 Sep 2026):** "Effects, keyframes, captions, transitions, inline previews and nested-bin traversal are not supported" — [premiere/README.md](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp/blob/main/premiere/README.md); [npm](https://www.npmjs.com/package/@higgsfield_org/premiere-mcp) **[verified]**

### Inferences
- **An automatable "seamless transition" recipe for Claude Code:**
  1. `ffmpeg` extracts the last frame of A and the first frame of B.
  2. Optionally, Nano Banana / GPT Image edits both frames toward a shared composition, for a match cut.
  3. `higgsfield generate create kling3_0|seedance_2_5 --start-image A_last.png --end-image B_first.png --prompt "one continuous camera move…" --duration 3–5 --wait --json`
  4. Trim to the useful 1–2 s.
  5. Insert with a short `xfade` into both neighbours.

  Claude can also check seams by extracting frames around the cut.
- Pick the transition *type* per edit: AI morph for "impossible camera" links, `xfade`/shader for rhythm cuts, and AE/HyperFrames for designed graphic wipes. AI morphs cost a generation each and can warp faces. Code transitions are free and deterministic.

### Gaps
- No 2026 creator comparison rates which model gives the cleanest first/last-frame morphs (Kling 3.0 vs Seedance 2.5 vs Veo 3.1).
- The Higgsfield Transitions app's model and whether it has any API are unknown.
- It is unverified whether the Google genmedia MCP's Veo tool exposes a last-frame parameter; Veo 3.1 supports frames-to-video per the guide above.

---

## 4. Motion graphics, titles, captions, kinetic typography and overlays as code or via agents (Remotion, HyperFrames, Motion Canvas, After Effects via Claude, Resolve Fusion via MCP): quality, templates, autonomy

### Takeaway
The strongest autonomous routes in Sept 2026 are:
- **HyperFrames**, HeyGen's HTML-to-MP4 framework:
  - 52.5k stars; v0.8.63 released on 23 Sep 2026
  - 21 agent skills, including `/motion-graphics`, `/embedded-captions`, `/talking-head-recut` and `/music-to-video`
  - a catalog of transitions, overlays, captions and charts
  - a hosted Claude connector
  - Apache-2.0
- **Remotion Agent Skills** (React; free for individuals and companies with ≤3 employees)

For native After Effects projects, Higgsfield has just replaced its cloud bridge (`bridge.higgsfield.ai/mcp`, announced 14 Jul 2026) with a **local AE MCP** (`fnf-after-effects-mcp` 0.1.1, 10–14 Sep 2026):
- 12 tools and a curated skill set covering clean rigs, animation principles, transitions, depth, liquid glass, Figma transfer, VFX cleanup and matte painting
- frame-render verification

Resolve Fusion via MCP is weak for titles: Text+ values are not reliably settable, and titles drop on V1. Higgsfield **Vibe Motion** (5 Feb 2026) is a strong no-code option but is **web-only**.

### Cited Findings
**HyperFrames (HeyGen)** — [heygen-com/hyperframes README](https://github.com/heygen-com/hyperframes) **[verified]**; 52,523 stars, created 10 Mar 2026, updated 23 Sep 2026 (GitHub search) **[verified]**; npm `hyperframes` 0.8.63, 23 Sep 2026 **[verified]**; Apache-2.0 [LICENSE](https://github.com/heygen-com/hyperframes/blob/main/LICENSE) **[verified]**
- "turning HTML, CSS, media, and seekable animations into deterministic MP4 videos". Animation adapters: "GSAP, CSS animations, Lottie, Three.js, Anime.js, WAAPI".
- Creation skills:
  - `/motion-graphics`: "unnarrated, design-led motion graphic (~under 10s) — kinetic type, stat / chart hit, logo sting, lower-third, animated tweet / headline. MP4 or transparent overlay"
  - `/talking-head-recut`: "lower-thirds, data callouts, kinetic titles, pull-quotes, side panels, PiP"
  - `/embedded-captions`: "verbatim rail, embedded climax behind the subject, or pure-cinematic embed"
  - `/music-to-video`: "beat-synced"
  - also `/general-video` and `/faceless-explainer`
- Domain skills:
  - `/hyperframes-animation` (transitions, runtime adapters)
  - `/hyperframes-keyframes` ("SVG morph/draw, 3D depth")
  - `/hyperframes-creative` ("audio-reactive visuals")
  - `/media-use` ("resolve any media need (BGM, SFX, image, icon, logo, voice, color grade, LUT)")
  - `/hyperframes-audio`
  - `/figma`
- The catalog holds "Reusable blocks and components for transitions, overlays, captions, charts, maps, and effects". Rendering runs locally, in HeyGen cloud (`cloud render`) or on AWS Lambda.
- A hosted Claude connector (tools `compose`, `render_video`) exists — earlier notes, [claude.com/connectors/hyperframes](https://claude.com/connectors/hyperframes).
- Quality evidence: HeyGen released **Code2Video**, a benchmark for motion-graphics agents. It targets failures "that code execution alone misses: elements colliding or drifting outside the frame, animation that happens all at once, and videos that satisfy the brief while still looking flat or poorly balanced". Its judge results are "company-reported" — [Superpowerdaily](https://superpowerdaily.com/posts/heygen-releases-code2video-to-judge-ai-made-motion-graphics) (snippet). Design rationale: "AI models already generate HTML significantly better than complex React animation architectures" — [The Menon Lab](https://themenonlab.blog/blog/heygen-hyperframes-video-as-code) (snippet; opinion).

**Remotion** — [remotion-dev/skills](https://github.com/remotion-dev/skills) **[verified]**; 4,697 stars, created 19 Jan 2026; `remotion` 4.0.527 on 22 Sep 2026 per [npm](https://www.npmjs.com/package/remotion) **[verified]**
- The skills are: `/remotion-best-practices`, `/remotion-create`, `/remotion-markup` ("compositions, animations, layout, typography, media elements, effects, audio, fonts, timing"), `/remotion-studio`, `/remotion-render`, `/remotion-maps` (incl. "3D geographic flyovers with CesiumJS"), `/remotion-captions`, `/remotion-saas`, `/remotion-interactivity`, `/remotion-docs`, `/remotion-upgrade` and `/remotion-multimedia`.
- Licence: free "if you are: an individual; a for-profit organization with up to 3 employees; a non-profit… commercially for the purpose of creating videos". Larger companies need a company license — [Remotion LICENSE.md](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) **[verified]**
- Creator reports (snippets):
  - Agent Skills "went viral — 13 million views in one week on X" (unverified virality figure) — [dplooy guide](https://www.dplooy.com/blog/claude-code-video-with-remotion-best-motion-guide-2026)
  - one creator "recreates almost any motion graphic they find on Pinterest or YouTube in a couple of prompts" — [Louise de Sadeleer (Substack)](https://louisedesadeleer.substack.com/p/how-i-make-custom-motion-graphics)
  - "Specific prompts with frame numbers, color values, and explicit animation behavior produce far better results than vague descriptions" — [MindStudio](https://www.mindstudio.ai/blog/remotion-claude-code-animated-logo-reveals-motion-graphics)
  - A community skill encodes "a mandatory render → inspect frames → fix → re-render loop" — [haidrrrry/claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill) (snippet)
  - An anecdote of "12 product demo videos … in 4 days" and "340% more conversions" is unsourced marketing; do not rely on it (snippet).

**After Effects via Claude**
- **Higgsfield cloud bridge (July 2026).** "Higgsfield's new MCP connector lets Claude work inside your actual AE project. It can build compositions, set keyframes, write expressions, and run the repetitive ExtendScript work… everything it makes becomes an editable AE scene" — [@omarsar0 on X, 14 Jul 2026](https://x.com/omarsar0/status/2077132773031088571) (snippet; date decoded). Setup is via `bridge.higgsfield.ai/mcp` plus the Higgsfield Adobe plugin (earlier notes [adobe_mcp.md](../Higgsfield%20Workflow%20Resolve%20vs%20Adobe/adobe_mcp.md)). Higgsfield markets "AI Motion Designer … titles, transitions, logo reveals" — [Higgsfield AI Motion Designer](https://higgsfield.ai/ai-motion-designer); [Higgsfield blog: AI Motion Designer via GPT](https://higgsfield.ai/blog/ai-motion-designer-after-effects-gpt) (snippets). Video titles: "After Effects + Higgsfield MCP: Complex Motion Graphics Without Leaving the Timeline" — [YouTube](https://www.youtube.com/watch?v=ioDw1jn09lA) (title only).
- **New local replacement (Sept 2026)** — [higgsfield-ai/fnf-local-pluging-bridge-mcp](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp) **[verified]**; last commit 23 Sep 2026; npm `fnf-after-effects-mcp` 0.1.1, created 10 Sep, modified 14 Sep 2026, published by a higgsfield.ai account, based on kumo.productions' MIT `mcp-aftereffects` **[verified]**
  - "Local control of Adobe After Effects, with offline creative skills adapted from the FNF bridge… No Higgsfield account, cloud relay or installed AE panel is required."
  - It needs Node 24+, macOS/Windows and AE (probes 2024–2026). The installer targets Codex (`install-codex`); `config` prints JSON for other desktop MCP clients.
  - Its 12 tools include `ae_get_skill`, `ae_project_info`, `ae_catalog`, `ae_do`, `ae_render_frame` and `ae_save_project`. The operation registry covers "compositions, text, shapes, properties, keyframes, effects, cameras".
  - `batch.run` "groups operations for undo but does not roll back automatically on failure". "Arbitrary eval is off unless `AE_MCP_ENABLE_EVAL=1`".
  - **Skills bundled:**
    - `ae-clean-rig` (entry point)
    - `ae-animation-principles` ("timing, easing, staging, anticipation, follow-through")
    - `ae-transition-kit`
    - `ae-ui-mastery`
    - `ae-liquid-glass` ("refraction, edge light")
    - `ae-depth-space` ("parallax … atmospheric cues")
    - `ae-design-first`
    - `ae-build-orchestration`
    - `ae-mcp-realities`
    - `ae-figma-transfer`
    - **`ae-cleanup`** ("remove objects, people, wires, blemishes, or lettering… tracked sign-text replacement")
    - **`ae-matte-painting`** ("editable VFX composite … from chroma-screen or pre-extracted footage… generate missing environment, object and effects layers driven by the source video's motion")
  - **Cloud bridge vs local**, per the migration table:
    - the cloud bridge had "Individual cloud layer/property tools", "HTML-to-scene, cloud preview, Lottie converter", "Image/video generation" and "Blender / Premiere tools"
    - locally, the HTML-to-scene/Lottie tools are "Not provided by this runtime", and generation is "A separately available provider"
    - Source: [bridge-mapping.md](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp/blob/main/skills/after-effects/ae-mcp-realities/references/bridge-mapping.md) **[verified]**
  - The same repo builds `@higgsfield_org/photoshop-mcp` (78 ops), `@higgsfield_org/premiere-mcp` (26 ops; assembly only, see §3) and `illustrator-mcp` (45 ops). The first two were published to npm on 22 Sep 2026 (0.1.0) **[verified]**. Offline tests "do not prove Adobe API compatibility or visual output quality" — [adobe/README.md](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp/blob/main/adobe/README.md) **[verified]**
- **Community AE MCPs:** Dakkshin/after-effects-mcp has 645 stars and was updated 23 Sep 2026 (GitHub search) **[verified]**. Others with frame-render feedback: Engine Room Games, a-y-ibrahim, aftr, kumo. See earlier notes [adobe_mcp.md](../Higgsfield%20Workflow%20Resolve%20vs%20Adobe/adobe_mcp.md).

**Higgsfield Vibe Motion (web, no-code)**
- Launched 5 Feb 2026 as a "no-code 'vibe' generator for motion graphics" — [SiliconANGLE, 5 Feb 2026](https://siliconangle.com/2026/02/05/higgsfield-launches-vibe-editor-creating-motion-graphics/) (snippet)
- Templates include "Infographics," "Text Animation," "Posters"; conversational edits ("Make the title bounce in energetically"); palette presets ("Mosaic," "Prism," "Candy"); "up to 4K UHD resolution at 60fps" MP4 — [Higgsfield Vibe Motion](https://higgsfield.ai/vibe-motion); [Text animation](https://higgsfield.ai/vibe-motion/text-animation); [gaga.art guide](https://gaga.art/blog/vibe-motion-higgsfield/) (snippets). A review exists — [Chase Jarvis: honest review](https://chasejarvis.com/blog/higgsfield-vibe-motion-is-here-my-honest-review-for-creative-pros/) (verdict not retrievable).
- Not present in the official CLI/skills **[verified by absence]** — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md)

**Captions**
- Remotion `/remotion-captions`; HyperFrames `/embedded-captions` (see above) **[verified]**
- Higgsfield's `explainer_video` assembler takes `--subtitles` with fonts `patrick`, `caveat`, `marker`, `anton` and concatenates ordered clip + audio pairs — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) **[verified]**
- Submagic API — [Submagic API](https://www.submagic.co/api); [docs](https://docs.submagic.co/introduction); [MCPBundles listing](https://www.mcpbundles.com/skills/submagic) (snippets; whether the MCP is official is unknown):
  - "captions, zoom effects, B-roll, transitions, background music, hook clips, and subtitles—all in one API call"
  - "123 languages"
  - an MCP server is listed
- ElevenLabs `speech-to-text` skill gives word timestamps — [elevenlabs/skills](https://github.com/elevenlabs/skills) **[verified]**. Resolve's API cannot place SRT subtitles (earlier notes).

**Resolve Fusion/titles via MCP** (earlier notes [davinci_resolve_mcp.md](../Higgsfield%20Workflow%20Resolve%20vs%20Adobe/davinci_resolve_mcp.md))
- Fusion comps can be added, but "the values inside them (e.g. a Text+ node's text) are not settable via the API". The workaround is exporting/editing/re-importing the `.comp` — [EddieRivers README](https://github.com/EddieRivers/davinci-resolve-mcp-free). samuelgursky claims Fusion input writes (conflict).
- Titles/generators "always drop onto… V1" and "can't be relocated afterward" — [api-coverage.md](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/docs/reference/api-coverage.md)

**Motion Canvas**
- MIT-licensed — [LICENSE](https://github.com/motion-canvas/motion-canvas/blob/main/LICENSE) **[verified]**; ≈19.2k stars (earlier notes). No official agent skill or MCP was found (not specifically searched in this session).

### Inferences
- **Recommended split for this user:**
  - Titles, lower thirds, kinetic captions and data callouts → HyperFrames (HTML is the model's strongest medium, and it has transparent overlay output and a Claude connector) or Remotion. Render as alpha overlays (ProRes 4444/transparent) and lay them over the Resolve timeline.
  - Designed, keyframe-heavy AE looks and cleanup/compositing → the Higgsfield local AE MCP plus skills (Claude Code config via `node dist/cli.js config`).
  - Skip Resolve Fusion for text via MCP.
- Quality depends on prompt specificity and a render→inspect→fix loop. All the serious tools now build that loop in: HyperFrames lint/snapshot, AE `ae_render_frame`, and Remotion community skills. Still expect design taste to need human direction (palette, type, pacing).

### Gaps
- No independent, dated quality comparison of HyperFrames vs Remotion vs AE-via-MCP output was found.
- It is unconfirmed whether the Higgsfield cloud bridge (`bridge.higgsfield.ai/mcp`) is being retired or will coexist with the local MCP. The repo only calls it the "former bridge".
- Pricing of HeyGen cloud rendering and of Submagic's API was not retrieved.
- Chase Jarvis's Vibe Motion verdict could not be read.

---

## 5. Color grading and looks (in-generation looks, Higgsfield AI LUT / `color_grading_lut`, Resolve LUT/CDL via MCP, film emulation/grain, matching shots from different models)

### Takeaway
Color work splits cleanly by automation level.

**Claude can automate:**
- in-generation looks (Cinematic Studio 3.5 `--color_grading`, 8 looks, plus `--light_scheme`)
- Higgsfield's `color_grading_lut` and `video_deflicker` jobs (CLI)
- LUT/CDL/DRX application in Resolve Studio 21.1 via the native MCP (`generate_lut`, `list_luts`, `update_dctl`)

**Still manual:**
- Higgsfield's **AI LUT Creator** panel in Resolve (source frame + reference → `.cube` or color nodes)
- Resolve Shot Match/Magic Mask
- film emulation (Dehancer/FilmConvert halation, bloom, gate weave, grain)
- wheels, curves, qualifiers and windows

Creators converge on one order for mixed-model footage:
1. normalize WB and exposure per clip
2. match to one hero frame
3. apply a film-stock LUT at 50–70%
4. add grain at 8–15% and a light blur

### Cited Findings
**In-generation looks (Higgsfield CLI)** — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) **[verified]**
- `cinematic_studio_video_3_5 --color_grading` offers `naturalistic_clean`, `bleached_warm`, `hyper_neon`, `teal_orange_epic`, `sodium_decay`, `cold_steel`, `bleach_bypass` and `classic_bw`. `--light_scheme` offers `soft_cross`, `contre_jour`, `overhead_fall`, `window`, `practicals` and `silhouette`. These cannot be combined with `--style_prompt`.
- Cinema Studio Video v2 is "Refined cinematic camera and color with genre control" — [model-catalog.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/model-catalog.md) **[verified]**

**Higgsfield AI LUT Creator / `color_grading_lut`**
- In the Resolve plugin (launched 8 Jun 2026, earlier notes): "The tool takes a source frame from your footage and a reference frame, a still, a graded shot, a photo, and builds the look from that pairing. The output comes back two ways: as a LUT in .cube format, or as color nodes applied directly to the current clip". Its stated purpose is to fix generated B-roll that "doesn't sit right in color next to camera originals" — [Higgsfield blog: Resolve](https://higgsfield.ai/blog/higgsfield-davinci-resolve); [Higgsfield plugin page](https://higgsfield.ai/plugins/davinci); [AnimeRenders, Aug 2026](https://creative.animerenders.com/2026/08/higgsfield-ai-video-davinci-resolve.html) (snippets). Italian creator video: "Replica qualsiasi color grade da un solo frame! AI LUT Creator" — [YouTube](https://www.youtube.com/watch?v=eebISsV7qlE) (title only).
- The CLI exposes a `color_grading_lut` utility job and a `video_deflicker` job. Their parameter schemas are only visible with an authenticated `higgsfield model get` — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) **[verified]**. Tested here: "Error: No workspace selected."

**Resolve via MCP (cross-reference, earlier notes [davinci_resolve_mcp.md](../Higgsfield%20Workflow%20Resolve%20vs%20Adobe/davinci_resolve_mcp.md))**
- Studio 21.1 (released 8 Sep 2026) ships a native stdio MCP. Users observe LUT/DCTL helpers `generate_lut`, `list_luts` and `update_dctl`, plus `run_script` — [resolve-mcp-burn-bench SETUP.md](https://github.com/RajanthaR/resolve-mcp-burn-bench/blob/main/docs/SETUP.md)
- "CDL is the main procedural correction surface available to the MCP". New nodes, wheels, curves, qualifiers, windows and "detailed OFX or ResolveFX parameter edits" are not creatable. The workaround is a prebuilt `.drx`, LUT or DCTL. Beware that `ApplyGradeFromDRX` "replaces the target graph" — [samuelgursky color-decision-guide.md](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/docs/guides/color-decision-guide.md)
- A community MCP bakes "colour matching to a reference with a baked `.cube` LUT" — [wassermanproductions/unofficial-davinci-mcp](https://github.com/wassermanproductions/unofficial-davinci-mcp)

**Resolve built-in AI color (UI)** — snippets
- "Auto Color for instant balanced footage and Shot Match for getting different clips to look consistent. Magic Mask … isolates [a subject] across the entire clip" — [Envato Tuts+](https://photography.tutsplus.com/articles/davinci-resolve-ai--cms-109186). Resolve 21 (NAB 2026) added a Photo page and "AI tools" — [RedShark News](https://www.redsharknews.com/davinci-resolve-21-nab-2026-photo-page-ai-tools). Third-party shot matching: [Colourlab AI for Resolve](https://colourlab.ai/colourlab-ai-for-davinci-resolve/).
- Caveat: AI "cannot replace professional color grading decisions such as look development and cinematic styling" — [AI Shot Matching guide](https://www.passionfuelsambition.com/ai-shot-matching-davinci-resolve-automate-color-grade) (snippet)

**Film emulation and grain for AI footage** — snippets
- "AI-generated footage arrives with a signature problem: it is too clean, with ultra-sharp, plasticky skin texture and contrast already baked in" — [invideo: LUTs, grain and the film look for AI video](https://invideo.io/blog/luts-film-grain-ai-video/)
- The best LUTs are "film-stock emulations applied at reduced strength": "free Kodak 2383 and Fuji 3510 at 60-80% opacity, or paid FilmConvert Nitrate ($99-$199) and Dehancer ($149/yr)". The recommended fixed order is "upscale, color correct, LUT at 50–70%, 35mm grain at 8–15%, then a light blur" — same source.
- "Dehancer goes further than color: it adds halation, bloom, and gate weave … what reads as 'shot on film' at a subconscious level, which makes Dehancer particularly effective at disguising the digital flatness of generated clips" — [PassionFuelsAmbition: Dehancer vs FilmConvert 2026](https://www.passionfuelsambition.com/best-film-emulation-plugin-2026-dehancer-vs-filmconvert-vs-pfa/). Colorist field guides: [Mixing Light: Dehancer 2026](https://mixinglight.com/color-grading-tutorials/dehancer-film-print-emulation-2026/); [Mixing Light: FilmConvert 2026](https://mixinglight.com/color-grading-tutorials/filmconvert-film-print-emulation-2026/); [xeremy grain plugin comparison](https://xere.my/comparisons/best-davinci-film-grain-plugins/). Attribution among merged snippets is approximate.

**Matching shots from different models** — snippets
- "Grade AI footage in four passes: normalize each clip's white balance and exposure against scopes (because different models render skin and shadows differently), apply a film-emulation LUT…, overlay grain and a touch of blur" — [invideo FAQ](https://invideo.io/faq/what-is-the-best-color-grading-workflow-for-ai-generated/)
- "Match shots before you stylize… pick one hero frame from your strongest clip as the reference… match every other clip to it across shadow tint, highlight warmth, saturation, and contrast—this is where AI productions usually fall apart when clips from different models cut together and skin shifts" — [invideo: AI color grading](https://invideo.io/blog/ai-color-grading/); [PyxelJam](https://pyxeljam.com/how-to-achieve-consistent-style-across-multiple-ai-generated-video-clips/) (merged)

### Inferences
- **Automatable color chain for Claude:**
  1. Constrain looks at generation time: the same `--color_grading`/`--light_scheme` for a sequence on Cinematic Studio 3.5, or identical look words for other models.
  2. Run `video_deflicker` where needed.
  3. Produce one match LUT per off-look clip against a hero frame. Use the Higgsfield `color_grading_lut` job if its schema accepts reference frames (unverified); otherwise the AI LUT Creator panel (manual click), or a Claude-computed `.cube`.
  4. Apply the LUTs/CDL via the Resolve Studio 21.1 MCP.
  5. Leave film emulation and grain as the only manual step (Dehancer/FilmConvert). A LUT cannot carry grain, halation or gate weave.
- **On free Resolve (no MCP):** Claude can still write `.cube` files and an FCPXML/EDL. You then apply them in the UI (earlier notes).

### Gaps
- The `color_grading_lut` job's inputs (reference image? strength? output `.cube`?) and cost are unknown without an authenticated CLI.
- Whether Resolve's Shot Match or Magic Mask can be triggered via the 21.1 scripting API is unverified.
- No test compares Higgsfield's AI LUT Creator with Resolve Shot Match or Colourlab on mixed-model footage.

---

## 6. Sound (native audio of Veo 3.1 / Kling 3.0 / Seedance 2.5; ElevenLabs SFX and music via MCP/API/skills; Seed Audio; MMAudio and other video-to-audio models; Lyria): cinematic sound design with the least manual work

### Takeaway
Native audio is now standard and good enough as a base layer:
- **Veo 3.1** is rated most natural: 48 kHz, well-timed SFX, on-set-sounding dialogue.
- **Seedance 2.5** has native dialogue, SFX, ambience and music, with lip-sync in 8+ languages including German.
- **Kling 3.0** has multi-character dialogue that is sometimes "slightly robotic".

For controllable sound design, Claude has these routes:
- **ElevenLabs** via official agent skills and CLI (`@elevenlabs/cli` 1.3.2): SFX v2 is 0.5–30 s, loopable and has prompt influence; Music v2 has composition plans. A hosted MCP at `api.elevenlabs.io/v1/mcp` is also reported to cover voice, music, image and video, though the Claude-directory listing shows agent tools.
- **Higgsfield's Seed Audio 1.0**, which is Higgsfield's default for SFX, foley and ambience (set 48 kHz; the default is 24 kHz). Mirelo T2A and Sonilo are "legacy" options.
- **Video-to-audio models** that sync to picture: Mirelo SFX v1 via fal/WaveSpeed (≤10 s). Open models carry licence traps: MMAudio weights are non-commercial, and HunyuanVideo-Foley's licence **excludes the EU**.

### Cited Findings
**Native audio in the generators**
- Veo 3.1 "generates native 48kHz synchronized audio in a single model pass … ambient environmental sounds, sound effects, and dialogue". It "produces the most natural-sounding audio… footsteps match the surface material" and "remains the only model in the category producing 48kHz dialogue that sounds like it was recorded on set" — [BuildFastWithAI: Seedance 2.5 vs Veo 3.1 vs Kling 3.0 (July 2026)](https://www.buildfastwithai.com/blogs/seedance-2-5-vs-veo-3-1-vs-kling-3-0-best-ai-video-2026); [3DAI Studio](https://www.3daistudio.com/blog/best-ai-video-generator-2026) (snippets; merged attribution)
- Kling 3.0: "lip sync isn't as tight as Veo's, and dialogue can sometimes sound slightly robotic", but it has "phoneme-level multi-character dialogue where each speaking character's mouth is synced individually" and "handles dialogue in five languages" — [WaveSpeed comparison](https://wavespeed.ai/blog/posts/seedance-2-0-vs-kling-3-0-sora-2-veo-3-1-video-generation-comparison-2026/); [Pixo](https://pixo.video/blog/seedance-vs-veo-vs-kling) (snippets; merged)
- Seedance 2.5 generates "dialogue with lip sync in 8 or more languages, sound effects, and ambient sound, all in the same pass". The languages include "German" with "phoneme-level accuracy that holds up across the full 30-second duration". Sound can be planned in "four lanes: dialogue, physical effects, ambience, and music", and quality "scales sharply with prompt specificity" — [Oakgen: Seedance 2.5 audio and lip-sync](https://oakgen.ai/blog/seedance-2-5-audio-lip-sync-scene-editing); [JXP](https://www.jxp.com/seedance/seedance-2-5); [Renderforest](https://www.renderforest.com/blog/how-to-use-seedance-2-5) (snippets; vendor-leaning)
- **Conflict:** one comparison claims "Seedance 2.0 does not currently have built-in audio generation" — [snippet from the comparison set above]. This is contradicted by Higgsfield's catalog, where `seedance_2_0 --generate_audio` defaults to `true` — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) **[verified]**. Another snippet says "Seedance 2.0 rates highest on the blind audio-included benchmark" (same comparison set; unverified).
- **Higgsfield CLI audio switches** [verified]:
  - `kling3_0 --sound on|off` (default on); `kling2_6 --sound`
  - `seedance_2_0/mini/1_5 --generate_audio` (default true)
  - `cinematic_studio_3_0/3_5 --generate_audio` (default false) with up to 15 references including `--audio-references`
  - `veo3_1_lite --generate_audio` (default false)
  - `wan2_7` takes one audio reference
  - Source: [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md)

**ElevenLabs (SFX, music) — Claude routes**
- **Official agent skills** (`npx skills add elevenlabs/skills`; last commit 9 Sep 2026) **[verified]**:
  - text-to-speech, speech-to-text, **sound-effects**, **music**, voice-changer, voice-isolator, dubbing, agents
  - "CLI - `npm install -g @elevenlabs/cli` … (wraps the REST API; reads `ELEVENLABS_API_KEY` automatically)"
  - Source: [elevenlabs/skills](https://github.com/elevenlabs/skills). `@elevenlabs/cli` 1.3.2 was published 19 Sep 2026 — [npm](https://www.npmjs.com/package/@elevenlabs/cli) **[verified]**
- **SFX skill details** — [sound-effects SKILL.md](https://github.com/elevenlabs/skills/blob/main/sound-effects/SKILL.md) **[verified]**:
  - `model_id` default `eleven_text_to_sound_v2`
  - `duration_seconds` "0.5–30s; auto-calculated if null"
  - `prompt_influence` default 0.3
  - `loop` ("Generate a seamlessly looping sound (v2 model only)")
  - output formats up to `pcm_48000` / `mp3_44100_192`
  - CLI: `elevenlabs text-to-sound-effects convert --text "…" --output thunder.mp3`
  - Prompt tip: "Specify style: 'Cinematic braam, horror'"
- **Music skill details** — [music SKILL.md](https://github.com/elevenlabs/skills/blob/main/music/SKILL.md) **[verified]**:
  - default `music_v2`
  - `music.compose`, and `music.compose_detailed` with "composition plan" and `store_for_inpainting=True`
  - `music.finetunes.*`
  - `music.upload` "is available to enterprise clients with access to the inpainting feature"
  - ElevenLabs Music was trained on licensed music (earlier notes)
- **Hosted MCP:** "available at https://api.elevenlabs.io/v1/mcp, with nothing to install… authenticates with OAuth… live now in Claude, ChatGPT, Cursor…". The capability list includes "Sound Effects and Music: Generate soundscapes, sound effects, or music tracks from text descriptions" and isolation/voice changer. A blog post announces "Voice, music, image, and video in the ElevenLabs MCP" — [ElevenLabs blog](https://elevenlabs.io/blog/introducing-voice-music-image-and-video-generation-in-the-elevenlabs-mcp); [TestingCatalog](https://www.testingcatalog.com/elevenlabs-mcp-can-now-generate-voice-music-images-video/); [ElevenLabs agent tooling docs](https://elevenlabs.io/docs/eleven-api/resources/agent-tooling) (snippets; date not retrieved)
  - **Conflict/uncertainty:** the Claude directory's ElevenLabs connector (same endpoint) is described as "Manage your ElevenAgents voice agents". Its visible tools are `agents_*` (79 tools, list truncated) — [claude.com/connectors/elevenlabs](https://claude.com/connectors/elevenlabs) **[verified]**. Whether SFX/music tools appear in Claude through that connector is unconfirmed. The earlier local `elevenlabs-mcp` is archived (earlier notes).
  - A community Claude Code MCP with 8 tools (TTS, SFX, music, …) exists — [wynandw87/claude-code-elevenlabs-mcp](https://github.com/wynandw87/claude-code-elevenlabs-mcp) (snippet)
- ElevenLabs also hosts video models — "Veo, Sora, Kling, Wan and Seedance" — since "ElevenLabs Image & Video (Beta)" (17 Nov 2025; **older**) — [ElevenLabs blog](https://elevenlabs.io/blog/introducing-elevenlabs-image-and-video) (snippet). It also has an API reference page "Video To Music" — [ElevenLabs docs](https://elevenlabs.io/docs/api-reference/music/video-to-music) (title only).
- ElevenLabs "Video-to-Sound" is reported "updated March 27, 2026" — [ElevenLabs Magazine](https://elevenlabsmagazine.com/elevenlabs-ai-sound-effects-guide-2026/) (snippet; unofficial site). The original demo "sampl[ed] 4 frames at 1 second intervals … sent to ChatGPT-4o to create a custom text-to-sound-effects prompt" — [Tom's Guide](https://www.tomsguide.com/ai/i-tried-the-new-elevenlabs-video-to-sound-effects-demo-and-its-pretty-amazing) (snippet; **older, likely 2024/25**)

**Higgsfield audio models** — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md); [model-catalog.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/model-catalog.md) **[verified]**
- **Seed Audio 1.0** is the "**Default audio generation.** Use for text-to-audio, sound effects, ambience, foley, impacts, environmental audio, voice-style generations, and music-like audio". Flags:
  - `--sample_rate` 8000–48000, **default 24000**
  - `--format` wav/mp3/pcm/ogg_opus
  - voice, speech/pitch/loudness rates
  - optional `--image-references` or up to 2 audio references
- **Mirelo Text to Audio**: "sound effects, ambience, foley, impacts, transitions" from `--prompt` + `--duration`. The skill says to use it "only when the user explicitly asks for Mirelo or you need that legacy SFX model".
- **Sonilo Music**: text-to-music, "specialist/legacy".
- To add audio to an ad, "use Marketing Studio Video with `--generate_audio true`".

**Video-to-audio (picture-synced SFX)**
- **Mirelo SFX v1 video-to-audio** — [WaveSpeed](https://wavespeed.ai/blog/posts/introducing-mirelo-ai-sfx-v1-video-to-audio-on-wavespeedai/); [fal: Mirelo SFX](https://fal.ai/models/mirelo-ai/sfx-v1/video-to-audio); [Replicate listing](https://www.aimodels.fyi/models/replicate/video-to-sfx-mirelo); [Adobe Exchange: Mirelo](https://exchange.adobe.com/apps/cc/8a13d073/mirelo-ai) (snippets):
  - "The video is the only required input… prompts are optional"
  - "processes videos up to 10 seconds in duration and can generate multiple variations"
  - available on WaveSpeed, fal (also a video-to-video variant that returns the clip with sound) and Replicate
  - an Adobe Exchange plugin exists
- **MMAudio** (CVPR 2025) — [hkchengrex/MMAudio](https://github.com/hkchengrex/MMAudio) **[verified]**:
  - "default output (and training) duration is 8 seconds"
  - code is MIT, but "checkpoints are released … under the CC-BY-NC 4.0 license", which means **non-commercial**
- **HunyuanVideo-Foley** — [Tencent-Hunyuan/HunyuanVideo-Foley](https://github.com/Tencent-Hunyuan/HunyuanVideo-Foley); [LICENSE](https://github.com/Tencent-Hunyuan/HunyuanVideo-Foley/blob/main/LICENSE) **[verified]**:
  - open-sourced 28 Aug 2025; XL model 29 Sep 2025
  - "48kHz Hi-Fi Output"
  - claims SOTA (self-reported)
  - VRAM "20GB for XXL model (or 12GB with `--enable_offload`), 16GB for XL model (or 8GB …)"
  - ComfyUI nodes exist
  - **Licence: "THIS LICENSE AGREEMENT DOES NOT APPLY IN THE EUROPEAN UNION, UNITED KINGDOM AND SOUTH KOREA"**
- **ThinkSound → PrismAudio**: ThinkSound appeared at NeurIPS 2025. Its successor PrismAudio ("video-to-audio with multi-dimensional CoT-RL", ICLR 2026) was released 24 Mar 2026 on a branch — [FunAudioLLM/ThinkSound](https://github.com/FunAudioLLM/ThinkSound) **[verified]**
- Krotos "Video to Sound" adds "automatic footsteps and cloth foley" — [MusicTech](https://musictech.com/news/gear/krotos-video-to-sound-footsteps-cloth-foley/) (snippet; date not retrieved)

**Music selection and mix automation**
- `sonicmatch-mcp`: "Watches the footage — not the script — and returns a shortlist, a 12–20s hook, and an ffmpeg ducking spec". It "prints the license" of royalty-free/CC matches — [js713-lab/sonic-match-mcp](https://github.com/js713-lab/sonic-match-mcp) **[verified]**
- HyperFrames `/hyperframes-audio` covers:
  - "voiceover carve (dip a music bed only in the bands the voice occupies…)"
  - an effect chain: "EQ, compressor, limiter, gate, saturation, delay, reverb…"
  - automation envelopes and submix buses
  - `/media-use` resolves BGM/SFX
  - Source: [hyperframes](https://github.com/heygen-com/hyperframes) **[verified]**
- Lyria 3 Pro costs "$0.08 per generation up to 184 s" and is reachable via Google's genmedia MCP. Suno has no first-party API. Licence-clean music (ElevenLabs, Lyria) is preferable for commercial work — earlier notes [end_to_end_pipeline.md](../Higgsfield%20Workflow%20Resolve%20vs%20Adobe/end_to_end_pipeline.md), citing [OpenMontage PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md).
- Creator/tool claims that ElevenLabs and Stable Audio are "definitive tools for AI-generated foley" come from a Higgsfield-run SEO page — [geo.higgsfield.ai](https://geo.higgsfield.ai/task/blog/best-tool-adding-realistic-foley-sound-effects-ai-vfx) (snippet; **low reliability**).

### Inferences
- **"Automatic cinematic sound design" recipe Claude can run end-to-end (Claude Code):**
  1. Keep native audio from Veo 3.1/Seedance 2.5/Kling 3.0 as the ambience/dialogue base (flags on).
  2. Have Claude watch the cut. Use frame extraction plus its own vision to write an event list (timecode → sound).
  3. Generate each event with ElevenLabs SFX v2 (0.5–30 s, loops for beds) or Higgsfield `seed_audio --sample_rate 48000`. For fast action shots, alternatively use Mirelo V2A per ≤10 s shot.
  4. Generate or choose music: ElevenLabs Music v2 composition plan, Lyria 3 Pro, or sonic-match for licensed stock.
  5. Mix with ffmpeg (ducking spec) or HyperFrames `/hyperframes-audio`, then loudness-normalize. Earlier notes mention EBU R128 tooling in a Resolve MCP.
  6. Do a final listen and Fairlight polish by hand.
- **Licensing for a German user:** do not use HunyuanVideo-Foley (not licensed in the EU) or MMAudio weights (non-commercial) for client or commercial work. Prefer ElevenLabs, Mirelo (commercial API), Seed Audio via Higgsfield, or Lyria. Check each platform's commercial terms.
- **Set 48 kHz everywhere:** Seed Audio defaults to 24 kHz, and video delivery is typically 48 kHz. This follows from the verified default.

### Gaps
- No price was found for ElevenLabs SFX/music credits, Mirelo V2A or Seed Audio credits.
- The exact tool list of the ElevenLabs hosted MCP as seen in Claude is unresolved (agents-only listing vs blog claims).
- No blind test compares the SFX quality of Veo 3.1 native vs ElevenLabs SFX v2 vs Mirelo vs Seed Audio.
- The Kling 3.0 "five languages" dialogue claim and the Veo 3.1 "48 kHz" figure are snippet-level and unverified on vendor pages.
- Whether ElevenLabs' video-to-sound/video-to-music endpoints are exposed in the API skills or CLI was not checked; the SFX skill documents text-to-SFX only.
