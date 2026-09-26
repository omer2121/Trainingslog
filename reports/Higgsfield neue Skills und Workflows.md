# Higgsfields neue Skills bedienen deine Programme

Higgsfields „neue Skills und Workflows" sind weder neue Videomodelle noch neue Claude-Code-Skills, sondern **sieben lokale MCP-Brücken**, die Higgsfield-Mitarbeiter zwischen dem 10. und 23. September auf npm veröffentlicht haben ([npm](https://www.npmjs.com/search?q=higgsfield)): Mit ihnen bedienen Claude oder ChatGPT After Effects, Premiere Pro, Photoshop, Illustrator, DaVinci Resolve Studio, TouchDesigner und Blender direkt und hinterlassen bearbeitbare Projekte statt fertiger Clips, während das offizielle Skill-Paket seit dem 11. September bei Version 0.12.0 und die CLI bei 1.1.26 stehen. An meiner Hauptempfehlung ändert das nichts: **Resolve Studio bleibt für Claude der bessere Schnittplatz als Adobe**, denn Higgsfields Premiere-Brücke montiert nur, ohne Effekte, Übergänge oder Untertitel, und die neue Resolve-Brücke arbeitet nur auf der Color-Seite von Studio 21.1. Am meisten gewinnt dein Ablauf bei **Blender**, dessen neue Skills Greybox und Kameraplanung übernehmen, und, falls du Effekte baust, bei zwei neuen VFX-Skills für After Effects, beides allerdings in Version 0.x und ohne unabhängigen Qualitätsnachweis, der Blender-Server zudem nur auf dem Mac verifiziert. Auf X und YouTube zeigt fast nur Higgsfield selbst Ergebnisse, zehn Demo-Posts in rund 28 Stunden nach dem Start von Claude Opus 5.5, und keiner nennt Credits, Versuche oder Prompts; angesehen habe ich **kein einziges Video**, weil X, YouTube und higgsfield.ai gesperrt waren und die Repositories keine Demovideos enthalten. Dringender als die neuen Skills sind drei dokumentierte Pannen, die deine Arbeitsanweisung ändern: Der gehostete MCP bucht beim Absenden ohne Obergrenze ab (eine Wiederholungsschleife kostete einen Nutzer am 22. September **792 Credits**, [#95](https://github.com/higgsfield-ai/cli/issues/95)), die CLI verwirft stillschweigend alles nach der ersten Leerzeile eines Prompts ([#94](https://github.com/higgsfield-ai/cli/issues/94)), und der dokumentierte Installationsweg der Skills für Claude Code ist kaputt ([PR #7](https://github.com/higgsfield-ai/skills/pull/7)). Dazu kommt ein Pflicht-Update des Resolve-Community-Servers auf **mindestens 4.8.20**, weil ältere Versionen ein „false" als „true" lasen ([CHANGELOG](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/CHANGELOG.md)). Die korrigierte, getestete Vorlage „Version 2" steht vollständig im Abschnitt „Die Arbeitsanweisung Version 2 zum Kopieren".

## Sieben App-Brücken sind Higgsfields eigentliche Neuheit

Wer auf X von Higgsfields neuen Skills liest, erwartet ein neues Skill-Paket, doch das hat sich nicht bewegt. Das Repository `higgsfield-ai/skills` steht bei **Version 0.12.0**. Sein letzter Merge vom 11. September stellte nur die Standards auf GPT Image 2.5 und Seedance 2.5 um ([Commits](https://github.com/higgsfield-ai/skills/commits/main)), und die CLI ist seit dem 18. September bei **1.1.26** ([npm](https://www.npmjs.com/package/@higgsfield/cli)). Neu ist etwas anderes. Am 22. und 23. September veröffentlichten Higgsfield-Konten auf npm fünf neue lokale MCP-Server für Premiere Pro, Photoshop, Illustrator, DaVinci Resolve Studio und TouchDesigner und erweiterten die Server für After Effects und Blender stark ([npm](https://www.npmjs.com/search?q=higgsfield)). Vermarktet wird das als „Production Skills Bundle" mit elf Skills wie Shot-Cleanup, Shot-Composer, Vectorize, Image-fixer oder color-grading, das „can be run from ChatGPT or Claude" ([Higgsfield](https://higgsfield.ai/mcp/bundles/production-skills)). Schon am 11. September startete der **AI Motion Designer**, ein ChatGPT-Plugin für After Effects. Er setzt Abos bei Higgsfield, OpenAI und Adobe voraus und rechnet Credits „at the same rates as the web platform" ab ([Higgsfield](https://higgsfield.ai/ai-motion-designer); [X](https://x.com/higgsfield/status/2098409362041753708)). Den Start von Claude Opus 5.5 am 22. September begleitete Higgsfield mit „Introducing Higgsfield x Claude Opus 5.5" ([X](https://x.com/higgsfield/status/2102451022216179935)).

Alle Brücken folgen demselben Muster. Sie laufen als lokaler Prozess neben dem Programm und bieten einen Katalog typisierter Operationen, gebündelte Offline-Skills und eine Statusabfrage; eingerichtet werden sie mit den Befehlen `doctor`, `config` und `probe`. **Keine von ihnen erzeugt selbst Bilder oder Videos.** Der Blender-Server hat laut eigenem Skill „no model catalog, estimate, generation, polling or download tools" und greift für Generierungen auf „an already connected Higgsfield service" zurück ([fnf-blender-mcp 0.2.2](https://registry.npmjs.org/fnf-blender-mcp/-/fnf-blender-mcp-0.2.2.tgz)). Credits kosten die Brücken selbst also nicht, sie brauchen aber die Lizenzen der Programme, und jede Generierung läuft weiter über CLI oder gehosteten MCP. Weil es lokale Prozesse sind, funktionieren sie nur in Claude Code oder Claude Desktop auf dem Rechner, auf dem das Programm läuft: „A remote web client cannot directly launch this local stdio process" ([fnf-after-effects-mcp 0.1.3](https://registry.npmjs.org/fnf-after-effects-mcp/-/fnf-after-effects-mcp-0.1.3.tgz)).

| Brücke (npm, Stand 23.9.) | Voraussetzung | Was Claude damit kann | Harte Grenze laut Hersteller |
|---|---|---|---|
| After Effects, `fnf-after-effects-mcp` 0.1.3 | AE auf macOS oder Windows, Node 24, kein Higgsfield-Konto | Kompositionen, Ebenen, Keyframes, Expressions, Einzelbild-Render; 13 Skills, neu `ae-cleanup` und `ae-matte-painting` | „A timed-out operation may still have run"; Sammelbefehle ohne Rollback ([npm](https://www.npmjs.com/package/fnf-after-effects-mcp)) |
| Blender, `fnf-blender-mcp` 0.2.2 | Blender ab 4.2 als Hintergrundprozess, kein Add-on; verifiziert nur auf macOS mit Apple-Chip | Szene, Kamera, Licht, Keyframes, Render, Python; 17 Skills, darunter Greybox, Kamerablocking, stilisierte Materialien, Zerstörung | Python „not sandboxed"; keine Generierung ([npm](https://www.npmjs.com/package/fnf-blender-mcp)) |
| Premiere, `@higgsfield_org/premiere-mcp` 0.1.3 | Premiere 26.5.1, auf macOS getestet, Windows experimentell; signierte CEP-Erweiterung | 26 Operationen: Projekt, Import, Bins, Sequenzen, Clips verschieben, Insert, Overwrite, Export; 5 Skills | keine Effekte, Übergänge, Untertitel, MOGRTs, Tempo, Ducking ([Paket](https://registry.npmjs.org/@higgsfield_org/premiere-mcp/-/premiere-mcp-0.1.3.tgz)) |
| Photoshop, `@higgsfield_org/photoshop-mcp` 0.1.2 | Photoshop 27.10, auf macOS getestet | 78 Operationen; `ps-deslop` repariert generierte Orte zu stimmigen Fotos mit bearbeitbaren Ebenen | kein Healing, Clone, Content-Aware oder Generative Fill ([Paket](https://registry.npmjs.org/@higgsfield_org/photoshop-mcp/-/photoshop-mcp-0.1.2.tgz)) |
| Illustrator, `@higgsfield_org/illustrator-mcp` 0.1.2 | Illustrator 30.8.1, auf macOS getestet | 45 Operationen; Vektorisierung | Image Trace braucht eine separate Python- oder JSX-Laufzeit ([npm](https://www.npmjs.com/package/@higgsfield_org/illustrator-mcp)) |
| Resolve, `@higgsfield_org/davinci-resolve-mcp` 0.1.1 | nur **Resolve Studio 21.1** mit Scripting auf „Local" | nur Color-Seite: CDL, LUT, Versionen; Skill `davinci-film-colorist` | keine Rücklesung der CDL-Werte; nach Zeitüberschreitung Schreibsperre ([npm](https://www.npmjs.com/package/@higgsfield_org/davinci-resolve-mcp)) |
| TouchDesigner, `@higgsfield_org/touch-designer-mcp` 0.1.1 | TouchDesigner ab Build 2025.33230 mit Lizenzschlüssel | Effekte wie Glitch, Partikel, audioreaktive Visuals | „does not include Workshop preset execution" ([npm](https://www.npmjs.com/package/@higgsfield_org/touch-designer-mcp)) |

Reif sind die Brücken nicht. Alle stehen bei Version 0.1 oder 0.2, Photoshop, Illustrator und Premiere nennen ausdrücklich „Windows support is experimental" ([Photoshop-MCP](https://www.npmjs.com/package/@higgsfield_org/photoshop-mcp)), und das Quell-Repository ist nicht mehr öffentlich lesbar ([GitHub](https://github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp)). Für den gehosteten MCP gibt es dafür erstmals belastbare Werkzeugnamen, aus Higgsfields eigenem Cursor-Plugin, aus den Skills und aus Fehlerberichten. Generiert wird mit `generate_image`, `generate_video` und `generate_audio`, nachgeschlagen mit `models_explore` und `get_workflow_instructions`, der Jobstatus kommt über `jobs_wait` und `job_status`, dazu gibt es `balance`, `media_upload`, `virality_predictor` und die Erklärvideo-Werkzeuge bis `explainer_video` ([Cursor-Plugin](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/commands/higgs.md); [Erstcommit](https://github.com/higgsfield-ai/cursor-plugin/commit/7d99efb); [Explainer-Skill](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-video-explainer/SKILL.md)). Über `get_workflow_instructions` erreicht Claude serverseitige Standardabläufe für „faceless videos, UGC formats, narration, subtitles, thumbnails, brand kits, and character sheets" und Bearbeitungen wie Upscale, Reframe, Hintergrundentfernung, Motion Control, Voice Change und Dubbing ([Cursor-Plugin](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/commands/higgs.md)). Die viralen Web-Effekte bleiben außen vor. Eine Volltextsuche über alle zehn öffentlichen Higgsfield-Repos, ihre offenen Pull Requests und die npm-Pakete fand weder Earth Zoom noch Bullet Time, Vibe Motion oder die Transitions-App ([Skills](https://github.com/higgsfield-ai/skills); [CLI](https://github.com/higgsfield-ai/cli)). Am nächsten kommen die Presets von Marketing Studio V2 (Hypermotion, Mixed Media, SaaS Motion, 2D Motion, UGC), die zwei noch nicht gemergte Pull Requests von Higgsfield-Mitarbeitern beschreiben. Abrufbar sind sie per `higgsfield preset list marketing-studio-v2 --json`, allerdings erst nach „the corresponding backend rollout" ([PR #89](https://github.com/higgsfield-ai/cli/pull/89); [PR #6](https://github.com/higgsfield-ai/skills/pull/6)). Ob das mit deiner CLI schon klappt, zeigt dir diese kostenlose Abfrage.

Drei Randnotizen vervollständigen das Bild. Die SDKs haben seit dem 17. September eine **Agent API**, die „multi-step creative tasks in persistent sessions" serverseitig abarbeitet ([Python-SDK](https://github.com/higgsfield-ai/higgsfield-client/blob/main/README.md)); das JavaScript-SDK markiert sie als „V2 preview" ([JS-SDK](https://github.com/higgsfield-ai/higgsfield-js/blob/main/README.md)), und Kosten pro Durchgang nennt Higgsfield nicht. Das schon im Juli erschienene `hf-api` meldet sich per API-Schlüssel an ([npm](https://www.npmjs.com/package/@higgsfield/cloud-cli)) und wäre damit ein Weg für unbeaufsichtigte Läufe, für die sich die kurzlebige Browser-Anmeldung der normalen CLI schlecht eignet; ob es dieselben Plan-Credits nutzt, ist nicht dokumentiert. Neu sind außerdem ein Studio-App-Template vom 25. September und ein Backend-Dienst für ein noch nicht angekündigtes „Soul Voice" ([app-templates](https://github.com/higgsfield-ai/app-templates); [soul-voice-service](https://github.com/higgsfield-ai/soul-voice-service)). Die Richtung ist eindeutig: Higgsfield will nicht mehr nur Clips liefern, sondern Agenten, die deine Programme bedienen und ein bearbeitbares Projekt hinterlassen.

## Auf X und YouTube zeigt fast nur Higgsfield selbst Ergebnisse

Nach dem Start von Opus 5.5 veröffentlichte @higgsfield_ai in rund 28 Stunden zehn Posts, und alle acht, deren Text lesbar war, zeigen Demovideos. Darunter waren ein in Blender gebauter Shinkansen aus „5,112 separate objects … down to all 430 seats" ([X](https://x.com/higgsfield_ai/status/2102507018372436264)), ein „AAA-quality, game-ready octopus" ([X](https://x.com/higgsfield_ai/status/2102526940859232433)), eine Pixel-Art-Animation mit Punktezähler in After Effects ([X](https://x.com/higgsfield_ai/status/2102548479231082989)) und mehrere Duelle „Claude Opus 5.5 vs GPT-6 Astra" bei Spielen und bei der Beschriftung von Straßenaufnahmen ([X](https://x.com/higgsfield_ai/status/2102471046356177001); [X](https://x.com/higgsfield_ai/status/2102510221797339567)). **Kein einziger dieser Posts nennt Prompt, Laufzeit, verbrauchte Credits oder die Zahl der Versuche.** Das Format „Opus gegen GPT" verkauft Higgsfield als modellneutrale Werkbank, und ein Wettbewerb vom 11. September verlangte ausdrücklich Zitat-Posts mit Nachweis der Plugin-Nutzung ([X](https://x.com/i/status/2098559930014052386)). Die Menge ähnlicher Posts ist deshalb kein unabhängiger Qualitätsbeleg. Auffällig ist, was die Demos zeigen: überwiegend 3D-Modelle, Spiele und Motion Graphics, also Arbeit in Programmen, kaum fotorealistisches Video.

Unabhängige Stimmen sind dünn. @Big_E fand am 12. September, die After-Effects-Steuerung wirke „less like AI replacing creativity and more like AI expediting your own creativity" ([X](https://x.com/Big_E/status/2098924423810072576)). Der Motion Designer Jake Bartlett, der seit 2013 After Effects unterrichtet, prüfte um den 15. September in „Higgsfield AI Motion Designer: I Tested the Claims" die Werbeversprechen; sein Urteil stand in keinem erreichbaren Ausschnitt ([YouTube](https://www.youtube.com/watch?v=QLZNiwaKqWg)). Die verbreiteten Anleitungen zur After-Effects-Steuerung folgen demselben Muster: erst ein Storyboard, dann der Bauauftrag, dann Korrekturen per Folgeprompt ([Chase AI](https://www.chaseai.io/blog/gpt-6-astra-after-effects-motion-design)). Auf YouTube dominieren Titel, die mit gesparten Credits werben, etwa „How To Save AI Credits With Higgsfield + Blender" ([YouTube](https://www.youtube.com/watch?v=OiULPvTJ-0E)) oder „Seedance 2.5: How to Save AI Credits with Blender & Higgsfield" ([YouTube](https://www.youtube.com/watch?v=CZ_FW1QDAxo)). Dazu kommen Opus-5.5-Videos wie „Build a Monster Truck", dessen Beschreibung Higgsfields Werbetext wiederholt ([YouTube](https://www.youtube.com/watch?v=9loDDILgssM)), und der Gegenentwurf „I Let Claude Opus 5.5 Build A CHEAPER Higgsfield AI" ([YouTube](https://www.youtube.com/watch?v=dLHli12cHIs)). Die brauchbarste Schrittfolge stammt weiterhin von JSFILMZ: Claude Desktop baut über Higgsfields Brücke ein graues Blockout, du justierst die Kamerafahrt, renderst einen Playblast in 1080p und gibst ihn Seedance 2.5 als Bewegungsreferenz ([X](https://x.com/JSFILMZ0412/status/2093663876692754713)). Werbekennzeichnungen tauchten in keinem Ausschnitt auf. Das beweist wenig: Ein fehlender Hinweis im Suchausschnitt schließt Bezahlung nicht aus, und Higgsfield hat im August bezahlte Creator-Partnerschaften bestätigt ([Dataconomy](https://dataconomy.com/2026/08/21/youtube-creators-face-backlash-over-ai-partnership-with/)).

Kritik kommt vor allem aus der Fachpresse. Digital Production überschrieb seinen Bericht zum Blender-Add-on am 23. September mit „Oh, goodey" und nennt Higgsfield laut Suchausschnitt eine „cloud AI slop platform", räumt aber ein, dass mehrere Werkzeuge in Blender weiterbearbeitbare Daten liefern ([Digital Production](https://digitalproduction.com/2026/09/23/higgsfield-brings-ai-generation-into-blender-oh-goodey/)). Ein Analyseblog bringt die ganze Opus-Welle auf den Punkt: „Claude Opus 5.5 is not a video-generation model… what the demos demonstrate is long-horizon code generation with a creative brief" ([OrcaRouter](https://www.orcarouter.ai/blog/claude-opus-5-5-product-video-skill)). Die meistgeteilten Claude-Videos der Woche kamen tatsächlich ohne Videomodell aus. @kimmonismus zeigte einen dreiminütigen Film zur KI-Geschichte mit „No stock footage, no image or video generators", gerendert aus rund 7.400 Zeilen Remotion-Code ([X](https://x.com/kimmonismus/status/2102844654169575547)), und @Miguel07Code ließ ein Launch-Video mit HyperFrames in unter 20 Minuten bauen ([X](https://x.com/Miguel07Code/status/2102441708395041170)). Eric Buess fasst nüchtern zusammen: „Claude Opus 5.5 can't generate an image or a video directly. It can write code that draws, animates and edits one" ([X](https://x.com/EricBuess/status/2103226548413182366)). Wenn du auf X „Claude macht Videos" liest, frag deshalb immer, ob Code gerendert oder ein Videomodell gesteuert wurde. Nur Letzteres kostet Credits und liefert fotorealistische Bilder.

### Kein einziges Video gesehen – so wird echte Prüfung möglich

Ich habe keines dieser Videos angesehen. x.com, youtube.com und higgsfield.ai waren für die Recherche gesperrt. Gelesen wurden nur Posttexte und Zusammenfassungen, wie Suchmaschinen sie erfassen, und in den zehn öffentlichen Higgsfield-Repositories und acht npm-Paketen liegt kein Video und kein GIF ([Skills](https://github.com/higgsfield-ai/skills); [CLI](https://github.com/higgsfield-ai/cli); [npm](https://www.npmjs.com/search?q=higgsfield)). Prüfen konnte ich nur Standbilder. Der Screenshot im CLI-Repo zeigt noch die alten Befehle mit `hf` statt `higgsfield` ([demo.png](https://github.com/higgsfield-ai/cli/blob/main/demo.png)). Elf Materialvorschauen des Blender-Skills zeigen denselben Würfel mit Cel-, Manga-, Halftone-, Aquarell- und Neon-Look, sauber gerendert, aber ohne Bewegung ([fnf-blender-mcp 0.2.2](https://registry.npmjs.org/fnf-blender-mcp/-/fnf-blender-mcp-0.2.2.tgz)). Am aufschlussreichsten ist eine Belegkarte des Photoshop-Skills `ps-deslop`. Auf einem Higgsfield-Bild vom 10. September, einem nebligen Bergtempel, markieren farbige Rahmen die glatten Wandflächen, auf die der Skill bei Generator-Artefakten wie Schlieren und wolkigen Flecken zielt ([photoshop-mcp 0.1.2](https://registry.npmjs.org/@higgsfield_org/photoshop-mcp/-/photoshop-mcp-0.1.2.tgz)). Das ist Higgsfields eigene Karte der Stellen, an denen generierte Bilder typischerweise versagen, und sie wird in Version 2 zum Prüfpunkt.

Echte Videoprüfung kannst du auf vier Wegen einrichten. Eine Grenze bleibt auch bei freiem Zugang: Claude versteht kein Video, und auch Opus 5.5 bringt keine Video- oder Toneingabe mit ([Anthropic](https://www.anthropic.com/news/claude-opus-5-5); [Release Notes](https://platform.claude.com/docs/en/release-notes/overview)). Prüfen heißt immer Einzelbilder, Kontaktbögen, Tonmessung und Transkript; Morphing und Flackern siehst nur du in Echtzeit.

| Weg | So richtest du ihn ein | Was Claude dann prüfen kann |
|---|---|---|
| Netzwerk der Cloud-Sitzung öffnen | Im Cloud-Umgebungsmenü in der Titelleiste der Sitzung auf Bearbeiten, dann unter „Network access" eine weitere Zugriffsstufe wählen oder x.com, youtube.com und higgsfield.ai zu den erlaubten Domains hinzufügen ([Claude Code Docs](https://code.claude.com/docs/en/claude-code-on-the-web)) | Posts mit Antworten, Higgsfields Produkt- und Hilfeseiten, Videoseiten und Transkripte |
| Recherche lokal laufen lassen | Claude Code auf deinem PC oder die Chrome-Erweiterung „Claude in Chrome" mit deinem X-Login | Threads samt Antworten, Screenshots an Stellen, die du vorgibst |
| Videos als Datei übergeben | Die wichtigsten Demos als MP4 in einen Projektordner legen (eigene Bildschirmaufnahme oder Download, soweit die Plattformbedingungen es erlauben), dazu das YouTube-Transkript; lokal mit ffmpeg | Kontaktbögen alle 0,5 bis 1 Sekunde, Bildrate, Auflösung, Schnittfrequenz, Tonpegel, Abgleich mit dem Transkript |
| Selbst testen | Eine Brücke an einer Wegwerf-Kopie installieren und die Sitzung aufzeichnen; die lokalen Operationen brauchen kein Higgsfield-Konto ([npm](https://www.npmjs.com/package/fnf-after-effects-mcp)) | Den echten Ablauf mit deinem Material statt einer Werbedemo |

## Resolve bleibt Schnittplatz, Blender bekommt die besten neuen Werkzeuge

An der Grundentscheidung ändert der September nichts. **DaVinci Resolve Studio 21.1 bleibt für Claude der bessere Schnittplatz als Premiere**, After Effects die Ausnahme für Motion Design und Blender die Previs vor der Generierung. Higgsfields Premiere-Brücke verschiebt das nicht, denn ihr Katalog „has no effects, transitions, captions, MOGRTs, transforms, speed, gain automation, music ducking, multicam builder, silence/beat analysis, frame preview". Sie legt Projekte, Bins und Sequenzen an und montiert Clips, braucht dafür lokale Preset-Dateien und warnt selbst: „API success is not visual or audio proof" ([premiere-mcp 0.1.3](https://registry.npmjs.org/@higgsfield_org/premiere-mcp/-/premiere-mcp-0.1.3.tgz)). Sie läuft über eine signierte CEP-Erweiterung, also auf der Technikgeneration, für die Adobe ExtendScript-Support nur „through September 2026" zugesagt hat; eine Verlängerung fand sich bis zum 26. September nicht ([Scripting Guide](https://ppro-scripting.docsforadobe.dev/)). Adobes eigener Claude-Connector heißt jetzt nur noch „Adobe" und passt Premiere-Videos weiterhin nur für soziale Netzwerke an ([Claude-Verzeichnis](https://claude.com/marketplace/connectors-plugins); [Adobe](https://helpx.adobe.com/creative-cloud/apps/integration-with-other-apps/adobe-connectors/adobe-for-claude.html)).

Bei Resolve kommt die wichtigste Neuigkeit nicht von Higgsfield, sondern vom Community-Server **samuelgursky/davinci-resolve-mcp**, der zwischen dem 14. und 23. September rund 40 Versionen bis **v4.8.20** veröffentlichte ([CHANGELOG](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/CHANGELOG.md); [npm](https://registry.npmjs.org/davinci-resolve-mcp)). Die behobene Fehlerklasse ist genau die, die ein KI-Agent auslöst: Viele Befehle lasen den Text `"false"` als wahr. So rippelte `ripple="false"` trotzdem, eine Bereichslöschung mit `allow_partial_item_delete="false"` nahm ganze Clips mit, `stop_render="false"` stoppte ein laufendes Rendering und schloss das Projekt, und `override_governance="false"` hebelte die Schutzregeln aus; vollständig behoben ist das erst in 4.8.20. Außerdem dokumentiert der Changelog, dass `ArchiveProject` mit Medienoptionen Studio 21.1.0.14 in derselben Sekunde abstürzen lässt, in vier von vier Versuchen, wobei ungesicherte Arbeit verloren geht; ein Archiv hat kein Skriptaufruf je erzeugt. Neu ist die Aktion `snapshot`, die Projekt, Spuren, Lücken, Renderstatus und Media Pool in einem Aufruf liefert. Begründet wird sie damit, dass von 8.407 ausgewerteten Agentenaufrufen 2.222 nur den Zustand abfragten; getestet ist sie laut Changelog bisher nur gegen Attrappen (alles [CHANGELOG](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/CHANGELOG.md)). **Meine Empfehlung: Aktualisiere den Server sofort, sperre Archivieren für Claude und nutze `snapshot` zum Zurücklesen, prüf die Ergebnisse anfangs aber von Hand mit.** Eine Resolve-Version nach 21.1 fand sich nicht; Blackmagics Seiten waren allerdings gesperrt.

Higgsfields eigene Resolve-Brücke vom 23. September ist ein Farbwerkzeug, kein Schnittwerkzeug. Sie verlangt Studio 21.1, denn die Gratisversion „may expose the Python module but does not establish Studio scripting access". Sie arbeitet nur auf der Color-Seite mit CDL-Werten, LUTs und Versionen. `dr_set_cdl` kann seine Werte nicht zurücklesen, und nach einer Zeitüberschreitung sperrt die Brücke weitere Änderungen, bis du Resolve geprüft und `dr_acknowledge_uncertain` aufgerufen hast ([davinci-resolve-mcp](https://www.npmjs.com/package/@higgsfield_org/davinci-resolve-mcp)). Interessant ist der mitgelieferte Skill `davinci-film-colorist` mit einer Pipeline in DaVinci Wide Gamut, Kamerareferenzen, Shot-Matching, einem DCTL „HF-Astra-Looks" mit 49 Reglern und fünf Film-LUTs ([Paket 0.1.1](https://registry.npmjs.org/@higgsfield_org/davinci-resolve-mcp/-/davinci-resolve-mcp-0.1.1.tgz)). Ich würde die Brücke als Zusatz für die Grundkorrektur an einer Projektkopie testen. Knoten, Kurven, Masken und der kreative Look bleiben Handarbeit.

In After Effects ist die Neuerung am greifbarsten. Version 0.1.3 des lokalen Servers bringt 13 Skills, darunter neu `ae-cleanup` zum Entfernen von Objekten, Drähten und Schrift und zum Ersetzen getrackter Schilder sowie `ae-matte-painting`. Dieser Skill baut aus Greenscreen-Material ein bearbeitbares VFX-Composite und lässt fehlende Umgebungs-, Objekt- und Effektebenen passend zur Bewegung der Quelle erzeugen ([fnf-after-effects-mcp 0.1.3](https://registry.npmjs.org/fnf-after-effects-mcp/-/fnf-after-effects-mcp-0.1.3.tgz)). Die Skills sind vorsichtiger als ihre Werbung. Sie verlangen eine Kostenschätzung und deine Zustimmung vor der ersten Ausgabe, erlauben „three attempts per generated layer", nie mehr als fünf, und iterieren in der billigsten aussagekräftigen Auflösung; für Bewegtbild setzen sie Seedance 2.5 in 1080p und für Standbilder Nano Banana Pro in 2K ein (alles [ebd.](https://registry.npmjs.org/fnf-after-effects-mcp/-/fnf-after-effects-mcp-0.1.3.tgz)). Brauchst du Effekte an fertigen Clips, ist das der interessanteste neue Baustein, auch wenn seine Qualität nirgends belegt ist. ChatGPT-Nutzer bekommen dieselbe Idee als AI Motion Designer. In Claude richtest du das npm-Paket ein und übernimmst den Eintrag, den `config` ausgibt.

Blender gewinnt am meisten, weil die neuen Skills genau den Previs-Schritt abdecken. Higgsfield bietet dafür jetzt zwei Wege. Das Cloud-Add-on mit „Higgsfield Bridge" (`bridge.higgsfield.ai/mcp`) braucht Blender 5.1, ein Konto und Credits und baut Blockouts direkt in der offenen Szene ([Higgsfield](https://higgsfield.ai/blog/higgsfield-blender-plugin)). Seine Anmeldung scheiterte in einem offenen Fehlerbericht mit Codex, während „Local Blender MCP works" ([#90](https://github.com/higgsfield-ai/cli/issues/90)). Der lokale Server `fnf-blender-mcp` 0.2.2 steuert dagegen einen Blender-Hintergrundprozess ab Version 4.2, ohne Add-on und ohne Konto. Er bringt 17 Skills mit, darunter `blender-greybox` für animierte Greyboxen samt Bewegungsreferenz-Video, `blender-camera-blocking` mit Räumen, 42 Möbelstücken und vier geriggten Figuren, `blender-stylized-materials` und `blender-destruction` ([fnf-blender-mcp 0.2.2](https://registry.npmjs.org/fnf-blender-mcp/-/fnf-blender-mcp-0.2.2.tgz)). Die Kehrseiten stehen im README: Python läuft „not sandboxed", ungesicherte Arbeit in einem offenen Blender erreicht der Server nicht, und verifiziert ist er nur auf dem Mac mit Apple-Chip ([npm](https://www.npmjs.com/package/fnf-blender-mcp)). Der Community-Server heißt inzwischen **mcp-for-blender**. Er sendet ab Werk einen „minimal anonymous usage record" und lässt sich mit `DISABLE_TELEMETRY=true` und `BLENDER_MCP_SAFE_MODE=1` abdichten ([GitHub](https://github.com/ahujasid/mcp-for-blender)). **Meine Empfehlung: Auf einem Mac teste den lokalen Higgsfield-Server für Greybox und Kamera. Unter Windows bleib beim Add-on mit Bridge oder bei mcp-for-blender mit abgeschalteter Telemetrie, bis Windows bestätigt ist.**

Für dein Ziel, ein Video mit Effekten, das Agenten nach deinen Anweisungen weitgehend selbst bauen, heißt das: Die Arbeitsteilung bleibt, Claude produziert und du entscheidest an sechs Freigaben, aber die Effektarbeit rückt näher an den Agenten heran. Runway Aleph und ähnliche Werkzeuge rechnen Pixel neu. Die neuen After-Effects-Skills bauen dagegen Ebenen, Masken und Keyframes, die du nachbessern kannst, und die Blender-Skills legen Kamera und Bewegung fest, bevor ein Credit fließt. Perfekt wird ein Video dadurch nicht automatisch, aber korrigierbar. Die folgende Tabelle zeigt nur die Phasen, in denen sich etwas ändert.

| Phase | Was seit dem 20. September neu ist | Meine Empfehlung |
|---|---|---|
| Previs | `fnf-blender-mcp` 0.2.2 mit Greybox- und Kamera-Skills; mcp-for-blender umbenannt, Telemetrie ab Werk | Mac: lokaler Higgsfield-Server; Windows: Add-on mit Bridge oder mcp-for-blender ohne Telemetrie |
| Generierung | Gehosteter MCP bucht beim Absenden ohne Limit; CLI kürzt Prompts an der ersten Leerzeile | Bezahlte Jobs nur per CLI, Prompt als ein Absatz, MCP nur lesend |
| Technik- und Bildprüfung | Claude Code speichert Bilder aus MCP-Werkzeugen als Dateien; Higgsfields strengere Prüfregeln | Datei dekodieren, Bildstreifen für Bewegung, Flächen-Check, Medienmanifest |
| Effekte | `ae-cleanup` und `ae-matte-painting`; TouchDesigner-Brücke | Nur mit Versuchslimit und Abnahme pro Ebene |
| Grafik | HyperFrames mit Timeline-Befehlen und Probelauf `--plan` | Version im Projekt festschreiben |
| Ton | ElevenLabs Music v2.5 | `music_v2_5` ausdrücklich anfordern |
| Schnitt und Farbe | samuelgursky 4.8.20; Higgsfields Resolve-Brücke für die Color-Seite | Update Pflicht, Archivieren sperren, Higgsfield-Farbe optional |
| Upscaling | Topaz schließt die Astra-Oberfläche am 30. September | Starlight für Fotorealismus, kreatives Upscaling über Topaz for Web |

## Außerhalb von Higgsfield zählen Wartungsupdates mehr als neue Modelle

Ein neues Spitzenmodell kam nicht: Kling 4.0, Seedance 3.0 und Veo 4 sind weiterhin nicht erschienen, die Modellstandards deiner Vorlage gelten also weiter ([Morphic](https://morphic.com/resources/models/kling-4); [LlamaGen](https://llamagen.ai/m/seedance/seedance-3); [Quest Studio](https://queststudio.io/blog/when-is-veo-4-coming-out)). Higgsfields Skill führt neben Seedance 2.5 als Standard drei Optionen, die deine Vorlage bisher nicht nannte: Kling 3.0 Turbo für billige, schnelle Entwürfe, Grok Video 1.5 für stilisiertes Image-to-Video und Gemini Omni Flash für bis zu sieben Bildreferenzen ([SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md)). Geändert hat sich vor allem die Verfügbarkeit. Die Sora-API ist seit dem **24. September** abgeschaltet ([OpenAI](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation)). Gemini Omni 1.1 Flash wird seit dem 23. September schrittweise kostenlos in Google Vids für jedes Google-Konto freigeschaltet, allerdings nur zur Bedienung von Hand ([Google Workspace](https://workspaceupdates.googleblog.com/2026/09/gemini-omni-11-flash-now-in-vids-with-improved-extension-quality-1080p-and-duration-control.html)). Kling bietet einen offiziellen MCP und eine CLI mit denselben Credit-Preisen wie seine Apps, aber ohne kostenlose Generierungen außerhalb der Stoßzeiten und nur mit bezahlten Credits ([Kling](https://kling.ai/app/mcp)). Das ist ein zweiter bezahlter Weg, den dein Budget-Hook sehen muss. Topaz schließt die Astra-Oberfläche am **30. September** und verlegt „most video models and features" nach Topaz for Web; Credits und Dateien ziehen mit um ([Topaz](https://www.topazlabs.com/web/faq)). ElevenLabs Music v2.5 ist die beste von Claude steuerbare Musikoption, doch die API-Endpunkte liefern ohne Angabe weiter `music_v1`, weshalb die offiziellen Skills raten: „Pass `music_v2_5`" ([elevenlabs/skills](https://github.com/elevenlabs/skills/commit/68fff59a24daf7906324b06c494a4d0bead232a0)). Runway rechnet per API jetzt Bildraten zwischen 23,98 und 120 fps um, für einen Credit pro zwei Sekunden ([releasebot](https://releasebot.io/updates/runwayai)); KI-Material auf 60 fps zu interpolieren bleibt trotzdem tabu.

Auf Claudes Seite ist **Opus 5.5** seit dem 22. September das Standardmodell in Claude Code. Es kostet per API 4 statt 5 Dollar pro Million Eingabe-Tokens und 20 statt 25 Dollar für die Ausgabe ([Anthropic](https://www.anthropic.com/news/claude-opus-5-5)). In den Tarifen Pro und Team Standard stellt Claude Code jetzt Opus statt Sonnet ein ([CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)), was lange Blender- oder Resolve-Sitzungen nach meiner Einschätzung schneller an Nutzungsgrenzen bringt. Wichtiger sind vier Änderungen in Claude Code 2.1.274 bis 2.1.283. Aufrufe an gehostete MCP-Server brechen nicht mehr nach rund fünf Minuten ab, wenn ein längerer `timeout` gesetzt ist. Bilder aus MCP-Werkzeugen landen zusätzlich als Datei, sodass Claude Vorschauen aus Blender, After Effects oder Photoshop direkt zu Kontaktbögen verarbeiten kann. Hooks vom Typ `mcp_tool` warten auf ihren Server. Und `/doctor prompt-audit` prüft deine CLAUDE.md auf Formulierungen für ältere Modelle ([CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)). Seit 2.1.275 lädt Claude Code außerdem die Skills deines claude.ai-Kontos ins Terminal. Ist dort Higgsfields Skill aktiv, kommt dessen Regel „Don't pre-estimate cost" ein zweites Mal ins Projekt; abschalten lässt sich das mit `syncClaudeAiSkills: false` (ebd.). In der Claude-App steht seit dem 16. September „everything Claude Cowork does" in jeder Unterhaltung bereit, zuerst für Pro und Max, dazu Designs, Präsentationen und Dokumente in jedem Chat ([Release Notes](https://support.claude.com/en/articles/12138966-release-notes); [Claude Blog](https://claude.com/blog/cowork-is-now-claude)). Deine Unterlagen für die Freigaben F1 bis F3 kann Claude damit direkt als Präsentation oder Dokument liefern. Neue Video- oder Audio-Connectors kamen nicht ins Verzeichnis, und Higgsfield fehlt dort weiterhin ([Claude-Verzeichnis](https://claude.com/connectors/higgsfield)).

Die Aufteilung zwischen App und PC verschiebt sich damit, die Grenze aber nicht: Resolve, Blender und die Adobe-Programme erreicht Claude nur lokal. Für die App gilt zusätzlich ein Vorbehalt. Am 20. September scheiterte jeder Generierungsaufruf über Higgsfields Connector in Claude Desktop mit `params: Invalid input`, während die Nur-Lese-Werkzeuge liefen; zwei Tage später nahm derselbe Server Aufträge aus Claude Code an ([#93](https://github.com/higgsfield-ai/cli/issues/93); [#95](https://github.com/higgsfield-ai/cli/issues/95)).

| Aufgabe | Claude-App (Chat, jetzt mit Cowork-Funktionen) | Claude Code oder Desktop auf dem PC |
|---|---|---|
| Konzept, Shotliste, Prompts, Freigabeunterlagen | ja, auch als Design, Präsentation oder Dokument | ja |
| Higgsfield-Generierung | per Connector; Generieren fiel am 20.9. aus, Lesen lief | ja, über die CLI (empfohlen) |
| Dateien, Kontaktbögen, Technikprüfung | mit den Cowork-Funktionen, Rollout läuft | ja, lokal mit ffmpeg |
| Resolve, Blender, After Effects, Premiere | nein | ja, nur lokal |
| Freigaben vom Handy | ja | ja, über Remote Control |

Bei den Agenten-Werkzeugen bewegt sich HyperFrames am schnellsten, mit 42 npm-Versionen in 13 Tagen ([npm](https://registry.npmjs.org/hyperframes)). Seit dem 20. September versteht es Timeline-Befehle wie `move`, `trim`, `split` und `delete`, die mit `--plan` erst den Vorher-nachher-Vergleich zeigen, ohne etwas zu schreiben ([Commit](https://github.com/heygen-com/hyperframes/commit/f92d017b999d26b14c49a8439dc16d2e476bffde)). Bei diesem Tempo gehört die Version fest ins Projekt. Aus kleineren Claude-Code-Editoren lohnen sich drei Regeln. video-editor-agent prüft die gerenderte Datei auf Bild, Pegel und Schnittkanten statt des Plans, nach dem Motto „verify pixels and dB, not intentions" ([video-editor-agent](https://github.com/krusemediallc/video-editor-agent)). kinocut weist seit Version 1.15.2 Befehle ab, deren Ausgabe die Eingabedatei überschreiben würde ([CHANGELOG](https://github.com/KyaniteLabs/kinocut/blob/master/CHANGELOG.md)). Und der Seedance-Skill von Emily2040 prüft Prompts vor jedem bezahlten Job auf typische Sperrgründe ([Commit](https://github.com/Emily2040/seedance-2.0/commit/7a7c36fedc7e46f7604b06173a54488048fafd54)). Einen Grund, deine Vorlage gegen ein Komplettsystem zu tauschen, liefert keines dieser Projekte.

## 792 Credits in einer Schleife erzwingen die Vorlage Version 2

Die dringendste Änderung betrifft das Geld. Am 22. September schickte ein Nutzer über Claude Code und Higgsfields gehosteten MCP **20 bezahlte Seedance-Aufträge** ab. Elf wurden als fehlgeschlagen erstattet, neun berechnet, zusammen **792 Credits**, und „nothing on the server side could have capped it" ([#95](https://github.com/higgsfield-ai/cli/issues/95)). Die `generate_*`-Werkzeuge buchen beim Absenden ab, bevor der Agent einen Preis sieht. Eine Preisabfrage mit `get_cost: true` gibt es, sie ist aber optional, und die Antwort auf einen Auftrag nennt die abgebuchten Credits nicht. Der Nutzer fordert deshalb eine Obergrenze pro Aufruf, die Kosten in der Antwort und einen Schlüssel gegen doppelte Aufträge (ebd.). Eine ältere Anfrage, ob ein Aufruf genau einen bezahlten Job erzeugt und ob die CLI nach Zeitüberschreitungen selbst wiederholt, ist bis heute unbeantwortet ([#91](https://github.com/higgsfield-ai/cli/issues/91)). Dazu passt, dass Higgsfields eigenes Kochbuch vier bezahlte Marketing-Studio-Jobs parallel startet ([COOKBOOK](https://github.com/higgsfield-ai/skills/blob/main/COOKBOOK.md)). Version 2 zieht daraus drei Konsequenzen: bezahlte Jobs in Claude Code nur über die CLI, kein neuer Auftrag vor geklärtem Status, und ein Hook, der identische Wiederholungen mechanisch blockiert.

Die zweite Panne kostet unsichtbar Qualität. Übergibt man der CLI einen mehrzeiligen Prompt, etwa per `--prompt "$(cat prompt.txt)"`, nutzt sie ohne Warnung nur den Text bis zur ersten Leerzeile; in einem gemessenen Fall wirkten **rund 1.100 von 6.000 Zeichen** ([#94](https://github.com/higgsfield-ai/cli/issues/94)). Betroffen sind ausgerechnet die strukturierten Videoprompts mit Ankerblock, Kamera und zeitlichen Beats. Version 2 verlangt deshalb einen einzigen Absatz mit Labels im Fließtext, und der Hook stoppt Prompts mit Leerzeilen. Die dritte Panne trifft die Einrichtung. `claude plugin install higgsfield@higgsfield` scheitert mit „This plugin's marketplace entry is invalid", geprüft mit Claude Code 2.1.271 ([PR #7](https://github.com/higgsfield-ai/skills/pull/7)), und das dokumentierte manuelle Klonen legt alle Skills eine Ebene zu tief ab, sodass Claude keinen findet ([PR #8](https://github.com/higgsfield-ai/skills/pull/8)). Beide Korrekturen sind nicht gemergt. Laut Dokumentation funktionieren `npx skills add higgsfield-ai/skills`, `gh skill install higgsfield-ai/skills` ab GitHub CLI 2.90 oder das Skript `./setup` aus einem Klon, das jeden Skill einzeln verlinkt ([README](https://github.com/higgsfield-ai/skills/blob/main/README.md); [INSTALL.md](https://github.com/higgsfield-ai/skills/blob/main/INSTALL.md)). Einen inoffiziellen Fork mit repariertem Manifest gibt es auch ([TheNeuralCube](https://github.com/TheNeuralCube/higgsfield-skills)); ich würde ihn nicht nutzen.

Bestätigt wird die Budgetlogik ausgerechnet von Higgsfields neuen Skills. Der offizielle Generierungs-Skill sagt weiterhin „Don't pre-estimate cost or optimize for cheaper models unless the user asks" ([SKILL.md](https://github.com/higgsfield-ai/skills/blob/main/higgsfield-generate/SKILL.md)). Der Blender-Skill vom 23. September verlangt dagegen eine Schätzung ohne Ausgabe: „If cost cannot be established, do not submit a paid job to discover it". Unsichere Aufträge soll der Agent nicht automatisch wiederholen, denn „slow generation is not grounds to duplicate it" ([blender-generation](https://registry.npmjs.org/fnf-blender-mcp/-/fnf-blender-mcp-0.2.2.tgz)). Der After-Effects-Skill verlangt für jeden weiteren Versuch „a materially different correction… A rewording is not one, a change of seed, resolution or duration alone is not one" ([ae-matte-painting](https://registry.npmjs.org/fnf-after-effects-mcp/-/fnf-after-effects-mcp-0.1.3.tgz)). Auch seine Prüfregeln sind schärfer als die bisherigen. Tatsächliche Maße und Dauer der geladenen Datei zählen, nicht der Prompt; „A plausible layer viewed alone, or a matching first frame, is not evidence"; Bewegung wird über einen Review-Film oder einen beschrifteten Bildstreifen beurteilt; und „an approval given before a detected defect was disclosed is not acceptance" (ebd.). Für portable Projekte verlangt der After-Effects-Skill pro Asset ein Medienmanifest mit Anbieter, Modell, angefragten und gelieferten Werten und Job-ID, aber ohne „credentials, access tokens or expiring signed URLs" ([ebd.](https://registry.npmjs.org/fnf-after-effects-mcp/-/fnf-after-effects-mcp-0.1.3.tgz)). Version 2 übernimmt das fast wörtlich.

| Stelle | Version 1 | Version 2 | Grund |
|---|---|---|---|
| Bezahlte Jobs | CLI oder MCP | nur CLI; MCP nur zum Lesen | [#95](https://github.com/higgsfield-ai/cli/issues/95), [#93](https://github.com/higgsfield-ai/cli/issues/93) |
| Wiederholung | „nie denselben Job doppelt senden" | Status mit `generate wait/get/list`, `jobs_wait`, `bl_job_status` klären; Hook sperrt identische Aufträge 30 Minuten | 792 Credits am 22.9. |
| Prompts | unter ~200 Tokens | zusätzlich ein Absatz ohne Leerzeilen; Hook prüft auch Prompt-Dateien | [#94](https://github.com/higgsfield-ai/cli/issues/94) |
| Versuche | 3 Takes ohne Rückfrage | 3, absolute Grenze 5; neuer Versuch nur mit echter Änderung | Higgsfields AE- und Blender-Skills |
| MCP-Namen | Platzhalter | dokumentierte Namen; Hook erkennt auch claude.ai-Connectoren und die Bridge | [Cursor-Plugin](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/commands/higgs.md) |
| Weitere Dienste | nicht gezählt | Runway, Kling, ElevenLabs, Descript, OpusClip, Luma und `curl`-Aufträge an deren APIs | [Kling](https://kling.ai/app/mcp) |
| Installation | `/plugin install higgsfield@higgsfield` | `npx skills add higgsfield-ai/skills` | [PR #7](https://github.com/higgsfield-ai/skills/pull/7) |
| Resolve | speichern, zurücklesen | zusätzlich Server ab 4.8.20, echte Booleans, nie archivieren (Hook sperrt), `snapshot` | [CHANGELOG](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/CHANGELOG.md) |
| Prüfung | Kontaktbogen und Messwerte | plus Dekodierprüfung, Bildstreifen, Flächen-Check, Mängel vor Abnahme, Medienmanifest | Higgsfields Prüfregeln |
| Post | Astra für Stilisiertes | Topaz for Web; ElevenLabs mit `music_v2_5`; nie Ausgabe über Eingabe | [Topaz](https://www.topazlabs.com/web/faq), [ElevenLabs](https://github.com/elevenlabs/skills/commit/68fff59a24daf7906324b06c494a4d0bead232a0) |
| Schutz | keiner | Hook sperrt Änderungen an Budgetdateien, Einstellungen und Hooks | eigene Ergänzung |

## Die Arbeitsanweisung Version 2 zum Kopieren

Version 2 besteht aus vier Dateien im Projektordner, `CLAUDE.md`, `.claude/settings.json`, `.claude/hooks/budget-gate.mjs` und `budget.json`, dazu dem Startprompt. Den Hook habe ich mit rund 90 simulierten Aufrufen durchgespielt, von CLI-, MCP- und Connector-Aufrufen über Preisabfragen bis zu Wiederholungen, Prompts mit Leerzeilen, Archivierungsversuchen und Manipulationen an `budget.json`, jeweils auch über Claudes PowerShell-Werkzeug; alle verhielten sich wie vorgesehen. In einer echten Claude-Code-Sitzung mit Higgsfield konnte ich ihn nicht testen, deshalb folgt unten ein kurzer Test ohne Credits. Die MCP-Namen stammen aus Higgsfields Dokumentation, die Werkzeuglisten sind aber live und ändern sich; prüfe sie mit `/mcp`. Der Hook läuft in der Exec-Form (`"command": "node"` plus `"args"`), die die Hooks-Dokumentation für Pfade mit `${CLAUDE_PROJECT_DIR}` ausdrücklich empfiehlt: ohne Shell, deshalb auch unter Windows zuverlässig, weil `node.exe` direkt gestartet wird ([Hooks-Doku](https://code.claude.com/docs/en/hooks)). Er prüft neben Bash auch Claudes PowerShell-Werkzeug, das unter Windows statt Bash laufen kann.

**Einrichtung (einmalig, in dieser Reihenfolge)**

```bash
# 1. Claude Code aktualisieren (mindestens 2.1.283), danach einmal /doctor prompt-audit
claude update

# 2. Higgsfield-CLI und Anmeldung im Browser (Claude darf das nicht selbst)
npm install -g @higgsfield/cli
higgsfield auth login

# 3. Higgsfield-Skills über den funktionierenden Weg (NICHT /plugin install higgsfield@higgsfield)
npx skills add higgsfield-ai/skills

# 4. Gehosteter Higgsfield-MCP, in Claude Code nur zum Lesen
claude mcp add --transport http higgsfield https://mcp.higgsfield.ai/mcp

# 5. Resolve-Community-Server neu einrichten, mindestens v4.8.20
npx davinci-resolve-mcp@latest setup

# 6a. Blender auf dem Mac: lokaler Higgsfield-Server (Node 24; Befehlsnamen laut README)
npm install -g fnf-blender-mcp
fnf-blender doctor && fnf-blender config      # ausgegebenen Eintrag in die MCP-Konfiguration übernehmen

# 6b. Blender unter Windows: Community-Server ohne Telemetrie, im Safe Mode
claude mcp add --transport stdio --env DISABLE_TELEMETRY=true --env BLENDER_MCP_SAFE_MODE=1 blender -- uvx mcp-for-blender

# 7. Kostenlos prüfen, ob die Marketing-Studio-V2-Presets für dich schon freigeschaltet sind
higgsfield preset list marketing-studio-v2 --json
```

Die übrigen Higgsfield-Brücken richtest du nur bei Bedarf nach demselben Muster ein: global installieren, dann `doctor`, `config` und `probe` des Pakets. Die Resolve-Brücke lohnt sich nur mit Studio 21.1, die Premiere-Brücke braucht zusätzlich `install-bridge` für ihre signierte CEP-Erweiterung und einen Neustart von Premiere ([npm](https://www.npmjs.com/package/@higgsfield_org/premiere-mcp)).

**Datei 1: `CLAUDE.md`**

```markdown
# CLAUDE.md – KI-Videoproduktion mit Higgsfield, Resolve und Blender (Version 2, 26.09.2026)

## Rollen
Du bist Produzent und Schnittassistent, ich bin Regisseur. Konzept, Look, Take-Auswahl,
Schnittrhythmus, Farblook, Musik und Veröffentlichung entscheide ich. Du entscheidest nichts
davon allein und wechselst nie Modell, Anbieter oder Arbeitsweise ohne Rückfrage.

## Projektordner
00_brief/brief.md         Ziel, Zielgruppe, Plattform, Länge, Format, Deadline
01_konzept/               Konzepte, Skript, gewählte Variante
02_bibel/                 Look, Pässe für Figuren, Orte, Produkte (Text + Bild), Soul-ID-IDs
03_shots/shotliste.md     eine Shot-Karte pro Einstellung (S010, S020 …), Prompt als ein Absatz
04_keyframes/             S010_kf_v01.png …
05_generierungen/         Rohmaterial: nie ändern, nie umbenennen, neue Version = neue Datei
06_selects/               nur freigegebene Takes, nur dieser Ordner geht in den Schnitt
07_qa/                    Kontaktbögen, Bildstreifen, qa_log.md
08_ton/  09_grafik/  10_schnitt/  11_ausgabe/
logs/entscheidungen.md    nur anhängen, nie überschreiben
logs/generierungen.csv    shot;take;modell;parameter;prompt_zeichen;credits_geschaetzt;job_id;urteil;grund
logs/medien_manifest.csv  datei;zweck;anbieter;modell;angefragt;geliefert;job_id
                          (keine signierten Links, keine Tokens, keine Zugangsdaten)
logs/bezahlte_jobs.log    schreibt nur der Budget-Hook

## Phasen und Freigaben
Jede Freigabe endet mit STOPP: Ergebnis zeigen, verbrauchte Credits und Restbudget nennen,
dann den Zug beenden. Eine Freigabe gilt nur für ihre Phase, nie für spätere.
F1  Konzept: 2–3 Varianten mit Hook in den ersten 2 Sekunden, Skript, Shotliste, Kostenschätzung
F2  Look-Bibel und Pässe, Stresstest mit günstigen Standbildern
F3  Keyframes als Kontaktbogen (bei komplexer Kamera zusätzlich Blender-Playblast)
F4  Probe-Shot: die schwierigste Einstellung, ein Take
    danach Batch-Generierung nur innerhalb der freigegebenen Shotliste und des Budgets
F5  Selects: Kontaktbögen, Bildstreifen und QA-Urteile samt aller Mängel vorlegen, ich wähle
F6  Rohschnitt in Resolve mit Ton und Grafik, danach Finish und Export

## Budget (hat Vorrang vor „Don't pre-estimate cost" im Higgsfield-Skill)
- Zahlen stehen in budget.json: projectCredits (Projektlimit), askAboveCreditsPerJob (Einzeljob
  darüber nur nach Rückfrage), maxTakesPerShot (Takes ohne Rückfrage). Absolute Grenze: 5 Takes
  pro Shot. Erhöhen darf nur ich, und nur vor dem ersten Take.
- Kein Preis, kein Job: Vor jedem bezahlten Aufruf die Kosten ohne Ausgabe ermitteln
  (`higgsfield generate cost …`, Marketing Studio mit `--cost-only`, MCP nur mit `get_cost: true`)
  und protokollieren. Lässt sich kein Preis ermitteln (z. B. voice-change, dubbing): vorher fragen.
- Bezahlte Jobs nur über die Higgsfield-CLI. Den gehosteten MCP nur zum Lesen nutzen
  (models_explore, balance, get_workflow_instructions, jobs_wait, job_status), außer ich erlaube
  ausdrücklich einen Workflow, den es nur dort gibt.
- Jeder bezahlte Auftrag ist ein einzelner, sichtbarer Befehl und endet mit Shot und Take als
  Kommentar, z. B. `# S010_t02`. Keine bezahlten Aufrufe in Skripten, Schleifen, SDK-Code
  oder parallel mit `&`.
- Jeder neue Versuch nach einem Fehler braucht eine echte Änderung: anderes Modell, andere
  Referenz, anderer Aufbau des Shots. Neue Wortwahl, Seed, Auflösung oder Dauer allein zählen nicht.
- In der günstigsten aussagekräftigen Auflösung iterieren, nur freigegebene Takes in Endauflösung.
- Bei 80 % des Limits oder bei BUDGET-STOPP, WIEDERHOLUNG-STOPP oder PROMPT-STOPP des Hooks:
  sofort anhalten und melden.
- budget.json, logs/bezahlte_jobs.log, .claude/settings*.json und .claude/hooks/ nie ändern.

## Nie doppelt senden
- Nach Zeitüberschreitung, Abbruch, Netzwerkfehler oder unklarer Antwort gilt der Job als gesendet.
- Vor jedem neuen Versuch den Status klären: CLI `higgsfield generate wait <id>`,
  `higgsfield generate get <id> --json` oder `higgsfield generate list --json`; MCP `jobs_wait`
  oder `job_status`; Blender `bl_job_status`; Higgsfield-Resolve-Brücke `dr_inspect_color`, dann
  `dr_acknowledge_uncertain`; After Effects und Premiere: im Programm nachsehen.
- Lässt sich der Status nicht klären: melden statt neu senden. Langsame Jobs sind kein Grund
  für einen zweiten. (Warnbeispiel: 20 Einreichungen über den MCP, 792 Credits, 22.09.2026.)

## Generierung
- Hero-Shots als Image-to-Video aus freigegebenem Keyframe, nie reines Text-to-Video.
- Prompts auf Englisch, unter ~200 Tokens, als EIN Absatz ohne Leerzeilen, direkt im Befehl.
  Gliederung mit Labels im Fließtext: „SUBJECT: … ACTION 0–3 s: … CAMERA: … LIGHT: … SOUND: …".
  Die Zeichenzahl ins Protokoll schreiben.
- Dauer, Auflösung, Format nur als Parameter.
- Pro Shot eine Hauptaktion mit sichtbarem Endpunkt und genau eine Kamerabewegung.
- Bei Image-to-Video nur Bewegung, Kamera, Timing und Ton beschreiben, nicht das Bild.
- Positiv formulieren; messbar statt Lobwörter (Brennweite, Kelvin, km/h, cm).
- Pass-Texte wörtlich übernehmen; jede Referenz mit Rolle und Ausschluss.
- Alle 3–4 Clips wieder von den Originalreferenzen ausgehen, nicht von Generaten.
- Ton im Generat: Atmo, Geräusche, kurze Dialogzeilen. Musik unterdrücken
  (Seedance: „NO BGM", sonst „No score. Production audio only.").
- Nie Text, Logos oder Untertitel generieren – Grafik kommt in der Post.
- Vor jedem Job Prompt und Referenzen auf Sperrgründe prüfen (echte Gesichter, Marken, Prominente).
- Modelle: Standard Seedance 2.5 (4–30 s, bis 1080p); Seedance 2.0 nur für natives 4K;
  Kling 3.0 als günstige Option und für Multi-Shot bis 15 s, Kling 3.0 Turbo für schnelle
  Entwürfe; Veo 3.1 für Dialog-Nahaufnahmen; Grok Video 1.5 für stilisiertes Image-to-Video;
  Gemini Omni Flash bei vielen Referenzen. Modell-IDs mit `higgsfield model list` oder
  models_explore prüfen, nie erfinden.
- Web-Presets (Earth Zoom, Bullet Time, Transitions, Vibe Motion) gibt es für dich nicht:
  per Prompt und Parameter nachbauen oder mich bitten, sie im Web anzuklicken.
- Marketing-Studio-V2- und Soul-2.0-Presets nur live abfragen (`higgsfield preset list …`),
  IDs nie erfinden; erst ein Testjob, dann Serien.
- Blender-Playblasts nur als Kamerareferenz: „@video1 as camera movement reference only".

## Prüfung nach jedem Clip
- Geladene Datei dekodieren (ffprobe): tatsächliche Auflösung, fps, Dauer und Tonspur gegen die
  Anfrage prüfen, nicht gegen den Prompt. ffmpeg: blackdetect, freezedetect, silencedetect, ebur128.
- Kontaktbogen 4×3 (0/25/50/75/100 % plus Bewegungsspitzen) und für Bewegung ein beschrifteter
  Bildstreifen mit 2 Bildern pro Sekunde in 07_qa ablegen.
- Gegen Shot-Karte und Pässe prüfen: Identität, Kleidung, Produktform, Hände, Text, Bildaufbau,
  Anschluss an den vorigen Select, glatte Flächen (Wände, Himmel, Haut) auf Schlieren und Flecken.
- Ein passendes erstes Bild oder ein gutes Einzelbild ist kein Beleg für den ganzen Clip.
- Urteil: Behalten / In der Post reparieren / Neu erzeugen / Umschreiben (eine Zeile) / Stopp.
- Nach zwei gleichen Fehlern oder drei Fehlversuchen: Vereinfachung vorschlagen und fragen.
  Ein weiterer Take ist keine Fehleranalyse.
- Alle erkannten Mängel nennen, bevor ich abnehme; eine Freigabe vor offengelegten Mängeln gilt nicht.
- Für jede Datei eine Zeile im Medienmanifest.
- Nie behaupten, ein Video gesehen zu haben. Du prüfst Einzelbilder und Messwerte;
  Morphing, Flackern und Physik beurteile ich in Echtzeit.

## Post
- Titel, Bauchbinden, Untertitel mit HyperFrames (Version im Projekt festgeschrieben) oder
  Remotion als transparente Overlays in 09_grafik.
- Übergänge: harte Schnitte und xfade; KI-Morph nur geplant per Start-/Endbild (Kling 3.0).
- VFX-Korrekturen (draw_to_video, Runway Aleph, AE-Skills ae-cleanup und ae-matte-painting)
  nur nach Freigabe, höchstens 3 Versuche pro Ebene, nie mehr als 5.
- Farbe: Clips normalisieren, an ein Hero-Bild angleichen, eine LUT. Filmkorn mache ich.
- Ton: Ereignisliste mit Timecodes; Effekte mit ElevenLabs oder Seed Audio (--sample_rate 48000);
  Musik mit ElevenLabs immer mit model_id music_v2_5; nur lizenzsichere Musik; Musik unter
  Sprache absenken; Lautheit messen.
- Eine Timeline-Rate (24p, fürs Fernsehen 25p), doppelte Frames prüfen, keine 60-fps-Interpolation.
- Hochskalieren nur Selects: Topaz Starlight für Fotorealismus, kreatives Upscaling über
  Topaz for Web (die Astra-Oberfläche gibt es ab 30.09.2026 nicht mehr).
- Ausgabedateien nie über ihre Eingabedateien schreiben.

## Resolve
- Community-Server samuelgursky/davinci-resolve-mcp mindestens v4.8.20 (ältere Versionen lesen
  "false" als wahr). Version zu Sitzungsbeginn prüfen; darunter nicht arbeiten, sondern melden.
- Boolesche Parameter immer als echtes true/false senden, nie als Text.
- Vor jedem Eingriff speichern. Kein run_script_unsafe, kein CopyGrades oder ApplyGradeFromDRX
  ohne Freigabe. Projekte nie per API archivieren (Studio 21.1.0.14 stürzt dabei ab).
- Zustand mit project_manager, Aktion snapshot, lesen; nach jedem Schritt die Struktur
  zurücklesen (Clipanzahl, Positionen), nicht Rückgabewerten trauen.
- Timelines als FCP7-XML mit neuem Namen CUT_v001, CUT_v002 … importieren.
- Higgsfields Resolve-Brücke (nur Studio 21.1, nur Color-Seite): vor jeder Änderung
  dr_create_version; nach dr_set_cdl Bild und Scopes prüfen (kein Rücklesen möglich).

## Blender, After Effects, Premiere (nur falls eingerichtet)
- Vor jedem Agenteneinsatz speichern; immer nur ein Blender-MCP gleichzeitig.
- fnf-blender-mcp: bl_execute ist nicht abgeschottet; nach Zeitüberschreitung erst bl_job_status.
  Für Previs die Skills blender-greybox und blender-camera-blocking; generiert wird über die CLI.
- mcp-for-blender nur mit DISABLE_TELEMETRY=true und BLENDER_MCP_SAFE_MODE=1.
- After Effects: nach Zeitüberschreitung erst im Projekt nachsehen; Sammelbefehle haben kein Rollback.
- Premiere-Brücke nur für Import, Bins, Sequenzen und Montage; danach sequence.info, track.list
  und clip.list zurücklesen. Ein Erfolg der API ist kein Bild- oder Tonbeleg.

## Bericht an jeder Freigabe (auf Deutsch)
Erledigt · Credits verbraucht und übrig · Fehlschläge mit Grund · offene Fragen · deine Empfehlung
```

**Datei 2: `.claude/settings.json`**

```json
{
  "permissions": {
    "allow": [
      "Bash(higgsfield generate cost *)",
      "Bash(higgsfield generate get *)",
      "Bash(higgsfield generate list *)",
      "Bash(higgsfield generate wait *)",
      "Bash(higgsfield account *)",
      "Bash(higgsfield model list *)",
      "Bash(higgsfield workflow list *)",
      "Bash(higgsfield workflow get *)",
      "Bash(higgsfield preset list *)",
      "Bash(ffprobe *)",
      "mcp__higgsfield__models_explore",
      "mcp__higgsfield__balance",
      "mcp__higgsfield__get_workflow_instructions",
      "mcp__higgsfield__jobs_wait",
      "mcp__higgsfield__job_status"
    ],
    "ask": [
      "Bash(higgsfield generate create *)",
      "Bash(higgsfield generate workflow *)",
      "Bash(higgs generate create *)",
      "Bash(higgs generate workflow *)",
      "Bash(higgsfield product-photoshoot create *)",
      "Bash(higgsfield marketplace-cards create *)",
      "Bash(higgsfield soul-id create *)",
      "Bash(higgsfield marketing-studio dtc-ads generate *)",
      "Bash(hf-api generate *)",
      "mcp__higgsfield__generate_image",
      "mcp__higgsfield__generate_video",
      "mcp__higgsfield__generate_audio",
      "mcp__higgsfield__explainer_video",
      "mcp__higgsfield__virality_predictor"
    ],
    "deny": [
      "Bash(higgsfield auth *)",
      "Bash(higgs auth *)"
    ]
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|PowerShell|Edit|Write|MultiEdit|NotebookEdit|mcp__.*",
        "hooks": [
          {
            "type": "command",
            "command": "node",
            "args": ["${CLAUDE_PROJECT_DIR}/.claude/hooks/budget-gate.mjs"]
          }
        ]
      }
    ]
  }
}
```

**Datei 3: `.claude/hooks/budget-gate.mjs`** (braucht Node 18 oder neuer)

```js
// .claude/hooks/budget-gate.mjs – Version 2 (Stand 26.09.2026)
// PreToolUse-Hook. Zählt bezahlte Aufrufe (Higgsfield-CLI, hf-api, gehosteter Higgsfield-MCP auch
// als claude.ai-Connector, Higgsfield-Bridge, Runway, Kling, ElevenLabs, Descript, OpusClip, Luma,
// curl an deren APIs; Befehle aus Bash und aus dem PowerShell-Werkzeug unter Windows) und
// blockiert ab dem Limit in budget.json. Blockiert außerdem identische
// Wiederholungen, Prompts mit Leerzeilen, Resolve-Archivierung und Änderungen an den Budgetdateien.
// Exit 2 = blockiert, die Meldung geht an Claude.
import { readFileSync, appendFileSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";

let raw = "";
for await (const chunk of process.stdin) raw += chunk;
const input = JSON.parse(raw);
const tool = input.tool_name ?? "";
const args = input.tool_input ?? {};
const cmd = typeof args.command === "string" ? args.command : "";
const SHELL = tool === "Bash" || tool === "PowerShell";   // PowerShell-Werkzeug unter Windows
const text = JSON.stringify(args);
const root = process.env.CLAUDE_PROJECT_DIR ?? input.cwd ?? process.cwd();
const stop = (msg) => { console.error(msg); process.exit(2); };

// 1. Budgetdateien, Einstellungen und Hooks schützen (Lesen bleibt erlaubt)
const PROTECTED = /(budget\.json|bezahlte_jobs\.log|\.claude[\\/](settings[^\\/]*\.json|hooks[\\/]))/;
const file = String(args.file_path ?? args.notebook_path ?? "");
const WRITES = new RegExp(">{1,2}\\s*[\"']?[^\\s\"';|&]*" + PROTECTED.source +
  "|\\b(sed\\s+-i|tee|rm|mv|cp|truncate|Set-Content|Add-Content|Out-File|Clear-Content|" +
  "Remove-Item|Move-Item|Copy-Item|New-Item)\\b[^;|&]*" + PROTECTED.source, "i");
if ((/^(Edit|Write|MultiEdit|NotebookEdit)$/.test(tool) && PROTECTED.test(file)) ||
    (SHELL && WRITES.test(cmd)))
  stop("GESPERRT: budget.json, logs/bezahlte_jobs.log, .claude/settings*.json und .claude/hooks/ ändert nur der Nutzer.");

// 2. Resolve: kein run_script_unsafe, nie archivieren (Studio 21.1.0.14 stürzt dabei ab)
if (/^mcp__.*(resolve|davinci)/i.test(tool) && /run_script_unsafe$/i.test(tool))
  stop("GESPERRT: run_script_unsafe ist in diesem Projekt verboten.");
if (/ArchiveProject/.test(SHELL ? cmd : text) ||
    (/^mcp__.*(resolve|davinci)/i.test(tool) && /"action"\s*:\s*"archive/i.test(text)))
  stop("GESPERRT: Projekte nie per Skript oder MCP archivieren – Resolve Studio 21.1 stürzt dabei ab, ungesicherte Arbeit geht verloren.");

// 3. Ist der Aufruf bezahlt?
const READ = /^(?:runway_|opusclip_|kling_|luma_|elevenlabs_|descript_)?(get|list|search|show|describe|info|usage|balance|cancel|explore|models|select)|(_status|_wait)$|^(jobs?_display|media_upload|media_confirm|transactions|resolve_explainer_preset|bl_estimate_generation)$/;
let paid = false;
if (SHELL) {
  paid = /\b(higgsfield|higgs)\s+(generate\s+(create|workflow)|product-photoshoot\s+create|marketplace-cards\s+create|soul-id\s+create|marketing-studio\s+dtc-ads\s+generate)\b/.test(cmd) ||
    /\bhf-api\s+generate\b/.test(cmd) ||
    (/\bcurl\b/.test(cmd) && /\b(api\.elevenlabs\.io|fal\.run|runwayml\.com|klingai\.com|lumalabs\.ai)\b/.test(cmd) &&
     /\s(-d|--data\S*|-F|--form|--json|-X\s*POST|--request\s+POST)\b/.test(cmd));
  if (/\s--(cost-only|help)\b/.test(cmd)) paid = false;          // Preisabfrage, Hilfe
} else if (tool.startsWith("mcp__")) {
  const parts = tool.split("__");
  const server = (parts[1] ?? "").toLowerCase();
  const name = parts.slice(2).join("__").toLowerCase();
  if (/^bl_generate_/.test(name)) paid = true;                      // Higgsfield-Bridge: Generierung
  else if (/higgsfield/.test(server) &&
           !/(touch|resolve|davinci|after|premiere|photoshop|illustrator|blender|fnf)/.test(server))
    paid = !/^bl_|^get_host_status$/.test(name) && !READ.test(name); // gehosteter MCP, Connector, Bridge
  else if (/(runway|kling|eleven|descript|opusclip|luma)/.test(server))
    paid = !READ.test(name);                                         // weitere bezahlte Dienste
  if (paid && /"get_cost"\s*:\s*true/.test(text)) paid = false;      // Preisabfrage vor dem Job
}
if (!paid) process.exit(0);

// 4. Prompts nur als ein Absatz (die CLI verwirft alles nach der ersten Leerzeile)
const BLANK = /\n[ \t]*\r?\n/;
const promptStop = () => stop("PROMPT-STOPP: Der Prompt enthält eine Leerzeile. Die Higgsfield-CLI nutzt nur den Text bis zur ersten Leerzeile. Prompt als einen Absatz senden (Gliederung mit Labels wie CAMERA: … ACTION 0–3 s: …).");
let extra = "";
if (SHELL) {
  if (BLANK.test(cmd)) promptStop();
  for (const m of cmd.matchAll(/\$\(\s*(?:cat\s+|<\s*|Get-Content\s+(?:-Raw\s+)?)(["']?)([^"')\s]+)\1(?:\s+-Raw)?\s*\)/gi)) {
    let content = "";
    try { content = readFileSync(resolve(input.cwd ?? root, m[2]), "utf8"); } catch {}
    if (BLANK.test(content.trimEnd())) promptStop();
    extra += "\n" + content;
  }
} else {
  const walk = (v, k = "") => {
    if (typeof v === "string") { if (/prompt/i.test(k) && BLANK.test(v.trimEnd())) promptStop(); }
    else if (v && typeof v === "object") for (const [kk, vv] of Object.entries(v)) walk(vv, kk);
  };
  walk(args);
}

// 5. Budget und Wiederholungssperre
let cfg = {};
try { cfg = JSON.parse(readFileSync(join(root, "budget.json"), "utf8")); } catch {}
const max = cfg.maxPaidJobs;
if (!Number.isInteger(max)) stop("BUDGET-STOPP: budget.json fehlt oder enthält kein gültiges maxPaidJobs.");
const windowMin = Number.isFinite(cfg.repeatWindowMinutes) ? cfg.repeatWindowMinutes : 30;
const ledger = join(root, "logs", "bezahlte_jobs.log");
const lines = existsSync(ledger) ? readFileSync(ledger, "utf8").split("\n").filter(Boolean) : [];
if (lines.length >= max)
  stop(`BUDGET-STOPP: ${lines.length} von ${max} bezahlten Aufrufen verbraucht. Nicht weiter generieren, Stand melden und auf Freigabe warten.`);
const basis = SHELL ? cmd.replace(/\s+/g, " ").trim() : text;
const key = createHash("sha256").update(tool + "\n" + basis + extra).digest("hex").slice(0, 16);
const now = Date.now();
const same = lines.find((l) => {
  const [ts, , k] = l.split("\t");
  return k === key && now - Date.parse(ts) < windowMin * 60000;
});
if (same)
  stop(`WIEDERHOLUNG-STOPP: Derselbe Auftrag ging um ${same.split("\t")[0]} schon hinaus. Erst den Status klären (CLI: higgsfield generate get <id> --json oder generate list --json; MCP: jobs_wait oder job_status). Ein bewusster weiterer Take braucht die Freigabe des Nutzers und eine neue Take-Kennung im Befehlskommentar (# S010_t03).`);
const snippet = basis.replace(/(bearer\s+)[^\s"',}]+/gi, "$1***")     // keine Zugangsdaten ins Protokoll
  .replace(/(key|token|secret|authorization)(["']?\s*[:=]\s*["']?)[^\s"',}]+/gi, "$1$2***")
  .replace(/\s+/g, " ").slice(0, 160);
mkdirSync(join(root, "logs"), { recursive: true });
appendFileSync(ledger, `${new Date(now).toISOString()}\t${tool}\t${key}\t${snippet}\n`);
if (cfg.confirmEachJob !== false)
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse",
    permissionDecision: "ask",
    permissionDecisionReason: `Bezahlter Aufruf ${lines.length + 1} von ${max}: ${tool}` } }));
process.exit(0);
```

**Datei 4: `budget.json`** (die ersten drei Werte liest der Hook, die letzten drei liest Claude)

```json
{
  "maxPaidJobs": 30,
  "confirmEachJob": true,
  "repeatWindowMinutes": 30,
  "projectCredits": 600,
  "askAboveCreditsPerJob": 40,
  "maxTakesPerShot": 3
}
```

**Datei 5: Startprompt für ein neues Projekt**

```text
Lies CLAUDE.md und budget.json. Prüfe zuerst, ohne irgendetwas zu generieren:
die Claude-Code-Version (mindestens 2.1.283), `higgsfield --version` und `higgsfield account`,
welche MCP-Werkzeuge von Higgsfield, Resolve und Blender verfügbar sind und wie sie genau heißen,
und die Version des Resolve-Community-Servers (mindestens 4.8.20). Melde jede Abweichung.
Neues Projekt: <30-Sekunden-Spot für …, 9:16 für Reels und TikTok, Zielgruppe …, Tonfall …, Deadline …>.
Material: <Logo und Produktfotos in 00_brief/assets>. Referenzen: <Links oder Dateien>.
Beginne dann mit Phase F1: drei Konzepte mit Hook in den ersten zwei Sekunden, zu jedem Konzept
eine Shotliste und eine Kostenschätzung in Credits aus `higgsfield generate cost` (ohne Job). Dann STOPP.
```

Teste den Hook vor dem ersten echten Projekt, ohne einen Credit auszugeben. Nimm dafür einen erfundenen Modellnamen, damit selbst ein versehentliches Ja nichts kostet. Setz `maxPaidJobs` auf 0 und bitte Claude, `higgsfield generate create kein_modell --prompt 'test' # T000_t01` auszuführen; es muss „BUDGET-STOPP" erscheinen, und nichts wird gesendet. Setz das Limit dann auf 5, lehne die Rückfrage zum selben Befehl ab und lass ihn gleich noch einmal anfordern; jetzt muss „WIEDERHOLUNG-STOPP" kommen. (Mit einem Limit von 1 greift schon beim zweiten Aufruf der Budget-Stopp, deshalb 5.) Ein Prompt mit Leerzeile muss „PROMPT-STOPP" auslösen, und die Bitte, `budget.json` auf 99 zu setzen, „GESPERRT". Danach trägst du die echten Werte ein und **löschst `logs/bezahlte_jobs.log` von Hand**, weil der Testeintrag sonst mitzählt. Kommt keine der Meldungen, findet Claude Code den Hook nicht; ein fehlender oder abstürzender Hook blockiert nichts, nur Exit-Code 2 hält einen Aufruf an ([Hooks-Doku](https://code.claude.com/docs/en/hooks)). Prüf in diesem Fall, ob `node --version` im Terminal funktioniert und ob die Hook-Datei unter `.claude/hooks/budget-gate.mjs` in genau dem Ordner liegt, in dem du Claude Code startest.

Drei Grenzen solltest du kennen. Der Hook zählt Aufrufe, nicht Credits, und er zählt auch Aufrufe mit, die du an der Rückfrage ablehnst; er ist ein Sicherheitsgurt, kein Kostenzähler. Er erkennt Higgsfield-Connectoren aus claude.ai nur, wenn ihr Name „Higgsfield" enthält; in Claude Code erscheinen sie unter einem eigenen Servernamen, etwa `mcp__claude_ai_Higgsfield__…`, den genauen Namen zeigt `/mcp`. Weil der Hook bei jedem bezahlten Aufruf selbst eine Rückfrage auslöst, brauchen diese Namen keinen eigenen Eintrag in `settings.json`. Und bezahlte Aufrufe, die Claude in einem Python- oder Node-Skript über ein SDK versteckt, sieht er nicht; deshalb verbietet die CLAUDE.md genau das. Wenn dich die Einzelfreigaben in der Batch-Phase nach F4 stören, setz `confirmEachJob` auf `false` und verschiebe die Bash-Regeln von `ask` nach `allow`. Das harte Limit, die Wiederholungssperre und die Prompt-Prüfung bleiben dann bestehen. Starte Claude Code immer im Projektordner und generiere nie im Modus ohne Rückfragen.

## Elf Korrekturen an den früheren Berichten

Die beiden Berichte vom 23. September enthalten Aussagen, die inzwischen überholt oder ungenau sind. Die Empfehlungen selbst bleiben bestehen.

| Stelle | Richtig ist (Stand 26.9.) | Beleg |
|---|---|---|
| Belege für Higgsfields AE-, Premiere- und Skill-Dateien verlinkten `github.com/higgsfield-ai/fnf-local-pluging-bridge-mcp` | Das Repository ist nicht mehr öffentlich lesbar; maßgeblich sind die offiziellen npm-Pakete `fnf-after-effects-mcp`, `fnf-blender-mcp` und `@higgsfield_org/…-mcp` | [npm AE](https://www.npmjs.com/package/fnf-after-effects-mcp); [npm Premiere](https://www.npmjs.com/package/@higgsfield_org/premiere-mcp) |
| Lokaler After-Effects-MCP mit 12 Werkzeugen | Version 0.1.3 hat 13 Werkzeuge und 13 Skills | [Paket 0.1.3](https://registry.npmjs.org/fnf-after-effects-mcp/-/fnf-after-effects-mcp-0.1.3.tgz) |
| Für Resolve keine Higgsfield-Brücke (erster Bericht) | Seit 23.9. vorhanden, aber nur für Studio 21.1 und nur auf der Color-Seite | [npm](https://www.npmjs.com/package/@higgsfield_org/davinci-resolve-mcp) |
| „Topaz Astra 2 für Stilisiertes" | Die Astra-Oberfläche endet am 30.9.; kreatives Upscaling läuft über Topaz for Web, ob das Modell Astra 2 dort wählbar bleibt, ist offen | [Topaz](https://www.topazlabs.com/web/faq) |
| Tabelle „Claude-App / Cowork / Claude Code" | Cowork-Funktionen gibt es seit 16.9. in jedem Chat (Pro und Max zuerst); lokale Programme erreicht weiter nur Claude Code oder Desktop | [Release Notes](https://support.claude.com/en/articles/12138966-release-notes) |
| Higgsfield-MCP in der App uneingeschränkt nutzbar | Generieren über den Desktop-Connector scheiterte am 20.9., Lesen funktionierte | [#93](https://github.com/higgsfield-ai/cli/issues/93) |
| Skills per `/plugin install higgsfield@higgsfield` | Scheitert; `npx skills add higgsfield-ai/skills` verwenden | [PR #7](https://github.com/higgsfield-ai/skills/pull/7) |
| `claude mcp add higgsfield https://…` (erster Bericht) | Für einen entfernten Server gehört `--transport http` dazu: `claude mcp add --transport http higgsfield https://mcp.higgsfield.ai/mcp` | [Claude Code Docs](https://code.claude.com/docs/en/mcp) |
| MCP-Werkzeugnamen als Platzhalter, Hook-Muster mit `create_character` | Die Namen sind dokumentiert (siehe Vorlage); ein Werkzeug `create_character` ist nirgends belegt | [Cursor-Plugin](https://github.com/higgsfield-ai/cursor-plugin/blob/develop/commands/higgs.md) |
| „ArchiveProject lässt Resolve abstürzen" | Genauer: mit Medienoptionen auf 21.1.0.14 in derselben Sekunde, ungesicherte Arbeit geht verloren, ein Archiv entstand per Skript nie | [CHANGELOG](https://github.com/samuelgursky/davinci-resolve-mcp/blob/main/CHANGELOG.md) |
| Die Sora-API „wird am 24. September abgeschaltet" | Sie ist seit dem 24.9. abgeschaltet | [OpenAI](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation) |

## Fazit

Der September verschiebt Higgsfield vom Generator zum Bediener deiner Programme, und damit verschiebt sich auch die Qualitätsfrage. Sie lautet nicht mehr nur, welches Modell den schönsten Clip liefert, sondern welcher Projektzustand übrig bleibt: Ein bearbeitbares After-Effects-Composite oder eine Blender-Greybox lässt sich korrigieren, ein fertig gerenderter Clip nur neu würfeln. Das kommt deinem Wunsch, dass Agenten die Arbeit machen und du entscheidest, näher als jeder One-Shot-Prompt. Es gilt aber nur dort, wo du die Programme besitzt, auf Version 0.x und größtenteils nur auf dem Mac getestet. Die Werbedemos zeigen, was möglich sein soll, nicht, was in deinem Projekt trägt; den ersten echten Beleg liefert ein eigener Test an einer Wegwerf-Kopie.

Zweitens liegen die größten Risiken nicht mehr in schlechten Bildern, sondern in unsichtbaren Fehlern: Abbuchung ohne Obergrenze, stille Prompt-Kürzung, ein Server, der „false" als „true" liest. Keiner davon zeigt sich im fertigen Video, alle zeigen sich im Protokoll. Deshalb bringt eine Stunde an der Vorlage mehr als ein Tag mit neuen Werkzeugen. Beobachten würde ich fünf Dinge: ob Higgsfield die Installation (PR #7) repariert und die Forderung nach einer Obergrenze pro Aufruf (#95) umsetzt, ob die Brücken unter Windows bestätigt werden, wie Jake Bartletts Test ausfällt (den solltest du dir selbst ansehen), ob Adobe ExtendScript nach dem 30. September weiter stützt und ob Kling 4.0 oder Seedance 3.0 erscheinen.
