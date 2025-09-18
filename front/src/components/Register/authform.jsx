// AuthForm.jsx
import { useState } from "react";
import { signUp, signIn, signOut, getCurrentUser } from "../../../../back/auth.js";


// Déconnexion
// eslint-disable-next-line react-refresh/only-export-components
export async function handleSignOut() {
    const { error } = await signOut();
    if (error) {
        console.error("Erreur déconnexion :", error.message);
        return;
    }
    console.log("Déconnecté");
    // Ici tu peux aussi forcer un reload ou une redirection
    window.location.href = "/";
}
export default function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

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

    // Vérification utilisateur connecté
    async function checkUser() {
        const { data, error } = await getCurrentUser();
        if (error) return setMessage(error.message);
        setUser(data.user);
        setMessage(data.user ? "Utilisateur connecté" : "Aucun utilisateur");
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    {/* Header */}
                    <div className="auth-header">
                        <h1 className="auth-title">
                            {user ? "Mon Compte" : isSignUp ? "Créer un compte" : "Connexion"}
                        </h1>
                        <p className="auth-subtitle">
                            {user 
                                ? "Gérez votre compte 0Viewers" 
                                : isSignUp 
                                ? "Rejoignez la communauté 0Viewers"
                                : "Connectez-vous à votre compte"
                            }
                        </p>
                    </div>

                    {!user ? (
                        <>
                            {/* Formulaire d'authentification */}
                            <form className="auth-form" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">
                                        Adresse email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="nom@exemple.com"
                                        className="form-input"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                        autoCapitalize="none"
                                        autoCorrect="off"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">
                                        Mot de passe
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="form-input"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete={isSignUp ? "new-password" : "current-password"}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="auth-button auth-button-primary"
                                >
                                    {isSignUp ? "Créer mon compte" : "Se connecter"}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="auth-divider">
                                <span className="auth-divider-text">Ou continuer avec</span>
                            </div>

                            {/* GitHub Auth Button */}
                            <button
                                type="button"
                                className="auth-button auth-button-secondary"
                            >
                                <svg className="github-icon" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                GitHub
                            </button>

                            {/* Mode Toggle */}
                            <div className="auth-mode-toggle">
                                <p className="auth-mode-text">
                                    {isSignUp ? "Vous avez déjà un compte ?" : "Vous n'avez pas de compte ?"}
                                </p>
                                <button
                                    type="button"
                                    className="auth-mode-link"
                                    onClick={() => setIsSignUp(!isSignUp)}
                                >
                                    {isSignUp ? "Se connecter" : "Créer un compte"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="user-info">
                            <p className="user-email">Connecté en tant que : {user.email}</p>
                            <div className="user-actions">
                                <button
                                    onClick={checkUser}
                                    className="auth-button auth-button-secondary"
                                >
                                    Vérifier le statut
                                </button>
                                <button
                                    onClick={handleSignOut}
                                    className="auth-button auth-button-primary"
                                >
                                    Se déconnecter
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {message && (
                        <div className="auth-message auth-message-success">
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

