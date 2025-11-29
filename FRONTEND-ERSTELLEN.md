# 🎨 Frontend erstellen - Schritt für Schritt

## Voraussetzung
✅ Du hast bereits das Backend erstellt und die Backend-URL notiert

---

## Schritt 2.1: Neues Frontend starten
1. Gehe zu [dashboard.render.com](https://dashboard.render.com)
2. Klicke auf den großen blauen Button **"New +"** (oben rechts)
3. Es öffnet sich ein Menü
4. Klicke auf **"Static Site"** ⚠️ WICHTIG: "Static Site", NICHT "Web Service"!

---

## Schritt 2.2: Repository verbinden
1. Du siehst eine Liste mit deinen GitHub Repositories
2. Suche nach **"bank-brick"** oder **"debt-guard"**
3. Klicke auf **"Connect"** neben dem Repository

---

## Schritt 2.3: Name eingeben
1. Im Feld **"Name"** tippe:
   ```
   debt-guard-frontend
   ```

---

## Schritt 2.4: Branch wählen
1. Bei **"Branch"** tippe:
   ```
   main
   ```

---

## Schritt 2.5: Root Directory
1. Bei **"Root Directory"** → **LASS ES LEER!**
   - Nichts eintragen, einfach leer lassen

---

## Schritt 2.6: Build Command eingeben
1. Bei **"Build Command"** tippe:
   ```
   cd frontend && npm install && npm run build
   ```

---

## Schritt 2.7: Publish Directory eingeben
1. Bei **"Publish Directory"** tippe:
   ```
   frontend/dist
   ```

---

## Schritt 2.8: Environment Variable hinzufügen ⚠️ WICHTIG!

1. Scrolle zu **"Environment Variables"**
2. Klicke auf **"Add Environment Variable"**
3. **Key:** `VITE_API_URL`
4. **Value:** **Deine Backend-URL aus Schritt 1.14** + `/api`
   - Beispiel: Wenn deine Backend-URL `https://debt-guard-backend-abc123.onrender.com` ist
   - Dann Value: `https://debt-guard-backend-abc123.onrender.com/api`
   - **WICHTIG:** Muss mit `/api` enden!
5. Klicke **"Add"** oder **"Save"**

### Beispiel:
- Backend-URL: `https://debt-guard-backend-xyz789.onrender.com`
- Dann Value: `https://debt-guard-backend-xyz789.onrender.com/api`

---

## Schritt 2.9: Plan wählen
1. Bei **"Plan"** wähle:
   - **"Free"** (kostenlos)

---

## Schritt 2.10: Erstellen
1. Scrolle ganz nach unten
2. Klicke auf den großen Button **"Create Static Site"**

---

## Schritt 2.11: Warten ⏳
1. Du siehst jetzt den Build-Prozess
2. Warte **3-5 Minuten**, bis "Live" grün wird
3. **Fertig!** 🎉

---

## ✅ Checkliste Frontend:

- [ ] "Static Site" gewählt (NICHT "Web Service"!)
- [ ] Name: `debt-guard-frontend`
- [ ] Build Command: `cd frontend && npm install && npm run build`
- [ ] Publish Directory: `frontend/dist`
- [ ] Environment Variable `VITE_API_URL` gesetzt
- [ ] Value endet mit `/api`
- [ ] "Live" ist grün

---

## 🆘 Hilfe

**Problem: "Keine Verbindung zum Backend"**
- Prüfe, ob `VITE_API_URL` korrekt ist
- Muss die Backend-URL + `/api` sein
- Beispiel: `https://debt-guard-backend-xxxx.onrender.com/api`

**Problem: Build schlägt fehl**
- Prüfe die Logs im Render Dashboard
- Stelle sicher, dass alle Commands korrekt sind

---

## ✅ Fertig!

Jetzt sollten beide Services laufen:
- **Backend:** `https://debt-guard-backend-xxxx.onrender.com` (Web Service)
- **Frontend:** `https://debt-guard-frontend.onrender.com` (Static Site)

**Teste die App:**
1. Öffne deine Frontend-URL
2. Gehe zum Setup
3. Wähle ein Sparziel
4. Klicke "Setup starten"

✅ **Wenn das funktioniert:** Alles ist fertig! 🎉



