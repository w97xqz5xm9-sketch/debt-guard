# Debt Guard - Öffentlicher Zugriff

Damit Personen aus anderen Netzwerken auf die App zugreifen können, gibt es mehrere Optionen:

## Option 1: ngrok (Empfohlen für Tests)

### Installation

1. **ngrok installieren:**
   ```bash
   # macOS
   brew install ngrok/ngrok/ngrok
   
   # Oder Download von: https://ngrok.com/download
   ```

2. **ngrok Account erstellen:**
   - Gehe zu https://ngrok.com
   - Erstelle kostenlosen Account
   - Kopiere deinen Authtoken

3. **Authtoken setzen:**
   ```bash
   ngrok config add-authtoken DEIN_TOKEN
   ```

### Verwendung

```bash
# Script ausführen
chmod +x tunnel-ngrok.sh
./tunnel-ngrok.sh
```

Das Script:
- Startet Backend und Frontend
- Erstellt ngrok Tunnel
- Zeigt dir die öffentliche URL

**Vorteile:**
- ✅ Sehr einfach
- ✅ Kostenlos (mit Limits)
- ✅ Funktioniert sofort
- ✅ HTTPS automatisch

**Nachteile:**
- ⚠️ URL ändert sich bei jedem Start (kostenlose Version)
- ⚠️ Begrenzte Bandbreite (kostenlos)

---

## Option 2: Cloudflare Tunnel (Kostenlos, kein Account nötig)

### Installation

```bash
# macOS
brew install cloudflare/cloudflare/cloudflared

# Oder Download von:
# https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
```

### Verwendung

```bash
# Script ausführen
chmod +x tunnel-cloudflare.sh
./tunnel-cloudflare.sh
```

**Vorteile:**
- ✅ Komplett kostenlos
- ✅ Kein Account nötig
- ✅ HTTPS automatisch
- ✅ Einfach zu nutzen

**Nachteile:**
- ⚠️ URL ändert sich bei jedem Start
- ⚠️ Etwas langsamer als ngrok

---

## Option 3: Cloud-Deployment (Dauerhafte Lösung)

Für eine dauerhafte, stabile Lösung:

### Vercel (Frontend) + Railway (Backend)

1. **Frontend auf Vercel:**
   ```bash
   cd frontend
   npm run build
   # Dann auf vercel.com hochladen
   ```

2. **Backend auf Railway:**
   - Railway.app Account erstellen
   - GitHub Repo verbinden
   - Backend deployen
   - Environment Variables setzen

3. **Frontend anpassen:**
   - Backend-URL in `frontend/src/services/api.ts` setzen
   - Oder Environment Variable `VITE_API_URL` verwenden

**Vorteile:**
- ✅ Dauerhafte URL
- ✅ Professionell
- ✅ Skalierbar
- ✅ Kostenlos für kleine Apps

---

## Option 4: Manuell mit ngrok

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: ngrok
ngrok http 3000
```

Dann die ngrok URL teilen (z.B. `https://abc123.ngrok.io`)

---

## Wichtig: Backend CORS anpassen

Für öffentlichen Zugriff muss das Backend alle Origins erlauben:

```typescript
// backend/src/index.ts
app.use(cors({
  origin: '*', // Für öffentlichen Zugriff
  credentials: false,
}))
```

**⚠️ Sicherheitshinweis:** `origin: '*'` nur für Entwicklung/Testing verwenden. In Production spezifische Domains erlauben!

---

## Schnellstart

1. **ngrok installieren** (siehe oben)
2. **Script ausführen:**
   ```bash
   chmod +x tunnel-ngrok.sh
   ./tunnel-ngrok.sh
   ```
3. **URL teilen** - die angezeigte URL funktioniert von überall!

---

## Troubleshooting

**Problem: "CORS Error"**
- Backend CORS auf `origin: '*'` setzen (siehe oben)

**Problem: "API nicht erreichbar"**
- Das Frontend-Proxy funktioniert nur lokal
- Für öffentlichen Zugriff: Backend-URL direkt im Frontend setzen
- Oder: Backend auch mit ngrok tunneln und URL im Frontend verwenden

**Problem: "ngrok URL ändert sich"**
- Kostenlose ngrok-Version: URL ändert sich bei jedem Start
- Lösung: Bezahlte ngrok-Version oder Cloud-Deployment

