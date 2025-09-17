const NEXT_PUBLIC_SUPABASE_URL="https://rxtcwunuzksnqrjonreb.supabase.co";
const NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4dGN3dW51emtzbnFyam9ucmViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMjQ3ODksImV4cCI6MjA3MzYwMDc4OX0.iEWbcldjlHy7PluwPGwL2YlSSyv3o1xHhg3vqI19X4s";

// Import du client Supabase
import { createClient } from '@supabase/supabase-js';

// Récupère l'URL et la clé depuis les variables d'environnement (bonne pratique)
const SUPABASE_URL = NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Crée le client Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Exemple de test : récupération de données d'une table "users"
async function getUsers() {
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
        console.error('Erreur Supabase :', error);
    } else {
        console.log('Données récupérées :', data);
    }
}

async function getUser(){
    //Récupération de l'utilisateur actuellement connecté
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        console.error('Erreur lors de la récupération de l’utilisateur :', error);
    } else {
        console.log('Utilisateur connecté :', user);
    }
}

getUsers();
getUser();
