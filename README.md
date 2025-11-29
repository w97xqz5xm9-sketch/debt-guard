# Debt Guard 🛡️

**Die App, die dich vor dem Überschulden schützt**

## Problem

Wir leben in der verschuldetsten Generation aller Zeiten. Bestehende Budget-Apps zeigen Nutzer*innen nur, was sie bereits ausgegeben haben – sie verhindern aber nicht, dass man zu viel ausgibt.

## Lösung

Debt Guard ist die erste App, die nicht nur Ausgaben trackt – sie greift aktiv ein, bevor Schaden entsteht.

Die App berechnet das tägliche verfügbare Budget fortlaufend neu, basierend auf:
- Kontostand
- Gehalts- und Zahlungseingängen
- bevorstehenden Abbuchungen
- Sparzielen
- individuellem Ausgabeverhalten

Wenn ein Kauf das Tagesbudget sprengen würde, kann die App die Zahlung automatisch blockieren oder eine harte Sperrwarnung ausgeben.

## Kernfunktionen

- ✅ Automatische Echtzeit-Budgetberechnung (dynamischer Tagesbetrag)
- ✅ Automatische Ausgabensperre, bevor man zu viel ausgibt
- ✅ Impulse-Control-Mechanismen gegen Spontankäufe
- ✅ Proaktive Benachrichtigungen und klare Tageslimits
- ✅ Zielbasiertes, adaptives Budgeting
- ✅ Verhaltensbasiertes Financial-Coaching

## Einzigartigkeit

Im Gegensatz zu Apps wie Finanzguru, N26-Spaces, YNAB oder Mint ist Debt Guard:
- **aktiv** statt passiv
- **prognostisch** statt rückblickend
- **schützend** statt nur informierend

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript

## Installation

```bash
npm run install:all
```

## Entwicklung

```bash
npm run dev
```

Dies startet sowohl Frontend als auch Backend gleichzeitig.

## Projektstruktur

```
debt-guard/
├── frontend/          # React Frontend
└── backend/           # Node.js Backend API
```

## App teilen

### Lokal im Netzwerk teilen

1. **Backend CORS anpassen** (für lokales Netzwerk):
   - In `backend/src/index.ts` CORS auf `origin: '*'` setzen (nur für Entwicklung!)

2. **Frontend mit Host starten**:
   ```bash
   cd frontend
   npm run dev -- --host
   ```

3. **Deine IP-Adresse finden**:
   ```bash
   # macOS
   ipconfig getifaddr en0
   
   # Linux
   hostname -I
   ```

4. **Link teilen**: `http://DEINE-IP:3000`

### Mit Docker teilen

```bash
docker-compose up
```

### Cloud-Deployment

Siehe `DEPLOY.md` für detaillierte Anleitung zu Vercel, Railway, Render, etc.

