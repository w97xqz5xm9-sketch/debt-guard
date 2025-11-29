# 🔧 Environment Variables - Exakte Werte

## Backend Environment Variables

Beim Erstellen des Backends musst du **3 Environment Variables** hinzufügen:

### Variable 1:
- **Key:** `NODE_ENV`
- **Value:** `production`

### Variable 2:
- **Key:** `ALLOW_PUBLIC_ACCESS`
- **Value:** `true`

### Variable 3:
- **Key:** `PORT`
- **Value:** `10000`

---

## Frontend Environment Variable

Beim Erstellen des Frontends musst du **1 Environment Variable** hinzufügen:

### Variable:
- **Key:** `VITE_API_URL`
- **Value:** `https://dein-backend-url.onrender.com/api`
  - **WICHTIG:** Ersetze `dein-backend-url` mit deiner tatsächlichen Backend-URL aus Schritt 1.14
  - Beispiel: Wenn Backend-URL `https://debt-guard-backend-abc123.onrender.com` ist
  - Dann Value: `https://debt-guard-backend-abc123.onrender.com/api`
  - **Muss mit `/api` enden!**

---

## Schritt-für-Schritt: Environment Variables hinzufügen

### Im Render Dashboard:

1. Scrolle nach unten zu **"Environment Variables"**
2. Klicke auf **"Add Environment Variable"**
3. Trage **Key** und **Value** ein
4. Klicke **"Add"** oder **"Save"**
5. Wiederhole für jede Variable

---

## ✅ Checkliste Backend:

- [ ] `NODE_ENV` = `production`
- [ ] `ALLOW_PUBLIC_ACCESS` = `true`
- [ ] `PORT` = `10000`

## ✅ Checkliste Frontend:

- [ ] `VITE_API_URL` = `https://dein-backend-url.onrender.com/api`


