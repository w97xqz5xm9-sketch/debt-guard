# Debt Guard Deployment Guide

## Optionen zum Teilen der App

### 1. Lokal teilen (Netzwerk)

**Für andere im gleichen Netzwerk:**

1. Finde deine lokale IP-Adresse:
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Oder
ipconfig getifaddr en0  # macOS
```

2. Starte die App mit der IP-Adresse:
```bash
# Backend anpassen (backend/src/index.ts)
# CORS erlauben für deine IP

# Frontend starten
cd frontend
npm run dev -- --host 0.0.0.0
```

3. Andere können dann zugreifen über: `http://DEINE-IP:3000`

### 2. Cloud-Deployment (Empfohlen)

#### Option A: Vercel (Frontend) + Railway/Render (Backend)

**Frontend auf Vercel:**
```bash
cd frontend
npm run build
# Dann auf vercel.com hochladen
```

**Backend auf Railway:**
- Railway.app Account erstellen
- GitHub Repo verbinden
- Backend deployen
- Environment Variables setzen

#### Option B: Render (Alles)

1. Render.com Account erstellen
2. Frontend als Static Site
3. Backend als Web Service
4. Beide deployen

### 3. Docker (Einfach zu teilen)

Erstelle eine `Dockerfile` und `docker-compose.yml` für einfaches Deployment.

### 4. GitHub Pages (Nur Frontend, statisch)

Für Demo-Zwecke, aber Backend muss separat gehostet werden.

## Schnellstart für lokales Teilen

1. **Backend CORS anpassen:**
```typescript
// backend/src/index.ts
app.use(cors({
  origin: '*', // Für Entwicklung - in Production spezifische Domains
  credentials: true
}))
```

2. **Frontend starten:**
```bash
cd frontend
npm run dev -- --host
```

3. **Backend starten:**
```bash
cd backend
npm run dev
```

4. **Link teilen:** `http://DEINE-IP:3000`

## Production Build

```bash
# Alles bauen
npm run build

# Frontend wird in frontend/dist gebaut
# Backend wird in backend/dist gebaut
```

