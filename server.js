
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const session = require('express-session');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// --- STUDIO CONSTANTS ---
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tzplqdwwcwyvdncpqdji.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cGxxZHd3Y3d5dmRuY3BxZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4ODU2OTAsImV4cCI6MjA4MjQ2MTY5MH0.OMuKS-w03FNIWKTc82pgwg8oKYSq7Wfu-8x3AU7vtzc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- REUSABLE CLAYMORPHIC EMAIL TEMPLATE GENERATOR (Ported to JS for Node) ---
const getClaymorphicEmailTemplate = (type, data) => {
  const accentColor = '#4F46E5';
  const bgColor = '#F0F4F8';

  const typeConfig = {
    PROJECT_UPDATE: { icon: '🚀', label: 'In-Progress Update' },
    COMPLETION: { icon: '✨', label: 'Project Delivered' },
    GENERAL_MESSAGE: { icon: '📩', label: 'New Notification' },
    NEW_LEAD: { icon: '⚡', label: 'New Studio Lead' }
  };

  const { icon, label } = typeConfig[type] || typeConfig.GENERAL_MESSAGE;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: ${bgColor}; margin: 0; padding: 20px; }
        .wrapper { max-width: 600px; margin: 0 auto; background-color: ${bgColor}; padding: 30px; border-radius: 40px; }
        .card { 
          background-color: #ffffff; 
          border-radius: 35px; 
          padding: 40px; 
          box-shadow: 20px 20px 60px #cbd5e0, -20px -20px 60px #ffffff;
          text-align: center;
        }
        .icon-box {
          width: 80px;
          height: 80px;
          margin: 0 auto 25px;
          background-color: #ffffff;
          border-radius: 25px;
          box-shadow: inset 8px 8px 16px #cbd5e0, inset -8px -8px 16px #ffffff;
          display: table;
        }
        .icon-box span {
          display: table-cell;
          vertical-align: middle;
          font-size: 35px;
        }
        .label {
          font-size: 10px;
          font-weight: 900;
          color: ${accentColor};
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        h1 { font-size: 24px; font-weight: 800; color: #1a1a2e; margin: 0 0 20px; }
        p { font-size: 16px; line-height: 1.6; color: #4a5568; margin-bottom: 30px; text-align: left; }
        .button {
          display: inline-block;
          background-color: ${accentColor};
          color: #ffffff !important;
          padding: 18px 35px;
          border-radius: 20px;
          text-decoration: none;
          font-weight: 700;
          box-shadow: 0 10px 20px rgba(79, 70, 229, 0.2);
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #a0aec0;
          text-align: center;
        }
        .ref-code {
          font-family: monospace;
          background: #f1f5f9;
          padding: 5px 10px;
          border-radius: 8px;
          color: #4a5568;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="card">
          <div class="icon-box"><span>${icon}</span></div>
          <div class="label">${label}</div>
          <h1>${data.title}</h1>
          <p>Hi Admin,<br><br><strong>${data.recipientName}</strong> just reached out via the website.<br><br>${data.message}</p>
          ${data.actionUrl ? `<a href="${data.actionUrl}" class="button">${data.actionText || 'View Details'}</a>` : ''}
          ${data.referenceCode ? `<div style="margin-top: 30px; font-size: 11px;">Reference Token: <span class="ref-code">${data.referenceCode}</span></div>` : ''}
        </div>
        <div class="footer">
          &copy; 2025 Lino Studio NG &bull; Designing Identity. Building Reality.
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Mailer Configuration
 */
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.APP_KEY || 'lino-studio-secure-session-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' } 
}));

/**
 * API: Notify Admin of New Lead
 * Called after frontend successfully inserts into Supabase
 */
app.post('/api/hire/notify', async (req, res) => {
  const { name, email, budget, message, referenceCode, summary } = req.body;

  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.warn('Mailer credentials missing. Notification skipped.');
    return res.status(200).json({ success: false, message: 'Lead saved locally only.' });
  }

  const emailBody = getClaymorphicEmailTemplate('NEW_LEAD', {
    title: `Project Inquiry: ${budget || 'General'}`,
    recipientName: name,
    message: `
      <strong>Email:</strong> ${email}<br>
      <strong>Budget:</strong> ${budget || 'N/A'}<br>
      <strong>Summary:</strong> ${summary || 'None provided.'}<br><br>
      <strong>Message:</strong> ${message}
    `,
    referenceCode: referenceCode,
    actionUrl: `mailto:${email}`,
    actionText: 'Reply Directly'
  });

  try {
    await transporter.sendMail({
      from: `"Lino Studio Bot" <${process.env.MAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.MAIL_USER,
      subject: `🚀 Studio Inquiry: ${name} [${referenceCode}]`,
      html: emailBody,
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Mail Transmission Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => console.log(`Studio Notification Engine running on port ${PORT}`));
