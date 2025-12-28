
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase Connection
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (for admin bypass) in .env
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: process.env.APP_KEY || 'lino-studio-supabase-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// --- ROUTES ---

// Public Home (SSR with Supabase)
app.get('/', async (req, res) => {
  try {
    const { data: settings } = await supabase.from('settings').select('*').single();
    const { data: projects } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    const { data: services } = await supabase.from('services').select('*');
    
    res.render('index', { 
      config: settings || {}, 
      projects: projects || [], 
      services: services || [] 
    });
  } catch (err) {
    console.error('Supabase Fetch Error:', err);
    res.status(500).send('Database connection error');
  }
});

// API: Get Config
app.get('/api/config', async (req, res) => {
  const { data, error } = await supabase.from('settings').select('*').single();
  if (error) return res.status(500).json(error);
  res.json(data);
});

// API: Update Config (Admin Protected)
app.post('/api/config/update', async (req, res) => {
  if (!req.session.isAdmin) return res.status(401).send('Unauthorized');
  
  const updates = req.body;
  const { data, error } = await supabase
    .from('settings')
    .update(updates)
    .eq('id', 1);
    
  if (error) return res.status(500).json(error);
  res.json({ success: true, data });
});

// API: Leads Management
app.post('/api/leads/submit', async (req, res) => {
  const { name, email, type, message, referenceCode, budget } = req.body;
  const { error } = await supabase
    .from('leads')
    .insert([{ name, email, type, message, referenceCode, budget }]);
    
  if (error) return res.status(500).json(error);
  res.json({ success: true });
});

app.get('/api/leads', async (req, res) => {
  if (!req.session.isAdmin) return res.status(401).send('Unauthorized');
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) return res.status(500).json(error);
  res.json(data);
});

// Admin Authentication
app.post('/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'LinoAdmin2025') {
    req.session.isAdmin = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'Invalid Key' });
  }
});

app.listen(PORT, () => console.log(`Studio Backend (Supabase) running on http://localhost:${PORT}`));
