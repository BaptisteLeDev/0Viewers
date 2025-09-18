import React, { useState } from 'react';
import ZeroViewersStreamerCard from '../components/streamers/ZeroViewersStreamerCard';
import Loading from '../components/common/Loading';
import { useZeroViewersStreamers } from '../hooks/useZeroViewersStreamers';
import './Streamers.css';
import '../components/streamers/StreamerList.css';

const Streamers = () => {
  const { streamers, loading, error, refresh, lastUpdated } = useZeroViewersStreamers();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  if (loading) {
    return <Loading message="Chargement des streamers français..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Erreur de chargement 😞</h2>
        <p>Impossible de récupérer la liste des streamers français.</p>
        <p className="error-detail">{error}</p>
        <button onClick={refresh} className="retry-btn">
          Réessayer
        </button>
      </div>
    );
  }

  const zeroViewersCount = streamers.filter(s => s.viewer_count === 0).length;

  return (
    <div className="streamers-page">
      <header className="page-header">
        <h1>🇫🇷 Streamers français à découvrir</h1>
        <p>Découvrez {streamers.length} streamers français en live qui méritent votre attention</p>
        {lastUpdated && (
          <p className="last-updated">
            Dernière mise à jour: {lastUpdated.toLocaleTimeString('fr-FR')}
          </p>
        )}
      </header>

      <div className="filters-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher par nom, jeu ou titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <button onClick={refresh} className="refresh-btn">
          🔄 Actualiser
        </button>
      </div>

      <div className="results-info">
        <p>{filteredStreamers.length} streamers trouvés</p>
      </div>

      {filteredStreamers.length > 0 ? (
        <div className="streamers-grid">
          {filteredStreamers.map((streamer) => (
            <ZeroViewersStreamerCard 
              key={streamer.id} 
              streamer={streamer}
              showEmbed={false}
            />
          ))}
        </div>
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