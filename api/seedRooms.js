/**
 * Einmaliges Seed-Script: Importiert rooms.json in MongoDB.
 * Ausführen mit: node seedRooms.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Room = require('./models/Room');

const ROOMS_FILE = path.join(__dirname, 'data/rooms.json');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Verbunden mit MongoDB');

  const data = JSON.parse(fs.readFileSync(ROOMS_FILE, 'utf8'));

  const docs = [];
  for (const [sketch, spots] of Object.entries(data)) {
    for (const spot of spots) {
      docs.push({ sketch, ...spot });
    }
  }

  // Vorhandene Räume löschen und neu einfügen
  await Room.deleteMany({});
  const inserted = await Room.insertMany(docs);
  console.log(`✓ ${inserted.length} Räume importiert`);

  await mongoose.disconnect();
  console.log('Fertig.');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
