require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Config
const PORT = process.env.PORT || 3001;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Initialize Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Middleware
app.use(cors());
app.use(express.json({ limit: '256kb' }));

// Serve static site
app.use(express.static(__dirname));

// Helpers
function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

// API
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Create Message
app.post('/api/messages', async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  console.log(`Received message from ${name} (${email})`);

  if (![name, email, subject, message].every(isNonEmptyString)) {
    return res.status(400).json({ error: 'name, email, subject, message are required' });
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([
      { 
        name: name.trim(), 
        email: email.trim(), 
        subject: subject.trim(), 
        message: message.trim() 
      }
    ])
    .select();

  if (error) {
    console.error('Supabase Error:', error.message);
    return res.status(500).json({ error: 'Cloud database insert failed' });
  }

  console.log('Message saved to cloud successfully!');
  return res.status(201).json(data[0]);
});

// List Messages
app.get('/api/messages', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '50', 10) || 50, 200);
  
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Supabase Query Error:', error.message);
    return res.status(500).json({ error: 'Cloud database query failed' });
  }

  res.json({ items: data });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Connected to Cloud Database (Supabase)`);
});
