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

    // 2. Insertion dans ta table users personnalisée
    if (data.user) {
        const { error: dbError } = await supabase
            .from('users')
            .insert([{ id: data.user.id, email, pseudo }]);
        if (dbError) return { data, error: dbError };
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
