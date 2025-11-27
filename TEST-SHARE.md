# Test: App mit anderen teilen

## Schritt-für-Schritt Anleitung

### 1. Backend starten
```bash
cd /Users/liamcremering/debt-guard/backend
npm run dev
```

**Wichtig:** Backend läuft jetzt auf `0.0.0.0:5001` - ist im Netzwerk erreichbar!

### 2. Frontend starten
```bash
cd /Users/liamcremering/debt-guard/frontend
npm run dev
```

**Wichtig:** Frontend läuft jetzt auf `0.0.0.0:3000` - ist im Netzwerk erreichbar!

### 3. IP-Adresse finden
Deine IP: **10.5.4.9**

### 4. Testen

**Auf deinem Computer:**
- http://localhost:3000 ✅
- http://10.5.4.9:3000 ✅

**Auf anderem Gerät (gleiches WLAN):**
- http://10.5.4.9:3000 ✅

### 5. Troubleshooting

**Problem: "Kann nicht verbinden"**
1. Prüfe, ob beide Geräte im gleichen WLAN sind
2. Prüfe Firewall:
   ```bash
   # macOS Firewall prüfen
   /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
   ```
3. Teste Backend direkt:
   ```bash
   curl http://10.5.4.9:5001/api/health
   ```
4. Teste Frontend direkt:
   ```bash
   curl http://10.5.4.9:3000
   ```

**Problem: "CORS Error"**
- Backend CORS ist auf `origin: '*'` gesetzt
- Sollte funktionieren - prüfe Browser-Konsole

**Problem: "API nicht erreichbar"**
- Das Vite-Proxy funktioniert nur für Requests vom gleichen Server
- Wenn das Problem besteht, müssen wir das Frontend anpassen, um die Backend-URL direkt zu verwenden

### 6. Alternative: Backend-URL direkt setzen

Falls das Proxy-Problem besteht, können wir das Frontend so anpassen, dass es die Backend-URL direkt verwendet:

```typescript
// In frontend/src/services/api.ts
const api = axios.create({
  baseURL: window.location.hostname === 'localhost' 
    ? '/api'  // Proxy für localhost
    : `http://10.5.4.9:5001/api`,  // Direkte URL für Netzwerk
  ...
})
```

