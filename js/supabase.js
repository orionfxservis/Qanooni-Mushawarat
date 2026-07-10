// js/supabase.js

const supabaseUrl = "https://aywuxnimzuqmocjccvbv.supabase.co";
const supabaseKey = "sb_publishable_rnxMaJuE7KAjchYt3VN53Q_lYuJQpW7";

// Use a temporary variable name to prevent SyntaxError with the global SDK namespace
const initializedSupabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

window.supabaseClient = initializedSupabaseClient;
window.supabase = initializedSupabaseClient;