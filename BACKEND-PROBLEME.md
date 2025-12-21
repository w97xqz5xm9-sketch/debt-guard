# 🔍 Backend-Probleme beheben

## Problem: Backend-Seite kann nicht geöffnet werden

### Schritt 1: Status prüfen

1. Gehe zu [dashboard.render.com](https://dashboard.render.com)
2. Öffne deinen Backend-Service (`debt-guard-backend`)
3. **Prüfe den Status:**
   - ✅ **"Live"** (grün) = Backend läuft
   - ⏳ **"Building"** = Backend wird noch gebaut (warte 5-10 Minuten)
   - ❌ **"Build failed"** = Build-Fehler (siehe Schritt 2)
   - ⚠️ **"Sleeping"** = Backend schläft (Free Plan, siehe Schritt 3)

---

## Schritt 2: Build-Fehler prüfen

### Wenn "Build failed" angezeigt wird:

1. Klicke auf **"Logs"** (links im Menü)
2. Scrolle nach unten zu den Fehlermeldungen
3. **Häufige Fehler:**

**Fehler 1: "Cannot find type definition file for 'node'"**
- **Lösung:** Build Command muss sein: `cd backend && npm install --include=dev && npm run build`
- Prüfe, ob der Build Command korrekt ist

**Fehler 2: "TypeScript errors"**
- **Lösung:** Prüfe die Logs für spezifische TypeScript-Fehler
- Meistens fehlen Type-Definitionen

**Fehler 3: "npm install failed"**
- **Lösung:** Prüfe, ob das Repository korrekt verbunden ist

---

## Schritt 3: Backend schläft (Free Plan)

### Wenn "Sleeping" angezeigt wird:

1. Das Backend schläft nach 15 Minuten Inaktivität
2. **Lösung:** 
   - Klicke auf **"Manual Deploy"** → **"Deploy latest commit"**
   - Oder warte 30 Sekunden und versuche es erneut (Backend wacht auf)

---

## Schritt 4: Backend testen

### Test 1: Health-Check Route

Öffne im Browser:
```
https://dein-backend-url.onrender.com/api/health
```

**Erwartetes Ergebnis:**
```json
{"status":"ok","message":"Debt Guard API is running"}
```

**Wenn das funktioniert:** ✅ Backend läuft!

**Wenn das nicht funktioniert:**
- Prüfe, ob die URL korrekt ist
- Prüfe, ob das Backend "Live" ist
- Prüfe die Logs

---

### Test 2: Root-Route

Öffne im Browser:
```
https://dein-backend-url.onrender.com
```

**Erwartetes Ergebnis:**
- `Cannot GET /` (das ist **normal**!)
- Das Backend hat keine Root-Route, nur API-Routes

**Wenn du einen anderen Fehler siehst:**
- Prüfe die Logs im Render Dashboard

---

## Schritt 5: Logs prüfen

1. Gehe zu deinem Backend-Service
2. Klicke auf **"Logs"** (links im Menü)
3. Prüfe die letzten Einträge:
   - ✅ **"Debt Guard Backend running on..."** = Backend läuft
   - ❌ **Fehlermeldungen** = Problem gefunden

---

## Schritt 6: Häufige Probleme

### Problem 1: "Connection refused" oder "Site can't be reached"
- **Ursache:** Backend läuft nicht oder ist noch nicht deployed
- **Lösung:** 
  - Prüfe den Status im Dashboard
  - Warte, bis "Live" grün wird
  - Prüfe die Logs

### Problem 2: "404 Not Found" bei `/api/health`
- **Ursache:** Route existiert nicht oder Backend läuft nicht richtig
- **Lösung:**
  - Prüfe die Logs
  - Stelle sicher, dass das Backend "Live" ist

### Problem 3: Backend startet immer wieder neu
- **Ursache:** Fehler beim Start
- **Lösung:**
  - Prüfe die Logs für Fehlermeldungen
  - Prüfe, ob alle Environment Variables gesetzt sind
  - Prüfe, ob Start Command korrekt ist: `cd backend && npm start`

---

## ✅ Checkliste

- [ ] Backend-Status ist "Live" (grün)
- [ ] Build Command: `cd backend && npm install --include=dev && npm run build`
- [ ] Start Command: `cd backend && npm start`
- [ ] Alle 3 Environment Variables sind gesetzt
- [ ] `/api/health` funktioniert
- [ ] Logs zeigen keine Fehler

---

## 🆘 Noch Probleme?

1. Kopiere die Fehlermeldung aus den Logs
2. Prüfe, ob alle Einstellungen korrekt sind
3. Versuche, das Backend neu zu deployen:
   - Klicke auf **"Manual Deploy"** → **"Deploy latest commit"**












