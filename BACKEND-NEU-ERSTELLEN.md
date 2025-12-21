# 🚀 Backend neu erstellen - Schnell-Anleitung

## Schritt 1: Backend-Service erstellen

1. Gehe zu [dashboard.render.com](https://dashboard.render.com)
2. Klicke auf **"New +"** (oben rechts)
3. Wähle **"Web Service"**

## Schritt 2: Repository verbinden

1. Wähle dein **bank-brick** Repository
2. Klicke auf **"Connect"**

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

## Schritt 7: Warten und URL notieren

- Warte **5-10 Minuten**, bis "Live" grün wird
- **WICHTIG:** Kopiere die URL oben (z.B. `https://debt-guard-backend-xxxx.onrender.com`)
- Diese URL brauchst du gleich für das Frontend!

---

## Schritt 8: Frontend-URL aktualisieren

1. Gehe zu deinem **Frontend-Service** (`debt-guard-frontend`)
2. Klicke auf **"Environment"**
3. Suche nach `VITE_API_URL`
   - Wenn vorhanden: Bearbeite
   - Wenn nicht: Klicke "Add Environment Variable"
4. Trage ein:
   - Key: `VITE_API_URL`
   - Value: **Deine Backend-URL aus Schritt 7** + `/api`
     - Beispiel: `https://debt-guard-backend-xxxx.onrender.com/api`
5. Klicke **"Save Changes"**
6. Warte **3-5 Minuten**, bis das Frontend neu deployed ist

---

## ✅ Fertig!

Jetzt sollten beide Services laufen:
- **Backend:** `https://debt-guard-backend-xxxx.onrender.com`
- **Frontend:** `https://debt-guard-frontend.onrender.com`

Teste die App jetzt!












