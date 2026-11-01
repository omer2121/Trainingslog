# Kraftbuch

Allgemeine Trainings-App für alle Nutzer, unabhängig vom persönlichen Plan in `v9/`.

- Einstieg mit Fragen (Ziel, Erfahrung, Tage, Ausstattung, Bedienung), daraus ein Plan aus Vorlagen für 2 bis 6 Tage
- 61 Übungen mit Anleitung, typischen Fehlern und Video-Suche, gefiltert nach Ausstattung
- Training im Einfach-Modus (eine Übung nach der anderen, große Knöpfe, „Wie war der Satz?“) oder als Liste mit RIR
- Vorschläge nach doppelter Progression, Rekorde, Kraftverlauf, Körpergewicht, Trainings pro Woche
- Plan-Editor, eigene Übungen, kg oder lb, drei Schriftgrößen
- Alles lokal auf dem Gerät: kein Konto, kein Server; Sicherung als Datei, Export als CSV

Dateien: `index.html` (Gerüst), `styles.css`, `data.js` (Übungen und Vorlagen), `app.js` (Logik und Oberfläche), `sw.js` (offline), `manifest.webmanifest`.

## Nächste Schritte für den App Store

1. Native Hülle, z. B. Capacitor, mit diesem Ordner als Web-Inhalt
2. Native Funktionen: Mitteilung am Ende der Pause, Apple Health, iCloud-Sicherung
3. Apple-Developer-Konto, Datenschutzerklärung als Webseite, Datenschutz-Angaben im App Store
4. Englische Übersetzung
