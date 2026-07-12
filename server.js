require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'leads.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Make sure the data folder/file exist
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]');
}

function readLeads() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveLead(lead) {
  const leads = readLeads();
  leads.push(lead);
  fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2));
}

// Email setup — only activates if SMTP details are provided in .env
let transporter = null;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });
}

app.post('/api/contact', async (req, res) => {
  const { name, phone, email, suburb, service, message, website } = req.body || {};

  // Honeypot: real visitors never fill this hidden field, bots often do
  if (website) {
    return res.json({ ok: true });
  }

  if (!name || !phone || !email || !suburb) {
    return res.status(400).json({ ok: false, error: 'Please fill in all required fields.' });
  }

  const lead = {
    id: Date.now(),
    date: new Date().toISOString(),
    name,
    phone,
    email,
    suburb,
    service: service || 'Not specified',
    message: message || '',
  };

  try {
    saveLead(lead);
  } catch (err) {
    console.error('Failed to save lead to file:', err);
    return res.status(500).json({ ok: false, error: 'Something went wrong saving your request. Please call or email us directly.' });
  }

  if (transporter) {
    // Not awaited: email happens in the background so a slow or misconfigured
    // SMTP connection can never leave the visitor's form stuck on "Sending..."
    transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.TO_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `New enquiry from ${name} (${suburb})`,
      text: `New website enquiry:\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nSuburb: ${suburb}\nService: ${service}\n\nMessage:\n${message || '(none)'}`,
    }).catch(err => {
      // Lead is already saved even if the email fails, so nothing is lost
      console.error('Failed to send notification email:', err.message);
    });
  }

  res.json({ ok: true });
});

// Simple protected endpoint to view all leads: /api/leads?key=YOUR_ADMIN_KEY
app.get('/api/leads', (req, res) => {
  if (!process.env.ADMIN_KEY || req.query.key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  res.json(readLeads());
});

app.listen(PORT, () => {
  console.log(`Fresh Start Cleaning Adelaide website running on port ${PORT}`);
});
