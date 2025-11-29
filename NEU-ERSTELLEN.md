# 🚀 Alles neu erstellen - Schritt für Schritt

## ✅ Entscheidung: Was ist was?

### Backend = **"Web Service"** ✅
- **Warum:** Node.js Express Server, der dauerhaft läuft
- **Macht:** Verarbeitet API-Requests, speichert Daten, berechnet Budgets
- **Braucht:** Laufenden Server-Prozess
- **Typ:** **"Web Service"** (Node.js)

### Frontend = **"Static Site"** ✅
- **Warum:** React App wird zu statischen HTML/CSS/JS Dateien gebaut
- **Macht:** Zeigt die Benutzeroberfläche, sendet Requests an Backend
- **Braucht:** Nur statische Dateien (kein Server)
- **Typ:** **"Static Site"**

---

## Schritt 1: Backend als "Web Service" erstellen

### 1.1 Neues Backend erstellen

1. Gehe zu [dashboard.render.com](https://dashboard.render.com)
2. Klicke auf **"New +"** (oben rechts)
3. Wähle **"Web Service"** ⚠️ WICHTIG: "Web Service", nicht "Static Site"!

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

---

## Schritt 3: Frontend als "Static Site" erstellen

### 3.1 Neues Frontend erstellen

1. Gehe zu [dashboard.render.com](https://dashboard.render.com)
2. Klicke auf **"New +"** (oben rechts)
3. Wähle **"Static Site"** ⚠️ WICHTIG: "Static Site", nicht "Web Service"!

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

### 3.4 Environment Variable hinzufügen

1. Scrolle zu **"Environment Variables"**
2. Klicke auf **"Add Environment Variable"**
3. Key: `VITE_API_URL`
4. Value: **Deine Backend-URL aus Schritt 1.7** + `/api`
   - Beispiel: Wenn Backend-URL `https://debt-guard-backend-abc123.onrender.com` ist
   - Dann Value: `https://debt-guard-backend-abc123.onrender.com/api`
   - **Wichtig:** Muss mit `/api` enden!

### 3.5 Plan wählen

- Wähle **"Free"** (kostenlos)

### 3.6 Erstellen

- Klicke auf **"Create Static Site"**

### 3.7 Warten ⏳

- Warte **3-5 Minuten**, bis "Live" grün wird

---

## ✅ Zusammenfassung

| Service | Typ | Warum |
|---------|-----|-------|
| **Backend** | **"Web Service"** | Node.js Server muss dauerhaft laufen |
| **Frontend** | **"Static Site"** | Nur statische HTML/CSS/JS Dateien |

---

## ✅ Checkliste

- [ ] Backend als **"Web Service"** erstellt
- [ ] Backend "Live" ist grün
- [ ] Backend-URL notiert
- [ ] Backend Health-Check funktioniert (`/api/health`)
- [ ] Frontend als **"Static Site"** erstellt
- [ ] Frontend Environment Variable `VITE_API_URL` gesetzt
- [ ] Value endet mit `/api`
- [ ] Frontend "Live" ist grün

---

## ✅ Fertig!

Jetzt sollten beide Services korrekt laufen:
- **Backend:** `https://debt-guard-backend-xxxx.onrender.com` (Web Service)
- **Frontend:** `https://debt-guard-frontend.onrender.com` (Static Site)

Teste die App jetzt!



