const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const auth = require('../middleware/auth');

const ROOMS_FILE = path.join(__dirname, '../data/rooms.json');
const ROOMS_UPLOADS_DIR = path.join(__dirname, '../uploads/rooms');
const TEMP_DIR = path.join(__dirname, '../uploads/temp');

// Ensure dirs exist
[ROOMS_UPLOADS_DIR, TEMP_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer: temporary storage before WebP conversion
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, TEMP_DIR),
    filename: (req, file, cb) =>
      cb(null, `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`)
  }),
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|gif|webp/i.test(path.extname(file.originalname)) &&
               /image/.test(file.mimetype);
    cb(ok ? null : new Error('Nur Bilddateien erlaubt'), ok);
  },
  limits: { fileSize: 15 * 1024 * 1024 }
});

// Helper: find hotspot by sketch + id
function findHotspot(rooms, sketch, id) {
  const list = rooms[sketch];
  if (!list) return null;
  return list.find(s => String(s.id) === String(id));
}

function readRooms() {
  return JSON.parse(fs.readFileSync(ROOMS_FILE, 'utf8'));
}

function writeRooms(data) {
  fs.writeFileSync(ROOMS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ─────────────────────────────────────────────
// GET /api/rooms  — public
// ─────────────────────────────────────────────
router.get('/', (req, res) => {
  try {
    res.json(readRooms());
  } catch (err) {
    res.status(500).json({ msg: 'Could not read rooms data' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/rooms  — protected, full overwrite
// ─────────────────────────────────────────────
router.put('/', auth, (req, res) => {
  try {
    const data = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ msg: 'Invalid data' });
    }
    writeRooms(data);
    res.json({ msg: 'Rooms updated successfully', data });
  } catch (err) {
    res.status(500).json({ msg: 'Could not write rooms data' });
  }
});

// ─────────────────────────────────────────────
// PATCH /api/rooms/:sketch/:id  — protected, single hotspot metadata
// ─────────────────────────────────────────────
router.patch('/:sketch/:id', auth, (req, res) => {
  try {
    const { sketch, id } = req.params;
    const rooms = readRooms();

    if (!rooms[sketch]) {
      return res.status(404).json({ msg: `Sketch "${sketch}" not found` });
    }

    const index = rooms[sketch].findIndex(s => String(s.id) === String(id));
    if (index === -1) {
      return res.status(404).json({ msg: `Hotspot with id ${id} not found` });
    }

    // Don't allow overwriting the images array via this endpoint
    const { images, ...fields } = req.body;
    rooms[sketch][index] = { ...rooms[sketch][index], ...fields };
    writeRooms(rooms);
    res.json({ msg: 'Hotspot updated', data: rooms[sketch][index] });
  } catch (err) {
    res.status(500).json({ msg: 'Could not update hotspot' });
  }
});

// ─────────────────────────────────────────────
// POST /api/rooms/:sketch/:id/images  — protected, upload images (auto-converts to WebP)
// ─────────────────────────────────────────────
router.post('/:sketch/:id/images', auth, upload.array('images', 20), async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ msg: 'Keine Dateien hochgeladen' });
    }

    const { sketch, id } = req.params;
    const rooms = readRooms();
    const spot = findHotspot(rooms, sketch, id);
    if (!spot) return res.status(404).json({ msg: 'Hotspot not found' });

    const folder = spot.imageFolder;
    const destDir = path.join(ROOMS_UPLOADS_DIR, folder);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    if (!Array.isArray(spot.images)) spot.images = [];

    const newFilenames = [];
    for (const file of req.files) {
      const filename = `${folder}-${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      await sharp(file.path)
        .webp({ quality: 85, effort: 4 })
        .toFile(path.join(destDir, filename));
      fs.unlinkSync(file.path);
      newFilenames.push(filename);
    }

    spot.images = [...spot.images, ...newFilenames];
    writeRooms(rooms);
    res.json({ msg: 'Images uploaded', images: spot.images });
  } catch (err) {
    if (req.files) {
      req.files.forEach(f => { try { fs.unlinkSync(f.path); } catch (_) {} });
    }
    res.status(500).json({ msg: err.message });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/rooms/:sketch/:id/images/:filename  — protected
// ─────────────────────────────────────────────
router.delete('/:sketch/:id/images/:filename', auth, (req, res) => {
  try {
    const { sketch, id, filename } = req.params;
    const rooms = readRooms();
    const spot = findHotspot(rooms, sketch, id);
    if (!spot) return res.status(404).json({ msg: 'Hotspot not found' });

    const filePath = path.join(ROOMS_UPLOADS_DIR, spot.imageFolder, filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    spot.images = (spot.images || []).filter(f => f !== filename);
    writeRooms(rooms);
    res.json({ msg: 'Image deleted', images: spot.images });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ─────────────────────────────────────────────
// PUT /api/rooms/:sketch/:id/images/order  — protected, save new image order
// ─────────────────────────────────────────────
router.put('/:sketch/:id/images/order', auth, (req, res) => {
  try {
    const { sketch, id } = req.params;
    const { images } = req.body;
    if (!Array.isArray(images)) {
      return res.status(400).json({ msg: 'images must be an array' });
    }

    const rooms = readRooms();
    const spot = findHotspot(rooms, sketch, id);
    if (!spot) return res.status(404).json({ msg: 'Hotspot not found' });

    spot.images = images;
    writeRooms(rooms);
    res.json({ msg: 'Order saved', images: spot.images });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
