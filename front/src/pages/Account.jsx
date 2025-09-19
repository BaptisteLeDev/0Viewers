import {useEffect, useState} from 'react';
import './Account.css';
import {handleSignOut} from "../components/Register/authform.jsx";
import {getProfil} from "../../../back/auth.js";
import AvatarUpload from "../components/common/AvatarUpload.jsx";


const Account = () => {

    const [profil, setProfil] = useState(null);
    useEffect(() => {
        // Récupération du profil de manière asynchrone
        async function fetchProfil() {
            const data = await getProfil();
            setProfil(data);
        }

        fetchProfil();
    }, []);

    // Pour le moment, page statique - à connecter plus tard avec l'auth Twitch
    const mockStats = {
        streamsWatched: 42,
        streamersDiscovered: 15,
        hoursWatched: 28,
        favoriteGame: "Just Chatting"
    };

    return (
        <div className="account-page">
            {/* Hero Section avec informations du compte */}
            <section className="hero-section">
                <div className="hero-card">
                    {profil ? (
                        <h1 className="hero-title">
                            👤 Bienvenue <span className="highlight">{profil[0].pseudo}</span>
                        </h1>) : (
                        <h1 className="hero-title">
                            👤 Mon <span className="highlight">Compte</span>
                        </h1>
                    )}
                    <p className="hero-subtitle">
                        Vos statistiques de découverte de streamers et votre impact sur la communauté
                    </p>
                    <div className="account-actions">
                        <button className="btn-style" onClick={handleSignOut}>
                            Se déconnecter
                        </button>
                    </div>
                </div>
            </section>

            <div className="account-content">
                {/* Section Avatar */}
                <section className="avatar-section-account">
                    <h2>👤 Photo de profil</h2>
                    <AvatarUpload />
                </section>

                <section className="stats-section">
                    <h2>📊 Vos statistiques</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">{mockStats.streamsWatched}</div>
                            <div className="stat-label">Streams visités</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{mockStats.streamersDiscovered}</div>
                            <div className="stat-label">Streamers découverts</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{mockStats.hoursWatched}h</div>
                            <div className="stat-label">Heures regardées</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Jeu favori</div>
                            <div className="stat-value">{mockStats.favoriteGame}</div>
                        </div>
                    </div>
                </section>

                <section className="impact-section">
                    <h2>💖 Votre impact</h2>
                    <div className="impact-card">
                        <p>
                            Grâce à vos visites, vous avez
                            aidé <strong>{mockStats.streamersDiscovered} streamers</strong>
                            à être découverts ! Chaque vue compte pour ces créateurs de contenu.
                        </p>
                    </div>
                </section>

                <section className="settings-section">
                    <h2>⚙️ Paramètres</h2>
                    <div className="settings-card">
                        <p>
                            🚧 Section en construction
                        </p>
                        <p>
                            Bientôt disponible : connexion Twitch, préférences de jeux,
                            notifications de nouveaux streamers, et plus encore !
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Account;