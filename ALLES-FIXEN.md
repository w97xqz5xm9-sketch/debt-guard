# 🔧 Alles fixen - Komplette Anleitung

## Schritt 1: Backend erstellen/deployen

### 1.1 Neues Backend erstellen

1. Gehe zu [dashboard.render.com](https://dashboard.render.com)
2. Klicke auf **"New +"** (oben rechts)
3. Wähle **"Web Service"**

### 1.2 Repository verbinden

- Wähle dein **bank-brick** Repository
- Klicke auf **"Connect"**

### 1.3 Einstellungen ausfüllen

**Name:**
```
debt-guard-backend
```

**Region:**
- Wähle die nächstgelegene (z.B. Frankfurt)

**Branch:**
```
main
```

**Root Directory:**
- **Leer lassen** (nichts eintragen)

**Runtime:**
- Wähle **"Node"**

**Build Command:**
```
cd backend && npm install --include=dev && npm run build
```

**Start Command:**
```
cd backend && npm start
```

### 1.4 Environment Variables hinzufügen

Klicke auf **"Add Environment Variable"** und füge diese 3 Variablen hinzu:

**Variable 1:**
- Key: `NODE_ENV`
- Value: `production`

**Variable 2:**
- Key: `ALLOW_PUBLIC_ACCESS`
- Value: `true`

**Variable 3:**
- Key: `PORT`
- Value: `10000`

### 1.5 Plan wählen

- Wähle **"Free"** (kostenlos)

### 1.6 Erstellen

- Klicke auf **"Create Web Service"** (ganz unten)

### 1.7 Warten und URL notieren ⏳

- Warte **5-10 Minuten**, bis "Live" grün wird
- **WICHTIG:** Kopiere die URL oben (z.B. `https://debt-guard-backend-xxxx.onrender.com`)
- **Notiere dir diese URL!** Du brauchst sie gleich!

---

## Schritt 2: Backend testen

Öffne im Browser:
```
https://dein-backend-url.onrender.com/api/health
```

Du solltest sehen:
```json
{"status":"ok","message":"Debt Guard API is running"}
```

✅ **Wenn das funktioniert:** Weiter zu Schritt 3
❌ **Wenn das nicht funktioniert:** Prüfe die Backend-Logs im Render Dashboard

---

## Schritt 3: Frontend erstellen/deployen

### 3.1 Frontend-Service erstellen (falls nicht vorhanden)

1. Gehe zu [dashboard.render.com](https://dashboard.render.com)
2. Klicke auf **"New +"** (oben rechts)
3. Wähle **"Static Site"** (NICHT Web Service!)

### 3.2 Repository verbinden

- Wähle dein **bank-brick** Repository
- Klicke auf **"Connect"**

### 3.3 Einstellungen ausfüllen

**Name:**
```
debt-guard-frontend
```

**Branch:**
```
main
```

**Root Directory:**
- **Leer lassen**

**Build Command:**
```
cd frontend && npm install && npm run build
```

**Publish Directory:**
```
frontend/dist
```

### 3.4 Environment Variable setzen

1. Klicke auf **"Environment"** (links im Menü)
2. Suche nach `VITE_API_URL`
   - **Wenn vorhanden:** Klicke darauf und bearbeite
   - **Wenn nicht vorhanden:** Klicke **"Add Environment Variable"**

3. Trage ein:
   - **Key:** `VITE_API_URL`
   - **Value:** **Deine Backend-URL aus Schritt 1.7** + `/api`
     - Beispiel: Wenn Backend-URL `https://debt-guard-backend-abc123.onrender.com` ist
     - Dann Value: `https://debt-guard-backend-abc123.onrender.com/api`
     - **WICHTIG:** Muss mit `/api` enden!

4. Klicke **"Save Changes"**

### 3.5 Plan wählen

- Wähle **"Free"** (kostenlos)

### 3.6 Erstellen

- Klicke auf **"Create Static Site"**

### 3.7 Warten ⏳

- Render startet automatisch ein neues Deployment
- Warte **3-5 Minuten**, bis "Live" grün wird

---

## Schritt 4: Testen

1. Öffne deine **Frontend-URL** (z.B. `https://debt-guard-frontend.onrender.com`)
2. Gehe zum **Setup**
3. Wähle ein Sparziel (z.B. 100€)
4. Klicke **"Setup starten"**

✅ **Wenn es funktioniert:** Alles ist fertig! 🎉
❌ **Wenn es nicht funktioniert:** Siehe "Troubleshooting" unten

---

## ✅ Checkliste

- [ ] Backend erstellt und "Live" ist grün
- [ ] Backend-URL notiert
- [ ] Backend Health-Check funktioniert (`/api/health`)
- [ ] Frontend Environment Variable `VITE_API_URL` gesetzt
- [ ] Value endet mit `/api`
- [ ] Frontend neu deployed (3-5 Minuten gewartet)
- [ ] Setup funktioniert

---

## 🆘 Troubleshooting

### Problem: "Keine Verbindung zum Backend"

**Lösung:**
1. Prüfe, ob Backend "Live" ist (grüner Status)
2. Prüfe Backend-URL: Öffne `/api/health` im Browser
3. Prüfe Frontend Environment Variable `VITE_API_URL`
   - Muss die Backend-URL + `/api` sein
   - Beispiel: `https://debt-guard-backend-xxxx.onrender.com/api`
4. Warte 3-5 Minuten nach dem Ändern der Environment Variable

### Problem: Backend zeigt "Cannot GET /"

**Das ist normal!** Das Backend hat keine Root-Route.
- Teste stattdessen: `/api/health`
- Sollte `{"status":"ok",...}` zurückgeben

### Problem: Frontend zeigt Fehler

1. Öffne Browser-Konsole (F12 → Console)
2. Prüfe Network-Tab (F12 → Network)
3. Suche nach fehlgeschlagenen Requests
4. Prüfe, ob die Request-URL korrekt ist

### Problem: Backend startet nicht

1. Prüfe die Backend-Logs im Render Dashboard
2. Prüfe, ob alle Environment Variables gesetzt sind
3. Prüfe, ob Build Command korrekt ist: `cd backend && npm install --include=dev && npm run build`

---

## 📝 Wichtige URLs

Nach dem Setup hast du:
- **Backend:** `https://debt-guard-backend-xxxx.onrender.com`
- **Frontend:** `https://debt-guard-frontend.onrender.com`
- **Backend Health:** `https://debt-guard-backend-xxxx.onrender.com/api/health`

---

## 🎉 Fertig!

Wenn alles funktioniert, ist deine App jetzt dauerhaft online und funktioniert auch wenn dein Computer ausgeschaltet ist!

