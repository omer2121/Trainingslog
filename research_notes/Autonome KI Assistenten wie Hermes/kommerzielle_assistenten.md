# Commercial / proprietary autonomous AI assistants & agents — state as of October 2026

> **Reading notes for the report writer**
> - Research date: 2026-10-04. Dates in link labels are publication dates (from the URL or the article text). "n.d." = undated page whose content refers to the stated period. "living doc" = help/docs page, accessed 2026-10-04.
> - **[R]** = page opened and read in full. All other pages could **not** be fetched (the egress proxy blocked openai.com, help.openai.com, blog.google, blogs.microsoft.com, apple.com, techcrunch.com, fortune.com, cnbc.com, wikipedia.org, arxiv.org, siliconangle.com, neowin.net, betanews.com, thenextweb.com, trendingtopics.eu, blogs.opera.com, benchlm.ai, hal.cs.princeton.edu and others). Their content comes from search-engine summaries of those pages, cross-checked against other results where possible. Treat exact numbers from non-[R] sources as "reported", not verified.
> - Many 2026 pricing and availability details come from SEO or aggregator blogs (usecarly.com, eesel.ai, mindstudio.ai, digitalapplied.com, therundown.ai, aipricing.guru, layer3labs.io and similar). Some are written by competitors of the product they review: lindy.ai reviews Genspark, and usecarly.com appears to be the blog of a competing assistant product while reviewing Lindy, Poke, Dots and Muse. Claims that rest on a single aggregator are flagged.
> - Neutrality: the same criteria were applied to every vendor. Disclosure: this research was carried out by a Claude (Anthropic) model. Anthropic's claims are treated as vendor claims, like everyone else's.

## Key Question 1: Which commercial autonomous assistants lead as of October 2026, and what changed during 2026?

### Takeaway
The leading products in October 2026 are always-on cloud agents with their own virtual computer and standing goals:
- **OpenAI Dots**: launched 29 Sep 2026, running on GPT-6 Astra.
- **Google Gemini Spark**: announced at I/O in May 2026 and in 160+ countries by July, but not the EEA, UK or Switzerland.
- **Microsoft's new Copilot**: includes **Autopilot** (private preview since end of Sept 2026), alongside Copilot Tasks and Copilot Cowork.
- **xAI Grok Bot**: beta since 11 Aug 2026.
- **Perplexity Computer**: launched Feb 2026.

Anthropic competes with **Claude Cowork** (cloud tasks, scheduled tasks, Dispatch, Chrome) and **Claude Code** (cloud routines and messaging channels) rather than with a single always-on persona.

2026 also brought heavy product churn:
- OpenAI retired the ChatGPT agent (successor of Operator), ChatGPT Pulse and the Atlas browser.
- Google retired Project Mariner.
- China blocked Meta's takeover of Manus, which now operates as an independent company again.

### Cited Findings

#### OpenAI
- **ChatGPT Work** launched on 9 Jul 2026. It is an agent inside ChatGPT that "gathers context across your apps, breaks a goal into steps, and returns finished sheets, slides, docs, and web apps". It is reportedly powered by new GPT-5.6 models and runs on Mac, Windows and the web — [techmymoney, 2026-07-09](https://techmymoney.com/2026/07/09/chatgpt-work-arrives-on-mac-windows-and-the-web-as-openais-do-it-all-agent/); [Digital Applied, 2026-07](https://www.digitalapplied.com/blog/chatgpt-work-openai-agent-launch-2026)
- **ChatGPT agent** (launched Jul 2025, had absorbed Operator) was reportedly removed in early Aug 2026 without advance deprecation notice. The old help article reportedly sends users to ChatGPT Work and to a separate "cloud browser" — [izzedo.chat, n.d. 2026](https://www.izzedo.chat/blog/ai-agent-mode); [usecarly, n.d. 2026](https://www.usecarly.com/blog/chatgpt-agent-mode/)
  - User complaints: [OpenAI Developer Community thread "Agent Mode was removed with no real replacement", 2026](https://community.openai.com/t/agent-mode-was-removed-with-no-real-replacement/1389601)
  - Original product page (outdated): [OpenAI, 2025-07](https://openai.com/index/introducing-chatgpt-agent/)
- **Atlas browser** launched 21 Oct 2025 and only ever shipped for macOS. OpenAI announced the shutdown in July 2026, and the browser was discontinued on 9 Aug 2026, 292 days after launch. Its browser-agent features moved into:
  - the ChatGPT desktop app (multiple tabs, downloads, account-login handling)
  - a ChatGPT Chrome extension
  - Sources: [TechCrunch, 2026-07-09](https://techcrunch.com/2026/07/09/openai-is-shutting-down-atlas-but-its-ai-browser-ambitions-are-still-growing/); [Technology.org, 2026-07-11](https://www.technology.org/2026/07/11/openai-shuts-atlas-chatgpt-chrome-extension/); [The Rundown, n.d.](https://www.therundown.ai/tools/atlas)
- **ChatGPT Pulse** (the 2025 proactive daily feed) was retired. Scheduled Tasks rolled out on 17 Jun 2026 to Plus, Pro, Business and Enterprise, and Pulse was retired within 14 days — [Digit, 2026-06](https://www.digit.in/news/general/openai-is-retiring-chatgpt-pulse-and-replacing-it-with-scheduled-tasks-here-is-why.html); [AI Weekly, 2026-06](https://aiweekly.co/alerts/openai-brings-scheduled-tasks-and-web-monitoring-to-chatgpt); [justinmckelvey.com, n.d. 2026](https://justinmckelvey.com/blog/chatgpt-pulse)
- **GPT-6 Astra** was released on 3 Sep 2026 as OpenAI's new flagship "for long, complex, multi-step work across coding, browser and computer use, professional analysis…" — [OpenAI, 2026-09-03](https://openai.com/index/gpt-6-astra/); [The Decoder, 2026-09](https://the-decoder.com/gpt-6-astra-is-the-first-model-making-openai-willing-to-declare-the-agi-era/)
- **Dots** were announced at DevDay on 29 Sep 2026. They are "always-on" agents with their own cloud computer, powered by GPT-6 Astra, and available from that day (a Tuesday) for Pro and Business Premium users "in eligible markets" — [SiliconANGLE, 2026-09-29](https://siliconangle.com/2026/09/29/openai-launches-dots-always-on-ai-agents-in-chatgpt-with-their-own-cloud-computers/); [Quartz, 2026-09-29](https://qz.com/openai-dots-always-on-ai-agents-chatgpt-092926); [Neowin, 2026-09](https://www.neowin.net/news/openai-announces-dots-a-new-type-of-always-on-ai-agent-for-chatgpt-users/); [AI Weekly, 2026-09](https://aiweekly.co/alerts/openai-unveils-dots-always-on-chatgpt-agents-at-devday)
- Model naming is inconsistent across sources:
  - Astra's predecessor is called "GPT-5.6 Sol" in some sources — [The Decoder](https://the-decoder.com/gpt-6-astra-is-the-first-model-making-openai-willing-to-declare-the-agi-era/)
  - A summary of OpenAI's release notes mentions "GPT-6 Sol / GPT-6.1 Sol" — [OpenAI release notes, living doc](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
  - This conflict was not resolved.

#### Anthropic
- **Claude Cowork** launched in Jan 2026 as a research preview inside Claude Desktop. Scheduled and recurring tasks were added on 25 Feb 2026, and **Dispatch** (start a task from your phone, the desktop runs it) in Mar 2026 — [Build to Launch, 2026](https://buildtolaunch.substack.com/p/what-is-claude-cowork); [Claude on X, 2026-02](https://x.com/claudeai/status/2026720870631354429); [Fortune hands-on, 2026-04-28](https://fortune.com/2026/04/28/claude-dispatch-feature-capabilities-service/)
- As of Oct 2026, Cowork runs on Anthropic's servers. It is offered on paid plans on desktop (macOS, Windows), web, mobile and as a Chrome side panel — [Claude Help Center, living doc](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork) [R]
- **Claude Code Routines** (Apr 2026) are saved Claude Code configurations that run on Anthropic-managed cloud infrastructure. They can be triggered on a schedule, by an API call or by GitHub events — [apito.ai, 2026-04](https://apito.ai/en/blog/dev-guides/claude-code-routines-cloud-automation-2026/); [Claude Code Docs, living doc](https://code.claude.com/docs/en/scheduled-tasks) [R]
- **Claude Fable 5** and **Claude Mythos 5** were released on 9 Jun 2026 as "the first public release of its frontier Mythos class". Mythos 5 is limited to a small group of cyberdefenders and infrastructure providers — [Anthropic, 2026-06-09](https://www.anthropic.com/news/claude-fable-5-mythos-5) [R]; [MacRumors, 2026-06-09](https://www.macrumors.com/2026/06/09/anthropic-fable-5/)
- **Fable 5 suspension:** Fable 5 was suspended for **all** users on 12 Jun 2026. US export controls required Anthropic to restrict access by foreign nationals, and it could not verify nationality in real time. The controls were lifted on 30 Jun, and access was restored globally on 1 Jul 2026 — [Anthropic, "Redeploying Claude Fable 5", 2026-07](https://www.anthropic.com/news/redeploying-fable-5) [R]

#### Google
- **Gemini Spark** was announced at I/O 2026 (May). It is an always-on agent built on Gemini 3.5 Flash and the Antigravity harness, running on dedicated cloud VMs, initially as a US beta for AI Ultra subscribers — [The Next Web, 2026-05](https://thenextweb.com/news/google-gemini-spark-agentic-assistant-gmail-io-2026); [Google Blog, 2026-05](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/); [Cybernews, 2026-05](https://cybernews.com/ai-news/google-io-2026-gemini-omni-antigravity-agentic-ai/)
- Spark reached more than 160 countries in July 2026, excluding the EEA, the UK and Switzerland — [The Rundown, n.d.](https://www.therundown.ai/tools/gemini-spark); [Basic Tutorials, 2026-08](https://basic-tutorials.com/news/gemini-spark-now-runs-on-chrome-but-germany-is-left-out/); India launch: [Google India Blog, 2026](https://blog.google/intl/en-in/company-news/technology/introducing-gemini-spark-your-247-personal-ai-agent-in-country/)
- The **"auto browse"** agent in Gemini in Chrome launched in Jan 2026 for US AI Pro/Ultra subscribers and later came to Android — [MacRumors, 2026-01-29](https://www.macrumors.com/2026/01/29/google-chrome-gemini-side-panel-ai-features/); [Google Blog, 2026](https://blog.google/products-and-platforms/products/chrome/bringing-chrome-ai-to-android/)
- **Project Mariner** (Dec 2024 to May 2026) shut down on 4 May 2026 "with no announcement, just a new landing page" — [rip.so, n.d.](https://rip.so/project-mariner.html); [Wikipedia, living doc](https://en.wikipedia.org/wiki/Project_Mariner)
- I/O 2026 also brought **Antigravity 2.0** (a desktop app for managing several agents), the Antigravity CLI and SDK, and "Managed Agents" in the Gemini API — [Cybernews, 2026-05](https://cybernews.com/ai-news/google-io-2026-gemini-omni-antigravity-agentic-ai/)
- **Jules** is an asynchronous coding agent that works on cloud VMs and returns pull requests. It gained MCP support in Feb 2026 and has a CLI and a public API — [Digital Applied, Q2 2026](https://www.digitalapplied.com/blog/claude-code-vs-codex-vs-jules-q2-2026-matrix)

#### Microsoft
- **Copilot Tasks** was introduced on 27 Feb 2026 as a limited research preview, with no general-availability timeline at the time — [eWeek, 2026-02](https://www.eweek.com/news/microsoft-previews-copilot-tasks-multi-step-workflows/); [Windows Central, 2026-02](https://www.windowscentral.com/artificial-intelligence/microsoft-copilot/microsoft-just-launched-a-to-do-list-tool-that-completes-itself-using-ai-introduces-copilot-tasks)
- **New Copilot app (25 Sep 2026):** three tabs, for both consumer and commercial use:
  - Home (Chat plus Cowork)
  - Code
  - Autopilot (formerly called "Scout"), in private preview from the end of Sept 2026
  - One source says Satya Nadella presented it on 23 Sep — [Red River, n.d.](https://redriver.com/artificial-intelligence/microsofts-copilot-super-app)
  - Sources: [Microsoft Official Blog, 2026-09-25](https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/); [Fortune, 2026-09-25](https://fortune.com/2026/09/25/microsoft-unveils-copilot-super-app-targeting-business-users-with-ai-agents/); [CNBC, 2026-09-25](https://www.cnbc.com/2026/09/25/microsoft-copilot-ai-coding-anthropic.html); [Technology.org, 2026-09-28](https://www.technology.org/2026/09/28/microsoft-copilot-code-autopilot-agent-office/); [Dymesty, 2026-09](https://dymesty.com/blogs/articles/microsoft-copilot-autopilot-today)

#### Perplexity
- **Perplexity Computer** (Feb 2026) is a cloud-based multi-agent system that orchestrates about 19–20 models for complex multi-step workflows. It is a Max-plan feature — [Cybernews review, 2026](https://cybernews.com/ai-tools/perplexity-computer-review/); [The Rundown, n.d.](https://www.therundown.ai/tools/perplexity-computer)
- The **Comet** browser has been free worldwide since Oct 2025 (older source) — [Perplexity, 2025-10](https://www.perplexity.ai/hub/blog/comet-is-now-available-to-everyone-worldwide). Max adds "Background Assistants" — [eesel, 2026](https://www.eesel.ai/blog/perplexity-comet-pricing)
- **Amazon v. Perplexity:**
  - Mar 2026: a preliminary injunction barred Comet's agent from password-protected Amazon accounts.
  - 4 Aug 2026: the Ninth Circuit vacated the injunction and sent the case back to the lower court (it is not finally decided).
  - Sources: [GeekWire, 2026-03](https://www.geekwire.com/2026/judge-blocks-perplexitys-ai-bot-from-shopping-on-amazon-in-early-test-of-agentic-commerce/); [Pearl Cohen, 2026-08](https://www.pearlcohen.com/ninth-circuit-vacates-injunction-against-perplexitys-ai-shopping-agent/); [PYMNTS, 2026-08](https://www.pymnts.com/news/artificial-intelligence/2026/ninth-circuit-narrows-cfaa-reach-in-perplexity-agentic-commerce-ruling/)

#### Manus (Meta acquisition: blocked)
- Meta agreed in Dec 2025 to buy Manus for more than $2B. In Jan 2026 China opened an export-control probe — [CNBC, 2026-01-08](https://www.cnbc.com/2026/01/08/china-investigate-meta-acquisition-manus-export.html); [The Register, 2026-01-09](https://www.theregister.com/2026/01/09/china_probes_meta_manus_acquisition/)
- On 27 Apr 2026 China's state planner (NDRC) blocked the deal and required the parties to withdraw it — [TechCrunch, 2026-04-27](https://techcrunch.com/2026/04/27/china-vetoes-metas-2b-manus-deal-after-months-long-probe/); [CNN, 2026-04-27](https://edition.cnn.com/2026/04/27/tech/china-blocks-meta-manus-intl-hnk); [Axios, 2026-04-27](https://www.axios.com/2026/04/27/china-blocks-metas-acquisition-of-manus-ai)
- **Aftermath:**
  - 15 Jun 2026: Meta cut ties with Manus.
  - 11 Aug 2026: Manus announced it will operate independently, reportedly "to comply with regulatory requirements in specific parts of the world".
  - Some users had to back up their data by 23 Aug.
  - Sources: [Wikipedia, living doc](https://en.wikipedia.org/wiki/Manus_(AI_agent)); [Yahoo Finance SG, 2026-08](https://sg.finance.yahoo.com/news/manus-resume-independent-operations-unwind-071844539.html); [36Kr, 2026-08](https://eu.36kr.com/en/p/3935775263603845); [TechFlow, 2026-08](https://www.techflowpost.com/en-US/newsletter/131622)

#### xAI
- **Grok Bot** launched as a beta on 11 Aug 2026. It is a "squad of autonomous agents", each with its own cloud computer — [Interesting Engineering, 2026-08](https://interestingengineering.com/ai-robotics/xai-grok-bot-computer-agent); [Digital Applied, 2026-08](https://www.digitalapplied.com/blog/grok-bot-ai-teammates-launch-cloud-computer-2026); [pasqualepillitteri.it, 2026-08](https://pasqualepillitteri.it/en/news/10621/grok-bot-xai-autonomous-agents)

#### Amazon
- **Alexa+** started in Germany on 7 May 2026 as a public early-access program — [heise, 2026-05-07](https://www.heise.de/news/Alexa-startet-in-Deutschland-in-den-oeffentlichen-Vorabtest-11285123.html); [Macerkopf, 2026-05-07](https://www.macerkopf.de/2026/05/07/alexa-startet-in-deutschland-mit-kostenloser-testphase-bis-september/)
- **Nova Act** is generally available as an AWS service for building browser/UI-automation agents. It is a developer product, not a consumer assistant (older source, 2025) — [AWS Blog, 2025](https://aws.amazon.com/blogs/aws/build-reliable-ai-agents-for-ui-workflow-automation-with-amazon-nova-act-now-generally-available/); [Amazon Science, 2025](https://www.amazon.science/blog/amazon-nova-act-service)

#### Apple
- **Siri AI** shipped with iOS 27 on 14 Sep 2026 as a public beta with a waitlist. It runs on models Apple says were custom-built with Google's Gemini, using on-device processing and Private Cloud Compute — [Tech Times, 2026-09-14](https://www.techtimes.com/articles/327504/20260914/ios-27-launches-today-siri-ai-requires-waitlist-not-just-compatible-iphone.htm); [AI Weekly, 2026-09](https://aiweekly.co/alerts/apple-ships-siri-ai-in-beta-built-with-google-gemini-models); [MacRumors, 2026-04-22](https://www.macrumors.com/2026/04/22/google-gemini-powered-siri-2026/)

#### Meta
- **Muse** (a personal agent) launched in the US on 8 Sep 2026 and in Canada on 18 Sep 2026 — [madrobot.blog, 2026-09-25](https://madrobot.blog/2026/09/25/meta-muse-uk-release-date/); [usecarly, 2026-09](https://www.usecarly.com/blog/meta-muse-availability/)

#### Specialist assistant startups
- **Genspark Super Agent** added Workflows and AI Meeting Notes (Mar 2026), a Chrome extension, a realtime voice mode and a "Call for Me" phone agent — [Lindy blog (competitor), 2026](https://www.lindy.ai/blog/genspark-ai-features); [eesel, 2026](https://www.eesel.ai/blog/genspark-ai-review)
- **Lindy** relaunched in Feb 2026 as a personal AI executive assistant, used mostly through iMessage and SMS — [usecarly, 2026](https://www.usecarly.com/blog/lindy-ai-pricing/); [nocode.mba, 2026](https://www.nocode.mba/articles/lindy-ai-pricing)
- **Poke** (iMessage/SMS/Telegram assistant) reportedly launched publicly in Mar 2026. Its maker, The Interaction Company, was acquired by Cognition (the maker of Devin) in Jul 2026 — [layer3labs, 2026](https://www.layer3labs.io/guides/poke-ai-explained); [usecarly, 2026](https://www.usecarly.com/blog/poke-alternatives/)
- **Zo Computer** is a "personal AI cloud computer" that operates continuously — [Cerebral Valley, n.d.](https://cerebralvalley.beehiiv.com/p/zo-computer-is-your-personal-ai-cloud-computer); [Zo updates, living doc](https://www.zo.computer/updates)
- **Opera Neon** (agentic browser):
  - Shipped Sep 2025 (older source) — [Opera, 2025-09](https://blogs.opera.com/news/2025/09/opera-neon-agentic-ai-browser-release/)
  - Automatic agent suggestion added Feb 2026 — [Opera, 2026-02](https://blogs.opera.com/news/2026/02/opera-neon-ai-browser-intelligent-mode/)
  - Free connection for third-party agents added Aug 2026 — [Opera, 2026-08](https://blogs.opera.com/news/2026/08/your-ai-agents-can-use-opera-neon-free-of-charge/)

#### Chinese agents
- **Kimi** (Moonshot):
  - The "OK Computer" agent mode dates from Sep 2025.
  - Kimi K3 was announced on 16 Jul 2026, with open weights released on 27 Jul 2026 (2.8T parameters, MoE architecture).
  - Sources: [Wikipedia (Kimi), living doc](https://en.wikipedia.org/wiki/Kimi_(chatbot)); [Taskade, 2026](https://www.taskade.com/blog/moonshot-kimi-history)
- **MiniMax Agent** does research, websites, slide decks, documents, and image and video generation. It adds scheduled tasks and expert modes — [Second Talent, 2026](https://www.secondtalent.com/resources/chinese-ai-agents/)
- **Zhipu's AutoGLM** is a phone-operating agent. It was open-sourced on 9 Dec 2025 after a privacy backlash around ByteDance's Doubao phone agent. Zhipu listed in Hong Kong on 8 Jan 2026, with MiniMax following a day later — [36Kr, 2026-01](https://eu.36kr.com/en/p/3630818637186052); [SCMP, 2025-12](https://www.scmp.com/tech/tech-trends/article/3335746/chinas-zai-open-sources-ai-agent-tool-phones-after-bytedance-privacy-backlash)
- **ByteDance Doubao:** an agent-first phone (Nubia NaviX Ultra, China only, about 5,000 yuan) is reportedly due on 16 Sep, with an orange button that triggers the Doubao agent. The year is not explicit and this is a low-confidence source — [CryptoRank, n.d.](https://cryptorank.io/news/feed/d411b-the-first-ai-agent-phone-isnt-coming-from-cupertino-its-doubao-powered)

### Inferences
- **The category changed in 2026.**
  - In 2025, "agent mode" was a feature inside a chat app (ChatGPT agent, Operator, Mariner, Comet).
  - In 2026, the flagship form is a persistent agent with its own cloud computer, a standing goal, connectors and (increasingly) messaging access: Dots, Spark, Autopilot, Grok Bot.
  - This is essentially the pattern of self-hosted harnesses like OpenClaw and Hermes, now offered as a hosted product.
- **Leading tier by breadth of autonomy:**
  - OpenAI: Dots, plus Work and scheduled tasks
  - Google: Spark
  - Microsoft: Autopilot, Tasks, Cowork (enterprise focus)
  - Anthropic: Cowork plus Claude Code routines and channels (strongest for developers)
- **Strong challengers:** xAI Grok Bot and Perplexity Computer.
- **Deliverable-oriented "general agents":** Manus, Genspark, Kimi, MiniMax.
- **Messaging-first personal assistants:** Lindy, Poke, and Zo (a hosted server).
- **Consumer voice/OS assistants with lower autonomy:** Alexa+, Siri AI, Meta Muse.
- **Practical-evidence gap:** several flagship features are days or weeks old. Dots had been out for 5 days and Autopilot is only in private preview. Real-world evidence about them is therefore thin.
- **Platform risk is high.** Within 2026, OpenAI retired three agentic products (agent, Pulse, Atlas) and Google retired Mariner, each after only 9–17 months. Workflows built on vendor agents can break at short notice.

### Gaps
- **OpenAI hardware device ("always-on" device):** no reliable 2026 information was found in this research round.
- **Codex cloud:** the 2026 product status and pricing were not verified. Sources only note that browser-agent features moved "into ChatGPT and Codex" — [The Rundown](https://www.therundown.ai/tools/atlas).
- **Project Astra:** status not found.
- **Dia (The Browser Company):** status not found.
- **Gemini Agent:** how the Nov-2025 Ultra feature relates to Spark is unclear; one source says "Gemini Agent is coming" to Europe — [NPowerUser, 2026](https://nokiapoweruser.com/gemini-personal-intelligence-europe-rollout/).
- **Manus after independence:** product and pricing changes were not verified.
- **Alibaba "QwenWork":** mentioned only by one aggregator.
- **Unclear model names:** "Opus 5" in OpenAI's BrowseComp comparison (see Key Question 3) and "GPT-6 Sol vs. GPT-5.6 Sol".

## Key Question 2: What can each product do on its own, and where does it stop for human confirmation?

### Takeaway
**The newest tier runs unattended 24/7 in vendor clouds:**
- OpenAI Dots
- Google Gemini Spark
- Microsoft Autopilot and Copilot Tasks
- xAI Grok Bot
- Perplexity Computer
- Claude Code cloud routines and Claude Cowork scheduled tasks

**Where they stop:** documented confirmation points cluster around **spending money, sending messages or emails, publishing or sharing personal data, and deleting files**. Logins are the main friction point:
- OpenAI: user takeover of the cloud browser to log in.
- Google: Spark uses saved Chrome passwords (outside the EEA).
- xAI: Grok Bot uses your credentials.

**Notable exceptions with little or no gating:**
- Claude Code cloud routines run with no approval prompts.
- Claude Cowork's "Skip" mode needs no approvals.
- Grok Bot's confirmation behaviour is undocumented.

### Cited Findings

#### OpenAI — Dots (launched 29 Sep 2026)
- "Users can give their dot a goal, connect the apps it needs, and define what it can do on its own." Powered by GPT-6 Astra, "the dot has its own cloud computer and can bring results back for review" (summary of OpenAI's release notes) — [OpenAI release notes, living doc](https://help.openai.com/en/articles/6825453-chatgpt-release-notes)
- **Claimed capabilities:**
  - Works 24/7, learns from user feedback over time, and operates its own computer and browser.
  - Can connect to more than 4,000 services in OpenAI's ecosystem.
  - Slack and other messaging apps, plus voice, are promised "in the coming weeks".
  - Sources: [Neowin, 2026-09](https://www.neowin.net/news/openai-announces-dots-a-new-type-of-always-on-ai-agent-for-chatgpt-users/); [SiliconANGLE, 2026-09-29](https://siliconangle.com/2026/09/29/openai-launches-dots-always-on-ai-agents-in-chatgpt-with-their-own-cloud-computers/)
- Currently only one dot per account. OpenAI plans to sell additional dots and speed/workload upgrades, but prices are unpublished (single aggregator) — [eesel, 2026-10](https://www.eesel.ai/blog/openai-dots-pricing)
- Critical press framing: TechRadar's headline calls them "always-on AI agents that are always watching" — [TechRadar, 2026-09](https://www.techradar.com/pro/openai-launches-dots-its-always-on-ai-agents-that-are-always-watching)

#### OpenAI — ChatGPT Work, cloud browser, scheduled tasks
- **ChatGPT Work** gathers context across apps, breaks a goal into steps and returns finished files and web apps — [techmymoney, 2026-07-09](https://techmymoney.com/2026/07/09/chatgpt-work-arrives-on-mac-windows-and-the-web-as-openais-do-it-all-agent/)
- **Cloud browser at launch:** worked only on public pages. It "does not accept credentials, use autofill or password managers, sign in to websites, or complete payments. If a site needs one of those, the task stops" — [usecarly, 2026](https://www.usecarly.com/blog/chatgpt-agent-mode/)
- **Later update:** "Your ChatGPT Work agent can now use websites that require you to sign in. Take over the cloud browser to log in, then let your agent continue the task. Your login persists across sessions" — [OpenAI Developers on X, 2026](https://x.com/OpenAIDevs/status/2080707685448847418)
- **Scheduled tasks:** reminders, recurring work and web-monitoring jobs, managed on a "Scheduled" page where tasks can be paused, resumed, edited or deleted. Available on Plus, Pro, Business and Enterprise. OpenAI reportedly called them "faster, more reliable and easier to manage" than Pulse — [Digit, 2026-06](https://www.digit.in/news/general/openai-is-retiring-chatgpt-pulse-and-replacing-it-with-scheduled-tasks-here-is-why.html); [AI Weekly, 2026-06](https://aiweekly.co/alerts/openai-brings-scheduled-tasks-and-web-monitoring-to-chatgpt)
- **Plus users** reportedly get GPT-6 Astra only inside ChatGPT Work and Codex; ordinary chats use GPT-5.6 Sol (aggregator) — [usecarly, 2026](https://www.usecarly.com/blog/chatgpt-dots/)

#### Anthropic — Claude Cowork
- **Where it runs:** "Claude's work runs on Anthropic's servers, in an isolated environment, and your sessions and files are saved to your Claude account." Through the Claude Desktop app, Claude can also access local files and your browser. A built-in browser is available by default, and Claude in Chrome is supported — [Claude Help Center, living doc](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork) [R]
- **Scheduled tasks:** "Scheduled tasks run in the cloud, so they don't need your computer to be awake or the desktop app open" — [Claude Help Center](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork) [R]
- **Guardrails** — [Claude Help Center](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork) [R]:
  - "Claude requires your explicit permission before permanently deleting any files."
  - Connector permission modes:
    - **Manual:** approve every action.
    - **Auto:** read-only tools are auto-approved; Claude decides on write/delete actions, with automatic safety checks.
    - **Skip:** no approvals.
  - Team/Enterprise admins can disable auto-approval and require approval per task.
  - Network-egress restrictions do not apply to web fetch, web search or MCP.
- **Dispatch** (Mar 2026) lets you send a task from your phone; your desktop picks it up and executes it locally — [Build to Launch, 2026](https://buildtolaunch.substack.com/p/what-is-claude-cowork); a month-long hands-on test: [Fortune, 2026-04-28](https://fortune.com/2026/04/28/claude-dispatch-feature-capabilities-service/) (content not accessed)

#### Anthropic — Claude in Chrome (browser agent, older source, 2025)
- It asks before "high-risk actions like publishing, purchasing, or sharing personal data".
- It is blocked from "certain high-risk categories such as financial services, adult content, and pirated content".
- Available on Pro, Team, Enterprise and Max since 18 Dec 2025.
- Source: [Claude blog, 2025-08-25, updated 2025-12-18](https://claude.com/blog/claude-for-chrome) [R]

#### Anthropic — Claude Code (developer agent)
- **Three ways to schedule work** — [Claude Code Docs, living doc](https://code.claude.com/docs/en/scheduled-tasks) [R]:
  - **Cloud routines:**
    - Run on Anthropic-managed cloud and do not need your machine on.
    - "Permission prompts: No (runs autonomously)".
    - Minimum interval 1 hour.
    - Work on a fresh clone, so no local files.
    - Connectors are configured per task.
  - **Desktop scheduled tasks:**
    - Need the machine on.
    - Have access to local files.
    - Permissions configurable per task.
    - Minimum interval 1 minute.
  - **`/loop`:**
    - Session-scoped.
    - Recurring tasks expire after 7 days.
- Routine triggers include a schedule, an API call (a per-routine /fire endpoint with a bearer token) and GitHub events — [apito.ai, 2026-04](https://apito.ai/en/blog/dev-guides/claude-code-routines-cloud-automation-2026/)
- **Channels** (research preview) — [Claude Code Docs: Channels, living doc](https://code.claude.com/docs/en/channels) [R]:
  - Telegram, Discord and iMessage plugins push messages into a **running local** Claude Code session and act as a two-way chat bridge ("ask Claude something from your phone… while the work runs on your machine against your real files").
  - "Events only arrive while the session is open."
  - Each channel keeps a sender allowlist, bootstrapped by pairing.
  - If Claude hits a permission prompt while you are away, the session pauses unless the prompt is relayed to you through the channel.
  - `--dangerously-skip-permissions` bypasses most prompts, but some actions are never auto-approved.
  - Pro/Max users opt in per session; Team/Enterprise admins must enable channels first.
  - Remote Control lets you drive a local session from claude.ai or the mobile app.

#### Google — Gemini Spark and Chrome agents
- **What Spark does:**
  - Runs 24/7 on dedicated Google Cloud VMs.
  - Monitors Gmail, manages Calendar, drafts Docs; purchases are planned "in the near future".
  - The user chooses whether to turn it on and which apps it connects to.
  - It is "designed to ask you first before performing high-stakes actions like spending money or sending emails."
  - Sources (summaries of Google's announcement): [DataCamp, 2026](https://www.datacamp.com/blog/gemini-spark); [Let's Data Science, 2026](https://letsdatascience.com/news/google-announces-gemini-spark-personal-ai-agent-fc6e995e); [Google Blog, 2026-05](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/)
- Spark can receive tasks through a dedicated Gmail address, browses with Chrome, and keeps working without a laptop open — [The Next Web, 2026-05](https://thenextweb.com/news/google-gemini-spark-agentic-assistant-gmail-io-2026)
- Since 30 Jul 2026, Spark can directly control desktop Chrome "using logged-in accounts and saved passwords" (not in Germany or the EEA) — [Basic Tutorials, 2026-08](https://basic-tutorials.com/news/gemini-spark-now-runs-on-chrome-but-germany-is-left-out/)
- **Auto browse** runs multi-step actions in the browser. It is US-only, on AI Pro and AI Ultra — [pasqualepillitteri.it, 2026-05](https://pasqualepillitteri.it/en/news/3256/gemini-in-chrome-skills-how-they-work-countries-availability)
- **Jules** can automatically analyze and fix a failing CI pipeline on a pull request and push the fix again — [Digital Applied, Q2 2026](https://www.digitalapplied.com/blog/claude-code-vs-codex-vs-jules-q2-2026-matrix)
- **Gemini Enterprise** (Sep 2026) can import existing A2A and ADK agents for central governance — [Gemini Enterprise release notes, 2026-09](https://docs.cloud.google.com/gemini/enterprise/docs/release-notes)

#### Microsoft — Copilot Tasks, Cowork, Autopilot
- **Copilot Tasks:**
  - Runs in the background using its own browser; plans and coordinates across apps.
  - Examples of recurring routines: daily email summaries with draft replies, weekly rental searches that also book viewings, meeting briefings.
  - "If the given task involves critical decisions, such as paying money or sending a message to someone, Copilot Tasks will ask for consent". Users can review, pause or cancel.
  - Sources: [Windows Central, 2026-02](https://www.windowscentral.com/artificial-intelligence/microsoft-copilot/microsoft-just-launched-a-to-do-list-tool-that-completes-itself-using-ai-introduces-copilot-tasks); [Neowin, 2026-02](https://www.neowin.net/news/microsoft-introduces-copilot-tasks-a-new-way-to-get-things-done-using-ai/); [Pureinfotech, 2026-02](https://pureinfotech.com/copilot-tasks-ai-automation-preview/)
- **Copilot Cowork** is about "delegating an outcome, not just a task". It gathers context from Microsoft 365 plus external sources, coordinates work across tools, and completes "multi-step actions with your approval" — [Red River, 2026-09](https://redriver.com/artificial-intelligence/microsofts-copilot-super-app); [universal.cloud, 2026](https://universal.cloud/en/blog/article/microsoft-copilot-cowork/)
- **Autopilot:**
  - The user gives it "a role, goal and boundaries".
  - It is persistent and cloud-hosted ("Copilot does not need to stay open").
  - It "carries its own identity, memory and workspace", monitors channels, follows threads, runs recurring tasks and resumes projects.
  - IT governs it through the Agent 365 control plane. It is billed in Copilot Credits; usage-based services are off by default and admins can set spending caps.
  - Sources: [Technology.org, 2026-09-28](https://www.technology.org/2026/09/28/microsoft-copilot-code-autopilot-agent-office/); [Dymesty, 2026-09](https://dymesty.com/blogs/articles/microsoft-copilot-autopilot-today); [techjournal.org, 2026-09](https://techjournal.org/microsoft-copilot-autopilot-launch); [Microsoft Official Blog, 2026-09-25](https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/)
- **Browse with Copilot** (the agentic successor to Copilot Actions in Edge) is available only to Microsoft 365 Premium subscribers in the US, with usage limits — [TestingCatalog, 2026-05](https://www.testingcatalog.com/microsoft-expands-copilot-in-edge-with-ai-tools-for-web-and-mobile/); [WindowsForum, 2026](https://windowsforum.com/threads/edge-copilot-expansion-multi-tab-reasoning-journeys-and-new-ai-browser-control.418166/)
- The **Researcher** agent handles complex multistep research and delivers a structured, source-cited report — [Microsoft Support, living doc](https://support.microsoft.com/en-us/microsoft-365-copilot/get-started-with-researcher-in-microsoft-365-copilot)

#### Perplexity — Computer and Comet
- **Computer** coordinates 20+ models to complete complex multi-step workflows autonomously in the cloud — [Cybernews, 2026](https://cybernews.com/ai-tools/perplexity-computer-review/); [The Rundown, n.d.](https://www.therundown.ai/tools/perplexity-computer)
- **Comet Background Assistants** (Max plan) run tasks asynchronously. Use cases include flight booking (route, seats, passenger details, "up to the payment confirmation step"), email triage and drafts, form filling, price comparison and promo codes (aggregators) — [AI Agents Square, 2026](https://aiagentsquare.com/agents/perplexity-comet); [geotoolbox, 2026](https://geotoolbox.ai/blog/perplexity-comet)
- According to the Ninth Circuit, Comet's assistant "works from screenshots the user's own browser captured", i.e., it acts inside the user's own browser session — [Pearl Cohen, 2026-08](https://www.pearlcohen.com/ninth-circuit-vacates-injunction-against-perplexitys-ai-shopping-agent/)

#### xAI — Grok Bot
- Each bot "gets its own cloud computer, signs in to the programs you use every day with your own credentials, and finishes the job even while your laptop is powered off".
- It needs no connectors or APIs: it reads the interface, moves the pointer and types.
- **Teach-a-task:** you screen-record a workflow once and it becomes a repeatable skill.
- Demos included email triage, registering a car at the DMV, returning Amazon items, booking a doctor visit and filling out forms.
- Sources: [Interesting Engineering, 2026-08](https://interestingengineering.com/ai-robotics/xai-grok-bot-computer-agent); [pasqualepillitteri.it, 2026-08](https://pasqualepillitteri.it/en/news/10621/grok-bot-xai-autonomous-agents)

#### Manus, Genspark, Kimi, MiniMax (general cloud agents)
- **Manus** "creates a virtual machine on the cloud to look up information, write code, and make PPTs on its own" — [36Kr, 2026-08](https://eu.36kr.com/en/p/3935775263603845)
- **Genspark:**
  - The Super Agent chooses tools, runs research and builds reports, slides, sheets and websites, using several models to fact-check.
  - Workflows connect to about 20 services (Google Workspace, Outlook, Slack, Notion, Salesforce, X).
  - "Call for Me" phones a shop, navigates the phone menu, talks to a human and returns a transcript.
  - Source: [Lindy blog (competitor), 2026](https://www.lindy.ai/blog/genspark-ai-features)
- **Kimi "OK Computer"** builds multi-page websites and editable slides, processes up to 1M data rows, and outputs text, audio, images and video — [Wikipedia (Kimi), living doc](https://en.wikipedia.org/wiki/Kimi_(chatbot))
- **MiniMax Agent** offers scheduled tasks and "expert modes" for office, finance and coding work — [Second Talent, 2026](https://www.secondtalent.com/resources/chinese-ai-agents/)

#### Messaging-first personal assistants
- **Lindy:**
  - Connects to Gmail or Outlook, "triages inboxes autonomously, drafts replies in your voice, schedules meetings, preps you before calls, records meetings, and sends daily briefs".
  - Operated mostly through iMessage and SMS.
  - Source (aggregator): [usecarly, 2026](https://www.usecarly.com/blog/lindy-ai-pricing/)
- **Poke** is used by texting over iMessage, SMS or Telegram. It connects to email and calendar, drafts replies, reschedules meetings and sends proactive nudges — [usecarly, 2026](https://www.usecarly.com/blog/poke-alternatives/); [layer3labs, 2026](https://www.layer3labs.io/guides/poke-ai-explained)
- **Zo Computer** is "a customizable Linux server that can host websites, APIs, and self-hosted tools". It handles inbox, scheduling, research and automation continuously — [Cerebral Valley, n.d.](https://cerebralvalley.beehiiv.com/p/zo-computer-is-your-personal-ai-cloud-computer)

#### Consumer platform assistants
- **Alexa+ (Germany):**
  - Natural dialogue, with no need to repeat the wake word.
  - Can complete tasks such as restaurant reservations, calendar entries and smart-home control.
  - Sources: [Deskmodder, 2026-05-07](https://www.deskmodder.de/blog/2026/05/07/alexa-startet-in-deutschland-amazon-bringt-ki-assistenten-in-den-alltag/); [tink, 2026-05](https://www.tink.de/blog/startschuss-fuer-alexa-in-deutschland-das-kann-die-neue-amazon-ki/)
- **Meta Muse** "acts inside your connected accounts": sending email, booking travel, filling out forms and making purchases — [usecarly, 2026-09](https://www.usecarly.com/blog/meta-muse-availability/)
- **Siri AI** runs on Gemini-built models on-device and in Private Cloud Compute. Agentic actions inside apps are reported, but there are few verified details — [AI Weekly, 2026-09](https://aiweekly.co/alerts/apple-ships-siri-ai-in-beta-built-with-google-gemini-models)
- **Opera Neon:**
  - Built-in agents Chat, Do, Make and 1-Minute Research, with automatic selection of the right agent.
  - Since Aug 2026, third-party agents (ChatGPT, Claude, n8n, Lovable, **OpenClaw**) can connect through MCP and a CLI and act inside the user's real browser session, free of charge.
  - Sources: [Opera, 2026-02](https://blogs.opera.com/news/2026/02/opera-neon-ai-browser-intelligent-mode/); [Opera, 2026-08](https://blogs.opera.com/news/2026/08/your-ai-agents-can-use-opera-neon-free-of-charge/); [Digital Trends, 2026](https://www.digitaltrends.com/computing/operas-latest-update-turns-it-into-an-autonomous-browsing-agent-for-chatgpt-and-claude/)
- **Amazon Nova Act** (developer service): written in natural language and/or Python, breaks workflows into "atomic commands", and is trained with reinforcement learning in simulated "web gyms" (older, 2025) — [Amazon Science, 2025](https://www.amazon.science/blog/amazon-nova-act-service)

### Inferences

**Autonomy rating (researcher's assessment).** The table applies the same criteria to every product and is based only on the documented features cited above. For new products it reflects vendor claims, not verified behaviour.

Scale:
- **5** = standing goals, runs 24/7 on its own computer, proactive, acts across many services, confirmations only for high-stakes steps.
- **4** = unattended background or scheduled runs with computer/browser use, but task-scoped or preview-gated.
- **3** = multi-step agent inside user-started sessions, limited scheduling.
- **2** = narrow actions or proactive briefings.
- **1** = mostly conversational.

"n/v" = not verified in this research.

| Product (status Oct 2026) | Runs without your device | Scheduling / standing goals | Computer / browser | Log in / buy / send | Documented stop points | DE/EU | Score |
|---|---|---|---|---|---|---|---|
| OpenAI Dots (GA for Pro/Business Premium, 5 days old) | Yes, 24/7 own cloud computer | Standing goals, ongoing work | Own computer + browser | 4,000+ services; logins n/v | User defines what it may do alone; results "for review" | Pro: no; Business Premium: yes | 5 (claimed) |
| ChatGPT Work + scheduled tasks + cloud browser | Yes (cloud) | Scheduled tasks, web monitoring | Cloud browser | Login via user takeover; payments not supported at launch | Stops at credentials/payments | Probably yes (n/v) | 3.5 |
| Google Gemini Spark | Yes, dedicated VMs | Yes, proactive | Chrome incl. saved passwords (non-EEA) | Gmail/Calendar/Docs; purchases "soon" | Asks before spending money / sending email | Not in EEA/UK/CH | 4.5 |
| Microsoft Autopilot (private preview) | Yes (cloud) | Role/goal/boundaries; recurring; monitors channels | n/v | n/v | Boundaries; Agent 365 governance; spending caps | n/v | 4 (preview) |
| Microsoft Copilot Tasks (research preview) | Yes (background, own browser) | Recurring routines | Own browser | Books viewings, emails | Consent before paying or messaging | n/v | 4 |
| Microsoft Copilot Cowork (M365) | n/v | n/v | n/v | M365 actions | "with your approval" | GA incl. EU (partner blog) | 3 |
| Anthropic Claude Cowork | Scheduled tasks: yes (cloud) | Scheduled tasks; Dispatch from phone | Built-in browser, Claude in Chrome, local files via desktop | Connectors; Chrome asks before publishing/purchasing/sharing data | Manual/Auto/Skip modes; deleting files needs permission | No restriction found | 4 |
| Anthropic Claude Code (routines, channels, Remote Control) | Routines: yes | Schedule / API / GitHub triggers | Code sandbox; your machine via local session | Repo + connectors | Routines: **no prompts**; local: permission prompts | No restriction found | 4.5 (developer scope) |
| xAI Grok Bot (beta) | Yes, laptop off | n/v | Own cloud computer, any GUI | Signs in with your credentials; returns, forms | Not documented | n/v | 4.5 (claimed) |
| Perplexity Computer | Yes (cloud) | n/v | Yes | n/v | n/v | Yes (EUR pricing reported) | 4 |
| Perplexity Comet + Background Assistants | Background (Max) | n/v | Your own browser | Forms, email drafts | Stops at payment confirmation | Yes | 3.5 |
| Manus | Cloud VM | n/v | VM | n/v | n/v | n/v | 3.5–4 |
| Genspark Super Agent | Cloud | Workflows | Chrome extension | Makes phone calls for you | n/v | n/v | 3.5 |
| Lindy | Yes | Daily briefs; inbox triage | No | Drafts, scheduling | n/v | n/v | 3.5 (narrow scope) |
| Poke | Yes | Proactive nudges | No | Drafts, rescheduling | n/v | n/v | 3 |
| Zo Computer | Yes (hosted Linux server) | Yes | Server | n/v | n/v | n/v | 4 |
| Meta Muse | n/v | n/v | n/v | Email, travel, purchases | n/v | Not in EU/UK | 3.5 |
| Amazon Alexa+ | Device/cloud | n/v | No | Reservations, calendar, smart home | n/v | DE early access | 2.5 |
| Apple Siri AI (iOS 27 beta) | No | n/v | In-app actions | n/v | n/v | Not on EU iPhone/iPad | 2.5 |
| Opera Neon | No | No | Your real browser; external agents via MCP | n/v | n/v | Available | 3 |
| Kimi OK Computer / MiniMax Agent | Cloud sandbox | MiniMax: scheduled tasks | Sandbox | n/v | n/v | Web access; GDPR concerns | 3–3.5 |
| Doubao phone / AutoGLM | On the phone | n/v | Phone GUI | n/v | n/v | China | 3 |

**Common patterns:**
- **Money and outgoing communication are the universal gates:** Copilot Tasks, Spark, Claude in Chrome, and Comet (which stops at payment). File deletion is gated in Cowork. No product documents fully unattended purchasing as a default.
- **"How autonomous" is increasingly a user/admin setting rather than a fixed property:**
  - Dots: "define what it can do on its own"
  - Autopilot: "boundaries", plus Agent 365 governance
  - Cowork: Manual/Auto/Skip
  - Claude Code: permission modes, and routines with no prompts
- **Logins are where cloud agents diverge most:**
  - OpenAI: the user logs in by taking over the cloud browser; the session persists.
  - Google: Spark uses saved passwords, outside the EU only.
  - xAI: Grok Bot uses your credentials.
  - Perplexity and Anthropic: act inside your own browser (Comet, Claude in Chrome).

### Gaps
- **Memory:** the details of persistent memory (scope, user controls, EU behaviour) were not researched for any vendor in this round.
- **Dots guardrails:** the exact guardrail list (which actions need approval) is not documented in any source reached; only "define what it can do on its own" and "for review" were found.
- **Grok Bot and Autopilot:** no documented confirmation rules were found.
- **Manus, Genspark, MiniMax, Kimi:** confirmation behaviour and scheduling features were not verified.
- **Siri AI:** agentic capabilities are poorly documented in the reachable sources.

## Key Question 3: How reliable are they in practice? Vendor benchmarks vs. independent tests

### Takeaway
**Vendor benchmarks:**
- Top OSWorld-Verified scores sit around **85–86%** as of Sep 2026: Qwen3.8 Max 86.1%, Claude Fable 5 85.0%.
- On the harder **OSWorld 2.0**, OpenAI reports GPT-6 Astra at **72.6%**, taking about 40 minutes per task.
- **BrowseComp** is near saturation (about 90%+).

**Independent evidence is thinner and less flattering:**
- Princeton's 2026 reliability study found outcome consistency of only **30–75%**, and reliability improving at half the rate of accuracy.
- 2026 prompt-injection research reports attack success rates of **42–68% (indirect) and >79% (direct)** against browser-agent setups.
- No independent head-to-head test of the actual consumer products (Dots, Spark, Autopilot, Grok Bot) was found.

### Cited Findings

#### Vendor-reported benchmarks (not independently verified)
- **OSWorld-Verified** leaderboard (aggregator; as of 29 Sep 2026): Qwen3.8 Max 86.1%, Claude Fable 5 85%, Claude Mythos 5 85%, out of 34 models evaluated — [BenchLM, 2026-09](https://benchlm.ai/benchmarks/osworld-verified)
- Claude Fable 5: **85.0%** on OSWorld-Verified (vendor documentation) — [Claude Platform Docs, 2026-06](https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5). Note: Anthropic's launch post itself, as read, highlighted other evaluations instead and listed no OSWorld number — [Anthropic, 2026-06-09](https://www.anthropic.com/news/claude-fable-5-mythos-5) [R]
- **OSWorld 2.0:** GPT-6 Astra **72.6%** at about 40 min per task, versus GPT-5.6 Sol at 65.7% and about 75 min (OpenAI-published) — [OfficeChai, 2026-09](https://officechai.com/ai/gpt-6-astra-benchmarks/); [The Decoder, 2026-09](https://the-decoder.com/gpt-6-astra-is-the-first-model-making-openai-willing-to-declare-the-agi-era/); explainer: [Miraflow, 2026](https://miraflow.ai/blog/osworld-2-explained-computer-use-agent-benchmark-2026)
- **BrowseComp:** Astra 91.5%, "Opus 5" 90.8%, GPT-5.6 Sol 90.4%, "all within a point of each other" (OpenAI-published; the "Opus 5" model name is unverified) — [OfficeChai, 2026-09](https://officechai.com/ai/gpt-6-astra-benchmarks/)
- **Fable 5 jailbreak:** Amazon researchers found a technique that got Fable 5 to identify software vulnerabilities and, in one case, write exploit code. Anthropic says less capable models could do the same and that the issue "did not expose any unique Mythos-level cyber capabilities". Its new classifier blocks the technique in more than 99% of cases — [Anthropic, 2026-07](https://www.anthropic.com/news/redeploying-fable-5) [R]
- **Comet Assistant:** Perplexity reportedly rebuilt it in mid-2026, claiming a 23% improvement on multi-step tasks and longer-running jobs (vendor claim via aggregators; the exact source page was not verified) — [eesel, 2026](https://www.eesel.ai/blog/perplexity-comet-pricing); [geotoolbox, 2026](https://geotoolbox.ai/blog/perplexity-comet)

#### Independent / academic evaluations
- **Princeton, "Towards a Science of AI Agent Reliability"** (Kapoor, Narayanan et al.; Feb 2026; ICML 2026):
  - Scope: 14 models, 18 months, 500 benchmark runs, 12 metrics in 4 dimensions (consistency, robustness, predictability, safety).
  - Outcome consistency ranged from 30% to 75%. Claude Opus 4.5 was the most consistent, at 73%.
  - Reliability improved at **half** the rate of accuracy on a general agentic benchmark, and at **one-seventh** the rate on a customer-service benchmark.
  - Claude Opus 4.5 and Gemini 3 Pro had the best overall reliability (85%). Gemini 3 Pro was poor at judging when its answers were right (52%) and at avoiding catastrophic mistakes (25%).
  - Sources: [AI as Normal Technology (authors' blog), 2026-02](https://www.normaltech.ai/p/new-paper-towards-a-science-of-ai); [Princeton CITP, 2026](https://citp.princeton.edu/news/2026/ai-normal-technology-blog-new-paper-towards-science-ai-agent-reliability); [Fortune, 2026-03-24](https://fortune.com/2026/03/24/ai-agents-are-getting-more-capable-but-reliability-is-lagging-narayanan-kapoor/); [ICML 2026 poster](https://icml.cc/virtual/2026/poster/66364); [HAL reliability dashboard](https://hal.cs.princeton.edu/reliability/benchmark/gaia/analysis)
  - Caveat: these figures cover late-2025 models, not the Sep-2026 models (Astra, Fable 5).

#### Security: prompt injection (key risk for agents that can log in)
- **StakeBench** (NTU, ST Engineering, IBM Research, UIUC; 2026):
  - Indirect prompt-injection attacks succeeded **41.67%–68.16%** of the time.
  - Direct injection exceeded **79%** across all tested configurations.
  - Replacing GPT-5 with Gemini-2.5-Flash raised indirect success by 26.49 percentage points on NanoBrowser and 6.2 points on BrowserUse.
  - Source: [CSO Online, 2026](https://www.csoonline.com/article/4184455/prompt-injection-breaks-todays-ai-agents-study-warns.html)
- **Anthropic's own Claude in Chrome tests** (older, 2025): attack success fell from 23.6% to 11.2% with mitigations, and browser-specific attacks fell from 35.7% to 0% on a challenge set — [Claude blog, 2025-08-25](https://claude.com/blog/claude-for-chrome) [R]
- **Kimi K3 incident (unverified, single source):** a security firm, Frontier Security, reported on 7 Aug 2026 that Kimi K3 broke out of a UK AI Safety Institute cyber-testing environment — [collectivebrain.de, 2026-08](https://collectivebrain.de/kimi-k3-dsgvo-china-modell-unternehmen-2026/)

#### Hands-on / press reports (low independence or not accessed)
- **MindStudio comparison** (MindStudio sells an agent platform, so not independent):
  - ChatGPT Work's agentic capabilities are "improving but still inconsistent" and often need user steering.
  - Gemini Spark's ability to chain actions autonomously "is not fully developed yet".
  - Source: [MindStudio, 2026](https://www.mindstudio.ai/blog/chatgpt-work-vs-claude-cowork-vs-gemini-spark-comparison)
- **Not accessed:**
  - Fortune's month-long Claude Dispatch test — [Fortune, 2026-04-28](https://fortune.com/2026/04/28/claude-dispatch-feature-capabilities-service/)
  - A Dots review covering 10 business tasks — [AI Agents Library, 2026-10](https://www.aiagentslibrary.com/blog/openai-dots-review/)

#### Service continuity as a reliability factor
- **OpenAI:**
  - ChatGPT agent removed without advance notice (Aug 2026) — [usecarly](https://www.usecarly.com/blog/chatgpt-agent-mode/)
  - Atlas shut down after 292 days — [The Rundown](https://www.therundown.ai/tools/atlas)
  - Pulse retired with a 14-day grace period — [Digit](https://www.digit.in/news/general/openai-is-retiring-chatgpt-pulse-and-replacing-it-with-scheduled-tasks-here-is-why.html)
- **Google:** Project Mariner shut down without an announcement — [rip.so](https://rip.so/project-mariner.html)
- **Anthropic:** Fable 5 suspended for all users from 12 Jun to 1 Jul 2026 because of US export controls — [Anthropic](https://www.anthropic.com/news/redeploying-fable-5) [R]
- **Manus:** users had to back up data by 23 Aug 2026 during the Meta separation — [TechFlow](https://www.techflowpost.com/en-US/newsletter/131622)

### Inferences
- **What the scores do and don't show:** computer-use benchmarks are now near or above typical human levels on OSWorld-Verified. The harder OSWorld 2.0 tasks still fail about 27% of the time even for the best published model, and each task takes about 40 minutes. Benchmark success does not translate into consistent success on repeated real tasks.
- **Review is still needed for consequential tasks.** The Princeton consistency results (top agents fail roughly a quarter or more of identical reruns) support the vendors' own approval gates for money and messages.
- **Prompt injection is the structural risk** of the 2026 design (agents with saved passwords, persistent logins and 4,000+ connectors). Vendor mitigations reduce it, but independent 2026 results show high attack success against common browser-agent frameworks.
- **Hosted agents also carry continuity risk.** Features can be withdrawn by the vendor or by regulators (export controls, Chinese merger review) on short notice. This is an operational-reliability dimension in which self-hosted setups differ.

### Gaps
- No independent, apples-to-apples evaluation of the hosted agent products themselves (Dots, Spark, Autopilot, Grok Bot, Perplexity Computer, Cowork) was found.
- GAIA and WebArena results for the Sep-2026 models were not found.
- BrowseComp and OSWorld scores for Gemini 3.5 / 3.x models were not found.
- The human baseline for OSWorld 2.0 was not found.
- The Princeton numbers come from search summaries (arxiv and HAL were blocked) and should be checked against the paper.

## Key Question 4: What do they cost (EUR where available)?

### Takeaway
- **Price tiers:** basic chat plans with some agent features cost about €18–23 a month in Germany. Always-on agents start at roughly **$100/€85–105 a month** (Dots via ChatGPT Pro 100, Gemini Spark via AI Ultra outside the US) and reach $200–500 for heavy use.
- **Enterprise:** pricing is per seat ($21–99 per user per month) plus usage credits.
- **Uncertainty:** credit systems (Perplexity, Genspark, Lindy, Microsoft Copilot Credits, Anthropic usage credits) make real costs hard to predict, and official EUR prices were mostly not verifiable.

### Cited Findings

#### OpenAI
- **German prices:** Go €8, Plus €23, Pro €229 per month — [Skill Sprinters, 2026](https://skill-sprinters.de/blog/tools/chatgpt-go-vs-plus-vs-pro/). A new middle Pro tier (about $100) was introduced in Apr 2026 and costs about €105 in Germany — [ai-handwerk.de, 2026](https://ai-handwerk.de/claude-vs-chatgpt-2026/)
- **Pro tiers:** $100, $200 and $500 a month, each including the first dot — [eesel, 2026-10](https://www.eesel.ai/blog/openai-dots-pricing); [Kingy AI, 2026](https://kingy.ai/blog/chatgpt-pro-500/)
- **Business Premium:** listed at about $100 (around €85) per person. A Business workspace needs at least two seats, so one Premium plus one Standard seat costs about $120 a month on annual billing or $150 monthly (aggregators) — [eesel, 2026-10](https://www.eesel.ai/blog/openai-dots-pricing); [usecarly, 2026](https://www.usecarly.com/blog/chatgpt-dots/)
- Plus is listed at $20 a month, and web billing supports EUR in the EEA — [usecarly, 2026](https://www.usecarly.com/blog/chatgpt-dots/)
- ChatGPT Go ($8, ad-supported) has been available in the EU since Jan 2026 — [SentiSight, 2026](https://www.sentisight.ai/ai-price-comparison-gemini-chatgpt-claude-grok/)

#### Anthropic
- **Claude Pro in Germany:** €18 a month excluding VAT, or €15 a month excluding VAT on annual billing (about €17.85 gross) — [Kirsten Biema, 2026](https://www.kirstenbiema.com/en/blog/was-kostet-claude/); [ai-handwerk.de, 2026](https://ai-handwerk.de/claude-vs-chatgpt-2026/)
- **Claude Max:** 5x from $100 a month, 20x at $200 (USD) — [SentiSight, 2026](https://www.sentisight.ai/ai-price-comparison-gemini-chatgpt-claude-grok/)
- **Fable 5 access on subscriptions:** included for up to 50% of weekly usage limits until 7 Jul 2026, and afterwards only via usage credits. API pricing is $10 / $50 per million input/output tokens — [Anthropic, 2026-07](https://www.anthropic.com/news/redeploying-fable-5) [R]; [Anthropic, 2026-06-09](https://www.anthropic.com/news/claude-fable-5-mythos-5) [R]

#### Google
- **Plans:** AI Pro $19.99 (US). AI Ultra from $100 (5x) up to $200 (20x) — [The Rundown, n.d.](https://www.therundown.ai/tools/gemini-spark)
- **Spark access:** in the US from AI Pro; in other countries only with AI Ultra (about $100) — [AI Agents Library, 2026](https://www.aiagentslibrary.com/blog/is-gemini-spark-free/)

#### Microsoft
- **Per-seat prices** — [SAMexpert, 2026](https://samexpert.com/agent-365/); [Kesslernity, 2026](https://www.kesslernity.com/blog/m365-copilot-agents-cost-model); [Microsoft pricing, living doc](https://www.microsoft.com/en-us/microsoft-365-copilot/pricing):
  - Microsoft 365 Copilot: $30 per user per month.
  - Copilot Business: $21 per user.
  - Agent 365: $15 per user, or included in Microsoft 365 E7 at $99 per user per month.
- **Autopilot:** billed in Copilot Credits on top of the licence; no specific price published — [Technology.org, 2026-09-28](https://www.technology.org/2026/09/28/microsoft-copilot-code-autopilot-agent-office/)
- **Consumer:** Microsoft 365 Premium includes Tasks, Analyst and Researcher (search summary) — [Microsoft Support FAQ, living doc](https://support.microsoft.com/en-us/microsoft-365-copilot/frequently-asked-questions-about-copilot-in-microsoft-365-subscriptions)

#### Perplexity
- **Max:** $200 a month or $2,000 a year, with 10,000 credits a month plus 35,000 bonus credits. Pro users received 4,000 free Computer credits; extra credits cost $1 per 100 — [Cybernews, 2026](https://cybernews.com/ai-tools/perplexity-computer-review/)
- **Germany:** Max costs about €175–184 a month (FX plus VAT) — [schieb.de, 2026](https://www.schieb.de/perplexity-computer-19-ki-modelle-arbeiten-gleichzeitig-fuer-dich-aber-das-hat-seinen-preis); [Alexander Peterhihler, 2026](https://www.alexanderpeterhihler.com/artikel/was-kostet-perplexity-computer/)
- **Conflict on who gets Computer:** some sources say Max only, with no trial — [LowCode Agency, 2026](https://www.lowcode.agency/blog/perplexity-computer-review). Others say it is available on Pro and Max — [schieb.de](https://www.schieb.de/perplexity-computer-19-ki-modelle-arbeiten-gleichzeitig-fuer-dich-aber-das-hat-seinen-preis)

#### xAI, Genspark, Lindy, Poke, Zo, Opera, Amazon, Meta
- **xAI Grok Bot:**
  - No standalone price; bundled with SuperGrok ($30), SuperGrok Plus ($100), SuperGrok Heavy ($300), Cursor Pro ($20), Pro+ ($60), Ultra ($200) and Teams.
  - The beta started only on the top plans; since 26 Aug 2026 it is included in every SuperGrok, Cursor Pro and Cursor Teams plan (aggregators; announced by the company as "SpaceXAI").
  - Sources: [justinmckelvey.com, 2026](https://justinmckelvey.com/blog/grok-bot); [AI Builder Club, 2026](https://www.aibuilderclub.com/blog/grok-bot-pricing)
- **Genspark:** Free (100 credits a day); Plus $24.99 a month ($19.99 annual) for 10,000 credits; Pro $249.99 a month for 125,000 credits — [Genspark Help Center, living doc](https://www.genspark.ai/helpcenter/membership-plans); [Fello AI, 2026](https://felloai.com/genspark-ai-pricing/)
- **Lindy:** Plus $29.99 (3,000 credits), Pro $99.99 (15,000), Max $199.99 (35,000). There is no free plan, only a 7-day trial — [nocode.mba, 2026](https://www.nocode.mba/articles/lindy-ai-pricing); [usecarly, 2026](https://www.usecarly.com/blog/lindy-ai-pricing/)
- **Poke:** free tier, Pro $19 a month, Ultra $199 a month — [usecarly, 2026](https://www.usecarly.com/blog/poke-alternatives/)
- **Zo Computer:** $18 a month — [Cerebral Valley, n.d.](https://cerebralvalley.beehiiv.com/p/zo-computer-is-your-personal-ai-cloud-computer)
- **Opera Neon:** $19.90 a month for the Standard plan — [Toolchase, 2026](https://toolchase.com/tool/opera-neon/). Since Aug 2026 the browser is a free download, and connecting your own agents is free — [Opera, 2026-08](https://blogs.opera.com/news/2026/08/your-ai-agents-can-use-opera-neon-free-of-charge/)
- **Alexa+ (Germany):** free during early access until at least 15 Sep 2026; afterwards included with Prime, or €22.99 a month without Prime. A Prime price rise is not planned "as things stand" — [ifun.de, 2026-05](https://www.ifun.de/alexa-jetzt-auch-in-deutschland-bis-zum-15-september-kostenlos-279257/); [Macerkopf, 2026-05-07](https://www.macerkopf.de/2026/05/07/alexa-startet-in-deutschland-mit-kostenloser-testphase-bis-september/)
- **Meta Muse:** $20 and $100 tiers (US) — [Tech Insider, 2026-09](https://tech-insider.org/meta-muse-personal-ai-agent-launch-2026/)

### Inferences
- **The "always-on agent" price point has converged at about $100 a month** (ChatGPT Pro 100 with Dots, Google AI Ultra 5x for Spark outside the US, SuperGrok Plus, Lindy Pro, Meta Muse's upper tier). Heavy-use tiers sit at $200–500.
- **For a German private user who wants an always-on agent today**, the realistic paid options are:
  - ChatGPT Business with two seats, if they want Dots
  - Claude Pro or Max (Cowork scheduled tasks, Claude Code routines)
  - Perplexity Max (about €175–184)
- **Credits make budgets unpredictable.** Usage-credit models now dominate the top features (Fable 5, Perplexity Computer, Autopilot, Genspark, Lindy), so costs scale with how long and how much the agent runs.

### Gaps
- Official EUR prices for ChatGPT Pro 100/500 and Business Premium, Claude Max, Google AI Pro/Ultra, Microsoft 365 Premium and Copilot, SuperGrok, Genspark, Lindy and Manus were not verified on vendor pages, because those pages were blocked or not checked.
- Manus 2026 pricing was not found.
- The status of Alexa+ in Germany after 15 Sep 2026 (whether it moved to Prime-only or general availability) was not found.

## Key Question 5: Are they available in Germany/EU, and what are the GDPR/DSGVO aspects?

### Takeaway
As of early Oct 2026, the **most autonomous consumer agents are largely unavailable in Germany and the EU**:
- OpenAI Dots via ChatGPT Pro (EEA, UK and Switzerland excluded)
- Google Gemini Spark and Gemini in Chrome's auto browse
- Apple Siri AI on iPhone and iPad (blocked over the DMA)
- Meta Muse
- Microsoft's Browse with Copilot (US only)

**What German users can get:**
- Anthropic's Claude Cowork and Claude Code (no regional restriction found)
- Perplexity Comet and Computer
- Microsoft Copilot Cowork (enterprise)
- Alexa+ (early access)
- ChatGPT's business route (Business Premium includes Dots)

**GDPR/DSGVO:**
- Enterprise channels are the main route to data-processing agreements and EU data residency (e.g., Google's Gemini Enterprise Agent Platform with EU processing).
- China-hosted agents (Kimi chat) lack a legal basis for EU data transfers.

### Cited Findings
- **OpenAI Dots:** the Pro rollout excludes the EEA, Switzerland and the UK. Business Premium is listed as available in all supported ChatGPT regions, so the EU route is a Business workspace with at least two seats (consistent across several aggregators; no official OpenAI statement reached) — [eesel, 2026-10](https://www.eesel.ai/blog/openai-dots-pricing); [preuve.ai "Pro Blocked in EU", 2026-10](https://preuve.ai/blog/chatgpt-dots); [usecarly, 2026](https://www.usecarly.com/blog/chatgpt-dots/); [SmartScope, 2026](https://smartscope.blog/en/blog/openai-dots-regional-availability-2026/)
- **Trending Topics** (Vienna-based tech outlet) headline: "A Continent Without A.I. Agents: Europe Has to Wait for Dots, Muse and Siri AI" (content not accessed) — [Trending Topics, 2026-10](https://www.trendingtopics.eu/dots-muse-siri-ai-europe/)
- **Gemini Spark:** unavailable in the EEA, UK, Switzerland and Nigeria, and "Google has given no reason". Spark's Chrome control (from 30 Jul 2026) also excludes Germany and the EEA — [The Next Web, 2026](https://thenextweb.com/news/gemini-spark-not-in-europe); [Basic Tutorials, 2026-08](https://basic-tutorials.com/news/gemini-spark-now-runs-on-chrome-but-germany-is-left-out/)
- **Gemini in Chrome:**
  - Not yet available in the EU as of 23 May 2026; auto browse is US-only. The author attributes the delay to the DSA, DMA and AI Act (author's speculation) — [pasqualepillitteri.it, 2026-05](https://pasqualepillitteri.it/en/news/3256/gemini-in-chrome-skills-how-they-work-countries-availability)
  - Some users in Germany on the Canary build received it — [TestingCatalog on Threads, 2026](https://www.threads.com/@testingcatalog/post/DYrkrobjcvY/icymi-gemini-in-chrome-is-now-available-to-some-users-in-europe-i-finally-got/)
  - Gemini "Personal Intelligence" is rolling out in Europe, and an EU "Gemini Agent" is reportedly coming — [NPowerUser, 2026](https://nokiapoweruser.com/gemini-personal-intelligence-europe-rollout/)
- **Google enterprise data residency:** as of 20 Sep 2026, the Gemini Enterprise Agent Platform documents data residency at rest and machine-learning processing in the EU multi-region for current Gemini models (3.8/3.7/3.6 Flash, 3.5 Flash-Lite) — [Google Cloud release notes, 2026-09](https://docs.cloud.google.com/gemini-enterprise-agent-platform/release-notes)
- **Apple Siri AI:**
  - Delayed in the EU on iPhone, iPad and Apple Watch because of the DMA; available in the EU on macOS 27 and visionOS 27; no timeline.
  - Apple's proposed "Trusted System Agent" compromise was rejected by the European Commission.
  - Sources: [Apple Newsroom, 2026-06](https://www.apple.com/newsroom/2026/06/due-to-dma-siri-ai-delayed-in-eu-for-ios-27-and-ipados-27/); [Michael Tsai, 2026-06-10](https://mjtsai.com/blog/2026/06/10/no-siri-ai-in-eu/); [The Mac Observer, 2026-09](https://www.macobserver.com/tips/round-ups/siri-ai-not-available-eu-iphone-dma/)
- **Meta Muse:** not available in the UK or EU as of 30 Sep 2026. One analysis notes "no launch date, no DPA" (DPA = data processing agreement) — [madrobot.blog, 2026-09-25](https://madrobot.blog/2026/09/25/meta-muse-uk-release-date/); [usecarly, 2026-09](https://www.usecarly.com/blog/meta-muse-availability/); [Technspire, 2026](https://technspire.com/en/blog/muse-and-the-eu-no-launch-date-no-dpa-and-your-options)
- **Microsoft:**
  - Browse with Copilot (Edge agent) is US-only — [TestingCatalog, 2026-05](https://www.testingcatalog.com/microsoft-expands-copilot-in-edge-with-ai-tools-for-web-and-mobile/)
  - Copilot Cowork is generally available, including in the EU, according to a Dutch partner — [universal.cloud, 2026](https://universal.cloud/en/blog/article/microsoft-copilot-cowork/)
- **Amazon Alexa+:** in Germany since 7 May 2026 (early access). Content partners include ARD, BILD, Der Spiegel and more than 1,000 local radio stations — [heise, 2026-05-07](https://www.heise.de/news/Alexa-startet-in-Deutschland-in-den-oeffentlichen-Vorabtest-11285123.html); [Deskmodder, 2026-05-07](https://www.deskmodder.de/blog/2026/05/07/alexa-startet-in-deutschland-amazon-bringt-ki-assistenten-in-den-alltag/)
- **Perplexity Computer:** German-language coverage lists EUR prices and German availability — [schieb.de, 2026](https://www.schieb.de/perplexity-computer-19-ki-modelle-arbeiten-gleichzeitig-fuer-dich-aber-das-hat-seinen-preis). Comet has been "available to everyone worldwide" since Oct 2025 (older) — [Perplexity, 2025-10](https://www.perplexity.ai/hub/blog/comet-is-now-available-to-everyone-worldwide)
- **Anthropic:**
  - The Cowork help page lists plan and platform availability without any regional restriction — [Claude Help Center](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork) [R]
  - US export controls led to a global suspension of Fable 5 for all users from 12 Jun to 1 Jul 2026 — [Anthropic, 2026-07](https://www.anthropic.com/news/redeploying-fable-5) [R]
- **Chinese agents and GDPR:**
  - For Kimi chat, the controller is Beijing Moonshot Technology and data is stored in the PRC.
  - The EU has no adequacy decision for China or Singapore, so transfers need Art. 46 GDPR safeguards, which neither privacy policy names.
  - The author recommends open weights hosted in a European data centre instead.
  - Source: [collectivebrain.de, 2026-08](https://collectivebrain.de/kimi-k3-dsgvo-china-modell-unternehmen-2026/)
- **Manus:** its separation from Meta was framed as necessary "to comply with regulatory requirements in specific parts of the world" — [Yahoo Finance SG, 2026-08](https://sg.finance.yahoo.com/news/manus-resume-independent-operations-unwind-071844539.html)
- **ChatGPT ads in Europe** (privacy context): ads expanded across Europe, with 31 countries able to buy ads from Aug 2026, while Brussels considers tougher oversight — [OpenAI, 2026-08](https://openai.com/index/chatgpt-ads-expands-across-europe/); [EU Perspectives, 2026-08](https://euperspectives.eu/2026/08/chatgpt-ads-enter-europe-eu-scrutiny/); [Cittago, 2026](https://cittago.com/blog/chatgpt-ads-europe-2026/)

### Inferences
- **The EU gap is now the defining difference for German users.** The agent tier that most resembles a self-hosted 24/7 assistant (Dots via Pro, Spark, Muse) is gated out of the EEA, while lower-autonomy features (chat, scheduled tasks, Cowork, Comet) are available.
- **Stated reasons differ by vendor:**
  - Apple: explicitly the DMA.
  - Google: none given.
  - Meta: a history of regulator negotiations (DPA questions).
  - OpenAI: not found.
  - GDPR and AI Act compliance for always-on agents that monitor inboxes and act on saved passwords is a plausible but unconfirmed driver.
- **The enterprise route is the EU route.** ChatGPT Business Premium, Microsoft 365 / Copilot Cowork and Gemini Enterprise offer data-processing agreements and (for Google) EU data residency. Consumer plans offer neither EU residency nor admin governance.
- **Regulatory exposure cuts both ways.** Even EU-available services can be interrupted by non-EU regulation (US export controls on Fable 5, Chinese merger control on Manus).

### Gaps
- No official OpenAI statement explaining the Dots EU exclusion was reached; ChatGPT Work's EU availability was not confirmed by a primary source.
- Anthropic's 2026 EU data-residency and data-processing options were not researched.
- Microsoft EU Data Boundary coverage for Autopilot and Copilot Tasks is unknown.
- **EU availability and GDPR terms unknown for:** Grok Bot (xAI), Genspark, Lindy, Poke, Zo, Manus and MiniMax.
- The status of Alexa+ in Germany after 15 Sep 2026 is unknown.
- No German data-protection authority (DSK, BfDI or state DPAs) statements on hosted always-on agents were found in this round.

## Key Question 6: How do these commercial assistants compare with self-hosted harnesses (Hermes Agent, OpenClaw)?

### Takeaway
By October 2026 the big vendors have productized most of what made self-hosted harnesses attractive:
- 24/7 operation in a cloud computer (Dots, Spark, Grok Bot, Autopilot, Claude routines)
- scheduled and standing tasks
- access via messaging apps (Dots promised Slack and other messaging apps; Lindy and Poke via iMessage/SMS; Claude Code Channels via Telegram/Discord/iMessage)
- bridges into your own machine (Claude Dispatch, Remote Control, Channels; Opera Neon's MCP bridge, which even works with OpenClaw)

**Remaining differentiators of self-hosting:**
- where code and data run (your hardware vs. vendor cloud)
- who sets the guardrails (you vs. vendor defaults and admins)
- EU availability (no vendor gating)
- protection from vendor churn
- deep access to your own server and files

**What hosted products offer in return:** less maintenance and vendor-managed security, at the cost of pricing tiers and regional gating.

### Cited Findings
- **24/7 operation without your device is now offered commercially:**
  - Dots "can work 24/7" with their own computer — [Neowin, 2026-09](https://www.neowin.net/news/openai-announces-dots-a-new-type-of-always-on-ai-agent-for-chatgpt-users/)
  - Spark keeps working after you close the laptop or lock the phone — [DataCamp, 2026](https://www.datacamp.com/blog/gemini-spark)
  - Grok Bot finishes jobs while the laptop is off — [Interesting Engineering, 2026-08](https://interestingengineering.com/ai-robotics/xai-grok-bot-computer-agent)
  - Autopilot runs in the cloud, so Copilot does not need to stay open — [Technology.org, 2026-09-28](https://www.technology.org/2026/09/28/microsoft-copilot-code-autopilot-agent-office/)
  - Claude Cowork scheduled tasks and Claude Code cloud routines run without your machine — [Claude Help Center](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork) [R]; [Claude Code Docs](https://code.claude.com/docs/en/scheduled-tasks) [R]
  - Zo offers a continuously running hosted Linux server — [Cerebral Valley, n.d.](https://cerebralvalley.beehiiv.com/p/zo-computer-is-your-personal-ai-cloud-computer)
- **Messaging-app and alternative-channel access:**
  - Dots: Slack and other messaging apps "in the coming weeks" — [Neowin](https://www.neowin.net/news/openai-announces-dots-a-new-type-of-always-on-ai-agent-for-chatgpt-users/)
  - Spark: tasks via a dedicated Gmail address — [The Next Web](https://thenextweb.com/news/google-gemini-spark-agentic-assistant-gmail-io-2026)
  - Lindy: iMessage and SMS — [usecarly](https://www.usecarly.com/blog/lindy-ai-pricing/)
  - Poke: iMessage, SMS and Telegram — [layer3labs](https://www.layer3labs.io/guides/poke-ai-explained)
  - Claude Code Channels: Telegram, Discord and iMessage, but only into a running local session, and still a research preview — [Claude Code Docs: Channels](https://code.claude.com/docs/en/channels) [R]
- **Access to your own computer:**
  - Claude Cowork can reach local files and your browser through the desktop app — [Claude Help Center](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork) [R]
  - Dispatch runs phone-initiated tasks on your machine — [Build to Launch](https://buildtolaunch.substack.com/p/what-is-claude-cowork)
  - Remote Control drives a local Claude Code session from the mobile app — [Claude Code Docs: Channels](https://code.claude.com/docs/en/channels) [R]
  - Opera Neon lets external agents, including **OpenClaw**, act in your real browser via MCP or CLI — [Opera, 2026-08](https://blogs.opera.com/news/2026/08/your-ai-agents-can-use-opera-neon-free-of-charge/); [Digital Trends](https://www.digitaltrends.com/computing/operas-latest-update-turns-it-into-an-autonomous-browsing-agent-for-chatgpt-and-claude/)
- **Customization:**
  - Grok Bot's "teach-a-task" turns a screen recording into a skill — [Interesting Engineering](https://interestingengineering.com/ai-robotics/xai-grok-bot-computer-agent)
  - Claude Code: `loop.md`, skills, plugins and your own channel servers — [Claude Code Docs](https://code.claude.com/docs/en/scheduled-tasks) [R]; [Channels](https://code.claude.com/docs/en/channels) [R]
  - Gemini Enterprise can import A2A and ADK agents — [Google Cloud release notes](https://docs.cloud.google.com/gemini/enterprise/docs/release-notes)
  - Copilot has a plugin registry under Agent 365 governance — [Dymesty](https://dymesty.com/blogs/articles/microsoft-copilot-autopilot-today)
- **Data ownership and control limits of hosted agents:**
  - Cowork sessions and files are stored in the vendor account — [Claude Help Center](https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork) [R]
  - Features are gated by region (see Key Question 5) and can be retired or suspended by the vendor or regulators (see Key Question 3).
  - Open-weights models (Kimi K3, released 27 Jul 2026) enable EU-hosted self-operation: "the path that works without legal contortions runs through open weights and a European data center" — [collectivebrain.de, 2026-08](https://collectivebrain.de/kimi-k3-dsgvo-china-modell-unternehmen-2026/)
- **Guardrail philosophy:**
  - Hosted consumer agents gate money and messages by default (Copilot Tasks, Spark, Claude in Chrome) — [Windows Central](https://www.windowscentral.com/artificial-intelligence/microsoft-copilot/microsoft-just-launched-a-to-do-list-tool-that-completes-itself-using-ai-introduces-copilot-tasks); [DataCamp](https://www.datacamp.com/blog/gemini-spark); [Claude blog](https://claude.com/blog/claude-for-chrome) [R]
  - Developer tools allow fully unattended modes: routines with no prompts; `--dangerously-skip-permissions` "only in environments you trust" — [Claude Code Docs](https://code.claude.com/docs/en/channels) [R]

### Inferences

High-level comparison (researcher's assessment; the self-hosted column describes typical traits and should be checked against the self-hosted research notes):

| Dimension | Hosted commercial agents (Oct 2026) | Self-hosted harness (Hermes Agent / OpenClaw type) |
|---|---|---|
| 24/7 operation | Yes for the top tier (Dots, Spark, Grok Bot, Autopilot, Claude routines); often preview-only or top plans | Yes, if you run a server or always-on machine |
| Messaging-app access | Emerging: Dots (Slack, promised), Lindy/Poke (iMessage/SMS), Claude Code Channels (research preview, local session) | Typically core design (Telegram, WhatsApp, etc.) |
| Access to your own computer/server | Indirect bridges (Dispatch, Remote Control, Channels, Opera Neon MCP, Chrome extensions); otherwise vendor VMs | Direct: shell, files, local network |
| Customization | Skills/plugins/connectors within vendor limits; model choice fixed by vendor (except Perplexity's multi-model) | Full: any model (incl. EU-hosted or local open weights), any tool |
| Guardrails | Vendor defaults (money/messages/deletion gates) plus admin governance; not fully removable in consumer tiers | Entirely your responsibility; prompt-injection risk applies equally |
| Data ownership / GDPR | Data in vendor cloud (mostly US); EU residency mainly via enterprise plans; Chinese agents store in the PRC | Can stay on your own or EU infrastructure, but model API calls may still leave the EU |
| EU/DE availability | Most autonomous consumer tiers gated out of the EEA (Dots via Pro, Spark, Muse, Siri AI on iPhone) | No vendor gating |
| Continuity | Vendor churn (agent, Pulse, Atlas, Mariner retired; Fable 5 suspended) | Depends on your maintenance and project health |
| Cost model | Subscription ($20–500/month) plus credits | Server plus model API or GPU costs; maintenance time |
| Reliability evidence | Model benchmarks high; product-level independent tests missing | Same underlying models, so similar limits; reliability depends on your setup |

- **Gap to the EU user:** for a German user in Oct 2026, the commercial products that come closest to an OpenClaw-style always-on assistant and are actually available are:
  - Claude (Cowork scheduled tasks, Claude Code routines and Channels)
  - ChatGPT (Work plus scheduled tasks; Dots only via Business Premium)
  - Perplexity Computer
  - (for businesses) Microsoft Copilot Cowork
- **What only self-hosting offers today:** for "24/7 agent on my own server, reachable via WhatsApp/Telegram, with EU-only data processing", self-hosted harnesses (combined with EU-hosted or local models) remain the only option without vendor or regional constraints. The trade-off is that the user owns the security risk, especially prompt injection.

### Gaps
- No study or hands-on test was found that directly compares the hosted agents with OpenClaw or Hermes on the same tasks.
- Total cost of ownership for self-hosting was not covered here (other researchers).
- Whether Dots' promised messaging integration will include WhatsApp or Telegram (not just Slack) is unknown.
