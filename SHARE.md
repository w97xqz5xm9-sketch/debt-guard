# Debt Guard mit anderen teilen

## Schnellstart

### 1. Backend starten
```bash
cd backend
npm run dev
```

### 2. Frontend starten (mit Netzwerk-Zugriff)
```bash
cd frontend
npm run dev
```
Das Frontend läuft jetzt automatisch mit `host: '0.0.0.0'` und ist im Netzwerk erreichbar.

### 3. IP-Adresse finden und teilen
```bash
npm run share
```

Oder manuell:
```bash
# macOS
ipconfig getifaddr en0

# Linux
hostname -I
```

### 4. Link teilen
Teile diesen Link mit anderen im gleichen WLAN:
```
http://DEINE-IP:3000
```

## Wichtige Hinweise

1. **Beide Geräte müssen im gleichen WLAN sein**
2. **Backend muss laufen** (Port 5001)
3. **Frontend muss laufen** (Port 3000)
4. **Firewall**: macOS/Linux Firewall könnte Ports blockieren

## Firewall prüfen

### macOS:
```bash
# Firewall Status prüfen
/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Falls aktiviert, Ports erlauben (optional)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
```

### Linux:
```bash
# UFW prüfen
sudo ufw status

# Falls aktiviert, Ports erlauben
sudo ufw allow 3000
sudo ufw allow 5001
```

## Troubleshooting

**Problem: "Connection refused"**
- Prüfe, ob Backend läuft: `curl http://localhost:5001/api/health`
- Prüfe, ob Frontend läuft: `curl http://localhost:3000`

**Problem: "CORS Error"**
- Backend CORS ist auf `origin: '*'` gesetzt - sollte funktionieren
- Prüfe Browser-Konsole für genaue Fehlermeldung

**Problem: "Kann nicht verbinden"**
- Prüfe, ob beide Geräte im gleichen Netzwerk sind
- Prüfe Firewall-Einstellungen
- Versuche `http://DEINE-IP:3000` direkt im Browser zu öffnen

