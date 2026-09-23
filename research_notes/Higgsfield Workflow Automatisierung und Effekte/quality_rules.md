# Quality rules for a "perfect", professional-looking AI video (as of 23 Sept 2026): model-specific prompting (Seedance 2.5/2.0, Kling 3.0, Veo 3.1, Runway), consistency, edit/sound/finish, avoiding the "AI look"

> **Method note (read first).**
> - **Read in full:**
>   - GitHub files, fetched through raw.githubusercontent.com:
>     - Higgsfield's official `higgsfield-ai/skills`
>     - Emily2040's Seedance 2.0 Skill OS
>     - OSideMedia's community Higgsfield prompt skill (v3.35.0, specs snapshot 2026-08-07, files updated up to 2026-08-22)
>     - jnMetaCode's short-film skill
>     - Anil-matcha's Seedance 2.5 API guide
>   - Google's Veo 3.1 prompting guide on the Google Cloud Blog.
> - **Blocked by the egress proxy:** kling.ai, help.runwayml.com, docs.byteplus.com, seed.bytedance.com, dreamina.capcut.com, fal.ai, openart.ai, invideo.io, opus.pro, shhots.ai, x.com, youtube.com and higgsfield.ai. Everything from those sites is taken from search-engine summaries. The URL given is the result the statement most likely came from; if a summary merged several results, that attribution is a best guess.
> - **"[community transcription]"** marks two kinds of material, neither checked against the original:
>   - a third-party GitHub skill's summary of an official source it cites, such as ByteDance's Dreamina Seedance 2.5 prompt guide or Higgsfield's "Hell Grind" open-source brief;
>   - numbers a third party took down from Higgsfield's own "Road to Cannes" videos.
> - **Scope:** tool/pipeline facts already in `../Higgsfield Workflow Resolve vs Adobe/higgsfield.md` and `end_to_end_pipeline.md` (CLI parameters, Topaz models, frame-rate basics, Soul ID photo counts) are only referenced here, not repeated.
> - **Search budget:** 36 web searches.

## Q1 — Official prompting guides as of Sept 2026 (Higgsfield, Seedance 2.x, Kling 3.0, Veo 3.1, Runway): key rules, prompt templates, camera language, audio prompting, constraints, clip lengths

### Takeaway
Every vendor guide gives the same core template:
1. **subject and one concrete action** first,
2. then **scene/context**,
3. then **explicit camera language** (shot size, angle, one motivated move),
4. then **light/style described concretely**, not with praise words,
5. then **audio written as its own layer**,
6. then **constraints phrased positively**.

Parameters such as duration, resolution and aspect ratio go into settings, not into the prose.

The models differ in three ways:
- **how multi-shot is written:**
  - Kling: `shot n, seconds, text;`, 1–6 shots in 3–15 s
  - Seedance 2.5: continuous time ranges or stages with explicit end states, 4–30 s
  - Veo 3.1: `[00:00-00:02]` timestamps inside 4/6/8 s
- **how references are bound:**
  - Kling: `@element` / `<<<element_1>>>`
  - Seedance 2.5: `@Image 1 defines … Do not use …`
  - Veo 3.1: "ingredients", up to 3 images
- **audio syntax:**
  - Veo: quoted dialogue plus `SFX:` / `Ambient noise:`
  - Seedance 2.5: `()` music, `<>` SFX, `{}` dialogue, `【】` subtitles

Negative prompts depend on the surface. Veo's API and Kling's own site have a dedicated field. Runway and most Higgsfield-hosted models do not, and there you must phrase positively.

### Cited Findings

**Cross-vendor / Higgsfield official (agent-facing)**
- Higgsfield's official agent skill says prompts should be "concrete, sensory" and built as:
  - **subject + setting + style**
  - **Camera:** lens (35mm, 85mm), angle, motion (dolly in, tracking shot)
  - lighting
  - style/medium

  It also says: "**Keep it under ~200 tokens. Models distort with very long prompts.**"

  Source: [higgsfield-ai/skills prompt-engineering.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/prompt-engineering.md) (read in full).
- Same file, image-to-video: "`--start-image` anchors the first frame. Prompt describes motion… **Don't redescribe the static frame — model already has it.**" For image-to-image: "describe what changes, not redescribe the input" — [same](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/prompt-engineering.md)
- Same file: "Most models don't expose a `negative_prompt`. Phrase positively: Instead of 'no blur' → 'tack sharp'; instead of 'no people' → 'uninhabited landscape'." Jobs end with `nsfw` or `ip_detected` status for real public figures, sexual content and trademarks/branded characters — [same](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/prompt-engineering.md)
- Higgsfield's model routing for agents:
  - "**Default all-purpose serious video (multi-shot, consistent identity, motion-heavy, image-to-video, 4–30s requests) → Seedance 2.5.**"
  - "Single-plane scene without strong dynamics, lower-cost option → Kling 3.0"
  - "Fast batch / volume → Veo 3.1 Lite"
  - "Don't pre-estimate cost or optimize for cheaper models unless the user asks. **Prefer the quality default first.**"

  Source: [higgsfield-generate SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md).

  The README's quick-reference row gives a different default for image-to-video: "Prefer `seedance_2_0` with `--start-image`; use `kling3_0` as lower-cost fallback" — [skills README](https://github.com/higgsfield-ai/skills) *(small internal inconsistency: SKILL.md says 2.5, README says 2.0)*.
- **Cinema Studio prompts have a hard 512-character cap.** Common mistakes listed:
  - redescribing the image in I2V
  - contradictory moves (dolly in plus dolly out)
  - aspect ratio written into the prompt body
  - "multiple @ Elements in action scenes" (use @ for static scenes and plain text for action)

  Source: [OSideMedia higgsfield-prompt SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-prompt/SKILL.md) (community skill).
- Higgsfield's own Seedance prompt-writer skill, shipped with the Seedance-4K release in July 2026, as transcribed by the community skill [community transcription]:
  - **Block scaffold.** Block order: SCENE CONTEXT → ACTIVE REFERENCES → LOCATION MAP → FIRST FRAME/BLOCKING → FORMAT MODE → OPTICS → CAMERA → ACTION → PERFORMANCE → PHYSICS → LIGHTING → COLOR GRADE → WARDROBE → AUDIO → STYLE → OUTPUT SETTINGS → POSITIVE LOCKS. Use only the blocks a shot needs.
  - **"Measurable-language rules."** Positive phrasing only. Speeds in km/h ("not 'fast'"). Fog in %. White balance in Kelvin, fixed within a scene (3200K/4000K/5600K/8500K). Left/right always from the camera. Emotion through muscle movement. Heights in cm for 2+ characters.
  - "**No director names, signature works, or equipment model names** — they get ignored or break complex moves". English prompts only.

  Source: [OSideMedia higgsfield-seedance SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance/SKILL.md).

**Seedance 2.5 (ByteDance; Higgsfield default video model)**
- **Official sources exist but could not be read:**
  - BytePlus "Dreamina Seedance 2.5 prompt guide" — [docs.byteplus.com/…/2607689](https://docs.byteplus.com/en/docs/ModelArk/2607689)
  - ByteDance Seed launch post "One-Take Creation, Flexible Referencing: Introducing Seedance 2.5" — [seed.bytedance.com](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5)
  - Dreamina guide — [dreamina.capcut.com](https://dreamina.capcut.com/seedance/seedance-2-5-prompt)

  All were egress-blocked.
- **Higgsfield specs** [verified]:
  - 4–30 s output
  - modes `t2v` / `omni_reference` / `video_edit` / `video_extension`
  - image/video/audio reference arrays
  - `t2v` takes no media; start/end frames go through `omni_reference`

  Source: [higgsfield-generate SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md).
- **Reference budget:** "up to 30 images, 10 video clips, and 10 audio clips … in a single pass" (50 materials) — [search summary of Dreamina/Higgsfield/OpenArt guides](https://higgsfield.ai/blog/seedance-2-5-prompting-guide); [Anil-matcha Seedance 2.5 guide](https://github.com/Anil-matcha/awesome-seedance-2.5-api-prompts). *Conflict:* one Higgsfield summary says "Up to 50 reference images" — [Higgsfield blog](https://higgsfield.ai/blog/seedance-2-5-prompting-guide). Treat 30 images + 10 videos + 10 audio as the likely breakdown.
- **Official prompt formula (Dreamina guide)** [community transcription]:

  `<Subject> performs <primary action or event> in <scene and environment>. The visuals feature <visual style>. Use <shot size, camera angle, camera movement, or cuts>. Audio includes <dialogue, ambience, sound effects, or music>.`

  Rules that come with it:
  - "Combine only the parts the shot needs."
  - Stacked buzzwords ("cinematic, 8K, masterpiece") "sample nothing in particular."
  - "Generation parameters are not prompt text."

  Source: [OSideMedia higgsfield-seedance-2-5 SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md).
- **Reference roles** [community transcription of the Dreamina guide]:
  - Pattern: `@Image 1 defines <subject>'s <appearance…>` / `@Video 1 defines <motion, camera movement, or pacing>` / `@Audio 1 defines <voice…>`.
  - Every material gets an explicit role **and an exclusion**, e.g. "@Image 2 defines the workbench and window light. Do not use the people in the image."
  - "Video-only references are motion/pacing references by default."
  - Several views of one subject must be declared as one subject ("The output must contain only one lamp throughout"); otherwise the model duplicates it.
  - Character sheets "leak their staging": exclude "the gray backdrop, the panel borders, or the multi-view layout".
  - "Material content outranks upload order."

  Source: [same](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md).
- **Stable ranges** [community transcription]:
  - images: 1–8 distinct subjects
  - video/audio references: 1–5 subjects, 5–10 s each

  A Higgsfield summary agrees: "Eight or fewer people or products in one video stays reliable… Short reference clips of 5 to 10 seconds work better than long ones" — [OSideMedia](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md); [Higgsfield blog via search](https://higgsfield.ai/blog/seedance-2-5-prompting-guide).
- **Long clips are staged, not written as one paragraph:**
  - Structure: `[Generation Goal]`, then `[Stage n]` with "Initial state / Primary event / **End state**", then `[Maintain Consistency]`. One primary state change per stage.
  - Time ranges must be "**consecutive and non-overlapping**" whole seconds (e.g. 0–3, 3–7, 7–15). They are "a time budget, not a frame-accurate edit point."
  - "If a time range contains too little, the model will improvise; if it contains too much, actions may be omitted or the edit may become frantic."

  Sources: [OSideMedia](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md); [Higgsfield blog via search](https://higgsfield.ai/blog/seedance-2-5-prompting-guide).
- **Audio/text bracket syntax (official Dreamina, per transcription):**
  - Brackets: `()` music · `<>` SFX · `{}` dialogue · `【】` subtitles.
  - Non-Chinese dialogue needs a language line before it: "Dialogue language: authentic Los Angeles English. The young man says…: {No way, you actually made it.}"
  - ByteDance calls the suppression of random subtitles and unrequested BGM a headline 2.5 fix. The skill still recommends writing `NO BGM` after a positive list of diegetic sounds.

  Source: [OSideMedia](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md).
- **First/last frame on 2.5 is written as prompt statements, not a mode.**
  - One role sentence per image. "Never merge the anchors."
  - The output aspect ratio locks to the first image; mismatched ratios stretch the last frame.
  - For multi-keyframes: "Use @Image 1 through @Image N as keyframes in this order".

  Source: [OSideMedia](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md).
- **Emotion:** give "two to four [observable] cues" (eyes, brows, mouth, breathing, gaze, hands) rather than adjectives. Niche camera terms should be translated into their visible result, e.g. "Rack focus: shift focus smoothly from the leaves in the foreground to the person in the background…" [community transcription of Dreamina] — [OSideMedia](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md)
- **Hard limits (official, per transcription):**
  - "Frame-level text accuracy is not promised." Subtitles, signs and product specs need prepared materials plus post.
  - Extensions connect "naturally, not identically".
  - Chain math: a source ≤30 s can be extended by 4–30 s, so one chain tops out at 60 s; after that, re-anchor from the original references.

  Source: [OSideMedia](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md).
- **Resolution on Higgsfield (conflicting sources, resolved):**
  - The community snapshot of 2026-08-07 said "2.5 caps at 720p" — [OSideMedia](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md).
  - Higgsfield's official skill says "up to 1080p" — [higgsfield-generate SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md).
  - A search summary says "Seedance 2.5 officially available in 1080p on Higgsfield", with Unlimited "capped at 720p" and 2.5 available "on Pro and Plus plans and above" — [Higgsfield blog: Seedance 2.5 on Higgsfield](https://higgsfield.ai/blog/seedance-2-5-on-higgsfield-2026); a YouTube video is titled "Seedance 2.5 1080p Update" — [YouTube](https://www.youtube.com/watch?v=AeL8X96Pl0c).
  - A MuAPI-affiliated guide claims native 480p/720p "plus upscaled 1080p and 4K routes" — [Anil-matcha](https://github.com/Anil-matcha/awesome-seedance-2.5-api-prompts).
- **Choosing 2.0 vs 2.5 (community skill):**
  - Seedance 2.0 when you need native 4K, a platform-pinned start/end-frame media role, or a `genre` hint.
  - Seedance 2.5 for clips over 15 s, editing or extending existing video, or more than 9 image / 3 video / 3 audio references.
  - "a 2.5 draft validates the *prompt*, not the 2.0 render."

  Source: [OSideMedia](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md).
- **Third-party 2.5 claims (MuAPI-affiliated guide; vendor-adjacent, unverified):**
  - "The first 20–30 words carry the most weight"; target 60–100 words.
  - "Lighting descriptions have the biggest single impact on video quality. One strong lighting keyword beats ten adjectives."
  - Better adherence to negatives such as "no subtitles / no bgm".
  - Fewer "twinning" (duplicate-person) glitches; less blur after 3 extensions.

  Source: [Anil-matcha](https://github.com/Anil-matcha/awesome-seedance-2.5-api-prompts). *Contradicted by* Emily2040's skill: "Earlier words are not proven to receive a fixed larger weight" — [model-mechanics.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/model-mechanics.md).

**Seedance 2.0 (still relevant on Higgsfield for 4K and start/end frames)**
- Official model facts:
  - references up to 9 images, 3 videos, 3 audio clips
  - native 480p/720p; 1080p depends on the surface
  - 4–15 s
  - "seed = stabilizer, not lock"

  ByteDance's own launch material lists these weaknesses: "detail stability, hyper-realism, dynamic vitality, multi-subject consistency, text rendering, complex editing, and occasional audio distortion."

  Sources: [Emily2040 api-status.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/api-status.md); [research-2026-05-30.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/research-2026-05-30.md); [capability-map.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/capability-map.md).
- **Prompt skeleton:** `Subject + Action + Scene + Camera + Lighting/Style + Audio + Constraints`, with the subject and primary action first. The camera gets "One primary move with endpoint" (e.g. "slow dolly-in from medium product shot to macro label detail"). Audio example: "Sound: low room tone, soft glass chime on final frame."

  When a prompt is too long, cut in this order: "duplicate style adjectives, generic quality words, background details visible in references, secondary camera moves, secondary actions, and speculative emotional labels."

  Source: [Emily2040 seedance-prompt SKILL.md](https://github.com/Emily2040/seedance-2.0/blob/main/skills/seedance-prompt/SKILL.md).
- **Mode rules:** "**T2V** needs subject, action, scene, camera, light, style, and constraints… **I2V** starts from `@Image1` and adds only motion, time, camera, lighting transition, audio, and preservation"; FLF2V: "State `@Image2` is the final visual target" — [same](https://github.com/Emily2040/seedance-2.0/blob/main/skills/seedance-prompt/SKILL.md)
- **Short-form length (community, empirical):** 50–80 words is the sweet spot ("A 70-word prompt reliably outperforms a structurally identical 200-word version"), in three sentences: ① subject + action, ② camera + style, ③ constraints/locks. "`fast` is the highest-degradation keyword": describe physics instead ("feet striking hard, each stride at full extension").

  Field-of-view guidance: give FOV in degrees using discrete anchors (84° wide … 29° portrait … 12° tele-detail), and place the camera block third.

  Source: [OSideMedia higgsfield-seedance SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance/SKILL.md). *Tension:* Higgsfield's official skill uses mm lens terms (35mm, 85mm) — [prompt-engineering.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/references/prompt-engineering.md).
- **Drafts validate the prompt, not the take.** Seedance 2.0 on Higgsfield has no seed parameter, so re-running an approved 480p draft at 1080p is "a fresh roll". Drafts *can* validate shot count, blocking, identity contamination, dialogue placement and filter pass. They *cannot* validate performance, the camera's micro-trajectory, beat timing or fine detail. "Fine-detail judgments must be re-checked at final resolution." — [OSideMedia](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance/SKILL.md)
- Real human faces in uploaded references are blocked at the model layer on ByteDance channels, and the block carries through to third-party APIs. Virtual characters are the safer default — [AIVidPipeline](https://aividpipeline.com/blog/seedance-real-human-face-rules-2026) (from earlier notes).

**Kling 3.0 (Kuaishou; on Higgsfield as `kling3_0` std/pro/4k)**
- **Official guide (search summary; kling.ai blocked):**
  - Kling 3.0 merges "Native Audio with Element Consistency Control" and supports "up to 15 seconds".
  - Multi-shot "understand[s] scene coverage… from classic shot-reverse-shot dialogues to… cross-cutting dialogue and voice-over."
  - "Custom Multi-Shot" controls each shot's content and duration.

  Source: [Kling VIDEO 3.0 Model User Guide](https://kling.ai/quickstart/klingai-video-3-model-user-guide).
- **Multi-shot syntax (search summary):** "`shot n, m, words; shot n, m, words;`" where n = shot number (**1–6 shots**) and m = seconds (**each shot ≥ 1 s; sum must equal total duration**), with a shot prompt of **max 512 characters**. Total 3–15 s: "the more shots you add, the fewer seconds remain available for each one." — [Kling multi-shot guide](https://kling.ai/blog/kling-video-3-multi-shot-guide) (exact source page among results not verified)
- **Elements:** "each shot has an @elements input for tagging a character, a product, or an object that must stay consistent" — [Kling user guide via search](https://kling.ai/quickstart/klingai-video-3-model-user-guide). Kling's "Prompt Syntax 2.0" post (dated **30 Mar 2026**) introduces Omni reference tags in triple angle brackets, `<<<element_1>>>` / `<<<voice_1>>>` — [kling.ai blog](https://kling.ai/blog/kling-3-prompt-syntax-omni-reference-tags-video-physics) (search summary).
- **Dialogue:** "Without explicit tagging, the model may assign voices to the wrong faces… especially with three or more characters." Label as `[Character: Description, Voice Tone]`. Then "name the speaker, write the line, and describe the intended emotion or delivery."

  Voice binding takes a 5–30 s audio sample or voice extracted from a clip. For Omni, a 3–8 s video clip "extracts facial dynamics and voice characteristics."

  Sources: [Kling subject-binding guide](https://kling.ai/blog/kling-3-subject-binding-character-consistency); [Atlas Cloud](https://www.atlascloud.ai/blog/guides/how-to-use-kling-3.0-for-character-consistency) (search summary).
- **fal's Kling 3.0 guide (search summary):**
  - Kling "performs best when prompts are written like directions to a scene rather than a list of objects."
  - "Clearly label shots and describe each one's framing, subject, and motion."
  - "Define your core subjects clearly at the beginning of the prompt and keep descriptions consistent across shots."

  Source: [fal Kling 3.0 Prompting Guide](https://blog.fal.ai/kling-3-0-prompting-guide/).
- **Curious Refuge review (Feb 2026):**
  - Score 8.1/10, "the highest-scoring AI video model… reviewed to date for image-to-video".
  - Strengths: multi-shot inside one clip with "camera motion, dialogue, pauses, and reactions"; "Locked-off closeups felt especially strong."
  - Weaknesses: "Lip sync was decent but inconsistent, character cloning often drifted in facial likeness… **Color grading often shifted between cuts**"; larger edits (crowds, era change) break down.

  Sources: [Curious Refuge Kling 3.0 review](https://curiousrefuge.com/blog/kling-30-review); [Curious Refuge on X, 5 Feb 2026 (Kling 3.0 vs Veo 3.1)](https://x.com/CuriousRefuge/status/2019543988479611224) (search summary).
- **On Kling's own platform** Kling has a dedicated negative-prompt field ("use for stability artifacts (sliding feet, extra fingers, morphing), not generic 'quality' words"). Its pre-generation banned-word filter "rejects the whole prompt on one match" — [jnMetaCode model table](https://github.com/jnMetaCode/ai-shortfilm-prompts). **Higgsfield's CLI schema for Kling 3.0 exposes only `mode`, `sound`, aspect (16:9/9:16/1:1) and duration**, with no negative field — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) (from earlier notes).

**Veo 3.1 (Google)**
- **Official guide** (Google Cloud Blog, **16 Oct 2025**; older than 2026 but still the current Veo 3.1 doctrine) — [Ultimate prompting guide for Veo 3.1](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1) (read in full):
  - Formula: "**[Cinematography] + [Subject] + [Action] + [Context] + [Style & Ambiance]**"
  - Example: "Medium shot, a tired corporate worker, rubbing his temples… lit by the harsh fluorescent overhead lights and the green glow of the monochrome monitor. Retro aesthetic, shot as if on 1980s color film, slightly grainy."
  - Named vocabulary:
    - camera moves: dolly, tracking, crane, aerial, slow pan, POV
    - composition: wide, close-up, extreme close-up, low angle, two-shot, medium, reverse shot
    - lens/focus: shallow DoF, wide-angle, soft focus, macro, deep focus
  - Audio:
    - dialogue in quotation marks ("A woman says, 'We have to leave now.'")
    - "SFX: thunder cracks in the distance"
    - "Ambient noise: the quiet hum of a starship bridge"
    - music as an SFX line ("SFX: A swelling, gentle orchestral score begins to play")
    - an optional "Emotion:" tag
  - Negative prompts: "describe what you wish to exclude. For example, specify 'a desolate landscape with no buildings or roads' instead of 'no man-made structures'."
  - Controls:
    - "Ingredients to video": reference images for consistency across shots, with audio
    - "First and last frame": the prompt describes the transition plus audio
    - Add/remove object: uses Veo 2, no audio
  - **Timestamp prompting** for multi-shot inside one 8 s clip: `[00:00-00:02] Medium shot… [00:02-00:04] Reverse shot… SFX:… [00:06-00:08] Wide, high-angle crane shot…`
  - 720p/1080p, 16:9 or 9:16, **4, 6 or 8 s**, SynthID on all output. Use Gemini to enrich simple prompts.
- **Veo 3.1 specs (search summaries):**
  - "up to 720p, 1080p, and 4K at 24fps"
  - negative-prompt field (e.g. "barking, woofing")
  - "up to 3 reference images"
  - extension in 7 s hops, up to 20 times (8 s → 148 s); as of Dec 2025 extension needed 720p/24fps input

  Sources: [Google AI Studio Veo 3.1](https://aistudio.google.com/models/veo-3); [Replicate blog](https://replicate.com/blog/veo-3-1); [AIFreeAPI extension guide](https://www.aifreeapi.com/en/posts/veo-3-extend-video-length).

  One creator skill notes that extension quality "degrades after 4–5 extensions" and that the negative field wants plain nouns ("extra limbs, glitch morphs"), with "**no `no`/`don't` command phrasing**" — [jnMetaCode](https://github.com/jnMetaCode/ai-shortfilm-prompts).
- **On Higgsfield** Veo 3.1 runs only 4/6/8 s, 16:9/9:16, `--quality basic|high|ultra`. Veo 3.1 Lite must be 8 s when both start and end frames are set — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) (from earlier notes).
- **Dialogue craft (search summaries):**
  - "Keep dialogue short (under 8 seconds, one line)"; long speeches cause "dropped lines or lip sync drift"
  - "Short lines, visible mouths, and clear pacing… avoid heavy music that masks consonants"
  - "If brand voice, accent, or legal needs are strict, you should replace the native AI voice"
  - speaker + visual description plus colon/quotes trigger lip-sync

  Sources: [Prompt Architects](https://prompt-architects.com/blog/101-veo-dialogue-prompts); [GlobalGPT](https://www.glbgpt.com/hub/how-to-make-characters-speak-in-veo-3-1-the-ultimate-guide-to-dialogue-audio-lip-sync/); [Easton](https://eastondev.com/blog/en/posts/ai/20251207-veo3-audio-generation-guide/).
- **Known Veo bug:** burned-in subtitles appear "whenever it detects speech", probably because of YouTube-heavy training data. Workarounds:
  - a negative prompt such as "without any subtitles or captions"
  - "Label the speaker by position and appearance, not just name" ("the woman on the left in the red jacket")
  - in post, crop "the bottom 12–18%"

  Sources: [Yapper](https://yapper.so/articles/remove-veo3-subtitles); [veo3ai.io (2026)](https://www.veo3ai.io/blog/veo-3-remove-subtitles-captions-fix-2026); [Google support thread](https://support.google.com/gemini/thread/346109881/veo-3-keeps-appending-subtitles?hl=en).

  *Conflict:* the same sources suggest avoiding quotation marks to prevent subtitles, while Google's official guide *uses* quotation marks for dialogue — [Google Cloud](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1).

**Runway (Gen-4.5; also hosts Seedance 2/2.5)**
- Official help pages (search summaries; site blocked):
  - "Effective image to video prompts focus almost exclusively on motion. Rather than describing elements present in the image, use your prompt to describe the motion of the scene" — [Runway I2V Prompting Guide](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide)
  - "Conversational elements like greetings or explanations waste valuable prompt space" — [Gen-4 Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide)
  - Gen-4.5 "excels at understanding and executing complex, sequenced instructions… camera choreography… precise timing of events" — [Creating with Gen-4.5](https://help.runwayml.com/hc/en-us/articles/46974685288467-Creating-with-Gen-4-5)
- "Negative phrasing is not supported and may produce unpredictable or even **opposite** results": "No camera movement" → write "Camera holds completely static" — [Runway Gen-4 guide](https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide); [Gen-3 Alpha guide](https://help.runwayml.com/hc/en-us/articles/30586818553107-Gen-3-Alpha-Prompting-Guide) (search summary)
- Runway's Seedance help shows multi-shot written as plain prose with "cut to", without numbered headings. Emily2040's skill states "No cited source establishes a universal `Shot N` parser" — [Emily2040 multishot-grammar.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/multishot-grammar.md), citing [Runway help](https://help.runwayml.com/hc/en-us/articles/50488490233363-Creating-with-Seedance-2-0)

### Inferences
**Agent-ready prompt templates, one per model.** These are synthesised from the findings above; test and adapt them per project.
- **Seedance 2.5 (Higgsfield `seedance_2_5`, mode `omni_reference`):**
  1. A reference role map, with an exclusion on every line.
  2. `[Generation Goal]`, then stages or continuous time ranges, each with a *visible end state*.
  3. Camera: size, angle and one move per stage, naming which subject the camera follows.
  4. Audio in brackets plus a dialogue language line.
  5. `[Maintain Consistency]` locks.
  6. For a pure diegetic track: `NO BGM`, with no `【】` block.
- **Seedance 2.0 (short-form):** keep to 50–100 words across three sentences: subject + action → camera + style → locks. For production shots, use the block scaffold with positive locks. Use it when you need 4K or a platform-pinned start/end frame.
- **Kling 3.0:**
  - Define elements first (character/product with @ or `<<<element_n>>>`), then `shot 1, 3, …; shot 2, 4, …;`.
  - Durations must sum to the total; ≤6 shots; ≤512 characters per shot.
  - Label speakers `[Name: look, voice tone]`, one line each.
  - Keep descriptors identical across shots.
  - Kling tends toward colour shifts between cuts, so plan a per-shot grade match in post.
- **Veo 3.1:**
  - Build the prompt in five parts (cinematography, subject, action, context, style), then add `SFX:` and `Ambient noise:` lines.
  - Keep each dialogue line in 8 s or less.
  - Add a negative "subtitles, captions, on-screen text".
  - Label speakers by look and position.
  - For consistency, use up to 3 ingredients or first/last frame.
  - Use Veo for dialogue close-ups and realism, not for long multi-shot sequences.
- **Runway Gen-4.5 / Aleph:**
  - Image-to-video: describe motion only.
  - Keep the prompt short and positive.
  - Use Gen-4.5 for complex camera choreography within one shot.
  - Use Aleph 2 to edit existing footage.
- **Universal rule set for an agent:**
  - Settings (duration, resolution, aspect) never go into the prose.
  - One primary action and one camera move per shot; always state the endpoint.
  - Use concrete, measurable nouns instead of praise words.
  - Treat audio as its own layer.
  - Phrase positively unless the surface has a dedicated negative field.
  - On-screen text goes to post.
- **Where sources disagree, the safest defaults are:**
  - **Director/equipment names:** leave them out of production (block-scaffold) prompts, as Higgsfield's own rule says. In short creative prompts, camera or lens names are optional seasoning; see Q2 for Mx-Shell.
  - **Early-token weighting:** unproven. Put subject + action first anyway, because every guide agrees on that order.

### Gaps
- The official Kling, BytePlus/Dreamina, ByteDance Seed, Runway and fal pages could not be read directly. Kling's multi-shot syntax, 512-character cap and element-tag format rest on search summaries. The Dreamina Seedance 2.5 guide rests on a community transcription.
- No official 2026 Veo guide newer than the Oct 2025 blog post was found, and no evidence of Veo 3.2 or Veo 4 in the Higgsfield catalog.
- No authoritative source shows whether Higgsfield passes a Kling negative prompt or `cfg_scale` to the model. The CLI schema doesn't list them.
- Runway Gen-4.5's own clip-length recommendations and its Aleph 2 prompting guide were not retrieved.

## Q2 — Creator techniques in 2026: story and hook, storyboard, "generate many, pick few", multi-shot, pacing and edit rhythm, sound design, grain/grade, frame rate, upscaling

### Takeaway
The best-documented 2026 productions work like disciplined film crews:
- **Assets and a test come before any shot:**
  - lock character, location and prop sheets
  - test the hardest shot first
- **Direct one job per generation:** physics *or* performance, one action, one camera move.
- **Budget for massive over-generation.** Higgsfield's 90-minute *Hell Grind* feature kept about **1% of images and 1.5% of videos**. The acclaimed short *Zombie Scavenger* used about 200+ video generations for ~40 final clips.
- **Finish in the edit.** Cut short pieces (4–6 s average, cut on action/beat), bridge them with sound (J/L cuts), and add licensed music in post instead of model-generated score.
- **Unify the look in post.** Normalise each clip, apply one grade, then grain.
- **Upscale only selected takes,** with the upscaler matched to the content.

### Cited Findings

**Named creators and productions**
- **PJ Accetturo (PJ Ace, Genre.ai)** — search summary merged several sources; exact attribution and date uncertain, partly from the 2025 Veo 3 era:
  - "Each prompt should fully describe the scene as if the AI has no context of the shot before or after it, re-describing the setting, character, and tone every time"
  - "Avoid describing background music ('or it'll be mixed super loud')", and "use accents explicitly"
  - he ran Veo prompts "in batches of three, using multiple browser windows"
  - clients should be told in the contract that "the storyboard exists as a directional artifact, not a frame-locked deliverable"
  - keep "workflow portability across 2 to 3 alternative tools per category"
  - make AI's "unexpected, high-energy chaos… the brand strategy"

  Sources: [The Media Brain interview](https://themediabrain.substack.com/p/ais-disruption-of-advertising-and); [Shhots: 15 Best AI Commercials of 2026](https://shhots.ai/blog/best-ai-commercials/); [AI Video Bootcamp career guide 2026](https://aivideobootcamp.com/blog/ai-video-career-guide-2026/); [ScreenWeaver ad workflow](https://www.screenweaver.ai/blog/produce-ad-with-ai-workflow).

  His 2025 Kalshi spot used Gemini to turn shot descriptions into Veo prompts — [The Daring Creatives](https://www.thedaringcreatives.com/creator-stories/pj-ace-nba-finals-ad/) (older, June 2025; from earlier notes).
- **"Zombie Scavenger" by Mx-Shell.** PJ Ace (10 May 2026) called it "one of the best short films I've seen in years… Very soon, we'll stop calling it 'AI film' and just call it film" (13.4M views on the post, per the repo). The creator later published his method; a Claude Code skill distils it — [jnMetaCode/ai-shortfilm-prompts README](https://github.com/jnMetaCode/ai-shortfilm-prompts).

  Key rules from the skill [community distillation of the creator's own materials]:
  - **5-stage prompt:** ① core theme (3–6 tags separated by `|`), ② character & scene, ③ atmosphere & quality, ④ camera rules, ⑤ storyboard (per-second or per-shot).
  - "Specify real camera + lens models", e.g. "simulated IMAX film camera, Panavision C-series lens, 35mm focal, f/4 aperture".
  - A "breathing" line: "Handheld shot. Throughout, maintain an extremely subtle, breath-like camera float". Both qualifiers matter, "otherwise the AI interprets it as heavy shaking".
  - Always "Sound: No score. Production audio only." Otherwise "the AI will fabricate music."
  - **At least two imperfections** per character or prop ("paint worn off", "minor facial blemishes preserved"). "Too perfect = fake."
  - "Leave the ending empty": "No dialogue. No explosion. No blinding light."
  - "Don't make single-shots > 15s or multi-shots > 8 shots — reroll success rate collapses."
  - "Don't mix atmosphere blocks across different color tones — color drift wrecks multi-shot edits."

  Sources: [SKILL.md](https://github.com/jnMetaCode/ai-shortfilm-prompts/blob/main/skills/shortfilm-prompt/SKILL.md); [README](https://github.com/jnMetaCode/ai-shortfilm-prompts).
- **Mx-Shell's production numbers and habits** [self-reported, via the repo FAQ]:
  - 10 days and ~20,000 RMB for a 3-minute film
  - "~400 generated images + 200+ video shots to produce the final ~40 clips"
  - rerolls per shot: "High: 20+ tries, Low: 2–3 tries"; "Reroll selection matters more than prompt polish"
  - generation lengths: opening/transformation 15 s, general shots 5–10 s, brief actions 4–5 s
  - editor: CapCut
  - music: licensed from Artlist, not generated; "My whole film has exactly one voice line"
  - clips are joined "by **motion direction continuity**" (a character exits frame left and enters the next shot from the same side)
  - "Shoot two test scenes first, then plan as you go"
  - learn editing: "Trim a piece here, add a transition there… Saves money on rerolls"

  Source: [jnMetaCode faq.md](https://github.com/jnMetaCode/ai-shortfilm-prompts/blob/main/faq.md).
- **Higgsfield "Hell Grind"**, a 90-minute AI feature made by Higgsfield's team for a 2026 Cannes premiere [community transcription of Higgsfield's "Road to Cannes" videos and open-source brief]:
  - **scale:** 14 days, a 15-person team, **108,859 generations**, 9,540,047 credits, ~$400k generation cost and ~$500k total
  - **acceptance rates:** "roughly 1.0%" for images and "roughly 1.5%" for video (e.g. 253 videos used of 16,181 generated on a prior 22-minute project)
  - **character cost:** the lead character needed ~800 iterations before any narrative shot
  - **shot cost:** one 10 s establishing shot needed 72 generations
  - **schedule:** a quota of ~2.5 finished minutes per person per day. Week 1 was a rough full assembly; week 2 refined the scenes that carry emotional weight.

  Source: [OSideMedia production-benchmarks.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/production-benchmarks.md).

  An independent community cross-check measured "13,626 generations for one ~2–3-minute short… roughly **65–100 generations per kept shot**" — [same](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/production-benchmarks.md).
- **Hell Grind's five rules** [community transcription]:
  1. "**Assets first.** Do not generate a single shot until every character, location, and prop is locked and stress-tested."
  2. "**Describe everything, every time.** The model has no memory… word for word, never shortened."
  3. "**Change one thing at a time**… One line per iteration, everything into the log."
  4. "**Give the model less freedom.** A corner instead of a room, an anchor instead of an open space… one action per shot."
  5. "**If a shot will not come together — simplify the shot, not the words.**" The "ten-to-fifteen rule": if 10–15 iterations have not converged, "the problem is not the wording".

  Source: [OSideMedia HELL-GRIND.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance/HELL-GRIND.md).
- **Hell Grind scene craft** [community transcription]:
  - **"The first second is always a wide":** one second with no lines and no action, so the model "photographs" who stands where. Without it, "characters start swapping places."
  - **Hard action goes first:** open the prompt with the action already in progress ("he is ALREADY mid-swing").
  - **Transitions between two spaces** use a threshold with a light contrast ("a warm amber room, a cold blue corridor beyond the arch").

  Source: [same](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance/HELL-GRIND.md).
- **Split by job, not only by length.** A fight and its acting in one prompt meant "the fight gets softer, the faces get flatter"; split them into two prompts and stitch. A carnival scene that fit in 30 s was still split into 3 × 15 s because "these beats felt completely rushed." "**A perfect 30s render does not exist.** Generate raw footage per job, then assemble… background from one take and the foreground action from another" [community transcription of a Higgsfield tutorial, Aug 2026] — [OSideMedia Seedance 2.5 SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md)
- **Curious Refuge** judges AI shorts on "storytelling, character consistency, pacing, cinematography and overall production value". Its competitions require royalty-free (Epidemic Sound) music and SFX — [Hollywood.AI on Curious Refuge competitions](https://hollywood.ai/awards/curious-refuge-competitions); [Curious Refuge 2026 contest rules](https://curiousrefuge.com/2026-ai-feel-good-film-contest-rules) (search summary). Its 2026 tutorials cover Aleph 2.0 editing, Luma Ray 3.2 and lip-sync tools — [Curious Refuge tutorials](https://curiousrefuge.com/ai-tutorials).
- **Runway's 2026 AI Festival** (Lincoln Center, winners announced ~26 Jun 2026) added advertising, gaming, design and fashion categories. First prize is $15k, category winners $10k — [Deadline, Jan 2026](https://deadline.com/2026/01/runway-ai-festival-adding-new-categories-1236700233/); [Runway on X](https://x.com/runwayml/status/2070591928953925793). No winner workflows were retrievable (see Gaps).

**Direction method (agent-oriented skill doctrine)**
- **Emily2040's Seedance Skill OS (v6.7.0):**
  - "reads each scene's dramatic function, sets one directorial voice, and makes camera, light, blocking, performance, and sound serve a single intention instead of a generic 'cinematic' look"
  - a retake protocol with six verdicts: **Keep / Fix in post / Edit / Re-roll / Rewrite / Stop**
  - "Prefer changing one relevant variable"
  - a take-log line: `Take N · failed criterion and evidence · kept strengths · hypothesis · proposed change · preserved settings · remaining authorized limits · verdict`
  - never "default to five Standard takes or ten Fast drafts" without authorization

  Sources: [README](https://github.com/Emily2040/seedance-2.0); [retake-protocol.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/retake-protocol.md).
- **Fidelity budget (Emily2040):** "Identity fidelity, motion boldness, and scene density compete for the same generation budget." Name one primary spend per shot and offload identity to references.
  - "Bold motion and a close-up face → choose one."
  - "Readable on-screen text → move text to post."
  - "Re-anchor across a series… respend on identity (original references, not outputs) every few clips."

  Source: [allocation-model.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/allocation-model.md).
- **Systematic vs stochastic misses (community):** "At a ~1.5% video / ~1% image acceptance bar, most misses are variance, not a broken prompt."
  - If every take fails the *same* way, rewrite the prompt, one variable at a time.
  - If they fail in *varied* ways, lock the prompt and "fire a batch, and cull". Hard-gate on invariants (identity, wardrobe, cut count), then score what was failing.
  - "The four-batch rule": the same defect in all four batches means "the fault is the prompt or the source."

  Sources: [OSideMedia higgsfield-prompt SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-prompt/SKILL.md); [VFX-PIPELINE.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/VFX-PIPELINE.md).
- **Common planning mistakes:** "vague objectives, ask text to carry information that a reference image could provide, stack incompatible camera directions, or try to generate an entire sequence before testing its hardest shot" — [media.io](https://www.media.io/creative-tips/ai-video-mistakes.html) (from earlier notes)

**Storyboard-first tools**
- **3×3 "contact sheet" grids** in Nano Banana Pro, popular since Dec 2025: nine shot types of the same subject (wide/full, medium, MCU, ECU, low and high angle) with "identical subject, lighting, clothing, and background". Each panel is then cropped and used as an image-to-video start frame — [Dmytro Olefyrenko on X, 11 Dec 2025](https://x.com/dimoff2000/status/1999046987703099597); [Metalabs guide](https://learn.metalabs.global/p/how-to-create-cinematic-grids-with-nano-banana-pro) (search summary).
- Seedance 2.5 notes: "Independent keyframe images align far more reliably than several frames combined into one grid"; storyboards should say "which structure to inherit, not literal panel reproduction" [community transcription] — [OSideMedia](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md). *So crop grid panels into separate images before using them as references.*
- "Without a solid storyboard, subsequent video generation is just shooting in the dark" — [APIYI](https://help.apiyi.com/en/nano-banana-pro-ai-video-storyboard-character-consistency-guide-en.html) (reseller blog; from earlier notes). Compare Mx-Shell's "two test scenes first", above.

**Multi-shot vs single shots**
- Multi-shot planning heuristic (Emily2040):
  - "Roughly 4–6 seconds per shot can help plan a deliberate action/reaction beat."
  - "Name the cut and make the second composition distinct."
  - "State the completed endpoint before the cut."
  - If exact frame timing matters: "Plan separate clips and edit them in post."
  - A continuous score across separately generated clips needs audio assembly in post.

  Source: [multishot-grammar.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/multishot-grammar.md).
- **Community "engine rules"** (Seedance house doctrine, not official):
  - "≤ 3 characters tracked across cuts"
  - "Exit-frame = implicit cut", so never choreograph exit and re-entry in one shot
  - "Avoid reflection shots"
  - "Only describe what can be seen or heard"
  - "Double-contrast cut": every cut changes both shot size and camera character

  Source: [OSideMedia ENGINE-RULES.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance/ENGINE-RULES.md).
- **"1 primary action per clip, with 1–2 secondary actions max."** Fast-motion trick: "generate the scene in Slow Mo first, then speed it up in post", because "The model renders cleaner physics in slow motion" (community heuristic) — [OSideMedia higgsfield-prompt SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-prompt/SKILL.md)

**Pacing and edit rhythm**
- "Many modern films have an average shot length of 4-6 seconds", which sets the neutral pace; editors control rhythm by deviating from it — [StudioBinder](https://www.studiobinder.com/blog/how-does-an-editor-control-the-rhythm-of-a-film/) (search summary)
- For AI specifically (search summary; source among results uncertain):
  - batch-generate "a library of two to four second cutaways" (details, reactions, environment) to tighten or loosen a sequence "without additional generation"
  - "J-cuts and L-cuts… disguise the rapid cutting AI content requires"
  - "Comedy, scares, and reveals usually live in the cut, not the camera move"

  Sources: [Medium: Optimal shot length for AI-generated motion](https://medium.com/@info_13818/optimal-shot-length-for-ai-generated-motion-based-on-viewer-retention-a7d86e8c8969); [invideo long take vs cutting](https://invideo.io/faq/how-do-you-decide-between-a-long-take-and-cutting-in/).
- **Audio as a clock (Seedance field practice):** "cut on the beat of @Audio1; the turn lands on the drop" — [Emily2040 capability-map.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/capability-map.md)
- **Seedance continuations must start from accepted footage.** "A continuation must be based on accepted generated footage because Seedance may not end exactly where the original prompt expected." Generate clip 1, return its final frame, then write clip 2 "from the real ending" — [Emily2040 README](https://github.com/Emily2040/seedance-2.0)

**Sound design**
- Suppress model music and add licensed music in post:
  - Mx-Shell: "No score. Production audio only"; music from Artlist — [jnMetaCode](https://github.com/jnMetaCode/ai-shortfilm-prompts/blob/main/faq.md)
  - PJ Ace: don't describe background music — [The Media Brain](https://themediabrain.substack.com/p/ais-disruption-of-advertising-and)
  - Seedance: "audio is not continuous across separate calls, so score in post" — [capability-map.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/capability-map.md)
- **Voice is a locked descriptor:** "register, tempo, accent, manner… pasted into the audio field as-is, every time that character speaks". Stress-test it between generations. "Speech lives in the audio clause only": readable subtext such as `a look that says "you too?"` "comes back spoken" [community transcription] — [HELL-GRIND.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance/HELL-GRIND.md); [OSideMedia 2.5 SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md)
- **Dialogue cap:** "~25–30 spoken words fit in 15 seconds — keep the power-shift line, convert the rest to behavior" (community) — [OSideMedia higgsfield-prompt SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-prompt/SKILL.md)
- **Sound-design tools (search summaries):**
  - ElevenLabs SFX is described as the quality leader for foley
  - "Text-to-audio is better for standalone Foley and ambience, while video-to-audio is better when sound must match on-screen motion"
  - many creators record foley at home and layer AI on top

  Sources: [AI Magicx 2026 SFX guide](https://www.aimagicx.com/blog/ai-sound-effects-generation-foley-guide-2026); [Dobidy](https://dobidy.com/blog/video-to-audio-ai-sound-design); [Envato](https://elements.envato.com/learn/how-to-improve-ai-video-audio).

  On Higgsfield: Seed Audio (defaults to 24 kHz; set 48 kHz), Mirelo SFX, and Seedance `--audio` references for lip-sync and soundtrack matching — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) (from earlier notes).

**Grade, grain, unifying clips from different models**
- **Four-pass grade for AI footage** (search summary of invideo guides):
  1. Normalise each clip's white balance and exposure against scopes, "because different models render skin and shadows differently".
  2. Apply a film-emulation LUT.
  3. Add "grain and a touch of blur to break the plasticky AI sharpness".
  4. "Match every clip to one reference still so cuts don't jump."

  Supporting rules:
  - "Film grain unifies clips from different generations and different models under one texture."
  - Grain goes last, "2–3% intensity, or a grain overlay clip at 20–40% opacity in Overlay… or Soft Light."
  - Clips from Seedance, Veo, Kling and Runway "each carry their own white balance bias, contrast curve, and skin rendering", so normalise before stylising.

  Sources: [invideo: best colour grading workflow for AI video](https://invideo.io/faq/what-is-the-best-color-grading-workflow-for-ai-generated/); [invideo: film grain & blur](https://invideo.io/faq/does-adding-film-grain-and-blur-to-ai-generated-video/); [invideo: Resolve grading for AI footage](https://invideo.io/blog/davinci-color-grading-ai/).
- **Limited grading headroom.** Mx-Shell: AI video has "low color bitrate… Push it too far and you get color banding and noise." "Lock your color tone at the image-generation stage, keep all video prompts' 'Color & tone' section consistent, and do only minor transitions in post" — [jnMetaCode faq](https://github.com/jnMetaCode/ai-shortfilm-prompts/blob/main/faq.md). Higgsfield's Seedance 2.x exposes `--bitrate_mode high` — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) (from earlier notes).
- **At generation time:** Cinema Studio Video 3.5 has `color_grading` / `light_scheme` / `camera_style` axes, and there is a `color_grading_lut` utility job — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) (from earlier notes). The community rule is white balance in Kelvin, fixed per scene — [OSideMedia](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance/SKILL.md).

**Frame rate**
- Veo 3.1 generates at 24 fps — [Google AI Studio via search](https://aistudio.google.com/models/veo-3). Seedance 2.0 renders at 24 fps — [SitePoint](https://www.sitepoint.com/seedance-2-0-vs-veo-3-1-which-is-best-for-ai-video-creators/) (from earlier notes).
- Kling 3.0 claims conflict: 24/30 fps with "some modes supporting higher", or "30fps to 60fps" — [Kling FPS guide](https://kling.ai/blog/fps-motion-intensity-ai-video-quality); [Digital Applied](https://www.digitalapplied.com/blog/kling-3-4k-60fps-ai-video-generation-guide) (search summary).
- No Higgsfield model exposes an fps parameter — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md) (from earlier notes).
- **Hidden frame-rate drop (field-reported):** Seedance "does not always honor a requested frame rate… pads the timeline with repeated frames" (actual 12–18 fps).
  - Counter 1: state "The video runs at 24 fps. No frame is repeated."
  - Counter 2: for B-roll, de-duplicate frames and re-interpolate. Regenerate hero shots.

  Source: [OSideMedia FAILURE-MODES.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance/FAILURE-MODES.md).

**Upscaling**
- **Order:** "Run the upscale after generation is complete and before your edit". "Feed it your cleanest generation rather than expecting it to rescue a broken shot". Follow Starlight with a grain pass, because "grain softens the digital edges that Starlight's clean output can accentuate". Enhance selected shots only (search summary) — [invideo on Topaz Starlight 2.5](https://invideo.io/faq/what-is-topaz-starlight-25-and-why-is-it-used-for-ai/); [Filmora review](https://filmora.wondershare.com/video-editor-review/topaz-video-enhancer-ai.html).

  *Earlier notes instead inferred* upscaling after the edit is locked, to save cost — [end_to_end_pipeline.md sources](https://blog.buildfastwithai.com/topaz-astra-2-ai-video-upscaler-prompt-controls).
- **Starlight Precise 2.5** targets "plastic or artificial artifacts" in faces, fabric and text. **Astra 2** is "explicitly not for photoreal fidelity work". Higgsfield's Topaz **Rhea** and ByteDance Upscale interpolate to 60 fps; **Thea** keeps the frame rate — [Z.Tools](https://z.tools/blog/topaz-labs-starlight-2-5-upscale); [BuildFastWithAI](https://blog.buildfastwithai.com/topaz-astra-2-ai-video-upscaler-prompt-controls); [V. Cherner on X, Aug 2025](https://x.com/vladimircherner/status/1952837194172809250) (older; from earlier notes).

### Inferences
- **Production rules an agent can follow** (synthesis):
  1. **Pre-production gate.** No video until a one-line logline, a beat list, a shot list and locked asset sheets exist. Test the hardest shot first. Each shot gets a "shot contract": purpose, one action with endpoint, one camera move, lens or FOV, light (with Kelvin), sound decision, locks.
  2. **Budget realism.** Plan about 5–20 generations per kept shot for simple ads, and more for complex narrative. Hell Grind ran ~65–100 per kept shot, Mx-Shell 2–20+. Keep a take log. After 10–15 failed iterations, restructure the shot (split it, remove an action, change the angle) instead of rewording.
  3. **Classify every miss:** systematic → rewrite one variable; stochastic → batch the locked prompt and cull against the invariants.
  4. **Keep clip lengths short:**
     - single shots of 4–10 s by default, ≤15 s per generation for complex action
     - 30 s Seedance 2.5 generations only for staged, simple continuity
     - never put physics and performance in the same generation
  5. **Audio policy:**
     - diegetic sound only in generation (`NO BGM` / "No score. Production audio only.")
     - dialogue short and tagged by speaker
     - music, VO and final mix in post; assemble with J/L cuts
  6. **Edit policy.** Cut on action or beat. Average ~2–6 s per shot for social, longer for mood. Keep a 2–4 s cutaway library. Link shots by motion direction and eyelines.
  7. **Finishing policy:**
     1. Conform everything to one timeline rate (24p for cinematic work; 25p if German TV/PAL is the target) and check every clip for duplicate frames.
     2. Upscale only the selects, with Starlight-type models for photoreal and Astra-type for stylized.
     3. Normalise each clip, then apply one LUT or grade, then grain last.
     4. Avoid 60 fps interpolating upscalers unless you plan slow motion.
- **Why so much re-generation.** The 1–1.5% acceptance anchors describe feature-film quality with narrative continuity. Social ads with fewer constraints will likely accept far more takes. There is no published data for that segment (see Gaps).

### Gaps
- No verified 2026 statement from PJ Ace himself on his current model stack (Seedance vs Kling vs Veo). His newsletter and X were blocked. The quoted tips come from merged search summaries and may date from 2025.
- No workflows from 2026 AI Film Festival winners (Runway AIF, Reply AI Film Festival, Curious Refuge competitions) could be retrieved.
- The Hell Grind numbers come from a community transcription of Higgsfield's videos, not from a Higgsfield document.
- No 2026 study was found on how shot length affects retention in AI video. The "4–6 s" baseline comes from general film editing.
- No hands-on comparison was found of upscaling before vs after the edit on Higgsfield output.

## Q3 — Keeping characters, products and locations consistent across shots (Soul ID, Nano Banana Pro reference sheets, Kling Elements, Seedance references) — what works best in 2026

### Takeaway
In 2026, consistency is carried by **reference assets**, not by prompt text. Every source agrees on the same steps:
1. build a clean **asset pair per entity**: a verbatim text descriptor plus a reference image or sheet;
2. **bind the assets explicitly** in every prompt (Soul ID `reference_id`, Kling `@element`/`<<<element_n>>>`, Seedance `@Image n defines … Do not use …`, Veo "ingredients" ≤3);
3. **re-anchor to the original references**, not to generated outputs, every few clips;
4. **lock the environment and the light** as hard as the face.

The recurring failures:
- the model inventing extra set pieces
- character-sheet backdrops leaking into the scene
- faces taken from tiny full-body panels
- props in hands drifting between angles
- identity text mixed with motion text

### Cited Findings
- **Asset = text + image; describe everything every time** [community transcription of Higgsfield's Hell Grind brief]:
  - "An asset is a pair: text + image. The text… is pasted verbatim into every prompt."
  - Character sheet = **3 images**: face close-up, full-body front "**headless**", full-body back. "On wide shots the model kept sourcing the face from the small full-body figure… Remove that head."
  - "**Keep the sheet deliberately boring.** Neutral grey background, flat light, real skin with visible pores, no retouch."
  - A sheet shot as a large 3/4 portrait reads best.
  - Costume changes, scars and blood are masked onto the original. "**An image never runs through a model twice in full**… After two passes the face turns symmetrical, plastic, and lifeless."

  Source: [HELL-GRIND.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance/HELL-GRIND.md).
- **Locations** [same source]:
  - "Shoot the location sheet in 3/4, not frontal" (a frontal shot "becomes flat wallpaper").
  - "Leave an anchor in every location — a column, a lamp… 'The character at the lamp, facing the door' works. 'The character in the room' is a lottery."
  - "Keep one light logic: one source, one direction of shadows."
  - Reverse angles: generate a video of the empty location with the camera walking through it, screenshot the needed angle, then refine it in Seedream or Nano Banana Pro.

  Source: [same](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance/HELL-GRIND.md).
- **Environment invention is "the #1 drift source, above character drift".** Standing lock: "the set contains only what the reference shows — no added furniture, rooms, or geography beyond the reference". Also write real heights ("she is 165 cm, he is 178 cm") so characters don't drift toward equal height [field, 13-project harvest] — [OSideMedia higgsfield-seedance SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance/SKILL.md)
- **Seedance 2.5 reference discipline** [community transcription of Dreamina and a Higgsfield deck]:
  - **Fidelity grade per material:** full-preserve / partial-preserve / attribute-transfer (the target must be named) / loose-guide.
  - "Never place a reference handle in a shot where that subject is absent." The model forces it into frame.
  - "Spend one view on a strong expression, not four resting faces." A set of neutral views "teaches the model the face at rest… so the first line of dialogue invents a mouth". Canonical four: front, back, neutral face detail, "facial dynamics and teeth under strong emotion".
  - More than five subjects needing multiple views → "one view per image"; a collage is "the less stable form".

  Source: [OSideMedia 2.5 SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md).
- **Soul ID (Higgsfield):**
  - Official: train from "5–20 face photos with varied angles and lighting", paid plan (Basic+); the output `reference_id` feeds Soul 2.0/Soul Cinema — [higgsfield-soul-id SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-soul-id/SKILL.md) (from earlier notes). The blog says "20+ photos" — [Higgsfield blog](https://higgsfield.ai/blog/how-to-create-ai-influencer).
  - Community rules:
    - split every Soul ID prompt into an **Identity Block** (static descriptors only) and a **Motion Block** (camera/temporal only); "Don't re-describe the face or core features"
    - reference photos should be "front or 3/4 angle, even lighting, neutral-to-slight expression, no blur, solo subject"
    - "Two-image floor per character: one clear face + one full body, on neutral grey"
    - prefer "the single-prompt 3×2 six-panel sheet"
    - crowds: a single-character reference "makes a clone army"; declare a multi-character "VARIETY reference"
    - one sheet per character state
    - "Skip Soul ID for single shots or when you want maximum creative variation"

    Source: [OSideMedia higgsfield-soul SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-soul/SKILL.md).
- **Nano Banana Pro sheets** (search summaries):
  - Nano Banana Pro "holds multi-angle character fidelity better than Nano Banana 2" — [invideo](https://invideo.io/faq/nano-banana-2-vs-nano-banana-pro-which-should-you-use/) (from earlier notes).
  - Recommended recipe: a photoreal portrait (e.g. Recraft V4), then a Nano Banana Pro 4K sheet — "front, 3/4, side, and back, plus a face close-up and a mid-angle shot — 6 panels total on a clean neutral background… consistent lighting".
  - "Strip any object from the character's hands before generating — props in hand cause angle-to-angle drift."
  - "Generate 4 versions of the sheet and select the strongest."
  - Nano Banana Pro takes "up to 14 reference images".

  Sources: [invideo character-sheet FAQ](https://invideo.io/faq/how-do-you-create-a-character-reference-sheet-using-nano/); [Sider NBP cheat sheet](https://sider.ai/blog/ai-image/nano-banana-pro-cheat-sheet-for-character-consistency).

  Higgsfield's own agent skill names Nano Banana 2/Lite/Pro as the "default for character, cartoon, stylized, and reference-driven image work" — [higgsfield-generate SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md).
- **One image model per asset class** (community VFX build, Aug 2026): faces and fixes → Nano Banana 2; creatures → Seedream 5.0; clothing → GPT Image 2; locations → Soul Cinema. "Run the same sheet prompt through 2–3 image models and compare before locking" — [OSideMedia VFX-PIPELINE.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/VFX-PIPELINE.md); [soul SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-soul/SKILL.md)
- **German practitioner view:** "Der größte Anfängerfehler ist, direkt einen Videoprompt zu schreiben… zuerst ein Charakter- und Prop-Sheet… Ohne dieses Sheet driftet die KI nach drei, vier Clips garantiert ab" (search summary) — [all-ai.de tutorial](https://www.all-ai.de/tutorials/tutorials-ki/ki-video-erstellen-tutorial-higgsfield) (attribution among the German results not verified)
- **Kling 3.0:**
  - Elements in multi-shot, per-shot @elements — [Kling guide](https://kling.ai/quickstart/klingai-video-3-model-user-guide)
  - voice binding — [Kling subject binding](https://kling.ai/blog/kling-3-subject-binding-character-consistency)
  - "The single biggest fix from community testing is 'locking your prompt,' reusing identical descriptive keywords every shot. Upload 2-4 reference images that show the character from different angles" — [Atlas Cloud](https://www.atlascloud.ai/blog/guides/how-to-use-kling-3.0-for-character-consistency) (search summary)
  - Curious Refuge: "character cloning often drifted in facial likeness" — [review](https://curiousrefuge.com/blog/kling-30-review)
- **Veo 3.1:** "ingredients to video" keeps a "consistent aesthetic across multiple shots". Google's workflow creates the character and setting references with Gemini's image model first — [Google Cloud](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1). Limit: 1–3 reference images — [search summary](https://aistudio.google.com/models/veo-3).
- **Products:**
  - First/last-frame pinning keeps product identity: "each still pinned as the first and last frame so the model invents motion without losing product identity" — [OpenMontage](https://github.com/calesthio/OpenMontage) (from earlier notes).
  - Product identity is the primary spend in product ads; economise on crowds and weather — [allocation-model.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/allocation-model.md).
  - Logos warp and colours shift blue at the image stage; fix them before the sheet is referenced by "forty downstream shots" — [VFX-PIPELINE.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/VFX-PIPELINE.md).
- **Chains drift.** "Original references preserve identity; an approved output frame can preserve current pose and state. Use each for its own role" — [Emily2040 model-mechanics.md](https://github.com/Emily2040/seedance-2.0/blob/main/references/model-mechanics.md).
- **References can hurt.** Filtered or low-quality references "leak" style: "Don't attach a reference unless it is genuinely photoreal or a high-quality 3D render. For motion shots, omit references entirely… Reserve references for character/scene continuity only". Use "un-filtered headshots — ideally bare-face" — [jnMetaCode cases.md](https://github.com/jnMetaCode/ai-shortfilm-prompts/blob/main/cases.md)
- **Real people:** Seedance blocks real faces in references — [AIVidPipeline](https://aividpipeline.com/blog/seedance-real-human-face-rules-2026). A community workaround for an *authorised* real person is a "hybrid sheet": erase the heads on the body panels and paste the person's actual photo into the portrait panel — [OSideMedia soul SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-soul/SKILL.md).

### Inferences
- **Consistency protocol an agent can run** (synthesis):
  1. For every character, product and location, create `asset.md`: the verbatim descriptor (plus voice and behaviour for characters) and the reference file paths with roles.
  2. Build the sheets:
     - **character:** face close-up, headless full-body front, back view, plus one strong-expression view; neutral grey, flat light, pores visible; no props in hands; generate about 4 variants and pick one
     - **location:** 3/4 view, at least one fixed anchor object, one light direction with a Kelvin value
     - **product:** clean packshot plus first/last-frame stills
  3. In every prompt, paste the descriptors verbatim and bind each reference with a role and an exclusion ("Do not take the grey backdrop / panel layout"). Add the environment lock and heights.
  4. Continue from each accepted clip's real last frame. Re-anchor to the original sheets every 3–4 clips.
  5. Keep text, logos and UI out of generation; composite them in post.
- **Model choice for consistency.** Seedance 2.5 for many-reference scenes (≤8 subjects; clips ≤30 s; no real faces). Kling 3.0 Elements for multi-shot character or product sequences up to 15 s, expecting colour and likeness drift between cuts. Veo 3.1 ingredients (≤3) for dialogue close-ups. Soul ID when one recurring human identity has to survive across Higgsfield's image and video tools.

### Gaps
- No controlled 2026 benchmark compares identity retention across Soul ID, Kling Elements, Seedance 2.5 references and Veo ingredients.
- Whether Soul ID `reference_id` carries directly into Seedance 2.5 or Kling 3.0 on Higgsfield, or only into Soul/Cinema models, is not documented in the official CLI skills that were read.
- Official Kling documentation on element limits per generation could not be read.

## Q4 — What makes AI video look cheap ("AI slop" tells), how professionals avoid it, the most common mistakes, and how audiences and clients react

### Takeaway
Viewers spot AI through:
- **flat lighting**
- **over-saturation**
- **floaty, too-smooth camera**
- **plastic skin and dead eyes**
- **bad hands, gliding walks and fake physics**
- **lip-sync misses on p/b/m**
- **warped logos and text**
- **random music and subtitles**
- **FX-pile-up endings**
- **inconsistent characters and grades between cuts**

Professionals counter at three points:
- **Upstream:**
  - good light in the source still
  - named, measurable cinematography instead of praise words
  - deliberate imperfection
  - a subtle handheld float
  - physical descriptions of motion
- **In direction:** one job per shot; restrained endings.
- **In post:** one grade, grain, a real sound mix, and text in post.

Audience risk is real and measurable in 2026. About three-quarters of Gen Z react negatively when they notice AI marketing. Ad executives overestimate consumer acceptance by roughly 37 points. McDonald's Netherlands pulled a fully AI Christmas ad within three days (Dec 2025). YouTube demonetises "inauthentic", mass-produced AI content. The winning strategy is craft and human direction, with disclosure where required, not volume.

### Cited Findings

**Visual and audio tells**
- **OpusClip "12 tells"** (search summaries; page blocked):
  - "Flat lighting, over-saturation, and smooth motion are defaults the models produce when not actively styled."
  - "grass that's too green, skin tones that lean orange… AI models default to over-saturation several notches above where a real colorist would land"
  - "Real camera footage has micro-jitter… AI video is often too smooth, with the camera drifting through space with a floatiness"
  - Plastic skin: models "smooth skin texture and over-sharpen edges."
  - Avatars' mouth shapes miss "bilabial consonants like p, b, m."
  - "Fingers merge and extra digits appear."
  - Tools that "actively deprioritize hand-heavy shots produce output that avoids most of the tells."

  Sources: [OpusClip: AI Slop — 12 tells](https://www.opus.pro/blog/ai-slop-aesthetic-12-tells); [invideo: why AI video looks plasticky](https://invideo.io/faq/why-do-ai-generated-videos-look-plasticky-and-fake-and/).
- **Community "slop catalog"** (AI-VFX build, 8 Aug 2026):
  - "**'Make it more natural' does nothing**": write "a physical picture of the movement".
  - "The CG-double fall": a person falling in "a stiff soldier pose, descending at one constant speed, with nothing moving in the clothes." Write acceleration and moving clothing.
  - "The origami wing" (low-poly facets).
  - "**Bad light in the still is why video generations come out as slop**… the video model is matching the reference, not the paragraph."
  - Warped logos and blue-ish colour shifts at the image stage.

  Source: [OSideMedia VFX-PIPELINE.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/VFX-PIPELINE.md).
- **"Walking is the hardest stunt":** figures "glide with no weight transfer, both feet are airborne at once, or the same foot steps twice". Counter with physics: "heel lands first, strict left-right alternation, one foot always on the ground" [field, Higgsfield Studio breakdown, 19 Aug 2026] — [OSideMedia FAILURE-MODES.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance/FAILURE-MODES.md)
- **Skin and eyes:** in the Dreamina seven-slot character block, skin with "visible micro-pores, translucency, capillary flush… is the single slot that most separates 'photo of a person' from 'AI render'". "Dead eyes are the number-one tell" [community transcription] — [OSideMedia 2.5 SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md)
- **Perfection and FX endings:** "Too perfect = fake"; the "ending is an FX pile-up and reads cheap", so "end quietly". "Vague praise — epic / stunning / 4K / movie-quality — gives the model nothing concrete… You get generic game-CG output" — [jnMetaCode README](https://github.com/jnMetaCode/ai-shortfilm-prompts); [cases.md](https://github.com/jnMetaCode/ai-shortfilm-prompts/blob/main/cases.md)
- **"Slop words"** such as beautiful, stunning, epic, amazing, dynamic, "cinematic camera movement", "cool transition" and "4K look" should be replaced with named referents or physics ("tires spin, gravel sprays backward, chassis drops") (community) — [OSideMedia higgsfield-prompt SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-prompt/SKILL.md)
- **Audio tells:** unrequested background music and burned-in subtitles (Veo; Seedance 2.0) — [Yapper](https://yapper.so/articles/remove-veo3-subtitles); [OSideMedia 2.5 SKILL.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance-2-5/SKILL.md). Also filler babble on short dialogue lines — [FAILURE-MODES.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance/FAILURE-MODES.md).
- **Continuity tells:** Kling's grade shifts between cuts — [Curious Refuge](https://curiousrefuge.com/blog/kling-30-review). Characters swap positions without an opening wide — [HELL-GRIND.md](https://github.com/OSideMedia/higgsfield-ai-prompt-skill/blob/main/skills/higgsfield-seedance/HELL-GRIND.md). Colour drift when atmosphere blocks differ between shots — [jnMetaCode SKILL.md](https://github.com/jnMetaCode/ai-shortfilm-prompts/blob/main/skills/shortfilm-prompt/SKILL.md).

**Pro countermeasures (post)**
- Grain plus "a touch of blur to break the plasticky AI sharpness", and a grade matched to one reference still — [invideo](https://invideo.io/faq/what-is-the-best-color-grading-workflow-for-ai-generated/); [invideo plasticky-skin fix](https://invideo.io/faq/how-do-you-fix-plasticky-or-waxy-looking-skin-in-ai/) (search summaries). Use a Starlight-type upscaler for "plastic" faces, not Astra — [Z.Tools](https://z.tools/blog/topaz-labs-starlight-2-5-upscale) (from earlier notes).
- **Human process:** "Start with a clear, human-led brief that defines the story, audience, and emotion. Let AI expand your options, but make all the final calls… AI can fake lighting, framing, even emotion, but it can't generate lived experience" — [Artlist: What is AI slop](https://artlist.io/blog/what-is-ai-slop-and-why-it-matters-for-video-creators/) (search summary)

**Audience and client reactions**
- **Rival Technologies study (PR Newswire; exact date not seen, but the release ID suggests about mid-Aug 2026):**
  - "72% of Gen Z consumers have taken direct action against a brand after encountering AI-generated marketing", ranging from unfollowing to abandoning a purchase
  - "74%… react negatively when they realize a brand's marketing was made with AI, with half describing that reaction as very negative, while just 8% react positively"

  Source: [PR Newswire: The AI Backlash](https://www.prnewswire.com/news-releases/the-ai-backlash-nearly-three-in-four-gen-z-have-punished-a-brand-over-ai-marketing-new-rival-technologies-study-shows-302850590.html) (search summary; vendor-commissioned study).
- **IAB perception gap:** "82% of ad executives believe Gen Z/Millennial consumers feel very or somewhat positive about AI-generated ads, nearly double the 45% of consumers who actually feel that way". The gap widened "from 32 points in 2024 to 37 points in 2026" — [IAB: The AI Ad Gap Widens](https://www.iab.com/insights/the-ai-gap-widens/) (search summary).
- **Related findings from the same results** (attribution to a specific report not verified):
  - "Nearly 1 in 5 consumers see low-quality or generic AI content from brands weekly, and 32% say it makes them trust brands less."
  - Consumers respond positively to AI "when its deployment is perceived as benevolent and consumer-oriented, and negatively when it is perceived as commercially motivated".

  Sources: [IAB](https://www.iab.com/insights/the-ai-gap-widens/); [ScienceDirect 2026: When AI ads backfire](https://www.sciencedirect.com/science/article/pii/S0969698926003395).
- **McDonald's Netherlands (older, Dec 2025):**
  - a 45-second, fully AI-generated Christmas spot aired 6 Dec 2025 and was pulled on 9 Dec after X users called it "unsettling," "creepy," "poorly edited" and "inauthentic"
  - it was "produced within weeks instead of the usual months"
  - McDonald's called it "an important learning" on "the effective use of AI"

  Sources: [NBC News](https://www.nbcnews.com/world/europe/mcdonalds-ai-generated-christmas-advert-social-media-backlash-rcna248590); [Deseret News](https://www.deseret.com/business/2025/12/15/mcdonalds-faced-backlash-for-ai-advert/); [TechRadar](https://www.techradar.com/ai-platforms-assistants/mcdonalds-pulls-ai-generated-christmas-ad-after-backlash-over-soulless-visuals-and-holiday-chaos); [eMarketer lessons](https://www.emarketer.com/content/mcdonald-s-pulled-ai-ad-offers-lessons-on-what-audiences-will-won-t-accept).
- **Coca-Cola (older, 2024/2025):** after the 2024 backlash, Coca-Cola returned for Christmas 2025 with an AI-assisted ad, "accompanied by a documentary talking about the humans involved". Its generative-AI lead said "this year the craftsmanship is ten times better" — [afaqs](https://www.afaqs.com/news/advertising/after-coca-cola-mcdonalds-faces-backlash-withdraws-ai-christmas-ad-10921322) (search summary).
- **YouTube (July 2026):**
  - "repetitious content" was renamed "inauthentic content", covering three categories:
    - generic, repetitive or template-based content
    - off-putting or distressing content
    - AI personas discussing sensitive topics
  - photoreal AI or altered content must be disclosed with the "altered or synthetic content" toggle
  - enforcement runs "a warning, then a 90-day monetization suspension, then permanent removal". In January 2026 YouTube "terminated 16 mass-AI channels outright"
  - AI-assisted videos stay monetizable with disclosure and "genuine human creativity"

  Sources: [TechCrunch, 20 Jul 2026](https://techcrunch.com/2026/07/20/youtube-clarifies-policies-around-ai-slop-and-upsetting-videos/); [Tubefilter, 13 Jul 2026](https://www.tubefilter.com/2026/07/13/youtube-inauthentic-content-monetization-policy-update/); [AIR Media-Tech timeline](https://air.io/en/monetization/youtube-monetization-policy-changes-2026-a-complete-dated-timeline).

  A 2026 opinion piece argues the crackdown "Can't Tell a Directed AI Film From a Bot Farm" — [HackerNoon](https://hackernoon.com/youtubes-ai-slop-crackdown-cant-tell-a-directed-ai-film-from-a-bot-farm).
- **Client management (PJ Ace):** write into the contract that the workflow is iterative and the storyboard directional — [The Media Brain](https://themediabrain.substack.com/p/ais-disruption-of-advertising-and) (search summary). For commercial music, use licence-clean sources: Epidemic (required by Curious Refuge competitions), Artlist (Mx-Shell) — [Curious Refuge rules](https://curiousrefuge.com/2026-ai-feel-good-film-contest-rules); [jnMetaCode faq](https://github.com/jnMetaCode/ai-shortfilm-prompts/blob/main/faq.md).

### Inferences
- **The most common mistakes, each paired with an agent rule** (consolidated from the sources above):
  1. **Writing a video prompt before any assets exist.** → Build sheets and descriptors first, and test the hardest shot first.
  2. **Praise words** ("cinematic, epic, 4K, stunning"). → Write named or measurable light, lens/FOV, speed (km/h), Kelvin and physics.
  3. **Several actions or camera moves in one clip; physics and acting mixed.** → One primary action (with at most 1–2 secondary), one move, one job per generation.
  4. **Re-describing the start image in I2V.** → Describe only motion, camera, timing, audio and what must be preserved.
  5. **Unbound or conflicting references; sheet backdrops leaking.** → Give every reference a role and an exclusion, and never reference a subject that is absent from the shot.
  6. **Negations on surfaces without a negative field** ("no camera movement"). → Use positive states ("camera holds completely static"); use the negative field only where it exists (Veo API, Kling's own site).
  7. **Letting the model make music and subtitles.** → `NO BGM` / "No score. Production audio only.", then score in post; keep text out of generation.
  8. **Long dialogue.** → One short tagged line per shot (≤8 s for Veo; ~25–30 words per 15 s for Seedance); keep mouths visible; replace the voice for strict brand work.
  9. **Rewriting the whole prompt after a miss.** → Change one line and log it; batch-and-cull stochastic misses; after 10–15 failures, simplify the shot.
  10. **Approving fine detail from 480p or 720p drafts.** → Approve only structure from drafts and re-check detail at final resolution. Seedance on Higgsfield has no seed, so a re-render is a new take.
  11. **Endless extension chains.** → Re-anchor to the original references. Veo degrades after ~4–5 extensions; Seedance 2.5 chains cap at 60 s.
  12. **Mixed frame rates and grades.** → Conform to one rate, check for duplicate frames, normalise, then apply one LUT and grain.
  13. **Upscaling everything, or with the wrong model.** → Upscale selects only: Starlight for photoreal, Astra for stylized, no 60 fps interpolation for 24p.
  14. **Real faces, celebrities, brands or IP.** → Expect blocks (Seedance real-face block, `ip_detected`). Use authorised or virtual characters and describe the design language instead of naming the IP.
  15. **Publishing "AI for AI's sake".** → Human story, point of view and restraint; disclose where required; avoid template-like mass output (YouTube inauthentic-content policy).
- **For client work:** the evidence suggests the *visible* AI look, not AI use itself, triggers backlash ("poorly edited", "soulless", "inauthentic"). Craft markers (consistent characters, real sound, restrained grading) and a human-authorship story (as in Coca-Cola's 2025 documentary) are the documented mitigations. This is an inference; no controlled study was found.

### Gaps
- The OpusClip "12 tells" page could not be read, so only about seven of the twelve tells are confirmed via snippets.
- No 2026 study isolates audience reaction to *high-craft, disclosed* AI ads versus visibly low-quality ones. The Rival and IAB figures describe AI marketing in general, and Rival is a vendor-commissioned survey.
- No EU/German-specific data was found on consumer reaction to AI ads. Labelling duties for AI-generated or deepfake ad content, such as the EU AI Act transparency rules, were not researched here. Check them separately before any client work in Germany.

## Q5 — Recommended lengths, formats and hooks per platform (Reels, TikTok, YouTube Shorts, YouTube) — brief

### Takeaway
All short-form platforms are 9:16 and reward **completion and rewatch rate** more than length. 2026 sweet spots:
- **TikTok:** ~21–34 s
- **Instagram Reels:** 7–15 s for viral reach, 30–45 s for value content
- **YouTube Shorts:** ~20–35 s

Win the **first 3 seconds** with a visual pattern interrupt, a benefit text overlay and a spoken keyword. Watch the ad "hook rate" (3-second views ÷ impressions); below ~20%, the opening is the bottleneck.

For AI work, this argues for short, dense edits built from 2–6 s shots. Open on the strongest generated image, not on an establishing shot. Test hooks, for example with Higgsfield's Virality Predictor.

### Cited Findings
- **TikTok:**
  - "Most successful TikTok creators still aim for 21 to 34 seconds"
  - 24–38 s is "long enough to tell a complete story (Hook, Value, Payoff)"
  - 30–60 s suits educational content with a strong hook

  **Reels:**
  - "Viral Sweet Spot: 7 to 15 seconds. Value Sweet Spot: 30 to 45 seconds"
  - most-commented videos "hover around 26 seconds"

  **Shorts:**
  - "20-35 seconds is the general sweet spot"
  - before the 3-minute extension, successful Shorts were "frequently 15 seconds or less"

  **All platforms:** "a 12-second video people finish beats a 40-second one they abandon."

  Sources: [Shortimize](https://www.shortimize.com/blog/video-length-sweet-spots-tiktok-reels-shorts); [Joyspace data study 2026](https://joyspace.ai/ideal-video-length-social-platform-2026); [Reap](https://reap.video/blog/best-video-length-youtube-shorts-reels-tiktok); [Sureshot](https://sureshot.video/blog/how-long-is-a-short-form-video) (merged search summary; the individual attributions are uncertain).
- **Hooks:**
  - "Videos with strong hooks (3-second retention above 65%) outperform weak-hook videos by 3-5x on downstream metrics"
  - "63% of the highest click-through videos hook viewers within the first three seconds" (attributed to TikTok for Business)
  - "If your hook rate is below 20%, your opening is the bottleneck"
  - an effective 2026 hook is "multimodal, combining a visual 'pattern interrupt,' a benefit-driven text overlay, and a spoken keyword-rich opening"
  - "Reels placements now account for over 50% of Instagram ad impressions"

  Sources: [Cloudix Digital](https://cloudixdigital.com/short-form-video-mastery-how-the-3-second-hook-rule-drives-social-discovery-and-roi/); [Reloop hook rate](https://reloop.so/blog/article/hook-rate/); [Hansen Insights](https://hansencommerce.com/insights-tiktok-hook-3-seconds); [Adligator](https://adligator.com/blog/short-form-video-ads-facebook-instagram) (search summary; marketing blogs).
- **Higgsfield tools:**
  - **Virality Predictor** (`brain_activity`) analyses "a video's hook / attention / virality potential" and returns scores with a report link
  - **Marketing Studio** has reusable "Hook" blocks; the hook text "is prepended to the user's prompt"
  - **Reframe** creates 9:16 or other ratios from a 16:9 master

  Sources: [higgsfield-ai/skills README](https://github.com/higgsfield-ai/skills); [higgsfield-generate SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md); [cli README](https://github.com/higgsfield-ai/cli) (from earlier notes).
- Curious Refuge's career advice: "Short-form content performs well online so even 5-10 second clips can help boost your profiles" — [Curious Refuge career guide](https://curiousrefuge.com/blog/your-guide-for-building-a-career-in-ai-filmmaking) (search summary)
- **Format specifics:**
  - Veo 3.1 outputs only 16:9 or 9:16 — [Google Cloud](https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-veo-3-1)
  - Kling 3.0 on Higgsfield: 16:9 / 9:16 / 1:1 — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md)
  - Seedance 2.x adds 21:9, 4:3 and 3:4 — [MODELS.md](https://github.com/higgsfield-ai/cli/blob/main/MODELS.md)
  - Seedance 2.5 also 9:21 per a third-party guide — [Anil-matcha](https://github.com/Anil-matcha/awesome-seedance-2.5-api-prompts)

### Inferences
- **Agent defaults for social:**
  - Generate natively in 9:16 when vertical is the main deliverable. Reframing a 16:9 master loses resolution and composition.
  - Put the strongest visual and the claim in the first 1–3 s. Burn captions or text overlays in post, not in generation.
  - Target 15–30 s for TikTok/Shorts ads and 7–15 s for Reels reach.
  - Cut every 1.5–3 s in the hook section and allow longer holds later.
  - End on a loopable frame to encourage rewatches.
  - Score the draft with the Virality Predictor before paying for final renders.
- **Long-form YouTube (16:9)** follows ordinary film pacing: 4–6 s average shots and story structure. Disclosure is mandatory for photoreal synthetic content, and template-like mass output risks demonetisation.

### Gaps
- No platform-official 2026 length guidance was found; all figures come from third-party marketing blogs of uneven rigour.
- Long-form YouTube retention benchmarks for AI films were not researched (search budget).
- No data was found on whether audiences treat AI content differently by platform (TikTok vs YouTube vs Instagram).
