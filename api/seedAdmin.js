/**
 * One-off admin user upsert script.
 * Usage: node seedAdmin.js
 * Creates the default admin user if it does not already exist.
 * Run once during initial setup.
 */
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const DEFAULT_EMAIL = 'cedric@bleck.it';
const DEFAULT_PASSWORD = '***REMOVED***';
const DEFAULT_NAME = 'Cedric';

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: DEFAULT_EMAIL });
  if (existing) {
    console.log(`✓ User ${DEFAULT_EMAIL} already exists — skipping creation.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const user = new User({
    name: DEFAULT_NAME,
    email: DEFAULT_EMAIL,
    password: DEFAULT_PASSWORD, // pre-save hook hashes this
    isSuperAdmin: true,
  });

  await user.save();
  console.log(`✓ Admin user created: ${DEFAULT_EMAIL}`);
  await mongoose.disconnect();
})();
