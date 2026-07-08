// supabase-config.js

// ==========================================
// IMPORTANT: ADD YOUR SUPABASE KEYS HERE
// ==========================================
// 1. Go to your Supabase Project Settings -> API
// 2. Copy the "Project URL" and paste it below
// 3. Copy the "anon / public" API Key and paste it below
const SUPABASE_URL = 'https://aywuxnimzuqmocjccvbv.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5d3V4bmltenVxbW9jamNjdmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMjAwMjAsImV4cCI6MjA5NTY5NjAyMH0.sEvlzk-Vl4TwS5rpR9mqcZ4AHE1RZgxOt9gPG6PJieQ';

// Initialize the Supabase client
// This uses the global 'supabase' object provided by the CDN script in your HTML
const supabaseClient = supabase.createClient(SUPABASE_URL.trim(), SUPABASE_ANON_KEY.trim());
window.supabaseClient = supabaseClient;
