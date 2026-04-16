const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const r2Client = require('../config/r2');
const auth = require('../middleware/auth');

const SETTINGS_FILE = path.join(__dirname, '../data/settings.json');

// Multer: memory storage – kein Schreiben auf Disk
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|gif|webp/i.test(path.extname(file.originalname)) &&
               /image/.test(file.mimetype);
    cb(ok ? null : new Error('Nur Bilddateien sind erlaubt (JPEG, PNG, GIF, WebP)'), ok);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Separate Multer-Instanz für PDFs
const uploadPdf = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const ok = /\.pdf$/i.test(path.extname(file.originalname)) &&
               file.mimetype === 'application/pdf';
    cb(ok ? null : new Error('Nur PDF-Dateien sind erlaubt'), ok);
  },
  limits: { fileSize: 20 * 1024 * 1024 }
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

// @route   POST /api/upload/category-image
// @desc    Upload pre-cropped category image (cropping done in frontend)
// @access  Private
router.post('/category-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Keine Datei hochgeladen' });
    }

    const categoryName = req.body.categoryName || 'category';
    const sanitizedName = categoryName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const filename = `${sanitizedName}-${Date.now()}.webp`;
    const key = `categories/${filename}`;

    const webpBuffer = await sharp(req.file.buffer)
      .rotate()
      .webp({ quality: 85, effort: 4 })
      .toBuffer();

    const imageUrl = await uploadToR2(webpBuffer, key);

    res.status(200).json({ success: true, imageUrl, filename });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Fehler beim Hochladen' });
  }
});

// @route   POST /api/upload/event-image
// @desc    Upload pre-cropped event image (cropping done in frontend)
// @access  Private
router.post('/event-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Keine Datei hochgeladen' });
    }

    const eventName = req.body.eventName || 'event';
    const sanitizedName = eventName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const filename = `${sanitizedName}-${Date.now()}.webp`;
    const key = `events/${filename}`;

    const webpBuffer = await sharp(req.file.buffer)
      .rotate()
      .webp({ quality: 85, effort: 4 })
      .toBuffer();

    const imageUrl = await uploadToR2(webpBuffer, key);

    res.status(200).json({ success: true, imageUrl, filename });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Fehler beim Hochladen' });
  }
});

// PDF-Komprimierung via pdf-lib + sharp (recomprimiert eingebettete JPEG-Bilder)
async function compressPdf(inputBuffer) {
  const pdfDoc = await PDFDocument.load(inputBuffer, { updateMetadata: false });

  const objects = pdfDoc.context.enumerateIndirectObjects();
  let imagesCompressed = 0;

  for (const [ref, pdfObject] of objects) {
    if (!(pdfObject instanceof PDFRawStream)) continue;

    const { dict } = pdfObject;
    const subtype = dict.get(PDFName.of('Subtype'));
    if (!subtype || subtype.toString() !== '/Image') continue;

    const filter = dict.get(PDFName.of('Filter'));
    if (!filter) continue;
    const filterStr = filter.toString();

    // Nur DCTDecode (JPEG) Bilder recomprimieren
    if (!filterStr.includes('DCTDecode')) continue;

    const width = dict.get(PDFName.of('Width'));
    const height = dict.get(PDFName.of('Height'));
    if (!width || !height) continue;

    try {
      const originalData = pdfObject.contents;
      const recompressed = await sharp(Buffer.from(originalData))
        .jpeg({ quality: 55, mozjpeg: true })
        .toBuffer();

      if (recompressed.length < originalData.length) {
        pdfObject.contents = new Uint8Array(recompressed);
        dict.set(PDFName.of('Length'), pdfDoc.context.obj(recompressed.length));
        imagesCompressed++;
      }
    } catch {
      // Bild konnte nicht verarbeitet werden, überspringen
    }
  }

  console.log(`PDF: ${imagesCompressed} Bilder recomprimiert`);
  const compressed = await pdfDoc.save({ useObjectStreams: true });
  return Buffer.from(compressed);
}

// @route   POST /api/upload/drinks-pdf
// @desc    Upload drinks menu PDF to R2 (compressed) and persist URL in settings.json
// @access  Private (admin only)
router.post('/drinks-pdf', auth, uploadPdf.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Keine Datei hochgeladen' });
    }

    let pdfBuffer = req.file.buffer;
    const originalSize = pdfBuffer.length;
    let compressed = false;

    // Komprimiere PDF wenn größer als 2MB
    if (originalSize > 2 * 1024 * 1024) {
      try {
        pdfBuffer = await compressPdf(pdfBuffer);
        compressed = true;
        console.log(`PDF komprimiert: ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(pdfBuffer.length / 1024 / 1024).toFixed(1)}MB`);
      } catch (err) {
        console.warn('PDF-Komprimierung fehlgeschlagen:', err.message);
        pdfBuffer = req.file.buffer;
      }
    }

    const filename = `drinks-menu-${Date.now()}.pdf`;
    const key = `drinks/${filename}`;

    await r2Client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
    }));

    const pdfUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    // Persist URL in settings.json
    const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    settings.drinksPdfUrl = pdfUrl;
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');

    res.status(200).json({
      success: true,
      pdfUrl,
      originalSize: (originalSize / 1024 / 1024).toFixed(1) + 'MB',
      finalSize: (pdfBuffer.length / 1024 / 1024).toFixed(1) + 'MB',
      compressed,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Fehler beim Hochladen' });
  }
});

module.exports = router;
