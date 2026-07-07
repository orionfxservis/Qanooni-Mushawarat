// supabase-config.js

// ==========================================
// IMPORTANT: ADD YOUR SUPABASE KEYS HERE
// ==========================================
// 1. Go to your Supabase Project Settings -> API
// 2. Copy the "Project URL" and paste it below
// 3. Copy the "anon / public" API Key and paste it below
const SUPABASE_URL = 'https://aywuxnimzuqmocjccvbv.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable_rnxMaJuE7KAjchYt3VN53Q_lYuJQpW7';

// Initialize the Supabase client
// This uses the global 'supabase' object provided by the CDN script in your HTML
const supabaseClient = supabase.createClient(SUPABASE_URL.trim(), SUPABASE_ANON_KEY.trim());
window.supabaseClient = supabaseClient;
