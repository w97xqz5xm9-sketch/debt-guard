# 🚀 Schritt für Schritt - Beide Services erstellen

## 📋 Übersicht

Wir erstellen:
1. **Backend** als **"Web Service"** (Node.js Server)
2. **Frontend** als **"Static Site"** (React Build)

---

## ⚙️ TEIL 1: Backend erstellen

### Schritt 1.1: Render öffnen
1. Gehe zu [dashboard.render.com](https://dashboard.render.com)
2. Logge dich ein (falls nötig)

### Schritt 1.2: Neues Backend starten
1. Klicke auf den großen blauen Button **"New +"** (oben rechts)
2. Es öffnet sich ein Menü
3. Klicke auf **"Web Service"** ⚠️ NICHT "Static Site"!

### Schritt 1.3: Repository verbinden
1. Du siehst eine Liste mit deinen GitHub Repositories
2. Suche nach **"bank-brick"** oder **"debt-guard"**
3. Klicke auf **"Connect"** neben dem Repository

### Schritt 1.4: Name eingeben
1. Im Feld **"Name"** tippe:
   ```
   debt-guard-backend
   ```

### Schritt 1.5: Region wählen
1. Bei **"Region"** wähle die nächstgelegene
   - Beispiel: **"Frankfurt (Germany)"** oder **"Oregon (US)"**

### Schritt 1.6: Branch wählen
1. Bei **"Branch"** tippe:
   ```
   main
   ```

### Schritt 1.7: Root Directory
1. Bei **"Root Directory"** → **LASS ES LEER!**
   - Nichts eintragen, einfach leer lassen

### Schritt 1.8: Runtime wählen
1. Bei **"Runtime"** wähle:
   - **"Node"**

### Schritt 1.9: Build Command eingeben
1. Bei **"Build Command"** tippe:
   ```
   cd backend && npm install --include=dev && npm run build
   ```

### Schritt 1.10: Start Command eingeben
1. Bei **"Start Command"** tippe:
   ```
   cd backend && npm start
   ```

### Schritt 1.11: Environment Variables hinzufügen
1. Scrolle nach unten zu **"Environment Variables"**
2. Klicke auf **"Add Environment Variable"**

**Variable 1:**
- **Key:** `NODE_ENV`
- **Value:** `production`
- Klicke **"Add"** oder **"Save"**

**Variable 2:**
- Klicke wieder **"Add Environment Variable"**
- **Key:** `ALLOW_PUBLIC_ACCESS`
- **Value:** `true`
- Klicke **"Add"** oder **"Save"**

**Variable 3:**
- Klicke wieder **"Add Environment Variable"**
- **Key:** `PORT`
- **Value:** `10000`
- Klicke **"Add"** oder **"Save"**

### Schritt 1.12: Plan wählen
1. Bei **"Plan"** wähle:
   - **"Free"** (kostenlos)

### Schritt 1.13: Erstellen
1. Scrolle ganz nach unten
2. Klicke auf den großen Button **"Create Web Service"**

### Schritt 1.14: Warten ⏳
1. Du siehst jetzt den Build-Prozess
2. Warte **5-10 Minuten**, bis "Live" grün wird
3. **WICHTIG:** Kopiere die URL oben (z.B. `https://debt-guard-backend-xxxx.onrender.com`)
4. **Notiere dir diese URL!** Du brauchst sie gleich!

### Schritt 1.15: Backend testen
1. Öffne einen neuen Browser-Tab
2. Gehe zu: `https://dein-backend-url.onrender.com/api/health`
   - (Ersetze `dein-backend-url` mit deiner tatsächlichen URL)
3. Du solltest sehen: `{"status":"ok","message":"Debt Guard API is running"}`
4. ✅ **Wenn das funktioniert:** Weiter zu Teil 2!

---

## 🎨 TEIL 2: Frontend erstellen

### Schritt 2.1: Neues Frontend starten
1. Gehe zurück zu [dashboard.render.com](https://dashboard.render.com)
2. Klicke wieder auf **"New +"** (oben rechts)
3. Diesmal klicke auf **"Static Site"** ⚠️ NICHT "Web Service"!

### Schritt 2.2: Repository verbinden
1. Wähle wieder dein **bank-brick** Repository
2. Klicke auf **"Connect"**

### Schritt 2.3: Name eingeben
1. Im Feld **"Name"** tippe:
   ```
   debt-guard-frontend
   ```

### Schritt 2.4: Branch wählen
1. Bei **"Branch"** tippe:
   ```
   main
   ```

### Schritt 2.5: Root Directory
1. Bei **"Root Directory"** → **LASS ES LEER!**
   - Nichts eintragen

### Schritt 2.6: Build Command eingeben
1. Bei **"Build Command"** tippe:
   ```
   cd frontend && npm install && npm run build
   ```

### Schritt 2.7: Publish Directory eingeben
1. Bei **"Publish Directory"** tippe:
   ```
   frontend/dist
   ```

### Schritt 2.8: Environment Variable hinzufügen
1. Scrolle zu **"Environment Variables"**
2. Klicke auf **"Add Environment Variable"**
3. **Key:** `VITE_API_URL`
4. **Value:** **Deine Backend-URL aus Schritt 1.14** + `/api`
   - Beispiel: Wenn deine Backend-URL `https://debt-guard-backend-abc123.onrender.com` ist
   - Dann Value: `https://debt-guard-backend-abc123.onrender.com/api`
   - **WICHTIG:** Muss mit `/api` enden!
5. Klicke **"Add"** oder **"Save"**

### Schritt 2.9: Plan wählen
1. Bei **"Plan"** wähle:
   - **"Free"** (kostenlos)

### Schritt 2.10: Erstellen
1. Scrolle ganz nach unten
2. Klicke auf **"Create Static Site"**

### Schritt 2.11: Warten ⏳
1. Du siehst jetzt den Build-Prozess
2. Warte **3-5 Minuten**, bis "Live" grün wird

---

## ✅ Fertig!

Jetzt sollten beide Services laufen:
- **Backend:** `https://debt-guard-backend-xxxx.onrender.com` (Web Service)
- **Frontend:** `https://debt-guard-frontend.onrender.com` (Static Site)

### Testen:
1. Öffne deine Frontend-URL
2. Gehe zum Setup
3. Wähle ein Sparziel
4. Klicke "Setup starten"

✅ **Wenn das funktioniert:** Alles ist fertig! 🎉

---

## 🆘 Hilfe

Wenn etwas nicht funktioniert:
1. Prüfe die Logs im Render Dashboard
2. Prüfe, ob alle Commands korrekt sind
3. Prüfe, ob die Environment Variables gesetzt sind
4. Warte noch ein paar Minuten (manchmal dauert es länger)

