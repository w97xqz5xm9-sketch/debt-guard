#!/bin/bash

# Script zum Starten der App mit Cloudflare Tunnel (kostenlos, kein Account nötig)

echo "🌐 Debt Guard - Öffentlicher Zugriff mit Cloudflare Tunnel"
echo "============================================================"
echo ""

# Prüfe ob cloudflared installiert ist
if ! command -v cloudflared &> /dev/null; then
    echo "❌ cloudflared ist nicht installiert!"
    echo ""
    echo "📥 Installation:"
    echo "   macOS: brew install cloudflare/cloudflare/cloudflared"
    echo "   Oder: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/"
    echo ""
    exit 1
fi

echo "✅ cloudflared gefunden"
echo ""

# Starte Backend im Hintergrund mit öffentlichem Zugriff
echo "🚀 Starte Backend..."
cd backend
ALLOW_PUBLIC_ACCESS=true npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend gestartet (PID: $BACKEND_PID) mit öffentlichem Zugriff"
sleep 2

# Starte Frontend im Hintergrund
echo "🚀 Starte Frontend..."
cd ../frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend gestartet (PID: $FRONTEND_PID)"
sleep 3

# Starte Cloudflare Tunnel
echo ""
echo "🌐 Starte Cloudflare Tunnel..."
echo "   Frontend wird auf Port 3000 getunnelt"
echo ""

# Cloudflare Tunnel starten
cloudflared tunnel --url http://localhost:3000 > ../cloudflare.log 2>&1 &
CLOUDFLARE_PID=$!
sleep 5

# Hole URL aus Log
CLOUDFLARE_URL=$(grep -o 'https://[^ ]*\.trycloudflare\.com' ../cloudflare.log | head -1)

if [ -z "$CLOUDFLARE_URL" ]; then
    echo "⚠️  Konnte Cloudflare URL nicht automatisch abrufen"
    echo "   Schaue in cloudflare.log nach der URL"
    tail -5 ../cloudflare.log
else
    echo "✅ Öffentliche URL:"
    echo "   $CLOUDFLARE_URL"
    echo ""
    echo "📱 Teile diese URL mit anderen (funktioniert von überall!)"
fi

echo ""
echo "📋 Logs:"
echo "   Backend:    tail -f backend.log"
echo "   Frontend:   tail -f frontend.log"
echo "   Cloudflare: tail -f cloudflare.log"
echo ""
echo "🛑 Zum Stoppen:"
echo "   kill $BACKEND_PID $FRONTEND_PID $CLOUDFLARE_URL"
echo ""

# PIDs speichern
echo "$BACKEND_PID $FRONTEND_PID $CLOUDFLARE_PID" > .pids

