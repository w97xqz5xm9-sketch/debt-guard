# Dauerhaftes Deployment für Debt Guard

Diese Anleitung zeigt dir, wie du Debt Guard dauerhaft online stellst, sodass die App auch funktioniert, wenn dein Computer ausgeschaltet ist.

## Option 1: Render.com (Empfohlen - Einfach & Kostenlos)

Render.com bietet kostenlose Hosting-Optionen für Frontend und Backend.

### Schritt 1: Render.com Account erstellen

1. Gehe zu [render.com](https://render.com)
2. Erstelle einen kostenlosen Account (mit GitHub, Google oder Email)
3. Bestätige deine Email-Adresse

### Schritt 2: Backend deployen

1. **Neues Web Service erstellen:**
   - Klicke auf "New +" → "Web Service"
   - Verbinde dein GitHub Repository (oder lade den Code hoch)
   - Wähle das Repository `bank-brick`

2. **Konfiguration:**
   - **Name:** `debt-guard-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install && npm run build`
   - **Start Command:** `cd backend && npm start`
   - **Root Directory:** `/` (Root des Repos)

3. **Environment Variables:**
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (Render setzt automatisch PORT, aber wir setzen einen Fallback)
   - `ALLOW_PUBLIC_ACCESS` = `true`

4. **Plan:** Wähle "Free" (kostenlos)

5. Klicke auf "Create Web Service"

6. **Warte auf Deployment** (ca. 5-10 Minuten)
   - Notiere dir die URL: `https://debt-guard-backend.onrender.com`

### Schritt 3: Frontend deployen

1. **Neue Static Site erstellen:**
   - Klicke auf "New +" → "Static Site"
   - Verbinde das gleiche GitHub Repository

2. **Konfiguration:**
   - **Name:** `debt-guard-frontend`
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`

3. **Environment Variables:**
   - `VITE_API_URL` = `https://debt-guard-backend.onrender.com/api`
   - (Ersetze mit deiner tatsächlichen Backend-URL)

4. **Plan:** Wähle "Free" (kostenlos)

5. Klicke auf "Create Static Site"

6. **Warte auf Deployment** (ca. 3-5 Minuten)
   - Deine öffentliche URL: `https://debt-guard-frontend.onrender.com`

### Schritt 4: Frontend API-URL anpassen

Das Frontend muss wissen, wo das Backend ist. Wir müssen die API-Konfiguration anpassen:

1. Öffne `frontend/src/services/api.ts`
2. Ändere die baseURL, um die Environment Variable zu verwenden:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})
```

3. Committe und pushe die Änderung
4. Render wird automatisch neu deployen

### Schritt 5: CORS im Backend anpassen

Das Backend muss die Frontend-Domain erlauben:

1. Öffne `backend/src/index.ts`
2. Passe die CORS-Konfiguration an:

```typescript
app.use(cors({
  origin: process.env.ALLOW_PUBLIC_ACCESS === 'true' 
    ? '*' 
    : process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: !(process.env.ALLOW_PUBLIC_ACCESS === 'true'),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

3. Committe und pushe die Änderung

### Fertig! 🎉

Deine App ist jetzt dauerhaft online:
- **Frontend:** `https://debt-guard-frontend.onrender.com`
- **Backend:** `https://debt-guard-backend.onrender.com`

**Wichtig:**
- Die kostenlosen Render-Services schlafen nach 15 Minuten Inaktivität ein
- Beim ersten Aufruf nach dem Schlafmodus dauert es ca. 30 Sekunden zum Aufwachen
- Für Produktions-Apps empfiehlt sich ein bezahlter Plan (ab $7/Monat)

---

## Option 2: Vercel (Frontend) + Railway (Backend)

### Vercel für Frontend:

1. Gehe zu [vercel.com](https://vercel.com)
2. Verbinde dein GitHub Repository
3. Wähle das `frontend` Verzeichnis
4. Setze Environment Variable: `VITE_API_URL` = deine Backend-URL
5. Deploy!

### Railway für Backend:

1. Gehe zu [railway.app](https://railway.app)
2. Erstelle ein neues Projekt
3. Verbinde dein GitHub Repository
4. Wähle das `backend` Verzeichnis
5. Railway erkennt automatisch Node.js und deployt

---

## Option 3: Fly.io (Full-Stack)

Fly.io bietet kostenlose Hosting-Optionen:

1. Installiere Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Erstelle eine `fly.toml` für Backend und Frontend
3. Deploy mit: `fly deploy`

---

## Troubleshooting

### Backend startet nicht:
- Prüfe die Logs in Render Dashboard
- Stelle sicher, dass `PORT` Environment Variable gesetzt ist
- Prüfe, ob `npm run build` erfolgreich war

### Frontend kann Backend nicht erreichen:
- Prüfe die `VITE_API_URL` Environment Variable
- Stelle sicher, dass CORS im Backend richtig konfiguriert ist
- Prüfe die Browser-Konsole auf Fehler

### Services schlafen ein:
- Render Free Tier Services schlafen nach 15 Min Inaktivität
- Erste Anfrage nach dem Schlaf dauert ~30 Sekunden
- Lösung: Bezahlter Plan oder Keep-Alive Service

---

## Kosten

**Render.com Free Tier:**
- ✅ Kostenlos für immer
- ⚠️ Services schlafen nach 15 Min Inaktivität
- ✅ Automatische SSL-Zertifikate
- ✅ Automatische Deployments bei Git Push

**Upgrade auf bezahlten Plan:**
- $7/Monat pro Service (kein Schlafmodus)
- $25/Monat für beide Services zusammen

