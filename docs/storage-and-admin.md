# Datenspeicherung & Admin-Dokumentation

## Inhaltsverzeichnis
1. [R2 Bildspeicherung](#r2-bildspeicherung)
2. [Admin-Panel](#admin-panel)

---

## R2 Bildspeicherung

### Überblick
Bilder für Events, Kategorien und Räume werden in einem Cloudflare R2 Bucket gespeichert. R2 ist S3-kompatibel und wird über das AWS S3 SDK angesprochen.

### Konfiguration

| Variable | Wert |
|---|---|
| Bucket | `pallas-bucket` |
| Endpoint | `https://29d1173a12bfef0d214ddaf9c96ff88f.r2.cloudflarestorage.com` |
| Public URL | `https://cdn.pallas.world` |
| Region | `auto` |

Credentials werden ausschließlich über Umgebungsvariablen konfiguriert (`.env` lokal, Heroku Config Vars in Production). Niemals hardcoded.

### Ordnerstruktur im Bucket

```
pallas-bucket/
├── categories/          # Logos der Veranstaltungskategorien
│   └── {name}-{timestamp}.webp
├── events/              # Event-spezifische Bilder
│   └── {name}-{timestamp}.webp
└── rooms/               # Raumbilder
    └── {imageFolder}/
        └── {folder}-{timestamp}-{random}.webp
```

### Bildverarbeitung
Alle Uploads werden serverseitig mit **Sharp** zu WebP konvertiert, bevor sie in R2 gespeichert werden:
- Format: WebP
- Qualität: 85
- Effort: 4 (Kompressionsaufwand)
- Max. Upload-Größe: 5 MB (Kategorien/Events), 15 MB (Räume)

Das Cropping von Kategorien- und Event-Bildern findet **im Browser** statt (Admin-Panel) — die API erhält bereits das fertig zugeschnittene Bild.

### Upload-Flow

```
Admin-Panel
  → Bild auswählen & croppen (Browser)
  → POST /api/upload/category-image  oder  /event-image
      → Multer (memoryStorage, kein Disk-Write)
      → Sharp: Buffer → WebP-Buffer
      → PutObjectCommand → R2
      → Response: { imageUrl: "https://cdn.pallas.world/categories/..." }
  → URL wird in MongoDB gespeichert (Category.defaultImageUrl / Event.eventImageUrl)
```

### Relevante Dateien

| Datei | Zweck |
|---|---|
| `api/config/r2.js` | S3Client-Konfiguration |
| `api/routes/uploadRoutes.js` | Upload-Endpunkte für Kategorien & Events |
| `api/routes/roomRoutes.js` | Upload- & Delete-Endpunkte für Raumbilder |
| `src/utils/imageUrl.js` | Frontend: absolute URLs werden direkt durchgereicht |

### API-Endpunkte

#### `POST /api/upload/category-image`
Lädt ein Kategoriebild hoch und gibt die R2-URL zurück.

**Request:** `multipart/form-data`
- `image` — Bilddatei (JPEG, PNG, GIF, WebP, max. 5 MB)
- `categoryName` — Name der Kategorie (wird für den Dateinamen verwendet)

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://cdn.pallas.world/categories/house-1741234567890.webp",
  "filename": "house-1741234567890.webp"
}
```

---

#### `POST /api/upload/event-image`
Lädt ein Event-Bild hoch und gibt die R2-URL zurück.

**Request:** `multipart/form-data`
- `image` — Bilddatei (JPEG, PNG, GIF, WebP, max. 5 MB)
- `eventName` — Name des Events (wird für den Dateinamen verwendet)

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://cdn.pallas.world/events/saturday-night-1741234567890.webp",
  "filename": "saturday-night-1741234567890.webp"
}
```

---

#### `POST /api/rooms/:sketch/:id/images`
Lädt ein oder mehrere Raumbilder hoch (max. 20 auf einmal). Bilder werden unter `rooms/{imageFolder}/` gespeichert. Die vollständigen R2-URLs werden in `rooms.json` persistiert.

---

#### `DELETE /api/rooms/:sketch/:id/images/:filename`
Löscht ein Raumbild sowohl aus R2 (`DeleteObjectCommand`) als auch aus `rooms.json`.

---

### Hinweise
- Bestehende Bilder die noch als relative Pfade in MongoDB gespeichert sind (Altdaten von Heroku-Filesystem) werden von `getImageUrl()` automatisch mit der API-Base-URL zusammengesetzt und weiterhin angezeigt.
- Neue Uploads speichern immer die vollständige `https://cdn.pallas.world/...` URL direkt in der Datenbank.
- Heroku hat ein **ephemeres Filesystem** — lokale Uploads überleben keine Dyno-Neustarts. R2 ist daher die einzige persistente Ablage für Produktions-Uploads.

---

## Admin-Panel

### Zugang
- URL: `/admin`
- Login: E-Mail + Passwort
- Authentifizierung: JWT-Token (`x-auth-token` Header)
- Bei ungültigem Token: automatischer Redirect auf `/admin/login`

### Bereiche

Das Dashboard ist in drei Bereiche (`activeSection`) aufgeteilt, zwischen denen über die Navigation gewechselt wird.

---

### 1. Events

#### Events anzeigen
- Listet alle Events aus der API (`GET /api/events`)
- Getrennte Ansicht: **Zukünftige Events** und **Vergangene Events**
- Suchfunktion und Filterung nach Kategorie
- Zwei Darstellungsmodi: Grid und Liste

#### Event erstellen / bearbeiten
- Formular mit folgenden Feldern:
  - **Titel**
  - **Kategorie** (Dropdown, mit Möglichkeit direkt eine neue Kategorie anzulegen)
  - **Bild** — optionales Event-Bild, das das Kategorien-Standardbild überschreibt; wird in R2 gespeichert
  - **Beschreibung**
  - **Räume** (kommagetrennte Eingabe)
  - **Startzeit / Endzeit**
  - **Preis**
  - **Extralabel** (z.B. "Free Entry")
  - **Link URL + Link Text**
- Live-Vorschau des Events direkt im Formular

#### Event-Bild Upload
1. Bilddatei auswählen
2. **Crop-Modal** öffnet sich (vue-advanced-cropper) — Bild wird im Browser zugeschnitten
3. Nach Bestätigung: automatischer Upload an `POST /api/upload/event-image`
4. R2-URL wird im Event-Formular gespeichert

#### Kategorie erstellen (Inline)
Direkt aus dem Event-Formular heraus:
- Name, Farbe (Color Picker), Beschreibung
- Bild-Upload (Crop → R2 → `defaultImageUrl`)
- Nach Erstellung wird die neue Kategorie automatisch im Event-Formular ausgewählt

#### Event löschen
- Über Kontextmenü (Rechtsklick / Drei-Punkte-Menü)
- Löscht Event in MongoDB via `DELETE /api/events/:id`

---

### 2. Räume

#### Hotspot auswählen
- Linke Seitenleiste zeigt alle Hotspots aus `rooms.json` (unterteilt in Sketches)
- Klick auf einen Hotspot lädt das Bearbeitungsformular

#### Raum-Metadaten bearbeiten
Folgende Felder können bearbeitet werden:
- **Label** (Name des Raums)
- **Kapazität** (z.B. "300 Personen")
- **Fläche** (z.B. "170 qm")
- **Beschreibung** (Freitext)
- **Features** (Tags, z.B. "Bühne", "Bar") — hinzufügen und entfernen
- **Extra-Text** (z.B. "Kombination mit Bar 5 möglich")

Speichern via `PATCH /api/rooms/:sketch/:id`.

#### Raumbilder verwalten

**Hochladen:**
- Mehrere Bilder gleichzeitig auswählbar (max. 20)
- Sharp-Konvertierung zu WebP auf dem Server
- Upload nach `rooms/{imageFolder}/` in R2
- Vollständige R2-URLs werden in `rooms.json` gespeichert

**Reihenfolge ändern:**
- Drag & Drop direkt im Image-Grid
- Neue Reihenfolge via `PUT /api/rooms/:sketch/:id/images/order` gespeichert

**Löschen:**
- Klick auf Löschen-Symbol neben dem Bild
- Löscht Objekt in R2 und entfernt URL aus `rooms.json`

---

### 3. Benutzer

#### Benutzer anzeigen
- Liste aller Admin-Nutzer

#### Benutzer erstellen
- Felder: E-Mail, Passwort, Passwort bestätigen
- Passwort wird serverseitig mit bcrypt gehasht

#### Benutzer löschen
- Bestätigungs-Dialog vor dem Löschen
- Löscht Nutzer via `DELETE /api/users/:id`
