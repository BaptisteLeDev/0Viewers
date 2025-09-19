import {useState} from 'react';
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
                            Rejoignez la communauté <span className="iceland-regular">0Viewers</span>
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
