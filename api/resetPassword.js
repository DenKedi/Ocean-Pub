/**
 * One-off password reset script.
 * Usage: node resetPassword.js <email> <newPassword>
 */
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const [,, email, newPassword] = process.argv;

if (!email || !newPassword) {
  console.error('Usage: node resetPassword.js <email> <newPassword>');
  process.exit(1);
}

if (newPassword.length < 6) {
  console.error('Password must be at least 6 characters.');
  process.exit(1);
}

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email });
  if (!user) {
    console.error(`No user found with email: ${email}`);
    await mongoose.disconnect();
    process.exit(1);
  }
  user.password = newPassword; // pre-save hook will hash it
  await user.save();
  console.log(`✓ Password reset for ${email}`);
  await mongoose.disconnect();
})();
