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
        <div className="container mt-4" style={{maxWidth: "400px"}}>
            <h1 className="mb-4">Se connecter</h1>

            <form onSubmit={handleSubmit}>
                {/* Champ Email */}
                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>

                {/* Champ Mot de passe */}
                <div className="mb-3">
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>

                {/* Message d'erreur si échec */}
                {error && <p className="text-danger">{error}</p>}

                {/* Bouton de connexion */}
                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                >
                    {loading ? "Connexion..." : "Se connecter"}
                </button>
            </form>
            <p className="mt-3 text-center">
                Pas encore de compte ?{" "}
                <Link to="/signup" className="text-decoration-none">
                    Créez un compte
                </Link>
            </p>
        </div>
    );
}
