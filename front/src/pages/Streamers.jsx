import React, { useState } from 'react';
import ZeroViewersStreamerCard from '../components/streamers/ZeroViewersStreamerCard';
import Loading from '../components/common/Loading';
import { useZeroViewersStreamers } from '../hooks/useZeroViewersStreamers';
import './Streamers.css';
import './Home.css'; // Pour utiliser les styles hero-card
import '../components/streamers/StreamerList.css';

const Streamers = () => {
  const { streamers, loading, error, refresh, lastUpdated } = useZeroViewersStreamers();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(6); // Nombre de streamers à afficher

  // Filtrage des streamers
  const filteredStreamers = streamers.filter(streamer => {
    const matchesSearch = streamer.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         streamer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         streamer.game_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'zero') return matchesSearch && streamer.viewer_count === 0;
    if (filter === 'recent') {
      const startTime = new Date(streamer.started_at);
      const now = new Date();
      const diffHours = (now - startTime) / (1000 * 60 * 60);
      return matchesSearch && diffHours <= 2; // Streams commencés il y a moins de 2h
    }
    
    return matchesSearch;
  });

  // Streamers à afficher avec pagination
  const displayedStreamers = filteredStreamers.slice(0, displayCount);
  const hasMore = filteredStreamers.length > displayCount;

  // Fonction pour charger plus de streamers
  const loadMore = () => {
    setDisplayCount(prev => prev + 3);
  };

  // Reset du nombre d'affichage quand on change de filtre/recherche
  const resetDisplay = () => {
    setDisplayCount(6);
  };

  if (loading) {
    return <Loading message="Chargement des streamers français..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Erreur de chargement 😞</h2>
        <p>Impossible de récupérer la liste des streamers français.</p>
        <p className="error-detail">{error}</p>
        <button onClick={refresh} className="btn-style">
          Réessayer
        </button>
      </div>
    );
  }

  const zeroViewersCount = streamers.filter(s => s.viewer_count === 0).length;

  return (
    <div className="streamers-page">
      {/* Hero Section similaire à Home */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-card">
            <h1 className="hero-title">
              🇫🇷 Streamers <span className="highlight">français à découvrir</span>
            </h1>
            <p className="hero-subtitle">
              Découvrez {streamers.length} streamers français en live qui méritent votre attention
            </p>
            {lastUpdated && (
              <p className="last-updated">
                Dernière mise à jour: {lastUpdated.toLocaleTimeString('fr-FR')} <br />
                Affichage de {displayedStreamers.length} sur {filteredStreamers.length} streamers trouvés
              </p>
                      

            )}
            
            {/* Section recherche et refresh */}
            <div className="search-section">
              <button onClick={refresh} className="btn-style">
                🔄 Actualiser
              </button>
            </div>
                      <div className="results-info">
      </div>
          </div>

        </div>
      </section>


      {filteredStreamers.length > 0 ? (
        <>
          <div className="streamers-grid">
            {displayedStreamers.map((streamer) => (
              <ZeroViewersStreamerCard 
                key={streamer.id} 
                streamer={streamer}
                showEmbed={false} // Pas d'embed sur la liste pour les performances
              />
            ))}
          </div>
          
          {/* Bouton Voir plus */}
          {hasMore && (
            <div className="load-more-section">
              <button onClick={loadMore} className="btn-style">
                🔍 Voir 3 streamers de plus
              </button>
              <p className="load-more-info">
                {filteredStreamers.length - displayCount} streamers restants
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="no-results">
          <h3>Aucun streamer trouvé 🤷‍♂️</h3>
          <p>Essayez de modifier vos critères de recherche ou revenez plus tard.</p>
        </div>
      )}
    </div>
  );
};

export default Streamers;