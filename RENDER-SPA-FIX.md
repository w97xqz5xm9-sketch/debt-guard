# 🔧 Render.com SPA Routing Fix

## Problem
Wenn du direkt zu `/setup` navigierst, zeigt Render.com "Not Found", weil der Server nach einer Datei sucht, die nicht existiert.

## Lösung: Manuelle Konfiguration im Render Dashboard

Render.com hat keine explizite SPA-Einstellung, aber wir können das manuell konfigurieren:

### Option 1: Custom Headers (falls verfügbar)

1. Gehe zu deinem Frontend-Service (`debt-guard-frontend`)
2. Klicke auf **"Settings"**
3. Suche nach **"Custom Headers"** oder **"Headers"**
4. Falls vorhanden, füge hinzu:
   - **Path:** `/*`
   - **Header:** `X-Redirect: /index.html`

### Option 2: Render.yaml aktualisieren (falls verwendet)

Falls du `render.yaml` verwendest, können wir Redirects dort hinzufügen.

### Option 3: Workaround - Verwende Hash-Routing

Als letzte Option können wir React Router auf Hash-Routing umstellen, dann funktioniert es immer.

---

## Aktuelle Lösung: 404.html Fallback

Ich habe bereits eine `404.html` Datei erstellt, die auf `index.html` weiterleitet. Diese sollte automatisch funktionieren, wenn Render.com 404-Fehler abfängt.

---

## Testen

1. Warte, bis das neue Deployment fertig ist (3-5 Minuten)
2. Versuche direkt zu `/setup` zu navigieren
3. Falls es immer noch nicht funktioniert, verwenden wir Hash-Routing

---

## Alternative: Hash-Routing aktivieren

Falls nichts funktioniert, können wir React Router auf Hash-Routing umstellen:

```typescript
// In App.tsx
<Router basename="/">
  // wird zu
<HashRouter>
```

Das würde URLs wie `/#/setup` erzeugen, funktioniert aber immer.












