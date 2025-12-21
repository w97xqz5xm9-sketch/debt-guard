# ⚙️ Backend erstellen - Nur Backend

## Schritt 1: Backend erstellen

1. Gehe zu [dashboard.render.com](https://dashboard.render.com)
2. Klicke auf **"New +"** (oben rechts)
3. Wähle **"Web Service"**

## Schritt 2: Repository verbinden

- Wähle dein **bank-brick** Repository
- Klicke auf **"Connect"**

## Schritt 3: Einstellungen ausfüllen

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

## Schritt 4: Environment Variables hinzufügen

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

## Schritt 5: Plan wählen

- Wähle **"Free"** (kostenlos)

## Schritt 6: Erstellen

- Klicke auf **"Create Web Service"** (ganz unten)

## Schritt 7: Warten und URL notieren ⏳

- Warte **5-10 Minuten**, bis "Live" grün wird
- **WICHTIG:** Kopiere die URL oben (z.B. `https://debt-guard-backend-xxxx.onrender.com`)
- **Notiere dir diese URL!**

---

## Schritt 8: Backend testen

Öffne im Browser:
```
https://dein-backend-url.onrender.com/api/health
```

Du solltest sehen:
```json
{"status":"ok","message":"Debt Guard API is running"}
```

✅ **Wenn das funktioniert:** Weiter zu Schritt 9

---

## Schritt 9: Frontend-URL aktualisieren

1. Gehe zu deinem **Frontend-Service** (`debt-guard-frontend`)
2. Klicke auf **"Environment"** (links im Menü)
3. Suche nach `VITE_API_URL`
   - **Wenn vorhanden:** Klicke darauf und bearbeite
   - **Wenn nicht vorhanden:** Klicke **"Add Environment Variable"**

4. Trage ein:
   - **Key:** `VITE_API_URL`
   - **Value:** **Deine Backend-URL aus Schritt 7** + `/api`
     - Beispiel: Wenn Backend-URL `https://debt-guard-backend-abc123.onrender.com` ist
     - Dann Value: `https://debt-guard-backend-abc123.onrender.com/api`
     - **WICHTIG:** Muss mit `/api` enden!

5. Klicke **"Save Changes"**

6. Warte **3-5 Minuten**, bis das Frontend neu deployed ist

---

## ✅ Fertig!

Jetzt sollte alles funktionieren:
- **Backend:** `https://debt-guard-backend-xxxx.onrender.com`
- **Frontend:** Verbindet sich automatisch mit dem Backend

Teste die App jetzt!












