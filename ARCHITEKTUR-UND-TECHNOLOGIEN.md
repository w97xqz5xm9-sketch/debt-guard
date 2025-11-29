# 🏗️ Vollständige Architektur- und Technologie-Dokumentation

## 📋 Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Verwendete Sprachen und Frameworks](#verwendete-sprachen-und-frameworks)
3. [Systemarchitektur](#systemarchitektur)
4. [Backend-Implementierung](#backend-implementierung)
5. [Frontend-Implementierung](#frontend-implementierung)
6. [Datenbank-Architektur](#datenbank-architektur)
7. [API-Endpunkte](#api-endpunkte)
8. [Features und Funktionalitäten](#features-und-funktionalitäten)
9. [Deployment-Architektur](#deployment-architektur)
10. [Geschlossenes System - Was bedeutet das?](#geschlossenes-system)
11. [Wie man ein geschlossenes System implementiert](#geschlossenes-system-implementieren)

---

## 📊 Übersicht

**Debt Guard** ist eine Full-Stack Web-Anwendung zur Budgetverwaltung und Überschuldungsprävention. Die App berechnet dynamisch das verfügbare Tagesbudget basierend auf Kontostand, Einkommen, Fixkosten und Sparzielen.

### Kernprinzipien:
- **Proaktiv**: Blockiert Ausgaben bevor sie getätigt werden
- **Dynamisch**: Budget wird täglich neu berechnet
- **Intelligent**: KI-basierte Fixkostenerkennung
- **Persistent**: Daten werden in PostgreSQL gespeichert

---

## 💻 Verwendete Sprachen und Frameworks

### Backend (Server-seitig)

#### **TypeScript** (Hauptsprache)
- **Was ist das?** TypeScript ist JavaScript mit statischer Typisierung
- **Warum?** Bessere Fehlererkennung, Code-Qualität, IDE-Unterstützung
- **Verwendung**: Alle Backend-Dateien (`.ts`)

#### **Node.js** (Runtime)
- **Was ist das?** JavaScript-Laufzeitumgebung für Server
- **Warum?** Ermöglicht JavaScript/TypeScript auf dem Server
- **Version**: Node.js 18+

#### **Express.js** (Web-Framework)
- **Was ist das?** Minimalistisches Web-Framework für Node.js
- **Warum?** Einfache API-Erstellung, Middleware-Support
- **Verwendung**: HTTP-Server, Routing, Middleware

#### **PostgreSQL** (Datenbank)
- **Was ist das?** Relationale Datenbank (SQL)
- **Warum?** Persistente Datenspeicherung, ACID-konform
- **Library**: `pg` (node-postgres)

#### **Weitere Backend-Bibliotheken**:
- `cors`: Cross-Origin Resource Sharing (ermöglicht Frontend-Backend-Kommunikation)
- `dotenv`: Umgebungsvariablen-Verwaltung
- `tsx`: TypeScript-Executor für Entwicklung

### Frontend (Client-seitig)

#### **TypeScript** (Hauptsprache)
- **Was ist das?** Gleiche Sprache wie Backend
- **Warum?** Konsistenz, Typensicherheit
- **Verwendung**: Alle Frontend-Dateien (`.tsx`, `.ts`)

#### **React** (UI-Framework)
- **Was ist das?** JavaScript-Bibliothek für Benutzeroberflächen
- **Warum?** Komponentenbasiert, reaktiv, große Community
- **Version**: React 18.3+

#### **React Router** (Routing)
- **Was ist das?** Routing-Bibliothek für React
- **Warum?** Client-seitiges Routing (SPA - Single Page Application)
- **Verwendung**: `HashRouter` für Render.com-Kompatibilität

#### **Vite** (Build-Tool)
- **Was ist das?** Moderne Build-Tool und Dev-Server
- **Warum?** Schnell, Hot Module Replacement, optimierte Builds
- **Verwendung**: Entwicklung und Produktions-Builds

#### **Tailwind CSS** (Styling)
- **Was ist das?** Utility-First CSS-Framework
- **Warum?** Schnelles Styling, konsistentes Design
- **Verwendung**: Alle UI-Komponenten

#### **Axios** (HTTP-Client)
- **Was ist das?** Promise-basierte HTTP-Bibliothek
- **Warum?** Einfache API-Aufrufe, Interceptors, Fehlerbehandlung
- **Verwendung**: Kommunikation mit Backend-API

#### **Weitere Frontend-Bibliotheken**:
- `recharts`: Diagramme und Visualisierungen
- `lucide-react`: Icons
- `date-fns`: Datums-Formatierung

### Build & Deployment

#### **Docker** (Containerisierung)
- **Was ist das?** Container-Plattform
- **Warum?** Konsistente Umgebungen, einfaches Deployment
- **Verwendung**: `Dockerfile` für Backend und Frontend

#### **Render.com** (Hosting)
- **Was ist das?** Cloud-Hosting-Plattform
- **Warum?** Automatisches Deployment, kostenloser Plan
- **Services**: Web Service (Backend) + Static Site (Frontend)

---

## 🏛️ Systemarchitektur

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React Frontend (TypeScript)                  │   │
│  │  - Dashboard, Budget, Setup, Settings, Explanation  │   │
│  │  - HashRouter für Routing                           │   │
│  │  - Axios für API-Calls                              │   │
│  └──────────────────┬───────────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────────┘
                      │ HTTPS
                      │ API Requests
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    RENDER.COM (Cloud)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │     Static Site (Frontend Build)                     │   │
│  │     - Vite Build Output                             │   │
│  │     - HTML/CSS/JS Files                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │     Web Service (Backend API)                        │   │
│  │     ┌────────────────────────────────────────────┐   │   │
│  │     │  Express.js Server (Node.js/TypeScript)   │   │   │
│  │     │  - REST API Endpoints                      │   │   │
│  │     │  - Business Logic                         │   │   │
│  │     │  - Data Validation                        │   │   │
│  │     └──────────────┬─────────────────────────────┘   │   │
│  │                    │                                  │   │
│  │                    ▼                                  │   │
│  │     ┌────────────────────────────────────────────┐   │   │
│  │     │  PostgreSQL Database                       │   │   │
│  │     │  - accounts                                │   │   │
│  │     │  - transactions                            │   │   │
│  │     │  - monthly_setup                          │   │   │
│  │     │  - savings_goals                          │   │   │
│  │     └────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Datenfluss:

1. **Benutzer-Interaktion** → React-Komponente
2. **API-Aufruf** → Axios sendet HTTP-Request
3. **Backend-Verarbeitung** → Express-Route verarbeitet Request
4. **Datenbank-Abfrage** → PostgreSQL liefert Daten
5. **Response** → JSON-Daten zurück zum Frontend
6. **UI-Update** → React aktualisiert Komponenten

---

## 🔧 Backend-Implementierung

### Projektstruktur

```
backend/
├── src/
│   ├── index.ts              # Haupt-Einstiegspunkt
│   ├── routes/               # API-Routen
│   │   ├── accounts.ts       # Konten-Verwaltung
│   │   ├── behavior.ts       # Ausgabeverhalten-Analyse
│   │   ├── budget.ts         # Budget-Berechnung
│   │   ├── explanation.ts    # Budget-Erklärung
│   │   ├── fixedCosts.ts     # Fixkosten-Analyse
│   │   ├── savings.ts        # Sparziele
│   │   ├── setup.ts          # Monatliches Setup
│   │   ├── transactions.ts   # Transaktionen
│   │   └── unlock.ts         # Entsperr-Mechanismus
│   ├── services/             # Business Logic
│   │   ├── budgetCalculator.ts    # Budget-Berechnungslogik
│   │   ├── dataService.ts         # Datenbank-Operationen
│   │   ├── database.ts            # DB-Verbindung & Schema
│   │   ├── fixedCostAnalyzer.ts   # Fixkosten-Erkennung
│   │   ├── limitCalculator.ts     # Tageslimit-Berechnung
│   │   ├── monthlySetup.ts        # Setup-Verwaltung
│   │   ├── transactionChecker.ts  # Transaktions-Validierung
│   │   └── unlockService.ts       # Entsperr-Logik
│   └── types/                # TypeScript-Typen
│       └── index.ts
├── dist/                     # Kompilierte JavaScript-Dateien
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript-Konfiguration
└── Dockerfile                # Docker-Container-Definition
```

### Hauptkomponenten

#### 1. **index.ts** - Server-Start

```typescript
// Express-App erstellen
const app = express()

// CORS konfigurieren (Cross-Origin Requests erlauben)
app.use(cors({
  origin: allowPublicAccess ? '*' : 'http://localhost:3000',
  credentials: !allowPublicAccess,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// JSON-Body-Parser
app.use(express.json())

// Routen registrieren
app.use('/api/setup', setupRoutes)
app.use('/api/budget', budgetRoutes)
// ... weitere Routen

// Datenbank initialisieren und Server starten
initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Debt Guard Backend running on http://localhost:${PORT}`)
    })
  })
```

**Was passiert hier?**
- Express-Server wird erstellt
- CORS wird konfiguriert (ermöglicht Frontend-Backend-Kommunikation)
- Routen werden registriert
- Datenbank wird initialisiert
- Server startet auf Port 5001 (lokal) oder 10000 (Produktion)

#### 2. **database.ts** - Datenbank-Verbindung

```typescript
// PostgreSQL Connection Pool erstellen
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// Tabellen automatisch erstellen
await query(`
  CREATE TABLE IF NOT EXISTS accounts (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL,
    ...
  )
`)
```

**Was passiert hier?**
- PostgreSQL-Verbindungspool wird erstellt
- Tabellen werden automatisch erstellt (wenn nicht vorhanden)
- Fallback auf In-Memory-Speicher, wenn keine DB vorhanden

#### 3. **monthlySetup.ts** - Setup-Verwaltung

**Kernfunktionen:**
- `getMonthlySetup()`: Lädt aktuelles Setup aus DB
- `setMonthlySetup()`: Speichert Setup in DB
- `canChangeSetup()`: Prüft, ob Setup geändert werden darf (max 3x/Monat)
- `incrementChangeCount()`: Erhöht Änderungszähler

**Setup-Änderungslimit-Logik:**
```typescript
export async function canChangeSetup(): Promise<{ allowed: boolean; remaining: number }> {
  const setup = await getMonthlySetup()
  if (!setup) {
    return { allowed: true, remaining: 3 }
  }

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  
  // Reset counter if it's a new month
  if (setup.changeMonth !== currentMonth) {
    return { allowed: true, remaining: 3 }
  }

  const changeCount = setup.changeCount || 0
  const remaining = Math.max(0, 3 - changeCount)

  if (changeCount >= 3) {
    return { allowed: false, remaining: 0 }
  }

  return { allowed: true, remaining }
}
```

#### 4. **budgetCalculator.ts** - Budget-Berechnung

**Kernlogik:**
- Berechnet verfügbares Budget basierend auf:
  - Monatseinkommen
  - Fixkosten
  - Sparziel
  - Bereits ausgegebenes Geld
- Berechnet tägliches Limit dynamisch

#### 5. **transactionChecker.ts** - Transaktions-Validierung

**Was passiert:**
- Prüft, ob Transaktion erlaubt ist
- Vergleicht mit Tageslimit
- Blockiert oder warnt bei Überschreitung
- Unterstützt "Unlock"-Mechanismus (Entsperrung)

---

## 🎨 Frontend-Implementierung

### Projektstruktur

```
frontend/
├── src/
│   ├── App.tsx               # Haupt-App-Komponente (Routing)
│   ├── main.tsx              # React-Einstiegspunkt
│   ├── index.css             # Globale Styles
│   ├── components/
│   │   └── Layout.tsx        # Layout-Komponente (Navigation)
│   ├── pages/
│   │   ├── Dashboard.tsx     # Haupt-Dashboard
│   │   ├── Budget.tsx        # Budget-Übersicht
│   │   ├── Setup.tsx         # Monatliches Setup
│   │   ├── Settings.tsx      # Einstellungen
│   │   └── Explanation.tsx   # Budget-Erklärung
│   ├── services/
│   │   └── api.ts            # API-Client (Axios)
│   ├── types/
│   │   └── index.ts          # TypeScript-Typen
│   └── vite-env.d.ts         # Vite-Typen-Definitionen
├── public/                   # Statische Dateien
│   ├── _redirects            # SPA-Routing (für Render.com)
│   └── 404.html              # Fallback-HTML
├── package.json
├── vite.config.ts            # Vite-Konfiguration
├── tailwind.config.js        # Tailwind-Konfiguration
└── tsconfig.json
```

### Hauptkomponenten

#### 1. **App.tsx** - Routing & Setup-Check

```typescript
function App() {
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null)

  useEffect(() => {
    checkSetup() // Prüft beim Start, ob Setup existiert
  }, [])

  // Wenn kein Setup existiert → Setup-Seite zeigen
  if (needsSetup) {
    return (
      <HashRouter>
        <Routes>
          <Route path="*" element={<Setup onComplete={() => checkSetup()} />} />
        </Routes>
      </HashRouter>
    )
  }

  // Normale App-Routen
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/budget" element={<Layout><Budget /></Layout>} />
        <Route path="/setup" element={<Setup onComplete={() => checkSetup()} />} />
        // ...
      </Routes>
    </HashRouter>
  )
}
```

**Was passiert hier?**
- Beim App-Start wird geprüft, ob ein Setup existiert
- Wenn nicht → Setup-Seite wird gezwungen
- Wenn ja → Normale App-Routen werden angezeigt
- `HashRouter` wird verwendet (kompatibel mit Render.com Static Sites)

#### 2. **api.ts** - API-Client

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const budgetApi = {
  getCurrentBudget: async (): Promise<Budget> => {
    const response = await api.get<Budget>('/budget/current')
    return response.data
  },
  // ... weitere Methoden
}
```

**Was passiert hier?**
- Zentralisierter Axios-Client
- `VITE_API_URL` aus Umgebungsvariablen
- Alle API-Calls gehen über diesen Client
- Fehler-Interceptor für bessere Fehlermeldungen

#### 3. **Setup.tsx** - Setup-Komponente

**Features:**
- Formular für monatliches Setup
- Anzeige der verbleibenden Änderungen (max 3/Monat)
- Zugangscode-Eingabe nach 3 Änderungen
- Validierung und Fehlerbehandlung

**Setup-Änderungslimit-Anzeige:**
```typescript
{changeInfo && changeInfo.remaining > 0 && (
  <div className="mb-4 p-3 bg-blue-50 rounded">
    Du hast noch {changeInfo.remaining} {changeInfo.remaining === 1 ? 'Versuche' : 'Versuche'} 
    dieses Monat.
  </div>
)}

{changeInfo && !changeInfo.canChange && (
  <div className="mb-4 p-3 bg-red-50 rounded">
    Du hast dein Limit von 3 Änderungen diesen Monat erreicht.
    Bitte einen neuen Code anfragen, um weitere Änderungen zu machen.
  </div>
)}
```

---

## 🗄️ Datenbank-Architektur

### Tabellen

#### 1. **accounts** - Konten
```sql
CREATE TABLE accounts (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  balance DECIMAL(10, 2) NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### 2. **transactions** - Transaktionen
```sql
CREATE TABLE transactions (
  id VARCHAR(255) PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL,
  type VARCHAR(50) NOT NULL,
  blocked BOOLEAN DEFAULT FALSE,
  warning_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### 3. **monthly_setup** - Monatliches Setup
```sql
CREATE TABLE monthly_setup (
  id SERIAL PRIMARY KEY,
  savings_goal DECIMAL(10, 2) NOT NULL,
  fixed_costs DECIMAL(10, 2) NOT NULL,
  monthly_income DECIMAL(10, 2) NOT NULL,
  variable_budget DECIMAL(10, 2) NOT NULL,
  daily_limit DECIMAL(10, 2) NOT NULL,
  month_start_date TIMESTAMP NOT NULL,
  change_count INTEGER DEFAULT 0,        -- Anzahl Änderungen diesen Monat
  change_month VARCHAR(7),              -- Format: "YYYY-MM"
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### 4. **savings_goals** - Sparziele
```sql
CREATE TABLE savings_goals (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  target_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Indizes

```sql
CREATE INDEX idx_transactions_date ON transactions(date DESC)
CREATE INDEX idx_transactions_type ON transactions(type)
CREATE INDEX idx_monthly_setup_month_start ON monthly_setup(month_start_date DESC)
```

**Warum Indizes?**
- Schnellere Abfragen
- Bessere Performance bei großen Datenmengen

---

## 🔌 API-Endpunkte

### Setup
- `GET /api/setup` - Aktuelles Setup abrufen
- `POST /api/setup` - Setup speichern/aktualisieren
- `DELETE /api/setup` - Setup löschen

### Budget
- `GET /api/budget/current` - Aktuelles Budget
- `GET /api/budget/calculate` - Budget neu berechnen

### Transaktionen
- `GET /api/transactions` - Alle Transaktionen
- `POST /api/transactions` - Transaktion hinzufügen
- `POST /api/transactions/check` - Transaktion prüfen (vor dem Hinzufügen)

### Konten
- `GET /api/accounts` - Alle Konten
- `POST /api/accounts` - Konto hinzufügen

### Sparziele
- `GET /api/savings-goals` - Alle Sparziele
- `POST /api/savings-goals` - Sparziel hinzufügen

### Verhalten
- `GET /api/behavior` - Ausgabeverhalten-Analyse

### Entsperrung
- `GET /api/unlock` - Entsperr-Status
- `POST /api/unlock/use` - Entsperrung verwenden
- `POST /api/unlock/reset` - Entsperrungen zurücksetzen (mit Code)

### Erklärung
- `GET /api/explanation` - Budget-Erklärung

### Fixkosten
- `GET /api/fixed-costs` - Fixkosten-Analyse

### Health Check
- `GET /api/health` - Server-Status

---

## ✨ Features und Funktionalitäten

### 1. **Dynamisches Budget-System**
- Berechnet tägliches Limit basierend auf:
  - Monatseinkommen
  - Fixkosten
  - Sparziel
  - Bereits ausgegebenes Geld
- Passt sich automatisch an verbleibende Tage im Monat an

### 2. **Transaktions-Validierung**
- Prüft Transaktionen vor dem Hinzufügen
- Blockiert oder warnt bei Überschreitung des Limits
- Unterstützt "Unlock"-Mechanismus für Notfälle

### 3. **Fixkosten-Erkennung**
- Analysiert Transaktionshistorie
- Erkennt wiederkehrende Ausgaben automatisch
- Kategorisiert Fixkosten (Miete, Abos, etc.)

### 4. **Setup-Änderungslimit**
- Maximal 3 Änderungen pro Monat
- Zähler wird monatlich zurückgesetzt
- Nach 3 Änderungen: Zugangscode erforderlich

### 5. **Ausgabeverhalten-Analyse**
- Analysiert Ausgabemuster
- Zeigt Kategorien und Trends
- Hilft bei Budget-Optimierung

### 6. **Sparziele-Verwaltung**
- Mehrere Sparziele gleichzeitig
- Fortschrittsanzeige
- Deadline-Tracking

### 7. **Budget-Erklärung**
- Erklärt, wie das Budget berechnet wurde
- Zeigt alle Faktoren
- Transparente Darstellung

---

## 🚀 Deployment-Architektur

### Render.com Setup

#### Backend (Web Service)
- **Typ**: Web Service (Node.js)
- **Build Command**: `cd backend && npm install --include=dev && npm run build`
- **Start Command**: `cd backend && npm start`
- **Port**: 10000
- **Environment Variables**:
  - `NODE_ENV=production`
  - `ALLOW_PUBLIC_ACCESS=true`
  - `PORT=10000`
  - `DATABASE_URL=<PostgreSQL-URL>` (optional)

#### Frontend (Static Site)
- **Typ**: Static Site
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Path**: `frontend/dist`
- **Environment Variables**:
  - `VITE_API_URL=https://debt-guard-backend.onrender.com/api`

### Automatisches Deployment
- **GitHub Integration**: Bei jedem Push wird automatisch deployed
- **Branch**: `main`
- **Build-Zeit**: ~5-10 Minuten

---

## 🔒 Geschlossenes System

### Was bedeutet "geschlossenes System"?

Ein **geschlossenes System** bedeutet, dass die Anwendung:
1. **Nicht öffentlich zugänglich** ist
2. **Authentifizierung/Authorization** erfordert
3. **Nur autorisierte Benutzer** Zugriff haben
4. **Keine öffentlichen Endpunkte** ohne Authentifizierung

### Aktueller Status: **Offenes System** ⚠️

**Warum?**
- `ALLOW_PUBLIC_ACCESS=true` erlaubt alle CORS-Requests
- Keine Authentifizierung implementiert
- Jeder kann auf die API zugreifen (wenn URL bekannt)
- Keine Benutzer-Verwaltung

---

## 🔐 Geschlossenes System implementieren

### Option 1: API-Key-Authentifizierung (Einfach)

#### Backend-Änderungen:

**1. API-Key-Middleware erstellen:**

```typescript
// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express'

const API_KEY = process.env.API_KEY || 'your-secret-key-here'

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      message: 'Valid API key required'
    })
  }

  next()
}
```

**2. Middleware in `index.ts` anwenden:**

```typescript
import { requireApiKey } from './middleware/auth'

// Alle API-Routen schützen
app.use('/api', requireApiKey)

// Health Check ohne Auth (optional)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})
```

**3. Environment Variable hinzufügen:**
```bash
API_KEY=dein-super-geheimer-schlüssel-12345
```

#### Frontend-Änderungen:

**1. API-Key zu Axios-Client hinzufügen:**

```typescript
// frontend/src/services/api.ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': import.meta.env.VITE_API_KEY, // API-Key hinzufügen
  },
})
```

**2. Environment Variable hinzufügen:**
```bash
VITE_API_KEY=dein-super-geheimer-schlüssel-12345
```

**3. Render.com Environment Variables:**
- Backend: `API_KEY=dein-super-geheimer-schlüssel-12345`
- Frontend: `VITE_API_KEY=dein-super-geheimer-schlüssel-12345`

### Option 2: JWT-Authentifizierung (Erweitert)

#### Benötigte Pakete:
```bash
cd backend
npm install jsonwebtoken bcryptjs
npm install --save-dev @types/jsonwebtoken @types/bcryptjs
```

#### Implementierung:

**1. Login-Route erstellen:**

```typescript
// backend/src/routes/auth.ts
import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Mock-Benutzer (später durch DB ersetzen)
const users = [
  {
    id: '1',
    username: 'admin',
    password: '$2a$10$...' // Gehashtes Passwort
  }
]

router.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = users.find(u => u.username === username)
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  res.json({ token })
})

export default router
```

**2. JWT-Middleware:**

```typescript
// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded // Benutzer-Info an Request anhängen
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
```

**3. Routen schützen:**

```typescript
// backend/src/index.ts
import { requireAuth } from './middleware/auth'

app.use('/api/setup', requireAuth, setupRoutes)
app.use('/api/budget', requireAuth, budgetRoutes)
// ... weitere Routen
```

**4. Frontend-Login-Komponente:**

```typescript
// frontend/src/pages/Login.tsx
import { useState } from 'react'
import { budgetApi } from '../services/api'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/auth/login', { username, password })
      localStorage.setItem('token', response.data.token)
      // Weiterleitung zum Dashboard
    } catch (error) {
      // Fehler anzeigen
    }
  }

  return (
    <form onSubmit={handleLogin}>
      {/* Login-Formular */}
    </form>
  )
}
```

**5. Token zu API-Requests hinzufügen:**

```typescript
// frontend/src/services/api.ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Option 3: IP-Whitelist (Einfach, aber weniger sicher)

```typescript
// backend/src/middleware/auth.ts
const ALLOWED_IPS = process.env.ALLOWED_IPS?.split(',') || []

export function requireWhitelist(req: Request, res: Response, next: NextFunction) {
  const clientIp = req.ip || req.connection.remoteAddress

  if (!ALLOWED_IPS.includes(clientIp)) {
    return res.status(403).json({ error: 'IP not allowed' })
  }

  next()
}
```

### Option 4: CORS auf spezifische Domains beschränken

```typescript
// backend/src/index.ts
app.use(cors({
  origin: [
    'https://debt-guard-frontend.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

**Wichtig:** `ALLOW_PUBLIC_ACCESS=false` setzen!

---

## 📝 Zusammenfassung

### Verwendete Technologien:

**Backend:**
- TypeScript
- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL-Client)

**Frontend:**
- TypeScript
- React
- React Router (HashRouter)
- Vite
- Tailwind CSS
- Axios
- Recharts

**Deployment:**
- Render.com
- Docker (optional)
- GitHub (CI/CD)

### Architektur-Prinzipien:

1. **Separation of Concerns**: Backend/Frontend getrennt
2. **RESTful API**: Standardisierte HTTP-Endpunkte
3. **Type Safety**: TypeScript überall
4. **Database Persistence**: PostgreSQL für Daten
5. **Responsive Design**: Tailwind CSS
6. **SPA**: Single Page Application mit Client-Side Routing

### Nächste Schritte für geschlossenes System:

1. **API-Key-Authentifizierung** implementieren (einfachste Lösung)
2. **CORS auf spezifische Domains** beschränken
3. **Environment Variables** sicher verwalten
4. **HTTPS** sicherstellen (Render.com macht das automatisch)
5. **Rate Limiting** hinzufügen (optional)

---

## 🔗 Weitere Ressourcen

- [Express.js Dokumentation](https://expressjs.com/)
- [React Dokumentation](https://react.dev/)
- [PostgreSQL Dokumentation](https://www.postgresql.org/docs/)
- [TypeScript Dokumentation](https://www.typescriptlang.org/docs/)
- [Render.com Dokumentation](https://render.com/docs)

