# 02 – Offline-Strategie-Konzept

_Welche Daten Ctrl Alt Meet wie zwischenspeichert, damit die App auch ohne Verbindung nutzbar bleibt._

---

## Übersicht

Dieses Dokument legt für drei Datentypen fest, ob der Service Worker zuerst im Cache (Zwischenspeicher im Browser) oder zuerst im Netz nachsieht, und vergleicht Cache-First mit Stale-While-Revalidate.

## Kernaussagen

- Statische Assets und Speaker-Seiten laden mit Cache-First.
- Session-Daten laden mit Stale-While-Revalidate, passend zu `swr: 60` aus der Rendering-ADR.
- „Mein Programm“ ist nach einem einzigen Online-Besuch offline nutzbar.

## Ausgangslage

Auf der FrontendNow ist das WLAN in vollen Sälen oft überlastet, zwischen zwei Sessions sind viele im Flugmodus oder im Funkloch im Stiegenhaus. Gerade dann wollen Besucher:innen wissen, wo ihre nächste gemerkte Session stattfindet.

| Datentyp | Strategie |
|---|---|
| Statische Assets (App-Shell mit Startseite, Icons, Token-CSS, Fonts) | Cache-First |
| Speaker-Seiten | Cache-First, vorab gespeichert |
| Session-Daten (`/api/conference`) und Session-Seiten | Stale-While-Revalidate |
| „Mein Programm“ | Seite vorab gespeichert, IDs im `localStorage` |

## 1. Statische Assets

App-Shell mit Startseite, Icons und Token-CSS ändern sich nur mit einem neuen Deployment. Wir speichern sie bei der Installation des Service Workers vorab, Schriften beim ersten Laden mit aktivem Service Worker. Aus dem Cache laden sie sofort, auch wenn das WLAN im Saal nicht antwortet. Ein neues Deployment tauscht sie über einen neuen Service Worker aus.

## 2. Session- und Speaker-Daten

### Warum Cache-First für Programmdaten?

Nach der Veröffentlichung ändert sich das Programm kaum. Cache-First liefert ohne Netzanfrage und ist im überlasteten WLAN am schnellsten. Für die Speaker-Profile setzen wir das um. Sie entstehen laut Rendering-ADR beim Build und zeigen bewusst keine Zeiten und Räume, ein veralteter Stand schadet hier also nicht. Wir speichern alle 18 vorab, auch ungeöffnete Profile sind offline verfügbar.

### Wann Stale-While-Revalidate nötig ist

Sobald sich Daten kurzfristig ändern können, zeigt Cache-First einen veralteten Stand, bis ein neuer Service Worker kommt. Genau das gilt für Sessions, späte Raum- und Zeitänderungen haben wir in Schritt 2 mit `swr: 60` berücksichtigt. Bei Sessions wählen wir deshalb Stale-While-Revalidate. Die App zeigt sofort den gespeicherten Stand und holt im Hintergrund die aktuelle Version für den nächsten Aufruf. `/api/conference` liefert Sessions und Speaker gemeinsam, daher gilt diese Regel für beide.

## 3. „Mein Programm“

Die gemerkten Session-IDs liegen bereits im `localStorage`. Offline braucht es zusätzlich Seite und Session-Daten. Wir speichern die Seite deshalb vorab und rufen `/api/conference` einmal ab, sobald der Service Worker aktiv ist. Die vorgerenderte Startseite bringt ihre Daten nämlich mit und würde den Cache sonst nicht füllen. Nach einem einzigen Online-Besuch funktioniert „Mein Programm“ damit offline.

## Worst Case

Bricht die Verbindung mitten in der Nutzung ab, bleibt alles nutzbar, was vorab oder einmal geladen wurde. Innerhalb der App öffnen sich auch nie besuchte Session-Seiten, nur ihr direkter Aufruf zeigt eine Offline-Seite im Design von Ctrl Alt Meet mit Link zu „Mein Programm“. Raumänderungen erscheinen erst nach der nächsten Verbindung. Beim allerersten Besuch ohne Netz ist noch kein Service Worker installiert, der Browser zeigt seine eigene Fehlerseite. Das ist akzeptabel, weil jede Web-App einmal online geladen werden muss.

## Verworfene Alternativen

**Network-First für alle Daten.** Immer aktuell, im überlasteten WLAN aber lange Ladezeiten.

**Cache-First auch für Sessions.** Schnell, würde verschobene Sessions aber bis zum nächsten Deployment falsch anzeigen.

---

_Zuletzt aktualisiert: 2026-11-11_