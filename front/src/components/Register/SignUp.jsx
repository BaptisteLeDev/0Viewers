import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
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

        try {
            const { data, error } = await signUp(formData.email, formData.password, formData.pseudo);
            if (error) {
                setMessage(`Erreur: ${error.message}`);
                return;
            }
            setMessage("Inscription réussie ! Vérifie tes emails pour confirmer ton compte.");

            // Redirection après un léger délai pour permettre à l'utilisateur de lire le message
            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setMessage(`Erreur inattendue: ${err.message}`);
        }
    };

    return (
        <div className="register-container">
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="pseudo"
                    placeholder="Nom d'utilisateur"
                    value={formData.pseudo}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmer le mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <button type="submit">S'enregistrer</button>
            </form>
        </div>
    );
};

export default SignUp;
