# 🔍 Backend-URL prüfen und korrigieren

## Problem: "Keine Verbindung zum Backend"

Das Frontend kann das Backend nicht erreichen. Hier ist die Lösung:

---

## Schritt 1: Backend-URL finden

1. Gehe zu [dashboard.render.com](https://dashboard.render.com)
2. Öffne deinen **Backend-Service** (`debt-guard-backend`)
3. **Kopiere die URL oben** (z.B. `https://debt-guard-backend-xxxx.onrender.com`)
4. **WICHTIG:** Notiere dir diese URL!

---

## Schritt 2: Frontend-URL konfigurieren

1. Gehe zu deinem **Frontend-Service** (`debt-guard-frontend`)
2. Klicke auf **"Environment"** (links im Menü)
3. Suche nach der Variable `VITE_API_URL`

### Wenn die Variable NICHT existiert:
1. Klicke auf **"Add Environment Variable"**
2. **Key:** `VITE_API_URL`
3. **Value:** Deine Backend-URL aus Schritt 1 + `/api`
   - Beispiel: `https://debt-guard-backend-xxxx.onrender.com/api`
   - **WICHTIG:** Muss mit `/api` enden!
4. Klicke **"Save Changes"**

### Wenn die Variable existiert, aber falsch ist:
1. Klicke auf die Variable `VITE_API_URL`
2. Ändere den **Value** zu: Deine Backend-URL + `/api`
   - Beispiel: `https://debt-guard-backend-xxxx.onrender.com/api`
3. Klicke **"Save Changes"**

---

## Schritt 3: Backend prüfen

1. Öffne deine **Backend-URL** im Browser
   - Beispiel: `https://debt-guard-backend-xxxx.onrender.com`
2. Du solltest sehen: `Cannot GET /` (das ist normal!)
3. Teste die Health-Check Route:
   - `https://debt-guard-backend-xxxx.onrender.com/api/health`
   - Du solltest sehen: `{"status":"ok","message":"Debt Guard API is running"}`

**Wenn das nicht funktioniert:**
- Das Backend läuft nicht oder ist noch nicht deployed
- Prüfe die Backend-Logs im Render Dashboard

---

## Schritt 4: Warten und testen

1. Nach dem Speichern der Environment Variable startet Render automatisch ein neues Deployment
2. Warte **3-5 Minuten**, bis "Live" grün wird
3. Öffne deine Frontend-URL
4. Versuche das Setup erneut

---

## Checkliste:

- [ ] Backend-URL notiert: `https://...`
- [ ] Frontend Environment Variable `VITE_API_URL` gesetzt
- [ ] Value endet mit `/api`
- [ ] Backend Health-Check funktioniert (`/api/health`)
- [ ] Frontend neu deployed (3-5 Minuten gewartet)

---

## Beispiel-Konfiguration:

**Backend-Service:**
- URL: `https://debt-guard-backend-abc123.onrender.com`

**Frontend-Service Environment Variable:**
- Key: `VITE_API_URL`
- Value: `https://debt-guard-backend-abc123.onrender.com/api`

---

## Noch Probleme?

1. Öffne die Browser-Konsole (F12 → Console)
2. Versuche das Setup erneut
3. Kopiere die Fehlermeldung aus der Konsole
4. Prüfe die Network-Tab (F12 → Network) für fehlgeschlagene Requests



