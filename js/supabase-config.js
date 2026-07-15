// supabase-config.js

// ==========================================
// IMPORTANT: ADD YOUR SUPABASE KEYS HERE
// ==========================================
// 1. Go to your Supabase Project Settings -> API
// 2. Copy the "Project URL" and paste it below
// 3. Copy the "anon / public" API Key and paste it below
var SUPABASE_URL = 'https://aywuxnimzuqmocjccvbv.supabase.co';
var SUPABASE_ANON_KEY = 'sb_publishable_rnxMaJuE7KAjchYt3VN53Q_lYuJQpW7';
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

// Initialize the Supabase client
// This uses the global 'supabase' object provided by the CDN script in your HTML
const supabaseClient = supabase.createClient(SUPABASE_URL.trim(), SUPABASE_ANON_KEY.trim());
window.supabaseClient = supabaseClient;
