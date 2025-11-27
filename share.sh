#!/bin/bash

# Script zum Teilen der Debt Guard App im lokalen Netzwerk

echo "🌐 Debt Guard Netzwerk-Sharing"
echo "================================"
echo ""

# IP-Adresse finden
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "Nicht gefunden")
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    IP=$(hostname -I | awk '{print $1}')
else
    IP="Nicht gefunden"
fi

if [ "$IP" == "Nicht gefunden" ]; then
    echo "❌ IP-Adresse konnte nicht gefunden werden"
    echo "Bitte manuell finden mit: ifconfig oder ipconfig"
    exit 1
fi

echo "✅ Deine IP-Adresse: $IP"
echo ""
echo "📱 Andere können die App öffnen mit:"
echo "   http://$IP:3000"
echo ""
echo "⚠️  Wichtig:"
echo "   1. Backend muss laufen (Port 5001)"
echo "   2. Frontend muss mit --host gestartet werden"
echo "   3. Beide Geräte müssen im gleichen Netzwerk sein"
echo ""
echo "🚀 Starte Frontend mit Netzwerk-Zugriff:"
echo "   cd frontend && npm run dev -- --host"
echo ""

