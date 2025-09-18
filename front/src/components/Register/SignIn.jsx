// src/pages/SignIn.jsx
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import supabase from "../../../../back/supabase.js"; // Ton client Supabase déjà configuré

export default function SignIn() {
    // États pour les champs du formulaire
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Appel à Supabase pour se connecter avec email + mot de passe
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            // Affichage d'une erreur si l'auth échoue
            setError(error.message);
            return;
        }

        // Si connexion réussie, on redirige par exemple vers le compte
        navigate("/account");
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    {/* Header */}
                    <div className="auth-header">
                        <h1 className="auth-title">Connexion</h1>
                        <p className="auth-subtitle">
                            Connectez-vous à votre compte <span className="iceland-regular">0Viewers</span>
                        </p>
                    </div>

                    {/* Formulaire de connexion */}
                    <form className="auth-form" onSubmit={handleSubmit}>
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
                                disabled={loading}
                                autoComplete="email"
                                autoCapitalize="none"
                                autoCorrect="off"
                                required
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
                                disabled={loading}
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-button auth-button-primary"
                            disabled={loading}
                        >
                            {loading && <div className="loading-spinner" />}
                            {loading ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>

                    {/* Mode Toggle */}
                    <div className="auth-mode-toggle">
                        <p className="auth-mode-text">
                            Vous n'avez pas de compte ?
                        </p>
                        <Link to="/signup" className="auth-mode-link">
                            Créer un compte
                        </Link>
                    </div>

                    {/* Messages d'erreur */}
                    {error && (
                        <div className="auth-message auth-message-error">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
