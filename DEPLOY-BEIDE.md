# 🚀 Debt Guard - Beide Services deployen

## Schritt-für-Schritt Anleitung

### ⚙️ Schritt 1: Backend deployen

1. **Gehe zu Render Dashboard:**
   - Öffne [dashboard.render.com](https://dashboard.render.com)
   - Klicke auf **"New +"** (oben rechts)
   - Wähle **"Web Service"**

2. **Repository verbinden:**
   - Wähle dein **bank-brick** Repository
   - Klicke auf **"Connect"**

3. **Einstellungen ausfüllen:**

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

4. **Environment Variables hinzufügen:**

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

5. **Plan:**
   - Wähle **"Free"**

6. **Erstellen:**
   - Klicke auf **"Create Web Service"** (ganz unten)

7. **Warten und URL notieren:**
   - Warte 5-10 Minuten, bis "Live" grün wird
   - **WICHTIG:** Kopiere die URL oben (z.B. `https://debt-guard-backend-xxxx.onrender.com`)
   - Diese URL brauchst du gleich für das Frontend!

---

### 🎨 Schritt 2: Frontend deployen

1. **Gehe zu Render Dashboard:**
   - Klicke wieder auf **"New +"** (oben rechts)
   - Diesmal wähle **"Static Site"**

2. **Repository verbinden:**
   - Wähle wieder dein **bank-brick** Repository
   - Klicke auf **"Connect"**

3. **Einstellungen ausfüllen:**

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

4. **Environment Variable hinzufügen (WICHTIG!):**

   - Scrolle zu **"Environment Variables"**
   - Klicke auf **"Add Environment Variable"**
   - Key: `VITE_API_URL`
   - Value: **Deine Backend-URL aus Schritt 1** + `/api`
     - Beispiel: `https://debt-guard-backend-xxxx.onrender.com/api`
     - **Wichtig:** Muss mit `/api` enden!

5. **Plan:**
   - Wähle **"Free"**

6. **Erstellen:**
   - Klicke auf **"Create Static Site"**

7. **Warten:**
   - Warte 3-5 Minuten, bis "Live" grün wird
   - Die Frontend-URL ist dann deine fertige App! 🎉

---

## ✅ Fertig!

Deine App ist jetzt dauerhaft online:
- **Frontend:** `https://debt-guard-frontend.onrender.com` (diese URL teilen!)
- **Backend:** `https://debt-guard-backend-xxxx.onrender.com`

---

## ⚠️ Wichtige Hinweise

1. **Kostenlos:** Beide Services sind kostenlos
2. **Schlafmodus:** Nach 15 Min Inaktivität schlafen die Services ein
   - Erster Aufruf nach dem Schlaf dauert ~30 Sekunden
3. **Automatische Updates:** Bei jedem Git Push wird automatisch neu deployed

---

## 🆘 Probleme?

**Backend zeigt "Cannot GET":**
- Das ist normal! Das Backend hat keine Root-Route
- Teste: `https://dein-backend-url.onrender.com/api/health`
- Sollte `{"status":"ok",...}` zurückgeben

**Frontend zeigt Fehler:**
- Prüfe, ob `VITE_API_URL` die richtige Backend-URL hat
- Backend-URL muss mit `/api` enden
- Prüfe Browser-Konsole (F12) für Fehler

**Build-Fehler:**
- Prüfe die Logs im Render Dashboard
- Stelle sicher, dass alle Commands korrekt sind


