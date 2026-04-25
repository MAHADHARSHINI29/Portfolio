require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
    // Handle POST (Send Message)
    if (req.method === 'POST') {
        const { name, email, subject, message } = req.body || {};
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const { data, error } = await supabase
            .from('messages')
            .insert([{ name, email, subject, message }])
            .select();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(201).json(data[0]);
    }

    // Handle GET (List Messages)
    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ items: data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
