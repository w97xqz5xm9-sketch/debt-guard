#!/bin/bash

# Script zum Starten der App für Netzwerk-Sharing

echo "🚀 Starte Debt Guard für Netzwerk-Sharing..."
echo ""

# IP-Adresse finden
if [[ "$OSTYPE" == "darwin"* ]]; then
    IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "Nicht gefunden")
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    IP=$(hostname -I | awk '{print $1}')
else
    IP="Nicht gefunden"
fi

if [ "$IP" == "Nicht gefunden" ]; then
    echo "❌ IP-Adresse konnte nicht gefunden werden"
    exit 1
fi

echo "✅ Deine IP-Adresse: $IP"
echo ""
echo "📱 Andere können die App öffnen mit:"
echo "   http://$IP:3000"
echo ""
echo "⚠️  Wichtig:"
echo "   - Beide Geräte müssen im gleichen WLAN sein"
echo "   - Firewall könnte Ports blockieren"
echo ""
echo "🔄 Starte Backend und Frontend..."
echo ""

# Backend im Hintergrund starten
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend gestartet (PID: $BACKEND_PID)"

# Kurz warten
sleep 2

# Frontend im Hintergrund starten
cd ../frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend gestartet (PID: $FRONTEND_PID)"

echo ""
echo "✅ Beide Services laufen!"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛑 Zum Stoppen:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "🌐 App erreichbar unter: http://$IP:3000"
echo ""

# PIDs speichern
echo "$BACKEND_PID $FRONTEND_PID" > .pids

