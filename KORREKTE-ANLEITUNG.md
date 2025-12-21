# ✅ Korrekte Anleitung - Backend und Frontend

## Wichtig: Unterschied zwischen Backend und Frontend

- **Backend** = Node.js Server = **"Web Service"** (läuft dauerhaft)
- **Frontend** = React Build = **"Static Site"** (nur statische Dateien)

---

## Schritt 1: Backend als "Web Service" erstellen

### 1.1 Neues Backend erstellen

1. Gehe zu [dashboard.render.com](https://dashboard.render.com)
2. Klicke auf **"New +"** (oben rechts)
3. Wähle **"Web Service"** ⚠️ NICHT "Static Site"!

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
- **Notiere dir diese URL!**

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

## Schritt 3: Frontend als "Static Site" (falls noch nicht vorhanden)

### 3.1 Frontend-Service erstellen

1. Gehe zu [dashboard.render.com](https://dashboard.render.com)
2. Klicke auf **"New +"** (oben rechts)
3. Wähle **"Static Site"** ⚠️ NICHT "Web Service"!

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
   - Beispiel: `https://debt-guard-backend-xxxx.onrender.com/api`
   - **Wichtig:** Muss mit `/api` enden!

### 3.5 Plan wählen

- Wähle **"Free"** (kostenlos)

### 3.6 Erstellen

- Klicke auf **"Create Static Site"**

### 3.7 Warten ⏳

- Warte **3-5 Minuten**, bis "Live" grün wird

---

## Schritt 4: Frontend-URL aktualisieren (falls Frontend bereits existiert)

1. Gehe zu deinem **Frontend-Service** (`debt-guard-frontend`)
2. Klicke auf **"Environment"** (links im Menü)
3. Suche nach `VITE_API_URL`
   - **Wenn vorhanden:** Klicke darauf und bearbeite
   - **Wenn nicht vorhanden:** Klicke **"Add Environment Variable"**

4. Trage ein:
   - **Key:** `VITE_API_URL`
   - **Value:** **Deine Backend-URL aus Schritt 1.7** + `/api`
     - Beispiel: `https://debt-guard-backend-xxxx.onrender.com/api`

5. Klicke **"Save Changes"**

6. Warte **3-5 Minuten**, bis das Frontend neu deployed ist

---

## ✅ Zusammenfassung

| Service | Typ | Warum |
|---------|-----|-------|
| **Backend** | **Web Service** | Node.js Server muss dauerhaft laufen |
| **Frontend** | **Static Site** | Nur statische HTML/CSS/JS Dateien |

---

## 🆘 Wenn du das Backend versehentlich als "Static Site" erstellt hast:

1. Lösche den falschen Service
2. Erstelle ihn neu als **"Web Service"** (siehe Schritt 1)

Ein Backend **muss** ein "Web Service" sein, sonst funktioniert es nicht!

---

## ✅ Fertig!

Jetzt sollten beide Services korrekt laufen:
- **Backend:** `https://debt-guard-backend-xxxx.onrender.com` (Web Service)
- **Frontend:** `https://debt-guard-frontend.onrender.com` (Static Site)

Teste die App jetzt!












