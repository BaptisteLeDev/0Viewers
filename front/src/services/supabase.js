import { createClient } from '@supabase/supabase-js';

// Configuration Supabase - Variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Configuration par défaut (pour développement - à changer en production)
const defaultUrl = "https://rxtcwunuzksnqrjonreb.supabase.co";
const defaultKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4dGN3dW51emtzbnFyam9ucmViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjQ3ODksImV4cCI6MjA3MzYwMDc4OX0.iEWbcldjlHy7PluwPGwL2YlSSyv3o1xHhg3vqI19X4s";

// Utilise les variables d'environnement ou les valeurs par défaut
const finalUrl = supabaseUrl || defaultUrl;
const finalKey = supabaseAnonKey || defaultKey;

// Vérification que les clés sont présentes
if (!finalUrl || !finalKey) {
  console.error('⚠️  Configuration Supabase manquante !');
  console.error('Assurez-vous d\'avoir les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY');
}

// Création du client Supabase
export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Export par défaut
export default supabase;