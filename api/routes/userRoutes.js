const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const asyncHandler = require("../middleware/AsyncHandler");

// GET /api/users — list all admins (protected)
router.get(
  "/",
  auth,
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").sort({ date: -1 })
    res.status(200).json(users)
  })
)

// GET /api/users/me
router.get(
  "/me",
  auth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  })
);

// GET /api/users/:id
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json(user);
  })
);

// PUT /api/users/update/:id (protected)
router.put(
  "/update/:id",
  auth,
  asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.isLegacy)
      return res.status(403).json({ msg: "Der Legacy-Admin kann nicht bearbeitet werden" });
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    await user.save();
    res.status(200).json({ msg: "Admin aktualisiert" });
  })
);

// PUT /api/users/:id/reset-password (protected)
router.put(
  "/:id/reset-password",
  auth,
  asyncHandler(async (req, res) => {
    const { password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ msg: "Passwort muss mindestens 6 Zeichen lang sein" });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.isLegacy)
      return res.status(403).json({ msg: "Das Passwort des Legacy-Admins kann nicht zurückgesetzt werden" });
    user.password = password; // pre-save hook hashes it
    await user.save();
    res.status(200).json({ msg: "Passwort zurückgesetzt" });
  })
);

// POST /api/users/register (protected — only existing admins can create new ones)
router.post(
  "/register",
  auth,
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Benutzer mit dieser E-Mail existiert bereits" });
    }

    user = new User({ name, email, password});
    await user.save();


    res.status(200).json({ msg: "Registrierung erfolgreich." });
  })
);

// POST /api/users/login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Ungültige Anmeldedaten" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Ungültige Anmeldedaten" });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.status(200).json({ token });
    });
  })
);

// DELETE /api/users/:id (protected)
router.delete(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ msg: "User not found" })
    // Prevent self-deletion
    if (req.user.id === req.params.id)
      return res.status(400).json({ msg: "Du kannst deinen eigenen Account nicht löschen" })
    // Prevent deletion of legacy admin
    if (user.isLegacy)
      return res.status(403).json({ msg: "Der Legacy-Admin kann nicht gelöscht werden" })
    await user.deleteOne()
    res.status(200).json({ msg: "Admin gelöscht" })
  })
)

module.exports = router;