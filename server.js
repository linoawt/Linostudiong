const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const session = require('express-session');
const nodemailer = require('nodemailer');

// Constants for direct processing (Lino Studio NG Project)
const SUPABASE_URL = 'https://tzplqdwwcwyvdncpqdji.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cGxxZHd3Y3d5dmRuY3BxZGppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4ODU2OTAsImV4cCI6MjA4MjQ2MTY5MH0.OMuKS-w03FNIWKTc82pgwg8oKYSq7Wfu-8x3AU7vtzc';

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Supabase Connection
 * Uses environment variables if present (e.g. on hosting platforms), 
 * otherwise falls back to the hardcoded studio keys.
 */
const supabase = createClient(
  process.env.SUPABASE_URL || SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.API_KEY || SUPABASE_KEY
);

/**
 * Mailer Configuration
 * credentials should be provided via environment variables in the production shell.
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
app.use(express.static('public'));

app.use(session({
  secret: process.env.APP_KEY || 'lino-studio-secure-session-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' } 
}));

// --- ROUTES ---

// API: Notify Admin of New Lead (Professional Email)
app.post('/api/hire/notify', async (req, res) => {
  const { name, email, budget, message, referenceCode, summary } = req.body;

  // Basic check for mail credentials
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.warn('Mailer credentials missing in environment. Email not sent.');
    return res.status(200).json({ success: false, message: 'Lead saved but notification skipped' });
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f0f4f8; margin: 0; padding: 40px; }
        .container { background-color: #ffffff; border-radius: 40px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.05); max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; }
        .content { padding: 40px; color: #1e293b; }
        .lead-info { background-color: #f8fafc; border-radius: 20px; padding: 25px; margin-bottom: 30px; border: 1px inset #f1f5f9; }
        .label { font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px; }
        .value { font-size: 16px; font-weight: 600; color: #1e293b; margin-bottom: 15px; }
        .ref-badge { display: inline-block; background-color: #4f46e5; color: white; padding: 8px 16px; border-radius: 12px; font-weight: 800; font-size: 18px; letter-spacing: -0.02em; }
        .summary-box { border-left: 4px solid #4f46e5; padding-left: 20px; font-style: italic; color: #64748b; margin: 20px 0; }
        .footer { padding: 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Lino Studio NG</h1>
          <p>New Studio Inquiry Received</p>
        </div>
        <div class="content">
          <div style="text-align: center; margin-bottom: 30px;">
             <div class="label">Reference Token</div>
             <div class="ref-badge">${referenceCode}</div>
          </div>
          
          <div class="lead-info">
            <div class="label">Client Name</div>
            <div class="value">${name}</div>
            
            <div class="label">Email Address</div>
            <div class="value">${email}</div>
            
            <div class="label">Budget Tier</div>
            <div class="value">${budget}</div>
          </div>

          <div class="label">AI Insight Summary</div>
          <div class="summary-box">${summary}</div>

          <div class="label">Original Message</div>
          <p style="line-height: 1.6; color: #475569;">${message}</p>
        </div>
        <div class="footer">
          &copy; 2025 Lino Studio NG &bull; Digital Experience Studio<br>
          This is an automated studio notification.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Lino Studio Bot" <${process.env.MAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.MAIL_USER,
      subject: `🚀 New Lead: ${name} [Ref: ${referenceCode}]`,
      html: htmlContent,
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Mail Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => console.log(`Studio Backend running on port ${PORT} (Supabase Direct Ready)`));
