# End-to-end AI video production pipeline (state: 23 Sept 2026): stages, creator-recommended tools, and what Claude can automate via MCP

> Scope note for the report writer: DaVinci Resolve, Adobe, Blender MCPs and Higgsfield itself are covered by other researchers and appear here only in pipeline context.
> Method caveat: the shared WebSearch budget ran out partway through, and the sandbox's egress proxy blocked direct fetches of most web pages (artificialanalysis.ai, arena.ai, the-decoder, blog.google, reddit, youtube, x.com, vendor sites). So many web findings below come from **search-engine result summaries**, not full page reads. MCP and tooling findings come from **primary sources**: GitHub READMEs (via raw.githubusercontent.com), GitHub search metadata (stars, dates, open issues), PyPI release data, and the Claude connector directory (claude.com/connectors plus the SearchMcpRegistry tool), all read on 2026-09-23. Star counts are a snapshot from that day.

## Key question 0 — What does the best-practice end-to-end pipeline look like in Sept 2026 (the objective)?

### Takeaway
Creators and tool vendors describe roughly the same staged pipeline. Script and storyboard come first. Next come keyframes and a "visual bible" with locked characters and style. Those approved stills drive image-to-video (or reference-to-video) generation in short clips. Enhancement, audio, and an NLE or code-based edit follow last. Two things are new in 2026. First, native audio and dialogue in the video models collapse part of the audio stage. Second, agentic "production systems" (OpenMontage, HyperFrames and Remotion skills, the ComfyUI MCP) let Claude run most of the non-NLE stages, with human approval gates at storyboard/contact-sheet level.

### Cited Findings
- A 2026 workflow guide describes nine connected layers: concept, script, visual bible, storyboard, keyframes, video generation, audio, edit, review — [LTX blog "The Best AI Video Workflow Guide & Tool Stack (2026)"](https://ltx.io/blog/ai-video-workflow) (search summary; page not fetchable).
- Recommended practice: "start with visual development and a storyboard, anchor key shots with image-to-video, work in short clips, and finish with strong audio and timeline editing". A useful video prompt describes "what the subject does, what the camera does, and what must stay stable" — [Blockchain Council 2026 guide](https://www.blockchain-council.org/ai/how-to-create-ai-generated-videos-tools-workflows-best-practices-2026/) (search summary).
- The 2026 AI filmmaking stack "splits into three jobs": image models (e.g., Recraft V4), video models (Kling 3.0, Veo 3.1, Seedance 2.0) and finishing tools (e.g., Topaz Astra) — [invideo "Best AI Filmmaking Tools in 2026"](https://invideo.io/blog/ai-filmmaking-tools/) (search summary).
- Kling 3.0 generates multi-shot sequences natively: one generation can return a cut sequence rather than one continuous take, "which means fewer storyboard frames and fewer credits per finished scene" — [invideo](https://invideo.io/blog/ai-filmmaking-tools/) (search summary).
- The strategic choice in 2026 is "pipeline tool vs point-tool stack". All-in-one pipeline tools (mStudio, LTX Studio) contrast with best-in-class point tools that need manual assembly (3–5 subscriptions, multiple exports, manual sync) — [M Studio](https://mstudio.ai/insights/best-ai-filmmaking-tools-2026) (search summary; vendor source, so it is biased toward "pipeline tool").
- The leading video models now generate speech, sound and ambience directly. Artificial Analysis runs separate "with audio" arenas, and Gemini Omni Flash leads text-to-video *with audio* (Elo 1233) — [Artificial Analysis T2V leaderboard](https://artificialanalysis.ai/video/leaderboard/text-to-video) (search snippet). HappyHorse 1.0 is described as a joint audio-video model with multilingual lip-sync — [WaveSpeed](https://wavespeed.ai/blog/posts/what-is-happyhorse-1-0-ai-video-model/).
- An open-source agentic reference pipeline, OpenMontage (≈61k GitHub stars, created 2026-03-29), runs concept → script → scene plan → generated motion clips → soundtrack → Remotion composition. Asset generation pauses on a scene-by-scene contact sheet showing takes, prompts, per-asset cost and quality scores, "so you approve the visuals before the render" — [OpenMontage README](https://github.com/calesthio/OpenMontage).
- OpenAI shut the Sora app on 26 Apr 2026, and the Sora API is discontinued on **24 Sep 2026** (the day after this research date). Any pipeline built on Sora 2 must migrate — [OpenAI Help Center](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation); [The Decoder](https://the-decoder.com/openai-sets-two-stage-sora-shutdown-with-app-closing-april-2026-and-api-following-in-september/).

### Inferences
- **Pipeline at a glance.** This is a synthesis of the cited findings in all sections below.

| Stage | What top creators use / recommend (Sept 2026) | Claude automation path (see Q4 for maturity) |
|---|---|---|
| 1. Idea & research | LLM brainstorming; analysing reference videos (pacing, hook, structure) | Claude natively; vidIQ connector for YouTube research; OpenMontage "start from a reference video" |
| 2. Script → shot list → storyboard | LLM writes script and a per-shot "shot contract" (action, camera, light, sound, what stays fixed); storyboard contact sheet as approval gate | Claude Code + skills (Seedance 2.0 Skill OS, OpenMontage, Google genmedia "producer" skill) |
| 3. Look dev, keyframes, characters | Nano Banana Pro for character sheets and continuity edits; Midjourney V8.x for aesthetic style frames; GPT Image 2 / Seedream 5 / Flux for cheap iterations, text or local LoRA pipelines | Google genmedia MCP (Nano Banana), Runway MCP (Nano Banana Pro default), Replicate MCP, ComfyUI MCP (local Flux). Midjourney: no official API, so it stays manual |
| 4. Video generation | Image-to-video from approved stills; first/last-frame for products and transitions; reference-to-video for multi-character or brand work. Model by shot type: Kling 3.0 for motion and multi-shot, Veo 3.1 for realism and dialogue, Seedance 2.0/2.5 for multi-reference ads and music videos, Gemini Omni Flash for conversational editing and top I2V Elo, Wan 3.0 for 30 s single takes, Hailuo H3 on cost | Runway MCP (Seedance 2.5, Gemini Omni, Hailuo 3, Gen-4.5, Aleph 2), Replicate remote MCP (Veo, Kling, Wan…), Google genmedia MCP (Veo 3.1), ComfyUI partner nodes, vibeframe. Aggregator UIs (Higgsfield, Freepik, Krea, OpenArt) are manual |
| 5. Upscale / enhance / interpolate | Topaz Starlight Precise 2.5 for photoreal fixes (faces, fabric, text); Topaz Astra 2 for stylized/wide shots; Real-ESRGAN/CodeFormer locally; Topaz Apollo for interpolation | Runway MCP `upscaleVideo`; Topaz only via its API and scripts (no MCP found); ComfyUI upscalers via comfy-mcp |
| 6. Voice / dialogue / lip-sync | Native dialogue (Veo 3.1, HappyHorse, Seedance); ElevenLabs TTS and voice cloning; Kling lip-sync API; HeyGen avatars | ElevenLabs local MCP (deprecated) or API scripts; Google Gemini TTS / Chirp MCP; MiniMax MCP; Runway `generateAudio`; HeyGen skills and CLI |
| 7. Music | Suno v5 for quality and vocals; ElevenLabs Music / Google Lyria 3 for licence-clean client work; AIVA for scores (one source) | Google genmedia Lyria MCP; ElevenLabs (local MCP music tool); Suno only through unofficial third-party APIs; Splice connector for samples |
| 8. SFX / foley | Native model audio; ElevenLabs SFX | ElevenLabs local MCP / API; sonic-match-mcp (BGM matching and ducking) |
| 9. Edit / assembly / motion graphics | NLE (Resolve / Premiere, covered by other researchers); Descript for text-based editing; video-as-code (Remotion, HyperFrames, Motion Canvas) for titles, captions and explainers | FFmpeg MCPs (kinocut etc.), Descript connector, Remotion skills, HyperFrames connector and skills |
| 10. Captions & delivery | WhisperX/faster-whisper word timestamps; Remotion/HyperFrames caption templates; Descript captions and translation | Descript connector, Cloudinary connector (transform/deliver), FFmpeg burn-in, TikTok for Business connector (ads) |

- The biggest workflow change since 2025 is that shot generation is increasingly reference-driven. Seedance 2.5 takes up to 30 image, 10 video and 10 audio references; Kling Omni takes Elements and references; Gemini Omni takes up to 5 image references plus conversational editing. Continuity is carried by references, not by prompt text, and pre-production (character and set sheets) now carries most of the quality load.

### Gaps
- Could not read the full LTX, invideo, M Studio or Blockchain Council pages (egress blocked), so their wording is taken from search summaries.
- Could not access X/Twitter, YouTube, or Reddit (r/aivideo, r/AIfilmmaking, r/comfyui) at all. First-hand creator posts are therefore under-represented.
- German-language sources could not be searched (search budget exhausted).

## Key question 1 — Pre-production: LLM scripting/storyboarding/shot lists, and which image models creators prefer for keyframes and consistent characters

### Takeaway
LLMs are used to turn a brief into a script, then into a structured shot list, then into model-specific prompts. The best-documented practice is to write each shot as one clear action with a fixed camera and an explicit sound choice. For keyframes, the consistent 2026 signal is: **Nano Banana Pro** (Gemini 3 Pro Image) for character sheets and multi-angle identity; **Midjourney V8.x** for look and aesthetics; and cheaper or specialised models (GPT Image 2, Seedream 5.0, Flux/FLUX.2, Recraft V4) for volume, text or design work. The evidence mostly comes from vendor and tutorial blogs rather than creator surveys.

### Cited Findings
**LLM scripting / shot lists / storyboards**
- PJ Accetturo made the viral Kalshi NBA Finals ad with Google Veo 3, **using Gemini to turn his shot descriptions into Veo prompts**. It took 2–3 days from idea to air and cost about $2,000, and he published the prompts — [The Daring Creatives](https://www.thedaringcreatives.com/creator-stories/pj-ace-nba-finals-ad/) (search summary; project dates from June 2025, so older than the 2026 tool landscape).
- The "Seedance 2.0 Skill OS" agent skill (GitHub, ≈7.4k stars, v6.7.0, by Emily / @Iamemily2050) encodes a director-first method:
  - it "reads each scene's dramatic function, sets one directorial voice", and makes camera, light, blocking, performance and sound serve one intention
  - it writes prompts for T2V, I2V, V2V, R2V and first/last-frame modes
  - it "separates every reference asset by role: identity, environment, motion, camera rhythm, audio tempo, style, or endpoint"
  - its example prompt shows the principle: "one visible action, a clear endpoint, a fixed camera and an explicit sound choice"

  Source: [Emily2040/seedance-2.0 README](https://github.com/Emily2040/seedance-2.0).
- OpenMontage can start from a reference video (YouTube, Short, Reel, TikTok, local clip). The agent "analyzes transcript, pacing, scenes, keyframes, and style" and returns 2–3 concepts, "an honest tool path, cost estimates, and a sample before full production" — [OpenMontage README](https://github.com/calesthio/OpenMontage).
- Google's official genmedia MCP bundle ships agent skills. `genmedia-producer` "orchestrates multi-step workflows like podcast creation and storyboarding", and `story-generator` produces "full multi-scene multimedia storybooks (image, video, voice, and music)" — [GoogleCloudPlatform mcp-genmedia README](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia).
- "The first step in AI video production is creating a storyboard … without a solid storyboard, subsequent video generation is just shooting in the dark." The same guide says the combination of Nano Banana Pro (storyboarding) and Seedance 2.0 (video) is "currently one of the most powerful setups" — [APIYI blog](https://help.apiyi.com/en/nano-banana-pro-ai-video-storyboard-character-consistency-guide-en.html) (API-reseller blog, so it has a commercial interest).

**Keyframes and consistent characters**
- Nano Banana Pro "has stronger prompt adherence and holds multi-angle character fidelity better than Nano Banana 2, making it ideal for character sheet generation in a film pipeline". Built on Gemini 3 Pro reasoning, it handles front, side, back, face-closeup and mid-angle compositions "when one character has to stay the same person across 50+ shots" — [invideo FAQ: Nano Banana 2 vs Pro](https://invideo.io/faq/nano-banana-2-vs-nano-banana-pro-which-should-you-use/) (search summary).
- Runway's official API MCP server names **Nano Banana Pro (`gemini_image3_pro`) as its recommended image model**, alongside Seedance 2 for video and Aleph 2 for video editing. This is a notable vendor signal: Runway defaults to a Google image model — [runwayml/runway-api-mcp-server README](https://github.com/runwayml/runway-api-mcp-server).
- Midjourney release timeline:
  - V8 Alpha launched 17 Mar 2026 (≈5× faster, native 2K, better text rendering)
  - V8.1 released 14 Apr 2026 and was the default from 10 Jun to 23 Jul 2026
  - **V8.2 has been the default since 24 Jul 2026**, focused on aesthetics, image quality and Personalization, with a new Edit Model that **replaces Omni Reference, Character Reference and Retexture**

  Sources: [Midjourney docs – Version](https://docs.midjourney.com/hc/en-us/articles/32199405667853-Version); [Midjourney V8.1 Alpha update](https://updates.midjourney.com/v8-1-alpha/); [WaveSpeed on V8](https://wavespeed.ai/blog/posts/what-is-midjourney-v8-features-pricing-how-to-use-2026/) (search summary).
- Midjourney video: one source says a "V8 Video" motion model arrived in April 2026, while also describing V1 Video as animating one image into 4 × 5-second clips at 480p/24fps — [Veo4.dev review](https://veo4.dev/midjourney-v8-video); [PixVerse blog](https://pixverse.ai/en/blog/midjourney-ai-image-generator-review). Low-confidence SEO sources that contradict each other; treat as unverified.
- Image-model prices via one API gateway (Atlas Cloud), as documented in Sept 2026: GPT Image 2 $0.009–0.010/image; Nano Banana 2 $0.080/image; Seedream 5.0 Pro $0.022–0.045/image (text-to-image, edit, layer decomposition). On fal: Seedream 5 Pro $0.0675 (≤1536²) to $0.135 (≤2048²) per image; FLUX Pro v1.1 $0.05/image — [OpenMontage docs/PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md).
- Recraft V4 is named as the image model in a 2026 filmmaking stack — [invideo](https://invideo.io/blog/ai-filmmaking-tools/) (search summary).
- Google's genmedia MCP covers "Nano Banana": Gemini 3.1 Flash Image, Gemini 3 Pro Image and Gemini 2.5 Flash Image, for generation and editing — [mcp-genmedia README](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia).
- Kling's official API also offers "Image Omni multi-reference or series workflows" and "Elements" (`element_id`) references that carry into Video Omni — [OpenMontage PROVIDERS.md, Kling Official section](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md).
- Higgsfield (pipeline context only) markets "Soul ID for character consistency across clips" — [OpenMontage PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md).

### Inferences
- Practical division of labour:
  - **Midjourney V8.2**: mood, style frames, "the look". It has no official API, so Claude cannot drive it.
  - **Nano Banana Pro**: character/turnaround sheets, keeping one identity across angles, and continuity edits of keyframes. Claude can drive it via Google genmedia MCP, Runway MCP, Replicate or fal.
  - **GPT Image 2 / Seedream 5**: cheap bulk variants, text and typography, product shots.
  - **Flux (local, ComfyUI)**: when LoRA training or privacy is needed.
- Because Midjourney's Character/Omni Reference were replaced by the Edit Model (July 2026), older tutorials using `--cref`/`--oref` are outdated. Flag this to the user.
- The most transferable LLM practice is not "write a cinematic prompt". It is a **structured shot list** per shot: dramatic purpose, one action and endpoint, camera and lens, light, what must stay fixed, which reference controls what, and a sound decision. Claude can produce and maintain this as JSON/Markdown and generate model-specific prompts from it.

### Gaps
- No creator survey or Reddit/X sentiment could be read on Flux 2 vs Seedream 5 vs GPT Image 2 for keyframes.
- The GPT Image 2 release date and Seedream 5.0 release date were not verified. They are only seen as available in Sept 2026 provider docs.
- Could not verify whether LTX Studio, Higgsfield Popcorn, Google Flow and similar storyboard tools changed in 2026.

## Key question 2 — Generation strategy (I2V vs T2V, first/last frame, reference-to-video) and which video models lead in Sept 2026 for which shot types; aggregators vs direct access

### Takeaway
Pros use **image-to-video from approved keyframes** as the default. They switch to **first/last-frame** when identity or product geometry must hold, and **reference-to-video** (Seedance 2.x, Kling Omni, Gemini Omni) for multi-character or brand work. Text-to-video is kept for exploration and B-roll.

There is no single best model; the leaderboards disagree:
- **Artificial Analysis (blind votes)** puts Google's **Gemini Omni Flash** first for image-to-video and Alibaba's **Wan 3.0** first for text-to-video (no audio).
- **Creator/tutorial consensus** remains: **Kling 3.0** for motion, action and multi-shot; **Veo 3.1** for photoreal and dialogue/lip-sync; **Seedance 2.0/2.5** for reference-driven ads and music videos.
- **Sora 2 is gone** after 24 Sep 2026.

Multi-model routers (Runway's API, fal, Replicate, Higgsfield, Atlas, ComfyUI partner nodes) make models interchangeable per shot.

### Cited Findings
**Strategy**
- Common failure modes listed by a 2026 guide: "vague objectives, ask text to carry information that a reference image could provide, stack incompatible camera directions, or try to generate an entire sequence before testing its hardest shot" — [media.io "AI Video Mistakes: 18 Prompting Errors"](https://www.media.io/creative-tips/ai-video-mistakes.html) (search summary).
- First/last frame for identity: in OpenMontage's "Products Come to Life" film, "each still [was] pinned as the first and last frame so the model invents motion without losing product identity". The framework also exposes a `first_last_frame` mode ("interpolate between two stills") — [OpenMontage README](https://github.com/calesthio/OpenMontage).
- Reference capacity per model:
  - Seedance 2.0 combines up to 9 images, 3 videos and 3 audio clips in one generation — [3DAI Studio comparison](https://www.3daistudio.com/blog/best-ai-video-generator-2026) (search summary)
  - **Seedance 2.5** accepts up to 30 image, 10 video and 10 audio references and outputs 4–30 s at 480p/720p (Volcengine model id `doubao-seedance-2-5-260628`)
  - Seedance 2.0 Standard goes up to 1080p/4K, with Fast and Mini variants
  - Gemini Omni Flash does 3–10 s text/image generation plus video editing with up to five image references

  Sources for Seedance 2.5 and Gemini Omni: [OpenMontage PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md) (single secondary source for Seedance 2.5 specs; release date not verified).

**Leaderboards (conflicting)**
- **Artificial Analysis Video Arena** (blind human votes; snapshot seen via search, date not shown):
  - Image-to-video, no audio: 1. **Gemini Omni Flash** (Elo 1369), 2. **Wan 3.0** (1361), 3. Bach 1.0 Pro (1359), 4. **MiniMax H3** (1354), 5. PixVerse V6 (1337)
  - Text-to-video, no audio: 1. **Wan 3.0** (1336), 2. Gemini Omni Flash (1330), 3. MiniMax H3, 4. HappyHorse-1.0, 5. HappyHorse-1.1
  - Text-to-video *with audio*: led by Gemini Omni Flash (1233)

  Sources: [AA I2V leaderboard](https://artificialanalysis.ai/video/leaderboard/image-to-video); [AA T2V leaderboard](https://artificialanalysis.ai/video/leaderboard/text-to-video) (search snippets; pages blocked).
- **Conflicting ranking:** "As of September 2026, Kling v3 leads the text-to-video leaderboard with an arena score of 1934, followed by Happy Horse 1.0 (1816) and Seedance 2.0 Fast (1747)" — [BuildMVPFast, Sept 2026](https://www.buildmvpfast.com/articles/best-llms-2026-guide/video-generation-ai) (search summary). This is a different arena or scale from AA. The report should present both and not merge the numbers.
- HappyHorse 1.0 (Alibaba-associated):
  - reportedly the first model to rank #1 on both AA T2V (Elo 1333) and I2V (1392) as of April 2026
  - described as a unified 15B-parameter joint audio-video transformer with 1080p and phoneme-level lip-sync in 8+ languages
  - live on fal from 26 Apr 2026

  Sources: [fal learn page](https://fal.ai/learn/devs/happyhorse-1-0-what-do-we-know-so-far); [WaveSpeed](https://wavespeed.ai/blog/posts/what-is-happyhorse-1-0-ai-video-model/). Caution: many look-alike "HappyHorse" domains are SEO/scam-style sites, so provenance claims are weak.

**Model profiles**
- Per-model strengths in tutorial/comparison consensus:
  - **Veo 3.1**: "best for realism and lip-synced audio", "best lip sync (under 120ms accuracy)", strong at video extension, "most consistent scene-level audio design"
  - **Kling 3.0**: "long cinematic and multi-shot clips", single shots up to 15 s with multi-shot storyboards. Chosen "when motion realism is the priority", so it suits action, dynamic camera moves, dance and sports
  - **Seedance 2.0**: best "for combining your own reference images, video, and audio". Suits ad agencies, remixing, music videos and template-based production
  - Budget: Kling Standard $6.99/mo; Veo 3.1 via Google AI Pro $19.99/mo; Seedance 2.0 ≈ $9/mo

  Sources: [3DAI Studio](https://www.3daistudio.com/blog/best-ai-video-generator-2026); [AI Video Bootcamp](https://aivideobootcamp.com/blog/seedance-vs-kling-vs-veo-2026/); [WaveSpeed comparison](https://wavespeed.ai/blog/posts/seedance-2-0-vs-kling-3-0-sora-2-veo-3-1-video-generation-comparison-2026/) (merged search summary of several vendor/tutorial blogs; the "<120 ms" figure is unverified marketing-grade data).
- Kling 3.0 is described as outputting up to 4K and generating "multi-shot sequences of up to six connected scenes", favouring dramatic lighting and composed frames — [Higgsfield blog "6 Best AI Video Generators 2026"](https://higgsfield.ai/blog/best-ai-video-generators-2026) / [OpenArt](https://openart.ai/blog/best-ai-video-generators/) (search summary; exact attribution among these results uncertain). Kling's official API exposes Classic/Turbo/**Omni** task protocols, a "4k mode" and native sound — [OpenMontage PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md).
- **Gemini Omni** (Google DeepMind):
  - announced at I/O 2026 as a family that generates and edits video from any mix of image, audio, video and text
  - Gemini Omni Flash rolled out to the Gemini app and **Google Flow** (AI Plus/Pro/Ultra), and free in YouTube Shorts / YouTube Create
  - clips capped at 10 s at launch; SynthID watermark by default; API promised "in the coming weeks"

  Source: [The Next Web](https://thenextweb.com/news/google-gemini-omni-flash-video-model-io-2026) (search summary); also available in [Google Vids](https://workspace.google.com/blog/product-announcements/introducing-gemini-omni-flash-in-google-vids) (title only).

  By Sept 2026 the developer model `gemini-omni-flash-preview` is priced at ≈$0.10 per second of 720p video (billed as 5,792 output tokens/s at $17.50 per 1M tokens) and is reachable via Google GenAI, fal, the Runway API and a ComfyUI partner node — [OpenMontage PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md).
- **Wan 3.0** (Alibaba):
  - public beta on **6 Aug 2026** on Alibaba Cloud Model Studio / Qwen Cloud
  - **API-only, no open weights** ("Alibaba's open Wan line stops at Wan 2.2")
  - up to 30 s from text, image, audio and video inputs; 480p/720p/1080p, no 4K

  Sources: [Atlas Cloud](https://www.atlascloud.ai/blog/tips/is-wan-3.0-open-source); [WaveSpeed](https://wavespeed.ai/blog/video-model-access/is-wan-3-0-open-source/); [OrcaRouter](https://www.orcarouter.ai/blog/wan-3-0-release-date) (search summaries).
- **Runway**:
  - Gen-4.5 was released 1 Dec 2025 — [AI Business](https://aibusiness.com/generative-ai/runway-releases-gen-4-5-video-model)
  - Gen-4 Aleph was removed from the Runway API on 30 Jul 2026 in favour of **Aleph 2.0 (`aleph2`)** — [Runway API changelog](https://docs.dev.runwayml.com/api-details/api_changelog/) (search summary)
  - Runway's "Fall 2026 collection" adds five third-party models to its app, including Flux Video Edit alongside Aleph 2 for object removal/replacement and restyling — [AlphaSignal](https://alphasignal.ai/news/runway-turns-gen-4-5-into-a-multi-model-creative-router-for-teams); [Releasebot](https://releasebot.io/updates/runwayai) (search summaries)
  - Runway API prices (credits at $0.01): Gen-4 Turbo ≈$0.05/s, Gen-4.5 ≈$0.12/s, Seedance 2.5 ≈$0.20/s (480p) / $0.30/s (720p), Gemini Omni Flash ≈$0.10/s (generation) / $0.11/s (editing), MiniMax H3 (`hailuo3`) ≈$0.10/s (768P) / $0.15/s (2K), 5–15 s — [OpenMontage PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md)
- **Seedance 2.0 access and restrictions**:
  - API live on fal from 9 Apr 2026 — [fal](https://fal.ai/seedance-2.0)
  - full Volcengine/BytePlus API from 14 Apr 2026
  - **real-human-face uploads are blocked at the model layer** across ByteDance consumer and enterprise channels (Jimeng, Doubao, CapCut, Dreamina, Volcengine Ark, BytePlus ModelArk), and this "propagates through the API to third-party platforms like Replicate, fal.ai, Runway, and Morphic"; virtual characters are the safer default

  Sources for the last two points: [AIVidPipeline face rules](https://aividpipeline.com/blog/seedance-real-human-face-rules-2026); [Ruoqi Jin](https://ruoqijin.com/blog/seedance-access-and-face-policy) (search summaries).
- **Sora**: app discontinued 26 Apr 2026, API ends 24 Sep 2026. OpenAI's deprecation page names no replacement model — [OpenAI Help Center](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation); [Leaxor](https://leaxor.com/blog/sora-api-shutdown-2026). "Most former Sora users moved to Seedance 2.0 for commercial work and Veo 3.1 for realism" — [BuildMVPFast](https://www.buildmvpfast.com/articles/best-llms-2026-guide/video-generation-ai) (search summary; unquantified claim).
- Other models seen in 2026 provider catalogues: Grok Imagine Video (xAI) at $0.05/s (480p) / $0.07/s (720p), "strong reference-image video"; LTX-Video / LTX-2 (open, local); Hunyuan and CogVideo (local); WAN 2.1/2.2 (local via ComfyUI) — [OpenMontage README/PROVIDERS](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md). OpenMontage also claims MiniMax H3 has "official open weights" — single source, unverified.

**Aggregators vs direct access**
- **Higgsfield** (pipeline context only) routes Kling 3.0, Veo 3.1, Sora 2, WAN 2.5 and its own Soul Cinema through one API. Plans run $15–84/mo. Approximate cost per clip: Kling 3.0 ≈$0.10, WAN 2.5 ≈$0.10, Soul Cinema ≈$0.15, Veo 3.1 ≈$0.50, Sora 2 ≈$0.50 — [OpenMontage PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md).
- **fal** hosts Seedance 2.0 (from 9 Apr 2026), HappyHorse (from 26 Apr 2026) and Gemini Omni, and older Kling/Veo endpoints (e.g., Kling 2.5 Turbo Pro $0.07/s; Veo 3 $0.40/s — older price) — [fal Seedance page](https://fal.ai/seedance-2.0); [OpenMontage PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md).
- **Replicate**: "search, compare and run any Replicate model — Veo, Kling, Wan, FLUX, SDXL, LTX and more" — [Replicate MCP docs](https://replicate.com/docs/reference/mcp) (search summary).
- **ComfyUI Partner Nodes** run hosted models inside a ComfyUI graph, e.g. `GeminiVideoOmni`, `ByteDance2TextToVideoNode` (Seedance 2.5) and `MinimaxHailuo03TextToVideoNode`. They need a logged-in Comfy account and prepaid credits — [OpenMontage PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md); [Comfy-Org/comfy-mcp README](https://github.com/Comfy-Org/comfy-mcp).

### Inferences
- **Shot-type → model heuristic** (a synthesis; validate per project):
  - dialogue close-ups and photoreal people → Veo 3.1, with Gemini Omni Flash as a challenger
  - action, sports, dance, fast camera moves and multi-shot sequences → Kling 3.0
  - brand/product and music videos with many references, or anything where style/identity must follow references → Seedance 2.0/2.5, but not with real faces
  - long single takes (up to 30 s) → Wan 3.0 or Seedance 2.5
  - edits to existing footage (object removal, restyle, relight) → Runway Aleph 2, Gemini Omni (conversational edit), Flux Video Edit
  - cheap B-roll iteration → Hailuo H3, Kling Turbo, Grok Imagine
- **Aggregator vs direct access.** Aggregators (Higgsfield, Freepik, Krea, OpenArt) suit exploring and comparing shots under one subscription. API routers (Runway API, fal, Replicate, Atlas) are what make **Claude automation** possible. Direct vendor access (Google Flow/Vertex, Kling official, Volcengine) gets newest features first plus enterprise terms and support. Sora's shutdown is a live example of vendor risk, which argues for routers and model-agnostic prompts.
- Pipelines should budget for **re-rolls**. OpenMontage, vibeframe and Comfy MCP all build in cost estimates or hard cost caps, which suggests uncontrolled spend is a real failure mode when agents generate video.

### Gaps
- Could not verify:
  - Kling 3.0's exact release date or any Kling 3.x point releases
  - whether a "Veo 4" exists (only SEO domains used the name)
  - Luma Ray 3.x status in 2026 (only its API MCP was found, not model news)
  - the vendors of "Bach 1.0 Pro" and PixVerse V6 details
  - the exact capture date of the AA leaderboard snapshot
- No first-hand data from Freepik, Krea or OpenArt on their Sept 2026 model rosters or pricing.

## Key question 3 — Post-production: upscaling/enhancement, frame interpolation, lip-sync, voice, music, SFX, subtitles

### Takeaway
Finishing is where "AI look" is removed or added. Topaz has split its line into **Starlight Precise 2.5** (realism fix for AI video: faces, fabrics, small text) and **Astra 2** (creative diffusion upscaler with prompts; for stylized/wide shots, "explicitly not for photoreal fidelity"). Lip-sync is increasingly native (Veo 3.1, HappyHorse), with Kling's lip-sync API, HeyGen avatars and Wav2Lip as fallbacks. ElevenLabs remains the default for voice; Google Gemini TTS/Chirp and Fish Audio are alternatives. For music, **licence clarity** decides: Suno v5 leads on quality, while ElevenLabs Music (licensed training data) and Google Lyria are the client-safe choices. Captions are handled by Whisper-class ASR with word timestamps, plus Remotion/HyperFrames or Descript.

### Cited Findings
**Upscaling / enhancement / interpolation**
- **Topaz Astra 2** (cloud, released April 2026):
  - adds prompt input plus Creativity and Sharpness sliders (1–5 each) for "context-aware synthesis of new visual detail rather than simple pixel sharpening"
  - it is "diffusion-based upscaling for GenAI video", performs best on stylized content, wide shots and detail-sparse scenes, "and is explicitly not for photoreal fidelity work"

  Sources: [BuildFastWithAI](https://blog.buildfastwithai.com/topaz-astra-2-ai-video-upscaler-prompt-controls); [Topaz Astra page](https://www.topazlabs.com/astra) (search summaries).
- **Topaz Starlight Precise 2.5** (`slp-2.5`) is a diffusion enhancement model "designed to improve realism in AI-generated video by reducing plastic or artificial artifacts" in faces, fabrics, material response, small text and logos. It is available via the Topaz web app and **API** — [Z.Tools](https://z.tools/blog/topaz-labs-starlight-2-5-upscale); [Topaz Starlight](https://www.topazlabs.com/starlight) (search summaries).
- Topaz's 2026 video line-up as compared by invideo: Astra 2, Starlight, Proteus, Gaia, Apollo (Apollo is Topaz's frame-interpolation model), Hyperion — [invideo](https://invideo.io/blog/topaz-video-enhancement-models/) (title/summary only).
- Topaz Astra is named as the "finishing" layer of the 2026 filmmaking stack — [invideo](https://invideo.io/blog/ai-filmmaking-tools/).
- Other options:
  - Runway's API MCP exposes `runway_upscaleVideo` — [Runway MCP README](https://github.com/runwayml/runway-api-mcp-server)
  - open-source agent pipelines use Real-ESRGAN (image/video upscaling) and CodeFormer/GFPGAN (face restoration) locally — [OpenMontage README](https://github.com/calesthio/OpenMontage)

**Lip-sync / talking heads**
- Veo 3.1 is cited for the best lip sync (under 120 ms) — [3DAI Studio](https://www.3daistudio.com/blog/best-ai-video-generator-2026) (search summary; marketing-grade figure). HappyHorse 1.0 claims phoneme-level lip-sync in 8+ languages — [WaveSpeed](https://wavespeed.ai/blog/posts/what-is-happyhorse-1-0-ai-video-model/).
- Kling's official API offers cloud lip-sync "with explicit face selection for multi-person videos", plus avatar presenter clips and TTS. Local fallbacks are Wav2Lip and SadTalker — [OpenMontage PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md).
- HeyGen publishes official agent skills for "avatar creation and video production via the v3 Video Agent pipeline" (≈450 stars) and an official CLI (created 30 Mar 2026) — [heygen-com/skills](https://github.com/heygen-com/skills); [heygen-com/heygen-cli](https://github.com/heygen-com/heygen-cli).

**Voice**
- ElevenLabs: "premium TTS + music + SFX", free tier 10k characters/credits per month. Google Cloud TTS: 700+ voices in 50+ languages, "the strongest localization option". Fish Audio S2: inline emotion tags ([laugh], [whispers]) and 80+ languages. OpenAI TTS: "fast, affordable". Sources: [OpenMontage README/PROVIDERS](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md); [ElevenLabs MCP README](https://github.com/elevenlabs/elevenlabs-mcp).
- Google's genmedia MCP covers **Gemini TTS** and **Chirp 3 HD**, with a "voice-director" skill for expressive TTS — [mcp-genmedia README](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia).
- Open-source route used by a Claude Code toolkit: Qwen3-TTS voiceovers, FLUX.2 images and ACE-Step music, deployed on your own cloud GPU "at cost" — [digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit).

**Music**
- Suno V5 is "the best choice for most users — best vocal quality, fastest generation, built-in DAW, and clear commercial rights on paid plans". Pro costs $10/month with commercial rights for songs made while paid — [TeamDay](https://www.teamday.ai/blog/best-ai-music-models-2026); [Omid Saffari](https://omidsaffari.com/blog/best-ai-music-generator) (search summaries).
- ElevenLabs entered music in August 2025 and trained "exclusively on licensed music from partners including Merlin Network and Kobalt Music Group". For agency/client work, "license clarity matters more than output quality", so prefer licence-clean platforms — [AI Magicx](https://www.aimagicx.com/blog/suno-vs-udio-vs-elevenlabs-music-comparison-2026); [Digital Applied](https://www.digitalapplied.com/blog/ai-music-generation-platforms-suno-udio-elevenlabs-2026) (search summaries).
- "Both Suno and Udio reached settlement agreements with the major labels by late 2025", but user commercial rights "still carry some ambiguity" — [Dubspot](https://blog.dubspot.com/ai-music-licensing-explained-2026) (search summary). One comparison recommends AIVA Pro for film/trailer scoring (MIDI output, ownership) — [search summary across Omid Saffari / Undetectr](https://omidsaffari.com/blog/best-ai-music-generator).
- Google Lyria 3 Pro (`lyria-3-pro-preview`) costs a flat $0.08 per generation up to 184 s. Suno has no first-party API; pipelines use third-party sunoapi.org keys — [OpenMontage PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md).
- Alibaba's Wan team published a technical report on WanSong (text-to-music, ~25B parameters) in July 2026 — [Atlas Cloud](https://www.atlascloud.ai/blog/tips/is-wan-3.0-open-source) (search summary).

**SFX / foley**
- Veo 3.1 "delivers the most consistent scene-level audio design", and native audio is standard in top models — [3DAI Studio](https://www.3daistudio.com/blog/best-ai-video-generator-2026) (search summary). ElevenLabs SFX is the default cloud SFX generator in agentic pipelines — [OpenMontage README](https://github.com/calesthio/OpenMontage).
- A new MCP (created 10 Sep 2026) "watches video footage and returns license-safe BGM matches, hook windows, and ffmpeg ducking specs for agents" — [js713-lab/sonic-match-mcp](https://github.com/js713-lab/sonic-match-mcp).

**Subtitles / captions**
- Word-level captions in agent pipelines come from WhisperX / faster-whisper, or Azure Fast Transcription with diarization, and are rendered as "TikTok-style word-level captions" in Remotion or burned in with FFmpeg — [OpenMontage README](https://github.com/calesthio/OpenMontage).
- The Remotion agent skills include `/remotion-captions` — [remotion-dev/skills](https://github.com/remotion-dev/skills). The ElevenLabs MCP includes speech-to-text with speaker identification — [ElevenLabs MCP README](https://github.com/elevenlabs/elevenlabs-mcp).
- The Descript connector (Claude directory, added May 2026) handles "transcribing, noise removal, caption generation" and translation ("translate a video into Spanish") — [Claude connector: Descript](https://claude.com/connectors/descript).

### Inferences
- **Suggested order.** Lock the edit → lip-sync or dialogue fixes → upscale **only the selected takes**, since diffusion upscalers are slow and expensive → grade → final audio mix → captions → deliverables. Choose Starlight Precise for photoreal human shots and Astra 2 for stylized, wide or detail-sparse shots. Using Astra on photoreal faces is a documented misuse.
- For a German-speaking creator publishing commercially, the licence-clean music route (ElevenLabs Music, Lyria, stock/Splice) is the low-risk default. Suno is excellent for demos and temp tracks, or where its paid-plan terms are acceptable.
- Native model audio (Veo 3.1, Seedance, HappyHorse, Wan 3.0) is good enough for scratch tracks and ambience. Most polished pieces still rebuild dialogue, music and SFX in the edit. This is inferred from the pipelines above always including separate TTS/music/SFX stages.

### Gaps
- No 2026 creator comparison could be retrieved for dedicated lip-sync tools (sync.so / Sync Labs, OmniHuman, Hedra, Kling Avatar), open foley models (MMAudio, HunyuanVideo-Foley, Mirelo), open upscalers (SeedVR2, FlashVSR), Magnific video upscaling, or open frame interpolation (RIFE, GIMM-VFI).
- No Topaz 2026 pricing was found.
- Udio's 2026 product status (downloads, walled garden) was not verified.
- The claimed "<120 ms lip-sync accuracy" for Veo 3.1 is unverified.

## Key question 4 — Which MCP servers (and "video-as-code" approaches) let Claude control the supporting tools, and how mature/reliable are they?

### Takeaway
Claude can already drive most non-NLE stages. Image and video generation work through **Runway's official MCP**, **Replicate's official remote MCP**, **Google's official genmedia MCP servers** (Nano Banana, Veo 3.1, Lyria, TTS, AVTool) and the **Comfy-Org official MCP / Comfy Cloud MCP**. Voice, music and SFX work through ElevenLabs (with caveats), Google and MiniMax. Assembly works through FFmpeg MCPs, the **Descript connector** and video-as-code (**Remotion Agent Skills**, **HyperFrames by HeyGen**, OpenMontage).

The official Claude connector directory has *no* generative-video connector: no Higgsfield, fal, Replicate, Runway, Luma, Kling or ComfyUI. Its creative/video entries are Descript, HyperFrames, Canva, Figma, Adobe, Riverside, Tella, Cloudinary and Splice. Its ElevenLabs connector manages voice agents only.

Maturity is mixed. The trend is away from local MCP servers toward **hosted MCP** (ElevenLabs, Replicate, Comfy Cloud) or **CLI + Agent Skills** (MiniMax, HeyGen, Remotion).

### Cited Findings
**Claude connector directory (official, Anthropic-listed; checked 2026-09-23)**
- The directory lists 829 connectors — [claude.com/connectors](https://claude.com/connectors). A SearchMcpRegistry query for "video, audio, ElevenLabs, ComfyUI, Higgsfield, music, image generation, ffmpeg, fal, Replicate, Luma, Kling, Suno, Runway, HeyGen, Descript, Canva, Figma" returned these relevant connectors:
  - **ElevenLabs**, **Descript**, **HyperFrames by HeyGen**, **Canva** ("Search, create, autofill, and export Canva designs"), **Figma**, **Adobe** (covered elsewhere)
  - **Riverside** ("Prep, edit, clip, and publish your videos and podcasts"), **Tella** (edit/publish Tella videos, incl. `add_sound_effect`)
  - **Cloudinary** ("Manage, transform and deliver your images & videos"), **Moda** (motion graphics & social), **Splice** (sound catalogue, "stacks", `download_asset`)
  - **vidIQ** (YouTube research), **TikTok for Business** (ads)

  **No connector** was returned for Higgsfield, ComfyUI, fal, Replicate, Luma, Kling, Suno, or Runway the video company (the only "Runway" hit is runway.team, a mobile-release tool). Source: [claude.com/connectors](https://claude.com/connectors) plus the SearchMcpRegistry tool (no per-query URL).
- **ElevenLabs connector**: "Manage your ElevenAgents voice agents in your chat". Added July 2026, 79 tools such as `agents_create`, `agents_calculate_llm_usage`. It covers voice-agent management **only, not general text-to-speech or sound effects** — [claude.com/connectors/elevenlabs](https://claude.com/connectors/elevenlabs).
- **Descript connector**: added May 2026, Anthropic-verified. Tools: `import_media`, `prompt_project_agent`, `get_job`, `list_jobs`, `cancel_job`. Endpoint `https://api.descript.com/v2/mcp/claude` — [claude.com/connectors/descript](https://claude.com/connectors/descript).
- **HyperFrames by HeyGen connector**: added June 2026. Tools: `compose`, `render_video`. Endpoint `https://mcp.heygen.com/mcp/hyperframes`. "Turns HTML code into videos" for slides, explainers and motion graphics — [claude.com/connectors/hyperframes](https://claude.com/connectors/hyperframes).

**Voice / audio MCPs**
- **ElevenLabs official local MCP** (`elevenlabs/elevenlabs-mcp`, ≈1.5k stars) is now **archived**. The README says: "This local MCP server is deprecated in favor of the ElevenLabs hosted MCP server … available at `https://api.elevenlabs.io/v1/mcp` … authenticates with OAuth … This repository is no longer actively maintained." It still documents TTS, voice cloning, transcription with speaker diarization and prompt-to-music — [GitHub README](https://github.com/elevenlabs/elevenlabs-mcp). The last PyPI release was 0.12.2 on 2026-08-04 — [PyPI elevenlabs-mcp](https://pypi.org/project/elevenlabs-mcp/).
- **MiniMax official MCP** (≈1.6k stars; 38 open issues; PyPI `minimax-mcp` 0.0.19 on 2026-08-21) offers `text_to_audio`, `voice_clone`, `generate_video` (README changelog still highlights Hailuo-02) and `text_to_image`. The README now recommends the **MiniMax CLI (mmx-cli)**, which "works as an AI agent skill for Claude Code" — [MiniMax-AI/MiniMax-MCP](https://github.com/MiniMax-AI/MiniMax-MCP); [PyPI](https://pypi.org/project/minimax-mcp/).
- **Suno**: no official API or MCP. Community servers go through a third-party API reseller ([AceDataCloud/SunoMCP](https://github.com/AceDataCloud/SunoMCP), 55 stars) or Playwright browser automation ([gunug/mcp-suno-ai](https://github.com/gunug/mcp-suno-ai), [jchoi2x/suno-mcp](https://github.com/jchoi2x/suno-mcp)).

**Image / video generation MCPs**
- **Google (official, "experiments" folder) — genmedia MCP servers in Go**:
  - Nano Banana (Gemini 3.1 Flash Image, Gemini 3 Pro Image, 2.5 Flash Image), Veo 3 & 3.1, Gemini TTS, Chirp 3 HD, Lyria, and **AVTool** (audio/video compositing)
  - stdio or `--transport http`; needs a Google Cloud project and GCS bucket
  - ships agent skills: genmedia-producer, video-editor (FFmpeg composition), audio-engineer, image-artist, voice-director, story-generator

  Source: [mcp-genmedia README](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia) (installer URL suggests the repo is now named `genmedia-creative-studio`).
- **Runway official API MCP**:
  - tools: `runway_listModels`, `runway_generateVideo` (image + text), `runway_generateImage`, `runway_upscaleVideo`, `runway_editVideo`, `runway_generateAudio` (TTS), `runway_getTask`, `runway_cancelTask`, `runway_getOrg`
  - recommended defaults: Nano Banana Pro, Seedance 2 and Aleph 2
  - validates payloads locally against per-model constraints, so "invalid payloads fail locally … and never hit the network"
  - installs as an unpacked Claude Desktop extension or via config
  - requires a paid Runway API account

  Sources: [runwayml/runway-api-mcp-server](https://github.com/runwayml/runway-api-mcp-server); [OpenMontage PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md) (API needs a paid plan).
- **Replicate official remote MCP** at mcp.replicate.com. It is a hosted server "automatically updated with the latest features from Replicate's HTTP API", with web-based auth using your API key. Agents can "search, compare and run any Replicate model — Veo, Kling, Wan, FLUX, SDXL, LTX and more" — [Replicate blog](https://replicate.com/blog/remote-mcp-server); [Replicate MCP docs](https://replicate.com/docs/reference/mcp) (search summaries). The older community server `deepfates/mcp-replicate` is archived — [GitHub](https://github.com/deepfates/mcp-replicate).
- **fal**: no official fal-built MCP server was found. Community options:
  - `raveenb/luminarylane fal-mcp-server`: 56 stars, 33 open issues, "600+ models through dynamic discovery"
  - `enescanguven/fal-mcp` and `RamboRogers/fal-image-video-mcp`
  - a Composio toolkit

  Sources: [luminarylane/fal-mcp-server](https://github.com/luminarylane/fal-mcp-server); [Composio](https://composio.dev/toolkits/fal_ai/framework/claude-code) (search summary: "multiple community implementations rather than a single official server").
- **Luma official MCP** (`lumalabs/luma-api-mcp`, Ray video + Photon image) has only **26 stars** (updated 2026-09-03), so adoption is low — [GitHub](https://github.com/lumalabs/luma-api-mcp).
- **Kling**: no official MCP found. Community `199-mcp/mcp-kling` has 41 stars; `apinetwork/piapi-mcp-server` (75 stars) routes Midjourney/Flux/Kling/Luma/Udio via the unofficial PiAPI. Kling's official API itself (video, image, TTS, avatar, lip-sync) is usable from scripts — [mcp-kling](https://github.com/199-mcp/mcp-kling); [piapi-mcp-server](https://github.com/apinetwork/piapi-mcp-server); [OpenMontage PROVIDERS.md](https://github.com/calesthio/OpenMontage/blob/main/docs/PROVIDERS.md).
- **Multi-provider agent tools**:
  - `vericontext/vibeframe` (170 stars): "Seedance, Runway, Veo, Kling on your own keys, behind a hard cost cap. CLI + MCP" — [GitHub](https://github.com/vericontext/vibeframe)
  - `ffroliva/gflow-cli` (220 stars, 64 open issues): drives Google Flow (Veo/Imagen) with an MCP server — "**Unofficial, alpha, not affiliated with Google**", so ToS risk — [GitHub](https://github.com/ffroliva/gflow-cli)
  - `Doriandarko/sora-mcp` (209 stars) becomes useless when the Sora API ends on 24 Sep 2026 — [GitHub](https://github.com/Doriandarko/sora-mcp)
- **Freepik/Magnific**: a small Claude Code skill repo says it is "built on the Freepik/Magnific MCP tools" — [ki-stuff/ai-video-agency-magnific](https://github.com/ki-stuff/ai-video-agency-magnific) (2 stars). Whether an official Freepik MCP exists is unverified.

**ComfyUI MCPs**
- **Comfy-Org official `comfy-mcp`** (created 2026-07-01, 233 stars, 25 open issues; PyPI `comfy-mcp` 0.10.0 on 2026-08-10; AGPL-3.0 or commercial):
  - "**Status: beta. 40 tools**"
  - built on `comfy-cli`; runs workflows (API- or UI-format JSON), text → image, job monitoring, introspection of installed nodes/models/templates, workflow validation and variants, and managing the ComfyUI server
  - reads GPU hardware and routes: "< 8 GB VRAM … don't run local diffusion", so use partner nodes or Comfy Cloud
  - Partner-API nodes spend credits, and it has confirmation prompts for destructive operations
  - a separate hosted **Comfy Cloud MCP** runs at `https://cloud.comfy.org/mcp` (remote HTTP, OAuth; Cursor lacks MCP OAuth, so it needs an API key there)

  Sources: [Comfy-Org/comfy-mcp README](https://github.com/Comfy-Org/comfy-mcp); [PyPI](https://pypi.org/project/comfy-mcp/).
- Community ComfyUI MCPs (stars on 2026-09-23):
  - `artokun/comfyui-mcp` (762): "178 tools, 36 AI skills", images/video/audio, edits the live graph; 95 open issues
  - `ATH-MaaS/Pixelle-MCP` (1.1k)
  - `jau123/MeiGen-AI-Design-MCP` (1.8k): GPT Image 2, Seedance & ComfyUI
  - `joenorton/comfyui-mcp-server` (410)
  - `ConstantineB6/comfy-pilot` (230): Claude Code sees and edits ComfyUI workflows

  Sources: [artokun/comfyui-mcp](https://github.com/artokun/comfyui-mcp); [Pixelle-MCP](https://github.com/ATH-MaaS/Pixelle-MCP); [MeiGen-AI-Design-MCP](https://github.com/jau123/MeiGen-AI-Design-MCP); [joenorton/comfyui-mcp-server](https://github.com/joenorton/comfyui-mcp-server); [comfy-pilot](https://github.com/ConstantineB6/comfy-pilot).

**FFmpeg / editing MCPs**
- `hyepartners-gmail/vibevideo-mcp` (218, "Agent MCP for ffmpeg") — [GitHub](https://github.com/hyepartners-gmail/vibevideo-mcp)
- `KyaniteLabs/kinocut` (163): "Guardrailed video editing MCP server … FFmpeg, Hyperframes, repurposing tools", subtitles — [GitHub](https://github.com/KyaniteLabs/kinocut)
- `video-creator/ffmpeg-mcp` (149) — [GitHub](https://github.com/video-creator/ffmpeg-mcp)
- `egoist/ffmpeg-mcp` (119) — [GitHub](https://github.com/egoist/ffmpeg-mcp)
- `misbahsy/video-audio-mcp` (86) — [GitHub](https://github.com/misbahsy/video-audio-mcp)
- `bitscorp-mcp/mcp-ffmpeg` (61) — [GitHub](https://github.com/bitscorp-mcp/mcp-ffmpeg)
- Google AVTool (in genmedia) — [mcp-genmedia](https://github.com/GoogleCloudPlatform/vertex-ai-creative-studio/tree/main/experiments/mcp-genmedia)

**"Video as code" with Claude Code**
- **Remotion Agent Skills** (official; repo created 2026-01-19; ≈4.7k stars):
  - install with `npx skills add remotion-dev/skills`
  - skills include `/remotion-best-practices`, `/remotion-create`, `/remotion-markup`, `/remotion-studio`, `/remotion-render`, `/remotion-captions`, `/remotion-maps`, `/remotion-interactivity`, `/remotion-docs`
  - an official **Claude Code plugin** repo was created 2026-07-16

  Sources: [remotion-dev/skills](https://github.com/remotion-dev/skills); [remotion-dev/claude-code-plugin](https://github.com/remotion-dev/claude-code-plugin).
- **HyperFrames** (HeyGen, open source; created 2026-03-10; **≈52.5k stars**): "Write HTML. Render video. Built for agents." It turns "HTML, CSS, media, and seekable animations into deterministic MP4 videos". It has 21 skills (`npx skills add heygen-com/hyperframes`), workflows such as `/product-launch-video`, `/faceless-explainer`, `/pr-to-video` and an on-demand `/figma` skill, and is also a hosted Claude connector — [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes); [connector page](https://claude.com/connectors/hyperframes).
- **Motion Canvas** (≈19.2k stars, active) and **Revideo** (now `midrender/revideo`, ≈4.1k stars) are code-first alternatives — [motion-canvas](https://github.com/motion-canvas/motion-canvas); [revideo](https://github.com/midrender/revideo).
- **OpenMontage** (≈61k stars; created 2026-03-29): "12 production pipelines, 100+ tools, 700+ agent skill and production-knowledge files". It works with Claude Code, Cursor, Copilot, Windsurf and Codex, and integrates 20+ video providers (Kling, Seedance, Gemini Omni, Veo 3.1, Runway, Grok, MiniMax H3, Higgsfield, HeyGen, local WAN/Hunyuan/LTX), image, TTS and music providers, plus FFmpeg, Remotion, HyperFrames and Blender. It has a "Backlot" live storyboard and approval gate — [OpenMontage](https://github.com/calesthio/OpenMontage).
- Other Claude-Code video kits:
  - `video-shotcraft` (≈9.3k stars; Remotion; "157 shot recipe cards", beat-synced cuts; sibling `video-talkcraft` for narration, Aug 2026) — [GitHub](https://github.com/Vincentwei1021/video-shotcraft)
  - `digitalsamba/claude-code-video-toolkit` (≈2.1k) — [GitHub](https://github.com/digitalsamba/claude-code-video-toolkit)
  - `DojoCodingLabs/remotion-superpowers` (123; "5 MCP servers") — [GitHub](https://github.com/DojoCodingLabs/remotion-superpowers)
  - `aqm857886159/Nomi` (521; desktop AI-video workbench with 24 MCP tools that Claude Code can drive; AGPL) — [GitHub](https://github.com/aqm857886159/Nomi)

### Inferences
- **Maturity tiers** (my assessment from vendor status, stars, open issues and maintenance signals):
  1. **Most production-ready, low friction:** Claude-directory connectors (Descript, HyperFrames, Canva, Figma, Cloudinary, Splice) and vendor-hosted remote MCPs (Replicate, Comfy Cloud, ElevenLabs hosted). They are OAuth-based, need no local install, and the vendor maintains them. Note that Anthropic itself warns it "cannot verify that they will work as intended or that they won't change".
  2. **Official but local or early:** Runway API MCP (well-designed: local schema validation, `listModels`), Google genmedia MCP (official but in an "experiments" folder), Comfy-Org `comfy-mcp` (declared beta), MiniMax MCP (lagging models; vendor pushes its CLI), Luma MCP (barely adopted).
  3. **Community:** useful but variable. Examples are artokun/comfyui-mcp (feature-rich, 95 open issues), fal community servers (33 open issues on the top one) and FFmpeg MCPs (small but simple, low-risk tools). Unofficial wrappers of consumer UIs (Google Flow via gflow-cli, Suno via Playwright) carry ToS and breakage risk.
- **ElevenLabs gap.** The directory connector is agents-only, and the hosted MCP is documented under the "agents-platform" docs. So it is **unclear whether any maintained ElevenLabs MCP exposes plain TTS/SFX/music in Sept 2026**. Robust options today: (a) the deprecated local `elevenlabs-mcp` (still on PyPI, unmaintained); (b) have Claude Code call the ElevenLabs API or SDK directly; (c) use Google Gemini TTS/Chirp/Lyria via genmedia MCP, or MiniMax TTS, as alternatives.
- **Industry direction.** For coding agents, vendors increasingly ship **Agent Skills + CLI** rather than MCP servers: Remotion skills, HyperFrames skills, HeyGen skills and CLI, MiniMax mmx-cli, Seedance Skill OS. For a Claude Code user this is often more reliable than MCP, because the agent runs deterministic CLIs and renders locally. Hosted MCP still suits Claude Desktop/web users.
- **Practical automation stack for the user** (who edits in Resolve or Adobe; other researchers cover those MCPs):
  - Claude Code as orchestrator with OpenMontage-style project files (script, shot list, cost ledger)
  - Runway MCP and/or Replicate remote MCP for multi-model generation (Seedance, Gemini Omni, Kling, Veo…)
  - Google genmedia MCP for Nano Banana keyframes, Veo 3.1, Lyria and Gemini TTS
  - Comfy-Org MCP or Comfy Cloud for local/open models and upscalers
  - an FFmpeg MCP (kinocut/vibevideo) for conform, proxies and caption burn-in
  - Remotion or HyperFrames for titles, lower thirds and captions
  - Higgsfield stays a manual UI step (no MCP in the directory), unless the Higgsfield researcher finds otherwise
- **Reliability pitfalls when Claude drives generation:**
  - long-running async jobs, so tools need polling or task IDs (Runway `getTask`, Comfy `jobs`)
  - outputs as expiring URLs vs local files
  - spend blow-ups, so use cost caps (vibeframe, OpenMontage cost estimates)
  - model IDs changing (Gen-4 Aleph removed 30 Jul 2026; Sora API off 24 Sep 2026), which argues for `listModels`-style discovery rather than hard-coded model names

### Gaps
- Could not fetch the ElevenLabs hosted-MCP documentation, so its exact tool list (TTS/SFX/music or agents only) is unconfirmed.
- Could not check mcp.so, glama.ai, smithery.ai or pulsemcp.com directly (egress blocked).
- No independent reliability benchmarks or error-rate data for any of these MCP servers exist in the sources found.
- Star counts are a 2026-09-23 snapshot and measure popularity, not quality.
- Runway MCP star count and release cadence were not retrieved.
- Whether fal ships an official MCP, and whether Freepik/Magnific has an official MCP, remain unverified.
- Higgsfield MCP availability was not examined (other researcher).
- No Topaz MCP was found; GitHub search returned nothing.

## Key question 5 — Named creator workflows (published stacks and tips) and the common mistakes that ruin quality

### Takeaway
The best-documented creator and studio workflows share a pattern. They start from a directed script and shot list, often with an LLM converting shot descriptions into prompts. They lock identity with reference stills. They generate short, single-action clips (I2V or first/last frame), re-roll heavily, and finish with real editing, sound and targeted upscaling. The recurring quality-killers are:
- letting text carry what a reference image should
- cramming multiple actions or camera moves into one clip
- skipping a storyboard or test shot
- identity drift across long sequences
- low-resolution inputs
- misusing creative upscalers on photoreal footage
- building on a single vendor (Sora)

Direct access to X, YouTube and Reddit was blocked, so named-creator coverage is thin.

### Cited Findings
- **PJ Accetturo (PJ Ace, Genre.ai):**
  - director with 15+ years in commercials and TV (Toyota, Red Bull, Atlanta Braves)
  - Genre.ai has "300 million views for brands including David Beckham's IM8, Kalshi, Qatar Airways, and Popeyes"
  - the Kalshi NBA Finals spot used Veo 3 with Gemini writing prompts from his shot descriptions, took 2–3 days and ≈$2,000, and he published the prompts
  - he calls his approach AI-infused "hybrid filmmaking"

  Sources: [The Daring Creatives](https://www.thedaringcreatives.com/creator-stories/pj-ace-nba-finals-ad/); [Shhots "15 Best AI Commercials of 2026"](https://shhots.ai/blog/best-ai-commercials/); [The Media Brain interview](https://themediabrain.substack.com/p/ais-disruption-of-advertising-and) (search summaries; the Kalshi project is June 2025, older than this report's Sept 2026 frame).
- **Emily (@Iamemily2050), Seedance 2.0 Skill OS:**
  - principle: "Direct the model. Don't micro-manage the frame."
  - one visible action and a clear endpoint per shot; fixed camera unless motion is the point; explicit sound choice
  - every reference labelled by role; continue from the last frame of an accepted clip
  - a retake protocol that diagnoses failures through "concrete repair levers: camera, lighting, motion, reference role, duration, framing, audio, or safety wording"

  Source: [Emily2040/seedance-2.0](https://github.com/Emily2040/seedance-2.0).
- **OpenMontage showcase productions, with published stacks and costs:**
  - "THE LAST BANANA": 60 s, 6 Kling v3 clips via fal, Google Chirp3-HD narration, royalty-free piano, TikTok-style word captions, Remotion composition, total **$1.33**
  - "Reimagine Your Universe": 50 s vertical, five generated motion scenes, Google Chirp narration, Pixabay score, HyperFrames composition, about **$4**
  - "SIGNAL FROM TOMORROW": sci-fi trailer with Veo-generated clips and Remotion composition

  Source: [OpenMontage README](https://github.com/calesthio/OpenMontage).
- **HeyGen** open-sourced "the HyperFrames compositions behind HeyGen's product launch videos", evidence that a video-AI company produces its own launch films as code — [heygen-com/hyperframes-launches](https://github.com/heygen-com/hyperframes-launches).
- **Common mistakes — prompting and planning:** "vague objectives", asking "text to carry information that a reference image could provide", "stack[ing] incompatible camera directions", and trying "to generate an entire sequence before testing its hardest shot" — [media.io](https://www.media.io/creative-tips/ai-video-mistakes.html) (search summary).
- **Common mistakes — inputs and consistency:** "low-resolution images (below 1080p) fed into AI systems result in 72% more artifacts"; "identity drift" is "particularly prevalent in longer sequences exceeding 30 seconds"; "73% of creators report AI-generated videos require at least 2–3 rounds of edits" — [Digen](https://resource.digen.ai/common-mistakes-ai-video-generation-fix-2026/); [Percify](https://percify.io/blog/ai-video-fails-how-to-avoid-common-errors-win-in-2026-percify) (search summaries). **Low-quality SEO sources with unsourced statistics; use only qualitatively.**
- **Common mistakes — finishing:** Topaz Astra 2 "is explicitly not for photoreal fidelity work", so using it on photoreal faces is a misuse; Starlight Precise targets the "plastic" AI look instead — [BuildFastWithAI](https://blog.buildfastwithai.com/topaz-astra-2-ai-video-upscaler-prompt-controls); [Z.Tools](https://z.tools/blog/topaz-labs-starlight-2-5-upscale).
- **Vendor-risk lesson:** commentary on the Sora shutdown ("When AI Vendors Fail: Lessons From The Sora Shutdown", Forbes, 2 Apr 2026) — [Forbes](https://www.forbes.com/sites/johnsviokla/2026/04/02/when-ai-vendors-fail-lessons-from-the-sora-shutdown/) (title/summary only).
- **Likeness constraint:** Seedance's real-face block means pipelines needing a real actor's face must use other models (e.g., Veo/Kling) or licensed avatars. "Virtual-character workflows are the safer default path" — [AIVidPipeline](https://aividpipeline.com/blog/seedance-real-human-face-rules-2026).

### Inferences
- **Consolidated "don'ts"** for the report:
  1. Don't start generating without a shot list and style/character bible.
  2. Don't use text-to-video for hero shots; use I2V, first/last frame or references.
  3. One action, one camera instruction and one endpoint per clip. Test the hardest shot first.
  4. Keep clips short (≈5–10 s; multi-shot models excepted) and cut on action. Long single takes drift.
  5. Feed high-resolution, consistent keyframes, and label reference roles.
  6. Upscale only selected takes, with the right upscaler for the content (Starlight for photoreal, Astra for stylized).
  7. Rebuild sound: dialogue, music and SFX drive perceived quality as much as the image.
  8. Keep model-agnostic prompts and a router (Runway API, Replicate, fal) to survive shutdowns and model swaps.
  9. Clear music licensing for client work.
  10. Cap agent spend.
- Across all sources, creator workflows increasingly look like software pipelines: versioned shot lists, cost ledgers, approval gates, re-roll protocols. That suits Claude Code orchestration.

### Gaps
- Could not retrieve 2026 workflows or tool stacks from:
  - Curious Refuge (courses, AI Film Festival)
  - other well-known AI filmmakers and studios (e.g., Dave Clark / Promise, Hashem Al-Ghaili, The Dor Brothers, Tim Simmons / Theoretically Media, Primordial Soup, Critterz team, Runway AIFF 2026 winners)
  - German-language creator sources

  X/Twitter, YouTube and Reddit were blocked by the network proxy, and the search budget ran out before these queries.
- The PJ Ace case is from mid-2025; no verified 2026 update of his stack was found.
- The Digen and Percify statistics are unsourced and should not be quoted as facts.
