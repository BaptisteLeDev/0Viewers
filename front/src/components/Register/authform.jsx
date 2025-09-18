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
                                ? <>Gérez votre compte <span className="iceland-regular">0Viewers</span></> 
                                : isSignUp 
                                ? <>Rejoignez la communauté <span className="iceland-regular">0Viewers</span></>
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

