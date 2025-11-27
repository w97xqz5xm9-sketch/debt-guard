#!/bin/bash

# Script zum Starten der App mit ngrok-Tunnel für öffentlichen Zugriff

echo "🌐 Debt Guard - Öffentlicher Zugriff mit ngrok"
echo "=============================================="
echo ""

# Prüfe ob ngrok installiert ist
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok ist nicht installiert!"
    echo ""
    echo "📥 Installation:"
    echo "   macOS: brew install ngrok/ngrok/ngrok"
    echo "   Oder: https://ngrok.com/download"
    echo ""
    echo "🔑 Dann ngrok Account erstellen und authtoken setzen:"
    echo "   ngrok config add-authtoken DEIN_TOKEN"
    echo ""
    exit 1
fi

echo "✅ ngrok gefunden"
echo ""

# Starte Backend im Hintergrund
echo "🚀 Starte Backend..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend gestartet (PID: $BACKEND_PID)"
sleep 2

# Starte Frontend im Hintergrund
echo "🚀 Starte Frontend..."
cd ../frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend gestartet (PID: $FRONTEND_PID)"
sleep 3

# Starte ngrok Tunnel für Frontend
echo ""
echo "🌐 Starte ngrok Tunnel..."
echo "   Frontend wird auf Port 3000 getunnelt"
echo ""

# ngrok starten
ngrok http 3000 > ../ngrok.log 2>&1 &
NGROK_PID=$!
sleep 3

# Hole ngrok URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*\.ngrok[^"]*' | head -1)

if [ -z "$NGROK_URL" ]; then
    echo "⚠️  Konnte ngrok URL nicht automatisch abrufen"
    echo "   Öffne http://localhost:4040 in deinem Browser"
    echo "   Dort findest du die öffentliche URL"
else
    echo "✅ Öffentliche URL:"
    echo "   $NGROK_URL"
    echo ""
    echo "📱 Teile diese URL mit anderen (funktioniert von überall!)"
fi

echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo "   ngrok:    tail -f ngrok.log"
echo "   ngrok UI: http://localhost:4040"
echo ""
echo "🛑 Zum Stoppen:"
echo "   kill $BACKEND_PID $FRONTEND_PID $NGROK_PID"
echo ""

# PIDs speichern
echo "$BACKEND_PID $FRONTEND_PID $NGROK_PID" > .pids

