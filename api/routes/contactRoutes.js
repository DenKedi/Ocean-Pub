const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const asyncHandler = require('../middleware/AsyncHandler');

const router = express.Router();

// Gmail OAuth2 transporter
function createTransporter() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: oauth2Client.getAccessToken(),
    },
  });
}

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
      budget,
      nachricht,
      altDatum,
      altDatumWert,
      bookingType,
    } = req.body;

    // Minimal server-side validation
    if (!name || !email || !thema || !gaeste || !datum) {
      return res.status(400).json({ message: 'Pflichtfelder fehlen.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Ungültige E-Mail-Adresse.' });
    }

    const buchungsart = bookingType === 'bike' ? 'Ocean Bike (mobil)' : 'Ocean Pub Dahme (Strandbar)';

    const htmlBody = `
<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8" /></head>
<body style="font-family: Arial, sans-serif; background: #EAF6FB; padding: 24px;">
  <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(22,58,78,0.1);">
    <div style="background: linear-gradient(135deg, #163A4E 0%, #2A7FA5 100%); padding: 28px 32px;">
      <h1 style="color: #fff; font-size: 1.4rem; margin: 0; font-weight: 800;">
        Neue Anfrage — Ocean Pub
      </h1>
      <p style="color: rgba(255,255,255,0.75); margin: 6px 0 0; font-size: 0.9rem;">
        Buchungsart: <strong style="color:#fff;">${escapeHtml(buchungsart)}</strong>
      </p>
    </div>
    <div style="padding: 32px;">
      <h2 style="font-size: 0.85rem; color: #2A7FA5; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0; border-bottom: 2px solid #E8614D; padding-bottom: 6px;">
        Ansprechpartner
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
        <tr><td style="padding: 7px 0; color: #888; width: 40%;">Name</td><td style="padding: 7px 0; color: #163A4E; font-weight: 600;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 7px 0; color: #888;">E-Mail</td><td style="padding: 7px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #2A7FA5;">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding: 7px 0; color: #888;">Telefon</td><td style="padding: 7px 0; color: #163A4E;">${escapeHtml(telefon || '—')}</td></tr>
        <tr><td style="padding: 7px 0; color: #888;">Firma / Organisation</td><td style="padding: 7px 0; color: #163A4E;">${escapeHtml(firma || '—')}</td></tr>
      </table>

      <h2 style="font-size: 0.85rem; color: #2A7FA5; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 2px solid #E8614D; padding-bottom: 6px;">
        Veranstaltung
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
        <tr><td style="padding: 7px 0; color: #888; width: 40%;">Thema / Anlass</td><td style="padding: 7px 0; color: #163A4E; font-weight: 600;">${escapeHtml(thema)}</td></tr>
        <tr><td style="padding: 7px 0; color: #888;">Gästeanzahl</td><td style="padding: 7px 0; color: #163A4E;">${escapeHtml(String(gaeste))}</td></tr>
        <tr><td style="padding: 7px 0; color: #888;">Wunschdatum</td><td style="padding: 7px 0; color: #163A4E;">${escapeHtml(datum)}</td></tr>
        <tr><td style="padding: 7px 0; color: #888;">Alternativdatum</td><td style="padding: 7px 0; color: #163A4E;">${altDatum && altDatumWert ? escapeHtml(altDatumWert) : '—'}</td></tr>
        <tr><td style="padding: 7px 0; color: #888;">Budget</td><td style="padding: 7px 0; color: #163A4E;">${escapeHtml(budget || '—')}</td></tr>
      </table>

      ${nachricht ? `
      <h2 style="font-size: 0.85rem; color: #2A7FA5; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 2px solid #E8614D; padding-bottom: 6px;">
        Nachricht
      </h2>
      <p style="background: #EAF6FB; border-left: 3px solid #2A7FA5; padding: 12px 16px; margin: 0 0 24px; color: #163A4E; line-height: 1.6;">
        ${escapeHtml(nachricht).replace(/\n/g, '<br>')}
      </p>
      ` : ''}
    </div>
    <div style="background: #f4f4f4; padding: 16px 32px; font-size: 0.8rem; color: #aaa;">
      Diese E-Mail wurde automatisch über das Anfrageformular auf ocean-pub.de gesendet.
    </div>
  </div>
</body>
</html>`;

    const mailOptions = {
      from: `"Ocean Pub Anfrage" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      replyTo: `"${name}" <${email}>`,
      subject: `Neue Anfrage [${buchungsart}]: ${thema} — ${name}`,
      html: htmlBody,
    };

    const transporter = createTransporter();
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
