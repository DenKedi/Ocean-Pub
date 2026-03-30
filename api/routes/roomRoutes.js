const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const r2Client = require('../config/r2');
const auth = require('../middleware/auth');
const Room = require('../models/Room');

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

// Alle Räume als { sketch1: [...], sketch2: [...] } formatieren
function groupBySketches(docs) {
  const result = {};
  for (const doc of docs) {
    const obj = doc.toObject();
    const { sketch, _id, __v, createdAt, updatedAt, ...rest } = obj;
    if (!result[sketch]) result[sketch] = [];
    result[sketch].push(rest);
  }
  return result;
}

// ─────────────────────────────────────────────
// GET /api/rooms  — public
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const docs = await Room.find().sort({ sketch: 1, id: 1 });
    res.json(groupBySketches(docs));
  } catch (err) {
    res.status(500).json({ msg: 'Could not read rooms data' });
  }
});

// ─────────────────────────────────────────────
// PUT /api/rooms  — protected, full overwrite
// ─────────────────────────────────────────────
router.put('/', auth, async (req, res) => {
  try {
    const data = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ msg: 'Invalid data' });
    }

    // data ist { sketch1: [...], sketch2: [...] }
    const ops = [];
    for (const [sketch, spots] of Object.entries(data)) {
      for (const spot of spots) {
        const { id, ...fields } = spot;
        ops.push({
          updateOne: {
            filter: { sketch, id },
            update: { $set: { sketch, id, ...fields } },
            upsert: true
          }
        });
      }
    }
    if (ops.length) await Room.bulkWrite(ops);

    const docs = await Room.find().sort({ sketch: 1, id: 1 });
    res.json({ msg: 'Rooms updated successfully', data: groupBySketches(docs) });
  } catch (err) {
    res.status(500).json({ msg: 'Could not write rooms data' });
  }
});

// ─────────────────────────────────────────────
// PATCH /api/rooms/:sketch/:id  — protected, single hotspot metadata
// ─────────────────────────────────────────────
router.patch('/:sketch/:id', auth, async (req, res) => {
  try {
    const { sketch, id } = req.params;

    // Bilder-Array nicht über diesen Endpoint überschreiben
    const { images, _id, __v, ...fields } = req.body;

    const doc = await Room.findOneAndUpdate(
      { sketch, id: Number(id) },
      { $set: fields },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ msg: 'Hotspot not found' });

    res.json({ msg: 'Hotspot updated', data: doc });
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
    const doc = await Room.findOne({ sketch, id: Number(id) });
    if (!doc) return res.status(404).json({ msg: 'Hotspot not found' });

    const folder = doc.imageFolder;
    const newUrls = [];
    for (const file of req.files) {
      const filename = `${folder}-${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      const key = `rooms/${folder}/${filename}`;
      const webpBuffer = await sharp(file.buffer)
        .rotate()
        .webp({ quality: 85, effort: 4 })
        .toBuffer();
      const url = await uploadToR2(webpBuffer, key);
      newUrls.push(url);
    }

    doc.images = [...doc.images, ...newUrls];
    await doc.save();
    res.json({ msg: 'Images uploaded', images: doc.images });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ─────────────────────────────────────────────
// DELETE /api/rooms/:sketch/:id/images/:filename  — protected
// ─────────────────────────────────────────────
router.delete('/:sketch/:id/images/:filename', auth, async (req, res) => {
  try {
    const { sketch, id, filename } = req.params;
    const doc = await Room.findOne({ sketch, id: Number(id) });
    if (!doc) return res.status(404).json({ msg: 'Hotspot not found' });

    const imageUrl = (doc.images || []).find(img => img.endsWith(`/${filename}`));
    if (imageUrl) {
      const key = r2KeyFromUrl(imageUrl);
      await r2Client.send(new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      }));
    }

    doc.images = (doc.images || []).filter(img => !img.endsWith(`/${filename}`));
    await doc.save();
    res.json({ msg: 'Image deleted', images: doc.images });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ─────────────────────────────────────────────
// PUT /api/rooms/:sketch/:id/images/order  — protected, save new image order
// ─────────────────────────────────────────────
router.put('/:sketch/:id/images/order', auth, async (req, res) => {
  try {
    const { sketch, id } = req.params;
    const { images } = req.body;
    if (!Array.isArray(images)) {
      return res.status(400).json({ msg: 'images must be an array' });
    }

    const doc = await Room.findOneAndUpdate(
      { sketch, id: Number(id) },
      { $set: { images } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ msg: 'Hotspot not found' });

    res.json({ msg: 'Order saved', images: doc.images });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
