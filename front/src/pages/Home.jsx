import React from "react";
import { Link } from "react-router-dom";
import Loading from "../components/common/Loading";
import ZeroViewersStreamerCard from "../components/streamers/ZeroViewersStreamerCard";
import { useZeroViewersStreamers } from "../hooks/useZeroViewersStreamers";
import { ROUTES } from "../utils/constants";
import "./Home.css";
import "../components/streamers/StreamerList.css";

const Home = () => {
  const { streamers, loading, error, refresh } = useZeroViewersStreamers();

  // Sélectionner un streamer aléatoire pour la mise en avant
  const featuredStreamer =
    streamers.length > 0
      ? streamers[Math.floor(Math.random() * streamers.length)]
      : null;

  if (loading) {
    return (
      <Loading message="Recherche d'un streamer français à découvrir..." />
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops ! 😅</h2>
        <p>Impossible de charger les streamers pour le moment.</p>
        <p className="error-detail">{error}</p>
        <button onClick={refresh} className="btn-style">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-card">
            <h1 className="hero-title">
              Découvrez les{" "}
              <span className="highlight">vrais talents français</span>
            </h1>
            <p className="hero-subtitle">
              Des streamers français passionnés qui méritent votre attention,
              même s'ils n'ont pas encore trouvé leur public.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Streamer */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <span className="section-icon">🎯</span>
            <h2 className="section-title">Streamer français du moment</h2>
          </div>

          {featuredStreamer ? (
            <div className="featured-content">
              <ZeroViewersStreamerCard 
                key={featuredStreamer.id} 
                streamer={featuredStreamer}
                featured={true}
                showEmbed={true}
              />
              {/* Action Buttons */}
              <div className="action-buttons">
                <button onClick={refresh} className="btn-style">
                  🎲 Découvrir un autre streamer
                </button>
                <Link to={ROUTES.STREAMERS} className="btn-style">
                  🔍 Voir tous les streamers français
                </Link>
              </div>
            </div>
          ) : (
            <div className="no-streams">
              <div className="no-streams-icon">🤔</div>
              <h3>Aucun streamer français à 0 viewers en ce moment</h3>
              <p>Revenez plus tard ou explorez notre liste complète !</p>
              <Link to={ROUTES.STREAMERS} className="explore-btn">
                🔍 Voir tous les streamers français
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <img 
                  src="https://images.emojiterra.com/twitter/v14.0/256px/1f1eb-1f1f7.png" 
                  alt="Drapeau français" 
                  width="48" 
                  height="48"
                />
              </div>
              <h3 className="stat-title">Streamers français</h3>
              <p className="stat-description">
                Découvrez des talents de la communauté française
              </p>
            </div>

            <div className="stat-card">
              <div className="stat-icon">❤️</div>
              <h3 className="stat-title">Communauté</h3>
              <p className="stat-description">
                Aidez les petits streamers français à grandir
              </p>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🚀</div>
              <h3 className="stat-title">En direct</h3>
              <p className="stat-description">
                <span className="stat-number">{streamers.length}</span> streamers français qui ont besoin de votre aide sur <span className="iceland-regular">0Viewers</span> !
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
