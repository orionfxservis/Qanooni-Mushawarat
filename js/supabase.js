// js/supabase.js

const supabaseUrl = "https://aywuxnimzuqmocjccvbv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5d3V4bmltenVxbW9jamNjdmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMjAwMjAsImV4cCI6MjA5NTY5NjAyMH0.sEvlzk-Vl4TwS5rpR9mqcZ4AHE1RZgxOt9gPG6PJieQ";

// Use a temporary variable name to prevent SyntaxError with the global SDK namespace
const initializedSupabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

window.supabaseClient = initializedSupabaseClient;
window.supabase = initializedSupabaseClient;