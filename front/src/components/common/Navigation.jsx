import React, {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {ROUTES} from '../../utils/constants';
import './Navigation.css';
import supabase from '../../../../back/supabase.js';

const Navigation = () => {
    const location = useLocation();

    // State pour stocker l'utilisateur s'il est connecté
    const [user, setUser] = useState(null);
    // Récupère l'utilisateur au montage du composant
    useEffect(() => {
        const fetchUser = async () => {
            const {data, error} = await supabase.auth.getUser();
            if (!error && data?.user) {
                setUser(data.user); // On met à jour le state si un utilisateur est connecté
            }
        };

        fetchUser();

        // Abonnement pour écouter les changements d'auth (login/logout)
        const {data: subscription} = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setUser(session?.user ?? null);
            }
        );

        // Nettoyage à l'unmount
        return () => {
            subscription?.subscription.unsubscribe();
        };
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navigation">
            <div className="nav-container">
                <Link to={ROUTES.HOME} className="nav-logo">
                    <span className="logo-text">0Viewers</span>
                    <span className="logo-subtitle">Découvrez les streamers oubliés</span>
                </Link>

                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link
                            to={ROUTES.HOME}
                            className={`nav-link ${isActive(ROUTES.HOME) ? 'active' : ''}`}
                        >
                            🏠 Accueil
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            to={ROUTES.STREAMERS}
                            className={`nav-link ${isActive(ROUTES.STREAMERS) ? 'active' : ''}`}
                        >
                            🎮 Streamers
                        </Link>
                    </li>
                    <li className="nav-item">
                        {user ? (
                            <Link
                                to={ROUTES.ACCOUNT}
                                className={`nav-link ${isActive(ROUTES.ACCOUNT) ? 'active' : ''}`}
                            >
                                👤 Mon Compte
                            </Link>
                        ) : (
                            <Link
                                to={ROUTES.SIGNIN}
                                className={`nav-link ${isActive(ROUTES.SIGNIN) ? 'active' : ''}`}
                            >
                                👤 Me connecter
                            </Link>
                        )}
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navigation;