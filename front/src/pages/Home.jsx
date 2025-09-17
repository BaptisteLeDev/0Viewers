import React from 'react';
import { Link } from 'react-router-dom';
import StreamerCard from '../components/streamers/StreamerCard';
import Loading from '../components/common/Loading';
import { useTwitchStreams } from '../hooks/useTwitchStreams';
import { ROUTES } from '../utils/constants';
import './Home.css';

const Home = () => {
  const { randomStream, loading, error, refreshRandomStream } = useTwitchStreams();

  if (loading) {
    return <Loading message="Recherche d'un streamer à découvrir..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Oops ! 😅</h2>
        <p>Impossible de charger les streamers pour le moment.</p>
        <button onClick={refreshRandomStream} className="retry-btn">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1 className="hero-title">
          Découvrez les <span className="highlight">vrais talents</span>
        </h1>
        <p className="hero-subtitle">
          Des streamers passionnés qui méritent votre attention, 
          même s'ils n'ont pas encore trouvé leur public.
        </p>
      </section>

      <section className="featured-streamer">
        <h2 className="section-title">
          🎯 Streamer du moment
        </h2>
        
        {randomStream ? (
          <div className="featured-content">
            <StreamerCard 
              stream={randomStream} 
              featured={true}
            />
            <div className="featured-actions">
              <button 
                onClick={refreshRandomStream}
                className="refresh-btn"
              >
                🎲 Découvrir un autre streamer
              </button>
              <Link to={ROUTES.STREAMERS} className="explore-btn">
                🔍 Voir tous les streamers
              </Link>
            </div>
          </div>
        ) : (
          <div className="no-streams">
            <p>Aucun streamer à 0 viewers en ce moment 🤔</p>
            <p>Revenez plus tard ou explorez notre liste complète !</p>
            <Link to={ROUTES.STREAMERS} className="explore-btn">
              Voir tous les streamers
            </Link>
          </div>
        )}
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">🎮</span>
            <h3>Nouveaux talents</h3>
            <p>Découvrez chaque jour de nouveaux streamers</p>
          </div>
          <div className="stat-card">
            <span className="stat-number">❤️</span>
            <h3>Communauté</h3>
            <p>Aidez les petits streamers à grandir</p>
          </div>
          <div className="stat-card">
            <span className="stat-number">🚀</span>
            <h3>En direct</h3>
            <p>Tous les streams sont en live actuellement</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;