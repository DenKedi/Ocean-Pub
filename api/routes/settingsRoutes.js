const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

const SETTINGS_FILE = path.join(__dirname, '../data/settings.json');

function readSettings() {
  return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
}

function writeSettings(data) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// GET /api/settings — public
router.get('/', (req, res) => {
  try {
    const settings = readSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ msg: 'Fehler beim Lesen der Einstellungen' });
  }
});

// GET /api/settings/drinks-pdf — proxy PDF to avoid CORS
router.get('/drinks-pdf', async (req, res) => {
  try {
    const settings = readSettings();
    const url = settings.drinksPdfUrl;
    if (!url) return res.status(404).json({ msg: 'Keine Drinks-PDF hinterlegt' });
    const axios = require('axios');
    const response = await axios.get(url, { responseType: 'stream', timeout: 15000 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    response.data.pipe(res);
  } catch (err) {
    res.status(502).json({ msg: 'PDF konnte nicht geladen werden' });
  }
});

// PUT /api/settings/instagram — admin only
router.put('/instagram', auth, (req, res) => {
  try {
    const { postLeft, postRight } = req.body;
    if (!postLeft || !postRight) {
      return res.status(400).json({ msg: 'postLeft und postRight sind erforderlich' });
    }
    // Only allow alphanumeric Instagram post IDs (no URLs injected)
    if (!/^[A-Za-z0-9_-]+$/.test(postLeft) || !/^[A-Za-z0-9_-]+$/.test(postRight)) {
      return res.status(400).json({ msg: 'Ungültige Post-ID' });
    }
    const settings = readSettings();
    settings.instagram = { postLeft, postRight };
    writeSettings(settings);
    res.json(settings.instagram);
  } catch (err) {
    res.status(500).json({ msg: 'Fehler beim Speichern der Einstellungen' });
  }
});

module.exports = router;
