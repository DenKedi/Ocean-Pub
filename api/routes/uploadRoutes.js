const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Uploads-Verzeichnisse erstellen, falls nicht vorhanden
const categoriesDir = path.join(__dirname, '../uploads/categories');
const eventsDir = path.join(__dirname, '../uploads/events');
const tempDir = path.join(__dirname, '../uploads/temp');

[categoriesDir, eventsDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer-Konfiguration für temporäre Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const tempName = `temp-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, tempName);
  }
});

// Datei-Filter (nur Bilder erlauben)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Nur Bilddateien sind erlaubt (JPEG, PNG, GIF, WebP)'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB
});

// @route   POST /api/upload/category-image
// @desc    Upload pre-cropped category image (cropping done in frontend)
// @access  Private (requires authentication later)
router.post('/category-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Keine Datei hochgeladen'
      });
    }

    // Finalen Dateinamen erstellen
    const categoryName = req.body.categoryName || 'category';
    const sanitizedName = categoryName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const filename = `${sanitizedName}-${Date.now()}.webp`;
    const outputPath = path.join(categoriesDir, filename);

    // Bild mit Sharp zu WebP konvertieren und optimieren
    await sharp(req.file.path)
      .webp({ quality: 85, effort: 4 })
      .toFile(outputPath);

    // Temporäre Datei löschen
    fs.unlinkSync(req.file.path);
    
    // URL zum Bild zurückgeben
    const imageUrl = `/uploads/categories/${filename}`;
    
    res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      filename: filename
    });
  } catch (error) {
    // Bei Fehler temporäre Datei aufräumen
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Fehler beim Hochladen'
    });
  }
});

// @route   POST /api/upload/event-image
// @desc    Upload pre-cropped event image (cropping done in frontend)
// @access  Private (requires authentication later)
router.post('/event-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Keine Datei hochgeladen'
      });
    }

    // Finalen Dateinamen erstellen
    const eventName = req.body.eventName || 'event';
    const sanitizedName = eventName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
    const filename = `${sanitizedName}-${Date.now()}.webp`;
    const outputPath = path.join(eventsDir, filename);

    // Bild mit Sharp zu WebP konvertieren und optimieren
    await sharp(req.file.path)
      .webp({ quality: 85, effort: 4 })
      .toFile(outputPath);

    // Temporäre Datei löschen
    fs.unlinkSync(req.file.path);
    
    // URL zum Bild zurückgeben
    const imageUrl = `/uploads/events/${filename}`;
    
    res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      filename: filename
    });
  } catch (error) {
    // Bei Fehler temporäre Datei aufräumen
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Fehler beim Hochladen'
    });
  }
});

module.exports = router;
