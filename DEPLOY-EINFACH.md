# 🚀 Debt Guard - Dauerhaft online stellen (Einfach)

## Was du brauchst:
- ✅ GitHub Account (hast du schon)
- ✅ Render.com Account (hast du schon verbunden)

---

## 📦 Schritt 1: Backend online stellen

### 1.1 Neues Service erstellen
1. Gehe zu [render.com/dashboard](https://dashboard.render.com)
2. Klicke auf den großen blauen Button **"New +"** (oben rechts)
3. Klicke auf **"Web Service"**

### 1.2 Repository wählen
- Wähle dein **bank-brick** Repository aus
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
cd backend && npm install && npm run build
```

**Start Command:**
```
cd backend && npm start
```

### 1.4 Environment Variables (wichtig!)

1. Scrolle nach unten zu **"Environment Variables"**
2. Klicke auf **"Add Environment Variable"**
3. Füge diese 3 Variablen hinzu:

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

### 1.7 Warten ⏳
- Warte 5-10 Minuten, bis "Live" grün wird
- **WICHTIG:** Notiere dir die URL oben (z.B. `https://debt-guard-backend-xxxx.onrender.com`)
- Diese URL brauchst du gleich!

---

## 🎨 Schritt 2: Frontend online stellen

### 2.1 Neues Service erstellen
1. Klicke wieder auf **"New +"** (oben rechts)
2. Diesmal klicke auf **"Static Site"**

### 2.2 Repository wählen
- Wähle wieder dein **bank-brick** Repository
- Klicke auf **"Connect"**

### 2.3 Einstellungen ausfüllen

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

### 2.4 Environment Variable (wichtig!)

1. Scrolle zu **"Environment Variables"**
2. Klicke auf **"Add Environment Variable"**
3. Füge diese Variable hinzu:

**Variable:**
- Key: `VITE_API_URL`
- Value: **Deine Backend-URL aus Schritt 1.7** + `/api`
  - Beispiel: `https://debt-guard-backend-xxxx.onrender.com/api`

### 2.5 Plan wählen
- Wähle **"Free"** (kostenlos)

### 2.6 Erstellen
- Klicke auf **"Create Static Site"**

### 2.7 Warten ⏳
- Warte 3-5 Minuten
- Wenn "Live" grün wird, ist deine App fertig! 🎉

---

## ✅ Fertig!

Deine App ist jetzt dauerhaft online:
- **Frontend:** `https://debt-guard-frontend.onrender.com`
- **Backend:** `https://debt-guard-backend-xxxx.onrender.com`

**Teile die Frontend-URL mit anderen!** 🚀

---

## ⚠️ Wichtige Hinweise

1. **Kostenlos:** Beide Services sind kostenlos
2. **Schlafmodus:** Nach 15 Min Inaktivität schlafen die Services ein
   - Erster Aufruf nach dem Schlaf dauert ~30 Sekunden
3. **Automatische Updates:** Bei jedem Git Push wird automatisch neu deployed

---

## 🆘 Probleme?

**Backend startet nicht:**
- Prüfe die Logs im Render Dashboard
- Stelle sicher, dass alle Environment Variables gesetzt sind

**Frontend zeigt Fehler:**
- Prüfe, ob `VITE_API_URL` die richtige Backend-URL hat
- Backend-URL muss mit `/api` enden

**Services schlafen ein:**
- Das ist normal im Free Plan
- Erste Anfrage nach dem Schlaf dauert ~30 Sekunden

