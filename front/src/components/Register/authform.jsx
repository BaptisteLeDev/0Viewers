// AuthForm.jsx
import { useState } from "react";
import { signUp, signIn, signOut, getCurrentUser } from "../../../../back/auth.js";

export default function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");

    // Inscription
    async function handleSignUp(e) {
        e.preventDefault();
        const { data, error } = await signUp(email, password);
        if (error) return setMessage(error.message);
        setMessage("Inscription réussie ! Vérifie tes emails pour confirmer ton compte.");
        setUser(data.user);
    }

    // Connexion
    async function handleSignIn(e) {
        e.preventDefault();
        const { data, error } = await signIn(email, password);
        if (error) return setMessage(error.message);
        setMessage("Connexion réussie !");
        setUser(data.user);
    }

    // Déconnexion
    async function handleSignOut() {
        const { error } = await signOut();
        if (error) return setMessage(error.message);
        setMessage("Déconnecté");
        setUser(null);
    }

    // Vérification utilisateur connecté
    async function checkUser() {
        const { data, error } = await getCurrentUser();
        if (error) return setMessage(error.message);
        setUser(data.user);
        setMessage(data.user ? "Utilisateur connecté" : "Aucun utilisateur");
    }

    return (
        <div className="p-4 max-w-md mx-auto border rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Authentification</h2>

            {!user ? (
                <form className="flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="Email"
                        className="border p-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Mot de passe"
                        className="border p-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={handleSignUp}
                        className="bg-green-600 text-white p-2 rounded"
                    >
                        Inscription
                    </button>

                    <button
                        onClick={handleSignIn}
                        className="bg-blue-600 text-white p-2 rounded"
                    >
                        Connexion
                    </button>
                </form>
            ) : (
                <div className="flex flex-col gap-3">
                    <p className="font-semibold">Connecté en tant que : {user.email}</p>
                    <button
                        onClick={handleSignOut}
                        className="bg-red-600 text-white p-2 rounded"
                    >
                        Déconnexion
                    </button>
                    <button
                        onClick={checkUser}
                        className="bg-gray-600 text-white p-2 rounded"
                    >
                        Vérifier utilisateur
                    </button>
                </div>
            )}

            {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
        </div>
    );
}
