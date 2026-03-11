const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const r2Client = require('../config/r2');
const auth = require('../middleware/auth');

const ROOMS_FILE = path.join(__dirname, '../data/rooms.json');

// Multer: memory storage – kein Schreiben auf Disk
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|gif|webp/i.test(path.extname(file.originalname)) &&
               /image/.test(file.mimetype);
    cb(ok ? null : new Error('Nur Bilddateien erlaubt'), ok);
  },
  limits: { fileSize: 15 * 1024 * 1024 }
});

async function uploadToR2(buffer, key) {
  await r2Client.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: 'image/webp',
  }));
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

function r2KeyFromUrl(url) {
  return url.replace(`${process.env.R2_PUBLIC_URL}/`, '');
}

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
// POST /api/rooms/:sketch/:id/images  — protected, upload images to R2
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

    if (!Array.isArray(spot.images)) spot.images = [];

    const folder = spot.imageFolder;
    const newUrls = [];
    for (const file of req.files) {
      const filename = `${folder}-${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      const key = `rooms/${folder}/${filename}`;
      const webpBuffer = await sharp(file.buffer)
        .webp({ quality: 85, effort: 4 })
        .toBuffer();
      const url = await uploadToR2(webpBuffer, key);
      newUrls.push(url);
    }

    spot.images = [...spot.images, ...newUrls];
    writeRooms(rooms);
    res.json({ msg: 'Images uploaded', images: spot.images });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/rooms/:sketch/:id/images/:filename  — protected
// filename param is the base filename (e.g. orangerie-abc.webp)
// The full R2 URL is matched in the images array
// ─────────────────────────────────────────────
router.delete('/:sketch/:id/images/:filename', auth, async (req, res) => {
  try {
    const { sketch, id, filename } = req.params;
    const rooms = readRooms();
    const spot = findHotspot(rooms, sketch, id);
    if (!spot) return res.status(404).json({ msg: 'Hotspot not found' });

    // Find the full URL in the images array that ends with this filename
    const imageUrl = (spot.images || []).find(img => img.endsWith(`/${filename}`));
    if (imageUrl) {
      const key = r2KeyFromUrl(imageUrl);
      await r2Client.send(new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      }));
    }

    spot.images = (spot.images || []).filter(img => !img.endsWith(`/${filename}`));
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
