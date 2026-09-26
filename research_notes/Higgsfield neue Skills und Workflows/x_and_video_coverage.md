# Higgsfield's new skills and workflows in September 2026 (and related Claude-driven video workflows) as shown on X, YouTube, newsletters, press and GitHub (as of 26 Sep 2026)

> **How this was researched (read first).**
>
> **Access limits.**
> - x.com, youtube.com, reddit.com, higgsfield.ai, linkedin.com and every press, newsletter and blog domain tried (digitalproduction.com, runtimewire.com, cgpress.org, therundown.ai, bensbites, tldr.tech, heise, t3n, all-ai.de, medium, substack, jnack.com, chaseai.io, ohmyopus.com, openai.com) were blocked for direct fetching.
> - Reachable: the npm registry, PyPI and GitHub via `git clone` / raw.githubusercontent.com.
> - **[verified]** = read directly from the npm registry or from a git clone/raw file on GitHub.
> - **[snippet]** = post text or page summary as returned by the search engine. Where the engine merged several pages into one summary, that is flagged. No video was watched and no reply thread was read.
>
> **Dates.**
> - X post dates were decoded from the status ID (snowflake → exact UTC).
> - A LinkedIn activity ID and an Instagram reel shortcode were decoded the same way. The Instagram decode uses the commonly used formula and is treated as approximate.
> - YouTube upload dates cannot be decoded from IDs. Where given, they are the search engine's relative dates ("3 days ago", counted back from 26 Sep) and are marked "approx.".
> - Items before 1 Sep 2026 are marked **[older]** and only included as context.
>
> **Budget.** 40 web searches plus direct npm/GitHub reads.
>
> **Relation to earlier notes.** Not repeated here; only cross-referenced:
> - MCP/CLI setup, prices, plans, NLE plugins, the Aug 2026 paid-creator controversy and Sabrina Ramonov's "replace Higgsfield" wave → `../Higgsfield Workflow Resolve vs Adobe/higgsfield.md` and `../Higgsfield Workflow Automatisierung und Effekte/x_social_evidence.md`.
> - Already covered there: CLI 1.1.26 (18 Sep), Node SDK 0.2.6 (17 Sep), Python SDK 0.2.0 (17 Sep), `fnf-after-effects-mcp`, the 2 Sep Hell Grind thread and the 5 Sep "AGI is 100% solved" post.
>
> **Handles.** @higgsfield and @higgsfield_ai both post as "Higgsfield AI 🧩".

## 1. Which new Higgsfield skills, workflows, apps or features were announced in September 2026? Exact names, dates, claims

### Takeaway
In September 2026, Higgsfield's "new skills" are mostly not new generation models. They are **agent skills that drive desktop creative apps** through local MCP servers:
- **AI Motion Designer** for After Effects, via a ChatGPT plugin and GPT-6 Astra. Launched 10–11 Sep.
- A **"Production Skills Bundle"** with 11 named skills: Destruction-Studio, Exploded-view, Scene-Builder, Cartoon-shaders, Project-sorter, Shot-Composer, Shot-Cleanup, Vectorize, Image-fixer, use-touchdesigner and color-grading. They run "from ChatGPT or Claude".
- Behind the bundle: local MCP packages for **Blender, After Effects, Photoshop, Illustrator, Premiere Pro, TouchDesigner and DaVinci Resolve Studio**, published to npm by Higgsfield staff between 10 and 23 Sep.

Marketing was timed to two frontier-model launches:
- **GPT-6 Astra** (3–4 Sep)
- **Claude Opus 5.5** (22 Sep). @higgsfield_ai published 10 posts in about 28 hours after the Opus 5.5 launch post; the 8 whose text was indexed all describe "Opus 5.5 + Higgsfield" demo videos.

The public Claude Code skills repo (`higgsfield-ai/skills`) did **not** gain new skills in September. It only switched its defaults to GPT Image 2.5 and Seedance 2.5 on 11 Sep.

### Cited Findings

#### Dated timeline (UTC; "older" items for context only)
| Date | Event | Source |
|---|---|---|
| [older] 14 Jul 2026 | First "Claude inside After Effects" MCP connector (earlier "FNF bridge" generation). @higgsfield_ai: "Our Chief Motion Designer built this feature for himself first…" | [X](https://x.com/higgsfield_ai/status/2077060205603639759) [snippet] |
| [older] 20 Aug 2026 (approx., decoded from reel ID) | Instagram reel "Introducing Faceless Studio" | [Instagram](https://www.instagram.com/reel/DcRlm71C0oq/) [snippet] |
| [older] 25 Aug 2026 | "Introducing Higgsfield in Blender" | [X @higgsfield](https://x.com/higgsfield/status/2092255768770920506) [snippet] |
| 3 Sep 2026 | GPT-6 Astra released to approved users; general availability 4 Sep | [Wikipedia](https://en.wikipedia.org/wiki/GPT-6_Astra); [Layer3Labs](https://www.layer3labs.io/guides/openai-astra-release-date) [snippet] |
| 3 Sep 2026, 22:58 | "GPT-6 Astra × Higgsfield" post | [X @higgsfield](https://x.com/higgsfield/status/2095647685210669541) [snippet] |
| 10 Sep 2026 | `fnf-after-effects-mcp` 0.1.0 on npm. RuntimeWire: AI Motion Designer "introduced on September 10th" | [npm](https://www.npmjs.com/package/fnf-after-effects-mcp) [verified]; [RuntimeWire](https://runtimewire.com/article/higgsfield-chatgpt-after-effects-ai-motion-designer-astra) [snippet] |
| 11 Sep 2026, 13:52 | "Introducing Higgsfield AI Motion Designer" (ChatGPT plugin) | [X @higgsfield](https://x.com/higgsfield/status/2098409362041753708) [snippet] |
| 11 Sep 2026 | `higgsfield-ai/skills` switches defaults to GPT Image 2.5 and Seedance 2.5 | [GitHub](https://github.com/higgsfield-ai/skills/commits/main) [verified] |
| 11 Sep 2026, 23:50 | After Effects contest ("quote this post" with plugin-use proof) | [X @higgsfield_ai](https://x.com/i/status/2098559930014052386) [snippet] |
| 11–12 Sep 2026 | `fnf-blender-mcp` 0.1.0 and 0.2.0 on npm | [npm](https://www.npmjs.com/package/fnf-blender-mcp) [verified] |
| 12 Sep 2026 | "website → commercial" and "You don't need to learn After Effects anymore" posts | [X](https://x.com/higgsfield_ai/status/2098593474811703707); [X](https://x.com/higgsfield_ai/status/2098634561517482314) [snippet] |
| 14 Sep 2026 | Higgsfield Global Film Festival entry deadline ($1M pool) | [AI Film Contests](https://aifilmcontests.com/guide/how-to-win-higgsfield-global-film-festival-2026) [snippet] |
| 22 Sep 2026 | Anthropic releases Claude Opus 5.5 | [9to5Mac, 22 Sep](https://9to5mac.com/2026/09/22/anthropic-upgrades-claude-with-new-opus-5-5-model-details-here/); [Anthropic](https://www.anthropic.com/claude-opus-5-5) [snippet] |
| 22 Sep 2026, 17:32 | "Introducing Higgsfield x Claude Opus 5.5" | [X @higgsfield](https://x.com/higgsfield/status/2102451022216179935) [snippet] |
| 22 Sep 2026, 17:32 → 23 Sep 23:10 | ≥10 Opus 5.5 demo videos from @higgsfield_ai (see Q2) | [snippets] |
| 22–23 Sep 2026 | npm: `@higgsfield_org/` photoshop-mcp, illustrator-mcp, premiere-mcp (22 Sep) and touch-designer-mcp, davinci-resolve-mcp (23 Sep). New versions of the Blender and After Effects packages (23 Sep) | [npm, see below] [verified] |
| 23 Sep 2026 | Digital Production: "Higgsfield Brings AI Generation Into Blender. Oh, goodey." | [Digital Production](https://digitalproduction.com/2026/09/23/higgsfield-brings-ai-generation-into-blender-oh-goodey/) [snippet] |

#### A. AI Motion Designer (After Effects, via ChatGPT / GPT-6 Astra), 10–12 Sep
**Vendor claims**
- 11 Sep, @higgsfield: "ChatGPT can now do motion design in After Effects. Introducing Higgsfield AI Motion Designer. Our ChatGPT plugin understands animation principles, writes expressions, and retains context in your After Effects projects. Try Higgsfield's ChatGPT plugin now in After Effects." — [X](https://x.com/higgsfield/status/2098409362041753708) [snippet]
- 12 Sep, @higgsfield_ai: "GPT-6 Astra can now turn your product website into a commercial. Higgsfield AI Motion Designer uses your page as a reference to create a product video in After Effects. Camera movement, lighting, typography and animation stay editable. Try @Higgsfield /use-after-effects i…" — [X](https://x.com/higgsfield_ai/status/2098593474811703707) [snippet]
- 12 Sep, @higgsfield_ai: "You don't need to learn After Effects anymore. All you need to know is what you want to build GPT-6 Astra + Higgsfield can turn a prompt into a GPU plugin directly inside AE. Now you can build advanced 3D engines inside of AE allowing you to create insane 3D animations T…" — [X](https://x.com/higgsfield_ai/status/2098634561517482314) [snippet]

**Product page and blog**
- It "builds titles, transitions, and logo reveals in After Effects and Premiere Pro from a chat prompt — fully editable". The output arrives "as editable layers, keyframes and timing".
- It requires **active subscriptions to Higgsfield, GPT and Adobe After Effects**, and uses "the regular Higgsfield credit balance at the same rates as the web platform".
- Sources: [Higgsfield: AI Motion Designer](https://higgsfield.ai/ai-motion-designer); [Higgsfield blog](https://higgsfield.ai/blog/ai-motion-designer-after-effects-gpt) [snippet, merged summary]

**Distribution**
- Listed as a ChatGPT plugin ([ChatGPT Plugins](https://chatgpt.com/plugins/plugin_asdk_app_6a3293e129088191abf0875820e839da)) and in a Codex plugin marketplace ([codex-marketplace](https://www.codex-marketplace.com/plugins/higgsfield)) [snippet].
- Press: Startup Fortune headline "Higgsfield Puts a ChatGPT Plugin Inside Adobe After Effects and Premiere Pro" — [Startup Fortune](https://startupfortune.com/higgsfield-puts-a-chatgpt-plugin-inside-adobe-after-effects-and-premiere-pro/) [snippet]

**Date conflict**
- RuntimeWire says AI Motion Designer was "introduced… on September 10th, three days before promoting the workflow in a post on X" — [RuntimeWire](https://runtimewire.com/article/higgsfield-chatgpt-after-effects-ai-motion-designer-astra) [snippet]
- The X "Introducing" post is dated 11 Sep (decoded). The npm package 0.1.0 is dated 10 Sep 15:41 UTC [verified].
- Most likely reading: soft launch 10 Sep, X launch 11 Sep, further promotion 12–13 Sep.

**Context**
- This builds on the July 2026 "Claude inside After Effects" connector [older]. On 14 Jul, @DataChaz, @omarsar0, @aakashgupta and Japanese creator @seiiiiiiiiiiru all posted about it.
- @omarsar0: "It can build compositions, set keyframes, write expressions, and run the repetitive ExtendScript work for you, and everything it makes becomes an editable AE sc[ene]".
- Sources: [X @omarsar0](https://x.com/omarsar0/status/2077132773031088571); [X @DataChaz](https://x.com/DataChaz/status/2077101631469236624); [X @seiiiiiiiiiiru](https://x.com/seiiiiiiiiiiru/status/2077071634629071295) [snippets]
- The September package describes its skills as "adapted from the FNF bridge", and the old "bridge-ae" skills are archived in the repo (see B).

#### B. "Production Skills Bundle" and the local app MCPs (10–23 Sep)
**Bundle page**
- The bundle "includes 3D, VFX, editing, and design capabilities, and can be run from ChatGPT or Claude" — [Production Skills Bundle](https://higgsfield.ai/mcp/bundles/production-skills) [snippet]
- Named skills per app:
  - **Blender:** Destruction-Studio, Exploded-view, Scene-Builder, Cartoon-shaders
  - **Premiere Pro:** Project-sorter
  - **After Effects:** Shot-Composer, Shot-Cleanup
  - **Illustrator:** Vectorize
  - **Photoshop:** Image-fixer
  - **TouchDesigner:** use-touchdesigner
  - **DaVinci Resolve Studio:** color-grading

**Vendor claims on the per-skill pages** [snippet, merged summaries]
- **Shot-Composer:** "Create VFX composites in After Effects… combine footage and visual layers into editable VFX shots… with matched lighting, depth, and grain" — [Shot Composer](https://higgsfield.ai/mcp/shot-composer)
- **Shot-Cleanup:** "Remove unwanted objects in After Effects… preserving the shot's movement, texture, and editable layers" — [Shot Cleanup](https://higgsfield.ai/mcp/shot-cleanup)
- **Vectorize:** "Turn raster illustrations into editable Illustrator artwork with organized paths, groups, and layers" — [Vectorize](https://higgsfield.ai/mcp/vectorize)
- **Photoshop:** "Refine generated location images in Photoshop by asking which objects to remove and which textures to repair" — [Higgsfield MCP](https://higgsfield.ai/mcp)
- **TouchDesigner:** "Build visual effects for images and video in TouchDesigner, then preview, refine, and export the result" — [use-touchdesigner](https://higgsfield.ai/mcp/use-touchdesigner)
- **Blender:** "cinematic destruction… fractured structures, simulated debris, dust"; "exploded-view animations"; "stylized materials with toon shading, expressive outlines" — [Higgsfield MCP](https://higgsfield.ai/mcp)
- **Premiere:** "organizing footage, synchronizing sound, and preparing editable sequences"
- **After Effects:** "SaaS product animations… using app screens and brand assets"
- The @higgsfield X profile page (bio or pinned post; which one is unclear from the snippet) shows "Build 3D scenes, create VFX, clean up shots, grade footage, and more" — [X profile](https://x.com/higgsfield?lang=en) [snippet]

**The npm packages behind the bundle** [verified; maintainers `alensultanov_higgsfield_ai` and `arsu_higgsfield_ai`]

| Package | First published | Latest (23 Sep) | What it does / requirements |
|---|---|---|---|
| [`fnf-after-effects-mcp`](https://www.npmjs.com/package/fnf-after-effects-mcp) | 10 Sep | 0.1.3 | Native comp/layer/property/keyframe/effect/camera ops + "offline creative skills". "no cloud account or After Effects panel is required". Node 24+, macOS/Windows. `install-codex` registers it as `higgsfield-use-after-effects`. Based on MIT `mcp-aftereffects` (kumoproductions) |
| [`fnf-blender-mcp`](https://www.npmjs.com/package/fnf-blender-mcp) | 11 Sep | 0.2.2 | Controls a *background* Blender process. "No add-on, HTTP listener, WebSocket, cloud account or open Blender window is required". Blender 4.2+ |
| [`@higgsfield_org/photoshop-mcp`](https://www.npmjs.com/package/@higgsfield_org/photoshop-mcp) | 22 Sep | 0.1.2 | 78 operations. Previews and PSD/PNG/JPEG output. "Tested on macOS with Photoshop 27.10.0. Windows support is experimental" |
| [`@higgsfield_org/illustrator-mcp`](https://www.npmjs.com/package/@higgsfield_org/illustrator-mcp) | 22 Sep | 0.1.2 | 45 operations (artboards, paths, Bézier curves, typography, AI/SVG/PNG). Tested on macOS with Illustrator 30.8.1 |
| [`@higgsfield_org/premiere-mcp`](https://www.npmjs.com/package/@higgsfield_org/premiere-mcp) | 22 Sep | 0.1.3 | 26 operations via a signed CEP extension. Tested on macOS with Premiere Pro 26.5.1. Sequence creation needs a local `.sqpreset` and export needs an `.epr` preset |
| [`@higgsfield_org/touch-designer-mcp`](https://www.npmjs.com/package/@higgsfield_org/touch-designer-mcp) | 23 Sep | 0.1.1 | Offline `touch-design-master` skill. TouchDesigner 2025.33230+ and a valid key. Based on MIT `touchdesigner-mcp-server` 2.1.0 |
| [`@higgsfield_org/davinci-resolve-mcp`](https://www.npmjs.com/package/@higgsfield_org/davinci-resolve-mcp) | 23 Sep | 0.1.1 | Color page only. Offline `davinci-film-colorist` skill with LUT/DCTL assets. **Requires DaVinci Resolve Studio 21.1** with a valid Studio licence. "Free Resolve may expose the Python module but does not establish Studio scripting access" |

**Skill corpus in the source repo** [verified from a local snapshot]
- Source repo: [higgsfield-ai/fnf-local-pluging-bridge-mcp](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp). Snapshot HEAD = merge of PR #25 "skills/blender-corpus", 23 Sep 2026.
- A later `git fetch` asked for credentials, and the repo's own `creative-skills/README.md` says "keep this repository private until ownership and licensing are settled". So the repo is probably no longer public.
- Search-indexed PRs #27/#28: "add Photoshop, Premiere Pro, and Illustrator MCP packages" — [PR #28](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp/pull/28) [snippet]
- Skills in the snapshot:
  - **After Effects (13):** `ae-clean-rig` (entry point), `ae-cleanup`, `ae-matte-painting`, `ae-figma-transfer`, `ae-liquid-glass`, `ae-transition-kit`, `ae-ui-mastery`, `ae-depth-space`, `ae-design-first`, `ae-animation-principles`, `ae-build-orchestration`, `ae-mcp-realities`, `use-after-effects`
  - **Photoshop:** `ps-deslop`, `ps-retouch`
  - **Illustrator:** `illustrator-vector-art`
  - **Premiere:** `premiere-assembly`, `premiere-editing-director`, `premiere-editing-reference`, `premiere-radio-edit`, `premiere-vertical-content`
  - **Blender (17):** `blender-scene`, `blender-scene-spec`, `blender-greybox`, `blender-camera-blocking`, `blender-camera-led-assembly`, `blender-destruction`, `blender-modeling`, `blender-animation`, `blender-lookdev`, `blender-pbr`, `blender-hdri`, `blender-lighting-camera`, `blender-stylized-materials`, `blender-generation`, `blender-audit-finalize`, `blender-volatile`, `use-blender`
- The CHANGELOG ("Unreleased") calls the Photoshop (78 ops), Premiere (26) and Illustrator (45) packages "Independent private development MCP packages". It says they passed "native macOS acceptance for all operations", while "Windows and production distribution remain unverified". They were published to npm on 22–23 Sep anyway (see table).

#### C. Higgsfield for Blender add-on and the "Higgsfield Bridge" MCP ([older] launch 25 Aug; September press)
**Launch post**
- 25 Aug, @higgsfield: "Introducing Higgsfield in Blender. > Prompt the scene and build the blockout > Describe the camera move and get it animated > Adjust anything by hand > Reblock the whole shot in seconds Now available via Higgsfield MCP or Supercomputer." — [X](https://x.com/higgsfield/status/2092255768770920506) [snippet]

**What the add-on is**
- Cloud add-on, **Blender 5.1+** on Windows/macOS, delivered as a signed ZIP (drag onto a Blender window, log in).
- A floating bar with seven tabs: **Scene Builder, 3D Model, Character Animation, Image, Video, Camera, Asset**.
- "The number on the Generate button is the credit price… the variants counter multiplies it".
- Scene Builder returns "editable geometry in the open .blend". Character Animation returns "a fitted, weighted rig plus keyframes on the timeline — standard Blender bones and actions".
- Sources: [Higgsfield for Blender](https://higgsfield.ai/plugins/blender); [Higgsfield blog: Features, Installation, and MCP Bridge Setup](https://higgsfield.ai/blog/higgsfield-blender-plugin); [CGPress](https://cgpress.org/archives/higgsfield-for-blender-add-on.html); [Digital Production, 23 Sep](https://digitalproduction.com/2026/09/23/higgsfield-brings-ai-generation-into-blender-oh-goodey/) [snippets, merged]

**Bridge**
- `bridge.higgsfield.ai/mcp`, added as a connector named "Higgsfield Bridge". It "connects an agent to the add-on itself — so Claude can build in your open scene: blockouts, meshes at the cursor, Seedance renders".
- Example prompt: "Build me a calibration bay blockout in Blender." — [Higgsfield blog](https://higgsfield.ai/blog/higgsfield-blender-plugin) [snippet]
- A Cachephoto article is titled "Higgsfield Blender Plugin: camera control with your phone". No details were reachable — [Cachephoto](https://www.cachephoto.com/en/cineblog/higgsfield-blender-plugin-camara-telefono/) [snippet: title only]

**Two different Blender routes**
1. The cloud **add-on + Bridge** (August): needs a Higgsfield account, credits, Blender 5.1+.
2. The local **`fnf-blender-mcp`** (September): background Blender 4.2+, no add-on. Its `blender-generation` skill says "Generation spends the signed-in user's credits". The local server "has no model catalog, estimate, generation, polling or download tools", so it uses "an already connected Higgsfield service". [verified from repo snapshot]

#### D. Tie-ins with the model launches
**GPT-6 Astra**
- 3 Sep, @higgsfield: "GPT-6 Astra × Higgsfield: OpenAI's strongest model yet for coding, reasoning, and complex knowledge work, paired with real-time 3D generation. You can build a playable game from a single prompt: mechanics, story, and every asset generated by Higgsfield MCP. Coming soon to…" — [X](https://x.com/higgsfield/status/2095647685210669541) [snippet]
- Related blog: "Higgsfield MCP on GPT-6 Astra: Introducing Higgsfield Games 2.0" — [Higgsfield blog](https://higgsfield.ai/blog/higgsfield-mcp-gpt6-astra-games-2) (undated) [snippet: title only]

**OpenAI customer story** (undated, after 3 Sep): "Higgsfield AI ships new video features in a day with GPT-6 Astra"
- Higgsfield says it shipped "new exploration features just within a day, done by just one engineer".
- It says Astra runs its "most complex creative workflows while using up to 20% fewer tokens than other models tested".
- Example request: "Take my top-performing ad and generate 100 new variations"
- Source: [OpenAI](https://openai.com/index/higgsfield-from-prompt-to-production-with-astra/) [snippet]

**Claude Opus 5.5**
- 22 Sep, @higgsfield: "Introducing Higgsfield x Claude Opus 5.5. Anthropic's newest model, which is 40% cheaper and over 30% faster than Opus 5, is live on Higgsfield. Pair Opus 5.5 with the Higgsfield MCP and turn your most ambitious ideas into complete products. Available on Claude via Higgsf[ield MCP…]" — [X](https://x.com/higgsfield/status/2102451022216179935); mirrored on [Facebook](https://www.facebook.com/higgsfieldai.fb/posts/introducing-higgsfield-x-claude-opus-55anthropics-newest-model-which-is-40-cheap/122202076352777614/) [snippet]
- The "40% cheaper / >30% faster" figures match press on Anthropic's 22 Sep release — [9to5Mac](https://9to5mac.com/2026/09/22/anthropic-upgrades-claude-with-new-opus-5-5-model-details-here/) [snippet, merged summary]

#### E. What did *not* change: the official Claude Code skills repo, CLI and SDK
- `higgsfield-ai/skills` is still **v0.12.0 with 9 skills** (generate, soul-id, product-photoshoot, brandkit, marketplace-cards, websites, video-explainer, youtube-thumbnail, game-generation) — [GitHub README](https://github.com/higgsfield-ai/skills) [verified]
- Its only September commits are both from 11 Sep: "docs: add GPT social format guidance" and "docs: default to GPT Image 2.5 and Seedance 2.5" — [GitHub commits](https://github.com/higgsfield-ai/skills/commits/main) [verified]
  - New default image model: **GPT Image 2.5** "for image/design/text".
  - New default video model: **Seedance 2.5**, described as "SOTA… Supports 4–30s output up to 1080p; use Seedance 2.0 when native 4K is required".
  - Cheaper fallbacks: Kling 3.0 / Kling 3.0 Turbo.
- "Virality Predictor" (`brain_activity`) dates from 8 May 2026 and is not new [verified].
- Last pre-September skill additions [older]: YouTube Thumbnail and Brandkit (3–4 Aug); game generation folded into websites (7 Aug) [verified].
- CLI 1.1.25 (14 Sep) and 1.1.26 (18 Sep); Node SDK 0.2.4/0.2.6 (17 Sep) — [npm @higgsfield/cli](https://www.npmjs.com/package/@higgsfield/cli); [npm @higgsfield/client](https://www.npmjs.com/package/@higgsfield/client) [verified]
- Third-party packages also appeared, e.g. `@assemblyline-agents/higgsfield` 10.3.2 on 23 Sep, which calls itself "Official Assembly Line sandbox CLI connection and skills for Higgsfield" — [npm](https://www.npmjs.com/package/@assemblyline-agents/higgsfield) [verified metadata; the relationship to Higgsfield is not established]

#### F. Other items circulating in September
- **Faceless Studio** ([older], about 20 Aug):
  - Now "a standalone product (previously a Supercomputer skill)". Three steps: select script, style, narrator voice. Four categories: Education, History, Kids, Storytelling.
  - Episodes up to **5 min**. The Supercomputer skill still does up to **10 min** and is still reachable "through Higgsfield MCP in Claude and ChatGPT".
  - Sources: [Faceless Studio](https://higgsfield.ai/faceless-studio); [Higgsfield blog](https://higgsfield.ai/blog/faceless-youtube-videos-faceless-studio); [changelog](https://higgsfield.ai/creator-hub/changelog) [snippet]
- **Supercomputer "apps"**: Supercomputer "now builds full generative apps that create images, video, and 3D through Higgsfield models… no API keys or code needed". An app contest has a **$100,000** prize pool — [Higgsfield App contest](https://higgsfield.ai/contests/apps); [changelog](https://higgsfield.ai/creator-hub/changelog) [snippet; undated]
- **Higgsfield Global Film Festival:**
  - $1,000,000 split across 14 winners ($500k first prize).
  - Deadline **14 Sep 2026**; winners in the first week of October.
  - Sources: [AI Film Contests](https://aifilmcontests.com/guide/how-to-win-higgsfield-global-film-festival-2026); [Higgsfield blog](https://higgsfield.ai/blog/higgsfield-global-film-festival) [snippet]
- **Higgsfield For Good** (September) is covered in higgsfield.md.

### Inferences
- **What "new Higgsfield skills" on X most likely means:**
  - the ChatGPT/Codex `/use-after-effects` AI Motion Designer (from 11 Sep)
  - the Blender add-on and Bridge (from 25 Aug, re-promoted in September)
  - the 22–23 Sep Production Skills and app-MCP push, shown through Opus 5.5 demos
  - It does **not** mean the older `npx skills add higgsfield-ai/skills` Claude Code pack. That pack only had default-model updates in September.
- **Strategic shift.** Higgsfield is moving from "generate a clip" to "operate the editing and 3D app and leave an editable project". The skills encode craft rules such as easing, rigs and colour-grading references, and Higgsfield credits are spent only when media is generated.
- **Maturity.** The app MCPs were at version 0.1.x, published within the last 1–2 weeks. Their own changelog called them "private development" packages with Windows unverified days before publishing. They should be treated as early beta.

### Gaps
- The exact announcement date and post of the **Production Skills Bundle** could not be found. A site:x.com search for "Production Skills" returned nothing, so the page may be undated or announced under other wording.
- The contest deadline, prize and rules for the 11 Sep After Effects contest were truncated in the snippet ("Deadline: 1…").
- The content of the higgsfield.ai changelog for 5–26 Sep could not be read.
- It is unclear whether the ChatGPT-plugin route uses the same local `fnf-after-effects-mcp` package or GPT-6 Astra's computer-use mode. The contest post mentions "computer-use mode"; the npm package is a local MCP.

## 2. Which creator posts and videos circulate on X and YouTube? For each: account, date, what is shown, steps, credits, sponsorship

### Takeaway
- **After 15 Sep, the indexed record is dominated by Higgsfield's own accounts.** On 22–23 Sep, @higgsfield_ai posted at least 10 short "Claude Opus 5.5 (+Higgsfield)" demo videos: Blender models, games, After Effects animation, data labeling, several framed as "Opus 5.5 vs GPT-6 Astra/Sol".
- Independent creator content falls into three groups:
  - **Motion-design and tutorial videos around GPT-6 Astra + After Effects** (Chase AI, Jake Bartlett, a Portuguese channel, "$10,000 workflow" titles)
  - **Blender "save credits" previs videos**
  - **YouTube reaction videos** titled around Opus 5.5 + Higgsfield ("INSANE", "Build a Monster Truck", "Build a CHEAPER Higgsfield")
- None of the indexed September Higgsfield-related posts states credits spent, number of attempts or generation time. The only hard number is the vendor's object count for the Shinkansen (5,112 objects, 430 seats).
- No sponsorship disclosure was visible in any snippet.
- Higgsfield's 11 Sep contest required entrants to quote-post their After Effects work, which by design multiplies creator posts.

### Cited Findings

#### Higgsfield's own demo videos (X), 22–23 Sep 2026 [all snippet; exact UTC from ID]
| UTC | Post | What it claims |
|---|---|---|
| 22 Sep 18:52 | [@higgsfield_ai](https://x.com/higgsfield_ai/status/2102471046356177001) | "Claude Opus 5.5 vs GPT-6 Astra in 3D gaming. Samurai game demos made with Higgsfield." |
| 22 Sep 20:43 | [@higgsfield_ai](https://x.com/higgsfield_ai/status/2102499166635352354) | Text not indexed. A merged search summary describes an Opus 5.5 demo that "turned one house photo and its floor plans into a full 3D model in Blender, and also built an offline 3D browser viewer to explore each construction stage, X-ray the walls, and walk through the furnished interior". Attribution to this ID is uncertain |
| 22 Sep 21:15 | [@higgsfield_ai](https://x.com/higgsfield_ai/status/2102507018372436264) | "Claude Opus 5.5 is a beast at 3D modeling. 5,112 separate objects in this Shinkansen, down to all 430 seats inside. Built in Blender with Higgsfield." |
| 22 Sep 21:27 | [@higgsfield_ai](https://x.com/higgsfield_ai/status/2102510221797339567) | "Claude Opus 5.5 vs. GPT-6 Astra. Data labeling put to the test on the same street footage. Watch how the overlays follow people, buildings, and objects as the camera moves." |
| 22 Sep 22:34 | [@higgsfield_ai](https://x.com/higgsfield_ai/status/2102526940859232433) | "Opus 5.5 created an AAA-quality, game-ready octopus in Blender. From modeling to animation, built with Higgsfield." |
| 22 Sep 23:00 | [@higgsfield_ai](https://x.com/higgsfield_ai/status/2102533401110802552) | "Claude Opus 5.5 vs GPT-6 Sol for 3D game development with Higgsfield in Unreal Engine." |
| 22 Sep 23:59 | [@higgsfield_ai](https://x.com/higgsfield_ai/status/2102548479231082989) | "We created this game-style pixel-art animation in After Effects with Claude Opus 5.5 + Higgsfield. The jumps, changing expressions, and score counter give it that classic arcade feel." |
| 23 Sep 02:39 | [@higgsfield_ai](https://x.com/higgsfield_ai/status/2102588645937176625) | Text not indexed |
| 23 Sep 03:47 | [@higgsfield_ai](https://x.com/higgsfield_ai/status/2102605729039605826) | "Claude Opus 5.5 vs GPT-6 Sol in 3D game development. Two takes on a dogsled racing game. Made with Higgsfield." |
| 23 Sep 23:10 | [@higgsfield_ai](https://x.com/higgsfield_ai/status/2102898409028161644) | "Claude Opus 5.5 + Higgsfield vs. GPT-6 Astra in 3D game development. The game: an ant defending its home from a furious gardener. Check out the lighting through the leaves, the scale of the gardener, and how each version handles the fight." |

- Earlier September vendor posts: 3 Sep (GPT-6 Astra × Higgsfield game from a single prompt) and 11–12 Sep (AI Motion Designer, contest, website→commercial, "You don't need to learn After Effects anymore"). Quoted in Q1.
- None of these snippets gives prompts, run time, credits used or number of attempts.

#### Creator posts on X
- **12 Sep 2026, @Big_E:** "You can now control After Effects through ChatGPT using Higgsfield. Genuinely curious how people respond to this one. This feels less like AI replacing creativity and more like AI expediting your own creativity, letting you describe what you want and having it actually build the laye[rs]…" — [X](https://x.com/Big_E/status/2098924423810072576) [snippet]
  - Per a search summary, the post continues: "Rather than just generating 'AI slop,' you can use AI to execute the creative idea already in your head."
  - No disclosure is visible in the snippet.
- **[older] 29 Aug 2026, @JSFILMZ0412 (JSFILMZ):**
  - Blender previs workflow for Seedance 2.5 (steps in Q4) — [X](https://x.com/JSFILMZ0412/status/2093663876692754713)
  - Same day: "my first tutorial using this method @higgsfield_ai @adilinthewild @Blender" — [X](https://x.com/JSFILMZ0412/status/2093769456371556376) [snippets]
- **[older] 25 Aug 2026, @sonicpower1970** (Japanese reaction to Higgsfield in Blender): "もう今更Blenderを覚えられないのでMayaでやりたい。" ("I can't learn Blender at this point, so I'd rather do it in Maya.") — [X](https://x.com/sonicpower1970/status/2092264831344927062) [snippet]
- **23 Sep 2026, @OriSilver:** the same pattern with a competitor's MCP, not Higgsfield. "Claude Opus 5.5 + Maxfusion MCP + Blender is Ultimate control - I installed Blender. That was my whole job - I dropped in a video whose shot style and flow I wanted Claude Opus 5.5 broke it down and pulled 15 frames per second Claude Opus 5.5 rebuilt every shot in Blender (cam[era]…" — [X](https://x.com/OriSilver/status/2102817977812824335) [snippet]
- **Nate Herk (@nateherk)** long-form X articles (23 Sep): "Opus 5.5 vs GPT-6 Sol: 10 Real-World Tests" and "I Tested Opus 5.5 vs. GPT-6 Astra on 12 Real Use Cases". It is unclear whether Higgsfield is involved — [X](https://x.com/nateherk/article/2102613112272666829); [X](https://x.com/nateherk/article/2102904721698599231) [snippet: titles only]

#### YouTube videos
Upload dates are approx.; none was watched.

**GPT-6 Astra / AI Motion Designer + After Effects**
- **Jake Bartlett, "Higgsfield AI Motion Designer: I Tested the Claims"**, about 15 Sep (LinkedIn cross-post decoded 15 Sep 14:59 UTC).
  - Bartlett: professional motion designer since 2010, teaching After Effects since 2013.
  - A search summary says the thumbnail frames it as testing whether the marketing claim ("the end of the road for motion designers") holds up. His verdict was not in any snippet.
  - Sources: [YouTube](https://www.youtube.com/watch?v=QLZNiwaKqWg); [LinkedIn](https://www.linkedin.com/posts/jake-bartlett-b46a4b1a7_higgsfield-ai-motion-designer-i-tested-the-activity-7505641495929077760-vd9c); [Jake In Motion](https://www.jakeinmotion.com/) [snippet]
- **"GPT-6 Astra Just Unlocked Motion Design + After Effects"** (likely Chase AI; attribution not confirmed), with an accompanying blog "GPT-6 Astra + After Effects Motion Design Guide" (steps in Q4) — [YouTube](https://www.youtube.com/watch?v=C8dWdic-oK4); [Chase AI blog](https://www.chaseai.io/blog/gpt-6-astra-after-effects-motion-design) [snippet]
- Other titles, all [snippet: titles only]:
  - "I'm a motion designer - I let GPT 6 Astra do my job in After Effects." — [YouTube](https://www.youtube.com/watch?v=snE_HqUDBrE)
  - "AI Motion Graphics You Can Actually Edit (GPT-6 Astra + After Effects)" — [YouTube](https://www.youtube.com/watch?v=oFzUfUL0J1I)
  - "GPT 6 Astra + After Effect = $10,000 Complete Workflow" — [YouTube](https://www.youtube.com/watch?v=6CjaLNC_A9o)
  - "Higgsfield AI Motion Designer | ChatGPT x After Effects" — [YouTube](https://www.youtube.com/watch?v=_J41U1ceZLA)
  - Portuguese: "GPT-6 Astra + After Effects: A IA finalmente venceu os designers?" ("Has AI finally beaten designers?") — [YouTube](https://www.youtube.com/watch?v=22lNPHyO7xE)

**Blender + Higgsfield (credit-saving previs framing)**
- "New Blender + Claude + Higgsfield AI Workflow Beats Every AI Video Tool" (approx. early Sep, "3 weeks ago"; features the "free Higgsfield Blender Plugin") — [YouTube](https://www.youtube.com/watch?v=OG7cnI9B4PM)
- "How To Save AI Credits With Higgsfield + Blender (No One Talks About This Workflow)" — [YouTube](https://www.youtube.com/watch?v=OiULPvTJ-0E)
- "Blender + Higgsfield Is The Hack For UNLIMITED Ai Video Credits (Thank Me Later)" — [YouTube](https://www.youtube.com/watch?v=xlRDXFS5fi8)
- "Seedance 2.5: How to Save AI Credits with Blender & Higgsfield" — [YouTube](https://www.youtube.com/watch?v=CZ_FW1QDAxo) [snippets: titles only]

**Claude Opus 5.5 + Higgsfield** (all about 22–25 Sep)
- "Claude Opus 5.5 x Higgsfield MCP | Build a Monster Truck" (approx. 24 Sep). Its description reuses the vendor's "40% cheaper and over 30% faster than Opus 5" wording, so it is likely a Higgsfield channel upload (unconfirmed) — [YouTube](https://www.youtube.com/watch?v=9loDDILgssM)
- "I Mixed Higgsfield with Claude Opus 5.5 - It's INSANE" — [YouTube](https://www.youtube.com/watch?v=AlJWfhAIrOI)
- "I Let Claude Opus 5.5 Build A CHEAPER Higgsfield AI" (approx. 23 Sep; an "alternative" angle) — [YouTube](https://www.youtube.com/watch?v=dLHli12cHIs)
- "Making a Open World RPG w/ Claude Opus 5.5 [1]" (Unreal Engine plus Higgsfield per the search summary) — [YouTube](https://www.youtube.com/watch?v=bm67BRQHn_I)
- "How To Create VOX STYLE Animation With Opus 5.5 | IN 10 MINUTES" — [YouTube](https://www.youtube.com/watch?v=WoNgl4qpogk)
- "Claude Opus 5.5 Is Crazy Good for design! (3D Animated Websites)" (approx. 23 Sep) — [YouTube](https://www.youtube.com/watch?v=-NM6Eq1LDUQ) [snippets]
- Written tutorial: "Claude Opus 5.5 + Seedance 2.5: AI Car Commercial Tutorial (Higgsfield MCP)" — [mortaf3.com](https://mortaf3.com/posts/claude-opus-55-seedance-25-ai-car-commercial-tutorial-paftv) [snippet: title only]

**[older] Mid-2026 Claude + Higgsfield MCP tests that still circulate**
- "I Tested Higgsfield's Official MCP In Claude" (29 Apr) — [YouTube](https://www.youtube.com/watch?v=MMGVGA2DYro)
- "I Built a $1.62 AI Content Factory With Claude + Higgsfield MCP" (9 Jun) — [YouTube](https://www.youtube.com/watch?v=qI9_BEC-8MY)
- "HIGGSFIELD MCP + CLAUDE OPUS 5 - What you can Actually Build" (29 Jul) — [YouTube](https://www.youtube.com/watch?v=MnPygZ3SIOs)
- "Claude Replaced Higgsfield with This FREE MCP" — [YouTube](https://www.youtube.com/watch?v=IUV8QzwIb6g) [snippets]

**Sponsorship.** No "#ad", "paid partnership" or "sponsored" marker appeared in any September snippet. Absence in a snippet is not evidence of no sponsorship. Paid Higgsfield partnerships were confirmed in Aug 2026 and paid quote-tweets were reported in Feb 2026; see x_social_evidence.md Q3.

### Inferences
- A viewer scrolling X on 22–24 Sep would mostly have seen vendor demos. "Built with Higgsfield" there means Opus 5.5 (or GPT-6) driving Blender, Unreal or After Effects through Higgsfield's MCP and skills, with Higgsfield generating some assets.
- The "vs GPT-6 Astra/Sol" format markets Higgsfield as the model-neutral harness rather than as a model.
- Contest mechanics (quote-post with proof) and launch-day timing explain the volume of near-identical posts. They are not independent evidence of quality.

### Gaps
- Independent creator X posts about the **Production Skills** (Shot-Composer, Shot-Cleanup, Vectorize, color-grading, TouchDesigner) after 15 Sep were not found in snippets.
- View counts, like counts and follower counts were not visible.
- The YouTube verdicts (Bartlett, "Build a CHEAPER Higgsfield") are unknown without watching.
- The prompts, run times and credit costs of the vendor demos are not public in any reachable source.

## 3. What do replies, reviews, Reddit threads and newsletters say about quality, cost, reliability and limits? Hype vs demonstrated

### Takeaway
Independent written criticism of the September launches is thin but pointed:
- **Digital Production (23 Sep)** mocks the Blender add-on ("Oh, goodey") and, per a search snippet, calls Higgsfield "a cloud AI slop platform".
- **Credit burn** is the recurring complaint. Integrations never get "Unlimited" pricing, and there is a cottage industry of "save credits with Blender previs" videos.
- **Professional motion designers** (Jake Bartlett) publicly "tested the claims".

The most concrete, reliable picture of the limits comes from **Higgsfield's own package READMEs and skill descriptions**. They are candid:
- macOS-only testing, Windows "experimental"
- Resolve Studio (paid) only
- missing Photoshop healing tools
- Illustrator Image Trace needs an extra runtime
- Premiere needs presets for export
- "check current MCP limits before promising reframing, captions, music mixing, or color"

Vendor superlatives ("AAA-quality", "You don't need to learn After Effects anymore", "AGI is 100% solved") are undemonstrated claims.

### Cited Findings

#### Critical press and reviewer voices
- **Digital Production, 23 Sep 2026:**
  - Headline "Higgsfield Brings AI Generation Into Blender. Oh, goodey." — [Digital Production](https://digitalproduction.com/2026/09/23/higgsfield-brings-ai-generation-into-blender-oh-goodey/) [snippet]
  - Per the search summary: "a cloud AI slop platform for image, video and 3D generation, with integrations for production tools including DaVinci Resolve, Figma and now Blender." [snippet; exact wording not verified]
  - The same summary also concedes that "several tools return data artists can continue editing inside Blender rather than just another prompt box." [snippet]
- **Jake Bartlett** (motion-design educator) tested the AI Motion Designer marketing claims, about 15 Sep; verdict not captured — [YouTube](https://www.youtube.com/watch?v=QLZNiwaKqWg) [snippet]
- **@Big_E** framed the After Effects plugin as a test of reception: "Genuinely curious how people respond to this one" — [X, 12 Sep](https://x.com/Big_E/status/2098924423810072576) [snippet]
- **Uncertain-provenance "backlash" snippet** (probably about [older] Vibe Motion from Feb 2026, not the September product):
  - "The actual software experience triggered massive backlash… motion designers require exact temporal consistency and precise easing curves… the platform outputs unpredictable, jittery visuals that demand endless hours of manual tweaking."
  - This most likely comes from [GPTProto: "Higgsfield Vibe Motion: Fact vs Fiction"](https://gptproto.com/news/higgsfield-vibe-motion) [snippet; merged summary]. Do not attribute it to AI Motion Designer.
- **Reddit:** no September 2026 Reddit thread on AI Motion Designer, the Blender add-on or the Production Skills surfaced in the searches. The search engine returned X or vendor pages instead.

#### Cost and credits
- AI Motion Designer requires paid Higgsfield + ChatGPT + After Effects subscriptions and uses "the regular Higgsfield credit balance at the same rates as the web platform" — [Higgsfield](https://higgsfield.ai/ai-motion-designer) [snippet]
- Blender add-on:
  - "uses the same Higgsfield account and credit balance… no separate Blender licence pool"
  - "'Unlimited' has an asterisk once Blender is involved… generations through integrations and automated tools consume credits"
  - Users report "the add-on consumes credits quickly when asked to do simple tasks"
  - Sources: [Higgsfield for Blender](https://higgsfield.ai/plugins/blender); [Digital Production](https://digitalproduction.com/2026/09/23/higgsfield-brings-ai-generation-into-blender-oh-goodey/) [snippet; merged summary, attribution of each sentence uncertain]
- The local app MCPs themselves need **no Higgsfield account**: After Effects "no cloud account or After Effects panel is required"; Blender "No… cloud account". Credits are spent only when a connected Higgsfield service generates media. The Blender skill requires "a non-spending estimate" and explicit user approval against a budget before spending — [npm fnf-after-effects-mcp](https://www.npmjs.com/package/fnf-after-effects-mcp); [npm fnf-blender-mcp](https://www.npmjs.com/package/fnf-blender-mcp) [verified]; blender-generation SKILL in [repo snapshot](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp) [verified]
- A tutorial claims the "Higgsfield Motion Designer plugin… is free and open source" — [Chase AI](https://www.chaseai.io/blog/gpt-6-astra-after-effects-motion-design) [snippet]
  - This is only partly consistent with the facts. The local After Effects MCP is free on npm, but its licence is "SEE LICENSE IN UPSTREAM.md" (MIT upstream) [verified]. The ChatGPT-plugin product requires paid subscriptions [snippet].
- Third-party software costs: the DaVinci route needs **Resolve Studio 21.1** (paid). TouchDesigner needs "a valid TouchDesigner key" [verified].

#### Limits documented by Higgsfield's own packages [verified]
- **Photoshop MCP** — [npm](https://www.npmjs.com/package/@higgsfield_org/photoshop-mcp):
  - "Rich-text ranges, linked Smart Objects, advanced gradients and general undo transactions are not supported."
  - `batch.run` "stops on error without rolling back completed steps"
  - "Native errors may leave partial changes"
- **Photoshop skill `ps-deslop`** (≈ "Image-fixer"): "The local Photoshop MCP covers basic document, layer, selection, mask and filter operations, but not the complete Healing, Gradient Fill, Lens/Radial Blur or donor workflow."
- **`ps-retouch`**: "edit a photograph only when an external image_gen editor is actually available and authorized. This is not a native Photoshop MCP retouching operation." — [repo snapshot](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp)
- **Illustrator `illustrator-vector-art`** (≈ "Vectorize"): "Staged Image Trace and semantic bundle construction require a separately available Python/JSX runtime; the local Illustrator MCP alone supports direct native paths, shapes, layers and export for simpler work… Exclude… demonstrations requiring manual Pen drawing." — [repo snapshot]
- **Premiere:**
  - `premiere-vertical-content`: "check current MCP limits before promising reframing, captions, music mixing, or color"
  - `premiere-radio-edit`: "more complex splitting, ripple edits, fades, and gain require an available UI or another verified tool"
  - The package has only 26 operations and needs local `.sqpreset`/`.epr` presets — [repo snapshot]; [npm](https://www.npmjs.com/package/@higgsfield_org/premiere-mcp)
- **Resolve MCP** — [npm](https://www.npmjs.com/package/@higgsfield_org/davinci-resolve-mcp):
  - Colour page only (CDL, LUT, versions)
  - "`dr_set_cdl` has no readback API; check the actual frame and scopes"
  - "A timed-out write blocks further writes until you inspect Resolve"
- **Platform:** Photoshop, Illustrator and Premiere are "Tested on macOS… Windows support is experimental" — [npm READMEs] [verified]
- **Blender local MCP:** "it cannot access unsaved work in an already-open desktop Blender… Disconnecting loses unsaved session changes." — [npm](https://www.npmjs.com/package/fnf-blender-mcp)
- **Evaluation status:** the repo's skill evaluation file says "These are prepared evaluation cases, not a claim that an independent model evaluation has been run." — [repo snapshot](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp)

#### Hype markers (vendor wording without shown evidence)
- "AAA-quality, game-ready octopus" — [X, 22 Sep](https://x.com/higgsfield_ai/status/2102526940859232433)
- "Claude Opus 5.5 is a beast at 3D modeling" (5,112 objects) — [X, 22 Sep](https://x.com/higgsfield_ai/status/2102507018372436264)
- "You don't need to learn After Effects anymore" — [X, 12 Sep](https://x.com/higgsfield_ai/status/2098634561517482314)
- "build a playable game from a single prompt" — [X, 3 Sep](https://x.com/higgsfield/status/2095647685210669541)
- "AGI is 100% solved" (5 Sep; see x_social_evidence.md)
- "40% cheaper and over 30% faster": Anthropic's model claim, reused by Higgsfield as its own launch copy — [X, 22 Sep](https://x.com/higgsfield/status/2102451022216179935)
- A deflating analysis of the whole Opus-5.5 video wave, from an AI-routing vendor's blog: "Claude Opus 5.5 is not a video-generation model… what the demos demonstrate is long-horizon code generation with a creative brief" — [OrcaRouter](https://www.orcarouter.ai/blog/claude-opus-5-5-product-video-skill) [snippet]

### Inferences
- **Demonstrated:**
  - Published, installable local MCPs with concrete operation counts (78/45/26 ops; the After Effects runtime has about 198 operations per the upstream changelog).
  - Skills that encode professional craft steps.
  - Edits land as **editable** native project data (layers, keyframes, rigs, CDL/LUT nodes).
- **Not demonstrated:**
  - Quality parity with human motion designers, VFX compositors or colourists.
  - Windows reliability.
  - Real credit cost per finished shot.
  - How many retries the showcase videos needed.
- **Practical cost for the user:** an After Effects/Blender/Photoshop licence (or Resolve **Studio**), a Claude or ChatGPT plan, plus Higgsfield credits for every generated asset. "Unlimited" plans do not cover integrations.
- **Resolve distinction:**
  - The June 2026 Higgsfield Resolve *panel plugin* reportedly runs in the free Resolve (see higgsfield.md Q3).
  - The September Resolve *MCP* behind the "color-grading" skill needs **Resolve Studio 21.1** and only covers the Color page.

### Gaps
- The full Digital Production text, Jake Bartlett's verdict and replies under the vendor posts are not reachable.
- No newsletter (The Rundown, Ben's Bites, TLDR, Superhuman) coverage of AI Motion Designer or the Production Skills surfaced in the searches. The Rundown only appeared with older tool pages.
- No German-language coverage of the September launches surfaced (all-ai.de, t3n and heise were not indexed for these topics).

## 4. Textual transcripts, summaries or step lists of the most-shared videos (blogs, newsletters, GitHub READMEs)

### Takeaway
No video transcripts were reachable. Usable written step lists exist for:
- the **ChatGPT → After Effects** route (vendor steps, and Chase AI / John Nack's 3-step method)
- the **Blender previs → Seedance 2.5** route (JSFILMZ; Higgsfield's Bridge)
- the **local app MCPs** (npm READMEs: install → doctor → config → probe → skill lookup)

### Cited Findings
- **AI Motion Designer (vendor):** "Connect Higgsfield to ChatGPT, type @higgsfield /use-after-effects, and describe what you want to animate" — [Startup Fortune](https://startupfortune.com/higgsfield-puts-a-chatgpt-plugin-inside-adobe-after-effects-and-premiere-pro/) [snippet]
- **Contest version (11 Sep):** "1. Open ChatGPT and install Higgsfield from Plugins. 2. Type @Higgsfield /use-after-effects. 3. Create your animation with GPT-6 Astra in computer-use mode in Adobe After Effects. 4. Submit your work and plugin-use proof by quoting this post on X. Deadline: 1…" — [X](https://x.com/i/status/2098559930014052386) [snippet]
- **Chase AI guide, "exact 3-step workflow… with zero After Effects experience"** — [Chase AI](https://www.chaseai.io/blog/gpt-6-astra-after-effects-motion-design) [snippet]:
  1. **Storyboard:** use Astra to generate a storyboard first, "to ensure visual alignment and prevent inefficient prompting loops". Reference videos can be supplied for style.
  2. **Prompt & build:** give Codex a detailed prompt describing scenes ("beats") and effects. Templates come from the creator's GitHub. The AI "generate[s] scripts, perform[s] the animation in After Effects, and automatically check[s] its own work".
  3. **Edit:** follow-up prompts to refine specific graphics, transitions or audio.
  - The same 3-step structure appears in John Nack's 14 Sep post "Tutorial: Use Astra to drive After Effects" — [Nackblog](http://jnack.com/blog/2026/09/14/tutorial-use-astra-to-drive-after-effects/) [snippet; merged summary, may be relaying Chase AI's video]
- **Blender previs for Seedance 2.5** — [X @JSFILMZ0412, 29 Aug](https://x.com/JSFILMZ0412/status/2093663876692754713) [snippet; steps 3–4 from the search summary]:
  - Hook: "Stop wasting hundreds of AI credits trying to get precise camera movement in Seedance 2.5"
  1. "Connect Claude Desktop to Blender via the Higgsfield MCP bridge"
  2. "Let Claude generate your 3D gray-box blockout scene in minutes"
  3. "Tweak your camera path & render a 1080p playblast"
  4. "Feed the blockout into Seedance 2.5 as a motion reference for one-shot results with 100% camera & framing control"
- **Higgsfield Bridge setup:** add the connector "Higgsfield Bridge" (`bridge.higgsfield.ai/mcp`) in the agent's settings, sign in, then prompt "Build me a calibration bay blockout in Blender." — [Higgsfield blog](https://higgsfield.ai/blog/higgsfield-blender-plugin); earlier explainer [explainx.ai, Aug 2026](https://explainx.ai/blog/higgsfield-blender-mcp-ai-blockout-august-2026) [snippet]
- **Blender add-on install:** "download the .zip from the plugin page, drag it onto any open Blender window (it installs and enables itself), then open the Higgsfield panel, log in, and start generating" — [Higgsfield help center](https://higgsfield.ai/creator-hub/help-center/integrations/external-integrations-higgsfield) [snippet; merged summary, so the exact source page is uncertain]
- **Local app MCP install pattern** [verified] — npm READMEs for [Photoshop](https://www.npmjs.com/package/@higgsfield_org/photoshop-mcp), [Illustrator](https://www.npmjs.com/package/@higgsfield_org/illustrator-mcp), [Premiere](https://www.npmjs.com/package/@higgsfield_org/premiere-mcp), [TouchDesigner](https://www.npmjs.com/package/@higgsfield_org/touch-designer-mcp), [Resolve](https://www.npmjs.com/package/@higgsfield_org/davinci-resolve-mcp), [Blender](https://www.npmjs.com/package/fnf-blender-mcp), [After Effects](https://www.npmjs.com/package/fnf-after-effects-mcp):
  - `npm install --global @higgsfield_org/<app>-mcp` → `fnf-<app> doctor` → `fnf-<app> config` (paste the printed entry into the MCP client; `--format toml` for Codex) → `fnf-<app> probe`.
  - Premiere adds `install-bridge` (signed CEP extension, then restart Premiere).
  - TouchDesigner adds `setup` (token plus a Textport command per project; loopback port 9981).
  - Resolve needs Preferences → System → General → External scripting → Local.
  - First calls in After Effects: `ae_get_skill({})` → `ae_get_skill({"name":"ae-clean-rig"})` → `ae_project_info({})` → `ae_catalog({})` → `ae_do(...)` — [repo snapshot README](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp) [verified]
- **Vendor-demo step lists:** none of the 22–23 Sep Opus 5.5 posts shows its prompt or steps in the indexed text.

### Inferences
- The After Effects and Blender step lists share a principle: **plan or block out first, generate last**. Storyboard or greybox first, then build or generate. This matches Higgsfield's own 2 Sep advice ("storyboard > Blender previs > AI", in x_social_evidence.md). It is the most consistent practical lesson across vendor and creator material.

### Gaps
- No transcripts of the Chase AI, Bartlett, "Monster Truck" or "I Mixed Higgsfield with Claude Opus 5.5" videos were reachable.
- The Higgsfield blog step lists are only available as snippets.

## 5. Besides Higgsfield: other Claude-driven video workflows widely shared on X in the second half of September 2026

### Takeaway
The Claude Opus 5.5 launch (22 Sep) triggered a wave of **code-rendered video** posts. In these, Claude writes HTML/React/three.js/Remotion or HyperFrames code that renders frames locally, with no generative video model involved:
- a HyperFrames launch video "1-shotted… in less than 20 mins"
- a fully code-drawn animated short with code-written music
- a 3-minute Remotion "history of AI" in about 7,400 lines of code, made in about 1 hour

The most reusable artifact is an open **product-video skill** by Chinese creator 歸藏 (op7418, "guizang"), published 18 Sep. Sober voices stress that Opus 5.5 "can't generate an image or a video directly".

### Cited Findings
- **22 Sep 16:55 UTC, @Miguel07Code (Miguel Ángel):** "Claude Opus 5.5 1-shotted the launch video of @shotbaseapp using @HyperFrames_ in less than 20 mins no way 🤯" — [X](https://x.com/Miguel07Code/status/2102441708395041170) [snippet]
- **22 Sep 22:39 UTC, @liu8in (Bin Liu):** "opus 5.5 might be the new GOAT the classic test, made with @threejs & @HyperFrames_" — [X](https://x.com/liu8in/status/2102528278732894667) [snippet]
- **22 Sep 22:53 UTC, @Voxyz_ai (Vox):** "holy shit, opus 5.5 is kind of insane at animation. i didn't write a single line of code. it wrote the story, drew every frame, and made the music. no image assets at all, it's all JS. the story is called 'small print': claude gets a pile of requests every day. it circles the human part…" — [X](https://x.com/Voxyz_ai/status/2102531681450119426) [snippet]
- **23 Sep 19:36 UTC, @kimmonismus (Chubby):** a 3-minute film on the history of AI "from 'Attention is all you need' to AGI. No stock footage, no image or video generators: every frame is rendered from code… made 100% in code by Claude in Claude Code: ~7,400 li[nes] of React/TypeScript (Remotion), every image drawn in SVG and Canvas, an open-source TTS voice, and a score synthesized in Python". The search summary gives "about 1 hour" — [X](https://x.com/kimmonismus/status/2102844654169575547) [snippet]
  - Analysis piece: [OrcaRouter: "Claude Opus 5.5: What a Code-Rendered AI Film Shows"](https://www.orcarouter.ai/blog/claude-opus-5-5-code-rendered-ai-history-film) [snippet: title]
- **24 Sep 20:54 UTC, @EricBuess (curation thread):** "Claude Opus 5.5 can't generate an image or a video directly. It can write code that draws, animates and edits one, and this week people have been finding out how far that goes. A few that stood out to me, with credit to the people who made them:" — [X](https://x.com/EricBuess/status/2103226548413182366) [snippet]
- **guizang-product-video-skill (op7418 / 歸藏)** — [GitHub](https://github.com/op7418/guizang-product-video-skill) [verified]:
  - Timeline: first commit "publish Guizang product video skill" on **18 Sep 2026**; AGPL licence plus a commercial-licensing guide (18 Sep); "direction-first films" update on 25 Sep.
  - Install: `npx skills add https://github.com/op7418/guizang-product-video-skill --skill guizang-product-video-skill`
  - Works in Claude Code and Codex. It turns a codebase and its recent commits into a promo film.
  - Steps: pick selling points → write copy → embed the product's real UI components → animate → code-written score and separate sound effects, with the music ducked under key effects → export the video plus an editable project.
  - Three style modes: `repo` (recommended), `default` (CodePilot warm-white/charcoal) and `hybrid`.
  - Tech: React + esbuild + Playwright Chromium for frames, FFmpeg for encoding; "existing HyperFrames projects can also be reused". Requires Node ≥ 22, FFmpeg and Playwright Chromium.
  - Per OrcaRouter, a 24 Sep X post claimed Opus 5.5 produced a one-click CodePilot promo film that "crushes GPT-6 Astra". Rendering "runs on your hardware through headless Chromium"; the API bill covers only planning, copy, component wiring and renderer code — [OrcaRouter](https://www.orcarouter.ai/blog/claude-opus-5-5-product-video-skill) [snippet]
- **23 Sep, @OriSilver:** Opus 5.5 + **Maxfusion MCP** + Blender rebuilds a reference video's shots (15 fps frame extraction, camera/blocking). This is the Higgsfield-Blender pattern with a competitor's connector — [X](https://x.com/OriSilver/status/2102817977812824335) [snippet]
- **Unattributed claims from search summaries** (source unclear, possibly Anthropic launch material):
  - Opus 5.5 "strongly improves on tasks that require vision capabilities, including a Fitness Recap Video in Remotion"
  - For "a 30-second promotional reel with HyperFrames, Opus built a more energetic edit that synchronized motion to the music, layered recordings over other footage, and used shadows and opacity" [snippet; attribution unknown]
- **Model-comparison long-reads:** Nate Herk, 23 Sep ("Opus 5.5 vs GPT-6 Sol: 10 Real-World Tests"; "I Tested Opus 5.5 vs. GPT-6 Astra on 12 Real Use Cases") — [X](https://x.com/nateherk/article/2102613112272666829); [X](https://x.com/nateherk/article/2102904721698599231) [snippet: titles only; whether they include video tests is unknown]
- **Other write-ups** (dates not verified):
  - [Danny Stuart Substack: "Agentic video production with Claude Code and Opus"](https://dannystuart.substack.com/p/claude-code-opus-remotion-agentic-promo-video)
  - [OrcaRouter: "What 'Plan a Video' Actually Produces"](https://www.orcarouter.ai/blog/claude-opus-5-5-video-plan-one-shot) [snippet: titles]

### Inferences
- For the late-September "Claude makes videos" posts, two technically different things are being conflated:
  1. **Code-rendered motion graphics** (HyperFrames/Remotion/three.js; cheap, deterministic, editable, no photoreal footage)
  2. **Claude orchestrating generative models** (Higgsfield MCP → Seedance/Kling/Veo; photoreal, costs credits, stochastic)
- Many viral Opus 5.5 examples are type 1. Most Higgsfield demos are type 2, or type 1 carried out inside Blender/After Effects.
- "1-shotted in 20 min" and "~1 hour" claims come from the authors themselves. Iteration counts are not shown.

### Gaps
- The contents of Eric Buess's curated list and the replies to these viral posts were not reachable.
- Whether Anthropic itself published Opus 5.5 video demos (the "Fitness Recap Video in Remotion" line) could not be verified.
- Newsletter roundups (The Rundown, Ben's Bites, TLDR) of the Opus 5.5 video wave did not surface.
