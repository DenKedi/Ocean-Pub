const express = require('express');
const nodemailer = require('nodemailer');
const asyncHandler = require('../middleware/AsyncHandler');

const router = express.Router();

// Nodemailer transporter – konfiguriert via .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// POST /api/contact
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const {
      name,
      email,
      telefon,
      firma,
      thema,
      gaeste,
      datum,
      musikrichtung,
      djQuelle,
      raeume,
      budget,
      nachricht,
      altDatum,
      altDatumWert,
    } = req.body;

    // Minimal server-side validation
    if (!name || !email || !thema || !gaeste || !datum) {
      return res.status(400).json({ message: 'Pflichtfelder fehlen.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Ungültige E-Mail-Adresse.' });
    }

    const raeumeListe = Array.isArray(raeume) && raeume.length
      ? raeume.join(', ')
      : '—';

    const htmlBody = `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8" /></head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 24px;">
  <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden;">
    <div style="background: #111; padding: 24px 32px;">
      <h1 style="color: #fff; font-size: 1.4rem; margin: 0; letter-spacing: 0.15em; text-transform: uppercase;">
        Neue Anfrage — Pallas
      </h1>
    </div>
    <div style="padding: 32px;">
      <h2 style="font-size: 1rem; color: #555; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 0;">
        Ansprechpartner
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr><td style="padding: 6px 0; color: #888; width: 40%;">Name</td><td style="padding: 6px 0;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 6px 0; color: #888;">E-Mail</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Telefon</td><td style="padding: 6px 0;">${escapeHtml(telefon || '—')}</td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Firma / Organisation</td><td style="padding: 6px 0;">${escapeHtml(firma || '—')}</td></tr>
      </table>

      <h2 style="font-size: 1rem; color: #555; text-transform: uppercase; letter-spacing: 0.08em;">
        Veranstaltung
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr><td style="padding: 6px 0; color: #888; width: 40%;">Thema / Anlass</td><td style="padding: 6px 0;">${escapeHtml(thema)}</td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Gästeanzahl</td><td style="padding: 6px 0;">${escapeHtml(String(gaeste))}</td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Wunschdatum</td><td style="padding: 6px 0;">${escapeHtml(datum)}</td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Alternativdatum</td><td style="padding: 6px 0;">${altDatum && altDatumWert ? escapeHtml(altDatumWert) : '—'}</td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Musikrichtung</td><td style="padding: 6px 0;">${escapeHtml(musikrichtung || '—')}</td></tr>
        <tr><td style="padding: 6px 0; color: #888;">DJ</td><td style="padding: 6px 0;">${escapeHtml(djQuelle || '—')}</td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Räume</td><td style="padding: 6px 0;">${escapeHtml(raeumeListe)}</td></tr>
        <tr><td style="padding: 6px 0; color: #888;">Budget</td><td style="padding: 6px 0;">${escapeHtml(budget || '—')}</td></tr>
      </table>

      ${nachricht ? `
      <h2 style="font-size: 1rem; color: #555; text-transform: uppercase; letter-spacing: 0.08em;">
        Nachricht
      </h2>
      <p style="background: #f9f9f9; border-left: 3px solid #111; padding: 12px 16px; margin: 0 0 24px;">
        ${escapeHtml(nachricht).replace(/\n/g, '<br>')}
      </p>
      ` : ''}
    </div>
    <div style="background: #f4f4f4; padding: 16px 32px; font-size: 0.8rem; color: #aaa;">
      Diese E-Mail wurde automatisch über das Anfrageformular auf pallas.world gesendet.
    </div>
  </div>
</body>
</html>`;

    const mailOptions = {
      from: `"Pallas Anfrage" <${process.env.MAIL_FROM}>`,
      to: 'request@pallas.world',
      replyTo: `"${name}" <${email}>`,
      subject: `Neue Anfrage: ${thema} — ${name}`,
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Anfrage erfolgreich gesendet.' });
  })
);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports = router;
