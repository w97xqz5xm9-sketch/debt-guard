# Render Build Command Fix

Für das Backend in Render, verwende dieses Build Command:

```
cd backend && npm install --include=dev && npm run build
```

Oder alternativ:

```
cd backend && NODE_ENV=development npm install && npm run build
```

Das stellt sicher, dass @types/node installiert wird.












