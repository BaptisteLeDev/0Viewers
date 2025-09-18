import supabase from './supabase.js';

// Inscription d'un nouvel utilisateur
export async function signUp(email, password, pseudo) {
    // 1. Création dans Supabase Auth
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { pseudo }
        }
    });

    if (error) return { data, error };

    // 2. Insertion dans la table "profil"
    // Utilise l'UUID de l'utilisateur Supabase Auth comme clé
    const userId = data?.user?.id;
    if (!userId) {
        return { data, error: new Error('Utilisateur créé mais ID introuvable pour insérer le profil.') };
    }

    // Essaye d'abord avec une colonne "id" (schema le plus courant)
    let insertError = null;

    const tryInsert = async (row) => {
        const { error: err } = await supabase.from('profil').insert([row]);
        return err || null;
    };

    insertError = await tryInsert({ id: userId, email: email ?? null, pseudo: pseudo ?? null });

    // Si la colonne "id" n'existe pas, on tente avec "id_supa"
    if (insertError) {
        insertError = await tryInsert({ id_supa: userId, email: email ?? null, pseudo: pseudo ?? null });
    }

    if (insertError) {
        // On renvoie l'erreur au frontend pour affichage
        return { data, error: insertError };
    }

    return { data, error: null };
}

// Connexion d'un utilisateur
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
}

// Récupération de l'utilisateur connecté
export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    return { data, error };
}

// Déconnexion
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}
