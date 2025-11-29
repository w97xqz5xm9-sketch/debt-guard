# Datenbank-Setup für Debt Guard

## Übersicht

Die App verwendet jetzt PostgreSQL für persistente Datenspeicherung. Wenn keine Datenbank konfiguriert ist, fällt die App automatisch auf In-Memory-Speicher zurück.

## Render.com PostgreSQL Setup

### 1. PostgreSQL Datenbank erstellen

1. Gehe zu [Render Dashboard](https://dashboard.render.com)
2. Klicke auf "New +" → "PostgreSQL"
3. Konfiguriere:
   - **Name**: `debt-guard-db`
   - **Database**: `debt_guard`
   - **User**: (wird automatisch generiert)
   - **Region**: Wähle die gleiche Region wie dein Backend
   - **PostgreSQL Version**: 15 (oder neuer)
   - **Plan**: Free (für Entwicklung) oder Starter (für Produktion)

### 2. Environment Variable hinzufügen

1. Gehe zu deinem Backend-Service auf Render
2. Klicke auf "Environment"
3. Füge folgende Variable hinzu:
   - **Key**: `DATABASE_URL`
   - **Value**: Kopiere die "Internal Database URL" von deiner PostgreSQL-Datenbank
     - Format: `postgresql://user:password@host:port/database`

### 3. Datenbank initialisieren

Die Datenbank wird automatisch beim Start des Backends initialisiert. Die Tabellen werden automatisch erstellt, wenn sie nicht existieren.

## Lokale Entwicklung

### PostgreSQL installieren

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Lade PostgreSQL von [postgresql.org](https://www.postgresql.org/download/windows/)

### Datenbank erstellen

```bash
createdb debt_guard
```

### Environment Variable setzen

Erstelle eine `.env` Datei im `backend/` Verzeichnis:

```env
DATABASE_URL=postgresql://localhost:5432/debt_guard
PORT=5001
ALLOW_PUBLIC_ACCESS=false
NODE_ENV=development
```

## Datenbank-Schema

Die folgenden Tabellen werden automatisch erstellt:

- **accounts**: Bankkonten
- **transactions**: Transaktionen
- **monthly_setup**: Monatliches Setup
- **savings_goals**: Sparziele

## Migrationen

Die Datenbank wird beim ersten Start automatisch initialisiert. Wenn du die Datenbank zurücksetzen möchtest:

```sql
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS monthly_setup CASCADE;
DROP TABLE IF EXISTS savings_goals CASCADE;
```

Dann starte den Server neu - die Tabellen werden automatisch neu erstellt.

## Fallback-Modus

Wenn `DATABASE_URL` nicht gesetzt ist, verwendet die App automatisch In-Memory-Speicher. Dies ist nützlich für:
- Lokale Entwicklung ohne Datenbank
- Testing
- Notfall-Fallback

## Troubleshooting

### "Database not configured" Fehler

- Stelle sicher, dass `DATABASE_URL` in den Environment Variables gesetzt ist
- Prüfe, ob die Datenbank auf Render läuft
- Prüfe die Logs auf Verbindungsfehler

### Verbindungsfehler

- Prüfe, ob die Datenbank auf Render läuft
- Stelle sicher, dass du die "Internal Database URL" verwendest (nicht die externe)
- Prüfe, ob Backend und Datenbank in der gleichen Region sind

### Tabellen werden nicht erstellt

- Prüfe die Backend-Logs auf Fehler
- Stelle sicher, dass der Datenbank-User CREATE TABLE Rechte hat
- Starte den Backend-Service neu



