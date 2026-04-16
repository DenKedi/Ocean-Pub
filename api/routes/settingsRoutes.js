const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Settings = require('../models/Settings');

const SETTINGS_FILE = path.join(__dirname, '../data/settings.json');
const SETTINGS_KEY = 'global';

// Load settings from MongoDB, seeding from JSON file on first run
async function getSettings() {
  let doc = await Settings.findOne({ key: SETTINGS_KEY });
  if (!doc) {
    // Seed from JSON file if it exists
    let seed = { instagram: { postLeft: '', postRight: '' }, drinksPdfUrl: '' };
    try {
      seed = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    } catch (_) {}
    doc = await Settings.create({ key: SETTINGS_KEY, ...seed });
  }
  return doc;
}

// GET /api/settings — public
router.get('/', async (req, res) => {
  try {
    const settings = await getSettings();
    res.json({ instagram: settings.instagram, drinksPdfUrl: settings.drinksPdfUrl });
  } catch (err) {
    res.status(500).json({ msg: 'Fehler beim Lesen der Einstellungen' });
  }
});

// GET /api/settings/drinks-pdf — proxy PDF to avoid CORS
router.get('/drinks-pdf', async (req, res) => {
  try {
    const settings = await getSettings();
    const url = settings.drinksPdfUrl;
    if (!url) return res.status(404).json({ msg: 'Keine Drinks-PDF hinterlegt' });
    const axios = require('axios');
    const response = await axios.get(url, {
      responseType: 'stream',
      timeout: 10000,
      maxRedirects: 3,
      headers: { 'Accept': 'application/pdf' },
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    response.data.pipe(res);
    response.data.on('error', () => {
      if (!res.headersSent) res.status(502).json({ msg: 'PDF stream error' });
    });
  } catch (err) {
    console.error('drinks-pdf proxy error:', err.message);
    res.status(502).json({ msg: 'PDF konnte nicht geladen werden' });
  }
});

// PUT /api/settings/instagram — admin only
router.put('/instagram', auth, async (req, res) => {
  try {
    const { postLeft, postRight } = req.body;
    if (!postLeft || !postRight) {
      return res.status(400).json({ msg: 'postLeft und postRight sind erforderlich' });
    }
    // Only allow alphanumeric Instagram post IDs (no URLs injected)
    if (!/^[A-Za-z0-9_-]+$/.test(postLeft) || !/^[A-Za-z0-9_-]+$/.test(postRight)) {
      return res.status(400).json({ msg: 'Ungültige Post-ID' });
    }
    const settings = await Settings.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { $set: { 'instagram.postLeft': postLeft, 'instagram.postRight': postRight } },
      { new: true, upsert: true }
    );
    res.json(settings.instagram);
  } catch (err) {
    res.status(500).json({ msg: 'Fehler beim Speichern der Einstellungen' });
  }
});

module.exports = router;
