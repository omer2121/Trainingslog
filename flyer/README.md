# Flyer-Generator

Baut aus `content.json` einen Flyer in drei Formaten:

| Datei (in `out/`) | Wofür |
|---|---|
| `flyer-A5-druck-RGB.pdf` | Druckdaten DIN A5 mit 3 mm Beschnitt (154 × 216 mm), RGB – für Druckereien, die RGB selbst umrechnen |
| `flyer-A5-druck-CMYK.pdf` | Dieselben Druckdaten in CMYK, umgerechnet mit FOGRA39 (ISO Coated v2), max. Farbauftrag 288 % |
| `flyer-A5-vorschau.png` | Vorschau im Endformat 148 × 210 mm (ohne Beschnitt), 300 dpi |
| `instagram-post.png` | Instagram-Post 4:5 (1080 × 1350) |
| `instagram-story.png` | Instagram-Story 9:16 (1080 × 1920), mit freien Rändern für die Instagram-Einblendungen |

## Text ändern

Alles steht in `content.json` (Headline, Vorteile, Angebot, Link für den QR-Code, Kontakt).
Danach neu bauen:

```bash
npm install          # einmalig: Schriften (Anton, Inter), QR-Code, Playwright
node build.mjs       # erzeugt alle Dateien in out/
```

Für die CMYK-Fassung braucht es Ghostscript (`gs`) und das FOGRA39-Profil aus dem Paket
`colord-data` (`/usr/share/color/icc/colord/FOGRA39L_coated.icc`). Fehlt das Profil,
rechnet Ghostscript mit seinem Standardprofil um – dann den Farbauftrag prüfen.
Passt der Text nicht auf die Seite, gibt `build.mjs` eine Warnung aus.

## Druck

- Endformat DIN A5 (148 × 210 mm), 3 mm Beschnitt rundum, wichtige Inhalte mindestens 5 mm vom Rand
- Hochladen: bei den meisten Online-Druckereien die CMYK-Datei; verlangt die Druckerei PDF/X,
  vorher im Upload-Check prüfen lassen
- Papier-Tipp: 170 g Bilderdruck matt oder glänzend
