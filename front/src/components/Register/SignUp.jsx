import React, {useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {signUp} from "../../../../back/auth.js";

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        pseudo: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Mise à jour des champs du formulaire
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    // Soumission du formulaire
    const handleSubmit = async (e) => { // <-- ajouter async
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage("Les mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await signUp(formData.email, formData.password, formData.pseudo);
            if (error) {
                setMessage(`Erreur: ${error.message}`);
                setLoading(false);
                return;
            }
            setMessage("Inscription réussie ! Vérifie tes emails pour confirmer ton compte.");

            // Redirection après un léger délai pour permettre à l'utilisateur de lire le message
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setMessage(`Erreur inattendue: ${err.message}`);
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    {/* Header */}
                    <div className="auth-header">
                        <h1 className="auth-title">Créer un compte</h1>
                        <p className="auth-subtitle">
                            Rejoignez la communauté 0Viewers
                        </p>
                    </div>

                    {/* Formulaire d'inscription */}
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="pseudo" className="form-label">
                                Nom d'utilisateur
                            </label>
                            <input
                                id="pseudo"
                                type="text"
                                name="pseudo"
                                placeholder="VotrePseudo"
                                className="form-input"
                                value={formData.pseudo}
                                onChange={handleChange}
                                disabled={loading}
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Adresse email
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="nom@exemple.com"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                placeholder="••••••••"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirmer le mot de passe
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                placeholder="••••••••"
                                className="form-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                                autoComplete="new-password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-button auth-button-primary"
                            disabled={loading}
                        >
                            {loading && <div className="loading-spinner" />}
                            {loading ? "Création en cours..." : "Créer mon compte"}
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
                        disabled={loading}
                    >
                        <svg className="github-icon" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub
                    </button>

                    {/* Mode Toggle */}
                    <div className="auth-mode-toggle">
                        <p className="auth-mode-text">
                            Vous avez déjà un compte ?
                        </p>
                        <Link to="/signin" className="auth-mode-link">
                            Se connecter
                        </Link>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className={`auth-message ${message.includes('Erreur') ? 'auth-message-error' : 'auth-message-success'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignUp;
